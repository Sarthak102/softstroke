import Link from "next/link";
import { BASE } from "@/lib/site";
import { Glyph } from "@/lib/glyph";
import type { UseCase } from "./use-cases";

// One use case: the captured scene, its caption, and chips for the icons it uses.
// `h` is the caption heading level: 3 under a section h2 on home, 2 directly under the page h1.
export function CaseCard({ c, i, eager, h = 3 }: { c: UseCase; i: number; eager?: boolean; h?: 2 | 3 }) {
  const H = `h${h}` as const;
  return (
    <article className="case">
      <div className="case-img">
        {/* Light and dark captures; CSS shows the one for the theme, and a hidden lazy image is never fetched. */}
        {(["", "-dark"] as const).map((v) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={v}
            className={v ? "case-dark" : "case-light"}
            src={`${BASE}/use-cases/${c.id}${v}-1200.webp`}
            srcSet={`${BASE}/use-cases/${c.id}${v}-1200.webp 1200w, ${BASE}/use-cases/${c.id}${v}.webp 2400w`}
            sizes="(min-width: 900px) 600px, 84vw"
            alt={v ? "" : `${c.title} built with Softstroke icons`}
            aria-hidden={v ? true : undefined}
            width={1200}
            height={800}
            loading={eager && !v ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
      </div>
      <div className="case-cap">
        <H>{c.title}<span className="meta">{String(i + 1).padStart(2, "0")}</span></H>
        <p>{c.body}</p>
        <div className="case-icons">
          {c.icons.map((n) => (
            <Link key={n} href={`/icons/?icon=${n}`} prefetch={false}><Glyph name={n} size={15} />{n}</Link>
          ))}
        </div>
      </div>
    </article>
  );
}
