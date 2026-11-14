// Two-level timeline: on top, the chapters of the thread (one button each); below, the current chapter
// on its own scale, with a dot for each event and the year cursor. This way 12,000 years and 15 years fit on the same timeline.
import { fmtYear } from '../net/graph.js';

const STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export class Timeline {
  constructor(root, { chapters, events, kinds, keyframes, onYear, onPick, onChapter, onStep }) {
    Object.assign(this, { root, chapters, events, kinds, keyframes, onYear, onPick, onChapter });
    this.min = chapters[0].from; this.max = chapters[chapters.length - 1].to;
    this.playing = false; this.acc = 0; this.year = this.min; this.ch = null; this.sel = null;
    root.innerHTML = `
      <div class="tl-ctrl">
        <button class="tl-step" data-d="-1" title="Previous event (←)" aria-label="Previous event">‹</button>
        <button class="tl-play" title="Play through time (space)" aria-label="Play through time">▶</button>
        <button class="tl-step" data-d="1" title="Next event (→)" aria-label="Next event">›</button>
        <div class="tl-year"></div>
      </div>
      <div class="tl-main">
        <div class="tl-chapters" role="tablist" aria-label="Chapters"></div>
        <div class="tl-track">
          <div class="tl-spans"></div>
          <div class="tl-keys"></div>
          <div class="tl-line"><span class="tl-fill"></span></div>
          <div class="tl-dots"></div>
          <input type="range" step="1" aria-label="Year">
          <div class="tl-scale"></div>
        </div>
      </div>`;
    const q = s => root.querySelector(s);
    this.play = q('.tl-play'); this.yearEl = q('.tl-year'); this.input = q('input'); this.track = q('.tl-track');
    this.dots = q('.tl-dots'); this.spans = q('.tl-spans'); this.keys = q('.tl-keys'); this.scaleEl = q('.tl-scale'); this.fill = q('.tl-fill');
    root.querySelectorAll('.tl-step').forEach(b => { b.onclick = () => { this.stop(); onStep(+b.dataset.d); }; });

    const strip = q('.tl-chapters');
    this.chBtns = chapters.map((c, i) => {
      const b = document.createElement('button'); b.className = 'tl-ch'; b.setAttribute('role', 'tab');
      b.innerHTML = `<b>${esc(c.short)}</b><small>${fmtYear(c.from)}</small><span class="tl-prog"></span>`;
      b.title = `${i + 1}. ${c.title} (${fmtYear(c.from)} – ${fmtYear(c.to)})`;
      b.onclick = () => { this.stop(); onChapter(c); };
      strip.append(b); return b;
    });

    this.input.oninput = () => { this.stop(); onYear(+this.input.value); };
    this.play.onclick = () => this.playing ? this.stop() : this.start();
    window.addEventListener('keydown', e => { if (e.key === ' ' && !e.target.closest?.('input, textarea, button, select')) { e.preventDefault(); this.playing ? this.stop() : this.start(); } });
    // the year scale depends on the width: rebuild on resize
    new ResizeObserver(() => { if (this.ch) this.#build(this.ch); }).observe(this.track);
  }

  chapterAt(y) { return this.chapters.findLast(c => c.from <= y) || this.chapters[0]; }
  /* year → position (0–1) within the current chapter */
  pos(y, c = this.ch) { return Math.min(1, Math.max(0, (y - c.from) / (c.to - c.from))); }

  /* build the timeline for one chapter: event dots (in lanes when they crowd), periods, maps and years */
  #build(c) {
    this.ch = c;
    const W = Math.max(200, this.track.clientWidth), pct = y => (this.pos(y) * 100).toFixed(3) + '%';
    this.input.min = c.from; this.input.max = c.to;
    this.chBtns.forEach((b, i) => { const on = this.chapters[i] === c; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    this.dots.replaceChildren(); this.spans.replaceChildren(); this.keys.replaceChildren(); this.scaleEl.replaceChildren();
    const list = this.events.filter(e => e.y < c.to + (c === this.chapters.at(-1) ? 1 : 0) && (e.y2 ?? e.y) >= c.from);
    const lanes = [];
    this.dotEls = new Map();
    for (const e of list) {
      const y0 = Math.max(e.y, c.from), x = this.pos(y0) * W, color = this.kinds[e.k].color;
      let lane = lanes.findIndex(last => last < x - 15); if (lane < 0) { lane = lanes.length < 3 ? lanes.length : lanes.indexOf(Math.min(...lanes)); }
      lanes[lane] = x;
      const b = document.createElement('button'); b.className = 'tl-dot' + (e.y < c.from ? ' before' : ''); b.style.left = pct(y0); b.style.setProperty('--c', color); b.style.setProperty('--lane', lane);
      b.dataset.id = e.id; b.dataset.t = `${fmtYear(e.y)} · ${e.t}`; b.setAttribute('aria-label', b.dataset.t);
      b.onclick = () => { this.stop(); this.onPick(e.id); };
      this.dots.append(b); this.dotEls.set(e.id, b);
      if (e.y2 && e.y2 > e.y) {
        const s = document.createElement('span'); s.className = 'span'; s.style.left = pct(y0); s.style.width = `calc(${pct(e.y2)} - ${pct(y0)})`; s.style.setProperty('--c', color); s.style.setProperty('--lane', lane);
        this.spans.append(s);
      }
    }
    for (const k of this.keyframes) if (k.from > c.from && k.from < c.to) { const s = document.createElement('span'); s.style.left = pct(k.from); s.title = `The map changes: ${k.label}`; this.keys.append(s); }
    // "round" years with room for the label (BC years are wider)
    const per = W / (c.to - c.from), lw = c.from < 0 ? 100 : 56, step = STEPS.find(s => s * per >= lw) || 5000;
    for (let y = Math.ceil(c.from / step) * step; y <= c.to; y += step) {
      const x = this.pos(y) * W; if (x > W - lw * 0.6 && y !== c.to) continue; if (y === c.to && x - (this.pos(y - step) * W) < lw) continue;
      const s = document.createElement('span'); s.style.left = pct(y); s.textContent = fmtYear(y);
      if (x < lw * 0.5) s.className = 'l'; else if (x > W - lw * 0.5) s.className = 'r';
      this.scaleEl.append(s);
    }
    this.#mark();
  }
  #mark() {
    if (!this.dotEls) return;
    for (const [id, b] of this.dotEls) {
      const e = this.events.find(x => x.id === id), end = e.y2 ?? e.y;
      b.classList.toggle('sel', id === this.sel);
      b.classList.toggle('past', end < this.year - this.tol());
      b.classList.toggle('now', this.year >= e.y && this.year <= end + this.tol());
    }
  }
  /* how many years an event stays "now" after it ends: proportional to the chapter length */
  tol(c = this.ch) { return Math.max(2, (c.to - c.from) / 60); }

  set(year, sel) {
    this.year = year; this.sel = sel;
    const c = this.chapterAt(year);
    if (c !== this.ch) this.#build(c);
    this.input.value = Math.round(year); this.fill.style.width = (this.pos(year) * 100) + '%';
    this.yearEl.textContent = fmtYear(Math.round(year));
    this.chBtns.forEach((b, i) => { const ch = this.chapters[i]; b.style.setProperty('--p', year >= ch.to ? 1 : year <= ch.from ? 0 : (year - ch.from) / (ch.to - ch.from)); });
    this.#mark();
  }
  start() { if (this.year >= this.max) this.onYear(this.min); this.playing = true; this.play.textContent = '❚❚'; this.play.classList.add('on'); }
  stop() { this.playing = false; this.play.textContent = '▶'; this.play.classList.remove('on'); }
  tick(dt) {
    if (!this.playing) return;
    // each chapter takes 30 to 60 seconds, depending on how many events it has; at the end it moves to the next
    const c = this.ch, n = this.dotEls?.size || 0, secs = Math.min(60, 30 + n * 1.5);
    this.acc += dt * (c.to - c.from) / secs;
    if (this.acc >= 1) {
      const k = Math.floor(this.acc); this.acc -= k;
      const y = Math.min(this.max, Math.round(this.year) + k);
      this.onYear(y); if (y >= this.max) this.stop();
    }
  }
}
