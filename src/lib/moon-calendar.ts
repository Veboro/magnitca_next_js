import SunCalc from "suncalc";
import { absoluteUrl } from "@/lib/site";

export type MoonPhaseKind =
  | "new"
  | "waxing_crescent"
  | "first_quarter"
  | "waxing_gibbous"
  | "full"
  | "waning_gibbous"
  | "last_quarter"
  | "waning_crescent";

export type KeyMoonPhaseKind = "new" | "first_quarter" | "full" | "last_quarter";

export type MoonCalendarDay = {
  city?: never;
  dateKey: string;
  dayNumber: number;
  phase: number;
  illuminationPercent: number;
  phaseKind: MoonPhaseKind;
  phaseEmoji: string;
  phaseLabelUk: string;
  phaseLabelRu: string;
  phaseLabelPl: string;
  weekdayShortUk: string;
  weekdayShortRu: string;
  weekdayShortPl: string;
  isToday: boolean;
};

export type KeyMoonPhase = {
  kind: KeyMoonPhaseKind;
  day: MoonCalendarDay;
};

export type MoonMonthRoute = {
  year: number;
  month: number;
  slugUk: string;
  slugRu: string;
  slugPl: string;
  labelUk: string;
  labelRu: string;
  labelPl: string;
  hrefUk: string;
  hrefRu: string;
  hrefPl: string;
};

const UK_MONTH_SLUGS = [
  "sichen",
  "liutyi",
  "berezen",
  "kviten",
  "traven",
  "cherven",
  "lypen",
  "serpen",
  "veresen",
  "zhovten",
  "lystopad",
  "hruden",
];

const RU_MONTH_SLUGS = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "mai",
  "iyun",
  "iyul",
  "avgust",
  "sentyabr",
  "oktyabr",
  "noyabr",
  "dekabr",
];

const PL_MONTH_SLUGS = [
  "styczen",
  "luty",
  "marzec",
  "kwiecien",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpien",
  "wrzesien",
  "pazdziernik",
  "listopad",
  "grudzien",
];

function getTodayInKyiv() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getWeekdayShort(dateKey: string, locale: "uk-UA" | "ru-RU" | "pl-PL") {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Kyiv",
    weekday: "short",
  }).format(new Date(`${dateKey}T12:00:00+03:00`));
}

