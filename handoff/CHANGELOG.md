# Peace Intel design system — changelog

Every revision of the handoff, oldest first: what changed and why. This was HANDOFF.md until
Rev 19 (2026-10-15), when HANDOFF.md became a short guide to adopting the current system and
this history moved here. Statements below are true as of the revision they sit under; where a
later revision reverses one, the later one wins.

---

## What this is

A reconciled design system for Peace Intel, packaged so it can go into
`nathanael-applied-alchemy/peaceintel` with minimal disruption.

| File | What it is |
|---|---|
| `brand-reference.html` | The golden example. Every token and block, in light, dark and on-dark, with live contrast readouts. Open this first. |
| `landing.html` | **The current landing page, rebuilt in this system.** The proof that the catalog composes a real page, and the closest thing here to a template. |
| `report.html` | The report template (exploration): an A4 document with a cover, the numbered document, a figure, a table and sources. Print or save as PDF. |
| `slides.html` | The deck template (exploration): six 16:9 layouts. Print or save as PDF and each slide is a page. |
| `console.html` | Pl. 08's console on a page of its own, filling the window: the same `prototypes.js`. Reference furniture, not a product page. |
| `home.html` | **The draft of the new home page**, the second worked page. Built from the catalog with no page style block. Two of its sections use held explorations (Pl. 19). |
| `archive.html` | **The decision record.** Plates and specimens cut from the reference, kept with their reasoning. The reference opens it as a sheet from its top bar. It loads `archive/retired.css` and `archive/retired.js`, which nothing that ships loads. |
| `reference.css` | The reference page's own furniture (plate numbers, spec heads, the theme bar, the archive sheet), shared with `archive.html`. Not part of the system. |
| `explore-elevation.html` | Pl. 01's clickable-card exploration (a card that is a link carries the pixel arrow) on two real sections, from `landing.html` and `home.html`, in `explore-elevation-frame.html`. An exploration. |
| `explore-cta.html` | The mock that led to the Rev 8 button decision: it swapped the worked pages' ink and gradient buttons for the accent, live in a frame. Superseded now that the pages use `.btn.tint`; kept as the record. |
| `guide.html` | The same system as a Figma-style file: variables by collection and mode, text and effect styles, component sets. Reads `tokens.css` and `components.css` live, and reports whether `tokens.json` has drifted from them. |
| `system.js` | The behaviour the system needs — motion, registration, fields, the rendered grid, video mapping — as one file rather than a copy per page. |
| `tokens.css` | The token layer. Drops in as the `.console-root` block in `console.css`. |
| `components.css` | The block catalog: the named section and component shapes a page is assembled from. |
| `tokens.json` | Machine-readable source. Every token carries a rationale and, where one exists, a contrast constraint. |
| `explorations.css` | **Not the catalog.** Gradient fields, grid variants and the video mapping. Nothing here ships until Matt picks one. |
| `media/` | Treated clips and stills for Pl. 14 and the worked pages, the partner marks, and `mkicons.cjs`, the pixel-icon generator (held, Pl. 19). |
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

Note `--on-dark-accent` is `#F77524`. The light accent measures only 4.05:1 on a dark band, so
it needs the warmer value there.

**There is a third accent token, and it is not optional.** `--accent-fill` plus `--on-accent`
is what a filled accent control writes. Brand orange has no legible text colour on it —
`#D9481C` is 4.29:1 under white and 4.33:1 under ink — so on light the fill steps down to the
darker orange and on dark the fill stays bright while the text becomes ink. This is the other
half of the accent split, found on 25 Sep by measuring rendered elements rather than token
pairs.

**One raised surface, and warm is a colour rather than a surface.** Decided 24 Sep, lightened
25 Sep. A raised surface is a hairline plus a wash of two percent ink: the edge defines, the
wash gives body, and neither does the other's job. The July warm `#F3EFE7` is not gone, but it
is no longer a surface at all — it is a colour with exactly three uses: callouts, violators,
and the gradient-field ramp, where it is the paper tone at one step of ink rather than the
chroma. `.surface--warm` was removed on 25 Sep: a whole band of the emphasis tone turns it into
a second page tone, which is how the tone stopped meaning anything the first time.

**Typefaces are decided.** Nanum Myeongjo / DIN 2014 / Space Mono. The Source Serif 4 / DM
Sans / JetBrains Mono alternative was dropped, so that switch is gone. DM Sans remains the
sans fallback and is what renders if DIN fails to load.

**Registration is scroll-linked, and it is one of eight mounts.** `.reg` acquires, locks and
releases as an element passes the reading position, driven by one `--reg` custom property, with
the lock holding for 30% of the pass. It is the loudest way to frame a figure and no longer the
default: Plate 11 sets it beside seven quieter ones — rules, corners, recess, seam, mat,
dissolve and rail. One mount per page. **Never on a full-width element**, where the brackets
have no gap to close; `system.js` warns above 90% of the viewport.

**Closed scales.** A 4px spacing scale, a ten-step type scale and a four-step eyebrow ladder.
The prototype had no spacing scale at all, 32 distinct font sizes in one page, and thirteen
letter-spacing values plus three in raw pixels. These are what stop a coding agent improvising.

**Surface contexts.** `.surface--raised`, `.surface--invert` and `.on-dark`
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
the structural changes. (Since Rev 8 there is no dark theme to unblock: dark bands are the only
dark. If the console has a dark theme today, it can go.)

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

## What the landing page found

`landing.html` is the current production landing rebuilt from this system. Building it was
also the first real test of the catalog, and it surfaced six defects that reviewing the
reference page had not:

1. **Nine AA failures**, all one cause: `--ink-35` (3.11:1) was being used as the *colour* of
   9 and 10px micro labels, which need 4.5:1. It is a UI and large-type token. Micro text now
   takes `--ink-55`, and the faint/muted distinction survives only in the lines, because there
   is no legible step between them at that size.
2. **A class collision.** `.field` meant a form field in the catalog and a gradient field in
   the explorations, so every form label rendered a gradient behind itself. The exploration
   yielded: it is now `.gfield`.
3. **Two utilities existed only in the reference page's own chrome**, `.note` and a row
   helper, so the first page built from the catalog reached for them and got nothing. Both are
   in `components.css` now.
4. **The form label rule matched the wrong markup shape.** It targeted
   `.field > label`; every page writes `label.field > span`. Labels rendered unstyled. The
   selector now matches both.
5. **`.cite` stretched** to full width inside a flex-column card.
6. **The app shell needed a figure mode.** Used as a screenshot on a marketing page it
   scrolled internally and restored a mid-sentence scroll position on reload.

All six were fixed at the base rather than in the page, which is rule 4. The reference page
was re-verified after each.

### And what auditing the rendered page found, 2026-09-25

The pass above measured tokens against surfaces. Measuring every *rendered element* against its
own composited background is a different audit, and it caught four more:

7. **There is no legible text colour on brand orange.** `#D9481C` is 4.29:1 under white and
   4.33:1 under ink, so a solid accent button with 14px type failed AA either way. The accent
   split had solved orange as a foreground and left orange as a background unsolved. Fixed with
   `--accent-fill`, which steps down to the darker orange on light and keeps the bright accent
   on dark while `--on-accent` becomes ink. A filled accent control writes the pair.
8. **Seven micro-text uses of `--ink-35` in the reference page's own chrome** — the plate
   numbers, the swatch values, the control labels, the type-scale rulers. The document that
   states the rule was breaking it in its own furniture.
9. **Inline `<code>` failed in dark at 4.25:1.** Its wash *lightens* the surface under it,
   which the ramp was not solved against. It now takes `--ink-70` explicitly.
10. **The reference page's error red was illegible in dark**, 2.83:1 — every "Don't" label and
    every "Wrong" marker. It is a flipping `--dont` token now.

Two more, found by other means:

11. **The replay button had been throwing since `system.js` was extracted.** The handler still
    called `MO` and `observe()`, which had left the page with the runtime. `system.js` now
    exports `PI.replayMotion` — the behaviour rather than two internals.
12. **Three "live" gradient fields had been frozen since the `.field` → `.gfield` rename.** The
    markup said `field--live`, the driver looked for `gfield--live`, nothing errored, and a live
    field that never animates looks exactly like a still one.

---

## Settled since the first draft

**Raised surface, 2026-09-24, lightened 2026-09-25.** One treatment, no switch. A hairline plus
a wash of **two** percent ink. The three candidates were never alternatives: a hairline is an edge, a wash is a
face, warm is an exception, and a raised surface wants an edge and a face. Cards come in opaque
and sheer; pick by what is behind them. Warm is now reserved for callouts, violators and the
gradient fields, and is not a card or band background. This replaces the July decision that
applied warm to every raised surface.

**Corners, 2026-09-25 — and this reverses the day before.** Two and four. 2px for small things
whose whole silhouette is the corner, 4px for anything with an interior, `--r-full` for things
that are actually round. Square was decided on the 24th and was right about six steps being
indecision; it was wrong about the audience. Zero reads as a lab instrument, which is not what
an institution needs to be persuaded by. The token names survive so adoption is still a values
swap.

Registration survived the reversal. It was conditional on square corners, but the 10px gap
holds the brackets off the box, so the radius underneath is none of their business. What did
change is that it stopped being the *default* way to frame a figure — see below.

