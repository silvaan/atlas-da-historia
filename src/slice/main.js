// "Time slice" prototype: the map of the year on top, every region and period below, a single address (place + year).
import '@fontsource/young-serif/400.css';
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import './slice.css';
import { EVENTS, LINKS, KINDS, LINK_TYPES } from '../data/history.js';
import { COUNTRIES } from '../data/countries.js';
import { buildGraph, span } from '../net/graph.js';
import { REGIONS, REGION, COUNTRY, regionAt, countryAt } from './regions.js';
import { T0, T1, popAt, worldAt, lerpKeys } from './pop.js';
import { POWERS, BANDS } from './powers.js';
import { THEMES, applyTheme } from './theme.js';
import { MapView, sliceFor, SLICES } from './map.js';
import { CutView } from './cut.js';
import { buildTrails } from './trails.js';

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const mi = n => n >= 100 ? Math.round(n / 10) * 10 : n >= 10 ? Math.round(n) : n.toFixed(1);
const KIND_SHORT = { government: 'Government', economy: 'Economy', conflict: 'Conflict', ideas: 'Ideas', peoples: 'Peoples' };
const shortName = b => b.n.split(',')[0].split(' (')[0];
const BASE = import.meta.env.BASE_URL;

/* Atlas events that fall inside the prototype's window */
const graph = buildGraph(EVENTS, LINKS);
const evs = EVENTS.filter(e => e.p && e.y <= T1 && (e.y2 ?? e.y) >= T0)
  .map(e => ({ ...e, region: regionAt(e.p[0], e.p[1]), color: KINDS[e.k].color })).filter(e => e.region).sort((a, b) => a.y - b.y);
const evById = new Map(evs.map(e => [e.id, e]));
const cutLinks = graph.links.filter(l => evById.has(l.from) && evById.has(l.to)).map(l => ({ a: evById.get(l.from), b: evById.get(l.to), type: l.type }));
const TRAILS = buildTrails(graph);
const ZOOM = { world: 1, continent: 2.2, region: 4.2, close: 7 };
/* open trail: cur = the trail, i = current stop; progress = how far each trail has been followed */
const trail = { cur: null, i: 0, saved: null };
let progress = {};
try { progress = JSON.parse(localStorage.getItem('slice-trails') || '{}'); } catch { /* no storage */ }
/* progress: { v: stops already seen, last: last one opened } */
const prog = id => { const p = progress[id]; return p && Array.isArray(p.v) ? p : { v: [], last: 0 }; };

const state = { year: 1500, sel: null, theme: 'paper', today: false, playing: false };
try { const s = JSON.parse(localStorage.getItem('slice') || '{}'); if (THEMES[s.theme]) state.theme = s.theme; state.today = !!s.today; } catch { /* no storage */ }
const save = () => { try { localStorage.setItem('slice', JSON.stringify({ theme: state.theme, today: state.today })); } catch { /* no storage */ } };

const tip = $('#tip');
function showTip(html, x, y) {
  if (!html) { tip.hidden = true; return; }
  tip.innerHTML = html; tip.hidden = false;
  const w = tip.offsetWidth, h = tip.offsetHeight;
  tip.style.left = Math.min(innerWidth - w - 8, x + 14) + 'px'; tip.style.top = (y + 18 + h > innerHeight ? y - h - 10 : y + 18) + 'px';
}

