# Peace Intel — rules for building UI

Read this before writing any CSS or JSX that renders a user-facing surface.

The golden example is `brand-guide.html`. `landing.html` and `home.html` are the worked
ones: real pages built from this system (they also use shapes still in `explorations.css`; see the table below). Open them. If what you are about to build
would not look like it belongs beside them, stop and reconsider. Imitating them is more reliable
than following these rules from memory.

---

## Before anything: what to trust, what to ignore, what may ship

**Trust, in this order.** `tokens.css`, `components.css`, `explorations.css` and `system.js`
are the system. This file is the rules. `CONSOLE.md` is the console's behaviour and content.
`HANDOFF.md` is the plan for adopting it. `brand-guide.html` and `guide.html` show it.
`console.html` is the console's look and behaviour. If two disagree, the CSS wins and the
explanation is the bug.

**Ignore these, even though they look authoritative:**

| File | What it is |
|---|---|
| `CHANGELOG.md` | History. Many entries were reversed later; it is never a rule. Read it for why, not what. |
| `archive.html`, everything in `archive/` | What was cut: retired CSS and scripts, old drafts (`explore-*.html`, the sans and serif tests). Its codes start AR. Never load `archive/` from a page that ships. |
| `audit/` | A survey of the production site taken in September. Evidence of the old state, not a target. |
| The repo root above `handoff/`: `app.html`, `app-v2.html` to `app-v6.html`, `index.html`, `rotary-a/b/c.html`, `use-cases*.html` and the other root pages | Earlier mockups, before this system. The `app*` files are **older consoles**: do not take a layout, a class or a value from them. |
| `DESIGN-TOKENS.md` at the repo root | The July token guide. **Superseded** by `tokens.css`. |
| In the production repo: `rotary/handoff/` | An older copy of this package. Replace it from here or delete it. |
| In the production repo: `StyleGuide.jsx` | A static copy of old token values. |
| `prototypes.js` as code | It is a mock to read for behaviour. Do not port it. |

**What may ship.**

