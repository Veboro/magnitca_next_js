import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlSunPage } from "@/components/next/pl-sun-page";
import { CITIES_BG } from "@/data/cities-bg";
import { getSunriseOverview } from "@/lib/sunrise-overview";
import { absoluteUrl } from "@/lib/site";

type SunPageSlug = "sunrise" | "sunrise-tomorrow" | "sunset" | "sunset-tomorrow";

type Params = {
  params: Promise<{ sunPage: string }>;
};

const SUN_PAGES: SunPageSlug[] = ["sunrise", "sunrise-tomorrow", "sunset", "sunset-tomorrow"];

function parseSunPage(value: string): { kind: "sunrise" | "sunset"; mode: "today" | "tomorrow" } | null {
  if (!SUN_PAGES.includes(value as SunPageSlug)) return null;
  return {
    kind: value.startsWith("sunrise") ? "sunrise" : "sunset",
    mode: value.endsWith("tomorrow") ? "tomorrow" : "today",
  };
}

function formatPageDate(dateKey: string) {
  return new Intl.DateTimeFormat("bg-BG", {
    timeZone: "Europe/Sofia",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateKey}T00:00:00`));
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} часа ${m} минути`;
}

export function generateStaticParams() {
  return SUN_PAGES.map((sunPage) => ({ sunPage }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sunPage } = await params;
  const parsed = parseSunPage(sunPage);

  if (!parsed) {
    return {
      title: "Страницата не е намерена",
    };
  }

  const dayWord = parsed.mode === "tomorrow" ? "утре" : "днес";
  const title =
    parsed.kind === "sunrise"
      ? `Изгрев в България ${dayWord} — часове по градове`
      : `Залез в България ${dayWord} — часове по градове`;
  const description =
    parsed.kind === "sunrise"
      ? `Изгрев в България ${dayWord}: часове по градове, зазоряване, залез и продължителност на деня.`
      : `Залез в България ${dayWord}: часове по градове, здрач, продължителност на нощта и следващ изгрев.`;
  const canonical = `/bg/${sunPage}`;

  return {
    title: {
      absolute: `${title} | Magnitca`,
    },
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      locale: "bg_BG",
      type: "website",
    },
    twitter: {
      title,
      description,
    },
  };
}

export const revalidate = 3600;

export default async function BulgarianSunPage({ params }: Params) {
  const { sunPage } = await params;
  const parsed = parseSunPage(sunPage);

  if (!parsed) {
    notFound();
  }

  const overview = await getSunriseOverview(parsed.mode === "tomorrow" ? 1 : 0, {
    cities: CITIES_BG,
    timezone: "Europe/Sofia",
    locale: "bg",
  });

  return (
    <PlSunPage
      locale="bg"
      kind={parsed.kind}
      mode={parsed.mode}
      dateLabel={formatPageDate(overview.date)}
      cities={overview.cities}
      earliestSunrise={overview.earliestSunrise}
      latestSunrise={overview.latestSunrise}
      earliestSunset={overview.earliestSunset}
      latestSunset={overview.latestSunset}
      averageDayLengthLabel={formatMinutes(overview.averageDayLengthMinutes)}
    />
  );
}
