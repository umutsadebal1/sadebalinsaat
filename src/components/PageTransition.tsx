"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Soft fade/slide that re-runs on each route change. Keyed by pathname so
 * React remounts the wrapper per route and replays the enter animation.
 *
 * We deliberately avoid AnimatePresence + mode="wait" here: with the App
 * Router its exit/enter hand-off can deadlock and leave the incoming page
 * stuck at opacity 0 (blank content with only the navbar showing). A keyed
 * remount can't get stuck — there is no exit to wait on, so it always plays
 * the enter animation fresh.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
