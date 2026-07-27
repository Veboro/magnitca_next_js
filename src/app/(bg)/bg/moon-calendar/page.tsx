import type { Metadata } from "next";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Лунен календар днес — лунни фази по дни";
  const description =
    "Лунен календар за текущия месец: дневни лунни фази, новолуние, пълнолуние, четвърти и осветеност на Луната.";

  return {
    title: {
      absolute: `${title} | Magnitca`,
    },
    description,
    alternates: {
      canonical: "/bg/moon-calendar",
      languages: {
        uk: "/moon-calendar",
        ru: "/ru/moon-calendar",
        pl: "/pl/moon-calendar",
        ro: "/ro/moon-calendar",
        bg: "/bg/moon-calendar",
        en: "/en/moon-calendar",
        "x-default": "/moon-calendar",
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/bg/moon-calendar"),
      locale: "bg_BG",
      type: "website",
    },
  };
}

export default async function MoonCalendarHuPage() {
  const overview = await getMoonCalendarOverview();
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      locale="bg"
      monthLabel={overview.monthLabelBg}
      todayLabel={overview.todayLabelBg}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
