import { Bell, Check, CheckCheck, AlertTriangle } from "lucide-react";
import type { UserNotification } from "@/hooks/useNotifications";

interface Props {
  notifications: UserNotification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
}

const stormLevelConfig: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: "Інфо", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  1: { label: "G1", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
  2: { label: "G2", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  3: { label: "G3", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  4: { label: "G4", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  5: { label: "G5", color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" },
};

const getConfig = (level: number) => stormLevelConfig[level] || stormLevelConfig[0];

export const NotificationsInbox = ({ notifications, loading, onMarkAsRead, onMarkAllAsRead, unreadCount }: Props) => {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Сповіщення
          {unreadCount > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1.5 text-xs font-mono text-primary hover:text-primary/80 transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Прочитати всі
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 space-y-3">
          <Bell className="h-10 w-10 text-muted-foreground/30 mx-auto" />
          <p className="text-sm text-muted-foreground">
            Поки немає сповіщень. Ми повідомимо, коли очікується магнітна буря.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const cfg = getConfig(n.storm_level);
            return (
              <div
                key={n.id}
                className={`rounded-lg border p-4 space-y-2 transition-all ${
                  n.is_read ? "bg-card/50 border-border/30 opacity-70" : `${cfg.bg}`
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${cfg.color}`} />
                    <span className={`text-xs font-mono font-bold ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-sm font-medium text-foreground">{n.title}</span>
                  </div>
                  {!n.is_read && (
                    <button
                      onClick={() => onMarkAsRead(n.id)}
                      className="flex-shrink-0 flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-primary transition-colors"
                      title="Позначити прочитаним"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{n.body}</p>
                <p className="text-[11px] font-mono text-muted-foreground/60">
                  {new Date(n.created_at).toLocaleDateString("uk-UA", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
