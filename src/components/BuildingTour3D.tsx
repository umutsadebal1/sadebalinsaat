"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import type { Tour3DConfig } from "@/lib/projects";
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
const DIRT_COLOR = "#8B7355"; // fallback when the satellite texture is missing
const PETROL = "#0F3D3E";
const GOLD = "#C9A24B";
const PHONE = "905324618398";

const FLOOR_H = 1.3;
const FOOT_W = 4.2; // building footprint width (x)
const FOOT_D = 5.0; // building footprint depth (z)

/** Availability status — göstermelik (demo). Renkler gerçek doluluk değil. */
type UnitStatus = "available" | "reserved" | "sold";
const STATUS: Record<UnitStatus, { color: string; labelKey: string }> = {
  available: { color: "#22c55e", labelKey: "tour.available" }, // yeşil
  reserved: { color: "#eab308", labelKey: "tour.reserved" }, // sarı
  sold: { color: "#ef4444", labelKey: "tour.sold" }, // kırmızı
};

/**
 * Deterministic demo status per unit. Alt katlar daha çok satılmış, üst katlar
 * daha müsait — gerçekçi bir dağılım için. (İleride gerçek veriyle değişecek.)
 */
function unitStatus(floor: number, unit: number, floorCount: number): UnitStatus {
  const h = (floor * 2654435761 + unit * 40503) >>> 0;
  const r = h % 100;
  const availabilityBoost = (floor / Math.max(1, floorCount - 1)) * 30;
  const score = r + availabilityBoost;
  if (score < 35) return "sold";
  if (score < 60) return "reserved";
  return "available";
}

/** Map a proportional image point to world XZ. `depth` keeps the satellite
 * un-stretched (plane depth = GROUND_W / imageAspect). */
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
      <meshStandardMaterial
        map={texture ?? undefined}
        color={texture ? "#ffffff" : DIRT_COLOR}
      />
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

function Building({
  config,
  projectTitle,
  center,
}: {
  config: Tour3DConfig;
  projectTitle: string;
  center: [number, number];
}) {
  const { floorCount, unitsPerFloor } = config;
  const t = useT();
  const [hover, setHover] = useState<{ f: number; u: number } | null>(null);
  const [sel, setSel] = useState<{ f: number; u: number } | null>(null);

  function setCursor(on: boolean) {
    document.body.style.cursor = on ? "pointer" : "auto";
  }
  useEffect(() => () => setCursor(false), []);

  const floors = Array.from({ length: floorCount }, (_, i) => i);
  const unitZ = (u: number) => -FOOT_D / 2 + (u + 0.5) * (FOOT_D / unitsPerFloor);

  return (
    <group position={[center[0], 0, center[1]]} onPointerMissed={() => setSel(null)}>
      {floors.map((f) => {
        const y = f * FLOOR_H + FLOOR_H / 2;
        return (
          <group key={f}>
            {/* Structural slab (neutral) */}
            <mesh position={[0, y, 0]}>
              <boxGeometry args={[FOOT_W * 0.95, FLOOR_H * 0.9, FOOT_D * 0.95]} />
              <meshStandardMaterial color="#e6e3db" roughness={0.85} metalness={0.05} />
            </mesh>
            {/* Gold facade strip */}
            <mesh position={[0, y + FLOOR_H * 0.44, 0]}>
              <boxGeometry args={[FOOT_W * 1.0, FLOOR_H * 0.08, FOOT_D * 1.0]} />
              <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.5} />
            </mesh>

            {/* ALL units, always visible — translucent, coloured by status */}
            {Array.from({ length: unitsPerFloor }, (_, u) => {
              const st = unitStatus(f, u, floorCount);
              const sc = STATUS[st].color;
              const isActive = (hover?.f === f && hover?.u === u) || (sel?.f === f && sel?.u === u);
              const depthEach = (FOOT_D / unitsPerFloor) * 0.82;
              return (
                <mesh
                  key={u}
                  position={[0, y, unitZ(u)]}
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    setHover({ f, u });
                    setCursor(true);
                  }}
                  onPointerOut={(e) => {
                    e.stopPropagation();
                    setHover((cur) => (cur?.f === f && cur?.u === u ? null : cur));
                    setCursor(false);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSel({ f, u });
                  }}
                >
                  <boxGeometry args={[FOOT_W * 1.05, FLOOR_H * 0.66, depthEach]} />
                  <meshStandardMaterial
                    color={sc}
                    emissive={sc}
                    emissiveIntensity={isActive ? 0.55 : 0.28}
                    transparent
                    opacity={isActive ? 0.92 : 0.5}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}

      {/* Info card for the selected unit */}
      {sel &&
        (() => {
          const y = sel.f * FLOOR_H + FLOOR_H / 2;
          const st = unitStatus(sel.f, sel.u, floorCount);
          const info = STATUS[st];
          const m2 = 85 + ((sel.f + sel.u) % 4) * 12;
          return (
            <Html
              position={[FOOT_W / 2 + 0.4, y + 0.5, unitZ(sel.u)]}
              distanceFactor={14}
              style={{ pointerEvents: "auto" }}
            >
              <div className="w-52 rounded-lg border border-line bg-bg-card p-4 text-ink shadow-xl">
                <p className="font-mono-label text-[10px] uppercase tracking-[0.12em] text-gold-700">
                  {t("tour.floor")} {sel.f + 1} · {t("tour.unit")} {sel.u + 1}
                </p>
                <p className="mt-1 font-display text-lg">~{m2} m²</p>
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
  );
}

function Scene({
  config,
  projectTitle,
  texture,
  depth,
  center,
}: {
  config: Tour3DConfig;
  projectTitle: string;
  texture: THREE.Texture | null;
  depth: number;
  center: [number, number];
}) {
  const buildingTop = config.floorCount * FLOOR_H;
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[20, 30, 15]} intensity={1.7} />
      <directionalLight position={[-15, 12, -10]} intensity={0.4} />

      <Ground texture={texture} depth={depth} />
      <Boundary depth={depth} />
      <Building config={config} projectTitle={projectTitle} center={center} />

      <OrbitControls
        makeDefault
        target={[center[0], buildingTop / 2, center[1]]}
        enableDamping
        dampingFactor={0.08}
        minDistance={8}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2.15}
      />
    </>
  );
}

export default function BuildingTour3D({
  config,
  projectTitle,
}: {
  config: Tour3DConfig;
  projectTitle: string;
}) {
  // Load the satellite once (outside the canvas) so we know its aspect ratio
  // and can size the ground plane without stretching. Missing file → square
  // plane + dirt colour fallback (no crash).
  const [scene, setScene] = useState<{ texture: THREE.Texture | null; depth: number } | null>(null);

  useEffect(() => {
    let active = true;
    const finish = (texture: THREE.Texture | null, aspect: number) => {
      if (active) setScene({ texture, depth: GROUND_W / aspect });
    };
    if (!config.satelliteImageUrl) {
      finish(null, 1);
      return;
    }
    new THREE.TextureLoader().load(
      config.satelliteImageUrl,
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
  }, [config.satelliteImageUrl]);

  if (!scene) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-bg-elevated">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-gold-600" />
      </div>
    );
  }

  const center = centroid(scene.depth);
  const buildingTop = config.floorCount * FLOOR_H;
  return (
    <Canvas
      camera={{ position: [center[0] + 20, buildingTop + 16, center[1] + 28], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#0F3D3E"]} />
      <Scene
        config={config}
        projectTitle={projectTitle}
        texture={scene.texture}
        depth={scene.depth}
        center={center}
      />
    </Canvas>
  );
}
