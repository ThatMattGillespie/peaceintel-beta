# Peace Intel — Prototype Workspace

A designer → developer handoff package for the **Peace Intel** web platform.

**Owner (design/PM):** Matt Gillespie · **Build lead (engineering):** Nathanael Miksis
**Snapshot date:** 2026-07-08 · **Target launch:** January 2027 (internal readiness mid-September 2026)

---

## What this is

This workspace captures a point-in-time snapshot of the Peace Intel project, assembled
from the EPI Obsidian vault and team meeting notes (May–July 2026). It's meant to sit next
to your Figma wireframes and give you — and eventually Nathanael — a single, coherent
reference while you build the prototype.

It is **not** a Notion export or a live source of truth. Operational data lives in Notion;
deep institutional memory lives in the EPI vault. This is a curated brief for the specific
purpose of designing and handing off the Peace Intel website + app prototype.

> ⚠️ **Naming and UI direction changed as recently as today (2026-07-08).** Read
> [`docs/08-open-questions-and-decisions.md`](docs/08-open-questions-and-decisions.md) first
> if you only read one thing — it explains what's settled and what's still moving.

## How to use these docs

1. **Skim [`docs/00-project-brief.md`](docs/00-project-brief.md)** for the one-page picture.
2. **Design against [`docs/03-ui-spec.md`](docs/03-ui-spec.md)** — it has screen-by-screen
   layouts with ASCII wireframes you can translate directly into Figma frames.
3. **Ground your copy and data affordances in
   [`docs/05-content-and-data-model.md`](docs/05-content-and-data-model.md)** so the mockups
   reflect real datasets (EIRENE, Dimensions of Peace, the paper library).
4. **When you hand off to Nathanael,** point him at
   [`docs/07-developer-handoff.md`](docs/07-developer-handoff.md) and the UI spec.

## Document index

| # | Doc | Purpose |
|---|-----|---------|
| — | [`README.md`](README.md) | This file |
| 00 | [`docs/00-project-brief.md`](docs/00-project-brief.md) | One-page: what Peace Intel is, who it's for, why |
| 01 | [`docs/01-product-requirements.md`](docs/01-product-requirements.md) | MVP scope, features, out-of-scope, roadmap, timeline |
| 02 | [`docs/02-information-architecture.md`](docs/02-information-architecture.md) | Sitemap, page inventory, domains, navigation |
| 03 | [`docs/03-ui-spec.md`](docs/03-ui-spec.md) | Screen-by-screen layouts, components, states (with wireframes) |
| 04 | [`docs/04-brand-and-visual-design.md`](docs/04-brand-and-visual-design.md) | Visual direction, color, type, light/dark, voice |
| 05 | [`docs/05-content-and-data-model.md`](docs/05-content-and-data-model.md) | Data assets, citation model, rigor framework |
| 06 | [`docs/06-personas-and-journeys.md`](docs/06-personas-and-journeys.md) | Audiences, personas, key use-case flows |
| 07 | [`docs/07-developer-handoff.md`](docs/07-developer-handoff.md) | Tech context, integration points, engineering open questions |
| 08 | [`docs/08-open-questions-and-decisions.md`](docs/08-open-questions-and-decisions.md) | Decision log + open questions |
| — | [`SOURCES.md`](SOURCES.md) | Provenance — which vault notes each claim came from |

## A note on confidence

Everything here traces to a specific meeting note or vault file (see [`SOURCES.md`](SOURCES.md)).
Where a claim is inferred or where the source material disagrees with itself, it's flagged
inline with **[ASSUMPTION]** or **[OPEN]**. Treat those as prompts to confirm with Ahn or
Nathanael, not as settled fact.
