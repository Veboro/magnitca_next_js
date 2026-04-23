"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Activity, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageMeta } from "@/hooks/usePageMeta";
import type { SiteLocale } from "@/lib/locale";

type LegacyLocale = SiteLocale;

interface PersonalInfo {
  name: string;
  age: string;
  gender: string;
  hasChronic: boolean;
  physicalActivity: string;
}

type Step = "info" | "questions" | "calculating" | "result";

const copy: Record<
  LegacyLocale,
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

function calculateScore(answers: number[], info: PersonalInfo, locale: SiteLocale): number {
  const maxRaw = answers.length * 4;
  let raw = answers.reduce((a, b) => a + b, 0);
  const age = parseInt(info.age, 10) || 30;

  if (age > 50) raw += 3;
  else if (age > 40) raw += 2;
  else if (age > 30) raw += 1;

  if (info.hasChronic) raw += 4;

  const lowActivity = locale === "ru" ? "Низкая" : locale === "pl" ? "Niska" : "Низька";
  const moderateActivity = locale === "ru" ? "Умеренная" : locale === "pl" ? "Umiarkowana" : "Помірна";

  if (info.physicalActivity === lowActivity) raw += 2;
  else if (info.physicalActivity === moderateActivity) raw += 1;

  const adjusted = Math.min(raw, maxRaw + 10);
  return Math.round((adjusted / (maxRaw + 10)) * 100);
}

function getResultLabel(score: number, locale: SiteLocale) {
  const t = copy[locale].labels;
  if (score >= 75) return { label: t.high, color: "text-red-400", description: t.highDesc };
  if (score >= 50) return { label: t.moderate, color: "text-orange-400", description: t.moderateDesc };
  if (score >= 25) return { label: t.low, color: "text-yellow-400", description: t.lowDesc };
  return { label: t.resistant, color: "text-green-400", description: t.resistantDesc };
}

const MeteoTest = ({ locale = "uk" }: { locale?: LegacyLocale }) => {
  const t = copy[locale];

  usePageMeta(t.title, t.description, locale === "ru" ? "/ru/test" : locale === "pl" ? "/pl/test" : "/test");

  const [step, setStep] = useState<Step>("info");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    age: "",
    gender: "",
    hasChronic: false,
    physicalActivity: "",
  });

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
  const homeHref = locale === "ru" ? "/ru" : "/";

  return (
    <div className="min-h-screen bg-background grid-bg">
      <main className="mx-auto max-w-2xl p-6 space-y-6">
        <Link
          href={homeHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backHome}
        </Link>

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
          </div>
        )}
      </main>
    </div>
  );
};

export default MeteoTest;
