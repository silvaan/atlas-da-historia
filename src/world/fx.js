// Short animations at the site of each event: people walking, ships, houses appearing, flags, smoke and fire.
// Each type is a small function built from the same parts (Kit). Everything is a function of the animation time t, so repeating just means resetting t to 0.
import * as THREE from 'three';
import { toUV } from '../data/grid.js';
import { colored, merge } from './nature.js';
import { rng, groundY } from './settlements.js';
import { snap, passableBox, routeVia } from './paths.js';
import { shipGeometry, track } from '../story/cabral.js';

const clamp = (x, a, b) => Math.min(b, Math.max(a, x)), clamp01 = x => clamp(x, 0, 1);
const ease = x => x * x * (3 - 2 * x), lerp = (a, b, f) => a + (b - a) * f;
const seg = (t, t0, t1) => clamp01((t - t0) / (t1 - t0));
const B = (w, h, d, x, y, z, c) => colored(new THREE.BoxGeometry(w, h, d).translate(x, y + h / 2, z), c);
const CY = (rt, rb, h, n, x, y, z, c) => colored(new THREE.CylinderGeometry(rt, rb, h, n).translate(x, y + h / 2, z), c);
const CO = (r, h, n, x, y, z, c, rot = 0) => colored(new THREE.ConeGeometry(r, h, n).rotateY(rot).translate(x, y + h / 2, z), c);
const tri = t => { const f = t - Math.floor(t); return f < 0.5 ? f * 2 : 2 - f * 2; };   // there and back, 0→1→0

/* ---------- parts ---------- */
const GEO = {
  house: (roof = '#B9573C', wall = '#EFE7D4') => merge([B(0.12, 0.08, 0.1, 0, 0, 0, wall), CO(0.095, 0.07, 4, 0, 0.08, 0, roof, Math.PI / 4)]),
  bighouse: () => merge([B(0.26, 0.1, 0.14, 0, 0, 0, '#F2EEE3'), CO(0.2, 0.08, 4, 0, 0.1, 0, '#A8573C', Math.PI / 4).scale(1.3, 1, 0.7)]),
  hut: () => merge([CY(0.07, 0.075, 0.025, 8, 0, 0, 0, '#8E6E46'), CO(0.085, 0.11, 8, 0, 0.025, 0, '#C4A266')]),
  maloca: () => merge([colored(new THREE.SphereGeometry(0.11, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2).scale(2, 1.1, 0.9), '#C4A266')]),
  church: () => merge([B(0.13, 0.1, 0.2, 0, 0, 0.02, '#F2EEE3'), CO(0.11, 0.06, 4, 0, 0.1, 0.02, '#9A6A44', Math.PI / 4).scale(0.85, 1, 1.4), B(0.06, 0.2, 0.06, 0, 0, -0.1, '#F2EEE3'), CO(0.045, 0.06, 4, 0, 0.2, -0.1, '#9A6A44', Math.PI / 4)]),
  palisade: (r, n = 40) => merge(Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return CY(0.012, 0.014, 0.09, 4, Math.cos(a) * r, 0, Math.sin(a) * r, '#7A5A34'); })),
  pole: h => CY(0.006, 0.008, h, 5, 0, 0, 0, '#4A3320'),
  table: () => merge([B(0.16, 0.012, 0.09, 0, 0.05, 0, '#7A5432'), ...[[-0.07, -0.035], [0.07, -0.035], [-0.07, 0.035], [0.07, 0.035]].map(([x, z]) => B(0.01, 0.05, 0.01, x, 0, z, '#5C3D22')),
    CO(0.2, 0.09, 4, 0, 0.15, 0, '#E6DCC4', Math.PI / 4).scale(1.2, 1, 0.9), ...[[-0.12, -0.08], [0.12, -0.08], [-0.12, 0.08], [0.12, 0.08]].map(([x, z]) => CY(0.004, 0.004, 0.15, 4, x, 0, z, '#5C3D22'))]),
  scroll: () => merge([CY(0.008, 0.008, 0.07, 6, 0, 0, 0, '#F4ECD6').rotateZ(Math.PI / 2).translate(0, 0.07, 0), B(0.05, 0.002, 0.04, 0, 0.062, 0.02, '#F4ECD6')]),
  dais: () => merge([B(0.2, 0.025, 0.2, 0, 0, 0, '#B89B6E'), B(0.14, 0.02, 0.14, 0, 0.025, 0, '#C9AE80')]),
  cross: () => merge([B(0.016, 0.22, 0.016, 0, 0, 0, '#4A3320'), B(0.1, 0.016, 0.016, 0, 0.15, 0, '#4A3320')]),
  mill: () => merge([B(0.2, 0.09, 0.16, 0, 0, 0, '#E9E0C8'), CO(0.15, 0.06, 4, 0, 0.09, 0, '#8E5A3A', Math.PI / 4).scale(1.1, 1, 0.9), B(0.04, 0.2, 0.04, 0.09, 0, -0.06, '#9A8A70')]),
  wheel: () => merge([colored(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 10).rotateX(Math.PI / 2), '#6B4A2C'), ...[0, 1, 2, 3].map(i => colored(new THREE.BoxGeometry(0.13, 0.008, 0.024).rotateZ(i * Math.PI / 4), '#4A3320'))]),
  cane: () => merge(Array.from({ length: 5 }, (_, i) => B(0.3, 0.035, 0.03, 0, 0, -0.1 + i * 0.05, i % 2 ? '#6FA04A' : '#7DB052'))),
  senzala: () => merge([B(0.34, 0.05, 0.08, 0, 0, 0, '#B9A585'), B(0.36, 0.02, 0.1, 0, 0.05, 0, '#8A6A44')]),
  factory: () => merge([B(0.34, 0.08, 0.16, 0, 0, 0, '#A2543E'), ...[0, 1, 2, 3].map(i => colored(new THREE.BoxGeometry(0.085, 0.04, 0.16).translate(-0.13 + i * 0.085, 0.1, 0).applyMatrix4(new THREE.Matrix4().makeShear(0, 0, 0.5, 0, 0, 0)), '#5E6B78')), B(0.035, 0.3, 0.035, 0.14, 0, -0.1, '#8E4433'), B(0.035, 0.26, 0.035, -0.12, 0, -0.1, '#8E4433')]),
  rowhouses: () => merge(Array.from({ length: 6 }, (_, i) => merge([B(0.05, 0.06, 0.07, -0.13 + i * 0.052, 0, 0, '#9A7A62'), CO(0.045, 0.03, 4, -0.13 + i * 0.052, 0.06, 0, '#4A4A52', Math.PI / 4)]))),
  logs: () => merge(Array.from({ length: 7 }, (_, i) => colored(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 6).rotateZ(Math.PI / 2).translate(0, 0.012 + Math.floor(i / 3) * 0.022, -0.025 + (i % 3) * 0.025), i % 2 ? '#9A3B28' : '#B0462E'))),
  crates: () => merge(Array.from({ length: 6 }, (_, i) => B(0.035, 0.035, 0.035, -0.04 + (i % 3) * 0.04, Math.floor(i / 3) * 0.035, 0, i % 2 ? '#B08A58' : '#9A7448'))),
  stream: len => colored(new THREE.BoxGeometry(len, 0.006, 0.05).translate(0, 0.004, 0), '#5A9FC2'),
  firepit: () => merge(Array.from({ length: 7 }, (_, i) => { const a = i / 7 * Math.PI * 2; return B(0.014, 0.01, 0.014, Math.cos(a) * 0.03, 0, Math.sin(a) * 0.03, '#6E6A62'); })),
  garden: () => merge(Array.from({ length: 4 }, (_, i) => B(0.2, 0.012, 0.04, 0, 0, -0.06 + i * 0.045, i % 2 ? '#7E9A4C' : '#94AE56'))),
  wave: () => merge([B(1.6, 0.04, 0.12, 0, 0, 0, '#9CC7D8'), B(1.6, 0.012, 0.05, 0, 0.04, -0.02, '#F2F7F8')])
};

