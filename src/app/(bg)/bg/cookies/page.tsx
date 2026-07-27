import type { Metadata } from "next";
import { resolveLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveLocalizedMetadata("cookies", "/cookies", "bg");
}

export default function BulgarianCookiesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Политика за бисквитките</h1>
        <p className="text-sm text-muted-foreground">
          Последна актуализация: {new Date().toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="mt-8 space-y-6 rounded-3xl border border-border/50 bg-card p-6 text-sm leading-7 text-foreground/85 shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">1. Какво представляват бисквитките</h2>
          <p>
            Бисквитката е малък текстов файл, който сайтът може да съхрани в браузъра. Тя може да
            помогне за запазването на технически настройки, езикови предпочитания, избор на тема или
            статистическа информация.
          </p>
          <p>
            Освен бисквитки могат да се използват и подобни технологии, например локални данни,
            съхранявани в браузъра, технически идентификатори или пиксели за измерване. В настоящата
            политика използваме понятието „бисквитка“ в по-широк смисъл и за тези решения.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">2. Какви бисквитки може да използва сайтът</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>необходими бисквитки, които са нужни за работата на основния интерфейс;</li>
            <li>бисквитки за настройки, например за запазване на език, тема или състояние на съгласието;</li>
            <li>аналитични бисквитки, ако измерването на посещаемостта е активно, например чрез Google Analytics 4;</li>
            <li>бисквитки на външни доставчици, ако работят реклами или вградени услуги.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">3. Как ги използваме</h2>
          <p>
            Можем да използваме бисквитки за техническата работа на сайта, за запазване на основни
            потребителски настройки, а при отделно съгласие — за анализи или други незадължителни
            функции.
          </p>
          <p>
            Ако Google Analytics 4 е активен, аналитичните бисквитки могат да помогнат за разбирането
            на прегледите на страници, източниците на трафик, взаимодействията със съдържанието и
            общите модели на използване. Тези данни служат за подобряване на структурата и
            използваемостта на сайта.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">4. Реклами и външни услуги</h2>
          <p>
            Сайтът може да използва и рекламни системи, например Google AdSense. Тези доставчици
            могат да прилагат собствени бисквитки или подобни технологии за показването, измерването
            на рекламите и предотвратяването на злоупотреби.
          </p>
          <p>
            За обработката на данни от външните доставчици важат и техните собствени политики.
            Magnitca не определя самостоятелно правилата за работа на всяка рекламна система.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">5. Управление на бисквитките</h2>
          <p>
            Можете да управлявате или изтривате бисквитките в настройките на браузъра. Ако сайтът
            показва банер за съгласие, там също можете да приемете или откажете незадължителните
            бисквитки.
          </p>
          <p>
            Изключването на необходимите бисквитки може да повлияе на работата на определени функции.
            Ограничаването на аналитичните или рекламните бисквитки обикновено не пречи на
            разглеждането на основното съдържание.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">6. Въпроси</h2>
          <p>
            Ако имате въпроси относно използването на бисквитки, пишете ни:{" "}
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
