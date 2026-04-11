"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type NewsEditorInitial = {
  id?: string;
  title_uk: string;
  slug_uk: string;
  content_uk: string;
  title_ru: string;
  slug_ru: string;
  content_ru: string;
  image_url: string;
  published_at: string;
  status: "draft" | "published";
  meta_title_uk: string;
  meta_description_uk: string;
  meta_title_ru: string;
  meta_description_ru: string;
  source: string;
};

const transliterate = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[а-яіїєґёыэъ'’`]/g, (char) => {
      const map: Record<string, string> = {
        а: "a",
        б: "b",
        в: "v",
        г: "h",
        ґ: "g",
        д: "d",
        е: "e",
        є: "ye",
        ж: "zh",
        з: "z",
        и: "y",
        і: "i",
        ї: "yi",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "kh",
        ц: "ts",
        ч: "ch",
        ш: "sh",
        щ: "shch",
        ь: "",
        ъ: "",
        ы: "y",
        э: "e",
        ё: "yo",
        ю: "yu",
        я: "ya",
        "'": "",
        "’": "",
        "`": "",
      };
      return map[char] ?? char;
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function NewsEditorForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial: NewsEditorInitial;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slugTouchedUk, setSlugTouchedUk] = useState(Boolean(initial.slug_uk));
  const [slugTouchedRu, setSlugTouchedRu] = useState(Boolean(initial.slug_ru));

  const metaPreview = useMemo(
    () => ({
      title: form.meta_title_uk || form.title_uk || "Заголовок сторінки",
      description: form.meta_description_uk || "Опис сторінки з'явиться тут.",
    }),
    [form.meta_description_uk, form.meta_title_uk, form.title_uk]
  );

  const endpoint = mode === "create" ? "/api/admin/news" : `/api/admin/news/${initial.id}`;
  const method = mode === "create" ? "POST" : "PUT";

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
          const res = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error || "Не вдалося зберегти новину.");
          }

          startTransition(() => {
            router.replace("/admin/news");
          });
        } catch (saveError) {
          setError(saveError instanceof Error ? saveError.message : "Помилка збереження.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <div className="space-y-5 rounded-2xl border border-border/50 bg-muted/20 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-primary">UA</p>
              <h2 className="mt-1 font-display text-xl font-bold">Українська версія</h2>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Заголовок</label>
              <input
                value={form.title_uk}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title_uk: event.target.value,
                    slug_uk: slugTouchedUk ? current.slug_uk : transliterate(event.target.value),
                  }))
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Slug</label>
              <input
                value={form.slug_uk}
                onChange={(event) => {
                  setSlugTouchedUk(true);
                  setForm((current) => ({
                    ...current,
                    slug_uk: transliterate(event.target.value),
                  }));
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-sm outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Контент</label>
              <RichTextEditor
                content={form.content_uk}
                onChange={(content) => setForm((current) => ({ ...current, content_uk: content }))}
              />
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-border/50 bg-muted/20 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-primary">RU</p>
              <h2 className="mt-1 font-display text-xl font-bold">Російська версія</h2>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Заголовок</label>
              <input
                value={form.title_ru}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title_ru: event.target.value,
                    slug_ru: slugTouchedRu ? current.slug_ru : transliterate(event.target.value),
                  }))
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Slug</label>
              <input
                value={form.slug_ru}
                onChange={(event) => {
                  setSlugTouchedRu(true);
                  setForm((current) => ({
                    ...current,
                    slug_ru: transliterate(event.target.value),
                  }));
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-sm outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Контент</label>
              <RichTextEditor
                content={form.content_ru}
                onChange={(content) => setForm((current) => ({ ...current, content_ru: content }))}
              />
            </div>
          </div>

          <ImageUpload
            value={form.image_url}
            onChange={(image_url) => setForm((current) => ({ ...current, image_url }))}
          />
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold">Публікація</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Дата публікації</label>
                <input
                  type="datetime-local"
                  value={form.published_at}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, published_at: event.target.value }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Джерело</label>
                <input
                  value={form.source}
                  onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Статус</label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value === "published" ? "published" : "draft",
                    }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                >
                  <option value="draft">Чернетка</option>
                  <option value="published">Опубліковано</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold">SEO</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-4 rounded-2xl border border-border/50 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-primary">UA SEO</p>
                <div>
                  <label className="mb-1 block text-sm font-medium">Meta title</label>
                  <input
                    value={form.meta_title_uk}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, meta_title_uk: event.target.value }))
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Meta description</label>
                  <textarea
                    rows={4}
                    value={form.meta_description_uk}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        meta_description_uk: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-border/50 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-primary">RU SEO</p>
                <div>
                  <label className="mb-1 block text-sm font-medium">Meta title</label>
                  <input
                    value={form.meta_title_ru}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, meta_title_ru: event.target.value }))
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Meta description</label>
                  <textarea
                    rows={4}
                    value={form.meta_description_ru}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        meta_description_ru: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>
              </div>
              <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-4 text-sm">
                <p className="font-medium text-foreground">{metaPreview.title}</p>
                <p className="mt-2 text-muted-foreground">{metaPreview.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {loading ? "Збереження..." : mode === "create" ? "Створити новину" : "Зберегти зміни"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/news")}
          className="rounded-full border border-border px-5 py-3 text-sm font-medium hover:bg-muted/40"
        >
          Скасувати
        </button>
      </div>
    </form>
  );
}
