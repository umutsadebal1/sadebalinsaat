"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import type { SiteConfig } from "@/lib/site-config";

const inputCls =
  "w-full rounded-md border border-line bg-bg px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold-600";

export default function SiteSettingsPage() {
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site")
      .then((r) => r.json())
      .then(setSite);
  }, []);

  if (!site) return <p className="text-sm text-ink-soft">Yükleniyor...</p>;

  function set<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setSite((s) => (s ? { ...s, [key]: value } : s));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(site),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
    else alert("Kaydetme başarısız oldu.");
  }

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-ink">Site Ayarları</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Section title="Kurumsal">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Şirket Adı">
              <input value={site.companyName} onChange={(e) => set("companyName", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Çalışma Saatleri">
              <input value={site.workingHours} onChange={(e) => set("workingHours", e.target.value)} className={inputCls} />
            </Field>
          </div>
        </Section>

        <Section title="İletişim">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="E-posta">
              <input value={site.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Telefon (görünen)">
              <input value={site.phoneDisplay} onChange={(e) => set("phoneDisplay", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Telefon (tel: linki)" hint="Örn: +905324618398">
              <input value={site.phoneHref} onChange={(e) => set("phoneHref", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Adres (kısa)">
              <input value={site.addressShort} onChange={(e) => set("addressShort", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Adres (tam)">
              <input value={site.addressFull} onChange={(e) => set("addressFull", e.target.value)} className={inputCls} />
            </Field>
          </div>
        </Section>

        <Section title="Kurucu">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ad Soyad">
              <input value={site.founder.name} onChange={(e) => set("founder", { ...site.founder, name: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Ünvan">
              <input value={site.founder.title} onChange={(e) => set("founder", { ...site.founder, title: e.target.value })} className={inputCls} />
            </Field>
          </div>
        </Section>

        <Section title="Sosyal Medya">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Instagram">
              <input value={site.social.instagram} onChange={(e) => set("social", { ...site.social, instagram: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Facebook">
              <input value={site.social.facebook} onChange={(e) => set("social", { ...site.social, facebook: e.target.value })} className={inputCls} />
            </Field>
            <Field label="LinkedIn">
              <input value={site.social.linkedin} onChange={(e) => set("social", { ...site.social, linkedin: e.target.value })} className={inputCls} />
            </Field>
          </div>
        </Section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-gold-600 px-5 py-2.5 text-sm font-medium text-petrol-900 transition-colors hover:bg-gold-400 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Kaydet
          </button>
          {saved && <span className="text-sm text-gold-700">Kaydedildi ✓</span>}
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-bg-card p-5">
      <h2 className="mb-4 font-display text-base text-ink">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono-label text-[11px] uppercase tracking-[0.08em] text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}
