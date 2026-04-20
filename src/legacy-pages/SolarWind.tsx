"use client";

import { usePageMeta } from "@/hooks/usePageMeta";
import { useSolarWind, useMagData } from "@/hooks/useSpaceWeather";
import { cn } from "@/lib/utils";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Wind, TrendingUp, Info, HelpCircle, Gauge, Zap } from "lucide-react";
import type { SiteLocale } from "@/lib/locale";

type LegacyLocale = SiteLocale;

const copy = {
  uk: {
    pageTitle: "Сонячний вітер онлайн в режимі реального часу — швидкість та густина",
    pageDescription:
      "Сонячний вітер зараз у реальному часі. Швидкість, густина та графік за останні 2 години. Дані NOAA DSCOVR оновлюються щохвилини.",
    heroTitle: "Сонячний вітер сьогодні",
    heroText:
      "Швидкість та густина сонячного вітру в реальному часі. Графік за останні 2 години та міжпланетне магнітне поле (IMF Bz). Дані супутника DSCOVR від NOAA SWPC.",
    currentAria: "Поточні значення сонячного вітру",
    speed: "Швидкість",
    density: "Густина",
    normal: "Нормальна",
    elevated: "Підвищена",
    stronglySouth: "Сильно південний",
    south: "Південний",
    weaklySouth: "Слабо південний",
    north: "Північний",
    speedChartAria: "Графік швидкості та густини сонячного вітру",
    speedChartTitle: "Швидкість та густина — останні 2 години",
    bzChartAria: "Графік IMF Bz",
    bzChartTitle: "Міжпланетне магнітне поле (Bz) — останні 2 години",
    loading: "Завантаження...",
    bzNote:
      "Від'ємне значення Bz (південне) полегшує проникнення сонячного вітру в магнітосферу Землі. Bz нижче -5 нТ значно підвищує ймовірність геомагнітної бурі.",
    scaleAria: "Шкала швидкості сонячного вітру",
    scaleTitle: "Шкала швидкості сонячного вітру (км/с)",
    seoAria: "Про сонячний вітер",
    seoHeading: "Що таке сонячний вітер і чому він важливий?",
    seoText1:
      "Сонячний вітер — це безперервний потік заряджених частинок (плазми), що витікає з верхньої атмосфери Сонця — корони. Його швидкість варіюється від 300 до понад 800 км/с, а густина — від одиниць до десятків частинок на кубічний сантиметр. Сонячний вітер несе із собою міжпланетне магнітне поле (IMF), яке взаємодіє з магнітосферою Землі.",
    seoText2:
      "Коли швидкість сонячного вітру різко зростає, це може спричинити геомагнітну бурю. Особливо важливу роль відіграє компонента Bz міжпланетного магнітного поля: коли Bz стає від'ємним (південним), магнітосфера стає вразливішою. На цій сторінці ви знайдете поточні значення швидкості, густини сонячного вітру та IMF Bz у реальному часі від супутника DSCOVR (NOAA).",
    faqAria: "Часті питання про сонячний вітер",
    faqTitle: "Часті питання",
    tooltipKyiv: "Київ",
    areaSpeed: "Швидкість",
    areaDensity: "Густина",
    speedLevels: [
      { range: "< 300", status: "Повільний", color: "bg-storm-quiet", description: "Повільний сонячний вітер. Спокійні геомагнітні умови, мінімальний вплив на магнітосферу." },
      { range: "300–400", status: "Нормальний", color: "bg-storm-quiet", description: "Типова швидкість сонячного вітру. Стабільні умови, без впливу на технології та здоров'я." },
      { range: "400–500", status: "Підвищений", color: "bg-storm-minor", description: "Підвищена швидкість. Можливі незначні збурення магнітного поля, метеочутливі люди можуть відчувати легкий дискомфорт." },
      { range: "500–600", status: "Високий", color: "bg-storm-moderate", description: "Високошвидкісний потік. Ймовірність геомагнітних збурень, можливі збої GPS та головний біль." },
      { range: "600–800", status: "Дуже високий", color: "bg-storm-strong", description: "Дуже високошвидкісний потік. Високий ризик геомагнітної бурі, перебої радіозв'язку та навігації." },
      { range: "> 800", status: "Екстремальний", color: "bg-storm-severe", description: "Екстремальна швидкість сонячного вітру. Можливі сильні геомагнітні бурі, аварії енергомереж." },
    ],
    faqItems: [
      { q: "Що таке сонячний вітер?", a: "Сонячний вітер — це потік заряджених частинок (переважно протонів та електронів), що постійно виходить із зовнішньої атмосфери Сонця (корони). Його швидкість зазвичай становить 300–800 км/с." },
      { q: "Як швидкість сонячного вітру впливає на Землю?", a: "Різке зростання швидкості сонячного вітру може спровокувати геомагнітну бурю. Чим вища швидкість — тим більший тиск на магнітосферу Землі, що призводить до збурень магнітного поля." },
      { q: "Що таке густина сонячного вітру?", a: "Густина показує кількість частинок на кубічний сантиметр. Висока густина у поєднанні з високою швидкістю посилює вплив сонячного вітру на магнітосферу." },
      { q: "Як часто оновлюються дані?", a: "Дані сонячного вітру на нашому сайті оновлюються щохвилини на основі вимірювань супутника DSCOVR, розташованого в точці Лагранжа L1 між Сонцем та Землею." },
      { q: "Що таке Bz компонента?", a: "Bz — це вертикальна компонента міжпланетного магнітного поля (IMF). Від'ємне значення Bz (південне) полегшує проникнення сонячного вітру в магнітосферу, що збільшує ймовірність геомагнітної бурі." },
    ],
  },
  ru: {
    pageTitle: "Солнечный ветер онлайн в реальном времени — скорость и плотность",
    pageDescription:
      "Солнечный ветер сейчас в реальном времени. Скорость, плотность и график за последние 2 часа. Данные NOAA DSCOVR обновляются каждую минуту.",
    heroTitle: "Солнечный ветер сегодня",
    heroText:
      "Скорость и плотность солнечного ветра в реальном времени. График за последние 2 часа и межпланетное магнитное поле (IMF Bz). Данные спутника DSCOVR от NOAA SWPC.",
    currentAria: "Текущие значения солнечного ветра",
    speed: "Скорость",
    density: "Плотность",
    normal: "Нормальная",
    elevated: "Повышенная",
    stronglySouth: "Сильно южный",
    south: "Южный",
    weaklySouth: "Слабо южный",
    north: "Северный",
    speedChartAria: "График скорости и плотности солнечного ветра",
    speedChartTitle: "Скорость и плотность — последние 2 часа",
    bzChartAria: "График IMF Bz",
    bzChartTitle: "Межпланетное магнитное поле (Bz) — последние 2 часа",
    loading: "Загрузка...",
    bzNote:
      "Отрицательное значение Bz (южное) облегчает проникновение солнечного ветра в магнитосферу Земли. Bz ниже -5 нТ значительно повышает вероятность геомагнитной бури.",
    scaleAria: "Шкала скорости солнечного ветра",
    scaleTitle: "Шкала скорости солнечного ветра (км/с)",
    seoAria: "О солнечном ветре",
    seoHeading: "Что такое солнечный ветер и почему он важен?",
    seoText1:
      "Солнечный ветер — это непрерывный поток заряженных частиц (плазмы), исходящий из верхней атмосферы Солнца — короны. Его скорость варьируется от 300 до более 800 км/с, а плотность — от единиц до десятков частиц на кубический сантиметр. Солнечный ветер несет с собой межпланетное магнитное поле (IMF), которое взаимодействует с магнитосферой Земли.",
    seoText2:
      "Когда скорость солнечного ветра резко возрастает, это может вызвать геомагнитную бурю. Особенно важную роль играет компонента Bz межпланетного магнитного поля: когда Bz становится отрицательным (южным), магнитосфера становится более уязвимой. На этой странице вы найдете текущие значения скорости, плотности солнечного ветра и IMF Bz в реальном времени от спутника DSCOVR (NOAA).",
    faqAria: "Частые вопросы о солнечном ветре",
    faqTitle: "Частые вопросы",
    tooltipKyiv: "Киев",
    areaSpeed: "Скорость",
    areaDensity: "Плотность",
    speedLevels: [
      { range: "< 300", status: "Медленный", color: "bg-storm-quiet", description: "Медленный солнечный ветер. Спокойные геомагнитные условия, минимальное влияние на магнитосферу." },
      { range: "300–400", status: "Нормальный", color: "bg-storm-quiet", description: "Типичная скорость солнечного ветра. Стабильные условия, без влияния на технологии и самочувствие." },
      { range: "400–500", status: "Повышенный", color: "bg-storm-minor", description: "Повышенная скорость. Возможны небольшие возмущения магнитного поля, метеочувствительные люди могут ощущать легкий дискомфорт." },
      { range: "500–600", status: "Высокий", color: "bg-storm-moderate", description: "Высокоскоростной поток. Вероятны геомагнитные возмущения, возможны сбои GPS и головная боль." },
      { range: "600–800", status: "Очень высокий", color: "bg-storm-strong", description: "Очень высокоскоростной поток. Высокий риск геомагнитной бури, перебои радиосвязи и навигации." },
      { range: "> 800", status: "Экстремальный", color: "bg-storm-severe", description: "Экстремальная скорость солнечного ветра. Возможны сильные геомагнитные бури, аварии энергосетей." },
    ],
    faqItems: [
      { q: "Что такое солнечный ветер?", a: "Солнечный ветер — это поток заряженных частиц (преимущественно протонов и электронов), который постоянно выходит из внешней атмосферы Солнца (короны). Его скорость обычно составляет 300–800 км/с." },
      { q: "Как скорость солнечного ветра влияет на Землю?", a: "Резкий рост скорости солнечного ветра может спровоцировать геомагнитную бурю. Чем выше скорость, тем больше давление на магнитосферу Земли, что приводит к возмущениям магнитного поля." },
      { q: "Что такое плотность солнечного ветра?", a: "Плотность показывает количество частиц на кубический сантиметр. Высокая плотность в сочетании с высокой скоростью усиливает влияние солнечного ветра на магнитосферу." },
      { q: "Как часто обновляются данные?", a: "Данные солнечного ветра на нашем сайте обновляются каждую минуту на основе измерений спутника DSCOVR, расположенного в точке Лагранжа L1 между Солнцем и Землей." },
      { q: "Что такое компонента Bz?", a: "Bz — это вертикальная компонента межпланетного магнитного поля (IMF). Отрицательное значение Bz (южное) облегчает проникновение солнечного ветра в магнитосферу, что увеличивает вероятность геомагнитной бури." },
    ],
  },
  pl: {
    pageTitle: "Wiatr słoneczny online w czasie rzeczywistym — prędkość i gęstość",
    pageDescription:
      "Aktualny wiatr słoneczny w czasie rzeczywistym. Prędkość, gęstość i wykres z ostatnich 2 godzin na podstawie danych NOAA DSCOVR.",
    heroTitle: "Wiatr słoneczny dzisiaj",
    heroText:
      "Prędkość i gęstość wiatru słonecznego w czasie rzeczywistym. Wykres z ostatnich 2 godzin oraz międzyplanetarne pole magnetyczne IMF Bz.",
    currentAria: "Aktualne wartości wiatru słonecznego",
    speed: "Prędkość",
    density: "Gęstość",
    normal: "Normalna",
    elevated: "Podwyższona",
    stronglySouth: "Silnie południowe",
    south: "Południowe",
    weaklySouth: "Lekko południowe",
    north: "Północne",
    speedChartAria: "Wykres prędkości i gęstości wiatru słonecznego",
    speedChartTitle: "Prędkość i gęstość — ostatnie 2 godziny",
    bzChartAria: "Wykres IMF Bz",
    bzChartTitle: "Międzyplanetarne pole magnetyczne (Bz) — ostatnie 2 godziny",
    loading: "Ładowanie...",
    bzNote:
      "Ujemna wartość Bz ułatwia przenikanie wiatru słonecznego do magnetosfery Ziemi. Gdy Bz spada poniżej -5 nT, ryzyko burzy geomagnetycznej wyraźnie rośnie.",
    scaleAria: "Skala prędkości wiatru słonecznego",
    scaleTitle: "Skala prędkości wiatru słonecznego (km/s)",
    seoAria: "O wietrze słonecznym",
    seoHeading: "Czym jest wiatr słoneczny i dlaczego ma znaczenie?",
    seoText1:
      "Wiatr słoneczny to stały strumień naładowanych cząstek wypływających z korony słonecznej. Jego prędkość zwykle mieści się w zakresie od 300 do ponad 800 km/s, a gęstość może szybko się zmieniać.",
    seoText2:
      "Gdy prędkość i gęstość wiatru słonecznego rosną, zwiększa się nacisk na magnetosferę Ziemi. Szczególne znaczenie ma składowa Bz, ponieważ ujemne wartości zwiększają prawdopodobieństwo zaburzeń geomagnetycznych.",
    faqAria: "Najczęstsze pytania o wiatr słoneczny",
    faqTitle: "Najczęstsze pytania",
    tooltipKyiv: "czas lokalny",
    areaSpeed: "Prędkość",
    areaDensity: "Gęstość",
    speedLevels: [
      { range: "< 300", status: "Powolny", color: "bg-storm-quiet", description: "Powolny wiatr słoneczny, zwykle bez istotnego wpływu na magnetosferę." },
      { range: "300–400", status: "Normalny", color: "bg-storm-quiet", description: "Typowa prędkość wiatru słonecznego i spokojne warunki geomagnetyczne." },
      { range: "400–500", status: "Podwyższony", color: "bg-storm-minor", description: "Podwyższona prędkość może sprzyjać lekkim zaburzeniom geomagnetycznym." },
      { range: "500–600", status: "Wysoki", color: "bg-storm-moderate", description: "Szybszy strumień zwiększa ryzyko bardziej odczuwalnych zaburzeń." },
      { range: "600–800", status: "Bardzo wysoki", color: "bg-storm-strong", description: "Bardzo szybki wiatr słoneczny może prowadzić do silniejszych burz magnetycznych." },
      { range: "> 800", status: "Ekstremalny", color: "bg-storm-severe", description: "Ekstremalnie szybki strumień o dużym potencjale zaburzeń geomagnetycznych." },
    ],
    faqItems: [
      { q: "Czym jest wiatr słoneczny?", a: "To strumień naładowanych cząstek emitowanych przez Słońce. Gdy dociera do Ziemi z większą prędkością i gęstością, może nasilać aktywność geomagnetyczną." },
      { q: "Jak prędkość wiatru słonecznego wpływa na Ziemię?", a: "Wyższa prędkość oznacza silniejsze oddziaływanie na magnetosferę. W połączeniu z niekorzystnym polem magnetycznym może prowadzić do burz geomagnetycznych." },
      { q: "Czym jest gęstość wiatru słonecznego?", a: "Gęstość pokazuje, ile cząstek znajduje się w jednostce objętości. Wysoka gęstość wraz z dużą prędkością zwykle zwiększa wpływ na magnetosferę." },
      { q: "Jak często aktualizowane są dane?", a: "Dane pochodzą z pomiarów satelity DSCOVR i są regularnie odświeżane, dzięki czemu można śledzić zmiany niemal w czasie rzeczywistym." },
      { q: "Co oznacza składowa Bz?", a: "Bz to część międzyplanetarnego pola magnetycznego. Ujemny Bz zwiększa szansę, że wiatr słoneczny skuteczniej zaburzy pole magnetyczne Ziemi." },
    ],
  },
} as const;

