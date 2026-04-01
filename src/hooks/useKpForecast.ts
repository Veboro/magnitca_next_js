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
        // NOAA format: "2024 Jan 01 0000" — convert to ISO-like string
        time_tag: row[0].replace(/(\d{4})\s(\w{3})\s(\d{2})\s(\d{2})(\d{2})/, "$1-$2-$3T$4:$5:00Z"),
        kp: parseFloat(row[1]) || 0,
      }));
    },
    refetchInterval: 300000, // every 5 min
    staleTime: 120000,
  });
}
