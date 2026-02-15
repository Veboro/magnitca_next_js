import { Link } from "react-router-dom";
import { Rss } from "lucide-react";

const RSS_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/rss`;

export const SiteFooter = () => (
  <footer className="mx-auto max-w-7xl px-6 py-8 border-t border-border/30">
    <div className="flex flex-col gap-4">
      <nav className="flex flex-wrap items-center justify-center gap-4 text-xs">
        <Link to="/contacts" className="text-muted-foreground/60 hover:text-foreground transition-colors">Контакти</Link>
        <Link to="/about" className="text-muted-foreground/60 hover:text-foreground transition-colors">Про нас</Link>
        <Link to="/privacy" className="text-muted-foreground/60 hover:text-foreground transition-colors">Політика конфіденційності</Link>
        <a href={RSS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground/60 hover:text-foreground transition-colors">
          <Rss className="h-3 w-3" /> RSS
        </a>
      </nav>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
        <p>© {new Date().getFullYear()} Магнітка — моніторинг космічної погоди для України</p>
        <p className="font-mono">
          Дані:{" "}
          <a
            href="https://www.swpc.noaa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            NOAA Space Weather Prediction Center
          </a>
        </p>
      </div>
    </div>
  </footer>
);
