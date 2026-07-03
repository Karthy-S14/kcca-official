import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { GraduationCap, Trophy, Users, Sparkles, Target, Handshake } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About KCCA — Kilinochchi Central Chess Association" },
      { name: "description", content: "About KCCA — a project of Kilinochchi Central College established in 2026." },
      { property: "og:title", content: "About KCCA" },
      { property: "og:description", content: "A project of Kilinochchi Central College established in 2026." },
    ],
  }),
  component: About,
});

const projects = [
  { icon: Trophy, title: "Monthly Chess Championships", desc: "Regular tournaments building competitive experience." },
  { icon: GraduationCap, title: "Daily Chess Training", desc: "Structured daily coaching for all levels." },
  { icon: Sparkles, title: "Talent Identification", desc: "Discovering and nurturing rising talent." },
  { icon: Users, title: "School Chess Development", desc: "Building the game across schools in Kilinochchi." },
  { icon: Handshake, title: "Community Chess Programs", desc: "Inclusive programs for the wider community." },
  { icon: Target, title: "FIDE Rated Pathway", desc: "A clear route to FIDE-rated competition." },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About KCCA"
        subtitle="KCCA (Kilinochchi Central Chess Association) is a project of Kilinochchi Central College, established in 2026. We create a welcoming, vibrant, and disciplined environment for chess — from beginners to future national champions."
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-[11px] uppercase tracking-[0.24em] gold-text font-semibold">Our Projects</div>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">What we do</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div key={p.title} className="glass p-6">
              <div className="h-11 w-11 rounded-lg border border-[oklch(0.82_0.14_84/0.35)] grid place-items-center bg-[oklch(0.82_0.14_84/0.08)]">
                <p.icon className="h-5 w-5 text-[oklch(0.9_0.11_88)]" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}