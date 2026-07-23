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
  const title = "Схід сонця в Україні завтра — час по містах";
  const description =
    "Схід сонця в Україні завтра: точний час у Києві, Львові, Одесі, Дніпрі та інших містах. Також дивіться захід сонця, сутінки і тривалість дня.";

  return {
    title: {
      absolute: `${title} | ${SITE_NAME}`,
    },
    description,
    alternates: {
      canonical: "/sunrise-tomorrow",
      languages: {
        uk: "/sunrise-tomorrow",
        ru: "/ru/sunrise-tomorrow",
        "x-default": "/sunrise-tomorrow",
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/sunrise-tomorrow"),
      locale: "uk_UA",
      type: "website",
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function SunriseTomorrowPage() {
  const overview = await getSunriseOverview(1);

  return (
    <SunriseOverviewPage
      mode="tomorrow"
      dateLabel={formatPageDate(overview.date)}
      cities={overview.cities}
      earliestSunrise={overview.earliestSunrise}
      latestSunrise={overview.latestSunrise}
      averageDayLengthLabel={formatMinutes(overview.averageDayLengthMinutes)}
    />
  );
}
