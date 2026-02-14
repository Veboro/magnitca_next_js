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
      // Fetch 30-day Kp history (3-hourly)
      const [kpRes, scalesRes] = await Promise.all([
        fetch(`${SWPC_BASE}/products/noaa-planetary-k-index.json`),
        fetch(`${SWPC_BASE}/products/noaa-scales.json`),
      ]);

      const kpData: any[] = await kpRes.json();
      const scales = await scalesRes.json();

      // Group Kp by date and find max per day
      const dailyMax: Record<string, number> = {};
      for (const entry of kpData) {
        const date = entry.time_tag?.substring(0, 10);
        if (!date) continue;
        const kp = parseFloat(entry.Kp ?? entry.kp_index ?? entry.kp ?? 0);
        if (!dailyMax[date] || kp > dailyMax[date]) {
          dailyMax[date] = kp;
        }
      }

      const days: StormDay[] = Object.entries(dailyMax).map(([date, maxKp]) => ({
        date,
        maxKp,
        level: kpToLevel(maxKp),
        isForecast: false,
      }));

      // Add 3-day forecast from NOAA scales
      for (const key of ["1", "2", "3"]) {
        const entry = scales[key];
        if (!entry) continue;
        const gScale = parseInt(entry.G?.Scale ?? "0", 10);
        // G-scale to approximate Kp: G1=5, G2=6, G3=7, G4=8, G5=9
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

      return days;
    },
    refetchInterval: 300000,
    staleTime: 120000,
  });
}