const todayStr = (localeTag: string) =>
  new Date().toLocaleDateString(localeTag, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Kyiv",
  });

const toKyivTime = (utc: string, localeTag: string) => {
  const d = new Date(utc.includes("T") ? utc : utc.replace(" ", "T") + "Z");
  return d.toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" });
};

const getSpeedColor = (speed: number) => {
  if (speed >= 800) return "text-storm-severe";
  if (speed >= 600) return "text-storm-strong";
  if (speed >= 500) return "text-storm-moderate";
  if (speed >= 400) return "text-storm-minor";
  return "text-storm-quiet";
};

const getSpeedStatus = (speed: number, locale: SiteLocale) => {
  const levels = copy[locale];
  if (speed >= 800) return levels.speedLevels[5].status;
  if (speed >= 600) return levels.speedLevels[4].status;
  if (speed >= 500) return levels.speedLevels[3].status;
  if (speed >= 400) return levels.speedLevels[2].status;
  if (speed >= 300) return levels.speedLevels[1].status;
  return levels.speedLevels[0].status;
};

const CustomTooltip = ({ active, payload, label, locale = "uk" }: any) => {
  if (!active || !payload) return null;
  const t = copy[locale as SiteLocale];
  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-lg">
      <p className="mb-1 font-mono text-xs text-muted-foreground">{label} {t.tooltipKyiv}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="font-mono text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value} {entry.name === t.areaSpeed ? "км/с" : entry.name === t.areaDensity ? "p/см³" : "нТ"}
        </p>
      ))}
    </div>
  );
};

