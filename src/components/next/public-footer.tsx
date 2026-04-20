"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPathForLocale, isPlPath, isRuPath, type SiteLocale } from "@/lib/locale";

const copy: Record<
  SiteLocale,
  {
    contacts: string;
    about: string;
    privacy: string;
    cookies: string;
    terms: string;
    rss: string;
    copyright: string;
  }
> = {
  uk: {
    contacts: "Контакти",
    about: "Про нас",
    privacy: "Політика конфіденційності",
    cookies: "Політика cookie",
    terms: "Умови користування",
    rss: "RSS",
    copyright: "Магнітка. Дані NOAA SWPC та Open-Meteo.",
  },
  ru: {
    contacts: "Контакты",
    about: "О сервисе",
    privacy: "Политика конфиденциальности",
    cookies: "Политика cookie",
    terms: "Условия использования",
    rss: "RSS",
    copyright: "Магнитка. Данные NOAA SWPC и Open-Meteo.",
  },
  pl: {
    contacts: "Kontakt",
    about: "O projekcie",
    privacy: "Polityka prywatności",
    cookies: "Polityka cookie",
    terms: "Warunki korzystania",
    rss: "RSS",
    copyright: "Magnitca. Dane NOAA SWPC i Open-Meteo.",
  },
};

export function PublicFooter() {
  const pathname = usePathname();
  const locale: SiteLocale = pathname && isPlPath(pathname) ? "pl" : pathname && isRuPath(pathname) ? "ru" : "uk";
  return (
    <footer className="border-t border-border/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground">
        <nav className="flex flex-wrap items-center gap-4">
          <Link href={getPathForLocale("/contacts", locale)} className="hover:text-foreground">
            {copy[locale].contacts}
          </Link>
          <Link href={getPathForLocale("/about", locale)} className="hover:text-foreground">
            {copy[locale].about}
          </Link>
          <Link href={getPathForLocale("/privacy", locale)} className="hover:text-foreground">
            {copy[locale].privacy}
          </Link>
          <Link href={getPathForLocale("/cookies", locale)} className="hover:text-foreground">
            {copy[locale].cookies}
          </Link>
          <Link href={getPathForLocale("/terms", locale)} className="hover:text-foreground">
            {copy[locale].terms}
          </Link>
          <a href="/rss.xml" className="hover:text-foreground">
            {copy[locale].rss}
          </a>
        </nav>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {copy[locale].copyright}</p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.swpc.noaa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              NOAA SWPC
            </a>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Open-Meteo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
