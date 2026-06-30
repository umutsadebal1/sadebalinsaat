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
  {
    icon: Target,
    titleKey: "about.mission",
    text: "Her bütçeye ve her ihtiyaca uygun, sağlam mühendislikle inşa edilmiş yaşam ve çalışma alanları üretmek.",
  },
  {
    icon: Eye,
    titleKey: "about.vision",
    text: "Bölgemizde adıyla güven duyulan, kalitesiyle anılan bir yapı markası olmak.",
  },
  {
    icon: HeartHandshake,
    titleKey: "about.values",
    text: "Şeffaflık, zamanında teslim ve detayda özen — her projede taviz vermediğimiz üç ilke.",
  },
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
          Sadebal Yapı, konut ve ticari projelerde güvenilir mühendislik
          anlayışını zamansız bir mimari dille birleştiren bir inşaat ve
          gayrimenkul geliştirme firmasıdır. Her projede; sağlam temelden son
          detaya kadar aynı titizlikle çalışır, söz verdiğimiz takvime sadık
          kalırız.
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
                  <p className="text-sm text-ink-soft leading-relaxed">{p.text}</p>
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
                Şeffaf bir süreç
              </h3>
              <p className="text-ink-soft leading-relaxed text-[15px]">
                Projenin ilk gününden teslim anına kadar; bütçe, takvim ve
                ilerleme konusunda net bilgi veririz. Sürpriz maliyet ve
                belirsiz tarihler yerine, baştan belirlenmiş ve sadık
                kalınan bir plan sunarız.
              </p>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <div>
              <h3 className="font-display text-2xl text-ink mb-3">
                Mühendislikte taviz yok
              </h3>
              <p className="text-ink-soft leading-relaxed text-[15px]">
                Statik hesaplardan malzeme seçimine kadar her adım, ilgili
                yönetmeliklere ve uzun ömürlü yapı standartlarına uygun
                şekilde planlanır ve uygulanır.
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
                  Sadebal Yapı&apos;yı kuran ve her projede mühendislik
                  disiplininden ödün vermeyen yaklaşımı şirkete taşıyan isim.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
