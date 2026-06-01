import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("cookies", "/cookies", "hu");
}

export default function HungarianCookiesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Cookie-szabályzat</h1>
        <p className="text-sm text-muted-foreground">
          Utolsó frissítés: {new Date().toLocaleDateString("hu-HU", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Mik azok a cookie-k</h2>
          <p>
            A cookie egy kis szöveges fájl, amelyet a webhely a böngészőben tárolhat. Segíthet
            technikai beállítások, nyelvi preferenciák, témaválasztás vagy statisztikai információk
            megőrzésében.
          </p>
          <p>
            Cookie-k mellett hasonló technológiák is használhatók, például böngészőben tárolt helyi
            adatok, technikai azonosítók vagy mérési pixelek. Ebben a szabályzatban a „cookie”
            kifejezést tágabb értelemben használjuk ezekre a megoldásokra is.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Milyen cookie-kat használhat a webhely</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>szükséges cookie-kat, amelyek az alapvető felület működéséhez kellenek;</li>
            <li>beállítási cookie-kat, például nyelv, téma vagy hozzájárulási állapot megőrzésére;</li>
            <li>analitikai cookie-kat, ha a látogatottsági mérés aktív, például Google Analytics 4 segítségével;</li>
            <li>külső szolgáltatók cookie-jait, ha hirdetések vagy beágyazott szolgáltatások működnek.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Hogyan használjuk őket</h2>
          <p>
            A cookie-kat a webhely technikai működéséhez, alapvető felhasználói beállítások
            megőrzéséhez, valamint külön hozzájárulás esetén analitikához vagy más nem szükséges
            funkciókhoz használhatjuk.
          </p>
          <p>
            Ha Google Analytics 4 aktív, az analitikai cookie-k segíthetnek az oldalmegtekintések,
            forgalmi források, tartalommal való interakciók és általános használati minták
            megértésében. Ezek az adatok a webhely szerkezetének és használhatóságának javítását
            szolgálják.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Hirdetések és külső szolgáltatások</h2>
          <p>
            A webhely hirdetési rendszereket, például Google AdSense szolgáltatást is használhat.
            Ezek a szolgáltatók saját cookie-kat vagy hasonló technológiákat alkalmazhatnak a
            hirdetések megjelenítéséhez, méréséhez és a visszaélések megelőzéséhez.
          </p>
          <p>
            A külső szolgáltatók adatkezelésére a saját szabályzataik is vonatkoznak. A Magnitca nem
            határozza meg önállóan minden hirdetési rendszer működési szabályát.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Cookie-k kezelése</h2>
          <p>
            A cookie-kat a böngésző beállításaiban tudod kezelni vagy törölni. Ha a webhely
            hozzájárulási bannert jelenít meg, ott is elfogadhatod vagy elutasíthatod a nem
            szükséges cookie-kat.
          </p>
          <p>
            A szükséges cookie-k kikapcsolása befolyásolhatja bizonyos funkciók működését. Az
            analitikai vagy hirdetési cookie-k korlátozása általában nem akadályozza az alapvető
            tartalmak megtekintését.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Kérdések</h2>
          <p>
            Ha kérdésed van a cookie-k használatával kapcsolatban, írj nekünk:{" "}
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
