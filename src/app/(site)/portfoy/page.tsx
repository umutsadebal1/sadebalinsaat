import type { Metadata } from "next";
import FrameReveal from "@/components/FrameReveal";
import PortfolioGrid from "@/components/PortfolioGrid";
import AnimatedHeading from "@/components/AnimatedHeading";
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
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
      <FrameReveal label="Portföy" className="mb-10" />
      <AnimatedHeading
        text="Projelerimiz"
        as="h1"
        className="font-display text-4xl md:text-5xl text-ink max-w-2xl mb-4 text-balance"
      />
      <p className="text-ink-soft max-w-xl mb-14 leading-relaxed">
        Devam eden ve tamamlanan projelerimizi aşağıda bulabilirsiniz. Bir
        projeye tıklayarak galerisini ve konumunu görüntüleyebilirsiniz.
      </p>

      <PortfolioGrid projects={projects} />
    </div>
  );
}
