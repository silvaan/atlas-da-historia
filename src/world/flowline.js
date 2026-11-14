// Line with a minimum width in pixels: stays visible when zoomed out (routes, roads, voyages).
// It can have a moving dash (shows the direction) and be "drawn" little by little (uReveal).
import * as THREE from 'three';
import { BEND, BEND_GLSL } from './bend.js';

/* shared uniforms: the main loop updates ppu (pixels per square) and the time */
export const FLOW = { ppu: { value: 2 }, time: { value: 0 } };

const VERT = `
  attribute vec3 offDir; attribute float side; attribute float dist;
  uniform float uPpu, uPx, uMinW;
  varying float vDist, vSide;
  ${BEND_GLSL}
  void main() {
    float w = max(uMinW, uPx / uPpu) * 0.5;
    vDist = dist; vSide = side;
    vec4 wp = modelMatrix * vec4(position + offDir * side * w, 1.0);
    wp.xyz = bendPos(wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`;
const FRAG = `
  uniform vec3 uColor; uniform float uOpacity, uDashPx, uPpu, uTime, uSpeed, uReveal, uGap, uDpu;
  varying float vDist, vSide;
  void main() {
    if (vDist > uReveal) discard;
    float a = uOpacity * smoothstep(1.0, 0.55, abs(vSide));
    if (uDashPx > 0.0) {
      float d = uDashPx / uPpu * uDpu, f = fract((vDist - uTime * uSpeed * d) / d);
      if (f > 1.0 - uGap) discard;
    }
    gl_FragColor = vec4(uColor, a);
  }`;

/* paths: lists of points [x, y, z]; up: "up" vector at each point (default: y), so the globe can use the sphere normal */
export function flowLine(paths, { dists = null, dpu = 1, color = '#ffffff', px = 3, minW = 0.05, dashPx = 0, gap = 0.45, speed = 0, opacity = 1, order = 4, ppu = FLOW.ppu, depthTest = true, up = null } = {}) {
  const pos = [], off = [], side = [], dist = [], idx = [];
  const a = new THREE.Vector3(), b = new THREE.Vector3(), t = new THREE.Vector3(), n = new THREE.Vector3(), u = new THREE.Vector3(0, 1, 0);
  let v = 0, total = 0;
  paths.forEach((pts, pi) => {
    let L = 0;
    for (let k = 0; k + 1 < pts.length; k++) {
      a.fromArray(pts[k]); b.fromArray(pts[k + 1]);
      const len = a.distanceTo(b); if (len < 1e-6) continue;
      t.subVectors(b, a).normalize();
      if (up) u.fromArray(up(pts[k])); n.crossVectors(u, t).normalize();
      // a little overlap between segments so no gap opens at the bends
      const e = Math.min(len * 0.25, 0.02);
      // dists: length measured another way (on the globe, in map squares, to match the map drawing)
      const d0 = dists ? dists[pi][k] : L, d1 = dists ? dists[pi][k + 1] : L + len, de = dists ? 0 : e;
      for (const [p, d, s] of [[a, d0 - de, -1], [a, d0 - de, 1], [b, d1 + de, 1], [b, d1 + de, -1]]) {
        const q = p === a ? a.clone().addScaledVector(t, -e) : b.clone().addScaledVector(t, e);
        pos.push(q.x, q.y, q.z); off.push(n.x, n.y, n.z); side.push(s); dist.push(Math.max(0, d));
      }
      idx.push(v, v + 1, v + 2, v, v + 2, v + 3); v += 4; L += len;
    }
    total = Math.max(total, L);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('offDir', new THREE.Float32BufferAttribute(off, 3));
  g.setAttribute('side', new THREE.Float32BufferAttribute(side, 1));
  g.setAttribute('dist', new THREE.Float32BufferAttribute(dist, 1));
  g.setIndex(idx);
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest, side: THREE.DoubleSide,
    uniforms: {
      uPpu: ppu, uTime: FLOW.time, uPx: { value: px }, uMinW: { value: minW }, uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity },
      uDashPx: { value: dashPx }, uDpu: { value: dpu }, uGap: { value: gap }, uSpeed: { value: speed }, uReveal: { value: 1e9 },
      // on the globe (up given) the lines are already on the sphere: no bending
      uBendC: BEND.uBendC, uBendOn: up ? { value: 0 } : BEND.uBendOn
    }
  });
  const mesh = new THREE.Mesh(g, mat);
  mesh.renderOrder = order; mesh.frustumCulled = false;
  mesh.userData.length = total;
  return mesh;
}
