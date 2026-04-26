import Link from "next/link";
import { Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, Gauge, HelpCircle, Info, ShieldAlert, Wind, Zap } from "lucide-react";
import { ALL_UK_CITIES } from "@/data/cities";
import { getLocalizedCity, getRuCitySlug } from "@/data/cities-ru";
import { UKRAINE_REGION_GROUPS } from "@/data/ukraine-city-catalog";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";
import { fetchUhmcWarning, getUhmcRegionCode } from "@/lib/uhmc-warning";
import type { KpForecastEntry } from "@/hooks/useKpForecast";
import type { SiteLocale } from "@/lib/locale";

type OblastLocale = Extract<SiteLocale, "uk" | "ru">;

const copy = {
  uk: {
    title: "Магнітні бурі в",
    today: "сьогодні",
    heroText:
      "Прогноз магнітних бур для області на сьогодні та найближчі 3 дні. Тут зібрані поточний Kp-індекс, сонячний вітер, Bz і актуальні попередження УкрГМЦ.",
    currentStatus: "Поточна ситуація",
    currentGLevel: "G-рівень бурі",
    currentKp: "Поточний Kp індекс",
    currentWind: "Сонячний вітер",
    currentBz: "Bz (IMF)",
    noaaScales: "NOAA шкали",
    forecastTitle: "Прогноз Kp індексу на 3 дні",
    maxKp: "макс. Kp",
    impactHintTitle: "Як це може впливати на самопочуття",
    impactHintText:
      "Низькі значення Kp зазвичай не відчуваються. При Kp близько 4–5 метеочутливі люди можуть помічати втому, головний біль або дратівливість. Вищі значення частіше дають відчутний дискомфорт і потребують більш уважного режиму дня.",
    impactTitle: "Вплив на організм",
    impactMagnetic: "Магнітні бурі",
    impactWind: "Сонячний вітер",
    impactTotal: "Загальний вплив",
    telegramButton: "Підключити сповіщення в Telegram",
    warningTitle: "Попередження від гідрометцентру",
    warningNone: "Попереджень немає",
    warningSource: "Джерело: УкрГМЦ",
    popularCities: "Популярні міста області",
    allCities: "Усі міста області, які вже є на сайті",
    aboutTitle: "Що зараз із магнітними бурями в області",
    faqTitle: "Часті запитання",
    faq1: "Чи є магнітна буря в області сьогодні?",
    faq2: "Коли очікується найвищий Kp?",
    faq3: "У яких містах області можна подивитися детальніші дані?",
    faqA1Calm: "Зараз сильна магнітна буря по області не очікується. Поточний фон залишається відносно спокійним, без ознак вираженого геомагнітного шторму.",
    faqA1Storm: "Так, геомагнітна активність зараз підвищена. Поточні показники вже відповідають бурі або дуже близькі до цього рівня.",
    faqA2Prefix: "Найвищий прогнозований Kp у найближчі 3 дні —",
    faqA2Suffix: "Це найбільш напружений відрізок у короткому прогнозі.",
    faqA3Prefix: "На сторінці області вже доступні міста з нашого каталогу, зокрема:",
    faqA3Suffix: "Там можна подивитися локальні сторінки з детальнішими даними.",
    faqA4: "Чи є зараз офіційні попередження УкрГМЦ?",
    faqA4None: "Зараз активних попереджень від гідрометцентру для області не видно.",
    faqA4Active: "Так, для області є активне офіційне попередження. Воно показане у верхньому alert-блоці на сторінці.",
    calm: "Спокійно",
    low: "Низька активність",
    moderate: "Помірна буря",
    strong: "Сильна буря",
    extreme: "Екстремальна буря",
    pointsToCity: "Перейти до міста",
  },
  ru: {
    title: "Магнитные бури в",
    today: "сегодня",
    heroText:
      "Прогноз магнитных бурь для области на сегодня и ближайшие 3 дня. Здесь собраны текущий Kp-индекс, солнечный ветер, Bz и актуальные предупреждения УкрГМЦ.",
    currentStatus: "Текущая ситуация",
    currentGLevel: "G-уровень бури",
    currentKp: "Текущий Kp индекс",
    currentWind: "Солнечный ветер",
    currentBz: "Bz (IMF)",
    noaaScales: "Шкалы NOAA",
    forecastTitle: "Прогноз Kp индекса на 3 дня",
    maxKp: "макс. Kp",
    impactHintTitle: "Как это может влиять на самочувствие",
    impactHintText:
      "Низкие значения Kp обычно почти не ощущаются. При Kp около 4–5 метеочувствительные люди могут замечать усталость, головную боль или раздражительность. Более высокие значения чаще дают выраженный дискомфорт и требуют более спокойного режима дня.",
    impactTitle: "Влияние на организм",
    impactMagnetic: "Магнитные бури",
    impactWind: "Солнечный ветер",
    impactTotal: "Общее влияние",
    telegramButton: "Подключить уведомления в Telegram",
    warningTitle: "Предупреждение гидрометцентра",
    warningNone: "Предупреждений нет",
    warningSource: "Источник: УкрГМЦ",
    popularCities: "Популярные города области",
    allCities: "Все города области, которые уже есть на сайте",
    aboutTitle: "Что сейчас с магнитными бурями в области",
    faqTitle: "Частые вопросы",
    faq1: "Есть ли магнитная буря в области сегодня?",
    faq2: "Когда ожидается самый высокий Kp?",
    faq3: "В каких городах области можно посмотреть подробные данные?",
    faqA1Calm: "Сейчас сильная магнитная буря по области не ожидается. Фон остается относительно спокойным, без признаков выраженного геомагнитного шторма.",
    faqA1Storm: "Да, геомагнитная активность сейчас повышена. Текущие показатели уже соответствуют буре или очень близки к этому уровню.",
    faqA2Prefix: "Самый высокий прогнозируемый Kp в ближайшие 3 дня —",
    faqA2Suffix: "Это самый напряженный отрезок в краткосрочном прогнозе.",
    faqA3Prefix: "На странице области уже доступны города из нашего каталога, в том числе:",
    faqA3Suffix: "Там можно посмотреть локальные страницы с более подробными данными.",
    faqA4: "Есть ли сейчас официальные предупреждения УкрГМЦ?",
    faqA4None: "Сейчас активных предупреждений гидрометцентра для области не видно.",
    faqA4Active: "Да, для области есть активное официальное предупреждение. Оно показано в верхнем alert-блоке на странице.",
    calm: "Спокойно",
    low: "Низкая активность",
    moderate: "Умеренная буря",
    strong: "Сильная буря",
    extreme: "Экстремальная буря",
    pointsToCity: "Перейти к городу",
  },
} as const;

