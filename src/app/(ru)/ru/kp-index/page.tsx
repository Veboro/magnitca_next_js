import type { Metadata } from "next";
import KpIndexClient from "@/legacy-pages/KpIndex";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("kp_index", "/kp-index", "ru");
}

export default async function RussianKpIndexPage() {
  const { kpData, scales } = await getHomePageWeatherData();
  return <KpIndexClient locale="ru" initialKp={kpData} initialScales={scales} />;
}