const SolarWind = ({ locale = "uk" }: { locale?: LegacyLocale }) => {
  const t = copy[locale];
  const localeTag = locale === "ru" ? "ru-RU" : locale === "pl" ? "pl-PL" : "uk-UA";
  const today = todayStr(localeTag);

  usePageMeta(
    t.pageTitle,
    t.pageDescription,
    "/solar-wind"
  );

  const { data: windData, isLoading: windLoading } = useSolarWind();
  const { data: magData, isLoading: magLoading } = useMagData();

  const latestWind = windData?.length ? windData[windData.length - 1] : null;
  const latestMag = magData?.length ? magData[magData.length - 1] : null;

  const speedChartData = (windData || [])
    .filter((_, i) => i % 3 === 0)
    .map((d) => ({
      time: toKyivTime(d.time_tag, localeTag),
      speed: d.speed,
      density: d.density,
    }));

  const magChartData = (magData || [])
    .filter((_, i) => i % 3 === 0)
    .map((d) => ({
      time: toKyivTime(d.time_tag, localeTag),
      bz: d.bz,
      bt: d.bt,
    }));

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <main className="mx-auto max-w-5xl space-y-8 p-6" role="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />

        {/* Hero */}
        <header className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            {t.heroTitle}, {today}
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            {t.heroText}
          </p>
        </header>

        {/* Current values */}
        <section className="grid gap-6 md:grid-cols-3" aria-label={t.currentAria}>
          <div className="rounded-lg border border-border/50 bg-card p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Wind className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t.speed}
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className={cn("font-mono text-5xl font-bold text-glow-cyan", getSpeedColor(latestWind?.speed ?? 0))}>
                  {latestWind?.speed?.toFixed(0) ?? "—"}
                </span>
                <span className="text-muted-foreground text-sm">км/с</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getSpeedStatus(latestWind?.speed ?? 0, locale)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t.density}
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-5xl font-bold text-foreground text-glow-cyan">
                  {latestWind?.density?.toFixed(1) ?? "—"}
                </span>
                <span className="text-muted-foreground text-sm">p/см³</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {(latestWind?.density ?? 0) > 10 ? t.elevated : t.normal}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                IMF Bz
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "font-mono text-5xl font-bold text-glow-cyan",
                  (latestMag?.bz ?? 0) < -5 ? "text-storm-severe" :
                  (latestMag?.bz ?? 0) < 0 ? "text-storm-moderate" : "text-storm-quiet"
                )}>
                  {latestMag?.bz?.toFixed(1) ?? "—"}
                </span>
                <span className="text-muted-foreground text-sm">нТ</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {(latestMag?.bz ?? 0) < -10 ? t.stronglySouth :
                 (latestMag?.bz ?? 0) < -5 ? t.south :
                 (latestMag?.bz ?? 0) < 0 ? t.weaklySouth : t.north}
              </p>
            </div>
          </div>
        </section>

        {/* Speed & Density Chart */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label={t.speedChartAria}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.speedChartTitle}
            </h2>
          </div>
          {windLoading ? (
            <div className="flex h-64 items-center justify-center">
              <span className="font-mono text-sm text-muted-foreground animate-pulse">{t.loading}</span>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={speedChartData}>
                  <defs>
                    <linearGradient id="swSpeedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="swDensityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    interval={Math.floor(speedChartData.length / 6)}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip content={<CustomTooltip locale={locale} />} />
                  <ReferenceLine y={500} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: "500 км/с", fontSize: 10, fill: "hsl(var(--destructive))" }} />
                  <Area type="monotone" dataKey="speed" name={t.areaSpeed} stroke="hsl(180, 100%, 50%)" fill="url(#swSpeedGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="density" name={t.areaDensity} stroke="hsl(35, 100%, 55%)" fill="url(#swDensityGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Bz Chart */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label={t.bzChartAria}>
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.bzChartTitle}
            </h2>
          </div>
          {magLoading ? (
            <div className="flex h-64 items-center justify-center">
              <span className="font-mono text-sm text-muted-foreground animate-pulse">{t.loading}</span>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={magChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    interval={Math.floor(magChartData.length / 6)}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip content={<CustomTooltip locale={locale} />} />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                  <ReferenceLine y={-5} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: "Bz -5", fontSize: 10, fill: "hsl(var(--destructive))" }} />
                  <Line type="monotone" dataKey="bz" name="Bz" stroke="hsl(280, 80%, 60%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="bt" name="Bt" stroke="hsl(var(--muted-foreground))" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/60 border-t border-border/30 pt-3">
            {t.bzNote}
          </p>
        </section>

        {/* Speed Levels Table */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label={t.scaleAria}>
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
            {t.scaleTitle}
          </h2>
          <div className="grid gap-2">
            {t.speedLevels.map((level) => (
              <div key={level.range} className="flex items-start gap-3 rounded-md border border-border/20 bg-muted/20 p-3">
                <span className={cn("mt-0.5 h-3 w-3 shrink-0 rounded-full", level.color)} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{level.range} км/с</span>
                    <span className="text-xs text-muted-foreground">— {level.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/80 mt-0.5">{level.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Text */}
        <section className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground/80 text-sm leading-relaxed" aria-label={t.seoAria}>
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            {t.seoHeading}
          </h2>
          <p>{t.seoText1}</p>
          <p>{t.seoText2}</p>
        </section>

        {/* FAQ */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label={t.faqAria}>
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.faqTitle}
            </h2>
          </div>
          <div className="space-y-4">
            {t.faqItems.map((item, i) => (
              <details key={i} className="group rounded-md border border-border/20 bg-muted/10">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-4 pb-3 text-sm text-muted-foreground/80 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SolarWind;
