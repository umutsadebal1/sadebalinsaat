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

/** Auto-fit target height (world units) when no modelScale is provided. */
const TARGET_HEIGHT = 14;

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

/**
 * Loads the project's .glb model and overlays invisible per-floor "hit boxes"
 * for hover/click — the real model geometry stays untouched, only a raycast
 * layer is added on top of it for floor → unit → info-card interactivity.
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
  // and disable raycasting on the model so only the hit boxes catch events.
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

  const [hoverFloor, setHoverFloor] = useState<number | null>(null);
  const [selFloor, setSelFloor] = useState<number | null>(null);
  const [selUnit, setSelUnit] = useState<number | null>(null);

  function setCursor(on: boolean) {
    document.body.style.cursor = on ? "pointer" : "auto";
  }
  useEffect(() => () => setCursor(false), []);

  const floorH = model.height / Math.max(1, floorCount);
  const rotY = tour3D.modelRotationY ?? 0;
  const pos = tour3D.modelPosition ?? { x: 0, y: 0, z: 0 };
  const floors = Array.from({ length: floorCount }, (_, i) => i);
  const unitX = (u: number) => -model.w / 2 + (u + 0.5) * (model.w / unitsPerFloor);

  return (
    <group
      position={[center[0] + pos.x, pos.y, center[1] + pos.z]}
      onPointerMissed={() => {
        setSelFloor(null);
        setSelUnit(null);
      }}
    >
      <group rotation={[0, rotY, 0]}>
        <group scale={model.scale}>
          <primitive object={model.object} />
        </group>

        {floors.map((f) => {
          const y = f * floorH + floorH / 2;
          const active = selFloor === f;
          const hovered = hoverFloor === f;
          return (
            <group key={f}>
              {/* Invisible per-floor hit box (slight gold tint on hover/select) */}
              <mesh
                position={[0, y, 0]}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoverFloor(f);
                  setCursor(true);
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  setHoverFloor((cur) => (cur === f ? null : cur));
                  setCursor(false);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelFloor(f);
                  setSelUnit(null);
                }}
              >
                <boxGeometry args={[model.w * 1.04, floorH * 0.96, model.d * 1.04]} />
                <meshBasicMaterial
                  transparent
                  opacity={active ? 0.16 : hovered ? 0.09 : 0}
                  color={GOLD}
                  depthWrite={false}
                />
              </mesh>

              {/* Units of the selected floor — coloured by status */}
              {active &&
                Array.from({ length: unitsPerFloor }, (_, u) => {
                  const st = unitStatus(f, u, floorCount);
                  const sc = STATUS[st].color;
                  const uSel = selUnit === u;
                  return (
                    <mesh
                      key={u}
                      position={[unitX(u), y, 0]}
                      onPointerOver={(e) => {
                        e.stopPropagation();
                        setCursor(true);
                      }}
                      onPointerOut={(e) => {
                        e.stopPropagation();
                        setCursor(false);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelUnit(u);
                      }}
                    >
                      <boxGeometry
                        args={[(model.w / unitsPerFloor) * 0.84, floorH * 0.7, model.d * 1.06]}
                      />
                      <meshStandardMaterial
                        color={sc}
                        emissive={sc}
                        emissiveIntensity={uSel ? 0.5 : 0.3}
                        transparent
                        opacity={uSel ? 0.88 : 0.55}
                        depthWrite={false}
                      />
                    </mesh>
                  );
                })}
            </group>
          );
        })}

        {/* Info card for the selected unit */}
        {selFloor !== null &&
          selUnit !== null &&
          (() => {
            const y = selFloor * floorH + floorH / 2;
            const st = unitStatus(selFloor, selUnit, floorCount);
            const info = STATUS[st];
            const m2 = 85 + ((selFloor + selUnit) % 4) * 12;
            return (
              <Html
                position={[unitX(selUnit) + model.w / 2 + 0.4, y + 0.4, 0]}
                distanceFactor={16}
                style={{ pointerEvents: "auto" }}
              >
                <div className="w-52 rounded-lg border border-line bg-bg-card p-4 text-ink shadow-xl">
                  <p className="font-mono-label text-[10px] uppercase tracking-[0.12em] text-gold-700">
                    <bdi>
                      {t("tour.floor")} {selFloor + 1} · {t("tour.unit")} {selUnit + 1}
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
                      href={waLink(projectTitle, selFloor + 1, selUnit + 1)}
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
        camera={{ position: [center[0] + 20, TARGET_HEIGHT + 16, center[1] + 28], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0F3D3E"]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[20, 30, 15]} intensity={1.7} />
        <directionalLight position={[-15, 12, -10]} intensity={0.4} />

        <Ground texture={scene.texture} depth={scene.depth} />
        <Boundary depth={scene.depth} />

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
