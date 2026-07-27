import type { Metadata } from "next";
import { AuroraCountryPage } from "@/components/next/aurora-country-page";
import { getCzechiaAuroraForecast } from "@/lib/aurora-forecast";

export const revalidate = 900;

const pageTitle = "Polární záře v Česku dnes — mapa a předpověď podle krajů | Magnitca";
const pageDescription =
  "Polární záře v Česku dnes: kde a kdy je vidět severní záře — předpověď podle krajů, Kp-index, noční oblačnost, Měsíc a šance na pozorování na mapě.";
const pageUrl = "https://magnitca.com/cs/aurora";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
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
    question: "Je možné vidět polární záři v Česku?",
    answer:
      "Ano, ale zřídka. V Česku je obvykle potřeba silná nebo velmi silná geomagnetická bouře, aby se polární záře objevila blízko severního obzoru. Nejlepší šance je v severních krajích a na tmavých místech, daleko od světelného znečištění.",
  },
  {
    question: "Co znamená procento na mapě?",
    answer:
      "Procento je praktický odhad šance. Zohledňuje předpovídaný Kp-index, zeměpisnou šířku kraje, noční oblačnost, světlo Měsíce a to, nakolik je oblast vhodná pro pozorování severního obzoru.",
  },
  {
    question: "Jaký Kp je v Česku potřeba?",
    answer:
      "Slabé šance se někdy objevují už kolem Kp 6 v severní části země, ale pro pouhým okem viditelnou polární záři je často potřeba hodnota Kp 7 nebo vyšší, jasná obloha a tmavé okolí.",
  },
  {
    question: "Kde stojí za to pozorovat?",
    answer:
      "Kraje severního Česka — Ústecký kraj, Liberecký kraj, Královéhradecký kraj, Karlovarský kraj a Moravskoslezský kraj — bývají příznivější. Nejdůležitější je otevřený výhled na sever, daleko od městských světel.",
  },
  {
    question: "Proč je šance nízká i během bouře?",
    answer:
      "Geomagnetická aktivita je jen jedním faktorem. Mraky, světlo Měsíce, mlha, světelné znečištění a jižnější poloha mohou viditelnost snížit.",
  },
  {
    question: "Kdy stojí za to vyjít ven?",
    answer:
      "Nejlepší časové okno je tmavá noční část, přibližně mezi 22:00 a 04:00 hodinou. Při silném Kp stojí za to oblohu na severu kontrolovat několikrát, protože aktivita může přicházet ve vlnách.",
  },
  {
    question: "Z jakých dat se předpověď sestavuje?",
    answer:
      "Mapa využívá geomagnetická data z NOAA SWPC, Kp-předpověď, noční oblačnost z Open-Meteo, fázi Měsíce ze SunCalc a administrativní hranice z geoBoundaries.",
  },
  {
    question: "Zaručuje mapa viditelnost?",
    answer:
      "Ne. Mapa je vodítko, nikoli záruka. Vyšší procento znamená lepší podmínky, ale konečný výsledek vždy určuje místní obloha.",
  },
];

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Prague",
  }).format(new Date(dateIso));
}

export default async function HungaryAuroraPage() {
  const forecast = await getCzechiaAuroraForecast();
  const date = formatDate(forecast.updatedAt);
  const clouds = forecast.averageNightCloud === null
    ? "noční oblačnost se stále aktualizuje"
    : `průměrná noční oblačnost je kolem ${forecast.averageNightCloud}%`;

  return (
    <AuroraCountryPage
      forecast={forecast}
      homeHref="/cs"
      homeLabel="Magnitca"
      breadcrumbLabel="Polární záře"
      badge="Aurora watch Czechia"
      title="Polární záře v Česku"
      intro={`Polární záře v Česku dnes, ${date}: mapa ukazuje podle krajů, kde může být šance na pozorování severní záře této noci. Předpověď zohledňuje Kp-index až do hodnoty ${forecast.effectiveKp}, geomagnetickou aktivitu, zeměpisnou šířku, to, že ${clouds}, a osvětlení Měsíce ${forecast.moonIllumination}%.`}
      chanceLabel="Šance na polární záři:"
      todayLabel="dnes"
      tonightLabel="této noci"
      metrics={{
        activity: "Aktivita",
        currentKp: "nyní Kp",
        clouds: "Mraky",
        cloudHint: "noční průměr",
        moon: "Měsíc",
        moonHints: {
          bright: "světlá noc",
          moderate: "mírné světlo Měsíce",
          dark: "tmavší noc",
        },
        window: "Časové okno",
        windowValue: "22:00-04:00",
        windowHint: "noční pozorování",
      }}
      map={{
        boundariesUrl: "/geo/czechia-regions.geojson",
        center: [49.8, 15.47],
        zoom: 7,
        minZoom: 6,
        maxZoom: 10,
        regions: forecast.regions,
        labels: {
          legend: "Šance na pozorování polární záře",
          chance: "Šance",
          boundariesError: "Hranice krajů se nepodařilo načíst.",
        },
        legend: [
          { label: "velmi vysoká", tone: "veryHigh" },
          { label: "vysoká", tone: "high" },
          { label: "střední", tone: "medium" },
          { label: "nízká", tone: "low" },
          { label: "téměř žádná", tone: "none" },
        ],
      }}
      faq={{
        eyebrow: "FAQ",
        title: "Často kladené otázky o polární záři v Česku",
        intro: "Stručné odpovědi o Kp-indexu, rozdílech mezi kraji, oblačnosti a čtení mapy.",
        items: faqItems,
      }}
    />
  );
}
