/* PEACE INTEL · REVIEW CHROME RUNTIME
   Direction switcher, theme switch and label toggle for explore-a/b/c.html.
   Never ships. Loaded in <head> so a remembered theme is set before first
   paint; system.js watches data-theme and re-maps its canvases on change. */
(function () {
  'use strict';
  var root = document.documentElement;
  var PAGES = { A: 'explore-a.html', B: 'explore-b.html', C: 'explore-c.html', D: 'explore-d.html', E: 'explore-e.html', F: 'explore-f.html', G: 'explore-g.html', H: 'explore-h.html' };

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var t = get('pi-review-theme'); if (t) root.setAttribute('data-theme', t);
  var c = get('pi-review-labels'); if (c) root.setAttribute('data-crit', c);

  document.addEventListener('DOMContentLoaded', function () {
    var here = root.getAttribute('data-direction');
    var bar = document.createElement('div');
    bar.className = 'crit-bar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Review controls');
    bar.innerHTML =
      '<div class="seg mono" aria-label="Direction">' +
        Object.keys(PAGES).map(function (k) {
          return '<button type="button" data-go="' + k + '" aria-pressed="' + (k === here) + '">' + k + '</button>';
        }).join('') +
      '</div>' +
      '<div class="seg mono" aria-label="Theme">' +
        '<button type="button" data-theme-to="light">Light</button>' +
        '<button type="button" data-theme-to="dark">Dark</button>' +
      '</div>' +
      '<button type="button" class="act" data-labels>Labels</button>';
    document.body.appendChild(bar);

    function sync() {
      var th = root.getAttribute('data-theme') || 'light';
      [].forEach.call(bar.querySelectorAll('[data-theme-to]'), function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-theme-to') === th);
      });
      var on = root.getAttribute('data-crit') !== 'off';
      var lb = bar.querySelector('[data-labels]');
      lb.classList.toggle('on', on);
      lb.setAttribute('aria-pressed', on);
    }
    sync();

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-go')) {
        var k = b.getAttribute('data-go');
        if (k !== here) location.href = PAGES[k];
      } else if (b.hasAttribute('data-theme-to')) {
        var th = b.getAttribute('data-theme-to');
        root.setAttribute('data-theme', th); set('pi-review-theme', th);
      } else if (b.hasAttribute('data-labels')) {
        var v = root.getAttribute('data-crit') === 'off' ? 'on' : 'off';
        root.setAttribute('data-crit', v); set('pi-review-labels', v);
      }
      sync();
    });
  });
})();
