"use client";

import { useEffect, useState } from "react";
import { Check, HeartPulse, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SiteLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

type StormFeelingPollProps = {
  locale: SiteLocale;
  kpNow: number;
  kpTodayMax: number;
  className?: string;
};

type StormFeelingStats = {
  date: string;
  total: number;
  yes: number;
  no: number;
  yesPercent: number;
  noPercent: number;
};

const ANONYMOUS_ID_KEY = "magnitca:storm-feeling-anonymous-id";
const ANSWER_KEY_PREFIX = "magnitca:storm-feeling-answer";
export const STORM_FEELING_STATS_EVENT = "magnitca:storm-feeling-stats";

function getKyivDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getAnonymousId() {
  const existing = window.localStorage.getItem(ANONYMOUS_ID_KEY);
  if (existing) return existing;

  const next = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(ANONYMOUS_ID_KEY, next);
  return next;
}

function answerStorageKey(date: string) {
  return `${ANSWER_KEY_PREFIX}:${date}`;
}

export function StormFeelingPoll({ locale, kpNow, kpTodayMax, className }: StormFeelingPollProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [dateKey, setDateKey] = useState("");

  useEffect(() => {
    const today = getKyivDateKey();
    setDateKey(today);
    const stored = window.localStorage.getItem(answerStorageKey(today));
    if (stored === "yes") setSelected(true);
    if (stored === "no") setSelected(false);
  }, []);

  async function submitAnswer(answer: boolean) {
    const today = dateKey || getKyivDateKey();
    setSelected(answer);
    window.localStorage.setItem(answerStorageKey(today), answer ? "yes" : "no");
    setIsSaving(true);

    try {
      const anonymousId = getAnonymousId();
      const response = await fetch("/api/storm-feelings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymousId,
          feelsStorm: answer,
          locale,
          kpNow,
          kpTodayMax,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save answer");
      }

      const data: { answer: boolean; stats?: StormFeelingStats } = await response.json();
      setSelected(data.answer);
      window.localStorage.setItem(answerStorageKey(today), data.answer ? "yes" : "no");
      if (data.stats) {
        window.dispatchEvent(new CustomEvent(STORM_FEELING_STATS_EVENT, { detail: data.stats }));
      }
    } catch {
      setSelected(answer);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={cn("rounded-lg border border-border/70 bg-card/70 px-3 py-2.5 shadow-sm", className)}>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
          <HeartPulse className="h-4 w-4" />
        </span>
        <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-foreground">
              {t("feelingPoll.question")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:w-56">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => submitAnswer(true)}
              className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-bold transition ${
                selected === true
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                  : "border-emerald-500/50 bg-emerald-500/12 text-emerald-700 hover:bg-emerald-500/20"
              } disabled:cursor-not-allowed disabled:opacity-70`}
            >
              <Check className="h-4 w-4" />
              {t("feelingPoll.yes")}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => submitAnswer(false)}
              className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-bold transition ${
                selected === false
                  ? "border-red-600 bg-red-600 text-white shadow-sm"
                  : "border-red-500/45 bg-red-500/10 text-red-700 hover:bg-red-500/18"
              } disabled:cursor-not-allowed disabled:opacity-70`}
            >
              <X className="h-4 w-4" />
              {t("feelingPoll.no")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
