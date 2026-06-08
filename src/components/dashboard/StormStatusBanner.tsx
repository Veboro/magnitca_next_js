import { AlertTriangle, Zap, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNoaaScales, useKpIndex, type KpEntry, type NoaaScales } from "@/hooks/useSpaceWeather";
import { useKpForecast, type KpForecastEntry } from "@/hooks/useKpForecast";
import { StormFeelingPoll } from "@/components/dashboard/StormFeelingPoll";
import type { SiteLocale } from "@/lib/locale";

const getEffectiveLevel = (gLevel: number, kp: number): number => {
  const kpLevel = kp < 4 ? 0 : kp < 5 ? 1 : kp < 6 ? 2 : kp < 7 ? 3 : kp < 8 ? 4 : 5;
  return Math.max(gLevel, kpLevel);
};

const levelColors: Record<number, string> = {
  0: "hsl(145, 80%, 45%)",
  1: "hsl(55, 90%, 50%)",
  2: "hsl(35, 100%, 55%)",
  3: "hsl(15, 90%, 50%)",
  4: "hsl(0, 80%, 55%)",
  5: "hsl(0, 80%, 55%)",
};

const getBadgeTone = (level: number) => {
  if (level >= 3) {
    return {
      bg: "hsl(0, 72%, 91%)",
      border: "hsl(0, 78%, 48%)",
      shadow: "hsl(0, 78%, 48%, 0.22)",
    };
  }

  if (level >= 1) {
    return {
      bg: "hsl(45, 96%, 88%)",
      border: "hsl(40, 96%, 48%)",
      shadow: "hsl(40, 96%, 48%, 0.22)",
    };
  }

  return {
    bg: "hsl(145, 64%, 90%)",
    border: "hsl(145, 72%, 36%)",
    shadow: "hsl(145, 72%, 36%, 0.2)",
  };
};

interface StormStatusBannerProps {
  initialKp?: KpEntry[] | null;
  initialScales?: NoaaScales | null;
  initialForecast?: KpForecastEntry[] | null;
}

