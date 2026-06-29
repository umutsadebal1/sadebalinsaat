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

const GROUND_SIZE = 60; // world units; square plane matched to the satellite image
const DIRT_COLOR = "#8B7355"; // fallback when the satellite texture is missing
const PETROL = "#0F3D3E";
const GOLD = "#C9A24B";
const PHONE = "905324618398";

const FLOOR_H = 1.3;
const FOOT_W = 4.4; // building footprint width (x)
const FOOT_D = 7.6; // building footprint depth (z)

/** Map a proportional image point to world XZ (consistent with the texture). */
function toWorld(px: number, py: number): [number, number] {
  return [(px - 0.5) * GROUND_SIZE, (py - 0.5) * GROUND_SIZE];
}

// Building sits at the centroid of the boundary.
const CENTER = (() => {
  const n = ARSA_BOUNDARY_POINTS.length;
  let sx = 0,
    sy = 0;
  for (const [px, py] of ARSA_BOUNDARY_POINTS) {
    sx += px;
    sy += py;
  }
  return toWorld(sx / n, sy / n);
})();
const CX = CENTER[0];
const CZ = CENTER[1];

function waLink(projectTitle: string, floor: number, unit: number) {
  const msg = `Merhaba, ${projectTitle} - Kat ${floor}, Daire ${unit} hakkında bilgi almak istiyorum.`;
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
}

function Ground({ satelliteUrl }: { satelliteUrl?: string }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!satelliteUrl) return;
    let active = true;
    // Imperative load so a missing file falls back silently to a flat colour
    // instead of throwing (which would crash the Suspense boundary).
    new THREE.TextureLoader().load(
      satelliteUrl,
      (tex) => {
        if (!active) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      () => {
        /* dosya yok → düz toprak rengi fallback */
      }
    );
    return () => {
      active = false;
    };
  }, [satelliteUrl]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
      <meshStandardMaterial
        map={texture ?? undefined}
        color={texture ? "#ffffff" : DIRT_COLOR}
      />
    </mesh>
  );
}

function Boundary() {
  const points = useMemo(() => {
    const pts = ARSA_BOUNDARY_POINTS.map(([px, py]) => {
      const [x, z] = toWorld(px, py);
      return new THREE.Vector3(x, 0.05, z);
    });
    pts.push(pts[0].clone()); // close the polygon
    return pts;
  }, []);
  const top = useMemo(() => points.map((p) => new THREE.Vector3(p.x, 0.07, p.z)), [points]);

  // Two stacked lines: a thick faint gold glow + a thin petrol-green line.
  // Colours/widths are intentionally easy to tune.
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
}: {
  config: Tour3DConfig;
  projectTitle: string;
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
      position={[CX, 0, CZ]}
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
            {/* Floor slab */}
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
                emissive={active ? GOLD : hovered ? GOLD : "#000000"}
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
                const depth = (FOOT_D / unitsPerFloor) * 0.86;
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
                    <boxGeometry args={[FOOT_W * 1.06, FLOOR_H * 0.74, depth]} />
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
                    occlude={false}
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

function Scene({ config, projectTitle }: { config: Tour3DConfig; projectTitle: string }) {
  const buildingTop = config.floorCount * FLOOR_H;
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[20, 30, 15]} intensity={1.6} />
      <directionalLight position={[-15, 12, -10]} intensity={0.4} />

      <Ground satelliteUrl={config.satelliteImageUrl} />
      <Boundary />
      <Building config={config} projectTitle={projectTitle} />

      <OrbitControls
        makeDefault
        target={[CX, buildingTop / 2, CZ]}
        enableDamping
        dampingFactor={0.08}
        minDistance={8}
        maxDistance={55}
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
  const buildingTop = config.floorCount * FLOOR_H;
  return (
    <Canvas
      camera={{ position: [CX + 20, buildingTop + 14, CZ + 26], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#dfd9cf"]} />
      <Scene config={config} projectTitle={projectTitle} />
    </Canvas>
  );
}
