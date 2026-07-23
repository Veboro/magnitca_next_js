import type { Metadata } from "next";
import KpIndexClient from "@/legacy-pages/KpIndex";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("kp_index", "/kp-index", "ro");
}

export default async function RomanianKpIndexPage() {
  const { kpData, scales } = await getHomePageWeatherData();
  return <KpIndexClient locale="ro" initialKp={kpData} initialScales={scales} />;
}
