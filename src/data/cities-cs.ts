import type { CityConfig } from "./cities";

function buildCsSeoTitle(name: string) {
  return `${name}: magnetické bouře dnes, předpověď Kp na 3 a 27 dní`;
}

function buildCsSeoDescription(name: string) {
  return `${name}: magnetické bouře dnes, aktuální Kp-index, počasí, východ a západ slunce a předpověď kosmického počasí v reálném čase.`;
}

type CsCity = { slug: string; name: string; lat: number; lon: number };

const czechiaCities: CsCity[] = [
  { slug: "praha", name: "Praha", lat: 50.0755, lon: 14.4378 },
  { slug: "brno", name: "Brno", lat: 49.1951, lon: 16.6068 },
  { slug: "ostrava", name: "Ostrava", lat: 49.8209, lon: 18.2625 },
  { slug: "plzen", name: "Plzeň", lat: 49.7384, lon: 13.3736 },
  { slug: "liberec", name: "Liberec", lat: 50.7671, lon: 15.0562 },
  { slug: "olomouc", name: "Olomouc", lat: 49.5938, lon: 17.2509 },
  { slug: "usti-nad-labem", name: "Ústí nad Labem", lat: 50.6607, lon: 14.0323 },
  { slug: "hradec-kralove", name: "Hradec Králové", lat: 50.2093, lon: 15.8328 },
  { slug: "ceske-budejovice", name: "České Budějovice", lat: 48.9745, lon: 14.4744 },
  { slug: "pardubice", name: "Pardubice", lat: 50.0343, lon: 15.7812 },
  { slug: "zlin", name: "Zlín", lat: 49.2264, lon: 17.6707 },
  { slug: "havirov", name: "Havířov", lat: 49.7797, lon: 18.4372 },
  { slug: "kladno", name: "Kladno", lat: 50.1477, lon: 14.1028 },
  { slug: "most", name: "Most", lat: 50.5030, lon: 13.6362 },
  { slug: "opava", name: "Opava", lat: 49.9387, lon: 17.9027 },
  { slug: "frydek-mistek", name: "Frýdek-Místek", lat: 49.6853, lon: 18.3505 },
  { slug: "karvina", name: "Karviná", lat: 49.8540, lon: 18.5417 },
  { slug: "jihlava", name: "Jihlava", lat: 49.3961, lon: 15.5912 },
  { slug: "teplice", name: "Teplice", lat: 50.6404, lon: 13.8245 },
  { slug: "decin", name: "Děčín", lat: 50.7729, lon: 14.2148 },
  { slug: "karlovy-vary", name: "Karlovy Vary", lat: 50.2306, lon: 12.8712 },
  { slug: "chomutov", name: "Chomutov", lat: 50.4600, lon: 13.4177 },
  { slug: "jablonec-nad-nisou", name: "Jablonec nad Nisou", lat: 50.7243, lon: 15.1710 },
  { slug: "mlada-boleslav", name: "Mladá Boleslav", lat: 50.4114, lon: 14.9030 },
  { slug: "prostejov", name: "Prostějov", lat: 49.4720, lon: 17.1116 },
  { slug: "prerov", name: "Přerov", lat: 49.4554, lon: 17.4509 },
  { slug: "ceska-lipa", name: "Česká Lípa", lat: 50.6855, lon: 14.5378 },
  { slug: "trebic", name: "Třebíč", lat: 49.2149, lon: 15.8817 },
  { slug: "trinec", name: "Třinec", lat: 49.6776, lon: 18.6708 },
  { slug: "tabor", name: "Tábor", lat: 49.4144, lon: 14.6578 },
  { slug: "znojmo", name: "Znojmo", lat: 48.8555, lon: 16.0488 },
  { slug: "pribram", name: "Příbram", lat: 49.6890, lon: 14.0104 },
  { slug: "cheb", name: "Cheb", lat: 50.0796, lon: 12.3733 },
  { slug: "trutnov", name: "Trutnov", lat: 50.5606, lon: 15.9128 },
  { slug: "kolin", name: "Kolín", lat: 50.0281, lon: 15.2003 },
  { slug: "pisek", name: "Písek", lat: 49.3088, lon: 14.1475 },
  { slug: "kromeriz", name: "Kroměříž", lat: 49.2979, lon: 17.3931 },
  { slug: "sumperk", name: "Šumperk", lat: 49.9653, lon: 16.9711 },
  { slug: "vsetin", name: "Vsetín", lat: 49.3387, lon: 17.9962 },
  { slug: "uherske-hradiste", name: "Uherské Hradiště", lat: 49.0697, lon: 17.4597 },
  { slug: "breclav", name: "Břeclav", lat: 48.7591, lon: 16.8825 },
  { slug: "hodonin", name: "Hodonín", lat: 48.8489, lon: 17.1327 },
  { slug: "litomerice", name: "Litoměřice", lat: 50.5344, lon: 14.1319 },
  { slug: "havlickuv-brod", name: "Havlíčkův Brod", lat: 49.6079, lon: 15.5800 },
  { slug: "novy-jicin", name: "Nový Jičín", lat: 49.5945, lon: 18.0103 },
  { slug: "chrudim", name: "Chrudim", lat: 49.9511, lon: 15.7955 },
  { slug: "krnov", name: "Krnov", lat: 50.0896, lon: 17.7038 },
  { slug: "klatovy", name: "Klatovy", lat: 49.3955, lon: 13.2952 },
  { slug: "kutna-hora", name: "Kutná Hora", lat: 49.9484, lon: 15.2680 },
  { slug: "sokolov", name: "Sokolov", lat: 50.1814, lon: 12.6402 },
  { slug: "vyskov", name: "Vyškov", lat: 49.2775, lon: 16.9988 },
];

export const CITIES_CS: CityConfig[] = czechiaCities.map((city) => ({
  slug: city.slug,
  name: city.name,
  nameGenitive: city.name,
  lat: city.lat,
  lon: city.lon,
  latLabel: `${city.lat.toFixed(4)}° s. š.`,
  lonLabel: `${city.lon.toFixed(4)}° v. d.`,
  timezone: "Europe/Prague",
  utcOffset: "UTC+1 (CET/CEST)",
  country: "Česko",
  countryCode: "CZ",
  seoTitle: buildCsSeoTitle(city.name),
  seoDescription: buildCsSeoDescription(city.name),
}));

export function getCityByCsSlug(slug: string): CityConfig | undefined {
  return CITIES_CS.find((city) => city.slug === slug);
}
