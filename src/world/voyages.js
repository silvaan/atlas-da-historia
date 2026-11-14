// Voyage of the selected event: the route is drawn little by little, with a ship at the tip,
// then stays on the map with a dash moving in the direction of travel. Minimum width in pixels: it shows even for the whole world.
import * as THREE from 'three';
import { toUV } from '../data/grid.js';
import { routeVia } from './paths.js';
import { flowLine } from './flowline.js';
import { shipGeometry } from '../story/cabral.js';

const DRAW_SPEED = 0.42;   // fraction of the route per second (all take the same time, ~2.4 s)

export class Voyages {
  constructor(grid, Y, scene, labelRoot) {
    this.grid = grid; this.Y = Y; this.group = new THREE.Group(); scene.add(this.group);
    this.labelRoot = labelRoot; this.items = []; this.stops = []; this.key = null; this.t = 0;
    this.ship = new THREE.Mesh(shipGeometry(), new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
    this.ship.visible = false; this.ship.renderOrder = 6; this.group.add(this.ship);
    this.v = new THREE.Vector3();
  }

  /* sea route between the points: [[u, y, v], ...] and cumulative lengths */
  path(pts) {
    const { grid, Y } = this;
    const uv = routeVia(grid, 'sea', pts.map(p => toUV(...p))).flat(), out = [];
    for (const [u, v] of uv) { const i = Math.floor(v) * grid.cols + Math.floor(u); out.push([u, Math.min(Y[i], 0) + 0.03, v]); }
    const L = [0]; for (let k = 1; k < out.length; k++) L.push(L[k - 1] + Math.hypot(out[k][0] - out[k - 1][0], out[k][2] - out[k - 1][2]));
    return { pts: out, L, len: L[L.length - 1] || 1 };
  }

  show(key, defs) {
    if (this.key === key) return;
    this.clear(); this.key = key; if (!defs) return;
    let delay = 0;
    for (const d of defs) {
      const p = this.path(d.pts); if (p.pts.length < 2) continue;
      const halo = flowLine([p.pts], { color: '#FBF8F1', px: d.later ? 6 : 9, minW: 0.02, opacity: d.later ? 0.45 : 0.75, order: 5 });
      const line = flowLine([p.pts], { color: d.color || '#B3261E', px: d.later ? 2.6 : 4.5, minW: 0.01, dashPx: d.later ? 7 : 14, gap: d.later ? 0.5 : 0.3, speed: 0.6, opacity: d.later ? 0.75 : 1, order: 6 });
      this.group.add(halo, line);
      // the main voyages are drawn together; the "later" stretches wait for the main one to finish
      const start = d.later ? delay : 0;
      this.items.push({ d, p, halo, line, start });
      if (!d.later) delay = Math.max(delay, 1 / DRAW_SPEED);
      for (const [lon, lat, name] of d.stops || []) {
        const [u, v] = toUV(lon, lat), el = document.createElement('div');
        el.className = 'vstop' + (d.later ? ' later' : ''); el.innerHTML = '<i></i>'; el.append(name);
        this.labelRoot.append(el); this.stops.push({ el, u, v, y: 0.05, at: start + this.fracNear(p, u, v) / DRAW_SPEED });
      }
    }
    this.t = 0;
  }
  fracNear(p, u, v) { let best = 0, bd = Infinity; p.pts.forEach((q, i) => { const d = (q[0] - u) ** 2 + (q[2] - v) ** 2; if (d < bd) { bd = d; best = i; } }); return p.L[best] / p.len; }
  /* bounds [u0, v0, u1, v1] of all voyages, for framing */
  bounds() {
    let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
    for (const it of this.items) for (const [u, , v] of it.p.pts) { a = Math.min(a, u); c = Math.max(c, u); b = Math.min(b, v); d = Math.max(d, v); }
    return this.items.length ? [a, b, c, d] : null;
  }
  /* how long until everything is drawn */
  get duration() { return this.items.reduce((m, it) => Math.max(m, it.start + 1 / DRAW_SPEED), 0); }
  replay() { this.t = 0; }
  clear() {
    for (const it of this.items) for (const m of [it.halo, it.line]) { m.geometry.dispose(); m.material.dispose(); m.removeFromParent(); }
    for (const s of this.stops) s.el.remove();
    this.items = []; this.stops = []; this.key = null; this.ship.visible = false;
  }

  /* position at fraction f of a route */
  at(p, f) {
    const s = Math.min(1, Math.max(0, f)) * p.len; let k = 1; while (k < p.L.length - 1 && p.L[k] < s) k++;
    const a = p.pts[k - 1], b = p.pts[k], q = (s - p.L[k - 1]) / ((p.L[k] - p.L[k - 1]) || 1);
    return { u: a[0] + (b[0] - a[0]) * q, y: a[1], v: a[2] + (b[2] - a[2]) * q, dir: Math.atan2(b[2] - a[2], b[0] - a[0]) };
  }

  tick(dt, ppu, project, w, h, onMap = true) {
    if (!this.items.length) return;
    this.t += dt;
    // ship: draws the main voyage; then keeps going back and forth along it, slowly
    const main = this.items.find(it => !it.d.later) || this.items[0];
    for (const it of this.items) {
      const f = (this.t - it.start) * DRAW_SPEED, r = f <= 0 ? -1 : Math.min(1, f) * it.p.len + 0.3;
      it.halo.material.uniforms.uReveal.value = it.line.material.uniforms.uReveal.value = r;
    }
    const fDraw = this.t * DRAW_SPEED, period = 14;
    const f = fDraw < 1 ? fDraw : ((this.t - 1 / DRAW_SPEED) % period) / period;
    const pos = this.at(main.p, f), sc = Math.min(90, Math.max(1, 90 / ppu));
    this.shipAt = { f, main };
    this.ship.visible = onMap && ppu < 30;   // up close, the ships of the animation are what you see
    this.ship.position.set(pos.u, pos.y, pos.v); this.ship.rotation.set(0, -pos.dir, 0); this.ship.scale.setScalar(sc);
    // named stops: appear when the drawing passes them
    for (const s of this.stops) {
      const on = this.t >= s.at;
      if (on) {
        const r = project(s.u, s.y, s.v), x = r?.[0], y = r?.[1], vis = !!r && x > -50 && x < w + 50 && y > -20 && y < h + 20;
        s.el.style.display = vis ? '' : 'none';
        if (vis) s.el.style.transform = `translate(${x}px, ${y}px)`;
      } else s.el.style.display = 'none';
    }
  }
}
