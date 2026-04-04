import { useKpForecast, KpForecastEntry } from "@/hooks/useKpForecast";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

const kpBarColor = (kp: number) => {
  if (kp < 2) return "bg-green-500/60";
  if (kp < 4) return "bg-yellow-500";
  if (kp < 5) return "bg-orange-400";
  if (kp < 6) return "bg-orange-500";
  if (kp < 7) return "bg-red-500";
  return "bg-red-700";
};

const kpTextColor = (kp: number) => {
  if (kp < 4) return "text-foreground/80";
  if (kp < 5) return "text-yellow-400";
  if (kp < 6) return "text-orange-400";
  if (kp < 7) return "text-red-400";
  return "text-red-500";
};

const kpBadgeBg = (kp: number) => {
  if (kp < 4) return "bg-green-500/15 text-green-400 border-green-500/30";
  if (kp < 5) return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  if (kp < 6) return "bg-orange-500/15 text-orange-400 border-orange-500/30";
  return "bg-red-500/15 text-red-400 border-red-500/30";
};

const groupByDay = (entries: KpForecastEntry[], locale: string) => {
  const groups: Record<string, KpForecastEntry[]> = {};
  entries.forEach((e) => {
    const d = new Date(e.time_tag);
    const key = d.toLocaleDateString(locale, { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Europe/Kyiv" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });
  return Object.values(groups);
};

export const KpForecast3Day = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ru" ? "ru-RU" : "uk-UA";
  const { data: entries = [], isLoading } = useKpForecast();
  const allDays = groupByDay(entries, locale);
  const days = allDays.slice(-3);
  const MAX_KP = 9;

  const formatHour = (timeTag: string) => {
    const d = new Date(timeTag);
    return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" });
  };

  const formatDayHeader = (timeTag: string) => {
    const d = new Date(timeTag);
    return d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/Kyiv" });
  };

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-6", className)}>
      <div className="flex items-center gap-2 mb-5">
        <Info className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("forecast3day.title")}</h3>
      </div>

      {isLoading ? (
        <div className="flex h-24 items-center justify-center">
          <span className="font-mono text-sm text-muted-foreground animate-pulse">{t("common.loading")}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {days.map((dayEntries, dayIdx) => {
            const maxKp = Math.max(...dayEntries.map((e) => e.kp));
            return (
              <div key={dayIdx} className="rounded-lg border border-border/40 bg-background/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-medium text-foreground">{formatDayHeader(dayEntries[0].time_tag)}</span>
                  <span className={cn("text-[10px] font-bold font-mono px-2 py-0.5 rounded border", kpBadgeBg(maxKp))}>
                    {t("common.max")} Kp {maxKp.toFixed(1)}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {dayEntries.map((entry, i) => {
                    const barWidth = Math.max((entry.kp / MAX_KP) * 100, 3);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground/70 w-10 shrink-0">{formatHour(entry.time_tag)}</span>
                        <div className="flex-1 h-3 bg-muted/20 rounded-sm overflow-hidden">
                          <div className={cn("h-full rounded-sm transition-all", kpBarColor(entry.kp))} style={{ width: `${barWidth}%` }} />
                        </div>
                        <span className={cn("font-mono text-xs font-bold w-7 text-right shrink-0", kpTextColor(entry.kp))}>
                          {entry.kp.toFixed(entry.kp % 1 ? 1 : 0)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 border-t border-border/30 pt-3 text-[11px] text-muted-foreground/60">{t("forecast3day.note")}</p>
    </div>
  );
};
