// How each package names and uses an icon (same rules as scripts/build.mjs), for "copy for my framework".
export const FRAMEWORKS = ["React", "React Native", "Vue", "Svelte", "Angular", "Flutter"] as const;
export type Framework = (typeof FRAMEWORKS)[number];

const pascal = (n: string) => `${n.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase())}Icon`;
const camel = (n: string) => n.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
const PKG: Record<Exclude<Framework, "Flutter">, string> = { React: "react", "React Native": "react-native", Vue: "vue", Svelte: "svelte", Angular: "angular" };

export function snippet(name: string, fw: Framework, solid: boolean) {
  if (fw === "Flutter") {
    const id = `SoftstrokeIcons.${camel(name)}${solid ? "Solid" : ""}`;
    return { imp: "import 'package:softstroke/softstroke.dart';", use: `Icon(${id})` };
  }
  const C = pascal(name);
  const imp = `import { ${C} } from "@softstroke/${PKG[fw]}${solid ? "/solid" : ""}";`;
  if (fw === "Angular") return { imp, use: `<ss-${name}${solid ? "-solid" : ""} [size]="24" />` };
  if (fw === "Vue") return { imp, use: `<${C} :size="24" />` };
  return { imp, use: `<${C} size={24} />` };
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
