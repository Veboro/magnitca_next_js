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

export async function generateMetadata(): Promise<Metadata> {
  const title = "Захід сонця в Україні завтра — час по містах";
  const description =
    "Захід сонця в Україні завтра: точний час у Києві, Львові, Одесі, Дніпрі та інших містах. Також дивіться схід сонця, сутінки і тривалість ночі.";

  return {
    title: {
      absolute: `${title} | ${SITE_NAME}`,
    },
    description,
    alternates: {
      canonical: "/sunset-tomorrow",
      languages: {
        uk: "/sunset-tomorrow",
        ru: "/ru/sunset-tomorrow",
        "x-default": "/sunset-tomorrow",
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/sunset-tomorrow"),
      locale: "uk_UA",
      type: "website",
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function SunsetTomorrowPage() {
  const overview = await getSunriseOverview(1);

  return (
    <SunsetOverviewPage
      mode="tomorrow"
      dateLabel={formatPageDate(overview.date)}
      cities={overview.cities}
      earliestSunset={overview.earliestSunset}
      latestSunset={overview.latestSunset}
    />
  );
}
