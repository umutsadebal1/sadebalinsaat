import { NextRequest, NextResponse } from "next/server";
import { readProjects } from "@/lib/data";
import { writeUnitStatuses } from "@/lib/unit-status-store";
import type { UnitAvailability } from "@/lib/projects";

export const dynamic = "force-dynamic";

const VALID: UnitAvailability[] = ["Müsait", "Rezerve", "Satıldı"];

// Persists only the per-unit availability ("Daire Durumları") — works on Vercel
// (Blob) where the full-project PUT can't (read-only filesystem).
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!readProjects().some((p) => p.slug === slug)) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    unitStatuses?: Record<string, string>;
  };
  const clean: Record<string, UnitAvailability> = {};
  for (const [k, v] of Object.entries(body.unitStatuses ?? {})) {
    if (VALID.includes(v as UnitAvailability)) clean[k] = v as UnitAvailability;
  }

  try {
    await writeUnitStatuses(slug, clean);
  } catch {
    return NextResponse.json(
      { error: "Kaydedilemedi — kalıcı depolama (Vercel Blob) yapılandırılmamış olabilir." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, count: Object.keys(clean).length });
}
