import type { Metadata } from "next";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Lunární kalendář dnes — fáze Měsíce po dnech";
  const description =
    "Lunární kalendář pro aktuální měsíc: denní fáze Měsíce, nov, úplněk, čtvrti a osvětlení Měsíce.";

  return {
    title: {
      absolute: `${title} | Magnitca`,
    },
    description,
    alternates: {
      canonical: "/cs/moon-calendar",
      languages: {
        uk: "/moon-calendar",
        ru: "/ru/moon-calendar",
        pl: "/pl/moon-calendar",
        ro: "/ro/moon-calendar",
        hu: "/hu/moon-calendar",
        bg: "/bg/moon-calendar",
        cs: "/cs/moon-calendar",
        en: "/en/moon-calendar",
        "x-default": "/moon-calendar",
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/cs/moon-calendar"),
      locale: "cs_CZ",
      type: "website",
    },
  };
}

export default async function MoonCalendarHuPage() {
  const overview = await getMoonCalendarOverview();
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      locale="cs"
      monthLabel={overview.monthLabelCs}
      todayLabel={overview.todayLabelCs}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
