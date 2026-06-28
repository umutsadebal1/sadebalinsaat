import Link from "next/link";
import { Plus, FolderKanban, Settings, ExternalLink } from "lucide-react";
import { readProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const projects = readProjects();
  const ongoing = projects.filter((p) => p.status === "Devam Eden").length;
  const done = projects.filter((p) => p.status === "Tamamlandı").length;

  const stats = [
    { label: "Toplam Proje", value: projects.length },
    { label: "Devam Eden", value: ongoing },
    { label: "Tamamlanan", value: done },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-soft">Sadebal Yapı yönetim paneline hoş geldiniz.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-md bg-gold-600 px-4 py-2.5 text-sm font-medium text-petrol-900 transition-colors hover:bg-gold-400"
        >
          <Plus className="h-4 w-4" /> Yeni Proje
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-line bg-bg-card p-5">
            <p className="font-mono-label text-[11px] uppercase tracking-[0.1em] text-ink-soft">{s.label}</p>
            <p className="mt-2 font-display text-3xl text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink href="/admin/projects" icon={FolderKanban} title="Projeleri Yönet" desc="Düzenle, ekle, sil" />
        <QuickLink href="/admin/site" icon={Settings} title="Site Ayarları" desc="İletişim & kurumsal" />
        <QuickLink href="/" icon={ExternalLink} title="Siteyi Görüntüle" desc="Yeni sekmede aç" external />
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  desc,
  external,
}: {
  href: string;
  icon: typeof Settings;
  title: string;
  desc: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className="group rounded-lg border border-line bg-bg-card p-5 transition-colors hover:border-gold-600"
    >
      <Icon className="mb-3 h-5 w-5 text-gold-600" strokeWidth={1.8} />
      <p className="font-display text-base text-ink">{title}</p>
      <p className="mt-0.5 text-sm text-ink-soft">{desc}</p>
    </Link>
  );
}
