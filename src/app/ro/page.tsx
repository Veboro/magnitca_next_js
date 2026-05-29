import type { Metadata } from "next";
import IndexPage from "@/legacy-pages/Index";
import { absoluteUrl } from "@/lib/site";
import ro from "@/i18n/locales/ro";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  const canonical = absoluteUrl("/ro");

  return {
    title: "Magnitca Moldova — furtuni magnetice astăzi și indice Kp",
    description:
      "Furtuni magnetice în Moldova astăzi: indice Kp, vânt solar, prognoză geomagnetică și pagini pentru orașele Moldovei.",
    alternates: {
      canonical,
      languages: {
        ro: canonical,
        "x-default": absoluteUrl("/ro"),
      },
    },
    openGraph: {
      type: "website",
      locale: "ro_MD",
      title: "Magnitca Moldova — furtuni magnetice astăzi și indice Kp",
      description:
        "Furtuni magnetice în Moldova astăzi: indice Kp, vânt solar, prognoză geomagnetică și pagini pentru orașele Moldovei.",
      url: canonical,
      siteName: "Magnitca",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function RomanianLandingPage() {
  const { kpData, windData, magData, scales, forecast3Day } = await getHomePageWeatherData();
  return (
    <IndexPage
      locale="ro"
      messages={ro}
      initialKp={kpData}
      initialWind={windData}
      initialMag={magData}
      initialScales={scales}
      initialForecast3={forecast3Day}
    />
  );
}
