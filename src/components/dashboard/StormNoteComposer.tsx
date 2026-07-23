"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, PenLine } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { SiteLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

type StormNoteComposerProps = {
  locale: SiteLocale;
  kpNow: number;
  className?: string;
};

const GENDERS = ["female", "male"] as const;
const SCALE_VALUES = [-3, -2, -1, 0, 1, 2, 3] as const;

const SCALE_KEYS: Record<number, string> = {
  [-3]: "scaleGreat",
  [-2]: "scaleGood",
  [-1]: "scaleSlightlyGood",
  [0]: "scaleNeutral",
  [1]: "scaleSlightlyBad",
  [2]: "scaleBad",
  [3]: "scaleVeryBad",
};

const ANONYMOUS_ID_KEY = "magnitca:storm-feeling-anonymous-id";

function getAnonymousId() {
  const existing = window.localStorage.getItem(ANONYMOUS_ID_KEY);
  if (existing) return existing;
  const next = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(ANONYMOUS_ID_KEY, next);
  return next;
}

export function StormNoteComposer({ locale, kpNow, className }: StormNoteComposerProps) {
  const { t } = useTranslation();
  const [score, setScore] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

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

  const currentLabel = t(`feelingPoll.${SCALE_KEYS[score]}`);
  const thumbPosition = ((score + 3) / 6) * 100;
  const currentTone = score < 0 ? "text-emerald-700" : score > 0 ? "text-red-700" : "text-foreground";
  const canSubmit = ready && text.trim().length >= 3;

  async function submit() {
    if (isSaving || !canSubmit) return;
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/storm-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymousId: getAnonymousId(),
          body: text,
          feelingScore: score,
          locale,
          kpNow,
          displayName: name.trim() || undefined,
          age: age ? Number(age) : undefined,
          gender: gender || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      setIsDone(true);
    } catch {
      setError(t("feelingPoll.noteError"));
    } finally {
      setIsSaving(false);
    }
  }

  if (isDone) {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-6 py-10 text-center",
          className,
        )}
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <p className="text-lg font-bold text-foreground">{t("feelingPoll.noteSuccessTitle")}</p>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{t("feelingPoll.noteSuccess")}</p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-border/50 bg-card p-5 shadow-sm sm:p-6", className)}>
      <div className="mb-5 flex items-center gap-2 text-foreground">
        <PenLine className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold sm:text-2xl">{t("feelingPoll.noteTitle")}</h2>
      </div>
      <p className="-mt-3 mb-5 max-w-2xl text-sm text-muted-foreground">{t("feelingPoll.noteSubtitle")}</p>

      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label>{t("feelingPoll.question")}</Label>
            <span className={cn("text-xs font-bold uppercase tracking-[0.12em]", currentTone)}>{currentLabel}</span>
          </div>
          <div className="relative h-11">
            <div className="absolute left-[8px] right-[5px] top-1/2 h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-200 to-red-500 shadow-inner" />
            <div className="absolute left-[8px] right-[5px] top-1/2 -translate-y-1/2">
              {SCALE_VALUES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScore(value)}
                  className={cn(
                    "absolute top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-card shadow-[0_2px_10px_rgba(31,26,18,0.18)] ring-1 ring-border transition",
                    score === value ? "scale-110 border-primary ring-primary/40" : "hover:scale-105 hover:ring-primary/30",
                  )}
                  style={{ left: `${((value + 3) / 6) * 100}%` }}
                  aria-label={scaleLabels[String(value) as keyof typeof scaleLabels]}
                />
              ))}
            </div>
            <div
              className={cn(
                "pointer-events-none absolute top-1/2 z-20 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_8px_22px_rgba(31,26,18,0.24)] ring-2 ring-card transition-[left,background-color]",
                score < 0 ? "bg-emerald-600" : score > 0 ? "bg-red-600" : "bg-amber-400",
              )}
              style={{ left: `calc(${thumbPosition}% + ${8 - thumbPosition * 0.13}px)` }}
            />
            <input
              type="range"
              min={-3}
              max={3}
              step={1}
              value={score}
              onChange={(event) => setScore(Number(event.target.value))}
              className="absolute inset-y-0 left-[8px] right-[5px] h-11 cursor-pointer opacity-0"
              aria-label={t("feelingPoll.question")}
            />
          </div>
          <div className="grid grid-cols-3 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            <span className="text-emerald-700">{t("feelingPoll.goodSide")}</span>
            <span className="text-center">{t("feelingPoll.neutralSide")}</span>
            <span className="text-right text-red-700">{t("feelingPoll.badSide")}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_6rem_auto] sm:items-end">
          <div className="space-y-1">
            <Label htmlFor="snc-name">{t("feelingPoll.noteName")}</Label>
            <Input
              id="snc-name"
              value={name}
              maxLength={60}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("feelingPoll.noteNamePlaceholder")}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="snc-age">{t("feelingPoll.noteAge")}</Label>
            <Input
              id="snc-age"
              type="number"
              inputMode="numeric"
              min={1}
              max={120}
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder="—"
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("feelingPoll.noteGender")}</Label>
            <RadioGroup value={gender} onValueChange={setGender} className="flex h-10 items-center gap-4">
              {GENDERS.map((value) => (
                <label key={value} className="flex cursor-pointer items-center gap-1.5 text-sm">
                  <RadioGroupItem value={value} />
                  {t(`feelingPoll.gender_${value}`)}
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="snc-text">{t("feelingPoll.noteText")}</Label>
          <Textarea
            id="snc-text"
            value={text}
            maxLength={280}
            rows={4}
            onChange={(event) => setText(event.target.value)}
            placeholder={t("feelingPoll.noteTextPlaceholder")}
          />
          <p className="text-right text-[11px] text-muted-foreground">{text.length}/280</p>
        </div>

        <p className="text-[11px] leading-snug text-muted-foreground">{t("feelingPoll.noteDisclaimer")}</p>
        {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}

        <div className="flex justify-end">
          <Button onClick={submit} disabled={isSaving || !canSubmit}>
            {isSaving ? t("feelingPoll.noteSubmitting") : t("feelingPoll.noteSubmit")}
          </Button>
        </div>
      </div>
    </div>
  );
}
