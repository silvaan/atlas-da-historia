// Trails: a topic told in stops, each with a year, a place, a map distance and a short text.
// Stops are grouped into acts (before, the event, after). Each stop can ask to highlight a power
// (look) and bring a question to think about (q).
//
// The Minas Conspiracy trail is written by hand. The others come from the Atlas guides (src/data/guides.js):
// the guide's steps become the middle act, and the links in the event network give the "before" and the "after".
import { GUIDES, GUIDE_ORDER } from '../data/guides.js';
import { T0, T1 } from './pop.js';
import { regionAt } from './regions.js';

const G = GUIDES.minasconspiracy;
const VILA_RICA = [-43.5, -20.39], RIO = [-43.18, -22.9];

const CURATED = {
  minasconspiracy: {
    title: 'Minas Conspiracy (Inconfidência Mineira)',
    question: 'Why did rich men in Minas plot a republic in 1789, and why did it never leave the page?',
    home: 'la',
    acts: [
      { t: 'Roots', stops: [
        { y: 1695, p: VILA_RICA, zoom: 'region', place: 'Minas Gerais', ev: 'gold', look: { power: 'pt' }, t: 'The gold rush',
          txt: 'In the 1690s, bandeirantes (frontier expeditionaries) from São Paulo found gold in the streams of the Espinhaço range. People from Portugal and from other captaincies rushed to the mines, and with them came tens of thousands of enslaved Africans. In 1711, the mining camp of Vila Rica became a town.' },
        { y: 1720, p: VILA_RICA, zoom: 'close', place: 'Vila Rica', t: 'The revolt of 1720',
          txt: 'In 1720, the people of Vila Rica rose up against the smelting houses, where all gold would have to be melted down and "fifthed": a fifth of it taken by the crown, the quinto (the royal fifth). The governor, the Count of Assumar, crushed the revolt and had Filipe dos Santos executed. That same year, Minas became a captaincy separate from São Paulo, watched more closely.',
          q: 'Seventy years before the conspiracy, the conflict was already the same. What was it?' },
        { y: 1750, p: [-9.14, 38.71], zoom: 'continent', place: 'Lisbon', look: { power: 'pt' }, t: 'The 100-arroba quota',
          txt: 'In 1750, the crown set a quota: Minas had to deliver at least 100 arrobas of gold a year, about 1,500 kilos. If the quota was not met, the shortfall would be collected all at once from the whole population, in a derrama (a forced levy). While gold was plentiful, the quota was paid.' },
        { y: 1763, p: RIO, zoom: 'region', place: 'Rio de Janeiro', t: 'Gold falls, Rio rises',
          txt: 'Gold output passed its peak around 1750 and began to fall. In 1763, the capital of Brazil moved from Salvador to Rio de Janeiro, the port the gold left through. In the years that followed the quota was no longer met, and the debt Minas owed the crown kept growing.' },
        { ...G[0], place: 'Philadelphia', look: { power: 'us' } },
        { y: 1780, p: [-71.4, -14.15], zoom: 'continent', place: 'Andes', ev: 'tupacamaru', look: { power: 'es' }, t: 'In the Andes, a revolt against taxes',
          txt: 'In 1780, in the Viceroyalty of Peru, the Indigenous chief Túpac Amaru II rose up against new taxes and the abuses of the Spanish corregidores (district officials). The revolt spread through the Andes and was crushed; he was executed in Cusco in 1781. In the same decade, both Iberian crowns were tightening their grip on their colonies.',
          q: 'In Cusco the revolt came from below, from Indigenous people; in Minas it would come from above. What changes?' },
        { ...G[1], place: 'Minas Gerais' },
        { ...G[2], place: 'Nîmes', look: { power: 'fr' } }
      ] },
      { t: 'The conspiracy', stops: [
        { ...G[3], place: 'Vila Rica' },
        { ...G[4], place: 'Vila Rica', q: 'The plan did not end slavery. Who would this republic be for?' },
        { ...G[5], place: 'Rio de Janeiro' },
        { ...G[6], place: 'Rio de Janeiro', q: 'Why was only Tiradentes executed, and not the richer poets and priests?' }
      ] },
      { t: 'Echoes', stops: [
        { y: 1789, p: [2.35, 48.86], zoom: 'continent', place: 'Paris', ev: 'france1789', look: { power: 'fr' }, t: 'Paris, four months later',
          txt: 'In July 1789, four months after the plot was denounced in Minas, the people of Paris stormed the Bastille. In France the revolution won and ended absolute monarchy; in Minas, the uprising never even began. The ideas of Paris would reach Brazil in the following years, in banned books and in talk at the ports.' },
        { ...G[7], place: 'Salvador', q: 'Compare who conspired in Minas and in Salvador, and the sentences each group received.' },
        { y: 1889, p: RIO, zoom: 'region', place: 'Rio de Janeiro', ev: 'republic', t: 'Tiradentes becomes a hero',
          txt: 'Under the Empire, remembering Tiradentes was awkward: he had been condemned by Queen Maria I, great-grandmother of Emperor Pedro II. The republicans adopted him as a martyr and, after the Republic was proclaimed in 1889, April 21 became a national holiday. Paintings such as Pedro Américo’s "Tiradentes Quartered" (1893) gave him a face much like Christ’s; no portrait of him was made in his lifetime.',
          q: 'Why did a newborn republic need a hero?' }
      ] }
    ],
    next: ['france1789', 'haiti', 'independence', 'republic']
  }
};

/* trail built from a guide: before (causes in the network), step by step (the guide), after (consequences) */
function fromGuide(id, graph) {
  const main = graph.byId.get(id), steps = GUIDES[id].filter(s => s.y >= T0 && s.y <= T1);
  if (steps.length < 3) return null;
  const inGuide = new Set(steps.map(s => s.ev).filter(Boolean).concat(id));
  const asStop = e => ({ y: Math.min(T1, Math.max(T0, e.y)), p: e.p, zoom: 'continent', place: e.place, ev: e.id, t: e.t, txt: e.txt });
  const near = list => list.filter(e => e?.p && !inGuide.has(e.id) && e.y <= T1 && (e.y2 ?? e.y) >= T0).sort((a, b) => a.y - b.y);
  const before = main ? near((graph.inc.get(id) || []).map(l => graph.byId.get(l.from))).slice(-3) : [];
  const after = main ? near((graph.out.get(id) || []).map(l => graph.byId.get(l.to))).slice(0, 3) : [];
  return {
    title: main?.t || id, question: null, home: main?.p ? regionAt(main.p[0], main.p[1]) : null,
    acts: [before.length && { t: 'Before', stops: before.map(asStop) }, { t: 'Step by step', stops: steps }, after.length && { t: 'After', stops: after.map(asStop) }].filter(Boolean),
    next: main ? (graph.out.get(id) || []).map(l => l.to).filter(t => GUIDES[t]) : []
  };
}

export function buildTrails(graph) {
  const out = {};
  for (const id of GUIDE_ORDER) {
    const tr = CURATED[id] || fromGuide(id, graph); if (!tr) continue;
    const stops = [];
    tr.acts.forEach((a, ai) => a.stops.forEach(s => stops.push({ ...s, act: ai, region: regionAt(s.p[0], s.p[1]) })));
    stops.forEach((s, i) => { s.i = i; });
    const ys = stops.map(s => s.y);
    out[id] = { id, ...tr, curated: !!CURATED[id], stops, from: Math.min(...ys), to: Math.max(...ys), home: tr.home || stops[0].region };
  }
  for (const tr of Object.values(out)) tr.next = (tr.next || []).filter(n => out[n] && n !== tr.id);
  return out;
}
