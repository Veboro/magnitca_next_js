import type { Metadata } from "next";
import { AuroraCountryPage } from "@/components/next/aurora-country-page";
import { getHungaryAuroraForecast } from "@/lib/aurora-forecast";

export const revalidate = 900;

const pageTitle = "Sarki fény Magyarországon ma — térkép és előrejelzés vármegyénként | Magnitca";
const pageDescription =
  "Sarki fény Magyarországon ma: hol és mikor látható az északi fény — előrejelzés vármegyénként, Kp-index, éjszakai felhőzet, Hold és megfigyelési esélyek a térképen.";
const pageUrl = "https://magnitca.com/hu/aurora";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: "website",
    locale: "hu_HU",
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: "Magnitca",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/og-image.png"],
  },
};

const faqItems = [
  {
    question: "Látható lehet a sarki fény Magyarországon?",
    answer:
      "Igen, de ritkán. Magyarországon általában erős vagy nagyon erős geomágneses vihar kell ahhoz, hogy a sarki fény megjelenjen az északi horizont közelében. A legjobb esély az északi vármegyékben és a sötét, fényszennyezéstől távoli helyeken van.",
  },
  {
    question: "Mit jelent a százalék a térképen?",
    answer:
      "A százalék egy gyakorlati esélybecslés. Figyelembe veszi az előrejelzett Kp-indexet, a vármegye földrajzi szélességét, az éjszakai felhőzetet, a Hold fényét és azt, hogy mennyire kedvező a terület az északi horizont megfigyelésére.",
  },
  {
    question: "Mekkora Kp kell Magyarországon?",
    answer:
      "Gyenge esélyek néha Kp 6 környékén már megjelenhetnek az északi országrészben, de szemmel is észrevehető sarki fényhez gyakran Kp 7 vagy annál magasabb érték, tiszta ég és sötét környezet szükséges.",
  },
  {
    question: "Hol érdemes figyelni?",
    answer:
      "Észak-Magyarország, Nógrád, Borsod-Abaúj-Zemplén, Heves, Szabolcs-Szatmár-Bereg és Győr-Moson-Sopron térsége gyakran kedvezőbb. A legfontosabb a városi fényektől távoli, nyílt északi kilátás.",
  },
  {
    question: "Miért alacsony az esély vihar idején is?",
    answer:
      "A geomágneses aktivitás csak egy tényező. A felhők, a Hold fénye, a pára, a fényszennyezés és a délebbi fekvés mind csökkenthetik a láthatóságot.",
  },
  {
    question: "Mikor érdemes kimenni?",
    answer:
      "A legjobb időablak a sötét éjszakai időszak, nagyjából 22:00 és 04:00 között. Erős Kp esetén érdemes többször ellenőrizni az északi égboltot, mert az aktivitás hullámokban érkezhet.",
  },
  {
    question: "Milyen adatokból készül az előrejelzés?",
    answer:
      "A térkép NOAA SWPC geomágneses adatokat, Kp-előrejelzést, Open-Meteo éjszakai felhőzetet, SunCalc Hold-fázist és geoBoundaries közigazgatási határokat használ.",
  },
  {
    question: "Garantálja a térkép a láthatóságot?",
    answer:
      "Nem. A térkép iránymutatás, nem garancia. A magasabb százalék jobb feltételeket jelez, de a végső eredményt mindig a helyi égbolt dönti el.",
  },
];

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat("hu-HU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Budapest",
  }).format(new Date(dateIso));
}

export default async function HungaryAuroraPage() {
  const forecast = await getHungaryAuroraForecast();
  const date = formatDate(forecast.updatedAt);
  const clouds = forecast.averageNightCloud === null
    ? "az éjszakai felhőzet még frissül"
    : `az átlagos éjszakai felhőzet körülbelül ${forecast.averageNightCloud}%`;

  return (
    <AuroraCountryPage
      forecast={forecast}
      homeHref="/hu"
      homeLabel="Magnitca"
      breadcrumbLabel="Sarki fény"
      badge="Aurora watch Hungary"
      title="Sarki fény Magyarországon"
      intro={`Sarki fény Magyarországon ma, ${date}: a térkép vármegyék szerint mutatja, hol lehet esély az északi fény megfigyelésére ma éjszaka. Az előrejelzés figyelembe veszi a Kp-indexet ${forecast.effectiveKp} értékig, a geomágneses aktivitást, a földrajzi szélességet, ${clouds} értékét és a Hold ${forecast.moonIllumination}%-os megvilágítását.`}
      chanceLabel="Esély a sarki fényre:"
      todayLabel="ma"
      tonightLabel="ma éjjel"
      metrics={{
        activity: "Aktivitás",
        currentKp: "most Kp",
        clouds: "Felhők",
        cloudHint: "éjszakai átlag",
        moon: "Hold",
        moonHints: {
          bright: "világos éjszaka",
          moderate: "közepes holdfény",
          dark: "sötétebb éjszaka",
        },
        window: "Időablak",
        windowValue: "22:00-04:00",
        windowHint: "éjszakai megfigyelés",
      }}
      map={{
        boundariesUrl: "/geo/hungary-counties.geojson",
        center: [47.1, 19.5],
        zoom: 7,
        minZoom: 6,
        maxZoom: 10,
        regions: forecast.regions,
        labels: {
          legend: "Esély a sarki fény megfigyelésére",
          chance: "Esély",
          boundariesError: "Nem sikerült betölteni a vármegyék határait.",
        },
        legend: [
          { label: "nagyon magas", tone: "veryHigh" },
          { label: "magas", tone: "high" },
          { label: "közepes", tone: "medium" },
          { label: "alacsony", tone: "low" },
          { label: "szinte nincs", tone: "none" },
        ],
      }}
      faq={{
        eyebrow: "FAQ",
        title: "Gyakori kérdések a sarki fényről Magyarországon",
        intro: "Rövid válaszok a Kp-indexről, a vármegyék közötti különbségekről, a felhőzetről és a térkép értelmezéséről.",
        items: faqItems,
      }}
    />
  );
}
