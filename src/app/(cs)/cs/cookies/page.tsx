import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("cookies", "/cookies", "cs");
}

export default function CzechCookiesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Zásady používání cookies</h1>
        <p className="text-sm text-muted-foreground">
          Poslední aktualizace: {new Date().toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Co jsou cookies</h2>
          <p>
            Cookie je malý textový soubor, který web může uložit v prohlížeči. Může
            pomoci uchovat technická nastavení, jazykové preference, volbu motivu nebo
            statistické informace.
          </p>
          <p>
            Kromě cookies lze používat i podobné technologie, například lokální data
            ukládaná v prohlížeči, technické identifikátory nebo měřicí pixely. V těchto
            zásadách používáme pojem „cookie“ v širším smyslu i pro tato řešení.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Jaké cookies může web používat</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>nezbytné cookies, které jsou potřebné pro fungování základního rozhraní;</li>
            <li>cookies pro nastavení, například pro uložení jazyka, motivu nebo stavu souhlasu;</li>
            <li>analytické cookies, pokud je měření návštěvnosti aktivní, například prostřednictvím Google Analytics 4;</li>
            <li>cookies externích poskytovatelů, pokud fungují reklamy nebo vložené služby.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Jak je používáme</h2>
          <p>
            Cookies můžeme používat pro technické fungování webu, pro uložení základních
            uživatelských nastavení a při zvláštním souhlasu — pro analytiku nebo jiné nepovinné
            funkce.
          </p>
          <p>
            Pokud je Google Analytics 4 aktivní, analytické cookies mohou pomoci porozumět
            zobrazení stránek, zdrojům návštěvnosti, interakcím s obsahem a
            obecným vzorcům používání. Tato data slouží ke zlepšování struktury a
            použitelnosti webu.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Reklamy a externí služby</h2>
          <p>
            Web může používat i reklamní systémy, například Google AdSense. Tito poskytovatelé
            mohou používat vlastní cookies nebo podobné technologie pro zobrazování, měření
            reklam a předcházení zneužití.
          </p>
          <p>
            Na zpracování dat externími poskytovateli se vztahují i jejich vlastní zásady.
            Magnitca sama neurčuje pravidla fungování každého reklamního systému.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Správa cookies</h2>
          <p>
            Cookies můžete spravovat nebo mazat v nastavení prohlížeče. Pokud web
            zobrazuje banner se souhlasem, můžete tam také přijmout nebo odmítnout nepovinné
            cookies.
          </p>
          <p>
            Vypnutí nezbytných cookies může ovlivnit fungování určitých funkcí.
            Omezení analytických nebo reklamních cookies obvykle nebrání
            prohlížení základního obsahu.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Dotazy</h2>
          <p>
            Máte-li dotazy k používání cookies, napište nám:{" "}
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
