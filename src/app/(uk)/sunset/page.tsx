import type { Metadata } from "next";
import { SunsetOverviewPage } from "@/components/next/sunset-overview-page";
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
  const title = "Захід сонця в Україні сьогодні — час по містах";
  const description =
    "Захід сонця в Україні сьогодні: точний час у Києві, Львові, Одесі, Дніпрі та інших містах. Також дивіться схід сонця і тривалість дня.";

  return {
    title: {
      absolute: `${title} | ${SITE_NAME}`,
    },
    description,
    alternates: {
      canonical: "/sunset",
      languages: {
        uk: "/sunset",
        ru: "/ru/sunset",
        "x-default": "/sunset",
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/sunset"),
      locale: "uk_UA",
      type: "website",
    },
  };
}

export default async function SunsetPage() {
  const overview = await getSunriseOverview();

  return (
    <SunsetOverviewPage
      dateLabel={formatPageDate(overview.date)}
      cities={overview.cities}
      earliestSunset={overview.earliestSunset}
      latestSunset={overview.latestSunset}
    />
  );
}
