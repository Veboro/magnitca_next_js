"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { StormNotesMode } from "@/lib/app-settings";

export function StormNotesModeToggle({ initialMode }: { initialMode: StormNotesMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<StormNotesMode>(initialMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const autopost = mode === "autopost";

  async function toggle(next: boolean) {
    const nextMode: StormNotesMode = next ? "autopost" : "moderation";
    const prev = mode;
    setMode(nextMode);
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/storm-notes/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: nextMode }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Не вдалося зберегти режим.");
      }
      router.refresh();
    } catch (value) {
      setMode(prev);
      setError(value instanceof Error ? value.message : "Не вдалося зберегти режим.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              autopost ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"
            }`}
          >
            {autopost ? <Zap className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
          </span>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">
              {autopost ? "Автопостинг" : "Модерація"}
            </p>
            <p className="max-w-md text-xs text-muted-foreground">
              {autopost
                ? "Нові відгуки публікуються одразу (спам усе одно відсіюється автоматично)."
                : "Нові відгуки потрапляють у чергу й з'являються лише після схвалення."}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            {saving ? (
              <span className="text-xs text-muted-foreground">Збереження…</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Збережено
              </span>
            )}
            <Switch checked={autopost} onCheckedChange={toggle} disabled={saving} aria-label="Автопостинг" />
          </div>
        </div>
      </div>
      {error ? <p className="mt-2 text-right text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
