// 3D monuments (simple shapes), with ruins. From far away they are a little larger than true scale, but they shrink with zoom.
import * as THREE from 'three';
import { colored, merge } from './nature.js';
import { toUV } from '../data/grid.js';
import { groundY } from './settlements.js';

/* parts */
export const B = (w, h, d, x, y, z, c) => colored(new THREE.BoxGeometry(w, h, d).translate(x, y + h / 2, z), c);
export const C = (rt, rb, h, seg, x, y, z, c, open = false) => colored(new THREE.CylinderGeometry(rt, rb, h, seg, 1, open).translate(x, y + h / 2, z), c);
export const K = (r, h, seg, x, y, z, c, rot = 0) => colored(new THREE.ConeGeometry(r, h, seg).rotateY(rot).translate(x, y + h / 2, z), c);
export const S = (r, x, y, z, c, half = true) => colored(new THREE.SphereGeometry(r, 10, 6, 0, Math.PI * 2, 0, half ? Math.PI / 2 : Math.PI).translate(x, y, z), c);
export const ring = (n, r, f) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return f(Math.cos(a) * r, Math.sin(a) * r, a, i); });

export const MODELS = {
  pyramids: () => [K(0.3, 0.36, 4, 0, 0, 0, '#D8BE85', Math.PI / 4), K(0.27, 0.33, 4, -0.42, 0, 0.32, '#D4B97E', Math.PI / 4), K(0.14, 0.17, 4, -0.7, 0, 0.6, '#CFB47A', Math.PI / 4)],
  stones: () => [...ring(12, 0.24, (x, z, a) => B(0.05, 0.12, 0.03, x, 0, z, '#9A968C').rotateY(0)), ...ring(6, 0.24, (x, z) => B(0.1, 0.025, 0.04, x, 0.12, z, '#8F8B82')), ...ring(5, 0.11, (x, z) => B(0.05, 0.14, 0.03, x, 0, z, '#A39F95'))],
  temple: () => [B(0.52, 0.05, 0.3, 0, 0, 0, '#E1D8C4'), ...Array.from({ length: 16 }, (_, i) => C(0.016, 0.018, 0.15, 6, -0.22 + (i % 8) * 0.063, 0.05, i < 8 ? -0.12 : 0.12, '#EDE6D6')), B(0.52, 0.035, 0.3, 0, 0.2, 0, '#E6DECB'), K(0.2, 0.06, 4, 0, 0.235, 0, '#D9CFB8', Math.PI / 4).scale(1.35, 1, 0.75)],
  arena: () => [colored(new THREE.CylinderGeometry(0.3, 0.3, 0.16, 20, 1, true).scale(1.25, 1, 1).translate(0, 0.08, 0), '#CDB48E'), colored(new THREE.CylinderGeometry(0.31, 0.31, 0.012, 20, 1, true).scale(1.25, 1, 1).translate(0, 0.05, 0), '#9F8762'), colored(new THREE.CylinderGeometry(0.31, 0.31, 0.012, 20, 1, true).scale(1.25, 1, 1).translate(0, 0.11, 0), '#9F8762'), colored(new THREE.CylinderGeometry(0.2, 0.2, 0.01, 16).scale(1.25, 1, 1).translate(0, 0.005, 0), '#D9C9A1')],
  steppyr: o => { const tall = o.tall ? 1.6 : 1, c = o.tall ? '#CFC5AE' : '#B9A88A'; const parts = [0, 1, 2, 3, 4].map(i => B(0.5 - i * 0.09, 0.06 * tall, 0.5 - i * 0.09, 0, i * 0.06 * tall, 0, c)); parts.push(B(0.1, 0.06, 0.1, 0, 0.3 * tall, 0, '#8E3B2E'), B(0.06, 0.32 * tall, 0.08, 0, 0, 0.26, '#A7957A')); if (o.twin) parts.push(B(0.06, 0.05, 0.1, 0.07, 0.3, 0, '#3F5F8A')); return parts; },
  dome: o => { const [w, d] = o.colors || ['#E2DCCF', '#8C98A0']; return [B(0.4, 0.12, 0.4, 0, 0, 0, w), C(0.15, 0.15, 0.05, 12, 0, 0.12, 0, w), S(0.16, 0, 0.17, 0, d), ...ring(4, 0.12, (x, z) => S(0.06, x, 0.12, z, d))]; },
  minarets: () => ring(4, 0.3, (x, z) => [C(0.018, 0.022, 0.34, 8, x, 0, z, '#EDE7DA'), K(0.025, 0.07, 8, x, 0.34, z, '#8C98A0')]).flat(),
  stupa: () => [0, 1, 2, 3].map(i => B(0.56 - i * 0.1, 0.06, 0.56 - i * 0.1, 0, i * 0.06, 0, '#8E8676')).concat([S(0.1, 0, 0.24, 0, '#9A9282'), K(0.02, 0.1, 6, 0, 0.33, 0, '#8E8676')]),
  khmer: () => [B(0.6, 0.05, 0.6, 0, 0, 0, '#9C8F73'), B(0.4, 0.06, 0.4, 0, 0.05, 0, '#A59878'), ...[[0, 0, 0.36], [0.16, 0.16, 0.24], [-0.16, 0.16, 0.24], [0.16, -0.16, 0.24], [-0.16, -0.16, 0.24]].flatMap(([x, z, h]) => [C(0.03, 0.06, h, 8, x, 0.11, z, '#A1946F'), K(0.03, 0.06, 8, x, 0.11 + h, z, '#958866')])],
  cathedral: o => { const c = o.color || '#BDB6A6'; return [B(0.16, 0.16, 0.44, 0, 0, 0.04, c), K(0.13, 0.09, 4, 0, 0.16, 0.04, '#7A7468', Math.PI / 4).scale(0.85, 1, 2.4), B(0.07, 0.3, 0.07, -0.06, 0, -0.2, c), B(0.07, 0.3, 0.07, 0.06, 0, -0.2, c), K(0.015, 0.1, 4, 0, 0.2, 0.1, '#7A7468')]; },
  keep: () => [B(0.2, 0.2, 0.2, 0, 0, 0, '#E6E0D2'), ...ring(4, 0.13, (x, z) => C(0.025, 0.025, 0.24, 8, x * 0.78, 0, z * 0.78, '#E6E0D2')), ...[[0, 0.28, 0.6, 0.03], [0, -0.28, 0.6, 0.03], [0.28, 0, 0.03, 0.6], [-0.28, 0, 0.03, 0.6]].map(([x, z, w, d]) => B(w, 0.07, d, x, 0, z, '#C9C1AF'))],
  fortress: () => [...[[0, 0.3, 0.62, 0.03], [0, -0.3, 0.62, 0.03], [0.3, 0, 0.03, 0.62], [-0.3, 0, 0.03, 0.62]].map(([x, z, w, d]) => B(w, 0.08, d, x, 0, z, '#B5483A')), ...ring(4, 0.42, (x, z) => [B(0.06, 0.14, 0.06, x * 0.71, 0, z * 0.71, '#A8402F'), K(0.05, 0.08, 4, x * 0.71, 0.14, z * 0.71, '#3D6B4F', Math.PI / 4)]).flat(), B(0.12, 0.1, 0.12, 0, 0, 0, '#F0EBDD'), S(0.05, 0, 0.1, 0, '#D9B23A'), K(0.012, 0.05, 6, 0, 0.14, 0, '#D9B23A')],
  palace: o => {
    if (o.style === 'china') return [B(0.6, 0.03, 0.5, 0, 0, 0, '#D8D2C2'), B(0.36, 0.1, 0.22, 0, 0.03, 0, '#A8322B'), K(0.28, 0.08, 4, 0, 0.13, 0, '#D9A62E', Math.PI / 4).scale(1.4, 1, 0.9), B(0.2, 0.06, 0.12, 0, 0.03, 0.2, '#A8322B'), K(0.16, 0.05, 4, 0, 0.09, 0.2, '#D9A62E', Math.PI / 4).scale(1.4, 1, 0.8)];
    if (o.style === 'tibet') return [B(0.5, 0.14, 0.2, 0, 0, 0, '#F1ECE2'), B(0.2, 0.12, 0.16, 0, 0.14, 0, '#8E2F2A'), B(0.3, 0.06, 0.18, 0, 0.26, 0, '#F1ECE2'), C(0.2, 0.35, 0.12, 8, 0, -0.1, 0.05, '#8C7F68')];
    if (o.style === 'moorish') return [B(0.46, 0.08, 0.22, 0, 0, 0, '#C77A52'), ...ring(4, 0.24, (x, z) => B(0.06, 0.13, 0.06, x * 1.1, 0, z * 0.6, '#B96C46')), B(0.16, 0.012, 0.08, 0, 0.08, 0, '#5C93A8')];
    return [B(0.6, 0.11, 0.12, 0, 0, 0, '#E3D9C3'), B(0.12, 0.11, 0.3, -0.24, 0, 0.18, '#E3D9C3'), B(0.12, 0.11, 0.3, 0.24, 0, 0.18, '#E3D9C3'), B(0.62, 0.04, 0.13, 0, 0.11, 0, '#5E6B78'), B(0.3, 0.008, 0.3, 0, 0, 0.36, '#7FA05A')];
  },
  terraces: () => [K(0.22, 0.5, 6, 0.1, 0, -0.32, '#5F7E4C'), ...[0, 1, 2, 3].map(i => B(0.5 - i * 0.08, 0.05, 0.36 - i * 0.06, 0, i * 0.05, 0, i % 2 ? '#7E9A5C' : '#8AA466')), ...[[-0.1, 0.1], [0.05, 0.08], [0.12, -0.02], [-0.05, -0.04]].map(([x, z]) => B(0.05, 0.04, 0.04, x, 0.2, z, '#9A948A'))],
  enclosure: () => [colored(new THREE.CylinderGeometry(0.26, 0.27, 0.09, 18, 1, true).scale(1.3, 1, 1).translate(0, 0.045, 0), '#8A7A66'), C(0.03, 0.05, 0.16, 8, 0.12, 0, 0.05, '#8A7A66'), B(0.12, 0.05, 0.1, -0.5, 0, 0.1, '#958571')],
  mound: () => [C(0.17, 0.32, 0.14, 4, 0, 0, 0, '#7C8A55'), B(0.06, 0.05, 0.06, 0, 0.14, 0, '#8A6A4A'), C(0.07, 0.12, 0.05, 4, 0.42, 0, 0.1, '#7C8A55')],
  moai: () => Array.from({ length: 5 }, (_, i) => [B(0.05, 0.16, 0.04, -0.16 + i * 0.08, 0.03, 0, '#5E5A55'), B(0.06, 0.03, 0.05, -0.16 + i * 0.08, 0.19, 0, '#9A4E3A')]).flat().concat([B(0.46, 0.03, 0.08, 0, 0, 0, '#7D776F')]),
  adobe: () => [B(0.44, 0.13, 0.3, 0, 0, 0, '#B07A4A'), ...[-0.14, 0, 0.14].flatMap(x => [B(0.06, 0.22, 0.06, x, 0, -0.16, '#A86F40'), K(0.03, 0.05, 4, x, 0.22, -0.16, '#A86F40')]), ...Array.from({ length: 8 }, (_, i) => B(0.012, 0.012, 0.05, -0.18 + i * 0.05, 0.08, -0.17, '#6B4A2C'))],
  tower: () => [B(0.2, 0.08, 0.18, 0, 0, 0.08, '#E9E0C8'), B(0.1, 0.27, 0.1, 0, 0, -0.04, '#E9E0C8'), ...ring(4, 0.07, (x, z) => C(0.015, 0.015, 0.04, 6, x, 0.27, z - 0.04, '#E9E0C8'))],
  fort: () => [...[[0, 0.2, 0.42, 0.04], [0, -0.2, 0.42, 0.04], [0.2, 0, 0.04, 0.42], [-0.2, 0, 0.04, 0.42]].map(([x, z, w, d]) => B(w, 0.09, d, x, 0, z, '#EDE8DC')), ...ring(4, 0.29, (x, z, a) => B(0.11, 0.1, 0.11, x * 0.98, 0, z * 0.98, '#E2DCCD').rotateY(0)), B(0.14, 0.13, 0.12, 0, 0, 0, '#F2EDE2'), K(0.11, 0.06, 4, 0, 0.13, 0, '#A8573C', Math.PI / 4)],
  church: () => [B(0.22, 0.13, 0.3, 0, 0, 0.04, '#F2EEE3'), K(0.17, 0.07, 4, 0, 0.13, 0.04, '#9A6A44', Math.PI / 4).scale(0.9, 1, 1.4), C(0.035, 0.035, 0.22, 10, -0.08, 0, -0.12, '#F2EEE3'), C(0.035, 0.035, 0.22, 10, 0.08, 0, -0.12, '#F2EEE3'), S(0.036, -0.08, 0.22, -0.12, '#C79A4A'), S(0.036, 0.08, 0.22, -0.12, '#C79A4A'), B(0.1, 0.012, 0.02, 0, 0.1, -0.15, '#C79A4A')],
  aqueduct: () => [B(0.66, 0.035, 0.05, 0, 0.15, 0, '#EDE7D9'), ...Array.from({ length: 9 }, (_, i) => B(0.03, 0.15, 0.05, -0.3 + i * 0.075, 0, 0, '#E3DCCB')), B(0.66, 0.025, 0.05, 0, 0.08, 0, '#E3DCCB')],
  christ: () => [K(0.34, 0.42, 7, 0, 0, 0, '#5F7E4C'), B(0.07, 0.04, 0.07, 0, 0.4, 0, '#BFB8AA'), B(0.035, 0.2, 0.03, 0, 0.44, 0, '#E8E4DA'), B(0.2, 0.025, 0.025, 0, 0.6, 0, '#E8E4DA'), S(0.02, 0, 0.66, 0, '#E8E4DA', false)],
  congress: () => [B(0.7, 0.03, 0.3, 0, 0, 0, '#ECEAE4'), B(0.06, 0.4, 0.035, -0.035, 0.03, -0.06, '#E2DED4'), B(0.06, 0.4, 0.035, 0.035, 0.03, -0.06, '#E2DED4'), B(0.06, 0.02, 0.035, 0, 0.3, -0.06, '#E2DED4'),
    colored(new THREE.SphereGeometry(0.11, 14, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2).translate(-0.2, 0.13, 0.04), '#F2F0EA'), S(0.08, 0.2, 0.03, 0.04, '#F2F0EA'), B(0.9, 0.006, 0.1, 0, 0, 0.3, '#7FA05A')],
  geoglyph: () => [colored(new THREE.TorusGeometry(0.2, 0.025, 4, 24).rotateX(Math.PI / 2).translate(-0.12, 0.01, 0), '#8A6A4A'), colored(new THREE.TorusGeometry(0.2, 0.025, 4, 4).rotateX(Math.PI / 2).rotateY(Math.PI / 4).translate(0.22, 0.01, 0.12), '#8A6A4A'), B(0.04, 0.012, 0.2, 0.05, 0, 0.06, '#8A6A4A')],
  eiffel: () => [...ring(4, 0.12, (x, z) => colored(new THREE.BoxGeometry(0.03, 0.3, 0.03).translate(0, 0.15, 0).rotateZ(x > 0 ? 0.3 : -0.3).rotateX(z > 0 ? -0.3 : 0.3).translate(x * 0.6, 0, z * 0.6), '#6F5B4B')), B(0.16, 0.02, 0.16, 0, 0.26, 0, '#6F5B4B'), C(0.015, 0.06, 0.4, 4, 0, 0.27, 0, '#6F5B4B'), C(0.004, 0.012, 0.12, 4, 0, 0.67, 0, '#6F5B4B')]
};

