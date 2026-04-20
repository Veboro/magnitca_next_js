export const SUPPORTED_SITE_LOCALES = ["uk", "ru", "pl"] as const;

export type SiteLocale = (typeof SUPPORTED_SITE_LOCALES)[number];

export function getPathForLocale(path: string, locale: SiteLocale) {
  const normalized = path === "/" ? "/" : path.replace(/\/$/, "");

  if (locale === "uk") {
    return normalized;
  }

  if (locale === "ru") {
    return normalized === "/" ? "/ru" : `/ru${normalized}`;
  }

  return normalized === "/" ? "/pl" : `/pl${normalized}`;
}

export function isRuPath(pathname: string) {
  return pathname === "/ru" || pathname.startsWith("/ru/");
}

export function isPlPath(pathname: string) {
  return pathname === "/pl" || pathname.startsWith("/pl/");
}

export function switchPathLocale(pathname: string, locale: SiteLocale) {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const basePath = isRuPath(normalized) || isPlPath(normalized)
    ? normalized.replace(/^\/(ru|pl)(?=\/|$)/, "") || "/"
    : normalized;

  return getPathForLocale(basePath, locale);
}

export function getSafeLocaleSwitchPath(pathname: string, locale: SiteLocale) {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const currentLocale: SiteLocale = isPlPath(normalized) ? "pl" : isRuPath(normalized) ? "ru" : "uk";
  const basePath = isRuPath(normalized) || isPlPath(normalized)
    ? normalized.replace(/^\/(ru|pl)(?=\/|$)/, "") || "/"
    : normalized;

  const isCityPage = basePath.startsWith("/city/");
  const isCitiesCatalogPage = basePath === "/cities" || basePath.startsWith("/cities/");
  const isNewsPage = basePath === "/news" || basePath.startsWith("/news/");

  if (isCityPage && (currentLocale === "pl" || locale === "pl")) {
    return getPathForLocale("/", locale);
  }

  if (isCitiesCatalogPage && locale === "pl") {
    return getPathForLocale("/", locale);
  }

  if (isNewsPage && (currentLocale === "pl" || locale === "pl")) {
    return getPathForLocale("/", locale);
  }

  return getPathForLocale(basePath, locale);
}