const map = new MapView($('#map'), {
  hover(h, x, y) {
    if (!h) return showTip(null);
    if (h.stop != null) return showTip(stopTip(h.cluster ? h.cluster.stops : [h.stop]), x, y);
    if (h.ev) return showTip(`<b>${esc(h.ev.t)}</b><small>${span(h.ev)} · ${esc(h.ev.place || '')}</small>`, x, y);
    const f = h.f, extra = [f.power ? POWERS[f.power][0] : null, f.region ? REGION[f.region].name : null].filter(v => v && v !== f.label);
    showTip(`<b>${esc(f.label)}</b><small>${esc(extra.join(' · '))}${f.label !== f.name ? `<br>in the basemap: ${esc(f.name)}` : ''}</small>`, x, y);
  },
  click(h) {
    if (trail.cur) { if (h?.stop != null) goStop(nextIn(h.cluster.stops)); return; }
    if (!h) return select(null);
    if (h.ev) return select({ event: h.ev.id });
    if (h.f.power) return select({ power: h.f.power, feat: h.f.label });
    if (h.f.region) select({ region: h.f.region, feat: h.f.label });
  }
});
const cut = new CutView($('#cut'), {
  year: y => setYear(y),
  hover(h, x, y) {
    if (!h || h.ruler) return showTip(null);
    if (h.stop != null) return showTip(stopTip([h.stop]), x, y);
    if (h.ev) return showTip(`<b>${esc(h.ev.t)}</b><small>${span(h.ev)} · ${esc(h.ev.place || '')}</small>`, x, y);
    if (h.band) return showTip(`<b>${esc(h.band.n)}</b><small>${REGION[h.band.r].name} · ${h.band.from}–${h.band.to}</small>`, x, y);
    const r = REGION[h.region], yy = h.year ?? state.year, p = popAt(r.id, yy);
    showTip(`<b>${r.name}${h.gutter ? '' : ' in ' + yy}</b><small>about ${mi(p)} million · ${(p / worldAt(yy) * 100).toFixed(1)}% of the world${h.gutter ? '<br>click to open the region' : ''}</small>`, x, y);
  },
  click(h) {
    if (!h || h.ruler) return;
    if (h.stop != null) return goStop(h.stop);
    if (trail.cur) return;
    if (h.ev) return select({ event: h.ev.id });
    if (h.gutter) return focusRegion(h.region);
    if (h.band) { select({ power: h.band.p }); return flyToPower(h.band.p, h.band.r); }
    if (state.sel) select(null);
  },
  focus: r => focusRegion(r)
});
window.__slice = { map, cut, state, trail, TRAILS };
const stopTip = ids => ids.map(i => { const s = trail.cur.stops[i]; return `<b>${i + 1}. ${esc(s.t)}</b><small>${s.y} · ${esc(s.place || '')}</small>`; }).join('');
/* on a marker with several stops, a click goes to the first one after the current stop (or back to the first) */
const nextIn = ids => ids.find(i => i > trail.i) ?? ids[0];

function focusRegion(r) {
  const on = cut.focus === r ? null : r;
  cut.setFocus(on);
  if (on) select({ region: on }); else if (state.sel?.region) select(null);
}

/* ---------- maps by year ---------- */
const loading = new Map();
function ensureSlice(y) {
  if (!loading.has(y)) loading.set(y, fetch(`${BASE}slice/w${y}.json`).then(r => r.json()).then(d => { map.addSlice(d); if (sliceFor(state.year) === y) map.setSlice(y); }));
  return loading.get(y);
}

/* ---------- year ---------- */
let sideQueued = false;
function setYear(y, opts = {}) {
  y = Math.round(Math.min(T1, Math.max(T0, y)));
  if (y === state.year && !opts.force) return;
  state.year = y; cut.setYear(y); if (opts.reveal) cut.reveal(y);
  const s = sliceFor(y); ensureSlice(s); map.setSlice(s);
  $('#yr').textContent = y;
  $('#cap').textContent = `borders of ${s} · world: about ${mi(worldAt(y))} million people`;
  refreshMapEvents();
  if (!trail.cur && !state.sel?.event && !sideQueued) { sideQueued = true; requestAnimationFrame(() => { sideQueued = false; renderSide(); }); }
  writeHash();
}

