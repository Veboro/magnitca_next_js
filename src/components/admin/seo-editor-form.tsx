"use client";

import { useState } from "react";
import type { PageMetaRecord } from "@/lib/admin-content";

export function SeoEditorForm({ initialItems }: { initialItems: PageMetaRecord[] }) {
  const [items, setItems] = useState(initialItems);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function saveItem(item: PageMetaRecord) {
    setSaving(item.page_key);
    setMessage("");
    try {
      const res = await fetch("/api/admin/page-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Не вдалося зберегти метадані.");
      }

      setMessage(`Метадані для "${item.page_key}" збережено.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Помилка збереження.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-4">
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      {items.map((item, index) => (
        <div key={item.page_key} className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-primary">{item.page_key}</p>
              <h2 className="mt-1 font-display text-xl font-bold">{item.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => saveItem(items[index])}
              disabled={saving === item.page_key}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {saving === item.page_key ? "Збереження..." : "Зберегти"}
            </button>
          </div>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input
                value={item.title}
                onChange={(event) =>
                  setItems((current) =>
                    current.map((row, rowIndex) =>
                      rowIndex === index ? { ...row, title: event.target.value } : row
                    )
                  )
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea
                rows={4}
                value={item.description}
                onChange={(event) =>
                  setItems((current) =>
                    current.map((row, rowIndex) =>
                      rowIndex === index ? { ...row, description: event.target.value } : row
                    )
                  )
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
