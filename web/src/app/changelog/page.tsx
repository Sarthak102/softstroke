import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { StrokeIcon, type IconName } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Changelog | Softstroke",
  description: "Every Softstroke release: new icons, fixes and package changes.",
};

// Newest first. Set the date when the version is published to npm.
const RELEASES: { version: string; date: string; summary: string; groups: { icon: IconName; title: string; items: string[] }[] }[] = [
  {
    version: "1.0.0",
    date: "Not released yet",
    summary: "The first public release: 310 icons in stroke and solid, with packages for every major framework.",
    groups: [
      {
        icon: "SparklesIcon",
        title: "Icons",
        items: [
          "310 icons on a 24px grid with a 1.5px stroke, round caps and squircle corners.",
          "A solid twin for every icon, built from the stroke icon's own outline.",
          "Search keywords and a category for every icon.",
        ],
      },
      {
        icon: "PackageIcon",
        title: "Packages",
        items: [
          "@softstroke/react, @softstroke/react-native, @softstroke/vue, @softstroke/svelte and @softstroke/angular.",
          "@softstroke/svg with files, sprites, JSON, keywords and categories.",
          "@softstroke/font: stroke and solid web fonts from one CSS link.",
        ],
      },
      {
        icon: "BookOpenIcon",
        title: "Website",
        items: ["Icon browser with search, categories and shareable links.", "Documentation for every package, and an icon font page."],
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-32">
        <h1 className="font-display text-5xl font-semibold tracking-tight md:text-6xl">Changelog</h1>
        <p className="mt-4 max-w-[52ch] text-lg text-muted">
          New icons and package changes, release by release. Icons are never renamed or removed in a minor version.
        </p>
        <ol className="mt-16">
          {RELEASES.map((r) => (
            <li key={r.version} className="relative grid gap-6 border-l border-[var(--line)] pb-16 pl-8 md:grid-cols-[180px_1fr] md:gap-12 md:border-l-0 md:pl-0">
              <span aria-hidden className="absolute -left-[5px] top-2 size-2.5 rounded-full bg-accent md:hidden" />
              <div className="md:sticky md:top-28 md:h-fit">
                <p className="font-display text-2xl font-semibold">{r.version}</p>
                <p className="mt-1 text-sm text-muted">{r.date}</p>
              </div>
              <div className="glass rounded-[28px] p-6 sm:p-8">
                <p className="text-lg">{r.summary}</p>
                <div className="mt-8 space-y-8">
                  {r.groups.map((g) => (
                    <section key={g.title}>
                      <h2 className="flex items-center gap-2 font-medium">
                        <span className="grid size-8 place-items-center rounded-xl bg-accent/10 text-accent-text">
                          <StrokeIcon name={g.icon} size={18} />
                        </span>
                        {g.title}
                      </h2>
                      <ul className="mt-3 space-y-2 pl-10 text-muted">
                        {g.items.map((it) => (
                          <li key={it} className="list-disc">{it}</li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted">
          Want an icon in the next release? <Link href="/docs/contributing/" className="text-accent-text underline underline-offset-4">Request it</Link>.
        </p>
      </main>
      <Footer />
    </>
  );
}
