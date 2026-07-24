import type { Metadata } from "next";
import { HeartPulse } from "lucide-react";
import { StormNotesFeed } from "@/components/dashboard/StormNotesFeed";
import { StormNoteComposer } from "@/components/dashboard/StormNoteComposer";
import { FeelingJsonLd } from "@/components/dashboard/feeling-jsonld";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import { getUkraineAuroraForecast } from "@/lib/aurora-forecast";
import { fetchApprovedNotes, type StormNote } from "@/lib/storm-notes";
import type { SiteLocale } from "@/lib/locale";

const FEED_PAGE_SIZE = 8;

type FaqItem = { q: string; a: string };

const SLUG = "feeling";

// URL prefix per locale (uk lives at the root).
const LOCALE_PREFIX: Record<SiteLocale, string> = {
  uk: "",
  ru: "/ru",
  pl: "/pl",
  ro: "/ro",
  hu: "/hu",
  en: "/en",
};

const OG_LOCALE: Record<SiteLocale, string> = {
  uk: "uk_UA",
  ru: "ru_RU",
  pl: "pl_PL",
  ro: "ro_RO",
  hu: "hu_HU",
  en: "en_US",
};

type PageCopy = {
  metaTitle: string;
  metaDescription: string;
  homeLabel: string;
  breadcrumbCurrent: string;
  badge: string;
  h1: string;
  seo: string;
  anonymous: string;
  relatedTitle: string;
  relatedKp: string;
  relatedCalendar: string;
  faqTitle: string;
  faq: FaqItem[];
};

