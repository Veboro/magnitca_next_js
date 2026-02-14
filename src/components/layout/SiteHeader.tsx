import { RefreshCw, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

const REFRESH_INTERVAL = 60; // seconds

export const SiteHeader = () => {
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
    const prefersDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Магнітка" className="h-7 w-7" />
          <span className="font-display text-lg font-bold text-foreground">
            Магніт<span className="text-primary">ка</span>
          </span>
        </a>

        {/* Live indicator + theme + time */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-storm-quiet animate-pulse-glow" />
            <span className="font-mono text-xs text-muted-foreground">НАЖИВО</span>
          </span>

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
          <span className="hidden sm:block font-mono text-xs text-muted-foreground">
            {new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} Київ
          </span>
        </div>
      </div>
    </header>
  );
};
