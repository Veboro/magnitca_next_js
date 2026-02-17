import { AlertTriangle, Zap } from "lucide-react";
import { useNoaaScales } from "@/hooks/useSpaceWeather";
import heroBg from "@/assets/hero-bg.jpg";
import ukraineOutline from "@/assets/ukraine-outline.png";

const gLabels: Record<number, string> = {
  0: "Спокійно",
  1: "G1 — Слабка буря",
  2: "G2 — Помірна буря",
  3: "G3 — Сильна буря",
  4: "G4 — Дуже сильна буря",
  5: "G5 — Екстремальна буря",
};

const gDescriptions: Record<number, string> = {
  0: "Геомагнітна активність у нормі. Значних збурень не очікується.",
  1: "Можливі слабкі коливання в енергомережах. Полярне сяйво на широтах 60°+.",
  2: "Можливі збої в енергомережах високих широт. Полярне сяйво на широтах 55°+.",
  3: "Можливі перебої з електропостачанням. Порушення GPS та радіозв'язку.",
  4: "Масштабні проблеми з енергопостачанням. Супутникова навігація порушена.",
  5: "Катастрофічні збої електромереж. Повне порушення радіозв'язку.",
};

export const StormStatusBanner = () => {
  const { data: scales } = useNoaaScales();
  const gLevel = scales?.g?.Scale ?? 0;

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
      <div className="relative p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary animate-pulse-glow" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {gLevel > 0 ? "Геомагнітна буря" : "Моніторинг космічної погоди"}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {gLabels[gLevel] || "Спокійно"}
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              {gDescriptions[gLevel] || gDescriptions[0]}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <AlertTriangle className="h-8 w-8 text-primary" />
            <div>
              <p className="font-mono text-lg font-bold text-foreground">
                {gLevel > 0 ? "АКТИВНА" : "НОРМА"}
              </p>
              <p className="text-xs text-muted-foreground">
                R{scales?.r?.Scale ?? 0} S{scales?.s?.Scale ?? 0} G{gLevel}
              </p>
            </div>
          </div>
        </div>
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
