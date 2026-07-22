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
import { getLocalizedCity } from "@/data/cities-ru";
import { getCityGenitive, ruPreposition } from "@/lib/city-declension";
import { absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return OBLAST_ROUTE_MAP.map((route) => ({ slug: route.slugRu }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = getOblastRouteBySlug("ru", slug);

  if (!route) {
    return {};
  }

  const heading = getOblastHeading("ru", route.regionKey);
  const regionTitle = getOblastTitle("ru", route.regionKey);
  const paths = getOblastPathsByKey(route.regionKey);

  if (!heading || !regionTitle || !paths) {
    return {};
  }

  const prep = ruPreposition(heading);
  const title = `Магнитные бури ${prep} ${heading} сегодня — Kp-индекс и прогноз`;

  const region = getOblastRegion(route.regionKey);
  const siblingCities = (region?.slugs ?? [])
    .slice(1, 4)
    .map((citySlug) => getCityBySlug(citySlug))
    .filter((city): city is NonNullable<typeof city> => Boolean(city))
    .map((city) => {
      const ru = getLocalizedCity(city, "ru");
      return getCityGenitive(city.slug, ru.name, "ru");
    });
  const citiesSentence = siblingCities.length
    ? ` Отдельные данные для ${siblingCities.join(", ")} и других городов.`
    : "";
  const description = `Магнитные бури ${prep} ${heading} сегодня: текущий Kp-индекс, прогноз на 3 дня и предупреждения УкрГМЦ.${citiesSentence}`;

  return {
    title: {
      absolute: `${title} | Магнитка`,
    },
    description,
    alternates: {
      canonical: paths.ru,
      languages: {
        uk: absoluteUrl(paths.uk),
        ru: absoluteUrl(paths.ru),
        "x-default": absoluteUrl(paths.uk),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(paths.ru),
      locale: "ru_RU",
      type: "website",
    },
  };
}

export default async function OblastRuPage({ params }: PageProps) {
  const { slug } = await params;
  const route = getOblastRouteBySlug("ru", slug);

  if (!route) {
    notFound();
  }

  return <OblastPage locale="ru" regionKey={route.regionKey} />;
}
