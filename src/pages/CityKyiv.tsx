import { usePageMeta } from "@/hooks/usePageMeta";
import { useCityWeather, getWeatherLabel, getWeatherEmoji, getAqiLabel } from "@/hooks/useCityWeather";
import { useNoaaScales, useKpIndex } from "@/hooks/useSpaceWeather";
import { useKpForecast } from "@/hooks/useKpForecast";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Wind, Droplets, Gauge, Sun, Sunrise, Sunset, Cloud, Eye, Activity, AlertTriangle, MapPin, Info, CalendarDays } from "lucide-react";
import { StormStatusBanner } from "@/components/dashboard/StormStatusBanner";

const getKpStatus = (kp: number) => {
  if (kp <= 2) return { label: "Спокійно", color: "hsl(145, 80%, 45%)" };
  if (kp <= 3) return { label: "Низька активність", color: "hsl(55, 90%, 50%)" };
  if (kp <= 5) return { label: "Помірна буря", color: "hsl(35, 100%, 55%)" };
  if (kp <= 7) return { label: "Сильна буря", color: "hsl(15, 90%, 50%)" };
  return { label: "Екстремальна буря", color: "hsl(0, 80%, 55%)" };
};

const CityKyiv = () => {
  const { data, isLoading } = useCityWeather();
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

  const todayDate = new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });

  usePageMeta(
    "Магнітні бурі в Києві сьогодні — погода, якість повітря",
    `Магнітні бурі в Києві ${todayDate}: Kp ${Math.round(latestKp)} — ${kpStatus.label.toLowerCase()}. Прогноз, погода, якість повітря в реальному часі.`
  );

  const today = new Date().toLocaleDateString("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Kyiv",
  });

  return (
    <div className="min-h-screen bg-background grid-bg">
      <main className="mx-auto max-w-7xl space-y-6 p-6" role="main">
        <h1 className="sr-only">Магнітні бурі в Києві — погода та якість повітря</h1>

        {/* Three-column hero */}
        {/* Storm + Sun/Coords row */}
        <section className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 items-stretch" aria-label="Статус геомагнітної активності в Києві">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-glow-cyan bg-card/50 px-4 py-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-medium text-muted-foreground">
                Геомагнітна ситуація в Києві — {today}
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
                  Схід / Захід сонця
                </h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Sunrise className="h-3.5 w-3.5 text-amber-400" />Схід</span>
                  <span className="font-mono font-medium text-foreground">{new Date(data.current.sunrise).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" })}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Sunset className="h-3.5 w-3.5 text-orange-400" />Захід</span>
                  <span className="font-mono font-medium text-foreground">{new Date(data.current.sunset).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" })}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-border/30 pt-1.5">
                  <span className="text-muted-foreground">Тривалість дня</span>
                  <span className="font-mono font-medium text-foreground">{data.current.dayLength}</span>
                </div>
              </div>
            )}
            <div className="space-y-1.5 border-t border-border/30 pt-2">
              <h3 className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Координати
              </h3>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Широта</span>
                <span className="font-mono text-foreground">50.4501° Пн</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Довгота</span>
                <span className="font-mono text-foreground">30.5234° Сх</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Часовий пояс</span>
                <span className="font-mono text-foreground">UTC+2 (EET)</span>
              </div>
            </div>
            <div className="space-y-1.5 border-t border-border/30 pt-2">
              <h3 className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                <Activity className="h-3.5 w-3.5 text-primary" />
                Радіаційний фон
              </h3>
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-foreground">0.08–0.14</span>
                <span className="text-[10px] text-muted-foreground">мкЗв/год</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-storm-quiet/15 border border-storm-quiet/30 px-2 py-0.5 text-[9px] font-medium text-storm-quiet">В межах норми</span>
                <a href="https://www.saveecobot.com/radiation/misto-kyiv" target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline">SaveEcoBot →</a>
              </div>
            </div>
          </div>
        </section>

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
              const dateKey = new Date(row.time_tag + "Z").toLocaleDateString("uk-UA", {
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
                          макс. Kp {maxKp.toFixed(1)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {rows.map((row, j) => {
                          const kpVal = Math.min(9, Math.max(0, Math.round(row.kp)));
                          return (
                            <div key={j} className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground font-mono">
                                {new Date(row.time_tag + "Z").toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Kyiv" })}
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
            Прогноз Kp індексу для Києва (50.45°N) від NOAA Space Weather Prediction Center. Час — київський (UTC+2).
          </p>
        </section>

        {/* 27-day Kp forecast */}
        <section className="rounded-lg border border-border/50 bg-card p-5 space-y-4" aria-label="Прогноз Kp на 27 днів">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Прогноз Kp на 27 днів для Києва
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
            27-денний прогноз Kp-індексу для Києва (50.45°N) від NOAA SWPC. Точність знижується з кожним днем — використовуйте для загального планування.
          </p>
        </section>

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

        {/* Metric cards grid */}
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

        {/* SEO text */}
        <section className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground/80 text-sm leading-relaxed" aria-label="Про сторінку">
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            Магнітні бурі в Києві сьогодні, {new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" })}
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
            const dateStr = new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" });

            return (
              <p>
                Київ, {dateStr}. Поточний Kp-індекс — {latestKp.toFixed(1)}, рівень геомагнітної бурі — G{gLevel}.
                {kpValues.length > 0 && ` Прогнозований діапазон Kp за добу: ${minKp.toFixed(1)}–${maxKp.toFixed(1)}.`}
                {" "}Шкала радіозатемнень — R{rScale}, шкала радіаційних бур — S{sScale}.
                {data?.current && ` Температура повітря — ${Math.round(data.current.temperature)}°C, тиск — ${Math.round(data.current.pressure)} гПа, вологість — ${data.current.humidity}%, вітер — ${Math.round(data.current.windSpeed)} км/год (${getWindDirection(data.current.windDirection)}).`}
                {data?.airQuality && ` Індекс якості повітря AQI — ${data.airQuality.aqi}, PM2.5 — ${(Math.round(data.airQuality.pm25 * 10) / 10)} мкг/м³.`}
                {" "}Дані: NOAA SWPC, Open-Meteo.
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

function getWindDirection(deg: number): string {
  const dirs = ["Пн", "ПнСх", "Сх", "ПдСх", "Пд", "ПдЗх", "Зх", "ПнЗх"];
  return dirs[Math.round(deg / 45) % 8];
}

export default CityKyiv;
