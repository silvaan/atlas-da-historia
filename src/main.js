// Atlas: ties together terrain, period layers, travellers, the event network, camera and interface.
import '@fontsource/young-serif/400.css';
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import '@fontsource/jetbrains-mono/400.css';
import './style.css';
import * as THREE from 'three';
import { loadGrid, toUV, toLonLat, isWater, TERRAIN_NAMES } from './data/grid.js';
import { ERAS } from './data/eras.js';
import { THREAD, CHAPTERS, chapterAt, KINDS, LINK_TYPES, KEYFRAMES, EVENTS, LINKS, SOURCES, eraAt } from './data/history.js';
import { LANDMARKS } from './data/landmarks.js';
import { ANIMS } from './data/anims.js';
import { VOYAGES } from './data/voyages.js';
import { EMPIRE_COLORS, MISC } from './data/palette.js';
import { buildTerrain } from './world/terrain.js';
import { rasterEmpires, buildBorders, buildRivers, buildRoutes } from './world/overlays.js';
import { buildSettlements, cityList, groundY } from './world/settlements.js';
import { buildNature } from './world/nature.js';
import { buildAgents } from './world/agents.js';
import { buildLandmarks } from './world/landmarks.js';
import { buildAmbient } from './world/ambient.js';
import { FX } from './world/fx.js';
import { Voyages } from './world/voyages.js';
import { Pieces, Traffic } from './world/pieces.js';
import { FLOW } from './world/flowline.js';
import { bendScene, bendVec, facing } from './world/bend.js';
import { Globe } from './view/globe.js';
import { MapCamera, VIEWS, GLOBE_BELOW } from './view/camera.js';
import { DIVE_PPU } from './view/globe.js';
import { Labels } from './view/labels.js';
import { Network } from './view/network.js';
import { buildGraph, fmtYear, span } from './net/graph.js';
import { renderDetail } from './ui/detail.js';
import { Timeline } from './ui/timeline.js';
import { Guide } from './ui/guide.js';
import { renderPlace } from './ui/place.js';
import { Search } from './ui/search.js';
import { PLACES } from './data/places.js';
import { WORLD_PIECES, WORLD_CIVS } from './data/pieces.js';
import { GUIDES, GUIDE_ORDER } from './data/guides.js';
import { ScenePlayer } from './story/player.js';
import { SCENES } from './story/cabral.js';

const $ = s => document.querySelector(s);
const store = {
  get() { try { return JSON.parse(localStorage.getItem('atlas-state') || '{}'); } catch { return {}; } },
  set(v) { try { localStorage.setItem('atlas-state', JSON.stringify({ ...store.get(), ...v })); } catch { /* no storage */ } }
};

/* what appears from how many pixels per square */
const LOD = [
  { key: 'empires', label: 'Empires', min: 0 },
  { key: 'trees', label: 'Forests', min: 7 },
  { key: 'towns', label: 'Towns and villages', min: 5 },
  { key: 'travel', label: 'Carts and ships', min: 10 },
  { key: 'people', label: 'People', min: 40 }
];
const TINT = [[3, 0.78], [6, 0.55], [12, 0.3], [Infinity, 0.12]];   // empire colour is stronger from far away
const KIND_SHORT = { government: 'Governments', economy: 'Economy', conflict: 'Conflicts', ideas: 'Ideas', peoples: 'Peoples' };
const MODES = { thread: THREAD.title, 117: 'World in AD 117', 1279: 'World in 1279', 1914: 'World in 1914' };

