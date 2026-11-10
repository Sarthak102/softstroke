import math, sys, re
f=lambda v: f"{v:.2f}".rstrip('0').rstrip('.')
def squircle(x,y,w,h,E):
    # continuous-curvature corner: two cubics per corner, extent E along each edge
    a,b,m=0.529*E,0.293*E,0.146*E
    X,Y=x+w,y+h
    d=f"M{f(x+E)} {f(y)}H{f(X-E)}"
    d+=f"C{f(X-a)} {f(y)} {f(X-b)} {f(y)} {f(X-m)} {f(y+m)}C{f(X)} {f(y+b)} {f(X)} {f(y+a)} {f(X)} {f(y+E)}V{f(Y-E)}"
    d+=f"C{f(X)} {f(Y-a)} {f(X)} {f(Y-b)} {f(X-m)} {f(Y-m)}C{f(X-b)} {f(Y)} {f(X-a)} {f(Y)} {f(X-E)} {f(Y)}H{f(x+E)}"
    d+=f"C{f(x+a)} {f(Y)} {f(x+b)} {f(Y)} {f(x+m)} {f(Y-m)}C{f(x)} {f(Y-b)} {f(x)} {f(Y-a)} {f(x)} {f(Y-E)}V{f(y+E)}"
    d+=f"C{f(x)} {f(y+a)} {f(x)} {f(y+b)} {f(x+m)} {f(y+m)}C{f(x+b)} {f(y)} {f(x+a)} {f(y)} {f(x+E)} {f(y)}Z"
    return d
def soft(pts,rad,closed=True):
    # polyline/polygon with every vertex rounded by a quadratic through it; rad: number or per-vertex list
    n=len(pts); out=[]
    rads=rad if isinstance(rad,list) else [rad]*n
    for i in range(n):
        if not closed and i in (0,n-1): continue
        p0,p1,p2=pts[i-1],pts[i],pts[(i+1)%n]
        R=rads[i]
        def cut(a,b):
            dx,dy=a[0]-b[0],a[1]-b[1]; L=math.hypot(dx,dy); t=min(R,L/2)/L; return (b[0]+dx*t,b[1]+dy*t)
        s,e=cut(p0,p1),cut(p2,p1)
        out.append((s,p1,e))
    if closed:
        d=f"M{f(out[0][0][0])} {f(out[0][0][1])}"
    else:
        d=f"M{f(pts[0][0])} {f(pts[0][1])}L{f(out[0][0][0])} {f(out[0][0][1])}"
    for i,(s,c,e) in enumerate(out):
        if i: d+=f"L{f(s[0])} {f(s[1])}"
        d+=f"Q{f(c[0])} {f(c[1])} {f(e[0])} {f(e[1])}"
    return d+("Z" if closed else f"L{f(pts[-1][0])} {f(pts[-1][1])}")
def gear(R=9,r=6.9,n=8,tip=12,root=17,rad=1.1,steps=3):
    P=lambda rr,deg:(12+rr*math.cos(math.radians(deg-90)),12+rr*math.sin(math.radians(deg-90)))
    pts=[]
    for i in range(n):
        a=i*360/n
        pts+= [P(r,a-root),P(R,a-tip),P(R,a+tip),P(r,a+root)]
        for k in range(1,steps): pts.append(P(r,a+root+(360/n-2*root)*k/steps))
    return soft(pts,rad)

