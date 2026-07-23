import type { Metadata } from "next";
import KpIndexClient from "@/legacy-pages/KpIndex";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("kp_index", "/kp-index", "hu");
}

export default async function HungarianKpIndexPage() {
  const { kpData, scales } = await getHomePageWeatherData();
  return <KpIndexClient locale="hu" initialKp={kpData} initialScales={scales} />;
}
