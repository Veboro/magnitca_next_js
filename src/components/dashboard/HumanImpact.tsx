import { cn } from "@/lib/utils";
import { useNoaaScales, useKpIndex } from "@/hooks/useSpaceWeather";
import { Heart, Brain, BatteryLow, Frown, Smile, Meh } from "lucide-react";

const levels = [
  {
    label: "Спокійно",
    description: "Магнітне поле стабільне. Більшість людей не відчуває змін.",
    mood: Smile,
    symptoms: [],
    color: "hsl(145, 80%, 45%)",
    glowClass: "glow-green",
    pulseSpeed: "6s",
  },
  {
    label: "Слабкий вплив",
    description: "Можлива легка втома та зниження концентрації у чутливих людей.",
    mood: Smile,
    symptoms: ["Легка втома"],
    color: "hsl(55, 90%, 50%)",
    glowClass: "",
    pulseSpeed: "5s",
  },
  {
    label: "Помірний вплив",
    description: "Метеозалежні можуть відчувати головний біль, дратівливість, порушення сну.",
    mood: Meh,
    symptoms: ["Головний біль", "Дратівливість", "Порушення сну"],
    color: "hsl(35, 100%, 55%)",
    glowClass: "glow-amber",
    pulseSpeed: "4s",
  },
  {
    label: "Сильний вплив",
    description: "Можливі мігрені, тахікардія, різкі перепади настрою, тривожність.",
    mood: Frown,
    symptoms: ["Мігрень", "Тахікардія", "Тривожність", "Перепади настрою"],
    color: "hsl(15, 90%, 50%)",
    glowClass: "",
    pulseSpeed: "3s",
  },
  {
    label: "Екстремальний вплив",
    description: "Значний вплив на серцево-судинну та нервову системи. Рекомендовано уникати навантажень.",
    mood: Frown,
    symptoms: ["Сильний головний біль", "Аритмія", "Безсоння", "Запаморочення", "Тривога"],
    color: "hsl(0, 80%, 55%)",
    glowClass: "glow-red",
    pulseSpeed: "2s",
  },
];

const getImpactLevel = (kp: number): number => {
  if (kp <= 2) return 0;
  if (kp <= 3) return 1;
  if (kp <= 5) return 2;
  if (kp <= 7) return 3;
  return 4;
};

export const HumanImpact = ({ className }: { className?: string }) => {
  const { data: kpData } = useKpIndex();
  const { data: scales } = useNoaaScales();

  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const gLevel = scales?.g?.Scale ?? 0;
  const impactIdx = getImpactLevel(latestKp);
  const impact = levels[impactIdx];
  const MoodIcon = impact.mood;

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-4", className)}>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Вплив на організм
      </h3>

      <div className="flex items-center gap-4">
        {/* Silhouette */}
        <div className="relative flex-shrink-0">
          <svg
            width="80"
            height="150"
            viewBox="0 0 140 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-all duration-1000"
          >
            <defs>
              <radialGradient id="bodyGlow" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor={impact.color} stopOpacity="0.4">
                  <animate
                    attributeName="stopOpacity"
                    values="0.2;0.5;0.2"
                    dur={impact.pulseSpeed}
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor={impact.color} stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glow aura */}
            <ellipse cx="70" cy="120" rx="65" ry="120" fill="url(#bodyGlow)" />

            {/* Head */}
            <circle
              cx="70"
              cy="35"
              r="22"
              fill={impact.color}
              fillOpacity="0.15"
              stroke={impact.color}
              strokeWidth="1.5"
              filter="url(#glow)"
              className="transition-all duration-1000"
            >
              <animate
                attributeName="stroke-opacity"
                values="0.6;1;0.6"
                dur={impact.pulseSpeed}
                repeatCount="indefinite"
              />
            </circle>

            {/* Neck */}
            <line x1="70" y1="57" x2="70" y2="72" stroke={impact.color} strokeWidth="1.5" strokeOpacity="0.6" />

            {/* Body/torso */}
            <path
              d="M 70 72 L 70 160"
              stroke={impact.color}
              strokeWidth="1.5"
              strokeOpacity="0.7"
              className="transition-all duration-1000"
            />

            {/* Shoulders & Arms */}
            <path
              d="M 70 82 L 30 100 L 20 145"
              stroke={impact.color}
              strokeWidth="1.5"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M 70 82 L 110 100 L 120 145"
              stroke={impact.color}
              strokeWidth="1.5"
              strokeOpacity="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Legs */}
            <path
              d="M 70 160 L 45 245"
              stroke={impact.color}
              strokeWidth="1.5"
              strokeOpacity="0.6"
              strokeLinecap="round"
            />
            <path
              d="M 70 160 L 95 245"
              stroke={impact.color}
              strokeWidth="1.5"
              strokeOpacity="0.6"
              strokeLinecap="round"
            />

            {/* Heart area pulse */}
            {impactIdx >= 2 && (
              <circle cx="65" cy="100" r="6" fill={impact.color} fillOpacity="0.3" filter="url(#glow)">
                <animate
                  attributeName="r"
                  values="4;8;4"
                  dur={impact.pulseSpeed}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="fill-opacity"
                  values="0.2;0.5;0.2"
                  dur={impact.pulseSpeed}
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Brain area pulse */}
            {impactIdx >= 3 && (
              <circle cx="70" cy="30" r="8" fill={impact.color} fillOpacity="0.3" filter="url(#glow)">
                <animate
                  attributeName="r"
                  values="6;12;6"
                  dur={impact.pulseSpeed}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="fill-opacity"
                  values="0.15;0.4;0.15"
                  dur={impact.pulseSpeed}
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </svg>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <div>
            <div className="flex items-center gap-2">
              <MoodIcon className="h-4 w-4 transition-colors duration-1000" style={{ color: impact.color }} />
              <span
                className="font-display text-base font-bold transition-colors duration-1000"
                style={{ color: impact.color }}
              >
                {impact.label}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{impact.description}</p>
          </div>

          {impact.symptoms.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {impact.symptoms.map((s) => {
                // Extract HSL values for proper alpha support
                const hslMatch = impact.color.match(/hsl\(([^)]+)\)/);
                const hslValues = hslMatch ? hslMatch[1] : "0, 0%, 50%";
                return (
                  <span
                    key={s}
                    className="rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors duration-500"
                    style={{
                      borderColor: `hsla(${hslValues}, 0.2)`,
                      color: impact.color,
                      backgroundColor: `hsla(${hslValues}, 0.1)`,
                    }}
                  >
                    {s}
                  </span>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground">Kp {latestKp.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Brain className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground">G{gLevel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
