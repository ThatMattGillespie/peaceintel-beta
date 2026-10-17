# Peace Intel design system — handoff

**For:** Nathanael Miksis and his coding agent
**From:** Matt Gillespie
**Date:** 2026-09-24

---

## What this is

A reconciled design system for Peace Intel, packaged so it can go into
`nathanael-applied-alchemy/peaceintel` with minimal disruption.

| File | What it is |
|---|---|
| `brand-reference.html` | The golden example. Every token and block, in light, dark and on-dark, with live contrast readouts and three comparison switches. Open this first. |
| `tokens.css` | The token layer. Drops in as the `.console-root` block in `console.css`. |
| `components.css` | The block catalog: the named section and component shapes a page is assembled from. |
| `tokens.json` | Machine-readable source. Every token carries a rationale and, where one exists, a contrast constraint. |
| `explorations.css` | **Not the catalog.** Gradient fields, grid variants and the video mapping. Nothing here ships until Matt picks one. |
| `media/*.mp4` | Six treated clips for Pl. 14. Three mono masters and three baked colour maps, as an A/B. |
| `AGENTS.md` | Short rules file for a coding agent. |
| `audit/DRIFT.md` | What the live site currently renders, measured, with the evidence. |
| `audit/*.png` | Captures of every public route. |

---

## First, the part that matters

**Your architecture is right and this package keeps it.** Token layer in `console.css`,
per-page CSS layering on top, `adminTokens.js` bridging the v4 constants to CSS vars, Tailwind
kept to layout with no theme extension, `StyleGuide.jsx` reading live custom properties. That
is a better setup than the prototype repo has, and nothing here asks you to change it.

**Every token name in `tokens.css` is one you already consume.** `--bg`, `--panel`, `--ink`,
`--ink-70/55/35`, `--line`, `--line-2`, `--accent`, `--hl`, `--grad`, `--grid`, `--sh`,
`--elev-1/2/3`, `--serif`, `--sans`, `--mono`, `--rail-w`, `--pane-w`, `--topbar-h`, and the
`--fr-*` aliases are all preserved. Nothing is renamed. Adoption is a values swap plus some
additions, not a refactor, and `adminTokens.js` and every component keep working untouched.

---

## The one real problem: the site renders two brands

Measured live on 2026-09-24 by reading `getComputedStyle` on `.console-root`:

| Route | `--accent` | `--bg` |
|---|---|---|
| `/`, `/beta`, `/research`, `/rotary` | `#D9481C` orange | `#FCFCFB` |
| `/landing`, `/outreach`, `/faq` | `#8a5a2b` brown | `#faf9f6` |

`console.css` sets the brown at the base; four page files override back to orange; three have
no override. It is genuinely hard to spot because the prominent CTAs use `--grad`, which is
not derived from `--accent`, so the buttons stay orange on the brown routes.

**Decided 2026-09-24: warm orange is the accent. The brown is out.**

Before that reads as a design team overruling engineering, the important part: your brown
looks like it may have been solving a real accessibility problem, and if so you were right.
Brand orange measures **4.18:1** on the page background, which fails WCAG AA for text under
24px. The brown measures **5.72:1** and passes. The same pattern shows in the ink ramp —
flattening `--ink-55` to `#6b6760` took it from the prototype's failing 4.07:1 to a passing
5.34:1. Those are good calls that the design side never gave you a way to record, which is the
actual root cause of the split and exactly what `tokens.json` now fixes.

(The one piece of counter-evidence: `--hl` two lines below `--accent` is still
`rgba(217,72,28,.14)`, derived from the orange. If the brown was deliberate, that highlight
was missed. Worth a look either way.)

**The same problem, solved without changing hue:** split the token.

```css
--accent:      #D9481C;  /* graphics, large type, fills */
--accent-text: #C04019;  /* any text under 24px — 4.59:1 on --panel, passes AA */
```

`#C04019` is a barely perceptible darkening that clears AA on the page **and** on any raised
surface, so the brand value stays usable for body text at the size it actually gets used.

---

## What is new

