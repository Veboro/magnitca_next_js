import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { findMoonMonthRouteBySlug, getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return getMoonMonthRoutes2026().map((route) => ({ slug: route.slugRo }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("ro", slug);
  if (!route) return {};

  const title = `Calendar lunar pentru ${route.labelRo}`;
  const description = `Calendar lunar pentru ${route.labelRo}: fazele Lunii pe zile, Luna nouă, Luna plină, pătrarele și iluminarea discului lunar.`;

  return {
    title: {
      absolute: `${title} | Magnitca Moldova`,
    },
    description,
    alternates: {
      canonical: route.hrefRo,
      languages: {
        uk: route.hrefUk,
        ru: route.hrefRu,
        pl: route.hrefPl,
        ro: route.hrefRo,
        "x-default": route.hrefUk,
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(route.hrefRo),
      locale: "ro_MD",
      type: "website",
    },
  };
}

export default async function MoonCalendarMonthRoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("ro", slug);
  if (!route) notFound();

  const overview = await getMoonCalendarOverview(route.year, route.month);
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      locale="ro"
      heading={`Calendar lunar pentru ${route.labelRo}`}
      introText={`Fazele Lunii, datele importante ale Lunii noi, Lunii pline și pătrarelor pentru ${route.labelRo}. Mai jos găsești calendarul pe zile și fazele principale ale lunii.`}
      contextLabel="Luna selectată"
      heroPillLabel="Privire de ansamblu"
      heroTitle="Faze principale și iluminare"
      monthLabel={route.labelRo}
      todayLabel={route.labelRo}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
