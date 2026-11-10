// icons/*.svg (stroke) + icons-solid/*.svg (solid twins) -> SVGO -> shape list -> packages/{react,react-native,svg}/dist
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync } from 'node:fs';
import { optimize } from 'svgo';

const TAGS = { path: 'Path', circle: 'Circle', rect: 'Rect', line: 'Line', polyline: 'Polyline', polygon: 'Polygon', ellipse: 'Ellipse' };
const ROOT = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
const ROOT_FILLED = 'viewBox="0 0 24 24" fill="currentColor"';

const pascal = (s) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

function parse(name, src, solid) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) throw new Error(`${name}: file name must be kebab-case`);
  if (!src.includes('viewBox="0 0 24 24"')) throw new Error(`${name}: viewBox must be 0 0 24 24`);
  const { data } = optimize(src, {
    multipass: true,
    plugins: [{ name: 'preset-default', params: { overrides: { convertShapeToPath: false, mergePaths: false } } }],
  });
  const body = data.replace(/^<svg[^>]*>|<\/svg>$/g, '');
  const nodes = [];
  // Every child must be a flat, self-closing shape with no colors or styles of its own.
  const rest = body.replace(/<(\w+)((?:\s+[\w-]+="[^"]*")*)\s*\/>/g, (_, tag, attrs) => {
    if (!TAGS[tag]) throw new Error(`${name}: unsupported element <${tag}>`);
    const a = {};
    for (const [, k, v] of attrs.matchAll(/([\w-]+)="([^"]*)"/g)) {
      // Solid icons may cut details out of a silhouette with fill-rule/clip-rule; nothing else is per-shape.
      if (/^(fill|stroke|style|class|id|transform)/.test(k) && !(solid && /^(fill|clip)-rule$/.test(k))) throw new Error(`${name}: <${tag}> must not set ${k}`);
      a[camel(k)] = v;
    }
    // A stroked circle smaller than half the stroke renders with a hole in Chrome; glyph dots use "M x y h.01".
    if (!solid && tag === 'circle' && Number(a.r) < 0.75) throw new Error(`${name}: circle r=${a.r} < 0.75 renders hollow; use a path "h.01" dot`);
    nodes.push([tag, a]);
    return '';
  });
  if (rest.trim()) throw new Error(`${name}: unexpected content: ${rest.slice(0, 60)}`);
  if (!nodes.length) throw new Error(`${name}: no shapes`);
  return nodes;
}

const load = (dir, solid) => readdirSync(dir).filter((f) => f.endsWith('.svg')).sort().map((f) => {
  const name = f.slice(0, -4);
  return { name, component: `${pascal(name)}Icon`, nodes: parse(name, readFileSync(`${dir}/${f}`, 'utf8'), solid) };
});
const icons = load('icons', false);
const solidIcons = load('icons-solid', true);
// A solid icon is always the twin of a stroke icon: same name, same export.
const orphans = solidIcons.filter((i) => !icons.some((s) => s.name === i.name)).map((i) => i.name);
if (orphans.length) throw new Error(`icons-solid: no stroke twin for [${orphans}]`);

const toSvg = (nodes) => nodes.map(([t, a]) =>
  `<${t} ${Object.entries(a).map(([k, v]) => `${k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}="${v}"`).join(' ')}/>`).join('');

// One icon set (stroke at dist/, solid at dist/solid/) sharing dist/create-icon.js.
function writeSet(out, list, up, solid) {
  mkdirSync(`${out}/icons`, { recursive: true });
  for (const { name, component, nodes } of list) {
    writeFileSync(`${out}/icons/${name}.js`,
      `import { createIcon } from '${up}../create-icon.js';\nexport default createIcon('${component}', ${JSON.stringify(nodes)}${solid ? ', true' : ''});\n`);
    writeFileSync(`${out}/icons/${name}.d.ts`, `import type { Icon } from '${up}../create-icon.js';\ndeclare const ${component}: Icon;\nexport default ${component};\n`);
  }
  const exp = list.map(({ name, component }) => `export { default as ${component} } from './icons/${name}.js';`).join('\n');
  writeFileSync(`${out}/index.js`, `${exp}\n`);
  writeFileSync(`${out}/index.d.ts`, `export type { Icon, IconProps } from '${up}create-icon.js';\n${exp}\n`);
}

function writePackage(dir, base, types) {
  rmSync(`${dir}/dist`, { recursive: true, force: true });
  mkdirSync(`${dir}/dist`, { recursive: true });
  writeFileSync(`${dir}/dist/create-icon.js`, base);
  writeFileSync(`${dir}/dist/create-icon.d.ts`, types);
  writeSet(`${dir}/dist`, icons, './', false);
  writeSet(`${dir}/dist/solid`, solidIcons, '../', true);
}

