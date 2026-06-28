"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projeler", icon: FolderKanban },
  { href: "/admin/site", label: "Site Ayarları", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Login page renders without the shell.
  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(item: (typeof NAV)[number]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <div className="flex min-h-screen bg-bg text-ink">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-line bg-bg-elevated transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-line px-5">
          <Image src="/images/logo.png" alt="Sadebal Yapı" width={32} height={31} className="h-8 w-auto" />
          <span className="font-display text-sm">
            Sadebal <span className="text-gold-700">Admin</span>
          </span>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-gold-600 text-petrol-900"
                    : "text-ink-soft hover:bg-bg-card hover:text-ink"
                }`}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-3 bottom-3 flex flex-col gap-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-bg-card hover:text-ink"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
            Siteyi Görüntüle
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-bg-card hover:text-ink"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-line px-5 md:hidden">
          <button onClick={() => setOpen(true)} aria-label="Menü">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-sm">Sadebal Admin</span>
        </header>
        <main className="flex-1 p-5 md:p-8">
          <div className="mx-auto w-full max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
