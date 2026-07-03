import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Search, Crown, Download } from "lucide-react";

export const Route = createFileRoute("/rated-players")({
  head: () => ({
    meta: [
      { title: "Rated Players — KCCA" },
      { name: "description", content: "Top rated KCCA chess players with FIDE standard, rapid, and blitz ratings." },
    ],
  }),
  component: RP,
});

function RP() {
  const { data } = useQuery({
    queryKey: ["rated_players"],
    queryFn: async () => (await supabase.from("rated_players").select("*").order("standard_rating", { ascending: false })).data ?? [],
  });
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"standard" | "rapid" | "blitz" | "name">("standard");

  const filtered = useMemo(() => {
    const list = (data ?? []).filter((p) => !q || p.name?.toLowerCase().includes(q.toLowerCase()));
    return [...list].sort((a, b) => {
      if (sort === "name") return (a.name ?? "").localeCompare(b.name ?? "");
      const key = ({ standard: "standard_rating", rapid: "rapid_rating", blitz: "blitz_rating" } as const)[sort];
      return (b[key] ?? 0) - (a[key] ?? 0);
    });
  }, [data, q, sort]);

  const exportCSV = () => {
    const headers = ["Rank", "Name", "Title", "FIDE ID", "Standard", "Rapid", "Blitz", "School", "Grade"];
    const rows = filtered.map((p, i) => [i + 1, p.name, p.title ?? "", p.fide_id ?? "", p.standard_rating, p.rapid_rating, p.blitz_rating, p.school ?? "", p.grade ?? ""]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "kcca-rated-players.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader eyebrow="Ratings" title="Rated Players" subtitle="Standard · Rapid · Blitz — the KCCA rated players ladder." />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search player…"
              className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[oklch(0.11_0.006_260/0.6)] border border-[oklch(0.82_0.14_84/0.2)] text-sm focus:outline-none focus:border-[oklch(0.82_0.14_84/0.6)]"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="px-3 py-2.5 rounded-md bg-[oklch(0.11_0.006_260/0.6)] border border-[oklch(0.82_0.14_84/0.2)] text-sm"
          >
            <option value="standard">Sort: Standard</option>
            <option value="rapid">Sort: Rapid</option>
            <option value="blitz">Sort: Blitz</option>
            <option value="name">Sort: Name</option>
          </select>
          <button onClick={exportCSV} className="btn-ghost-gold px-4 py-2.5 rounded-md text-sm inline-flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>

        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[oklch(0.06_0.005_260)] text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <tr>
                  {["#", "Player", "Title", "Standard", "Rapid", "Blitz", "School", "Grade", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className="border-t border-[oklch(0.82_0.14_84/0.1)] hover:bg-[oklch(0.82_0.14_84/0.04)]">
                    <td className="px-4 py-3 font-medium text-[oklch(0.9_0.11_88)]">
                      {i < 3 ? <Crown className="h-4 w-4 inline text-[oklch(0.82_0.14_84)] mr-1" /> : null}
                      {i + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded border border-[oklch(0.82_0.14_84/0.3)] text-[oklch(0.9_0.11_88)]">{p.title ?? "—"}</span></td>
                    <td className="px-4 py-3 font-mono">{p.standard_rating ?? "—"}</td>
                    <td className="px-4 py-3 font-mono">{p.rapid_rating ?? "—"}</td>
                    <td className="px-4 py-3 font-mono">{p.blitz_rating ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.school ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.grade ?? "—"}</td>
                    <td className="px-4 py-3"><span className="text-xs text-[oklch(0.75_0.15_150)]">● {p.status ?? "Active"}</span></td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={9} className="p-10 text-center text-muted-foreground">No players found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}