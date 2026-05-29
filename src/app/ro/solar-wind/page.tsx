import type { Metadata } from "next";
import SolarWindClient from "@/legacy-pages/SolarWind";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export const metadata: Metadata = {
  title: "Vânt solar — Magnitca Moldova",
  description: "Viteza vântului solar, densitatea și componenta IMF Bz în timp real.",
  alternates: {
    canonical: "/ro/solar-wind",
    languages: {
      ro: "/ro/solar-wind",
    },
  },
};

export default async function RomanianSolarWindPage() {
  const { windData, magData } = await getHomePageWeatherData();
  return <SolarWindClient locale="ro" initialWind={windData} initialMag={magData} />;
}
