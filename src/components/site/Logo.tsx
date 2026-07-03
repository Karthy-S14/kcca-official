import logo from "@/assets/kcca-logo.png";
import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <img
        src={logo}
        alt="KCCA emblem"
        width={44}
        height={44}
        className="h-11 w-11 drop-shadow-[0_4px_12px_oklch(0.82_0.14_84/0.4)] transition-transform group-hover:scale-105"
      />
      {!compact && (
        <div className="leading-tight">
          <div className="font-display text-lg font-bold gold-text tracking-wide">KCCA</div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground hidden sm:block">
            Kilinochchi Central
          </div>
        </div>
      )}
    </Link>
  );
}