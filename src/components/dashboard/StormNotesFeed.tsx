"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, HeartPulse, Loader2, MessageSquareText, ThumbsUp, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type FeedCopy = {
  heading: string;
  empty: string;
  loading: string;
  error: string;
  anonymous: string;
  kpLabel: string;
  count: string;
  sameFeel: string;
  loadMore: string;
  loadingMore: string;
  allCountries: string;
  pickDate: string;
  clearDate: string;
  allAges: string;
  ageLabel: string;
  allGenders: string;
  scale: Record<number, string>;
  gender: Record<string, string>;
  country: Record<CountryCode, string>;
};

type CountryCode = "ua" | "pl" | "md" | "hu" | "intl";

// The flag is derived from the note language. Ukrainian and Russian both map to Ukraine.
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

// Which note languages to show together on one country's page.
const COUNTRY_LOCALES: Record<SiteLocale, string[]> = {
  uk: ["uk", "ru"],
  ru: ["uk", "ru"],
  pl: ["pl"],
  ro: ["ro"],
  hu: ["hu"],
  bg: ["bg"],
  en: ["en"],
};

// Country filter → the note languages that belong to that country.
const COUNTRY_FILTER_LOCALES: Record<CountryCode, string[]> = {
  ua: ["uk", "ru"],
  pl: ["pl"],
  md: ["ro"],
  hu: ["hu"],
  intl: ["en"],
};

// Order of flag chips in the top toolbar.
const COUNTRY_ORDER: CountryCode[] = ["ua", "pl", "md", "hu", "intl"];

// Age thresholds offered in the dropdown (0 = no filter).
const AGE_OPTIONS = [0, 18, 20, 30, 40, 50, 60, 70, 80] as const;
const GENDER_OPTIONS = ["female", "male"] as const;

type CountryFilter = CountryCode | "all";

