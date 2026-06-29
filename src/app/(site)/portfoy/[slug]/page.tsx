import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Building,
  Maximize2,
  LayoutGrid,
} from "lucide-react";
import FrameReveal from "@/components/FrameReveal";
import ProjectHeroSlider from "@/components/ProjectHeroSlider";
import ProjectImageFlow from "@/components/ProjectImageFlow";
import ConstructionProgress from "@/components/ConstructionProgress";
import FloorPlans from "@/components/FloorPlans";
import ProjectMap from "@/components/ProjectMap";
import Reveal from "@/components/Reveal";
import AnimatedHeading from "@/components/AnimatedHeading";
import MagneticButton from "@/components/MagneticButton";
import { SetWhatsAppProject } from "@/components/WhatsAppContext";
import { findProject, deliveryLabel } from "@/lib/projects";
import { readProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(readProjects(), slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.shortSummary || project.description,
    alternates: { canonical: `/portfoy/${project.slug}` },
  };
}

function paragraphs(text?: string) {
  return (text ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(readProjects(), slug);
  if (!project) notFound();

  const sliderImages = [
    { src: project.image, caption: project.title, isRender: project.isRender },
    ...(project.gallery ?? []),
  ];
  const delivery = deliveryLabel(project);
  const isOngoing = project.status === "Devam Eden";
  const specs = [
    project.area && { icon: Maximize2, value: project.area },
    project.rooms && { icon: LayoutGrid, value: project.rooms },
    { icon: MapPin, value: project.location },
    { icon: Calendar, value: `${delivery.label}: ${delivery.value}` },
    { icon: Building, value: project.propertyType },
  ].filter(Boolean) as { icon: typeof MapPin; value: string }[];

  return (
    <div>
      {/* Feed the project name to the floating WhatsApp button's message */}
      <SetWhatsAppProject title={project.title} />

      {/* A) Full-screen auto slider */}
      <ProjectHeroSlider
        images={sliderImages}
        title={project.title}
        status={project.status}
      />

      <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24">
        <Link
          href="/portfoy"
          className="group mb-10 inline-flex items-center gap-1.5 font-mono-label text-[12px] uppercase tracking-[0.12em] text-ink-soft transition-colors hover:text-gold-700"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          Tüm Projeler
        </Link>

        {/* B) Info block */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-petrol-700 px-3.5 py-1.5 font-mono-label text-[11px] uppercase tracking-[0.1em] text-gold-200">
            {project.status}
          </span>
          <span className="rounded-full border border-line px-3.5 py-1.5 font-mono-label text-[11px] uppercase tracking-[0.1em] text-ink-soft">
            {project.propertyType}
          </span>
        </div>

        <h1 className="mb-5 font-display text-4xl text-balance text-ink md:text-6xl">
          {project.title}
        </h1>

        <div className="mb-8 max-w-2xl space-y-3 text-ink-soft leading-relaxed">
          {paragraphs(project.description).map((p, i) => (
            <p key={i} className={i === 0 ? "text-[17px] text-ink" : ""}>
              {p}
            </p>
          ))}
        </div>

        {/* Spec row — single line, icons, breathing room */}
        <div className="mb-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-line py-5">
          {specs.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 font-mono-label text-[12px] uppercase tracking-[0.06em] text-ink-soft"
            >
              <s.icon className="h-4 w-4 text-gold-600" strokeWidth={1.6} />
              {s.value}
            </span>
          ))}
        </div>

        {/* Detailed description */}
        {paragraphs(project.longDescription).length > 0 && (
          <Reveal className="mb-16">
            <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink-soft">
              {paragraphs(project.longDescription).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        )}

        {/* D) Construction progress — ongoing projects only */}
        {isOngoing && (project.constructionProgress?.length ?? 0) > 0 && (
          <Reveal className="mb-16">
            <FrameReveal label="Şantiyeden Kareler" className="mb-8" />
            <ConstructionProgress stages={project.constructionProgress!} />
          </Reveal>
        )}

        {/* Floor plans (interactive) */}
        {(project.floorPlans?.length ?? 0) > 0 && (
          <Reveal className="mb-16">
            <FrameReveal label="Kat Planları" className="mb-8" />
            <FloorPlans plans={project.floorPlans!} />
          </Reveal>
        )}

        {/* C) Full-width image flow */}
        {(project.gallery?.length ?? 0) > 0 && (
          <div className="mb-20">
            <Reveal>
              <FrameReveal label="Proje Galerisi" className="mb-10" />
            </Reveal>
            <ProjectImageFlow images={project.gallery!} />
          </div>
        )}

        {/* E) Map */}
        <Reveal>
          <FrameReveal label="Konum" className="mb-8" />
          <ProjectMap
            coordinates={project.coordinates}
            embedUrl={project.mapEmbedUrl}
            title={project.title}
          />
        </Reveal>
      </div>

      {/* F) CTA */}
      <section className="border-t border-line bg-petrol-900">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28 text-center">
          <AnimatedHeading
            text="Bu projeyi yakından tanımak ister misiniz?"
            className="mx-auto mb-10 max-w-2xl font-display text-3xl text-[#F7F4ED] text-balance md:text-4xl"
          />
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              href="/iletisim"
              className="group inline-flex items-center gap-2 rounded-full bg-gold-600 px-7 py-3.5 text-sm font-medium text-petrol-900 transition-all duration-300 hover:bg-gold-400"
            >
              Bize Ulaşın
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            <Link
              href="/portfoy"
              className="inline-flex items-center gap-2 rounded-full border border-[#F7F4ED]/30 px-7 py-3.5 text-sm font-medium text-[#F7F4ED] transition-all duration-300 hover:border-[#F7F4ED]/70"
            >
              Diğer Projeler
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
