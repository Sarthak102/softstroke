// icons/*.svg (stroke) + icons-solid/*.svg (solid twins) -> SVGO -> shape list ->
// packages/{react,react-native,vue,svelte,svg}/dist + packages/angular/{src,solid} (compiled by ng-packagr, see package.json)
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
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

const kebab = (k) => k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
const kebabNodes = (nodes) => nodes.map(([t, a]) => [t, Object.fromEntries(Object.entries(a).map(([k, v]) => [kebab(k), v]))]);

writePackage('packages/vue', `import { defineComponent, h } from 'vue';

export function createIcon(name, nodes, solid = false) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      size: { type: [Number, String], default: 24 },
      color: { type: String, default: 'currentColor' },
      strokeWidth: { type: [Number, String], default: 1.5 },
    },
    setup(props, { attrs, slots }) {
      return () => h('svg', {
        xmlns: 'http://www.w3.org/2000/svg', width: props.size, height: props.size, viewBox: '0 0 24 24',
        // Solid icons are pure fills: strokeWidth has nothing to act on.
        ...(solid ? { fill: props.color } : { fill: 'none', stroke: props.color, 'stroke-width': props.strokeWidth, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
        // Decorative by default; passing aria-label makes it meaningful.
        'aria-hidden': attrs['aria-label'] || attrs['aria-labelledby'] ? undefined : 'true',
        ...attrs,
      }, [...nodes.map(([tag, a]) => h(tag, a)), slots.default?.()]);
    },
  });
}
`, `import type { DefineComponent } from 'vue';
export interface IconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
}
export type Icon = DefineComponent<IconProps>;
export declare function createIcon(name: string, nodes: [string, Record<string, string>][], solid?: boolean): Icon;
`);
// Vue sets SVG attributes as written, so its shape lists use the kebab-case names.
for (const [dir, list, up, solid] of [['packages/vue/dist', icons, './', false], ['packages/vue/dist/solid', solidIcons, '../', true]]) {
  for (const { name, component, nodes } of list) {
    writeFileSync(`${dir}/icons/${name}.js`, `import { createIcon } from '${up}../create-icon.js';\nexport default createIcon('${component}', ${JSON.stringify(kebabNodes(nodes))}${solid ? ', true' : ''});\n`);
  }
}

// Svelte 5: one shared Icon.svelte, a thin .svelte file per icon, a typed barrel.
rmSync('packages/svelte/dist', { recursive: true, force: true });
mkdirSync('packages/svelte/dist', { recursive: true });
writeFileSync('packages/svelte/dist/Icon.svelte', `<script>
  let { nodes, solid = false, size = 24, color = 'currentColor', strokeWidth = 1.5, children, ...rest } = $props();
  // Solid icons are pure fills: strokeWidth has nothing to act on.
  const paint = $derived(solid ? { fill: color } : { fill: 'none', stroke: color, 'stroke-width': strokeWidth, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...paint} aria-hidden={rest['aria-label'] || rest['aria-labelledby'] ? undefined : 'true'} {...rest}>
  {#each nodes as [tag, attrs]}<svelte:element this={tag} {...attrs} />{/each}
  {@render children?.()}
</svg>
`);
const svelteTypes = `import type { Component, Snippet } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';
export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'color'> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  children?: Snippet;
}
export type Icon = Component<IconProps>;
`;
writeFileSync('packages/svelte/dist/types.d.ts', svelteTypes);
for (const [dir, list, up, solid] of [['packages/svelte/dist', icons, '', false], ['packages/svelte/dist/solid', solidIcons, '../', true]]) {
  mkdirSync(`${dir}/icons`, { recursive: true });
  for (const { name, component, nodes } of list) {
    writeFileSync(`${dir}/icons/${name}.svelte`, `<script>\n  import Icon from '${up}../Icon.svelte';\n  let props = $props();\n</script>\n\n<Icon nodes={${JSON.stringify(kebabNodes(nodes))}}${solid ? ' solid' : ''} {...props} />\n`);
    writeFileSync(`${dir}/icons/${name}.svelte.d.ts`, `import type { Icon } from '${up}../types.js';\ndeclare const ${component}: Icon;\nexport default ${component};\n`);
  }
  const exp = list.map(({ name, component }) => `export { default as ${component} } from './icons/${name}.svelte';`).join('\n');
  writeFileSync(`${dir}/index.js`, `${exp}\n`);
  writeFileSync(`${dir}/index.d.ts`, `export type { Icon, IconProps } from '${up}types.js';\n${exp}\n`);
}

