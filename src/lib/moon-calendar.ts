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
  phaseLabelRo: string;
  phaseLabelHu: string;
  phaseLabelBg: string;
  phaseLabelCs: string;
  phaseLabelEn: string;
  weekdayShortUk: string;
  weekdayShortRu: string;
  weekdayShortPl: string;
  weekdayShortRo: string;
  weekdayShortHu: string;
  weekdayShortBg: string;
  weekdayShortCs: string;
  weekdayShortEn: string;
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
  slugRo: string;
  slugHu: string;
  slugBg: string;
  slugCs: string;
  slugEn: string;
  labelUk: string;
  labelRu: string;
  labelPl: string;
  labelRo: string;
  labelHu: string;
  labelBg: string;
  labelCs: string;
  labelEn: string;
  hrefUk: string;
  hrefRu: string;
  hrefPl: string;
  hrefRo: string;
  hrefHu: string;
  hrefBg: string;
  hrefCs: string;
  hrefEn: string;
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

const RO_MONTH_SLUGS = [
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie",
];

const HU_MONTH_SLUGS = [
  "januar",
  "februar",
  "marcius",
  "aprilis",
  "majus",
  "junius",
  "julius",
  "augusztus",
  "szeptember",
  "oktober",
  "november",
  "december",
];

const BG_MONTH_SLUGS = [
  "yanuari",
  "fevruari",
  "mart",
  "april",
  "may",
  "yuni",
  "yuli",
  "avgust",
  "septemvri",
  "oktomvri",
  "noemvri",
  "dekemvri",
];

const CS_MONTH_SLUGS = [
  "leden",
  "unor",
  "brezen",
  "duben",
  "kveten",
  "cerven",
  "cervenec",
  "srpen",
  "zari",
  "rijen",
  "listopad",
  "prosinec",
];

const EN_MONTH_SLUGS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function getTodayInKyiv() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getWeekdayShort(dateKey: string, locale: "uk-UA" | "ru-RU" | "pl-PL" | "ro-MD" | "hu-HU" | "bg-BG" | "cs-CZ" | "en-US") {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Kyiv",
    weekday: "short",
  }).format(new Date(`${dateKey}T12:00:00+03:00`));
}

function getMonthLabel(date: Date, locale: "uk-UA" | "ru-RU" | "pl-PL" | "ro-MD" | "hu-HU" | "bg-BG" | "cs-CZ" | "en-US") {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Kyiv",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getFullDateLabel(dateKey: string, locale: "uk-UA" | "ru-RU" | "pl-PL" | "ro-MD" | "hu-HU" | "bg-BG" | "cs-CZ" | "en-US") {
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

function normalizePhaseKind(phase: number): { kind: MoonPhaseKind; emoji: string; uk: string; ru: string; pl: string; ro: string; hu: string; bg: string; cs: string; en: string } {
  if (phase < 0.0625 || phase >= 0.9375) {
    return { kind: "new", emoji: "🌑", uk: "Молодик", ru: "Новолуние", pl: "Nów", ro: "Lună nouă", hu: "Újhold", bg: "Новолуние", cs: "Nov", en: "New Moon" };
  }
  if (phase < 0.1875) {
    return { kind: "waxing_crescent", emoji: "🌒", uk: "Зростаючий серп", ru: "Растущий серп", pl: "Przybywający sierp", ro: "Semilună în creștere", hu: "Növekvő holdsarló", bg: "Нарастващ сърп", cs: "Dorůstající srpek", en: "Waxing crescent" };
  }
  if (phase < 0.3125) {
    return { kind: "first_quarter", emoji: "🌓", uk: "Перша чверть", ru: "Первая четверть", pl: "Pierwsza kwadra", ro: "Primul pătrar", hu: "Első negyed", bg: "Първа четвърт", cs: "První čtvrť", en: "First quarter" };
  }
  if (phase < 0.4375) {
    return { kind: "waxing_gibbous", emoji: "🌔", uk: "Зростаючий Місяць", ru: "Растущая Луна", pl: "Przybywający księżyc", ro: "Lună în creștere", hu: "Növekvő Hold", bg: "Нарастваща луна", cs: "Dorůstající měsíc", en: "Waxing gibbous" };
  }
  if (phase < 0.5625) {
    return { kind: "full", emoji: "🌕", uk: "Повня", ru: "Полнолуние", pl: "Pełnia", ro: "Lună plină", hu: "Telihold", bg: "Пълнолуние", cs: "Úplněk", en: "Full Moon" };
  }
  if (phase < 0.6875) {
    return { kind: "waning_gibbous", emoji: "🌖", uk: "Спадаючий Місяць", ru: "Убывающая Луна", pl: "Ubywający księżyc", ro: "Lună în descreștere", hu: "Fogyó Hold", bg: "Намаляваща луна", cs: "Couvající měsíc", en: "Waning gibbous" };
  }
  if (phase < 0.8125) {
    return { kind: "last_quarter", emoji: "🌗", uk: "Остання чверть", ru: "Последняя четверть", pl: "Ostatnia kwadra", ro: "Ultimul pătrar", hu: "Utolsó negyed", bg: "Последна четвърт", cs: "Poslední čtvrť", en: "Last quarter" };
  }
  return { kind: "waning_crescent", emoji: "🌘", uk: "Спадаючий серп", ru: "Убывающий серп", pl: "Ubywający sierp", ro: "Semilună în descreștere", hu: "Fogyó holdsarló", bg: "Намаляващ сърп", cs: "Ubývající srpek", en: "Waning crescent" };
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
    const slugRo = `${RO_MONTH_SLUGS[month - 1]}-2026`;
    const slugHu = `${HU_MONTH_SLUGS[month - 1]}-2026`;
    const slugBg = `${BG_MONTH_SLUGS[month - 1]}-2026`;
    const slugCs = `${CS_MONTH_SLUGS[month - 1]}-2026`;
    const slugEn = `${EN_MONTH_SLUGS[month - 1]}-2026`;
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
    const labelRo = new Intl.DateTimeFormat("ro-MD", {
      timeZone: "Europe/Chisinau",
      month: "long",
      year: "numeric",
    }).format(date);
    const labelHu = new Intl.DateTimeFormat("hu-HU", {
      timeZone: "Europe/Budapest",
      month: "long",
      year: "numeric",
    }).format(date);
    const labelBg = new Intl.DateTimeFormat("bg-BG", {
      timeZone: "Europe/Sofia",
      month: "long",
      year: "numeric",
    }).format(date);
    const labelCs = new Intl.DateTimeFormat("cs-CZ", {
      timeZone: "Europe/Prague",
      month: "long",
      year: "numeric",
    }).format(date);
    const labelEn = new Intl.DateTimeFormat("en-US", {
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
      slugRo,
      slugHu,
      slugBg,
      slugCs,
      slugEn,
      labelUk,
      labelRu,
      labelPl,
      labelRo,
      labelHu,
      labelBg,
      labelCs,
      labelEn,
      hrefUk: `/moon-calendar/${slugUk}`,
      hrefRu: `/ru/moon-calendar/${slugRu}`,
      hrefPl: `/pl/moon-calendar/${slugPl}`,
      hrefRo: `/ro/moon-calendar/${slugRo}`,
      hrefHu: `/hu/moon-calendar/${slugHu}`,
      hrefBg: `/bg/moon-calendar/${slugBg}`,
      hrefCs: `/cs/moon-calendar/${slugCs}`,
      hrefEn: `/en/moon-calendar/${slugEn}`,
    };
  });
}

