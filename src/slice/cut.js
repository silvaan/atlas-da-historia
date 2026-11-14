// The time slice: time runs from left to right, each region is a row
// whose height is its share of the world population, and each state is a band inside the row.
import { REGIONS, REGION } from './regions.js';
import { T0, T1, popAt, worldAt, lerpKeys } from './pop.js';
import { POWERS, BANDS, FILLER } from './powers.js';
import { ctx2d } from './canvas.js';
import { hexA, inkOn } from './theme.js';

const GL = 216, GR = 14, TOP = 28, BOT = 8, MINH = 7, NY = T1 - T0 + 1;
const active = (b, y) => y >= b.from && (y < b.to || (b.to === T1 && y <= T1));

export class CutView {
  constructor(canvas, cb) {
    this.cv = canvas; this.ctx = ctx2d(canvas); this.cb = cb;
    this.t0 = T0; this.t1 = T1; this.year = 1500; this.focus = null; this.focusAmt = 0; this.focusShown = null;
    this.events = []; this.links = []; this.sel = null; this.hover = null; this.theme = null; this.relayout = true; this.ms = 0;
    this.trail = null; this.stop = -1;
    /* dirty: the whole slice must be redrawn. now: only the year line and the percentages, on top of the finished image. */
    this.dirty = true; this.now = true; this.layer = document.createElement('canvas'); this.lctx = ctx2d(this.layer);
    this.rowTop = REGIONS.map(() => new Float32Array(NY)); this.rowBot = REGIONS.map(() => new Float32Array(NY));
    this.bTop = BANDS.map(() => new Float32Array(NY)); this.bBot = BANDS.map(() => new Float32Array(NY));
    this.byRegion = REGIONS.map(r => BANDS.filter(b => b.r === r.id));
    /* consecutive bands of the same power in the same row alternate their shade */
    for (const list of this.byRegion) list.forEach((b, i) => { b.alt = i && list[i - 1].p === b.p ? !list[i - 1].alt : false; });
    for (const b of BANDS) b.solo = BANDS.filter(o => o.r === b.r && o.p === b.p).length === 1;
    this.bind();
  }
  resize() {
    const r = this.cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    this.W = r.width; this.H = r.height; this.dpr = d; this.cv.width = Math.round(r.width * d); this.cv.height = Math.round(r.height * d);
    this.layer.width = this.cv.width; this.layer.height = this.cv.height;
    this.PW = this.W - GL - GR; this.PH = this.H - TOP - BOT; this.relayout = this.dirty = true;
  }
  x(t) { return GL + (t - this.t0) / (this.t1 - this.t0) * this.PW; }
  t(x) { return this.t0 + (x - GL) / this.PW * (this.t1 - this.t0); }
  setYear(y) { this.year = y; this.now = true; }
  setFocus(id) { this.focus = id; if (id) this.focusShown = id; this.dirty = true; }
  setView(t0, t1) {
    let span = Math.min(T1 - T0, Math.max(30, t1 - t0)); t0 = Math.min(Math.max(t0, T0), T1 - span);
    this.t0 = t0; this.t1 = t0 + span; this.relayoutEvents = this.dirty = true;
  }
  /* bring the year into view, without changing the zoom, if it is off screen */
  reveal(y) { const s = this.t1 - this.t0; if (y < this.t0 + s * 0.04 || y > this.t1 - s * 0.04) this.setView(y - s / 2, y + s / 2); }

  layout() {
    const f = this.focusAmt, F = this.focusShown, pool = this.PH - REGIONS.length * MINH;
    for (let i = 0; i < NY; i++) {
      const y = T0 + i, world = worldAt(y); let cur = TOP;
      REGIONS.forEach((r, ri) => {
        const P = popAt(r.id, y);
        let h = MINH + P / world * pool;
        h = h * (1 - 0.62 * f) + (r.id === F ? 0.62 * f * this.PH : 0);
        this.rowTop[ri][i] = cur; this.rowBot[ri][i] = cur + h;
        const list = this.byRegion[ri]; let S = 0;
        for (const b of list) { b.w = active(b, y) ? lerpKeys(b.k, y) : 0; S += b.w; }
        const sc = (S > P ? P / S : 1) / P * (h - 1);
        let c = cur;
        for (const b of list) { this.bTop[b.i][i] = c; c += b.w * sc; this.bBot[b.i][i] = c; }
        cur += h;
      });
    }
    this.relayout = false; this.relayoutEvents = true;
  }
  /* event positions: inside the region's row, staggered so they don't overlap */
  placeEvents() {
    const last = REGIONS.map(() => []);
    for (const ev of this.events) {
      const ri = REGION[ev.region].i, yy = Math.min(T1, Math.max(T0, ev.y)), i = yy - T0;
      const top = this.rowTop[ri][i], h = this.rowBot[ri][i] - top, n = Math.max(1, Math.min(7, Math.floor(h / 10))), x = this.x(yy), slots = last[ri];
      let s = 0, best = Infinity;
      for (let q = 0; q < n; q++) { const lx = slots[q] ?? -1e9; if (x - lx > 13) { s = q; best = -1; break; } if (lx < best) { best = lx; s = q; } }
      slots[s] = x; ev.cx = x; ev.cy = top + (s + 0.5) / n * h; ev.x2 = ev.y2 ? this.x(Math.min(T1, ev.y2)) : x;
    }
    this.relayoutEvents = false;
  }

