import type { Metadata } from "next";
import SolarWindClient from "@/legacy-pages/SolarWind";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("solar_wind", "/solar-wind", "ru");
}

export default async function RussianSolarWindPage() {
  const { windData, magData } = await getHomePageWeatherData();
  return <SolarWindClient locale="ru" initialWind={windData} initialMag={magData} />;
}
