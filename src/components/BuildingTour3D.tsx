"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import type { Project, Tour3DConfig } from "@/lib/projects";
import { useT } from "./LocaleProvider";

/**
 * Approximate land-boundary as proportional (0–1) points in the satellite
 * image space (x = left→right, y = top→bottom).
 * TODO: gerçek ölçülerle / kadastro verisiyle ince ayar yapılabilir.
 */
const ARSA_BOUNDARY_POINTS: [number, number][] = [
  [0.5061, 0.2546],
  [0.6207, 0.2392],
  [0.6207, 0.3086],
  [0.6076, 0.4321],
  [0.5295, 0.4321],
  [0.5061, 0.3704],
];

const GROUND_W = 60; // world units along x; depth (z) derives from image aspect
const DIRT_COLOR = "#8B7355";
const PETROL = "#0F3D3E";
const GOLD = "#C9A24B";
const PHONE = "905324618398";

/**
 * Scene axis ↔ compass convention (representational, Citylife-specific):
 *   −X = WEST (entrance / SADEBAL façade),  +X = EAST
 *   −Z = NORTH,                             +Z = SOUTH
 * The camera starts at the SOUTH-WEST corner looking NORTH-EAST, so the WEST
 * (entrance) and SOUTH faces stay completely clear. Neighbour blocks only sit
 * on the NORTH and EAST sides — WEST and SOUTH are never obstructed.
 */
const CITYLIFE_SLUG = "sadebal-citylife";

/** Auto-fit target height (world units) when no modelScale is provided. */
const TARGET_HEIGHT = 14;

/**
 * Fraction of the model height covered by the unit grid. The bounding box
 * includes rooftop mechanical structures/parapets, so the residential grid is
 * kept to the lower portion and the roof clutter stays clear.
 */
const BODY_FRACTION = 0.72;

/** Availability status — göstermelik (demo). Renkler gerçek doluluk değil. */
type UnitStatus = "available" | "reserved" | "sold";
const STATUS: Record<UnitStatus, { color: string; labelKey: string }> = {
  available: { color: "#22c55e", labelKey: "tour.available" },
  reserved: { color: "#eab308", labelKey: "tour.reserved" },
  sold: { color: "#ef4444", labelKey: "tour.sold" },
};

function unitStatus(floor: number, unit: number, floorCount: number): UnitStatus {
  const h = (floor * 2654435761 + unit * 40503) >>> 0;
  const r = h % 100;
  const availabilityBoost = (floor / Math.max(1, floorCount - 1)) * 30;
  const score = r + availabilityBoost;
  if (score < 35) return "sold";
  if (score < 60) return "reserved";
  return "available";
}

function toWorld(px: number, py: number, depth: number): [number, number] {
  return [(px - 0.5) * GROUND_W, (py - 0.5) * depth];
}

function centroid(depth: number): [number, number] {
  const n = ARSA_BOUNDARY_POINTS.length;
  let sx = 0,
    sy = 0;
  for (const [px, py] of ARSA_BOUNDARY_POINTS) {
    sx += px;
    sy += py;
  }
  return toWorld(sx / n, sy / n, depth);
}

function waLink(projectTitle: string, floor: number, unit: number) {
  const msg = `Merhaba, ${projectTitle} - Kat ${floor}, Daire ${unit} hakkında bilgi almak istiyorum.`;
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
}

function Ground({ texture, depth }: { texture: THREE.Texture | null; depth: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[GROUND_W, depth]} />
      <meshStandardMaterial map={texture ?? undefined} color={texture ? "#ffffff" : DIRT_COLOR} />
    </mesh>
  );
}

function Boundary({ depth }: { depth: number }) {
  const points = useMemo(() => {
    const pts = ARSA_BOUNDARY_POINTS.map(([px, py]) => {
      const [x, z] = toWorld(px, py, depth);
      return new THREE.Vector3(x, 0.05, z);
    });
    pts.push(pts[0].clone());
    return pts;
  }, [depth]);
  const top = useMemo(() => points.map((p) => new THREE.Vector3(p.x, 0.07, p.z)), [points]);
  return (
    <group>
      <Line points={points} color={GOLD} lineWidth={8} transparent opacity={0.4} depthWrite={false} />
      <Line points={top} color={PETROL} lineWidth={2.5} depthWrite={false} />
    </group>
  );
}

