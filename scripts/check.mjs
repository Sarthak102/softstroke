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
