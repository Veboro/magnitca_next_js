"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { SiteLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

type StormFeelingNoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feelingScore: number | null;
  locale: SiteLocale;
  kpNow: number;
  anonymousId: string;
};

const GENDERS = ["female", "male"] as const;

// Path to the full reviews feed per locale (uk lives at the root).
const FEELING_PATH: Record<SiteLocale, string> = {
  uk: "/feeling",
  ru: "/ru/feeling",
  pl: "/pl/feeling",
  ro: "/ro/feeling",
  hu: "/hu/feeling",
  bg: "/bg/feeling",
  en: "/en/feeling",
};

const SCALE_KEYS: Record<number, string> = {
  [-3]: "scaleGreat",
  [-2]: "scaleGood",
  [-1]: "scaleSlightlyGood",
  [0]: "scaleNeutral",
  [1]: "scaleSlightlyBad",
  [2]: "scaleBad",
  [3]: "scaleVeryBad",
};

export function StormFeelingNoteDialog({
  open,
  onOpenChange,
  feelingScore,
  locale,
  kpNow,
  anonymousId,
}: StormFeelingNoteDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = text.trim().length >= 3 && feelingScore !== null && anonymousId.length >= 16;

  const scoreLabel = feelingScore !== null ? t(`feelingPoll.${SCALE_KEYS[feelingScore]}`) : "";
  const scoreDotClass =
    feelingScore === null
      ? "bg-muted-foreground"
      : feelingScore < 0
        ? "bg-emerald-600"
        : feelingScore > 0
          ? "bg-red-600"
          : "bg-amber-400";

  async function submit() {
    if (isSaving || !canSubmit) return;
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/storm-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymousId,
          body: text,
          feelingScore,
          locale,
          kpNow,
          displayName: name.trim() || undefined,
          age: age ? Number(age) : undefined,
          gender: gender || undefined,
        }),
      });

      if (response.status === 429) {
        setError(t("feelingPoll.noteLimit"));
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      setIsDone(true);
      window.dispatchEvent(new Event("storm-notes:refresh"));
    } catch {
      setError(t("feelingPoll.noteError"));
    } finally {
      setIsSaving(false);
    }
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      // reset after the closing animation so the user doesn't see a flicker
      window.setTimeout(() => {
        setName("");
        setAge("");
        setGender("");
        setText("");
        setError(null);
        setIsDone(false);
      }, 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {isDone ? (
          <div className="py-4 text-center">
            <DialogHeader>
              <DialogTitle className="text-center">{t("feelingPoll.noteSuccessTitle")}</DialogTitle>
              <DialogDescription className="text-center">{t("feelingPoll.noteSuccess")}</DialogDescription>
            </DialogHeader>
            <div className="mt-5 flex flex-col gap-2">
              <Button onClick={() => handleOpenChange(false)}>{t("feelingPoll.noteClose")}</Button>
              <Button
                asChild
                className="w-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
              >
                <a href={FEELING_PATH[locale]}>{t("feelingPoll.noteViewAll")}</a>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("feelingPoll.noteTitle")}</DialogTitle>
              <DialogDescription>{t("feelingPoll.noteSubtitle")}</DialogDescription>
            </DialogHeader>

            {feelingScore !== null ? (
              <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-sm">
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", scoreDotClass)} />
                <span className="text-muted-foreground">{t("feelingPoll.noteYourAnswer")}</span>
                <span className="font-semibold text-foreground">{scoreLabel}</span>
              </div>
            ) : null}

            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_5rem] gap-3">
                <div className="space-y-1">
                  <Label htmlFor="sfn-name">{t("feelingPoll.noteName")}</Label>
                  <Input
                    id="sfn-name"
                    value={name}
                    maxLength={60}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={t("feelingPoll.noteNamePlaceholder")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="sfn-age">{t("feelingPoll.noteAge")}</Label>
                  <Input
                    id="sfn-age"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                    placeholder="—"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>{t("feelingPoll.noteGender")}</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex flex-wrap gap-4">
                  {GENDERS.map((value) => (
                    <label key={value} className="flex cursor-pointer items-center gap-1.5 text-sm">
                      <RadioGroupItem value={value} />
                      {t(`feelingPoll.gender_${value}`)}
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-1">
                <Label htmlFor="sfn-text">{t("feelingPoll.noteText")}</Label>
                <Textarea
                  id="sfn-text"
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
            </div>

            <DialogFooter className="gap-2 sm:justify-center sm:gap-2">
              <Button
                variant="secondary"
                className="bg-muted text-muted-foreground hover:bg-muted/80"
                onClick={() => handleOpenChange(false)}
              >
                {t("feelingPoll.noteSkip")}
              </Button>
              <Button
                className="bg-green-700 text-white hover:bg-green-800"
                onClick={submit}
                disabled={isSaving || !canSubmit}
              >
                {isSaving ? t("feelingPoll.noteSubmitting") : t("feelingPoll.noteSubmit")}
              </Button>
            </DialogFooter>

            <Button asChild className="mt-1 w-full bg-blue-600 font-semibold text-white hover:bg-blue-700">
              <a href={FEELING_PATH[locale]}>{t("feelingPoll.noteViewAll")}</a>
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
