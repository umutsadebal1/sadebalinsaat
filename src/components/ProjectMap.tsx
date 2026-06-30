import { MapPin } from "lucide-react";
import { getT } from "@/lib/locale-server";

export default async function ProjectMap({
  coordinates,
  embedUrl,
  title,
}: {
  coordinates?: { lat: number; lng: number } | null;
  /** Full Google Maps (or other) embed URL; takes precedence over coordinates. */
  embedUrl?: string;
  title: string;
}) {
  const { t } = await getT();
  const src =
    embedUrl?.trim() ||
    (coordinates
      ? `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`
      : null);

  if (!src) {
    return (
      <div className="aspect-[16/9] rounded-sm border border-dashed border-line bg-bg-elevated flex flex-col items-center justify-center text-center px-6">
        <MapPin className="h-6 w-6 text-gold-600 mb-3" strokeWidth={1.5} />
        <p className="font-mono-label text-[11px] uppercase tracking-[0.1em] text-ink-soft">
          {t("map.pending")}
        </p>
      </div>
    );
  }

  return (
    <div className="aspect-[16/9] overflow-hidden rounded-sm border border-line">
      <iframe
        src={src}
        title={`${title} konumu`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