/* ---------- selection ---------- */
function select(sel, opts = {}) {
  if (trail.cur) leaveTrail();
  state.sel = sel; map.sel = cut.sel = sel; map.dirty = cut.dirty = true;
  if (!sel?.region && cut.focus) cut.setFocus(null);
  if (sel?.event) {
    const e = evById.get(sel.event) || graph.byId.get(sel.event);
    if (e) {
      setYear(Math.max(T0, Math.min(T1, e.y)), { reveal: true });
      /* frame the event together with its causes and consequences */
      const pts = [e, ...(graph.out.get(e.id) || []).map(l => graph.byId.get(l.to)), ...(graph.inc.get(e.id) || []).map(l => graph.byId.get(l.from))].filter(o => o?.p).map(o => o.p);
      if (pts.length > 1) map.fit(pts); else if (e.p) map.flyTo(e.p[0], e.p[1], Math.max(map.k, map.kMin * 2.2));
    }
  }
  refreshMapEvents(); renderSide(); writeHash();
}
function refreshMapEvents() {
  if (trail.cur) { map.events = []; map.links = []; map.over = true; return; }
  const y = state.year, selE = state.sel?.event, linked = new Set(), links = [], T = THEMES[state.theme];
  if (selE) {
    for (const l of graph.out.get(selE) || []) { linked.add(l.to); const a = graph.byId.get(l.from), b = graph.byId.get(l.to); if (a.p && b.p) links.push({ a: a.p, b: b.p, color: T.effect }); }
    for (const l of graph.inc.get(selE) || []) { linked.add(l.from); const a = graph.byId.get(l.from), b = graph.byId.get(l.to); if (a.p && b.p) links.push({ a: a.p, b: b.p, color: T.cause }); }
  }
  const list = [];
  for (const e of EVENTS) {
    if (!e.p) continue;
    const y2 = e.y2 ?? e.y, isSel = e.id === selE, lk = linked.has(e.id);
    if (!isSel && !lk && !(evById.has(e.id) && e.y - 20 <= y && y <= y2 + 20)) continue;
    list.push({ id: e.id, p: e.p, t: e.t, y: e.y, y2: e.y2, place: e.place, color: KINDS[e.k].color, near: !selE && e.y - 4 <= y && y <= y2 + 4, linked: lk });
  }
  list.sort((a, b) => (a.id === selE) - (b.id === selE) || a.near - b.near);
  map.events = list; map.links = links; map.over = true;
}

