"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { SunIcon } from "@softstroke/react";
import { MoonIcon as MoonSolidIcon } from "@softstroke/react/solid";

type Theme = "light" | "dark";

const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const MS = 800;

function apply(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    sessionStorage.setItem("theme", next); // this tab only: every new visit opens light (lib/theme.ts)
  } catch {
    // Storage blocked: the switch still works on this page.
  }
}

// Two-option switch (Sarthak's navbar reference). One motion: the white key glides across while the new
// theme grows as a circle from the switch, same duration and easing. The key has its own view-transition
// name, so the browser moves it between its old and new spot on top of the reveal; the two icons have
// their own names too, so they stay drawn above the key while it passes under them.
// Reduced motion or no View Transitions: the theme changes at once and the key slides with CSS.
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  function choose(next: Theme, from: HTMLElement) {
    if (next === theme) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm || !document.startViewTransition) {
      apply(next);
      return setTheme(next);
    }
    const r = from.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = document.startViewTransition(() => {
      apply(next);
      flushSync(() => setTheme(next));
    });
    t.ready.then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: MS, easing: EASE, pseudoElement: "::view-transition-new(root)" },
      ),
    );
  }

  const btn = (on: boolean) => `relative z-10 grid size-8 place-items-center rounded-full transition-colors duration-500 ${on ? "text-[#0b2545]" : "text-muted hover:text-ink"}`;

  // Radio group keyboard pattern: Tab lands on the chosen theme, arrow keys pick (and focus) the other one.
  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next: Theme = theme === "dark" ? "light" : "dark";
    const el = e.currentTarget.querySelector<HTMLButtonElement>(`[data-theme-option="${next}"]`)!;
    el.focus();
    choose(next, el);
  }
  const current = theme ?? "light";

  return (
    <div role="radiogroup" aria-label="Theme" onKeyDown={onKey} className="relative flex items-center gap-0.5 rounded-full bg-[var(--glass)] p-1 ring-1 ring-[var(--line)]">
      {/* the gliding white key: hidden until the saved theme is known, so it never jumps on load */}
      <span
        aria-hidden
        style={{ viewTransitionName: "theme-key", transitionTimingFunction: EASE }}
        className={`absolute left-1 top-1 size-8 rounded-full bg-white shadow-[0_1px_2px_rgb(11_37_69/0.15),0_4px_10px_-4px_rgb(11_37_69/0.35)] transition-[translate,opacity] duration-500 ${
          theme === null ? "opacity-0" : "opacity-100"
        } ${theme === "dark" ? "translate-x-[2.125rem]" : "translate-x-0"}`}
      />
      <button type="button" role="radio" data-theme-option="light" aria-checked={current === "light"} tabIndex={current === "light" ? 0 : -1} style={{ viewTransitionName: "theme-sun" }} aria-label="Light theme" onClick={(e) => choose("light", e.currentTarget)} className={btn(theme === "light")}>
        <SunIcon size={18} />
      </button>
      <button type="button" role="radio" data-theme-option="dark" aria-checked={current === "dark"} tabIndex={current === "dark" ? 0 : -1} style={{ viewTransitionName: "theme-moon" }} aria-label="Dark theme" onClick={(e) => choose("dark", e.currentTarget)} className={btn(theme === "dark")}>
        <MoonSolidIcon size={16} />
      </button>
    </div>
  );
}
