import { unstable_cache } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/server-supabase";
import type { KpEntry, SolarWindEntry, MagEntry, NoaaScales } from "@/hooks/useSpaceWeather";
import type { KpForecastEntry } from "@/hooks/useKpForecast";
import type { StormDay } from "@/hooks/useStormCalendar";

const SWPC_BASE = "https://services.swpc.noaa.gov";

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

async function fetchSpaceWeatherFallback<T>(cacheKey: SpaceWeatherCacheKey): Promise<T | null> {
  switch (cacheKey) {
    case "kp-index": {
      const response = await fetch(`${SWPC_BASE}/json/planetary_k_index_1m.json`, {
        next: { revalidate: 300 },
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.map((d: any) => ({
        time_tag: d.time_tag,
        kp: parseFloat(d.estimated_kp ?? d.kp_index ?? d.kp ?? 0),
      })) as T;
    }
    case "solar-wind": {
      const response = await fetch(`${SWPC_BASE}/products/solar-wind/plasma-2-hour.json`, {
        next: { revalidate: 300 },
      });
      if (!response.ok) return null;
      const data: string[][] = await response.json();
      return data.slice(1).map((row) => ({
        time_tag: row[0],
        density: parseFloat(row[1]) || 0,
        speed: parseFloat(row[2]) || 0,
        temperature: parseFloat(row[3]) || 0,
      })) as T;
    }
    case "mag-data": {
      const response = await fetch(`${SWPC_BASE}/products/solar-wind/mag-2-hour.json`, {
        next: { revalidate: 300 },
      });
      if (!response.ok) return null;
      const data: string[][] = await response.json();
      return data.slice(1).map((row) => ({
        time_tag: row[0],
        bz: parseFloat(row[3]) || 0,
        bt: parseFloat(row[6]) || 0,
      })) as T;
    }
    case "noaa-scales": {
      const response = await fetch(`${SWPC_BASE}/products/noaa-scales.json`, {
        next: { revalidate: 300 },
      });
      if (!response.ok) return null;
      const data = await response.json();
      return {
        r: data["-1"]?.R ?? { Scale: 0, Text: "none" },
        s: data["-1"]?.S ?? { Scale: 0, Text: "none" },
        g: data["-1"]?.G ?? { Scale: 0, Text: "none" },
      } as T;
    }
    case "kp-forecast-3day": {
      const response = await fetch(`${SWPC_BASE}/products/noaa-planetary-k-index-forecast.json`, {
        next: { revalidate: 300 },
      });
      if (!response.ok) return null;
      const data = await response.json();
      return (data as any[]).map((d) => ({
        time_tag: d.time_tag,
        kp: parseFloat(d.kp) || 0,
      })) as T;
    }
    case "storm-calendar": {
      const [kpRes, scalesRes] = await Promise.all([
        fetch(`${SWPC_BASE}/products/noaa-planetary-k-index.json`, { next: { revalidate: 300 } }),
        fetch(`${SWPC_BASE}/products/noaa-scales.json`, { next: { revalidate: 300 } }),
      ]);
      if (!kpRes.ok || !scalesRes.ok) return null;
      const kpRaw: Array<{ time_tag: string; Kp: number }> = await kpRes.json();
      const scales = await scalesRes.json();

      function kpToLevel(kp: number) {
        if (kp >= 8) return "severe";
        if (kp >= 6) return "strong";
        if (kp >= 5) return "moderate";
        if (kp >= 4) return "minor";
        return "none";
      }

      const dailyMax: Record<string, number> = {};
      for (const row of kpRaw) {
        const date = row.time_tag?.substring(0, 10);
        if (!date) continue;
        const kp = row.Kp || 0;
        if (!dailyMax[date] || kp > dailyMax[date]) dailyMax[date] = kp;
      }

      const days = Object.entries(dailyMax).map(([date, maxKp]) => ({
        date,
        maxKp: Math.round(maxKp * 10) / 10,
        level: kpToLevel(maxKp),
        isForecast: false,
      }));

      for (const key of ["1", "2", "3"]) {
        const entry = scales[key];
        if (!entry) continue;
        const gScale = parseInt(entry.G?.Scale ?? "0", 10);
        const approxKp = gScale > 0 ? gScale + 4 : 0;
        const date = entry.DateStamp;
        if (date && !dailyMax[date]) {
          days.push({ date, maxKp: approxKp, level: kpToLevel(approxKp), isForecast: true });
        }
      }

      return days.sort((a: any, b: any) => a.date.localeCompare(b.date)) as T;
    }
    case "kp-forecast-27day":
      return null;
  }
}

async function getSpaceWeatherCacheOrFallback<T>(cacheKey: SpaceWeatherCacheKey): Promise<T | null> {
  const cached = await getSpaceWeatherCache<T>(cacheKey);
  if (cached !== null) return cached;
  return fetchSpaceWeatherFallback<T>(cacheKey);
}

export interface HomePageWeatherData {
  kpData: KpEntry[] | null;
  windData: SolarWindEntry[] | null;
  magData: MagEntry[] | null;
  scales: NoaaScales | null;
  forecast3Day: KpForecastEntry[] | null;
}

export const getHomePageWeatherData = unstable_cache(
  async (): Promise<HomePageWeatherData> => {
    const [kpData, windData, magData, scales, forecast3Day] = await Promise.all([
      getSpaceWeatherCacheOrFallback<KpEntry[]>("kp-index"),
      getSpaceWeatherCacheOrFallback<SolarWindEntry[]>("solar-wind"),
      getSpaceWeatherCacheOrFallback<MagEntry[]>("mag-data"),
      getSpaceWeatherCacheOrFallback<NoaaScales>("noaa-scales"),
      getSpaceWeatherCacheOrFallback<KpForecastEntry[]>("kp-forecast-3day"),
    ]);
    return { kpData, windData, magData, scales, forecast3Day };
  },
  ["home-weather"],
  { revalidate: 300 },
);

export async function getStormCalendarData(): Promise<StormDay[] | null> {
  return getSpaceWeatherCacheOrFallback<StormDay[]>("storm-calendar");
}