/* flag with vertical stripes; the cloth is separate so it can flutter */
function flagCloth(colors) {
  const n = colors.length, w = 0.13 / n;
  const g = merge(colors.map((c, i) => colored(new THREE.PlaneGeometry(w, 0.085).translate(w / 2 + i * w, -0.0425, 0), c)));
  return g;
}

/* ---------- particles ---------- */
const PK = {
  smoke: { life: 3.2, vy: 0.11, wind: 0.04, spread: 0.01, s0: 0.03, s1: 0.13, c0: '#8E8984', c1: '#DCD8D0' },
  dark: { life: 3.6, vy: 0.13, wind: 0.05, spread: 0.01, s0: 0.04, s1: 0.16, c0: '#3E3A36', c1: '#8A847C' },
  fire: { life: 0.9, vy: 0.17, wind: 0.01, spread: 0.02, s0: 0.05, s1: 0.012, c0: '#FFD04A', c1: '#C2413A' },
  spark: { life: 1.1, vy: 0.03, wind: 0, spread: 0.03, s0: 0.022, s1: 0.0, c0: '#FFE27A', c1: '#E0A82E', twinkle: true },
  dust: { life: 1.8, vy: 0.03, wind: 0.02, spread: 0.09, s0: 0.04, s1: 0.15, c0: '#B9A27E', c1: '#DDD3BD' },
  miasma: { life: 3, vy: 0.015, wind: 0.02, spread: 0.06, s0: 0.05, s1: 0.2, c0: '#6E5A7E', c1: '#B4A8BE' },
  foam: { life: 0.8, vy: 0.09, wind: 0, spread: 0.05, s0: 0.035, s1: 0.008, c0: '#FFFFFF', c1: '#CFE3EA' },
  cannon: { life: 1.6, vy: 0.04, wind: 0.03, spread: 0.03, s0: 0.05, s1: 0.15, c0: '#F4F2EC', c1: '#C9C5BE' }
};
const PK_C = {}; for (const k in PK) PK_C[k] = [new THREE.Color(PK[k].c0), new THREE.Color(PK[k].c1)];

const PT = ['#3B3F55', '#6B2A2A', '#4A4036', '#2F3A2E'];
const NATIVE = ['#A9523A', '#2E2A26', '#A9523A', '#8E4A30'];

