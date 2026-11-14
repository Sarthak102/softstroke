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

def home(): return silhouette(src('home')[0])   # doorless since v4 (Sarthak's refs): plain silhouette
def search():
    return line('M10.69 3.06a7.6249 7.6249 0 1 0 0 15.25a7.6249 7.6249 0 1 0 0 -15.25Z',BOLD).union(line('M16.47 16.47l4.73 4.73',BOLD))
def user():
    return circle(12,7.26,3.95+W/2).union(silhouette(src('user')[0]))
def calendar():
    frame=src('calendar')[0]; outer=silhouette(frame)
    ring=outer.difference(area(frame).buffer(-(BOLD-W/2)))          # bold frame, same outer edge
    header=outer.intersection(area('M0 0H24V9.37H0Z'))                 # band above the header line, filled
    return ring.union(header).union(line('M7.79 2v3.16M16.21 2v3.16',BOLD))
def heart(): return silhouette(src('heart')[0])
def bell():
    # clapper at stroke weight, 0.25 lower than in the stroke icon: the silhouette's lip is wider
    b=src('bell'); return silhouette(b[0]).union(translate(line(b[1],W),0,.25))
def mail():
    m=src('mail'); return silhouette(m[0]).difference(line(extend(m[1]),W,'flat'))
def settings():
    return silhouette(src('settings')[0],.35).difference(circle(12,12,3.24))

# ---- automatic solid for everything not designed by hand ----------------------------------------
from shapely.geometry import LineString as LS
from shapely.ops import substring, linemerge
from shapely.affinity import translate
GAP=.6    # smallest gap between separate solid parts
HOLE=12   # inner closed shapes smaller than this (area) are cut as a solid shape; larger ones as a ring
THROUGH={'mail','magnet'}   # icons whose edge-to-edge detail lines cut through the edge instead of stopping short
# a single inner circle is cut out whole (one white circle, like the stroke's one circle), not as a ring around a dot
CUT_WHOLE={'banknote','camera','coins','cpu','fuel','disc','record','id-card','map-pin','radio','speaker','toggle','user-circle'}   # not target (nested rings) or eye (iris + pupil)
# glyph-like icons (and ones a fill would change: wheels -> balls, glasses -> sunglasses): solid = bold stroke
LINE_ICONS={'at-sign','bold','infinity','glasses','globe','earth'}
# outside details drawn at stroke weight: they meet fused lines, so they must match their weight
NORMAL_WEIGHT={'music','key'}
# lines crossing into the body that stay solid there (calendar rings: no white notch under them)
SOLID_CROSSING={'calendar-check','calendar-days','calendar-minus','calendar-plus','calendar-x'}

def parts(n,s=None):
    s=s or open(f'icons/{n}.svg').read()
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

def auto(n,svg=None):
    closed,open_=parts(n,svg)
    closed.sort(key=lambda g:-g.area)
    outer=[]; inner=[]
    for g in closed:
        (inner if any(o.buffer(.01).contains(g) for o in outer) else outer).append(g)
    G=unary_union([o.buffer(W/2,quad_segs=16,join_style=1) for o in outer]) if outer else Polygon()
    body=unary_union(outer) if outer else Polygon()
    for g in inner:
        # inner details are cut at their stroke footprint (same size as in the stroke icon):
        # small shapes (dots, pips, needles) as a solid white shape, larger ones as a white ring
        G=G.difference(g.buffer(W/2,quad_segs=16,join_style=1) if g.area<HOLE or n in CUT_WHOLE else g.exterior.buffer(W/2,quad_segs=16,join_style=1))
    edge=body.boundary if outer else None
    for pts in open_:
        if len(pts)<2 or LS(pts).length<.05:                       # glyph dot
            dot=detail_shape(pts,W)
            G=G.difference(dot) if outer and body.contains(Point(pts[0])) else G.union(detail_shape(pts,BOLD))
            continue
        ln=LS(pts)
        inside=ln.intersection(body) if outer else ln.intersection(Polygon())
        # floating-point wobble in the sampled points makes shapely split a straight line into fragments, and every
        # fragment would get its ends trimmed (radio's dial lines came out pinched and short): rejoin them first
        if inside.geom_type=='MultiLineString': inside=linemerge(inside)
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
        if n in SOLID_CROSSING and outside.length>.3: continue
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
    d=src('book'); foot=line(d[0]).union(line(d[1]))
    cover=outline(foot)
    pages=[Polygon(i) for p in getattr(foot,'geoms',[foot]) for i in p.interiors if Polygon(i).contains(Point(12,18.25))][0]
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
    whole=area(d+'Z').union(area('M5.51 16.86L7.98 12.76Q8.76 11.46 10.27 11.46H20.38Q22 11.46 21.49 12.99L19.64 18.53Q19.03 20.38 17.08 20.38H5.51Z')).buffer(W/2,quad_segs=16,join_style=1)
    return whole.difference(line('M5.51 16.86L7.98 12.76Q8.76 11.46 10.27 11.46L20.38 11.46',W))
