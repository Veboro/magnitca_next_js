import type { Metadata } from "next";
import KpIndexClient from "@/legacy-pages/KpIndex";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export const metadata: Metadata = {
  title: "Indice Kp — Magnitca Moldova",
  description: "Indicele Kp actual, scara furtunilor geomagnetice și prognoza activității geomagnetice pentru Moldova.",
  alternates: {
    canonical: "/ro/kp-index",
    languages: {
      ro: "/ro/kp-index",
    },
  },
};

export default async function RomanianKpIndexPage() {
  const { kpData, scales } = await getHomePageWeatherData();
  return <KpIndexClient locale="ro" initialKp={kpData} initialScales={scales} />;
}
