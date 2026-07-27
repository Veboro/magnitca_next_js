"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, CalendarDays, ChevronDown, ClipboardCheck, Eye, Gauge, HeartPulse, MapPin, MessageSquareText, Moon, Newspaper, Search, Sparkles, Sunrise, Sunset, Wind, X } from "lucide-react";
import { getPathForLocale, getSafeLocaleSwitchPath, isBgPath, isEnPath, isHuPath, isPlPath, isRoPath, isRuPath, type SiteLocale } from "@/lib/locale";
import { ALL_UK_CITIES } from "@/data/cities";
import { CITIES_MD } from "@/data/cities-md";
import { CITIES_HU } from "@/data/cities-hu";
import { CITIES_BG } from "@/data/cities-bg";
import { CITIES_PL } from "@/data/cities-pl";
import { CITIES_RU, getRuCitySlug } from "@/data/cities-ru";
import { getOblastTitle, OBLAST_ROUTE_MAP } from "@/lib/oblast-routes";
import { getCountryRegionPath, getCountryRegionsByLocale } from "@/lib/country-region-routes";

type NavIcon = typeof Activity;
type NavLeaf = { href: string; label: string; icon: NavIcon };
type NavGroup = { key: string; label: string; icon: NavIcon; items: NavLeaf[] };
type NavEntry = NavLeaf | NavGroup;

function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

// Localized labels. Single high-traffic pages stay flat; the rest are grouped
// into a few dropdowns so the bar stays short (and doesn't scroll on mobile).
const NAV_TEXT: Record<string, Record<SiteLocale, string>> = {
  home: { uk: "Головна", ru: "Главная", pl: "Start", ro: "Acasă", hu: "Főoldal", bg: "Начало", en: "Home" },
  kp: { uk: "Kp індекс", ru: "Kp индекс", pl: "Indeks Kp", ro: "Indice Kp", hu: "Kp-index", bg: "Kp-индекс", en: "Kp index" },
  solarWind: { uk: "Сонячний вітер", ru: "Солнечный ветер", pl: "Wiatr słoneczny", ro: "Vânt solar", hu: "Napszél", bg: "Слънчев вятър", en: "Solar wind" },
  stormCalendar: { uk: "Календар бур", ru: "Календарь бурь", pl: "Kalendarz burz", ro: "Calendar furtuni", hu: "Viharnaptár", bg: "Календар на бурите", en: "Storm calendar" },
  moonCalendar: { uk: "Місячний календар", ru: "Лунный календарь", pl: "Kalendarz księżycowy", ro: "Calendar lunar", hu: "Holdnaptár", bg: "Лунен календар", en: "Moon calendar" },
  aurora: { uk: "Північне сяйво", ru: "Северное сияние", pl: "Zorza polarna", ro: "Aurora boreală", hu: "Sarki fény", bg: "Северно сияние", en: "Aurora" },
  test: { uk: "Тест", ru: "Тест", pl: "Test", ro: "Test", hu: "Teszt", bg: "Тест", en: "Test" },
  reviews: { uk: "Відгуки", ru: "Отзывы", pl: "Opinie", ro: "Recenzii", hu: "Vélemények", bg: "Отзиви", en: "Reviews" },
  groupCalendars: { uk: "Календарі", ru: "Календари", pl: "Kalendarze", ro: "Calendare", hu: "Naptárak", bg: "Календари", en: "Calendars" },
  groupSky: { uk: "Небо", ru: "Небо", pl: "Niebo", ro: "Cer", hu: "Égbolt", bg: "Небе", en: "Sky" },
  groupWellbeing: { uk: "Самопочуття", ru: "Самочувствие", pl: "Samopoczucie", ro: "Stare de bine", hu: "Közérzet", bg: "Самочувствие", en: "Wellbeing" },
};

// News page exists only in these locales.
const NEWS_LABEL: Partial<Record<SiteLocale, string>> = { uk: "Новини", ru: "Новости", en: "News" };

// Language switcher: each language shown by its own autonym.
const LOCALE_ORDER: SiteLocale[] = ["uk", "ru", "pl", "ro", "hu", "bg", "en"];
const LOCALE_LANG: Record<SiteLocale, string> = {
  uk: "Українська",
  ru: "Русский",
  pl: "Polski",
  ro: "Română",
  hu: "Magyar",
  bg: "Български",
  en: "English",
};

