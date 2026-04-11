"use client";

import Link from "next/link";
import { Activity, Gauge, Thermometer, Wind } from "lucide-react";
import { useKpIndex, useMagData, useNoaaScales, useSolarWind } from "@/hooks/useSpaceWeather";

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-3 font-mono text-4xl font-bold text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export function HomeLivePanel() {
  const { data: kpData } = useKpIndex();
  const { data: windData } = useSolarWind();
  const { data: magData } = useMagData();
  const { data: scales } = useNoaaScales();

  const latestKp = kpData?.at(-1)?.kp ?? 0;
  const latestWind = windData?.at(-1);
  const latestMag = magData?.at(-1);
  const latestG = scales?.g?.Scale ?? 0;

  return (
    <section className="grid gap-4 lg:grid-cols-4">
      <Metric label="Kp індекс" value={latestKp.toFixed(1)} hint="Оновлюється автоматично з NOAA" />
      <Metric
        label="G-шкала"
        value={`G${latestG}`}
        hint="Поточний рівень геомагнітної активності"
      />
      <Metric
        label="Сонячний вітер"
        value={latestWind ? `${latestWind.speed.toFixed(0)}` : "—"}
        hint="км/с, поточна швидкість потоку"
      />
      <Metric
        label="IMF Bz"
        value={latestMag ? latestMag.bz.toFixed(1) : "—"}
        hint="нТ, орієнтація міжпланетного поля"
      />

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 lg:col-span-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Живі дані</p>
            <h2 className="font-display text-2xl font-bold text-foreground">
              HTML для Google, realtime для людей
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Сторінка вже містить основний контент у готовому HTML, а після завантаження браузер
              оновлює ключові метрики магнітної бурі, сонячного вітру та Bz без перезавантаження.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/kp-index" className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm">
              <Gauge className="h-4 w-4 text-primary" />
              Деталі Kp
            </Link>
            <Link href="/solar-wind" className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm">
              <Wind className="h-4 w-4 text-primary" />
              Сонячний вітер
            </Link>
            <Link href="/calendar" className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm">
              <Activity className="h-4 w-4 text-primary" />
              Календар бур
            </Link>
            <Link href="/news" className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm">
              <Thermometer className="h-4 w-4 text-primary" />
              Новини та прогнози
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
