"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/projects";

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/projects");
    setProjects(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(slug: string, title: string) {
    if (!confirm(`"${title}" projesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;
    const res = await fetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
    if (res.ok) setProjects((p) => p.filter((x) => x.slug !== slug));
    else alert("Silme başarısız oldu.");
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Projeler</h1>
          <p className="mt-1 text-sm text-ink-soft">{projects.length} proje</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-md bg-gold-600 px-4 py-2.5 text-sm font-medium text-petrol-900 transition-colors hover:bg-gold-400"
        >
          <Plus className="h-4 w-4" /> Yeni Proje
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-ink-soft">Yükleniyor...</p>
      ) : projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line p-10 text-center">
          <p className="text-ink-soft">Henüz proje yok. İlk projeyi ekleyin.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((p) => (
            <div
              key={p.slug}
              className="flex items-center gap-4 rounded-lg border border-line bg-bg-card p-3"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-bg-elevated">
                {p.image && (
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base text-ink">{p.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-ink-soft">
                  <span className="rounded-full bg-bg-elevated px-2 py-0.5">{p.status}</span>
                  <span className="rounded-full bg-bg-elevated px-2 py-0.5">{p.propertyType}</span>
                  <span>{p.location}</span>
                  <span>·</span>
                  <span>{p.year}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/portfoy/${p.slug}`}
                  target="_blank"
                  title="Sitede görüntüle"
                  className="rounded-md p-2 text-ink-soft transition-colors hover:bg-bg-elevated hover:text-ink"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/projects/${p.slug}`}
                  title="Düzenle"
                  className="rounded-md p-2 text-ink-soft transition-colors hover:bg-bg-elevated hover:text-ink"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => remove(p.slug, p.title)}
                  title="Sil"
                  className="rounded-md p-2 text-ink-soft transition-colors hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
