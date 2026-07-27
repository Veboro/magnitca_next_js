import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

const EMAIL = "magnitca.c@gmail.com";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "cs");
}

export default function CzechContactsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Kontakt</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Máte dotaz, našli jste chybu nebo chcete navrhnout spolupráci? Napište nám na tuto
          adresu:{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary underline">
            {EMAIL}
          </a>{" "}
          — odpovídáme na každý e-mail.
        </p>
      </div>
    </main>
  );
}
