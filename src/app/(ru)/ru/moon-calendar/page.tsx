import type { Metadata } from "next";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Лунный календарь сегодня — фазы Луны по дням";
  const description =
    "Лунный календарь на текущий месяц: фазы Луны по дням, новолуние, полнолуние, четверти и освещенность лунного диска.";

  return {
    title: {
      absolute: `${title} | Магнитка`,
    },
    description,
    alternates: {
      canonical: "/ru/moon-calendar",
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
      url: absoluteUrl("/ru/moon-calendar"),
      locale: "ru_RU",
      type: "website",
    },
  };
}

export default async function MoonCalendarRuPage() {
  const overview = await getMoonCalendarOverview();
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      locale="ru"
      monthLabel={overview.monthLabelRu}
      todayLabel={overview.todayLabelRu}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
