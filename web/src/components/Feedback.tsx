"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { XIcon } from "@softstroke/react";
import { ISSUE_URL, REQUEST_URL } from "@/lib/site";

// "Request an icon" and "Report an issue" as a modal on the site. The site is static (no server, no token), so
// submitting opens the matching GitHub issue form in a new tab with every field already filled in.
type Kind = "request" | "issue";
type Fields = Record<string, string>;
const EVENT = "softstroke:feedback";

// Field ids match .github/ISSUE_TEMPLATE/*.yml; GitHub pre-fills a form field from ?<id>=value.
const FORMS: Record<Kind, { title: string; intro: string; base: string; fields: { id: string; label: string; hint?: string; max: number; long?: boolean; required?: boolean }[] }> = {
  request: {
    title: "Request an icon",
    intro: "Tell us what you need. Every icon is drawn from scratch in the Softstroke style; brand logos are not added.",
    base: REQUEST_URL,
    fields: [
      { id: "name", label: "Icon name", hint: "One or two words, e.g. pill-bottle", max: 60, required: true },
      { id: "use", label: "Where would you use it?", hint: "The screen, button or feature it is for", max: 1000, long: true, required: true },
      { id: "looks", label: "What should it show?", hint: "Optional: the object or idea", max: 1000, long: true },
    ],
  },
  issue: {
    title: "Report an issue",
    intro: "Something looks wrong or does not work? An icon, a package or this website.",
    base: ISSUE_URL,
    fields: [
      { id: "what", label: "What happened?", hint: "What you saw, and what you expected instead", max: 2000, long: true, required: true },
      { id: "where", label: "Where?", hint: "Icon name, package and version, or the page", max: 200, required: true },
      { id: "steps", label: "Steps to reproduce", hint: "Optional: a snippet or the steps", max: 2000, long: true },
    ],
  },
};

export function openFeedback(kind: Kind, prefill: Fields = {}) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { kind, prefill } }));
}

// A link that opens the modal; without JavaScript it still goes to the GitHub form.
export function FeedbackLink({ kind, prefill, className, children }: { kind: Kind; prefill?: Fields; className?: string; children: ReactNode }) {
  return (
    <a
      href={FORMS[kind].base}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let "open in new tab" work
        e.preventDefault();
        openFeedback(kind, prefill);
      }}
    >
      {children}
    </a>
  );
}

function issueUrl(kind: Kind, values: Fields, solid: boolean) {
  const p = new URLSearchParams();
  const v = { ...values };
  if (kind === "request") {
    p.set("title", `Icon request: ${v.name}`);
    if (solid) v.looks = [v.looks, "The solid version is needed too."].filter(Boolean).join("\n\n");
  } else {
    p.set("title", `Bug: ${v.where}`);
  }
  for (const [k, val] of Object.entries(v)) if (val) p.set(k, val);
  return `${FORMS[kind].base}&${p.toString()}`;
}

export function FeedbackModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<Kind>("request");
  const [values, setValues] = useState<Fields>({});
  const [solid, setSolid] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState<{ url: string; blocked: boolean } | null>(null);

  useEffect(() => {
    const open = (e: Event) => {
      const { kind: k, prefill } = (e as CustomEvent<{ kind: Kind; prefill: Fields }>).detail;
      setKind(k);
      setValues(prefill ?? {});
      setSolid(false);
      setError("");
      setSent(null);
      dialog.current?.showModal();
    };
    window.addEventListener(EVENT, open);
    return () => window.removeEventListener(EVENT, open);
  }, []);

  const form = FORMS[kind];

  function submit(e: FormEvent) {
    e.preventDefault();
    const clean = Object.fromEntries(form.fields.map((f) => [f.id, (values[f.id] ?? "").trim().slice(0, f.max)]));
    const missing = form.fields.find((f) => f.required && !clean[f.id]);
    if (missing) {
      setError(`Please fill in "${missing.label}".`);
      return;
    }
    const url = issueUrl(kind, clean, solid);
    const tab = window.open(url, "_blank", "noopener,noreferrer");
    setSent({ url, blocked: !tab });
  }

  const input = "w-full rounded-2xl bg-[var(--glass)] px-4 py-2.5 text-sm ring-1 ring-[var(--line)] outline-none placeholder:text-muted focus:ring-2 focus:ring-accent";

  return (
    <dialog
      ref={dialog}
      aria-labelledby="feedback-title"
      // .liquid sets position: relative; fixed + inset-0 + m-auto restore the centred modal
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      className="liquid fixed inset-0 m-auto h-fit w-[min(32rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[28px] p-0 text-ink backdrop:bg-[#06101f]/40"
      style={{ background: "var(--bg-1)" }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="feedback-title" className="font-display text-2xl font-semibold tracking-tight">{form.title}</h2>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-[var(--glass)] hover:text-ink">
            <XIcon size={18} />
          </button>
        </div>

        {sent ? (
          <div className="mt-4 space-y-4 text-sm">
            <p>
              {sent.blocked
                ? "Your browser blocked the new tab. Open the form here; everything you typed is already filled in:"
                : "GitHub opened in a new tab with everything filled in. Check it and press Create there to send it."}
            </p>
            <a href={sent.url} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-accent px-5 py-2.5 font-medium text-accent-ink">
              {sent.blocked ? "Open the GitHub form" : "Open it again"}
            </a>
            <p className="text-muted">You need a free GitHub account to submit.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-2 space-y-4">
            <p className="text-sm text-muted">{form.intro}</p>
            {form.fields.map((f) => (
              <label key={f.id} className="block">
                <span className="mb-1.5 block text-sm font-medium">
                  {f.label}
                  {!f.required && <span className="font-normal text-muted"> (optional)</span>}
                </span>
                {f.long ? (
                  <textarea rows={3} maxLength={f.max} placeholder={f.hint} value={values[f.id] ?? ""} onChange={(e) => setValues({ ...values, [f.id]: e.target.value })} className={`${input} resize-y`} />
                ) : (
                  <input maxLength={f.max} placeholder={f.hint} value={values[f.id] ?? ""} onChange={(e) => setValues({ ...values, [f.id]: e.target.value })} className={input} />
                )}
              </label>
            ))}
            {kind === "request" && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={solid} onChange={(e) => setSolid(e.target.checked)} className="size-4 accent-[var(--accent)]" />
                I need the solid version too
              </label>
            )}
            {error && <p role="alert" className="text-sm text-red-600 [[data-theme=dark]_&]:text-red-400">{error}</p>}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
              <span className="mr-auto text-xs text-muted">Opens GitHub to send it</span>
              <button type="button" onClick={() => dialog.current?.close()} className="rounded-full px-4 py-2.5 text-sm text-muted hover:text-ink">Cancel</button>
              <button type="submit" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-transform active:scale-[0.98]">Continue on GitHub</button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
