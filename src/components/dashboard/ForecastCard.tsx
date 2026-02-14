import { cn } from "@/lib/utils";
import { useNoaaScales } from "@/hooks/useSpaceWeather";
import { CalendarDays } from "lucide-react";

const gLevelInfo = [
  { label: "Спокійно", color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/30" },
  { label: "Слабка буря", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
  { label: "Помірна буря", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30" },
  { label: "Сильна буря", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30" },
  { label: "Дуже сильна", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
  { label: "Екстремальна", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
];

const rLevelLabel = (s: number) => s === 0 ? "Немає" : `R${s}`;
const sLevelLabel = (s: number) => s === 0 ? "Немає" : `S${s}`;

const formatDate = (stamp: string) => {
  const d = new Date(stamp);
  return d.toLocaleDateString("uk-UA", { weekday: "short", day: "numeric", month: "short" });
};

export const ForecastCard = ({ className }: { className?: string }) => {
  const { data: scales, isLoading } = useNoaaScales();

  // keys "1", "2", "3" are forecast days
  const days = scales
    ? ["1", "2", "3"].map((key) => {
        const raw = (scales as any).__raw?.[key];
        if (!raw) return null;
        return {
          date: raw.DateStamp,
          g: parseInt(raw.G?.Scale ?? "0"),
          r: { minor: raw.R?.MinorProb, major: raw.R?.MajorProb },
          s: { prob: raw.S?.Prob },
        };
      }).filter(Boolean)
    : [];

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Прогноз на 3 дні
        </h3>
      </div>

      {isLoading ? (
        <div className="flex h-20 items-center justify-center">
          <span className="font-mono text-sm text-muted-foreground animate-pulse">Завантаження...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {days.map((day: any, i) => {
            const info = gLevelInfo[Math.min(day.g, 5)];
            return (
              <div
                key={i}
                className={cn(
                  "rounded-md border p-3 transition-colors",
                  info.border, info.bg
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDate(day.date)}
                  </span>
                  <span className={cn("font-bold text-sm", info.color)}>
                    G{day.g}
                  </span>
                </div>
                <p className={cn("text-sm font-medium mb-2", info.color)}>{info.label}</p>
                <div className="flex gap-4 text-[11px] text-muted-foreground/70 font-mono">
                  <span>Радіо: {day.r.minor ?? "—"}% / {day.r.major ?? "—"}%</span>
                  <span>Радіація: {day.s.prob ?? "—"}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 border-t border-border/30 pt-3 text-[11px] text-muted-foreground/60">
        Прогноз геомагнітної активності (G-шкала), ймовірності радіозатемнень та радіаційних бур від NOAA SWPC.
      </p>
    </div>
  );
};
