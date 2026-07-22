import type { Metadata } from "next";
import { DEFAULT_PAGE_META, getPageMeta } from "@/lib/admin-content";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { getPathForLocale, SUPPORTED_SITE_LOCALES, type SiteLocale } from "@/lib/locale";

const ALL_SITE_LOCALES: readonly SiteLocale[] = SUPPORTED_SITE_LOCALES;

// Locales in which each page actually exists. Keeps hreflang reciprocal:
// only list a page in the alternates cluster where a real route is published.
// Pages not listed here are assumed available in every locale.
const PAGE_AVAILABLE_LOCALES: Record<string, readonly SiteLocale[]> = {
  cities: ["uk", "ru"],
};

const RU_PAGE_META: Record<string, { title: string; description: string }> = {
  home: {
    title: "Магнитные бури сегодня — Kp-индекс, солнечный ветер и прогноз | Магнитка",
    description:
      "Магнитка — мониторинг магнитных бурь в реальном времени. Kp индекс, солнечный ветер, прогноз геомагнитной активности и влияние на самочувствие.",
  },
  about: {
    title: "О Магнитке — данные NOAA и прогноз магнитных бурь",
    description:
      "Сервис мониторинга магнитных бурь, Kp индекса и космической погоды на основе данных NOAA.",
  },
  contacts: {
    title: "Контакты Магнитки — обратная связь и сотрудничество",
    description: "Связь с командой Магнитки: вопросы, обратная связь и сообщения об ошибках.",
  },
  cities: {
    title: "Магнитные бури по городам Украины",
    description:
      "Каталог страниц о магнитных бурях по городам Украины с распределением по областям, областным центрам и крупным населённым пунктам.",
  },
  privacy: {
    title: "Политика конфиденциальности Магнитки",
    description:
      "Политика конфиденциальности сервиса Магнитка: cookie, аналитика и использование внешних источников данных.",
  },
  cookies: {
    title: "Политика cookie Магнитки",
    description:
      "Политика cookie сервиса Магнитка: какие cookie используются, для чего они нужны и как управлять согласием.",
  },
  terms: {
    title: "Условия использования Магнитки",
    description:
      "Условия использования сервиса Магнитка: правила использования сайта, ограничения ответственности и условия доступа к контенту.",
  },
  faq: {
    title: "Магнитные бури: FAQ про Kp-индекс, солнечный ветер и влияние",
    description:
      "Частые вопросы о магнитных бурях, Kp индексе, шкале G1-G5, влиянии на самочувствие и технику.",
  },
  kp_index: {
    title: "Kp-индекс сегодня — онлайн график и прогноз магнитных бурь",
    description:
      "Текущий Kp индекс, шкала бури G1-G5, график и объяснение влияния геомагнитной активности.",
  },
  solar_wind: {
    title: "Солнечный ветер сегодня — скорость, плотность и IMF Bz онлайн",
    description:
      "Скорость солнечного ветра, плотность, IMF Bz и живой график космической погоды для отслеживания магнитных бурь.",
  },
  calendar: {
    title: "Календарь магнитных бурь — прогноз геомагнитной активности",
    description:
      "Календарь магнитных бурь на текущий месяц и ближайший прогноз геомагнитной активности.",
  },
  news: {
    title: "Новости магнитных бурь",
    description:
      "Ежедневные новости о магнитных бурях, геомагнитной активности, прогнозах NOAA и влиянии космической погоды на самочувствие.",
  },
};

const PL_PAGE_META: Record<string, { title: string; description: string }> = {
  home: {
    title: "Burze magnetyczne dzisiaj — indeks Kp, wiatr słoneczny i prognoza | Magnitca",
    description:
      "Magnitca monitoruje burze magnetyczne, indeks Kp, wiatr słoneczny i pogodę kosmiczną w czasie rzeczywistym dla użytkowników w Polsce.",
  },
  about: {
    title: "O Magnitca — dane NOAA i prognoza burz magnetycznych",
    description: "Informacje o serwisie Magnitca, zrodlach danych NOAA i podejsciu redakcyjnym.",
  },
  contacts: {
    title: "Kontakt z Magnitca — pytania i współpraca",
    description: "Kontakt z zespolem Magnitca: pytania, wspolpraca i zgloszenia bledow.",
  },
  privacy: {
    title: "Polityka prywatności Magnitca",
    description: "Informacje o prywatnosci, analityce i przetwarzaniu danych w serwisie Magnitca.",
  },
  cookies: {
    title: "Polityka cookie Magnitca",
    description: "Informacje o plikach cookie i analityce wykorzystywanych w serwisie Magnitca.",
  },
  terms: {
    title: "Warunki korzystania z Magnitca",
    description: "Zasady korzystania z serwisu Magnitca, odpowiedzialnosc i charakter informacyjny tresci.",
  },
  faq: {
    title: "Burze magnetyczne: FAQ o indeksie Kp, wietrze słonecznym i wpływie",
    description: "Najczesciej zadawane pytania o burze magnetyczne, indeks Kp i wplyw na samopoczucie.",
  },
  kp_index: {
    title: "Indeks Kp dzisiaj — wykres online i prognoza burz magnetycznych",
    description: "Aktualny indeks Kp, wykres i prognoza aktywnosci geomagnetycznej dla polskiej wersji Magnitca.",
  },
  solar_wind: {
    title: "Wiatr słoneczny dzisiaj — prędkość, gęstość i IMF Bz online",
    description: "Predkosc wiatru slonecznego, gestosc i pole IMF Bz w czasie rzeczywistym.",
  },
  calendar: {
    title: "Kalendarz burz magnetycznych — prognoza aktywności geomagnetycznej",
    description: "Kalendarz aktywnosci geomagnetycznej i prognoza na kolejne dni.",
  },
  news: {
    title: "Wiadomości o burzach magnetycznych",
    description:
      "Codzienne wiadomości o burzach magnetycznych, aktywności geomagnetycznej, prognozach NOAA i wpływie pogody kosmicznej na samopoczucie.",
  },
};

