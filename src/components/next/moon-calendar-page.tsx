import Link from "next/link";
import { HelpCircle, MoonStar, Sparkles, Star, TimerReset } from "lucide-react";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import type { KeyMoonPhase, MoonCalendarDay, MoonMonthRoute } from "@/lib/moon-calendar";
import { absoluteUrl } from "@/lib/site";

type MoonCalendarPageProps = {
  locale?: "uk" | "ru" | "pl" | "ro";
  heading?: string;
  introText?: string;
  contextLabel?: string;
  heroPillLabel?: string;
  heroTitle?: string;
  monthLabel: string;
  todayLabel: string;
  currentPhase: MoonCalendarDay;
  keyPhases: KeyMoonPhase[];
  days: MoonCalendarDay[];
  averageIllumination: number;
  monthLinks?: MoonMonthRoute[];
};

const phaseTone: Record<string, string> = {
  new: "from-slate-900/90 via-slate-800/80 to-slate-700/70",
  waxing_crescent: "from-cyan-950/80 via-slate-800/80 to-slate-700/70",
  first_quarter: "from-sky-900/70 via-slate-800/80 to-slate-700/70",
  waxing_gibbous: "from-amber-900/50 via-slate-800/80 to-slate-700/70",
  full: "from-yellow-500/30 via-amber-200/15 to-slate-700/70",
  waning_gibbous: "from-orange-900/40 via-slate-800/80 to-slate-700/70",
  last_quarter: "from-indigo-900/50 via-slate-800/80 to-slate-700/70",
  waning_crescent: "from-violet-950/50 via-slate-800/80 to-slate-700/70",
};