export const StormStatusBanner = ({ initialKp, initialScales, initialForecast }: StormStatusBannerProps) => {
  const { t, i18n } = useTranslation();
  const siteLocale: SiteLocale =
    i18n.language === "ru" || i18n.language === "pl" || i18n.language === "ro" || i18n.language === "hu" || i18n.language === "en"
      ? i18n.language
      : "uk";
  const showTelegramCta = siteLocale === "uk" || siteLocale === "ru";
  const locale =
    siteLocale === "ru"
      ? "ru-RU"
      : siteLocale === "pl"
        ? "pl-PL"
        : siteLocale === "ro"
          ? "ro-MD"
          : siteLocale === "hu"
            ? "hu-HU"
            : siteLocale === "en"
              ? "en-US"
              : "uk-UA";
  const { data: scales } = useNoaaScales(initialScales ?? undefined);
  const { data: kpData } = useKpIndex(initialKp ?? undefined);
  const { data: forecast = [] } = useKpForecast(initialForecast ?? undefined);

  const gLevel = scales?.g?.Scale ?? 0;
  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;

  const now = new Date();
  const kyivDate = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Kyiv" }));
  const todayStr = `${kyivDate.getFullYear()}-${String(kyivDate.getMonth() + 1).padStart(2, "0")}-${String(kyivDate.getDate()).padStart(2, "0")}`;

  const todayAndNext = forecast.filter((e) => {
    const tag = e.time_tag.slice(0, 10);
    const t2 = new Date(e.time_tag);
    return tag === todayStr || (t2 >= now && t2 <= new Date(now.getTime() + 24 * 60 * 60 * 1000));
  });
  const todayEntries = forecast.filter((e) => e.time_tag.slice(0, 10) === todayStr);
  const todayMaxForecastKp = todayEntries.reduce((max, entry) => Math.max(max, entry.kp), 0);
  const currentEffectiveLevel = getEffectiveLevel(gLevel, latestKp);
  const forecastEffectiveLevel = getEffectiveLevel(0, todayMaxForecastKp);
  const effectiveLevel = Math.max(currentEffectiveLevel, forecastEffectiveLevel);
  const isForecastDriven = forecastEffectiveLevel > currentEffectiveLevel;
  const color = levelColors[effectiveLevel] || levelColors[0];
  const badgeTone = getBadgeTone(effectiveLevel);
  const badgeMeta = isForecastDriven
    ? `Kp ${todayMaxForecastKp.toFixed(1)}`
    : `R${scales?.r?.Scale ?? 0} S${scales?.s?.Scale ?? 0} G${gLevel}`;

  const levelLabel = t(`storm.level${effectiveLevel}`);
  const levelDesc = t(`storm.desc${effectiveLevel}`);
  const heroBg = "/hero-bg.jpg";
  const ukraineOutline = i18n.language === "pl" ? undefined : "/ukraine-outline.png";

  return (
    <div className="official-storm-panel relative overflow-hidden rounded-lg border border-glow-cyan">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${heroBg})` }} />
      {ukraineOutline && (
        <div className="absolute inset-0 bg-contain bg-no-repeat bg-right-bottom opacity-15 mix-blend-screen" style={{ backgroundImage: `url(${ukraineOutline})` }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary animate-pulse-glow" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {effectiveLevel > 0 ? t("storm.geoStorm") : t("storm.monitoring")}
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">{levelLabel}</h2>
            <p className="max-w-md text-sm text-muted-foreground">{levelDesc}</p>
          </div>
          <div
            className="hidden md:flex flex-col items-center justify-center rounded-full border border-primary/20 w-24 h-24 ml-6 flex-shrink-0 transition-colors duration-700"
            style={{ backgroundColor: badgeTone.bg, borderColor: badgeTone.border, boxShadow: `0 0 22px ${badgeTone.shadow}` }}
          >
            <AlertTriangle className="h-6 w-6 transition-colors duration-700" style={{ color }} />
            <p className="font-mono text-xs font-bold text-foreground mt-1">
              {effectiveLevel > 0 ? t("storm.active") : t("storm.normal")}
            </p>
            <p className="text-[10px] text-muted-foreground">{badgeMeta}</p>
          </div>
        </div>

        <div className="rounded-md border border-border/40 bg-background/40 p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("storm.todayForecast")}</p>
          {todayEntries.length > 0 && (
            <>
              <div className="mt-1 space-y-1.5 sm:hidden">
                {todayEntries.map((entry, i) => {
                  const hour = new Date(entry.time_tag).toLocaleString(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" });
                  const entryColor = levelColors[getEffectiveLevel(0, entry.kp)] || levelColors[0];
                  const barWidth = Math.max(12, (entry.kp / 9) * 100);
                  const isPast = new Date(entry.time_tag) < now;

                  return (
                    <div key={i} className={`flex items-center gap-2 ${isPast ? "opacity-50" : ""}`}>
                      <span className="w-11 shrink-0 text-[9px] font-mono text-muted-foreground">{hour}</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted/30">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${barWidth}%`, backgroundColor: entryColor }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-[9px] font-mono font-medium" style={{ color: entryColor }}>
                        {entry.kp.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div
                className="mt-1 hidden min-h-[74px] items-end gap-1 sm:grid"
                style={{ gridTemplateColumns: `repeat(${todayEntries.length}, minmax(0, 1fr))` }}
              >
                {todayEntries.map((entry, i) => {
                  const hour = new Date(entry.time_tag).toLocaleString(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" });
                  const entryColor = levelColors[getEffectiveLevel(0, entry.kp)] || levelColors[0];
                  const barHeight = Math.max(10, (entry.kp / 9) * 100);
                  const isPast = new Date(entry.time_tag) < now;

                  return (
                    <div key={i} className={`flex min-w-0 flex-col items-center gap-0.5 ${isPast ? "opacity-50" : ""}`}>
                      <span className="truncate text-[8px] font-mono font-medium leading-none" style={{ color: entryColor }}>{entry.kp.toFixed(1)}</span>
                      <div className="w-full overflow-hidden rounded-sm bg-muted/30" style={{ height: "40px" }}>
                        <div className="w-full rounded-sm transition-all duration-300" style={{ height: `${barHeight}%`, backgroundColor: entryColor, marginTop: "auto" }} />
                      </div>
                      <span className="w-full truncate text-center text-[8px] font-mono leading-none text-muted-foreground">{hour}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <StormFeelingPoll locale={siteLocale} kpNow={latestKp} kpTodayMax={todayMaxForecastKp} />

        {showTelegramCta && (
          <a
            href="https://t.me/+7UKzAK5ur8UxZmMy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            {t("storm.telegramCta")}
          </a>
        )}
      </div>
    </div>
  );
};