**Lighter across the board, 2026-09-25.** Wash 3% → 2%, `--line` .12 → .08, `--line-2` .18 →
.14, elevations down about a third. No single value was wrong; the system had drifted heavy,
and a page of twelve cards was twelve announcements.

**Monochrome, 2026-09-25.** The accent is out of the gradient-field ramp entirely. A field is
the largest object on whatever page it appears on, so its colour becomes the page's colour, and
an atmospheric wash of brand orange in front of an institutional reader is a consumer move
however muddy it is. It also removed the text-safety exception: the mono ramp tops out at 15%
ink, so all five moods carry copy. The gradient button is retired for the same reason.

**Eight mounts, 2026-09-25.** Registration was the only way to frame a figure, which made it
the answer to every question. It is now one of eight, and not the default: rules, corners,
recess, seam, mat, dissolve, rail, registration. One per page. It is also never used on a
full-width element, which `system.js` warns about.

**Motion retimed, 2026-09-25.** Entry animations run 900–1600ms instead of 320–520. A reveal
that finishes before the eye arrives at it did not happen. `.mo-sweep` removed; `.mo-develop`,
`.mo-focus`, `.mo-rule` and `.mo-unmask` added.

**Veil and map split, 2026-09-25.** The dove and the magnifying glass are `.veil` — atmosphere,
no box, sits behind type. Full-frame footage is `.vmap` — a figure, opaque, mapped. They had
been sharing a class, which hid the distinction.

**Console typography, 2026-09-24.** The console takes the marketing pairing: serif headings,
DIN body, mono for rails and metadata. It had been all-sans, which made it read as a separate
product.

Both switches are gone from the reference page. A switch for a settled decision is just a way
for two halves of a codebase to drift apart again, which is the problem this package exists to
fix.

---

## Open questions for Matt, not for you

`brand-reference.html` renders every option live:

- **Atmosphere.** Plates 12, 13 and 14 are explorations, not proposals, and all of it lives in
  `explorations.css` so nothing unadopted can reach production by accident.
  **Pl. 12** is the gradient field: ordered Bayer dithering at the brand two-pixel cell against
  a five-stop **monochrome** token palette, in five moods — blooms radiate from an off-canvas
  anchor, edges hold the weight against one boundary. If a field moves it is dawn; the loaded
  moods are for still fields with content on them.
  **Pl. 13** is the dashed grid with a scroll-linked render whose cells arrive in organic
  rather than lattice order. (The pinned stage went to the archive in Rev 9.)
  **Pl. 14** splits the two treatments — `.veil` for a subject on a seamless, `.vmap` for
  footage that fills its frame — and maps the second through the brand ramp so a full-bleed
  scene can join a library that until now was all subject-on-seamless. It recommends one
  continuous-tone greyscale master mapped and dithered at runtime rather than colour baked per
  theme. Measured cost: one clip holds 121fps and the mapping pass is 1.3ms a frame, so the
  treatment is effectively free. What costs is several treated clips painted in one viewport,
  which no product page has.
- The unresolved EPI-green question from the original brief

Only step 1 is settled enough to ship today; the rest can wait on the surface and corner
decisions. The previous revision, with the warm surface and the soft six-step radius scale, is
frozen at `archive/rev2-2026-09-24/` for comparison.


---

## Rev 5.1 · the restraint pass, continued (2026-09-25)

**The dither cell was wrong, and it is now measured.** The open question was whether the system
matched the original site. It did not. Run lengths in `hero-dove.mp4` and `hero-glass.mp4` give
a modal cell of **two source pixels in a ~720px master drawn across a 1120px stage, which is
3.1 CSS pixels on screen**. The handoff clips were at 1.6 and the fields at 2, so the brand's
own assets had always been about twice as coarse as anything derived from them. `--dither-cell`
is 3. The two veil clips in `media/` are the originals, copied rather than re-derived, because
the asset *is* the specification.

**Gradient fields: much quieter, and always moving.** The ramp now spans `--bg` to `--wash-1`
&mdash; three percent of ink across five stops. At fifteen percent a field was still a *thing*
on the page rather than a quality of it. The same change made the motion mandatory: a still
field at three percent is a slightly uneven sheet of paper, so the opt-in inverted and a field
is live unless it carries `.gfield--still`, which now exists only as the reduced-motion
fallback.

**Light mode was reading heavy, and it was one tone used twice.** A card at `--panel` on a band
at `--panel` is the same tone twice. `--panel-face` splits a raised *component* from a raised
*region*: the page tone in light, the panel tone in dark. The principle is the one dark mode was
already following by accident &mdash; **a raised surface moves away from the page toward the
light**, and that direction is opposite in the two themes. In light the inside of a card is
white and the hairline does the raising. Six alternatives are laid out in Pl. 15.

**Video: monochrome in light, infrared in dark.** The light ramp folded the accent through its
middle stops, making every treated clip the largest chroma-carrying object on its page. It is
paper to ink now. The dark ramp keeps its warmth deliberately: on near-black it reads as thermal
imaging, and on the reversed subject ramp it reads as infrared. **Placement became a rule** &mdash;
a veil can go anywhere because it has no edges; a map can only go edge to edge, because a
rectangle of treated video set into a column reads as an imported asset however well it is
mapped.

**The gradient moved to Pl. 01.** `.btn.grad` had a solid fill substituted underneath it, which
left a control labelled "Gradient" rendering as a flat swatch. That was a bug and also the
argument: the gradient was never a component. It is documented with the colours, for a
full-bleed brand moment, at most once per page.

**Open for Matt, all three built and none adopted:**

- **Three motion syntheses** (Pl. 10). Unmask and stagger do opposite halves of one job, so
  `.mo-cascade`, `.mo-uncover` and `.mo-deal` each ask whether the sequence can be carried by a
  mask rather than by opacity. Shown on a card and on a citation list, which is where the
  difference actually shows. `.mo-uncover` is the only one with no opacity change anywhere,
  which makes it the only one safe on 9&ndash;10px mono at any count &mdash; a measurable
  property worth weighing against taste.
- **Corners versus registration** (Pl. 11). The same three cards marked both ways. Corners
  survive repetition and registration does not, which was the question. The honest summary:
  **corners are punctuation and registration is an event.** A page can be full of punctuation
  and hold one event; what registration still has that corners do not is *time*.
- **2 / 4 / 6 radii** (Pl. 16). A third step for containers, on the argument that 4px on a 400px
  panel is barely a radius. The case against is the one that killed the six-step scale.

**Also fixed:** the two-clip cap left four of six cells blank on the video comparison plate,
because a clip that has never played has no frame. The slots rotate now &mdash; a clip that has
had its turn yields to one that has not &mdash; so every visible clip ends up holding a correct
still while two play. On a real page, which has one clip, it never fires.


---

## Rev 5.2 · the decisions, taken (2026-09-26)

Four things were staged as choices in rev 5.1. All four are now answered, and the losing
options are **deleted rather than left in the stylesheet**, because an unadopted primitive is
an adopted primitive eventually.

**The group reveal is `.mo-deal`.** Five candidates were compared on a card and on a citation
list. `.mo-unmask`, `.mo-stagger`, `.mo-cascade` and `.mo-uncover` are gone. Deal goes on the
container and the children move: a soft mask per child, staggered, each rising six pixels under
it. Pl. 10 keeps the record of what was weighed, because a decision with no record of its
alternatives gets re-litigated every six months. The property lost with uncover is worth
naming: it changed no opacity anywhere, which made it safe on 9&ndash;10px mono at any count.
Deal moves the item rather than fading it, so type is still at full density from its first
visible frame; it is just arriving from six pixels below.

**Corners replace registration in most of its jobs, and they now move.** `.mount--corners`
rides the same `--reg` progress value as `.reg`, written by the same loop in `system.js`, so
the whisper and the shout are one gesture at two volumes. Twelve pixels of travel against
registration's thirty-four, because a hairline crossing that distance is a thing flying in
rather than a mark settling. Its own tokens are `--cnr-stroke`, `--cnr-arm`, `--cnr-travel`.

**A card wears an edge or it wears corners, never both.** An elbow drawn inside a hairline is
the same line twice, three pixels apart, which reads as a rendering fault. `.mount--corners.card`
now drops the card's border and shadow, so the rule is enforced by the markup rather than left
to the author, and `system.js` warns for any other container that still carries one.
`.surf--edge` and `.mount--corners` are **the two card treatments**; the other five surfaces in
Pl. 15 stay as the record of what was weighed against the edge.

**Radii stay at 2 / 4.** The third step was built and rejected: 6px is where every product page
on the internet already sits, and 2 / 4 is tighter and particular to this brand. One detail
argued it down as well &mdash; the corner elbows take `--r-md`, so at 2 / 4 / 6 a 4px elbow
would sit inside a 6px card and the two curves would disagree by two pixels at exactly the
point the eye is being drawn to.

**The gradient CTA is back, and its label is ink.** Substituting a solid fill left a control
labelled "Gradient" rendering as a flat swatch, which was a bug. `.btn.grad` carries `--grad`
again and is the one component allowed to. White across this fill runs 3.90:1 at the red end
and 2.79:1 at the orange, failing even the large-text floor at one end; ink runs 4.77:1 to
6.66:1 and clears AA at every point. The July button was white on it. The ink is written as the
fixed near-black rather than `var(--ink)`, because the fill does not flip with the theme and
neither can its label.