function toUkRegionGenitive(title: string) {
  const overrides: Record<string, string> = {
    "м. Київ": "Києві",
    "Автономна Республіка Крим": "Автономній Республіці Крим",
  };
  if (overrides[title]) return overrides[title];
  return title
    .replace("ька область", "ькій області")
    .replace("цька область", "цькій області")
    .replace("зька область", "зькій області")
    .replace("ська область", "ській області");
}

function toRuRegionPrepositional(title: string) {
  const overrides: Record<string, string> = {
    "г. Киев": "Киеве",
    "Автономная Республика Крым": "Автономной Республике Крым",
  };
  if (overrides[title]) return overrides[title];
  return title
    .replace("цкая область", "цкой области")
    .replace("ская область", "ской области");
}

function getKpLabel(kp: number, locale: OblastLocale) {
  const t = copy[locale];
  if (kp <= 2) return t.calm;
  if (kp <= 3) return t.low;
  if (kp <= 5) return t.moderate;
  if (kp <= 7) return t.strong;
  return t.extreme;
}

function getGScaleLabel(scale: number, locale: OblastLocale) {
  if (locale === "ru") {
    if (scale <= 0) return "Спокойно";
    if (scale === 1) return "Малая буря";
    if (scale === 2) return "Умеренная буря";
    if (scale === 3) return "Сильная буря";
    if (scale === 4) return "Очень сильная буря";
    return "Экстремальная буря";
  }

  if (scale <= 0) return "Спокійно";
  if (scale === 1) return "Мала буря";
  if (scale === 2) return "Помірна буря";
  if (scale === 3) return "Сильна буря";
  if (scale === 4) return "Дуже сильна буря";
  return "Екстремальна буря";
}

