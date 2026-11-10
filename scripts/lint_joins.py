# Join lint for stroke icons: lists every sharp vertex (direction change > ANGLE deg between consecutive
# segments, closing joins included). Style rule 2: vertices are softened, so each hit is a fix or a
# deliberate exception. Also flags line ends that stop near (not on) another stroke's centre line.
# Usage: python3 scripts/lint_joins.py [--fix] [names...]   (default: all icons)
# --fix snaps line ends within SNAP of another stroke onto its centre line (rule 10).
import math, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from geo import chains, circle_path, _pt
ANGLE=20
SNAP=.7
# Checked by eye, deliberate: knots/overhangs that read correctly at 16-24px.
EXCEPT={'gift':'bow loops meet in a knot on the lid line','sprout':'stem top hidden inside the leaf joins',
        **dict.fromkeys('alarm-off clapperboard flag flower fuel images pin truck'.split(),'deliberate overhang or end on a wheel, checked by eye'),
        'bold':'letter B: bowls meet the stem at real corners'}
def tangent(c,end):
    # direction at the start/end of a cubic, skipping zero-length control handles
    pts=c if not end else c[::-1]
    for q in pts[1:]:
        dx,dy=q[0]-pts[0][0],q[1]-pts[0][1]
        if math.hypot(dx,dy)>1e-6: return (-dx,-dy) if end else (dx,dy)
    return None
def corners(d):
    hits=[]
    for ch in chains(d):
        closed=len(ch)>1 and math.dist(ch[0][0],ch[-1][3])<1e-6
        pairs=list(zip(ch,ch[1:]))+([(ch[-1],ch[0])] if closed else [])
        for a,b in pairs:
            t1,t2=tangent(a,True),tangent(b,False)
            if not t1 or not t2 or math.dist(a[3],b[0])>1e-3: continue
            ang=abs(math.degrees(math.atan2(t1[0]*t2[1]-t1[1]*t2[0],t1[0]*t2[0]+t1[1]*t2[1])))
            if ang>ANGLE: hits.append((round(a[3][0],2),round(a[3][1],2),round(ang)))
    return hits
def near_misses(ds):
    # open line ends that stop close to another stroke but not on its centre line -> gap or nub (rule 10)
    subs=[ch for d in ds for ch in chains(d) if ch]
    def dist(e,ch):
        # exact-ish distance from point e to a cubic chain: coarse samples, then ternary refine
        best=(1e9,None)
        for c in ch:
            ts=[t/40 for t in range(41)]; k=min(range(41),key=lambda i:math.dist(e,_pt(c,ts[i])))
            lo,hi=ts[max(0,k-1)],ts[min(40,k+1)]
            for _ in range(40):
                m1,m2=lo+(hi-lo)/3,hi-(hi-lo)/3
                if math.dist(e,_pt(c,m1))<math.dist(e,_pt(c,m2)): hi=m2
                else: lo=m1
            q=_pt(c,(lo+hi)/2); best=min(best,(math.dist(e,q),q),key=lambda b:b[0])
        return best
    hits=[]
    for i,ch in enumerate(subs):
        if math.dist(ch[0][0],ch[-1][3])<1e-6: continue
        for e in (ch[0][0],ch[-1][3]):
            for j,other in enumerate(subs):
                if j==i: continue
                dm,q=dist(e,other)
                if .03<dm<1.4: hits.append((round(e[0],2),round(e[1],2),round(dm,2),i,e,q))
    return hits
def snap(ds,hits):
    # rebuild each path whose line ends moved: endpoint -> nearest point on the other stroke
    from geo import f
    subs=[(k,ch) for k,d in enumerate(ds) for ch in chains(d) if ch]
    moves={}
    for h in hits:
        if h[2]<SNAP: moves.setdefault(h[3],[]).append((h[4],h[5]))
    out=[[] for _ in ds]
    for i,(k,ch) in enumerate(subs):
        ch=[list(c) for c in ch]
        for e,q in moves.get(i,[]):
            if math.dist(ch[0][0],e)<1e-6:
                dx,dy=q[0]-e[0],q[1]-e[1]; ch[0][0]=q; ch[0][1]=(ch[0][1][0]+dx,ch[0][1][1]+dy)
            else:
                dx,dy=q[0]-e[0],q[1]-e[1]; ch[-1][3]=q; ch[-1][2]=(ch[-1][2][0]+dx,ch[-1][2][1]+dy)
        out[k].append(f"M{f(ch[0][0][0])} {f(ch[0][0][1])}"+''.join(f"C{f(c[1][0])} {f(c[1][1])} {f(c[2][0])} {f(c[2][1])} {f(c[3][0])} {f(c[3][1])}" for c in ch)
                      +('Z' if math.dist(ch[0][0],ch[-1][3])<1e-6 else ''))
    return [''.join(o) for o in out],set(k for i,(k,_) in enumerate(subs) if i in moves)
FIX='--fix' in sys.argv
names=[a for a in sys.argv[1:] if a!='--fix'] or sorted(f[:-4] for f in os.listdir('icons') if f.endswith('.svg') and f[:-4] not in EXCEPT)
total=0
for n in names:
    src=open(f'icons/{n}.svg').read()
    ds=re.findall(r'<path d="([^"]+)"',src)
    circ=[circle_path(float(a),float(b),float(r)) for a,b,r in re.findall(r'<circle cx="([^"]+)" cy="([^"]+)" r="([^"]+)"',src)]
    nm=near_misses(ds+circ)
    if FIX and any(m[2]<SNAP for m in nm):
        new,changed=snap(ds+circ,nm)
        for k in changed:
            if k<len(ds): src=src.replace(f'd="{ds[k]}"',f'd="{new[k]}"')
        open(f'icons/{n}.svg','w').write(src)
        ds=re.findall(r'<path d="([^"]+)"',src); nm=near_misses(ds+circ)
    h=[c for d in ds for c in corners(d)]+[('gap',)+m[:3] for m in nm]
    if h: total+=1; print(f"{n:18} {len(h):2}  "+' '.join((f"gap({c[1]},{c[2]})d{c[3]}" if c[0]=='gap' else f"({c[0]},{c[1]}){c[2]}°") for c in h[:6])+(' ...' if len(h)>6 else ''))
print(f'{total} icons with sharp vertices or near-miss line ends')
