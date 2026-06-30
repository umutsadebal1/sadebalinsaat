import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import FrameReveal from "@/components/FrameReveal";
import ContactForm from "@/components/ContactForm";
import AnimatedHeading from "@/components/AnimatedHeading";
import FAQ from "@/components/FAQ";
import Reveal from "@/components/Reveal";
import { readSite } from "@/lib/data";
import { getT } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Sadebal Yapı ile iletişime geçin: telefon, e-posta veya iletişim formu üzerinden bize ulaşabilirsiniz.",
  alternates: { canonical: "/iletisim" },
};

export default async function ContactPage() {
  const siteConfig = readSite();
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
      <FrameReveal label={t("nav.contact")} className="mb-10" />
      <AnimatedHeading
        text={t("contact.heading")}
        as="h1"
        className="font-display text-4xl md:text-5xl text-ink max-w-2xl mb-4 text-balance"
      />
      <p className="text-ink-soft max-w-xl mb-14 leading-relaxed">
        {t("contact.intro")}
      </p>

      <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <InfoRow icon={Phone} label={t("form.phone")} value={siteConfig.phoneDisplay} href={`tel:${siteConfig.phoneHref}`} />
            <InfoRow icon={Mail} label={t("form.email")} value={siteConfig.email} href={`mailto:${siteConfig.email}`} />
            <InfoRow icon={MapPin} label={t("contact.address")} value={siteConfig.addressShort} />
            <InfoRow icon={Clock} label={t("contact.hours")} value={siteConfig.workingHours} />
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
              {t("contact.mapPlaceholder")}
            </p>
          </div>
        </div>

        <div className="rounded-sm border border-line bg-bg-card p-6 md:p-8">
          <ContactForm />
        </div>
      </div>

      {siteConfig.faq && siteConfig.faq.length > 0 && (
        <div className="mt-24 md:mt-32">
          <Reveal>
            <FrameReveal label={t("contact.faqLabel")} className="mb-8" />
          </Reveal>
          <AnimatedHeading
            text={t("contact.faqHeading")}
            as="h2"
            className="font-display text-3xl md:text-4xl text-ink mb-10 max-w-xl text-balance"
          />
          <FAQ items={siteConfig.faq} />
        </div>
      )}
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