| Status | Means | What has it |
|---|---|---|
| **Stable** | Ship it. | Everything in `components.css`. That now includes, since Rev 39: the console entire (shell, chat, library, composer, the answer's sources and foot, projects, context, memory, artifacts, dialogs, the finder, the phone console, what a paper opens to; `CONSOLE.md`), the veil and the still (`.veil`, `.vmap--still`), the margin with its moving image (`.st-*`, Pl. 16 · M1), the floating bar (`.fnav`, Pl. 19 · B) and the numbered steps' opening rule (Pl. 16 · S2). The brand line (Pl. 06), and plates marked Stable |
| **Used by a worked page, still in `explorations.css`** | Decided, and shipping with that page; do not reuse elsewhere without asking. | The documentary picture (Pl. 18 · A1, `.doc-fig`, `.doc-shot`, `.doc-dark`, `[data-docglitch]`), on Home since Rev 38; Home's ask (`.ask`, `textarea.pt`) |
| **Exploration** | In the handoff, labelled; do not build without asking. | The landing sections on `sections.html` (`.lp-*`, Rev 59); the ask's new forms (Pl. 17, four options); the report and the deck (`report.html`, `slides.html`, `.viz`, `.forest`) |
| **Internal** | Not for production at all. | `brand-board.html`; the console's version badge and the staff-only "All users" view are internal features of the product, specified in `CONSOLE.md` |
| **Archived** | Never. | Anything in `archive.html` or `archive/` (codes start AR) |

---

## The rules

**0. Never hardcode a radius. Every corner is 4px.** One named exception: `--r-check`, 2px, the questions card's 12px checkbox, which at 4px reads as round (Rev 63).
Decided 2026-10-15 (it was 2px for small things and 4px for the rest from 2026-09-25). Buttons,
inputs, cards, pills, chips, badges and the focus ring all take 4px; `--r-full` is for things
that are actually round (avatars, status dots). The six names survive, so a component keeps the
name that says what it is and adoption is a values swap. Writing a literal `4px` is how one
component stops following the system the next time the corner moves.

**1. Never write a raw value.**
No hex, no rgb, no pixel sizes, no letter-spacings. Every value comes from a token in
`tokens.css`. If you need a value that does not exist, add it to the scale first, with a
rationale, then use it. A value that is not on a scale is a bug, not a preference.

If a component genuinely sits between two scale steps and snapping either way changes the
design, add a **named component token** in Layer 4 of `tokens.css` with a comment saying why.
`--t-btn: 14px` is one: buttons fall between `--t-ui` (13) and `--t-body` (16), and 14 is the
established value everywhere. Naming it means it shows up in a grep and cannot be mistaken for
an improvised number. The one exception to "no raw literals" is `#000` inside a `mask-image`
gradient, where the value is an alpha channel and a colour token would be wrong.

**2. Assemble pages from blocks.**
Layout comes from the catalog in `components.css`: `band`, `wrap`, `sec-head`, `grid-2/3`,
`rule-row`, `card`, `prompt`, `step`, `callout`, and the page blocks real pages added since
(`stack`, `ledger`, `fig-split`, `hero-stack`, `scrolly`, `checks`, `orgs`, `screen`), shown in
Pl. 12. Write content and pick blocks. Do not write
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

**5. Accent means something, and there are three accent tokens.**
`--accent` marks evidence, primary action, focus and active state. It is not decoration. More
than three or four accented spots in a view means it is over-accented. **An eyebrow takes the accent
only when it names a state the accent already means** (decided 2026-10-09): evidence held
(*Ingested*, *Tier 1*), a verdict (*Correct*), something live (*Now in pilot*). A section label
or a card category stays neutral, however important it is. The accent is warm
orange; the brown was reviewed and rejected on 2026-09-24.

| Token | Use |
|---|---|
| `--accent` | graphics, fills, rules, type at 24px and above |
| `--accent-text` | any text under 24px **on a neutral surface** |
| `--accent-fill` + `--on-accent` | a filled accent control, always written as a pair |

**There is no legible text colour on brand orange.** `#D9481C` measures 4.29:1 under white and
4.33:1 under ink, so a solid orange button with 14px type fails AA whichever way you turn it.
On light, `--accent-fill` steps down to the darker orange (5.26:1 under white). On dark the
accent is already lighter, so the fill stays and `--on-accent` becomes ink (6.66:1). Never
write `--accent` as a background with a literal white on it.

**Every call to action is `.btn.tint`** (decided 2026-10-14, final form 2026-10-15). The accent
as a 9% wash with a solid `--accent-text` edge and label, and an arrow drawn by the class itself;
on a dark band the wash doubles. It clears AA on every surface with no token pair. A second
action beside it is `.btn.ghost`, which never has an arrow. Do not add an arrow to the markup:
the button draws it. That is the whole button set: the ink `.btn.primary`,
the solid `.btn.brand`, the gradient `.btn.grad` and the secondary `.btn-ink` are retired and in
`archive.html`. **The tint means you can act on this, so nothing that cannot be clicked wears
it** (2026-10-15). A citation chip opens its source and keeps its tint; an evidence badge only
labels and is ink. A button is kept apart from a citation by form (sans against mono) and by
place: **never inside an answer, a citation list or the evidence pane.** `.send`, the composer
submit, wears the tint too (2026-10-15), and the same pixel arrow, drawn by the class: the markup
is an empty button with an `aria-label`. In the composer's bar it is 32px, like every control
there, and the microphone sits against it at the right (see the quick reference).

**Icons: lines in controls, pixels in content** (2026-10-15). A control's icon is a Lucide line
icon inlined as `svg.glyph` (18px, 1.5 stroke, `currentColor`), never a pixel icon: inside an
interface the pixel marks read as noise. A page icon that labels a claim is a `.px-icon` from
`media/mkicons.cjs` (25 cells at 2px, each a centred three-quarter square), in ink, usually in
`.points`. **Two pixel marks are deliberate exceptions in the console:** the arrow of
`.btn.tint` and `.send` (`--px-arrow`, the mark of the action), and the marks that head the
console's two sides (`.pane-head .ph-mark`, drawn by hand at 11 x 10 cells, solid): the library's
shelf of books (`media/icons/library-mark.svg`) and the rail's speech bubble
(`media/icons/chats-mark.svg`). Add no others to a control.

**There is no gradient** (removed 2026-10-15, for now). `--grad` and `--pi-grad` are gone, with
every use of them; they are in `archive/retired.css`.

**5b. Tone sets back; the edge makes an object** (renamed 2026-10-16).
`--ground` is a *region* set back from the page: a band (`.surface--ground`), the tray's recess,
2% ink. `--ground-2` is further back, 4%: the console's rail, library and project page
(`.surface--ground-2`), never a marketing page. `--face` is an *object* on a ground: a card, a
library entry, the open chat; it is the page tone, and its edge, `--edge`, does the lifting.
`--fill` is a small object that is itself set back: a badge, an avatar, the user's message. A card
at the band's tone on a band is the same tone twice; never fill a card with a ground, and never
put an edge round a ground. The old names `--panel`, `--panel-face` and `--panel-border` are
aliases for production only; **do not write them.**

On near-black, set back and lifted are both lighter, so one tone does both and a card on a dark
band is the ground tone. In light mode **the inside of a card is white**; the edge does the work.

**5c. Lines: weight is state, colour is role** (Pl. 04, 2026-10-16). A 1px line is structure; a
2px line marks where you are (ink: a tab; the blank's underline is the exception, in `--accent-text` with the tint's wash at rest, since 19 Oct, so a choice in a sentence reads as one) or what is evidence (accent: a
callout's rule). `--line` decorates, `--line-2` bounds what you act on and opens a group,
`--ink-35` is an edge under the pointer. A rule row's verticals only ever fall between two items;
its outer edges are open and its outer text is flush with the heading. A new grammar for lines
and lockups is decided: the lines as they stand (Pl. 16). A line opens what follows it and never closes; the numbered steps took that rule too on 16 October (`.step` has its hairline on top, the first of a run at `--line-2`). Do not
invent a line grammar in a page.

**6. Vary the surface down a page, and spend warm sparingly.**
A page is a sequence of surfaces, not one tone with cards on it. Put `.surface--ground`,
`.surface--invert` or `.on-dark` on bands and alternate them. Surface contexts remap the
tokens, so components inside need no overrides and there is no dark variant of anything.

**There is no `.surface--warm`, and there will not be one.** Removed 2026-09-25. A band of the
emphasis tone turns it into a second page tone, which is how the tone stopped meaning anything
the first time.

**There is no dark theme** (removed 2026-10-14: too heavy for the brand). No `data-theme`, no
`[data-theme="dark"]` rule, nothing to check twice. **A page may have more than one dark
section** (2026-10-15; it was one). A dark band is the strongest emphasis the system has and it
costs no chroma, which makes it the right tool for a reader who will not be shouted at: the
closing call to action, a single claim, the figure the page exists for, the footer. **Two dark
bands never sit back to back**; a light band goes between them.

**Resolved 2026-09-24. There is one raised surface and no switch.** Hairline, wash and warm
were never alternatives to each other: a hairline is an *edge*, a wash is a *face*, warm is an
*exception*. A raised surface wants an edge and a face: the edge is `--edge`, the face is `--face`, and
the ground under it is `--ground`, a wash of **two percent ink**. That is the whole treatment.

**Everything came down a step on 2026-09-25.** The wash from 3% to 2%, `--line` from .12 to
.08, `--line-2` from .18 to .14. No single value was wrong; the system had drifted heavy, and a
page of twelve cards was twelve announcements. **The elevations were refined again on
2026-10-15**: a one-pixel contact shadow plus a short ambient one pulled in by a negative
spread, so a lift reads as paper resting on paper.
`--line-2` stays heavier than `--line` and does not go below .12, because a control whose
boundary you have to hunt for is a worse failure than a border darker than the divider next to
it.

Cards are opaque. (`.card.sheer`, the translucent face, was retired on 2026-10-15: no page
used it.)

**Warm has three uses and no others:** callouts (`.callout`), violators (`.violator`), and the
gradient field ramp, where it is the paper tone at one step of ink rather than the chroma. It
is not a card background and not a band fill. A warm card in a grid of cards is the old system
leaking through. If two warm things are visible at once, something is over-emphasised.

**7. Texture is free to use, always faded, never on two sections that touch, and everything on
it is opaque.**
Use the dashed grid on as many sections as a page wants (2026-10-15; it used to be rationed),
with `.textured` and one of its masks: centre, `--top`, `--band`, `--left`, `--right`, or
`--side` for a hero. **Two textured sections never touch**: put a plain band between them, or
the fades meet and the grid reads as wallpaper with a crease in it. **Every texture fades
out** — a vignette mask, a band mask, or the algorithmic falloff the canvas version uses. A hard-edged rectangle of grid reads as a panel somebody forgot to style; the
same texture with dissolved edges reads as atmosphere, and the difference is one line of
`mask-image`. Anything sitting on texture must have an opaque face or the dashes read through
as dirt. **Texture does not go on top of imagery** — two textures in one rectangle read as a
screen door.

**8. One loud thing per page.**
Media runs in four tiers: hero motion, band texture, figure, grid vignette. At most one tier-1
element per page and never two tiers competing in one viewport. Every motion asset is dithered:
medium cell, mono Bayer, seven levels, or it will look imported.

**A veil and a map are two different objects**, and the distinction is what the footage is
*for*, not how it was shot.

`.veil` is **atmosphere**: a subject on a seamless, where the white ground blends away entirely
and a dithered silhouette floats on the paper with no box and no edge. It sits *behind* type,
inside a composition, under a headline, and nothing on top of it needs an opaque face because
as far as the copy is concerned the veil is behind the page. The dove and the magnifying glass
are veils and always were. Its edges always fade; the mask is part of the class.

`.vmap--still` is the veil's still form: a photograph of a subject on a seamless, mapped through
the same monochrome ramp so its white ground becomes the page. Home and Rotary use it for
figures. Ship one **continuous-tone greyscale** master and let the runtime map and dither it, so
it follows the tokens. **The video map**, footage that fills its frame shown full-bleed
(`.vmap--bleed`, `.vmap--dissolve`), **was retired on 2026-10-15** and is in the archive. A clip
with no white ground to lose has no place on a page for now.

Every hidden start state is gated behind `[data-js]`. Animation is never load-bearing for
legibility, and all of it is killed by `prefers-reduced-motion`.

**Two named exceptions to "motion is a closed set"** (decided 16 October). The two drawers on a
phone (chats from the left, library from the right) and the phone's top bar slide on `--mo-sheet`, the one motion that moves a surface. And the glitch on a
documentary picture (`[data-docglitch]`, `system.js` `docGlitch`) runs on its own timer, the one
timed effect: bursts every two to six seconds, only while the picture is on screen, off with
reduced motion. Neither licenses another; a third is a proposal to Matt.

**10. There is no mount** (retired 2026-10-14). Eight framing devices were built for "the one
figure a page exists to show" and all are in `archive.html`. Dissolve went with the video map, retired 2026-10-15.

**A card is raised by its edge, and only by its edge** (decided 2026-10-09). The hairline does
the raising; there is no second card treatment.

**Nothing casts a shadow at rest** (2026-10-16, Rev 22). The selected tray option, the prompt,
the composer, the console frame and the PDF page lost theirs; a shadow appears only under the
pointer or while you type, or on what truly floats (a menu, a dialog).

**Elevation and hover are for things you can click** (Matt, 2026-10-09). A shadow, a lift or a
hover change on a card means the card is a link or a button, never a `<div>` that goes nowhere.
**A card never takes a shadow, a lift or an outline on hover** (2026-10-15): shadows mean a
layer floats. The default clickable card is a static `.card` with a button in its foot, so the
button is the affordance. A card that is wholly a link is `.card.go` (adopted 2026-10-16, Pl. 09): it
carries the call to action's pixel arrow in its corner at rest, and under the pointer its edge
darkens and the arrow steps a cell. A row with no box that goes somewhere (a project's chats)
shows the same arrow at its end under the pointer. Never mix linked and static cards in one row.

---

## Quick reference

| Need | Use |
|---|---|
| Section wrapper | `.band` (`.band--dark`) |
| Content column | `.wrap` |
| Section heading | `.sec-head` with `h2`, optional `.h-alt`, optional `p` |
| Never | The serif in capitals. A label in capitals is mono, `.eyebrow`, even on a heading element (Pl. 02 `#no-serif-caps`) |
| Mono uppercase label | `.eyebrow` (`.eb-2`, `.eb-3`, `.eb-4`; `.faint`, `.accent`). `.accent` only for a state: Ingested, Tier 1, Correct, Now in pilot |
| Call to action | `.btn.tint` (`.sm`, `.lg`) — the accent as a wash, a solid edge and the pixel arrow the class draws. Never in an answer, citation list or evidence pane. Pl. 09 shows every size on every surface |
| Second action beside it | `.btn.ghost` |
| A choice among options | `.pills.tray` or `.seg`; the chosen one is `.active` / `aria-pressed="true"`. The recess is `--tray`: the ground tone on paper. On `.surface--ground` or `-2` a `.seg`'s options read `--ink-70`, because `--ink-55` on that recess is 4.38:1 |
| A toggle on its own | `.pill.active`, `.act.on` (ink) |
| Solid ink label | `.chip` |
| Outlined utility action | `.act` (`.sm`, `.on`) |
| Card | `.card` (`.raised`). Clickable: on an `<a href>` |
| Pulled-out note | `.callout` — warm, one of its three permitted uses |
| Badge breaking an edge | `.violator` inside `.has-violator` |
| Citation | `.cite` + `.t1`/`.t2`/`.t3` (accent: it can be clicked) |
| Evidence label | `.evi-badge` + `.t1`/`.t2`/`.t3` (ink: filled, hollow, dashed) |
| Band surface | `.surface--ground` / `.surface--invert` / `.on-dark`. **No warm band.** `.surface--ground-2` is the console's sides only |
| A tone for a surface | `--ground` (a region), `--ground-2` (the console's sides), `--face` (an object on a ground), `--fill` (a badge, an avatar, the user's message), `--edge` (an object's hairline). Pl. 04 |
| A line | Pl. 04's inventory: divider `--line`, edge `--edge`, rule row, ledger, 2px ink tab, 2px accent rule, legend. A line opens what follows it, never closes (Pl. 16); `.step` is the exception under review (16 · S2); the logo's brackets are not a page line (retired 2026-10-16) |
| A number in front of something (01, 02, 1.1) | Only when the order or the number is real: steps done in order (Rotary), sections cited by number (the report, the numbered document), slides. Never as decoration on a set of equal things; a row of three features is unnumbered (2026-10-16) |
| A top bar that floats | Decided (Pl. 19 · B), on Home since Rev 38: `header.fnav[data-fnav]` > `.fnav-in` > `.fnav-mark` + `nav.fnav-links`; opaque, `--face` and `--edge`, no blur; `system.js` compacts it to the whole logo, centred on the page, on the way down, and a tap on the logo opens it. It takes no room in the flow, so a `.screen` straight after it is the whole window. Landing and Rotary keep `.nav` |
| A headline | Two lines at most: about 32 to 40 characters at `--t-display` (64px). A longer thought is a headline and a lede (Pl. 02 `#headline-length`, a note for writers) |
| A documentary photograph | Decided (Pl. 18 · A1), on Home's corpus band since Rev 38 as `figure.doc-fig` > `.vmap.doc-shot.doc-dark[data-vmap][data-docglitch][data-vmode="scene"]` + `figcaption`: dark and monochrome on a dark band, `.vmap.doc-dark[data-docglitch]` in `.on-dark`, with the glitch's bursts; a place, never suffering, textured from edge to edge (a flat sky or water gives the dither nothing), captioned with place, date and credit, one per page as a figure. `.vmap.doc-shot.doc-dark` on a dark band, or `.vmap.doc-shot[data-docscreen]` (colour through the dither) |
| The console on a phone | Stable (components.css, shown in Pl. 14 `#console-phone`). Under 620px: one-row composer bar with an outlined `.cb-mode` chip and menu; an off-white toolbar holding the crumb, `.src-tick` (a `.cite` counting the chat's sources, opens the library) and `.cb-util` (search this chat, share, export). Under 1080px: `.app-burger` opens the rail as a drawer with the console links at its foot, `.src-tick` raises the library as a sheet to the foot of the top bar on `--mo-sheet`, closed by a drag down, the scrim, Escape or its cross (`data-drawer`, `.app-scrim`, `.is-sheet-off`, `--sheet-y`). Search from a thread defaults to This chat; Share has General access with a public option (`.pop-access`) |
| What a paper opens to | Stable (components.css, Pl. 14 `#paper`): `[data-act="src"]` on a citation or library row opens `.src-q` in the pane; the full entry `.src-r` widens the pane via `[data-reader]`; cited passages in `.src-hl` take `--hl`. On a phone the console's top bar hides on scroll down (`.is-top-off`) |
| The identity on one page | `brand-board.html` (Exploration), built from the CSS |
| The brand line | "Clear evidence for consequential decisions." Stable (Pl. 06 `#brand-line`). Where the brand speaks in a few words: brand board, report cover, deck title, badge, under the logo. On a page, `.brand-sign` > the logo `img` + `p.brand-line` (Home's footer, the dark logo on a dark band) |
| A still figure | `.vmap--still` (Pl. 07 `#stills`): a subject on a seamless, one per screen, beside copy; a series shares one recurring subject |
| A card that is a link | `a.card.go[href]`, the pixel arrow in its corner. Pl. 09 |
| Emphasis tone | `--warm`, through `.callout` and `.violator` only |
| Grid texture | `.textured` (`--top`, `--band`, `--left`, `--right`, `--side`). Never on two touching sections |
| Corners | `--r-*` only, never a literal. Every one is 4px; `--r-full` for round; `--r-check` (2px) for a checkbox |
| Entry motion | `.mo-deal` on the container |
| A surface moving | `--mo-sheet`, the phone's two drawers and its top bar only (Rev 49, 53); nothing else slides |
| Heading group | `.lockup` + `--hero` / `--section` |
| App shell | `.app`, `.app-top`, `.app-nav`, `.app-rail`, `.app-main`, `.app-tools`, `.app-pane`, `.composer` |
| Console parts | `.icon-btn` (`.line`, `aria-pressed`), `.glyph` (a Lucide line), `.avatar`, `.rail-body`, `kbd`, `.tools-rail`, `.pane-meta`, `.pane-tools`, `.pane-search`, `.pane-head .ph-mark`, `.lib-item` (title tracked `--t-ui-ls`), `.act .glyph` (a menu chevron) |
| The composer's bar | `.composer-bar`: every control `--sp-8` tall; only the tray and `.send` have a face. What shapes the answer sits at the left; the microphone (outlined) and `.send`, both 32px squares, sit together at the right in `.cb-send` |
| Questions before the research | `form.clarify` (H1.19, `console-parts.html`): `.cq-h` (a neutral `.eyebrow` count, Back as `.act.sm`), `.cq-steps` (`i.done` is the 2px ink line), `.cq-b` (`.cq-q`, the one serif line; `.cq-help`), `fieldset.cq-opts` of `label.cq-opt` (radio or checkbox; the chosen one rises as a face tile; keyboard focus is the option's edge in the middle grey, `--ink-35`, never the accent ring; a checkbox's corner is `--r-check`), `.cq-own` for *Write my own answer*, `.cq-f` (`.btn.ghost` Skip, `.btn.tint` Next). Answered, the answers become the reader's message; skipped, `.cq-done` |
| Research updates | `details.ru` > `summary` (faint mono count + chevron) + `ol.ru-list` (each `li`: `.eyebrow.eb-4` "Update N", then `p`). While working the newest update is the pending answer's text; done, all fold above the answer. Never warm, never an accent rule (H1.20) |
| A search match in a chat | The matched words, every occurrence, in `--hl-find` through `::highlight(find)` (`mark.find-hl` without the API); never a box round the message, never `--hl`, which is a cited passage (Rev 61) |
| A toolbar's controls | Every `.act`, `.icon-btn` and `.btn` in `.app-tools` is `--sp-8` tall, as in the composer's bar (Rev 62) |
| Editing a spreadsheet | *Edit table* (`.act`) beside Rename's pencil; Cancel `.btn.ghost.sm`, Save `.btn.tint.sm`; the table keeps its reading layout and the cell being edited is `textarea.sheet-edit`, a field in place. Rename is in place too, at the title's size (`.pj-rename`) |
| Grid in the console | `.textured` on `.app-main`, the column, which does not scroll, so the grid holds still under the chat. Never on `.app-scroll` |
| Something you open, keep and send | `.obj` with what it is in `data-kind`: a paper's type (Empirical study, Case study, Dissertation, Policy report, Dataset) or an artifact's kind (Document, Spreadsheet, PDF), set into its top edge. The meta line under the title then leaves the type out. Set `--obj-ground` to the surface under it if that is not the page |
| A modal dialog's backdrop | `--scrim` |
| A tier mark in copy | Type the character: `●` `◐` `↗`. The PI Marks face, first in every font stack, draws them the same everywhere. Never an image, an icon font or another glyph |
| The smallest type | `--eb-4`, 10px. Nothing in the system is set smaller |
| Favicon | In every page's `<head>`, after the title: `media/favicon.svg`, `media/favicon.ico`, `media/apple-touch-icon.png` (copy them from `landing.html`). The logo's four brackets, empty, on an opaque white tile, no border, each bracket one line weight set one line weight in (2026-10-16, Rev 21) |
| Print | Automatic, from `components.css`: A4, dark bands print as paper, no video or grid, nothing split across pages. `[data-print-as-is]` keeps a band dark |
| A report or a deck | `report.html` and `slides.html` are the templates (exploration): copy one, keep its structure, replace the content |
| A chart or an interval | The forest plot in `report.html` (exploration, `.viz`, `.forest`): one accent per chart, values in mono. Pl. 22's bars, series and map were removed on 2026-10-15 and are in the archive |
| Folding the rail or the pane | `data-rail="off"` / `data-pane="off"` on `.app`; Expand sets both. A folded side is a `.shelf`, `--rail-collapsed` or `--pane-collapsed` wide: its divider stays and `panel-left-open` / `panel-right-open` sits where `panel-left-close` / `panel-right-close` was. The rail's tools go with it |
| Hovering a row with no box | The pixel arrow appears at the row's end and steps a cell (`.pj-row`, Matt's pick, 2026-10-16). Never turn the words `--accent-text` |
| Sans text | `font-family: var(--sans)`: **Barlow** since 2026-10-16 (replaced DIN 2014, which needed a paid licence), 400 / 600 / 700, at the system's tracking. Never set a sans letter-spacing by hand; `--t-ui-ls` is 0 |
| A serif heading | `font-family: var(--serif)` (Source Serif 4) at `font-weight: var(--serif-w)` (400); at `--t-display` or `--t-h1`, `var(--serif-w-display)` (400 since Rev 22, was 500; keep using the token). **Never a literal weight, and never bold**: Nanum was replaced on 2026-10-15 and the brand reads light. The candidates and the test bench (`archive/type-test.html`) are in the archive |
| The rail or the pane | Built alike: `.pane-head` (mark, `.ph-t`, its tools as `.icon-btn`s, fold), then the scrolling body: the column on `.surface--ground-2` with the open chat on `--face`, or the library's `.pane-tools` and `.pane-body` |
| The chat's grid | `.textured.textured--bottom` on `.app-main`: held at the foot, fading upward |
| Finding a chat | The finder (exploration): the rail head's search icon, `.tools-rail` or Cmd K opens `dialog.dlg[data-view="search"]` (`.find-*`): a type tray, recents and actions, quoted matches, arrow keys and Enter. Papers stay in the library's own search |
| Icon in content | `svg.px-icon`, from `media/mkicons.cjs`; a row of claims is `.points` (five columns; `.points--4` for four) |
| App shell as a screenshot | `.app[data-figure]` — shows all its content, never scrolls |
| Small caption or aside | `.note` |
| Horizontal group with a gap | `.row` (`.col`, `.tight`) |
| Blocks inside a band, at the section gap | `.stack` |
| Section heading that is a whole sentence | `.sec-head.wide` |
| Heading in a rule-row cell | `.rule-row h3`, then `.prose` for content or `.note` for a caption |
| Vertical run of entries | `.ledger` (`--split` label and statement, `--figures` aligned numbers) |
| Figure beside the claim it proves | `.fig-split` (`--even` for a half-and-half split) |
| Copy over a veil | `.hero-stack` on the band, `.veil.veil--behind` inside it |
| Steps beside one sticky figure | `.scrolly` + `data-scrolly` (`--flip`, `--full`) |
| Proof points between a promise and its action | `ul.checks`. Three, rarely four |
| Partner marks | `.orgs`. On a dark band, `.foot-logo` with the partners' reversed files |
| Full-height stop | `.screen` + `data-land`; children timed with `data-at` |
| One stop per gesture, desktop only | `html[data-snap]` |
| Top bar and footer | `.nav` + `.nav-mark`; `.foot-cols` + `.foot-logo` + `.foot-bar` |
| Texture that develops as a band arrives | `.gx.gx--render` + `data-gx`, a `canvas.gx-c` as first child. Ink only, organic order, never looped |
| Ethereal subject clip | `.veil` (`--behind`, `--band`, `--foot`) |
| A still subject, mapped | `.vmap.vmap--still` + `data-vmap` + `data-vmode="subject"`, a greyscale master inside |
| The logo | Version 6 (2026-10-16), the image, never typed: `media/peaceintel-logo-light.png` (`-dark.png` on a dark band) in `.nav-mark`. At least 24px tall; below that, the favicon mark. Clear space half its height. Pl. 06 |
| A state: empty, working, no results, error, done | A sentence where the result will appear, in ink (Pl. 13): `.app-empty`, `.pj-empty`, a pending answer's own text, `.pop-err` beside the field, the pressed control's own label. No spinner, toast, illustration or red |
| Light or dark native controls | Nothing to do: `tokens.css` sets `color-scheme: light` on the root and `dark` on dark bands |

**`explorations.css` is not the catalog.** It holds what is shown in Open decisions (Pl. 16, 18 and 19)
because it has not been chosen yet: line work (`.lw[data-lw]`, and the raster lines `[data-lr]`,
drawn by `system.js`), the floating top bar (`.fnav[data-fnav]`), the margin (`.st-*`, and
`.st-m`, the moving image in it), the console's projects with their
context, memory, artifacts, sharing, dialogs and the finder, the report and deck templates, the
veil, and the ask from the home page (`.ask`, `textarea.pt`, and the PROMPTS driver). Do not use
any of it in production without asking Matt. `prototypes.js` drives `console.html`, the console
prototype; it is a deliverable to match, not code for the product.

**One treated clip per viewport.** Measured: one clip mapped at runtime holds 121fps; the
mapping pass is 1.3ms a frame. The cost is compositing upscaled frames, so it tracks how much
treated moving picture is painted in one view, not how many files are loaded. Two in one
viewport wants measuring before it ships. Do not use them in production. When one is picked it
moves into `components.css` with its rationale and the exploration file shrinks.

Three things from that file are already settled enough to state as rules if any of it does
land. Copy over a canvas must be measured against the canvas's **darkest rendered pixel**,
not against its declared colours. No canvas in there is ever load-bearing for legibility. And a
**live** canvas is held to a pixel budget, because its cost is area rather than size on screen:
a full-height canvas at a 3px cell is about ninety thousand pixels ten times a second, which will
lock a tab. Coarsen the cell instead of shrinking the element.

**A choice among options sits in a tray** (decided 2026-10-14). `.pills.tray` or `.seg`: the
options sit in a recess, `--tray`, and the chosen one rises out of it as a tile of
`--face` with a hairline and `--elev-1`. On paper the recess is the ground tone (2026-10-15);
on a ground it is a wash of shadow, and on a dark band it darkens. Ink never marks a choice inside a group. A toggle
on its own, outside a group (`.pill.active`, `.act.on`), still fills with ink.

---

## Do not

- Invent a type size. `index.html` used 19 whole-pixel sizes; generated pages reached 32,
  including 8.5px and 14.5px.
- Write off-grid spacing. Every space is a `--sp-*` step.
- Re-declare a shared rule after the block to change it. Edit the block.
- Give one class two meanings. `.chip` meant a solid pill in four files and bare text in two.
  `.cta` meant a button in one lineage and a section in another. `.field` meant a form field
  and a gradient field at the same time, which put a gradient behind every form label on the
  first page that used both; the gradient one is `.gfield` now.
- Make a band of the warm tone. Warm is a colour with two uses, callouts and violators; a band of it is a second page tone.
- Write `--accent` as a background with a literal white on it. Use `--accent-fill` + `--on-accent`.
- Put chroma in texture or imagery. The grid and the veil are ink; the biggest object on a page sets its colour.
- Time a reveal like a control. 320ms is right for a hover and invisible for an entry.
- Give a card the same tone as the band it sits on. Use `--face`, not `--ground`.
- Write `--panel`, `--panel-face` or `--panel-border`. They are production's aliases.
- Put a vertical rule at the outer edge of a row, or give the row's first item its own left gutter.
- Inset a clip that has no white background. A map goes edge to edge or it is the wrong asset.
- Ship a still gradient field. At this weight a still field is an uneven sheet of paper.
- Use a gradient. There is none (2026-10-15).
- Tint something that cannot be clicked. The tint means act.
- Put two textured sections, or two dark bands, back to back.
- Put a call to action in ink or a solid accent fill. Actions are `.btn.tint`, with `.btn.ghost` beside it.
- Reach for any entry primitive but `.mo-deal`. Resolve, develop, focus, rule and the older
  candidates are all deleted.
- Close a row of separated items with a bottom rule. `.rule-row` draws one line, on top.
- Use `--ink-35` as a text colour. It is 3.11:1 — lines, hover borders, disabled states and
  dashed rules only. Micro labels take `--ink-55`.
- Style a page with a class that only exists in another page's `<style>` block. If a utility
  is worth using twice it goes in `components.css`.
- Wallpaper the grid: a page-wide, unmasked grid. Texture on many sections is fine; texture
  with no fade is not.
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
gradient of trust reads solid, hollow, dashed. An evidence badge, which only labels, takes the
same three shapes in ink. Do not restyle it away or collapse the tiers.

**The library never takes the full screen.** In the app, chat and composer stay visible.
Widening the evidence pane collapses the threads rail instead. The pane is `.surface--ground-2`,
so each entry lifts off it as an object.

**Context goes in, artifacts come out** (2026-10-15; Stable since Rev 39). There is no separate Reports area: a report is a document artifact inside its project (Matt, 16 Oct). A project's **context** is
what its chats draw on beside the library: uploaded files, notes, papers picked from the
library. Its **artifacts** are what its chats make: a written document, a spreadsheet, a PDF.
An upload is always context. On a project's page the right-hand pane is the project's panel
(instructions, context, memory, sharing), not the library; in a chat it is the library again.
Nothing in a project chat's composer names the project: the breadcrumb does.

**The two sides of the console are built alike** (2026-10-15). The rail and the library pane each
open with a `.pane-head` (a hand-drawn pixel mark, the name, the rail's two tools as icons, the
fold button), then a body that scrolls; the library adds its search and sort between them. The
rail and the pane are `.surface--ground-2` (4% ink) and the open chat is the page tone, so the
conversation is the brightest thing on screen. Their folds are one mirrored pair of glyphs. A new chat from the rail's head starts
outside any project; **New chat here** under an open project starts one inside it.

**Every answer ends with its sources** (16 Oct). The answer foot (`.ans-foot`), folded to a strip of
its citation marks, lists what it cited in the order cited, each row led by its mark and ended by the pixel arrow (`--px-arrow-out` for a web source, which leaves the platform); each row opens the paper's
quick view before anything leaves the platform, and the quick view says where the original source
link goes. Under it, one quiet line: the tools used (folded), copy with citations, and the two votes.

**Eirene is an answer mode**, beside Quick, Normal and Deep research, not a link in the top bar (16 Oct).

**Shell state lives in data attributes** on the wrapper (`data-view`, `data-rail`,
`data-pane`), not in class soup.

---

## Before you say it is done

1. No hex, rgb or raw px in what you wrote. Grep for it.
2. Every font-size is a scale step; every space is on the 4px grid.
3. It renders correctly on the page, on `.surface--ground`, and inside `.on-dark` if it can
   appear there.
4. Text contrast meets 4.5:1, or 3:1 for large text and UI components. **Measure it from the
   rendered element against its composited background**, not from the token sheet. Checking
   token pairs tells you a token is safe; it does not tell you which token a component reached
   for. Every contrast failure found in this system so far was found the second way — nine on
   the landing page, seven in the reference page's own chrome, and white on the accent fill.
5. Keyboard focus is visible on every interactive element.
6. Nothing is invisible with JavaScript off.
7. It still looks like `brand-guide.html`.

**The archive's codes start AR.** `archive.html` numbers its plates AR 01 to AR 28 in page order, each saying which plate it came from, and the options inside take the plate's number: AR 20 · D6 is option D6 on AR 20. A code without AR is live.
