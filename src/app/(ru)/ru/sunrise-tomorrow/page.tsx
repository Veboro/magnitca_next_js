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
  const title = "Восход солнца в Украине завтра — время по городам";
  const description =
    "Восход солнца в Украине завтра: точное время в Киеве, Львове, Одессе, Днепре и других городах. Также смотрите закат солнца, сумерки и продолжительность дня.";

  return {
    title: {
      absolute: `${title} | Магнитка`,
    },
    description,
    alternates: {
      canonical: "/ru/sunrise-tomorrow",
      languages: {
        uk: "/sunrise-tomorrow",
        ru: "/ru/sunrise-tomorrow",
        "x-default": "/sunrise-tomorrow",
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/ru/sunrise-tomorrow"),
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function RussianSunriseTomorrowPage() {
  const overview = await getSunriseOverview(1);

  return (
    <SunriseOverviewPage
      locale="ru"
      mode="tomorrow"
      dateLabel={formatPageDate(overview.date)}
      cities={overview.cities}
      earliestSunrise={overview.earliestSunrise}
      latestSunrise={overview.latestSunrise}
      averageDayLengthLabel={formatMinutes(overview.averageDayLengthMinutes)}
    />
  );
}
