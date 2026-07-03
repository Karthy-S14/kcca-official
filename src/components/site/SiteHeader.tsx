import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, LogIn, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { NAV } from "@/lib/site-config";
import { useIsAdmin } from "@/hooks/use-admin";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isAdmin, user } = useIsAdmin();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "backdrop-blur-xl bg-background/70 border-b border-[oklch(0.82_0.14_84/0.15)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden xl:flex items-center gap-1">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3 py-2 text-[13px] font-medium rounded-md transition-colors ${
                  active
                    ? "text-[oklch(0.9_0.11_88)]"
                    : "text-muted-foreground hover:text-[oklch(0.9_0.11_88)]"
                }`}
              >
                {n.label}
                {active && (
                  <span className="block h-px mt-1 bg-gradient-to-r from-transparent via-[oklch(0.82_0.14_84)] to-transparent" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {user && isAdmin ? (
            <Link to="/admin" className="btn-gold inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm">
              <ShieldCheck className="h-4 w-4" /> Admin
            </Link>
          ) : (
            <Link to="/auth" className="btn-ghost-gold inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm">
              <LogIn className="h-4 w-4" /> Login
            </Link>
          )}
        </div>
        <button
          className="xl:hidden p-2 text-[oklch(0.9_0.11_88)]"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="xl:hidden border-t border-[oklch(0.82_0.14_84/0.15)] bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-3 grid gap-1 max-h-[75vh] overflow-y-auto">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3 py-2.5 rounded-md text-sm ${
                  pathname === n.to ? "bg-[oklch(0.82_0.14_84/0.1)] text-[oklch(0.9_0.11_88)]" : "text-muted-foreground"
                }`}
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-[oklch(0.82_0.14_84/0.15)]">
              {user && isAdmin ? (
                <Link to="/admin" className="btn-gold block text-center px-4 py-2 rounded-md text-sm">
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/auth" className="btn-ghost-gold block text-center px-4 py-2 rounded-md text-sm">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}