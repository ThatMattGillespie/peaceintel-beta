# 03 · UI Spec

Screen-by-screen layouts to translate into Figma frames. ASCII wireframes are
directional — spacing/type/color come from [`04-brand-and-visual-design.md`](04-brand-and-visual-design.md).
Design **desktop-first** (funders/researchers on laptops), but keep the chat surface usable on
tablet/mobile.

Legend: `[ ]` button · `( )` input/affordance · `«»` dynamic content · `▸` expandable.

---

## A. Marketing — Home (`peaceintel.org/`)

Job: in one screen, land the "cognitive agent, not chatbot" story and drive to the app.
Restraint is the brand (see §Brand). Let the data speak.

```
┌───────────────────────────────────────────────────────────────────────────┐
│ [Peace Intel]        How it works   Evidence   Use cases   For funders      │
│                                                            [ Request access ]│
├───────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   The largest corpus of peacebuilding evidence                              │
│   in one place — answered by a cognitive agent.                             │
│                                                                             │
│   Curated. Citable. Built for the people who fund and                       │
│   design peace.                                                             │
│                                                                             │
│        [ Try Peace Intel → ]   [ See the evidence ]                         │
│                                                                             │
│   «subtle bitmap-dithered / grid backdrop — restrained, not flashy»         │
├───────────────────────────────────────────────────────────────────────────┤
│   ┌───────────┐   ┌───────────┐   ┌───────────┐                             │
│   │ 14,755    │   │ 677       │   │ ~150–200  │   ← proof-of-corpus stat row │
│   │ indicators│   │ evaluations│  │ conflicts │     ("the Swiss watch")     │
│   └───────────┘   └───────────┘   └───────────┘                             │
├───────────────────────────────────────────────────────────────────────────┤
│   Not a chatbot. A cognitive agent.                                         │
│   «short 3-column: Curated & citable · Exclusive practitioner data ·        │
│    Memory that learns (Graffiti)»                                           │
├───────────────────────────────────────────────────────────────────────────┤
│   What you can do                                                           │
│   «use-case tiles: Evaluate a proposal · Research a conflict ·              │
│    Create a literature review»                                              │
├───────────────────────────────────────────────────────────────────────────┤
│   Footer: EPI · About · Contact · (Almanac) · legal                         │
└───────────────────────────────────────────────────────────────────────────┘
```

Notes:
- The **stat row** is load-bearing brand: it's the visible proof the corpus is real. Use real
  numbers; keep them prominent and unembellished.
- Avoid stock "AI" imagery. The aesthetic *is* the differentiator.

---

## B. App — Landing / entry (`app.peaceintel.org/`)

Job: an inviting, low-friction entry that models good questions. Modeled on **Elicit's**
landing page — example cards with pre-written queries that populate the entry box.

```
┌──────────────┬────────────────────────────────────────────────────────────┐
│ Peace Intel  │                                                       ☾ / ☀ │
│ ──────────   │                                                            │
│ + New chat   │      Welcome to Peace Intel.                               │
│              │      «1–3 line intro framing what this is — owned by Ahn»  │
│ Recent       │                                                            │
│  (empty)     │      What would you like to explore?                       │
│              │                                                            │
│              │   ┌────────────────────┐  ┌────────────────────┐          │
│              │   │ Evaluate a proposal│  │ Research a conflict │          │
│              │   │ "Is this grant     │  │ "What happened in   │          │
│              │   │  grounded in        │  │  Darfur, who did    │          │
│              │   │  evidence?"         │  │  what, what          │          │
│              │   └────────────────────┘  │  resulted?"          │          │
│              │   ┌────────────────────┐  └────────────────────┘          │
│              │   │ Literature review  │  ┌────────────────────┐          │
│              │   │ "Summarize the      │  │ Design a program   │          │
│              │   │  evidence on …"     │  │ "What works to …"   │          │
│              │   └────────────────────┘  └────────────────────┘          │
│              │                                                            │
│ Library      │   ┌ composer ─────────────────────────────────────────┐   │
│ Account      │   │ Ask about peacebuilding evidence…          [ ↑ ]   │   │
│              │   └──── ( ● good question ) ─────────────────────────┘   │
└──────────────┴────────────────────────────────────────────────────────────┘
```

- **Clicking a card populates the composer** (does not immediately send) so the user can edit.
- Cards should map to the MVP use cases. Keep 4–6, curated.
- The intro copy is a real deliverable (Ahn + Matt); leave a clearly-labeled slot for it.

---

## C. App — Chat (`app.peaceintel.org/c/:id`)

Job: the core experience. A grounded conversation with **inline citations** and a way to
**control scope** without leaving the flow.

```
┌──────────────┬─────────────────────────────────────────┬──────────────────┐
│ Peace Intel  │  Evaluating the Darfur proposal      ☾/☀ │  Context          │
│ ──────────   │                                          │  ───────          │
│ + New chat   │  ┌ You ───────────────────────────────┐  │  Sources in scope │
│ Recent       │  │ Is this proposal's theory of change │  │  ☑ EIRENE         │
│  · Darfur…   │  │ supported by evidence?              │  │  ☑ Dimensions of  │
│  · GBV lit…  │  └─────────────────────────────────────┘  │     Peace         │
│              │                                          │  ☑ Paper library  │
│              │  ┌ Agent ─────────────────────────────┐  │  ☐ Ask Irene      │
│              │  │ The proposal assumes dialogue        │  │     (indicators)  │
│              │  │ reduces violence. Evidence is        │  │  ───────          │
│              │  │ mixed: in comparable cases,          │  │  Evidence type    │
│              │  │ dialogue-only interventions          │  │  ◉ Both           │
│              │  │ showed limited effect [1], while     │  │  ○ General insight│
│              │  │ combined DDR + dialogue performed    │  │  ○ Case facts     │
│              │  │ better [2][3].                       │  │                   │
│              │  │                                      │  │                   │
│              │  │ [1] EIRENE · indicator #… ▸          │  │                   │
│              │  │ [2] Dimensions of Peace · Darfur ▸   │  │                   │
│              │  │ [3] Paper: Author (year) ▸           │  │                   │
│              │  │                        [ copy ]      │  │                   │
│              │  └─────────────────────────────────────┘  │                   │
│ Library      │  ┌ composer ────────────────────────────┐ │                   │
│ Account      │  │ Follow up…                      [ ↑ ] │ │                   │
│              │  └──── ( ● good question: strong ) ──────┘ │                   │
└──────────────┴─────────────────────────────────────────┴──────────────────┘
```

