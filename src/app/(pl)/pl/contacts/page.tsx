import type { Metadata } from "next";
import { ContactForm } from "@/components/next/contact-form";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "pl");
}

export default function PolishContactsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Kontakt</h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Masz propozycję, zauważyłeś błąd albo chcesz nawiązać współpracę? Napisz do nas przez
          formularz lub wyślij wiadomość na{" "}
          <a href="mailto:info@magnitca.com" className="text-primary underline">
            info@magnitca.com
          </a>
          .
        </p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ContactForm locale="pl" />
        <aside className="rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
          <h2 className="font-display text-xl font-bold text-foreground">Informacje kontaktowe</h2>
          <div className="mt-4 space-y-3">
            <p>
              <strong>Projekt:</strong> Magnitca
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@magnitca.com" className="text-primary underline">
                info@magnitca.com
              </a>
            </p>
            <p>
              <strong>Format:</strong> niezależny cyfrowy serwis informacyjny o burzach
              magnetycznych, pogodzie kosmicznej i powiązanych prognozach.
            </p>
            <p>
              W sprawach prawnych, prywatności, współpracy lub zgłoszeń błędów skorzystaj z
              formularza na tej stronie albo z adresu email podanego wyżej.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
