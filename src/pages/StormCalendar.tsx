import { useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useStormCalendar, StormDay, StormLevel } from "@/hooks/useStormCalendar";
import { CalendarDays, Info } from "lucide-react";
import { uk } from "date-fns/locale";

const levelColors: Record<StormLevel, string> = {
  none: "",
  minor: "bg-storm-minor/20 text-storm-minor border border-storm-minor/40",
  moderate: "bg-storm-moderate/20 text-storm-moderate border border-storm-moderate/40",
  strong: "bg-storm-strong/20 text-storm-strong border border-storm-strong/40",
  severe: "bg-storm-severe/20 text-storm-severe border border-storm-severe/40 animate-pulse",
};

const levelLabels: Record<StormLevel, string> = {
  none: "Спокійно",
  minor: "Слабка буря (Kp4)",
  moderate: "Помірна буря (Kp5)",
  strong: "Сильна буря (Kp6-7)",
  severe: "Екстремальна буря (Kp8-9)",
};

const levelDotColors: Record<StormLevel, string> = {
  none: "bg-storm-quiet",
  minor: "bg-storm-minor",
  moderate: "bg-storm-moderate",
  strong: "bg-storm-strong",
  severe: "bg-storm-severe",
};

export default function StormCalendar() {
  useEffect(() => {
    const now = new Date();
    const monthName = now.toLocaleDateString("uk-UA", { month: "long", year: "numeric" });
    document.title = `Календар магнітних бур на ${monthName} — Магнітка`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", `Календар магнітних бур на ${monthName}. Дні з геомагнітними збуреннями позначені кольором за шкалою інтенсивності.`);
    }
  }, []);

  const { data: stormDays, isLoading } = useStormCalendar();

  const stormMap = useMemo(() => {
    const map = new Map<string, StormDay>();
    stormDays?.forEach((d) => map.set(d.date, d));
    return map;
  }, [stormDays]);

  // Dates grouped by level for modifiers
  const modifiers = useMemo(() => {
    const minor: Date[] = [];
    const moderate: Date[] = [];
    const strong: Date[] = [];
    const severe: Date[] = [];
    const forecast: Date[] = [];

    stormDays?.forEach((d) => {
      const date = new Date(d.date + "T00:00:00");
      if (d.isForecast) forecast.push(date);
      if (d.level === "minor") minor.push(date);
      else if (d.level === "moderate") moderate.push(date);
      else if (d.level === "strong") strong.push(date);
      else if (d.level === "severe") severe.push(date);
    });

    return { minor, moderate, strong, severe, forecast };
  }, [stormDays]);

  const modifiersStyles = {
    minor: {
      backgroundColor: "hsla(45, 93%, 47%, 0.15)",
      color: "hsl(45, 93%, 47%)",
      borderRadius: "6px",
      fontWeight: 600,
    },
    moderate: {
      backgroundColor: "hsla(25, 95%, 53%, 0.15)",
      color: "hsl(25, 95%, 53%)",
      borderRadius: "6px",
      fontWeight: 600,
    },
    strong: {
      backgroundColor: "hsla(0, 72%, 50%, 0.15)",
      color: "hsl(0, 72%, 50%)",
      borderRadius: "6px",
      fontWeight: 600,
    },
    severe: {
      backgroundColor: "hsla(0, 72%, 50%, 0.25)",
      color: "hsl(0, 84%, 60%)",
      borderRadius: "6px",
      fontWeight: 700,
    },
    forecast: {
      border: "2px dashed hsla(200, 98%, 39%, 0.5)",
    },
  };

  const today = new Date();

  const monthNameGenitive = today.toLocaleDateString("uk-UA", { month: "long", year: "numeric" });
  const monthNameTitle = monthNameGenitive.charAt(0).toUpperCase() + monthNameGenitive.slice(1);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-4">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-primary">КАЛЕНДАР МАГНІТНИХ БУР</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Магнітні бурі — {monthNameTitle}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
          Дні з магнітними бурями позначені кольором відповідно до інтенсивності. Пунктирна рамка — прогноз на найближчі дні.
        </p>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        {(["minor", "moderate", "strong", "severe"] as StormLevel[]).map((level) => (
          <div key={level} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-full ${levelDotColors[level]}`} />
            <span className="font-mono text-xs text-muted-foreground">{levelLabels[level]}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border-2 border-dashed border-primary/50" />
          <span className="font-mono text-xs text-muted-foreground">Прогноз</span>
        </div>
      </div>

      {/* Calendar */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="flex justify-center">
          <Calendar
            mode="single"
            locale={uk}
            numberOfMonths={1}
            defaultMonth={new Date(today.getFullYear(), today.getMonth())}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-xl border border-border/50 bg-card/50 p-4 pointer-events-auto"
            classNames={{
              months: "flex flex-col gap-6",
              caption: "flex justify-center pt-1 relative items-center font-display font-semibold text-foreground",
              head_cell: "text-muted-foreground font-mono text-xs w-9",
              cell: "h-9 w-9 text-center text-sm relative",
              day: "h-9 w-9 p-0 font-mono text-sm hover:bg-primary/10 rounded-md transition-colors",
              day_today: "bg-primary/20 text-primary font-bold",
              nav_button: "h-7 w-7 bg-secondary/50 hover:bg-secondary rounded-md border border-border/50 inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
            }}
          />
        </div>
      )}

      {/* Storm days list */}
      {stormDays && stormDays.filter((d) => d.level !== "none").length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Дні з геомагнітними збуреннями
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {stormDays
              .filter((d) => d.level !== "none")
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((d) => (
                <div
                  key={d.date}
                  className={`flex items-center justify-between rounded-lg px-4 py-2.5 ${levelColors[d.level]}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${levelDotColors[d.level]}`} />
                    <span className="font-mono text-sm">
                      {new Date(d.date + "T00:00:00").toLocaleDateString("uk-UA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs opacity-80">
                      Kp {d.maxKp}
                    </span>
                    {d.isForecast && (
                      <span className="font-mono text-[10px] border border-dashed border-primary/50 text-primary px-1.5 py-0.5 rounded">
                        прогноз
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SEO text */}
      <section className="mt-10 border-t border-border/30 pt-8">
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground/80 text-sm leading-relaxed">
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            Календар магнітних бур на {monthNameTitle}
          </h2>
          <p>
            На цій сторінці відображено <strong>календар магнітних бур на {monthNameGenitive}</strong> з даними про геомагнітну активність за кожен день. Дні з підвищеною активністю позначені кольором відповідно до рівня інтенсивності бурі: від слабких (Kp4) до екстремальних (Kp8–9). Прогнозні дні виділені пунктирною рамкою.
          </p>
          <p>
            Геомагнітні бурі вимірюються за допомогою планетарного Kp-індексу та G-шкали NOAA. Коли Kp-індекс досягає 4 і вище, фіксується магнітна буря. Чим вищий рівень — тим більший вплив на здоров'я метеозалежних людей, роботу супутникового зв'язку, GPS-навігації та енергомереж.
          </p>
          <p>
            Календар оновлюється автоматично на основі офіційних даних <strong>NOAA Space Weather Prediction Center</strong>. Використовуйте його для планування свого дня та контролю самопочуття в період підвищеної сонячної активності.
          </p>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `Календар магнітних бур на ${monthNameGenitive} — Магнітка`,
            description: `Календар магнітних бур на ${monthNameGenitive}. Дні з геомагнітними збуреннями позначені кольором за шкалою інтенсивності.`,
            url: "https://magnetic-storm-hub.lovable.app/calendar",
          }),
        }}
      />
    </main>
  );
}
