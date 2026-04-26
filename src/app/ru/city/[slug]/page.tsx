import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import CityPageClient from "@/legacy-pages/CityPage";
import { ALL_UK_CITIES, getCityBySlug } from "@/data/cities";
import { getCityByRuSlug, getLocalizedCity, getRuCitySlug } from "@/data/cities-ru";
import { getCityWeatherCache } from "@/lib/city-weather-cache";
import { getCitySunTimesCache } from "@/lib/city-sun-times-cache";
import { buildCityWeatherCacheKey } from "@/lib/city-weather";
import { buildCitySunTimesCacheKey, getDateInTimeZone } from "@/lib/city-sun-times";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

type Params = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ALL_UK_CITIES.map((city) => ({ slug: getRuCitySlug(city) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityByRuSlug(slug, ALL_UK_CITIES);

  if (!city) {
    return {
      title: "Город не найден",
    };
  }

  const localizedCity = getLocalizedCity(city, "ru");

  return {
    title: {
      absolute: `${localizedCity.seoTitle} | Магнитка`,
    },
    description: localizedCity.seoDescription,
    alternates: {
      canonical: `/ru/city/${getRuCitySlug(city)}`,
      languages: {
        uk: `/city/${city.slug}`,
        ru: `/ru/city/${getRuCitySlug(city)}`,
        "x-default": `/city/${city.slug}`,
      },
    },
  };
}

export const revalidate = 3600;

export default async function RussianCityPage({ params }: Params) {
  const { slug } = await params;
  const city = getCityByRuSlug(slug, ALL_UK_CITIES);

  if (!city) {
    const fallbackCity = getCityBySlug(slug);

    if (fallbackCity) {
      const canonicalRuSlug = getRuCitySlug(fallbackCity);

      if (canonicalRuSlug !== slug) {
        redirect(`/ru/city/${canonicalRuSlug}`);
      }
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
      slug={city.slug}
      locale="ru"
      initialWeather={weatherCache?.payload ?? null}
      initialSunTimes={sunTimesCache}
      initialKp={kpData}
      initialScales={scales}
      initialForecast3={forecast3Day}
    />
  );
}
