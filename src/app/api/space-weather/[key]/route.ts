import { NextResponse } from "next/server";
import { getSpaceWeatherCache, SPACE_WEATHER_KEYS, type SpaceWeatherCacheKey } from "@/lib/space-weather-cache";

const SWPC_BASE = "https://services.swpc.noaa.gov";
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

function isSpaceWeatherKey(value: string): value is SpaceWeatherCacheKey {
  return (SPACE_WEATHER_KEYS as readonly string[]).includes(value);
}

// NOAA/SWPC real-time feeds occasionally emit bare `NaN`/`Infinity` literals when a
// sensor has a data gap (e.g. `"proton_speed": NaN`) — invalid JSON that makes
// `response.json()` throw. Read as text, neutralise those tokens, and return null on
// any parse failure so the endpoint degrades instead of 500-ing.
async function safeNoaaJson(response: Response): Promise<any | null> {
  try {
    const text = await response.text();
    const sanitized = text.replace(/\b-?NaN\b/g, "null").replace(/\b-?Infinity\b/g, "null");
    return JSON.parse(sanitized);
  } catch {
    return null;
  }
}

function isNonEmptyPayload(key: SpaceWeatherCacheKey, payload: unknown) {
  if ((key === "solar-wind" || key === "mag-data") && Array.isArray(payload)) {
    return payload.length > 0;
  }

  return payload !== null && payload !== undefined;
}

async function fetchFirstNonEmptySolarWindProduct(products: readonly string[]) {
  for (const product of products) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), NOAA_FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(`${SWPC_BASE}/products/solar-wind/${product}`, {
        cache: "no-store",
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
  const response = await fetch(RTSW_WIND_URL, { cache: "no-store" });
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
  const response = await fetch(RTSW_MAG_URL, { cache: "no-store" });
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

async function fetchFallback(key: SpaceWeatherCacheKey) {
  switch (key) {
    case "kp-index": {
      const response = await fetch(`${SWPC_BASE}/json/planetary_k_index_1m.json`, { cache: "no-store" });
      const data = await safeNoaaJson(response);
      if (!Array.isArray(data)) return [];
      return data.map((d: any) => ({
        time_tag: d.time_tag,
        kp: parseFloat(d.estimated_kp ?? d.kp_index ?? d.kp ?? 0),
      }));
    }
    case "solar-wind": {
      const rtswData = await fetchRtswSolarWind();
      if (rtswData) return rtswData;

      const data = await fetchFirstNonEmptySolarWindProduct(SOLAR_WIND_PRODUCTS);
      if (!data) return [];
      return data.slice(1).map((row) => ({
        time_tag: row[0],
        density: parseFloat(row[1]) || 0,
        speed: parseFloat(row[2]) || 0,
        temperature: parseFloat(row[3]) || 0,
      }));
    }
    case "mag-data": {
      const rtswData = await fetchRtswMagData();
      if (rtswData) return rtswData;

      const data = await fetchFirstNonEmptySolarWindProduct(MAG_PRODUCTS);
      if (!data) return [];
      return data.slice(1).map((row) => ({
        time_tag: row[0],
        bz: parseFloat(row[3]) || 0,
        bt: parseFloat(row[6]) || 0,
      }));
    }
    case "noaa-scales": {
      const response = await fetch(`${SWPC_BASE}/products/noaa-scales.json`, { cache: "no-store" });
      const data = await safeNoaaJson(response);
      return {
        r: data?.["-1"]?.R ?? { Scale: 0, Text: "none" },
        s: data?.["-1"]?.S ?? { Scale: 0, Text: "none" },
        g: data?.["-1"]?.G ?? { Scale: 0, Text: "none" },
      };
    }
    case "kp-forecast-3day": {
      const response = await fetch(`${SWPC_BASE}/products/noaa-planetary-k-index-forecast.json`, { cache: "no-store" });
      const data = await safeNoaaJson(response);
      if (!Array.isArray(data)) return [];
      return (data as any[]).map((d) => ({
        time_tag: d.time_tag,
        kp: parseFloat(d.kp) || 0,
      }));
    }
    case "kp-forecast-27day": {
      const response = await fetch(`${SWPC_BASE}/text/27-day-outlook.txt`, { cache: "no-store" });
      const text = await response.text();
      const lines = text.split("\n");
      const result: Array<{ date: string; kp: number }> = [];
      for (const line of lines) {
        const match = line.match(/^(\d{4})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\s+\d+\s+\d+\s+([\d.]+)/);
        if (match) {
          const [, year, mon, day, kp] = match;
          const monthMap: Record<string, string> = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12",
          };
          result.push({ date: `${year}-${monthMap[mon]}-${day.padStart(2, "0")}`, kp: parseFloat(kp) });
        }
      }
      const today = new Date().toISOString().slice(0, 10);
      return result.filter((d) => d.date >= today);
    }
    case "storm-calendar": {
      const [kpRes, scalesRes] = await Promise.all([
        fetch(`${SWPC_BASE}/products/noaa-planetary-k-index.json`, { cache: "no-store" }),
        fetch(`${SWPC_BASE}/products/noaa-scales.json`, { cache: "no-store" }),
      ]);
      const kpRaw: Array<{ time_tag: string; Kp: number }> | null = await safeNoaaJson(kpRes);
      const scales = await safeNoaaJson(scalesRes);
      if (!Array.isArray(kpRaw)) return [];

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
        const entry = scales?.[key];
        if (!entry) continue;
        const gScale = parseInt(entry.G?.Scale ?? "0", 10);
        const approxKp = gScale > 0 ? gScale + 4 : 0;
        const date = entry.DateStamp;
        if (date && !dailyMax[date]) {
          days.push({ date, maxKp: approxKp, level: kpToLevel(approxKp), isForecast: true });
        }
      }

      return days.sort((a: any, b: any) => a.date.localeCompare(b.date));
    }
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  if (!isSpaceWeatherKey(key)) {
    return NextResponse.json({ error: "Unknown space weather key" }, { status: 404 });
  }

  const payload = await getSpaceWeatherCache<unknown>(key);

  if (isNonEmptyPayload(key, payload)) {
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  }

  try {
    const fallback = await fetchFallback(key);
    return NextResponse.json(fallback ?? null, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    // A live NOAA fetch failure must not surface as a 500 to the widgets.
    return NextResponse.json(null, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
