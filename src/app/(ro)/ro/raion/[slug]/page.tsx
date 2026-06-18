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

const legacyRedirects: Record<string, string> = {
  chisinau: "/ro/municipiu/chisinau",
  balti: "/ro/municipiu/balti",
  tiraspol: "/ro/municipiu/tiraspol",
  bender: "/ro/municipiu/bender",
  gagauzia: "/ro/regiune/gagauzia",
};

export function generateStaticParams() {
  return getCountryRegionsByLocale("ro", "raion").map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (legacyRedirects[slug]) {
    return {
      alternates: { canonical: legacyRedirects[slug] },
      robots: { index: false, follow: true },
    };
  }

  const region = getCountryRegionBySlug("ro", "raion", slug);

  if (!region) return {};

  const path = getCountryRegionPath(region);
  const title = `${region.title}: furtuni magnetice astăzi, indice Kp și prognoză`;
  const description = `${region.title}, Moldova: indice Kp actual, vânt solar, Bz, prognoza activității geomagnetice pe 3 zile și localități din regiune.`;

  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: path, languages: { ro: absoluteUrl(path) } },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      locale: "ro_MD",
      type: "website",
    },
  };
}

export default async function MoldovanRaionPage({ params }: PageProps) {
  const { slug } = await params;
  if (legacyRedirects[slug]) {
    redirect(legacyRedirects[slug]);
  }

  const region = getCountryRegionBySlug("ro", "raion", slug);

  if (!region) notFound();

  return <CountryRegionPage region={region} />;
}
