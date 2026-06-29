"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import ScrollSequence from "./ScrollSequence";
import HeroContent from "./HeroContent";

export default function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Phones get a half-resolution frame set (960×540) so each frame decodes
  // ~4× cheaper during scroll — the canvas is tiny on mobile anyway, so it
  // looks the same but scrubs far more smoothly. Decided once on mount.
  const [isMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  );

  // Intro overlay: a single tap auto-plays the sequence with a smooth,
  // programmatic scroll — this sidesteps the jank some phones show when the
  // user drags through the sticky scroll-sequence by hand.
  const [introHidden, setIntroHidden] = useState(false);
  const playing = useRef(false);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Text stays hidden while the camera travels through the building,
  // then fades in once the scroll-video has mostly finished (camera
  // has arrived inside) — text appears as the payoff, not the intro.
  const textOpacity = useTransform(scrollYProgress, [0, 0.62, 0.74], [0, 0, 1]);
  const textPointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.7 ? "auto" : "none"
  );

  // Hide the intro button as soon as the user scrolls away from the top.
  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 40) setIntroHidden(true);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function playSequence() {
    if (playing.current) return;
    setIntroHidden(true);
    const track = trackRef.current;
    if (!track) return;
    playing.current = true;

    const rect = track.getBoundingClientRect();
    const start = window.scrollY;
    const target = start + rect.height - window.innerHeight;
    const distance = target - start;
    const duration = 6200;
    const startTime = performance.now();

    // easeInOutCubic — gentle start/stop, steady middle.
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function step(now: number) {
      const t = Math.min(1, (now - startTime) / duration);
      window.scrollTo(0, start + distance * ease(t));
      if (t < 1) requestAnimationFrame(step);
      else playing.current = false;
    }
    requestAnimationFrame(step);
  }

  return (
    <section ref={trackRef} className="relative h-[300vh] w-full bg-petrol-900">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <ScrollSequence
            placeholderSrc="/images/hero-placeholder.jpg"
            alt="Sadebal Citylife projesine dışarıdan içeriye doğru kamera hareketi"
            frameCount={90}
            frameSrc={(i) => {
              const name = `frame_${String(i).padStart(4, "0")}.webp`;
              return isMobile ? `/sequence/hero/m/${name}` : `/sequence/hero/${name}`;
            }}
            trackRef={trackRef}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-petrol-900 via-petrol-900/35 to-petrol-900/10" />

        <div className="relative z-10 flex h-full flex-col items-start justify-center px-5 md:px-8">
          <HeroContent opacity={textOpacity} pointerEvents={textPointerEvents} />
        </div>

        {/* Intro CTA — auto-plays the sequence smoothly on tap */}
        <AnimatePresence>
          {!introHidden && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.5 } }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mb-6 font-mono-label text-[12px] uppercase tracking-[0.25em] text-gold-300"
              >
                Sadebal Yapı
              </motion.p>
              <motion.button
                onClick={playSequence}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-3 rounded-full bg-gold-600 px-8 py-4 text-base font-medium text-petrol-900 shadow-[0_18px_50px_-12px_rgba(201,162,75,0.6)] transition-colors duration-300 hover:bg-gold-400"
              >
                <Sparkles className="h-5 w-5" strokeWidth={1.8} />
                Hayallerinizi Gerçeğe Dönüştürün
              </motion.button>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-5 font-mono-label text-[10px] uppercase tracking-[0.2em] text-[#F7F4ED]/50"
              >
                Tıklayın · Tanıtımı izleyin
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-[#F7F4ED]/60">
          <div className="h-9 w-px animate-pulse bg-[#F7F4ED]/40" />
        </div>
      </div>
    </section>
  );
}
