"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { XIcon } from "@softstroke/react";
import { FEEDBACK_API, ISSUE_URL, REQUEST_URL, TURNSTILE_SITE_KEY } from "@/lib/site";

// "Request an icon" and "Report an issue" as a modal on the site. With the feedback Worker configured (api/),
// Submit sends it directly and the Worker opens the GitHub issue with the project's account: no GitHub account
// needed. Without it, or if the Worker is down, it hands off to the GitHub issue form with every field filled in.
type Kind = "request" | "issue";
type Fields = Record<string, string>;
const EVENT = "softstroke:feedback";
const DIRECT = Boolean(FEEDBACK_API && TURNSTILE_SITE_KEY);
const AUTHOR_MAX = 60;

// Field ids and limits match .github/ISSUE_TEMPLATE/*.yml (GitHub pre-fills ?<id>=value) and api/src/issue.ts.
const FORMS: Record<Kind, { title: string; intro: string; base: string; fields: { id: string; label: string; hint?: string; max: number; long?: boolean; required?: boolean }[] }> = {
  request: {
    title: "Request an icon",
    intro: "Tell us what you need. Every icon is drawn from scratch in the Softstroke style; brand logos are not added.",
    base: REQUEST_URL,
    fields: [
      { id: "name", label: "Icon name", hint: "One or two words, e.g. pill-bottle", max: 60, required: true },
      { id: "use", label: "Where would you use it?", hint: "The screen, button or feature it is for", max: 1000, long: true, required: true },
      { id: "looks", label: "What should it show?", hint: "The object or idea", max: 1000, long: true },
    ],
  },
  issue: {
    title: "Report an issue",
    intro: "Something looks wrong or does not work? An icon, a package or this website.",
    base: ISSUE_URL,
    fields: [
      { id: "what", label: "What happened?", hint: "What you saw, and what you expected instead", max: 2000, long: true, required: true },
      { id: "where", label: "Where?", hint: "Icon name, package and version, or the page", max: 200, required: true },
      { id: "steps", label: "Steps to reproduce", hint: "A snippet or the steps", max: 2000, long: true },
    ],
  },
};

type Turnstile = {
  render: (el: HTMLElement, o: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
let turnstileScript: Promise<void> | null = null;
function loadTurnstile() {
  turnstileScript ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      turnstileScript = null;
      reject(new Error("turnstile"));
    };
    document.head.appendChild(s);
  });
  return turnstileScript;
}

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

type Done = { mode: "sent"; url: string; number: number } | { mode: "github"; url: string; blocked: boolean };

