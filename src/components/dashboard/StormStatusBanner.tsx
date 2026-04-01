import { AlertTriangle, Zap, TrendingUp } from "lucide-react";
import { useNoaaScales, useKpIndex } from "@/hooks/useSpaceWeather";
import { useKpForecast } from "@/hooks/useKpForecast";
import heroBg from "@/assets/hero-bg.jpg";
import ukraineOutline from "@/assets/ukraine-outline.png";

const getEffectiveLevel = (gLevel: number, kp: number): number => {
  // Use the higher of G-scale or Kp-derived level
  const kpLevel = kp < 4 ? 0 : kp < 5 ? 1 : kp < 6 ? 2 : kp < 7 ? 3 : kp < 8 ? 4 : 5;
  return Math.max(gLevel, kpLevel);
};

const levelLabels: Record<number, string> = {
  0: "Спокійно",
  1: "G1 — Слабка буря",
  2: "G2 — Помірна буря",
  3: "G3 — Сильна буря",
  4: "G4 — Дуже сильна буря",
  5: "G5 — Екстремальна буря",
};

const levelColors: Record<number, string> = {
  0: "hsl(145, 80%, 45%)",
  1: "hsl(55, 90%, 50%)",
  2: "hsl(35, 100%, 55%)",
  3: "hsl(15, 90%, 50%)",
  4: "hsl(0, 80%, 55%)",
  5: "hsl(0, 80%, 55%)",
};

const levelDescriptions: Record<number, string> = {
  0: "Геомагнітна активність у нормі. Значних збурень не очікується.",
  1: "Можливі слабкі коливання в енергомережах. Полярне сяйво на широтах 60°+.",
  2: "Можливі збої в енергомережах високих широт. Полярне сяйво на широтах 55°+.",
  3: "Можливі перебої з електропостачанням. Порушення GPS та радіозв'язку.",
  4: "Масштабні проблеми з енергопостачанням. Супутникова навігація порушена.",
  5: "Катастрофічні збої електромереж. Повне порушення радіозв'язку.",
};

const kpEffects = [
  { min: 0, max: 1, label: "Мінімальний", effects: "Жодного впливу на техніку та самопочуття." },
  { min: 1, max: 2, label: "Слабкий", effects: "Можливе незначне погіршення GPS-точності (±3-5 м)." },
  { min: 2, max: 3, label: "Незначний", effects: "Метеочутливі люди можуть відчувати легке нездужання." },
  { min: 3, max: 4, label: "Нестабільний", effects: "Головний біль, втома у чутливих людей. GPS ±5-10 м." },
  { min: 4, max: 5, label: "Активний", effects: "Можливі порушення сну, дратівливість. Збої КХ-радіозв'язку." },
  { min: 5, max: 6, label: "Буря G1", effects: "Збої GPS-навігації, деградація радіозв'язку. Підвищений тиск, тахікардія." },
  { min: 6, max: 7, label: "Буря G2", effects: "Серйозні збої GPS та супутникового ТБ. Ризик перебоїв електромережі." },
  { min: 7, max: 8, label: "Сильна буря", effects: "Масштабні збої навігації та зв'язку. Загроза для трансформаторів." },
  { min: 8, max: 10, label: "Екстремальна", effects: "Повна втрата GPS та КХ-радіо. Можливі блекаути." },
];

const getKpEffect = (kp: number) => {
  return kpEffects.find((e) => kp >= e.min && kp < e.max) || kpEffects[kpEffects.length - 1];
};

export const StormStatusBanner = () => {
  const { data: scales } = useNoaaScales();
  const { data: kpData } = useKpIndex();
  const { data: forecast = [] } = useKpForecast();

  const gLevel = scales?.g?.Scale ?? 0;
  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const effectiveLevel = getEffectiveLevel(gLevel, latestKp);
  const color = levelColors[effectiveLevel] || levelColors[0];
  const kpEffect = getKpEffect(latestKp);

  // Max Kp for today (Kyiv timezone) + next 24h
  const now = new Date();
  const kyivDate = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Kyiv" }));
  const todayStr = `${kyivDate.getFullYear()}-${String(kyivDate.getMonth() + 1).padStart(2, "0")}-${String(kyivDate.getDate()).padStart(2, "0")}`;
  
  const todayAndNext = forecast.filter((e) => {
    const tag = e.time_tag.slice(0, 10);
    const t = new Date(e.time_tag);
    // Include all of today + future entries within 24h
    return tag === todayStr || (t >= now && t <= new Date(now.getTime() + 24 * 60 * 60 * 1000));
  });
  const maxKp24h = todayAndNext.length > 0 ? Math.max(...todayAndNext.map((e) => e.kp)) : null;

  return (
    <div className="relative overflow-hidden rounded-lg border border-glow-cyan">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div
        className="absolute inset-0 bg-contain bg-no-repeat bg-right-bottom opacity-15 mix-blend-screen"
        style={{ backgroundImage: `url(${ukraineOutline})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="relative p-6 space-y-4">
        {/* Top row: status + indicator */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary animate-pulse-glow" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {effectiveLevel > 0 ? "Геомагнітна буря" : "Моніторинг космічної погоди"}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {levelLabels[effectiveLevel] || "Спокійно"}
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              {levelDescriptions[effectiveLevel] || levelDescriptions[0]}
            </p>
          </div>
          <div
            className="hidden md:flex flex-col items-center justify-center rounded-full border border-primary/20 w-24 h-24 ml-6 flex-shrink-0 transition-colors duration-700"
            style={{
              backgroundColor: `${color}15`,
              borderColor: `${color}40`,
              boxShadow: `0 0 20px ${color}20`,
            }}
          >
            <AlertTriangle className="h-6 w-6 transition-colors duration-700" style={{ color }} />
            <p className="font-mono text-xs font-bold text-foreground mt-1">
              {effectiveLevel > 0 ? "АКТИВНА" : "НОРМА"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              R{scales?.r?.Scale ?? 0} S{scales?.s?.Scale ?? 0} G{gLevel}
            </p>
          </div>
        </div>

        {/* Kp impact detail row */}
        <div className="flex flex-wrap items-start gap-4 rounded-md border border-border/40 bg-background/40 p-3">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-md w-12 h-12 font-mono text-lg font-bold transition-colors duration-500"
              style={{
                backgroundColor: `${color}15`,
                color,
                border: `1px solid ${color}30`,
              }}
            >
              {latestKp.toFixed(1)}
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">
                Kp-індекс зараз: <span style={{ color }}>{kpEffect.label}</span>
              </p>
              <p className="text-[11px] text-muted-foreground max-w-sm">{kpEffect.effects}</p>
            </div>
          </div>
          {maxKp24h !== null && (
            <div className="flex items-center gap-2 ml-auto">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Макс. 24г</p>
                <p className="font-mono text-sm font-bold" style={{ color: levelColors[getEffectiveLevel(0, maxKp24h)] }}>
                  Kp {maxKp24h.toFixed(1)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Telegram CTA */}
        <a
          href="https://t.me/+7UKzAK5ur8UxZmMy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          Підключити сповіщення в Telegram
        </a>
      </div>
    </div>
  );
};
