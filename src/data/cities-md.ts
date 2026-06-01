import type { CityConfig } from "./cities";

function buildRoSeoTitle(name: string, country: string) {
  return `${name}, ${country}: furtuni magnetice astăzi, prognoza Kp pe 3 și 27 de zile`;
}

function buildRoSeoDescription(name: string, country: string) {
  return `Furtuni magnetice în ${name}, ${country} astăzi: indice Kp, vreme, răsărit și apus, calitatea aerului și prognoza activității geomagnetice în timp real.`;
}

const moldovaCities: Array<Omit<CityConfig, "seoTitle" | "seoDescription">> = [
  { slug: "chisinau", name: "Chișinău", nameGenitive: "Chișinău", lat: 47.0105, lon: 28.8638, latLabel: "47.0105° N", lonLabel: "28.8638° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "balti", name: "Bălți", nameGenitive: "Bălți", lat: 47.7539, lon: 27.9184, latLabel: "47.7539° N", lonLabel: "27.9184° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "tiraspol", name: "Tiraspol", nameGenitive: "Tiraspol", lat: 46.8482, lon: 29.5968, latLabel: "46.8482° N", lonLabel: "29.5968° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "bender", name: "Bender / Tighina", nameGenitive: "Bender", lat: 46.8316, lon: 29.4777, latLabel: "46.8316° N", lonLabel: "29.4777° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "comrat", name: "Comrat", nameGenitive: "Comrat", lat: 46.3003, lon: 28.6572, latLabel: "46.3003° N", lonLabel: "28.6572° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "cahul", name: "Cahul", nameGenitive: "Cahul", lat: 45.9043, lon: 28.1993, latLabel: "45.9043° N", lonLabel: "28.1993° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "ceadir-lunga", name: "Ceadîr-Lunga", nameGenitive: "Ceadîr-Lunga", lat: 46.0550, lon: 28.8303, latLabel: "46.0550° N", lonLabel: "28.8303° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "edinet", name: "Edineț", nameGenitive: "Edineț", lat: 48.1681, lon: 27.3050, latLabel: "48.1681° N", lonLabel: "27.3050° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "hincesti", name: "Hîncești", nameGenitive: "Hîncești", lat: 46.8305, lon: 28.5906, latLabel: "46.8305° N", lonLabel: "28.5906° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "orhei", name: "Orhei", nameGenitive: "Orhei", lat: 47.3831, lon: 28.8231, latLabel: "47.3831° N", lonLabel: "28.8231° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "soroca", name: "Soroca", nameGenitive: "Soroca", lat: 48.1566, lon: 28.2849, latLabel: "48.1566° N", lonLabel: "28.2849° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "straseni", name: "Strășeni", nameGenitive: "Strășeni", lat: 47.1414, lon: 28.6103, latLabel: "47.1414° N", lonLabel: "28.6103° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "ungheni", name: "Ungheni", nameGenitive: "Ungheni", lat: 47.2108, lon: 27.8005, latLabel: "47.2108° N", lonLabel: "27.8005° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "anenii-noi", name: "Anenii Noi", nameGenitive: "Anenii Noi", lat: 46.8784, lon: 29.2348, latLabel: "46.8784° N", lonLabel: "29.2348° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "basarabeasca", name: "Basarabeasca", nameGenitive: "Basarabeasca", lat: 46.3317, lon: 28.9636, latLabel: "46.3317° N", lonLabel: "28.9636° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "briceni", name: "Briceni", nameGenitive: "Briceni", lat: 48.3629, lon: 27.0779, latLabel: "48.3629° N", lonLabel: "27.0779° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "cantemir", name: "Cantemir", nameGenitive: "Cantemir", lat: 46.2774, lon: 28.2027, latLabel: "46.2774° N", lonLabel: "28.2027° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "calarasi", name: "Călărași", nameGenitive: "Călărași", lat: 47.2544, lon: 28.3081, latLabel: "47.2544° N", lonLabel: "28.3081° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "causeni", name: "Căușeni", nameGenitive: "Căușeni", lat: 46.6447, lon: 29.4090, latLabel: "46.6447° N", lonLabel: "29.4090° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "cimislia", name: "Cimișlia", nameGenitive: "Cimișlia", lat: 46.5269, lon: 28.7644, latLabel: "46.5269° N", lonLabel: "28.7644° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "criuleni", name: "Criuleni", nameGenitive: "Criuleni", lat: 47.2131, lon: 29.1614, latLabel: "47.2131° N", lonLabel: "29.1614° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "donduseni", name: "Dondușeni", nameGenitive: "Dondușeni", lat: 48.2427, lon: 27.6101, latLabel: "48.2427° N", lonLabel: "27.6101° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "drochia", name: "Drochia", nameGenitive: "Drochia", lat: 48.0355, lon: 27.8129, latLabel: "48.0355° N", lonLabel: "27.8129° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "dubasari", name: "Dubăsari", nameGenitive: "Dubăsari", lat: 47.2631, lon: 29.1608, latLabel: "47.2631° N", lonLabel: "29.1608° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "falesti", name: "Fălești", nameGenitive: "Fălești", lat: 47.5767, lon: 27.7126, latLabel: "47.5767° N", lonLabel: "27.7126° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "floresti", name: "Florești", nameGenitive: "Florești", lat: 47.8914, lon: 28.2931, latLabel: "47.8914° N", lonLabel: "28.2931° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "glodeni", name: "Glodeni", nameGenitive: "Glodeni", lat: 47.7751, lon: 27.5189, latLabel: "47.7751° N", lonLabel: "27.5189° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "ialoveni", name: "Ialoveni", nameGenitive: "Ialoveni", lat: 46.9435, lon: 28.7823, latLabel: "46.9435° N", lonLabel: "28.7823° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "leova", name: "Leova", nameGenitive: "Leova", lat: 46.4786, lon: 28.2553, latLabel: "46.4786° N", lonLabel: "28.2553° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "nisporeni", name: "Nisporeni", nameGenitive: "Nisporeni", lat: 47.0816, lon: 28.1783, latLabel: "47.0816° N", lonLabel: "28.1783° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "ocnita", name: "Ocnița", nameGenitive: "Ocnița", lat: 48.3827, lon: 27.4381, latLabel: "48.3827° N", lonLabel: "27.4381° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "rezina", name: "Rezina", nameGenitive: "Rezina", lat: 47.7493, lon: 28.9628, latLabel: "47.7493° N", lonLabel: "28.9628° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "riscani", name: "Rîșcani", nameGenitive: "Rîșcani", lat: 47.9479, lon: 27.5638, latLabel: "47.9479° N", lonLabel: "27.5638° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "singerei", name: "Sîngerei", nameGenitive: "Sîngerei", lat: 47.6389, lon: 28.1422, latLabel: "47.6389° N", lonLabel: "28.1422° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "soldanesti", name: "Șoldănești", nameGenitive: "Șoldănești", lat: 47.8158, lon: 28.7972, latLabel: "47.8158° N", lonLabel: "28.7972° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "stefan-voda", name: "Ștefan Vodă", nameGenitive: "Ștefan Vodă", lat: 46.5153, lon: 29.6631, latLabel: "46.5153° N", lonLabel: "29.6631° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "taraclia", name: "Taraclia", nameGenitive: "Taraclia", lat: 45.9007, lon: 28.6682, latLabel: "45.9007° N", lonLabel: "28.6682° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "telenesti", name: "Telenești", nameGenitive: "Telenești", lat: 47.5011, lon: 28.3654, latLabel: "47.5011° N", lonLabel: "28.3654° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "vulcanesti", name: "Vulcănești", nameGenitive: "Vulcănești", lat: 45.6844, lon: 28.4028, latLabel: "45.6844° N", lonLabel: "28.4028° E", timezone: "Europe/Chisinau", utcOffset: "UTC+2 (EET/EEST)" },
];

