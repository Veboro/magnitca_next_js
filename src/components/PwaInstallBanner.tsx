import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PwaInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    if (localStorage.getItem("pwa-banner-dismissed")) {
      setDismissed(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("pwa-banner-dismissed", "1");
  };

  if (isInstalled || dismissed || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md px-4 py-3 shadow-lg sm:bottom-4 sm:left-4 sm:right-auto sm:w-[360px] sm:rounded-xl sm:border">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2">
          <Download className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Встановити Магнітку</p>
          <p className="text-xs text-muted-foreground">Швидкий доступ з домашнього екрана</p>
        </div>
        <button
          onClick={handleInstall}
          className="flex-shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Встановити
        </button>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-md hover:bg-secondary transition-colors"
          aria-label="Закрити"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};
