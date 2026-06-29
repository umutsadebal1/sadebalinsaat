"use client";

import ThemeToggle from "./ThemeToggle";

/**
 * Fixed, always-reachable theme switch in the bottom-right corner.
 * (Moved out of the navbar so the header can center the logo.)
 */
export default function FloatingThemeToggle() {
  return (
    <div className="fixed bottom-24 right-5 z-50">
      <ThemeToggle className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-line bg-bg-card text-ink-soft shadow-[0_10px_30px_-10px_rgba(20,33,31,0.55)] backdrop-blur-sm transition-colors duration-300 hover:border-gold-600 hover:text-gold-600" />
    </div>
  );
}
