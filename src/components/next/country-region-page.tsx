import Link from "next/link";
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Gauge, HelpCircle, Info, MapPin, ShieldAlert, Wind, Zap } from "lucide-react";
import { CityStormFeelingSummary } from "@/components/city/city-storm-feeling-summary";
import { StormFeelingPoll } from "@/components/dashboard/StormFeelingPoll";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import {
  getCountryRegionCities,
  getCountryRegionCityHref,
  type CountryRegionRoute,
} from "@/lib/country-region-routes";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";
import type { KpForecastEntry } from "@/hooks/useKpForecast";

const copy = {
  pl: {
    titlePrefix: "Burze magnetyczne w",
    today: "dzisiaj",
    intro:
      "Regionalna prognoza aktywności geomagnetycznej: aktualny Kp-index, wiatr słoneczny, Bz, prognoza na 3 dni oraz miasta w tym regionie.",
    pollTitle: "Jak czują się ludzie dzisiaj",
    currentStatus: "Aktualna sytuacja",
    impactTitle: "Wpływ na organizm",
    impactMagnetic: "Burze magnetyczne",
    impactWind: "Wiatr słoneczny",
    impactTotal: "Wpływ łączny",
    gLevel: "Poziom burzy G",
    kpToday: "Kp dzisiaj",
    wind: "Wiatr słoneczny",
    bz: "Bz (IMF)",
    forecastTitle: "Prognoza Kp na 3 dni",
    maxKp: "maks. Kp",
    cities: "Miasta w regionie",
    goToCity: "Przejdź do miasta",
    hintTitle: "Jak czytać prognozę",
    hintText:
      "Niższe wartości Kp zwykle są mało odczuwalne. Przy Kp około 4-5 osoby wrażliwe na pogodę mogą częściej zauważać zmęczenie, ból głowy lub gorszą koncentrację.",
    faqTitle: "Najczęstsze pytania",
    faqStormQuestion: "Czy dzisiaj jest burza magnetyczna w regionie?",
    faqPeakQuestion: "Kiedy w najbliższych dniach Kp może być najwyższy?",
    faqCitiesQuestion: "Gdzie sprawdzić dokładniejsze dane lokalne?",
    faqStormCalm: "Na ten moment prognoza nie wskazuje silnej burzy magnetycznej, ale warto obserwować Kp i wiatr słoneczny w ciągu dnia.",
    faqStormActive: "Tak, aktywność geomagnetyczna jest podwyższona lub zbliża się do poziomu burzy magnetycznej.",
    faqPeakPrefix: "Najwyższy prognozowany Kp w najbliższych 3 dniach to",
    faqPeakSuffix: "To najbardziej aktywny fragment krótkoterminowej prognozy.",
    faqCitiesPrefix: "Szczegółowe strony są dostępne dla miast:",
    calm: "Spokojnie",
    low: "Niska aktywność",
    moderate: "Umiarkowana burza",
    strong: "Silna burza",
    extreme: "Ekstremalna burza",
    regionNote: "{{title}} ({{country}}): prognoza dla regionu i miast dostępnych w katalogu Magnitca.",
    now: "teraz",
  },
  ro: {
    titlePrefix: "Furtuni magnetice în",
    today: "astăzi",
    intro:
      "Prognoză regională pentru activitatea geomagnetică: indice Kp actual, vânt solar, Bz, prognoza pe 3 zile și pagini locale pentru orașele din regiune.",
    pollTitle: "Cum se simt oamenii astăzi",
    currentStatus: "Situația actuală",
    impactTitle: "Influența asupra organismului",
    impactMagnetic: "Furtuni magnetice",
    impactWind: "Vânt solar",
    impactTotal: "Influență totală",
    gLevel: "Nivelul furtunii G",
    kpToday: "Kp astăzi",
    wind: "Vânt solar",
    bz: "Bz (IMF)",
    forecastTitle: "Prognoza Kp pe 3 zile",
    maxKp: "max. Kp",
    cities: "Orașe din regiune",
    goToCity: "Deschide orașul",
    hintTitle: "Cum se interpretează prognoza",
    hintText:
      "Valorile mici ale Kp sunt de obicei greu de observat. La Kp în jur de 4-5, persoanele meteosensibile pot resimți mai des oboseală, dureri de cap sau iritabilitate.",
    faqTitle: "Întrebări frecvente",
    faqStormQuestion: "Există furtună magnetică în regiune astăzi?",
    faqPeakQuestion: "Când poate fi cel mai ridicat Kp?",
    faqCitiesQuestion: "Unde pot vedea date locale mai detaliate?",
    faqStormCalm: "În acest moment, prognoza nu indică o furtună magnetică puternică, dar Kp și vântul solar se pot schimba pe parcursul zilei.",
    faqStormActive: "Da, activitatea geomagnetică este ridicată sau se apropie de pragul unei furtuni magnetice.",
    faqPeakPrefix: "Cel mai mare Kp prognozat pentru următoarele 3 zile este",
    faqPeakSuffix: "Acesta este intervalul cel mai activ din prognoza scurtă.",
    faqCitiesPrefix: "Pagini locale sunt disponibile pentru:",
    calm: "Liniște",
    low: "Activitate scăzută",
    moderate: "Furtună moderată",
    strong: "Furtună puternică",
    extreme: "Furtună extremă",
    regionNote: "{{title}} ({{country}}): prognoză pentru regiune și pentru orașele disponibile în catalogul Magnitca.",
    now: "acum",
  },
  hu: {
    titlePrefix: "Mágneses viharok",
    today: "ma",
    intro:
      "Regionális űridőjárási előrejelzés: aktuális Kp-index, napszél, Bz, 3 napos előrejelzés és a régió városainak helyi oldalai.",
    pollTitle: "Hogyan érzik magukat ma az emberek",
    currentStatus: "Aktuális helyzet",
    impactTitle: "Hatás a szervezetre",
    impactMagnetic: "Mágneses viharok",
    impactWind: "Napszél",
    impactTotal: "Összhatás",
    gLevel: "G vihar szint",
    kpToday: "Mai Kp",
    wind: "Napszél",
    bz: "Bz (IMF)",
    forecastTitle: "3 napos Kp-előrejelzés",
    maxKp: "max. Kp",
    cities: "Városok a régióban",
    goToCity: "Város megnyitása",
    hintTitle: "Hogyan olvasd az előrejelzést",
    hintText:
      "Az alacsony Kp-értékek általában kevésbé érezhetők. Kp 4-5 körül az időjárásra érzékeny emberek gyakrabban tapasztalhatnak fáradtságot, fejfájást vagy gyengébb koncentrációt.",
    faqTitle: "Gyakori kérdések",
    faqStormQuestion: "Van ma mágneses vihar a régióban?",
    faqPeakQuestion: "Mikor lehet a legmagasabb a Kp?",
    faqCitiesQuestion: "Hol láthatók részletesebb helyi adatok?",
    faqStormCalm: "Jelenleg az előrejelzés nem jelez erős mágneses vihart, de a Kp és a napszél napközben változhat.",
    faqStormActive: "Igen, a geomágneses aktivitás emelkedett vagy megközelíti a mágneses vihar szintjét.",
    faqPeakPrefix: "A következő 3 nap legmagasabb előrejelzett Kp-értéke",
    faqPeakSuffix: "Ez a rövid távú előrejelzés legaktívabb időszaka.",
    faqCitiesPrefix: "Részletes helyi oldalak ezekhez a városokhoz érhetők el:",
    calm: "Nyugodt",
    low: "Alacsony aktivitás",
    moderate: "Mérsékelt vihar",
    strong: "Erős vihar",
    extreme: "Extrém vihar",
    regionNote: "{{title}} ({{country}}): előrejelzés a régióra és a Magnitca katalógusában elérhető városokra.",
    now: "most",
  },
  bg: {
    titlePrefix: "Магнитни бури в",
    today: "днес",
    intro:
      "Регионална прогноза за космическото време: актуален Kp-индекс, слънчев вятър, Bz, прогноза за 3 дни и локални страници за градовете в региона.",
    pollTitle: "Как се чувстват хората днес",
    currentStatus: "Текуща ситуация",
    impactTitle: "Влияние върху организма",
    impactMagnetic: "Магнитни бури",
    impactWind: "Слънчев вятър",
    impactTotal: "Общо влияние",
    gLevel: "Ниво на буря G",
    kpToday: "Kp днес",
    wind: "Слънчев вятър",
    bz: "Bz (IMF)",
    forecastTitle: "Прогноза за Kp за 3 дни",
    maxKp: "макс. Kp",
    cities: "Градове в региона",
    goToCity: "Към града",
    hintTitle: "Как да четем прогнозата",
    hintText:
      "Ниските стойности на Kp обикновено се усещат слабо. При Kp около 4-5 чувствителните към времето хора може по-често да усещат умора, главоболие или по-слаба концентрация.",
    faqTitle: "Често задавани въпроси",
    faqStormQuestion: "Има ли магнитна буря в региона днес?",
    faqPeakQuestion: "Кога през следващите дни Kp може да е най-висок?",
    faqCitiesQuestion: "Къде да проверя по-точни локални данни?",
    faqStormCalm: "Към момента прогнозата не показва силна магнитна буря, но си струва да следите Kp и слънчевия вятър през деня.",
    faqStormActive: "Да, геомагнитната активност е повишена или се доближава до нивото на магнитна буря.",
    faqPeakPrefix: "Най-високата прогнозирана стойност на Kp за следващите 3 дни е",
    faqPeakSuffix: "Това е най-активният период от краткосрочната прогноза.",
    faqCitiesPrefix: "Подробни локални страници са налични за градовете:",
    calm: "Спокойно",
    low: "Ниска активност",
    moderate: "Умерена буря",
    strong: "Силна буря",
    extreme: "Екстремна буря",
    regionNote: "{{title}} ({{country}}): прогноза за региона и за градовете, налични в каталога на Magnitca.",
    now: "сега",
  },
} as const;

