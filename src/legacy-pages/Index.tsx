"use client";

import { Wind, Gauge, Radio, Sun, Activity, Thermometer, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { StormStatusBanner } from "@/components/dashboard/StormStatusBanner";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { KpIndexGauge } from "@/components/dashboard/KpIndexGauge";
import { SolarWindChart } from "@/components/dashboard/SolarWindChart";
import { BzChart } from "@/components/dashboard/BzChart";
import { KpForecast3Day } from "@/components/dashboard/KpForecast3Day";
import { Forecast27Day } from "@/components/dashboard/Forecast27Day";
import { HumanImpact } from "@/components/dashboard/HumanImpact";
import { NewsWidget } from "@/components/dashboard/NewsWidget";
import { useKpIndex, useSolarWind, useMagData, useNoaaScales } from "@/hooks/useSpaceWeather";
import { CITIES } from "@/data/cities";
import { CITIES_PL } from "@/data/cities-pl";
import { CITIES_RU, getRuCitySlug } from "@/data/cities-ru";
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

const Index = ({ locale, messages }: { locale: SiteLocale; messages: Record<string, any> }) => {
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

  usePageMeta(t("index.title"), t("index.description"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: kpData } = useKpIndex();
  const { data: windData } = useSolarWind();
  const { data: magData } = useMagData();
  const { data: scales } = useNoaaScales();

  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const latestWind = windData?.length ? windData[windData.length - 1] : null;
  const latestMag = magData?.length ? magData[magData.length - 1] : null;
  const gLevel = scales?.g?.Scale ?? 0;

  const cityList = locale === "ru"
    ? CITIES.map((c) => ({ name: CITIES_RU[c.slug]?.name || c.name, slug: getRuCitySlug(c) }))
    : locale === "pl"
      ? CITIES_PL.map((c) => ({ name: c.name, slug: c.slug }))
      : CITIES.map((c) => ({ name: c.name, slug: c.slug }));

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
            <StormStatusBanner />
            <HumanImpact />
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
          <KpForecast3Day />
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

      <section className="mx-auto max-w-7xl px-6 py-10" aria-label={t("index.citiesTitle")}>
        <h2 className="text-lg font-display font-semibold text-foreground/90 mb-5">{t("index.citiesTitle")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-3 text-sm">
          {cityList.map((city) => (
            <a key={city.slug} href={`${langPrefix}/city/${city.slug}`} className="text-primary hover:underline whitespace-nowrap">
              {t("index.citiesLink")} <span className="font-semibold">{city.name}</span>
            </a>
          ))}
        </div>
        {locale !== "pl" ? (
          <div className="mt-6">
            <a
              href={`${langPrefix}/cities`}
              className="inline-flex items-center rounded-full border border-border/60 bg-card/60 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card"
            >
              {t("index.citiesMore")}
            </a>
          </div>
        ) : null}
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