**Reversed 2026-10-08: the label is white.** Matt's call, made knowingly. The label is now a
named token, `--on-grad: #FFFFFF`, and the measurement stands as it was: 3.90:1 at the red end,
3.39:1 in the middle, 2.79:1 at the orange, so it fails AA for button text. `.grad--white`, the
Rotary page's one-off exception, is now the default and survives only as a no-op alias. If the
contrast has to be solved later, the route that keeps white is a deeper fill for this control.

**The field ramp ends at `--line-2`, not `--wash-1`.** Three percent turned out to be past
quiet into invisible: on a real page the field was a rumour. Fourteen percent is the hairline
tone, so the darkest part of a field is exactly as dark as the line around a card and the field
never introduces a value the page does not already use. `.gfield--loud`, which ends at
`--ink-35`, is on the plate beside it for comparison and is not for pages: at that weight a
field is a graphic with type on it and the copy has to be placed around the shape.

**A row of separated items takes one rule, on top.** A line above and a line below turns a
triptych into a box drawn in two strokes, and a box wants to be a container. The verticals
stay, because they separate the items from each other rather than fencing the group.

**Also fixed:** the live-field pixel budget had been keyed to `.gfield--live`, a class nothing
has carried since fields became live by default, so the guard was never firing. It reads the
`.gfield--still` opt-out now.


---

## Rev 6 · what two real pages added (2026-10-09)

Two pages have been built from the catalog since the last round: a pitch page for a proposed
Rotary collaboration, which is not in this package, and `home.html`, the draft of the new home
page. Both followed step 5 of the adoption order. Whenever one needed a shape the catalog did
not have, the shape went into `components.css` and the page used it from there. This round
sorts what they added into adopted and held, and brings the reference page, `AGENTS.md` and
`guide.html` up to date with it.

**Adopted, in `components.css` and shown in Pl. 18:**

| Block | What it is for |
|---|---|
| `.stack` | Blocks inside a band, at the gap a section head keeps. Replaces inline margins. |
| `.sec-head.wide` | A section heading that is a whole sentence; lifts the 20ch measure. |
| `.rule-row h3` | The heading every rule-row cell was reaching for, with `.prose` under it. |
| `.ledger` `--split` `--figures` | A vertical run of entries. Split pairs a label with its statement; figures aligns numbers with subgrid. |
| `.fig-split` `--even` | A figure beside the claim it proves. |
| `.hero-stack` | Copy over a veil, the veil clipped by the band. |
| `.scrolly` `--flip` `--full` | Steps beside one sticky figure that swaps as each step is read. `[data-scrolly]` in `system.js` sets classes only. |
| `.checks` | Three proof points between a promise and its action; the tick is an accent mask. |
| `.orgs` | The partner strip, marks sized by height. |
| `.screen`, `[data-land]` + `data-at`, `html[data-snap]` | Full-height stops whose children arrive on landing, and one stop per gesture on desktop. |
| `.nav-mark`, `.foot-cols`, `.foot-logo` | The product lockup in the top bar, and the partner footer. |

Type also changed system-wide: headings take `text-wrap: balance`, paragraphs `pretty`, and
`--serif` now leads with `PI Serif Hyphen`, a one-glyph Georgia face, because Nanum Myeongjo's
hyphen is wide enough to read as a dash. All of these compose existing tokens. `tokens.json` is
6.2.0, and the only change in it is that two tokens are marked held.

**Held, in `explorations.css` and shown in Pl. 19.** `home.html` uses them; please do not build
on them yet. Each set is adopted or dropped whole.

- **The pixel icons:** `.px-icon`, `.points`, `media/mkicons.cjs`, and `--icon-px` /
  `--glyph-px`, which stay in `tokens.css` because they do nothing without `.px-icon`.
- **The ask:** `.ask`, the editable prompt, `.blank-wrap`, and the SWITCH and PROMPTS drivers in
  `system.js`, which are marked held in their comments.

**Also corrected:** `AGENTS.md` still described the gradient fields as they were on
2026-09-24. Fields are monochrome and always live, and `dawn-neutral` is retired.

Nothing in the adoption order changes. Step 5 has more catalog to build from, and `home.html`
sits beside `landing.html` as a second worked example.


---

## Rev 7 · the review of 9 October

Matt went through the reference plate by plate. Three kinds of change came out of it.

**Cut, and moved to the archive.** Each is gone from `tokens.css`, `components.css` and
`system.js`, and survives only in `archive/retired.css` / `retired.js` so `archive.html` can
still show it.

- **Motion:** `.mo-settle`. Five primitives remain, and every one is used on a shipped page.
- **Mounts:** `.mount--corners`, `--recess`, `--seam`, `--mat` and registration (`.reg`), with
  the scroll loop that drove the last two and the `--reg-*`, `--cnr-*` and `--mount-recess`
  tokens. Later the same day the rail went too, with the four versions developed for it: the
  numeral was the strongest, and a vertical ledger in the margin still read as too avant. Two
  remain: rules and dissolve.
- **Surfaces:** a card is raised by its edge and nothing else. The five alternative surfaces
  that sat in `explorations.css` went to the archive.

**Changed.**

- Pills, chips and radio pills take `--r-sm` (2px).
- `.eyebrow.accent` names a state and nothing else: *Ingested*, *Tier 1*, *Correct*, *Now in
  pilot*. Section labels and card categories are neutral. `landing.html` lost four accent labels.
- **An inverted band is now the other theme, in full.** On a dark page a `.surface--invert`
  band had kept the white grid, so it showed no grid, and it used the retired warm panel. It now
  takes the ink grid (new token `--gridink`) and the 2% wash. The composed tokens (`--hl`,
  `--link-h`, `--elev-1/2/3`, `--panel-sheer`, `--warm`) are restated inside `.on-dark` and
  `.surface--invert`, which closes the `pi.warning` entries `tokens.json` 6.x carried. The
  veil, the media blend, the partner marks and the still-map ground now follow the band
  instead of the page.
- Gradient fields have a white floor, `--gfield-floor: .4`: heat under it is paper, and the
  rest stretches over the full ramp, so fields are lighter and still reach `--line-2`.

**In exploration, waiting on Matt.** A new section at the foot of `explorations.css` holds
options for the gradient button's label, eleven elevations (with `explore-elevation.html`,
which puts them on two real sections in both themes), a tinted accent button, selection pills,
three ways to keep "act" and "chosen" apart drawn from Cal.com and the Ford Foundation, and two
ways to make the finer icons read as deliberate. Each is a specimen in its plate. Nothing there
is for production yet.

**Decided the same evening.**

- The rail mount is cut, with its four developed versions (see Cut, above).
- The pixel icons, still held, moved to the finer grid: 25 cells at 2px, so `--icon-px` is
  50px and `media/mkicons.cjs` draws page icons at 25. Bigger, radiant and dissolve went to the
  archive. Control glyphs stay on the 3px cell.
- Elevation and hover are for things you can click. `landing.html`'s audience cards were
  `.interactive` divs that went nowhere, so they lost the class.
- The reference's top bar is quieter: the stale "decided" hint and readout are gone, and the
  archive is a text control beside the revision label. `tokens.json` is 7.1.0.

**And later that night.**

- **One mount.** Dissolve is a full-width background only, so it left the mounts and is now
  `.vmap--dissolve`, the top and bottom edge of a full-bleed map, in `explorations.css` with the
  rest of the video treatment. `.mount--rules` is the one frame, once per page, on a figure and
  never on a section head. `rotary.html` still has it on two section heads.
- **Icons are dotted:** `.px-icon` masks every cell to a dot (25 cells at 2px). The generator
  still writes squares. The send glyph stays solid.
- **Elevation** is down to four options: C block, I echo, J halftone, and J2, a square dither
  that only appears on hover. The other eight are in the archive.
- **Selection:** the tray's tile is `--panel-face` and its recess is a new exploration token,
  `--pick-tray`, so it reads correctly on every surface in both themes.
- `explore-cta.html` puts the worked pages' calls to action in the accent (fill, tint, or both)
  with no gradient button, for a decision on whether chroma should carry action.

**For you:** `tokens.json` is 7.0.0, a major version because tokens were removed. If anything
on your side already reads `--reg-*`, `--cnr-*` or `--mount-recess`, drop it.

---

## Rev 8 · one theme, one action, one way to choose (2026-10-14)

Matt took four decisions and asked for everything unused to go. Every removed rule is in
`archive/retired.css` verbatim and every removed specimen is in `archive.html`.

**Dark mode is gone.** It read as too heavy and too intense for the brand. Every
`[data-theme="dark"]` rule left `tokens.css`, `components.css` and `explorations.css`, the
theme observers left `system.js`, and the switches left the reference, the guide and the archive.
Dark *bands* stay (`.on-dark`, `.surface--invert`, now the same ramp): one ink section on a
light page is still the strongest emphasis that costs no chroma. Three primitives only the theme
used went too (`--pi-dark-000`, `--pi-dark-100`, `--pi-orange-bright`).

**Every call to action is `.btn.tint`.** The accent as a 9% wash with a 40% hairline and an
`--accent-text` label. `.btn.ghost` is the second action beside it. Retired: `.btn.primary`
(ink), `.btn.brand` (solid orange), `.btn.grad` (gradient) with its `--on-grad` label token, and
`.btn-ink`. The gradient stays a brand colour in Pl. 01 with no control wearing it. The tint is
never used inside an answer, a citation list or the evidence pane, where the same dress means
tier-one evidence. In production: `.btn-dl`, `.fb-submit` and `.jump` map to tint or ghost.

