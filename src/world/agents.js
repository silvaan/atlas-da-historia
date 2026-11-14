// Travellers: people in the cities, carts on the roads, camel caravans and ships on the routes.
import * as THREE from 'three';
import { colored, merge } from './nature.js';
import { rng, groundY } from './settlements.js';
import { MISC, TUNICS } from '../data/palette.js';
import { passableBox as passable } from './paths.js';

const box = (w, h, d, x, y, z, c) => colored(new THREE.BoxGeometry(w, h, d).translate(x, y, z), c);
const cyl = (r, h, x, y, z, c, rx = 0, rz = 0) => { const g = new THREE.CylinderGeometry(r, r, h, 8); g.rotateX(rx); g.rotateZ(rz); return colored(g.translate(x, y, z), c); };

function shapes() {
  const leg = (x, z) => box(0.008, 0.035, 0.008, x, 0.0175, z, '#7A5A34');
  return {
    cart: merge([box(0.12, 0.045, 0.075, 0, 0.055, 0, MISC.cart), box(0.11, 0.025, 0.065, 0, 0.09, 0, '#C9A15A'),
      cyl(0.026, 0.012, -0.035, 0.026, 0.042, MISC.wheel, Math.PI / 2), cyl(0.026, 0.012, -0.035, 0.026, -0.042, MISC.wheel, Math.PI / 2),
      box(0.05, 0.006, 0.006, 0.08, 0.05, 0, MISC.wheel), box(0.065, 0.04, 0.035, 0.135, 0.04, 0, MISC.ox), box(0.02, 0.022, 0.024, 0.175, 0.052, 0, MISC.ox)]),
    camel: merge([box(0.1, 0.042, 0.04, 0, 0.068, 0, MISC.camel), box(0.04, 0.03, 0.034, -0.005, 0.1, 0, MISC.camel), box(0.018, 0.05, 0.018, 0.058, 0.095, 0, MISC.camel),
      box(0.035, 0.016, 0.018, 0.072, 0.12, 0, MISC.camel), box(0.05, 0.02, 0.045, -0.01, 0.12, 0, '#8E3B2E'),
      leg(-0.035, 0.012), leg(-0.035, -0.012), leg(0.035, 0.012), leg(0.035, -0.012)].map((g, i) => i >= 5 ? g.translate(0, 0.012, 0) : g)),
    ship: merge([box(0.28, 0.045, 0.085, 0, 0.0, 0, MISC.hull), box(0.06, 0.035, 0.075, -0.11, 0.035, 0, MISC.hull), box(0.05, 0.02, 0.05, 0.13, 0.02, 0, MISC.hull),
      cyl(0.005, 0.24, 0.0, 0.14, 0, '#3A2614'), box(0.008, 0.13, 0.17, 0.0, 0.15, 0, MISC.sail), box(0.009, 0.02, 0.17, 0.0, 0.19, 0, '#B9573C')]),
    body: new THREE.BoxGeometry(0.03, 0.055, 0.022).translate(0, 0.055, 0),
    head: new THREE.SphereGeometry(0.014, 8, 6).translate(0, 0.098, 0),
    legs: new THREE.BoxGeometry(0.022, 0.03, 0.016).translate(0, 0.015, 0)
  };
}

function mkPath(pts) { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][2] - pts[i - 1][2])); return { pts, L, len: L[L.length - 1] }; }
function at(p, s, out) {
  let k = 1; while (k < p.L.length - 1 && p.L[k] < s) k++;
  const a = p.pts[k - 1], b = p.pts[k], f = Math.min(1, Math.max(0, (s - p.L[k - 1]) / ((p.L[k] - p.L[k - 1]) || 1)));
  out[0] = a[0] + (b[0] - a[0]) * f; out[1] = a[1] + (b[1] - a[1]) * f; out[2] = a[2] + (b[2] - a[2]) * f; out[3] = Math.atan2(b[2] - a[2], b[0] - a[0]);
}

