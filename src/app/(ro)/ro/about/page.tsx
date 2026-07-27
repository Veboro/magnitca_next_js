import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("about", "/about", "ro");
}

export default function RomanianAboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Despre Magnitca Moldova</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          Magnitca Moldova este un serviciu de monitorizare a furtunilor magnetice, indicelui Kp,
          vântului solar și vremii spațiale, prezentat într-o formă simplă și ușor de urmărit.
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Ce este proiectul</h2>
          <p>
            Magnitca este un proiect digital independent dedicat furtunilor magnetice, indicelui Kp,
            vântului solar și prognozelor de vreme spațială. Scopul nostru este să facem datele
            tehnice mai clare pentru utilizatorii obișnuiți.
          </p>
          <p>
            Pe site poți urmări situația geomagnetică actuală, prognoza indicelui Kp, viteza
            vântului solar, componenta IMF Bz, calendarul furtunilor magnetice și pagini locale
            pentru orașele din Moldova. Încercăm să combinăm datele brute cu explicații simple,
            astfel încât informația să fie utilă și fără pregătire tehnică.
          </p>
          <p>
            Versiunea pentru Moldova este construită pentru utilizatori care caută informații locale:
            Chișinău, Bălți, Cahul, Ungheni, Orhei, Soroca, Comrat și alte centre importante.
            Structura site-ului urmează aceeași logică precum versiunea principală Magnitca, dar
            conținutul, denumirile și paginile locale sunt adaptate publicului de limbă română.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Ce poți verifica pe site</h2>
          <p>
            Pagina principală arată rapid dacă ziua este liniștită sau dacă există risc de activitate
            geomagnetică mai ridicată. Pentru fiecare zi sunt afișate intervale de prognoză, iar
            indicatorii principali ajută la înțelegerea contextului: Kp, viteza vântului solar,
            componenta Bz, nivelurile NOAA și tendința pentru următoarele zile.
          </p>
          <p>
            Paginile orașelor combină datele despre vremea spațială cu informații locale precum
            coordonate, răsărit, apus și, acolo unde este disponibil, un bloc despre posibilul impact
            asupra organismului. Nu încercăm să transformăm aceste date în verdicte medicale, ci să
            oferim o imagine clară și ușor de urmărit pentru fiecare regiune.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Sursele datelor</h2>
          <p>
            Datele despre vremea spațială provin din surse deschise NOAA Space Weather Prediction
            Center. Datele meteo locale sunt preluate din Open-Meteo și seturi de date asociate.
          </p>
          <p>
            Magnitca nu este sursa primară a măsurătorilor științifice. Noi agregăm, prelucrăm și
            afișăm datele într-o interfață mai prietenoasă. În caz de diferențe între site-ul nostru
            și sursele oficiale, datele publicate de instituțiile responsabile au prioritate.
          </p>
          <p>
            Deoarece prognozele geomagnetice se pot schimba pe parcursul zilei, unele valori pot fi
            actualizate mai des decât textele explicative. De aceea, recomandăm să privești
            indicatorii ca pe o fotografie curentă a situației, nu ca pe o promisiune absolută pentru
            întreaga zi. Când datele se modifică, interfața este actualizată automat sau la următoarea
            regenerare a paginii.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Pentru cine este util</h2>
          <p>
            Serviciul poate fi util persoanelor care urmăresc furtunile magnetice din motive de
            sănătate, interes educațional, observarea cerului sau activități ce depind de comunicații
            și navigație. Pentru utilizatorii meteosensibili, oferim explicații despre nivelul
            posibil de influență asupra organismului, dar aceste informații rămân orientative.
          </p>
          <p>
            Dacă ai simptome persistente, boli cronice sau nelămuriri legate de sănătate, deciziile
            importante trebuie luate împreună cu un medic. Magnitca nu oferă diagnostic și nu
            înlocuiește consultul medical.
          </p>
          <p>
            Site-ul poate fi util și pentru cei care vor să compare zilele între ele: când activitatea
            a fost mai ridicată, când se apropie o posibilă furtună magnetică sau de ce uneori
            indicatorii solari se schimbă repede fără ca nivelul NOAA să ajungă la furtună. Prin
            grafice și explicații scurte, încercăm să facem aceste diferențe mai ușor de înțeles.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Abordare editorială</h2>
          <p>
            Încercăm să explicăm activitatea geomagnetică fără ton alarmist și să separăm datele
            măsurate de interpretări. Informațiile despre stare de bine sunt orientative și nu
            înlocuiesc consultația medicală.
          </p>
          <p>
            Când publicăm texte explicative, ne bazăm pe date deschise, surse tehnice și formulări
            prudente. Evităm promisiunile categorice, exagerările și concluziile medicale. Scopul
            este să ajutăm utilizatorul să înțeleagă rapid contextul: cât de activ este câmpul
            geomagnetic, ce înseamnă nivelurile Kp/G și cum poate fi interpretată prognoza.
          </p>
          <p>
            Preferăm formulările echilibrate: dacă nu există furtună magnetică, spunem clar că nu
            există; dacă există doar o creștere ușoară, nu o prezentăm ca pe un risc major. Pentru
            utilizatorii sensibili la schimbările de vreme, această diferență este importantă, pentru
            că ajută la evitarea anxietății inutile.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Dezvoltarea versiunii Moldova</h2>
          <p>
            Versiunea română este dezvoltată treptat. În timp, putem adăuga mai multe localități,
            pagini tematice, explicații despre fenomene solare și instrumente utile pentru urmărirea
            prognozelor. Dacă observi o denumire locală care ar trebui corectată sau o localitate care
            merită adăugată, feedbackul tău ne ajută să facem secțiunea mai exactă.
          </p>
          <p>
            Pentru noi este important ca proiectul să rămână clar, rapid și ușor de folosit. De
            aceea, nu încărcăm paginile cu jargon inutil, dar nici nu ascundem datele importante.
            Când un indicator are nevoie de explicație, încercăm să o oferim lângă valoarea afișată.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Metodologie și limite științifice</h2>
          <p>
            Indicatorii „impact asupra stării de bine” și „nivel de sensibilitate” sunt estimări
            euristice bazate pe date publice (indicele Kp și activitatea geomagnetică, iar acolo unde
            este afișată, variațiile presiunii atmosferice). Ei oferă o orientare generală, nu un
            diagnostic medical sau o predicție personalizată; fiecare persoană reacționează diferit.
          </p>
          <p>
            Legătura dintre activitatea geomagnetică și starea de bine a omului nu este confirmată
            ferm din punct de vedere științific — dovezile disponibile sunt limitate și neconcludente.
            Conținutul are caracter informativ și nu înlocuiește consultul medical de specialitate.
            Dacă ai probleme de sănătate, adresează-te unui medic calificat.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Contact și dezvoltare</h2>
          <p>
            Fondatorul și redactorul proiectului este{" "}
            <a href="https://www.facebook.com/golovne" target="_blank" rel="author noopener noreferrer" className="text-primary underline">
              Andrew Orobets
            </a>
            . Proiectul este dezvoltat treptat: adăugăm orașe, secțiuni informative și instrumente
            utile pentru cititori. Dacă ai observat o eroare, ai o propunere sau vrei să discuți
            despre colaborare, ne poți scrie la{" "}
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