def headphones():
    cup='M2.27 14.43h3.24a2.1636 2.1636 0 0 1 2.17 2.16v2.71a2.1636 2.1636 0 0 1 -2.17 2.16H4.43a2.1611 2.1611 0 0 1 -2.16 -2.16Z'
    # band centred 0.375 in from the cups' outer side so its bold edge lines up with the cups
    return silhouette(cup).union(silhouette(mirror_abs(cup))).union(line('M2.645 15.24V12a9.355 9.355 0 0 1 18.71 0v3.24',BOLD))
def hourglass():
    top=silhouette('M6.59 2V4.7C6.59 6.32 7.24 7.3 8.43 8.38L12 12L15.57 8.38C16.76 7.3 17.41 6.32 17.41 4.7V2Z')
    bot=silhouette('M6.59 22V19.3C6.59 17.68 7.24 16.7 8.43 15.62L12 12L15.57 15.62C16.76 16.7 17.41 17.68 17.41 19.3V22Z')
    return top.union(bot).union(line('M4.43 2h15.14M4.43 22h15.14',BOLD))
def pin():
    d=src('pin'); return silhouette(d[1]+'Z').union(line(d[0],BOLD)).union(line(d[2],BOLD))
def store():
    d=src('store'); awning=silhouette(d[0])
    body=gapped(silhouette(d[1]+'Z'),d[0],W).difference(awning)
    return awning.union(body).difference(line('M9.57 20.11v-1.89a2.4299 2.4299 0 0 1 4.86 0V20.11'))
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
    for x0,x1 in ((3.08,6.86),(17.14,20.92)):
        for y0,y1 in ((3.08,6.59),(8.22,11.19),(12.81,15.78),(17.41,20.92)):
            holes.append(area(f'M{x0} {y0}H{x1}V{y1}H{x0}Z'))
    return silhouette(frame).difference(unary_union(holes).intersection(inner).buffer(-.3).buffer(.3))
def clapperboard():
    # white stripes in the clapper and in the body's top band; the rest solid (Sarthak's reference)
    d=src('clapperboard'); body,band,bstripes,clap,cstripes=d
    body_in=area(body).buffer(-W/2); top=area(body).bounds[1]
    # stripes extended past the band and clipped to the stroke icon's white band: straight top + bottom
    band_zone=area(f'M0 {f(top)}H24V{f(top+4.21-W/2)}H0Z').intersection(body_in)
    g=silhouette(body).difference(line(extend(bstripes),W+.5,'flat').intersection(band_zone))
    return g.union(silhouette(clap).difference(line(extend(cstripes),W+.5,'flat').intersection(area(clap).buffer(-W/2))))

# "-off" icons: the base icon's solid built only from the parts the stroke -off icon still has,
# a gap band around the slash, the slash in bold; pieces the stroke -off icon doesn't draw are dropped
OFF={'wifi-off':'wifi','alarm-off':'alarm','bell-off':'bell','camera-off':'camera','eye-off':'eye','mic-off':'mic','phone-off':'phone',
     'shield-off':'shield','timer-off':'timer','video-off':'video'}
ELEM=r'<(?:path|circle) [^>]*/>'
OFF_OWN={'wifi-off'}   # drawn on its own geometry (shifted from wifi), so not derived from the base
def footprint(svg):
    g=[line(d) for d in re.findall(r' d="([^"]+)"',svg)]
    g+=[line(circle_path(float(a),float(b),float(r))) for a,b,r in re.findall(r'<circle cx="([^"]+)" cy="([^"]+)" r="([^"]+)"',svg)]
    return unary_union(g)
