import { useQuery } from "@tanstack/react-query";

const SWPC_BASE = "https://services.swpc.noaa.gov";
const GFZ_BASE = "https://kp.gfz.de/app/json";

export type StormLevel = "none" | "minor" | "moderate" | "strong" | "severe";

export interface StormDay {
  date: string; // YYYY-MM-DD
  maxKp: number;
  level: StormLevel;
  isForecast: boolean;
}

function kpToLevel(kp: number): StormLevel {
  if (kp >= 8) return "severe";
  if (kp >= 6) return "strong";
  if (kp >= 5) return "moderate";
  if (kp >= 4) return "minor";
  return "none";
}

export function useStormCalendar() {
  return useQuery<StormDay[]>({
    queryKey: ["storm-calendar"],
    queryFn: async () => {
      const now = new Date();
      const yearStart = `${now.getFullYear()}-01-01T00:00:00Z`;
      const todayEnd = now.toISOString();

      // Fetch GFZ historical Kp (full year) + NOAA recent 30-day + NOAA 3-day forecast
      const [gfzRes, noaaKpRes, scalesRes] = await Promise.allSettled([
        fetch(`${GFZ_BASE}/?start=${yearStart}&end=${todayEnd}&index=Kp`),
        fetch(`${SWPC_BASE}/products/noaa-planetary-k-index.json`),
        fetch(`${SWPC_BASE}/products/noaa-scales.json`),
      ]);

      const dailyMax: Record<string, number> = {};

      // Parse GFZ data (primary source for full year)
      if (gfzRes.status === "fulfilled" && gfzRes.value.ok) {
        try {
          const gfzData = await gfzRes.value.json();
          // GFZ returns array of objects: { datetime, Kp, ... }
          if (Array.isArray(gfzData)) {
            for (const entry of gfzData) {
              const dt = entry.datetime ?? entry.time_tag ?? "";
              const date = dt.substring(0, 10);
              if (!date) continue;
              const kp = parseFloat(entry.Kp ?? entry.kp ?? 0);
              if (!dailyMax[date] || kp > dailyMax[date]) {
                dailyMax[date] = kp;
              }
            }
          }
        } catch {
          // GFZ parse failed, fall through to NOAA
        }
      }

      // Parse NOAA 30-day data (fallback / supplement)
      if (noaaKpRes.status === "fulfilled" && noaaKpRes.value.ok) {
        try {
          const noaaData: any[] = await noaaKpRes.value.json();
          for (const entry of noaaData) {
            const date = entry.time_tag?.substring(0, 10);
            if (!date) continue;
            const kp = parseFloat(entry.Kp ?? entry.kp_index ?? entry.kp ?? 0);
            if (!dailyMax[date] || kp > dailyMax[date]) {
              dailyMax[date] = kp;
            }
          }
        } catch {
          // NOAA parse failed
        }
      }

      const days: StormDay[] = Object.entries(dailyMax).map(([date, maxKp]) => ({
        date,
        maxKp: Math.round(maxKp * 10) / 10,
        level: kpToLevel(maxKp),
        isForecast: false,
      }));

      // Add 3-day forecast from NOAA scales
      if (scalesRes.status === "fulfilled" && scalesRes.value.ok) {
        try {
          const scales = await scalesRes.value.json();
          for (const key of ["1", "2", "3"]) {
            const entry = scales[key];
            if (!entry) continue;
            const gScale = parseInt(entry.G?.Scale ?? "0", 10);
            const approxKp = gScale > 0 ? gScale + 4 : 0;
            const date = entry.DateStamp;
            if (date && !dailyMax[date]) {
              days.push({
                date,
                maxKp: approxKp,
                level: kpToLevel(approxKp),
                isForecast: true,
              });
            }
          }
        } catch {
          // Scales parse failed
        }
      }

      return days.sort((a, b) => a.date.localeCompare(b.date));
    },
    refetchInterval: 300000,
    staleTime: 120000,
  });
}
