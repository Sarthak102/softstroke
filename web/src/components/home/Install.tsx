"use client";

import { useState, type KeyboardEvent } from "react";
import { siAngular, siFlutter, siJsdelivr, siReact, siSvelte, siSvg, siVuedotjs } from "simple-icons";
import { Brand, type Logo } from "../Brand";
import { CopyButton } from "../CopyCommand";
import { Words } from "../Words";
import { brandColor } from "./brand-color";

// The documented API of each package (same snippets as the docs).
const TARGETS: { name: string; logo: (Logo & { hex: string; title: string }) | null; install: string; code: string }[] = [
  { name: "React", logo: siReact, install: "npm i @softstroke/react", code: `import { HomeIcon } from "@softstroke/react";\n\n<HomeIcon size={24} strokeWidth={1.5} />` },
  { name: "Vue", logo: siVuedotjs, install: "npm i @softstroke/vue", code: `<script setup>\nimport { HomeIcon } from "@softstroke/vue";\n</script>\n\n<template>\n  <HomeIcon :size="24" />\n</template>` },
  { name: "Svelte", logo: siSvelte, install: "npm i @softstroke/svelte", code: `<script>\n  import { HomeIcon } from "@softstroke/svelte";\n</script>\n\n<HomeIcon size={24} />` },
  { name: "Angular", logo: siAngular, install: "npm i @softstroke/angular", code: `import { HomeIcon } from "@softstroke/angular";\n\n@Component({ imports: [HomeIcon], template: \`<ss-home [size]="24" />\` })` },
  { name: "React Native", logo: siReact, install: "npm i @softstroke/react-native", code: `import { HomeIcon } from "@softstroke/react-native";\n\n<HomeIcon size={24} color="#141412" />` },
  { name: "Flutter", logo: siFlutter, install: "flutter pub add softstroke", code: `import 'package:softstroke/softstroke.dart';\n\nIcon(SoftstrokeIcons.home, size: 24)` },
  { name: "SVG", logo: siSvg, install: "npm i @softstroke/svg", code: `<svg width="24" height="24">\n  <use href="sprite.svg#home" />\n</svg>` },
  { name: "CDN", logo: siJsdelivr, install: "No install needed", code: `<img src="https://cdn.jsdelivr.net/npm/@softstroke/svg/dist/icons/home.svg"\n     width="24" height="24" alt="Home" />` },
  { name: "Icon font", logo: null, install: "npm i @softstroke/font", code: `<link rel="stylesheet"\n  href="https://cdn.jsdelivr.net/npm/@softstroke/font/dist/softstroke.css" />\n\n<i class="ss ss-home"></i>\n<i class="ss-solid ss-home"></i>` },
];

// Strings and the import keywords, one pass per line.
function Line({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(/(["'])(.*?)\1|\b(import|from)\b/g)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<span key={m.index} className={m[3] ? "k" : "s"}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return <>{out}</>;
}

// 05: one tab per target; the code lines slide in when the tab changes.
export function Install() {
  const [sel, setSel] = useState(0);
  const t = TARGETS[sel];
  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const d = ({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 } as Record<string, number>)[e.key];
    if (!d) return;
    e.preventDefault();
    const n = (sel + d + TARGETS.length) % TARGETS.length;
    setSel(n);
    e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")[n]?.focus();
  }
  return (
    <section className="section wrap" id="install" style={{ paddingTop: 48 }}>
      <div data-reveal>
        <p className="eyebrow"><b>05</b> Install</p>
        <h2 className="display h2" data-split><Words>Works where you build</Words></h2>
        <p className="lede">The same icons for nine targets, with the same names and the same props.</p>
      </div>
      <div className="fw" data-reveal>
        <div className="fw-list" role="tablist" aria-label="Framework" onKeyDown={onKey}>
          {TARGETS.map((x, i) => (
            <button key={x.name} type="button" role="tab" aria-selected={i === sel} tabIndex={i === sel ? 0 : -1} className="fw-item" onClick={() => setSel(i)} style={{ "--brand": x.logo ? brandColor(x.logo) : "var(--accent)" } as React.CSSProperties}>
              <Brand logo={x.logo} size={18} />
              <span>{x.name}</span>
              <span className="meta">{x.install.startsWith("npm") ? x.install.split("/").pop() : x.install.startsWith("flutter") ? "pub.dev" : "no build"}</span>
            </button>
          ))}
        </div>
        <div className="code" role="tabpanel" aria-label={`${t.name} usage`}>
          <div className="code-top">
            <span className="dots"><i /><i /><i /></span>
            <span>{t.install.startsWith("No") ? t.install : `$ ${t.install}`}</span>
            {!t.install.startsWith("No") && <CopyButton text={t.install} label="Copy install command" className="cp" />}
          </div>
          <pre key={sel}>
            <code>
              {t.code.split("\n").map((l, j) => (
                <span key={j} className="ln" style={{ "--l": j } as React.CSSProperties}>{l ? <Line text={l} /> : " "}</span>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
