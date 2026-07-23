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

export async function generateMetadata(): Promise<Metadata> {
  const title = "Закат солнца в Украине завтра — время по городам";
  const description =
    "Закат солнца в Украине завтра: точное время в Киеве, Львове, Одессе, Днепре и других городах. Также смотрите восход солнца, сумерки и продолжительность ночи.";

  return {
    title: {
      absolute: `${title} | Магнитка`,
    },
    description,
    alternates: {
      canonical: "/ru/sunset-tomorrow",
      languages: {
        uk: "/sunset-tomorrow",
        ru: "/ru/sunset-tomorrow",
        "x-default": "/sunset-tomorrow",
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/ru/sunset-tomorrow"),
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function RussianSunsetTomorrowPage() {
  const overview = await getSunriseOverview(1);

  return (
    <SunsetOverviewPage
      locale="ru"
      mode="tomorrow"
      dateLabel={formatPageDate(overview.date)}
      cities={overview.cities}
      earliestSunset={overview.earliestSunset}
      latestSunset={overview.latestSunset}
    />
  );
}
