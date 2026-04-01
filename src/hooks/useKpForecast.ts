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
      // time_tag format: "2024 Dec 31 0300" — need to normalize for Date parsing
      return data.slice(1).map((row) => {
        // Replace the space-based format with something Date() can parse
        // "2024 Dec 31 0300" → "2024 Dec 31 03:00 UTC"
        const raw = row[0];
        const normalized = raw.replace(/(\d{2})(\d{2})$/, "$1:$2") + " UTC";
        return {
          time_tag: new Date(normalized).toISOString(),
          kp: parseFloat(row[1]) || 0,
        };
      });
    },
    refetchInterval: 300000, // every 5 min
    staleTime: 120000,
  });
}
