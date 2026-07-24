"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteLocale } from "@/lib/locale";

type StormNote = {
  id: string;
  locale: string;
  body: string;
  feeling_score: number;
  response_date: string;
  display_name: string | null;
  age: number | null;
  gender: string | null;
  kp_now: number | null;
  helpful_count: number | null;
  created_at: string | null;
};

type CountryCode = "ua" | "pl" | "md" | "hu" | "intl";

const LOCALE_COUNTRY: Record<string, CountryCode> = {
  uk: "ua",
  ru: "ua",
  pl: "pl",
  ro: "md",
  hu: "hu",
  en: "intl",
};

const COUNTRY_FLAG: Record<CountryCode, string> = {
  ua: "🇺🇦",
  pl: "🇵🇱",
  md: "🇲🇩",
  hu: "🇭🇺",
  intl: "🌍",
};

// Path to the full reviews feed per locale (uk lives at the root).
const FEELING_PATH: Record<SiteLocale, string> = {
  uk: "/feeling",
  ru: "/ru/feeling",
  pl: "/pl/feeling",
  ro: "/ro/feeling",
  hu: "/hu/feeling",
  en: "/en/feeling",
};

type PreviewCopy = {
  title: string;
  viewAll: string;
  empty: string;
  loading: string;
  anonymous: string;
  scale: Record<number, string>;
  gender: Record<string, string>;
  country: Record<CountryCode, string>;
};

const COPY: Record<SiteLocale, PreviewCopy> = {
  uk: {
    title: "Останні відгуки",
    viewAll: "Усі відгуки",
    empty: "Відгуків поки немає.",
    loading: "Завантаження…",
    anonymous: "Анонім",
    scale: { [-3]: "Дуже добре", [-2]: "Добре", [-1]: "Трохи краще", [0]: "Нейтрально", [1]: "Легкий дискомфорт", [2]: "Погано", [3]: "Дуже погано" },
    gender: { female: "жінка", male: "чоловік" },
    country: { ua: "Україна", pl: "Польща", md: "Молдова", hu: "Угорщина", intl: "Інша країна" },
  },
  ru: {
    title: "Последние отзывы",
    viewAll: "Все отзывы",
    empty: "Отзывов пока нет.",
    loading: "Загрузка…",
    anonymous: "Аноним",
    scale: { [-3]: "Очень хорошо", [-2]: "Хорошо", [-1]: "Немного лучше", [0]: "Нейтрально", [1]: "Лёгкий дискомфорт", [2]: "Плохо", [3]: "Очень плохо" },
    gender: { female: "женщина", male: "мужчина" },
    country: { ua: "Украина", pl: "Польша", md: "Молдова", hu: "Венгрия", intl: "Другая страна" },
  },
  pl: {
    title: "Najnowsze opinie",
    viewAll: "Wszystkie opinie",
    empty: "Brak opinii.",
    loading: "Ładowanie…",
    anonymous: "Anonim",
    scale: { [-3]: "Bardzo dobrze", [-2]: "Dobrze", [-1]: "Trochę lepiej", [0]: "Neutralnie", [1]: "Lekki dyskomfort", [2]: "Źle", [3]: "Bardzo źle" },
    gender: { female: "kobieta", male: "mężczyzna" },
    country: { ua: "Ukraina", pl: "Polska", md: "Mołdawia", hu: "Węgry", intl: "Inny kraj" },
  },
  ro: {
    title: "Cele mai noi recenzii",
    viewAll: "Toate recenziile",
    empty: "Încă nu există recenzii.",
    loading: "Se încarcă…",
    anonymous: "Anonim",
    scale: { [-3]: "Foarte bine", [-2]: "Bine", [-1]: "Puțin mai bine", [0]: "Neutru", [1]: "Disconfort ușor", [2]: "Rău", [3]: "Foarte rău" },
    gender: { female: "femeie", male: "bărbat" },
    country: { ua: "Ucraina", pl: "Polonia", md: "Moldova", hu: "Ungaria", intl: "Altă țară" },
  },
  hu: {
    title: "Legfrissebb vélemények",
    viewAll: "Összes vélemény",
    empty: "Még nincsenek vélemények.",
    loading: "Betöltés…",
    anonymous: "Névtelen",
    scale: { [-3]: "Nagyon jó", [-2]: "Jó", [-1]: "Kicsit jobb", [0]: "Semleges", [1]: "Enyhe kellemetlenség", [2]: "Rossz", [3]: "Nagyon rossz" },
    gender: { female: "nő", male: "férfi" },
    country: { ua: "Ukrajna", pl: "Lengyelország", md: "Moldova", hu: "Magyarország", intl: "Más ország" },
  },
  en: {
    title: "Latest reviews",
    viewAll: "All reviews",
    empty: "No reviews yet.",
    loading: "Loading…",
    anonymous: "Anonymous",
    scale: { [-3]: "Very good", [-2]: "Good", [-1]: "A little better", [0]: "Neutral", [1]: "Mild discomfort", [2]: "Bad", [3]: "Very bad" },
    gender: { female: "female", male: "male" },
    country: { ua: "Ukraine", pl: "Poland", md: "Moldova", hu: "Hungary", intl: "Other country" },
  },
};