/* ---------- side panel ---------- */
const side = $('#side');
const evLi = e => `<li data-ev="${e.id}"><i style="background:${KINDS[e.k].color}"></i><span class="y">${span(e)}</span><span>${esc(e.t)}</span></li>`;
function renderSide() {
  const s = state.sel, y = state.year;
  const tall = !!trail.cur || !!s?.trails;
  if ($('#stage').classList.contains('tall') !== tall) $('#stage').classList.toggle('tall', tall);
  side.className = '';
  if (trail.cur) return renderTrail();
  if (s?.trails) return renderTrailList();
  if (s?.event) return renderEvent(graph.byId.get(s.event));
  let html = '';
  if (s?.power) {
    const [name, color] = POWERS[s.power];
    html += `<button class="back">← Meanwhile</button><div class="chip"><i style="background:${color}"></i>${s.feat && s.feat !== name ? esc(s.feat) + ' · ' : ''}power</div><h2>${esc(name)}</h2>
      <p class="lede">The bands of this color in the slice show where and when ${esc(name)} ruled. Click a row to go there.</p><ul class="bands">`;
    for (const b of BANDS.filter(b => b.p === s.power)) html += `<li data-band="${b.i}"><span class="y">${b.from}–${b.to}</span><span><b>${esc(b.n)}</b><small>${REGION[b.r].name}</small></span></li>`;
    html += '</ul>';
    side.innerHTML = html; return;
  }
  const regions = s?.region ? [REGION[s.region]] : REGIONS, world = worldAt(y);
  if (s?.region) {
    const r = REGION[s.region], p = popAt(r.id, y);
    html += `<button class="back">← Meanwhile</button><div class="chip">${s.feat ? esc(s.feat) + ' · ' : ''}region</div><h2>${r.name} in ${y}</h2>
      <p class="lede">About <b>${mi(p)} million</b> people, <b>${(p / world * 100).toFixed(1)}%</b> of the world’s population.</p>`;
  } else {
    html += `<button class="trails-cta" data-trails>Study a topic step by step <b>${Object.keys(TRAILS).length} trails →</b></button>
      <div class="chip">the whole world, in the same year</div><h2>Meanwhile, in ${y}</h2>`;
  }
  for (const r of regions) {
    const bands = BANDS.filter(b => b.r === r.id && y >= b.from && y <= b.to).map(b => [b, lerpKeys(b.k, y)]).sort((a, b) => b[1] - a[1]).slice(0, s?.region ? 12 : 3);
    const near = evs.filter(e => e.region === r.id && e.y - 12 <= y && y <= (e.y2 ?? e.y) + 12).sort((a, b) => Math.abs(a.y - y) - Math.abs(b.y - y)).slice(0, s?.region ? 12 : 3);
    html += `<section>${s?.region ? '' : `<h3 data-region="${r.id}">${r.name}<small>${(popAt(r.id, y) / world * 100).toFixed(popAt(r.id, y) / world < 0.1 ? 1 : 0)}%</small></h3>`}
      <p class="who">${bands.map(([b]) => `<a data-power="${b.p}"><i style="background:${POWERS[b.p][1]}"></i>${esc(s?.region ? b.n : shortName(b))}</a>`).join('') || '<em>many peoples, no state listed</em>'}</p>
      ${near.length ? `<ul class="evs">${near.map(evLi).join('')}</ul>` : s?.region ? '<p class="none">No Atlas events near this year.</p>' : ''}</section>`;
  }
  side.innerHTML = html;
}
function renderEvent(e) {
  const inc = graph.inc.get(e.id) || [], out = graph.out.get(e.id) || [];
  const li = (l, id) => { const o = graph.byId.get(id), inRange = evById.has(id); return `<li data-ev="${id}" class="${inRange ? '' : 'far'}"><span class="y">${span(o)}</span><span><b>${esc(o.t)}</b><small>${esc(LINK_TYPES[l.type] || l.type)}${l.why ? ': ' + esc(l.why) : ''}${l.debated ? ' (debated)' : ''}</small></span></li>`; };
  side.innerHTML = `<button class="back">← Meanwhile</button>
    <div class="chip"><i style="background:${KINDS[e.k].color}"></i>${esc(KINDS[e.k].label)}</div>
    <h2>${esc(e.t)}</h2><p class="when">${span(e)} · ${esc(e.place || '')}</p><p class="txt">${esc(e.txt || '')}</p>
    ${TRAILS[e.id] ? `<button class="go-trail" data-trail="${e.id}">Follow the trail step by step <small>${TRAILS[e.id].stops.length} stops · ${TRAILS[e.id].from}–${TRAILS[e.id].to}</small></button>` : ''}
    ${inc.length ? `<h4 class="cause">What led to this</h4><ul class="links">${inc.map(l => li(l, l.from)).join('')}</ul>` : ''}
    ${out.length ? `<h4 class="effect">What came next</h4><ul class="links">${out.map(l => li(l, l.to)).join('')}</ul>` : ''}`;
  side.scrollTop = 0;
}
side.addEventListener('click', e => {
  const t = e.target.closest('[data-ev],[data-power],[data-region],[data-band],[data-trail],[data-trails],[data-stop],[data-step],[data-close],.back'); if (!t) return;
  if (t.dataset.close != null) return closeTrail();
  if (t.dataset.trails != null) return select({ trails: true });
  if (t.dataset.trail) { const tr = TRAILS[t.dataset.trail], p = prog(tr.id); return openTrail(tr.id, t.dataset.from ? +t.dataset.from : p.v.length < tr.stops.length ? p.last : 0); }
  if (t.dataset.stop) return goStop(+t.dataset.stop);
  if (t.dataset.step) return goStop(trail.i + +t.dataset.step);
  if (t.classList.contains('back')) return select(null);
  if (t.dataset.ev) return select({ event: t.dataset.ev });
  if (t.dataset.power) return goPower(t.dataset.power);
  if (t.dataset.region) return focusRegion(t.dataset.region);
  if (t.dataset.band) { const b = BANDS[+t.dataset.band]; setYear(Math.round((Math.max(b.from, T0) + b.to) / 2), { reveal: true }); flyToPower(b.p, b.r); }
});

