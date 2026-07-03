import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { SITE } from "@/lib/site-config";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — KCCA" },
      { name: "description", content: "Get in touch with Kilinochchi Central Chess Association." },
    ],
  }),
  component: C,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
});

function C() {
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Please check the form");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contacts").insert(parsed.data);
    setSending(false);
    if (error) return toast.error(error.message);
    toast.success("Message sent — we'll get back to you soon.");
    e.currentTarget.reset();
  }

  return (
    <>
      <PageHeader eyebrow="Reach us" title="Contact KCCA" subtitle="Questions, registrations, or partnerships — we'd love to hear from you." />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Info icon={Phone} label="Phone" value={SITE.phone} href={`tel:${SITE.phoneDial}`} />
          <Info icon={Mail} label="Email" value={SITE.email} href={`mailto:${SITE.email}`} />
          <Info icon={MapPin} label="Location" value={SITE.address} />
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="btn-gold inline-flex items-center gap-2 px-5 py-3 rounded-md"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
          <div className="glass p-2 rounded-2xl overflow-hidden">
            <iframe
              title="KCC map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`}
              className="w-full h-72 rounded-xl"
              loading="lazy"
            />
          </div>
        </div>
        <form onSubmit={onSubmit} className="glass p-8 space-y-4">
          <h2 className="font-display text-2xl font-bold gold-text">Send a message</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field name="name" label="Your Name" />
            <Field name="email" label="Email" type="email" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field name="phone" label="Phone (optional)" required={false} />
            <Field name="subject" label="Subject (optional)" required={false} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Message</label>
            <textarea name="message" required rows={5} maxLength={2000} className="mt-2 w-full px-4 py-3 rounded-md bg-[oklch(0.11_0.006_260/0.6)] border border-[oklch(0.82_0.14_84/0.2)] text-sm focus:outline-none focus:border-[oklch(0.82_0.14_84/0.6)]" />
          </div>
          <button disabled={sending} className="btn-gold w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md disabled:opacity-50">
            <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send Message"}
          </button>
        </form>
      </section>
    </>
  );
}

function Info({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) {
  const Cmp: any = href ? "a" : "div";
  return (
    <Cmp href={href} className="glass p-5 flex items-center gap-4 group">
      <div className="h-11 w-11 rounded-lg btn-gold grid place-items-center"><Icon className="h-5 w-5" /></div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
        <div className="text-sm font-medium mt-0.5">{value}</div>
      </div>
    </Cmp>
  );
}

function Field({ name, label, type = "text", required = true }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full px-4 py-3 rounded-md bg-[oklch(0.11_0.006_260/0.6)] border border-[oklch(0.82_0.14_84/0.2)] text-sm focus:outline-none focus:border-[oklch(0.82_0.14_84/0.6)]"
      />
    </div>
  );
}