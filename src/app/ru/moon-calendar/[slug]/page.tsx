import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { findMoonMonthRouteBySlug, getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return getMoonMonthRoutes2026().map((item) => ({ slug: item.slugRu }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("ru", slug);
  if (!route) return {};

  const title = `Лунный календарь на ${route.labelRu} — фазы Луны по дням`;
  const description = `Лунный календарь на ${route.labelRu}: фазы Луны по дням, новолуние, полнолуние, четверти и освещенность лунного диска.`;

  return {
    title: {
      absolute: `${title} | Магнитка`,
    },
    description,
    alternates: {
      canonical: route.hrefRu,
      languages: {
        uk: route.hrefUk,
        ru: route.hrefRu,
        pl: route.hrefPl,
        "x-default": route.hrefUk,
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(route.hrefRu),
      locale: "ru_RU",
      type: "website",
    },
  };
}

export default async function MoonCalendarMonthRuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("ru", slug);
  if (!route) notFound();

  const overview = await getMoonCalendarOverview(route.year, route.month);
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      locale="ru"
      heading={`Лунный календарь на ${route.labelRu}`}
      introText={`Фазы Луны, ключевые даты новолуния, полнолуния и четвертей на ${route.labelRu}. Ниже собран календарь по дням и главные фазы этого месяца.`}
      contextLabel="Период"
      heroPillLabel="Обзор месяца"
      heroTitle="Ключевые фазы и освещенность"
      monthLabel={overview.monthLabelRu}
      todayLabel={route.labelRu}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
