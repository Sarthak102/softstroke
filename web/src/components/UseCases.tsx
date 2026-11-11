import Link from "next/link";
import { ArrowRightIcon } from "@softstroke/react";
import { BASE } from "@/lib/site";

// Home-page teaser for /use-cases: one wide scene and two smaller ones, each opening the full page.
const SHOTS = [
  { id: "bento", alt: "App cards built with Softstroke icons", big: true },
  { id: "soft-menu", alt: "An account menu built with Softstroke icons" },
  { id: "glass-bar", alt: "A glass tab bar built with Softstroke icons" },
];

export function UseCases() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">Seven screens, one icon set</h2>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-muted">
              Menus, tab bars, dashboards and app cards, drawn with nothing but Softstroke. Each one lists the icons it uses.
            </p>
          </div>
          <Link href="/use-cases/" className="group flex items-center gap-2 rounded-full px-1 py-2 font-medium text-accent-text">
            See all use cases
            <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-[1.6fr_1fr] md:grid-rows-2">
          {SHOTS.map((s) => (
            <Link
              key={s.id}
              href="/use-cases/"
              className={`glass group block overflow-hidden rounded-[32px] p-2 ${s.big ? "md:row-span-2" : ""}`}
            >
              <img
                src={`${BASE}/use-cases/${s.id}.webp`}
                srcSet={`${BASE}/use-cases/${s.id}-1200.webp 1200w, ${BASE}/use-cases/${s.id}.webp 2400w`}
                sizes={s.big ? "(min-width: 768px) 700px, 100vw" : "(min-width: 768px) 440px, 100vw"}
                alt={s.alt}
                width={2400}
                height={1600}
                loading="lazy"
                decoding="async"
                className={`w-full rounded-[26px] object-cover transition-transform duration-500 group-hover:scale-[1.02] ${s.big ? "aspect-[3/2] md:h-full md:aspect-auto" : "aspect-[3/2]"}`}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
