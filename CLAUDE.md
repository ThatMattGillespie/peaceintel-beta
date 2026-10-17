# Peace Intel — read this before writing any UI

This repo has a **finished brand system** in `handoff/`. It is not a suggestion and it is not a
starting point to riff on. Anything user-facing is assembled from it.

**Before writing a line of CSS, HTML or JSX, read `handoff/AGENTS.md`.** It is the rules, and it
is the only place they are written down. This file points at them and deliberately repeats no
values, because a copy of a rule goes stale the day the rule changes (this file once said the
gradient button had an ink label for a week after it went white).

`handoff/brand-reference.html` is the golden example (every token and block exercised on every
surface) and `handoff/landing.html`, `home.html` and `rotary.html` are worked pages. If what you
are about to build would not look like it belongs beside them, stop and reconsider. Imitating
those files is more reliable than following any rule from memory.

**What is authoritative, in order:** `tokens.css`, `components.css`, `explorations.css` and
`system.js` are the system. `AGENTS.md` is the rules. `tokens.json` is generated from
`tokens.css`. `brand-reference.html`, `guide.html` and `HANDOFF.md` explain it to people. If any
two disagree, the CSS wins and the explanation is the bug.

## How a new page starts

Put it in `handoff/`, and start by copying the `<head>` of `handoff/landing.html`:

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="components.css">
<link rel="stylesheet" href="explorations.css">
...
<script src="system.js"></script>
```

`handoff/rotary.html` is a page already built this way; read it before building another one.

**A page's own `<style>` block is for page-specific layout only** — a grid that exists once, a
one-off width. The moment it contains a colour, a font size, a radius, a shadow or an animation,
something has gone wrong: that value already exists as a token, or it is off the system.

The older self-contained pages in the repo root (`rotary-a.html`, `use-cases.html`, `postcard.html`
and friends) predate the system. **Do not copy their structure.** They are the drift the handoff
package exists to end.

## The rules that get broken most

Read them in `handoff/AGENTS.md`; these are only the ones agents trip on, by number.

- **Motion is a closed set** (rule 9). Writing `@keyframes`, a new `transition` on an entry, or a
  hand-rolled text animation is a bug. Use the existing primitives by class name; make a page
  feel richer through timing and order, and propose a new primitive to Matt before building one.
- **No literal values** (rules 0, 1 and 3). Every colour, size, space and radius is a token.
- **Fix at the base** (rule 4). A block that looks wrong is fixed in `components.css`, never
  overridden in a page.
- **Accent pairs and contrast** (rule 5). Read the accent tokens there before putting colour on
  anything; contrast is measured, not assumed.
- **One loud thing per page** (rule 8).

## Working agreements

- **Iterate on a local server** (`python3 -m http.server 8788` from the repo root), not by opening
  files directly. Check 390px before saying it is done. (There is one theme; dark mode was removed
  on 2026-10-14.)
- **Do not commit or push without Matt's say-so.** A push to `main` publishes to GitHub Pages
  immediately, so treat a push as a publish. Nothing goes near Nathanael's repo either way.
- `DESIGN-TOKENS.md` and `JARGON-AUDIT.md` are internal and are **not** deployed. Both Pages repos
  are public.
- Do not rename or delete the `peaceintel-style-review` repo.
- Never point the prototype at live or protected credentials.
- **A page is not done until what it added to the system is documented.** Any block, token or
  driver a page adds to `components.css`, `tokens.css` or `system.js` gets, in the same session, an
  entry in `brand-reference.html`, the quick reference in `AGENTS.md` and the changelog in
  `CHANGELOG.md` (and `HANDOFF.md` if it changes how production adopts the system). The Rotary and Home pages skipped this and left about twenty blocks undocumented.
  A shape that is not yet agreed goes in `explorations.css` instead, which is the holding file.
- **Impeccable** is installed and welcome for critique, audit, polish, clarify and live mode.
  `PRODUCT.md` and `DESIGN.md` at the root are its local-only files (git-excluded; never commit
  them) and `DESIGN.md` is a pointer to `handoff/`. **Never run `/impeccable document`**: it would
  rewrite `DESIGN.md` as a second token file. Its `animate`, `bolder`, `overdrive`, `colorize` and
  `delight` commands work against this system; skip them.

## Writing

Matt is a designer, not a full-time engineer: explain in plain terms, and say what a change costs.
Reduce AI tropes — no "not this but that" constructions, and no em dashes in copy written for the
site.
