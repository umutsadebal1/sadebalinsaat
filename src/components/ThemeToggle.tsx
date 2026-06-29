"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, getStoredTheme } from "@/lib/theme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredTheme();
    if (stored) {
      setIsDark(stored === "dark");
    } else {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next ? "dark" : "light");
  }

  if (!mounted) {
    return <div className={className || "h-9 w-9"} aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
      aria-pressed={isDark}
      className={
        className ||
        "relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-300 hover:border-gold-600 hover:text-gold-600 cursor-pointer"
      }
    >
      <Sun
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}
