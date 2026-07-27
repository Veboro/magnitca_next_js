import type { Metadata } from "next";
import { AuroraCountryPage } from "@/components/next/aurora-country-page";
import { getBulgariaAuroraForecast } from "@/lib/aurora-forecast";

export const revalidate = 900;

const pageTitle = "Полярно сияние в България днес — карта и прогноза по области | Magnitca";
const pageDescription =
  "Полярно сияние в България днес: къде и кога се вижда северното сияние — прогноза по области, Kp-индекс, нощна облачност, Луна и шансове за наблюдение на картата.";
const pageUrl = "https://magnitca.com/bg/aurora";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: "website",
    locale: "bg_BG",
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
    question: "Може ли да се види полярно сияние в България?",
    answer:
      "Да, но рядко. В България обикновено е нужна силна или много силна геомагнитна буря, за да се появи полярно сияние близо до северния хоризонт. Най-добър шанс има в северните области и на тъмни места, далеч от светлинното замърсяване.",
  },
  {
    question: "Какво означава процентът на картата?",
    answer:
      "Процентът е практическа оценка на шанса. Той отчита прогнозирания Kp-индекс, географската ширина на областта, нощната облачност, светлината на Луната и доколко районът е благоприятен за наблюдение на северния хоризонт.",
  },
  {
    question: "Какъв Kp е нужен в България?",
    answer:
      "Слаби шансове понякога се появяват още около Kp 6 в северната част на страната, но за видимо с просто око полярно сияние често са нужни стойност Kp 7 или по-висока, ясно небе и тъмна околност.",
  },
  {
    question: "Къде си струва да се наблюдава?",
    answer:
      "Районите на Северна България — Видин, Монтана, Враца, Плевен, Велико Търново, Русе, Силистра и Добрич — често са по-благоприятни. Най-важна е откритата гледка на север, далеч от градските светлини.",
  },
  {
    question: "Защо шансът е нисък дори по време на буря?",
    answer:
      "Геомагнитната активност е само един фактор. Облаците, светлината на Луната, мъглата, светлинното замърсяване и по-южното разположение могат да намалят видимостта.",
  },
  {
    question: "Кога си струва да се излезе навън?",
    answer:
      "Най-добрият времеви прозорец е тъмната нощна част, приблизително между 22:00 и 04:00 часа. При силен Kp си струва небето на север да се проверява няколко пъти, защото активността може да идва на вълни.",
  },
  {
    question: "От какви данни се изготвя прогнозата?",
    answer:
      "Картата използва геомагнитни данни от NOAA SWPC, Kp-прогноза, нощна облачност от Open-Meteo, лунна фаза от SunCalc и административни граници от geoBoundaries.",
  },
  {
    question: "Гарантира ли картата видимост?",
    answer:
      "Не. Картата е ориентир, а не гаранция. По-високият процент показва по-добри условия, но крайният резултат винаги се определя от местното небе.",
  },
];

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat("bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Sofia",
  }).format(new Date(dateIso));
}

export default async function HungaryAuroraPage() {
  const forecast = await getBulgariaAuroraForecast();
  const date = formatDate(forecast.updatedAt);
  const clouds = forecast.averageNightCloud === null
    ? "нощната облачност все още се обновява"
    : `средната нощна облачност е около ${forecast.averageNightCloud}%`;

  return (
    <AuroraCountryPage
      forecast={forecast}
      homeHref="/bg"
      homeLabel="Magnitca"
      breadcrumbLabel="Полярно сияние"
      badge="Aurora watch Bulgaria"
      title="Полярно сияние в България"
      intro={`Полярно сияние в България днес, ${date}: картата показва по области къде може да има шанс за наблюдение на северното сияние тази нощ. Прогнозата отчита Kp-индекса до стойност ${forecast.effectiveKp}, геомагнитната активност, географската ширина, това, че ${clouds}, и осветеността на Луната от ${forecast.moonIllumination}%.`}
      chanceLabel="Шанс за полярно сияние:"
      todayLabel="днес"
      tonightLabel="тази нощ"
      metrics={{
        activity: "Активност",
        currentKp: "сега Kp",
        clouds: "Облаци",
        cloudHint: "нощна средна",
        moon: "Луна",
        moonHints: {
          bright: "светла нощ",
          moderate: "умерена лунна светлина",
          dark: "по-тъмна нощ",
        },
        window: "Времеви прозорец",
        windowValue: "22:00-04:00",
        windowHint: "нощно наблюдение",
      }}
      map={{
        boundariesUrl: "/geo/bulgaria-provinces.geojson",
        center: [42.73, 25.48],
        zoom: 7,
        minZoom: 6,
        maxZoom: 10,
        regions: forecast.regions,
        labels: {
          legend: "Шанс за наблюдение на полярно сияние",
          chance: "Шанс",
          boundariesError: "Границите на областите не можаха да бъдат заредени.",
        },
        legend: [
          { label: "много висок", tone: "veryHigh" },
          { label: "висок", tone: "high" },
          { label: "среден", tone: "medium" },
          { label: "нисък", tone: "low" },
          { label: "почти никакъв", tone: "none" },
        ],
      }}
      faq={{
        eyebrow: "FAQ",
        title: "Често задавани въпроси за полярното сияние в България",
        intro: "Кратки отговори за Kp-индекса, разликите между областите, облачността и разчитането на картата.",
        items: faqItems,
      }}
    />
  );
}
