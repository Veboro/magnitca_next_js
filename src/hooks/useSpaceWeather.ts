import { useQuery } from "@tanstack/react-query";

const SWPC_BASE = "https://services.swpc.noaa.gov";

// Kp Index (planetary_k_index_1m.json) — array of arrays
// [time_tag, Kp, a_running, station_count]
export interface KpEntry {
  time_tag: string;
  kp: number;
}

export function useKpIndex() {
  return useQuery<KpEntry[]>({
    queryKey: ["kp-index"],
    queryFn: async () => {
      const res = await fetch(`${SWPC_BASE}/json/planetary_k_index_1m.json`);
      const data = await res.json();
      // Each entry: { time_tag, kp_index, estimated_kp, ... }
      return data.map((d: any) => ({
        time_tag: d.time_tag,
        kp: parseFloat(d.estimated_kp ?? d.kp_index ?? d.kp ?? 0),
      }));
    },
    refetchInterval: 60000,
    staleTime: 30000,
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
      const res = await fetch(`${SWPC_BASE}/products/solar-wind/plasma-2-hour.json`);
      const data: string[][] = await res.json();
      // First row is headers: ["time_tag","density","speed","temperature"]
      return data.slice(1).map((row) => ({
        time_tag: row[0],
        density: parseFloat(row[1]) || 0,
        speed: parseFloat(row[2]) || 0,
        temperature: parseFloat(row[3]) || 0,
      }));
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
      const res = await fetch(`${SWPC_BASE}/products/solar-wind/mag-2-hour.json`);
      const data: string[][] = await res.json();
      // Headers: ["time_tag","bx_gsm","by_gsm","bz_gsm","lon_gsm","lat_gsm","bt"]
      return data.slice(1).map((row) => ({
        time_tag: row[0],
        bz: parseFloat(row[3]) || 0,
        bt: parseFloat(row[6]) || 0,
      }));
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

export function useNoaaScales() {
  return useQuery<NoaaScales>({
    queryKey: ["noaa-scales"],
    queryFn: async () => {
      const res = await fetch(`${SWPC_BASE}/products/noaa-scales.json`);
      const data = await res.json();
      return {
        r: data["-1"]?.R ?? { Scale: 0, Text: "none" },
        s: data["-1"]?.S ?? { Scale: 0, Text: "none" },
        g: data["-1"]?.G ?? { Scale: 0, Text: "none" },
      };
    },
    refetchInterval: 60000,
    staleTime: 30000,
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