**An on-dark layer.** Neither codebase had one. `.ctaband` in `research-landing.css` uses
`color:rgba(255,255,255,.6)` and `.btn{color:#fff}`; `console.css` has nine hardcoded
white-alpha values. Because those are literals, a dark band inverts into a light band the
moment a dark theme is applied, and no eyebrow or pill has ever had a dark-surface definition.

`tokens.css` adds `--on-dark`, `--on-dark-70/55/35`, `--on-dark-line`, `--on-dark-surface` and
`--on-dark-accent`, applied with a single `.on-dark` class that **remaps the semantic tokens**.
The effect: every component dropped inside a dark band works unchanged, with no
`.ctaband .kicker` overrides. Section 02 of the reference page shows the same markup rendering
on `--bg`, on `--panel` and on a dark band with no per-surface CSS.

Note `--on-dark-accent` is `#F77524`, the warm end of the gradient. The light accent measures
only 4.05:1 on a dark band, so it needs the warmer value there.

**The raised surface is now hairline, and warm became emphasis.** Decided 24 Sep. The default
raised treatment is a pure drawn line: no fill, no shadow. The July warm `#F3EFE7` is not gone
— it moved from being the ambient raised tone to being a *named emphasis surface* (`.warm`,
`.surface--warm`), reserved for a selected row, the most important card in a group, or one
highlighted band per page. Because it is now rare, it means something. The `deep` and `flat`
options were dropped; `warm` and `wash` stay on the switch for comparison.

**Typefaces are decided.** Nanum Myeongjo / DIN 2014 / Space Mono. The Source Serif 4 / DM
Sans / JetBrains Mono alternative was dropped, so that switch is gone. DM Sans remains the
sans fallback and is what renders if DIN fails to load.

**Registration is scroll-linked.** `.reg` acquires, locks and releases as an element passes
the reading position, driven by one `--reg` custom property. It requires squared corners and
is suppressed under `data-radius="soft"` rather than rendered badly. Plate 11.

**Closed scales.** A 4px spacing scale, a ten-step type scale and a four-step eyebrow ladder.
The prototype had no spacing scale at all, 32 distinct font sizes in one page, and thirteen
letter-spacing values plus three in raw pixels. These are what stop a coding agent improvising.

**Surface contexts.** `.surface--raised`, `.surface--deep`, `.surface--invert` and `.on-dark`
remap the semantic tokens for a whole region, so a page becomes a sequence of surfaces rather
than one tone with cards on it. `.surface--invert` flips against the theme: dark band on a
light page, light band on a dark page. Identical markup works in all of them.

**The grid became a vignette.** It used to run under the entire page in both codebases.
`.textured` reveals it as a soft pool that fades before the edges. Consequence you need to
know about: anything sitting on a textured region must be **opaque**, so `.card.quiet` is no
longer transparent.

**Text lockups.** `.lockup--hero / --section / --card / --figure` fix the relationship between
eyebrow, headline, lede and action. This is what stopped `beta.html` carrying two different
subhead treatments on one screen.

**A media hierarchy.** Four tiers, at most one tier-1 element per page, never two tiers
competing in a viewport.

**A motion language.** "Resolve, don't type" — five primitives built from the dither, which is
already the brand's image language. No typewriter, no terminal cursor, no redaction bars.
Every hidden start state is gated behind `[data-js]` with a 2.5s reveal backstop, so animation
is never load-bearing for legibility.

**The console.** Plate 08 of the reference page is the chat interface built from these tokens:
topbar, threads rail, chat column with tiered citations, composer, evidence pane. It is there
so the app and the marketing pages can be judged as one object, and because the chat bubble is
the highest-frequency raised surface in the product.

**A block catalog.** `components.css` names the section and component shapes so a page is
assembled rather than hand-laid-out. This is the layer whose absence caused the drift: tokens
governed the atoms, nothing governed composition.

---

## Suggested adoption order

Each step is independently shippable.

**1. Set orange at the base.**
Change `--accent` to `#D9481C` in `console.css`, add `--accent-text: #C04019`, and delete the
overrides in `research-landing.css`, `beta-landing.css` and the rotary stylesheet. One PR,
removes the two-brand split. This is decided, not proposed.

