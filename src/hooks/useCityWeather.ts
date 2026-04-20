import { useQuery } from "@tanstack/react-query";
import type { SiteLocale } from "@/lib/locale";

interface WeatherData {
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

interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitation: number;
}

interface DailyForecast {
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

const weatherCodeLabels: Record<SiteLocale, Record<number, string>> = {
  uk: {
    0: "Ясно",
    1: "Переважно ясно",
    2: "Мінлива хмарність",
    3: "Хмарно",
    45: "Туман",
    48: "Іній",
    51: "Мряка",
    53: "Помірна мряка",
    55: "Сильна мряка",
    61: "Невеликий дощ",
    63: "Помірний дощ",
    65: "Сильний дощ",
    66: "Крижаний дощ",
    67: "Сильний крижаний дощ",
    71: "Невеликий сніг",
    73: "Помірний сніг",
    75: "Сильний сніг",
    77: "Сніжна крупа",
    80: "Злива",
    81: "Помірна злива",
    82: "Сильна злива",
    85: "Снігопад",
    86: "Сильний снігопад",
    95: "Гроза",
    96: "Гроза з градом",
    99: "Гроза із сильним градом",
  },
  ru: {
    0: "Ясно",
    1: "Преимущественно ясно",
    2: "Переменная облачность",
    3: "Облачно",
    45: "Туман",
    48: "Иней",
    51: "Морось",
    53: "Умеренная морось",
    55: "Сильная морось",
    61: "Небольшой дождь",
    63: "Умеренный дождь",
    65: "Сильный дождь",
    66: "Ледяной дождь",
    67: "Сильный ледяной дождь",
    71: "Небольшой снег",
    73: "Умеренный снег",
    75: "Сильный снег",
    77: "Снежная крупа",
    80: "Ливень",
    81: "Умеренный ливень",
    82: "Сильный ливень",
    85: "Снегопад",
    86: "Сильный снегопад",
    95: "Гроза",
    96: "Гроза с градом",
    99: "Гроза с сильным градом",
  },
  pl: {
    0: "Bezchmurnie",
    1: "Przeważnie pogodnie",
    2: "Częściowe zachmurzenie",
    3: "Pochmurnie",
    45: "Mgła",
    48: "Szadź",
    51: "Mżawka",
    53: "Umiarkowana mżawka",
    55: "Silna mżawka",
    61: "Lekki deszcz",
    63: "Umiarkowany deszcz",
    65: "Silny deszcz",
    66: "Marznący deszcz",
    67: "Silny marznący deszcz",
    71: "Lekki śnieg",
    73: "Umiarkowany śnieg",
    75: "Silny śnieg",
    77: "Krupa śnieżna",
    80: "Przelotny deszcz",
    81: "Umiarkowany przelotny deszcz",
    82: "Silny przelotny deszcz",
    85: "Opady śniegu",
    86: "Silne opady śniegu",
    95: "Burza",
    96: "Burza z gradem",
    99: "Silna burza z gradem",
  },
};

export const getWeatherLabel = (code: number, locale: SiteLocale = "uk") =>
  weatherCodeLabels[locale][code] ?? (locale === "pl" ? "Nieznane" : locale === "ru" ? "Неизвестно" : "Невідомо");

export const getWeatherEmoji = (code: number) => {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "🌨️";
  return "⛈️";
};

export const getAqiLabel = (aqi: number, locale: SiteLocale = "uk") => {
  const labels = locale === "pl"
    ? ["Bardzo dobra", "Dobra", "Umiarkowana", "Słaba", "Bardzo słaba", "Niebezpieczna"]
    : locale === "ru"
      ? ["Отличная", "Хорошая", "Умеренная", "Плохая", "Очень плохая", "Опасная"]
      : ["Відмінна", "Добра", "Помірна", "Погана", "Дуже погана", "Небезпечна"];
  if (aqi <= 20) return { label: labels[0], color: "hsl(145, 80%, 45%)" };
  if (aqi <= 40) return { label: labels[1], color: "hsl(100, 70%, 45%)" };
  if (aqi <= 60) return { label: labels[2], color: "hsl(55, 90%, 50%)" };
  if (aqi <= 80) return { label: labels[3], color: "hsl(35, 100%, 55%)" };
  if (aqi <= 100) return { label: labels[4], color: "hsl(15, 90%, 50%)" };
  return { label: labels[5], color: "hsl(0, 80%, 55%)" };
};

export function formatApiLocalTime(value: string): string {
  const match = value.match(/T(\d{2}:\d{2})/);
  if (match) return match[1];
  return value;
}

function calcDayLength(sunrise: string, sunset: string, locale: SiteLocale = "uk"): string {
  const diff = new Date(sunset).getTime() - new Date(sunrise).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (locale === "pl") return `${h} godz. ${m} min`;
  if (locale === "ru") return `${h} ч ${m} мин`;
  return `${h}год ${m}хв`;
}

export async function fetchCityWeather(lat: number, lon: number, tz: string, locale: SiteLocale = "uk"): Promise<CityWeatherResult> {
  const [weatherRes, aqRes] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code,uv_index&hourly=temperature_2m,weather_code,precipitation&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,precipitation_sum,uv_index_max&timezone=${encodeURIComponent(tz)}&forecast_days=7`
    ),
    fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone&timezone=${encodeURIComponent(tz)}`
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
    dayLength: calcDayLength(d.sunrise[0], d.sunset[0], locale),
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

export function useCityWeather(
  lat = 50.4501,
  lon = 30.5234,
  tz = "Europe/Kyiv",
  initialData?: CityWeatherResult,
  locale: SiteLocale = "uk"
) {
  return useQuery({
    queryKey: ["city-weather", lat, lon],
    queryFn: () => fetchCityWeather(lat, lon, tz, locale),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 3 * 60 * 1000,
    initialData,
  });
}
