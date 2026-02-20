import { useKpForecast, KpForecastEntry } from "@/hooks/useKpForecast";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const kpColor = (kp: number) => {
  if (kp < 4) return "bg-green-500";
  if (kp < 5) return "bg-yellow-500";
  if (kp < 6) return "bg-orange-500";
  if (kp < 7) return "bg-red-500";
  return "bg-red-700";
};

const kpTextColor = (kp: number) => {
  if (kp < 4) return "text-green-400";
  if (kp < 5) return "text-yellow-400";
  if (kp < 6) return "text-orange-400";
  if (kp < 7) return "text-red-400";
  return "text-red-500";
};

const gLevel = (kp: number) => {
  if (kp < 4) return { g: 0, label: "Спокійно" };
  if (kp < 5) return { g: 1, label: "Слабка буря" };
  if (kp < 6) return { g: 2, label: "Помірна буря" };
  if (kp < 7) return { g: 3, label: "Сильна буря" };
  if (kp < 8) return { g: 4, label: "Дуже сильна" };
  return { g: 5, label: "Екстремальна" };
};

const formatHour = (timeTag: string) => {
  const d = new Date(timeTag);
  return d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" });
};

const formatDayHeader = (timeTag: string) => {
  const d = new Date(timeTag);
  return d.toLocaleDateString("uk-UA", { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/Kyiv" });
};

const groupByDay = (entries: KpForecastEntry[]) => {
  const groups: Record<string, KpForecastEntry[]> = {};
  entries.forEach((e) => {
    const d = new Date(e.time_tag);
    const key = d.toLocaleDateString("uk-UA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Europe/Kyiv" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });
  return Object.values(groups);
};

export const KpForecast3Day = ({ className }: { className?: string }) => {
  const { data: entries = [], isLoading } = useKpForecast();

  const days = groupByDay(entries);

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-6", className)}>
      <div className="flex items-center gap-2 mb-5">
        <CalendarDays className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Погодинний прогноз Kp-індексу на 3 дні
        </h3>
      </div>

      {isLoading ? (
        <div className="flex h-24 items-center justify-center">
          <span className="font-mono text-sm text-muted-foreground animate-pulse">Завантаження...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {days.map((dayEntries, dayIdx) => {
            const maxKp = Math.max(...dayEntries.map((e) => e.kp));
            const dayLevel = gLevel(maxKp);

            return (
              <div key={dayIdx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-medium text-foreground">
                    {formatDayHeader(dayEntries[0].time_tag)}
                  </span>
                  <span className={cn("text-xs font-bold", kpTextColor(maxKp))}>
                    G{dayLevel.g} — {dayLevel.label}
                  </span>
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {dayEntries.map((entry, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 rounded-md border border-border/30 bg-background/50 py-1.5 px-0.5"
                    >
                      <span className="text-[10px] text-muted-foreground/70 font-mono">
                        {formatHour(entry.time_tag)}
                      </span>
                      <div
                        className={cn(
                          "w-full rounded-sm transition-all",
                          kpColor(entry.kp)
                        )}
                        style={{ height: `${Math.max(entry.kp * 4, 4)}px` }}
                      />
                      <span className={cn("text-xs font-bold font-mono", kpTextColor(entry.kp))}>
                        {entry.kp.toFixed(entry.kp % 1 ? 2 : 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 border-t border-border/30 pt-3 text-[11px] text-muted-foreground/60">
        3-годинний прогноз Kp-індексу від NOAA SWPC. Дані оновлюються що 5 хвилин.
      </p>
    </div>
  );
};
