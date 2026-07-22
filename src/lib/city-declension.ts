// Genitive (родовий) case of city names for natural text such as
// "Прогноз Kp індексу для Львова" / "Прогноз Kp индекса для Львова".
// The CityConfig.nameGenitive field is actually the locative ("в Києві"),
// which is wrong after the preposition "для"/"для" (both govern the genitive).

type DeclLocale = "uk" | "ru";

// Curated, hand-verified genitive forms keyed by the canonical (uk) slug.
// Used for the regional centers (most SEO traffic) plus irregular compound
// names the derivation cannot handle (е/о and і/о stem alternations).
const UK_GENITIVE_OVERRIDES: Record<string, string> = {
  kyiv: "Києва",
  vinnytsia: "Вінниці",
  dnipro: "Дніпра",
  donetsk: "Донецька",
  zhytomyr: "Житомира",
  zaporizhzhia: "Запоріжжя",
  "ivano-frankivsk": "Івано-Франківська",
  kropyvnytskyi: "Кропивницького",
  luhansk: "Луганська",
  lutsk: "Луцька",
  lviv: "Львова",
  mykolaiv: "Миколаєва",
  odesa: "Одеси",
  poltava: "Полтави",
  rivne: "Рівного",
  sevastopol: "Севастополя",
  simferopol: "Сімферополя",
  sumy: "Сум",
  ternopil: "Тернополя",
  uzhhorod: "Ужгорода",
  kharkiv: "Харкова",
  kherson: "Херсона",
  khmelnytskyi: "Хмельницького",
  cherkasy: "Черкас",
  chernivtsi: "Чернівців",
  chernihiv: "Чернігова",
  "kryvyi-rih": "Кривого Рогу",
  "kamianets-podilskyi": "Кам'янця-Подільського",
  "mohyliv-podilskyi": "Могилева-Подільського",
  lozova: "Лозової", // adjectival fem, not the -а noun pattern
  uman: "Умані", // feminine -нь, not masculine
};

const RU_GENITIVE_OVERRIDES: Record<string, string> = {
  kyiv: "Киева",
  vinnytsia: "Винницы",
  dnipro: "Днепра",
  donetsk: "Донецка",
  zhytomyr: "Житомира",
  zaporizhzhia: "Запорожья",
  "ivano-frankivsk": "Ивано-Франковска",
  kropyvnytskyi: "Кропивницкого",
  luhansk: "Луганска",
  lutsk: "Луцка",
  lviv: "Львова",
  mykolaiv: "Николаева",
  odesa: "Одессы",
  poltava: "Полтавы",
  rivne: "Ровно",
  sevastopol: "Севастополя",
  simferopol: "Симферополя",
  sumy: "Сум",
  ternopil: "Тернополя",
  uzhhorod: "Ужгорода",
  kharkiv: "Харькова",
  kherson: "Херсона",
  khmelnytskyi: "Хмельницкого",
  cherkasy: "Черкасс",
  chernivtsi: "Черновцов",
  chernihiv: "Чернигова",
  "kryvyi-rih": "Кривого Рога",
  "kamianets-podilskyi": "Каменца-Подольского",
  "mohyliv-podilskyi": "Могилева-Подольского",
  lozova: "Лозовой", // adjectival fem
  uman: "Умани", // feminine -нь
};

const UK_ADJ_ENDING = /(ський|цький|ий|ій)$/;

function ukAdjGenitive(word: string): string {
  if (word.endsWith("ий")) return word.slice(0, -2) + "ого";
  if (word.endsWith("ій")) return word.slice(0, -2) + "ього";
  if (word.endsWith("а")) return word.slice(0, -1) + "ої"; // Велика → Великої, Біла → Білої
  if (word.endsWith("я")) return word.slice(0, -1) + "ьої"; // Нижня → Нижньої
  if (word.endsWith("е")) return word.slice(0, -1) + "ого"; // Нове → Нового
  return word;
}