def smooth(pts,E,closed=False):
    # polyline with squircle (continuous-curvature) corners of extent E at every right-angle vertex
    def unit(a,b):
        dx,dy=b[0]-a[0],b[1]-a[1]; L=math.hypot(dx,dy); return (dx/L,dy/L)
    n=len(pts); idx=range(n) if closed else range(1,n-1)
    a,b,m=0.529*E,0.293*E,0.146*E
    segs=[]
    for i in idx:
        p0,p1,p2=pts[i-1],pts[i],pts[(i+1)%n]
        u,v=unit(p0,p1),unit(p1,p2)
        P=lambda du,dv:(p1[0]+u[0]*du+v[0]*dv,p1[1]+u[1]*du+v[1]*dv)
        s,c1,c2,mid,c3,c4,e=P(-E,0),P(-a,0),P(-b,0),P(-m,m),P(0,b),P(0,a),P(0,E)
        segs.append(f"L{f(s[0])} {f(s[1])}C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(mid[0])} {f(mid[1])}C{f(c3[0])} {f(c3[1])} {f(c4[0])} {f(c4[1])} {f(e[0])} {f(e[1])}")
    if closed:
        first=segs[0].split('C')[0][1:]
        return "M"+first+"".join(segs)[len("L"+first):]+"Z"
    return f"M{f(pts[0][0])} {f(pts[0][1])}"+"".join(segs)+f"L{f(pts[-1][0])} {f(pts[-1][1])}"

def rot(pts,deg):
    # rotate points about the canvas centre (12,12); 90 = clockwise quarter turn
    c,s_=math.cos(math.radians(deg)),math.sin(math.radians(deg))
    return [(round(12+(x-12)*c-(y-12)*s_,4),round(12+(x-12)*s_+(y-12)*c,4)) for x,y in pts]

def line(pts):
    return "M"+"L".join(f"{f(x)} {f(y)}" for x,y in pts)

def arrow_head(tip,d,arm,rad=1.6):
    # Soft 90-degree arrowhead pointing along unit vector d. Returns (path, apex): end the shaft/arc
    # exactly at apex (where the softened curve peaks), or its round cap pokes out past the tip.
    L=math.hypot(*d); d=(d[0]/L,d[1]/L); k=math.sqrt(0.5)
    u1=(-d[0]*k-d[1]*k,-d[1]*k+d[0]*k); u2=(-d[0]*k+d[1]*k,-d[1]*k-d[0]*k)
    pts=[(tip[0]+u1[0]*arm,tip[1]+u1[1]*arm),tip,(tip[0]+u2[0]*arm,tip[1]+u2[1]*arm)]
    o=0.5*rad*k
    return soft(pts,rad,False),(tip[0]-d[0]*o,tip[1]-d[1]*o)

def _split(c,t0,t1):
    # sub-curve of cubic c between t0 and t1 (de Casteljau)
    def at(c,t):
        a=[(c[i][0]+(c[i+1][0]-c[i][0])*t,c[i][1]+(c[i+1][1]-c[i][1])*t) for i in range(3)]
        b=[(a[i][0]+(a[i+1][0]-a[i][0])*t,a[i][1]+(a[i+1][1]-a[i][1])*t) for i in range(2)]
        m=(b[0][0]+(b[1][0]-b[0][0])*t,b[0][1]+(b[1][1]-b[0][1])*t)
        return [c[0],a[0],b[0],m],[m,b[1],a[2],c[3]]
    _,right=at(c,t0)
    if t1>=1: return right
    left,_=at(right,(t1-t0)/(1-t0))
    return left

def _pt(c,t):
    u=1-t
    return (u**3*c[0][0]+3*u*u*t*c[1][0]+3*u*t*t*c[2][0]+t**3*c[3][0],u**3*c[0][1]+3*u*u*t*c[1][1]+3*u*t*t*c[2][1]+t**3*c[3][1])

