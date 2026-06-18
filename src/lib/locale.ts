export const SUPPORTED_SITE_LOCALES = ["uk", "ru", "pl", "ro", "hu", "en"] as const;

export type SiteLocale = (typeof SUPPORTED_SITE_LOCALES)[number];

export function getLocaleFromPathname(pathname?: string | null): SiteLocale {
  const normalized = pathname ? pathname.split("?")[0]?.split("#")[0] || "/" : "/";

  if (normalized === "hu") {
    return "hu";
  }

  if (normalized === "en") {
    return "en";
  }

  if (normalized === "ro") {
    return "ro";
  }

  if (normalized === "pl") {
    return "pl";
  }

  if (normalized === "ru") {
    return "ru";
  }

  if (normalized === "/hu" || normalized.startsWith("/hu/")) {
    return "hu";
  }

  if (normalized === "/en" || normalized.startsWith("/en/")) {
    return "en";
  }

  if (normalized === "/ro" || normalized.startsWith("/ro/")) {
    return "ro";
  }

  if (normalized === "/pl" || normalized.startsWith("/pl/")) {
    return "pl";
  }

  if (normalized === "/ru" || normalized.startsWith("/ru/")) {
    return "ru";
  }

  return "uk";
}

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

  if (locale === "en") {
    return normalized === "/" ? "/en" : `/en${normalized}`;
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

export function isEnPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}

export function switchPathLocale(pathname: string, locale: SiteLocale) {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const basePath = isRuPath(normalized) || isPlPath(normalized) || isRoPath(normalized) || isHuPath(normalized) || isEnPath(normalized)
    ? normalized.replace(/^\/(ru|pl|ro|hu|en)(?=\/|$)/, "") || "/"
    : normalized;

  return getPathForLocale(basePath, locale);
}

export function getSafeLocaleSwitchPath(pathname: string, locale: SiteLocale) {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const currentLocale: SiteLocale = isEnPath(normalized) ? "en" : isHuPath(normalized) ? "hu" : isRoPath(normalized) ? "ro" : isPlPath(normalized) ? "pl" : isRuPath(normalized) ? "ru" : "uk";
  const basePath = isRuPath(normalized) || isPlPath(normalized) || isRoPath(normalized) || isHuPath(normalized) || isEnPath(normalized)
    ? normalized.replace(/^\/(ru|pl|ro|hu|en)(?=\/|$)/, "") || "/"
    : normalized;

  const auroraSwitchPaths: Record<SiteLocale, string> = {
    uk: "/aurora",
    ru: "/ru/aurora",
    pl: "/pl/aurora",
    ro: "/ro/aurora-romania",
    hu: "/hu/aurora",
    en: "/en/aurora",
  };

  if (basePath === "/aurora" || basePath === "/aurora-romania" || basePath === "/aurora-moldova") {
    if (locale === "ro" && (basePath === "/aurora-romania" || basePath === "/aurora-moldova")) {
      return normalized;
    }

    return auroraSwitchPaths[locale];
  }

  const isCityPage = basePath.startsWith("/city/");
  const isCitiesCatalogPage = basePath === "/cities" || basePath.startsWith("/cities/");
  const isUnsupportedCityLocale = (itemLocale: SiteLocale) =>
    itemLocale === "pl" || itemLocale === "ro" || itemLocale === "hu" || itemLocale === "en";

  if (isCityPage && (isUnsupportedCityLocale(currentLocale) || isUnsupportedCityLocale(locale))) {
    return getPathForLocale("/", locale);
  }

  if (isCitiesCatalogPage && isUnsupportedCityLocale(locale)) {
    return getPathForLocale("/", locale);
  }

  const isSunPage =
    basePath === "/sunrise" ||
    basePath === "/sunrise-tomorrow" ||
    basePath === "/sunset" ||
    basePath === "/sunset-tomorrow" ||
    /^\/country\/[^/]+\/sun/.test(basePath);

  if (isSunPage && locale === "en") {
    return getPathForLocale("/", locale);
  }

  return getPathForLocale(basePath, locale);
}
