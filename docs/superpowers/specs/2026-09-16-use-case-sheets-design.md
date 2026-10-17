# Peace Intel use case sheets — design spec

**Date:** 2026-09-16
**For:** Sahil Shah's outreach meetings, week of 2026-09-21
**Supersedes:** the "Use Case Landing Page" brief, in the ways noted below

---

## 1. What changed from the brief

The brief was written as a scrolling landing page. It is not one. Three of its
premises are wrong and are corrected here, because the brief will be read again.

| Brief says | Actually |
|---|---|
| A single scrollable landing page | **Two 8.5 × 11in PDFs**, printable and emailable |
| Build in React: `src/pages/UseCaseLanding.jsx`, `console.css`, `App.jsx`, register a route | Those files do not exist in this repo. This is the static prototype repo (`peaceintel-beta`). Build a self-contained `use-cases.html`, the pattern `postcard.html` already uses |
| Sticky topbar, theme toggle, light/dark | No dark theme. A PDF has one surface. No topbar, no toggle |
| "Request Access" button | No buttons in a PDF. A typeset contact line instead |

Unchanged from the brief: the content, the Resolution/Prevention division, plain
English, no screenshots, no stats band in the hero, universal audience.

## 2. The two sheets

- **Sheet 1 — Resolution:** UC1 Where to Intervene, UC2 Which Intervention to
  Choose, UC3 How to Implement It.
- **Sheet 2 — Prevention:** UC4 Measuring Your Existing Project's Peace Impact,
  UC5 Investing Early in Resilience.

Each is a standalone PDF with its own header, framing statement, and closing, so
Sahil can hand a foreign ministry the resolution sheet and a development bank the
prevention sheet without either looking like half a document.

- **Conflict Resolution:** 01 Where to Intervene, 02 Which Intervention to
  Choose, 03 How to Implement It.
- **Conflict Prevention:** 01 Measuring Your Project's Peace Impact,
  02 Investing Early in Resilience.

**Each document numbers its own cases from 01.** They are handed over
separately, so Prevention opening at 04 would imply a missing first half. The
number is derived from the case's position within its sheet rather than stored,
so it cannot drift if cases are reordered. The brief's UC1-UC5 shorthand still
refers to all five globally; only the printed numbering is per document.

## 3. Constraints

1. **Two pages per document.** Revised 2026-09-16 from one page each. The
   one-page draft only fitted at 7.6pt body text, which was too small to skim.
   Two pages buys 9.5pt and real spacing.
2. **Existing tokens only.** No new colours, no new typefaces. `--panel` means
   one thing on these pages, "what Peace Intel provides", and is used for
   nothing else.
3. **Colour output assumed.** Screen reading and colour printing. Grayscale
   survival is not a requirement.
4. **One HTML source** renders the screen page and exports both PDFs.
5. Corpus numbers stay in the UC2 and UC5 bodies as written. The brief's
   no-numbers rule is scoped to the hero only.

## 4. Page plan

Letter at 0.6in margins gives a 7.3 x 9.8in live area.

| Document | Page 1 | Page 2 |
|---|---|---|
| Conflict Resolution | framing + UC1 | UC2 + UC3 + closing |
| Conflict Prevention | framing + UC4 | UC5 + closing |

Resolution first ran framing + UC1 + UC2 on page 1, which overflowed while page
two sat at 45% full. Moving UC2 across balances them to 76% and 93%.

A page carrying a single use case has slack it cannot fill with content, so it
spends it on spacing instead: wider gutters, looser lists, more leading, driven
off `data-rows="1"` on the sheet. Spacing only, never a different type size.
The residual white space sits above the footer, where a print page normally
carries it.

**Type:** body 9.5pt/1.38 with a 0.1in gap between bullets. Leading is tight
inside a bullet and the space between bullets carries the separation, so each
bullet reads as one block rather than as loose lines. Use case titles 15pt
serif, subtitles 9.5pt italic
(DIN 2014 Italic, since Nanum Myeongjo has no italic cut), labels 8pt mono,
opening headline 30pt serif.

**Content:** bullets run 14-18 words, four per list on Resolution and five on
Prevention. Beats that repeated across neighbouring use cases were cut, since
one page puts them in adjacent columns where they read as padding. Each cut is
commented in the content model in `use-cases.html`.

## 5. Naming

The header kickers read **For Conflict Resolution** and **For Conflict
Prevention**. "Resolution" standing alone reads as a Security Council resolution
to a UN audience, and the full clause says what the document is for rather than
labelling a category. The brief's Resolution/Prevention division is unchanged.

Each sheet also carries a `short` field ("Conflict Resolution") used in the page
indicator, because "For Conflict Resolution / 1 of 2" reads badly as a running
foot.

