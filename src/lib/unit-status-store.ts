import "server-only";
import type { UnitAvailability } from "./projects";
import { readProjects, writeProjects } from "./data";

/**
 * Live per-unit availability overrides ("Daire Durumları").
 *
 * The bundled `data/projects.json` stays the source of truth for structure and
 * content (so code edits keep applying), while the *live* unit statuses that the
 * admin toggles are persisted separately:
 *   - On Vercel (read-only FS) → a single JSON in Vercel Blob (this overlay).
 *   - Locally (no Blob token)  → written straight back into projects.json.
 * At read time the overlay is merged onto the project's `tour3D.unitStatuses`.
 */

const BLOB_KEY = "unit-statuses.json";

/** slug -> ("<floor>-<unitId>" -> status) */
type Overlay = Record<string, Record<string, UnitAvailability>>;

function blobEnabled() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

async function readOverlay(): Promise<Overlay> {
  if (!blobEnabled()) return {};
  try {
    const { get } = await import("@vercel/blob");
    // Private blob, read server-side with the token; `get` returns null if absent.
    const res = await get(BLOB_KEY, { access: "private" });
    if (!res || res.statusCode !== 200) return {};
    return (await new Response(res.stream).json()) as Overlay;
  } catch {
    return {};
  }
}

/** Live unit statuses for a project (admin overrides); null when none/local. */
export async function readUnitStatuses(
  slug: string
): Promise<Record<string, UnitAvailability> | null> {
  if (!blobEnabled()) return null; // local dev: statuses live in projects.json
  const overlay = await readOverlay();
  return overlay[slug] ?? null;
}

/** Persist a project's unit statuses (Blob on Vercel, projects.json locally). */
export async function writeUnitStatuses(
  slug: string,
  statuses: Record<string, UnitAvailability>
): Promise<void> {
  if (blobEnabled()) {
    const { put } = await import("@vercel/blob");
    const overlay = await readOverlay();
    overlay[slug] = statuses;
    await put(BLOB_KEY, JSON.stringify(overlay), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  // Local fallback: write straight into projects.json.
  const projects = readProjects();
  const p = projects.find((x) => x.slug === slug);
  if (p?.tour3D) {
    p.tour3D.unitStatuses = statuses;
    writeProjects(projects);
  }
}

/** Whether persistent (Blob) storage is configured — surfaced to the admin UI. */
export function unitStatusPersistenceEnabled(): boolean {
  return blobEnabled();
}
