import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

function safeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const folder = (form.get("folder") as string | null)?.trim() || "misc";

  if (!file) return NextResponse.json({ error: "Dosya yok" }, { status: 400 });

  const cleanFolder = safeName(folder);
  const dir = path.join(process.cwd(), "public", "images", "projects", cleanFolder);
  fs.mkdirSync(dir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const baseName = safeName(path.basename(file.name, ext)) || "image";
  let fileName = `${baseName}${ext}`;
  let i = 2;
  while (fs.existsSync(path.join(dir, fileName))) {
    fileName = `${baseName}-${i++}${ext}`;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, fileName), buffer);

  const url = `/images/projects/${cleanFolder}/${fileName}`;
  return NextResponse.json({ url });
}
