import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("privacy", "/privacy", "ru");
}

export default function RussianPrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Политика конфиденциальности</h1>
        <p className="text-sm text-muted-foreground">
          Последнее обновление:{" "}
          {new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Кто мы</h2>
          <p>
            Оператором публичной части сайта является команда проекта Magnitca. В этой политике
            местоимения “мы”, “нас” и “сайт” означают сервис Magnitca, доступный по адресу
            magnitca.com.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Какие данные мы собираем</h2>
          <p>Мы можем обрабатывать следующие категории данных:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>технические данные браузера и устройства, необходимые для работы сайта;</li>
            <li>данные об использовании сайта и страниц, если включена аналитика;</li>
            <li>сообщения, которые вы добровольно отправляете через контактную форму;</li>
            <li>данные о согласии или отказе в отношении cookie, если используется баннер согласия.</li>
          </ul>
          <p>
            Мы не требуем регистрации для публичной части сайта и не просим вводить чувствительные
            персональные данные для обычного просмотра контента.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Для чего мы обрабатываем данные</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>чтобы предоставлять доступ к страницам и функциям сайта;</li>
            <li>чтобы обрабатывать ваши обращения, сообщения об ошибках и запросы о сотрудничестве;</li>
            <li>чтобы обеспечивать безопасность, стабильность и техническую работоспособность сервиса;</li>
            <li>чтобы анализировать использование сайта и улучшать контент и UX, если аналитика активна.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Правовые основания</h2>
          <p>Мы обрабатываем данные на следующих основаниях:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>наш законный интерес в обеспечении работы, безопасности и поддержке сайта;</li>
            <li>ваше согласие — для non-essential cookie и связанных инструментов, если они используются;</li>
            <li>выполнение ваших запросов, когда вы сами обращаетесь к нам через форму или email.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Кому могут передаваться данные</h2>
          <p>
            Мы можем использовать внешних технических провайдеров для хостинга, доставки почтовых
            форм, инфраструктуры и аналитики. Такие провайдеры обрабатывают данные только в рамках
            необходимых технических функций.
          </p>
          <p>
            В частности, для статистики посещаемости мы можем использовать Google Analytics 4.
            Этот сервис может получать технические данные о просмотре страниц, взаимодействии с
            контентом, приблизительной географии, типе устройства, браузере и других агрегированных
            событиях использования сайта.
          </p>
          <p>
            Для работы сайта также используются открытые источники данных, включая NOAA SWPC и
            Open-Meteo. Они являются источниками показателей космической погоды и метеоданных, но
            не получают от нас ваши контактные сообщения.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Срок хранения данных</h2>
          <p>
            Мы храним данные только столько, сколько это разумно необходимо для цели обработки.
            Технические журналы и аналитические данные могут храниться в течение срока, нужного для
            безопасности, статистики и поддержки сайта. Сообщения из контактной формы могут
            храниться дольше, если это требуется для ответа или истории коммуникации.
          </p>
          <p>
            Срок хранения статистических данных также может зависеть от настроек внешних
            аналитических сервисов, которые мы используем, включая Google Analytics 4.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Передача за пределы ЕЭЗ</h2>
          <p>
            Часть технических провайдеров может обрабатывать данные за пределами Европейской
            экономической зоны. В таких случаях мы опираемся на договорные и организационные
            механизмы, которые провайдер заявляет для международной передачи данных, если это
            применимо.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. Ваши права</h2>
          <p>Если на вас распространяется GDPR или аналогичные правила, вы можете иметь право на:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>доступ к своим персональным данным;</li>
            <li>исправление неточных данных;</li>
            <li>удаление данных в определённых случаях;</li>
            <li>ограничение или возражение против обработки;</li>
            <li>отзыв согласия, если обработка основана на согласии;</li>
            <li>подачу жалобы в компетентный орган по защите данных.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">9. Как связаться с нами</h2>
          <p>
            Если у вас есть вопросы по приватности, правам субъекта данных или работе сайта,
            напишите нам на{" "}
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
