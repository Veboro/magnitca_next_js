import type { Metadata } from "next";
import IndexPage from "@/legacy-pages/Index";
import en from "@/i18n/locales/en";
import { resolveLocalizedMetadata } from "@/lib/seo";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("home", "/", "en");
}

export default async function EnglishLandingPage() {
  const { kpData, windData, magData, scales, forecast3Day } = await getHomePageWeatherData();
  return (
    <IndexPage
      locale="en"
      messages={en}
      initialKp={kpData}
      initialWind={windData}
      initialMag={magData}
      initialScales={scales}
      initialForecast3={forecast3Day}
    />
  );
}
