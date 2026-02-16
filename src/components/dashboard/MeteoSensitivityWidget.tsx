import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "lucide-react";

const getScoreColor = (score: number) => {
  if (score <= 30) return { text: "text-green-400", border: "border-green-500/50", glow: "shadow-green-500/20" };
  if (score <= 60) return { text: "text-yellow-400", border: "border-yellow-500/50", glow: "shadow-yellow-500/20" };
  if (score <= 80) return { text: "text-orange-400", border: "border-orange-500/50", glow: "shadow-orange-500/20" };
  return { text: "text-red-400", border: "border-red-500/50", glow: "shadow-red-500/20" };
};

const getScoreLabel = (score: number) => {
  if (score <= 30) return "Низька";
  if (score <= 60) return "Помірна";
  if (score <= 80) return "Висока";
  return "Дуже висока";
};

const CircleGauge = ({ value, blurred = false }: { value: number; blurred?: boolean }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const colors = getScoreColor(value);

  return (
    <div className={cn("relative flex items-center justify-center", blurred && "blur-[5px] select-none pointer-events-none opacity-60")}>
      <svg width="96" height="96" viewBox="0 0 96 96" className="transform -rotate-90">
        {/* Background circle */}
        <circle cx="48" cy="48" r={radius} fill="none" strokeWidth="6" className="stroke-border/30" />
        {/* Progress arc */}
        <circle
          cx="48" cy="48" r={radius}
          fill="none" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-all duration-700",
            value <= 30 ? "stroke-green-400" :
            value <= 60 ? "stroke-yellow-400" :
            value <= 80 ? "stroke-orange-400" : "stroke-red-400"
          )}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-xl font-bold font-mono leading-none", colors.text)}>
          {value}%
        </span>
        <span className={cn("text-[9px] font-medium mt-0.5", colors.text)}>
          {getScoreLabel(value)}
        </span>
      </div>
    </div>
  );
};

export const MeteoSensitivityWidget = ({ className }: { className?: string }) => {
  const { user } = useAuth();

  const { data: latestResult } = useQuery({
    queryKey: ["latest-test-result", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("test_results")
        .select("score, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const hasResult = !!user && !!latestResult;

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-4 flex flex-col items-center gap-3 relative overflow-hidden", className)}>
      <div className="flex items-center gap-2 w-full relative z-10">
        <Activity className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Рівень метеозалежності
        </h3>
      </div>

      {hasResult ? (
        <>
          <CircleGauge value={latestResult.score} />
          <a
            href="/test"
            className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Пройти ще раз
          </a>
        </>
      ) : (
        <>
          <CircleGauge value={64} blurred />
          {/* CTA overlay on top of blurred gauge */}
          <div className="absolute inset-x-0 top-10 bottom-0 flex flex-col items-center justify-center gap-2">
            <p className="text-[11px] text-muted-foreground text-center max-w-[160px]">
              Дізнайтесь свій рівень чутливості до магнітних бур
            </p>
            <a
              href={user ? "/test" : "/auth?redirect=/test"}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 font-mono text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Пройти тест
            </a>
          </div>
        </>
      )}
    </div>
  );
};
