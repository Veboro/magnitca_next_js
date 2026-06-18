import type { Metadata } from "next";
import { Activity, Cloud, Eye, HelpCircle, Moon, Timer } from "lucide-react";
import { AuroraUkraineMap } from "@/components/next/aurora-poland-map";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import { getUkraineAuroraForecast } from "@/lib/aurora-forecast";

export const revalidate = 900;

const pageTitle = "Карта північного сяйва в Україні | Полярне сяйво сьогодні | Magnitca";
const pageDescription =
  "Прогноз видимості північного або полярного сяйва в Україні по областях: інтерактивна карта, Kp-індекс, хмарність, темрява та умови для спостереження сьогодні.";
const pageUrl = "https://magnitca.com/aurora";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
    languages: {
      uk: pageUrl,
      pl: "https://magnitca.com/pl/aurora",
      "x-default": pageUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
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
    title: pageTitle,
    description: pageDescription,
    images: ["/og-image.png"],
  },
};

const auroraFaqItems = [
  {
    question: "Чи можна побачити північне або полярне сяйво в Україні?",
    answer:
      "Так, але це рідкісне явище. Північне сяйво, яке також називають полярним сяйвом або авророю, в Україні зазвичай можливе лише під час сильних або дуже сильних геомагнітних бур, коли авроральний овал розширюється далеко на південь. Найбільше шансів мають північні області, темні місця за містом і відкритий горизонт у напрямку півночі.",
  },
  {
    question: "Що означає відсоток на карті?",
    answer:
      "Відсоток показує орієнтовну оцінку умов для спостереження в конкретній області. Це не гарантія, що сяйво точно буде видно. Розрахунок враховує прогнозований Kp-індекс, широту області, нічну хмарність, освітленість Місяця та загальну придатність регіону для спостереження.",
  },
  {
    question: "Чому шанс може бути низьким, якщо є магнітна буря?",
    answer:
      "Магнітна буря сама по собі не гарантує видимість сяйва в Україні. Важливі також сила бурі, географічна широта, прозорість неба, хмарність, засвітка міст і яскравість Місяця. Якщо Kp недостатньо високий або небо закрите хмарами, реальний шанс побачити сяйво буде низьким.",
  },
  {
    question: "Який Kp потрібен, щоб сяйво було видно в Україні?",
    answer:
      "Для України зазвичай потрібен високий Kp. Перші слабкі шанси можуть з'являтися під час бур рівня приблизно Kp 6, але помітніші спостереження частіше пов'язані з Kp 7 і вище. Для центральних і південних областей потрібні ще сильніші події та дуже чисте небо.",
  },
  {
    question: "Де в Україні найкраще спостерігати північне сяйво?",
    answer:
      "Найкращі умови зазвичай у північних областях: Чернігівській, Волинській, Рівненській, Сумській, Житомирській та на півночі Київської області. Важливо виїхати подалі від міської засвітки, знайти відкритий північний горизонт і дочекатися повної темряви.",
  },
  {
    question: "Коли краще дивитися на небо?",
    answer:
      "Найкращий період для спостереження - темна частина ночі, приблизно з 21:00 до 04:00, залежно від сезону. Якщо прогноз показує високий Kp, варто перевіряти небо кілька разів протягом ночі, бо активність може приходити хвилями й тривати недовго.",
  },
  {
    question: "Чому на фотографіях сяйво видно краще, ніж очима?",
    answer:
      "Камера може накопичувати світло протягом кількох секунд, тому слабке червоне або зеленувате світіння на фото часто виглядає яскравішим, ніж у реальності. Очима в Україні сяйво може виглядати як бліда дуга, світла смуга або ледь помітне почервоніння біля північного горизонту.",
  },
  {
    question: "Які дані використовує карта?",
    answer:
      "Карта використовує відкриті дані NOAA SWPC для геомагнітної активності та прогнозу Kp, Open-Meteo для нічної хмарності по областях, SunCalc для освітленості Місяця і GeoBoundaries для контурів областей. Дані перераховуються регулярно, щоб карта не залишалася статичним макетом.",
  },
  {
    question: "Як часто оновлюється прогноз?",
    answer:
      "Сторінка оновлює розрахунок приблизно раз на 15 хвилин. Джерела даних також мають власну частоту оновлення, тому прогноз може змінюватися протягом вечора, особливо коли надходять нові дані NOAA про геомагнітну активність.",
  },
  {
    question: "Чи можна повністю покладатися на цю карту?",
    answer:
      "Карту варто використовувати як практичний орієнтир, а не як точну гарантію. Північне сяйво залежить від багатьох змінних, частина яких швидко змінюється. Якщо шанс високий, це означає, що умови стали перспективними, але остаточна відповідь завжди буде на небі.",
  },
];

function formatAuroraDate(dateIso: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Kyiv",
  }).format(new Date(dateIso)).replace(" р.", " року");
}

function formatCloudCondition(value: number | null) {
  if (value === null) return "нічну хмарність, яка ще уточнюється";
  if (value <= 25) return `низьку нічну хмарність - близько ${value}%`;
  if (value <= 60) return `помірну нічну хмарність - близько ${value}%`;
  return `високу нічну хмарність - близько ${value}%`;
}

function formatMoonCondition(value: number) {
  if (value <= 25) return `Місяць майже не заважає (${value}% освітленості)`;
  if (value <= 65) return `Місяць може частково впливати на видимість (${value}% освітленості)`;
  return `яскравий Місяць може погіршувати видимість (${value}% освітленості)`;
}

function getAuroraChanceColor(value: number) {
  if (value >= 75) return "hsl(16 92% 53%)";
  if (value >= 58) return "hsl(34 96% 52%)";
  if (value >= 38) return "hsl(48 94% 52%)";
  if (value >= 18) return "hsl(145 64% 46%)";
  return "hsl(204 72% 38%)";
}