export function FeedbackModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const captcha = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [opened, setOpened] = useState(0);
  const [kind, setKind] = useState<Kind>("request");
  const [values, setValues] = useState<Fields>({});
  const [author, setAuthor] = useState("");
  const [solid, setSolid] = useState(false);
  const [token, setToken] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState("");
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => {
    const open = (e: Event) => {
      const { kind: k, prefill } = (e as CustomEvent<{ kind: Kind; prefill: Fields }>).detail;
      setKind(k);
      setValues(prefill ?? {});
      setSolid(false);
      setError("");
      setFallback("");
      setDone(null);
      dialog.current?.showModal();
      setOpened((n) => n + 1);
    };
    window.addEventListener(EVENT, open);
    return () => window.removeEventListener(EVENT, open);
  }, []);

  // A fresh spam-check widget each time the form is shown.
  useEffect(() => {
    if (!DIRECT || !opened || done) return;
    let gone = false;
    setToken("");
    loadTurnstile()
      .then(() => {
        if (gone || !captcha.current || !window.turnstile) return;
        widget.current = window.turnstile.render(captcha.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
          size: "flexible",
          callback: (t: string) => setToken(t),
          "expired-callback": () => setToken(""),
          "error-callback": () => setToken(""),
        });
      })
      .catch(() => setError("The spam check could not load. You can still send it on GitHub."));
    return () => {
      gone = true;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [opened, kind, done]);

  const form = FORMS[kind];

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const clean = Object.fromEntries(form.fields.map((f) => [f.id, (values[f.id] ?? "").trim().slice(0, f.max)]));
    const missing = form.fields.find((f) => f.required && !clean[f.id]);
    if (missing) return setError(`Please fill in "${missing.label}".`);
    const github = issueUrl(kind, clean, solid);

    if (!DIRECT) {
      const tab = window.open(github, "_blank", "noopener,noreferrer");
      return setDone({ mode: "github", url: github, blocked: !tab });
    }
    if (!token) return setError("Please wait a moment for the spam check to finish.");

    setSending(true);
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 15000);
    try {
      const res = await fetch(`${FEEDBACK_API}/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, author: author.trim().slice(0, AUTHOR_MAX), fields: clean, solid, turnstile: token }),
        signal: abort.signal,
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; number?: number; error?: string };
      if (res.ok && data.url) {
        setDone({ mode: "sent", url: data.url, number: data.number ?? 0 });
      } else {
        setError(data.error ?? "We could not send it right now. Please try again.");
        setFallback(github);
        if (widget.current) window.turnstile?.reset(widget.current);
        setToken("");
      }
    } catch {
      setError("We could not reach the server. Check your connection and try again.");
      setFallback(github);
    } finally {
      clearTimeout(timer);
      setSending(false);
    }
  }

  const input = "w-full rounded-2xl bg-[var(--glass)] px-4 py-2.5 text-sm ring-1 ring-[var(--line)] outline-none placeholder:text-muted focus:ring-2 focus:ring-accent";
  const close = () => dialog.current?.close();

  return (
    <dialog
      ref={dialog}
      aria-labelledby="feedback-title"
      // .liquid sets position: relative; fixed + inset-0 + m-auto restore the centred modal
      onClick={(e) => e.target === dialog.current && close()}
      className="liquid fixed inset-0 m-auto h-fit w-[min(32rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[28px] p-0 text-ink backdrop:bg-[#06101f]/40"
      style={{ background: "var(--bg-1)" }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="feedback-title" className="font-display text-2xl font-semibold tracking-tight">{form.title}</h2>
          <button type="button" onClick={close} aria-label="Close" className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-[var(--glass)] hover:text-ink">
            <XIcon size={18} />
          </button>
        </div>

        {done?.mode === "sent" ? (
          <div className="mt-4 space-y-4 text-sm" role="status">
            <p className="text-base">
              Thanks{author.trim() ? `, ${author.trim()}` : ""}! It&rsquo;s sent{done.number ? ` as #${done.number}` : ""}.
            </p>
            <p className="text-muted">You can follow it on GitHub; no account is needed to read it.</p>
            <div className="flex flex-wrap gap-3">
              <a href={done.url} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-accent px-5 py-2.5 font-medium text-accent-ink">Follow it on GitHub</a>
              <button type="button" onClick={close} className="rounded-full px-4 py-2.5 text-muted hover:text-ink">Close</button>
            </div>
          </div>
        ) : done?.mode === "github" ? (
          <div className="mt-4 space-y-4 text-sm">
            <p>
              {done.blocked
                ? "Your browser blocked the new tab. Open the form here; everything you typed is already filled in:"
                : "GitHub opened in a new tab with everything filled in. Check it and press Create there to send it."}
            </p>
            <a href={done.url} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-accent px-5 py-2.5 font-medium text-accent-ink">
              {done.blocked ? "Open the GitHub form" : "Open it again"}
            </a>
            <p className="text-muted">You need a free GitHub account to submit.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-2 space-y-4">
            <p className="text-sm text-muted">{form.intro}</p>
            {DIRECT && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">
                  Your name <span className="font-normal text-muted">(optional)</span>
                </span>
                <input maxLength={AUTHOR_MAX} autoComplete="name" placeholder="Shown with your message" value={author} onChange={(e) => setAuthor(e.target.value)} className={input} />
              </label>
            )}
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
            {DIRECT && <div ref={captcha} className="min-h-[65px]" />}
            {error && (
              <p role="alert" className="text-sm text-red-600 [[data-theme=dark]_&]:text-red-400">
                {error}
                {fallback && (
                  <>
                    {" "}
                    <a href={fallback} target="_blank" rel="noopener noreferrer" className="underline">Send it on GitHub instead</a>.
                  </>
                )}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
              <span className="mr-auto text-xs text-muted">{DIRECT ? "Posted publicly on GitHub" : "Opens GitHub to send it"}</span>
              <button type="button" onClick={close} className="rounded-full px-4 py-2.5 text-sm text-muted hover:text-ink">Cancel</button>
              <button type="submit" disabled={sending} className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-transform active:scale-[0.98] disabled:opacity-60">
                {DIRECT ? (sending ? "Sending…" : "Submit") : "Continue on GitHub"}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
