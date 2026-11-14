// Layers over the terrain: empire territories, borders, rivers, roads and sea routes.
import * as THREE from 'three';
import { toUV, isWater } from '../data/grid.js';
import { EMPIRE_COLORS, MISC } from '../data/palette.js';
import { RIVERS } from '../data/rivers.js';
import { routeVia } from './paths.js';
import { flowLine } from './flowline.js';

function bbox(p) { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const [x, y] of p) { a = Math.min(a, x); c = Math.max(c, x); b = Math.min(b, y); d = Math.max(d, y); } return [a, b, c, d]; }
function pip(x, y, poly, bb) {
  if (x < bb[0] || x > bb[2] || y < bb[1] || y > bb[3]) return false;
  let ins = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins; }
  return ins;
}

/* which empire controls each land square */
export function rasterEmpires(grid, era) {
  const { cols, rows, lon0, lat0, step, terr } = grid, owner = new Int8Array(cols * rows).fill(-1);
  const polys = era.empires.map(e => e.poly.map(p => [p, bbox(p)]));
  const acc = era.empires.map(() => [0, 0, 0]);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c; if (isWater(terr[i])) continue;
    const lon = lon0 + (c + 0.5) * step, lat = lat0 - (r + 0.5) * step;
    for (let e = 0; e < polys.length; e++) if (polys[e].some(([p, bb]) => pip(lon, lat, p, bb))) {
      owner[i] = e; if (pip(lon, lat, polys[e][0][0], polys[e][0][1])) { acc[e][0] += c + 0.5; acc[e][1] += r + 0.5; acc[e][2]++; } break;
    }
  }
  const colorIdx = new Int8Array(owner.length).fill(-1);
  for (let i = 0; i < owner.length; i++) if (owner[i] >= 0) colorIdx[i] = era.empires[owner[i]].c;
  const labels = era.empires.map((e, k) => acc[k][2] ? { name: e.name, u: acc[k][0] / acc[k][2], v: acc[k][1] / acc[k][2], size: acc[k][2] } : null).filter(Boolean);
  return { owner, colorIdx, labels };
}

/* ribbons (thin quads) along a polyline in the XZ plane */
class Ribbons {
  constructor() { this.pos = []; this.col = []; this.idx = []; this.v = 0; }
  seg(a, b, w, color) {
    const dx = b[0] - a[0], dz = b[2] - a[2], L = Math.hypot(dx, dz) || 1, nx = -dz / L * w / 2, nz = dx / L * w / 2;
    for (const p of [[a[0] + nx, a[1], a[2] + nz], [a[0] - nx, a[1], a[2] - nz], [b[0] - nx, b[1], b[2] - nz], [b[0] + nx, b[1], b[2] + nz]]) { this.pos.push(...p); this.col.push(color.r, color.g, color.b); }
    const v = this.v; this.idx.push(v, v + 1, v + 2, v, v + 2, v + 3); this.v += 4;
  }
  rect(x0, z0, x1, z1, y, color) { for (const p of [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]]) { this.pos.push(...p); this.col.push(color.r, color.g, color.b); } const v = this.v; this.idx.push(v, v + 2, v + 1, v, v + 3, v + 2); this.v += 4; }
  mesh(opts = {}) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setIndex(this.idx);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: !!opts.opacity, opacity: opts.opacity ?? 1, depthWrite: !opts.opacity }));
    m.renderOrder = opts.order || 1; return m;
  }
}