function getMonthLabel(date: Date, locale: "uk-UA" | "ru-RU" | "pl-PL") {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Kyiv",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getFullDateLabel(dateKey: string, locale: "uk-UA" | "ru-RU" | "pl-PL") {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Kyiv",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateKey}T12:00:00+03:00`));
}

function phaseDistance(a: number, b: number) {
  const diff = Math.abs(a - b);
  return Math.min(diff, 1 - diff);
}

function normalizePhaseKind(phase: number): { kind: MoonPhaseKind; emoji: string; uk: string; ru: string; pl: string } {
  if (phase < 0.0625 || phase >= 0.9375) {
    return { kind: "new", emoji: "🌑", uk: "Молодик", ru: "Новолуние", pl: "Nów" };
  }
  if (phase < 0.1875) {
    return { kind: "waxing_crescent", emoji: "🌒", uk: "Зростаючий серп", ru: "Растущий серп", pl: "Przybywający sierp" };
  }
  if (phase < 0.3125) {
    return { kind: "first_quarter", emoji: "🌓", uk: "Перша чверть", ru: "Первая четверть", pl: "Pierwsza kwadra" };
  }
  if (phase < 0.4375) {
    return { kind: "waxing_gibbous", emoji: "🌔", uk: "Зростаючий Місяць", ru: "Растущая Луна", pl: "Przybywający księżyc" };
  }
  if (phase < 0.5625) {
    return { kind: "full", emoji: "🌕", uk: "Повня", ru: "Полнолуние", pl: "Pełnia" };
  }
  if (phase < 0.6875) {
    return { kind: "waning_gibbous", emoji: "🌖", uk: "Спадаючий Місяць", ru: "Убывающая Луна", pl: "Ubywający księżyc" };
  }
  if (phase < 0.8125) {
    return { kind: "last_quarter", emoji: "🌗", uk: "Остання чверть", ru: "Последняя четверть", pl: "Ostatnia kwadra" };
  }
  return { kind: "waning_crescent", emoji: "🌘", uk: "Спадаючий серп", ru: "Убывающий серп", pl: "Ubywający sierp" };
}

function targetPhase(kind: KeyMoonPhaseKind) {
  switch (kind) {
    case "new":
      return 0;
    case "first_quarter":
      return 0.25;
    case "full":
      return 0.5;
    case "last_quarter":
      return 0.75;
  }
}

export function getMoonMonthRoutes2026(): MoonMonthRoute[] {
  return Array.from({ length: 7 }, (_, index) => {
    const month = index + 6;
    const slugUk = `${UK_MONTH_SLUGS[month - 1]}-2026`;
    const slugRu = `${RU_MONTH_SLUGS[month - 1]}-2026`;
    const slugPl = `${PL_MONTH_SLUGS[month - 1]}-2026`;
    const date = new Date(Date.UTC(2026, month - 1, 1, 12));
    const labelUk = new Intl.DateTimeFormat("uk-UA", {
      timeZone: "Europe/Kyiv",
      month: "long",
      year: "numeric",
    }).format(date);
    const labelRu = new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Europe/Kyiv",
      month: "long",
      year: "numeric",
    }).format(date);
    const labelPl = new Intl.DateTimeFormat("pl-PL", {
      timeZone: "Europe/Kyiv",
      month: "long",
      year: "numeric",
    }).format(date);

    return {
      year: 2026,
      month,
      slugUk,
      slugRu,
      slugPl,
      labelUk,
      labelRu,
      labelPl,
      hrefUk: `/moon-calendar/${slugUk}`,
      hrefRu: `/ru/moon-calendar/${slugRu}`,
      hrefPl: `/pl/moon-calendar/${slugPl}`,
    };
  });
}

export function findMoonMonthRouteBySlug(locale: "uk" | "ru" | "pl", slug: string) {
  return (
    getMoonMonthRoutes2026().find((item) =>
      locale === "ru" ? item.slugRu === slug : locale === "pl" ? item.slugPl === slug : item.slugUk === slug
    ) ?? null
  );
}

export async function getMoonCalendarOverview(year?: number, month?: number) {
  const todayKey = getTodayInKyiv();
  const [todayYear, todayMonth] = todayKey.split("-").map(Number);
  const targetYear = year ?? todayYear;
  const targetMonth = month ?? todayMonth;
  const monthStart = new Date(Date.UTC(targetYear, targetMonth - 1, 1, 12));
  const daysInMonth = new Date(Date.UTC(targetYear, targetMonth, 0)).getUTCDate();

  const days: MoonCalendarDay[] = Array.from({ length: daysInMonth }, (_, index) => {
    const dayNumber = index + 1;
    const dateKey = `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
    const baseDate = new Date(`${dateKey}T12:00:00+03:00`);
    const moon = SunCalc.getMoonIllumination(baseDate);
    const phaseInfo = normalizePhaseKind(moon.phase);

    return {
      dateKey,
      dayNumber,
      phase: moon.phase,
      illuminationPercent: Math.round(moon.fraction * 100),
      phaseKind: phaseInfo.kind,
      phaseEmoji: phaseInfo.emoji,
      phaseLabelUk: phaseInfo.uk,
      phaseLabelRu: phaseInfo.ru,
      phaseLabelPl: phaseInfo.pl,
      weekdayShortUk: getWeekdayShort(dateKey, "uk-UA"),
      weekdayShortRu: getWeekdayShort(dateKey, "ru-RU"),
      weekdayShortPl: getWeekdayShort(dateKey, "pl-PL"),
      isToday: dateKey === todayKey,
    };
  });

  const currentPhase = days.find((day) => day.isToday) ?? days[0];
  const keyKinds: KeyMoonPhaseKind[] = ["new", "first_quarter", "full", "last_quarter"];
  const keyPhases: KeyMoonPhase[] = keyKinds.map((kind) => {
    const bestDay = [...days].sort((a, b) => phaseDistance(a.phase, targetPhase(kind)) - phaseDistance(b.phase, targetPhase(kind)))[0];
    return { kind, day: bestDay };
  });

  const averageIllumination = days.length
    ? Math.round(days.reduce((sum, day) => sum + day.illuminationPercent, 0) / days.length)
    : 0;

  return {
    todayKey,
    monthKey: `${targetYear}-${String(targetMonth).padStart(2, "0")}`,
    monthLabelUk: getMonthLabel(monthStart, "uk-UA"),
    monthLabelRu: getMonthLabel(monthStart, "ru-RU"),
    monthLabelPl: getMonthLabel(monthStart, "pl-PL"),
    todayLabelUk: getFullDateLabel(todayKey, "uk-UA"),
    todayLabelRu: getFullDateLabel(todayKey, "ru-RU"),
    todayLabelPl: getFullDateLabel(todayKey, "pl-PL"),
    currentPhase,
    keyPhases,
    days,
    averageIllumination,
    isCurrentMonth: targetYear === todayYear && targetMonth === todayMonth,
    absoluteMonthUrlUk: absoluteUrl("/moon-calendar"),
    absoluteMonthUrlRu: absoluteUrl("/ru/moon-calendar"),
    absoluteMonthUrlPl: absoluteUrl("/pl/moon-calendar"),
  };
}
