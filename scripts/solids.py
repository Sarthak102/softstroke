# Generates icons-solid/*.svg (run with .venv/bin/python scripts/solids.py).
# Conventions (studied from Hugeicons Solid Rounded, shapes our own):
# - line glyphs (no closed shapes) -> the stroke drawn bolder (BOLD)
# - outline-meaning icons (search lens, calendar frame) -> bolder outlines, fills only where they carry meaning
# - object icons -> silhouette = stroke icon's outer edge; details cut out at the stroke's own size/position
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from solid import *
from solid import _pts
import math

H='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">\n'
src=lambda n:re.findall(r'<path d="([^"]+)"',open(f'icons/{n}.svg').read())
def save(name,g): open(f'icons-solid/{name}.svg','w').write(H+f'  <path fill-rule="evenodd" d="{to_svg(g)}"/>\n</svg>\n')

# Shapes drawn with open strokes: a bold outline is not "solid", these get a design below instead.
SHAPES=set('alarm-off bell-off book book-open camera-off cast eye-off flag flask folder-open headphones hourglass mic-off phone-off pin shield-off store timer-off trash umbrella video-off'.split())

def home():
    # door: the stroke door's own arch, cut as a line; its legs stop 1.5 above the edge so the base stays
    return silhouette(src('home')[0]).difference(line('M9.75 19.5v-1.75a2.25 2.25 0 0 1 4.5 0V19.5'))
def search():
    return line('M10.75 3.5a7.25 7.25 0 1 0 0 14.5a7.25 7.25 0 1 0 0-14.5Z',BOLD).union(line('m16.25 16.25 4.5 4.5',BOLD))
def user():
    return circle(12,7.75,5).union(silhouette('M4 20.75c0-3.75 3.6-6.25 8-6.25s8 2.5 8 6.25Z'))
def calendar():
    frame=src('calendar')[0]; outer=silhouette(frame)
    ring=outer.difference(area(frame).buffer(-(BOLD-W/2)))          # bold frame, same outer edge
    header=outer.intersection(area('M0 0H24V9.5H0Z'))                 # band above the header line, filled
    return ring.union(header).union(line('M8 2.5v3M16 2.5v3',BOLD))
def heart(): return silhouette(src('heart')[0])
def bell():
    # clapper at stroke weight, 0.25 lower than in the stroke icon: the silhouette's lip is wider
    b=src('bell'); return silhouette(b[0]).union(translate(line(b[1],W),0,.25))
def mail():
    m=src('mail'); return silhouette(m[0]).difference(line(extend(m[1]),W,'flat'))
def settings():
    return silhouette(src('settings')[0],.35).difference(circle(12,12,3))

# ---- automatic solid for everything not designed by hand ----------------------------------------
from shapely.geometry import LineString as LS
from shapely.ops import substring
from shapely.affinity import translate
GAP=.6    # smallest gap between separate solid parts
HOLE=12   # inner closed shapes smaller than this (area) are cut as a solid shape; larger ones as a ring
THROUGH={'mail','magnet'}   # icons whose edge-to-edge detail lines cut through the edge instead of stopping short
# glyph-like icons (and ones a fill would change: wheels -> balls, glasses -> sunglasses): solid = bold stroke
LINE_ICONS={'at-sign','bold','infinity','glasses','globe'}
# outside details drawn at stroke weight: they meet fused lines, so they must match their weight
NORMAL_WEIGHT={'music'}

def parts(n):
    s=open(f'icons/{n}.svg').read()
    ds=re.findall(r'<path d="([^"]+)"',s)
    circ=[(float(a),float(b),float(r)) for a,b,r in re.findall(r'<circle cx="([^"]+)" cy="([^"]+)" r="([^"]+)"',s)]
    closed,open_=[],[]
    for d in ds:
        for ch in chains(d):
            if not ch: continue
            pts=_pts(ch)
            if math.dist(ch[0][0],ch[-1][3])<1e-6 and len(pts)>2: closed.append(Polygon(pts).buffer(0))
            else: open_.append(pts)
    closed+=[circle(*c) for c in circ]
    return closed,open_

def detail_shape(pts,w,cap=1):
    if len(pts)<2 or LS(pts).length<.05: return Point(pts[0]).buffer(w/2,quad_segs=16)
    return LS(pts).buffer(w/2,quad_segs=16,cap_style=cap,join_style=1)

