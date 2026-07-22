import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

const EMAIL = "magnitca.c@gmail.com";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "pl");
}

export default function PolishContactsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Kontakt</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Masz propozycję, zauważyłeś błąd albo chcesz nawiązać współpracę? Napisz do nas na{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary underline">
            {EMAIL}
          </a>{" "}
          — odpowiadamy na wszystkie wiadomości.
        </p>
      </div>
    </main>
  );
}
