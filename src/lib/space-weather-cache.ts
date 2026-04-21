import { unstable_cache } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/server-supabase";
import type { KpEntry, SolarWindEntry, MagEntry, NoaaScales } from "@/hooks/useSpaceWeather";
import type { StormDay } from "@/hooks/useStormCalendar";

export const SPACE_WEATHER_KEYS = [
  "kp-index",
  "solar-wind",
  "mag-data",
  "noaa-scales",
  "kp-forecast-3day",
  "kp-forecast-27day",
  "storm-calendar",
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

export interface HomePageWeatherData {
  kpData: KpEntry[] | null;
  windData: SolarWindEntry[] | null;
  magData: MagEntry[] | null;
  scales: NoaaScales | null;
}

export const getHomePageWeatherData = unstable_cache(
  async (): Promise<HomePageWeatherData> => {
    const [kpData, windData, magData, scales] = await Promise.all([
      getSpaceWeatherCache<KpEntry[]>("kp-index"),
      getSpaceWeatherCache<SolarWindEntry[]>("solar-wind"),
      getSpaceWeatherCache<MagEntry[]>("mag-data"),
      getSpaceWeatherCache<NoaaScales>("noaa-scales"),
    ]);
    return { kpData, windData, magData, scales };
  },
  ["home-weather"],
  { revalidate: 300 },
);

export async function getStormCalendarData(): Promise<StormDay[] | null> {
  return getSpaceWeatherCache<StormDay[]>("storm-calendar");
}
