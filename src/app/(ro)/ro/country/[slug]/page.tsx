import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getCitiesByRoCountrySlug, getRoCountryBySlug, RO_COUNTRIES } from "@/data/cities-md";

type Params = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return RO_COUNTRIES.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const country = getRoCountryBySlug(slug);

  if (!country) {
    return {
      title: "Țara nu a fost găsită",
    };
  }

  return {
    title: `${country.title} — furtuni magnetice și prognoza Kp | Magnitca`,
    description: `${country.description} Lista orașelor cu prognoza indicelui Kp, vânt solar și activitate geomagnetică.`,
    alternates: {
      canonical: `/ro/country/${country.slug}`,
      languages: {
        ro: `/ro/country/${country.slug}`,
      },
    },
  };
}

export default async function RomanianCountryPage({ params }: Params) {
  const { slug } = await params;
  const country = getRoCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const cities = getCitiesByRoCountrySlug(country.slug).sort((a, b) => a.name.localeCompare(b.name, "ro"));

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Navigare pe pagină">
        <Link href="/ro" className="transition-colors hover:text-primary">
          Acasă
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">{country.name}</span>
      </nav>

      <section className="mt-6 space-y-4">
        <h1 className="font-display text-4xl font-bold">{country.title}</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          {country.description} Alege orașul pentru a vedea pagina locală cu furtuni magnetice,
          indice Kp, vânt solar, prognoza pe următoarele zile, răsărit, apus și date meteo locale.
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Lista orașelor</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {cities.length} pagini locale disponibile pentru {country.name}.
            </p>
          </div>
          <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>

        <div className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/ro/city/${city.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-border/40 bg-background/40 px-4 py-3 text-sm transition hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="font-medium text-foreground group-hover:text-primary">{city.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
