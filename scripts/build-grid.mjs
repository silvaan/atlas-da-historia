// Generates public/world.bin: for each 0.5° square, [terrain type, height level].
// Real coastlines (Natural Earth via world-atlas); relief and biomes from rules + noise.
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { GRID, T } from '../src/data/grid.js';
import { RIVERS } from '../src/data/rivers.js';

const { cols, rows, lon0, lat0, step } = GRID;
const N = cols * rows;
const topo = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/land-50m.json', import.meta.url)));
const land = feature(topo, topo.objects.land);
const geoms = (land.features ? land.features.map(f => f.geometry) : [land.geometry]);
const rings = [];
for (const g of geoms) {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  for (const p of polys) for (const r of p) rings.push(r);
}
// edges indexed by latitude band for the scanline fill.
// Rings that cross ±180° are "unwrapped" (continuous longitudes, possibly beyond 180) and filled wrapping around the map.
const edges = [];
for (const r of rings) {
  let jumps = 0; for (let i = 0; i < r.length - 1; i++) if (Math.abs(r[i + 1][0] - r[i][0]) > 180) jumps++;
  let off = 0, prev = r[0][0];
  const pts = r.map(([x, y], i) => { if (i && jumps % 2 === 0) { if (x - prev > 180) off -= 360; else if (prev - x > 180) off += 360; } prev = x; return [x + off, y]; });
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    if (y0 === y1 || Math.abs(x1 - x0) > 180) continue;   // ring around the pole (Antarctica): outside the grid
    edges.push([x0, y0, x1, y1, Math.min(y0, y1), Math.max(y0, y1)]);
  }
}
const isLand = new Uint8Array(N);
for (let row = 0; row < rows; row++) {
  const lat = lat0 - (row + 0.5) * step, xs = [];
  for (const [x0, y0, x1, y1, a, b] of edges) if (lat >= a && lat < b) xs.push(x0 + (lat - y0) / (y1 - y0) * (x1 - x0));
  xs.sort((p, q) => p - q);
  for (let k = 0; k + 1 < xs.length; k += 2) {
    const c0 = Math.ceil((xs[k] - lon0) / step - 0.5), c1 = Math.floor((xs[k + 1] - lon0) / step - 0.5);
    for (let c = c0; c <= c1; c++) isLand[row * cols + ((c % cols) + cols) % cols] = 1;
  }
}

// deterministic noise
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const R = rng(7), P = new Float32Array(65536); for (let i = 0; i < P.length; i++) P[i] = R();
const vv = (x, y) => P[((y & 255) << 8) | (x & 255)], sm = t => t * t * (3 - 2 * t);
const n1 = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi); const a = vv(xi, yi), b = vv(xi + 1, yi), c = vv(xi, yi + 1), d = vv(xi + 1, yi + 1); return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf; };
const noise = (x, y) => (n1(x, y) + n1(x * 2.1, y * 2.1) * 0.5 + n1(x * 4.3, y * 4.3) * 0.25) / 1.75;

const B = (lon, lat, b) => lon >= b[0] && lon <= b[1] && lat >= b[2] && lat <= b[3];
const MOUNTAINS = [[72, 100, 27, 37], [66, 75, 34, 38], [70, 95, 40, 45], [85, 100, 46, 52], [-79, -75, -10, 5], [-78, -68, -20, -10], [-72, -67, -35, -20], [-74, -70, -55, -35],
  [-122, -105, 35, 60], [-124, -118, 35, 50], [-155, -140, 58, 64], [-106, -96, 17, 26], [6, 16, 45, 47.8], [-2, 3, 42, 43.3], [38, 49, 41, 44], [44, 58, 27, 37], [-9, 10, 30, 36.5], [35, 42, 6, 15]];
const HILLS = [[18, 26, 45, 49.5], [19, 25, 41, 44], [30, 40, 36.5, 39], [28, 38, -10, 2], [26, 32, -32, -26], [56, 62, 48, 68], [5, 18, 60, 70], [-85, -72, 34, 46], [143, 153, -38, -15],
  [130, 145, 32, 44], [50, 62, 28, 36], [28, 44, 37, 41], [-50, -40, -22, -12], [100, 112, 22, 32], [-4, 4, 40, 43], [-8, -1, 37, 42]];
const DESERTS = [[-17, 32, 16, 30], [20, 30, 22, 30], [36, 58, 14, 31], [53, 62, 27, 33], [69, 75, 24, 29], [54, 66, 37, 43], [77, 90, 37, 41], [92, 115, 39, 46], [116, 142, -31, -19],
  [13, 24, -28, -17], [-72, -69, -27, -17], [-117, -108, 28, 37]];
