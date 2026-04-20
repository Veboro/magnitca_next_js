import Link from "next/link";
import { ALL_UK_CITIES } from "@/data/cities";
import { CITIES_RU, getLocalizedCity, getRuCitySlug } from "@/data/cities-ru";
import { UKRAINE_REGION_GROUPS } from "@/data/ukraine-city-catalog";

type CatalogLocale = "uk" | "ru";

const copy = {
  uk: {
    eyebrow: "Географія",
    title: "Магнітні бурі по містах України",
    description:
      "Каталог сторінок магнітних бур по містах України. Обирайте область і переходьте до великих міст та обласних центрів без дублювання.",
    allCities: "Усі населені пункти за областями",
    cityLink: "магнітні бурі",
  },
  ru: {
    eyebrow: "География",
    title: "Магнитные бури по городам Украины",
    description:
      "Каталог страниц о магнитных бурях по городам Украины. Выбирайте область и переходите к крупным городам и областным центрам без дублирования.",
    allCities: "Все населённые пункты по областям",
    cityLink: "магнитные бури",
  },
} as const;

export function CityCatalogPage({ locale }: { locale: CatalogLocale }) {
  const t = copy[locale];
  const cityMap = new Map(ALL_UK_CITIES.map((city) => [city.slug, city]));
  const seen = new Set<string>();

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <section className="rounded-3xl border border-border/50 bg-card/60 p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">{t.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-foreground">{t.title}</h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-muted-foreground">{t.description}</p>
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
            });

          if (!cities.length) return null;

          return (
            <section key={region.key} className="rounded-3xl border border-border/40 bg-card/40 p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {locale === "ru" ? region.titleRu : region.titleUk}
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
