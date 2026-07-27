export const SUPPORTED_SITE_LOCALES = ["uk", "ru", "pl", "ro", "hu", "bg", "en"] as const;

export type SiteLocale = (typeof SUPPORTED_SITE_LOCALES)[number];

export function getLocaleFromPathname(pathname?: string | null): SiteLocale {
  const normalized = pathname ? pathname.split("?")[0]?.split("#")[0] || "/" : "/";

  if (normalized === "hu") {
    return "hu";
  }

  if (normalized === "bg") {
    return "bg";
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

  if (normalized === "/bg" || normalized.startsWith("/bg/")) {
    return "bg";
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

  if (locale === "bg") {
    return normalized === "/" ? "/bg" : `/bg${normalized}`;
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

export function isBgPath(pathname: string) {
  return pathname === "/bg" || pathname.startsWith("/bg/");
}

export function isEnPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}

export function switchPathLocale(pathname: string, locale: SiteLocale) {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const basePath = isRuPath(normalized) || isPlPath(normalized) || isRoPath(normalized) || isHuPath(normalized) || isBgPath(normalized) || isEnPath(normalized)
    ? normalized.replace(/^\/(ru|pl|ro|hu|bg|en)(?=\/|$)/, "") || "/"
    : normalized;

  return getPathForLocale(basePath, locale);
}

export function getSafeLocaleSwitchPath(pathname: string, locale: SiteLocale) {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const currentLocale: SiteLocale = isEnPath(normalized) ? "en" : isBgPath(normalized) ? "bg" : isHuPath(normalized) ? "hu" : isRoPath(normalized) ? "ro" : isPlPath(normalized) ? "pl" : isRuPath(normalized) ? "ru" : "uk";
  const basePath = isRuPath(normalized) || isPlPath(normalized) || isRoPath(normalized) || isHuPath(normalized) || isBgPath(normalized) || isEnPath(normalized)
    ? normalized.replace(/^\/(ru|pl|ro|hu|bg|en)(?=\/|$)/, "") || "/"
    : normalized;

  const auroraSwitchPaths: Record<SiteLocale, string> = {
    uk: "/aurora",
    ru: "/ru/aurora",
    pl: "/pl/aurora",
    ro: "/ro/aurora-romania",
    hu: "/hu/aurora",
    bg: "/bg/aurora",
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
    itemLocale === "pl" || itemLocale === "ro" || itemLocale === "hu" || itemLocale === "bg" || itemLocale === "en";

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

  // A news article translation lives under a different slug per locale, so the
  // switcher (which only knows the pathname) cannot map it. Switching to another
  // language would otherwise land on /{locale}/news/{uk-slug}, which has no
  // article and redirects back to Ukrainian. Send it to that locale's homepage
  // instead. The news listing (/news exactly) still switches normally.
  const isNewsArticlePage = basePath.startsWith("/news/");
  if (isNewsArticlePage && locale !== currentLocale) {
    return getPathForLocale("/", locale);
  }

  // Regional pages are locale-exclusive: a Polish województwo, Hungarian vármegye,
  // Bulgarian oblast or Romanian județ/regiune/raion has no equivalent slug in
  // another language, so naively prefixing would land on a 404. Switching locale on
  // such a page goes to the target locale's homepage instead.
  const isExclusiveRegionPage =
    basePath.startsWith("/wojewodztwo/") ||
    basePath.startsWith("/varmegye/") ||
    basePath.startsWith("/municipiu/") ||
    basePath.startsWith("/regiune/") ||
    basePath.startsWith("/raion/") ||
    basePath.startsWith("/judet/") ||
    (basePath.startsWith("/oblast/") && currentLocale === "bg");
  if (isExclusiveRegionPage && locale !== currentLocale) {
    return getPathForLocale("/", locale);
  }

  // Ukrainian oblasts (uk/ru) map only between Ukrainian and Russian; switching to
  // any other locale (which has no Ukrainian oblast pages) goes to that homepage.
  if (
    basePath.startsWith("/oblast/") &&
    (currentLocale === "uk" || currentLocale === "ru") &&
    locale !== "uk" &&
    locale !== "ru"
  ) {
    return getPathForLocale("/", locale);
  }

  return getPathForLocale(basePath, locale);
}
