import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

const EMAIL = "magnitca.c@gmail.com";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "en");
}

export default function EnglishContactsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Contact</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Have a suggestion, found a mistake or want to collaborate? Email us at{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary underline">
            {EMAIL}
          </a>{" "}
          — we reply to every message.
        </p>
      </div>
    </main>
  );
}
