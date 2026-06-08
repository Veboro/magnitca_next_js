import type { Metadata } from "next";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Moon calendar today — Moon phases day by day";
  const description =
    "Moon calendar for the current month: daily Moon phases, new moon, full moon, quarters and lunar illumination.";

  return {
    title: {
      absolute: `${title} | Magnitca`,
    },
    description,
    alternates: {
      canonical: "/en/moon-calendar",
      languages: {
        uk: "/moon-calendar",
        ru: "/ru/moon-calendar",
        pl: "/pl/moon-calendar",
        ro: "/ro/moon-calendar",
        hu: "/hu/moon-calendar",
        en: "/en/moon-calendar",
        "x-default": "/moon-calendar",
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/en/moon-calendar"),
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function MoonCalendarEnPage() {
  const overview = await getMoonCalendarOverview();
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      locale="en"
      monthLabel={overview.monthLabelEn}
      todayLabel={overview.todayLabelEn}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
