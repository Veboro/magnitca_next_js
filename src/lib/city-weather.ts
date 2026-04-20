import type { SiteLocale } from "@/lib/locale";
import { formatDayLength } from "@/lib/city-sun-times";

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  cloudCover: number;
  weatherCode: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  dayLength: string;
}

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitation: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  sunrise: string;
  sunset: string;
  precipitationSum: number;
  uvIndexMax: number;
}

export interface CityWeatherResult {
  current: WeatherData | null;
  airQuality: AirQualityData | null;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export function buildCityWeatherCacheKey(lat: number, lon: number, timezone: string) {
  return `city-weather:${lat.toFixed(4)}:${lon.toFixed(4)}:${timezone}`;
}

export async function fetchCityWeatherFromSource(
  lat: number,
  lon: number,
  tz: string,
  locale: SiteLocale = "uk"
): Promise<CityWeatherResult> {
  const [weatherRes, aqRes] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code,uv_index&hourly=temperature_2m,weather_code,precipitation&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,precipitation_sum,uv_index_max&timezone=${encodeURIComponent(tz)}&forecast_days=7`,
      { cache: "no-store" }
    ),
    fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone&timezone=${encodeURIComponent(tz)}`,
      { cache: "no-store" }
    ),
  ]);

  const weather = await weatherRes.json();
  const aq = await aqRes.json();

  const c = weather.current;
  const d = weather.daily;

  const current: WeatherData = {
    temperature: c.temperature_2m,
    feelsLike: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    pressure: c.surface_pressure,
    cloudCover: c.cloud_cover,
    weatherCode: c.weather_code,
    uvIndex: c.uv_index,
    sunrise: d.sunrise[0],
    sunset: d.sunset[0],
    dayLength: formatDayLength(d.sunrise[0], d.sunset[0], locale),
  };

  const airQuality: AirQualityData | null = aq.current
    ? {
        aqi: aq.current.european_aqi,
        pm25: aq.current.pm2_5,
        pm10: aq.current.pm10,
        no2: aq.current.nitrogen_dioxide,
        o3: aq.current.ozone,
      }
    : null;

  const hourly: HourlyForecast[] = weather.hourly.time.slice(0, 24).map((t: string, i: number) => ({
    time: t,
    temperature: weather.hourly.temperature_2m[i],
    weatherCode: weather.hourly.weather_code[i],
    precipitation: weather.hourly.precipitation[i],
  }));

  const daily: DailyForecast[] = d.time.map((t: string, i: number) => ({
    date: t,
    tempMax: d.temperature_2m_max[i],
    tempMin: d.temperature_2m_min[i],
    weatherCode: d.weather_code[i],
    sunrise: d.sunrise[i],
    sunset: d.sunset[i],
    precipitationSum: d.precipitation_sum[i],
    uvIndexMax: d.uv_index_max[i],
  }));

  return { current, airQuality, hourly, daily };
}