The ledes name Peace Intel rather than floating as a caption: "Peace Intel can
help answer the three largest questions that come up once conflict is already
underway," and the two-question equivalent on Prevention.

## 6. Direction

Three directions were built and compared on 2026-09-16: A the ledger (stacked
rows, problems left, provides right), B the argument (problems as prose), C the
spread (a full-height column per use case). **A won.** The comparison is
archived verbatim in `use-cases-directions.html`, with its PDFs in
`Resources/UseCases/archive-abc/`.

## 7. Footer attribution

Each page foot carries "A project of" plus the **Effective Peacebuilding
Initiative** and **Alliance for Peacebuilding** marks at 0.31in, greyed to 72% so
they read as attribution rather than as a second lockup competing with Peace
Intel's own in the header.

The greyscale is baked into the assets in `Resources/Logos/grey/`, not applied
with `filter:grayscale()`. A CSS filter makes Chrome rasterise the image at
300ppi, which printed the AfP seal soft at quarter-inch. Pre-greyed, they embed
at full resolution (EPI 6834ppi, AfP 3060ppi). Regenerate with:

```sh
sips -s format png --matchTo "/System/Library/ColorSync/Profiles/Generic Gray Profile.icc" \
  "Resources/Logos/<source>.png" --out "Resources/Logos/grey/<name>-grey.png"
```

## 8. Editing the copy

**PDF is a fixed-layout format.** The exported file has no text boxes, nothing
reflows, and the tinted panel is a frozen rectangle that will not grow if text
inside it is edited. No amount of export tuning changes this. Acrobat's "Edit
PDF" does a best-effort reconstruction (helped by the file being tagged, which
it is) and is fine for typo-level fixes; it cannot add a line to a bullet
without the text running past the edge of the tint. Importing into Google Docs
discards the layout entirely and is not an editing path for this document.

So the copy is edited in the HTML, where the layout is live:

- **Edit on page** in the toolbar makes the sheets directly editable. Lists are
  editable as a whole, so Return adds a bullet. A live readout on each page
  shows how full it is and turns red when it overflows.
- Edits persist in that browser via `localStorage`. **Copy JSON** puts the whole
  content model on the clipboard to be baked back into `use-cases.html`;
  **Reset** restores the copy in the file.
- Then re-export. The panel resizes to its content, because in HTML it can.

The panel carries ~0.1in of deliberate slack (about half a line at 9.5pt) so a
small Acrobat edit has somewhere to go. That is capped on purpose: at 0.16in two
pages ran to 96-98% full, which removes the room to add anything at all. Slack
inside the panel and slack on the page come out of the same budget.

Page fill as built: Resolution 77% and 94%, Prevention 93% and 68%. Tightening
the leading bought back roughly two points on each of the dense pages.

## 9. Production

Chrome headless to PDF via `Resources/UseCases/export-pdf.sh`, against
`python3 -m http.server 8787`. Absolute units (in/pt) throughout,
`@page{size:letter;margin:0}`, `print-color-adjust:exact`.

Three traps found the hard way, all still live in the CSS as comments:

- **The responsive query must stay `@media screen and (max-width:980px)`.**
  Chrome lays print out at 816px, so an unqualified query matches the printed
  page and, sitting after the print block, restores `main`'s padding and pushes
  a blank page out of every sheet.
- **No CSS masks.** The header grid fade is a gradient layered over the tile,
  because masks have mis-rendered in print-to-PDF on this machine.
- **No CSS filters on images that matter.** They force rasterisation at 300ppi.

Verify every export in both poppler (`pdffonts`, `pdfinfo`, `pdfimages`,
`pdftoppm`) and CoreGraphics (`sips`, Preview), since they have disagreed
before. Last checked 2026-09-16: both agree, 2 pages each at 612x792pt, tagged,
every face embedded, logos embedded at full resolution.

Closing block, set over two lines with a deliberate `<br>`:

> Peace Intel launches publicly at PeaceCon, January 2027.
> Join us as a beta tester and get early access.

followed by `peaceintel.org`. The `<br>` is real copy, so `clean()` in the edit
harvester preserves it rather than flattening it to a space.

Sahil's personal address was removed from the documents on 2026-09-16; these go
to ministries and multilaterals, and the URL is the durable contact.

**Open:** the closing now makes a specific ask ("join us as a beta tester") but
points at the homepage. `beta.html` in this repo is the beta recruitment page.
If it deploys before the 21st, the URL should probably land there instead.

## 10. Out of scope


Dark theme, the scrolling landing page, a React port, QR codes, roadmap or
feature content, screenshots.
