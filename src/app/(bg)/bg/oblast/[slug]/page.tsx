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
  return getCountryRegionsByLocale("bg", "oblast").map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = getCountryRegionBySlug("bg", "oblast", slug);

  if (!region) return {};

  const path = getCountryRegionPath(region);
  const title = `${region.title}: магнитни бури днес, Kp-индекс и прогноза`;
  const description = `${region.title}: актуален Kp-индекс, слънчев вятър, Bz, 3-дневна геомагнитна прогноза и градовете в областта.`;

  return {
    title: { absolute: `${title} | Magnitca` },
    description,
    alternates: { canonical: path, languages: { bg: absoluteUrl(path) } },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      locale: "bg_BG",
      type: "website",
    },
  };
}

export default async function BulgarianCountyPage({ params }: PageProps) {
  const { slug } = await params;
  const region = getCountryRegionBySlug("bg", "oblast", slug);

  if (!region) notFound();

  return <CountryRegionPage region={region} />;
}
