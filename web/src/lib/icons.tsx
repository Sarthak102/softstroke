import * as Stroke from "@softstroke/react";
import * as Solid from "@softstroke/react/solid";

export type IconName = keyof typeof Stroke;

export function StrokeIcon({ name, ...props }: { name: IconName } & Stroke.IconProps) {
  const C = Stroke[name];
  return <C {...props} />;
}

// Stroke and solid stacked in one cell; `active` crossfades to solid with a small spring.
export function DualIcon({
  name,
  active,
  size = 22,
  className = "",
}: {
  name: IconName;
  active: boolean;
  size?: number;
  className?: string;
}) {
  const S = Stroke[name];
  const F = Solid[name];
  const base = "col-start-1 row-start-1 transition-[opacity,scale] duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]";
  return (
    <span className={`inline-grid ${className}`}>
      <S size={size} className={`${base} ${active ? "scale-75 opacity-0" : "scale-100 opacity-100"}`} />
      <F size={size} className={`${base} ${active ? "scale-100 opacity-100" : "scale-75 opacity-0"}`} />
    </span>
  );
}
