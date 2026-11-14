// Paths across the grid: ships only by water, carts and caravans only by land (A* with a cost per terrain).
import { T, isWater } from '../data/grid.js';

const LAND_COST = { [T.PLAIN]: 1, [T.FLOOD]: 1, [T.STEPPE]: 1.1, [T.DESERT]: 1.5, [T.TUNDRA]: 1.6, [T.FOREST]: 1.7, [T.HILL]: 2.2, [T.JUNGLE]: 2.6, [T.MOUNT]: 5, [T.ICE]: 8 };
const cost = (mode, t) => mode === 'sea' ? (isWater(t) ? (t === T.SHALLOW ? 1.15 : 1) : Infinity) : (isWater(t) ? Infinity : LAND_COST[t] ?? 1.5);

const DIRS = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2]];
const cache = new Map();
let g = null, from = null, stamp = null, run = 0;

/* nearest passable square to (u, v) */
export function snap(grid, mode, u, v, maxR = 8) {
  const c0 = Math.floor(u), r0 = Math.floor(v);
  for (let R = 0; R <= maxR; R++) {
    let best = -1, bd = Infinity;
    for (let dr = -R; dr <= R; dr++) for (let dc = -R; dc <= R; dc++) {
      if (Math.max(Math.abs(dr), Math.abs(dc)) !== R) continue;
      const c = c0 + dc, r = r0 + dr; if (c < 0 || r < 0 || c >= grid.cols || r >= grid.rows) continue;
      const i = r * grid.cols + c; if (cost(mode, grid.terr[i]) === Infinity) continue;
      const d = (c + 0.5 - u) ** 2 + (r + 0.5 - v) ** 2; if (d < bd) { bd = d; best = i; }
    }
    if (best >= 0) return best;
  }
  return -1;
}

function astar(grid, mode, s, t) {
  const { cols, rows, terr } = grid, N = cols * rows;
  if (!g) { g = new Float32Array(N); from = new Int32Array(N); stamp = new Uint32Array(N); }
  run++;
  const tc = t % cols, tr = (t / cols) | 0, h = i => { const dc = Math.abs(i % cols - tc), dr = Math.abs(((i / cols) | 0) - tr); return (Math.max(dc, dr) + (Math.SQRT2 - 1) * Math.min(dc, dr)); };
  const heap = [], push = (i, f) => { heap.push([f, i]); let k = heap.length - 1; while (k) { const p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; [heap[p], heap[k]] = [heap[k], heap[p]]; k = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let k = 0; for (;;) { const a = 2 * k + 1, b = a + 1; let m = k; if (a < heap.length && heap[a][0] < heap[m][0]) m = a; if (b < heap.length && heap[b][0] < heap[m][0]) m = b; if (m === k) break; [heap[m], heap[k]] = [heap[k], heap[m]]; k = m; } } return top; };
  stamp[s] = run; g[s] = 0; from[s] = -1; push(s, h(s));
  while (heap.length) {
    const [f, i] = pop();
    if (i === t) break;
    const gi = g[i]; if (f - h(i) > gi + 1e-4) continue;
    const c = i % cols, r = (i / cols) | 0;
    for (const [dc, dr, len] of DIRS) {
      const cc = c + dc, rr = r + dr; if (cc < 0 || rr < 0 || cc >= cols || rr >= rows) continue;
      const j = rr * cols + cc, cj = cost(mode, terr[j]); if (cj === Infinity) continue;
      if (dc && dr && (cost(mode, terr[r * cols + cc]) === Infinity || cost(mode, terr[rr * cols + c]) === Infinity)) continue; // without cutting corners
      const ng = gi + len * (cj + cost(mode, terr[i])) / 2;
      if (stamp[j] !== run || ng < g[j]) { stamp[j] = run; g[j] = ng; from[j] = i; push(j, ng + h(j)); }
    }
  }
  if (stamp[t] !== run) return null;
  const out = []; for (let i = t; i !== -1; i = from[i]) out.push(i);
  return out.reverse();
}

/* does the segment from a to b cross only passable squares? Walks exactly each square it crosses (including at the corners) */
function clear(grid, mode, a, b) {
  const ok = (c, r) => cost(mode, grid.terr[r * grid.cols + c]) !== Infinity;
  let c = Math.floor(a[0]), r = Math.floor(a[1]);
  const c1 = Math.floor(b[0]), r1 = Math.floor(b[1]), dx = b[0] - a[0], dy = b[1] - a[1];
  const sx = Math.sign(dx), sy = Math.sign(dy);
  const tdx = sx ? Math.abs(1 / dx) : Infinity, tdy = sy ? Math.abs(1 / dy) : Infinity;
  let tx = sx > 0 ? (c + 1 - a[0]) * tdx : sx < 0 ? (a[0] - c) * tdx : Infinity;
  let ty = sy > 0 ? (r + 1 - a[1]) * tdy : sy < 0 ? (a[1] - r) * tdy : Infinity;
  if (!ok(c, r)) return false;
  for (let guard = 0; (c !== c1 || r !== r1) && guard < 10000; guard++) {
    if (Math.abs(tx - ty) < 1e-9) { if (!ok(c + sx, r) || !ok(c, r + sy)) return false; c += sx; r += sy; tx += tdx; ty += tdy; }
    else if (tx < ty) { c += sx; tx += tdx; } else { r += sy; ty += tdy; }
    if (!ok(c, r)) return false;
  }
  return true;
}

/* path [u, v] from a to b; null if there is none */
export function route(grid, mode, a, b) {
  const key = mode + a.map(x => x.toFixed(2)) + b.map(x => x.toFixed(2));
  if (cache.has(key)) return cache.get(key);
  const s = snap(grid, mode, a[0], a[1]), t = snap(grid, mode, b[0], b[1]);
  let res = null;
  if (s >= 0 && t >= 0) {
    const cells = s === t ? [s] : astar(grid, mode, s, t);
    if (cells) {
      const pts = cells.map(i => [i % grid.cols + 0.5, Math.floor(i / grid.cols) + 0.5]);
      // pull the string: skip points while the straight line stays passable
      const simple = [pts[0]];
      let k = 0;
      while (k < pts.length - 1) { let m = k + 1; while (m + 1 < pts.length && clear(grid, mode, pts[k], pts[m + 1])) m++; simple.push(pts[m]); k = m; }
      res = simple;
    }
  }
  cache.set(key, res);
  return res;
}

/* link several points in sequence; impossible stretches (e.g. an island with no bridge) are skipped */
export function routeVia(grid, mode, waypoints) {
  const parts = [];
  let cur = [];
  for (let k = 0; k + 1 < waypoints.length; k++) {
    const p = route(grid, mode, waypoints[k], waypoints[k + 1]);
    if (!p) { if (cur.length > 1) parts.push(cur); cur = []; continue; }
    cur.push(...(cur.length ? p.slice(1) : p));
  }
  if (cur.length > 1) parts.push(cur);
  return parts;
}

export const passable = (grid, mode, u, v) => {
  const c = Math.floor(u), r = Math.floor(v);
  return c >= 0 && r >= 0 && c < grid.cols && r < grid.rows && cost(mode, grid.terr[r * grid.cols + c]) !== Infinity;
};

/* passable with clearance r around it (a person's body does not end up half in the water) */
export const passableBox = (grid, mode, u, v, r = 0.02) =>
  passable(grid, mode, u - r, v - r) && passable(grid, mode, u + r, v - r) && passable(grid, mode, u - r, v + r) && passable(grid, mode, u + r, v + r);
