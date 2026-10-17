# Rev 3 — frozen 2026-09-24

The state of the brand system at the end of the atmosphere round, kept for reference
before the consolidation pass. Superseded by the working copy in `handoff/`.

**What this revision had that the next one does not:**

- **Three raised-surface options** on a `data-panel` switch: hairline, warm, wash. Rev 4
  consolidates these into one treatment and removes the switch.
- **Three corner options** on a `data-radius` switch: soft, 2/4, none. Rev 4 commits to
  hard corners and removes the switch.
- **Three gradient-field finishes**: smooth CSS, fractal grain, Bayer dither. Rev 4 keeps
  only the dither.
- **`.field--blocky`**, the 14px-cell mosaic. Explored here and set aside in favour of the
  3px cell; the CSS is preserved in this copy if it is ever wanted back.
- **The stage with a grid over the field.** The grid-on-image combination was rejected.
- **Registration without a hold.** The lock fired and released immediately; rev 4 holds it.
- **Runtime video mapping from the 7-level mono master**, which lost highlight separation
  (the sun in the war clip disappeared into the sky). Rev 4 maps from a continuous-tone
  master and dithers at runtime instead.

17 plates. Verified at the time: 18/18 theme × surface × corner combinations with no
contrast failures and no horizontal overflow at 390 / 768 / 1440.

Open at `archive/rev3-2026-09-24/brand-reference.html`. The stylesheets are relative, so it
renders standalone.
