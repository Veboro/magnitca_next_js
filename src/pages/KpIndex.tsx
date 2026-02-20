import { usePageMeta } from "@/hooks/usePageMeta";
import { useKpIndex, useNoaaScales } from "@/hooks/useSpaceWeather";
import { useKpForecast } from "@/hooks/useKpForecast";
import { KpIndexGauge } from "@/components/dashboard/KpIndexGauge";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Gauge, TrendingUp, Info, HelpCircle } from "lucide-react";

const kpLevels = [
  { kp: "0–1", status: "Спокійно", color: "bg-storm-quiet", description: "Мінімальна геомагнітна активність. Жодного впливу на технології та здоров'я." },
  { kp: "2–3", status: "Низька активність", color: "bg-storm-quiet", description: "Незначні коливання магнітного поля. Можливе слабке полярне сяйво на високих широтах." },
  { kp: "4", status: "Нестабільно", color: "bg-storm-minor", description: "Помітна геомагнітна активність. Метеочутливі люди можуть відчувати легкий дискомфорт." },
  { kp: "5 (G1)", status: "Мала буря", color: "bg-storm-moderate", description: "Слабка геомагнітна буря. Можливі збої GPS, головний біль у чутливих людей." },
  { kp: "6 (G2)", status: "Помірна буря", color: "bg-storm-moderate", description: "Помірна буря. Проблеми з HF-радіо, полярне сяйво видно на середніх широтах." },
  { kp: "7 (G3)", status: "Сильна буря", color: "bg-storm-strong", description: "Сильна буря. Перебої в енергомережах, супутникова навігація нестабільна." },
  { kp: "8 (G4)", status: "Дуже сильна", color: "bg-storm-severe", description: "Серйозна буря. Масштабні збої GPS та радіозв'язку, ризик для енергосистем." },
  { kp: "9 (G5)", status: "Екстремальна", color: "bg-storm-severe", description: "Екстремальна буря. Можливі аварії енергомереж, повне порушення радіозв'язку." },
];

const faqItems = [
  {
    q: "Що таке Kp індекс?",
    a: "Kp індекс — це планетарний індекс геомагнітної активності за шкалою від 0 до 9. Він розраховується кожні 3 години на основі даних магнітометрів, розташованих по всьому світу. Значення Kp≥5 означає геомагнітну бурю.",
  },
  {
    q: "Як часто оновлюється Kp індекс?",
    a: "На нашому сайті Kp індекс оновлюється щохвилини на основі оціночних (estimated) даних NOAA SWPC. Офіційний Kp розраховується кожні 3 години.",
  },
  {
    q: "Як Kp індекс впливає на здоров'я?",
    a: "При Kp≥4 метеочутливі люди можуть відчувати головний біль, втому, перепади артеріального тиску та порушення сну. При Kp≥6 ці симптоми посилюються і можуть торкнутися ширшого кола людей.",
  },
  {
    q: "Що означає G-шкала?",
    a: "G-шкала NOAA (G1–G5) класифікує геомагнітні бурі за інтенсивністю. G1 відповідає Kp=5, G2 — Kp=6, G3 — Kp=7, G4 — Kp=8, G5 — Kp=9.",
  },
  {
    q: "Де можна побачити прогноз Kp індексу?",
    a: "На цій сторінці ви знайдете 3-денний прогноз Kp індексу по 3-годинних інтервалах від NOAA Space Weather Prediction Center, а також поточне значення та історію за 24 години.",
  },
];

const todayStr = () =>
  new Date().toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Kyiv",
  });

