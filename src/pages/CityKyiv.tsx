import { usePageMeta } from "@/hooks/usePageMeta";
import { useCityWeather, getWeatherLabel, getWeatherEmoji, getAqiLabel } from "@/hooks/useCityWeather";
import { useNoaaScales, useKpIndex } from "@/hooks/useSpaceWeather";
import { Skeleton } from "@/components/ui/skeleton";
import { Wind, Droplets, Gauge, Sun, Sunrise, Sunset, Cloud, Eye, Thermometer, Activity, AlertTriangle } from "lucide-react";
import kyivOutline from "@/assets/kyiv-outline.png";

const getKpStatus = (kp: number) => {
  if (kp <= 2) return { label: "Спокійно", color: "hsl(145, 80%, 45%)" };
  if (kp <= 3) return { label: "Низька активність", color: "hsl(55, 90%, 50%)" };
  if (kp <= 5) return { label: "Помірна буря", color: "hsl(35, 100%, 55%)" };
  if (kp <= 7) return { label: "Сильна буря", color: "hsl(15, 90%, 50%)" };
  return { label: "Екстремальна буря", color: "hsl(0, 80%, 55%)" };
};

const CityKyiv = () => {
  usePageMeta(
    "Магнітні бурі в Києві сьогодні — погода, якість повітря",
    "Магнітні бурі в Києві сьогодні: Kp індекс, погода, схід і захід сонця, якість повітря. Актуальні дані для Києва в реальному часі."
  );

  const { data, isLoading } = useCityWeather();
  const { data: kpData } = useKpIndex();
  const { data: scales } = useNoaaScales();
  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const gLevel = scales?.g?.Scale ?? 0;
  const kpStatus = getKpStatus(latestKp);

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

        {/* Hero banner with Kyiv outline */}
        <section className="relative overflow-hidden rounded-lg border border-glow-cyan" aria-label="Статус Києва">
          <div className="absolute inset-0 bg-gradient-to-br from-card via-card/90 to-card/60" />
          <div
            className="absolute inset-0 bg-contain bg-no-repeat bg-right opacity-[0.07] mix-blend-screen"
            style={{ backgroundImage: `url(${kyivOutline})`, backgroundPosition: "85% center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/70 to-transparent" />

          <div className="relative p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-storm-quiet animate-pulse-glow" />
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    Київ • {today}
                  </span>
                </div>

                {isLoading ? (
                  <Skeleton className="h-16 w-48" />
                ) : data?.current ? (
                  <>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl md:text-6xl font-display font-bold text-foreground">
                        {Math.round(data.current.temperature)}°
                      </span>
                      <span className="text-2xl">{getWeatherEmoji(data.current.weatherCode)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getWeatherLabel(data.current.weatherCode)} • Відчувається як {Math.round(data.current.feelsLike)}°
                    </p>
                  </>
                ) : null}

                {/* Magnetic storm mini-status */}
                <div className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium"
                  style={{
                    borderColor: `${kpStatus.color}40`,
                    backgroundColor: `${kpStatus.color}10`,
                    color: kpStatus.color,
                  }}
                >
                  <Activity className="h-3.5 w-3.5" />
                  Kp {Math.round(latestKp)} — {kpStatus.label}
                  {gLevel > 0 && <span className="ml-1">• G{gLevel}</span>}
                </div>
              </div>

              {/* Sun times */}
              {data?.current && (
                <div className="hidden md:flex flex-col gap-2 text-right shrink-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sunrise className="h-4 w-4 text-amber-400" />
                    <span className="font-mono">{new Date(data.current.sunrise).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sunset className="h-4 w-4 text-orange-400" />
                    <span className="font-mono">{new Date(data.current.sunset).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sun className="h-4 w-4 text-yellow-400" />
                    <span className="font-mono text-xs">{data.current.dayLength}</span>
                  </div>
                </div>
              )}
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

        {/* 7-day forecast */}
        {data?.daily && data.daily.length > 0 && (
          <section aria-label="Прогноз на 7 днів">
            <div className="rounded-lg border border-border/50 bg-card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Thermometer className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-bold text-foreground">Прогноз на 7 днів</h2>
              </div>
              <div className="space-y-2">
                {data.daily.map((d) => (
                  <div key={d.date} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent/30 transition-colors">
                    <span className="w-16 font-mono text-xs text-muted-foreground shrink-0">
                      {new Date(d.date).toLocaleDateString("uk-UA", { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/Kyiv" })}
                    </span>
                    <span className="text-lg w-8 text-center">{getWeatherEmoji(d.weatherCode)}</span>
                    <span className="text-xs text-muted-foreground w-24 hidden sm:block">{getWeatherLabel(d.weatherCode)}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground w-8 text-right">{Math.round(d.tempMin)}°</span>
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400 transition-all"
                          style={{
                            marginLeft: `${((d.tempMin + 30) / 70) * 100}%`,
                            width: `${((d.tempMax - d.tempMin) / 70) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs font-medium text-foreground w-8">{Math.round(d.tempMax)}°</span>
                    </div>
                    <div className="hidden md:flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Sunrise className="h-3 w-3 text-amber-400" />
                        {new Date(d.sunrise).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sunset className="h-3 w-3 text-orange-400" />
                        {new Date(d.sunset).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Hourly forecast */}
        {data?.hourly && data.hourly.length > 0 && (
          <section aria-label="Погодинний прогноз">
            <div className="rounded-lg border border-border/50 bg-card p-5 space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Погодинний прогноз</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {data.hourly.map((h) => (
                  <div key={h.time} className="flex flex-col items-center gap-1.5 shrink-0 min-w-[52px]">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {new Date(h.time).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" })}
                    </span>
                    <span className="text-base">{getWeatherEmoji(h.weatherCode)}</span>
                    <span className="font-mono text-xs font-medium text-foreground">{Math.round(h.temperature)}°</span>
                    {h.precipitation > 0 && (
                      <span className="font-mono text-[9px] text-blue-400">{h.precipitation}мм</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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
