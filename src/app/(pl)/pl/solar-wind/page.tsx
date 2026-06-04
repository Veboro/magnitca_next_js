import type { Metadata } from "next";
import SolarWindClient from "@/legacy-pages/SolarWind";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("solar_wind", "/solar-wind", "pl");
}

export default async function PolishSolarWindPage() {
  const { windData, magData } = await getHomePageWeatherData();
  return <SolarWindClient locale="pl" initialWind={windData} initialMag={magData} />;
}
