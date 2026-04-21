import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
const Privacy = () => {
  return (
  <main className="min-h-screen bg-background pt-20 pb-12">
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
        <ArrowLeft className="h-4 w-4" /> На головну
      </Link>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-mono mb-6">Політика конфіденційності</h1>
      <div className="rounded-lg border border-border/50 bg-card p-6 sm:p-8 space-y-4 text-sm text-foreground/85 leading-relaxed">
        <p>Останнє оновлення: {new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}</p>
        
        <h2 className="text-base font-semibold text-foreground pt-2">1. Збір даних</h2>
        <p>Сервіс «Магнітка» не збирає персональні дані користувачів. Ми не вимагаємо реєстрації та не зберігаємо особисту інформацію.</p>

        <h2 className="text-base font-semibold text-foreground pt-2">2. Файли cookie</h2>
        <p>Ми можемо використовувати технічні файли cookie для коректної роботи сайту та збереження налаштувань теми оформлення (світла/темна). Ці cookie не містять персональних даних.</p>

        <h2 className="text-base font-semibold text-foreground pt-2">3. Аналітика</h2>
        <p>Для покращення якості сервісу ми можемо збирати анонімну статистику відвідувань (кількість переглядів сторінок, тип пристрою, географія). Ці дані не дозволяють ідентифікувати конкретного користувача.</p>

        <h2 className="text-base font-semibold text-foreground pt-2">4. Зовнішні сервіси</h2>
        <p>Дані про космічну погоду отримуються з відкритого API NOAA Space Weather Prediction Center. Ми не передаємо жодних даних користувачів третім сторонам.</p>

        <h2 className="text-base font-semibold text-foreground pt-2">5. Контакти</h2>
        <p>З питань щодо конфіденційності звертайтесь на <a href="mailto:info@magnitca.com" className="text-primary hover:underline">info@magnitca.com</a>.</p>
      </div>
    </div>
  </main>
  );
};

export default Privacy;