const COPY: Record<SiteLocale, PageCopy> = {
  uk: {
    metaTitle: "Вплив магнітних бур на самопочуття — реальні історії людей",
    metaDescription:
      "Як люди почуваються під час магнітних бур: реальні історії про головний біль, тиск, втому та настрій. Кожна історія прив'язана до оцінки самопочуття і Kp-індексу того дня.",
    homeLabel: "Магнітка",
    breadcrumbCurrent: "Самопочуття",
    badge: "Історії самопочуття",
    h1: "Вплив магнітних бур на самопочуття",
    seo: "Тут зібрані реальні історії людей про те, як вони почуваються під час магнітних бур: головний біль, зміни тиску, втома, тривожність чи, навпаки, спокійні дні. Кожна історія прив'язана до оцінки самопочуття та Kp-індексу того дня, тому можна побачити, як різні люди переживають однакову геомагнітну обстановку. Це особистий досвід, а не медична порада.",
    anonymous: "Анонім",
    relatedTitle: "Дивіться також",
    relatedKp: "Kp-індекс сьогодні",
    relatedCalendar: "Календар магнітних бур",
    faqTitle: "Часті запитання",
    faq: [
      {
        q: "Чи справді магнітні бурі впливають на самопочуття?",
        a: "Частина людей повідомляє про головний біль, коливання тиску, втому чи тривожність у дні геомагнітних збурень. Наукові дані неоднозначні, тому ці історії — особистий досвід, а не медична порада.",
      },
      {
        q: "Які симптоми найчастіше згадують під час магнітних бур?",
        a: "Найчастіше — головний біль і відчуття тиску у скронях, втома й сонливість, коливання артеріального тиску, дратівливість, тривожність і порушення сну.",
      },
      {
        q: "Як пов'язані Kp-індекс і самопочуття?",
        a: "Kp-індекс показує силу геомагнітної активності. Кожна історія в стрічці прив'язана до Kp-індексу того дня, тож можна порівняти, як різні люди почуваються за однакового рівня бурі.",
      },
      {
        q: "Що допомагає легше пережити магнітну бурю?",
        a: "Зазвичай радять достатньо спати, пити воду, зменшити навантаження й кофеїн, бувати на свіжому повітрі. За стійких або сильних симптомів варто звернутися до лікаря.",
      },
    ],
  },
  ru: {
    metaTitle: "Влияние магнитных бурь на самочувствие — реальные истории людей",
    metaDescription:
      "Как люди чувствуют себя во время магнитных бурь: реальные истории о головной боли, давлении, усталости и настроении. Каждая история привязана к оценке самочувствия и Kp-индексу того дня.",
    homeLabel: "Магнитка",
    breadcrumbCurrent: "Самочувствие",
    badge: "Истории самочувствия",
    h1: "Влияние магнитных бурь на самочувствие",
    seo: "Здесь собраны реальные истории людей о том, как они чувствуют себя во время магнитных бурь: головная боль, изменения давления, усталость, тревожность или, наоборот, спокойные дни. Каждая история привязана к оценке самочувствия и Kp-индексу того дня, поэтому можно увидеть, как разные люди переживают одинаковую геомагнитную обстановку. Это личный опыт, а не медицинская рекомендация.",
    anonymous: "Аноним",
    relatedTitle: "Смотрите также",
    relatedKp: "Kp-индекс сегодня",
    relatedCalendar: "Календарь магнитных бурь",
    faqTitle: "Частые вопросы",
    faq: [
      {
        q: "Действительно ли магнитные бури влияют на самочувствие?",
        a: "Часть людей сообщает о головной боли, колебаниях давления, усталости или тревожности в дни геомагнитных возмущений. Научные данные неоднозначны, поэтому эти истории — личный опыт, а не медицинская рекомендация.",
      },
      {
        q: "Какие симптомы чаще всего упоминают во время магнитных бурь?",
        a: "Чаще всего — головная боль и ощущение давления в висках, усталость и сонливость, колебания артериального давления, раздражительность, тревожность и нарушения сна.",
      },
      {
        q: "Как связаны Kp-индекс и самочувствие?",
        a: "Kp-индекс показывает силу геомагнитной активности. Каждая история в ленте привязана к Kp-индексу того дня, поэтому можно сравнить, как разные люди чувствуют себя при одинаковом уровне бури.",
      },
      {
        q: "Что помогает легче пережить магнитную бурю?",
        a: "Обычно советуют высыпаться, пить воду, снизить нагрузку и кофеин, бывать на свежем воздухе. При стойких или сильных симптомах стоит обратиться к врачу.",
      },
    ],
  },
  pl: {
    metaTitle: "Wpływ burz magnetycznych na samopoczucie — prawdziwe historie ludzi",
    metaDescription:
      "Jak ludzie czują się podczas burz magnetycznych: prawdziwe historie o bólu głowy, ciśnieniu, zmęczeniu i nastroju. Każda historia jest powiązana z oceną samopoczucia i indeksem Kp danego dnia.",
    homeLabel: "Magnitca",
    breadcrumbCurrent: "Samopoczucie",
    badge: "Historie samopoczucia",
    h1: "Wpływ burz magnetycznych na samopoczucie",
    seo: "Zebraliśmy tu prawdziwe historie ludzi o tym, jak czują się podczas burz magnetycznych: ból głowy, zmiany ciśnienia, zmęczenie, niepokój lub — przeciwnie — spokojne dni. Każda historia jest powiązana z oceną samopoczucia i indeksem Kp danego dnia, dzięki czemu można zobaczyć, jak różni ludzie przeżywają tę samą sytuację geomagnetyczną. To osobiste doświadczenia, a nie porada medyczna.",
    anonymous: "Anonim",
    relatedTitle: "Zobacz także",
    relatedKp: "Indeks Kp dzisiaj",
    relatedCalendar: "Kalendarz burz magnetycznych",
    faqTitle: "Najczęstsze pytania",
    faq: [
      {
        q: "Czy burze magnetyczne naprawdę wpływają na samopoczucie?",
        a: "Część osób zgłasza ból głowy, wahania ciśnienia, zmęczenie lub niepokój w dni zaburzeń geomagnetycznych. Dane naukowe są niejednoznaczne, więc te historie to osobiste doświadczenia, a nie porada medyczna.",
      },
      {
        q: "Jakie objawy są najczęściej wymieniane podczas burz magnetycznych?",
        a: "Najczęściej ból głowy i uczucie ucisku w skroniach, zmęczenie i senność, wahania ciśnienia krwi, rozdrażnienie, niepokój oraz zaburzenia snu.",
      },
      {
        q: "Jak indeks Kp wiąże się z samopoczuciem?",
        a: "Indeks Kp pokazuje siłę aktywności geomagnetycznej. Każda historia jest powiązana z indeksem Kp danego dnia, więc można porównać, jak różni ludzie czują się przy tym samym poziomie burzy.",
      },
      {
        q: "Co pomaga łatwiej przejść przez burzę magnetyczną?",
        a: "Zwykle zaleca się wysypianie, picie wody, ograniczenie wysiłku i kofeiny oraz przebywanie na świeżym powietrzu. Przy utrzymujących się lub silnych objawach warto zgłosić się do lekarza.",
      },
    ],
  },
  ro: {
    metaTitle: "Impactul furtunilor magnetice asupra stării de bine — povești reale",
    metaDescription:
      "Cum se simt oamenii în timpul furtunilor magnetice: povești reale despre dureri de cap, tensiune, oboseală și dispoziție. Fiecare poveste este legată de o evaluare a stării și de indicele Kp din acea zi.",
    homeLabel: "Magnitca",
    breadcrumbCurrent: "Starea de bine",
    badge: "Povești despre stare",
    h1: "Impactul furtunilor magnetice asupra stării de bine",
    seo: "Aici am adunat povești reale ale oamenilor despre cum se simt în timpul furtunilor magnetice: dureri de cap, schimbări de tensiune, oboseală, anxietate sau, dimpotrivă, zile liniștite. Fiecare poveste este legată de o evaluare a stării și de indicele Kp din acea zi, astfel încât poți vedea cum trăiesc diferiți oameni aceeași situație geomagnetică. Este o experiență personală, nu un sfat medical.",
    anonymous: "Anonim",
    relatedTitle: "Vezi și",
    relatedKp: "Indicele Kp azi",
    relatedCalendar: "Calendarul furtunilor magnetice",
    faqTitle: "Întrebări frecvente",
    faq: [
      {
        q: "Chiar influențează furtunile magnetice starea de bine?",
        a: "O parte dintre oameni raportează dureri de cap, variații de tensiune, oboseală sau anxietate în zilele cu perturbații geomagnetice. Datele științifice sunt neconcludente, așa că aceste povești sunt experiențe personale, nu sfaturi medicale.",
      },
      {
        q: "Ce simptome sunt cel mai des menționate în timpul furtunilor magnetice?",
        a: "Cel mai frecvent: dureri de cap și senzație de presiune în tâmple, oboseală și somnolență, variații ale tensiunii arteriale, iritabilitate, anxietate și tulburări de somn.",
      },
      {
        q: "Cum se leagă indicele Kp de starea de bine?",
        a: "Indicele Kp arată intensitatea activității geomagnetice. Fiecare poveste este legată de indicele Kp din acea zi, așa că poți compara cum se simt diferiți oameni la același nivel de furtună.",
      },
      {
        q: "Ce ajută să treci mai ușor peste o furtună magnetică?",
        a: "De obicei se recomandă somn suficient, hidratare, reducerea efortului și a cofeinei și timp petrecut în aer liber. La simptome persistente sau severe, consultă un medic.",
      },
    ],
  },
  hu: {
    metaTitle: "A mágneses viharok hatása a közérzetre — valódi emberi történetek",
    metaDescription:
      "Hogyan érzik magukat az emberek mágneses viharok idején: valódi történetek fejfájásról, vérnyomásról, fáradtságról és hangulatról. Minden történet az adott nap közérzet-értékeléséhez és Kp-indexéhez kapcsolódik.",
    homeLabel: "Magnitca",
    breadcrumbCurrent: "Közérzet",
    badge: "Közérzet történetek",
    h1: "A mágneses viharok hatása a közérzetre",
    seo: "Itt valódi emberi történeteket gyűjtöttünk össze arról, hogyan érzik magukat a mágneses viharok idején: fejfájás, vérnyomás-változások, fáradtság, szorongás vagy éppen nyugodt napok. Minden történet az adott nap közérzet-értékeléséhez és Kp-indexéhez kapcsolódik, így láthatod, hogyan élik meg különböző emberek ugyanazt a geomágneses helyzetet. Ez személyes tapasztalat, nem orvosi tanács.",
    anonymous: "Névtelen",
    relatedTitle: "Lásd még",
    relatedKp: "Kp-index ma",
    relatedCalendar: "Mágneses viharok naptára",
    faqTitle: "Gyakori kérdések",
    faq: [
      {
        q: "Valóban hatnak a mágneses viharok a közérzetre?",
        a: "Egyesek fejfájásról, vérnyomás-ingadozásról, fáradtságról vagy szorongásról számolnak be a geomágneses zavarok napjain. A tudományos adatok nem egyértelműek, ezért ezek a történetek személyes tapasztalatok, nem orvosi tanácsok.",
      },
      {
        q: "Milyen tüneteket említenek a leggyakrabban mágneses viharok idején?",
        a: "Leggyakrabban fejfájást és nyomásérzést a halántékban, fáradtságot és álmosságot, vérnyomás-ingadozást, ingerlékenységet, szorongást és alvászavart.",
      },
      {
        q: "Hogyan függ össze a Kp-index a közérzettel?",
        a: "A Kp-index a geomágneses aktivitás erősségét mutatja. Minden történet az adott nap Kp-indexéhez kapcsolódik, így összevethető, hogyan érzik magukat különböző emberek azonos viharszintnél.",
      },
      {
        q: "Mi segít könnyebben átvészelni egy mágneses vihart?",
        a: "Általában elegendő alvás, sok folyadék, a terhelés és a koffein csökkentése, valamint friss levegő ajánlott. Tartós vagy erős tünetek esetén fordulj orvoshoz.",
      },
    ],
  },
  en: {
    metaTitle: "How magnetic storms affect wellbeing — real people's stories",
    metaDescription:
      "How people feel during magnetic storms: real stories about headaches, blood pressure, fatigue and mood. Each story is tied to a wellbeing rating and the Kp index of that day.",
    homeLabel: "Magnitca",
    breadcrumbCurrent: "Wellbeing",
    badge: "Wellbeing stories",
    h1: "How magnetic storms affect wellbeing",
    seo: "Here we've collected real people's stories about how they feel during magnetic storms: headaches, blood-pressure changes, fatigue, anxiety or, on the contrary, calm days. Each story is tied to a wellbeing rating and the Kp index of that day, so you can see how different people experience the same geomagnetic conditions. This is personal experience, not medical advice.",
    anonymous: "Anonymous",
    relatedTitle: "See also",
    relatedKp: "Kp index today",
    relatedCalendar: "Magnetic storm calendar",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "Do magnetic storms really affect wellbeing?",
        a: "Some people report headaches, blood-pressure swings, fatigue or anxiety on days with geomagnetic disturbances. The scientific evidence is mixed, so these stories are personal experience, not medical advice.",
      },
      {
        q: "Which symptoms are mentioned most often during magnetic storms?",
        a: "Most commonly headaches and a feeling of pressure in the temples, fatigue and drowsiness, blood-pressure swings, irritability, anxiety and disrupted sleep.",
      },
      {
        q: "How is the Kp index related to wellbeing?",
        a: "The Kp index shows the strength of geomagnetic activity. Each story in the feed is tied to that day's Kp index, so you can compare how different people feel at the same storm level.",
      },
      {
        q: "What helps you get through a magnetic storm more easily?",
        a: "Common advice is to get enough sleep, stay hydrated, cut down on strain and caffeine, and spend time outdoors. If symptoms are persistent or severe, see a doctor.",
      },
    ],
  },
};

