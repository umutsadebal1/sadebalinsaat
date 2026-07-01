"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import type { Project, Tour3DConfig, FloorUnit, UnitAvailability } from "@/lib/projects";
import { orderedFloorUnits, unitAvailability, isUnitOnFloor } from "@/lib/projects";
import { useT } from "./LocaleProvider";

/**
 * Stylised city environment around the real Sadebal Citylife .glb model.
 * The satellite ground is gone — instead a terrain + road grid + procedural
 * building blocks + a mountain range give a "real city" feel. The main model
 * sits at the world origin; the WEST (entrance) view corridor is kept clear.
 *
 * Axis ↔ compass convention (representational, Citylife-specific):
 *   −X = WEST (entrance / SADEBAL façade),  +X = EAST
 *   −Z = NORTH,                             +Z = SOUTH
 */
const CITYLIFE_SLUG = "sadebal-citylife";

const PETROL = "#0F3D3E";
const TERRAIN = "#767c63";
const ASPHALT = "#33353a";
const ROAD_LINE = "#c9be9a";
const PAVE = "#9c968a";
const PHONE = "905324618398";

const GROUND_SIZE = 320;

/** Auto-fit target height (world units) when no modelScale is provided. */
const TARGET_HEIGHT = 14;
/** Unit grid covers the lower portion of the model (roof/plant clutter clear). */
const BODY_FRACTION = 0.99;

/** Initial camera (south-west, looking north-east at the entrance façade). */
const CAM_XZ: [number, number] = [-30, 34];
const TGT_XZ: [number, number] = [0, 0];

/** Availability → colour + i18n label key (status stored in Turkish in data). */
const STATUS_TR: Record<UnitAvailability, { color: string; key: string }> = {
  Müsait: { color: "#22c55e", key: "tour.available" },
  Rezerve: { color: "#eab308", key: "tour.reserved" },
  Satıldı: { color: "#ef4444", key: "tour.sold" },
};

/** Emoji per room key (keys come from the floor-plan data). */
const ROOM_EMOJI: Record<string, string> = {
  salon: "🛋️",
  oturmaOdasi: "🪑",
  yatakOdasi: "🛏️",
  cocukOdasi: "🧸",
  mutfak: "🍳",
  antre: "🚪",
  geceHolu: "🌙",
  banyo: "🛁",
  wc: "🚽",
  dus: "🚿",
  balkon: "🌿",
  kiler: "📦",
};

/** Turkish façade direction → i18n key. */
const FACADE_KEY: Record<string, string> = {
  batı: "tour.dir.west",
  kuzey: "tour.dir.north",
  doğu: "tour.dir.east",
  güney: "tour.dir.south",
};

function waLink(projectTitle: string, floor: number, unit: FloorUnit) {
  const msg = `Merhaba, ${projectTitle} Kat ${floor} Daire ${unit.id} (${unit.type}, ${unit.netM2}m²) hakkında bilgi almak istiyorum.`;
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
}

/* ------------------------------------------------------------------ helpers */

/** Small deterministic PRNG so the generated city is stable across renders. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 255) + amt * 255);
  const g = clamp(((n >> 8) & 255) + amt * 255);
  const b = clamp((n & 255) + amt * 255);
  return `rgb(${r},${g},${b})`;
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

/** 6-material array for a box: textured sides, plain (slightly darker) roof. */
function sixMaterials(base: string, windowTint: string, rows: number) {
  const tex = facadeTexture(base, windowTint, rows);
  const side = new THREE.MeshStandardMaterial({
    map: tex ?? undefined,
    color: tex ? "#ffffff" : base,
    roughness: 0.92,
    metalness: 0,
  });
  const roof = new THREE.MeshStandardMaterial({
    color: shade(base, -0.12),
    roughness: 0.95,
    metalness: 0,
  });
  // face order: +x, −x, +y(top), −y(bottom), +z, −z  (same instances reused)
  const mats = [side, side, roof, roof, side, side];
  const dispose = () => {
    tex?.dispose();
    side.dispose();
    roof.dispose();
  };
  return { mats, dispose };
}

