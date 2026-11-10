# Review sheet: each icon at 120px over the grid + 16/20/24, light row then dark row.
# Usage: python3 scripts/review.py OUT_DIR "icon-a icon-b ..." NAME  -> OUT_DIR/NAME.html
import sys,re
S,names,out=sys.argv[1],sys.argv[2].split(),sys.argv[3]
grid=lambda p,c:f'<svg style="position:absolute;inset:0" viewBox="0 0 24 24" width="{p}" height="{p}">'+''.join(f'<path d="M{i} 0v24M0 {i}h24" stroke="{c}" stroke-width=".04" opacity=".45"/>' for i in range(25))+f'<rect x="2" y="2" width="20" height="20" fill="none" stroke="{c}" stroke-width=".06"/></svg>'
svg=lambda n,p,st='':re.sub('<svg ',f'<svg width="{p}" height="{p}" style="{st}" ',open(f"icons/{n}.svg").read())
cell=lambda n,c:f'<div style="display:inline-flex;flex-direction:column;align-items:center;margin:4px;width:128px;font:11px system-ui"><div style="position:relative;width:120px;height:120px">{grid(120,c)}{svg(n,120,"position:absolute;inset:0")}</div><div style="margin:3px">{svg(n,16)} {svg(n,20)} {svg(n,24)}</div>{n}</div>'
row=lambda bg,fg,c:f'<div style="background:{bg};color:{fg};padding:4px">'+''.join(cell(n,c) for n in names)+'</div>'
open(f'{S}/{out}.html','w').write('<body style="margin:0">'+row('#fff','#111','#e5484d')+row('#111','#eee','#7a2a2d'))
