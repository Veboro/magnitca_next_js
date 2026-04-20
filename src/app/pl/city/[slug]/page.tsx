import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityPageClient from "@/legacy-pages/CityPage";
import { CITIES_PL, getCityByPlSlug } from "@/data/cities-pl";

type Params = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CITIES_PL.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityByPlSlug(slug);

  if (!city) {
    return {
      title: "Nie znaleziono miasta",
    };
  }

  return {
    title: city.seoTitle,
    description: city.seoDescription,
    alternates: {
      canonical: `/pl/city/${city.slug}`,
      languages: {
        pl: `/pl/city/${city.slug}`,
      },
    },
  };
}

export const revalidate = 3600;

export default async function PolishCityPage({ params }: Params) {
  const { slug } = await params;
  const city = getCityByPlSlug(slug);

  if (!city) {
    notFound();
  }

  return <CityPageClient slug={slug} locale="pl" />;
}
