// 3D globe: the same world as the map painted on a sphere, with the period's routes and the voyage of the selected event.
// Dragging rotates, the wheel zooms. Zooming in too far "dives" into the map at that point.
import * as THREE from 'three';
import { isWater } from '../data/grid.js';
import { TERRAIN_COLORS, EMPIRE_COLORS } from '../data/palette.js';
import { flowLine } from '../world/flowline.js';
import { shipGeometry } from '../story/cabral.js';

const D2R = Math.PI / 180, FOV = 35, R_MAX = 7;
// the globe and the map switch at a single zoom (pixels per 0.5° square): zooming the globe past it drops into the map,
// and the map does not zoom out past GLOBE_BELOW (camera.js), slightly lower; so the two never show the same distance in different ways
export const DIVE_PPU = 6.5;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

export class Globe {
  constructor(host, grid) {
    this.host = host; this.grid = grid; this.active = false;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#020308');
    this.cam = new THREE.PerspectiveCamera(FOV, 1, 0.01, 80);
    this.cur = { lon: -25, lat: -5, dist: 3.6 }; this.goal = { ...this.cur };
    this.ppuU = { value: 100 };   // pixels per sphere unit at the centre of the screen (for line widths)
    this.inset = 0; this.insetGoal = 0;   // centre offset (px) so the globe sits in the free space between the panels

    // light that follows the camera, from the upper left: the visible side is bright, with the rim slightly darker
    this.scene.add(new THREE.HemisphereLight('#E8F0FF', '#3A4250', 1.05));
    this.sun = new THREE.DirectionalLight('#FFF3E0', 1.9); this.scene.add(this.sun, this.sun.target);

    // land colours in a large texture; the coastline comes from a smooth field (land 0–1) cut at 0.4 in the shader,
    // so the coast stays sharp at any distance instead of turning blurry or jagged
    this.canvas = document.createElement('canvas'); this.canvas.width = 4096; this.canvas.height = 2048;
    this.tex = new THREE.CanvasTexture(this.canvas); this.tex.colorSpace = THREE.SRGBColorSpace; this.tex.anisotropy = 8;
    this.field = new THREE.DataTexture(new Uint8Array(720 * 360 * 2), 720, 360, THREE.RGFormat);
    this.field.magFilter = this.field.minFilter = THREE.LinearFilter; this.field.wrapS = THREE.RepeatWrapping; this.field.generateMipmaps = false;
    const mat = new THREE.MeshPhongMaterial({ map: this.tex, specular: '#4A5A6A', shininess: 22 });
    const uni = { uField: { value: this.field }, uDeep: { value: new THREE.Color(TERRAIN_COLORS[0]) }, uShallow: { value: new THREE.Color(TERRAIN_COLORS[1]) }, uCoast: { value: new THREE.Color('#1C2C3A') } };
    mat.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, uni);
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
uniform sampler2D uField; uniform vec3 uDeep, uShallow, uCoast; float gLand;
float gHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float gNoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(gHash(i), gHash(i + vec2(1, 0)), f.x), mix(gHash(i + vec2(0, 1)), gHash(i + vec2(1, 1)), f.x), f.y); }`)
        .replace('#include <map_fragment>', `
