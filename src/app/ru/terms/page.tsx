import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("terms", "/terms", "ru");
}

export default function RussianTermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Условия использования</h1>
        <p className="text-sm text-muted-foreground">
          Последнее обновление: {new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Общие положения</h2>
          <p>
            Используя сайт Magnitca, вы соглашаетесь с этими условиями. Если вы не согласны с ними,
            пожалуйста, не используйте сайт.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Информационный характер сервиса</h2>
          <p>
            Сайт предоставляет информацию о магнитных бурях, космической погоде, Kp индексе,
            прогнозах и связанных материалах. Контент не является медицинской, финансовой,
            юридической или иной профессиональной консультацией.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Источники данных и точность</h2>
          <p>
            Мы используем открытые внешние источники, включая NOAA SWPC и Open-Meteo. Хотя мы
            стремимся к точности, мы не гарантируем безошибочность, полноту или непрерывную
            доступность каждого показателя или прогноза.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Допустимое использование</h2>
          <p>
            Вы можете использовать сайт для личного, информационного и законного использования.
            Запрещено вмешиваться в работу сайта, пытаться обходить технические ограничения,
            использовать сервис для злоупотреблений или незаконной автоматизации.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Интеллектуальная собственность</h2>
          <p>
            Дизайн сайта, тексты, редакционные материалы и другие элементы, созданные командой
            Magnitca, охраняются правами интеллектуальной собственности. Данные сторонних источников
            остаются предметом условий соответствующих провайдеров.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Ограничение ответственности</h2>
          <p>
            Сайт предоставляется “как есть”. Мы не несем ответственности за решения, принятые
            исключительно на основе информации с сайта, а также за косвенные убытки, потерю данных,
            перерывы в работе или временную недоступность сервиса.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">7. Изменения условий</h2>
          <p>
            Мы можем обновлять эти условия по мере развития сервиса. Актуальная редакция публикуется
            на этой странице с датой последнего обновления.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">8. Контакты</h2>
          <p>
            Если у вас есть вопросы по этим условиям, напишите нам на{" "}
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