function ukNounGenitive(name: string): string {
  if (name.endsWith("ський")) return name.slice(0, -5) + "ського";
  if (name.endsWith("цький")) return name.slice(0, -5) + "цького";
  if (name.endsWith("зький")) return name.slice(0, -5) + "зького";
  if (name.endsWith("ське")) return name.slice(0, -4) + "ського"; // Кам'янське → Кам'янського
  if (name.endsWith("цьке")) return name.slice(0, -4) + "цького";
  // Plural toponyms (Бірки, Ослави, Копані) have irregular genitives with
  // unpredictable inserted vowels — leave unchanged rather than fabricate.
  if (/[иі]$/.test(name)) return name;
  if (name.endsWith("аїв")) return name.slice(0, -3) + "аєва"; // Миколаїв → Миколаєва
  if (name.endsWith("ів")) return name.slice(0, -2) + "ова"; // Львів → Львова
  if (name.endsWith("й")) return name.slice(0, -1) + "я"; // Стрий → Стрия, Гай → Гая
  if (name.endsWith("іль")) return name.slice(0, -3) + "оля"; // Тернопіль → Тернополя
  if (name.endsWith("ь")) return name.slice(0, -1) + "я";
  if (name.endsWith("ця")) return name.slice(0, -2) + "ці"; // Вінниця → Вінниці
  if (/[гґкх]а$/.test(name)) return name.slice(0, -1) + "и"; // Каховка → Каховки
  if (/[жчшщ]а$/.test(name)) return name.slice(0, -1) + "і";
  if (name.endsWith("а")) return name.slice(0, -1) + "и"; // Полтава → Полтави
  if (/[аеиіоуюяєї]я$/.test(name)) return name.slice(0, -1) + "ї"; // Коломия→Коломиї, Олександрія→Олександрії
  if (name.endsWith("ля")) return name.slice(0, -1) + "і"; // Теребовля → Теребовлі
  if (name.endsWith("я")) return name; // Запоріжжя, Затишшя (neuter doubled consonant)
  if (name.endsWith("о")) return name.slice(0, -1) + "а"; // Дніпро → Дніпра
  if (/[ое]ве$/.test(name)) return name.slice(0, -1) + "ого"; // Берегове → Берегового
  if (name.endsWith("е")) return name;
  return name + "а"; // consonant stem: Херсон → Херсона
}

function deriveUkGenitive(name: string): string {
  if (name.includes("-")) {
    const parts = name.split("-");
    const last = parts.pop() as string;
    const head = parts.map(ukNounGenitive).join("-");
    const lastGen = UK_ADJ_ENDING.test(last) ? ukAdjGenitive(last) : ukNounGenitive(last);
    return `${head}-${lastGen}`;
  }
  if (name.includes(" ")) {
    const parts = name.split(" ");
    const last = parts.pop() as string;
    // Leading words in multi-word toponyms are adjectives (Велика, Нова, Кривий…).
    const head = parts.map(ukAdjGenitive).join(" ");
    const lastGen = UK_ADJ_ENDING.test(last) ? ukAdjGenitive(last) : ukNounGenitive(last);
    return `${head} ${lastGen}`;
  }
  return ukNounGenitive(name);
}

const RU_ADJ_ENDING = /(ский|цкий|ий|ый|ой)$/;

function ruAdjGenitive(word: string): string {
  if (word.endsWith("ий") || word.endsWith("ый") || word.endsWith("ой")) return word.slice(0, -2) + "ого";
  if (word.endsWith("ая")) return word.slice(0, -2) + "ой"; // Великая → Великой
  if (word.endsWith("яя")) return word.slice(0, -2) + "ей";
  if (word.endsWith("ое")) return word.slice(0, -2) + "ого";
  if (word.endsWith("ее")) return word.slice(0, -2) + "его";
  return word;
}

