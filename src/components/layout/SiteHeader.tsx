import { RefreshCw, Moon, Sun, Activity, HelpCircle, CalendarDays, Newspaper, Bell, BellOff, Loader2, LogIn, LogOut, ClipboardCheck, User, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) { setDisplayName(null); return; }
    supabase.from("profiles").select("display_name").eq("user_id", user.id).single()
      .then(({ data }) => setDisplayName(data?.display_name || null));
  }, [user]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <a href="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Магнітка" className="h-7 w-7" />
          <span className="font-display text-lg font-bold text-foreground">
            Магніт<span className="text-primary">ка</span>
          </span>
        </a>

        <div className="flex items-center gap-3 sm:gap-4">
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

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center h-7 w-7 rounded-md border border-border/50 bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Перемкнути тему"
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          {!authLoading && (
            user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 h-7 rounded-md border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-2"
                  aria-label="Кабінет"
                >
                  <User className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline text-xs font-medium max-w-[100px] truncate">
                    {displayName || user.email?.split("@")[0] || "Кабінет"}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-44 rounded-lg border border-border bg-popover shadow-lg z-50 py-1">
                    <a
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User className="h-3.5 w-3.5" />
                      Мій кабінет
                    </a>
                    <button
                      onClick={() => { signOut(); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-destructive hover:bg-accent transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Вийти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/auth"
                className="flex items-center justify-center h-7 w-7 rounded-md border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                aria-label="Увійти"
                title="Увійти / Зареєструватися"
              >
                <User className="h-3.5 w-3.5" />
              </a>
            )
          )}

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
