// Events on the map (HTML markers) and the links between them (SVG arcs).
import * as THREE from 'three';
import { toUV } from '../data/grid.js';
import { groundY } from '../world/settlements.js';
import { span } from '../net/graph.js';

const NS = 'http://www.w3.org/2000/svg';
const svg = (tag, attrs = {}) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); return el; };

export class Network {
  constructor(root, graph, kinds, onPick) {
    this.root = root; this.graph = graph; this.kinds = kinds;
    this.year = 1500; this.chapter = null; this.lastYear = 2000; this.sel = null; this.hidden = new Set(); this.hover = null; this.visible = true;
    this.v = new THREE.Vector3();
    this.svg = svg('svg', { class: 'arcs' });
    const defs = svg('defs');
    for (const [id, color] of [['a-out', '#F2B544'], ['a-in', '#7CC4F0'], ['a-faint', 'rgba(255,255,255,.5)']]) {
      const m = svg('marker', { id, viewBox: '0 0 10 10', refX: 17, refY: 5, markerWidth: 9, markerHeight: 9, markerUnits: 'userSpaceOnUse', orient: 'auto-start-reverse' });
      m.append(svg('path', { d: 'M0,0 L10,5 L0,10 z', fill: color })); defs.append(m);
    }
    this.svg.append(defs);
    this.arcs = graph.links.map(l => {
      const g = svg('g', { class: 'arc' }), halo = svg('path', { class: 'halo' }), line = svg('path', { class: 'line' });
      g.append(halo, line); this.svg.append(g); return { l, g, halo, line, shown: false };
    });
    this.pins = document.createElement('div'); this.pins.className = 'pins';
    root.append(this.svg, this.pins);
    this.items = graph.order.map(e => {
      const el = document.createElement('button'); el.className = 'ev'; el.style.setProperty('--c', kinds[e.k].color);
      el.innerHTML = `<i></i><span></span>`; el.querySelector('span').textContent = e.t;
      el.title = `${e.t} (${span(e)})`;
      el.onclick = ev => { ev.stopPropagation(); onPick(e.id); };
      el.onpointerenter = () => { this.hover = e.id; }; el.onpointerleave = () => { if (this.hover === e.id) this.hover = null; };
      el.addEventListener('pointerdown', ev => ev.stopPropagation());
      this.pins.append(el);
      return { e, el, u: 0, y: 0, v: 0, x: 0, sy: 0, on: false, cls: '' };
    });
    this.byId = new Map(this.items.map(it => [it.e.id, it]));
  }

  /* an event has just happened on the timeline: the marker pulses for a moment */
  pulse(id) { const it = this.byId.get(id); if (it) it.pulse = performance.now() + 2600; }
  place(grid, Y, at) { for (const it of this.items) { const [u, v] = toUV(...(at?.(it.e.id) || it.e.p)); it.u = u; it.v = v; it.y = groundY(grid, Y, u, v) + 0.25; } }
  setVisible(b) { this.visible = b; this.root.hidden = !b; }

  /* chapter: [from, to] of the timeline chapter. Every event of the chapter appears on the map;
     "now" lasts for a window proportional to the chapter length (150 years in deep time, 2 years at the court) */
  state(e) {
    const end = e.y2 ?? e.y, [c0, c1] = this.chapter || [-Infinity, Infinity], tol = Math.max(2, (c1 - c0) / 60);
    if (this.year < e.y) return 'future';
    if (this.year <= end + tol) return 'active';
    if (this.year <= end + tol * 4) return 'recent';
    return 'past';
  }
  inChapter(e) { if (!this.chapter) return true; const [c0, c1] = this.chapter; return e.y <= c1 && (e.y2 ?? e.y) >= c0 && !(e.y === c1 && c1 !== this.lastYear); }

  /* project(u, y, v) → [x, y] on screen, or null if the point is not visible (the far side of the globe) */
  update(project, w, h) {
    if (!this.visible) return;
    const nb = this.sel ? this.graph.neighbors(this.sel) : null;
    this.boxes = [];
    for (const it of this.items) {
      const e = it.e, st = this.state(e), isSel = e.id === this.sel, isNb = !!nb?.has(e.id);
      const pulsing = it.pulse > performance.now();
      let on = isSel || isNb || (this.inChapter(e) && !this.hidden.has(e.k));
      if (on) {
        const r = project(it.u, it.y, it.v);
        if (!r) on = false;
        else { it.x = r[0]; it.sy = r[1]; if (it.x < -200 || it.x > w + 200 || it.sy < -200 || it.sy > h + 200) on = isSel || isNb; }
      }
      const label = isSel || isNb || this.hover === e.id || (!this.sel && st === 'active');
      const cls = ['ev', st, st !== 'future' && !this.hidden.has(e.k) && 'pc', isSel && 'sel', isNb && 'nb', this.sel && !isSel && !isNb && 'dim', label && 'lab', pulsing && 'pulse', isSel && this.lift && 'lift'].filter(Boolean).join(' ');
      if (cls !== it.cls) { it.el.className = cls; it.cls = cls; }
      if (on !== it.on) { it.el.style.display = on ? '' : 'none'; it.on = on; }
      if (on) { it.el.style.transform = `translate(${it.x}px, ${it.sy}px)`; this.boxes.push(label ? [it.x - 9, it.sy - 13, it.x + 22 + e.t.length * 7, it.sy + 9] : [it.x - 9, it.sy - 9, it.x + 9, it.sy + 9]); }
    }
    for (const a of this.arcs) {
      const A = this.byId.get(a.l.from), B = this.byId.get(a.l.to);
      let kind = null;
      if (this.sel) { if (a.l.from === this.sel) kind = 'out'; else if (a.l.to === this.sel) kind = 'in'; }
      else if (A.on && B.on && (A.cls.includes('active') || B.cls.includes('active'))) kind = 'faint';
      const show = !!kind && A.on && B.on;
      if (show !== a.shown) { a.g.style.display = show ? '' : 'none'; a.shown = show; }
      if (!show) continue;
      const x0 = A.x, y0 = A.sy, x1 = B.x, y1 = B.sy, d = Math.hypot(x1 - x0, y1 - y0), lift = Math.min(220, d * 0.3) + 12;
      const path = `M${x0.toFixed(1)},${y0.toFixed(1)} Q${((x0 + x1) / 2).toFixed(1)},${((y0 + y1) / 2 - lift).toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
      a.halo.setAttribute('d', path); a.line.setAttribute('d', path);
      const cls = `arc ${kind}${a.l.debated ? ' deb' : ''}`;
      if (a.g.getAttribute('class') !== cls) { a.g.setAttribute('class', cls); a.line.setAttribute('marker-end', `url(#a-${kind})`); }
    }
  }
}
