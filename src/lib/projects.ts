export type ProjectStatus = "Devam Eden" | "Tamamlandı";

export type GalleryItem = { src: string; caption: string; isRender?: boolean };

/** A single construction stage with its completion percentage (0–100). */
export type ConstructionStage = { stage: string; percent: number };

/** An interactive floor-plan entry (e.g. "2+1" with its plan image). */
export type FloorPlan = { type: string; imageUrl: string };

/** Config for the representational 3D building tour. */
export type Tour3DConfig = {
  enabled: boolean;
  floorCount: number;
  unitsPerFloor: number;
  satelliteImageUrl: string;
};

export type Project = {
  slug: string;
  title: string;
  status: ProjectStatus;
  propertyType: "Konut" | "Ticari" | "Karma";
  location: string;
  /** Delivery/target year. Rendered with a label derived from `status`. */
  year: string;
  /** One-sentence summary used on cards / editorial grid. */
  shortSummary?: string;
  description: string;
  /** Longer description for the project detail page */
  longDescription?: string;
  image: string;
  gallery?: GalleryItem[];
  isRender?: boolean;
  /** Coordinates for the project-specific map on its detail page */
  coordinates?: { lat: number; lng: number } | null;
  /** Optional full Google Maps embed URL; takes precedence over coordinates. */
  mapEmbedUrl?: string;
  /** Total built area, e.g. "12.500 m²" — shown in the detail spec row. */
  area?: string;
  /** Unit layout summary, e.g. "2+1, 3+1" — shown in the detail spec row. */
  rooms?: string;
  /** Per-stage site progress. Only shown for "Devam Eden" projects. */
  constructionProgress?: ConstructionStage[];
  /** Interactive floor plans. Section is hidden when empty. */
  floorPlans?: FloorPlan[];
  /** Representational 3D building tour. Button shown only when enabled. */
  tour3D?: Tour3DConfig;
};

/**
 * Project data now lives in `data/projects.json` and is read/written
 * through `src/lib/data.ts`. Use `readProjects()` (server-only) to
 * fetch the list. These helpers keep the types in one place.
 */
export function findProject(projects: Project[], slug: string) {
  return projects.find((p) => p.slug === slug);
}

/**
 * Completed projects show an actual delivery year; ongoing ones show a
 * target year. Keeps the "Teslim" vs "Hedeflenen Teslim" wording in one place.
 */
export function deliveryLabel(p: Pick<Project, "status" | "year">): {
  key: string;
  value: string;
} {
  return {
    key: p.status === "Tamamlandı" ? "delivery.delivered" : "delivery.target",
    value: (p.year ?? "").trim(),
  };
}

/** Translation key for a project status badge. */
export function statusKey(status: ProjectStatus): string {
  return status === "Tamamlandı" ? "status.completed" : "status.ongoing";
}

/** First sentence of a block of text, whitespace-normalised. */
export function firstSentence(text: string): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  const match = clean.match(/^.*?[.!?](\s|$)/);
  return (match ? match[0] : clean).trim();
}

/** Preferred one-line summary: explicit shortSummary, else first sentence. */
export function projectSummary(p: Pick<Project, "shortSummary" | "description">): string {
  return p.shortSummary?.trim() || firstSentence(p.description);
}
