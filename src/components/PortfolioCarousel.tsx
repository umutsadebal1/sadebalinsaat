"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/projects";
import { deliveryLabel } from "@/lib/projects";

const AUTO_MS = 5500;

export default function PortfolioCarousel({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const count = projects.length;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paused = useRef(false);
  const dragX = useRef<number | null>(null);

  const go = useCallback(
    (next: number, direction: number) => {
      setDir(direction);
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  // Auto-advance, pausable on hover/drag.
  useEffect(() => {
    if (count <= 1) return;
    function schedule() {
      timer.current = setTimeout(() => {
        if (!paused.current) setIndex((i) => (i + 1) % count);
        schedule();
      }, AUTO_MS);
    }
    schedule();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [count]);

  if (count === 0) return null;
  const project = projects[index];
  const delivery = deliveryLabel(project);

  return (
    <div
      className="relative h-[64svh] min-h-[420px] w-full overflow-hidden rounded-sm border border-line bg-petrol-900 sm:h-[72svh]"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onPointerDown={(e) => {
        dragX.current = e.clientX;
        paused.current = true;
      }}
      onPointerUp={(e) => {
        if (dragX.current !== null) {
          const delta = e.clientX - dragX.current;
          if (delta > 60) go(index - 1, -1);
          else if (delta < -60) go(index + 1, 1);
        }
        dragX.current = null;
        paused.current = false;
      }}
    >
      <AnimatePresence custom={dir}>
        <motion.div
          key={project.slug}
          custom={dir}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-petrol-900 via-petrol-900/40 to-petrol-900/10" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-gold-600 px-3.5 py-1.5 font-mono-label text-[11px] uppercase tracking-[0.1em] text-petrol-900">
                  {project.status}
                </span>
                <span className="font-mono-label text-[11px] uppercase tracking-[0.12em] text-gold-200">
                  {project.location} · {delivery.label}: {delivery.value}
                </span>
              </div>
              <h2 className="font-display text-3xl text-[#F7F4ED] text-balance sm:text-4xl md:text-5xl">
                {project.title}
              </h2>
              <Link
                href={`/portfoy/${project.slug}`}
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#F7F4ED]/10 px-6 py-3 text-sm font-medium text-[#F7F4ED] backdrop-blur-sm transition-all duration-300 hover:bg-gold-600 hover:text-petrol-900"
              >
                Projeyi Gör
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <>
          <button
            onClick={() => go(index - 1, -1)}
            aria-label="Önceki proje"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#F7F4ED]/30 bg-petrol-900/30 text-[#F7F4ED] backdrop-blur-sm transition-colors hover:bg-petrol-900/60 sm:left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(index + 1, 1)}
            aria-label="Sonraki proje"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#F7F4ED]/30 bg-petrol-900/30 text-[#F7F4ED] backdrop-blur-sm transition-colors hover:bg-petrol-900/60 sm:right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-5 right-6 z-10 flex items-center gap-2 sm:bottom-7 sm:right-12">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => go(i, i > index ? 1 : -1)}
                aria-label={`${p.title} slaytına git`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-7 bg-gold-600" : "w-1.5 bg-[#F7F4ED]/40 hover:bg-[#F7F4ED]/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
