"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Trash2, GripVertical, Save, Loader2, Plus } from "lucide-react";
import type {
  Project,
  ProjectStatus,
  GalleryItem,
  ConstructionStage,
  FloorPlan,
  UnitAvailability,
} from "@/lib/projects";
import { orderedFloorUnits, isUnitOnFloor } from "@/lib/projects";

const UNIT_STATUSES: UnitAvailability[] = ["Müsait", "Rezerve", "Satıldı"];

type Props = { initial?: Project };

const STATUSES: ProjectStatus[] = ["Devam Eden", "Tamamlandı"];
const TYPES: Project["propertyType"][] = ["Konut", "Ticari", "Karma"];

function slugifyTr(s: string) {
  return s
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProjectForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState<Project>(
    initial ?? {
      slug: "",
      title: "",
      status: "Devam Eden",
      propertyType: "Konut",
      location: "",
      year: String(new Date().getFullYear()),
      shortSummary: "",
      description: "",
      longDescription: "",
      image: "",
      isRender: false,
      coordinates: null,
      mapEmbedUrl: "",
      area: "",
      rooms: "",
      constructionProgress: [],
      floorPlans: [],
      gallery: [],
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savingStatuses, setSavingStatuses] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const folder = (form.slug || slugifyTr(form.title) || "yeni-proje").trim();

  function set<K extends keyof Project>(key: K, value: Project[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) {
      alert("Görsel yüklenemedi.");
      return null;
    }
    const { url } = await res.json();
    return url as string;
  }

  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) set("image", url);
  }

  async function onGalleryAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) {
        setForm((f) => ({
          ...f,
          gallery: [...(f.gallery ?? []), { src: url, caption: "", isRender: f.isRender }],
        }));
      }
    }
    e.target.value = "";
  }

  function updateGallery(i: number, patch: Partial<GalleryItem>) {
    setForm((f) => {
      const g = [...(f.gallery ?? [])];
      g[i] = { ...g[i], ...patch };
      return { ...f, gallery: g };
    });
  }

  function removeGallery(i: number) {
    setForm((f) => ({ ...f, gallery: (f.gallery ?? []).filter((_, idx) => idx !== i) }));
  }

  function moveGallery(i: number, dir: -1 | 1) {
    setForm((f) => {
      const g = [...(f.gallery ?? [])];
      const j = i + dir;
      if (j < 0 || j >= g.length) return f;
      [g[i], g[j]] = [g[j], g[i]];
      return { ...f, gallery: g };
    });
  }

  // --- Construction progress (şantiye ilerleme) ---
  function addStage() {
    setForm((f) => ({
      ...f,
      constructionProgress: [...(f.constructionProgress ?? []), { stage: "", percent: 0 }],
    }));
  }
  function updateStage(i: number, patch: Partial<ConstructionStage>) {
    setForm((f) => {
      const list = [...(f.constructionProgress ?? [])];
      list[i] = { ...list[i], ...patch };
      return { ...f, constructionProgress: list };
    });
  }
  function removeStage(i: number) {
    setForm((f) => ({
      ...f,
      constructionProgress: (f.constructionProgress ?? []).filter((_, idx) => idx !== i),
    }));
  }

  // --- Floor plans (kat planları) ---
  function addFloorPlan() {
    setForm((f) => ({
      ...f,
      floorPlans: [...(f.floorPlans ?? []), { type: "", imageUrl: "" }],
    }));
  }
  function updateFloorPlan(i: number, patch: Partial<FloorPlan>) {
    setForm((f) => {
      const list = [...(f.floorPlans ?? [])];
      list[i] = { ...list[i], ...patch };
      return { ...f, floorPlans: list };
    });
  }
  function removeFloorPlan(i: number) {
    setForm((f) => ({
      ...f,
      floorPlans: (f.floorPlans ?? []).filter((_, idx) => idx !== i),
    }));
  }
  async function onFloorPlanUpload(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) updateFloorPlan(i, { imageUrl: url });
    e.target.value = "";
  }

  // --- Unit statuses (daire durumları) — 3D tour ---
  function setUnitStatus(key: string, status: UnitAvailability) {
    setForm((f) => {
      if (!f.tour3D) return f;
      return {
        ...f,
        tour3D: {
          ...f.tour3D,
          unitStatuses: { ...(f.tour3D.unitStatuses ?? {}), [key]: status },
        },
      };
    });
  }

  // Persists ONLY the statuses (works on Vercel via Blob) — separate from the
  // full-project save so "Satıldı" instantly reflects in the live 3D tour.
  async function saveUnitStatuses() {
    if (!initial) return;
    setSavingStatuses(true);
    setStatusMsg("");
    const res = await fetch(`/api/admin/projects/${initial.slug}/unit-statuses`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unitStatuses: form.tour3D?.unitStatuses ?? {} }),
    });
    setSavingStatuses(false);
    if (res.ok) {
      setStatusMsg("Kaydedildi ✓ — 3D tura yansıdı.");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setStatusMsg(d.error || "Kaydedilemedi.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = isEdit ? `/api/admin/projects/${initial!.slug}` : "/api/admin/projects";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/projects");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Kaydetme başarısız oldu.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Section title="Temel Bilgiler">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Proje Adı" required>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="URL (slug)" hint={isEdit ? "Düzenlemede değiştirilemez" : "Boş bırakılırsa addan üretilir"}>
            <input
              value={form.slug}
              disabled={isEdit}
              placeholder={slugifyTr(form.title)}
              onChange={(e) => set("slug", slugifyTr(e.target.value))}
              className={`${inputCls} disabled:opacity-60`}
            />
          </Field>
          <Field label="Durum">
            <select value={form.status} onChange={(e) => set("status", e.target.value as ProjectStatus)} className={inputCls}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Tip">
            <select value={form.propertyType} onChange={(e) => set("propertyType", e.target.value as Project["propertyType"])} className={inputCls}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Konum">
            <input value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Yıl" hint="Tamamlandı = teslim yılı, Devam Eden = hedeflenen teslim">
            <input value={form.year} onChange={(e) => set("year", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Toplam Alan" hint="Örn: 8.400 m²">
            <input value={form.area ?? ""} onChange={(e) => set("area", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Oda Tipleri" hint="Örn: 2+1, 3+1">
            <input value={form.rooms ?? ""} onChange={(e) => set("rooms", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <label className="mt-2 flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={!!form.isRender} onChange={(e) => set("isRender", e.target.checked)} />
          3D / Render görsel (rozet gösterilir)
        </label>
      </Section>

      <Section title="Açıklamalar">
        <Field label="Kart Özeti" hint="Tek cümle — portföy kartlarında görünür (boşsa açıklamanın ilk cümlesi kullanılır)">
          <input value={form.shortSummary ?? ""} onChange={(e) => set("shortSummary", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Kısa Açıklama" hint="Kart ve listelerde görünür">
          <textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Detaylı Açıklama" hint="Proje detay sayfasında görünür">
          <textarea rows={4} value={form.longDescription ?? ""} onChange={(e) => set("longDescription", e.target.value)} className={inputCls} />
        </Field>
      </Section>

      <Section title="Kapak Görseli">
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-md border border-line bg-bg-elevated">
            {form.image && <Image src={form.image} alt="Kapak" fill className="object-cover" />}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm transition-colors hover:border-gold-600">
            <Upload className="h-4 w-4" /> Görsel Yükle
            <input type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
          </label>
        </div>
      </Section>

      <Section title="Galeri">
        <div className="flex flex-col gap-3">
          {(form.gallery ?? []).map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-md border border-line bg-bg-card p-2">
              <div className="flex flex-col text-ink-soft">
                <button type="button" onClick={() => moveGallery(i, -1)} className="hover:text-ink">▲</button>
                <button type="button" onClick={() => moveGallery(i, 1)} className="hover:text-ink">▼</button>
              </div>
              <GripVertical className="h-4 w-4 text-ink-soft" />
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded bg-bg-elevated">
                <Image src={item.src} alt="" fill className="object-cover" />
              </div>
              <input
                value={item.caption}
                placeholder="Açıklama (caption)"
                onChange={(e) => updateGallery(i, { caption: e.target.value })}
                className={`${inputCls} flex-1`}
              />
              <label className="flex items-center gap-1 text-xs text-ink-soft">
                <input type="checkbox" checked={!!item.isRender} onChange={(e) => updateGallery(i, { isRender: e.target.checked })} />
                3D
              </label>
              <button type="button" onClick={() => removeGallery(i)} className="rounded p-2 text-ink-soft hover:bg-red-500/10 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm transition-colors hover:border-gold-600">
          <Upload className="h-4 w-4" /> Galeriye Görsel Ekle
          <input type="file" accept="image/*" multiple className="hidden" onChange={onGalleryAdd} />
        </label>
      </Section>

      <Section title="Konum (Harita)" hint="Doldurulursa detay sayfasında harita gösterilir">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Enlem (lat)">
            <input
              type="number"
              step="any"
              value={form.coordinates?.lat ?? ""}
              onChange={(e) =>
                set("coordinates", e.target.value ? { lat: parseFloat(e.target.value), lng: form.coordinates?.lng ?? 0 } : null)
              }
              className={inputCls}
            />
          </Field>
          <Field label="Boylam (lng)">
            <input
              type="number"
              step="any"
              value={form.coordinates?.lng ?? ""}
              onChange={(e) =>
                set("coordinates", e.target.value ? { lat: form.coordinates?.lat ?? 0, lng: parseFloat(e.target.value) } : null)
              }
              className={inputCls}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Harita Embed URL (opsiyonel)" hint="Google Maps 'Yer paylaş > Harita yerleştir' iframe src'si. Doldurulursa lat/lng yerine bu kullanılır.">
            <input value={form.mapEmbedUrl ?? ""} onChange={(e) => set("mapEmbedUrl", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Section>

      <Section title="İlerleme Durumu" hint="Aşama bazlı şantiye ilerlemesi — yalnızca 'Devam Eden' projelerde sitede gösterilir">
        <div className="flex flex-col gap-3">
          {(form.constructionProgress ?? []).map((s, i) => (
            <div key={i} className="flex items-center gap-3 rounded-md border border-line bg-bg-card p-2">
              <input
                value={s.stage}
                placeholder="Aşama (örn: Kaba İnşaat)"
                onChange={(e) => updateStage(i, { stage: e.target.value })}
                className={`${inputCls} flex-1`}
              />
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={s.percent}
                  onChange={(e) =>
                    updateStage(i, { percent: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })
                  }
                  className={`${inputCls} w-20`}
                />
                <span className="text-sm text-ink-soft">%</span>
              </div>
              <button
                type="button"
                onClick={() => removeStage(i)}
                className="rounded p-2 text-ink-soft hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStage}
          className="mt-3 inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm transition-colors hover:border-gold-600"
        >
          <Plus className="h-4 w-4" /> Aşama Ekle
        </button>
      </Section>

      <Section title="Kat Planları" hint="Daire tipleri ve plan görselleri — eklenmezse sitede bu bölüm gösterilmez">
        <div className="flex flex-col gap-3">
          {(form.floorPlans ?? []).map((fp, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 rounded-md border border-line bg-bg-card p-2">
              <input
                value={fp.type}
                placeholder="Tip (örn: 2+1)"
                onChange={(e) => updateFloorPlan(i, { type: e.target.value })}
                className={`${inputCls} w-28`}
              />
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded bg-bg-elevated">
                {fp.imageUrl && <Image src={fp.imageUrl} alt="" fill className="object-cover" />}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-2 text-xs transition-colors hover:border-gold-600">
                <Upload className="h-3.5 w-3.5" /> Görsel Yükle
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onFloorPlanUpload(i, e)} />
              </label>
              <input
                value={fp.imageUrl}
                placeholder="veya görsel yolu"
                onChange={(e) => updateFloorPlan(i, { imageUrl: e.target.value })}
                className={`${inputCls} min-w-[140px] flex-1`}
              />
              <button
                type="button"
                onClick={() => removeFloorPlan(i)}
                className="rounded p-2 text-ink-soft hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addFloorPlan}
          className="mt-3 inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm transition-colors hover:border-gold-600"
        >
          <Plus className="h-4 w-4" /> Kat Planı Ekle
        </button>
      </Section>

      {form.tour3D?.enabled && (form.tour3D.floorUnits?.length ?? 0) > 0 && (
        <Section
          title="Daire Durumları"
          hint="Her dairenin satış durumu — 3D bina turunda renk olarak görünür (Müsait=yeşil, Rezerve=sarı, Satıldı=kırmızı)"
        >
          {(() => {
            const t3d = form.tour3D!;
            const ordered = orderedFloorUnits(t3d.floorUnits ?? []);
            const floors = Array.from({ length: t3d.floorCount }, (_, i) => i + 1);
            return (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="p-1.5 text-left font-mono-label text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                        Kat
                      </th>
                      {ordered.map((u) => (
                        <th key={u.id} className="p-1.5 text-center">
                          <span className="font-mono-label text-[11px] uppercase tracking-[0.08em] text-ink">
                            {u.id}
                          </span>
                          <span className="block text-[10px] text-ink-soft">{u.type}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {floors.map((floor) => (
                      <tr key={floor} className="border-t border-line">
                        <td className="p-1.5 font-medium text-ink">{floor}</td>
                        {ordered.map((u) => {
                          if (!isUnitOnFloor(t3d, floor - 1, u.id)) {
                            return (
                              <td key={u.id} className="p-1 text-center text-ink-soft/40">
                                —
                              </td>
                            );
                          }
                          const key = `${floor}-${u.id}`;
                          const val = t3d.unitStatuses?.[key] ?? "Müsait";
                          return (
                            <td key={u.id} className="p-1">
                              <select
                                value={val}
                                onChange={(e) => setUnitStatus(key, e.target.value as UnitAvailability)}
                                className={`w-full rounded border px-1.5 py-1 text-xs outline-none ${statusCls(val)}`}
                              >
                                {UNIT_STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={saveUnitStatuses}
              disabled={savingStatuses}
              className="inline-flex items-center gap-2 rounded-md bg-gold-600 px-4 py-2.5 text-sm font-medium text-petrol-900 transition-colors hover:bg-gold-400 disabled:opacity-60"
            >
              {savingStatuses ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Daire Durumlarını Kaydet
            </button>
            {statusMsg && <span className="text-sm text-ink-soft">{statusMsg}</span>}
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            Bu bölüm ayrı kaydedilir ve canlı 3D tura anında yansır (aşağıdaki genel
            &quot;Kaydet&quot; butonundan bağımsız).
          </p>
        </Section>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-gold-600 px-5 py-2.5 text-sm font-medium text-petrol-900 transition-colors hover:bg-gold-400 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Değişiklikleri Kaydet" : "Projeyi Oluştur"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="rounded-md border border-line px-5 py-2.5 text-sm transition-colors hover:border-ink-soft"
        >
          İptal
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-line bg-bg px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold-600";

function statusCls(s: string) {
  if (s === "Satıldı") return "border-red-500/40 bg-red-500/10 text-red-600";
  if (s === "Rezerve") return "border-yellow-500/40 bg-yellow-500/10 text-yellow-700";
  return "border-green-500/40 bg-green-500/10 text-green-700";
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-bg-card p-5">
      <h2 className="font-display text-base text-ink">{title}</h2>
      {hint && <p className="mb-3 mt-0.5 text-xs text-ink-soft">{hint}</p>}
      <div className={hint ? "" : "mt-4"}>{children}</div>
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono-label text-[11px] uppercase tracking-[0.08em] text-ink-soft">
        {label} {required && <span className="text-gold-700">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}
