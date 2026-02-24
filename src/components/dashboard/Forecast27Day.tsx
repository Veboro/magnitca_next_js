import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";

const kpColor = (kp: number) => {
  if (kp >= 7) return "bg-red-500/20 text-red-400 border-red-500/30";
  if (kp >= 5) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
  if (kp >= 4) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-green-500/20 text-green-400 border-green-500/30";
};

interface ForecastDay {
  date: string;
  kp: number;
}

export const Forecast27Day = ({ className }: { className?: string }) => {
  const { data: days = [], isLoading } = useQuery<ForecastDay[]>({
    queryKey: ["forecast-27day"],
    queryFn: async () => {
      const res = await fetch(
        "https://services.swpc.noaa.gov/text/27-day-outlook.txt"
      );
      const text = await res.text();
      const lines = text.split("\n");
      const result: ForecastDay[] = [];

      for (const line of lines) {
        const match = line.match(
          /^(\d{4})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\s+\d+\s+\d+\s+([\d.]+)/
        );
        if (match) {
          const [, year, mon, day, kp] = match;
          const monthMap: Record<string, string> = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04",
            May: "05", Jun: "06", Jul: "07", Aug: "08",
            Sep: "09", Oct: "10", Nov: "11", Dec: "12",
          };
          result.push({
            date: `${year}-${monthMap[mon]}-${day.padStart(2, "0")}`,
            kp: parseFloat(kp),
          });
        }
      }

      const today = new Date().toISOString().slice(0, 10);
      return result.filter((d) => d.date >= today);
    },
    refetchInterval: 600000,
    staleTime: 300000,
  });

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Прогноз Kp на 27 днів
        </h3>
      </div>

      {isLoading ? (
        <div className="flex h-20 items-center justify-center">
          <span className="font-mono text-sm text-muted-foreground animate-pulse">Завантаження...</span>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => {
            const d = new Date(day.date);
            const dayNum = d.getDate();
            const isToday = day.date === new Date().toISOString().slice(0, 10);
            return (
              <div
                key={day.date}
                className={cn(
                  "rounded-md border p-1.5 text-center text-[10px] font-mono transition-colors",
                  kpColor(day.kp),
                  isToday && "ring-1 ring-primary"
                )}
                title={`${day.date}: Kp ${day.kp}`}
              >
                <div className="text-muted-foreground/70">
                  {d.toLocaleDateString("uk-UA", { weekday: "narrow" })}
                </div>
                <div className="text-xs font-bold">{dayNum}</div>
                <div className="text-[9px] opacity-80">Kp {day.kp}</div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 border-t border-border/30 pt-3 text-[11px] text-muted-foreground/60">
        27-денний прогноз Kp-індексу від NOAA SWPC. Точність знижується з кожним днем — використовуйте для загального планування.
      </p>
    </div>
  );
};
