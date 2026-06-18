import { unstable_cache } from "next/cache";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import SunCalc from "suncalc";
import { getHomePageWeatherData } from "@/lib/space-weather-cache";

export type AuroraTone = "veryHigh" | "high" | "medium" | "low" | "none";

export type AuroraRegion = {
  id: string;
  iso: string;
  name: string;
  chance: number;
  tone: AuroraTone;
  note: string;
};

type AuroraSourceRegion = {
  id: string;
  iso: string;
  name: string;
  lat: number;
  lon: number;
};

type GeoJsonFeature = {
  properties?: {
    shapeISO?: string;
    shapeName?: string;
  };
  geometry?: {
    type?: string;
    coordinates?: unknown;
  };
};

type GeoJsonFeatureCollection = {
  features?: GeoJsonFeature[];
};

type GeoJsonAuroraConfig = {
  geoJsonPath: string;
  timezone: string;
  nameOverrides?: Record<string, string>;
  note: (chance: number, effectiveKp: number, nightCloud: number | null, lat: number, moonIllumination: number) => string;
  summaryLabel: (topChance: number) => string;
};

export type AuroraForecastResult = {
  regions: AuroraRegion[];
  currentKp: number;
  effectiveKp: number;
  topChance: number;
  averageNightCloud: number | null;
  moonIllumination: number;
  summaryLabel: string;
  updatedAt: string;
};

const UKRAINE_AURORA_SOURCE_REGIONS: AuroraSourceRegion[] = [
  { id: "chernihivska", iso: "UA-74", name: "Чернігівська область", lat: 51.49, lon: 31.29 },
  { id: "volynska", iso: "UA-07", name: "Волинська область", lat: 51.19, lon: 24.87 },
  { id: "rivnenska", iso: "UA-56", name: "Рівненська область", lat: 51.04, lon: 26.39 },
  { id: "sumska", iso: "UA-59", name: "Сумська область", lat: 51.34, lon: 33.87 },
  { id: "zhytomyrska", iso: "UA-18", name: "Житомирська область", lat: 50.74, lon: 28.66 },
  { id: "kyivska", iso: "UA-32", name: "Київська область", lat: 50.30, lon: 30.47 },
  { id: "kyiv", iso: "UA-30", name: "Київ", lat: 50.45, lon: 30.52 },
  { id: "lvivska", iso: "UA-46", name: "Львівська область", lat: 49.84, lon: 24.03 },
  { id: "ternopilska", iso: "UA-61", name: "Тернопільська область", lat: 49.55, lon: 25.59 },
  { id: "khmelnytska", iso: "UA-68", name: "Хмельницька область", lat: 49.42, lon: 26.99 },
  { id: "poltavska", iso: "UA-53", name: "Полтавська область", lat: 49.59, lon: 34.55 },
  { id: "kharkivska", iso: "UA-63", name: "Харківська область", lat: 49.99, lon: 36.23 },
  { id: "cherkaska", iso: "UA-71", name: "Черкаська область", lat: 49.44, lon: 32.06 },
  { id: "vinnytska", iso: "UA-05", name: "Вінницька область", lat: 49.23, lon: 28.47 },
  { id: "kirovohradska", iso: "UA-35", name: "Кіровоградська область", lat: 48.51, lon: 32.26 },
  { id: "dnipropetrovska", iso: "UA-12", name: "Дніпропетровська область", lat: 48.46, lon: 35.05 },
  { id: "zakarpatska", iso: "UA-21", name: "Закарпатська область", lat: 48.62, lon: 22.29 },
  { id: "ivano-frankivska", iso: "UA-26", name: "Івано-Франківська область", lat: 48.92, lon: 24.71 },
  { id: "chernivetska", iso: "UA-77", name: "Чернівецька область", lat: 48.29, lon: 25.94 },
  { id: "odeska", iso: "UA-51", name: "Одеська область", lat: 46.48, lon: 30.73 },
  { id: "mykolaivska", iso: "UA-48", name: "Миколаївська область", lat: 46.98, lon: 31.99 },
  { id: "khersonska", iso: "UA-65", name: "Херсонська область", lat: 46.64, lon: 32.62 },
  { id: "zaporizka", iso: "UA-23", name: "Запорізька область", lat: 47.84, lon: 35.14 },
  { id: "donetska", iso: "UA-14", name: "Донецька область", lat: 48.02, lon: 37.80 },
  { id: "luhanska", iso: "UA-09", name: "Луганська область", lat: 48.57, lon: 39.31 },
  { id: "crimea", iso: "UA-43", name: "АР Крим", lat: 45.35, lon: 34.40 },
  { id: "sevastopol", iso: "UA-40", name: "Севастополь", lat: 44.62, lon: 33.53 },
];

