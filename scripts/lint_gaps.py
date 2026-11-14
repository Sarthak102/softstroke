# Gap lint for stroke icons: separate parts must stay >= MIN apart (ink edge to ink edge), or they fill in
# at 16px (1 unit = 0.67px there). Hugeicons free: 6% of icons under 1.0; we were at 15% before v1.1.
# Usage: .venv/bin/python scripts/lint_gaps.py [names...]   (default: all icons)
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from geo import chains, circle_path, _pt
from shapely.geometry import LineString, Point
from shapely.ops import unary_union

MIN = 1.0
ACCEPT = {'wallet-card': 'dot centred in the card tab, 0.93 above/below: the tab height comes from the wallet body'}   # name -> reason, checked by eye

def ink(n):
    s = open(f'icons/{n}.svg').read()
    ds = re.findall(r' d="([^"]+)"', s) + [circle_path(float(a), float(b), float(r)) for a, b, r in re.findall(r'<circle cx="([^"]+)" cy="([^"]+)" r="([^"]+)"', s)]
    g = []
    for d in ds:
        for ch in chains(d):
            p = [_pt(c, t / 24) for c in ch for t in range(25)]
            g.append(LineString(p).buffer(.75, 16) if len(set(p)) > 1 else Point(p[0]).buffer(.75, 16))
    return unary_union(g).buffer(.005)   # merge pieces that touch (zero-length joins leave slivers)

names = sys.argv[1:] or sorted(f[:-4] for f in os.listdir('icons'))
bad = 0
for n in names:
    if n in ACCEPT: continue
    parts = list(getattr(ink(n), 'geoms', [ink(n)]))
    close = sorted(((a.distance(b), a.centroid, b.centroid) for i, a in enumerate(parts) for b in parts[i + 1:] if a.distance(b) + .01 < MIN), key=lambda c: c[0])
    if close:
        bad += 1
        print(f'{n:18} ' + ' '.join(f'{d:.2f}@({(p.x + q.x) / 2:.1f},{(p.y + q.y) / 2:.1f})' for d, p, q in close[:3]))
print(f'{bad} icons with parts closer than {MIN}')