const romaniaCities: Array<Omit<CityConfig, "seoTitle" | "seoDescription">> = [
  { slug: "alba-iulia", name: "Alba Iulia", nameGenitive: "Alba Iulia", lat: 46.0670, lon: 23.5833, latLabel: "46.0670° N", lonLabel: "23.5833° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "alexandria", name: "Alexandria", nameGenitive: "Alexandria", lat: 43.9690, lon: 25.3330, latLabel: "43.9690° N", lonLabel: "25.3330° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "arad", name: "Arad", nameGenitive: "Arad", lat: 46.1866, lon: 21.3123, latLabel: "46.1866° N", lonLabel: "21.3123° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "bacau", name: "Bacău", nameGenitive: "Bacău", lat: 46.5670, lon: 26.9146, latLabel: "46.5670° N", lonLabel: "26.9146° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "baia-mare", name: "Baia Mare", nameGenitive: "Baia Mare", lat: 47.6573, lon: 23.5681, latLabel: "47.6573° N", lonLabel: "23.5681° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "bistrita", name: "Bistrița", nameGenitive: "Bistrița", lat: 47.1350, lon: 24.5000, latLabel: "47.1350° N", lonLabel: "24.5000° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "botosani", name: "Botoșani", nameGenitive: "Botoșani", lat: 47.7407, lon: 26.6658, latLabel: "47.7407° N", lonLabel: "26.6658° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "braila", name: "Brăila", nameGenitive: "Brăila", lat: 45.2692, lon: 27.9575, latLabel: "45.2692° N", lonLabel: "27.9575° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "brasov", name: "Brașov", nameGenitive: "Brașov", lat: 45.6579, lon: 25.6012, latLabel: "45.6579° N", lonLabel: "25.6012° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "buzau", name: "Buzău", nameGenitive: "Buzău", lat: 45.1500, lon: 26.8230, latLabel: "45.1500° N", lonLabel: "26.8230° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "buftea", name: "Buftea", nameGenitive: "Buftea", lat: 44.5614, lon: 25.9489, latLabel: "44.5614° N", lonLabel: "25.9489° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "bucuresti", name: "București", nameGenitive: "București", lat: 44.4268, lon: 26.1025, latLabel: "44.4268° N", lonLabel: "26.1025° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "vaslui", name: "Vaslui", nameGenitive: "Vaslui", lat: 46.6407, lon: 27.7276, latLabel: "46.6407° N", lonLabel: "27.7276° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "galati", name: "Galați", nameGenitive: "Galați", lat: 45.4353, lon: 28.0070, latLabel: "45.4353° N", lonLabel: "28.0070° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "giurgiu", name: "Giurgiu", nameGenitive: "Giurgiu", lat: 43.9037, lon: 25.9699, latLabel: "43.9037° N", lonLabel: "25.9699° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "drobeta-turnu-severin", name: "Drobeta-Turnu Severin", nameGenitive: "Drobeta-Turnu Severin", lat: 44.6319, lon: 22.6561, latLabel: "44.6319° N", lonLabel: "22.6561° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "zalau", name: "Zalău", nameGenitive: "Zalău", lat: 47.1855, lon: 23.0573, latLabel: "47.1855° N", lonLabel: "23.0573° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "calarasi-romania", name: "Călărași", nameGenitive: "Călărași", lat: 44.2051, lon: 27.3136, latLabel: "44.2051° N", lonLabel: "27.3136° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "cluj-napoca", name: "Cluj-Napoca", nameGenitive: "Cluj-Napoca", lat: 46.7712, lon: 23.6236, latLabel: "46.7712° N", lonLabel: "23.6236° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "constanta", name: "Constanța", nameGenitive: "Constanța", lat: 44.1598, lon: 28.6348, latLabel: "44.1598° N", lonLabel: "28.6348° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "craiova", name: "Craiova", nameGenitive: "Craiova", lat: 44.3302, lon: 23.7949, latLabel: "44.3302° N", lonLabel: "23.7949° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "miercurea-ciuc", name: "Miercurea Ciuc", nameGenitive: "Miercurea Ciuc", lat: 46.3610, lon: 25.8020, latLabel: "46.3610° N", lonLabel: "25.8020° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "oradea", name: "Oradea", nameGenitive: "Oradea", lat: 47.0465, lon: 21.9189, latLabel: "47.0465° N", lonLabel: "21.9189° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "pitesti", name: "Pitești", nameGenitive: "Pitești", lat: 44.8565, lon: 24.8692, latLabel: "44.8565° N", lonLabel: "24.8692° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "ploiesti", name: "Ploiești", nameGenitive: "Ploiești", lat: 44.9367, lon: 26.0129, latLabel: "44.9367° N", lonLabel: "26.0129° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "piatra-neamt", name: "Piatra Neamț", nameGenitive: "Piatra Neamț", lat: 46.9290, lon: 26.3770, latLabel: "46.9290° N", lonLabel: "26.3770° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "resita", name: "Reșița", nameGenitive: "Reșița", lat: 45.3008, lon: 21.8892, latLabel: "45.3008° N", lonLabel: "21.8892° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "ramnicu-valcea", name: "Râmnicu Vâlcea", nameGenitive: "Râmnicu Vâlcea", lat: 45.1047, lon: 24.3756, latLabel: "45.1047° N", lonLabel: "24.3756° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "satu-mare", name: "Satu Mare", nameGenitive: "Satu Mare", lat: 47.7920, lon: 22.8853, latLabel: "47.7920° N", lonLabel: "22.8853° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "sibiu", name: "Sibiu", nameGenitive: "Sibiu", lat: 45.7983, lon: 24.1256, latLabel: "45.7983° N", lonLabel: "24.1256° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "slatina", name: "Slatina", nameGenitive: "Slatina", lat: 44.4297, lon: 24.3642, latLabel: "44.4297° N", lonLabel: "24.3642° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "slobozia", name: "Slobozia", nameGenitive: "Slobozia", lat: 44.5647, lon: 27.3633, latLabel: "44.5647° N", lonLabel: "27.3633° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "suceava", name: "Suceava", nameGenitive: "Suceava", lat: 47.6635, lon: 26.2732, latLabel: "47.6635° N", lonLabel: "26.2732° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "sfantu-gheorghe", name: "Sfântu Gheorghe", nameGenitive: "Sfântu Gheorghe", lat: 45.8609, lon: 25.7886, latLabel: "45.8609° N", lonLabel: "25.7886° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "targoviste", name: "Târgoviște", nameGenitive: "Târgoviște", lat: 44.9254, lon: 25.4567, latLabel: "44.9254° N", lonLabel: "25.4567° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "targu-jiu", name: "Târgu Jiu", nameGenitive: "Târgu Jiu", lat: 45.0342, lon: 23.2747, latLabel: "45.0342° N", lonLabel: "23.2747° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "targu-mures", name: "Târgu Mureș", nameGenitive: "Târgu Mureș", lat: 46.5386, lon: 24.5514, latLabel: "46.5386° N", lonLabel: "24.5514° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "timisoara", name: "Timișoara", nameGenitive: "Timișoara", lat: 45.7489, lon: 21.2087, latLabel: "45.7489° N", lonLabel: "21.2087° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "tulcea", name: "Tulcea", nameGenitive: "Tulcea", lat: 45.1716, lon: 28.7914, latLabel: "45.1716° N", lonLabel: "28.7914° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "focsani", name: "Focșani", nameGenitive: "Focșani", lat: 45.6965, lon: 27.1844, latLabel: "45.6965° N", lonLabel: "27.1844° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
  { slug: "iasi", name: "Iași", nameGenitive: "Iași", lat: 47.1585, lon: 27.6014, latLabel: "47.1585° N", lonLabel: "27.6014° E", timezone: "Europe/Bucharest", utcOffset: "UTC+2 (EET/EEST)" },
];

export const RO_COUNTRIES = [
  {
    slug: "moldova",
    name: "Moldova",
    title: "Orașe din Moldova",
    description: "Pagini locale Magnitca pentru orașe și centre raionale din Moldova.",
  },
  {
    slug: "romania",
    name: "România",
    title: "Orașe din România",
    description: "Pagini locale Magnitca pentru municipii și orașe mari din România.",
  },
] as const;

export const CITIES_MD: CityConfig[] = moldovaCities.map((city) => ({
  ...city,
  country: "Moldova",
  countryCode: "MD",
  countrySlug: "moldova",
  seoTitle: buildRoSeoTitle(city.name, "Moldova"),
  seoDescription: buildRoSeoDescription(city.name, "Moldova"),
})).concat(
  romaniaCities.map((city) => ({
    ...city,
    country: "România",
    countryCode: "RO",
    countrySlug: "romania",
    seoTitle: buildRoSeoTitle(city.name, "România"),
    seoDescription: buildRoSeoDescription(city.name, "România"),
  }))
);

export function getCityByMdSlug(slug: string): CityConfig | undefined {
  return CITIES_MD.find((city) => city.slug === slug);
}

export function getRoCountryBySlug(slug: string) {
  return RO_COUNTRIES.find((country) => country.slug === slug);
}

export function getCitiesByRoCountrySlug(slug: string): CityConfig[] {
  return CITIES_MD.filter((city) => city.countrySlug === slug);
}