function ruNounGenitive(name: string): string {
  if (name.endsWith("ский")) return name.slice(0, -4) + "ского";
  if (name.endsWith("цкий")) return name.slice(0, -4) + "цкого";
  if (name.endsWith("ое")) return name.slice(0, -2) + "ого"; // Каменское → Каменского
  if (name.endsWith("ее")) return name.slice(0, -2) + "его";
  if (name.endsWith("о")) return name; // indeclinable (Ровно), Мукачево
  if (name.endsWith("й")) return name.slice(0, -1) + "я"; // Стрый → Стрыя
  if (name.endsWith("овь")) return name.slice(0, -3) + "ви"; // Церковь → Церкви (feminine -ь)
  if (name.endsWith("ь")) return name.slice(0, -1) + "я";
  if (name.endsWith("ая")) return name.slice(0, -2) + "ой"; // Лозовая → Лозовой (adjectival fem)
  if (name.endsWith("яя")) return name.slice(0, -2) + "ей";
  if (/[кгхжшчщ]а$/.test(name)) return name.slice(0, -1) + "и"; // Жмеринка → Жмеринки
  if (name.endsWith("а")) return name.slice(0, -1) + "ы";
  if (name.endsWith("я")) return name.slice(0, -1) + "и";
  if (name.endsWith("ы")) return name.slice(0, -1); // plural: Сумы → Сум
  if (name.endsWith("и")) return name; // plural toponyms (Пологи, Прилуки) — irregular genitive, leave as-is
  return name + "а";
}

function deriveRuGenitive(name: string): string {
  if (name.includes("-")) {
    const parts = name.split("-");
    const last = parts.pop() as string;
    const head = parts.map(ruNounGenitive).join("-");
    const lastGen = RU_ADJ_ENDING.test(last) ? ruAdjGenitive(last) : ruNounGenitive(last);
    return `${head}-${lastGen}`;
  }
  if (name.includes(" ")) {
    const parts = name.split(" ");
    const last = parts.pop() as string;
    const head = parts.map(ruAdjGenitive).join(" ");
    const lastGen = RU_ADJ_ENDING.test(last) ? ruAdjGenitive(last) : ruNounGenitive(last);
    return `${head} ${lastGen}`;
  }
  return ruNounGenitive(name);
}

const UK_VOWELS = "аеиіоуюяєїё";

// Euphonic в/у alternation before a locative city name: "у Львові", "у Сваляві"
// but "в Києві", "в Одесі". Chosen by the sound the preposition precedes.
export function ukPreposition(word: string): string {
  const w = word.trim().toLowerCase();
  const first = w[0];
  if (!first) return "в";
  if (UK_VOWELS.includes(first)) return "в";
  if (first === "в" || first === "ф") return "у";
  let i = 1;
  while (i < w.length && (w[i] === "ь" || w[i] === "'" || w[i] === "’" || w[i] === "ʼ")) i++;
  const second = w[i];
  if (second && !UK_VOWELS.includes(second)) return "у"; // consonant cluster: у Дніпрі
  return "в";
}

const RU_VOWELS = "аеёиоуыэюя";

// в/во alternation: "во Львове", "во Владимире" but "в Киеве", "в Одессе".
export function ruPreposition(word: string): string {
  const w = word.trim().toLowerCase();
  const first = w[0];
  const second = w[1];
  if (!first) return "в";
  if ((first === "в" || first === "ф") && second && !RU_VOWELS.includes(second)) return "во";
  if (/^(льв|льд|мн|рт|вс|вн|вт|вл)/.test(w)) return "во";
  return "в";
}

export function getCityGenitive(slug: string, name: string, locale: DeclLocale): string {
  const overrides = locale === "ru" ? RU_GENITIVE_OVERRIDES : UK_GENITIVE_OVERRIDES;
  const override = overrides[slug];
  if (override) return override;
  return locale === "ru" ? deriveRuGenitive(name) : deriveUkGenitive(name);
}
