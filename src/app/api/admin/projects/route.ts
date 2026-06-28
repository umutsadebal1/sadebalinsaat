import { NextRequest, NextResponse } from "next/server";
import { readProjects, writeProjects } from "@/lib/data";
import type { Project } from "@/lib/projects";

export const dynamic = "force-dynamic";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  return NextResponse.json(readProjects());
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Project>;
  if (!body.title) {
    return NextResponse.json({ error: "Başlık zorunlu" }, { status: 400 });
  }
  const projects = readProjects();
  let slug = body.slug?.trim() || slugify(body.title);
  // ensure unique slug
  let i = 2;
  const base = slug;
  while (projects.some((p) => p.slug === slug)) slug = `${base}-${i++}`;

  const project: Project = {
    slug,
    title: body.title,
    status: body.status ?? "Devam Eden",
    propertyType: body.propertyType ?? "Konut",
    location: body.location ?? "",
    year: body.year ?? String(new Date().getFullYear()),
    description: body.description ?? "",
    longDescription: body.longDescription ?? "",
    image: body.image ?? "",
    isRender: !!body.isRender,
    coordinates: body.coordinates ?? null,
    gallery: body.gallery ?? [],
  };
  projects.push(project);
  writeProjects(projects);
  return NextResponse.json(project, { status: 201 });
}
