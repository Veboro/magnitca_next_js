import type { CityConfig } from "./cities";

type RegionGroup = {
  key: string;
  titleUk: string;
  titleRu: string;
  slugs: string[];
};

function makeCity(
  slug: string,
  name: string,
  nameGenitive: string,
  lat: number,
  lon: number
): CityConfig {
  const latSuffix = lat >= 0 ? "Пн" : "Пд";
  const lonSuffix = lon >= 0 ? "Сх" : "Зх";

  return {
    slug,
    name,
    nameGenitive,
    lat,
    lon,
    latLabel: `${Math.abs(lat).toFixed(4)}° ${latSuffix}`,
    lonLabel: `${Math.abs(lon).toFixed(4)}° ${lonSuffix}`,
    timezone: "Europe/Kyiv",
    utcOffset: "UTC+2 (EET)",
    seoTitle: `${name}: магнітні бурі сьогодні — погода, якість повітря`,
    seoDescription: `${name}: Kp індекс, погода, схід і захід сонця, якість повітря. Актуальні дані в реальному часі.`,
  };
}

export const EXTRA_UK_CITIES: CityConfig[] = [
  makeCity("zhmerynka", "Жмеринка", "Жмеринці", 49.0371, 28.1120),
  makeCity("mohyliv-podilskyi", "Могилів-Подільський", "Могилеві-Подільському", 48.4459, 27.7982),
  makeCity("kovel", "Ковель", "Ковелі", 51.2153, 24.7087),
  makeCity("volodymyr", "Володимир", "Володимирі", 50.8525, 24.3236),
  makeCity("kryvyi-rih", "Кривий Ріг", "Кривому Розі", 47.9105, 33.3918),
  makeCity("kamianske", "Кам'янське", "Кам'янському", 48.5167, 34.6136),
  makeCity("pavlohrad", "Павлоград", "Павлограді", 48.5343, 35.8700),
  makeCity("mariupol", "Маріуполь", "Маріуполі", 47.0971, 37.5434),
  makeCity("kramatorsk", "Краматорськ", "Краматорську", 48.7389, 37.5844),
  makeCity("sloviansk", "Слов'янськ", "Слов'янську", 48.8523, 37.6053),
  makeCity("berdychiv", "Бердичів", "Бердичеві", 49.8993, 28.6024),
  makeCity("korosten", "Коростень", "Коростені", 50.9506, 28.6386),
  makeCity("mukachevo", "Мукачево", "Мукачеві", 48.4392, 22.7178),
  makeCity("khust", "Хуст", "Хусті", 48.1793, 23.2978),
  makeCity("melitopol", "Мелітополь", "Мелітополі", 46.8489, 35.3653),
  makeCity("berdiansk", "Бердянськ", "Бердянську", 46.7664, 36.7987),
  makeCity("kalush", "Калуш", "Калуші", 49.0119, 24.3731),
  makeCity("kolomyia", "Коломия", "Коломиї", 48.5311, 25.0365),
  makeCity("bila-tserkva", "Біла Церква", "Білій Церкві", 49.7968, 30.1311),
  makeCity("brovary", "Бровари", "Броварах", 50.5111, 30.7900),
  makeCity("boryspil", "Бориспіль", "Борисполі", 50.3453, 30.9550),
  makeCity("bucha", "Буча", "Бучі", 50.5439, 30.2123),
  makeCity("irpin", "Ірпінь", "Ірпені", 50.5218, 30.2506),
  makeCity("oleksandriia", "Олександрія", "Олександрії", 48.6696, 33.1159),
  makeCity("svitlovodsk", "Світловодськ", "Світловодську", 49.0489, 33.2411),
  makeCity("sievierodonetsk", "Сєвєродонецьк", "Сєвєродонецьку", 48.9482, 38.4879),
  makeCity("lysychansk", "Лисичанськ", "Лисичанську", 48.9049, 38.4421),
  makeCity("drohobych", "Дрогобич", "Дрогобичі", 49.3587, 23.5123),
  makeCity("chervonohrad", "Червоноград", "Червонограді", 50.3911, 24.2351),
  makeCity("stryi", "Стрий", "Стрию", 49.2622, 23.8561),
  makeCity("pervomaisk", "Первомайськ", "Первомайську", 48.0443, 30.8507),
  makeCity("yuzhnoukrainsk", "Южноукраїнськ", "Южноукраїнську", 47.8178, 31.1826),
  makeCity("izmail", "Ізмаїл", "Ізмаїлі", 45.3517, 28.8374),
  makeCity("bilhorod-dnistrovskyi", "Білгород-Дністровський", "Білгороді-Дністровському", 46.1952, 30.3494),
  makeCity("chornomorsk", "Чорноморськ", "Чорноморську", 46.3019, 30.6548),
  makeCity("kremenchuk", "Кременчук", "Кременчуці", 49.0661, 33.4102),
  makeCity("myrhorod", "Миргород", "Миргороді", 49.9685, 33.6089),
  makeCity("lubny", "Лубни", "Лубнах", 50.0163, 32.9969),
  makeCity("dubno", "Дубно", "Дубні", 50.4169, 25.7343),
  makeCity("varash", "Вараш", "Вараші", 51.3500, 25.8500),
  makeCity("konotop", "Конотоп", "Конотопі", 51.2403, 33.2051),
  makeCity("shostka", "Шостка", "Шостці", 51.8651, 33.4793),
  makeCity("okhtyrka", "Охтирка", "Охтирці", 50.3104, 34.8988),
  makeCity("chortkiv", "Чортків", "Чорткові", 49.0166, 25.7980),
  makeCity("kremenets", "Кременець", "Кременці", 50.0969, 25.7261),
  makeCity("lozova", "Лозова", "Лозовій", 48.8894, 36.3176),
  makeCity("izium", "Ізюм", "Ізюмі", 49.2128, 37.2555),
  makeCity("nova-kakhovka", "Нова Каховка", "Новій Каховці", 46.7504, 33.3486),
  makeCity("henichesk", "Генічеськ", "Генічеську", 46.1711, 34.8034),
  makeCity("kamianets-podilskyi", "Кам'янець-Подільський", "Кам'янці-Подільському", 48.6845, 26.5852),
  makeCity("shepetivka", "Шепетівка", "Шепетівці", 50.1855, 27.0636),
  makeCity("uman", "Умань", "Умані", 48.7484, 30.2218),
  makeCity("smila", "Сміла", "Смілі", 49.2224, 31.8871),
  makeCity("zolotonosha", "Золотоноша", "Золотоноші", 49.6683, 32.0405),
  makeCity("khotyn", "Хотин", "Хотині", 48.5150, 26.4910),
  makeCity("storozhynets", "Сторожинець", "Сторожинці", 48.1643, 25.7189),
  makeCity("nizhyn", "Ніжин", "Ніжині", 51.0480, 31.8869),
  makeCity("pryluky", "Прилуки", "Прилуках", 50.5937, 32.3876),
  makeCity("yalta", "Ялта", "Ялті", 44.4952, 34.1663),
  makeCity("kerch", "Керч", "Керчі", 45.3560, 36.4674),
  makeCity("yevpatoriia", "Євпаторія", "Євпаторії", 45.2009, 33.3666),
  // Vinnytska
  makeCity("haisyn", "Гайсин", "Гайсині", 48.8103, 29.3842),
  makeCity("tulchyn", "Тульчин", "Тульчині", 48.6744, 28.8497),
  makeCity("khmilnyk", "Хмільник", "Хмільнику", 49.5569, 27.9572),
  // Volynska
  makeCity("kamin-kashyrskyi", "Камінь-Каширський", "Камені-Каширському", 51.6242, 24.9606),
  // Dnipropetrovska
  makeCity("nikopol", "Нікополь", "Нікополі", 47.5670, 34.4000),
  makeCity("synelnykove", "Синельникове", "Синельниковому", 48.3178, 35.5119),
  makeCity("novomoskovsk", "Новомосковськ", "Новомосковську", 48.6333, 35.2167),
  // Donetska
  makeCity("bakhmut", "Бахмут", "Бахмуті", 48.5947, 38.0008),
  makeCity("horlivka", "Горлівка", "Горлівці", 48.3000, 38.0500),
  makeCity("pokrovsk", "Покровськ", "Покровську", 48.2828, 37.1828),
  makeCity("volnovakha", "Волноваха", "Волновасі", 47.6022, 37.4919),
  // Zhytomyrska
  makeCity("zviahel", "Звягель", "Звягелі", 50.5833, 27.6333),
  // Zakarpatska
  makeCity("berehove", "Берегове", "Береговому", 48.2056, 22.6472),
  makeCity("rakhiv", "Рахів", "Рахові", 48.0500, 24.2000),
  makeCity("tiachiv", "Тячів", "Тячеві", 48.0114, 23.5722),
  // Zaporizka
  makeCity("polohy", "Пологи", "Пологах", 47.4833, 36.2500),
  makeCity("vasylivka", "Василівка", "Василівці", 47.4431, 35.2819),
  // Ivano-Frankivska
  makeCity("nadvirna", "Надвірна", "Надвірній", 48.6330, 24.5830),
  makeCity("kosiv", "Косів", "Косові", 48.3135, 25.0822),
  makeCity("verkhovyna", "Верховина", "Верховині", 48.1517, 24.8136),
  // Kyivska
  makeCity("fastiv", "Фастів", "Фастові", 50.0767, 29.9177),
  makeCity("obukhiv", "Обухів", "Обухові", 50.1101, 30.6265),
  makeCity("vyshhorod", "Вишгород", "Вишгороді", 50.8170, 30.4000),
  // Kirovohradska
  makeCity("novoukrainka", "Новоукраїнка", "Новоукраїнці", 48.3231, 31.5242),
  makeCity("holovanivsk", "Голованівськ", "Голованівську", 48.3800, 30.4472),
  // Luhanska
  makeCity("alchevsk", "Алчевськ", "Алчевську", 48.4778, 38.7978),
  makeCity("starobilsk", "Старобільськ", "Старобільську", 49.2775, 38.9242),
  makeCity("svatove", "Сватове", "Сватовому", 49.4150, 38.1550),
  makeCity("dovzhansk", "Довжанськ", "Довжанську", 48.0778, 39.6472),
  makeCity("rovenky", "Ровеньки", "Ровеньках", 48.0711, 39.3428),
  // Lvivska
  makeCity("sambir", "Самбір", "Самборі", 49.5167, 23.2028),
  makeCity("zolochiv", "Золочів", "Золочеві", 49.8075, 24.9031),
  // Mykolaivska
  makeCity("voznesensk", "Вознесенськ", "Вознесенську", 47.5500, 31.3330),
  makeCity("bashtanka", "Баштанка", "Баштанці", 47.4056, 32.4375),
  // Odeska
  makeCity("podilsk", "Подільськ", "Подільську", 47.7419, 29.5350),
  makeCity("rozdilna", "Роздільна", "Роздільній", 46.8486, 30.0792),
  makeCity("bolhrad", "Болград", "Болграді", 45.6672, 28.6128),
  makeCity("berezivka", "Березівка", "Березівці", 47.2039, 30.9128),
  // Rivnenska
  makeCity("sarny", "Сарни", "Сарнах", 51.3372, 26.6058),
  // Sumska
  makeCity("romny", "Ромни", "Ромнах", 50.7500, 33.4670),
  // Kharkivska
  makeCity("chuhuiv", "Чугуїв", "Чугуєві", 49.8356, 36.6864),
  makeCity("kupiansk", "Куп'янськ", "Куп'янську", 49.7170, 37.5830),
  makeCity("bohodukhiv", "Богодухів", "Богодухові", 50.1822, 35.5161),
  makeCity("krasnohrad", "Красноград", "Красноградi", 49.3686, 35.4500),
  // Khersonska
  makeCity("skadovsk", "Скадовськ", "Скадовську", 46.1170, 32.9170),
  makeCity("beryslav", "Берислав", "Бериславі", 46.8330, 33.4170),
  // Cherkaska
  makeCity("zvenyhorodka", "Звенигородка", "Звенигородці", 49.0697, 30.9678),
  // Chernivtska
  makeCity("vyzhnytsia", "Вижниця", "Вижниці", 48.2500, 25.1917),
  makeCity("kelmentsi", "Кельменці", "Кельменцях", 48.4633, 26.8292),
  // Chernihivska
  makeCity("novhorod-siverskyi", "Новгород-Сіверський", "Новгороді-Сіверському", 52.0043, 33.2780),
  makeCity("koriukivka", "Корюківка", "Корюківці", 51.7833, 32.2500),
];

