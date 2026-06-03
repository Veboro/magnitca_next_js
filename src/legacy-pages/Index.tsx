"use client";

import { Wind, Gauge, Radio, Sun, Activity, Thermometer, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { StormStatusBanner } from "@/components/dashboard/StormStatusBanner";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { KpIndexGauge } from "@/components/dashboard/KpIndexGauge";
import { KpForecast3Day } from "@/components/dashboard/KpForecast3Day";
import { HumanImpact } from "@/components/dashboard/HumanImpact";
import { Forecast27Day } from "@/components/dashboard/Forecast27Day";
import { NewsWidget } from "@/components/dashboard/NewsWidget";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";

const SolarWindChart = dynamic(() => import("@/components/dashboard/SolarWindChart").then(m => ({ default: m.SolarWindChart })), { ssr: false });
const BzChart = dynamic(() => import("@/components/dashboard/BzChart").then(m => ({ default: m.BzChart })), { ssr: false });
import { useKpIndex, useSolarWind, useMagData, useNoaaScales } from "@/hooks/useSpaceWeather";
import type { KpEntry, SolarWindEntry, MagEntry, NoaaScales } from "@/hooks/useSpaceWeather";
import type { KpForecastEntry } from "@/hooks/useKpForecast";
import { CITIES } from "@/data/cities";
import { CITIES_MD, RO_COUNTRIES } from "@/data/cities-md";
import { CITIES_HU } from "@/data/cities-hu";
import { CITIES_PL } from "@/data/cities-pl";
import { CITIES_RU, getRuCitySlug } from "@/data/cities-ru";
import { getOblastRouteByKey, getOblastTitle, OBLAST_ROUTE_MAP } from "@/lib/oblast-routes";
import type { SiteLocale } from "@/lib/locale";

const getKpStatus = (kp: number) => {
  if (kp <= 2) return "quiet" as const;
  if (kp <= 3) return "minor" as const;
  if (kp <= 5) return "moderate" as const;
  if (kp <= 7) return "strong" as const;
  return "severe" as const;
};

function getByPath(source: Record<string, unknown>, path: string): string {
  let current: unknown = source;

  for (const segment of path.split(".")) {
    if (!current || typeof current !== "object" || !(segment in current)) {
      return path;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === "string" ? current : path;
}

interface IndexProps {
  locale: SiteLocale;
  messages: Record<string, unknown>;
  initialKp?: KpEntry[] | null;
  initialWind?: SolarWindEntry[] | null;
  initialMag?: MagEntry[] | null;
  initialScales?: NoaaScales | null;
  initialForecast3?: KpForecastEntry[] | null;
}

const Index = ({ locale, messages, initialKp, initialWind, initialMag, initialScales, initialForecast3 }: IndexProps) => {
  const t = (path: string, vars?: Record<string, string>) => {
    let value = getByPath(messages, path);

    if (typeof value !== "string") {
      return path;
    }

    if (vars) {
      for (const [key, replacement] of Object.entries(vars)) {
        value = value.replaceAll(`{{${key}}}`, replacement);
      }
    }

    return value;
  };

  const localeTag = locale === "ru" ? "ru-RU" : locale === "pl" ? "pl-PL" : locale === "ro" ? "ro-MD" : locale === "hu" ? "hu-HU" : "uk-UA";
  const REFRESH_INTERVAL = 60;
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const langPrefix = locale === "ru" ? "/ru" : locale === "pl" ? "/pl" : locale === "ro" ? "/ro" : locale === "hu" ? "/hu" : "";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: kpData } = useKpIndex(initialKp ?? undefined);
  const { data: windData } = useSolarWind(initialWind ?? undefined);
  const { data: magData } = useMagData(initialMag ?? undefined);
  const { data: scales } = useNoaaScales(initialScales ?? undefined);

  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const latestWind = windData?.length ? windData[windData.length - 1] : null;
  const latestMag = magData?.length ? magData[magData.length - 1] : null;
  const gLevel = scales?.g?.Scale ?? 0;

  const cityList: Array<{ name: string; slug: string; countrySlug?: string }> = locale === "ru"
    ? CITIES.map((c) => ({ name: CITIES_RU[c.slug]?.name || c.name, slug: getRuCitySlug(c) }))
      : locale === "pl"
        ? CITIES_PL.map((c) => ({ name: c.name, slug: c.slug }))
      : locale === "ro"
        ? CITIES_MD.map((c) => ({ name: c.name, slug: c.slug, countrySlug: c.countrySlug }))
      : locale === "hu"
        ? CITIES_HU.map((c) => ({ name: c.name, slug: c.slug }))
      : CITIES.map((c) => ({ name: c.name, slug: c.slug }));
  const roCountryCityGroups = locale === "ro"
    ? RO_COUNTRIES.map((country) => ({
        ...country,
        cities: cityList.filter((city) => city.countrySlug === country.slug),
      })).filter((country) => country.cities.length > 0)
    : [];
  const oblastList = OBLAST_ROUTE_MAP.map((route) => {
    const href =
      locale === "ru"
        ? `/ru/oblast/${route.slugRu}`
        : `/oblast/${route.slugUk}`;

    return {
      key: route.regionKey,
      href,
      name:
        locale === "ru"
          ? getOblastTitle("ru", route.regionKey) || route.regionKey
          : getOblastTitle("uk", route.regionKey) || route.regionKey,
    };
  });

  const todayFormatted = new Date().toLocaleDateString(localeTag, { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" });

  return (
    <div className="official-home min-h-screen">
      <main className="mx-auto max-w-[1180px] px-2 pb-6 pt-3 sm:px-6 lg:px-0" role="main">
        <div className="official-home-shell space-y-7 px-2 pb-4 pt-2 sm:px-6 sm:pb-6 sm:pt-3 lg:px-8 lg:pb-8 lg:pt-3">
          <h1 className="sr-only">{t("index.srTitle")}</h1>

          <section className="official-home-hero space-y-6 p-4 sm:p-5 lg:p-6" aria-label={t("index.stormStatus")}>
            <div className="official-home-title flex flex-col gap-4 border-b border-border/60 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{t("index.currentSituation")}</h2>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-storm-quiet animate-pulse-glow" />
                    <span className="font-mono text-xs text-muted-foreground">{t("index.live")}</span>
                  </span>
                </div>
                <span className="block font-mono text-sm text-muted-foreground">
                  {new Date().toLocaleDateString(localeTag, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" })}
                </span>
              </div>
              <span className="flex w-fit items-center gap-1.5 border border-border/70 bg-card px-3 py-2">
                <RefreshCw className="h-3 w-3 text-muted-foreground/70 transition-transform" style={{ animation: countdown <= 3 ? "spin 1s linear infinite" : "none" }} />
                <span className="font-mono text-[10px] text-muted-foreground/70">{countdown}{t("common.seconds")}</span>
                <span className="h-[3px] rounded-full bg-primary/50 transition-all duration-1000 ease-linear" style={{ width: `${(countdown / REFRESH_INTERVAL) * 40}px` }} />
              </span>
            </div>

            <div className="space-y-6 lg:hidden">
              <StormStatusBanner initialKp={initialKp} initialScales={initialScales} initialForecast={initialForecast3} />
              <MobileAdsenseSlot />
              <HumanImpact initialKp={initialKp} initialForecast={initialForecast3} />
            </div>
            <div className="hidden gap-6 lg:grid lg:grid-cols-2">
              <StormStatusBanner initialKp={initialKp} initialScales={initialScales} initialForecast={initialForecast3} />
              <HumanImpact initialKp={initialKp} initialForecast={initialForecast3} />
            </div>
          </section>

        <section aria-label={t("index.keyMetrics")}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <MetricCard icon={Gauge} title={t("metrics.kpIndex")} value={Math.round(latestKp)} status={getKpStatus(latestKp)} trendValue={latestKp > 4 ? t("metrics.rising") : t("metrics.stable")} trend="stable" tooltip={t("metrics.kpTooltip")} />
            <MetricCard icon={Wind} title={t("metrics.solarWind")} value={Math.round(latestWind?.speed || 0)} unit={t("common.kmPerSec")} status={latestWind && latestWind.speed > 500 ? "strong" : "quiet"} trendValue={latestWind && latestWind.speed > 500 ? t("metrics.highSpeed") : t("metrics.normal")} trend="stable" tooltip={t("metrics.windTooltip")} />
            <MetricCard icon={Radio} title={t("metrics.bz")} value={latestMag?.bz?.toFixed(1) || "—"} unit={t("common.nT")} status={latestMag && latestMag.bz < -10 ? "moderate" : "quiet"} trendValue={latestMag && latestMag.bz < 0 ? t("metrics.south") : t("metrics.north")} trend="stable" tooltip={t("metrics.bzTooltip")} />
            <MetricCard icon={Sun} title={t("metrics.rScale")} value={`R${scales?.r?.Scale ?? 0}`} status={scales && scales.r.Scale > 2 ? "strong" : "quiet"} trendValue={t("metrics.radio")} trend="stable" tooltip={t("metrics.rTooltip")} />
            <MetricCard icon={Thermometer} title={t("metrics.bt")} value={latestMag?.bt?.toFixed(1) || "—"} unit={t("common.nT")} status={latestMag && latestMag.bt > 15 ? "moderate" : "quiet"} trendValue={latestMag && latestMag.bt > 15 ? t("metrics.elevated") : t("metrics.normalAdj")} trend="stable" tooltip={t("metrics.btTooltip")} />
            <MetricCard icon={Activity} title={t("metrics.gScale")} value={`G${gLevel}`} status={gLevel > 2 ? "strong" : gLevel > 0 ? "moderate" : "quiet"} trendValue={gLevel > 0 ? t("metrics.storm") : t("metrics.calm")} trend="stable" tooltip={t("metrics.gTooltip")} />
          </div>
        </section>

        <div className="md:hidden">
          <MobileAdsenseSlot />
        </div>

        <section aria-label={t("index.forecast3day")}>
          <KpForecast3Day initialData={initialForecast3} />
        </section>

        <section aria-label={t("index.forecast27day")}>
          <Forecast27Day variant="home" />
        </section>

        <section aria-label={t("index.chartsSection")}>
          <div className="grid gap-6 lg:grid-cols-3">
            <KpIndexGauge className="lg:col-span-1" />
            <SolarWindChart className="lg:col-span-2" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <BzChart className="lg:col-span-2" />
            <NewsWidget className="lg:col-span-1" />
          </div>
        </section>
        </div>
      </main>

      <section
        className="mx-auto max-w-[1180px] px-2 pb-6 sm:px-6 lg:px-0"
        aria-label={
          locale === "pl"
            ? "Pogoda kosmiczna w miastach Polski"
            : locale === "ro"
              ? "Vreme spațială în orașele Moldovei și României"
            : locale === "hu"
              ? "Űridőjárás Magyarországon"
            : locale === "ru"
              ? "Космическая погода по областям Украины"
              : "Космічна погода по областях України"
        }
      >
        <div className="official-home-panel p-5 sm:p-6 lg:p-7">
          <h2 className="mb-5 border-b border-border/60 pb-3 text-lg font-display font-semibold text-foreground/90">
            {locale === "pl"
              ? "Pogoda kosmiczna w miastach Polski"
              : locale === "ro"
                ? "Vreme spațială în orașele Moldovei și României"
              : locale === "hu"
                ? "Űridőjárás Magyarországon"
              : locale === "ru"
                ? "Космическая погода по областям Украины"
                : "Космічна погода по областях України"}
          </h2>
          {locale === "ro" ? (
            <div className="space-y-8">
              {roCountryCityGroups.map((country) => (
                <div key={country.slug} className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
                    <h3 className="font-display text-base font-semibold text-foreground/90">{country.title}</h3>
                    <a
                      href={`/ro/country/${country.slug}`}
                      className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary hover:underline"
                    >
                      Vezi toate orașele
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {country.cities.map((item) => (
                      <a
                        key={item.slug}
                        href={`/ro/city/${item.slug}`}
                        className="whitespace-nowrap text-primary transition-colors hover:text-primary/80 hover:underline"
                      >
                        <span className="font-semibold">{item.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {(locale === "pl" || locale === "hu" ? cityList : oblastList).map((item) => (
                <a
                  key={locale === "pl" || locale === "hu" ? item.slug : item.key}
                  href={locale === "pl" ? `/pl/city/${item.slug}` : locale === "hu" ? `/hu/city/${item.slug}` : item.href}
                  className="whitespace-nowrap text-primary transition-colors hover:text-primary/80 hover:underline"
                >
                  <span className="font-semibold">{item.name}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-2 pb-10 sm:px-6 lg:px-0" aria-label={t("index.aboutService")}>
        <div className="official-home-panel prose prose-sm max-w-none space-y-4 p-5 text-sm leading-relaxed text-muted-foreground/80 sm:p-6 lg:p-7">
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            {t("index.seoTitle", { date: todayFormatted })}
          </h2>
          <p dangerouslySetInnerHTML={{ __html: t("index.seoText1") }} />
          <p dangerouslySetInnerHTML={{ __html: t("index.seoText2") }} />
          <p dangerouslySetInnerHTML={{ __html: t("index.seoText3") }} />
        </div>
      </section>
    </div>
  );
};

export default Index;
