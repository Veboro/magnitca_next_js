import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("privacy", "/privacy", "ro");
}

export default function RomanianPrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Politica de confidențialitate</h1>
        <p className="text-sm text-muted-foreground">
          Ultima actualizare:{" "}
          {new Date().toLocaleDateString("ro-MD", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Cine suntem</h2>
          <p>
            Operatorul părții publice a serviciului este echipa proiectului Magnitca. În această
            politică, „noi” și „serviciul” se referă la site-ul Magnitca disponibil la magnitca.com.
          </p>
          <p>
            Această politică explică ce tipuri de date pot fi colectate atunci când vizitezi site-ul,
            de ce avem nevoie de ele și ce opțiuni ai în legătură cu prelucrarea lor. Încercăm să
            păstrăm explicațiile într-un limbaj accesibil, fără formulări inutile de complicate.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Ce date putem prelucra</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>date tehnice ale browserului și dispozitivului necesare funcționării site-ului;</li>
            <li>date despre utilizarea paginii, dacă este activată analiza traficului;</li>
            <li>mesaje trimise voluntar prin formularul de contact;</li>
            <li>date privind consimțământul pentru cookie-uri, dacă este folosit un banner de acord.</li>
          </ul>
          <p>
            De regulă, nu avem nevoie să îți cerem nume complet, adresă fizică sau date sensibile
            pentru simpla utilizare a site-ului. Dacă alegi să ne scrii prin formular, prelucrăm doar
            informațiile pe care ni le transmiți în mod voluntar.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Scopul prelucrării</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>afișarea paginilor, widgeturilor și prognozelor disponibile pe site;</li>
            <li>răspuns la mesajele primite prin formularul de contact;</li>
            <li>menținerea securității, stabilității și performanței tehnice;</li>
            <li>analiza modului de utilizare a site-ului și îmbunătățirea conținutului;</li>
            <li>respectarea obligațiilor legale, dacă acestea se aplică.</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Temeiuri de prelucrare</h2>
          <p>
            Datele pot fi prelucrate pe baza interesului legitim de a menține și proteja serviciul,
            pe baza consimțământului pentru cookie-uri sau instrumente neesențiale și pe baza
            necesității de a răspunde la mesajele trimise voluntar de utilizator.
          </p>
          <p>
            Pentru cookie-urile și tehnologiile care nu sunt strict necesare funcționării site-ului,
            temeiul principal este consimțământul, acolo unde legea îl cere. Pentru loguri tehnice,
            securitate și prevenirea abuzurilor, ne bazăm pe interesul legitim de a menține serviciul
            disponibil și sigur.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Furnizori și servicii externe</h2>
          <p>
            Putem folosi furnizori externi pentru găzduire, infrastructură, formulare, analiză de
            trafic și afișarea reclamelor. Acești furnizori pot primi date tehnice strict în măsura
            necesară pentru funcționarea serviciilor lor.
          </p>
          <p>
            Pentru analiza traficului pot fi folosite instrumente precum Google Analytics 4, iar
            pentru publicitate pot fi folosite servicii Google AdSense. Aceste servicii pot prelucra
            informații despre vizite, interacțiuni, dispozitiv, browser și locație aproximativă,
            conform propriilor politici.
          </p>
          <p>
            Nu vindem direct datele personale ale utilizatorilor. Totuși, serviciile externe de
            analiză sau publicitate pot funcționa pe baza propriilor tehnologii, inclusiv cookie-uri,
            identificatori tehnici și modele de măsurare a audienței. Recomandăm să consulți și
            politicile acestor furnizori dacă vrei detalii complete despre modul lor de lucru.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Publicitate și consimțământ</h2>
          <p>
            Pe site pot fi afișate reclame prin Google AdSense și pot fi folosite instrumente de
            analiză. Pentru difuzarea și măsurarea reclamelor și pentru statistici, aceste servicii
            pot seta cookie-uri și pot prelucra date, inclusiv un identificator online, în scopul
            livrării reclamelor și al măsurării eficienței acestora.
          </p>
          <p>
            Pentru vizitatorii din Spațiul Economic European (SEE) și Regatul Unit, înainte de
            utilizarea cookie-urilor neesențiale se afișează un banner de consimțământ — o platformă
            de gestionare a consimțământului (CMP) certificată de Google. Cookie-urile de publicitate
            și de analiză sunt setate doar după ce îți dai acordul, iar consimțământul poate fi
            modificat sau retras oricând prin același banner sau prin setările de confidențialitate.
            În afara SEE și a Regatului Unit, cookie-urile pot fi folosite conform legislației locale.
            Datele sunt prelucrate de Google conform politicii sale de confidențialitate; vezi{" "}
            <a href="https://www.google.com/policies/privacy" className="text-primary underline">
              google.com/policies/privacy
            </a>
            .
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Perioada de păstrare</h2>
          <p>
            Păstrăm datele doar atât timp cât este necesar pentru scopul pentru care au fost
            colectate. Mesajele trimise prin formular pot fi păstrate pe durata corespondenței, iar
            datele statistice depind și de setările furnizorilor externi.
          </p>
          <p>
            Datele tehnice din loguri pot fi păstrate pentru perioade limitate pentru diagnosticare,
            securitate și investigarea incidentelor. Dacă o solicitare trimisă prin formular este
            închisă, mesajele pot fi arhivate pentru o perioadă rezonabilă, în caz că este nevoie să
            revenim asupra aceleiași probleme.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. Transferuri internaționale</h2>
          <p>
            Unii furnizori tehnici pot prelucra date în afara Republicii Moldova sau a Spațiului
            Economic European. În astfel de cazuri ne bazăm pe mecanismele de protecție declarate de
            furnizori pentru transferurile internaționale.
          </p>
          <p>
            Aceste transferuri pot apărea, de exemplu, atunci când infrastructura de găzduire,
            instrumentele de analiză sau serviciile publicitare folosesc centre de date din alte
            țări. Alegem furnizori cunoscuți și urmărim ca serviciile folosite să ofere măsuri
            rezonabile de protecție a datelor.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">9. Drepturile utilizatorului</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>dreptul de acces la datele personale;</li>
            <li>dreptul de rectificare a datelor incorecte;</li>
            <li>dreptul de ștergere în cazurile prevăzute de lege;</li>
            <li>dreptul de restricționare sau opoziție la prelucrare;</li>
            <li>dreptul de retragere a consimțământului, dacă prelucrarea se bazează pe consimțământ;</li>
            <li>dreptul de a depune o plângere la autoritatea competentă.</li>
          </ul>
          <p>
            Pentru exercitarea acestor drepturi, scrie-ne cu o descriere clară a solicitării. În unele
            cazuri putem cere informații suplimentare pentru a confirma că solicitarea vine de la
            persoana vizată sau de la reprezentantul autorizat.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">10. Securitatea datelor</h2>
          <p>
            Folosim măsuri tehnice și organizatorice rezonabile pentru a proteja site-ul și datele
            prelucrate prin serviciu. Niciun sistem online nu poate garanta securitate absolută, dar
            încercăm să reducem riscurile prin actualizări, limitarea accesului și folosirea unor
            furnizori de infrastructură stabili.
          </p>
          <p>
            Te rugăm să nu trimiți prin formular parole, date bancare, informații medicale detaliate
            sau alte date sensibile care nu sunt necesare pentru comunicarea cu echipa Magnitca.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">11. Modificarea politicii</h2>
          <p>
            Putem actualiza această politică atunci când schimbăm funcționalități, furnizori tehnici
            sau modul de prelucrare a datelor. Versiunea actuală este publicată pe această pagină,
            împreună cu data ultimei actualizări.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">12. Contact</h2>
          <p>
            Pentru întrebări despre confidențialitate scrie-ne la{" "}
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
