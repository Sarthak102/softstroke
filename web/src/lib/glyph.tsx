import strokeNodes from "@softstroke/svg/icons.json";
import solidNodes from "@softstroke/svg/icons-solid.json";

// Server-side icon drawing from the svg package's shape lists. Keeps whole-set pages (rows, sheets)
// out of client bundles: only the rendered SVG reaches the browser.
export type Nodes = [string, Record<string, string>][];
export const NAMES = Object.keys(strokeNodes).sort();
export const nodes = (name: string, solid = false) =>
  ((solid ? solidNodes : strokeNodes) as unknown as Record<string, Nodes>)[name] ?? [];

export function Glyph({ name, solid = false, size = 24, className }: { name: string; solid?: boolean; size?: number; className?: string }) {
  const paint = solid
    ? { fill: "currentColor" }
    : { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className={className} {...paint}>
      {nodes(name, solid).map(([Tag, attrs], i) => {
        const T = Tag as "path";
        return <T key={i} {...attrs} />;
      })}
    </svg>
  );
}

// Stroke and solid stacked (classes s/f), for hover and state swaps done in CSS.
export function GlyphPair({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <>
      <Glyph name={name} size={size} className="s" />
      <Glyph name={name} size={size} solid className="f" />
    </>
  );
}
