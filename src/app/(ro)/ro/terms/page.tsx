import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("terms", "/terms", "ro");
}

export default function RomanianTermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Termeni de utilizare</h1>
        <p className="text-sm text-muted-foreground">
          Ultima actualizare:{" "}
          {new Date().toLocaleDateString("ro-MD", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Dispoziții generale</h2>
          <p>
            Folosind serviciul Magnitca, accepți acești termeni. Dacă nu ești de acord cu ei, te
            rugăm să nu folosești serviciul.
          </p>
          <p>
            Termenii se aplică paginilor publice ale site-ului, inclusiv secțiunilor despre furtuni
            magnetice, indicele Kp, vânt solar, calendar, pagini locale și materiale editoriale. Prin
            „utilizator” înțelegem orice persoană care accesează sau folosește site-ul.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Caracter informativ</h2>
          <p>
            Site-ul oferă informații despre furtuni magnetice, vreme spațială, indicele Kp și
            prognoze asociate. Conținutul nu reprezintă consultanță medicală, juridică sau altă
            consultanță profesională.
          </p>
          <p>
            Datele despre posibilul impact asupra organismului sunt orientative și se bazează pe
            indicatori generali, nu pe starea individuală de sănătate. Dacă ai simptome persistente,
            boli cronice sau întrebări medicale, trebuie să consulți un medic. Nu lua decizii
            importante privind tratamentul sau siguranța personală exclusiv pe baza site-ului.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Surse și acuratețe</h2>
          <p>
            Folosim surse externe deschise, inclusiv NOAA SWPC și Open-Meteo. Depunem eforturi
            pentru acuratețe, dar nu garantăm disponibilitatea continuă sau lipsa erorilor în toate
            datele afișate.
          </p>
          <p>
            Prognozele de vreme spațială se pot schimba rapid, iar unele valori pot fi actualizate cu
            întârziere din cauza surselor externe, cache-ului, infrastructurii sau problemelor de
            rețea. Dacă ai nevoie de date oficiale pentru activități critice, verifică întotdeauna
            sursele primare și instituțiile responsabile.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Utilizare permisă</h2>
          <p>
            Poți folosi site-ul în scopuri personale, informative și legale. Nu este permisă
            încercarea de a perturba funcționarea serviciului, accesarea neautorizată a sistemelor,
            colectarea abuzivă de date sau folosirea conținutului pentru activități ilegale.
          </p>
          <p>
            Este interzisă folosirea automatizată excesivă care poate afecta performanța site-ului,
            copierea masivă a conținutului fără acord, modificarea sau ascunderea surselor și
            prezentarea materialelor Magnitca ca fiind create de un alt serviciu.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Proprietate intelectuală</h2>
          <p>
            Textele, structura paginilor, elementele vizuale și materialele create de echipa
            Magnitca sunt protejate de drepturi de proprietate intelectuală. Datele provenite din
            surse externe rămân supuse condițiilor acestor furnizori.
          </p>
          <p>
            Poți distribui linkuri către paginile site-ului și poți cita fragmente scurte cu indicarea
            sursei. Pentru republicarea integrală, integrarea comercială sau folosirea materialelor în
            produse proprii, te rugăm să ne contactezi în prealabil.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Limitarea răspunderii</h2>
          <p>
            Serviciul este oferit în forma disponibilă la momentul accesării. Nu răspundem pentru
            decizii luate exclusiv pe baza informațiilor de pe site, pentru întreruperi temporare,
            erori ale surselor externe sau consecințe indirecte ale utilizării datelor.
          </p>
          <p>
            Nu garantăm că site-ul va fi disponibil permanent, că toate funcțiile vor funcționa fără
            întreruperi sau că fiecare prognoză va corespunde perfect evoluției reale a condițiilor
            geomagnetice. În limita permisă de lege, utilizarea serviciului se face pe propria
            răspundere.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Linkuri externe</h2>
          <p>
            Site-ul poate conține linkuri către surse externe, servicii de date, pagini ale
            furnizorilor sau materiale informative. Nu controlăm conținutul acestor site-uri și nu
            suntem responsabili pentru politicile, disponibilitatea sau exactitatea informațiilor
            publicate de terți.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. Publicitate și servicii terțe</h2>
          <p>
            Pentru susținerea proiectului, pe site pot fi afișate reclame prin rețele publicitare
            externe. Aceste servicii pot folosi propriile tehnologii de măsurare și personalizare,
            conform politicilor lor. Prezența unei reclame nu înseamnă că Magnitca recomandă sau
            garantează produsul promovat.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">9. Modificarea termenilor</h2>
          <p>
            Acești termeni pot fi actualizați pe măsură ce serviciul se dezvoltă. Versiunea curentă
            este publicată pe această pagină împreună cu data ultimei actualizări.
          </p>
          <p>
            Continuarea folosirii site-ului după actualizarea termenilor înseamnă acceptarea versiunii
            noi. Dacă modificările sunt importante, putem încerca să le facem mai vizibile în
            interfață, însă responsabilitatea de a verifica periodic termenii aparține utilizatorului.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">10. Contact</h2>
          <p>
            Pentru întrebări despre acești termeni scrie-ne la{" "}
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
