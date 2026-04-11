import type { Metadata } from "next";
import { ContactForm } from "@/components/next/contact-form";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("contacts", "/contacts", "uk");
}

export default function ContactsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Контакти</h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Маєте пропозицію, помітили помилку або хочете співпрацювати? Надішліть повідомлення через
          форму або напишіть нам на
          {" "}
          <a href="mailto:info@magnitca.com" className="text-primary underline">
            info@magnitca.com
          </a>
          .
        </p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ContactForm />
        <aside className="rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
          <h2 className="font-display text-xl font-bold text-foreground">Реквізити для зв’язку</h2>
          <div className="mt-4 space-y-3">
            <p>
              <strong>Проєкт:</strong> Magnitca
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@magnitca.com" className="text-primary underline">
                info@magnitca.com
              </a>
            </p>
            <p>
              <strong>Формат:</strong> незалежний цифровий інформаційний сервіс про магнітні бурі,
              космічну погоду та пов’язані прогнози.
            </p>
            <p>
              Для юридичних запитів, питань приватності, співпраці або повідомлень про помилки
              використовуйте форму на цій сторінці або email вище.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
