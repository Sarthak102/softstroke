// Smoke check of the built React package: every icon renders, props apply, a11y defaults hold.
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import * as Icons from '../packages/react/dist/index.js';
import HomeDeep from '../packages/react/dist/icons/home.js';
import * as Solid from '../packages/react/dist/solid/index.js';

const names = readdirSync('icons').filter((f) => f.endsWith('.svg'));
assert.equal(Object.keys(Icons).length, names.length, 'one export per source icon');

for (const [name, Icon] of Object.entries(Icons)) {
  const html = render(h(Icon));
  assert.match(html, /^<svg [^>]*width="24" height="24" viewBox="0 0 24 24"/, name);
  assert.match(html, /aria-hidden="true"/, `${name} decorative by default`);
  assert.match(html, /<(path|circle|rect|line|polyline|polygon|ellipse) /, `${name} has shapes`);
}

const html = render(h(Icons.HomeIcon, { size: 32, color: 'red', strokeWidth: 2, 'aria-label': 'Home', className: 'x' }));
assert.match(html, /width="32" height="32"/);
assert.match(html, /stroke="red"/);
assert.match(html, /stroke-width="2"/);
assert.match(html, /class="x"/);
assert.doesNotMatch(html, /aria-hidden/, 'labelled icon is not hidden');
assert.equal(HomeDeep, Icons.HomeIcon, 'deep import is the same component');

const solidNames = readdirSync('icons-solid').filter((f) => f.endsWith('.svg'));
assert.equal(Object.keys(Solid).length, solidNames.length, 'one solid export per solid source');
for (const [name, Icon] of Object.entries(Solid)) {
  const html = render(h(Icon, { color: 'red', strokeWidth: 3 }));
  assert.match(html, /^<svg [^>]*fill="red"/, `${name} solid with color`);
  assert.doesNotMatch(html, /stroke/, `${name} has no stroke`);
  assert.notEqual(Icon, Icons[name], `${name} solid differs from stroke`);
}

console.log(`ok: ${names.length} stroke icons, solid twins ${solidNames.length}/${names.length}`);

// ---- Vue: server-render every icon ----------------------------------------------------------------
{
  const { createSSRApp, h: vh } = await import('vue');
  const { renderToString } = await import('vue/server-renderer');
  const Vue = await import('../packages/vue/dist/index.js');
  const VueSolid = await import('../packages/vue/dist/solid/index.js');
  const vr = (C, props = {}) => renderToString(createSSRApp({ render: () => vh(C, props) }));
  assert.equal(Object.keys(Vue).length, names.length, 'vue: one export per icon');
  for (const [name, C] of Object.entries(Vue)) assert.match(await vr(C), /^<svg [^>]*width="24"[^>]*aria-hidden="true"[^>]*><(path|circle) /, `vue ${name}`);
  const v = await vr(Vue.HomeIcon, { size: 32, color: 'red', strokeWidth: 2, 'aria-label': 'Home', class: 'x' });
  for (const re of [/width="32"/, /stroke="red"/, /stroke-width="2"/, /class="x"/]) assert.match(v, re, `vue props ${re}`);
  assert.doesNotMatch(v, /aria-hidden/, 'vue: labelled icon is not hidden');
  for (const [name, C] of Object.entries(VueSolid)) {
    const s = await vr(C, { color: 'red' });
    assert.match(s, /fill="red"/, `vue solid ${name}`);
    assert.doesNotMatch(s, /stroke/, `vue solid ${name} has no stroke`);
  }
  assert.match(await vr(VueSolid.WalletIcon), /fill-rule="evenodd"/, 'vue: kebab-case shape attributes');
}

