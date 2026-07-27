import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("privacy", "/privacy", "hu");
}

export default function HungarianPrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Adatvédelmi irányelvek</h1>
        <p className="text-sm text-muted-foreground">
          Utolsó frissítés: {new Date().toLocaleDateString("hu-HU", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Kik vagyunk</h2>
          <p>
            A webhely nyilvános részének üzemeltetője a Magnitca projekt csapata. Ebben a
            szabályzatban a „mi”, „szolgáltatás” és „webhely” kifejezések a magnitca.com címen
            elérhető Magnitca szolgáltatásra vonatkoznak.
          </p>
          <p>
            A Magnitca információs jellegű webhely mágneses viharokról, Kp-indexről, napszélről,
            holdfázisokról és kapcsolódó előrejelzésekről. A nyilvános tartalmak megtekintéséhez
            nincs szükség regisztrációra.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Milyen adatokat kezelhetünk</h2>
          <p>Az oldal használata során az alábbi adattípusokat kezelhetjük:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>a böngésző és eszköz technikai adatai, amelyek a webhely működéséhez szükségesek;</li>
            <li>oldalhasználati és látogatottsági adatok, ha az analitika aktív;</li>
            <li>azok az üzenetek, amelyeket önként küldesz el a kapcsolatfelvételi űrlapon;</li>
            <li>cookie-hozzájárulással kapcsolatos beállítások, ha ilyen banner vagy rendszer aktív.</li>
          </ul>
          <p>
            Normál böngészéshez nem kérünk egészségügyi, pénzügyi vagy más különleges személyes
            adatot. Ha kapcsolatba lépsz velünk, csak az általad megadott információkat használjuk a
            válaszadáshoz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Miért kezeljük az adatokat</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>a webhely oldalainak, grafikonjainak és funkcióinak megjelenítéséhez;</li>
            <li>hibajelentések, kérdések és együttműködési megkeresések feldolgozásához;</li>
            <li>a szolgáltatás biztonságának, stabilitásának és teljesítményének fenntartásához;</li>
            <li>a tartalom és felhasználói élmény javításához, ha analitika működik.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Jogalapok</h2>
          <p>Az adatkezelés alapja lehet:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>a webhely működtetéséhez és védelméhez fűződő jogos érdek;</li>
            <li>a hozzájárulás, különösen nem szükséges cookie-k és analitikai eszközök esetén;</li>
            <li>a felhasználó önkéntes megkeresésének teljesítése emailen vagy űrlapon keresztül.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Külső szolgáltatók</h2>
          <p>
            Használhatunk külső technikai szolgáltatókat tárhelyhez, infrastruktúrához,
            kapcsolatfelvételi űrlapokhoz, analitikához és hirdetésekhez. Ezek a szolgáltatók csak
            a szükséges technikai funkciók keretében kezelhetnek adatokat.
          </p>
          <p>
            Látogatottsági statisztikához például Google Analytics 4 használható. Ez technikai
            adatokat kezelhet az oldalmegtekintésekről, eszköztípusról, böngészőről, hozzávetőleges
            földrajzi információról és interakciókról.
          </p>
          <p>
            Az űridőjárási és meteorológiai adatok nyílt forrásokból, például NOAA SWPC és
            Open-Meteo rendszerekből származnak. Ezek az adatszolgáltatók nem kapják meg tőlünk a
            kapcsolatfelvételi űrlapon küldött üzeneteidet.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Hirdetések és hozzájárulás</h2>
          <p>
            A webhelyen a Google AdSense szolgáltatáson keresztül hirdetések jelenhetnek meg, és
            analitikai eszközök is használhatók. A hirdetések megjelenítéséhez és méréséhez, valamint
            statisztikák készítéséhez ezek a szolgáltatások cookie-kat állíthatnak be, és adatokat –
            köztük online azonosítót – kezelhetnek a hirdetések kézbesítése és hatékonyságuk mérése
            céljából.
          </p>
          <p>
            Az Európai Gazdasági Térségből (EGT) és az Egyesült Királyságból érkező látogatók számára
            a nem szükséges cookie-k használata előtt hozzájárulási banner jelenik meg, amelyet a
            Google által tanúsított hozzájárulás-kezelő platform (CMP) biztosít. A hirdetési és
            analitikai cookie-k csak a hozzájárulásod után kerülnek beállításra, és a hozzájárulást
            bármikor módosíthatod vagy visszavonhatod ugyanezen a banneren vagy az adatvédelmi
            beállításokban. Az EGT-n és az Egyesült Királyságon kívül a cookie-k a helyi
            jogszabályoknak megfelelően használhatók. Az adatokat a Google a saját adatvédelmi
            szabályzata szerint kezeli; lásd{" "}
            <a href="https://www.google.com/policies/privacy" className="text-primary underline">
              google.com/policies/privacy
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Adatmegőrzés</h2>
          <p>
            Az adatokat csak addig őrizzük meg, ameddig az adott célhoz indokolt. Technikai naplók
            és analitikai adatok a biztonság, statisztika és karbantartás miatt maradhatnak meg.
            Kapcsolatfelvételi üzeneteket hosszabb ideig is megőrizhetünk, ha ez a válaszadáshoz
            vagy a kommunikáció előzményeihez szükséges.
          </p>
          <p>
            Az analitikai adatok megőrzési ideje függhet a külső szolgáltatók, például a Google
            Analytics 4 beállításaitól is.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. Nemzetközi adattovábbítás</h2>
          <p>
            Egyes technikai szolgáltatók az Európai Gazdasági Térségen kívül is kezelhetnek
            adatokat. Ilyen esetekben a szolgáltató által biztosított szerződéses és szervezési
            garanciákra támaszkodunk, amennyiben ezek alkalmazhatók.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">9. Felhasználói jogok</h2>
          <p>Ha rád a GDPR vagy hasonló adatvédelmi szabályok vonatkoznak, jogosult lehetsz:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>hozzáférést kérni a személyes adataidhoz;</li>
            <li>pontatlan adatok helyesbítését kérni;</li>
            <li>bizonyos esetekben törlést kérni;</li>
            <li>az adatkezelés korlátozását vagy az ellene való tiltakozást kérni;</li>
            <li>hozzájárulás visszavonására, ha az adatkezelés hozzájáruláson alapul;</li>
            <li>panaszt tenni az illetékes adatvédelmi hatóságnál.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">10. Kapcsolat</h2>
          <p>
            Adatvédelemmel, felhasználói jogokkal vagy a webhely működésével kapcsolatos kérdés
            esetén írj nekünk:{" "}
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
