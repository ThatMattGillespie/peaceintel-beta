"""Build the plain pictures on Home (Rev 67): greyscale cut-outs at full size,
for a figure shown as itself. mkmasters.py is the other path, 200px masters for
the runtime raster, which blur if they are shown without it.

The sources are EPI's branded images. Some carry a faint dot texture around the
subject on their transparent ground, so only the subject survives: alpha pieces
smaller than 2% of the largest are dropped, at a faint alpha floor and again
at a firmer one, since a speck can hang on to the subject by a faint thread.

  python3 mkpics.py "<EPI Branded Images folder>" <output folder>
"""
from PIL import Image
import numpy as np, sys, os

PICS = [
    ("Dove Blindfolded.png", "pic-dove-blindfolded.png"),
    ("Inspection 3.png", "pic-inspection.png"),
    ("Dove In front of Stack of Papers.png", "pic-dove-papers.png"),
    ("Dove on Docs.png", "pic-dove-docs.png"),
    ("Clipboard.png", "pic-clipboard.png"),
    ("Olive Branch Report.png", "pic-report.png"),
    ("Doves And Earth.png", "pic-doves-earth.png"),
    ("Dove pencil.png", "pic-dove-pencil.png"),
]


def pieces(mask):
    """Each 8-connected piece of `mask`, as an array of flat pixel indices."""
    h, w = mask.shape
    left = mask.ravel().tolist()
    found = []
    for start in np.flatnonzero(mask).tolist():
        if not left[start]:
            continue
        left[start] = False
        stack, piece = [start], []
        while stack:
            p = stack.pop(); piece.append(p)
            y, x = divmod(p, w)
            for ny in (y - 1, y, y + 1):
                for nx in (x - 1, x, x + 1):
                    if 0 <= ny < h and 0 <= nx < w and left[ny * w + nx]:
                        left[ny * w + nx] = False
                        stack.append(ny * w + nx)
        found.append(np.array(piece))
    return found


def build(src, dst):
    im = Image.open(src).convert("RGBA")
    alpha = np.asarray(im.getchannel("A")).copy()
    for floor in (8, 64):
        found = pieces(alpha > floor)
        largest = max(len(p) for p in found)
        for p in found:
            if len(p) < largest * .02:
                alpha.ravel()[p] = 0
    grey = Image.merge("LA", (im.convert("L"), Image.fromarray(alpha)))
    grey = grey.crop(Image.fromarray(alpha).getbbox())
    grey.save(dst, optimize=True)
    return grey.size


if __name__ == "__main__":
    A, OUT = sys.argv[1], sys.argv[2]
    for src, dst in PICS:
        size = build(os.path.join(A, src), os.path.join(OUT, dst))
        print(f"{dst:28s} {size[0]}x{size[1]}  {os.path.getsize(os.path.join(OUT, dst)) // 1024}KB")
