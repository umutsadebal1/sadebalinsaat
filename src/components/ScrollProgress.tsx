"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin gold progress bar pinned to the very top of the viewport,
 * tracking page scroll. Subtle but adds life to long pages.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-gold-700 via-gold-400 to-gold-600"
    />
  );
}
