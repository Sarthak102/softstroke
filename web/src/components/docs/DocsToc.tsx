"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/docs";

export function DocsToc({ toc }: { toc: TocItem[] }) {
  const [active, setActive] = useState(toc[0]?.id);

  useEffect(() => {
    // The heading nearest the top of the viewport (below the nav) is the current section.
    const heads = toc.map((t) => document.getElementById(t.id)).filter((h): h is HTMLElement => !!h);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px" },
    );
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [toc]);

  if (!toc.length) return <span className="hidden xl:block" />;
  return (
    <nav aria-label="On this page" className="sticky top-28 hidden h-fit text-sm xl:block">
      <p className="mb-3 font-medium">On this page</p>
      <ul className="space-y-2 border-l border-[var(--line)]">
        {toc.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              className={`-ml-px block border-l-2 py-0.5 transition-colors ${t.depth === 3 ? "pl-6" : "pl-3"} ${
                active === t.id ? "border-accent text-accent-text" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