function countryOf(locale: string): CountryCode {
  return LOCALE_COUNTRY[locale] ?? "intl";
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

const COPY: Record<SiteLocale, FeedCopy> = {
  uk: {
    heading: "Історії самопочуття",
    empty: "Тут з'являться перші історії, щойно ми їх перевіримо. Поділіться своїм самопочуттям у щоденному опитуванні.",
    loading: "Завантаження історій…",
    error: "Не вдалося завантажити історії.",
    anonymous: "Анонім",
    kpLabel: "Kp",
    count: "{{count}} історій",
    sameFeel: "Я теж так почуваюся",
    loadMore: "Показати ще",
    loadingMore: "Завантаження…",
    allCountries: "Усі країни",
    pickDate: "Обрати дату",
    clearDate: "Усі дати",
    allAges: "Будь-який вік",
    ageLabel: "старше {{age}}",
    allGenders: "Будь-яка стать",
    scale: {
      [-3]: "Дуже добре",
      [-2]: "Добре",
      [-1]: "Трохи краще",
      [0]: "Нейтрально",
      [1]: "Легкий дискомфорт",
      [2]: "Погано",
      [3]: "Дуже погано",
    },
    gender: { female: "жінка", male: "чоловік" },
    country: { ua: "Україна", pl: "Польща", md: "Молдова", hu: "Угорщина", intl: "Інша країна" },
  },
  ru: {
    heading: "Истории самочувствия",
    empty: "Здесь появятся первые истории, как только мы их проверим. Поделитесь своим самочувствием в ежедневном опросе.",
    loading: "Загрузка историй…",
    error: "Не удалось загрузить истории.",
    anonymous: "Аноним",
    kpLabel: "Kp",
    count: "{{count}} историй",
    sameFeel: "Я тоже так чувствую",
    loadMore: "Показать ещё",
    loadingMore: "Загрузка…",
    allCountries: "Все страны",
    pickDate: "Выбрать дату",
    clearDate: "Все даты",
    allAges: "Любой возраст",
    ageLabel: "старше {{age}}",
    allGenders: "Любой пол",
    scale: {
      [-3]: "Очень хорошо",
      [-2]: "Хорошо",
      [-1]: "Немного лучше",
      [0]: "Нейтрально",
      [1]: "Лёгкий дискомфорт",
      [2]: "Плохо",
      [3]: "Очень плохо",
    },
    gender: { female: "женщина", male: "мужчина" },
    country: { ua: "Украина", pl: "Польша", md: "Молдова", hu: "Венгрия", intl: "Другая страна" },
  },
  pl: {
    heading: "Historie samopoczucia",
    empty: "Tutaj pojawią się pierwsze historie, gdy je zweryfikujemy. Podziel się swoim samopoczuciem w codziennej ankiecie.",
    loading: "Ładowanie historii…",
    error: "Nie udało się załadować historii.",
    anonymous: "Anonim",
    kpLabel: "Kp",
    count: "{{count}} historii",
    sameFeel: "Ja też tak się czuję",
    loadMore: "Pokaż więcej",
    loadingMore: "Ładowanie…",
    allCountries: "Wszystkie kraje",
    pickDate: "Wybierz datę",
    clearDate: "Wszystkie daty",
    allAges: "Każdy wiek",
    ageLabel: "powyżej {{age}}",
    allGenders: "Każda płeć",
    scale: {
      [-3]: "Bardzo dobrze",
      [-2]: "Dobrze",
      [-1]: "Trochę lepiej",
      [0]: "Neutralnie",
      [1]: "Lekki dyskomfort",
      [2]: "Źle",
      [3]: "Bardzo źle",
    },
    gender: { female: "kobieta", male: "mężczyzna" },
    country: { ua: "Ukraina", pl: "Polska", md: "Mołdawia", hu: "Węgry", intl: "Inny kraj" },
  },
  ro: {
    heading: "Povești despre stare",
    empty: "Aici vor apărea primele povești după verificare. Împărtășește cum te simți în sondajul zilnic.",
    loading: "Se încarcă poveștile…",
    error: "Nu s-au putut încărca poveștile.",
    anonymous: "Anonim",
    kpLabel: "Kp",
    count: "{{count}} povești",
    sameFeel: "Și eu simt la fel",
    loadMore: "Arată mai multe",
    loadingMore: "Se încarcă…",
    allCountries: "Toate țările",
    pickDate: "Alege data",
    clearDate: "Toate datele",
    allAges: "Orice vârstă",
    ageLabel: "peste {{age}}",
    allGenders: "Orice gen",
    scale: {
      [-3]: "Foarte bine",
      [-2]: "Bine",
      [-1]: "Puțin mai bine",
      [0]: "Neutru",
      [1]: "Disconfort ușor",
      [2]: "Rău",
      [3]: "Foarte rău",
    },
    gender: { female: "femeie", male: "bărbat" },
    country: { ua: "Ucraina", pl: "Polonia", md: "Moldova", hu: "Ungaria", intl: "Altă țară" },
  },
  hu: {
    heading: "Közérzet történetek",
    empty: "Itt jelennek meg az első történetek, amint ellenőriztük őket. Oszd meg a közérzeted a napi kérdőívben.",
    loading: "Történetek betöltése…",
    error: "Nem sikerült betölteni a történeteket.",
    anonymous: "Névtelen",
    kpLabel: "Kp",
    count: "{{count}} történet",
    sameFeel: "Én is így érzem",
    loadMore: "Több megjelenítése",
    loadingMore: "Betöltés…",
    allCountries: "Összes ország",
    pickDate: "Dátum kiválasztása",
    clearDate: "Összes dátum",
    allAges: "Bármely kor",
    ageLabel: "{{age}} felett",
    allGenders: "Bármely nem",
    scale: {
      [-3]: "Nagyon jól",
      [-2]: "Jól",
      [-1]: "Kicsit jobban",
      [0]: "Semleges",
      [1]: "Enyhe kellemetlenség",
      [2]: "Rosszul",
      [3]: "Nagyon rosszul",
    },
    gender: { female: "nő", male: "férfi" },
    country: { ua: "Ukrajna", pl: "Lengyelország", md: "Moldova", hu: "Magyarország", intl: "Más ország" },
  },
  bg: {
    heading: "Истории за самочувствието",
    empty: "Тук ще се появят първите истории, след като ги прегледаме. Споделете как се чувствате в ежедневната анкета.",
    loading: "Зареждане на истории…",
    error: "Историите не можаха да се заредят.",
    anonymous: "Анонимен",
    kpLabel: "Kp",
    count: "{{count}} истории",
    sameFeel: "И аз се чувствам така",
    loadMore: "Покажи още",
    loadingMore: "Зареждане…",
    allCountries: "Всички държави",
    pickDate: "Изберете дата",
    clearDate: "Всички дати",
    allAges: "Всяка възраст",
    ageLabel: "над {{age}}",
    allGenders: "Всеки пол",
    scale: {
      [-3]: "Много добре",
      [-2]: "Добре",
      [-1]: "Малко по-добре",
      [0]: "Неутрално",
      [1]: "Лек дискомфорт",
      [2]: "Зле",
      [3]: "Много зле",
    },
    gender: { female: "жена", male: "мъж" },
    country: { ua: "Украйна", pl: "Полша", md: "Молдова", hu: "Унгария", intl: "Друга държава" },
  },
  en: {
    heading: "Wellbeing stories",
    empty: "The first stories will appear here once we review them. Share how you feel in the daily poll.",
    loading: "Loading stories…",
    error: "Unable to load stories.",
    anonymous: "Anonymous",
    kpLabel: "Kp",
    count: "{{count}} stories",
    sameFeel: "I feel the same",
    loadMore: "Show more",
    loadingMore: "Loading…",
    allCountries: "All countries",
    pickDate: "Pick a date",
    clearDate: "All dates",
    allAges: "Any age",
    ageLabel: "{{age}}+",
    allGenders: "Any gender",
    scale: {
      [-3]: "Very good",
      [-2]: "Good",
      [-1]: "Slightly better",
      [0]: "Neutral",
      [1]: "Mild discomfort",
      [2]: "Bad",
      [3]: "Very bad",
    },
    gender: { female: "female", male: "male" },
    country: { ua: "Ukraine", pl: "Poland", md: "Moldova", hu: "Hungary", intl: "Other country" },
  },
};

const LOCALE_TAG: Record<SiteLocale, string> = {
  uk: "uk-UA",
  ru: "ru-RU",
  pl: "pl-PL",
  ro: "ro-RO",
  hu: "hu-HU",
  bg: "bg-BG",
  en: "en-US",
};

const ANONYMOUS_ID_KEY = "magnitca:storm-feeling-anonymous-id";
const REACTED_NOTES_KEY = "magnitca:storm-note-reactions";

function getAnonymousId() {
  const existing = window.localStorage.getItem(ANONYMOUS_ID_KEY);
  if (existing) return existing;
  const next = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(ANONYMOUS_ID_KEY, next);
  return next;
}

function readReactedNotes(): Set<string> {
  try {
    const raw = window.localStorage.getItem(REACTED_NOTES_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : []);
  } catch {
    return new Set();
  }
}

function persistReactedNotes(ids: Set<string>) {
  try {
    window.localStorage.setItem(REACTED_NOTES_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // ignore storage failures
  }
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

const PAGE_SIZE = 8;

export function StormNotesFeed({
  locale,
  className,
  initialNotes = null,
  initialHasMore = false,
  initialNextOffset = 0,
}: {
  locale: SiteLocale;
  className?: string;
  initialNotes?: StormNote[] | null;
  initialHasMore?: boolean;
  initialNextOffset?: number;
}) {
  const copy = COPY[locale] ?? COPY.uk;
  const [notes, setNotes] = useState<StormNote[] | null>(initialNotes);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(initialNotes ? "ready" : "loading");
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    initialNotes ? Object.fromEntries(initialNotes.map((note) => [note.id, note.helpful_count ?? 0])) : {},
  );
  const [reacted, setReacted] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [offset, setOffset] = useState(initialNextOffset);
  const [hasMore, setHasMore] = useState(initialHasMore);
  // The server already rendered the first page; skip the initial client fetch.
  const skipInitialFetch = useRef(initialNotes != null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [country, setCountry] = useState<CountryFilter>("all");
  const [date, setDate] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [minAge, setMinAge] = useState(0);
  const [gender, setGender] = useState<"all" | "female" | "male">("all");

  // Build the query for a given page offset, honouring every active filter.
  const buildUrl = useCallback(
    (pageOffset: number) => {
      const params = new URLSearchParams({
        days: "30",
        limit: String(PAGE_SIZE),
        offset: String(pageOffset),
      });
      if (country !== "all") params.set("locales", COUNTRY_FILTER_LOCALES[country].join(","));
      if (date) params.set("date", date);
      if (minAge > 0) params.set("minAge", String(minAge));
      if (gender !== "all") params.set("gender", gender);
      // Newest first, regardless of language (no locale priority).
      return `/api/storm-notes?${params.toString()}`;
    },
    [country, date, minAge, gender],
  );

  // Fetch page one for the current filters. `showLoading` clears the list first
  // (used on filter changes); a background refresh keeps the current content on
  // screen and only swaps it in when fresh data arrives.
  const refresh = useCallback(
    (showLoading: boolean) => {
      const controller = new AbortController();
      if (showLoading) {
        setStatus("loading");
        setNotes(null);
      }
      fetch(buildUrl(0), { signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to load notes");
          return response.json() as Promise<{ notes: StormNote[]; hasMore: boolean; nextOffset: number }>;
        })
        .then((data) => {
          const list = Array.isArray(data.notes) ? data.notes : [];
          setNotes(list);
          setCounts(Object.fromEntries(list.map((note) => [note.id, note.helpful_count ?? 0])));
          setHasMore(Boolean(data.hasMore));
          setOffset(typeof data.nextOffset === "number" ? data.nextOffset : list.length);
          setStatus("ready");
        })
        .catch((error) => {
          if (error?.name === "AbortError") return;
          // On a background refresh keep the SSR/previous content; only surface
          // an error when we had nothing to show.
          if (showLoading) setStatus("error");
        });
      return () => controller.abort();
    },
    [buildUrl],
  );

  useEffect(() => {
    setReacted(readReactedNotes());
    // On first mount we already have SSR notes — refresh quietly in the
    // background (stale-while-revalidate) so freshly approved notes show up
    // without waiting for the ISR cache. Filter changes show the loader.
    const isInitial = skipInitialFetch.current;
    skipInitialFetch.current = false;
    return refresh(!isInitial);
  }, [refresh]);

  // A submitted note should appear right away, without a reload.
  useEffect(() => {
    const onSubmitted = () => refresh(false);
    window.addEventListener("storm-notes:refresh", onSubmitted);
    return () => window.removeEventListener("storm-notes:refresh", onSubmitted);
  }, [refresh]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const response = await fetch(buildUrl(offset));
      if (!response.ok) throw new Error("Failed to load more notes");
      const data = (await response.json()) as { notes: StormNote[]; hasMore: boolean; nextOffset: number };
      const list = Array.isArray(data.notes) ? data.notes : [];
      setNotes((prev) => {
        const existing = prev ?? [];
        const seen = new Set(existing.map((note) => note.id));
        return [...existing, ...list.filter((note) => !seen.has(note.id))];
      });
      setCounts((prev) => {
        const next = { ...prev };
        for (const note of list) if (!(note.id in next)) next[note.id] = note.helpful_count ?? 0;
        return next;
      });
      setHasMore(Boolean(data.hasMore));
      setOffset(offset + list.length);
    } catch {
      // keep the button so the user can retry
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, buildUrl, offset]);

  const react = useCallback(
    async (noteId: string) => {
      if (reacted.has(noteId) || pending.has(noteId)) return;

      setPending((prev) => new Set(prev).add(noteId));
      setCounts((prev) => ({ ...prev, [noteId]: (prev[noteId] ?? 0) + 1 }));
      setReacted((prev) => {
        const next = new Set(prev).add(noteId);
        persistReactedNotes(next);
        return next;
      });

      try {
        const response = await fetch("/api/storm-notes/react", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noteId, anonymousId: getAnonymousId() }),
        });
        if (!response.ok) throw new Error("Failed to react");
        const data = (await response.json()) as { helpfulCount?: number };
        if (typeof data.helpfulCount === "number") {
          setCounts((prev) => ({ ...prev, [noteId]: data.helpfulCount as number }));
        }
      } catch {
        // roll back the optimistic vote so the user can retry
        setCounts((prev) => ({ ...prev, [noteId]: Math.max(0, (prev[noteId] ?? 1) - 1) }));
        setReacted((prev) => {
          const next = new Set(prev);
          next.delete(noteId);
          persistReactedNotes(next);
          return next;
        });
      } finally {
        setPending((prev) => {
          const next = new Set(prev);
          next.delete(noteId);
          return next;
        });
      }
    },
    [reacted, pending],
  );

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(LOCALE_TAG[locale] ?? "uk-UA", { day: "numeric", month: "long" }),
    [locale],
  );

  const groups = useMemo(() => {
    if (!notes) return [];
    const byDate = new Map<string, StormNote[]>();
    for (const note of notes) {
      const list = byDate.get(note.response_date) ?? [];
      list.push(note);
      byDate.set(note.response_date, list);
    }
    return Array.from(byDate.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      // Keep the API order within each day (newest created_at first).
      .map(([date, items]) => ({ date, items }));
  }, [notes]);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-foreground">
          <MessageSquareText className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-bold sm:text-2xl">{copy.heading}</h2>
        </div>
        {notes && notes.length > 0 ? (
          <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {copy.count.replace("{{count}}", String(notes.length))}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => setCountry("all")}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              country === "all"
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
            )}
          >
            {copy.allCountries}
          </button>
          {COUNTRY_ORDER.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setCountry(code)}
              title={copy.country[code]}
              aria-label={copy.country[code]}
              aria-pressed={country === code}
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full border px-2 py-1.5 text-base leading-none transition",
                country === code
                  ? "border-primary/50 bg-primary/10 ring-1 ring-primary/30"
                  : "border-border/60 bg-card hover:border-primary/40",
              )}
            >
              <span>{COUNTRY_FLAG[code]}</span>
            </button>
          ))}
        </div>

        <div className="flex w-full flex-col items-center gap-2 sm:ml-auto sm:w-auto sm:flex-row sm:items-center">
          <div className="flex items-center justify-center gap-1.5">
          <Select value={String(minAge)} onValueChange={(value) => setMinAge(Number(value))}>
            <SelectTrigger className="h-auto w-auto shrink-0 gap-1.5 rounded-full border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground focus:ring-0 focus:ring-offset-0 data-[state=open]:border-primary/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AGE_OPTIONS.map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value === 0 ? copy.allAges : copy.ageLabel.replace("{{age}}", String(value))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={gender} onValueChange={(value) => setGender(value as typeof gender)}>
            <SelectTrigger className="h-auto w-auto shrink-0 gap-1.5 rounded-full border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground focus:ring-0 focus:ring-offset-0 data-[state=open]:border-primary/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{copy.allGenders}</SelectItem>
              {GENDER_OPTIONS.map((value) => (
                <SelectItem key={value} value={value} className="capitalize">
                  {copy.gender[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>

          <div className="flex items-center justify-center gap-1.5">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  date
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
                )}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                {date ? dateFormatter.format(parseDateKey(date)) : copy.pickDate}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date ? parseDateKey(date) : undefined}
                onSelect={(value) => {
                  setDate(value ? formatDateKey(value) : null);
                  setCalendarOpen(false);
                }}
                disabled={{ after: new Date() }}
                defaultMonth={date ? parseDateKey(date) : new Date()}
              />
            </PopoverContent>
          </Popover>
          {date ? (
            <button
              type="button"
              onClick={() => setDate(null)}
              title={copy.clearDate}
              aria-label={copy.clearDate}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border/60 bg-card px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
          </div>
        </div>
      </div>

      {status === "loading" ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/40 bg-card/60 py-12 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {copy.loading}
        </div>
      ) : status === "error" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50/60 py-8 text-center text-sm font-medium text-red-600">
          {copy.error}
        </div>
      ) : notes && notes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-card/50 px-6 py-12 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HeartPulse className="h-6 w-6" />
          </span>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{copy.empty}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.date} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {dateFormatter.format(new Date(`${group.date}T12:00:00`))}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((note, index) => {
                  const tone = scoreTone(note.feeling_score);
                  const name = note.display_name?.trim() || copy.anonymous;
                  const country = countryOf(note.locale);
                  const countryName = copy.country[country];
                  const meta: string[] = [];
                  if (note.age) meta.push(String(note.age));
                  if (note.gender && copy.gender[note.gender]) meta.push(copy.gender[note.gender]);
                  meta.push(countryName);
                  return (
                    <article
                      key={`${group.date}-${index}`}
                      className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {initialFrom(name)}
                          <span
                            className="absolute -bottom-1 -right-1 rounded-full bg-card text-[13px] leading-none shadow-sm ring-1 ring-border/60"
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
                        {note.kp_now !== null ? (
                          <span className="shrink-0 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                            {copy.kpLabel} {Number(note.kp_now).toFixed(1)}
                          </span>
                        ) : null}
                      </div>
                      <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{note.body}</p>
                      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                        <div className="flex min-w-0 items-center gap-2">
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
                        <button
                          type="button"
                          onClick={() => react(note.id)}
                          disabled={reacted.has(note.id) || pending.has(note.id)}
                          title={copy.sameFeel}
                          aria-label={copy.sameFeel}
                          aria-pressed={reacted.has(note.id)}
                          className={cn(
                            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition",
                            reacted.has(note.id)
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
                            pending.has(note.id) && "opacity-70",
                          )}
                        >
                          <ThumbsUp className={cn("h-3.5 w-3.5", reacted.has(note.id) && "fill-current")} />
                          <span className="tabular-nums">{counts[note.id] ?? note.helpful_count ?? 0}</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

          {hasMore ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:text-primary",
                  loadingMore && "opacity-70",
                )}
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {copy.loadingMore}
                  </>
                ) : (
                  copy.loadMore
                )}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