export function findMoonMonthRouteBySlug(locale: "uk" | "ru" | "pl" | "ro" | "hu" | "bg" | "cs" | "en", slug: string) {
  return (
    getMoonMonthRoutes2026().find((item) =>
      locale === "ru"
        ? item.slugRu === slug
        : locale === "pl"
          ? item.slugPl === slug
          : locale === "ro"
            ? item.slugRo === slug
            : locale === "hu"
              ? item.slugHu === slug
              : locale === "bg"
                ? item.slugBg === slug
                : locale === "cs"
                  ? item.slugCs === slug
                  : locale === "en"
                    ? item.slugEn === slug
                    : item.slugUk === slug
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
      phaseLabelRo: phaseInfo.ro,
      phaseLabelHu: phaseInfo.hu,
      phaseLabelBg: phaseInfo.bg,
      phaseLabelCs: phaseInfo.cs,
      phaseLabelEn: phaseInfo.en,
      weekdayShortUk: getWeekdayShort(dateKey, "uk-UA"),
      weekdayShortRu: getWeekdayShort(dateKey, "ru-RU"),
      weekdayShortPl: getWeekdayShort(dateKey, "pl-PL"),
      weekdayShortRo: getWeekdayShort(dateKey, "ro-MD"),
      weekdayShortHu: getWeekdayShort(dateKey, "hu-HU"),
      weekdayShortBg: getWeekdayShort(dateKey, "bg-BG"),
      weekdayShortCs: getWeekdayShort(dateKey, "cs-CZ"),
      weekdayShortEn: getWeekdayShort(dateKey, "en-US"),
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
    monthLabelRo: getMonthLabel(monthStart, "ro-MD"),
    monthLabelHu: getMonthLabel(monthStart, "hu-HU"),
    monthLabelBg: getMonthLabel(monthStart, "bg-BG"),
    monthLabelCs: getMonthLabel(monthStart, "cs-CZ"),
    monthLabelEn: getMonthLabel(monthStart, "en-US"),
    todayLabelUk: getFullDateLabel(todayKey, "uk-UA"),
    todayLabelRu: getFullDateLabel(todayKey, "ru-RU"),
    todayLabelPl: getFullDateLabel(todayKey, "pl-PL"),
    todayLabelRo: getFullDateLabel(todayKey, "ro-MD"),
    todayLabelHu: getFullDateLabel(todayKey, "hu-HU"),
    todayLabelBg: getFullDateLabel(todayKey, "bg-BG"),
    todayLabelCs: getFullDateLabel(todayKey, "cs-CZ"),
    todayLabelEn: getFullDateLabel(todayKey, "en-US"),
    currentPhase,
    keyPhases,
    days,
    averageIllumination,
    isCurrentMonth: targetYear === todayYear && targetMonth === todayMonth,
    absoluteMonthUrlUk: absoluteUrl("/moon-calendar"),
    absoluteMonthUrlRu: absoluteUrl("/ru/moon-calendar"),
    absoluteMonthUrlPl: absoluteUrl("/pl/moon-calendar"),
    absoluteMonthUrlRo: absoluteUrl("/ro/moon-calendar"),
    absoluteMonthUrlHu: absoluteUrl("/hu/moon-calendar"),
    absoluteMonthUrlBg: absoluteUrl("/bg/moon-calendar"),
    absoluteMonthUrlCs: absoluteUrl("/cs/moon-calendar"),
    absoluteMonthUrlEn: absoluteUrl("/en/moon-calendar"),
  };
}
