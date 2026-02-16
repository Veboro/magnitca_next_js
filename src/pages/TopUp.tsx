import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowLeft, Coins, CreditCard, Sparkles } from "lucide-react";
import { toast } from "sonner";

const plans = [
  { amount: 10, price: "29 ₴", popular: false },
  { amount: 30, price: "69 ₴", popular: true },
  { amount: 100, price: "149 ₴", popular: false },
];

const TopUp = () => {
  usePageMeta(
    "Поповнити бали — Магнітка",
    "Поповніть баланс балів для спілкування з ШІ-асистентом з космічної погоди."
  );

  const handleBuy = (amount: number) => {
    toast.info(`Оплата тимчасово недоступна. Буде додано ${amount} балів після інтеграції платіжної системи.`);
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <main className="mx-auto max-w-xl space-y-6 p-6">
        <a
          href="/profile"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад до профілю
        </a>

        <div className="rounded-lg border border-border/50 bg-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Coins className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Поповнити бали</h1>
            <p className="text-sm text-muted-foreground">
              Бали використовуються для спілкування з ШІ-асистентом з космічної погоди
            </p>
          </div>

          <div className="space-y-3">
            {plans.map((plan) => (
              <button
                key={plan.amount}
                onClick={() => handleBuy(plan.amount)}
                className={`relative w-full flex items-center justify-between rounded-lg border p-4 transition-all hover:scale-[1.01] active:scale-[0.99] ${
                  plan.popular
                    ? "border-primary/50 bg-primary/5 shadow-sm shadow-primary/10"
                    : "border-border/50 bg-secondary/20 hover:border-primary/30"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-mono font-bold text-primary-foreground">
                    Популярний
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">{plan.amount} балів</p>
                    <p className="text-xs text-muted-foreground">≈ {plan.amount} повідомлень</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold text-foreground">{plan.price}</span>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>

          <p className="text-center text-[11px] text-muted-foreground/60 font-mono">
            * Платіжна система буде інтегрована найближчим часом
          </p>
        </div>
      </main>
    </div>
  );
};

export default TopUp;
