"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryItem } from "@/lib/projects";

const AUTO_MS = 4500;

export default function ProjectHeroSlider({
  images,
  title,
  status,
}: {
  images: GalleryItem[];
  title: string;
  status: string;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const paused = useRef(false);
  const dragX = useRef<number | null>(null);

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) return null;
  const current = images[index];

  return (
    <section
      className="relative h-[90svh] min-h-[480px] w-full overflow-hidden bg-petrol-900"
      onPointerDown={(e) => {
        dragX.current = e.clientX;
        paused.current = true;
      }}
      onPointerUp={(e) => {
        if (dragX.current !== null) {
          const delta = e.clientX - dragX.current;
          if (delta > 60) setIndex((i) => (i - 1 + count) % count);
          else if (delta < -60) setIndex((i) => (i + 1) % count);
        }
        dragX.current = null;
        paused.current = false;
      }}
    >
      <AnimatePresence>
        <motion.div
          key={current.src}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={current.src}
            alt={current.caption || title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/60 via-transparent to-petrol-900/30" />
        </motion.div>
      </AnimatePresence>

      {/* Subtle corner label — offset below the navbar, not plastered across the image */}
      <div className="absolute left-5 top-20 z-10 rounded-sm border border-[#F7F4ED]/20 bg-petrol-900/40 px-3.5 py-2 backdrop-blur-sm sm:left-8 sm:top-24">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-gold-300">
          {status}
        </p>
        <p className="font-display text-sm text-[#F7F4ED]">{title}</p>
      </div>

      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIndex(i)}
              aria-label={`Görsel ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-7 bg-gold-500" : "w-1.5 bg-[#F7F4ED]/40 hover:bg-[#F7F4ED]/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
