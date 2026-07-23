import type { Metadata } from "next";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Calendar lunar astăzi — fazele Lunii pe zile";
  const description =
    "Calendar lunar pentru luna curentă: fazele Lunii pe zile, Luna nouă, Luna plină, pătrarele și iluminarea discului lunar.";

  return {
    title: {
      absolute: `${title} | Magnitca`,
    },
    description,
    alternates: {
      canonical: "/ro/moon-calendar",
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
      url: absoluteUrl("/ro/moon-calendar"),
      locale: "ro_MD",
      type: "website",
    },
  };
}

export default async function MoonCalendarRoPage() {
  const overview = await getMoonCalendarOverview();
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      locale="ro"
      monthLabel={overview.monthLabelRo}
      todayLabel={overview.todayLabelRo}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
