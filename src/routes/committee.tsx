import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

export const Route = createFileRoute("/committee")({
  head: () => ({
    meta: [
      { title: "Committee — KCCA" },
      { name: "description", content: "The KCCA committee and leadership team." },
    ],
  }),
  component: Comm,
});

function Comm() {
  const { data } = useQuery({
    queryKey: ["committee"],
    queryFn: async () => (await supabase.from("committee").select("*").order("sort_order")).data ?? [],
  });
  const featured = (data ?? []).slice(0, 4);
  const members = (data ?? []).slice(4);
  return (
    <>
      <PageHeader eyebrow="Leadership" title="Committee" subtitle="The team building KCCA." />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 space-y-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((c) => (
            <div key={c.id} className="glass p-6 text-center">
              <div className="h-24 w-24 mx-auto rounded-full btn-gold grid place-items-center overflow-hidden">
                {c.photo_url ? <img src={c.photo_url} alt={c.name} className="h-full w-full object-cover" /> : <User className="h-10 w-10" />}
              </div>
              <div className="mt-4 text-[11px] uppercase tracking-[0.24em] gold-text font-semibold">{c.role}</div>
              <div className="mt-1 font-display text-xl font-bold">{c.name}</div>
            </div>
          ))}
        </div>
        {members.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold mb-6 gold-text">Committee Members</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {members.map((c) => (
                <div key={c.id} className="glass p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full border border-[oklch(0.82_0.14_84/0.3)] grid place-items-center bg-[oklch(0.82_0.14_84/0.08)]">
                    <User className="h-5 w-5 text-[oklch(0.82_0.14_84)]" />
                  </div>
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}