function pageUrl(locale: SiteLocale) {
  return `https://magnitca.com${LOCALE_PREFIX[locale]}/${SLUG}`;
}

export function buildSamopochuttyaMetadata(locale: SiteLocale): Metadata {
  const copy = COPY[locale];
  const url = pageUrl(locale);
  const languages: Record<string, string> = {};
  (Object.keys(LOCALE_PREFIX) as SiteLocale[]).forEach((l) => {
    languages[l] = pageUrl(l);
  });
  languages["x-default"] = pageUrl("uk");

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      title: copy.metaTitle,
      description: copy.metaDescription,
      url,
      siteName: "Magnitca",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metaTitle,
      description: copy.metaDescription,
      images: ["/og-image.png"],
    },
  };
}

export default async function SamopochuttyaPage({ locale }: { locale: SiteLocale }) {
  const forecast = await getUkraineAuroraForecast();
  const kpNow = forecast.currentKp;
  const copy = COPY[locale];
  const homePath = LOCALE_PREFIX[locale] || "/";
  const prefix = LOCALE_PREFIX[locale];

  // Server-render the first page of reviews so the core content is crawlable and
  // available for structured data; the feed hydrates without re-fetching page one.
  let initialNotes: StormNote[] = [];
  let initialHasMore = false;
  let initialNextOffset = 0;
  try {
    const first = await fetchApprovedNotes({ days: 30, limit: FEED_PAGE_SIZE, priorityLocale: locale });
    initialNotes = first.notes;
    initialHasMore = first.hasMore;
    initialNextOffset = first.nextOffset;
  } catch {
    // Fall back to the client-side fetch inside the feed if the read fails.
  }

  return (
    <main className="official-page-main">
      <FeelingJsonLd
        pageUrl={pageUrl(locale)}
        homeUrl={`https://magnitca.com${prefix}`}
        homeLabel={copy.homeLabel}
        breadcrumbCurrent={copy.breadcrumbCurrent}
        headline={copy.h1}
        description={copy.metaDescription}
        anonymousName={copy.anonymous}
        notes={initialNotes}
        faq={copy.faq}
      />
      <div className="official-page-shell space-y-8">
        <header className="official-page-header space-y-3">
          <nav className="official-page-breadcrumb text-sm" aria-label="Breadcrumb">
            <a href={homePath} className="text-primary hover:text-primary/80">
              {copy.homeLabel}
            </a>
            <span>/</span>
            <span>{copy.breadcrumbCurrent}</span>
          </nav>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <HeartPulse className="h-4 w-4" />
              {copy.badge}
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
              {copy.h1}
            </h1>
          </div>
        </header>

        <section className="md:hidden">
          <MobileAdsenseSlot />
        </section>

        <section>
          <StormNotesFeed
            locale={locale}
            initialNotes={initialNotes}
            initialHasMore={initialHasMore}
            initialNextOffset={initialNextOffset}
          />
        </section>

        <section>
          <StormNoteComposer locale={locale} kpNow={kpNow} />
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">{copy.faqTitle}</h2>
          <div className="max-w-3xl divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/50 bg-card">
            {copy.faq.map((item) => (
              <details key={item.q} className="group px-4 py-3">
                <summary className="cursor-pointer list-none text-base font-semibold text-foreground marker:hidden">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="max-w-3xl text-base font-medium leading-7 text-muted-foreground">{copy.seo}</p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{copy.relatedTitle}:</span>
            <a href={`${prefix}/kp-index`} className="text-primary hover:underline">
              {copy.relatedKp}
            </a>
            <span aria-hidden>·</span>
            <a href={`${prefix}/calendar`} className="text-primary hover:underline">
              {copy.relatedCalendar}
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
