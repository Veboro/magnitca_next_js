import type { Metadata } from "next";
import IndexPage from "@/legacy-pages/Index";
import { absoluteUrl } from "@/lib/site";
import pl from "@/i18n/locales/pl";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export async function generateMetadata(): Promise<Metadata> {
  const canonical = absoluteUrl("/pl");

  return {
    title: "Magnitca — burze magnetyczne dzisiaj i prognoza indeksu Kp",
    description:
      "Polska wersja Magnitca pokazuje burze magnetyczne, indeks Kp, wiatr sloneczny i pogode kosmiczna w czasie rzeczywistym.",
    alternates: {
      canonical,
      languages: {
        uk: absoluteUrl("/"),
        ru: absoluteUrl("/ru"),
        pl: canonical,
        "x-default": absoluteUrl("/"),
      },
    },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      title: "Magnitca — burze magnetyczne dzisiaj i prognoza indeksu Kp",
      description:
        "Polska wersja Magnitca pokazuje burze magnetyczne, indeks Kp, wiatr sloneczny i pogode kosmiczna w czasie rzeczywistym.",
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
    twitter: {
      card: "summary_large_image",
      title: "Magnitca — burze magnetyczne dzisiaj i prognoza indeksu Kp",
      description:
        "Polska wersja Magnitca pokazuje burze magnetyczne, indeks Kp, wiatr sloneczny i pogode kosmiczna w czasie rzeczywistym.",
      images: ["/og-image.png"],
    },
  };
}

export default async function PolishLandingPage() {
  const { kpData, windData, magData, scales } = await getHomePageWeatherData();
  return (
    <IndexPage
      locale="pl"
      messages={pl}
      initialKp={kpData}
      initialWind={windData}
      initialMag={magData}
      initialScales={scales}
    />
  );
}
