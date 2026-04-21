"use client";

import { useCityWeather, getWeatherLabel, getWeatherEmoji, getAqiLabel } from "@/hooks/useCityWeather";
import { useCitySunTimes } from "@/hooks/useCitySunTimes";
import { useNoaaScales, useKpIndex } from "@/hooks/useSpaceWeather";
import { useKpForecast } from "@/hooks/useKpForecast";
import { useKpForecast27Day } from "@/hooks/useKpForecast27Day";
import { formatApiLocalTime } from "@/lib/city-sun-times";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Wind, Droplets, Gauge, Sun, Sunrise, Sunset, Cloud, Eye, Activity, AlertTriangle, MapPin, Info, CalendarDays } from "lucide-react";
import { StormStatusBanner } from "@/components/dashboard/StormStatusBanner";
import type { SiteLocale } from "@/lib/locale";

type LegacyLocale = Extract<SiteLocale, "uk" | "ru">;

const copy = {
  uk: {
    title: "Магнітні бурі в Києві сьогодні — погода, якість повітря",
    geo: "Геомагнітна ситуація в Києві",
    sunriseSunset: "Схід / Захід сонця",
    sunrise: "Схід",
    sunset: "Захід",
    dayLength: "Тривалість дня",
    coordinates: "Координати",
    latitude: "Широта",
    longitude: "Довгота",
    timezone: "Часовий пояс",
    radiation: "Радіаційний фон",
    normal: "В межах норми",
    forecast3: "Прогноз Kp індексу для Києва на 3 дні (по 3-годинних інтервалах)",
    forecast27: "Прогноз Kp на 27 днів для Києва",
    airQuality: "Якість повітря",
    metrics: "Поточні показники",
    about: "Про сторінку",
    geoAria: "Статус геомагнітної активності в Києві",
    forecast3Aria: "Прогноз Kp індексу на 3 дні",
    forecast27Aria: "Прогноз Kp на 27 днів",
    loadingForecast: "Завантаження прогнозу...",
    forecastUnavailable: "Дані прогнозу недоступні.",
    maxShort: "макс.",
    north: "Пн",
    east: "Сх",
    wind: "Вітер",
    humidity: "Вологість",
    pressure: "Тиск",
    cloudiness: "Хмарність",
    uvIndex: "UV індекс",
    high: "Висока",
    moderateHumidity: "Помірна",
    lowHumidity: "Низька",
    overcast: "Суцільна",
    variableClouds: "Мінлива",
    mostlyClear: "Малохмарно",
    veryHigh: "Дуже високий",
    highUv: "Високий",
    moderateUv: "Помірний",
    lowUv: "Низький",
    forecast3Note: "Прогноз Kp індексу для Києва (50.45°N) від NOAA Space Weather Prediction Center. Час — київський (UTC+2).",
    forecast27Note: "27-денний прогноз Kp-індексу для Києва (50.45°N) від NOAA SWPC. Точність знижується з кожним днем — використовуйте для загального планування.",
    seoHeading: "Магнітні бурі в Києві сьогодні",
    calm: "Спокійно",
    low: "Низька активність",
    moderate: "Помірна буря",
    strong: "Сильна буря",
    extreme: "Екстремальна буря",
  },
  ru: {
    title: "Магнитные бури в Киеве сегодня — погода, качество воздуха",
    geo: "Геомагнитная ситуация в Киеве",
    sunriseSunset: "Восход / Закат солнца",
    sunrise: "Восход",
    sunset: "Закат",
    dayLength: "Длительность дня",
    coordinates: "Координаты",
    latitude: "Широта",
    longitude: "Долгота",
    timezone: "Часовой пояс",
    radiation: "Радиационный фон",
    normal: "В пределах нормы",
    forecast3: "Прогноз Kp индекса для Киева на 3 дня (по 3-часовым интервалам)",
    forecast27: "Прогноз Kp на 27 дней для Киева",
    airQuality: "Качество воздуха",
    metrics: "Текущие показатели",
    about: "О странице",
    geoAria: "Статус геомагнитной активности в Киеве",
    forecast3Aria: "Прогноз Kp индекса на 3 дня",
    forecast27Aria: "Прогноз Kp на 27 дней",
    loadingForecast: "Загрузка прогноза...",
    forecastUnavailable: "Данные прогноза недоступны.",
    maxShort: "макс.",
    north: "С",
    east: "В",
    wind: "Ветер",
    humidity: "Влажность",
    pressure: "Давление",
    cloudiness: "Облачность",
    uvIndex: "UV индекс",
    high: "Высокая",
    moderateHumidity: "Умеренная",
    lowHumidity: "Низкая",
    overcast: "Сплошная",
    variableClouds: "Переменная",
    mostlyClear: "Малооблачно",
    veryHigh: "Очень высокий",
    highUv: "Высокий",
    moderateUv: "Умеренный",
    lowUv: "Низкий",
    forecast3Note: "Прогноз Kp индекса для Киева (50.45°N) от NOAA Space Weather Prediction Center. Время — киевское (UTC+2).",
    forecast27Note: "27-дневный прогноз Kp-индекса для Киева (50.45°N) от NOAA SWPC. Точность снижается с каждым днем — используйте для общего планирования.",
    seoHeading: "Магнитные бури в Киеве сегодня",
    calm: "Спокойно",
    low: "Низкая активность",
    moderate: "Умеренная буря",
    strong: "Сильная буря",
    extreme: "Экстремальная буря",
  },
} as const;

