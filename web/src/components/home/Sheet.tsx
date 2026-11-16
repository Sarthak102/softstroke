import { ArrowRightIcon } from "@softstroke/react";
import { Glyph, NAMES } from "@/lib/glyph";
import { IconsLink } from "../IconsLink";
import { Words } from "../Words";

// 02: a slice of the glyph table; the full sheet lives on /icons.
export function Sheet() {
  const slice = NAMES.filter((_, i) => i % 9 === 1).slice(0, 42);
  return (
    <section className="section wrap" style={{ paddingTop: 48 }}>
      <div className="set-head" data-reveal>
        <div>
          <p className="eyebrow"><b>02</b> The set</p>
          <h2 className="display h2" data-split><Words>Every icon, on one sheet</Words></h2>
          <p className="lede">Search by name or by what it means, copy JSX, an import or raw SVG, or download it.</p>
        </div>
        <IconsLink href="/icons/" className="btn btn-ghost">Open the sheet <ArrowRightIcon size={18} /></IconsLink>
      </div>
      <div className="glyphs glyphs-teaser" data-reveal>
        {slice.map((n) => (
          <IconsLink key={n} href={`/icons/?icon=${n}`} className="glyph" title={n} aria-label={n}>
            <Glyph name={n} />
          </IconsLink>
        ))}
      </div>
    </section>
  );
}
