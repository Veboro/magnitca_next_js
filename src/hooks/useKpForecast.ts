import { useQuery } from "@tanstack/react-query";

export interface KpForecastEntry {
  time_tag: string;
  kp: number;
}

/**
 * 3-day Kp forecast from NOAA SWPC (3-hour intervals)
 */
export function useKpForecast() {
  return useQuery<KpForecastEntry[]>({
    queryKey: ["kp-forecast-3day"],
    queryFn: async () => {
      const res = await fetch(
        "https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json"
      );
      const data: string[][] = await res.json();
      // First row is headers: ["time_tag","Kp","observed","noaa_scale"]
      return data.slice(1).map((row) => ({
        time_tag: row[0],
        kp: parseFloat(row[1]) || 0,
      }));
    },
    refetchInterval: 300000, // every 5 min
    staleTime: 120000,
  });
}
