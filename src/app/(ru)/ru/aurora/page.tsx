import type { Metadata } from "next";
import { AuroraCountryPage } from "@/components/next/aurora-country-page";
import { getRussianUkraineAuroraForecast } from "@/lib/aurora-forecast";

export const revalidate = 900;

const pageTitle = "Северное сияние в Украине сегодня — карта и прогноз по областям | Magnitca";
const pageDescription =
  "Северное сияние в Украине сегодня: где и когда можно увидеть полярное сияние — прогноз по областям, Kp-индекс, облачность, Луна и условия для наблюдения на карте.";
const pageUrl = "https://magnitca.com/ru/aurora";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
    languages: {
      uk: "https://magnitca.com/aurora",
      ru: pageUrl,
      "x-default": "https://magnitca.com/aurora",
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
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
    question: "Можно ли увидеть северное или полярное сияние в Украине?",
    answer:
      "Да, но это редкое явление. В Украине северное сияние обычно становится возможным во время сильных геомагнитных бурь, когда авроральная зона расширяется далеко на юг. Больше всего шансов у северных областей, темных мест за городом и открытого горизонта в направлении севера.",
  },
  {
    question: "Что означает процент на карте?",
    answer:
      "Процент показывает ориентировочную оценку условий для наблюдения в конкретной области. Это не гарантия, что сияние точно будет видно. Расчет учитывает прогнозируемый Kp-индекс, широту области, ночную облачность, освещенность Луны и общую пригодность региона для наблюдения.",
  },
  {
    question: "Какой Kp нужен, чтобы сияние было видно в Украине?",
    answer:
      "Для Украины обычно нужен высокий Kp. Первые слабые шансы могут появляться примерно при Kp 6, но более заметные наблюдения чаще связаны с Kp 7 и выше. Для центральных и южных областей нужны еще более сильные события и очень чистое небо.",
  },
  {
    question: "Где в Украине лучше всего наблюдать сияние?",
    answer:
      "Обычно лучшие условия в северных областях: Черниговской, Волынской, Ровненской, Сумской, Житомирской и на севере Киевской области. Важно выехать подальше от городской засветки, найти открытый северный горизонт и дождаться полной темноты.",
  },
  {
    question: "Почему шанс может быть низким даже при магнитной буре?",
    answer:
      "Магнитная буря сама по себе не гарантирует видимость сияния. Важны сила бури, географическая широта, облачность, прозрачность атмосферы, засветка городов и яркость Луны. Если Kp недостаточно высокий или небо закрыто облаками, реальный шанс будет низким.",
  },
  {
    question: "Когда лучше смотреть на небо?",
    answer:
      "Лучшее время - темная часть ночи, примерно с 21:00 до 04:00 в зависимости от сезона. Если прогноз показывает высокий Kp, стоит проверять северное небо несколько раз за ночь, потому что активность может приходить волнами и длиться недолго.",
  },
  {
    question: "Почему на фото сияние видно лучше, чем глазами?",
    answer:
      "Камера может накапливать свет несколько секунд, поэтому слабое красное или зеленоватое свечение на фотографии часто выглядит ярче, чем в реальности. Глазами в Украине сияние может выглядеть как бледная дуга, светлая полоса или едва заметное покраснение у северного горизонта.",
  },
  {
    question: "Какие данные использует карта?",
    answer:
      "Карта использует открытые данные NOAA SWPC для геомагнитной активности и прогноза Kp, Open-Meteo для ночной облачности по областям, SunCalc для освещенности Луны и geoBoundaries для контуров областей. Расчет обновляется регулярно, поэтому это не статический макет.",
  },
];

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Kyiv",
  }).format(new Date(dateIso));
}

function formatClouds(value: number | null) {
  if (value === null) return "ночную облачность, которая еще уточняется";
  if (value <= 25) return `низкую ночную облачность около ${value}%`;
  if (value <= 60) return `умеренную ночную облачность около ${value}%`;
  return `высокую ночную облачность около ${value}%`;
}

export default async function RussianUkraineAuroraPage() {
  const forecast = await getRussianUkraineAuroraForecast();
  const date = formatDate(forecast.updatedAt);
  const clouds = formatClouds(forecast.averageNightCloud);

  return (
    <AuroraCountryPage
      forecast={forecast}
      homeHref="/ru"
      homeLabel="Магнитка"
      breadcrumbLabel="Северное сияние"
      badge="Aurora watch Ukraine"
      title="Северное сияние в Украине"
      intro={`Северное сияние в Украине сегодня, ${date}: карта по областям показывает, в каких областях этой ночью есть шанс увидеть сияние. Прогноз учитывает Kp-индекс до ${forecast.effectiveKp}, геомагнитную активность, широту области, темный северный горизонт, ${clouds} и освещенность Луны ${forecast.moonIllumination}%.`}
      chanceLabel="Шанс увидеть сияние:"
      todayLabel="сегодня"
      tonightLabel="этой ночью"
      metrics={{
        activity: "Активность",
        currentKp: "сейчас Kp",
        clouds: "Облака",
        cloudHint: "средняя ночная оценка",
        moon: "Луна",
        moonHints: {
          bright: "яркая ночь",
          moderate: "умеренный свет Луны",
          dark: "более темная ночь",
        },
        window: "Окно",
        windowValue: "21:00-04:00",
        windowHint: "ночное окно прогноза",
      }}
      map={{
        boundariesUrl: "/geo/ukraine-oblasts.geojson",
        center: [49.2, 31.4],
        zoom: 6,
        minZoom: 5,
        maxZoom: 8,
        regions: forecast.regions,
        labels: {
          legend: "Шанс увидеть северное / полярное сияние",
          chance: "Шанс",
          boundariesError: "Не удалось загрузить границы областей.",
        },
        legend: [
          { label: "очень высокий", tone: "veryHigh" },
          { label: "высокий", tone: "high" },
          { label: "умеренный", tone: "medium" },
          { label: "низкий", tone: "low" },
          { label: "почти нет", tone: "none" },
        ],
      }}
      faq={{
        eyebrow: "FAQ",
        title: "Частые вопросы о северном сиянии в Украине",
        intro: "Короткие ответы о Kp-индексе, погодных условиях, областях с лучшими шансами и том, как правильно читать карту.",
        items: faqItems,
      }}
    />
  );
}
