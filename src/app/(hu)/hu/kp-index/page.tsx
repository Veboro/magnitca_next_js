import type { Metadata } from "next";
import KpIndexClient from "@/legacy-pages/KpIndex";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export const metadata: Metadata = {
  title: "Kp-index ma — online grafikon és mágneses vihar előrejelzés | Magnitca",
  description: "Aktuális Kp-index, NOAA geomágneses skála és a következő napok aktivitási előrejelzése.",
  alternates: {
    canonical: "/hu/kp-index",
    languages: {
      hu: "/hu/kp-index",
    },
  },
};

export default async function HungarianKpIndexPage() {
  const { kpData, scales } = await getHomePageWeatherData();
  return <KpIndexClient locale="hu" initialKp={kpData} initialScales={scales} />;
}
