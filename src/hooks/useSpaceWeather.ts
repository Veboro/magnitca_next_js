import { useQuery } from "@tanstack/react-query";

const SWPC_BASE = "https://services.swpc.noaa.gov";

// Kp Index (planetary_k_index_1m.json) — array of arrays
// [time_tag, Kp, a_running, station_count]
export interface KpEntry {
  time_tag: string;
  kp: number;
}

export async function fetchKpIndex(): Promise<KpEntry[]> {
  const res = await fetch(`/api/space-weather/kp-index`);
  const data = await res.json();
  return data;
}

export function useKpIndex(initialData?: KpEntry[]) {
  return useQuery<KpEntry[]>({
    queryKey: ["kp-index"],
    queryFn: fetchKpIndex,
    refetchInterval: 60000,
    staleTime: 30000,
    initialData,
  });
}

// Solar wind plasma — last 24h
export interface SolarWindEntry {
  time_tag: string;
  speed: number;
  density: number;
  temperature: number;
}

export function useSolarWind() {
  return useQuery<SolarWindEntry[]>({
    queryKey: ["solar-wind"],
    queryFn: async () => {
      const res = await fetch(`/api/space-weather/solar-wind`);
      return await res.json();
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

// IMF Bz component
export interface MagEntry {
  time_tag: string;
  bz: number;
  bt: number;
}

export function useMagData() {
  return useQuery<MagEntry[]>({
    queryKey: ["mag-data"],
    queryFn: async () => {
      const res = await fetch(`/api/space-weather/mag-data`);
      return await res.json();
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

// NOAA Scales — current conditions
export interface NoaaScales {
  r: { Scale: number; Text: string };
  s: { Scale: number; Text: string };
  g: { Scale: number; Text: string };
}

export async function fetchNoaaScales(): Promise<NoaaScales> {
  const res = await fetch(`/api/space-weather/noaa-scales`);
  return await res.json();
}

export function useNoaaScales(initialData?: NoaaScales) {
  return useQuery<NoaaScales>({
    queryKey: ["noaa-scales"],
    queryFn: fetchNoaaScales,
    refetchInterval: 60000,
    staleTime: 30000,
    initialData,
  });
}

// Alerts
export interface SpaceWeatherAlert {
  product_id: string;
  issue_datetime: string;
  message: string;
}

export function useAlerts() {
  return useQuery<SpaceWeatherAlert[]>({
    queryKey: ["sw-alerts"],
    queryFn: async () => {
      const res = await fetch(`${SWPC_BASE}/products/alerts.json`);
      const data = await res.json();
      return data.slice(0, 10);
    },
    refetchInterval: 120000,
    staleTime: 60000,
  });
}
