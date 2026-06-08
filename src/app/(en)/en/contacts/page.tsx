import type { Metadata } from "next";
import { ContactForm } from "@/components/next/contact-form";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "en");
}

export default function EnglishContactsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Contact</h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Have a suggestion, found a mistake or want to collaborate? Send a message through the
          form or email{" "}
          <a href="mailto:info@magnitca.com" className="text-primary underline">
            info@magnitca.com
          </a>
          .
        </p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ContactForm locale="en" />
        <aside className="rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
          <h2 className="font-display text-xl font-bold text-foreground">Contact details</h2>
          <div className="mt-4 space-y-3">
            <p>
              <strong>Project:</strong> Magnitca
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@magnitca.com" className="text-primary underline">
                info@magnitca.com
              </a>
            </p>
            <p>
              <strong>Format:</strong> independent digital information service about magnetic
              storms, space weather and related forecasts.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
