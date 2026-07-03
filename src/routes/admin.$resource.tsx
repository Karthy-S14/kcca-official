import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_RESOURCES } from "@/lib/site-config";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Save } from "lucide-react";

export const Route = createFileRoute("/admin/$resource")({
  component: ResourceManager,
});

// Editable field lists per table (excludes id / timestamps).
const FIELDS: Record<string, string[]> = {
  members: ["name", "school", "age", "rating", "grade", "photo_url", "achievements"],
  rated_players: ["name", "title", "fide_id", "standard_rating", "rapid_rating", "blitz_rating", "school", "grade", "age", "current_rank", "status", "photo_url"],
  tournaments: ["name", "grade", "venue", "event_date", "time_info", "entry_fee", "system", "status", "description", "poster_url", "registration_open"],
  achievements: ["title", "description", "event_date", "category", "winner", "image_url"],
  committee: ["name", "role", "photo_url", "bio", "sort_order"],
  training: ["title", "category", "description", "content", "video_url", "schedule_date"],
  gallery: ["title", "image_url", "category", "caption", "event_date"],
  downloads: ["title", "category", "description", "file_url", "file_size"],
  news: ["title", "slug", "excerpt", "body", "image_url", "pinned"],
  contacts: ["name", "email", "phone", "subject", "message", "handled"],
};

function ResourceManager() {
  const { resource } = useParams({ from: "/admin/$resource" });
  const meta = ADMIN_RESOURCES.find((r) => r.slug === resource);
  const table = meta?.table;
  const fields = table ? FIELDS[table] ?? [] : [];
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-list", table],
    queryFn: async () => {
      if (!table) return [];
      const { data, error } = await supabase.from(table as any).select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!table,
  });

  const columns = useMemo(() => fields.slice(0, 4), [fields]);

  async function remove(id: string) {
    if (!table) return;
    if (!confirm("Delete this record?")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-list", table] });
  }

  async function save(row: any) {
    if (!table) return;
    const payload: any = {};
    for (const f of fields) {
      let v = row[f];
      if (v === "") v = null;
      if (["age", "rating", "standard_rating", "rapid_rating", "blitz_rating", "current_rank", "sort_order"].includes(f) && v != null) v = Number(v);
      if (["pinned", "registration_open", "handled"].includes(f)) v = !!v;
      payload[f] = v;
    }
    const q = row.id
      ? supabase.from(table as any).update(payload).eq("id", row.id)
      : supabase.from(table as any).insert(payload);
    const { error } = await q;
    if (error) return toast.error(error.message);
    toast.success(row.id ? "Updated" : "Created");
    setEditing(null); setCreating(false);
    qc.invalidateQueries({ queryKey: ["admin-list", table] });
  }

  if (!meta) return <div className="glass p-8">Unknown resource.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] gold-text font-semibold">Manage</div>
          <h1 className="mt-1 font-display text-3xl font-bold">{meta.label}</h1>
        </div>
        {resource !== "contacts" && (
          <button onClick={() => { setCreating(true); setEditing({}); }} className="btn-gold inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm">
            <Plus className="h-4 w-4" /> New
          </button>
        )}
      </div>

      <div className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[oklch(0.06_0.005_260)] text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <tr>
                {columns.map((c) => <th key={c} className="px-4 py-3 text-left">{c.replace(/_/g, " ")}</th>)}
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((row: any) => (
                <tr key={row.id} className="border-t border-[oklch(0.82_0.14_84/0.1)]">
                  {columns.map((c) => (
                    <td key={c} className="px-4 py-3 max-w-[240px] truncate">{String(row[c] ?? "—")}</td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => { setCreating(false); setEditing(row); }} className="p-2 text-[oklch(0.9_0.11_88)] hover:bg-[oklch(0.82_0.14_84/0.1)] rounded"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(row.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {!isLoading && !data?.length && (
                <tr><td colSpan={columns.length + 1} className="p-10 text-center text-muted-foreground">No records yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[70] bg-[oklch(0_0_0/0.7)] backdrop-blur-sm grid place-items-center p-4" onClick={() => setEditing(null)}>
          <div className="glass w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-xl font-bold gold-text">{creating ? "New" : "Edit"} {meta.label}</h3>
              <button onClick={() => setEditing(null)} className="p-2 rounded hover:bg-[oklch(0.82_0.14_84/0.1)]"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); save(editing); }} className="grid sm:grid-cols-2 gap-4">
              {fields.map((f) => {
                const isBool = ["pinned", "registration_open", "handled"].includes(f);
                const isLong = ["description", "body", "content", "message", "bio", "achievements"].includes(f);
                return (
                  <div key={f} className={isLong ? "sm:col-span-2" : ""}>
                    <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{f.replace(/_/g, " ")}</label>
                    {isBool ? (
                      <label className="mt-2 flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={!!editing[f]} onChange={(e) => setEditing({ ...editing, [f]: e.target.checked })} /> Enabled
                      </label>
                    ) : isLong ? (
                      <textarea rows={4} value={editing[f] ?? ""} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-md bg-[oklch(0.11_0.006_260/0.6)] border border-[oklch(0.82_0.14_84/0.2)] text-sm" />
                    ) : (
                      <input value={editing[f] ?? ""} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-md bg-[oklch(0.11_0.006_260/0.6)] border border-[oklch(0.82_0.14_84/0.2)] text-sm" />
                    )}
                  </div>
                );
              })}
              <div className="sm:col-span-2 flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setEditing(null)} className="btn-ghost-gold px-4 py-2 rounded-md text-sm">Cancel</button>
                <button type="submit" className="btn-gold inline-flex items-center gap-2 px-5 py-2 rounded-md text-sm"><Save className="h-4 w-4" /> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}