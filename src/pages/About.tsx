import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";

const About = () => {
  usePageMeta(
    "Про нас — Магнітка | Моніторинг магнітних бур",
    "Магнітка — безкоштовний український сервіс моніторингу магнітних бур у реальному часі. Дані NOAA, Kp-індекс, вплив на здоров'я."
  );

  return (
  <main className="min-h-screen bg-background pt-20 pb-12">
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
        <ArrowLeft className="h-4 w-4" /> На головну
      </Link>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-mono mb-6">Про нас</h1>
      <div className="rounded-lg border border-border/50 bg-card p-6 sm:p-8 space-y-4 text-sm text-foreground/85 leading-relaxed">
        <p>
          <strong>Магнітка</strong> — це безкоштовний український сервіс моніторингу магнітних бур у реальному часі. Ми створили цей проєкт, щоб кожен українець міг легко відстежувати геомагнітну активність та її вплив на здоров'я.
        </p>
        <p>
          Наш сервіс використовує офіційні дані Національного управління океанічних і атмосферних досліджень США (NOAA), які оновлюються щохвилини. Ми відображаємо ключові показники космічної погоди — Kp-індекс, G-шкалу, швидкість сонячного вітру та стан міжпланетного магнітного поля.
        </p>
        <p>
          Наша мета — зробити складні наукові дані зрозумілими та доступними для кожного, хто піклується про своє здоров'я та хоче бути готовим до геомагнітних збурень.
        </p>
      </div>
    </div>
  </main>
  );
};

export default About;
