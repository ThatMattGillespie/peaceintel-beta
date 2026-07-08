# 08 · Open Questions & Decisions

The project is moving fast; naming and UI direction both changed within the last two weeks.
Read this before treating anything else as settled.

## Decision log (most recent first)

| Date | Decision | Status |
|------|----------|--------|
| 2026-07-08 | **Platform name = "Peace Intel."** Finalized. | ✅ Settled |
| 2026-07-08 | **Agent has no separate brand name** — "an agent of Peace Intel." EVIDA dropped entirely. | ✅ Settled |
| 2026-07-08 | **UI = chat-first + context sidebar.** Narrowed from the earlier three-box concept; a **library** explorer (not data explorer); no separate library/search hierarchy. | ✅ Settled (fresh) |
| 2026-07-08 | Landing = **Elicit-style use-case cards** with pre-written queries that populate the composer; starters open in new tabs. | ✅ Settled (fresh) |
| 2026-07-08 | **Copy-paste over artifact/PDF generation** for MVP. | ✅ Settled |
| 2026-07-08 | **"Good question" indicator** added as high-priority roadmap item. | ✅ Settled |
| 2026-07-08 | **Funders = primary audience.** | ✅ Settled |
| 2026-07-08 | Visual: **1990s-inspired, bitmap dithering on grid, clean/data-forward**, light+dark on EPI accent. Cipher-text effect **shelved**. | ✅ Settled (present to board for deal-breakers) |
| 2026-06-29 | Domains **peaceintel.org / .com / peaceintelligence.org** purchased. | ✅ Settled |
| 2026-06-03 | Nova → EVIDA rename approved by Milt. | ⚰️ Superseded (EVIDA later dropped) |

## Retired names (do not use in the prototype)

- **Nova** — original agent name; retired 2026-06-03.
- **EVIDA** ("Evidence for Violence De-escalation and Action") — agent name; **dropped
  2026-07-08.** May still appear in older vault notes and the `EVIDA.md` project file (which
  lags the latest decision).
- **PeaceConnect.io** — earlier platform candidate (2026-06-26); superseded by Peace Intel.
- **Paxedex** — excluded (clarity/spelling).
- **"PI" / "AI Librarian" / "AI Research Assistant" / "Rosie"** — agent-naming ideas floated
  2026-07-01; superseded by the 07-08 decision to give the agent no separate brand.

## Open questions (need an owner's answer)

### Product / UX
- **[OPEN] Funder portal vs. one interface.** Do funders get a separate portal/toolset
  (proposal assessment, due diligence) or a single adaptive interface? No final decision
  (2026-07-08). *Owner: Ahn.*
- **[OPEN] Access model at launch.** Gated beta (board → PSFG → networks) implies "Request
  access," not open signup, through January. Confirm the public CTA. *Owner: Ahn.*
- **[OPEN] Onboarding variants.** Exact A/B framings, and what minimal context is captured.
  *Owners: Ahn + Matt; rigor review: Ben Valentino.*
- **[OPEN] Evidence-confidence / rigor ranking.** Framework not yet defined (being developed
  with Ben Valentino). Leave a UI slot; don't hard-code a scale. *Owner: Ahn + Ben.*
- **[OPEN] Almanac.** Own site/section vs. out of scope for the platform prototype.
  *Owner: Matt/Ahn.*

### Brand
- **[OPEN] Peace Intel vs. EPI visual relationship.** Notes both say "brand it separately from
  EPI/AFP" *and* "use EPI's accent color." Resolve how independent the brand system is.
  *Owner: Matt/Ahn; present to board.*
- **[NEEDS SOURCE] EPI accent hex + logo + type spec.** Not in the notes — pull from existing
  EPI brand. *Owner: Matt.*
- **[OPEN] Canonical domain** (.org vs .com) and app subdomain name. *Owner: Nathanael.*

### Engineering (see [`07`](07-developer-handoff.md))
- **[OPEN] Stack:** continue Flutter/Dart or move web-native for January? *Owner: Nathanael.*
- **[OPEN] Citation internal deep-linking** shipped? *Owner: Nathanael.*
- **[OPEN] Query scoping / evidence-type routing** supported? *Owner: Nathanael.*
- **[OPEN] "Good question" scoring** approach for MVP. *Owner: Nathanael.*
- **[OPEN] Per-message cost visibility** (Matt's ask) + model choice (DeepSeek V4 Pro vs.
  distilled). *Owner: Nathanael.*

## Known tensions to design around

- **Credible ↔ accessible** — scholars vs. funders/practitioners. Don't sacrifice citation
  integrity for friendliness, or vice versa.
- **The chatbot trap** — the biggest UX risk; the use-case cards, "good question" meter,
  citations, and library depth are the countermeasures (see [`06`](06-personas-and-journeys.md)).
- **Do less, credibly** — "milk model of utter simplicity"; launch narrow and useful, not
  broad and thin.
- **Optimization trade-offs** — improving one use case can degrade others (Nathanael); avoid
  over-fitting the design to a single flow; a per-use-case success rubric is wanted.

## Immediate near-term deliverables referenced in notes (design-relevant)
- Peace Intel **intro/onboarding screen** copy (Ahn + Matt) — before board testing.
- **Simple shelf** library mockup (Matt) — before full branding.
- **Architecture spec sheet** for team reference (Matt, per Ahn).
- Present **branding concepts to board/exec committee** to surface deal-breakers.
