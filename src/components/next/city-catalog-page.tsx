import Link from "next/link";
import { ALL_UK_CITIES } from "@/data/cities";
import { CITIES_RU, getLocalizedCity, getRuCitySlug } from "@/data/cities-ru";
import { UKRAINE_REGION_GROUPS } from "@/data/ukraine-city-catalog";

type CatalogLocale = "uk" | "ru";

const copy = {
  uk: {
    eyebrow: "Географія",
    title: "Магнітні бурі по містах України",
    allCities: "Усі населені пункти за областями",
    cityLink: "магнітні бурі",
    alphabet: "Алфавітний покажчик областей",
    alphabetHint: "Натисніть літеру, щоб перейти до потрібної області.",
  },
  ru: {
    eyebrow: "География",
    title: "Магнитные бури по городам Украины",
    allCities: "Все населённые пункты по областям",
    cityLink: "магнитные бури",
    alphabet: "Алфавитный указатель областей",
    alphabetHint: "Нажмите букву, чтобы перейти к нужной области.",
  },
} as const;

function getRegionTitle(region: (typeof UKRAINE_REGION_GROUPS)[number], locale: CatalogLocale) {
  return locale === "ru" ? region.titleRu : region.titleUk;
}

function getRegionAnchor(region: (typeof UKRAINE_REGION_GROUPS)[number]) {
  return `region-${region.key}`;
}

export function CityCatalogPage({ locale }: { locale: CatalogLocale }) {
  const t = copy[locale];
  const cityMap = new Map(ALL_UK_CITIES.map((city) => [city.slug, city]));
  const seen = new Set<string>();
  const seenLocalizedSlugs = new Set<string>();
  const alphabetItems = Array.from(
    new Map(
      UKRAINE_REGION_GROUPS.map((region) => {
        const title = getRegionTitle(region, locale);
        const letter = title.charAt(0).toUpperCase();
        return [letter, { letter, href: `#${getRegionAnchor(region)}` }];
      })
    ).values()
  );

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <section className="rounded-3xl border border-border/50 bg-card/60 p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">{t.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-foreground">{t.title}</h1>
      </section>

      <section aria-label={t.alphabet} className="rounded-3xl border border-border/40 bg-card/40 p-4 shadow-sm sm:p-5">
        <p className="mb-3 text-sm text-muted-foreground">{t.alphabetHint}</p>
        <div className="flex flex-wrap gap-2">
          {alphabetItems.map((item) => (
            <Link
              key={item.letter}
              href={item.href}
              className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-border/50 bg-card/50 px-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {item.letter}
            </Link>
          ))}
        </div>
      </section>

      <section aria-label={t.allCities} className="space-y-5">
        {UKRAINE_REGION_GROUPS.map((region) => {
          const cities = region.slugs
            .filter((slug) => {
              if (seen.has(slug)) return false;
              seen.add(slug);
              return true;
            })
            .map((slug) => cityMap.get(slug))
            .filter((city): city is NonNullable<typeof city> => Boolean(city))
            .map((city) => {
              const localized = locale === "ru" ? getLocalizedCity(city, "ru") : city;
              return {
                slug: locale === "ru" ? getRuCitySlug(city) : city.slug,
                name: localized.name,
              };
            })
            .filter((city) => {
              if (seenLocalizedSlugs.has(city.slug)) return false;
              seenLocalizedSlugs.add(city.slug);
              return true;
            });

          if (!cities.length) return null;

          return (
            <section
              key={region.key}
              id={getRegionAnchor(region)}
              className="scroll-mt-28 rounded-3xl border border-border/40 bg-card/40 p-6 shadow-sm"
            >
              <h2 className="font-display text-2xl font-bold text-foreground">
                {getRegionTitle(region, locale)}
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {cities.map((city) => (
                  <Link
                    key={`${region.key}-${city.slug}`}
                    href={locale === "ru" ? `/ru/city/${city.slug}` : `/city/${city.slug}`}
                    className="text-sm text-primary transition-colors hover:text-primary/80 hover:underline"
                  >
                    {t.cityLink} <span className="font-semibold">{city.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </main>
  );
}
