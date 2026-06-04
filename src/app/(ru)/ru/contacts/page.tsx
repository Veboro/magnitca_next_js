import type { Metadata } from "next";
import { ContactForm } from "@/components/next/contact-form";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "ru");
}

export default function RussianContactsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Контакты</h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Есть предложение, заметили ошибку или хотите сотрудничать? Отправьте сообщение через
          форму или напишите нам на{" "}
          <a href="mailto:info@magnitca.com" className="text-primary underline">
            info@magnitca.com
          </a>
          .
        </p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ContactForm locale="ru" />
        <aside className="rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
          <h2 className="font-display text-xl font-bold text-foreground">Контактная информация</h2>
          <div className="mt-4 space-y-3">
            <p>
              <strong>Проект:</strong> Magnitca
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@magnitca.com" className="text-primary underline">
                info@magnitca.com
              </a>
            </p>
            <p>
              <strong>Формат:</strong> независимый цифровой информационный сервис о магнитных бурях,
              космической погоде и связанных прогнозах.
            </p>
            <p>
              Для юридических запросов, вопросов приватности, сотрудничества или сообщений об
              ошибках используйте форму на этой странице или email выше.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
