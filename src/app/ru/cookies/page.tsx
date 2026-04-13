import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("cookies", "/cookies", "ru");
}

export default function RussianCookiesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Политика cookie</h1>
        <p className="text-sm text-muted-foreground">
          Последнее обновление: {new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Что такое cookie</h2>
          <p>
            Cookie — это небольшой текстовый файл, который сайт сохраняет в вашем браузере, чтобы
            запомнить технические настройки, выбор пользователя или статистику взаимодействия с сайтом.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Какие cookie может использовать сайт</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>essential cookie, необходимые для базовой работы интерфейса;</li>
            <li>cookie настроек, например для сохранения языковых или consent-параметров;</li>
            <li>аналитические cookie, если на сайте включена статистика посещений, в том числе через Google Analytics 4;</li>
            <li>third-party cookie, если используются внешние встроенные сервисы.</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Как мы их используем</h2>
          <p>
            Мы используем cookie для технической работоспособности сайта, сохранения базовых
            пользовательских настроек и, при наличии отдельного согласия, для аналитики или других
            non-essential сценариев.
          </p>
          <p>
            Если на сайте активирован Google Analytics 4, аналитические cookie могут использоваться
            для подсчёта просмотров страниц, оценки источников трафика, анализа взаимодействия с
            контентом и общего улучшения структуры и удобства сайта.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Управление cookie</h2>
          <p>
            Вы можете управлять cookie через настройки браузера. Если на сайте используется баннер
            согласия, вы также можете принимать или отклонять non-essential cookie через него.
            Отключение essential cookie может повлиять на работу отдельных функций сайта.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Вопросы по cookie</h2>
          <p>
            Если у вас есть вопросы по использованию cookie, напишите нам на{" "}
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
