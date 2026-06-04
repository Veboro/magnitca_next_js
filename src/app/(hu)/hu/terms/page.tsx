import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("terms", "/terms", "hu");
}

export default function HungarianTermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Felhasználási feltételek</h1>
        <p className="text-sm text-muted-foreground">
          Utolsó frissítés: {new Date().toLocaleDateString("hu-HU", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Általános rendelkezések</h2>
          <p>
            A Magnitca webhely használatával elfogadod ezeket a feltételeket. Ha nem értesz velük
            egyet, kérjük, ne használd a szolgáltatást.
          </p>
          <p>
            A feltételek a webhely nyilvános oldalaira vonatkoznak, beleértve a mágneses
            viharokról, Kp-indexről, napszélről, holdnaptárról, előrejelzésekről és tájékoztató
            cikkekről szóló tartalmakat.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Információs jelleg</h2>
          <p>
            A webhely mágneses viharokról, űridőjárásról, Kp-indexről és kapcsolódó előrejelzésekről
            ad tájékoztatást. A tartalom nem minősül orvosi, jogi, pénzügyi vagy más szakmai
            tanácsadásnak.
          </p>
          <p>
            A szervezetre gyakorolt lehetséges hatásokról szóló magyarázatok általános jellegűek.
            Nem veszik figyelembe az egyéni egészségi állapotot, gyógyszerszedést vagy orvosi
            előzményeket.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Adatforrások és pontosság</h2>
          <p>
            Nyílt külső forrásokat használunk, többek között NOAA SWPC és Open-Meteo adatokat.
            Törekszünk a pontosságra, de nem garantáljuk minden adat, grafikon vagy előrejelzés
            hibamentességét, teljességét vagy folyamatos elérhetőségét.
          </p>
          <p>
            Az űridőjárási előrejelzések gyorsan változhatnak. Egyes értékek késhetnek külső
            források, cache, infrastruktúra vagy hálózati problémák miatt. Kritikus döntésekhez
            mindig az elsődleges hivatalos forrásokat kell ellenőrizni.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Megengedett használat</h2>
          <p>
            A webhelyet személyes, tájékoztató és jogszerű célokra használhatod. Tilos a szolgáltatás
            működésének megzavarása, jogosulatlan hozzáférési kísérlet, technikai korlátozások
            megkerülése vagy visszaélésszerű automatizált lekérés.
          </p>
          <p>
            Nem engedélyezett a tartalom tömeges másolása engedély nélkül, a források eltüntetése,
            vagy a Magnitca által készített anyagok más szolgáltatás saját tartalmaként való
            feltüntetése.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Szellemi tulajdon</h2>
          <p>
            A webhely szövegei, szerkezete, vizuális elemei és a Magnitca csapata által készített
            anyagok szellemi tulajdon védelme alatt állhatnak. A külső forrásokból származó adatokra
            az adott szolgáltatók feltételei vonatkoznak.
          </p>
          <p>
            Linkelni az oldalainkra szabad. Rövid idézetek forrásmegjelöléssel használhatók, de a
            tartalom rendszerszintű újraközlése vagy automatizált gyűjtése előzetes egyeztetést
            igényelhet.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Felelősség korlátozása</h2>
          <p>
            A szolgáltatás „ahogy van” alapon érhető el. Nem vállalunk felelősséget olyan döntésekért,
            amelyeket kizárólag a webhelyen megjelenő információk alapján hoznak meg, sem közvetett
            károkért, adatvesztésért, szolgáltatáskiesésért vagy ideiglenes elérhetetlenségért.
          </p>
          <p>
            Egészségügyi panaszok esetén orvoshoz kell fordulni. Műszaki, energetikai, repülési vagy
            más kritikus felhasználás esetén az illetékes hivatalos szervezetek adatai és szakmai
            protokolljai az irányadók.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. A feltételek módosítása</h2>
          <p>
            A szolgáltatás fejlődésével a feltételeket időről időre frissíthetjük. Az aktuális
            változat ezen az oldalon érhető el, az utolsó frissítés dátumával együtt.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. Kapcsolat</h2>
          <p>
            Ha kérdésed van ezekkel a feltételekkel kapcsolatban, írj nekünk:{" "}
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
