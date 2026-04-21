import type { Metadata } from "next";
import IndexPage from "@/legacy-pages/Index";
import { resolveLocalizedMetadata } from "@/lib/seo";
import ru from "@/i18n/locales/ru";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("home", "/", "ru");
}

export default async function RussianHomePage() {
  const { kpData, windData, magData, scales } = await getHomePageWeatherData();
  return (
    <IndexPage
      locale="ru"
      messages={ru}
      initialKp={kpData}
      initialWind={windData}
      initialMag={magData}
      initialScales={scales}
    />
  );
}
