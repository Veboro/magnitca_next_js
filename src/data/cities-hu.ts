import type { CityConfig } from "./cities";

function buildHuSeoTitle(name: string) {
  return `${name}: mágneses viharok ma, Kp-előrejelzés 3 és 27 napra`;
}

function buildHuSeoDescription(name: string) {
  return `${name}: mágneses viharok ma, aktuális Kp-index, időjárás, napkelte, napnyugta és űridőjárási előrejelzés valós időben.`;
}

const hungaryCities: Array<Omit<CityConfig, "seoTitle" | "seoDescription">> = [
  { slug: "budapest", name: "Budapest", nameGenitive: "Budapest", lat: 47.4979, lon: 19.0402, latLabel: "47.4979° É", lonLabel: "19.0402° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "debrecen", name: "Debrecen", nameGenitive: "Debrecen", lat: 47.5316, lon: 21.6273, latLabel: "47.5316° É", lonLabel: "21.6273° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "szeged", name: "Szeged", nameGenitive: "Szeged", lat: 46.2530, lon: 20.1414, latLabel: "46.2530° É", lonLabel: "20.1414° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "miskolc", name: "Miskolc", nameGenitive: "Miskolc", lat: 48.1035, lon: 20.7784, latLabel: "48.1035° É", lonLabel: "20.7784° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "pecs", name: "Pécs", nameGenitive: "Pécs", lat: 46.0727, lon: 18.2323, latLabel: "46.0727° É", lonLabel: "18.2323° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "gyor", name: "Győr", nameGenitive: "Győr", lat: 47.6875, lon: 17.6504, latLabel: "47.6875° É", lonLabel: "17.6504° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "nyiregyhaza", name: "Nyíregyháza", nameGenitive: "Nyíregyháza", lat: 47.9495, lon: 21.7244, latLabel: "47.9495° É", lonLabel: "21.7244° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "kecskemet", name: "Kecskemét", nameGenitive: "Kecskemét", lat: 46.8964, lon: 19.6897, latLabel: "46.8964° É", lonLabel: "19.6897° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "szekesfehervar", name: "Székesfehérvár", nameGenitive: "Székesfehérvár", lat: 47.1860, lon: 18.4221, latLabel: "47.1860° É", lonLabel: "18.4221° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "szombathely", name: "Szombathely", nameGenitive: "Szombathely", lat: 47.2307, lon: 16.6218, latLabel: "47.2307° É", lonLabel: "16.6218° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "szolnok", name: "Szolnok", nameGenitive: "Szolnok", lat: 47.1621, lon: 20.1825, latLabel: "47.1621° É", lonLabel: "20.1825° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "erd", name: "Érd", nameGenitive: "Érd", lat: 47.3917, lon: 18.9048, latLabel: "47.3917° É", lonLabel: "18.9048° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "tatabanya", name: "Tatabánya", nameGenitive: "Tatabánya", lat: 47.5692, lon: 18.4048, latLabel: "47.5692° É", lonLabel: "18.4048° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "sopron", name: "Sopron", nameGenitive: "Sopron", lat: 47.6817, lon: 16.5845, latLabel: "47.6817° É", lonLabel: "16.5845° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "kaposvar", name: "Kaposvár", nameGenitive: "Kaposvár", lat: 46.3594, lon: 17.7968, latLabel: "46.3594° É", lonLabel: "17.7968° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "veszprem", name: "Veszprém", nameGenitive: "Veszprém", lat: 47.1028, lon: 17.9093, latLabel: "47.1028° É", lonLabel: "17.9093° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "bekescsaba", name: "Békéscsaba", nameGenitive: "Békéscsaba", lat: 46.6736, lon: 21.0877, latLabel: "46.6736° É", lonLabel: "21.0877° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "zalaegerszeg", name: "Zalaegerszeg", nameGenitive: "Zalaegerszeg", lat: 46.8417, lon: 16.8416, latLabel: "46.8417° É", lonLabel: "16.8416° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "eger", name: "Eger", nameGenitive: "Eger", lat: 47.9025, lon: 20.3772, latLabel: "47.9025° É", lonLabel: "20.3772° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "nagykanizsa", name: "Nagykanizsa", nameGenitive: "Nagykanizsa", lat: 46.4590, lon: 16.9897, latLabel: "46.4590° É", lonLabel: "16.9897° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "dunakeszi", name: "Dunakeszi", nameGenitive: "Dunakeszi", lat: 47.6364, lon: 19.1386, latLabel: "47.6364° É", lonLabel: "19.1386° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "dunaujvaros", name: "Dunaújváros", nameGenitive: "Dunaújváros", lat: 46.9619, lon: 18.9355, latLabel: "46.9619° É", lonLabel: "18.9355° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "hodmezovasarhely", name: "Hódmezővásárhely", nameGenitive: "Hódmezővásárhely", lat: 46.4181, lon: 20.3300, latLabel: "46.4181° É", lonLabel: "20.3300° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "szigetszentmiklos", name: "Szigetszentmiklós", nameGenitive: "Szigetszentmiklós", lat: 47.3438, lon: 19.0434, latLabel: "47.3438° É", lonLabel: "19.0434° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "cegled", name: "Cegléd", nameGenitive: "Cegléd", lat: 47.1727, lon: 19.7995, latLabel: "47.1727° É", lonLabel: "19.7995° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "mosonmagyarovar", name: "Mosonmagyaróvár", nameGenitive: "Mosonmagyaróvár", lat: 47.8679, lon: 17.2699, latLabel: "47.8679° É", lonLabel: "17.2699° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "baja", name: "Baja", nameGenitive: "Baja", lat: 46.1748, lon: 18.9560, latLabel: "46.1748° É", lonLabel: "18.9560° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "vac", name: "Vác", nameGenitive: "Vác", lat: 47.7759, lon: 19.1361, latLabel: "47.7759° É", lonLabel: "19.1361° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "salgotarjan", name: "Salgótarján", nameGenitive: "Salgótarján", lat: 48.1050, lon: 19.8090, latLabel: "48.1050° É", lonLabel: "19.8090° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "godollo", name: "Gödöllő", nameGenitive: "Gödöllő", lat: 47.5969, lon: 19.3553, latLabel: "47.5969° É", lonLabel: "19.3553° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "ozd", name: "Ózd", nameGenitive: "Ózd", lat: 48.2191, lon: 20.2860, latLabel: "48.2191° É", lonLabel: "20.2860° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "szekszard", name: "Szekszárd", nameGenitive: "Szekszárd", lat: 46.3501, lon: 18.7090, latLabel: "46.3501° É", lonLabel: "18.7090° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "papa", name: "Pápa", nameGenitive: "Pápa", lat: 47.3300, lon: 17.4674, latLabel: "47.3300° É", lonLabel: "17.4674° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "hajduboszormeny", name: "Hajdúböszörmény", nameGenitive: "Hajdúböszörmény", lat: 47.6667, lon: 21.5167, latLabel: "47.6667° É", lonLabel: "21.5167° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "kiskunfelegyhaza", name: "Kiskunfélegyháza", nameGenitive: "Kiskunfélegyháza", lat: 46.7121, lon: 19.8446, latLabel: "46.7121° É", lonLabel: "19.8446° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "budaors", name: "Budaörs", nameGenitive: "Budaörs", lat: 47.4618, lon: 18.9585, latLabel: "47.4618° É", lonLabel: "18.9585° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "gyongyos", name: "Gyöngyös", nameGenitive: "Gyöngyös", lat: 47.7826, lon: 19.9280, latLabel: "47.7826° É", lonLabel: "19.9280° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "gyula", name: "Gyula", nameGenitive: "Gyula", lat: 46.6500, lon: 21.2833, latLabel: "46.6500° É", lonLabel: "21.2833° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "esztergom", name: "Esztergom", nameGenitive: "Esztergom", lat: 47.7928, lon: 18.7415, latLabel: "47.7928° É", lonLabel: "18.7415° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "ajka", name: "Ajka", nameGenitive: "Ajka", lat: 47.1010, lon: 17.5589, latLabel: "47.1010° É", lonLabel: "17.5589° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "szentendre", name: "Szentendre", nameGenitive: "Szentendre", lat: 47.6694, lon: 19.0756, latLabel: "47.6694° É", lonLabel: "19.0756° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "jaszbereny", name: "Jászberény", nameGenitive: "Jászberény", lat: 47.5000, lon: 19.9167, latLabel: "47.5000° É", lonLabel: "19.9167° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "oroshaza", name: "Orosháza", nameGenitive: "Orosháza", lat: 46.5667, lon: 20.6667, latLabel: "46.5667° É", lonLabel: "20.6667° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "kiskunhalas", name: "Kiskunhalas", nameGenitive: "Kiskunhalas", lat: 46.4314, lon: 19.4875, latLabel: "46.4314° É", lonLabel: "19.4875° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "szentes", name: "Szentes", nameGenitive: "Szentes", lat: 46.6583, lon: 20.2600, latLabel: "46.6583° É", lonLabel: "20.2600° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "siofok", name: "Siófok", nameGenitive: "Siófok", lat: 46.9041, lon: 18.0580, latLabel: "46.9041° É", lonLabel: "18.0580° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "kazincbarcika", name: "Kazincbarcika", nameGenitive: "Kazincbarcika", lat: 48.2500, lon: 20.6333, latLabel: "48.2500° É", lonLabel: "20.6333° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "gyal", name: "Gyál", nameGenitive: "Gyál", lat: 47.3845, lon: 19.2214, latLabel: "47.3845° É", lonLabel: "19.2214° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "hajduszoboszlo", name: "Hajdúszoboszló", nameGenitive: "Hajdúszoboszló", lat: 47.4500, lon: 21.4000, latLabel: "47.4500° É", lonLabel: "21.4000° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
  { slug: "nagykoros", name: "Nagykőrös", nameGenitive: "Nagykőrös", lat: 47.0333, lon: 19.7833, latLabel: "47.0333° É", lonLabel: "19.7833° K", timezone: "Europe/Budapest", utcOffset: "UTC+1 (CET/CEST)" },
];

export const CITIES_HU: CityConfig[] = hungaryCities.map((city) => ({
  ...city,
  country: "Magyarország",
  countryCode: "HU",
  seoTitle: buildHuSeoTitle(city.name),
  seoDescription: buildHuSeoDescription(city.name),
}));

export function getCityByHuSlug(slug: string): CityConfig | undefined {
  return CITIES_HU.find((city) => city.slug === slug);
}