**A choice sits in a tray.** `.pills.tray` and `.seg`: the options sit in a recess (new token
`--tray`) and the chosen one rises as a `--panel-face` tile with a hairline and `--elev-1`.
`.seg` changed from an outlined strip with an ink-filled segment. A toggle on its own
(`.pill.active`, `.act.on`) still fills with ink.

**The mount is retired.** Nobody could say what it was for. Landing's console figure stands on
its own edge; Rotary's two section heads keep `.mo-rule`. Dissolve continues as `.vmap--dissolve`,
the edge of a full-bleed video map, in `explorations.css`.

**Removed as unused:** the `.band--panel` alias, the textured video band, the rounded dark band
and its grid reveal, `.grid-4`, `.display`, the card variants `.interactive`, `.lead`, `.flat`,
`.quiet` and `.warm`, `.foot`, the radio pill, and the card and figure lockups. Nothing on a page
or the console used them.

**Still in exploration:** elevation (C, I, J and J2 in Pl. 01, on two real sections in
`explore-elevation.html`), and square icon cells as an alternative to the dots (Pl. 19). The
pixel icons themselves are still held.

**For you:** `tokens.json` is 8.0.0, a major version: dark modes and four tokens were removed and
`--tray` was added. All three worked pages use `.btn.tint`; Home's and Rotary's gradient buttons
are gone.

## Rev 9 · a straighter guide (2026-10-15)

Matt's review of Rev 8 asked for a reference that states what is current and leaves the
reasoning to the archive, and for anything unused to go **as a standing rule**. Every removed
rule is in `archive/retired.css`, every removed specimen in `archive.html` (in plate order), and
the two removed drivers in `archive/retired.js`.

**No gradient.** `--grad` and `--pi-grad` are removed, for now.

**Every corner is 4px.** `--r-xs` and `--r-sm` went from 2px to 4px; the names stay. `--r-full`
is still round.

**Elevation is quieter.** `--elev-1` to `--elev-3` are a one-pixel contact shadow plus a short
ambient shadow pulled in by a negative spread. Their dark-band values changed to match.

**One entry primitive: `.mo-deal`.** `.mo-resolve`, `.mo-develop`, `.mo-focus` and `.mo-rule`
are retired with `--mo-blur` and `--mo-in-lag`. The three worked pages now put `.mo-deal` on the
group (a lockup, a section head, a scrolly step) where they had a primitive per child. Home's
feature cards have no entry motion, because a deal would clip their violator.

**Texture is free to use.** As many sections as a page wants, never two that touch. New masks:
`.textured--left` and `.textured--right` (`--grid-mask-left`, `--grid-mask-right`).

**More than one dark band per page**, never two back to back.

**The tint is for what can be clicked.** `.evi-badge` is now ink (filled, hollow, dashed);
`.cite` keeps its accent because it opens a source. `.badge.accent` is retired.

**Pl. 08 is the live console, reskinned.** From Matt's screenshot of the product, every element:
the top bar with the product nav and the account, the rail with its tray and recent chats, the
answer toolbar, the composer with its mode tray and tools, and the library pane with its stats,
search, sort tray and entries. New in `components.css`: `.app-nav`, `.avatar`, `.glyph`,
`.icon-btn` (`.line`, `aria-pressed`), `.rail-head`, `.rail-act`, `.app-tools`, `.composer-hint`,
`.pane-stats`, `.pane-tools`, `.pane-search`, `.lib-item`, a numbered heading and a defined term
inside an answer, and the token `--glyph-ui` (22px). The glyphs are 11 cells at 2px from
`media/mkicons.cjs`, now in its set. `.thread` titles truncate to one line; `.composer-bar`
wraps.

**Removed as unused:** `.card.sm`, `.card.on-dark`, `.card.sheer` with `--panel-sheer`,
`.violator.accent`, `.eyebrow.strong`, `.media--hero`, `.media--band`, `.veil--band`,
`.veil--foot`, `.gfield--loud`, `.gfield-safe` and its live readout, the stage and its driver,
`.vrow`, and the baked-video swap in `system.js`. `.marginal` and `.band--tight` moved to
`reference.css` as the reference's own furniture.

**Trimmed to what is current:** Pl. 12 (fields), Pl. 14 (video: the mono, baked and runtime
comparison is archived; runtime is the treatment) and Pl. 16 (corners).

**Still open at the end of Rev 9:** elevation, the icon screen, and the tint on a dark band.
The last two were settled in Rev 10.

**For you:** `tokens.json` is 9.0.0, a major version: four tokens removed, three added, the
radii and elevations changed.

## Rev 10 · the tint and the icons, settled (2026-10-15)

**The tint is final.** `.btn.tint` now has a solid `--accent-text` edge (it was a 40% hairline),
twice the wash on a dark band, and an arrow: a 3 &times; 5 chevron drawn by the class itself
with `::after`, which moves one cell on hover. The ghost has no arrow. Nothing changes in your
markup. `.send` wears the same dress, with a line arrow inside.

**Icons: lines in controls, pixels in content.** Every icon inside the product's controls is a
Lucide line icon inlined as `svg.glyph` (18px, 1.5 stroke, `currentColor`; `--glyph-ui` is 18px).
The pixel icons are **adopted** for page content: `.px-icon` and `.points` moved from
`explorations.css` to `components.css`, each cell drawn as a centred three-quarter square
through the new `--px-screen` mask. `--glyph-px` and the pixel send arrow are gone, and
`media/mkicons.cjs` now makes only the page icons and the blank's chevron.

**Pl. 08:** library titles are DIN, a step under the answer's serif; the two large library
counts are one line (`.pane-meta`); the composer tip is gone (`.pane-stats` and `.composer-hint`
removed). A **projects** exploration shows a project as a rail section, a project home with its
instructions and sources, and a breadcrumb plus a removable scope inside a chat. It is product
work as much as brand work, and nothing in it is for production yet.

**Pl. 20 · Structure** is new: five ways to give a page a frame without adding noise (running
head, drawn column grid, margin numeral, section rule, contents strip). Exploration only.

**The reference** has a Plates menu in its top bar.

**For you:** `tokens.json` is 10.0.0: `--glyph-px` removed, `--px-screen` added, `--glyph-ui`
changed.

---

## Rev 11 · the console as a prototype (2026-10-15)

**The send button carries the call to action's pixel arrow.** The chevron is now a token,
`--px-arrow`, and `.btn.tint::after` and `.send::after` both draw it. **Your markup changes:**
a send button is empty, `<button class="send" aria-label="Send"></button>`; remove the line
arrow SVG that Rev 10 put inside it. It is the one pixel mark a control carries, on purpose.

**The tray's recess is the panel tone on paper.** `--tray` is `var(--panel)` at the root (it was
a 6% shadow wash, which read as grey); `.surface--raised` restates the wash, since that band is
already the panel; the dark-band value is unchanged. Every `.seg` and `.pills.tray` follows.

**The library pane.** Its list (`.pane-body`) sits on `--panel`, so the entries lift off it;
entry titles take the new `--t-ui-ls` (.02em), because DIN closes up at 13px; the pane head
carries a hand-drawn pixel shelf of books (`.ph-mark`, `media/icons/library-mark.svg`).

**The composer's bar is one height.** Every control in `.composer-bar` is `--sp-8` (32px):
the answer-mode tray, Eirene, the icon buttons, the version mark and the send. Only the tray
and the send have a face; Eirene loses its outline in the bar, and the version mark is plain
text.

**The console folds.** `data-rail="off"` and `data-pane="off"` on `.app` fold the rail and the
pane (CSS in `components.css`); Expand sets both. `.act` can carry a trailing chevron glyph
(`.act .glyph`) and has a disabled state. `.rail-head`, the Chats / Reports / Projects tray, is
retired: the rail is sectioned.

**Pl. 06 is a real button sheet:** every size of tint, ghost and text button on paper, a
raised band and a dark band, their states, and the fixed-size controls, with the contrast of
each measured from the rendered button.

**Pl. 08 is a working prototype** (`prototypes.js`, reference-only). Projects, **documents**
(a written document, a spreadsheet, a PDF: one registry of kinds, each with its own page and
download formats), **sources** (library papers and uploaded files, listed in the pane and added
by upload, drop or from the library), **sharing** (invite as editor or viewer, change, remove,
copy link) and four candidate **object marks** for papers and documents. All of it is in
`explorations.css` and none of it is for production yet; it is the behaviour to build toward.

**Pl. 14** shows the copy veil on a dark band. With copy on it, the veil keeps the paper's .18
there rather than the 1.55 boost, which measured about 3.4:1 under the lede.

**Pl. 20, round two: the numbered document.** The margin numeral and the contents strip carried
into one device (`.st-toc`, `.st-sec`, `.st-num`, `.st-doc`), with a live specimen. The
console's document pages use it. Exploration only; the running head, drawn grid and section
rule are in the archive.

**For you:** `tokens.json` is 11.0.0: `--px-arrow` and `--t-ui-ls` added, `--tray` changed.


## Rev 12 · projects overhauled (2026-10-15)

