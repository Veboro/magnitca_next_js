import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

const EMAIL = "magnitca.c@gmail.com";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "uk");
}

export default function ContactsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Контакти</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Маєте пропозицію, помітили помилку або хочете співпрацювати? Напишіть нам на{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary underline">
            {EMAIL}
          </a>{" "}
          — відповідаємо на всі листи.
        </p>
      </div>
    </main>
  );
}
