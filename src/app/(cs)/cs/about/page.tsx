import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("about", "/about", "cs");
}

export default function CzechAboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">O projektu Magnitca</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          Magnitca zpřístupňuje data o kosmickém počasí, magnetických bouřích, Kp-indexu a slunečním
          větru prostřednictvím přehledného a snadno sledovatelného rozhraní.
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Co je to za projekt</h2>
          <p>
            Magnitca je nezávislý digitální projekt o magnetických bouřích, Kp-indexu, slunečním větru a
            kosmickém počasí. Naším cílem je zobrazovat technická data v jednoduché, rychle srozumitelné
            podobě, bez složitého vědeckého jazyka.
          </p>
          <p>
            Na úvodní stránce je rychle vidět, zda je geomagnetická situace klidná, nebo se
            očekává zvýšená aktivita. Zobrazujeme aktuální Kp-index, G-škálu NOAA, rychlost a
            hustotu slunečního větru a složku IMF Bz.
          </p>
          <p>
            Na webu najdete živé ukazatele kosmického počasí, předpovědi, kalendáře a
            vysvětlující stránky. Rozhraní je navrženo tak, aby důležité signály byly vidět
            jako první a podrobnější vysvětlení následovala v samostatných blocích.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Zdroje dat</h2>
          <p>
            Data o kosmickém počasí pocházejí z otevřených zdrojů NOAA Space Weather
            Prediction Center. Magnitca je shromažďuje, systematizuje a prezentuje v uživatelsky
            přívětivé podobě.
          </p>
          <p>
            Geomagnetické předpovědi se mohou během dne měnit, proto je vždy dobré
            vnímat hodnoty jako aktuální momentální obraz, nikoli jako absolutní příslib na celý
            den.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Redakční přístup</h2>
          <p>
            Vysvětlující materiály a texty stránek mají za cíl srozumitelnost a přístupnost.
            Snažíme se vyhýbat senzačním formulacím, oddělovat měřitelná data od
            interpretací a upozorňovat, když je určitá předpověď nejistější nebo se týká
            vzdálenějšího období.
          </p>
          <p>
            Sekce o pohodě mají informační charakter. Netvrdíme, že každý člověk
            reaguje na geomagnetickou aktivitu stejně, a nenahrazujeme lékařskou
            radu. Při dlouhotrvajících nebo silných příznacích je třeba vyhledat odborníka.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Komu může být užitečná</h2>
          <p>
            Magnitca může být užitečná těm, kdo denně sledují magnetické bouře, jsou citliví
            na počasí, zajímají se o aktivitu Slunce nebo si prostě chtějí rychle
            udělat představu o aktuální situaci kosmického počasí.
          </p>
          <p>
            Česká verze zpočátku obsahuje základní stránky a hlavní ukazatele.
            Struktura podle měst se může později rozšířit jako samostatná vrstva, aby pro
            lokální vyhledávání vznikly přirozenější stránky.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Metodika a vědecká omezení</h2>
          <p>
            Ukazatele „vliv na pohodu“ a „úroveň citlivosti“ jsou heuristické odhady založené na
            veřejných datech (Kp-indexu a geomagnetické aktivitě, a kde je zobrazena, na změnách
            atmosférického tlaku). Slouží jako obecná orientace, nikoli jako lékařská diagnóza či
            personalizovaná předpověď; každý člověk reaguje jinak.
          </p>
          <p>
            Souvislost mezi geomagnetickou aktivitou a lidskou pohodou není vědecky jednoznačně
            potvrzena — dostupné výzkumy jsou omezené a nejednoznačné. Obsah má informativní charakter
            a nenahrazuje odbornou lékařskou radu. Máte-li zdravotní potíže, obraťte se na
            kvalifikovaného lékaře.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Kontakt a odpovědnost</h2>
          <p>
            Zakladatelem a redaktorem projektu je{" "}
            <a href="https://www.facebook.com/golovne" target="_blank" rel="author noopener noreferrer" className="text-primary underline">
              Andrew Orobets
            </a>
            . Veřejnou část Magnitca provozuje tým projektu. V redakčních, právních,
            partnerských nebo technických záležitostech nás můžete kontaktovat na kontaktní stránce
            nebo e-mailem:{" "}
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
