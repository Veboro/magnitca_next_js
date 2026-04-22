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

const groupFutureDays = (entries: KpForecastEntry[], locale: string) => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = tomorrow.toLocaleDateString("sv-SE", { timeZone: "Europe/Kyiv" });

  const groups = new Map<string, KpForecastEntry[]>();

  entries.forEach((entry) => {
    const date = new Date(entry.time_tag);
    const dayKey = date.toLocaleDateString("sv-SE", { timeZone: "Europe/Kyiv" });

    if (dayKey < tomorrowKey) return;

    const label = date.toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "Europe/Kyiv",
    });

    if (!groups.has(label)) {
      groups.set(label, []);
    }

    groups.get(label)!.push(entry);
  });

  return Array.from(groups.values()).slice(0, 3);
};

export const KpForecast3Day = ({ className, initialData }: { className?: string; initialData?: KpForecastEntry[] | null }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ru" ? "ru-RU" : i18n.language === "pl" ? "pl-PL" : "uk-UA";
  const { data: entries = [], isLoading } = useKpForecast(initialData ?? undefined);
  const days = groupFutureDays(entries, locale);
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
              <div key={dayIdx} className="rounded-lg border border-border/50 bg-card p-4">
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
                        <span className="font-mono text-[11px] text-muted-foreground w-10 shrink-0">{formatHour(entry.time_tag)}</span>
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
