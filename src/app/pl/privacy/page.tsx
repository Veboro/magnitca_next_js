import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("privacy", "/privacy", "pl");
}

export default function PolishPrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Polityka prywatności</h1>
        <p className="text-sm text-muted-foreground">
          Ostatnia aktualizacja:{" "}
          {new Date().toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Kim jesteśmy</h2>
          <p>
            Operatorem publicznej części serwisu jest zespół projektu Magnitca. W tej polityce
            określenia „my”, „nas” i „serwis” oznaczają usługę Magnitca dostępną pod adresem
            magnitca.com.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Jakie dane możemy przetwarzać</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>dane techniczne przeglądarki i urządzenia potrzebne do działania serwisu;</li>
            <li>dane o korzystaniu ze strony, jeśli włączona jest analityka;</li>
            <li>wiadomości wysłane dobrowolnie przez formularz kontaktowy;</li>
            <li>dane dotyczące zgody lub odmowy wobec plików cookie, jeśli używany jest baner zgody.</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Cel przetwarzania</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>udostępnianie stron i funkcji serwisu;</li>
            <li>obsługa wiadomości, zgłoszeń błędów i zapytań o współpracę;</li>
            <li>zapewnienie bezpieczeństwa i technicznej stabilności serwisu;</li>
            <li>analiza korzystania z serwisu i poprawa treści oraz UX, jeśli analityka jest aktywna.</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Podstawy prawne</h2>
          <p>
            Dane przetwarzamy na podstawie uzasadnionego interesu w utrzymaniu i zabezpieczeniu
            serwisu, zgody użytkownika w przypadku niekoniecznych plików cookie oraz realizacji
            kontaktu, gdy użytkownik sam do nas pisze.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Komu dane mogą być udostępniane</h2>
          <p>
            Korzystamy z zewnętrznych dostawców infrastruktury technicznej, formularzy i analityki.
            Mogą oni przetwarzać dane wyłącznie w zakresie potrzebnym do świadczenia tych usług.
          </p>
          <p>
            Do analizy ruchu możemy wykorzystywać Google Analytics 4. Usługa ta może otrzymywać
            techniczne dane o odsłonach, interakcji z treścią, przybliżonej lokalizacji, typie
            urządzenia i przeglądarki.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Okres przechowywania</h2>
          <p>
            Dane przechowujemy tylko tak długo, jak jest to uzasadnione celem przetwarzania.
            Wiadomości z formularza mogą być przechowywane dłużej, jeśli jest to potrzebne do
            prowadzenia korespondencji, a dane statystyczne zależą także od ustawień zewnętrznych
            usług analitycznych.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Transfer poza EOG</h2>
          <p>
            Część dostawców technicznych może przetwarzać dane poza Europejskim Obszarem
            Gospodarczym. W takich przypadkach opieramy się na deklarowanych przez nich mechanizmach
            ochrony danych dla transferów międzynarodowych.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. Twoje prawa</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>prawo dostępu do danych;</li>
            <li>prawo sprostowania nieprawidłowych danych;</li>
            <li>prawo usunięcia danych w określonych przypadkach;</li>
            <li>prawo ograniczenia przetwarzania lub sprzeciwu;</li>
            <li>prawo wycofania zgody, jeśli przetwarzanie opiera się na zgodzie;</li>
            <li>prawo złożenia skargi do właściwego organu nadzorczego.</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">9. Kontakt</h2>
          <p>
            W sprawach związanych z prywatnością możesz napisać na{" "}
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
