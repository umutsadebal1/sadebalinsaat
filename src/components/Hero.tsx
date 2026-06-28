"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import ScrollSequence from "./ScrollSequence";
import HeroContent from "./HeroContent";

export default function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);

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

  return (
    <section ref={trackRef} className="relative h-[450vh] w-full bg-petrol-900">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <ScrollSequence
            placeholderSrc="/images/hero-placeholder.jpg"
            alt="Sadebal Citylife projesine dışarıdan içeriye doğru kamera hareketi"
            frameCount={90}
            frameSrc={(i) => `/sequence/hero/frame_${String(i).padStart(4, "0")}.webp`}
            trackRef={trackRef}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-petrol-900 via-petrol-900/35 to-petrol-900/10" />

        <div className="relative z-10 flex h-full flex-col items-start justify-center px-5 md:px-8">
          <HeroContent opacity={textOpacity} pointerEvents={textPointerEvents} />
        </div>

        <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-[#F7F4ED]/60">
          <div className="h-9 w-px animate-pulse bg-[#F7F4ED]/40" />
        </div>
      </div>
    </section>
  );
}
