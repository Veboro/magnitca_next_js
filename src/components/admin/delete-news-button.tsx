"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function DeleteNewsButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(`Видалити новину "${title}"? Цю дію не можна скасувати.`);
    if (!confirmed) return;

    setError("");

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Не вдалося видалити новину.");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (value) {
      setError(value instanceof Error ? value.message : "Не вдалося видалити новину.");
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-destructive hover:underline disabled:opacity-50"
      >
        {isPending ? "Видалення..." : "Видалити"}
      </button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
