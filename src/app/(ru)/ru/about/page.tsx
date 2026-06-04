import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("about", "/about", "ru");
}

export default function RussianAboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">О Магнитке</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          Магнитка — сервис мониторинга магнитных бурь, который объединяет данные NOAA, объяснения
          простым языком и отдельные SEO-страницы для новостей, городов и базовых запросов о
          космической погоде.
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Что это за проект</h2>
          <p>
            Магнитка — независимый цифровой проект о магнитных бурях, Kp индексе, солнечном ветре и
            космической погоде. Мы делаем публичный сервис, который помогает быстро понять текущую
            геомагнитную ситуацию, посмотреть прогноз и получить понятные объяснения без лишней
            сложности.
          </p>
          <p>
            В центре сайта — ежедневные показатели космической погоды, страницы городов, новости и
            справочные материалы. Часть страниц рендерится сервером как HTML-first контент, а
            живые виджеты после загрузки обновляются в браузере.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Откуда берутся данные</h2>
          <p>
            Для космической погоды мы используем открытые источники NOAA Space Weather Prediction
            Center. Для локальных погодных и воздушных показателей используются данные Open-Meteo и
            связанных с ним открытых наборов.
          </p>
          <p>
            Мы стараемся подавать эти данные в удобной форме, но сами не являемся первичным
            источником научных измерений. В случае расхождений приоритет имеют официальные
            источники-провайдеры.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Редакционный подход</h2>
          <p>
            Новости и объясняющие материалы готовятся редакционно на основе открытых источников,
            оперативных прогнозов и технических данных. Мы стараемся избегать сенсационности,
            отделять факты от интерпретаций и обновлять материалы, если появляются новые важные
            данные.
          </p>
          <p>
            Материалы о самочувствии носят информационный характер и не являются медицинской
            консультацией. Если вопрос касается здоровья, ориентируйтесь также на профессиональную
            медицинскую помощь.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">Кто отвечает за сайт</h2>
          <p>
            Публичную часть сайта поддерживает команда проекта Magnitca. Для редакционных,
            юридических или партнёрских запросов можно обращаться через страницу контактов или на
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
