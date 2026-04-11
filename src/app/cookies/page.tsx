import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("cookies", "/cookies", "uk");
}

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Політика cookie</h1>
        <p className="text-sm text-muted-foreground">
          Останнє оновлення: {new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Що таке cookie</h2>
          <p>
            Cookie — це невеликий текстовий файл, який сайт зберігає у вашому браузері, щоб
            запам’ятати технічні налаштування, вибір користувача або статистику взаємодії із сайтом.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Які cookie може використовувати сайт</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>essential cookie, потрібні для базової роботи інтерфейсу;</li>
            <li>cookie налаштувань, наприклад для збереження мовних або consent-параметрів;</li>
            <li>аналітичні cookie, якщо на сайті увімкнена статистика відвідувань;</li>
            <li>third-party cookie, якщо використовуються зовнішні вбудовані сервіси.</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Як ми їх використовуємо</h2>
          <p>
            Ми використовуємо cookie для технічної працездатності сайту, збереження базових
            користувацьких налаштувань і, за наявності окремої згоди, для аналітики або інших
            non-essential сценаріїв.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Керування cookie</h2>
          <p>
            Ви можете керувати cookie через налаштування браузера. Якщо на сайті використовується
            банер згоди, ви також можете приймати або відхиляти non-essential cookie через нього.
            Вимкнення essential cookie може вплинути на роботу окремих функцій сайту.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Питання щодо cookie</h2>
          <p>
            Якщо у вас є питання щодо використання cookie, напишіть нам на{" "}
            <a href="mailto:info@magnitca.com" className="text-primary underline">
              info@magnitca.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
