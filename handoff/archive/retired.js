/* ═══════════════════════════════════════════════════════════════════════════
   PEACE INTEL · RETIRED RUNTIME
   Loaded after system.js by archive.html and the explore-*.html drafts only.
   The registration loop was cut from system.js on 2026-10-09 with .reg and
   .mount--corners, the two marks it drove; .mo-settle lost its place in the
   entry observer the same day. Both are restored here so the archive renders,
   and so are the four entry primitives and the stage driver cut on 2026-10-15.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  /* ── scroll-linked registration ────────────────────────────────────────── */
  /* One rAF loop writes --reg (0 -> 1 -> 0) on every .reg element from its
     distance to the reading position. Everything visual is driven off that
     single custom property in CSS, so this stays cheap and there is exactly one
     place to change the feel. */
  (function registration() {
    /* Both marks ride this loop as of 2026-09-26: .reg is the event and
       .mount--corners is the whisper, and they are the same gesture at two
       volumes. One property, one loop, two stylesheets reading it. */
    var els = Array.prototype.slice.call(document.querySelectorAll('.reg, .mount--corners'));
    if (!els.length) return;

    /* THE FULL-WIDTH GUARD.

       A bracket aimed at the corner of an element that runs edge to edge is
       aimed at the corner of the window. There is no gap for it to close and
       nothing for it to pick out, so it stops reading as an instrument settling
       on a subject and starts reading as a frame around the browser — or, at
       the top edge, as a progress bar, which is the same mistake the accent
       hairline made before it was cut.

       The rule is a proportion rather than a pixel count: a registered element
       needs visible air on both sides of it. Ninety percent of the viewport is
       the threshold, which passes a centred content column at any desktop width
       and fails a band.

       ONLY ABOVE 900px, and that gate is not a fudge. Below a tablet the page
       IS one column, so every block is full width and the proportion stops
       meaning anything — the first version of this warned on every registered
       element on a phone, which is a check that trains you to ignore it. The
       marks still work down there because --reg-travel drops to 4px and they
       converge inside the 16px gutter rather than off-screen. So this is a
       desktop-layout rule, and the narrow case is handled in CSS.

       It warns rather than suppressing, because suppressing would mean a page
       that looks correct locally and has a silently dead effect in production,
       and because the author is the one who can fix it. Development aid only:
       one rect read per element, once. */
    if (window.console && console.warn && window.innerWidth >= 900) {
      setTimeout(function () {
        els.forEach(function (el) {
          var w = el.getBoundingClientRect().width;
          if (el.classList.contains('reg') && w > window.innerWidth * 0.9) {
            console.warn('[PI] .reg on a full-width element (' + Math.round(w) + 'px of ' +
              window.innerWidth + 'px). Registration needs air on both sides — put it on a ' +
              'figure, card or column, not a band. See --reg-* in tokens.css.', el);
          }
          /* THE HAIRLINE GUARD. An elbow drawn inside a border is the same line
             twice, a few pixels apart, and the eye reads it as a rendering
             fault rather than as a mark. A card marked with corners gives up
             its own edge in CSS; anything else that carries one is the author's
             to resolve, so this says so rather than silently restyling it.
             One computed-style read per element, once, in development. */
          if (el.classList.contains('mount--corners')) {
            var cs = getComputedStyle(el);
            var bw = parseFloat(cs.borderTopWidth) || 0;
            var bc = cs.borderTopColor || '';
            var visible = bw > 0 && bc.indexOf('rgba(0, 0, 0, 0)') === -1 && !/,\s*0\)$/.test(bc);
            if (visible) {
              console.warn('[PI] .mount--corners on an element that already draws a border. ' +
                'The elbow and the edge are the same line twice — use one or the other. ' +
                'See --cnr-* in tokens.css.', el);
            }
          }
        });
      }, 300);
    }

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      els.forEach(function (el) { el.style.setProperty('--reg', '1'); el.classList.add('locked'); });
      return;
    }
    // smoothstep so the lock eases in rather than tracking linearly
    function ease(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }

    /* THE HOLD. The mark acquires, then stays locked for 30% of the element's
       pass through the viewport, then releases. Without the plateau the lock
       was a moment you could scroll straight past: it peaked for one frame and
       was already fading. A third of the pass is long enough that the reader
       registers it as a state rather than as a flicker, and short enough that
       it still reads as something that happened rather than as decoration.

       Trapezoid, not a curve: rise over 35%, hold 30%, fall over 35%. */
    var HOLD = 0.30, EDGE = (1 - HOLD) / 2;
    function envelope(t) {
      if (t <= 0 || t >= 1) return 0;
      if (t < EDGE) return ease(t / EDGE);
      if (t < EDGE + HOLD) return 1;
      return ease((1 - t) / EDGE);
    }
    var queued = false;
    function frame() {
      queued = false;
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) {
          if (el._reg !== 0) { el.style.setProperty('--reg', '0'); el.classList.remove('locked'); el._reg = 0; }
          return;
        }
        /* t is how far through its own pass the element is: 0 as its top
           touches the bottom of the viewport, 1 as its bottom leaves the top. */
        var travel = vh + r.height;
        var t = (vh - r.top) / travel;
        var p = envelope(t);
        if (el._reg === undefined || Math.abs(p - el._reg) > 0.004 || (p === 1) !== el.classList.contains('locked')) {
          el.style.setProperty('--reg', p.toFixed(3));
          el.classList.toggle('locked', p === 1);
          el._reg = p;
        }
      });
    }
    function onScroll() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    frame();
  })();



  /* The retired entry primitives, fired once on entry the way system.js fires
     .mo-deal: .mo-settle (cut 2026-10-09) and resolve, develop, focus and
     rule (cut 2026-10-15). */
  (function settle() {
    var els = [].slice.call(document.querySelectorAll('.mo-settle, .mo-resolve, .mo-develop, .mo-focus, .mo-rule'));
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.25 });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { el.classList.add('is-in'); }); }, 2500);
  })();

  /* Moved from system.js on 2026-10-15 with the stage itself. */
  /* ── THE STAGE · a pinned field with the page travelling over it ─────────
     Only job is to publish the stage's own scroll progress as --sg. Everything
     visual reads that: the panels parallax off it in CSS, and the grid canvas
     inside takes its build from it rather than from its own rect, which never
     moves while the background is pinned. */
  (function stage() {
    var els = [].slice.call(document.querySelectorAll('.stage'));
    if (!els.length) return;
    var queued = false;
    function frame() {
      queued = false;
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect(), tot = r.height - vh;
        var p = tot > 0 ? -r.top / tot : 0;
        p = p < 0 ? 0 : (p > 1 ? 1 : p);
        if (el._sg === undefined || Math.abs(p - el._sg) > 0.002) {
          el.style.setProperty('--sg', p.toFixed(4));
          el._sg = p;
        }
      });
    }
    function onScroll() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    frame();
  })();
})();

