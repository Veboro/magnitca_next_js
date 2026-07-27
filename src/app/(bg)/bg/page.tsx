import type { Metadata } from "next";
import IndexPage from "@/legacy-pages/Index";
import bg from "@/i18n/locales/bg";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("home", "/", "bg");
}

export default async function BulgarianLandingPage() {
  const { kpData, windData, magData, scales, forecast3Day } = await getHomePageWeatherData();
  return (
    <IndexPage
      locale="bg"
      messages={bg}
      initialKp={kpData}
      initialWind={windData}
      initialMag={magData}
      initialScales={scales}
      initialForecast3={forecast3Day}
    />
  );
}
