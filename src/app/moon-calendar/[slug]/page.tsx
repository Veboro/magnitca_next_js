import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoonCalendarPage } from "@/components/next/moon-calendar-page";
import { findMoonMonthRouteBySlug, getMoonCalendarOverview, getMoonMonthRoutes2026 } from "@/lib/moon-calendar";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return getMoonMonthRoutes2026().map((item) => ({ slug: item.slugUk }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("uk", slug);
  if (!route) return {};

  const title = `Місячний календар на ${route.labelUk} — фази Місяця по днях`;
  const description = `Місячний календар на ${route.labelUk}: фази Місяця по днях, молодик, повня, чверті та освітленість місячного диска.`;

  return {
    title: {
      absolute: `${title} | ${SITE_NAME}`,
    },
    description,
    alternates: {
      canonical: route.hrefUk,
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
      url: absoluteUrl(route.hrefUk),
      locale: "uk_UA",
      type: "website",
    },
  };
}

export default async function MoonCalendarMonthUkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = findMoonMonthRouteBySlug("uk", slug);
  if (!route) notFound();

  const overview = await getMoonCalendarOverview(route.year, route.month);
  const monthLinks = getMoonMonthRoutes2026();

  return (
    <MoonCalendarPage
      heading={`Місячний календар на ${route.labelUk}`}
      introText={`Фази Місяця, ключові дати молодика, повні та чвертей на ${route.labelUk}. Нижче зібрано календар по днях і головні фази цього місяця.`}
      contextLabel="Період"
      heroPillLabel="Огляд місяця"
      heroTitle="Ключові фази та освітленість"
      monthLabel={overview.monthLabelUk}
      todayLabel={route.labelUk}
      currentPhase={overview.currentPhase}
      keyPhases={overview.keyPhases}
      days={overview.days}
      averageIllumination={overview.averageIllumination}
      monthLinks={monthLinks}
    />
  );
}