const RO_PAGE_META: Record<string, { title: string; description: string }> = {
  home: {
    title: "Furtuni magnetice astăzi — indice Kp, vânt solar și prognoză | Magnitca",
    description:
      "Magnitca monitorizează furtunile magnetice, indicele Kp, vântul solar și vremea spațială în timp real pentru Moldova.",
  },
  about: {
    title: "Despre Magnitca — date NOAA și prognoza furtunilor magnetice",
    description: "Informații despre proiectul Magnitca Moldova, sursele de date NOAA și abordarea editorială.",
  },
  contacts: {
    title: "Contact Magnitca — întrebări și colaborare",
    description: "Contact cu echipa Magnitca: întrebări, colaborări și raportarea erorilor.",
  },
  privacy: {
    title: "Politica de confidențialitate Magnitca",
    description: "Informații despre confidențialitate, analiză și prelucrarea datelor în serviciul Magnitca.",
  },
  cookies: {
    title: "Politica cookie Magnitca",
    description: "Informații despre fișierele cookie și instrumentele de analiză folosite de Magnitca.",
  },
  terms: {
    title: "Termeni de utilizare Magnitca",
    description: "Reguli de utilizare a serviciului Magnitca, limitări de răspundere și caracterul informativ al conținutului.",
  },
  faq: {
    title: "Furtuni magnetice: FAQ despre indicele Kp, vântul solar și influență",
    description: "Întrebări frecvente despre furtuni magnetice, indicele Kp și influența asupra organismului.",
  },
  kp_index: {
    title: "Indice Kp astăzi — grafic online și prognoza furtunilor magnetice",
    description: "Indicele Kp curent, grafic și prognoza activității geomagnetice pentru versiunea română Magnitca.",
  },
  solar_wind: {
    title: "Vânt solar astăzi — viteză, densitate și IMF Bz online",
    description: "Viteza vântului solar, densitatea și componenta IMF Bz în timp real.",
  },
  calendar: {
    title: "Calendarul furtunilor magnetice — prognoza activității geomagnetice",
    description: "Calendarul activității geomagnetice și prognoza pentru următoarele zile.",
  },
  news: {
    title: "Știri despre furtuni magnetice",
    description:
      "Știri zilnice despre furtuni magnetice, activitate geomagnetică, prognoze NOAA și influența vremii spațiale asupra stării de bine.",
  },
};

const HU_PAGE_META: Record<string, { title: string; description: string }> = {
  home: {
    title: "Mágneses viharok ma — Kp-index, napszél és előrejelzés | Magnitca",
    description:
      "A Magnitca magyar verziója valós időben követi a mágneses viharokat, a Kp-indexet, a napszelet és az űridőjárási előrejelzést.",
  },
  about: {
    title: "A Magnitca projektről — NOAA adatok és mágneses vihar előrejelzés",
    description: "Információk a Magnitca szolgáltatásról, a NOAA adatforrásokról és a szerkesztési megközelítésről.",
  },
  contacts: {
    title: "Kapcsolat a Magnitcával — kérdések és együttműködés",
    description: "Kapcsolat a Magnitca csapatával: kérdések, együttműködés és hibajelentések.",
  },
  privacy: {
    title: "A Magnitca adatvédelmi irányelvei",
    description: "Adatvédelem, analitika és adatkezelés a Magnitca szolgáltatásban.",
  },
  cookies: {
    title: "A Magnitca cookie-szabályzata",
    description: "Információk a Magnitca által használt cookie-król és analitikai eszközökről.",
  },
  terms: {
    title: "A Magnitca felhasználási feltételei",
    description: "A Magnitca használatának szabályai, felelősségi korlátok és a tartalom tájékoztató jellege.",
  },
  faq: {
    title: "Mágneses viharok: GYIK a Kp-indexről, napszélről és hatásokról",
    description: "Gyakori kérdések a mágneses viharokról, a Kp-indexről és a szervezetre gyakorolt hatásról.",
  },
  kp_index: {
    title: "Kp-index ma — online grafikon és mágneses vihar előrejelzés",
    description: "Aktuális Kp-index, grafikon és geomágneses aktivitási előrejelzés a Magnitca magyar verzióján.",
  },
  solar_wind: {
    title: "Napszél ma — sebesség, sűrűség és IMF Bz online",
    description: "A napszél sebessége, sűrűsége és az IMF Bz komponens valós időben.",
  },
  calendar: {
    title: "Mágneses vihar naptár — geomágneses aktivitási előrejelzés",
    description: "Geomágneses aktivitási naptár és előrejelzés a következő napokra.",
  },
  news: {
    title: "Mágneses vihar hírek",
    description:
      "Napi hírek mágneses viharokról, geomágneses aktivitásról, NOAA-előrejelzésekről és az űridőjárás közérzetre gyakorolt hatásáról.",
  },
};

