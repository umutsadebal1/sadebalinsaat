"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Save, Loader2, Plus, Trash2, Upload } from "lucide-react";
import type { SiteConfig, FaqItem, Testimonial } from "@/lib/site-config";

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

  // --- SSS ---
  function addFaq() {
    set("faq", [...(site?.faq ?? []), { question: "", answer: "" }]);
  }
  function updateFaq(i: number, patch: Partial<FaqItem>) {
    const list = [...(site?.faq ?? [])];
    list[i] = { ...list[i], ...patch };
    set("faq", list);
  }
  function removeFaq(i: number) {
    set("faq", (site?.faq ?? []).filter((_, idx) => idx !== i));
  }

  // --- Testimonials ---
  function addTestimonial() {
    set("testimonials", [...(site?.testimonials ?? []), { name: "", role: "", quote: "" }]);
  }
  function updateTestimonial(i: number, patch: Partial<Testimonial>) {
    const list = [...(site?.testimonials ?? [])];
    list[i] = { ...list[i], ...patch };
    set("testimonials", list);
  }
  function removeTestimonial(i: number) {
    set("testimonials", (site?.testimonials ?? []).filter((_, idx) => idx !== i));
  }
  async function onTestimonialPhoto(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "testimonials");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      updateTestimonial(i, { photo: url });
    } else {
      alert("Görsel yüklenemedi.");
    }
    e.target.value = "";
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

        <Section title="Sıkça Sorulan Sorular (SSS)">
          <div className="flex flex-col gap-4">
            {(site.faq ?? []).map((f, i) => (
              <div key={i} className="rounded-md border border-line bg-bg p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono-label text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                    Soru {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFaq(i)}
                    className="rounded p-1.5 text-ink-soft hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  value={f.question}
                  placeholder="Soru"
                  onChange={(e) => updateFaq(i, { question: e.target.value })}
                  className={`${inputCls} mb-2`}
                />
                <textarea
                  rows={3}
                  value={f.answer}
                  placeholder="Cevap"
                  onChange={(e) => updateFaq(i, { answer: e.target.value })}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addFaq}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm transition-colors hover:border-gold-600"
          >
            <Plus className="h-4 w-4" /> Soru Ekle
          </button>
        </Section>

        <Section title="Referanslar (Yorumlar)">
          <div className="flex flex-col gap-4">
            {(site.testimonials ?? []).map((t, i) => (
              <div key={i} className="rounded-md border border-line bg-bg p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono-label text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                    Yorum {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTestimonial(i)}
                    className="rounded p-1.5 text-ink-soft hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mb-2 grid gap-2 sm:grid-cols-2">
                  <input
                    value={t.name}
                    placeholder="İsim"
                    onChange={(e) => updateTestimonial(i, { name: e.target.value })}
                    className={inputCls}
                  />
                  <input
                    value={t.role ?? ""}
                    placeholder="Ünvan / Proje (opsiyonel)"
                    onChange={(e) => updateTestimonial(i, { role: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <textarea
                  rows={2}
                  value={t.quote}
                  placeholder="Yorum metni"
                  onChange={(e) => updateTestimonial(i, { quote: e.target.value })}
                  className={`${inputCls} mb-2`}
                />
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-line bg-bg-elevated">
                    {t.photo && <Image src={t.photo} alt="" fill className="object-cover" />}
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-2 text-xs transition-colors hover:border-gold-600">
                    <Upload className="h-3.5 w-3.5" /> Fotoğraf (opsiyonel)
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onTestimonialPhoto(i, e)} />
                  </label>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTestimonial}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm transition-colors hover:border-gold-600"
          >
            <Plus className="h-4 w-4" /> Yorum Ekle
          </button>
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
