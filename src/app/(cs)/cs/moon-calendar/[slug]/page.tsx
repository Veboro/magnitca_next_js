import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { findMoonMonthRouteBySlug, getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return getMoonMonthRoutes2026().map((route) => ({ slug: route.slugCs }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("cs", slug);
  if (!route) return {};

  const title = `Lunární kalendář na ${route.labelCs} — fáze Měsíce po dnech`;
  const description = `Lunární kalendář na ${route.labelCs}: denní fáze Měsíce, nov, úplněk, čtvrti a osvětlení.`;

  return {
    title: {
      absolute: `${title} | Magnitca`,
    },
    description,
    alternates: {
      canonical: route.hrefCs,
      languages: {
        uk: route.hrefUk,
        ru: route.hrefRu,
        pl: route.hrefPl,
        ro: route.hrefRo,
        hu: route.hrefHu,
        bg: route.hrefBg,
        cs: route.hrefCs,
        en: route.hrefEn,
        "x-default": route.hrefUk,
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(route.hrefCs),
      locale: "cs_CZ",
      type: "website",
    },
  };
}

export default async function MoonCalendarMonthHuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("cs", slug);
  if (!route) notFound();

  const overview = await getMoonCalendarOverview(route.year, route.month);
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      locale="cs"
      heading={`Lunární kalendář na ${route.labelCs}`}
      introText={`Fáze Měsíce, nov, úplněk a čtvrti během ${route.labelCs}. Níže si můžete prohlédnout stav a osvětlení Měsíce po dnech.`}
      contextLabel="Vybraný měsíc"
      heroPillLabel="Měsíční přehled"
      heroTitle="Hlavní fáze a osvětlení"
      monthLabel={route.labelCs}
      todayLabel={route.labelCs}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
