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

const SolarWindChart = dynamic(() => import("@/components/dashboard/SolarWindChart").then(m => ({ default: m.SolarWindChart })), { ssr: false });
const BzChart = dynamic(() => import("@/components/dashboard/BzChart").then(m => ({ default: m.BzChart })), { ssr: false });
import { useKpIndex, useSolarWind, useMagData, useNoaaScales } from "@/hooks/useSpaceWeather";
import type { KpEntry, SolarWindEntry, MagEntry, NoaaScales } from "@/hooks/useSpaceWeather";
import type { KpForecastEntry } from "@/hooks/useKpForecast";
import { CITIES } from "@/data/cities";
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

function getByPath(source: Record<string, any>, path: string): string {
  return path.split(".").reduce<any>((acc, segment) => acc?.[segment], source) ?? path;
}

interface IndexProps {
  locale: SiteLocale;
  messages: Record<string, any>;
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

  const localeTag = locale === "ru" ? "ru-RU" : locale === "pl" ? "pl-PL" : "uk-UA";
  const REFRESH_INTERVAL = 60;
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const langPrefix = locale === "ru" ? "/ru" : locale === "pl" ? "/pl" : "";

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

  const cityList = locale === "ru"
    ? CITIES.map((c) => ({ name: CITIES_RU[c.slug]?.name || c.name, slug: getRuCitySlug(c) }))
    : locale === "pl"
      ? CITIES_PL.map((c) => ({ name: c.name, slug: c.slug }))
      : CITIES.map((c) => ({ name: c.name, slug: c.slug }));
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
    <div className="min-h-screen bg-background grid-bg">
      <main className="mx-auto max-w-7xl space-y-6 p-6" role="main">
        <h1 className="sr-only">{t("index.srTitle")}</h1>

        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl font-bold text-foreground">{t("index.currentSituation")}</h2>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-storm-quiet animate-pulse-glow" />
            <span className="font-mono text-xs text-muted-foreground">{t("index.live")}</span>
          </span>
          <span className="font-mono text-sm text-muted-foreground">
            {new Date().toLocaleDateString(localeTag, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" })}
          </span>
          <span className="flex items-center gap-1.5 ml-auto">
            <RefreshCw className="h-3 w-3 text-muted-foreground/60 transition-transform" style={{ animation: countdown <= 3 ? "spin 1s linear infinite" : "none" }} />
            <span className="font-mono text-[10px] text-muted-foreground/60">{countdown}{t("common.seconds")}</span>
            <span className="h-[3px] rounded-full bg-primary/40 transition-all duration-1000 ease-linear" style={{ width: `${(countdown / REFRESH_INTERVAL) * 40}px` }} />
          </span>
        </div>

        <section aria-label={t("index.stormStatus")}>
          <div className="grid gap-6 lg:grid-cols-2">
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

        <section aria-label={t("index.forecast3day")}>
          <KpForecast3Day initialData={initialForecast3} />
        </section>

        <section aria-label={t("index.forecast27day")}>
          <Forecast27Day />
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
      </main>

      <section
        className="mx-auto max-w-7xl px-6 py-10"
        aria-label={locale === "ru" ? "Космическая погода по областям Украины" : "Космічна погода по областях України"}
      >
        <h2 className="mb-5 text-lg font-display font-semibold text-foreground/90">
          {locale === "ru" ? "Космическая погода по областям Украины" : "Космічна погода по областях України"}
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {oblastList.map((oblast) => (
            <a
              key={oblast.key}
              href={oblast.href}
              className="whitespace-nowrap text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              <span className="font-semibold">{oblast.name}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10" aria-label={t("index.aboutService")}>
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground/80 text-sm leading-relaxed">
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
