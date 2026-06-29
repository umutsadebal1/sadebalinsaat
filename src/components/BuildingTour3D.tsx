"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import type { Tour3DConfig } from "@/lib/projects";

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
    pts.push(pts[0].clone()); // close the polygon
    return pts;
  }, [depth]);
  const top = useMemo(() => points.map((p) => new THREE.Vector3(p.x, 0.07, p.z)), [points]);

  // Thick faint gold glow + thin petrol-green line. Colours/widths are tunable.
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
  const [hoverFloor, setHoverFloor] = useState<number | null>(null);
  const [selFloor, setSelFloor] = useState<number | null>(null);
  const [selUnit, setSelUnit] = useState<number | null>(null);

  function setCursor(on: boolean) {
    document.body.style.cursor = on ? "pointer" : "auto";
  }
  useEffect(() => () => setCursor(false), []);

  const floors = Array.from({ length: floorCount }, (_, i) => i);

  return (
    <group
      position={[center[0], 0, center[1]]}
      onPointerMissed={() => {
        setSelFloor(null);
        setSelUnit(null);
      }}
    >
      {floors.map((f) => {
        const y = f * FLOOR_H + FLOOR_H / 2;
        const active = selFloor === f;
        const hovered = hoverFloor === f;
        return (
          <group key={f}>
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
              <boxGeometry args={[FOOT_W, FLOOR_H * 0.92, FOOT_D]} />
              <meshStandardMaterial
                color={active ? "#fdf8ee" : hovered ? "#f0ede6" : "#e6e3db"}
                emissive={active || hovered ? GOLD : "#000000"}
                emissiveIntensity={active ? 0.18 : hovered ? 0.08 : 0}
                roughness={0.85}
                metalness={0.05}
              />
            </mesh>
            {/* Gold facade strip at the top of each floor */}
            <mesh position={[0, y + FLOOR_H * 0.44, 0]}>
              <boxGeometry args={[FOOT_W * 1.02, FLOOR_H * 0.1, FOOT_D * 1.02]} />
              <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.5} />
            </mesh>

            {/* Units on the selected floor */}
            {active &&
              Array.from({ length: unitsPerFloor }, (_, u) => {
                const depthEach = (FOOT_D / unitsPerFloor) * 0.86;
                const uz = -FOOT_D / 2 + (u + 0.5) * (FOOT_D / unitsPerFloor);
                const uSel = selUnit === u;
                return (
                  <mesh
                    key={u}
                    position={[0, y, uz]}
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
                    <boxGeometry args={[FOOT_W * 1.06, FLOOR_H * 0.74, depthEach]} />
                    <meshStandardMaterial
                      color={uSel ? GOLD : "#9fb1ad"}
                      emissive={uSel ? GOLD : PETROL}
                      emissiveIntensity={uSel ? 0.35 : 0.12}
                      transparent
                      opacity={0.92}
                    />
                  </mesh>
                );
              })}

            {/* Info card for the selected unit */}
            {active &&
              selUnit !== null &&
              (() => {
                const uz = -FOOT_D / 2 + (selUnit + 0.5) * (FOOT_D / unitsPerFloor);
                const m2 = 85 + ((f + selUnit) % 4) * 12;
                return (
                  <Html
                    position={[FOOT_W / 2 + 0.4, y + 0.5, uz]}
                    distanceFactor={14}
                    style={{ pointerEvents: "auto" }}
                  >
                    <div className="w-52 rounded-lg border border-line bg-bg-card p-4 text-ink shadow-xl">
                      <p className="font-mono-label text-[10px] uppercase tracking-[0.12em] text-gold-700">
                        Kat {f + 1} · Daire {selUnit + 1}
                      </p>
                      <p className="mt-1 font-display text-lg">~{m2} m²</p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        Durum: <span className="text-gold-700">Müsait</span>
                      </p>
                      <a
                        href={waLink(projectTitle, f + 1, selUnit + 1)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#1ebe5b]"
                      >
                        WhatsApp ile Bilgi Al
                      </a>
                    </div>
                  </Html>
                );
              })()}
          </group>
        );
      })}
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
      <ambientLight intensity={0.7} />
      <directionalLight position={[20, 30, 15]} intensity={1.6} />
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
      <color attach="background" args={["#dfd9cf"]} />
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