Required behaviors:
- **Inline citation chips** `[1] [2]` on claims; each resolves to a source (see §E).
- **Context sidebar (right):** toggle which datasets/lenses are in scope, and the **evidence
  type** (general insight / case facts / both) per Milt's distinction. On tablet/mobile this
  collapses behind a toggle.
- **"Good question" meter** on the composer (see §F).
- **Copy** action on answers (copy-paste preferred over export for MVP).
- **New tab** behavior for starting fresh conversations from starters.

**Alt layout (2-pane):** if the right sidebar is too heavy for MVP, fold context into a
toggle/drawer from the composer. The left rail stays.

---

## D. App — Library "shelf" (`app.peaceintel.org/library`)

Job: make the corpus tangible. A *library* explorer (browse), **not** a data explorer
(no advanced query builder). Start with a "simple shelf."

```
┌──────────────┬────────────────────────────────────────────────────────────┐
│ Peace Intel  │  Library                                              ☾ / ☀ │
│ ──────────   │  «~3,200 papers · 14,755 indicators · ~150–200 cases»       │
│ + New chat   │  ( filter: topic ▾ )( region ▾ )( type ▾ )   ( search … )   │
│              │  ──────────────────────────────────────────────────────    │
│ Recent       │  «bitmap "shelf" motif — rows of spines / cards»             │
│              │  ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐                        │
│              │  │item││item││item││item││item││item│   ← papers/evaluations │
│              │  └────┘└────┘└────┘└────┘└────┘└────┘                        │
│              │  Cases (Dimensions of Peace)                                 │
│              │  ┌────┐┌────┐┌────┐┌────┐   ← conflicts w/ annotated biblio  │
│              │  └────┘└────┘└────┘└────┘                                    │
│ Library ◀    │  Indicators (EIRENE / Ask Irene)                             │
│ Account      │  «count + link into indicator view»                         │
└──────────────┴────────────────────────────────────────────────────────────┘
```

- Selecting an item opens the source view (§E), and offers **"Ask the agent about this"** →
  starts a chat scoped to that item.
- Filters should reflect real facets: topic, region, intervention type (from EPI's codebook),
  evidence type, source dataset. Keep it light for MVP.

---

## E. Source view (citation target)

Job: deliver on the promise "citations link back to the source." Deep-link to an **internal
DB entry**, not just an external PDF.

```
┌ Source ───────────────────────────────────────────────── [ × ] ┐
│ «Title of paper / evaluation / case»                             │
│ Author(s) · Year · Source dataset (EIRENE / DPD / library)       │
│ ── evidence-confidence / rigor: «badge»  [COULD — framework TBD] ─│
│ Summary / abstract / annotated note                              │
│ Key indicators or findings «list»                                │
│ [ Open original ↗ ]   [ Ask the agent about this ]   [ copy ]    │
└──────────────────────────────────────────────────────────────────┘
```

Designer's call: modal/drawer vs. dedicated route. Drawer keeps the conversation in view,
which fits the "guide + institution" model.

---

## F. Key components & states

**"Good question" indicator** (M7, high priority)
- Real-time signal on the composer about query quality; nudges users out of shallow
  chatbot-style prompting toward the deeper interaction that extracts real value.
- States (suggested): `too vague` · `okay` · `strong` — with a one-line tip on how to improve
  (e.g. "name a conflict, region, or intervention type"). Keep it encouraging, not scolding.

**Citation chip** — default / hover (preview) / active. Numbered, unobtrusive, clearly clickable.

**Use-case card** — default / hover / clicked (populates composer). Title + example query +
subtle category.

**Evidence-type control** — general insight · case facts · both (per Milt). Persists per
conversation.

**Empty / loading / error / no-evidence** — design all four. The **no-evidence** state matters
most for credibility: when the corpus doesn't cover something, say so plainly rather than
hallucinating. This is a *trust* feature, not an edge case.

**Onboarding (S1)** — two variants for A/B. Keep it light and skippable; the agent should
*invisibly* adapt, not gate the user behind a long form. Capture at most role
(funder/practitioner/researcher) and maybe a current task.

**Theme toggle** — light/dark, both on EPI accent color.

---

## G. Design principles (hold these while wireframing)

1. **Clean beats clever.** "We're a clean tool… let the data speak." Restraint reads as
   credibility.
2. **The agent is the guide; the library is the institution.** Chat is primary (~80–90% of
   expected traffic); the library exists to prove depth and to be browsable — not to compete
   with chat.
3. **Never look like a generic chatbot.** If it reads as ChatGPT, users interact shallowly and
   miss the value. Citations, evidence controls, and the "good question" meter are what make
   it feel different.
4. **Show your work.** Every claim traceable to a source; be honest about gaps.
5. **Meet users where they are.** One interface that adapts, over separate portals — pending
   the funder-portal **[OPEN]** question.