export function MoonCalendarPage({
  locale = "uk",
  heading,
  introText,
  contextLabel,
  heroPillLabel,
  heroTitle,
  monthLabel,
  todayLabel,
  currentPhase,
  keyPhases,
  days,
  averageIllumination,
  monthLinks = [],
}: MoonCalendarPageProps) {
  const isRu = locale === "ru";
  const isPl = locale === "pl";
  const isRo = locale === "ro";
  const currentPath = isRu ? "/ru/moon-calendar" : isPl ? "/pl/moon-calendar" : isRo ? "/ro/moon-calendar" : "/moon-calendar";
  const weekdayHeaders = isRu
    ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
    : isPl
      ? ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"]
      : isRo
        ? ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"]
        : ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
  const monthNumber = Number(days[0]?.dateKey.split("-")[1] || "1");
  const t = isRu
    ? {
        home: "Главная",
        h1: "Лунный календарь",
        intro:
          "Фазы Луны на текущий месяц, ключевые даты новолуния и полнолуния, а также наглядный календарь по дням.",
        today: "Сегодня",
        currentPhase: "Текущая фаза Луны",
        averageLight: "Средняя освещенность",
        averageLightSub: "По дням текущего месяца",
        keyPhases: "Ключевые фазы месяца",
        gridTitle: "Фазы Луны по дням месяца",
        monthLabel: "Текущий месяц",
        illum: "Освещенность",
        faq: "Частые вопросы",
        articleTitle: "Лунный прогноз на этот месяц",
        monthLinksTitle: "Лунный календарь по месяцам 2026",
        faqItems: [
          {
            q: "Что такое фазы Луны?",
            a: "Фазы Луны — это визуальные изменения освещенной части лунного диска, которые мы видим с Земли в течение месяца. Они возникают из-за того, как меняется положение Луны относительно Земли и Солнца.",
          },
          {
            q: "Чем отличаются новолуние, полнолуние и четверти?",
            a: "Новолуние — это момент, когда освещенная сторона Луны почти не видна с Земли. Полнолуние — когда диск освещен максимально. Первая и последняя четверти — это промежуточные фазы, когда видна примерно половина лунного диска.",
          },
          {
            q: "Что показывает процент освещенности Луны?",
            a: "Процент освещенности показывает, какая часть видимого лунного диска освещена Солнцем. Чем выше это значение, тем ярче Луна выглядит в ночном небе.",
          },
          {
            q: "Как пользоваться лунным календарем по дням?",
            a: "Календарь помогает быстро увидеть, какая фаза Луны приходится на конкретную дату месяца, когда ожидаются ключевые фазы и насколько яркой будет Луна в этот день. Это удобно для наблюдений за небом, съемки, планирования вечерних прогулок и общего ориентира по ночному освещению.",
          },
        ],
      }
    : isPl
      ? {
          home: "Strona główna",
          h1: "Kalendarz księżycowy",
          intro:
            "Fazy Księżyca na bieżący miesiąc, najważniejsze daty nowiu i pełni oraz przejrzysty kalendarz dzień po dniu.",
          today: "Dziś",
          currentPhase: "Aktualna faza Księżyca",
          averageLight: "Średnie oświetlenie",
          averageLightSub: "Dla wszystkich dni bieżącego miesiąca",
          keyPhases: "Kluczowe fazy miesiąca",
          gridTitle: "Fazy Księżyca dzień po dniu",
          monthLabel: "Bieżący miesiąc",
          illum: "Oświetlenie",
          faq: "Najczęstsze pytania",
          articleTitle: "Prognoza księżycowa na ten miesiąc",
          monthLinksTitle: "Kalendarz księżycowy na miesiące 2026",
          faqItems: [
            {
              q: "Czym są fazy Księżyca?",
              a: "Fazy Księżyca to widoczne zmiany oświetlonej części tarczy księżycowej obserwowane z Ziemi w ciągu miesiąca. Wynikają one ze zmieniającego się położenia Księżyca względem Ziemi i Słońca.",
            },
            {
              q: "Czym różnią się nów, pełnia i kwadry?",
              a: "Nów to moment, gdy oświetlona strona Księżyca jest prawie niewidoczna z Ziemi. Pełnia oznacza maksymalnie oświetloną tarczę. Pierwsza i ostatnia kwadra to fazy pośrednie, gdy widoczna jest mniej więcej połowa tarczy.",
            },
            {
              q: "Co oznacza procent oświetlenia Księżyca?",
              a: "Procent oświetlenia pokazuje, jaka część widocznej tarczy Księżyca jest oświetlona przez Słońce. Im wyższa wartość, tym jaśniejszy Księżyc wygląda na nocnym niebie.",
            },
            {
              q: "Jak korzystać z kalendarza księżycowego dzień po dniu?",
              a: "Kalendarz pomaga szybko sprawdzić, jaka faza przypada na konkretną datę, kiedy wypadają najważniejsze momenty miesiąca i jak jasny będzie Księżyc danego dnia. To wygodne przy obserwacjach nieba, fotografii i planowaniu wieczornych aktywności.",
            },
          ],
        }
      : isRo
        ? {
            home: "Acasă",
            h1: "Calendar lunar",
            intro:
              "Fazele Lunii pentru luna curentă, datele importante ale Lunii noi și Lunii pline, plus un calendar vizual pe zile.",
            today: "Astăzi",
            currentPhase: "Faza curentă a Lunii",
            averageLight: "Iluminare medie",
            averageLightSub: "Pentru zilele lunii curente",
            keyPhases: "Fazele principale ale lunii",
            gridTitle: "Fazele Lunii pe zile",
            monthLabel: "Luna curentă",
            illum: "Iluminare",
            faq: "Întrebări frecvente",
            articleTitle: "Prognoza lunară pentru această lună",
            monthLinksTitle: "Calendar lunar pe luni 2026",
            faqItems: [
              {
                q: "Ce sunt fazele Lunii?",
                a: "Fazele Lunii sunt schimbările vizibile ale părții iluminate a discului lunar observate de pe Pământ. Ele apar din cauza poziției Lunii față de Pământ și Soare.",
              },
              {
                q: "Prin ce diferă Luna nouă, Luna plină și pătrarele?",
                a: "Luna nouă este momentul când partea iluminată aproape nu se vede de pe Pământ. Luna plină înseamnă disc iluminat maxim, iar pătrarele sunt faze intermediare.",
              },
              {
                q: "Ce arată procentul de iluminare?",
                a: "Procentul de iluminare arată cât din discul vizibil al Lunii este luminat de Soare. Cu cât valoarea este mai mare, cu atât Luna pare mai luminoasă noaptea.",
              },
              {
                q: "Cum se folosește calendarul lunar pe zile?",
                a: "Calendarul te ajută să vezi rapid faza Lunii pentru o anumită dată, zilele cu faze principale și cât de luminoasă va fi Luna în acea noapte.",
              },
            ],
          }
      : {
        home: "Головна",
        h1: "Місячний календар",
        intro:
          "Фази Місяця на поточний місяць, ключові дати молодика та повні, а також наочний календар по днях.",
        today: "Сьогодні",
        currentPhase: "Поточна фаза Місяця",
        averageLight: "Середня освітленість",
        averageLightSub: "По днях поточного місяця",
        keyPhases: "Ключові фази місяця",
        gridTitle: "Фази Місяця по днях місяця",
        monthLabel: "Поточний місяць",
        illum: "Освітленість",
        faq: "Часті запитання",
        articleTitle: "Місячний прогноз на цей місяць",
        monthLinksTitle: "Місячний календар по місяцях 2026",
        faqItems: [
          {
            q: "Що таке фази Місяця?",
            a: "Фази Місяця — це візуальні зміни освітленої частини місячного диска, які ми бачимо із Землі протягом місяця. Вони виникають через зміну положення Місяця відносно Землі та Сонця.",
          },
          {
            q: "Чим відрізняються молодик, повня та чверті?",
            a: "Молодик — це момент, коли освітлена сторона Місяця майже не видна із Землі. Повня — коли диск освітлений максимально. Перша та остання чверті — це проміжні фази, коли видно приблизно половину місячного диска.",
          },
          {
            q: "Що показує відсоток освітленості Місяця?",
            a: "Відсоток освітленості показує, яка частина видимого місячного диска освітлена Сонцем. Чим вищий цей показник, тим яскравіше Місяць виглядає в нічному небі.",
          },
          {
            q: "Як користуватися місячним календарем по днях?",
            a: "Календар допомагає швидко побачити, яка фаза Місяця припадає на конкретну дату місяця, коли очікуються ключові фази і наскільки яскравим буде Місяць у цей день. Це зручно для спостережень за небом, зйомки, планування вечірніх прогулянок і загального орієнтиру щодо нічного освітлення.",
          },
        ],
      };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.home,
        item: absoluteUrl(isRu ? "/ru" : isPl ? "/pl" : isRo ? "/ro" : "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: heading ?? t.h1,
        item: absoluteUrl(currentPath),
      },
    ],
  };

  const currentPhaseLabel = isRu ? currentPhase.phaseLabelRu : isPl ? currentPhase.phaseLabelPl : isRo ? currentPhase.phaseLabelRo : currentPhase.phaseLabelUk;
  const resolvedHeading = heading ?? t.h1;
  const resolvedIntro = introText ?? t.intro;
  const resolvedContextLabel = contextLabel ?? t.today;
  const resolvedHeroPillLabel = heroPillLabel ?? t.currentPhase;
  const resolvedHeroTitle = heroTitle ?? currentPhaseLabel;
  const firstDay = days[0];
  const firstWeekdayRaw = firstDay ? new Date(`${firstDay.dateKey}T12:00:00+03:00`).getDay() : 1;
  const leadingEmptyCells = firstDay ? (firstWeekdayRaw + 6) % 7 : 0;
  const calendarCells: Array<MoonCalendarDay | null> = [
    ...Array.from({ length: leadingEmptyCells }, () => null),
    ...days,
  ];
  const newMoonDay = keyPhases.find((item) => item.kind === "new")?.day.dayNumber ?? "—";
  const firstQuarterDay = keyPhases.find((item) => item.kind === "first_quarter")?.day.dayNumber ?? "—";
  const fullMoonDay = keyPhases.find((item) => item.kind === "full")?.day.dayNumber ?? "—";
  const lastQuarterDay = keyPhases.find((item) => item.kind === "last_quarter")?.day.dayNumber ?? "—";

  function getZodiacPair(month: number) {
    const ukMap: Record<number, { first: string; second: string }> = {
      1: { first: "Козоріг", second: "Водолій" },
      2: { first: "Водолій", second: "Риби" },
      3: { first: "Риби", second: "Овен" },
      4: { first: "Овен", second: "Телець" },
      5: { first: "Телець", second: "Близнюки" },
      6: { first: "Близнюки", second: "Рак" },
      7: { first: "Рак", second: "Лев" },
      8: { first: "Лев", second: "Діва" },
      9: { first: "Діва", second: "Терези" },
      10: { first: "Терези", second: "Скорпіон" },
      11: { first: "Скорпіон", second: "Стрілець" },
      12: { first: "Стрілець", second: "Козоріг" },
    };
    const ruMap: Record<number, { first: string; second: string }> = {
      1: { first: "Козерог", second: "Водолей" },
      2: { first: "Водолей", second: "Рыбы" },
      3: { first: "Рыбы", second: "Овен" },
      4: { first: "Овен", second: "Телец" },
      5: { first: "Телец", second: "Близнецы" },
      6: { first: "Близнецы", second: "Рак" },
      7: { first: "Рак", second: "Лев" },
      8: { first: "Лев", second: "Дева" },
      9: { first: "Дева", second: "Весы" },
      10: { first: "Весы", second: "Скорпион" },
      11: { first: "Скорпион", second: "Стрелец" },
      12: { first: "Стрелец", second: "Козерог" },
    };
    const plMap: Record<number, { first: string; second: string }> = {
      1: { first: "Koziorożec", second: "Wodnik" },
      2: { first: "Wodnik", second: "Ryby" },
      3: { first: "Ryby", second: "Baran" },
      4: { first: "Baran", second: "Byk" },
      5: { first: "Byk", second: "Bliźnięta" },
      6: { first: "Bliźnięta", second: "Rak" },
      7: { first: "Rak", second: "Lew" },
      8: { first: "Lew", second: "Panna" },
      9: { first: "Panna", second: "Waga" },
      10: { first: "Waga", second: "Skorpion" },
      11: { first: "Skorpion", second: "Strzelec" },
      12: { first: "Strzelec", second: "Koziorożec" },
    };
    const roMap: Record<number, { first: string; second: string }> = {
      1: { first: "Capricorn", second: "Vărsător" },
      2: { first: "Vărsător", second: "Pești" },
      3: { first: "Pești", second: "Berbec" },
      4: { first: "Berbec", second: "Taur" },
      5: { first: "Taur", second: "Gemeni" },
      6: { first: "Gemeni", second: "Rac" },
      7: { first: "Rac", second: "Leu" },
      8: { first: "Leu", second: "Fecioară" },
      9: { first: "Fecioară", second: "Balanță" },
      10: { first: "Balanță", second: "Scorpion" },
      11: { first: "Scorpion", second: "Săgetător" },
      12: { first: "Săgetător", second: "Capricorn" },
    };
    return isRu ? ruMap[month] : isPl ? plMap[month] : isRo ? roMap[month] : ukMap[month];
  }

  const zodiac = getZodiacPair(monthNumber);
  const capitalizedMonthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  const articleParagraphs = isRu
    ? [
        `${capitalizedMonthLabel} проходит под заметным влиянием четырех ключевых фаз Луны. Новолуние ожидается ${newMoonDay} числа, первая четверть приходится на ${firstQuarterDay}, полнолуние — на ${fullMoonDay}, а последняя четверть — на ${lastQuarterDay}. В первой части месяца лунный диск постепенно набирает яркость, поэтому ночное небо становится светлее и лучше подходит для наблюдения за растущей Луной. Ближе к полнолунию освещенность достигает максимума, а после него Луна начинает убывать и ночи снова становятся темнее.`,
        `С точки зрения общего астрологического фона месяц проходит на стыке знаков ${zodiac.first} и ${zodiac.second}. Обычно до третьей декады сильнее ощущается энергия первого знака, а затем акцент смещается ко второму. Поэтому этот календарь удобно использовать не только как список фаз Луны, но и как ориентир для планирования наблюдений, вечерней активности и понимания того, насколько яркой будет Луна в конкретные даты месяца.`,
      ]
    : isPl
      ? [
          `${capitalizedMonthLabel} przebiega pod wyraźnym wpływem czterech głównych faz Księżyca. Nów wypada ${newMoonDay} dnia miesiąca, pierwsza kwadra ${firstQuarterDay}, pełnia ${fullMoonDay}, a ostatnia kwadra ${lastQuarterDay}. W pierwszej części miesiąca tarcza Księżyca stopniowo staje się jaśniejsza, dlatego nocne niebo bywa bardziej rozświetlone i lepiej nadaje się do obserwacji przybywającego Księżyca. W okolicach pełni jasność osiąga maksimum, a później Księżyc zaczyna ubywać i noce stają się znowu ciemniejsze.`,
          `Pod względem bardziej astrologicznego tła miesiąc przebiega na styku znaków ${zodiac.first} i ${zodiac.second}. Zwykle do trzeciej dekady mocniej odczuwalna jest energia pierwszego znaku, a potem akcent przesuwa się na drugi. Dzięki temu kalendarz można traktować nie tylko jako listę faz, ale też jako praktyczny przewodnik do planowania obserwacji nieba, wieczornej aktywności i oceny, jak jasny będzie Księżyc w konkretnych dniach miesiąca.`,
        ]
      : isRo
        ? [
            `${capitalizedMonthLabel} este marcată de patru faze principale ale Lunii. Luna nouă este așteptată în ziua ${newMoonDay}, primul pătrar în ziua ${firstQuarterDay}, Luna plină în ziua ${fullMoonDay}, iar ultimul pătrar în ziua ${lastQuarterDay}. În prima parte a lunii, discul lunar devine treptat mai luminos, iar nopțile sunt mai potrivite pentru observarea Lunii în creștere. În jurul Lunii pline iluminarea atinge maximul, apoi Luna începe să descrească.`,
            `Din punct de vedere al fundalului astrologic general, luna trece prin influența semnelor ${zodiac.first} și ${zodiac.second}. Calendarul poate fi folosit nu doar ca listă de faze, ci și ca reper practic pentru observarea cerului, fotografii nocturne și planificarea activităților de seară.`,
          ]
        : [
        `${capitalizedMonthLabel} проходить під помітним впливом чотирьох ключових фаз Місяця. Молодик очікується ${newMoonDay} числа, перша чверть припадає на ${firstQuarterDay}, повня — на ${fullMoonDay}, а остання чверть — на ${lastQuarterDay}. У першій частині місяця місячний диск поступово набирає яскравість, тому нічне небо стає світлішим і краще підходить для спостереження за зростаючим Місяцем. Ближче до повні освітленість досягає максимуму, а після неї Місяць починає спадати й ночі знову стають темнішими.`,
        `З погляду загального астрологічного фону місяць проходить на стику знаків ${zodiac.first} і ${zodiac.second}. Зазвичай до третьої декади сильніше відчувається енергія першого знака, а далі акцент зміщується до другого. Тому цей календар зручно використовувати не лише як список фаз Місяця, а і як орієнтир для планування спостережень, вечірньої активності та розуміння того, наскільки яскравим буде Місяць у конкретні дати місяця.`,
      ];

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header className="space-y-3">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href={isRu ? "/ru" : isPl ? "/pl" : isRo ? "/ro" : "/"} className="transition-colors hover:text-foreground">
            {t.home}
          </Link>
          <span>/</span>
          <span className="text-foreground">{resolvedHeading}</span>
        </nav>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{resolvedHeading}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{resolvedIntro}</p>
      </header>

      <section className={`overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br ${phaseTone[currentPhase.phaseKind]} p-6 shadow-[0_0_32px_rgba(34,211,238,0.12),0_24px_60px_-32px_rgba(255,240,180,0.42)]`}>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/75 px-3 py-1 text-xs uppercase tracking-[0.18em] text-foreground/75">
              <MoonStar className="h-4 w-4 text-primary" />
              {resolvedHeroPillLabel}
            </div>
            <div className="flex items-start gap-4">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-full border border-border/50 bg-background/80 text-5xl shadow-inner">
                {currentPhase.phaseEmoji}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-foreground/70">{resolvedContextLabel}: {todayLabel}</p>
                <h2 className="font-display text-3xl font-bold text-foreground">{resolvedHeroTitle}</h2>
                <p className="max-w-xl text-sm leading-relaxed text-foreground/75 sm:text-base">
                  {t.monthLabel}: {capitalizedMonthLabel}. {t.illum}: {currentPhase.illuminationPercent}%.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-xl border border-border/50 bg-background/80 p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-foreground/70">
                <Sparkles className="h-4 w-4 text-primary" />
                {t.averageLight}
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-foreground">{averageIllumination}%</p>
              <p className="mt-1 text-sm text-foreground/70">{t.averageLightSub}</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/80 p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-foreground/70">
                <TimerReset className="h-4 w-4 text-primary" />
                {t.monthLabel}
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground">{capitalizedMonthLabel}</p>
            </div>
          </div>
        </div>
      </section>

      <MobileAdsenseSlot />

      {monthLinks.length > 0 && (
        <section className="rounded-2xl border border-primary/15 bg-card p-4 shadow-[0_0_24px_rgba(34,211,238,0.06)] sm:p-5">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl border border-border/40 bg-background/40 px-4 py-3 transition-colors hover:border-primary/40">
              <div className="flex items-center gap-2">
                <TimerReset className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t.monthLinksTitle}</h2>
              </div>
              <span className="text-sm text-muted-foreground transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {monthLinks.map((item) => (
                <Link
                  key={isRu ? item.slugRu : isPl ? item.slugPl : isRo ? item.slugRo : item.slugUk}
                  href={isRu ? item.hrefRu : isPl ? item.hrefPl : isRo ? item.hrefRo : item.hrefUk}
                  className="rounded-xl border border-border/40 bg-background/40 px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {isRu ? item.labelRu : isPl ? item.labelPl : isRo ? item.labelRo : item.labelUk}
                </Link>
              ))}
            </div>
          </details>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t.keyPhases}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {keyPhases.map((phase) => (
            <article key={phase.kind} className="rounded-2xl border border-primary/15 bg-card p-5 shadow-[0_0_22px_rgba(34,211,238,0.05)]">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{phase.day.phaseEmoji}</span>
                <span className="rounded-full border border-border/40 bg-background/50 px-2.5 py-1 text-xs text-muted-foreground">
                  {phase.day.dayNumber}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {isRu ? phase.day.phaseLabelRu : isPl ? phase.day.phaseLabelPl : isRo ? phase.day.phaseLabelRo : phase.day.phaseLabelUk}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {isRu ? phase.day.weekdayShortRu : isPl ? phase.day.weekdayShortPl : isRo ? phase.day.weekdayShortRo : phase.day.weekdayShortUk}, {phase.day.dayNumber}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {t.illum}: <span className="font-medium text-foreground">{phase.day.illuminationPercent}%</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      <MobileAdsenseSlot />

      <section className="rounded-2xl border border-primary/15 bg-card p-6 shadow-[0_0_24px_rgba(34,211,238,0.05)]">
        <div className="mb-5 flex items-center gap-2">
          <MoonStar className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t.gridTitle}</h2>
        </div>
        <div className="grid gap-2 md:hidden">
          <div className="grid grid-cols-7 gap-1">
            {weekdayHeaders.map((weekday) => (
              <div
                key={weekday}
                className="rounded-lg border border-border/30 bg-background/50 px-1 py-2 text-center text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
              >
                {weekday}
              </div>
            ))}
            {calendarCells.map((day, index) =>
              day ? (
                <article
                  key={day.dateKey}
                  className={`min-h-[88px] rounded-xl border px-1.5 py-2 transition-colors ${
                    day.isToday
                      ? "border-primary/50 bg-primary/8 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]"
                      : "border-border/40 bg-background/40"
                  }`}
                >
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                      {isRu ? day.weekdayShortRu : isPl ? day.weekdayShortPl : isRo ? day.weekdayShortRo : day.weekdayShortUk}
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-foreground">{day.dayNumber}</p>
                    <div className="mt-1 text-2xl leading-none">{day.phaseEmoji}</div>
                    <p className="mt-1 text-[10px] text-muted-foreground">{day.illuminationPercent}%</p>
                  </div>
                </article>
              ) : (
                <div
                  key={`mobile-empty-${index}`}
                  className="min-h-[88px] rounded-xl border border-dashed border-border/20 bg-background/20"
                  aria-hidden="true"
                />
              )
            )}
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <div className="min-w-[840px]">
            <div className="grid grid-cols-7 gap-2">
              {weekdayHeaders.map((weekday) => (
                <div
                  key={weekday}
                  className="rounded-xl border border-border/30 bg-background/50 px-3 py-2 text-center text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {weekday}
                </div>
              ))}
              {calendarCells.map((day, index) =>
                day ? (
                  <article
                    key={day.dateKey}
                    className={`min-h-[148px] rounded-xl border p-4 transition-colors ${
                      day.isToday
                        ? "border-primary/50 bg-primary/5 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]"
                        : "border-border/40 bg-background/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          {isRu ? day.weekdayShortRu : isPl ? day.weekdayShortPl : isRo ? day.weekdayShortRo : day.weekdayShortUk}
                        </p>
                        <p className="mt-2 font-display text-2xl font-bold text-foreground">{day.dayNumber}</p>
                      </div>
                      <div className="text-4xl leading-none">{day.phaseEmoji}</div>
                    </div>
                    <div className="mt-4 space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {isRu ? day.phaseLabelRu : isPl ? day.phaseLabelPl : isRo ? day.phaseLabelRo : day.phaseLabelUk}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t.illum}: {day.illuminationPercent}%
                      </p>
                    </div>
                  </article>
                ) : (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[148px] rounded-xl border border-dashed border-border/20 bg-background/20"
                    aria-hidden="true"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-primary/15 bg-card p-6 shadow-[0_0_24px_rgba(34,211,238,0.05)]">
        <h2 className="text-lg font-semibold text-foreground">{t.articleTitle}</h2>
        <div className="mt-3 space-y-4">
          {articleParagraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-primary/15 bg-card p-6 shadow-[0_0_24px_rgba(34,211,238,0.05)]" aria-label={t.faq}>
        <div className="mb-5 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t.faq}</h2>
        </div>
        <div className="space-y-4">
          {t.faqItems.map((item) => (
            <details key={item.q} className="group rounded-xl border border-border/30 bg-background/40">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-foreground">
                {item.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
