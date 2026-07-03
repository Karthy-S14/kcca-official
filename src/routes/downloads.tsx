import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads — KCCA" },
      { name: "description", content: "KCCA downloads — notices, forms, rules, and certificates." },
    ],
  }),
  component: D,
});

function D() {
  const { data } = useQuery({
    queryKey: ["downloads"],
    queryFn: async () => (await supabase.from("downloads").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="Resources" title="Downloads" subtitle="Notices, forms, rules, and certificates." />
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 space-y-3">
        {(data ?? []).map((d) => (
          <a key={d.id} href={d.file_url} target="_blank" rel="noreferrer" className="glass p-5 flex items-center justify-between group hover:border-[oklch(0.82_0.14_84/0.4)] transition">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg btn-gold grid place-items-center">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">{d.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{d.category} · {d.file_size ?? "PDF"}</div>
              </div>
            </div>
            <Download className="h-5 w-5 text-[oklch(0.9_0.11_88)] group-hover:translate-y-0.5 transition-transform" />
          </a>
        ))}
        {!data?.length && <div className="glass p-10 text-center text-muted-foreground">No downloads yet.</div>}
      </section>
    </>
  );
}