vec2 gf = texture2D(uField, vMapUv).rg;
float gw = max(fwidth(gf.r) * 0.7, 1e-4);
gLand = smoothstep(0.4 - gw, 0.4 + gw, gf.r);
vec3 gSea = mix(uDeep, uShallow, smoothstep(0.08, 0.75, gf.g));
vec3 gTex = texture2D(map, vMapUv).rgb;
// fine grain on land: fades from far away, gives texture up close
vec2 gp = vMapUv * vec2(2880.0, 1440.0);
float gn = gNoise(gp) * 0.6 + gNoise(gp * 2.7) * 0.4, gfade = 1.0 - smoothstep(0.4, 2.0, length(fwidth(gp)));
gTex *= 1.0 + (gn - 0.5) * 0.16 * gfade;
vec3 gCol = mix(gSea, gTex, gLand);
float gc = 1.0 - smoothstep(0.0, gw * 2.2, abs(gf.r - 0.4));
gCol = mix(gCol, uCoast, gc * 0.6);
diffuseColor.rgb *= gCol;`)
        .replace('#include <specularmap_fragment>', 'float specularStrength = 1.0 - gLand;');
    };
    this.earth = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), mat);
    this.scene.add(this.earth);
    // atmosphere: a blue glow on the edge of the disc (inside) and a halo that fades outwards
    const glow = (r, side, frag) => new THREE.Mesh(new THREE.SphereGeometry(r, 96, 64), new THREE.ShaderMaterial({
      side, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'varying vec3 vN; varying vec3 vV; void main(){ float d = abs(dot(normalize(vN), normalize(vV))); ' + frag + ' }'
    }));
    this.scene.add(glow(1.004, THREE.FrontSide, 'float f = pow(1.0 - d, 3.2); gl_FragColor = vec4(0.38, 0.62, 1.0, f * 0.85);'));
    this.scene.add(glow(1.09, THREE.BackSide, 'float f = pow(smoothstep(0.0, 0.42, d), 2.4); gl_FragColor = vec4(0.32, 0.56, 1.0, f * 0.62);'));
    this.scene.add(stars());
    this.lanes = new THREE.Group(); this.voy = new THREE.Group(); this.scene.add(this.lanes, this.voy);
    this.ship = new THREE.Mesh(shipGeometry(), new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
    this.ship.visible = false; this.scene.add(this.ship);
    this.voyKey = null; this.v = new THREE.Vector3(); this.pointers = new Map(); this.touched = 0;
    this.#bind();
  }

  /* map square (u, v) → point on the sphere of radius r */
  xyz(u, v, r = 1, out = new THREE.Vector3()) {
    const lon = (this.grid.lon0 + u * this.grid.step) * D2R, lat = (this.grid.lat0 - v * this.grid.step) * D2R;
    return out.set(r * Math.cos(lat) * Math.cos(lon), r * Math.sin(lat), -r * Math.cos(lat) * Math.sin(lon));
  }
  get center() { return [this.cur.lon, this.cur.lat]; }
  /* zoom equivalent to the map's (pixels per 0.5° square) at the centre of the screen */
  get ppu() { return this.ppuU.value * this.grid.step * D2R; }
  /* minimum distance: where the zoom reaches DIVE_PPU (depends on screen height) */
  get rMin() { return 1 + this.host.clientHeight / (2 * Math.tan(FOV * D2R / 2) * (DIVE_PPU / (this.grid.step * D2R))); }
  lookAt(lon, lat, dist) { this.goal.lon = this.cur.lon + wrap(lon - this.cur.lon); this.goal.lat = clamp(lat, -75, 80); if (dist) this.goal.dist = clamp(dist, this.rMin, R_MAX); }
  /* open the globe looking at (lon, lat), with a zoom similar to the map's */
  enter(lon, lat, ppu, at) {
    this.active = true;
    const h = this.host.clientHeight, px = ppu / (this.grid.step * D2R);   // pixels per unit
    const dist = Math.max(this.rMin, at || Math.min(R_MAX, 1 + h / (2 * Math.tan(FOV * D2R / 2) * px)));   // the same zoom the map had
    this.cur = { lon, lat: clamp(lat, -75, 80), dist }; this.goal = { ...this.cur };
    this.resize(); this.apply();
  }
  resize() { const w = this.host.clientWidth, h = this.host.clientHeight; this.cam.aspect = w / h; this.cam.setViewOffset(w, h, -this.inset, 0, w, h); }
  /* space taken by the panels on the left and right: the globe is centred in what is left */
  setInsets(left, right, now) { this.insetGoal = (left - right) / 2; if (now) { this.inset = this.insetGoal; this.resize(); } }
  /* camera tilt: from far away almost straight down; zooming in it looks more sideways, like someone leaning over a game board */
  /* camera tilt: from far away it looks straight on; near the dive it reaches the tilt of the map view (maxTilt),
     so the globe ↔ map switch does not turn the camera suddenly */
  tiltAt(dist) { const r = this.rMin, t = clamp((r + 1.6 - dist) / 1.6, 0, 1), lo = 10 * D2R, hi = Math.max(lo, this.maxTilt ?? 0.78); return lo + (hi - lo) * t * t * (3 - 2 * t); }
  apply() {
    const { lon, lat, dist } = this.cur, la = lat * D2R, lo = lon * D2R, tilt = this.tiltAt(dist), h = dist - 1;
    const n = new THREE.Vector3(Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo));
    const north = new THREE.Vector3(-Math.sin(la) * Math.cos(lo), Math.cos(la), Math.sin(la) * Math.sin(lo));
    this.cam.position.copy(n).multiplyScalar(Math.cos(tilt)).addScaledVector(north, -Math.sin(tilt)).multiplyScalar(h).add(n);
    this.cam.up.copy(north).multiplyScalar(Math.cos(tilt)).addScaledVector(n, Math.sin(tilt));
    this.cam.lookAt(n); this.cam.updateMatrixWorld();
    // light from above and from the viewer's left
    const right = new THREE.Vector3().setFromMatrixColumn(this.cam.matrixWorld, 0), upv = new THREE.Vector3().setFromMatrixColumn(this.cam.matrixWorld, 1);
    this.sun.position.copy(this.cam.position).addScaledVector(right, -1.5).addScaledVector(upv, 1.5);
    this.ppuU.value = this.host.clientHeight / (2 * h * Math.tan(FOV * D2R / 2));
  }
  tick(dt) {
    const k = 1 - Math.exp(-dt * 8), c = this.cur, g = this.goal;
    let moved = false;
    for (const key of ['lon', 'lat']) { const d = g[key] - c[key]; if (Math.abs(d) > 1e-4) { c[key] += d * k; moved = true; } else c[key] = g[key]; }
    const lr = Math.log((g.dist - 1) / (c.dist - 1)); if (Math.abs(lr) > 1e-4) { c.dist = 1 + (c.dist - 1) * Math.exp(lr * k); moved = true; } else c.dist = g.dist;
    const di = this.insetGoal - this.inset;
    if (Math.abs(di) > 0.5) { this.inset += di * k; this.resize(); moved = true; } else if (di) { this.inset = this.insetGoal; this.resize(); moved = true; }
    if (moved) this.apply();
  }

  /* screen point of (u, y, v), or null if it is on the far side of the globe */
  project(u, v, w, h) {
    const p = this.xyz(u, v, 1.002, this.v);
    const toCam = this.cam.position.clone().sub(p);
    if (toCam.dot(p) <= 0.02) return null;
    p.project(this.cam);
    return [(p.x * 0.5 + 0.5) * w, (-p.y * 0.5 + 0.5) * h];
  }

  /* paint the texture: terrain, empire colour, borders and relief (redone only when the political map changes), then the cities.
     Each texture point blends the 4 neighbouring squares: the coast comes from the 0.5 threshold of the land fraction, curved instead of jagged. */
  /* coast field (720 × 360, the whole globe): R = smoothed land (cut at 0.4), G = shallow sea near the coast */
  #paintField(land) {
    const { cols, rows, terr } = this.grid, W = 720, H = 360, n = W * H, A = new Float32Array(n), S = new Float32Array(n);
    for (let j = 0; j < H; j++) {
      const lat = -90 + (j + 0.5) * 0.5, r = 347 - j;
      for (let x = 0; x < W; x++) {
        const i = j * W + x;
        if (r >= 0 && r < rows) { const k = r * cols + x; A[i] = land[k]; S[i] = land[k] || terr[k] === 1 ? 1 : 0; }
        else { A[i] = S[i] = lat > 86 || lat < -66 ? 1 : 0; }
      }
    }
    // separable blur [1 4 1] on land (rounded coastline, one-square islands stay visible) and [1 2 1] twice on shallow sea
    const pass = (F, w0, w1) => {
      const T = new Float32Array(n), s0 = w0 + 2 * w1;
      for (let j = 0; j < H; j++) for (let x = 0; x < W; x++) { const o = j * W; T[o + x] = (F[o + x] * w0 + (F[o + (x + 1) % W] + F[o + (x + W - 1) % W]) * w1) / s0; }
      for (let j = 0; j < H; j++) for (let x = 0; x < W; x++) { const up = Math.min(H - 1, j + 1), dn = Math.max(0, j - 1); F[j * W + x] = (T[j * W + x] * w0 + (T[up * W + x] + T[dn * W + x]) * w1) / s0; }
    };
    pass(A, 4, 1); pass(S, 2, 1); pass(S, 2, 1); pass(S, 2, 1);
    const d = this.field.image.data;
    for (let i = 0; i < n; i++) { d[i * 2] = Math.round(A[i] * 255); d[i * 2 + 1] = Math.round(S[i] * 255); }
    this.field.needsUpdate = true;
  }
  paint(colorIdx, owner, cities = [], key = null) {
    const ctx = this.canvas.getContext('2d');
    if (!this.base || key === null || key !== this.baseKey) { this.base = this.#paintBase(colorIdx, owner); this.baseKey = key; }
    ctx.putImageData(this.base, 0, 0);
    // cities: warm lights with a dark outline
    const { grid } = this, W = this.canvas.width, H = this.canvas.height;
    const k = W / 2048; ctx.fillStyle = '#FFF1C9'; ctx.strokeStyle = 'rgba(38, 24, 10, 0.85)'; ctx.lineWidth = 0.9 * k;
    for (const ct of cities) {
      const x = (ct.u * grid.step) / 360 * W, y = (90 - (grid.lat0 - ct.v * grid.step)) / 180 * H, r = (1.1 + ct.size * 0.85) * k;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    this.tex.needsUpdate = true;
  }
  #paintBase(colorIdx, owner) {
    const { grid } = this, { cols, rows, terr, level } = grid, W = this.canvas.width, H = this.canvas.height;
    const img = new ImageData(W, H), px = new Uint32Array(img.data.buffer);
    const srgb = hex => { const c = new THREE.Color(hex); return [c.r, c.g, c.b].map(v => v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055); };
    // colour of each square in sRGB (0–255), land with relief and empire tint
    const n = cols * rows, R = new Float32Array(n), G = new Float32Array(n), B = new Float32Array(n), land = new Uint8Array(n);
    const tc = {}; for (const [k, hex] of Object.entries(TERRAIN_COLORS)) tc[k] = srgb(hex);
    const ec = EMPIRE_COLORS.map(srgb);
    for (let i = 0; i < n; i++) {
      const t = terr[i]; let [r, g, b] = tc[t];
      if (!isWater(t)) {
        land[i] = 1;
        const up = i >= cols ? level[i - cols] : level[i], left = i % cols ? level[i - 1] : level[i];
        const sh = 1 + clamp((level[i] - up) * 0.07 + (level[i] - left) * 0.05, -0.14, 0.14); r *= sh; g *= sh; b *= sh;
        const e = colorIdx ? colorIdx[i] : -1;
        if (e >= 0) { const p = ec[e]; r += (p[0] - r) * 0.42; g += (p[1] - g) * 0.42; b += (p[2] - b) * 0.42; }
      }
      R[i] = r * 255; G[i] = g * 255; B[i] = b * 255;
    }
    // light blur between squares of the same type (land with land, sea with sea): terrain patches look painted, not checkered
    blur(R, G, B, land, cols, rows);
    const bc = EMPIRE_COLORS.map(h => { const c = new THREE.Color(h).offsetHSL(0, 0.08, -0.2); const s = srgb('#' + c.getHexString()); return [s[0] * 255, s[1] * 255, s[2] * 255]; });
    const ice = srgb('#EEF3F6').map(v => v * 255), deep = tc[0].map(v => v * 255);
    // tables per column and per row: neighbouring squares and weights
    const c0 = new Int32Array(W), c1 = new Int32Array(W), fxs = new Float32Array(W), r0 = new Int32Array(H), r1 = new Int32Array(H), fys = new Float32Array(H), polar = new Int8Array(H);
    for (let x = 0; x < W; x++) { const g = (-180 + (x + 0.5) * 360 / W - grid.lon0) / grid.step - 0.5, f = Math.floor(g); fxs[x] = g - f; c0[x] = (f + cols) % cols; c1[x] = (f + 1 + cols) % cols; }
    for (let y = 0; y < H; y++) {
      const lat = 90 - (y + 0.5) * 180 / H, g = (grid.lat0 - lat) / grid.step - 0.5, f = Math.floor(g);
      fys[y] = g - f; r0[y] = clamp(f, 0, rows - 1); r1[y] = clamp(f + 1, 0, rows - 1);
      polar[y] = lat > grid.lat0 + 1 ? (lat > 86 ? 2 : 1) : lat < grid.lat0 - rows * grid.step - 1 ? (lat < -66 ? 2 : 1) : 0;
    }
    const own = new Int16Array(W * H);
    const pack = (r, g, b) => (255 << 24) | (clamp(b | 0, 0, 255) << 16) | (clamp(g | 0, 0, 255) << 8) | clamp(r | 0, 0, 255);
    for (let y = 0; y < H; y++) {
      const o = y * W;
      if (polar[y]) { const c = polar[y] === 2 ? ice : deep, v = pack(...c); px.fill(v, o, o + W); own.fill(-2, o, o + W); continue; }
      const a0 = r0[y] * cols, a1 = r1[y] * cols, fy = fys[y];
      for (let x = 0; x < W; x++) {
        const fx = fxs[x], i00 = a0 + c0[x], i10 = a0 + c1[x], i01 = a1 + c0[x], i11 = a1 + c1[x];
        const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy), w01 = (1 - fx) * fy, w11 = fx * fy;
        const l00 = land[i00] * w00, l10 = land[i10] * w10, l01 = land[i01] * w01, l11 = land[i11] * w11, L = l00 + l10 + l01 + l11;
        let r, g, b, ow;
        if (L > 0.001) {
          r = (R[i00] * l00 + R[i10] * l10 + R[i01] * l01 + R[i11] * l11) / L;
          g = (G[i00] * l00 + G[i10] * l10 + G[i01] * l01 + G[i11] * l11) / L;
          b = (B[i00] * l00 + B[i10] * l10 + B[i01] * l01 + B[i11] * l11) / L;
          // owner: that of the nearest land square
          let m = l00, k = i00; if (l10 > m) { m = l10; k = i10; } if (l01 > m) { m = l01; k = i01; } if (l11 > m) { k = i11; }
          ow = owner && owner[k] >= 0 ? owner[k] : -1;
        } else {
          const q = 1 - L, s00 = w00 - l00, s10 = w10 - l10, s01 = w01 - l01, s11 = w11 - l11;
          r = (R[i00] * s00 + R[i10] * s10 + R[i01] * s01 + R[i11] * s11) / q;
          g = (G[i00] * s00 + G[i10] * s10 + G[i01] * s01 + G[i11] * s11) / q;
          b = (B[i00] * s00 + B[i10] * s10 + B[i01] * s01 + B[i11] * s11) / q;
          ow = -2;
        }
        px[o + x] = pack(r, g, b); own[o + x] = ow;
      }
    }
    // borders: the point to the right or below is land of another owner
    if (owner) for (let y = 0; y + 1 < H; y++) {
      const o = y * W;
      for (let x = 0; x < W; x++) {
        const me = own[o + x]; if (me < 0) continue;
        const rt = own[o + (x + 1) % W], dn = own[o + W + x];
        if ((rt !== me && rt !== -2) || (dn !== me && dn !== -2)) { const c = bc[colorIdx[this.#cellAt(x, y)]] || bc[0]; px[o + x] = pack(c[0], c[1], c[2]); }
      }
    }
    this.#paintField(land);
    return img;
  }
  #cellAt(x, y) {
    const { grid } = this, W = this.canvas.width, H = this.canvas.height;
    const c = clamp(Math.floor((-180 + (x + 0.5) * 360 / W - grid.lon0) / grid.step), 0, grid.cols - 1), r = clamp(Math.floor((grid.lat0 - (90 - (y + 0.5) * 180 / H)) / grid.step), 0, grid.rows - 1);
    return r * grid.cols + c;
  }

  /* sea routes and roads of the period (paths in map squares) */
  setRoutes(paths) {
    for (const m of this.lanes.children) { m.geometry.dispose(); m.material.dispose(); }
    this.lanes.clear();
    const sph = list => list.map(pts => pts.map(([u, , v]) => this.xyz(u, v, 1.0015).toArray()));
    const up = p => [p[0], p[1], p[2]];
    if (paths.lane.length) this.lanes.add(flowLine(sph(paths.lane), { color: '#F4F1E8', px: 1.6, minW: 0, dashPx: 9, gap: 0.45, speed: 0.25, opacity: 0.85, ppu: this.ppuU, up }));
    const land = [...paths.road, ...paths.caravan];
    if (land.length) this.lanes.add(flowLine(sph(land), { color: '#8C6A3E', px: 1.6, minW: 0, opacity: 0.9, ppu: this.ppuU, up }));
  }

  /* voyages of the selected event: the same as on the map, drawn at the same pace (shared uReveal) */
  syncVoyages(voyages) {
    if (this.voyKey === voyages.key) return;
    for (const m of this.voy.children) { m.geometry.dispose(); m.material.dispose(); }
    this.voy.clear(); this.voyKey = voyages.key;
    const up = p => [p[0], p[1], p[2]];
    for (const it of voyages.items) {
      // long straight stretches would cut through the sphere: subdivide in steps of half a square
      const pts = [], L = [];
      it.p.pts.forEach(([u, , v], k) => {
        if (k) { const [u0, , v0] = it.p.pts[k - 1], n = Math.ceil(Math.hypot(u - u0, v - v0) / 0.5); for (let j = 1; j < n; j++) { const f = j / n; pts.push(this.xyz(u0 + (u - u0) * f, v0 + (v - v0) * f, 1.003).toArray()); L.push(it.p.L[k - 1] + (it.p.L[k] - it.p.L[k - 1]) * f); } }
        pts.push(this.xyz(u, v, 1.003).toArray()); L.push(it.p.L[k]);
      });
      const dists = [L], d = it.d;
      const halo = flowLine([pts], { dists, color: '#FBF8F1', px: d.later ? 6 : 9, minW: 0, opacity: d.later ? 0.45 : 0.75, order: 5, ppu: this.ppuU, up });
      const line = flowLine([pts], { dists, dpu: 1 / (this.grid.step * D2R), color: d.color || '#B3261E', px: d.later ? 2.6 : 4.5, minW: 0, dashPx: d.later ? 7 : 14, gap: d.later ? 0.5 : 0.3, speed: 0.6, opacity: d.later ? 0.75 : 1, order: 6, ppu: this.ppuU, up });
      halo.material.uniforms.uReveal = it.halo.material.uniforms.uReveal;
      line.material.uniforms.uReveal = it.line.material.uniforms.uReveal;
      this.voy.add(halo, line);
    }
  }
  /* ship at the tip of the drawing (same position as on the map) */
  placeShip(voyages) {
    const s = voyages.shipAt; this.ship.visible = !!(s && voyages.items.length);
    if (!this.ship.visible) return;
    const a = voyages.at(s.main.p, s.f), b = voyages.at(s.main.p, Math.min(1, s.f + 0.003));
    const p = this.xyz(a.u, a.v, 1.004), q = this.xyz(b.u, b.v, 1.004), n = p.clone().normalize();
    let fwd = q.sub(p); if (fwd.lengthSq() < 1e-12) fwd = new THREE.Vector3().crossVectors(n, new THREE.Vector3(0, 1, 0));
    fwd.addScaledVector(n, -fwd.dot(n)).normalize();
    const side = new THREE.Vector3().crossVectors(fwd, n);
    this.ship.matrix.makeBasis(fwd, n, side).scale(new THREE.Vector3().setScalar(30 / this.ppuU.value / 0.34)).setPosition(p);
    this.ship.matrixAutoUpdate = false; this.ship.matrixWorldNeedsUpdate = true;
  }

  render(renderer) { renderer.render(this.scene, this.cam); }

  #bind() {
    const el = this.host;
    const perPx = () => 2 * (this.cur.dist - 1) * Math.tan(FOV * D2R / 2) / el.clientHeight / D2R;   // degrees per pixel at the centre
    const zoom = f => {
      const next = 1 + (this.goal.dist - 1) * f;
      const rMin = this.rMin;
      if (next < rMin && f < 1) { if (this.goal.dist <= rMin + 0.01) this.onDive?.(this.cur.lon, this.cur.lat, DIVE_PPU); this.goal.dist = rMin; return; }
      this.goal.dist = clamp(next, rMin, R_MAX); this.touched = performance.now();
    };
    el.addEventListener('wheel', e => { if (!this.active) return; e.preventDefault(); const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY; zoom(Math.exp(dy * 0.0016)); }, { passive: false });
    el.addEventListener('pointerdown', e => { if (!this.active) return; this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); });
    el.addEventListener('pointermove', e => {
      if (!this.active) return; const p = this.pointers.get(e.pointerId); if (!p) return;
      if (this.pointers.size === 1) {
        const k = perPx(), dx = e.clientX - p.x, dy = e.clientY - p.y;
        this.goal.lon = this.cur.lon -= dx * k / Math.max(0.2, Math.cos(this.cur.lat * D2R));
        this.goal.lat = this.cur.lat = clamp(this.cur.lat + dy * k, -75, 80);
        this.apply(); this.touched = performance.now();
      } else if (this.pointers.size === 2) {
        const o = [...this.pointers.values()].find(q => q !== p), d0 = Math.hypot(p.x - o.x, p.y - o.y), d1 = Math.hypot(e.clientX - o.x, e.clientY - o.y);
        if (d0 > 0 && d1 > 0) zoom(d0 / d1);
      }
      p.x = e.clientX; p.y = e.clientY;
    });
    const up = e => this.pointers.delete(e.pointerId);
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    el.addEventListener('dblclick', e => {
      if (!this.active) return;
      // dive into the map at the clicked point
      const r = el.getBoundingClientRect(), ray = new THREE.Raycaster();
      ray.setFromCamera({ x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 }, this.cam);
      const hit = ray.intersectObject(this.earth)[0]; if (!hit) return;
      const p = hit.point, lat = Math.asin(clamp(p.y, -1, 1)) / D2R, lon = Math.atan2(-p.z, p.x) / D2R;
      this.onDive?.(lon, lat, Math.max(6, this.ppu * 2));
    });
    window.addEventListener('keydown', e => {
      if (!this.active || e.target.closest?.('input, textarea, select')) return;
      const k = 8 * (this.cur.dist - 1) / 2.6;
      const m = { a: [-k, 0], d: [k, 0], w: [0, k], s: [0, -k] }[e.key];
      if (m) { this.goal.lon += m[0]; this.goal.lat = clamp(this.goal.lat + m[1], -75, 80); e.preventDefault(); }
      if (e.key === '+' || e.key === '=') zoom(1 / 1.5); if (e.key === '-' || e.key === '_') zoom(1.5);
    });
  }
}
const wrap = d => ((d + 540) % 360) - 180;

/* [1 2 1] blur in x and in y, only between neighbours of the same medium (land or water) */
function blur(R, G, B, land, cols, rows) {
  const n = cols * rows, r2 = new Float32Array(n), g2 = new Float32Array(n), b2 = new Float32Array(n);
  for (const [dx, dy] of [[1, 0], [0, 1]]) {
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const i = y * cols + x; let r = R[i] * 2, g = G[i] * 2, b = B[i] * 2, w = 2;
      for (const s of [-1, 1]) {
        const xx = (x + dx * s + cols) % cols, yy = y + dy * s; if (yy < 0 || yy >= rows) continue;
        const j = yy * cols + xx; if (land[j] !== land[i]) continue;
        r += R[j]; g += G[j]; b += B[j]; w++;
      }
      r2[i] = r / w; g2[i] = g / w; b2[i] = b / w;
    }
    R.set(r2); G.set(g2); B.set(b2);
  }
}

/* starry sky: fixed points on a large sphere, some bigger and warmer or bluer */
function stars() {
  const g = new THREE.Group();
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (const [count, size, bright] of [[2600, 1.4, 0.55], [500, 2.2, 0.8], [90, 3.2, 1]]) {
    const pos = [], col = [];
    for (let i = 0; i < count; i++) {
      const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, r = Math.sqrt(1 - u * u), d = 60;
      pos.push(d * r * Math.cos(th), d * u, d * r * Math.sin(th));
      const t = rnd(), b = bright * (0.45 + 0.55 * rnd());
      const c = t < 0.15 ? [1, 0.86, 0.68] : t < 0.35 ? [0.72, 0.82, 1] : [1, 1, 1];
      col.push(c[0] * b, c[1] * b, c[2] * b);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.add(new THREE.Points(geo, new THREE.PointsMaterial({ size, sizeAttenuation: false, vertexColors: true, transparent: true, depthWrite: false })));
  }
  return g;
}
