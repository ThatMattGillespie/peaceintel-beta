# Peace Intel design system — handoff

**For:** Nathanael Miksis and his coding agent
**From:** Matt Gillespie
**Updated:** 2026-10-16 (Rev 22). The history of every revision is in `CHANGELOG.md`.

---

## Start here

1. Open `brand-reference.html` and read **Start here** (Pl. 00). It is one screen.
2. Open `console.html`: the console as a working prototype, the behaviour to match.
3. Give `AGENTS.md` to your coding agent. It holds the rules; this file holds the plan.

Everything marked **Stable** may ship. Everything in **Open decisions** (Pl. 16, 18 and 19, and all of
`explorations.css`) may not without asking Matt.

---

## The package

| File | What it is |
|---|---|
| `tokens.css` | Every value. Replaces the token block at the top of your `.console-root`. |
| `components.css` | The stable blocks, as plain classes. |
| `explorations.css` | Shapes waiting on a decision. Do not ship. |
| `system.js` | The runtime: entry motion, the rendered grid, the veil, page drivers. Vanilla, runs once on load. |
| `tokens.json` | The tokens for tools (DTCG), generated from `tokens.css`; `guide.html` reports drift. |
| `brand-reference.html` | The system, plate by plate, built from the shipping CSS. |
| `console.html` + `prototypes.js` | The console prototype. Mock data; nothing leaves the page. |
| `landing.html`, `home.html`, `rotary.html` | Worked pages, built only from the system. |
| `report.html`, `slides.html` | Document templates (Exploration). |
| `guide.html` | Every variable and style read live from the CSS. |
| `sans-test.html` | The sans candidates on the real pages; Barlow was chosen from it (Rev 24). |
| `brand-board.html` | The identity on one page, nine panels, built from the CSS (Exploration). |
| `archive.html` | What was cut, and why. Nothing that ships loads `archive/`. |
| `AGENTS.md` | The rules, for people and agents. |

---

## How it maps to your repo

Read from `nathanael-applied-alchemy/peaceintel` at `main` (last commit 2026-10-01), read only.

| In the repo | In this package | Fit |
|---|---|---|
| `src/pages/console/console.css`, the `.console-root` token block | `tokens.css` | **Same mechanism**: CSS custom properties read with `var()`. Of your 69 variables, 23 have the same name here (`--bg`, `--panel`, `--ink`, `--accent`, `--serif`, `--line`…); adopting them is a values swap. **One rename, Rev 20:** the system calls `--panel` `--ground` now (it is a background, not a raised board), and `--panel-face` / `--panel-border` are `--face` / `--edge`. `tokens.css` keeps all three old names as aliases, so `console.css` keeps working; move its rules to the new names when you touch them, then delete the aliases. Your `--fr-*`, `--gap-*` and `--tw-prose-*` tiers have no counterpart here: keep them and point their values at the new tokens. |
| `src/pages/useConsoleFonts.js` | the `--serif`, `--sans`, `--mono` stacks | Still loads Nanum Myeongjo and DM Sans. Change it (step 1). |
| Console class names in `console.css` | `components.css` | 42 class names already match (`.msg`, `.bubble`, `.composer`, `.composer-bar`, `.send`, `.pane-head`, `.lib-item`, `.src-chip`, `.cite`, `.icon-btn`, `.avatar`, `.badge`, `.act`…). Restyling them is mostly values, not markup. |
| `src/components/ui/` Button, Chip, Badge, Card | `.btn.tint` / `.btn.ghost`, `.cite` / `.src-chip`, `.badge`, `.card` | Keep the React components; give each the system's class. |
| `src/components/ui/` Modal, Table | `.dlg`, `.sheet-t` | Both are still Explorations (they came with the console's projects). Leave these two until Matt decides. |
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
5. **The console.** Bring the rail, pane, composer and chat in line with `console.html`. The
   shell is Stable; projects, context, memory, artifacts and the finder are Open decisions.
6. **`system.js`, where a page needs it.** It runs once on load and finds its elements in the
   DOM, which suits static pages. In the SPA, wrap its drivers so a route can start them after
   it renders, and stop them on unmount. This is real integration work; marketing routes need
   it (motion, the rendered grid, the veil), the console does not.
7. **The next page.** Build it from `components.css`, copying the head of `landing.html`.
   Retrofit existing pages only when they are next touched.

---

## Open questions for you

- **The brown accent.** `console.css` sets `--accent: #8a5a2b` at the base and four routes
  override it back to orange. If brown was an accessibility fix, the system solves the same
  problem with `--accent-text` (#C04019, 4.93:1) for text under 24px, keeping orange for fills
  and large type.
- **The dark theme.** The system dropped it on 2026-10-14. Is it used?
- **`StyleGuide.jsx`** copies token values statically; reading `tokens.json` would keep it current.
- **Production ahead of `main`.** The deployed build served routes not on `main` in September.
  Worth confirming everything is pushed before this lands.
