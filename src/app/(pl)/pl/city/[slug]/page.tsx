import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityPageClient from "@/legacy-pages/CityPage";
import { CITIES_PL, getCityByPlSlug } from "@/data/cities-pl";
import { getRegionForCity } from "@/lib/country-region-routes";
import { absoluteUrl } from "@/lib/site";
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

  const region = getRegionForCity("pl", city.slug);
  const geo = region ? `${region.title}, Polska` : "Polska";
  const title = `${city.seoTitle} (${geo})`;
  const description = `${city.seoDescription} (${geo})`;
  const canonical = `/pl/city/${city.slug}`;

  return {
    title: {
      absolute: `${title} | Magnitca`,
    },
    description,
    alternates: {
      canonical,
      languages: {
        pl: canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      locale: "pl_PL",
      type: "website",
    },
    twitter: {
      title,
      description,
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
