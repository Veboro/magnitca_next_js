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
      <div className="relative flex items-center justify-between p-6">
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
    </div>
  );
};
