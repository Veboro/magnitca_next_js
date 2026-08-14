import { unstable_cache } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/server-supabase";
import type { KpEntry, SolarWindEntry, MagEntry, NoaaScales } from "@/hooks/useSpaceWeather";
import type { KpForecastEntry } from "@/hooks/useKpForecast";
import type { StormDay } from "@/hooks/useStormCalendar";

const SWPC_BASE = "https://services.swpc.noaa.gov";
const SPACE_WEATHER_MAX_AGE_MS = 15 * 60 * 1000;
const NOAA_FETCH_TIMEOUT_MS = 5_000;
const RTSW_WIND_URL = `${SWPC_BASE}/json/rtsw/rtsw_wind_1m.json`;
const RTSW_MAG_URL = `${SWPC_BASE}/json/rtsw/rtsw_mag_1m.json`;
const SOLAR_WIND_PRODUCTS = [
  "plasma-2-hour.json",
  "plasma-6-hour.json",
  "plasma-1-day.json",
] as const;
const MAG_PRODUCTS = [
  "mag-2-hour.json",
  "mag-6-hour.json",
  "mag-1-day.json",
] as const;

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

function isNonEmptyPayload(cacheKey: SpaceWeatherCacheKey, payload: unknown) {
  if ((cacheKey === "solar-wind" || cacheKey === "mag-data") && Array.isArray(payload)) {
    return payload.length > 0;
  }

  return payload !== null && payload !== undefined;
}

// NOAA/SWPC real-time feeds occasionally emit bare `NaN`/`Infinity` literals when
// a sensor has a data gap (e.g. `"proton_speed": NaN`). Those are invalid JSON, so
// `response.json()` throws a SyntaxError that would otherwise bubble up and 500 the
// page during ISR revalidation. Read as text, neutralise the offending tokens, and
// never throw — return null on any parse failure so callers degrade gracefully.
async function safeNoaaJson(response: Response): Promise<any | null> {
  try {
    const text = await response.text();
    const sanitized = text.replace(/\b-?NaN\b/g, "null").replace(/\b-?Infinity\b/g, "null");
    return JSON.parse(sanitized);
  } catch {
    return null;
  }
}

async function fetchFirstNonEmptySolarWindProduct(products: readonly string[]) {
  for (const product of products) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), NOAA_FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(`${SWPC_BASE}/products/solar-wind/${product}`, {
        next: { revalidate: 300 },
        signal: controller.signal,
      });
      if (!response.ok) continue;

      const data: string[][] | null = await safeNoaaJson(response);
      if (Array.isArray(data) && data.length > 1) {
        return data;
      }
    } catch {
      continue;
    } finally {
      clearTimeout(timeout);
    }
  }

  return null;
}

function sortByTime<T extends { time_tag: string }>(rows: T[]) {
  return rows.sort((a, b) => Date.parse(a.time_tag) - Date.parse(b.time_tag));
}

async function fetchRtswSolarWind() {
  const response = await fetch(RTSW_WIND_URL, { next: { revalidate: 300 } });
  if (!response.ok) return null;
  const data = await safeNoaaJson(response);
  if (!Array.isArray(data) || data.length === 0) return null;

  const rows = data
    .filter((row: any) => row?.time_tag && Number.isFinite(Number(row.proton_speed)))
    .map((row: any) => ({
      time_tag: row.time_tag,
      density: Number(row.proton_density) || 0,
      speed: Number(row.proton_speed) || 0,
      temperature: Number(row.proton_temperature) || 0,
    }));

  return rows.length ? sortByTime(rows) : null;
}

async function fetchRtswMagData() {
  const response = await fetch(RTSW_MAG_URL, { next: { revalidate: 300 } });
  if (!response.ok) return null;
  const data = await safeNoaaJson(response);
  if (!Array.isArray(data) || data.length === 0) return null;

  const rows = data
    .filter((row: any) => row?.time_tag && Number.isFinite(Number(row.bz_gsm)))
    .map((row: any) => ({
      time_tag: row.time_tag,
      bz: Number(row.bz_gsm) || 0,
      bt: Number(row.bt) || 0,
    }));

  return rows.length ? sortByTime(rows) : null;
}

export async function getSpaceWeatherCache<T>(cacheKey: SpaceWeatherCacheKey): Promise<T | null> {
  try {
    const supabase = getSupabaseAdminClient() as any;
    const { data, error } = await supabase
      .from("space_weather_cache" as never)
      .select("payload, fetched_at")
      .eq("cache_key", cacheKey)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const fetchedAt = Date.parse(data.fetched_at ?? "");
    if (!Number.isFinite(fetchedAt)) {
      return null;
    }

    // If the background refresh job stalls, fall back to a live NOAA fetch instead
    // of embedding stale space weather data into the rendered HTML.
    if (Date.now() - fetchedAt > SPACE_WEATHER_MAX_AGE_MS) {
      return null;
    }

    const payload = data.payload ?? null;
    if (!isNonEmptyPayload(cacheKey, payload)) {
      return null;
    }

    return payload as T | null;
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
      const data = await safeNoaaJson(response);
      if (!Array.isArray(data)) return null;
      return data.map((d: any) => ({
        time_tag: d.time_tag,
        kp: parseFloat(d.estimated_kp ?? d.kp_index ?? d.kp ?? 0),
      })) as T;
    }
    case "solar-wind": {
      const rtswData = await fetchRtswSolarWind();
      if (rtswData) return rtswData as T;

      const data = await fetchFirstNonEmptySolarWindProduct(SOLAR_WIND_PRODUCTS);
      if (!data) return null;
      return data.slice(1).map((row) => ({
        time_tag: row[0],
        density: parseFloat(row[1]) || 0,
        speed: parseFloat(row[2]) || 0,
        temperature: parseFloat(row[3]) || 0,
      })) as T;
    }
    case "mag-data": {
      const rtswData = await fetchRtswMagData();
      if (rtswData) return rtswData as T;

      const data = await fetchFirstNonEmptySolarWindProduct(MAG_PRODUCTS);
      if (!data) return null;
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
      const data = await safeNoaaJson(response);
      if (!data) return null;
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
      const data = await safeNoaaJson(response);
      if (!Array.isArray(data)) return null;
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
      const kpRaw: Array<{ time_tag: string; Kp: number }> | null = await safeNoaaJson(kpRes);
      const scales = await safeNoaaJson(scalesRes);
      if (!Array.isArray(kpRaw) || !scales) return null;

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
  // Never let a live-fetch failure (network, timeout, malformed NOAA JSON) throw:
  // the space-weather widgets must degrade to "no data" instead of 500-ing the page
  // during ISR revalidation.
  try {
    return await fetchSpaceWeatherFallback<T>(cacheKey);
  } catch {
    return null;
  }
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
