import { NextRequest, NextResponse } from "next/server";
import {
  buildCitySunTimesCacheKey,
  formatDayLength,
  getDateInTimeZone,
  type CitySunTimesPayload,
} from "@/lib/city-sun-times";
import { getCitySunTimesCache, setCitySunTimesCache } from "@/lib/city-sun-times-cache";
import type { SiteLocale } from "@/lib/locale";

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
  const date = searchParams.get("date") ?? getDateInTimeZone(timezone);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const cacheKey = buildCitySunTimesCacheKey(lat, lon, timezone, date);
  const cached = await getCitySunTimesCache(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  }

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&daily=sunrise,sunset&timezone=${encodeURIComponent(timezone)}` +
      `&start_date=${date}&end_date=${date}`,
    {
      next: { revalidate: 86400 },
    }
  );

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch sun times" }, { status: 502 });
  }

  const data = await response.json();
  const sunrise = data?.daily?.sunrise?.[0];
  const sunset = data?.daily?.sunset?.[0];

  if (!sunrise || !sunset) {
    return NextResponse.json({ error: "Missing sun times payload" }, { status: 502 });
  }

  const payload: CitySunTimesPayload = {
    date,
    sunrise,
    sunset,
    dayLength: formatDayLength(sunrise, sunset, locale),
    timezone,
  };

  await setCitySunTimesCache(cacheKey, payload);

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
