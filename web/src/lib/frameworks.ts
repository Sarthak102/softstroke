// How each package names and uses an icon (same rules as scripts/build.mjs), for "copy for my framework".
export const FRAMEWORKS = ["React", "React Native", "Vue", "Svelte", "Angular", "Flutter"] as const;
export type Framework = (typeof FRAMEWORKS)[number];

const pascal = (n: string) => `${n.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase())}Icon`;
const camel = (n: string) => n.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
const PKG: Record<Exclude<Framework, "Flutter">, string> = { React: "react", "React Native": "react-native", Vue: "vue", Svelte: "svelte", Angular: "angular" };

export type Props = { size?: number; strokeWidth?: number; color?: string };

// Defaults (stroke 1.5, currentColor) are left out of the code; size is always shown.
export function snippet(name: string, fw: Framework, solid: boolean, p: Props = {}) {
  const size = p.size ?? 24;
  const sw = !solid && p.strokeWidth !== undefined && p.strokeWidth !== 1.5 ? p.strokeWidth : undefined;
  const color = p.color && p.color !== "currentColor" ? p.color : undefined;
  if (fw === "Flutter") {
    const id = `SoftstrokeIcons.${camel(name)}${solid ? "Solid" : ""}`;
    // CSS #rrggbbaa -> Flutter 0xAARRGGBB.
    const argb = color && `${color.length === 9 ? color.slice(7) : "ff"}${color.slice(1, 7)}`.toUpperCase();
    const args = [id, `size: ${size}`, ...(argb ? [`color: Color(0x${argb})`] : [])];
    // The Flutter package is an icon font: the stroke width is fixed at 1.5.
    return { imp: "import 'package:softstroke/softstroke.dart';", use: `Icon(${args.join(", ")})` };
  }
  const C = pascal(name);
  const imp = `import { ${C} } from "@softstroke/${PKG[fw]}${solid ? "/solid" : ""}";`;
  const c = color ? ` color="${color}"` : "";
  if (fw === "Angular") return { imp, use: `<ss-${name}${solid ? "-solid" : ""} [size]="${size}"${sw ? ` [strokeWidth]="${sw}"` : ""}${c} />` };
  if (fw === "Vue") return { imp, use: `<${C} :size="${size}"${sw ? ` :stroke-width="${sw}"` : ""}${c} />` };
  return { imp, use: `<${C} size={${size}}${sw ? ` strokeWidth={${sw}}` : ""}${c} />` };
}

const KEY = "ss-framework";
export function savedFramework(): Framework {
  try {
    const v = localStorage.getItem(KEY);
    if (v && (FRAMEWORKS as readonly string[]).includes(v)) return v as Framework;
  } catch {}
  return "React";
}
export function saveFramework(fw: Framework) {
  try { localStorage.setItem(KEY, fw); } catch {}
}
