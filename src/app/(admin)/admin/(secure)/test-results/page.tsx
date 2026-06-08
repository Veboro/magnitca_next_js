import { listTestResultsAdmin } from "@/lib/admin-content";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getScoreTone(score: number) {
  if (score >= 75) return "text-red-500";
  if (score >= 50) return "text-orange-500";
  if (score >= 25) return "text-amber-500";
  return "text-emerald-500";
}

function getAverage(items: Array<{ score: number }>) {
  if (!items.length) return 0;
  return Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length);
}

export default async function AdminTestResultsPage() {
  const results = await listTestResultsAdmin(300);
  const total = results.length;
  const average = getAverage(results);
  const highCount = results.filter((item) => item.score >= 75).length;
  const chronicCount = results.filter((item) => item.has_chronic).length;
  const byLocale = results.reduce<Record<string, number>>((acc, item) => {
    const locale = item.locale || "uk";
    acc[locale] = (acc[locale] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Аналітика</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Результати тестів</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Останні проходження тесту на метеозалежність. Показуються публічні та авторизовані результати.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Всього</p>
          <p className="mt-3 font-display text-3xl font-bold">{total}</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Середній бал</p>
          <p className={`mt-3 font-display text-3xl font-bold ${getScoreTone(average)}`}>{average}%</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Високі результати</p>
          <p className="mt-3 font-display text-3xl font-bold text-red-500">{highCount}</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Хронічні захворювання</p>
          <p className="mt-3 font-display text-3xl font-bold">{chronicCount}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Мови</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(byLocale).length ? (
            Object.entries(byLocale).map(([locale, count]) => (
              <span key={locale} className="rounded-full border border-border/50 bg-background/50 px-3 py-1 text-xs font-semibold uppercase">
                {locale}: {count}
              </span>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">Поки немає даних.</span>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
        <div className="border-b border-border/40 px-5 py-4">
          <h3 className="font-display text-xl font-bold">Останні проходження</h3>
        </div>
        {results.length === 0 ? (
          <div className="p-8 text-sm text-muted-foreground">Результати ще не зібрані.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="border-b border-border/40 bg-muted/20 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Дата</th>
                  <th className="px-5 py-3">Результат</th>
                  <th className="px-5 py-3">Користувач</th>
                  <th className="px-5 py-3">Дані</th>
                  <th className="px-5 py-3">Відповіді</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {results.map((item) => {
                  const answers = Array.isArray(item.answers) ? item.answers.join(", ") : "[]";
                  return (
                    <tr key={item.id} className="align-top">
                      <td className="px-5 py-4 text-muted-foreground">
                        <div>{formatDate(item.created_at)}</div>
                        <div className="mt-1 text-[11px] uppercase">{item.locale || "uk"}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className={`font-display text-2xl font-bold ${getScoreTone(item.score)}`}>{item.score}%</div>
                        <div className="mt-1 max-w-[220px] text-xs text-muted-foreground">{item.result_label || "Без мітки"}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-foreground">{item.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{item.user_id ? "Авторизований" : "Анонімний"}</div>
                      </td>
                      <td className="px-5 py-4 text-xs leading-5 text-muted-foreground">
                        <div>Вік: {item.age}</div>
                        <div>Стать: {item.gender}</div>
                        <div>Активність: {item.physical_activity || "—"}</div>
                        <div>Хронічні: {item.has_chronic ? "так" : "ні"}</div>
                      </td>
                      <td className="px-5 py-4">
                        <code className="rounded-md bg-background/60 px-2 py-1 text-xs text-muted-foreground">{answers}</code>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
