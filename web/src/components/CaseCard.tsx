import Link from "next/link";
import { Glyph } from "@/lib/glyph";
import type { UseCase } from "./UseCaseScenes";

// One use case: the scene in a 3:2 card, its caption, and chips for the icons it uses.
export function CaseCard({ c, i }: { c: UseCase; i: number }) {
  return (
    <article className="case">
      <div className="case-img" role="img" aria-label={`${c.title} built with Softstroke icons`}>
        <c.Scene />
      </div>
      <div className="case-cap">
        <h3>{c.title}<span className="meta">{String(i + 1).padStart(2, "0")}</span></h3>
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