/* ---------- trails ---------- */
function openTrail(id, i = 0) {
  const tr = TRAILS[id]; if (!tr) return;
  if (trail.cur) leaveTrail();
  play(false); state.sel = null;
  trail.saved = { events: cut.events, links: cut.links };
  trail.cur = tr; map.trail = cut.trail = tr;
  cut.events = []; cut.links = []; cut.relayoutEvents = cut.dirty = true;
  const pad = Math.max(6, (tr.to - tr.from) * 0.06);
  cut.setView(tr.from - pad, tr.to + pad); cut.setFocus(tr.home);
  trail.i = -1; goStop(Math.max(0, Math.min(i, tr.stops.length - 1)));
}
/* leave trail mode without redrawing the panel (the caller decides what to show) */
function leaveTrail() {
  if (!trail.cur) return;
  cut.events = trail.saved.events; cut.links = trail.saved.links; trail.cur = null; state.tween = null;
  map.trail = cut.trail = null; map.stop = cut.stop = -1; map.sel = cut.sel = null;
  cut.setFocus(null); cut.setView(T0, T1); cut.relayoutEvents = cut.dirty = map.dirty = true; cut.now = true;
}
function closeTrail() { leaveTrail(); select(null); }
function goStop(i) {
  const tr = trail.cur; if (!tr || !tr.stops[i] || i === trail.i) return;
  const s = tr.stops[i]; trail.i = i; trail.shownAt = performance.now();
  map.stop = cut.stop = i; map.sel = cut.sel = s.look || null; map.dirty = cut.dirty = true; cut.now = map.over = true;
  tweenYear(s.y); cut.reveal(s.y);
  map.flyTo(s.p[0], s.p[1], map.kMin * (ZOOM[s.zoom] || ZOOM.region));
  { const p = prog(tr.id); if (!p.v.includes(i)) p.v.push(i); p.last = i; progress[tr.id] = p; try { localStorage.setItem('slice-trails', JSON.stringify(progress)); } catch { /* no storage */ } }
  refreshMapEvents(); renderSide(); writeHash();
}
/* the year runs to the stop instead of jumping: you can see time passing in the slice and the borders changing */
function tweenYear(y) {
  if (Math.abs(y - state.year) < 2) return setYear(y);
  state.tween = { a: state.year, b: y, t: performance.now(), dur: Math.min(1100, 300 + Math.abs(y - state.year) * 5) };
}
function renderTrail() {
  const tr = trail.cur, i = trail.i, s = tr.stops[i], n = tr.stops.length, last = i === n - 1, seen = prog(tr.id).v;
  const trailEvs = new Set(tr.stops.map(st => st.ev).filter(Boolean));
  const meanwhile = evs.filter(e => !trailEvs.has(e.id) && e.region !== s.region && e.y - 6 <= s.y && s.y <= (e.y2 ?? e.y) + 6)
    .sort((a, b) => Math.abs(a.y - s.y) - Math.abs(b.y - s.y)).slice(0, 3);
  side.className = 'trail';
  side.innerHTML = `<div class="trail-top"><div class="chip">trail · ${n} stops · ${tr.from}–${tr.to}<button class="x" data-close title="Leave the trail (Esc)">Exit ✕</button></div>
    <h2>${esc(tr.title)}</h2>${tr.question ? `<p class="question">${esc(tr.question)}</p>` : ''}
    <div class="acts">${tr.acts.map((a, ai) => `<div class="act${ai === s.act ? ' on' : ''}"><span>${esc(a.t)}</span><div class="dots">${tr.stops.filter(st => st.act === ai).map(st =>
      `<button data-stop="${st.i}" class="${st.i === i ? 'on' : seen.includes(st.i) ? 'seen' : ''}" title="${st.y} · ${esc(st.t)}">${st.i + 1}</button>`).join('')}</div></div>`).join('')}</div></div>
    <div class="stop-body"><article class="stop" data-act="${esc(tr.acts[s.act].t)}">
      <p class="when"><b>${s.y}</b>${s.place ? ' · ' + esc(s.place) : ''}</p>
      <h3>${esc(s.t)}</h3><p class="txt">${esc(s.txt)}</p>
      ${s.look ? `<p class="look"><i style="background:${POWERS[s.look.power][1]}"></i>Highlighted on the map and in the slice: ${esc(POWERS[s.look.power][0])}</p>` : ''}
      ${s.q ? `<p class="think"><b>Think</b>${esc(s.q)}</p>` : ''}
      ${meanwhile.length ? `<h4>At the same time, elsewhere</h4><ul class="evs static">${meanwhile.map(e => `<li><i style="background:${KINDS[e.k].color}"></i><span class="y">${span(e)}</span><span>${esc(e.t)} <small>${REGION[e.region].name}</small></span></li>`).join('')}</ul>` : ''}
    </article>
    ${last ? `<div class="end"><h4>End of the trail</h4>${tr.next.length ? `<p>To keep going:</p><ul class="links">${tr.next.map(id => `<li data-trail="${id}" data-from="0"><span class="y">${TRAILS[id].from}</span><span><b>${esc(TRAILS[id].title)}</b><small>${TRAILS[id].stops.length} stops</small></span></li>`).join('')}</ul>` : ''}
      <button class="ghost" data-stop="0">Start over</button> <button class="ghost" data-trails>Other trails</button></div>` : ''}</div>
    <nav class="stepper"><button data-step="-1" ${i ? '' : 'disabled'}>‹ Previous</button><span>${i + 1} / ${n}</span><button class="primary" data-step="1" ${last ? 'disabled' : ''}>Next ›</button></nav>`;
  side.querySelector('.stop-body').scrollTop = 0;
}
function renderTrailList() {
  const list = Object.values(TRAILS).sort((a, b) => b.curated - a.curated || a.from - b.from);
  side.innerHTML = `<button class="back">← Meanwhile</button><div class="chip">study a topic</div><h2>Trails</h2>
    <p class="lede">Each trail tells a topic in stops: before, the event, and after. The map flies to the place, the year runs to the date, and the slice shows where the stop sits in world time.</p>
    <ul class="links trails">${list.map(tr => { const seen = prog(tr.id).v.length; return `<li data-trail="${tr.id}"><span class="y">${tr.from}</span><span><b>${esc(tr.title)}</b><small>${tr.stops.length} stops${tr.curated ? ' · with questions' : ''}${seen ? ` · <em>${seen === tr.stops.length ? 'done' : `seen ${seen} of ${tr.stops.length}`}</em>` : ''}</small><span class="bar"><i style="width:${seen / tr.stops.length * 100}%"></i></span></span></li>`; }).join('')}</ul>`;
  side.scrollTop = 0;
}

