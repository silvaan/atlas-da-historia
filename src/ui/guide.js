// Step-by-step guide for an event: each step has a year, a place, a camera scale and a short text.
// The panel shows the current step; on the map, a numbered marker for each step (the current one in gold) and a line joining them.
import { fmtYear } from '../net/graph.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const AUTO_SECS = 11;

export class Guide {
  constructor(root, layer, { kinds, graph, onStep, onClose, onPick }) {
    Object.assign(this, { root, layer, kinds, graph, onStep, onClose, onPick });
    this.active = false; this.i = 0; this.steps = []; this.auto = false; this.acc = 0;
    // line between the steps (SVG) with numbered markers on top
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); this.svg.classList.add('g-path');
    this.poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline'); this.svg.append(this.poly);
    layer.append(this.svg);
    this.marks = [];
  }

  open(e, steps) {
    this.e = e; this.steps = steps; this.active = true; this.auto = false; this.acc = 0;
    const k = this.kinds[e.k];
    this.root.innerHTML = `
      <div class="d-head">
        <span class="kind" style="--c:${k.color}">Step-by-step guide</span>
        <button class="x" data-act="close" title="Close the guide (Esc)">×</button>
      </div>
      <h2 class="g-ev">${esc(e.t)}</h2>
      <ol class="g-steps" aria-label="Steps">${steps.map((s, i) => `<li><button data-i="${i}" title="${esc(fmtYear(s.y))} · ${esc(s.t)}"><b>${i + 1}</b></button></li>`).join('')}</ol>
      <div class="g-step" aria-live="polite">
        <div class="d-when g-when"></div>
        <h3 class="g-t"></h3>
        <p class="g-txt"></p>
        <button class="g-link" hidden></button>
      </div>
      <div class="g-bar"><span></span></div>
      <div class="g-nav">
        <button data-act="prev" title="Previous step (←)">← Previous</button>
        <button data-act="auto" class="g-auto" title="Advance automatically">▶ Auto-play</button>
        <button data-act="next" class="g-next" title="Next step (→)">Next →</button>
      </div>`;
    const q = s => this.root.querySelector(s);
    q('[data-act=close]').onclick = () => this.close();
    q('[data-act=prev]').onclick = () => { this.stopAuto(); this.go(this.i - 1); };
    q('[data-act=next]').onclick = () => { this.stopAuto(); this.i >= this.steps.length - 1 ? this.close() : this.go(this.i + 1); };
    q('[data-act=auto]').onclick = () => this.auto ? this.stopAuto() : this.startAuto();
    this.root.querySelectorAll('[data-i]').forEach(b => { b.onclick = () => { this.stopAuto(); this.go(+b.dataset.i); }; });
    this.dotBtns = [...this.root.querySelectorAll('[data-i]')];
    // markers on the map
    this.marks.forEach(m => m.remove());
    this.marks = steps.map((s, i) => {
      const m = document.createElement('button'); m.className = 'g-mark'; m.textContent = i + 1; m.title = `${i + 1}. ${s.t}`;
      m.onclick = () => { this.stopAuto(); this.go(i); };
      this.layer.append(m); return m;
    });
    this.root.hidden = false; this.layer.hidden = false;
    this.go(0);
  }
  close() {
    if (!this.active) return;
    this.active = false; this.stopAuto();
    this.root.hidden = true; this.layer.hidden = true;
    this.marks.forEach(m => m.remove()); this.marks = [];
    this.onClose?.();
  }
  go(i) {
    if (!this.active) return;
    this.i = Math.max(0, Math.min(this.steps.length - 1, i)); this.acc = 0;
    const s = this.steps[this.i], q = sel => this.root.querySelector(sel), last = this.i === this.steps.length - 1;
    q('.g-when').textContent = `Step ${this.i + 1} of ${this.steps.length} · ${fmtYear(s.y)}`;
    q('.g-t').textContent = s.t;
    q('.g-txt').textContent = s.txt;
    const ev = s.ev && s.ev !== this.e.id ? this.graph.byId.get(s.ev) : null, link = q('.g-link');
    link.hidden = !ev;
    if (ev) { link.innerHTML = `<i style="background:${this.kinds[ev.k].color}"></i>Linked to: <b>${esc(ev.t)}</b>`; link.onclick = () => { this.close(); this.onPick(ev.id); }; }
    q('[data-act=prev]').disabled = this.i === 0;
    q('.g-next').textContent = last ? 'Finish ✓' : 'Next →';
    this.dotBtns.forEach((b, k) => { b.classList.toggle('on', k === this.i); b.classList.toggle('done', k < this.i); });
    this.marks.forEach((m, k) => { m.classList.toggle('on', k === this.i); m.classList.toggle('done', k < this.i); });
    this.#bar();
    this.onStep(s, this.i);
  }
  startAuto() { this.auto = true; this.acc = 0; this.root.querySelector('.g-auto').textContent = '❚❚ Pause'; this.root.querySelector('.g-auto').classList.add('on'); }
  stopAuto() { this.auto = false; const b = this.root.querySelector('.g-auto'); if (b) { b.textContent = '▶ Auto-play'; b.classList.remove('on'); } this.#bar(); }
  #bar() { const b = this.root.querySelector('.g-bar span'); if (b) b.style.width = this.auto ? (this.acc / AUTO_SECS * 100) + '%' : '0%'; }
  tick(dt) {
    if (!this.active || !this.auto) return;
    this.acc += dt; this.#bar();
    if (this.acc >= AUTO_SECS) { if (this.i < this.steps.length - 1) this.go(this.i + 1); else this.stopAuto(); }
  }
  /* place the markers on screen: project(lon, lat) → [x, y] or null (behind the globe) */
  place(project) {
    if (!this.active) return;
    const pts = [];
    this.steps.forEach((s, k) => {
      const p = project(s.p[0], s.p[1]), m = this.marks[k];
      if (!p) { m.hidden = true; return; }
      m.hidden = false; m.style.transform = `translate(${p[0].toFixed(1)}px, ${p[1].toFixed(1)}px)`;
      if (k <= this.i) pts.push(p);
    });
    this.poly.setAttribute('points', pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' '));
  }
}
