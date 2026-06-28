"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Signature element: a thin gate-like frame (echoing the logo's
 * window/door frame motif) that draws itself open when a section
 * enters the viewport. Used to mark entry into major sections.
 */
export default function FrameReveal({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span
        className="h-px bg-gold-600 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: visible ? "48px" : "0px" }}
      />
      {label && (
        <span
          className={`font-mono-label text-[11px] uppercase tracking-[0.2em] text-gold-700 transition-opacity duration-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {label}
        </span>
      )}
      <span
        className="h-px flex-1 bg-line transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: visible ? "100%" : "0px", transitionDelay: "150ms" }}
      />
    </div>
  );
}