const STEPPES = [[30, 95, 44, 52], [-108, -96, 32, 50], [-17, 40, 12, 16], [-72, -64, -50, -38], [95, 122, 43, 50], [40, 56, 46, 52], [-66, -57, -38, -30]];
const JUNGLES = [[-75, -45, -15, 5], [-80, -50, -5, 9], [8, 30, -8, 6], [-12, 8, 4, 9], [94, 155, -9, 8], [-92, -77, 7, 18], [98, 108, 8, 22], [73, 78, 8, 16]];

function biome(lon0_, lat0_) {
  const lon = lon0_ + (noise(lon0_ * 0.09 + 11, lat0_ * 0.09 + 3) - 0.5) * 9, lat = lat0_ + (noise(lon0_ * 0.09 + 31, lat0_ * 0.09 + 17) - 0.5) * 7;
  const a = Math.abs(lat), m = noise(lon0_ * 0.18 + 50, lat0_ * 0.18 + 50);
  if (B(lon, lat, [-55, -20, 60, 84]) && m > 0.2) return [T.ICE, 3];
  if (a > 75) return [T.ICE, 2];
  if (a > 65) return [T.TUNDRA, 1];
  if (MOUNTAINS.some(b => B(lon, lat, b))) return m > 0.42 ? [T.MOUNT, 5 + Math.round(m * 6)] : [T.HILL, 3];
  if (HILLS.some(b => B(lon, lat, b))) return m > 0.55 ? [T.HILL, 3 + Math.round(m * 2)] : [T.FOREST, 1];
  if (DESERTS.some(b => B(lon, lat, b))) return m > 0.74 ? [T.HILL, 2] : [T.DESERT, 1];
  if (STEPPES.some(b => B(lon, lat, b))) return [T.STEPPE, 1];
  if (JUNGLES.some(b => B(lon, lat, b))) return [T.JUNGLE, 1];
  if (a > 50 && m > 0.32) return [T.FOREST, 1];
  if (a > 30 && m > 0.6) return [T.FOREST, 1];
  if (a <= 30 && m > 0.66) return [T.FOREST, 1];
  if (m > 0.72) return [T.HILL, 2];
  return [T.PLAIN, 1];
}

const terr = new Uint8Array(N), level = new Uint8Array(N);
for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
  const i = r * cols + c, lon = lon0 + (c + 0.5) * step, lat = lat0 - (r + 0.5) * step;
  if (!isLand[i]) continue;
  const [t, l] = biome(lon, lat); terr[i] = t; level[i] = l;
}
// shallow sea near the coast
const dist = new Uint8Array(N).fill(255);
for (let i = 0; i < N; i++) if (isLand[i]) dist[i] = 0;
for (let pass = 0; pass < 3; pass++) for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
  const i = r * cols + c; if (dist[i] !== 255) continue;
  for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const cc = c + dc, rr = r + dr; if (cc < 0 || rr < 0 || cc >= cols || rr >= rows) continue; if (dist[rr * cols + cc] === pass) { dist[i] = pass + 1; break; } }
}
for (let i = 0; i < N; i++) if (!isLand[i]) terr[i] = dist[i] <= 1 ? T.SHALLOW : T.DEEP;
// floodplains along the rivers
for (const pts of Object.values(RIVERS)) for (let k = 0; k + 1 < pts.length; k++) {
  const [a0, b0] = pts[k], [a1, b1] = pts[k + 1], steps = Math.ceil(Math.hypot(a1 - a0, b1 - b0) / step * 3);
  for (let s = 0; s <= steps; s++) {
    const lon = a0 + (a1 - a0) * s / steps, lat = b0 + (b1 - b0) * s / steps;
    const c = Math.floor((lon - lon0) / step), r = Math.floor((lat0 - lat) / step);
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const cc = c + dc, rr = r + dr; if (cc < 0 || rr < 0 || cc >= cols || rr >= rows) continue;
      const i = rr * cols + cc; if (isLand[i] && terr[i] !== T.MOUNT) { terr[i] = T.FLOOD; level[i] = 1; }
    }
  }
}
const out = new Uint8Array(N * 2);
for (let i = 0; i < N; i++) { out[i * 2] = terr[i]; out[i * 2 + 1] = level[i]; }
writeFileSync(new URL('../public/world.bin', import.meta.url), out);
const count = new Array(12).fill(0); for (let i = 0; i < N; i++) count[terr[i]]++;
console.log(`world.bin: ${cols}×${rows}, terra ${isLand.reduce((a, b) => a + b, 0)} quadrados`, count.join(' '));
