// Block terrain: a single mesh with the top of each square and walls where the neighbour is lower.
import * as THREE from 'three';
import { T, isWater } from '../data/grid.js';
import { TERRAIN_COLORS } from '../data/palette.js';

const WHITE = new THREE.Color('#ffffff');
export const LEVEL_H = 0.11;          // height of each relief level, in squares
export const SEA_Y = { [T.DEEP]: -0.22, [T.SHALLOW]: -0.08 };

export function tileY(grid, i) {
  const t = grid.terr[i];
  return isWater(t) ? SEA_Y[t] : grid.level[i] * LEVEL_H;
}

export function buildTerrain(grid) {
  const { cols, rows, terr } = grid, N = cols * rows;
  const pos = [], nor = [], col = [], idx = [];
  const topStart = new Int32Array(N).fill(-1);
  const base = new Float32Array(N * 3);
  const c = new THREE.Color(), tmp = new THREE.Color();
  const shade = (i) => { const h = Math.sin(i * 12.9898) * 43758.5453; return (h - Math.floor(h)) * 0.08 - 0.04; };
  let v = 0;
  const quad = (a, b, cc, d, n, color) => {
    for (const p of [a, b, cc, d]) { pos.push(p[0], p[1], p[2]); nor.push(n[0], n[1], n[2]); col.push(color.r, color.g, color.b); }
    idx.push(v, v + 2, v + 1, v, v + 3, v + 2); v += 4;
  };
  const Y = new Float32Array(N); for (let i = 0; i < N; i++) Y[i] = tileY(grid, i);
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    const i = r * cols + q, t = terr[i];
    if (t === T.DEEP) continue;                      // the deep ocean is a single plane
    const y = Y[i];
    c.set(TERRAIN_COLORS[t]); c.offsetHSL(0, 0, shade(i));
    base[i * 3] = c.r; base[i * 3 + 1] = c.g; base[i * 3 + 2] = c.b;
    topStart[i] = v;
    quad([q, y, r], [q + 1, y, r], [q + 1, y, r + 1], [q, y, r + 1], [0, 1, 0], c);
    tmp.copy(c).multiplyScalar(0.82);
    const side = (j, a, b, n) => { const yn = j < 0 ? SEA_Y[T.DEEP] : Y[j]; if (yn >= y - 1e-4) return; quad([a[0], y, a[1]], [b[0], y, b[1]], [b[0], yn, b[1]], [a[0], yn, a[1]], n, tmp); };
    side(r + 1 < rows ? i + cols : -1, [q + 1, r + 1], [q, r + 1], [0, 0, 1]);
    side(r > 0 ? i - cols : -1, [q, r], [q + 1, r], [0, 0, -1]);
    side(q + 1 < cols ? i + 1 : -1, [q + 1, r], [q + 1, r + 1], [1, 0, 0]);
    side(q > 0 ? i - 1 : -1, [q, r + 1], [q, r], [-1, 0, 0]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  const mesh = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }));
  mesh.matrixAutoUpdate = false;

  const ocean = new THREE.Mesh(new THREE.PlaneGeometry(cols * 3, rows * 3, 360, 180), new THREE.MeshLambertMaterial({ color: TERRAIN_COLORS[T.DEEP] }));
  ocean.rotation.x = -Math.PI / 2; ocean.position.set(cols / 2, SEA_Y[T.DEEP], rows / 2);

  /* tint the tops of the squares with the empire colour (emp[i] = colour index or -1) */
  function tint(emp, palette, strength) {
    const attr = g.getAttribute('color'), arr = attr.array, pc = palette.map(h => new THREE.Color(h).lerp(WHITE, 0.3));
    for (let i = 0; i < N; i++) {
      const s = topStart[i]; if (s < 0) continue;
      let r = base[i * 3], gg = base[i * 3 + 1], b = base[i * 3 + 2];
      const e = emp[i];
      if (e >= 0 && !isWater(terr[i])) {
        // the target has the empire colour and the terrain's light/shade, so the relief stays readable
        const p = pc[e], L = 0.2126 * r + 0.7152 * gg + 0.0722 * b, f = Math.min(1.15, Math.max(0.72, 0.62 + L * 0.9));
        r += (p.r * f - r) * strength; gg += (p.g * f - gg) * strength; b += (p.b * f - b) * strength;
      }
      for (let k = 0; k < 4; k++) { arr[(s + k) * 3] = r; arr[(s + k) * 3 + 1] = gg; arr[(s + k) * 3 + 2] = b; }
    }
    attr.needsUpdate = true;
  }
  return { mesh, ocean, tint, Y };
}
