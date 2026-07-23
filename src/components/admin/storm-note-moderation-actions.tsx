"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { StormNoteStatus } from "@/lib/admin-storm-notes";

type ActionKind = StormNoteStatus;

export function StormNoteModerationActions({ id, status }: { id: string; status: StormNoteStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState<ActionKind | null>(null);
  const [error, setError] = useState("");

  async function apply(next: StormNoteStatus) {
    if (next === "rejected") {
      const confirmed = window.confirm("Відхилити цей відгук? Він зникне зі стрічки.");
      if (!confirmed) return;
    }

    setBusy(next);
    setError("");

    try {
      const response = await fetch(`/api/admin/storm-notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Не вдалося оновити відгук.");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (value) {
      setError(value instanceof Error ? value.message : "Не вдалося оновити відгук.");
    } finally {
      setBusy(null);
    }
  }

  const disabled = isPending || busy !== null;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex flex-wrap justify-end gap-2">
        {status !== "approved" ? (
          <button
            type="button"
            onClick={() => apply("approved")}
            disabled={disabled}
            className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {busy === "approved" ? "…" : "Схвалити"}
          </button>
        ) : null}
        {status !== "rejected" ? (
          <button
            type="button"
            onClick={() => apply("rejected")}
            disabled={disabled}
            className="rounded-full border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
          >
            {busy === "rejected" ? "…" : "Відхилити"}
          </button>
        ) : null}
        {status !== "pending" ? (
          <button
            type="button"
            onClick={() => apply("pending")}
            disabled={disabled}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted/40 disabled:opacity-50"
          >
            {busy === "pending" ? "…" : "У черзі"}
          </button>
        ) : null}
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
