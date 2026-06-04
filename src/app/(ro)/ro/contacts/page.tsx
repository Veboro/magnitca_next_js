import type { Metadata } from "next";
import { ContactForm } from "@/components/next/contact-form";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "ro");
}

export default function RomanianContactsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Contacte</h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Ai o propunere, ai observat o eroare sau vrei să discutăm despre colaborare? Scrie-ne prin
          formular sau la{" "}
          <a href="mailto:info@magnitca.com" className="text-primary underline">
            info@magnitca.com
          </a>
          .
        </p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ContactForm locale="ro" />
        <aside className="rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
          <h2 className="font-display text-xl font-bold text-foreground">Informații de contact</h2>
          <div className="mt-4 space-y-3">
            <p>
              <strong>Proiect:</strong> Magnitca Moldova
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@magnitca.com" className="text-primary underline">
                info@magnitca.com
              </a>
            </p>
            <p>
              <strong>Format:</strong> serviciu digital informativ despre furtuni magnetice, vreme
              spațială și prognoze asociate.
            </p>
            <p>
              Răspundem în special la întrebări despre funcționarea site-ului, corectarea datelor,
              propuneri de parteneriat, observații editoriale și probleme tehnice. Pentru întrebări
              medicale sau urgențe, te rugăm să contactezi un specialist sau serviciile competente.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
