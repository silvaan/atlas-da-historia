// Orthographic camera with three views (top, tilted, isometric), dragging, zoom at the cursor and smooth flights.
import * as THREE from 'three';
import { BEND, R_EARTH, unbend } from '../world/bend.js';

export const VIEWS = {
  top: { polar: 0.01, az: 0, label: 'Top' },
  tilt: { polar: 0.78, az: 0, label: 'Tilted' },
  iso: { polar: 0.9553, az: Math.PI / 4, label: 'Isometric' }
};
export const PPU_MIN = 5.4, PPU_MAX = 700, GLOBE_BELOW = 5.5;   // zooming out below this opens the globe   // pixels per square (0.5°)

export class MapCamera {
  constructor(dom, world) {
    this.dom = dom; this.world = world;        // world = { cols, rows }
    this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -4000, 4000);
    this.cur = { tx: world.cols * 0.55, tz: world.rows * 0.38, ppu: 2.2, polar: VIEWS.top.polar, az: 0 };
    this.goal = { ...this.cur };
    this.view = 'top';
    this.ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); this.sphere = new THREE.Sphere(); this.sc = new THREE.Vector3(); this.hit = new THREE.Vector3();
    this.ray = new THREE.Raycaster();
    this.pointers = new Map();
    this.listeners = [];
    this.enabled = true; this.touched = 0;    // touched: last time the user moved the map (so automatic flights do not override them)
    this.resize();
    this.#bind();
    this.apply();
  }

  get ppu() { return this.cur.ppu; }
  onChange(f) { this.listeners.push(f); }

  resize() {
    const w = this.dom.clientWidth, h = this.dom.clientHeight;
    Object.assign(this.cam, { left: -w / 2, right: w / 2, top: h / 2, bottom: -h / 2 });
    this.cam.updateProjectionMatrix();
  }

  setView(name) {
    const v = VIEWS[name]; if (!v) return;
    this.view = name; this.goal.polar = v.polar;
    // keep the rotation the user chose when switching between tilted and isometric
    this.goal.az = name === 'top' ? 0 : (name === 'iso' ? nearestDiag(this.goal.az) : 0);
  }
  rotate(step) { if (this.view !== 'top') this.goal.az += step; }
  flyTo(u, v, ppu) { this.goal.tx = u; this.goal.tz = v; if (ppu) this.goal.ppu = clamp(ppu, PPU_MIN, PPU_MAX); }
  home() { this.flyTo(this.cur.tx, this.cur.tz, Math.max(PPU_MIN, this.dom.clientHeight / (2 * R_EARTH) * 0.92)); }

  /* apply the current state to the Three camera */
  apply() {
    const { tx, tz, ppu, polar, az } = this.cur, D = 1500;
    this.cam.position.set(tx + D * Math.sin(polar) * Math.sin(az), D * Math.cos(polar), tz + D * Math.sin(polar) * Math.cos(az));
    this.cam.up.set(0, 1, 0);
    this.cam.lookAt(tx, 0, tz);
    this.cam.zoom = ppu; this.cam.updateProjectionMatrix(); this.cam.updateMatrixWorld();
    BEND.uBendC.value.set(tx, tz);   // the Earth curves around the centre of the view
  }

  /* animate towards the goal; return true if anything changed */
  tick(dt) {
    const k = 1 - Math.exp(-dt * 9), c = this.cur, g = this.goal;
    let moved = false;
    for (const key of ['tx', 'tz', 'polar', 'az']) { const d = g[key] - c[key]; if (Math.abs(d) > 1e-4) { c[key] += d * k; moved = true; } else c[key] = g[key]; }
    const lr = Math.log(g.ppu / c.ppu); if (Math.abs(lr) > 1e-4) { c.ppu *= Math.exp(lr * k); moved = true; } else c.ppu = g.ppu;
    this.#clamp(c); this.#clamp(g);
    if (moved) { this.apply(); for (const f of this.listeners) f(); }
    return moved;
  }

  /* ground point (y = 0) under a screen position, in world coordinates */
  groundAt(x, y, out = new THREE.Vector3()) {
    const r = this.dom.getBoundingClientRect();
    this.ray.setFromCamera({ x: ((x - r.left) / r.width) * 2 - 1, y: -((y - r.top) / r.height) * 2 + 1 }, this.cam);
    // the ground is the bent sphere: find the point on it and map it back to the flat map
    const c = BEND.uBendC.value, hit = this.ray.ray.intersectSphere(this.sphere.set(this.sc.set(c.x, -R_EARTH, c.y), R_EARTH), this.hit);
    return hit ? unbend(hit, out) : null;
  }

  #clamp(s) { s.tx = clamp(s.tx, 0, this.world.cols); s.tz = clamp(s.tz, 0, this.world.rows); s.ppu = clamp(s.ppu, PPU_MIN, PPU_MAX); }

  /* zoom keeping the point under the cursor fixed (applied directly, without animation, to follow the gesture) */
  #zoomAt(x, y, factor) {
    this.touched = performance.now();
    if (factor < 1 && this.cur.ppu * factor < GLOBE_BELOW && this.onOutLimit) { if (this.cur.ppu <= GLOBE_BELOW * 1.02) this.onOutLimit(); this.cur.ppu = this.goal.ppu = GLOBE_BELOW; this.apply(); return; }
    const before = this.groundAt(x, y); if (!before) return;
    this.cur.ppu = this.goal.ppu = clamp(this.cur.ppu * factor, PPU_MIN, PPU_MAX);
    this.apply();
    const after = this.groundAt(x, y); if (!after) return;
    this.cur.tx += before.x - after.x; this.cur.tz += before.z - after.z;
    this.goal.tx = this.cur.tx; this.goal.tz = this.cur.tz;
    this.#clamp(this.cur); this.apply(); for (const f of this.listeners) f();
  }
  #panBy(x0, y0, x1, y1) {
    this.touched = performance.now();
    const a = this.groundAt(x0, y0), b = this.groundAt(x1, y1); if (!a || !b) return;
    this.cur.tx += a.x - b.x; this.cur.tz += a.z - b.z;
    this.goal.tx = this.cur.tx; this.goal.tz = this.cur.tz;
    this.#clamp(this.cur); this.apply(); for (const f of this.listeners) f();
  }

  #bind() {
    const el = this.dom;
    el.addEventListener('wheel', e => {
      if (!this.enabled) return;
      e.preventDefault();
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      this.#zoomAt(e.clientX, e.clientY, Math.exp(-dy * 0.0016));
    }, { passive: false });
    el.addEventListener('pointerdown', e => {
      if (!this.enabled) return;
      el.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.dragged = false;
    });
    el.addEventListener('pointermove', e => {
      const p = this.pointers.get(e.pointerId); if (!p) return;
      if (this.pointers.size === 1) {
        if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > 0) this.dragged = true;
        this.#panBy(p.x, p.y, e.clientX, e.clientY);
      } else if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()], o = a === p ? b : a;
        const d0 = Math.hypot(p.x - o.x, p.y - o.y), d1 = Math.hypot(e.clientX - o.x, e.clientY - o.y);
        const mx0 = (p.x + o.x) / 2, my0 = (p.y + o.y) / 2, mx1 = (e.clientX + o.x) / 2, my1 = (e.clientY + o.y) / 2;
        this.#panBy(mx0, my0, mx1, my1);
        if (d0 > 0) this.#zoomAt(mx1, my1, d1 / d0);
        this.dragged = true;
      }
      p.x = e.clientX; p.y = e.clientY;
    });
    const up = e => this.pointers.delete(e.pointerId);
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    el.addEventListener('dblclick', e => this.enabled && this.#zoomAt(e.clientX, e.clientY, 2.2));
    window.addEventListener('keydown', e => {
      if (!this.enabled || e.target.closest?.('input, textarea, select')) return;
      const r = this.dom.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const pan = (dx, dy) => this.#panBy(cx, cy, cx - dx * 120, cy - dy * 120);
      switch (e.key) {
        case 'ArrowLeft': case 'a': pan(-1, 0); break;
        case 'ArrowRight': case 'd': pan(1, 0); break;
        case 'ArrowUp': case 'w': pan(0, -1); break;
        case 'ArrowDown': case 's': pan(0, 1); break;
        case '+': case '=': this.goal.ppu = clamp(this.goal.ppu * 1.6, PPU_MIN, PPU_MAX); break;
        case '-': case '_': if (this.goal.ppu / 1.6 < GLOBE_BELOW && this.onOutLimit) { this.onOutLimit(); break; } this.goal.ppu = clamp(this.goal.ppu / 1.6, PPU_MIN, PPU_MAX); break;
        case 'q': this.rotate(-Math.PI / 2); break;
        case 'e': this.rotate(Math.PI / 2); break;
        default: return;
      }
      e.preventDefault();
    });
  }
}

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const nearestDiag = az => Math.round((az - Math.PI / 4) / (Math.PI / 2)) * (Math.PI / 2) + Math.PI / 4;
