import type { SiteLocale } from "@/lib/locale";

const UHMC_WARNINGS_URL = "https://www.meteo.gov.ua/ua/_attns-meteo.json";
const SOURCE_URL = "https://www.meteo.gov.ua/ua/Meteorolohichni-poperedzhennya";

type UhmcAlert = {
  C: number;
  T: number;
  P: string;
  D: string;
};

type UhmcRegionWarning = {
  O: string;
  U: string;
  R: number;
  L: number;
  A: UhmcAlert[];
};

type UhmcWarningsPayload = {
  UPD?: string;
  OBJ?: UhmcRegionWarning[][];
};

const REGION_KEY_TO_CODE: Record<string, number> = {
  "kyiv-city": 1,
  "kyiv-oblast": 1,
  vinnytsia: 3,
  volyn: 19,
  dnipropetrovsk: 10,
  donetsk: 11,
  zhytomyr: 5,
  zakarpattia: 25,
  zaporizhzhia: 17,
  "ivano-frankivsk": 24,
  kirovohrad: 13,
  luhansk: 12,
  lviv: 22,
  mykolaiv: 15,
  odesa: 14,
  poltava: 9,
  rivne: 20,
  sumy: 7,
  ternopil: 21,
  kharkiv: 8,
  kherson: 16,
  khmelnytskyi: 4,
  cherkasy: 2,
  chernivtsi: 23,
  chernihiv: 6,
  crimea: 18,
};

const TYPE_LABELS = {
  uk: {
    4: "гроза",
    5: "шквал",
    6: "град",
    8: "вітер",
    9: "дощ",
    10: "злива",
    11: "опади",
    12: "сніг",
    13: "туман",
    14: "ожеледь",
    15: "паморозь",
    16: "налипання мокрого снігу",
    17: "складні відкладення",
    18: "ожеледиця",
    19: "хуртовина",
    3: "заморозки",
  },
  ru: {
    4: "гроза",
    5: "шквал",
    6: "град",
    8: "ветер",
    9: "дождь",
    10: "ливень",
    11: "осадки",
    12: "снег",
    13: "туман",
    14: "гололед",
    15: "изморозь",
    16: "налипание мокрого снега",
    17: "сложные отложения",
    18: "гололедица",
    19: "метель",
    3: "заморозки",
  },
} as const;

export type UhmcWarningSummary = {
  status: "none" | "active";
  updatedAt: string | null;
  level: number | null;
  types: string[];
  periods: string[];
  details: string[];
  summary: string;
  sourceUrl: string;
};

function getTypeLabel(typeId: number, locale: Extract<SiteLocale, "uk" | "ru">) {
  return TYPE_LABELS[locale][typeId as keyof (typeof TYPE_LABELS)[typeof locale]] ?? (locale === "ru" ? "погодные явления" : "погодні явища");
}

function dedupe(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function formatNoWarnings(locale: Extract<SiteLocale, "uk" | "ru">) {
  return locale === "ru" ? "Попереджень немає" : "Попереджень немає";
}

function formatSummary(types: string[], level: number | null, locale: Extract<SiteLocale, "uk" | "ru">) {
  if (types.length === 0) return formatNoWarnings(locale);

  const typeList = types.join(locale === "ru" ? ", " : ", ");
  if (locale === "ru") {
    return level ? `${typeList} · ${level} уровень` : typeList;
  }
  return level ? `${typeList} · ${level} рівень` : typeList;
}

export function getUhmcRegionCode(regionKey: string | undefined) {
  if (!regionKey) return null;
  return REGION_KEY_TO_CODE[regionKey] ?? null;
}

export async function fetchUhmcWarning(regionCode: number, locale: Extract<SiteLocale, "uk" | "ru">): Promise<UhmcWarningSummary> {
  // Hydromet warnings are time-sensitive, so stale ISR cache is more harmful than
  // an extra request here. We always fetch the latest source payload.
  const response = await fetch(UHMC_WARNINGS_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`UHMC warnings request failed: ${response.status}`);
  }

  const payload = (await response.json()) as UhmcWarningsPayload;
  const todayWarnings = payload.OBJ?.[0] ?? [];
  const match = todayWarnings.find((item) => item.R === regionCode);

  if (!match) {
    return {
      status: "none",
      updatedAt: payload.UPD ?? null,
      level: null,
      types: [],
      periods: [],
      details: [],
      summary: formatNoWarnings(locale),
      sourceUrl: SOURCE_URL,
    };
  }

  const types = dedupe(match.A.map((alert) => getTypeLabel(alert.T, locale)));
  const periods = dedupe(match.A.map((alert) => alert.P.replace(/&mdash;/g, "—").trim()));
  const details = dedupe(match.A.map((alert) => alert.D.replace(/&deg;/g, "°").replace(/\s+/g, " ").trim()));

  return {
    status: "active",
    updatedAt: payload.UPD ?? null,
    level: match.L ?? null,
    types,
    periods,
    details,
    summary: formatSummary(types, match.L ?? null, locale),
    sourceUrl: SOURCE_URL,
  };
}
