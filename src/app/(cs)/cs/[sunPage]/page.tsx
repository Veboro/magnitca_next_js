import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlSunPage } from "@/components/next/pl-sun-page";
import { CITIES_CS } from "@/data/cities-cs";
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
  return new Intl.DateTimeFormat("cs-CZ", {
    timeZone: "Europe/Prague",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateKey}T00:00:00`));
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} hodin ${m} minut`;
}

export function generateStaticParams() {
  return SUN_PAGES.map((sunPage) => ({ sunPage }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sunPage } = await params;
  const parsed = parseSunPage(sunPage);

  if (!parsed) {
    return {
      title: "Stránka nenalezena",
    };
  }

  const dayWord = parsed.mode === "tomorrow" ? "zítra" : "dnes";
  const title =
    parsed.kind === "sunrise"
      ? `Východ Slunce v Česku ${dayWord} — časy podle měst`
      : `Západ Slunce v Česku ${dayWord} — časy podle měst`;
  const description =
    parsed.kind === "sunrise"
      ? `Východ Slunce v Česku ${dayWord}: časy podle měst, svítání, západ Slunce a délka dne.`
      : `Západ Slunce v Česku ${dayWord}: časy podle měst, soumrak, délka noci a následující východ Slunce.`;
  const canonical = `/cs/${sunPage}`;

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
      locale: "cs_CZ",
      type: "website",
    },
    twitter: {
      title,
      description,
    },
  };
}

export const revalidate = 3600;

export default async function CzechSunPage({ params }: Params) {
  const { sunPage } = await params;
  const parsed = parseSunPage(sunPage);

  if (!parsed) {
    notFound();
  }

  const overview = await getSunriseOverview(parsed.mode === "tomorrow" ? 1 : 0, {
    cities: CITIES_CS,
    timezone: "Europe/Prague",
    locale: "cs",
  });

  return (
    <PlSunPage
      locale="cs"
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
