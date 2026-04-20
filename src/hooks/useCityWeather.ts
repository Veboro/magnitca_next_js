import { useQuery } from "@tanstack/react-query";
import type { SiteLocale } from "@/lib/locale";
import type { CityWeatherResult } from "@/lib/city-weather";
export type { CityWeatherResult } from "@/lib/city-weather";

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

export async function fetchCityWeather(lat: number, lon: number, tz: string, locale: SiteLocale = "uk"): Promise<CityWeatherResult> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    tz,
    locale,
  });

  const response = await fetch(`/api/city-weather?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch city weather");
  }

  return response.json();
}

export function useCityWeather(
  lat = 50.4501,
  lon = 30.5234,
  tz = "Europe/Kyiv",
  initialData?: CityWeatherResult,
  locale: SiteLocale = "uk"
) {
  return useQuery({
    queryKey: ["city-weather", lat, lon, tz, locale],
    queryFn: () => fetchCityWeather(lat, lon, tz, locale),
    refetchInterval: 60 * 60 * 1000,
    staleTime: 60 * 60 * 1000,
    initialData,
  });
}
