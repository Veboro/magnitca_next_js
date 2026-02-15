export const SiteFooter = () => (
  <footer className="mx-auto max-w-7xl px-6 py-8 border-t border-border/30">
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
  </footer>
);
