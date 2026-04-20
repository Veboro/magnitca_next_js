"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, CalendarDays, ChevronDown, ClipboardCheck, Gauge, HelpCircle, MapPin, Newspaper, Search, Wind } from "lucide-react";
import { getPathForLocale, getSafeLocaleSwitchPath, isPlPath, isRuPath, type SiteLocale } from "@/lib/locale";
import { ALL_UK_CITIES } from "@/data/cities";
import { CITIES_PL } from "@/data/cities-pl";
import { CITIES_RU, getRuCitySlug } from "@/data/cities-ru";

const navItems: Record<SiteLocale, Array<{ href: string; label: string; icon: typeof Activity }>> = {
  uk: [
    { href: "/", label: "Головна", icon: Activity },
    { href: "/kp-index", label: "Kp індекс", icon: Gauge },
    { href: "/solar-wind", label: "Сонячний вітер", icon: Wind },
    { href: "/news", label: "Новини", icon: Newspaper },
    { href: "/calendar", label: "Календар", icon: CalendarDays },
    { href: "/test", label: "Тест", icon: ClipboardCheck },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
  ],
  ru: [
    { href: "/", label: "Главная", icon: Activity },
    { href: "/kp-index", label: "Kp индекс", icon: Gauge },
    { href: "/solar-wind", label: "Солнечный ветер", icon: Wind },
    { href: "/news", label: "Новости", icon: Newspaper },
    { href: "/calendar", label: "Календарь", icon: CalendarDays },
    { href: "/test", label: "Тест", icon: ClipboardCheck },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
  ],
  pl: [
    { href: "/", label: "Start", icon: Activity },
    { href: "/kp-index", label: "Indeks Kp", icon: Gauge },
    { href: "/solar-wind", label: "Wiatr słoneczny", icon: Wind },
    { href: "/calendar", label: "Kalendarz", icon: CalendarDays },
    { href: "/test", label: "Test", icon: ClipboardCheck },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
  ],
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
};

type SearchCityItem = {
  name: string;
  href: string;
  searchText: string;
};

