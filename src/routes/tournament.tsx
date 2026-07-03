import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar, MapPin, Clock, Ticket, Gavel, Users, Trophy, ShieldAlert, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/tournament")({
  head: () => ({
    meta: [
      { title: "Tournaments — KCCA" },
      { name: "description", content: "Upcoming KCCA tournaments played under FIDE Laws of Chess." },
    ],
  }),
  component: TournamentPage,
});

const arbiters = [
  { role: "Tournament Director", name: "Abishanth" },
  { role: "Chief Arbiter", name: "S. Karthiheyan" },
  { role: "Deputy Chief Arbiter", name: "K. Kabishayan" },
  { role: "Arbiter", name: "Kabins" },
  { role: "Arbiter", name: "Sakinthan" },
];

const fairPlay = ["No Mobile Phones", "Respect Opponents", "Chief Arbiter Decision is Final"];
const tieBreaks = ["Buchholz", "Median Buchholz", "Sonneborn-Berger"];

function useCountdown(target: string | null | undefined) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  if (!target) return null;
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function TournamentPage() {
  const { data: tournaments } = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => (await supabase.from("tournaments").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const current = tournaments?.find((t) => t.status === "upcoming") ?? tournaments?.[0];
  const cd = useCountdown(current?.event_date);

  return (
    <>
      <PageHeader eyebrow="Play" title="Tournaments" subtitle="FIDE Laws of Chess · Swiss System · Computer generated pairings." />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 space-y-8">
        {current && (
          <div className="glass p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[oklch(0.82_0.14_84/0.15)] blur-3xl" />
            <div className="relative grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="text-[11px] uppercase tracking-[0.24em] gold-text font-semibold">Current Tournament</div>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">{current.name}</h2>
                <p className="mt-3 text-muted-foreground">{current.description}</p>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  <Info icon={Users} label="Category" value={current.grade ?? "All"} />
                  <Info icon={MapPin} label="Venue" value={current.venue ?? "TBA"} />
                  <Info icon={Calendar} label="Date" value={current.event_date ? new Date(current.event_date).toLocaleDateString() : "Will be updated"} />
                  <Info icon={Clock} label="Time" value={current.time_info ?? "Will be updated"} />
                  <Info icon={Ticket} label="Entry Fee" value={current.entry_fee ?? "FREE"} />
                  <Info icon={Gavel} label="System" value={current.system ?? "Swiss"} />
                </div>
                <button
                  onClick={() => toast.success("Registration received — the KCCA team will contact you soon.")}
                  className="btn-gold mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-md"
                >
                  Register Now <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="glass p-6">
                <div className="text-[11px] uppercase tracking-[0.24em] gold-text font-semibold">Starts In</div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  {(["Days", "Hours", "Min", "Sec"] as const).map((label, i) => {
                    const values = cd ? [cd.d, cd.h, cd.m, cd.s] : [0, 0, 0, 0];
                    return (
                      <div key={label} className="rounded-md border border-[oklch(0.82_0.14_84/0.25)] py-3">
                        <div className="font-display text-2xl font-bold gold-text">{String(values[i]).padStart(2, "0")}</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{label}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 hairline pt-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] gold-text font-semibold">Tie Breaks</div>
                  <ul className="mt-3 text-sm text-muted-foreground space-y-1.5">
                    {tieBreaks.map((t) => <li key={t}>· {t}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass p-8">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-[oklch(0.82_0.14_84)]" />
              <h3 className="font-display text-2xl font-bold">Fair Play Rules</h3>
            </div>
            <ul className="mt-5 space-y-3 text-muted-foreground">
              {fairPlay.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.14_84)]" /> {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass p-8">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-[oklch(0.82_0.14_84)]" />
              <h3 className="font-display text-2xl font-bold">Tournament Committee</h3>
            </div>
            <ul className="mt-5 space-y-3">
              {arbiters.map((a) => (
                <li key={a.name + a.role} className="flex items-center justify-between text-sm border-b border-[oklch(0.82_0.14_84/0.12)] pb-2">
                  <span className="text-[oklch(0.9_0.11_88)]">{a.name}</span>
                  <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{a.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-[oklch(0.82_0.14_84/0.15)] bg-[oklch(0.82_0.14_84/0.03)]">
      <Icon className="h-4 w-4 mt-1 text-[oklch(0.82_0.14_84)]" />
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
        <div className="text-sm text-foreground mt-0.5">{value}</div>
      </div>
    </div>
  );
}