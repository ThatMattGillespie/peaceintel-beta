# 07 · Developer Handoff

For **Nathanael Miksis** (Technical Architect). This is design-side context assembled from
meeting notes — **not** authoritative engineering documentation. Where it touches the existing
codebase, treat it as "what the design team believes" and correct as needed.

## What's being handed off

A **prototype** of the Peace Intel web platform — marketing site + application — expressed as:
- Figma wireframes/mockups (Matt), and
- This doc set (structure, scope, IA, UI behaviors, data model, brand).

The intent is that you take the prototype and **code it into the final product**, with the
design docs as the spec and the open questions resolved together.

## Existing technical context (from notes — confirm/correct)

- **Stack:** the current platform is built on **EFL's Flutter/Dart** stack. Flutter/Dart
  technical debt was flagged (2026-05-19) as a growing constraint on dev velocity, and a
  possible **shift in dev strategy** was raised (Matt to talk to Scott). **[OPEN for
  Nathanael]:** is the January build continuing on Flutter/Dart, or moving to a web-native
  stack? This materially affects how the prototype should be handed off.
- **Workflow:** GitHub with a **dev branch + PR workflow**; Matt has/needs repo access.
- **Agent/model:** trade-offs discussed between **DeepSeek V4 Pro** and smaller distilled
  models (cost vs. quality). Matt is **budget-conscious on LLM cost** and wants **per-message
  cost visibility** — worth a lightweight internal cost readout.
- **Memory:** proprietary **"Graffiti"** graph-database memory (self-managing, learns/prunes).
- **Observability:** Nathanael can see all agent conversations and has access to user
  interaction data — useful for the A/B onboarding test and "good question" tuning.

## Integration points the design assumes

| UI element | Backend dependency | Status (from notes) |
|---|---|---|
| Inline citations → **internal DB entry** | Deep-linking from citation to EIRENE/DPD record | Papers linkable early July; **internal deep-linking ~1–2 wks out** — confirm |
| EIRENE lens / "Ask Irene" | EIRENE indicators linked to sources | **Done** (linked) |
| Case facts mode | DPD linked to sources + annotated bibliographies | DPD linking = Nathanael action item; bibliographies in progress |
| Context sidebar scope toggles | Per-query dataset/lens filtering | **[OPEN]** — confirm agent supports scoping |
| Evidence type (general/case/both) | Query routing by evidence type | **[OPEN]** |
| "Good question" indicator | Real-time query-quality scoring | New; **high priority** — needs an eng approach |
| Evidence-confidence badge | Rigor-ranking framework | **Not yet defined** (w/ Ben Valentino) — leave a slot |
| Library "shelf" | Browse/list + light filters over corpus | Straightforward |
| Copy answer | Client-side | Trivial (chosen over PDF/artifact export for MVP) |
| Onboarding A/B | Variant assignment + event capture | Uses existing interaction-data access |

## Deployment / domains

- Suggested split: **marketing on the apex** (`peaceintel.org`), **app on a subdomain**
  (`app.peaceintel.org`) — a pattern the team has used before. Confirm canonical domain and
  subdomain naming.
- Owned: `peaceintel.org`, `peaceintel.com`, `peaceintelligence.org` (+ `.net`/`.ai` variants
  being registered). Domains being consolidated into a corporate **Namecheap** account.
- The existing EPI site (`effectivepeace.org`) is **WordPress** and is a **separate** property
  from Peace Intel.

## Engineering open questions to resolve with the team

1. **Stack decision** — continue Flutter/Dart, or move the web platform to a web-native stack
   for the January build? (Biggest fork.)
2. **Citation deep-linking** — is internal-record deep-linking shipped? It's core to the trust
   model (M4).
3. **Query scoping** — can the agent constrain retrieval to selected datasets/lenses and
   evidence type, per the context sidebar?
4. **"Good question" scoring** — heuristic, model-based, or retrieval-signal based? What's
   cheap and good enough for MVP?
5. **Onboarding personalization** — how does role/context actually steer the agent
   "invisibly"? What's stored (and where, given Graffiti)?
6. **Cost visibility** — surface per-message cost to the team (Matt's ask); does the chosen
   model make this easy?
7. **No-evidence / abstention behavior** — how does the agent reliably say "we don't cover
   this" instead of hallucinating? Trust-critical.

## Handoff hygiene

- Keep this doc set in the repo alongside the code as living spec; update the decision log
  ([`08`](08-open-questions-and-decisions.md)) as questions close.
- **Protected/live-infra note:** none of these docs touch EPI's live Hermes infra, `.env`,
  Notion, or the vault's live directories — this workspace is standalone. Don't point the
  prototype at any live/protected credentials during dev.
