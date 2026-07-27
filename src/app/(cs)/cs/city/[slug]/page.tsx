import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityPageClient from "@/legacy-pages/CityPage";
import { CITIES_CS, getCityByCsSlug } from "@/data/cities-cs";
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
  return CITIES_CS.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityByCsSlug(slug);

  if (!city) {
    return {
      title: "Město nenalezeno",
    };
  }

  const region = getRegionForCity("cs", city.slug);
  const geo = region ? `${region.title}, Česko` : "Česko";
  const title = `${city.seoTitle} (${geo})`;
  const description = `${city.seoDescription} (${geo})`;
  const canonical = `/cs/city/${city.slug}`;

  return {
    title: {
      absolute: `${title} | Magnitca`,
    },
    description,
    alternates: {
      canonical,
      languages: {
        bg: canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      locale: "cs_CZ",
      type: "website",
    },
    twitter: {
      title,
      description,
    },
  };
}

export const revalidate = 3600;

export default async function CzechCityPage({ params }: Params) {
  const { slug } = await params;
  const city = getCityByCsSlug(slug);

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
      locale="cs"
      initialWeather={weatherCache?.payload ?? null}
      initialSunTimes={sunTimesCache}
      initialKp={kpData}
      initialScales={scales}
      initialForecast3={forecast3Day}
    />
  );
}
