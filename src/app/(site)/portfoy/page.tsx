import type { Metadata } from "next";
import FrameReveal from "@/components/FrameReveal";
import PortfolioCarousel from "@/components/PortfolioCarousel";
import EditorialGrid from "@/components/EditorialGrid";
import AnimatedHeading from "@/components/AnimatedHeading";
import Reveal from "@/components/Reveal";
import { readProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portföy",
  description:
    "Sadebal Yapı'nın devam eden ve tamamlanan konut, ticari ve karma kullanım projelerini keşfedin.",
  alternates: { canonical: "/portfoy" },
};

export default function PortfolioPage() {
  const projects = readProjects();
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-12 md:py-16">
      <FrameReveal label="Portföy" className="mb-8" />
      <AnimatedHeading
        text="Projelerimiz"
        as="h1"
        className="font-display text-4xl md:text-5xl text-ink max-w-2xl mb-4 text-balance"
      />
      <p className="text-ink-soft max-w-xl mb-10 leading-relaxed">
        Devam eden ve tamamlanan projelerimizi aşağıda bulabilirsiniz. Bir
        projeye tıklayarak galerisini ve konumunu görüntüleyebilirsiniz.
      </p>

      {projects.length > 0 && (
        <Reveal className="mb-16 md:mb-20">
          <PortfolioCarousel projects={projects} />
        </Reveal>
      )}

      <Reveal>
        <FrameReveal label="Tüm Projeler" className="mb-10" />
      </Reveal>
      <EditorialGrid projects={projects} />
    </div>
  );
}
