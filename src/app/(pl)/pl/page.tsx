import type { Metadata } from "next";
import IndexPage from "@/legacy-pages/Index";
import pl from "@/i18n/locales/pl";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("home", "/", "pl");
}

export default async function PolishLandingPage() {
  const { kpData, windData, magData, scales, forecast3Day } = await getHomePageWeatherData();
  return (
    <IndexPage
      locale="pl"
      messages={pl}
      initialKp={kpData}
      initialWind={windData}
      initialMag={magData}
      initialScales={scales}
      initialForecast3={forecast3Day}
    />
  );
}