class Kit {
  constructor(grid, Y, e, seed) {
    this.grid = grid; this.Y = Y; this.e = e; this.R = rng(seed); this.group = new THREE.Group();
    this.people = []; this.ships = []; this.props = []; this.emitters = []; this.flags = []; this.lines = [];
    const [u, v] = toUV(...e.p); const j = snap(grid, 'land', u, v, 6);
    this.C = j >= 0 && !passableBox(grid, 'land', u, v, 0.05) ? [j % grid.cols + 0.5, Math.floor(j / grid.cols) + 0.5] : [u, v];
    this.onLand = passableBox(grid, 'land', this.C[0], this.C[1], 0.02);
    this.sea = this.findSea();
  }
  gy(u, v) { return groundY(this.grid, this.Y, u, v); }
  seaY(u, v) { return this.Y[Math.floor(v) * this.grid.cols + Math.floor(u)] + 0.012; }
  okLand(u, v) { return passableBox(this.grid, 'land', u, v, 0.03); }
  land(u, v, r, tries = 24) { for (let k = 0; k < tries; k++) { const a = this.R() * Math.PI * 2, d = Math.sqrt(this.R()) * r, x = u + Math.cos(a) * d, z = v + Math.sin(a) * d; if (this.okLand(x, z)) return [x, z]; } return this.okLand(u, v) ? [u, v] : this.C.slice(); }
  ringPt(c, r, a) { const x = c[0] + Math.cos(a) * r, z = c[1] + Math.sin(a) * r; return this.okLand(x, z) ? [x, z] : this.land(x, z, 0.15); }
  /* nearest sea: direction (land → sea), anchorage and beach */
  findSea() {
    const { grid } = this, [u, v] = this.C, j = snap(grid, 'sea', u, v, 7);
    if (j < 0) return null;
    const s = [j % grid.cols + 0.5, Math.floor(j / grid.cols) + 0.5], d = Math.hypot(s[0] - u, s[1] - v);
    if (d > 3.2) return null;
    const dir = [(s[0] - u) / (d || 1), (s[1] - v) / (d || 1)];
    let A = s;
    for (let k = 0; k <= 12; k++) { const p = [s[0] + dir[0] * k * 0.15, s[1] + dir[1] * k * 0.15]; if (passableBox(grid, 'sea', p[0], p[1], 0.22)) { A = p; if (k >= 3) break; } }
    const bi = snap(grid, 'land', s[0] - dir[0] * 0.3, s[1] - dir[1] * 0.3, 3), beach = bi >= 0 ? [bi % grid.cols + 0.5, Math.floor(bi / grid.cols) + 0.5] : this.C;
    const edge = this.land(beach[0] + dir[0] * 0.3, beach[1] + dir[1] * 0.3, 0.12);
    return { dir, A, beach: edge, inland: (k = 0.7) => this.land(edge[0] - dir[0] * k, edge[1] - dir[1] * k, 0.2) };
  }
  /* person: pos(t) → [u, v]; state(t) → 0 standing, 2 lying down, 3 celebrating; carry(t) → carrying a load */
  person(color, pos, o = {}) { const p = { color, pos, skin: o.skin || (NATIVE.includes(color) ? '#9E6B4A' : '#C99A74'), state: o.state, carry: o.carry, vis: o.vis, face: o.face, ph: this.R() * 6.28, last: null, rot: this.R() * 6.28, lift: o.lift || 0 }; this.people.push(p); return p; }
  ship(pos, flag = '#B3261E', o = {}) { const s = { pos, flag, scale: o.scale || 1, long: !!o.long }; this.ships.push(s); return s; }
  prop(geo, u, v, o = {}) {
    const mesh = new THREE.Mesh(geo, this.mat()); mesh.rotation.y = o.rot ?? this.R() * 0.6 - 0.3;
    const p = { mesh, u, v, t0: o.t0 ?? -1, t1: o.t1 ?? Infinity, s: o.s || 1, anim: o.anim, y: o.y ?? this.gy(u, v), sea: !!o.sea, fixed: !!o.fixed };
    if (o.sea) p.y = this.seaY(u, v);
    this.group.add(mesh); this.props.push(p); return p;
  }
  flag(colors, u, v, o = {}) {
    const h = o.h || 0.26, pole = this.prop(GEO.pole(h), u, v, { t0: o.t0 ?? 0, rot: 0 });
    const cloth = new THREE.Mesh(flagCloth(colors), new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }));
    pole.mesh.add(cloth); const f = { cloth, h, t0: o.t0 ?? 0, raise: o.raise ?? 1.4, ph: this.R() * 6 }; this.flags.push(f); return f;
  }
  emit(kind, at, o = {}) { const em = { kind, at: typeof at === 'function' ? at : () => at, rate: o.rate || 5, t0: o.t0 ?? 0, t1: o.t1 ?? Infinity, r: o.r || 0, y: o.y || 0, acc: 0, burst: o.burst || 0, done: false }; this.emitters.push(em); return em; }
  line(pts, color) { this.lines.push({ pts, color }); }
  mat() { return this._mat ||= new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }); }

  finish() {
    const n = Math.max(1, this.people.length), basic = c => new THREE.MeshLambertMaterial({ color: c });
    this.body = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 0.055, 0.022).translate(0, 0.055, 0), basic('#ffffff'), n);
    this.head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.014, 8, 6).translate(0, 0.098, 0), basic('#ffffff'), n);
    this.legs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.022, 0.03, 0.016).translate(0, 0.015, 0), basic('#4A3A2C'), n);
    this.load = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.018, 0.022).translate(0, 0.125, 0), basic('#9A3B28'), n);
    const col = new THREE.Color();
    this.people.forEach((p, i) => { this.body.setColorAt(i, col.set(p.color)); this.head.setColorAt(i, col.set(p.skin)); });
    this.body.count = this.head.count = this.legs.count = this.load.count = this.people.length;
    const ns = Math.max(1, this.ships.length);
    this.hulls = new THREE.InstancedMesh(shipGeometry(), this.mat(), ns);
    this.pennants = new THREE.InstancedMesh(new THREE.BoxGeometry(0.004, 0.03, 0.06).translate(0.02, 0.34, 0.03), basic('#ffffff'), ns);
    this.ships.forEach((s, i) => this.pennants.setColorAt(i, col.set(s.flag)));
    this.hulls.count = this.pennants.count = this.ships.length;
    this.pool = []; const NP = 260;
    this.parts = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshBasicMaterial({ color: '#ffffff' }), NP);
    for (let i = 0; i < NP; i++) { this.pool.push({ alive: false }); this.parts.setColorAt(i, col.set('#ffffff')); }
    for (const m of [this.body, this.head, this.legs, this.load, this.hulls, this.pennants, this.parts]) { m.frustumCulled = false; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.group.add(m); }
    for (const l of this.lines) {
      const pos = []; for (let k = 0; k + 1 < l.pts.length; k += 2) { const a = l.pts[k], b = l.pts[k + 1]; pos.push(a[0], this.seaY(a[0], a[1]) + 0.01, a[1], b[0], this.seaY(b[0], b[1]) + 0.01, b[1]); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      const ls = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: l.color, transparent: true, opacity: 0.8 })); ls.renderOrder = 4; this.group.add(ls);
    }
  }
  reset() { for (const p of this.people) p.last = null; for (const q of this.pool) q.alive = false; for (const em of this.emitters) { em.acc = 0; em.done = false; } }

  update(t, dt, ppu, clock) {
    const sP = clamp(70 / ppu, 1, 4), sS = clamp((this.shipZoom || 16) / ppu, 1, 8), sR = clamp(40 / ppu, 1, 4);
    const m4 = Kit.m4, q = Kit.q, q2 = Kit.q2, p3 = Kit.p3, s3 = Kit.s3, up = Kit.up, X = Kit.X;
    // people
    this.people.forEach((p, i) => {
      let [u, v] = p.pos(t);
      if (!this.okLand(u, v)) [u, v] = p.last || this.C;
      let moving = false;
      if (p.last) { const du = u - p.last[0], dv = v - p.last[1], d = Math.hypot(du, dv); if (d > 1e-5) { p.rot = -Math.atan2(dv, du); moving = d / Math.max(dt, 1e-3) > 0.004; } }
      else if (p.face) p.rot = -Math.atan2(p.face[1] - v, p.face[0] - u);
      if (!moving && p.face && p.last) { const want = -Math.atan2(p.face[1] - v, p.face[0] - u); p.rot = want; }
      p.last = [u, v];
      const st = p.state ? p.state(t) : 0, vis = p.vis ? p.vis(t) : true, y = this.gy(u, v) + p.lift;
      const bob = moving ? Math.abs(Math.sin(clock * 9 + p.ph)) * 0.008 : st === 3 ? Math.abs(Math.sin(clock * 7 + p.ph)) * 0.035 : 0;
      q.setFromAxisAngle(up, p.rot); if (st === 2) q.multiply(q2.setFromAxisAngle(X, Math.PI / 2));
      const s = vis ? sP : 0.0001;
      m4.compose(p3.set(u, y + (st === 2 ? 0.012 * s : bob * s), v), q, s3.set(s, s, s)); this.body.setMatrixAt(i, m4); this.head.setMatrixAt(i, m4);
      m4.compose(p3.set(u, y + (st === 2 ? 0.012 * s : 0), v), q, s3.set(s, st === 2 ? s : s * (moving ? 0.8 + Math.abs(Math.sin(clock * 9 + p.ph)) * 0.3 : 1), s)); this.legs.setMatrixAt(i, m4);
      const c = vis && st !== 2 && p.carry && p.carry(t) ? s : 0.0001;
      m4.compose(p3.set(u, y + bob * s, v), q, s3.set(c, c, c)); this.load.setMatrixAt(i, m4);
    });
    for (const m of [this.body, this.head, this.legs, this.load]) m.instanceMatrix.needsUpdate = true;
    // ships
    this.ships.forEach((s, i) => {
      const P = s.pos(t), k = P.vis === false ? 0.0001 : sS * s.scale * (P.s ?? 1);
      q.setFromAxisAngle(up, -P.dir);
      m4.compose(p3.set(P.u, this.seaY(P.u, P.v) + Math.sin(clock * 2 + i) * 0.006, P.v), q, s3.set(k, k, k));
      this.hulls.setMatrixAt(i, m4); this.pennants.setMatrixAt(i, m4);
      if (P.fire) this.spawn('cannon', P.u + Math.sin(P.dir + 1.57) * 0.08 * k, this.seaY(P.u, P.v) + 0.05 * k, P.v + Math.cos(P.dir + 1.57) * 0.08 * k, dt * 3, sR);
    });
    this.hulls.instanceMatrix.needsUpdate = this.pennants.instanceMatrix.needsUpdate = true;
    // objects
    for (const p of this.props) {
      const on = t >= p.t0 && t < p.t1; p.mesh.visible = on; if (!on) continue;
      const g = p.t0 < 0 ? 1 : ease(seg(t, p.t0, p.t0 + 0.5)) * (1 + 0.15 * Math.sin(seg(t, p.t0, p.t0 + 0.5) * Math.PI));
      p.mesh.position.set(p.u, p.y, p.v); p.mesh.scale.setScalar(Math.max(0.0001, g * p.s * (p.fixed ? 1 : sR)));
      if (p.anim) p.anim(t, p.mesh, sR, clock);
    }
    for (const f of this.flags) {
      const r = ease(seg(t, f.t0, f.t0 + f.raise));
      f.cloth.position.set(0, lerp(0.09, f.h, r), 0);
      f.cloth.rotation.y = Math.sin(clock * 3 + f.ph) * 0.35; f.cloth.scale.set(0.9 + Math.sin(clock * 5 + f.ph) * 0.1, 1, 1);
    }
    // particles
    for (const em of this.emitters) {
      if (t < em.t0 || t >= em.t1) continue;
      const at = em.at(t); if (!at) continue;
      if (em.burst) { if (!em.done) { em.done = true; for (let k = 0; k < em.burst; k++) this.spawnAround(em, at, sR); } continue; }
      em.acc += em.rate * dt;
      while (em.acc >= 1) { em.acc--; this.spawnAround(em, at, sR); }
    }
    const col = Kit.col;
    this.pool.forEach((a, i) => {
      if (!a.alive) { m4.makeScale(0, 0, 0); this.parts.setMatrixAt(i, m4); return; }
      a.age += dt; const K = PK[a.kind], f = a.age / K.life;
      if (f >= 1) { a.alive = false; m4.makeScale(0, 0, 0); this.parts.setMatrixAt(i, m4); return; }
      a.x += a.vx * dt * a.sc; a.y += K.vy * dt * a.sc; a.z += a.vz * dt * a.sc;
      let s = lerp(K.s0, K.s1, Math.sqrt(f)) * a.sc * (f > 0.8 && K.s1 > K.s0 ? (1 - f) * 5 : 1);
      if (K.twinkle) s *= 0.5 + Math.abs(Math.sin(clock * 12 + i));
      m4.makeScale(s, s, s).setPosition(a.x, a.y, a.z); this.parts.setMatrixAt(i, m4);
      col.copy(PK_C[a.kind][0]).lerp(PK_C[a.kind][1], f); this.parts.setColorAt(i, col);
    });
    this.parts.instanceMatrix.needsUpdate = true; this.parts.instanceColor.needsUpdate = true;
  }
  spawnAround(em, at, sR) {
    const a = this.R() * 6.28, d = Math.sqrt(this.R()) * em.r;
    const u = at[0] + Math.cos(a) * d, v = at[1] + Math.sin(a) * d, y = (at[2] ?? this.gy(u, v)) + em.y * sR;
    this.spawn(em.kind, u, y, v, 1, sR);
  }
  spawn(kind, x, y, z, prob, sR) {
    if (prob < 1 && this.R() > prob) return;
    const slot = this.pool.find(a => !a.alive); if (!slot) return;
    const K = PK[kind], a = this.R() * 6.28;
    Object.assign(slot, { alive: true, kind, age: 0, x, y, z, sc: sR, vx: K.wind + Math.cos(a) * K.spread, vz: Math.sin(a) * K.spread * 0.6 });
  }
  dispose() { this.group.traverse(o => { o.geometry?.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); }); this.group.removeFromParent(); }
}
Kit.m4 = new THREE.Matrix4(); Kit.q = new THREE.Quaternion(); Kit.q2 = new THREE.Quaternion(); Kit.p3 = new THREE.Vector3(); Kit.s3 = new THREE.Vector3();
Kit.up = new THREE.Vector3(0, 1, 0); Kit.X = new THREE.Vector3(1, 0, 0); Kit.col = new THREE.Color();

