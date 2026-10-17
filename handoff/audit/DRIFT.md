# Production drift audit

**Measured 24 Sep 2026** against the live site at `peaceintel.org` and the source at
`nathanael-applied-alchemy/peaceintel` (main @ 2026-09-17).

Every value below was read from the **live rendered page** with
`getComputedStyle(document.querySelector('.console-root'))`, not inferred from source. Where
the repo and the deployed build disagree, the deployed build is what users see and is what is
recorded here.

---

## 1. The live site renders two different brands depending on route

| Route | Wrapper classes | `--bg` | `--panel` | `--accent` | Reads as |
|---|---|---|---|---|---|
| `/` | `console-root public-landing beta-landing` | `#FCFCFB` | `#F3EFE7` | `#D9481C` | **orange** |
| `/beta` | `console-root public-landing beta-landing` | `#FCFCFB` | `#F3EFE7` | `#D9481C` | **orange** |
| `/research` | `console-root research-landing` | `#FCFCFB` | `#F3EFE7` | `#D9481C` | **orange** |
| `/rotary` | `console-root rotary-landing` | `#FCFCFB` | `#F3EFE7` | `#D9481C` | **orange** |
| `/landing` | `console-root public-landing` | `#faf9f6` | `#f3f1ea` | `#8a5a2b` | **brown** |
| `/outreach` | `console-root public-landing` | `#faf9f6` | `#f3f1ea` | `#8a5a2b` | **brown** |
| `/faq` | `console-root public-landing` | `#faf9f6` | `#f3f1ea` | `#8a5a2b` | **brown** |

`console.css` sets the brown at the base. Four page files override it back to orange in their
own scope. Three routes have no override and inherit the brown.

**Why this went unnoticed:** the most prominent CTAs use `--grad`
(`linear-gradient(45deg,#F72F24,#F77524)`), which is *not* derived from `--accent`. So the
buttons stay orange on the brown routes and the fork only shows in small accented details.
See `prod-landing-hero.png`: the buttons read orange, the active demo dot reads brown.

**Fix:** set one value at the base in `console.css`. Delete the overrides in
`research-landing.css`, `beta-landing.css` and the deployed rotary stylesheet.

---

## 2. Values that are consistent everywhere but differ from the prototype

`--ink` and the muted ramp are never overridden per-route, so these are site-wide:

| Token | Prototype (`index.html`) | Production (all routes) | Note |
|---|---|---|---|
| `--ink` | `#141310` | `#151512` | imperceptible, 18.10:1 vs 17.38:1 |
| `--ink-70` | `rgba(20,19,16,.70)` | `#3d3a33` | flattened to opaque |
| `--ink-55` | `rgba(20,19,16,.55)` | `#6b6760` | flattened to opaque |
| `--ink-35` | `rgba(20,19,16,.34)` | `#9a958c` | flattened to opaque |
| `--line` | `rgba(20,19,16,.12)` | `#e2e0da` | flattened to opaque |
| `--line-2` | `rgba(20,19,16,.18)` | `rgba(20,19,16,.18)` | identical |
| `--grad`, `--elev-*`, `--grid`, `--sh` | | identical | already correct |

**The flattening was probably an accessibility fix, not sloppiness.** Measured:

| Pair | Ratio | Verdict |
|---|---|---|
| Prototype `--ink-55` `rgba(20,19,16,.55)` on `#FCFCFB` | **4.07:1** | fails AA |
| Production `--ink-55` `#6b6760` on `#faf9f6` | **5.34:1** | passes AA |
| Prototype `--accent` `#D9481C` on `#FCFCFB` | **4.18:1** | fails AA for body text |
| Production `--accent` `#8a5a2b` on `#faf9f6` | **5.72:1** | passes AA |

Four prototype files still ship the failing 4.07:1 value. `beta.html` and `rotary-a.html`
already carry a local fix (`--ink-55:rgba(20,19,16,.62)`, commented `4.07:1 -> 5.13:1`), which
is the same fix applied in a different way. Nobody fed it back to the others.

**Cost of the flattening:** opaque inks cannot composite. A token tuned for contrast on `--bg`
is wrong on `--panel`, and `color-mix()` hover washes built off the ink ramp stop behaving.
`handoff/tokens.css` resolves this by keeping the *text* ramp opaque and tuned, and adding
separate `--wash-1` / `--wash-2` alpha tokens for the washes that need to composite.

