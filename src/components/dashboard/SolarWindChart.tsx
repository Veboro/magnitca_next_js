import { useTranslation } from "react-i18next";
import { useSolarWind } from "@/hooks/useSpaceWeather";
import { useIsMobile } from "@/hooks/use-mobile";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";

export const SolarWindChart = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const chartHeight = isMobile ? 320 : 240;
  const tickFontSize = isMobile ? 14 : 11;
  const locale = i18n.language.startsWith("ru")
    ? "ru-RU"
    : i18n.language.startsWith("pl")
      ? "pl-PL"
      : i18n.language.startsWith("ro")
        ? "ro-MD"
        : i18n.language.startsWith("hu")
          ? "hu-HU"
          : i18n.language.startsWith("en")
            ? "en-US"
            : "uk-UA";
  const timeZone = i18n.language.startsWith("pl")
    ? "Europe/Warsaw"
    : i18n.language.startsWith("ro")
      ? "Europe/Chisinau"
      : i18n.language.startsWith("hu")
        ? "Europe/Budapest"
        : "Europe/Kyiv";
  const densityUnit = i18n.language.startsWith("uk") || i18n.language.startsWith("ru") ? "p/см³" : "p/cm³";
  const { data: rawData, isLoading } = useSolarWind();

  const toTime = (utc: string) => {
    const d = new Date(utc.includes("T") ? utc : utc.replace(" ", "T") + "Z");
    return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", timeZone });
  };

  // NOAA/DSCOVR marks missing samples with sentinels (e.g. -9999), which would
  // blow up the Y-axis and flatten the real data. Drop out-of-range values to null.
  const saneSpeed = (v: number) => (Number.isFinite(v) && v > 0 && v < 3000 ? v : null);
  const saneDensity = (v: number) => (Number.isFinite(v) && v >= 0 && v < 500 ? v : null);
  const chartData = (rawData || [])
    .filter((_, i) => i % 3 === 0)
    .map((d) => ({ time: toTime(d.time_tag), speed: saneSpeed(d.speed), density: saneDensity(d.density) }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="rounded-md border border-border bg-card p-3 shadow-lg">
        <p className="mb-1 font-mono text-xs text-muted-foreground">{label} {t("charts.kyiv")}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="font-mono text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value} {entry.name === t("charts.speed") ? t("common.kmPerSec") : densityUnit}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className={`rounded-lg border border-glow-cyan bg-card p-6 ${className || ""}`} role="img" aria-label={t("charts.solarWind2h")}>
      <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("charts.solarWind2h")}</h3>
      {isLoading ? (
        <div className="flex items-center justify-center" style={{ height: chartHeight }}>
          <span className="font-mono text-sm text-muted-foreground animate-pulse-glow">{t("common.loading")}</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -4, bottom: 4 }}>
            <defs>
              <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(32, 100%, 52%)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(32, 100%, 52%)" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="densityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(190, 72%, 42%)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="hsl(190, 72%, 42%)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 14%, 89%)" />
            <XAxis dataKey="time" tick={{ fill: "hsl(200, 12%, 34%)", fontSize: tickFontSize }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="speed" tick={{ fill: "hsl(32, 60%, 36%)", fontSize: tickFontSize }} tickLine={false} axisLine={false} width={40} />
            <YAxis yAxisId="density" orientation="right" tick={{ fill: "hsl(190, 45%, 32%)", fontSize: tickFontSize }} tickLine={false} axisLine={false} width={28} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Area yAxisId="speed" type="monotone" dataKey="speed" name={t("charts.speed")} stroke="hsl(32, 100%, 50%)" fill="url(#speedGrad)" fillOpacity={1} strokeWidth={2} connectNulls dot={false} />
            <Area yAxisId="density" type="monotone" dataKey="density" name={t("charts.density")} stroke="hsl(190, 72%, 40%)" fill="url(#densityGrad)" fillOpacity={1} strokeWidth={2} connectNulls dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/60 border-t border-border/30 pt-3">{t("charts.solarWindNote")}</p>
    </div>
  );
};