/* ---------- go to a place ---------- */
async function flyToPower(p, region) {
  await ensureSlice(sliceFor(state.year));
  const fs = map.cur.feats.filter(f => f.power === p), f = (region && fs.find(f => f.region === region)) || fs[0];
  if (f) map.flyTo(f.lon, f.lat, map.zoomFor(f));
}
function goPower(p) {
  const bands = BANDS.filter(b => b.p === p), y = state.year;
  if (bands.length && !bands.some(b => y >= b.from && y <= b.to)) { const b = bands.reduce((a, b) => Math.abs(b.from - y) < Math.abs(a.from - y) ? b : a); setYear(b.from + Math.min(20, (b.to - b.from) >> 1), { reveal: true }); }
  select({ power: p }); flyToPower(p);
}
function goCountry(name) {
  const rings = COUNTRIES[name], big = rings.reduce((a, r) => r.length > a.length ? r : a, rings[0]);
  let x0 = 999, x1 = -999, y0 = 999, y1 = -999; for (const [x, y] of big) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const lon = (x0 + x1) / 2, lat = (y0 + y1) / 2, reg = COUNTRY[name][0];
  map.flyTo(lon, lat, Math.min(map.kMin * 8, Math.max(map.kMin * 1.8, map.kMin * 70 / Math.max(x1 - x0, (y1 - y0) * 1.6))));
  cut.setFocus(reg); select({ region: regionAt(lon, lat) || reg, feat: COUNTRY[name][1] + ' (present-day country)' });
}

