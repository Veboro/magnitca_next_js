import { useTranslation } from "react-i18next";
import { useSolarWind } from "@/hooks/useSpaceWeather";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";

export const SolarWindChart = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation();
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

  const chartData = (rawData || []).filter((_, i) => i % 3 === 0).map((d) => ({ time: toTime(d.time_tag), speed: d.speed, density: d.density }));

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
        <div className="flex h-[240px] items-center justify-center">
          <span className="font-mono text-sm text-muted-foreground animate-pulse-glow">{t("common.loading")}</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(35, 100%, 82%)" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(35, 100%, 82%)" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="densityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(35, 90%, 82%)" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(35, 90%, 82%)" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(200, 40%, 18%, 0.8)" />
            <XAxis dataKey="time" tick={{ fill: "hsl(36, 20%, 10%)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "hsl(36, 20%, 10%)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="speed" name={t("charts.speed")} stroke="hsl(35, 100%, 50%)" fill="url(#speedGrad)" fillOpacity={1} strokeWidth={2} />
            <Area type="monotone" dataKey="density" name={t("charts.density")} stroke="hsl(35, 100%, 55%)" fill="url(#densityGrad)" fillOpacity={1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/60 border-t border-border/30 pt-3">{t("charts.solarWindNote")}</p>
    </div>
  );
};