export function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const locale: SiteLocale = pathname && isPlPath(pathname) ? "pl" : pathname && isRuPath(pathname) ? "ru" : "uk";
  const pathnameValue = pathname || "/";
  const [cityQuery, setCityQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileLocaleOpen, setMobileLocaleOpen] = useState(false);
  const [localeLinks, setLocaleLinks] = useState<Record<SiteLocale, string | null>>({
    uk: getSafeLocaleSwitchPath(pathnameValue, "uk"),
    ru: getSafeLocaleSwitchPath(pathnameValue, "ru"),
    pl: getSafeLocaleSwitchPath(pathnameValue, "pl"),
  });

  const searchCopy = {
    uk: {
      placeholder: "Пошук міста",
      empty: "Нічого не знайдено",
      section: "Сторінки міст",
    },
    ru: {
      placeholder: "Поиск города",
      empty: "Ничего не найдено",
      section: "Страницы городов",
    },
    pl: {
      placeholder: "Szukaj miasta",
      empty: "Nic nie znaleziono",
      section: "Strony miast",
    },
  } as const;

  const citySearchItems = useMemo<SearchCityItem[]>(() => {
    if (locale === "pl") {
      return CITIES_PL.map((city) => ({
        name: city.name,
        href: `/pl/city/${city.slug}`,
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

  const normalizedQuery = cityQuery.trim().toLowerCase();
  const filteredCities = useMemo(() => {
    if (!normalizedQuery) {
      return citySearchItems.slice(0, 8);
    }

    return citySearchItems
      .filter((city) => city.searchText.includes(normalizedQuery))
      .slice(0, 8);
  }, [citySearchItems, normalizedQuery]);

  useEffect(() => {
    const nextLinks: Record<SiteLocale, string | null> = {
      uk: getSafeLocaleSwitchPath(pathnameValue, "uk"),
      ru: getSafeLocaleSwitchPath(pathnameValue, "ru"),
      pl: getSafeLocaleSwitchPath(pathnameValue, "pl"),
    };

    const ukAlternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="uk"]');
    const ruAlternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="ru"]');
    const plAlternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="pl"]');

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

    if (ukPath) {
      nextLinks.uk = ukPath;
    }

    if (ruPath) {
      nextLinks.ru = ruPath;
    }

    if (plPath) {
      nextLinks.pl = plPath;
    }

    setLocaleLinks(nextLinks);
  }, [locale, pathnameValue]);

  useEffect(() => {
    setCityQuery("");
    setSearchOpen(false);
    setMobileLocaleOpen(false);
  }, [pathnameValue]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href={getPathForLocale("/", locale)} className="min-w-0 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-sm">
            <Activity className="h-5 w-5" />
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
              className="h-11 w-full rounded-xl border border-border/50 bg-card/60 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary/50 focus:bg-card"
            />
          </div>
          {searchOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] rounded-2xl border border-border/50 bg-popover/95 p-2 shadow-xl backdrop-blur">
              <p className="px-3 pb-2 pt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {searchCopy[locale].section}
              </p>
              {filteredCities.length > 0 ? (
                <div className="space-y-1">
                  {filteredCities.map((city) => (
                    <Link
                      key={city.href}
                      href={city.href}
                      onClick={() => {
                        setSearchOpen(false);
                        setCityQuery("");
                      }}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-card"
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{city.name}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-3 py-2 text-sm text-muted-foreground">{searchCopy[locale].empty}</p>
              )}
            </div>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card/50 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            aria-label={searchCopy[locale].placeholder}
            aria-expanded={searchOpen}
          >
            <Search className="h-4 w-4" />
          </button>
          <div className="relative shrink-0 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileLocaleOpen((value) => !value)}
              className="inline-flex h-10 min-w-[76px] items-center justify-between rounded-full border border-border/50 bg-card/50 px-3 text-xs font-semibold text-foreground transition-colors hover:border-primary/50"
              aria-label="Language switcher"
              aria-expanded={mobileLocaleOpen}
            >
              <span>{locale.toUpperCase()}</span>
              <ChevronDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {mobileLocaleOpen && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[88px] rounded-2xl border border-border/50 bg-popover/95 p-1.5 shadow-xl backdrop-blur">
                {(["uk", "ru", "pl"] as SiteLocale[]).map((nextLocale) => {
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
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                        isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-card"
                      }`}
                    >
                      <span>{nextLocale.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="hidden items-center rounded-full border border-border/50 bg-card/50 p-1 lg:inline-flex">
            <Link
              href={localeLinks.uk}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                locale === "uk" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              UA
            </Link>
            <Link
              href={localeLinks.ru}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                locale === "ru" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              RU
            </Link>
            {localeLinks.pl && (
              <Link
                href={localeLinks.pl}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  locale === "pl" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                PL
              </Link>
            )}
          </div>
        </div>
        {searchOpen && (
          <div className="basis-full w-full lg:hidden">
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
                className="h-11 w-full rounded-xl border border-border/50 bg-card/60 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary/50 focus:bg-card"
              />
            </div>
            <div className="mt-2 rounded-2xl border border-border/50 bg-popover/95 p-2 shadow-xl backdrop-blur">
              <p className="px-3 pb-2 pt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {searchCopy[locale].section}
              </p>
              {filteredCities.length > 0 ? (
                <div className="space-y-1">
                  {filteredCities.map((city) => (
                    <Link
                      key={city.href}
                      href={city.href}
                      onClick={() => {
                        setSearchOpen(false);
                        setCityQuery("");
                      }}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-card"
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{city.name}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-3 py-2 text-sm text-muted-foreground">{searchCopy[locale].empty}</p>
              )}
            </div>
          </div>
        )}
      </div>
      <nav className="border-t border-border/30 bg-card/30">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-6 py-2">
          {navItems[locale].map((item) => (
            <Link
              key={item.href}
              href={getPathForLocale(item.href, locale)}
              className="inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              <span className="mr-1.5 inline-flex items-center">
                <item.icon className="h-3.5 w-3.5" />
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
