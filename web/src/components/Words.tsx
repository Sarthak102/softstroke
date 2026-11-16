import { Fragment, type ReactNode } from "react";

// Splits a heading into words so they can rise in one by one (.w in globals.css; Reveal adds .in).
// Strings are split; elements (like an <em>) are passed through as one word.
export function Words({ children }: { children: ReactNode }) {
  let i = 0;
  const parts = (Array.isArray(children) ? children : [children]).flatMap((c, k) =>
    typeof c === "string"
      ? c.split(/(\s+)/).filter(Boolean).map((w, j) =>
          /^\s+$/.test(w) ? <Fragment key={`${k}-${j}`}>{w}</Fragment> : <span key={`${k}-${j}`} className="w" style={{ "--i": i++ } as React.CSSProperties}>{w}</span>,
        )
      : [<span key={k} className="w" style={{ "--i": i++ } as React.CSSProperties}>{c}</span>],
  );
  return <>{parts}</>;
}
