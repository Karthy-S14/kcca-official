import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { SITE, NAV } from "@/lib/site-config";
import { CreatorCard } from "./CreatorCard";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[oklch(0.82_0.14_84/0.15)] bg-[oklch(0.06_0.005_260)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
            {SITE.fullName} — a project of Kilinochchi Central College established in {SITE.founded}.
            {" "}Building future chess champions through excellence, discipline, and community.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 grid place-items-center rounded-full border border-[oklch(0.82_0.14_84/0.25)] text-[oklch(0.9_0.11_88)] hover:bg-[oklch(0.82_0.14_84/0.1)] transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] gold-text font-semibold mb-4">Explore</h4>
          <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted-foreground">
            {NAV.slice(0, 10).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-[oklch(0.9_0.11_88)] transition">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] gold-text font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 text-[oklch(0.82_0.14_84)]" />
              <a href={`tel:${SITE.phoneDial}`} className="hover:text-[oklch(0.9_0.11_88)]">{SITE.phone}</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 text-[oklch(0.82_0.14_84)]" />
              <a href={`mailto:${SITE.email}`} className="hover:text-[oklch(0.9_0.11_88)] break-all">{SITE.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-[oklch(0.82_0.14_84)]" />
              <span>{SITE.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[oklch(0.82_0.14_84/0.15)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <CreatorCard />
        </div>
      </div>
      <div className="border-t border-[oklch(0.82_0.14_84/0.15)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} {SITE.fullName}. All rights reserved.</div>
          <div className="tracking-[0.2em] uppercase">FIDE Laws of Chess · Swiss System</div>
        </div>
      </div>
    </footer>
  );
}