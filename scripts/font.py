# Builds the icon font sources into font/ (run with .venv/bin/python scripts/font.py; committed, like icons-solid/).
# Stroke icons become their 1.5 outline (same shapes the browser draws); solid icons are already fills.
# Every icon keeps its code point forever (font/codepoints.json); new icons take the next free one.
import hashlib, json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from solid import area, line, W
from geo import circle_path
from shapely.geometry import Polygon, MultiPolygon
from shapely.geometry.polygon import orient
from shapely.ops import unary_union
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

EM, ASC, DESC = 960, 840, -120     # 24 grid units -> 40 font units each; icon box sits like text (baseline at 21)
FIRST = 0xE001                     # Private Use Area

def stroke_shape(svg):
    shapes = [line(d) for d in re.findall(r' d="([^"]+)"', svg)]
    shapes += [line(circle_path(float(a), float(b), float(r))) for a, b, r in re.findall(r'<circle cx="([^"]+)" cy="([^"]+)" r="([^"]+)"', svg)]
    return unary_union(shapes)

def solid_shape(svg):
    return unary_union([area(d) for d in re.findall(r' d="([^"]+)"', svg)])

def glyph(g):
    # returns the glyph and its left edge: hmtx must carry the real left side bearing, or renderers
    # (CoreText) shift the outline so it starts at x=0
    pen = TTGlyphPen(None); xs = []
    polys = list(g.geoms) if isinstance(g, MultiPolygon) else [g]
    for p in polys:
        p = orient(Polygon([(x * 40, (24 - y) * 40 + DESC) for x, y in p.exterior.coords],
                           [[(x * 40, (24 - y) * 40 + DESC) for x, y in i.coords] for i in p.interiors]), sign=-1.0)
        for ring in [p.exterior, *p.interiors]:                       # TrueType: outer clockwise, holes counter-clockwise
            pts = [(round(x), round(y)) for x, y in ring.coords[:-1]]
            xs += [x for x, _ in pts]
            pen.moveTo(pts[0])
            for q in pts[1:]: pen.lineTo(q)
            pen.closePath()
    return pen.glyph(), min(xs, default=0)

def build(names, folder, shape_of, family, out):
    fb = FontBuilder(EM, isTTF=True)
    order = ['.notdef'] + names
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap({CODES[n]: n for n in names})
    glyphs = {'.notdef': TTGlyphPen(None).glyph()}; lsb = {'.notdef': 0}
    for n in names:
        glyphs[n], lsb[n] = glyph(shape_of(open(f'{folder}/{n}.svg').read()).simplify(.02))
    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics({n: (EM, lsb[n]) for n in order})
    fb.setupHorizontalHeader(ascent=ASC, descent=DESC)
    fb.setupNameTable({'familyName': family, 'styleName': 'Regular'})
    fb.setupOS2(sTypoAscender=ASC, sTypoDescender=DESC, usWinAscent=ASC, usWinDescent=-DESC)
    fb.setupPost()
    fb.font.flavor = 'woff2'
    fb.save(out)
    check(out, names, folder, shape_of)

def check(out, names, folder, shape_of):
    # re-open the built font: every icon is mapped, and each glyph's box is its icon's box (within half a font unit
    # of rounding) with the left side bearing stored, so the browser draws it where the SVG draws it
    from fontTools.ttLib import TTFont
    f = TTFont(out); cmap = f.getBestCmap(); glyf = f['glyf']; hmtx = f['hmtx']
    for n in names:
        assert cmap.get(CODES[n]) == n, f'{out}: {n} not mapped'
        g = glyf[n]; g.recalcBounds(glyf)
        x0, y0, x1, y1 = shape_of(open(f'{folder}/{n}.svg').read()).bounds
        want = (x0 * 40, (24 - y1) * 40 + DESC, x1 * 40, (24 - y0) * 40 + DESC)
        got = (g.xMin, g.yMin, g.xMax, g.yMax)
        assert all(abs(a - b) <= 1.5 for a, b in zip(got, want)), f'{out}: {n} box {got} != {want}'
        assert hmtx[n] == (EM, g.xMin), f'{out}: {n} left side bearing {hmtx[n]} != {g.xMin}'

if __name__ == '__main__':
    os.makedirs('font', exist_ok=True)
    names = sorted(f[:-4] for f in os.listdir('icons') if f.endswith('.svg'))
    path = 'font/codepoints.json'
    CODES = json.load(open(path)) if os.path.exists(path) else {}
    for n in names:
        if n not in CODES: CODES[n] = max(CODES.values(), default=FIRST - 1) + 1
    json.dump(dict(sorted(CODES.items())), open(path, 'w'), indent=1); open(path, 'a').write('\n')
    build(names, 'icons', stroke_shape, 'Softstroke', 'font/softstroke.woff2')
    build(names, 'icons-solid', solid_shape, 'Softstroke Solid', 'font/softstroke-solid.woff2')
    # Fingerprint of the sources the font was built from: the JS build refuses a stale font.
    h = hashlib.sha256(b''.join(open(f'{d}/{n}.svg', 'rb').read() for d in ('icons', 'icons-solid') for n in names)).hexdigest()
    open('font/source.sha256', 'w').write(h + '\n')
    print(f'font: {len(names)} stroke + {len(names)} solid glyphs, {os.path.getsize("font/softstroke.woff2")//1024} KB + {os.path.getsize("font/softstroke-solid.woff2")//1024} KB woff2')