def auto(n):
    closed,open_=parts(n)
    closed.sort(key=lambda g:-g.area)
    outer=[]; inner=[]
    for g in closed:
        (inner if any(o.buffer(.01).contains(g) for o in outer) else outer).append(g)
    G=unary_union([o.buffer(W/2,quad_segs=16,join_style=1) for o in outer]) if outer else Polygon()
    body=unary_union(outer) if outer else Polygon()
    for g in inner:
        # inner details are cut at their stroke footprint (same size as in the stroke icon):
        # small shapes (dots, pips, needles) as a solid white shape, larger ones as a white ring
        G=G.difference(g.buffer(W/2,quad_segs=16,join_style=1) if g.area<HOLE else g.exterior.buffer(W/2,quad_segs=16,join_style=1))
    edge=body.boundary if outer else None
    for pts in open_:
        if len(pts)<2 or LS(pts).length<.05:                       # glyph dot
            dot=detail_shape(pts,W)
            G=G.difference(dot) if outer and body.contains(Point(pts[0])) else G.union(detail_shape(pts,BOLD))
            continue
        ln=LS(pts)
        inside=ln.intersection(body) if outer else ln.intersection(Polygon())
        outside=ln.difference(body) if outer else ln
        if outside.length>.3:
            # the part outside the bodies is drawn bold (or at 1.5 if bold would crowd a neighbour);
            # if it touches a body in the stroke icon (stem on a note head) it is fused instead of leaving a hairline
            b=outside.buffer(BOLD/2,quad_segs=16,cap_style=1,join_style=1)
            if outer and outside.distance(body)<W/2+.1:
                # touched in the stroke icon: fuse at stroke weight (its edge lines up with the silhouette,
                # a bold one would bulge past it), shave the cap that bulges past the edge, round the inside corner
                b=outside.buffer(W/2,quad_segs=16,cap_style=1,join_style=1)
                near=b.intersection(G.buffer(1.5)).buffer(1)              # the join and its surroundings
                J=G.union(b)
                J=J.difference(J.difference(J.buffer(-.7,quad_segs=16).buffer(.7,quad_segs=16)).intersection(near))
                G=J.union(J.buffer(.4,quad_segs=16).buffer(-.4,quad_segs=16).intersection(near)); b=None
            elif n in NORMAL_WEIGHT or (not G.is_empty and not b.intersects(G) and b.distance(G)<GAP):
                b=outside.buffer(W/2,quad_segs=16,cap_style=1,join_style=1)
            if b is not None: G=G.union(b)
        for seg in getattr(inside,'geoms',[inside]):
            if seg.is_empty or seg.geom_type!='LineString' or seg.length<.3: continue
            G=cut_inside(G,seg,body,n)
    return G.buffer(-.35,quad_segs=16).buffer(.35,quad_segs=16)   # drop slivers + spikes thinner than 0.7 left by cuts

def cut_inside(G,seg,body,n,tol=.5):
    # a detail line inside a body is cut at 1.5; an end on the body edge (within tol) stops 1.5 short,
    # and every cut is clipped to the body shrunk by half a stroke, so a full stroke-wide edge band always
    # survives (gem's facet peak touches the top edge mid-line) - unless the icon cuts THROUGH the edge
    edge=body.boundary; keep=body.buffer(-W/2,quad_segs=16,join_style=1)
    c=list(seg.coords); a,b=0.0,seg.length; ext=[]
    for end,pos in ((Point(c[0]),'a'),(Point(c[-1]),'b')):
        if edge.distance(end)<tol:
            if n in THROUGH: ext.append(pos)
            elif pos=='a': a=min(1.5,seg.length/3)
            else: b=seg.length-min(1.5,seg.length/3)
    if ext:
        push=lambda p,q:(p[0]+(p[0]-q[0])/(math.dist(p,q) or 1)*2,p[1]+(p[1]-q[1])/(math.dist(p,q) or 1)*2)
        if 'a' in ext: c=[push(c[0],c[1])]+c
        if 'b' in ext: c=c+[push(c[-1],c[-2])]
        return G.difference(LS(c).buffer(W/2,quad_segs=16,cap_style=2,join_style=1))
    cut=substring(seg,a,b).buffer(W/2,quad_segs=16,cap_style=1,join_style=1).intersection(keep)
    # fill dents where clipped legs meet (closing, kept inside the band), then round its corners (rule 2)
    cut=cut.buffer(.35,quad_segs=16).buffer(-.35,quad_segs=16).intersection(keep)
    return G.difference(cut.buffer(-.35,quad_segs=16).buffer(.35,quad_segs=16))

