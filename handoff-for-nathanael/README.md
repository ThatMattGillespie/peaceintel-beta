# Peace Intel brand system: the handoff

For Nathanael Miksis and his coding agent, from Matt Gillespie, 2 November 2026 (Rev 73).

This folder is the whole package and nothing else. Start with **`HANDOFF.md`** (the plan), then
give **`AGENTS.md`** to your agent (the rules; its first section says what to trust and what may
ship). The console is written down in **`CONSOLE.md`**.

## New in this copy (Revs 64 to 73)

Most of the change is on **`home.html`**, which now argues a case: the problem with
general-purpose AI, Peace Intel's answer, the corpus, then the same question put to ChatGPT and
to Peace Intel side by side.

- **The send button stops an answer** while it is written (`.send.is-stop`, `CONSOLE.md` section 2).
- **The floating bar no longer shrinks** to the logo; it stays whole and sticky.
- **Sections arrive on their own** as they scroll in, even mid-scroll (`system.js`, landing).
- **Phone headlines are smaller**: display 36px and h1 30px under 620px.
- **Home's pictures are plain greyscale** cut-outs (`.lp-pic`, built by `media/mkpics.py`). Only the
  dove video keeps the raster.
- **New Home sections**, all still Exploration in `explorations.css`: the bento (L21), feature
  tabs (L05), the problem and answer (L26) and the side by side (L27).
- **One new runtime behaviour:** `[data-switch-auto]` lets the side by side change on its own
  until someone presses a button. It is the only timed effect added; `AGENTS.md` rule 9 says
  where it may be used.

`CHANGELOG.md` has the detail of each revision.

## What you need to do

1. **Replace the placeholder responses on Home** (section 5, "Same question, different
   standard"). Both answers, the model and date under each headline, and the citations are
   placeholder text. Run the question on ChatGPT and on Peace Intel and put the real responses in.
   `HANDOFF.md` has the checklist, under "Placeholder responses on Home".
2. **Leave `.gpt-app` out of your token work.** The ChatGPT phone in that section copies
   ChatGPT's own app on purpose, so it is the one block with literal values.
3. Everything else follows `HANDOFF.md` and `AGENTS.md` as before.

To look at the pages, serve this folder and open them in a browser (they do not work opened as
files):

    python3 -m http.server 8788
    open http://127.0.0.1:8788/brand-guide.html

| Open | For |
|---|---|
| `brand-guide.html` | The system, plate by plate, built from the shipping CSS |
| `console.html` | The console as a working prototype |
| `console-parts.html` | The clarifying questions, the research updates and the field's active state, every state (Rev 60, 21 Oct). The CSS is in `components.css` (H1.19, H1.20) |
| `guide.html` | Every token and style, read live from the CSS, with a drift check against `tokens.json` |
| `landing.html`, `home.html`, `rotary.html` | Worked pages |
| `report.html`, `slides.html` | Document templates (Exploration) |

The fonts are in `Fonts/` (Barlow, SIL Open Font License, with its `OFL.txt`); Source Serif 4 and
Space Mono load from Google Fonts. The archive of what was cut is not in this copy, on purpose.
