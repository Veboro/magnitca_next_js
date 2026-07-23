import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoCountrySunPage } from "@/components/next/ro-country-sun-page";
import { getCitiesByRoCountrySlug, getRoCountryBySlug, RO_COUNTRIES } from "@/data/cities-md";
import { getSunriseOverview } from "@/lib/sunrise-overview";
import { absoluteUrl } from "@/lib/site";

type SunPageSlug = "sunrise" | "sunrise-tomorrow" | "sunset" | "sunset-tomorrow";

type Params = {
  params: Promise<{ slug: string; sunPage: string }>;
};

const SUN_PAGES: SunPageSlug[] = ["sunrise", "sunrise-tomorrow", "sunset", "sunset-tomorrow"];

function parseSunPage(value: string): { kind: "sunrise" | "sunset"; mode: "today" | "tomorrow" } | null {
  if (!SUN_PAGES.includes(value as SunPageSlug)) return null;
  return {
    kind: value.startsWith("sunrise") ? "sunrise" : "sunset",
    mode: value.endsWith("tomorrow") ? "tomorrow" : "today",
  };
}

function formatPageDate(dateKey: string, timezone: string) {
  return new Intl.DateTimeFormat("ro-MD", {
    timeZone: timezone,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateKey}T00:00:00`));
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} h ${m} min`;
}

export function generateStaticParams() {
  return RO_COUNTRIES.flatMap((country) => SUN_PAGES.map((sunPage) => ({ slug: country.slug, sunPage })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, sunPage } = await params;
  const country = getRoCountryBySlug(slug);
  const parsed = parseSunPage(sunPage);

  if (!country || !parsed) {
    return {
      title: "Pagina nu a fost găsită",
    };
  }

  const dayWord = parsed.mode === "tomorrow" ? "mâine" : "astăzi";
  const title =
    parsed.kind === "sunrise"
      ? `Răsăritul soarelui în ${country.name} ${dayWord} — ora pe orașe`
      : `Apusul soarelui în ${country.name} ${dayWord} — ora pe orașe`;
  const description =
    parsed.kind === "sunrise"
      ? `Răsăritul soarelui în ${country.name} ${dayWord}: ore pentru orașele disponibile, zori, apus și durata zilei.`
      : `Apusul soarelui în ${country.name} ${dayWord}: ore pentru orașele disponibile, amurg, durata nopții și următorul răsărit.`;
  const canonical = `/ro/country/${country.slug}/${sunPage}`;

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
      locale: "ro_MD",
      type: "website",
    },
    twitter: {
      title,
      description,
    },
  };
}

export const revalidate = 3600;

export default async function RomanianCountrySunPage({ params }: Params) {
  const { slug, sunPage } = await params;
  const country = getRoCountryBySlug(slug);
  const parsed = parseSunPage(sunPage);

  if (!country || !parsed) {
    notFound();
  }

  const cities = getCitiesByRoCountrySlug(country.slug);
  const timezone = country.slug === "romania" ? "Europe/Bucharest" : "Europe/Chisinau";
  const overview = await getSunriseOverview(parsed.mode === "tomorrow" ? 1 : 0, {
    cities,
    timezone,
    locale: "ro",
  });

  return (
    <RoCountrySunPage
      country={country}
      kind={parsed.kind}
      mode={parsed.mode}
      dateLabel={formatPageDate(overview.date, timezone)}
      cities={overview.cities}
      earliestSunrise={overview.earliestSunrise}
      latestSunrise={overview.latestSunrise}
      earliestSunset={overview.earliestSunset}
      latestSunset={overview.latestSunset}
      averageDayLengthLabel={formatMinutes(overview.averageDayLengthMinutes)}
    />
  );
}
