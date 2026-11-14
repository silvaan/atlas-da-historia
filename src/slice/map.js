// Vector world map of the chosen year (2D canvas, Equal Earth projection).
import { project, unproject, WORLD } from './proj.js';
import { POWERS, NAME_EN, powerOf } from './powers.js';
import { ctx2d } from './canvas.js';
import { hexA } from './theme.js';

export const SLICES = [1400, 1492, 1530, 1600, 1650, 1700, 1715, 1783, 1800, 1815, 1880, 1900];
export const sliceFor = y => SLICES.reduce((b, s) => Math.abs(s - y) < Math.abs(b - y) ? s : b, SLICES[0]);
const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };

function ringsToPath(rings) {
  const path = new Path2D(), proj = [];
  let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
  for (const r of rings) {
    const p = new Float32Array(r.length);
    for (let i = 0; i < r.length; i += 2) {
      const [x, y] = project(r[i], r[i + 1]); p[i] = x; p[i + 1] = y;
      if (i) path.lineTo(x, y); else path.moveTo(x, y);
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    path.closePath(); proj.push(p);
  }
  return { path, proj, box: [x0, y0, x1, y1] };
}
const inRings = (proj, x, y) => {
  let c = false;
  for (const p of proj) for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2)
    if ((p[i + 1] > y) !== (p[j + 1] > y) && x < (p[j] - p[i]) * (y - p[i + 1]) / (p[j + 1] - p[i + 1]) + p[i]) c = !c;
  return c;
};

