"use client";

import { useEffect, useState } from "react";
import strokeNodes from "@softstroke/svg/icons.json";

// Icons drawn from their shape lists (the svg package's JSON), for client pages that need any icon by name
// (/icons, /playground) without loading 800 components.
export type Nodes = [string, Record<string, string>][];
export type Style = "stroke" | "solid";

const STROKE = strokeNodes as unknown as Record<string, Nodes>;
export const NAMES = Object.keys(STROKE).sort();

// Solid shapes (590 KB) load on demand. `SOLID` is a live binding: null until loaded.
export let SOLID: Record<string, Nodes> | null = null;
let solidLoad: Promise<void> | null = null;
export const loadSolid = () =>
  (solidLoad ??= import("@softstroke/svg/icons-solid.json").then((m) => { SOLID = m.default as unknown as Record<string, Nodes>; }));
export function useSolid(need: boolean) {
  const [, rerender] = useState(0);
  useEffect(() => {
    if (need && !SOLID) loadSolid().then(() => rerender((x) => x + 1)).catch(() => {});
  }, [need]);
  return SOLID;
}

export function toSvg(name: string, style: Style, size = 24, strokeWidth = 1.5, color = "currentColor") {
  const nodes = ((style === "solid" && SOLID) || STROKE)[name];
  const head =
    style === "solid"
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">`;
  const body = nodes.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(" ")}/>`).join("");
  return `${head}${body}</svg>`;
}

type GlyphProps = { name: string; solid: boolean; size: number | string; strokeWidth?: number; color?: string; className?: string; style?: React.CSSProperties };

// Same output as the packages' components: size, color and strokeWidth act the same way.
export function Glyph({ name, solid, size, strokeWidth = 1.5, color = "currentColor", className = "", style }: GlyphProps) {
  // Until the solid shapes arrive, solid draws the stroke shape.
  if (solid && !SOLID) solid = false;
  const nodes = ((solid && SOLID) || STROKE)[name];
  const paint = solid ? { fill: color } : { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className={className} style={style} {...paint}>
      {nodes.map(([Tag, attrs], i) => {
        const T = Tag as "path";
        return <T key={i} {...attrs} />;
      })}
    </svg>
  );
}

// Hands the visitor a file (download attribute on a temporary link).
export function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
