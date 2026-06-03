"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPathForLocale, isHuPath, isPlPath, isRoPath, isRuPath, type SiteLocale } from "@/lib/locale";

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
    usageNotice: string;
  }
> = {
  uk: {
    contacts: "Контакти",
    about: "Про нас",
    privacy: "Політика конфіденційності",
    cookies: "Політика cookie",
    terms: "Умови користування",
    rss: "RSS",
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
    rss: "RSS",
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
    rss: "RSS",
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
    rss: "RSS",
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
    rss: "RSS",
    copyright: "Magnitca. Minden jog fenntartva.",
    usageNotice:
      "Az oldal minden anyaga, beleértve a szövegeket, grafikákat, oldalelrendezéseket, elemző összeállításokat és szerkesztőségi tartalmakat, jogi védelem alatt áll. Az anyagok újraközlése, másolása, átdolgozása vagy bármilyen egyéb felhasználása csak a magnitca.com oldalra mutató kötelező aktív hivatkozással engedélyezett; a forrásmegjelölés nélküli vagy kereskedelmi célú felhasználás a szerkesztőség írásos engedélye nélkül tilos.",
  },
};

export function PublicFooter() {
  const pathname = usePathname();
  const locale: SiteLocale = pathname && isHuPath(pathname) ? "hu" : pathname && isRoPath(pathname) ? "ro" : pathname && isPlPath(pathname) ? "pl" : pathname && isRuPath(pathname) ? "ru" : "uk";
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
          <a href="/rss.xml" className="ml-4 border-l border-white/35 pl-4 text-white/82 transition-colors hover:text-white">
            {copy[locale].rss}
          </a>
        </nav>
        <p className="max-w-5xl text-sm leading-relaxed text-white/76">
          {copy[locale].usageNotice}
        </p>
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