export class MapView {
  constructor(canvas, cb) {
    this.cv = canvas; this.ctx = ctx2d(canvas); this.cb = cb;
    this.k = 200; this.tx = 0; this.ty = 0; this.slices = new Map(); this.cur = null; this.prev = null; this.fade = 1;
    this.events = []; this.links = []; this.sel = null; this.hover = null; this.today = false; this.theme = null; this.ms = 0;
    this.trail = null; this.stop = -1;
    /* dirty: the base map must be redrawn (theme, selection, year). over: only the top layer (dots, titles, cursor). */
    this.dirty = true; this.over = true; this.layer = document.createElement('canvas'); this.lctx = ctx2d(this.layer);
    this.old = document.createElement('canvas'); this.octx = ctx2d(this.old); this.base = { k: 0, tx: 0, ty: 0, t: 0 }; this.taken = [];
    this.sphere = new Path2D();
    for (let la = -90; la <= 90; la += 3) { const [x, y] = project(-180, la); la === -90 ? this.sphere.moveTo(x, y) : this.sphere.lineTo(x, y); }
    for (let la = 90; la >= -90; la -= 3) { const [x, y] = project(180, la); this.sphere.lineTo(x, y); }
    this.sphere.closePath();
    this.grat = new Path2D();
    for (let lo = -150; lo <= 150; lo += 30) for (let la = -90; la <= 90; la += 3) { const [x, y] = project(lo, la); la === -90 ? this.grat.moveTo(x, y) : this.grat.lineTo(x, y); }
    for (let la = -60; la <= 60; la += 30) { const a = project(-180, la), b = project(180, la); this.grat.moveTo(a[0], a[1]); this.grat.lineTo(b[0], b[1]); }
    this.bind();
  }
  setBase(base) {
    this.land = ringsToPath(base.land).path;
    this.lines = new Path2D();
    for (const l of base.lines) for (let i = 0; i < l.length; i += 2) {
      if (i && Math.abs(l[i] - l[i - 2]) > 180) { const [x, y] = project(l[i], l[i + 1]); this.lines.moveTo(x, y); continue; }
      const [x, y] = project(l[i], l[i + 1]); i ? this.lines.lineTo(x, y) : this.lines.moveTo(x, y);
    }
    this.dirty = true;
  }
  addSlice(data) {
    const feats = data.f.map(([name, subj, prec, region, area, lon, lat, inner, rings], i) => {
      const g = ringsToPath(rings), power = powerOf(name, subj, data.y), [cx, cy] = project(lon, lat);
      return { i, name, label: NAME_EN[name] || name, subj, power, prec, region: region || null, area, lon, lat, cx, cy, inner: inner * Math.PI / 180, tint: hash(name) % 4, ...g };
    });
    this.slices.set(data.y, { y: data.y, feats, labels: [...feats].sort((a, b) => (b.power ? 1e4 : 0) + b.area - (a.power ? 1e4 : 0) - a.area) });
  }
  setSlice(y) {
    const s = this.slices.get(y); if (!s || s === this.cur) return;
    /* switching maps is a cross-fade between two finished images: keep the current one and draw the new one only once */
    if (this.cur && this.base.k) { this.octx.setTransform(1, 0, 0, 1, 0, 0); this.octx.drawImage(this.layer, 0, 0); this.fade = 0; this.fadeT = performance.now(); }
    this.cur = s; this.dirty = true;
  }
  resize() {
    const r = this.cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2), first = !this.W;
    this.W = r.width; this.H = r.height; this.dpr = d;
    this.cv.width = Math.round(r.width * d); this.cv.height = Math.round(r.height * d);
    for (const c of [this.layer, this.old]) { c.width = this.cv.width; c.height = this.cv.height; }
    this.fade = 1;
    this.kMin = Math.max(this.W / WORLD.w, this.H / WORLD.h * 0.84);
    if (first) { this.k = this.kMin; this.tx = this.W / 2; this.ty = this.H / 2 + project(0, 14)[1] * -this.k; }
    this.clamp(); this.dirty = true;
  }
  clamp() {
    this.k = Math.min(Math.max(this.k, this.kMin), this.kMin * 60);
    const w = WORLD.w * this.k / 2, h = WORLD.h * this.k / 2;
    this.tx = w * 2 <= this.W ? this.W / 2 : Math.min(Math.max(this.tx, this.W - w), w);
    this.ty = h * 2 <= this.H ? this.H / 2 : Math.min(Math.max(this.ty, this.H - h), h);
  }
  toScreen(lon, lat) { const [x, y] = project(lon, lat); return [x * this.k + this.tx, y * this.k + this.ty]; }
  flyTo(lon, lat, k) {
    const [x, y] = project(lon, lat), k1 = Math.min(Math.max(k || this.k, this.kMin), this.kMin * 60);
    const cx0 = (this.W / 2 - this.tx) / this.k, cy0 = (this.H / 2 - this.ty) / this.k;
    /* if the start and the end don't fit together at the lower zoom, the camera rises halfway */
    const kFit = 0.8 * Math.min(this.W / Math.max(Math.abs(x - cx0), 1e-4), this.H / Math.max(Math.abs(y - cy0), 1e-4)), kLow = Math.min(this.k, k1);
    const dip = kFit < kLow ? Math.max(kFit, this.kMin) / kLow : 1;
    this.anim = { t: performance.now(), k0: this.k, k1, cx0, cy0, cx1: x, cy1: y, dip, dur: dip < 1 ? 1100 : 650 };
  }
  /* frame a list of places [lon, lat], with some margin */
  fit(points) {
    let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
    for (const p of points) { const [x, y] = project(p[0], p[1]); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const k = Math.min(this.kMin * 4.5, 0.58 * Math.min(this.W / Math.max(x1 - x0, 0.05), this.H / Math.max(y1 - y0, 0.05)));
    const [lon, lat] = unproject((x0 + x1) / 2, (y0 + y1) / 2); this.flyTo(lon, lat, Math.max(this.kMin, k));
  }
  /* zoom that makes the territory about 40% of the map's height */
  zoomFor(f) { return Math.min(this.kMin * 9, Math.max(this.kMin * 1.6, 0.4 * Math.min(this.W / (f.box[2] - f.box[0]), this.H / (f.box[3] - f.box[1])))); }

  bind() {
    const cv = this.cv; let drag = null;
    cv.addEventListener('wheel', e => {
      e.preventDefault(); this.anim = null;
      const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, k0 = this.k;
      this.k = Math.min(Math.max(this.k * Math.exp(-e.deltaY * (e.deltaMode ? 0.05 : 0.0016)), this.kMin), this.kMin * 60);
      this.tx = mx - (mx - this.tx) * this.k / k0; this.ty = my - (my - this.ty) * this.k / k0; this.clamp();
    }, { passive: false });
    cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY, tx: this.tx, ty: this.ty, moved: false }; this.anim = null; });
    cv.addEventListener('pointermove', e => {
      const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
      if (drag) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
        if (drag.moved) { this.tx = drag.tx + dx; this.ty = drag.ty + dy; this.clamp(); cv.style.cursor = 'grabbing'; }
        return;
      }
      const h = this.pick(mx, my);
      const hk = h => h ? (h.stop != null ? 's' + h.stop : h.ev ? h.ev.id : 'f' + h.f.i) : '';
      if (hk(h) !== hk(this.hover)) { this.hover = h; this.over = true; }
      cv.style.cursor = h ? 'pointer' : 'grab';
      this.cb.hover(h, e.clientX, e.clientY);
    });
    cv.addEventListener('pointerup', e => {
      const r = cv.getBoundingClientRect(), d = drag; drag = null; cv.style.cursor = 'grab';
      if (d && !d.moved) this.cb.click(this.pick(e.clientX - r.left, e.clientY - r.top), unproject((e.clientX - r.left - this.tx) / this.k, (e.clientY - r.top - this.ty) / this.k));
    });
    cv.addEventListener('pointerleave', () => { if (this.hover) { this.hover = null; this.over = true; } this.cb.hover(null); });
    cv.addEventListener('dblclick', e => {
      const r = cv.getBoundingClientRect(), [lon, lat] = unproject((e.clientX - r.left - this.tx) / this.k, (e.clientY - r.top - this.ty) / this.k);
      if (!Number.isNaN(lat)) this.flyTo(lon, lat, this.k * 2.2);
    });
  }
  pick(mx, my) {
    if (this.trail) for (const e of this.edges || []) if (e && mx >= e.x && mx <= e.x + e.w && my >= e.y && my <= e.y + e.h) return { stop: e.stop, cluster: { stops: [e.stop] } };
    if (this.trail) for (const c of this.clusters || []) if ((c.x - mx) ** 2 + (c.y - my) ** 2 < 150) return { stop: c.stops.includes(this.stop) ? this.stop : c.stops[0], cluster: c };
    for (const ev of this.events) { const [x, y] = this.toScreen(ev.p[0], ev.p[1]); if ((x - mx) ** 2 + (y - my) ** 2 < 81) return { ev }; }
    if (!this.cur) return null;
    const x = (mx - this.tx) / this.k, y = (my - this.ty) / this.k, fs = this.cur.feats;
    for (let i = fs.length - 1; i >= 0; i--) {                    // the smaller ones sit on top
      const f = fs[i], b = f.box;
      if (x < b[0] || x > b[2] || y < b[1] || y > b[3]) continue;
      if (inRings(f.proj, x, y)) return { f };
    }
    return null;
  }

  frame(now) {
    if (this.anim) {
      const a = this.anim, u = Math.min(1, (now - a.t) / (a.dur || 650)), e = u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2;
      this.k = a.k0 * (a.k1 / a.k0) ** e * (a.dip || 1) ** Math.sin(Math.PI * e);
      const cx = a.cx0 + (a.cx1 - a.cx0) * e, cy = a.cy0 + (a.cy1 - a.cy0) * e;
      this.tx = this.W / 2 - cx * this.k; this.ty = this.H / 2 - cy * this.k; this.clamp();
      if (u >= 1) this.anim = null;
    }
    if (!this.theme || !this.W) return;
    const b = this.base, moved = b.k !== this.k || b.tx !== this.tx || b.ty !== this.ty, l = this.lastT || (this.lastT = {});
    const still = l.k === this.k && l.tx === this.tx && l.ty === this.ty; l.k = this.k; l.tx = this.tx; l.ty = this.ty;
    if (moved && this.fade < 1) this.fade = 1;                    // the old image doesn't follow the movement
    const fading = this.fade < 1; if (fading) this.fade = Math.min(1, (now - this.fadeT) / 320);
    /* while moving, the base map is redrawn at most every 70 ms; in between, the finished image is just shifted */
    const repaint = this.dirty || (moved && (still || now - b.t > 70));
    if (!repaint && !moved && !fading && !this.over && !this.pulse) return;
    const t0 = performance.now();
    if (repaint) { this.paintBase(); b.k = this.k; b.tx = this.tx; b.ty = this.ty; b.t = now; this.dirty = false; }
    this.over = false; this.compose(now); this.ms = performance.now() - t0;
  }

  drawSlice(ctx, s) {
    const alpha = 1, { theme: T, k } = this, vx0 = -this.tx / k, vy0 = -this.ty / k, vx1 = (this.W - this.tx) / k, vy1 = (this.H - this.ty) / k;
    const selP = this.sel?.power, selR = this.sel?.region, dimming = !!(selP || selR);
    const vis = s.feats.filter(f => f.box[2] >= vx0 && f.box[0] <= vx1 && f.box[3] >= vy0 && f.box[1] <= vy1);
    for (const f of vis) {
      const on = !dimming || (selP ? f.power === selP : f.region === selR);
      ctx.globalAlpha = alpha * (on ? 1 : T.dim);
      ctx.fillStyle = f.power ? hexA(POWERS[f.power][1], T.mapAlpha) : T.tints[f.tint];
      ctx.fill(f.path, 'evenodd');
    }
    ctx.lineJoin = 'round';
    for (const f of vis) {
      const on = !dimming || (selP ? f.power === selP : f.region === selR);
      ctx.globalAlpha = alpha * (on ? 1 : T.dim) * (f.power ? 1 : 0.7);
      ctx.lineWidth = (f.power ? 0.9 : 0.55) / k; ctx.strokeStyle = T.border;
      ctx.stroke(f.path);
    }
    if (selP) {
      ctx.globalAlpha = alpha; ctx.lineWidth = 2 / k; ctx.strokeStyle = T.ink;
      for (const f of vis) if (f.power === selP) ctx.stroke(f.path);
    }
    ctx.globalAlpha = 1;
    return vis;
  }

  /* trail: numbered stops joined in order; stops at the same place become a single marker */
  drawTrail(ctx, now) {
    const { theme: T } = this, stops = this.trail.stops, cur = this.stop, clusters = []; this.edges = [];
    for (const s of stops) {
      const [x, y] = this.toScreen(s.p[0], s.p[1]);
      const c = clusters.find(c => (c.x - x) ** 2 + (c.y - y) ** 2 < 196);
      if (c) c.stops.push(s.i); else clusters.push({ x, y, stops: [s.i], place: s.place });
      s.c = c || clusters[clusters.length - 1];
    }
    this.clusters = clusters;
    /* the path: thin and light overall; bold on the leg into the current stop; dashed to the next one */
    const seg = (a, b) => { const dx = b.x - a.x, dy = b.y - a.y; ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo((a.x + b.x) / 2 + dy * 0.12, (a.y + b.y) / 2 - dx * 0.12, b.x, b.y); };
    ctx.lineCap = 'round';
    ctx.beginPath(); for (let i = 1; i < stops.length; i++) { const a = stops[i - 1].c, b = stops[i].c; if (a !== b) seg(a, b); }
    ctx.setLineDash([2, 5]); ctx.lineWidth = 1.3; ctx.strokeStyle = hexA(T.ink, 0.3); ctx.stroke(); ctx.setLineDash([]);
    const prev = stops[cur - 1], next = stops[cur + 1], here = stops[cur];
    if (prev && prev.c !== here.c) { ctx.beginPath(); seg(prev.c, here.c); ctx.lineWidth = 2.6; ctx.strokeStyle = T.accent; ctx.globalAlpha = 0.9; ctx.stroke(); ctx.globalAlpha = 1; }
    if (next && next.c !== here.c) { ctx.beginPath(); seg(here.c, next.c); ctx.setLineDash([6, 5]); ctx.lineWidth = 1.8; ctx.strokeStyle = T.accent; ctx.stroke(); ctx.setLineDash([]); }
    const hov = this.hover?.cluster, inView = c => c.x > 14 && c.x < this.W - 14 && c.y > 14 && c.y < this.H - 14;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const c of clusters) {
      if (!inView(c)) continue;
      const on = c.stops.includes(cur), seen = c.stops.some(i => i <= cur);
      const label = on ? String(cur + 1) : c.stops.slice(0, 3).map(i => i + 1).join('·') + (c.stops.length > 3 ? '…' : '');
      ctx.font = `700 ${on ? 13 : 11}px "JetBrains Mono", monospace`;
      const w = Math.max(on ? 26 : 20, ctx.measureText(label).width + 12), h = on ? 26 : 20;
      if (on) { const p = h / 2 + 5 + 4 * (0.5 + 0.5 * Math.sin(now / 320)); ctx.beginPath(); ctx.arc(c.x, c.y, p, 0, 6.3); ctx.lineWidth = 1.5; ctx.strokeStyle = T.accent; ctx.stroke(); }
      ctx.beginPath(); ctx.roundRect(c.x - w / 2, c.y - h / 2, w, h, h / 2);
      ctx.fillStyle = on ? T.accent : seen ? T.ink : T.panel; ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = on || seen ? T.panel : T.ink; ctx.stroke();
      if (c === hov && !on) { ctx.lineWidth = 2; ctx.strokeStyle = T.accent; ctx.stroke(); }
      ctx.fillStyle = on || seen ? T.panel : T.ink; ctx.fillText(label, c.x, c.y + 0.5);
      /* place name next to the other markers, so you know where you are */
      if (!on && c.place) {
        ctx.font = 'italic 11.5px "Atkinson Hyperlegible", sans-serif'; ctx.textAlign = 'left';
        ctx.lineWidth = 3; ctx.strokeStyle = T.halo; ctx.strokeText(c.place, c.x + w / 2 + 5, c.y);
        ctx.fillStyle = T.muted; ctx.fillText(c.place, c.x + w / 2 + 5, c.y); ctx.textAlign = 'center';
      }
    }
    /* previous or next stop off screen: an arrow at the edge, pointing at it */
    const boxes = [];
    for (const [o, txt] of [[next, 'next'], [prev, 'previous']]) {
      if (!o || o.c === here.c || inView(o.c)) continue;
      const dx = o.c.x - here.c.x, dy = o.c.y - here.c.y, m = 26;
      const tx = dx > 0 ? (this.W - m - here.c.x) / dx : dx < 0 ? (m - here.c.x) / dx : Infinity, ty = dy > 0 ? (this.H - m - here.c.y) / dy : dy < 0 ? (m - here.c.y) / dy : Infinity;
      const t = Math.max(0, Math.min(tx, ty)), x = here.c.x + dx * t, y = here.c.y + dy * t, ang = Math.atan2(dy, dx);
      const label = `${o.i + 1} · ${o.place || o.t}`;
      ctx.font = '700 12px "Atkinson Hyperlegible", sans-serif'; const lw = ctx.measureText(label).width + 30;
      const bx = Math.min(Math.max(x - lw / 2, 8), this.W - lw - 8); let by = Math.min(Math.max(y - 12, 64), this.H - 70);
      while (boxes.some(b => bx < b[0] + b[2] && bx + lw > b[0] && Math.abs(by - b[1]) < 28)) by -= 30;
      boxes.push([bx, by, lw]);
      ctx.fillStyle = txt === 'next' ? T.accent : T.panel; ctx.globalAlpha = 0.95; ctx.beginPath(); ctx.roundRect(bx, by, lw, 24, 12); ctx.fill(); ctx.globalAlpha = 1;
      ctx.lineWidth = 1; ctx.strokeStyle = txt === 'next' ? T.accent : T.line; ctx.stroke();
      const ax = bx + (Math.cos(ang) >= 0 ? lw - 13 : 13), ay = by + 12;
      ctx.save(); ctx.translate(ax, ay); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(5, 0); ctx.lineTo(-3, -4.5); ctx.lineTo(-3, 4.5); ctx.closePath();
      ctx.fillStyle = txt === 'next' ? '#fff' : T.ink; ctx.fill(); ctx.restore();
      ctx.fillStyle = txt === 'next' ? '#fff' : T.ink; ctx.textAlign = 'center';
      ctx.fillText(label, bx + lw / 2 + (Math.cos(ang) >= 0 ? -6 : 6), by + 12.5);
      (this.edges || (this.edges = []))[txt === 'next' ? 0 : 1] = { x: bx, y: by, w: lw, h: 24, stop: o.i };
    }
    /* place name and title of the current stop */
    const s = stops[cur];
    if (s) {
      const c = s.c, text = s.t, place = s.place || '';
      ctx.font = '700 13.5px "Atkinson Hyperlegible", sans-serif'; const tw = ctx.measureText(text).width;
      ctx.font = '11.5px "Atkinson Hyperlegible", sans-serif'; const pw = ctx.measureText(place).width;
      const bw = Math.max(tw, pw) + 18, bh = place ? 40 : 26, right = c.x + 22 + bw < this.W - 8;
      const bx = right ? c.x + 20 : c.x - 20 - bw, by = Math.min(Math.max(c.y - bh / 2, 8), this.H - bh - 8);
      ctx.fillStyle = T.panel; ctx.globalAlpha = 0.94; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 8); ctx.fill(); ctx.globalAlpha = 1;
      ctx.lineWidth = 1; ctx.strokeStyle = T.line; ctx.stroke();
      ctx.textAlign = 'left'; ctx.fillStyle = T.ink; ctx.font = '700 13.5px "Atkinson Hyperlegible", sans-serif'; ctx.fillText(text, bx + 9, by + (place ? 14 : 13));
      if (place) { ctx.font = '11.5px "Atkinson Hyperlegible", sans-serif'; ctx.fillStyle = T.muted; ctx.fillText(place, bx + 9, by + 29); }
    }
  }

  /* base map: sea, land, the year's territories and their names. It is kept as an image. */
  paintBase() {
    const ctx = this.lctx, { theme: T, k, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = T.bg; ctx.fillRect(0, 0, this.W, this.H);
    ctx.setTransform(dpr * k, 0, 0, dpr * k, dpr * this.tx, dpr * this.ty);
    ctx.fillStyle = T.ocean; ctx.fill(this.sphere);
    ctx.lineWidth = 0.6 / k; ctx.strokeStyle = T.grid; ctx.stroke(this.grat);
    if (this.land) { ctx.fillStyle = T.land; ctx.fill(this.land, 'evenodd'); }
    if (this.cur) this.drawSlice(ctx, this.cur);
    if (this.land) { ctx.lineWidth = 0.7 / k; ctx.strokeStyle = T.coast; ctx.stroke(this.land); }
    if (this.today && this.lines) { ctx.lineWidth = 1 / k; ctx.strokeStyle = T.today; ctx.setLineDash([3 / k, 3 / k]); ctx.stroke(this.lines); ctx.setLineDash([]); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const taken = this.taken = [], free = (x, y, w, h) => { for (const b of taken) if (x < b[0] + b[2] && x + w > b[0] && y < b[1] + b[3] && y + h > b[1]) return false; taken.push([x, y, w, h]); return true; };
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    const selP = this.sel?.power, selR = this.sel?.region;
    if (this.cur) for (const f of this.cur.labels) {
      const x = f.cx * k + this.tx, y = f.cy * k + this.ty; if (x < -40 || x > this.W + 40 || y < -10 || y > this.H + 10) continue;
      const r = f.inner * k; if (r < (f.power ? 7 : 11)) continue;
      const size = Math.max(10.5, Math.min(f.power ? 17 : 14, r * 0.4));
      ctx.font = f.power ? `${size}px "Young Serif", Georgia, serif` : `italic ${size}px "Atkinson Hyperlegible", sans-serif`;
      const w = ctx.measureText(f.label).width; if (w > r * (f.power ? 5.5 : 3.6) + 20) continue;
      if (!free(x - w / 2 - 3, y - size / 2 - 2, w + 6, size + 4)) continue;
      const on = !(selP || selR) || (selP ? f.power === selP : f.region === selR);
      ctx.globalAlpha = on ? (f.power ? 1 : 0.8) : 0.35;
      ctx.lineWidth = 2.6; ctx.strokeStyle = T.halo; ctx.strokeText(f.label, x, y);
      ctx.fillStyle = T.ink; ctx.fillText(f.label, x, y);
    }
    ctx.globalAlpha = 1;
  }

  /* frame: the base-map image (shifted, if the view changed since it was made) and, on top, cursor, links and events */
  compose(now) {
    const { ctx, theme: T, k, dpr } = this, b = this.base, s = k / b.k;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (s !== 1 || b.tx !== this.tx || b.ty !== this.ty) {
      ctx.fillStyle = T.bg; ctx.fillRect(0, 0, this.cv.width, this.cv.height);
      ctx.setTransform(s, 0, 0, s, (this.tx - b.tx * s) * dpr, (this.ty - b.ty * s) * dpr);
      ctx.drawImage(this.layer, 0, 0); ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else if (this.fade < 1) { ctx.drawImage(this.old, 0, 0); ctx.globalAlpha = this.fade; ctx.drawImage(this.layer, 0, 0); ctx.globalAlpha = 1; }
    else ctx.drawImage(this.layer, 0, 0);
    const hf = this.hover?.f;
    if (hf) { ctx.setTransform(dpr * k, 0, 0, dpr * k, dpr * this.tx, dpr * this.ty); ctx.lineJoin = 'round'; ctx.lineWidth = 1.8 / k; ctx.strokeStyle = T.accent; ctx.stroke(hf.path); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const taken = s === 1 ? this.taken.slice() : [], free = (x, y, w, h) => { for (const b of taken) if (x < b[0] + b[2] && x + w > b[0] && y < b[1] + b[3] && y + h > b[1]) return false; taken.push([x, y, w, h]); return true; };
    ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';

    /* links of the chosen event: arcs between the places */
    for (const l of this.links) {
      const a = this.toScreen(...l.a), b = this.toScreen(...l.b), dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
      if (d < 6) continue;
      const mx = (a[0] + b[0]) / 2 + dy * 0.18, my = (a[1] + b[1]) / 2 - Math.abs(dx) * 0.18 - 12;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(mx, my, b[0], b[1]);
      ctx.lineWidth = 2; ctx.strokeStyle = l.color; ctx.globalAlpha = 0.9; ctx.stroke();
      const ang = Math.atan2(b[1] - my, b[0] - mx);
      ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(b[0] - 9 * Math.cos(ang - 0.4), b[1] - 9 * Math.sin(ang - 0.4)); ctx.lineTo(b[0] - 9 * Math.cos(ang + 0.4), b[1] - 9 * Math.sin(ang + 0.4)); ctx.closePath();
      ctx.fillStyle = l.color; ctx.fill(); ctx.globalAlpha = 1;
    }
    /* events around the year: first the dots, then the titles (the chosen one claims its spot first) */
    ctx.font = '12.5px "Atkinson Hyperlegible", sans-serif'; ctx.textAlign = 'left';
    const tags = [];
    for (const ev of this.events) {
      const [x, y] = this.toScreen(ev.p[0], ev.p[1]); if (x < -20 || x > this.W + 20 || y < -20 || y > this.H + 20) continue;
      const sel = ev.id === this.sel?.event, hov = ev.id === this.hover?.ev?.id, r = sel ? 6.5 : ev.near || ev.linked ? 5 : 3.6;
      if (sel) { const p = 9 + 5 * (0.5 + 0.5 * Math.sin(now / 320)); ctx.beginPath(); ctx.arc(x, y, p, 0, 6.3); ctx.lineWidth = 1.5; ctx.strokeStyle = T.accent; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fillStyle = ev.color; ctx.globalAlpha = ev.near || ev.linked || sel ? 1 : 0.75; ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = T.panel; ctx.stroke(); ctx.globalAlpha = 1;
      if (sel || hov || ev.near || ev.linked) tags.push({ ev, x, y, pri: sel ? 0 : hov ? 1 : 2 });
    }
    tags.sort((a, b) => a.pri - b.pri);
    for (const { ev, x, y, pri } of tags) {
      const w = ctx.measureText(ev.t).width;
      /* try right, left, above and below the dot */
      const spots = [[x + 9, y], [x - 9 - w, y], [x - w / 2, y - 15], [x - w / 2, y + 15]];
      const at = spots.find(([lx, ly]) => lx > 2 && lx + w < this.W - 2 && free(lx - 2, ly - 9, w + 4, 18)) || (pri < 2 ? spots[0] : null);
      if (!at) continue;
      ctx.lineWidth = 3.5; ctx.strokeStyle = T.halo; ctx.strokeText(ev.t, at[0], at[1]);
      ctx.fillStyle = T.ink; ctx.fillText(ev.t, at[0], at[1]);
    }
    if (this.trail) this.drawTrail(ctx, now);
    this.pulse = !!this.sel?.event || !!this.trail;
  }
}
