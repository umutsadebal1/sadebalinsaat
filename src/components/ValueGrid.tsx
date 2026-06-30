"use client";

import { Building2, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useT } from "./LocaleProvider";

const VALUES = [
  { icon: ShieldCheck, key: "value.engineering" },
  { icon: Building2, key: "value.architecture" },
  { icon: Clock, key: "value.delivery" },
  { icon: Sparkles, key: "value.detail" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function ValueGrid() {
  const t = useT();
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
    >
      {VALUES.map((v) => (
        <motion.div key={v.key} variants={card} className="group frame-corner">
          <v.icon
            className="mb-4 h-6 w-6 text-gold-600 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
            strokeWidth={1.5}
          />
          <h3 className="mb-2 font-display text-lg text-ink">{t(`${v.key}.title`)}</h3>
          <p className="text-sm leading-relaxed text-ink-soft">{t(`${v.key}.text`)}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
