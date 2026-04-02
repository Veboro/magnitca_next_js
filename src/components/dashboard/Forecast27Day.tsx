import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { useMemo } from "react";

const kpColor = (kp: number) => {
  if (kp >= 7) return "bg-storm-severe/15 text-storm-severe border-storm-severe/30";
  if (kp >= 5) return "bg-storm-strong/15 text-storm-strong border-storm-strong/30";
  if (kp >= 4) return "bg-storm-moderate/15 text-storm-moderate border-storm-moderate/30";
  if (kp >= 2) return "bg-storm-minor/15 text-storm-minor border-storm-minor/30";
  return "bg-storm-quiet/10 text-storm-quiet border-storm-quiet/20";
};

const kpDot = (kp: number) => {
  if (kp >= 7) return "bg-storm-severe";
  if (kp >= 5) return "bg-storm-strong";
  if (kp >= 4) return "bg-storm-moderate";
  if (kp >= 2) return "bg-storm-minor";
  return "bg-storm-quiet";
};

interface ForecastDay {
  date: string;
  kp: number;
}

const WEEKDAYS_UA = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

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

  // Group days into weeks (Mon-Sun rows) with leading empty cells
  const weeks = useMemo(() => {
    if (!days.length) return [];
    const rows: (ForecastDay | null)[][] = [];
    let currentWeek: (ForecastDay | null)[] = [];

    // First day — add leading empty cells to align to weekday
    const firstDate = new Date(days[0].date + "T00:00:00");
    const firstDow = (firstDate.getDay() + 6) % 7; // Mon=0
    for (let i = 0; i < firstDow; i++) currentWeek.push(null);

    for (const day of days) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        rows.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length) {
      while (currentWeek.length < 7) currentWeek.push(null);
      rows.push(currentWeek);
    }
    return rows;
  }, [days]);

  const todayStr = new Date().toISOString().slice(0, 10);

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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {WEEKDAYS_UA.map((wd) => (
                  <th key={wd} className="pb-2 text-center font-mono text-xs text-muted-foreground font-medium w-[14.28%]">
                    {wd}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, wi) => (
                <tr key={wi}>
                  {week.map((day, di) => (
                    <td key={di} className="p-0.5">
                      {day ? (
                        <div
                          className={cn(
                            "rounded-lg border p-2 text-center font-mono transition-colors",
                            kpColor(day.kp),
                            day.date === todayStr && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                          )}
                          title={`${new Date(day.date + "T00:00:00").toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}: Kp ${day.kp}`}
                        >
                          <div className="text-[10px] text-muted-foreground/60 leading-none mb-0.5">
                            {new Date(day.date + "T00:00:00").toLocaleDateString("uk-UA", { month: "short" }).replace(".", "")}
                          </div>
                          <div className="text-base font-bold leading-none">
                            {new Date(day.date + "T00:00:00").getDate()}
                          </div>
                          <div className="mt-1 flex items-center justify-center gap-1">
                            <span className={cn("h-1.5 w-1.5 rounded-full", kpDot(day.kp))} />
                            <span className="text-[10px] font-semibold">{day.kp}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 border-t border-border/30 pt-3 text-[11px] text-muted-foreground/60">
        27-денний прогноз Kp-індексу від NOAA SWPC. Точність знижується з кожним днем — використовуйте для загального планування.
      </p>
    </div>
  );
};
