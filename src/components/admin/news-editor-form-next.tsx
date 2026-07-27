"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

const NEWS_LOCALES = [
  { code: "uk", short: "UA", label: "Українська", deepl: "UK" },
  { code: "ru", short: "RU", label: "Російська", deepl: "RU" },
  { code: "pl", short: "PL", label: "Польська", deepl: "PL" },
  { code: "ro", short: "RO", label: "Румунська", deepl: "RO" },
  { code: "hu", short: "HU", label: "Угорська", deepl: "HU" },
  { code: "bg", short: "BG", label: "Болгарська", deepl: "BG" },
  { code: "en", short: "EN", label: "Англійська", deepl: "EN-US" },
] as const;

type NewsLocale = (typeof NEWS_LOCALES)[number]["code"];
type LocalizedField = "title" | "slug" | "content" | "meta_title" | "meta_description";
type LocalizedKey = `${LocalizedField}_${NewsLocale}`;

type NewsEditorInitial = Record<LocalizedKey, string> & {
  id?: string;
  image_url: string;
  published_at: string;
  status: "draft" | "published";
  source: string;
};

type TranslationPayload = {
  title?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
};

const transliterate = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[а-яіїєґёыэъ'’`łđ]/g, (char) => {
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
        ł: "l",
        đ: "d",
      };
      return map[char] ?? char;
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function localizedKey(field: LocalizedField, locale: NewsLocale): LocalizedKey {
  return `${field}_${locale}`;
}

