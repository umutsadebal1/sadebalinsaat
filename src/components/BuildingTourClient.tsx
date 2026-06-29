"use client";

import dynamic from "next/dynamic";
import type { Tour3DConfig } from "@/lib/projects";

function LoadingState() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-bg-elevated">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-line border-t-gold-600" />
        <p className="font-mono-label text-[11px] uppercase tracking-[0.15em] text-ink-soft">
          3D sahne hazırlanıyor…
        </p>
      </div>
    </div>
  );
}

// Three.js is heavy and browser-only — load it on demand, never on the server.
const BuildingTour3D = dynamic(() => import("./BuildingTour3D"), {
  ssr: false,
  loading: () => <LoadingState />,
});

const LEGEND = [
  { color: "#22c55e", label: "Müsait" },
  { color: "#eab308", label: "Rezerve" },
  { color: "#ef4444", label: "Satıldı" },
];

export default function BuildingTourClient({
  config,
  projectTitle,
}: {
  config: Tour3DConfig;
  projectTitle: string;
}) {
  return (
    <div className="relative h-[78svh] min-h-[480px] w-full overflow-hidden rounded-sm border border-line bg-bg-elevated">
      <BuildingTour3D config={config} projectTitle={projectTitle} />

      {/* Colour legend */}
      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5 rounded-md border border-line bg-bg-card/85 px-3 py-2.5 backdrop-blur-sm">
        <span className="font-mono-label text-[10px] uppercase tracking-[0.12em] text-ink-soft">
          Daire Durumu
        </span>
        {LEGEND.map((l) => (
          <span key={l.label} className="flex items-center gap-2 text-xs text-ink">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />
            {l.label}
          </span>
        ))}
        <span className="mt-0.5 text-[10px] text-ink-soft">Temsilidir</span>
      </div>
    </div>
  );
}
