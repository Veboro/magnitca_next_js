import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("about", "/about", "uk");
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Про Магнітку</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          Магнітка — український сервіс моніторингу магнітних бур, який поєднує дані NOAA,
          пояснення простою мовою та окремі SEO-сторінки для новин, міст і базових запитів про
          космічну погоду.
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Що це за проєкт</h2>
          <p>
            Магнітка — незалежний цифровий проєкт про магнітні бурі, Kp-індекс, сонячний вітер і
            космічну погоду. Ми робимо публічний сервіс, який допомагає швидко зрозуміти поточну
            геомагнітну ситуацію, переглянути прогноз і знайти пояснення без складної наукової
            термінології.
          </p>
          <p>
            У фокусі сайту — щоденні показники космічної погоди, міські сторінки, новини та
            довідкові матеріали. Частина сторінок рендериться сервером як HTML-first контент, а
            живі віджети після завантаження оновлюються в браузері.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Звідки беруться дані</h2>
          <p>
            Для космічної погоди ми використовуємо відкриті джерела NOAA Space Weather Prediction
            Center. Для локальних погодних і повітряних показників використовуються дані Open-Meteo
            та пов’язаних з ним відкритих наборів.
          </p>
          <p>
            Ми намагаємось подавати ці дані в зручній формі, але самі не є первинним джерелом
            наукових вимірювань. У разі розбіжностей пріоритет мають офіційні джерела-провайдери.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Редакційний підхід</h2>
          <p>
            Новини та пояснювальні матеріали готуються редакційно на основі відкритих джерел,
            оперативних прогнозів і технічних даних. Ми прагнемо уникати сенсаційності, відділяти
            факти від інтерпретацій і оновлювати матеріали, якщо з’являються нові суттєві дані.
          </p>
          <p>
            Матеріали про самопочуття мають інформаційний характер і не є медичною консультацією.
            Якщо йдеться про здоров’я, орієнтуйтесь також на професійну медичну допомогу.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Методологія та наукові обмеження</h2>
          <p>
            Показники «вплив на самопочуття» та «рівень чутливості» — це евристичні оцінки на основі
            відкритих даних (Kp-індексу й геомагнітної активності, а де показано — змін атмосферного
            тиску). Це загальний орієнтир, а не медичний діагноз чи персональний прогноз; кожна людина
            реагує по-різному.
          </p>
          <p>
            Зв’язок між геомагнітною активністю та самопочуттям людини науково не доведений остаточно —
            наявні дослідження обмежені й дають неоднозначні результати. Матеріали мають інформаційний
            характер і не замінюють професійної медичної консультації. За наявності проблем зі здоров’ям
            звертайтеся до кваліфікованого лікаря.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Хто відповідає за сайт</h2>
          <p>
            Засновник і редактор проєкту —{" "}
            <a href="https://www.facebook.com/golovne" target="_blank" rel="author noopener noreferrer" className="text-primary underline">
              Andrew Orobets
            </a>
            . Публічну частину сайту підтримує команда проєкту Magnitca. Для редакційних, юридичних
            або партнерських запитів можна звертатися через сторінку контактів або на
            {" "}
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