**The object mark is adopted: the legend.** Everything you open, keep, cite and send carries
what it is set into its top edge in mono: a paper's type (EMPIRICAL STUDY, CASE STUDY,
DISSERTATION, POLICY REPORT, DATASET) and an artifact's kind (DOCUMENT, SPREADSHEET, PDF), so the
line under the title gives only who, when and how strong. It is `.obj` with that text in
`data-kind`, now in `components.css`; `--obj-ground` is the surface under the card, which the
legend uses to cut the hairline (the library pane sets it to the panel). **Your markup changes:**
add `class="obj" data-kind="Empirical study"` (the entry's type) to a library entry, and drop the
type from its meta line. The tab, corner and fold candidates are
in the archive.

**The console's grid holds still.** `.textured` goes on `.app-main`, the column, which does not
scroll, instead of `.app-scroll`, where the grid scrolled away with the first screen. **Your
markup changes** if you put it on the scroller.

**The microphone sits against the send.** The composer's bar now has two ends: the answer mode,
Eirene, spoken replies and settings at the left; the microphone and the send together at the
right, in `.cb-send`, both 32px squares; the microphone wears a hairline (the outlined icon
button) so it reads as the second surface you can press. The send states its own 32px height,
because inside the group the bar's rule no longer reaches it. The tray in the bar may now take a
second row on a phone and stay a tray.

**A project's panel does not fold.** On a project's page the pane has no fold button; it folds
again in a chat. A project's name and description are edited together in an Edit details dialog
(the pencil by its title, after Claude's), and **Eirene has left the composer's bar**; it stays
in the console's top bar.

**Pl. 20 uses icons.** On a page, each section's margin holds a pixel icon (`.st-i`, a
`.px-icon` at 50px) in place of the numeral, and the contents strip lists names only; a console
document keeps the numeral. Exploration only. Three page icons were added to `media/icons/` for
it: book-open, users, door-open. The numbered version is a still in the archive.

**Row dividers match the top rule.** The verticals of `.rule-row` and `.points` (and `.points`'
dividers when it stacks on a phone) are `--line-2` now, the top rule's weight; they were the
lighter `--line`.

**J2's screen is `--ink-55`**, lighter than full ink. Pl. 01 shows it beside the pixel icons.

**The library pane** says its size in the search placeholder ("Search 6,582 curated papers"); the
line above the search only appears while papers are picked for a project. The papers a chat
cites come first and say "Cited 1", "Cited 2", numbered as in the answer.

**Two small base fixes.** A `.seg` on `.surface--raised` reads its options in `--ink-70`
(`--ink-55` on that recess measured 4.38:1); a project's page was the first tray on a raised
surface. **`--scrim`** is new, for a modal dialog's backdrop.

**Pl. 08, projects, round three** (exploration, `explorations.css` and `prototypes.js`). After
Claude's project page, ChatGPT's project tabs and NotebookLM's panels:

- A project's page is the raised surface: its purpose, a composer, and its chats and
  **artifacts** in a tray.
- The right-hand pane on that page is the project's **panel**: instructions, **context** and
  **memory**, each a row that opens a dialog, then who it is shared with. In a chat the pane is
  the library again, led by the papers the chat cites.
- **Context** (was "sources") is uploaded files, notes and library papers. Its dialog is a
  table you can search, open, select and remove from, with the room the project has left. Add
  uploads, takes a note, or opens the library in the pane to pick from.
- **Memory** lists what has been kept from the project's chats, each item forgettable, and
  whether the project may use memory from your other chats. A shared project may not.
- **Artifacts** (was "documents") are what chats make. Export › Save as an artifact.
- The composer's line "Answers draw on…" is gone.

None of it is for production yet. The Rev 11 console is two stills in the archive.

**No elevation on cards.** The elevation exploration is closed: every option, including the
echo (adopted and taken back the same day), is in the archive. A card's hover is its edge only,
and shadows are for layers that float (menus, dialogs, the composer). How a clickable card shows
itself at rest is a new Pl. 01 exploration in three levels: an action inside the card (the
default), a card that is a link carrying the pixel arrow (`.card.go`, explorations.css), and an
object in a console list, which needs no mark.

**The blank's active state is the tint.** `.blank` on focus or press takes the accent wash behind
the word and an `--accent-text` rule at 2px; it was the solid accent at 3px.

**The library pane reads its count.** In a chat, the pane head shows how many papers the chat
cites, as two mono digits ("03 cited"), with nothing to click.

**`console.html`** opens Pl. 08's console on a page of its own.

**For you:** `tokens.json` is 12.0.0: `--scrim` added.

## Rev 13 · what leaves the screen (2026-10-15)

After a critical review of the brand against its market. Five of its findings, and a favicon.

**The headline serif is broken for French, and is up for replacement.** Nanum Myeongjo is a
Korean face whose Latin is basic English: it has no accented letter, so "Sénégal" or "Côte
d'Ivoire" in a heading is set partly in Georgia. Pl. 21 sets five free candidates against it in
English and French, each measured for language coverage, with a tray that resets every serif on
the reference page; Matt is open to buying one, and four commercial candidates are listed. Nothing
changes in `tokens.css` until he picks. **Do not ship French headings in Nanum.**

**The tier marks are drawn.** ● ◐ ↗ were in neither DIN 2014 nor Space Mono, so every device drew
them from its own fallback font. `PI Marks`, a 450-byte face of exactly those glyphs, is inlined
in `tokens.css` and first in every font stack, restricted to those three characters. **Your markup
does not change**: keep typing the characters.

**The smallest type is 10px.** The eyebrow ladder moved up a pixel: `--eb-1` 13, `--eb-2` 12,
`--eb-3` 11, `--eb-4` 10. In the console 65 of 109 text elements had been 10px or under.

**Print styles exist.** `components.css` ends with an A4 print block: dark bands print as paper
(`[data-print-as-is]` opts out), no video, grid or sticky nav, motion shown at its end, nothing
split across pages, links in prose print their address.

**A report and a deck.** `report.html` (A4: cover, numbered sections, a forest plot, a table,
sources with tier marks; running head and folio from `@page`) and `slides.html` (six 16:9
layouts, one slide per printed page). Both are explorations in `explorations.css`.

**Data.** Pl. 22: a forest plot whose points are the tier marks, ranked bars, series by texture
rather than hue, and a Sahel map in the dither screen at four densities. Exploration.

**Favicon.** `media/favicon.svg` (the brackets and dove redrawn on a 32-cell grid, light on dark
browser chrome), `favicon.ico` and `apple-touch-icon.png`, linked from every page.

**For you:** `tokens.json` is 13.0.0: the eyebrow sizes and PI Marks in the font stacks.

## Rev 14 · the two sides, a finder, more serifs (2026-10-15)

**The rail is built as the library pane is.** `.app-rail` is now a flex column with no padding of
its own, like `.app-pane`: a `.pane-head` with a pixel speech bubble (`media/icons/chats-mark.svg`),
"Chats" and its fold button; `.rail-tools` (New chat, and `.rail-find`, a search bar that is a
button dressed as `.input`, with its key in a `kbd`); then `.rail-body`, which scrolls. The two
folds are one mirrored pair (`panel-left-close`, `panel-right-close`); the members button left the
rail. Shells that put threads straight in the rail keep the old padding from `archive/retired.css`,
and `.rail-act` went there too. `landing.html` already built its rail this way, so its head now
runs full width like its Sources pane.

**A finder, after Claude's search** (exploration, `explorations.css`, `.find-*`). The rail's search
bar, a search button in the toolbar when the rail is away (`.tools-find`, and always under 1080px,
where the rail is hidden), or Cmd K inside the console opens `dialog.dlg[data-view="search"]`: one
field, a tray for All, Chats, Projects or Artifacts, the recent chats and two actions before
anything is typed, a quoted line when the match is inside a chat, and "Ask Peace Intel" with what
was typed. Arrow keys move and Enter opens. Papers are not in it; the library keeps its own search.

**New chat here.** Under an open project in the rail, a row that starts a chat inside it. The New
chat at the top still starts one outside any project, so a new user never has to choose a project
before asking.

**A new base element:** `kbd`, a key shown as a hint (mono, `--eb-4`, hairline, never pressed).

**Pl. 21 has more candidates.** Three free Baskervilles: Libre Baskerville and Baskervville from
Google Fonts, and Baskerville Punch (OFL, served from `Fonts/BaskervillePunch/`). Six commercial
faces are set only from fonts installed on the computer viewing the page, through `local()`
aliases in `reference.css`, and show a dashed card until then: ITC Founder's Caslon, FS Brabo, The
Picnic Club, Baskerville Neo, Mrs Eaves XL and Monotype Baskerville (which every Mac has). None of
this touches `tokens.css`; the serif is still Matt's decision.

**For you:** no token changed; `tokens.json` stays 13.0.0.

## Rev 15 · a quieter rail, a highlighter, one plate fewer (2026-10-15)

**The rail's tools are icons in its head.** New chat (`square-pen`) and search sit beside the fold
in the rail's `.pane-head`; the full-width button and search bar under it are gone, and with them
`.rail-tools` and `.rail-find`. When the rail is away the same two icons come into the toolbar
(`.tools-rail`, renamed from `.tools-find`).

**A phone's toolbar holds what it needs.** Under 1080px Expand is hidden (the rail and the pane
are already away) and under 640px so are the avatars (Share opens the same list); the breadcrumb
keeps only the project, truncated. Before this the crumb ran under Export at 390px.