const UKRAINE_AURORA_RU_REGION_NAMES: Record<string, string> = {
  "UA-74": "Черниговская область",
  "UA-07": "Волынская область",
  "UA-56": "Ровненская область",
  "UA-59": "Сумская область",
  "UA-18": "Житомирская область",
  "UA-32": "Киевская область",
  "UA-30": "Киев",
  "UA-46": "Львовская область",
  "UA-61": "Тернопольская область",
  "UA-68": "Хмельницкая область",
  "UA-53": "Полтавская область",
  "UA-63": "Харьковская область",
  "UA-71": "Черкасская область",
  "UA-05": "Винницкая область",
  "UA-35": "Кировоградская область",
  "UA-12": "Днепропетровская область",
  "UA-21": "Закарпатская область",
  "UA-26": "Ивано-Франковская область",
  "UA-77": "Черновицкая область",
  "UA-51": "Одесская область",
  "UA-48": "Николаевская область",
  "UA-65": "Херсонская область",
  "UA-23": "Запорожская область",
  "UA-14": "Донецкая область",
  "UA-09": "Луганская область",
  "UA-43": "АР Крым",
  "UA-40": "Севастополь",
};

const POLAND_AURORA_SOURCE_REGIONS: AuroraSourceRegion[] = [
  { id: "zachodniopomorskie", iso: "PL-ZP", name: "Zachodniopomorskie", lat: 53.43, lon: 14.55 },
  { id: "pomorskie", iso: "PL-PM", name: "Pomorskie", lat: 54.35, lon: 18.65 },
  { id: "warminsko-mazurskie", iso: "PL-WN", name: "Warmińsko-Mazurskie", lat: 53.78, lon: 20.48 },
  { id: "podlaskie", iso: "PL-PD", name: "Podlaskie", lat: 53.13, lon: 23.16 },
  { id: "lubuskie", iso: "PL-LB", name: "Lubuskie", lat: 52.23, lon: 15.53 },
  { id: "wielkopolskie", iso: "PL-WP", name: "Wielkopolskie", lat: 52.41, lon: 16.93 },
  { id: "kujawsko-pomorskie", iso: "PL-KP", name: "Kujawsko-Pomorskie", lat: 53.12, lon: 18.01 },
  { id: "mazowieckie", iso: "PL-MZ", name: "Mazowieckie", lat: 52.23, lon: 21.01 },
  { id: "lodzkie", iso: "PL-LD", name: "Łódzkie", lat: 51.77, lon: 19.46 },
  { id: "lubelskie", iso: "PL-LU", name: "Lubelskie", lat: 51.25, lon: 22.57 },
  { id: "dolnoslaskie", iso: "PL-DS", name: "Dolnośląskie", lat: 51.11, lon: 17.03 },
  { id: "opolskie", iso: "PL-OP", name: "Opolskie", lat: 50.67, lon: 17.93 },
  { id: "slaskie", iso: "PL-SL", name: "Śląskie", lat: 50.26, lon: 19.02 },
  { id: "swietokrzyskie", iso: "PL-SK", name: "Świętokrzyskie", lat: 50.87, lon: 20.63 },
  { id: "malopolskie", iso: "PL-MA", name: "Małopolskie", lat: 50.06, lon: 19.94 },
  { id: "podkarpackie", iso: "PL-PK", name: "Podkarpackie", lat: 50.04, lon: 22.00 },
];

