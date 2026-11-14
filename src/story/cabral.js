// Scene: Cabral's fleet, from Lisbon (9 March 1500) to the coast of Bahia and back out to sea (2 May).
// Dates and facts follow the letter of Pero Vaz de Caminha.
import * as THREE from 'three';
import { bendVec } from '../world/bend.js';
import { toUV } from '../data/grid.js';
import { colored, merge } from '../world/nature.js';
import { routeVia, snap, passable as passableTile, passableBox } from '../world/paths.js';
import { MISC } from '../data/palette.js';

const MONTHS = ['January', 'February', 'March', 'April', 'May'];
const START = [0, 31, 60, 91, 121];                         // 1500 was a leap year in the Julian calendar
const doy = (m, d) => START[m - 1] + d;
const fmt = n => { let m = 4; while (START[m] >= n) m--; return `${Math.round(n - START[m])} ${MONTHS[m]} 1500`; };
const lerp = (a, b, f) => a + (b - a) * f, clamp01 = x => Math.min(1, Math.max(0, x)), ease = x => x * x * (3 - 2 * x);
const seg = (t, t0, t1) => clamp01((t - t0) / (t1 - t0));

const box = (w, h, d, x, y, z, c) => colored(new THREE.BoxGeometry(w, h, d).translate(x, y, z), c);
export function shipGeometry() {
  const mast = (x, h) => colored(new THREE.CylinderGeometry(0.005, 0.006, h, 5).translate(x, h / 2 + 0.02, 0), '#3A2614');
  return merge([
    box(0.34, 0.06, 0.11, 0, 0.0, 0, MISC.hull), box(0.09, 0.055, 0.1, -0.13, 0.055, 0, MISC.hull), box(0.06, 0.035, 0.09, 0.14, 0.045, 0, MISC.hull),
    mast(0.02, 0.3), mast(0.11, 0.22), mast(-0.1, 0.2),
    box(0.008, 0.14, 0.2, 0.02, 0.19, 0, MISC.sail), box(0.008, 0.11, 0.16, 0.11, 0.15, 0, MISC.sail), box(0.008, 0.1, 0.12, -0.1, 0.15, 0, MISC.sail),
    box(0.004, 0.1, 0.022, 0.026, 0.19, 0, '#B3261E'), box(0.004, 0.022, 0.1, 0.026, 0.2, 0, '#B3261E')   // cross of the Order of Christ
  ]);
}

