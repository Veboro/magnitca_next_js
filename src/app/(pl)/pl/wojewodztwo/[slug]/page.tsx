import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountryRegionPage } from "@/components/next/country-region-page";
import {
  getCountryRegionBySlug,
  getCountryRegionPath,
  getCountryRegionsByLocale,
} from "@/lib/country-region-routes";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCountryRegionsByLocale("pl", "wojewodztwo").map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = getCountryRegionBySlug("pl", "wojewodztwo", slug);

  if (!region) return {};

  const path = getCountryRegionPath(region);
  const title = `${region.title}: burze magnetyczne dzisiaj, Kp-index i prognoza`;
  const description = `${region.title}: aktualny Kp-index, wiatr słoneczny, Bz, prognoza aktywności geomagnetycznej na 3 dni oraz miasta regionu.`;

  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: path, languages: { pl: absoluteUrl(path) } },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      locale: "pl_PL",
      type: "website",
    },
  };
}

export default async function PolishVoivodeshipPage({ params }: PageProps) {
  const { slug } = await params;
  const region = getCountryRegionBySlug("pl", "wojewodztwo", slug);

  if (!region) notFound();

  return <CountryRegionPage region={region} />;
}
