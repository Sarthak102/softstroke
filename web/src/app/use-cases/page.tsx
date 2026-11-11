import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@softstroke/react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { StrokeIcon, type IconName } from "@/lib/icons";
import { BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Use cases | Softstroke",
  description: "Softstroke icons in real interfaces: app cards, menus, tab bars, dashboards and file browsers.",
};

// Images are captured from components/scenes (scripts/scenes.mjs): <id>.webp at 2400px, <id>-1200.webp for phones.
// `icons` = the main icons each scene uses; every chip opens that icon on the icons page.
type Scene = { id: string; title: string; body: string; icons: string[]; wide?: boolean };

const ROWS: Scene[][] = [
  [{ id: "bento", title: "App cards", body: "Weather, health, smart home and music cards. Tabs rest in stroke, the active one turns solid.", wide: true,
     icons: ["inbox", "calendar", "sticky-note", "bookmark", "cloud-sun", "earth", "apple", "moon", "lamp", "home"] }],
  [
    { id: "soft-menu", title: "Account menu", body: "A soft dropdown with icons at 38px, next to large text.", icons: ["user", "puzzle", "sliders", "help-circle", "log-out"] },
    { id: "add-calendar", title: "Call to action", body: "The solid calendar filled with a gradient through the color prop.", icons: ["calendar"] },
  ],
  [{ id: "dashboard", title: "Analytics dashboard", body: "Sidebar navigation, stat cards and toolbar buttons at 20 to 22px.", wide: true,
     icons: ["home", "bar-chart", "inbox", "users", "package", "credit-card", "settings", "filter", "bell", "trending-up"] }],
  [
    { id: "clouds-bar", title: "Glass tab bar", body: "White stroke icons on frosted glass over a photo.", icons: ["home", "search-sparkle", "bookmark"] },
    { id: "glass-bar", title: "Floating tab bar", body: "The active tab in solid with a blue gradient, the rest in stroke.", icons: ["home", "map-pin", "bag", "settings", "search"] },
  ],
  [{ id: "files", title: "File browser", body: "Solid folders, a context menu and a sidebar, all from one set.", wide: true,
     icons: ["folder", "history", "star", "users", "trash", "link", "upload", "sidebar", "copy", "edit"] }],
];

const component = (name: string) => (name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase()) + "Icon") as IconName;

function Card({ id, title, body, icons, wide }: Scene) {
  return (
    <figure className="glass rounded-[32px] p-2">
      <img
        src={`${BASE}/use-cases/${id}.webp`}
        srcSet={`${BASE}/use-cases/${id}-1200.webp 1200w, ${BASE}/use-cases/${id}.webp 2400w`}
        sizes={wide ? "(min-width: 1152px) 1136px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
        alt={`${title} built with Softstroke icons`}
        width={2400}
        height={1600}
        loading={id === "bento" ? "eager" : "lazy"}
        decoding="async"
        className="aspect-[3/2] w-full rounded-[26px] object-cover"
      />
      <figcaption className="px-4 pb-4 pt-4">
        <div className={wide ? "md:flex md:items-baseline md:gap-4" : ""}>
          <span className="block font-display text-lg font-semibold tracking-tight md:shrink-0">{title}</span>
          <span className="mt-1 block text-[15px] leading-relaxed text-muted md:mt-0">{body}</span>
        </div>
        <ul aria-label={`Icons in ${title}`} className="mt-3 flex flex-wrap gap-1.5">
          {icons.map((n) => (
            <li key={n}>
              <Link
                href={`/icons/?icon=${n}`}
                prefetch={false}
                className="flex items-center gap-1.5 rounded-full bg-[var(--glass)] py-1 pl-2 pr-2.5 text-[13px] text-muted ring-1 ring-[var(--line)] transition-colors hover:text-ink"
              >
                <StrokeIcon name={component(n)} size={15} />
                {n}
              </Link>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}

export default function UseCasesPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-32 lg:pt-36">
        <h1 className="max-w-[18ch] font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
          Softstroke in real interfaces.
        </h1>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">
          Menus, tab bars, dashboards and app screens built with Softstroke. Every icon you see here is in the set; tap one below a scene to open it.
        </p>
        <div className="mt-14 grid gap-5">
          {ROWS.map((row, i) => (
            <div key={i} className={`grid gap-5 ${row.length > 1 ? "md:grid-cols-2" : ""}`}>
              {row.map((s) => (
                <Card key={s.id} {...s} />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap items-center gap-3">
          <Link
            href="/icons/"
            prefetch={false}
            className="group flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-ink shadow-[var(--shadow)] transition-transform active:scale-[0.98]"
          >
            Browse all 310 icons
            <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/docs/" className="rounded-full px-4 py-3 text-sm font-medium text-accent-text hover:underline">
            Read the docs
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
