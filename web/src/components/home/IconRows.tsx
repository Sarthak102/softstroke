import { GlyphPair, NAMES } from "@/lib/glyph";

// Two rows of the set drifting in opposite directions; hovering a cell turns it solid.
export function IconRows() {
  const row = (offset: number) => NAMES.filter((_, i) => i % 6 === offset).slice(0, 36);
  const cells = (list: string[], dup: boolean) =>
    list.map((n) => (
      <span key={`${n}${dup ? "-2" : ""}`} className="ic-cell" title={dup ? undefined : n}>
        <GlyphPair name={n} size={26} />
      </span>
    ));
  return (
    <div className="icon-rows" aria-hidden>
      {[0, 3].map((o, k) => (
        <div key={o} className={`marquee ${k ? "rev" : ""}`} style={{ "--dur": k ? "80s" : "70s" } as React.CSSProperties}>
          <div className="marquee-track">{cells(row(o), false)}{cells(row(o), true)}</div>
        </div>
      ))}
    </div>
  );
}
