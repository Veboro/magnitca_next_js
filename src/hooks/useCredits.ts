import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const DAILY_CREDITS = 3;
const SHARE_BONUS = 3;

function isNewDay(dateStr: string | null): boolean {
  if (!dateStr) return true;
  const last = new Date(dateStr);
  const now = new Date();
  return (
    last.getUTCFullYear() !== now.getUTCFullYear() ||
    last.getUTCMonth() !== now.getUTCMonth() ||
    last.getUTCDate() !== now.getUTCDate()
  );
}

export function useCredits(user: User | null) {
  const [credits, setCredits] = useState<number | null>(null);
  const [canShareToday, setCanShareToday] = useState(false);
  const [loadingCredits, setLoadingCredits] = useState(false);

  const loadAndResetCredits = useCallback(async () => {
    if (!user) return;
    setLoadingCredits(true);
    try {
      const { data } = await supabase
        .from("profiles")
        .select("credits, credits_reset_at, last_share_bonus_at")
        .eq("user_id", user.id)
        .single();

      if (!data) return;

      const profile = data as any;
      const needsReset = isNewDay(profile.credits_reset_at);

      if (needsReset) {
        // Reset credits to daily amount
        const { data: updated } = await supabase
          .from("profiles")
          .update({ credits: DAILY_CREDITS, credits_reset_at: new Date().toISOString() })
          .eq("user_id", user.id)
          .select("credits")
          .single();
        setCredits(updated ? (updated as any).credits : DAILY_CREDITS);
        // New day = can share again
        setCanShareToday(true);
      } else {
        setCredits(profile.credits ?? DAILY_CREDITS);
        setCanShareToday(isNewDay(profile.last_share_bonus_at));
      }
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

    // Grant bonus immediately (no verification)
    const newCredits = (credits ?? 0) + SHARE_BONUS;
    await supabase
      .from("profiles")
      .update({ credits: newCredits, last_share_bonus_at: new Date().toISOString() })
      .eq("user_id", user.id);

    setCredits(newCredits);
    setCanShareToday(false);
    return true;
  }, [user, canShareToday, credits]);

  return { credits, setCredits, canShareToday, claimShareBonus, loadingCredits };
}
