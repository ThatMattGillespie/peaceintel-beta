# 01 · Product Requirements

Scope for the prototype and the January MVP. This is deliberately narrow — the strongest
directive in the source material is **do less, but make it credible** ("the milk model of
utter simplicity," Ahn, 2026-07-08).

## Product goals

1. Let a funder or practitioner get a **trustworthy, cited answer** to a real peacebuilding
   question without feeling like they're using "just another chatbot."
2. Make the **depth of the evidence base visible** — the library is credibility
   infrastructure ("like a Swiss watch": proof the corpus is real).
3. Meet users where they are — a researcher, practitioner, and funder should each feel the
   tool fits them, **without a heavy setup wall.**
4. Be demonstrably **clean and data-forward** — restraint signals credibility in an era where
   flashy AI visuals are trivially cheap.

## MVP scope (target: January launch; internal readiness mid-Sept)

### Must have

- **M1 — Landing / entry experience.** Elicit-style landing with **example use-case cards**
  containing pre-written queries. Clicking a card populates the entry box. A short
  intro/welcome message frames what Peace Intel is (copy owned by Ahn, per Milt's request).
- **M2 — Chat-first agent interface.** The primary surface. A conversation with the agent,
  answers grounded in the library, **inline citations** on claims.
- **M3 — Context sidebar.** A sidebar for *context control* rather than a separate library or
  search hierarchy — lets the user steer scope (e.g. which datasets/lenses are in play)
  without leaving the conversation.
- **M4 — Citation → source.** Every cited claim links to a source. **Deep-link to internal
  database entries** (EIRENE / DPD records), not just external PDFs. (Eng: agent could
  surface individual papers via links as of July; internal deep-linking was ~1–2 weeks out.)
- **M5 — Library explorer ("simple shelf").** A browsable view of what's in the corpus —
  a *library* explorer, **not** a data explorer. Start with a simple "shelf" design; it exists
  to make the corpus tangible, not to be a full search product.
- **M6 — Predefined use-case flows.** At minimum: *evaluate a proposal*, *research a
  historical conflict*, *create a literature review*. (Earlier flow set from dev: *theory of
  change*, *proposal assessment*, *program design*.)
- **M7 — "Good question" indicator.** Real-time feedback on query quality to help users get
  better results. **High priority** — it's a core answer to the "people treat it like a
  chatbot" problem.
- **M8 — Light + dark mode.** Both use EPI's accent color. See
  [`04-brand-and-visual-design.md`](04-brand-and-visual-design.md).
- **M9 — Marketing site.** Brand narrative + pitch + a clear way into the app. Public.

### Should have

- **S1 — Context-aware onboarding.** Users arrive as researcher / practitioner / funder with
  different needs; the agent should *invisibly* meet them where they are without constraining
  interaction. Plan is **two onboarding variants for A/B testing** (co-drafted Ahn + Matt,
  reviewed by Ben Valentino for academic rigor).
- **S2 — Two evidence "modes" surfaced clearly.** (1) *General academic insight* — "what
  usually works for this kind of conflict"; (2) *specific case facts* — "what happened in
  Darfur, who did what, what resulted." Milt: case-specific will ultimately be more useful to
  funders. Users should understand both are available.
- **S3 — Copy-paste of answers.** Simple copy-paste is explicitly preferred over complex
  artifact/PDF generation for MVP.
- **S4 — Conversation starters open in new tabs** (rather than hosting chats on the front page).

### Could have / later

- Rigor-ranking / evidence-confidence indicator surfaced in the UI (framework still being
  designed with Ben Valentino — see [`05`](05-content-and-data-model.md)).
- Funder-specific guided tools (proposal assessment, partner due-diligence) — *whether funders
  need a separate portal vs. one shared interface is **[OPEN]***.
- Artifact / PDF generation, literature-review export.
- Multilingual support; regional sprints (e.g. Middle East).
- MEL framework tooling (requested by AFP's Emily Myers) — link practitioner measures to
  academic scholarship.
- "Ask Irene" as a distinct, walled-off lens over the EIRENE indicators (AFP-facing).

## Explicitly out of scope for MVP

- General-purpose / open-web chat. This is the thing we are *not*.
- Complex artifact generation and heavy export flows (S3 supersedes for now).
- A full-featured data explorer or advanced search hierarchy (M5 is a *shelf*, not a search app).
- 90s "cipher text" decode animation (à la *Enemy of the State*) — discussed, **shelved** for
  possible future polish; do not build for MVP.
- Monetization / paywalls (long-term: charging for inference, curricula licensing — year ~3).

## Timeline & milestones

| When | Milestone |
|------|-----------|
| Jul–Aug 2026 | Aggressive front-loading: marketing pages + MVP built. Onboarding intro screen drafted (Ahn + Matt). |
| **Mid-September 2026** | **Internal platform readiness deadline.** Polished enough for funder engagement. |
| Sep 2026 | Board tests first (first "field test" group), then PSFG members + Milt/Peter donor networks. |
| October 2026 | Marketing + platform ready to support Q4 fundraising (ahead of year-end tax planning); PSFG workshop/lunch framed as **co-design**, not a finished pitch. |
| **January 2027** | **Public launch.** Must land as *useful and valuable* to funders + peacemaking orgs. |

## Success framing

- Work backward from the "peacebuilding oracle" ideal; gap-analyze toward it.
- Beware the optimization trap (Nathanael): improving one use case can degrade others — a
  success rubric per use case is needed. Design shouldn't over-fit a single flow.
- Launch bar (Milt): visibly useful, clearly scoped, credible. Not everything-for-everyone.
