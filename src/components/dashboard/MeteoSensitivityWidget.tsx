import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Lock } from "lucide-react";

const getScoreColor = (score: number) => {
  if (score <= 30) return "text-green-400 border-green-500/40";
  if (score <= 60) return "text-yellow-400 border-yellow-500/40";
  if (score <= 80) return "text-orange-400 border-orange-500/40";
  return "text-red-400 border-red-500/40";
};

const getScoreLabel = (score: number) => {
  if (score <= 30) return "Низька";
  if (score <= 60) return "Помірна";
  if (score <= 80) return "Висока";
  return "Дуже висока";
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

  // Guest view — blurred circle + CTA
  if (!user || !latestResult) {
    const isAuthedNoResult = !!user && !latestResult;

    return (
      <div className={cn("rounded-lg border border-border/50 bg-card p-4 flex flex-col items-center gap-3 relative overflow-hidden", className)}>
        <div className="flex items-center gap-2 w-full relative z-10">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Рівень метеозалежності
          </h3>
        </div>

        {/* Blurred fake gauge */}
        <div className="select-none pointer-events-none blur-[6px] opacity-50 flex flex-col items-center gap-1 py-2">
          <div className="relative h-20 w-20 rounded-full border-4 border-yellow-500/40 flex items-center justify-center">
            <span className="text-2xl font-bold font-mono text-yellow-400">64%</span>
          </div>
          <span className="text-xs text-muted-foreground">Помірна</span>
        </div>

        {/* CTA overlay */}
        <div className="absolute inset-x-0 top-8 bottom-0 flex flex-col items-center justify-center gap-2 bg-card/60 backdrop-blur-[2px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
            <Lock className="h-4 w-4 text-primary" />
          </div>
          <p className="text-[11px] text-muted-foreground text-center max-w-[160px]">
            {isAuthedNoResult
              ? "Пройдіть тест, щоб дізнатися свій рівень"
              : "Пройдіть тест на метеозалежність"}
          </p>
          <a
            href={isAuthedNoResult ? "/test" : "/auth?redirect=/test"}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 font-mono text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Пройти тест
          </a>
        </div>
      </div>
    );
  }

  // Authenticated user with result
  const score = latestResult.score;

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-4 flex flex-col items-center gap-3", className)}>
      <div className="flex items-center gap-2 w-full">
        <Activity className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Рівень метеозалежності
        </h3>
      </div>

      <div className={cn("relative h-20 w-20 rounded-full border-4 flex items-center justify-center", getScoreColor(score))}>
        <span className={cn("text-2xl font-bold font-mono", getScoreColor(score).split(" ")[0])}>
          {score}%
        </span>
      </div>
      <span className={cn("text-xs font-medium", getScoreColor(score).split(" ")[0])}>
        {getScoreLabel(score)}
      </span>

      <a
        href="/test"
        className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
      >
        Пройти ще раз
      </a>
    </div>
  );
};