def bold_glyph(d):
    # line glyph drawn bold; where one line passes over another (the stroke icon's crossing gap),
    # the lower piece is trimmed so the gap survives the extra weight
    subs=[ch for ch in chains(d) if ch]
    cls=[_pts(ch) for ch in subs]
    shp=[detail_shape(p,BOLD) if not (len(p)>2 and math.dist(p[0],p[-1])<1e-6) else Polygon(p).exterior.buffer(BOLD/2,quad_segs=16,join_style=1) for p in cls]
    cl=[LS(p) if len(p)>1 else Point(p[0]) for p in cls]
    ends=lambda g:[Point(g.coords[0]),Point(g.coords[-1])] if g.geom_type=='LineString' and not g.is_ring else ([g] if g.geom_type=='Point' else [])
    for i in range(len(shp)):
        for j in range(i+1,len(shp)):
            if cl[i].intersects(cl[j]) or cl[i].distance(cl[j])<.01 or shp[i].distance(shp[j])>=GAP: continue
            # trim the piece whose END crowds the other (cast frame end, history hand tip, shuffle crossing)
            di=min([e.distance(cl[j]) for e in ends(cl[i])] or [9]); dj=min([e.distance(cl[i]) for e in ends(cl[j])] or [9])
            k,o=(i,j) if di<=dj else (j,i)
            shp[k]=shp[k].difference(cl[o].buffer(BOLD/2+GAP,quad_segs=16))
    return unary_union(shp)

# ---- shapes drawn with open strokes: designed silhouettes -----------------------------------------
def gapped(g,cut_line,w):
    # g with a gap band around a line drawn at weight w (keeps separate parts visibly separate)
    return g.difference(line(cut_line,w+2*.75))
def book():
    d=src('book')
    cover=silhouette('M4.5 18.25V5.75A2.75 2.75 0 0 1 7.25 3H17.5a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H7.25A2.75 2.75 0 0 1 4.5 18.25Z')
    pages=area('M7.25 15.5H19.5V21H7.25a2.75 2.75 0 0 1 0-5.5Z').buffer(-W/2)       # white pages strip, outlined
    ribbon=substring(LS(_pts(chains(d[1])[0])),1.5,LS(_pts(chains(d[1])[0])).length-1.5)
    return cover.difference(pages).difference(ribbon.buffer(W/2,quad_segs=16))
def book_open():
    d=src('book-open'); spine=d[2]
    pages=silhouette(d[0]+'Z').union(silhouette(d[1]+'Z'))
    return pages.difference(line(extend(spine),W,'flat'))
def cast(): return bold_glyph(''.join(src('cast')))
def flag():
    d=src('flag'); return silhouette(d[0]+'Z').union(line(d[1],BOLD))
def flask():
    # the neck's own top closes the body (no extra rim); the liquid line stops short of the sides
    d=src('flask'); body=silhouette(d[1]+'Z')
    return cut_inside(body,LS(_pts(chains(d[2])[0])),area(d[1]+'Z'),'flask')
def folder_open():
    d=src('folder-open')[0]
    whole=area(d+'Z').union(area('M6 16.5L8.28 12.7Q9 11.5 10.4 11.5H19.75Q21.25 11.5 20.78 12.92L19.07 18.04Q18.5 19.75 16.7 19.75H6Z')).buffer(W/2,quad_segs=16,join_style=1)
    return whole.difference(line('M6 16.5L8.28 12.7Q9 11.5 10.4 11.5L19.75 11.5',W))
def headphones():
    cup='M3 14.25h3a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'
    # band centred 0.375 in from the cups' outer side so its bold edge lines up with the cups
    return silhouette(cup).union(silhouette(mirror_abs(cup))).union(line('M3.375 15V12a8.625 8.625 0 0 1 17.25 0v3',BOLD))
def hourglass():
    top=silhouette('M7 2.75V5.25C7 6.75 7.6 7.65 8.7 8.65L12 12L15.3 8.65C16.4 7.65 17 6.75 17 5.25V2.75Z')
    bot=silhouette('M7 21.25V18.75C7 17.25 7.6 16.35 8.7 15.35L12 12L15.3 15.35C16.4 16.35 17 17.25 17 18.75V21.25Z')
    return top.union(bot).union(line('M5 2.75h14M5 21.25h14',BOLD))
def pin():
    d=src('pin'); return silhouette(d[1]+'Z').union(line(d[0],BOLD)).union(line(d[2],BOLD))
def store():
    d=src('store'); awning=silhouette(d[0])
    body=gapped(silhouette(d[1]+'Z'),d[0],W).difference(awning)
    return awning.union(body).difference(line('M9.75 19.5v-1.75a2.25 2.25 0 0 1 4.5 0V19.5'))
def trash():
    d=src('trash'); can=silhouette(d[2]+'Z')
    can=can.difference(line(d[0],BOLD+2*.75))                        # gap under the lid
    return can.difference(line(d[3],W)).union(line(d[0],BOLD)).union(line(d[1],BOLD))
def umbrella():
    d=src('umbrella'); return silhouette(d[0]).union(line(d[1],BOLD))

def mirror_abs(d):
    # mirror a path left-right via its cubic chains (handles relative commands)
    out=''
    for ch in chains(d):
        out+=f"M{f(24-ch[0][0][0])} {f(ch[0][0][1])}"+''.join(f"C{f(24-c[1][0])} {f(c[1][1])} {f(24-c[2][0])} {f(c[2][1])} {f(24-c[3][0])} {f(c[3][1])}" for c in ch)
        if math.dist(ch[0][0],ch[-1][3])<1e-6: out+='Z'
    return out

