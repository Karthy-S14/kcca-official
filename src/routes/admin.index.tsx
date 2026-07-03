import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_RESOURCES } from "@/lib/site-config";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

function Overview() {
  const { data } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const entries = await Promise.all(
        ADMIN_RESOURCES.map(async (r) => {
          const { count } = await supabase.from(r.table as any).select("*", { count: "exact", head: true });
          return [r.slug, count ?? 0] as const;
        }),
      );
      return Object.fromEntries(entries);
    },
  });

  const { data: recent } = useQuery({
    queryKey: ["admin-recent-contacts"],
    queryFn: async () => (await supabase.from("contacts").select("*").order("created_at", { ascending: false }).limit(5)).data ?? [],
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="text-[11px] uppercase tracking-[0.24em] gold-text font-semibold">Dashboard</div>
        <h1 className="mt-2 font-display text-3xl font-bold">Welcome back, Admin</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of everything happening at KCCA.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {ADMIN_RESOURCES.map((r) => (
          <div key={r.slug} className="glass p-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{r.label}</div>
            <div className="mt-2 font-display text-3xl font-bold gold-text">{data?.[r.slug] ?? "…"}</div>
          </div>
        ))}
      </div>
      <div className="glass p-6">
        <h2 className="font-display text-xl font-bold gold-text mb-4">Recent Contact Messages</h2>
        <div className="space-y-3">
          {(recent ?? []).map((c: any) => (
            <div key={c.id} className="p-4 rounded-lg border border-[oklch(0.82_0.14_84/0.15)]">
              <div className="flex justify-between text-sm">
                <div className="font-semibold">{c.name} <span className="text-muted-foreground font-normal">· {c.email}</span></div>
                <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</div>
              </div>
              {c.subject && <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[oklch(0.9_0.11_88)]">{c.subject}</div>}
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{c.message}</p>
            </div>
          ))}
          {!recent?.length && <div className="text-sm text-muted-foreground">No messages yet.</div>}
        </div>
      </div>
    </div>
  );
}