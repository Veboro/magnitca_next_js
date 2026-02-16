import { RefreshCw, Moon, Sun, Activity, HelpCircle, CalendarDays, Newspaper, Rss, Bell, BellOff, Loader2, LogIn, LogOut, ClipboardCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const REFRESH_INTERVAL = 60;

const navItems = [
  { href: "/", label: "Головна", icon: Activity },
  { href: "/news", label: "Новини", icon: Newspaper },
  { href: "/calendar", label: "Календар", icon: CalendarDays },
  { href: "/test", label: "Тест", icon: ClipboardCheck },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

export const SiteHeader = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { isSupported: pushSupported, isSubscribed: pushSubscribed, isLoading: pushLoading, toggle: togglePush } = usePushNotifications();
  const location = useLocation();
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = saved === "dark" || !saved;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      {/* Top bar: logo + controls */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <a href="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Магнітка" className="h-7 w-7" />
          <span className="font-display text-lg font-bold text-foreground">
            Магніт<span className="text-primary">ка</span>
          </span>
        </a>

        <div className="flex items-center gap-3 sm:gap-4">
          <a href="https://t.me/+7UKzAK5ur8UxZmMy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Telegram">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61582497296135" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href={`https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/rss`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="RSS">
            <Rss className="h-4 w-4" />
          </a>

          {pushSupported && (
            <button
              onClick={togglePush}
              disabled={pushLoading}
              className="flex items-center justify-center h-7 w-7 rounded-md border border-border/50 bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              aria-label={pushSubscribed ? "Вимкнути сповіщення" : "Увімкнути сповіщення"}
              title={pushSubscribed ? "Сповіщення увімкнено" : "Увімкнути пуш-сповіщення"}
            >
              {pushLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : pushSubscribed ? (
                <Bell className="h-3.5 w-3.5 text-primary" />
              ) : (
                <BellOff className="h-3.5 w-3.5" />
              )}
            </button>
          )}

          {!authLoading && (
            user ? (
              <div className="flex items-center gap-2">
                <a
                  href="/profile"
                  className="flex items-center justify-center h-7 w-7 rounded-md border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Кабінет"
                  title="Мій кабінет"
                >
                  <Activity className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={() => signOut()}
                  className="flex items-center justify-center h-7 w-7 rounded-md border border-border/50 bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Вийти"
                  title="Вийти з акаунту"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <a
                href="/auth"
                className="flex items-center justify-center h-7 w-7 rounded-md border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                aria-label="Увійти"
                title="Увійти / Зареєструватися"
              >
                <LogIn className="h-3.5 w-3.5" />
              </a>
            )
          )}

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center h-7 w-7 rounded-md border border-border/50 bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Перемкнути тему"
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          <span className="hidden sm:flex items-center gap-1.5">
            <RefreshCw
              className="h-3 w-3 text-muted-foreground/60 transition-transform"
              style={{
                animation: countdown <= 3 ? "spin 1s linear infinite" : "none",
              }}
            />
            <span className="font-mono text-[10px] text-muted-foreground/60">
              {countdown}с
            </span>
            <span
              className="h-[3px] rounded-full bg-primary/40 transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / REFRESH_INTERVAL) * 40}px` }}
            />
          </span>
        </div>
      </div>

      {/* Navigation bar — always visible */}
      <nav className="border-t border-border/30 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 flex items-center gap-1 py-1.5 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 font-mono text-xs transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
