import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("terms", "/terms", "uk");
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Умови користування</h1>
        <p className="text-sm text-muted-foreground">
          Останнє оновлення: {new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Загальні положення</h2>
          <p>
            Використовуючи сайт Magnitca, ви погоджуєтесь з цими умовами. Якщо ви не погоджуєтесь
            з ними, будь ласка, не використовуйте сайт.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Інформаційний характер сервісу</h2>
          <p>
            Сайт надає інформацію про магнітні бурі, космічну погоду, Kp-індекс, прогнози та
            пов’язані матеріали. Контент не є медичною, фінансовою, юридичною чи іншою професійною
            консультацією.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Джерела даних і точність</h2>
          <p>
            Ми використовуємо відкриті зовнішні джерела, зокрема NOAA SWPC та Open-Meteo. Хоча ми
            прагнемо до точності, не гарантуємо безпомилковість, повноту або безперервну
            доступність кожного показника чи прогнозу.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Допустиме використання</h2>
          <p>
            Ви можете використовувати сайт для особистого, інформаційного та законного користування.
            Заборонено втручатися в роботу сайту, намагатися обходити технічні обмеження,
            використовувати сервіс для зловживань або незаконної автоматизації.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Інтелектуальна власність</h2>
          <p>
            Дизайн сайту, тексти, редакційні матеріали та інші елементи, створені командою Magnitca,
            охороняються правами інтелектуальної власності. Дані сторонніх джерел залишаються
            предметом умов відповідних провайдерів.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Обмеження відповідальності</h2>
          <p>
            Сайт надається “як є”. Ми не несемо відповідальності за рішення, прийняті виключно на
            основі інформації з сайту, а також за непрямі збитки, втрати даних, перерви в роботі чи
            тимчасову недоступність сервісу.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Зміни умов</h2>
          <p>
            Ми можемо оновлювати ці умови в міру розвитку сервісу. Актуальна редакція публікується
            на цій сторінці з датою останнього оновлення.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. Контакти</h2>
          <p>
            Якщо у вас є питання щодо цих умов, напишіть нам на{" "}
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
