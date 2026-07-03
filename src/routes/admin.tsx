import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useIsAdmin } from "@/hooks/use-admin";
import { ADMIN_RESOURCES } from "@/lib/site-config";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Users, Crown, Calendar, Award, UserCog,
  BookOpen, ImageIcon, FileText, Newspaper, MessageSquare, LogOut,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — KCCA" }, { name: "robots", content: "noindex" }] }),
  component: AdminShell,
});

const icons: Record<string, any> = {
  members: Users, "rated-players": Crown, tournaments: Calendar,
  achievements: Award, committee: UserCog, training: BookOpen,
  gallery: ImageIcon, downloads: FileText, news: Newspaper, contacts: MessageSquare,
};

function AdminShell() {
  const { isAdmin, loading, user } = useIsAdmin();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth", replace: true });
  }, [user, loading, navigate]);

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading admin…</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="p-16 text-center">
        <h2 className="font-display text-3xl gold-text">Not authorized</h2>
        <p className="text-muted-foreground mt-3">Signed in as {user.email}, but no admin role.</p>
        <p className="text-xs mt-6 text-muted-foreground">The first account created becomes admin automatically.</p>
      </div>
    );
  }

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-[1500px] px-3 sm:px-6 py-6 grid lg:grid-cols-[240px_1fr] gap-6">
      <aside className="lg:sticky lg:top-20 self-start glass p-4 rounded-2xl">
        <div className="px-2 pb-3 mb-3 border-b border-[oklch(0.82_0.14_84/0.15)]"><Logo /></div>
        <nav className="space-y-1 text-sm">
          <SidebarLink to="/admin" icon={LayoutDashboard} active={path === "/admin"}>Overview</SidebarLink>
          {ADMIN_RESOURCES.map((r) => (
            <SidebarLink
              key={r.slug}
              to={`/admin/${r.slug}`}
              icon={icons[r.slug] ?? Users}
              active={path === `/admin/${r.slug}`}
            >
              {r.label}
            </SidebarLink>
          ))}
        </nav>
        <button onClick={signOut} className="mt-6 w-full inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md text-muted-foreground hover:text-[oklch(0.9_0.11_88)] hover:bg-[oklch(0.82_0.14_84/0.08)]">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

function SidebarLink({ to, icon: Icon, active, children }: { to: string; icon: any; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition ${
        active
          ? "bg-[oklch(0.82_0.14_84/0.12)] text-[oklch(0.9_0.11_88)] border border-[oklch(0.82_0.14_84/0.25)]"
          : "text-muted-foreground hover:text-[oklch(0.9_0.11_88)] hover:bg-[oklch(0.82_0.14_84/0.05)]"
      }`}
    >
      <Icon className="h-4 w-4" /> <span className="truncate">{children}</span>
    </Link>
  );
}