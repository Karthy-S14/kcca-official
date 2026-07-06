import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Code2, Sparkles } from "lucide-react";

const ROLES = [
  { icon: "♟️", label: "Chief Arbiter (CA)" },
  { icon: "👥", label: "Co-Lead" },
  { icon: "💻", label: "Full Stack Developer" },
  { icon: "🌐", label: "Web Administrator" },
];

const VERSION = "1.0.0";

export function CreatorCard() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative w-full text-left glass p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[oklch(0.82_0.14_84/0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.82_0.14_84/0.6)]"
        aria-label="About the website creator"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-11 w-11 shrink-0 rounded-xl btn-gold grid place-items-center shadow-lg">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Website Designed &amp; Developed by
              </div>
              <div className="font-display text-lg sm:text-xl font-bold gold-text truncate">
                S. Karthiheyan
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-wrap gap-1.5 sm:justify-end">
            {ROLES.map((r) => (
              <span
                key={r.label}
                className="inline-flex items-center gap-1 rounded-full border border-[oklch(0.82_0.14_84/0.25)] bg-[oklch(1_0_0/0.02)] px-2.5 py-1 text-[10px] sm:text-[11px] text-muted-foreground"
              >
                <span aria-hidden>{r.icon}</span>
                <span className="hidden sm:inline">{r.label}</span>
                <span className="sm:hidden">{r.label.replace(/\s*\(.*\)/, "")}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="relative mt-4 pt-3 border-t border-[oklch(0.82_0.14_84/0.12)] text-center text-xs italic text-muted-foreground">
          <Sparkles className="inline-block h-3 w-3 mr-1 text-[oklch(0.82_0.14_84)]" />
          "Building the Digital Future of KCCA"
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass border-[oklch(0.82_0.14_84/0.3)] bg-[oklch(0.08_0.005_260/0.9)] sm:max-w-md">
          <DialogHeader className="items-center text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl btn-gold grid place-items-center mb-3">
              <Code2 className="h-6 w-6" />
            </div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Website Designed &amp; Developed by
            </div>
            <DialogTitle className="font-display text-3xl gold-text">
              S. Karthiheyan
            </DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-[0.2em]">
              Roles
            </DialogDescription>
          </DialogHeader>
          <ul className="grid grid-cols-1 gap-2 mt-2">
            {ROLES.map((r) => (
              <li
                key={r.label}
                className="flex items-center gap-3 rounded-lg border border-[oklch(0.82_0.14_84/0.2)] bg-[oklch(1_0_0/0.02)] px-3 py-2 text-sm"
              >
                <span className="text-lg" aria-hidden>{r.icon}</span>
                <span className="text-foreground/90">{r.label}</span>
              </li>
            ))}
          </ul>
          <p className="text-center italic text-sm gold-text mt-4">
            "Building the Digital Future of KCCA"
          </p>
          <div className="mt-4 pt-4 border-t border-[oklch(0.82_0.14_84/0.15)] text-center text-xs text-muted-foreground space-y-1">
            <div>Website Version <span className="text-[oklch(0.9_0.11_88)] font-medium">v{VERSION}</span></div>
            <div>© {new Date().getFullYear()} Kilinochchi Central Chess Association</div>
            <div className="tracking-[0.2em] uppercase text-[10px]">All Rights Reserved</div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}