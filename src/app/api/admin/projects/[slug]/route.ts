import { NextRequest, NextResponse } from "next/server";
import { readProjects, writeProjects } from "@/lib/data";
import type { Project } from "@/lib/projects";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const project = readProjects().find((p) => p.slug === slug);
  if (!project) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = (await req.json()) as Partial<Project>;
  const projects = readProjects();
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  const updated: Project = {
    ...projects[idx],
    ...body,
    slug, // slug is immutable here
  };
  projects[idx] = updated;
  writeProjects(projects);
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const projects = readProjects();
  const next = projects.filter((p) => p.slug !== slug);
  if (next.length === projects.length) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  writeProjects(next);
  return NextResponse.json({ ok: true });
}
