import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("terms", "/terms", "pl");
}

export default function PolishTermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Warunki korzystania</h1>
        <p className="text-sm text-muted-foreground">
          Ostatnia aktualizacja:{" "}
          {new Date().toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Postanowienia ogólne</h2>
          <p>
            Korzystając z serwisu Magnitca, akceptujesz niniejsze warunki. Jeśli się z nimi nie
            zgadzasz, nie korzystaj z serwisu.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Informacyjny charakter serwisu</h2>
          <p>
            Serwis udostępnia informacje o burzach magnetycznych, pogodzie kosmicznej, indeksie Kp,
            prognozach i powiązanych materiałach. Treści nie stanowią porady medycznej, prawnej ani
            innej profesjonalnej konsultacji.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Źródła danych i dokładność</h2>
          <p>
            Korzystamy z otwartych źródeł zewnętrznych, w tym NOAA SWPC i Open-Meteo. Dążymy do
            rzetelności, ale nie gwarantujemy całkowitej bezbłędności, kompletności ani ciągłej
            dostępności każdego wskaźnika czy prognozy.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Dozwolone korzystanie</h2>
          <p>
            Możesz korzystać z serwisu w celach osobistych, informacyjnych i zgodnych z prawem.
            Niedozwolone jest zakłócanie działania strony, obchodzenie ograniczeń technicznych lub
            wykorzystywanie serwisu do nadużyć i nielegalnej automatyzacji.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Własność intelektualna</h2>
          <p>
            Projekt, teksty, materiały redakcyjne i inne elementy stworzone przez zespół Magnitca
            podlegają ochronie praw własności intelektualnej. Dane źródeł zewnętrznych podlegają
            warunkom odpowiednich dostawców.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Ograniczenie odpowiedzialności</h2>
          <p>
            Serwis udostępniany jest w formule „as is”. Nie odpowiadamy za decyzje podejmowane
            wyłącznie na podstawie informacji ze strony ani za szkody pośrednie, przerwy w działaniu
            czy czasową niedostępność usługi.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Zmiany warunków</h2>
          <p>
            Warunki mogą być aktualizowane wraz z rozwojem serwisu. Aktualna wersja jest publikowana
            na tej stronie wraz z datą ostatniej zmiany.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. Kontakt</h2>
          <p>
            Jeśli masz pytania dotyczące tych warunków, napisz na{" "}
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