**The rail recedes.** `.rail-body` sits on `--panel`, and the open chat (`.thread[aria-current]`,
`.pj-item[aria-current]`) on `--bg`, so the conversation is the brightest thing on the screen.

**The chat's grid gathers at the bottom.** New mask `--grid-mask-bottom` and `.textured--bottom`:
the grid is held at the foot of `.app-main` and fades out upward.

**Hover is a highlighter.** New token `--wash-tint`, the tint's 9% wash (16% on a dark band), is
the hover on rows, menu items, icon buttons, nav links, text links, tray choices and the finder.
It replaces `--wash-1` there, and the three hovers that turned a label `--accent-text` (a project's
chat list, artifact titles, context names), which highlight the words instead. Grey text inside a
highlighted row steps up to `--ink-70`, because `--ink-55` on the tint over the panel measured
4.4:1. Edges that darken under the pointer are unchanged.

**Pl. 22 is removed.** Its bars, texture series and map are in the archive with their styles
(`archive/retired.css`); the chart frame and forest plot stay, because `report.html` and
`slides.html` use them.

**Pl. 21 compares weights.** A tray sets the specimen headlines from 300 to 800; each card lists
the weights its face really has and says which it is shown at when the one asked for is missing.
Every face now loads its full range.

**VT323, for fun.** A Mono tray in the control bar of the reference and the console sets `--mono`
to VT323 (self-hosted in `Fonts/VT323/`, scaled by `size-adjust` to Space Mono's x-height). It is
reference-only and changes no token.

**For you:** `tokens.json` is 14.0.0: `--wash-tint` and `--grid-mask-bottom`.

## Rev 16 · reverted, and four smaller things (2026-10-15)

**The highlighter hover is reverted.** Matt: the orange washes took from the monochrome. Every
hover is back to what it was (`--wash-1`, `--wash-2`, ink), `--wash-tint` is gone from `tokens.css`
and `tokens.json` (still 14.0.0, for `--grid-mask-bottom`), and so is the `--ink-70` step-up it
needed.

**Hovering a project's chats: six options** (exploration, Pl. 08). The one hover he disliked was a
project's chat rows turning `--accent-text`. `.pj-list[data-hov]` takes a to f: an accent rule drawn
in under the title (the citation's hover), an accent tick in the margin, an ink underline, the row's
rule darkening, a grey wash, the pixel arrow. A tray on Pl. 08 and in console.html's bar switches
the console between them. Artifact titles and context names still turn `--accent-text`; whichever
option is picked should go to them too.

**A folded side is a shelf.** It no longer disappears: the rail narrows to `--rail-collapsed` and the
pane to `--pane-collapsed` (production's own tokens), keeping the divider, with the reopen button
where the fold button was. The toolbar no longer carries reopen buttons, and the rail's New chat
and search go with the rail; they come into the toolbar only on screens with no rail at all.

**A type test bench.** `type-test.html` loads Landing, Home, the console or the report in a frame,
untouched, and resets `--serif` and the weight of every serif element set at 600 or heavier, at
desktop or phone width, one setting or two side by side, scrolled together. The candidate faces
moved from `reference.css` to `type-candidates.css`.

**VT323 is abandoned**: the Mono tray and `Fonts/VT323/` are gone.

**"Sources cited".** The library head's counter reads "03 sources cited".

## Rev 17 · Cooper, and Source Serif's family (2026-10-15)

Pl. 21 and `type-test.html` gain fourteen faces, all reference-only; nothing changes in
`tokens.css`.

- **Cooper\*** (Owen Earl, indestructible type\*, 2024, OFL), a revival of Oswald Cooper's Cooper
  Old Style, 400 to 900, served from `Fonts/Cooper/`. Western and Central European only.
- **In Source Serif's family, at 400:** Charis SIL, Merriweather, Noto Serif, Gelasio, Spectral, PT
  Serif, Crimson Pro, Petrona, Brygada 1918 and Andada Pro from Google Fonts, and Charter and
  Iowan Old Style, which ship with macOS. **Charis SIL, Merriweather, Noto Serif and Gelasio pass
  every letter in the test**, Vietnamese and the African Latin letters included.
- Pl. 21's weight tray now starts at 400, Matt's preference for a lighter headline.

## Rev 18 · the serif is Source Serif 4 (2026-10-15)

**Matt chose Source Serif 4**, set light: **400 for every serif heading and 500 at `--t-display` and
`--t-h1`**. Two new tokens carry it, `--serif-w` and `--serif-w-display`, and every serif rule in
`components.css` and `explorations.css` now names one of them; nothing serif is set at 700 or 800
any more (the stat number, larger than display, takes the display weight).

- `--serif` is `"PI Marks", "Source Serif 4", Georgia, serif`. Every page loads
  `family=Source+Serif+4:ital,opsz,wght@0,8..60,400..600;1,8..60,400..600` in place of Nanum
  Myeongjo. The optical-size axis matters: let the browser pick it (`font-optical-sizing: auto`, the
  default), so a headline gets the display cut.
- `PI Serif Hyphen` is removed. It patched Nanum's 0.64em hyphen with Georgia's; Source Serif's own is fine.
- Pl. 21 moved to the archive whole, with its styles (`archive/retired.css`), and the test bench moved
  to `archive/type-test.html`. Its weight tray now sets `--serif-w` and, a step above,
  `--serif-w-display`, so it tries a weight exactly as the system applies it.
  `type-candidates.css` stays in `handoff/` for both.

**For you:** `tokens.json` is 15.0.0: `font.serif`, `font.serif-w`, `font.serif-w-display`.
Production's `.console-root` needs the same three, and its own serif headings moved off 700.

## Rev 19 · reorganised for handoff (2026-10-15)

- **The reference is restructured** by what someone is doing, not when things were decided:
  Start here, then Foundations (colour, type, space and shape, surfaces, texture, logo and
  favicon, imagery, motion), Components (controls, lockups, evidence and objects, page blocks,
  product states), Templates, Don't, and Open decisions. Plates are renumbered 00 to 16 and
  each says Stable or Exploration. Old anchors still resolve.
- **Removed:** Pl. 11 (the mount, retired), Pl. 12 (gradient fields; Landing's corpus band moved
  to the rendered grid; the driver moved to `archive/retired.js`), Pl. 19 (held from Home: the
  blank was adopted into Controls; the ask and editable prompt are listed in Open decisions).
- **Adopted:** the rendered grid (`.gx--render`), simplified to one behaviour, organic order and
  ink only. Its accent "hot" corner and the Bayer option were cut. Styles moved to `components.css`.
- **Retired:** the video map's footage form (`.vmap--bleed`, `.vmap--dissolve`). The veil stays,
  with `.vmap--still`, its still form, which Home and Rotary use.
- **New plates:** Start here, Logo and favicon, Product states.
- **The console is a deliverable of its own** (`console.html`); the reference shows two snapshots.
- **The logo is always the image.** Landing's typed PEACE_INTEL and the report's and deck's
  earlier underscore lockup were replaced with `media/peaceintel-logo-*.png`; `.app-mark` retired.
- **`color-scheme: light`** on the root and `dark` on dark bands (`tokens.css`): on a Mac in dark
  mode the favicon SVG drew in its dark colours on the light page.
- HANDOFF.md rewritten as the adoption guide; this history moved here.

---

## Rev 20 · surfaces renamed, line work, two picks (2026-10-16)

**Picked.** Clickable cards in three levels are adopted: `.card.go` moved from
`explorations.css` to `components.css` and the spec moved to Controls (Pl. 09). A project's
chats take the arrow, F of the six hovers; the other five and the console's Chat hover switch
are in the archive. The last two orange hovers (artifact titles, context names) went monochrome:
an artifact's edge darkens, a context name takes the text link's rule.

**Surfaces renamed.** `--panel` was a background in the console and a raised board by name. Tone
now says "set back" and the edge says "object": `--ground` (was `--panel`), `--face` (was
`--panel-face`), `--edge` (was `--panel-border`), `--fill` for the small set-back objects (badge,
avatar, the user's message), and `--ground-2`, 4% ink, new, for the console's rail, library pane
and project page. `.surface--raised` is `.surface--ground`; `.surface--ground-2` is new.
`--panel-elev` (always none) is gone. The three old names stay as aliases for production only.
`tokens.json` 16.0.0. The tray's options read `--ink-70` on either ground (4.2:1 at `--ink-55`).

**Lines.** Pl. 04 is Surfaces & lines and writes down every line the system draws, with two rules:
weight is state, colour is role. The rule row (and `.points`) no longer draws a vertical at its
outer edge when it wraps (a two-by-two row left a line on the right of its first row), and its
outer text is flush with the heading above: each item draws its left edge, the row reaches a
gutter past the column and clips sideways, and the top rule is inset to match. Pl. 16 has six
grammars for lines and lockups (`.lw[data-lw]`: as it stands, the tab, the legend, the brackets,
the cell rule, the column rule) and a seventh, the tab with the brackets once a page, which is
my pick.

**The margin.** The page specimen lost its contents strip (a console document keeps its own). Its
margins carry the moving dove and magnifying glass (`.st-m`, a veil at 136px against the icon's
50), alternating by meaning, with a switch back to the icons. To let a clip multiply its white
ground away inside a textured band, the grid now sits under the content at `z-index: -1` rather
than lifting every child to its own layer, and a textured band takes its surface's tone at no
specificity.

**Logo and favicon.** The logo is version 6 (two words, heavier brackets), exported at 2x from
`Resources/Logos/`. The favicon is the logo's four brackets, empty, on an opaque white tile inside
a border, each one line weight; one drawing for light and dark tabs. Image and icon links carry
`?v=` so browsers fetch the new files. Template snapshots were retaken.

**Fixes.** Pl. 16 ran edge to edge: two stale notes about the retired echo each closed a
`</div>` and ended the plate's column early. The radius specimen's "dots only" broke out of its
circle; labels sit under the shapes now.

## Rev 21 · twenty more lines, a floating bar (2026-10-16)

**Line work.** D, the logo's brackets as a page line, and B with D are retired to the archive
(`archive.html#brackets`): Matt found them "cheesy" and "too literal". They stay in the logo and
the favicon. Pl. 16 has twenty more grammars, G to Z (`#lines-more`), drawn on the same lockup and
row: the ruler, the leader, the folder, the dissolve, the develop, the scanlines, the dash, the
nodes, the ASCII rule, the misprint, the hand, the wedge, the spine, the baseline, the fade, the
grid line, the Scotch rule, the draw, the field and the bleed. Four of them (J, K, R, X) are drawn
in 2px cells against the dither's Bayer matrix by a new Exploration driver in `system.js`
(`[data-lr]`, debug key `lr`), Matt's "mask ... with raster edges": K builds as its block arrives
and its fringe shifts with the scroll. It is scroll-linked like the rendered grid and never
loops, and draws once, finished, with reduced motion. My pick is the raster family, K to open a
section and J as its still form.

**The floating bar.** An Exploration (`.fnav[data-fnav]`, Pl. 16 `#float-nav`): a top bar set in
from the window's top and sides, an object with an edge, that compacts to the logo while
scrolling down and opens on the way up or when tabbed into. A switch tries compacting to the dove
alone. Phones keep the logo and the main action.

**Imagery.** Pl. 07 shows the five Rotary stills as a series (one recurring subject), one still
on paper, a ground and a dark band, and a still beside its step. `.vmap--still img` now sits under
its canvas: left in flow it kept its natural 200px and widened a phone page.

**Colour.** Pl. 01 lists `--ground`, `--ground-2`, `--face` and `--fill` with the other surfaces,
and measures text and accent against `--ground` (was `--panel`, the same value).

**Favicon.** The outer border is gone: four brackets on an opaque white tile, two cells in from
the edge. Links carry `?v=21`.

## Rev 22 · a larger type scale, a brand line, documentary images (2026-10-16)

From the review of the brandkit and taste-skill skills, with Matt's answers.

**Type.** `--t-display` 46 to 64px and `--t-h1` 36 to 48px, with tighter leading, so the jump
from body to headline is about four times (it was 3.1). Both are set at 400:
`--serif-w-display` is 400, was 500. Body is 16px, was 15, and stays `--ink-70`. The stat figure
is 72px so it stays larger than display. Up to 900px: display 44, h1 36, stat 48 (the stat at 72
widened a phone page). Pl. 02 has a note for writers: headlines stay to two lines, about 32 to 40
characters; Home's and Rotary's run to four at the new size. `tokens.json` 17.0.0.

**No shadow at rest.** The selected tray option, the prompt, the composer, the console frame and
the PDF page preview lost their resting shadows. The prompt and composer still lift on hover and
focus. **The floating bar is opaque**: `--face` and `--edge`, no blur.

**Numbering** is written down: numbers only where the order or the number is real. Every number on
the pages already is.

**The brand line** (Pl. 16 `#brand-line`): six candidates for clarity and trust with an
institutional reader; my pick is "Evidence, in focus." over "Every answer traced to its source."

**The brand board** (`brand-board.html`, Exploration): the identity on one page in nine panels,
built from the shipping CSS: the logo, the line, the mark, colour, type, the product, imagery,
print (a report cover and an event badge) and the details.

**Documentary images** (Pl. 16 `#documentary`, Exploration): a photograph of a place in the
brand's treatment. A, `.vmap.doc-dark` on a dark band, a compressed dark ramp. B,
`[data-docscreen]`, a new driver in `system.js` (debug key `doc`): the photograph in the dither
with its colour showing through in patches of value noise that drift with the scroll and open
most when centred. Both use Levi Clancy's 2019 photographs of Mosul's Old City (CC0, Wikimedia
Commons), credited under each. Masters: `media/doc-mosul-*`. `vnoise` moved to the top of
`system.js` so two drivers share it. Rules on the plate: places, not suffering; always named,
dated and credited; one per page, as a figure.

## Rev 23 · a sans test, colour comes in whole (2026-10-16)

**The sans test** (`sans-test.html`, Exploration). DIN 2014 may need a web licence; the system
uses three of its weights (400, 600, 700). Like the archived headline test, two frames show a
worked page (Landing, Home, Rotary, the console, the report) with `--sans` swapped and a
tracking tray (-.03 to +.01em) that applies to text set in the sans only. Candidates: DIN 2014,
Clear Sans with 600 drawn as Bold or as Medium (it has no 600), D-DIN (400 and 700 only),
Barlow (a true 600) and DM Sans. A face other than DIN drops `--t-ui-ls`, which exists only for
DIN at 13px. Files in `Fonts/SansTest/` with their licences; faces in `sans-candidates.css`.
D-DIN PRO was left out: the only copies found online carry no licence.

**The documentary screen goes fully chromatic** (Matt): monochrome as the picture enters the
bottom of the screen, colour gathering in patches, whole colour once its top reaches the upper
third; reversed on the way back. Reduced motion shows it in full colour.

## Rev 24 · the sans is Barlow (2026-10-16)

Matt chose Barlow at 0 tracking from `sans-test.html`. DIN 2014 would have needed a paid web
licence. Barlow is SIL OFL, self-hosted in `Fonts/Barlow/` with `OFL.txt`: 400, 400 italic,
500, 600, 700, in the Latin, Latin Extended and Vietnamese subsets (so the sans covers what the
serif covers), declared with `unicode-range` in `tokens.css`. `--sans` is
`"PI Marks", "Barlow", "DM Sans", system-ui, sans-serif`. `--t-ui-ls`, a DIN correction at 13px,
is 0. Weights in use are unchanged (400, 600, 700), and 600 is now a true SemiBold. The DIN
WOFFs stay in `Fonts/DIN2014/`, loaded by nothing. `tokens.json` 18.0.0.

## Rev 25 · codes, two lines, line work cut to three, the console on a phone (2026-10-16)

**Codes.** Every exploration in Pl. 16 carries a short code in an ink tag (`.xc`), plate ·
section and option letter: 16 · 1 line work (1I, 1V, 1Z), 16 · 2 the floating bar, 16 · 3 the
brand line (3A, 3B), 16 · 4 documentary images (4A1 to 4A3, 4B), 16 · 5 the margin (5A, 5B),
16 · 6 the console on a phone (6A, 6B). The brand board's panels are BB 1 to BB 9.

**Line work (16 · 1)** keeps I, V and Z. The other twenty-two, the raster lines among them, are
in `archive.html#lines-r25`; their CSS moved to `archive/retired.css` and the rendered-line
driver from `system.js` to `archive/retired.js`.

**The floating bar (16 · 2)** compacts to the dove alone, and tapping the dove opens the full bar.
The logo-or-dove switch is gone.

**The brand line (16 · 3)**, picked: 3A "Clear evidence for consequential decisions." (the line)
and 3B "Decisions on peace and security are too important to leave to chance." (the statement).
On the brand board.

**Documentary images (16 · 4).** 4A2 and 4A3 show the dark picture on white and on off-white;
`.doc-dark` has a light-page ramp, near-ink to 44% ink. 4B's full colour stays a raster: about
two thirds saturation, each channel quantised to four levels through the Bayer matrix, and bands
of rows that slip sideways with the scroll.

**The console.** The prototype's top strip is gone from `console.html`. Under 620px (16 · 6,
`explorations.css`): the input is one line that grows to six, with one row under it: a mode chip
(`.cb-mode`) that opens a menu of the modes and spoken replies, then the microphone and send;
settings and the v1 badge are off a phone. The input went from 180 to 100px. The top bar's four
links fold behind a hamburger (`.app-burger`) into the console's own menu. Desktop is unchanged.

## Rev 26 · the console on a phone, after Claude's app (2026-10-16)

Matt: the thread's toolbar had too much padding above and none below, there was no way to
reach chat history or the library on a phone, search in a thread should search that thread,
Share needs a public link, and the field in the composer should have no shadow or padding.

**Fixed at the base.** `.composer .ci` took the form fields' padding and focus shadow; it now
draws nothing of its own (components.css), on every screen. The phone toolbar is
`--sp-2` above and below.

**Explorations, Pl. 16 · 6.** 6B the hamburger moves to the left and opens the chats; 6C
under 1080px the rail and the pane return as drawers with a scrim, the console links at the
rail's foot; 6D the sources ticker under a thread's toolbar opens the library; 6E search from
a thread's toolbar defaults to This chat and outlines the matching message; 6F Share gains
General access (only people listed, your organisation, anyone with the link); 6G the mode
chip bare (G1) or outlined (G2), switched on the plate. Drawers appear without a slide: a
drawer entrance would be a new motion primitive and is proposed, not built.

## Rev 27 · the console on a phone adopted, the glitch (2026-10-16)

**Adopted (Pl. 16 · 6, now in components.css).** Matt chose the outlined mode chip (6G2).
The sources ticker is now a count drawn as a citation, in the accent, inside the toolbar; the
toolbar is `--ground` on a phone, and in a thread its search, export and share fold into one
utility button (`.cb-util`). The drawers, search in this chat and general access are adopted
as built in Rev 26.

**Exploration, Pl. 16 · 4C.** The 4B row slips, without colour and on a timer instead of the
scroll, on the dark pictures 4A1 to 4A3 (`[data-docglitch]` in system.js, `?off=glitch`). A
timed effect is outside the closed set of motion, so it stays an exploration until adopted.

## Rev 28 · twelve glitches, the phone toolbar, what a paper opens to (2026-10-16)

**Console on a phone (components.css).** The top bar goes while a thread scrolls down and
returns on the way up (`.is-top-off`, no slide). The toolbar runs crumb, the utility button,
then the sources count at the far right, now with the pane's open glyph after the number.
The hamburger sits at the far right of the top bar. The composer's sides are equal, so the
mode chip and the send sit on the field's edges.

**Exploration, Pl. 16 · 4D.** Twelve glitch variants on the dark picture, most on a fixed
clock and smaller than 4C (`[data-glitch-v="d1"]` to `"d12"`; the driver takes a preset).

**Exploration, Pl. 16 · 7.** What a paper opens to, after production's two screens. A citation
or a library row opens 7A, the quick view, in the pane; "Read the full entry" opens 7B, which
widens the pane on a desk (`[data-reader]`), folds by section and scrolls to the cited passage
in the highlighter. On a phone both are the full-width right drawer. `console.html?src=<id>`
(and `&reader=1`) opens on a paper. The paper text is a paraphrase written for three papers.

## Rev 29 · the serif never in capitals, cells that never stop (2026-10-16)

**Rule (Pl. 02 `#no-serif-caps`, AGENTS).** The serif is never set in capitals; a label in
capitals is the mono `.eyebrow`. Fixed at the base: `.app h1–h4` set every console heading in
the serif, outranking `.eyebrow`, so the source view's Key assertions, Details and Summary came
out as serif capitals. The rule now skips headings marked `.eyebrow` (same specificity).

**Phone.** The sources count is the buttons' height (`--sp-8`). The composer's sides match its
foot (`--sp-2`), so the chip and send sit at the same inset on three sides; the words keep the
chip label's inset.

**Exploration, Pl. 16 · 4D13.** 4D12's cell swap, constant, its density on a slow wave.

## Rev 30 · closing the library, 4A2 looped (2026-10-16)

**Exploration, Pl. 16 · 6H.** Matt: the count opens the library but another button closes it.
Five ways on `data-shelf` (H0 as built, H1 under the bar, H2 mirrored count in the drawer's
head, H3 bottom sheet, H4 swap with the count as a tab); `console.html` defaults to H1. The
count now toggles (`aria-expanded`) and turns into a cross where it stays visible.

**Exploration, Pl. 16 · 4A2.** Looped through four expressions, eight seconds each (4D1, 4D4,
4D13, 4D11), 32 seconds before it repeats (`[data-glitch-v="seq"]`).

## Rev 31 · the library sheet (2026-10-16)

Matt chose 16 · 6H3 and asked for it taller, rising on open and dragged down to close. Under
1080px the library is now a sheet from the foot to the bottom of the top bar (components.css).
It rises and drops back on a new token, `--mo-sheet` (320ms, decelerating; tokens.json
18.1.0), the one motion that moves a surface, with `@starting-style` for the entrance. Dragging
the handle or head follows the finger; released past a quarter of its height, or flicked, it
closes. Reduced motion makes it instant. H0, H1, H2 and H4 are removed; a paper opened on a
phone opens inside the sheet, and the arrow steps back to the library within it.

## Rev 32 · Open decisions become seven plates (2026-10-16)

Pl. 16 held seven explorations in one section. It is now Part four, Open decisions, and one
plate each: Pl. 16 Line work, 17 The brand line, 18 Documentary images, 19 The floating bar,
20 The margin, 21 The console on a phone, 22 What a paper opens to. The anchors are unchanged
(`#lines`, `#brand-line`, `#documentary`, `#float-nav`, `#structure`, `#console-phone`,
`#paper`); `#open` is now `#part-open`. Codes take the plate number first: 16 · 4A2 is now
18 · A2, 16 · 6H3 is 21 · H3, 16 · 7B is 22 · B; line work keeps 16 · I, V and Z. Comments in
the CSS and scripts follow. Entries above keep the codes they were written with.

## Rev 33 · the brand line, a textured picture, the bar on the body's edge (2026-10-16)

**Decided, Pl. 17 · A.** "Clear evidence for consequential decisions." is the brand line. 17 · B
stays Home's headline and comes off the brand board.

**Pl. 18.** Matt: the view across the Tigris lost the effect in its flat sky and water. Every
documentary picture is now a street of rubble in Mosul's Old City (`doc-mosul-rubble-mono.png`,
`-cell.png` for 18 · B), with the Old City's roofs (`doc-mosul-roofs-mono.png`) as the second
picture in 18 · A1; both Levi Clancy, CC0, Wikimedia Commons, cropped to keep the sky out. The
brand board's BB 7 follows. The old masters stay in media/ unused.

**Pl. 19.** The floating bar's edges sit on the body's inside edges: the `.wrap` gutter
(`--fnav-gut`: `--sp-10`, `--sp-6` under 900px, `--sp-4` under 620px).

## Rev 34 · 18 · D6, the logo when compact, larger margin clips (2026-10-16)

**Pl. 18.** Matt picked D6, the drift, on the dark picture on white (A2). Everything else on
the plate (A1, A3, B, C, D1 to D5 and D7 to D13, A2 looped) moved to
`archive.html#documentary-r34`, with the colour screen and the glitch presets in
`archive/retired.js` (`[data-docglitch-r]`). `system.js` keeps one small driver, `docDrift`.

**Pl. 19.** Compacted, the floating bar keeps the whole logo, dove and wordmark.

**Pl. 20 · A.** The moving images in the margin are larger: the margin widens to 208px (twice
`--sp-26`, was 136) when it carries clips; 88px under a 560px container. The icons are unchanged.

**Pl. 19 · B.** A switch on the plate centres the compacted logo (`data-fnav-align="center"`);
19 · A, at the body's left edge, stays the default.

**Repair.** The Rev 32 script that renumbered codes also matched URL-encoded SVG (`%3E`, `%3C`
read as codes 3E, 3C) in four data URIs in components.css and reference.css, and an SVG path in
prototypes.js (`7A2`). All restored from the pre-Rev-32 copies and checked against them.

## Rev 35 · four decisions taken into the guide (2026-10-16)

- **Pl. 19 · B decided.** Compacted, the floating bar's logo is centred on the page; the switch
  is gone.
- **Pl. 18 · A1 decided, with D6.** The dark picture on a dark band, with the roofs under it, now
  drifts; A2 on white is back in the archive with the rest.
- **The brand line is in the guide.** Pl. 17 is gone; Pl. 06 is now Logo, line and favicon, with
  the line set under the logo (`#brand-line`) and three rules for it.
- **Pl. 16 compares with now, and holds the margin.** A fourth specimen, 16 · Now, shows the line
  work as it stands beside I, V and Z. Pl. 20, the margin, is part of Pl. 16, its options renamed
  16 · M1 (moving image) and 16 · M2 (pixel icon).
- **Pl. 21 and 22 are Stable, in the console.** The console on a phone (`#console-phone`) and what
  a paper opens to (`#paper`) are in Pl. 14 after the console; the paper view's CSS moved from
  explorations.css to components.css.
- Plate numbers were left as they were (16, 18, 19), so the codes already used still point to the
  right plate.
- **The margin's moving image decided (16 · M1, was Pl. 20 · A).** The switch to the pixel icons
  is gone from the plate; the icons stay in the CSS for the pages that already use them.

## Rev 36 · the lines as they stand, the archived A1, the archive renamed (2026-10-16)

- **Pl. 16, decided: the lines as they stand.** I, V and Z are AR 21 in the archive, with their CSS
  in `archive/retired.css`. The plate now shows eight structures in the system's own line work
  (section lockup and rule row, hero, ledger, ledger of figures, objects, the accent rule, and the
  numbered steps twice) under a third rule: a line opens what follows it, and never closes.
- **The Rotary brackets.** `.step` is the one structure whose line closes (`border-bottom`), so a
  run of steps ends on a line and starts without one. 16 · S1 shows it as it is; 16 · S2 proposes
  the ledger's rule (`.steps-open` in explorations.css), which would change Rotary in one rule.
- **Pl. 18 · A1 as archived.** The picture on the dark band runs the first glitch (bursts every two
  to six seconds) instead of the drift; `system.js`'s driver is `docGlitch` again.
- **The archive is AR.** Plates are AR 01 to AR 28, each with the plate it came from; codes and
  option letters inside take the plate number (AR 20 · D6, AR 22 · K).

