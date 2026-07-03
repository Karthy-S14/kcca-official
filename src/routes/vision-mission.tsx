import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Eye, Compass } from "lucide-react";

export const Route = createFileRoute("/vision-mission")({
  head: () => ({
    meta: [
      { title: "Vision & Mission — KCCA" },
      { name: "description", content: "The vision and mission of Kilinochchi Central Chess Association." },
    ],
  }),
  component: VM,
});

function VM() {
  return (
    <>
      <PageHeader eyebrow="Purpose" title="Vision & Mission" subtitle="What drives KCCA every single day." />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-6">
        <div className="glass p-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg btn-gold grid place-items-center"><Eye className="h-5 w-5" /></div>
            <h2 className="font-display text-3xl font-bold gold-text">Vision</h2>
          </div>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            To become a premier intellectual hub that fosters critical thinking, patience,
            and strategic brilliance through chess — bringing together individuals of all
            ages to learn, grow, and connect.
          </p>
        </div>
        <div className="glass p-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg btn-gold grid place-items-center"><Compass className="h-5 w-5" /></div>
            <h2 className="font-display text-3xl font-bold gold-text">Mission</h2>
          </div>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            To create an inclusive, welcoming, and vibrant environment encouraging strategic
            thinking, sportsmanship, leadership, and excellence.
          </p>
        </div>
      </section>
    </>
  );
}