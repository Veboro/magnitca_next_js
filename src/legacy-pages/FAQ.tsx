"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Zap, Heart, Wifi, Sun, Shield, Globe, Activity } from "lucide-react";
import type { SiteLocale } from "@/lib/locale";

type BaseLocale = Extract<SiteLocale, "uk" | "ru" | "pl">;
type LegacyLocale = SiteLocale;

type FAQSection = {
  title: string;
  icon: typeof Zap;
  items: Array<{ q: string; a: string }>;
};

const copy: Record<
  BaseLocale,
  {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    intro: string;
    sections: FAQSection[];
  }
> = {
  uk: {
    metaTitle: "FAQ — Магнітка | Часті питання про магнітні бурі",
    metaDescription:
      "Відповіді на найпоширеніші питання про магнітні бурі, Kp індекс, вплив на здоров'я та техніку. Все простою мовою.",
    heading: "Часті питання",
    intro:
      "Все, що потрібно знати про магнітні бурі, сонячну активність та їхній вплив на здоров'я і техніку — простою мовою.",
    sections: [
      {
        title: "Основи магнітних бурь",
        icon: Zap,
        items: [
          {
            q: "Що таке магнітна буря?",
            a: "Магнітна буря — це тимчасове збурення магнітного поля Землі, спричинене потоками заряджених частинок від Сонця. Коли Сонце викидає величезну хмару плазми (корональний викид маси, CME) або потік швидкого сонячного вітру, ці частинки досягають Землі за 1–3 дні та взаємодіють з магнітосферою, викликаючи коливання магнітного поля.",
          },
          {
            q: "Що таке індекс Kp?",
            a: "Kp-індекс — це глобальний показник геомагнітної активності за шкалою від 0 до 9. Значення 0–3 вважаються спокійними, 4 — неспокійним, 5+ — це вже магнітна буря. Індекс оновлюється кожні 3 години на основі даних з мережі магнітометрів по всьому світу. Чим вищий Kp, тим сильніша геомагнітна активність.",
          },
          {
            q: "Що означає шкала G1–G5?",
            a: "Шкала NOAA для геомагнітних бурь має 5 рівнів:\n\n• G1 (Слабка) — Kp=5. Незначні коливання в енергомережах, полярне сяйво на широтах 60°+.\n• G2 (Помірна) — Kp=6. Можливі проблеми з трансформаторами на високих широтах.\n• G3 (Сильна) — Kp=7. Перебої з електропостачанням, порушення GPS та радіозв'язку.\n• G4 (Дуже сильна) — Kp=8. Масштабні проблеми з енергосистемами, супутникова навігація порушена.\n• G5 (Екстремальна) — Kp=9. Катастрофічні збої електромереж, повне порушення радіозв'язку.",
          },
          {
            q: "Як часто виникають магнітні бурі?",
            a: "Це залежить від 11-річного сонячного циклу. Під час сонячного максимуму сильні бурі (G3+) можуть відбуватися кілька разів на місяць. Слабкі бурі (G1) — кілька разів на тиждень. Під час сонячного мінімуму бурі G3+ трапляються лише кілька разів на рік.",
          },
          {
            q: "Чи залежать магнітні бурі від країни чи міста?",
            a: "Ні, магнітні бурі — це глобальне явище. Індекс Kp та шкала G однакові для всієї планети. Різниця між, наприклад, Києвом та Чернівцями практично нульова. Єдине, що залежить від широти — це видимість полярного сяйва.",
          },
        ],
      },
      {
        title: "Сонячна активність",
        icon: Sun,
        items: [
          {
            q: "Що таке сонячний вітер?",
            a: "Сонячний вітер — це постійний потік заряджених частинок (протонів та електронів), що витікають з верхньої атмосфери Сонця зі швидкістю 300–800 км/с. Коли швидкість і щільність сонячного вітру різко зростають, це може викликати магнітну бурю.",
          },
          {
            q: "Що таке Bz-компонента?",
            a: "Bz — це вертикальна складова міжпланетного магнітного поля. Коли Bz стає від'ємним, магнітне поле Сонця з'єднується з полем Землі, дозволяючи зарядженим частинкам проникати в магнітосферу. Чим більше від'ємне значення Bz, тим сильніша буря.",
          },
          {
            q: "Що таке корональний викид маси (CME)?",
            a: "CME — це величезна хмара плазми та магнітного поля, яку Сонце викидає в космос під час сонячних спалахів. Якщо CME спрямований до Землі, він досягає нас за 1–3 дні та може спричинити сильну магнітну бурю.",
          },
          {
            q: "Що таке сонячні спалахи і як їх класифікують?",
            a: "Сонячні спалахи — це раптові яскраві спалахи на поверхні Сонця, які випромінюють потужне рентгенівське та ультрафіолетове випромінювання. Класифікація: A, B, C — слабкі; M — середні; X — найпотужніші.",
          },
          {
            q: "Що означають шкали R та S на дашборді?",
            a: "R — шкала порушень радіозв'язку, спричинених сонячними спалахами. S — шкала радіаційних бурь, спричинених потоком високоенергетичних протонів. Вони впливають на зв'язок, супутники, авіацію та космічні місії.",
          },
        ],
      },
      {
        title: "Вплив на здоров'я",
        icon: Heart,
        items: [
          {
            q: "Чи впливають магнітні бурі на здоров'я людей?",
            a: "Наукові дані суперечливі, але багато досліджень показують кореляцію між геомагнітною активністю та самопочуттям. Метеочутливі люди можуть відчувати головний біль, втому, порушення сну та зміни артеріального тиску.",
          },
          {
            q: "Як захистити себе під час магнітної бурі?",
            a: "Уникайте надмірних фізичних навантажень, контролюйте тиск, пийте достатньо води, забезпечте повноцінний сон і не панікуйте. За потреби консультуйтесь з лікарем.",
          },
          {
            q: "Хто найбільш чутливий до магнітних бурь?",
            a: "Найбільш чутливими вважаються люди з серцево-судинними захворюваннями, порушеннями вегетативної нервової системи, літні люди та люди з хронічними захворюваннями. Але реакція дуже індивідуальна.",
          },
        ],
      },
      {
        title: "Вплив на техніку",
        icon: Wifi,
        items: [
          {
            q: "Чи можуть магнітні бурі вплинути на мій смартфон?",
            a: "Безпосередньо — ні. Побутова електроніка захищена від геомагнітних збурень. Але під час сильних бурь може погіршитися точність GPS та якість мобільного зв'язку.",
          },
          {
            q: "Як магнітні бурі впливають на GPS?",
            a: "Магнітні бурі спричиняють іоносферні збурення, які впливають на проходження GPS-сигналів. Це може знизити точність позиціонування або тимчасово погіршити роботу навігації.",
          },
          {
            q: "Чи можуть магнітні бурі спричинити блекаут?",
            a: "Так, але тільки екстремальні бурі. Геомагнітно-індуковані струми можуть перевантажити трансформатори в електромережах. Для побутової електроніки прямої загрози немає.",
          },
          {
            q: "Як магнітні бурі впливають на супутники?",
            a: "Під час сильних бурь супутники можуть зазнавати зростання опору атмосфери, накопичення заряду на поверхні, помилок в електроніці та тимчасової втрати орієнтації.",
          },
        ],
      },
      {
        title: "Полярне сяйво",
        icon: Globe,
        items: [
          {
            q: "Чи можна побачити полярне сяйво в Україні?",
            a: "Дуже рідко, але можливо. Під час екстремальних бурь полярне сяйво може бути видимим і в Україні, особливо далеко від міського освітлення та при спостереженні в північному напрямку.",
          },
          {
            q: "При якому Kp можна побачити сяйво в Україні?",
            a: "Для широти України зазвичай потрібен Kp 7 і вище для слабкого сяйва на горизонті, і Kp 8–9 для яскравішого явища.",
          },
        ],
      },
      {
        title: "Про дашборд",
        icon: Activity,
        items: [
          {
            q: "Звідки беруться дані на дашборді?",
            a: "Усі дані отримуються в реальному часі з публічного API NOAA Space Weather Prediction Center — офіційної служби космічної погоди США.",
          },
          {
            q: "Як часто оновлюються дані?",
            a: "Сонячний вітер оновлюється щохвилини, Kp-індекс — кожні 3 години з проміжними оцінками, шкали NOAA — у реальному часі, а прогноз на 3 дні — кілька разів на добу.",
          },
          {
            q: "Чи безкоштовний цей сервіс?",
            a: "Так, сервіс безкоштовний. Ми використовуємо відкриті дані NOAA і не потребуємо реєстрації для перегляду основної інформації.",
          },
        ],
      },
      {
        title: "Безпека та захист",
        icon: Shield,
        items: [
          {
            q: "Чи небезпечні магнітні бурі для людей?",
            a: "Для переважної більшості людей магнітні бурі безпечні. Магнітосфера та атмосфера Землі надійно захищають нас від космічного випромінювання.",
          },
          {
            q: "Чи може магнітна буря знищити всю електроніку?",
            a: "Ні, це міф. Побутова електроніка не пошкоджується магнітними бурями. Ризик існує насамперед для довгих провідників, енергомереж і супутникових систем.",
          },
        ],
      },
    ],
  },
  ru: {
    metaTitle: "FAQ — Магнитка | Частые вопросы о магнитных бурях",
    metaDescription:
      "Ответы на самые частые вопросы о магнитных бурях, Kp индексе, влиянии на здоровье и технику. Все простым языком.",
    heading: "Частые вопросы",
    intro:
      "Все, что нужно знать о магнитных бурях, солнечной активности и их влиянии на здоровье и технику — простым языком.",
    sections: [
      {
        title: "Основы магнитных бурь",
        icon: Zap,
        items: [
          {
            q: "Что такое магнитная буря?",
            a: "Магнитная буря — это временное возмущение магнитного поля Земли, вызванное потоками заряженных частиц от Солнца. Когда Солнце выбрасывает большое облако плазмы или поток быстрого солнечного ветра, эти частицы достигают Земли за 1–3 дня и взаимодействуют с магнитосферой.",
          },
          {
            q: "Что такое индекс Kp?",
            a: "Kp индекс — это глобальный показатель геомагнитной активности по шкале от 0 до 9. Значения 0–3 считаются спокойными, 4 — нестабильными, 5+ — это уже магнитная буря.",
          },
          {
            q: "Что означает шкала G1–G5?",
            a: "Шкала NOAA для геомагнитных бурь имеет 5 уровней: от G1 (слабая) до G5 (экстремальная). Чем выше уровень, тем сильнее влияние на энергосети, связь, навигацию и спутники.",
          },
          {
            q: "Как часто возникают магнитные бури?",
            a: "Это зависит от 11-летнего солнечного цикла. Во время солнечного максимума сильные бури могут происходить несколько раз в месяц, а слабые — несколько раз в неделю.",
          },
          {
            q: "Зависят ли магнитные бури от страны или города?",
            a: "Нет, магнитные бури — глобальное явление. Индекс Kp и шкала G одинаковы для всей планеты. От широты в основном зависит только вероятность наблюдения полярного сияния.",
          },
        ],
      },
      {
        title: "Солнечная активность",
        icon: Sun,
        items: [
          {
            q: "Что такое солнечный ветер?",
            a: "Солнечный ветер — это постоянный поток заряженных частиц, исходящих из верхней атмосферы Солнца со скоростью 300–800 км/с. Резкий рост скорости и плотности может вызвать магнитную бурю.",
          },
          {
            q: "Что такое компонент Bz?",
            a: "Bz — это вертикальная составляющая межпланетного магнитного поля. Когда Bz становится отрицательным, частицам солнечного ветра легче проникать в магнитосферу Земли.",
          },
          {
            q: "Что такое корональный выброс массы (CME)?",
            a: "CME — это огромное облако плазмы и магнитного поля, которое Солнце выбрасывает в космос во время вспышек. Если выброс направлен к Земле, он может вызвать сильную магнитную бурю.",
          },
          {
            q: "Что такое солнечные вспышки и как их классифицируют?",
            a: "Солнечные вспышки — это внезапные яркие выбросы энергии на поверхности Солнца. По мощности их делят на классы A, B, C, M и X, где X — самые сильные.",
          },
          {
            q: "Что означают шкалы R и S на дашборде?",
            a: "R — шкала нарушений радиосвязи, вызванных солнечными вспышками. S — шкала радиационных бурь, связанных с потоком высокоэнергетических протонов.",
          },
        ],
      },
      {
        title: "Влияние на здоровье",
        icon: Heart,
        items: [
          {
            q: "Влияют ли магнитные бури на здоровье людей?",
            a: "Научные данные неоднозначны, но многие исследования показывают корреляцию между геомагнитной активностью и самочувствием. Метеочувствительные люди могут испытывать головную боль, усталость и нарушения сна.",
          },
          {
            q: "Как защитить себя во время магнитной бури?",
            a: "Избегайте чрезмерных нагрузок, контролируйте давление, пейте достаточно воды, старайтесь высыпаться и избегать стресса. При необходимости консультируйтесь с врачом.",
          },
          {
            q: "Кто наиболее чувствителен к магнитным бурям?",
            a: "Чаще всего чувствительны люди с сердечно-сосудистыми заболеваниями, нарушениями вегетативной нервной системы, пожилые люди и люди с хроническими болезнями.",
          },
        ],
      },
      {
        title: "Влияние на технику",
        icon: Wifi,
        items: [
          {
            q: "Могут ли магнитные бури повлиять на мой смартфон?",
            a: "Напрямую — нет. Бытовая электроника защищена от геомагнитных возмущений. Но во время сильных бурь может ухудшиться точность GPS и качество связи.",
          },
          {
            q: "Как магнитные бури влияют на GPS?",
            a: "Магнитные бури вызывают ионосферные возмущения, которые влияют на прохождение GPS-сигналов. Это может снижать точность позиционирования и ухудшать работу навигации.",
          },
          {
            q: "Могут ли магнитные бури вызвать блэкаут?",
            a: "Да, но обычно только экстремальные бури. Геомагнитно-индуцированные токи могут перегружать трансформаторы в энергосетях.",
          },
          {
            q: "Как магнитные бури влияют на спутники?",
            a: "Во время сильных бурь спутники могут сталкиваться с ростом сопротивления атмосферы, накоплением заряда на поверхности, ошибками электроники и временной потерей ориентации.",
          },
        ],
      },
      {
        title: "Полярное сияние",
        icon: Globe,
        items: [
          {
            q: "Можно ли увидеть полярное сияние в Украине?",
            a: "Очень редко, но возможно. Во время экстремальных бурь полярное сияние может быть видно и в Украине, особенно вдали от городского освещения.",
          },
          {
            q: "При каком Kp можно увидеть сияние в Украине?",
            a: "Для широты Украины обычно нужен Kp 7 и выше для слабого свечения на горизонте и Kp 8–9 для более яркого явления.",
          },
        ],
      },
      {
        title: "О дашборде",
        icon: Activity,
        items: [
          {
            q: "Откуда берутся данные на дашборде?",
            a: "Все данные поступают в реальном времени из публичного API NOAA Space Weather Prediction Center — официальной службы космической погоды США.",
          },
          {
            q: "Как часто обновляются данные?",
            a: "Солнечный ветер обновляется каждую минуту, Kp индекс — каждые 3 часа с промежуточными оценками, шкалы NOAA — в реальном времени, а прогноз на 3 дня — несколько раз в сутки.",
          },
          {
            q: "Бесплатен ли этот сервис?",
            a: "Да, сервис бесплатный. Мы используем открытые данные NOAA и не требуем регистрации для просмотра основной информации.",
          },
        ],
      },
      {
        title: "Безопасность и защита",
        icon: Shield,
        items: [
          {
            q: "Опасны ли магнитные бури для людей?",
            a: "Для подавляющего большинства людей магнитные бури безопасны. Магнитосфера и атмосфера Земли надежно защищают нас от космического излучения.",
          },
          {
            q: "Может ли магнитная буря уничтожить всю электронику?",
            a: "Нет, это миф. Бытовая электроника не выходит из строя из-за магнитных бурь. Основной риск относится к длинным проводникам, энергосетям и спутниковым системам.",
          },
        ],
      },
    ],
  },
  pl: {
    metaTitle: "FAQ — Magnitca | Najczęstsze pytania o burze magnetyczne",
    metaDescription:
      "Odpowiedzi na najczęstsze pytania o burze magnetyczne, indeks Kp, wpływ na samopoczucie i technologię. Wszystko prostym językiem.",
    heading: "Najczęstsze pytania",
    intro:
      "Najważniejsze informacje o burzach magnetycznych, aktywności słonecznej oraz ich wpływie na samopoczucie i technologię — w prostym, praktycznym formacie.",
    sections: [
      {
        title: "Podstawy burz magnetycznych",
        icon: Zap,
        items: [
          {
            q: "Czym jest burza magnetyczna?",
            a: "Burza magnetyczna to czasowe zaburzenie pola magnetycznego Ziemi wywołane strumieniem naładowanych cząstek ze Słońca. Najczęściej dochodzi do niej po koronalnym wyrzucie masy lub przy napływie szybkiego wiatru słonecznego.",
          },
          {
            q: "Co oznacza indeks Kp?",
            a: "Indeks Kp to globalny wskaźnik aktywności geomagnetycznej w skali od 0 do 9. Wartości 0-3 oznaczają spokojną sytuację, 4 wskazuje na niestabilne tło, a 5 i więcej oznacza już burzę magnetyczną.",
          },
          {
            q: "Czy burze magnetyczne są takie same w każdym kraju?",
            a: "Tak, sama aktywność geomagnetyczna ma charakter globalny. Różnice regionalne dotyczą głównie widoczności zorzy polarnej i lokalnych warunków pogodowych, ale nie samej skali burzy.",
          },
        ],
      },
      {
        title: "Aktywność słoneczna",
        icon: Sun,
        items: [
          {
            q: "Czym jest wiatr słoneczny?",
            a: "Wiatr słoneczny to stały strumień naładowanych cząstek wypływających z korony słonecznej. Jego prędkość i gęstość mają duże znaczenie dla tego, jak silnie zareaguje magnetosfera Ziemi.",
          },
          {
            q: "Co oznacza składowa Bz?",
            a: "Bz to pionowa składowa międzyplanetarnego pola magnetycznego. Gdy staje się ujemna, cząstkom wiatru słonecznego łatwiej przenikać do magnetosfery, a ryzyko burzy rośnie.",
          },
          {
            q: "Czym jest koronalny wyrzut masy (CME)?",
            a: "CME to ogromna chmura plazmy i pola magnetycznego wyrzucana ze Słońca. Jeśli jest skierowana ku Ziemi, może wywołać silniejszą burzę magnetyczną po 1-3 dniach.",
          },
        ],
      },
      {
        title: "Wpływ na samopoczucie",
        icon: Heart,
        items: [
          {
            q: "Czy burze magnetyczne naprawdę wpływają na ludzi?",
            a: "Dane naukowe nie są jednoznaczne, ale wiele osób wrażliwych na pogodę zauważa podczas wzrostu aktywności geomagnetycznej ból głowy, zmęczenie, rozdrażnienie lub problemy ze snem.",
          },
          {
            q: "Kto najczęściej odczuwa taki wpływ?",
            a: "Najczęściej są to osoby meteowrażliwe, osoby z chorobami układu krążenia, problemami neurologicznymi oraz ci, którzy silnie reagują na wahania pogody i ciśnienia.",
          },
          {
            q: "Jak zachować się w dzień podwyższonej aktywności?",
            a: "Najlepiej ograniczyć przeciążenia, zadbać o sen, nawodnienie i spokojniejszy rytm dnia. Jeśli masz przewlekłe dolegliwości, warto obserwować samopoczucie uważniej niż zwykle.",
          },
        ],
      },
      {
        title: "Wpływ na technologię",
        icon: Wifi,
        items: [
          {
            q: "Czy burze magnetyczne mogą zakłócać GPS i łączność?",
            a: "Tak, szczególnie silniejsze burze mogą pogarszać dokładność GPS, łączność radiową i stabilność niektórych systemów satelitarnych.",
          },
          {
            q: "Czy smartfon lub komputer mogą się zepsuć od burzy magnetycznej?",
            a: "Nie bezpośrednio. Domowa elektronika zwykle jest bezpieczna. Największe ryzyko dotyczy infrastruktury energetycznej, satelitów i systemów opartych na sygnałach radiowych.",
          },
        ],
      },
      {
        title: "O serwisie",
        icon: Activity,
        items: [
          {
            q: "Skąd pochodzą dane na stronie?",
            a: "Magnitca korzysta z otwartych źródeł danych NOAA Space Weather Prediction Center oraz Open-Meteo. Dane są prezentowane w prostszej, bardziej czytelnej formie.",
          },
          {
            q: "Jak często dane są aktualizowane?",
            a: "Wiatr słoneczny jest aktualizowany bardzo często, indeks Kp pojawia się w oficjalnych interwałach, a prognozy są odświeżane w ciągu dnia zgodnie z publikacjami źródeł.",
          },
          {
            q: "Czy korzystanie z serwisu jest bezpłatne?",
            a: "Tak. Publiczna część serwisu jest dostępna bezpłatnie i nie wymaga rejestracji do podstawowego przeglądania danych.",
          },
        ],
      },
    ],
  },
};

