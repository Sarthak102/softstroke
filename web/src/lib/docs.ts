import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Marked, type Tokens } from "marked";
import { createHighlighter } from "shiki";
import { BASE } from "./site";

export const DOC_GROUPS: { title: string; pages: { slug: string; title: string }[] }[] = [
  { title: "Getting started", pages: [{ slug: "", title: "Introduction" }, { slug: "installation", title: "Installation" }] },
  {
    title: "Frameworks",
    pages: [
      { slug: "react", title: "React" },
      { slug: "react-native", title: "React Native" },
      { slug: "vue", title: "Vue" },
      { slug: "svelte", title: "Svelte" },
      { slug: "angular", title: "Angular" },
      { slug: "svg", title: "SVG and sprite" },
      { slug: "cdn", title: "CDN" },
      { slug: "font", title: "Icon font" },
    ],
  },
  {
    title: "Guides",
    pages: [
      { slug: "styling", title: "Styling" },
      { slug: "solid", title: "Solid icons" },
      { slug: "accessibility", title: "Accessibility" },
      { slug: "bundle-size", title: "Bundle size" },
    ],
  },
  { title: "About", pages: [{ slug: "design", title: "Design rules" }, { slug: "contributing", title: "Contributing" }, { slug: "license", title: "License" }] },
];

export const DOC_PAGES = DOC_GROUPS.flatMap((g) => g.pages.map((p) => ({ ...p, group: g.title })));

export type TocItem = { id: string; text: string; depth: number };
export type Doc = { slug: string; title: string; description: string; group: string; html: string; toc: TocItem[]; raw: string };

// Inline HTML from marked -> plain text (tags dropped, entities like &#39; decoded).
const plain = (html: string) =>
  html.replace(/<[^>]+>/g, "").replace(/&(#39|quot|amp|lt|gt);/g, (_, e) => ({ "#39": "'", quot: '"', amp: "&", lt: "<", gt: ">" })[e as string]!);
const slugify = (s: string) => plain(s).toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

let highlighter: ReturnType<typeof createHighlighter> | null = null;
const getHighlighter = () =>
  (highlighter ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: ["bash", "tsx", "ts", "js", "json", "html", "css", "vue", "svelte"],
  }));

export async function loadDoc(slug: string): Promise<Doc> {
  const page = DOC_PAGES.find((p) => p.slug === slug);
  if (!page) throw new Error(`no doc page "${slug}"`);
  const file = readFileSync(join(process.cwd(), "content/docs", `${slug || "introduction"}.md`), "utf8");
  const [, front, body] = file.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)!;
  const meta = Object.fromEntries(front.split("\n").map((l) => [l.slice(0, l.indexOf(":")), l.slice(l.indexOf(":") + 1).trim()]));

  const hl = await getHighlighter();
  const toc: TocItem[] = [];
  const marked = new Marked({
    async: true,
    // Highlight ahead of rendering (the renderer itself is synchronous).
    walkTokens: (t) => {
      if (t.type === "code") {
        const c = t as Tokens.Code & { html?: string };
        c.html = hl.codeToHtml(c.text, { lang: c.lang || "bash", themes: { light: "github-light", dark: "github-dark" }, defaultColor: false });
      }
    },
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slugify(text);
        if (depth === 2 || depth === 3) toc.push({ id, text: plain(text), depth });
        return `<h${depth} id="${id}"><a href="#${id}" class="anchor" aria-hidden="true" tabindex="-1">#</a>${text}</h${depth}>`;
      },
      code(t) {
        const c = t as Tokens.Code & { html?: string };
        return `<div class="code-block">${c.html}<button type="button" class="code-copy" aria-label="Copy code">Copy</button></div>`;
      },
      link({ href, tokens }) {
        const text = this.parser.parseInline(tokens);
        if (href.startsWith("/")) return `<a href="${BASE}${href}">${text}</a>`;
        return `<a href="${href}" target="_blank" rel="noreferrer">${text}</a>`;
      },
    },
  });
  const html = await marked.parse(body);
  return { slug, title: meta.title, description: meta.description, group: page.group, html, toc, raw: `# ${meta.title}\n\n${meta.description}\n\n${body.trim()}\n` };
}

// Highlighted HTML for a code sample outside the docs (same themes as the docs).
export async function highlight(code: string, lang: string) {
  return (await getHighlighter()).codeToHtml(code, { lang, themes: { light: "github-light", dark: "github-dark" }, defaultColor: false });
}
