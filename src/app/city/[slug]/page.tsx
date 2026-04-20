import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityPageClient from "@/legacy-pages/CityPage";
import { ALL_UK_CITIES, getCityBySlug } from "@/data/cities";
import { getRuCitySlug } from "@/data/cities-ru";

type Params = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ALL_UK_CITIES.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    return {
      title: "Місто не знайдено",
    };
  }

  return {
    title: city.seoTitle,
    description: city.seoDescription,
    alternates: {
      canonical: `/city/${city.slug}`,
      languages: {
        uk: `/city/${city.slug}`,
        ru: `/ru/city/${getRuCitySlug(city)}`,
        "x-default": `/city/${city.slug}`,
      },
    },
  };
}

export const revalidate = 3600;

export default async function CityPage({ params }: Params) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  return (
    <CityPageClient slug={slug} locale="uk" />
  );
}
