// Scene player: clock, dated caption, pause, skip and close.
export class ScenePlayer {
  constructor(panel, layer, ctx) {
    this.panel = panel; this.layer = layer; this.ctx = ctx; this.inst = null;
    panel.innerHTML = `
      <div class="sc-top"><span class="sc-date"></span><span class="sc-title"></span>
        <span class="sc-ctrl"><button data-a="play" title="Pause (space)">❚❚</button><button data-a="next" title="Next part">⏭</button><button data-a="close" title="Leave the scene (Esc)">×</button></span></div>
      <p class="sc-text"></p>
      <div class="sc-bar"><span></span></div>`;
    this.dateEl = panel.querySelector('.sc-date'); this.titleEl = panel.querySelector('.sc-title'); this.textEl = panel.querySelector('.sc-text');
    this.bar = panel.querySelector('.sc-bar span'); this.playBtn = panel.querySelector('[data-a=play]');
    this.playBtn.onclick = () => this.toggle();
    panel.querySelector('[data-a=next]').onclick = () => this.next();
    panel.querySelector('[data-a=close]').onclick = () => this.stop(false);
    window.addEventListener('keydown', e => {
      if (!this.inst) return;
      if (e.key === 'Escape') this.stop(false);
      else if (e.key === ' ') { e.preventDefault(); e.stopImmediatePropagation(); this.toggle(); }
      else if (e.key === 'ArrowRight' && e.shiftKey) this.next();
    }, true);
  }
  get active() { return !!this.inst; }
  start(def, onEnd) {
    if (this.inst) this.stop(false);
    this.def = def; this.onEnd = onEnd; this.t = 0; this.playing = true; this.beat = -1;
    this.inst = def.build({ ...this.ctx, layer: this.layer });
    this.titleEl.textContent = def.title; this.panel.hidden = false; this.layer.hidden = false; this.playBtn.textContent = '❚❚';
    document.body.classList.add('in-scene');
  }
  toggle() { this.playing = !this.playing; this.playBtn.textContent = this.playing ? '❚❚' : '▶'; }
  next() { const b = this.inst?.beats.find(b => b.at > this.t + 0.01); if (b) this.t = b.at; else this.stop(true); }
  stop(finished) {
    if (!this.inst) return;
    this.inst.dispose(); this.inst = null; this.panel.hidden = true; this.layer.hidden = true; this.layer.replaceChildren();
    document.body.classList.remove('in-scene');
    this.onEnd?.(finished);
  }
  tick(dt) {
    if (!this.inst) return;
    if (this.playing) this.t += dt;
    const { beats, duration } = this.inst;
    let k = -1; for (let i = 0; i < beats.length; i++) if (beats[i].at <= this.t) k = i;
    if (k !== this.beat) { this.beat = k; const b = beats[k]; if (b) { this.textEl.textContent = b.text; this.panel.classList.remove('fresh'); void this.panel.offsetWidth; this.panel.classList.add('fresh'); } }
    this.inst.update(this.t, this.playing ? dt : 0);
    this.dateEl.textContent = this.inst.date(this.t);
    this.bar.style.width = Math.min(100, this.t / duration * 100) + '%';
    if (this.t >= duration) this.stop(true);
  }
}