type RegionLocale = keyof typeof copy;

function getGScaleFromKp(kp: number) {
  if (kp < 4) return 0;
  if (kp < 5) return 1;
  if (kp < 6) return 2;
  if (kp < 7) return 3;
  if (kp < 8) return 4;
  return 5;
}

function getKpLabel(kp: number, locale: RegionLocale) {
  const t = copy[locale];
  if (kp <= 2) return t.calm;
  if (kp <= 3) return t.low;
  if (kp <= 5) return t.moderate;
  if (kp <= 7) return t.strong;
  return t.extreme;
}

function getKpToneClass(kp: number) {
  if (kp <= 2) return "text-emerald-500";
  if (kp <= 3) return "text-lime-500";
  if (kp <= 5) return "text-amber-500";
  if (kp <= 7) return "text-orange-500";
  return "text-rose-500";
}

function getKpBgClass(kp: number) {
  if (kp <= 2) return "bg-emerald-500";
  if (kp <= 3) return "bg-lime-500";
  if (kp <= 5) return "bg-amber-500";
  if (kp <= 7) return "bg-orange-500";
  return "bg-rose-500";
}

function getSurfaceClass(value: number) {
  if (value <= 2) return "border-emerald-500/30 bg-[radial-gradient(circle_at_18%_22%,rgba(16,185,129,0.22),transparent_38%),linear-gradient(135deg,rgba(16,185,129,0.10),rgba(16,185,129,0.03)_42%,rgba(255,255,255,0.01))]";
  if (value <= 3) return "border-lime-500/30 bg-[radial-gradient(circle_at_18%_22%,rgba(132,204,22,0.24),transparent_38%),linear-gradient(135deg,rgba(132,204,22,0.12),rgba(132,204,22,0.04)_42%,rgba(255,255,255,0.01))]";
  if (value <= 5) return "border-amber-500/30 bg-[radial-gradient(circle_at_18%_22%,rgba(245,158,11,0.24),transparent_38%),linear-gradient(135deg,rgba(245,158,11,0.13),rgba(245,158,11,0.05)_42%,rgba(255,255,255,0.01))]";
  if (value <= 7) return "border-orange-500/30 bg-[radial-gradient(circle_at_18%_22%,rgba(249,115,22,0.24),transparent_38%),linear-gradient(135deg,rgba(249,115,22,0.14),rgba(249,115,22,0.05)_42%,rgba(255,255,255,0.01))]";
  return "border-rose-500/35 bg-[radial-gradient(circle_at_18%_22%,rgba(244,63,94,0.24),transparent_38%),linear-gradient(135deg,rgba(244,63,94,0.14),rgba(244,63,94,0.05)_42%,rgba(255,255,255,0.01))]";
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

function getTodayKey(timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function aggregateForecastDays(items: KpForecastEntry[] | null, timeZone: string) {
  if (!items?.length) return [];

  const todayKey = getTodayKey(timeZone);
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

function formatShortDate(date: string, locale: RegionLocale) {
  const localeTag = locale === "pl" ? "pl-PL" : locale === "hu" ? "hu-HU" : locale === "bg" ? "bg-BG" : "ro-RO";
  return new Intl.DateTimeFormat(localeTag, {
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}

export async function CountryRegionPage({ region }: { region: CountryRegionRoute }) {
  const t = copy[region.locale];
  const cities = getCountryRegionCities(region);
  const primaryCity = cities[0];
  const timeZone = primaryCity?.timezone ?? (region.locale === "hu" ? "Europe/Budapest" : region.locale === "pl" ? "Europe/Warsaw" : region.locale === "bg" ? "Europe/Sofia" : "Europe/Bucharest");

  const { kpData, windData, magData, scales, forecast3Day } = await getHomePageWeatherData().catch(() => ({
    kpData: null,
    windData: null,
    magData: null,
    scales: null,
    forecast3Day: null,
  }));
  const currentKp = kpData?.length ? Number(kpData[kpData.length - 1]?.kp ?? 0) : 0;
  const currentWind = windData?.length ? Number(windData[windData.length - 1]?.speed ?? 0) : 0;
  const currentBz = magData?.length ? Number(magData[magData.length - 1]?.bz ?? 0) : 0;
  const currentGScale = Number(scales?.g?.Scale ?? 0);
  const forecastDays = aggregateForecastDays(forecast3Day, timeZone);
  const todayMaxKp = forecastDays[0]?.maxKp ?? currentKp;
  const statusKp = Math.max(currentKp, todayMaxKp);
  const effectiveGScale = Math.max(currentGScale, getGScaleFromKp(todayMaxKp));
  const magneticScore10 = getMagneticScore10(todayMaxKp);
  const windScore10 = getWindScore10(currentWind);
  const totalImpactScore10 = Math.min(10, Math.max(1, Math.round((magneticScore10 + windScore10) / 2)));
  const totalImpactColor = getImpactColor(totalImpactScore10);
  const peakForecastDay = forecastDays.reduce<{ date: string; maxKp: number } | null>((best, day) => {
    if (!best || day.maxKp > best.maxKp) return day;
    return best;
  }, null);

  const cityNames = cities.map((city) => city.name).join(", ");
  const faqItems = [
    {
      q: t.faqStormQuestion,
      a: todayMaxKp >= 5 ? t.faqStormActive : t.faqStormCalm,
    },
    {
      q: t.faqPeakQuestion,
      a: peakForecastDay
        ? `${t.faqPeakPrefix} ${peakForecastDay.maxKp.toFixed(1)} (${formatShortDate(peakForecastDay.date, region.locale)}). ${t.faqPeakSuffix}`
        : `${t.faqPeakPrefix} ${statusKp.toFixed(1)}.`,
    },
    {
      q: t.faqCitiesQuestion,
      a: `${t.faqCitiesPrefix} ${cityNames || region.title}.`,
    },
  ];

  const forecastWithTrend = forecastDays.map((day, index) => {
    const prev = forecastDays[index - 1];
    const delta = prev ? Math.round((day.maxKp - prev.maxKp) * 10) / 10 : 0;
    const trend = index === 0 ? "current" : delta > 0.2 ? "up" : delta < -0.2 ? "down" : "flat";
    return { ...day, delta, trend };
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="official-page-main">
        <div className="official-page-shell space-y-8">
          <header className="official-page-header space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <Link href={`/${region.locale}`} className="text-primary hover:underline">
                Magnitca
              </Link>
              <span>/</span>
              <span>{region.adminLabel}</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              {region.locale === "hu"
                ? `${t.titlePrefix} ${region.titleIn} ${t.today}`
                : `${t.titlePrefix} ${region.titleIn} ${t.today}`}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {t.intro}{" "}
              {t.regionNote.replace("{{title}}", region.title).replace("{{country}}", region.country)}
            </p>
          </header>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-stretch">
            <StormFeelingPoll
              locale={region.locale}
              kpNow={currentKp}
              kpTodayMax={todayMaxKp}
              className="lg:flex lg:items-center lg:[&>div]:w-full"
            />
            <CityStormFeelingSummary locale={region.locale} />
          </div>

          <div className="lg:hidden">
            <MobileAdsenseSlot />
          </div>

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
                    detail: `${Math.round(currentWind)} km/s`,
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
                <div className="space-y-3">
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
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border/50 bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Gauge className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.currentStatus}</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
              <div className={`rounded-lg border p-5 ${getSurfaceClass(statusKp)}`}>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <ShieldAlert className="h-4 w-4 text-primary" />
                  {t.gLevel}
                </div>
                <div className="mt-4 flex min-h-[110px] flex-col items-center justify-center text-center">
                  <p className={`font-mono text-5xl font-bold leading-none ${effectiveGScale > 0 ? "text-amber-500" : "text-foreground"}`}>
                    G{effectiveGScale}
                  </p>
                  <p className="mt-3 text-sm font-medium text-foreground">{getKpLabel(statusKp, region.locale)}</p>
                </div>
              </div>

              <div className={`rounded-lg border p-5 ${getSurfaceClass(statusKp)}`}>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <Activity className="h-4 w-4 text-primary" />
                  {t.kpToday}
                </div>
                <div className="mt-4 flex min-h-[110px] flex-col items-center justify-center text-center">
                  <p className={`font-mono text-5xl font-bold leading-none ${getKpToneClass(statusKp)}`}>{statusKp.toFixed(1)}</p>
                  <p className="mt-3 text-sm font-medium text-foreground">{getKpLabel(statusKp, region.locale)}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <Wind className="h-4 w-4 text-primary" />
                  {t.wind}
                </div>
                <p className="mt-2 font-mono text-2xl font-bold text-foreground">{Math.round(currentWind)}</p>
                <p className="mt-1 text-xs text-muted-foreground">km/s</p>
              </div>

              <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  {t.bz}
                </div>
                <p className={`mt-2 font-mono text-2xl font-bold ${currentBz < 0 ? "text-cyan-500" : "text-foreground"}`}>
                  {currentBz.toFixed(1)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">nT</p>
              </div>
            </div>
            </section>
          </section>

          <section className="rounded-lg border border-border/50 bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {region.title}: {t.forecastTitle}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {forecastWithTrend.map((day) => {
                const trendColor =
                  day.trend === "up"
                    ? "text-rose-500"
                    : day.trend === "down"
                      ? "text-emerald-500"
                      : "text-muted-foreground";

                return (
                  <div key={day.date} className="rounded-lg border border-border/40 bg-background/50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{formatShortDate(day.date, region.locale)}</p>
                        <p className={`mt-3 font-mono text-3xl font-bold ${getKpToneClass(day.maxKp)}`}>{day.maxKp.toFixed(1)}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{t.maxKp}</p>
                      </div>
                      <div className={`inline-flex items-center gap-1 rounded-full border border-border/40 bg-card px-2.5 py-1 text-xs font-medium ${trendColor}`}>
                        {day.trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : day.trend === "down" ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                        {day.trend === "current" ? t.now : `${day.delta > 0 ? "+" : ""}${day.delta.toFixed(1)}`}
                      </div>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-border/30">
                      <div className={`h-full rounded-full transition-all ${getKpBgClass(day.maxKp)}`} style={{ width: `${Math.min(100, Math.max(8, (day.maxKp / 9) * 100))}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-lg border border-border/40 bg-background/50 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{t.hintTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.hintText}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="lg:hidden">
            <MobileAdsenseSlot />
          </div>

          <section className="rounded-lg border border-border/50 bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.cities}</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3 xl:grid-cols-4">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={getCountryRegionCityHref(region, city)}
                  className="group inline-flex items-center justify-between gap-2 text-sm text-primary transition-colors hover:text-primary/80 hover:underline"
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="text-[11px] opacity-0 transition-opacity group-hover:opacity-100">{t.goToCity}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-border/50 bg-card p-6" aria-label={t.faqTitle}>
            <div className="mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.faqTitle}</h2>
            </div>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <details key={item.q} className="group rounded-md border border-border/20 bg-muted/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-foreground transition-colors hover:text-primary">
                    {item.q}
                    <span className="text-muted-foreground transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <p className="px-4 pb-3 text-sm leading-relaxed text-muted-foreground/80">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
