import { useQuery } from "@tanstack/react-query";

export interface KpForecast27DayEntry {
  date: string;
  kp: number;
}

export function useKpForecast27Day() {
  return useQuery<KpForecast27DayEntry[]>({
    queryKey: ["kp-forecast-27day"],
    queryFn: async () => {
      const res = await fetch("/api/space-weather/kp-forecast-27day");
      return await res.json();
    },
    refetchInterval: 600000,
    staleTime: 300000,
  });
}