export default async function UkrainianAuroraPage() {
  const forecast = await getUkraineAuroraForecast();
  const averageNightCloud = forecast.averageNightCloud;
  const forecastDate = formatAuroraDate(forecast.updatedAt);
  const cloudCondition = formatCloudCondition(averageNightCloud);
  const moonCondition = formatMoonCondition(forecast.moonIllumination);
  const auroraChanceColor = getAuroraChanceColor(forecast.topChance);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: auroraFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="official-page-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="official-page-shell aurora-page-shell space-y-8">
        <header className="official-page-header space-y-3 p-3 sm:p-4">
          <nav className="official-page-breadcrumb text-sm" aria-label="Breadcrumb">
            <a href="/" className="text-primary hover:text-primary/80">Магнітка</a>
            <span>/</span>
            <span>Північне сяйво</span>
          </nav>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <Eye className="h-4 w-4" />
                Aurora watch Ukraine
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
                Карта північного сяйва в Україні
              </h1>
              <p className="max-w-3xl text-base font-medium leading-7 text-muted-foreground">
                Карта північного сяйва в Україні на сьогодні, {forecastDate}, показує,
                де цієї ночі є шанс побачити сяйво та які області мають найкращі умови для спостереження.
                Якщо ви шукаєте полярне сяйво в Україні, це той самий прогноз аврори по областях.
                Поточний прогноз враховує Kp-індекс до {forecast.effectiveKp}, геомагнітну активність,
                широту області, темний північний горизонт, {cloudCondition} і фазу Місяця:
                {` ${moonCondition}.`}
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-[linear-gradient(135deg,hsl(var(--card))_0%,hsl(43_92%_92%)_58%,hsl(var(--card))_100%)] p-4 shadow-sm">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/20 blur-2xl" />
              <div className="relative flex items-center justify-between gap-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary">Шанс побачити сяйво:</p>
                <span className="rounded-full bg-[#183966] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">сьогодні</span>
              </div>
              <div className="relative mt-4 grid grid-cols-[minmax(0,1fr)_120px] items-end gap-3">
                <div className="min-w-0">
                  <p className="font-display text-2xl font-bold leading-tight text-foreground">{forecast.summaryLabel}</p>
                </div>
                <div className="relative h-[76px] w-[120px] rounded-xl border border-border/40 bg-card/75 px-1 pt-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]" aria-label={`Шанс побачити північне або полярне сяйво ${forecast.topChance}%`}>
                  <svg className="h-full w-full overflow-visible" viewBox="0 0 120 76" role="img" aria-hidden="true">
                    <path
                      d="M15 65 A45 45 0 0 1 105 65"
                      fill="none"
                      pathLength={100}
                      stroke="hsl(43 32% 82%)"
                      strokeLinecap="round"
                      strokeWidth="12"
                    />
                    <path
                      d="M15 65 A45 45 0 0 1 105 65"
                      fill="none"
                      pathLength={100}
                      stroke={auroraChanceColor}
                      strokeDasharray={`${forecast.topChance} 100`}
                      strokeLinecap="round"
                      strokeWidth="12"
                    />
                  </svg>
                  <div className="absolute inset-x-0 bottom-0 text-center">
                    <p className="font-mono text-2xl font-bold" style={{ color: auroraChanceColor }}>{forecast.topChance}%</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">цієї ночі</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="px-3 sm:px-4 md:hidden">
          <MobileAdsenseSlot />
        </section>

        <section className="grid gap-4 px-3 sm:px-4 lg:grid-cols-4">
          {[
            { icon: Activity, label: "Активність", value: `Kp ${forecast.effectiveKp}`, hint: `зараз Kp ${forecast.currentKp}` },
            {
              icon: Cloud,
              label: "Хмари",
              value: averageNightCloud === null ? "—" : `${averageNightCloud}%`,
              hint: "середня нічна оцінка",
            },
            {
              icon: Moon,
              label: "Місяць",
              value: `${forecast.moonIllumination}%`,
              hint: forecast.moonIllumination >= 70 ? "яскраве світло" : forecast.moonIllumination >= 35 ? "помірне світло" : "темніша ніч",
            },
            { icon: Timer, label: "Вікно", value: "21:00-04:00", hint: "нічне вікно прогнозу" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-primary">
                <item.icon className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{item.label}</span>
              </div>
              <p className="font-mono text-2xl font-bold text-foreground">{item.value}</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{item.hint}</p>
            </div>
          ))}
        </section>

        <section className="px-3 sm:px-4 md:hidden">
          <MobileAdsenseSlot />
        </section>

        <section className="px-3 sm:px-4">
          <AuroraUkraineMap regions={forecast.regions} />
        </section>

        <section className="px-3 sm:px-4 md:hidden">
          <MobileAdsenseSlot />
        </section>

        <section className="px-3 sm:px-4" aria-label="Поширені запитання про північне сяйво в Україні">
          <div className="rounded-2xl border border-primary/15 bg-card p-5 shadow-[0_0_24px_rgba(34,211,238,0.05)] sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">FAQ</p>
            </div>
            <div className="mb-6 max-w-3xl">
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Поширені запитання про північне сяйво в Україні
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Нижче зібрані відповіді про те, як працює карта, чому прогноз не є гарантією і що реально впливає на видимість сяйва.
              </p>
            </div>

            <div className="space-y-4">
              {auroraFaqItems.map((item) => (
                <details key={item.question} className="group rounded-xl border border-border/30 bg-background/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-foreground sm:text-base">
                    <span>{item.question}</span>
                    <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <p className="aurora-faq-answer px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
