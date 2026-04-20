import { useQuery } from "@tanstack/react-query";
import {
  formatDayLength,
  getDateInTimeZone,
  type CitySunTimesPayload,
} from "@/lib/city-sun-times";
import type { SiteLocale } from "@/lib/locale";

interface UseCitySunTimesArgs {
  lat: number;
  lon: number;
  timezone: string;
  locale: SiteLocale;
  fallback?: {
    sunrise: string;
    sunset: string;
  } | null;
}

async function fetchCitySunTimes(
  lat: number,
  lon: number,
  timezone: string,
  locale: SiteLocale,
  date: string
): Promise<CitySunTimesPayload> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    tz: timezone,
    locale,
    date,
  });

  const response = await fetch(`/api/city-sun-times?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch city sun times");
  }
  return response.json();
}

export function useCitySunTimes({ lat, lon, timezone, locale, fallback }: UseCitySunTimesArgs) {
  const date = getDateInTimeZone(timezone);

  return useQuery({
    queryKey: ["city-sun-times", lat, lon, timezone, date, locale],
    queryFn: () => fetchCitySunTimes(lat, lon, timezone, locale, date),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 3 * 24 * 60 * 60 * 1000,
    initialData: fallback
      ? {
          date,
          sunrise: fallback.sunrise,
          sunset: fallback.sunset,
          dayLength: formatDayLength(fallback.sunrise, fallback.sunset, locale),
          timezone,
        }
      : undefined,
  });
}