def cut(cubics,a,b,gap,min_len=2.0):
    # Remove every part of a chain of cubics that lies within `gap` of the infinite line through a,b.
    # Used for slashed icons (eye-off ...): the slash gets clean breaks instead of crossing strokes.
    dx,dy=b[0]-a[0],b[1]-a[1]; L=math.hypot(dx,dy)
    near=lambda p:abs((p[0]-a[0])*dy-(p[1]-a[1])*dx)/L<gap
    pieces=[]; cur=[]
    for c in cubics:
        N=400; ts=[i/N for i in range(N+1)]; inside=[near(_pt(c,t)) for t in ts]
        def edge(i):  # refine the crossing between ts[i-1] and ts[i]
            lo,hi=ts[i-1],ts[i]
            for _ in range(40):
                mid=(lo+hi)/2
                if near(_pt(c,mid))==inside[i-1]: lo=mid
                else: hi=mid
            return (lo+hi)/2
        start=None if inside[0] else 0.0
        for i in range(1,N+1):
            if inside[i]!=inside[i-1]:
                t=edge(i)
                if inside[i]:  # leaving the kept region
                    cur.append(_split(c,start,t)); pieces.append(cur); cur=[]; start=None
                else: start=t
        if start is not None: cur.append(_split(c,start,1.0) if start>0 else c)
    if cur:
        # a closed chain that started inside a kept run: join the last run onto the first
        if pieces and not near(_pt(cubics[0],0)) and _pt(cubics[0],0)==_pt(cubics[-1],1): pieces[0]=cur+pieces[0]
        else: pieces.append(cur)
    def length(run):
        pts=[_pt(c,t/20) for c in run for t in range(21)]
        return sum(math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]) for i in range(len(pts)-1))
    pieces=[r for r in pieces if length(r)>=min_len]  # leftover stubs beside the slash read as noise
    out=""
    for run in pieces:
        out+=f"M{f(run[0][0][0])} {f(run[0][0][1])}"+"".join(f"C{f(c[1][0])} {f(c[1][1])} {f(c[2][0])} {f(c[2][1])} {f(c[3][0])} {f(c[3][1])}" for c in run)
    return out

def circle_cubics(cx,cy,r):
    k=0.5523*r
    return [[(cx+r,cy),(cx+r,cy+k),(cx+k,cy+r),(cx,cy+r)],[(cx,cy+r),(cx-k,cy+r),(cx-r,cy+k),(cx-r,cy)],
            [(cx-r,cy),(cx-r,cy-k),(cx-k,cy-r),(cx,cy-r)],[(cx,cy-r),(cx+k,cy-r),(cx+r,cy-k),(cx+r,cy)]]