const EUROPE_AURORA_SOURCE_REGIONS: AuroraSourceRegion[] = [
  { id: "iceland", iso: "IS", name: "Iceland", lat: 64.96, lon: -19.02 },
  { id: "norway", iso: "NO", name: "Norway", lat: 64.8, lon: 12.5 },
  { id: "sweden", iso: "SE", name: "Sweden", lat: 62.8, lon: 16.7 },
  { id: "finland", iso: "FI", name: "Finland", lat: 64.7, lon: 26.0 },
  { id: "estonia", iso: "EE", name: "Estonia", lat: 58.7, lon: 25.0 },
  { id: "latvia", iso: "LV", name: "Latvia", lat: 56.9, lon: 24.6 },
  { id: "lithuania", iso: "LT", name: "Lithuania", lat: 55.3, lon: 23.9 },
  { id: "denmark", iso: "DK", name: "Denmark", lat: 56.2, lon: 9.5 },
  { id: "united-kingdom", iso: "GB", name: "United Kingdom", lat: 55.4, lon: -3.4 },
  { id: "ireland", iso: "IE", name: "Ireland", lat: 53.4, lon: -8.2 },
  { id: "netherlands", iso: "NL", name: "Netherlands", lat: 52.2, lon: 5.3 },
  { id: "belgium", iso: "BE", name: "Belgium", lat: 50.8, lon: 4.5 },
  { id: "luxembourg", iso: "LU", name: "Luxembourg", lat: 49.8, lon: 6.1 },
  { id: "france", iso: "FR", name: "France", lat: 46.8, lon: 2.2 },
  { id: "germany", iso: "DE", name: "Germany", lat: 51.2, lon: 10.4 },
  { id: "switzerland", iso: "CH", name: "Switzerland", lat: 46.8, lon: 8.2 },
  { id: "austria", iso: "AT", name: "Austria", lat: 47.6, lon: 14.1 },
  { id: "poland", iso: "PL", name: "Poland", lat: 52.2, lon: 19.1 },
  { id: "czechia", iso: "CZ", name: "Czechia", lat: 49.8, lon: 15.5 },
  { id: "slovakia", iso: "SK", name: "Slovakia", lat: 48.7, lon: 19.7 },
  { id: "hungary", iso: "HU", name: "Hungary", lat: 47.2, lon: 19.5 },
  { id: "ukraine", iso: "UA", name: "Ukraine", lat: 49.0, lon: 31.4 },
  { id: "belarus", iso: "BY", name: "Belarus", lat: 53.7, lon: 27.9 },
  { id: "moldova", iso: "MD", name: "Moldova", lat: 47.2, lon: 28.5 },
  { id: "romania", iso: "RO", name: "Romania", lat: 45.9, lon: 24.9 },
  { id: "bulgaria", iso: "BG", name: "Bulgaria", lat: 42.7, lon: 25.5 },
  { id: "slovenia", iso: "SI", name: "Slovenia", lat: 46.1, lon: 14.8 },
  { id: "croatia", iso: "HR", name: "Croatia", lat: 45.1, lon: 15.2 },
  { id: "bosnia-herzegovina", iso: "BA", name: "Bosnia and Herzegovina", lat: 44.2, lon: 17.7 },
  { id: "serbia", iso: "RS", name: "Serbia", lat: 44.0, lon: 20.8 },
  { id: "montenegro", iso: "ME", name: "Montenegro", lat: 42.8, lon: 19.2 },
  { id: "albania", iso: "AL", name: "Albania", lat: 41.2, lon: 20.0 },
  { id: "north-macedonia", iso: "MK", name: "North Macedonia", lat: 41.6, lon: 21.7 },
  { id: "greece", iso: "GR", name: "Greece", lat: 39.1, lon: 22.9 },
  { id: "italy", iso: "IT", name: "Italy", lat: 42.8, lon: 12.6 },
  { id: "spain", iso: "ES", name: "Spain", lat: 40.4, lon: -3.7 },
  { id: "portugal", iso: "PT", name: "Portugal", lat: 39.6, lon: -8.0 },
  { id: "malta", iso: "MT", name: "Malta", lat: 35.9, lon: 14.4 },
  { id: "cyprus", iso: "CY", name: "Cyprus", lat: 35.1, lon: 33.4 },
  { id: "turkey", iso: "TR", name: "Turkey", lat: 39.0, lon: 35.2 },
  { id: "andorra", iso: "AD", name: "Andorra", lat: 42.5, lon: 1.6 },
  { id: "monaco", iso: "MC", name: "Monaco", lat: 43.7, lon: 7.4 },
  { id: "liechtenstein", iso: "LI", name: "Liechtenstein", lat: 47.2, lon: 9.6 },
  { id: "san-marino", iso: "SM", name: "San Marino", lat: 43.9, lon: 12.5 },
  { id: "vatican", iso: "VA", name: "Vatican City", lat: 41.9, lon: 12.5 },
  { id: "kosovo", iso: "XK", name: "Kosovo", lat: 42.6, lon: 20.9 },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function slugifyRegion(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCaseRegionName(value: string) {
  return value
    .toLowerCase()
    .split(/([\s-]+)/)
    .map((part) => (/^[a-z]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join("");
}

function collectGeometryPoints(input: unknown, points: Array<[number, number]> = []): Array<[number, number]> {
  if (!Array.isArray(input)) return points;

  if (
    input.length >= 2 &&
    typeof input[0] === "number" &&
    typeof input[1] === "number"
  ) {
    points.push([input[0], input[1]]);
    return points;
  }

  input.forEach((item) => collectGeometryPoints(item, points));
  return points;
}

function getGeometryCenter(coordinates: unknown): { lat: number; lon: number } | null {
  const points = collectGeometryPoints(coordinates);
  if (!points.length) return null;

  const bounds = points.reduce(
    (acc, [lon, lat]) => ({
      minLon: Math.min(acc.minLon, lon),
      maxLon: Math.max(acc.maxLon, lon),
      minLat: Math.min(acc.minLat, lat),
      maxLat: Math.max(acc.maxLat, lat),
    }),
    {
      minLon: Number.POSITIVE_INFINITY,
      maxLon: Number.NEGATIVE_INFINITY,
      minLat: Number.POSITIVE_INFINITY,
      maxLat: Number.NEGATIVE_INFINITY,
    },
  );

  if (!Number.isFinite(bounds.minLon) || !Number.isFinite(bounds.minLat)) return null;

  return {
    lat: round1((bounds.minLat + bounds.maxLat) / 2),
    lon: round1((bounds.minLon + bounds.maxLon) / 2),
  };
}

async function readGeoJsonSourceRegions(config: GeoJsonAuroraConfig): Promise<AuroraSourceRegion[]> {
  const file = await readFile(join(process.cwd(), config.geoJsonPath), "utf8");
  const payload = JSON.parse(file) as GeoJsonFeatureCollection;

  return (payload.features ?? [])
    .map((feature) => {
      const iso = feature.properties?.shapeISO;
      const rawName = feature.properties?.shapeName;
      const center = getGeometryCenter(feature.geometry?.coordinates);
      if (!iso || !rawName || !center) return null;

      return {
        id: slugifyRegion(iso),
        iso,
        name: config.nameOverrides?.[iso] ?? titleCaseRegionName(rawName),
        lat: center.lat,
        lon: center.lon,
      };
    })
    .filter((region): region is AuroraSourceRegion => Boolean(region));
}

function getTone(chance: number): AuroraTone {
  if (chance >= 75) return "veryHigh";
  if (chance >= 58) return "high";
  if (chance >= 38) return "medium";
  if (chance >= 18) return "low";
  return "none";
}

function getSummaryLabel(topChance: number) {
  if (topChance >= 75) return "Висока";
  if (topChance >= 45) return "Помірна";
  if (topChance >= 18) return "Низька";
  return "Майже немає";
}

function getRussianSummaryLabel(topChance: number) {
  if (topChance >= 75) return "Высокий шанс";
  if (topChance >= 45) return "Умеренный шанс";
  if (topChance >= 18) return "Низкий шанс";
  return "Почти нет";
}

function getPolandSummaryLabel(topChance: number) {
  if (topChance >= 75) return "Wysoka";
  if (topChance >= 45) return "Umiarkowana";
  if (topChance >= 18) return "Niska";
  return "Prawie brak";
}

function getRomanianSummaryLabel(topChance: number) {
  if (topChance >= 75) return "Ridicată";
  if (topChance >= 45) return "Moderată";
  if (topChance >= 18) return "Scăzută";
  return "Aproape zero";
}

function getHungarianSummaryLabel(topChance: number) {
  if (topChance >= 75) return "Magas";
  if (topChance >= 45) return "Közepes";
  if (topChance >= 18) return "Alacsony";
  return "Szinte nincs";
}

function getEuropeSummaryLabel(topChance: number) {
  if (topChance >= 75) return "High chance";
  if (topChance >= 45) return "Moderate chance";
  if (topChance >= 18) return "Low chance";
  return "Almost none";
}

function getUkraineRegionNote(chance: number, effectiveKp: number, nightCloud: number | null, lat: number, moonIllumination: number) {
  if (effectiveKp < 5.2) {
    return "геомагнітна активність поки замала для реалістичної видимості сяйва в Україні";
  }

  if (nightCloud !== null && nightCloud >= 80) {
    return "магнітна активність є, але хмарність може майже повністю перекрити сяйво";
  }

  if (moonIllumination >= 75 && chance < 58) {
    return "яскравий Місяць може заважати побачити слабке світіння біля горизонту";
  }

  if (chance >= 58) {
    return "найкраще шукати темний відкритий північний горизонт після настання повної темряви";
  }

  if (chance >= 38) {
    return "можлива слабка дуга або світіння на півночі неба за містом";
  }

  if (lat >= 50) {
    return "шанс невисокий, але північне розташування області трохи допомагає під час сильних бур";
  }

  return "видимість малоймовірна без дуже сильної геомагнітної бурі та чистого неба";
}

function getRussianUkraineRegionNote(chance: number, effectiveKp: number, nightCloud: number | null, lat: number, moonIllumination: number) {
  if (effectiveKp < 5.2) {
    return "геомагнитная активность пока слишком слабая для реалистичной видимости сияния в Украине";
  }

  if (nightCloud !== null && nightCloud >= 80) {
    return "магнитная активность есть, но плотная облачность может почти полностью скрыть сияние";
  }

  if (moonIllumination >= 75 && chance < 58) {
    return "яркая Луна может помешать увидеть слабое свечение у северного горизонта";
  }

  if (chance >= 58) {
    return "лучше искать темный открытый северный горизонт после наступления полной темноты";
  }

  if (chance >= 38) {
    return "возможна слабая дуга или свечение низко над северным горизонтом за городом";
  }

  if (lat >= 50) {
    return "шанс невысокий, но северное положение области помогает во время сильных бурь";
  }

  return "видимость маловероятна без очень сильной геомагнитной бури и чистого неба";
}

function getPolandRegionNote(chance: number, effectiveKp: number, nightCloud: number | null, lat: number, moonIllumination: number) {
  if (effectiveKp < 5.2) {
    return "aktywność geomagnetyczna jest na razie zbyt słaba dla realistycznej widoczności zorzy w Polsce";
  }

  if (nightCloud !== null && nightCloud >= 80) {
    return "aktywność jest podwyższona, ale gęste chmury mogą prawie całkowicie zasłonić zorzę";
  }

  if (moonIllumination >= 75 && chance < 58) {
    return "jasny Księżyc może utrudniać zobaczenie słabej poświaty przy północnym horyzoncie";
  }

  if (chance >= 58) {
    return "najlepiej szukać ciemnego, otwartego północnego horyzontu po zapadnięciu pełnej ciemności";
  }

  if (chance >= 38) {
    return "możliwy słaby łuk lub poświata nisko nad północnym horyzontem, szczególnie poza miastami";
  }

  if (lat >= 52.5) {
    return "szansa jest niska, ale północne położenie regionu pomaga podczas silniejszych burz";
  }

  return "widoczność jest mało prawdopodobna bez bardzo silnej burzy geomagnetycznej i czystego nieba";
}

function getRomanianRegionNote(chance: number, effectiveKp: number, nightCloud: number | null, lat: number, moonIllumination: number) {
  if (effectiveKp < 5.2) {
    return "activitatea geomagnetică este încă prea slabă pentru o vizibilitate realistă a aurorei";
  }

  if (nightCloud !== null && nightCloud >= 80) {
    return "activitatea poate fi ridicată, dar norii deși pot bloca aproape complet lumina aurorei";
  }

  if (moonIllumination >= 75 && chance < 58) {
    return "Luna luminoasă poate reduce vizibilitatea unei aurore slabe la orizontul nordic";
  }

  if (chance >= 58) {
    return "căutați un loc întunecat, cu orizont nordic deschis, după instalarea nopții";
  }

  if (chance >= 38) {
    return "poate apărea o arcadă slabă sau o lumină difuză joasă spre nord";
  }

  if (lat >= 47) {
    return "șansa rămâne mică, dar poziția mai nordică ajută în timpul furtunilor puternice";
  }

  return "vizibilitatea este puțin probabilă fără o furtună geomagnetică foarte puternică și cer senin";
}

function getHungarianRegionNote(chance: number, effectiveKp: number, nightCloud: number | null, lat: number, moonIllumination: number) {
  if (effectiveKp < 5.2) {
    return "a geomágneses aktivitás egyelőre túl gyenge ahhoz, hogy reális esély legyen a sarki fényre";
  }

  if (nightCloud !== null && nightCloud >= 80) {
    return "az aktivitás emelkedhet, de a vastag felhőzet szinte teljesen eltakarhatja a fényt";
  }

  if (moonIllumination >= 75 && chance < 58) {
    return "a fényes Hold ronthatja a halvány északi derengés láthatóságát";
  }

  if (chance >= 58) {
    return "sötét, nyílt északi horizontú helyet érdemes keresni teljes sötétség után";
  }

  if (chance >= 38) {
    return "gyenge ív vagy derengés jelenhet meg alacsonyan az északi horizont felett";
  }

  if (lat >= 47.5) {
    return "az esély alacsony, de az északibb fekvés erősebb vihar esetén segíthet";
  }

  return "a láthatóság nagyon erős geomágneses vihar és tiszta ég nélkül valószínűtlen";
}

function getEuropeCountryNote(chance: number, effectiveKp: number, nightCloud: number | null, lat: number, moonIllumination: number) {
  if (effectiveKp < 5.2) {
    return "geomagnetic activity is still too weak for realistic aurora visibility in most of Europe";
  }

  if (nightCloud !== null && nightCloud >= 80) {
    return "geomagnetic activity may be elevated, but thick cloud cover can block the aurora almost completely";
  }

  if (moonIllumination >= 75 && chance < 58) {
    return "a bright Moon can wash out weak aurora glow close to the northern horizon";
  }

  if (chance >= 58) {
    return "look for a dark location with a clear northern horizon after full darkness";
  }

  if (chance >= 38) {
    return "a faint arc or glow may be visible low above the northern horizon, especially away from cities";
  }

  if (lat >= 55) {
    return "the chance is low now, but northern latitude helps if the geomagnetic storm strengthens";
  }

  return "visibility is unlikely without a much stronger geomagnetic storm and clear dark skies";
}

function getUpcomingMaxKp(forecast: Array<{ time_tag: string; kp: number }> | null, currentKp: number) {
  if (!forecast?.length) return currentKp;

  const now = Date.now();
  const windowEnd = now + 24 * 60 * 60 * 1000;
  const values = forecast
    .filter((entry) => {
      const time = Date.parse(entry.time_tag);
      return Number.isFinite(time) && time >= now - 3 * 60 * 60 * 1000 && time <= windowEnd;
    })
    .map((entry) => Number(entry.kp))
    .filter(Number.isFinite);

  return values.length ? Math.max(currentKp, ...values) : currentKp;
}

function getNightCloudCover(hourly: unknown): number | null {
  const data = hourly as { time?: string[]; cloud_cover?: number[] } | undefined;
  if (!data?.time?.length || !data.cloud_cover?.length) return null;

  const nightValues = data.time
    .map((time, index) => {
      const hour = Number(time.slice(11, 13));
      const cloud = Number(data.cloud_cover?.[index]);
      if (!Number.isFinite(hour) || !Number.isFinite(cloud)) return null;
      return hour >= 21 || hour <= 4 ? cloud : null;
    })
    .filter((value): value is number => value !== null);

  if (!nightValues.length) return null;

  const min = Math.min(...nightValues);
  const avg = nightValues.reduce((sum, value) => sum + value, 0) / nightValues.length;

  // A short clear window matters more than the full-night average for aurora watching.
  return Math.round(min * 0.65 + avg * 0.35);
}

async function fetchNightCloudCover(
  regions: AuroraSourceRegion[],
  timezone: string,
): Promise<Map<string, number | null>> {
  const params = new URLSearchParams({
    latitude: regions.map((region) => region.lat.toFixed(4)).join(","),
    longitude: regions.map((region) => region.lon.toFixed(4)).join(","),
    hourly: "cloud_cover",
    timezone,
    forecast_days: "2",
  });

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
      next: { revalidate: 1800 },
    });
    if (!response.ok) return new Map();

    const payload = await response.json();
    const locations = Array.isArray(payload) ? payload : [payload];

    return new Map(
      regions.map((region, index) => [
        region.iso,
        getNightCloudCover(locations[index]?.hourly),
      ]),
    );
  } catch {
    return new Map();
  }
}

async function fetchUkraineNightCloudCover(): Promise<Map<string, number | null>> {
  return fetchNightCloudCover(UKRAINE_AURORA_SOURCE_REGIONS, "Europe/Kyiv");
}

async function fetchPolandNightCloudCover(): Promise<Map<string, number | null>> {
  return fetchNightCloudCover(POLAND_AURORA_SOURCE_REGIONS, "Europe/Warsaw");
}

async function fetchEuropeNightCloudCover(): Promise<Map<string, number | null>> {
  return fetchNightCloudCover(EUROPE_AURORA_SOURCE_REGIONS, "auto");
}

function calculateChance(region: AuroraSourceRegion, effectiveKp: number, nightCloud: number | null, moonIllumination: number) {
  const kpPotential = clamp((effectiveKp - 5.2) / 2.6, 0, 1);
  const hasAuroraSignal = effectiveKp >= 5.2;
  const latitudeScore = clamp((region.lat - 44.5) / 7.2, 0, 1);
  const latitudeFactor = 0.26 + 0.74 * Math.pow(latitudeScore, 1.15);
  const cloud = nightCloud ?? 50;
  const cloudFactor = clamp(1 - cloud / 100 * 0.86, 0.08, 1);
  const moonFactor = clamp(1 - moonIllumination / 100 * 0.34, 0.66, 1);
  const clearBonus = hasAuroraSignal && cloud <= 25 ? 7 : 0;
  const stormBonus = effectiveKp >= 7 && region.lat >= 50 ? 8 : 0;

  return Math.round(clamp(100 * kpPotential * latitudeFactor * cloudFactor * moonFactor + clearBonus + stormBonus, 0, 96));
}

async function getGeoJsonAuroraForecast(config: GeoJsonAuroraConfig): Promise<AuroraForecastResult> {
  const sourceRegions = await readGeoJsonSourceRegions(config);
  const [{ kpData, forecast3Day }, cloudByIso] = await Promise.all([
    getHomePageWeatherData(),
    fetchNightCloudCover(sourceRegions, config.timezone),
  ]);

  const currentKp = kpData?.length ? Number(kpData[kpData.length - 1]?.kp ?? 0) : 0;
  const effectiveKp = round1(getUpcomingMaxKp(forecast3Day, currentKp));
  const moonIllumination = Math.round(SunCalc.getMoonIllumination(new Date()).fraction * 100);

  const regions = sourceRegions.map((region) => {
    const nightCloud = cloudByIso.get(region.iso) ?? null;
    const chance = calculateChance(region, effectiveKp, nightCloud, moonIllumination);

    return {
      id: region.id,
      iso: region.iso,
      name: region.name,
      chance,
      tone: getTone(chance),
      note: config.note(chance, effectiveKp, nightCloud, region.lat, moonIllumination),
    };
  });

  const topChance = Math.max(...regions.map((region) => region.chance), 0);
  const cloudValues = Array.from(cloudByIso.values()).filter((value): value is number => value !== null);

  return {
    regions,
    currentKp: round1(currentKp),
    effectiveKp,
    topChance,
    averageNightCloud: cloudValues.length
      ? Math.round(cloudValues.reduce((sum, value) => sum + value, 0) / cloudValues.length)
      : null,
    moonIllumination,
    summaryLabel: config.summaryLabel(topChance),
    updatedAt: new Date().toISOString(),
  };
}

export const getUkraineAuroraForecast = unstable_cache(
  async (): Promise<AuroraForecastResult> => {
    const [{ kpData, forecast3Day }, cloudByIso] = await Promise.all([
      getHomePageWeatherData(),
      fetchUkraineNightCloudCover(),
    ]);

    const currentKp = kpData?.length ? Number(kpData[kpData.length - 1]?.kp ?? 0) : 0;
    const effectiveKp = round1(getUpcomingMaxKp(forecast3Day, currentKp));
    const moonIllumination = Math.round(SunCalc.getMoonIllumination(new Date()).fraction * 100);

    const regions = UKRAINE_AURORA_SOURCE_REGIONS.map((region) => {
      const nightCloud = cloudByIso.get(region.iso) ?? null;
      const chance = calculateChance(region, effectiveKp, nightCloud, moonIllumination);

      return {
        id: region.id,
        iso: region.iso,
        name: region.name,
        chance,
        tone: getTone(chance),
        note: getUkraineRegionNote(chance, effectiveKp, nightCloud, region.lat, moonIllumination),
      };
    });

    const topChance = Math.max(...regions.map((region) => region.chance), 0);
    const cloudValues = Array.from(cloudByIso.values()).filter((value): value is number => value !== null);

    return {
      regions,
      currentKp: round1(currentKp),
      effectiveKp,
      topChance,
      averageNightCloud: cloudValues.length
        ? Math.round(cloudValues.reduce((sum, value) => sum + value, 0) / cloudValues.length)
        : null,
      moonIllumination,
      summaryLabel: getSummaryLabel(topChance),
      updatedAt: new Date().toISOString(),
    };
  },
  ["ukraine-aurora-forecast"],
  { revalidate: 900 },
);

export const getRussianUkraineAuroraForecast = unstable_cache(
  async (): Promise<AuroraForecastResult> => {
    const [{ kpData, forecast3Day }, cloudByIso] = await Promise.all([
      getHomePageWeatherData(),
      fetchUkraineNightCloudCover(),
    ]);

    const currentKp = kpData?.length ? Number(kpData[kpData.length - 1]?.kp ?? 0) : 0;
    const effectiveKp = round1(getUpcomingMaxKp(forecast3Day, currentKp));
    const moonIllumination = Math.round(SunCalc.getMoonIllumination(new Date()).fraction * 100);

    const regions = UKRAINE_AURORA_SOURCE_REGIONS.map((region) => {
      const nightCloud = cloudByIso.get(region.iso) ?? null;
      const chance = calculateChance(region, effectiveKp, nightCloud, moonIllumination);

      return {
        id: region.id,
        iso: region.iso,
        name: UKRAINE_AURORA_RU_REGION_NAMES[region.iso] ?? region.name,
        chance,
        tone: getTone(chance),
        note: getRussianUkraineRegionNote(chance, effectiveKp, nightCloud, region.lat, moonIllumination),
      };
    });

    const topChance = Math.max(...regions.map((region) => region.chance), 0);
    const cloudValues = Array.from(cloudByIso.values()).filter((value): value is number => value !== null);

    return {
      regions,
      currentKp: round1(currentKp),
      effectiveKp,
      topChance,
      averageNightCloud: cloudValues.length
        ? Math.round(cloudValues.reduce((sum, value) => sum + value, 0) / cloudValues.length)
        : null,
      moonIllumination,
      summaryLabel: getRussianSummaryLabel(topChance),
      updatedAt: new Date().toISOString(),
    };
  },
  ["russian-ukraine-aurora-forecast"],
  { revalidate: 900 },
);

export const getPolandAuroraForecast = unstable_cache(
  async (): Promise<AuroraForecastResult> => {
    const [{ kpData, forecast3Day }, cloudByIso] = await Promise.all([
      getHomePageWeatherData(),
      fetchPolandNightCloudCover(),
    ]);

    const currentKp = kpData?.length ? Number(kpData[kpData.length - 1]?.kp ?? 0) : 0;
    const effectiveKp = round1(getUpcomingMaxKp(forecast3Day, currentKp));
    const moonIllumination = Math.round(SunCalc.getMoonIllumination(new Date()).fraction * 100);

    const regions = POLAND_AURORA_SOURCE_REGIONS.map((region) => {
      const nightCloud = cloudByIso.get(region.iso) ?? null;
      const chance = calculateChance(region, effectiveKp, nightCloud, moonIllumination);

      return {
        id: region.id,
        iso: region.iso,
        name: region.name,
        chance,
        tone: getTone(chance),
        note: getPolandRegionNote(chance, effectiveKp, nightCloud, region.lat, moonIllumination),
      };
    });

    const topChance = Math.max(...regions.map((region) => region.chance), 0);
    const cloudValues = Array.from(cloudByIso.values()).filter((value): value is number => value !== null);

    return {
      regions,
      currentKp: round1(currentKp),
      effectiveKp,
      topChance,
      averageNightCloud: cloudValues.length
        ? Math.round(cloudValues.reduce((sum, value) => sum + value, 0) / cloudValues.length)
        : null,
      moonIllumination,
      summaryLabel: getPolandSummaryLabel(topChance),
      updatedAt: new Date().toISOString(),
    };
  },
  ["poland-aurora-forecast"],
  { revalidate: 900 },
);

export const getRomaniaAuroraForecast = unstable_cache(
  () =>
    getGeoJsonAuroraForecast({
      geoJsonPath: "public/geo/romania-counties.geojson",
      timezone: "Europe/Bucharest",
      summaryLabel: getRomanianSummaryLabel,
      note: getRomanianRegionNote,
      nameOverrides: {
        "RO-AG": "Argeș",
        "RO-BC": "Bacău",
        "RO-BN": "Bistrița-Năsăud",
        "RO-BT": "Botoșani",
        "RO-BR": "Brăila",
        "RO-BV": "Brașov",
        "RO-BZ": "Buzău",
        "RO-CS": "Caraș-Severin",
        "RO-CL": "Călărași",
        "RO-CJ": "Cluj",
        "RO-CT": "Constanța",
        "RO-CV": "Covasna",
        "RO-DB": "Dâmbovița",
        "RO-DJ": "Dolj",
        "RO-GL": "Galați",
        "RO-GR": "Giurgiu",
        "RO-IL": "Ialomița",
        "RO-IS": "Iași",
        "RO-MM": "Maramureș",
        "RO-MH": "Mehedinți",
        "RO-MS": "Mureș",
        "RO-NT": "Neamț",
        "RO-SM": "Satu Mare",
        "RO-SJ": "Sălaj",
        "RO-SB": "Sibiu",
        "RO-SV": "Suceava",
        "RO-TR": "Teleorman",
        "RO-TM": "Timiș",
        "RO-TL": "Tulcea",
        "RO-VL": "Vâlcea",
        "RO-VS": "Vaslui",
        "RO-VN": "Vrancea",
        "RO-B": "București",
      },
    }),
  ["romania-aurora-forecast"],
  { revalidate: 900 },
);

export const getMoldovaAuroraForecast = unstable_cache(
  () =>
    getGeoJsonAuroraForecast({
      geoJsonPath: "public/geo/moldova-districts.geojson",
      timezone: "Europe/Chisinau",
      summaryLabel: getRomanianSummaryLabel,
      note: getRomanianRegionNote,
      nameOverrides: {
        "MD-BL": "Bălți",
        "MD-BD": "Bender",
        "MD-BR": "Briceni",
        "MD-BS": "Basarabeasca",
        "MD-CA": "Cahul",
        "MD-CL": "Călărași",
        "MD-CS": "Căușeni",
        "MD-CM": "Cimișlia",
        "MD-CR": "Criuleni",
        "MD-DO": "Dondușeni",
        "MD-DR": "Drochia",
        "MD-DU": "Dubăsari",
        "MD-ED": "Edineț",
        "MD-FA": "Fălești",
        "MD-FL": "Florești",
        "MD-GA": "Găgăuzia",
        "MD-GL": "Glodeni",
        "MD-HI": "Hîncești",
        "MD-IA": "Ialoveni",
        "MD-LE": "Leova",
        "MD-NI": "Nisporeni",
        "MD-OC": "Ocnița",
        "MD-OR": "Orhei",
        "MD-RE": "Rezina",
        "MD-RI": "Rîșcani",
        "MD-SI": "Sîngerei",
        "MD-SO": "Soroca",
        "MD-SD": "Șoldănești",
        "MD-SV": "Ștefan Vodă",
        "MD-ST": "Strășeni",
        "MD-TE": "Telenești",
        "MD-UN": "Ungheni",
        "MD-CU": "Chișinău",
      },
    }),
  ["moldova-aurora-forecast"],
  { revalidate: 900 },
);

export const getHungaryAuroraForecast = unstable_cache(
  () =>
    getGeoJsonAuroraForecast({
      geoJsonPath: "public/geo/hungary-counties.geojson",
      timezone: "Europe/Budapest",
      summaryLabel: getHungarianSummaryLabel,
      note: getHungarianRegionNote,
    }),
  ["hungary-aurora-forecast"],
  { revalidate: 900 },
);

export const getEuropeAuroraForecast = unstable_cache(
  async (): Promise<AuroraForecastResult> => {
    const [{ kpData, forecast3Day }, cloudByIso] = await Promise.all([
      getHomePageWeatherData(),
      fetchEuropeNightCloudCover(),
    ]);

    const currentKp = kpData?.length ? Number(kpData[kpData.length - 1]?.kp ?? 0) : 0;
    const effectiveKp = round1(getUpcomingMaxKp(forecast3Day, currentKp));
    const moonIllumination = Math.round(SunCalc.getMoonIllumination(new Date()).fraction * 100);

    const regions = EUROPE_AURORA_SOURCE_REGIONS.map((region) => {
      const nightCloud = cloudByIso.get(region.iso) ?? null;
      const chance = calculateChance(region, effectiveKp, nightCloud, moonIllumination);

      return {
        id: region.id,
        iso: region.iso,
        name: region.name,
        chance,
        tone: getTone(chance),
        note: getEuropeCountryNote(chance, effectiveKp, nightCloud, region.lat, moonIllumination),
      };
    });

    const topChance = Math.max(...regions.map((region) => region.chance), 0);
    const cloudValues = Array.from(cloudByIso.values()).filter((value): value is number => value !== null);

    return {
      regions,
      currentKp: round1(currentKp),
      effectiveKp,
      topChance,
      averageNightCloud: cloudValues.length
        ? Math.round(cloudValues.reduce((sum, value) => sum + value, 0) / cloudValues.length)
        : null,
      moonIllumination,
      summaryLabel: getEuropeSummaryLabel(topChance),
      updatedAt: new Date().toISOString(),
    };
  },
  ["europe-aurora-forecast"],
  { revalidate: 900 },
);