const localizedCopy: Record<LegacyLocale, (typeof copy)["uk"]> = {
  ...copy,
  ro: {
    metaTitle: "FAQ — Magnitca Moldova | Întrebări despre furtuni magnetice",
    metaDescription:
      "Răspunsuri la întrebări frecvente despre furtuni magnetice, indicele Kp, vânt solar și influența asupra organismului.",
    heading: "Întrebări frecvente",
    intro:
      "Tot ce trebuie să știi despre furtuni magnetice, activitatea solară și influența asupra organismului — explicat simplu.",
    sections: [
      {
        title: "Bazele furtunilor magnetice",
        icon: Zap,
        items: [
          {
            q: "Ce este o furtună magnetică?",
            a: "O furtună magnetică este o perturbare temporară a câmpului magnetic al Pământului cauzată de particule încărcate venite de la Soare.",
          },
          {
            q: "Ce este indicele Kp?",
            a: "Indicele Kp este un indicator global al activității geomagnetice pe o scară de la 0 la 9. De la Kp 5 începe furtuna geomagnetică.",
          },
          {
            q: "Ce înseamnă scara G1-G5?",
            a: "Scara NOAA clasifică furtunile geomagnetice de la G1 la G5, unde G1 este slabă, iar G5 este extremă.",
          },
          {
            q: "Furtunile magnetice depind de oraș?",
            a: "Activitatea geomagnetică este globală. Diferențele locale țin mai ales de latitudine, vreme și condițiile de observare, nu de valoarea Kp în sine.",
          },
        ],
      },
      {
        title: "Activitatea solară",
        icon: Sun,
        items: [
          {
            q: "Ce este vântul solar?",
            a: "Vântul solar este un flux de particule încărcate care pleacă permanent de la Soare. Viteza și densitatea lui influențează presiunea asupra magnetosferei.",
          },
          {
            q: "Ce este componenta Bz?",
            a: "Bz este componenta verticală a câmpului magnetic interplanetar. Valorile negative cresc probabilitatea unor perturbări geomagnetice.",
          },
          {
            q: "Ce este o erupție solară?",
            a: "O erupție solară este o eliberare bruscă de energie pe Soare. Erupțiile puternice pot influența comunicațiile radio și vremea spațială.",
          },
        ],
      },
      {
        title: "Influența asupra organismului",
        icon: Heart,
        items: [
          {
            q: "Furtunile magnetice pot afecta starea de bine?",
            a: "Unele persoane meteosensibile pot simți oboseală, dureri de cap, iritabilitate sau somn mai agitat în perioadele cu activitate geomagnetică ridicată.",
          },
          {
            q: "Ce pot face în zilele active?",
            a: "Menține un ritm mai calm, hidratează-te, evită suprasolicitarea și urmărește prognoza. Informațiile de pe site nu înlocuiesc sfatul medicului.",
          },
        ],
      },
      {
        title: "Date și prognoză",
        icon: Activity,
        items: [
          {
            q: "De unde provin datele?",
            a: "Datele despre vremea spațială sunt preluate din surse deschise NOAA SWPC, iar datele meteo locale din surse meteo deschise.",
          },
          {
            q: "Cât de des se actualizează prognoza?",
            a: "Indicatorii se actualizează regulat în timpul zilei, în funcție de disponibilitatea datelor sursă.",
          },
          {
            q: "Site-ul este gratuit?",
            a: "Da, informațiile principale sunt disponibile gratuit și nu necesită cont pentru vizualizare.",
          },
        ],
      },
    ],
  },
  hu: {
    metaTitle: "GYIK — Magnitca Magyarország | Kérdések a mágneses viharokról",
    metaDescription:
      "Válaszok a mágneses viharokkal, Kp-indexszel, napszéllel és a szervezetre gyakorolt hatással kapcsolatos gyakori kérdésekre.",
    heading: "Gyakori kérdések",
    intro:
      "Rövid, érthető magyarázatok a mágneses viharokról, a naptevékenységről, a Kp-indexről és az űridőjárás hatásairól.",
    sections: [
      {
        title: "A mágneses viharok alapjai",
        icon: Zap,
        items: [
          {
            q: "Mi az a mágneses vihar?",
            a: "A mágneses vihar a Föld mágneses terének átmeneti zavara, amelyet a Napból érkező töltött részecskék okoznak.",
          },
          {
            q: "Mi az a Kp-index?",
            a: "A Kp-index a globális geomágneses aktivitás 0 és 9 közötti mutatója. A 0-3 érték nyugodtnak számít, 5 felett pedig már geomágneses viharról beszélünk.",
          },
          {
            q: "Mit jelent a G1-G5 skála?",
            a: "A NOAA G-skála a geomágneses viharok erősségét jelöli. A G1 gyenge vihart, a G5 extrém vihart jelent.",
          },
          {
            q: "Milyen gyakran fordulnak elő mágneses viharok?",
            a: "Ez a Nap körülbelül 11 éves aktivitási ciklusától függ. Napmaximum idején gyakoribbak az erősebb geomágneses zavarok, napminimum idején pedig ritkábban fordulnak elő jelentős viharok.",
          },
          {
            q: "Függ a mágneses vihar egy adott várostól vagy országtól?",
            a: "A Kp-index globális mutató, ezért maga a geomágneses aktivitás nem városonként változik. A különbség inkább abban van, hogy a földrajzi szélesség, az időjárás és a helyi körülmények befolyásolják például a sarki fény megfigyelhetőségét.",
          },
        ],
      },
      {
        title: "Naptevékenység",
        icon: Sun,
        items: [
          {
            q: "Mi a napszél?",
            a: "A napszél töltött részecskék folyamatos áramlása a Napból. Sebessége és sűrűsége befolyásolja, mekkora nyomás éri a Föld magnetoszféráját.",
          },
          {
            q: "Mi az IMF Bz komponens?",
            a: "A Bz az interplanetáris mágneses tér függőleges komponense. A negatív, déli irányú értékek növelhetik a geomágneses zavar esélyét.",
          },
          {
            q: "Miért változik napközben az előrejelzés?",
            a: "Az űridőjárás dinamikus. A napszél, a Bz komponens és a NOAA-előrejelzések új mérések alapján frissülhetnek.",
          },
          {
            q: "Mi az a koronakidobódás?",
            a: "A koronakidobódás, vagy CME, a Napból kilökődő nagy mennyiségű plazma és mágneses tér. Ha a Föld felé halad, 1-3 nap múlva geomágneses vihart okozhat.",
          },
          {
            q: "Mik a napkitörések?",
            a: "A napkitörések hirtelen energiafelszabadulások a Nap felszínén és légkörében. Erős kitörések rádiózavarokat okozhatnak, és ha anyagkidobódással járnak, a későbbi geomágneses aktivitást is befolyásolhatják.",
          },
          {
            q: "Mit jelentenek az R és S skálák?",
            a: "Az R-skála a rádiókommunikációt érintő napkitöréses zavarokat, az S-skála pedig a sugárzási viharokat jelöli. Ezek főleg műholdakra, rádiózásra, repülésre és űreszközökre lehetnek fontosak.",
          },
        ],
      },
      {
        title: "Hatás a közérzetre",
        icon: Heart,
        items: [
          {
            q: "Érezhetők a mágneses viharok?",
            a: "Egyes időjárásra érzékeny emberek fáradtságot, fejfájást, ingerlékenységet vagy nyugtalanabb alvást tapasztalhatnak emelkedett geomágneses aktivitás idején.",
          },
          {
            q: "Mit érdemes tenni aktív napokon?",
            a: "Érdemes nyugodtabb tempót tartani, elegendő vizet inni, kerülni a túlterhelést és figyelni az előrejelzést. A webhely nem helyettesíti az orvosi tanácsot.",
          },
          {
            q: "Kik lehetnek érzékenyebbek a geomágneses aktivitásra?",
            a: "Gyakrabban említik az idősebbeket, a szív- és érrendszeri problémákkal élőket, a krónikus betegséggel rendelkezőket és az időjárás-változásokra egyébként is érzékeny embereket. A reakció azonban nagyon egyéni.",
          },
          {
            q: "Orvosi tanácsnak számítanak ezek az információk?",
            a: "Nem. A Magnitca tájékoztató adatokat és általános magyarázatokat ad. Tartós panaszok, erős tünetek vagy krónikus betegség esetén mindig orvossal érdemes egyeztetni.",
          },
        ],
      },
      {
        title: "Hatás technológiára",
        icon: Wifi,
        items: [
          {
            q: "Befolyásolhatja a mágneses vihar a GPS-t?",
            a: "Erősebb geomágneses viharok idején az ionoszféra zavarai ronthatják a műholdas navigáció pontosságát. A mindennapi használatban ez gyakran nem látványos, de professzionális rendszereknél fontos lehet.",
          },
          {
            q: "Hat a mágneses vihar a mobiltelefonokra?",
            a: "A hétköznapi telefonok közvetlenül általában nem sérülnek. Erős viharok idején azonban bizonyos kommunikációs vagy navigációs rendszerek pontossága romolhat.",
          },
          {
            q: "Miért figyelik az energiarendszerek az űridőjárást?",
            a: "Nagyon erős geomágneses viharok elektromos áramokat indukálhatnak nagy kiterjedésű vezető rendszerekben, például távvezetékekben. Emiatt az energiaszektor számára a G-skála figyelése fontos kockázatkezelési eszköz.",
          },
        ],
      },
      {
        title: "Adatok és előrejelzés",
        icon: Activity,
        items: [
          {
            q: "Honnan származnak az adatok?",
            a: "Az űridőjárási adatok nyílt NOAA SWPC forrásokból származnak. A Magnitca ezeket érthetőbb formában jeleníti meg.",
          },
          {
            q: "Milyen gyakran frissülnek az adatok?",
            a: "A mutatók a forrásadatok elérhetőségétől függően rendszeresen frissülnek a nap folyamán.",
          },
          {
            q: "Ingyenes a szolgáltatás?",
            a: "Igen, a fő információk ingyenesen, regisztráció nélkül elérhetők.",
          },
          {
            q: "Mennyire pontos a 3 napos előrejelzés?",
            a: "A rövidebb távú előrejelzés általában hasznosabb, mert több friss mérés áll rendelkezésre. Ennek ellenére az űridőjárás gyorsan változhat, ezért a számokat aktuális helyzetképnek érdemes tekinteni.",
          },
          {
            q: "Miért térhet el a jelenlegi Kp és a napi maximum?",
            a: "A jelenlegi Kp az aktuális állapotot mutatja, míg a napi maximum az adott napra várt vagy már mért legmagasabb érték. Ezért előfordulhat, hogy reggel magasabb volt az aktivitás, délután pedig már nyugodtabb a helyzet.",
          },
          {
            q: "Használható a Magnitca kritikus döntésekhez?",
            a: "Kritikus műszaki, repülési, energetikai vagy egészségügyi döntésekhez mindig az elsődleges hivatalos forrásokat és szakmai protokollokat kell ellenőrizni. A Magnitca célja a közérthető tájékoztatás.",
          },
        ],
      },
    ],
  },
  en: {
    metaTitle: "FAQ — Magnitca | Magnetic storm questions",
    metaDescription:
      "Simple answers about magnetic storms, the Kp index, solar wind, forecasts and possible effects on wellbeing.",
    heading: "Frequently asked questions",
    intro:
      "Everything you need to know about magnetic storms, solar activity and their possible impact on wellbeing, explained in plain language.",
    sections: [
      {
        title: "Magnetic storm basics",
        icon: Zap,
        items: [
          {
            q: "What is a magnetic storm?",
            a: "A magnetic storm is a temporary disturbance of Earth's magnetic field caused by charged particles from the Sun. It often follows a coronal mass ejection or a faster stream of solar wind.",
          },
          {
            q: "What is the Kp index?",
            a: "The Kp index is a global measure of geomagnetic activity on a scale from 0 to 9. Values from 0 to 3 are usually calm, Kp 4 is unsettled, and Kp 5 or higher indicates a geomagnetic storm.",
          },
          {
            q: "What does the G1-G5 scale mean?",
            a: "NOAA's G scale classifies geomagnetic storms from G1 to G5. G1 is minor, while G5 is extreme. Higher levels mean stronger potential effects on navigation, communication, power systems and sensitive people.",
          },
          {
            q: "Do magnetic storms depend on a city or country?",
            a: "Geomagnetic activity is global. Local differences are mostly related to latitude, weather and observation conditions, not to a separate Kp value for each city.",
          },
        ],
      },
      {
        title: "Solar activity",
        icon: Sun,
        items: [
          {
            q: "What is solar wind?",
            a: "Solar wind is a stream of charged particles flowing from the Sun. When its speed, density or magnetic field changes sharply, geomagnetic activity near Earth can increase.",
          },
          {
            q: "What is IMF Bz?",
            a: "Bz is the north-south component of the interplanetary magnetic field. Negative, or southward, Bz makes it easier for solar wind energy to enter Earth's magnetosphere.",
          },
          {
            q: "What is a coronal mass ejection?",
            a: "A coronal mass ejection, or CME, is a large cloud of solar plasma and magnetic field released from the Sun. If it is directed toward Earth, it can trigger a magnetic storm.",
          },
        ],
      },
      {
        title: "Wellbeing",
        icon: Heart,
        items: [
          {
            q: "Can people feel magnetic storms?",
            a: "Scientific evidence is mixed, but many weather-sensitive people report fatigue, headache, irritability, pressure changes or poorer sleep during active geomagnetic periods.",
          },
          {
            q: "What should I do on active days?",
            a: "Keep a calmer pace, drink enough water, avoid unnecessary overload and follow the forecast. Magnitca is informational and does not replace medical advice.",
          },
          {
            q: "Who may be more sensitive?",
            a: "Older people, people with cardiovascular or chronic conditions and those already sensitive to weather changes may notice active days more often. Individual reactions vary a lot.",
          },
        ],
      },
      {
        title: "Technology",
        icon: Wifi,
        items: [
          {
            q: "Can magnetic storms affect GPS?",
            a: "During stronger storms, ionospheric disturbances can reduce satellite navigation accuracy. For everyday users this may be subtle, but professional systems monitor it closely.",
          },
          {
            q: "Can a storm damage my phone?",
            a: "Everyday phones are not directly damaged by magnetic storms. Strong storms can affect some navigation and communication systems, but household electronics are generally safe.",
          },
          {
            q: "Why do power systems monitor space weather?",
            a: "Very strong geomagnetic storms can induce currents in long conductors such as power lines. That is why the energy sector watches NOAA storm scales.",
          },
        ],
      },
      {
        title: "Data and forecasts",
        icon: Activity,
        items: [
          {
            q: "Where does Magnitca get the data?",
            a: "Space weather data comes from open NOAA Space Weather Prediction Center sources. Magnitca presents it in a clearer, more everyday-friendly format.",
          },
          {
            q: "How often is the data updated?",
            a: "Indicators update throughout the day depending on source availability. Solar wind data is refreshed frequently, while official forecasts are updated by NOAA on their own schedule.",
          },
          {
            q: "Why can current Kp and today's maximum differ?",
            a: "Current Kp shows the present situation, while today's maximum is the highest value measured or expected during the day. Activity can peak earlier and become calmer later.",
          },
          {
            q: "Can Magnitca be used for critical decisions?",
            a: "For critical technical, aviation, energy or medical decisions, always check primary official sources and professional protocols. Magnitca is designed for public awareness.",
          },
        ],
      },
    ],
  },
};

function buildFaqJsonLd(sections: FAQSection[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sections.flatMap((section) =>
      section.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a.replace(/\n/g, " "),
        },
      }))
    ),
  };
}

const FAQ = ({ locale = "uk" }: { locale?: LegacyLocale }) => {
  const t = localizedCopy[locale];
  const faqJsonLd = buildFaqJsonLd(t.sections);

  return (
    <main className="official-page-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="official-page-shell container max-w-4xl py-2 space-y-8">
        <div className="official-page-header">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="font-display text-4xl font-bold text-foreground">{t.heading}</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">{t.intro}</p>
        </div>

        {t.sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <section.icon className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold text-foreground">{section.title}</h2>
            </div>
            <Accordion type="multiple" className="space-y-2">
              {section.items.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`${section.title}-${i}`}
                  className="rounded-lg border border-border bg-card px-4"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </main>
  );
};

export default FAQ;
