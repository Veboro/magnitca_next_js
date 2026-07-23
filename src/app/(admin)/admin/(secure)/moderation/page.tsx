import Link from "next/link";
import {
  getStormNoteCounts,
  listStormNotesAdmin,
  STORM_NOTE_STATUSES,
  type StormNoteStatus,
} from "@/lib/admin-storm-notes";
import { StormNoteModerationActions } from "@/components/admin/storm-note-moderation-actions";
import { StormNotesModeToggle } from "@/components/admin/storm-notes-mode-toggle";
import { getStormNotesMode } from "@/lib/app-settings";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<StormNoteStatus, string> = {
  pending: "У черзі",
  approved: "Схвалені",
  rejected: "Відхилені",
};

const LOCALE_FLAG: Record<string, string> = {
  uk: "🇺🇦",
  ru: "🇺🇦",
  pl: "🇵🇱",
  ro: "🇲🇩",
  hu: "🇭🇺",
  en: "🌍",
};

const SCALE_LABEL: Record<number, string> = {
  [-3]: "Дуже добре",
  [-2]: "Добре",
  [-1]: "Трохи краще",
  [0]: "Нейтрально",
  [1]: "Легкий дискомфорт",
  [2]: "Погано",
  [3]: "Дуже погано",
};

function toneClass(score: number) {
  if (score < 0) return "bg-emerald-500/10 text-emerald-600";
  if (score > 0) return "bg-red-500/10 text-red-600";
  return "bg-amber-500/10 text-amber-600";
}

function parseStatus(value: string | undefined): StormNoteStatus {
  return STORM_NOTE_STATUSES.includes(value as StormNoteStatus) ? (value as StormNoteStatus) : "pending";
}

export default async function AdminModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const status = parseStatus(statusParam);
  const [notes, counts, mode] = await Promise.all([
    listStormNotesAdmin(status),
    getStormNoteCounts(),
    getStormNotesMode(),
  ]);

  const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary">Moderation</p>
        <h1 className="font-display text-3xl font-bold">Модерація відгуків</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Оберіть режим публікації нових відгуків або переглядайте чергу нижче.
        </p>
      </div>

      <StormNotesModeToggle initialMode={mode} />

      <div className="flex flex-wrap gap-2">
        {STORM_NOTE_STATUSES.map((value) => {
          const active = value === status;
          return (
            <Link
              key={value}
              href={`/admin/moderation?status=${value}`}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "border border-border/60 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              {STATUS_LABEL[value]}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                  active ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                }`}
              >
                {counts[value]}
              </span>
            </Link>
          );
        })}
      </div>

      {notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/50 px-6 py-16 text-center text-sm text-muted-foreground">
          Немає відгуків зі статусом «{STATUS_LABEL[status]}».
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const name = note.display_name?.trim() || "Анонім";
            const meta: string[] = [];
            if (note.age) meta.push(String(note.age));
            if (note.gender === "female") meta.push("жінка");
            else if (note.gender === "male") meta.push("чоловік");
            return (
              <article
                key={note.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-base" aria-hidden>
                      {LOCALE_FLAG[note.locale] ?? "🌍"}
                    </span>
                    <span className="font-semibold text-foreground">{name}</span>
                    {meta.length > 0 ? (
                      <span className="text-xs text-muted-foreground">{meta.join(" · ")}</span>
                    ) : null}
                    <span className="font-mono text-[11px] uppercase text-muted-foreground">{note.locale}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${toneClass(note.feeling_score)}`}
                    >
                      {SCALE_LABEL[note.feeling_score] ?? note.feeling_score}
                    </span>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{note.body}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span>{dateFormatter.format(new Date(`${note.response_date}T12:00:00`))}</span>
                    {note.kp_now !== null ? <span>Kp {Number(note.kp_now).toFixed(1)}</span> : null}
                    <span>👍 {note.helpful_count ?? 0}</span>
                  </div>
                </div>
                <div className="shrink-0 sm:pl-4">
                  <StormNoteModerationActions id={note.id} status={note.status} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
