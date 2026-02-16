import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, LogOut, Settings, User } from "lucide-react";

export const UserProfileCard = ({ className }: { className?: string }) => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className={cn("rounded-lg border border-border/50 bg-card p-4 flex items-center justify-center", className)}>
        <span className="font-mono text-sm text-muted-foreground animate-pulse">...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn("rounded-lg border border-border/50 bg-card p-4 flex flex-col items-center justify-center gap-3 text-center", className)}>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-secondary/30">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-foreground">Ви не авторизовані</p>
          <p className="text-[10px] text-muted-foreground">Увійдіть для 27-денного прогнозу</p>
        </div>
        <a
          href="/auth"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 font-mono text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <LogIn className="h-3 w-3" />
          Увійти
        </a>
      </div>
    );
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Користувач";
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  return (
    <div className={cn("rounded-lg border border-border/50 bg-card p-4 flex flex-col justify-between gap-3", className)}>
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Профіль
      </h3>

      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-10 w-10 rounded-full border border-border/50 object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
          <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href="/profile"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border/50 bg-secondary/30 px-3 py-1.5 font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/60"
        >
          <Settings className="h-3 w-3" />
          Налаштування
        </a>
        <button
          onClick={() => signOut()}
          className="flex items-center justify-center gap-1.5 rounded-md border border-border/50 bg-secondary/30 px-3 py-1.5 font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/60"
        >
          <LogOut className="h-3 w-3" />
          Вийти
        </button>
      </div>
    </div>
  );
};
