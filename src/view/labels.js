// HTML labels over the map: empire names when zoomed out, cities as the zoom increases.
import * as THREE from 'three';

export class Labels {
  constructor(root) { this.root = root; this.items = []; this.v = new THREE.Vector3(); }

  set(empires, cities, Y, grid, regions = [], landmarks = []) {
    this.root.replaceChildren(); this.items = [];
    const add = (cls, text, u, y, v, prio, minPpu, maxPpu, ref) => {
      const el = document.createElement('div'); el.className = 'lbl ' + cls; el.textContent = text;
      this.root.append(el); this.items.push({ el, u, y, v, prio, minPpu, maxPpu, w: 0, h: 0, shown: false, below: cls === 'lm', ref, big: cls === 'emp', x: 0, sy: 0 });
    };
    for (const e of empires) add('emp', e.name, e.u, 0, e.v, 1000 + e.size, 0, 9, { key: 'st:' + e.name, name: e.name, u: e.u, v: e.v });
    for (const [name, lon, lat] of regions) { const u = (lon - grid.lon0) / grid.step, v = (grid.lat0 - lat) / grid.step; add('reg', name, u, 0, v, 500, 2.5, 40, { key: 'reg:' + name, name, u, v }); }
    for (const c of cities) {
      const i = Math.floor(c.v) * grid.cols + Math.floor(c.u), y = Math.max(0, Y[i]) + 0.3;
      add('city s' + c.size + (c.cap ? ' cap' : ''), c.name, c.u, y, c.v, c.size * 100 + (c.cap ? 50 : 0), [99, 14, 5, 2.2][c.size], 1e9, { key: 'city:' + c.name, name: c.name, u: c.u, v: c.v });
    }
    for (const m of landmarks) add('lm', m.name, m.u, m.y, m.v, m.major ? 260 : 160, m.major ? 2.6 : 6, 1e9, m.ref);
    this.measure = true;
  }

  /* visible label under the screen point (the large state names only if asked) */
  pick(x, y, big = false) {
    for (const it of this.items) {
      if (!it.shown || !it.ref || it.big !== big) continue;
      if (x >= it.x - it.w / 2 - 3 && x <= it.x + it.w / 2 + 3 && y >= it.sy - it.h - 3 && y <= it.sy + 3) return it.ref;
    }
    return null;
  }
  update(project, ppu, w, h, taken = []) {
    if (this.measure) { for (const it of this.items) { it.el.style.display = 'block'; it.w = it.el.offsetWidth; it.h = it.el.offsetHeight; it.el.style.display = 'none'; it.shown = false; } this.measure = false; }
    const boxes = [...taken], order = [...this.items].sort((a, b) => b.prio - a.prio);
    for (const it of order) {
      let show = ppu >= it.minPpu && ppu < it.maxPpu;
      let x = 0, y = 0;
      if (show) {
        const r = project(it.u, it.y, it.v);
        if (r) { x = r[0]; y = r[1]; }
        show = !!r && x > -100 && x < w + 100 && y > -40 && y < h + 40;
      }
      if (show) {
        if (it.below) y += it.h + 6;   // monuments: the name goes underneath, so it does not cover the drawing
        const b = [x - it.w / 2 - 4, y - it.h - 4, x + it.w / 2 + 4, y + 4];
        if (boxes.some(o => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1])) show = false; else boxes.push(b);
      }
      if (show !== it.shown) { it.el.style.display = show ? 'block' : 'none'; it.shown = show; }
      if (show) { it.el.style.transform = `translate(${x - it.w / 2}px, ${y - it.h}px)`; it.x = x; it.sy = y; }
    }
  }
}