def bike():
    # wheels bold; frame, seat and bars at stroke weight so the frame triangle keeps its shape
    s_=open('icons/bike.svg').read()
    wheels=unary_union([line(circle_path(float(a),float(b),float(r)),BOLD) for a,b,r in re.findall(r'<circle cx="([^"]+)" cy="([^"]+)" r="([^"]+)"',s_)])
    return wheels.union(line(''.join(src('bike')),W+.25))
def film():
    # solid strip with white perforations in the side strips (centre stays solid)
    frame=src('film')[0]; inner=area(frame).buffer(-W/2)
    holes=[]
    for x0,x1 in ((3.75,7.25),(16.75,20.25)):
        for y0,y1 in ((3.75,7.0),(8.5,11.25),(12.75,15.5),(17.0,20.25)):
            holes.append(area(f'M{x0} {y0}H{x1}V{y1}H{x0}Z'))
    return silhouette(frame).difference(unary_union(holes).intersection(inner).buffer(-.3).buffer(.3))
def clapperboard():
    # white stripes in the clapper and in the body's top band; the rest solid (Sarthak's reference)
    d=src('clapperboard'); body,band,bstripes,clap,cstripes=d
    body_in=area(body).buffer(-W/2); top=area(body).bounds[1]
    # stripes extended past the band and clipped to the stroke icon's white band: straight top + bottom
    band_zone=area(f'M0 {f(top)}H24V{f(top+4-W/2)}H0Z').intersection(body_in)
    g=silhouette(body).difference(line(extend(bstripes),W+.5,'flat').intersection(band_zone))
    return g.union(silhouette(clap).difference(line(extend(cstripes),W+.5,'flat').intersection(area(clap).buffer(-W/2))))

# "-off" icons: the base icon's solid, a gap band around the slash, the slash in bold
OFF={'wifi-off':'wifi','alarm-off':'alarm','bell-off':'bell','camera-off':'camera','eye-off':'eye','mic-off':'mic','phone-off':'phone',
     'shield-off':'shield','timer-off':'timer','video-off':'video'}
def off(n,base):
    slash=[d for d in src(n) if re.fullmatch(r'M[\d.]+ [\d.]+[lL][\d.\s-]+',d)][-1]
    g=area(''.join(re.findall(r' d="([^"]+)"',open(f'icons-solid/{base}.svg').read())))
    g=g.difference(line(slash,BOLD+2*.75)).union(line(slash,BOLD))
    return unary_union([p for p in getattr(g,'geoms',[g]) if p.area>1.5])      # drop crumbs the gap leaves

DESIGNED={n:fn for n,fn in list(globals().items()) if n in ('home','search','user','calendar','heart','bell','mail','settings')}
DESIGNED.update({'bike':bike,'film':film,'clapperboard':clapperboard,'book':book,'book-open':book_open,'cast':cast,'flag':flag,'flask':flask,'folder-open':folder_open,
                 'headphones':headphones,'hourglass':hourglass,'pin':pin,'store':store,'trash':trash,'umbrella':umbrella})

if __name__=='__main__':
    os.makedirs('icons-solid',exist_ok=True)
    for f_ in os.listdir('icons-solid'): os.remove(f'icons-solid/{f_}')
    lines=[]
    for fn in sorted(os.listdir('icons')):
        n=fn[:-4]; s=open(f'icons/{fn}').read(); ds=re.findall(r'<path d="([^"]+)"',s)
        if n in OFF: continue
        if n not in LINE_ICONS and (n in DESIGNED or n in SHAPES or '<circle' in s or any(re.search(r'[Zz]',d) for d in ds)): continue
        circ=''.join(circle_path(float(a),float(b),float(r)) for a,b,r in re.findall(r'<circle cx="([^"]+)" cy="([^"]+)" r="([^"]+)"',s))
        save(n,bold_glyph(''.join(ds)+circ)); lines.append(n)
    for n,fn in DESIGNED.items(): save(n,fn())
    autos=[]
    for fn in sorted(os.listdir('icons')):
        n=fn[:-4]
        if n in DESIGNED or n in SHAPES or n in lines or n in OFF: continue
        save(n,auto(n)); autos.append(n)
    for n,base in OFF.items(): save(n,off(n,base))      # after their bases exist
    todo=SHAPES-set(DESIGNED)-set(OFF)
    print(f'solid: {len(lines)} line glyphs + {len(DESIGNED)} designed + {len(autos)} automatic + {len(OFF)} off'+(f'; still to design: {sorted(todo)}' if todo else ''))
