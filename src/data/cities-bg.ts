import type { CityConfig } from "./cities";

function buildBgSeoTitle(name: string) {
  return `${name}: магнитни бури днес, Kp-прогноза за 3 и 27 дни`;
}

function buildBgSeoDescription(name: string) {
  return `${name}: магнитни бури днес, актуален Kp-индекс, време, изгрев, залез и прогноза за космическото време в реално време.`;
}

type BgCity = { slug: string; name: string; lat: number; lon: number };

const bulgariaCities: BgCity[] = [
  { slug: "sofia", name: "София", lat: 42.6977, lon: 23.3219 },
  { slug: "plovdiv", name: "Пловдив", lat: 42.1354, lon: 24.7453 },
  { slug: "varna", name: "Варна", lat: 43.2141, lon: 27.9147 },
  { slug: "burgas", name: "Бургас", lat: 42.5048, lon: 27.4626 },
  { slug: "ruse", name: "Русе", lat: 43.8356, lon: 25.9657 },
  { slug: "stara-zagora", name: "Стара Загора", lat: 42.4258, lon: 25.6345 },
  { slug: "pleven", name: "Плевен", lat: 43.4170, lon: 24.6067 },
  { slug: "sliven", name: "Сливен", lat: 42.6858, lon: 26.3292 },
  { slug: "dobrich", name: "Добрич", lat: 43.5726, lon: 27.8273 },
  { slug: "shumen", name: "Шумен", lat: 43.2712, lon: 26.9361 },
  { slug: "pernik", name: "Перник", lat: 42.6050, lon: 23.0378 },
  { slug: "haskovo", name: "Хасково", lat: 41.9344, lon: 25.5556 },
  { slug: "yambol", name: "Ямбол", lat: 42.4842, lon: 26.5031 },
  { slug: "pazardzhik", name: "Пазарджик", lat: 42.1928, lon: 24.3336 },
  { slug: "blagoevgrad", name: "Благоевград", lat: 42.0208, lon: 23.0942 },
  { slug: "veliko-tarnovo", name: "Велико Търново", lat: 43.0757, lon: 25.6172 },
  { slug: "vratsa", name: "Враца", lat: 43.2102, lon: 23.5527 },
  { slug: "gabrovo", name: "Габрово", lat: 42.8742, lon: 25.3339 },
  { slug: "asenovgrad", name: "Асеновград", lat: 42.0100, lon: 24.8760 },
  { slug: "vidin", name: "Видин", lat: 43.9962, lon: 22.8672 },
  { slug: "kazanlak", name: "Казанлък", lat: 42.6198, lon: 25.3931 },
  { slug: "kyustendil", name: "Кюстендил", lat: 42.2833, lon: 22.6914 },
  { slug: "kardzhali", name: "Кърджали", lat: 41.6339, lon: 25.3766 },
  { slug: "montana", name: "Монтана", lat: 43.4085, lon: 23.2257 },
  { slug: "dimitrovgrad", name: "Димитровград", lat: 42.0500, lon: 25.6000 },
  { slug: "targovishte", name: "Търговище", lat: 43.2515, lon: 26.5720 },
  { slug: "silistra", name: "Силистра", lat: 44.1170, lon: 27.2603 },
  { slug: "lovech", name: "Ловеч", lat: 43.1370, lon: 24.7139 },
  { slug: "razgrad", name: "Разград", lat: 43.5333, lon: 26.5167 },
  { slug: "dupnitsa", name: "Дупница", lat: 42.2667, lon: 23.1167 },
  { slug: "svishtov", name: "Свищов", lat: 43.6167, lon: 25.3500 },
  { slug: "smolyan", name: "Смолян", lat: 41.5750, lon: 24.7017 },
  { slug: "petrich", name: "Петрич", lat: 41.3958, lon: 23.2069 },
  { slug: "sandanski", name: "Сандански", lat: 41.5667, lon: 23.2833 },
  { slug: "samokov", name: "Самоков", lat: 42.3378, lon: 23.5556 },
  { slug: "lom", name: "Лом", lat: 43.8236, lon: 23.2372 },
  { slug: "sevlievo", name: "Севлиево", lat: 43.0261, lon: 25.1128 },
  { slug: "nova-zagora", name: "Нова Загора", lat: 42.4919, lon: 26.0147 },
  { slug: "velingrad", name: "Велинград", lat: 42.0269, lon: 24.0000 },
  { slug: "karlovo", name: "Карлово", lat: 42.6428, lon: 24.8069 },
  { slug: "troyan", name: "Троян", lat: 42.8867, lon: 24.7147 },
  { slug: "botevgrad", name: "Ботевград", lat: 42.9092, lon: 23.7897 },
  { slug: "gorna-oryahovitsa", name: "Горна Оряховица", lat: 43.1289, lon: 25.6961 },
  { slug: "aytos", name: "Айтос", lat: 42.7000, lon: 27.2500 },
  { slug: "cherven-bryag", name: "Червен бряг", lat: 43.2667, lon: 24.0833 },
  { slug: "panagyurishte", name: "Панагюрище", lat: 42.4939, lon: 24.1897 },
  { slug: "chirpan", name: "Чирпан", lat: 42.2000, lon: 25.3333 },
  { slug: "peshtera", name: "Пещера", lat: 42.0333, lon: 24.3000 },
  { slug: "harmanli", name: "Харманли", lat: 41.9333, lon: 25.9000 },
  { slug: "provadia", name: "Провадия", lat: 43.1789, lon: 27.4331 },
  { slug: "berkovitsa", name: "Берковица", lat: 43.2333, lon: 23.1167 },
];

export const CITIES_BG: CityConfig[] = bulgariaCities.map((city) => ({
  slug: city.slug,
  name: city.name,
  nameGenitive: city.name,
  lat: city.lat,
  lon: city.lon,
  latLabel: `${city.lat.toFixed(4)}° с.ш.`,
  lonLabel: `${city.lon.toFixed(4)}° и.д.`,
  timezone: "Europe/Sofia",
  utcOffset: "UTC+2 (EET/EEST)",
  country: "България",
  countryCode: "BG",
  seoTitle: buildBgSeoTitle(city.name),
  seoDescription: buildBgSeoDescription(city.name),
}));

export function getCityByBgSlug(slug: string): CityConfig | undefined {
  return CITIES_BG.find((city) => city.slug === slug);
}
