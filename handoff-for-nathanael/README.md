# Peace Intel brand system: the handoff

For Nathanael Miksis and his coding agent, from Matt Gillespie, 23 October 2026 (Rev 63).

This folder is the whole package and nothing else. Start with **`HANDOFF.md`** (the plan), then
give **`AGENTS.md`** to your agent (the rules; its first section says what to trust and what may
ship). The console is written down in **`CONSOLE.md`**.

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
