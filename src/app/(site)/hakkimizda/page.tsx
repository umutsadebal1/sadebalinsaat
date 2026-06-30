import type { Metadata } from "next";
import { Target, Eye, HeartHandshake, User } from "lucide-react";
import FrameReveal from "@/components/FrameReveal";
import Reveal from "@/components/Reveal";
import AnimatedHeading from "@/components/AnimatedHeading";
import { readSite } from "@/lib/data";
import { getT } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Sadebal Yapı'nın hikayesi, değerleri ve inşaat sektöründeki yaklaşımı hakkında bilgi alın.",
  alternates: { canonical: "/hakkimizda" },
};

const PILLARS = [
  { icon: Target, titleKey: "about.mission", textKey: "about.mission.text" },
  { icon: Eye, titleKey: "about.vision", textKey: "about.vision.text" },
  { icon: HeartHandshake, titleKey: "about.values", textKey: "about.values.text" },
];

export default async function AboutPage() {
  const siteConfig = readSite();
  const { t } = await getT();
  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
        <FrameReveal label={t("nav.about")} className="mb-10" />
        <AnimatedHeading
          text={t("about.heading")}
          as="h1"
          className="font-display text-4xl md:text-5xl text-ink max-w-2xl mb-6 text-balance"
        />
        <p className="text-ink-soft max-w-2xl leading-relaxed text-[15px] md:text-base">
          {t("about.intro")}
        </p>
      </section>

      <section className="bg-bg-elevated border-y border-line">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.titleKey} delay={i * 120}>
                <div className="frame-corner">
                  <p.icon className="h-6 w-6 text-gold-600 mb-4" strokeWidth={1.5} />
                  <h2 className="font-display text-xl text-ink mb-2">{t(p.titleKey)}</h2>
                  <p className="text-sm text-ink-soft leading-relaxed">{t(p.textKey)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
        <Reveal>
          <FrameReveal label={t("about.approachLabel")} className="mb-10" />
        </Reveal>
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal delay={100}>
            <div>
              <h3 className="font-display text-2xl text-ink mb-3">
                {t("about.approach1.title")}
              </h3>
              <p className="text-ink-soft leading-relaxed text-[15px]">
                {t("about.approach1.text")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <div>
              <h3 className="font-display text-2xl text-ink mb-3">
                {t("about.approach2.title")}
              </h3>
              <p className="text-ink-soft leading-relaxed text-[15px]">
                {t("about.approach2.text")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-bg-elevated border-y border-line">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
          <Reveal>
            <FrameReveal label={t("about.founderLabel")} className="mb-10" />
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-line bg-bg-card">
                <User className="h-8 w-8 text-gold-600" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-display text-2xl text-ink mb-1">
                  {siteConfig.founder.name}
                </h2>
                <p className="font-mono-label text-[12px] uppercase tracking-[0.1em] text-gold-700 mb-3">
                  {siteConfig.founder.title}
                </p>
                <p className="text-ink-soft leading-relaxed text-[15px] max-w-xl">
                  {t("about.founder.bio")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