/* ---------- movement helpers ---------- */
const go = (a, b, t0, t1) => t => { const f = ease(seg(t, t0, t1)); return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; };
const wander = (c, r, R, sp = 0.35) => { const a1 = R() * 6.28, a2 = R() * 6.28, f1 = (0.5 + R()) * sp, f2 = (0.5 + R()) * sp; return t => [c[0] + Math.sin(t * f1 + a1) * r, c[1] + Math.sin(t * f2 + a2) * r * 0.8]; };
const then = (f, g, t1) => t => t < t1 ? f(t) : g(t - t1);
const pick = (arr, R) => arr[(R() * arr.length) | 0];
/* back and forth between two points with period T (carrying on the way out if carryOut) */
const shuttle = (a, b, T, ph) => t => { const f = ease(tri((t + ph) / T)); return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; };
const outbound = (T, ph) => t => (((t + ph) / T) % 1) < 0.5;

/* ships in formation around a point; the formation shrinks if a ship would end up on land */
function formation(k, P, dir, i, spread = 0.36) {
  const row = Math.floor(i / 3), c = (i % 3) - 1, ca = Math.cos(dir), sa = Math.sin(dir), along = -row * 0.42, side = c * spread;
  for (const f of [1, 0.7, 0.45, 0.2, 0]) { const u = P.u + (ca * along - sa * side) * f, v = P.v + (sa * along + ca * side) * f; if (passableBox(k.grid, 'sea', u, v, 0.15)) return { u, v }; }
  return { u: P.u, v: P.v };
}
function anchored(k, n, flag, o = {}) {
  const S = k.sea; if (!S) return;
  const dir = Math.atan2(S.dir[1], S.dir[0]) + Math.PI / 2;
  for (let i = 0; i < n; i++) { const P = formation(k, { u: S.A[0], v: S.A[1] }, dir, i, 0.42); k.ship(t => ({ ...P, dir, fire: o.fire ? o.fire(t, i) : false }), flag); }
}
function town(k, n, r, o = {}) {
  const pts = [];
  for (let i = 0; i < n; i++) { const p = k.land(k.C[0], k.C[1], r); if (Math.hypot(p[0] - k.C[0], p[1] - k.C[1]) < (o.hole ?? 0.12)) continue; pts.push(p); k.prop(o.geo ? o.geo() : GEO.house(o.roof), p[0], p[1], { t0: o.t0 ? o.t0 + i * (o.dt || 0.5) : -1, s: 0.9 + k.R() * 0.3 }); }
  return pts;
}
const crowdAround = (k, n, colors, r, f) => { for (let i = 0; i < n; i++) f(pick(colors, k.R), i, k.land(k.C[0], k.C[1], r)); };

