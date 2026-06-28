"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-bound image-sequence player.
 *
 * Usage: wrap this component in a tall "scroll track" section
 * (e.g. h-[280vh]) which itself contains a `sticky top-0 h-screen`
 * inner element that holds <ScrollSequence>. Pass a ref to the
 * OUTER tall section via `trackRef` so progress is measured across
 * the full scrollable distance, not just the sticky viewport.
 *
 * This avoids the stutter of scrubbing a real <video> tag and
 * works identically across all browsers.
 *
 * Until frames are supplied, `placeholderSrc` renders so the
 * hero still has a deliberate, on-brand visual instead of a
 * blank box.
 */
export default function ScrollSequence({
  frameCount,
  frameSrc,
  placeholderSrc,
  alt,
  trackRef,
}: {
  /** Total number of frames, e.g. 90 */
  frameCount?: number;
  /** Function returning the src for a given 1-indexed frame number */
  frameSrc?: (index: number) => string;
  placeholderSrc: string;
  alt: string;
  /** Ref to the outer tall scroll-track element (defaults to this component's own wrapper if omitted) */
  trackRef?: React.RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ownWrapperRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);
  const hasSequence = Boolean(frameCount && frameSrc);

  useEffect(() => {
    if (!hasSequence || !frameCount || !frameSrc) return;
    let cancelled = false;
    let loaded = 0;
    const markLoaded = () => {
      loaded += 1;
      if (!cancelled && loaded === frameCount) setReady(true);
    };
    // Hold only the compressed images (~90KB each). Decoding a frame to a
    // full 1080p bitmap costs ~8MB, so we never keep them all decoded —
    // the render loop decodes just ahead of the current frame instead.
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= frameCount; i++) {
      const img = new window.Image();
      img.src = frameSrc(i);
      if (img.complete) markLoaded();
      else {
        img.onload = markLoaded;
        img.onerror = markLoaded;
      }
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, [hasSequence, frameCount, frameSrc]);

  useEffect(() => {
    if (!ready || !hasSequence) return;
    const canvas = canvasRef.current;
    const track = trackRef?.current ?? ownWrapperRef.current;
    if (!canvas || !track) return;
    // alpha:false skips compositing transparency; cover-fit always paints
    // the whole canvas, so we never need clearRect between frames either.
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const ctx2d = ctx;
    const canvasEl = canvas;
    const trackEl = track;
    const count = frameCount!;

    let lastFrame = -1;
    let ticking = false;
    const warmed = new Set<number>();

    // Layout cached on mount/resize, NOT read per scroll frame. The hot path
    // uses window.scrollY (a cheap read) instead of getBoundingClientRect
    // (which forces a synchronous layout) — that forced layout every frame is
    // what janks slow, main-thread finger scrolling. A fast fling runs on the
    // compositor so it never showed the cost.
    let trackTop = 0;
    let scrollRange = 0;
    function measure() {
      const rect = trackEl.getBoundingClientRect();
      trackTop = rect.top + window.scrollY;
      scrollRange = rect.height - window.innerHeight;
    }

    // Decode a small window around the current frame off the critical path
    // so the next drawImage finds it ready instead of decoding inline.
    function warm(index: number) {
      for (const j of [index + 1, index + 2, index + 3, index - 1]) {
        const img = imagesRef.current[j];
        if (img && !warmed.has(j)) {
          warmed.add(j);
          img.decode?.().catch(() => warmed.delete(j));
        }
      }
    }

    function frameForScroll() {
      const scrolled = Math.min(Math.max(window.scrollY - trackTop, 0), scrollRange);
      const progress = scrollRange > 0 ? scrolled / scrollRange : 0;
      return Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
    }

    function drawFrame(index: number) {
      const img = imagesRef.current[index];
      if (!img || !img.naturalWidth || !canvasEl.width || !canvasEl.height) return;

      // object-fit: cover — preserve the frame's aspect ratio, crop
      // whatever overflows instead of stretching it to fill the canvas.
      const canvasRatio = canvasEl.width / canvasEl.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      let drawWidth: number;
      let drawHeight: number;
      let offsetX = 0;
      let offsetY = 0;
      if (imgRatio > canvasRatio) {
        drawHeight = canvasEl.height;
        drawWidth = drawHeight * imgRatio;
        offsetX = (canvasEl.width - drawWidth) / 2;
      } else {
        drawWidth = canvasEl.width;
        drawHeight = drawWidth / imgRatio;
        offsetY = (canvasEl.height - drawHeight) / 2;
      }
      ctx2d.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    // rAF-throttled: at most one redraw per frame, and only while actually
    // scrolling — when idle there is zero main-thread work, so it never
    // competes with the browser's own scrolling.
    function render() {
      ticking = false;
      const index = frameForScroll();
      if (index !== lastFrame) {
        lastFrame = index;
        drawFrame(index);
        warm(index);
      }
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(render);
      }
    }

    function sizeCanvas() {
      canvasEl.width = canvasEl.clientWidth;
      canvasEl.height = canvasEl.clientHeight;
      measure();
      lastFrame = -1;
      drawFrame(frameForScroll());
    }

    sizeCanvas();

    // Only listen for scroll while the hero is on screen.
    let listening = false;
    function startListening() {
      if (listening) return;
      listening = true;
      measure();
      window.addEventListener("scroll", onScroll, { passive: true });
      render();
    }
    function stopListening() {
      listening = false;
      window.removeEventListener("scroll", onScroll);
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startListening() : stopListening()),
      { threshold: 0 }
    );
    io.observe(trackEl);

    window.addEventListener("resize", sizeCanvas);
    return () => {
      stopListening();
      io.disconnect();
      window.removeEventListener("resize", sizeCanvas);
    };
  }, [ready, hasSequence, frameCount, trackRef]);

  if (!hasSequence) {
    // Deliberate placeholder: not a blank box, but the brand mark
    // staged the way the future sequence will be staged.
    return (
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          backgroundImage: `url(${placeholderSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <div ref={ownWrapperRef} className="relative h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full" aria-label={alt} />
    </div>
  );
}