def outline(pts,spec):
    # closed outline with a per-vertex corner: ('s',E) = squircle corner (right angles), number = soft quadratic radius
    n=len(pts); segs=[]
    def unit(a,b):
        dx,dy=b[0]-a[0],b[1]-a[1]; L=math.hypot(dx,dy); return (dx/L,dy/L),L
    for i in range(n):
        p0,p1,p2=pts[i-1],pts[i],pts[(i+1)%n]
        (u,L1),(v,L2)=unit(p0,p1),unit(p1,p2)
        P=lambda du,dv:(p1[0]+u[0]*du+v[0]*dv,p1[1]+u[1]*du+v[1]*dv)
        sp=spec[i]
        if isinstance(sp,tuple):
            E=sp[1]; a,b,m=0.529*E,0.293*E,0.146*E
            st,c1,c2,mid,c3,c4,e=P(-E,0),P(-a,0),P(-b,0),P(-m,m),P(0,b),P(0,a),P(0,E)
            segs.append((st,f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(mid[0])} {f(mid[1])}C{f(c3[0])} {f(c3[1])} {f(c4[0])} {f(c4[1])} {f(e[0])} {f(e[1])}"))
        else:
            R=min(sp,L1/2,L2/2); st,e=P(-R,0),P(0,R)
            segs.append((st,f"Q{f(p1[0])} {f(p1[1])} {f(e[0])} {f(e[1])}"))
    d=f"M{f(segs[0][0][0])} {f(segs[0][0][1])}"
    for i,(st,curve) in enumerate(segs):
        if i: d+=f"L{f(st[0])} {f(st[1])}"
        d+=curve
    return d+"Z"

def seg(a,b):
    # straight segment as a cubic, for cut()
    return [a,(a[0]+(b[0]-a[0])/3,a[1]+(b[1]-a[1])/3),(a[0]+2*(b[0]-a[0])/3,a[1]+2*(b[1]-a[1])/3),b]

def mirror(d):
    # flip an absolute-command path left-right (x -> 24-x); arcs flip their sweep flag
    toks=re.findall(r'[MLHVCSQTAZ]|-?\d*\.?\d+(?:e-?\d+)?',d)
    out=[]; i=0; cmd=None
    arity={'M':2,'L':2,'H':1,'V':1,'C':6,'S':4,'Q':4,'T':2,'A':7,'Z':0}
    while i<len(toks):
        t=toks[i]
        if t.isalpha():
            if t!=t.upper(): raise ValueError('mirror() needs absolute commands')
            cmd=t; out.append(t); i+=1
            if cmd=='Z': continue
        n=arity[cmd]; v=[float(x) for x in toks[i:i+n]]; i+=n
        if cmd=='H': v[0]=24-v[0]
        elif cmd=='A': v[4]=1-v[4]; v[5]=24-v[5]
        elif cmd!='V':
            for k in range(0,n,2): v[k]=24-v[k]
        out.append(' '.join(f(x) for x in v))
    return ''.join(out)

def _arc_to_cubics(p0,rx,ry,phi,large,sweep,p1):
    # SVG endpoint arc -> cubic segments (circular/elliptic, rotation phi in degrees)
    if p0==p1: return []
    ph=math.radians(phi); c,s_=math.cos(ph),math.sin(ph)
    dx,dy=(p0[0]-p1[0])/2,(p0[1]-p1[1])/2; x1=c*dx+s_*dy; y1=-s_*dx+c*dy
    rx,ry=abs(rx),abs(ry); lam=x1*x1/(rx*rx)+y1*y1/(ry*ry)
    if lam>1: rx*=math.sqrt(lam); ry*=math.sqrt(lam)
    num=rx*rx*ry*ry-rx*rx*y1*y1-ry*ry*x1*x1; den=rx*rx*y1*y1+ry*ry*x1*x1
    k=math.sqrt(max(0,num/den))*(-1 if large==sweep else 1)
    cx1,cy1=k*rx*y1/ry,-k*ry*x1/rx
    cx=c*cx1-s_*cy1+(p0[0]+p1[0])/2; cy=s_*cx1+c*cy1+(p0[1]+p1[1])/2
    ang=lambda ux,uy,vx,vy:math.atan2(ux*vy-uy*vx,ux*vx+uy*vy)
    t1=ang(1,0,(x1-cx1)/rx,(y1-cy1)/ry); dt=ang((x1-cx1)/rx,(y1-cy1)/ry,(-x1-cx1)/rx,(-y1-cy1)/ry)
    if not sweep and dt>0: dt-=2*math.pi
    if sweep and dt<0: dt+=2*math.pi
    n=max(1,math.ceil(abs(dt)/(math.pi/2)-1e-9)); d=dt/n; kk=4/3*math.tan(d/4); out=[]
    P=lambda t:(cx+rx*math.cos(t)*c-ry*math.sin(t)*s_,cy+rx*math.cos(t)*s_+ry*math.sin(t)*c)
    D=lambda t:(-rx*math.sin(t)*c-ry*math.cos(t)*s_,-rx*math.sin(t)*s_+ry*math.cos(t)*c)
    for i in range(n):
        a,b=t1+i*d,t1+(i+1)*d; pa,pb,da,db=P(a),P(b),D(a),D(b)
        out.append([pa,(pa[0]+kk*da[0],pa[1]+kk*da[1]),(pb[0]-kk*db[0],pb[1]-kk*db[1]),pb])
    out[0][0]=p0; out[-1][3]=p1
    return out

def chains(d):
    # any SVG path (abs/rel M L H V C S Q A Z) -> list of cubic chains, one per subpath
    toks=re.findall(r'[MmLlHhVvCcSsQqAaZz]|-?\d*\.?\d+(?:e-?\d+)?',d)
    ar={'m':2,'l':2,'h':1,'v':1,'c':6,'s':4,'q':4,'a':7,'z':0}
    res=[]; cur=[]; pos=(0.0,0.0); start=pos; last_c=None; i=0; cmd=None
    while i<len(toks):
        if toks[i].isalpha(): cmd=toks[i]; i+=1
        lc=cmd.lower(); rel=cmd.islower(); n=ar[lc]
        if lc=='z':
            if pos!=start: cur.append(seg(pos,start))
            pos=start; res.append(cur); cur=[]; last_c=None; continue
        v=[float(x) for x in toks[i:i+n]]; i+=n
        def P(x,y): return (pos[0]+x,pos[1]+y) if rel else (x,y)
        if lc=='m':
            if cur: res.append(cur); cur=[]
            pos=start=P(*v); cmd='l' if rel else 'L'; last_c=None
        elif lc=='l': q=P(*v); cur.append(seg(pos,q)); pos=q; last_c=None
        elif lc=='h': q=(pos[0]+v[0] if rel else v[0],pos[1]); cur.append(seg(pos,q)); pos=q; last_c=None
        elif lc=='v': q=(pos[0],pos[1]+v[0] if rel else v[0]); cur.append(seg(pos,q)); pos=q; last_c=None
        elif lc=='c':
            c1,c2,q=P(v[0],v[1]),P(v[2],v[3]),P(v[4],v[5]); cur.append([pos,c1,c2,q]); last_c=c2; pos=q
        elif lc=='s':
            c1=(2*pos[0]-last_c[0],2*pos[1]-last_c[1]) if last_c else pos
            c2,q=P(v[0],v[1]),P(v[2],v[3]); cur.append([pos,c1,c2,q]); last_c=c2; pos=q
        elif lc=='q':
            c,q=P(v[0],v[1]),P(v[2],v[3])
            cur.append([pos,(pos[0]+2/3*(c[0]-pos[0]),pos[1]+2/3*(c[1]-pos[1])),(q[0]+2/3*(c[0]-q[0]),q[1]+2/3*(c[1]-q[1])),q]); pos=q; last_c=None
        elif lc=='a':
            q=P(v[5],v[6]); cur+=_arc_to_cubics(pos,v[0],v[1],v[2],int(v[3]),int(v[4]),q); pos=q; last_c=None
    if cur: res.append(cur)
    return res

def cut_path(d,a,b,gap=2.25):
    # cut any path around the slash line a-b (rule 8)
    return "".join(cut(ch,a,b,gap) for ch in chains(d))

def circle_path(cx,cy,r):
    return f"M{f(cx+r)} {f(cy)}A{f(r)} {f(r)} 0 1 1 {f(cx-r)} {f(cy)}A{f(r)} {f(r)} 0 1 1 {f(cx+r)} {f(cy)}Z"

if __name__=="__main__":
    print(eval(sys.argv[1]))

def stroke_outline(d,w=2.25,tol=.02,outer=False):
    # Outline of a stroked path as fill-only polygons (round caps + joins), for filled twins of line icons.
    # Sides are offset samples with self-intersection loops cut; all outlines wind the same way, so
    # overlapping strokes union under the default nonzero fill rule. Closed subpaths become rings;
    # outer=True keeps only a closed subpath's outer edge (the stroke icon's silhouette, for filled twins).
    h=w/2; out=''
    def sample(ch):
        pts=[]
        for c in ch:
            L=sum(math.dist(_pt(c,i/8),_pt(c,(i+1)/8)) for i in range(8)); n=max(2,int(L/.08))
            for i in range(n+1):
                p=_pt(c,i/n)
                if not pts or math.dist(p,pts[-1])>1e-6: pts.append(p)
        return pts
    def arc(c,a0,a1):
        n=max(1,int(abs(a1-a0)/math.radians(12)))
        return [(c[0]+h*math.cos(a0+(a1-a0)*k/n),c[1]+h*math.sin(a0+(a1-a0)*k/n)) for k in range(n+1)]
    def side(pts,s,closed):
        # offset one side (s=+1 left, -1 right); outer joins get a round arc
        m=len(pts); segs=[(pts[i],pts[(i+1)%m]) for i in range(m if closed else m-1)]
        nrm=lambda a,b:((a[1]-b[1])/math.dist(a,b),(b[0]-a[0])/math.dist(a,b))
        res=[]
        for k,(a,b) in enumerate(segs):
            n=nrm(a,b)
            if k or closed:
                pa,pb=segs[k-1]; n0=nrm(pa,pb)
                cross=(pb[0]-pa[0])*(b[1]-a[1])-(pb[1]-pa[1])*(b[0]-a[0])
                if cross*s<0:  # this side is outer: round join
                    a0,a1=math.atan2(s*n0[1],s*n0[0]),math.atan2(s*n[1],s*n[0])
                    while a1-a0>math.pi: a1-=2*math.pi
                    while a1-a0<-math.pi: a1+=2*math.pi
                    res+=arc(a,a0,a1)[1:-1]
            res+=[(a[0]+s*h*n[0],a[1]+s*h*n[1]),(b[0]+s*h*n[0],b[1]+s*h*n[1])]
        return unloop(res)
    def unloop(P,W=80):
        def X(p1,p2,p3,p4):
            d=(p2[0]-p1[0])*(p4[1]-p3[1])-(p2[1]-p1[1])*(p4[0]-p3[0])
            if abs(d)<1e-12: return None
            t=((p3[0]-p1[0])*(p4[1]-p3[1])-(p3[1]-p1[1])*(p4[0]-p3[0]))/d
            u=((p3[0]-p1[0])*(p2[1]-p1[1])-(p3[1]-p1[1])*(p2[0]-p1[0]))/d
            return (p1[0]+t*(p2[0]-p1[0]),p1[1]+t*(p2[1]-p1[1])) if 0<t<1 and 0<u<1 else None
        i=0
        while i<len(P)-3:
            for j in range(min(len(P)-2,i+W),i+1,-1):
                x=X(P[i],P[i+1],P[j],P[j+1])
                if x: P=P[:i+1]+[x]+P[j+1:]; break
            i+=1
        return P
    def rdp(P):
        if len(P)<3: return P
        a,b=P[0],P[-1]; L=math.dist(a,b) or 1e-9
        k,dm=0,0
        for i in range(1,len(P)-1):
            dd=abs((b[0]-a[0])*(a[1]-P[i][1])-(a[0]-P[i][0])*(b[1]-a[1]))/L
            if dd>dm: k,dm=i,dd
        return rdp(P[:k+1])[:-1]+rdp(P[k:]) if dm>tol else [a,b]
    poly=lambda P:"M"+"L".join(f"{f(x)} {f(y)}" for x,y in rdp(P))+"Z"
    for ch in chains(d):
        pts=sample(ch); closed=len(ch)>0 and math.dist(_pt(ch[0],0),_pt(ch[-1],1))<1e-6
        if len(pts)<2 or sum(math.dist(pts[i],pts[i+1]) for i in range(len(pts)-1))<.05:  # glyph dot
            c=pts[0]; out+=poly(arc(c,0,2*math.pi)[:-1]); continue
        if closed:
            pts=pts[:-1] if math.dist(pts[0],pts[-1])<1e-6 else pts
            a,b=side(pts,1,True),side(pts,-1,True)
            area=lambda P:abs(sum(P[i][0]*P[i-1][1]-P[i-1][0]*P[i][1] for i in range(len(P))))
            out+=poly(max(a,b,key=area)) if outer else poly(a)+poly(b[::-1]); continue
        L,Rr=side(pts,1,False),side(pts,-1,False)
        a,b=pts[-2],pts[-1]; ad=math.atan2(b[1]-a[1],b[0]-a[0])
        a2,b2=pts[0],pts[1]; sd=math.atan2(b2[1]-a2[1],b2[0]-a2[0])
        # caps: sweep from one side to the other through the stroke direction
        end=arc(b,ad+math.pi/2,ad-math.pi/2); start=arc(a2,sd-math.pi/2,sd-3*math.pi/2)
        out+=poly(L+end[1:-1]+Rr[::-1]+start[1:-1])
    return out

def fillet(d,r=.8,angle=20):
    # Round every sharp vertex (direction change > angle deg, closing joins too) with a curve tangent to
    # both sides, trimming each side back by r of arc length (at most half its length). Style rule 2.
    # Output is an absolute cubic path. Used to fix joins found by scripts/lint_joins.py.
    def L(c,t0=0,t1=1,n=24):
        return sum(math.dist(_pt(c,t0+(t1-t0)*i/n),_pt(c,t0+(t1-t0)*(i+1)/n)) for i in range(n))
    def at_len(c,s,from_end):
        # t where the arc length from the chosen end equals s
        lo,hi=0,1
        for _ in range(40):
            m=(lo+hi)/2; v=L(c,m,1) if from_end else L(c,0,m)
            if (v>s)==from_end: lo=m
            else: hi=m
        return (lo+hi)/2
    def tan(c,t):
        e=1e-4; a,b=_pt(c,max(0,t-e)),_pt(c,min(1,t+e)); l=math.dist(a,b) or 1
        return ((b[0]-a[0])/l,(b[1]-a[1])/l)
    def sharp(a,b):
        t1,t2=tan(a,1),tan(b,0)
        return abs(math.degrees(math.atan2(t1[0]*t2[1]-t1[1]*t2[0],t1[0]*t2[0]+t1[1]*t2[1])))>angle
    out=''
    for ch in chains(d):
        ch=[c for c in ch if L(c)>1e-4]
        if not ch: continue
        closed=math.dist(ch[0][0],ch[-1][3])<1e-6; n=len(ch)
        js=[i for i in range(n-1 if not closed else n) if sharp(ch[i],ch[(i+1)%n])]
        trim={i:[0.0,1.0] for i in range(n)}
        for i in js:
            j=(i+1)%n
            s=min(r,L(ch[i])/2,L(ch[j])/2)
            trim[i][1]=at_len(ch[i],s,True); trim[j][0]=at_len(ch[j],s,False)
        segs=[]
        for i in range(n):
            c=ch[i]; t0,t1=trim[i]
            segs.append(('c',_split(c,t0,t1) if (t0,t1)!=(0,1) else c))
            if i in js:
                j=(i+1)%n; p,q=_pt(c,t1),_pt(ch[j],trim[j][0])
                u,v=tan(c,t1),tan(ch[j],trim[j][0]); k=.55*max(math.dist(p,q),.3)
                segs.append(('c',[p,(p[0]+u[0]*k,p[1]+u[1]*k),(q[0]-v[0]*k,q[1]-v[1]*k),q]))
        start=segs[0][1][0]
        out+=f"M{f(start[0])} {f(start[1])}"+''.join(f"C{f(c[1][0])} {f(c[1][1])} {f(c[2][0])} {f(c[2][1])} {f(c[3][0])} {f(c[3][1])}" for _,c in segs)+("Z" if closed else "")
    return out

def shift(d,dx,dy):
    # translate any path (abs + rel commands; a leading m is absolute)
    toks=re.findall(r'[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(?:e-?\d+)?',d)
    ar={'m':2,'l':2,'h':1,'v':1,'c':6,'s':4,'q':4,'t':2,'a':7,'z':0}
    out=[]; i=0; cmd=None; first=True
    while i<len(toks):
        if toks[i].isalpha(): cmd=toks[i]; out.append(cmd); i+=1
        if cmd in 'Zz': continue
        n=ar[cmd.lower()]; v=[float(x) for x in toks[i:i+n]]; i+=n
        absolute=cmd.isupper() or (first and cmd=='m')
        if absolute:
            c=cmd.upper()
            if c=='H': v[0]+=dx
            elif c=='V': v[0]+=dy
            elif c=='A': v[5]+=dx; v[6]+=dy
            else: v=[x+(dx if k%2==0 else dy) for k,x in enumerate(v)]
        first=False
        out.append(' '.join(f(x) for x in v)+' ')
    return re.sub(r' (?=[A-Za-z])','',''.join(out)).strip()

def shift_icon(path,dx,dy):
    # move a whole icon file (paths + circles)
    s=open(path).read()
    s=re.sub(r'd="([^"]+)"',lambda m:f'd="{shift(m.group(1),dx,dy)}"',s)
    s=re.sub(r'cx="([^"]+)" cy="([^"]+)"',lambda m:f'cx="{f(float(m.group(1))+dx)}" cy="{f(float(m.group(2))+dy)}"',s)
    open(path,'w').write(s)
