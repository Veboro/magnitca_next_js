export const SUPPORTED_SITE_LOCALES = ["uk", "ru", "pl", "ro", "hu"] as const;

export type SiteLocale = (typeof SUPPORTED_SITE_LOCALES)[number];

export function getPathForLocale(path: string, locale: SiteLocale) {
  const normalized = path === "/" ? "/" : path.replace(/\/$/, "");

  if (locale === "uk") {
    return normalized;
  }

  if (locale === "ru") {
    return normalized === "/" ? "/ru" : `/ru${normalized}`;
  }

  if (locale === "pl") {
    return normalized === "/" ? "/pl" : `/pl${normalized}`;
  }

  if (locale === "hu") {
    return normalized === "/" ? "/hu" : `/hu${normalized}`;
  }

  return normalized === "/" ? "/ro" : `/ro${normalized}`;
}

export function isRuPath(pathname: string) {
  return pathname === "/ru" || pathname.startsWith("/ru/");
}

export function isPlPath(pathname: string) {
  return pathname === "/pl" || pathname.startsWith("/pl/");
}

export function isRoPath(pathname: string) {
  return pathname === "/ro" || pathname.startsWith("/ro/");
}

export function isHuPath(pathname: string) {
  return pathname === "/hu" || pathname.startsWith("/hu/");
}

export function switchPathLocale(pathname: string, locale: SiteLocale) {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const basePath = isRuPath(normalized) || isPlPath(normalized) || isRoPath(normalized) || isHuPath(normalized)
    ? normalized.replace(/^\/(ru|pl|ro|hu)(?=\/|$)/, "") || "/"
    : normalized;

  return getPathForLocale(basePath, locale);
}

export function getSafeLocaleSwitchPath(pathname: string, locale: SiteLocale) {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const currentLocale: SiteLocale = isHuPath(normalized) ? "hu" : isRoPath(normalized) ? "ro" : isPlPath(normalized) ? "pl" : isRuPath(normalized) ? "ru" : "uk";
  const basePath = isRuPath(normalized) || isPlPath(normalized) || isRoPath(normalized) || isHuPath(normalized)
    ? normalized.replace(/^\/(ru|pl|ro|hu)(?=\/|$)/, "") || "/"
    : normalized;

  const isCityPage = basePath.startsWith("/city/");
  const isCitiesCatalogPage = basePath === "/cities" || basePath.startsWith("/cities/");
  const isNewsPage = basePath === "/news" || basePath.startsWith("/news/");

  if (isCityPage && (currentLocale === "pl" || locale === "pl" || currentLocale === "ro" || locale === "ro" || currentLocale === "hu" || locale === "hu")) {
    return getPathForLocale("/", locale);
  }

  if (isCitiesCatalogPage && (locale === "pl" || locale === "ro" || locale === "hu")) {
    return getPathForLocale("/", locale);
  }

  if (isNewsPage && (currentLocale === "pl" || locale === "pl" || currentLocale === "ro" || locale === "ro" || currentLocale === "hu" || locale === "hu")) {
    return getPathForLocale("/", locale);
  }

  return getPathForLocale(basePath, locale);
}
