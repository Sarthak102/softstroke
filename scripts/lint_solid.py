# Lint for icons-solid: hairline slivers, hairline gaps, tiny islands, live area (run with .venv/bin/python).
# Usage: .venv/bin/python scripts/lint_solid.py [names...]
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from solid import area
from shapely.geometry import Polygon
MIN=.9   # thinnest solid part / hole allowed (a 16px render loses anything thinner)
GAP=.45  # smallest gap between separate parts (stroke icons allow 0.5 edge gaps)
# Reviewed by eye 2026-11-10 at 16/24/120px and accepted (re-check if the icon changes):
ACCEPT={
 'slivers = tips of cut details': 'alarm-off bell-off book-open camera-off cloud-download cloud-upload compass flask folder-open gem globe mic-off shield-off timer-off video-off wallet-card wifi-off',
 'narrow slots in bold U shapes, close cleanly at 16px': 'bell-ring bus car hammer megaphone ship trash wallet',
 'gaps between footprint cuts, read fine': 'printer qr-code',
}
OK={n for v in ACCEPT.values() for n in v.split()}
names=sys.argv[1:] or sorted(f[:-4] for f in os.listdir('icons-solid') if f[:-4] not in OK)
bad=0
for n in names:
    ds=re.findall(r' d="([^"]+)"',open(f'icons-solid/{n}.svg').read())
    G=area(''.join(ds)); r=MIN/2; out=[]
    x0,y0,x1,y1=G.bounds
    # bold (2.25) parts on rule-4 centre lines reach 1.375
    if x0<1.3 or y0<1.3 or x1>22.7 or y1>22.7: out.append(f'bounds {x0:.2f},{y0:.2f}-{x1:.2f},{y1:.2f}')
    for p in getattr(G,'geoms',[G]):
        if p.area<.8: out.append(f'island {p.area:.2f} at {p.centroid.x:.1f},{p.centroid.y:.1f}')
    thin=G.difference(G.buffer(-r).buffer(r)).buffer(-.05)
    if thin.area>.1: c=thin.centroid; out.append(f'sliver {thin.area:.2f} near {c.x:.1f},{c.y:.1f}')
    ps=list(getattr(G,'geoms',[G]))
    for i in range(len(ps)):
        for j in range(i+1,len(ps)):
            dd=ps[i].distance(ps[j])
            if dd<GAP: c=ps[i].buffer(dd+.01).intersection(ps[j].buffer(.01)).centroid; out.append(f'gap {dd:.2f} near {c.x:.1f},{c.y:.1f}')
        for h in ps[i].interiors:
            hp=Polygon(h)
            if hp.buffer(-r).is_empty: c=hp.centroid; out.append(f'hole thinner than {MIN} near {c.x:.1f},{c.y:.1f}')
    if out: bad+=1; print(f'{n:18}'+'; '.join(out))
print(f'{bad} solid icons flagged')
