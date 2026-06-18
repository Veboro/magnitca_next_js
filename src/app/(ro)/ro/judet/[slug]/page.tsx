import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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
  return getCountryRegionsByLocale("ro", "judet").map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "bucuresti") {
    return {
      alternates: { canonical: "/ro/municipiu/bucuresti" },
      robots: { index: false, follow: true },
    };
  }

  const region = getCountryRegionBySlug("ro", "judet", slug);

  if (!region) return {};

  const path = getCountryRegionPath(region);
  const title = `${region.title}: furtuni magnetice astăzi, indice Kp și prognoză`;
  const description = `${region.title}: indice Kp actual, vânt solar, Bz, prognoza activității geomagnetice pe 3 zile și orașe din regiune.`;

  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: path, languages: { ro: absoluteUrl(path) } },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      locale: "ro_RO",
      type: "website",
    },
  };
}

export default async function RomanianCountyPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug === "bucuresti") {
    redirect("/ro/municipiu/bucuresti");
  }

  const region = getCountryRegionBySlug("ro", "judet", slug);

  if (!region) notFound();

  return <CountryRegionPage region={region} />;
}
