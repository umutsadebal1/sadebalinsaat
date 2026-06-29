"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, type MotionValue, type Variants } from "framer-motion";
import { useT, useLocale } from "./LocaleProvider";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeroContent({
  opacity,
  pointerEvents,
}: {
  /** Scroll-driven opacity (0 to 1). If omitted, content is always visible. */
  opacity?: MotionValue<number>;
  /** Scroll-driven pointer-events ("none" | "auto"), keeps buttons unclickable while invisible */
  pointerEvents?: MotionValue<"none" | "auto">;
}) {
  const t = useT();
  const locale = useLocale();
  return (
    <motion.div
      style={{ opacity, pointerEvents }}
      className="mx-auto w-full max-w-6xl"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={item}
          className="font-mono-label text-[12px] uppercase tracking-[0.25em] text-gold-400 mb-5"
        >
          Sadebal Yapı · {t("hero.eyebrowSuffix")}
        </motion.p>
        <motion.h1
          variants={item}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F7F4ED] max-w-3xl leading-[1.05] text-balance"
        >
          {locale === "tr" ? (
            <>
              Sadelikte güç,{" "}<br />
              <span className="italic text-gold-400">kalitede</span> iz bırakan yapılar.
            </>
          ) : (
            t("hero.title")
          )}
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-6 max-w-lg text-[15px] md:text-base text-[#E8E2D3]/85 leading-relaxed"
        >
          {t("hero.subtitle")}
        </motion.p>
        <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/portfoy"
            className="group inline-flex items-center gap-2 rounded-full bg-gold-600 px-6 py-3 text-sm font-medium text-petrol-900 transition-all duration-300 hover:bg-gold-400 hover:shadow-[0_10px_30px_-8px_rgba(201,162,75,0.6)] hover:-translate-y-0.5"
          >
            {t("hero.cta1")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 rounded-full border border-[#F7F4ED]/30 px-6 py-3 text-sm font-medium text-[#F7F4ED] transition-all duration-300 hover:border-[#F7F4ED]/70 hover:-translate-y-0.5"
          >
            {t("hero.cta2")}
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
