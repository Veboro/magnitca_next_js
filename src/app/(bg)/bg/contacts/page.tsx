import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

const EMAIL = "magnitca.c@gmail.com";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "bg");
}

export default function BulgarianContactsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Контакт</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Имате въпрос, открихте грешка или искате да предложите сътрудничество? Пишете ни на този
          адрес:{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary underline">
            {EMAIL}
          </a>{" "}
          — отговаряме на всяко писмо.
        </p>
      </div>
    </main>
  );
}
