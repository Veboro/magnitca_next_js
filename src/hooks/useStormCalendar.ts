import { useQuery } from "@tanstack/react-query";

const SWPC_BASE = "https://services.swpc.noaa.gov";

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
      const [noaaKpRes, scalesRes] = await Promise.all([
        fetch(`${SWPC_BASE}/products/noaa-planetary-k-index.json`),
        fetch(`${SWPC_BASE}/products/noaa-scales.json`),
      ]);

      const kpRaw: string[][] = await noaaKpRes.json();
      const scales = await scalesRes.json();

      // Group Kp by date and find max per day
      // Format: [["time_tag","Kp","a_running","station_count"], ...]
      const dailyMax: Record<string, number> = {};
      for (const row of kpRaw.slice(1)) {
        const date = row[0]?.substring(0, 10);
        if (!date) continue;
        const kp = parseFloat(row[1]) || 0;
        if (!dailyMax[date] || kp > dailyMax[date]) {
          dailyMax[date] = kp;
        }
      }

      const days: StormDay[] = Object.entries(dailyMax).map(([date, maxKp]) => ({
        date,
        maxKp: Math.round(maxKp * 10) / 10,
        level: kpToLevel(maxKp),
        isForecast: false,
      }));

      // Add 3-day forecast from NOAA scales
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

      return days.sort((a, b) => a.date.localeCompare(b.date));
    },
    refetchInterval: 300000,
    staleTime: 120000,
  });
}
