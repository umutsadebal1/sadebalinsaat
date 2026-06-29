"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import type { ConstructionStage } from "@/lib/projects";

export default function ConstructionProgress({
  stages,
}: {
  stages: ConstructionStage[];
}) {
  if (!stages || stages.length === 0) return null;

  return (
    <div className="rounded-sm border border-line bg-bg-card p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-500 opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-600" />
        </span>
        <p className="font-mono-label text-[11px] uppercase tracking-[0.15em] text-gold-700">
          Canlı Şantiye Durumu
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {stages.map((s, i) => {
          const pct = Math.max(0, Math.min(100, s.percent));
          return (
            <div key={`${s.stage}-${i}`}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Activity className="h-3.5 w-3.5 text-gold-600" strokeWidth={2} />
                  {s.stage}
                </span>
                <span className="font-mono-label text-[13px] tabular-nums text-gold-700">
                  %{pct}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-bg-elevated">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 1.1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-gold-700 to-gold-400"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
