"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Tour3DConfig } from "@/lib/projects";
import { useT } from "./LocaleProvider";

function LoadingState() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-petrol-900">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#F7F4ED]/20 border-t-gold-500" />
        <p className="font-mono-label text-[11px] uppercase tracking-[0.15em] text-[#F7F4ED]/70">
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
  { color: "#22c55e", key: "tour.available" },
  { color: "#eab308", key: "tour.reserved" },
  { color: "#ef4444", key: "tour.sold" },
];

export default function BuildingTourClient({
  config,
  projectTitle,
  projectSlug,
}: {
  config: Tour3DConfig;
  projectTitle: string;
  projectSlug: string;
}) {
  const t = useT();
  return (
    <div className="relative h-[78svh] min-h-[480px] w-full overflow-hidden rounded-sm border border-line bg-petrol-900">
      <BuildingTour3D config={config} projectTitle={projectTitle} />

      {/* Title overlay — top left */}
      <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-[#F7F4ED]/15 bg-petrol-900/55 px-4 py-2.5 backdrop-blur-sm">
        <p className="font-display text-lg text-[#F7F4ED] sm:text-xl">{projectTitle}</p>
        <p className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-gold-300">
          {t("tour.repLabel")}
        </p>
      </div>

      {/* Back to project — top right */}
      <Link
        href={`/portfoy/${projectSlug}`}
        className="group absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[#F7F4ED]/30 bg-petrol-900/40 px-4 py-2 text-xs font-medium text-[#F7F4ED] backdrop-blur-sm transition-colors duration-300 hover:border-[#F7F4ED]/70 hover:bg-petrol-900/60"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        {t("tour.backToProject")}
      </Link>

      {/* Colour legend — bottom left (kept clear of the title) */}
      <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-1.5 rounded-md border border-[#F7F4ED]/15 bg-petrol-900/55 px-3 py-2.5 backdrop-blur-sm">
        <span className="font-mono-label text-[10px] uppercase tracking-[0.12em] text-[#F7F4ED]/55">
          {t("tour.unitStatus")}
        </span>
        {LEGEND.map((l) => (
          <span key={l.key} className="flex items-center gap-2 text-xs text-[#F7F4ED]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />
            {t(l.key)}
          </span>
        ))}
        <span className="mt-0.5 text-[10px] text-[#F7F4ED]/45">{t("tour.representational")}</span>
      </div>
    </div>
  );
}
