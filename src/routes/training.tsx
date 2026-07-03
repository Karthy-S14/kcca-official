import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import trainingImg from "@/assets/training.jpg";
import { BookOpen, Puzzle, Sword, Video, Calendar } from "lucide-react";

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Training — KCCA" },
      { name: "description", content: "KCCA daily chess training, openings, puzzles, and endgame lessons." },
    ],
  }),
  component: T,
});

const categories = [
  { icon: BookOpen, label: "Opening Lessons" },
  { icon: Puzzle, label: "Puzzle of the Day" },
  { icon: Sword, label: "Endgame Lessons" },
  { icon: Video, label: "Video Lessons" },
  { icon: Calendar, label: "Training Calendar" },
];

function T() {
  const { data } = useQuery({
    queryKey: ["training"],
    queryFn: async () => (await supabase.from("training").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="Learn" title="Training" subtitle="Daily coaching, puzzles, and structured lessons for every level." />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-1 space-y-4">
          <img src={trainingImg} alt="KCCA training in session" loading="lazy" width={1400} height={900} className="w-full rounded-2xl gold-border" />
          <div className="glass p-6">
            <div className="text-[11px] uppercase tracking-[0.24em] gold-text font-semibold">Daily Schedule</div>
            <ul className="mt-4 space-y-3 text-sm">
              {categories.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-[oklch(0.82_0.14_84)]" /> {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {(data ?? []).map((t) => (
            <div key={t.id} className="glass p-6">
              <div className="text-[11px] uppercase tracking-[0.22em] gold-text font-semibold">{t.category ?? "Lesson"}</div>
              <h3 className="mt-2 font-display text-xl font-bold">{t.title}</h3>
              {t.description && <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>}
            </div>
          ))}
          {!data?.length && <div className="glass p-8 col-span-full text-muted-foreground">No lessons yet.</div>}
        </div>
      </section>
    </>
  );
}