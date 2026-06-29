/**
 * Site/contact config now lives in `data/site.json` and is read/written
 * through `src/lib/data.ts` (use `readSite()` in server components).
 * The type lives here so it can be imported anywhere.
 */

/** A single frequently-asked question and its answer. */
export type FaqItem = { question: string; answer: string };

/** A customer / partner testimonial. `role` and `photo` are optional. */
export type Testimonial = {
  name: string;
  role?: string;
  quote: string;
  photo?: string;
};

export type SiteConfig = {
  companyName: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  addressShort: string;
  addressFull: string;
  founder: { name: string; title: string };
  workingHours: string;
  social: { instagram: string; facebook: string; linkedin: string };
  /** Frequently asked questions (rendered as an accordion on the contact page). */
  faq?: FaqItem[];
  /** Customer / partner testimonials (rendered as a slider on the homepage). */
  testimonials?: Testimonial[];
};
