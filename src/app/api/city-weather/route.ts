import { NextRequest, NextResponse } from "next/server";
import { fetchCityWeatherFromSource, buildCityWeatherCacheKey } from "@/lib/city-weather";
import { getCityWeatherCache, setCityWeatherCache } from "@/lib/city-weather-cache";
import type { SiteLocale } from "@/lib/locale";

const CACHE_TTL_MS = 60 * 60 * 1000;

function getLocale(value: string | null): SiteLocale {
  if (value === "ru" || value === "pl") return value;
  return "uk";
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const timezone = searchParams.get("tz") ?? "Europe/Kyiv";
  const locale = getLocale(searchParams.get("locale"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const cacheKey = buildCityWeatherCacheKey(lat, lon, timezone);
  const cached = await getCityWeatherCache(cacheKey);

  if (cached) {
    const ageMs = Date.now() - new Date(cached.fetchedAt).getTime();
    if (ageMs < CACHE_TTL_MS) {
      return NextResponse.json(cached.payload, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        },
      });
    }
  }

  const payload = await fetchCityWeatherFromSource(lat, lon, timezone, locale);
  await setCityWeatherCache(cacheKey, payload);

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
    },
  });
}