// ---- Svelte 5: compile for the server, render every icon ------------------------------------------
{
  const { compile } = await import('svelte/compiler');
  const { render: sr } = await import('svelte/server');
  const { mkdirSync, writeFileSync, rmSync, readFileSync } = await import('node:fs');
  const { join, dirname } = await import('node:path');
  // Compiled inside node_modules so the compiled code resolves 'svelte/internal/server'.
  const out = 'node_modules/.cache/softstroke-svelte-check';
  rmSync(out, { recursive: true, force: true });
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
  for (const f of walk('packages/svelte/dist')) {
    const rel = f.slice('packages/svelte/dist/'.length);
    const dest = join(out, rel.replace(/\.svelte$/, '.svelte.js'));
    mkdirSync(dirname(dest), { recursive: true });
    if (f.endsWith('.svelte')) writeFileSync(dest, compile(readFileSync(f, 'utf8'), { generate: 'server', filename: f }).js.code.replace(/(from '[^']+)\.svelte'/g, "$1.svelte.js'"));
    else if (f.endsWith('.js')) writeFileSync(dest, readFileSync(f, 'utf8').replace(/\.svelte'/g, ".svelte.js'"));
  }
  const S = await import(`../${out}/index.js`);
  const SS = await import(`../${out}/solid/index.js`);
  const body = (C, props = {}) => sr(C, { props }).body;
  assert.equal(Object.keys(S).length, names.length, 'svelte: one export per icon');
  for (const [name, C] of Object.entries(S)) assert.match(body(C), /<svg [^>]*width="24"[^>]*aria-hidden="true"[^>]*>.*<(path|circle) /s, `svelte ${name}`);
  const sv = body(S.HomeIcon, { size: 32, color: 'red', strokeWidth: 2, 'aria-label': 'Home', class: 'x' });
  for (const re of [/width="32"/, /stroke="red"/, /stroke-width="2"/, /class="x"/]) assert.match(sv, re, `svelte props ${re}`);
  assert.doesNotMatch(sv, /aria-hidden/, 'svelte: labelled icon is not hidden');
  for (const [name, C] of Object.entries(SS)) {
    const s = body(C, { color: 'red' });
    assert.match(s, /fill="red"/, `svelte solid ${name}`);
    assert.doesNotMatch(s, /stroke/, `svelte solid ${name} has no stroke`);
  }
  rmSync(out, { recursive: true, force: true });
}

// ---- Angular: render every icon through @angular/platform-server ---------------------------------
{
  const { existsSync, symlinkSync, mkdirSync } = await import('node:fs');
  const { resolve } = await import('node:path');
  // The solid entry point imports '@softstroke/angular' by name: point it at the built package.
  mkdirSync('node_modules/@softstroke', { recursive: true });
  if (!existsSync('node_modules/@softstroke/angular')) symlinkSync(resolve('packages/angular/dist'), 'node_modules/@softstroke/angular', 'dir');
  await import('@angular/compiler');                 // JIT linker for the partially compiled package
  await import('@angular/platform-server/init');
  const { Component, provideZonelessChangeDetection } = await import('@angular/core');
  const { bootstrapApplication } = await import('@angular/platform-browser');
  const { renderApplication } = await import('@angular/platform-server');
  const NG = await import('@softstroke/angular');
  const NGS = await import('@softstroke/angular/solid');
  const comps = (m) => Object.entries(m).filter(([k]) => k !== 'SoftstrokeIcon');
  assert.equal(comps(NG).length, names.length, 'angular: one component per icon');
  assert.equal(comps(NGS).length, names.length, 'angular: one solid component per icon');
  const sel = (n) => n.replace(/Icon$/, '').replace(/[A-Z]/g, (c, i) => (i ? '-' : '') + c.toLowerCase()).replace(/([a-z])([0-9])/g, '$1-$2');
  const template = comps(NG).map(([n]) => `<ss-${sel(n)}></ss-${sel(n)}>`).join('')
    + comps(NGS).map(([n]) => `<ss-${sel(n)}-solid color="red"></ss-${sel(n)}-solid>`).join('')
    + '<ss-home id="p" [size]="32" color="red" [strokeWidth]="2" aria-label="Home"></ss-home>';
  const App = Component({ selector: 'app-root', standalone: true, imports: [...comps(NG).map(([, c]) => c), ...comps(NGS).map(([, c]) => c)], template })(class {});
  const html = await renderApplication((context) => bootstrapApplication(App, { providers: [provideZonelessChangeDetection()] }, context), { document: '<app-root></app-root>' });
  const svgs = html.match(/<svg[^>]*>.*?<\/svg>/gs) ?? [];
  assert.equal(svgs.length, names.length * 2 + 1, 'angular: every icon rendered an svg');
  assert.ok(svgs.every((s) => /<(path|circle) /.test(s) && /aria-hidden="true"/.test(s)), 'angular: shapes, decorative svg');
  assert.ok(svgs.slice(names.length, names.length * 2).every((s) => /fill="red"/.test(s) && !/stroke/.test(s)), 'angular: solid fills, no stroke');
  const p = html.match(/<ss-home id="p"[^>]*>.*?<\/ss-home>/s)[0];
  for (const re of [/width="32"/, /stroke="red"/, /stroke-width="2"/, /role="img"/]) assert.match(p, re, `angular props ${re}`);
}

console.log(`ok: vue, svelte, angular render all ${names.length} icons in both styles`);

// ---- Icon font: one class per icon, unique code points, real woff2 files (glyph shapes are checked by font.py) ----
{
  const { readFileSync: rf } = await import('node:fs');
  const css = rf('packages/font/dist/softstroke.css', 'utf8');
  const rules = [...css.matchAll(/\.ss-([a-z0-9-]+)::before \{ content: "\\([0-9a-f]+)"; \}/g)];
  assert.equal(rules.length, names.length, 'font: one class per icon');
  assert.equal(new Set(rules.map((r) => r[2])).size, names.length, 'font: unique code points');
  assert.deepEqual(rules.map((r) => r[1] + '.svg').sort(), [...names].sort(), 'font: classes match the icons');
  for (const f of ['softstroke.woff2', 'softstroke-solid.woff2']) assert.equal(rf(`packages/font/dist/${f}`).subarray(0, 4).toString(), 'wOF2', `font: ${f} is woff2`);
  console.log(`ok: icon font, ${rules.length} classes, stroke + solid woff2`);
}