/** Procedural façade texture: base colour + a subtle recessed-window grid. */
function facadeTexture(base: string, windowTint: string, rows: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const cols = 4;
  const padX = 7;
  const padY = 6;
  const cw = (canvas.width - padX * (cols + 1)) / cols;
  const ch = (canvas.height - padY * (rows + 1)) / rows;
  ctx.fillStyle = windowTint;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillRect(padX + c * (cw + padX), padY + r * (ch + padY), cw, ch);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * A simple, neutral apartment-block volume (BoxGeometry) used to suggest the
 * surrounding city fabric around the real model. Representational only — not a
 * detailed model. Sits on the ground (base at y=0), raycast disabled.
 */
function NeighborBuilding({
  groundXZ,
  size,
  color,
  windowTint,
  floors,
}: {
  groundXZ: [number, number];
  size: [number, number, number];
  color: string;
  windowTint: string;
  floors: number;
}) {
  const materials = useMemo(() => {
    const tex = facadeTexture(color, windowTint, floors);
    const side = new THREE.MeshStandardMaterial({
      map: tex ?? undefined,
      color: tex ? "#ffffff" : color,
      roughness: 0.92,
      metalness: 0,
    });
    const plain = new THREE.MeshStandardMaterial({ color, roughness: 0.95, metalness: 0 });
    // box face order: +x, −x, +y(top), −y(bottom), +z, −z
    return [side, side.clone(), plain, plain, side.clone(), side.clone()];
  }, [color, windowTint, floors]);

  useEffect(
    () => () => {
      materials.forEach((m) => {
        const map = (m as THREE.MeshStandardMaterial).map;
        if (map) map.dispose();
        m.dispose();
      });
    },
    [materials]
  );

  return (
    <mesh
      position={[groundXZ[0], size[1] / 2, groundXZ[1]]}
      material={materials}
      raycast={() => null}
    >
      <boxGeometry args={size} />
    </mesh>
  );
}

/**
 * Hard-coded neighbour fabric for Sadebal Citylife only. WEST (−X, entrance)
 * and SOUTH (+Z) stay empty; one block sits NORTH (−Z), one EAST (+X), both
 * outside the plot with a road gap, clamped to stay on the satellite ground.
 */
function CityNeighbors({ center, depth }: { center: [number, number]; depth: number }) {
  const halfW = GROUND_W / 2;
  const halfD = depth / 2;
  const margin = 1.5;
  const clampX = (x: number, ext: number) =>
    Math.max(-halfW + ext + margin, Math.min(halfW - ext - margin, x));
  const clampZ = (z: number, ext: number) =>
    Math.max(-halfD + ext + margin, Math.min(halfD - ext - margin, z));

  // NORTH (−Z): pink/salmon, ~8 floors, long along the E–W street.
  const nSize: [number, number, number] = [11, 10.4, 6];
  const nPos: [number, number] = [
    clampX(center[0] + 2.5, nSize[0] / 2),
    clampZ(center[1] - 15, nSize[2] / 2),
  ];
  // EAST (+X): light cream, taller ~11 floors, long along the N–S street.
  const eSize: [number, number, number] = [6, 15.4, 11];
  const ePos: [number, number] = [
    clampX(center[0] + 16, eSize[0] / 2),
    clampZ(center[1] + 1.5, eSize[2] / 2),
  ];

  return (
    <group>
      <NeighborBuilding
        groundXZ={nPos}
        size={nSize}
        color="#D4A5A5"
        windowTint="#B98686"
        floors={8}
      />
      <NeighborBuilding
        groundXZ={ePos}
        size={eSize}
        color="#E8E4DC"
        windowTint="#C7C0B1"
        floors={11}
      />
    </group>
  );
}

/**
 * Loads the project's .glb model and overlays a per-unit colour grid that hugs
 * the building façade — the real model geometry stays untouched (its raycast is
 * disabled), only the unit markers catch hover/click for the info card.
 */
function BuildingModel({
  tour3D,
  projectTitle,
  center,
}: {
  tour3D: Tour3DConfig;
  projectTitle: string;
  center: [number, number];
}) {
  const t = useT();
  const { scene } = useGLTF(tour3D.modelUrl!, true);
  const { floorCount, unitsPerFloor } = tour3D;

  // Clone (shares geometry/materials), center horizontally, sit base on y=0,
  // and disable raycasting on the model so only the unit markers catch events.
  const model = useMemo(() => {
    const object = scene.clone(true);
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const ctr = box.getCenter(new THREE.Vector3());
    object.position.set(-ctr.x, -box.min.y, -ctr.z);
    object.traverse((o) => {
      o.raycast = () => null;
    });
    const rawHeight = size.y || 1;
    const scale = tour3D.modelScale ?? TARGET_HEIGHT / rawHeight;
    return {
      object,
      scale,
      height: rawHeight * scale,
      w: (size.x || 1) * scale,
      d: (size.z || 1) * scale,
    };
  }, [scene, tour3D.modelScale]);

  const [sel, setSel] = useState<{ f: number; u: number } | null>(null);
  const [hover, setHover] = useState<{ f: number; u: number } | null>(null);

  function setCursor(on: boolean) {
    document.body.style.cursor = on ? "pointer" : "auto";
  }
  useEffect(() => () => setCursor(false), []);

  const floorH = (model.height * BODY_FRACTION) / Math.max(1, floorCount);
  const rotY = tour3D.modelRotationY ?? 0;
  const pos = tour3D.modelPosition ?? { x: 0, y: 0, z: 0 };
  const floors = Array.from({ length: floorCount }, (_, i) => i);
  const unitX = (u: number) => -model.w / 2 + (u + 0.5) * (model.w / unitsPerFloor);

  return (
    <group
      position={[center[0] + pos.x, pos.y, center[1] + pos.z]}
      onPointerMissed={() => setSel(null)}
    >
      <group rotation={[0, rotY, 0]}>
        <group scale={model.scale}>
          <primitive object={model.object} />
        </group>

        {/* All units always visible — göstermelik doluluk, hugging the façade */}
        {floors.map((f) =>
          Array.from({ length: unitsPerFloor }, (_, u) => {
            const y = f * floorH + floorH / 2;
            const st = unitStatus(f, u, floorCount);
            const sc = STATUS[st].color;
            const isSel = sel?.f === f && sel?.u === u;
            const isHover = hover?.f === f && hover?.u === u;
            return (
              <mesh
                key={`${f}-${u}`}
                position={[unitX(u), y, 0]}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHover({ f, u });
                  setCursor(true);
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  setHover((c) => (c && c.f === f && c.u === u ? null : c));
                  setCursor(false);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSel({ f, u });
                }}
              >
                <boxGeometry
                  args={[(model.w / unitsPerFloor) * 0.9, floorH * 0.72, model.d * 1.04]}
                />
                <meshStandardMaterial
                  color={sc}
                  emissive={sc}
                  emissiveIntensity={isSel ? 0.5 : isHover ? 0.38 : 0.16}
                  transparent
                  opacity={isSel ? 0.8 : isHover ? 0.44 : 0.24}
                  depthWrite={false}
                />
              </mesh>
            );
          })
        )}

        {/* Info card for the selected unit */}
        {sel &&
          (() => {
            const y = sel.f * floorH + floorH / 2;
            const st = unitStatus(sel.f, sel.u, floorCount);
            const info = STATUS[st];
            const m2 = 85 + ((sel.f + sel.u) % 4) * 12;
            return (
              <Html
                position={[unitX(sel.u) + model.w / 2 + 0.4, y + 0.4, 0]}
                distanceFactor={16}
                style={{ pointerEvents: "auto" }}
              >
                <div className="w-52 rounded-lg border border-line bg-bg-card p-4 text-ink shadow-xl">
                  <p className="font-mono-label text-[10px] uppercase tracking-[0.12em] text-gold-700">
                    <bdi>
                      {t("tour.floor")} {sel.f + 1} · {t("tour.unit")} {sel.u + 1}
                    </bdi>
                  </p>
                  <p className="mt-1 font-display text-lg">
                    <bdi>~{m2} m²</bdi>
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: info.color }}
                    />
                    {t("tour.statusLabel")}:{" "}
                    <span className="font-medium text-ink">{t(info.labelKey)}</span>
                  </p>
                  {st !== "sold" && (
                    <a
                      href={waLink(projectTitle, sel.f + 1, sel.u + 1)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#1ebe5b]"
                    >
                      {t("tour.whatsapp")}
                    </a>
                  )}
                </div>
              </Html>
            );
          })()}
      </group>
    </group>
  );
}