const EN_PAGE_META: Record<string, { title: string; description: string }> = {
  home: {
    title: "Magnetic storms today — Kp index, solar wind and forecast | Magnitca",
    description:
      "Magnitca monitors magnetic storms, the Kp index, solar wind and space weather in real time with NOAA-based forecasts and health-focused explanations.",
  },
  about: {
    title: "About Magnitca — NOAA data and magnetic storm forecasts",
    description: "About the Magnitca project, NOAA data sources and the editorial approach behind our magnetic storm forecasts.",
  },
  contacts: {
    title: "Contact Magnitca — questions and collaboration",
    description: "Contact the Magnitca team for questions, partnerships, feedback and error reports.",
  },
  privacy: {
    title: "Magnitca privacy policy",
    description: "Information about privacy, analytics and data processing on the Magnitca service.",
  },
  cookies: {
    title: "Magnitca cookie policy",
    description: "Information about cookies and analytics tools used on Magnitca.",
  },
  terms: {
    title: "Magnitca terms of use",
    description: "Rules for using Magnitca, liability limits and the informational nature of the content.",
  },
  faq: {
    title: "Magnetic storms FAQ: Kp index, solar wind and health impact",
    description: "Frequently asked questions about magnetic storms, the Kp index, solar wind and possible effects on wellbeing.",
  },
  kp_index: {
    title: "Kp index today — live chart and magnetic storm forecast",
    description: "Current Kp index, live chart and geomagnetic activity forecast based on NOAA space weather data.",
  },
  solar_wind: {
    title: "Solar wind today — speed, density and IMF Bz online",
    description: "Solar wind speed, density and IMF Bz in real time for tracking magnetic storm conditions.",
  },
  calendar: {
    title: "Magnetic storm calendar — geomagnetic activity forecast",
    description: "Calendar of magnetic storms and geomagnetic activity forecast for the coming days.",
  },
  news: {
    title: "Magnetic storm news",
    description:
      "Daily news about magnetic storms, geomagnetic activity, NOAA forecasts and the impact of space weather on wellbeing.",
  },
};

const OG_LOCALE: Record<SiteLocale, string> = {
  uk: "uk_UA",
  ru: "ru_RU",
  pl: "pl_PL",
  ro: "ro_MD",
  hu: "hu_HU",
  en: "en_US",
};

export async function resolveLocalizedMetadata(
  pageKey: string,
  path: string,
  locale: SiteLocale
): Promise<Metadata> {
  const canonical = getPathForLocale(path, locale);
  const ukUrl = getPathForLocale(path, "uk");
  const ruUrl = getPathForLocale(path, "ru");
  const plUrl = getPathForLocale(path, "pl");
  const roUrl = getPathForLocale(path, "ro");
  const huUrl = getPathForLocale(path, "hu");
  const enUrl = getPathForLocale(path, "en");
  const ukMeta = locale === "uk" ? await getPageMeta(pageKey) : null;
  const meta =
    locale === "uk"
      ? {
          ...(ukMeta ?? DEFAULT_PAGE_META[pageKey]),
          title: DEFAULT_PAGE_META[pageKey]?.title ?? ukMeta?.title,
        }
      : locale === "ru"
        ? RU_PAGE_META[pageKey]
        : locale === "ro"
          ? RO_PAGE_META[pageKey]
          : locale === "hu"
            ? HU_PAGE_META[pageKey]
            : locale === "en"
              ? EN_PAGE_META[pageKey]
              : PL_PAGE_META[pageKey];
  const title = meta?.title ?? SITE_NAME;
  const description = meta?.description || SITE_DESCRIPTION;

  const localeUrls: Record<SiteLocale, string> = {
    uk: ukUrl,
    ru: ruUrl,
    pl: plUrl,
    ro: roUrl,
    hu: huUrl,
    en: enUrl,
  };

  const availableLocales = PAGE_AVAILABLE_LOCALES[pageKey] ?? ALL_SITE_LOCALES;
  const languages: Record<string, string> = {};
  for (const availableLocale of availableLocales) {
    languages[availableLocale] = localeUrls[availableLocale];
  }
  languages["x-default"] = ukUrl;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}
