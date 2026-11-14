// A round Earth in the map views: the flat world (0.5° squares) is bent over a sphere around the centre of the view.
// A point at distance r from the centre goes to angle r/R on the sphere (R = 720 squares / 2π, the Earth's radius in squares).
// Near the centre nothing changes; far away, the ground falls back behind the horizon. Zooming out, the map becomes a globe.
import * as THREE from 'three';

export const R_EARTH = 720 / (2 * Math.PI);
export const BEND = { uBendC: { value: new THREE.Vector2(360, 144) }, uBendOn: { value: 1 } };

export const BEND_GLSL = `
uniform vec2 uBendC; uniform float uBendOn;
vec3 bendPos(vec3 p) {
  if (uBendOn < 0.5) return p;
  vec2 d = p.xz - uBendC; float r = length(d);
  if (r < 1e-4) return p;
  float phi = r / ${R_EARTH.toFixed(4)}, h = ${R_EARTH.toFixed(4)} + p.y;
  if (phi > 3.0) return vec3(uBendC.x, -3.0 * ${R_EARTH.toFixed(4)}, uBendC.y);
  vec2 xz = uBendC + d / r * (h * sin(phi));
  return vec3(xz.x, h * cos(phi) - ${R_EARTH.toFixed(4)}, xz.y);
}`;

const PROJECT_BENT = `
vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
  mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
  mvPosition = instanceMatrix * mvPosition;
#endif
vec4 bentW = modelMatrix * mvPosition;
bentW.xyz = bendPos(bentW.xyz);
mvPosition = viewMatrix * bentW;
gl_Position = projectionMatrix * mvPosition;`;

/* bend an ordinary three material (Lambert, Basic, lines, points...) */
export function bendMaterial(m) {
  if (!m || m.__bent || m.isShaderMaterial) return;
  m.__bent = true;
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (sh, r) => {
    prev?.call(m, sh, r);
    Object.assign(sh.uniforms, BEND);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\n' + BEND_GLSL).replace('#include <project_vertex>', PROJECT_BENT);
  };
  const key = m.customProgramCacheKey?.bind(m);
  m.customProgramCacheKey = () => 'bend|' + (key ? key() : '');
  m.needsUpdate = true;
}

/* walk the map scene: bend new materials and turn frustum culling on/off
   (three's culling uses the flat position, which far from the centre is not where the thing appears) */
export function bendScene(scene, ppu) {
  const cull = ppu >= 12;
  scene.traverse(o => {
    if (o.material) { if (Array.isArray(o.material)) o.material.forEach(bendMaterial); else bendMaterial(o.material); }
    if (o.isMesh || o.isLine || o.isPoints) { if (o.userData.cull === undefined) o.userData.cull = o.frustumCulled; o.frustumCulled = cull && o.userData.cull; }
  });
}

/* the same in JavaScript, for labels and clicks */
export function bendVec(v) {
  if (!BEND.uBendOn.value) return v;
  const c = BEND.uBendC.value, dx = v.x - c.x, dz = v.z - c.y, r = Math.hypot(dx, dz);
  if (r < 1e-4) return v;
  const phi = r / R_EARTH, h = R_EARTH + v.y, k = h * Math.sin(phi) / r;
  return v.set(c.x + dx * k, h * Math.cos(phi) - R_EARTH, c.y + dz * k);
}
/* is it on the near side of the sphere, seen along direction dir (from the camera to the scene)? */
export function facing(v, dir) { const c = BEND.uBendC.value; return (v.x - c.x) * -dir.x + (v.y + R_EARTH) * -dir.y + (v.z - c.y) * -dir.z > 0; }
/* bent point on the surface (y ≈ 0) → flat point */
export function unbend(p, out = new THREE.Vector3()) {
  const c = BEND.uBendC.value, wx = p.x - c.x, wy = p.y + R_EARTH, wz = p.z - c.y, hr = Math.hypot(wx, wz);
  const phi = Math.atan2(hr, wy);
  if (hr < 1e-6) return out.set(c.x, 0, c.y);
  return out.set(c.x + wx / hr * R_EARTH * phi, 0, c.y + wz / hr * R_EARTH * phi);
}
