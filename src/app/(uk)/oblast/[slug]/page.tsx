import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OblastPage } from "@/components/next/oblast-page";
import {
  getOblastHeading,
  getOblastPathsByKey,
  getOblastRegion,
  getOblastRouteBySlug,
  getOblastTitle,
  OBLAST_ROUTE_MAP,
} from "@/lib/oblast-routes";
import { getCityBySlug } from "@/data/cities";
import { getCityGenitive, ukPreposition } from "@/lib/city-declension";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return OBLAST_ROUTE_MAP.map((route) => ({ slug: route.slugUk }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = getOblastRouteBySlug("uk", slug);

  if (!route) {
    return {};
  }

  const heading = getOblastHeading("uk", route.regionKey);
  const regionTitle = getOblastTitle("uk", route.regionKey);
  const paths = getOblastPathsByKey(route.regionKey);

  if (!heading || !regionTitle || !paths) {
    return {};
  }

  const prep = ukPreposition(heading);
  const title = `Магнітні бурі ${prep} ${heading} сьогодні — Kp-індекс і прогноз`;

  const region = getOblastRegion(route.regionKey);
  const siblingCities = (region?.slugs ?? [])
    .slice(1, 4)
    .map((citySlug) => getCityBySlug(citySlug))
    .filter((city): city is NonNullable<typeof city> => Boolean(city))
    .map((city) => getCityGenitive(city.slug, city.name, "uk"));
  const citiesSentence = siblingCities.length
    ? ` Окремі дані для ${siblingCities.join(", ")} та інших міст.`
    : "";
  const description = `Магнітні бурі ${prep} ${heading} сьогодні: поточний Kp-індекс, прогноз на 3 дні та попередження УкрГМЦ.${citiesSentence}`;

  return {
    title: {
      absolute: `${title} | ${SITE_NAME}`,
    },
    description,
    alternates: {
      canonical: paths.uk,
      languages: {
        uk: absoluteUrl(paths.uk),
        ru: absoluteUrl(paths.ru),
        "x-default": absoluteUrl(paths.uk),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(paths.uk),
      locale: "uk_UA",
      type: "website",
    },
  };
}

export default async function OblastUkPage({ params }: PageProps) {
  const { slug } = await params;
  const route = getOblastRouteBySlug("uk", slug);

  if (!route) {
    notFound();
  }

  return <OblastPage locale="uk" regionKey={route.regionKey} />;
}
