"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/projects";
import Reveal from "./Reveal";

export default function ProjectGallery({ project }: { project: Project }) {
  const images = [
    { src: project.image, caption: project.title, isRender: project.isRender },
    ...(project.gallery ?? []),
  ];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  function showPrev() {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }
  function showNext() {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <Reveal key={img.src} delay={(i % 6) * 90}>
            <button
              onClick={() => setLightboxIndex(i)}
              className="group relative block w-full overflow-hidden rounded-sm border border-line bg-bg-card text-left cursor-zoom-in transition-all duration-500 hover:-translate-y-1 hover:border-gold-600/50 hover:shadow-[0_16px_36px_-22px_rgba(20,33,31,0.55)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-petrol-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {img.isRender && (
                  <div className="absolute top-3 left-3 rounded-full bg-petrol-900/80 px-2.5 py-1 font-mono-label text-[9px] uppercase tracking-[0.08em] text-gold-200">
                    3D Görselleştirme
                  </div>
                )}
              </div>
              <p className="px-4 py-3 text-sm text-ink-soft">{img.caption}</p>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
      {lightboxIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-petrol-900/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Kapat"
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#F7F4ED]/30 text-[#F7F4ED]"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Önceki görsel"
            className="absolute left-3 sm:left-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#F7F4ED]/30 text-[#F7F4ED]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            className="relative w-full max-w-3xl aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={images[lightboxIndex].src}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={images[lightboxIndex].src}
                  alt={images[lightboxIndex].caption}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Sonraki görsel"
            className="absolute right-3 sm:right-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#F7F4ED]/30 text-[#F7F4ED]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center font-mono-label text-[11px] uppercase tracking-[0.1em] text-[#F7F4ED]/80">
            {images[lightboxIndex].caption}
          </p>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
