import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { findMoonMonthRouteBySlug, getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return getMoonMonthRoutes2026().map((route) => ({ slug: route.slugHu }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("hu", slug);
  if (!route) return {};

  const title = `Holdnaptár ${route.labelHu} hónapra — holdfázisok napi bontásban`;
  const description = `Holdnaptár ${route.labelHu} hónapra: napi holdfázisok, újhold, telihold, negyedek és megvilágítottság.`;

  return {
    title: {
      absolute: `${title} | Magnitca`,
    },
    description,
    alternates: {
      canonical: route.hrefHu,
      languages: {
        uk: route.hrefUk,
        ru: route.hrefRu,
        pl: route.hrefPl,
        ro: route.hrefRo,
        hu: route.hrefHu,
        "x-default": route.hrefUk,
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(route.hrefHu),
      locale: "hu_HU",
      type: "website",
    },
  };
}

export default async function MoonCalendarMonthHuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("hu", slug);
  if (!route) notFound();

  const overview = await getMoonCalendarOverview(route.year, route.month);
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      locale="hu"
      heading={`Holdnaptár ${route.labelHu} hónapra`}
      introText={`Holdfázisok, újhold, telihold és negyedek ${route.labelHu} hónapban. Lent napi bontásban látható a Hold állapota és megvilágítottsága.`}
      contextLabel="Kiválasztott hónap"
      heroPillLabel="Havi áttekintés"
      heroTitle="Fő fázisok és megvilágítás"
      monthLabel={route.labelHu}
      todayLabel={route.labelHu}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
