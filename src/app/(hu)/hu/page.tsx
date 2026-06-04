import type { Metadata } from "next";
import IndexPage from "@/legacy-pages/Index";
import hu from "@/i18n/locales/hu";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("home", "/", "hu");
}

export default async function HungarianLandingPage() {
  const { kpData, windData, magData, scales, forecast3Day } = await getHomePageWeatherData();
  return (
    <IndexPage
      locale="hu"
      messages={hu}
      initialKp={kpData}
      initialWind={windData}
      initialMag={magData}
      initialScales={scales}
      initialForecast3={forecast3Day}
    />
  );
}