/* ---------- address: "place year" ---------- */
const INDEX = [
  ...Object.entries(COUNTRY).map(([k, [, name]]) => ({ label: name, sub: 'present-day country', rank: 0, go: () => goCountry(k) })),
  ...Object.entries(POWERS).map(([k, [n]]) => ({ label: n, sub: 'power', rank: 1, go: () => goPower(k) })),
  ...BANDS.filter(b => b.n !== POWERS[b.p][0]).map(b => ({ label: b.n, sub: `${REGION[b.r].name} · ${b.from}–${b.to}`, rank: 2, at: b.from + Math.min(20, (b.to - b.from) >> 1), go: () => { select({ power: b.p }); flyToPower(b.p, b.r); } })),
  ...Object.values(TRAILS).map(tr => ({ label: tr.title, sub: `trail · ${tr.stops.length} stops · ${tr.from}–${tr.to}`, rank: -1, trail: true, go: () => openTrail(tr.id, 0) })),
  ...REGIONS.map(r => ({ label: r.name, sub: 'region', rank: 1, go: () => { cut.setFocus(r.id); select({ region: r.id }); } })),
  ...evs.map(e => ({ label: e.t, sub: `${span(e)} · ${e.place || ''}`, rank: 3, go: () => select({ event: e.id }) }))
].map(it => ({ ...it, key: norm(it.label) }));
const q = $('#q'), sug = $('#sug'); let items = [], cursor = 0;
function search() {
  const raw = q.value.trim(), m = raw.match(/\b(1[4-9]\d\d)\b/), year = m ? Math.min(T1, +m[1]) : null, text = norm(raw.replace(/\s+in\s+(?=\d)/gi, ' ').replace(/\b\d+\b/g, ' ').replace(/[,;·]/g, ' ').trim().replace(/\s+/g, ' '));
  items = [];
  if (text) items = INDEX.filter(it => it.key.includes(text)).sort((a, b) => (b.key === text) - (a.key === text) || (b.key.startsWith(text)) - (a.key.startsWith(text)) || a.rank - b.rank || a.key.length - b.key.length).filter((it, i, all) => it.trail || all.findIndex(o => !o.trail && o.key === it.key) === i).slice(0, 8).map(it => ({ ...it, year }));
  else if (year) items = [{ label: `Go to ${year}`, sub: 'year', year, yearOnly: true, go: () => {} }];
  cursor = 0; paint();
}
function paint() {
  sug.hidden = !items.length;
  sug.innerHTML = items.map((it, i) => `<li class="${i === cursor ? 'on' : ''}" data-i="${i}"><b>${it.trail ? '<em class="tr">trail</em> ' : ''}${esc(it.label)}${it.year && !it.yearOnly && !it.trail ? ` <span>in ${it.year}</span>` : ''}</b><small>${esc(it.sub)}</small></li>`).join('');
}
function pick(i) {
  const it = items[i]; if (!it) return;
  if (!it.trail && (it.year || it.at)) setYear(it.year || it.at, { reveal: true });
  it.go(); q.value = ''; items = []; paint(); q.blur();
}
q.addEventListener('input', search);
q.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { cursor = Math.min(items.length - 1, cursor + 1); paint(); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { cursor = Math.max(0, cursor - 1); paint(); e.preventDefault(); }
  else if (e.key === 'Enter') pick(cursor);
  else if (e.key === 'Escape') { q.value = ''; items = []; paint(); q.blur(); }
  e.stopPropagation();
});
q.addEventListener('blur', () => setTimeout(() => { sug.hidden = true; }, 150));
q.addEventListener('focus', search);
sug.addEventListener('mousedown', e => { const li = e.target.closest('li'); if (li) pick(+li.dataset.i); });

/* ---------- page address: #1500, #1500/ev/cabral, #1808/p/pt, #1600/r/jp ---------- */
let hashT = 0;
function writeHash() {
  clearTimeout(hashT);
  hashT = setTimeout(() => {
    const s = state.sel, h = trail.cur ? `#trail/${trail.cur.id}/${trail.i + 1}` : '#' + state.year + (s?.event ? '/ev/' + s.event : s?.power ? '/p/' + s.power : s?.region ? '/r/' + s.region : '');
    if (location.hash !== h) history.replaceState(null, '', h);
  }, 200);
}
function readHash() {
  const [y, kind, id] = location.hash.slice(1).split('/');
  if (y === 'trail') { if (TRAILS[kind] && !(trail.cur?.id === kind && trail.i === (+id || 1) - 1)) { if (trail.cur?.id === kind) goStop((+id || 1) - 1); else openTrail(kind, (+id || 1) - 1); } return; }
  if (/^\d{4}$/.test(y)) setYear(+y, { force: true, reveal: true });
  if (kind === 'ev' && graph.byId.has(id)) select({ event: id });
  else if (kind === 'p' && POWERS[id]) select({ power: id });
  else if (kind === 'r' && REGION[id]) { cut.setFocus(id); select({ region: id }); }
}

