import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import strokeNodes from "@softstroke/svg/icons.json";
import solidNodes from "@softstroke/svg/icons-solid.json";
import keywords from "@softstroke/svg/keywords.json";
import categories from "@softstroke/svg/categories.json";
import { CopyButton } from "@/components/CopyCommand";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { SITE_URL } from "@/lib/site";

type Nodes = [string, Record<string, string>][];
const STROKE = strokeNodes as unknown as Record<string, Nodes>;
const SOLID = solidNodes as unknown as Record<string, Nodes>;
const KEYWORDS = keywords as Record<string, string[]>;
const CATEGORY = categories as Record<string, string>;
const NAMES = Object.keys(STROKE).sort();
// Same rule as scripts/build.mjs: qr-code -> QrCodeIcon.
const component = (n: string) => `${n.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase())}Icon`;
const title = (n: string) => n.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());

export const dynamicParams = false;
export function generateStaticParams() {
  return NAMES.map((name) => ({ name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const words = (KEYWORDS[name] ?? []).slice(0, 4).join(", ");
  return {
    title: `${title(name)} icon | Softstroke`,
    description: `Free ${name} icon in stroke and solid (${words}). SVG, React, Vue, Svelte, Angular, React Native, Flutter and shadcn. MIT licensed.`,
    alternates: { canonical: `${SITE_URL}/icons/${name}/` },
  };
}

function Glyph({ nodes, solid, size, className = "" }: { nodes: Nodes; solid: boolean; size?: number; className?: string }) {
  const paint = solid ? { fill: "currentColor" } : { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className={className} {...paint}>
      {nodes.map(([Tag, attrs], i) => {
        const T = Tag as "path";
        return <T key={i} {...attrs} />;
      })}
    </svg>
  );
}

function Snippet({ label, code }: { label: string; code: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-sm font-medium">{label}</p>
      <div className="glass flex items-center gap-2 rounded-2xl py-1.5 pl-4 pr-1.5">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] [scrollbar-width:none]">{code}</code>
        <CopyButton text={code} label={`Copy ${label.toLowerCase()}`} className="shrink-0 hover:bg-[var(--glass)]" />
      </div>
    </div>
  );
}

export default async function IconPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!STROKE[name]) notFound();
  const C = component(name);
  const cat = CATEGORY[name];
  const related = NAMES.filter((n) => n !== name && CATEGORY[n] === cat).slice(0, 12);
  const frame = "glass grid aspect-square place-items-center rounded-[28px]";

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-28">
        <p className="text-sm text-muted">
          <Link href="/icons/" className="hover:text-ink">Icons</Link>
          <span aria-hidden> / </span>
          <Link href={`/icons/?category=${encodeURIComponent(cat)}`} className="hover:text-ink">{cat}</Link>
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">{title(name)} icon</h1>
        <p className="mt-2 font-mono text-sm text-muted">{name} · {C}</p>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="grid min-w-0 grid-cols-2 content-start gap-3">
            <figure>
              <div className={frame}><Glyph nodes={STROKE[name]} solid={false} className="w-3/5" /></div>
              <figcaption className="mt-2 text-center text-sm text-muted">Stroke</figcaption>
            </figure>
            <figure>
              <div className={frame}><Glyph nodes={SOLID[name]} solid className="w-3/5" /></div>
              <figcaption className="mt-2 text-center text-sm text-muted">Solid</figcaption>
            </figure>
            <div className="col-span-2 mt-3 flex items-end justify-center gap-6 text-muted">
              {[16, 20, 24, 32].map((s) => (
                <span key={s} className="grid justify-items-center gap-1.5 text-xs">
                  <Glyph nodes={STROKE[name]} solid={false} size={s} className="text-ink" />
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="grid min-w-0 content-start gap-4">
            <Snippet label="React" code={`import { ${C} } from "@softstroke/react";`} />
            <Snippet label="React, solid" code={`import { ${C} } from "@softstroke/react/solid";`} />
            <Snippet label="shadcn" code={`npx shadcn@latest add ${SITE_URL}/r/${name}.json`} />
            <Snippet label="shadcn, solid" code={`npx shadcn@latest add ${SITE_URL}/r/${name}-solid.json`} />
            <Snippet label="Icon font" code={`<i class="ss ss-${name}"></i>`} />
            <Snippet label="Flutter" code={`Icon(SoftstrokeIcons.${name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())})`} />
            <p className="text-sm text-muted">
              Vue, Svelte, Angular, React Native, Flutter and plain SVG use the same name: see the{" "}
              <Link href="/docs/" className="text-accent-text hover:underline">docs</Link>. To copy the SVG or download it,{" "}
              <Link href={`/icons/?icon=${name}`} className="text-accent-text hover:underline">open it in the browser</Link>.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(KEYWORDS[name] ?? []).map((k) => (
                <span key={k} className="rounded-full bg-[var(--glass)] px-2.5 py-1 text-xs text-muted ring-1 ring-[var(--line)]">{k}</span>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold tracking-tight">More in {cat}</h2>
            <ul className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2">
              {related.map((n) => (
                <li key={n}>
                  <Link href={`/icons/${n}/`} className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-[20px] p-2 transition-colors hover:bg-[var(--glass)]">
                    <Glyph nodes={STROKE[n]} solid={false} className="size-6" />
                    <span className="w-full truncate text-center text-[11px] text-muted group-hover:text-ink">{n}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
