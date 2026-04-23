"use client";

import { cn } from "@/lib/utils";

type SiteLocale = "uk" | "ru" | "pl";

const copy = {
  uk: {
    title: "Вплив на організм",
    magnetic: "Магнітні бурі",
    pressure: "Тиск повітря",
    pressureRange: "перепад",
    currentPressure: "тиск зараз",
    total: "Загальний вплив",
  },
  ru: {
    title: "Влияние на организм",
    magnetic: "Магнитные бури",
    pressure: "Давление воздуха",
    pressureRange: "перепад",
    currentPressure: "давление сейчас",
    total: "Общее влияние",
  },
  pl: {
    title: "Wpływ na organizm",
    magnetic: "Burze magnetyczne",
    pressure: "Ciśnienie",
    pressureRange: "wahanie",
    currentPressure: "ciśnienie teraz",
    total: "Wpływ łączny",
  },
} as const;

const levelColors = [
  "hsl(145, 80%, 45%)",
  "hsl(100, 70%, 45%)",
  "hsl(55, 90%, 50%)",
  "hsl(35, 100%, 55%)",
  "hsl(15, 90%, 50%)",
  "hsl(0, 80%, 55%)",
];

function getMagneticScore10(kp: number) {
  return Math.min(10, Math.max(1, Math.round((Math.min(kp, 9) / 9) * 10)));
}

function getPressureScore10(currentPressure: number, hourlyPressures: number[]) {
  const relevantPressures = hourlyPressures.filter((value) => Number.isFinite(value));
  const currentDelta = Math.abs(currentPressure - 1013.25);
  const range =
    relevantPressures.length > 1
      ? Math.max(...relevantPressures) - Math.min(...relevantPressures)
      : 0;

  const stress = Math.max(currentDelta * 0.45, range * 1.4);
  const normalized = Math.min(10, Math.max(1, Math.round(stress / 1.8)));
  return normalized;
}

function getLevelColor(score10: number) {
  if (score10 <= 2) return levelColors[0];
  if (score10 <= 4) return levelColors[1];
  if (score10 <= 6) return levelColors[2];
  if (score10 <= 8) return levelColors[3];
  if (score10 <= 9) return levelColors[4];
  return levelColors[5];
}

function VerticalProgress({
  label,
  score10,
  detail,
}: {
  label: string;
  score10: number;
  detail: string;
}) {
  const color = getLevelColor(score10);

  return (
    <div className="flex min-w-0 flex-1 items-end gap-3 overflow-hidden">
      <div className="grid h-44 w-6 min-w-6 shrink-0 grid-rows-10 gap-1 rounded-full border border-border/30 bg-muted/5 p-0.5">
        {Array.from({ length: 10 }).map((_, index) => {
          const filled = 9 - index < score10;
          return (
            <div
              key={index}
              className="rounded-full transition-colors"
              style={{
                backgroundColor: filled ? color : "rgba(255,255,255,0.045)",
                opacity: filled ? 0.95 : 0.8,
              }}
            />
          );
        })}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 pb-1 overflow-hidden">
        <span className="text-xs font-medium leading-4 text-foreground">{label}</span>
        <span className="truncate font-mono text-[1.45rem] font-bold leading-none tracking-[-0.04em]" style={{ color }}>
          {score10}/10
        </span>
        <span className="max-w-[132px] text-[11px] leading-4 text-muted-foreground">{detail}</span>
      </div>
    </div>
  );
}

function HorizontalProgress({
  label,
  score10,
  detail,
}: {
  label: string;
  score10: number;
  detail: string;
}) {
  const color = getLevelColor(score10);

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-medium text-foreground">{label}</span>
          <div className="font-mono text-[1.55rem] font-bold leading-none" style={{ color }}>
            {score10}/10
          </div>
        </div>
        <span className="max-w-[150px] text-right text-[11px] leading-4 text-muted-foreground">{detail}</span>
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 10 }).map((_, index) => {
          const filled = index < score10;
          return (
            <div
              key={index}
              className="h-2 flex-1 rounded-full transition-colors"
              style={{
                backgroundColor: filled ? color : "rgba(255,255,255,0.06)",
                opacity: filled ? 1 : 0.6,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function CityImpactPanel({
  locale,
  magneticKp,
  currentPressure,
  hourlyPressures,
  className,
}: {
  locale: SiteLocale;
  magneticKp: number;
  currentPressure: number;
  hourlyPressures: number[];
  className?: string;
}) {
  const t = copy[locale];
  const magneticScore10 = getMagneticScore10(magneticKp);
  const pressureScore10 = getPressureScore10(currentPressure, hourlyPressures);
  const totalScore10 = Math.min(10, Math.max(1, Math.round((magneticScore10 + pressureScore10) / 2)));
  const totalColor = getLevelColor(totalScore10);
  const range =
    hourlyPressures.length > 1
      ? Math.max(...hourlyPressures) - Math.min(...hourlyPressures)
      : 0;

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-4", className)}>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.title}</h3>

      <div className="space-y-4 sm:hidden">
        <HorizontalProgress
          label={t.magnetic}
          score10={magneticScore10}
          detail={`Kp ${magneticKp.toFixed(1)}`}
        />
        <HorizontalProgress
          label={t.pressure}
          score10={pressureScore10}
          detail={`${t.currentPressure}: ${Math.round(currentPressure)} hPa · ${t.pressureRange}: ${range.toFixed(1)} hPa`}
        />
      </div>

      <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <VerticalProgress
          label={t.magnetic}
          score10={magneticScore10}
          detail={`Kp ${magneticKp.toFixed(1)}`}
        />
        <VerticalProgress
          label={t.pressure}
          score10={pressureScore10}
          detail={`${t.currentPressure}: ${Math.round(currentPressure)} hPa · ${t.pressureRange}: ${range.toFixed(1)} hPa`}
        />
      </div>

      <div className="mt-4 border-t border-border/30 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{t.total}</span>
            <div className="truncate font-mono text-[1.7rem] font-bold leading-none tracking-[-0.04em]" style={{ color: totalColor }}>
              {totalScore10}/10
            </div>
          </div>
          <div className="flex flex-1 items-center gap-1 pb-1">
            {Array.from({ length: 10 }).map((_, index) => {
              const filled = index < totalScore10;
              return (
                <div
                  key={index}
                  className="h-2 flex-1 rounded-full transition-colors"
                  style={{
                    backgroundColor: filled ? totalColor : "rgba(255,255,255,0.06)",
                    opacity: filled ? 1 : 0.6,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
