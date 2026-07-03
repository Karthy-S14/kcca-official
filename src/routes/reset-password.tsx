import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — KCCA" }, { name: "robots", content: "noindex" }] }),
  component: Reset,
});

function Reset() {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    nav({ to: "/admin" });
  }
  return (
    <section className="min-h-[calc(100vh-4rem)] grid place-items-center px-4 py-16">
      <form onSubmit={submit} className="glass w-full max-w-md p-8">
        <div className="text-center"><Logo compact /></div>
        <h1 className="mt-6 font-display text-2xl font-bold gold-text text-center">Set a new password</h1>
        <div className="mt-6 relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="password" required minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} className="w-full pl-10 pr-3 py-3 rounded-md bg-[oklch(0.11_0.006_260/0.6)] border border-[oklch(0.82_0.14_84/0.2)] text-sm" placeholder="New password" />
        </div>
        <button disabled={busy} className="btn-gold w-full mt-4 py-3 rounded-md disabled:opacity-50">{busy ? "Updating…" : "Update Password"}</button>
      </form>
    </section>
  );
}