def off(n,base):
    offsvg=open(f'icons/{n}.svg').read()
    slash=[d for d in src(n) if re.fullmatch(r'M[\d.]+ [\d.]+[lL][\d.\s-]+',d)][-1]
    foot=footprint(offsvg.replace(f' d="{slash}"',' d="M0 0"'))          # what the -off icon draws, slash excluded
    if n in OFF_OWN: g=outline(bold_glyph(''.join(d for d in src(n) if d!=slash)))   # line icon: its own lines, bold, dot filled
    elif base in DESIGNED: g=DESIGNED[base]()
    else:
        # base elements the -off icon no longer draws (alarm/timer hands) are left out before solidifying
        bs=open(f'icons/{base}.svg').read()
        keep=[e for e in re.findall(ELEM,bs) if footprint(e).intersection(foot).area>.15*footprint(e).area]
        g=auto(base,'<svg>'+''.join(keep)+'</svg>')
    g=g.difference(line(slash,BOLD+2*.75))
    near=foot.buffer(1)
    # keep a piece only if most of its outline follows the stroke -off icon (drops the left alarm ear)
    g=unary_union([p for p in getattr(g,'geoms',[g]) if p.area>1.5 and p.exterior.intersection(near).length>.5*p.exterior.length])
    return g.buffer(-.35,quad_segs=16).buffer(.35,quad_segs=16).union(line(slash,BOLD))   # no thin tips at the gap

LAYER_GAP=.75   # gap between a part and the part in front of it
def outline(g): return unary_union([Polygon(p.exterior) for p in getattr(g,'geoms',[g])])
def layered(n,layers):
    # front-to-back list of svg element subsets; each layer is solidified on its own (details cut as usual)
    # and loses a LAYER_GAP band around everything in front of it, so the outer edges stay the stroke's
    out=Polygon(); front=Polygon()
    for svg in layers:
        g=auto(n,'<svg>'+svg+'</svg>').difference(front.buffer(LAYER_GAP,quad_segs=16))
        if not front.is_empty: g=g.buffer(-.35,quad_segs=16).buffer(.35,quad_segs=16)   # no thin tips where it tapers
        out=out.union(g); front=front.union(outline(g))
    return out
P=lambda d:f'<path d="{d}"/>'
def cloud_sun():
    # sun = disc behind the cloud, dots at stroke weight (bold dots fused with the arc into a gear)
    d=src('cloud-sun'); cloud=silhouette(d[0])
    dots=unary_union([detail_shape(p,W) for p in [_pts(ch) for ch in chains(d[2]) if ch]])
    return cloud.union(circle(8.32,8.58,3.95).difference(cloud.buffer(LAYER_GAP,quad_segs=16))).union(dots)
def wallet():
    d=src('wallet')
    flap=re.sub(r'L[\d.]+ [\d.]+$','',d[1])+'L13.35 8.76L2 8.76Z'                       # closed behind the body
    return layered('wallet',[P(d[2]),P(d[0]+'Z')+P(d[3]),P(flap)])
def clipboard():
    d=src('clipboard'); return layered('clipboard',[P(d[1]),P(d[0]+'Z')+P(d[2])])
def coins():
    return layered('coins',['<circle cx="9.3" cy="9.3" r="7.3"/><circle cx="9.3" cy="9.3" r="3.51"/>','<circle cx="14.7" cy="14.7" r="7.3"/>'])
def copy():
    d=src('copy'); return layered('copy',[P(d[0]),P(d[1]+'L7.68 7.68Z')])
def images():
    d=src('images'); s_=open('icons/images.svg').read()
    sun=re.findall(r'<circle [^>]*/>',s_)[0]
    return layered('images',[P(d[0])+P(d[2])+sun,P(d[1]+'L7.53 7.26Z')])
def pie_chart():
    # three-quarter disc behind the slice; its cut edges sit where the stroke arc's caps end
    d=src('pie-chart'); slice_=auto('pie-chart','<svg>'+P(d[1])+'</svg>')
    from shapely.geometry import box
    disc=circle(11.47,12.53,9.47+W/2).difference(box(10.3,0,24,13.7))
    disc=disc.buffer(-.75,quad_segs=16).buffer(.75,quad_segs=16)                  # soft outer corners
    disc=disc.buffer(1,quad_segs=16).buffer(-1,quad_segs=16)                       # soft centre corner (was sharp, Sarthak 2026-11-14)
    return slice_.union(disc.difference(outline(slice_).buffer(LAYER_GAP)))

def bug():
    # the stroke head is an open arc on the body line: auto() drew it as a bold line with a white inside the
    # antennae poked into (Sarthak 2026-11-14); here the head is a filled dome behind the body, antennae fused on
    d=src('bug'); return layered('bug',[P(d[0])+P(d[3])+P(d[4]),P(d[1]+'Z')+P(d[2])])
