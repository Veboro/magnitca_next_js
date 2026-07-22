import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

const EMAIL = "magnitca.c@gmail.com";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "ru");
}

export default function RussianContactsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Контакты</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Есть предложение, заметили ошибку или хотите сотрудничать? Напишите нам на{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary underline">
            {EMAIL}
          </a>{" "}
          — отвечаем на все письма.
        </p>
      </div>
    </main>
  );
}
