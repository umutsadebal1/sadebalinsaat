export type ProjectStatus = "Devam Eden" | "Tamamlandı";

export type GalleryItem = { src: string; caption: string; isRender?: boolean };

export type Project = {
  slug: string;
  title: string;
  status: ProjectStatus;
  propertyType: "Konut" | "Ticari" | "Karma";
  location: string;
  year: string;
  description: string;
  /** Longer description for the project detail page */
  longDescription?: string;
  image: string;
  gallery?: GalleryItem[];
  isRender?: boolean;
  /** Coordinates for the project-specific map on its detail page */
  coordinates?: { lat: number; lng: number } | null;
};

/**
 * Project data now lives in `data/projects.json` and is read/written
 * through `src/lib/data.ts`. Use `readProjects()` (server-only) to
 * fetch the list. These helpers keep the types in one place.
 */
export function findProject(projects: Project[], slug: string) {
  return projects.find((p) => p.slug === slug);
}