const copy: Record<SiteLocale, { brand: string; tagline: string }> = {
  uk: {
    brand: "Магнітка",
    tagline: "Космічна погода та магнітні бурі",
  },
  ru: {
    brand: "Магнитка",
    tagline: "Космическая погода и магнитные бури",
  },
  pl: {
    brand: "Magnitca",
    tagline: "Pogoda kosmiczna i burze magnetyczne",
  },
  ro: {
    brand: "Magnitca",
    tagline: "Vreme spațială și furtuni magnetice",
  },
  hu: {
    brand: "Magnitca",
    tagline: "Űridőjárás és mágneses viharok",
  },
  bg: {
    brand: "Magnitca",
    tagline: "Космическо време и магнитни бури",
  },
  en: {
    brand: "Magnitca",
    tagline: "Space weather and magnetic storms",
  },
};

type SearchCityItem = {
  name: string;
  href: string;
  searchText: string;
};

const flagIconStops: Partial<Record<SiteLocale, string[]>> = {
  pl: ["#ffffff", "#ffffff", "#dc143c", "#dc143c"],
  ro: ["#002b7f", "#002b7f", "#fcd116", "#ce1126", "#ce1126"],
  hu: ["#ce2939", "#ce2939", "#ffffff", "#477050", "#477050"],
  bg: ["#ffffff", "#ffffff", "#00966e", "#d62612", "#d62612"],
};

