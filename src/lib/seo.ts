import type { Metadata } from "next";
import { getPageMeta } from "@/lib/admin-content";
import { SITE_NAME } from "@/lib/site";
import { getPathForLocale, type SiteLocale } from "@/lib/locale";

const RU_PAGE_META: Record<string, { title: string; description: string }> = {
  home: {
    title: "Магнитка — магнитные бури сегодня, прогноз Kp индекса",
    description:
      "Магнитка — мониторинг магнитных бурь в реальном времени. Kp индекс, солнечный ветер, прогноз геомагнитной активности и влияние на самочувствие.",
  },
  about: {
    title: "О Магнитке",
    description:
      "Сервис мониторинга магнитных бурь, Kp индекса и космической погоды на основе данных NOAA.",
  },
  contacts: {
    title: "Контакты",
    description: "Связь с командой Магнитки: вопросы, обратная связь и сообщения об ошибках.",
  },
  cities: {
    title: "Магнитные бури по городам Украины",
    description:
      "Каталог страниц о магнитных бурях по городам Украины с распределением по областям, областным центрам и крупным населённым пунктам.",
  },
  privacy: {
    title: "Политика конфиденциальности",
    description:
      "Политика конфиденциальности сервиса Магнитка: cookie, аналитика и использование внешних источников данных.",
  },
  cookies: {
    title: "Политика cookie",
    description:
      "Политика cookie сервиса Магнитка: какие cookie используются, для чего они нужны и как управлять согласием.",
  },
  terms: {
    title: "Условия использования",
    description:
      "Условия использования сервиса Магнитка: правила использования сайта, ограничения ответственности и условия доступа к контенту.",
  },
  faq: {
    title: "FAQ о магнитных бурях",
    description:
      "Частые вопросы о магнитных бурях, Kp индексе, шкале G1-G5, влиянии на самочувствие и технику.",
  },
  kp_index: {
    title: "Kp индекс",
    description:
      "Текущий Kp индекс, шкала бури G1-G5, график и объяснение влияния геомагнитной активности.",
  },
  solar_wind: {
    title: "Солнечный ветер",
    description:
      "Скорость солнечного ветра, плотность, IMF Bz и живой график космической погоды для отслеживания магнитных бурь.",
  },
  calendar: {
    title: "Календарь магнитных бурь",
    description:
      "Календарь магнитных бурь на текущий месяц и ближайший прогноз геомагнитной активности.",
  },
};

const PL_PAGE_META: Record<string, { title: string; description: string }> = {
  home: {
    title: "Magnitca — burze magnetyczne dzisiaj i prognoza indeksu Kp",
    description:
      "Magnitca monitoruje burze magnetyczne, indeks Kp, wiatr słoneczny i pogodę kosmiczną w czasie rzeczywistym dla użytkowników w Polsce.",
  },
  about: {
    title: "O Magnitca",
    description: "Informacje o serwisie Magnitca, zrodlach danych NOAA i podejsciu redakcyjnym.",
  },
  contacts: {
    title: "Kontakt",
    description: "Kontakt z zespolem Magnitca: pytania, wspolpraca i zgloszenia bledow.",
  },
  privacy: {
    title: "Polityka prywatnosci",
    description: "Informacje o prywatnosci, analityce i przetwarzaniu danych w serwisie Magnitca.",
  },
  cookies: {
    title: "Polityka cookie",
    description: "Informacje o plikach cookie i analityce wykorzystywanych w serwisie Magnitca.",
  },
  terms: {
    title: "Warunki korzystania",
    description: "Zasady korzystania z serwisu Magnitca, odpowiedzialnosc i charakter informacyjny tresci.",
  },
  faq: {
    title: "FAQ o burzach magnetycznych",
    description: "Najczesciej zadawane pytania o burze magnetyczne, indeks Kp i wplyw na samopoczucie.",
  },
  kp_index: {
    title: "Indeks Kp",
    description: "Aktualny indeks Kp, wykres i prognoza aktywnosci geomagnetycznej dla polskiej wersji Magnitca.",
  },
  solar_wind: {
    title: "Wiatr sloneczny",
    description: "Predkosc wiatru slonecznego, gestosc i pole IMF Bz w czasie rzeczywistym.",
  },
  calendar: {
    title: "Kalendarz burz magnetycznych",
    description: "Kalendarz aktywnosci geomagnetycznej i prognoza na kolejne dni.",
  },
};

const OG_LOCALE: Record<SiteLocale, string> = {
  uk: "uk_UA",
  ru: "ru_RU",
  pl: "pl_PL",
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
  const meta =
    locale === "uk"
      ? await getPageMeta(pageKey)
      : locale === "ru"
        ? RU_PAGE_META[pageKey]
        : PL_PAGE_META[pageKey];
  const title = meta?.title ?? SITE_NAME;
  const description = meta?.description ?? "";
  const languages: Record<string, string> = {
    uk: ukUrl,
    ru: ruUrl,
    "x-default": ukUrl,
  };

  if (pageKey !== "news" && pageKey !== "cities") {
    languages.pl = plUrl;
  }

  return {
    title,
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