  hit(mx, my) {
    if (this.trail) for (const s of this.trail.stops) if (s.cx != null && (s.cx - mx) ** 2 + (s.cy - my) ** 2 < 110) return { stop: s.i };
    if (mx < GL) { const ri = this.rowAt(Math.round(this.t0) - T0, my); return ri >= 0 ? { region: REGIONS[ri].id, gutter: true } : null; }
    if (my < TOP) return { ruler: true };
    let be = null, bd = 90;
    for (const ev of this.events) { const d = (ev.cx - mx) ** 2 + (ev.cy - my) ** 2; if (d < bd) { bd = d; be = ev; } }
    if (be) return { ev: be };
    const y = Math.round(this.t(mx)), i = Math.min(NY - 1, Math.max(0, y - T0)), ri = this.rowAt(i, my);
    if (ri < 0) return null;
    for (const b of this.byRegion[ri]) if (active(b, y) && my >= this.bTop[b.i][i] && my < this.bBot[b.i][i]) return { band: b, region: b.r, year: y };
    return { region: REGIONS[ri].id, year: y };
  }
  rowAt(i, my) { for (let r = 0; r < REGIONS.length; r++) if (my >= this.rowTop[r][i] && my < this.rowBot[r][i]) return r; return -1; }

  bind() {
    const cv = this.cv; let drag = null;
    const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener('wheel', e => {
      e.preventDefault();
      const [mx] = pos(e), span = this.t1 - this.t0;
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) { const d = (e.deltaX || e.deltaY) * span / this.PW; this.setView(this.t0 + d, this.t1 + d); return; }
      const tc = this.t(Math.max(GL, mx)), ns = Math.min(T1 - T0, Math.max(30, span * Math.exp(e.deltaY * (e.deltaMode ? 0.05 : 0.0016))));
      const a = (tc - this.t0) / span; this.setView(tc - a * ns, tc - a * ns + ns);
    }, { passive: false });
    cv.addEventListener('pointerdown', e => {
      const [mx, my] = pos(e); cv.setPointerCapture(e.pointerId);
      drag = { mx, my, moved: false, mode: mx < GL ? 'gutter' : my < TOP ? 'pan' : 'scrub', t0: this.t0, t1: this.t1 };
      if (drag.mode === 'scrub' && !this.hit(mx, my)?.ev && this.hit(mx, my)?.stop == null) this.cb.year(Math.round(Math.min(T1, Math.max(T0, this.t(mx)))));
    });
    cv.addEventListener('pointermove', e => {
      const [mx, my] = pos(e);
      if (drag) {
        if (Math.abs(mx - drag.mx) + Math.abs(my - drag.my) > 3) drag.moved = true;
        if (drag.mode === 'scrub' && drag.moved) this.cb.year(Math.round(Math.min(T1, Math.max(T0, this.t(mx)))));
        if (drag.mode === 'pan') { const d = (drag.mx - mx) * (drag.t1 - drag.t0) / this.PW; this.setView(drag.t0 + d, drag.t1 + d); }
        return;
      }
      const h = this.hit(mx, my), key = h => h ? (h.stop != null ? 's' + h.stop : h.ev?.id ?? (h.band ? 'b' + h.band.i : h.ruler ? 'ruler' : 'r' + h.region + (h.gutter ? 'g' : ''))) : '';
      if (key(h) !== key(this.hover)) { this.hover = h; this.dirty = true; }
      cv.style.cursor = h?.ev || h?.gutter || h?.stop != null ? 'pointer' : h?.ruler ? (this.t1 - this.t0 < T1 - T0 ? 'ew-resize' : 'default') : 'col-resize';
      this.cb.hover(h, e.clientX, e.clientY);
    });
    cv.addEventListener('pointerup', e => {
      const [mx, my] = pos(e), d = drag; drag = null;
      if (d && !d.moved) this.cb.click(this.hit(mx, my));
    });
    cv.addEventListener('pointerleave', () => { if (this.hover) { this.hover = null; this.dirty = true; } this.cb.hover(null); });
    cv.addEventListener('dblclick', e => { const [mx, my] = pos(e), h = this.hit(mx, my); if (h?.region && mx >= GL) this.cb.focus(h.region); });
  }

  frame() {
    const target = this.focus ? 1 : 0;
    if (Math.abs(this.focusAmt - target) > 0.002) { this.focusAmt += (target - this.focusAmt) * 0.22; this.relayout = this.dirty = true; }
    else if (this.focusAmt !== target) { this.focusAmt = target; this.relayout = this.dirty = true; }
    if ((!this.dirty && !this.now) || !this.theme || !this.W) return;
    const t0 = performance.now();
    if (this.dirty) {
      if (this.relayout) this.layout();
      if (this.relayoutEvents) this.placeEvents();
      this.draw(this.lctx);
    }
    this.dirty = this.now = false;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); this.ctx.drawImage(this.layer, 0, 0); this.drawNow(this.ctx);
    this.ms = performance.now() - t0;
  }

  draw(ctx) {
    const { theme: T, dpr } = this, i0 = Math.max(0, Math.floor(this.t0) - T0), i1 = Math.min(NY - 1, Math.ceil(this.t1) - T0);
    const X = i => this.x(T0 + i), selP = this.sel?.power, hovB = this.hover?.band;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = T.bg; ctx.fillRect(0, 0, this.W, this.H);
    ctx.save(); ctx.beginPath(); ctx.rect(GL, TOP, this.PW, this.PH); ctx.clip();

    /* rows: the background is "the rest" of the region */
    REGIONS.forEach((r, ri) => {
      ctx.beginPath(); ctx.moveTo(X(i0), this.rowTop[ri][i0]);
      for (let i = i0 + 1; i <= i1; i++) ctx.lineTo(X(i), this.rowTop[ri][i]);
      for (let i = i1; i >= i0; i--) ctx.lineTo(X(i), this.rowBot[ri][i]);
      ctx.closePath(); ctx.fillStyle = ri % 2 ? T.rowB : T.rowA; ctx.fill();
    });
    /* bands */
    for (const b of BANDS) {
      const a = Math.max(i0, b.from - T0), last = b.to === T1 ? T1 - T0 : b.to - 1 - T0, z = Math.min(i1, last);
      if (z < a) continue;
      const top = this.bTop[b.i], bot = this.bBot[b.i], tail = last < NY - 1 && z === last;
      ctx.beginPath(); ctx.moveTo(X(a), top[a]);
      for (let i = a + 1; i <= z; i++) ctx.lineTo(X(i), top[i]);
      if (tail) { ctx.lineTo(X(z + 1), top[z]); ctx.lineTo(X(z + 1), bot[z]); }
      for (let i = z; i >= a; i--) ctx.lineTo(X(i), bot[i]);
      ctx.closePath();
      const col = POWERS[b.p][1];
      ctx.globalAlpha = (selP && selP !== b.p ? 0.22 : 1) * (b.alt ? 0.78 : 1);
      ctx.fillStyle = col; ctx.fill();
      ctx.globalAlpha = selP && selP !== b.p ? 0.25 : 1;
      ctx.lineWidth = 1; ctx.strokeStyle = hexA(T.bg, 0.55); ctx.stroke();
      if (hovB === b) { ctx.lineWidth = 2; ctx.strokeStyle = T.ink; ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
    /* century lines and row separators */
    const step = this.tickStep();
    ctx.lineWidth = 1; ctx.strokeStyle = T.grid; ctx.beginPath();
    for (let y = Math.ceil(this.t0 / step) * step; y <= this.t1; y += step) { const x = Math.round(this.x(y)) + 0.5; ctx.moveTo(x, TOP); ctx.lineTo(x, TOP + this.PH); }
    ctx.stroke();
    ctx.strokeStyle = hexA(T.ink, 0.5); ctx.lineWidth = 1;
    for (let ri = 1; ri < REGIONS.length; ri++) { ctx.beginPath(); ctx.moveTo(X(i0), this.rowTop[ri][i0]); for (let i = i0 + 1; i <= i1; i++) ctx.lineTo(X(i), this.rowTop[ri][i]); ctx.stroke(); }

    /* band labels: on the longest visible stretch where the band is tall enough for the text */
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    const used = [];
    for (const b of BANDS) {
      if (selP && selP !== b.p) continue;
      const a = Math.max(i0, b.from - T0), z = Math.min(i1, b.to === T1 ? T1 - T0 : b.to - 1 - T0); if (z < a) continue;
      const top = this.bTop[b.i], bot = this.bBot[b.i];
      let rs = -1, bs = -1, bl = 0;
      for (let i = a; i <= z + 1; i++) {
        const ok = i <= z && bot[i] - top[i] >= 11;
        if (ok && rs < 0) rs = i;
        if (!ok && rs >= 0) { if (i - rs > bl) { bl = i - rs; bs = rs; } rs = -1; }
      }
      if (bs < 0) continue;
      const xa = Math.max(X(bs), GL) + 6, room = X(bs + bl - 1) - xa - 4; let maxH = 0;
      for (let i = bs; i < bs + bl; i++) maxH = Math.max(maxH, bot[i] - top[i]);
      const size = maxH > 30 ? 13.5 : 11.5; ctx.font = `${size}px "Atkinson Hyperlegible", sans-serif`;
      let text = b.n; if (ctx.measureText(text).width > room) { if (!b.solo) continue; text = POWERS[b.p][0]; }
      const tw = ctx.measureText(text).width; if (tw > room) continue;
      /* slide to where the band is tallest, if it fits */
      let li = bs; for (let i = bs; i < bs + bl; i++) if (bot[i] - top[i] > bot[li] - top[li] + 4 && X(i) + tw + 10 < X(bs + bl - 1)) li = i;
      const lx = Math.max(Math.max(X(li), GL) + 6, xa), im = Math.min(z, Math.max(a, Math.round(this.t(lx + tw / 2)) - T0));
      let h = Infinity; for (const i of [Math.max(a, Math.round(this.t(lx)) - T0), im, Math.min(z, Math.round(this.t(lx + tw)) - T0)]) h = Math.min(h, bot[i] - top[i]);
      const cy = (top[im] + bot[im]) / 2;
      if (h < 10.5 || used.some(u => lx < u[0] + u[2] + 8 && lx + tw + 8 > u[0] && Math.abs(cy - u[1]) < 12)) continue;
      used.push([lx, cy, tw]);
      ctx.fillStyle = inkOn(POWERS[b.p][1]); ctx.globalAlpha = 0.95; ctx.fillText(text, lx, (top[im] + bot[im]) / 2 + 0.5); ctx.globalAlpha = 1;
    }
    /* label for the rest of the region, when there is room below the bands */
    ctx.font = 'italic 11.5px "Atkinson Hyperlegible", sans-serif'; ctx.fillStyle = T.muted;
    REGIONS.forEach((r, ri) => {
      const text = FILLER[r.id]; if (!text || selP) return;
      const tw = ctx.measureText(text).width, list = this.byRegion[ri];
      for (let i = i0; i <= i1; i += 4) {
        const fy = list.length ? Math.max(...list.map(b => this.bBot[b.i][i])) : this.rowTop[ri][i];
        if (this.rowBot[ri][i] - fy < 13 || X(i) + tw + 12 > this.W - GR) continue;
        const j = Math.min(i1, Math.round(this.t(X(i) + tw + 8)) - T0), fy2 = Math.max(...list.map(b => this.bBot[b.i][j]));
        if (this.rowBot[ri][j] - fy2 < 13) continue;
        ctx.fillText(text, X(i) + 6, (Math.max(fy, fy2) + Math.min(this.rowBot[ri][i], this.rowBot[ri][j])) / 2); break;
      }
    });

    /* links between events */
    const selE = this.sel?.event, hovE = this.hover?.ev?.id;
    const curve = (a, b) => { const dx = Math.max(18, (b.cx - a.cx) * 0.5); ctx.beginPath(); ctx.moveTo(a.cx, a.cy); ctx.bezierCurveTo(a.cx + dx, a.cy, b.cx - dx, b.cy, b.cx, b.cy); ctx.stroke(); };
    ctx.lineWidth = 1; ctx.strokeStyle = hexA(T.ink, selE ? 0.07 : 0.16);
    for (const l of this.links) if (l.a.id !== selE && l.b.id !== selE && l.a.id !== hovE && l.b.id !== hovE) curve(l.a, l.b);
    for (const l of this.links) {
      const on = l.a.id === selE || l.b.id === selE, hv = l.a.id === hovE || l.b.id === hovE; if (!on && !hv) continue;
      const out = l.a.id === (on ? selE : hovE);
      ctx.lineWidth = on ? 4.5 : 3.5; ctx.strokeStyle = T.halo; curve(l.a, l.b);
      ctx.lineWidth = on ? 2.2 : 1.6; ctx.strokeStyle = out ? T.effect : T.cause; curve(l.a, l.b);
    }
    /* events */
    const linked = new Set(); for (const l of this.links) { if (l.a.id === selE) linked.add(l.b.id); if (l.b.id === selE) linked.add(l.a.id); }
    for (const ev of this.events) {
      const sel = ev.id === selE, hov = ev.id === hovE, lk = linked.has(ev.id);
      if (ev.x2 > ev.cx + 4) { ctx.lineWidth = sel ? 3 : 2; ctx.strokeStyle = hexA(ev.color, sel ? 0.95 : 0.6); ctx.beginPath(); ctx.moveTo(ev.cx, ev.cy); ctx.lineTo(ev.x2, ev.cy); ctx.stroke(); }
      const r = sel ? 6.5 : hov || lk ? 5 : 3.4;
      ctx.beginPath(); ctx.arc(ev.cx, ev.cy, r, 0, 6.3); ctx.fillStyle = ev.color; ctx.fill();
      ctx.lineWidth = sel ? 2.2 : 1.3; ctx.strokeStyle = sel ? T.ink : T.panel; ctx.stroke();
    }
    /* titles: the chosen one, those linked to it and the one under the cursor */
    ctx.font = '12px "Atkinson Hyperlegible", sans-serif';
    const taken = [];
    for (const ev of this.events) {
      const sel = ev.id === selE, hov = ev.id === hovE; if (!sel && !hov && !linked.has(ev.id)) continue;
      const tw = ctx.measureText(ev.t).width, right = ev.cx + 10 + tw < this.W - GR, lx = right ? ev.cx + 10 : ev.cx - 10 - tw, ly = ev.cy;
      if (!sel && !hov && taken.some(b => lx < b[0] + b[2] && lx + tw > b[0] && Math.abs(ly - b[1]) < 14)) continue;
      taken.push([lx, ly, tw]);
      ctx.fillStyle = T.halo; ctx.beginPath(); ctx.roundRect(lx - 4, ly - 9, tw + 8, 18, 4); ctx.fill();
      ctx.fillStyle = T.ink; ctx.fillText(ev.t, lx, ly + 0.5);
    }
    ctx.restore();

    /* ruler */
    ctx.font = '10.5px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.fillStyle = T.muted; ctx.textBaseline = 'middle';
    for (let y = Math.ceil(this.t0 / step) * step; y <= this.t1; y += step) { const x = this.x(y); if (x > GL + 12 && x < this.W - GR - 12) ctx.fillText(y, x, TOP - 12); }
    ctx.textAlign = 'left'; ctx.font = '10.5px "Atkinson Hyperlegible", sans-serif'; ctx.fillStyle = T.muted;
    ctx.fillText('click a region to open it', 10, TOP - 12);
  }

  /* on top of the finished image: the year line, the region names and each region's share in the chosen year */
  drawNow(ctx) {
    const { theme: T, dpr } = this, i0 = Math.max(0, Math.floor(this.t0) - T0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    const nx = Math.round(this.x(this.year)) + 0.5;
    if (nx >= GL - 1 && nx <= this.W - GR + 1) {
      ctx.strokeStyle = T.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(nx, TOP - 2); ctx.lineTo(nx, TOP + this.PH + 2); ctx.stroke();
      ctx.font = '700 12px "JetBrains Mono", monospace'; const tw = ctx.measureText(this.year).width + 14;
      ctx.fillStyle = T.accent; ctx.beginPath(); ctx.roundRect(Math.min(Math.max(nx - tw / 2, GL), this.W - GR - tw), 3, tw, 20, 5); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillText(this.year, Math.min(Math.max(nx, GL + tw / 2), this.W - GR - tw / 2), 13.5);
    }
    /* region names and each one's share of world population in the chosen year */
    const world = worldAt(this.year), ys = REGIONS.map((r, ri) => (this.rowTop[ri][i0] + this.rowBot[ri][i0]) / 2), ly = ys.slice();
    for (let i = 1; i < ly.length; i++) ly[i] = Math.max(ly[i], ly[i - 1] + 13.5);
    ly[ly.length - 1] = Math.min(ly[ly.length - 1], TOP + this.PH - 6);
    for (let i = ly.length - 2; i >= 0; i--) ly[i] = Math.min(ly[i], ly[i + 1] - 13.5);
    REGIONS.forEach((r, ri) => {
      const on = this.focus === r.id || this.sel?.region === r.id, hov = this.hover?.gutter && this.hover.region === r.id;
      ctx.strokeStyle = T.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(GL - 8, Math.round(ly[ri]) + 0.5); ctx.lineTo(GL - 3, Math.round(ys[ri]) + 0.5); ctx.lineTo(GL, Math.round(ys[ri]) + 0.5); ctx.stroke();
      ctx.textAlign = 'right'; ctx.font = `${on ? '700 ' : ''}12.5px "Atkinson Hyperlegible", sans-serif`; ctx.fillStyle = on || hov ? T.accent : T.ink;
      ctx.fillText(r.name, GL - 48, ly[ri]);
      ctx.font = '10.5px "JetBrains Mono", monospace'; ctx.fillStyle = T.muted;
      const pct = popAt(r.id, this.year) / world * 100; ctx.fillText((pct < 10 ? pct.toFixed(1) : Math.round(pct)) + '%', GL - 12, ly[ri]);
    });
    if (this.trail) this.drawTrail(ctx);
  }
  /* trail stops: each in its region's row, at its year; stops that fall close together move up a step */
  drawTrail(ctx) {
    const { theme: T } = this, stops = this.trail.stops, cur = this.stop;
    ctx.save(); ctx.beginPath(); ctx.rect(GL, TOP, this.PW, this.PH); ctx.clip();
    const placed = [];
    for (const s of stops) {
      const i = Math.min(NY - 1, Math.max(0, s.y - T0)), ri = REGION[s.region]?.i ?? 0, top = this.rowTop[ri][i], bot = this.rowBot[ri][i];
      const x = this.x(s.y); let y = (top + bot) / 2;
      y = Math.min(Math.max(y, TOP + 11), TOP + this.PH - 11);
      while (placed.some(p => Math.abs(p[0] - x) < 20 && Math.abs(p[1] - y) < 18)) y -= 18;
      if (y < TOP + 11) { y = TOP + 11; while (placed.some(p => Math.abs(p[0] - x) < 20 && Math.abs(p[1] - y) < 18)) y += 18; }
      placed.push([x, y]); s.cx = x; s.cy = y;
    }
    ctx.lineCap = 'round';
    for (const done of [false, true]) {
      ctx.beginPath();
      for (let i = 1; i < stops.length; i++) {
        if (done && i > cur) break;
        const a = stops[i - 1], b = stops[i], dx = Math.max(14, Math.abs(b.cx - a.cx) * 0.5) * Math.sign(b.cx - a.cx || 1);
        ctx.moveTo(a.cx, a.cy); ctx.bezierCurveTo(a.cx + dx, a.cy, b.cx - dx, b.cy, b.cx, b.cy);
      }
      ctx.setLineDash(done ? [] : [2, 5]); ctx.lineWidth = done ? 4.5 : 3.5; ctx.strokeStyle = T.halo; ctx.stroke();
      ctx.lineWidth = done ? 2.2 : 1.5; ctx.strokeStyle = done ? T.accent : hexA(T.ink, 0.55); ctx.stroke();
    }
    ctx.setLineDash([]); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const s of stops) {
      const on = s.i === cur, seen = s.i < cur, hov = this.hover?.stop === s.i, r = on ? 11 : 8.5;
      ctx.beginPath(); ctx.arc(s.cx, s.cy, r, 0, 6.3); ctx.fillStyle = on ? T.accent : seen ? T.ink : T.panel; ctx.fill();
      ctx.lineWidth = hov ? 2.5 : 1.5; ctx.strokeStyle = hov ? T.accent : on || seen ? T.panel : T.ink; ctx.stroke();
      ctx.font = `700 ${on ? 11.5 : 10}px "JetBrains Mono", monospace`; ctx.fillStyle = on || seen ? T.panel : T.ink; ctx.fillText(s.i + 1, s.cx, s.cy + 0.5);
    }
    ctx.restore();
  }
  tickStep() { const pxPerYear = this.PW / (this.t1 - this.t0); for (const s of [1, 2, 5, 10, 25, 50, 100]) if (s * pxPerYear >= 58) return s; return 100; }
}
