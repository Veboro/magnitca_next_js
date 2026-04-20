import type { CityWeatherResult } from "@/lib/city-weather";
import { getSupabaseAdminClient } from "@/lib/server-supabase";

export interface CityWeatherCacheRow {
  payload: CityWeatherResult;
  fetchedAt: string;
}

export async function getCityWeatherCache(cacheKey: string): Promise<CityWeatherCacheRow | null> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = (await supabase
      .from("city_weather_cache" as any)
      .select("payload,fetched_at")
      .eq("cache_key", cacheKey)
      .maybeSingle()) as {
      data: { payload?: CityWeatherResult; fetched_at?: string } | null;
      error: { message: string } | null;
    };

    if (error) {
      console.warn("[city-weather-cache] read failed", error.message);
      return null;
    }

    if (!data?.payload || !data?.fetched_at) {
      return null;
    }

    return {
      payload: data.payload,
      fetchedAt: data.fetched_at,
    };
  } catch (error) {
    console.warn("[city-weather-cache] unavailable", error);
    return null;
  }
}

export async function setCityWeatherCache(cacheKey: string, payload: CityWeatherResult) {
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("city_weather_cache" as any)
      .upsert({
        cache_key: cacheKey,
        payload,
        fetched_at: new Date().toISOString(),
      });

    if (error) {
      console.warn("[city-weather-cache] write failed", error.message);
    }
  } catch (error) {
    console.warn("[city-weather-cache] unavailable", error);
  }
}
