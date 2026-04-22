import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityPageClient from "@/legacy-pages/CityPage";
import { CITIES_PL, getCityByPlSlug } from "@/data/cities-pl";
import { getCityWeatherCache } from "@/lib/city-weather-cache";
import { getCitySunTimesCache } from "@/lib/city-sun-times-cache";
import { buildCityWeatherCacheKey } from "@/lib/city-weather";
import { buildCitySunTimesCacheKey, getDateInTimeZone } from "@/lib/city-sun-times";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

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

  const date = getDateInTimeZone(city.timezone);
  const [weatherCache, sunTimesCache, { kpData, scales, forecast3Day }] = await Promise.all([
    getCityWeatherCache(buildCityWeatherCacheKey(city.lat, city.lon, city.timezone)),
    getCitySunTimesCache(buildCitySunTimesCacheKey(city.lat, city.lon, city.timezone, date)),
    getHomePageWeatherData(),
  ]);

  return (
    <CityPageClient
      slug={slug}
      locale="pl"
      initialWeather={weatherCache?.payload ?? null}
      initialSunTimes={sunTimesCache}
      initialKp={kpData}
      initialScales={scales}
      initialForecast3={forecast3Day}
    />
  );
}
