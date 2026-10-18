/* Build the pixel icons in media/icons/ from an open icon library.

   THE PASS, in one sentence: draw a Lucide line icon at the icon's own grid
   (25 cells for a page icon, 9 for a glyph inside a control), keep every cell the stroke
   covers by half or more, and write the result back out as squares. A page
   icon is shown at 50px, so its cell is 2px; a control glyph stays on the
   brand's 3px dither cell.

   WHY A THRESHOLD AND NOT THE BAYER MATRIX. Both were tried (2026-10-08). An
   ordered dither on a line icon only ever touches the antialiased edge of the
   stroke, so it does not shade anything: it fringes every line with a crawl of
   stray cells and the icon reads as out of focus. A dithered FILL inside each
   closed shape looked right on the database and the shield and wrong on every
   open path (network, waypoints), where the implicit closure fills a triangle
   nobody drew. The threshold is the version that holds on all of them.

   WHY 25, AND OFF THE BRAND CELL (changed 2026-10-09). Page icons were first
   drawn at 17 cells, so one cell of an icon was one 3px cell of the dove. At
   17 a 2-unit Lucide stroke is 1.4 cells wide, so the threshold kept one cell
   in some places and two in others, and the icons broke up. Matt picked the
   25-cell grid in the 9 October review: every stroke lands on two cells and
   the detail survives, at the cost of a cell finer than the dove's. The
   page shows each cell as a centred three-quarter square (the --px-screen
   mask on .px-icon, adopted 2026-10-15); this file still writes whole cells,
   which are what shows without the mask.

   WHY AN ODD GRID. Lucide draws on a 24-unit square whose centre line is x=12.
   On any even grid that line falls exactly on a cell boundary, so a centred
   stem covers two cells by half each and the threshold keeps one of them at
   random: the 12-cell arrow came out with its head two cells left and one cell
   right. On an odd grid the centre is the middle of a cell and every symmetric
   icon stays symmetric. 25 for page icons and 13 for the inline blank's
   chevron, which sits beside 30-36px type and can afford it. Controls do not
   use this pass: since 2026-10-15 a control's icon is a plain Lucide line.

   OUTPUT is a single path of unit squares, merged into runs along each row,
   with no fill set: the page gives it `fill: currentColor` through .px-icon,
   so the icon takes its colour from a token and follows the theme. Inline the
   path in the page rather than linking the file, for the same reason.

   Run (the two packages live outside the repo, in any scratch folder):

     npm i --prefix <dir> @resvg/resvg-js lucide-static
     NODE_PATH=<dir>/node_modules node media/mkicons.cjs <dir>/node_modules/lucide-static/icons

   Lucide is ISC-licensed; the licence line travels in each output file. */

const fs = require('fs'), path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const SRC = process.argv[2];
const OUT = path.join(__dirname, 'icons');

/* name -> [grid, Lucide stroke width]. 25 for anything set beside type, 9
   for a glyph inside a control, so it stays on the brand cell (27px in a 38px
   button) rather than dropping to a smaller one. The arrow takes a heavier
   stroke because at 9 cells a 2-unit stroke is 0.75 of a cell and the head
   breaks into single corners; at 3 it lands on one cell. */
const SET = {
  'database':             [25, 2],   // exclusive data sets
  'graduation-cap':       [25, 2],   // skills designed by experts
  'network':              [25, 2],   // connections between findings
  'chart-bar-decreasing': [25, 2],   // sources curated and ranked
  'scale':                [25, 2],   // epistemic safeguards
  'book-open':            [25, 2],   // Pl. 20, the icon margin: what it is
  'users':                [25, 2],   // Pl. 20, the icon margin: who it is for
  'door-open':            [25, 2],   // Pl. 20, the icon margin: early access
  'chevron-down':         [13, 2]    // the inline blank's affordance
};

if (!SRC || !fs.existsSync(SRC)) { console.error('usage: node mkicons.cjs <lucide-static/icons dir>'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

for (const [name, [N, sw]] of Object.entries(SET)) {
  const svg = fs.readFileSync(path.join(SRC, name + '.svg'), 'utf8')
    .replace('stroke="currentColor"', 'stroke="#000"')
    .replace('stroke-width="2"', `stroke-width="${sw}"`);
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: N } }).render();
  const W = r.width, H = r.height, px = r.pixels;

  let d = '';
  for (let y = 0; y < H; y++) {
    let x = 0;
    while (x < W) {
      if (px[(y * W + x) * 4 + 3] < 128) { x++; continue; }
      let x1 = x;
      while (x1 < W && px[(y * W + x1) * 4 + 3] >= 128) x1++;
      d += `M${x} ${y}h${x1 - x}v1h-${x1 - x}z`;
      x = x1;
    }
  }
  const out = `<!-- Lucide "${name}" (ISC), passed to a ${N}-cell grid by media/mkicons.cjs -->\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges"><path d="${d}"/></svg>\n`;
  fs.writeFileSync(path.join(OUT, name + '.svg'), out);
  console.log(name.padEnd(22), `${W}x${H}`, d.length + ' chars');
}
