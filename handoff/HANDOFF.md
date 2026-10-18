# Peace Intel design system — handoff

**For:** Nathanael Miksis and his coding agent
**From:** Matt Gillespie
**Updated:** 2026-10-17 (Rev 47). The history of every revision is in `CHANGELOG.md`; it is history, not instructions.

---

## Start here

1. Open `brand-guide.html` and read **Start here** (Pl. 00). It is one screen.
2. Open `console.html`: the console as a working prototype, the behaviour to match. Read
   `CONSOLE.md` beside it: what the prototype does, what is mock content, and what production has
   that the prototype does not (with Matt's verdicts).
3. Give `AGENTS.md` to your coding agent. Its first section says what to trust, what to ignore
   and what may ship. It holds the rules; this file holds the plan.

Everything marked **Stable** may ship, and that is now nearly everything: the whole console, the
veil, the margin, the floating bar. What is left in `explorations.css` is either shipping with one
page (Home's documentary picture and its ask) or an Exploration in this handoff on purpose (the
ask's new forms, Pl. 17; the report and the deck). AGENTS.md's first section has the table.

---

## What changed since you last looked

If you, or your agent, read an earlier copy of this package or the July `DESIGN-TOKENS.md`, these
no longer hold:

| Was | Is now |
|---|---|
| DIN 2014 (or DM Sans) for the sans | **Barlow**, free (SIL OFL), self-hosted; DM Sans is only its fallback. Tracking 0. |
| Nanum Myeongjo for the serif | **Source Serif 4**, at 400. Nothing serif is bold, and the serif is never set in capitals. |
| A dark theme, `[data-theme="dark"]` | **One theme.** Dark is a band (`.on-dark`), not a mode. |
| The brown accent, `#8a5a2b` | **Orange**, split into `--accent`, `--accent-text` and `--accent-fill`. |
| `--panel`, `--panel-face`, `--panel-border` | `--ground`, `--face`, `--edge` (old names are aliases only). `--ground-2` is the console's sides. |
| Display 46px, h1 36px, body 15px | Display **64px**, h1 **48px**, body **16px**; on screens up to 900px, 44 / 36. |
| Shadows on cards, the prompt, the composer | **Nothing casts a shadow at rest**; a shadow means hover or focus. |
| Corners 2px and 4px | **Every corner 4px**; `--r-full` for round things. |
| A gradient, gradient buttons, gradient fields | **No gradient.** Every call to action is `.btn.tint`. |
| `DESIGN-TOKENS.md`, `index.html` and `app-v3.html` as the source of truth | **`handoff/`**. The root pages are earlier mockups. |
| The source panel and full entry as production has them | Restyled in the system (`CONSOLE.md` section 5). |
| No phone layout for the console | **The phone console** (`CONSOLE.md` section 3). |

---

## The package

| File | What it is |
|---|---|
| `tokens.css` | Every value. Replaces the token block at the top of your `.console-root`. |
| `components.css` | The stable blocks, as plain classes. |
| `explorations.css` | Shapes waiting on a decision, and three the worked pages use. See AGENTS.md. |
| `system.js` | The runtime: entry motion, the rendered grid, the veil, page drivers. Vanilla, runs once on load. |
| `tokens.json` | The tokens for tools (DTCG), generated from `tokens.css`; `guide.html` reports drift. |
| `brand-guide.html` | The system, plate by plate, built from the shipping CSS. |
| `console.html` + `prototypes.js` | The console prototype. Mock data; nothing leaves the page. |
| `CONSOLE.md` | The console written down: behaviour, breakpoints, keyboard, the source view's data, what is mock, production features and words awaiting Matt's verdict. |
| `landing.html`, `home.html`, `rotary.html` | Worked pages, built from the system. |
| `report.html`, `slides.html` | Document templates (Exploration). |
| `guide.html` | Every variable and style read live from the CSS. |
| `brand-board.html` | The identity on one page, nine panels, built from the CSS (Exploration). |
| `archive.html`, `archive/` | What was cut, and why, with the old drafts (`explore-*.html`, the sans and serif tests). Codes start AR. Nothing that ships loads `archive/`. |
| `audit/` | The production site as surveyed in September. Evidence, not a target. |
| `AGENTS.md` | The rules, for people and agents; read its first section first. |
| `CHANGELOG.md` | Every revision. History: later entries reverse earlier ones. |

---

## How it maps to your repo

Read from `nathanael-applied-alchemy/peaceintel` at `main` (last commit 2026-10-01), read only. **Check it again before you start:** anything merged since then is not reflected below.

| In the repo | In this package | Fit |
|---|---|---|
| `src/pages/console/console.css`, the `.console-root` token block | `tokens.css` | **Same mechanism**: CSS custom properties read with `var()`. Of your 69 variables, 23 have the same name here (`--bg`, `--panel`, `--ink`, `--accent`, `--serif`, `--line`…); adopting them is a values swap. **One rename, Rev 20:** the system calls `--panel` `--ground` now (it is a background, not a raised board), and `--panel-face` / `--panel-border` are `--face` / `--edge`. `tokens.css` keeps all three old names as aliases, so `console.css` keeps working; move its rules to the new names when you touch them, then delete the aliases. Your `--fr-*`, `--gap-*` and `--tw-prose-*` tiers have no counterpart here: keep them and point their values at the new tokens. |
| `src/pages/useConsoleFonts.js` | the `--serif`, `--sans`, `--mono` stacks | Still loads Nanum Myeongjo and DM Sans. Change it (step 1). |
| Console class names in `console.css` | `components.css` | 42 class names already match (`.msg`, `.bubble`, `.composer`, `.composer-bar`, `.send`, `.pane-head`, `.lib-item`, `.src-chip`, `.cite`, `.icon-btn`, `.avatar`, `.badge`, `.act`…). Restyling them is mostly values, not markup. |
| `src/components/ui/` Button, Chip, Badge, Card | `.btn.tint` / `.btn.ghost`, `.cite` / `.src-chip`, `.badge`, `.card` | Keep the React components; give each the system's class. |
| `src/components/ui/` Modal, Table | `.dlg`, `.sheet-t` | Stable since Rev 39, with the console's projects. Give them the system's classes. |
| `ConsoleThreadsRail`, `ConsoleEvidencePane`, `ProjectView`, `ConsoleChat` | `console.html`: the rail, the library pane, the project page, the chat | Same structure. The prototype is the spec for look and behaviour, not code to copy. |
| `tailwind.config.js` (no theme; typography plugin) | nothing | See below. |
| `rotary/handoff/` | an older copy of this package | Delete it, or replace it from here, or it will drift. |

### Is Tailwind useful?

**Not for the design system, and the repo already knows it.** Your config deliberately has no
`theme.extend`, the design system lives in CSS custom properties, and components read
`var(--…)` directly. A Tailwind theme generated from `tokens.json` would be a second path to the
same values, and two paths drift. Keep Tailwind as it is: layout utilities, and the typography
plugin for markdown answers, which you already theme through `--tw-prose-*` in `console.css`.
Point those at the new tokens (`--tw-prose-headings: var(--ink)`, links at
`var(--accent-text)`, and headings' weight at `var(--serif-w)`) and the answers match the system.

---

## Adoption order

Each step ships on its own.

1. **Fonts.** In `useConsoleFonts.js`, load
   `family=Source+Serif+4:ital,opsz,wght@0,8..60,400..600;1,8..60,400..600` and Space Mono in
   place of Nanum Myeongjo. The sans is **Barlow** (Rev 24, replacing DIN 2014, which needed a paid web
   licence): free under the SIL Open Font License, self-hosted in `Fonts/Barlow/` with `OFL.txt`
   (400, 400 italic, 500, 600, 700; Latin, Latin Extended, Vietnamese), or loaded from Google
   Fonts as `family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400`. DM Sans stays as its fallback. Let the browser choose Source Serif's optical size (the default).
2. **Tokens.** Replace the values at the top of `.console-root` with `tokens.css`'s, and add the
   rest of its blocks (they are additive). This sets the orange accent at the base and ends the
   two-brand split by route. Your rail, evidence pane and project page take
   `.surface--ground-2` (4% ink, new in Rev 20), so the chat is the brightest thing on screen. The system has one theme with dark bands; your `[data-theme="dark"]`
   flip can go when you are ready (ask Matt first if users rely on it).
3. **Serif weights and sizes.** Every serif heading takes `font-weight: var(--serif-w)` (400), and
   `var(--serif-w-display)` at `--t-display` and `--t-h1` (400 since Rev 22; it was 500). Display is
   64px and body 16px since Rev 22, so headlines grow on every page that uses the tokens. Nothing
   serif is bold.
4. **Components.** Import `components.css` once, globally, after `console.css`. It is plain
   CSS; React keeps `className`. Move the `ui/` components onto its classes one at a time.
5. **The console.** Bring it in line with `console.html`, using `CONSOLE.md` for what it does.
   **All of it is Stable** (Matt, 16 Oct), projects, context, memory, artifacts, dialogs and the
   finder included. **Matt has ruled on every production feature the prototype did not draw**
   (`CONSOLE.md` section 8) and every word that differed (section 9): what to keep, how, and what
   goes (the tip line, the Reports tab, the dark-mode toggle, Mute; Eirene becomes an answer mode).
6. **`system.js`, where a page needs it.** It runs once on load and finds its elements in the
   DOM, which suits static pages. In the SPA, wrap its drivers so a route can start them after
   it renders, and stop them on unmount. This is real integration work; marketing routes need
   it (motion, the rendered grid, the veil), the console does not.
7. **The next page.** Build it from `components.css`, copying the head of `landing.html`.
   Retrofit existing pages only when they are next touched.

---

## What Matt's agent found in your repo (16 Oct, read only)

`nathanael-applied-alchemy/peaceintel`, `main` at `a71b045` (1 Oct); a second branch,
`dev-agent-backend-override`, was pushed on 8 Oct and was not read.

- **`src/pages/StyleGuide.jsx`** (the `/styleguide` route in `AppShell.jsx`) lists the old tokens
  by hand: `--panel`, the brown accent `#8a5a2b`, Nanum Myeongjo, DM Sans, a light and a dark
  value for each, and inline styles with raw sizes. Your own privilege audit notes the route is
  open to any signed-in user. **Recommendation: delete the page and its route.** The system's
  live references are `guide.html` (every variable, read from the CSS, with a drift check) and
  `brand-guide.html`; keeping a third copy in the app is how the values drifted before.
- **`src/pages/admin/adminTokens.js`** maps the admin panel's v4 colour keys onto the console's
  variables (`var(--panel)`, `var(--ink)`…). It keeps working through the `--panel` aliases.
  Point it at `--ground` / `--face` / `--edge` when you touch it. Its literal v4 hex
  pass-throughs (blue, purple, the funder colours) are off the system; leave them until the admin
  panel is redesigned.
- **`agent-workspace/design/peaceintel-frontend-design.md`** and **`agent-memory/`** are your
  agent's own notes. Where they describe styling (console.css, the theme toggle, StyleGuide) they
  now describe the old state: **tell your agent this package supersedes them on anything visual.**
- **`rotary/handoff/`** is an older copy of this package: replace it from here or delete it.

---

## Decided since the last copy (16 Oct)

- **The brown accent was old branding.** Disregard it; the accent is orange.
- **No dark theme.** If one is ever wanted, it is its own sprint.
- **Explorations and the archive in this handoff**: see the package table. `archive.html` and
  `archive/` are for the record, and nothing that ships may load them.

## Open questions for you

- **Production ahead of `main`.** The deployed build served routes not on `main` in September.
  Worth confirming everything is pushed before this lands.
