// Event info card: text, what came before, what came after, further reading.
import { span } from '../net/graph.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function renderDetail(el, id, ctx) {
  const { graph, kinds, types, sources, scenes } = ctx, e = graph.byId.get(id), k = kinds[e.k];
  const idx = graph.order.indexOf(e), prev = graph.order[idx - 1], next = graph.order[idx + 1];
  const link = (l, otherId) => {
    const o = graph.byId.get(otherId);
    return `<li><button class="lnk" data-go="${o.id}">
      <span class="tag">${esc(types[l.type])}</span>${l.debated ? '<span class="tag deb" title="Historians disagree about this link">debated</span>' : ''}
      <b><i style="background:${kinds[o.k].color}"></i>${esc(o.t)}</b> <small>${span(o)} · ${esc(o.place)}</small>
      <span class="why">${esc(l.why)}</span></button></li>`;
  };
  const inc = graph.inc.get(id), out = graph.out.get(id);
  el.innerHTML = `
    <div class="d-head">
      <span class="kind" style="--c:${k.color}">${esc(k.label)}</span>
      <button class="x" data-act="close" title="Close (Esc)">×</button>
    </div>
    <div class="d-when">${span(e)} · ${esc(e.place)}</div>
    <h2>${esc(e.t)}</h2>
    ${ctx.guides?.[id] ? `<button class="play-scene guide-btn" data-act="guide">◆ Step-by-step guide <small>${ctx.guides[id].length} steps</small></button>` : ''}
    ${scenes[id] ? `<button class="play-scene" data-act="scene">▶ Watch the scene <small>${esc(scenes[id].length)}</small></button>` : ''}
    <p>${esc(e.txt)}</p>
    <div class="d-actions">
      ${ctx.voyages[id] ? '<button data-act="route" title="See the whole voyage on the map">⛵ Show the route</button>' : ''}
      ${ctx.anims[id] ? '<button data-act="replay" title="Zoom down to the map and watch the animation on the spot">▶ See up close</button>' : '<button data-act="zoom" title="Zoom down to the map at this place">See the place up close</button>'}
      <button data-act="links" title="Frame where it came from and where it led">Show the links</button>
    </div>
    ${inc.length ? `<h3><span class="dot in"></span>Came from</h3><ul class="links">${inc.map(l => link(l, l.from)).join('')}</ul>` : ''}
    ${out.length ? `<h3><span class="dot out"></span>Led to</h3><ul class="links">${out.map(l => link(l, l.to)).join('')}</ul>` : ''}
    ${e.src?.length ? `<h3>Further reading</h3><ul class="src">${e.src.map(s => `<li>${esc(sources[s] || s)}</li>`).join('')}</ul>` : ''}
    <div class="d-nav">
      ${prev ? `<button data-go="${prev.id}">← ${esc(prev.t)}</button>` : '<span></span>'}
      ${next ? `<button data-go="${next.id}">${esc(next.t)} →</button>` : '<span></span>'}
    </div>`;
  el.querySelectorAll('[data-go]').forEach(b => { b.onclick = () => ctx.onPick(b.dataset.go); });
  el.querySelector('[data-act=close]').onclick = ctx.onClose;
  el.querySelector('[data-act=zoom]')?.addEventListener('click', () => ctx.onZoom(e));
  el.querySelector('[data-act=replay]')?.addEventListener('click', () => ctx.onReplay(e));
  el.querySelector('[data-act=route]')?.addEventListener('click', () => ctx.onRoute(e));
  el.querySelector('[data-act=links]').onclick = () => ctx.onLinks(e);
  el.querySelector('[data-act=guide]')?.addEventListener('click', () => ctx.onGuide(id));
  const sc = el.querySelector('[data-act=scene]'); if (sc) sc.onclick = () => ctx.onScene(id);
  el.scrollTop = 0;
}
