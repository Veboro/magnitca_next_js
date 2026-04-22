import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";
import IndexPage from "@/legacy-pages/Index";
import uk from "@/i18n/locales/uk";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("home", "/", "uk");
}

export default async function HomePage() {
  const { kpData, windData, magData, scales, forecast3Day } = await getHomePageWeatherData();
  return (
    <IndexPage
      locale="uk"
      messages={uk}
      initialKp={kpData}
      initialWind={windData}
      initialMag={magData}
      initialScales={scales}
      initialForecast3={forecast3Day}
    />
  );
}
