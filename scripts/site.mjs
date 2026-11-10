// Docs site: packages/svg/dist (stroke + solid) + keywords.json -> site/index.html (one static page, no requests).
// Run after the build: npm run site
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';

const inner = (file) => readFileSync(file, 'utf8').replace(/^<svg[^>]*>|<\/svg>\s*$/g, '');
const keywords = JSON.parse(readFileSync('keywords.json', 'utf8'));
const names = readdirSync('packages/svg/dist/icons').filter((f) => f.endsWith('.svg')).map((f) => f.slice(0, -4)).sort();
const icons = names.map((n) => ({
  n,
  s: inner(`packages/svg/dist/icons/${n}.svg`),
  f: inner(`packages/svg/dist/solid/icons/${n}.svg`),
  k: keywords[n] || [],
}));
const version = JSON.parse(readFileSync('packages/react/package.json', 'utf8')).version;
// JSON inside a <script> tag: escape "<" so no icon data can close the tag
const data = JSON.stringify(icons).replace(/</g, '\\u003c');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Softstroke - soft, rounded open-source icons</title>
<meta name="description" content="${icons.length} soft, rounded icons in stroke and solid styles for React, React Native and plain SVG. MIT licensed.">
<style>
:root{--bg:#fbfbfa;--panel:#fff;--text:#18181b;--muted:#6b6b72;--line:#e7e7e4;--hover:#f2f2ef;--accent:#18181b;--accent-text:#fff;--focus:#4f7cff;color-scheme:light}
:root[data-theme=dark]{--bg:#111113;--panel:#19191c;--text:#ededed;--muted:#9a9aa3;--line:#2a2a2f;--hover:#222227;--accent:#ededed;--accent-text:#111113;color-scheme:dark}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#111113;--panel:#19191c;--text:#ededed;--muted:#9a9aa3;--line:#2a2a2f;--hover:#222227;--accent:#ededed;--accent-text:#111113;color-scheme:dark}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:inherit}
.wrap{max-width:1180px;margin:0 auto;padding:0 20px}
header{padding:56px 0 28px}
.brand{display:flex;align-items:center;gap:10px;font-weight:650;font-size:17px}
h1{font-size:clamp(30px,5vw,46px);line-height:1.1;letter-spacing:-.02em;margin:22px 0 12px;max-width:720px}
.lede{color:var(--muted);font-size:17px;max-width:620px;margin:0 0 24px}
.cta{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.cmd{display:inline-flex;align-items:center;gap:10px;font:14px ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px 12px}
button{font:inherit;color:inherit}
.btn{text-decoration:none;border:1px solid var(--line);background:var(--panel);border-radius:10px;padding:9px 14px;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
.btn:hover{background:var(--hover)}
.btn.primary{background:var(--accent);color:var(--accent-text);border-color:var(--accent)}
:focus-visible{outline:2px solid var(--focus);outline-offset:2px}
.bar{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);padding:12px 0}
.controls{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center}
.search{flex:1 1 260px;display:flex;align-items:center;gap:8px;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:0 12px}
.search input{flex:1;border:0;background:transparent;color:var(--text);font:inherit;padding:10px 0;outline:0;min-width:0}
.seg{display:inline-flex;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--panel)}
.seg button{border:0;background:transparent;padding:8px 14px;cursor:pointer}
.seg button[aria-pressed=true]{background:var(--accent);color:var(--accent-text)}
label.ctl{display:inline-flex;align-items:center;gap:8px;color:var(--muted);font-size:13px}
label.ctl input[type=range]{width:96px}
label.ctl output{color:var(--text);font-variant-numeric:tabular-nums;min-width:2.5em}
input[type=color]{width:30px;height:30px;border:1px solid var(--line);border-radius:8px;padding:2px;background:var(--panel)}
.count{color:var(--muted);font-size:13px;margin:18px 0 8px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px;padding-bottom:40px}
.cell{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;aspect-ratio:1;border:1px solid transparent;border-radius:14px;background:transparent;cursor:pointer;padding:10px 6px}
.cell:hover{background:var(--panel);border-color:var(--line)}
.cell[aria-current=true]{border-color:var(--text)}
.cell span{font-size:11.5px;color:var(--muted);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.empty{padding:60px 0;text-align:center;color:var(--muted)}
dialog{border:1px solid var(--line);border-radius:18px;background:var(--panel);color:var(--text);padding:0;width:min(560px,calc(100vw - 32px))}
dialog::backdrop{background:rgb(0 0 0 / .35)}
.dhead{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border-bottom:1px solid var(--line)}
.dhead h2{margin:0;font-size:17px}
.dbody{padding:18px;display:grid;gap:16px}
.stage{display:flex;justify-content:center;gap:28px;align-items:center;padding:26px;border-radius:14px;background:var(--bg);border:1px solid var(--line)}
.tags{display:flex;flex-wrap:wrap;gap:6px}
.tags span{font-size:12px;border:1px solid var(--line);border-radius:999px;padding:2px 9px;color:var(--muted)}
.actions{display:flex;flex-wrap:wrap;gap:8px}
pre{margin:0;overflow-x:auto;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:12px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}
section.docs{border-top:1px solid var(--line);padding:40px 0 64px}
section.docs h2{font-size:22px;margin:0 0 6px}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px;margin-top:18px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px;display:grid;gap:10px;min-width:0}
.card h3{margin:0;font-size:15px}
.card p{margin:0;color:var(--muted);font-size:14px}
footer{border-top:1px solid var(--line);padding:22px 0 40px;color:var(--muted);font-size:13px}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--accent);color:var(--accent-text);padding:9px 16px;border-radius:999px;font-size:14px;opacity:0;transition:opacity .15s;pointer-events:none}
.toast.show{opacity:1}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
</style>
</head>
<body>
<header class="wrap">
  <div class="brand"><span id="logo"></span>Softstroke <span style="color:var(--muted);font-weight:400">v${version}</span></div>
  <h1>Soft, rounded icons for web and mobile.</h1>
  <p class="lede">${icons.length} icons, each in stroke and solid. A 24px grid, a 1.5px round stroke and squircle corners. For React, React Native and plain SVG. MIT licensed.</p>
  <div class="cta">
    <span class="cmd"><span>npm i @softstroke/react</span><button class="btn" data-copy="npm i @softstroke/react" aria-label="Copy install command">Copy</button></span>
    <a class="btn" href="#docs">Docs</a>
    <button class="btn" id="theme" aria-label="Toggle dark mode">Theme</button>
  </div>