// Angular: TypeScript sources for ng-packagr (partial compilation). One standalone component per icon,
// selector ss-<name> (solid: ss-<name>-solid, from the @softstroke/angular/solid entry point).
rmSync('packages/angular/src', { recursive: true, force: true });
rmSync('packages/angular/solid', { recursive: true, force: true });
mkdirSync('packages/angular/src', { recursive: true });
mkdirSync('packages/angular/solid', { recursive: true });
writeFileSync('packages/angular/src/icon.ts', `import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, inject } from '@angular/core';

export type IconNode = [string, Record<string, string>];

/** Shared base: draws the icon's <svg> into the host element and keeps it in sync with the inputs. */
@Directive({ host: { style: 'display: inline-flex' } })
export abstract class SoftstrokeIcon implements OnInit, OnChanges {
  @Input() size: number | string = 24;
  @Input() color = 'currentColor';
  @Input() strokeWidth: number | string = 1.5;

  protected abstract readonly nodes: IconNode[];
  protected readonly solid: boolean = false;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private svg?: SVGElement;

  ngOnInit(): void {
    const r = this.renderer;
    this.svg = r.createElement('svg', 'svg') as SVGElement;
    r.setAttribute(this.svg, 'viewBox', '0 0 24 24');
    // Decorative by default; an aria-label on the host makes the host an image instead.
    r.setAttribute(this.svg, 'aria-hidden', 'true');
    if (this.host.nativeElement.getAttribute('aria-label')) r.setAttribute(this.host.nativeElement, 'role', 'img');
    for (const [tag, attrs] of this.nodes) {
      const el = r.createElement(tag, 'svg');
      for (const [k, v] of Object.entries(attrs)) r.setAttribute(el, k, v);
      r.appendChild(this.svg, el);
    }
    this.paint();
    r.appendChild(this.host.nativeElement, this.svg);
  }

  ngOnChanges(): void {
    this.paint();
  }

  private paint(): void {
    if (!this.svg) return;
    const set = (k: string, v: string | number) => this.renderer.setAttribute(this.svg, k, String(v));
    set('width', this.size);
    set('height', this.size);
    if (this.solid) {
      // Solid icons are pure fills: strokeWidth has nothing to act on.
      set('fill', this.color);
    } else {
      set('fill', 'none');
      set('stroke', this.color);
      set('stroke-width', this.strokeWidth);
      set('stroke-linecap', 'round');
      set('stroke-linejoin', 'round');
    }
  }
}
`);
const ngSet = (list, solid, from) => `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SoftstrokeIcon } from '${from}';
${list.map(({ name, component, nodes }) => `
@Component({ selector: 'ss-${name}${solid ? '-solid' : ''}', standalone: true, template: '', changeDetection: ChangeDetectionStrategy.OnPush })
export class ${component} extends SoftstrokeIcon {
  protected readonly nodes = ${JSON.stringify(kebabNodes(nodes))} as [string, Record<string, string>][];${solid ? '\n  protected override readonly solid = true;' : ''}
}`).join('\n')}
`;
writeFileSync('packages/angular/src/icons.ts', ngSet(icons, false, './icon'));
writeFileSync('packages/angular/src/public-api.ts', `export { SoftstrokeIcon } from './icon';\nexport type { IconNode } from './icon';\nexport * from './icons';\n`);
writeFileSync('packages/angular/solid/icons.ts', ngSet(solidIcons, true, '@softstroke/angular'));
writeFileSync('packages/angular/solid/public-api.ts', `export * from './icons';\n`);
writeFileSync('packages/angular/solid/ng-package.json', JSON.stringify({ lib: { entryFile: 'public-api.ts' } }) + '\n');

// Icon font: font/ is generated by scripts/font.py (Python, committed) so this build stays Node-only.
// A font built from older sources is an error, not a silent mismatch.
const fontHash = createHash('sha256').update(Buffer.concat(['icons', 'icons-solid'].flatMap((d) =>
  icons.map(({ name }) => name).sort().map((name) => readFileSync(`${d}/${name}.svg`))))).digest('hex');  // same order as font.py
if (readFileSync('font/source.sha256', 'utf8').trim() !== fontHash) throw new Error('font/ is out of date with the icons: run .venv/bin/python scripts/font.py');
const codes = JSON.parse(readFileSync('font/codepoints.json', 'utf8'));
rmSync('packages/font/dist', { recursive: true, force: true });
mkdirSync('packages/font/dist', { recursive: true });
for (const f of ['softstroke.woff2', 'softstroke-solid.woff2']) copyFileSync(`font/${f}`, `packages/font/dist/${f}`);
writeFileSync('packages/font/dist/softstroke.css', `/* Softstroke icon font. <i class="ss ss-home"></i> (stroke), <i class="ss-solid ss-home"></i> (solid). MIT */
@font-face { font-family: "Softstroke"; src: url("softstroke.woff2") format("woff2"); font-display: block; }
@font-face { font-family: "Softstroke Solid"; src: url("softstroke-solid.woff2") format("woff2"); font-display: block; }
.ss, .ss-solid { display: inline-block; font-style: normal; font-weight: normal; font-variant: normal; line-height: 1; text-transform: none; vertical-align: -0.125em; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
.ss { font-family: "Softstroke"; }
.ss-solid { font-family: "Softstroke Solid"; }
${icons.map(({ name }) => `.ss-${name}::before { content: "\\${codes[name].toString(16)}"; }`).join('\n')}
`);
writeFileSync('packages/font/dist/codepoints.json', JSON.stringify(Object.fromEntries(icons.map(({ name }) => [name, codes[name]]))) + '\n');

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
// Every icon also needs a category (icon browser filters); same rules as keywords.
const categories = JSON.parse(readFileSync('categories.json', 'utf8'));
const noCat = [...names].filter((n) => !categories[n]);
const staleCat = Object.keys(categories).filter((n) => !names.has(n));
if (noCat.length || staleCat.length) throw new Error(`categories.json: missing [${noCat}] stale [${staleCat}]`);
writeFileSync('packages/svg/dist/categories.json', JSON.stringify(categories) + '\n');
writeFileSync('packages/svg/dist/icons.json', JSON.stringify(Object.fromEntries(icons.map(({ name, nodes }) => [name, nodes])), null, 1) + '\n');

for (const p of ['react', 'react-native', 'vue', 'svelte', 'angular', 'svg', 'font']) for (const f of ['README.md', 'LICENSE']) copyFileSync(f, `packages/${p}/${f}`);

console.log(`built ${icons.length} stroke + ${solidIcons.length} solid icons -> react, react-native, vue, svelte, angular (sources), svg, font`);
