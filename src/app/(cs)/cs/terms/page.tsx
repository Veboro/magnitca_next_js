import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("terms", "/terms", "cs");
}

export default function CzechTermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Podmínky použití</h1>
        <p className="text-sm text-muted-foreground">
          Poslední aktualizace: {new Date().toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Obecná ustanovení</h2>
          <p>
            Používáním webu Magnitca přijímáte tyto podmínky. Pokud s nimi nesouhlasíte,
            prosím službu nepoužívejte.
          </p>
          <p>
            Podmínky se vztahují na veřejné stránky webu, včetně obsahu o
            magnetických bouřích, Kp-indexu, slunečním větru, lunárním kalendáři, předpovědích a
            informačních článcích.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Informační charakter</h2>
          <p>
            Web poskytuje informace o magnetických bouřích, kosmickém počasí, Kp-indexu a
            souvisejících předpovědích. Obsah nepředstavuje lékařskou, právní, finanční ani jinou
            odbornou radu.
          </p>
          <p>
            Vysvětlení možných vlivů na organismus mají obecný charakter. Nezohledňují
            individuální zdravotní stav, užívané léky ani anamnézu.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Zdroje dat a přesnost</h2>
          <p>
            Používáme otevřené externí zdroje, mezi nimi data z NOAA SWPC a Open-Meteo.
            Usilujeme o přesnost, ale nezaručujeme bezchybnost, úplnost ani nepřetržitou
            dostupnost všech dat, grafů nebo předpovědí.
          </p>
          <p>
            Předpovědi kosmického počasí se mohou rychle měnit. Některé hodnoty mohou být
            opožděné kvůli problémům s externími zdroji, cache, infrastrukturou nebo sítí. Pro kritická
            rozhodnutí je vždy nutné ověřovat primární oficiální zdroje.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Přípustné použití</h2>
          <p>
            Web můžete používat pro osobní, informační a zákonné účely. Je zakázáno
            narušovat fungování služby, pokoušet se o neoprávněný přístup, obcházet
            technická omezení nebo provádět zneužívající automatizované stahování dat.
          </p>
          <p>
            Není povoleno hromadné kopírování obsahu bez svolení, odstraňování
            zdrojů ani vydávání materiálů vytvořených projektem Magnitca za vlastní
            obsah jiné služby.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Duševní vlastnictví</h2>
          <p>
            Texty, struktura, vizuální prvky webu a materiály vytvořené týmem
            Magnitca mohou být chráněny právem duševního vlastnictví. Na
            data z externích zdrojů se vztahují podmínky příslušných poskytovatelů.
          </p>
          <p>
            Na naše stránky můžete volně odkazovat. Krátké citace lze
            použít s uvedením zdroje, ale systematické přebírání obsahu nebo automatizovaný
            sběr obsahu může vyžadovat předchozí souhlas.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Omezení odpovědnosti</h2>
          <p>
            Služba je poskytována ve stavu „tak, jak je“. Neneseme odpovědnost za rozhodnutí učiněná
            výhradně na základě informací zveřejněných na webu, ani za nepřímé škody,
            ztrátu dat, přerušení služby nebo dočasnou nedostupnost.
          </p>
          <p>
            Při zdravotních obtížích je třeba vyhledat lékaře. Při technickém, energetickém,
            leteckém nebo jiném kritickém použití jsou rozhodující data a odborné
            protokoly příslušných oficiálních organizací.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Změna podmínek</h2>
          <p>
            S vývojem služby můžeme podmínky pravidelně aktualizovat. Aktuální verze
            je dostupná na této stránce spolu s datem poslední aktualizace.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. Kontakt</h2>
          <p>
            Máte-li dotazy k těmto podmínkám, napište nám:{" "}
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