const getKpStatus = (kp: number, locale: SiteLocale) => {
  const t = copy[locale];
  if (kp <= 2) return { label: t.calm, color: "hsl(145, 80%, 45%)" };
  if (kp <= 3) return { label: t.low, color: "hsl(55, 90%, 50%)" };
  if (kp <= 5) return { label: t.moderate, color: "hsl(35, 100%, 55%)" };
  if (kp <= 7) return { label: t.strong, color: "hsl(15, 90%, 50%)" };
  return { label: t.extreme, color: "hsl(0, 80%, 55%)" };
};

const CityKyiv = ({ locale = "uk" }: { locale?: LegacyLocale }) => {
  const t = copy[locale];
  const localeTag = locale === "ru" ? "ru-RU" : "uk-UA";
  const { data, isLoading } = useCityWeather();
  const { data: sunTimes } = useCitySunTimes({
    lat: 50.4501,
    lon: 30.5234,
    timezone: "Europe/Kyiv",
    locale,
    fallback: data?.current
      ? {
          sunrise: data.current.sunrise,
          sunset: data.current.sunset,
        }
      : null,
  });
  const { data: kpData } = useKpIndex();
  const { data: scales } = useNoaaScales();
  const { data: forecast, isLoading: forecastLoading } = useKpForecast();
  const { data: forecast27 = [], isLoading: forecast27Loading } = useKpForecast27Day();

  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const gLevel = scales?.g?.Scale ?? 0;
  const kpStatus = getKpStatus(latestKp, locale);

  const todayDate = new Date().toLocaleDateString(localeTag, { day: "numeric", month: "long", year: "numeric" });

  const today = new Date().toLocaleDateString(localeTag, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Kyiv",
  });

  return (
    <div className="min-h-screen bg-background grid-bg">
      <main className="mx-auto max-w-7xl space-y-6 p-6" role="main">
        <h1 className="sr-only">{t.title}</h1>

        {/* Three-column hero */}
        {/* Storm + Sun/Coords row */}
        <section className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 items-stretch" aria-label={t.geoAria}>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-glow-cyan bg-card/50 px-4 py-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-medium text-muted-foreground">
                {t.geo} — {today}
              </h2>
            </div>
            <div className="flex-1 [&>div]:rounded-t-none">
              <StormStatusBanner />
            </div>
          </div>

          {/* Sun + Coordinates */}
          <div className="rounded-lg border border-border/50 bg-card p-4 space-y-3 flex flex-col text-sm">
            {data?.current && (
              <div className="space-y-1.5">
                <h3 className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                  <Sun className="h-3.5 w-3.5 text-primary" />
                  {t.sunriseSunset}
                </h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Sunrise className="h-3.5 w-3.5 text-amber-400" />{t.sunrise}</span>
                  <span className="font-mono font-medium text-foreground">{formatApiLocalTime(sunTimes?.sunrise ?? data.current.sunrise)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Sunset className="h-3.5 w-3.5 text-orange-400" />{t.sunset}</span>
                  <span className="font-mono font-medium text-foreground">{formatApiLocalTime(sunTimes?.sunset ?? data.current.sunset)}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-border/30 pt-1.5">
                  <span className="text-muted-foreground">{t.dayLength}</span>
                  <span className="font-mono font-medium text-foreground">{sunTimes?.dayLength ?? data.current.dayLength}</span>
                </div>
              </div>
            )}
            <div className="space-y-1.5 border-t border-border/30 pt-2">
              <h3 className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {t.coordinates}
              </h3>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.latitude}</span>
                <span className="font-mono text-foreground">50.4501° {t.north}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.longitude}</span>
                <span className="font-mono text-foreground">30.5234° {t.east}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.timezone}</span>
                <span className="font-mono text-foreground">UTC+2 (EET)</span>
              </div>
            </div>
            <div className="space-y-1.5 border-t border-border/30 pt-2">
              <h3 className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                <Activity className="h-3.5 w-3.5 text-primary" />
                {t.radiation}
              </h3>
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-foreground">0.08–0.14</span>
                <span className="text-[10px] text-muted-foreground">мкЗв/год</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-storm-quiet/15 border border-storm-quiet/30 px-2 py-0.5 text-[9px] font-medium text-storm-quiet">{t.normal}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3-day Kp forecast */}
        <section className="rounded-lg border border-border/50 bg-card p-5 space-y-4" aria-label={t.forecast3Aria}>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.forecast3}
            </h2>
          </div>
          {forecastLoading ? (
            <p className="text-sm text-muted-foreground animate-pulse">{t.loadingForecast}</p>
          ) : forecast && forecast.length > 0 ? (() => {
            const todayDate = new Date();
            const todayKey = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;
            const tomorrowDate = new Date(todayDate);
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            const tomorrowKey = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth() + 1).padStart(2, "0")}-${String(tomorrowDate.getDate()).padStart(2, "0")}`;
            const filtered = forecast.filter((row) => {
              const d = new Date(row.time_tag + "Z");
              const kyivStr = d.toLocaleDateString("sv-SE", { timeZone: "Europe/Kyiv" });
              return kyivStr >= tomorrowKey;
            });
            const grouped = new Map<string, typeof forecast>();
            filtered.forEach((row) => {
              const dateKey = new Date(row.time_tag + "Z").toLocaleDateString(localeTag, {
                weekday: "short", day: "numeric", month: "short", timeZone: "Europe/Kyiv",
              });
              if (!grouped.has(dateKey)) grouped.set(dateKey, []);
              grouped.get(dateKey)!.push(row);
            });
            const days = Array.from(grouped.entries()).slice(0, 3);

            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {days.map(([dateLabel, rows]) => {
                  const maxKp = Math.max(...rows.map((r) => r.kp));
                  const maxKpRound = Math.min(9, Math.max(0, Math.round(maxKp)));
                  return (
                    <div key={dateLabel} className="rounded-md border border-border/30 bg-muted/10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-medium text-foreground">{dateLabel}</span>
                        <span className={cn(
                          "text-[10px] font-mono px-1.5 py-0.5 rounded",
                          maxKpRound >= 5 ? "bg-storm-severe/20 text-storm-severe" :
                          maxKpRound >= 4 ? "bg-storm-moderate/20 text-storm-moderate" :
                          "bg-storm-quiet/20 text-storm-quiet"
                        )}>
                          {t.maxShort} Kp {maxKp.toFixed(1)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {rows.map((row, j) => {
                          const kpVal = Math.min(9, Math.max(0, Math.round(row.kp)));
                          return (
                            <div key={j} className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground font-mono">
                                {new Date(row.time_tag + "Z").toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Kyiv" })}
                              </span>
                              <div className="flex-1 mx-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    kpVal >= 5 ? "bg-storm-severe" :
                                    kpVal >= 4 ? "bg-storm-moderate" :
                                    kpVal >= 2 ? "bg-storm-minor" :
                                    "bg-storm-quiet"
                                  )}
                                  style={{ width: `${(row.kp / 9) * 100}%` }}
                                />
                              </div>
                              <span className={cn(
                                "font-mono font-bold w-8 text-right",
                                kpVal >= 5 ? "text-storm-severe" :
                                kpVal >= 4 ? "text-storm-moderate" :
                                "text-muted-foreground"
                              )}>
                                {row.kp.toFixed(1)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })() : (
            <p className="text-sm text-muted-foreground">{t.forecastUnavailable}</p>
          )}
          <p className="text-[11px] text-muted-foreground/60 border-t border-border/30 pt-3">
            {t.forecast3Note}
          </p>
        </section>

        {/* 27-day Kp forecast */}
        <section className="rounded-lg border border-border/50 bg-card p-5 space-y-4" aria-label={t.forecast27Aria}>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.forecast27}
            </h2>
          </div>
          {forecast27Loading ? (
            <p className="text-sm text-muted-foreground animate-pulse">{t.loadingForecast}</p>
          ) : forecast27.length > 0 ? (
            <div className="grid grid-cols-7 gap-1.5">
              {forecast27.map((day) => {
                const d = new Date(day.date);
                const isToday = day.date === new Date().toISOString().slice(0, 10);
                const kpColor = day.kp >= 7 ? "bg-red-500/20 text-red-400 border-red-500/30"
                  : day.kp >= 5 ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                  : day.kp >= 4 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-green-500/20 text-green-400 border-green-500/30";
                return (
                  <div
                    key={day.date}
                    className={cn("rounded-md border p-1.5 text-center text-[10px] font-mono transition-colors", kpColor, isToday && "ring-1 ring-primary")}
                    title={`${day.date}: Kp ${day.kp}`}
                  >
                    <div className="text-muted-foreground/70">{d.toLocaleDateString(localeTag, { weekday: "narrow" })}</div>
                    <div className="text-xs font-bold">{d.getDate()}</div>
                    <div className="text-[9px] opacity-80">Kp {day.kp}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t.forecastUnavailable}</p>
          )}
          <p className="text-[11px] text-muted-foreground/60 border-t border-border/30 pt-3">
            {t.forecast27Note}
          </p>
        </section>

        {/* Air Quality */}
        {data?.airQuality && (
          <section aria-label={t.airQuality}>
            <div className="rounded-lg border border-border/50 bg-card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-bold text-foreground">{t.airQuality}</h2>
                <span
                  className="ml-auto rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: `${getAqiLabel(data.airQuality.aqi).color}15`,
                    color: getAqiLabel(data.airQuality.aqi).color,
                  }}
                >
                  {getAqiLabel(data.airQuality.aqi).label} • AQI {data.airQuality.aqi}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <AqiItem label="PM2.5" value={data.airQuality.pm25} unit="мкг/м³" warn={data.airQuality.pm25 > 25} />
                <AqiItem label="PM10" value={data.airQuality.pm10} unit="мкг/м³" warn={data.airQuality.pm10 > 50} />
                <AqiItem label="NO₂" value={data.airQuality.no2} unit="мкг/м³" warn={data.airQuality.no2 > 40} />
                <AqiItem label="O₃" value={data.airQuality.o3} unit="мкг/м³" warn={data.airQuality.o3 > 100} />
              </div>
              <div className="space-y-1">
                <div className="flex h-2 rounded-full overflow-hidden">
                  <div className="flex-1 bg-[hsl(145,80%,45%)]" />
                  <div className="flex-1 bg-[hsl(100,70%,45%)]" />
                  <div className="flex-1 bg-[hsl(55,90%,50%)]" />
                  <div className="flex-1 bg-[hsl(35,100%,55%)]" />
                  <div className="flex-1 bg-[hsl(0,80%,55%)]" />
                </div>
                <div className="relative h-0">
                  <div
                    className="absolute -top-3 w-0.5 h-4 bg-foreground rounded-full transition-all"
                    style={{ left: `${Math.min(data.airQuality.aqi, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Metric cards grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        ) : data?.current ? (
          <section aria-label={t.metrics}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <MiniCard icon={Wind} label={t.wind} value={`${Math.round(data.current.windSpeed)} км/г`} sub={getWindDirection(data.current.windDirection, locale)} />
              <MiniCard icon={Droplets} label={t.humidity} value={`${data.current.humidity}%`} sub={data.current.humidity > 80 ? t.high : data.current.humidity > 50 ? t.moderateHumidity : t.lowHumidity} />
              <MiniCard icon={Gauge} label={t.pressure} value={`${Math.round(data.current.pressure)}`} sub="гПа" />
              <MiniCard icon={Cloud} label={t.cloudiness} value={`${data.current.cloudCover}%`} sub={data.current.cloudCover > 80 ? t.overcast : data.current.cloudCover > 40 ? t.variableClouds : t.mostlyClear} />
              <MiniCard icon={Sun} label={t.uvIndex} value={`${Math.round(data.current.uvIndex)}`} sub={data.current.uvIndex > 8 ? t.veryHigh : data.current.uvIndex > 5 ? t.highUv : data.current.uvIndex > 2 ? t.moderateUv : t.lowUv} />
              <MiniCard icon={Activity} label="Kp індекс" value={`${Math.round(latestKp)}`} sub={kpStatus.label} color={kpStatus.color} />
            </div>
          </section>
        ) : null}

        {/* SEO text */}
        <section className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground/80 text-sm leading-relaxed" aria-label={t.about}>
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            {t.seoHeading}, {new Date().toLocaleDateString(localeTag, { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" })}
          </h2>
          {(() => {
            const todayForecast = forecast?.filter((e) => {
              const d = new Date(e.time_tag + "Z");
              const kyivStr = d.toLocaleDateString("sv-SE", { timeZone: "Europe/Kyiv" });
              const nowStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Kyiv" });
              return kyivStr === nowStr;
            }) || [];
            const kpValues = todayForecast.map((e) => e.kp);
            const minKp = kpValues.length ? Math.min(...kpValues) : 0;
            const maxKp = kpValues.length ? Math.max(...kpValues) : 0;
            const rScale = scales?.r?.Scale ?? 0;
            const sScale = scales?.s?.Scale ?? 0;
            const dateStr = new Date().toLocaleDateString(localeTag, { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" });

            return (
              <p>
                {locale === "ru"
                  ? `Киев, ${dateStr}. Текущий Kp-индекс — ${latestKp.toFixed(1)}, уровень геомагнитной бури — G${gLevel}.${kpValues.length > 0 ? ` Прогнозируемый диапазон Kp за сутки: ${minKp.toFixed(1)}–${maxKp.toFixed(1)}.` : ""} Шкала радиозатемнений — R${rScale}, шкала радиационных бурь — S${sScale}.${data?.current ? ` Температура воздуха — ${Math.round(data.current.temperature)}°C, давление — ${Math.round(data.current.pressure)} гПа, влажность — ${data.current.humidity}%, ветер — ${Math.round(data.current.windSpeed)} км/ч (${getWindDirection(data.current.windDirection, locale)}).` : ""}${data?.airQuality ? ` Индекс качества воздуха AQI — ${data.airQuality.aqi}, PM2.5 — ${(Math.round(data.airQuality.pm25 * 10) / 10)} мкг/м³.` : ""} Данные: NOAA SWPC, Open-Meteo.`
                  : `Київ, ${dateStr}. Поточний Kp-індекс — ${latestKp.toFixed(1)}, рівень геомагнітної бурі — G${gLevel}.${kpValues.length > 0 ? ` Прогнозований діапазон Kp за добу: ${minKp.toFixed(1)}–${maxKp.toFixed(1)}.` : ""} Шкала радіозатемнень — R${rScale}, шкала радіаційних бур — S${sScale}.${data?.current ? ` Температура повітря — ${Math.round(data.current.temperature)}°C, тиск — ${Math.round(data.current.pressure)} гПа, вологість — ${data.current.humidity}%, вітер — ${Math.round(data.current.windSpeed)} км/год (${getWindDirection(data.current.windDirection, locale)}).` : ""}${data?.airQuality ? ` Індекс якості повітря AQI — ${data.airQuality.aqi}, PM2.5 — ${(Math.round(data.airQuality.pm25 * 10) / 10)} мкг/м³.` : ""} Дані: NOAA SWPC, Open-Meteo.`}
              </p>
            );
          })()}
        </section>
      </main>
    </div>
  );
};

/* Helper components */

function MiniCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  color?: string;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-3 space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-primary" style={color ? { color } : undefined} />
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-display text-xl font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function AqiItem({ label, value, unit, warn }: { label: string; value: number; unit: string; warn: boolean }) {
  return (
    <div className="rounded-md bg-muted/30 p-3 space-y-1">
      <span className="font-mono text-[10px] text-muted-foreground uppercase">{label}</span>
      <p className={`font-mono text-lg font-bold ${warn ? "text-destructive" : "text-foreground"}`}>
        {Math.round(value * 10) / 10}
      </p>
      <span className="text-[10px] text-muted-foreground">{unit}</span>
    </div>
  );
}

function getWindDirection(deg: number, locale: SiteLocale): string {
  const dirs = locale === "ru"
    ? ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"]
    : ["Пн", "ПнСх", "Сх", "ПдСх", "Пд", "ПдЗх", "Зх", "ПнЗх"];
  return dirs[Math.round(deg / 45) % 8];
}

export default CityKyiv;
