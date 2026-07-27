import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("about", "/about", "hu");
}

export default function HungarianAboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">A Magnitca projektről</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          A Magnitca az űridőjárás, a mágneses viharok, a Kp-index és a napszél adatait teszi
          érthetővé egy letisztult, könnyen követhető felületen.
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Mi ez a projekt</h2>
          <p>
            A Magnitca független digitális projekt mágneses viharokról, Kp-indexről, napszélről és
            űridőjárásról. Célunk, hogy a technikai adatokat egyszerű, gyorsan értelmezhető formában
            mutassuk meg, bonyolult tudományos nyelvezet nélkül.
          </p>
          <p>
            A főoldalon gyorsan látható, hogy nyugodt-e a geomágneses helyzet, vagy várható-e
            emelkedett aktivitás. Megjelenítjük az aktuális Kp-indexet, a NOAA G-skálát, a napszél
            sebességét, sűrűségét és az IMF Bz komponenst.
          </p>
          <p>
            A webhelyen élő űridőjárási mutatók, előrejelzések, naptárak és magyarázó oldalak
            találhatók. A felület úgy épül fel, hogy a fontos jelzések először láthatók legyenek,
            a részletesebb magyarázatok pedig külön blokkokban következzenek.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Adatforrások</h2>
          <p>
            Az űridőjárási adatok nyílt NOAA Space Weather Prediction Center forrásokból származnak.
            A Magnitca ezeket összegyűjti, rendszerezi és felhasználóbarát formában jeleníti meg.
          </p>
          <p>
            A geomágneses előrejelzések napközben változhatnak, ezért az értékeket mindig aktuális
            helyzetképnek érdemes tekinteni, nem abszolút ígéretnek az egész napra.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Szerkesztési megközelítés</h2>
          <p>
            A magyarázó anyagok és oldalszövegek célja a közérthetőség. Igyekszünk elkerülni a
            szenzációhajhász megfogalmazásokat, különválasztani a mérhető adatokat az értelmezéstől,
            és jelezni, ha egy előrejelzés bizonytalanabb vagy távolabbi időszakra vonatkozik.
          </p>
          <p>
            A közérzetről szóló részek tájékoztató jellegűek. Nem állítjuk, hogy minden ember
            azonos módon reagál a geomágneses aktivitásra, és nem helyettesítünk orvosi tanácsot.
            Tartós vagy erős tünetek esetén szakemberhez kell fordulni.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Kinek lehet hasznos</h2>
          <p>
            A Magnitca hasznos lehet azoknak, akik napi szinten figyelik a mágneses viharokat,
            időjárásra érzékenyek, érdeklődnek a Nap aktivitása iránt, vagy egyszerűen szeretnének
            gyors képet kapni az aktuális űridőjárási helyzetről.
          </p>
          <p>
            A magyar verzió első lépésben az alapoldalakat és a fő mutatókat tartalmazza. A városi
            struktúra később külön rétegként bővíthető, hogy a helyi keresésekhez is természetesebb
            oldalak készüljenek.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Módszertan és tudományos korlátok</h2>
          <p>
            A „közérzetre gyakorolt hatás” és az „érzékenységi szint” mutatók heurisztikus becslések,
            amelyek nyilvános adatokon alapulnak (a Kp-indexen és a geomágneses aktivitáson, ahol
            pedig megjelenik, a légnyomás változásain). Ezek általános tájékozódást szolgálnak, nem
            orvosi diagnózist vagy személyre szabott előrejelzést; mindenki másképp reagál.
          </p>
          <p>
            A geomágneses aktivitás és az emberi közérzet közötti kapcsolat tudományosan nincs
            szilárdan bizonyítva — a rendelkezésre álló kutatások korlátozottak és ellentmondásosak.
            A tartalom tájékoztató jellegű, és nem helyettesíti a szakszerű orvosi tanácsot.
            Egészségügyi panaszok esetén fordulj képzett orvoshoz.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Kapcsolat és felelősség</h2>
          <p>
            A projekt alapítója és szerkesztője{" "}
            <a href="https://www.facebook.com/golovne" target="_blank" rel="author noopener noreferrer" className="text-primary underline">
              Andrew Orobets
            </a>
            . A Magnitca nyilvános részét a projekt csapata tartja karban. Szerkesztőségi, jogi,
            partneri vagy technikai kérdésekkel a kapcsolat oldalon vagy emailben lehet elérni
            minket:{" "}
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