export function buildLandmarks(grid, Y, list) {
  const group = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  const ruinMat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, color: '#A9A193' });
  const items = [];
  for (const lm of list) {
    if (lm.type === 'wall') { items.push(buildWall(grid, Y, lm, mat, group)); continue; }
    const [u, v] = toUV(...lm.p), g = new THREE.Group();
    const mesh = new THREE.Mesh(merge(MODELS[lm.type](lm)), mat); g.add(mesh);
    let extra = null;
    if (lm.minarets) { extra = new THREE.Mesh(merge(MODELS.minarets()), mat); g.add(extra); }
    g.position.set(u, groundY(grid, Y, u, v), v); g.rotation.y = (lm.p[0] * 7 % 1) * 0.6;
    group.add(g);
    items.push({ lm, g, mesh, extra, u, v });
  }
  let lastKey = '';
  /* year: current year; ppu: zoom (pixels per square) */
  function update(year, ppu) {
    // size on screen: about 40 px from far away, growing slowly with zoom; very close up, the map size
    const px = 38 * Math.pow(Math.max(ppu, 3) / 4, 0.2), sc = Math.min(8, Math.max(1, px / ppu / 0.42)), key = year + ':' + sc.toFixed(2);
    if (key === lastKey) return; lastKey = key;
    for (const it of items) {
      const { lm } = it, exists = year >= lm.built && !(lm.gone != null && year >= lm.gone), ruin = lm.ruin != null && year >= lm.ruin;
      const show = exists && (lm.major || ppu >= 4.5);
      if (it.wall) { it.update(show, ruin, ppu); continue; }
      it.g.visible = show; if (!show) continue;
      it.mesh.material = ruin ? ruinMat : mat;
      const z = sc * Math.sqrt(lm.size || 1) * (lm.major ? 1.15 : 0.7); it.g.scale.set(z, z * (ruin ? 0.75 : 1), z);
      if (it.extra) it.extra.visible = year >= lm.minarets;
    }
  }
  const visibleAt = year => list.filter(lm => year >= lm.built && !(lm.gone != null && year >= lm.gone));
  return { group, update, visibleAt };
}

