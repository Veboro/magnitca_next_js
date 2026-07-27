import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { findMoonMonthRouteBySlug, getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return getMoonMonthRoutes2026().map((route) => ({ slug: route.slugBg }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("bg", slug);
  if (!route) return {};

  const title = `Лунен календар за ${route.labelBg} — лунни фази по дни`;
  const description = `Лунен календар за ${route.labelBg}: дневни лунни фази, новолуние, пълнолуние, четвърти и осветеност.`;

  return {
    title: {
      absolute: `${title} | Magnitca`,
    },
    description,
    alternates: {
      canonical: route.hrefBg,
      languages: {
        uk: route.hrefUk,
        ru: route.hrefRu,
        pl: route.hrefPl,
        ro: route.hrefRo,
        bg: route.hrefBg,
        "x-default": route.hrefUk,
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(route.hrefBg),
      locale: "bg_BG",
      type: "website",
    },
  };
}

export default async function MoonCalendarMonthHuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("bg", slug);
  if (!route) notFound();

  const overview = await getMoonCalendarOverview(route.year, route.month);
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      locale="bg"
      heading={`Лунен календар за ${route.labelBg}`}
      introText={`Лунни фази, новолуние, пълнолуние и четвърти през ${route.labelBg}. По-долу можете да видите състоянието и осветеността на Луната по дни.`}
      contextLabel="Избран месец"
      heroPillLabel="Месечен преглед"
      heroTitle="Основни фази и осветеност"
      monthLabel={route.labelBg}
      todayLabel={route.labelBg}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
