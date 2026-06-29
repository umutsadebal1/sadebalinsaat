"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryItem } from "@/lib/projects";
import Reveal from "./Reveal";

/**
 * Full-width, stacked image flow — each image gets its own breathing room so
 * the visitor "walks through" the project by scrolling. Click opens a lightbox.
 */
export default function ProjectImageFlow({ images }: { images: GalleryItem[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (images.length === 0) return null;

  function prev() {
    setLightbox((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }
  function next() {
    setLightbox((i) => (i === null ? null : (i + 1) % images.length));
  }

  return (
    <div className="flex flex-col gap-12 md:gap-20">
      {images.map((img, i) => (
        <Reveal key={img.src} delay={(i % 3) * 80}>
          <figure>
            <button
              onClick={() => setLightbox(i)}
              className="group relative block w-full cursor-zoom-in overflow-hidden rounded-sm border border-line bg-bg-card"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.caption || `Görsel ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1100px"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                {img.isRender && (
                  <div className="absolute left-4 top-4 rounded-full bg-petrol-900/80 px-3 py-1 font-mono-label text-[9px] uppercase tracking-[0.08em] text-gold-200 backdrop-blur-sm">
                    3D Görselleştirme
                  </div>
                )}
              </div>
            </button>
            {img.caption && (
              <figcaption className="mt-3 font-mono-label text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                {img.caption}
              </figcaption>
            )}
          </figure>
        </Reveal>
      ))}

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-petrol-900/95 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              aria-label="Kapat"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#F7F4ED]/30 text-[#F7F4ED]"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Önceki"
              className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#F7F4ED]/30 text-[#F7F4ED] sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div
              className="relative aspect-[16/10] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={images[lightbox].src}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[lightbox].src}
                    alt={images[lightbox].caption || "Görsel"}
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
                next();
              }}
              aria-label="Sonraki"
              className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#F7F4ED]/30 text-[#F7F4ED] sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {images[lightbox].caption && (
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center font-mono-label text-[11px] uppercase tracking-[0.1em] text-[#F7F4ED]/80">
                {images[lightbox].caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
