import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("cookies", "/cookies", "ro");
}

export default function RomanianCookiesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Politica cookie</h1>
        <p className="text-sm text-muted-foreground">
          Ultima actualizare:{" "}
          {new Date().toLocaleDateString("ro-MD", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Ce sunt cookie-urile</h2>
          <p>
            Cookie-urile sunt fișiere text mici salvate în browser pentru ca site-ul să poată reține
            setări tehnice, preferințe sau date statistice.
          </p>
          <p>
            Pe lângă cookie-uri, unele servicii pot folosi tehnologii similare, cum ar fi stocarea
            locală în browser, identificatori tehnici sau pixeli de măsurare. În această politică
            folosim termenul „cookie-uri” într-un sens larg, pentru a include aceste mecanisme
            asemănătoare.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Cum le folosim</h2>
          <p>
            Le folosim pentru funcționarea tehnică a serviciului, păstrarea preferințelor de bază și,
            cu acordul utilizatorului, pentru analiză și îmbunătățirea site-ului.
          </p>
          <p>
            De exemplu, cookie-urile pot ajuta site-ul să țină minte limba aleasă, tema interfeței
            sau faptul că ai interacționat deja cu un banner de consimțământ. Fără unele dintre
            aceste mecanisme, anumite funcții ar trebui resetate la fiecare vizită.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Tipuri de cookie-uri</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>cookie-uri necesare pentru funcționarea interfeței și păstrarea setărilor de bază;</li>
            <li>cookie-uri de preferințe, de exemplu pentru limbă sau temă;</li>
            <li>cookie-uri analitice, dacă este activată măsurarea traficului;</li>
            <li>cookie-uri ale furnizorilor terți, inclusiv pentru reclame sau servicii încorporate.</li>
          </ul>
          <p>
            Cookie-urile necesare sunt folosite pentru funcții de bază și, de obicei, nu pot fi
            dezactivate din sistemul site-ului fără a afecta funcționarea acestuia. Cookie-urile de
            analiză și publicitate sunt diferite: ele ajută la măsurarea audienței sau la afișarea
            reclamelor și pot depinde de consimțământul tău sau de setările browserului.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Analitică și publicitate</h2>
          <p>
            Site-ul poate folosi instrumente de analiză, cum ar fi Google Analytics 4, pentru a
            înțelege ce pagini sunt vizitate și cum poate fi îmbunătățită experiența utilizatorului.
            De asemenea, pot fi afișate reclame prin servicii precum Google AdSense.
          </p>
          <p>
            Furnizorii acestor servicii pot folosi propriile cookie-uri sau tehnologii similare.
            Detaliile despre modul lor de prelucrare sunt descrise în politicile acestor furnizori.
          </p>
          <p>
            Publicitatea poate fi contextuală sau, în funcție de setările utilizatorului și de
            serviciile disponibile, personalizată. Magnitca nu stabilește singură toate regulile
            acestor sisteme publicitare; ele sunt administrate de furnizorii externi care le oferă.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Gestionarea cookie-urilor</h2>
          <p>
            Poți gestiona cookie-urile din setările browserului. Dacă site-ul afișează un banner de
            consimțământ, poți modifica alegerea și acolo.
          </p>
          <p>
            Majoritatea browserelor permit blocarea cookie-urilor, ștergerea celor existente sau
            setarea unor reguli pentru fiecare site. Dacă dezactivezi toate cookie-urile, unele
            funcții pot deveni mai puțin comode, de exemplu păstrarea limbii, temei sau preferințelor
            de afișare.
          </p>
          <p>
            Pentru control suplimentar, poți folosi și setările contului Google, instrumentele de
            confidențialitate ale browserului sau extensii dedicate. Reține însă că unele modificări
            trebuie făcute separat pe fiecare dispozitiv și în fiecare browser folosit.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Modificări ale politicii</h2>
          <p>
            Putem actualiza această politică atunci când schimbăm furnizorii tehnici, adăugăm
            funcționalități noi sau modificăm modul de afișare a reclamelor și analizelor. Versiunea
            curentă este cea publicată pe această pagină.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Contact</h2>
          <p>
            Pentru întrebări despre cookie-uri scrie-ne la{" "}
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
