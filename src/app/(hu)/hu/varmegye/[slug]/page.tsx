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
  return getCountryRegionsByLocale("hu", "varmegye").map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = getCountryRegionBySlug("hu", "varmegye", slug);

  if (!region) return {};

  const path = getCountryRegionPath(region);
  const title = `${region.title}: mágneses viharok ma, Kp-index és előrejelzés`;
  const description = `${region.title}: aktuális Kp-index, napszél, Bz, 3 napos geomágneses előrejelzés és a régió városai.`;

  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: path, languages: { hu: absoluteUrl(path) } },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      locale: "hu_HU",
      type: "website",
    },
  };
}

export default async function HungarianCountyPage({ params }: PageProps) {
  const { slug } = await params;
  const region = getCountryRegionBySlug("hu", "varmegye", slug);

  if (!region) notFound();

  return <CountryRegionPage region={region} />;
}
