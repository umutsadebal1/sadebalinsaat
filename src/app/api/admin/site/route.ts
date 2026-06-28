import { NextRequest, NextResponse } from "next/server";
import { readSite, writeSite } from "@/lib/data";
import type { SiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(readSite());
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as Partial<SiteConfig>;
  const current = readSite();
  const updated: SiteConfig = {
    ...current,
    ...body,
    founder: { ...current.founder, ...(body.founder ?? {}) },
    social: { ...current.social, ...(body.social ?? {}) },
  };
  writeSite(updated);
  return NextResponse.json(updated);
}
