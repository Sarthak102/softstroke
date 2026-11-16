import Link from "next/link";
import { BASE } from "@/lib/site";
import { Glyph } from "@/lib/glyph";
import type { UseCase } from "./use-cases";

// One use case: the captured scene, its caption, and chips for the icons it uses.
export function CaseCard({ c, i, eager }: { c: UseCase; i: number; eager?: boolean }) {
  return (
    <article className="case">
      <div className="case-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BASE}/use-cases/${c.id}-1200.webp`}
          srcSet={`${BASE}/use-cases/${c.id}-1200.webp 1200w, ${BASE}/use-cases/${c.id}.webp 2400w`}
          sizes="(min-width: 900px) 600px, 84vw"
          alt={`${c.title} built with Softstroke icons`}
          width={1200}
          height={800}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
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
