import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import FrameReveal from "@/components/FrameReveal";
import Reveal from "@/components/Reveal";
import ValueGrid from "@/components/ValueGrid";
import AnimatedHeading from "@/components/AnimatedHeading";
import MagneticButton from "@/components/MagneticButton";
import Testimonials from "@/components/Testimonials";
import { readProjects, readSite } from "@/lib/data";
import { getT } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = readProjects();
  const siteConfig = readSite();
  const { t } = await getT();
  return (
    <>
      <Hero />

      {/* FEATURED PROJECTS */}
      <section className="mx-auto max-w-6xl px-5 md:px-8 py-24 md:py-32">
        <Reveal>
          <FrameReveal
            label={projects.length > 1 ? t("home.featured.many") : t("home.featured.one")}
            className="mb-10"
          />
        </Reveal>

        {projects.length > 1 && (
          <Reveal delay={60}>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-ink max-w-md text-balance">
                {t("home.featured.heading")}
              </h2>
              <Link
                href="/portfoy"
                className="group inline-flex items-center gap-1.5 font-mono-label text-[12px] uppercase tracking-[0.12em] text-gold-700 shrink-0"
              >
                {t("home.allPortfolio")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        )}

        {projects.length === 1 ? (
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <Link
                href={`/portfoy/${projects[0].slug}`}
                className="group block relative aspect-[4/3] overflow-hidden rounded-sm border border-line transition-all duration-500 hover:border-gold-600/50 hover:shadow-[0_20px_50px_-25px_rgba(20,33,31,0.6)]"
              >
                <Image
                  src={projects[0].image}
                  alt={projects[0].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-petrol-900/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {projects[0].isRender && (
                  <div className="absolute top-4 left-4 rounded-full bg-petrol-900/80 px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-[0.1em] text-gold-200">
                    3D Görselleştirme
                  </div>
                )}
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <span className="inline-block rounded-full bg-petrol-700 px-3.5 py-1.5 font-mono-label text-[11px] uppercase tracking-[0.1em] text-gold-200 mb-5">
                {projects[0].status}
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-ink mb-4 text-balance">
                {projects[0].title}
              </h2>
              <p className="text-ink-soft leading-relaxed mb-6 max-w-md">
                {projects[0].description}
              </p>
              <div className="flex items-center gap-5 mb-8 font-mono-label text-[12px] uppercase tracking-[0.08em] text-ink-soft">
                <span>{projects[0].location}</span>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <span>{projects[0].year}</span>
              </div>
              <Link
                href={`/portfoy/${projects[0].slug}`}
                className="group inline-flex items-center gap-1.5 font-mono-label text-[12px] uppercase tracking-[0.12em] text-gold-700"
              >
                {t("home.viewGallery")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {projects.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 120}>
                <Link
                  href={`/portfoy/${p.slug}`}
                  className="group block h-full overflow-hidden rounded-sm border border-line bg-bg-card transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-600/50 hover:shadow-[0_18px_40px_-22px_rgba(20,33,31,0.55)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-petrol-900/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute top-3 left-3 rounded-full bg-petrol-900/80 px-3 py-1 font-mono-label text-[10px] uppercase tracking-[0.1em] text-gold-200 backdrop-blur-sm">
                      {p.status}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-display text-lg text-ink transition-colors duration-300 group-hover:text-gold-700">{p.title}</h3>
                      <span className="font-mono-label text-[11px] text-ink-soft">{p.year}</span>
                    </div>
                    <p className="text-sm text-ink-soft leading-relaxed">{p.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* WHY SADEBAL */}
      <section className="bg-bg-elevated border-y border-line">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-24 md:py-32">
          <Reveal>
            <FrameReveal label={t("home.why.label")} className="mb-10" />
          </Reveal>
          <AnimatedHeading
            text={t("home.why.heading")}
            className="font-display text-3xl md:text-4xl text-ink max-w-xl mb-14 text-balance"
          />

          <ValueGrid />
        </div>
      </section>

      {/* TESTIMONIALS */}
      {siteConfig.testimonials && siteConfig.testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 md:px-8 py-24 md:py-32">
          <Reveal>
            <FrameReveal label={t("home.testimonials.label")} className="mb-14" />
          </Reveal>
          <Testimonials items={siteConfig.testimonials} />
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-petrol-900">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-24 md:py-32 text-center">
          <Reveal>
            <p className="font-mono-label text-[12px] uppercase tracking-[0.25em] text-gold-400 mb-5">
              {t("home.cta.eyebrow")}
            </p>
          </Reveal>
          <AnimatedHeading
            text={t("home.cta.heading")}
            className="font-display text-3xl md:text-5xl text-[#F7F4ED] max-w-2xl mx-auto mb-10 text-balance"
          />
          <Reveal delay={200}>
            <MagneticButton
              href="/iletisim"
              className="group inline-flex items-center gap-2 rounded-full bg-gold-600 px-7 py-3.5 text-sm font-medium text-petrol-900 transition-all duration-300 hover:bg-gold-400 hover:shadow-[0_14px_40px_-10px_rgba(201,162,75,0.7)]"
            >
              {t("home.cta.button")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
