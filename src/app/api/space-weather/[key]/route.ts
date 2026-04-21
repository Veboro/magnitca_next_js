import { NextResponse } from "next/server";
import { getSpaceWeatherCache, SPACE_WEATHER_KEYS, type SpaceWeatherCacheKey } from "@/lib/space-weather-cache";

const SWPC_BASE = "https://services.swpc.noaa.gov";

function isSpaceWeatherKey(value: string): value is SpaceWeatherCacheKey {
  return (SPACE_WEATHER_KEYS as readonly string[]).includes(value);
}

async function fetchFallback(key: SpaceWeatherCacheKey) {
  switch (key) {
    case "kp-index": {
      const response = await fetch(`${SWPC_BASE}/json/planetary_k_index_1m.json`, { cache: "no-store" });
      const data = await response.json();
      return data.map((d: any) => ({
        time_tag: d.time_tag,
        kp: parseFloat(d.estimated_kp ?? d.kp_index ?? d.kp ?? 0),
      }));
    }
    case "solar-wind": {
      const response = await fetch(`${SWPC_BASE}/products/solar-wind/plasma-2-hour.json`, { cache: "no-store" });
      const data: string[][] = await response.json();
      return data.slice(1).map((row) => ({
        time_tag: row[0],
        density: parseFloat(row[1]) || 0,
        speed: parseFloat(row[2]) || 0,
        temperature: parseFloat(row[3]) || 0,
      }));
    }
    case "mag-data": {
      const response = await fetch(`${SWPC_BASE}/products/solar-wind/mag-2-hour.json`, { cache: "no-store" });
      const data: string[][] = await response.json();
      return data.slice(1).map((row) => ({
        time_tag: row[0],
        bz: parseFloat(row[3]) || 0,
        bt: parseFloat(row[6]) || 0,
      }));
    }
    case "noaa-scales": {
      const response = await fetch(`${SWPC_BASE}/products/noaa-scales.json`, { cache: "no-store" });
      const data = await response.json();
      return {
        r: data["-1"]?.R ?? { Scale: 0, Text: "none" },
        s: data["-1"]?.S ?? { Scale: 0, Text: "none" },
        g: data["-1"]?.G ?? { Scale: 0, Text: "none" },
      };
    }
    case "kp-forecast-3day": {
      const response = await fetch(`${SWPC_BASE}/products/noaa-planetary-k-index-forecast.json`, { cache: "no-store" });
      const data = await response.json();
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

  if (payload !== null) {
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  }

  const fallback = await fetchFallback(key);
  return NextResponse.json(fallback, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
