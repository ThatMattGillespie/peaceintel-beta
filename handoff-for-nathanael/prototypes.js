/* ============================================================================
   PEACE INTEL · PROTOTYPES FOR THE BRAND REFERENCE
   ----------------------------------------------------------------------------
   Working mocks, for brand-guide.html and console.html. NOT part of the system:
   system.js is the runtime pages load, and nothing in this file is for
   production. It exists so Matt can click through an idea before anyone
   builds it. Two of them:

     THE CONSOLE (Pl. 08)   chats and projects, wired: a project's context,
                            instructions, memory, artifacts and sharing.
                            Nathanael builds the real console in React; this
                            is the behaviour to aim at, not code to port.
     THE NUMBERED DOCUMENT  the contents strip that follows the reader, used
     (Pl. 20)               by the specimen page and a document's own page.

   Both draw only parts that exist: the console in components.css and the
   projects and numbered-document explorations in explorations.css.
   The console's markup in brand-guide.html is the same console as a
   still, which is what shows with script off; this redraws it on load.

   State lives in memory and resets on reload, and nothing leaves the
   browser: an upload stays in the page, an invitation sends nothing.
   Downloads are real files made from the artifact: Markdown, Word (HTML saved
   as .doc, which Word opens) and a plain PDF in the standard Times and
   Helvetica for a written document; CSV and Excel for a spreadsheet. The
   branded templates are product work.
   ============================================================================ */