function BrandIcon({ locale }: { locale: SiteLocale }) {
  const stops = flagIconStops[locale];

  if (!stops) {
    return <Activity className="h-5 w-5" />;
  }

  const gradientId = `brand-icon-${locale}`;

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke={`url(#${gradientId})`}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
          {stops.map((color, index) => (
            <stop
              key={`${color}-${index}`}
              offset={`${(index / Math.max(stops.length - 1, 1)) * 100}%`}
              stopColor={color}
            />
          ))}
        </linearGradient>
      </defs>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

// Sunrise/sunset pages, nested under the "Sky" dropdown. Hrefs are locale-agnostic
// (prefixed via getPathForLocale at render time) so grouping logic stays uniform.
const sunItems: Record<SiteLocale, Array<{ href: string; label: string }>> = {
  uk: [
    { href: "/sunrise", label: "Схід сьогодні" },
    { href: "/sunrise-tomorrow", label: "Схід завтра" },
    { href: "/sunset", label: "Захід сьогодні" },
    { href: "/sunset-tomorrow", label: "Захід завтра" },
  ],
  ru: [
    { href: "/sunrise", label: "Восход сегодня" },
    { href: "/sunrise-tomorrow", label: "Восход завтра" },
    { href: "/sunset", label: "Закат сегодня" },
    { href: "/sunset-tomorrow", label: "Закат завтра" },
  ],
  ro: [
    { href: "/country/moldova/sunrise", label: "Moldova: răsărit azi" },
    { href: "/country/moldova/sunrise-tomorrow", label: "Moldova: răsărit mâine" },
    { href: "/country/moldova/sunset", label: "Moldova: apus azi" },
    { href: "/country/moldova/sunset-tomorrow", label: "Moldova: apus mâine" },
    { href: "/country/romania/sunrise", label: "România: răsărit azi" },
    { href: "/country/romania/sunrise-tomorrow", label: "România: răsărit mâine" },
    { href: "/country/romania/sunset", label: "România: apus azi" },
    { href: "/country/romania/sunset-tomorrow", label: "România: apus mâine" },
  ],
  pl: [
    { href: "/sunrise", label: "Wschód dzisiaj" },
    { href: "/sunrise-tomorrow", label: "Wschód jutro" },
    { href: "/sunset", label: "Zachód dzisiaj" },
    { href: "/sunset-tomorrow", label: "Zachód jutro" },
  ],
  hu: [
    { href: "/sunrise", label: "Napkelte ma" },
    { href: "/sunrise-tomorrow", label: "Napkelte holnap" },
    { href: "/sunset", label: "Napnyugta ma" },
    { href: "/sunset-tomorrow", label: "Napnyugta holnap" },
  ],
  bg: [
    { href: "/sunrise", label: "Изгрев днес" },
    { href: "/sunrise-tomorrow", label: "Изгрев утре" },
    { href: "/sunset", label: "Залез днес" },
    { href: "/sunset-tomorrow", label: "Залез утре" },
  ],
  en: [],
};

function getSunMenuIcon(href: string) {
  return href.includes("sunrise") ? Sunrise : Sunset;
}

// Assembles the grouped top navigation for a locale. Groups that end up with a
// single item (e.g. English "Sky" = only Aurora) collapse to a flat link.
function buildNavEntries(locale: SiteLocale): NavEntry[] {
  const auroraHref = locale === "ro" ? "/aurora-romania" : "/aurora";
  const sky: NavLeaf[] = [
    { href: auroraHref, label: NAV_TEXT.aurora[locale], icon: Eye },
    ...sunItems[locale].map((item) => ({ href: item.href, label: item.label, icon: getSunMenuIcon(item.href) })),
  ];

  const entries: NavEntry[] = [
    { href: "/", label: NAV_TEXT.home[locale], icon: Activity },
    { href: "/kp-index", label: NAV_TEXT.kp[locale], icon: Gauge },
    { href: "/solar-wind", label: NAV_TEXT.solarWind[locale], icon: Wind },
    {
      key: "calendars",
      label: NAV_TEXT.groupCalendars[locale],
      icon: CalendarDays,
      items: [
        { href: "/calendar", label: NAV_TEXT.stormCalendar[locale], icon: CalendarDays },
        { href: "/moon-calendar", label: NAV_TEXT.moonCalendar[locale], icon: Moon },
      ],
    },
    { key: "sky", label: NAV_TEXT.groupSky[locale], icon: Sparkles, items: sky },
    {
      key: "wellbeing",
      label: NAV_TEXT.groupWellbeing[locale],
      icon: HeartPulse,
      items: [
        { href: "/test", label: NAV_TEXT.test[locale], icon: ClipboardCheck },
        { href: "/feeling", label: NAV_TEXT.reviews[locale], icon: MessageSquareText },
      ],
    },
  ];

  const news = NEWS_LABEL[locale];
  if (news) {
    entries.push({ href: "/news", label: news, icon: Newspaper });
  }

  return entries
    .filter((entry) => !(isNavGroup(entry) && entry.items.length === 0))
    .map((entry) => (isNavGroup(entry) && entry.items.length === 1 ? entry.items[0] : entry));
}

export function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const locale: SiteLocale = pathname && isEnPath(pathname) ? "en" : pathname && isBgPath(pathname) ? "bg" : pathname && isHuPath(pathname) ? "hu" : pathname && isRoPath(pathname) ? "ro" : pathname && isPlPath(pathname) ? "pl" : pathname && isRuPath(pathname) ? "ru" : "uk";
  const pathnameValue = pathname || "/";
  const [cityQuery, setCityQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileLocaleOpen, setMobileLocaleOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const mobileSearchOverlayRef = useRef<HTMLDivElement | null>(null);
  const [localeLinks, setLocaleLinks] = useState<Record<SiteLocale, string | null>>({
    uk: getSafeLocaleSwitchPath(pathnameValue, "uk"),
    ru: getSafeLocaleSwitchPath(pathnameValue, "ru"),
    pl: getSafeLocaleSwitchPath(pathnameValue, "pl"),
    ro: getSafeLocaleSwitchPath(pathnameValue, "ro"),
    hu: getSafeLocaleSwitchPath(pathnameValue, "hu"),
    bg: getSafeLocaleSwitchPath(pathnameValue, "bg"),
    en: getSafeLocaleSwitchPath(pathnameValue, "en"),
  });

  const searchCopy = {
    uk: {
      placeholder: "Пошук міста або області",
      empty: "Нічого не знайдено",
      citySection: "Сторінки міст",
      oblastSection: "Сторінки областей",
    },
    ru: {
      placeholder: "Поиск города или области",
      empty: "Ничего не найдено",
      citySection: "Страницы городов",
      oblastSection: "Страницы областей",
    },
    pl: {
      placeholder: "Szukaj miasta",
      empty: "Nic nie znaleziono",
      citySection: "Strony miast",
      oblastSection: "Strony obwodow",
    },
    ro: {
      placeholder: "Caută orașul",
      empty: "Nimic găsit",
      citySection: "Orașe",
      oblastSection: "Regiuni",
    },
    hu: {
      placeholder: "Keresés város vagy oldal szerint",
      empty: "Nincs találat",
      citySection: "Városoldalak",
      oblastSection: "Régiók",
    },
    bg: {
      placeholder: "Търсене на град или област",
      empty: "Няма резултати",
      citySection: "Страници на градове",
      oblastSection: "Области",
    },
    en: {
      placeholder: "Search pages",
      empty: "No results found",
      citySection: "Pages",
      oblastSection: "Regions",
    },
  } as const;

  const citySearchItems = useMemo<SearchCityItem[]>(() => {
    if (locale === "en") {
      return [
        { name: "Kp index", href: "/en/kp-index", searchText: "kp index geomagnetic activity" },
        { name: "Solar wind", href: "/en/solar-wind", searchText: "solar wind speed density bz" },
        { name: "Magnetic storm calendar", href: "/en/calendar", searchText: "magnetic storm calendar forecast" },
        { name: "Moon calendar", href: "/en/moon-calendar", searchText: "moon calendar lunar phases" },
        { name: "News", href: "/en/news", searchText: "news magnetic storms" },
        { name: "Sensitivity test", href: "/en/test", searchText: "test weather sensitivity" },
        { name: "FAQ", href: "/en/faq", searchText: "faq questions" },
      ];
    }

    if (locale === "ro") {
      return CITIES_MD.map((city) => ({
        name: city.name,
        href: `/ro/city/${city.slug}`,
        searchText: `${city.name} ${city.slug} ${city.country ?? ""}`.toLowerCase(),
      }));
    }

    if (locale === "pl") {
      return CITIES_PL.map((city) => ({
        name: city.name,
        href: `/pl/city/${city.slug}`,
        searchText: `${city.name} ${city.slug}`.toLowerCase(),
      }));
    }

    if (locale === "hu") {
      return CITIES_HU.map((city) => ({
        name: city.name,
        href: `/hu/city/${city.slug}`,
        searchText: `${city.name} ${city.slug}`.toLowerCase(),
      }));
    }

    if (locale === "bg") {
      return CITIES_BG.map((city) => ({
        name: city.name,
        href: `/bg/city/${city.slug}`,
        searchText: `${city.name} ${city.slug}`.toLowerCase(),
      }));
    }

    if (locale === "ru") {
      return ALL_UK_CITIES.map((city) => {
        const localized = CITIES_RU[city.slug];
        const citySlug = getRuCitySlug(city);
        const cityName = localized?.name || city.name;
        return {
          name: cityName,
          href: `/ru/city/${citySlug}`,
          searchText: `${cityName} ${citySlug} ${city.name}`.toLowerCase(),
        };
      });
    }

    return ALL_UK_CITIES.map((city) => ({
      name: city.name,
      href: `/city/${city.slug}`,
      searchText: `${city.name} ${city.slug}`.toLowerCase(),
    }));
  }, [locale]);

  const oblastSearchItems = useMemo<SearchCityItem[]>(() => {
    if (locale === "en") {
      return [];
    }

    if (locale === "pl" || locale === "ro" || locale === "hu" || locale === "bg") {
      return getCountryRegionsByLocale(locale).map((region) => ({
        name: region.title,
        href: getCountryRegionPath(region),
        searchText: `${region.title} ${region.slug} ${region.country}`.toLowerCase(),
      }));
    }

    return OBLAST_ROUTE_MAP.map((oblast) => {
      const name =
        locale === "ru"
          ? getOblastTitle("ru", oblast.regionKey) || oblast.regionKey
          : getOblastTitle("uk", oblast.regionKey) || oblast.regionKey;
      const slug = locale === "ru" ? oblast.slugRu : oblast.slugUk;
      const href = locale === "ru" ? `/ru/oblast/${oblast.slugRu}` : `/oblast/${oblast.slugUk}`;

      return {
        name,
        href,
        searchText: `${name} ${slug}`.toLowerCase(),
      };
    });
  }, [locale]);

  const normalizedQuery = cityQuery.trim().toLowerCase();
  const filteredCities = useMemo(() => {
    if (!normalizedQuery) {
      return citySearchItems.slice(0, 8);
    }

    return citySearchItems
      .filter((city) => city.searchText.includes(normalizedQuery))
      .slice(0, 8);
  }, [citySearchItems, normalizedQuery]);
  const filteredOblasts = useMemo(() => {
    if (!normalizedQuery) {
      return oblastSearchItems.slice(0, 8);
    }

    return oblastSearchItems
      .filter((oblast) => oblast.searchText.includes(normalizedQuery))
      .slice(0, 8);
  }, [oblastSearchItems, normalizedQuery]);

  useEffect(() => {
    const nextLinks: Record<SiteLocale, string | null> = {
      uk: getSafeLocaleSwitchPath(pathnameValue, "uk"),
      ru: getSafeLocaleSwitchPath(pathnameValue, "ru"),
      pl: getSafeLocaleSwitchPath(pathnameValue, "pl"),
      ro: getSafeLocaleSwitchPath(pathnameValue, "ro"),
      hu: getSafeLocaleSwitchPath(pathnameValue, "hu"),
      bg: getSafeLocaleSwitchPath(pathnameValue, "bg"),
      en: getSafeLocaleSwitchPath(pathnameValue, "en"),
    };

    const ukAlternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="uk"]');
    const ruAlternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="ru"]');
    const plAlternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="pl"]');
    const roAlternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="ro"]');
    const huAlternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="hu"]');
    const bgAlternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="bg"]');
    const enAlternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="en"]');

    const toRelativePath = (href: string | null | undefined) => {
      if (!href) return null;

      try {
        const url = new URL(href, window.location.origin);
        return `${url.pathname}${url.search}${url.hash}` || "/";
      } catch {
        return href.startsWith("/") ? href : null;
      }
    };

    const ukPath = toRelativePath(ukAlternate?.href);
    const ruPath = toRelativePath(ruAlternate?.href);
    const plPath = toRelativePath(plAlternate?.href);
    const roPath = toRelativePath(roAlternate?.href);
    const huPath = toRelativePath(huAlternate?.href);
    const bgPath = toRelativePath(bgAlternate?.href);
    const enPath = toRelativePath(enAlternate?.href);

    if (ukPath) {
      nextLinks.uk = ukPath;
    }

    if (ruPath) {
      nextLinks.ru = ruPath;
    }

    if (plPath) {
      nextLinks.pl = plPath;
    }

    if (roPath) {
      nextLinks.ro = roPath;
    }

    if (huPath) {
      nextLinks.hu = huPath;
    }

    if (bgPath) {
      nextLinks.bg = bgPath;
    }

    if (enPath) {
      nextLinks.en = enPath;
    }

    setLocaleLinks(nextLinks);
  }, [locale, pathnameValue]);

  useEffect(() => {
    setCityQuery("");
    setSearchOpen(false);
    setMobileLocaleOpen(false);
    setOpenMenu(null);
  }, [pathnameValue]);

  useEffect(() => {
    if (!searchOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  useEffect(() => {
    if (cityQuery.trim()) {
      setSearchOpen(true);
    }
  }, [cityQuery]);

  useEffect(() => {
    if (!searchOpen && !openMenu && !mobileLocaleOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const clickedInsideHeader = headerRef.current?.contains(target);
      const clickedInsideMobileOverlay = mobileSearchOverlayRef.current?.contains(target);

      if (clickedInsideHeader || clickedInsideMobileOverlay) return;

      setSearchOpen(false);
      setOpenMenu(null);
      setMobileLocaleOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [searchOpen, openMenu, mobileLocaleOpen]);

  const navEntries = useMemo(() => buildNavEntries(locale), [locale]);
  const resolveHref = (href: string) => getPathForLocale(href, locale);
  const isLeafActive = (href: string) => {
    const resolved = resolveHref(href);
    const roots = ["/", "/ru", "/pl", "/ro", "/hu", "/bg", "/en"];
    if (roots.includes(resolved)) return pathnameValue === resolved;
    return pathnameValue === resolved || pathnameValue.startsWith(`${resolved}/`);
  };
  const isGroupActive = (group: NavGroup) => group.items.some((item) => isLeafActive(item.href));

  return (
    <>
      {searchOpen && (
        <div ref={mobileSearchOverlayRef} className="fixed inset-0 z-[100] flex flex-col bg-background lg:hidden">
          <div className="border-b border-border/40 px-4 pb-4 pt-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">{searchCopy[locale].placeholder}</p>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setCityQuery("");
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card/60 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Закрити пошук"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={cityQuery}
                onChange={(event) => setCityQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setSearchOpen(false);
                  }
                }}
                autoFocus
                placeholder={searchCopy[locale].placeholder}
                className="h-12 w-full rounded-xl border border-border/50 bg-card pl-10 pr-4 text-base text-white outline-none transition-colors placeholder:text-white/55 focus:border-primary/50"
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-6">
            <div className="official-header-dropdown rounded-2xl border border-border/50 p-2 shadow-xl">
              {filteredCities.length > 0 && (
                <div className="mb-2">
                  <p className="official-header-dropdown-label px-3 pb-2 pt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {searchCopy[locale].citySection}
                  </p>
                  <div className="space-y-1">
                    {filteredCities.map((city) => (
                      <Link
                        key={city.href}
                        href={city.href}
                        onClick={() => {
                          setSearchOpen(false);
                          setCityQuery("");
                        }}
                        className="official-header-dropdown-item flex items-center gap-2 rounded-xl px-3 py-3 text-base text-foreground transition-colors hover:bg-card"
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{city.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {filteredOblasts.length > 0 && (
                <div>
                  <p className="official-header-dropdown-label px-3 pb-2 pt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {searchCopy[locale].oblastSection}
                  </p>
                  <div className="space-y-1">
                    {filteredOblasts.map((oblast) => (
                      <Link
                        key={oblast.href}
                        href={oblast.href}
                        onClick={() => {
                          setSearchOpen(false);
                          setCityQuery("");
                        }}
                        className="official-header-dropdown-item flex items-center gap-2 rounded-xl px-3 py-3 text-base text-foreground transition-colors hover:bg-card"
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{oblast.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {filteredCities.length === 0 && filteredOblasts.length === 0 && (
                <p className="official-header-dropdown-label px-3 py-3 text-base text-muted-foreground">{searchCopy[locale].empty}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <header ref={headerRef} className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur">
      <div className={`relative mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-0 ${searchOpen ? "max-lg:opacity-0 max-lg:pointer-events-none" : ""}`}>
        <Link href={getPathForLocale("/", locale)} className="min-w-0 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-sm">
            <BrandIcon locale={locale} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg font-bold text-foreground">{copy[locale].brand}</p>
            <p className="hidden text-xs text-muted-foreground sm:block">{copy[locale].tagline}</p>
          </div>
        </Link>
        <div className="relative hidden max-w-xl flex-1 lg:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={cityQuery}
              onChange={(event) => {
                setCityQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setSearchOpen(false);
                }
              }}
              placeholder={searchCopy[locale].placeholder}
              className="h-11 w-full rounded-xl border border-border/50 bg-card/60 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/55 focus:border-primary/50 focus:bg-card"
            />
          </div>
          {searchOpen && (
            <div className="official-header-dropdown absolute left-0 right-0 top-[calc(100%+0.5rem)] rounded-2xl border border-border/50 p-2 shadow-xl">
              {filteredCities.length > 0 && (
                <div className="mb-2">
                  <p className="official-header-dropdown-label px-3 pb-2 pt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {searchCopy[locale].citySection}
                  </p>
                  <div className="space-y-1">
                    {filteredCities.map((city) => (
                      <Link
                        key={city.href}
                        href={city.href}
                        onClick={() => {
                          setSearchOpen(false);
                          setCityQuery("");
                        }}
                        className="official-header-dropdown-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-card"
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{city.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {filteredOblasts.length > 0 && (
                <div>
                  <p className="official-header-dropdown-label px-3 pb-2 pt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {searchCopy[locale].oblastSection}
                  </p>
                  <div className="space-y-1">
                    {filteredOblasts.map((oblast) => (
                      <Link
                        key={oblast.href}
                        href={oblast.href}
                        onClick={() => {
                          setSearchOpen(false);
                          setCityQuery("");
                        }}
                        className="official-header-dropdown-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-card"
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{oblast.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {filteredCities.length === 0 && filteredOblasts.length === 0 && (
                <p className="official-header-dropdown-label px-3 py-2 text-sm text-muted-foreground">{searchCopy[locale].empty}</p>
              )}
            </div>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMobileLocaleOpen(false);
              setSearchOpen((value) => !value);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card/50 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            aria-label={searchCopy[locale].placeholder}
            aria-expanded={searchOpen}
          >
            <Search className="h-4 w-4" />
          </button>
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setMobileLocaleOpen((value) => !value);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border/50 bg-card/50 px-3.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50"
              aria-label="Language switcher"
              aria-expanded={mobileLocaleOpen}
              aria-haspopup="menu"
            >
              <span className="whitespace-nowrap">{LOCALE_LANG[locale]}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${mobileLocaleOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileLocaleOpen && (
              <div className="official-header-dropdown absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[184px] rounded-2xl border border-border/50 p-1.5 shadow-xl">
                {LOCALE_ORDER.map((nextLocale) => {
                  const nextPath = localeLinks[nextLocale] ?? getSafeLocaleSwitchPath(pathnameValue, nextLocale);
                  const isActive = locale === nextLocale;

                  return (
                    <button
                      key={nextLocale}
                      type="button"
                      onClick={() => {
                        setMobileLocaleOpen(false);
                        router.push(nextPath);
                      }}
                      className={`official-header-dropdown-item flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-card"
                      }`}
                    >
                      <span>{LOCALE_LANG[nextLocale]}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <nav className={`border-t border-border/30 bg-card/30 ${searchOpen ? "max-lg:hidden" : ""}`}>
        <div className="mx-auto flex max-w-[1180px] items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-0 lg:overflow-visible">
          {navEntries.map((entry, index) => {
            if (!isNavGroup(entry)) {
              const Icon = entry.icon;
              return (
                <Link
                  key={entry.href}
                  href={resolveHref(entry.href)}
                  className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] transition-colors ${
                    isLeafActive(entry.href)
                      ? "bg-card text-foreground"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  } ${index === 0 ? "lg:pl-0" : ""}`}
                >
                  <span className="mr-1 inline-flex items-center">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {entry.label}
                </Link>
              );
            }

            const Icon = entry.icon;
            const open = openMenu === entry.key;
            const active = isGroupActive(entry);
            return (
              <div key={entry.key} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setOpenMenu(open ? null : entry.key)}
                  className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] transition-colors ${
                    open || active ? "bg-card text-foreground" : "text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
                  aria-expanded={open}
                  aria-haspopup="menu"
                >
                  <span className="mr-1 inline-flex items-center">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {entry.label}
                  <ChevronDown className={`ml-1 h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <div className="official-header-dropdown absolute left-0 top-[calc(100%+0.5rem)] z-50 hidden min-w-[220px] rounded-2xl border border-border/50 p-2 shadow-xl lg:block">
                    <div className="space-y-1">
                      {entry.items.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={resolveHref(item.href)}
                            onClick={() => setOpenMenu(null)}
                            className="official-header-dropdown-item flex items-center justify-start gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-card"
                          >
                            <ItemIcon className="h-4 w-4 shrink-0" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {openMenu &&
          (() => {
            const group = navEntries.find((entry): entry is NavGroup => isNavGroup(entry) && entry.key === openMenu);
            if (!group) return null;
            return (
              <div className="border-t border-border/30 px-4 pb-3 pt-2 lg:hidden">
                <div className="official-header-dropdown space-y-1 rounded-2xl border border-border/50 p-2 shadow-xl">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={resolveHref(item.href)}
                        onClick={() => setOpenMenu(null)}
                        className="official-header-dropdown-item flex items-center justify-start gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-card"
                      >
                        <ItemIcon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })()}
      </nav>
    </header>
    </>
  );
}
