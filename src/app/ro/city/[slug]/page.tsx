import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityPageClient from "@/legacy-pages/CityPage";
import { CITIES_MD, getCityByMdSlug } from "@/data/cities-md";
import { getCityWeatherCache } from "@/lib/city-weather-cache";
import { getCitySunTimesCache } from "@/lib/city-sun-times-cache";
import { buildCityWeatherCacheKey } from "@/lib/city-weather";
import { buildCitySunTimesCacheKey, getDateInTimeZone } from "@/lib/city-sun-times";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

type Params = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CITIES_MD.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityByMdSlug(slug);

  if (!city) {
    return {
      title: "Orașul nu a fost găsit",
    };
  }

  return {
    title: {
      absolute: `${city.seoTitle} | Magnitca`,
    },
    description: city.seoDescription,
    alternates: {
      canonical: `/ro/city/${city.slug}`,
      languages: {
        ro: `/ro/city/${city.slug}`,
      },
    },
  };
}

export const revalidate = 3600;

export default async function RomanianCityPage({ params }: Params) {
  const { slug } = await params;
  const city = getCityByMdSlug(slug);

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
      locale="ro"
      initialWeather={weatherCache?.payload ?? null}
      initialSunTimes={sunTimesCache}
      initialKp={kpData}
      initialScales={scales}
      initialForecast3={forecast3Day}
    />
  );
}
