import SunCalc from "suncalc";
import { CITIES, type CityConfig } from "@/data/cities";
import { formatApiLocalTime, formatDayLength, getDateInTimeZone } from "@/lib/city-sun-times";
import type { SiteLocale } from "@/lib/locale";

export type SunriseOverviewCity = {
  city: CityConfig;
  date: string;
  dawnLabel: string;
  sunrise: string;
  sunset: string;
  solarNoonLabel: string;
  duskLabel: string;
  sunriseLabel: string;
  sunsetLabel: string;
  dayLength: string;
  dayLengthMinutes: number;
};

function getMinutesDiff(startIso: string, endIso: string) {
  return Math.max(0, Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000));
}

function formatTimeInZone(value: Date, timezone: string, locale: SiteLocale = "uk") {
  const localeTag =
    locale === "ru" ? "ru-RU" : locale === "pl" ? "pl-PL" : locale === "ro" ? "ro-MD" : locale === "hu" ? "hu-HU" : locale === "bg" ? "bg-BG" : locale === "cs" ? "cs-CZ" : "uk-UA";
  return new Intl.DateTimeFormat(localeTag, {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(value);
}

function getDateWithOffset(timezone: string, dayOffset: number) {
  const target = new Date();
  target.setUTCDate(target.getUTCDate() + dayOffset);
  return getDateInTimeZone(timezone, target);
}

async function fetchSunTimesForCity(city: CityConfig, dayOffset = 0, locale: SiteLocale = "uk"): Promise<SunriseOverviewCity | null> {
  const date = getDateWithOffset(city.timezone, dayOffset);
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
      `&daily=sunrise,sunset&timezone=${encodeURIComponent(city.timezone)}` +
      `&start_date=${date}&end_date=${date}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) return null;

  const data = await response.json();
  const sunrise = data?.daily?.sunrise?.[0];
  const sunset = data?.daily?.sunset?.[0];

  if (!sunrise || !sunset) return null;

  const dayLengthMinutes = getMinutesDiff(sunrise, sunset);
  const sunTimes = SunCalc.getTimes(new Date(`${date}T12:00:00Z`), city.lat, city.lon);

  return {
    city,
    date,
    dawnLabel: formatTimeInZone(sunTimes.dawn, city.timezone, locale),
    sunrise,
    sunset,
    solarNoonLabel: formatTimeInZone(sunTimes.solarNoon, city.timezone, locale),
    duskLabel: formatTimeInZone(sunTimes.dusk, city.timezone, locale),
    sunriseLabel: formatApiLocalTime(sunrise),
    sunsetLabel: formatApiLocalTime(sunset),
    dayLength: formatDayLength(sunrise, sunset, locale),
    dayLengthMinutes,
  };
}

export async function getSunriseOverview(
  dayOffset = 0,
  options: { cities?: CityConfig[]; timezone?: string; locale?: SiteLocale } = {}
) {
  const sourceCities = options.cities ?? CITIES;
  const locale = options.locale ?? "uk";
  const timezone = options.timezone ?? "Europe/Kyiv";
  const results = await Promise.allSettled(sourceCities.map((city) => fetchSunTimesForCity(city, dayOffset, locale)));
  const cities = results
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((item): item is SunriseOverviewCity => Boolean(item));

  const earliestSunrise = [...cities].sort((a, b) => a.sunrise.localeCompare(b.sunrise))[0] ?? null;
  const latestSunrise = [...cities].sort((a, b) => b.sunrise.localeCompare(a.sunrise))[0] ?? null;
  const earliestSunset = [...cities].sort((a, b) => a.sunset.localeCompare(b.sunset))[0] ?? null;
  const latestSunset = [...cities].sort((a, b) => b.sunset.localeCompare(a.sunset))[0] ?? null;
  const averageDayLengthMinutes = cities.length
    ? Math.round(cities.reduce((sum, item) => sum + item.dayLengthMinutes, 0) / cities.length)
    : 0;

  return {
    date: getDateWithOffset(timezone, dayOffset),
    cities,
    earliestSunrise,
    latestSunrise,
    earliestSunset,
    latestSunset,
    averageDayLengthMinutes,
  };
}
