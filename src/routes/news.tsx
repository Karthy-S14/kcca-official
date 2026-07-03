import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Pin, Calendar } from "lucide-react";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — KCCA" },
      { name: "description", content: "Latest KCCA news, announcements, and events." },
    ],
  }),
  component: N,
});

function N() {
  const { data } = useQuery({
    queryKey: ["news"],
    queryFn: async () => (await supabase.from("news").select("*").order("pinned", { ascending: false }).order("published_at", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="Updates" title="News & Announcements" subtitle="Fresh from the KCCA newsroom." />
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 space-y-6">
        {(data ?? []).map((n) => (
          <article key={n.id} className="glass p-7">
            {n.pinned && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] px-2 py-0.5 rounded-full btn-gold mb-3">
                <Pin className="h-3 w-3" /> Pinned
              </span>
            )}
            <h2 className="font-display text-2xl sm:text-3xl font-bold gold-text">{n.title}</h2>
            <div className="mt-2 text-xs text-muted-foreground inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {n.published_at ? new Date(n.published_at).toLocaleDateString() : ""}
            </div>
            {n.excerpt && <p className="mt-3 text-muted-foreground">{n.excerpt}</p>}
            {n.body && <p className="mt-3 leading-relaxed">{n.body}</p>}
          </article>
        ))}
        {!data?.length && <div className="glass p-10 text-center text-muted-foreground">No news yet.</div>}
      </section>
    </>
  );
}