export function NewsEditorForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial: NewsEditorInitial;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [activeLocale, setActiveLocale] = useState<NewsLocale>("uk");
  const [sourceLocale, setSourceLocale] = useState<NewsLocale>("uk");
  const [loading, setLoading] = useState(false);
  const [translatingLocale, setTranslatingLocale] = useState<NewsLocale | null>(null);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState<Record<NewsLocale, boolean>>(() =>
    NEWS_LOCALES.reduce(
      (acc, locale) => ({
        ...acc,
        [locale.code]: Boolean(initial[localizedKey("slug", locale.code)]),
      }),
      {} as Record<NewsLocale, boolean>,
    ),
  );

  const activeLocaleMeta = NEWS_LOCALES.find((locale) => locale.code === activeLocale) ?? NEWS_LOCALES[0];
  const sourceLocaleMeta = NEWS_LOCALES.find((locale) => locale.code === sourceLocale) ?? NEWS_LOCALES[0];

  const metaPreview = useMemo(
    () => ({
      title:
        form[localizedKey("meta_title", activeLocale)] ||
        form[localizedKey("title", activeLocale)] ||
        "Заголовок сторінки",
      description: form[localizedKey("meta_description", activeLocale)] || "Опис сторінки з'явиться тут.",
    }),
    [activeLocale, form],
  );

  const endpoint = mode === "create" ? "/api/admin/news" : `/api/admin/news/${initial.id}`;
  const method = mode === "create" ? "POST" : "PUT";

  const updateField = (field: LocalizedField, locale: NewsLocale, value: string) => {
    setForm((current) => ({ ...current, [localizedKey(field, locale)]: value }));
  };

  const updateTitle = (locale: NewsLocale, value: string) => {
    setForm((current) => ({
      ...current,
      [localizedKey("title", locale)]: value,
      [localizedKey("slug", locale)]: slugTouched[locale]
        ? current[localizedKey("slug", locale)]
        : transliterate(value),
    }));
  };

  const translateActiveLocale = async () => {
    if (activeLocale === sourceLocale) return;

    const fields: TranslationPayload = {
      title: form[localizedKey("title", sourceLocale)],
      content: form[localizedKey("content", sourceLocale)],
      meta_title: form[localizedKey("meta_title", sourceLocale)],
      meta_description: form[localizedKey("meta_description", sourceLocale)],
    };

    if (!fields.title && !fields.content) {
      setError(`Спочатку заповни ${sourceLocaleMeta.label.toLowerCase()} версію.`);
      return;
    }

    setError("");
    setTranslatingLocale(activeLocale);

    try {
      const response = await fetch("/api/admin/news/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceLocale,
          targetLocale: activeLocale,
          fields,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { translation?: TranslationPayload; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.error || "Не вдалося перекласти через DeepL.");
      }

      const translation = data?.translation ?? {};
      setForm((current) => ({
        ...current,
        [localizedKey("title", activeLocale)]: translation.title ?? current[localizedKey("title", activeLocale)],
        [localizedKey("content", activeLocale)]:
          translation.content ?? current[localizedKey("content", activeLocale)],
        [localizedKey("meta_title", activeLocale)]:
          translation.meta_title ?? current[localizedKey("meta_title", activeLocale)],
        [localizedKey("meta_description", activeLocale)]:
          translation.meta_description ?? current[localizedKey("meta_description", activeLocale)],
        [localizedKey("slug", activeLocale)]: slugTouched[activeLocale]
          ? current[localizedKey("slug", activeLocale)]
          : transliterate(translation.title ?? current[localizedKey("title", activeLocale)]),
      }));
    } catch (translateError) {
      setError(translateError instanceof Error ? translateError.message : "Помилка перекладу.");
    } finally {
      setTranslatingLocale(null);
    }
  };

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
          <div className="flex flex-wrap gap-2">
            {NEWS_LOCALES.map((locale) => (
              <button
                key={locale.code}
                type="button"
                onClick={() => setActiveLocale(locale.code)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                  activeLocale === locale.code
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted/40"
                }`}
              >
                {locale.short}
              </button>
            ))}
          </div>

          <div className="space-y-5 rounded-2xl border border-border/50 bg-muted/20 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-primary">{activeLocaleMeta.short}</p>
                <h2 className="mt-1 font-display text-xl font-bold">{activeLocaleMeta.label} версія</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Поля можна редагувати вручну після автоперекладу.
                </p>
              </div>
              {activeLocale !== sourceLocale ? (
                <button
                  type="button"
                  disabled={Boolean(translatingLocale)}
                  onClick={translateActiveLocale}
                  className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {translatingLocale === activeLocale
                    ? "Перекладаю..."
                    : `Перекласти з ${sourceLocaleMeta.short} через DeepL`}
                </button>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Заголовок</label>
              <input
                value={form[localizedKey("title", activeLocale)]}
                onChange={(event) => updateTitle(activeLocale, event.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Slug</label>
              <input
                value={form[localizedKey("slug", activeLocale)]}
                onChange={(event) => {
                  setSlugTouched((current) => ({ ...current, [activeLocale]: true }));
                  updateField("slug", activeLocale, transliterate(event.target.value));
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-sm outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Контент</label>
              <RichTextEditor
                content={form[localizedKey("content", activeLocale)]}
                onChange={(content) => updateField("content", activeLocale, content)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Meta title</label>
                <input
                  value={form[localizedKey("meta_title", activeLocale)]}
                  onChange={(event) => updateField("meta_title", activeLocale, event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Meta description</label>
                <textarea
                  rows={3}
                  value={form[localizedKey("meta_description", activeLocale)]}
                  onChange={(event) => updateField("meta_description", activeLocale, event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>
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
              <div>
                <label className="mb-1 block text-sm font-medium">Мова-джерело для DeepL</label>
                <select
                  value={sourceLocale}
                  onChange={(event) => setSourceLocale(event.target.value as NewsLocale)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                >
                  {NEWS_LOCALES.map((locale) => (
                    <option key={locale.code} value={locale.code}>
                      {locale.short} · {locale.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold">SEO Preview</h2>
            <p className="mt-1 text-xs text-muted-foreground">{activeLocaleMeta.label} версія</p>
            <div className="mt-4 rounded-xl border border-dashed border-border/70 bg-muted/20 p-4 text-sm">
              <p className="font-medium text-foreground">{metaPreview.title}</p>
              <p className="mt-2 text-muted-foreground">{metaPreview.description}</p>
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
