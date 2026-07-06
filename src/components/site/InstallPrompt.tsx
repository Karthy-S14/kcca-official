import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "kcca-pwa-install-dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    const dismissed = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissed && Date.now() - dismissed < 1000 * 60 * 60 * 24 * 7) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const installed = () => setVisible(false);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-fade-in">
      <div className="glass p-4 flex items-start gap-3 shadow-2xl">
        <div className="h-10 w-10 shrink-0 rounded-xl btn-gold grid place-items-center">
          <Download className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold gold-text">Install KCCA App</div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add KCCA to your home screen for instant access and offline use.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={install}
              className="btn-gold rounded-md px-3 py-1.5 text-xs font-semibold"
            >
              Install
            </button>
            <button
              onClick={dismiss}
              className="btn-ghost-gold rounded-md px-3 py-1.5 text-xs"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}