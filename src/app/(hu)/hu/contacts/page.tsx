import type { Metadata } from "next";
import { ContactForm } from "@/components/next/contact-form";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "hu");
}

export default function HungarianContactsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Kapcsolat</h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Kérdésed van, hibát találtál, vagy együttműködést javasolnál? Írj az űrlapon keresztül
          vagy közvetlenül erre a címre:{" "}
          <a href="mailto:info@magnitca.com" className="text-primary underline">
            info@magnitca.com
          </a>
          .
        </p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ContactForm locale="hu" />
        <aside className="rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
          <h2 className="font-display text-xl font-bold text-foreground">Kapcsolati információk</h2>
          <div className="mt-4 space-y-3">
            <p>
              <strong>Projekt:</strong> Magnitca Magyarország
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@magnitca.com" className="text-primary underline">
                info@magnitca.com
              </a>
            </p>
            <p>
              <strong>Formátum:</strong> digitális információs szolgáltatás mágneses viharokról,
              űridőjárásról és kapcsolódó előrejelzésekről.
            </p>
            <p>
              Hibajelentéseket, fordítási észrevételeket, együttműködési javaslatokat, adatforrásokkal
              kapcsolatos megjegyzéseket és technikai problémákat is ezen az oldalon keresztül
              várunk.
            </p>
            <p>
              Egészségügyi kérdésekben nem adunk egyéni tanácsadást. Ha a mágneses viharokkal vagy
              időjárási változásokkal összefüggésben tartós tüneteket tapasztalsz, fordulj orvoshoz
              vagy megfelelő szakemberhez.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
