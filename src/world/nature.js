// Trees in the forests and snowy peaks in the mountains.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { T } from '../data/grid.js';
import { MISC } from '../data/palette.js';

export function colored(geo, hex) {
  const c = new THREE.Color(hex), n = geo.getAttribute('position').count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  geo.setAttribute('color', new THREE.BufferAttribute(a, 3)); return geo;
}
export const merge = parts => mergeGeometries(parts.map(g => g.index ? g.toNonIndexed() : g));
const hash = (a, b) => { let h = Math.imul(a * 374761393 + b * 668265263, 1274126177); h ^= h >>> 13; return ((h >>> 0) % 10000) / 10000; };

const CHUNK = 48;   // squares per side of each block; blocks off screen are not drawn

export function buildNature(grid, Y) {
  const { cols, rows, terr, level } = grid, group = new THREE.Group();
  const trunk = (h, r = 0.012) => colored(new THREE.CylinderGeometry(r * 0.8, r, h, 4, 1, true).translate(0, h / 2, 0), MISC.trunk);
  const geos = {
    pine: merge([trunk(0.05), colored(new THREE.ConeGeometry(0.06, 0.16, 5, 1, true).translate(0, 0.12, 0), MISC.pine)]),
    leafy: merge([trunk(0.06), colored(new THREE.IcosahedronGeometry(0.065, 0).translate(0, 0.1, 0), MISC.leaf)]),
    palm: merge([trunk(0.12, 0.013), colored(new THREE.OctahedronGeometry(0.075, 0).scale(1, 0.45, 1).translate(0, 0.13, 0), MISC.palm)]),
    peak: colored(new THREE.ConeGeometry(0.46, 0.55, 5, 1, true).translate(0, 0.275, 0), '#8F8472'),
    snowy: merge([colored(new THREE.ConeGeometry(0.46, 0.55, 5, 1, true).translate(0, 0.275, 0), '#8F8472'), colored(new THREE.ConeGeometry(0.19, 0.23, 5, 1, true).translate(0, 0.442, 0), MISC.snow)])
  };
  const nx = Math.ceil(cols / CHUNK), lists = {};
  for (const k in geos) lists[k] = new Map();
  const put = (k, c, r, item) => { const key = Math.floor(r / CHUNK) * nx + Math.floor(c / CHUNK); let L = lists[k].get(key); if (!L) lists[k].set(key, L = []); L.push(item); };
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c, t = terr[i], lat = grid.lat0 - (r + 0.5) * grid.step;
    if (t === T.FOREST || t === T.JUNGLE) {
      const kind = t === T.JUNGLE ? 'palm' : Math.abs(lat) > 42 ? 'pine' : 'leafy';
      for (let k = 0; k < 3; k++) put(kind, c, r, [c + 0.15 + hash(c, r * 3 + k) * 0.7, Y[i], r + 0.15 + hash(r, c * 3 + k) * 0.7, 0.8 + hash(c + k, r) * 0.5]);
    } else if (t === T.MOUNT) {
      const h = hash(c * 7, r * 5);
      put(level[i] >= 10 ? 'snowy' : 'peak', c, r, [c + 0.3 + h * 0.4, Y[i], r + 0.3 + hash(r * 7, c * 5) * 0.4, 0.75 + (level[i] - 7) * 0.13 + h * 0.2]);
    }
  }
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, side: THREE.DoubleSide });
  const out = {};
  for (const k in geos) {
    out[k] = new THREE.Group(); group.add(out[k]);
    for (const L of lists[k].values()) {
      const mesh = new THREE.InstancedMesh(geos[k], mat, L.length);
      L.forEach(([x, y, z, sc], j) => { q.setFromAxisAngle(up, hash(j, x | 0) * 6.28); m.compose(p.set(x, y, z), q, s.set(sc, sc, sc)); mesh.setMatrixAt(j, m); });
      mesh.computeBoundingSphere(); out[k].add(mesh);
    }
  }
  return { group, trees: [out.pine, out.leafy, out.palm], peaks: [out.peak, out.snowy] };
}
