import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("privacy", "/privacy", "uk");
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Політика конфіденційності</h1>
        <p className="text-sm text-muted-foreground">
          Останнє оновлення: {new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Хто ми</h2>
          <p>
            Оператором публічної частини сайту є команда проєкту Magnitca. У цій політиці
            займенники “ми”, “нас” і “сайт” означають сервіс Magnitca, доступний за адресою
            magnitca.com.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Які дані ми збираємо</h2>
          <p>Ми можемо обробляти такі категорії даних:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>технічні дані браузера та пристрою, потрібні для роботи сайту;</li>
            <li>дані про використання сайту та сторінок, якщо увімкнена аналітика;</li>
            <li>повідомлення, які ви добровільно надсилаєте через контактну форму;</li>
            <li>дані про згоду або відмову щодо cookie, якщо використовується банер згоди.</li>
          </ul>
          <p>
            Ми не вимагаємо реєстрації для публічної частини сайту і не просимо вводити чутливі
            персональні дані для звичайного перегляду контенту.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Для чого ми обробляємо дані</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>щоб надавати доступ до сторінок і функцій сайту;</li>
            <li>щоб обробляти ваші звернення, повідомлення про помилки та запити на співпрацю;</li>
            <li>щоб забезпечувати безпеку, стабільність і технічну працездатність сервісу;</li>
            <li>щоб аналізувати використання сайту та покращувати контент і UX, якщо аналітика активна.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Правові підстави</h2>
          <p>Ми обробляємо дані на таких підставах:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>наш легітимний інтерес у забезпеченні роботи, безпеки та підтримці сайту;</li>
            <li>ваша згода — для non-essential cookie та пов’язаних інструментів, якщо вони використовуються;</li>
            <li>виконання ваших запитів, коли ви самі звертаєтесь до нас через форму або email.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Кому можуть передаватися дані</h2>
          <p>
            Ми можемо використовувати зовнішніх технічних провайдерів для хостингу, поштової
            доставки форм, інфраструктури та аналітики. Такі провайдери обробляють дані лише в
            межах потрібних технічних функцій.
          </p>
          <p>
            Зокрема, для статистики відвідувань ми можемо використовувати Google Analytics 4.
            Цей сервіс може отримувати технічні дані про перегляд сторінок, взаємодію з контентом,
            приблизну географію, тип пристрою, браузер та інші агреговані події використання сайту.
          </p>
          <p>
            Для роботи сайту також використовуються відкриті джерела даних, зокрема NOAA SWPC та
            Open-Meteo. Вони є джерелами показників космічної погоди та метеоданих, але не
            отримують від нас ваші контактні повідомлення.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Зберігання даних</h2>
          <p>
            Ми зберігаємо дані лише стільки, скільки це обґрунтовано потрібно для мети обробки.
            Технічні журнали та аналітичні дані можуть зберігатися протягом строку, потрібного для
            безпеки, статистики та підтримки сайту. Повідомлення з контактної форми можуть
            зберігатися довше, якщо це потрібно для відповіді або історії комунікації.
          </p>
          <p>
            Строк зберігання статистичних даних також може залежати від налаштувань зовнішніх
            аналітичних сервісів, які ми використовуємо, зокрема Google Analytics 4.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Передача за межі ЄЕЗ</h2>
          <p>
            Частина технічних провайдерів може обробляти дані за межами Європейської економічної
            зони. У таких випадках ми покладаємося на договірні та організаційні механізми, які
            провайдер заявляє для міжнародної передачі даних, якщо вони застосовні.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. Ваші права</h2>
          <p>Якщо на вас поширюється GDPR або подібні правила, ви можете мати право на:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>доступ до своїх персональних даних;</li>
            <li>виправлення неточних даних;</li>
            <li>видалення даних у певних випадках;</li>
            <li>обмеження або заперечення проти обробки;</li>
            <li>відкликання згоди, якщо обробка ґрунтується на згоді;</li>
            <li>подання скарги до компетентного органу захисту даних.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">9. Як зв’язатися з нами</h2>
          <p>
            Якщо у вас є питання щодо приватності, прав суб’єкта даних або роботи сайту, напишіть
            нам на
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
