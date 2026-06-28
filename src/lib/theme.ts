export const THEME_KEY = "sadebal-theme";

export function getStoredTheme(): "light" | "dark" | null {
  if (typeof window === "undefined") return null;
  const t = window.localStorage.getItem(THEME_KEY);
  return t === "dark" || t === "light" ? t : null;
}

export function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(THEME_KEY, theme);
}
