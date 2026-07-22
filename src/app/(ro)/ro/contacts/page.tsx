import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

const EMAIL = "magnitca.c@gmail.com";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "ro");
}

export default function RomanianContactsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Contacte</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Ai o propunere, ai observat o eroare sau vrei să discutăm despre colaborare? Scrie-ne la{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary underline">
            {EMAIL}
          </a>{" "}
          — răspundem la toate mesajele.
        </p>
      </div>
    </main>
  );
}
