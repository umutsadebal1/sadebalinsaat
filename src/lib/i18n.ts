export const LOCALES = ["tr", "en", "ar", "ku"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "tr";

export const LOCALE_NAMES: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
  ku: "Kurdî",
};

/** Short label shown on the switcher button. */
export const LOCALE_SHORT: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  ar: "AR",
  ku: "KU",
};

/** Right-to-left locales. */
export const RTL_LOCALES: Locale[] = ["ar"];

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

export const LOCALE_COOKIE = "locale";
