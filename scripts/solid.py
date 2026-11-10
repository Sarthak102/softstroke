# Geometry for the solid set: SVG paths -> shapely shapes -> fill-only SVG paths (dev tool, needs .venv).
import math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from geo import chains, circle_path, _pt, f
from shapely.geometry import LineString, Polygon, MultiPolygon, Point
from shapely.ops import unary_union

STEP=.05      # sampling step along curves
W=1.5         # stroke width of the stroke set
BOLD=2.25     # outline parts of solid icons (Hugeicons-style: bolder, not filled)

def _pts(ch):
    out=[]
    for c in ch:
        L=sum(math.dist(_pt(c,i/8),_pt(c,(i+1)/8)) for i in range(8)); n=max(2,int(L/STEP))
        for i in range(n+1):
            p=_pt(c,i/n)
            if not out or math.dist(p,out[-1])>1e-6: out.append(p)
    return out

def area(d):
    # filled region of the closed subpaths of d (evenodd, so inner subpaths become holes)
    g=None
    for ch in chains(d):
        p=_pts(ch)
        if len(p)>2: g=Polygon(p) if g is None else g.symmetric_difference(Polygon(p))
    return g.buffer(0)

def line(d,w=W,cap='round'):
    # a stroked path as a shape (round joins); cap='flat' ends exactly at the path ends
    cs={'round':1,'flat':2}[cap]; parts=[]
    for ch in chains(d):
        p=_pts(ch)
        closed=len(ch)>0 and math.dist(ch[0][0],ch[-1][3])<1e-6
        if len(p)<2 or sum(math.dist(p[i],p[i+1]) for i in range(len(p)-1))<.05:  # glyph dot
            parts.append(Point(p[0]).buffer(w/2,quad_segs=16)); continue
        if closed: parts.append(Polygon(p).exterior.buffer(w/2,quad_segs=16,join_style=1)); continue
        parts.append(LineString(p).buffer(w/2,quad_segs=16,cap_style=cs,join_style=1))
    return unary_union(parts)

def circle(cx,cy,r): return Point(cx,cy).buffer(r,quad_segs=32)

def silhouette(d,grow=W/2):
    # the stroke icon's outer edge: the closed shape grown by half a stroke
    return area(d).buffer(grow,quad_segs=16,join_style=1)

def extend(d,by=2):
    # extend an open path's ends along their tangents, so a cut made from it runs past the silhouette edge
    out=''
    for ch in chains(d):
        a,b=ch[0][0],ch[0][1] if math.dist(ch[0][0],ch[0][1])>1e-6 else ch[0][2]
        c,e=ch[-1][3],ch[-1][2] if math.dist(ch[-1][3],ch[-1][2])>1e-6 else ch[-1][1]
        u=lambda p,q:((p[0]-q[0])/math.dist(p,q),(p[1]-q[1])/math.dist(p,q))
        s,t=u(a,b),u(c,e)
        out+=f"M{f(a[0]+s[0]*by)} {f(a[1]+s[1]*by)}L{f(a[0])} {f(a[1])}"
        out+=''.join(f"C{f(k[1][0])} {f(k[1][1])} {f(k[2][0])} {f(k[2][1])} {f(k[3][0])} {f(k[3][1])}" for k in ch)
        out+=f"L{f(c[0]+t[0]*by)} {f(c[1]+t[1]*by)}"
    return out

def to_svg(g,tol=.01):
    # shapes -> one fill-only path (evenodd keeps holes holes)
    g=g.simplify(tol)
    polys=list(g.geoms) if isinstance(g,MultiPolygon) else [g]
    ring=lambda r:"M"+"L".join(f"{f(x)} {f(y)}" for x,y in list(r.coords)[:-1])+"Z"
    return ''.join(ring(p.exterior)+''.join(ring(i) for i in p.interiors) for p in polys if not p.is_empty)
