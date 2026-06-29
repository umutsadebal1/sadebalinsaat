"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Testimonial } from "@/lib/site-config";

const AUTO_MS = 6000;

export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const count = items?.length ?? 0;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) return null;
  const t = items[index];

  return (
    <div
      className="relative mx-auto max-w-3xl text-center"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <Quote className="mx-auto mb-6 h-9 w-9 text-gold-600/50" strokeWidth={1.5} />

      <div className="relative min-h-[200px] sm:min-h-[180px]">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-display text-xl leading-relaxed text-ink text-balance sm:text-2xl">
              “{t.quote}”
            </p>
            <footer className="mt-7 flex items-center justify-center gap-3">
              {t.photo ? (
                <span className="relative h-11 w-11 overflow-hidden rounded-full border border-line">
                  <Image src={t.photo} alt={t.name} fill className="object-cover" />
                </span>
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg-elevated font-display text-sm text-gold-700">
                  {t.name.charAt(0)}
                </span>
              )}
              <span className="text-left">
                <span className="block text-sm font-medium text-ink">{t.name}</span>
                {t.role && (
                  <span className="block font-mono-label text-[11px] uppercase tracking-[0.1em] text-gold-700">
                    {t.role}
                  </span>
                )}
              </span>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            aria-label="Önceki yorum"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-gold-600 hover:text-gold-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Yorum ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-gold-600" : "w-1.5 bg-line-strong hover:bg-gold-600/50"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setIndex((i) => (i + 1) % count)}
            aria-label="Sonraki yorum"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-gold-600 hover:text-gold-700"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
