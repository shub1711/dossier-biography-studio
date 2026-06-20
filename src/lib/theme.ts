export const THEME_STORAGE_KEY = "dossier-theme";
export const THEME_COOKIE_KEY = "dossier-theme";

export type ThemeMode = "light" | "dark";

export function parseThemeMode(value: string | null | undefined): ThemeMode {
  return value === "light" ? "light" : "dark";
}

export function setThemeCookie(mode: ThemeMode) {
  document.cookie = `${THEME_COOKIE_KEY}=${mode};path=/;max-age=31536000;SameSite=Lax`;
}
