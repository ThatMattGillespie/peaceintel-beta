# Jargon Audit — Phase 2 prep

**For:** Matt Gillespie
**Generated:** 2026-08-18
**Status:** Inventory only. No replacement copy has been written — that waits on your write-up.

The team's judgement was that the current text is too technical and opaque: it describes the machinery instead of the utility. This document locates every offending string so the rewrite is a fill-in-the-blanks job rather than another audit.

---

## How to use this

Every zone below is marked in the HTML with a comment:

```html
<!-- COPY: differentiators — densest jargon block, see JARGON-AUDIT.md §2 -->
```

Search the source for `COPY:` to jump to each one. Fill the **Replacement** column, and the swap is mechanical.

**The consolidation already did most of the work.** These blocks used to exist in triplicate across `funders.html`, `program-managers.html` and `practitioners.html`. They now exist once, in `audiences.html`. Editing a shared block is one edit, not three.

---

## Counts before consolidation

Across visible copy on the four pages as shipped 2026-08-12:

| Term | index | funders | pm | pract | total |
|---|--:|--:|--:|--:|--:|
| "agent" | 1 | 7 | 8 | 9 | **25** |
| "corpus" | 3 | 1 | 1 | 1 | 6 |
| "LLM" / "LLM agent" | 0 | 2 | 2 | 2 | 6 |
| knowledge graph · open-graph · edges | 0 | 3 | 3 | 3 | 9 |
| full-text retrieval · domain awareness · offline analysis | 0 | 3 | 3 | 3 | 9 |
| machine-readable | 0 | 1 | 1 | 1 | 3 |
| "ChatGPT wrapper" | 0 | 1 | 1 | 1 | 3 |
| "custom-built neural agent" | 1 | 0 | 0 | 0 | 1 |

"agent" is the dominant term at 25 uses. It is the word doing the most work and the one most worth deciding on first — whatever replaces it will set the tone for everything else.

---

## Update — 2026-08-18, audience correction

The segmentation was corrected after this audit was first written. Both funders and
implementers have senior leadership and program managers; practitioners exist on the
implementer side only. That is **five** states, not four, and it added one new subhead
(1.2 below) and one new problem statement, both of which reuse the same shared opening
clause and therefore inherit the same flagged terms. Nothing else in this audit moved.

---

## §1 — Hero subhead · `audiences.html`

One sentence, five variants. The opening clause is shared; only the tail changes per audience.

**Shared opening:**
> "Peace Intel is the world's largest corpus of **structured, machine-readable** peacebuilding data, accessible through an **LLM agent** built from the ground up to …"

| # | Audience | Current tail | Replacement |
|---|---|---|---|
| 1.1 | Funders — Senior Leadership | "…retrieve, analyze, and cite the evidence that matters to your decisions." | |
| 1.2 | Funders — Program Managers | "…test the claims in a proposal against the literature and show you the sources behind your recommendation." | |
| 1.3 | Implementers — Senior Leadership | "…show what your programs rest on, in language a board or a donor can follow." | |
| 1.4 | Implementers — Program Managers | "…find, cite, and defend the evidence behind the choices you have to make." | |
| 1.5 | Implementers — Practitioners | "…help you find, cite, and share the evidence behind your program decisions." | |
| 1.6 | **Shared opening clause** | "world's largest corpus of structured, machine-readable peacebuilding data, accessible through an LLM agent built from the ground up" | |

Flagged terms: `corpus`, `structured`, `machine-readable`, `LLM agent`.

---

## §2 — "Why it's different" · `audiences.html`

The densest block on the site. Three headed paragraphs, shared across all five states.

| # | Current | Replacement |
|---|---|---|
| 2.1 | **"Built from the ground up, not a ChatGPT wrapper."** — "Peace Intel uses an **LLM agent** with **full-text retrieval**, a **knowledge graph of ~100,000 edges**, and **domain awareness** of the peacebuilding field. It reads the actual papers, not abstracts. It cites its sources. And it tells you when the evidence is thin rather than making things up." | |
| 2.2 | **"Always growing."** — "The library expands with every interaction. The **agent autonomously discovers and ingests** new research. The **open-graph architecture** means new datasets, new conflicts, and new findings are continually integrated." | |
| 2.3 | **"Where rigor meets speed, by design."** — "The **agent** gives you fast, cited answers when the evidence is clear, and takes the time for full **offline analysis** when the question is complex." | |

Note that the second halves of 2.1 and 2.3 are already plain and worth keeping: *"It reads the actual papers, not abstracts. It cites its sources. And it tells you when the evidence is thin rather than making things up"* is the clearest sentence on the site. The jargon is front-loaded; the payoff is fine.

"not a ChatGPT wrapper" is a separate question from jargon. It is defensive positioning that names a competitor and presumes the reader already suspects the product is thin. Worth deciding whether to keep the frame at all.

---

## §3 — Stat labels · `audiences.html`

Five labels under the numbers. **Resolve these together with the stats conflict below** — the numbers and their labels should be decided in one pass.

| # | Current label | Number | Replacement |
|---|---|---|---|
| 3.1 | Deeply Analyzed Papers | 5,000+ | |
| 3.2 | Extracted Claims | 22,000+ | |
| 3.3 | Citation Links | 218K | |
| 3.4 | Evaluation Indicators | 14,755 | |
| 3.5 | Data Points | 2M+ | |

---

## §4 — Landing hero · `index.html`

| # | Current | Replacement |
|---|---|---|
| 4.1 | "The largest corpus of peacebuilding data in one place, curated by experts, accessible through a **custom-built neural agent**." | |

"neural agent" appears only here and is the most opaque phrase on the site.

---

## §5 — Card body copy · `audiences.html`

Eight cards (four per side) use "the agent" as the subject of most sentences: *"The agent retrieves full-text sources…"*, *"The agent pulls from comparable contexts…"*, *"the agent maps the evidence…"*.

This is not a find-and-replace. Once §1 settles what to call the thing, these follow from it. Some may not need a subject at all — *"Get a cited briefing in minutes"* says more than *"The agent retrieves full-text sources and synthesizes findings."*

---

## Still open: the stats conflict

Unresolved since 2026-08-12 and now live. `index.html` shows **12,480 Documents / 190 Conflicts Mapped / 4.2M Citations Indexed / 1997 Earliest Record**. The audience page shows **5,000+ Papers / 22,000+ Claims / 218K Citation Links / 14,755 Indicators / 2M+ Data Points**.

These cannot both be current. One set is stale and the repo does not record which. Since §3 rewrites the labels anyway, decide the numbers at the same time.
