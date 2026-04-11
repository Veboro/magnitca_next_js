"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, CalendarDays, ClipboardCheck, Gauge, HelpCircle, Newspaper, Wind } from "lucide-react";
import { getPathForLocale, isRuPath, switchPathLocale, type SiteLocale } from "@/lib/locale";

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
};

export function PublicHeader() {
  const pathname = usePathname();
  const locale: SiteLocale = pathname && isRuPath(pathname) ? "ru" : "uk";
  const pathnameValue = pathname || "/";
  const [localeLinks, setLocaleLinks] = useState<Record<SiteLocale, string>>({
    uk: switchPathLocale(pathnameValue, "uk"),
    ru: switchPathLocale(pathnameValue, "ru"),
  });

  useEffect(() => {
    const nextLinks: Record<SiteLocale, string> = {
      uk: switchPathLocale(pathnameValue, "uk"),
      ru: switchPathLocale(pathnameValue, "ru"),
    };

    const ukAlternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="uk"]');
    const ruAlternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="ru"]');

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

    if (ukPath) {
      nextLinks.uk = ukPath;
    }

    if (ruPath) {
      nextLinks.ru = ruPath;
    }

    setLocaleLinks(nextLinks);
  }, [pathnameValue]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href={getPathForLocale("/", locale)} className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-sm">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg font-bold text-foreground">{copy[locale].brand}</p>
            <p className="text-xs text-muted-foreground">{copy[locale].tagline}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-full border border-border/50 bg-card/50 p-1">
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
          </div>
        </div>
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
