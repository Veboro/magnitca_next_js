import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { CalendarDays } from "lucide-react";
import { useMemo } from "react";
import { useKpForecast27Day } from "@/hooks/useKpForecast27Day";

type ForecastDay = { date: string; kp: number };

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

export const Forecast27Day = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ru" ? "ru-RU" : i18n.language === "pl" ? "pl-PL" : "uk-UA";
  const weekdays = [t("forecast27.mon"), t("forecast27.tue"), t("forecast27.wed"), t("forecast27.thu"), t("forecast27.fri"), t("forecast27.sat"), t("forecast27.sun")];
  const { data: days = [], isLoading } = useKpForecast27Day();

  const weeks = useMemo(() => {
    if (!days.length) return [];
    const rows: (ForecastDay | null)[][] = [];
    let currentWeek: (ForecastDay | null)[] = [];
    const firstDate = new Date(days[0].date + "T00:00:00");
    const firstDow = (firstDate.getDay() + 6) % 7;
    for (let i = 0; i < firstDow; i++) currentWeek.push(null);
    for (const day of days) {
      currentWeek.push(day);
      if (currentWeek.length === 7) { rows.push(currentWeek); currentWeek = []; }
    }
    if (currentWeek.length) { while (currentWeek.length < 7) currentWeek.push(null); rows.push(currentWeek); }
    return rows;
  }, [days]);

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("forecast27.title")}</h3>
      </div>

      {isLoading ? (
        <div className="flex h-20 items-center justify-center">
          <span className="font-mono text-sm text-muted-foreground animate-pulse">{t("common.loading")}</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {weekdays.map((wd) => (
                  <th key={wd} className="pb-2 text-center font-mono text-xs text-muted-foreground font-medium w-[14.28%]">{wd}</th>
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
                          className={cn("rounded-lg border p-2 text-center font-mono transition-colors", kpColor(day.kp), day.date === todayStr && "ring-2 ring-primary ring-offset-1 ring-offset-background")}
                          title={`${new Date(day.date + "T00:00:00").toLocaleDateString(locale, { day: "numeric", month: "short" })}: Kp ${day.kp}`}
                        >
                          <div className="text-[10px] text-muted-foreground/60 leading-none mb-0.5">
                            {new Date(day.date + "T00:00:00").toLocaleDateString(locale, { month: "short" }).replace(".", "")}
                          </div>
                          <div className="text-base font-bold leading-none">{new Date(day.date + "T00:00:00").getDate()}</div>
                          <div className="mt-1 flex items-center justify-center gap-1">
                            <span className={cn("h-1.5 w-1.5 rounded-full", kpDot(day.kp))} />
                            <span className="text-[10px] font-semibold">{day.kp}</span>
                          </div>
                        </div>
                      ) : (<div className="p-2" />)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 border-t border-border/30 pt-3 text-[11px] text-muted-foreground/60">{t("forecast27.note")}</p>
    </div>
  );
};
