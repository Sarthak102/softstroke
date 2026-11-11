import type { Icon, IconProps } from "@softstroke/react";

// Name-based icon helpers over an explicit set of imported icons. Unlike lib/icons (the whole set, for server
// components), this keeps client bundles to the icons a file actually imports.
export function iconSet<K extends string>(stroke: Record<K, Icon>, solid: Partial<Record<K, Icon>> = {}) {
  function StrokeIcon({ name, ...props }: { name: K } & IconProps) {
    const C = stroke[name];
    return <C {...props} />;
  }
  // Stroke and solid stacked in one cell; `active` crossfades to solid with a small spring.
  function DualIcon({ name, active, size = 22, className = "" }: { name: K; active: boolean; size?: number; className?: string }) {
    const S = stroke[name];
    const F = solid[name] ?? S;
    const base = "col-start-1 row-start-1 transition-[opacity,scale] duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]";
    return (
      <span className={`inline-grid ${className}`}>
        <S size={size} className={`${base} ${active ? "scale-75 opacity-0" : "scale-100 opacity-100"}`} />
        <F size={size} className={`${base} ${active ? "scale-100 opacity-100" : "scale-75 opacity-0"}`} />
      </span>
    );
  }
  return { StrokeIcon, DualIcon };
}
