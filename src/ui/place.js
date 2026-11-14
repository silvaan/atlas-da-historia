// Info card for a place on the map (monument, city, state, people, board piece): a short text and the linked events.
import { span } from '../net/graph.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function renderPlace(el, info, ctx) {
  const { kinds, guides } = ctx;
  const ev = e => `<li><button class="lnk" data-go="${e.id}">
      <b><i style="background:${kinds[e.k].color}"></i>${esc(e.t)}</b> <small>${span(e)} · ${esc(e.place)}</small>
      ${guides[e.id] ? '<span class="why">◆ has a step-by-step guide</span>' : ''}</button></li>`;
  el.innerHTML = `
    <div class="d-head">
      <span class="kind" style="--c:${info.color}">${esc(info.label)}</span>
      <button class="x" data-act="close" title="Close (Esc)">×</button>
    </div>
    ${info.period ? `<div class="d-when">${esc(info.period)}</div>` : ''}
    <h2>${esc(info.title)}</h2>
    <p${info.txt ? '' : ' class="muted"'}>${esc(info.txt || 'There is no text about this place yet. Below is what happened nearby.')}</p>
    <div class="d-actions"><button data-act="zoom" title="Zoom down to the map at this place">See the place up close</button></div>
    ${info.linked.length ? `<h3><span class="dot out"></span>Linked to</h3><ul class="links">${info.linked.map(ev).join('')}</ul>` : ''}
    ${info.near.length ? `<h3><span class="dot in"></span>Happened nearby</h3><ul class="links">${info.near.map(ev).join('')}</ul>` : ''}`;
  el.querySelectorAll('[data-go]').forEach(b => { b.onclick = () => ctx.onPick(b.dataset.go); });
  el.querySelector('[data-act=close]').onclick = ctx.onClose;
  el.querySelector('[data-act=zoom]').onclick = () => ctx.onZoom(info);
  el.scrollTop = 0;
}
