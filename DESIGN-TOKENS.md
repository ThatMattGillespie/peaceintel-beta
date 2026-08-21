# Peace Intel — Design Tokens & Reskin Guide

**For:** Nathanael (platform reskin)
**Maintained by:** Matt Gillespie
**Last updated:** 2026-07-13
**Source of truth:** `index.html` (landing, deployed at [peaceintel-style-review](https://thatmattgillespie.github.io/peaceintel-style-review/)) and `app-v3.html` (app shell, deployed at [peaceintel-app-review-v3](https://thatmattgillespie.github.io/peaceintel-app-review-v3/)). If this document and those files ever disagree, the HTML wins. Every value below was extracted from that code, none are aspirational.

---

## 1. Design intent in one paragraph

Peace Intel should feel like a **calm research instrument**: warm paper neutrals, a single hot orange accent, editorial serif headlines, and monospace "instrument labels" for all UI chrome. The warmth is deliberate and was chosen over a cooler blue variant in an A/B on 2026-07-08. Depth comes from layered warm tones and a faint dashed-grid texture rather than from heavy shadows or gradients. Nothing should feel like a generic SaaS dashboard.

> **Open brand question (do not resolve silently):** the original design brief specified an "EPI green accent." The prototype intentionally supersedes that with warm orange `#D9481C`. This is flagged for the board. Build against orange; keep the accent behind a single token so a swap stays cheap.

---

## 2. Architecture: how the tokens are wired

Everything hangs off CSS custom properties on `:root`. Dark mode is a single attribute flip, `<html data-theme="dark">`, which overrides only the color-ish tokens. Component CSS never references raw hex values (with two tiny exceptions noted in §11); it composes tokens with `color-mix()` for hovers and tints. **Preserve this pattern when reskinning.** If a color is not derived from a token, it is a bug.

```css
:root { --bg: …; --panel: …; --ink: …; --accent: …; /* etc */ }
[data-theme="dark"] { /* overrides colors, shadows, grid texture only */ }
```

`color-mix(in srgb, var(--token) N%, transparent)` is used throughout for tints and hover washes. Baseline browser support is assumed (Chrome/Edge 111+, Safari 16.2+, Firefox 113+).

**Known duplication (2026-08-12):** the three audience landing pages — `funders.html`, `program-managers.html`, `practitioners.html` — each carry their own verbatim copy of the `index.html` token and component CSS, wrapped in `/* ===== SHARED BLOCK … Keep in sync ===== */` markers, plus their own base64 logo. This mirrors how `app-v2..v6.html` already work: every prototype file is self-contained so it renders wherever it is dropped, with no dependency on sibling assets being deployed. The cost is that a token change must be made in four places. When these move to a real build, the marked regions extract into one stylesheet mechanically — that is why the markers exist. Search for `SHARED BLOCK` to find every copy.

---

## 3. Color

### 3.1 Core palette — Light theme (default)

| Token | Value | Role |
|---|---|---|
| `--bg` | `#FCFCFB` | Page and card background. Warm off-white, never pure white. |
| `--panel` | `#F3EFE7` | Raised/selected warm surface: user chat bubbles, active thread, avatars, gated notes. **Locked decision (2026-07-11):** this exact warm tone stays for selected/highlighted surfaces. A neutral-gray and orange-wash alternative were reviewed and rejected. |
| `--ink` | `#141310` | Primary text. Warm near-black. Also used as solid fill for "inverted" elements (active pills, jump button, primary buttons). |
| `--ink-70` | `rgba(20,19,16,.70)` | Secondary text, body copy in readers. |
| `--ink-55` | `rgba(20,19,16,.55)` | Tertiary text, kickers, muted labels, placeholder-adjacent copy. |
| `--ink-35` | `rgba(20,19,16,.34)` | Faint text: timestamps, section markers, placeholders. Also hover border color. |
| `--line` | `rgba(20,19,16,.12)` | Default hairline borders and dividers. |
| `--line-2` | `rgba(20,19,16,.18)` | Stronger border: interactive chips, inputs, cards. |
| `--accent` | `#D9481C` | The one accent. Text accent, citation chips, focus rings, active markers. Used sparingly and always meaningfully (evidence, actions, focus). |
| `--hl` | `rgba(217,72,28,.14)` | Passage-highlight background (`<mark>` in source reader). |
| `--grad` | `linear-gradient(45deg, #F72F24 0%, #F77524 100%)` | The brand gradient. Reserved for the highest-emphasis moments only: send button, primary CTA on dark band. Never for text, never for large surfaces. |
| `--sh` | `20,19,16` | RGB triplet feeding shadow colors (warm shadows, not gray). |

Derived one-offs you will meet in the code:
- `#F77524` (the gradient's warm end) is used alone once: the source-number inside an inverted (ink-filled) chip, where `--accent` would vanish.
- `rgba(255,255,255,.55)` / `.6` for muted text on ink-filled or dark surfaces.

### 3.2 Core palette — Dark theme (`[data-theme="dark"]`)

Dark mode is **warm near-black**, not gray or blue-black.

| Token | Value | Notes |
|---|---|---|
| `--bg` | `#16130E` | Warm near-black. |
| `--panel` | `#211D16` | Raised warm surface. |
| `--ink` | `#F3EFE7` | Text flips to the light panel tone. |
| `--ink-70` | `rgba(243,239,231,.72)` | |
| `--ink-55` | `rgba(243,239,231,.55)` | |
| `--ink-35` | `rgba(243,239,231,.35)` | |
| `--line` | `rgba(243,239,231,.13)` | |
| `--line-2` | `rgba(243,239,231,.22)` | |
| `--accent` | `#EC5E2E` | Brightened for contrast on dark. Do not use light-mode `#D9481C` on dark backgrounds. |
| `--hl` | `rgba(236,94,46,.22)` | |
| `--sh` | `0,0,0` | Shadows go true black and heavier (see §7). |
| `--grad` | unchanged | The gradient reads fine on dark. |

### 3.3 Usage rules

- Orange accent is for **meaning** (evidence, primary action, focus, active state), never decoration. If a screen has orange in more than three or four places, something is over-accented.
- Selected/active surfaces use `--panel`, hover washes use `color-mix(in srgb, var(--ink) 4-5%, transparent)`.
- "Inverted" emphasis (filter pill on, active source chip, jump-to-passage button, primary landing button) is solid `--ink` background with `--bg` text. This is the strongest non-accent emphasis in the system.
- Pure `#FFFFFF` and pure `#000000` appear nowhere except: white text on the gradient send button, and the white variant of the grid texture.

---

## 4. Typography

### 4.1 Families

| Token | Stack | Role |
|---|---|---|
| `--serif` | `"Nanum Myeongjo", serif` | Editorial voice: page headlines, welcome heading, card titles, entry titles, big library stat. Weights 400 / 700 / 800. |
| `--sans` | `"DIN 2014", "DM Sans", sans-serif` | Workhorse: body copy, buttons, inputs, chat text. DM Sans (400/500/600 variable) is the live fallback. |
| `--mono` | `"Space Mono", monospace` | Instrument labels: kickers, nav links, timestamps, citation chips, badges, filter pills, anything uppercase-and-tracked. Weights 400 / 700. |

**Loading (current):** Nanum Myeongjo, Space Mono, and DM Sans come from Google Fonts. **DIN 2014 is now self-hosted** from [Fonts/DIN2014/](Fonts/DIN2014/) (the flaky `cdnfonts.com` link has been removed). The `@font-face` block sits at the top of each file's `<style>`:

```css
@font-face{font-family:"DIN 2014";src:url("Fonts/DIN2014/DIN2014-Regular.woff") format("woff");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"DIN 2014";src:url("Fonts/DIN2014/DIN2014-DemiBold.woff") format("woff");font-weight:600;font-style:normal;font-display:swap}
@font-face{font-family:"DIN 2014";src:url("Fonts/DIN2014/DIN2014-Bold.woff") format("woff");font-weight:700;font-style:normal;font-display:swap}
```

DM Sans stays in the stack as the fallback. Notes for the reskin:
- **DIN 2014 has no Medium (500) cut.** The design uses `font-weight:500` in a few spots (nav links, thread titles); with self-hosted DIN these round down to Regular (400), so 500 and 400 render identically. This is faithful to the typeface — if you want visible emphasis there, step those elements to 600, don't fake a 500.
- Source files are `.woff`/`.ttf`/`.eot`. Only Regular, DemiBold, Bold are wired (the weights actually used). If you convert to `.woff2` for production, keep the same three-weight mapping.
- **Deployment:** the `@font-face` uses relative paths, so the `Fonts/DIN2014/` directory must ship alongside the HTML in each Pages repo. The prototypes currently reference it locally; a deploy that omits the folder silently falls back to DM Sans.

### 4.2 The mono-label pattern (the most load-bearing idiom)

Nearly all UI chrome is Space Mono, uppercase, letter-spaced, small:

```css
.kicker {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ink-55);
}
```

Tracking scales inversely with size. Observed pairings, use these rather than inventing new ones:

| Size | Letter-spacing | Where |
|---|---|---|
| 9–9.5px | `.06em`–`.08em` | Micro badges, source-type suffixes, demo note |
| 10px | `.08em`–`.14em` | Timestamps, section markers (`.sec`), action buttons, entry section headings |
| 10–10.5px | `.04em`–`.05em`, no uppercase | Inline metadata rows (author, year strings) |
| 11px | `.1em`–`.14em` | Kickers, nav links, pane titles |
| 10px | `.18em` | Vertical collapsed-pane label (max tracking in the system) |

### 4.3 Type scale (extracted, px)

| Step | Size / line-height | Face & weight | Used for |
|---|---|---|---|
| Display | 46 / 1.24, `-.005em` | Serif 700 | Landing hero h1 (38px under 900px viewport) |
| H2 band | 36 / 1.24 | Serif 700 | Landing CTA band heading |
| H1 app | 30 / 1.3 | Serif 700 | Welcome heading; library stat number (800, `-.01em`) |
| H2 app | 25 / 1.26 | Serif 700 | Full-entry title |
| H3 | 17 / 1.38 | Serif 700 | Reader title |
| H4 | 16–16.5 / 1.35 | Serif 700 | Use-case card titles, fallback headings |
| Card title s | 14 / 1.4 | Serif 700 | Library list item titles |
| Body | 15 / 1.6–1.72 | Sans 400 | Chat messages, hero intro. Agent prose uses the looser 1.72. |
| Body s | 13.5–14 / 1.5–1.75 | Sans 400 | Reader body, entry read view, assertions |
| UI | 13 / 1.4–1.55 | Sans 500–600 | Buttons, inputs, thread titles, card paragraphs |
| UI s | 12.5 / 1.4–1.6 | Sans 400 | Source chips, gated notes |
| Label | 9–11 | Mono | See §4.2 |

Reading measures: chat column and composer max out at `720px`; long-form entry text at `64ch`; hero intro at `52ch`; headlines at `20–34ch`.

---

## 5. Signature texture: the dashed grid

A 20×20px inline-SVG tile of dashed hairlines with a center dot, applied as `background-image` to "canvas" areas: the chat center column, library stats header, entry hero. It is the quiet fingerprint of the brand; keep it subtle (5–6% opacity strokes).

```css
/* light theme */
--grid: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cline x1='0' y1='10' x2='20' y2='10' stroke='%23141310' stroke-opacity='0.05' stroke-width='0.7' stroke-dasharray='3 2'/%3E%3Cline x1='10' y1='0' x2='10' y2='20' stroke='%23141310' stroke-opacity='0.05' stroke-width='0.7' stroke-dasharray='3 2'/%3E%3Ccircle cx='10' cy='10' r='0.9' fill='%23141310' fill-opacity='0.06'/%3E%3C/svg%3E");
background-size: 20px 20px;
```

Variants:
- **Dark theme:** same tile with `#ffffff` strokes at the same 0.05/0.06 opacities.
- **Inverse (`--gridinv`, landing only):** white strokes at 0.9 opacity, revealed at 14% layer opacity on the dark CTA band via a slow 1.2s fade-in when the band scrolls into view.

The chat column softens the grid with a radial scrim so it fades in from the edges:

```css
.center::before { background: radial-gradient(ellipse 90% 60% at 50% 0%, var(--bg) 26%, transparent 100%); }
```

**Motion texture (landing):** section background videos use a dithered treatment, medium cell, 7% mono Bayer dither, used as per-section background bands (`hero-dither-loop*.mp4`, `hero-dove.mp4`, etc.). Any new motion assets should match that spec.

---

## 6. Radii

| Value | Used on |
|---|---|
| `2px` | `<mark>` passage highlight |
| `4px` | Focus-ring radius |
| `5–7px` | Micro chips: badges (5), citation chips (6), action buttons / filter pills / evidence badges / keyword chips / org icons (7) |
| `8px` | The workhorse: buttons, inputs, source chips, thread items, icon buttons, send, jump, mode toggle |
| `9–10px` | Gated note (9), library list items (10) |
| `12px` | Cards and chat bubbles |
| `14px` | Composer (the largest interactive surface) |
| `20px` | Landing CTA band |
| `50%` | Avatar, status dots |

Rule of thumb: radius grows with surface size. Chips 6–7, controls 8, cards 12, hero surfaces 14–20.

---

## 7. Elevation

Three shadow steps, warm-tinted via `--sh`, always paired "tight contact shadow + soft distant shadow":

```css
/* light */
--elev-1: 0 1px 2px rgba(var(--sh),.04), 0 6px 16px -10px rgba(var(--sh),.18);
--elev-2: 0 2px 4px rgba(var(--sh),.05), 0 22px 46px -28px rgba(var(--sh),.30);
--elev-3: 0 4px 8px rgba(var(--sh),.06), 0 40px 80px -32px rgba(var(--sh),.42);

/* dark (same geometry, heavier alpha, --sh: 0,0,0) */
--elev-1: 0 1px 2px rgba(var(--sh),.20), 0 6px 16px -10px rgba(var(--sh),.50);
--elev-2: 0 2px 4px rgba(var(--sh),.24), 0 22px 46px -28px rgba(var(--sh),.60);
--elev-3: 0 4px 8px rgba(var(--sh),.28), 0 40px 80px -32px rgba(var(--sh),.70);
```

Usage: `elev-1` = chip/list hover. `elev-2` = card hover, composer at rest, jump button. `elev-3` = composer focused. Elevation signals interactivity; static content gets borders, not shadows.

---

## 8. Layout & structural tokens (app shell)

```css
--rail-w: 248px;        /* threads rail, left */
--rail-collapsed: 52px;
--pane-w: 396px;        /* evidence pane, right */
--pane-collapsed: 44px;
--topbar-h: 52px;
```

- Chat column content and composer: `max-width: 720px`, centered, `32px` horizontal gutters.
- Wide pane (full entry view): `width: min(58vw, 720px)`. **Product rule from Milt's direction:** the library/entry never take the full screen; chat and composer always stay visible. Widening the pane auto-collapses the threads rail to its icon state.
- Shell state lives in data attributes on `.shell`: `data-view`, `data-rail="collapsed"`, `data-pane="collapsed"`, `data-pane-size="wide"`. Keep state as data attributes, not class soup.
- Spacing has no formal scale; observed rhythm is a 2/4/6/8-based ad-hoc scale with common paddings `9px 12px` (chips/inputs), `12–18px` (cards, section padding), `16px` (pane sections), `22px` (entry sections). If you formalize one, snap to 4px with the existing values grandfathered.

---

## 9. Motion

| Duration / easing | What |
|---|---|
| `.15s ease` | Citation chip background/border |
| `.18s ease` | Card hover (box-shadow, border-color) |
| `.2s ease` | Composer shadow |
| `.22s ease` | Structural: rail/pane width, toggle icon flip |
| `.3s ease` | Guided-question hint dot |
| `1.2s ease` | Landing-only atmosphere (CTA band grid reveal) |

Rules: animate only `box-shadow`, `border-color`, `background`, `transform`, `width` (the panes), and `opacity`. No bounces, no springs, nothing longer than ~.3s in the app. Always ship the reduced-motion kill switch:

```css
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
}
```

---

## 10. Evidence-tier system (product-critical, do not restyle away)

Every cited source carries one of three provenance tiers. The visual differentiation is a deliberate epistemic signal, specified by Matt, and must survive the reskin exactly:

| Tier | Key | Glyph | Meaning | Chip treatment |
|---|---|---|---|---|
| 1 | `t1` INGESTED | `●` | Fully in the hypergraph, full text on platform | **Filled**: accent text, `color-mix(accent 40%)` border, `color-mix(accent 9%)` background |
| 2 | `t2` ABSTRACT | `◐` | Abstract only, paywalled | **Outline**: accent text and border, transparent background |
| 3 | `t3` WEB | `↗` | Found off-platform, treat with skepticism | **Dashed neutral**: `--ink-55` text, dashed `--ink-35` border, no accent at all |

The gradient of trust reads as: solid accent → hollow accent → dashed gray. Tier 3 deliberately gets **no orange**. The same t1/t2/t3 classes style inline `.cite` chips, grouped `.evi-head` blocks, `.evi-badge` in readers, and `.evi-dot` in the library list. Active/selected chips invert to solid `--ink` with `--bg` text (source number switches to `#F77524`).

---

## 11. Component recipes

Copy these as the reference implementations.

**Buttons (landing):**
```css
.btn { border-radius: 8px; padding: 12px 20px; font: 600 14px var(--sans); border: 1px solid transparent; }
.btn.primary { background: var(--ink); color: var(--bg); }
.btn.ghost   { background: transparent; color: var(--ink); border-color: var(--line-2); }
/* gradient CTA, dark band only */
.ctaband .btn { background: var(--grad); color: #fff; }
```

**App primary action (send):** 36×36, radius 8, `background: var(--grad)`, white glyph. The gradient appears in the app only here.

**Secondary app button (`.btn-dl`):** ink fill, bg text, radius 8, `9px 15px`, sans 600 13px.

**Tertiary/utility (`.act`):** mono 10px uppercase `.1em`, `--ink-55`, 1px `--line-2` border, radius 7, `7px 11px`. Hover: text to `--ink`, border to `--ink-35`.

**Toggle pills (`.fpill`, `.mode-toggle`):** same mono-micro treatment; the "on" state is inverted ink/bg.

**Axis switch (`.as-seg`, `audiences.html`):** the segmented control used for the audience
toggle. One bordered group, `--line-2` 1px, radius 9, `overflow:hidden` so the end caps stay
round however many buttons are drawn. Buttons are sans 600 13.5px / `10px 20px`, `--ink-55`
resting, and the selected one inverts to `--ink` fill with `--bg` text.

```css
.as-seg { display:flex; border:1px solid var(--line-2); border-radius:9px; overflow:hidden; background:var(--bg); }
.as-seg button { font:600 13.5px var(--sans); padding:10px 20px; color:var(--ink-55); }
.as-seg button + button { border-left:1px solid var(--line-2); }
.as-seg button[aria-selected="true"] { background:var(--ink); color:var(--bg); }
```

The rule that matters: **when two of these stack, they stay identical.** Same font size, same
padding, same fill. Hierarchy is carried by the mono axis label to the left of each row and by
reading order, never by shrinking the second row. An earlier version styled level 2 as quiet
mono text tabs and it read as an unrelated widget rather than a second axis of the same control.

> **Status (2026-08-18):** `audiences.html` no longer stacks two of these — audience selection
> moved into a full-screen gate that asks before revealing the page. The component and the
> identical-rows rule are still live in `toggle-lab.html`, and both remain the reference if a
> two-axis inline control is needed again.

**Audience gate (`.gate`, `audiences.html`):** a full-viewport `position:fixed` takeover on the
site's own `--bg` plus dotted `--grid`, holding a 640px column. The control is a **fill-in-the-blank
sentence** — *"I work at ⌄a funding organization as a ⌄senior leader."* — with two native
`<select>` elements styled as inline blanks (`appearance:none`, transparent background, 2px
`--ink` bottom rule, small chevron), plus a `.btn.primary` that stays `disabled` until both
blanks are filled.

```css
.gate{display:none}                       /* resting state */
html[data-gate="open"] .gate{display:grid} /* only script sets the attribute */
html[data-gate="open"] body{overflow:hidden}
```

Four rules worth keeping if this pattern is reused:

- **Put the article inside the option text.** `a funding organization` / `an implementing
  organization` is what keeps "a" and "an" correct without branching, and it is why the blanks
  name organisations rather than audiences: you work at a foundation, you *are* a funder.
  Sentence forms are lower case and singular (`senior leader`), distinct from the title-case
  category labels the `VIEWING AS` readout uses (`Senior Leadership`).
- **Placeholders are `hidden`, never `disabled`.** A disabled option cannot be selected, which
  leaves `selectedIndex` at −1 and the blank showing nothing at all. `hidden` alone lets the
  ghost text display while the blank is unfilled and keeps it out of the open list, so it is
  never mistaken for a real choice.
- **Blanks are sized to their own text** by measuring the selected option against an off-screen
  twin. Keep that twin *outside* the sentence — an element containing form controls is a poor
  `aria-labelledby` target, so the dialog carries a static `aria-label` instead.
- **Focus is a heavier accent rule plus a tint, not an outline box.** An outline around an
  inline blank reads as a form field, which is the one thing this design avoids.

- **The gate is opt-in, never opt-out.** `display:none` is the default and `data-gate` is only
  ever written by script, so with JavaScript off the gate cannot appear and the page behind is
  a complete, valid landing rather than a locked door.
- **Inert everything except the gate.** `body > nav, body > header, body > section,
  body > div:not(.gate)` — the `:not(.gate)` is load-bearing, since the gate is itself a direct
  child of `body` and inerting it makes its own controls unusable.

Its readout counterpart, `.viewas`, is mono 10px `.14em` uppercase: `--ink-35` label,
`--ink` audience name, and a `--line-2` underlined button that reopens the gate. The button is
hidden via `html:not([data-js])` because it needs script; the readout above it stays true
without.

**Inputs:** 1px `--line-2` border, radius 8, `9px 12px`, sans 13px, placeholder `--ink-35`. The composer is the elevated exception (radius 14, `--elev-2` resting, `--elev-3` + `--ink-35` border on focus-within, borderless inner textarea).

**Chat bubbles:** user = `--panel` surface, `--line` border, radius 12, `14px 18px`. Agent = no bubble at all, plain prose at 15/1.72 on the grid canvas.

**Passage highlight:** `mark { background: var(--hl); box-shadow: inset 0 -2px 0 color-mix(in srgb, var(--accent) 45%, transparent); border-radius: 2px; }` (tinted wash plus an accent underline).

**Hover grammar (applies everywhere):** border sharpens to `--ink-35`, elevation appears (`--elev-1` chips / `--elev-2` cards), and text lifts toward `--ink`. Backgrounds wash with `color-mix(ink 4-5%)` only on borderless items (nav links, thread items, icon buttons).

**Focus (accessibility, keep global):**
```css
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }
```

---

## 12. Logo & wordmark

The lockup (dithered dove in corner brackets + PEACE_INTEL wordmark) is produced in Figma and delivered as transparent PNGs, one per theme:

- `Resources/Logos/peaceintel-lockup-light.png` — black art, for light backgrounds
- `Resources/Logos/peaceintel-lockup-dark.png` — white art, for dark backgrounds
- Source canvas 3142×1000 with padding baked in; the prototypes embed 160px-tall renditions as base64 data URIs and size with CSS (`height: 30px` app topbar, `36px` landing nav, `34px` footer, `width: auto`)

Theme switching is two stacked `<img>` elements toggled by `[data-theme="dark"]`; the PNG art does not recolor, so always pair the right variant with the right background. Request fresh exports from Figma rather than recoloring these files.

---

## 13. Do / Don't summary for the reskin

**Do**
- Keep all color behind the `:root` / `[data-theme="dark"]` token pair; theme switch must remain a one-attribute flip.
- Keep `--panel` `#F3EFE7` for selected and highlighted surfaces (reviewed decision).
- Keep the three evidence tiers visually distinct exactly as specced in §10.
- Keep the dashed-grid texture on canvas areas and warm-tinted shadows.
- Self-host the WOFF2s when Matt supplies them; keep DM Sans as the sans fallback.
- Preserve the `:focus-visible` accent ring and the reduced-motion block.

**Don't**
- Introduce EPI green anywhere until the board resolves the accent question.
- Use pure white/black surfaces, gray shadows, or blue-tinted darks.
- Use the gradient on text, large fills, or more than one element per view.
- Let the library or entry views take the full screen in the app; chat stays visible.
- Add new letter-spacing/size pairings for mono labels; reuse the table in §4.2.
- Hardcode hex values in components; `color-mix()` off tokens instead.
