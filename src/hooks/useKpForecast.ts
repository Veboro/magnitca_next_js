import { useQuery } from "@tanstack/react-query";

export interface KpForecastEntry {
  time_tag: string;
  kp: number;
}

/**
 * 3-day Kp forecast from NOAA SWPC (3-hour intervals)
 */
export function useKpForecast(initialData?: KpForecastEntry[]) {
  return useQuery<KpForecastEntry[]>({
    queryKey: ["kp-forecast-3day"],
    queryFn: async () => {
      const res = await fetch("/api/space-weather/kp-forecast-3day");
      return await res.json();
    },
    refetchInterval: 300000, // every 5 min
    staleTime: 120000,
    initialData,
  });
}