</header>

<div class="bar">
  <div class="wrap controls" role="search">
    <div class="search"><span id="searchIcon" aria-hidden="true"></span><label for="q" class="sr">Search icons</label><input id="q" type="search" placeholder="Search ${icons.length} icons (try: delete, money, weather)" autocomplete="off"></div>
    <div class="seg" role="group" aria-label="Style">
      <button aria-pressed="true" data-style="s">Stroke</button><button aria-pressed="false" data-style="f">Solid</button>
    </div>
    <label class="ctl">Size <input id="size" type="range" min="16" max="48" step="4" value="24"><output for="size" id="sizeOut">24</output></label>
    <label class="ctl" id="strokeCtl">Stroke <input id="stroke" type="range" min="1" max="2.5" step="0.25" value="1.5"><output for="stroke" id="strokeOut">1.5</output></label>
    <label class="ctl">Color <input id="color" type="color" value="#18181b"></label>
  </div>
</div>

<main class="wrap">
  <p class="count" id="count" aria-live="polite"></p>
  <div class="grid" id="grid"></div>
  <p class="empty" id="empty" hidden>No icons match that search. Try another word, or <a href="#" id="clear">clear the search</a>.</p>

  <section class="docs" id="docs">
    <h2>Install</h2>
    <p style="color:var(--muted);margin:0">Every icon has a stroke and a solid version with the same name. Import only the icons you use; the rest stay out of your bundle.</p>
    <div class="cols">
      <div class="card"><h3>React</h3><pre>npm i @softstroke/react</pre><pre>import { HomeIcon } from '@softstroke/react';
import { HomeIcon as HomeSolid } from '@softstroke/react/solid';