writePackage('packages/react', `import { createElement, forwardRef } from 'react';

export function createIcon(displayName, nodes, solid = false) {
  const Icon = forwardRef(({ size = 24, color = 'currentColor', strokeWidth = 1.5, children, ...rest }, ref) =>
    createElement('svg', {
      ref, xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24',
      // Solid icons are pure fills: strokeWidth has nothing to act on.
      ...(solid ? { fill: color } : { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      // Decorative by default; passing aria-label (or title as a child) makes it meaningful.
      'aria-hidden': rest['aria-label'] || rest['aria-labelledby'] ? undefined : true,
      ...rest,
    }, ...nodes.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs })), children));
  Icon.displayName = displayName;
  return Icon;
}
`, `import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
}
export type Icon = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
export declare function createIcon(displayName: string, nodes: [string, Record<string, string>][], solid?: boolean): Icon;
`);

writePackage('packages/react-native', `import { createElement, forwardRef } from 'react';
import Svg, { ${[...new Set(Object.values(TAGS))].join(', ')} } from 'react-native-svg';

const TAGS = ${JSON.stringify(TAGS)};
const MAP = { ${[...new Set(Object.values(TAGS))].map((c) => `${c}`).join(', ')} };

export function createIcon(displayName, nodes, solid = false) {
  const Icon = forwardRef(({ size = 24, color = '#000', strokeWidth = 1.5, children, ...rest }, ref) =>
    createElement(Svg, {
      ref, width: size, height: size, viewBox: '0 0 24 24',
      ...(solid ? { fill: color } : { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      ...rest,
    }, ...nodes.map(([tag, attrs], i) => createElement(MAP[TAGS[tag]], { key: i, ...attrs })), children));
  Icon.displayName = displayName;
  return Icon;
}
`, `import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { SvgProps } from 'react-native-svg';
export interface IconProps extends SvgProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
}
export type Icon = ForwardRefExoticComponent<IconProps & RefAttributes<unknown>>;
export declare function createIcon(displayName: string, nodes: [string, Record<string, string>][], solid?: boolean): Icon;
`);

// Plain SVGs (optimized, with the shared root attributes) + one sprite for <use href="sprite.svg#name">.
rmSync('packages/svg/dist', { recursive: true, force: true });
mkdirSync('packages/svg/dist/icons', { recursive: true });
for (const { name, nodes } of icons) {
  writeFileSync(`packages/svg/dist/icons/${name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ${ROOT}>${toSvg(nodes)}</svg>\n`);
}
writeFileSync('packages/svg/dist/sprite.svg', `<svg xmlns="http://www.w3.org/2000/svg">${icons.map(({ name, nodes }) =>
  `<symbol id="${name}" ${ROOT}>${toSvg(nodes)}</symbol>`).join('')}</svg>\n`);
mkdirSync('packages/svg/dist/solid/icons', { recursive: true });
for (const { name, nodes } of solidIcons) {
  writeFileSync(`packages/svg/dist/solid/icons/${name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ${ROOT_FILLED}>${toSvg(nodes)}</svg>\n`);
}
writeFileSync('packages/svg/dist/solid-sprite.svg', `<svg xmlns="http://www.w3.org/2000/svg">${solidIcons.map(({ name, nodes }) =>
  `<symbol id="${name}" ${ROOT_FILLED}>${toSvg(nodes)}</symbol>`).join('')}</svg>\n`);
writeFileSync('packages/svg/dist/icons-solid.json', JSON.stringify(Object.fromEntries(solidIcons.map(({ name, nodes }) => [name, nodes])), null, 1) + '\n');
// Every icon needs search keywords (used by the docs site); stale entries are errors too.
const keywords = JSON.parse(readFileSync('keywords.json', 'utf8'));
const names = new Set(icons.map((i) => i.name));
const missing = [...names].filter((n) => !keywords[n]?.length);
const stale = Object.keys(keywords).filter((n) => !names.has(n));
if (missing.length || stale.length) throw new Error(`keywords.json: missing [${missing}] stale [${stale}]`);
writeFileSync('packages/svg/dist/keywords.json', JSON.stringify(keywords) + '\n');
writeFileSync('packages/svg/dist/icons.json', JSON.stringify(Object.fromEntries(icons.map(({ name, nodes }) => [name, nodes])), null, 1) + '\n');

for (const p of ['react', 'react-native', 'svg']) for (const f of ['README.md', 'LICENSE']) copyFileSync(f, `packages/${p}/${f}`);

console.log(`built ${icons.length} stroke + ${solidIcons.length} solid icons -> react, react-native, svg`);
