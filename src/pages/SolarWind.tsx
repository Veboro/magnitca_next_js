import { usePageMeta } from "@/hooks/usePageMeta";
import { useSolarWind, useMagData } from "@/hooks/useSpaceWeather";
import { cn } from "@/lib/utils";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Wind, TrendingUp, Info, HelpCircle, Gauge, Zap } from "lucide-react";

const speedLevels = [
  { range: "< 300", status: "Повільний", color: "bg-storm-quiet", description: "Повільний сонячний вітер. Спокійні геомагнітні умови, мінімальний вплив на магнітосферу." },
  { range: "300–400", status: "Нормальний", color: "bg-storm-quiet", description: "Типова швидкість сонячного вітру. Стабільні умови, без впливу на технології та здоров'я." },
  { range: "400–500", status: "Підвищений", color: "bg-storm-minor", description: "Підвищена швидкість. Можливі незначні збурення магнітного поля, метеочутливі люди можуть відчувати легкий дискомфорт." },
  { range: "500–600", status: "Високий", color: "bg-storm-moderate", description: "Високошвидкісний потік. Ймовірність геомагнітних збурень, можливі збої GPS та головний біль." },
  { range: "600–800", status: "Дуже високий", color: "bg-storm-strong", description: "Дуже високошвидкісний потік. Високий ризик геомагнітної бурі, перебої радіозв'язку та навігації." },
  { range: "> 800", status: "Екстремальний", color: "bg-storm-severe", description: "Екстремальна швидкість сонячного вітру. Можливі сильні геомагнітні бурі, аварії енергомереж." },
];

const faqItems = [
  {
    q: "Що таке сонячний вітер?",
    a: "Сонячний вітер — це потік заряджених частинок (переважно протонів та електронів), що постійно виходить із зовнішньої атмосфери Сонця (корони). Його швидкість зазвичай становить 300–800 км/с.",
  },
  {
    q: "Як швидкість сонячного вітру впливає на Землю?",
    a: "Різке зростання швидкості сонячного вітру може спровокувати геомагнітну бурю. Чим вища швидкість — тим більший тиск на магнітосферу Землі, що призводить до збурень магнітного поля.",
  },
  {
    q: "Що таке густина сонячного вітру?",
    a: "Густина показує кількість частинок на кубічний сантиметр. Висока густина у поєднанні з високою швидкістю посилює вплив сонячного вітру на магнітосферу.",
  },
  {
    q: "Як часто оновлюються дані?",
    a: "Дані сонячного вітру на нашому сайті оновлюються щохвилини на основі вимірювань супутника DSCOVR, розташованого в точці Лагранжа L1 між Сонцем та Землею.",
  },
  {
    q: "Що таке Bz компонента?",
    a: "Bz — це вертикальна компонента міжпланетного магнітного поля (IMF). Від'ємне значення Bz (південне) полегшує проникнення сонячного вітру в магнітосферу, що збільшує ймовірність геомагнітної бурі.",
  },
];

const todayStr = () =>
  new Date().toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Kyiv",
  });

const toKyivTime = (utc: string) => {
  const d = new Date(utc.includes("T") ? utc : utc.replace(" ", "T") + "Z");
  return d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" });
};

const getSpeedColor = (speed: number) => {
  if (speed >= 800) return "text-storm-severe";
  if (speed >= 600) return "text-storm-strong";
  if (speed >= 500) return "text-storm-moderate";
  if (speed >= 400) return "text-storm-minor";
  return "text-storm-quiet";
};

const getSpeedStatus = (speed: number) => {
  if (speed >= 800) return "Екстремальний";
  if (speed >= 600) return "Дуже високий";
  if (speed >= 500) return "Високий";
  if (speed >= 400) return "Підвищений";
  if (speed >= 300) return "Нормальний";
  return "Повільний";
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-lg">
      <p className="mb-1 font-mono text-xs text-muted-foreground">{label} Київ</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="font-mono text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value} {entry.name === "Швидкість" ? "км/с" : entry.name === "Густина" ? "p/см³" : "нТ"}
        </p>
      ))}
    </div>
  );
};