/* --------------------------------------------------------- city view corridor */

const _fdx = TGT_XZ[0] - CAM_XZ[0];
const _fdz = TGT_XZ[1] - CAM_XZ[1];
const _flen = Math.hypot(_fdx, _fdz) || 1;
const FWD: [number, number] = [_fdx / _flen, _fdz / _flen];
const CAM_TGT_LEN = _flen;

/** True if (x,z) sits inside the camera→building corridor (would occlude). */
function inViewCorridor(x: number, z: number, half: number) {
  const vx = x - CAM_XZ[0];
  const vz = z - CAM_XZ[1];
  const along = vx * FWD[0] + vz * FWD[1];
  if (along < 0 || along > CAM_TGT_LEN + 8) return false;
  const perp = Math.abs(vx * FWD[1] - vz * FWD[0]);
  return perp < half;
}

/* --------------------------------------------------------------- environment */

function CityGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
      <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
      <meshStandardMaterial color={TERRAIN} roughness={1} />
    </mesh>
  );
}

type RoadDef = { x: number; z: number; w: number; l: number; dir: "ns" | "ew" };
const ROADS: RoadDef[] = [
  { x: -14, z: 0, w: 8, l: 170, dir: "ns" }, // front (west) avenue
  { x: 16, z: 0, w: 7, l: 170, dir: "ns" }, // east avenue
  { x: 0, z: 16, w: 170, l: 7, dir: "ew" }, // south street
  { x: 0, z: -16, w: 170, l: 7, dir: "ew" }, // north street
];