**Counter-evidence on the brown:** `--hl` sits two lines below `--accent` in `console.css` and
is still `rgba(217,72,28,.14)`, derived from the **orange**. The accent was swapped without
propagating, and it carries no explanatory comment in a file where nearly everything else
does. Worth asking Nathanael directly before overriding it.

---

## 3. Correction to an earlier reading

An earlier pass reported that production declares Nanum Myeongjo and Space Mono but never
loads them, so serif headlines were falling back to Times. **That was wrong.**
`src/pages/useConsoleFonts.js` injects a Google Fonts stylesheet at runtime with Nanum
Myeongjo, Space Mono and DM Sans. Verified on the live page: a rendered `h1` computes to
`"Nanum Myeongjo", serif` and the font is loaded.

The real, smaller issue: `index.html` eagerly loads **Source Serif 4** and **JetBrains Mono**
on every public page. They are referenced only by the admin panel
(`src/pages/constants.js`, `src/pages/admin/components/LlmMarkdownSummary.css`). Two font
families are downloaded on every marketing page for a surface no public visitor reaches.

---

## 4. Gaps present in both codebases

**No on-dark token layer.** Neither repo has one. `.ctaband` in `research-landing.css` uses
`color:rgba(255,255,255,.6)` and `.btn{color:#fff}`, ported verbatim from the prototype.
Hardcoded white-alpha counts per file: `console.css` 9, `research-landing.css` 4,
`beta-landing.css` 3. No eyebrow and no pill has a dark-surface definition anywhere. The
consequence: a dark band inverts into a light band the moment a dark theme is applied.

**No spacing scale.** `DESIGN-TOKENS.md` §8 says so outright. Measured in the prototype:

| File | distinct `font-size` | distinct margins | distinct `gap` |
|---|---|---|---|
| `index.html` (hand-designed) | 19, all whole px | 15 | 10 |
| `beta.html` | 22 | 21 | 15 |
| `rotary-a.html` | 25 (adds 9.5, 13.5, 14.5, 16.5) | 17 | 9 |
| `problems.html` | 32 (adds 8, 8.5, 11.5, 27, 42) | 24 | 21 |

**Three live section rhythms.** `section{padding}` is 104px in the shared block, overridden to
96px in `rotary-a.html` and 88px in `beta.html`, each by re-declaring the rule after the block
rather than editing it.

**Thirteen eyebrow letter-spacing values** in circulation (`.04` through `.2em`) plus three in
raw pixels in `beta.html`, ported from computed values on the live page and never converted.

**Same class, contradictory definitions.** `.chip` is a solid ink pill in four files and bare
transparent text in two. `.cite` exists in three incompatible variants, one with no tiers at
all. `.act`, `.src-chip` and `.ucard` each exist in two divergent sizes. `.cta` is a white
button in one lineage and a section band in another.

**A dark-mode bug in the app prototype.** `app-v6.html` and `app-v3.html` set
`.src-chip.active .sx{color:rgba(255,255,255,.55)}` and `.n{color:#F77524}` on a surface that
becomes near-white when the theme flips. That text is invisible in dark mode today.

---

## 5. Production is ahead of its own main branch

The deployed build serves a `RotaryLanding` route with its own stylesheet. There is no
`RotaryLanding.jsx` and no rotary CSS at `main` HEAD (2026-09-17), and `main` is the only
branch on the remote. Worth raising with Nathanael separately from the design work.

---

## Captures

Full-page captures at 1440px are in this directory. The `prod-*-1440.png` files were taken
with `fullPage` and contain a large unpainted region above the content, an artifact of
capturing an SPA whose shell is `height:100vh;overflow:hidden` with a per-page escape.
`prod-landing-hero.png` is a clean viewport capture and is the one to look at.

| File | Route | Brand |
|---|---|---|
| `prod-landing-hero.png` | `/landing` | brown, clean viewport capture |
| `prod-home-1440.png` | `/` | orange |
| `prod-beta-1440.png` | `/beta` | orange |
| `prod-research-1440.png` | `/research` | orange |
| `prod-rotary-1440.png` | `/rotary` | orange |
| `prod-landing-1440.png` | `/landing` | brown |
| `prod-outreach-1440.png` | `/outreach` | brown |
| `prod-faq-1440.png` | `/faq` | brown |
