"use client";

import type { JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPathForLocale, isEnPath, isHuPath, isPlPath, isRoPath, isRuPath, type SiteLocale } from "@/lib/locale";
import { SOCIAL_PROFILES, type SocialKey } from "@/lib/site";

const SOCIAL_ICONS: Record<SocialKey, JSX.Element> = {
  telegram: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  facebook: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  tiktok: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.611-.01 3.911-.02.079 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  youtube: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  instagram: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
};

const copy: Record<
  SiteLocale,
  {
    contacts: string;
    about: string;
    privacy: string;
    cookies: string;
    terms: string;
    faq: string;
    rss: string;
    follow: string;
    copyright: string;
    usageNotice: string;
  }
> = {
  uk: {
    contacts: "Контакти",
    about: "Про нас",
    privacy: "Політика конфіденційності",
    cookies: "Політика cookie",
    terms: "Умови користування",
    faq: "FAQ",
    rss: "RSS",
    follow: "Ми в соцмережах",
    copyright: "Магнітка. Усі права захищено.",
    usageNotice:
      "Усі матеріали сайту, включно з текстами, графікою, дизайном сторінок, аналітичними добірками та редакційними публікаціями, охороняються законом. Передрук, копіювання, адаптація або будь-яке інше використання матеріалів дозволяються лише за умови обов'язкового активного посилання на magnitca.com; використання без зазначення джерела або в комерційних цілях без письмової згоди редакції заборонене.",
  },
  ru: {
    contacts: "Контакты",
    about: "О сервисе",
    privacy: "Политика конфиденциальности",
    cookies: "Политика cookie",
    terms: "Условия использования",
    faq: "FAQ",
    rss: "RSS",
    follow: "Мы в соцсетях",
    copyright: "Магнитка. Все права защищены.",
    usageNotice:
      "Все материалы сайта, включая тексты, графику, оформление страниц, аналитические подборки и редакционные публикации, охраняются законом. Перепечатка, копирование, адаптация или иное использование материалов допускаются только при обязательной активной ссылке на magnitca.com; использование без указания источника или в коммерческих целях без письменного согласия редакции запрещено.",
  },
  pl: {
    contacts: "Kontakt",
    about: "O projekcie",
    privacy: "Polityka prywatności",
    cookies: "Polityka cookie",
    terms: "Warunki korzystania",
    faq: "FAQ",
    rss: "RSS",
    follow: "Znajdź nas w social media",
    copyright: "Magnitca. Wszelkie prawa zastrzeżone.",
    usageNotice:
      "Wszystkie materiały serwisu, w tym teksty, grafiki, układ stron, opracowania analityczne i publikacje redakcyjne, są chronione prawem. Przedruk, kopiowanie, adaptacja lub inne wykorzystanie materiałów są dozwolone wyłącznie z obowiązkowym aktywnym linkiem do magnitca.com; użycie bez podania źródła lub w celach komercyjnych bez pisemnej zgody redakcji jest zabronione.",
  },
  ro: {
    contacts: "Contacte",
    about: "Despre proiect",
    privacy: "Politica de confidențialitate",
    cookies: "Politica cookie",
    terms: "Termeni de utilizare",
    faq: "FAQ",
    rss: "RSS",
    follow: "Urmărește-ne",
    copyright: "Magnitca. Toate drepturile rezervate.",
    usageNotice:
      "Toate materialele site-ului, inclusiv textele, grafica, structura paginilor, materialele analitice și publicațiile editoriale, sunt protejate prin lege. Reproducerea, copierea, adaptarea sau orice altă utilizare a materialelor sunt permise numai cu un link activ obligatoriu către magnitca.com; utilizarea fără indicarea sursei sau în scopuri comerciale fără acordul scris al redacției este interzisă.",
  },
  hu: {
    contacts: "Kapcsolat",
    about: "A projektről",
    privacy: "Adatvédelmi irányelvek",
    cookies: "Cookie-szabályzat",
    terms: "Felhasználási feltételek",
    faq: "GYIK",
    rss: "RSS",
    follow: "Kövess minket",
    copyright: "Magnitca. Minden jog fenntartva.",
    usageNotice:
      "Az oldal minden anyaga, beleértve a szövegeket, grafikákat, oldalelrendezéseket, elemző összeállításokat és szerkesztőségi tartalmakat, jogi védelem alatt áll. Az anyagok újraközlése, másolása, átdolgozása vagy bármilyen egyéb felhasználása csak a magnitca.com oldalra mutató kötelező aktív hivatkozással engedélyezett; a forrásmegjelölés nélküli vagy kereskedelmi célú felhasználás a szerkesztőség írásos engedélye nélkül tilos.",
  },
  en: {
    contacts: "Contacts",
    about: "About",
    privacy: "Privacy policy",
    cookies: "Cookie policy",
    terms: "Terms of use",
    faq: "FAQ",
    rss: "RSS",
    follow: "Follow us",
    copyright: "Magnitca. All rights reserved.",
    usageNotice:
      "All site materials, including texts, graphics, page design, analytical selections and editorial publications, are protected by law. Reprinting, copying, adaptation or any other use of materials is allowed only with a mandatory active link to magnitca.com; use without source attribution or for commercial purposes without written editorial permission is prohibited.",
  },
};

