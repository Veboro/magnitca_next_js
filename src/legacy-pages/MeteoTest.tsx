"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Activity, BarChart3, Send, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageMeta } from "@/hooks/usePageMeta";
import type { SiteLocale } from "@/lib/locale";

type BaseLocale = Extract<SiteLocale, "uk" | "ru" | "pl">;
type LegacyLocale = SiteLocale;

interface PersonalInfo {
  name: string;
  age: string;
  gender: string;
  hasChronic: boolean;
  physicalActivity: string;
}

type Step = "info" | "questions" | "calculating" | "result";

type TestStatsResponse = {
  total: number;
  recentCount: number;
  averageScore: number | null;
  highSensitivityShare: number | null;
  strongestGender: { key: "male" | "female" | "other"; count: number; averageScore: number | null } | null;
  strongestAgeGroup: { key: string; count: number; averageScore: number | null } | null;
  genderAverages: Record<"male" | "female" | "other", { count: number; averageScore: number | null }>;
  ageAverages: Record<string, { count: number; averageScore: number | null }>;
  chronicAverage: number | null;
  nonChronicAverage: number | null;
};

const copy: Record<
  BaseLocale,
  {
    title: string;
    description: string;
    backHome: string;
    heading: string;
    subtitle: string;
    introTitle: string;
    introText: string;
    howItWorksTitle: string;
    howItWorksItems: string[];
    resultsInfoTitle: string;
    resultsInfoText: string;
    disclaimerTitle: string;
    disclaimerText: string;
    yourName: string;
    enterName: string;
    age: string;
    gender: string;
    physicalActivity: string;
    hasChronic: string;
    startTest: string;
    questionProgress: string;
    analyzing: string;
    processingPersonal: string;
    comparingMeteo: string;
    calculatingIndex: string;
    formingResult: string;
    yourResult: string;
    tryAgain: string;
    telegramTitle: string;
    telegramText: string;
    telegramButton: string;
    answerOptions: Array<{ label: string; value: number }>;
    genderOptions: string[];
    activityOptions: string[];
    questions: string[];
    labels: {
      high: string;
      highDesc: string;
      moderate: string;
      moderateDesc: string;
      low: string;
      lowDesc: string;
      resistant: string;
      resistantDesc: string;
    };
  }