function Roads() {
  return (
    <group>
      {/* Plot pad under the main building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0.015, 0]} raycast={() => null}>
        <planeGeometry args={[22, 25]} />
        <meshStandardMaterial color={PAVE} roughness={1} />
      </mesh>
      {ROADS.map((r, i) => (
        <group key={i}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[r.x, 0.02, r.z]} raycast={() => null}>
            <planeGeometry args={[r.w, r.l]} />
            <meshStandardMaterial color={ASPHALT} roughness={1} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[r.x, 0.03, r.z]} raycast={() => null}>
            <planeGeometry args={r.dir === "ns" ? [0.35, r.l] : [r.w, 0.35]} />
            <meshStandardMaterial color={ROAD_LINE} roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const CITY_PALETTES: [string, string][] = [
  ["#C9C2B4", "#A69E8C"],
  ["#E4DECF", "#C3BAA4"],
  ["#B9B0A0", "#968C79"],
  ["#CBD0CE", "#A7AEAC"],
  ["#D8C7B0", "#B39C7E"],
  ["#C6B7B0", "#A08E85"],
];

type Bld = { x: number; z: number; w: number; d: number; h: number; pal: number };

function inPlot(x: number, z: number) {
  return Math.abs(x) < 15 && Math.abs(z) < 17;
}
function onRoad(x: number, z: number, half: number) {
  const near = (v: number, c: number, hw: number) => Math.abs(v - c) < hw + half;
  return near(x, -14, 4) || near(x, 16, 3.5) || near(z, 16, 3.5) || near(z, -16, 3.5);
}
function nearHero(x: number, z: number) {
  const pink = Math.abs(x) < 10 && Math.abs(z + 26) < 7; // north block
  const cream = Math.abs(x - 26) < 7 && Math.abs(z) < 10; // east block
  return pink || cream;
}

function generateCity(): Bld[] {
  const rnd = mulberry32(20260701);
  const out: Bld[] = [];
  const blocks = [
    { x0: 22, x1: 54, z0: -46, z1: 44, sp: 12 }, // EAST
    { x0: -34, x1: 20, z0: -50, z1: -24, sp: 12 }, // NORTH
    { x0: -54, x1: -22, z0: -46, z1: -6, sp: 12 }, // NORTHWEST
    { x0: 24, x1: 50, z0: 22, z1: 48, sp: 12 }, // SOUTHEAST
    { x0: -60, x1: -32, z0: -6, z1: 22, sp: 13 }, // WEST-FAR (across the front)
  ];
  for (const b of blocks) {
    for (let x = b.x0; x <= b.x1; x += b.sp) {
      for (let z = b.z0; z <= b.z1; z += b.sp) {
        const jx = x + (rnd() - 0.5) * 4;
        const jz = z + (rnd() - 0.5) * 4;
        const w = 5 + rnd() * 5;
        const d = 5 + rnd() * 5;
        const floors = 3 + Math.floor(rnd() * 12);
        const h = floors * 1.5 + rnd() * 2;
        const half = Math.max(w, d) / 2;
        if (inPlot(jx, jz) || onRoad(jx, jz, half) || nearHero(jx, jz)) continue;
        if (inViewCorridor(jx, jz, half + 7)) continue;
        out.push({ x: jx, z: jz, w, d, h, pal: Math.floor(rnd() * CITY_PALETTES.length) });
      }
    }
  }
  return out;
}

function CityBuildings() {
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const palettes = useMemo(() => CITY_PALETTES.map(([b, w]) => sixMaterials(b, w, 10)), []);
  const blds = useMemo(() => generateCity(), []);

  useEffect(
    () => () => {
      box.dispose();
      palettes.forEach((p) => p.dispose());
    },
    [box, palettes]
  );

  return (
    <group>
      {blds.map((b, i) => (
        <mesh
          key={i}
          geometry={box}
          material={palettes[b.pal].mats}
          position={[b.x, b.h / 2, b.z]}
          scale={[b.w, b.h, b.d]}
          raycast={() => null}
        />
      ))}
    </group>
  );
}

/** The two prominent neighbours the client asked for (fixed, non-overlapping). */
function HeroNeighbours() {
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const pink = useMemo(() => sixMaterials("#D4A5A5", "#B98686", 8), []);
  const cream = useMemo(() => sixMaterials("#E8E4DC", "#C7C0B1", 11), []);
  useEffect(
    () => () => {
      box.dispose();
      pink.dispose();
      cream.dispose();
    },
    [box, pink, cream]
  );
  return (
    <group>
      {/* NORTH — pink/salmon, ~8 floors, across the north street */}
      <mesh geometry={box} material={pink.mats} position={[0, 5.5, -26]} scale={[14, 11, 8]} raycast={() => null} />
      {/* EAST — light cream, taller ~11 floors, across the east avenue */}
      <mesh geometry={box} material={cream.mats} position={[26, 8, 1]} scale={[8, 16, 12]} raycast={() => null} />
    </group>
  );
}

type Mtn = { x: number; z: number; h: number; r: number; seg: number; c: string };
const MTN_COLORS = ["#4C5A3C", "#5B6B49", "#6B6350", "#556646", "#5f5847"];

function generateMountains(): Mtn[] {
  const rnd = mulberry32(4242);
  const out: Mtn[] = [];
  for (let i = 0; i < 18; i++) {
    const ang = (i / 18) * Math.PI * 2 + (rnd() - 0.5) * 0.35;
    const rad = 66 + rnd() * 40;
    out.push({
      x: Math.cos(ang) * rad,
      z: Math.sin(ang) * rad,
      h: 22 + rnd() * 34,
      r: 16 + rnd() * 22,
      seg: 5 + Math.floor(rnd() * 3),
      c: MTN_COLORS[Math.floor(rnd() * MTN_COLORS.length)],
    });
  }
  return out;
}

function Mountains() {
  const mts = useMemo(() => generateMountains(), []);
  return (
    <group>
      {mts.map((m, i) => (
        <mesh key={i} position={[m.x, m.h / 2 - 2.5, m.z]} raycast={() => null}>
          <coneGeometry args={[m.r, m.h, m.seg]} />
          <meshStandardMaterial color={m.c} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Trees() {
  const foliage = useMemo(() => new THREE.ConeGeometry(1, 2.4, 6), []);
  const trunk = useMemo(() => new THREE.CylinderGeometry(0.16, 0.22, 1, 5), []);
  const fMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#4e6b3e", roughness: 1, flatShading: true }), []);
  const tMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#6b4f35", roughness: 1 }), []);
  const spots = useMemo(() => {
    const rnd = mulberry32(909);
    const list: [number, number, number][] = [];
    // tree line in front of the entrance (short, non-blocking)
    for (let z = -11; z <= 12; z += 3.2) list.push([-9.2, z, 0.9 + rnd() * 0.5]);
    // a few scattered near the north/east blocks
    for (let i = 0; i < 10; i++) {
      const x = -8 + rnd() * 40;
      const z = -34 + rnd() * 14;
      if (!inPlot(x, z) && !onRoad(x, z, 1)) list.push([x, z, 0.9 + rnd() * 0.6]);
    }
    return list;
  }, []);
  useEffect(
    () => () => {
      foliage.dispose();
      trunk.dispose();
      fMat.dispose();
      tMat.dispose();
    },
    [foliage, trunk, fMat, tMat]
  );
  return (
    <group>
      {spots.map(([x, z, s], i) => (
        <group key={i} position={[x, 0, z]} scale={s} raycast={() => null}>
          <mesh geometry={trunk} material={tMat} position={[0, 0.5, 0]} raycast={() => null} />
          <mesh geometry={foliage} material={fMat} position={[0, 2.1, 0]} raycast={() => null} />
        </group>
      ))}
    </group>
  );
}

function CityEnvironment() {
  return (
    <group>
      <Roads />
      <CityBuildings />
      <HeroNeighbours />
      <Trees />
      <Mountains />
    </group>
  );
}

/* ----------------------------------------------------------------- the model */

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
  const { floorCount } = tour3D;
  // Real floor plan: units repeat on every floor, ordered left→right.
  const units = useMemo(
    () => (tour3D.floorUnits?.length ? orderedFloorUnits(tour3D.floorUnits) : []),
    [tour3D.floorUnits]
  );
  const N = units.length || tour3D.unitsPerFloor;

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

  // Reserve the base for commercial/shop floors so the residential grid starts
  // above them; each physical floor shares the usable (BODY_FRACTION) height.
  const commercialFloors = tour3D.commercialFloors ?? 0;
  const slots = floorCount + commercialFloors;
  const floorH = (model.height * BODY_FRACTION) / Math.max(1, slots);
  const floorY = (f: number) => (commercialFloors + f) * floorH + floorH / 2;
  const rotY = tour3D.modelRotationY ?? 0;
  const pos = tour3D.modelPosition ?? { x: 0, y: 0, z: 0 };
  const floors = Array.from({ length: floorCount }, (_, i) => i);
  const unitX = (u: number) => -model.w / 2 + (u + 0.5) * (model.w / N);

  return (
    <group
      position={[center[0] + pos.x, pos.y, center[1] + pos.z]}
      onPointerMissed={() => setSel(null)}
    >
      <group rotation={[0, rotY, 0]}>
        <group scale={model.scale}>
          <primitive object={model.object} />
        </group>

        {/* All units always visible — coloured by real availability data */}
        {floors.map((f) =>
          Array.from({ length: N }, (_, u) => {
            const y = floorY(f);
            const unit = units[u];
            // Penthouse: on the top floor only the central units exist.
            if (unit && !isUnitOnFloor(tour3D, f, unit.id)) return null;
            const status = unit ? unitAvailability(tour3D, f + 1, unit.id) : "Müsait";
            const sc = STATUS_TR[status].color;
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
                <boxGeometry args={[(model.w / N) * 0.9, floorH * 0.72, model.d * 1.04]} />
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

        {/* Info card for the selected unit — real floor-plan data */}
        {sel &&
          units[sel.u] &&
          (() => {
            const unit = units[sel.u];
            const floor1 = sel.f + 1;
            const y = floorY(sel.f);
            const status = unitAvailability(tour3D, floor1, unit.id);
            const info = STATUS_TR[status];
            return (
              <Html
                position={[unitX(sel.u) + model.w / 2 + 0.4, y + 0.4, 0]}
                distanceFactor={16}
                style={{ pointerEvents: "auto" }}
              >
                <div className="w-60 rounded-lg border border-line bg-bg-card p-4 text-ink shadow-xl">
                  <p className="font-mono-label text-[10px] uppercase tracking-[0.12em] text-gold-700">
                    <bdi>
                      {t("tour.floor")} {floor1} · {t("tour.unit")} {unit.id}
                    </bdi>
                  </p>
                  <p className="mt-1 font-display text-lg">
                    <bdi>
                      {unit.type} · {unit.netM2} m²
                    </bdi>
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {t("tour.facade")}:{" "}
                    <bdi className="text-ink">{t(FACADE_KEY[unit.cephe] ?? unit.cephe)}</bdi>
                  </p>

                  <p className="mt-3 mb-1 font-mono-label text-[10px] uppercase tracking-[0.1em] text-ink-soft">
                    {t("tour.roomsTitle")}
                  </p>
                  <ul className="max-h-44 space-y-0.5 overflow-y-auto pr-1">
                    {Object.entries(unit.rooms).map(([key, m2]) => (
                      <li
                        key={key}
                        className="flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="flex items-center gap-1.5 text-ink-soft">
                          <span aria-hidden>{ROOM_EMOJI[key] ?? "•"}</span>
                          {t(`tour.rooms.${key}`)}
                        </span>
                        <bdi className="tabular-nums text-ink">{m2} m²</bdi>
                      </li>
                    ))}
                  </ul>

                  {(() => {
                    const imgs = tour3D.unitGalleries?.[unit.type];
                    if (!imgs?.length) return null;
                    return (
                      <div className="mt-3">
                        <p className="mb-1.5 font-mono-label text-[10px] uppercase tracking-[0.1em] text-ink-soft">
                          {t("tour.gallery")}
                        </p>
                        <div className="space-y-1.5">
                          {imgs.map((src, i) => (
                            <a
                              key={i}
                              href={src}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block overflow-hidden rounded border border-line"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={src}
                                alt=""
                                className="max-h-56 w-full bg-bg-elevated object-contain transition-transform hover:scale-[1.02]"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-soft">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="font-medium text-ink">{t(info.key)}</span>
                  </p>
                  {status !== "Satıldı" && (
                    <a
                      href={waLink(projectTitle, floor1, unit)}
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
  const isCity = project.slug === CITYLIFE_SLUG;

  // Start fetching the model early.
  useEffect(() => {
    if (tour3D.modelUrl) useGLTF.preload(tour3D.modelUrl, true);
  }, [tour3D.modelUrl]);

  return (
    <>
      <Canvas
        camera={{ position: [CAM_XZ[0], 22, CAM_XZ[1]], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[PETROL]} />
        <fog attach="fog" args={[PETROL, 80, 215]} />
        <hemisphereLight args={["#dfe7e2", "#3a4a3a", 0.6]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[40, 50, 20]} intensity={1.5} />
        <directionalLight position={[-25, 18, -15]} intensity={0.35} />

        <CityGround />
        {isCity && <CityEnvironment />}

        <Suspense fallback={null}>
          {tour3D.modelUrl && (
            <BuildingModel tour3D={tour3D} projectTitle={project.title} center={[0, 0]} />
          )}
        </Suspense>

        <OrbitControls
          makeDefault
          target={[0, TARGET_HEIGHT / 2, 0]}
          enableDamping
          dampingFactor={0.08}
          minDistance={10}
          maxDistance={140}
          maxPolarAngle={Math.PI / 2.15}
        />
      </Canvas>
      <ModelLoadingOverlay />
    </>
  );
}
