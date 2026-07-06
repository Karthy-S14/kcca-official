// Guarded PWA service worker registration wrapper.
const SW_URL = "/sw.js";

function isDisallowedHost(hostname: string): boolean {
  if (hostname.startsWith("id-preview--") || hostname.startsWith("preview--")) return true;
  if (hostname === "lovableproject.com" || hostname.endsWith(".lovableproject.com")) return true;
  if (hostname === "lovableproject-dev.com" || hostname.endsWith(".lovableproject-dev.com")) return true;
  if (hostname === "beta.lovable.dev" || hostname.endsWith(".beta.lovable.dev")) return true;
  return false;
}

async function unregisterAppServiceWorkers() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const reg of regs) {
      const scriptURL =
        reg.active?.scriptURL || reg.installing?.scriptURL || reg.waiting?.scriptURL || "";
      if (scriptURL.endsWith(SW_URL) || scriptURL.endsWith("/service-worker.js")) {
        await reg.unregister();
      }
    }
  } catch {
    /* ignore */
  }
}

export async function registerPWA() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const url = new URL(window.location.href);
  const inIframe = window.self !== window.top;
  const disallowed =
    !import.meta.env.PROD ||
    inIframe ||
    url.searchParams.get("sw") === "off" ||
    isDisallowedHost(window.location.hostname);

  if (disallowed) {
    await unregisterAppServiceWorkers();
    return;
  }

  try {
    const reg = await navigator.serviceWorker.register(SW_URL, { scope: "/" });
    const check = () => reg.update().catch(() => {});
    setInterval(check, 60 * 60 * 1000);
    window.addEventListener("focus", check);
  } catch (err) {
    console.warn("[pwa] registration failed", err);
  }
}