/* ---------- animation types ---------- */
const TYPES = {
  /* fleet arriving (or leaving) and people on the beach */
  fleet: { ppu: 70, build(k, o) {
    const S = k.sea; if (!S) return TYPES.ceremony.build(k, o);
    const out = [S.A[0] + S.dir[0] * 7, S.A[1] + S.dir[1] * 7];
    const far = o.from ? toUV(...o.from) : out, depart = o.dir === 'depart';
    const tr = depart ? track(k.grid, k.Y, [toLL(k, S.A), o.to || toLL(k, out)]) : track(k.grid, k.Y, [o.from || toLL(k, far), toLL(k, S.A)]);
    const win = Math.min(1, 4.5 / (tr.len || 1)), n = o.n || 6;
    const anchorDir = Math.atan2(S.dir[1], S.dir[0]) + Math.PI / 2;
    for (let i = 0; i < n; i++) {
      k.ship(t => {
        const f = depart ? ease(seg(t, 3.5, 12)) * win : 1 - win + ease(seg(t, 0, 7)) * win;
        const moving = depart ? t > 3.5 : t < 7;
        const P = tr.at(f), dir = moving ? P.dir : anchorDir;
        const F = formation(k, moving ? P : { u: S.A[0], v: S.A[1] }, dir, i, moving ? 0.34 : 0.42);
        return { ...F, dir, fire: o.salute && !depart && t > 7 && t < 8.6 && i % 2 === 0 };
      }, o.pennant || '#B3261E');
    }
    const beach = S.beach, home = S.inland(0.9);
    if (!depart) {
      crowdAround(k, o.crowd ?? 20, o.crowdColors || NATIVE, 0.25, (c, i, p0) => {
        const start = k.land(home[0], home[1], 0.3), dst = k.land(beach[0] - S.dir[0] * 0.1, beach[1] - S.dir[1] * 0.1, 0.25), t0 = 4 + k.R() * 2;
        k.person(c, then(() => start, go(start, dst, 0, 3.5), t0), { face: S.A });
      });
      for (let i = 0; i < (o.land ?? 8); i++) { const src = k.land(beach[0], beach[1], 0.06), dst = k.land(beach[0] - S.dir[0] * 0.22, beach[1] - S.dir[1] * 0.22, 0.1); k.person(pick(o.landColors || PT, k.R), then(() => src, go(src, dst, 0, 2.5), 8.5), { vis: t => t > 8.5, face: home }); }
      if (o.flag) k.flag(o.flag, beach[0] - S.dir[0] * 0.05, beach[1] - S.dir[1] * 0.05, { t0: 11 });
      if (o.cross) k.prop(GEO.cross(), beach[0] - S.dir[0] * 0.08, beach[1] - S.dir[1] * 0.08, { t0: 11, rot: 0 });
    } else {
      crowdAround(k, o.crowd ?? 22, o.crowdColors || PT, 0.18, (c, i) => { const p = k.land(beach[0] - S.dir[0] * 0.12, beach[1] - S.dir[1] * 0.12, 0.25); k.person(c, () => p, { face: S.A }); });
      if (o.troops) for (let i = 0; i < o.troops; i++) { const p = k.land(home[0], home[1], 0.2), dst = k.land(beach[0] - S.dir[0] * 0.3, beach[1] - S.dir[1] * 0.3, 0.2); k.person(pick(o.troopColors, k.R), then(() => [home[0] + S.dir[1] * 2, home[1] - S.dir[0] * 2], go(p, dst, 0, 5), 6), { vis: t => t > 6 }); }
    }
    if (o.town !== false) town(k, o.houses ?? 8, 0.55, { roof: o.roof });
    k.focus = [lerp(S.A[0], beach[0], 0.5) + S.dir[0] * 0.9, lerp(S.A[1], beach[1], 0.5) + S.dir[1] * 0.9];
    return { D: depart ? 14 : 15 };
  } },

  /* long crossing: ships in line along one or more routes */
  crossing: { ppu: 3.5, build(k, o) {
    k.shipZoom = 28;
    const routes = (o.paths || [o.path]).map(p => track(k.grid, k.Y, p)), n = o.n || 12, D = 16;
    let u0 = Infinity, v0 = Infinity, u1 = -Infinity, v1 = -Infinity;
    routes.forEach(r => { r.pts.forEach(([u, v]) => { u0 = Math.min(u0, u); v0 = Math.min(v0, v); u1 = Math.max(u1, u); v1 = Math.max(v1, v); }); k.line(r.pts, o.color || '#F4F1E8'); });
    for (let i = 0; i < n; i++) { const r = routes[i % routes.length], ph = i / n; k.ship(t => { const f = ((t / D) + ph) % 1, P = r.at(f); return { ...P, s: Math.min(1, f * 12, (1 - f) * 12) }; }, o.pennant || '#B3261E'); }
    k.bounds = [u0, v0, u1, v1];
    return { D, seamless: true };
  } },

  /* founding: people arrive, the flag goes up, the houses appear one by one */
  founding: { ppu: 130, build(k, o) {
    const S = k.sea, C = k.C, start = S ? S.beach : k.land(C[0] + 1, C[1] + 0.3, 0.2);
    if (S && o.ships) anchored(k, o.ships, o.pennant || '#B3261E');
    k.flag(o.flag || ['#F4F1EA', '#2F5F8A'], C[0], C[1], { t0: 2.5 });
    for (let i = 0; i < (o.people ?? 16); i++) { const src = k.land(start[0], start[1], 0.15), dst = k.land(C[0], C[1], 0.5); k.person(pick(o.colors || PT, k.R), then(go(src, dst, 0.3 + i * 0.12, 3.5 + i * 0.12), wander(dst, 0.08, k.R), 4.5 + i * 0.12)); }
    if (o.natives) for (let i = 0; i < o.natives; i++) { const p = k.land(C[0] - 0.6, C[1] + 0.5, 0.3); k.person(pick(NATIVE, k.R), wander(p, 0.1, k.R), { face: C }); }
    town(k, o.houses ?? 12, 0.5, { t0: 3, dt: 0.6, roof: o.roof });
    if (o.church) k.prop(GEO.church(), C[0] + 0.14, C[1] - 0.1, { t0: 8.5, rot: 0.2 });
    if (o.wall) k.prop(GEO.palisade(0.62, 60), C[0], C[1], { t0: 10.5, rot: 0, fixed: true });
    return { D: 15 };
  } },

  /* battle: two groups advance and clash; gunpowder smoke, houses on fire */
  battle: { ppu: 125, build(k, o) {
    const C = k.C, ang = (o.angle ?? k.R() * 3.14), ax = [Math.cos(ang), Math.sin(ang)], px = [-ax[1], ax[0]];
    const side = (colors, sgn, n) => { for (let i = 0; i < n; i++) {
      const row = Math.floor(i / 8), col = (i % 8) - 3.5, base = [C[0] + ax[0] * sgn * (0.65 + row * 0.08) + px[0] * col * 0.07, C[1] + ax[1] * sgn * (0.65 + row * 0.08) + px[1] * col * 0.07];
      const front = [C[0] + ax[0] * sgn * (0.08 + row * 0.06) + px[0] * col * 0.07, C[1] + ax[1] * sgn * (0.08 + row * 0.06) + px[1] * col * 0.07];
      const ph = k.R() * 6, fall = k.R() < 0.3 ? 5 + k.R() * 6 : 99;
      k.person(pick(colors, k.R), t => { if (t < 4) return go(base, front, 0.3, 4)(t); const w = Math.sin(t * 2.2 + ph) * 0.05; return [front[0] + ax[0] * sgn * w, front[1] + ax[1] * sgn * w]; }, { state: t => t > fall ? 2 : 0, face: C });
    } };
    side(o.a || PT, -1, o.na || 16); side(o.b || NATIVE, 1, o.nb || 16);
    k.emit(o.guns === false ? 'dust' : 'cannon', t => [C[0] + px[0] * (k.R() - 0.5) * 0.5, C[1] + px[1] * (k.R() - 0.5) * 0.5], { t0: 3.5, rate: 5, r: 0.05, y: 0.05 });
    k.emit('dust', C, { t0: 4, rate: 3, r: 0.25 });
    if (o.fire) { const pts = town(k, 7, 0.45, { hole: 0.3, roof: o.roof }); pts.slice(0, 4).forEach((p, i) => { k.emit('fire', p, { t0: 5 + i, rate: 9, r: 0.03, y: 0.06 }); k.emit('smoke', p, { t0: 5.5 + i, rate: 2, y: 0.1 }); }); }
    if (o.ships) anchored(k, o.ships, o.pennant || '#B3261E', { fire: (t, i) => t > 2 + i && (Math.floor(t * 1.3 + i) % 3 === 0) });
    return { D: 13 };
  } },

  /* revolt: the people fill the square, the flag goes up, sometimes there is fire */
  revolt: { ppu: 130, build(k, o) {
    const C = k.C, houses = town(k, o.houses ?? 14, 0.6, { hole: 0.22, roof: o.roof });
    for (let i = 0; i < (o.people ?? 28); i++) { const a = k.R() * 6.28, src = k.ringPt(C, 0.55 + k.R() * 0.2, a), dst = k.ringPt(C, 0.05 + k.R() * 0.13, a); const t0 = k.R() * 2; k.person(pick(o.colors || ['#3E6A8C', '#9C4A3A', '#7A6A3A', '#E9E2D0', '#5B7B4A'], k.R), go(src, dst, t0, t0 + 4), { state: t => t > 6.5 && t < 11.5 ? 3 : 0, face: C }); }
    k.flag(o.flag || ['#C2413A'], C[0], C[1], { t0: 5 });
    if (o.fire) houses.slice(0, 3).forEach((p, i) => { k.emit('fire', p, { t0: 6.5 + i * 0.8, rate: 9, r: 0.03, y: 0.06 }); k.emit('smoke', p, { t0: 7 + i * 0.8, rate: 2, y: 0.1 }); });
    if (o.troops) for (let i = 0; i < o.troops; i++) { const a = k.R() * 6.28, src = k.ringPt(C, 1, a), dst = k.ringPt(C, 0.3, a); k.person(pick(o.troopColors || ['#2F3A6E'], k.R), go(src, dst, 8, 11.5), { vis: t => t > 8, face: C }); }
    return { D: 13 };
  } },

  /* ceremony: people in a circle, someone on the platform, a flag, sometimes a document or a cross */
  ceremony: { ppu: 140, build(k, o) {
    const C = k.C;
    if (o.town !== false) town(k, o.houses ?? 10, 0.6, { hole: 0.35, roof: o.roof, geo: o.hut ? GEO.hut : null });
    k.prop(GEO.dais(), C[0], C[1], { rot: 0 });
    for (let i = 0; i < (o.leads || ['#7A2A5A']).length; i++) { const p = [C[0] - 0.03 + i * 0.03, C[1]]; k.person((o.leads || ['#7A2A5A'])[i], () => p, { lift: 0.045, state: t => t > 6 && t < 7.5 && i === 0 ? 3 : 0 }); }
    for (let i = 0; i < (o.people ?? 26); i++) { const a = i / (o.people ?? 26) * 6.28 + k.R() * 0.2, src = k.ringPt(C, 0.6, a), dst = k.ringPt(C, 0.16 + k.R() * 0.1, a), t0 = k.R() * 1.5; k.person(pick(o.colors || PT, k.R), go(src, dst, t0, t0 + 3.5), { state: t => t > 7.5 && t < 10.5 ? 3 : 0, face: C }); }
    if (o.flag) k.flag(o.flag, C[0] + 0.1, C[1] - 0.06, { t0: 4 });
    if (o.scroll) { k.prop(GEO.scroll(), C[0], C[1] + 0.05, { t0: 5.5, rot: 0, y: k.gy(C[0], C[1]) + 0.0 }); k.emit('spark', [C[0], C[1] + 0.05], { t0: 5.5, t1: 7, rate: 10, r: 0.04, y: 0.1 }); }
    if (o.cross) k.prop(GEO.cross(), C[0] - 0.1, C[1] - 0.06, { t0: 4, rot: 0 });
    return { D: 12 };
  } },

  /* treaty: two delegations, a table, the signed paper, two flags */
  treaty: { ppu: 150, build(k, o) {
    const C = k.C, [ca, cb] = o.colors || [['#2F5F8A', '#F4F1EA'], ['#C2413A', '#D9B23A']], ax = [1, 0];
    k.prop(GEO.table(), C[0], C[1], { rot: 0 });
    if (o.town !== false) town(k, 8, 0.6, { hole: 0.35, roof: o.roof });
    const side = (colors, sgn) => { for (let i = 0; i < 5; i++) { const off = (i - 2) * 0.05, src = [C[0] + sgn * 0.8, C[1] + off * 2], dst = [C[0] + sgn * (0.1 + (i % 2) * 0.04), C[1] + off]; k.person(pick(colors, k.R), t => t < 10 ? go(src, dst, 0.3 + i * 0.2, 4 + i * 0.2)(t) : go(dst, src, 10, 13)(t), { face: C }); } };
    side(o.a || PT, -1); side(o.b || ['#6B2A2A', '#3A2E2A', '#D9B23A'], 1);
    k.prop(GEO.scroll(), C[0], C[1], { t0: 5.5, rot: 0, y: k.gy(C[0], C[1]) });
    k.emit('spark', [C[0], C[1]], { t0: 5.6, t1: 7, rate: 12, r: 0.05, y: 0.1 });
    k.flag(ca, C[0] - 0.18, C[1] - 0.1, { t0: 6.5 }); k.flag(cb, C[0] + 0.18, C[1] - 0.1, { t0: 6.8 });
    void ax; return { D: 13 };
  } },

  /* epidemic: a village; a mist passes; many fall ill and lie down, others flee */
  epidemic: { ppu: 140, build(k, o) {
    const C = k.C;
    for (let i = 0; i < 8; i++) { const p = k.ringPt(C, 0.38, i / 8 * 6.28); k.prop(GEO.maloca(), p[0], p[1], { rot: -i / 8 * 6.28 }); }
    for (let i = 0; i < 28; i++) {
      const p = k.land(C[0], C[1], 0.3), r = k.R(), lie = r < 0.6 ? 3 + k.R() * 7 : 99, flee = r > 0.82, away = k.ringPt(C, 1.3, k.R() * 6.28);
      k.person(pick(NATIVE, k.R), flee ? then(wander(p, 0.06, k.R), go(p, away, 0, 5), 5) : wander(p, 0.07, k.R), { state: t => t > lie ? 2 : 0 });
    }
    k.emit('miasma', C, { t0: 1.5, rate: 6, r: 0.55, y: 0.05 });
    k.prop(GEO.garden(), C[0] + 0.7, C[1] + 0.2, { rot: 0.4 });
    void o; return { D: 13 };
  } },

  /* sugarmill: cane field, turning mill, smoke from the boiler, people carrying cane */
  sugarmill: { ppu: 135, build(k, o) {
    const C = k.C, mill = [C[0], C[1]];
    k.prop(GEO.mill(), mill[0], mill[1], { rot: 0 });
    k.prop(GEO.wheel(), mill[0] - 0.13, mill[1] + 0.02, { rot: 0, anim: (t, m, s, clock) => { m.rotation.z = -clock * 1.4; m.position.y += 0.07 * s; } });
    k.emit('smoke', [mill[0] + 0.09 * 1.4, mill[1] - 0.06 * 1.4], { rate: 2.2, y: 0.22 });
    k.prop(GEO.bighouse(), C[0] + 0.3, C[1] - 0.28, { rot: 0.1 });
    k.prop(GEO.senzala(), C[0] - 0.25, C[1] - 0.3, { rot: 0 });
    const fields = [[0.45, 0.25], [-0.45, 0.3], [0.1, 0.5], [0.55, -0.05], [-0.5, -0.02]].map(([x, z]) => [C[0] + x, C[1] + z]).filter(p => k.okLand(...p));
    fields.forEach(p => k.prop(GEO.cane(), p[0], p[1], { rot: k.R() * 0.8 }));
    for (let i = 0; i < 18; i++) { const f = pick(fields.length ? fields : [C], k.R), a = k.land(f[0], f[1], 0.1), b = k.land(mill[0], mill[1] + 0.12, 0.06), T = 8, ph = k.R() * T; k.person(pick(o.colors || ['#E9E2D0', '#C9A15A', '#9C4A3A'], k.R), shuttle(a, b, T, ph), { carry: t => !outbound(T, ph)(t) }); }
    k.person('#3B3F55', wander([C[0] + 0.15, C[1] + 0.1], 0.1, k.R));
    if (k.sea && o.ship !== false) anchored(k, 1, '#B3261E');
    return { D: 16, seamless: true };
  } },

  /* gold: people in the river, glints on the water, mule trains carrying the gold */
  gold: { ppu: 135, build(k, o) {
    const C = k.C, ang = 0.5;
    k.prop(GEO.stream(1.4), C[0], C[1], { rot: ang, fixed: true });
    for (let i = 0; i < 16; i++) { const d = (i / 15 - 0.5) * 1.2, side = (i % 2 ? 1 : -1) * 0.045, p = [C[0] + Math.cos(ang) * d + Math.sin(ang) * side, C[1] - Math.sin(ang) * d + Math.cos(ang) * side]; k.person(pick(['#E9E2D0', '#C9A15A', '#9C4A3A', '#7A6A3A'], k.R), () => p, { face: C }); }
    k.emit('spark', t => [C[0] + Math.cos(ang) * (k.R() - 0.5) * 1.2, C[1] - Math.sin(ang) * (k.R() - 0.5) * 1.2], { rate: 9, y: 0.01 });
    town(k, 7, 0.5, { hole: 0.25, roof: '#B9573C' });
    k.prop(GEO.church(), C[0] - 0.3, C[1] - 0.25, { rot: 0.3 });
    const road = [C[0] + 0.2, C[1] + 0.25], far = k.land(C[0] + 1.4, C[1] + 0.9, 0.2);
    for (let i = 0; i < 6; i++) { const T = 12, ph = i * 0.45; k.person(i === 0 ? '#3B3F55' : '#7A5A3A', t => { const f = ((t + ph) % T) / T; return [lerp(road[0], far[0], f), lerp(road[1], far[1], f)]; }, { carry: () => i > 0 }); }
    void o; return { D: 12, seamless: true };
  } },

  /* industry: factories, chimneys with dark smoke, workers going in and out */
  industry: { ppu: 135, build(k, o) {
    const C = k.C, facs = [[0, 0], [0.38, 0.12], [-0.36, 0.16]].map(([x, z]) => [C[0] + x, C[1] + z]);
    facs.forEach((p, i) => { k.prop(GEO.factory(), p[0], p[1], { rot: 0.1 * i }); k.emit('dark', [p[0] + 0.14, p[1] - 0.1], { rate: 2.5, y: 0.3 }); k.emit('dark', [p[0] - 0.12, p[1] - 0.1], { rate: 2, y: 0.26 }); });
    const rows = [[-0.2, -0.38], [0.2, -0.4], [0, 0.5], [0.45, 0.45]].map(([x, z]) => [C[0] + x, C[1] + z]);
    rows.forEach(p => k.prop(GEO.rowhouses(), p[0], p[1], { rot: 0 }));
    for (let i = 0; i < 20; i++) { const a = pick(rows, k.R), b = pick(facs, k.R), T = 10, ph = k.R() * T; k.person(pick(['#4A4A52', '#5E5A55', '#3E3A36', '#6B5A4A'], k.R), shuttle(k.land(a[0], a[1], 0.05), k.land(b[0], b[1] + 0.1, 0.04), T, ph)); }
    void o; return { D: 10, seamless: true };
  } },

  /* earthquake: the houses shake and fall, dust, fire; the wave comes from the beach */
  earthquake: { ppu: 115, build(k, o) {
    const C = k.C, S = k.sea;
    const houses = [];
    for (let i = 0; i < 24; i++) {
      const p = k.land(C[0], C[1], 0.6), tf = 2.5 + k.R() * 3, h = k.prop(i % 8 === 0 ? GEO.church() : GEO.house(o.roof), p[0], p[1], { s: 0.9 + k.R() * 0.3 });
      h.anim = (t, m, s) => { if (t > 1 && t < tf) { m.position.x += Math.sin(t * 47 + i) * 0.012 * s; m.position.z += Math.cos(t * 39 + i) * 0.01 * s; } if (t >= tf) { const f = ease(seg(t, tf, tf + 0.6)); m.scale.y *= 1 - 0.7 * f; m.rotation.z = 0.3 * f; } };
      k.emit('dust', p, { t0: tf, t1: tf + 0.3, burst: 6, r: 0.06 }); houses.push(p);
    }
    houses.slice(0, 5).forEach((p, i) => { k.emit('fire', p, { t0: 5.5 + i * 0.5, rate: 8, r: 0.03, y: 0.03 }); k.emit('smoke', p, { t0: 6 + i * 0.5, rate: 1.6, y: 0.08 }); });
    for (let i = 0; i < 20; i++) { const p = k.land(C[0], C[1], 0.5), away = S ? k.land(C[0] - S.dir[0] * 1.2, C[1] - S.dir[1] * 1.2, 0.3) : k.ringPt(C, 1.2, k.R() * 6.28); k.person(pick(PT, k.R), then(wander(p, 0.05, k.R), go(p, away, 0, 6), 3 + k.R())); }
    if (S && o.wave !== false) {   // wave: false (a bomb, for example) — no wave from the sea
      const from = [S.A[0] + S.dir[0] * 0.8, S.A[1] + S.dir[1] * 0.8], to = [S.beach[0] + S.dir[0] * 0.05, S.beach[1] + S.dir[1] * 0.05], rot = -Math.atan2(S.dir[1], S.dir[0]) + Math.PI / 2;
      const w = k.prop(GEO.wave(), from[0], from[1], { t0: 7, t1: 10, rot, sea: true, fixed: true });
      w.anim = (t, m) => { const f = ease(seg(t, 7, 9.5)); m.position.x = lerp(from[0], to[0], f); m.position.z = lerp(from[1], to[1], f); m.position.y = k.seaY(m.position.x, m.position.z); };
      k.emit('foam', t => { const f = ease(seg(t, 7, 9.5)); return [lerp(from[0], to[0], f), lerp(from[1], to[1], f), k.seaY(from[0], from[1]) + 0.04]; }, { t0: 7, t1: 10, rate: 30, r: 0.5 });
    }
    return { D: 13 };
  } },

  /* flight: people leave one place and go to found another, far away */
  flight: { ppu: 90, build(k, o) {
    const C = k.C, [fu, fv] = toUV(...o.from), fj = snap(k.grid, 'land', fu, fv, 4), O = fj >= 0 ? [fj % k.grid.cols + 0.5, Math.floor(fj / k.grid.cols) + 0.5] : [fu, fv];
    const path = routeVia(k.grid, 'land', [O, C]).flat(); if (path.length < 2) path.splice(0, path.length, O, C);
    const L = [0]; for (let i = 1; i < path.length; i++) L.push(L[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
    const len = L[L.length - 1] || 1, at = s => { let i = 1; while (i < L.length - 1 && L[i] < s) i++; const f = (s - L[i - 1]) / ((L[i] - L[i - 1]) || 1); return [lerp(path[i - 1][0], path[i][0], f), lerp(path[i - 1][1], path[i][1], f)]; };
    k.prop(GEO.mill(), O[0], O[1], { rot: 0 }); k.prop(GEO.cane(), O[0] + 0.25, O[1] + 0.2, { rot: 0.3 }); k.emit('smoke', [O[0] + 0.12, O[1] - 0.08], { rate: 1.5, y: 0.22 });
    for (let i = 0; i < 22; i++) { const t0 = 0.5 + i * 0.3, dst = k.land(C[0], C[1], 0.35), jit = [(k.R() - 0.5) * 0.06, (k.R() - 0.5) * 0.06]; k.person(pick(o.colors || ['#E9E2D0', '#C9A15A', '#9C4A3A'], k.R), t => { const f = ease(seg(t, t0, t0 + 7)); if (f < 0.92) { const p = at(f / 0.92 * len); return [p[0] + jit[0], p[1] + jit[1]]; } const q = at(len); return go(q, dst, 0, 1)((f - 0.92) / 0.08); }); }
    k.prop(GEO.palisade(0.5, 50), C[0], C[1], { t0: 7, rot: 0, fixed: true });
    for (let i = 0; i < 9; i++) { const p = k.land(C[0], C[1], 0.38); k.prop(GEO.hut(), p[0], p[1], { t0: 6 + i * 0.6 }); }
    k.prop(GEO.garden(), C[0] + 0.6, C[1] + 0.3, { t0: 10, rot: 0.3 });
    k.bounds = [Math.min(O[0], C[0]) - 0.4, Math.min(O[1], C[1]) - 0.4, Math.max(O[0], C[0]) + 0.4, Math.max(O[1], C[1]) + 0.4];
    return { D: 15 };
  } },

  /* circle: village in a circle, fire in the middle, dancing */
  circle: { ppu: 140, build(k, o) {
    const C = k.C, nh = o.village === 'xingu' ? 14 : 6, r = o.village === 'xingu' ? 0.45 : 0.36;
    for (let i = 0; i < nh; i++) { const a = i / nh * 6.28, p = k.ringPt(C, r, a); k.prop(o.village === 'xingu' ? GEO.hut() : GEO.maloca(), p[0], p[1], { rot: -a + Math.PI / 2, s: o.village === 'xingu' ? 1.3 : 1 }); }
    if (o.village === 'xingu') { k.prop(GEO.hut(), C[0] + 0.05, C[1] - 0.05, { s: 0.8 }); k.prop(GEO.palisade(0.7, 70), C[0], C[1], { rot: 0, fixed: true }); }
    k.prop(GEO.firepit(), C[0], C[1], { rot: 0 }); k.emit('fire', C, { rate: 8, r: 0.02 }); k.emit('smoke', C, { rate: 1.2, y: 0.08 });
    const nd = 16; for (let i = 0; i < nd; i++) { const a0 = i / nd * 6.28; k.person(pick(NATIVE, k.R), t => [C[0] + Math.cos(a0 + t * 6.28 / 16) * 0.15, C[1] + Math.sin(a0 + t * 6.28 / 16) * 0.15], { state: t => Math.sin(t * 3 + i) > 0 ? 3 : 0 }); }
    for (let i = 0; i < 10; i++) { const a = k.ringPt(C, r * 0.7, k.R() * 6.28), b = k.ringPt(C, r + 0.35, k.R() * 6.28), T = 16 / (1 + (i % 2)), ph = k.R() * T; k.person(pick(NATIVE, k.R), shuttle(a, b, T, ph)); }
    [[0.75, 0.2], [-0.7, 0.35], [0.2, -0.75]].forEach(([x, z]) => { const p = [C[0] + x, C[1] + z]; if (k.okLand(...p)) k.prop(GEO.garden(), p[0], p[1], { rot: k.R() }); });
    return { D: 16, seamless: true };
  } },

  /* loading: people carry wood (or crates) to the beach; a boat goes back and forth to the ship */
  loading: { ppu: 120, build(k, o) {
    const S = k.sea; if (!S) return TYPES.sugarmill.build(k, o);
    const pile = S.inland(0.55), beach = S.beach;
    k.prop(o.cargo === 'crates' ? GEO.crates() : GEO.logs(), pile[0], pile[1], { rot: 0.3 });
    k.prop(o.cargo === 'crates' ? GEO.crates() : GEO.logs(), beach[0] - S.dir[0] * 0.06, beach[1] - S.dir[1] * 0.06, { rot: 1, s: 0.8 });
    anchored(k, o.ships || 1, o.pennant || '#B3261E');
    const dir = Math.atan2(S.dir[1], S.dir[0]), wet = [beach[0] + S.dir[0] * 0.25, beach[1] + S.dir[1] * 0.25];
    k.ship(t => { const f = ease(tri(t / 6)); return { u: lerp(wet[0], S.A[0] - S.dir[0] * 0.25, f), v: lerp(wet[1], S.A[1] - S.dir[1] * 0.25, f), dir: dir + (((t / 6) % 1) > 0.5 ? Math.PI : 0), s: 0.35 }; }, '#8A6A4A');
    for (let i = 0; i < 14; i++) { const a = k.land(pile[0], pile[1], 0.1), b = k.land(beach[0] - S.dir[0] * 0.04, beach[1] - S.dir[1] * 0.04, 0.08), T = 6, ph = k.R() * T; k.person(pick(o.colors || NATIVE, k.R), shuttle(a, b, T, ph), { carry: outbound(T, ph) }); }
    if (o.watchers !== false) for (let i = 0; i < 4; i++) { const p = k.land(beach[0], beach[1], 0.1); k.person(pick(PT, k.R), () => p, { face: pile }); }
    if (o.town) town(k, o.houses ?? 10, 0.55, { hole: 0.25, roof: o.roof });
    return { D: 12, seamless: true };
  } }
};
function toLL(k, uv) { return [k.grid.lon0 + uv[0] * k.grid.step, k.grid.lat0 - uv[1] * k.grid.step]; }

/* ---------- manager: play, repeat, stop ---------- */
export class FX {
  constructor(grid, Y, scene) { this.grid = grid; this.Y = Y; this.scene = scene; this.list = []; this.clock = 0; }
  /* return {focus, ppu, bounds} for the camera */
  play(e, def, { loop = true, key = e.id } = {}) {
    this.stop(key);
    const type = TYPES[def.type]; if (!type) return null;
    let seed = 1; for (const ch of e.id) seed = Math.imul(seed ^ ch.charCodeAt(0), 2654435761);
    const k = new Kit(this.grid, this.Y, e, seed >>> 0);
    const res = type.build(k, def) || { D: 12 };
    k.finish(); this.scene.add(k.group);
    const a = { key, k, D: res.D, loop, t: 0, seamless: res.seamless };
    this.list.push(a);
    return { focus: k.focus || k.C, ppu: def.ppu || type.ppu, bounds: k.bounds, restart: () => { a.t = 0; k.reset(); } };
  }
  has(key) { return this.list.some(a => a.key === key); }
  get count() { return this.list.length; }
  stop(key) { this.list = this.list.filter(a => { if (key && a.key !== key) return true; a.k.dispose(); return false; }); }
  tick(dt, ppu) {
    this.clock += dt;
    for (const a of [...this.list]) {
      a.t += dt;
      if (a.t >= a.D) { if (!a.loop) { this.stop(a.key); continue; } if (a.seamless) a.t -= a.D; else { a.t = 0; a.k.reset(); } }
      a.k.update(a.t, dt, ppu, this.clock);
    }
  }
}
