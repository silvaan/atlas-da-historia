// Event network: indexes of incoming and outgoing links.
export function buildGraph(events, links) {
  const byId = new Map(events.map(e => [e.id, e]));
  const out = new Map(events.map(e => [e.id, []])), inc = new Map(events.map(e => [e.id, []]));
  const all = [];
  for (const [from, to, type, why, debated] of links) {
    if (!byId.has(from) || !byId.has(to)) { console.warn('link with unknown event', from, to); continue; }
    const l = { from, to, type, why, debated: !!debated };
    out.get(from).push(l); inc.get(to).push(l); all.push(l);
  }
  const order = [...events].sort((a, b) => a.y - b.y || (a.y2 ?? a.y) - (b.y2 ?? b.y));
  const neighbors = id => new Set([...out.get(id).map(l => l.to), ...inc.get(id).map(l => l.from)]);
  return { byId, out, inc, links: all, order, neighbors };
}

/* years before Christ appear as "9,500 BC" */
export const fmtYear = y => y < 0 ? `${(-y).toLocaleString('en-US')} BC` : String(y);
export const span = e => {
  if (!(e.y2 && e.y2 !== e.y)) return fmtYear(e.y);
  if (e.y < 0 && e.y2 < 0) return `${(-e.y).toLocaleString('en-US')}–${fmtYear(e.y2)}`;
  return `${fmtYear(e.y)}–${fmtYear(e.y2)}`;
};
