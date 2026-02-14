import { Activity, BarChart3, BookOpen, TrendingUp, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { to: "/", label: "Дашборд", icon: BarChart3 },
  { to: "/forecast", label: "Прогноз", icon: TrendingUp },
  { to: "/education", label: "Освіта", icon: BookOpen },
];

export const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <Activity className="h-6 w-6 text-primary animate-pulse-glow" />
          <span className="font-display text-lg font-bold text-foreground">
            Магнітна<span className="text-primary">Буря</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="flex items-center gap-2 rounded-md px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeClassName="bg-primary/10 text-primary border border-primary/20"
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Live indicator + time */}
        <div className="hidden md:flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-storm-quiet animate-pulse-glow" />
            <span className="font-mono text-xs text-muted-foreground">НАЖИВО</span>
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} Київ
          </span>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-6 py-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="flex items-center gap-2.5 rounded-md px-3 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeClassName="bg-primary/10 text-primary"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-2 pt-2 border-t border-border/30">
            <span className="h-2 w-2 rounded-full bg-storm-quiet animate-pulse-glow" />
            <span className="font-mono text-xs text-muted-foreground">НАЖИВО</span>
          </div>
        </nav>
      )}
    </header>
  );
};
