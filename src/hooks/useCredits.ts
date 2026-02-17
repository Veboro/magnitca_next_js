import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useCredits(user: User | null) {
  const [credits, setCredits] = useState<number | null>(null);
  const [canShareToday, setCanShareToday] = useState(false);
  const [loadingCredits, setLoadingCredits] = useState(false);

  const loadAndResetCredits = useCallback(async () => {
    if (!user) return;
    setLoadingCredits(true);
    try {
      // Server-side daily reset check via SECURITY DEFINER function
      const { data, error } = await supabase.rpc("reset_daily_credits");
      if (error) {
        console.error("reset_daily_credits error:", error);
        return;
      }
      const result = data as any;
      if (result?.error) {
        console.error("reset_daily_credits:", result.error);
        return;
      }
      setCredits(result.credits ?? 3);
      setCanShareToday(result.can_share ?? false);
    } finally {
      setLoadingCredits(false);
    }
  }, [user]);

  useEffect(() => {
    loadAndResetCredits();
  }, [loadAndResetCredits]);

  const claimShareBonus = useCallback(async () => {
    if (!user || !canShareToday) return false;

    // Open Facebook share dialog
    const shareUrl = encodeURIComponent("https://magnetic-storm-hub.lovable.app");
    const shareTitle = encodeURIComponent("Магнітка — персональний прогноз космічної погоди");
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareTitle}`,
      "fb-share",
      "width=600,height=400"
    );

    // Server-side bonus claim via SECURITY DEFINER function
    const { data, error } = await supabase.rpc("claim_share_bonus");
    if (error) {
      console.error("claim_share_bonus error:", error);
      return false;
    }
    const result = data as any;
    if (result?.error) {
      console.error("claim_share_bonus:", result.error);
      return false;
    }
    if (result?.success) {
      setCredits(result.credits);
      setCanShareToday(false);
      return true;
    }
    return false;
  }, [user, canShareToday]);

  return { credits, setCredits, canShareToday, claimShareBonus, loadingCredits };
}