def database():
    # filled cylinder (top ellipse + body closed across the top); rim and middle lines cut inside, stopping short
    d=src('database'); body=area(d[0]).union(area(d[1]+'Z'))
    g=body.buffer(W/2,quad_segs=16,join_style=1)
    for ln in ('M20.65 4.97c0 1.65 -3.87 2.98 -8.65 2.98S3.35 6.62 3.35 4.97',d[2]):
        g=cut_inside(g,LS(_pts(chains(ln)[0])),body,'database')
    return g
def printer():
    # front to back: page, body (closed under the page, indicator cut), top paper; gaps between, no nubs
    d=src('printer'); return layered('printer',[P(d[2]),P(d[0]+'Z')+P(d[3]),P(d[1]+'Z')])
def ship():
    # hull in front of the cabin in front of the funnel: each closed against the part below it, gaps between
    d=src('ship'); return layered('ship',[P(d[0]),P(d[1]+'Z'),P(d[2]+'Z')])
def award():
    # medal in front of the ribbon (closed under the medal): the tails read solid, not as outlines
    d=src('award'); s_=open('icons/award.svg').read()
    return layered('award',[re.findall(r'<circle [^>]*/>',s_)[0],P(d[0]+'Z')])
def graduation_cap():
    # cap (and tassel) in front of the band (closed under the cap)
    d=src('graduation-cap'); return layered('graduation-cap',[P(d[0])+P(d[2]),P(d[1]+'Z')])
def fuel():
    # pump body is open at the base in the stroke icon: closed along the base so it fills; window cut whole
    d=src('fuel'); return auto('fuel','<svg>'+P(d[0]+'Z')+''.join(P(x) for x in d[1:])+'</svg>')
# bodies drawn open in the stroke icon (gaps for wheels, lid, plus) never filled in auto(): closed here
def truck():
    # wheels in front of the cargo box in front of the cab, gaps between
    d=src('truck'); s_=open('icons/truck.svg').read()
    return layered('truck',[''.join(re.findall(r'<circle [^>]*/>',s_)),P(d[0]+'Z'),P(d[2]+'L14.11 18.32Z')])
def archive():
    d=src('archive'); return layered('archive',[P(d[0]),P(d[1]+'Z')+P(d[2])])
def cart():
    # basket closed on its own (its left side runs along the handle's line); handle stays a line
    s_=open('icons/cart.svg').read()
    basket='M5.14 6.32L6.69 13.02Q7.08 14.7 8.81 14.7L17.95 14.7Q19.68 14.7 20.14 13.04L21.6 7.78Q22 6.32 20.49 6.32Z'
    return auto('cart','<svg>'+P(basket)+P('M2.27 2.81L3.3 2.81Q4.32 2.81 4.62 4.08L5.14 6.32')+''.join(re.findall(r'<circle [^>]*/>',s_))+'</svg>')
def gift():
    # lid + bow in front of the box; the ribbon is cut inside the box
    d=src('gift'); return layered('gift',[P(d[0])+P(d[3])+P(d[4]),P(d[1]+'Z')+P(d[2])])
def image_plus():
    # the image solid (same frame as image) behind the plus, gap between
    d=src('image-plus'); s_=open('icons/image-plus.svg').read()
    g=layered('image-plus',[P(d[2]),P(src('image')[0])+P(d[1])+re.findall(r'<circle [^>]*/>',s_)[0]])
    return unary_union([p for p in getattr(g,'geoms',[g]) if p.area>1.5])   # drop the frame-corner crumb beside the plus
def rocket():
    # fins are open strokes drawn bold; since v1.1 they no longer fill the pocket against the body: fill it
    g=auto('rocket')
    return unary_union([Polygon(p.exterior,[i for i in p.interiors if Polygon(i).area>3]) for p in getattr(g,'geoms',[g])])

DESIGNED={n:fn for n,fn in list(globals().items()) if n in ('home','search','user','calendar','heart','bell','mail','settings')}
DESIGNED.update({'cloud-sun':cloud_sun,'rocket':rocket,'bug':bug,'database':database,'award':award,'truck':truck,'archive':archive,'cart':cart,'gift':gift,'image-plus':image_plus,'fuel':fuel,'graduation-cap':graduation_cap,'printer':printer,'ship':ship,'wallet':wallet,'clipboard':clipboard,'coins':coins,'copy':copy,'images':images,'pie-chart':pie_chart,'bike':bike,'film':film,'clapperboard':clapperboard,'book':book,'book-open':book_open,'cast':cast,'flag':flag,'flask':flask,'folder-open':folder_open,
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