async function main() {
  const host = $('#map');
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(MISC.sky);
  scene.add(new THREE.HemisphereLight('#FFF7EA', '#7C8A66', 1.5));
  const sun = new THREE.DirectionalLight('#FFF1DC', 1.35); sun.position.set(-0.45, 1, 0.3); scene.add(sun);

  const grid = await loadGrid(import.meta.env.BASE_URL + 'world.bin');
  const terrain = buildTerrain(grid), Y = terrain.Y;
  const nature = buildNature(grid, Y);
  const monuments = buildLandmarks(grid, Y, LANDMARKS);
  const ambient = buildAmbient(grid, Y, terrain.ocean);
  const fx = new FX(grid, Y, scene);
  scene.add(terrain.ocean, terrain.mesh, buildRivers(grid, Y), nature.group, monuments.group, ambient.group);

  const cam = new MapCamera(host, grid);
  const globe = new Globe(host, grid);
  const voyages = new Voyages(grid, Y, scene, $('#vlabels'));
  let globeOn = false, globeDirty = true, routesDirty = true, mapView = 'tilt', dive = null;
  const labels = new Labels($('#labels'));
  const graph = buildGraph(EVENTS, LINKS);
  const net = new Network($('#net'), graph, KINDS, id => select(id));
  // board pieces: one per event, monument and world landmark; the clickable marker sits next to the piece
  const pieces = new Pieces(grid, Y, { events: graph.order, kinds: KINDS, landmarks: LANDMARKS });
  pieces.hidden = net.hidden; scene.add(pieces.map); globe.scene.add(pieces.globe);
  const traffic = new Traffic(globe.scene);
  net.place(grid, Y, id => pieces.lonlat(id));

  let mode = null, era = null, pol = null, life = null, owner = null, tintLevel = -1, year = THREAD.min, sel = null, lmKey = '', chapter = null;

  /* ---------- the map of one year: borders (change per key map) and life (cities, roads, travellers; change year by year) ---------- */
  function dispose(obj) { obj.traverse(o => { o.geometry?.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m?.dispose()); }); obj.removeFromParent(); }
  function showEra(e) {
    const base = e.key || e;
    if (era !== base) showPolitics(base);
    showLife(e);
  }
  function showLife(e) {
    const sig = e.sig || e.label, houseSig = e.houseSig || '';
    if (life && life.sig === sig && life.houseSig === houseSig && life.era === (e.key || e)) return;
    const cities = cityList(e, grid);
    if (!life || life.sig !== sig || life.era !== (e.key || e)) {
      if (life) { dispose(life.routes.group); dispose(life.agents.group); }
      const routes = buildRoutes(grid, Y, e), agents = buildAgents(grid, Y, cities, routes.paths);
      scene.add(routes.group, agents.group);
      life = { ...life, routes, agents, sig, era: e.key || e, cities, regions: e.regions || [] };
      civs();
      globeDirty = routesDirty = true;   // the globe repaints only when cities, roads or routes change (not for every new house)
      relabel();
    }
    if (life.towns) dispose(life.towns.group);
    life.towns = buildSettlements(grid, Y, cities); life.houseSig = houseSig; scene.add(life.towns.group);
    ambient.setCities(cities, life.towns.list);
  }
  function relabel() {
    if (!pol || !life) return;
    const ly = mode === 'thread' ? year : +mode, list = monuments.visibleAt(ly).filter(m => m.p).map(m => { const [u, v] = toUV(...m.p); return { name: m.name, u, v, y: Math.max(0, Y[Math.floor(v) * grid.cols + Math.floor(u)]), major: m.major, ref: { key: 'lm:' + m.id, name: m.name, u, v } }; });
    for (const w of pieces.named()) list.push({ name: w.name, u: w.u, v: w.v, y: 0.1, major: w.civ, ref: w.ref });
    lmKey = list.map(m => m.name).join();
    labels.set(pol.emp.labels, life.cities, Y, grid, life.regions, list);
  }
  /* new monuments and landmarks this year: rebuild the labels */
  function relabelIfNeeded() {
    const ly = mode === 'thread' ? year : +mode;
    const key = monuments.visibleAt(ly).filter(m => m.p).map(m => m.name).concat(pieces.named().map(w => w.name)).join();
    if (key !== lmKey) relabel();
  }
  function showPolitics(e) {
    if (pol) dispose(pol.group);
    era = e;
    const emp = rasterEmpires(grid, era); owner = emp.owner;
    const borders = { wide: buildBorders(grid, owner, era, Y, 0.55, 0.9), thin: buildBorders(grid, owner, era, Y, 0.16) };
    const group = new THREE.Group(); group.add(borders.wide, borders.thin);
    scene.add(group);
    pol = { group, emp, borders }; globeDirty = true;
    civs();
    tintLevel = -1; retint();
    relabel();
    $('#era-caption').textContent = mode === 'thread' && chapter ? chapter.txt : era.caption;
    const list = $('#era-empires'); list.replaceChildren();
    const seen = new Set();
    // largest first; states with no territory on this map go last
    const far = p => { const l = emp.labels.find(x => x.name === p.name); return l ? -(l.size || 1) : 1e9; };
    [...era.empires].sort((a, b) => far(a) - far(b)).forEach(p => {
      if (seen.has(p.name)) return; seen.add(p.name);
      const lab = emp.labels.find(l => l.name === p.name);
      const b = document.createElement('button'); b.className = 'chip';
      b.innerHTML = `<i style="background:${EMPIRE_COLORS[p.c]}"></i>`; b.append(p.name);
      b.disabled = !lab; b.onclick = () => lab && (globeOn ? globe.lookAt(...toLonLat(lab.u, lab.v)) : cam.flyTo(lab.u, lab.v, Math.max(cam.ppu, 6)));
      list.append(b);
    });
    // many states (19th and 20th centuries): show the first ones and a button for the rest
    const chips = [...list.children];
    if (chips.length > 9) {
      chips.slice(8).forEach(c => { c.hidden = true; });
      const more = document.createElement('button'); more.className = 'chip more'; more.textContent = `+ ${chips.length - 8} more`;
      more.onclick = () => { chips.forEach(c => { c.hidden = false; }); more.remove(); };
      list.append(more);
    }
    $('#states-n').textContent = `(${seen.size})`; $('#states').hidden = !seen.size;
  }
  /* pawns for the states on the map (a little south of the name) and pieces for stateless peoples */
  function civs() {
    if (!pol) return;
    const list = pol.emp.labels.map(l => { const p = era.empires.find(x => x.name === l.name), [lon, lat] = toLonLat(l.u, l.v); return { name: l.name, lon, lat: lat - 1.6, color: EMPIRE_COLORS[p?.c ?? 0], size: l.size, model: 'pawn' }; });
    for (const [name, lon, lat] of life?.regions || []) list.push({ name, lon, lat: lat - 1.6, model: /hunter/.test(name) ? 'hunters' : 'village' });
    // toy armies inside each state (more for the larger ones), marching between two points of its territory
    const cells = era.empires.map(() => []), own = pol.emp.owner;
    for (let i = 0; i < own.length; i++) if (own[i] >= 0 && !isWater(grid.terr[i])) cells[own[i]].push(i);
    let seed = 1; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    cells.forEach((cs, k) => {
      const n = Math.max(0, Math.min(4, Math.round(Math.log2(cs.length / 30)))), picks = [], color = EMPIRE_COLORS[era.empires[k].c ?? 0];
      for (let tries = 0; picks.length < n && tries < 40; tries++) {
        const i = cs[Math.floor(rnd() * cs.length)], u = i % grid.cols + 0.5, v = Math.floor(i / grid.cols) + 0.5;
        if (picks.some(([a, b]) => Math.hypot(a - u, b - v) < 7)) continue;
        let to = null; for (let t = 0; t < 12 && !to; t++) { const j = cs[Math.floor(rnd() * cs.length)], u2 = j % grid.cols + 0.5, v2 = Math.floor(j / grid.cols) + 0.5, d = Math.hypot(u2 - u, v2 - v); if (d > 2.5 && d < 9) to = [u2, v2]; }
        picks.push([u, v]);
        const [lon, lat] = toLonLat(u, v);
        list.push({ name: era.empires[k].name, k: picks.length, lon, lat, color, model: 'army', walk: to });
      }
    });
    pieces.setCivs(list);
  }
  function retint() {
    const lvl = TINT.findIndex(([max]) => cam.ppu < max);
    if (lvl === tintLevel || !pol) return;
    tintLevel = lvl; terrain.tint(pol.emp.colorIdx, EMPIRE_COLORS, TINT[lvl][1]);
  }

  /* ---------- views: the Brazil thread or a sample period ---------- */
  const modeSelect = $('#mode');
  for (const [k, label] of Object.entries(MODES)) { const o = document.createElement('option'); o.value = k; o.textContent = label; modeSelect.append(o); }
  modeSelect.onchange = () => setMode(modeSelect.value);

  const timeline = new Timeline($('#timeline'), {
    chapters: CHAPTERS, events: graph.order, kinds: KINDS, keyframes: KEYFRAMES,
    onYear: y => onTimeline(y), onPick: id => select(id), onChapter: c => goChapter(c), onStep: d => step(d)
  });
  /* while the timeline plays by itself, each event it reaches pulses and gets a short animation on the spot (up to 4 at a time) */
  function onTimeline(y) {
    const prev = year; setYear(y);
    if (!timeline.playing || year <= prev) return;
    for (const e of graph.order) {
      if (e.y <= prev || e.y > year) continue;
      net.pulse(e.id);
      if (ANIMS[e.id] && fx.count < 4 && !net.hidden.has(e.k) && e.id !== sel) fx.play(e, ANIMS[e.id], { loop: false, key: 'tl-' + e.id });
    }
  }

  function setMode(m) {
    mode = m; modeSelect.value = m; store.set({ mode: m });
    const onThread = m === 'thread';
    document.body.classList.toggle('thread', onThread);
    $('#timeline').hidden = !onThread; $('#kinds').hidden = !onThread; document.querySelector('.chapter').classList.toggle('sample', !onThread); net.setVisible(onThread);
    for (const id of ['ch-list-h', 'ch-events']) $('#' + id).hidden = !onThread; document.querySelector('.ch-nav').hidden = !onThread;
    if (onThread) { setYear(year, true); }
    else {
      select(null); fx.stop(); showEra(ERAS[m]); relabel(); chapter = null; pieces.setYear(+m); traffic.setYear(+m); relabelIfNeeded();
      $('#ch-kicker').textContent = 'Sample period'; $('#ch-title').textContent = ERAS[m].label; $('#era-kicker').textContent = ''; $('#era-year').textContent = '';
    }
  }
  function setYear(y, force) {
    year = Math.min(THREAD.max, Math.max(THREAD.min, Math.round(y)));
    showEra(eraAt(year));
    if (force) relabel();
    $('#era-year').textContent = fmtYear(year);
    $('#era-kicker').textContent = '';
    const c = chapterAt(year);
    if (c !== chapter) renderChapter(c);
    net.year = year; net.chapter = [c.from, c.to]; timeline.set(year, sel); pieces.setYear(year); traffic.setYear(year); relabelIfNeeded();
    markChapter();
    if (!sel) history.replaceState(null, '', '#year=' + year);
  }

  /* ---------- chapter: title, events (clickable) and neighbouring chapters ---------- */
  const chList = $('#ch-events');
  function chapterEvents(c) { const last = c === CHAPTERS.at(-1); return graph.order.filter(e => (e.y < c.to || (last && e.y <= c.to)) && (e.y2 ?? e.y) >= c.from); }
  function renderChapter(c) {
    chapter = c;
    const i = CHAPTERS.indexOf(c);
    $('#ch-kicker').textContent = `Chapter ${i + 1} of ${CHAPTERS.length} · ${fmtYear(c.from)} – ${fmtYear(c.to)}`;
    $('#ch-title').textContent = c.title; $('#era-caption').textContent = c.txt;
    chList.replaceChildren();
    for (const e of chapterEvents(c)) {
      const li = document.createElement('li'), b = document.createElement('button');
      b.className = 'ch-ev'; b.dataset.id = e.id; b.dataset.k = e.k; b.style.setProperty('--c', KINDS[e.k].color);
      b.innerHTML = `<small>${span(e)}</small><i></i><span></span>`; b.lastChild.append(e.t); if (GUIDES[e.id]) b.lastChild.insertAdjacentHTML('beforeend', ' <span class="gd" title="Has a step-by-step guide">◆</span>');
      b.onclick = () => select(e.id);
      li.append(b); chList.append(li);
    }
    const prev = CHAPTERS[i - 1], next = CHAPTERS[i + 1], pb = $('#ch-prev'), nb = $('#ch-next');
    pb.textContent = prev ? '← ' + prev.short : ''; pb.disabled = !prev; pb.onclick = () => prev && goChapter(prev); pb.title = prev ? prev.title : '';
    nb.textContent = next ? next.short + ' →' : ''; nb.disabled = !next; nb.onclick = () => next && goChapter(next); nb.title = next ? next.title : '';
  }
  function markChapter() {
    if (!chapter) return;
    const tol = Math.max(2, (chapter.to - chapter.from) / 60);
    for (const b of chList.querySelectorAll('.ch-ev')) {
      const e = graph.byId.get(b.dataset.id), end = e.y2 ?? e.y;
      b.classList.toggle('future', year < e.y); b.classList.toggle('now', year >= e.y && year <= end + tol);
      b.classList.toggle('sel', e.id === sel); b.classList.toggle('off', net.hidden.has(e.k));
    }
  }
  /* open a chapter: the year jumps to its start and the view shows where things happen */
  function goChapter(c) {
    if (mode !== 'thread') setMode('thread');
    select(null); setYear(c.from);
    if (globeOn) globe.lookAt(c.focus[0], c.focus[1], 3.2);
    else { const ids = chapterEvents(c).map(e => e.id); if (ids.length) fitEvents(ids); }
  }
  /* previous / next event (arrow keys and timeline buttons) */
  function step(d) {
    const list = graph.order.filter(e => !net.hidden.has(e.k));
    let target;
    if (sel) { const i = list.findIndex(e => e.id === sel); target = list[i + d]; }
    else target = d > 0 ? list.find(e => e.y > year) || list.find(e => e.y >= year) : list.findLast(e => e.y < year);
    if (target) select(target.id);
  }

  /* ---------- selecting an event ---------- */
  const detail = $('#detail');
  const detailCtx = {
    graph, kinds: KINDS, types: LINK_TYPES, sources: SOURCES, scenes: SCENES,
    onPick: id => select(id), onClose: () => select(null),
    onZoom: e => { if (globeOn) setView(mapView, [...e.p, 8]); const [u, v] = toUV(...e.p); cam.flyTo(u, v, 40); },
    onScene: id => playScene(id), anims: ANIMS, voyages: VOYAGES, guides: GUIDES, onGuide: id => openGuide(id),
    onRoute: e => showRoute(e),
    onReplay: e => { dive = null; if (globeOn) setView(mapView); const h = animate(e); if (h) h.restart(); },
    onLinks: e => fitEvents([e.id, ...graph.neighbors(e.id)])
  };
  /* animation of the selected event, looping; the camera flies to it */
  let current = null;
  function animate(e, fly = true) {
    fx.stop(); current = null;
    const def = ANIMS[e.id]; if (!def) return null;
    current = fx.play(e, def, { loop: true, key: 'sel' });
    if (fly && current) {
      if (current.bounds) fitBox(current.bounds, current.ppu);
      else { const [u, v] = current.focus; flyFocus(u, v, current.ppu); }
    }
    return current;
  }
  let popping = false;
  function select(id, { fly = true } = {}) {
    if (guide.active && id !== guide.e.id) guide.close();
    if (id && place) { place = null; placeMark.hidden = true; }
    sel = id && graph.byId.has(id) ? id : null;
    net.sel = sel; pieces.sel = sel;
    document.body.classList.toggle('has-detail', !!sel);
    if (!sel) { place = null; placeMark.hidden = true; detail.hidden = true; timeline.set(year, null); markChapter(); if (!popping && !location.hash.startsWith('#year=')) history.pushState(null, '', '#year=' + year); fx.stop('sel'); voyages.clear(); dive = null; insets(); return; }
    const e = graph.byId.get(sel);
    if (mode !== 'thread') setMode('thread');
    setYear(Math.max(THREAD.min, e.y));
    renderDetail(detail, sel, detailCtx); detail.hidden = false; insets(); markChapter();
    if (location.hash !== '#' + sel) history.pushState(null, '', '#' + sel);
    net.lift = !!ANIMS[sel];
    voyages.show(sel, VOYAGES[sel]); dive = null;
    if (VOYAGES[sel]) { animate(e, false); if (fly) showRoute(e); }   // voyage: first the whole route, then the arrival up close
    else if (ANIMS[sel]) animate(e, fly);
    else if (fly) fitEvents([sel, ...graph.neighbors(sel)]);
  }
  /* show the whole voyage being drawn; when it ends, zoom down to the animation (if the user has not moved the map) */
  function showRoute(e) {
    voyages.show(e.id, VOYAGES[e.id]); voyages.replay();
    const b = voyages.bounds(); if (!b) return;
    fitBox(b, 6);
    if (!globeOn && ANIMS[e.id]) dive = { at: performance.now() + (voyages.duration + 1.4) * 1000, since: performance.now() + 50, id: e.id };
  }
  /* centre a point in the free area between the panels */
  function flyFocus(u, v, ppu) {
    if (globeOn) { const [lon, lat] = toLonLat(u, v); globe.lookAt(lon, lat, Math.min(globe.goal.dist, 2.6)); return; }
    const az = cam.goal.az, ca = Math.cos(az), sa = Math.sin(az), tilt = Math.cos(cam.goal.polar), w = host.clientWidth, h = host.clientHeight, wide = w > 760;
    const a = u * ca - v * sa, b = u * sa + v * ca + (wide ? 0 : h * 0.22) / (ppu * tilt);
    cam.flyTo(a * ca + b * sa, -a * sa + b * ca, ppu);
  }
  function fitBox([u0, v0, u1, v1], maxPpu = 14) {
    if (globeOn) { const [lon, lat] = toLonLat((u0 + u1) / 2, (v0 + v1) / 2), span = Math.max(u1 - u0, (v1 - v0) * 1.4) * 0.5; globe.lookAt(lon, lat, 1.35 + span / 55); return; }
    const ids = [[u0, v0], [u1, v0], [u0, v1], [u1, v1]];
    const az = cam.goal.az, ca = Math.cos(az), sa = Math.sin(az), tilt = Math.cos(cam.goal.polar);
    let a0 = Infinity, b0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const [u, v] of ids) { const a = u * ca - v * sa, b = u * sa + v * ca; a0 = Math.min(a0, a); a1 = Math.max(a1, a); b0 = Math.min(b0, b); b1 = Math.max(b1, b); }
    const w = host.clientWidth, h = host.clientHeight, wide = w > 760, freeW = wide ? w - 2 * 400 : w - 40, freeH = wide ? h - 240 : h * 0.38;
    const fit = Math.min(freeW / (a1 - a0 + 2), freeH / ((b1 - b0 + 2) * tilt));
    if (fit < GLOBE_BELOW) { setView('globe'); return fitBox([u0, v0, u1, v1], maxPpu); }
    const ppu = Math.min(maxPpu, fit);
    const ac = (a0 + a1) / 2, bc = (b0 + b1) / 2 + (wide ? 0 : h * 0.22) / (ppu * tilt);
    cam.flyTo(ac * ca + bc * sa, -ac * sa + bc * ca, ppu);
  }
  /* frame an event and its neighbours in the free area between the panels */
  function fitEvents(ids) {
    if (globeOn) { const pts = ids.map(id => toUV(...graph.byId.get(id).p)), u = pts.reduce((a, p) => a + p[0], 0) / pts.length, v = pts.reduce((a, p) => a + p[1], 0) / pts.length; const [lon, lat] = toLonLat(u, v); globe.lookAt(lon, lat, Math.min(globe.goal.dist, 2.8)); return; }
    // work in screen axes (the isometric view rotates the map): a = right, b = down on the ground
    const az = cam.goal.az, ca = Math.cos(az), sa = Math.sin(az), tilt = Math.cos(cam.goal.polar);
    let a0 = Infinity, b0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const id of ids) {
      const [u, v] = toUV(...graph.byId.get(id).p), a = u * ca - v * sa, b = u * sa + v * ca;
      a0 = Math.min(a0, a); a1 = Math.max(a1, a); b0 = Math.min(b0, b); b1 = Math.max(b1, b);
    }
    const w = host.clientWidth, h = host.clientHeight, wide = w > 760;
    const freeW = wide ? w - 2 * 400 : w - 40, freeH = wide ? h - 240 : h * 0.38;
    const fit = Math.min(freeW / (a1 - a0 + 8), freeH / ((b1 - b0 + 8) * tilt));
    if (fit < GLOBE_BELOW) { setView('globe'); return fitEvents(ids); }
    const ppu = Math.min(14, fit);
    // on phones the info card covers the top: shift the centre down on screen
    const ac = (a0 + a1) / 2, bc = (b0 + b1) / 2 - (wide ? 20 : -h * 0.22) / (ppu * tilt);
    cam.flyTo(ac * ca + bc * sa, -ac * sa + bc * ca, ppu);
  }

  /* ---------- scenes ---------- */
  const player = new ScenePlayer($('#scene'), $('#scene-layer'), { grid, Y, scene, cam, setView: k => setView(k) });
  function playScene(id) {
    const def = SCENES[id]; if (!def) return;
    if (globeOn) setView(mapView);
    timeline.stop(); detail.hidden = true; net.setVisible(false); fx.stop(); voyages.clear(); dive = null;
    setYear(graph.byId.get(id).y);
    const before = cam.view;
    player.start(def, () => { setView(before); net.setVisible(mode === 'thread'); select(id); });
  }

  /* ---------- step-by-step guides ---------- */
  // world: always on the globe; continent: in whatever view is active; region and close: on the map
  const GUIDE_ZOOM = { world: [3.6, 0], continent: [0, 6.5], region: [0, 13], close: [0, 34] };   // [globe distance (0 = the minimum), map zoom]
  const guide = new Guide($('#guide'), $('#guide-layer'), {
    kinds: KINDS, graph,
    onStep: s => guideStep(s),
    onClose: () => { document.body.classList.remove('has-guide'); fx.stop('guide'); if (sel) { detail.hidden = false; renderDetail(detail, sel, detailCtx); } insets(); },
    onPick: id => select(id)
  });
  function openGuide(id) {
    const steps = GUIDES[id]; if (!steps) return;
    if (player.active) return;
    if (sel !== id) select(id, { fly: false });
    timeline.stop(); fx.stop(); voyages.clear(); dive = null; current = null;
    detail.hidden = true; document.body.classList.add('has-guide');
    guide.open(graph.byId.get(id), steps); insets();
  }
  function guideStep(s) {
    setYear(s.y);
    if (s.ev) net.pulse(s.ev);
    const z = s.zoom in GUIDE_ZOOM ? s.zoom : 'region', [dist, ppu] = GUIDE_ZOOM[z], [u, v] = toUV(...s.p);
    if (z === 'world' && !globeOn) setView('globe');
    if ((z === 'region' || z === 'close') && globeOn) setView(mapView, [...s.p, ppu]);
    if (globeOn) globe.lookAt(s.p[0], s.p[1], dist || globe.rMin * 1.05); else flyFocus(u, v, ppu);
    // a step that is another event with an animation: play it once on the spot (map only, up close)
    fx.stop('guide');
    const ev = s.ev && graph.byId.get(s.ev);
    if (ev && ANIMS[ev.id] && !globeOn) fx.play(ev, ANIMS[ev.id], { loop: false, key: 'guide' });
  }
  const guideProject = (lon, lat) => {
    const [u, v] = toUV(lon, lat);
    return globeOn ? globe.project(u, v, host.clientWidth, host.clientHeight) : mapProject(u, groundY(grid, Y, u, v) + 0.3, v);
  };
  /* list of guides in the chapter panel */
  {
    const box = document.createElement('details'); box.className = 'guides'; box.id = 'guides';
    box.innerHTML = `<summary>Step-by-step guides <b>(${GUIDE_ORDER.length})</b></summary><ol></ol>`;
    const ol = box.querySelector('ol');
    for (const id of GUIDE_ORDER) {
      const e = graph.byId.get(id); if (!e) continue;
      const li = document.createElement('li'), b = document.createElement('button');
      b.innerHTML = `<small>${fmtYear(e.y)}</small>`; b.append(e.t); b.onclick = () => openGuide(id);
      li.append(b); ol.append(li);
    }
    $('#states').before(box);
  }

  /* ---------- legend of event types (also filters) ---------- */
  const kinds = $('#kinds');
  for (const [k, v] of Object.entries(KINDS)) {
    const b = document.createElement('button'); b.className = 'kind-btn'; b.style.setProperty('--c', v.color); b.setAttribute('aria-pressed', 'true');
    b.innerHTML = '<i></i>'; b.append(KIND_SHORT[k] || v.label); b.title = v.label;
    b.onclick = () => { const off = net.hidden.has(k); if (off) net.hidden.delete(k); else net.hidden.add(k); b.setAttribute('aria-pressed', String(off)); markChapter(); pieces.setYear(year); };
    kinds.append(b);
  }

  /* ---------- views and zoom ---------- */
  const views = $('#views');
  for (const [k, v] of Object.entries({ ...VIEWS, globe: { label: 'Globe' } })) {
    const b = document.createElement('button'); b.dataset.view = k; b.textContent = v.label;
    b.onclick = () => setView(k); views.append(b);
  }
  /* switch globe ↔ map with a short crossfade: the last frame of the outgoing view fades out over the new one */
  const fadeRT = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  const fadeMat = new THREE.MeshBasicMaterial({ map: fadeRT.texture, transparent: true, depthTest: false, depthWrite: false, toneMapped: false });
  const fadeScene = new THREE.Scene(), fadeCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  fadeScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fadeMat));
  let fadeT = 0, frames = 0;
  function snapshot() {
    const v = renderer.getDrawingBufferSize(new THREE.Vector2()); fadeRT.setSize(v.x, v.y);
    renderer.setRenderTarget(fadeRT);
    if (globeOn) globe.render(renderer); else { bendScene(scene, cam.ppu); renderer.render(scene, cam.cam); }
    renderer.setRenderTarget(null); fadeT = performance.now() + 550;
  }
  function drawFade(dt) {
    const left = fadeT - performance.now(); if (left <= 0) return;
    fadeMat.opacity = (left / 550) ** 1.5;
    renderer.autoClear = false; renderer.render(fadeScene, fadeCam); renderer.autoClear = true;
  }
  function setView(k, at) {
    if ((k === 'globe') !== globeOn && frames > 2) snapshot();
    if (k === 'globe') {
      if (!globeOn) { if (at) globe.enter(at[0], at[1], cam.ppu, at[2]); else { const [lon, lat] = toLonLat(cam.cur.tx, cam.cur.tz); globe.enter(lon, lat, cam.ppu); } }
      globeOn = true; cam.enabled = false; dive = null;
    } else {
      if (globeOn) {
        // back to the map at the point the globe is showing
        const [lon, lat, ppu] = at || [...globe.center, Math.max(DIVE_PPU, globe.ppu)], [u, v] = toUV(lon, lat);
        cam.cur.tx = cam.goal.tx = u; cam.cur.tz = cam.goal.tz = v; cam.cur.ppu = Math.max(GLOBE_BELOW, globe.ppu); cam.goal.ppu = ppu;
        cam.setView(k); cam.cur.polar = cam.goal.polar; cam.cur.az = cam.goal.az; cam.apply();
      }
      globeOn = false; globe.active = false; cam.enabled = true; mapView = k; globe.maxTilt = VIEWS[k].polar;
      cam.setView(k);
    }
    document.body.classList.toggle('globe', globeOn);
    for (const b of views.querySelectorAll('button')) b.setAttribute('aria-pressed', b.dataset.view === k);
    $('#rotate').hidden = k === 'top' || k === 'globe';
    insets(true);
  }
  /* the globe stays centred in the free space between the chapter panel and the info card */
  function insets(now) {
    const w = host.clientWidth; if (w <= 760) { globe.setInsets(0, 0, now); return; }
    const L = $('#side').getBoundingClientRect().right, pan = guide.active ? $('#guide') : detail, R = pan.hidden ? 0 : w - pan.getBoundingClientRect().left;
    globe.setInsets(L * 0.9, R * 0.9, now);
  }
  cam.onOutLimit = () => setView('globe');
  globe.onDive = (lon, lat, ppu) => setView(mapView, [lon, lat, ppu]);
  $('#rot-l').onclick = () => cam.rotate(-Math.PI / 2);
  $('#rot-r').onclick = () => cam.rotate(Math.PI / 2);
  $('#home').onclick = () => { if (!globeOn) setView('globe'); globe.lookAt(globe.cur.lon, 10, 3.6); };
  $('#zoom-in').onclick = () => globeOn ? (globe.goal.dist <= globe.rMin * 1.03 ? globe.onDive(...globe.center, DIVE_PPU) : (globe.goal.dist = Math.max(globe.rMin, 1 + (globe.goal.dist - 1) / 1.6))) : cam.flyTo(cam.goal.tx, cam.goal.tz, cam.goal.ppu * 1.8);
  $('#zoom-out').onclick = () => globeOn ? (globe.goal.dist = Math.min(7, 1 + (globe.goal.dist - 1) * 1.6)) : (cam.goal.ppu <= GLOBE_BELOW * 1.3 ? setView('globe') : cam.flyTo(cam.goal.tx, cam.goal.tz, cam.goal.ppu / 1.8));
  window.addEventListener('keydown', e => {
    if (e.target.closest?.('input, textarea, select')) return;
    const v = { 1: 'top', 2: 'tilt', 3: 'iso', 4: 'globe' }[e.key]; if (v) setView(v);
    if (player.active || mode !== 'thread') return;
    const ci = CHAPTERS.indexOf(chapterAt(year));
    if (guide.active && (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Escape')) { e.preventDefault(); guide.stopAuto(); if (e.key === 'Escape') guide.close(); else guide.go(guide.i + (e.key === 'ArrowRight' ? 1 : -1)); return; }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !e.shiftKey) { e.preventDefault(); timeline.stop(); step(e.key === 'ArrowRight' ? 1 : -1); }
    if ((e.key === 'ArrowRight' && e.shiftKey) || e.key === 'PageDown') { e.preventDefault(); if (CHAPTERS[ci + 1]) goChapter(CHAPTERS[ci + 1]); }
    if ((e.key === 'ArrowLeft' && e.shiftKey) || e.key === 'PageUp') { e.preventDefault(); if (CHAPTERS[ci - 1]) goChapter(CHAPTERS[ci - 1]); }
    if (e.key === 'Escape' && !player.active) { if (place) closePlace(); else select(null); }
  });

  // usage hint: disappears on the first interaction
  const hint = $('#hint'), hideHint = () => hint.classList.add('gone');
  host.addEventListener('pointerdown', hideHint, { once: true }); window.addEventListener('keydown', hideHint, { once: true }); setTimeout(hideHint, 15000);

  /* what is under the cursor */
  const tip = $('#tip'), gp = new THREE.Vector3();
  /* ---------- clickable places: labels and board pieces ---------- */
  function pieceRef(it) {
    const d = it.d, base = { name: d.name, u: it.u, v: it.v };
    if (d.ev) return { ev: d.ev.id, name: d.ev.t };
    if (d.evId) return { ev: d.evId, name: d.name };
    if (d.landmark) return { ...base, key: 'lm:' + d.opts.id };
    if (d.key.startsWith('w-')) return { ...base, key: 'wp:' + d.key.slice(2) };
    if (d.state) return { ...base, key: (d.region ? 'reg:' : 'st:') + d.name };
    return { ...base, key: 'civ:' + d.name };
  }
  function pickAt(x, y) {
    const w = host.clientWidth, h = host.clientHeight;
    let ref = labels.pick(x, y);
    if (!ref) { const it = pieces.pick(globeOn ? it => globe.project(it.u, it.v, w, h) : it => mapProject(it.u, it.y + 0.4, it.v), x, y, globeOn); if (it) ref = pieceRef(it); }
    return ref || labels.pick(x, y, true);
  }
  const KIND_COLOR = { lm: '#D8CDB4', wp: '#9AA6B8', civ: '#F2B544', st: '#F2B544', city: '#FFF1C9', reg: '#2E9E6E' };
  const KIND_LABEL = { lm: 'Monument', wp: 'Landmark', civ: 'State or people', st: 'State on this map', city: 'City', reg: 'Stateless peoples' };
  function placeInfo(ref) {
    const i = ref.key.indexOf(':'), kind = ref.key.slice(0, i), id = ref.key.slice(i + 1);
    const data = PLACES[ref.key] || PLACES['st:' + ref.name] || PLACES['civ:' + ref.name] || PLACES['city:' + ref.name] || null;
    const [lon, lat] = toLonLat(ref.u, ref.v);
    let title = ref.name, period = '';
    const range = (a, b) => b == null ? `since ${fmtYear(a)}` : `${fmtYear(a)} – ${fmtYear(b)}`;
    if (kind === 'lm') { const lm = LANDMARKS.find(l => l.id === id); if (lm) { title = lm.name; period = `completed in ${fmtYear(lm.built)}` + (lm.ruin != null ? ` · in ruins since ${fmtYear(lm.ruin)}` : lm.gone != null ? ` · destroyed in ${fmtYear(lm.gone)}` : ''); } }
    else if (kind === 'wp') { const w = WORLD_PIECES.find(x => x[0] === id); if (w) { title = w[1]; period = range(w[3], w[4]); } }
    else if (kind === 'civ') { const c = WORLD_CIVS.filter(x => x[0] === id).find(x => year >= x[2] && (x[3] == null || year <= x[3])) || WORLD_CIVS.find(x => x[0] === id); if (c) period = range(c[2], c[3]); }
    else period = `on the map of ${fmtYear(year)}`;
    const linked = (data?.ev || []).map(id => graph.byId.get(id)).filter(Boolean);
    const kx = Math.cos(lat * Math.PI / 180), dist = e => Math.hypot((e.p[0] - lon) * kx, e.p[1] - lat);
    const near = graph.order.filter(e => !linked.includes(e) && dist(e) < 6).sort((a, b) => dist(a) - dist(b)).slice(0, 5).sort((a, b) => a.y - b.y);
    return { key: ref.key, title, period, txt: data?.txt, label: KIND_LABEL[kind] || 'Place', color: KIND_COLOR[kind] || '#F2B544', linked, near, lon, lat, u: ref.u, v: ref.v };
  }
  let place = null;
  const placeMark = document.createElement('div'); placeMark.className = 'place-mark'; placeMark.hidden = true; document.body.append(placeMark);
  const placeCtx = {
    kinds: KINDS, guides: GUIDES, onPick: id => select(id), onClose: () => closePlace(),
    onZoom: info => { if (globeOn) setView(mapView, [info.lon, info.lat, 20]); else flyFocus(info.u, info.v, Math.max(cam.ppu, 20)); }
  };
  function openPlace(ref) {
    if (ref.ev) { select(ref.ev); return; }
    if (!popping && location.hash !== '#place=' + ref.key) history.pushState(null, '', '#place=' + encodeURIComponent(ref.key));
    if (sel) select(null);
    if (guide.active) guide.close();
    place = placeInfo(ref);
    renderPlace(detail, place, placeCtx); detail.hidden = false; document.body.classList.add('has-detail'); insets();
    placeMark.hidden = false;
  }
  function closePlace() { if (!place) return; place = null; placeMark.hidden = true; if (!sel) { detail.hidden = true; document.body.classList.remove('has-detail'); insets(); } }
  /* place key → reference with position (for search and the page address) */
  function refFromKey(key) {
    const i = key.indexOf(':'), kind = key.slice(0, i), id = key.slice(i + 1), at = (lon, lat, name) => { const [u, v] = toUV(lon, lat); return { key, name, u, v }; };
    if (kind === 'lm') { const l = LANDMARKS.find(x => x.id === id); return l?.p && at(...l.p, l.name); }
    if (kind === 'wp') { const w = WORLD_PIECES.find(x => x[0] === id); return w && at(...w[2], w[1]); }
    if (kind === 'civ') { const c = WORLD_CIVS.filter(x => x[0] === id), m = c.find(x => year >= x[2] && (x[3] == null || year <= x[3])) || c[0]; return m && at(...m[1], id); }
    if (kind === 'st') { const l = pol?.emp.labels.find(x => x.name === id); return l && { key, name: id, u: l.u, v: l.v }; }
    if (kind === 'city') { const c = eraAt(year).cities?.find(x => x[0] === id) || KEYFRAMES.flatMap(k => k.cities || []).find(x => x[0] === id); return c && at(c[1], c[2], id); }
    if (kind === 'reg') { const r = eraAt(year).regions?.find(x => x[0] === id) || KEYFRAMES.flatMap(k => k.regions || []).find(x => x[0] === id); return r && at(r[1], r[2], id); }
    return null;
  }
  /* go to a place (in a year when it exists) and open its info card */
  function goPlace(key, y) {
    if (y != null) { if (mode !== 'thread') setMode('thread'); select(null); setYear(y); }
    const ref = refFromKey(key); if (!ref) return;
    const [lon, lat] = toLonLat(ref.u, ref.v);
    if (globeOn) globe.lookAt(lon, lat, Math.min(globe.goal.dist, 3)); else flyFocus(ref.u, ref.v, Math.max(cam.ppu, 8));
    openPlace(ref);
  }
  {
    const items = [], seen = new Set(), add = it => { const k = it.kind + it.title; if (seen.has(k)) return; seen.add(k); items.push(it); };
    for (const id of GUIDE_ORDER) { const e = graph.byId.get(id); if (e) add({ kind: 'guide', type: 'Guide', title: e.t, sub: `${span(e)} · ${GUIDES[id].length} steps`, rank: 6, go: () => openGuide(id) }); }
    CHAPTERS.forEach((c, i) => add({ kind: 'chapter', type: 'Chapter', title: c.title, alt: c.short, sub: `${i + 1} · ${fmtYear(c.from)} – ${fmtYear(c.to)}`, rank: 8, go: () => goChapter(c) }));
    for (const e of graph.order) add({ kind: 'event', type: 'Event', title: e.t, alt: e.place, sub: `${span(e)} · ${e.place}`, rank: 5, go: () => select(e.id) });
    const inYear = (a, b) => year >= a && (b == null || year < b) ? null : a;
    for (const l of LANDMARKS) if (l.p) add({ kind: 'landmark', type: 'Monument', title: l.name, sub: `completed in ${fmtYear(l.built)}`, rank: 4, go: () => goPlace('lm:' + l.id, inYear(l.built, l.gone)) });
    for (const [id, name, , from, to] of WORLD_PIECES) add({ kind: 'marker', type: 'Landmark', title: name, sub: fmtYear(from), rank: 3, go: () => goPlace('wp:' + id, inYear(from, to)) });
    for (const [name, , from, to] of WORLD_CIVS) add({ kind: 'state', type: 'State', title: name, sub: to == null ? `since ${fmtYear(from)}` : `${fmtYear(from)} – ${fmtYear(to)}`, rank: 3, go: () => goPlace('civ:' + name, inYear(from, to)) });
    for (const k of KEYFRAMES) {
      for (const e of k.empires || []) add({ kind: 'state', type: 'State', title: e.name, sub: `on the map of ${fmtYear(k.from)}`, rank: 2, go: () => goPlace('st:' + e.name, k.from) });
      for (const [name] of k.cities || []) add({ kind: 'city', type: 'City', title: name, sub: `appears in ${fmtYear(k.from)}`, rank: 2, go: () => goPlace('city:' + name, k.from) });
      for (const [name] of k.regions || []) add({ kind: 'people', type: 'Peoples', title: name, sub: `appears in ${fmtYear(k.from)}`, rank: 1, go: () => goPlace('reg:' + name, k.from) });
    }
    new Search($('#search'), $('#search-btn'), { items, onYear: y => { if (mode !== 'thread') setMode('thread'); select(null); setYear(y); const c = chapterAt(year); if (globeOn) globe.lookAt(c.focus[0], c.focus[1]); } });
  }
  /* browser back and forward: the address stores the selected event or the year */
  window.addEventListener('popstate', () => {
    const h = decodeURIComponent(location.hash.slice(1)), y = /^year=(-?\d+)$/.exec(h);
    popping = true;
    if (graph.byId.has(h)) select(h);
    else if (h.startsWith('place=')) { const r = refFromKey(h.slice(6)); if (r) openPlace(r); }
    else { if (guide.active) guide.close(); closePlace(); select(null); if (y) setYear(+y[1]); }
    popping = false;
  });

  // click without dragging = pick what is under the cursor
  let down = null;
  host.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  host.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5 || performance.now() - down.t > 500) return;
    const ref = pickAt(e.clientX, e.clientY); if (ref) openPlace(ref);
  });

  host.addEventListener('pointermove', e => {
    if (cam.pointers.size || globe.pointers.size) { tip.hidden = true; return; }
    const hit = pickAt(e.clientX, e.clientY);
    host.style.cursor = hit ? 'pointer' : '';
    if (hit) {
      tip.innerHTML = `<b>${hit.name}</b><span>click to see its history</span>`;
      tip.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 16}px)`; tip.hidden = false; return;
    }
    if (globeOn) { tip.hidden = true; return; }
    const p = cam.groundAt(e.clientX, e.clientY, gp);
    const c = p ? Math.floor(p.x) : -1, r = p ? Math.floor(p.z) : -1;
    if (c < 0 || r < 0 || c >= grid.cols || r >= grid.rows) { tip.hidden = true; return; }
    const i = r * grid.cols + c, [lon, lat] = toLonLat(c + 0.5, r + 0.5), t = grid.terr[i];
    const who = owner && owner[i] >= 0 ? era.empires[owner[i]].name : (isWater(t) ? '' : 'outside the states on this map');
    tip.innerHTML = `<b>${TERRAIN_NAMES[t]}</b>${who ? ' · ' + who : ''}<span>${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}</span>`;
    tip.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 16}px)`; tip.hidden = false;
  });
  host.addEventListener('pointerleave', () => { tip.hidden = true; });
  host.addEventListener('pointerdown', () => { tip.hidden = true; });

  /* scale: 1 square = 0.5° ≈ 55.6 km (at the equator) */
  const scaleBar = $('#scale-bar'), scaleText = $('#scale-text');
  function updateScale(ppu) {
    const kmPerPx = 55.6 / ppu, target = 110 * kmPerPx;
    const nice = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000].reduce((a, b) => Math.abs(b - target) < Math.abs(a - target) ? b : a);
    scaleBar.style.width = nice / kmPerPx + 'px'; scaleText.textContent = nice + ' km';
  }

  window.addEventListener('resize', () => { renderer.setSize(host.clientWidth, host.clientHeight); cam.resize(); cam.apply(); insets(true); globe.resize(); if (globeOn) globe.apply(); });

  /* ---------- initial state: the globe at the start of the thread (the hunter-gatherers), or whatever the address asks for ---------- */
  mapView = 'tilt';
  const [ru, rv] = toUV(-52, -12); cam.cur.tx = cam.goal.tx = ru; cam.cur.tz = cam.goal.tz = rv;
  cam.cur.ppu = cam.goal.ppu = 7;
  cam.setView(mapView); cam.apply();
  const hash = decodeURIComponent(location.hash.slice(1)), hashYear = /^year=(-?\d+)$/.exec(hash);
  setMode('thread');
  setYear(hashYear ? +hashYear[1] : THREAD.min, true);
  const c0 = chapterAt(year);
  setView('globe', [c0.focus[0] - 6, c0.focus[1] + 6, 4.1]);
  globe.goal.dist = 3.5;
  if (graph.byId.has(hash)) select(hash);
  else if (hash.startsWith('place=')) goPlace(hash.slice(6));
  $('#loading').remove();
  if (import.meta.env.DEV) window.atlas = { guide, openGuide, pickAt, openPlace, goPlace, pieces, cam, scene, renderer, grid, setView, setYear, select, playScene, player, graph, fx, eraAt, timeline, globe, voyages };

  let last = performance.now();
  const pv = new THREE.Vector3();
  const camDir = new THREE.Vector3();
  const mapProject = (u, y, v) => { bendVec(pv.set(u, y, v)); if (!facing(pv, camDir)) return null; pv.project(cam.cam); return [(pv.x * 0.5 + 0.5) * host.clientWidth, (-pv.y * 0.5 + 0.5) * host.clientHeight]; };
  const globeProject = (u, y, v) => globe.project(u, v, host.clientWidth, host.clientHeight);
  function placeMarkAt() {
    if (!place) return;
    const p = guideProject(place.lon, place.lat); placeMark.style.visibility = p ? '' : 'hidden';
    if (p) placeMark.style.transform = `translate(${p[0].toFixed(1)}px, ${p[1].toFixed(1)}px)`;
  }
  renderer.setAnimationLoop(now => {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; frames++;
    FLOW.time.value += dt;
    timeline.tick(dt);
    player.tick(dt); guide.tick(dt);
    const w = host.clientWidth, h = host.clientHeight;
    if (globeOn) {
      globe.tick(dt);
      if (globeDirty) { globe.paint(pol.emp.colorIdx, pol.emp.owner, life.cities, pol); globeDirty = false; }
      if (routesDirty) { globe.setRoutes(life.routes.paths); traffic.setLanes(life.routes.paths.lane, grid); routesDirty = false; }
      const ppu = globe.ppu;
      voyages.tick(dt, ppu, globeProject, w, h, false);
      globe.syncVoyages(voyages); globe.placeShip(voyages); pieces.tickGlobe(globe); traffic.tick(dt, globe);
      updateScale(ppu);
      net.update(globeProject, w, h); guide.place(guideProject); placeMarkAt();
      labels.update(globeProject, ppu, w, h, net.boxes);
      globe.render(renderer); drawFade(dt);
      return;
    }
    cam.tick(dt);
    const ppu = cam.ppu, on = k => ppu >= LOD.find(l => l.key === k).min;
    FLOW.ppu.value = ppu;
    nature.trees.forEach(m => { m.visible = on('trees'); });
    life.towns.houses.forEach(m => { m.visible = on('towns'); });
    life.towns.fields.visible = ppu >= 8;
    pol.borders.wide.visible = ppu < 10; pol.borders.thin.visible = ppu >= 10;
    life.agents.update(dt, { travel: on('travel'), people: on('people') });
    const ly = mode === 'thread' ? year : +mode;
    monuments.update(ly, ppu); pieces.tickMap(ppu, !!current);

    ambient.update(dt, cam);
    fx.tick(dt, ppu);
    voyages.tick(dt, ppu, mapProject, w, h, true);
    // route finished drawing: zoom down to the arrival, unless the user has already moved the map
    if (dive && now >= dive.at) {
      if (cam.touched < dive.since && current && sel === dive.id) { if (current.bounds) fitBox(current.bounds, current.ppu); else flyFocus(current.focus[0], current.focus[1], current.ppu); }
      dive = null;
    }
    retint();
    updateScale(ppu);
    cam.cam.getWorldDirection(camDir);
    net.update(mapProject, w, h); guide.place(guideProject); placeMarkAt();
    labels.update(mapProject, ppu, w, h, net.boxes);
    cam.cam.getWorldDirection(camDir); bendScene(scene, ppu);
    renderer.render(scene, cam.cam); drawFade(dt);
  });
}

main().catch(err => { console.error(err); const l = $('#loading'); if (l) l.textContent = 'Could not load the map: ' + err.message; });
