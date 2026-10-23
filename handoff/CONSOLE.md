# The console: behaviour, content and what production has that the prototype does not

**For:** Nathanael Miksis and his coding agent
**From:** Matt Gillespie
**Updated:** 2026-10-21 (Rev 60: clarifying questions, research updates, the field's active state). Rev 39 (16 Oct) took Matt's verdicts on every production feature and word

`console.html` with `prototypes.js` is the console as a working prototype. It is the spec for
**how the console looks and behaves**, not code to copy: `prototypes.js` is a mock written to be
read, with fake data and no network. This file writes down what the prototype does, so nothing
depends on noticing it, and lists what is illustrative so it does not ship as content.

If this file and the CSS disagree, the CSS wins (`components.css`, then `explorations.css`), and
this file is the bug. If this file and the prototype disagree on behaviour, ask Matt.

---

## 1. Status of each part

**The whole console is Stable as of Rev 39** (Matt, 16 Oct: build it). Every part below is in
`components.css`. Two parts are internal: the version badge and the staff "All users" view.

| Part | Where it is drawn |
|---|---|
| The shell: top bar, rail, chat, library pane, composer, their folds | `components.css` |
| A chat: messages, citations, the read-aloud button, Export, Share, Expand | `components.css` |
| An answer's sources (in `.ans-foot`), its foot (`.ans-foot`) with *Give feedback* (`.af-fb`) | `components.css` |
| The library pane: search, sort tray, cited-first list, tier marks | `components.css` |
| Projects: the project page, instructions, context, memory, artifacts, New chat here | `components.css` |
| Dialogs (`.dlg`), the finder (`.find-*`), Share with General access (`.pop-access`) | `components.css` |
| What a paper opens to: the quick view and the full entry (section 5) | `components.css` |
| The clarifying questions and the research updates (section 2; every state on `console-parts.html`) | `components.css` |
| The console on a phone: one-row composer, the two drawers (section 3) | `components.css` |

---

## 2. The desktop console

**The top bar.** The logo, the console's links (Admin, Alerts, Library) and the avatar. There
is no theme toggle: the system has one theme. Eirene is not here; it is an answer mode.

**The rail** (`.app-rail`, `.surface--ground-2`, `--rail-w`). Head: the chats mark, "Chats", a
new-chat icon, a search icon (opens the finder) and the fold. Then **Projects** (a + makes one;
an open project shows New chat here, its chats and a line counting its artifacts) and **Recent**
(chats outside any project, with dates). There are no Chats / Reports / Projects tabs: a report
is a document artifact inside its project. Folded, the rail leaves a shelf with the button that
reopens it.

**Staff only: every user's chats** (internal). For an admin, the Recent line carries one quiet
mono toggle, *All users*, with the people glyph. On, the line reads *Recent, all users* and the
list adds every user's chats, each dated and named for its owner. Off by default; invisible to
anyone who is not staff.

**The chat** (`.app-main`). A toolbar: the breadcrumb when the chat is in a project, then Export
(save as an artifact, or download the chat), Expand (folds both sides at once), the people it is
shared with and Share, and the fold for the pane. Messages: the user's in a `--fill` bubble, the
answer as a document with serif headings, inline citations (`.cite`, by tier) and a read-aloud
button.

**The library beside a chat holds what the chat cites.** Searching widens it: matches in the
chat first under *In this chat · N*, then the rest of the library under *In the library · N*
(`.pane-sec`), so a search never stops at the chat. A chat with no citations shows the whole library.

**After every answer, its sources** (in `.ans-foot`), **folded by default** to one line: *Sources ·
N*, then one chip per tier the answer uses (three at most), each with its count, first in the answer's row. The mark
carries the tier (filled in the library, outlined abstract only, dashed ↗ on the web), so open, the
rows need no group headings and no *Read on platform* label: each `.evi-row` leads with its mark,
then the title in the serif and the authors and year under it, and ends in the pixel arrow (`--px-arrow`; `--px-arrow-out` for the web).
Pointing at or focusing a row lights its marks in the answer (`.cite.lit`), so the list is a key to
the text. **Every row opens the paper's quick view first**, even a web source, so the reader sees the
whole title and where the link goes before anything leaves the platform (section 5).

**Under the sources, one quiet line** (`.ans-foot`): at the left, *25 tools used* in faint mono,
folded (`details`), opening to the steps taken; at the right, three bare icons: copy with
citations, and a vote up and down (`aria-pressed`, one at a time, pressing again clears it).

**In the last answer's foot, *Give feedback*** (`.af-fb`), after the sources with the same
chevron (a speech-bubble icon at phone width). It opens **the session reflection**
(`.reflect`) under the answer, production's "Before you go" survey restyled: *How did this session
go?*; overall expectations on a 1 to 5 scale (1 fell short, 5 exceeded); what it was used for
(choose any: evaluating a proposal, researching a conflict, literature review, program design,
funding decision, briefing or talking points, monitoring and evaluation, personal learning,
other); what was missing, in a sentence or two; and four dimensions on 1 to 5 (understood what I
was looking for, accurate and well-grounded, cited sources appropriately, useful for my work).
*Not now* closes it; *Send* replaces it with a line of thanks. Keep production's questions if they
differ; the form is what changes.

Below, the composer.

**Before deep research, the clarifying questions** (`.clarify`, H1.19). Production asks one to a
few questions before it starts; keep its questions and its logic, restyle the card. It sits in the
thread after Peace Intel's line saying why it is asking: a raised object (face, edge, 4px), headed
*Question 1 of 2* in neutral mono with the 2px ink line under the steps done, the question in the
serif (the card's only serif line), one help line, then the options in a tray. One answer is a
radio; several, a checkbox. With the keyboard, the option in focus shows it by its own edge in the middle grey (`--ink-35`), on the tray or on the chosen tile: no orange ring on a choice. A checkbox has 2px corners (`--r-check`) so it never reads as a radio (Rev 63). Production writes an option as "Lead term — gloss": set the lead term
in bold and drop the dash. The last option is always *Write my own answer*, which opens a field
under the tray; drop production's second "Something else (please specify)". The foot holds *Skip
questions* (ghost) and *Next* (the tint; *Start research* on the last question); from the second
question on, *Back* sits in the head. Answered, the card leaves the thread and the answers go in as
the reader's own message, one line per question (*Lens: Policy and advocacy*). Skipped, one line in
ink where the card was (`.cq-done`), and the answer says what it assumed in its first paragraph.

**While it researches, the research updates** (`details.ru`, H1.20). They are the working state:
the newest update is the pending answer's own text, ending in an ellipsis; the earlier ones fold
above it under one faint mono line, *2 earlier updates*, the twin of *25 tools used*. When the
answer lands, every update folds into that line (*3 research updates*, closed) at the head of the
answer. Open, each is a row on a hairline: *Update 1* in mono, then the sentence at `--t-sm`. No
warm, no accent rule, no edge on the toggle, no spinner.

**The field's active state** (H1.21). **Production's input field does not match the handoff when
it is active.** Build it from the CSS: the composer has no shadow at rest, and while you type in it
its edge darkens to `--ink-35` and it lifts to `--elev-3` (`.composer:focus-within`); the textarea
inside draws nothing of its own (no ring, border, padding or shadow). Every other text field, when
focused, darkens its edge to `--ink-35` and takes `--elev-1`, with no outline (`.input:focus`).
No field takes an accent ring or an accent edge; the accent focus ring (`:focus-visible`) is for
buttons and other controls reached by keyboard.

**The composer** (`.composer`). The field, then one bar with two ends: at the left what shapes the
answer (the mode tray **Quick / Normal / Deep research / Eirene**, the paperclip, spoken replies,
settings, and the version badge, bare mono, internal);
at the right the two ways to send, the microphone against the send button. Enter sends,
Shift+Enter is a new line. A file attached with the paperclip shows as a small chip above the
field, with a cross to remove it, and goes with the next question. There is no tip line under
the composer. The field has no padding or shadow of its own: the composer is the box.
It has no shadow at rest; it lifts on focus.

**The library pane** (`.app-pane`, `.surface--ground-2`, `--pane-w`). Head: the library mark,
"Library", a readout of how many sources the chat in view cites, the fold. Then the search field
(its placeholder carries the library's size), a filters button, the sort tray (Title, Tier,
Authors, Year, Type) and the list: the papers this chat cites first, in citation order, then the
rest. **The library never takes the full screen**: widening it folds the rail instead.

**Shell state lives in data attributes** on `.app`: `data-view` (chat, project, doc),
`data-rail` and `data-pane` (on, off), `data-drawer` (rail, pane, on narrow screens),
`data-reader` (the full entry is open).

---

## 3. Narrow screens

| Width | What changes |
|---|---|
| **Under 1080px** | The rail and the pane are put away. The chat's toolbar leads with the **chats shelf** button (`.rail-open`, outlined like the ⋯ button, the panel-left-open glyph a folded rail uses on desktop), mirroring the sources count at the right; it opens the **chats drawer** from the left, with projects, chats, new chat and search in its head and the console's links at its foot. The hamburger in the top bar (far right, after the avatar) opens the same drawer. The sources count (below) opens the **library sheet**. Expand is hidden. |
| **Under 620px** | The phone layout: the top bar's links go (they are in the drawer); the toolbar is one off-white row (`--ground`); the composer is one row (below); the top bar slides away while the thread scrolls down and back on any scroll up. |

**The chat's toolbar on a phone** reads, left to right: the project's name (truncated), then the
**utility button** (⋯: Search this chat, Share, Export, each opening from it as it would from its
own button), then at the far right the **sources count**: a citation chip in the accent, ● and the
count in two digits, with the pane's open glyph after it. It is the toolbar's buttons' height
(`--sp-8`). It appears only when the chat cites something.

**The toolbar and the composer sit over the thread** (Rev 51, 52): in a chat the toolbar is the
scroll area's first child, sticky at its head with a fade below it (on a phone, its off-white strip
instead), and the composer is its last child,
sticky at its foot, and its ground fades in over the top `--sp-8`, so the thread scrolls to the
bottom of the window and dissolves behind the field instead of stopping above it.

**The two drawers** (`data-drawer="rail"` and `"pane"`, Rev 49). One pattern on both sides: the
chats slide in from the left, the library from the right (wider: the frame less `--sp-8`, at most
640px, so a sliver of the chat shows at its left), full height, each with one hairline
(`--edge`) on its inner edge, on `--mo-sheet`, the one motion in the system that moves a surface.
A swipe toward the drawer's own edge follows the finger with no easing; let go past a quarter of
its width, or flicked, it closes, otherwise it springs back. The scrim, Escape and the head's fold
button close it too, the same way. While a drawer is open that fold button (or a paper's cross)
wears an active state, outlined with a wash, since the drawer covers the button that opened it. With reduced motion they appear and go instantly. A paper opened
from the library opens inside its drawer; the arrow steps back to the library.

**The chats drawer** (`data-drawer="rail"`). The rail, over the chat from the left, with a scrim.
It appears without a slide. Tapping a chat opens it and closes the drawer.

**The top bar on a phone** (logo, account, menu) slides up out of the frame while the thread
scrolls down past the first 64px, and slides back on any scroll up (Rev 53), on `--mo-sheet`; the
toolbar rises and falls with it. While it moves, scroll events are ignored so the change in the
thread's height cannot bounce it. Reduced motion makes it instant. It simply goes; it does not slide.

**The composer on a phone.** The field starts at one line and grows with the text to six. One row
under it: the **mode chip** at the left (outlined, naming the mode, with a chevron; it opens a menu
of Quick, Normal, Deep research, Eirene and Spoken replies) and the paperclip, the microphone and
send at the right. The
mode tray, spoken replies, settings and the badge are not on the bar. The chip's edge and the
send's edge sit on the field's own edges: the composer's padding is `--sp-2` on three sides.

---

## 4. Search, share and export

**The finder** (Exploration). The rail's search icon or Cmd K (Ctrl K) opens one field over every
chat, project and artifact you have made, with a tray to narrow it (All, Chats, Projects,
Artifacts). Before anything is typed it shows recent chats and two actions (New chat, New
project); typed, it groups results and offers "Ask Peace Intel … in a new chat". A result that matched inside a
chat shows the matching line under its title, up to two lines, the words in bold (Rev 62, Nathanael's layout). Arrow keys move, Enter opens, Escape closes. Papers are
not in it: the library has its own search.

**Search from a chat's toolbar** opens the finder on **This chat** first: matches in this
conversation, message by message. Choosing one scrolls the thread to the message and highlights every place the words occur in it, the first in the middle of the screen, in a neutral grey wash (`--hl-find`, `::highlight(find)`; Rev 61). Grey, because the orange highlighter (`--hl`) means the passage a citation points to. No box round the message. The highlight stays until the next search. Match across inline formatting (bold, links, citations). The tray
widens the search to everything.

**Share.** A chat outside a project: a line saying how to work on it together (start it in a
shared project), General access, and Copy link. A project: invite by email with a role (Can edit,
Can view), the people with access with their roles (and Remove), General access, Copy link.
**General access** is one select: *Only people with access* (projects only), *Your
organisation*, or *Anyone with the link*. *Your organisation* means a signed-in person with a
confirmed email at the owner's domain, and its label names the domain (*Anyone at
effectivepeace.org*); it is not offered to an owner on free email, and a short list of large
shared domains (the UN family, governments) is excluded (production, 23 Oct). Anyone means **public**: view only, no sign-in, no
editing or replying, and the panel says so in ink with a globe.

**Export.** Save the chat as an artifact (into its project, or a chosen project if it has none),
or download the chat. An artifact downloads by kind: a document as PDF, Word or Markdown; a
spreadsheet as Excel or CSV; a PDF as PDF. A project's page has no Export: Export saves or
downloads a chat, so it is on every chat's toolbar, inside a project or not.

**An artifact's toolbar** (Rev 62). The pencil (Rename) renames in place: the title stays at its
size and in its face, its edge darkens and it lifts (`.pj-rename`); a title that runs to two lines
wraps while it is edited. Then Download and Share. Every control in a toolbar is `--sp-8` tall.

**Editing a spreadsheet** (Rev 62; production built it, the prototype does not draw it). *Edit
table*, an `.act` beside the pencil, starts it; the toolbar then holds *Cancel* (`.btn.ghost.sm`)
and *Save* (`.btn.tint.sm`). The table keeps its reading layout (the same mono heads, the same
wrapping rows); the cell being edited becomes a field in place, the size of its text, with a
field's focus: an ink edge and a lift (`.sheet-t .sheet-edit`). *Add a row* is an `.act` under
the table. Every state is drawn on `console-parts.html` (H1.23 to H1.25).

---

## 5. What a paper opens to

A citation in an answer, or a row in the library, opens the paper in the pane (in its drawer on a
phone).

**The quick view** (`.src-q`): a head with a back arrow (to the library), "Source" and a cross.
Then the title in the serif; authors, year and kind in mono; the tier as the evidence list writes
it (mark, name, gloss: *In the library · full text on the platform*, *Abstract only · the full text
is not held*, *Web source · outside the library, verify*); which citation this chat cites it as.
Three actions: **Read the full entry** (tiers 1 and 2; *Read the abstract* when only the abstract is
held; it opens in the widened pane, not a new page), **Download PDF** (tier 1 only), **Original
source ↗**. Under them, where the original source link goes: *Original source opens
doi.org/…*, the address in mono. Then **Key assertions**, numbered; **Details**, as
outlined chips; **Summary**. Section labels are mono (`.eyebrow`), never serif capitals.

**The full entry** (`.src-r`): on a desk the pane widens to a little more than the chat
(`data-reader`), so the paper reads beside the answer that cites it. The author, the title at
`--t-h2`, the tier, the number of sections and pages, a contents line when there are more than two
sections, then the sections, each one folding (`details`). The passage this chat cites takes the
highlighter (`--hl`), with a line saying which citation it is, and **the entry opens scrolled to
it**. The arrow returns to the quick view.

### The data each view needs

The prototype's field names are its own; production already has these fields under other names.
Map them, do not rename production's.

| The view shows | Prototype field (`prototypes.js`) | Notes |
|---|---|---|
| Title, authors, year, kind | `LIB[id].t`, `.a`, `.y`, `.k` | |
| Tier | `LIB[id].tier` (1, 2, 3) | Drives the mark, the gloss and which actions show |
| Key assertions | `SRC[id].as[]` | A short list of sentences |
| Details | `SRC[id].tags[]` | Places, methods, themes |
| Summary | `SRC[id].sum` | One paragraph |
| Held as abstract only | `SRC[id].abstractOnly` | The full entry shows the abstract alone |
| Page count | `SRC[id].pages` | |
| Sections | `SRC[id].secs[]` of `{ h, ps[] }` | Heading and paragraphs |
| The cited passage | a paragraph `{ c, t }` inside a section | `c` is the citation number; production needs the passage's location in the paper |
| Which citation this chat cites it as | computed from the chat (`citedIn`) | |

---

## 6. Keyboard, focus and screen readers

- **Cmd K / Ctrl K** opens the finder from anywhere in the console.
- **Escape** closes the open menu, panel, dialog, drawer or sheet, one layer at a time.
- **Focus returns** to the control that opened a menu, panel, drawer or sheet when it closes.
  Opening a drawer moves focus to its head's fold or close button.
- **Enter** sends from the composer; **Shift+Enter** is a new line. **Double-click** renames a
  project or an artifact in place.
- Menus are `role="menu"` with `aria-haspopup` and `aria-expanded` on their buttons; the finder
  is a combobox over a listbox with `aria-activedescendant`. The sources count carries
  `aria-expanded` and an `aria-label` that says how many sources and whether it opens or closes.
- One polite live region announces what changed ("Link copied", "Answer mode: Deep research").
- Every glyph-only button has an `aria-label`. Nothing is shown only on hover.

---

## 7. What is illustrative, and must not ship as content

| In the prototype | Why it is there |
|---|---|
| The paper text in the quick view and full entry (key assertions, summaries, sections, the cited passages) for Berman et al. 2011, Mercy Corps 2015, Blattman and Annan 2016 | **Paraphrased by Matt's agent for the prototype**, labelled "Sample text" on screen. Production shows the real fields. |
| The library's entries, their tiers, "6,582 curated papers" | Mock. The count in the placeholder comes from production. |
| The chats, answers, projects, people, emails, dates and memory lines | Mock. |
| `console.html?src=<id>&reader=1` | A switch for the reference's frames only. |
| Settings, Filters, the top bar's links, the microphone | Drawn, not wired. The microphone shows listening and hears nothing. |
| The original-source addresses (`doi.org/10.0000/mock.…`, `example.org/web-source/…`) | Mock, deliberately unreal. Production has the real DOIs and URLs. |
| The tools list under an answer, its count (25), the three chats from other users | Mock. |
| Copy with citations, the votes, the wrap-up suggestion, the paperclip | Work in the page only: copy uses the clipboard, nothing is recorded or uploaded. |
| Uploads, downloads, Copy link | Stay in the page; a download is a stand-in file. |

---

## 8. Production features the prototype did not draw: Matt's verdicts (16 Oct)

| Code | In production | Verdict |
|---|---|---|
| H1.1 | "Sources in this answer · 7", grouped In the library / Web source | **Keep**, in the answer foot after every answer (section 2) |
| H1.2 | READ ON PLATFORM / OPENS OFF-PLATFORM on each source row | **Keep.** Every row opens the quick view first (the extra step is wanted: the reader sees the whole title), and the quick view shows the address the original source link goes to |
| H1.3 | "25 tools used" disclosure | **Keep, very subtle**: faint mono, folded, on the answer's foot line |
| H1.4 | Copy with citations | **Keep**, as an icon on the foot line |
| H1.5 | Thumbs up and down | **Keep**, as icons on the foot line |
| H1.6 | "Wrap up this session & share your overall take", and the survey it opens | **Keep, restyled**: *Give feedback* (`.af-fb`) in the last answer's foot opens the reflection card (`.reflect`, section 2) |
| H1.7 | Paperclip | **Keep**, in the composer's bar |
| H1.8 | Mute | **Replace** with the prototype's spoken-replies toggle |
| H1.9 | Eirene | **An answer mode**, beside Quick, Normal and Deep research; **removed from the top bar** |
| H1.10 | v1 badge | **Internal; keep, super minimal**: bare mono, no box |
| H1.11 | The tip line under the composer | **Remove** |
| H1.12 | Chats / Reports / Projects tabs | **Remove the tabs.** Reports are document artifacts inside a project |
| H1.13 | People icon (staff see every user's threads) | **Keep, staff only**: one quiet *All users* toggle on the rail's Recent line (section 2) |
| H1.14 | "Search your content ⌘K" field | **The prototype's icon**; ⌘K still opens the search |
| H1.15 | "New conversation" button | **The prototype's icon** |
| H1.16 | Moon icon, the dark theme | **Remove.** A dark theme, if ever, is its own sprint |
| H1.17 | Download PDF, View original source, View full entry | **The prototype's order and behaviour**; words from H8 |
| H1.18 | "37 sections" stat and collapse triangles | **The prototype's version** |
| H1.19 | Clarifying questions, "Question 1 of 2" (orange edge, bar and Next; all serif) | **Keep, restyled** (21 Oct): `.clarify` (section 2, `console-parts.html`) |
| H1.20 | "3 research updates", each in a warm box with an orange rule | **Keep, restyled** (21 Oct): `.ru`, written in ink, folded (section 2) |
| H1.22 | A match found by search in this chat: an outline round the message (in the prototype; production marked nothing) | **The matched words, highlighted** (22 Oct): `--hl-find`, section 4 |
| H1.23 | Rename on an artifact: the title replaced by a small text box | **In place, same face and size** (23 Oct), section 4 |
| H1.24 | Spreadsheet editing: an unlabelled grid icon, cells cut to one line, a different head, a faint grey cell | **"Edit table", the reading layout kept, the cell a field in place** (23 Oct): `.sheet-edit`, section 4 |
| H1.25 | Toolbar controls of three heights (32, 36, 39) | **One height, `--sp-8`** (23 Oct), in `components.css` |
| H1.21 | The input field's active state | **Does not match the handoff** (21 Oct). Build it from the CSS (section 2) |

---

## 9. Interface words: Matt's verdicts (16 Oct)

| Code | Production | Use |
|---|---|---|
| H8.1 | View full entry | **Read the full entry** |
| H8.2 | New conversation | **New chat** |
| H8.3 | Search your content | **Search** in the field; *Search chats and projects* as the button's label and tooltip |
| H8.4 | Ask Peace Intel about peacebuilding evidence… | **Ask Peace Intel about peacebuilding evidence…** in a new chat; **Ask about [project name]** inside a project (for now) |
| H8.5 | Download PDF | **Download PDF** |
| H8.6 | View original source | **Original source ↗** |
| H8.7 | SOURCE / FULL ENTRY (pane heads) | Same words, set in mono |

---

## 10. Reference screenshots

The target, as of Rev 55 (retaken 19 October), in `media/snapshots/console/`, taken from `console.html`. Compare your
build against these; where a screenshot and the CSS disagree, the CSS wins.

| File | State |
|---|---|
| `desk-chat.jpg` | 1440 wide: a chat with its citations, the rail and the library |
| `desk-source.jpg` | A citation opened: the quick view in the pane |
| `desk-full-entry.jpg` | The full entry: the pane widened, scrolled to the cited passage |
| `desk-search-this-chat.jpg` | Search from the chat's toolbar, on This chat |
| `desk-share.jpg` | Share for a project, with General access |
| `phone-chat.jpg` | 390 wide: the chat, the toolbar with the utility button and the sources count, the one-row composer |
| `phone-mode-menu.jpg` | The mode chip's menu |
| `phone-utility-menu.jpg` | The utility menu: Search this chat, Share, Export |
| `phone-chats-drawer.jpg` | The chats drawer, with the console's links at its foot |
| `phone-library-drawer.jpg` | The library drawer, from the right |
| `phone-source.jpg` | A paper's quick view inside the library drawer |
| `phone-full-entry.jpg` | The full entry inside the library drawer |

