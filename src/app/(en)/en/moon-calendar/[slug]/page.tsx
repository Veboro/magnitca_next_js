import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { findMoonMonthRouteBySlug, getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return getMoonMonthRoutes2026().map((route) => ({ slug: route.slugEn }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("en", slug);
  if (!route) return {};

  const title = `Moon calendar for ${route.labelEn} — Moon phases day by day`;
  const description = `Moon calendar for ${route.labelEn}: daily Moon phases, new moon, full moon, quarters and illumination.`;

  return {
    title: {
      absolute: `${title} | Magnitca`,
    },
    description,
    alternates: {
      canonical: route.hrefEn,
      languages: {
        uk: route.hrefUk,
        ru: route.hrefRu,
        pl: route.hrefPl,
        ro: route.hrefRo,
        hu: route.hrefHu,
        en: route.hrefEn,
        "x-default": route.hrefUk,
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(route.hrefEn),
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function MoonCalendarMonthEnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("en", slug);
  if (!route) notFound();

  const overview = await getMoonCalendarOverview(route.year, route.month);
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      locale="en"
      heading={`Moon calendar for ${route.labelEn}`}
      introText={`Moon phases, new moon, full moon and quarters for ${route.labelEn}. Below you will find a day-by-day calendar and the key phases of the month.`}
      contextLabel="Selected month"
      heroPillLabel="Month overview"
      heroTitle="Key phases and illumination"
      monthLabel={overview.monthLabelEn}
      todayLabel={route.labelEn}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
