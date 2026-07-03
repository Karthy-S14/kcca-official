import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  GraduationCap,
  Award,
  Calendar,
  Image as ImageIcon,
  ChevronRight,
  Crown,
  Sparkles,
} from "lucide-react";
import heroKing from "@/assets/hero-king.jpg";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KCCA — Building Future Chess Champions" },
      {
        name: "description",
        content:
          "Kilinochchi Central Chess Association — tournaments, rated players, training, and achievements under FIDE Laws of Chess.",
      },
    ],
  }),
  component: Home,
});

function useCounts() {
  return useQuery({
    queryKey: ["home-counts"],
    queryFn: async () => {
      const [m, rp, ach, g, t] = await Promise.all([
        supabase.from("members").select("*", { count: "exact", head: true }),
        supabase.from("rated_players").select("*", { count: "exact", head: true }),
        supabase.from("achievements").select("*", { count: "exact", head: true }),
        supabase.from("gallery").select("*", { count: "exact", head: true }),
        supabase.from("tournaments").select("*", { count: "exact", head: true }),
      ]);
      return {
        members: m.count ?? 0,
        players: rp.count ?? 0,
        achievements: ach.count ?? 0,
        gallery: g.count ?? 0,
        tournaments: t.count ?? 0,
      };
    },
  });
}

function Home() {
  const { data: counts } = useCounts();
  const { data: news } = useQuery({
    queryKey: ["home-news"],
    queryFn: async () => (await supabase.from("news").select("title,excerpt,slug,pinned").order("published_at", { ascending: false }).limit(6)).data ?? [],
  });
  const { data: tournament } = useQuery({
    queryKey: ["home-tournament"],
    queryFn: async () => (await supabase.from("tournaments").select("*").eq("status", "upcoming").order("created_at").limit(1).maybeSingle()).data,
  });
  const { data: topPlayer } = useQuery({
    queryKey: ["home-top-player"],
    queryFn: async () => (await supabase.from("rated_players").select("*").order("standard_rating", { ascending: false }).limit(1).maybeSingle()).data,
  });
  const { data: latestAchievement } = useQuery({
    queryKey: ["home-latest-achievement"],
    queryFn: async () => (await supabase.from("achievements").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle()).data,
  });

  const stats = [
    { label: "Members", value: counts?.members ?? 0, icon: Users },
    { label: "Students", value: (counts?.members ?? 0) + 40, icon: GraduationCap },
    { label: "Rated Players", value: counts?.players ?? 0, icon: Crown },
    { label: "Champions", value: 12, icon: Trophy },
    { label: "Tournaments", value: counts?.tournaments ?? 0, icon: Calendar },
    { label: "Gallery Photos", value: counts?.gallery ?? 0, icon: ImageIcon },
    { label: "Achievements", value: counts?.achievements ?? 0, icon: Award },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 chess-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(0.82_0.14_84/0.3)] bg-[oklch(0.82_0.14_84/0.05)] text-[11px] uppercase tracking-[0.24em] text-[oklch(0.9_0.11_88)]">
              <Sparkles className="h-3 w-3" /> Est. {SITE.founded} · Kilinochchi Central College
            </div>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.02]">
              <span className="gold-text">KCCA</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl mt-3 font-normal text-foreground/90 tracking-wide">
                {SITE.fullName}
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              {SITE.tagline}. A premier intellectual hub cultivating strategic brilliance,
              patience, and champions of tomorrow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/tournament" className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-md">
                <Trophy className="h-4 w-4" /> Upcoming Tournament
              </Link>
              <Link to="/contact" className="btn-ghost-gold inline-flex items-center gap-2 px-6 py-3 rounded-md">
                Join Club <ChevronRight className="h-4 w-4" />
              </Link>
              <Link to="/gallery" className="btn-ghost-gold inline-flex items-center gap-2 px-6 py-3 rounded-md">
                <ImageIcon className="h-4 w-4" /> View Gallery
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-[oklch(0.82_0.14_84/0.15)] blur-3xl rounded-full" />
            <div className="relative animate-float-slow">
              <img
                src={heroKing}
                alt="Golden chess king on a marble board"
                width={800}
                height={800}
                className="w-full h-auto rounded-2xl gold-border shadow-[0_40px_100px_-30px_oklch(0.82_0.14_84/0.5)]"
              />
              <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full glass grid place-items-center animate-float-slow" style={{ animationDelay: "1s" }}>
                <Crown className="h-10 w-10 text-[oklch(0.9_0.11_88)]" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scrolling news marquee */}
        <div className="border-y border-[oklch(0.82_0.14_84/0.15)] bg-[oklch(0.06_0.005_260)] overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-3 gap-16 text-sm">
            {[...(news ?? []), ...(news ?? [])].map((n, i) => (
              <span key={i} className="inline-flex items-center gap-3 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.14_84)]" />
                <span className="uppercase tracking-[0.2em] text-[oklch(0.9_0.11_88)] text-xs">News</span>
                <span>{n.title}</span>
              </span>
            ))}
            {!news?.length && (
              <span className="text-muted-foreground">Welcome to KCCA — Building Future Chess Champions</span>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass p-5 text-center"
            >
              <s.icon className="h-5 w-5 mx-auto text-[oklch(0.82_0.14_84)]" />
              <div className="mt-2 font-display text-3xl font-bold gold-text">{s.value}</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid lg:grid-cols-3 gap-6">
        <FeatureCard
          eyebrow="Upcoming Tournament"
          title={tournament?.name ?? "TBA"}
          body={tournament?.description ?? "Details will be updated soon."}
          meta={[tournament?.grade, tournament?.venue, tournament?.entry_fee].filter(Boolean) as string[]}
          to="/tournament"
        />
        <FeatureCard
          eyebrow="Top Rated Player"
          title={topPlayer?.name ?? "—"}
          body={topPlayer ? `${topPlayer.title ?? "Rising Talent"} · Standard ${topPlayer.standard_rating}` : "Meet our champions."}
          meta={topPlayer ? [`Rapid ${topPlayer.rapid_rating}`, `Blitz ${topPlayer.blitz_rating}`] : []}
          to="/rated-players"
        />
        <FeatureCard
          eyebrow="Latest Achievement"
          title={latestAchievement?.title ?? "Coming soon"}
          body={latestAchievement?.description ?? ""}
          meta={latestAchievement?.winner ? [`Champion: ${latestAchievement.winner}`] : []}
          to="/achievements"
        />
      </section>
    </>
  );
}

function FeatureCard({
  eyebrow,
  title,
  body,
  meta,
  to,
}: {
  eyebrow: string;
  title: string;
  body: string;
  meta: string[];
  to: string;
}) {
  return (
    <Link to={to} className="glass p-7 group block relative overflow-hidden">
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[oklch(0.82_0.14_84/0.15)] blur-3xl group-hover:scale-125 transition-transform" />
      <div className="text-[11px] uppercase tracking-[0.24em] gold-text font-semibold relative">{eyebrow}</div>
      <h3 className="mt-3 font-display text-2xl font-bold relative">{title}</h3>
      {body && <p className="mt-3 text-sm text-muted-foreground line-clamp-3 relative">{body}</p>}
      {meta.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 relative">
          {meta.map((m) => (
            <span key={m} className="text-[11px] px-2 py-1 rounded-full border border-[oklch(0.82_0.14_84/0.25)] text-muted-foreground">
              {m}
            </span>
          ))}
        </div>
      )}
      <div className="mt-6 inline-flex items-center gap-1 text-sm text-[oklch(0.9_0.11_88)] relative">
        Explore <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}