&lt;HomeIcon size={24} color="currentColor" strokeWidth={1.5} /&gt;</pre></div>
      <div class="card"><h3>React Native / Expo</h3><pre>npx expo install react-native-svg
npm i @softstroke/react-native</pre><pre>import { HomeIcon } from '@softstroke/react-native';
// big apps: import single icons (Metro doesn't tree-shake)
import CalendarIcon from '@softstroke/react-native/icons/calendar';</pre></div>
      <div class="card"><h3>Plain SVG</h3><pre>npm i @softstroke/svg</pre><pre>&lt;svg width="24" height="24"&gt;&lt;use href="sprite.svg#home"/&gt;&lt;/svg&gt;</pre><p>Single files: <code>icons/&lt;name&gt;.svg</code> and <code>solid/icons/&lt;name&gt;.svg</code>.</p></div>
    </div>
    <div class="cols">
      <div class="card"><h3>Props</h3><p><code>size</code> (24), <code>color</code> (<code>currentColor</code>), <code>strokeWidth</code> (1.5, stroke icons only). Any other SVG prop is passed through.</p></div>
      <div class="card"><h3>Accessibility</h3><p>Icons are <code>aria-hidden</code> by default. For an icon-only button, label the button, or pass <code>aria-label</code> to the icon.</p></div>
    </div>
  </section>
</main>

<footer class="wrap">Softstroke is MIT licensed.</footer>

<dialog id="dlg" aria-labelledby="dname">
  <div class="dhead"><h2 id="dname"></h2><button class="btn" id="dclose" aria-label="Close">Close</button></div>
  <div class="dbody">
    <div class="stage" id="stage"></div>
    <div class="tags" id="tags"></div>
    <div class="actions">
      <button class="btn primary" data-act="svg">Copy SVG</button>
      <button class="btn" data-act="jsx">Copy JSX</button>
      <button class="btn" data-act="import">Copy import</button>
    </div>
    <pre id="snippet"></pre>
  </div>
</dialog>
<div class="toast" id="toast" role="status"></div>

<script>
const ICONS=${data};
const $=(s)=>document.querySelector(s);
const st={style:'s',size:24,stroke:1.5,color:'',q:'',cur:null};
const pascal=(n)=>n.replace(/(^|-)([a-z0-9])/g,(_,a,c)=>c.toUpperCase())+'Icon';
const root=(style,size,stroke,color)=>style==='s'
  ?'viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="none" stroke="'+color+'" stroke-width="'+stroke+'" stroke-linecap="round" stroke-linejoin="round"'
  :'viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="'+color+'"';
const svg=(i,style,size,stroke,color)=>'<svg xmlns="http://www.w3.org/2000/svg" '+root(style,size,stroke,color)+'>'+i[style]+'</svg>';
const color=()=>st.color||'currentColor';
const byName=Object.fromEntries(ICONS.map((i)=>[i.n,i]));
$('#logo').innerHTML=svg(byName['sparkle']||ICONS[0],'f',22,1.5,'currentColor');
$('#searchIcon').innerHTML=svg(byName['search']||ICONS[0],'s',18,1.5,'currentColor');

function matches(i,q){
  if(!q) return true;
  return q.split(/\\s+/).every((w)=>i.n.includes(w)||i.k.some((k)=>k.includes(w)));
}
function render(){
  const list=ICONS.filter((i)=>matches(i,st.q));
  $('#grid').innerHTML=list.map((i)=>'<button class="cell" data-n="'+i.n+'" aria-label="'+i.n+'">'+svg(i,st.style,st.size,st.stroke,color())+'<span>'+i.n+'</span></button>').join('');
  $('#count').textContent=list.length===ICONS.length?ICONS.length+' icons':list.length+' of '+ICONS.length+' icons';
  $('#empty').hidden=list.length>0;
  $('#strokeCtl').style.visibility=st.style==='s'?'visible':'hidden';
}
let t;
$('#q').addEventListener('input',(e)=>{clearTimeout(t);t=setTimeout(()=>{st.q=e.target.value.trim().toLowerCase();render();},80);});
$('#clear').addEventListener('click',(e)=>{e.preventDefault();$('#q').value='';st.q='';render();$('#q').focus();});
document.querySelectorAll('[data-style]').forEach((b)=>b.addEventListener('click',()=>{
  st.style=b.dataset.style;document.querySelectorAll('[data-style]').forEach((x)=>x.setAttribute('aria-pressed',x===b));render();if(st.cur)openIcon(st.cur,false);}));
