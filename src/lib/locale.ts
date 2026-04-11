export const SUPPORTED_SITE_LOCALES = ["uk", "ru"] as const;

export type SiteLocale = (typeof SUPPORTED_SITE_LOCALES)[number];

export function getPathForLocale(path: string, locale: SiteLocale) {
  const normalized = path === "/" ? "/" : path.replace(/\/$/, "");

  if (locale === "uk") {
    return normalized;
  }

  return normalized === "/" ? "/ru" : `/ru${normalized}`;
}

export function isRuPath(pathname: string) {
  return pathname === "/ru" || pathname.startsWith("/ru/");
}

export function switchPathLocale(pathname: string, locale: SiteLocale) {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const basePath = isRuPath(normalized)
    ? normalized.replace(/^\/ru(?=\/|$)/, "") || "/"
    : normalized;

  return getPathForLocale(basePath, locale);
}
