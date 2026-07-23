"use client";

import { useEffect, useMemo, useState } from "react";
import { HeartPulse } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StormFeelingNoteDialog } from "@/components/dashboard/StormFeelingNoteDialog";
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
  better?: number;
  neutral?: number;
  worse?: number;
  yesPercent: number;
  noPercent: number;
  averageScore?: number;
};

const ANONYMOUS_ID_KEY = "magnitca:storm-feeling-anonymous-id";
const ANSWER_KEY_PREFIX = "magnitca:storm-feeling-answer";
export const STORM_FEELING_STATS_EVENT = "magnitca:storm-feeling-stats";
const SCALE_VALUES = [-3, -2, -1, 0, 1, 2, 3] as const;

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

function parseStoredScore(value: string | null) {
  if (value === "yes") return 2;
  if (value === "no") return 0;
  const score = Number(value);
  return Number.isInteger(score) && score >= -3 && score <= 3 ? score : null;
}

export function StormFeelingPoll({ locale, kpNow, kpTodayMax, className }: StormFeelingPollProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);
  const [draftScore, setDraftScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [dateKey, setDateKey] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteScore, setNoteScore] = useState<number | null>(null);
  const [anonId, setAnonId] = useState("");

  const scaleLabels = useMemo(
    () => ({
      "-3": t("feelingPoll.scaleGreat"),
      "-2": t("feelingPoll.scaleGood"),
      "-1": t("feelingPoll.scaleSlightlyGood"),
      "0": t("feelingPoll.scaleNeutral"),
      "1": t("feelingPoll.scaleSlightlyBad"),
      "2": t("feelingPoll.scaleBad"),
      "3": t("feelingPoll.scaleVeryBad"),
    }),
    [t],
  );
  const currentLabel = scaleLabels[String(draftScore) as keyof typeof scaleLabels] ?? scaleLabels["0"];
  const thumbPosition = ((draftScore + 3) / 6) * 100;
  const currentTone =
    draftScore < 0
      ? "text-emerald-700"
      : draftScore > 0
        ? "text-red-700"
        : "text-foreground";

  useEffect(() => {
    const today = getKyivDateKey();
    setDateKey(today);
    const stored = window.localStorage.getItem(answerStorageKey(today));
    const storedScore = parseStoredScore(stored);
    if (storedScore !== null) {
      setSelected(storedScore);
      setDraftScore(storedScore);
    }
  }, []);

  async function submitAnswer(score: number) {
    if (!Number.isInteger(score) || score < -3 || score > 3) return;
    if (isSaving || selected === score) return;

    const today = dateKey || getKyivDateKey();
    setSelected(score);
    setDraftScore(score);
    window.localStorage.setItem(answerStorageKey(today), String(score));
    setIsSaving(true);

    try {
      const anonymousId = getAnonymousId();
      const response = await fetch("/api/storm-feelings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymousId,
          feelingScore: score,
          locale,
          kpNow,
          kpTodayMax,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save answer");
      }

      const data: { answer: boolean; feelingScore?: number; stats?: StormFeelingStats } = await response.json();
      const savedScore = typeof data.feelingScore === "number" ? data.feelingScore : score;
      setSelected(savedScore);
      setDraftScore(savedScore);
      window.localStorage.setItem(answerStorageKey(today), String(savedScore));
      if (data.stats) {
        window.dispatchEvent(new CustomEvent(STORM_FEELING_STATS_EVENT, { detail: data.stats }));
      }
      setAnonId(anonymousId);
      setNoteScore(savedScore);
      setNoteOpen(true);
    } catch {
      setSelected(score);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={cn("rounded-lg border border-border/70 bg-card/70 px-3 py-3 shadow-sm", className)}>
      <div className="mb-3 flex items-center gap-3">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
          <HeartPulse className="h-4 w-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-foreground">
            {t("feelingPoll.question")}
          </p>
          <p className={cn("text-xs font-bold uppercase tracking-[0.12em]", currentTone)}>
            {currentLabel}
          </p>
        </div>
      </div>

      <div>
        <div className="relative h-11">
          <div className="absolute left-[8px] right-[5px] top-1/2 h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-200 to-red-500 shadow-inner" />
          <div className="absolute left-[8px] right-[5px] top-1/2 -translate-y-1/2">
            {SCALE_VALUES.map((value) => (
              <button
                key={value}
                type="button"
                disabled={isSaving}
                onClick={() => submitAnswer(value)}
                className={cn(
                  "absolute top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-card shadow-[0_2px_10px_rgba(31,26,18,0.18)] ring-1 ring-border transition",
                  selected === value ? "scale-110 border-primary ring-primary/40" : "hover:scale-105 hover:ring-primary/30",
                )}
                style={{ left: `${((value + 3) / 6) * 100}%` }}
                aria-label={scaleLabels[String(value) as keyof typeof scaleLabels]}
              />
            ))}
          </div>
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 z-20 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_8px_22px_rgba(31,26,18,0.24)] ring-2 ring-card transition-[left,background-color]",
              draftScore < 0 ? "bg-emerald-600" : draftScore > 0 ? "bg-red-600" : "bg-amber-400",
            )}
            style={{ left: `calc(${thumbPosition}% + ${8 - thumbPosition * 0.13}px)` }}
          />
          <input
            type="range"
            min={-3}
            max={3}
            step={1}
            value={draftScore}
            disabled={isSaving}
            onChange={(event) => setDraftScore(Number(event.target.value))}
            onPointerUp={() => submitAnswer(draftScore)}
            onTouchEnd={() => submitAnswer(draftScore)}
            onKeyUp={() => submitAnswer(draftScore)}
            onBlur={() => submitAnswer(draftScore)}
            className="absolute inset-y-0 left-[8px] right-[5px] h-11 cursor-pointer opacity-0 disabled:cursor-not-allowed"
            aria-label={t("feelingPoll.question")}
          />
        </div>
        <div className="mt-1 grid grid-cols-3 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          <span className="text-emerald-700">{t("feelingPoll.goodSide")}</span>
          <span className="text-center">{t("feelingPoll.neutralSide")}</span>
          <span className="text-right text-red-700">{t("feelingPoll.badSide")}</span>
        </div>
      </div>

      <StormFeelingNoteDialog
        open={noteOpen}
        onOpenChange={setNoteOpen}
        feelingScore={noteScore}
        locale={locale}
        kpNow={kpNow}
        anonymousId={anonId}
      />
    </div>
  );
}