/* ── GRADIENT FIELDS (removed from the system 2026-10-15, with Pl. 12) ──────
   The dithered field driver, moved out of system.js so the system no longer
   ships it; the archive's specimens still run on it. Its helpers are copied
   from system.js, where the rest of the runtime still uses them. */
(function () {
  'use strict';
  var root = document.documentElement;
  function rgb(str) {
    str = String(str);
    var m = str.match(/rgba?\(([^)]+)\)/);
    if (m) {
      var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    }
    /* Chrome returns color-mix() results as color(srgb r g b / a) with 0-1
       channels. Without this branch every color-mix token silently measured as
       null, which made the surface read as white and produced phantom failures. */
    var c = str.match(/color\(\s*srgb\s+([^)]+)\)/i);
    if (c) {
      var parts = c[1].split('/');
      var ch = parts[0].trim().split(/\s+/).map(parseFloat);
      var a = parts[1] !== undefined ? parseFloat(parts[1].replace('%', '')) : 1;
      if (parts[1] !== undefined && parts[1].indexOf('%') > -1) a /= 100;
      if (ch.length < 3 || ch.some(isNaN)) return null;
      return { r: ch[0] * 255, g: ch[1] * 255, b: ch[2] * 255, a: isNaN(a) ? 1 : a };
    }
    return null;
  }
  var OFF = (new URLSearchParams(location.search).get('off') || '').split(',');
  function offq(n) { return OFF.indexOf(n) > -1; }
  var BAYER8 = (function () {
    var m = [[0]];
    for (var n = 1; n < 8; n *= 2) {
      var s = m.length, o = [], y, x;
      for (y = 0; y < s * 2; y++) o.push(new Array(s * 2));
      for (y = 0; y < s; y++) for (x = 0; x < s; x++) {
        var v = m[y][x] * 4;
        o[y][x] = v; o[y][x + s] = v + 2; o[y + s][x] = v + 3; o[y + s][x + s] = v + 1;
      }
      m = o;
    }
    return m;
  })();
  function cvar(el, name) {
    var probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
    probe.style.color = 'var(' + name + ')';
    el.appendChild(probe);
    var c = rgb(getComputedStyle(probe).color);
    el.removeChild(probe);
    return c;
  }
  function h2(x, y) { var s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
  function lattice(ox, oy, sx, sy) {
    var x0 = Math.floor(ox), y0 = Math.floor(oy);
    var w = Math.floor(ox + sx) + 2 - x0, h = Math.floor(oy + sy) + 2 - y0;
    var T = new Float32Array(w * h);
    for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) T[j * w + i] = h2(x0 + i, y0 + j);
    return { T: T, w: w, x0: x0, y0: y0 };
  }
  function sample(L, x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = xi - L.x0, b = yi - L.y0, w = L.w, T = L.T, o = b * w + a;
    return (T[o] * (1 - u) + T[o + 1] * u) * (1 - v)
         + (T[o + w] * (1 - u) + T[o + w + 1] * u) * v;
  }

  /* ── EXPLORATION A · dithered gradient field ─────────────────────────────
     Ordered dithering against a FIVE-STOP PALETTE rather than against the RGB
     cube. Quantising per channel would snap the paper base to pure white and
     the field would stop being the brand's; dithering between named token
     colours means every pixel in the result is one of five brand values. */
  (function fields() {
    var nodes = [].slice.call(document.querySelectorAll('[data-gfield]'));
    if (!nodes.length) return;
    /* One canvas pixel per N CSS px, read from --dither-cell so the fields, the
       clips, the rendered grid and the motion primitives are one grain rather
       than four things that look similar. Two as of 2026-09-25, down from 3,
       which is the dove and the magnifying glass at the size those are drawn.

       Read once from the root rather than per element: it is a brand constant,
       and a per-instance --gfield-cell still overrides it below. */
    var CELL = parseFloat(getComputedStyle(root).getPropertyValue('--dither-cell')) || 2;

    function ramp(el) {
      var out = [];
      for (var i = 0; i < 5; i++) out.push(cvar(el, '--f-' + i) || { r: 255, g: 255, b: 255, a: 1 });
      return out;
    }
    /* Two primitives. A BLOB is heat around a point and a BAND is heat along a
       line; between them they cover every mood without a special case. Bands
       are what the blob-only version could not do, and the reason every field
       used to look like the same field. */
    function blob(u, v, cx, cy, rx, ry) {
      var dx = (u - cx) / rx, dy = (v - cy) / ry, d2 = dx * dx + dy * dy;
      return d2 >= 1 ? 0 : (1 - d2);
    }
    function band(u, v, ax, ay, nx, ny, w) {
      var d = Math.abs((u - ax) * nx + (v - ay) * ny) / w;
      return d >= 1 ? 0 : (1 - d * d);
    }

    /* THE MOODS, as data rather than as branches.

       Each entry is a list of shapes. 'b' is [cx, cy, rx, ry, amp] and 'l' is
       [ax, ay, nx, ny, width, amp] where nx/ny is the normal of the line. Five
       of them, in two families: blooms radiate from an off-canvas anchor, edges
       hold against one boundary.

       Nine were built. The four cut — ridge, shore, cleave, verge — all used
       the band primitive to put a hard directional line through the frame,
       which is graphic rather than ethereal. The primitive stays, because the
       cut was about register rather than about the tool, and they are in
       archive/rev3.

       Adding a mood is adding a row. That is the point — the variety has to be
       cheap to extend or it will not get extended. */
    var MOODS = {
      /* blooms */
      ember:  [['b', .06, 1.16, .82, .66, 1.05], ['b', .96, -.18, .46, .78, .52], ['b', .64, .30, 1.40, 1.00, .40]],
      soot:   [['b', .92, -.06, .40, .56, 1.00], ['b', .18, 1.08, 1.00, .82, .60], ['b', .50, .40, 1.34, .94, .28]],
      dawn:   [['b', .14, 1.04, .92, .70, .52], ['b', .72, .18, 1.24, .92, .32]],
      /* edges */
      hollow: [['b', .34, .48, 1.30, 1.20, 1.15], ['b', .34, .48, .74, .84, -1.35], ['b', .96, .04, .40, .40, .30]],
      drift:  [['b', .12, .10, .36, .42, .78], ['b', .92, .96, .46, .50, .95], ['b', .50, .50, 1.36, 1.02, .20]]
    };
    /* dawn-neutral is gone, 2026-09-25. It was dawn's shape against a ramp with
       the accent removed, and when the accent came out of every ramp it stopped
       being a variant of anything. Kept as an alias so a page mid-edit still
       paints rather than falling through to a blank canvas. */
    MOODS['dawn-neutral'] = MOODS.dawn;

    function heatOf(list, u, v) {
      var h = 0;
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        h += (m[0] === 'b' ? blob(u, v, m[1], m[2], m[3], m[4]) * m[5]
                           : band(u, v, m[1], m[2], m[3], m[4], m[5]) * m[6]);
      }
      return h;
    }
    function paint(el, T) {
      var cv = el.querySelector('.gfield-c'); if (!cv) return;
      var w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
      T = T || 0;

      var shapes = MOODS[el.getAttribute('data-mood')] || MOODS.ember;
      /* Each mood drifts on its own phase, so two live fields on one page never
         breathe in step. The seed is the mood name, which keeps it stable across
         reloads. This has to be declared BEFORE the drift that reads it: var
         hoisting made seed undefined there, the phase became NaN, and every
         pixel indexed the palette at NaN. */
      var seed = 0, nm = el.getAttribute('data-mood') || 'ember';
      for (var q = 0; q < nm.length; q++) seed += nm.charCodeAt(q);

      /* Slow orbital drift plus a travelling noise lattice. Periods run 27 to 57
         seconds and none of them share a factor, so the field never visibly
         repeats. Faster than this stops reading as weather. */
      var ph = seed * 0.37;
      var dx = Math.sin(T * 0.21 + ph) * 0.10, dy = Math.cos(T * 0.17 + ph) * 0.07;
      var nzx = T * 0.055, nzy = T * 0.037;
      var L1 = lattice(nzx, nzy, 5.5, 4.1);
      var L2 = lattice(nzx * 2, nzy * 2, 17, 13);
      var cell = parseFloat(getComputedStyle(el).getPropertyValue('--gfield-cell')) || CELL;
      /* THE WHITE FLOOR (2026-10-09). Heat under --gfield-floor x the frame's peak
         is paper; the rest is stretched so the peak keeps its tone. Read per paint
         like the cell, so a plate can set it per instance. */
      var floor = parseFloat(getComputedStyle(el).getPropertyValue('--gfield-floor'));
      if (!(floor >= 0 && floor < 1)) floor = 0;

      /* PIXEL BUDGET. A live field repaints every pixel ten times a second, so
         its cost is area, not size on screen. At cell 3 a full-height field is
         about 90,000 pixels a frame and that was enough to lock the tab. The
         cell grows until the field is under budget rather than the field being
         forbidden at that size, so the knob stays a preference and the budget
         is the guardrail. A still field is not repainted, so it is exempt.

         The budget went from 26,000 to 140,000 when the cell came down to 2.
         Halving the cell quadruples the area, so the old number bumped every
         live field straight back up to 3 and silently undid the change: the
         band-scale field, the only one that is actually on a page, was
         rendering at a cell of 3 while the token said 2. 60,000 and 110,000
         were both tried and both still clamped it.

         The number is set from the case rather than guessed. A live field at
         band scale in the widest content column is 1040 x 486, which is 126,360
         pixels at cell 2, and 140,000 clears it with room. Measured with the
         whole page live: 120fps and no long tasks at all.

         A 100vh live field is 324,000 at cell 2 and still steps up, which is
         the case the guardrail exists for. A still field is never repainted, so
         it is exempt and the stage keeps the declared cell. */
      /* Live is the default now, so the budget is keyed off the still opt-out
         rather than off a class that no longer exists. It was reading
         .gfield--live, which nothing has carried since fields became live by
         default — the guard was simply never firing. */
      if (!el.classList.contains('gfield--still')) {
        while ((w / cell) * (h / cell) > 140000) cell += 1;
      }
      var W = Math.max(1, Math.ceil(w / cell)), H = Math.max(1, Math.ceil(h / cell));
      cv.width = W; cv.height = H;
      var ctx = cv.getContext('2d', { willReadFrequently: true });
      var img = ctx.createImageData(W, H), d = img.data, pal = ramp(el);
      /* Two passes since the white floor (2026-10-09): heat is gathered first so
         the floor can sit at a share of THIS frame's peak. A fixed floor emptied
         the quiet moods, whose peak barely clears it; a relative one leaves every
         mood its own darkest tone and a comparable share of paper. */
      var HT = new Float32Array(W * H), peak = 0;
      for (var y = 0; y < H; y++) {
        for (var x = 0; x < W; x++) {
          /* The drift is applied to the sample point rather than to every
             shape's centre, which is the same motion and one subtraction
             instead of one per shape. */
          var u = x / W - dx, v = y / H - dy, heat = heatOf(shapes, u, v);
          var su = x / W, sv = y / H;   // noise samples the grid, not the drifted point
          heat += (sample(L1, su * 5.5 + nzx, sv * 4.1 + nzy) - .5) * .22;      // the mud
          heat += (sample(L2, su * 17 + nzx * 2, sv * 13 + nzy * 2) - .5) * .07; // the tooth
          heat = heat < 0 ? 0 : (heat > 1 ? 1 : heat);
          HT[y * W + x] = heat; if (heat > peak) peak = heat;
        }
      }
      var cut = floor * peak;
      for (var y = 0; y < H; y++) {
        for (var x = 0; x < W; x++) {
          var heat = HT[y * W + x];
          /* Under the cut is paper. Above it the range is stretched so the peak
             stays exactly where it was: less heavy, same darkness. */
          heat = heat <= cut ? 0 : (heat - cut) / (1 - floor);
          /* Gamma. Without it the canvas version ran hotter than the CSS one and
             the plate compared intensities instead of finishes. 1.5 matches the
             distribution of the three-stop gradient closely enough to A/B. */
          heat = heat * Math.sqrt(heat);   // x^1.5, without the pow call

          var s = heat * (pal.length - 1);
          var i0 = Math.floor(s), f = s - i0;
          /* Guard the index rather than trusting the maths. A NaN anywhere
             upstream sails through a > comparison and then indexes the palette
             at NaN, which throws inside the pixel loop and leaves the canvas
             blank with one line in the console. Cheap to prevent, expensive to
             find. */
          if (!(i0 >= 0)) { i0 = 0; f = 0; }
          if (i0 > pal.length - 2) { i0 = pal.length - 2; f = 1; }
          var t = (BAYER8[y & 7][x & 7] + 0.5) / 64;
          var c = pal[f > t ? i0 + 1 : i0];
          var o = (y * W + x) * 4;
          d[o] = c.r; d[o + 1] = c.g; d[o + 2] = c.b; d[o + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    }
    function all(T) { nodes.forEach(function (el) { paint(el, T === undefined ? (el._T || 0) : T); }); }
    all(0);
    var t = null;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { all(); }, 120); });

    /* EVERY FIELD IS LIVE, 2026-09-25. The opt-in inverted: a field moves unless
       it carries .gfield--still.

       A still field at the current ramp is three percent of ink spread across a
       band, which is not atmosphere, it is a slightly uneven sheet of paper.
       The movement is what makes the weight legible as weather rather than as a
       printing fault, and it is the only reason to spend a canvas on this at
       all. The two facts are the same decision: the ramp got quiet enough that
       the field HAD to move, and quiet enough that it safely CAN.

       Ten frames a second on purpose: a dithered image at 10fps is what the
       video assets look like, and at 60fps the dot pattern crawls and reads as
       noise rather than as weather. Only repaints what is on screen, and does
       not run at all under reduced motion — where a still field is correct,
       because then it is a fallback rather than a choice. */
    var live = offq('live') ? [] : nodes.filter(function (el) { return !el.classList.contains('gfield--still'); });
    if (live.length && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      var onScreen = new WeakSet();
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target); });
      }, { rootMargin: '10% 0px' });
      live.forEach(function (el) { io.observe(el); });
      var t0 = performance.now(), last = 0;
      (function tick(now) {
        requestAnimationFrame(tick);
        if (now - last < 100) return;      // 10fps
        last = now;
        var T = (now - t0) / 1000;
        live.forEach(function (el) { if (onScreen.has(el)) { el._T = T; paint(el, T); } });
      })(t0);
    }
  })();


  /* ── THE RENDERED LINE, retired from Pl. 16 on 2026-10-16 (Rev 25) ───────
     Line work J, K, R and X. Matt kept I, V and Z, none of them raster, so
     the driver left system.js; archive.html#lines-r25 still draws them. */
  function smooth(t) { t = t < 0 ? 0 : (t > 1 ? 1 : t); return t * t * (3 - 2 * t); }
  function vnoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return (h2(xi, yi) * (1 - u) + h2(xi + 1, yi) * u) * (1 - v)
         + (h2(xi, yi + 1) * (1 - u) + h2(xi + 1, yi + 1) * u) * v;
  }
  /* ── THE RENDERED LINE (.lw[data-lr]), Exploration, Pl. 16, 16 October ──
     Matt: "perhaps the line work could have a mask over it that makes it
     subtly evolve with raster edges." A line drawn as cells, two CSS pixels
     each (the pixel icons' cell at 50px), and thresholded against the same
     Bayer matrix the clips and the grid use, so its edge is the dither's own.
     Scroll-linked like the rendered grid, never looped: nothing moves while
     the reader is still. Four drawings, named by data-lr:

       dissolve  one row of cells, solid at the label, dithering out by the end
       develop   a core row that builds as the block arrives, with a fringe of
                 cells above and below that shifts as the page scrolls
       wedge     three rows, solid at the label, thinning to nothing
       draw      the line draws itself along its length as the block arrives,
                 its leading edge dithered

     The driver adds one canvas to each .lockup and each .rule-row item; the
     markup stays the same. Colour is --lr-ink, resolved through cvar. With
     reduced motion every line is drawn once, finished. */
  (function lineRender() {
    var hosts = [].slice.call(document.querySelectorAll('[data-lr]'));
    if (!hosts.length) return;
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var CELL = 2, ROWS = 3, items = [];
    hosts.forEach(function (host) {
      [].forEach.call(host.querySelectorAll('.lockup, .rule-row > *'), function (el) {
        var cv = document.createElement('canvas');
        cv.className = 'lr-c'; cv.setAttribute('aria-hidden', 'true');
        el.insertBefore(cv, el.firstChild);
        items.push({ el: el, cv: cv, host: host, mode: host.getAttribute('data-lr'), seed: items.length * 37.1 });
      });
    });
    /* One row of a Bayer matrix is a regular dash, so the matrix is mixed with
       a hash: the cells keep the dither's order and lose its stripes. */
    function thr(x, y) { return 0.55 * (BAYER8[y & 7][x & 7] + 0.5) / 64 + 0.45 * h2(x * 1.3, y * 7.7); }
    function density(it, cx, cy, cols, p, ph) {
      var u = cx / cols, core = cy === 1;
      switch (it.mode) {
        case 'dissolve':
          return core ? 1 - smooth((u - 0.3) / 0.7) : 0;
        case 'wedge':
          return 1 - Math.pow(u, 0.7) - (core ? 0 : 0.18);
        case 'draw':
          var head = p * 1.25 - u;
          return core ? smooth(head / 0.16) : (head > 0 && head < 0.12 ? 0.5 : 0);
        default: /* develop */
          var arrive = smooth((p * 1.5 - u * 0.35 - h2(cx + it.seed, cy) * 0.5) / 0.25);
          if (core) return arrive * 1.2;
          /* The fringe: sparse, in drifting clusters, so the edge frays a
             little where the noise is high and is clean everywhere else. */
          var f = vnoise(cx / 9 + ph * 0.8 + it.seed, cy * 3.1 + ph * 0.5);
          return arrive * (f - 0.6) * 0.8;
      }
    }
    function draw(it, p, ph) {
      var w = it.cv.clientWidth; if (!w) return;
      var dpr = Math.min(2, window.devicePixelRatio || 1), h = CELL * ROWS;
      if (it.cv.width !== Math.round(w * dpr)) { it.cv.width = Math.round(w * dpr); it.cv.height = Math.round(h * dpr); }
      if (!it.ink) it.ink = cvar(it.el, '--lr-ink');
      if (!it.ink) return;
      var ctx = it.cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgb(' + (it.ink.r | 0) + ',' + (it.ink.g | 0) + ',' + (it.ink.b | 0) + ')';
      ctx.globalAlpha = it.ink.a;
      var cols = Math.ceil(w / CELL);
      for (var cy = 0; cy < ROWS; cy++) for (var cx = 0; cx < cols; cx++) {
        if (density(it, cx, cy, cols, p, ph) > thr(cx, cy)) ctx.fillRect(cx * CELL, cy * CELL, CELL, CELL);
      }
      ctx.globalAlpha = 1;
    }
    var queued = false;
    function frame() {
      queued = false;
      var vh = window.innerHeight, ph = still ? 0 : window.scrollY / 260;
      items.forEach(function (it) {
        var r = it.el.getBoundingClientRect();
        if (r.bottom < -40 || r.top > vh + 40) return;
        /* The same arrival as the grid: from entering the bottom of the screen
           to well into it, so the line is finished before it is read. */
        var p = still ? 1 : smooth((vh - r.top) / (vh * 0.6));
        var key = it.mode === 'develop' ? p.toFixed(3) + ph.toFixed(2) : p.toFixed(3);
        if (it.mode === 'dissolve' || it.mode === 'wedge') key = 'static';
        if (it._key === key && it._w === it.cv.clientWidth) return;
        it._key = key; it._w = it.cv.clientWidth;
        draw(it, p, ph);
      });
    }
    function onScroll() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
    if (!still) window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { items.forEach(function (it) { it._key = null; }); onScroll(); });
    frame();
  })();

  /* ── RETIRED 16 OCT (Rev 34): Pl. 18's documentary options other than D6 ──
     The colour screen (18 · B) and every glitch preset (18 · C, D1 to D13 but
     D6, and 18 · A2 looped), so archive.html#documentary-r34 still runs them.
     The archived pictures carry [data-docglitch-r]; system.js keeps D6 alone. */
  function lum(c) {
    var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }
  /* ── THE DOCUMENTARY SCREEN ([data-docscreen]), Exploration, Pl. 18 ──────
     Matt, 16 October: "black and white documentary images that have a
     rasterized screen over them that lets the colours show through in an
     evolving and organic way." The photograph is drawn as the brand's
     monochrome dither, paper to ink, and the screen opens in patches where
     the photograph's own colour shows, cell by cell, until it is fully
     chromatic once the picture is in the frame. The patches are value
     noise, so they cluster and spread rather than scatter, and they drift and
     open further as the picture comes to the middle of the screen. Scroll-
     linked like the rendered grid: still while the reader is still. With
     reduced motion it is drawn once, in full colour.

     The source is a small colour master (about a third of its drawn width, so
     a source pixel lands near the 3px cell) and the canvas is upscaled hard. */
  (function docScreen() {
    if (offq('doc')) return;
    var nodes = [].slice.call(document.querySelectorAll('[data-docscreen]'));
    if (!nodes.length) return;
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function prep(el) {
      var im = el.querySelector('img'), cv = el.querySelector('canvas');
      if (!im || !cv || !im.complete || !im.naturalWidth) return false;
      var w = im.naturalWidth, h = im.naturalHeight;
      cv.width = w; cv.height = h;
      var ctx = cv.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(im, 0, 0);
      var src = ctx.getImageData(0, 0, w, h).data;
      var pal = [];
      for (var i = 0; i < 7; i++) { var c = cvar(el, '--v-' + i); if (c) pal.push(c); }
      if (pal.length !== 7) return false;
      pal.sort(function (a, b) { return lum(a) - lum(b); });
      /* The mono layer, computed once: luminance across the ramp, Bayer
         picking between neighbouring stops, as the clips are mapped. */
      var mono = new Uint8ClampedArray(src.length);
      for (var q = 0, px = 0; q < src.length; q += 4, px++) {
        var g = (src[q] * 0.299 + src[q + 1] * 0.587 + src[q + 2] * 0.114) / 255;
        var f = g * 6, k = Math.floor(f), fr = f - k;
        if (k > 5) { k = 5; fr = 1; }
        if (BAYER8[(px / w | 0) & 7][(px % w) & 7] / 64 < fr) k += 1;
        mono[q] = pal[k].r; mono[q + 1] = pal[k].g; mono[q + 2] = pal[k].b; mono[q + 3] = 255;
      }
      /* The colour layer is a raster too (Matt, 16 Oct: in full colour it
         "just looks low resolution"). Held back to about two thirds of its
         saturation, so the colour reads as a choice, and each channel
         quantised to four levels through the same Bayer matrix, so the
         screen's pattern runs through every tone. */
      var col = new Uint8ClampedArray(src.length), SAT = 0.62, L = 3;
      for (var c2 = 0, p2 = 0; c2 < src.length; c2 += 4, p2++) {
        var lm = src[c2] * 0.299 + src[c2 + 1] * 0.587 + src[c2 + 2] * 0.114;
        var th = (BAYER8[(p2 / w | 0) & 7][(p2 % w) & 7] + 0.5) / 64;
        for (var ch = 0; ch < 3; ch++) {
          var v = (lm + (src[c2 + ch] - lm) * SAT) / 255 * L;
          var lo = Math.floor(v); col[c2 + ch] = Math.min(L, lo + (v - lo > th ? 1 : 0)) / L * 255;
        }
        col[c2 + 3] = 255;
      }
      el._ds = { w: w, h: h, src: col, mono: mono, ctx: ctx, out: ctx.createImageData(w, h) };
      return true;
    }
    function draw(el, p, ph) {
      var d = el._ds; if (!d) return;
      var o = d.out.data, w = d.w, open = 0.08 + 1.04 * p;
      for (var y = 0, i = 0; y < d.h; y++) {
        /* Artifacts: now and then a band of rows slips sideways and takes
           its neighbour's pixels, like a misfed print. Which rows, and how
           far, drift with the scroll; most of the picture never slips. */
        var slip = vnoise(y / 5, ph * 1.6) > 0.8 ? Math.round((vnoise(y / 2 + 9, ph * 3) - 0.5) * 40) : 0;
        for (var x = 0; x < w; x++, i += 4) {
        var sx = Math.min(w - 1, Math.max(0, x + slip)), si = (y * w + sx) * 4;
        /* Two octaves: broad patches that drift with the scroll, and a finer
           one that frays their edges into cells. */
        var n = 0.72 * vnoise(x / 22 + ph * 0.5, y / 22 - ph * 0.3) + 0.28 * vnoise(x / 6 - ph, y / 6 + ph * 0.7);
        var t = 1 - open + (BAYER8[y & 7][x & 7] / 64 - 0.5) * 0.18;
        var s = n > t ? d.src : d.mono;
        o[i] = s[si]; o[i + 1] = s[si + 1]; o[i + 2] = s[si + 2]; o[i + 3] = 255;
        }
      }
      d.ctx.putImageData(d.out, 0, 0);
    }
    var queued = false;
    function frame() {
      queued = false;
      var vh = window.innerHeight;
      nodes.forEach(function (el) {
        if (!el._ds && !prep(el)) return;
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        /* Matt, 16 Oct: the picture becomes fully chromatic as it comes into
           the frame. Monochrome as it enters at the foot of the screen, the
           colour gathers in patches, and it is whole colour by the time its
           top reaches the upper third; scrolling back reverses it. */
        var p = still ? 1 : smooth((vh - r.top) / (vh * 0.75));
        var ph = still ? 0 : window.scrollY / 320;
        var key = p.toFixed(3) + ph.toFixed(3);
        if (el._k === key) return;
        el._k = key; draw(el, p, ph);
      });
    }
    function onScroll() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
    nodes.forEach(function (el) {
      var im = el.querySelector('img');
      if (im && !im.complete) im.addEventListener('load', function () { el._k = null; frame(); });
    });
    if (!still) window.addEventListener('scroll', onScroll, { passive: true });
    frame();
  })();

  /* ── THE GLITCH ([data-docglitch-r]), Exploration, Pl. 18 · C, 16 October ──
     Matt: 18 · B's slipping rows on the monochrome pictures, with no colour, and
     on their own rather than tied to the scroll. Now and then, while the
     picture is on screen, a short burst: bands of rows slip sideways and take
     their neighbours' pixels for a few frames, then the picture settles back
     exactly as it was. Most of the time nothing moves. Reduced motion, and
     ?off=glitch, leave the picture still. This is a timed effect, which the
     closed set of motion does not yet hold: it is proposed here, not adopted. */
  (function docGlitch() {
    
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    /* The variants (18 · D, Matt: "more consistent, yet subtle"). every and
       jit are the clock in ms (no jit is a metronome); n frames of fd ms per
       burst; amp is how far a row slips, in the master's pixels; dens is how
       few rows take part (higher is fewer). The mode says what slips. */
    var V = {
      base:   { mode: 'slip', every: 1800, jit: 4200, n: [4, 9], fd: 60, amp: 24, dens: 0.74 },
      d1:     { mode: 'slip', every: 3000, jit: 0, n: [3, 3], fd: 60, amp: 8, dens: 0.8 },
      d2:     { mode: 'slip', every: 2000, jit: 0, n: [2, 2], fd: 50, amp: 5, dens: 0.84 },
      d3:     { mode: 'slip', every: 4000, jit: 0, n: [7, 7], fd: 30, amp: 6, dens: 0.82 },
      d4:     { mode: 'line', every: 2500, jit: 0, n: [3, 3], fd: 60, amp: 10 },
      d5:     { mode: 'shear', every: 3500, jit: 0, n: [4, 4], fd: 60, amp: 12 },
      d6:     { mode: 'slip', every: 0, jit: 0, n: [1, 1], fd: 140, amp: 2, dens: 0.88 },
      d7:     { mode: 'scan', every: 4000, jit: 0, n: [12, 12], fd: 45, amp: 8 },
      d8:     { mode: 'echo', every: 3000, jit: 0, n: [3, 3], fd: 70, dens: 0.84 },
      d9:     { mode: 'interlace', every: 3000, jit: 0, n: [4, 4], fd: 60, amp: 3, dens: 0.6 },
      d10:    { mode: 'slip', every: 5000, jit: 0, n: [1, 1], fd: 90, amp: 20, dens: 0.8 },
      d11:    { mode: 'breath', every: 3000, jit: 0, n: [9, 9], fd: 50, amp: 10, dens: 0.78 },
      d12:    { mode: 'cells', every: 3000, jit: 0, n: [3, 3], fd: 70, dens: 0.86 },
      /* 18 · D13 (Matt: 18 · D12, constant, varying in intensity): the cells never
         stop swapping, and how many swap swells and ebbs on a slow wave,
         from a handful to about one in eight. */
      d13:    { mode: 'cells', every: 0, jit: 0, n: [1, 1], fd: 110, dens: 0.86, live: true },
      /* 18 · A2 LOOPED (Matt, 16 Oct): four expressions in turn, eight seconds
         each, so the picture says it four ways before it repeats: the
         metronome, the tear, the living cells, the breath. 32 seconds. */
      seq:    { seq: ['d1', 'd4', 'd13', 'd11'], dur: 8000 }
    };
    [].forEach.call(document.querySelectorAll('[data-docglitch-r]'), function (el) {
      var cv = el.querySelector('canvas'), seen = false, P0 = V[el.getAttribute('data-glitch-v') || 'base'] || V.base, P = P0.seq ? V[P0.seq[0]] : P0, t0 = Date.now();
      if (!cv) return;
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }).observe(el);
      else seen = true;
      /* Where pixel (x, y) takes its colour from in frame f: [sx, sy]. */
      function map(w, h, f, n, seed, band) {
        var ph = seed + f * 0.7, m = P.mode;
        var dens = P.live ? 0.985 - 0.13 * vnoise(performance.now() / 2600, 7.3) : P.dens;
        return function (x, y) {
          var slip = 0, sy = y;
          if (m === 'slip' || m === 'breath') {
            var a = m === 'breath' ? P.amp * Math.sin(Math.PI * (f + 1) / (n + 1)) : P.amp;
            if (vnoise(y / 5, ph * 1.6) > P.dens) slip = Math.round((vnoise(y / 2 + 9, ph * 3) - 0.5) * 2 * a);
          } else if (m === 'line') { if (y >= band && y < band + 2) slip = P.amp; }
          else if (m === 'shear') { if (y >= band && y < band + h * 0.08) slip = (seed > 50 ? 1 : -1) * P.amp; }
          else if (m === 'scan') { var b0 = Math.round(f / n * h); if (y >= b0 && y < b0 + 6) slip = Math.round((vnoise(y, ph) - 0.5) * 2 * P.amp); }
          else if (m === 'echo') { if (vnoise(y / 6, seed) > P.dens) sy = Math.max(0, y - (y % 6)); }
          else if (m === 'interlace') { if (vnoise(y / 12, seed) > P.dens && (y & 1)) slip = P.amp; }
          else if (m === 'cells') { if (vnoise((x >> 3) + seed, (y >> 3) + f * 3) > dens) slip = (P.live && vnoise((y >> 3) + 3, seed) > 0.5) ? -8 : 8; }
          return [Math.min(w - 1, Math.max(0, x + slip)), sy];
        };
      }
      var base = null;
      function burst() {
        var root = el.closest('[data-glitch]');
        if (P0.seq) { var ph2 = Math.floor((Date.now() - t0) / P0.dur) % P0.seq.length; P = V[P0.seq[ph2]]; el.setAttribute('data-glitch-now', ph2 + 1); }
        if (!seen || !cv.width || (root && root.getAttribute('data-glitch') === 'off')) { base = null; return later(); }
        var ctx = cv.getContext('2d', { willReadFrequently: true }), w = cv.width, h = cv.height;
        /* A clock with no gap (d6) keeps its clean frame between steps. */
        base = ctx.getImageData(0, 0, w, h);
        var out = ctx.createImageData(w, h), b = base.data, o = out.data;
        var n = P.n[0] + Math.floor(Math.random() * (P.n[1] - P.n[0] + 1)), seed = Math.random() * 100, f = 0, band = Math.floor(Math.random() * h * 0.9);
        (function step() {
          if (f >= n) { ctx.putImageData(base, 0, 0); return later(); }
          var at = map(w, h, f, n, seed, band);
          for (var y = 0, i = 0; y < h; y++) for (var x = 0; x < w; x++, i += 4) {
            var s2 = at(x, y), si = (s2[1] * w + s2[0]) * 4;
            o[i] = b[si]; o[i + 1] = b[si + 1]; o[i + 2] = b[si + 2]; o[i + 3] = 255;
          }
          ctx.putImageData(out, 0, 0); f++;
          setTimeout(step, P.fd);
        })();
      }
      function later() { setTimeout(burst, P.every ? P.every + Math.random() * P.jit : P.fd); }
      later();
    });
  })();

})();