> = {
  uk: {
    title: "Тест на метеозалежність — Магнітка",
    description:
      "Безкоштовний тест на метеочутливість. Дізнайтесь, наскільки ваш організм чутливий до магнітних бур та геомагнітної активності.",
    backHome: "На головну",
    heading: "Тест на метеозалежність",
    subtitle:
      "Дізнайтесь, наскільки ваш організм чутливий до магнітних бур. Тест займе 2-3 хвилини.",
    introTitle: "Як працює тест",
    introText:
      "Цей тест допомагає приблизно оцінити, наскільки ви чутливі до змін геомагнітної активності, перепадів тиску та пов'язаних із ними симптомів.",
    howItWorksTitle: "Що враховується",
    howItWorksItems: [
      "ваші типові реакції на магнітні бурі та зміни погоди",
      "вік, рівень фізичної активності та наявність хронічних станів",
      "частота симптомів: головний біль, втома, безсоння, коливання тиску, тривожність",
    ],
    resultsInfoTitle: "Що означає результат",
    resultsInfoText:
      "Після відповідей ви отримаєте відсоткову оцінку метеочутливості. Чим вищий відсоток, тим імовірніше, що періоди магнітних бур або різких погодних змін можуть впливати на ваше самопочуття.",
    disclaimerTitle: "Важливо",
    disclaimerText:
      "Це не медичний діагноз і не замінює консультацію лікаря. Тест дає орієнтовну оцінку, яка допомагає краще зрозуміти власні реакції та стежити за прогнозами.",
    yourName: "Ваше ім'я",
    enterName: "Введіть ім'я",
    age: "Вік",
    gender: "Стать",
    physicalActivity: "Рівень фізичної активності",
    hasChronic: "Маю хронічні захворювання (серцево-судинні, неврологічні та ін.)",
    startTest: "Почати тест",
    questionProgress: "Питання",
    analyzing: "Аналізуємо ваші відповіді...",
    processingPersonal: "Обробка персональних даних...",
    comparingMeteo: "Порівняння з базою метеоданих...",
    calculatingIndex: "Обрахунок індексу чутливості...",
    formingResult: "Формування результату...",
    yourResult: "Ваш результат",
    tryAgain: "Пройти ще раз",
    telegramTitle: "Не пропустіть магнітні бурі!",
    telegramText:
      "Підпишіться на наш Telegram-канал і отримуйте щоденні прогнози магнітних бур прямо в месенджер.",
    telegramButton: "Підписатись в Telegram",
    answerOptions: [
      { label: "Ніколи", value: 0 },
      { label: "Рідко", value: 1 },
      { label: "Іноді", value: 2 },
      { label: "Часто", value: 3 },
      { label: "Завжди", value: 4 },
    ],
    genderOptions: ["Чоловіча", "Жіноча", "Інше"],
    activityOptions: ["Низька", "Помірна", "Висока"],
    questions: [
      "Чи відчуваєте ви головний біль під час магнітних бур?",
      "Чи буває у вас підвищена втомлюваність у дні геомагнітних збурень?",
      "Чи маєте проблеми зі сном напередодні або під час магнітних бур?",
      "Чи помічаєте різкі зміни настрою, пов'язані з сонячною активністю?",
      "Чи відчуваєте коливання артеріального тиску під час бур?",
      "Чи буває у вас запаморочення під час геомагнітної активності?",
      "Чи відчуваєте біль у суглобах або м'язах під час магнітних бур?",
      "Чи з'являється тривожність або неспокій під час магнітних бур?",
      "Чи маєте проблеми з концентрацією під час геомагнітних збурень?",
      "Чи помічаєте порушення серцевого ритму під час бур?",
      "Чи відчуваєте зміни погоди ще до того, як вони настають?",
      "Чи погіршуються хронічні захворювання під час магнітних бур?",
    ],
    labels: {
      high: "Висока метеозалежність",
      highDesc:
        "Ви значно реагуєте на геомагнітну активність. Рекомендуємо уважно стежити за прогнозами магнітних бур та коригувати режим дня.",
      moderate: "Помірна метеозалежність",
      moderateDesc:
        "Ви помірно чутливі до змін космічної погоди. Варто звертати увагу на дні підвищеної активності.",
      low: "Слабка метеозалежність",
      lowDesc:
        "Ви мало чутливі до магнітних бур. Зазвичай вони не впливають на ваше самопочуття суттєво.",
      resistant: "Метеостійкість",
      resistantDesc: "Чудово! Геомагнітна активність практично не впливає на ваш організм.",
    },
  },
  ru: {
    title: "Тест на метеозависимость — Магнитка",
    description:
      "Бесплатный тест на метеочувствительность. Узнайте, насколько ваш организм чувствителен к магнитным бурям и геомагнитной активности.",
    backHome: "На главную",
    heading: "Тест на метеозависимость",
    subtitle:
      "Узнайте, насколько ваш организм чувствителен к магнитным бурям. Тест займёт 2-3 минуты.",
    introTitle: "Как работает тест",
    introText:
      "Этот тест помогает примерно оценить, насколько вы чувствительны к изменениям геомагнитной активности, перепадам давления и связанным с ними симптомам.",
    howItWorksTitle: "Что учитывается",
    howItWorksItems: [
      "ваши типичные реакции на магнитные бури и изменения погоды",
      "возраст, уровень физической активности и наличие хронических состояний",
      "частота симптомов: головная боль, усталость, бессонница, колебания давления, тревожность",
    ],
    resultsInfoTitle: "Что означает результат",
    resultsInfoText:
      "После ответов вы получите процентную оценку метеочувствительности. Чем выше процент, тем вероятнее, что периоды магнитных бурь или резких погодных изменений влияют на ваше самочувствие.",
    disclaimerTitle: "Важно",
    disclaimerText:
      "Это не медицинский диагноз и не замена консультации врача. Тест даёт ориентировочную оценку, которая помогает лучше понять собственные реакции и следить за прогнозами.",
    yourName: "Ваше имя",
    enterName: "Введите имя",
    age: "Возраст",
    gender: "Пол",
    physicalActivity: "Уровень физической активности",
    hasChronic: "Имею хронические заболевания (сердечно-сосудистые, неврологические и др.)",
    startTest: "Начать тест",
    questionProgress: "Вопрос",
    analyzing: "Анализируем ваши ответы...",
    processingPersonal: "Обработка персональных данных...",
    comparingMeteo: "Сравнение с базой метеоданных...",
    calculatingIndex: "Расчёт индекса чувствительности...",
    formingResult: "Формирование результата...",
    yourResult: "Ваш результат",
    tryAgain: "Пройти ещё раз",
    telegramTitle: "Не пропустите магнитные бури!",
    telegramText:
      "Подпишитесь на наш Telegram-канал и получайте ежедневные прогнозы магнитных бурь прямо в мессенджер.",
    telegramButton: "Подписаться в Telegram",
    answerOptions: [
      { label: "Никогда", value: 0 },
      { label: "Редко", value: 1 },
      { label: "Иногда", value: 2 },
      { label: "Часто", value: 3 },
      { label: "Всегда", value: 4 },
    ],
    genderOptions: ["Мужской", "Женский", "Другой"],
    activityOptions: ["Низкая", "Умеренная", "Высокая"],
    questions: [
      "Чувствуете ли вы головную боль во время магнитных бурь?",
      "Бывает ли у вас повышенная утомляемость в дни геомагнитных возмущений?",
      "Есть ли проблемы со сном накануне или во время магнитных бурь?",
      "Замечаете ли вы резкие перепады настроения, связанные с солнечной активностью?",
      "Чувствуете ли вы колебания артериального давления во время бурь?",
      "Бывает ли у вас головокружение во время геомагнитной активности?",
      "Чувствуете ли вы боль в суставах или мышцах во время магнитных бурь?",
      "Появляется ли тревожность или беспокойство во время магнитных бурь?",
      "Есть ли проблемы с концентрацией во время геомагнитных возмущений?",
      "Замечаете ли вы нарушения сердечного ритма во время бурь?",
      "Чувствуете ли вы изменения погоды ещё до их наступления?",
      "Обостряются ли хронические заболевания во время магнитных бурь?",
    ],
    labels: {
      high: "Высокая метеозависимость",
      highDesc:
        "Вы значительно реагируете на геомагнитную активность. Рекомендуем внимательно следить за прогнозами магнитных бурь и корректировать режим дня.",
      moderate: "Умеренная метеозависимость",
      moderateDesc:
        "Вы умеренно чувствительны к изменениям космической погоды. Стоит обращать внимание на дни повышенной активности.",
      low: "Слабая метеозависимость",
      lowDesc:
        "Вы мало чувствительны к магнитным бурям. Обычно они не влияют на ваше самочувствие существенно.",
      resistant: "Метеоустойчивость",
      resistantDesc: "Отлично! Геомагнитная активность практически не влияет на ваш организм.",
    },
  },
  pl: {
    title: "Test na meteowrażliwość — Magnitca",
    description:
      "Bezpłatny test na meteowrażliwość. Sprawdź, jak silnie Twój organizm reaguje na burze magnetyczne i aktywność geomagnetyczną.",
    backHome: "Na stronę główną",
    heading: "Test na meteowrażliwość",
    subtitle:
      "Sprawdź, jak bardzo Twój organizm reaguje na burze magnetyczne. Test zajmie 2-3 minuty.",
    introTitle: "Jak działa test",
    introText:
      "Ten test pomaga w przybliżeniu ocenić, jak silnie reagujesz na zmiany aktywności geomagnetycznej, wahania ciśnienia i związane z nimi objawy.",
    howItWorksTitle: "Co bierzemy pod uwagę",
    howItWorksItems: [
      "Twoje typowe reakcje na burze magnetyczne i zmiany pogody",
      "wiek, poziom aktywności fizycznej i obecność chorób przewlekłych",
      "częstość objawów: ból głowy, zmęczenie, bezsenność, wahania ciśnienia, niepokój",
    ],
    resultsInfoTitle: "Co oznacza wynik",
    resultsInfoText:
      "Po odpowiedzi otrzymasz procentową ocenę meteowrażliwości. Im wyższy wynik, tym większe prawdopodobieństwo, że burze magnetyczne lub gwałtowne zmiany pogody wpływają na Twoje samopoczucie.",
    disclaimerTitle: "Ważne",
    disclaimerText:
      "To nie jest diagnoza medyczna i nie zastępuje konsultacji z lekarzem. Test daje orientacyjną ocenę, która pomaga lepiej zrozumieć własne reakcje i śledzić prognozy.",
    yourName: "Twoje imię",
    enterName: "Wpisz imię",
    age: "Wiek",
    gender: "Płeć",
    physicalActivity: "Poziom aktywności fizycznej",
    hasChronic: "Mam choroby przewlekłe (sercowo-naczyniowe, neurologiczne itp.)",
    startTest: "Rozpocznij test",
    questionProgress: "Pytanie",
    analyzing: "Analizujemy Twoje odpowiedzi...",
    processingPersonal: "Przetwarzanie danych osobowych...",
    comparingMeteo: "Porównanie z bazą danych pogodowych...",
    calculatingIndex: "Obliczanie wskaźnika wrażliwości...",
    formingResult: "Przygotowanie wyniku...",
    yourResult: "Twój wynik",
    tryAgain: "Zrób test ponownie",
    telegramTitle: "Nie przegap burz magnetycznych!",
    telegramText:
      "Dołącz do naszego kanału w Telegramie i otrzymuj codzienne prognozy burz magnetycznych bezpośrednio w komunikatorze.",
    telegramButton: "Dołącz do Telegrama",
    answerOptions: [
      { label: "Nigdy", value: 0 },
      { label: "Rzadko", value: 1 },
      { label: "Czasami", value: 2 },
      { label: "Często", value: 3 },
      { label: "Zawsze", value: 4 },
    ],
    genderOptions: ["Mężczyzna", "Kobieta", "Inna"],
    activityOptions: ["Niska", "Umiarkowana", "Wysoka"],
    questions: [
      "Czy odczuwasz ból głowy podczas burz magnetycznych?",
      "Czy w dniach z zaburzeniami geomagnetycznymi szybciej się męczysz?",
      "Czy masz problemy ze snem przed lub w trakcie burz magnetycznych?",
      "Czy zauważasz nagłe zmiany nastroju związane z aktywnością słoneczną?",
      "Czy odczuwasz wahania ciśnienia podczas burz?",
      "Czy podczas aktywności geomagnetycznej pojawiają się zawroty głowy?",
      "Czy podczas burz magnetycznych odczuwasz ból stawów lub mięśni?",
      "Czy w czasie burz pojawia się niepokój lub napięcie?",
      "Czy masz trudności z koncentracją przy zaburzeniach geomagnetycznych?",
      "Czy zauważasz zaburzenia rytmu serca podczas burz?",
      "Czy wyczuwasz zmianę pogody jeszcze przed jej nadejściem?",
      "Czy podczas burz magnetycznych nasilają się choroby przewlekłe?",
    ],
    labels: {
      high: "Wysoka meteowrażliwość",
      highDesc:
        "Twój organizm wyraźnie reaguje na aktywność geomagnetyczną. Warto uważnie śledzić prognozy burz magnetycznych i dostosowywać rytm dnia.",
      moderate: "Umiarkowana meteowrażliwość",
      moderateDesc:
        "Jesteś umiarkowanie wrażliwy na zmiany pogody kosmicznej. Warto zwracać uwagę na dni z podwyższoną aktywnością.",
      low: "Niska meteowrażliwość",
      lowDesc:
        "Burze magnetyczne raczej nie wpływają silnie na Twoje samopoczucie, choć sporadycznie możesz odczuwać niewielki dyskomfort.",
      resistant: "Odporność na pogodę kosmiczną",
      resistantDesc: "Świetnie! Aktywność geomagnetyczna praktycznie nie wpływa na Twój organizm.",
    },
  },
};

