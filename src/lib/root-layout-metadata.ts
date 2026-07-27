import type { Metadata } from "next";
import type { SiteLocale } from "@/lib/locale";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const ROOT_TITLES: Record<SiteLocale, string> = {
  uk: "Магнітні бурі сьогодні — Kp-індекс, сонячний вітер і прогноз | Магнітка",
  ru: "Магнитные бури сегодня — Kp-индекс, солнечный ветер и прогноз | Магнитка",
  pl: "Burze magnetyczne dzisiaj — indeks Kp, wiatr słoneczny i prognoza | Magnitca",
  ro: "Furtuni magnetice astăzi — indice Kp, vânt solar și prognoză | Magnitca",
  hu: "Mágneses viharok ma — Kp-index, napszél és előrejelzés | Magnitca",
  bg: "Магнитни бури днес — Kp-индекс, слънчев вятър и прогноза | Magnitca",
  cs: "Magnetické bouře dnes — Kp-index, sluneční vítr a předpověď | Magnitca",
  en: "Magnetic storms today — Kp index, solar wind and forecast | Magnitca",
};

const OG_LOCALE: Record<SiteLocale, string> = {
  uk: "uk_UA",
  ru: "ru_RU",
  pl: "pl_PL",
  ro: "ro_MD",
  hu: "hu_HU",
  bg: "bg_BG",
  cs: "cs_CZ",
  en: "en_US",
};

export function createRootMetadata(locale: SiteLocale): Metadata {
  const title = ROOT_TITLES[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: SITE_URL,
      siteName: SITE_NAME,
      title,
      description: SITE_DESCRIPTION,
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
      description: SITE_DESCRIPTION,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
