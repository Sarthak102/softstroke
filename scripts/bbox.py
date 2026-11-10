# flag icons whose drawn bbox (stroke edges) leaves 1.75..22.25 (rule 4: centre lines 2.5-21.5) or whose centre is > 0.5 off (12,12)
import sys, re; sys.path.insert(0,'scripts'); from geo import chains, circle_path; from geo import _pt
# optical, checked by eye: play's triangle sits right, volume-low keeps volume's speaker spot, eye is 0.15 wide
OK={'play','volume-low','eye','eye-off'}
for n in sys.argv[1:]:
    if n in OK: continue
    s=open(f'icons/{n}.svg').read()
    ds=re.findall(r'<path d="([^"]+)"',s)+[circle_path(float(a),float(b),float(r)) for a,b,r in re.findall(r'<circle cx="([^"]+)" cy="([^"]+)" r="([^"]+)"',s)]
    pts=[_pt(c,t/30) for d in ds for ch in chains(d) for c in ch for t in range(31)]
    x0,x1=min(p[0] for p in pts)-.75,max(p[0] for p in pts)+.75; y0,y1=min(p[1] for p in pts)-.75,max(p[1] for p in pts)+.75
    cx,cy=(x0+x1)/2,(y0+y1)/2; bad=x0<1.7 or y0<1.7 or x1>22.3 or y1>22.3 or abs(cx-12)>.5 or abs(cy-12)>.5
    if bad: print(f'{n:15} x {x0:.2f}-{x1:.2f} y {y0:.2f}-{y1:.2f} centre ({cx:.2f},{cy:.2f})')
