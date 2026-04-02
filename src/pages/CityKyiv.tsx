import { usePageMeta } from "@/hooks/usePageMeta";
import { useCityWeather, getWeatherLabel, getWeatherEmoji, getAqiLabel } from "@/hooks/useCityWeather";
import { useNoaaScales, useKpIndex } from "@/hooks/useSpaceWeather";
import { useKpForecast } from "@/hooks/useKpForecast";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Wind, Droplets, Gauge, Sun, Sunrise, Sunset, Cloud, Eye, Activity, AlertTriangle, MapPin, Info, CalendarDays } from "lucide-react";

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
        <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-4" aria-label="Статус Києва">
          {/* 1. Storm info */}
          <div className="rounded-lg border border-glow-cyan bg-card p-5 space-y-3 flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary animate-pulse-glow" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {gLevel > 0 ? "Буря • Київ" : "Моніторинг • Київ"}
                </span>
              </div>
              <div
                className="flex flex-col items-center justify-center rounded-full border w-16 h-16 shrink-0 transition-colors duration-700"
                style={{
                  backgroundColor: `${kpStatus.color}15`,
                  borderColor: `${kpStatus.color}40`,
                  boxShadow: `0 0 20px ${kpStatus.color}20`,
                }}
              >
                <AlertTriangle className="h-4 w-4 transition-colors duration-700" style={{ color: kpStatus.color }} />
                <p className="font-mono text-[10px] font-bold text-foreground mt-0.5">
                  {gLevel > 0 ? "БУРЯ" : "НОРМА"}
                </p>
                <p className="text-[8px] text-muted-foreground">
                  Kp {Math.round(latestKp)} • G{gLevel}
                </p>
              </div>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Kp {Math.round(latestKp)} — {kpStatus.label}
            </h2>
            <p className="text-sm text-muted-foreground flex-1">
              {gLevel >= 3
                ? "Можливі перебої з GPS та радіозв'язком. Метеозалежні люди можуть відчувати нездужання."
                : gLevel > 0
                ? "Слабка геомагнітна активність. Метеочутливі люди можуть відчувати незначний вплив."
                : "Геомагнітна обстановка спокійна. Значних збурень не очікується."}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {data?.current && (
                <div className="inline-flex items-center gap-2 rounded-md border border-border/50 bg-muted/30 px-2 py-1 text-[11px] text-muted-foreground">
                  <span>{getWeatherEmoji(data.current.weatherCode)} {Math.round(data.current.temperature)}°</span>
                  <span className="border-l border-border/50 pl-2">{today}</span>
                </div>
              )}
              <a
                href="https://t.me/+7UKzAK5ur8UxZmMy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Telegram
              </a>
            </div>
          </div>

          {/* Right half: two cards stacked */}
          <div className="grid grid-rows-2 gap-4">
          {/* 2. Radiation */}
          <div className="rounded-lg border border-border/50 bg-card p-5 space-y-3 flex flex-col">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
              <Activity className="h-4 w-4 text-primary" />
              Радіаційний фон
            </h3>
            <div>
              <span className="font-mono text-3xl font-bold text-foreground">0.08–0.14</span>
              <span className="ml-1 text-xs text-muted-foreground">мкЗв/год</span>
            </div>
            <span className="inline-flex items-center rounded-full bg-green-500/15 border border-green-500/30 px-2 py-0.5 text-[10px] font-medium text-green-400">
              В межах норми
            </span>
            <p className="text-xs text-muted-foreground flex-1">
              Дані збираються з автоматичних онлайн-станцій та постів спостереження у Києві.
            </p>
            <a
              href="https://www.saveecobot.com/radiation/misto-kyiv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-primary hover:underline"
            >
              Деталі на SaveEcoBot →
            </a>
          </div>

          {/* 3. Coordinates + Sun */}
          <div className="rounded-lg border border-border/50 bg-card p-5 space-y-4 flex flex-col">
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
                      {new Date(data.current.sunrise).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sunset className="h-4 w-4 text-orange-400" />
                      <span>Захід</span>
                    </div>
                    <span className="font-mono text-sm font-medium text-foreground">
                      {new Date(data.current.sunset).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/30 pt-2">
                    <span className="text-xs text-muted-foreground">Тривалість дня</span>
                    <span className="font-mono text-xs font-medium text-foreground">{data.current.dayLength}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-3 border-t border-border/30 pt-3">
              <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Координати
              </h3>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Широта</span>
                  <span className="font-mono text-xs text-foreground">50.4501° Пн</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Довгота</span>
                  <span className="font-mono text-xs text-foreground">30.5234° Сх</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Часовий пояс</span>
                  <span className="font-mono text-xs text-foreground">UTC+2 (EET)</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

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
              {/* AQI bar */}
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
              const kyivStr = d.toLocaleDateString("sv-SE", { timeZone: "Europe/Kyiv" });
              return kyivStr >= todayKey;
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


        {/* SEO text */}
        <section className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground/80 text-sm leading-relaxed" aria-label="Про сторінку">
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            Магнітні бурі в Києві сьогодні, {new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" })}
          </h2>
          <p>
            Актуальна інформація про магнітні бурі в Києві, поточну погоду, якість повітря та час сходу й заходу сонця. Дані оновлюються кожні 5 хвилин на основі Open-Meteo API та NOAA Space Weather Prediction Center.
          </p>
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
