import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("privacy", "/privacy", "cs");
}

export default function CzechPrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Zásady ochrany osobních údajů</h1>
        <p className="text-sm text-muted-foreground">
          Poslední aktualizace: {new Date().toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Kdo jsme</h2>
          <p>
            Veřejnou část webu provozuje tým projektu Magnitca. V těchto zásadách se výrazy
            „my“, „služba“ a „web“ vztahují ke službě Magnitca, dostupné na adrese magnitca.com.
          </p>
          <p>
            Magnitca je informační web o magnetických bouřích, Kp-indexu, slunečním větru, fázích
            Měsíce a souvisejících předpovědích. K prohlížení veřejného obsahu není nutná
            registrace.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Jaké údaje zpracováváme</h2>
          <p>Při používání webu můžeme zpracovávat následující typy údajů:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>technické údaje o prohlížeči a zařízení, které jsou nezbytné pro fungování webu;</li>
            <li>údaje o používání a návštěvnosti stránek, pokud jsou analytické nástroje aktivní;</li>
            <li>zprávy, které dobrovolně odesíláte prostřednictvím kontaktního formuláře;</li>
            <li>nastavení související se souhlasem s cookies, pokud je takový banner nebo systém aktivní.</li>
          </ul>
          <p>
            K běžnému prohlížení nepožadujeme zdravotní, finanční ani jiné zvláštní osobní
            údaje. Pokud nás kontaktujete, používáme pouze vámi poskytnuté informace, abychom
            vám mohli odpovědět.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Proč údaje zpracováváme</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>pro zobrazování stránek, grafů a funkcí webu;</li>
            <li>pro zpracování hlášení chyb, dotazů a návrhů na spolupráci;</li>
            <li>pro udržení bezpečnosti, stability a výkonu služby;</li>
            <li>pro zlepšování obsahu a uživatelského zážitku, pokud analytické nástroje fungují.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Právní základy</h2>
          <p>Základem pro zpracování údajů může být:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>oprávněný zájem související s fungováním a ochranou webu;</li>
            <li>souhlas, zejména u nepovinných cookies a analytických nástrojů;</li>
            <li>vyřízení dobrovolného dotazu uživatele e-mailem nebo prostřednictvím formuláře.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Externí poskytovatelé</h2>
          <p>
            Můžeme využívat externí technické poskytovatele pro hosting, infrastrukturu, kontaktní
            formuláře, analytiku a reklamu. Tito poskytovatelé mohou zpracovávat údaje pouze v rámci
            nezbytných technických funkcí.
          </p>
          <p>
            Pro statistiku návštěvnosti může být použit například Google Analytics 4. Ten
            může zpracovávat technické údaje o zobrazení stránek, typu zařízení, prohlížeči,
            přibližné geografické informaci a interakcích.
          </p>
          <p>
            Údaje o kosmickém počasí a meteorologii pocházejí z otevřených zdrojů, například
            ze systémů NOAA SWPC a Open-Meteo. Tito poskytovatelé dat od nás nedostávají
            zprávy odeslané prostřednictvím kontaktního formuláře.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Reklama a souhlas</h2>
          <p>
            Na webu se může zobrazovat reklama prostřednictvím Google AdSense a mohou být používány
            analytické nástroje. Pro zobrazování a měření reklamy a pro tvorbu statistik mohou tyto
            služby ukládat soubory cookie a zpracovávat údaje, včetně online identifikátoru, za
            účelem doručování reklamy a měření její účinnosti.
          </p>
          <p>
            Pro návštěvníky z Evropského hospodářského prostoru (EHP) a Spojeného království se před
            použitím nepovinných souborů cookie zobrazuje banner souhlasu — platforma pro správu
            souhlasu (CMP) certifikovaná společností Google. Reklamní a analytické soubory cookie se
            ukládají až po vašem souhlasu a souhlas můžete kdykoli změnit nebo odvolat prostřednictvím
            stejného banneru nebo nastavení soukromí. Mimo EHP a Spojené království mohou být soubory
            cookie používány v souladu s místními právními předpisy. Údaje zpracovává společnost
            Google v souladu se svými zásadami ochrany osobních údajů; viz{" "}
            <a href="https://www.google.com/policies/privacy" className="text-primary underline">
              google.com/policies/privacy
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Uchovávání údajů</h2>
          <p>
            Údaje uchováváme pouze tak dlouho, jak je to pro daný účel odůvodněné.
            Technické protokoly a analytická data mohou být uchovány z důvodů souvisejících
            s bezpečností, statistikou a údržbou. Kontaktní zprávy můžeme uchovávat
            i déle, pokud je to nutné pro odpověď nebo pro historii komunikace.
          </p>
          <p>
            Doba uchování analytických dat může záviset také na nastavení
            externích poskytovatelů, například Google Analytics 4.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. Mezinárodní předávání údajů</h2>
          <p>
            Někteří techničtí poskytovatelé mohou zpracovávat údaje i mimo Evropský
            hospodářský prostor. V takových případech se spoléháme na smluvní a organizační
            záruky poskytnuté poskytovatelem, pokud jsou použitelné.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">9. Práva uživatelů</h2>
          <p>Pokud se na vás vztahuje GDPR nebo podobná pravidla na ochranu údajů, můžete mít právo:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>požádat o přístup ke svým osobním údajům;</li>
            <li>požádat o opravu nepřesných údajů;</li>
            <li>v určitých případech požádat o výmaz;</li>
            <li>požádat o omezení zpracování nebo proti němu vznést námitku;</li>
            <li>odvolat svůj souhlas, pokud je zpracování založeno na souhlasu;</li>
            <li>podat stížnost u příslušného úřadu pro ochranu osobních údajů.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">10. Kontakt</h2>
          <p>
            V případě dotazů souvisejících s ochranou údajů, právy uživatelů nebo fungováním
            webu nám napište:{" "}
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
