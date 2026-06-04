import type { Metadata } from "next";
import { SunriseOverviewPage } from "@/components/next/sunrise-overview-page";
import { getSunriseOverview } from "@/lib/sunrise-overview";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

function formatPageDate(dateKey: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Kyiv",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateKey}T00:00:00+03:00`));
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} ч ${m} мин`;
}

export async function generateMetadata(): Promise<Metadata> {
  const title = "Восход солнца в Украине сегодня — время по городам";
  const description =
    "Восход солнца в Украине сегодня: точное время в Киеве, Львове, Одессе, Днепре и других городах. Также смотрите закат солнца и продолжительность дня.";

  return {
    title: {
      absolute: `${title} | Магнитка`,
    },
    description,
    alternates: {
      canonical: "/ru/sunrise",
      languages: {
        uk: "/sunrise",
        ru: "/ru/sunrise",
        "x-default": "/sunrise",
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/ru/sunrise"),
      locale: "ru_RU",
      type: "website",
    },
  };
}

export default async function RussianSunrisePage() {
  const overview = await getSunriseOverview();

  return (
    <SunriseOverviewPage
      locale="ru"
      dateLabel={formatPageDate(overview.date)}
      cities={overview.cities}
      earliestSunrise={overview.earliestSunrise}
      latestSunrise={overview.latestSunrise}
      averageDayLengthLabel={formatMinutes(overview.averageDayLengthMinutes)}
    />
  );
}
