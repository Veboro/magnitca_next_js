import type { SiteLocale } from "@/lib/locale";

export interface CitySunTimesPayload {
  date: string;
  sunrise: string;
  sunset: string;
  dayLength: string;
  timezone: string;
}

export function formatApiLocalTime(value: string): string {
  const match = value.match(/T(\d{2}:\d{2})/);
  if (match) return match[1];
  return value;
}

export function formatDayLength(sunrise: string, sunset: string, locale: SiteLocale = "uk"): string {
  const diff = new Date(sunset).getTime() - new Date(sunrise).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (locale === "pl") return `${h} godz. ${m} min`;
  if (locale === "ru") return `${h} ч ${m} мин`;
  return `${h}год ${m}хв`;
}

export function getDateInTimeZone(timezone: string, date = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function buildCitySunTimesCacheKey(lat: number, lon: number, timezone: string, date: string) {
  return `sun-times:${lat.toFixed(4)}:${lon.toFixed(4)}:${timezone}:${date}`;
}
