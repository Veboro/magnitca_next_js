import type { Metadata } from "next";
import { SunsetOverviewPage } from "@/components/next/sunset-overview-page";
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
  const title = "Закат солнца в Украине сегодня — время по городам";
  const description =
    "Закат солнца в Украине сегодня: точное время в Киеве, Львове, Одессе, Днепре и других городах. Также смотрите восход солнца и продолжительность дня.";

  return {
    title: {
      absolute: `${title} | Магнитка`,
    },
    description,
    alternates: {
      canonical: "/ru/sunset",
      languages: {
        uk: "/sunset",
        ru: "/ru/sunset",
        "x-default": "/sunset",
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/ru/sunset"),
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function RussianSunsetPage() {
  const overview = await getSunriseOverview();

  return (
    <SunsetOverviewPage
      locale="ru"
      dateLabel={formatPageDate(overview.date)}
      cities={overview.cities}
      earliestSunset={overview.earliestSunset}
      latestSunset={overview.latestSunset}
    />
  );
}
