import { MapPin } from "lucide-react";

export default function ProjectMap({
  coordinates,
  title,
}: {
  coordinates?: { lat: number; lng: number } | null;
  title: string;
}) {
  if (!coordinates) {
    return (
      <div className="aspect-[16/9] rounded-sm border border-dashed border-line bg-bg-elevated flex flex-col items-center justify-center text-center px-6">
        <MapPin className="h-6 w-6 text-gold-600 mb-3" strokeWidth={1.5} />
        <p className="font-mono-label text-[11px] uppercase tracking-[0.1em] text-ink-soft">
          Konum bilgisi yakında eklenecek
        </p>
      </div>
    );
  }

  const { lat, lng } = coordinates;
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

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
