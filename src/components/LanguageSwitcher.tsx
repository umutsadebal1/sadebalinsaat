"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  LOCALES,
  LOCALE_NAMES,
  LOCALE_SHORT,
  LOCALE_COOKIE,
  dirFor,
  type Locale,
} from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

export default function LanguageSwitcher() {
  const router = useRouter();
  const current = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function choose(l: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${l};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = l;
    document.documentElement.dir = dirFor(l);
    setOpen(false);
    router.refresh();
  }

  return (
    <div ref={ref} className="fixed bottom-[10.5rem] right-5 z-50">
      {open && (
        <div className="absolute bottom-14 right-0 flex w-40 flex-col overflow-hidden rounded-lg border border-line bg-bg-card shadow-[0_12px_30px_-10px_rgba(20,33,31,0.5)]">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => choose(l)}
              className={`flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors hover:bg-bg-elevated ${
                l === current ? "text-gold-700" : "text-ink"
              }`}
            >
              <span>{LOCALE_NAMES[l]}</span>
              {l === current ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className="font-mono-label text-[10px] text-ink-soft">{LOCALE_SHORT[l]}</span>
              )}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Dil seç / Select language"
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg-card text-ink-soft shadow-[0_10px_30px_-10px_rgba(20,33,31,0.55)] backdrop-blur-sm transition-colors duration-300 hover:border-gold-600 hover:text-gold-600"
      >
        <span className="font-mono-label text-[12px] font-medium tracking-wide">
          {LOCALE_SHORT[current]}
        </span>
      </button>
    </div>
  );
}
