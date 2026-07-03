import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Award, Crown, Medal, Star } from "lucide-react";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — KCCA" },
      { name: "description", content: "KCCA tournament achievements, champions and merit awardees." },
    ],
  }),
  component: Ach,
});

function Ach() {
  const { data } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => (await supabase.from("achievements").select("*").order("event_date", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="Legacy" title="Achievements" subtitle="A timeline of KCCA champions, runners-up, and merit awardees." />
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
        <div className="relative border-l-2 border-[oklch(0.82_0.14_84/0.3)] pl-6 sm:pl-10 space-y-10">
          {(data ?? []).map((a) => (
            <div key={a.id} className="relative">
              <div className="absolute -left-[42px] sm:-left-[54px] top-2 h-4 w-4 rounded-full btn-gold grid place-items-center">
                <Award className="h-2.5 w-2.5" />
              </div>
              <div className="glass p-6 lg:p-8">
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] gold-text font-semibold">{a.category ?? "Championship"}</div>
                    <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold">{a.title}</h3>
                  </div>
                  {a.event_date && (
                    <span className="text-xs px-3 py-1 rounded-full border border-[oklch(0.82_0.14_84/0.3)] text-muted-foreground">
                      {new Date(a.event_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {a.description && <p className="mt-3 text-muted-foreground">{a.description}</p>}
                <div className="mt-6 grid sm:grid-cols-3 gap-4">
                  {a.winner && (
                    <Podium icon={Crown} label="Champion" names={[a.winner]} accent />
                  )}
                  {a.runners_up && a.runners_up.length > 0 && (
                    <Podium icon={Medal} label="Runners-up" names={a.runners_up} />
                  )}
                  {a.merit_awardees && a.merit_awardees.length > 0 && (
                    <Podium icon={Star} label="Merit" names={a.merit_awardees} />
                  )}
                </div>
              </div>
            </div>
          ))}
          {!data?.length && <div className="text-muted-foreground">No achievements yet.</div>}
        </div>
      </section>
    </>
  );
}

function Podium({ icon: Icon, label, names, accent }: { icon: any; label: string; names: string[]; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${accent ? "border-[oklch(0.82_0.14_84/0.5)] bg-[oklch(0.82_0.14_84/0.08)]" : "border-[oklch(0.82_0.14_84/0.15)]"}`}>
      <div className="flex items-center gap-2 text-[oklch(0.9_0.11_88)]">
        <Icon className="h-4 w-4" /> <span className="text-[11px] uppercase tracking-[0.2em]">{label}</span>
      </div>
      <ul className="mt-3 text-sm space-y-1">
        {names.map((n) => <li key={n}>{n}</li>)}
      </ul>
    </div>
  );
}