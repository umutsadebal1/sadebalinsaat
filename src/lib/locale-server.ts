import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./i18n";
import { translate } from "./messages";

/** Current locale from the cookie (server components). Defaults to Turkish. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Locale + a bound translate function for server components. */
export async function getT(): Promise<{ locale: Locale; t: (key: string) => string }> {
  const locale = await getLocale();
  return { locale, t: (key: string) => translate(locale, key) };
}