export function buildAgents(grid, Y, cities, paths) {
  const R = rng(42), S = shapes(), group = new THREE.Group();
  const movers = { cart: [], camel: [], ship: [] };
  for (const pts of paths.road) { const p = mkPath(pts); for (let k = 0; k < Math.ceil(p.len / 1.6); k++) movers.cart.push({ p, s: R() * p.len, dir: R() < 0.5 ? 1 : -1, sp: 0.22 + R() * 0.12 }); }
  for (const pts of paths.caravan) { const p = mkPath(pts); for (let k = 0; k < Math.ceil(p.len / 5); k++) { const s = R() * p.len, dir = R() < 0.5 ? 1 : -1; for (let j = 0; j < 4; j++) movers.camel.push({ p, s: s - j * 0.16 * dir, dir, sp: 0.18 }); } }
  for (const pts of paths.lane) { const p = mkPath(pts); for (let k = 0; k < Math.ceil(p.len / 2.5); k++) movers.ship.push({ p, s: R() * p.len, dir: R() < 0.5 ? 1 : -1, sp: 0.55 + R() * 0.3 }); }
  const people = [];
  const onLand = (c, rad, rnd) => { for (let k = 0; k < 12; k++) { const a = rnd() * 6.28, r = Math.sqrt(rnd()) * rad, x = c.u + Math.cos(a) * r, z = c.v + Math.sin(a) * r; if (passable(grid, 'land', x, z)) return [x, z]; } return null; };
  for (const c of cities) {
    for (let k = 0; k < c.size * 22; k++) {
      const rad = 0.25 + c.size * 0.3, p = onLand(c, rad, R); if (!p) continue;
      people.push({ c, x: p[0], z: p[1], tx: p[0], tz: p[1], sp: 0.06 + R() * 0.06, wait: R() * 2, ph: R() * 6.28, rad, rot: 0, moving: false });
    }
  }
  // fishing canoes near coastal cities and villages
  const canoes = [];
  for (const c of cities) {
    const spots = [];
    for (let k = 0; k < 40 && spots.length < 6; k++) { const a = R() * 6.28, r = 0.35 + R() * 1.1, x = c.u + Math.cos(a) * r, z = c.v + Math.sin(a) * r; if (passable(grid, 'sea', x, z, 0.06)) spots.push([x, z]); }
    if (spots.length < 2) continue;
    const n = c.cul === 'x' ? 4 : 1 + c.size;
    for (let k = 0; k < n; k++) { const [x, z] = spots[k % spots.length], [tx, tz] = spots[(k + 1) % spots.length]; canoes.push({ spots, x, z, tx, tz, sp: 0.04 + R() * 0.04, wait: R() * 4, rot: 0, ph: R() * 6 }); }
  }
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  const inst = {};
  for (const k of ['cart', 'camel', 'ship']) { inst[k] = new THREE.InstancedMesh(S[k], mat, Math.max(1, movers[k].length)); inst[k].count = movers[k].length; }
  inst.canoe = new THREE.InstancedMesh(merge([box(0.11, 0.016, 0.026, 0, 0.004, 0, '#6B4A2C'), box(0.016, 0.03, 0.014, 0.01, 0.025, 0, '#A9523A'), box(0.004, 0.004, 0.06, 0.02, 0.022, 0, '#4A3320')]), mat, Math.max(1, canoes.length)); inst.canoe.count = canoes.length;
  inst.body = new THREE.InstancedMesh(S.body, new THREE.MeshLambertMaterial({ color: '#ffffff' }), Math.max(1, people.length));
  inst.head = new THREE.InstancedMesh(S.head, new THREE.MeshLambertMaterial({ color: MISC.skin }), Math.max(1, people.length));
  inst.legs = new THREE.InstancedMesh(S.legs, new THREE.MeshLambertMaterial({ color: '#4A3A2C' }), Math.max(1, people.length));
  const col = new THREE.Color(); people.forEach((p, i) => inst.body.setColorAt(i, col.set(TUNICS[(R() * TUNICS.length) | 0])));
  for (const m of Object.values(inst)) { m.frustumCulled = false; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); group.add(m); }

  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3(1, 1, 1), up = new THREE.Vector3(0, 1, 0), o = [0, 0, 0, 0];
  let t = 0;
  function update(dt, show) {
    t += dt;
    for (const k of ['cart', 'camel', 'ship']) {
      inst[k].visible = show.travel;
      if (!show.travel) continue;
      movers[k].forEach((a, i) => {
        a.s += a.sp * a.dir * dt; if (a.s > a.p.len) { a.s = a.p.len; a.dir = -1; } else if (a.s < 0) { a.s = 0; a.dir = 1; }
        at(a.p, a.s, o);
        const yaw = -(o[3] + (a.dir < 0 ? Math.PI : 0)), bob = k === 'ship' ? Math.sin(t * 2 + i) * 0.006 : 0;
        q.setFromAxisAngle(up, yaw); m4.compose(p3.set(o[0], (k === 'ship' ? o[1] - 0.012 : o[1] - 0.02) + bob, o[2]), q, s3); inst[k].setMatrixAt(i, m4);
      });
      inst[k].instanceMatrix.needsUpdate = true;
    }
    inst.canoe.visible = show.travel;
    if (show.travel) {
      canoes.forEach((a, i) => {
        if (a.wait > 0) a.wait -= dt;
        else {
          const dx = a.tx - a.x, dz = a.tz - a.z, d = Math.hypot(dx, dz);
          if (d < 0.01) { [a.tx, a.tz] = a.spots[(Math.random() * a.spots.length) | 0]; a.wait = 2 + Math.random() * 5; }
          else { const st = Math.min(d, a.sp * dt), nx = a.x + dx / d * st, nz = a.z + dz / d * st; if (passable(grid, 'sea', nx, nz, 0.04)) { a.x = nx; a.z = nz; a.rot = -Math.atan2(dz, dx); } else { a.tx = a.x; a.tz = a.z; } }
        }
        const i0 = Math.floor(a.z) * grid.cols + Math.floor(a.x);
        q.setFromAxisAngle(up, a.rot); m4.compose(p3.set(a.x, Y[i0] + 0.008 + Math.sin(t * 2.5 + a.ph) * 0.004, a.z), q, s3); inst.canoe.setMatrixAt(i, m4);
      });
      inst.canoe.instanceMatrix.needsUpdate = true;
    }
    for (const k of ['body', 'head', 'legs']) inst[k].visible = show.people;
    if (!show.people) return;
    people.forEach((a, i) => {
      if (a.wait > 0) { a.wait -= dt; a.moving = false; }
      else {
        const dx = a.tx - a.x, dz = a.tz - a.z, d = Math.hypot(dx, dz);
        if (d < 0.01) { const p = onLand(a.c, a.rad, Math.random); if (p) { a.tx = p[0]; a.tz = p[1]; } a.wait = Math.random() * 3; }
        else {
          const st = Math.min(d, a.sp * dt), nx = a.x + dx / d * st, nz = a.z + dz / d * st;
          if (passable(grid, 'land', nx, nz)) { a.x = nx; a.z = nz; a.rot = -Math.atan2(dz, dx); a.moving = true; }
          else { a.tx = a.x; a.tz = a.z; }   // water is in the way: stop and pick another destination
        }
      }
      const y = groundY(grid, Y, a.x, a.z), bob = a.moving ? Math.abs(Math.sin(t * 9 + a.ph)) * 0.008 : 0;
      q.setFromAxisAngle(up, a.rot);
      m4.compose(p3.set(a.x, y + bob, a.z), q, s3); inst.body.setMatrixAt(i, m4); inst.head.setMatrixAt(i, m4);
      s3.set(1, a.moving ? 0.8 + Math.abs(Math.sin(t * 9 + a.ph)) * 0.3 : 1, 1); m4.compose(p3.set(a.x, y, a.z), q, s3); inst.legs.setMatrixAt(i, m4); s3.set(1, 1, 1);
    });
    for (const k of ['body', 'head', 'legs']) inst[k].instanceMatrix.needsUpdate = true;
  }
  return { group, update };
}
