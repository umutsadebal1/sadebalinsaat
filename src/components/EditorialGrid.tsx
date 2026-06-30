"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import type { Project, ProjectStatus } from "@/lib/projects";
import { deliveryLabel, projectSummary, statusKey } from "@/lib/projects";
import { useT } from "./LocaleProvider";

type FilterValue = "all" | ProjectStatus;
const FILTERS: { value: FilterValue; key: string }[] = [
  { value: "all", key: "filter.all" },
  { value: "Devam Eden", key: "status.ongoing" },
  { value: "Tamamlandı", key: "status.completed" },
];

// Repeating asymmetric layout. Each entry: large col-spans on lg (6-col grid)
// plus an aspect ratio so the editorial rhythm varies. Pattern fills cleanly
// every 4 cards (4+2 / 3+3).
const PATTERN = [
  { col: "lg:col-span-4 sm:col-span-2", aspect: "aspect-[16/10]", big: true },
  { col: "lg:col-span-2 sm:col-span-1", aspect: "aspect-[3/4]", big: false },
  { col: "lg:col-span-3 sm:col-span-1", aspect: "aspect-[4/3]", big: false },
  { col: "lg:col-span-3 sm:col-span-1", aspect: "aspect-[4/3]", big: false },
];

export default function EditorialGrid({ projects }: { projects: Project[] }) {
  const t = useT();
  const [active, setActive] = useState<FilterValue>("all");
  const filtered =
    active === "all" ? projects : projects.filter((p) => p.status === active);

  return (
    <div>
      <LayoutGroup>
        <div className="mb-10 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              aria-pressed={active === f.value}
              className={`relative cursor-pointer rounded-full border px-4 py-2 font-mono-label text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 ${
                active === f.value
                  ? "border-gold-600 text-petrol-900"
                  : "border-line text-ink-soft hover:border-gold-600 hover:text-ink"
              }`}
            >
              {active === f.value && (
                <motion.span
                  layoutId="editorial-filter-pill"
                  className="absolute inset-0 rounded-full bg-gold-600"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{t(f.key)}</span>
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid auto-rows-auto grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => {
                const pat = PATTERN[i % PATTERN.length];
                const delivery = deliveryLabel(p);
                return (
                  <motion.article
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className={pat.col}
                  >
                    <Link
                      href={`/portfoy/${p.slug}`}
                      className="group relative block h-full overflow-hidden rounded-sm border border-line bg-bg-card transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-600/50 hover:shadow-[0_22px_50px_-26px_rgba(20,33,31,0.6)]"
                    >
                      <div className={`relative ${pat.aspect} overflow-hidden`}>
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-petrol-900/80 via-petrol-900/10 to-transparent" />
                        <div className="absolute left-3 top-3 rounded-full bg-petrol-900/80 px-3 py-1 font-mono-label text-[10px] uppercase tracking-[0.1em] text-gold-200 backdrop-blur-sm">
                          {t(statusKey(p.status))}
                        </div>
                        {p.isRender && (
                          <div className="absolute right-3 top-3 rounded-full bg-bg-card/90 px-2.5 py-1 font-mono-label text-[9px] uppercase tracking-[0.08em] text-ink-soft backdrop-blur-sm">
                            {t("common.render3d")}
                          </div>
                        )}

                        {/* Title overlaid on the image bottom for editorial feel */}
                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-3">
                            <h3
                              className={`font-display text-balance text-[#F7F4ED] transition-colors duration-300 ${
                                pat.big ? "text-2xl sm:text-3xl" : "text-xl"
                              }`}
                            >
                              {p.title}
                            </h3>
                            <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[#F7F4ED]/70 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-400" />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                          {projectSummary(p)}
                        </p>
                        <p className="font-mono-label text-[11px] uppercase tracking-[0.08em] text-gold-700">
                          <bdi>{p.location} · {t(delivery.key)}: {delivery.value}</bdi>
                        </p>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <p className="py-16 text-center text-ink-soft">{t("portfolio.empty")}</p>
        )}
      </LayoutGroup>
    </div>
  );
}
