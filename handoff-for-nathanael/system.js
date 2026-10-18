/* ═══════════════════════════════════════════════════════════════════════════
   PEACE INTEL · SYSTEM RUNTIME
   The behaviour the brand system needs, as one file rather than one copy per
   page. Everything here is progressive enhancement: with the script absent the
   page is plainer and still correct.

     colour        rgb / over / lum / ratio, plus cvar, which is the only
                   reliable way to resolve a custom property to a colour
     motion        .mo-deal, the one entry primitive, fired once on entry
     fields        the dithered gradient fields, still and live
     grid          the scroll-linked rendered grid
     doc screen    Exploration: a documentary photograph in the dither, its
                   colour showing through in patches ([data-docscreen])
     floating bar  Exploration: a sticky top bar that compacts to the logo on
                   the way down ([data-fnav], Pl. 19)
     video         lazy playback with a concurrency cap, and the runtime
                   luminance-to-token mapping
     scrolly       a sticky figure that swaps with the step being read
     landing       choreographs a [data-land] screen when the scroll settles on it
     pager         on a data-snap page, one eased move per wheel gesture or key
     veil scroll   a [data-veil-scroll] veil drifts, dissolves in Bayer order and
                   flaps faster as its screen scrolls away
     switch        a select[data-switch] shows the [data-case] it names
     prompts       a pill carrying data-prompt writes its question into a field

   Debug: ?off=live,gx,doc,video disables individual drivers.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.documentElement;
  root.setAttribute('data-js', '');

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
  function over(fg, bg) {
    if (!fg) return bg;
    if (fg.a >= 1) return fg;
    return { r: fg.r * fg.a + bg.r * (1 - fg.a),
             g: fg.g * fg.a + bg.g * (1 - fg.a),
             b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 };
  }
  function lum(c) {
    var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }
  function ratio(a, b) {
    var la = lum(a), lb = lum(b), hi = Math.max(la, lb), lo = Math.min(la, lb);
    return (hi + 0.05) / (lo + 0.05);
  }
  function hex(c) {
    var h = function (v) { return ('0' + Math.round(v).toString(16)).slice(-2).toUpperCase(); };
    return '#' + h(c.r) + h(c.g) + h(c.b);
  }
  /* Every class that hides itself until it enters the viewport. One since
     2026-10-15, when resolve, develop, focus and rule were retired. */
  var MO = '.mo-deal';
  /* Anything inside a [data-land] screen is choreographed by the landing
     driver below, which knows WHEN a screen has arrived rather than merely that
     it has started to appear. Left to this observer, those elements would fire
     a quarter of the way into a snap and be finished before it settled, and the
     2.5s backstop would reveal them regardless of where the reader was. */
  function moTargets() {
    return Array.prototype.filter.call(document.querySelectorAll(MO), function (el) {
      return !(el.closest && el.closest('[data-land], [data-with]'));
    });
  }
  function observe() {
    if (!('IntersectionObserver' in window)) {
      moTargets().forEach(function (el) {
        el.classList.add('is-in');
      });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.25 });
    moTargets().forEach(function (el) { io.observe(el); });
    /* Backstop: anything still unfired after 2.5s is revealed regardless. An
       element inside its own scroll container may never intersect the viewport,
       and a missed reveal must not mean invisible content. */
    setTimeout(function () {
      moTargets().forEach(function (el) {
        if (!el.classList.contains('is-in')) { el.classList.add('is-in'); io.unobserve(el); }
      });
    }, 2500);
  }
  observe();

  /* Reset every entry animation and re-arm the observer. The reference page's
     replay button is the only caller; it used to reach for MO and observe()
     directly, which stopped existing the moment this file became a separate
     runtime. Exporting the behaviour rather than the internals means the page
     cannot break this way again. */
  function replayMotion() {
    Array.prototype.forEach.call(document.querySelectorAll(MO), function (el) {
      el.classList.remove('is-in');
    });
    void document.body.offsetWidth;
    setTimeout(observe, 40);
  }

  /* Debug switch for bisecting a stall: ?off=live,gx,video disables the
     matching driver. Reference page only. */
  var OFF = (new URLSearchParams(location.search).get('off') || '').split(',');
  function offq(n) { return OFF.indexOf(n) > -1; }

  /* ── The 8×8 Bayer matrix ────────────────────────────────────────────────
     Built by the standard recursive doubling, M2n = [[4M, 4M+2], [4M+3, 4M+1]].
     This is the same matrix the video assets are dithered with. Both
     explorations below use it: one to quantise colour, one to decide the order
     cells appear in. That shared origin is the point. */
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

  /* Resolve a custom property to an actual colour.

     getComputedStyle().getPropertyValue('--ink') hands back the RAW TOKEN TEXT:
     "#F3EFE7" for a hex, "color-mix(in srgb, ...)" for a mix. Neither is a
     colour a parser built for rgb() will take, and a fallback value hides that
     completely — the grid tiles fell back to the light-theme ink and accent and
     therefore never changed with the theme, while looking perfectly correct in
     light mode.

     Assigning the property to a real colour on a probe forces the cascade to
     resolve it. The probe is appended inside the element so it inherits that
     element's token scope and any surface context still applies. Same family of
     trap as the color(srgb ...) parser bug; both were found by measuring rather
     than by looking at the page. */
  function cvar(el, name) {
    var probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
    probe.style.color = 'var(' + name + ')';
    el.appendChild(probe);
    var c = rgb(getComputedStyle(probe).color);
    el.removeChild(probe);
    return c;
  }

  /* Value noise on a coarse lattice. This is what makes the field muddy rather
     than mathematical — pure radial gradients read as software, and a little
     low-frequency wobble is the whole difference. */
  function h2(x, y) { var s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }

  function smooth(t) { t = t < 0 ? 0 : (t > 1 ? 1 : t); return t * t * (3 - 2 * t); }

  /* Smooth value noise on the same lattice hash: clusters that drift rather
     than static. The documentary screen uses it. */
  function vnoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return (h2(xi, yi) * (1 - u) + h2(xi + 1, yi) * u) * (1 - v)
         + (h2(xi, yi + 1) * (1 - u) + h2(xi + 1, yi + 1) * u) * v;
  }

  /* ── THE RENDERED GRID (.gx--render), adopted 2026-10-15 ────────────────
     The dashed grid develops cell by cell as a band arrives and dissolves as
     it leaves: scroll-linked, never looped. Monochrome, in ink only (Matt): it
     had an accent "hot" corner, which put colour into texture. One order,
     organic; the Bayer option was cut when it was adopted. */
  (function gridRender() {
    if (offq('gx')) return;
    var nodes = [].slice.call(document.querySelectorAll('[data-gx]'));
    if (!nodes.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var CELL = 20;   // matches the --grid tile pitch exactly

    /* One 20px tile per colour, pre-rendered once. Drawing the dashes per cell
       cost about nine fills each and did not hold 60fps on a full band. */
    function tile(c, op) {
      var t = document.createElement('canvas'), dpr = Math.min(2, window.devicePixelRatio || 1);
      t.width = CELL * dpr; t.height = CELL * dpr;
      var x = t.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
      var s = 'rgba(' + (c.r | 0) + ',' + (c.g | 0) + ',' + (c.b | 0) + ',';
      x.strokeStyle = s + (0.42 * op) + ')'; x.lineWidth = 0.7;
      x.setLineDash([3, 2]);
      x.beginPath(); x.moveTo(0, 10.35); x.lineTo(CELL, 10.35);
      x.moveTo(10.35, 0); x.lineTo(10.35, CELL); x.stroke();
      x.setLineDash([]);
      x.fillStyle = s + (0.5 * op) + ')';
      x.beginPath(); x.arc(10.35, 10.35, 0.9, 0, 6.2832); x.fill();
      return t;
    }
    function build(el) {
      var cs = getComputedStyle(el);
      /* No colour fallbacks here on purpose. A fallback is what hid the fact
         that these were never resolving: the tiles quietly used light-theme ink
         and accent in every theme. If cvar returns nothing, that is a bug worth
         seeing, so the tile is skipped and the cell is simply not drawn. */
      var ink = cvar(el, '--ink');
      if (!ink) return;
      var op = (parseFloat(cs.getPropertyValue('--grid-opacity')) || 1)
             * (parseFloat(cs.getPropertyValue('--gx-gain')) || 1);
      if (op > 1) op = 1;
      el._tiles = { ink: tile(ink, op) };
    }
    function draw(el, p) {
      var cv = el.querySelector('.gx-c'); if (!cv) return;
      var w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      if (!el._tiles) build(el);
      if (!el._tiles) return;
      var ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (p <= 0.004) return;
      var cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL);
      /* Vignette radius. Over a full-height field the default reach covered
         almost the whole area and the grid stopped being a vignette, so the
         stage tightens it. Texture that reaches the edges is wallpaper. */
      var vg0 = parseFloat(getComputedStyle(el).getPropertyValue('--gx-vig')) || 1;

      /* THE ORDER CELLS ARRIVE IN: a hash per cell, which is white noise,
         mixed with a low-frequency value noise, which clusters. Pure hash
         scatters evenly and reads as television static; pure value noise
         reveals in soft blobs and reads as a wipe. Together the cells arrive in
         patches that spread, which is what developing looks like. The map
         depends only on the grid size, so it is computed once and cached. */
      var key = cols + 'x' + rows;
      if (el._tkey !== key) {
        var map = new Float32Array(cols * rows);
        for (var my = 0; my < rows; my++) for (var mx = 0; mx < cols; mx++) {
          var lx = mx / 6, ly = my / 6;
          var xi = Math.floor(lx), yi = Math.floor(ly), xf = lx - xi, yf = ly - yi;
          var eu = xf * xf * (3 - 2 * xf), ev = yf * yf * (3 - 2 * yf);
          var vn = (h2(xi, yi) * (1 - eu) + h2(xi + 1, yi) * eu) * (1 - ev)
                 + (h2(xi, yi + 1) * (1 - eu) + h2(xi + 1, yi + 1) * eu) * ev;
          map[my * cols + mx] = 0.62 * h2(mx * 1.7, my * 2.3) + 0.38 * vn;
        }
        el._tmap = map; el._tkey = key;
      }
      var tmap = el._tmap;
      for (var ry = 0; ry < rows; ry++) {
        for (var rx = 0; rx < cols; rx++) {
          var t = tmap[ry * cols + rx];
          /* the diagonal bias means the field fills from the low left, the same
             corner the ember sits in on a gradient field */
          var lead = p * 1.62 - (rx / cols) * 0.24 - (1 - ry / rows) * 0.14;
          var a = (lead - t * 0.92) / 0.40;
          if (a <= 0.004) continue; if (a > 1) a = 1;
          /* keep the vignette. Texture that reaches the edges is wallpaper. */
          var nu = (rx + .5) / cols - .5, nv = (ry + .5) / rows - .5;
          /* vrx / vry, NOT rx / ry. These are var-scoped to the function, so
             naming them after the loop counters reassigned the counters and the
             outer loop never terminated. */
          var vrx = .56 * vg0, vry = .52 * vg0;
          var vg = smooth(1.25 * (1 - Math.min(1, Math.sqrt((nu / vrx) * (nu / vrx) + (nv / vry) * (nv / vry)))));
          if (vg <= 0.004) continue;
          ctx.globalAlpha = a * vg;
          ctx.drawImage(el._tiles.ink, rx * CELL, ry * CELL, CELL, CELL);
        }
      }
      ctx.globalAlpha = 1;
    }
    var queued = false;
    function frame() {
      queued = false;
      var vh = window.innerHeight, readY = vh * 0.44;
      nodes.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -120 || r.top > vh + 120) {
          if (el._p !== 0) { draw(el, 0); el._p = 0; }
          return;
        }
        /* Asymmetric on purpose. A symmetric curve peaked almost as soon as
           the element appeared, so the build was finished before it was
           properly in view. Acquisition runs from the element entering the
           bottom of the viewport until it has cleared the top, and release only
           starts once the bottom edge is well past the reading line. */
        var acq = (vh - r.top) / (vh * 0.92 + r.height * 0.5);
        var rel = (vh * 0.22 - r.bottom) / (vh * 0.55);
        var p = smooth(acq) * (1 - smooth(rel));
        if (el._force !== undefined) p = el._force;
        if (el._p === undefined || Math.abs(p - el._p) > 0.006) { draw(el, p); el._p = p; }
      });
    }
    function onScroll() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { nodes.forEach(function (el) { el._tiles = null; el._p = undefined; el._tkey = null; }); onScroll(); });

    /* Plate control. Runs the build on the nearest demo without needing the
       reader to find the right scroll speed, then hands it back to the scroll. */
    var rp = document.getElementById('replay-grid');
    if (rp) rp.addEventListener('click', function () {
      var vh0 = window.innerHeight;
      var target = nodes.filter(function (el) {
        var r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < vh0;
      })[0] || nodes[0];
      var t0 = performance.now(), DUR = 2600;
      (function run(now) {
        var k = Math.min(1, (now - t0) / DUR);
        target._force = smooth(k);
        target._p = undefined;
        frame();
        if (k < 1) requestAnimationFrame(run);
        else { delete target._force; target._p = undefined; onScroll(); }
      })(t0);
    });
    frame();
  })();

  /* ── THE GLITCH ([data-docglitch]), Pl. 18 · A1, decided 16 October ──────
     Matt picked 18 · A1 as the archive ran it, with the first glitch (18 · C):
     every two to six seconds, while the picture is on screen, a burst of four
     to nine frames slips bands of rows sideways and takes their neighbours'
     pixels, then the picture settles back exactly as it was. Reduced motion
     and ?off=glitch leave it still. A timed effect, outside the closed set of
     motion until it is adopted onto a page. The other presets are in
     archive/retired.js. */
  (function docGlitch() {
    if (offq('glitch')) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    [].forEach.call(document.querySelectorAll('[data-docglitch]'), function (el) {
      var cv = el.querySelector('canvas'), seen = false;
      if (!cv) return;
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }).observe(el);
      else seen = true;
      function later() { setTimeout(burst, 1800 + Math.random() * 4200); }
      function burst() {
        if (!seen || !cv.width) return later();
        var ctx = cv.getContext('2d', { willReadFrequently: true }), w = cv.width, h = cv.height;
        var base = ctx.getImageData(0, 0, w, h);
        if (!base.data[((h >> 1) * w + (w >> 1)) * 4 + 3]) return later();
        var out = ctx.createImageData(w, h), b = base.data, o = out.data;
        var n = 4 + Math.floor(Math.random() * 6), seed = Math.random() * 100, f = 0;
        (function step() {
          if (f >= n) { ctx.putImageData(base, 0, 0); return later(); }
          var ph = seed + f * 0.7;
          for (var y = 0, i = 0; y < h; y++) {
            var slip = vnoise(y / 5, ph * 1.6) > 0.74 ? Math.round((vnoise(y / 2 + 9, ph * 3) - 0.5) * 48) : 0;
            for (var x = 0; x < w; x++, i += 4) {
              var si = (y * w + Math.min(w - 1, Math.max(0, x + slip))) * 4;
              o[i] = b[si]; o[i + 1] = b[si + 1]; o[i + 2] = b[si + 2]; o[i + 3] = 255;
            }
          }
          ctx.putImageData(out, 0, 0); f++;
          setTimeout(step, 60);
        })();
      }
      later();
    });
  })();

  /* ── THE FLOATING BAR (.fnav[data-fnav]), Exploration, Pl. 19, 16 October ─
     Matt: "a hovering top bar ... that has a margin from the viewport on the
     sides and top, that compacts to just the logo when scrolling down". The
     bar is a sticky object; this only decides its state. Scrolling down past
     the first screenful compacts it, scrolling up opens it again, and at the
     top it is always open. It scrolls with the window, or with the nearest
     [data-fnav-scroll] when the specimen is a frame. CSS does the change, on
     the interaction timings; with reduced motion it simply switches. */
  (function floatNav() {
    [].forEach.call(document.querySelectorAll('[data-fnav]'), function (bar) {
      var box = bar.closest('[data-fnav-scroll]');
      var src = box || window, last = 0, queued = false;
      function y() { return box ? box.scrollTop : window.scrollY; }
      function frame() {
        queued = false;
        var now = y(), dy = now - last;
        if (now < 48) bar.classList.remove('is-compact');
        else if (dy > 6) bar.classList.add('is-compact');
        else if (dy < -6) bar.classList.remove('is-compact');
        if (Math.abs(dy) > 6 || now < 48) last = now;
      }
      src.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(frame); } }, { passive: true });
      /* Compacted, the dove is the way back to the menu: the first tap opens
         the bar, and the next scroll down folds it again. Open, it is the
         link home as before. */
      var mark = bar.querySelector('.fnav-mark');
      if (mark) mark.addEventListener('click', function (e) {
        if (!bar.classList.contains('is-compact')) return;
        e.preventDefault();
        bar.classList.remove('is-compact'); last = y();
        var first = bar.querySelector('.fnav-links a'); if (first) first.focus({ preventScroll: true });
      });
    });
  })();

  /* ── VIDEO · load and play only what is on screen ────────────────────────
     Ten autoplaying clips on one page is a real problem, not a demo artefact.
     Every one of them opens a connection and holds it, and on a single-threaded
     dev server that is enough to deadlock the page before it finishes painting.
     preload="none" plus play-on-enter keeps it to what is actually visible, and
     is what a production page with more than one clip should do anyway. */
  (function lazyVideo() {
    var vids = [].slice.call(document.querySelectorAll('video'));
    if (!vids.length) return;
    /* Playing only what is more than a third visible, rather than anything that
       touches the viewport. Measured on this page: eight clips decoding at once
       takes it from 121fps to 31, and pausing them takes it straight back —
       the cost is DECODE, not the canvas mapping, which measures 1.3ms a frame.
       A real page has one clip. A specimen sheet has eight, which is why the
       threshold is here. */
    /* A HARD CAP ON CONCURRENTLY VISIBLE CLIPS, at two.

       Measured on this page, stepping the count up: nought, one and two clips
       all hold 121fps; three drops it to 31. Two further tests say what that
       cliff actually is. Turning off the canvas mapping while three play
       changes nothing, so it is not the mapping, which measures 1.3ms a frame.
       Setting those same three to visibility:hidden while they keep playing
       returns it to 121fps, so it is not decode either. It is COMPOSITING the
       upscaled frames — these are small clips blown up with image-rendering:
       pixelated, and past two of them the paint cost falls off a cliff.

       Which means the fix is fewer clips ON SCREEN rather than fewer loaded. A
       real page has one and never meets this. A specimen sheet has eight. */
    var MAX = 2, ratios = new Map();

    /* THE SLOTS ROTATE, and this is the fix for what the cap did to a specimen
       sheet. Capping at two meant that on a plate comparing six treatments, four
       of them showed a blank rectangle: a clip that has never played has no
       frame, and a [data-vmap] canvas with nothing drawn into it is empty rather
       than merely still.

       So a clip that has been playing for a couple of seconds gives up its slot
       to one that has never run. Every visible clip ends up seeded with a frame
       within a few seconds, and because a paused video keeps its last frame and
       a canvas keeps its last paint, what you are left with is two clips moving
       and the rest holding a correct still — which is a fair comparison and a
       better-looking page than four blanks.

       On a real page this never fires. One clip is under the cap, so it never
       has a turn to give up. */
    var ROTATE = 2500;
    function arbitrate() {
      var now = performance.now();

      /* A clip is SEEDED once it has actually had a turn, not once it has been
         paused. Marking it on pause was the bug: a playing clip stayed unseeded
         forever, so it always sorted first and never gave up its slot, which is
         exactly the blank-column behaviour this was written to fix. */
      vids.forEach(function (v) {
        if (!v.paused && v._since && now - v._since >= ROTATE) v._seeded = true;
      });

      var visible = vids.filter(function (v) { return (ratios.get(v) || 0) >= 0.35; });
      visible.sort(function (a, b) {
        var as = a._seeded ? 1 : 0, bs = b._seeded ? 1 : 0;
        if (as !== bs) return as - bs;                 /* never played wins */
        if ((a._since || 0) !== (b._since || 0)) return (a._since || 0) - (b._since || 0);
        return ratios.get(b) - ratios.get(a);          /* then most visible */
      });
      var want = visible.slice(0, MAX);

      vids.forEach(function (v) {
        if (want.indexOf(v) > -1) {
          if (v.preload === 'none') { v.preload = 'auto'; v.load(); }
          if (v.paused) { v._since = now; v.play().catch(function () {}); }
        } else if (!v.paused) { v.pause(); }
      });
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { ratios.set(e.target, e.isIntersecting ? e.intersectionRatio : 0); });
      arbitrate();
    }, { rootMargin: '0px', threshold: [0, 0.2, 0.35, 0.6, 0.9] });
    vids.forEach(function (v) { io.observe(v); });
    /* The rotation needs a clock of its own: intersection events stop arriving
       the moment scrolling stops, which is exactly when the blanks are visible. */
    setInterval(arbitrate, 700);
  })();

  /* ── VIDEO · luminance in, token out ──────────────────────────────────────
     Maps a mono dithered master through the brand ramp at runtime. The seven
     stops are SORTED BY LUMINANCE rather than taken in declaration order, which
     is what makes one ramp correct in both themes: in light the lightest token
     is the paper, in dark it is the ink, and a bright sky has to stay bright
     either way.

     No dithering happens here. The master was already dithered in luminance, so
     this is a straight palette substitution; dithering again would beat against
     the existing pattern. */
  (function videoMap() {
    if (offq('video')) return;
    var nodes = [].slice.call(document.querySelectorAll('[data-vmap]'));

    if (!nodes.length) return;
    function pal(el) {
      var out = [];
      for (var i = 0; i < 7; i++) { var c = cvar(el, '--v-' + i); if (c) out.push(c); }
      out.sort(function (a, b) { return lum(a) - lum(b); });
      return out.length === 7 ? out : null;
    }
    /* THE SOURCE MAY BE A STILL. Added 2026-09-28 for the Rotary page's stepped
       figures. A subject shot on a seamless is a veil whether it moves or not,
       and the ramp already does the right thing with one: stop 0 is --bg, so a
       white ground maps to the page and dissolves without a mask. Forking this
       loop into a page to get the same eleven lines is exactly the drift this
       file exists to prevent, so the source is widened instead.

       An image has no readyState and no videoWidth, and it does not need
       redrawing every frame — see the tick loop, which only polls moving
       sources. */
    function src(el) { return el.querySelector('video, img'); }
    function natural(v) {
      return v.tagName === 'IMG'
        ? { w: v.naturalWidth, h: v.naturalHeight, ready: v.complete && v.naturalWidth > 0 }
        : { w: v.videoWidth,   h: v.videoHeight,   ready: v.readyState >= 2 };
    }
    function size(el) {
      var v = src(el), cv = el.querySelector('canvas'), n = natural(v);
      if (!n.w) return false;
      if (cv.width !== n.w) { cv.width = n.w; cv.height = n.h; }
      return true;
    }
    function draw(el) {
      var v = src(el), cv = el.querySelector('canvas');
      if (!natural(v).ready || !size(el)) return;
      if (!el._pal) el._pal = pal(el);
      if (!el._pal) return;
      var ctx = cv.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(v, 0, 0, cv.width, cv.height);
      var img = ctx.getImageData(0, 0, cv.width, cv.height), d = img.data, p = el._pal;
      var W = cv.width;

      /* THE DARK-PAGE PROBLEM, and why one mapping is not enough.

         Mapping luminance faithfully means a bright scene stays bright. On a
         light page that is correct. On a dark page it turns the clip into a lit
         slab, which is worse than the grey rectangle this whole section set out
         to fix. What to do about it depends on what the footage is:

           SUBJECT  shot on a seamless. The ground should drop away, so on dark
                    the ramp is REVERSED and the white ground becomes the page
                    while the subject lifts off it. This is the same move as
                    screen-instead-of-multiply, done in the palette.
           SCENE    fills its frame. Reversing it would make the sky dark and
                    the ground bright, which is surreal, so its dark ramp is
                    COMPRESSED instead and never reaches the paper tone. That
                    compression lives in the ramp declaration, not here.

         Neither is a preference. Pick by what the footage is. */
      var mode = el.getAttribute('data-vmode') || 'scene';
      var subject = mode === 'subject';
      var ground = 6;

      /* THE SOURCE HAS TO BE CONTINUOUS TONE, and this is the part the first
         version got wrong. Mapping the already-dithered mono master meant only
         seven input levels existed, so nearest-level rounding collapsed the sun
         into the sky and the baked version looked better in every comparison.

         The master is now plain greyscale, undithered, and the DITHER HAPPENS
         HERE: the luminance is scaled across the ramp and an 8x8 Bayer threshold
         decides which of the two neighbouring stops a pixel takes. Same
         algorithm as the gradient fields, which is why they sit together. */
      /* Transparent source pixels read as black, so their alpha is kept aside
         and their tone is taken as the white ground they stand for. */
      var a0 = new Uint8Array(d.length / 4), cut = false;
      for (var q = 0; q < a0.length; q++) {
        a0[q] = d[q * 4 + 3];
        if (a0[q] < 255) { cut = true; if (a0[q] < 128) d[q * 4] = d[q * 4 + 1] = d[q * 4 + 2] = 255; }
      }
      for (var i = 0, px = 0; i < d.length; i += 4, px++) {
        var g = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255;
        var f = g * 6, k = Math.floor(f), frac = f - k;
        if (k > 5) { k = 5; frac = 1; }
        if (BAYER8[(px / W | 0) & 7][(px % W) & 7] / 64 < frac) k += 1;
        var c = p[k];
        d[i] = c.r; d[i + 1] = c.g; d[i + 2] = c.b;
        /* A subject's ground is not painted at all, so whatever the page has
           behind the figure (a .textured grid) shows through its silhouette
           the way it does around a veil. A master that carries alpha says
           exactly where its ground is, and its own whites stay solid. One that
           does not (footage) falls back to its white, the top of the ramp. */
        d[i + 3] = (a0[px] < 128 || (subject && !cut && k === ground)) ? 0 : 255;
      }
      ctx.putImageData(img, 0, 0);
    }
    var onScreen = new WeakSet();
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target); });
    }, { rootMargin: '10% 0px' });
    nodes.forEach(function (el) { io.observe(el); });


    /* A still is drawn when its file arrives and then left alone. Polling it at
       12fps would repaint an identical frame forever, and the measured cost of
       this treatment is compositing, not mapping. */
    nodes.forEach(function (el) {
      var v = src(el);
      if (v && v.tagName === 'IMG') {
        if (v.complete) draw(el);
        else v.addEventListener('load', function () { draw(el); });
      }
    });

    var last = 0;
    (function tick(now) {
      requestAnimationFrame(tick);
      if (now - last < 80) return;   // ~12fps, matching the assets
      last = now;
      nodes.forEach(function (el) {
        var v = src(el);
        if (v && v.tagName === 'IMG') return;
        if (onScreen.has(el)) draw(el);
      });
    })(0);
  })();

  /* ── SCROLLY · a pinned figure that changes with the step being read ─────
     Added 2026-09-28. A run of steps beside one sticky figure, where the figure
     swaps as each step reaches the reading position. It is in the runtime rather
     than in a page because the alternative is every page that wants it writing
     its own observer, which is how two halves of a codebase drift apart.

     The reading position is 44% of the viewport — the SAME line registration
     locks against. There is only one place on the page where a reader is looking,
     and two subsystems disagreeing about where it is would be visible as a figure
     that changes just before or just after the copy it belongs to.

     The driver only sets classes. Every transition lives in CSS, so reduced
     motion is handled where the rest of the motion set handles it, and with
     script off the first figure shows and all the copy is readable — the
     legibility of this section never depends on the observer running. */
  (function scrolly() {
    if (offq('scrolly')) return;
    var els = [].slice.call(document.querySelectorAll('[data-scrolly]'));
    if (!els.length) return;

    els.forEach(function (root) {
      var steps = [].slice.call(root.querySelectorAll('.scrolly-step'));
      var figs  = [].slice.call(root.querySelectorAll('.scrolly-fig'));
      if (!steps.length || !figs.length) return;

      /* A step marked data-fig="none" (an intro screen) shows no figure, and
         the figures pair with the remaining steps in order. */
      var figOf = [], k = 0;
      steps.forEach(function (s) { figOf.push(s.getAttribute('data-fig') === 'none' ? -1 : k++); });

      var current = -1;
      function apply(i) {
        if (i === current) return;
        current = i;
        steps.forEach(function (s, n) { s.classList.toggle('is-active', n === i); });
        figs.forEach(function (f, n) { f.classList.toggle('is-on', n === figOf[i]); });
        root.setAttribute('data-active', i);
      }

      var queued = false;
      function frame() {
        queued = false;
        var line = window.innerHeight * 0.44, best = 0, bestD = Infinity;
        steps.forEach(function (s, n) {
          var r = s.getBoundingClientRect();
          /* Distance from the step's own middle to the reading line. Using the
             middle rather than the top keeps a short step from being skipped
             between two frames of a fast scroll. */
          var d = Math.abs((r.top + r.height / 2) - line);
          if (d < bestD) { bestD = d; best = n; }
        });
        apply(best);
      }
      function onScroll() { if (!queued) { queued = true; requestAnimationFrame(frame); } }

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      apply(0);
      frame();
    });
  })();

  /* ── LANDING · choreograph a screen when the reader ARRIVES on it ────────
     Added 2026-09-28. A [data-land] element is one stop on the page. Its
     children carry data-at, milliseconds after arrival, and one of the mo-*
     primitives saying how they arrive. This driver invents no motion: it only
     decides WHEN, by adding .is-in on schedule. HOW is the primitive's own
     transition, exactly as if the entry observer had fired it.

     "Arrived" means the scroll has come to rest with the screen mostly in view.
     On a snapping page that is the moment the snap settles — scrollend — which
     is the whole point: an intersection observer fires a quarter of the way
     into the snap, and the animation is over before the page has stopped.
     Without snap (phones), waiting for rest would leave copy blank while a
     reader flicks through it, so there the trigger is an ordinary observer.

     Each screen lands once. A reveal that replays every time you pass it is a
     trick; once, it is an arrival.

     Never load-bearing for legibility: reduced motion lands everything at once
     with no delays, and a screen that is plainly in view always lands. */
  (function landing() {
    var screens = [].slice.call(document.querySelectorAll('[data-land]'));
    if (!screens.length) return;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function play(scr) {
      if (scr._landed) return;
      scr._landed = true;
      scr.classList.add('is-landed', 'is-in');
      /* An element outside the screen can join its entry with
         data-with="<screen id>": a pinned figure, say, which lives in another
         column but should arrive with the copy it belongs to. */
      var cast = [].slice.call(scr.querySelectorAll('[data-at]'));
      if (scr.id) cast = cast.concat([].slice.call(document.querySelectorAll('[data-with="' + scr.id + '"]')));
      cast.forEach(function (el) {
        var at = reduced ? 0 : (parseFloat(el.getAttribute('data-at')) || 0);
        if (at <= 0) el.classList.add('is-in');
        else setTimeout(function () { el.classList.add('is-in'); }, at);
      });
    }
    if (reduced) { screens.forEach(play); return; }

    function navH() { return parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 0; }
    function shown(el) {
      var r = el.getBoundingClientRect(), top = Math.max(r.top, navH()), bot = Math.min(r.bottom, window.innerHeight);
      var need = Math.min(r.height, window.innerHeight - navH());
      return need > 0 ? Math.max(0, bot - top) / need : 0;
    }
    function settle() {
      /* Mid-move, the pager is still travelling; it calls this when it stops. */
      if (root.hasAttribute('data-paging')) return;
      screens.forEach(function (s) { if (!s._landed && shown(s) >= 0.6) play(s); });
    }
    root._settle = settle;

    var snapping = window.matchMedia && window.matchMedia('(min-width: 901px)').matches;
    if (snapping || !('IntersectionObserver' in window)) {
      if ('onscrollend' in window) {
        window.addEventListener('scrollend', settle);
      } else {
        var st;
        window.addEventListener('scroll', function () { clearTimeout(st); st = setTimeout(settle, 140); }, { passive: true });
      }
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { play(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.3 });
      screens.forEach(function (s) { io.observe(s); });
    }
    window.addEventListener('resize', settle);
    /* The first screen lands on load. A frame's wait so the fonts' first
       layout has happened and the line split is measured against it. */
    requestAnimationFrame(settle);
    window.addEventListener('load', settle);
  })();

  /* ── PAGER · one screen per gesture, eased ───────────────────────────────
     Added 2026-09-28. Native mandatory snap has two faults on a mouse: a hard
     flick of the wheel can carry straight past a stop, and the snap itself
     runs on the browser's own short curve, which reads as a jolt. On a
     <html data-snap> page at desktop width, this takes the wheel and the
     paging keys and moves exactly one stop per gesture, over --mo-page with
     an ease-in-out, holding the CSS snap off while it travels.

     A stop taller than the screen is paged through a screen at a time, so no
     copy is ever skipped. Trackpad inertia after a move is swallowed rather
     than read as a second gesture. Phones, reduced motion and ?off=pager keep
     the browser's own scrolling. */
  (function pager() {
    if (offq('pager') || !root.hasAttribute('data-snap')) return;
    var mq = window.matchMedia('(min-width: 901px)');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    var busy = false, lastWheel = 0, endedAt = 0;
    function navH() { return parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 0; }
    function dur() {
      var v = getComputedStyle(root).getPropertyValue('--mo-page').trim();
      return (parseFloat(v) || 1100) * (/ms$/.test(v) || !v ? 1 : 1000);
    }
    function maxY() { return root.scrollHeight - window.innerHeight; }
    function yOf(el) {
      var top = el.getBoundingClientRect().top + window.scrollY;
      if (el.matches('footer')) return top + el.offsetHeight - window.innerHeight;
      return top - navH();
    }
    function stops() {
      var ys = [].map.call(document.querySelectorAll('[data-land], footer.band'), yOf);
      ys.push(0, maxY());
      return ys.map(function (y) { return Math.round(Math.max(0, Math.min(maxY(), y))); })
               .sort(function (a, b) { return a - b; });
    }
    function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    function go(to) {
      var from = window.scrollY, d = to - from;
      if (Math.abs(d) < 2) return;
      busy = true; root.setAttribute('data-paging', '');
      var t0 = performance.now(), T = dur();
      (function step(now) {
        var t = Math.min(1, (now - t0) / T);
        window.scrollTo({ top: from + d * ease(t), behavior: 'instant' });
        if (t < 1) return requestAnimationFrame(step);
        root.removeAttribute('data-paging');
        busy = false; endedAt = performance.now();
        if (root._settle) root._settle();
      })(t0);
    }
    function page(dir) {
      var y = window.scrollY, ys = stops(), screen = window.innerHeight - navH(), t;
      if (dir > 0) { t = ys.filter(function (v) { return v > y + 4; })[0]; if (t !== undefined) t = Math.min(t, y + screen); }
      else { t = ys.filter(function (v) { return v < y - 4; }).pop(); if (t !== undefined) t = Math.max(t, y - screen); }
      if (t !== undefined) go(t);
    }

    window.addEventListener('wheel', function (e) {
      if (!mq.matches || e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      var now = performance.now(), fresh = now - lastWheel > 160;
      lastWheel = now;
      if (busy) return;
      /* Wheel events still arriving right after a move are the tail of the
         same gesture (trackpad inertia, a spun wheel), not a new request. */
      if (!fresh && now - endedAt < 450) return;
      page(e.deltaY > 0 ? 1 : -1);
    }, { passive: false });

    window.addEventListener('keydown', function (e) {
      if (!mq.matches || e.altKey || e.ctrlKey || e.metaKey) return;
      var el = document.activeElement;
      if (el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable)) return;
      var dir = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 }[e.key];
      if (e.key === ' ') dir = e.shiftKey ? -1 : 1;
      if (!dir) return;
      e.preventDefault();
      if (!busy) page(dir);
    });

    /* In-page links take the same eased move rather than the browser's. */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || !mq.matches || busy) return;
      var id = a.getAttribute('href').slice(1), el = id && document.getElementById(id);
      if (!el) return;
      var stop = el.matches('[data-land]') ? el : (el.querySelector('[data-land]') || el);
      e.preventDefault();
      go(Math.max(0, Math.min(maxY(), Math.round(yOf(stop)))));
      if (history.replaceState) history.replaceState(null, '', '#' + id);
    });
  })();

  /* ── VEIL SCROLL · the dove leaves when the reader does ──────────────────
     Added 2026-09-28. A veil marked [data-veil-scroll] is tied to its screen's
     scroll position rather than looping regardless:

       · it drifts up and slightly forward as the screen scrolls away, so the
         bird reads as flying off rather than being scrolled off
       · it breaks up in BAYER ORDER — the same 8x8 matrix its own dither was
         made with — so it dissolves into its own grain rather than fading
       · it flaps faster while the page is moving, and settles back to its
         own pace when the page stops

     Scroll back and all three reverse: the dove reassembles. The dissolve is a
     second mask layer (a threshold tile, one per level, built once) intersected
     with the veil's own radial mask, so the soft edge survives underneath it.
     Skipped entirely under reduced motion, where the veil is simply still. */
  (function veilScroll() {
    var els = [].slice.call(document.querySelectorAll('.veil[data-veil-scroll]'));
    if (!els.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var cell = parseFloat(getComputedStyle(root).getPropertyValue('--dither-cell')) || 3;
    var dpr = Math.min(2, window.devicePixelRatio || 1), LEVELS = 16, SIZE = 8 * cell;
    var tiles = [];
    for (var k = 1; k <= LEVELS; k++) {
      var c = document.createElement('canvas'); c.width = c.height = Math.round(SIZE * dpr);
      var x = c.getContext('2d'), thr = k / LEVELS, u = c.width / 8;
      x.fillStyle = '#000';
      for (var by = 0; by < 8; by++) for (var bx = 0; bx < 8; bx++) {
        if ((BAYER8[by][bx] + 0.5) / 64 >= thr) x.fillRect(Math.round(bx * u), Math.round(by * u), Math.ceil(u), Math.ceil(u));
      }
      tiles.push(c.toDataURL());
    }

    els.forEach(function (el) {
      var vid = el.querySelector('video');
      if (!vid) return;
      var scr = el.closest('[data-land], section, header') || el.parentElement;
      var base = getComputedStyle(vid).webkitMaskImage || getComputedStyle(vid).maskImage || 'none';
      var level = 0, rate = 1, target = 1, lastY = window.scrollY, lastT = performance.now(), idle;

      function setMask(n) {
        if (n === level) return;
        level = n;
        var s = vid.style;
        if (n === 0) {
          s.webkitMaskImage = s.maskImage = s.webkitMaskSize = s.maskSize = '';
          s.webkitMaskRepeat = s.maskRepeat = s.webkitMaskComposite = s.maskComposite = '';
          return;
        }
        var tile = 'url(' + tiles[n - 1] + ')', px = SIZE + 'px ' + SIZE + 'px';
        /* An unmasked veil (none) has no edge layer to intersect with; a none
           layer would read as transparent and blank the whole clip. */
        if (base === 'none') {
          s.webkitMaskImage = s.maskImage = tile;
          s.webkitMaskSize = s.maskSize = px;
          s.webkitMaskRepeat = s.maskRepeat = 'repeat';
          return;
        }
        var img = base + ', ' + tile;
        s.webkitMaskImage = img; s.maskImage = img;
        s.webkitMaskSize = s.maskSize = '100% 100%, ' + px;
        s.webkitMaskRepeat = s.maskRepeat = 'no-repeat, repeat';
        s.webkitMaskComposite = 'source-in'; s.maskComposite = 'intersect';
      }
      function frame() {
        var r = scr.getBoundingClientRect(), nh = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 0;
        var p = (nh - r.top) / Math.max(1, r.height * 0.85);
        p = p < 0 ? 0 : (p > 1 ? 1 : p);
        el.style.transform = p > 0.001
          ? 'translate3d(' + (p * 4).toFixed(2) + '%,' + (-p * 16).toFixed(2) + '%,0) scale(' + (1 + p * 0.06).toFixed(3) + ')'
          : '';
        setMask(Math.round(smooth((p - 0.08) / 0.72) * LEVELS));
      }
      /* Flap rate follows scroll speed, eased both ways so it never jumps. */
      function kick() {
        if (el._ticking) return; el._ticking = true;
        (function tick() {
          rate += (target - rate) * 0.12;
          if (Math.abs(vid.playbackRate - rate) > 0.04) { try { vid.playbackRate = rate; } catch (e) {} }
          if (Math.abs(target - rate) > 0.01 || target !== 1) requestAnimationFrame(tick);
          else { rate = 1; try { vid.playbackRate = 1; } catch (e) {} el._ticking = false; }
        })();
      }
      var queued = false;
      window.addEventListener('scroll', function () {
        var now = performance.now(), dy = Math.abs(window.scrollY - lastY), dt = Math.max(1, now - lastT);
        lastY = window.scrollY; lastT = now;
        target = 1 + Math.min(2.5, (dy / dt) * 1.4);
        clearTimeout(idle); idle = setTimeout(function () { target = 1; }, 120);
        kick();
        if (!queued) { queued = true; requestAnimationFrame(function () { queued = false; frame(); }); }
      }, { passive: true });
      window.addEventListener('resize', frame);
      frame();
    });
  })();

  /* ── SWITCH · a select that rewrites the copy it governs ─────────────────
     HELD, 2026-10-09: an exploration, not adopted, like its styles
     (.blank-wrap) in explorations.css. Do not build on it in production.

     Added 2026-10-08 for the home page, where "decision making at your
     [philanthropy]" swaps the three role statements under it. Markup:

       <select class="blank" data-switch="roles">…</select>
       <div id="roles">
         <div data-case="philanthropy">…</div>
         <div data-case="ministry" hidden>…</div>
       </div>

     Every case but the default ships with `hidden`, so with script off the page
     reads correctly as the default case.

     The new case arrives through its own .mo-* primitive. While it is still
     hidden the driver takes .is-in off it, shows it, and puts .is-in back on
     the next frame, so the primitive's transition runs exactly as it did on
     entry. It invents no motion; it only asks for the same arrival twice. */
  (function switches() {
    [].slice.call(document.querySelectorAll('select[data-switch]')).forEach(function (sel) {
      var box = document.getElementById(sel.getAttribute('data-switch'));
      if (!box) return;
      var cases = [].slice.call(box.querySelectorAll('[data-case]'));
      function show(v) {
        cases.forEach(function (c) {
          if (c.getAttribute('data-case') !== v) { c.hidden = true; return; }
          if (!c.hidden) return;
          var mo = [].slice.call(c.querySelectorAll(MO));
          if (c.matches(MO)) mo.push(c);
          mo.forEach(function (el) { el.classList.remove('is-in'); });
          c.hidden = false;
          void c.offsetWidth;
          requestAnimationFrame(function () { mo.forEach(function (el) { el.classList.add('is-in'); }); });
        });
      }
      sel.addEventListener('change', function () { show(sel.value); });
      /* A browser restoring the form on back/forward can hand back a select
         that no longer matches the case on screen. */
      show(sel.value);
    });
  })();

  /* ── PROMPTS · a suggestion pill writes its question into the prompt ─────
     HELD, 2026-10-09: an exploration, not adopted, like its styles (.ask, the
     editable prompt) in explorations.css. Do not build on it in production.

     Added 2026-10-08. A .pills row marked data-prompts="<textarea id>" holds
     buttons carrying data-prompt="…". Pressing one replaces the field's text
     and presses that pill (the tray tile when the row is a .tray, ink otherwise).
     Typing releases it, because the question is no longer the suggestion. */
  (function prompts() {
    [].slice.call(document.querySelectorAll('[data-prompts]')).forEach(function (row) {
      var field = document.getElementById(row.getAttribute('data-prompts'));
      if (!field) return;
      var pills = [].slice.call(row.querySelectorAll('[data-prompt]'));
      function press(p) {
        pills.forEach(function (b) {
          b.classList.toggle('active', b === p);
          b.setAttribute('aria-pressed', b === p ? 'true' : 'false');
        });
      }
      pills.forEach(function (b) {
        b.addEventListener('click', function () { field.value = b.getAttribute('data-prompt'); press(b); });
      });
      field.addEventListener('input', function () { press(null); });
    });
  })();

  /* The colour helpers are the one part of this file another script legitimately
     needs: the reference page's contrast harness measures the same tokens the
     same way, and a second implementation of cvar is exactly the duplication
     this file exists to remove. Nothing else is exported. */
  window.PI = { rgb: rgb, over: over, lum: lum, ratio: ratio, cvar: cvar,
                replayMotion: replayMotion };
})();