const KpIndex = () => {
  const today = todayStr();

  usePageMeta(
    `Kp індекс сьогодні ${today} — прогноз магнітних бур`,
    `Kp індекс зараз у реальному часі. Поточне значення, графік за 24 години та 3-денний прогноз геомагнітної активності. Дані NOAA оновлюються щохвилини.`,
    "/kp-index"
  );

  const { data: kpData } = useKpIndex();
  const { data: scales } = useNoaaScales();
  const { data: forecast, isLoading: forecastLoading } = useKpForecast();

  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const kpRound = Math.min(9, Math.max(0, Math.round(latestKp)));

  const chartData = kpData?.map((d) => ({
    time: new Date(d.time_tag).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv" }),
    kp: d.kp,
  })) ?? [];

  // JSON-LD FAQ
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
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />

        {/* Hero */}
        <header className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Kp індекс сьогодні, {today}
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Планетарний індекс геомагнітної активності в реальному часі. Поточне значення, графік за останні 24 години та 3-денний прогноз від NOAA SWPC.
          </p>
        </header>

        {/* Current Kp + Gauge */}
        <section className="grid gap-6 md:grid-cols-2" aria-label="Поточний Kp індекс">
          <KpIndexGauge />
          <div className="rounded-lg border border-border/50 bg-card p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Поточний стан
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-5xl font-bold text-foreground text-glow-cyan">
                  {latestKp.toFixed(1)}
                </span>
                <span className="text-muted-foreground text-sm">/ 9.0</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {kpLevels[Math.min(kpRound, 7)]?.description}
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground/70 font-mono">
                <span>G-шкала: G{scales?.g?.Scale ?? 0}</span>
                <span>R-шкала: R{scales?.r?.Scale ?? 0}</span>
                <span>S-шкала: S{scales?.s?.Scale ?? 0}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 24h Chart */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label="Графік Kp індексу за 24 години">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Kp індекс за останні 24 години
            </h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  interval={Math.floor(chartData.length / 6)}
                />
                <YAxis
                  domain={[0, 9]}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <ReferenceLine y={5} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: "G1", fontSize: 10, fill: "hsl(var(--destructive))" }} />
                <Line type="monotone" dataKey="kp" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 3-day Kp forecast */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label="3-денний прогноз Kp індексу">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Прогноз Kp індексу на 3 дні (по 3-годинних інтервалах)
            </h2>
          </div>
          {forecastLoading ? (
            <p className="text-sm text-muted-foreground animate-pulse">Завантаження прогнозу...</p>
          ) : forecast && forecast.length > 0 ? (() => {
            // Group forecast entries by date
            const grouped = new Map<string, typeof forecast>();
            forecast.forEach((row) => {
              const dateKey = new Date(row.time_tag).toLocaleDateString("uk-UA", {
                weekday: "short", day: "numeric", month: "short", timeZone: "UTC",
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
                                {new Date(row.time_tag).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" })}
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
        </section>

        {/* Kp Levels Table */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label="Шкала Kp індексу">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
            Шкала Kp індексу (0–9)
          </h2>
          <div className="grid gap-2">
            {kpLevels.map((level) => (
              <div key={level.kp} className="flex items-start gap-3 rounded-md border border-border/20 bg-muted/20 p-3">
                <span className={cn("mt-0.5 h-3 w-3 shrink-0 rounded-full", level.color)} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">Kp {level.kp}</span>
                    <span className="text-xs text-muted-foreground">— {level.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/80 mt-0.5">{level.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Text */}
        <section className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground/80 text-sm leading-relaxed" aria-label="Про Kp індекс">
          <h2 className="text-lg font-display font-semibold text-foreground/90">
            Що таке Kp індекс і чому він важливий?
          </h2>
          <p>
            <strong>Kp індекс</strong> (планетарний K-індекс) — це глобальний показник геомагнітної активності Землі, який вимірюється за шкалою від 0 до 9. Він розраховується на основі даних мережі магнітометрів, розташованих по всьому світу, і оновлюється кожні 3 години. Значення Kp від 0 до 3 відповідає спокійним умовам, Kp 4 свідчить про нестабільну геомагнітну обстановку, а Kp≥5 означає початок геомагнітної бурі за шкалою NOAA (G1–G5).
          </p>
          <p>
            Kp індекс використовується для оцінки впливу сонячної активності на технології та здоров'я людей. При підвищеному Kp можливі збої GPS-навігації, перебої радіозв'язку, а метеочутливі люди можуть відчувати головний біль, втомлюваність та порушення сну. На цій сторінці ви знайдете поточне значення Kp індексу, графік його зміни за останні 24 години та детальний 3-денний прогноз від NOAA Space Weather Prediction Center.
          </p>
        </section>

        {/* FAQ */}
        <section className="rounded-lg border border-border/50 bg-card p-6" aria-label="Часті питання про Kp індекс">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Часті питання
            </h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="group border-b border-border/20 pb-3 last:border-0">
                <summary className="cursor-pointer text-sm font-medium text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-2 text-xs text-muted-foreground/80 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default KpIndex;
