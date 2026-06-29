"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { FloorPlan } from "@/lib/projects";

export default function FloorPlans({ plans }: { plans: FloorPlan[] }) {
  const [active, setActive] = useState(0);
  if (!plans || plans.length === 0) return null;
  const current = plans[Math.min(active, plans.length - 1)];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {plans.map((plan, i) => (
          <button
            key={`${plan.type}-${i}`}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            className={`cursor-pointer rounded-full border px-5 py-2 font-mono-label text-[12px] uppercase tracking-[0.08em] transition-colors duration-300 ${
              active === i
                ? "border-gold-600 bg-gold-600 text-petrol-900"
                : "border-line text-ink-soft hover:border-gold-600 hover:text-ink"
            }`}
          >
            {plan.type}
          </button>
        ))}
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-line bg-bg-elevated">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.imageUrl + active}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={current.imageUrl}
              alt={`${current.type} kat planı`}
              fill
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-contain p-4"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-3 text-center font-mono-label text-[11px] uppercase tracking-[0.1em] text-ink-soft">
        {current.type} Daire Tipi
      </p>
    </div>
  );
}
