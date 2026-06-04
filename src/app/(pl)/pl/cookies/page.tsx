import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("cookies", "/cookies", "pl");
}

export default function PolishCookiesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Polityka plików cookie</h1>
        <p className="text-sm text-muted-foreground">
          Ostatnia aktualizacja:{" "}
          {new Date().toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Czym są pliki cookie</h2>
          <p>
            Cookie to niewielkie pliki tekstowe zapisywane w przeglądarce użytkownika, aby serwis
            mógł zapamiętać ustawienia techniczne, wybory użytkownika lub dane statystyczne.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Jakie pliki cookie mogą być używane</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>niezbędne pliki cookie potrzebne do działania interfejsu;</li>
            <li>pliki ustawień, np. języka lub zgody na cookie;</li>
            <li>analityczne pliki cookie, jeśli aktywna jest statystyka odwiedzin, w tym Google Analytics 4;</li>
            <li>pliki third-party, jeśli wykorzystywane są zewnętrzne osadzone usługi.</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Jak ich używamy</h2>
          <p>
            Pliki cookie wykorzystujemy do technicznego działania serwisu, zapisywania podstawowych
            preferencji użytkownika oraz — za zgodą — do analityki i innych scenariuszy
            niekoniecznych.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Zarządzanie plikami cookie</h2>
          <p>
            Możesz zarządzać plikami cookie z poziomu ustawień przeglądarki. Jeśli na stronie
            działa baner zgody, możesz tam również zaakceptować lub odrzucić pliki niekonieczne.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Kontakt</h2>
          <p>
            W sprawach dotyczących plików cookie napisz do nas na{" "}
            <a href="mailto:info@magnitca.com" className="text-primary underline">
              info@magnitca.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