export function PublicFooter() {
  const pathname = usePathname();
  const locale: SiteLocale = pathname && isEnPath(pathname) ? "en" : pathname && isHuPath(pathname) ? "hu" : pathname && isRoPath(pathname) ? "ro" : pathname && isPlPath(pathname) ? "pl" : pathname && isRuPath(pathname) ? "ru" : "uk";
  const regionalSource = locale === "hu"
    ? {
        href: "https://met.hu/",
        label: "HungaroMet",
      }
    : locale === "uk"
      ? {
          href: "https://meteo.gov.ua/",
          label: "Укргідрометцентр",
        }
      : locale === "ru"
        ? {
            href: "https://meteo.gov.ua/",
            label: "Укргидрометцентр",
          }
        : null;

  return (
    <footer className="border-t border-border/30">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-6 py-8 text-sm text-white/82">
        <nav className="flex flex-wrap items-center">
          <Link href={getPathForLocale("/contacts", locale)} className="text-white/82 transition-colors hover:text-white">
            {copy[locale].contacts}
          </Link>
          <Link href={getPathForLocale("/about", locale)} className="ml-4 border-l border-white/35 pl-4 text-white/82 transition-colors hover:text-white">
            {copy[locale].about}
          </Link>
          <Link href={getPathForLocale("/privacy", locale)} className="ml-4 border-l border-white/35 pl-4 text-white/82 transition-colors hover:text-white">
            {copy[locale].privacy}
          </Link>
          <Link href={getPathForLocale("/cookies", locale)} className="ml-4 border-l border-white/35 pl-4 text-white/82 transition-colors hover:text-white">
            {copy[locale].cookies}
          </Link>
          <Link href={getPathForLocale("/terms", locale)} className="ml-4 border-l border-white/35 pl-4 text-white/82 transition-colors hover:text-white">
            {copy[locale].terms}
          </Link>
          <Link href={getPathForLocale("/faq", locale)} className="ml-4 border-l border-white/35 pl-4 text-white/82 transition-colors hover:text-white">
            {copy[locale].faq}
          </Link>
          <a href="/rss.xml" className="ml-4 border-l border-white/35 pl-4 text-white/82 transition-colors hover:text-white">
            {copy[locale].rss}
          </a>
        </nav>
        <p className="max-w-5xl text-sm leading-relaxed text-white/76">
          {copy[locale].usageNotice}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-white/82">{copy[locale].follow}</span>
          {SOCIAL_PROFILES.map((profile) => (
            <a
              key={profile.key}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={profile.name}
              className="text-white/82 transition-colors hover:text-white"
            >
              {SOCIAL_ICONS[profile.key]}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-white/88">© {new Date().getFullYear()} {copy[locale].copyright}</p>
          <div className="flex items-center gap-4">
            {regionalSource && (
              <a
                href={regionalSource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/82 transition-colors hover:text-white"
              >
                {regionalSource.label}
              </a>
            )}
            <a
              href="https://www.swpc.noaa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/82 transition-colors hover:text-white"
            >
              NOAA SWPC
            </a>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/82 transition-colors hover:text-white"
            >
              Open-Meteo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
