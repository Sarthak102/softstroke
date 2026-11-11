"use client";

import { CheckIcon, CopyIcon } from "@softstroke/react";
import { useCopy } from "../CopyCommand";

// Rendered docs HTML (our own Markdown, built at compile time). One delegated listener drives every code block's copy button.
export function DocsArticle({ html }: { html: string }) {
  async function onClick(e: React.MouseEvent<HTMLDivElement>) {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".code-copy");
    if (!btn) return;
    const code = btn.parentElement?.querySelector("pre")?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(code);
      btn.textContent = "Copied";
    } catch {
      btn.textContent = "Copy failed";
    }
    setTimeout(() => (btn.textContent = "Copy"), 1600);
  }
  return <div className="doc-prose mt-10" onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}

// The page as Markdown: handy to paste into an AI assistant or an issue.
export function CopyPage({ raw }: { raw: string }) {
  const { state, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(raw)}
      className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-transform active:scale-[0.98]"
    >
      {state === "copied" ? <CheckIcon size={16} className="text-accent-text" /> : <CopyIcon size={16} className="text-muted" />}
      {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy page"}
    </button>
  );
}