function ModelLoadingOverlay() {
  const t = useT();
  const { active, progress, loaded, total } = useProgress();
  if (!active) return null;
  const mb =
    total > 0
      ? `${(loaded / 1048576).toFixed(1)} / ${(total / 1048576).toFixed(1)} MB`
      : null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-petrol-900">
      <div className="w-64 text-center">
        <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-[#F7F4ED]/15">
          <div
            className="h-full rounded-full bg-gold-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="font-mono-label text-[11px] uppercase tracking-[0.15em] text-[#F7F4ED]/80">
          {t("tour.modelLoading")} {Math.round(progress)}%
        </p>
        {mb && <p className="mt-1 text-[10px] text-[#F7F4ED]/50">{mb}</p>}
      </div>
    </div>
  );
}

export default function BuildingTour3D({ project }: { project: Project }) {
  const tour3D = project.tour3D!;
  const [scene, setScene] = useState<{ texture: THREE.Texture | null; depth: number } | null>(null);

  // Start fetching the model early (in parallel with the satellite).
  useEffect(() => {
    if (tour3D.modelUrl) useGLTF.preload(tour3D.modelUrl, true);
  }, [tour3D.modelUrl]);

  useEffect(() => {
    let active = true;
    const finish = (texture: THREE.Texture | null, aspect: number) => {
      if (active) setScene({ texture, depth: GROUND_W / aspect });
    };
    if (!tour3D.satelliteImageUrl) {
      finish(null, 1);
      return;
    }
    new THREE.TextureLoader().load(
      tour3D.satelliteImageUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const img = tex.image as { width?: number; height?: number } | undefined;
        const aspect = img?.width && img?.height ? img.width / img.height : 1;
        finish(tex, aspect);
      },
      undefined,
      () => finish(null, 1)
    );
    return () => {
      active = false;
    };
  }, [tour3D.satelliteImageUrl]);

  if (!scene) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-petrol-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F7F4ED]/20 border-t-gold-500" />
      </div>
    );
  }

  const center = centroid(scene.depth);
  return (
    <>
      <Canvas
        // Start at the SOUTH-WEST corner looking NORTH-EAST: the WEST (entrance)
        // and SOUTH faces stay clear, neighbours peek from behind on N/E.
        camera={{ position: [center[0] - 22, TARGET_HEIGHT + 15, center[1] + 26], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0F3D3E"]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[20, 30, 15]} intensity={1.7} />
        <directionalLight position={[-15, 12, -10]} intensity={0.4} />

        <Ground texture={scene.texture} depth={scene.depth} />
        <Boundary depth={scene.depth} />
        {project.slug === CITYLIFE_SLUG && (
          <CityNeighbors center={center} depth={scene.depth} />
        )}

        <Suspense fallback={null}>
          {tour3D.modelUrl && (
            <BuildingModel tour3D={tour3D} projectTitle={project.title} center={center} />
          )}
        </Suspense>

        <OrbitControls
          makeDefault
          target={[center[0], TARGET_HEIGHT / 2, center[1]]}
          enableDamping
          dampingFactor={0.08}
          minDistance={8}
          maxDistance={70}
          maxPolarAngle={Math.PI / 2.15}
        />
      </Canvas>
      <ModelLoadingOverlay />
    </>
  );
}