/* wall: boxes along the path and towers; width and height grow from far away */
function buildWall(grid, Y, lm, mat, group) {
  const pts = lm.path.map(p => toUV(...p)), segs = [], towers = [];
  for (let k = 0; k + 1 < pts.length; k++) {
    const [a0, b0] = pts[k], [a1, b1] = pts[k + 1], n = Math.ceil(Math.hypot(a1 - a0, b1 - b0) / 0.8);
    for (let s = 0; s < n; s++) {
      const u0 = a0 + (a1 - a0) * s / n, v0 = b0 + (b1 - b0) * s / n, u1 = a0 + (a1 - a0) * (s + 1) / n, v1 = b0 + (b1 - b0) * (s + 1) / n;
      segs.push({ u: (u0 + u1) / 2, v: (v0 + v1) / 2, len: Math.hypot(u1 - u0, v1 - v0), dir: Math.atan2(v1 - v0, u1 - u0) });
      towers.push([u0, v0]);
    }
  }
  const wall = new THREE.InstancedMesh(colored(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), '#B7A98C'), mat, segs.length);
  const tw = new THREE.InstancedMesh(colored(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), '#A8997B'), mat, towers.length);
  for (const m of [wall, tw]) { m.frustumCulled = false; group.add(m); }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  let lastSc = -1;
  return {
    lm, wall: true,
    update(show, ruin, ppu) {
      wall.visible = tw.visible = show; if (!show) return;
      const sc = Math.min(4, Math.max(1, Math.sqrt(30 / ppu))); if (Math.abs(sc - lastSc) < 0.02) return; lastSc = sc;
      segs.forEach((g, i) => { q.setFromAxisAngle(up, -g.dir); m4.compose(p.set(g.u, groundY(grid, Y, g.u, g.v), g.v), q, s.set(g.len, 0.07 * sc, 0.05 * sc)); wall.setMatrixAt(i, m4); });
      towers.forEach(([u, v], i) => { m4.compose(p.set(u, groundY(grid, Y, u, v), v), q.identity(), s.set(0.09 * sc, 0.12 * sc, 0.09 * sc)); tw.setMatrixAt(i, m4); });
      wall.instanceMatrix.needsUpdate = tw.instanceMatrix.needsUpdate = true;
    }
  };
}
