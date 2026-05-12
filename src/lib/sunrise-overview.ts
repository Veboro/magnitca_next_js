import SunCalc from "suncalc";
import { CITIES, type CityConfig } from "@/data/cities";
import { formatApiLocalTime, formatDayLength, getDateInTimeZone } from "@/lib/city-sun-times";

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

function formatTimeInZone(value: Date, timezone: string) {
  return new Intl.DateTimeFormat("uk-UA", {
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

async function fetchSunTimesForCity(city: CityConfig, dayOffset = 0): Promise<SunriseOverviewCity | null> {
  const date = getDateWithOffset(city.timezone, dayOffset);
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
      `&daily=sunrise,sunset&timezone=${encodeURIComponent(city.timezone)}` +
      `&start_date=${date}&end_date=${date}`,
    { next: { revalidate: 21600 } }
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
    dawnLabel: formatTimeInZone(sunTimes.dawn, city.timezone),
    sunrise,
    sunset,
    solarNoonLabel: formatTimeInZone(sunTimes.solarNoon, city.timezone),
    duskLabel: formatTimeInZone(sunTimes.dusk, city.timezone),
    sunriseLabel: formatApiLocalTime(sunrise),
    sunsetLabel: formatApiLocalTime(sunset),
    dayLength: formatDayLength(sunrise, sunset, "uk"),
    dayLengthMinutes,
  };
}

export async function getSunriseOverview(dayOffset = 0) {
  const results = await Promise.allSettled(CITIES.map((city) => fetchSunTimesForCity(city, dayOffset)));
  const cities = results
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((item): item is SunriseOverviewCity => Boolean(item));

  const earliestSunrise = [...cities].sort((a, b) => a.sunrise.localeCompare(b.sunrise))[0] ?? null;
  const latestSunrise = [...cities].sort((a, b) => b.sunrise.localeCompare(a.sunrise))[0] ?? null;
  const averageDayLengthMinutes = cities.length
    ? Math.round(cities.reduce((sum, item) => sum + item.dayLengthMinutes, 0) / cities.length)
    : 0;

  return {
    date: getDateWithOffset("Europe/Kyiv", dayOffset),
    cities,
    earliestSunrise,
    latestSunrise,
    averageDayLengthMinutes,
  };
}
