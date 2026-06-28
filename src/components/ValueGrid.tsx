"use client";

import { Building2, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Güvenilir Mühendislik",
    text: "Her proje, statik hesaptan teslimata kadar titiz bir mühendislik disipliniyle yürütülür.",
  },
  {
    icon: Building2,
    title: "Zamansız Mimari",
    text: "Trendlere değil, yıllar geçse de değerini koruyan tasarım ilkelerine göre inşa ederiz.",
  },
  {
    icon: Clock,
    title: "Zamanında Teslim",
    text: "Net bir takvim, şeffaf bir süreç: söz verdiğimiz tarihte anahtarı teslim ederiz.",
  },
  {
    icon: Sparkles,
    title: "Detayda Özen",
    text: "Cepheden iç mekâna, her detay aynı titizlikle planlanır ve uygulanır.",
  },
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
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
    >
      {VALUES.map((v) => (
        <motion.div key={v.title} variants={card} className="group frame-corner">
          <v.icon
            className="mb-4 h-6 w-6 text-gold-600 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
            strokeWidth={1.5}
          />
          <h3 className="mb-2 font-display text-lg text-ink">{v.title}</h3>
          <p className="text-sm leading-relaxed text-ink-soft">{v.text}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
