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
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= frameCount; i++) {
      const img = new window.Image();
      img.src = frameSrc(i);
      img.onload = () => {
        loaded += 1;
        if (loaded === frameCount) setReady(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, [hasSequence, frameCount, frameSrc]);

  useEffect(() => {
    if (!ready || !hasSequence) return;
    const canvas = canvasRef.current;
    const track = trackRef?.current ?? ownWrapperRef.current;
    if (!canvas || !track) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ctx2d = ctx;
    const canvasEl = canvas;
    const trackEl = track;

    function draw() {
      const rect = trackEl.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;
      const frameIndex = Math.min(
        frameCount! - 1,
        Math.floor(progress * frameCount!)
      );
      const img = imagesRef.current[frameIndex];
      if (img && canvasEl.width && canvasEl.height && img.naturalWidth) {
        ctx2d.clearRect(0, 0, canvasEl.width, canvasEl.height);

        // object-fit: cover — preserve the frame's aspect ratio, crop
        // whatever overflows instead of stretching it to fill the canvas.
        const canvasRatio = canvasEl.width / canvasEl.height;
        const imgRatio = img.naturalWidth / img.naturalHeight;

        let drawWidth: number;
        let drawHeight: number;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > canvasRatio) {
          // image is relatively wider than canvas -> match height, crop sides
          drawHeight = canvasEl.height;
          drawWidth = drawHeight * imgRatio;
          offsetX = (canvasEl.width - drawWidth) / 2;
        } else {
          // image is relatively taller than canvas -> match width, crop top/bottom
          drawWidth = canvasEl.width;
          drawHeight = drawWidth / imgRatio;
          offsetY = (canvasEl.height - drawHeight) / 2;
        }

        ctx2d.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    }

    function onResize() {
      canvasEl.width = canvasEl.clientWidth;
      canvasEl.height = canvasEl.clientHeight;
      draw();
    }

    onResize();
    window.addEventListener("scroll", draw, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", draw);
      window.removeEventListener("resize", onResize);
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
