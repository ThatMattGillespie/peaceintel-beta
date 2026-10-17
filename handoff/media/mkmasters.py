"""Build the continuous-tone greyscale masters the runtime mapper dithers.

Ship small: a veil master is upscaled hard so the Bayer cell lands at
--dither-cell (3 CSS px). At a ~520px drawn figure that is ~175 source pixels,
so these go out at 200.

EPI's own stills arrive with a transparent ground and need only a white
composite. GENERATED stills arrive on a soft studio gradient with a vignette,
and clearing that took three attempts worth recording, because the first two
each fail in a way that looks like success until it is dithered:

  1. FLAT-FIELD ALONE (divide by a wide blur). Lifts the corner noise into the
     dither as a visible rectangle, and eats the subject's own shading.
  2. FLOOD-FILL ALONE (PIL, in from the frame). Tolerance is measured against
     the SEED pixel, so a graded ground drifts out of range partway across and
     leaves a wedge of unfilled background that dithers into a diagonal streak.
     PIL's floodfill also silently does nothing once the ground is uniform.
  3. WHAT IS HERE. Flat-field only to make the ground one value, threshold it,
     then keep the part of that threshold CONNECTED TO THE BORDER by geodesic
     dilation. Connectivity is what makes it safe: a white highlight inside the
     subject is above the threshold too, and would be punched out by a plain
     threshold, but it does not touch the frame so it survives.

4. THE OLIVE-BRANCH SET (2026-09-28) has soft studio shadows, some attached
     to the subject, that no ground tolerance separates from a white subject.
     Those were cut out with bria/remove-background on Replicate first, so they
     arrive with alpha and take the transparent-ground path above.

The flat-field's damage never ships: it decides WHICH pixels are ground, and
the ones that are not keep their original values.
"""
from PIL import Image, ImageFilter
import numpy as np, sys, os


def border_connected(mask):
    """Geodesic dilation: the part of `mask` reachable from the frame."""
    seed = np.zeros_like(mask)
    seed[0, :] = mask[0, :]; seed[-1, :] = mask[-1, :]
    seed[:, 0] = mask[:, 0]; seed[:, -1] = mask[:, -1]
    cur = seed
    while True:
        g = cur.copy()
        g[1:, :] |= cur[:-1, :]; g[:-1, :] |= cur[1:, :]
        g[:, 1:] |= cur[:, :-1]; g[:, :-1] |= cur[:, 1:]
        g &= mask
        if g.sum() == cur.sum():
            return g
        cur = g


def ground(path, generated, tol=9):
    im = Image.open(path).convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255)); bg.alpha_composite(im)
    orig = np.asarray(bg.convert("L"), dtype=float)
    if not generated:
        return orig
    blur = np.asarray(Image.fromarray(orig.astype(np.uint8))
                      .filter(ImageFilter.GaussianBlur(300)), dtype=float)
    flat = np.clip(orig / np.maximum(blur, 1.0) * 255.0, 0, 255)
    isbg = border_connected(flat >= (255 - tol))
    return np.where(isbg, 255.0, orig)


def build(src, dst, width, generated, pad=1.10):
    """Greyscale plus alpha. The tone is composited on white, so the mapper's
    ramp sees the same values as before; the ALPHA is what lets the page show
    through the ground without also showing through the subject's own whites
    (a white clipboard is not ground). Sources with no alpha keep a solid one,
    and the runtime falls back to treating their white as ground."""
    a = ground(src, generated)
    alpha = np.asarray(Image.open(src).convert("RGBA"))[..., 3]
    if generated or alpha.min() == 255:
        alpha = np.full(a.shape, 255, np.uint8)
    im = Image.fromarray(a.astype(np.uint8))
    al = Image.fromarray(alpha.astype(np.uint8))
    inv = Image.eval(im, lambda p: 255 - p); bb = inv.getbbox()
    if bb: im, al = im.crop(bb), al.crop(bb)
    w, h = im.size; side = int(max(w, h) * pad)
    sq = Image.new("L", (side, side), 255); sa = Image.new("L", (side, side), 0 if alpha.min() < 255 else 255)
    sq.paste(im, ((side - w) // 2, (side - h) // 2)); sa.paste(al, ((side - w) // 2, (side - h) // 2))
    sq = sq.resize((width, width), Image.LANCZOS); sa = sa.resize((width, width), Image.LANCZOS)
    Image.merge("LA", (sq, sa)).save(dst, optimize=True)
    arr = np.asarray(sq, dtype=float); ink = arr[arr < 248]
    ring = np.concatenate([arr[:4, :].ravel(), arr[-4:, :].ravel(),
                           arr[:, :4].ravel(), arr[:, -4:].ravel()])
    return len(ink) / arr.size * 100, (ink.mean() if len(ink) else 255), ring.min()


if __name__ == "__main__":
    A, OUT = sys.argv[1], sys.argv[2]
    for src, dst, w, gen in [
        (f"{A}/cut-sprig.png",           f"{OUT}/step-00-branch.png",      200, False),
        (f"{A}/cut-globe.png",           f"{OUT}/step-01-globe.png",       200, False),
        (f"{A}/cut-journal.png",         f"{OUT}/step-02-evidence.png",    200, False),
        (f"{A}/cut-clip.png",            f"{OUT}/step-03-criteria.png",    200, False),
        (f"{A}/Olive-Branch-Report.png", f"{OUT}/step-04-application.png", 200, False)]:
        c, m, rmin = build(src, dst, w, gen)
        print(f"{os.path.basename(dst):26s} inked {c:5.1f}%  tone {m:5.1f}  border min {rmin:5.1f}")
