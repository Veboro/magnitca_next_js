"use client";

import { Cloud, Droplets, Gauge, Sun, Wind } from "lucide-react";
import type { CityConfig } from "@/data/cities";
import {
  type CityWeatherResult,
  getAqiLabel,
  getWeatherEmoji,
  getWeatherLabel,
  useCityWeather,
} from "@/hooks/useCityWeather";
import { type KpEntry, type NoaaScales, useKpIndex, useNoaaScales } from "@/hooks/useSpaceWeather";

function Panel({
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
      <p className="mt-3 font-mono text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export function CityRealtimePanel({
  city,
  initialWeather,
  initialKpData,
  initialScales,
}: {
  city: CityConfig;
  initialWeather?: CityWeatherResult;
  initialKpData?: KpEntry[];
  initialScales?: NoaaScales;
}) {
  const { data } = useCityWeather(city.lat, city.lon, city.timezone, initialWeather);
  const { data: kpData } = useKpIndex(initialKpData);
  const { data: scales } = useNoaaScales(initialScales);

  const current = data?.current;
  const air = data?.airQuality;
  const latestKp = kpData?.at(-1)?.kp ?? 0;
  const aqi = air?.aqi ?? 0;
  const aqiLabel = getAqiLabel(aqi);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Panel
        label="Температура"
        value={current ? `${Math.round(current.temperature)}°` : "—"}
        hint={
          current
            ? `${getWeatherEmoji(current.weatherCode)} ${getWeatherLabel(current.weatherCode)}`
            : "Поточна погода завантажується"
        }
      />
      <Panel
        label="Kp індекс"
        value={latestKp.toFixed(1)}
        hint={`Глобальна геомагнітна активність, шкала G${scales?.g?.Scale ?? 0}`}
      />
      <Panel
        label="Якість повітря"
        value={air ? `${Math.round(aqi)}` : "—"}
        hint={air ? `${aqiLabel.label} за європейським AQI` : "Поточний стан атмосфери"}
      />
      <Panel
        label="Вітер"
        value={current ? `${Math.round(current.windSpeed)}` : "—"}
        hint="км/год, локальні метеоумови"
      />

      <div className="rounded-2xl border border-border/50 bg-card p-6 md:col-span-2 xl:col-span-4">
        <h2 className="font-display text-xl font-bold text-foreground">
          Жива ситуація для {city.name}
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl bg-muted/30 p-4">
            <Sun className="h-4 w-4 text-primary" />
            <p className="mt-2 text-sm font-medium">Схід сонця</p>
            <p className="font-mono text-lg">{current ? new Date(current.sunrise).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: city.timezone }) : "—"}</p>
          </div>
          <div className="rounded-xl bg-muted/30 p-4">
            <Cloud className="h-4 w-4 text-primary" />
            <p className="mt-2 text-sm font-medium">Хмарність</p>
            <p className="font-mono text-lg">{current ? `${current.cloudCover}%` : "—"}</p>
          </div>
          <div className="rounded-xl bg-muted/30 p-4">
            <Droplets className="h-4 w-4 text-primary" />
            <p className="mt-2 text-sm font-medium">Вологість</p>
            <p className="font-mono text-lg">{current ? `${current.humidity}%` : "—"}</p>
          </div>
          <div className="rounded-xl bg-muted/30 p-4">
            <Gauge className="h-4 w-4 text-primary" />
            <p className="mt-2 text-sm font-medium">Тиск</p>
            <p className="font-mono text-lg">{current ? `${Math.round(current.pressure)}` : "—"}</p>
          </div>
          <div className="rounded-xl bg-muted/30 p-4">
            <Wind className="h-4 w-4 text-primary" />
            <p className="mt-2 text-sm font-medium">PM2.5</p>
            <p className="font-mono text-lg">{air ? `${Math.round(air.pm25)}` : "—"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
