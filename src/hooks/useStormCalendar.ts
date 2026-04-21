import { useQuery } from "@tanstack/react-query";

export type StormLevel = "none" | "minor" | "moderate" | "strong" | "severe";

export interface StormDay {
  date: string; // YYYY-MM-DD
  maxKp: number;
  level: StormLevel;
  isForecast: boolean;
}

export function useStormCalendar(initialData?: StormDay[] | null) {
  return useQuery<StormDay[]>({
    queryKey: ["storm-calendar"],
    queryFn: async () => {
      const res = await fetch("/api/space-weather/storm-calendar");
      return await res.json();
    },
    refetchInterval: 300000,
    staleTime: 120000,
    initialData: initialData ?? undefined,
  });
}
