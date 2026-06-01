import type { Metadata } from "next";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Kalendarz księżycowy dzisiaj — fazy Księżyca dzień po dniu";
  const description =
    "Kalendarz księżycowy na bieżący miesiąc: fazy Księżyca dzień po dniu, nów, pełnia, kwadry i oświetlenie tarczy księżycowej.";

  return {
    title: {
      absolute: `${title} | Magnitca`,
    },
    description,
    alternates: {
      canonical: "/pl/moon-calendar",
      languages: {
        uk: "/moon-calendar",
        ru: "/ru/moon-calendar",
        pl: "/pl/moon-calendar",
        "x-default": "/moon-calendar",
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/pl/moon-calendar"),
      locale: "pl_PL",
      type: "website",
    },
  };
}

export default async function MoonCalendarPlPage() {
  const overview = await getMoonCalendarOverview();
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      locale="pl"
      monthLabel={overview.monthLabelPl}
      todayLabel={overview.todayLabelPl}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
