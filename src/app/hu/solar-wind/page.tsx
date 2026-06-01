import type { Metadata } from "next";
import SolarWindClient from "@/legacy-pages/SolarWind";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export const metadata: Metadata = {
  title: "Napszél ma — sebesség, sűrűség és IMF Bz online | Magnitca",
  description: "A napszél sebessége, sűrűsége és az IMF Bz komponens valós időben.",
  alternates: {
    canonical: "/hu/solar-wind",
    languages: {
      hu: "/hu/solar-wind",
    },
  },
};

export default async function HungarianSolarWindPage() {
  const { windData, magData } = await getHomePageWeatherData();
  return <SolarWindClient locale="hu" initialWind={windData} initialMag={magData} />;
}
