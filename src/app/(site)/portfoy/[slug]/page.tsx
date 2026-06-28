import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Building } from "lucide-react";
import FrameReveal from "@/components/FrameReveal";
import ProjectGallery from "@/components/ProjectGallery";
import ProjectMap from "@/components/ProjectMap";
import Reveal from "@/components/Reveal";
import { findProject } from "@/lib/projects";
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
    description: project.description,
    alternates: { canonical: `/portfoy/${project.slug}` },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(readProjects(), slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
      <Link
        href="/portfoy"
        className="group inline-flex items-center gap-1.5 font-mono-label text-[12px] uppercase tracking-[0.12em] text-ink-soft hover:text-gold-700 transition-colors mb-10"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
        Tüm Projeler
      </Link>

      <FrameReveal label="Proje Detayı" className="mb-10" />

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="rounded-full bg-petrol-700 px-3.5 py-1.5 font-mono-label text-[11px] uppercase tracking-[0.1em] text-gold-200">
          {project.status}
        </span>
        <span className="rounded-full border border-line px-3.5 py-1.5 font-mono-label text-[11px] uppercase tracking-[0.1em] text-ink-soft">
          {project.propertyType}
        </span>
        {project.isRender && (
          <span className="rounded-full border border-line px-3.5 py-1.5 font-mono-label text-[11px] uppercase tracking-[0.1em] text-ink-soft">
            3D Görselleştirme
          </span>
        )}
      </div>

      <h1 className="font-display text-4xl md:text-5xl text-ink mb-4 text-balance">
        {project.title}
      </h1>
      <p className="text-ink-soft max-w-2xl leading-relaxed mb-5">
        {project.longDescription ?? project.description}
      </p>
      <div className="flex items-center gap-5 mb-14 font-mono-label text-[12px] uppercase tracking-[0.08em] text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-gold-600" /> {project.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-gold-600" /> {project.year}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Building className="h-3.5 w-3.5 text-gold-600" /> {project.propertyType}
        </span>
      </div>

      <ProjectGallery project={project} />

      <Reveal delay={100} className="mt-20">
        <FrameReveal label="Konum" className="mb-8" />
        <ProjectMap coordinates={project.coordinates} title={project.title} />
      </Reveal>
    </div>
  );
}
