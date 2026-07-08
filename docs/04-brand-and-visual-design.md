# 04 · Brand & Visual Design

## Brand strategy

- **Platform name:** **Peace Intel** (finalized 2026-07-08).
- **Agent name:** none — the agent is "an agent of Peace Intel." A single unified name was a
  deliberate decision (Milt: getting *one* name recognized is hard; two is "more than twice as
  hard"). **Do not** reintroduce a separate agent brand (EVIDA, Nova, PI-as-a-name) in the UI
  without a decision. See [`08`](08-open-questions-and-decisions.md).
- **Relationship to EPI/AFP:** Peace Intel is branded as a **platform**, positioned as more
  approachable/utilitarian than the parent org. "It's not a brand, it's a platform." (There's
  some tension in the notes between "separate from EPI" branding and using EPI's visual
  identity/accent — treat Peace Intel as its own product surface that *inherits EPI's accent
  color and restraint*, not a fully independent brand system.) **[OPEN]** confirm with Ahn.

## Visual direction (approved 2026-07-08)

A **1990s-inspired, data-forward aesthetic.** Clean, professional, no-nonsense.

- **Bitmap dithering on a grid background.** The signature texture. Restrained — a backdrop
  and accent motif, not a loud full-bleed treatment.
- **Clean and minimal.** The strategic rationale: in an era where AI makes flashy visuals
  trivially easy, **restraint signals credibility.** "We're a clean tool… let the data speak."
- **Data-forward.** Real numbers, real corpus stats, real citations presented plainly are the
  hero — not illustration or motion.
- **Light + dark modes**, both built on **EPI's accent color**.
- **Shelved (do not build for MVP):** a 90s-style "cipher text" decode animation inspired by
  *Enemy of the State*. Noted as possible future polish only.

Mood words: *clean · rigorous · restrained · credible · institutional-but-approachable ·
"like a Swiss watch."*

## Color

- **Accent:** EPI's accent color, used consistently across light and dark. **[NEEDS SOURCE]** —
  pull the exact hex from EPI's existing brand / effectivepeace.org and record it here.
- Build a neutral, high-contrast base palette (near-black / near-white + grays) so the accent
  and the data do the talking. Dithering works best with a tight palette.
- Meet **WCAG AA** contrast in both modes — this is a credibility product; legibility is brand.

> Before finalizing any chart, meter, stat tile, or categorical color usage, consult the
> `dataviz` skill for an accessible, system-consistent palette method (it ships a validated
> default palette you swap for EPI's accent). Relevant here because the stat rows, the "good
> question" meter, and any evidence-confidence badges are effectively small data viz.

## Typography

**[NEEDS SOURCE]** — no type spec found in the notes. Recommendation to propose:
- A clean, credible sans for UI and body (highly legible at small sizes).
- Optionally a mono / bitmap-flavored face for numerals, labels, and the "1990s" nod (fits the
  data-forward, terminal-adjacent feel without gimmickry).
- Establish a clear type scale; keep it tight and utilitarian.

## Voice & tone

- **Cognitive agent, never "chatbot."** Language throughout (marketing + in-app) should reflect
  a rigorous research assistant / guide, not a casual assistant.
- Confident, plain, evidence-first. Comfortable saying "the evidence is mixed" or "we don't
  have coverage there." Honesty about gaps is a trust feature.
- Positioning line to work from: *"The largest corpus of peacebuilding evidence in one place,
  accessible through a custom-built cognitive agent."*
- Metaphors the team uses (useful for marketing copy): the library as **an art gallery** /
  **a Swiss watch** (curated, credible, proof of depth); the agent as **the guide**, the
  platform as **the institution**.

## Assets to gather (not in this repo)

- EPI accent color hex + logo files.
- Any existing Peace Intel / EVIDA / Nova visual explorations from Matt.
- effectivepeace.org (WordPress) for existing EPI brand cues.
- A dithering approach/tooling decision (CSS/SVG vs. pre-rendered textures) — flag for
  Nathanael re: performance and light/dark theming.
