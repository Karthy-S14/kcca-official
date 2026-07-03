import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — KCCA" },
      { name: "description", content: "KCCA photo gallery — tournaments, training, events, and celebrations." },
    ],
  }),
  component: G,
});

const filters = ["All", "Tournament", "Training", "Events", "Celebrations"];

function G() {
  const { data } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => (await supabase.from("gallery").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [f, setF] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const items = useMemo(() => (data ?? []).filter((g) => f === "All" || g.category === f), [data, f]);

  return (
    <>
      <PageHeader eyebrow="Moments" title="Gallery" subtitle="Behind every move — from championships to celebrations." />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((c) => (
            <button
              key={c}
              onClick={() => setF(c)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] border transition ${
                f === c
                  ? "btn-gold border-transparent"
                  : "border-[oklch(0.82_0.14_84/0.25)] text-muted-foreground hover:text-[oklch(0.9_0.11_88)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
          {items.map((g) => (
            <button
              key={g.id}
              onClick={() => setOpen(g.image_url)}
              className="mb-4 block w-full break-inside-avoid relative group rounded-xl overflow-hidden gold-border"
            >
              <img src={g.image_url} alt={g.caption ?? "KCCA"} loading="lazy" className="w-full h-auto group-hover:scale-105 transition-transform duration-500" />
              {(g.caption || g.title) && (
                <div className="absolute inset-x-0 bottom-0 p-3 text-left bg-gradient-to-t from-[oklch(0_0_0/0.85)] to-transparent opacity-0 group-hover:opacity-100 transition">
                  <div className="text-xs text-[oklch(0.9_0.11_88)] uppercase tracking-[0.18em]">{g.category}</div>
                  <div className="text-sm">{g.caption ?? g.title}</div>
                </div>
              )}
            </button>
          ))}
          {!items.length && (
            <div className="col-span-full glass p-10 text-center text-muted-foreground">No photos yet.</div>
          )}
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-[80] bg-[oklch(0_0_0/0.9)] backdrop-blur-sm grid place-items-center p-4" onClick={() => setOpen(null)}>
          <button className="absolute top-4 right-4 h-10 w-10 rounded-full btn-ghost-gold grid place-items-center"><X className="h-5 w-5" /></button>
          <img src={open} alt="" className="max-h-[90vh] max-w-full rounded-xl gold-border" />
        </div>
      )}
    </>
  );
}