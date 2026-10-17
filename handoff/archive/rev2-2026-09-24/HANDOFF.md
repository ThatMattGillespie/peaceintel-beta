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

## Open questions for Matt, not for you

`brand-reference.html` renders every option live:

- **The raised surface.** Warm `#F3EFE7` was locked in July and is being reopened against four
  alternatives: deep, wash, flat and hairline. The `data-panel` switch drives all of them, and
  Plate 11 lays out what each one costs. This is the live question.
- Nanum Myeongjo / DIN / Space Mono, or Source Serif 4 / DM Sans / JetBrains Mono
- Dark-theme `--ink`: the prototype's `#F3EFE7` at 16.15:1 or your softer `#C2BFB9` at 10.10:1
- The unresolved EPI-green question from the original brief

Only step 1 is settled enough to ship today; the rest can wait on the surface decision.