export const UKRAINE_REGION_GROUPS: RegionGroup[] = [
  { key: "kyiv-city", titleUk: "м. Київ", titleRu: "г. Киев", slugs: ["kyiv"] },
  { key: "vinnytsia", titleUk: "Вінницька область", titleRu: "Винницкая область", slugs: ["vinnytsia", "zhmerynka", "mohyliv-podilskyi", "haisyn", "tulchyn", "khmilnyk"] },
  { key: "volyn", titleUk: "Волинська область", titleRu: "Волынская область", slugs: ["lutsk", "kovel", "volodymyr", "kamin-kashyrskyi"] },
  { key: "dnipropetrovsk", titleUk: "Дніпропетровська область", titleRu: "Днепропетровская область", slugs: ["dnipro", "kryvyi-rih", "kamianske", "pavlohrad", "nikopol", "synelnykove", "novomoskovsk"] },
  { key: "donetsk", titleUk: "Донецька область", titleRu: "Донецкая область", slugs: ["donetsk", "mariupol", "kramatorsk", "sloviansk", "bakhmut", "horlivka", "pokrovsk", "volnovakha"] },
  { key: "zhytomyr", titleUk: "Житомирська область", titleRu: "Житомирская область", slugs: ["zhytomyr", "berdychiv", "korosten", "zviahel"] },
  { key: "zakarpattia", titleUk: "Закарпатська область", titleRu: "Закарпатская область", slugs: ["uzhhorod", "mukachevo", "khust", "berehove", "rakhiv", "tiachiv"] },
  { key: "zaporizhzhia", titleUk: "Запорізька область", titleRu: "Запорожская область", slugs: ["zaporizhzhia", "melitopol", "berdiansk", "polohy", "vasylivka"] },
  { key: "ivano-frankivsk", titleUk: "Івано-Франківська область", titleRu: "Ивано-Франковская область", slugs: ["ivano-frankivsk", "kalush", "kolomyia", "nadvirna", "kosiv", "verkhovyna"] },
  { key: "kyiv-oblast", titleUk: "Київська область", titleRu: "Киевская область", slugs: ["bila-tserkva", "brovary", "boryspil", "bucha", "irpin", "fastiv", "obukhiv", "vyshhorod"] },
  { key: "kirovohrad", titleUk: "Кіровоградська область", titleRu: "Кировоградская область", slugs: ["kropyvnytskyi", "oleksandriia", "svitlovodsk", "novoukrainka", "holovanivsk"] },
  { key: "luhansk", titleUk: "Луганська область", titleRu: "Луганская область", slugs: ["luhansk", "sievierodonetsk", "lysychansk", "alchevsk", "starobilsk", "svatove", "dovzhansk", "rovenky"] },
  { key: "lviv", titleUk: "Львівська область", titleRu: "Львовская область", slugs: ["lviv", "drohobych", "chervonohrad", "stryi", "sambir", "zolochiv"] },
  { key: "mykolaiv", titleUk: "Миколаївська область", titleRu: "Николаевская область", slugs: ["mykolaiv", "pervomaisk", "yuzhnoukrainsk", "voznesensk", "bashtanka"] },
  { key: "odesa", titleUk: "Одеська область", titleRu: "Одесская область", slugs: ["odesa", "izmail", "bilhorod-dnistrovskyi", "chornomorsk", "podilsk", "rozdilna", "bolhrad", "berezivka"] },
  { key: "poltava", titleUk: "Полтавська область", titleRu: "Полтавская область", slugs: ["poltava", "kremenchuk", "myrhorod", "lubny"] },
  { key: "rivne", titleUk: "Рівненська область", titleRu: "Ровенская область", slugs: ["rivne", "dubno", "varash", "sarny"] },
  { key: "sumy", titleUk: "Сумська область", titleRu: "Сумская область", slugs: ["sumy", "konotop", "shostka", "okhtyrka", "romny"] },
  { key: "ternopil", titleUk: "Тернопільська область", titleRu: "Тернопольская область", slugs: ["ternopil", "chortkiv", "kremenets"] },
  { key: "kharkiv", titleUk: "Харківська область", titleRu: "Харьковская область", slugs: ["kharkiv", "lozova", "izium", "chuhuiv", "kupiansk", "bohodukhiv", "krasnohrad"] },
  { key: "kherson", titleUk: "Херсонська область", titleRu: "Херсонская область", slugs: ["kherson", "nova-kakhovka", "henichesk", "skadovsk", "beryslav"] },
  { key: "khmelnytskyi", titleUk: "Хмельницька область", titleRu: "Хмельницкая область", slugs: ["khmelnytskyi", "kamianets-podilskyi", "shepetivka"] },
  { key: "cherkasy", titleUk: "Черкаська область", titleRu: "Черкасская область", slugs: ["cherkasy", "uman", "smila", "zolotonosha", "zvenyhorodka"] },
  { key: "chernivtsi", titleUk: "Чернівецька область", titleRu: "Черновицкая область", slugs: ["chernivtsi", "khotyn", "storozhynets", "vyzhnytsia", "kelmentsi"] },
  { key: "chernihiv", titleUk: "Чернігівська область", titleRu: "Черниговская область", slugs: ["chernihiv", "nizhyn", "pryluky", "novhorod-siverskyi", "koriukivka"] },
  { key: "crimea", titleUk: "Автономна Республіка Крим", titleRu: "Автономная Республика Крым", slugs: ["simferopol", "sevastopol", "yalta", "kerch", "yevpatoriia"] },
];
