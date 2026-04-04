import { useTranslation } from "react-i18next";
import { useSolarWind } from "@/hooks/useSpaceWeather";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";

export const SolarWindChart = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ru" ? "ru-RU" : "uk-UA";
  const { data: rawData, isLoading } = useSolarWind();

  const toTime = (utc: string) => {
    const d = new Date(utc.includes("T") ? utc : utc.replace(" ", "T") + "Z");
    return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" });
  };

  const chartData = (rawData || []).filter((_, i) => i % 3 === 0).map((d) => ({ time: toTime(d.time_tag), speed: d.speed, density: d.density }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="rounded-md border border-border bg-card p-3 shadow-lg">
        <p className="mb-1 font-mono text-xs text-muted-foreground">{label} {t("charts.kyiv")}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="font-mono text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value} {entry.name === t("charts.speed") ? t("common.kmPerSec") : "p/см³"}
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
                <stop offset="5%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="densityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(200, 40%, 18%, 0.8)" />
            <XAxis dataKey="time" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="speed" name={t("charts.speed")} stroke="hsl(180, 100%, 50%)" fill="url(#speedGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="density" name={t("charts.density")} stroke="hsl(35, 100%, 55%)" fill="url(#densityGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/60 border-t border-border/30 pt-3">{t("charts.solarWindNote")}</p>
    </div>
  );
};
