import fs from "node:fs";
import path from "node:path";
import type { Project } from "./projects";
import type { SiteConfig } from "./site-config";

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const SITE_FILE = path.join(DATA_DIR, "site.json");

function readJson<T>(file: string): T {
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJson(file: string, data: unknown) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export function readProjects(): Project[] {
  return readJson<Project[]>(PROJECTS_FILE);
}

export function writeProjects(projects: Project[]) {
  writeJson(PROJECTS_FILE, projects);
}

export function readSite(): SiteConfig {
  return readJson<SiteConfig>(SITE_FILE);
}

export function writeSite(site: SiteConfig) {
  writeJson(SITE_FILE, site);
}