$('#size').addEventListener('input',(e)=>{st.size=+e.target.value;$('#sizeOut').textContent=st.size;render();});
$('#stroke').addEventListener('input',(e)=>{st.stroke=+e.target.value;$('#strokeOut').textContent=st.stroke;render();});
$('#color').addEventListener('input',(e)=>{st.color=e.target.value;render();});

function snippets(i){
  const pkg=st.style==='s'?'@softstroke/react':'@softstroke/react/solid';
  const props=(st.size!==24?' size={'+st.size+'}':'')+(st.color?' color="'+st.color+'"':'')+(st.style==='s'&&st.stroke!==1.5?' strokeWidth={'+st.stroke+'}':'');
  return {svg:svg(i,st.style,24,st.stroke,st.color||'currentColor'),jsx:'<'+pascal(i.n)+props+' />',import:"import { "+pascal(i.n)+" } from '"+pkg+"';"};
}
function openIcon(n,show=true){
  const i=byName[n];st.cur=n;
  $('#dname').textContent=n+(st.style==='f'?' (solid)':'');
  $('#stage').innerHTML=[16,24,48,96].map((s)=>svg(i,st.style,s,st.stroke,color())).join('');
  $('#tags').innerHTML=i.k.map((k)=>'<span>'+k+'</span>').join('');
  $('#snippet').textContent=snippets(i).import+'\\n\\n'+snippets(i).jsx;
  if(show&&!$('#dlg').open) $('#dlg').showModal();
}
$('#grid').addEventListener('click',(e)=>{const b=e.target.closest('.cell');if(b) openIcon(b.dataset.n);});
$('#dclose').addEventListener('click',()=>$('#dlg').close());
$('#dlg').addEventListener('close',()=>{st.cur=null;});
$('#dlg').addEventListener('click',(e)=>{if(e.target===$('#dlg')) $('#dlg').close();});

function toast(msg){const el=$('#toast');(($('#dlg').open)?$('#dlg'):document.body).appendChild(el);  // a modal dialog sits above the page: show the toast inside it
  el.textContent=msg;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1400);}
async function copy(text,label){
  try{await navigator.clipboard.writeText(text);toast(label+' copied');}
  catch{toast('Copy failed: select the text and copy it yourself');}
}
document.querySelectorAll('[data-act]').forEach((b)=>b.addEventListener('click',()=>{
  const s=snippets(byName[st.cur]);copy(s[b.dataset.act],{svg:'SVG',jsx:'JSX',import:'Import'}[b.dataset.act]);}));
document.querySelectorAll('[data-copy]').forEach((b)=>b.addEventListener('click',()=>copy(b.dataset.copy,'Install command')));

const themeKey='softstroke-theme';
// until a colour is picked, the swatch shows the theme's text colour (what currentColor renders)
function syncSwatch(){if(!st.color){const c=getComputedStyle(document.body).color.match(/\\d+/g).slice(0,3).map((v)=>(+v).toString(16).padStart(2,'0')).join('');$('#color').value='#'+c;}}
function applyTheme(t){if(t)document.documentElement.dataset.theme=t;else delete document.documentElement.dataset.theme;syncSwatch();}
try{applyTheme(localStorage.getItem(themeKey));}catch{}
$('#theme').addEventListener('click',()=>{
  const dark=document.documentElement.dataset.theme?document.documentElement.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  const next=dark?'light':'dark';applyTheme(next);try{localStorage.setItem(themeKey,next);}catch{}});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',syncSwatch);
syncSwatch();
render();
</script>
</body>
</html>
`;

mkdirSync('site', { recursive: true });
writeFileSync('site/index.html', html);
console.log(`site/index.html: ${icons.length} icons (stroke + solid), ${(html.length / 1024).toFixed(0)} KB`);
