import type { Metadata } from "next";
import FrameReveal from "@/components/FrameReveal";
import PortfolioCarousel from "@/components/PortfolioCarousel";
import EditorialGrid from "@/components/EditorialGrid";
import AnimatedHeading from "@/components/AnimatedHeading";
import Reveal from "@/components/Reveal";
import { readProjects } from "@/lib/data";
import { getT } from "@/lib/locale-server";
import { localizeProjects } from "@/lib/content-i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portföy",
  description:
    "Sadebal Yapı'nın devam eden ve tamamlanan konut, ticari ve karma kullanım projelerini keşfedin.",
  alternates: { canonical: "/portfoy" },
};

export default async function PortfolioPage() {
  const { locale, t } = await getT();
  const projects = localizeProjects(readProjects(), locale);
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-12 md:py-16">
      <FrameReveal label={t("nav.portfolio")} className="mb-8" />
      <AnimatedHeading
        text={t("portfolio.heading")}
        as="h1"
        className="font-display text-4xl md:text-5xl text-ink max-w-2xl mb-4 text-balance"
      />
      <p className="text-ink-soft max-w-xl mb-10 leading-relaxed">
        {t("portfolio.intro")}
      </p>

      {projects.length > 0 && (
        <Reveal className="mb-16 md:mb-20">
          <PortfolioCarousel projects={projects} />
        </Reveal>
      )}

      <Reveal>
        <FrameReveal label={t("portfolio.allProjects")} className="mb-10" />
      </Reveal>
      <EditorialGrid projects={projects} />
    </div>
  );
}
