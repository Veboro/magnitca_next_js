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
  if (isOblastCenterSlug(slug)) {
    return `Магнітні бурі в ${nameGenitive} сьогодні, kp-індекс та сонячний вітер`;
  }

  return `${name}: магнітні бурі сьогодні, прогноз на 3 та 27 днів`;
}

export function buildRuCitySeoTitle(slug: string, name: string, nameGenitive: string) {
  if (isOblastCenterSlug(slug)) {
    return `Магнитные бури в ${nameGenitive} сегодня, kp-индекс и солнечный ветер`;
  }

  return `${name}: магнитные бури сегодня, прогноз на 3 и 27 дней`;
}

export function buildUkCitySeoDescription(slug: string, name: string, nameGenitive: string) {
  if (isOblastCenterSlug(slug)) {
    return `Магнітні бурі в ${nameGenitive} сьогодні: Kp індекс, погода, схід і захід сонця, якість повітря. Актуальні дані в реальному часі.`;
  }

  return `${name}: магнітні бурі сьогодні, поточний вплив на організм, прогноз Kp на 3 та 27 днів, попередження від Укргідрометцентру.`;
}

export function buildRuCitySeoDescription(slug: string, name: string, nameGenitive: string) {
  if (isOblastCenterSlug(slug)) {
    return `Магнитные бури в ${nameGenitive} сегодня: Kp индекс, погода, восход и закат солнца, качество воздуха. Актуальные данные в реальном времени.`;
  }

  return `${name}: магнитные бури сегодня, текущее влияние на организм, прогноз Kp на 3 и 27 дней, предупреждения Укргидрометцентра.`;
}
