import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountryRegionPage } from "@/components/next/country-region-page";
import {
  getCountryRegionBySlug,
  getCountryRegionPath,
  getCountryRegionsByLocale,
} from "@/lib/country-region-routes";
import { absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCountryRegionsByLocale("cs", "kraj").map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = getCountryRegionBySlug("cs", "kraj", slug);

  if (!region) return {};

  const path = getCountryRegionPath(region);
  const title = `${region.title}: magnetické bouře dnes, Kp-index a předpověď`;
  const description = `${region.title}: aktuální Kp-index, sluneční vítr, Bz, 3denní geomagnetická předpověď a města v kraji.`;

  return {
    title: { absolute: `${title} | Magnitca` },
    description,
    alternates: { canonical: path, languages: { cs: absoluteUrl(path) } },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      locale: "cs_CZ",
      type: "website",
    },
  };
}

export default async function CzechCountyPage({ params }: PageProps) {
  const { slug } = await params;
  const region = getCountryRegionBySlug("cs", "kraj", slug);

  if (!region) notFound();

  return <CountryRegionPage region={region} />;
}
