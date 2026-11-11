import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton, CopyCommand } from "@/components/CopyCommand";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Faq } from "@/components/iconfont/Faq";
import { GlyphWall } from "@/components/iconfont/GlyphWall";
import { highlight } from "@/lib/docs";
import { StrokeIcon, type IconName } from "@/lib/icons";
import { BASE, FONT_CDN } from "@/lib/site";

export const metadata: Metadata = {
  title: "Icon font | Softstroke",
  description: "All 310 Softstroke icons in stroke and solid as a web font. One CSS link, no build step.",
};

const LINK = `<link rel="stylesheet" href="${FONT_CDN}" />`;
const EXAMPLE = `${LINK}

<nav class="tabs">
  <a class="active"><i class="ss-solid ss-home"></i> Home</a>
  <a><i class="ss ss-search"></i> Search</a>
  <a><i class="ss ss-bell"></i> Inbox</a>
  <a><i class="ss ss-user"></i> Profile</a>
</nav>

<button><i class="ss ss-download"></i> Download</button>`;

const WHY: { icon: IconName; title: string; body: string }[] = [
  { icon: "LinkIcon", title: "One line to install", body: "Add the stylesheet and every icon is a class away." },
  { icon: "PaletteIcon", title: "Styled with CSS", body: "font-size and color work like they do on text." },
  { icon: "LayersIcon", title: "Stroke and solid", body: "Swap ss for ss-solid to mark the active state." },
  { icon: "ZapIcon", title: "About 48 KB per style", body: "WOFF2, cached by the browser after the first load." },
  { icon: "GlobeIcon", title: "Works anywhere HTML does", body: "Plain pages, WordPress, Webflow, prototypes." },
  { icon: "CheckCircleIcon", title: "Same shapes as the SVGs", body: "Built from the same outlines and checked against them." },
];

const FAQ = [
  { q: "What is an icon font?", a: "A font where each character is an icon. You load one stylesheet, then write <i class=\"ss ss-home\"></i> and the browser draws the icon as text, so it follows font-size and color." },
  { q: "Is it free?", a: "Yes. The font and every icon in it are MIT licensed, free for personal and commercial work, with no account or key." },
  { q: "How do I use the solid style?", a: "Use the ss-solid class instead of ss: <i class=\"ss-solid ss-home\"></i>. Both styles have every icon under the same name." },
  { q: "Can I change the stroke width?", a: "No. A font glyph is a filled shape, so each stroke icon is its 1.5px outline. If you need other weights, use a framework package or the SVG files, where strokeWidth is a prop." },
  { q: "Which browsers are supported?", a: "Every current browser. The font ships as WOFF2 only, which all of them support." },
  { q: "Is it accessible?", a: "Add aria-hidden=\"true\" to decorative icons, and put an aria-label on the button or link when an icon is its only content. The docs have examples." },
];

export default async function IconFontPage() {
  const example = await highlight(EXAMPLE, "html");
  return (
    <>
      {/* The real font, served by this site, powers the live examples on this page. */}
      <link rel="stylesheet" href={`${BASE}/font/softstroke.css`} precedence="default" />
      <Nav />
      <main>
        <section className="relative overflow-hidden">
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-32 lg:grid-cols-[1fr_1.05fr] lg:pt-36">
            <div className="min-w-0">
              <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl">Every icon, one CSS link.</h1>
              <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-muted">
                All 310 icons in stroke and solid as a web font. For pages where a build step is more than you need.
              </p>
              <div className="glass mt-8 flex max-w-full items-center gap-2 rounded-2xl py-2 pl-4 pr-2">
                <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px]">{FONT_CDN}</code>
                <CopyButton text={LINK} label="Copy stylesheet link" className="text-muted hover:bg-[var(--glass)]" />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <CopyCommand command="npm i @softstroke/font" />
                <Link href="/docs/font/" className="rounded-full px-4 py-3 text-sm font-medium text-accent-text hover:underline">
                  Read the docs
                </Link>
              </div>
            </div>
            <GlyphWall />
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Write a class, get an icon.</h2>
            <div className="mt-10 grid overflow-hidden rounded-[32px] ring-1 ring-[var(--line)] lg:grid-cols-[1.2fr_1fr]">
              <div className="doc-prose relative min-w-0 bg-[var(--glass)] [&_pre]:!rounded-none [&_pre]:!shadow-none">
                <div className="code-block" dangerouslySetInnerHTML={{ __html: example }} />
                <CopyButton text={EXAMPLE} className="absolute right-3 top-3 text-muted" />
              </div>
              <div className="glass grid place-items-center gap-6 p-8">
                <nav aria-label="Example tabs" className="flex gap-1 rounded-full bg-[var(--glass)] p-1 text-sm ring-1 ring-[var(--line)]">
                  <span className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-accent-ink"><i className="ss-solid ss-home" aria-hidden /> Home</span>
                  <span className="flex items-center gap-2 px-3 py-2 text-muted"><i className="ss ss-search" aria-hidden /> Search</span>
                  <span className="flex items-center gap-2 px-3 py-2 text-muted max-sm:hidden"><i className="ss ss-bell" aria-hidden /> Inbox</span>
                  <span className="flex items-center gap-2 px-3 py-2 text-muted max-sm:hidden"><i className="ss ss-user" aria-hidden /> Profile</span>
                </nav>
                <span className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm ring-1 ring-[var(--line)]"><i className="ss ss-download" aria-hidden /> Download</span>
                <p className="text-center text-sm text-muted">Rendered live with the font.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Why the font.</h2>
            <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {WHY.map((w) => (
                <li key={w.title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent-text">
                    <StrokeIcon name={w.icon} size={22} />
                  </span>
                  <span>
                    <span className="block font-medium">{w.title}</span>
                    <span className="mt-1 block text-muted">{w.body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="glass mt-14 flex flex-col gap-3 rounded-[24px] p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[60ch] text-muted">
                <span className="font-medium text-ink">Need custom stroke widths or only a few icons?</span> A framework package ships just the icons you import, with strokeWidth as a prop.
              </p>
              <Link href="/docs/installation/" className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink">
                See packages
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 pt-12">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Questions.</h2>
            <Faq items={FAQ} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
