"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

/**
 * Time-driven image-sequence player. Unlike a scroll-bound sequence, this draws
 * frames from a `progress` MotionValue (0→1) that the parent animates over time
 * — so it plays back smoothly like a video, with no dependency on scrolling
 * (which is what caused the stutter on some phones).
 */
export default function HeroSequencePlayer({
  progress,
  frameCount,
  frameSrc,
  placeholderSrc,
  alt,
  onReady,
}: {
  progress: MotionValue<number>;
  frameCount: number;
  frameSrc: (index: number) => string;
  placeholderSrc: string;
  alt: string;
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);

  // Preload the compressed frames (decoding happens just ahead of playback).
  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const mark = () => {
      loaded += 1;
      if (!cancelled && loaded === frameCount) setReady(true);
    };
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= frameCount; i++) {
      const img = new window.Image();
      img.src = frameSrc(i);
      if (img.complete) mark();
      else {
        img.onload = mark;
        img.onerror = mark;
      }
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, [frameCount, frameSrc]);

  useEffect(() => {
    if (!ready) return;
    onReady?.();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const ctx2d = ctx;
    const canvasEl = canvas;

    let lastFrame = -1;
    const warmed = new Set<number>();
    function warm(index: number) {
      for (const j of [index + 1, index + 2, index + 3, index + 4, index + 5]) {
        const img = imagesRef.current[j];
        if (img && !warmed.has(j)) {
          warmed.add(j);
          img.decode?.().catch(() => warmed.delete(j));
        }
      }
    }

    function draw(index: number) {
      const img = imagesRef.current[index];
      if (!img || !img.naturalWidth || !canvasEl.width || !canvasEl.height) return;
      const canvasRatio = canvasEl.width / canvasEl.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      let dw: number, dh: number, ox = 0, oy = 0;
      if (imgRatio > canvasRatio) {
        dh = canvasEl.height;
        dw = dh * imgRatio;
        ox = (canvasEl.width - dw) / 2;
      } else {
        dw = canvasEl.width;
        dh = dw / imgRatio;
        oy = (canvasEl.height - dh) / 2;
      }
      ctx2d.drawImage(img, ox, oy, dw, dh);
    }

    function render(p: number) {
      const index = Math.min(frameCount - 1, Math.max(0, Math.floor(p * frameCount)));
      if (index !== lastFrame) {
        lastFrame = index;
        draw(index);
        warm(index);
      }
    }

    function size() {
      canvasEl.width = canvasEl.clientWidth;
      canvasEl.height = canvasEl.clientHeight;
      lastFrame = -1;
      render(progress.get());
    }

    size();
    warm(0); // pre-warm the opening frames so the first play is instant
    const unsub = progress.on("change", render);
    window.addEventListener("resize", size);
    return () => {
      unsub();
      window.removeEventListener("resize", size);
    };
  }, [ready, frameCount, progress, onReady]);

  return (
    <div className="relative h-full w-full">
      {!ready && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${placeholderSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          role="img"
          aria-label={alt}
        />
      )}
      <canvas ref={canvasRef} className="h-full w-full" aria-label={alt} />
    </div>
  );
}
