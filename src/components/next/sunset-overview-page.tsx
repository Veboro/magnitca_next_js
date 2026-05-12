import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, HelpCircle, MoonStar, Sunrise, Sunset, TimerReset } from "lucide-react";
import { MobileAdsenseSlot } from "@/components/next/mobile-adsense-slot";
import { getLocalizedCity, getRuCitySlug } from "@/data/cities-ru";
import type { SunriseOverviewCity } from "@/lib/sunrise-overview";
import { absoluteUrl } from "@/lib/site";

type SunsetOverviewPageProps = {
  locale?: "uk" | "ru";
  mode?: "today" | "tomorrow";
  dateLabel: string;
  cities: SunriseOverviewCity[];
  earliestSunset: SunriseOverviewCity | null;
  latestSunset: SunriseOverviewCity | null;
};

export function SunsetOverviewPage({
  locale = "uk",
  mode = "today",
  dateLabel,
  cities,
  earliestSunset,
  latestSunset,
}: SunsetOverviewPageProps) {
  const sunsetTodayHref = locale === "ru" ? "/ru/sunset" : "/sunset";
  const sunsetTomorrowHref = locale === "ru" ? "/ru/sunset-tomorrow" : "/sunset-tomorrow";
  const sunriseTodayHref = locale === "ru" ? "/ru/sunrise" : "/sunrise";
  const sunriseTomorrowHref = locale === "ru" ? "/ru/sunrise-tomorrow" : "/sunrise-tomorrow";
  const currentPath = mode === "tomorrow" ? sunsetTomorrowHref : sunsetTodayHref;
  const t = locale === "ru"
    ? {
        home: "Главная",
        h1: mode === "tomorrow" ? "Закат солнца в Украине завтра" : "Закат солнца в Украине сегодня",
        intro:
          "Точное время заката и восхода солнца в Киеве и других городах Украины на",
        introTail:
          ". Ниже собраны актуальные данные по городам, а также разница между самым ранним и самым поздним закатом солнца.",
        earliest: "Самый ранний закат",
        latest: "Самый поздний закат",
        avgNight: "Средняя продолжительность ночи",
        avgNightSub: "По городам Украины на сегодня",
        unknown: "Данные уточняются",
        tableTitle: "Закат солнца и ночь по городам Украины",
        city: "Город",
        dawn: "Рассвет",
        sunrise: "Восход солнца",
        sunset: "Закат солнца",
        dusk: "Сумерки",
        nightLength: "Продолжительность ночи",
        faq: "Частые вопросы",
        todayLink: "Закат солнца сегодня",
        tomorrowLink: "Закат солнца завтра",
        seoTitle: "Как меняется закат солнца и ночь в Украине",
        seoBody:
          "Время заката солнца в городах Украины отличается в зависимости от региона и сезона. На этой странице собраны актуальные данные по городам, чтобы можно было быстро сравнить вечерние сумерки, продолжительность ночи и время следующего рассвета.",
        seoLinksIntro: "Также полезно посмотреть",
        seoLinks: [
          { href: mode === "tomorrow" ? sunsetTodayHref : sunsetTomorrowHref, label: mode === "tomorrow" ? "закат солнца сегодня" : "закат солнца завтра" },
          { href: sunriseTodayHref, label: "восход солнца сегодня" },
          { href: sunriseTomorrowHref, label: "восход солнца завтра" },
        ],
        faqItems: [
          {
            q: mode === "tomorrow" ? "Во сколько завтра закат солнца в Украине?" : "Во сколько сегодня закат солнца в Украине?",
            a: `Время заката зависит от конкретного города. На этой странице собраны актуальные значения по Украине на ${dateLabel}, а в таблице выше можно посмотреть точное время заката для каждого доступного города.`,
          },
          {
            q: mode === "tomorrow"
              ? "Где в Украине завтра самый ранний и самый поздний закат солнца?"
              : "Где в Украине сегодня самый ранний и самый поздний закат солнца?",
            a: `${mode === "tomorrow" ? "Завтра" : "Сегодня"} самый ранний закат солнца — в ${earliestSunset ? getLocalizedCity(earliestSunset.city, "ru").name : "одном из городов Украины"} в ${earliestSunset?.sunsetLabel ?? "—"}, а самый поздний — в ${latestSunset ? getLocalizedCity(latestSunset.city, "ru").name : "другом городе Украины"} в ${latestSunset?.sunsetLabel ?? "—"}. Это показывает разницу между востоком и западом страны.`,
          },
          {
            q: "Что означают рассвет, зенит и сумерки в таблице?",
            a: "Рассвет — это начало утреннего освещения до появления солнца над горизонтом. Зенит показывает момент, когда солнце проходит самую высокую точку над горизонтом. Сумерки — это время после заката, когда естественный свет еще сохраняется.",
          },
          {
            q: mode === "tomorrow"
              ? "Какая средняя продолжительность ночи по городам Украины завтра?"
              : "Какая средняя продолжительность ночи по городам Украины сегодня?",
            a: `Средняя продолжительность ночи по городам Украины ${mode === "tomorrow" ? "завтра" : "сегодня"} составляет около ${formatNightLength(cities.length ? Math.round(cities.reduce((sum, item) => sum + item.dayLengthMinutes, 0) / cities.length) : 0)}. В отдельных городах она немного отличается в зависимости от географического положения.`,
          },
          {
            q: "Где посмотреть закат солнца для конкретного города?",
            a: "В списке выше названия городов являются ссылками. Нажмите на нужный город, чтобы открыть его отдельную страницу с детальными данными о восходе, закате солнца и продолжительности дня.",
          },
        ],
      }
    : {
        home: "Головна",
        h1: mode === "tomorrow" ? "Захід сонця в Україні завтра" : "Захід сонця в Україні сьогодні",
        intro:
          "Точний час заходу і сходу сонця в Києві та інших містах України на",
        introTail:
          ". Нижче зібрані актуальні дані по містах, а також різниця між найранішим і найпізнішим заходом сонця.",
        earliest: "Найраніший захід",
        latest: "Найпізніший захід",
        avgNight: "Середня тривалість ночі",
        avgNightSub: "По містах України на сьогодні",
        unknown: "Дані уточнюються",
        tableTitle: "Захід сонця і ніч по містах України",
        city: "Місто",
        dawn: "Світанок",
        sunrise: "Схід сонця",
        sunset: "Захід сонця",
        dusk: "Сутінки",
        nightLength: "Тривалість ночі",
        faq: "Часті запитання",
        todayLink: "Захід сонця сьогодні",
        tomorrowLink: "Захід сонця завтра",
        seoTitle: "Як змінюється захід сонця і ніч в Україні",
        seoBody:
          "Час заходу сонця в містах України відрізняється залежно від регіону та сезону. На цій сторінці зібрані актуальні дані по містах, щоб можна було швидко порівняти вечірні сутінки, тривалість ночі та час наступного світанку.",
        seoLinksIntro: "Також варто подивитися",
        seoLinks: [
          { href: mode === "tomorrow" ? sunsetTodayHref : sunsetTomorrowHref, label: mode === "tomorrow" ? "захід сонця сьогодні" : "захід сонця завтра" },
          { href: sunriseTodayHref, label: "схід сонця сьогодні" },
          { href: sunriseTomorrowHref, label: "схід сонця завтра" },
        ],
        faqItems: [
          {
            q: mode === "tomorrow" ? "О котрій завтра захід сонця в Україні?" : "О котрій сьогодні захід сонця в Україні?",
            a: `Час заходу сонця залежить від міста. На цій сторінці зібрані актуальні значення по Україні на ${dateLabel}, а в таблиці вище можна подивитися точний час заходу для кожного доступного міста.`,
          },
          {
            q: mode === "tomorrow"
              ? "Де в Україні завтра найраніший і найпізніший захід сонця?"
              : "Де в Україні сьогодні найраніший і найпізніший захід сонця?",
            a: `${mode === "tomorrow" ? "Завтра" : "Сьогодні"} найраніший захід сонця — о ${earliestSunset?.sunsetLabel ?? "—"} у ${earliestSunset?.city.name ?? "одному з міст України"}, а найпізніший — о ${latestSunset?.sunsetLabel ?? "—"} в ${latestSunset?.city.name ?? "іншому місті України"}. Це добре показує, як змінюється час заходу між сходом і заходом країни.`,
          },
          {
            q: "Що означають світанок, зеніт і сутінки в таблиці?",
            a: "Світанок — це початок ранкового освітлення до появи сонця над горизонтом. Зеніт показує момент, коли сонце проходить найвищу точку над горизонтом. Сутінки — це період після заходу сонця, коли природне світло ще зберігається.",
          },
          {
            q: mode === "tomorrow"
              ? "Яка середня тривалість ночі по містах України завтра?"
              : "Яка середня тривалість ночі по містах України сьогодні?",
            a: `Середня тривалість ночі по містах України ${mode === "tomorrow" ? "на завтра" : "на сьогодні"} становить близько ${formatNightLength(cities.length ? Math.round(cities.reduce((sum, item) => sum + item.dayLengthMinutes, 0) / cities.length) : 0)}. Для окремих міст цей показник трохи відрізняється залежно від географічного положення.`,
          },
          {
            q: "Де подивитися захід сонця для конкретного міста?",
            a: "У списку вище самі назви міст є посиланнями. Натисніть на потрібне місто, щоб відкрити його окрему сторінку з детальними даними про схід, захід сонця та тривалість дня.",
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

  function formatNightLength(minutes: number) {
    const nightMinutes = Math.max(0, 24 * 60 - minutes);
    const h = Math.floor(nightMinutes / 60);
    const m = nightMinutes % 60;
    return locale === "ru" ? `${h} ч ${m} мин` : `${h}год ${m}хв`;
  }

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

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header className="space-y-3">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
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
            href={sunsetTodayHref}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              mode === "today"
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.todayLink}
          </Link>
          <Link
            href={sunsetTomorrowHref}
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
            <Sunset className="h-4 w-4 text-primary" />
            {t.earliest}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{earliestSunset?.sunsetLabel ?? "—"}</p>
            <p className="text-sm text-muted-foreground">
              {earliestSunset ? getLocalizedCity(earliestSunset.city, locale).name : t.unknown}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Sunset className="h-4 w-4 text-primary" />
            {t.latest}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">{latestSunset?.sunsetLabel ?? "—"}</p>
            <p className="text-sm text-muted-foreground">
              {latestSunset ? getLocalizedCity(latestSunset.city, locale).name : t.unknown}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <TimerReset className="h-4 w-4 text-primary" />
            {t.avgNight}
          </div>
          <div className="mt-4 space-y-1">
            <p className="font-display text-3xl font-bold text-foreground">
              {formatNightLength(cities.length ? Math.round(cities.reduce((sum, item) => sum + item.dayLengthMinutes, 0) / cities.length) : 0)}
            </p>
            <p className="text-sm text-muted-foreground">{t.avgNightSub}</p>
          </div>
        </div>
      </section>

      <MobileAdsenseSlot />

      <section className="rounded-2xl border border-border/50 bg-card p-6">
        <div className="mb-5 flex items-center gap-2">
          <Sunset className="h-4 w-4 text-primary" />
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
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t.sunset}</p>
                  <div className="mt-2">
                    <TimeCell icon={<Sunset className="h-3.5 w-3.5" />} value={item.sunsetLabel} iconClassName="text-orange-300" />
                  </div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t.dusk}</p>
                  <div className="mt-2">
                    <TimeCell icon={<Sunset className="h-3.5 w-3.5" />} value={item.duskLabel} iconClassName="text-violet-300" />
                  </div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t.nightLength}</p>
                  <div className="mt-2">
                    <TimeCell icon={<MoonStar className="h-3.5 w-3.5" />} value={formatNightLength(item.dayLengthMinutes)} iconClassName="text-sky-300" />
                  </div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t.dawn}</p>
                  <div className="mt-2">
                    <TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.dawnLabel} iconClassName="text-amber-300" />
                  </div>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t.sunrise}</p>
                  <div className="mt-2">
                    <TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.sunriseLabel} iconClassName="text-cyan-300" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-border/40 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-4 py-3 font-medium">{t.city}</th>
                <th className="px-4 py-3 font-medium">{t.sunset}</th>
                <th className="px-4 py-3 font-medium">{t.dusk}</th>
                <th className="px-4 py-3 font-medium">{t.nightLength}</th>
                <th className="px-4 py-3 font-medium">{t.dawn}</th>
                <th className="px-4 py-3 font-medium">{t.sunrise}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {cities.map((item) => (
                <tr key={item.city.slug} className="align-top text-muted-foreground">
                  <td className="px-4 py-4">
                    <Link
                      href={locale === "ru" ? `/ru/city/${getRuCitySlug(item.city)}` : `/city/${item.city.slug}`}
                      className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {getLocalizedCity(item.city, locale).name}
                      <ArrowUpRight className="h-3.5 w-3.5 text-primary/80" />
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <TimeCell icon={<Sunset className="h-3.5 w-3.5" />} value={item.sunsetLabel} iconClassName="text-orange-300" />
                  </td>
                  <td className="px-4 py-4">
                    <TimeCell icon={<Sunset className="h-3.5 w-3.5" />} value={item.duskLabel} iconClassName="text-violet-300" />
                  </td>
                  <td className="px-4 py-4">
                    <TimeCell icon={<MoonStar className="h-3.5 w-3.5" />} value={formatNightLength(item.dayLengthMinutes)} iconClassName="text-sky-300" />
                  </td>
                  <td className="px-4 py-4">
                    <TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.dawnLabel} iconClassName="text-amber-300" />
                  </td>
                  <td className="px-4 py-4">
                    <TimeCell icon={<Sunrise className="h-3.5 w-3.5" />} value={item.sunriseLabel} iconClassName="text-cyan-300" />
                  </td>
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

      <section className="rounded-2xl border border-border/50 bg-card p-6">
        <div className="mb-5 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t.faq}</h2>
        </div>
        <div className="space-y-3">
          {t.faqItems.map((item) => (
            <details key={item.q} className="group rounded-xl border border-border/40 bg-background/40 px-4 py-3">
              <summary className="cursor-pointer list-none font-medium text-foreground marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-90" />
                </span>
              </summary>
              <p className="pt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
