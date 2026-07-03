import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { Logo } from "@/components/site/Logo";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Login — KCCA" },
      { name: "description", content: "KCCA admin authentication portal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate, path]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        navigate({ to: "/admin" });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created — you can now sign in.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent to your email.");
        setMode("login");
      }
    } catch (e: any) {
      toast.error(e.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error(res.error.message ?? "Google sign-in failed");
    if (!res.redirected && !res.error) navigate({ to: "/admin" });
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] grid place-items-center px-4 py-16">
      <div className="glass w-full max-w-md p-8">
        <div className="text-center">
          <Logo compact />
          <h1 className="mt-6 font-display text-3xl font-bold gold-text">
            {mode === "login" ? "Admin Login" : mode === "signup" ? "Create Admin" : "Reset Password"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login" ? "Sign in to manage KCCA." : mode === "signup" ? "First user becomes the KCCA admin." : "We'll email you a reset link."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-3 rounded-md bg-[oklch(0.11_0.006_260/0.6)] border border-[oklch(0.82_0.14_84/0.2)] text-sm focus:outline-none focus:border-[oklch(0.82_0.14_84/0.6)]" />
            </div>
          </div>
          {mode !== "reset" && (
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-3 rounded-md bg-[oklch(0.11_0.006_260/0.6)] border border-[oklch(0.82_0.14_84/0.2)] text-sm focus:outline-none focus:border-[oklch(0.82_0.14_84/0.6)]" />
              </div>
            </div>
          )}
          <button disabled={busy} className="btn-gold w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md disabled:opacity-50">
            {mode === "signup" ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {busy ? "Please wait…" : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </button>
        </form>

        {mode === "login" && (
          <>
            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-[oklch(0.82_0.14_84/0.2)]" /> OR <div className="flex-1 h-px bg-[oklch(0.82_0.14_84/0.2)]" />
            </div>
            <button onClick={google} className="btn-ghost-gold w-full py-3 rounded-md text-sm">Continue with Google</button>
          </>
        )}

        <div className="mt-6 flex justify-between text-xs">
          {mode !== "login" ? (
            <button className="text-[oklch(0.9_0.11_88)] hover:underline" onClick={() => setMode("login")}>← Back to login</button>
          ) : (
            <>
              <button className="text-muted-foreground hover:text-[oklch(0.9_0.11_88)]" onClick={() => setMode("reset")}>Forgot password?</button>
              <button className="text-muted-foreground hover:text-[oklch(0.9_0.11_88)]" onClick={() => setMode("signup")}>Create account</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}