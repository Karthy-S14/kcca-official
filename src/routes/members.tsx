import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Search, User } from "lucide-react";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Members — KCCA" },
      { name: "description", content: "KCCA student members and player profiles." },
    ],
  }),
  component: MembersPage,
});

function MembersPage() {
  const { data } = useQuery({
    queryKey: ["members"],
    queryFn: async () => (await supabase.from("members").select("*").order("rating", { ascending: false, nullsFirst: false })).data ?? [],
  });
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => (data ?? []).filter((m) => !q || m.name?.toLowerCase().includes(q.toLowerCase()) || m.school?.toLowerCase().includes(q.toLowerCase())),
    [data, q],
  );
  return (
    <>
      <PageHeader eyebrow="Community" title="Members" subtitle="Student players training under KCCA colours." />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search members…"
            className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[oklch(0.11_0.006_260/0.6)] border border-[oklch(0.82_0.14_84/0.2)] text-sm"
          />
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="glass p-5 group">
              <div className="h-20 w-20 rounded-full mx-auto grid place-items-center bg-[oklch(0.82_0.14_84/0.1)] border border-[oklch(0.82_0.14_84/0.3)] overflow-hidden">
                {m.photo_url ? <img src={m.photo_url} alt={m.name} className="h-full w-full object-cover" /> : <User className="h-8 w-8 text-[oklch(0.82_0.14_84)]" />}
              </div>
              <h3 className="mt-4 text-center font-display text-lg font-semibold">{m.name}</h3>
              {m.school && <div className="text-center text-xs text-muted-foreground mt-1">{m.school}</div>}
              <div className="mt-4 flex justify-around text-center text-xs">
                <div><div className="gold-text font-bold text-lg">{m.rating ?? "—"}</div><div className="text-muted-foreground uppercase tracking-[0.16em] text-[10px]">Rating</div></div>
                <div><div className="gold-text font-bold text-lg">{m.age ?? "—"}</div><div className="text-muted-foreground uppercase tracking-[0.16em] text-[10px]">Age</div></div>
                <div><div className="gold-text font-bold text-lg">{m.grade ?? "—"}</div><div className="text-muted-foreground uppercase tracking-[0.16em] text-[10px]">Grade</div></div>
              </div>
            </div>
          ))}
          {!filtered.length && <div className="col-span-full glass p-10 text-center text-muted-foreground">No members yet. Admins can add members from the dashboard.</div>}
        </div>
      </section>
    </>
  );
}