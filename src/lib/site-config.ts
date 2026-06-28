/**
 * Site/contact config now lives in `data/site.json` and is read/written
 * through `src/lib/data.ts` (use `readSite()` in server components).
 * The type lives here so it can be imported anywhere.
 */
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
};
