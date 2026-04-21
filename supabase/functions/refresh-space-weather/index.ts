import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SWPC_BASE = "https://services.swpc.noaa.gov";

type CacheRow = {
  cache_key: string;
  payload: unknown;
  source: string;
  fetched_at: string;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fetch failed [${response.status}] ${url}`);
  }

  return await response.json();
}

function mapKpIndex(data: any[]) {
  return data.map((d: any) => ({
    time_tag: d.time_tag,
    kp: parseFloat(d.estimated_kp ?? d.kp_index ?? d.kp ?? 0),
  }));
}

function mapSolarWind(data: string[][]) {
  return data.slice(1).map((row) => ({
    time_tag: row[0],
    density: parseFloat(row[1]) || 0,
    speed: parseFloat(row[2]) || 0,
    temperature: parseFloat(row[3]) || 0,
  }));
}

function mapMagData(data: string[][]) {
  return data.slice(1).map((row) => ({
    time_tag: row[0],
    bz: parseFloat(row[3]) || 0,
    bt: parseFloat(row[6]) || 0,
  }));
}

function mapNoaaScales(data: any) {
  return {
    r: data["-1"]?.R ?? { Scale: 0, Text: "none" },
    s: data["-1"]?.S ?? { Scale: 0, Text: "none" },
    g: data["-1"]?.G ?? { Scale: 0, Text: "none" },
  };
}

function mapKpForecast(data: any[]) {
  return data.map((d: any) => ({
    time_tag: d.time_tag,
    kp: parseFloat(d.kp) || 0,
  }));
}

function mapStormCalendar(kpHistorical: Array<{ time_tag: string; Kp: number }>, scales: any) {
  type StormLevel = "none" | "minor" | "moderate" | "strong" | "severe";

  function kpToLevel(kp: number): StormLevel {
    if (kp >= 8) return "severe";
    if (kp >= 6) return "strong";
    if (kp >= 5) return "moderate";
    if (kp >= 4) return "minor";
    return "none";
  }

  const dailyMax: Record<string, number> = {};
  for (const row of kpHistorical) {
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

  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function mapKpForecast27Day(text: string) {
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const [kpIndexRaw, solarWindRaw, magRaw, scalesRaw, forecastRaw, forecast27Raw, kpHistoricalRaw] = await Promise.all([
      fetchJson<any[]>(`${SWPC_BASE}/json/planetary_k_index_1m.json`),
      fetchJson<string[][]>(`${SWPC_BASE}/products/solar-wind/plasma-2-hour.json`),
      fetchJson<string[][]>(`${SWPC_BASE}/products/solar-wind/mag-2-hour.json`),
      fetchJson<any>(`${SWPC_BASE}/products/noaa-scales.json`),
      fetchJson<any[]>(`${SWPC_BASE}/products/noaa-planetary-k-index-forecast.json`),
      fetch(`${SWPC_BASE}/text/27-day-outlook.txt`).then((res) => {
        if (!res.ok) throw new Error(`Fetch failed [${res.status}] ${SWPC_BASE}/text/27-day-outlook.txt`);
        return res.text();
      }),
      fetchJson<Array<{ time_tag: string; Kp: number }>>(`${SWPC_BASE}/products/noaa-planetary-k-index.json`),
    ]);

    const fetchedAt = new Date().toISOString();
    const rows: CacheRow[] = [
      {
        cache_key: "kp-index",
        payload: mapKpIndex(kpIndexRaw),
        source: "noaa",
        fetched_at: fetchedAt,
      },
      {
        cache_key: "solar-wind",
        payload: mapSolarWind(solarWindRaw),
        source: "noaa",
        fetched_at: fetchedAt,
      },
      {
        cache_key: "mag-data",
        payload: mapMagData(magRaw),
        source: "noaa",
        fetched_at: fetchedAt,
      },
      {
        cache_key: "noaa-scales",
        payload: mapNoaaScales(scalesRaw),
        source: "noaa",
        fetched_at: fetchedAt,
      },
      {
        cache_key: "kp-forecast-3day",
        payload: mapKpForecast(forecastRaw),
        source: "noaa",
        fetched_at: fetchedAt,
      },
      {
        cache_key: "kp-forecast-27day",
        payload: mapKpForecast27Day(forecast27Raw),
        source: "noaa",
        fetched_at: fetchedAt,
      },
      {
        cache_key: "storm-calendar",
        payload: mapStormCalendar(kpHistoricalRaw, scalesRaw),
        source: "noaa",
        fetched_at: fetchedAt,
      },
    ];

    const { error } = await supabase
      .from("space_weather_cache")
      .upsert(rows, { onConflict: "cache_key" });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        fetched_at: fetchedAt,
        keys: rows.map((row) => row.cache_key),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("refresh-space-weather error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
