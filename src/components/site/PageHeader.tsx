import { motion } from "framer-motion";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[oklch(0.82_0.14_84/0.15)]">
      <div className="absolute inset-0 chess-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <div className="text-[11px] uppercase tracking-[0.28em] gold-text font-semibold">{eyebrow}</div>
          )}
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
            <span className="gold-text">{title}</span>
          </h1>
          {subtitle && (
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}