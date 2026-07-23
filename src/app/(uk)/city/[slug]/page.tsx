import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CityPageClient from "@/legacy-pages/CityPage";
import { ALL_UK_CITIES, getCityBySlug } from "@/data/cities";
import { getCityByRuSlug, getRuCitySlug } from "@/data/cities-ru";
import { getCityWeatherCache } from "@/lib/city-weather-cache";
import { getCitySunTimesCache } from "@/lib/city-sun-times-cache";
import { buildCityWeatherCacheKey } from "@/lib/city-weather";
import { buildCitySunTimesCacheKey, getDateInTimeZone } from "@/lib/city-sun-times";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";
import { ukGeoContext } from "@/lib/city-geo";
import { absoluteUrl } from "@/lib/site";

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

  const geo = ukGeoContext(city.slug);
  const ogTitle = `${city.seoTitle} (${geo})`;
  const ogDescription = `${city.seoDescription} (${geo})`;

  return {
    title: ogTitle,
    description: ogDescription,
    alternates: {
      canonical: `/city/${city.slug}`,
      languages: {
        uk: `/city/${city.slug}`,
        ru: `/ru/city/${getRuCitySlug(city)}`,
        "x-default": `/city/${city.slug}`,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: absoluteUrl(`/city/${city.slug}`),
      locale: "uk_UA",
      type: "website",
    },
    twitter: {
      title: ogTitle,
      description: ogDescription,
    },
  };
}

export const revalidate = 3600;

export default async function CityPage({ params }: Params) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    const ruCity = getCityByRuSlug(slug, ALL_UK_CITIES);
    if (ruCity) {
      permanentRedirect(`/ru/city/${slug}`);
    }

    notFound();
  }

  const date = getDateInTimeZone(city.timezone);
  const [weatherCache, sunTimesCache, { kpData, scales, forecast3Day }] = await Promise.all([
    getCityWeatherCache(buildCityWeatherCacheKey(city.lat, city.lon, city.timezone)),
    getCitySunTimesCache(buildCitySunTimesCacheKey(city.lat, city.lon, city.timezone, date)),
    getHomePageWeatherData(),
  ]);

  return (
    <CityPageClient
      slug={slug}
      locale="uk"
      initialWeather={weatherCache?.payload ?? null}
      initialSunTimes={sunTimesCache}
      initialKp={kpData}
      initialScales={scales}
      initialForecast3={forecast3Day}
    />
  );
}
