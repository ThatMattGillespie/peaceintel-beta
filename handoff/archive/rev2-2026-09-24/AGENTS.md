# Peace Intel — rules for building UI

Read this before writing any CSS or JSX that renders a user-facing surface.

The golden example is `brand-reference.html`. Open it. If what you are about to build would
not look like it belongs beside that page, stop and reconsider. Imitating it is more reliable
than following these rules from memory.

---

## The rules

**1. Never write a raw value.**
No hex, no rgb, no pixel sizes, no letter-spacings. Every value comes from a token in
`tokens.css`. If you need a value that does not exist, add it to the scale first, with a
rationale, then use it. A value that is not on a scale is a bug, not a preference.

If a component genuinely sits between two scale steps and snapping either way changes the
design, add a **named component token** in Layer 4 of `tokens.css` with a comment saying why.
`--t-btn: 14px` is one: buttons fall between `--t-ui` (13) and `--t-body` (15), and 14 is the
established value everywhere. Naming it means it shows up in a grep and cannot be mistaken for
an improvised number. The one exception to "no raw literals" is `#000` inside a `mask-image`
gradient, where the value is an alpha channel and a colour token would be wrong.

**2. Assemble pages from blocks.**
Layout comes from the catalog in `components.css`: `band`, `wrap`, `sec-head`, `grid-2/3/4`,
`rule-row`, `card`, `prompt`, `step`, `callout`. Write content and pick blocks. Do not write
one-off layout CSS in a page file. If you need a shape that is not in the catalog, add it to
the catalog, then use it.

**3. Never write a literal white on a dark surface.**
Put `.on-dark` on the band or card. It remaps the semantic tokens, so every component inside
works unchanged with no overrides. `rgba(255,255,255,.6)` and `#fff` are how dark bands ended
up inverting into light bands the moment a theme flipped.

**4. Fix values at the base, never in a page scope.**
If a token is wrong, change it in `tokens.css`. Overriding a token inside a page wrapper is
what split the live site into two brands: `console.css` sets a brown accent, four page files
override back to orange, three do not, and the site now renders differently by route.

**5. Accent means something.**
`--accent` marks evidence, primary action, focus and active state. It is not decoration. More
than three or four accented spots in a view means it is over-accented. Use `--accent-text` for
any text under 24px; `--accent` alone fails AA at that size. The accent is warm orange — the
brown was reviewed and rejected on 2026-09-24.

**6. Vary the surface down a page.**
A page is a sequence of surfaces, not one tone with cards on it. Put `.surface--raised`,
`.surface--deep`, `.surface--invert` or `.on-dark` on bands and alternate them. A reasonable
rhythm is page, raised, page, invert, page. Surface contexts remap the tokens, so components
inside need no overrides and there is no dark variant of anything.

**7. Texture is rare and everything on it is opaque.**
The dashed grid is a vignette applied with `.textured`, never a page background. Anything
sitting on it must have an opaque face or the dashes read through as dirt.

**8. One loud thing per page.**
Media runs in four tiers: hero motion, band texture, figure, grid vignette. At most one tier-1
element per page and never two tiers competing in one viewport. Every motion asset is dithered
— medium cell, 7% mono Bayer, greyscale — or it will look imported.

**9. Motion resolves, it does not type.**
No typewriter, terminal cursor, redaction bars or scanlines. Use the primitives: `.mo-resolve`
(the signature, once per view), `.mo-register`, `.mo-sweep` (never loops), `.mo-stagger`
(only where order means something), `.mo-settle`. Every hidden start state is gated behind
`[data-js]`. Animation is never load-bearing for legibility.

---

## Quick reference

| Need | Use |
|---|---|
| Section wrapper | `.band` (`.band--tight`, `.band--panel`, `.band--dark`, `.band--texture`) |
| Content column | `.wrap` |
| Section heading | `.sec-head` with `h2`, optional `.h-alt`, optional `p` |
| Mono uppercase label | `.eyebrow` (`.eb-2`, `.eb-3`, `.eb-4`; `.faint`, `.accent`, `.strong`) |
| Primary action | `.btn.primary` (solid ink, not accent) |
| Secondary action | `.btn.ghost` |
| Highest-emphasis CTA | `.btn.grad` — at most one per view, never on text |
| Toggleable pill | `.pill` + `.active` |
| Solid ink label | `.chip` |
| Outlined utility action | `.act` (`.sm`, `.on`) |
| Segmented control | `.seg` with `aria-pressed` |
| Card | `.card` (`.interactive`, `.lead`, `.quiet`, `.flat`, `.raised`, `.sm`, `.on-dark`) |
| Citation | `.cite` + `.t1`/`.t2`/`.t3` |
| Band surface | `.surface--raised` / `.surface--deep` / `.surface--invert` / `.on-dark` |
| Grid texture | `.textured` (`--top`, `--band`) |
| Heading group | `.lockup` + `--hero` / `--section` / `--card` / `--figure` |
| Human aside | `.marginal` |
| Hero or band media | `.media--hero` / `.media--band` |
| App shell | `.app`, `.app-rail`, `.app-main`, `.app-pane`, `.composer` |

The inverted active state, `background: var(--ink); color: var(--bg)`, is shared by every
toggleable atom. Keep it that way.

---

## Do not

- Invent a type size. `index.html` used 19 whole-pixel sizes; generated pages reached 32,
  including 8.5px and 14.5px.
- Write off-grid spacing. Every space is a `--sp-*` step.
- Re-declare a shared rule after the block to change it. Edit the block.
- Give one class two meanings. `.chip` meant a solid pill in four files and bare text in two.
  `.cta` meant a button in one lineage and a section in another.
- Put the gradient on text or on a large fill.
- Wallpaper the grid. It was under the whole page; texture everywhere is texture nowhere.
- Put a translucent surface on a textured region.
- Reach for a typewriter effect, a terminal cursor or a redaction bar. That is costume.
- Use the light-mode accent on a dark surface. It measures 4.05:1 there.
- Style level two of a stacked segmented control smaller than level one. They stay identical;
  hierarchy comes from the label beside them and from reading order.

---

## Product rules that are not style

These carry meaning and must survive any reskin.

**Evidence tiers.** Every cited source is tier 1 ingested (`●`, filled accent), tier 2
abstract (`◐`, outline accent) or tier 3 web (`↗`, dashed neutral, **no accent at all**). The
gradient of trust reads solid, hollow, dashed. Do not restyle it away or collapse the tiers.

**The library never takes the full screen.** In the app, chat and composer stay visible.
Widening the evidence pane collapses the threads rail instead.

**Shell state lives in data attributes** on the wrapper (`data-view`, `data-rail`,
`data-pane`, `data-theme`), not in class soup.

---

## Before you say it is done

1. No hex, rgb or raw px in what you wrote. Grep for it.
2. Every font-size is a scale step; every space is on the 4px grid.
3. It renders correctly in light and dark, and inside `.on-dark` if it can appear there.
4. Text contrast meets 4.5:1, or 3:1 for large text and UI components.
5. Keyboard focus is visible on every interactive element.
6. Nothing is invisible with JavaScript off.
7. It still looks like `brand-reference.html`.
