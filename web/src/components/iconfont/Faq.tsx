"use client";

import { useState } from "react";
import { PlusIcon } from "@softstroke/react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-[var(--line)]">
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setOpen(on ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left font-medium"
              >
                {it.q}
                <PlusIcon size={20} className={`shrink-0 text-muted transition-transform duration-300 ${on ? "rotate-45" : ""}`} />
              </button>
            </h3>
            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <p className="overflow-hidden pr-10 text-muted">
                <span className="block pb-5">{it.a}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