/* sampled path: position and direction by fraction of its length */
export function track(grid, Y, waypoints) {
  const pts = routeVia(grid, 'sea', waypoints.map(p => toUV(...p))).flat();
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const len = L[L.length - 1];
  const at = f => {
    const s = clamp01(f) * len; let k = 1; while (k < L.length - 1 && L[k] < s) k++;
    const a = pts[k - 1], b = pts[k], q = (s - L[k - 1]) / ((L[k] - L[k - 1]) || 1);
    return { u: lerp(a[0], b[0], q), v: lerp(a[1], b[1], q), dir: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  };
  const fracNear = (lon, lat) => { const [u, v] = toUV(lon, lat); let best = 0, bd = Infinity; pts.forEach((p, i) => { const d = (p[0] - u) ** 2 + (p[1] - v) ** 2; if (d < bd) { bd = d; best = i; } }); return L[best] / len; };
  return { pts, at, fracNear, len };
}

export const cabral = {
  id: 'cabral', title: 'Cabral’s fleet', length: 'about 1 minute',
  build(ctx) {
    const { grid, Y, scene, cam, setView, layer } = ctx;
    const group = new THREE.Group(); scene.add(group);
    const seaY = (u, v) => Y[Math.floor(v) * grid.cols + Math.floor(u)] + 0.012;

    // routes
    const outbound = track(grid, Y, [[-9.4, 38.65], [-16.0, 30.2], [-26.0, 16.0], [-29.0, 0], [-34.0, -11.0], [-38.95, -16.35]]);
    const india = track(grid, Y, [[-38.95, -16.35], [-30, -26], [-12, -35], [8, -37.5], [20, -37]]);
    const letterRun = track(grid, Y, [[-38.95, -16.35], [-32, -5], [-26, 14], [-17, 30], [-9.4, 38.65]]);
    const fCanaries = outbound.fracNear(-16.0, 30.2), fCapeVerde = outbound.fracNear(-26.0, 16.0);

    // ships
    const N = 13, fleet = new THREE.InstancedMesh(shipGeometry(), new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }), N);
    fleet.frustumCulled = false; group.add(fleet);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);

    // beach: the land square nearest the anchorage, and the village a little inland
    const [au, av] = toUV(-38.95, -16.35);
    const bi = snap(grid, 'land', au, av, 6), beach = [bi % grid.cols + 0.5, Math.floor(bi / grid.cols) + 0.5];
    const vi = snap(grid, 'land', beach[0] - 0.9, beach[1] + 0.1, 4), village = [vi % grid.cols + 0.5, Math.floor(vi / grid.cols) + 0.5];
    const gy = (u, v) => Math.max(0, Y[Math.floor(v) * grid.cols + Math.floor(u)]);

    // people: the Tupiniquim come out of the village; the Portuguese land from the ships’ boats
    const R = (() => { let a = 7; return () => (a = (a * 16807) % 2147483647) / 2147483647; })();
    const people = [];
    const spot = (cx, cz, r) => { for (let k = 0; k < 20; k++) { const x = cx + (R() - 0.5) * r * 2, z = cz + (R() - 0.5) * r * 2; if (passableBox(grid, 'land', x, z)) return [x, z]; } return [cx, cz]; };
    const toSea = [au - beach[0], av - beach[1]], tl = Math.hypot(...toSea) || 1, sx = toSea[0] / tl, sz = toSea[1] / tl;
    for (let k = 0; k < 34; k++) { const [x, z] = spot(village[0], village[1], 0.3), [tx, tz] = spot(beach[0] - sx * 0.12, beach[1] - sz * 0.12, 0.22); people.push({ x, z, tx, tz, who: 'tupi', start: 25 + R() * 3, sp: 0.16 + R() * 0.06 }); }
    for (let k = 0; k < 10; k++) { const [tx, tz] = spot(beach[0] + sx * 0.25, beach[1] + sz * 0.25, 0.12); people.push({ x: tx + sx * 0.2, z: tz + sz * 0.2, tx, tz, who: 'pt', start: 24 + R() * 2, sp: 0.05 }); }
    const body = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 0.055, 0.022).translate(0, 0.055, 0), new THREE.MeshLambertMaterial({ color: '#ffffff' }), people.length);
    const head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.014, 8, 6).translate(0, 0.098, 0), new THREE.MeshLambertMaterial({ color: '#ffffff' }), people.length);
    const col = new THREE.Color();
    people.forEach((p, i) => {
      body.setColorAt(i, col.set(p.who === 'tupi' ? (i % 3 ? '#A9523A' : '#2E2A26') : ['#3B3F55', '#6B2A2A', '#4A4036'][i % 3]));   // urucum and jenipapo body paint; dark clothes
      head.setColorAt(i, col.set(p.who === 'tupi' ? '#9E6B4A' : '#D9AE8E'));
    });
    for (const m of [body, head]) { m.frustumCulled = false; group.add(m); }
    const cross = new THREE.Mesh(merge([box(0.04, 0.5, 0.04, 0, 0.25, 0, '#4A3320'), box(0.24, 0.04, 0.04, 0, 0.37, 0, '#4A3320')]), new THREE.MeshLambertMaterial({ vertexColors: true }));
    const [cx, cz] = spot(beach[0] + sx * 0.08, beach[1] + sz * 0.08, 0.06); cross.position.set(cx, gy(cx, cz), cz); cross.scale.setScalar(0.001); group.add(cross);

    // overlay: fleet trail and tag
    const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'), trail = document.createElementNS(NS, 'polyline');
    svg.setAttribute('class', 'sc-svg'); trail.setAttribute('class', 'sc-trail'); svg.append(trail);
    const tag = document.createElement('div'); tag.className = 'sc-tag'; layer.append(svg, tag);

    const beats = [
      { at: 0, text: 'Thirteen ships, with about 1,500 men, leave Lisbon for India under the command of Pedro Álvares Cabral. It is the second voyage on the route Vasco da Gama opened two years before.' },
      { at: 5, text: '14 March: they pass the Canary Islands.' },
      { at: 8.5, text: '22 March: they sight São Nicolau, in Cape Verde.' },
      { at: 10.5, text: 'On the night of 23 March, Vasco de Ataíde’s ship disappears and is never seen again. Twelve remain.' },
      { at: 13, text: 'To escape the calms near the African coast, the pilots make a wide loop through the ocean, as Gama had done, but even farther west.' },
      { at: 19, text: '21 April: long weeds floating in the sea warn that land is near.' },
      { at: 21, text: '22 April, afternoon: they sight a tall, round hill and call it Monte Pascoal (Easter Mount), because it was Easter week.' },
      { at: 25, text: '23 April: first meeting on the beach. Caminha describes brown, reddish men, naked, with bows and arrows, who lay down their weapons when Nicolau Coelho signals to them. He gives them a red cap and receives a feather headdress.' },
      { at: 34, text: '26 April, Sunday: Friar Henrique de Coimbra says the first Mass on an islet in the bay. Many Tupiniquim watch from the beach.' },
      { at: 40, text: '1 May: a large wooden cross is raised on the beach, and a second Mass is said before it.' },
      { at: 45, text: '2 May: the fleet sails on to India. One ship returns to Lisbon carrying Caminha’s letter, the first written description of this land.' },
      { at: 54, text: 'For Portugal, this land was a stopover on the way to the spices. The threads on the map show what came before and what came after.' }
    ];
    // date as a function of scene time
    const date = t => {
      if (t < 4) return fmt(doy(3, 9));
      if (t < 10) return fmt(lerp(doy(3, 9), doy(3, 22), ease(seg(t, 4, 10))));
      if (t < 21) return fmt(lerp(doy(3, 22), doy(4, 22), seg(t, 10, 21)));
      if (t < 25) return fmt(doy(4, 22));
      if (t < 34) return fmt(doy(4, 23));
      if (t < 40) return fmt(doy(4, 26));
      if (t < 45) return fmt(doy(5, 1));
      return fmt(doy(5, 2));
    };
    // fraction of the outbound route covered, as a function of time
    const fOutbound = t => t < 4 ? 0 : t < 10 ? lerp(0, fCapeVerde, ease(seg(t, 4, 10))) : lerp(fCapeVerde, 1, ease(seg(t, 10, 21)));
    void fCanaries;

    let viewSet = '';
    const view = v => { if (viewSet !== v) { viewSet = v; setView(v); } };
    let clock = 0;
    function update(t, dt) {
      clock += dt;
      const ppu = cam.ppu, sc = Math.min(7, Math.max(1, 14 / ppu));
      // where the main fleet is
      let lead, moving = true;
      if (t < 21) lead = outbound.at(fOutbound(t));
      else if (t < 45) { lead = outbound.at(1); moving = false; }
      else lead = india.at(ease(seg(t, 45, 56)) * 0.45);
      // camera
      if (t < 4) { view('tilt'); cam.flyTo(lead.u, lead.v + 1, 16); }
      else if (t < 21) { view('tilt'); cam.flyTo(lead.u, lead.v, t < 10 ? 6 : 4.2); }
      else if (t < 25) { view('tilt'); cam.flyTo(beach[0] + 1, beach[1], 22); }
      else if (t < 45) { view('iso'); cam.flyTo(beach[0] + sx * 0.3, beach[1] + sz * 0.3, t < 34 ? 95 : 80); }
      else { view('tilt'); cam.flyTo(lead.u, lead.v, 5); }
      // ships
      for (let i = 0; i < N; i++) {
        let P = lead, s = sc, row = Math.floor(i / 3), c = (i % 3) - 1;
        if (i === 12) s *= t < 10.5 ? 1 : 1 - seg(t, 10.5, 11.5);             // the lost ship
        let along = -row * 0.42, side = c * 0.34, dir = P.dir;
        if (!moving) { P = { u: beach[0] + sx * 1.4, v: beach[1] + sz * 1.4 }; along = -row * 0.42; side = c * 0.42; dir = Math.atan2(sz, sx) + Math.PI / 2; }
        if (i === 11 && t >= 45) { P = letterRun.at(ease(seg(t, 45, 56)) * 0.45); along = 0; side = 0; dir = P.dir; }  // returns with the letter
        const ca = Math.cos(dir), sa = Math.sin(dir), k = moving ? s : 1;
        let u = P.u, v = P.v;
        for (const f of [1, 0.7, 0.45, 0.2]) {   // the formation shrinks if a ship would end up on land
          const tu = P.u + (ca * along - sa * side) * k * f, tv = P.v + (sa * along + ca * side) * k * f;
          if (passableBox(grid, 'sea', tu, tv, 0.18)) { u = tu; v = tv; break; }
        }
        q.setFromAxisAngle(up, -dir);
        m4.compose(p3.set(u, seaY(u, v) + Math.sin(clock * 2 + i) * 0.006, v), q, s3.setScalar(Math.max(0.0001, s))); fleet.setMatrixAt(i, m4);
      }
      fleet.instanceMatrix.needsUpdate = true;
      // people
      people.forEach((p, i) => {
        const vis = t >= p.start && t < 46;
        if (vis && t >= p.start) { const dx = p.tx - p.x, dz = p.tz - p.z, d = Math.hypot(dx, dz); if (d > 0.01) { const st = Math.min(d, p.sp * dt), nx = p.x + dx / d * st, nz = p.z + dz / d * st; if (passableBox(grid, 'land', nx, nz)) { p.x = nx; p.z = nz; } else { p.tx = p.x; p.tz = p.z; } p.rot = -Math.atan2(dz, dx); } else p.rot = -Math.atan2(sz, sx) + (p.who === 'pt' ? Math.PI : 0); }
        q.setFromAxisAngle(up, p.rot || 0);
        m4.compose(p3.set(p.x, gy(p.x, p.z), p.z), q, s3.setScalar(vis ? 1 : 0.0001)); body.setMatrixAt(i, m4); head.setMatrixAt(i, m4);
      });
      body.instanceMatrix.needsUpdate = head.instanceMatrix.needsUpdate = true;
      cross.scale.setScalar(Math.max(0.001, ease(seg(t, 40, 41.5))));
      // trail and tag (on screen)
      const w = window.innerWidth, h = window.innerHeight, v3 = new THREE.Vector3(), scr = (u, v) => { bendVec(v3.set(u, 0, v)).project(cam.cam); return [(v3.x * 0.5 + 0.5) * w, (-v3.y * 0.5 + 0.5) * h]; };
      const done = t < 21 ? fOutbound(t) : 1, n = Math.max(2, Math.ceil(done * 160)), pts = [];
      for (let k = 0; k <= n; k++) { const P = outbound.at(done * k / n); pts.push(scr(P.u, P.v).map(x => x.toFixed(1)).join(',')); }
      if (t >= 45) { const f = ease(seg(t, 45, 56)) * 0.45; for (let k = 0; k <= 40; k++) { const P = india.at(f * k / 40); pts.push(scr(P.u, P.v).map(x => x.toFixed(1)).join(',')); } }
      trail.setAttribute('points', pts.join(' '));
      const showTag = ppu < 30;
      tag.style.display = showTag ? '' : 'none';
      if (showTag) { const [x, y] = scr(lead.u, lead.v); tag.style.transform = `translate(${x}px, ${y}px)`; tag.textContent = `Cabral’s fleet · ${t < 11 ? 13 : t < 45 ? 12 : 11} ships`; }
    }
    function dispose() { group.traverse(o => { o.geometry?.dispose(); o.material?.dispose?.(); }); group.removeFromParent(); }
    return { beats, duration: 58, date, update, dispose };
  }
};

export const SCENES = { cabral };
