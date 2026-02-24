import { useParams, Navigate } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useCityWeather, getWeatherLabel, getWeatherEmoji, getAqiLabel } from "@/hooks/useCityWeather";
import { useNoaaScales, useKpIndex } from "@/hooks/useSpaceWeather";
import { useKpForecast } from "@/hooks/useKpForecast";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Wind, Droplets, Gauge, Sun, Sunrise, Sunset, Cloud, Eye, Activity, AlertTriangle, MapPin, Info, CalendarDays } from "lucide-react";
import { getCityBySlug } from "@/data/cities";

const getKpStatus = (kp: number) => {
  if (kp <= 2) return { label: "Спокійно", color: "hsl(145, 80%, 45%)" };
  if (kp <= 3) return { label: "Низька активність", color: "hsl(55, 90%, 50%)" };
  if (kp <= 5) return { label: "Помірна буря", color: "hsl(35, 100%, 55%)" };
  if (kp <= 7) return { label: "Сильна буря", color: "hsl(15, 90%, 50%)" };
  return { label: "Екстремальна буря", color: "hsl(0, 80%, 55%)" };
};

function getWindDirection(deg: number): string {
  const dirs = ["Пн", "ПнСх", "Сх", "ПдСх", "Пд", "ПдЗх", "Зх", "ПнЗх"];
  return dirs[Math.round(deg / 45) % 8];
}

function MiniCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string; sub: string; color?: string;
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

const CityPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : undefined;

  // Hooks must be called unconditionally
  const { data, isLoading } = useCityWeather(city?.lat, city?.lon, city?.timezone);
  const { data: kpData } = useKpIndex();
  const { data: scales } = useNoaaScales();
  const { data: forecast, isLoading: forecastLoading } = useKpForecast();

  const { data: forecast27 = [], isLoading: forecast27Loading } = useQuery<{ date: string; kp: number }[]>({
    queryKey: ["forecast-27day"],
    queryFn: async () => {
      const res = await fetch("https://services.swpc.noaa.gov/text/27-day-outlook.txt");
      const text = await res.text();
      const lines = text.split("\n");
      const result: { date: string; kp: number }[] = [];
      for (const line of lines) {
        const match = line.match(/^(\d{4})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\s+\d+\s+\d+\s+([\d.]+)/);
        if (match) {
          const [, year, mon, day, kp] = match;
          const monthMap: Record<string, string> = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
          result.push({ date: `${year}-${monthMap[mon]}-${day.padStart(2, "0")}`, kp: parseFloat(kp) });
        }
      }
      const today = new Date().toISOString().slice(0, 10);
      return result.filter((d) => d.date >= today);
    },
    refetchInterval: 600000,
    staleTime: 300000,
  });

  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const gLevel = scales?.g?.Scale ?? 0;
  const kpStatus = getKpStatus(latestKp);

  usePageMeta(
    city?.seoTitle ?? "Магнітні бурі — місто не знайдено",
    city?.seoDescription ?? ""
  );

  if (!city) return <Navigate to="/404" replace />;

  const today = new Date().toLocaleDateString("uk-UA", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: city.timezone,
  });

  return (
    <div className="min-h-screen bg-background grid-bg">
      <main className="mx-auto max-w-7xl space-y-6 p-6" role="main">
        <h1 className="sr-only">Магнітні бурі в {city.nameGenitive} — погода та якість повітря</h1>

        {/* Hero */}
        <section className="grid gap-4 lg:grid-cols-[1fr_auto]" aria-label={`Статус ${city.name}`}>
          <div className="rounded-lg border border-glow-cyan bg-card p-6 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary animate-pulse-glow" />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {gLevel > 0 ? `Геомагнітна буря • ${city.name}` : `Моніторинг магнітних бур • ${city.name}`}
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Kp {Math.round(latestKp)} — {kpStatus.label}
                </h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  {gLevel >= 3
                    ? `Можливі перебої з GPS та радіозв'язком у ${city.nameGenitive}. Метеозалежні люди можуть відчувати нездужання.`
                    : gLevel > 0
                    ? "Слабка геомагнітна активність. Метеочутливі люди можуть відчувати незначний вплив."
                    : `Геомагнітна обстановка в ${city.nameGenitive} спокійна. Значних збурень не очікується.`}
                </p>
                {data?.current && (
                  <div className="inline-flex items-center gap-3 rounded-md border border-border/50 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
                    <span>{getWeatherEmoji(data.current.weatherCode)} {Math.round(data.current.temperature)}° • {getWeatherLabel(data.current.weatherCode)}</span>
                    <span className="border-l border-border/50 pl-3">{today}</span>
                  </div>
                )}
              </div>
              <div
                className="hidden md:flex flex-col items-center justify-center rounded-full border w-24 h-24 ml-6 shrink-0 transition-colors duration-700"
                style={{
                  backgroundColor: `${kpStatus.color}15`,
                  borderColor: `${kpStatus.color}40`,
                  boxShadow: `0 0 20px ${kpStatus.color}20`,
                }}
              >
                <AlertTriangle className="h-6 w-6 transition-colors duration-700" style={{ color: kpStatus.color }} />
                <p className="font-mono text-xs font-bold text-foreground mt-1">{gLevel > 0 ? "БУРЯ" : "НОРМА"}</p>
                <p className="text-[10px] text-muted-foreground">Kp {Math.round(latestKp)} • G{gLevel}</p>
              </div>
            </div>
          </div>

          {/* Sun & coordinates */}
          <div className="rounded-lg border border-border/50 bg-card p-6 lg:w-64 space-y-5">
            {data?.current && (
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                  <Sun className="h-4 w-4 text-primary" />
                  Схід і захід сонця
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sunrise className="h-4 w-4 text-amber-400" />
                      <span>Схід</span>
                    </div>
                    <span className="font-mono text-sm font-medium text-foreground">
                      {new Date(data.current.sunrise).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: city.timezone })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sunset className="h-4 w-4 text-orange-400" />
                      <span>Захід</span>
                    </div>
                    <span className="font-mono text-sm font-medium text-foreground">
                      {new Date(data.current.sunset).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: city.timezone })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/30 pt-2">
                    <span className="text-xs text-muted-foreground">Тривалість дня</span>
                    <span className="font-mono text-xs font-medium text-foreground">{data.current.dayLength}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-3 border-t border-border/30 pt-4">
              <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Координати
              </h3>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Широта</span>
                  <span className="font-mono text-xs text-foreground">{city.latLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Довгота</span>
                  <span className="font-mono text-xs text-foreground">{city.lonLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Часовий пояс</span>
                  <span className="font-mono text-xs text-foreground">{city.utcOffset}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metric cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        ) : data?.current ? (
          <section aria-label="Поточні показники">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <MiniCard icon={Wind} label="Вітер" value={`${Math.round(data.current.windSpeed)} км/г`} sub={getWindDirection(data.current.windDirection)} />
              <MiniCard icon={Droplets} label="Вологість" value={`${data.current.humidity}%`} sub={data.current.humidity > 80 ? "Висока" : data.current.humidity > 50 ? "Помірна" : "Низька"} />
              <MiniCard icon={Gauge} label="Тиск" value={`${Math.round(data.current.pressure)}`} sub="гПа" />
              <MiniCard icon={Cloud} label="Хмарність" value={`${data.current.cloudCover}%`} sub={data.current.cloudCover > 80 ? "Суцільна" : data.current.cloudCover > 40 ? "Мінлива" : "Малохмарно"} />
              <MiniCard icon={Sun} label="UV індекс" value={`${Math.round(data.current.uvIndex)}`} sub={data.current.uvIndex > 8 ? "Дуже високий" : data.current.uvIndex > 5 ? "Високий" : data.current.uvIndex > 2 ? "Помірний" : "Низький"} />
              <MiniCard icon={Activity} label="Kp індекс" value={`${Math.round(latestKp)}`} sub={kpStatus.label} color={kpStatus.color} />
            </div>
          </section>
        ) : null}

        {/* Air Quality */}
        {data?.airQuality && (
          <section aria-label="Якість повітря">
            <div className="rounded-lg border border-border/50 bg-card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-bold text-foreground">Якість повітря</h2>
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

        {/* 3-day Kp forecast */}
        <section className="rounded-lg border border-border/50 bg-card p-5 space-y-4" aria-label="Прогноз Kp індексу на 3 дні">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Прогноз Kp індексу на 3 дні (по 3-годинних інтервалах)
            </h2>
          </div>
          {forecastLoading ? (
            <p className="text-sm text-muted-foreground animate-pulse">Завантаження прогнозу...</p>
          ) : forecast && forecast.length > 0 ? (() => {
            const todayDate = new Date();
            const todayKey = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;
            const filtered = forecast.filter((row) => {
              const d = new Date(row.time_tag + "Z");
              const kyivStr = d.toLocaleDateString("sv-SE", { timeZone: city.timezone });
              return kyivStr >= todayKey;
            });
            const grouped = new Map<string, typeof forecast>();
            filtered.forEach((row) => {
              const dateKey = new Date(row.time_tag + "Z").toLocaleDateString("uk-UA", {
                weekday: "short", day: "numeric", month: "short", timeZone: city.timezone,
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
                          макс. Kp {maxKp.toFixed(1)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {rows.map((row, j) => {
                          const kpVal = Math.min(9, Math.max(0, Math.round(row.kp)));
                          return (
                            <div key={j} className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground font-mono">
                                {new Date(row.time_tag + "Z").toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: city.timezone })}
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
            <p className="text-sm text-muted-foreground">Дані прогнозу недоступні.</p>
          )}
          <p className="text-[11px] text-muted-foreground/60 border-t border-border/30 pt-3">
            Прогноз Kp індексу для міста {city.name} ({city.lat.toFixed(2)}°N) від NOAA Space Weather Prediction Center. Час — київський ({city.utcOffset}).
          </p>
        </section>

        {/* 27-day Kp forecast */}
        <section className="rounded-lg border border-border/50 bg-card p-5 space-y-4" aria-label="Прогноз Kp на 27 днів">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Прогноз Kp на 27 днів для {city.nameGenitive}
            </h2>
          </div>
          {forecast27Loading ? (
            <p className="text-sm text-muted-foreground animate-pulse">Завантаження прогнозу...</p>
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
                    <div className="text-muted-foreground/70">{d.toLocaleDateString("uk-UA", { weekday: "narrow" })}</div>
                    <div className="text-xs font-bold">{d.getDate()}</div>
                    <div className="text-[9px] opacity-80">Kp {day.kp}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Дані прогнозу недоступні.</p>
          )}
          <p className="text-[11px] text-muted-foreground/60 border-t border-border/30 pt-3">
            27-денний прогноз Kp-індексу для міста {city.name} ({city.lat.toFixed(2)}°N) від NOAA SWPC. Точність знижується з кожним днем — використовуйте для загального планування.
          </p>
        </section>

        {/* SEO text */}
        <section className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground/80 text-sm leading-relaxed" aria-label="Про сторінку">
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            Магнітні бурі в {city.nameGenitive} сьогодні, {new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric", timeZone: city.timezone })}
          </h2>
          <p>
            Актуальна інформація про магнітні бурі в {city.nameGenitive}, поточну погоду, якість повітря та час сходу й заходу сонця. Дані оновлюються кожні 5 хвилин на основі Open-Meteo API та NOAA Space Weather Prediction Center.
          </p>
        </section>
      </main>
    </div>
  );
};

export default CityPage;
