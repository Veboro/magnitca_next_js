import type { Metadata } from "next";
import { SunriseOverviewPage } from "@/components/next/sunrise-overview-page";
import { getSunriseOverview } from "@/lib/sunrise-overview";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const revalidate = 3600;

function formatPageDate(dateKey: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateKey}T00:00:00+03:00`));
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}год ${m}хв`;
}

export async function generateMetadata(): Promise<Metadata> {
  const title = "Схід сонця в Україні сьогодні — час по містах";
  const description =
    "Схід сонця в Україні сьогодні: точний час у Києві, Львові, Одесі, Дніпрі та інших містах. Також дивіться захід сонця і тривалість дня.";

  return {
    title: {
      absolute: `${title} | ${SITE_NAME}`,
    },
    description,
    alternates: {
      canonical: "/sunrise",
      languages: {
        uk: "/sunrise",
        ru: "/ru/sunrise",
        "x-default": "/sunrise",
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/sunrise"),
      locale: "uk_UA",
      type: "website",
    },
  };
}

export default async function SunrisePage() {
  const overview = await getSunriseOverview();

  return (
    <SunriseOverviewPage
      dateLabel={formatPageDate(overview.date)}
      cities={overview.cities}
      earliestSunrise={overview.earliestSunrise}
      latestSunrise={overview.latestSunrise}
      averageDayLengthLabel={formatMinutes(overview.averageDayLengthMinutes)}
    />
  );
}