const SolarWind = () => {
  const today = todayStr();

  usePageMeta(
    `Сонячний вітер сьогодні ${today} — швидкість та густина`,
    `Сонячний вітер зараз у реальному часі. Швидкість, густина та графік за останні 2 години. Дані NOAA DSCOVR оновлюються щохвилини.`,
    "/solar-wind"
  );

  const { data: windData, isLoading: windLoading } = useSolarWind();
  const { data: magData, isLoading: magLoading } = useMagData();

  const latestWind = windData?.length ? windData[windData.length - 1] : null;
  const latestMag = magData?.length ? magData[magData.length - 1] : null;

  const speedChartData = (windData || [])
    .filter((_, i) => i % 3 === 0)
    .map((d) => ({
      time: toKyivTime(d.time_tag),
      speed: d.speed,
      density: d.density,
    }));

  const magChartData = (magData || [])
    .filter((_, i) => i % 3 === 0)
    .map((d) => ({
      time: toKyivTime(d.time_tag),
      bz: d.bz,
      bt: d.bt,
    }));

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <main className="mx-auto max-w-5xl space-y-8 p-6" role="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />

        {/* Hero */}
        <header className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Сонячний вітер сьогодні, {today}
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Швидкість та густина сонячного вітру в реальному часі. Графік за останні 2 години та міжпланетне магнітне поле (IMF Bz). Дані супутника DSCOVR від NOAA SWPC.
          </p>
        </header>

        {/* Current values */}
        <section className="grid gap-6 md:grid-cols-3" aria-label="Поточні значення сонячного вітру">
          <div className="rounded-lg border border-border/50 bg-card p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Wind className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Швидкість
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className={cn("font-mono text-5xl font-bold text-glow-cyan", getSpeedColor(latestWind?.speed ?? 0))}>
                  {latestWind?.speed?.toFixed(0) ?? "—"}
                </span>
                <span className="text-muted-foreground text-sm">км/с</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getSpeedStatus(latestWind?.speed ?? 0)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Густина
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-5xl font-bold text-foreground text-glow-cyan">
                  {latestWind?.density?.toFixed(1) ?? "—"}
                </span>
                <span className="text-muted-foreground text-sm">p/см³</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {(latestWind?.density ?? 0) > 10 ? "Підвищена" : "Нормальна"}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                IMF Bz
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "font-mono text-5xl font-bold text-glow-cyan",
                  (latestMag?.bz ?? 0) < -5 ? "text-storm-severe" :
                  (latestMag?.bz ?? 0) < 0 ? "text-storm-moderate" : "text-storm-quiet"
                )}>
                  {latestMag?.bz?.toFixed(1) ?? "—"}
                </span>
                <span className="text-muted-foreground text-sm">нТ</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {(latestMag?.bz ?? 0) < -10 ? "Сильно південний" :
                 (latestMag?.bz ?? 0) < -5 ? "Південний" :
                 (latestMag?.bz ?? 0) < 0 ? "Слабо південний" : "Північний"}
              </p>
            </div>
          </div>
        </section>

        {/* Speed & Density Chart */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label="Графік швидкості та густини сонячного вітру">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Швидкість та густина — останні 2 години
            </h2>
          </div>
          {windLoading ? (
            <div className="flex h-64 items-center justify-center">
              <span className="font-mono text-sm text-muted-foreground animate-pulse">Завантаження...</span>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={speedChartData}>
                  <defs>
                    <linearGradient id="swSpeedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="swDensityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    interval={Math.floor(speedChartData.length / 6)}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={500} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: "500 км/с", fontSize: 10, fill: "hsl(var(--destructive))" }} />
                  <Area type="monotone" dataKey="speed" name="Швидкість" stroke="hsl(180, 100%, 50%)" fill="url(#swSpeedGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="density" name="Густина" stroke="hsl(35, 100%, 55%)" fill="url(#swDensityGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Bz Chart */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label="Графік IMF Bz">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Міжпланетне магнітне поле (Bz) — останні 2 години
            </h2>
          </div>
          {magLoading ? (
            <div className="flex h-64 items-center justify-center">
              <span className="font-mono text-sm text-muted-foreground animate-pulse">Завантаження...</span>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={magChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    interval={Math.floor(magChartData.length / 6)}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                  <ReferenceLine y={-5} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: "Bz -5", fontSize: 10, fill: "hsl(var(--destructive))" }} />
                  <Line type="monotone" dataKey="bz" name="Bz" stroke="hsl(280, 80%, 60%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="bt" name="Bt" stroke="hsl(var(--muted-foreground))" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/60 border-t border-border/30 pt-3">
            Від'ємне значення Bz (південне) полегшує проникнення сонячного вітру в магнітосферу Землі. Bz нижче -5 нТ значно підвищує ймовірність геомагнітної бурі.
          </p>
        </section>

        {/* Speed Levels Table */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label="Шкала швидкості сонячного вітру">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
            Шкала швидкості сонячного вітру (км/с)
          </h2>
          <div className="grid gap-2">
            {speedLevels.map((level) => (
              <div key={level.range} className="flex items-start gap-3 rounded-md border border-border/20 bg-muted/20 p-3">
                <span className={cn("mt-0.5 h-3 w-3 shrink-0 rounded-full", level.color)} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{level.range} км/с</span>
                    <span className="text-xs text-muted-foreground">— {level.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/80 mt-0.5">{level.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Text */}
        <section className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground/80 text-sm leading-relaxed" aria-label="Про сонячний вітер">
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            Що таке сонячний вітер і чому він важливий?
          </h2>
          <p>
            <strong>Сонячний вітер</strong> — це безперервний потік заряджених частинок (плазми), що витікає з верхньої атмосфери Сонця — корони. Його швидкість варіюється від 300 до понад 800 км/с, а густина — від одиниць до десятків частинок на кубічний сантиметр. Сонячний вітер несе із собою міжпланетне магнітне поле (IMF), яке взаємодіє з магнітосферою Землі.
          </p>
          <p>
            Коли швидкість сонячного вітру різко зростає (наприклад, через корональні діри або викиди корональної маси — CME), це може спричинити геомагнітну бурю. Особливо важливу роль відіграє компонента Bz міжпланетного магнітного поля: коли Bz стає від'ємним (південним), магнітосфера стає вразливішою. На цій сторінці ви знайдете поточні значення швидкості, густини сонячного вітру та IMF Bz у реальному часі від супутника DSCOVR (NOAA).
          </p>
        </section>

        {/* FAQ */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label="Часті питання про сонячний вітер">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Часті питання
            </h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="group rounded-md border border-border/20 bg-muted/10">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-4 pb-3 text-sm text-muted-foreground/80 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SolarWind;