export function buildBorders(grid, owner, era, Y, w = 0.16, opacity) {
  const { cols, rows } = grid, R = new Ribbons(), lift = 0.018;
  const colors = EMPIRE_COLORS.map(h => new THREE.Color(h).offsetHSL(0, 0.05, -0.12));
  const colOf = i => colors[era.empires[owner[i]].c];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c, a = owner[i];
    const test = (j, inside) => { // edge between i and j; draw the band on the inner side of each owner
      if (j < 0) return; const b = owner[j]; if (a === b || isWater(grid.terr[j]) || isWater(grid.terr[i])) return;
      const y = Math.max(Y[i], Y[j]) + lift;
      if (a >= 0) inside(i, y, colOf(i), false);
      if (b >= 0) inside(j, y, colOf(j), true);
    };
    if (c + 1 < cols) test(i + 1, (k, y, cl, other) => other ? R.rect(c + 1, r, c + 1 + w, r + 1, y, cl) : R.rect(c + 1 - w, r, c + 1, r + 1, y, cl));
    if (r + 1 < rows) test(i + cols, (k, y, cl, other) => other ? R.rect(c, r + 1, c + 1, r + 1 + w, y, cl) : R.rect(c, r + 1 - w, c + 1, r + 1, y, cl));
  }
  return R.mesh({ order: 2, opacity });
}

function sampleLine(pts, grid, Y, yOff, every = 0.4) {
  const out = [];
  for (let k = 0; k + 1 < pts.length; k++) {
    const [u0, v0] = pts[k], [u1, v1] = pts[k + 1], n = Math.max(1, Math.ceil(Math.hypot(u1 - u0, v1 - v0) / every));
    for (let s = (k ? 1 : 0); s <= n; s++) {
      const u = u0 + (u1 - u0) * s / n, v = v0 + (v1 - v0) * s / n;
      const i = Math.min(grid.rows - 1, Math.max(0, Math.floor(v))) * grid.cols + Math.min(grid.cols - 1, Math.max(0, Math.floor(u)));
      out.push([u, yOff === 'sea' ? Y[i] + 0.012 : Math.max(0, Y[i]) + 0.025, v]);
    }
  }
  return out;
}

export function buildRivers(grid, Y) {
  const R = new Ribbons(), c = new THREE.Color(MISC.river);
  for (const pts of Object.values(RIVERS)) {
    const s = sampleLine(pts.map(([lo, la]) => toUV(lo, la)), grid, Y);
    for (let k = 0; k + 1 < s.length; k++) R.seg(s[k], s[k + 1], 0.34, c);
  }
  return R.mesh({ order: 1 });
}

/* roads, caravans and sea routes of a period; return the meshes and the paths for the travellers */
export function buildRoutes(grid, Y, era) {
  const city = Object.fromEntries(era.cities.map(([n, lo, la]) => [n, toUV(lo, la)]));
  const paths = { road: [], caravan: [], lane: [] };
  // roads and caravans go around the sea; sea routes go around the land
  for (const kind of ['roads', 'caravans']) for (const names of era[kind] || []) {
    const pts = names.map(n => city[n]).filter(Boolean); if (pts.length < 2) continue;
    for (const part of routeVia(grid, 'land', pts)) paths[kind === 'roads' ? 'road' : 'caravan'].push(sampleLine(part, grid, Y));
  }
  for (const l of era.lanes || []) for (const part of routeVia(grid, 'sea', l.map(([lo, la]) => toUV(lo, la)))) paths.lane.push(sampleLine(part, grid, Y, 'sea', 0.35));
  // minimum width in pixels: routes stay visible with the whole map on screen; the dash moves in the direction of travel
  const group = new THREE.Group();
  if (paths.road.length) group.add(flowLine(paths.road, { color: MISC.road, px: 1.6, minW: 0.13, opacity: 0.9, order: 3 }));
  if (paths.caravan.length) group.add(flowLine(paths.caravan, { color: MISC.road, px: 1.4, minW: 0.09, dashPx: 6, gap: 0.4, opacity: 0.85, order: 3 }));
  if (paths.lane.length) group.add(flowLine(paths.lane, { color: MISC.lane, px: 1.6, minW: 0.08, dashPx: 9, gap: 0.45, speed: 0.25, opacity: 0.8, order: 3 }));
  return { group, paths };
}
