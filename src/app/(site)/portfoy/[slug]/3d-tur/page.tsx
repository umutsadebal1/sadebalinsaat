import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import BuildingTourClient from "@/components/BuildingTourClient";
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
  return {
    title: project ? `${project.title} — 3D Bina Turu` : "3D Bina Turu",
    robots: { index: false },
  };
}

export default async function Tour3DPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(readProjects(), slug);
  if (!project || !project.tour3D?.enabled) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-12 md:py-16">
      <Link
        href={`/portfoy/${project.slug}`}
        className="group mb-8 inline-flex items-center gap-1.5 font-mono-label text-[12px] uppercase tracking-[0.12em] text-ink-soft transition-colors hover:text-gold-700"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
        Proje Detayı
      </Link>

      <p className="font-mono-label text-[11px] uppercase tracking-[0.2em] text-gold-700">
        3D Bina Turu
      </p>
      <h1 className="mt-1 mb-4 font-display text-3xl text-ink text-balance md:text-4xl">
        {project.title}
      </h1>

      <div className="mb-6 flex items-start gap-2.5 rounded-sm border border-line bg-bg-elevated px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" strokeWidth={1.8} />
        <p className="text-sm text-ink-soft">
          Bu, projenin <strong className="text-ink">temsili</strong> 3D görünümüdür;
          gerçek mimari detaylar yansıtılmamıştır. Mimari model tamamlandığında
          güncellenecektir.
        </p>
      </div>

      <BuildingTourClient config={project.tour3D} projectTitle={project.title} />

      <p className="mt-4 text-center font-mono-label text-[11px] uppercase tracking-[0.1em] text-ink-soft">
        Sürükleyerek döndürün · tekerlekle yakınlaşın · bir kata, sonra bir daireye tıklayın
      </p>
    </div>
  );
}
