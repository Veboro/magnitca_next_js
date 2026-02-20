import { useQuery } from "@tanstack/react-query";

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

const KYIV_LAT = 50.4501;
const KYIV_LON = 30.5234;

const weatherCodeLabels: Record<number, string> = {
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
};

export const getWeatherLabel = (code: number) => weatherCodeLabels[code] ?? "Невідомо";

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

export const getAqiLabel = (aqi: number) => {
  if (aqi <= 20) return { label: "Відмінна", color: "hsl(145, 80%, 45%)" };
  if (aqi <= 40) return { label: "Добра", color: "hsl(100, 70%, 45%)" };
  if (aqi <= 60) return { label: "Помірна", color: "hsl(55, 90%, 50%)" };
  if (aqi <= 80) return { label: "Погана", color: "hsl(35, 100%, 55%)" };
  if (aqi <= 100) return { label: "Дуже погана", color: "hsl(15, 90%, 50%)" };
  return { label: "Небезпечна", color: "hsl(0, 80%, 55%)" };
};

function calcDayLength(sunrise: string, sunset: string): string {
  const diff = new Date(sunset).getTime() - new Date(sunrise).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}год ${m}хв`;
}

async function fetchWeather(): Promise<CityWeatherResult> {
  const [weatherRes, aqRes] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${KYIV_LAT}&longitude=${KYIV_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code,uv_index&hourly=temperature_2m,weather_code,precipitation&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,precipitation_sum,uv_index_max&timezone=Europe/Kyiv&forecast_days=7`
    ),
    fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${KYIV_LAT}&longitude=${KYIV_LON}&current=european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone&timezone=Europe/Kyiv`
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
    dayLength: calcDayLength(d.sunrise[0], d.sunset[0]),
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

export function useCityWeather() {
  return useQuery({
    queryKey: ["city-weather", "kyiv"],
    queryFn: fetchWeather,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 3 * 60 * 1000,
  });
}
