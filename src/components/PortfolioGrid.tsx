"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import type { Project, ProjectStatus } from "@/lib/projects";

const FILTERS: Array<ProjectStatus | "Tümü"> = ["Tümü", "Devam Eden", "Tamamlandı"];

export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<typeof FILTERS[number]>("Tümü");

  const filtered =
    active === "Tümü" ? projects : projects.filter((p) => p.status === active);

  return (
    <div>
      <LayoutGroup>
        <div className="flex flex-wrap items-center gap-2 mb-12">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              aria-pressed={active === f}
              className={`relative rounded-full border px-4 py-2 font-mono-label text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 cursor-pointer ${
                active === f
                  ? "border-gold-600 text-petrol-900"
                  : "border-line text-ink-soft hover:border-gold-600 hover:text-ink"
              }`}
            >
              {active === f && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-gold-600"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{f}</span>
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -12 }}
                  transition={{
                    duration: 0.5,
                    delay: (i % 6) * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={`/portfoy/${p.slug}`}
                    className="group block h-full overflow-hidden rounded-sm border border-line bg-bg-card transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-600/50 hover:shadow-[0_18px_40px_-22px_rgba(20,33,31,0.55)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-petrol-900/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="absolute top-3 left-3 rounded-full bg-petrol-900/80 px-3 py-1 font-mono-label text-[10px] uppercase tracking-[0.1em] text-gold-200 backdrop-blur-sm">
                        {p.status}
                      </div>
                      {p.isRender && (
                        <div className="absolute top-3 right-3 rounded-full bg-bg-card/90 px-2.5 py-1 font-mono-label text-[9px] uppercase tracking-[0.08em] text-ink-soft backdrop-blur-sm">
                          3D Görselleştirme
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="font-display text-lg text-ink transition-colors duration-300 group-hover:text-gold-700">
                          {p.title}
                        </h3>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-soft transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-700" />
                      </div>
                      <p className="text-sm text-ink-soft leading-relaxed mb-2 line-clamp-2">
                        {p.description}
                      </p>
                      <p className="font-mono-label text-[11px] uppercase tracking-[0.08em] text-gold-700">
                        {p.location} · {p.year}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <p className="text-center text-ink-soft py-16">Bu kategoride henüz proje yok.</p>
        )}
      </LayoutGroup>
    </div>
  );
}
