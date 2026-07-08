# 02 · Information Architecture

## Two surfaces, one brand

The consistent architectural pattern in the notes: a **brand/marketing site on the primary
domain** and the **application on a subdomain** — separating the brand narrative from the
functional tool.

```
peaceintel.org            → Marketing site (public, brand narrative, the pitch, the way in)
app.peaceintel.org        → The application (agent + library experience)   [ASSUMPTION: subdomain name]
```

Owned domains: **peaceintel.org, peaceintel.com, peaceintelligence.org** (Nathanael to also
register .net / .ai variants). `peaceintel.com` and `peaceintelligence.org` should redirect to
the canonical `.org`. **[OPEN]** confirm which domain is canonical for launch.

> Historical note: an earlier plan used `peaceconnect.io` + `app.peaceconnect.io`, and a
> separate `almanac.pe.org` for the Almanac article series. "PeaceConnect" is retired; the
> subdomain-split *pattern* still holds. The Almanac may still warrant its own site/section —
> **[OPEN]**, out of scope for this prototype unless you want to stub it.

---

## Marketing site — sitemap

```
peaceintel.org/
├── /                    Home — what Peace Intel is, the pitch, primary CTA → app
├── /about               The mission, EPI, the team, credibility
├── /how-it-works        The agent + the library; the "cognitive agent, not chatbot" story
├── /evidence            The data story: EIRENE, Dimensions of Peace, curated library
│                        (this is the "Swiss watch" — proof the corpus is real)
├── /use-cases           Who it's for + what they do with it (funders, practitioners, researchers)
├── /for-funders         Funder-specific value prop (primary audience)              [SHOULD]
├── /almanac             Global Peace Almanac content stream                        [COULD / OPEN]
├── /contact  ·  /request-access  ·  /join                                          [ASSUMPTION]
└── → CTA everywhere: "Try Peace Intel" / "Request access" → app.peaceintel.org
```

Marketing-site priorities for MVP: **Home**, **How it works**, **Evidence**, **Use cases**,
and a working CTA into the app. `/for-funders` is high value given the audience. Everything
else can be stubbed.

Access model **[OPEN]:** launch sequence is *board → PSFG members → donor networks*, i.e.
gated beta before public. So the marketing CTA is likely **"Request access"** (waitlist /
invite) rather than open signup, at least through January. Confirm with Ahn.

---

## Application — screen inventory

The app is **chat-first with a context sidebar** (this replaced the earlier three-box
chat/library/explore concept on 2026-07-08). Screens:

```
app.peaceintel.org/
├── (onboarding)         First-run intro / welcome + light context-setting          [SHOULD, A/B]
├── /  (landing)         Entry state: welcome message + use-case cards (Elicit-style)
│                        Clicking a card populates the entry box
├── /c/:id  (chat)       The conversation: agent answers w/ inline citations
│                        + Context sidebar (scope control: datasets / lenses)
│                        + "Good question" indicator on the composer
├── (source view)        Citation target: an internal DB entry (EIRENE/DPD record) or paper
│                        [ASSUMPTION: modal/drawer vs. dedicated route — designer's call]
├── /library  (shelf)    Browsable "simple shelf" of the corpus — a library explorer
│                        (NOT a data explorer, NOT advanced search)
└── /account  ·  /settings (theme toggle, etc.)                                     [ASSUMPTION]
```

New chats / conversation starters **open in new tabs** (not hosted inline on the front page).

---

## Primary navigation

**Marketing site (top nav):**
```
[ Peace Intel logo ]   How it works   Evidence   Use cases   For funders        [ Request access ]
```
Data-forward and restrained. One clear primary CTA.

**Application (left rail + top):**
```
┌──────────────┬───────────────────────────────────────────────┐
│  Peace Intel │  conversation title                    ☾ / ☀  │  ← theme toggle
│  ──────────  │                                                │
│  + New chat  │                                                │
│  Recent      │            (chat transcript)                   │
│   · …        │                                                │
│   · …        │                                                │
│  ──────────  │                                                │
│  Library     │  ┌ composer ─────────────────────────────────┐ │
│  Account     │  │ Ask about peacebuilding evidence…   [send] │ │
│              │  └───── "good question" meter ──────────────┘ │
└──────────────┴───────────────────────────────────────────────┘
```
The **context sidebar** (scope/lens control) can live as a right-hand panel or a toggle within
the chat view — see [`03-ui-spec.md`](03-ui-spec.md) for both options.

---

## Content types (what the app renders)

- **Agent message** — prose answer with **inline citation chips**.
- **Citation** — resolves to a *source*: an internal EIRENE indicator record, a DPD case
  record, or a paper (internal entry preferred over raw external PDF).
- **Use-case card** — title + pre-written query; click → populates composer.
- **Library item ("shelf")** — a paper / evaluation / dataset entry with metadata.
- **Case entry** — a conflict from Dimensions of Peace (~150–200), ideally with an annotated
  bibliography and intervention-type coding.
- **Indicator** — an EIRENE evaluation indicator (14,755 total), linked to its source.