function getGScaleSurfaceClass(scale: number) {
  if (scale <= 0) {
    return "border-emerald-500/30 bg-[radial-gradient(circle_at_18%_22%,rgba(16,185,129,0.22),transparent_38%),linear-gradient(135deg,rgba(16,185,129,0.10),rgba(16,185,129,0.03)_42%,rgba(255,255,255,0.01))]";
  }
  if (scale === 1) {
    return "border-lime-500/30 bg-[radial-gradient(circle_at_18%_22%,rgba(132,204,22,0.24),transparent_38%),linear-gradient(135deg,rgba(132,204,22,0.12),rgba(132,204,22,0.04)_42%,rgba(255,255,255,0.01))]";
  }
  if (scale === 2) {
    return "border-amber-500/30 bg-[radial-gradient(circle_at_18%_22%,rgba(245,158,11,0.24),transparent_38%),linear-gradient(135deg,rgba(245,158,11,0.13),rgba(245,158,11,0.05)_42%,rgba(255,255,255,0.01))]";
  }
  if (scale === 3) {
    return "border-orange-500/30 bg-[radial-gradient(circle_at_18%_22%,rgba(249,115,22,0.24),transparent_38%),linear-gradient(135deg,rgba(249,115,22,0.14),rgba(249,115,22,0.05)_42%,rgba(255,255,255,0.01))]";
  }
  if (scale === 4) {
    return "border-rose-500/30 bg-[radial-gradient(circle_at_18%_22%,rgba(244,63,94,0.24),transparent_38%),linear-gradient(135deg,rgba(244,63,94,0.14),rgba(244,63,94,0.05)_42%,rgba(255,255,255,0.01))]";
  }
  return "border-red-500/35 bg-[radial-gradient(circle_at_18%_22%,rgba(239,68,68,0.26),transparent_38%),linear-gradient(135deg,rgba(239,68,68,0.16),rgba(239,68,68,0.06)_42%,rgba(255,255,255,0.01))]";
}

function getKpSurfaceClass(kp: number) {
  if (kp <= 2) {
    return "border-emerald-500/30 bg-[radial-gradient(circle_at_18%_22%,rgba(16,185,129,0.22),transparent_38%),linear-gradient(135deg,rgba(16,185,129,0.10),rgba(16,185,129,0.03)_42%,rgba(255,255,255,0.01))]";
  }
  if (kp <= 3) {
    return "border-lime-500/30 bg-[radial-gradient(circle_at_18%_22%,rgba(132,204,22,0.24),transparent_38%),linear-gradient(135deg,rgba(132,204,22,0.12),rgba(132,204,22,0.04)_42%,rgba(255,255,255,0.01))]";
  }
  if (kp <= 5) {
    return "border-amber-500/30 bg-[radial-gradient(circle_at_18%_22%,rgba(245,158,11,0.24),transparent_38%),linear-gradient(135deg,rgba(245,158,11,0.13),rgba(245,158,11,0.05)_42%,rgba(255,255,255,0.01))]";
  }
  if (kp <= 7) {
    return "border-orange-500/30 bg-[radial-gradient(circle_at_18%_22%,rgba(249,115,22,0.24),transparent_38()),linear-gradient(135deg,rgba(249,115,22,0.14),rgba(249,115,22,0.05)_42%,rgba(255,255,255,0.01))]";
  }
  return "border-rose-500/35 bg-[radial-gradient(circle_at_18%_22%,rgba(244,63,94,0.24),transparent_38%),linear-gradient(135deg,rgba(244,63,94,0.14),rgba(244,63,94,0.05)_42%,rgba(255,255,255,0.01))]";
}

function getKpToneClass(kp: number) {
  if (kp <= 2) return "text-emerald-400";
  if (kp <= 3) return "text-lime-400";
  if (kp <= 5) return "text-amber-400";
  if (kp <= 7) return "text-orange-400";
  return "text-rose-400";
}

function getKpBgClass(kp: number) {
  if (kp <= 2) return "bg-emerald-400";
  if (kp <= 3) return "bg-lime-400";
  if (kp <= 5) return "bg-amber-400";
  if (kp <= 7) return "bg-orange-400";
  return "bg-rose-400";
}

function getImpactColor(score10: number) {
  if (score10 <= 2) return "hsl(145, 80%, 45%)";
  if (score10 <= 4) return "hsl(100, 70%, 45%)";
  if (score10 <= 6) return "hsl(55, 90%, 50%)";
  if (score10 <= 8) return "hsl(35, 100%, 55%)";
  if (score10 <= 9) return "hsl(15, 90%, 50%)";
  return "hsl(0, 80%, 55%)";
}

function getMagneticScore10(kp: number) {
  return Math.min(10, Math.max(1, Math.round((Math.min(kp, 9) / 9) * 10)));
}

function getWindScore10(speed: number) {
  const normalized = Math.round((Math.max(300, Math.min(speed, 900)) - 300) / 60);
  return Math.min(10, Math.max(1, normalized));
}

function getKyivTodayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function aggregateForecastDays(items: KpForecastEntry[] | null) {
  if (!items?.length) return [];

  const todayKey = getKyivTodayKey();
  const byDate = new Map<string, number>();
  for (const item of items) {
    const date = item.time_tag?.slice(0, 10);
    if (!date || date < todayKey) continue;
    byDate.set(date, Math.max(byDate.get(date) ?? 0, Number(item.kp) || 0));
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 3)
    .map(([date, maxKp]) => ({ date, maxKp: Math.round(maxKp * 10) / 10 }));
}

function formatShortDate(date: string, locale: OblastLocale) {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "uk-UA", {
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}

function formatUpdatedAt(value: string | null, locale: OblastLocale) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export async function OblastPage({
  locale,
  regionKey,
}: {
  locale: OblastLocale;
  regionKey: string;
}) {
  const t = copy[locale];
  const region = UKRAINE_REGION_GROUPS.find((item) => item.key === regionKey);

  if (!region) {
    throw new Error(`Unknown region key: ${regionKey}`);
  }

  const cityMap = new Map(ALL_UK_CITIES.map((city) => [city.slug, city]));
  const cities = region.slugs
    .map((slug) => cityMap.get(slug))
    .filter((city): city is NonNullable<typeof city> => Boolean(city))
    .map((city) => {
      const localized = locale === "ru" ? getLocalizedCity(city, "ru") : city;
      return {
        slug: locale === "ru" ? getRuCitySlug(city) : city.slug,
        name: localized.name,
      };
    });

  const regionTitle = locale === "ru" ? region.titleRu : region.titleUk;
  const regionIn = locale === "ru" ? toRuRegionPrepositional(regionTitle) : toUkRegionGenitive(regionTitle);
  const [{ kpData, windData, magData, scales, forecast3Day }, warning] = await Promise.all([
    getHomePageWeatherData(),
    (async () => {
      const code = getUhmcRegionCode(regionKey);
      if (!code) return null;
      try {
        return await fetchUhmcWarning(code, locale);
      } catch {
        return null;
      }
    })(),
  ]);

  const currentKp = kpData?.length ? Number(kpData[kpData.length - 1]?.kp ?? 0) : 0;
  const currentWind = windData?.length ? Number(windData[windData.length - 1]?.speed ?? 0) : 0;
  const currentBz = magData?.length ? Number(magData[magData.length - 1]?.bz ?? 0) : 0;
  const currentGScale = Number(scales?.g?.Scale ?? 0);
  const forecastDays = aggregateForecastDays(forecast3Day);
  const todayMaxKp = forecastDays[0]?.maxKp ?? currentKp;
  const kpLabel = getKpLabel(currentKp, locale);
  const kpTone = getKpToneClass(todayMaxKp);
  const gScaleLabel = getGScaleLabel(currentGScale, locale);
  const magneticScore10 = getMagneticScore10(todayMaxKp);
  const windScore10 = getWindScore10(currentWind);
  const totalImpactScore10 = Math.min(10, Math.max(1, Math.round((magneticScore10 + windScore10) / 2)));
  const totalImpactColor = getImpactColor(totalImpactScore10);

  const overviewParagraphs =
    locale === "ru"
      ? [
          `Сейчас в ${regionIn} геомагнитная ситуация оценивается по общим данным космической погоды: текущему Kp-индексу, солнечному ветру и межпланетному магнитному полю. Это помогает быстро понять общий фон по области, а дальше перейти к нужному городу.`,
          `На странице собраны главные ориентиры по региону: короткий прогноз на 3 дня, предупреждения УкрГМЦ и ссылки на популярные города области, где можно посмотреть более локальные данные.`,
        ]
      : [
          `Зараз у ${regionIn} геомагнітна ситуація оцінюється за загальними даними космічної погоди: поточним Kp-індексом, сонячним вітром і міжпланетним магнітним полем. Це допомагає швидко зрозуміти загальний фон по області, а далі перейти до потрібного міста.`,
          `На сторінці зібрано головні орієнтири по регіону: короткий прогноз на 3 дні, попередження УкрГМЦ і посилання на популярні міста області, де можна подивитися більш локальні дані.`,
        ];

  const topCitiesList = cities
    .slice(0, 4)
    .map((city) => city.name)
    .join(locale === "ru" ? ", " : ", ");

  const peakForecastDay = forecastDays.reduce<{ date: string; maxKp: number } | null>((best, day) => {
    if (!best || day.maxKp > best.maxKp) return day;
    return best;
  }, null);

  const faqItems = [
    {
      q: t.faq1,
      a: todayMaxKp >= 5 ? t.faqA1Storm : t.faqA1Calm,
    },
    {
      q: t.faq2,
      a: peakForecastDay
        ? `${t.faqA2Prefix} ${peakForecastDay.maxKp.toFixed(1)} (${formatShortDate(peakForecastDay.date, locale)}). ${t.faqA2Suffix}`
        : locale === "ru"
          ? "Данных прогноза пока недостаточно, чтобы уверенно назвать пиковый день."
          : "Даних прогнозу поки недостатньо, щоб впевнено назвати піковий день.",
    },
    {
      q: t.faq3,
      a: `${t.faqA3Prefix} ${topCitiesList}. ${t.faqA3Suffix}`,
    },
    {
      q: t.faqA4,
      a: warning?.status === "active" ? t.faqA4Active : t.faqA4None,
    },
  ];

  const forecastWithTrend = forecastDays.map((day, index) => {
    const prev = forecastDays[index - 1];
    const delta = prev ? Math.round((day.maxKp - prev.maxKp) * 10) / 10 : 0;
    const trend =
      index === 0 ? "current" : delta > 0.2 ? "up" : delta < -0.2 ? "down" : "flat";

    return { ...day, delta, trend };
  });

  return (
    <div className="min-h-screen bg-background grid-bg">
      <main className="mx-auto max-w-6xl space-y-8 p-6">
        <header className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            {t.title} {regionIn} {t.today}
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">{t.heroText}</p>
        </header>

        <section className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.warningTitle}</span>
                  <span className="text-sm font-semibold text-foreground">{warning?.summary || t.warningNone}</span>
                  {warning?.details?.[0] && (
                    <span className="text-sm text-muted-foreground">{warning.details[0]}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pl-7 lg:pl-0">
              {warning?.updatedAt && (
                <span className="text-xs text-muted-foreground">{formatUpdatedAt(warning.updatedAt, locale)}</span>
              )}
              <a
                href={warning?.sourceUrl || "https://www.meteo.gov.ua/ua/Meteorolohichni-poperedzhennya"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
              >
                {t.warningSource}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.62fr_1.45fr]">
          <section className="flex h-full flex-col rounded-lg border border-border/50 bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.impactTitle}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: t.impactMagnetic,
                  score: magneticScore10,
                  detail: `Kp ${todayMaxKp.toFixed(1)}`,
                },
                {
                  label: t.impactWind,
                  score: windScore10,
                  detail: `${Math.round(currentWind)} км/с`,
                },
              ].map((item) => {
                const color = getImpactColor(item.score);
                return (
                  <div key={item.label} className="flex items-end gap-3">
                    <div className="grid h-40 w-6 min-w-6 grid-rows-10 gap-1 rounded-full border border-border/30 bg-muted/5 p-0.5">
                      {Array.from({ length: 10 }).map((_, index) => {
                        const filled = 9 - index < item.score;
                        return (
                          <div
                            key={index}
                            className="rounded-full"
                            style={{
                              backgroundColor: filled ? color : "rgba(255,255,255,0.045)",
                              opacity: filled ? 0.95 : 0.8,
                            }}
                          />
                        );
                      })}
                    </div>

                    <div className="min-w-0 space-y-1 pb-1">
                      <span className="block text-xs font-medium leading-4 text-foreground">{item.label}</span>
                      <div className="font-mono text-[1.7rem] font-bold leading-none tracking-[-0.04em]" style={{ color }}>
                        {item.score}/10
                      </div>
                      <span className="block text-[11px] leading-4 text-muted-foreground">{item.detail}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto border-t border-border/30 pt-4">
              <div className="flex flex-col gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{t.impactTotal}</span>
                  <div className="font-mono text-[1.9rem] font-bold leading-none tracking-[-0.04em]" style={{ color: totalImpactColor }}>
                    {totalImpactScore10}/10
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 10 }).map((_, index) => {
                    const filled = index < totalImpactScore10;
                    return (
                      <div
                        key={index}
                        className="h-2 flex-1 rounded-full"
                        style={{
                          backgroundColor: filled ? totalImpactColor : "rgba(255,255,255,0.06)",
                          opacity: filled ? 1 : 0.6,
                        }}
                      />
                    );
                  })}
                </div>
                <a
                  href="https://t.me/+7UKzAK5ur8UxZmMy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:border-primary/60 hover:bg-primary/15 hover:text-primary"
                >
                  {t.telegramButton}
                </a>
              </div>
            </div>
          </section>

          <div className="rounded-lg border border-border/50 bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.currentStatus}</h2>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className={`rounded-lg border p-5 ${getGScaleSurfaceClass(currentGScale)}`}>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <ShieldAlert className="h-4 w-4 text-primary" />
                    {t.currentGLevel}
                  </div>
                  <div className="mt-4 flex min-h-[110px] flex-col items-center justify-center text-center">
                    <div className="min-w-0">
                      <p className={`font-mono text-5xl font-bold leading-none ${currentGScale > 0 ? "text-amber-400" : "text-foreground"}`}>
                        G{currentGScale}
                      </p>
                      <p className="mt-3 text-sm font-medium text-foreground">{gScaleLabel}</p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg border p-5 ${getKpSurfaceClass(currentKp)}`}>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <Activity className="h-4 w-4 text-primary" />
                    {t.currentKp}
                  </div>
                  <div className="mt-4 flex min-h-[110px] flex-col items-center justify-center text-center">
                    <div className="min-w-0">
                      <p className={`font-mono text-5xl font-bold leading-none ${kpTone}`}>{currentKp.toFixed(1)}</p>
                      <p className="mt-3 text-sm font-medium text-foreground">{kpLabel}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <Wind className="h-4 w-4 text-primary" />
                    {t.currentWind}
                  </div>
                  <p className="mt-2 font-mono text-2xl font-bold text-foreground">{Math.round(currentWind)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">км/с</p>
                </div>

                <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <Zap className="h-4 w-4 text-primary" />
                    {t.currentBz}
                  </div>
                  <p className={`mt-2 font-mono text-2xl font-bold ${currentBz < 0 ? "text-cyan-400" : "text-foreground"}`}>
                    {currentBz.toFixed(1)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">нТ</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        <section className="rounded-lg border border-border/50 bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {regionTitle}: {t.forecastTitle}
            </h2>
          </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {forecastWithTrend.map((day) => {
                const barWidth = `${Math.min(100, Math.max(8, (day.maxKp / 9) * 100))}%`;
                const trendColor =
                  day.trend === "up"
                    ? "text-rose-400"
                    : day.trend === "down"
                      ? "text-emerald-400"
                      : "text-muted-foreground";

                return (
                  <div key={day.date} className="rounded-lg border border-border/40 bg-background/50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{formatShortDate(day.date, locale)}</p>
                        <p className={`mt-3 font-mono text-3xl font-bold ${getKpToneClass(day.maxKp)}`}>{day.maxKp.toFixed(1)}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{t.maxKp}</p>
                      </div>

                      <div className={`inline-flex items-center gap-1 rounded-full border border-border/40 bg-card px-2.5 py-1 text-xs font-medium ${trendColor}`}>
                        {day.trend === "up" ? (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        ) : day.trend === "down" ? (
                          <ArrowDownRight className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5" />
                        )}
                        {day.trend === "current"
                          ? locale === "ru"
                            ? "сейчас"
                            : "зараз"
                          : `${day.delta > 0 ? "+" : ""}${day.delta.toFixed(1)}`}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="h-2 overflow-hidden rounded-full bg-border/30">
                        <div
                          className={`h-full rounded-full transition-all ${getKpBgClass(day.maxKp)}`}
                          style={{ width: barWidth }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>0</span>
                        <span>4.5</span>
                        <span>9</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-lg border border-border/40 bg-background/50 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{t.impactHintTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.impactHintText}</p>
                </div>
              </div>
            </div>
        </section>

        <section className="rounded-lg border border-border/50 bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.popularCities}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3 xl:grid-cols-4">
            {cities.map((city) => (
              <Link
                key={`all-${city.slug}`}
                href={locale === "ru" ? `/ru/city/${city.slug}` : `/city/${city.slug}`}
                className="group inline-flex items-center justify-between gap-2 text-sm text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-[11px] opacity-0 transition-opacity group-hover:opacity-100">{t.pointsToCity}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label={t.faqTitle}>
          <div className="mb-4 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.faqTitle}
            </h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details key={item.q} className="group rounded-md border border-border/20 bg-muted/10">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-foreground transition-colors hover:text-primary">
                  {item.q}
                  <span className="text-muted-foreground transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="px-4 pb-3 text-sm leading-relaxed text-muted-foreground/80">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
