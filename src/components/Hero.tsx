"use client";

import { useState } from "react";
import {
  useMotionValue,
  useTransform,
  animate,
  motion,
  AnimatePresence,
} from "framer-motion";
import { Sparkles, Loader2, ChevronDown } from "lucide-react";
import HeroSequencePlayer from "./HeroSequencePlayer";
import HeroContent from "./HeroContent";

export default function Hero() {
  // Phones load a half-resolution frame set (960×540) — cheaper to decode.
  const [isMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  );

  // Playback is driven by time, not scroll: `progress` (0→1) is animated when
  // the visitor taps play, and HeroSequencePlayer draws the matching frame.
  const progress = useMotionValue(0);
  const [ready, setReady] = useState(false);
  const [played, setPlayed] = useState(false);

  const textOpacity = useTransform(progress, [0, 0.6, 0.78], [0, 0, 1]);
  const textPointerEvents = useTransform(progress, (v) => (v > 0.75 ? "auto" : "none"));

  function play() {
    if (!ready || played) return;
    setPlayed(true);
    animate(progress, 1, { duration: 6.2, ease: [0.4, 0, 0.2, 1] });
  }

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-petrol-900">
      <div className="absolute inset-0">
        <HeroSequencePlayer
          progress={progress}
          placeholderSrc="/images/hero-placeholder.jpg"
          alt="Sadebal Citylife projesine dışarıdan içeriye doğru kamera hareketi"
          frameCount={90}
          frameSrc={(i) => {
            const name = `frame_${String(i).padStart(4, "0")}.webp`;
            return isMobile ? `/sequence/hero/m/${name}` : `/sequence/hero/${name}`;
          }}
          onReady={() => setReady(true)}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-petrol-900 via-petrol-900/35 to-petrol-900/10" />

      {/* Hero text — fades in as the camera arrives inside */}
      <div className="relative z-10 flex h-full flex-col items-start justify-center px-5 md:px-8">
        <HeroContent opacity={textOpacity} pointerEvents={textPointerEvents} />
      </div>

      {/* Intro CTA — plays the sequence like a video on tap */}
      <AnimatePresence>
        {!played && (
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
              onClick={play}
              disabled={!ready}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              whileHover={ready ? { scale: 1.03 } : undefined}
              whileTap={ready ? { scale: 0.98 } : undefined}
              className="group inline-flex items-center gap-3 rounded-full bg-gold-600 px-8 py-4 text-base font-medium text-petrol-900 shadow-[0_18px_50px_-12px_rgba(201,162,75,0.6)] transition-colors duration-300 hover:bg-gold-400 disabled:cursor-wait disabled:opacity-80"
            >
              {ready ? (
                <Sparkles className="h-5 w-5" strokeWidth={1.8} />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.8} />
              )}
              Hayallerinizi Gerçeğe Dönüştürün
            </motion.button>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-5 font-mono-label text-[10px] uppercase tracking-[0.2em] text-[#F7F4ED]/50"
            >
              {ready ? "Tıklayın · Tanıtımı izleyin" : "Tanıtım hazırlanıyor…"}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll hint — appears once the intro has played */}
      <AnimatePresence>
        {played && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-[#F7F4ED]/60"
          >
            <ChevronDown className="h-6 w-6 animate-bounce" strokeWidth={1.5} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