const localizedCopy: Record<LegacyLocale, (typeof copy)["uk"]> = {
  ...copy,
  ro: {
    title: "Test de meteosensibilitate — Magnitca Moldova",
    description:
      "Test gratuit de meteosensibilitate. Află cât de sensibil poate fi organismul tău la furtuni magnetice și activitate geomagnetică.",
    backHome: "La pagina principală",
    heading: "Test de meteosensibilitate",
    subtitle:
      "Află cât de sensibil este organismul tău la furtuni magnetice. Testul durează 2-3 minute.",
    introTitle: "Cum funcționează testul",
    introText:
      "Acest test ajută la o estimare orientativă a sensibilității la schimbări geomagnetice, variații de presiune și simptome asociate.",
    howItWorksTitle: "Ce se ia în calcul",
    howItWorksItems: [
      "reacțiile tale obișnuite la furtuni magnetice și schimbări de vreme",
      "vârsta, nivelul de activitate fizică și prezența afecțiunilor cronice",
      "frecvența simptomelor: dureri de cap, oboseală, insomnie, variații de tensiune, anxietate",
    ],
    resultsInfoTitle: "Ce înseamnă rezultatul",
    resultsInfoText:
      "După răspunsuri vei primi o estimare procentuală a meteosensibilității. Cu cât scorul este mai mare, cu atât este mai probabil ca perioadele de activitate geomagnetică sau schimbările bruște de vreme să influențeze starea ta.",
    disclaimerTitle: "Important",
    disclaimerText:
      "Acesta nu este un diagnostic medical și nu înlocuiește consultația unui medic. Testul oferă doar o estimare orientativă.",
    yourName: "Numele tău",
    enterName: "Introdu numele",
    age: "Vârsta",
    gender: "Gen",
    physicalActivity: "Nivelul de activitate fizică",
    hasChronic: "Am afecțiuni cronice (cardiovasculare, neurologice etc.)",
    startTest: "Începe testul",
    questionProgress: "Întrebarea",
    analyzing: "Analizăm răspunsurile tale...",
    processingPersonal: "Prelucrarea datelor personale...",
    comparingMeteo: "Comparare cu baza de date meteo...",
    calculatingIndex: "Calcularea indicelui de sensibilitate...",
    formingResult: "Pregătirea rezultatului...",
    yourResult: "Rezultatul tău",
    tryAgain: "Repetă testul",
    telegramTitle: "Nu rata furtunile magnetice!",
    telegramText:
      "Abonează-te la canalul nostru Telegram și primește prognoze zilnice despre furtuni magnetice direct în messenger.",
    telegramButton: "Abonează-te pe Telegram",
    answerOptions: [
      { label: "Niciodată", value: 0 },
      { label: "Rar", value: 1 },
      { label: "Uneori", value: 2 },
      { label: "Des", value: 3 },
      { label: "Întotdeauna", value: 4 },
    ],
    genderOptions: ["Masculin", "Feminin", "Altul"],
    activityOptions: ["Scăzută", "Moderată", "Ridicată"],
    questions: [
      "Ai dureri de cap în timpul furtunilor magnetice?",
      "Te simți mai obosit în zilele cu perturbări geomagnetice?",
      "Ai probleme cu somnul înainte sau în timpul furtunilor magnetice?",
      "Observi schimbări bruște de dispoziție legate de activitatea solară?",
      "Simți variații ale tensiunii arteriale în timpul furtunilor?",
      "Ai amețeli în perioadele de activitate geomagnetică?",
      "Simți dureri articulare sau musculare în timpul furtunilor magnetice?",
      "Apare anxietate sau neliniște în timpul furtunilor magnetice?",
      "Ai dificultăți de concentrare în perioadele cu perturbări geomagnetice?",
      "Observi tulburări ale ritmului cardiac în timpul furtunilor?",
      "Simți schimbările de vreme înainte ca ele să apară?",
      "Se agravează afecțiunile cronice în timpul furtunilor magnetice?",
    ],
    labels: {
      high: "Meteosensibilitate ridicată",
      highDesc:
        "Organismul tău pare să reacționeze clar la activitatea geomagnetică. Merită să urmărești prognozele și să îți adaptezi ritmul zilei în perioade active.",
      moderate: "Meteosensibilitate moderată",
      moderateDesc:
        "Ești moderat sensibil la schimbările vremii spațiale. Acordă atenție zilelor cu activitate geomagnetică crescută.",
      low: "Meteosensibilitate scăzută",
      lowDesc:
        "Furtunile magnetice probabil nu îți influențează puternic starea, deși ocazional poți simți un disconfort ușor.",
      resistant: "Rezistență bună",
      resistantDesc: "Foarte bine! Activitatea geomagnetică pare să aibă un impact minim asupra organismului tău.",
    },
  },
  hu: {
    title: "Meteoérzékenységi teszt — Magnitca Magyarország",
    description:
      "Ingyenes meteoérzékenységi teszt. Tudd meg, mennyire érzékenyen reagálhat a szervezeted a mágneses viharokra és a geomágneses aktivitásra.",
    backHome: "Vissza a főoldalra",
    heading: "Meteoérzékenységi teszt",
    subtitle:
      "Tudd meg, mennyire érzékeny a szervezeted a mágneses viharokra. A teszt 2-3 percet vesz igénybe.",
    introTitle: "Hogyan működik a teszt",
    introText:
      "A teszt tájékoztató becslést ad arról, mennyire reagálhatsz a geomágneses változásokra, légnyomás-ingadozásokra és kapcsolódó tünetekre.",
    howItWorksTitle: "Mit vesz figyelembe",
    howItWorksItems: [
      "szokásos reakcióid mágneses viharokra és időjárási változásokra",
      "életkor, fizikai aktivitás és krónikus állapotok jelenléte",
      "tünetek gyakorisága: fejfájás, fáradtság, álmatlanság, vérnyomás-ingadozás, szorongás",
    ],
    resultsInfoTitle: "Mit jelent az eredmény",
    resultsInfoText:
      "A válaszok után százalékos becslést kapsz a meteoérzékenységedről. Minél magasabb az érték, annál valószínűbb, hogy a geomágneses aktivitás vagy a hirtelen időjárási változások hatnak a közérzetedre.",
    disclaimerTitle: "Fontos",
    disclaimerText:
      "Ez nem orvosi diagnózis és nem helyettesíti az orvosi konzultációt. A teszt csak tájékoztató becslést ad.",
    yourName: "Neved",
    enterName: "Írd be a neved",
    age: "Életkor",
    gender: "Nem",
    physicalActivity: "Fizikai aktivitás szintje",
    hasChronic: "Van krónikus betegségem (szív- és érrendszeri, neurológiai stb.)",
    startTest: "Teszt indítása",
    questionProgress: "Kérdés",
    analyzing: "Elemezzük a válaszaidat...",
    processingPersonal: "Személyes adatok feldolgozása...",
    comparingMeteo: "Összevetés meteorológiai adatokkal...",
    calculatingIndex: "Érzékenységi index számítása...",
    formingResult: "Eredmény összeállítása...",
    yourResult: "Az eredményed",
    tryAgain: "Teszt újra",
    telegramTitle: "Ne maradj le a mágneses viharokról!",
    telegramText:
      "Iratkozz fel Telegram csatornánkra, és kapj napi előrejelzést a mágneses viharokról.",
    telegramButton: "Feliratkozás Telegramon",
    answerOptions: [
      { label: "Soha", value: 0 },
      { label: "Ritkán", value: 1 },
      { label: "Néha", value: 2 },
      { label: "Gyakran", value: 3 },
      { label: "Mindig", value: 4 },
    ],
    genderOptions: ["Férfi", "Nő", "Egyéb"],
    activityOptions: ["Alacsony", "Mérsékelt", "Magas"],
    questions: [
      "Szokott fejfájásod lenni mágneses viharok idején?",
      "Fáradtabbnak érzed magad geomágneses zavarok napján?",
      "Romlik az alvásod mágneses viharok előtt vagy közben?",
      "Észlelsz hirtelen hangulatváltozást naptevékenység idején?",
      "Tapasztalsz vérnyomás-ingadozást aktív időszakokban?",
      "Előfordul szédülés geomágneses aktivitás idején?",
      "Jelentkezik ízületi vagy izomfájdalom mágneses viharokkor?",
      "Érzel szorongást vagy nyugtalanságot ilyen napokon?",
      "Nehezebb koncentrálnod geomágneses zavarok idején?",
      "Tapasztalsz szívritmushoz kapcsolódó kellemetlenséget aktív napokon?",
      "Megérzed az időjárás változását még mielőtt bekövetkezne?",
      "Felerősödnek a krónikus panaszaid mágneses viharok idején?",
    ],
    labels: {
      high: "Magas meteoérzékenység",
      highDesc:
        "A szervezeted valószínűleg jól érzékelhetően reagál a geomágneses aktivitásra. Érdemes figyelni az előrejelzést és kímélőbb napirendet tartani aktív időszakokban.",
      moderate: "Mérsékelt meteoérzékenység",
      moderateDesc:
        "Közepesen érzékenyen reagálhatsz az űridőjárás változásaira. Figyelj a fokozott aktivitású napokra.",
      low: "Alacsony meteoérzékenység",
      lowDesc:
        "A mágneses viharok valószínűleg nem hatnak erősen a közérzetedre, bár időnként enyhe kellemetlenség előfordulhat.",
      resistant: "Jó ellenállóképesség",
      resistantDesc: "Nagyszerű! A geomágneses aktivitás várhatóan csak minimálisan hat a szervezetedre.",
    },
  },
  bg: {
    title: "Тест за метеочувствителност — Magnitca България",
    description:
      "Безплатен тест за метеочувствителност. Разберете колко чувствително може да реагира организмът ви на магнитни бури и геомагнитна активност.",
    backHome: "Обратно към началната страница",
    heading: "Тест за метеочувствителност",
    subtitle:
      "Разберете колко чувствителен е организмът ви към магнитни бури. Тестът отнема 2-3 минути.",
    introTitle: "Как работи тестът",
    introText:
      "Тестът дава ориентировъчна оценка за това колко силно можете да реагирате на геомагнитни промени, колебания на атмосферното налягане и свързани симптоми.",
    howItWorksTitle: "Какво се взема предвид",
    howItWorksItems: [
      "обичайните ви реакции към магнитни бури и промени във времето",
      "възраст, физическа активност и наличие на хронични състояния",
      "честота на симптомите: главоболие, умора, безсъние, колебания на кръвното налягане, тревожност",
    ],
    resultsInfoTitle: "Какво означава резултатът",
    resultsInfoText:
      "След отговорите ще получите процентна оценка на метеочувствителността си. Колкото по-висока е стойността, толкова по-вероятно е геомагнитната активност или резките промени във времето да влияят на самочувствието ви.",
    disclaimerTitle: "Важно",
    disclaimerText:
      "Това не е медицинска диагноза и не замества консултацията с лекар. Тестът дава само ориентировъчна оценка.",
    yourName: "Вашето име",
    enterName: "Въведете името си",
    age: "Възраст",
    gender: "Пол",
    physicalActivity: "Ниво на физическа активност",
    hasChronic: "Имам хронични заболявания (сърдечно-съдови, неврологични и др.)",
    startTest: "Започни теста",
    questionProgress: "Въпрос",
    analyzing: "Анализираме вашите отговори...",
    processingPersonal: "Обработка на личните данни...",
    comparingMeteo: "Сравняване с метеорологични данни...",
    calculatingIndex: "Изчисляване на индекса на чувствителност...",
    formingResult: "Подготовка на резултата...",
    yourResult: "Вашият резултат",
    tryAgain: "Повтори теста",
    telegramTitle: "Не пропускайте магнитните бури!",
    telegramText:
      "Абонирайте се за нашия Telegram канал и получавайте ежедневни прогнози за магнитни бури директно в месинджъра.",
    telegramButton: "Абонирай се в Telegram",
    answerOptions: [
      { label: "Никога", value: 0 },
      { label: "Рядко", value: 1 },
      { label: "Понякога", value: 2 },
      { label: "Често", value: 3 },
      { label: "Винаги", value: 4 },
    ],
    genderOptions: ["Мъж", "Жена", "Друго"],
    activityOptions: ["Ниска", "Умерена", "Висока"],
    questions: [
      "Имате ли главоболие по време на магнитни бури?",
      "Чувствате ли се по-уморени в дни с геомагнитни смущения?",
      "Влошава ли се сънят ви преди или по време на магнитни бури?",
      "Забелязвате ли резки промени в настроението, свързани със слънчевата активност?",
      "Усещате ли колебания на кръвното налягане по време на бури?",
      "Появява ли се световъртеж в периоди на геомагнитна активност?",
      "Усещате ли болки в ставите или мускулите по време на магнитни бури?",
      "Появява ли се тревожност или безпокойство в такива дни?",
      "Трудно ли ви е да се концентрирате при геомагнитни смущения?",
      "Забелязвате ли нарушения на сърдечния ритъм по време на бури?",
      "Усещате ли промяната на времето още преди тя да настъпи?",
      "Обострят ли се хроничните оплаквания по време на магнитни бури?",
    ],
    labels: {
      high: "Висока метеочувствителност",
      highDesc:
        "Организмът ви вероятно реагира ясно на геомагнитната активност. Струва си да следите прогнозите и да поддържате по-щадящ режим в активните периоди.",
      moderate: "Умерена метеочувствителност",
      moderateDesc:
        "Реагирате умерено чувствително на промените в космическото време. Обръщайте внимание на дните с повишена активност.",
      low: "Ниска метеочувствителност",
      lowDesc:
        "Магнитните бури вероятно не влияят силно на самочувствието ви, макар че понякога може да усещате лек дискомфорт.",
      resistant: "Добра устойчивост",
      resistantDesc: "Чудесно! Геомагнитната активност вероятно оказва минимално влияние върху организма ви.",
    },
  },
  cs: {
    title: "Test meteocitlivosti — Magnitca Česko",
    description:
      "Bezplatný test meteocitlivosti. Zjistěte, jak silně může vaše tělo reagovat na magnetické bouře a geomagnetickou aktivitu.",
    backHome: "Zpět na hlavní stránku",
    heading: "Test meteocitlivosti",
    subtitle:
      "Zjistěte, jak citlivé může být vaše tělo na magnetické bouře. Test zabere 2-3 minuty.",
    introTitle: "Jak test funguje",
    introText:
      "Tento test poskytuje orientační odhad vaší citlivosti na geomagnetickou aktivitu, změny tlaku a související příznaky.",
    howItWorksTitle: "Co se bere v úvahu",
    howItWorksItems: [
      "vaše obvyklé reakce na magnetické bouře a změny počasí",
      "věk, fyzická aktivita a chronická onemocnění",
      "četnost příznaků: bolest hlavy, únava, nespavost, kolísání tlaku a úzkost",
    ],
    resultsInfoTitle: "Co výsledek znamená",
    resultsInfoText:
      "Po zodpovězení otázek získáte procentuální odhad své meteocitlivosti. Vyšší hodnota znamená, že období aktivní geomagnetické činnosti pro vás mohou být výraznější.",
    disclaimerTitle: "Důležité",
    disclaimerText:
      "Toto není lékařská diagnóza a nenahrazuje konzultaci s lékařem. Jde pouze o orientační odhad pro lepší sledování vlastního stavu.",
    yourName: "Vaše jméno",
    enterName: "Zadejte své jméno",
    age: "Věk",
    gender: "Pohlaví",
    physicalActivity: "Úroveň fyzické aktivity",
    hasChronic: "Mám chronická onemocnění",
    startTest: "Spustit test",
    questionProgress: "Otázka",
    analyzing: "Analyzujeme vaše odpovědi...",
    processingPersonal: "Zpracování osobních údajů...",
    comparingMeteo: "Porovnání s meteorologickými daty...",
    calculatingIndex: "Výpočet indexu citlivosti...",
    formingResult: "Příprava výsledku...",
    yourResult: "Váš výsledek",
    tryAgain: "Opakovat test",
    telegramTitle: "Nenechte si ujít magnetické bouře!",
    telegramText:
      "Přihlaste se k odběru našeho kanálu na Telegramu a dostávejte denní předpovědi magnetických bouří.",
    telegramButton: "Odebírat na Telegramu",
    answerOptions: [
      { label: "Nikdy", value: 0 },
      { label: "Zřídka", value: 1 },
      { label: "Občas", value: 2 },
      { label: "Často", value: 3 },
      { label: "Vždy", value: 4 },
    ],
    genderOptions: ["Muž", "Žena", "Jiné"],
    activityOptions: ["Nízká", "Střední", "Vysoká"],
    questions: [
      "Míváte bolesti hlavy během magnetických bouří?",
      "Cítíte se unavenější ve dnech s geomagnetickou aktivitou?",
      "Míváte problémy se spánkem před magnetickými bouřemi nebo během nich?",
      "Všímáte si změn nálady souvisejících se sluneční aktivitou?",
      "Pociťujete během bouří kolísání krevního tlaku?",
      "Zažíváte během geomagnetické aktivity závratě?",
      "Cítíte během magnetických bouří bolesti kloubů nebo svalů?",
      "Pociťujete během magnetických bouří úzkost nebo neklid?",
      "Máte během geomagnetických poruch potíže se soustředěním?",
      "Všímáte si během aktivních dnů nepříjemných pocitů v srdečním rytmu?",
      "Vnímáte změny počasí dříve, než nastanou?",
      "Zhoršují se během magnetických bouří chronická onemocnění?",
    ],
    labels: {
      high: "Vysoká meteocitlivost",
      highDesc:
        "Vaše tělo může na geomagnetickou aktivitu reagovat výrazně. Sledujte předpovědi a v aktivních obdobích zvažte klidnější režim.",
      moderate: "Střední meteocitlivost",
      moderateDesc:
        "Na změny kosmického počasí můžete reagovat středně citlivě. Věnujte pozornost aktivním dnům.",
      low: "Nízká meteocitlivost",
      lowDesc:
        "Magnetické bouře pravděpodobně silně neovlivňují vaši pohodu, i když někdy může nastat mírný diskomfort.",
      resistant: "Dobrá odolnost",
      resistantDesc: "Skvělé! Geomagnetická aktivita na vás bude mít pravděpodobně minimální vliv.",
    },
  },
  en: {
    title: "Weather sensitivity test — Magnitca",
    description:
      "A free weather sensitivity test. Learn how strongly your body may respond to magnetic storms and geomagnetic activity.",
    backHome: "Back to home",
    heading: "Weather sensitivity test",
    subtitle:
      "Find out how sensitive your body may be to magnetic storms. The test takes 2-3 minutes.",
    introTitle: "How the test works",
    introText:
      "This test gives an approximate estimate of your sensitivity to geomagnetic activity, pressure changes and related symptoms.",
    howItWorksTitle: "What is considered",
    howItWorksItems: [
      "your typical reactions to magnetic storms and weather changes",
      "age, physical activity and chronic conditions",
      "symptom frequency: headache, fatigue, insomnia, pressure changes and anxiety",
    ],
    resultsInfoTitle: "What the result means",
    resultsInfoText:
      "After answering, you will receive a percentage estimate of weather sensitivity. A higher value means active geomagnetic periods may be more noticeable for you.",
    disclaimerTitle: "Important",
    disclaimerText:
      "This is not a medical diagnosis and does not replace a doctor. It is an informational estimate for better self-observation.",
    yourName: "Your name",
    enterName: "Enter your name",
    age: "Age",
    gender: "Gender",
    physicalActivity: "Physical activity level",
    hasChronic: "I have chronic conditions",
    startTest: "Start test",
    questionProgress: "Question",
    analyzing: "Analyzing your answers...",
    processingPersonal: "Processing personal data...",
    comparingMeteo: "Comparing with weather data...",
    calculatingIndex: "Calculating sensitivity index...",
    formingResult: "Preparing result...",
    yourResult: "Your result",
    tryAgain: "Try again",
    telegramTitle: "Do not miss magnetic storms!",
    telegramText:
      "Subscribe to our Telegram channel and get daily magnetic storm forecasts.",
    telegramButton: "Subscribe in Telegram",
    answerOptions: [
      { label: "Never", value: 0 },
      { label: "Rarely", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always", value: 4 },
    ],
    genderOptions: ["Male", "Female", "Other"],
    activityOptions: ["Low", "Moderate", "High"],
    questions: [
      "Do you get headaches during magnetic storms?",
      "Do you feel more tired on geomagnetically active days?",
      "Do you have sleep problems before or during magnetic storms?",
      "Do you notice mood changes related to solar activity?",
      "Do you feel blood pressure fluctuations during storms?",
      "Do you experience dizziness during geomagnetic activity?",
      "Do you feel joint or muscle pain during magnetic storms?",
      "Do you feel anxiety or restlessness during magnetic storms?",
      "Do you have trouble concentrating during geomagnetic disturbances?",
      "Do you notice heart rhythm discomfort during active days?",
      "Do you sense weather changes before they arrive?",
      "Do chronic conditions worsen during magnetic storms?",
    ],
    labels: {
      high: "High weather sensitivity",
      highDesc:
        "You may respond noticeably to geomagnetic activity. Follow forecasts and consider a calmer routine during active periods.",
      moderate: "Moderate weather sensitivity",
      moderateDesc:
        "You may be moderately sensitive to space weather changes. Pay attention to active days.",
      low: "Low weather sensitivity",
      lowDesc:
        "Magnetic storms probably do not strongly affect your wellbeing, though mild discomfort may still happen sometimes.",
      resistant: "Good resilience",
      resistantDesc: "Great! Geomagnetic activity is likely to have minimal effect on you.",
    },
  },
};

const statsCopy: Record<
  LegacyLocale,
  {
    eyebrow: string;
    title: string;
    loading: string;
    emptyTitle: string;
    emptyText: string;
    average: string;
    averageSub: (total: number) => string;
    highShare: string;
    highShareSub: string;
    higherIn: string;
    agePeak: string;
    noData: string;
    recent: (count: number) => string;
    gender: Record<"male" | "female" | "other", string>;
    ageGroup: Record<string, string>;
  }
> = {
  uk: {
    eyebrow: "Статистика проходження",
    title: "Як люди оцінюють свою метеозалежність",
    loading: "Збираємо статистику...",
    emptyTitle: "Перші результати ще збираються",
    emptyText: "Коли більше людей пройдуть тест, тут з'явиться середній рівень метеозалежності та порівняння за віком і статтю.",
    average: "Середній рівень",
    averageSub: (total) => `${total} результатів у базі`,
    highShare: "50%+",
    highShareSub: "мають помірну або високу чутливість",
    higherIn: "Вища у",
    agePeak: "Найчутливіший вік",
    noData: "Недостатньо даних",
    recent: (count) => `${count} нових за 30 днів`,
    gender: { male: "чоловіків", female: "жінок", other: "інших відповідей" },
    ageGroup: {
      under18: "до 18 років",
      "18-29": "18-29 років",
      "30-39": "30-39 років",
      "40-49": "40-49 років",
      "50-59": "50-59 років",
      "60+": "60+ років",
    },
  },
  ru: {
    eyebrow: "Статистика прохождения",
    title: "Как люди оценивают свою метеозависимость",
    loading: "Собираем статистику...",
    emptyTitle: "Первые результаты ещё собираются",
    emptyText: "Когда больше людей пройдут тест, здесь появится средний уровень метеозависимости и сравнение по возрасту и полу.",
    average: "Средний уровень",
    averageSub: (total) => `${total} результатов в базе`,
    highShare: "50%+",
    highShareSub: "имеют умеренную или высокую чувствительность",
    higherIn: "Выше у",
    agePeak: "Самый чувствительный возраст",
    noData: "Недостаточно данных",
    recent: (count) => `${count} новых за 30 дней`,
    gender: { male: "мужчин", female: "женщин", other: "других ответов" },
    ageGroup: {
      under18: "до 18 лет",
      "18-29": "18-29 лет",
      "30-39": "30-39 лет",
      "40-49": "40-49 лет",
      "50-59": "50-59 лет",
      "60+": "60+ лет",
    },
  },
  pl: {
    eyebrow: "Statystyka testu",
    title: "Jak użytkownicy oceniają swoją meteowrażliwość",
    loading: "Zbieramy statystyki...",
    emptyTitle: "Pierwsze wyniki są jeszcze zbierane",
    emptyText: "Gdy więcej osób wykona test, pokażemy średni poziom meteowrażliwości oraz porównanie według wieku i płci.",
    average: "Średni poziom",
    averageSub: (total) => `${total} wyników w bazie`,
    highShare: "50%+",
    highShareSub: "ma umiarkowaną lub wysoką wrażliwość",
    higherIn: "Wyższa u",
    agePeak: "Najbardziej wrażliwy wiek",
    noData: "Za mało danych",
    recent: (count) => `${count} nowych w 30 dni`,
    gender: { male: "mężczyzn", female: "kobiet", other: "innych odpowiedzi" },
    ageGroup: {
      under18: "poniżej 18 lat",
      "18-29": "18-29 lat",
      "30-39": "30-39 lat",
      "40-49": "40-49 lat",
      "50-59": "50-59 lat",
      "60+": "60+ lat",
    },
  },
  ro: {
    eyebrow: "Statistica testului",
    title: "Cum își evaluează oamenii meteosensibilitatea",
    loading: "Colectăm statistici...",
    emptyTitle: "Primele rezultate sunt încă în colectare",
    emptyText: "Când mai multe persoane vor completa testul, aici vor apărea media și comparațiile după vârstă și gen.",
    average: "Nivel mediu",
    averageSub: (total) => `${total} rezultate în bază`,
    highShare: "50%+",
    highShareSub: "au sensibilitate moderată sau ridicată",
    higherIn: "Mai mare la",
    agePeak: "Vârsta cea mai sensibilă",
    noData: "Date insuficiente",
    recent: (count) => `${count} noi în 30 de zile`,
    gender: { male: "bărbați", female: "femei", other: "alte răspunsuri" },
    ageGroup: {
      under18: "sub 18 ani",
      "18-29": "18-29 ani",
      "30-39": "30-39 ani",
      "40-49": "40-49 ani",
      "50-59": "50-59 ani",
      "60+": "60+ ani",
    },
  },
  hu: {
    eyebrow: "Tesztstatisztika",
    title: "Hogyan értékelik az emberek a meteoérzékenységüket",
    loading: "Statisztikák gyűjtése...",
    emptyTitle: "Az első eredmények még gyűlnek",
    emptyText: "Ha több kitöltés érkezik, itt megjelenik az átlagos érzékenység, valamint az életkor és nem szerinti összevetés.",
    average: "Átlagos szint",
    averageSub: (total) => `${total} eredmény az adatbázisban`,
    highShare: "50%+",
    highShareSub: "mérsékelt vagy magas érzékenységű",
    higherIn: "Magasabb",
    agePeak: "Legérzékenyebb kor",
    noData: "Nincs elég adat",
    recent: (count) => `${count} új az elmúlt 30 napban`,
    gender: { male: "férfiaknál", female: "nőknél", other: "egyéb válaszoknál" },
    ageGroup: {
      under18: "18 év alatt",
      "18-29": "18-29 év",
      "30-39": "30-39 év",
      "40-49": "40-49 év",
      "50-59": "50-59 év",
      "60+": "60+ év",
    },
  },
  bg: {
    eyebrow: "Статистика на теста",
    title: "Как хората оценяват своята метеочувствителност",
    loading: "Събираме статистика...",
    emptyTitle: "Първите резултати още се събират",
    emptyText: "Когато повече хора преминат теста, тук ще се появи средното ниво на метеочувствителност, както и сравнението по възраст и пол.",
    average: "Средно ниво",
    averageSub: (total) => `${total} резултата в базата`,
    highShare: "50%+",
    highShareSub: "имат умерена или висока чувствителност",
    higherIn: "По-висока при",
    agePeak: "Най-чувствителна възраст",
    noData: "Недостатъчно данни",
    recent: (count) => `${count} нови за последните 30 дни`,
    gender: { male: "мъже", female: "жени", other: "други отговори" },
    ageGroup: {
      under18: "под 18 години",
      "18-29": "18-29 години",
      "30-39": "30-39 години",
      "40-49": "40-49 години",
      "50-59": "50-59 години",
      "60+": "60+ години",
    },
  },
  cs: {
    eyebrow: "Statistika testu",
    title: "Jak lidé hodnotí svou meteocitlivost",
    loading: "Sbíráme statistiky...",
    emptyTitle: "První výsledky se stále sbírají",
    emptyText: "Až test dokončí více lidí, zobrazí se zde průměrná úroveň meteocitlivosti a srovnání podle věku a pohlaví.",
    average: "Průměrná úroveň",
    averageSub: (total) => `${total} výsledků v databázi`,
    highShare: "50%+",
    highShareSub: "má střední nebo vysokou citlivost",
    higherIn: "Vyšší u",
    agePeak: "Nejcitlivější věk",
    noData: "Nedostatek dat",
    recent: (count) => `${count} nových za 30 dní`,
    gender: { male: "mužů", female: "žen", other: "jiných odpovědí" },
    ageGroup: {
      under18: "do 18 let",
      "18-29": "18-29 let",
      "30-39": "30-39 let",
      "40-49": "40-49 let",
      "50-59": "50-59 let",
      "60+": "60+ let",
    },
  },
  en: {
    eyebrow: "Test statistics",
    title: "How people rate their weather sensitivity",
    loading: "Collecting statistics...",
    emptyTitle: "The first results are still being collected",
    emptyText: "When more people complete the test, this block will show the average sensitivity level and comparisons by age and gender.",
    average: "Average level",
    averageSub: (total) => `${total} results in the database`,
    highShare: "50%+",
    highShareSub: "have moderate or high sensitivity",
    higherIn: "Higher in",
    agePeak: "Most sensitive age",
    noData: "Not enough data",
    recent: (count) => `${count} new in 30 days`,
    gender: { male: "men", female: "women", other: "other answers" },
    ageGroup: {
      under18: "under 18",
      "18-29": "18-29",
      "30-39": "30-39",
      "40-49": "40-49",
      "50-59": "50-59",
      "60+": "60+",
    },
  },
};

function clampPercent(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getGenderComparison(stats: TestStatsResponse) {
  const male = stats.genderAverages?.male;
  const female = stats.genderAverages?.female;

  if (male?.count && female?.count && male.averageScore !== null && female.averageScore !== null) {
    return male.averageScore > female.averageScore
      ? { key: "male" as const, averageScore: male.averageScore, count: male.count }
      : { key: "female" as const, averageScore: female.averageScore, count: female.count };
  }

  return stats.strongestGender;
}

function TestStatsPanel({
  locale,
  stats,
  loading,
}: {
  locale: LegacyLocale;
  stats: TestStatsResponse | null;
  loading: boolean;
}) {
  const t = statsCopy[locale];
  const averageScore = clampPercent(stats?.averageScore);
  const highShare = clampPercent(stats?.highSensitivityShare);
  const genderComparison = stats ? getGenderComparison(stats) : null;
  const agePeak = stats?.strongestAgeGroup ?? null;

  if (loading) {
    return (
      <section className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <BarChart3 className="h-4 w-4 text-primary" />
          {t.eyebrow}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{t.loading}</p>
      </section>
    );
  }

  if (!stats || stats.total < 3 || averageScore === null) {
    return (
      <section className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Users className="h-4 w-4 text-primary" />
          {t.eyebrow}
        </div>
        <h2 className="mt-3 font-display text-xl font-bold text-foreground">{t.emptyTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.emptyText}</p>
      </section>
    );
  }

  const cards = [
    {
      icon: Activity,
      label: t.average,
      value: `${averageScore}%`,
      sub: t.averageSub(stats.total),
      tone: "text-primary",
    },
    {
      icon: TrendingUp,
      label: t.highShare,
      value: highShare === null ? "—" : `${highShare}%`,
      sub: t.highShareSub,
      tone: "text-orange-500",
    },
    {
      icon: Users,
      label: t.higherIn,
      value: genderComparison ? t.gender[genderComparison.key] : t.noData,
      sub: genderComparison?.averageScore === null || !genderComparison ? t.noData : `${genderComparison.averageScore}%`,
      tone: "text-foreground",
    },
    {
      icon: BarChart3,
      label: t.agePeak,
      value: agePeak ? t.ageGroup[agePeak.key] ?? agePeak.key : t.noData,
      sub: agePeak?.averageScore === null || !agePeak ? t.noData : `${agePeak.averageScore}%`,
      tone: "text-foreground",
    },
  ];

  return (
    <section className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <BarChart3 className="h-4 w-4 text-primary" />
            {t.eyebrow}
          </div>
          <h2 className="mt-2 font-display text-xl font-bold text-foreground">{t.title}</h2>
        </div>
        <span className="inline-flex w-fit rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">
          {t.recent(stats.recentCount)}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-border/50 bg-background/55 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" />
                {card.label}
              </div>
              <p className={cn("mt-3 font-display text-2xl font-bold", card.tone)}>{card.value}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{card.sub}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function calculateScore(answers: number[], info: PersonalInfo, locale: LegacyLocale): number {
  const maxRaw = answers.length * 4;
  let raw = answers.reduce((a, b) => a + b, 0);
  const age = parseInt(info.age, 10) || 30;

  if (age > 50) raw += 3;
  else if (age > 40) raw += 2;
  else if (age > 30) raw += 1;

  if (info.hasChronic) raw += 4;

  const lowActivity = localizedCopy[locale].activityOptions[0];
  const moderateActivity = localizedCopy[locale].activityOptions[1];

  if (info.physicalActivity === lowActivity) raw += 2;
  else if (info.physicalActivity === moderateActivity) raw += 1;

  const adjusted = Math.min(raw, maxRaw + 10);
  return Math.round((adjusted / (maxRaw + 10)) * 100);
}

function getResultLabel(score: number, locale: LegacyLocale) {
  const t = localizedCopy[locale].labels;
  if (score >= 75) return { label: t.high, color: "text-red-400", description: t.highDesc };
  if (score >= 50) return { label: t.moderate, color: "text-orange-400", description: t.moderateDesc };
  if (score >= 25) return { label: t.low, color: "text-yellow-400", description: t.lowDesc };
  return { label: t.resistant, color: "text-green-400", description: t.resistantDesc };
}

const MeteoTest = ({ locale = "uk" }: { locale?: LegacyLocale }) => {
  const t = localizedCopy[locale];

  usePageMeta(
    t.title,
    t.description,
    locale === "ru" ? "/ru/test" : locale === "pl" ? "/pl/test" : locale === "ro" ? "/ro/test" : locale === "hu" ? "/hu/test" : locale === "en" ? "/en/test" : "/test"
  );

  const [step, setStep] = useState<Step>("info");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);
  const [stats, setStats] = useState<TestStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const savedResultRef = useRef(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    age: "",
    gender: "",
    hasChronic: false,
    physicalActivity: "",
  });

  useEffect(() => {
    let mounted = true;
    setStatsLoading(true);

    fetch("/api/test-results/stats")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (mounted) setStats(payload);
      })
      .catch(() => {
        if (mounted) setStats(null);
      })
      .finally(() => {
        if (mounted) setStatsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (step !== "calculating") return;
    const computed = calculateScore(answers, personalInfo, locale);
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 8 + 2;
      if (progress >= 100) {
        progress = 100;
        setCalcProgress(100);
        setScore(computed);
        clearInterval(interval);
        setTimeout(() => setStep("result"), 600);
      } else {
        setCalcProgress(Math.round(progress));
      }
    }, 120);

    return () => clearInterval(interval);
  }, [step, answers, personalInfo, locale]);

  useEffect(() => {
    if (step !== "result" || savedResultRef.current) return;
    savedResultRef.current = true;
    const resultLabel = getResultLabel(score, locale).label;

    void fetch("/api/test-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        score,
        resultLabel,
        answers,
        name: personalInfo.name,
        age: personalInfo.age,
        gender: personalInfo.gender,
        hasChronic: personalInfo.hasChronic,
        physicalActivity: personalInfo.physicalActivity,
      }),
    }).catch(() => {
      savedResultRef.current = false;
    });
  }, [step, score, locale, answers, personalInfo]);

  const handleAnswer = (value: number) => {
    const nextAnswers = [...answers, value];
    setAnswers(nextAnswers);
    if (currentQ < t.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("calculating");
    }
  };

  const resetTest = () => {
    savedResultRef.current = false;
    setStep("info");
    setCurrentQ(0);
    setAnswers([]);
    setScore(0);
    setCalcProgress(0);
    setPersonalInfo({
      name: "",
      age: "",
      gender: "",
      hasChronic: false,
      physicalActivity: "",
    });
  };

  const isInfoValid =
    personalInfo.name.trim() &&
    personalInfo.age.trim() &&
    parseInt(personalInfo.age, 10) > 0 &&
    parseInt(personalInfo.age, 10) < 120 &&
    personalInfo.gender &&
    personalInfo.physicalActivity;

  const result = getResultLabel(score, locale);
  const homeHref = locale === "ru" ? "/ru" : locale === "pl" ? "/pl" : locale === "ro" ? "/ro" : locale === "hu" ? "/hu" : locale === "en" ? "/en" : "/";
  const showTelegramCta = locale === "uk" || locale === "ru";

  return (
    <div className="min-h-screen bg-background">
      <main className="official-page-main">
        <div className="official-page-shell space-y-6">
        <Link
          href={homeHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backHome}
        </Link>

        <TestStatsPanel locale={locale} stats={stats} loading={statsLoading} />

        {step === "info" && (
          <div className="animate-fade-in rounded-lg border border-border/50 bg-card p-8 space-y-6">
            <div className="text-center space-y-2">
              <Activity className="h-8 w-8 text-primary mx-auto" />
              <h1 className="font-display text-2xl font-bold text-foreground">{t.heading}</h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">{t.subtitle}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t.yourName}</label>
                <input
                  type="text"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                  className="w-full rounded-md border border-border/50 bg-secondary/20 py-2.5 px-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={t.enterName}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t.age}</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={personalInfo.age}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                  className="w-full rounded-md border border-border/50 bg-secondary/20 py-2.5 px-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={t.age}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t.gender}</label>
                <div className="grid grid-cols-3 gap-2">
                  {t.genderOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPersonalInfo({ ...personalInfo, gender: option })}
                      className={cn(
                        "rounded-md border px-2 py-2.5 font-mono text-xs transition-colors text-center",
                        personalInfo.gender === option
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border/50 bg-secondary/20 text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t.physicalActivity}</label>
                <div className="flex gap-2">
                  {t.activityOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPersonalInfo({ ...personalInfo, physicalActivity: option })}
                      className={cn(
                        "flex-1 rounded-md border px-3 py-2.5 font-mono text-xs transition-colors",
                        personalInfo.physicalActivity === option
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border/50 bg-secondary/20 text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={personalInfo.hasChronic}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, hasChronic: e.target.checked })}
                    className="rounded border-border/50"
                  />
                  {t.hasChronic}
                </label>
              </div>
            </div>

            <button
              onClick={() => setStep("questions")}
              disabled={!isInfoValid}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-mono text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t.startTest}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === "info" && (
          <div className="animate-fade-in space-y-4">
            <section className="rounded-xl border border-border/50 bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground">{t.introTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.introText}</p>

              <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {t.howItWorksTitle}
              </h3>
              <ul className="mt-3 space-y-2">
                {t.howItWorksItems.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-foreground/90">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-border/50 bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground">{t.resultsInfoTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.resultsInfoText}</p>

              <div className="mt-4 rounded-lg border border-primary/15 bg-primary/[0.05] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t.disclaimerTitle}
                </h3>
                <p className="mt-2 text-sm leading-6 text-foreground/85">{t.disclaimerText}</p>
              </div>
            </section>
          </div>
        )}

        {step === "questions" && (
          <div className="animate-fade-in rounded-lg border border-border/50 bg-card p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>
                  {t.questionProgress} {currentQ + 1} / {t.questions.length}
                </span>
                <span>{Math.round((currentQ / t.questions.length) * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${(currentQ / t.questions.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-lg font-medium text-foreground leading-relaxed">{t.questions[currentQ]}</h2>

            <div className="grid gap-2">
              {t.answerOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full rounded-md border border-border/50 bg-secondary/20 px-4 py-3 text-left font-mono text-sm text-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:scale-[0.98]"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "calculating" && (
          <div className="animate-fade-in rounded-lg border border-border/50 bg-card p-12 flex flex-col items-center justify-center gap-6 text-center">
            <div className="relative">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" strokeOpacity="0.3" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - calcProgress / 100)}`}
                  className="transition-all duration-150"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-xl font-bold text-primary">
                {calcProgress}%
              </span>
            </div>
            <div className="space-y-1.5">
              <p className="font-display text-lg font-bold text-foreground">{t.analyzing}</p>
              <p className="text-xs text-muted-foreground">
                {calcProgress < 30
                  ? t.processingPersonal
                  : calcProgress < 60
                    ? t.comparingMeteo
                    : calcProgress < 90
                      ? t.calculatingIndex
                      : t.formingResult}
              </p>
            </div>
          </div>
        )}

        {step === "result" && (
          <div className="animate-fade-in space-y-6">
            <div className="rounded-lg border border-border/50 bg-card p-8">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">{t.yourResult}</h2>

              <div className="flex flex-col items-center gap-4 py-6 text-center animate-scale-in">
                <div className="relative">
                  <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" strokeOpacity="0.3" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - score / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-3xl font-bold text-primary">
                    {score}%
                  </span>
                </div>
                <p className={cn("font-display text-xl font-bold", result.color)}>{result.label}</p>
                <p className="text-sm text-muted-foreground max-w-md">{result.description}</p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={resetTest}
                    className="rounded-md border border-border/50 bg-secondary/30 px-5 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/60"
                  >
                    {t.tryAgain}
                  </button>
                </div>
              </div>
            </div>

            {showTelegramCta && (
              <div className="rounded-lg border border-border/50 bg-card p-6 text-center space-y-3">
                <Send className="h-6 w-6 text-primary mx-auto" />
                <p className="text-sm font-medium text-foreground">{t.telegramTitle}</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">{t.telegramText}</p>
                <a
                  href="https://t.me/+7UKzAK5ur8UxZmMy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[hsl(200,80%,45%)] px-6 py-2.5 font-mono text-sm font-medium text-white transition-colors hover:bg-[hsl(200,80%,40%)]"
                >
                  <Send className="h-4 w-4" />
                  {t.telegramButton}
                </a>
              </div>
            )}
          </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default MeteoTest;
