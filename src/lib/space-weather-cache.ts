import { getSupabaseAdminClient } from "@/lib/server-supabase";

export const SPACE_WEATHER_KEYS = [
  "kp-index",
  "solar-wind",
  "mag-data",
  "noaa-scales",
  "kp-forecast-3day",
  "kp-forecast-27day",
] as const;

export type SpaceWeatherCacheKey = (typeof SPACE_WEATHER_KEYS)[number];

export async function getSpaceWeatherCache<T>(cacheKey: SpaceWeatherCacheKey): Promise<T | null> {
  try {
    const supabase = getSupabaseAdminClient() as any;
    const { data, error } = await supabase
      .from("space_weather_cache" as never)
      .select("payload")
      .eq("cache_key", cacheKey)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return (data.payload ?? null) as T | null;
  } catch {
    return null;
  }
}
