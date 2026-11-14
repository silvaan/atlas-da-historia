// Search: a single field to reach anything — event, guide, chapter, monument, city, state or a year.
// Opens with the toolbar button, with "/" or Ctrl+K; arrows choose, Enter goes, Esc closes.
import { fmtYear } from '../net/graph.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export class Search {
  constructor(root, button, { items, onYear }) {
    Object.assign(this, { root, items, onYear });
    for (const it of items) { it.n = norm(it.title + ' ' + (it.alt || '')); it.tok = it.n.split(/[^a-z0-9]+/).filter(Boolean); }
    root.innerHTML = `
      <div class="s-box" role="dialog" aria-label="Search">
        <input type="search" placeholder="Search for an event, place, guide or year…" aria-label="Search" autocomplete="off" spellcheck="false">
        <ul class="s-res" role="listbox"></ul>
        <div class="s-foot"><kbd>↑</kbd><kbd>↓</kbd> choose · <kbd>Enter</kbd> go · <kbd>Esc</kbd> close</div>
      </div>`;
    this.input = root.querySelector('input'); this.list = root.querySelector('.s-res'); this.i = 0; this.res = [];
    this.input.oninput = () => this.#run();
    this.input.onkeydown = e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); this.i = (this.i + (e.key === 'ArrowDown' ? 1 : -1) + this.res.length) % Math.max(1, this.res.length); this.#mark(); }
      if (e.key === 'Enter') { e.preventDefault(); this.#go(this.res[this.i]); }
      if (e.key === 'Escape') { e.preventDefault(); this.close(); }
    };
    root.addEventListener('pointerdown', e => { if (e.target === root) this.close(); });
    button.onclick = () => this.open();
    window.addEventListener('keydown', e => {
      if (this.root.hidden && (e.key === '/' || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) && !e.target.closest?.('input, textarea, select')) { e.preventDefault(); this.open(); }
    });
  }
  get active() { return !this.root.hidden; }
  open() { this.root.hidden = false; this.input.value = ''; this.#run(); this.input.focus(); }
  close() { this.root.hidden = true; this.input.blur(); }
  #run() {
    const q = norm(this.input.value.trim());
    let res = [];
    // a year: "1822", "-500", "500 BC", "9,500 BC", "AD 117" (the old Portuguese "500 a.C." still works)
    const m = /^(ad\s*)?(-?\d{1,5})\s*(b\.?\s*c\.?(?:\s*e\.?)?|a\.?\s*c\.?|a\.?\s*d\.?|c\.?\s*e\.?)?$/.exec(q.replace(/(\d),(\d{3})\b/g, '$1$2'));
    if (m) { const bc = m[3] && /^(b|a\.?\s*c)/.test(m[3]), y = bc ? -Math.abs(+m[2]) : m[3] || m[1] ? Math.abs(+m[2]) : +m[2]; res.push({ kind: 'year', type: 'Year', title: `Go to the year ${y < 0 ? fmtYear(y) : y}`, go: () => this.onYear(y) }); }
    if (!q) res.push(...this.items.filter(it => it.kind === 'guide').slice(0, 8));
    else {
      const words = q.split(/[^a-z0-9]+/).filter(Boolean);
      const scored = [];
      for (const it of this.items) {
        // each typed word must start a word of the name ("pyra" finds Pyramids, not Ipiranga)
        if (!words.every(w => it.tok.some(t => t.startsWith(w)))) continue;
        let s = it.rank || 0;
        if (it.n.startsWith(q)) s += 30; else if (it.n.includes(' ' + words[0])) s += 12;
        s -= it.title.length * 0.05;
        scored.push([s, it]);
      }
      scored.sort((a, b) => b[0] - a[0]);
      res.push(...scored.slice(0, 40).map(x => x[1]));
    }
    this.res = res; this.i = 0;
    this.list.innerHTML = res.length ? res.map((r, i) => `<li role="option" data-i="${i}"><span class="s-type t-${r.kind}">${esc(r.type)}</span><b>${esc(r.title)}</b>${r.sub ? `<small>${esc(r.sub)}</small>` : ''}</li>`).join('')
      : '<li class="s-none">Nothing found. Try another name or a year.</li>';
    this.list.querySelectorAll('[data-i]').forEach(li => { li.onclick = () => this.#go(this.res[+li.dataset.i]); li.onpointerenter = () => { this.i = +li.dataset.i; this.#mark(); }; });
    if (!q) this.list.insertAdjacentHTML('afterbegin', '<li class="s-head">Step-by-step guides</li>');
    this.#mark();
  }
  #mark() { this.list.querySelectorAll('[data-i]').forEach(li => { const on = +li.dataset.i === this.i; li.classList.toggle('on', on); if (on) li.scrollIntoView({ block: 'nearest' }); }); }
  #go(r) { if (!r) return; this.close(); r.go(); }
}
