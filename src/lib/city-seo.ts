import { ruPreposition, ukPreposition } from "@/lib/city-declension";

const OBLAST_CENTER_SLUGS = new Set([
  "kyiv",
  "vinnytsia",
  "dnipro",
  "donetsk",
  "zhytomyr",
  "zaporizhzhia",
  "ivano-frankivsk",
  "kropyvnytskyi",
  "luhansk",
  "lutsk",
  "lviv",
  "mykolaiv",
  "odesa",
  "poltava",
  "rivne",
  "simferopol",
  "sumy",
  "ternopil",
  "uzhhorod",
  "kharkiv",
  "kherson",
  "khmelnytskyi",
  "cherkasy",
  "chernivtsi",
  "chernihiv",
  "sevastopol",
]);

export function isOblastCenterSlug(slug: string) {
  return OBLAST_CENTER_SLUGS.has(slug);
}

export function buildUkCitySeoTitle(slug: string, name: string, nameGenitive: string) {
  const prep = ukPreposition(nameGenitive);
  if (isOblastCenterSlug(slug)) {
    return `Магнітні бурі ${prep} ${nameGenitive} сьогодні — Kp-індекс та сонячний вітер`;
  }

  return `Магнітні бурі ${prep} ${nameGenitive} сьогодні: прогноз Kp на 3 та 27 днів`;
}

export function buildRuCitySeoTitle(slug: string, name: string, nameGenitive: string) {
  const prep = ruPreposition(nameGenitive);
  if (isOblastCenterSlug(slug)) {
    return `Магнитные бури ${prep} ${nameGenitive} сегодня — Kp-индекс и солнечный ветер`;
  }

  return `Магнитные бури ${prep} ${nameGenitive} сегодня: прогноз Kp на 3 и 27 дней`;
}

export function buildUkCitySeoDescription(slug: string, name: string, nameGenitive: string) {
  const prep = ukPreposition(nameGenitive);
  if (isOblastCenterSlug(slug)) {
    return `Магнітні бурі ${prep} ${nameGenitive} сьогодні: Kp індекс, погода, схід і захід сонця, якість повітря. Актуальні дані в реальному часі.`;
  }

  return `Магнітні бурі ${prep} ${nameGenitive} сьогодні: поточний вплив на організм, прогноз Kp на 3 та 27 днів, попередження від Укргідрометцентру.`;
}

export function buildRuCitySeoDescription(slug: string, name: string, nameGenitive: string) {
  const prep = ruPreposition(nameGenitive);
  if (isOblastCenterSlug(slug)) {
    return `Магнитные бури ${prep} ${nameGenitive} сегодня: Kp индекс, погода, восход и закат солнца, качество воздуха. Актуальные данные в реальном времени.`;
  }

  return `Магнитные бури ${prep} ${nameGenitive} сегодня: текущее влияние на организм, прогноз Kp на 3 и 27 дней, предупреждения Укргидрометцентра.`;
}