function countryOf(locale: string): CountryCode {
  return LOCALE_COUNTRY[locale] ?? "intl";
}

function scoreTone(score: number) {
  if (score < 0) return { dot: "bg-emerald-600", pill: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (score > 0) return { dot: "bg-red-600", pill: "bg-red-50 text-red-700 border-red-200" };
  return { dot: "bg-amber-400", pill: "bg-amber-50 text-amber-700 border-amber-200" };
}

function initialFrom(name: string) {
  const trimmed = name.trim();
  return trimmed ? trimmed[0].toUpperCase() : "?";
}

export function HomeStormNotesPreview({ locale, className }: { locale: SiteLocale; className?: string }) {
  const copy = COPY[locale] ?? COPY.uk;
  const [notes, setNotes] = useState<StormNote[] | null>(null);
  const feelingPath = FEELING_PATH[locale] ?? FEELING_PATH.uk;

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      const params = new URLSearchParams({ days: "30", limit: "4", priority: locale });
      fetch(`/api/storm-notes?${params.toString()}`)
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((data) => {
          if (!cancelled) setNotes(Array.isArray(data?.notes) ? data.notes : []);
        })
        .catch(() => {
          if (!cancelled) setNotes((prev) => (prev === null ? [] : prev));
        });
    };
    load();
    // Refresh when a note is submitted (e.g. via the poll dialog on this page).
    window.addEventListener("storm-notes:refresh", load);
    return () => {
      cancelled = true;
      window.removeEventListener("storm-notes:refresh", load);
    };
  }, [locale]);

  return (
    <div className={cn("flex flex-col rounded-lg border border-glow-cyan bg-card p-6", className)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <MessageSquareText className="h-4 w-4 text-primary" />
          {copy.title}
        </h3>
        <Link
          href={feelingPath}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline-offset-4 hover:underline"
        >
          {copy.viewAll}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {notes === null ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <span className="text-sm text-muted-foreground animate-pulse">{copy.loading}</span>
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <span className="text-sm text-muted-foreground">{copy.empty}</span>
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          {notes.slice(0, 4).map((note) => {
            const tone = scoreTone(note.feeling_score);
            const name = note.display_name?.trim() || copy.anonymous;
            const country = countryOf(note.locale);
            const countryName = copy.country[country];
            const meta: string[] = [];
            if (note.age) meta.push(String(note.age));
            if (note.gender && copy.gender[note.gender]) meta.push(copy.gender[note.gender]);
            return (
              <article
                key={note.id}
                className="flex flex-col gap-2.5 rounded-2xl border border-border/50 bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {initialFrom(name)}
                    <span
                      className="absolute -bottom-1 -right-1 rounded-full bg-card text-[12px] leading-none shadow-sm ring-1 ring-border/60"
                      title={countryName}
                      aria-label={countryName}
                    >
                      {COUNTRY_FLAG[country]}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                    {meta.length > 0 ? (
                      <p className="truncate text-xs text-muted-foreground">{meta.join(" · ")}</p>
                    ) : null}
                  </div>
                </div>
                <p className="line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                  {note.body}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-0.5">
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", tone.dot)} />
                  <span
                    className={cn(
                      "truncate rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                      tone.pill,
                    )}
                  >
                    {copy.scale[note.feeling_score] ?? copy.scale[0]}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
