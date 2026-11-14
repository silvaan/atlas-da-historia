// Builds public/slice/: light historical maps (one file per year) and the base (land and present-day borders).
// Historical borders: github.com/aourednik/historical-basemaps (GPL-3.0). The original files are kept in .cache/basemaps.
// Usage: node scripts/build-slice.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { feature, mesh } from 'topojson-client';
import { regionAt } from '../src/slice/regions.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cache = join(root, '.cache/basemaps'), out = join(root, 'public/slice');
mkdirSync(cache, { recursive: true }); mkdirSync(out, { recursive: true });
export const YEARS = [1400, 1492, 1530, 1600, 1650, 1700, 1715, 1783, 1800, 1815, 1880, 1900];
const SRC = 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/';

const r2 = v => Math.round(v * 100) / 100;
/* Douglas-Peucker without recursion */
function simplify(pts, tol) {
  const n = pts.length; if (n < 5) return pts;
  const keep = new Uint8Array(n); keep[0] = keep[n - 1] = 1;
  const stack = [[0, n - 1]], t2 = tol * tol;
  while (stack.length) {
    const [a, b] = stack.pop(); if (b - a < 2) continue;
    const [ax, ay] = pts[a], [bx, by] = pts[b], dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
    let far = -1, fd = t2;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      let t = L ? ((px - ax) * dx + (py - ay) * dy) / L : 0; t = t < 0 ? 0 : t > 1 ? 1 : t;
      const d = (px - ax - t * dx) ** 2 + (py - ay - t * dy) ** 2;
      if (d > fd) { fd = d; far = i; }
    }
    if (far > 0) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
/* closed ring: split in two at the point farthest from the first, so the simplification doesn't degenerate */
function simplifyRing(ring, tol) {
  const n = ring.length - 1; if (n < 8) return ring;
  let far = 1, fd = 0;
  for (let i = 1; i < n; i++) { const d = (ring[i][0] - ring[0][0]) ** 2 + (ring[i][1] - ring[0][1]) ** 2; if (d > fd) { fd = d; far = i; } }
  const a = simplify(ring.slice(0, far + 1), tol), b = simplify(ring.slice(far), tol);
  return a.concat(b.slice(1));
}
const ringArea = r => { let s = 0, la = 0; for (let i = 0; i < r.length - 1; i++) { s += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]; la += r[i][1]; } return Math.abs(s) / 2 * Math.cos(la / Math.max(1, r.length - 1) * Math.PI / 180); };
const inRing = (ring, x, y) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
/* label point: the inside point farthest from the edge (14 x 14 grid over the largest ring) */
function labelPoint(ring) {
  let x0 = 999, x1 = -999, y0 = 999, y1 = -999;
  for (const [x, y] of ring) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  const k = Math.cos((y0 + y1) / 2 * Math.PI / 180), N = 14;
  let best = [(x0 + x1) / 2, (y0 + y1) / 2], bd = -1;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const x = x0 + (i + 0.5) / N * (x1 - x0), y = y0 + (j + 0.5) / N * (y1 - y0);
    if (!inRing(ring, x, y)) continue;
    let d = Infinity;
    for (let q = 0; q < ring.length - 1 && d > bd; q++) {
      const [ax, ay] = ring[q], [bx, by] = ring[q + 1], dx = (bx - ax) * k, dy = by - ay, L = dx * dx + dy * dy;
      let t = L ? (((x - ax) * k) * dx + (y - ay) * dy) / L : 0; t = t < 0 ? 0 : t > 1 ? 1 : t;
      const e = ((x - ax) * k - t * dx) ** 2 + (y - ay - t * dy) ** 2; if (e < d) d = e;
    }
    if (d > bd) { bd = d; best = [x, y]; }
  }
  return [best, Math.sqrt(Math.max(bd, 0))];
}
const flat = ring => ring.flatMap(([x, y]) => [r2(x), r2(y)]);
const polysOf = g => !g ? [] : g.type === 'MultiPolygon' ? g.coordinates : g.type === 'Polygon' ? [g.coordinates] : [];

for (const y of YEARS) {
  const file = join(cache, `world_${y}.geojson`);
  if (!existsSync(file)) { console.log('downloading', y); writeFileSync(file, Buffer.from(await (await fetch(SRC + `world_${y}.geojson`)).arrayBuffer())); }
  const gj = JSON.parse(readFileSync(file, 'utf8')), feats = [];
  let pts = 0;
  for (const f of gj.features) {
    const name = f.properties.NAME; if (!name) continue;
    const rings = []; let area = 0, big = null, bigA = 0;
    for (const poly of polysOf(f.geometry)) {
      const a = ringArea(poly[0]); if (a < 0.015) continue;      // islets
      area += a;
      const tol = a > 40 ? 0.05 : 0.03;
      poly.forEach((r, i) => { if (i && ringArea(r) < 0.05) return; const s = simplifyRing(r, tol); if (s.length >= 4) rings.push(s); });
      if (a > bigA) { bigA = a; big = poly[0]; }
    }
    if (!rings.length) continue;
    const [[cx, cy], inner] = labelPoint(simplifyRing(big, 0.15));
    const subj = f.properties.SUBJECTO && f.properties.SUBJECTO !== name ? f.properties.SUBJECTO : 0;
    pts += rings.reduce((s, r) => s + r.length, 0);
    feats.push([name, subj, f.properties.BORDERPRECISION | 0, regionAt(cx, cy) || 0, r2(area), r2(cx), r2(cy), r2(inner), rings.map(flat)]);
  }
  feats.sort((a, b) => b[4] - a[4]);                              // the large ones underneath
  const json = JSON.stringify({ y, f: feats });
  writeFileSync(join(out, `w${y}.json`), json);
  console.log(y, feats.length, 'territories,', pts, 'points,', (json.length / 1024 | 0) + ' kB');
}

/* base: land (1:50m) and present-day borders (1:110m, only the lines between countries) */
const req = p => JSON.parse(readFileSync(join(root, 'node_modules/world-atlas', p), 'utf8'));
const land50 = req('land-50m.json'), c110 = req('countries-110m.json');
const land = [];
const landGeo = feature(land50, land50.objects.land);
for (const poly of (landGeo.features || [landGeo]).flatMap(f => polysOf(f.geometry))) {
  if (ringArea(poly[0]) < 0.02) continue;
  poly.forEach((r, i) => { if (i && ringArea(r) < 0.08) return; const s = simplifyRing(r, 0.04); if (s.length >= 4) land.push(flat(s)); });
}
const lines = mesh(c110, c110.objects.countries, (a, b) => a !== b).coordinates.map(flat);
const base = JSON.stringify({ land, lines });
writeFileSync(join(out, 'base.json'), base);
console.log('base', land.length, 'land rings,', lines.length, 'lines,', (base.length / 1024 | 0) + ' kB');
