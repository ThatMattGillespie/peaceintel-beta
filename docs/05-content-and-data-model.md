# 05 · Content & Data Model

What the platform actually knows, and how the UI should represent it. Design the mockups
against *real* data shapes so the prototype is honest about the corpus.

## The evidence assets

### EIRENE — the evidence backbone
- EPI's comprehensive evaluation database. **14,755 indicators from 677 evaluations.**
- The core data asset behind all EPI evidence products; the agent's primary grounding.
- Owner: Nathanael Miksis. Already **linked to sources** (each indicator ties back to its
  origin).
- **"Ask Irene"** = a dedicated lens for querying the EIRENE/indicator database. In the AFP
  partnership it's framed as a **walled-off** section focused on indicators, held to a high
  evidence standard, with platform ownership explicitly under EPI. Surface it as a *lens/scope*
  in the context sidebar, not a separate product.

### Dimensions of Peace (DPD) — case-level grounding
- Quantitative dataset capturing dimensions of peacebuilding interventions; consolidates the
  best available datasets. **~150–200 conflicts.**
- Plan: build an **annotated bibliography for each conflict**, filtered through EPI's
  **intervention-type codebook**. (A grad student from Benin was to assist; the effort also
  surfaces data gaps caused by academic paywalls.)
- Needs to be **linked to sources** the way EIRENE is (Nathanael action item, 2026-07-08).
- This is what powers Milt's "specific case facts" mode ("what happened in Darfur…").

### The paper library — curated literature
- **~3,200 papers** as of 2026-06-29, growing. Order-of-magnitude ambition ~15,000.
- Ingestion cost is manageable (~$600 for the existing library). **OpenAlex** flagged as a
  candidate expanded scholarly-graph source.
- **Known coverage gaps** (design copy should be honest about these): gender-based violence,
  democracy, authoritarianism, religious conflict. Current corpus leans on a **five-conflict
  pilot** from Sahil Shah's "What Works" analysis — hence the push for the DPD annotated
  bibliographies to broaden case coverage.
- Also referenced: the **Hamza literature review**, systematically coded for intervention
  types — a work product EPI can stand behind.

### Practitioner data — the differentiator
- Exclusive, non-open-web material: **after-action reports, internal evaluations,
  practitioner notes.** "A different type of information and a different way of knowing."
- Sourced via partners (AFP facilitates collection; EPI cleans, structures, quality-filters).
- Intended to sit in a **walled-off, high-standard** section. This is a core reason the
  platform is *not* replaceable by ChatGPT/Gemini.

## The memory architecture — "Graffiti"
- Proprietary **graph-database memory**; self-managed memory that **learns and prunes over
  time.** Part of what makes the agent a "cognitive agent" vs. a stateless chatbot.
- UX implication: the agent can be a returning **thought partner / coach** with continuity,
  not a one-shot Q&A box. Worth signaling subtly in onboarding/marketing without overpromising.

## Two kinds of answers (design both)
Milt's distinction (2026-07-08), surfaced via the **evidence-type control**:
1. **General academic insight** — "what usually works for this kind of conflict." Generalizes
   across the evaluation/paper corpus.
2. **Specific case facts** — "what happened in Darfur, who did what, what resulted." Grounded
   in DPD case records.
> Milt's view: case-specific facts will ultimately be **more useful to funders** making
> real-world decisions. Users should understand both are available.

## Citation & source model
- Every substantive claim carries an **inline citation**.
- A citation resolves to a **source record**: an EIRENE indicator, a DPD case, or a library
  paper — **deep-linked to the internal DB entry**, not just an external PDF. (Agent could link
  individual papers by early July; internal deep-linking was ~1–2 weeks out — confirm status
  with Nathanael.)
- Source view shows provenance (author/year/dataset), summary/annotation, and a path to the
  original. See [`03-ui-spec.md`](03-ui-spec.md) §E.

## Rigor / evidence-confidence framework — **[OPEN, in progress]**
- A **rigor-ranking system is currently lacking** (flagged by Ahn as a data-structure
  limitation). An **evidence-confidence framework** and library-curation methodology were to be
  developed with **Ben Valentino** (board chair, Dartmouth).
- **Design impact:** leave a **slot** for an evidence-confidence badge on source records and
  possibly on cited claims, but treat its exact scale/values as TBD. Don't hard-code a rating
  scheme the research side hasn't defined.

## Quality / governance (context, not UI-critical for MVP)
- Source verification handled via a **proactive, collaborative standard** (one-session
  workshop with AFP to define criteria) rather than a formal dispute committee.
- Continuous **paper-ingestion pipeline with human-in-the-loop review** was a stated goal.

## Suggested entity shapes (for prototype data / Figma content)
Directional, to make mockups realistic — confirm field names with Nathanael before any code.

```
Indicator (EIRENE)
  id · evaluation_id · construct/measure · finding · effect_direction
  intervention_type · region · source_ref → Evaluation

Case (Dimensions of Peace)
  id · conflict_name · region · years · dimensions[]
  intervention_types[] · annotated_bibliography[] · sources[]

Paper (Library)
  id · title · authors[] · year · abstract/summary · topics[]
  intervention_types[] · source (e.g. OpenAlex) · url · confidence[TBD]

Citation
  claim_span → source_ref (Indicator | Case | Paper) · display_label ([1],[2]…)
```
