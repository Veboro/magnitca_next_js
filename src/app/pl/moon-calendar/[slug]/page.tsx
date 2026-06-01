import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { findMoonMonthRouteBySlug, getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return getMoonMonthRoutes2026().map((item) => ({ slug: item.slugPl }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("pl", slug);
  if (!route) return {};

  const title = `Kalendarz księżycowy na ${route.labelPl} — fazy Księżyca dzień po dniu`;
  const description = `Kalendarz księżycowy na ${route.labelPl}: fazy Księżyca dzień po dniu, nów, pełnia, kwadry i oświetlenie tarczy księżycowej.`;

  return {
    title: {
      absolute: `${title} | Magnitca`,
    },
    description,
    alternates: {
      canonical: route.hrefPl,
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
      url: absoluteUrl(route.hrefPl),
      locale: "pl_PL",
      type: "website",
    },
  };
}

export default async function MoonCalendarMonthPlPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("pl", slug);
  if (!route) notFound();

  const overview = await getMoonCalendarOverview(route.year, route.month);
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      locale="pl"
      heading={`Kalendarz księżycowy na ${route.labelPl}`}
      introText={`Fazy Księżyca, najważniejsze daty nowiu, pełni i kwadr na ${route.labelPl}. Poniżej znajdziesz kalendarz dzień po dniu oraz główne fazy tego miesiąca.`}
      contextLabel="Okres"
      heroPillLabel="Przegląd miesiąca"
      heroTitle="Kluczowe fazy i oświetlenie"
      monthLabel={overview.monthLabelPl}
      todayLabel={route.labelPl}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
