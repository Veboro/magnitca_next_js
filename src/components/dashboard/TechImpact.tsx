import { cn } from "@/lib/utils";
import { useNoaaScales, useKpIndex } from "@/hooks/useSpaceWeather";
import { Wifi, Radio, Satellite, Zap, Navigation, MonitorSmartphone } from "lucide-react";

const levels = [
  {
    label: "Без впливу",
    description: "Усі системи працюють у штатному режимі.",
    effects: [],
    color: "hsl(145, 80%, 45%)",
    pulseSpeed: "6s",
  },
  {
    label: "Мінімальний вплив",
    description: "Можливі незначні коливання GPS-сигналу.",
    effects: ["GPS ±5м"],
    color: "hsl(55, 90%, 50%)",
    pulseSpeed: "5s",
  },
  {
    label: "Помірний вплив",
    description: "Збої GPS, проблеми з КХ-радіозв'язком, можливі перебої супутникового ТБ.",
    effects: ["GPS збої", "КХ-радіо", "Супутн. ТБ"],
    color: "hsl(35, 100%, 55%)",
    pulseSpeed: "4s",
  },
  {
    label: "Сильний вплив",
    description: "Перебої в енергомережах, збої навігації, деградація супутникових каналів.",
    effects: ["Енергомережі", "Навігація", "Супутники", "HF-радіо"],
    color: "hsl(15, 90%, 50%)",
    pulseSpeed: "3s",
  },
  {
    label: "Критичний вплив",
    description: "Масштабні збої електропостачання, повне порушення радіозв'язку та навігації.",
    effects: ["Блекаут", "Повна втрата GPS", "Радіо вимкнено", "Трансформатори"],
    color: "hsl(0, 80%, 55%)",
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

export const TechImpact = ({ className }: { className?: string }) => {
  const { data: kpData } = useKpIndex();
  const { data: scales } = useNoaaScales();

  const latestKp = kpData?.length ? kpData[kpData.length - 1].kp : 0;
  const gLevel = scales?.g?.Scale ?? 0;
  const rLevel = scales?.r?.Scale ?? 0;
  const impactIdx = getImpactLevel(latestKp);
  const impact = levels[impactIdx];

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-4", className)}>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Вплив на техніку
      </h3>

      <div className="flex items-center gap-4">
        {/* Tech SVG */}
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
              <radialGradient id="techGlow" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor={impact.color} stopOpacity="0.3">
                  <animate
                    attributeName="stopOpacity"
                    values="0.15;0.4;0.15"
                    dur={impact.pulseSpeed}
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor={impact.color} stopOpacity="0" />
              </radialGradient>
              <filter id="techGlowFilter">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glow aura */}
            <ellipse cx="70" cy="120" rx="60" ry="110" fill="url(#techGlow)" />

            {/* Satellite dish / antenna tower */}
            {/* Base */}
            <rect x="55" y="210" width="30" height="8" rx="2" stroke={impact.color} strokeWidth="1.5" strokeOpacity="0.6" fill={impact.color} fillOpacity="0.1" />
            {/* Tower */}
            <line x1="70" y1="210" x2="70" y2="100" stroke={impact.color} strokeWidth="2" strokeOpacity="0.7" />
            <line x1="55" y1="210" x2="70" y2="140" stroke={impact.color} strokeWidth="1" strokeOpacity="0.4" />
            <line x1="85" y1="210" x2="70" y2="140" stroke={impact.color} strokeWidth="1" strokeOpacity="0.4" />
            
            {/* Cross beams */}
            <line x1="58" y1="180" x2="82" y2="180" stroke={impact.color} strokeWidth="1" strokeOpacity="0.4" />
            <line x1="62" y1="160" x2="78" y2="160" stroke={impact.color} strokeWidth="1" strokeOpacity="0.4" />

            {/* Antenna top */}
            <circle cx="70" cy="95" r="5" stroke={impact.color} strokeWidth="1.5" fill={impact.color} fillOpacity="0.2" filter="url(#techGlowFilter)">
              <animate attributeName="fill-opacity" values="0.1;0.4;0.1" dur={impact.pulseSpeed} repeatCount="indefinite" />
            </circle>

            {/* Signal waves */}
            {[20, 32, 44].map((r, i) => (
              <path
                key={i}
                d={`M ${70 - r} ${95 - r * 0.4} A ${r} ${r} 0 0 1 ${70 + r} ${95 - r * 0.4}`}
                stroke={impact.color}
                strokeWidth="1"
                fill="none"
                strokeOpacity={impactIdx >= 1 ? 0.6 - i * 0.15 : 0.2}
              >
                <animate attributeName="stroke-opacity" values={`${0.1};${0.5 - i * 0.1};${0.1}`} dur={impact.pulseSpeed} repeatCount="indefinite" />
              </path>
            ))}

            {/* Lightning bolts when high impact */}
            {impactIdx >= 2 && (
              <>
                <path d="M 30 130 L 38 145 L 32 145 L 40 165" stroke={impact.color} strokeWidth="1.5" fill="none" filter="url(#techGlowFilter)">
                  <animate attributeName="stroke-opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
                </path>
                <path d="M 100 125 L 108 140 L 102 140 L 110 160" stroke={impact.color} strokeWidth="1.5" fill="none" filter="url(#techGlowFilter)">
                  <animate attributeName="stroke-opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                </path>
              </>
            )}

            {/* Disruption X marks for extreme */}
            {impactIdx >= 3 && (
              <g filter="url(#techGlowFilter)">
                <line x1="25" y1="70" x2="40" y2="85" stroke={impact.color} strokeWidth="2" strokeOpacity="0.8">
                  <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="1.2s" repeatCount="indefinite" />
                </line>
                <line x1="40" y1="70" x2="25" y2="85" stroke={impact.color} strokeWidth="2" strokeOpacity="0.8">
                  <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="1.2s" repeatCount="indefinite" />
                </line>
              </g>
            )}
          </svg>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <div>
            <div className="flex items-center gap-2">
              <Satellite className="h-4 w-4 transition-colors duration-1000" style={{ color: impact.color }} />
              <span
                className="font-display text-base font-bold transition-colors duration-1000"
                style={{ color: impact.color }}
              >
                {impact.label}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{impact.description}</p>
          </div>

          {impact.effects.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {impact.effects.map((e) => (
                <span
                  key={e}
                  className="rounded-full border px-2 py-0.5 text-[10px] transition-colors duration-500"
                  style={{
                    borderColor: `${impact.color}33`,
                    color: impact.color,
                    backgroundColor: `${impact.color}10`,
                  }}
                >
                  {e}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Radio className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground">R{rLevel}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground">G{gLevel}</span>
            </div>
            <div className="flex items-center gap-1">
              <Navigation className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground">Kp {latestKp.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
