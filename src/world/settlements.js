// Cities: houses, temples and cultivated fields around them (instanced meshes).
import * as THREE from 'three';
import { toUV, isWater } from '../data/grid.js';
import { ROOF_COLORS, MISC } from '../data/palette.js';
import { snap } from './paths.js';

export function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export const groundY = (grid, Y, u, v) => { const i = Math.min(grid.rows - 1, Math.max(0, Math.floor(v))) * grid.cols + Math.min(grid.cols - 1, Math.max(0, Math.floor(u))); return Math.max(0, Y[i]); };

/* the period's cities; those that fall on a water square (coast cut by the grid) move to the nearest land */
export function cityList(era, grid) {
  return era.cities.map(([name, lon, lat, size, cul, cap, houses], i) => {
    let [u, v] = toUV(lon, lat);
    if (grid && isWater(grid.terr[Math.floor(v) * grid.cols + Math.floor(u)])) {
      const j = snap(grid, 'land', u, v, 3);
      if (j >= 0) { const c = j % grid.cols, r = Math.floor(j / grid.cols); u = Math.min(c + 0.95, Math.max(c + 0.05, u)); v = Math.min(r + 0.95, Math.max(r + 0.05, v)); }
    }
    let h = 7; for (const ch of name) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);   // seed from the name: the city grows without moving
    return { name, u, v, size, cul, cap: !!cap, i, seed: h >>> 0, houses: houses ?? HOUSES[size] };
  });
}

const HOUSES = [0, 12, 26, 46];

export function buildSettlements(grid, Y, cities) {
  const group = new THREE.Group();
  const houses = [], fields = [];
  for (const c of cities) {
    // the first houses go in the centre; the next ones go farther out (the city grows outwards)
    const R = rng(c.seed), n = c.houses, max = HOUSES[3], rad = 0.3 + c.size * 0.32, hut = c.cul === 'x';
    for (let k = 0; k < n; k++) {
      const a = R() * Math.PI * 2, r = Math.sqrt((k + R()) / max) * (0.3 + 3 * 0.32) * (hut ? 0.55 : 0.85), u = c.u + Math.cos(a) * r, v = c.v + Math.sin(a) * r;
      const w = 0.09 + R() * 0.08, d = 0.09 + R() * 0.08, h = 0.06 + R() * 0.07, rot = (R() - 0.5) * 0.6;
      const i = Math.floor(v) * grid.cols + Math.floor(u); if (isWater(grid.terr[i])) continue;
      houses.push(hut ? { u, v, w: w * 1.5, d: w * 1.5, h: 0.025, rot, roof: ROOF_COLORS.x, hut: true } : { u, v, w, d, h, rot, roof: ROOF_COLORS[c.cul] || ROOF_COLORS.r });
    }
    if (c.cap || c.size === 3) houses.push({ u: c.u, v: c.v, w: 0.3, d: 0.22, h: 0.13, rot: 0, roof: MISC.temple, temple: true });
    for (let k = 0; k < 10 + c.size * 12; k++) {
      const a = R() * Math.PI * 2, r = rad + 0.25 + R() * (0.9 + c.size * 0.4), u = c.u + Math.cos(a) * r, v = c.v + Math.sin(a) * r;
      const i = Math.floor(v) * grid.cols + Math.floor(u); if (isWater(grid.terr[i])) continue;
      fields.push({ u, v, s: 0.18 + R() * 0.16, rot: R() * Math.PI, ripe: R() });
    }
  }
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), col = new THREE.Color();
  const wallGeo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  const roofGeo = new THREE.ConeGeometry(0.75, 0.55, 4, 1).rotateY(Math.PI / 4).translate(0, 0.275, 0);
  const walls = new THREE.InstancedMesh(wallGeo, new THREE.MeshLambertMaterial({ color: MISC.wall }), houses.length);
  const roofs = new THREE.InstancedMesh(roofGeo, new THREE.MeshLambertMaterial({ color: '#ffffff' }), houses.length);
  houses.forEach((h, k) => {
    const y = groundY(grid, Y, h.u, h.v);
    q.setFromAxisAngle(up, h.rot);
    m.compose(p.set(h.u, y, h.v), q, s.set(h.w, h.h, h.d)); walls.setMatrixAt(k, m);
    m.compose(p.set(h.u, y + h.h, h.v), q, s.set(h.w * 1.08, h.hut ? 0.11 : h.h * (h.temple ? 0.5 : 0.8), h.d * 1.08)); roofs.setMatrixAt(k, m);
    roofs.setColorAt(k, col.set(h.roof));
  });
  const fieldGeo = new THREE.BoxGeometry(1, 0.012, 1).translate(0, 0.006, 0);
  const fieldMesh = new THREE.InstancedMesh(fieldGeo, new THREE.MeshLambertMaterial({ color: '#ffffff' }), fields.length);
  fields.forEach((f, k) => {
    const y = groundY(grid, Y, f.u, f.v);
    q.setFromAxisAngle(up, f.rot); m.compose(p.set(f.u, y, f.v), q, s.set(f.s, 1, f.s * 0.6)); fieldMesh.setMatrixAt(k, m);
    fieldMesh.setColorAt(k, col.set(f.ripe > 0.5 ? '#D9B95A' : '#8FB35A').offsetHSL(0, 0, (f.ripe - 0.5) * 0.08));
  });
  for (const x of [walls, roofs, fieldMesh]) { x.frustumCulled = false; group.add(x); }
  return { group, houses: [walls, roofs], fields: fieldMesh, list: houses };
}
