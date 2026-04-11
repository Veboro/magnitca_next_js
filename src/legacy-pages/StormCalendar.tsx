"use client";

import { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useStormCalendar, StormDay, StormLevel } from "@/hooks/useStormCalendar";
import { CalendarDays, Info } from "lucide-react";
import { ru, uk } from "date-fns/locale";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Forecast27Day } from "@/components/dashboard/Forecast27Day";
import type { SiteLocale } from "@/lib/locale";

const levelColors: Record<StormLevel, string> = {
  none: "",
  minor: "bg-storm-minor/20 text-storm-minor border border-storm-minor/40",
  moderate: "bg-storm-moderate/20 text-storm-moderate border border-storm-moderate/40",
  strong: "bg-storm-strong/20 text-storm-strong border border-storm-strong/40",
  severe: "bg-storm-severe/20 text-storm-severe border border-storm-severe/40 animate-pulse",
};

const levelLabels = {
  uk: {
    none: "Спокійно",
    minor: "Слабка буря (Kp4)",
    moderate: "Помірна буря (Kp5)",
    strong: "Сильна буря (Kp6-7)",
    severe: "Екстремальна буря (Kp8-9)",
  },
  ru: {
    none: "Спокойно",
    minor: "Слабая буря (Kp4)",
    moderate: "Умеренная буря (Kp5)",
    strong: "Сильная буря (Kp6-7)",
    severe: "Экстремальная буря (Kp8-9)",
  },
};

const levelDotColors: Record<StormLevel, string> = {
  none: "bg-storm-quiet",
  minor: "bg-storm-minor",
  moderate: "bg-storm-moderate",
  strong: "bg-storm-strong",
  severe: "bg-storm-severe",
};

const copy = {
  uk: {
    badge: "КАЛЕНДАР МАГНІТНИХ БУР",
    pageTitlePrefix: "Календар магнітних бур на",
    pageTitleSuffix: "— Магнітка",
    pageDescriptionPrefix: "Календар магнітних бур на",
    pageDescriptionSuffix: "Дні з геомагнітними збуреннями позначені кольором за шкалою інтенсивності.",
    intro:
      "Дні з магнітними бурями позначені кольором відповідно до інтенсивності. Пунктирна рамка — прогноз на найближчі дні.",
    forecast: "Прогноз",
    disturbanceDays: "Дні з геомагнітними збуреннями",
    forecastBadge: "прогноз",
    seo1Prefix: "На цій сторінці відображено",
    seo1StrongPrefix: "календар магнітних бур на",
    seo1Rest:
      "з даними про геомагнітну активність за кожен день. Дні з підвищеною активністю позначені кольором відповідно до рівня інтенсивності бурі: від слабких (Kp4) до екстремальних (Kp8–9). Прогнозні дні виділені пунктирною рамкою.",
    seo2:
      "Геомагнітні бурі вимірюються за допомогою планетарного Kp-індексу та G-шкали NOAA. Коли Kp-індекс досягає 4 і вище, фіксується магнітна буря. Чим вищий рівень — тим більший вплив на здоров'я метеозалежних людей, роботу супутникового зв'язку, GPS-навігації та енергомереж.",
    seo3:
      "Календар оновлюється автоматично на основі офіційних даних NOAA Space Weather Prediction Center. Використовуйте його для планування свого дня та контролю самопочуття в період підвищеної сонячної активності.",
  },
  ru: {
    badge: "КАЛЕНДАРЬ МАГНИТНЫХ БУРЬ",
    pageTitlePrefix: "Календарь магнитных бурь на",
    pageTitleSuffix: "— Магнитка",
    pageDescriptionPrefix: "Календарь магнитных бурь на",
    pageDescriptionSuffix: "Дни с геомагнитными возмущениями отмечены цветом по шкале интенсивности.",
    intro:
      "Дни с магнитными бурями отмечены цветом в зависимости от интенсивности. Пунктирная рамка — прогноз на ближайшие дни.",
    forecast: "Прогноз",
    disturbanceDays: "Дни с геомагнитными возмущениями",
    forecastBadge: "прогноз",
    seo1Prefix: "На этой странице отображается",
    seo1StrongPrefix: "календарь магнитных бурь на",
    seo1Rest:
      "с данными о геомагнитной активности за каждый день. Дни с повышенной активностью отмечены цветом по уровню интенсивности бури: от слабых (Kp4) до экстремальных (Kp8–9). Прогнозные дни выделены пунктирной рамкой.",
    seo2:
      "Геомагнитные бури измеряются с помощью планетарного Kp-индекса и G-шкалы NOAA. Когда Kp-индекс достигает 4 и выше, фиксируется магнитная буря. Чем выше уровень, тем сильнее влияние на самочувствие метеозависимых людей, работу спутниковой связи, GPS-навигации и энергосетей.",
    seo3:
      "Календарь обновляется автоматически на основе официальных данных NOAA Space Weather Prediction Center. Используйте его для планирования своего дня и контроля самочувствия в период повышенной солнечной активности.",
  },
} as const;

export default function StormCalendar({ locale = "uk" }: { locale?: SiteLocale }) {
  const t = copy[locale];
  const dateLocale = locale === "ru" ? ru : uk;
  const localeTag = locale === "ru" ? "ru-RU" : "uk-UA";
  const now = new Date();
  const monthName = now.toLocaleDateString(localeTag, { month: "long", year: "numeric" });

  usePageMeta(
    `${t.pageTitlePrefix} ${monthName} ${t.pageTitleSuffix}`,
    `${t.pageDescriptionPrefix} ${monthName}. ${t.pageDescriptionSuffix}`
  );

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

  const monthNameGenitive = today.toLocaleDateString(localeTag, { month: "long", year: "numeric" });
  const monthNameTitle = monthNameGenitive.charAt(0).toUpperCase() + monthNameGenitive.slice(1);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-4">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-primary">{t.badge}</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          {t.pageTitlePrefix} {monthNameTitle}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
          {t.intro}
        </p>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        {(["minor", "moderate", "strong", "severe"] as StormLevel[]).map((level) => (
          <div key={level} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-full ${levelDotColors[level]}`} />
            <span className="font-mono text-xs text-muted-foreground">{levelLabels[locale][level]}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border-2 border-dashed border-primary/50" />
          <span className="font-mono text-xs text-muted-foreground">{t.forecast}</span>
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
            locale={dateLocale}
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
            {t.disturbanceDays}
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
                      {new Date(d.date + "T00:00:00").toLocaleDateString(localeTag, {
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
                        {t.forecastBadge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 27-day forecast */}
      <div className="mt-8">
        <Forecast27Day />
      </div>

      {/* SEO text */}
      <section className="mt-10 border-t border-border/30 pt-8">
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground/80 text-sm leading-relaxed">
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            {t.pageTitlePrefix} {monthNameTitle}
          </h2>
          <p>
            {t.seo1Prefix} <strong>{t.seo1StrongPrefix} {monthNameGenitive}</strong> {t.seo1Rest}
          </p>
          <p>{t.seo2}</p>
          <p>{t.seo3}</p>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${t.pageTitlePrefix} ${monthNameGenitive} ${t.pageTitleSuffix}`,
            description: `${t.pageDescriptionPrefix} ${monthNameGenitive}. ${t.pageDescriptionSuffix}`,
            url: locale === "ru" ? "https://magnetic-storm-hub.lovable.app/ru/calendar" : "https://magnetic-storm-hub.lovable.app/calendar",
          }),
        }}
      />
    </main>
  );
}
