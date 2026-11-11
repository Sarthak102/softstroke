"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@softstroke/react";

type State = "idle" | "copied" | "failed";

export function useCopy() {
  const [state, setState] = useState<State>("idle");
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 1800);
  }
  return { state, copy };
}

function CopyGlyph({ state }: { state: State }) {
  return (
    <>
      {state === "copied" ? (
        <CheckIcon size={18} className="text-accent-text" />
      ) : state === "failed" ? (
        <span className="font-sans text-xs text-muted">Copy failed</span>
      ) : (
        <CopyIcon size={18} className="opacity-60" />
      )}
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : ""}
      </span>
    </>
  );
}

export function CopyCommand({ command }: { command: string }) {
  const { state, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(command)}
      className="glass flex items-center gap-3 rounded-full px-5 py-3 font-mono text-sm transition-transform active:scale-[0.98]"
    >
      <span className="text-muted">$</span>
      {command}
      <CopyGlyph state={state} />
    </button>
  );
}

// Icon-only copy button for code blocks.
export function CopyButton({ text, label = "Copy code", className = "" }: { text: string; label?: string; className?: string }) {
  const { state, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={label}
      className={`grid size-9 place-items-center rounded-xl transition-[background-color,scale] hover:bg-white/10 active:scale-90 ${className}`}
    >
      <CopyGlyph state={state} />
    </button>
  );
}
