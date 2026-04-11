import { Moon, Sun, Activity, HelpCircle, CalendarDays, Newspaper, LogOut, ClipboardCheck, ChevronDown, Shield, Gauge, Wind } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/magnitca-logo.jpg";
import type { Lang } from "@/i18n/config";

export const SiteHeader = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const lang = (i18n.language === "ru" ? "ru" : "uk") as Lang;
  const isRu = location.pathname.startsWith("/ru");

  const localePath = (path: string) => isRu ? `/ru${path === "/" ? "" : path}` : path;

  const switchLanguage = () => {
    const path = location.pathname;
    if (isRu) {
      navigate(path.replace(/^\/ru/, "") || "/");
    } else {
      navigate(`/ru${path === "/" ? "" : path}`);
    }
  };

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Activity },
    { href: "/kp-index", label: t("nav.kpIndex"), icon: Gauge },
    { href: "/solar-wind", label: t("nav.solarWind"), icon: Wind },
    { href: "/news", label: t("nav.news"), icon: Newspaper },
    { href: "/calendar", label: t("nav.calendar"), icon: CalendarDays },
    { href: "/test", label: t("nav.test"), icon: ClipboardCheck },
    { href: "/faq", label: t("nav.faq"), icon: HelpCircle },
  ];

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc("has_role" as any, { _user_id: user.id, _role: "admin" })
      .then(({ data }) => setIsAdmin(data === true));
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

  // Determine active path without lang prefix
  const activePath = isRu ? location.pathname.replace(/^\/ru/, "") || "/" : location.pathname;

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <a href={localePath("/")} className="flex items-center">
          <img src={logo.src} alt="Магнітка" className="h-10 w-auto max-w-[250px]" />
        </a>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language switcher */}
          <button
            onClick={switchLanguage}
            className="flex items-center justify-center h-7 rounded-md border border-border/50 bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors px-2 font-mono text-xs font-medium"
            aria-label="Switch language"
          >
            {isRu ? "UA" : "RU"}
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center h-7 w-7 rounded-md border border-border/50 bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t("header.toggleTheme")}
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          {!authLoading && user && isAdmin && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 h-7 rounded-md border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-2"
                aria-label={t("header.admin")}
              >
                <Shield className="h-3.5 w-3.5" />
                <ChevronDown className="h-3 w-3" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 rounded-lg border border-border bg-popover shadow-lg z-50 py-1">
                  <a
                    href="/admin/news"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    {t("header.adminPanel")}
                  </a>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-destructive hover:bg-accent transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {t("header.signOut")}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <nav className="border-t border-border/30 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 flex items-center gap-1 py-1.5 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = activePath === item.href;
            return (
              <a
                key={item.href}
                href={localePath(item.href)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 font-mono text-[18px] transition-all ${
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
