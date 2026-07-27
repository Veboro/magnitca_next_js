import type { Metadata } from "next";
import SolarWindClient from "@/legacy-pages/SolarWind";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("solar_wind", "/solar-wind", "cs");
}

export default async function CzechSolarWindPage() {
  const { windData, magData } = await getHomePageWeatherData();
  return <SolarWindClient locale="cs" initialWind={windData} initialMag={magData} />;
}
