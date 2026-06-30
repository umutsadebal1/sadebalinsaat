import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { readSite } from "@/lib/data";
import { getT } from "@/lib/locale-server";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M15 8.5h-2c-.55 0-1 .45-1 1V12h3l-.4 3h-2.6v7h-3v-7H8v-3h1V9c0-2.2 1.3-3.5 3.5-3.5H15v3z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7.5" y1="10.5" x2="7.5" y2="16.5" />
      <circle cx="7.5" cy="7.2" r="0.4" fill="currentColor" stroke="none" />
      <path d="M11.5 16.5v-3.5c0-1.4 1-2.5 2.2-2.5s2.1 1 2.1 2.5v3.5" />
      <line x1="11.5" y1="10.5" x2="11.5" y2="16.5" />
    </svg>
  );
}

export default async function Footer() {
  const year = new Date().getFullYear();
  const siteConfig = readSite();
  const { t } = await getT();

  return (
    <footer className="border-t border-line bg-bg-elevated">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-4 inline-flex">
              <Image
                src="/images/logo-full.png"
                alt="Sadebal Yapı"
                width={384}
                height={122}
                className="h-11 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-ink-soft max-w-xs">
              {t("footer.blurb")}
            </p>
          </div>

          <div>
            <h3 className="font-mono-label text-[11px] uppercase tracking-[0.15em] text-gold-700 mb-4">
              {t("footer.explore")}
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-ink-soft">
              <li><Link href="/" className="hover:text-ink transition-colors">{t("nav.home")}</Link></li>
              <li><Link href="/portfoy" className="hover:text-ink transition-colors">{t("nav.portfolio")}</Link></li>
              <li><Link href="/hakkimizda" className="hover:text-ink transition-colors">{t("nav.about")}</Link></li>
              <li><Link href="/iletisim" className="hover:text-ink transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono-label text-[11px] uppercase tracking-[0.15em] text-gold-700 mb-4">
              {t("footer.contact")}
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-ink-soft">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-gold-600 shrink-0" />
                <a href={`tel:${siteConfig.phoneHref}`} className="hover:text-ink transition-colors">
                  <bdi>{siteConfig.phoneDisplay}</bdi>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-gold-600 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-ink transition-colors">
                  <bdi>{siteConfig.email}</bdi>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-gold-600 shrink-0 mt-0.5" />
                <span>{siteConfig.addressShort}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono-label text-[11px] uppercase tracking-[0.15em] text-gold-700 mb-4">
              {t("footer.social")}
            </h3>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-gold-600 hover:text-gold-600"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-gold-600 hover:text-gold-600"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-gold-600 hover:text-gold-600"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center gap-4 border-t border-line pt-6 md:flex-row md:justify-between">
          <p className="font-mono-label text-[11px] tracking-wide text-ink-soft">
            © {year} Sadebal Yapı. {t("footer.rights")}
          </p>
          <p className="font-mono-label text-[11px] tracking-wide text-ink-soft">
            {t("footer.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}
