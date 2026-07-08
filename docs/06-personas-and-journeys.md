# 06 · Personas & Journeys

## Audience priority

Confirmed 2026-07-08: **funders are the primary audience** — the highest-leverage node in the
peacebuilding ecosystem (they change *what gets done*). The three-profile model from the AFP
discussions still holds for design coverage:

1. **Funders / portfolio managers** — *primary.* Harder to convert, highest impact.
2. **Practitioners / project & program managers** — easier to convert, lower leverage.
3. **Researchers / scholars** — lower volume, essential for credibility.
4. *(Aspirational)* larger institutional actors (e.g. World Bank, UN staff).

The design tension to hold: **credible enough for scholars, accessible enough for practitioners
and funders.** And the onboarding challenge (Nathanael): users arrive with different needs and
the agent should *invisibly meet them where they are* — ideally without a heavy setup wall.

---

## Persona 1 — Priya, the Funder / Portfolio Manager  *(primary)*

- **Context:** Program officer at a peace & security foundation (think PSFG member). Reviews
  many grant proposals; decides where money goes. Not a methodologist.
- **Goals:** Sanity-check whether a proposal's theory of change is evidence-backed; understand
  "what usually works" *and* "what actually happened" in a given conflict; do light partner
  due diligence.
- **Pains:** No time; wary of hype; needs defensible reasoning she can bring to a committee;
  distrusts a black-box chatbot.
- **What wins her:** Cited, honest answers (including "evidence is mixed / thin here"); the
  visible depth of the corpus; case-specific facts she can act on.
- **Key flow — *Evaluate a proposal*:**
  1. Lands on marketing `/for-funders` → "Request access" / into app.
  2. App landing → clicks **"Evaluate a proposal"** card → composer pre-filled.
  3. Pastes/describes the proposal's approach; sets evidence type to **Both**.
  4. Agent returns a grounded assessment with **[1][2][3]** citations; she opens a couple of
     **source records** to verify.
  5. **Copies** the answer into her committee notes.

## Persona 2 — Daniel, the Practitioner / Program Manager

- **Context:** Designs and runs interventions at an NGO. Writes theories of change and program
  designs; assembles evidence for proposals.
- **Goals:** Find what's worked in comparable contexts; build a defensible theory of change;
  quick literature scans without a database subscription.
- **Pains:** Paywalled academic literature; hard to know what's rigorous; limited research time.
- **What wins him:** Practitioner-source data (after-action reports) he can't get elsewhere;
  fast, cited literature reviews; the "good question" nudge helping him ask better.
- **Key flows:** *Design a program* · *Create a literature review* · *Research a historical
  conflict.*

## Persona 3 — Dr. Reyes, the Researcher / Scholar  *(credibility gatekeeper)*

- **Context:** Academic in peace & conflict studies (the Ben Valentino / York University
  archetype). Will judge the tool's rigor and influence whether peers trust it.
- **Goals:** Check provenance and methodology; probe coverage and confidence; see whether
  citations are real and traceable.
- **Pains:** AI tools that hallucinate or launder unsourced claims; opaque curation.
- **What wins her:** Transparent citations to internal records; honest coverage gaps; a real
  evidence-confidence framework (once defined); the sense this is *curated*, not scraped.
- **Design implication:** she is why **citation integrity, source view, and no-evidence
  honesty** are non-negotiable — even if funders are the volume audience.

---

## Cross-cutting journeys

### First-run onboarding (S1 — two variants for A/B)
- Keep it **light and skippable.** Capture at most role (funder / practitioner / researcher)
  and maybe a current task. The agent adapts invisibly; it does **not** gate the user behind a
  long form.
- Variant A/B differ in framing (e.g. role-first vs. task-first). Ahn + Matt co-draft; Ben
  Valentino reviews for academic rigor. Instrument both for comparison.

### The "chatbot trap" (the anti-journey to design against)
- Observed repeatedly: users treat the agent like a basic chatbot, ask shallow questions, and
  miss the depth. This is the **central UX risk.**
- Countermeasures baked into the UI: **use-case cards** (model good questions), the **"good
  question" indicator** (real-time coaching), **visible citations** (signal rigor), and the
  **library/stats** (signal depth). Design these as a *system* that pulls users toward deep use.

### Go-to-market moment (context for the pitch surfaces)
- Launch sequence: **board first** (first field-test group) → **PSFG members** → Milt/Peter
  donor networks. Public **January 2027**.
- PSFG engagement is framed as a **"co-design" invitation** — funders help shape the product
  for their own use, not a finished-product pitch. The marketing site and first-run experience
  should feel like an invitation to shape something, not a hard sell.
