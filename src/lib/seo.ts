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

const OG_LOCALE: Record<SiteLocale, string> = {
  uk: "uk_UA",
  ru: "ru_RU",
};

export async function resolveLocalizedMetadata(
  pageKey: string,
  path: string,
  locale: SiteLocale
): Promise<Metadata> {
  const canonical = getPathForLocale(path, locale);
  const ukUrl = getPathForLocale(path, "uk");
  const ruUrl = getPathForLocale(path, "ru");
  const meta = locale === "uk" ? await getPageMeta(pageKey) : RU_PAGE_META[pageKey];
  const title = meta?.title ?? SITE_NAME;
  const description = meta?.description ?? "";

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        uk: ukUrl,
        ru: ruUrl,
        "x-default": ukUrl,
      },
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
