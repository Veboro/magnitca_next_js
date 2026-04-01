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
      const data = await res.json();
      // API returns array of objects: {time_tag, kp, observed, noaa_scale}
      return (data as any[]).map((d) => ({
        time_tag: d.time_tag,
        kp: parseFloat(d.kp) || 0,
      }));
    },
    refetchInterval: 300000, // every 5 min
    staleTime: 120000,
  });
}