(function () {
  'use strict';

  /* ── THE NUMBERED DOCUMENT ────────────────────────────────────────────────
     A contents strip inside a scrolling box marks the section whose top has
     passed under it, and its links scroll the box rather than the page. */
  function numbered(scroller) {
    var toc = scroller.querySelector('.st-toc');
    if (!toc) return;
    var links = [].slice.call(toc.querySelectorAll('a'));
    var secs = links.map(function (a) { return scroller.querySelector(a.getAttribute('href')); });
    function mark() {
      var line = toc.getBoundingClientRect().bottom + 48, on = 0;
      secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= line) on = i; });
      if (scroller.scrollTop > 0 && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) on = secs.length - 1;
      links.forEach(function (a, i) {
        var cur = i === on;
        if (a.getAttribute('aria-current') !== String(cur)) {
          a.setAttribute('aria-current', String(cur));
          if (cur && toc.scrollWidth > toc.clientWidth) toc.scrollLeft = a.offsetLeft - toc.clientWidth / 3;
        }
      });
    }
    var queued = false;
    scroller.addEventListener('scroll', function () {
      if (queued) return; queued = true;
      requestAnimationFrame(function () { queued = false; mark(); });
    }, { passive: true });
    toc.addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      e.preventDefault();
      var sec = scroller.querySelector(a.getAttribute('href')); if (!sec) return;
      scroller.scrollTop += sec.getBoundingClientRect().top - toc.getBoundingClientRect().bottom - 8;
    });
    mark();
  }
  [].forEach.call(document.querySelectorAll('[data-numbered]'), numbered);

  /* ── THE CONSOLE ─────────────────────────────────────────────────────────── */
  var app = document.getElementById('console');
  if (!app) return;
  var rail = app.querySelector('.app-rail'), main = app.querySelector('.app-main'), pane = app.querySelector('.app-pane');

  var G = {
    'book-open': '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'download': '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
    'file': '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/>',
    'file-plus': '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M9 15h6"/><path d="M12 18v-6"/>',
    'files': '<path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/>',
    'file-spreadsheet':'<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/>',
    'file-text': '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    'file-type-2': '<path d="M12 22h6a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v6"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M3 16v-1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5V16"/><path d="M6 22h2"/><path d="M7 14v8"/>',
    'folder': '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    'folder-open': '<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>',
    'ellipsis': '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    'arrow-left': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    'copy': '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    'thumbs-up': '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
    'thumbs-down': '<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>',
    'paperclip': '<path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"/>',
    'corner-down-right': '<path d="m15 10 5 5-5 5"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/>',
    'globe': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    'history': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
    'link':'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    'list-filter': '<path d="M2 5h20"/><path d="M6 12h12"/><path d="M9 19h6"/>',
    'square-pen': '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>',
    'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    'maximize-2': '<path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/>',
    'mic': '<path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/>',
    'minimize-2': '<path d="m14 10 7-7"/><path d="M20 10h-6V4"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/>',
    /* The two sides fold and come back with one pair of glyphs, mirrored
       (Matt, 2026-10-15): close points the way the side goes, open the way
       it comes back. */
    'panel-left-close': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>',
    'panel-left-open': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>',
    'panel-right-open': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m10 15-3-3 3-3"/>',
    'panel-right-close': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/>',
    'pencil': '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    'play': '<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>',
    'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
    'scroll-text': '<path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>',
    'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'sticky-note': '<path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/>',
    'upload': '<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
    'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'menu': '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    'settings':'<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
    'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
    'volume-2': '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>'
  };
  function g(name) { return '<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true">' + (G[name] || '') + '</svg>'; }
  var MARK = '<svg class="ph-mark" viewBox="0 0 11 10" aria-hidden="true"><path d="M1 0h2v1h-2zM1 1h2v1h-2zM6 1h1v1h-1zM1 2h2v1h-2zM4 2h1v1h-1zM6 2h1v1h-1zM8 2h1v1h-1zM1 3h2v1h-2zM4 3h1v1h-1zM6 3h1v1h-1zM8 3h1v1h-1zM1 4h2v1h-2zM4 4h1v1h-1zM6 4h1v1h-1zM8 4h2v1h-2zM1 5h2v1h-2zM4 5h1v1h-1zM6 5h1v1h-1zM9 5h1v1h-1zM1 6h2v1h-2zM4 6h1v1h-1zM6 6h1v1h-1zM9 6h1v1h-1zM1 7h2v1h-2zM4 7h1v1h-1zM6 7h1v1h-1zM9 7h2v1h-2zM0 9h11v1h-11z"/></svg>';
  /* The rail's mark (2026-10-15), the library's partner: a speech bubble
     drawn the same way, 11 x 10 cells, solid, so the two sides of the
     console are headed alike. */
  var CHATMARK = '<svg class="ph-mark" viewBox="0 0 11 10" aria-hidden="true"><path d="M1 0h9v1h-9zM0 1h1v5h-1zM10 1h1v5h-1zM1 6h9v1h-9zM2 2h7v1h-7zM2 4h5v1h-5zM2 7h2v1h-2zM2 8h1v1h-1z"/></svg>';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function nn(i) { return ('0' + i).slice(-2); }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }

  /* The library. Real papers, so the titles behave like real ones; the tier
     each carries is the mock's, not a grading. */
  var TM = { 1: '&#9679;', 2: '&#9680;', 3: '&#8599;' };
  var LIB = {
    sa:       { t: 'Peacekeeping in South Africa: ANC and IFP, 1990 to 1996', a: '', y: 0, k: 'Case study', tier: 1, m: 'Strong evidence' },
    equip:    { t: 'Equipped for Peace: Conflict Resolution Training and Youth Violence', a: 'Olawole, Ribar, Sheely et al.', y: 2026, k: 'Empirical study', tier: 1 },
    standards:{ t: 'Guiding Standards for Peacebuilding Design, Monitoring and Evaluation', a: 'Hume, Sample', y: 2025, k: 'Policy report', tier: 2 },
    pbf:      { t: 'Secretary-General’s Peacebuilding Fund: Synthesis Review of 2023 to 2024 Evaluations', a: 'Ernstorfer', y: 2026, k: 'Evaluation report', tier: 1 },
    guat:     { t: 'Mediation in the Guatemalan Civil War, 1970 to 1988', a: '', y: 0, k: 'Web', tier: 3, m: 'Treat with caution' },
    fortna:   { t: 'Does Peacekeeping Keep Peace? International Intervention and the Duration of Peace after Civil War', a: 'Fortna', y: 2004, k: 'Empirical study', tier: 1 },
    dpd:      { t: 'Dimensions of Peace Dataset: Conflict-Years, 2000 to 2020', a: '', y: 0, k: 'Dataset', tier: 2, m: 'Moderate evidence' },
    hultman:  { t: 'Beyond Keeping Peace: United Nations Effectiveness in the Midst of Fighting', a: 'Hultman, Kathman, Shannon', y: 2014, k: 'Empirical study', tier: 1 },
    doyle:    { t: 'International Peacebuilding: A Theoretical and Quantitative Analysis', a: 'Doyle, Sambanis', y: 2000, k: 'Empirical study', tier: 1 },
    walter:   { t: 'Does Conflict Beget Conflict? Explaining Recurring Civil War', a: 'Walter', y: 2004, k: 'Empirical study', tier: 2 },
    blattman: { t: 'Can Employment Reduce Lawlessness and Rebellion? A Field Experiment with High-Risk Men in a Fragile State', a: 'Blattman, Annan', y: 2016, k: 'Empirical study', tier: 1 },
    berman:   { t: 'Do Working Men Rebel? Insurgency and Unemployment in Afghanistan, Iraq, and the Philippines', a: 'Berman, Callen, Felter, Shapiro', y: 2011, k: 'Empirical study', tier: 1 },
    mercy:    { t: 'Youth and Consequences: Unemployment, Injustice and Violence', a: 'Mercy Corps', y: 2015, k: 'Policy report', tier: 2 },
    elfv:     { t: 'Central Politics and Local Peacemaking: The Conditions for Peace after Communal Conflict', a: 'Elfversson', y: 2017, k: 'Dissertation', tier: 1 },
    undp:     { t: 'Journey to Extremism in Africa: Pathways to Recruitment and Disengagement', a: 'UNDP', y: 2023, k: 'Web', tier: 3, m: 'Treat with caution' },
    icg:      { t: 'Speaking with the “Bad Guys”: Toward Dialogue with Central Mali’s Jihadists', a: 'International Crisis Group', y: 2019, k: 'Web', tier: 3, m: 'Treat with caution' },
    hrw:      { t: 'Ballots to Bullets: Organized Political Violence and Kenya’s Crisis of Governance', a: 'Human Rights Watch', y: 2008, k: 'Web', tier: 3, m: 'Treat with caution' },
    waki:     { t: 'Report of the Commission of Inquiry into Post-Election Violence', a: 'CIPEV', y: 2008, k: 'Policy report', tier: 2 }
  };
  /* WHAT A PAPER OPENS TO (Pl. 22, Matt 16 Oct, from the production
     console's two screens). The quick view: what it is, its tier, its key
     assertions, its details and a summary. The full entry: the paper as the
     library holds it, section by section, the passages this chat cites marked.
     The text below is a paraphrase written for the prototype, three papers
     deep; the others open with what the library row knows. */
  var SRC = {
    berman: {
      as: ['Higher unemployment did not go with more insurgent violence in any of the three countries.', 'In Iraq and the Philippines the relationship ran the other way: attacks on government and allied forces fell where unemployment was higher.', 'The result cuts against programmes premised on jobs as the way to draw men away from insurgency.'],
      tags: ['Afghanistan', 'Iraq', 'Philippines', 'quantitative', 'livelihoods', 'insurgency'],
      sum: 'Tests the opportunity-cost idea, that men with work have less reason to rebel, against district-level data on unemployment and violence in three insurgencies. Finds no support for it, and suggests governments and their allies get less information from the population where unemployment is lower.',
      pages: 31,
      secs: [
        { h: 'Introduction', ps: ['Development programmes in conflict zones are often justified by a simple argument: employed men have more to lose from fighting, so jobs reduce rebellion. This paper asks whether the data support it.'] },
        { h: 'Theory', ps: ['Opportunity-cost models predict that violence falls as wages and employment rise. Information-sharing models predict that a population trades information with whichever side serves it better, which need not depend on work at all.'] },
        { h: 'Data', ps: ['District-level unemployment from labour surveys is matched to records of attacks on government and allied forces and on civilians, across Afghanistan, Iraq and the Philippines.'] },
        { h: 'Results', ps: [{ c: 1, t: 'We find no positive relationship between unemployment and insurgent violence. Where a relationship exists it is negative: in Iraq and the Philippines, districts with higher unemployment saw fewer attacks against government and allied forces.' }, 'The relationship with civilian deaths is weak in every specification.'] },
        { h: 'Discussion', ps: ['The findings fit an information-sharing account better than an opportunity-cost one, and caution against expecting employment programmes on their own to reduce violence.'] }
      ]
    },
    mercy: {
      as: ['Unemployment was not the main reason young people gave for joining armed groups.', 'Experiences of injustice, discrimination, corruption and abuse by security forces were stronger drivers.', 'Programmes that pair economic support with governance and justice are more likely to reduce support for violence.'],
      tags: ['Afghanistan', 'Colombia', 'Somalia', 'survey', 'youth', 'governance'],
      sum: 'Draws on interviews and surveys with young people in three countries to ask why some take part in political violence. Finds that grievances about how they are treated by those in power matter more than whether they have work.',
      abstractOnly: true,
      secs: [{ h: 'Abstract', ps: [{ c: 2, t: 'The research found that the principal drivers of political violence are rooted not in poverty, but in experiences of injustice: being discriminated against, humiliated, or abused by corrupt officials and security forces.' }] }]
    },
    blattman: {
      as: ['Agricultural training and capital raised farming and incomes among high-risk men in Liberia.', 'The men worked less in illicit activities, though most did not leave them entirely.', 'Interest in mercenary work in a neighbouring war fell, and the promise of a future cash transfer mattered as much as income already earned.'],
      tags: ['Liberia', 'field experiment', 'ex-combatants', 'livelihoods', 'randomised'],
      sum: 'A randomised evaluation of an agricultural programme for about a thousand high-risk men, many of them ex-combatants. Employment reduced illicit work and interest in mercenary recruitment modestly, most where it changed what the men expected to earn next.',
      pages: 48,
      secs: [
        { h: 'Introduction', ps: ['Can employment reduce the supply of men to lawless and violent work? We study a programme that offered agricultural training, tools and inputs to high-risk men in post-war Liberia.'] },
        { h: 'The programme and design', ps: ['Eligible men were assigned to the programme or a control group by lottery and followed for about fourteen months.'] },
        { h: 'Results', ps: [{ c: 3, t: 'Treated men shifted their work toward agriculture and away from illicit activities, and were less likely to express interest in mercenary work during the crisis in neighbouring Côte d’Ivoire.' }, 'Effects on illicit work were modest; few left it altogether.'] },
        { h: 'Conclusion', ps: ['Expected future earnings appear to matter as much as current income, which suggests timing payments to keep men invested in legal work.'] }
      ]
    }
  };
  var TIER = { 1: ['In the library', 'full text on the platform'], 2: ['Abstract only', 'the full text is not held'], 3: ['Web source', 'outside the library, verify'] };
  var LIB_ALL = ['fortna', 'sa', 'dpd', 'equip', 'pbf', 'hultman', 'doyle', 'walter', 'elfv', 'guat'];

  var PEOPLE = { MA: 'You', AD: 'Amara Diallo', JO: 'Joseph Okafor', WK: 'Wanjiru Kamau' };
  /* A project: what it is for, its instructions, its CONTEXT (what its
     chats draw on beside the library: files people upload, notes typed in,
     papers picked from the library), its MEMORY (what Peace Intel has kept
     from its chats) and the people it is shared with. What it produces, its
     ARTIFACTS, are in DOCS below. */
  function paper(ref, by, d) { return { id: 'k-' + ref, type: 'paper', ref: ref, by: by, d: d }; }
  var PROJECTS = [
    { id: 'sahel', name: 'Sahel portfolio review',
      ctx: [{ id: 'u1', type: 'file', name: 'Programme summaries, five grantees.pdf', ext: 'PDF', size: '2.4 MB', by: 'AD', d: 'Oct 8' },
            { id: 'u2', type: 'file', name: 'Results framework 2026.xlsx', ext: 'XLSX', size: '310 KB', by: 'MA', d: 'Oct 6' },
            { id: 'n1', type: 'text', name: 'What the board asked for', text: 'Which of the five programmes to renew in March, and on what evidence. One page per programme, with a recommendation the committee can vote on.', by: 'MA', d: 'Oct 6' },
            paper('blattman', 'MA', 'Oct 6'), paper('berman', 'MA', 'Oct 6'), paper('mercy', 'AD', 'Oct 7'), paper('equip', 'AD', 'Oct 7'), paper('pbf', 'MA', 'Oct 6'), paper('standards', 'MA', 'Oct 6')],
      mem: [{ id: 'm1', t: 'Who the work is for', s: 'The programme committee, ahead of the board meeting in March.', d: 'Oct 12' },
            { id: 'm2', t: 'The five programmes', s: 'A and C reach young people already approached by armed groups. B measures jobs created. D and E are cash for work.', d: 'Oct 13' },
            { id: 'm3', t: 'The record for programme details', s: 'Amara’s grantee summaries. Ask before contradicting them.', d: 'Oct 8' }],
      memAll: false,
      members: [{ i: 'MA', name: 'You', role: 'Owner' }, { i: 'AD', name: 'Amara Diallo', email: 'amara.diallo@example.org', role: 'Can edit' }, { i: 'JO', name: 'Joseph Okafor', email: 'j.okafor@example.org', role: 'Can view' }],
      purpose: 'Five livelihood programmes, appraised against the evidence before the March board.',
      instr: 'Write for a programme committee. Lead with effect sizes, and flag any study older than 2015.' },
    { id: 'rotary', name: 'Rotary global grant',
      ctx: [paper('standards', 'MA', 'Sep 17'), paper('pbf', 'MA', 'Sep 17'), paper('equip', 'MA', 'Sep 17'), paper('sa', 'MA', 'Sep 17')],
      mem: [{ id: 'm4', t: 'The club', s: 'A Rotary club applying for a global grant for water access. Its members are not specialists.', d: 'Sep 18' }],
      memAll: true,
      members: [{ i: 'MA', name: 'You', role: 'Owner' }],
      purpose: 'The evidence case for a water-access grant in a post-conflict district.',
      instr: 'Plain language for club members. Keep each answer under 300 words.' },
    { id: 'kenya', name: 'Election violence, Kenya',
      ctx: [{ id: 'u3', type: 'file', name: 'County hotspot list.csv', ext: 'CSV', size: '18 KB', by: 'WK', d: 'Oct 2' },
            paper('waki', 'WK', 'Oct 2'), paper('elfv', 'WK', 'Oct 2'), paper('standards', 'MA', 'Oct 2'), paper('walter', 'MA', 'Oct 2')],
      mem: [{ id: 'm5', t: 'The programme', s: 'A prevention programme for the 2027 election, where cost matters as much as effect.', d: 'Oct 3' }],
      memAll: false,
      members: [{ i: 'MA', name: 'You', role: 'Owner' }, { i: 'WK', name: 'Wanjiru Kamau', email: 'w.kamau@example.org', role: 'Can edit' }],
      purpose: 'What reduces violence around elections, for a 2027 prevention programme.',
      instr: 'Compare interventions by cost where the evidence allows.' }
  ];

  /* A chat: a title, a date, the project it lives in (or none), and its
     messages. An answer is an intro and numbered parts, which is also how a
     document is made from it. {id} in the copy is a citation of LIB[id]. */
  var CHATS = {
    recruit: { t: 'Do livelihood programmes reduce recruitment?', d: 'Today', p: 'sahel', msgs: [
      { u: 'Do livelihood programmes reduce recruitment into armed groups? Lead with effect sizes.', at: '10:12 AM' },
      { at: '10:13 AM', a: {
        intro: ['Not on their own. Across the strongest studies, income alone has a small effect or none on whether young men join armed groups. Programmes do better when they reach the people armed groups are already approaching.'],
        parts: [
          { h: '1. Unemployment is a weak predictor of violence', ps: [
            'Berman and colleagues found no positive relationship between unemployment and insurgent violence in Afghanistan, Iraq or the Philippines; where there was a relationship it ran the other way {berman}. The study is from 2011, older than this project’s 2015 line.',
            'Mercy Corps’ interviews with young people reached a similar conclusion: experiences of injustice, discrimination and corruption explained participation in violence better than joblessness did {mercy}. UNDP’s interviews with former recruits across the Sahel, a web source outside the library, give a more mixed picture, with employment named more often than in earlier rounds {undp}.'] },
          { h: '2. Where livelihood support has moved behaviour', ps: [
            'The strongest test is a randomised trial with high-risk young men in Liberia. Agricultural training and capital shifted men into farming and away from illegal mining, and reduced their interest in mercenary work during the 2011 Ivorian crisis; much of that effect came from the promise of future payments rather than income already earned {blattman}.'] },
          { h: '3. What it means for the portfolio', ps: [
            'Weight the programmes that target young people already approached by armed groups and that pair income with a stake in local decisions. Treat claims of reduced recruitment as unproven where a programme measures jobs created rather than recruitment itself.'] }
        ] } }
    ] },
    mali: { t: 'Farmer–herder mediation in Mali', d: 'Oct 12', p: 'sahel', by: 'AD', msgs: [
      { u: 'What does the evidence say about farmer–herder mediation in central Mali?', at: '4:02 PM' },
      { at: '4:03 PM', a: { intro: [
        'Thinner than the practice. Most of what exists is programme evaluation rather than trials, and it favours standing local institutions, such as committees that include both farmers and herders, over one-off dialogues. Crisis Group’s field reporting from central Mali, outside the library, describes the same committees under strain {icg}.',
        'Treat the record as promising rather than proven, and fund measurement alongside the mediation: the design and evaluation standards in this project ask for conflict outcomes to be measured, not only activities {standards}.'] } }
    ] },
    board: { t: 'Board briefing, first draft', d: 'Oct 9', p: 'sahel', msgs: [
      { u: 'Draft a one-page briefing for the board on the five programmes.', at: '9:40 AM' },
      { at: '9:41 AM', a: {
        intro: ['A first draft, written for the programme committee.'],
        parts: [
          { h: '1. The question', ps: ['Whether the five livelihood programmes in the Sahel portfolio reduce recruitment into armed groups, as three of their proposals claim.'] },
          { h: '2. What the evidence supports', ps: ['Income alone rarely moves recruitment {berman} {mercy}. Support that reaches young people already approached by armed groups, and pairs income with a stake in local decisions, has the strongest record {blattman}.'] },
          { h: '3. What we recommend', ps: ['Keep the two programmes that target the right people and measure recruitment. Ask the other three to add a recruitment measure before renewal, and fund them for income in the meantime.'] }
        ] } }
    ] },
    water: { t: 'My Rotary club is working on water access in a post-conflict district', d: 'Sep 17', p: 'rotary', msgs: [
      { u: 'My Rotary club is working on water access in a post-conflict district. How do we make sure it helps the peace?', at: '7:15 PM' },
      { at: '7:16 PM', a: { intro: [
        'Design it for the peace as well as for the water. Water projects tend to help when the groups that fought share the running of them, and to hurt when one group controls access.',
        'The evidence is mostly case studies and programme evaluations rather than trials, so treat it as good practice rather than proof {standards}. Two design choices recur: joint management committees, and support that continues after construction ends.'] } }
    ] },
    centers: { t: 'What do you know about Rotary Peace Centers?', d: 'Sep 3', p: 'rotary', msgs: [
      { u: 'What do you know about Rotary Peace Centers?', at: '11:20 AM' },
      { at: '11:20 AM', a: { intro: [
        'Rotary Peace Centers offer fully funded fellowships for people working in peace and development: a master’s degree at a partner university, or a shorter professional certificate.',
        'The library holds the centres’ own publications rather than independent evaluations of them, so treat claims about their impact as moderate evidence at best.'] } }
    ] },
    kenya2: { t: 'Do peace messaging campaigns reduce election violence?', d: 'Oct 3', p: 'kenya', msgs: [
      { u: 'Do peace messaging campaigns reduce election violence?', at: '2:05 PM' },
      { at: '2:06 PM', a: { intro: [
        'The evidence is thin. Campaigns are common and cheap, but few have been evaluated against violence itself rather than attitudes, and a change in attitudes does not reliably change behaviour.',
        'Weight activities that also change incentives, such as monitoring and early warning with credible consequences, and fund an evaluation if you include a campaign {standards}.'] } }
    ] },
    kenya1: { t: 'What happened in Kenya’s 2007 to 2008 post-election violence?', d: 'Oct 2', p: 'kenya', by: 'WK', msgs: [
      { u: 'What happened in Kenya’s 2007 to 2008 post-election violence?', at: '5:30 PM' },
      { at: '5:31 PM', a: { intro: [
        'After the disputed December 2007 election, violence killed more than 1,100 people and displaced several hundred thousand.',
        'It ended with a power-sharing agreement in February 2008, mediated by a panel led by Kofi Annan. The commission of inquiry that followed, known by its chair as the Waki commission, is the standard account {waki}; Human Rights Watch’s field report, a web source, documents how much of the violence was organised {hrw}.'] } }
    ] },
    legit: { t: 'Tell me about governmental legitimacy after civil war', d: 'Sep 3', p: null, msgs: [
      { u: 'Tell me about governmental legitimacy after civil war', at: '3:44 PM' },
      { at: '3:45 PM', a: { intro: [
        'Legitimacy after a war is earned mostly by what a government delivers and how fairly, more than by how it came to power.',
        'Doyle and Sambanis found that peace after civil war depends on the depth of hostility, local capacity and the international help available, and that multidimensional UN operations improved the odds {doyle}. Walter’s work on recurrence points the same way: wars restart where people see no better option than fighting {walter}.'] } }
    ] },
    proof: { t: 'What’s the best proof we have that peace is possible with better evidence?', d: 'Aug 26', p: null, msgs: [
      { u: 'What’s the best proof we have that peace is actually possible with better evidence?', at: '2:46 PM' },
      { at: '2:47 PM', a: {
        intro: ['The strongest proof is a convergence across three very different kinds of evidence, each with different weaknesses, that all point the same way.'],
        parts: [
          { h: '1. The large-N statistical evidence: peacekeeping extends peace after civil war', ps: [
            'Page Fortna’s 2004 study in <i>International Studies Quarterly</i> examined every civil war since 1944 and found that peace lasts significantly longer when peacekeepers are present than when they are absent, even after controlling for how hard the peace was to keep {fortna}. The finding has been replicated and extended in the two decades since.',
            'The <abbr title="Dimensions of Peace Dataset">DPD</abbr> conflict-year data corroborates the pattern from another angle. Across active conflict-years from 2000 to 2020, years with peacekeeping personnel present averaged <strong>584 fatalities</strong>, against <strong>1,893</strong> in years without {dpd}. This is descriptive rather than causal: peacekeepers are deployed selectively, often to harder cases.'] },
          { h: '2. The experimental evidence: a cluster RCT showing peacebuilding training reduces violence', ps: [
            'The most rigorous single piece of evidence in the library is a 2026 cluster randomised controlled trial in Niger {equip}.'] },
          { h: '3. The case evidence: settlements that held under strain', ps: [
            'Case studies show the mechanism the statistics cannot. South Africa’s transition between 1990 and 1996 held through severe violence between the ANC and the IFP, and shows how monitoring and the local peace committees set up under the 1991 National Peace Accord kept it from derailing the settlement {sa}.'] }
        ] } }
    ] },
    mediation: { t: 'What can historic evidence tell us about mediation?', d: 'Aug 26', p: null, msgs: [
      { u: 'What can historic evidence tell us about mediation?', at: '1:10 PM' },
      { at: '1:11 PM', a: { intro: [
        'Mediation is associated with more agreements, but agreements pushed through by heavy outside pressure tend not to last.',
        'The more a mediator relies on leverage rather than facilitation, the sooner the agreement tends to break down. The library’s case material on Guatemala comes from the web, so treat it with caution {guat}.'] } }
    ] },
    corpus: { t: 'Hello agent, what can you tell me about the corpus?', d: 'Aug 26', p: null, msgs: [
      { u: 'Hello agent, what can you tell me about the corpus?', at: '12:02 PM' },
      { at: '12:02 PM', a: { intro: [
        'The library holds 6,582 curated papers: peer-reviewed studies, evaluations, case studies and policy reports on peacebuilding, each graded by the strength of its evidence.',
        'A citation shows the grade. A solid mark is strong evidence {fortna}, a hollow mark moderate {dpd}, and a dashed source comes from the web and should be treated with caution {guat}.'] } }
    ] },
    passages: { t: 'Do you have the ability to link to specific passages?', d: 'Jul 13', p: null, msgs: [
      { u: 'Do you have the ability to link to specific passages?', at: '8:55 AM' },
      { at: '8:55 AM', a: { intro: [
        'Yes. Each citation opens its source in the library pane at the passage the answer draws on, highlighted, so you can read the sentence in context before you rely on it {fortna}.'] } }
    ] }
  };
  /* H1.13: staff see every user's chats. Three from other organisations, for
     the admin view only (mock). */
  CHATS.x1 = { t: 'Which DDR programmes reduced re-recruitment in the Great Lakes?', d: 'Oct 15', by: 'JO', other: true, msgs: [{ u: 'Which DDR programmes reduced re-recruitment in the Great Lakes?', at: '2:10 PM' }, { at: '2:11 PM', a: { intro: ['A mock answer from another user, shown only in the admin view.'] } }] };
  CHATS.x2 = { t: 'Early warning indicators for election violence', d: 'Oct 14', by: 'WK', other: true, msgs: [{ u: 'Early warning indicators for election violence', at: '9:02 AM' }, { at: '9:03 AM', a: { intro: ['A mock answer from another user, shown only in the admin view.'] } }] };
  CHATS.x3 = { t: 'Evidence on women mediators in local peace processes', d: 'Oct 12', by: 'AD', other: true, msgs: [{ u: 'Evidence on women mediators in local peace processes', at: '11:40 AM' }, { at: '11:41 AM', a: { intro: ['A mock answer from another user, shown only in the admin view.'] } }] };
  var OTHERS = ['x1', 'x2', 'x3'];
  var ORDER = ['recruit', 'mali', 'board', 'water', 'centers', 'kenya2', 'kenya1', 'legit', 'proof', 'mediation', 'corpus', 'passages'];

  /* WHAT A PROJECT PRODUCES: its ARTIFACTS, made in its chats. One registry
     of kinds: each has an icon, a name (which the object mark's legend
     shows), its own page and its own download formats. A new kind, slides say, is one
     more line here. */
  var KINDS = {
    doc:   { name: 'Document',    glyph: 'file-text',        formats: ['pdf', 'doc', 'md'] },
    sheet: { name: 'Spreadsheet', glyph: 'file-spreadsheet', formats: ['xls', 'csv'] },
    pdf:   { name: 'PDF',         glyph: 'file-type-2',      formats: ['pdf'] }
  };
  var FMT = { pdf: ['PDF', '.pdf'], doc: ['Word', '.doc'], md: ['Markdown', '.md'], xls: ['Excel', '.xls'], csv: ['CSV', '.csv'] };

  var APPRAISAL = [
    { h: 'Summary', ps: ['Of the five livelihood programmes, two rest on strong evidence for their stated aim and one on moderate evidence. Two claim an effect on recruitment that no study in this project supports.'] },
    { h: 'What the evidence supports', ps: [
      'Income alone rarely moves recruitment into armed groups {berman} {mercy}. Support that reaches young people already approached by armed groups, and pairs income with a stake in local decisions, has the strongest record {blattman}.',
      'Conflict-resolution training has the most rigorous recent evidence in the region, from a 2026 cluster trial in Niger {equip}.'] },
    { h: 'The five programmes', ps: [
      'Programmes A and C target the right people and measure the right outcome. Programme B measures jobs created, and would need a recruitment measure to support its claim.',
      'Programmes D and E are cash-for-work schemes with no violence outcome. Fund them for income, which they deliver, and not for peace, which they do not measure.'] },
    { h: 'Gaps worth funding', ps: ['No study in this project follows participants for more than three years, and none covers women recruited into armed groups. Either would be a contribution to the field as well as to the portfolio.'] }
  ];
  var DOCS = [
    { id: 'd2', p: 'sahel', kind: 'doc', name: 'Livelihoods and recruitment: evidence brief', d: 'Today', by: 'MA', from: 'recruit' },
    { id: 'd4', p: 'sahel', kind: 'sheet', name: 'Programme comparison', d: 'Oct 13', by: 'AD', from: 'board', sheet: {
      cols: ['Programme', 'Who it reaches', 'What it measures', 'Evidence', 'Recommendation'],
      rows: [
        ['A', 'Young men already approached by armed groups', 'Recruitment', 'Strong', 'Keep'],
        ['B', 'Unemployed young people', 'Jobs created', 'Moderate', 'Add a recruitment measure'],
        ['C', 'Returnees and their families', 'Recruitment and local trust', 'Strong', 'Keep'],
        ['D', 'Households, cash for work', 'Income', 'None on violence', 'Fund for income'],
        ['E', 'Women’s savings groups', 'Income', 'None on violence', 'Fund for income']] } },
    { id: 'd1', p: 'sahel', kind: 'doc', name: 'Portfolio appraisal, draft 2', d: 'Oct 12', by: 'MA', from: 'board', secs: APPRAISAL },
    { id: 'd5', p: 'sahel', kind: 'pdf', name: 'Board pack, March', d: 'Oct 13', by: 'AD', pages: 12, size: '1.8 MB', secs: APPRAISAL },
    { id: 'd3', p: 'rotary', kind: 'doc', name: 'Grant rationale, first draft', d: 'Sep 18', by: 'MA', from: 'water', secs: [
      { h: 'The need', ps: ['The district’s water points were damaged in the fighting, and the communities that share them were on different sides of it.'] },
      { h: 'What the evidence says', ps: ['Water projects can support peace when they are designed for it: shared management by groups that were on opposing sides, and access that no single group controls. Without that design a new water point becomes one more thing to contest {standards}.'] },
      { h: 'How the project is designed for it', ps: ['Each water point will be run by a committee with members from both communities, and the grant funds a year of support for those committees after construction ends.'] }] },
    { id: 'd6', p: 'kenya', kind: 'sheet', name: 'Prevention options, by cost', d: 'Oct 3', by: 'WK', from: 'kenya2', sheet: {
      cols: ['Activity', 'Evidence on violence', 'Relative cost', 'Note'],
      rows: [
        ['Early warning with a response plan', 'Moderate', 'Medium', 'Only as good as the response it triggers'],
        ['Election monitoring', 'Moderate', 'Medium', 'Strongest where results are contested'],
        ['Peace messaging campaigns', 'Weak', 'Low', 'Evaluate against violence, not attitudes'],
        ['Local peace committees', 'Moderate', 'Low', 'Needs support between elections']] } }
  ];

  var S = { view: 'chat', chat: 'recruit', project: 'sahel', doc: null, tab: 'chats', sort: 'tier', q: '', browse: false, mode: 'normal', spoken: false, dictate: false, rail: 'on', pane: 'on', drawer: null, access: {}, src: null, reader: false, admin: true, scope: 'mine', attach: [], vote: {}, reflect: {}, fold: {} };
  var seq = 10;

  function proj(id) { return PROJECTS.filter(function (p) { return p.id === id; })[0]; }
  function docById(id) { return DOCS.filter(function (r) { return r.id === id; })[0]; }
  function chatsOf(pid) { return ORDER.filter(function (id) { return CHATS[id].p === pid; }); }
  function docsOf(pid) { return DOCS.filter(function (r) { return r.p === pid; }); }
  function current() {
    if (S.view === 'project') return proj(S.project);
    if (S.view === 'doc') return proj(docById(S.doc).p);
    var c = S.chat && CHATS[S.chat];
    return c && c.p ? proj(c.p) : null;
  }
  function papersOf(p) { return p.ctx.filter(function (x) { return x.type === 'paper'; }).map(function (x) { return x.ref; }); }
  function ctxName(x) { return x.type === 'paper' ? LIB[x.ref].t : x.name; }
  function ctxSummary(p) {
    var n = { file: 0, text: 0, paper: 0 };
    p.ctx.forEach(function (x) { n[x.type]++; });
    var parts = [];
    if (n.file) parts.push(plural(n.file, 'file'));
    if (n.text) parts.push(plural(n.text, 'note'));
    if (n.paper) parts.push(plural(n.paper, 'paper'));
    return parts.join(' · ');
  }
  /* What the project holds against what it may hold. The papers are the
     library's and cost nothing; a note is a few kilobytes. */
  function capacity(p) {
    var mb = 0;
    p.ctx.forEach(function (x) { if (x.size) mb += parseFloat(x.size) / (/KB/.test(x.size) ? 1000 : 1); else if (x.type === 'text') mb += .01; });
    return Math.min(100, Math.max(p.ctx.length ? 1 : 0, Math.round(mb / 50 * 100)));
  }
  /* The papers a chat cites, in the order it first cites them. */
  function citedIn(c) {
    var out = [];
    (c ? c.msgs : []).forEach(function (m) {
      if (!m.a) return;
      var ps = (m.a.intro || []).slice();
      (m.a.parts || []).forEach(function (x) { ps = ps.concat(x.ps); });
      ps.join(' ').replace(/\{(\w+)\}/g, function (_, id) { if (LIB[id] && out.indexOf(id) < 0) out.push(id); });
    });
    return out;
  }
  function count(r) {
    return r.kind === 'sheet' ? plural(r.sheet.rows.length, 'row') : r.kind === 'pdf' ? plural(r.pages, 'page') : plural(r.secs.length, 'section');
  }

  /* A document made from a chat takes the chat's last answer: the intro is
     its summary, and each numbered part is a section, with the number dropped
     because the document numbers its own sections. */
  function sectionsOf(c) {
    var ans = null;
    c.msgs.forEach(function (m) { if (m.a && !m.pending) ans = m.a; });
    if (!ans) return [];
    var out = [];
    if (ans.intro && ans.intro.length) out.push({ h: ans.parts ? 'Summary' : 'The answer', ps: ans.intro });
    (ans.parts || []).forEach(function (p) { out.push({ h: p.h.replace(/^\d+\.\s*/, ''), ps: p.ps }); });
    return out;
  }
  DOCS.forEach(function (r) { if (r.kind === 'doc' && !r.secs) r.secs = sectionsOf(CHATS[r.from]); });

  /* Citations, numbered in order of first use within one chat or document. */
  function citer() {
    var seen = [];
    var f = function (html) {
      return html.replace(/\{(\w+)\}/g, function (_, id) {
        var s = LIB[id]; if (!s) return '';
        var n = seen.indexOf(id); if (n < 0) { seen.push(id); n = seen.length - 1; }
        return '<button type="button" class="cite t' + s.tier + '" data-act="src" data-id="' + id + '" aria-label="Source ' + (n + 1) + ': ' + esc(s.t) + '"><span class="cm" aria-hidden="true">' + TM[s.tier] + '</span>' + (n + 1) + '</button>';
      });
    };
    f.seen = seen;
    return f;
  }
  /* The papers one answer cites, in the order it cites them. */
  function citedInAnswer(a) {
    var out = [], txt = [].concat(a.intro || [], [].concat.apply([], (a.parts || []).map(function (x) { return x.ps; }))).join(' ');
    txt.replace(/\{(\w+)\}/g, function (_, id) { if (LIB[id] && out.indexOf(id) < 0) out.push(id); });
    return out;
  }
  /* H1.1, H1.2: after each answer, its sources, folded by default to one
     line: the same citation marks the text uses, in the order it cites them,
     so the strip is a key to the text. The mark carries the tier (filled in
     the library, outlined abstract only, dashed arrow on the web), which is
     why the rows need no group headings or "read on platform" labels. Every
     row opens the paper's quick view; pointing at a row lights its citations
     in the answer. */
  var TIERN = { 1: 'In the library', 2: 'Abstract only', 3: 'Web source, opens off-platform' };
  function eviGroup(a, cite) {
    var ids = citedInAnswer(a); if (!ids.length) return '';
    function mark(id) { var s = LIB[id]; return '<span class="cite sm t' + s.tier + '" title="' + TIERN[s.tier] + '"><span class="cm" aria-hidden="true">' + TM[s.tier] + '</span>' + (cite.seen.indexOf(id) + 1) + '</span>'; }
    function row(id) {
      var s = LIB[id], who = [esc(s.a), s.y].filter(Boolean).join(' &middot; ');
      return '<button class="evi-row" type="button" data-act="src" data-id="' + id + '" aria-label="Source ' + (cite.seen.indexOf(id) + 1) + ', ' + TIERN[s.tier] + ': ' + esc(s.t) + '">' + mark(id) + '<span class="tt"><i>' + esc(s.t) + '</i>' + (who ? '<span class="by">' + who + '</span>' : '') + '</span><span class="px-go' + (s.tier === 3 ? ' out' : '') + '" aria-hidden="true"></span></button>';
    }
    /* The closed line counts the sources by tier, one chip per tier used. */
    var strip = [1, 2, 3].map(function (t) { var k = ids.filter(function (id) { return LIB[id].tier === t; }).length; return k ? '<span class="cite sm t' + t + '" title="' + k + ' ' + TIERN[t].split(',')[0].toLowerCase() + '"><span class="cm" aria-hidden="true">' + TM[t] + '</span>' + k + '</span>' : ''; }).join('');
    return { n: ids.length, strip: strip, list: ids.map(row).join('') };
  }
  /* H1.3 to H1.5: under an answer, one quiet line. The tools it used fold
     away in mono at the left; copying with citations and the two votes sit at
     the right, as icons. */
  var TOOLS = ['Searched the library', 'Ranked the strongest studies', 'Read the full text of the top papers', 'Checked the abstracts of the rest', 'Searched the web for anything missing', 'Matched each claim to its passage'];
  /* H1.6, the session reflection (production's "Before you go" card,
     restyled): the suggestion opens it in the thread, above the composer. */
  var USES = ['Evaluating a proposal', 'Researching a conflict', 'Literature review', 'Program design', 'Funding decision', 'Briefing or talking points', 'Monitoring and evaluation', 'Personal learning', 'Other'];
  var DIMS = ['Peace Intel understood what I was looking for', 'Responses were accurate and well-grounded', 'Peace Intel cited sources appropriately', 'The answers were useful for my work'];
  function scale(name, v) {
    return '<div class="rf-scale" role="group" aria-label="' + esc(name) + '">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-act="rf" data-id="' + name + ':' + n + '" aria-pressed="' + (v === n) + '">' + n + '</button>'; }).join('') + '</div>';
  }
  function reflectCard(r) {
    if (!r) return '';
    if (r.sent) return '<p class="rf-done">' + g('check') + 'Thanks. Your take on this session is saved.</p>';
    return '<form class="reflect" data-rf onsubmit="return false"><header class="rf-h"><span class="eyebrow eb-4">Before you go</span><h3>How did this session go?</h3></header>' +
      '<div class="rf-q"><p>Did Peace Intel meet your expectations?</p>' + scale('overall', r.overall) + '<p class="rf-key">1 fell short &middot; 5 exceeded</p></div>' +
      '<div class="rf-q"><p>What were you using it for?</p><div class="rf-uses">' + USES.map(function (u) { return '<button class="chip-q" type="button" data-act="rf-use" data-id="' + esc(u) + '" aria-pressed="' + ((r.uses || []).indexOf(u) > -1) + '">' + esc(u) + '</button>'; }).join('') + '</div></div>' +
      '<div class="rf-q"><label for="rf-t">What was missing, or what would have helped most?</label><textarea class="input" id="rf-t" rows="3" placeholder="One or two sentences is plenty">' + esc(r.text || '') + '</textarea></div>' +
      '<div class="rf-q"><p>How would you rate it across these?</p>' + DIMS.map(function (d, i) { return '<div class="rf-dim"><span>' + esc(d) + '</span>' + scale('d' + i, r['d' + i]) + '</div>'; }).join('') + '</div>' +
      '<div class="rf-f"><button class="btn ghost sm" type="button" data-act="rf-skip">Not now</button><button class="btn tint sm" type="button" data-act="rf-send">Send</button></div></form>';
  }
  /* Rev 45: the tools used and the sources share one line, tools at the
     left, so an answer ends in a single row; each opens its own panel under
     the row, which stays open through a redraw (S.fold). */
  function ansFoot(m, i, ev, fb) {
    var v = S.vote[S.chat + ':' + i] || '', k = S.chat + ':' + i, f = S.fold[k] || '';
    function tog(w, cls, inner) { return '<button class="' + cls + '" type="button" data-act="fold" data-id="' + i + ':' + w + '" aria-expanded="' + (f === w) + '" aria-controls="af-' + w + '-' + i + '">' + inner + '</button>'; }
    return '<div class="ans-foot"><div class="af-row">' +
      (ev ? tog('s', 'af-src', '<span class="evi-head">Sources</span><span class="evi-strip" aria-label="' + plural(ev.n, 'source') + '">' + ev.strip + '</span>' + g('chevron-down')) : '') +
      tog('t', 'af-tools', '<span>' + (m.a.tools || 25) + ' tools<span class="af-w"> used</span></span>' + g('chevron-down')) +
      (fb ? '<button class="af-tools af-fb" type="button" data-act="wrap-up" aria-expanded="' + !!S.reflect[S.chat] + '" aria-label="Give feedback on this session">' + g('message-square') + '<span>Give feedback</span>' + g('chevron-down') + '</button>' : '') +
      '<span class="af-acts">' +
      '<button class="icon-btn" type="button" data-act="copy-cite" aria-label="Copy with citations" title="Copy with citations">' + g('copy') + '</button>' +
      '<button class="icon-btn" type="button" data-act="vote" data-id="' + i + ':up" aria-pressed="' + (v === 'up') + '" aria-label="Good answer">' + g('thumbs-up') + '</button>' +
      '<button class="icon-btn" type="button" data-act="vote" data-id="' + i + ':down" aria-pressed="' + (v === 'down') + '" aria-label="Poor answer">' + g('thumbs-down') + '</button></span></div>' +
      '<ol class="af-list" id="af-t-' + i + '"' + (f === 't' ? '' : ' hidden') + '>' + TOOLS.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ol>' +
      (ev ? '<div class="evi-list" id="af-s-' + i + '"' + (f === 's' ? '' : ' hidden') + '>' + ev.list + '</div>' : '') + '</div>';
  }


  function avatar(i, cls) { return '<span class="avatar' + (cls ? ' ' + cls : '') + '" title="' + esc(personName(i)) + '">' + i + '</span>'; }
  function personName(i) { return PEOPLE[i] || i; }

  /* ── drawing ─────────────────────────────────────────────────────────────── */
  function thread(id, withDate) {
    var c = CHATS[id];
    return '<button class="thread" type="button" data-act="chat" data-id="' + id + '" aria-current="' + (S.view === 'chat' && S.chat === id) + '"><div class="th-t">' + esc(c.t) + '</div>' +
      (withDate ? '<div class="th-m">' + c.d + (c.other ? ' &middot; ' + esc(personName(c.by)) : '') + '</div>' : '') + '</button>';
  }
  /* The rail is built as the pane is (Matt, 2026-10-15): a head with its mark,
     its name, its two tools as icons (a new chat, the finder) and the button
     that folds it; then the list. The column is .surface--ground-2, so the conversation is
     the brightest thing on the screen. They were a full-width button and a
     search bar under the head until the same day, and took a fifth of it. */
  function railTools(cls) {
    return '<button class="icon-btn' + cls + '" type="button" data-act="new-chat" aria-label="New chat">' + g('square-pen') + '</button>' +
      '<button class="icon-btn' + cls + '" type="button" data-act="find" aria-haspopup="dialog" aria-keyshortcuts="Meta+K" aria-label="Search chats and projects" title="Search chats and projects (&#8984;K)">' + g('search') + '</button>';
  }
  /* A folded side keeps a shelf: its divider and the button that reopens it. */
  function shelf(act, glyph, label) {
    return '<div class="shelf"><button class="icon-btn" type="button" data-act="' + act + '" aria-label="' + label + '">' + g(glyph) + '</button></div>';
  }
  function drawRail() {
    if (S.rail === 'off' && S.drawer !== 'rail') { rail.innerHTML = shelf('rail-on', 'panel-left-open', 'Show the chats'); return; }
    var cur = current();
    var h = paneHead(CHATMARK, 'Chats', 'Fold the chats away', railTools(''), 'rail') +
      '<div class="rail-body">';
    h += '<div class="pj-sec"><div class="pj-sec-h"><span class="eyebrow eb-4 faint">Projects</span><button class="icon-btn" type="button" data-act="new-project" aria-label="New project">' + g('plus') + '</button></div>';
    PROJECTS.forEach(function (p) {
      var open = !!cur && cur.id === p.id, chats = chatsOf(p.id), docs = docsOf(p.id), shared = p.members.length > 1;
      h += '<button class="pj-item" type="button" data-act="project" data-id="' + p.id + '" aria-expanded="' + open + '" aria-current="' + (S.view === 'project' && open) + '">' +
        g(open ? 'folder-open' : 'folder') + '<span>' + esc(p.name) + '</span>' +
        (shared ? g('users').replace('class="glyph"', 'class="glyph pj-shared"').replace('aria-hidden="true"', 'aria-label="Shared" role="img"') : '') +
        '<span class="pj-n">' + chats.length + '</span></button>';
      /* A chat can start inside the project from here as well as from the
         project's page; the New chat above starts one outside any project. */
      if (open) {
        h += '<div class="pj-kids"><button class="pj-more pj-new" type="button" data-act="project-chat" data-id="' + p.id + '">' + g('plus') + 'New chat here</button>' + chats.map(function (id) { return thread(id, false); }).join('') +
          '<button class="pj-more" type="button" data-act="artifacts" data-id="' + p.id + '">' + g('file-text') + plural(docs.length, 'artifact') + '</button></div>';
      }
    });
    /* H1.13, staff only: one quiet toggle on the Recent line widens the list
       to every user's chats, each carrying its owner's initials. */
    var all = S.admin && S.scope === 'all';
    h += '</div><div class="pj-sec"><div class="pj-sec-h"><span class="eyebrow eb-4 faint">' + (all ? 'Recent, all users' : 'Recent') + '</span>' +
      (S.admin ? '<button class="pj-scope" type="button" data-act="scope" aria-pressed="' + all + '" title="Staff only: show every user\u2019s chats">' + g('users') + '<span>All users</span></button>' : '') + '</div>' +
      ORDER.filter(function (id) { return !CHATS[id].p; }).concat(all ? OTHERS : []).map(function (id) { return thread(id, true); }).join('') + '</div></div>' +
      /* 21 · B: in the drawer the console's links sit at the foot, as
         Claude's settings do; on a desk they stay in the top bar. */
      '<nav class="rail-nav" aria-label="Console">' + [].map.call(document.querySelectorAll('.app-nav a'), function (a) { return '<a href="' + a.getAttribute('href') + '">' + esc(a.textContent) + '</a>'; }).join('') + '</nav>';
    rail.innerHTML = h;
  }

  function folded(side) {
    /* A folded side reopens from its own shelf; the toolbar carries the
       rail's tools only where there is no rail at all (narrow screens). */
    /* At narrow widths the toolbar leads with the chats shelf, the same
       glyph that reopens a folded rail on desktop; search lives in the shelf. */
    return side === 'rail' ? '<button class="icon-btn tools-rail rail-open" type="button" data-act="drawer-rail" aria-haspopup="dialog" aria-expanded="' + (S.drawer === 'rail') + '" aria-label="Projects and chats">' + g('panel-left-open') + '</button>' + railTools(' tools-rail') : '';
  }
  function crumb(p, cur) {
    return '<nav class="pj-crumb" aria-label="Breadcrumb">' + g('folder') + '<button type="button" data-act="project" data-id="' + p.id + '">' + esc(p.name) + '</button>' +
      g('chevron-right') + '<span class="cur" aria-current="page">' + esc(cur) + '</span></nav>';
  }
  function share(p) {
    return (p && p.members.length > 1 ? '<button class="pj-people" type="button" data-act="share" aria-label="Shared with ' + (p.members.length - 1) + ' ' + (p.members.length === 2 ? 'person' : 'people') + '">' +
      p.members.slice(0, 4).map(function (m) { return avatar(m.i); }).join('') + '</button>' : '') +
      '<button class="act" type="button" data-act="share" aria-haspopup="dialog">Share</button>';
  }
  /* THE SOURCES COUNT (21 · D, Matt 16 Oct). Where there is no pane (under
     1080px) the library is reached from the toolbar: how many papers the
     chat cites, drawn as a citation, so it carries the accent the citations
     in the answer carry. It counts up as answers arrive. Tapping it opens
     the library. */
  function ticker(c) {
    var ids = citedIn(c); if (!ids.length) return '';
    var on = S.drawer === 'pane';
    return '<button class="src-tick cite t1" type="button" data-act="drawer-pane" aria-expanded="' + on + '" aria-label="' + ids.length + ' sources cited. ' + (on ? 'Close' : 'Open') + ' the library"><span class="cm" aria-hidden="true">&#9679;</span>' + nn(ids.length) + g('panel-right-open').replace('class="glyph"', 'class="glyph tk-open"') + g('x').replace('class="glyph"', 'class="glyph tk-x"') + '</button>';
  }
  function expanded() { return S.rail === 'off' && S.pane === 'off'; }

  /* The bar reads as two ends, after Claude's: what shapes the answer at the
     left (mode, spoken replies, settings), and the two ways to send it
     at the right, the microphone beside the send. */
  var LISTENING = 'Listening. Press the microphone again to stop.';
  /* On a phone (Pl. 21, the console on a phone) the mode tray, spoken
     replies, settings and the version badge give way to one chip that
     names the mode and opens a menu holding all of them, so the bar is one
     row: the mode at the left, the microphone and send at the right. */
  /* Eirene is a mode of answering (H1.9, Matt 16 Oct): it left the top bar. */
  var MODES = [['quick', 'Quick'], ['normal', 'Normal'], ['deep', 'Deep research'], ['eirene', 'Eirene']];
  function modeName() { return MODES.filter(function (m) { return m[0] === S.mode; })[0][1]; }
  function composer(p, placeholder) {
    var modes = MODES;
    return '<div class="composer">' +
      (S.attach.length ? '<div class="cb-files">' + S.attach.map(function (f, i) { return '<span class="cb-file">' + g('file') + '<span>' + esc(f) + '</span><button class="icon-btn" type="button" data-act="unattach" data-id="' + i + '" aria-label="Remove ' + esc(f) + '">' + g('x') + '</button></span>'; }).join('') + '</div>' : '') +
      '<textarea class="ci" rows="2" name="q" aria-label="Ask a question" data-ph="' + esc(placeholder) + '" placeholder="' + esc(S.dictate ? LISTENING : placeholder) + '"></textarea>' +
      '<div class="composer-bar">' +
        '<div class="seg mono" aria-label="Answer mode" data-tray="mode">' + modes.map(function (m) { return '<button type="button" data-v="' + m[0] + '" aria-pressed="' + (S.mode === m[0]) + '">' + m[1] + '</button>'; }).join('') + '</div>' +
        '<button class="act cb-mode" type="button" data-act="mode-menu" aria-haspopup="menu" aria-expanded="false" aria-label="Answer mode and options"><span>' + modeName() + '</span>' + g('chevron-down') + '</button>' +
        '<button class="icon-btn" type="button" data-act="attach" aria-label="Attach a file">' + g('paperclip') + '</button>' +
        '<button class="icon-btn" type="button" data-act="spoken" aria-pressed="' + S.spoken + '" aria-label="Spoken replies">' + g('volume-2') + '</button>' +
        '<button class="icon-btn" type="button" aria-label="Settings">' + g('settings') + '</button>' +
        '<span class="spacer"></span><span class="badge cb-ver" title="Internal: the version answering">v1</span>' +
        '<span class="cb-send"><button class="icon-btn" type="button" data-act="dictate" aria-pressed="' + S.dictate + '" aria-label="Dictate">' + g('mic') + '</button>' +
        '<button class="send" type="button" data-act="send" aria-label="Send"></button></span>' +
      '</div></div>';
  }

  function answer(a, cite) {
    var h = (a.intro || []).map(function (p) { return '<p>' + cite(p) + '</p>'; }).join('');
    (a.parts || []).forEach(function (part) {
      h += '<h4>' + esc(part.h) + '</h4>' + part.ps.map(function (p) { return '<p>' + cite(p) + '</p>'; }).join('');
    });
    return h;
  }
  function savedCard(r) {
    var k = KINDS[r.kind];
    return '<button class="pj-saved obj" type="button" data-kind="' + k.name + '" data-act="doc" data-id="' + r.id + '">' + g(k.glyph) +
      '<span><span class="pj-doc-t">' + esc(r.name) + '</span><span class="pj-m">Saved to ' + esc(proj(r.p).name) + '</span></span></button>';
  }

  function viewChat() {
    var c = S.chat ? CHATS[S.chat] : null, p = c && c.p ? proj(c.p) : null, cite = citer();
    var empty = !c || !c.msgs.length;
    var tools = '<div class="app-tools">' + folded('rail') + (p ? crumb(p, c.t) : '') + '<span class="spacer"></span>' +
      '<button class="act" type="button" data-act="export" aria-haspopup="menu" aria-expanded="false"' + (empty ? ' disabled' : '') + '>Export' + g('chevron-down') + '</button>' +
      '<button class="icon-btn line" type="button" data-act="expand" aria-pressed="' + expanded() + '" aria-label="Expand">' + g(expanded() ? 'minimize-2' : 'maximize-2') + '</button>' +
      share(p) + (empty ? '' : '<button class="icon-btn line cb-util" type="button" data-act="util-menu" aria-haspopup="menu" aria-expanded="false" aria-label="Search, share and export">' + g('ellipsis') + '</button>') + ticker(c) + folded('pane') + '</div>';
    var body;
    if (empty) {
      body = '<div class="app-scroll"><div class="app-empty"><h2>What are you working on?</h2><p>Ask about the evidence, or start from a project in the rail.</p></div></div>';
    } else {
      var last = c.msgs.length - 1;
      body = '<div class="app-scroll"><div class="chat">' + c.msgs.map(function (m, i) {
        if (m.u) return '<div class="msg user"><div class="who">' + (c.by && c.by !== 'MA' ? esc(personName(c.by)) : 'You') + ' &middot; ' + m.at + '</div><div class="bubble">' + esc(m.u) + '</div></div>';
        return '<div class="msg agent"><div class="who">Peace Intel &middot; ' + m.at +
          (m.pending ? '' : ' <button class="icon-btn" type="button" aria-label="Read the answer aloud">' + g('play') + '</button>') + '</div>' +
          '<div class="body">' + (m.pending ? '<p>' + esc(m.pending) + '</p>' : answer(m.a, cite)) + '</div>' +
          (m.pending ? '' : ansFoot(m, i, eviGroup(m.a, cite), i === last && c.msgs.length > 1)) + '</div>';
      }).join('') + DOCS.filter(function (r) { return r.from === S.chat && r.kind === 'doc'; }).map(savedCard).join('') +
        /* H1.6: a suggestion under the last answer, as production has it. */
        (c.msgs[last] && c.msgs[last].a && c.msgs.length > 1 ? reflectCard(S.reflect[S.chat]) : '') +
        '</div></div>';
    }
    /* Rev 51-52: the toolbar and the composer sit inside the scroll area,
       pinned to its head and foot, so the thread runs the window's full
       height and fades out behind both. */
    return body.replace(/<\/div>$/, '').replace('<div class="app-scroll">', '<div class="app-scroll">' + tools) + '<div class="composer-wrap">' + composer(p, p ? 'Ask about ' + p.name : 'Ask Peace Intel about peacebuilding evidence…') + '</div></div>';
  }

  function docCard(r) {
    var k = KINDS[r.kind];
    return '<div class="pj-doc obj" data-kind="' + k.name + '" data-rid="' + r.id + '"><button class="pj-doc-open" type="button" data-act="doc" data-id="' + r.id + '">' + g(k.glyph) +
      '<span class="pj-doc-t">' + esc(r.name) + '</span><span class="pj-m">' + r.d + ' &middot; ' + count(r) + '</span></button>' +
      '<button class="icon-btn" type="button" data-act="rename-doc" data-id="' + r.id + '" aria-label="Rename ' + esc(r.name) + '">' + g('pencil') + '</button>' +
      '<button class="icon-btn" type="button" data-act="download" data-id="' + r.id + '"' + (k.formats.length > 1 ? ' aria-haspopup="menu" aria-expanded="false"' : '') + ' aria-label="Download ' + esc(r.name) + '">' + g('download') + '</button></div>';
  }
  /* The object mark says what a paper is (an empirical study, a case study,
     a dissertation), so the line under the title gives who, when and how
     strong, and does not repeat it. */
  function libItem(id, opts) {
    var s = LIB[id], meta = s.m || [s.a, s.y].filter(Boolean).join(' · '), kind = esc(s.k);
    if (opts && opts.cited) meta = 'Cited ' + opts.cited + ' · ' + meta;
    var inner = '<span class="li-t">' + esc(s.t) + '</span><span class="li-m"><span class="tm">' + TM[s.tier] + '</span><span>' + esc(meta) + '</span></span>';
    if (opts && opts.pick) {
      var on = papersOf(current()).indexOf(id) > -1;
      return '<div class="lib-item obj lib-pick' + (s.tier === 3 ? ' t3' : '') + '" data-kind="' + kind + '">' + inner +
        '<button class="icon-btn" type="button" data-act="pick" data-id="' + id + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Remove from' : 'Add to') + ' the project’s context: ' + esc(s.t) + '">' + g(on ? 'check' : 'plus') + '</button></div>';
    }
    return '<button class="lib-item obj' + (s.tier === 3 ? ' t3' : '') + '" type="button" data-act="src" data-id="' + id + '" data-kind="' + kind + '">' + inner + '</button>';
  }
  function upGlyph(ext) { return /XLS|CSV/.test(ext) ? 'file-spreadsheet' : ext === 'PDF' ? 'file-type-2' : /DOC|MD|TXT/.test(ext) ? 'file-text' : 'file'; }
  function addMenuBtn() { return '<button class="act" type="button" data-act="add-menu" aria-haspopup="menu" aria-expanded="false">' + g('plus') + 'Add</button>'; }

  /* THE PROJECT PANEL, after Claude's project page: instructions, context and
     memory, each a row that opens in a dialog, then who the project is shared
     with. It takes the right-hand pane on a project's page, where the whole
     library has no job to do, and sits in the page instead when the pane is
     folded away or the screen is too narrow for one. */
  function projectPanel(p) {
    var others = p.members.filter(function (m) { return m.i !== 'MA'; });
    var reading = p.ctx.filter(function (x) { return x.status === 'reading'; }).length;
    function row(act, glyph, label, n, action, desc) {
      return '<section class="pp-row"><div class="pp-h"><button class="pp-open" type="button" data-act="' + act + '" aria-haspopup="dialog">' + g(glyph) + '<span>' + label + '</span>' +
        (n !== null ? '<span class="pj-n">' + n + '</span>' : '') + '</button>' + action + '</div><p class="pp-d">' + desc + '</p></section>';
    }
    return row('instr', 'scroll-text', 'Instructions', null, '<button class="act" type="button" data-act="instr" aria-haspopup="dialog">' + (p.instr ? 'Edit' : 'Add') + '</button>',
        p.instr ? esc(p.instr) : 'How every chat here should answer: who it is for, what to lead with, what to flag.') +
      row('context', 'files', 'Context', p.ctx.length, addMenuBtn(),
        p.ctx.length ? esc(ctxSummary(p)) + (reading ? ' · reading ' + plural(reading, 'file') : '') : 'Files, notes and library papers that every chat here draws on.') +
      row('memory', 'history', 'Memory', p.mem.length, '<button class="act" type="button" data-act="memory" aria-haspopup="dialog">View</button>',
        p.mem.length ? 'Kept from this project’s chats' + (p.memAll ? ' and your others' : '') + '.' : 'Nothing yet. It fills as you work.') +
      '<button class="pp-foot" type="button" data-act="share" aria-haspopup="dialog">' +
        (others.length ? '<span class="pj-people">' + p.members.slice(0, 4).map(function (m) { return avatar(m.i); }).join('') + '</span><span>Shared with ' + (others.length === 1 ? esc(others[0].name) : others.length + ' people') + '</span>'
          : g('users') + '<span>Only you</span>') + '</button>';
  }

  /* A PROJECT'S PAGE: what it is for, a composer that starts a chat in it,
     and its chats and artifacts in a tray, after ChatGPT's Chats and Sources
     tabs. The page is the raised surface, so it never reads as a chat. */
  function viewProject() {
    var p = proj(S.project), chats = chatsOf(p.id), docs = docsOf(p.id);
    var tabs = [['chats', 'Chats', chats.length], ['artifacts', 'Artifacts', docs.length]];
    return '<div class="app-tools">' + folded('rail') + '<nav class="pj-crumb" aria-label="Breadcrumb">' + g('folder') + '<span>Projects</span>' + g('chevron-right') + '<span class="cur" aria-current="page">' + esc(p.name) + '</span></nav>' +
      '<span class="spacer"></span>' + share(p) + folded('pane') + '</div>' +
      '<div class="app-scroll"><div class="pj-home">' +
        '<h2 class="pj-title"><span class="pj-name">' + esc(p.name) + '</span><button class="icon-btn" type="button" data-act="details" aria-haspopup="dialog" aria-label="Edit the project’s name and description">' + g('pencil') + '</button></h2>' +
        (p.purpose ? '<p class="lede">' + esc(p.purpose) + '</p>' : '') +
        composer(p, 'Start a chat in ' + p.name) +
        '<section class="pj-aside" aria-label="This project">' + projectPanel(p) + '</section>' +
        '<div class="seg mono pj-tabs" aria-label="Show" data-tray="tab">' + tabs.map(function (t) { return '<button type="button" data-v="' + t[0] + '" aria-pressed="' + (S.tab === t[0]) + '">' + t[1] + '<span class="pj-n">' + t[2] + '</span></button>'; }).join('') + '</div>' +
        '<div class="pj-tab" data-tab="chats"' + (S.tab === 'chats' ? '' : ' hidden') + '>' +
          (chats.length ? '<div class="pj-list">' + chats.map(function (id) { var c = CHATS[id]; return '<button class="pj-row" type="button" data-act="chat" data-id="' + id + '"><span>' + esc(c.t) + '</span>' + (c.by && c.by !== 'MA' ? avatar(c.by, 'pj-by') : '') + '<span class="pj-m">' + c.d + '</span></button>'; }).join('') + '</div>'
            : '<p class="pj-empty">No chats yet. Ask above to start one.</p>') + '</div>' +
        '<div class="pj-tab" data-tab="artifacts"' + (S.tab === 'artifacts' ? '' : ' hidden') + '>' +
          (docs.length ? '<div class="pj-docs">' + docs.map(docCard).join('') + '</div>'
            : '<p class="pj-empty">Nothing yet. What this project’s chats make lands here: save an answer with Export, then Save as an artifact.</p>') + '</div>' +
      '</div></div>';
  }

  function viewDoc() {
    var r = docById(S.doc), p = proj(r.p), k = KINDS[r.kind], from = r.from && CHATS[r.from], cite = citer();
    var tools = '<div class="app-tools">' + folded('rail') + crumb(p, r.name) + '<span class="spacer"></span>' +
      '<button class="icon-btn line" type="button" data-act="rename-doc" data-id="' + r.id + '" aria-label="Rename">' + g('pencil') + '</button>' +
      '<button class="act" type="button" data-act="download" data-id="' + r.id + '"' + (k.formats.length > 1 ? ' aria-haspopup="menu" aria-expanded="false">Download' + g('chevron-down') : '>Download ' + FMT[k.formats[0]][0]) + '</button>' +
      share(p) + folded('pane') + '</div>';
    var meta = k.name + ' &middot; ' + esc(p.name) + ' &middot; ' + (r.by && r.by !== 'MA' ? esc(personName(r.by)) + ', ' : '') + (r.d === 'Today' ? 'today' : r.d) +
      (r.kind === 'pdf' ? ' &middot; ' + r.pages + ' pages, ' + r.size : '') +
      (from ? ' &middot; from <button type="button" data-act="chat" data-id="' + r.from + '">' + esc(from.t) + '</button>' : '');
    var head = '<header class="dp-head"><h2 class="dp-title">' + esc(r.name) + '</h2><p class="dp-meta">' + meta + '</p></header>';
    var body;
    if (r.kind === 'sheet') {
      body = '<div class="sheet-v"><table class="sheet-t"><thead><tr>' + r.sheet.cols.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        r.sheet.rows.map(function (row) { return '<tr>' + row.map(function (v, i) { return i ? '<td>' + esc(v) + '</td>' : '<th scope="row">' + esc(v) + '</th>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    } else if (r.kind === 'pdf') {
      var strip = function (t) { return esc(t.replace(/\s*\{\w+\}/g, '')); };
      body = '<div class="pdf-v" aria-label="The first pages">' +
        '<div class="pdf-page"><p class="pdf-t">' + esc(r.name) + '</p>' + r.secs.slice(0, 2).map(function (s) { return '<h4>' + esc(s.h) + '</h4>' + s.ps.map(function (t) { return '<p>' + strip(t) + '</p>'; }).join(''); }).join('') + '<span class="pdf-n">1 / ' + r.pages + '</span></div>' +
        '<div class="pdf-page">' + r.secs.slice(2).map(function (s) { return '<h4>' + esc(s.h) + '</h4>' + s.ps.map(function (t) { return '<p>' + strip(t) + '</p>'; }).join(''); }).join('') + '<span class="pdf-n">2 / ' + r.pages + '</span></div>' +
        '</div>';
    } else {
      body = '<nav class="st-toc" aria-label="In this document">' + r.secs.map(function (s, i) { return '<a href="#dp-' + i + '" aria-current="' + (i === 0) + '"><span>' + nn(i + 1) + '</span>' + esc(s.h) + '</a>'; }).join('') + '</nav>' +
        r.secs.map(function (s, i) {
          return '<section class="st-sec" id="dp-' + i + '"><div class="st-num"><span class="st-n">' + nn(i + 1) + '</span></div><div class="st-body"><h3>' + esc(s.h) + '</h3>' +
            s.ps.map(function (t) { return '<p>' + cite(t) + '</p>'; }).join('') + '</div></section>';
        }).join('');
    }
    return tools + '<div class="app-scroll" data-doc><article class="dp">' + head + body + '</article></div>';
  }

  function drawMain() {
    main.innerHTML = S.view === 'project' ? viewProject() : S.view === 'doc' ? viewDoc() : viewChat();
    /* The grid sits on the column, which does not scroll, so it holds still
       while the chat scrolls over it. A project's page is the raised surface. */
    main.classList.toggle('textured', S.view !== 'doc'); main.classList.toggle('textured--bottom', S.view === 'chat');
    main.classList.toggle('surface--ground-2', S.view === 'project');
    main.setAttribute('data-view', S.view);
    var sc = main.querySelector('[data-doc]');
    if (sc && sc.querySelector('.st-toc')) numbered(sc);
  }

  /* THE PANE. On a project's page it is the project panel. Everywhere else it
     is the library, led by the papers the chat in view cites. Adding papers
     to a project's context borrows it as the library in pick mode, with its
     own way out. */
  var SORTS = [['title', 'Title'], ['tier', 'Tier'], ['authors', 'Authors'], ['year', 'Year'], ['type', 'Type']];
  /* On a project's page the pane is part of the page and does not fold
     (Matt, 2026-10-15); it folds again in a chat. */
  function paneHead(mark, title, fold, readout, side) {
    var rail = side === 'rail';
    return '<div class="pane-head">' + mark + '<span class="ph-t">' + title + '</span><span class="spacer"></span>' + (readout || '') +
      (!rail && S.view === 'project' ? '' : '<button class="icon-btn" type="button" data-act="' + (rail ? 'rail-off' : 'pane-off') + '" aria-label="' + fold + '"' + (S.drawer === (rail ? 'rail' : 'pane') ? ' aria-expanded="true"' : '') + '>' + g(rail ? 'panel-left-close' : 'panel-right-close') + '</button>') + '</div>';
  }
  function drawPane() {
    if (S.view !== 'project') S.browse = false;
    if (S.pane === 'off' && S.view !== 'project' && S.drawer !== 'pane') { pane.innerHTML = shelf('pane-on', 'panel-right-open', 'Show the library'); return; }
    if (S.view === 'project' && !S.browse) {
      pane.innerHTML = paneHead(g('folder').replace('class="glyph"', 'class="glyph ph-glyph"'), 'Project') +
        '<div class="pane-body pp">' + projectPanel(current()) + '</div>';
      return;
    }
    if (S.src && LIB[S.src]) { drawSource(); return; }
    /* The size of the library lives in the search field's placeholder, the
       quietest place that is still read; the line above the search is only
       there while papers are being picked for a project. */
    var label = 'Search 6,582 curated papers';
    /* An instrument reading in the head: how many papers the chat in view
       cites, two digits, mono, like a counter. */
    var n = S.browse || S.view !== 'chat' ? 0 : citedIn(S.chat ? CHATS[S.chat] : null).length;
    var readout = n ? '<span class="ph-n" title="Sources this chat cites"><b>' + nn(n) + '</b> sources cited</span>' : '';
    pane.innerHTML = paneHead(MARK, 'Library', 'Fold the library away', readout) +
      '<div class="pane-tools">' +
        (S.browse ? '<div class="pane-meta-row"><p class="pane-meta" aria-live="polite"></p><button class="act" type="button" data-act="browse-done">Done</button></div>' : '') +
        '<div class="pane-search"><input class="input" type="search" name="lib" aria-label="' + label + '" placeholder="' + label + '" value="' + esc(S.q) + '">' +
        '<button class="icon-btn line" type="button" aria-label="Filters">' + g('list-filter') + '</button></div>' +
        '<div class="seg mono" aria-label="Sort by" data-tray="sort">' + SORTS.map(function (s) { return '<button type="button" data-v="' + s[0] + '" aria-pressed="' + (S.sort === s[0]) + '">' + s[1] + '</button>'; }).join('') + '</div>' +
      '</div><div class="pane-body"></div>';
    drawList();
  }
  /* Where a source's link goes. Mock addresses, obviously so (CONSOLE.md
     section 7): production has the real ones. */
  function srcUrl(id) { return LIB[id].tier === 3 ? 'example.org/web-source/' + id : 'doi.org/10.0000/mock.' + id; }
  function citedNo(id) { return S.view === 'chat' && S.chat ? citedIn(CHATS[S.chat]).indexOf(id) + 1 : 0; }
  function drawSource() {
    var id = S.src, s = LIB[id], d = SRC[id] || {}, n = citedNo(id), t = TIER[s.tier];
    var meta = [s.a, s.y, s.k].filter(Boolean).map(esc).join(' &middot; ');
    var back = '<button class="icon-btn" type="button" data-act="' + (S.reader ? 'src-quick' : 'src-off') + '" aria-label="' + (S.reader ? 'Back to the summary' : 'Back to the library') + '">' + g('arrow-left') + '</button>';
    var close = '<button class="icon-btn" type="button" data-act="' + (S.drawer === 'pane' ? 'drawer-off' : 'src-off') + '" aria-label="' + (S.drawer === 'pane' ? 'Close the library' : 'Close the source') + '">' + g('x') + '</button>';
    var tier = '<span class="src-tier t' + s.tier + '"><span class="tm" aria-hidden="true">' + TM[s.tier] + '</span><b>' + t[0] + '</b> ' + t[1] + '</span>';
    if (!S.reader) {
      pane.innerHTML = '<div class="pane-head">' + back + '<span class="ph-t">Source</span><span class="spacer"></span>' + close + '</div>' +
        '<div class="pane-body src-q">' +
          '<header class="src-h"><h3 class="src-t">' + esc(s.t) + '</h3><p class="src-m">' + meta + '</p>' + tier +
            (n ? '<p class="src-n">Cited as <span class="cite sm t' + s.tier + '"><span class="cm" aria-hidden="true">' + TM[s.tier] + '</span>' + n + '</span> in this chat</p>' : '') + '</header>' +
          '<div class="src-acts">' + (s.tier < 3 ? '<button class="act" type="button" data-act="src-read">' + g('book-open') + (d.abstractOnly ? 'Read the abstract' : 'Read the full entry') + '</button>' : '') +
            (s.tier === 1 ? '<button class="act" type="button" data-act="src-pdf">' + g('download') + 'Download PDF</button>' : '') +
            '<button class="act" type="button" title="' + esc(srcUrl(id)) + '">Original source' + g('arrow-up-right') + '</button>' +
            /* H1.2: where the link goes, before it goes there. */
            '<p class="src-url">Original source opens <span>' + esc(srcUrl(id)) + '</span></p></div>' +
          (d.as ? '<section class="src-s"><h4 class="eyebrow eb-4 faint">Key assertions</h4><ol class="src-as">' + d.as.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ol></section>' : '') +
          (d.tags ? '<section class="src-s"><h4 class="eyebrow eb-4 faint">Details</h4><div class="src-tags">' + d.tags.map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join('') + '</div></section>' : '') +
          (d.sum ? '<section class="src-s"><h4 class="eyebrow eb-4 faint">Summary</h4><p class="src-sum">' + esc(d.sum) + '</p></section>' : '<p class="pj-empty">No summary has been written for this source yet.</p>') +
        '</div>';
      return;
    }
    var secs = d.secs || [{ h: 'Full text', ps: ['The full text of this paper is on the platform. The prototype carries sample text for three papers only.'] }];
    pane.innerHTML = '<div class="pane-head">' + back + '<span class="ph-t">' + (d.abstractOnly ? 'Abstract' : 'Full entry') + '</span><span class="spacer"></span>' + close + '</div>' +
      '<div class="pane-body src-r"><header class="src-rh"><p class="src-m">' + esc(s.a || s.k) + '</p><h2 class="src-rt">' + esc(s.t) + '</h2>' +
        '<p class="src-stats">' + tier + '<span><b>' + nn(secs.length) + '</b> sections</span>' + (d.pages ? '<span><b>' + d.pages + '</b> pages</span>' : '') + '</p></header>' +
        (secs.length > 2 ? '<nav class="src-toc" aria-label="Sections">' + secs.map(function (x, i) { return '<a href="#src-s' + i + '">' + esc(x.h) + '</a>'; }).join('') + '</nav>' : '') +
        secs.map(function (x, i) {
          return '<details class="src-sec" id="src-s' + i + '" open><summary><h3>' + esc(x.h) + '</h3>' + g('chevron-down') + '</summary>' + x.ps.map(function (q) {
            if (typeof q === 'string') return '<p>' + esc(q) + '</p>';
            return '<p class="src-hl"><span class="src-hl-k">Cited as <span class="cite sm t' + s.tier + '"><span class="cm" aria-hidden="true">' + TM[s.tier] + '</span>' + (n || q.c) + '</span> in this chat</span><mark>' + esc(q.t) + '</mark></p>';
          }).join('') + '</details>';
        }).join('') +
        '<p class="src-foot">Sample text, paraphrased for the prototype.</p></div>';
    var hl = pane.querySelector('.src-hl'), body = pane.querySelector('.pane-body');
    if (hl && body) body.scrollTop = hl.offsetTop - body.offsetTop - 24;
  }
  function drawList() {
    var p = current(), q = S.q.trim().toLowerCase();
    var cited = S.browse ? [] : citedIn(S.view === 'chat' && S.chat ? CHATS[S.chat] : null);
    var ids = S.browse ? Object.keys(LIB) : cited.concat(LIB_ALL.filter(function (id) { return cited.indexOf(id) < 0; }));
    if (q) ids = ids.filter(function (id) { var s = LIB[id]; return (s.t + ' ' + s.a + ' ' + s.k).toLowerCase().indexOf(q) > -1; });
    var by = {
      title: function (a, b) { return LIB[a].t.localeCompare(LIB[b].t); },
      tier: function (a, b) { return LIB[a].tier - LIB[b].tier || LIB[b].y - LIB[a].y; },
      authors: function (a, b) { return (LIB[a].a || '￿').localeCompare(LIB[b].a || '￿'); },
      year: function (a, b) { return LIB[b].y - LIB[a].y; },
      type: function (a, b) { return LIB[a].k.localeCompare(LIB[b].k); }
    };
    ids.sort(by[S.sort]);
    var lead = cited.filter(function (id) { return ids.indexOf(id) > -1; });
    var rest = ids.filter(function (id) { return cited.indexOf(id) < 0; });
    if (S.browse) pane.querySelector('.pane-meta').innerHTML = 'Adding to the context of <b>' + esc(p.name) + '</b> &middot; ' + plural(papersOf(p).length, 'paper') + ' there';
    function items(list) { return list.map(function (id) { return libItem(id, { pick: S.browse, cited: cited.indexOf(id) + 1 }); }).join(''); }
    var body = pane.querySelector('.pane-body');
    /* In a chat that cites anything, the library shows only what the chat
       cites. Searching widens it: the chat's matches first, then the rest of
       the library under its own line, so a search never stops at the chat. */
    if (!cited.length) { body.innerHTML = ids.length ? items(ids) : '<p class="pj-empty">Nothing in the library matches “' + esc(S.q.trim()) + '”.</p>'; return; }
    if (!q) { body.innerHTML = items(lead) + '<p class="pane-hint">Search to reach the whole library.</p>'; return; }
    body.innerHTML = '<h4 class="pane-sec eyebrow eb-4 faint">In this chat &middot; ' + lead.length + '</h4>' + (lead.length ? items(lead) : '<p class="pane-hint">None of this chat’s sources match.</p>') +
      '<h4 class="pane-sec eyebrow eb-4 faint">In the library &middot; ' + rest.length + '</h4>' + (rest.length ? items(rest) : '<p class="pane-hint">Nothing else in the library matches.</p>');
  }

  function draw() {
    app.setAttribute('data-rail', S.rail); app.setAttribute('data-pane', S.view === 'project' ? 'on' : S.pane);
    if (S.drawer) app.setAttribute('data-drawer', S.drawer); else app.removeAttribute('data-drawer');
    if (S.src && S.reader && S.view !== 'project') app.setAttribute('data-reader', ''); else app.removeAttribute('data-reader');
    drawRail(); drawMain(); drawPane();
  }

  /* ── the live region ── */
  var live = document.createElement('p');
  live.className = 'proto-live'; live.setAttribute('aria-live', 'polite');
  app.appendChild(live);
  /* 21 · C: behind an open drawer, a scrim that closes it. */
  var scrim = document.createElement('button');
  scrim.type = 'button'; scrim.className = 'app-scrim'; scrim.setAttribute('data-act', 'drawer-off'); scrim.setAttribute('aria-label', 'Close'); scrim.tabIndex = -1;
  app.querySelector('.app-body').appendChild(scrim);
  var narrow = matchMedia('(max-width: 1080px)'), phone = matchMedia('(max-width: 620px)');
  /* On a phone the top bar goes while the thread scrolls down (Pl. 21). */
  var lastY = 0, topLock = 0;
  /* THE DRAWERS (Rev 49). Under 1080px the chats slide in from the left and
     the library from the right, on --mo-sheet, and back the same way; swiped
     toward its edge a drawer follows the finger, and let go past a quarter of
     its width, or flicked, it closes. Reduced motion makes both instant. */
  var calm = matchMedia('(prefers-reduced-motion: reduce)');
  function closeDrawer() {
    var was = S.drawer; if (!was) return;
    var el = was === 'rail' ? rail : pane;
    function done() {
      app.classList.remove('is-sheet-off'); app.style.removeProperty('--sheet-x');
      S.drawer = null; S.src = null; S.reader = false; draw(); refocus(was === 'rail' ? '.rail-open' : '.src-tick');
    }
    if (!narrow.matches || calm.matches) return done();
    app.classList.add('is-sheet-off');
    var t = setTimeout(done, 500);
    el.addEventListener('transitionend', function te(e) { if (e.target !== el) return; el.removeEventListener('transitionend', te); clearTimeout(t); done(); });
  }
  var drag = null;
  [rail, pane].forEach(function (el) {
    var side = el === rail ? 'rail' : 'pane', dir = el === rail ? -1 : 1;
    el.addEventListener('pointerdown', function (e) {
      if (S.drawer !== side || !narrow.matches || e.button || e.pointerType === 'mouse') return;
      if (e.target.closest('input, select, textarea')) return;
      drag = { el: el, dir: dir, x0: e.clientX, y0: e.clientY, t0: Date.now(), dx: 0, w: el.offsetWidth, on: false, id: e.pointerId };
    });
    el.addEventListener('pointermove', function (e) {
      if (!drag || drag.el !== el) return;
      var dx = (e.clientX - drag.x0) * drag.dir, dy = Math.abs(e.clientY - drag.y0);
      if (!drag.on) { if (dy > 10 && dy > dx) { drag = null; return; } if (dx < 10) return; drag.on = true; el.setPointerCapture(drag.id); app.classList.add('is-dragging'); }
      drag.dx = Math.max(0, dx); app.style.setProperty('--sheet-x', drag.dx * drag.dir + 'px');
    });
    el.addEventListener('pointerup', endDrag); el.addEventListener('pointercancel', endDrag);
  });
  function endDrag() {
    if (!drag) return;
    var d = drag; drag = null; if (!d.on) return;
    app.classList.remove('is-dragging');
    if (d.dx > d.w * 0.25 || d.dx / Math.max(1, Date.now() - d.t0) > 0.6) closeDrawer();
    else app.style.removeProperty('--sheet-x');
  }
  main.addEventListener('scroll', function (e) {
    if (!phone.matches || !e.target.classList || !e.target.classList.contains('app-scroll')) return;
    /* Rev 53: the top bar (logo, account, menu) slides away while the reader
       scrolls down past the first 64px and slides back on any scroll up. While
       it moves the thread's height changes under the finger, so the events
       that causes are ignored until the slide has landed. */
    var y = e.target.scrollTop, d = y - lastY; lastY = y;
    if (Date.now() < topLock || Math.abs(d) < 2) return;
    var off = d > 0 ? y > 64 : false;
    if (off !== app.classList.contains('is-top-off')) { app.classList.toggle('is-top-off', off); topLock = Date.now() + 360; }
  }, true);
  narrow.addEventListener('change', function () { if (S.drawer) { S.drawer = null; draw(); } });
  function say(t) { live.textContent = ''; setTimeout(function () { live.textContent = t; }, 50); }

  /* ── going places ── */
  function go(view, id, tab) {
    S.drawer = null; S.src = null; S.reader = false; S.q = ''; app.classList.remove('is-top-off'); lastY = 0; S.browse = false; S.dictate = false;
    if (view === 'chat') { S.view = 'chat'; S.chat = id; }
    else if (view === 'project') { S.view = 'project'; S.project = id; S.tab = tab || 'chats'; }
    else if (view === 'doc') { S.view = 'doc'; S.doc = id; }
    draw();
    var sc = main.querySelector('.app-scroll'); if (sc) sc.scrollTop = 0;
  }
  function bottom() { var sc = main.querySelector('.app-scroll'); if (sc) sc.scrollTop = sc.scrollHeight; }
  function refocus(sel) { var el = (/^\.dlg/.test(sel) ? document : app).querySelector(sel); if (el) el.focus(); }
  function now() { return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }

  function send(ta) {
    var text = ta.value.trim(); if (!text) return;
    if (S.view === 'project' || !S.chat) {
      var id = 'c' + (++seq), pid = S.view === 'project' ? S.project : null;
      CHATS[id] = { t: text.length > 72 ? text.slice(0, 70).replace(/\s+\S*$/, '') + '…' : text, d: 'Today', p: pid, by: 'MA', msgs: [] };
      ORDER.unshift(id); S.view = 'chat'; S.chat = id;
    }
    var c = CHATS[S.chat], p = c.p ? proj(c.p) : null;
    var wait = { at: now(), pending: p ? 'Reading the context of ' + p.name + ', and the library…' : 'Reading the library…' };
    c.msgs.push({ u: text + (S.attach.length ? ' [' + plural(S.attach.length, 'file') + ' attached]' : ''), at: now() }, wait);
    S.attach = [];
    draw(); bottom();
    say('Question sent');
    setTimeout(function () {
      var first = p && papersOf(p)[0];
      wait.pending = null;
      wait.a = { intro: [p
        ? 'This is the prototype, so every new question gets this reply. In the product the answer draws on the library and on the ' + plural(p.ctx.length, 'item') + ' in the context of ' + p.name + (first ? ', each claim cited where it is made {' + first + '}' : '') + ', and follows the project’s instructions' + (p.instr ? ': “' + p.instr + '”' : '.')
        : 'This is the prototype, so every new question gets this reply. In the product Peace Intel reads the library and answers with every claim cited where it is made {fortna}, the strongest evidence first.'] };
      if (S.view === 'chat' && CHATS[S.chat] === c) { drawMain(); bottom(); }
      say('Answer ready');
    }, 700);
  }

  /* ── popovers: one menu and one panel, filled for whichever button opened
     them, positioned under it, light-dismissed by the browser ──────────────── */
  function popover(cls, role) {
    var el = document.createElement('div');
    el.className = cls; el.setAttribute('popover', ''); el.setAttribute('role', role);
    document.body.appendChild(el);
    return el;
  }
  var menu = popover('menu', 'menu'), panel = popover('pop', 'dialog');
  var opener = null, closedAt = 0, closedFor = null;
  function place(el, btn) {
    var r = btn.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
    var top = r.bottom + 4; if (top + h > innerHeight - 8) top = Math.max(8, r.top - h - 4);
    el.style.left = Math.min(Math.max(8, r.right - w), innerWidth - w - 8) + 'px';
    el.style.top = top + 'px';
  }
  function open(el, btn, html) {
    if (!el.showPopover) return;
    if (closedFor === btn && Date.now() - closedAt < 300) return;
    /* A modal dialog makes everything outside it inert, so a menu opened from
       inside one has to live inside it. */
    var host = btn.closest('dialog') || document.body;
    if (el.parentNode !== host) host.appendChild(el);
    el.innerHTML = html; opener = btn;
    el.showPopover(); place(el, btn);
    btn.setAttribute('aria-expanded', 'true');
    var first = el.querySelector('input, button'); if (first) first.focus();
  }
  [menu, panel].forEach(function (el) {
    el.addEventListener('toggle', function (e) {
      if (e.newState !== 'closed' || !opener) return;
      opener.setAttribute('aria-expanded', 'false');
      closedAt = Date.now(); closedFor = opener;
      if (!document.activeElement || document.activeElement === document.body || el.contains(document.activeElement)) {
        if (document.contains(opener)) opener.focus();
      }
    });
  });
  menu.addEventListener('keydown', function (e) {
    var items = [].slice.call(menu.querySelectorAll('button')), i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
  });
  window.addEventListener('scroll', function (e) {
    if (panel.contains(e.target) || menu.contains(e.target)) return;
    [menu, panel].forEach(function (el) { if (el.matches && el.matches(':popover-open')) el.hidePopover(); });
  }, true);
  function exportMenu(b) {
    var c = CHATS[S.chat];
    menu.dataset.ctx = 'chat';
    open(menu, b, (c.p ? item('save', c.p, 'file-plus', 'Save as an artifact', '')
      : '<span class="menu-l">Save as an artifact in</span>' + PROJECTS.map(function (x) { return item('save', x.id, 'folder', x.name, ''); }).join('')) +
      '<hr><span class="menu-l">Download the chat</span>' + formatItems('doc'));
  }
  function item(act, id, glyph, label, small) {
    return '<button type="button" role="menuitem" data-act="' + act + '" data-id="' + id + '">' + g(glyph) + '<span>' + esc(label) + '</span>' + (small ? '<small>' + small + '</small>' : '') + '</button>';
  }
  function formatItems(kind) { return KINDS[kind].formats.map(function (f) { return item('dl', f, 'download', FMT[f][0], FMT[f][1]); }).join(''); }

  menu.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var act = b.dataset.act, id = b.dataset.id, ctx = menu.dataset.ctx;
    menu.hidePopover();
    if (act === 'mode') {
      S.mode = id;
      [].forEach.call(app.querySelectorAll('[data-tray="mode"] button'), function (x) { x.setAttribute('aria-pressed', String(x.dataset.v === id)); });
      [].forEach.call(app.querySelectorAll('.cb-mode span'), function (x) { x.textContent = modeName(); });
      say('Answer mode: ' + modeName());
    }
    else if (act === 'spoken-toggle') {
      S.spoken = !S.spoken;
      [].forEach.call(app.querySelectorAll('[data-act="spoken"]'), function (x) { x.setAttribute('aria-pressed', String(S.spoken)); });
      say('Spoken replies ' + (S.spoken ? 'on' : 'off'));
    }
    else if (act === 'nav') location.href = id;
    /* The utility menu on a phone (21 · D): one button for search, share and
       export, each opening from it as it would from its own button. */
    else if (act === 'util') {
      var ub = app.querySelector('.cb-util');
      setTimeout(function () {
        closedFor = null;
        if (id === 'find') showDlg('search', { here: true });
        else if (id === 'share') open(panel, ub, sharePanel(current()));
        else exportMenu(ub);
      }, 0);
    }
    else if (act === 'save') saveDoc(S.chat, id);
    else if (act === 'note') showDlg('note', { back: D.view === 'context' });
    else if (act === 'dl') {
      if (ctx === 'chat') { var c = CHATS[S.chat]; download(c.t, { kind: 'doc', meta: 'Chat' + (c.p ? ' · ' + proj(c.p).name : ''), secs: sectionsOf(c) }, id); }
      else { var r = docById(ctx); download(r.name, r, id); }
    }
    else if (act === 'upload') picker.click();
    else if (act === 'browse') {
      if (dlg.open) dlg.close();
      S.browse = true; S.q = '';
      if (S.pane === 'off') { S.pane = 'on'; draw(); } else drawPane();
      refocus('.pane-search .input'); say('Pick papers to add to the project’s context');
    }
  });

  function saveDoc(chatId, pid) {
    var c = CHATS[chatId];
    var r = { id: 'd' + (++seq), p: pid, kind: 'doc', name: c.t.replace(/\?$/, ''), d: 'Today', by: 'MA', from: chatId, secs: sectionsOf(c) };
    DOCS.unshift(r);
    draw(); bottom();
    say('Saved to the artifacts of ' + proj(pid).name);
    refocus('.pj-saved[data-id="' + r.id + '"]');
  }

  /* ── sharing ─────────────────────────────────────────────────────────────── */
  function sharePanel(p) {
    if (!p) {
      return '<div class="pop-h"><b>Share this chat</b><p>To work on it together, start it in a shared project.</p></div>' + access('c:' + S.chat, false) +
        '<div class="pop-foot"><button class="act" type="button" data-pop="copy">' + g('link') + 'Copy link</button></div>';
    }
    var roles = ['Can edit', 'Can view'];
    return '<div class="pop-h"><b>Share ' + esc(p.name) + '</b><p>People you add can open its chats, artifacts, context and memory. Editors can also add context and start chats.</p></div>' +
      '<form class="pop-invite" novalidate><input class="input" type="email" name="email" placeholder="Email address" aria-label="Email address" autocomplete="off">' +
        '<select class="input" name="role" aria-label="Role for the invitation">' + roles.map(function (r) { return '<option>' + r + '</option>'; }).join('') + '</select>' +
        '<button class="btn tint sm" type="submit">Invite</button></form>' +
      '<p class="pop-err" hidden>Enter an email address, such as name@organisation.org.</p>' +
      '<span class="menu-l">People with access</span><ul class="pop-people">' +
      p.members.map(function (m, i) {
        var right = m.role === 'Owner' ? ''
          : '<select class="input" data-member="' + i + '" aria-label="Role for ' + esc(m.name) + '">' + roles.concat(['Remove']).map(function (r) { return '<option' + (r === m.role ? ' selected' : '') + '>' + r + '</option>'; }).join('') + '</select>';
        return '<li>' + avatar(m.i) + '<span><b>' + esc(m.name) + '</b><small>' + (m.pending ? 'Invited, not yet joined' : m.role === 'Owner' ? 'Owner' : esc(m.email)) + '</small></span>' + right + '</li>';
      }).join('') + '</ul>' + access('p:' + p.id, true) +
      '<div class="pop-foot"><button class="act" type="button" data-pop="copy">' + g('link') + 'Copy link</button></div>';
  }
  /* 21 · F GENERAL ACCESS, after Claude's and Google's: who the link opens
     for. Public is view only and needs no account, and the panel says so. */
  var ACCESS = { people: ['Only people with access', 'Only the people listed can open the link.'], org: ['Your organisation', 'Anyone at your organisation with the link can read it.'], public: ['Anyone with the link', 'Public. Anyone with the link can read it without signing in. They cannot edit or reply.'] };
  function access(key, people) {
    var v = S.access[key] || (people ? 'people' : 'org');
    return '<span class="menu-l">General access</span><div class="pop-access' + (v === 'public' ? ' is-public' : '') + '">' + g(v === 'public' ? 'globe' : 'users') +
      '<span><select class="input" data-access="' + key + '" aria-label="Who the link opens for">' + Object.keys(ACCESS).filter(function (k) { return people || k !== 'people'; }).map(function (k) { return '<option value="' + k + '"' + (k === v ? ' selected' : '') + '>' + ACCESS[k][0] + '</option>'; }).join('') + '</select>' +
      '<small>' + ACCESS[v][1] + '</small></span></div>';
  }
  function refreshShare(p) { panel.innerHTML = sharePanel(p); place(panel, opener); var t = app.querySelector('.app-tools'); if (t) drawMain(); drawRail(); }
  panel.addEventListener('submit', function (e) {
    e.preventDefault();
    var p = current(), f = e.target, email = f.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { panel.querySelector('.pop-err').hidden = false; f.email.focus(); return; }
    var name = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    var initials = name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
    p.members.push({ i: initials, name: name, email: email, role: f.role.value, pending: true });
    PEOPLE[initials] = PEOPLE[initials] || name;
    say('Invited ' + email);
    refreshShare(p);
    var input = panel.querySelector('input[name="email"]'); if (input) input.focus();
  });
  panel.addEventListener('change', function (e) {
    var sel = e.target.closest('[data-member]'); if (!sel) return;
    var p = current(), m = p.members[+sel.dataset.member];
    if (sel.value === 'Remove') { p.members.splice(+sel.dataset.member, 1); say(m.name + ' removed'); }
    else { m.role = sel.value; say(m.name + ': ' + sel.value.toLowerCase()); }
    refreshShare(p);
  });
  panel.addEventListener('change', function (e) {
    var a = e.target.closest('[data-access]'); if (!a) return;
    S.access[a.dataset.access] = a.value; panel.innerHTML = sharePanel(current()); place(panel, opener);
    var f = panel.querySelector('[data-access]'); if (f) f.focus();
    say(ACCESS[a.value][1]);
  });
  panel.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pop="copy"]'); if (!b) return;
    try { navigator.clipboard.writeText(location.href.split('#')[0] + '#app'); } catch (_) {}
    b.innerHTML = g('check') + 'Link copied'; say('Link copied');
  });

  /* ── context: upload, drop, note, pick ─────────────────────────────────────
     One modal dialog serves a project's context, memory, instructions and
     notes, after Claude's. The file picker lives inside it, because a modal
     makes everything outside it inert. */
  var dlg = document.createElement('dialog');
  dlg.className = 'dlg'; dlg.setAttribute('aria-labelledby', 'dlg-t');
  dlg.innerHTML = '<div class="dlg-in"></div>';
  document.body.appendChild(dlg);
  var dlgIn = dlg.firstChild, D = { view: null, opts: {}, q: '', sel: null };
  var attachPicker = document.createElement('input');
  attachPicker.type = 'file'; attachPicker.multiple = true; attachPicker.hidden = true;
  app.appendChild(attachPicker);
  attachPicker.addEventListener('change', function () {
    [].forEach.call(attachPicker.files, function (f) { S.attach.push(f.name); });
    attachPicker.value = ''; drawMain(); refocus('.composer .ci'); say('File attached');
  });
  var picker = document.createElement('input');
  picker.type = 'file'; picker.multiple = true; picker.hidden = true;
  picker.accept = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md';
  dlg.appendChild(picker);
  picker.addEventListener('change', function () { addFiles(picker.files); picker.value = ''; });

  function showDlg(view, opts) {
    D.view = view; D.opts = opts || {}; D.q = ''; D.sel = null; D.type = D.opts.here ? 'here' : 'all'; D.i = 0;
    renderDlg();
    if (view === 'search') findDraw();
    if (!dlg.open) dlg.showModal();
    var f = dlgIn.querySelector('[autofocus]') || dlgIn.querySelector('h2');
    if (f) { if (f.tagName === 'H2') f.setAttribute('tabindex', '-1'); f.focus(); }
  }
  function renderDlg() { dlg.setAttribute('data-view', D.view); dlgIn.innerHTML = DLG[D.view](current()); }
  function back() { if (D.opts.back) showDlg('context'); else dlg.close(); }
  function dlgHead(title, n, tools) {
    return '<header class="dlg-h"><h2 id="dlg-t">' + title + '</h2>' + (n !== undefined ? '<span class="pj-n">' + n + '</span>' : '') + '<span class="spacer"></span>' + (tools || '') +
      '<button class="icon-btn" type="button" data-d="close" aria-label="Close">' + g('x') + '</button></header>';
  }
  function byWhom(x) { return (x.by === 'MA' ? 'You' : esc(personName(x.by))) + ' &middot; ' + x.d; }
  function ctxRow(x) {
    var on = D.sel && D.sel.indexOf(x.id) > -1, name = ctxName(x), s = x.type === 'paper' && LIB[x.ref];
    var mark = s ? '<span class="tm' + (s.tier === 3 ? ' t3' : '') + '" aria-hidden="true">' + TM[s.tier] + '</span>' : g(x.type === 'text' ? 'sticky-note' : upGlyph(x.ext));
    var kind = x.status === 'reading' ? 'Reading…' : s ? esc(s.k) : x.type === 'text' ? 'Note' : x.ext + ' &middot; ' + x.size;
    return '<tr' + (on ? ' class="is-sel"' : '') + '>' +
      (D.sel ? '<td class="ctx-c"><input type="checkbox" data-tick="' + x.id + '"' + (on ? ' checked' : '') + ' aria-label="Select ' + esc(name) + '"></td>' : '') +
      '<th scope="row"><span class="ctx-n">' + mark + (x.type === 'text' || x.file ? '<button type="button" data-d="open" data-id="' + x.id + '">' + esc(name) + '</button>' : '<span>' + esc(name) + '</span>') + '</span></th>' +
      '<td class="pj-m">' + kind + '</td><td class="ctx-by">' + byWhom(x) + '</td>' +
      '<td class="ctx-x"><button class="icon-btn" type="button" data-d="remove" data-id="' + x.id + '" aria-label="Remove ' + esc(name) + '">' + g('x') + '</button></td></tr>';
  }
  /* ── the finder ─────────────────────────────────────────────────────────────
     After Claude's search (Matt, 2026-10-15): one field over everything you
     have made, a tray to narrow it to a type, the recent chats and two actions
     before anything is typed, and a quoted line from inside a chat when the
     words are there rather than in its title. Arrow keys move, Enter opens,
     Cmd K opens it from anywhere in the console. Papers are not in it: the
     library has its own search. */
  var FIND_TYPES = [['all', 'All'], ['chat', 'Chats'], ['project', 'Projects'], ['doc', 'Artifacts']];
  function plain(t) { return t.replace(/\s*\{\w+\}/g, '').replace(/<[^>]+>/g, ''); }
  function chatText(c) {
    var t = [];
    c.msgs.forEach(function (m) {
      if (m.u) t.push(m.u);
      if (m.a) { t = t.concat(m.a.intro || []); (m.a.parts || []).forEach(function (x) { t.push(x.h.replace(/^\d+\.\s*/, '') + '.'); t = t.concat(x.ps); }); }
    });
    return plain(t.join(' '));
  }
  function hilite(text, q) {
    var i = q ? text.toLowerCase().indexOf(q) : -1;
    return i < 0 ? esc(text) : esc(text.slice(0, i)) + '<b>' + esc(text.slice(i, i + q.length)) + '</b>' + esc(text.slice(i + q.length));
  }
  /* A few words either side of the match, cut at word ends, as Claude does. */
  function snippet(text, q) {
    var i = text.toLowerCase().indexOf(q); if (i < 0) return '';
    var a = text.lastIndexOf(' ', Math.max(0, i - 18)), z = text.indexOf(' ', i + q.length + 24);
    var cut = text.slice(a < 0 ? 0 : a + 1, z < 0 ? text.length : z);
    return '&ldquo;' + hilite(cut, q) + '&rdquo;';
  }
  function findHits() {
    var q = D.q.trim().toLowerCase(), type = D.type, out = [];
    /* 21 · E: opened from a thread's toolbar, the finder searches that
       thread first, message by message, as Claude's does; the tray widens it. */
    if (type === 'here') {
      var c = CHATS[S.chat];
      if (q) c.msgs.forEach(function (m, i) {
        var t = m.u || (m.a ? plain([].concat(m.a.intro || [], [].concat.apply([], (m.a.parts || []).map(function (x) { return [x.h].concat(x.ps); }))).join(' ')) : '');
        var sn = snippet(t, q); if (sn) out.push({ k: 'msg', id: String(i), t: m.u ? 'You' : 'Peace Intel', sn: sn, m: m.at, w: 0 });
      });
      return out;
    }
    function want(k) { return type === 'all' || type === k; }
    if (want('chat')) ORDER.forEach(function (id) {
      var c = CHATS[id], inT = c.t.toLowerCase().indexOf(q) > -1, sn = !q || inT ? '' : snippet(chatText(c), q);
      if (!q || inT || sn) out.push({ k: 'chat', id: id, t: c.t, sn: sn, m: c.d, w: inT ? 0 : 1 });
    });
    if (want('project')) PROJECTS.forEach(function (p) {
      var inT = p.name.toLowerCase().indexOf(q) > -1, sn = !q || inT ? '' : snippet(p.purpose || '', q);
      if (!q || inT || sn) out.push({ k: 'project', id: p.id, t: p.name, sn: sn, m: plural(chatsOf(p.id).length, 'chat'), w: inT ? 0 : 1 });
    });
    if (want('doc')) DOCS.forEach(function (r) {
      if (!q || r.name.toLowerCase().indexOf(q) > -1) out.push({ k: 'doc', id: r.id, t: r.name, sn: '', m: proj(r.p).name, w: 0 });
    });
    out.sort(function (a, b) { return a.w - b.w; });
    return out;
  }
  var FIND_GLYPH = { msg: 'search', chat: 'message-square', project: 'folder', doc: 'file-text', act: 'plus' };
  function findRow(x, n) {
    return '<button class="find-row" type="button" role="option" tabindex="-1" id="fo-' + n + '" aria-selected="' + (n === D.i) + '" data-d="find-go" data-k="' + x.k + '" data-id="' + esc(x.id) + '">' +
      g(FIND_GLYPH[x.k]) + '<span class="find-t"><span>' + (x.k === 'act' ? x.t : hilite(x.t, D.q.trim().toLowerCase())) + '</span>' + (x.sn ? '<span class="find-sn">' + x.sn + '</span>' : '') + '</span>' +
      (x.m ? '<span class="pj-m">' + esc(x.m) + '</span>' : '') + '</button>';
  }
  function findList() {
    var q = D.q.trim(), hits = findHits(), groups = [], n = 0;
    if (D.type === 'here') {
      D.max = hits.length - 1; if (D.i > D.max) D.i = 0;
      if (!q) return '<p class="pj-empty">Search the words of &ldquo;' + esc(CHATS[S.chat].t) + '&rdquo;.</p>';
      if (!hits.length) return '<p class="pj-empty">Nothing in this chat matches &ldquo;' + esc(q) + '&rdquo;. Try All.</p>';
      return '<div class="find-g" role="group" aria-label="In this chat"><span class="eyebrow eb-4 faint" aria-hidden="true">' + hits.length + (hits.length === 1 ? ' match' : ' matches') + '</span>' + hits.map(function (x) { return findRow(x, n++); }).join('') + '</div>';
    }
    if (!q && D.type === 'all') groups.push(['Recent', hits.filter(function (x) { return x.k === 'chat'; }).slice(0, 6)]);
    else if (D.type === 'all') FIND_TYPES.slice(1).forEach(function (t) { groups.push([t[1], hits.filter(function (x) { return x.k === t[0]; })]); });
    else groups.push([null, hits]);
    var acts = q ? [{ k: 'act', id: 'ask', t: 'Ask Peace Intel &ldquo;' + esc(q) + '&rdquo; in a new chat' }]
      : [{ k: 'act', id: 'new-chat', t: 'New chat' }, { k: 'act', id: 'new-project', t: 'New project' }];
    if (D.type === 'all' || q) groups.push(['Actions', acts]);
    var rows = [].concat.apply([], groups.map(function (gr) { return gr[1]; }));
    D.max = rows.length - 1; if (D.i > D.max) D.i = 0;
    var found = hits.length || !q;
    return (found ? '' : '<p class="pj-empty">Nothing you have made matches &ldquo;' + esc(q) + '&rdquo;.</p>') +
      groups.filter(function (gr) { return gr[1].length; }).map(function (gr) {
        return '<div class="find-g" role="group"' + (gr[0] ? ' aria-label="' + gr[0] + '"><span class="eyebrow eb-4 faint" aria-hidden="true">' + gr[0] + '</span>' : '>') +
          gr[1].map(function (x) { return findRow(x, n++); }).join('') + '</div>';
      }).join('');
  }
  function findDraw() {
    var l = dlgIn.querySelector('.find-l'); l.innerHTML = findList();
    var inp = dlgIn.querySelector('.find-q'); inp.setAttribute('aria-activedescendant', 'fo-' + D.i);
    var on = l.querySelector('[aria-selected="true"]'); if (on) on.scrollIntoView({ block: 'nearest' });
  }
  /* C2 · D (Rev 61): a match in this chat is marked by its words, not by a
     box round the message. Every occurrence in the message joins one
     highlight, 'find', which the CSS paints in --hl-find; the first is
     scrolled to the middle of the thread. A browser without the highlight
     API gets the same mark as mark.find-hl. Production should also match
     across inline formatting, which this mock does not. */
  function markFind(el, q) {
    var api = window.CSS && CSS.highlights && window.Highlight;
    if (api) CSS.highlights.delete('find');
    [].forEach.call(main.querySelectorAll('mark.find-hl'), function (m) { var p = m.parentNode; p.replaceChild(document.createTextNode(m.textContent), m); p.normalize(); });
    if (!el) return;
    var box = el.querySelector('.body, .bubble') || el, ql = q.toLowerCase(), ranges = [], w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT), n;
    while (ql && (n = w.nextNode())) {
      var t = n.nodeValue.toLowerCase(), i = 0;
      while ((i = t.indexOf(ql, i)) > -1) { var r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + ql.length); ranges.push(r); i += ql.length; }
    }
    if (!ranges.length) { el.scrollIntoView({ block: 'start' }); return; }
    var first = ranges[0].startContainer.parentElement;
    if (api) { var h = new Highlight(); ranges.forEach(function (r) { h.add(r); }); CSS.highlights.set('find', h); }
    else ranges.slice().reverse().forEach(function (r) { var m = document.createElement('mark'); m.className = 'find-hl'; r.surroundContents(m); });
    first.scrollIntoView({ block: 'center' });
  }
  function findGo(k, id) {
    var q = D.q.trim();
    dlg.close();
    if (k === 'msg') {
      markFind(main.querySelectorAll('.chat .msg')[+id], q);
    }
    else if (k === 'chat') go('chat', id);
    else if (k === 'project') go('project', id);
    else if (k === 'doc') go('doc', id);
    else if (id === 'new-chat' || id === 'ask') { S.view = 'chat'; S.chat = null; S.q = ''; S.browse = false; draw(); var ta = main.querySelector('.composer .ci'); if (id === 'ask') ta.value = q; ta.focus(); }
    else if (id === 'new-project') app.querySelector('[data-act="new-project"]').click();
  }
  var DLG = {
    search: function () {
      return '<h2 id="dlg-t" class="sr">Search</h2><div class="find-h">' + g('search') +
          '<input class="find-q" type="text" name="findq" placeholder="Search" aria-label="Search chats, projects and artifacts" role="combobox" aria-expanded="true" aria-controls="find-l" aria-autocomplete="list" autocomplete="off" autofocus>' +
          '<button class="icon-btn" type="button" data-d="close" aria-label="Close">' + g('x') + '</button></div>' +
        '<div class="find-tray"><div class="seg mono" aria-label="Show">' + (D.opts.here ? [['here', 'This chat']] : []).concat(FIND_TYPES).map(function (t) { return '<button type="button" data-d="find-type" data-v="' + t[0] + '" aria-pressed="' + (D.type === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div></div>' +
        '<div class="dlg-scroll find-l" id="find-l" role="listbox" aria-label="Results"></div>' +
        '<footer class="dlg-f find-keys" aria-hidden="true"><span><kbd>Esc</kbd>Close</span><span><kbd>&uarr;</kbd><kbd>&darr;</kbd>Move</span><span><kbd>&crarr;</kbd>Open</span><span class="spacer"></span><span><kbd>&#8984;</kbd><kbd>K</kbd>Search from anywhere</span></footer>';
    },
    /* After Claude's context dialog: every item in a table you can search,
       open, select and remove, and what the project still has room for. */
    context: function (p) {
      var q = D.q.trim().toLowerCase(), cap = capacity(p);
      var rows = p.ctx.filter(function (x) { return !q || (ctxName(x) + ' ' + (x.ext || x.type === 'paper' && LIB[x.ref].a || '')).toLowerCase().indexOf(q) > -1; });
      return dlgHead('Context', p.ctx.length,
          '<label class="dlg-search">' + g('search') + '<input class="input" type="search" name="ctxq" placeholder="Search" aria-label="Search the context" value="' + esc(D.q) + '"></label>' +
          '<button class="act' + (D.sel ? ' on' : '') + '" type="button" data-d="select" aria-pressed="' + !!D.sel + '"' + (p.ctx.length ? '' : ' disabled') + '>Select</button>' + addMenuBtn()) +
        '<p class="dlg-sub">What every chat in <b>' + esc(p.name) + '</b> draws on, beside the library. Drop files here to add them.</p>' +
        '<div class="dlg-scroll">' + (rows.length
          ? '<table class="ctx-t"><thead><tr>' + (D.sel ? '<td class="ctx-c"></td>' : '') + '<th scope="col">Name</th><th scope="col">Kind</th><th scope="col">Added</th><td class="ctx-x"></td></tr></thead><tbody>' + rows.map(ctxRow).join('') + '</tbody></table>'
          : '<p class="pj-empty">' + (q ? 'Nothing here matches “' + esc(D.q.trim()) + '”.' : 'Nothing yet. Upload files, add a note or pick papers from the library, all from Add.') + '</p>') + '</div>' +
        '<footer class="dlg-f">' + (D.sel
          ? '<span><b>' + D.sel.length + '</b> selected</span><span class="spacer"></span><button class="act" type="button" data-d="select">Cancel</button><button class="act" type="button" data-d="remove-sel"' + (D.sel.length ? '' : ' disabled') + '>Remove</button>'
          : '<span class="dlg-cap" style="--cap:' + cap + '%" aria-hidden="true"><span></span></span><span>' + plural(p.ctx.length, 'item') + ' &middot; ' + cap + '% of the project’s capacity used</span>') + '</footer>';
    },
    /* After Claude's project memory and ChatGPT's project-only memory: what
       has been kept, each item forgettable, and whether the project may use
       memory from outside it. A shared project may not. */
    memory: function (p) {
      var shared = p.members.length > 1, all = p.memAll && !shared;
      return dlgHead('Memory', p.mem.length) +
        '<p class="dlg-sub">What Peace Intel has kept from this project’s chats, so a new chat starts where the last one left off. Everyone with access to the project shares it.</p>' +
        '<div class="dlg-scroll">' + (p.mem.length
          ? '<ul class="mem-l">' + p.mem.map(function (m) { return '<li><div><b>' + esc(m.t) + '</b><p>' + esc(m.s) + '</p></div><span class="pj-m">' + m.d + '</span><button class="icon-btn" type="button" data-d="forget" data-id="' + m.id + '" aria-label="Forget ' + esc(m.t) + '">' + g('x') + '</button></li>'; }).join('') + '</ul>'
          : '<p class="pj-empty">Nothing yet. As you work, Peace Intel keeps what matters here: who the work is for, decisions taken, the terms you use.</p>') + '</div>' +
        '<footer class="dlg-f mem-f"><div><b>Draws on</b><p>' + (shared ? 'A shared project keeps to its own memory, so nothing from your other chats reaches the people you share it with.' : 'This project’s memory alone, or what Peace Intel remembers from all your chats.') + '</p></div>' +
          '<div class="seg mono" aria-label="Memory draws on">' + [['0', 'This project'], ['1', 'All my chats']].map(function (o) {
            return '<button type="button" data-d="mem-scope" data-v="' + o[0] + '" aria-pressed="' + (all === (o[0] === '1')) + '"' + (shared ? ' disabled' : '') + '>' + o[1] + '</button>'; }).join('') + '</div></footer>';
    },
    /* A project's name and what it is for, edited together (Claude's Edit
       details), so a rename and a new purpose are one decision. */
    details: function (p) {
      return dlgHead('Edit details') + '<form class="dlg-form" data-form="details" novalidate>' +
        '<label class="field dlg-field"><span>Name</span><input class="input" name="n" value="' + esc(p.name) + '" autocomplete="off" autofocus></label>' +
        '<label class="field dlg-field"><span>Description</span><textarea class="input" name="d" rows="5" placeholder="What the project is for, in a sentence">' + esc(p.purpose) + '</textarea></label>' +
        '<p class="pop-err" hidden>Give the project a name.</p>' +
        '<footer class="dlg-f"><span class="spacer"></span><button class="act" type="button" data-d="cancel">Cancel</button><button class="btn tint sm" type="submit">Save</button></footer></form>';
    },
    instr: function (p) {
      return dlgHead('Instructions') + '<form class="dlg-form" data-form="instr" novalidate>' +
        '<p class="dlg-sub">Every chat in <b>' + esc(p.name) + '</b> follows these: who the answers are for, what to lead with, what to flag.</p>' +
        '<label class="field dlg-field"><textarea class="input" name="instr" rows="8" aria-label="Instructions for every chat in this project" placeholder="Write for a programme committee. Lead with effect sizes, and flag any study older than 2015." autofocus>' + esc(p.instr) + '</textarea></label>' +
        '<footer class="dlg-f"><span class="spacer"></span><button class="act" type="button" data-d="cancel">Cancel</button><button class="btn tint sm" type="submit">Save</button></footer></form>';
    },
    note: function (p) {
      var x = D.opts.id ? p.ctx.filter(function (c) { return c.id === D.opts.id; })[0] : null;
      return dlgHead(x ? 'Edit note' : 'Add a note') + '<form class="dlg-form" data-form="note" novalidate>' +
        '<p class="dlg-sub">For what is not in a file: a brief, the board’s questions, the terms the project uses. It joins the context of <b>' + esc(p.name) + '</b>.</p>' +
        '<label class="field dlg-field"><span>Title</span><input class="input" name="t" value="' + (x ? esc(x.name) : '') + '" placeholder="Name the note" autocomplete="off" autofocus></label>' +
        '<label class="field dlg-field"><span>Text</span><textarea class="input" name="b" rows="8" placeholder="Type or paste">' + (x ? esc(x.text) : '') + '</textarea></label>' +
        '<p class="pop-err" hidden>Give the note a title and some text.</p>' +
        '<footer class="dlg-f"><span class="spacer"></span><button class="act" type="button" data-d="cancel">Cancel</button><button class="btn tint sm" type="submit">' + (x ? 'Save' : 'Add to context') + '</button></footer></form>';
    }
  };
  function openAdd(btn) {
    open(menu, btn, item('upload', '', 'upload', 'Upload files', 'PDF, Word, Excel, CSV') + item('note', '', 'sticky-note', 'Add a note', '') + item('browse', '', 'book-open', 'From the library', ''));
  }
  /* Whatever shows the project's panel redraws it: the pane, and the copy of
     it in the page for when the pane is away. */
  function syncPanel() {
    if (S.view !== 'project') return;
    var aside = main.querySelector('.pj-aside');
    if (aside) aside.innerHTML = projectPanel(current());
    if (!S.browse) drawPane();
  }
  function removeCtx(p, ids) {
    p.ctx = p.ctx.filter(function (x) { return ids.indexOf(x.id) < 0; });
    say('Removed ' + plural(ids.length, 'item') + ' from the context');
    renderDlg(); syncPanel();
    refocus('.dlg [data-d="select"]');
  }

  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) { dlg.close(); return; }
    var b = e.target.closest('[data-d], [data-act="add-menu"]'); if (!b) return;
    var p = current(), d = b.dataset.d, id = b.dataset.id;
    if (b.dataset.act === 'add-menu') openAdd(b);
    else if (d === 'close') dlg.close();
    else if (d === 'find-go') findGo(b.dataset.k, id);
    else if (d === 'find-type') {
      D.type = b.dataset.v; D.i = 0;
      [].forEach.call(dlgIn.querySelectorAll('[data-d="find-type"]'), function (t) { t.setAttribute('aria-pressed', String(t === b)); });
      findDraw(); dlgIn.querySelector('.find-q').focus();
    }
    else if (d === 'cancel') back();
    else if (d === 'select') { D.sel = D.sel ? null : []; renderDlg(); refocus('.dlg [data-d="select"]'); }
    else if (d === 'remove') removeCtx(p, [id]);
    else if (d === 'remove-sel') { var sel = D.sel; D.sel = null; removeCtx(p, sel); }
    else if (d === 'open') {
      var x = p.ctx.filter(function (c) { return c.id === id; })[0];
      if (x.type === 'text') showDlg('note', { id: id, back: true });
      else if (x.file) window.open(URL.createObjectURL(x.file), '_blank', 'noopener');
    }
    else if (d === 'forget') {
      var m = p.mem.filter(function (k) { return k.id === id; })[0];
      p.mem = p.mem.filter(function (k) { return k.id !== id; });
      renderDlg(); syncPanel(); say('Forgotten: ' + m.t); refocus('.dlg h2');
    }
    else if (d === 'mem-scope') { p.memAll = b.dataset.v === '1'; renderDlg(); syncPanel(); refocus('.dlg [data-d="mem-scope"][data-v="' + b.dataset.v + '"]'); }
  });
  dlg.addEventListener('change', function (e) {
    var t = e.target.closest('[data-tick]'); if (!t) return;
    var id = t.dataset.tick, at = D.sel.indexOf(id);
    if (at > -1) D.sel.splice(at, 1); else D.sel.push(id);
    renderDlg(); refocus('.dlg [data-tick="' + id + '"]');
  });
  dlg.addEventListener('input', function (e) {
    if (e.target.name === 'findq') { D.q = e.target.value; D.i = 0; findDraw(); return; }
    if (e.target.name !== 'ctxq') return;
    D.q = e.target.value; renderDlg();
    var i = dlgIn.querySelector('[name="ctxq"]'); i.focus(); i.setSelectionRange(i.value.length, i.value.length);
  });
  dlg.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, p = current();
    if (f.dataset.form === 'details') {
      var n = f.n.value.trim();
      if (!n) { f.querySelector('.pop-err').hidden = false; f.n.focus(); return; }
      p.name = n; p.purpose = f.d.value.trim();
      dlg.close(); draw(); say('Project details saved'); refocus('[data-act="details"]');
      return;
    }
    if (f.dataset.form === 'instr') { p.instr = f.instr.value.trim(); say('Instructions saved'); dlg.close(); syncPanel(); }
    else if (f.dataset.form === 'note') {
      var t = f.t.value.trim(), b = f.b.value.trim();
      if (!t || !b) { f.querySelector('.pop-err').hidden = false; (t ? f.b : f.t).focus(); return; }
      var x = D.opts.id && p.ctx.filter(function (c) { return c.id === D.opts.id; })[0];
      if (x) { x.name = t; x.text = b; say('Note saved'); }
      else { p.ctx.unshift({ id: 'n' + (++seq), type: 'text', name: t, text: b, by: 'MA', d: 'Today' }); say('Note added to the context of ' + p.name); }
      syncPanel(); back();
    }
  });
  dlg.addEventListener('keydown', function (e) {
    if (D.view !== 'search') return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      D.i = e.key === 'ArrowDown' ? (D.i >= D.max ? 0 : D.i + 1) : (D.i <= 0 ? D.max : D.i - 1);
      [].forEach.call(dlgIn.querySelectorAll('.find-row'), function (r, n) { r.setAttribute('aria-selected', String(n === D.i)); });
      dlgIn.querySelector('.find-q').setAttribute('aria-activedescendant', 'fo-' + D.i);
      var on = dlgIn.querySelector('#fo-' + D.i); if (on) on.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && e.target.matches('.find-q')) {
      e.preventDefault();
      var r = dlgIn.querySelector('#fo-' + D.i); if (r) findGo(r.dataset.k, r.dataset.id);
    }
  });
  /* Cmd K (Ctrl K) opens the finder: anywhere on the console's own page, and
     on the reference only from inside the console, so the plate does not
     take the shortcut from the rest of the page. */
  document.addEventListener('keydown', function (e) {
    if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k' || dlg.open) return;
    if (app.parentNode !== document.body && !app.contains(e.target)) return;
    e.preventDefault(); showDlg('search');
  });
  /* The close event arrives a task later, so a dialog closed and reopened in
     one go must not lose the view it reopened with. */
  dlg.addEventListener('close', function () { if (!dlg.open) { D.view = null; dlg.removeAttribute('data-view'); } });

  function size(n) { return n > 1e6 ? (n / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1e3)) + ' KB'; }
  function addFiles(files) {
    var p = current(); if (!p || !files || !files.length) return;
    var added = [].slice.call(files).map(function (f) {
      return { id: 'u' + (++seq), type: 'file', name: f.name, ext: (f.name.split('.').pop() || 'FILE').toUpperCase(), size: size(f.size), by: 'MA', d: 'Today', status: 'reading', file: f };
    });
    p.ctx = added.concat(p.ctx);
    if (D.view === 'context') renderDlg();
    syncPanel();
    say('Adding ' + plural(added.length, 'file') + ' to the context of ' + p.name);
    setTimeout(function () {
      added.forEach(function (u) { u.status = 'ready'; });
      if (D.view === 'context') renderDlg();
      syncPanel();
      say(plural(added.length, 'file') + ' ready in the context of ' + p.name);
    }, 1200);
  }
  /* Files held over the console, or over the context dialog, join the
     project's context. */
  var depth = 0;
  function hasFiles(e) { return e.dataTransfer && [].indexOf.call(e.dataTransfer.types || [], 'Files') > -1; }
  app.addEventListener('dragenter', function (e) {
    if (!hasFiles(e) || !current()) return;
    e.preventDefault(); depth++;
    app.setAttribute('data-drop', '');
  });
  app.addEventListener('dragover', function (e) { if (hasFiles(e) && current()) e.preventDefault(); });
  app.addEventListener('dragleave', function () {
    if (app.hasAttribute('data-drop') && --depth <= 0) { depth = 0; app.removeAttribute('data-drop'); }
  });
  app.addEventListener('drop', function (e) {
    if (!current() || !hasFiles(e)) return;
    e.preventDefault(); depth = 0; app.removeAttribute('data-drop');
    addFiles(e.dataTransfer.files);
  });
  dlg.addEventListener('dragover', function (e) { if (D.view === 'context' && hasFiles(e)) e.preventDefault(); });
  dlg.addEventListener('drop', function (e) { if (D.view === 'context' && hasFiles(e)) { e.preventDefault(); addFiles(e.dataTransfer.files); } });

  /* ── renaming in place ── */
  function rename(host, value, label, commit) {
    var input = document.createElement('input');
    input.className = 'pj-rename'; input.value = value; input.setAttribute('aria-label', label);
    host.textContent = ''; host.appendChild(input);
    input.focus(); input.select();
    var done = false;
    function finish(keep) {
      if (done) return; done = true;
      var v = input.value.trim();
      commit(keep && v && v !== value ? v : null);
    }
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); finish(true); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(false); }
    });
    input.addEventListener('blur', function () { finish(true); });
  }
  function renameDoc(id) {
    var r = docById(id), host;
    var card = main.querySelector('.pj-doc[data-rid="' + id + '"]');
    if (card && S.view === 'project') {
      var btn = card.querySelector('.pj-doc-open'), div = document.createElement('div');
      div.className = 'pj-doc-open'; div.innerHTML = btn.innerHTML; btn.replaceWith(div);
      host = div.querySelector('.pj-doc-t');
    } else host = main.querySelector('.dp-title');
    if (!host) return;
    rename(host, r.name, 'Artifact name', function (v) {
      if (v) { r.name = v; say('Renamed to ' + v); }
      draw();
      refocus((S.view === 'project' ? '.pj-doc[data-rid="' + id + '"] ' : '') + '[data-act="rename-doc"][data-id="' + id + '"]');
    });
  }
  /* ── downloads ─────────────────────────────────────────────────────────────
     Real files made from the document, named after its current name, so a
     rename shows in the file. A written document's citations become numbered
     references with a list of sources at the end; a spreadsheet downloads as
     its table. */
  function flatten(secs) {
    var seen = [];
    function cite(t) {
      return t.replace(/\s*\{(\w+)\}/g, function (_, id) {
        var n = seen.indexOf(id); if (n < 0) { seen.push(id); n = seen.length - 1; }
        return ' [' + (n + 1) + ']';
      }).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
    }
    var out = secs.map(function (s) { return { h: s.h, ps: s.ps.map(cite) }; });
    var refs = seen.map(function (id, i) { var s = LIB[id]; return (i + 1) + '. ' + [s.a, s.y, s.t].filter(Boolean).join('. ') + '.'; });
    return { secs: out, refs: refs };
  }
  function slug(s) { return s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'document'; }
  function metaOf(r) { return r.meta || (KINDS[r.kind].name + ' · ' + proj(r.p).name + ' · ' + r.d); }
  function download(name, r, fmt) {
    var blob;
    if (r.kind === 'sheet') {
      var all = [r.sheet.cols].concat(r.sheet.rows);
      if (fmt === 'csv') blob = new Blob([all.map(function (row) { return row.map(function (v) { return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','); }).join('\r\n') + '\r\n'], { type: 'text/csv' });
      else blob = new Blob(['﻿<html><head><meta charset="utf-8"></head><body><table>' + all.map(function (row, i) { return '<tr>' + row.map(function (v) { return (i ? '<td>' : '<th>') + esc(v) + (i ? '</td>' : '</th>'); }).join('') + '</tr>'; }).join('') + '</table></body></html>'], { type: 'application/vnd.ms-excel' });
    } else {
      var f = flatten(r.secs), meta = metaOf(r);
      if (fmt === 'md') {
        blob = new Blob(['# ' + name + '\n\n_' + meta + '_\n\n' + f.secs.map(function (s, i) { return '## ' + nn(i + 1) + ' ' + s.h + '\n\n' + s.ps.join('\n\n'); }).join('\n\n') +
          (f.refs.length ? '\n\n## Sources\n\n' + f.refs.join('\n') : '') + '\n'], { type: 'text/markdown' });
      } else if (fmt === 'doc') {
        var h = '<html><head><meta charset="utf-8"><title>' + esc(name) + '</title></head><body style="font-family:Georgia,serif">' +
          '<h1>' + esc(name) + '</h1><p><i>' + esc(meta) + '</i></p>' +
          f.secs.map(function (s, i) { return '<h2>' + nn(i + 1) + ' ' + esc(s.h) + '</h2>' + s.ps.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join(''); }).join('') +
          (f.refs.length ? '<h2>Sources</h2>' + f.refs.map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('') : '') + '</body></html>';
        blob = new Blob(['﻿' + h], { type: 'application/msword' });
      } else blob = new Blob([pdf(name, meta, f)], { type: 'application/pdf' });
    }
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = slug(name) + FMT[fmt][1];
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    say('Downloaded ' + a.download);
  }

  /* A plain, valid PDF: A4, Times for headings and Helvetica for text, the
     two standard faces every reader has, so nothing is embedded. */
  var WIN = { '‘': 145, '’': 146, '“': 147, '”': 148, '•': 149, '–': 150, '—': 151, '…': 133 };
  function pdfStr(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i), c = s.charCodeAt(i);
      if (ch === '\\' || ch === '(' || ch === ')') out += '\\' + ch;
      else if (c >= 32 && c < 127) out += ch;
      else out += '\\' + ('00' + (WIN[ch] || (c < 256 ? c : 63)).toString(8)).slice(-3);
    }
    return out;
  }
  function wrap(text, max) {
    var lines = [], line = '';
    text.split(/\s+/).forEach(function (word) {
      if ((line + ' ' + word).trim().length > max) { if (line) lines.push(line); line = word; }
      else line = (line + ' ' + word).trim();
    });
    if (line) lines.push(line);
    return lines;
  }
  function pdf(title, meta, f) {
    var W = 595, H = 842, M = 64, pages = [], ops = [], y = H - M;
    function page() { pages.push(ops.join('\n')); ops = []; y = H - M; }
    function put(text, sz, font, before) {
      y -= before || 0;
      wrap(text, Math.floor((W - 2 * M) / (sz * 0.5))).forEach(function (line) {
        if (y - sz * 1.45 < M) page();
        y -= sz * 1.45;
        ops.push('BT /' + font + ' ' + sz + ' Tf ' + M + ' ' + y.toFixed(1) + ' Td (' + pdfStr(line) + ') Tj ET');
      });
    }
    put(title, 22, 'F2', 0);
    put(meta, 9, 'F1', 6);
    f.secs.forEach(function (s, i) {
      put(nn(i + 1) + '   ' + s.h, 14, 'F2', 22);
      s.ps.forEach(function (p) { put(p, 10.5, 'F1', 6); });
    });
    if (f.refs.length) { put('Sources', 14, 'F2', 22); f.refs.forEach(function (x) { put(x, 9, 'F1', 3); }); }
    page();
    var objs = [null, '<< /Type /Catalog /Pages 2 0 R >>', null,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>'];
    var kids = [];
    pages.forEach(function (content) {
      var n = objs.length;
      kids.push(n + ' 0 R');
      objs.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ' + (n + 1) + ' 0 R >>');
      objs.push('<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream');
    });
    objs[2] = '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + kids.length + ' >>';
    var out = '%PDF-1.4\n', at = [];
    for (var i = 1; i < objs.length; i++) { at[i] = out.length; out += i + ' 0 obj\n' + objs[i] + '\nendobj\n'; }
    var xref = out.length;
    out += 'xref\n0 ' + objs.length + '\n0000000000 65535 f \n';
    for (i = 1; i < objs.length; i++) out += ('0000000000' + at[i]).slice(-10) + ' 00000 n \n';
    return out + 'trailer\n<< /Size ' + objs.length + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
  }
  window.PIProto = { pdf: pdf, flatten: flatten };

  /* ── what every button does ─────────────────────────────────────────────── */
  function lightCites(e, on) {
    var r = e.target.closest && e.target.closest('.evi-row'); if (!r || (e.relatedTarget && r.contains(e.relatedTarget))) return;
    var msg = r.closest('.msg') || app;
    [].forEach.call(msg.querySelectorAll('.cite[data-id="' + r.dataset.id + '"]'), function (c) { c.classList.toggle('lit', on); });
  }
  app.addEventListener('mouseover', function (e) { lightCites(e, true); });
  app.addEventListener('mouseout', function (e) { lightCites(e, false); });
  app.addEventListener('focusin', function (e) { lightCites(e, true); });
  app.addEventListener('focusout', function (e) { lightCites(e, false); });
  app.addEventListener('click', function (e) {
    var tray = e.target.closest('[data-tray] button');
    if (tray) {
      var box = tray.parentNode, key = box.dataset.tray;
      S[key] = tray.dataset.v;
      [].forEach.call(box.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', String(b === tray)); });
      if (key === 'mode') [].forEach.call(app.querySelectorAll('.cb-mode span'), function (x) { x.textContent = modeName(); });
      if (key === 'sort') drawList();
      if (key === 'tab') [].forEach.call(main.querySelectorAll('[data-tab]'), function (t) { t.hidden = t.dataset.tab !== S.tab; });
      return;
    }
    var b = e.target.closest('[data-act]'); if (!b || !app.contains(b)) return;
    var act = b.dataset.act, id = b.dataset.id, p;
    if (act === 'chat') go('chat', id);
    else if (act === 'project') go('project', id);
    else if (act === 'doc') go('doc', id);
    else if (act === 'artifacts') {
      go('project', id, 'artifacts');
      var tabs = main.querySelector('.pj-tabs'), sc = main.querySelector('.app-scroll');
      if (tabs && sc) sc.scrollTop += tabs.getBoundingClientRect().top - sc.getBoundingClientRect().top - 16;
      refocus('.pj-tab:not([hidden]) .pj-doc-open');
    }
    else if (act === 'find') showDlg('search', { here: !!b.closest('.app-tools') && S.view === 'chat' && !!S.chat && CHATS[S.chat].msgs.length > 0 });
    else if (act === 'drawer-pane' && S.drawer === 'pane') closeDrawer();
    else if (act === 'drawer-rail' || act === 'drawer-pane') {
      S.drawer = act.slice(7); if (S.drawer === 'pane') { S.src = null; S.reader = false; } draw(); refocus('.app-' + S.drawer + ' .pane-head .icon-btn:last-child'); }
    else if (act === 'scope') { S.scope = S.scope === 'all' ? 'mine' : 'all'; drawRail(); refocus('[data-act="scope"]'); say(S.scope === 'all' ? 'Showing every user’s chats' : 'Showing your chats'); }
    else if (act === 'attach') attachPicker.click();
    else if (act === 'unattach') { S.attach.splice(+id, 1); drawMain(); refocus('[data-act="attach"]'); }
    else if (act === 'copy-cite') { try { navigator.clipboard.writeText(b.closest('.msg').querySelector('.body').innerText); } catch (_) {} say('Answer copied with its citations'); }
    else if (act === 'fold') { var fk = S.chat + ':' + id.split(':')[0], fw = id.split(':')[1]; S.fold[fk] = S.fold[fk] === fw ? '' : fw; drawMain(); refocus('[data-act="fold"][data-id="' + id + '"]'); }
    else if (act === 'vote') { var k = S.chat + ':' + id.split(':')[0], v = id.split(':')[1]; S.vote[k] = S.vote[k] === v ? '' : v; drawMain(); refocus('[data-act="vote"][data-id="' + id + '"]'); say(S.vote[k] ? 'Thanks for the feedback' : 'Feedback removed'); }
    else if (act === 'wrap-up' && S.reflect[S.chat] && !S.reflect[S.chat].sent) { delete S.reflect[S.chat]; drawMain(); refocus('[data-act="wrap-up"]'); }
    else if (act === 'wrap-up') { S.reflect[S.chat] = {}; drawMain(); var sc2 = main.querySelector('.reflect'); if (sc2) { sc2.scrollIntoView({ block: 'start' }); sc2.querySelector('button').focus(); } }
    else if (act === 'rf' || act === 'rf-use') {
      var r = S.reflect[S.chat], t2 = main.querySelector('#rf-t'); if (t2) r.text = t2.value;
      if (act === 'rf') { var kv = id.split(':'); r[kv[0]] = r[kv[0]] === +kv[1] ? null : +kv[1]; }
      else { r.uses = r.uses || []; var ix = r.uses.indexOf(id); if (ix > -1) r.uses.splice(ix, 1); else r.uses.push(id); }
      var y = main.querySelector('.app-scroll').scrollTop; drawMain(); main.querySelector('.app-scroll').scrollTop = y; refocus('[data-act="' + act + '"][data-id="' + id + '"]');
    }
    else if (act === 'rf-skip') { delete S.reflect[S.chat]; drawMain(); refocus('[data-act="wrap-up"]'); }
    else if (act === 'rf-send') { S.reflect[S.chat].sent = true; drawMain(); say('Thanks. Your take on this session is saved.'); }
    else if (act === 'src') {
      S.src = id; S.reader = false; S.pane = 'on';
      if (narrow.matches && S.drawer !== 'pane') S.drawer = 'pane';
      draw(); refocus('.app-pane .pane-head .icon-btn');
    }
    else if (act === 'src-read') { S.reader = true; draw(); refocus('.app-pane .pane-head .icon-btn'); }
    else if (act === 'src-quick') { S.reader = false; draw(); refocus('[data-act="src-read"]'); }
    else if (act === 'src-off') {
      var was2 = S.src; S.src = null; S.reader = false;
      draw(); refocus(S.drawer ? '.app-pane .pane-search .input' : '.lib-item[data-id="' + was2 + '"]');
    }
    else if (act === 'src-pdf') say('The PDF would download here');
    else if (act === 'drawer-off') closeDrawer();
    else if (act === 'project-chat') { go('project', id); refocus('.composer .ci'); }
    else if (act === 'new-chat') { S.view = 'chat'; S.chat = null; S.q = ''; S.browse = false; draw(); refocus('.composer .ci'); }
    else if (act === 'new-project') {
      p = { id: 'p' + (++seq), name: 'Untitled project', ctx: [], mem: [], memAll: false, members: [{ i: 'MA', name: 'You', role: 'Owner' }], purpose: '', instr: '' };
      PROJECTS.unshift(p); go('project', p.id); showDlg('details');
    }
    else if (act === 'details') showDlg('details');
    else if (act === 'rename-doc') renameDoc(id);
    else if (act === 'instr' || act === 'context' || act === 'memory') showDlg(act);
    else if (act === 'util-menu') {
      menu.dataset.ctx = 'util';
      open(menu, b, item('util', 'find', 'search', 'Search this chat', '') + item('util', 'share', 'users', 'Share', '') + item('util', 'export', 'download', 'Export', ''));
    }
    else if (act === 'export') exportMenu(b);
    else if (act === 'download') {
      var r = docById(id), k = KINDS[r.kind];
      if (k.formats.length === 1) download(r.name, r, k.formats[0]);
      else { menu.dataset.ctx = id; open(menu, b, '<span class="menu-l">Download as</span>' + formatItems(r.kind)); }
    }
    else if (act === 'add-menu') openAdd(b);
    else if (act === 'mode-menu') {
      menu.dataset.ctx = 'mode';
      open(menu, b, '<span class="menu-l">Answer</span>' + MODES.map(function (m) { return item('mode', m[0], S.mode === m[0] ? 'check' : 'blank', m[1], ''); }).join('') +
        '<hr>' + item('spoken-toggle', '', 'volume-2', 'Spoken replies', S.spoken ? 'On' : 'Off'));
    }
    else if (act === 'browse-done') { S.browse = false; S.q = ''; syncPanel(); refocus('.app-pane [data-act="add-menu"]'); }
    else if (act === 'pick') {
      p = current(); var had = papersOf(p).indexOf(id) > -1;
      if (had) { p.ctx = p.ctx.filter(function (x) { return x.ref !== id; }); say('Removed from the context of ' + p.name); }
      else { p.ctx.unshift(paper(id, 'MA', 'Today')); say('Added to the context of ' + p.name); }
      drawList(); syncPanel();
      refocus('[data-act="pick"][data-id="' + id + '"]');
    }
    else if (act === 'share') open(panel, b, sharePanel(current()));
    else if (act === 'send') send(b.closest('.composer').querySelector('.ci'));
    else if (act === 'spoken') { S.spoken = !S.spoken; b.setAttribute('aria-pressed', String(S.spoken)); }
    else if (act === 'dictate') {
      /* Drawn, not wired to speech: the button says it is listening and the
         field says how to stop. */
      S.dictate = !S.dictate; b.setAttribute('aria-pressed', String(S.dictate));
      var ta = b.closest('.composer').querySelector('.ci');
      ta.placeholder = S.dictate ? LISTENING : ta.dataset.ph;
      say(S.dictate ? 'Listening' : 'Stopped listening');
    }
    else if ((act === 'rail-off' || act === 'pane-off') && S.drawer) closeDrawer();
    else if (act === 'rail-off') { S.rail = 'off'; draw(); refocus('[data-act="rail-on"]'); }
    else if (act === 'rail-on') { S.rail = 'on'; draw(); refocus('[data-act="rail-off"]'); }
    else if (act === 'pane-off') { S.pane = 'off'; draw(); refocus('[data-act="pane-on"]'); }
    else if (act === 'pane-on') { S.pane = 'on'; draw(); refocus('[data-act="pane-off"]'); }
    else if (act === 'expand') { var both = expanded(); S.rail = S.pane = both ? 'on' : 'off'; draw(); refocus('[data-act="expand"]'); }
  });
  app.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && S.drawer) { e.preventDefault(); scrim.click(); return; }
    if (e.key === 'Enter' && !e.shiftKey && e.target.matches('.composer .ci')) { e.preventDefault(); send(e.target); }
  });
  app.addEventListener('input', function (e) {
    if (e.target.matches('.pane-search .input')) { S.q = e.target.value; drawList(); }
  });
  app.addEventListener('dblclick', function (e) {
    if (e.target.closest('.dp-title')) renameDoc(S.doc);
    else if (e.target.closest('.pj-name')) showDlg('details');
  });

  /* ?src=berman&reader=1 opens on a paper, for the reference's frames (Pl. 22). */
  (function () {
    var q = new URLSearchParams(location.search), id = q.get('src');
    if (id && LIB[id]) { S.src = id; S.reader = q.get('reader') === '1'; if (narrow.matches) S.drawer = 'pane'; }
  })();
  draw();
})();
