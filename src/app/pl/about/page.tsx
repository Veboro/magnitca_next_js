import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("about", "/about", "pl");
}

export default function PolishAboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">O Magnitca</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          Magnitca to serwis monitorujący burze magnetyczne, który łączy dane NOAA, proste
          wyjaśnienia i czytelne strony dotyczące pogody kosmicznej, wskaźnika Kp oraz zmian
          aktywności słonecznej.
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Czym jest ten projekt</h2>
          <p>
            Magnitca to niezależny cyfrowy projekt poświęcony burzom magnetycznym, indeksowi Kp,
            wiatrowi słonecznemu i pogodzie kosmicznej. Tworzymy publiczny serwis, który pomaga
            szybko zrozumieć bieżącą sytuację geomagnetyczną i sprawdzić prognozę bez zbędnej
            technicznej złożoności.
          </p>
          <p>
            W centrum serwisu znajdują się aktualne wskaźniki pogody kosmicznej, strony
            informacyjne i materiały wyjaśniające. Część stron renderowana jest po stronie serwera,
            a aktualne widżety po załadowaniu odświeżają się w przeglądarce.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Skąd pochodzą dane</h2>
          <p>
            Dane dotyczące pogody kosmicznej pochodzą z otwartych źródeł NOAA Space Weather
            Prediction Center. Lokalne dane pogodowe i środowiskowe pobierane są z Open-Meteo oraz
            powiązanych z nim otwartych zbiorów.
          </p>
          <p>
            Naszym celem jest przedstawienie tych danych w wygodnej formie, ale nie jesteśmy
            pierwotnym źródłem pomiarów naukowych. W razie rozbieżności pierwszeństwo mają oficjalni
            dostawcy danych.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Podejście redakcyjne</h2>
          <p>
            Materiały informacyjne przygotowujemy na podstawie otwartych źródeł, bieżących prognoz i
            danych technicznych. Staramy się unikać sensacyjnego tonu, oddzielać fakty od
            interpretacji i aktualizować treści, gdy pojawiają się nowe istotne informacje.
          </p>
          <p>
            Treści dotyczące samopoczucia mają charakter informacyjny i nie zastępują porady
            medycznej. W kwestiach zdrowotnych należy opierać się również na profesjonalnej pomocy
            lekarskiej.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Kto odpowiada za serwis</h2>
          <p>
            Publiczną część serwisu rozwija zespół projektu Magnitca. W sprawach redakcyjnych,
            prawnych lub partnerskich można skontaktować się przez stronę kontaktową albo przez{" "}
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
