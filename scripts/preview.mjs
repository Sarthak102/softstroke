// Writes preview.html: every icon at 16/20/24/32/96, light and dark, with a 24px grid overlay at 96.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const icons = readdirSync('icons').filter((f) => f.endsWith('.svg')).sort();
const sizes = [16, 20, 24, 32];
const sized = (svg, s) => svg.replace('<svg ', `<svg width="${s}" height="${s}" `);
const grid = `<svg class="grid" viewBox="0 0 24 24">${Array.from({ length: 25 }, (_, i) =>
  `<path d="M${i} 0v24M0 ${i}h24"/>`).join('')}<rect x="2" y="2" width="20" height="20"/></svg>`;

const rows = icons.map((f) => {
  const svg = readFileSync(`icons/${f}`, 'utf8').trim();
  return `<div class="row"><span>${f.slice(0, -4)}</span>${sizes.map((s) => sized(svg, s)).join('')}
<div class="big">${grid}${sized(svg, 96)}</div></div>`;
}).join('\n');

const page = (theme) => `<section class="${theme}">${rows}</section>`;
writeFileSync('preview.html', `<!doctype html><meta charset="utf-8"><title>Softstroke preview</title>
<style>
body{margin:0;font:13px system-ui;display:flex}
section{flex:1;padding:16px}
.light{background:#fff;color:#111}.dark{background:#111;color:#eee}
.row{display:flex;align-items:center;gap:20px;height:110px}
.row span{width:110px}
.big{position:relative;width:96px;height:96px}
.big svg{position:absolute;inset:0;width:96px;height:96px}
.grid{stroke:#e5484d;stroke-width:.03;fill:none;opacity:.45}
</style>${page('light')}${page('dark')}`);
console.log(`preview.html: ${icons.length} icons`);