/* ---------- controls ---------- */
function setTheme(name) {
  state.theme = name; const T = THEMES[name];
  applyTheme(T); map.theme = cut.theme = T; map.dirty = cut.dirty = true;
  $('#theme').textContent = 'Style: ' + T.label; refreshMapEvents(); save();
}
$('#btrails').addEventListener('click', () => select({ trails: true }));
$('#theme').addEventListener('click', () => { const k = Object.keys(THEMES); setTheme(k[(k.indexOf(state.theme) + 1) % k.length]); });
$('#today').checked = state.today; map.today = state.today;
$('#today').addEventListener('change', e => { state.today = map.today = e.target.checked; map.dirty = true; save(); });
function play(on) { state.playing = on; trail.shownAt = performance.now(); $('#play').textContent = on ? '❚❚' : '▶'; $('#play').setAttribute('aria-label', on ? 'Pause' : 'Play'); if (on && !trail.cur && state.year >= T1) setYear(T0); }
$('#play').addEventListener('click', () => play(!state.playing));
$('#prev').addEventListener('click', () => step(-1)); $('#next').addEventListener('click', () => step(1));
/* previous/next: from event to event */
function step(d) {
  if (trail.cur) return goStop(trail.i + d);
  const cur = state.sel?.event && evById.get(state.sel.event), y = state.year;
  const i = cur ? evs.indexOf(cur) + d : d > 0 ? evs.findIndex(e => e.y > y) : evs.findLastIndex(e => e.y < y);
  if (evs[i]) select({ event: evs[i].id });
}
addEventListener('keydown', e => {
  if (e.target === q || e.ctrlKey || e.metaKey) return;
  if (trail.cur && ['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown'].includes(e.key)) { goStop(trail.i + (e.key === 'ArrowLeft' || e.key === 'PageUp' ? -1 : 1)); e.preventDefault(); return; }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { setYear(state.year + (e.key === 'ArrowLeft' ? -1 : 1) * (e.shiftKey ? 10 : 1), { reveal: true }); e.preventDefault(); }
  else if (e.key === ' ') { play(!state.playing); e.preventDefault(); }
  else if (e.key === 'Escape') trail.cur ? closeTrail() : select(null);
  else if (e.key === '/') { q.focus(); e.preventDefault(); }
  else if (e.key === 'PageDown' || e.key === 'PageUp') { step(e.key === 'PageDown' ? 1 : -1); e.preventDefault(); }
});
addEventListener('hashchange', readHash);
const ro = new ResizeObserver(() => { map.resize(); cut.resize(); }); ro.observe($('#mapwrap')); ro.observe($('#cutwrap'));
/* split between the map and the slice: drag the handle */
{
  const stage = $('#stage'), setCut = p => { stage.style.setProperty('--cut', p + '%'); try { localStorage.setItem('slice-split', p); } catch { /* no storage */ } };
  try { const p = +localStorage.getItem('slice-split'); if (p >= 25 && p <= 80) stage.style.setProperty('--cut', p + '%'); } catch { /* no storage */ }
  $('#split').addEventListener('pointerdown', e => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const move = ev => { const r = stage.getBoundingClientRect(); setCut(Math.round(Math.min(80, Math.max(25, (r.bottom - ev.clientY) / r.height * 100)))); };
    e.currentTarget.addEventListener('pointermove', move);
    e.currentTarget.addEventListener('pointerup', () => e.currentTarget.removeEventListener('pointermove', move), { once: true });
  });
}

/* ---------- start ---------- */
let acc = 0, lastT = performance.now();
function loop(now) {
  const dt = Math.min(0.1, (now - lastT) / 1000); lastT = now;
  if (state.tween) {
    const t = state.tween, u = Math.min(1, (now - t.t) / t.dur), e = 1 - (1 - u) ** 3;
    setYear(Math.round(t.a + (t.b - t.a) * e)); if (u >= 1) state.tween = null;
  }
  if (trail.cur && state.playing) { if (now - trail.shownAt > 12000) { if (trail.i < trail.cur.stops.length - 1) goStop(trail.i + 1); else play(false); } }
  else if (state.playing) { acc += dt * 9; if (acc >= 1) { const n = Math.floor(acc); acc -= n; if (state.year + n >= T1) { setYear(T1); play(false); } else setYear(state.year + n, { reveal: true }); } }
  map.frame(now); cut.frame(now);
  requestAnimationFrame(loop);
}
cut.events = evs; cut.links = cutLinks;
setTheme(state.theme); map.resize(); cut.resize();
fetch(`${BASE}slice/base.json`).then(r => r.json()).then(b => map.setBase(b));
setYear(1500, { force: true });
if (location.hash.length > 1) readHash();
document.fonts.ready.then(() => { map.dirty = cut.dirty = true; });
requestAnimationFrame(loop);
/* the other maps load afterwards, one at a time, so changing the year never waits on the network */
(async () => { await ensureSlice(sliceFor(state.year)); for (const y of SLICES) await ensureSlice(y); })();