**2. Derive `--hl` from the accent.**
`--hl: color-mix(in srgb, var(--accent) 14%, transparent)`. Currently hardcoded and
disagreeing with its own accent.

**3. Add the on-dark layer.**
Paste the `.on-dark` block from `tokens.css`, then replace the hardcoded white-alpha values in
`console.css`, `research-landing.css` and `beta-landing.css` with the tokens. Lowest risk of
the structural changes and it unblocks dark mode on the marketing pages.

**4. Add the scales.**
Paste the scale blocks. They are additive; nothing breaks until you start using them.

**5. Adopt the block catalog for the next new page.**
Do not retrofit existing pages. Build the next one from `components.css` and see whether the
catalog is sufficient.

**6. Point `StyleGuide.jsx` at the new tokens.**
Its `COLOR_TOKENS` and `FONT_TOKENS` arrays are currently static copies of the `console.css`
values and will go stale. Reading them from `tokens.json` would make the page self-maintaining.

---

## Two small things, unrelated to the above

**`index.html` loads two font families nothing public uses.** Source Serif 4 and JetBrains
Mono are fetched on every page, and the only references are `src/pages/constants.js` and
`src/pages/admin/components/LlmMarkdownSummary.css`, both admin-only. Moving that link tag
into the admin route would drop two font downloads from every marketing page.

**DIN 2014 can come back if you want it.** Your comment in `useConsoleFonts.js` about
`fonts.cdnfonts.com` returning 500 on every request was correct, and dropping it was the right
call. Self-hosted WOFFs now exist at `Fonts/DIN2014/` in the prototype repo. It has no Medium
cut, so 500 rounds down to Regular. No pressure; DM Sans alone is a legitimate choice.

**Production is ahead of `main`.** The deployed build serves a `RotaryLanding` route with its
own stylesheet, and there is no `RotaryLanding.jsx` at `main` HEAD (2026-09-17) on the only
branch the remote has. Probably just an unpushed commit, but worth checking.

---

## Settled since the first draft

**Raised surface, 2026-09-24.** Hairline and wash are used freely and alternate down a page;
warm is rationed to the extreme case where the extra chroma earns its place. Hairline is the
default. This replaces the July decision that applied warm to every raised surface.

---

## Open questions for Matt, not for you

`brand-reference.html` renders every option live:

- **Corners.** The six-step radius scale is under review against two flatter alternatives:
  everything at 2 and 4px, or zero everywhere including the circles. `data-radius` drives it and
  Plate 15 lays out what each commits you to. Nothing hardcodes a radius, so this is a
  one-token change if it lands. Currently defaulting to **none**. **This is the live question**,
  and it is now tied to a second one: registration (Pl. 11) only exists under squared corners,
  so choosing soft corners also gives up that motif.
- **Atmosphere.** Plates 12, 13 and 14 are explorations, not proposals. Pl. 12 offers three
  finishes for a gradient background: smooth CSS, fractal grain, or ordered Bayer dithering
  against a five-colour token palette. The dithered one is the pick, it can run **live**, which
  gives moving atmosphere with no video file, and it can run **blocky**, where the same dither
  at a fourteen-pixel cell stops being a texture and becomes architecture. Blocky is what the
  full-height stage uses: it holds its structure at scale where a fine field flattens into
  washes, and it is about twenty times cheaper to paint. Pl. 13 offers three behaviours for the
  dashed grid plus a pinned full-height stage; B3, the grid rendering itself in Bayer order, is
  the one worth arguing for. Pl. 14 maps footage through the brand ramp so a full-bleed scene
  can join the library, and recommends shipping one mono master mapped at runtime rather than
  baking colour per theme. All of it lives in `explorations.css` so nothing unadopted can reach
  production by accident.
- Dark-theme `--ink`: the prototype's `#F3EFE7` at 16.15:1 or your softer `#C2BFB9` at 10.10:1
- The unresolved EPI-green question from the original brief

Only step 1 is settled enough to ship today; the rest can wait on the surface and corner
decisions. The previous revision, with the warm surface and the soft six-step radius scale, is
frozen at `archive/rev2-2026-09-24/` for comparison.
