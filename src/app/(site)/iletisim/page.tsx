import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import FrameReveal from "@/components/FrameReveal";
import ContactForm from "@/components/ContactForm";
import AnimatedHeading from "@/components/AnimatedHeading";
import { readSite } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Sadebal Yapı ile iletişime geçin: telefon, e-posta veya iletişim formu üzerinden bize ulaşabilirsiniz.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  const siteConfig = readSite();
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
      <FrameReveal label="İletişim" className="mb-10" />
      <AnimatedHeading
        text="Projenizi konuşalım"
        as="h1"
        className="font-display text-4xl md:text-5xl text-ink max-w-2xl mb-4 text-balance"
      />
      <p className="text-ink-soft max-w-xl mb-14 leading-relaxed">
        Sorularınız için formu doldurun veya doğrudan bizi arayın, en kısa
        sürede dönüş yapalım.
      </p>

      <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <InfoRow icon={Phone} label="Telefon" value={siteConfig.phoneDisplay} href={`tel:${siteConfig.phoneHref}`} />
            <InfoRow icon={Mail} label="E-posta" value={siteConfig.email} href={`mailto:${siteConfig.email}`} />
            <InfoRow icon={MapPin} label="Adres" value={siteConfig.addressShort} />
            <InfoRow icon={Clock} label="Çalışma Saatleri" value={siteConfig.workingHours} />
          </div>

          {/*
            MAP — placeholder.
            This block is intentionally simple until we settle the
            custom map setup discussed separately (likely an embedded
            interactive map tied to project locations, styled to match
            the brand rather than a default Google Maps look).
          */}
          <div className="aspect-[4/3] rounded-sm border border-dashed border-line bg-bg-elevated flex flex-col items-center justify-center text-center px-6">
            <MapPin className="h-6 w-6 text-gold-600 mb-3" strokeWidth={1.5} />
            <p className="font-mono-label text-[11px] uppercase tracking-[0.1em] text-ink-soft">
              Harita alanı — özel kurulum bekleniyor
            </p>
          </div>
        </div>

        <div className="rounded-sm border border-line bg-bg-card p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line">
        <Icon className="h-4 w-4 text-gold-600" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-mono-label text-[11px] uppercase tracking-[0.1em] text-ink-soft mb-0.5">
          {label}
        </p>
        {href ? (
          <a href={href} className="text-ink hover:text-gold-700 transition-colors">
            {value}
          </a>
        ) : (
          <p className="text-ink">{value}</p>
        )}
      </div>
    </div>
  );
}
