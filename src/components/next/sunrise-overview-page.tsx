import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, HelpCircle, Sunrise, Sunset, SunMedium, TimerReset } from "lucide-react";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import { getLocalizedCity, getRuCitySlug } from "@/data/cities-ru";
import type { SunriseOverviewCity } from "@/lib/sunrise-overview";
import { absoluteUrl } from "@/lib/site";

type SunriseOverviewPageProps = {
  locale?: "uk" | "ru";
  mode?: "today" | "tomorrow";
  dateLabel: string;
  cities: SunriseOverviewCity[];
  earliestSunrise: SunriseOverviewCity | null;
  latestSunrise: SunriseOverviewCity | null;
  averageDayLengthLabel: string;
};

export function SunriseOverviewPage({
  locale = "uk",
  mode = "today",
  dateLabel,
  cities,
  earliestSunrise,
  latestSunrise,
  averageDayLengthLabel,
}: SunriseOverviewPageProps) {
  const sunriseTodayHref = locale === "ru" ? "/ru/sunrise" : "/sunrise";
  const sunriseTomorrowHref = locale === "ru" ? "/ru/sunrise-tomorrow" : "/sunrise-tomorrow";
  const sunsetTodayHref = locale === "ru" ? "/ru/sunset" : "/sunset";
  const sunsetTomorrowHref = locale === "ru" ? "/ru/sunset-tomorrow" : "/sunset-tomorrow";
  const currentPath = mode === "tomorrow" ? sunriseTomorrowHref : sunriseTodayHref;

  const t = locale === "ru"
    ? {
        home: "Главная",
        h1: mode === "tomorrow" ? "Восход солнца в Украине завтра" : "Восход солнца в Украине сегодня",
        intro:
          "Точное время восхода и захода солнца в Киеве и других городах Украины на",
        introTail:
          ". Ниже собраны актуальные данные по популярным городам, а также разница между самым ранним и самым поздним восходом солнца.",
        earliest: "Самый ранний восход",
        latest: "Самый поздний восход",
        avgDay: "Средняя продолжительность дня",
        avgDaySub: "По городам Украины на сегодня",
        unknown: "Данные уточняются",
        tableTitle: "Восход и закат солнца по городам Украины",
        city: "Город",
        dawn: "Рассвет",
        sunrise: "Восход солнца",
        zenith: "Зенит",
        sunset: "Закат солнца",
        dusk: "Сумерки",
        dayLength: "Продолжительность дня",
        faq: "Частые вопросы",
        todayLink: "Восход солнца сегодня",
        tomorrowLink: "Восход солнца завтра",
        seoTitle: "Как меняется восход солнца в Украине",
        seoBody:
          "Время восхода солнца в городах Украины отличается в зависимости от региона, даты и географического положения. На этой странице собраны актуальные данные по крупным городам, чтобы можно было быстро сравнить время рассвета, восхода, заката и продолжительность дня.",
        seoLinksIntro: "Также полезно посмотреть",
        seoLinks: [
          { href: mode === "tomorrow" ? sunriseTodayHref : sunriseTomorrowHref, label: mode === "tomorrow" ? "восход солнца сегодня" : "восход солнца завтра" },
          { href: sunsetTodayHref, label: "закат солнца сегодня" },
          { href: sunsetTomorrowHref, label: "закат солнца завтра" },
        ],
        faqItems: [
          {
            q: mode === "tomorrow" ? "Во сколько завтра восходит солнце в Украине?" : "Во сколько сегодня восходит солнце в Украине?",
            a: `Время восхода солнца зависит от города. На этой странице собраны актуальные значения по Украине на ${dateLabel}, а в таблице выше можно посмотреть точное время для каждого доступного города отдельно.`,
          },
          {
            q: mode === "tomorrow"
              ? "Где в Украине завтра самый ранний и самый поздний восход солнца?"
              : "Где в Украине сегодня самый ранний и самый поздний восход солнца?",
            a: `${mode === "tomorrow" ? "Завтра" : "Сегодня"} самый ранний восход солнца — в ${earliestSunrise ? getLocalizedCity(earliestSunrise.city, "ru").name : "одном из городов Украины"} в ${earliestSunrise?.sunriseLabel ?? "—"}, а самый поздний — в ${latestSunrise ? getLocalizedCity(latestSunrise.city, "ru").name : "другом городе Украины"} в ${latestSunrise?.sunriseLabel ?? "—"}. Это наглядно показывает разницу между востоком и западом страны.`,
          },
          {
            q: "Что означают рассвет, зенит и сумерки в таблице?",
            a: "Рассвет — это начало утреннего освещения до появления солнца над горизонтом. Зенит показывает момент, когда солнце проходит самую высокую точку над горизонтом в течение дня. Сумерки — это вечерний период после заката, когда естественный свет еще сохраняется.",
          },
          {
            q: "Какая средняя продолжительность дня по городам Украины сегодня?",
            a: `Средняя продолжительность дня по городам Украины на сегодня составляет около ${averageDayLengthLabel}. Для отдельных городов этот показатель немного отличается в зависимости от географического положения.`,
          },
          {
            q: "Где посмотреть восход и закат солнца для конкретного города?",
            a: "В списке выше сами названия городов являются ссылками. Нажмите на нужный город, чтобы открыть его отдельную страницу с подробными данными о восходе и заходе солнца, продолжительности дня и другими локальными показателями.",
          },
        ],
      }
    : {
        home: "Головна",
        h1: mode === "tomorrow" ? "Схід сонця в Україні завтра" : "Схід сонця в Україні сьогодні",
        intro:
          "Точний час сходу і заходу сонця в Києві та інших містах України на",
        introTail:
          ". Нижче зібрані актуальні дані по популярних містах, а також різниця між найранішим і найпізнішим сходом сонця.",
        earliest: "Найраніший схід",
        latest: "Найпізніший схід",
        avgDay: "Середня тривалість дня",
        avgDaySub: "По містах України на сьогодні",
        unknown: "Дані уточнюються",
        tableTitle: "Схід і захід сонця по містах України",
        city: "Місто",
        dawn: "Світанок",
        sunrise: "Схід сонця",
        zenith: "Зеніт",
        sunset: "Захід сонця",
        dusk: "Сутінки",
        dayLength: "Тривалість дня",
        faq: "Часті запитання",
        todayLink: "Схід сонця сьогодні",
        tomorrowLink: "Схід сонця завтра",
        seoTitle: "Як змінюється схід сонця в Україні",
        seoBody:
          "Час сходу сонця в містах України відрізняється залежно від регіону, дати та географічного положення. На цій сторінці зібрані актуальні дані по великих містах, щоб можна було швидко порівняти час світанку, сходу, заходу сонця і тривалість дня.",
        seoLinksIntro: "Також варто подивитися",
        seoLinks: [
          { href: mode === "tomorrow" ? sunriseTodayHref : sunriseTomorrowHref, label: mode === "tomorrow" ? "схід сонця сьогодні" : "схід сонця завтра" },
          { href: sunsetTodayHref, label: "захід сонця сьогодні" },
          { href: sunsetTomorrowHref, label: "захід сонця завтра" },
        ],
        faqItems: [
          {
            q: mode === "tomorrow" ? "О котрій завтра сходить сонце в Україні?" : "О котрій сьогодні сходить сонце в Україні?",
            a: `Час сходу сонця залежить від міста. На цій сторінці зібрані актуальні значення по Україні на ${dateLabel}, а в таблиці вище можна подивитися точний час для кожного доступного міста окремо.`,
          },
          {
            q: mode === "tomorrow"
              ? "Де в Україні завтра найраніший і найпізніший схід сонця?"
              : "Де в Україні сьогодні найраніший і найпізніший схід сонця?",
            a: `${mode === "tomorrow" ? "Завтра" : "Сьогодні"} найраніший схід сонця — о ${earliestSunrise?.sunriseLabel ?? "—"} у ${earliestSunrise?.city.name ?? "одному з міст України"}, а найпізніший — о ${latestSunrise?.sunriseLabel ?? "—"} в ${latestSunrise?.city.name ?? "іншому місті України"}. Це добре показує, як відрізняється час сходу між сходом і заходом країни.`,
          },
          {
            q: "Що означають світанок, зеніт і сутінки в таблиці?",
            a: "Світанок — це початок ранкового освітлення до появи сонця над горизонтом. Зеніт показує момент, коли сонце проходить найвищу точку над горизонтом протягом дня. Сутінки — це вечірній період після заходу сонця, коли природне світло ще зберігається.",
          },
          {
            q: "Яка середня тривалість дня по містах України сьогодні?",
            a: `Середня тривалість дня по містах України на сьогодні становить близько ${averageDayLengthLabel}. Для окремих міст цей показник трохи відрізняється залежно від географічного положення.`,
          },
          {
            q: "Де подивитися схід і захід сонця для конкретного міста?",
            a: "У списку вище самі назви міст є посиланнями. Натисніть на потрібне місто, щоб відкрити його окрему сторінку з детальними даними про схід і захід сонця, тривалість дня та іншими локальними показниками.",
          },
        ],
      };

  const TimeCell = ({
    icon,
    value,
    iconClassName,
  }: {
    icon: ReactNode;
    value: string;
    iconClassName?: string;
  }) => (
    <span className="inline-flex items-center gap-2 font-mono text-foreground">
      <span className={iconClassName}>{icon}</span>
      <span>{value}</span>
    </span>
  );

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
        item: absoluteUrl(locale === "ru" ? "/ru" : "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.h1,
        item: absoluteUrl(currentPath),
      },
    ],
  };

  return (
    <main className="official-page-main">
      <div className="official-page-shell space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header className="official-page-header space-y-3">
        <nav className="official-page-breadcrumb text-sm" aria-label="Breadcrumb">
          <Link href={locale === "ru" ? "/ru" : "/"} className="transition-colors hover:text-foreground">
            {t.home}
          </Link>
          <span>/</span>
          <span className="text-foreground">{t.h1}</span>
        </nav>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{t.h1}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t.intro} {dateLabel}
          {t.introTail}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href={sunriseTodayHref}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              mode === "today"
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.todayLink}
          </Link>
          <Link
            href={sunriseTomorrowHref}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              mode === "tomorrow"
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.tomorrowLink}
          </Link>
        </div>
      </header>

      <MobileAdsenseSlot />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Sunrise className="h-4 w-4 text-primary" />
            {t.earliest}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{earliestSunrise?.sunriseLabel ?? "—"}</p>
            <p className="text-sm text-muted-foreground">
              {earliestSunrise ? getLocalizedCity(earliestSunrise.city, locale).name : t.unknown}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Sunset className="h-4 w-4 text-primary" />
            {t.latest}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{latestSunrise?.sunriseLabel ?? "—"}</p>
            <p className="text-sm text-muted-foreground">
              {latestSunrise ? getLocalizedCity(latestSunrise.city, locale).name : t.unknown}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <TimerReset className="h-4 w-4 text-primary" />
            {t.avgDay}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{averageDayLengthLabel}</p>
            <p className="text-sm text-muted-foreground">{t.avgDaySub}</p>
          </div>
        </div>
      </section>

      <MobileAdsenseSlot />

      <section className="rounded-2xl border border-border/50 bg-card p-6">
        <div className="mb-5 flex items-center gap-2">
          <Sunrise className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t.tableTitle}
          </h2>
        </div>
        <div className="grid gap-4 md:hidden">
          {cities.map((item) => (
            <article
              key={item.city.slug}
              className="rounded-xl border border-border/40 bg-background/40 p-4"
            >
              <Link
                href={locale === "ru" ? `/ru/city/${getRuCitySlug(item.city)}` : `/city/${item.city.slug}`}
                className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
              >
                {getLocalizedCity(item.city, locale).name}
                <ArrowUpRight className="h-3.5 w-3.5 text-primary/80" />
              </Link>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t.dawn}</p>
                  <div className="mt-2">
                    <TimeCell
                      icon={<Sunrise className="h-3.5 w-3.5" />}
                      value={item.dawnLabel}
                      iconClassName="text-amber-300"
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t.sunrise}</p>
                  <div className="mt-2">
                    <TimeCell
                      icon={<Sunrise className="h-3.5 w-3.5" />}
                      value={item.sunriseLabel}
                      iconClassName="text-primary"
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t.zenith}</p>
                  <div className="mt-2">
                    <TimeCell
                      icon={<SunMedium className="h-3.5 w-3.5" />}
                      value={item.solarNoonLabel}
                      iconClassName="text-yellow-400"
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t.sunset}</p>
                  <div className="mt-2">
                    <TimeCell
                      icon={<Sunset className="h-3.5 w-3.5" />}
                      value={item.sunsetLabel}
                      iconClassName="text-orange-400"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t.dusk}</p>
                  <div className="mt-2">
                    <TimeCell
                      icon={<Sunset className="h-3.5 w-3.5" />}
                      value={item.duskLabel}
                      iconClassName="text-indigo-300"
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t.dayLength}</p>
                  <p className="mt-2 font-mono text-foreground">{item.dayLength}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-[920px] w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-3 py-3">{t.city}</th>
                <th className="px-3 py-3">{t.dawn}</th>
                <th className="px-3 py-3">{t.sunrise}</th>
                <th className="px-3 py-3">{t.zenith}</th>
                <th className="px-3 py-3">{t.sunset}</th>
                <th className="px-3 py-3">{t.dusk}</th>
                <th className="px-3 py-3">{t.dayLength}</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((item) => (
                <tr key={item.city.slug} className="border-b border-border/20 last:border-0">
                  <td className="px-3 py-3">
                    <Link
                      href={locale === "ru" ? `/ru/city/${getRuCitySlug(item.city)}` : `/city/${item.city.slug}`}
                      className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {getLocalizedCity(item.city, locale).name}
                      <ArrowUpRight className="h-3.5 w-3.5 text-primary/80" />
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <TimeCell
                      icon={<Sunrise className="h-3.5 w-3.5" />}
                      value={item.dawnLabel}
                      iconClassName="text-amber-300"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <TimeCell
                      icon={<Sunrise className="h-3.5 w-3.5" />}
                      value={item.sunriseLabel}
                      iconClassName="text-primary"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <TimeCell
                      icon={<SunMedium className="h-3.5 w-3.5" />}
                      value={item.solarNoonLabel}
                      iconClassName="text-yellow-400"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <TimeCell
                      icon={<Sunset className="h-3.5 w-3.5" />}
                      value={item.sunsetLabel}
                      iconClassName="text-orange-400"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <TimeCell
                      icon={<Sunset className="h-3.5 w-3.5" />}
                      value={item.duskLabel}
                      iconClassName="text-indigo-300"
                    />
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{item.dayLength}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">{t.seoTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{t.seoBody}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          {t.seoLinksIntro}:{" "}
          {t.seoLinks.map((item, index) => (
            <span key={item.href}>
              <Link href={item.href} className="text-primary transition-colors hover:text-primary/80 hover:underline">
                {item.label}
              </Link>
              {index < t.seoLinks.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </section>

      <section className="rounded-2xl border border-border/50 bg-card p-6" aria-label="Часті запитання">
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
      </div>
    </main>
  );
}
