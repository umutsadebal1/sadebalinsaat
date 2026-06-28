import type { MetadataRoute } from "next";
import { readProjects } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = readProjects();
  const base = "https://www.sadebalyapi.com";
  const routes = ["", "/portfoy", "/hakkimizda", "/iletisim"];

  const staticRoutes = routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${base}/portfoy/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
