// Background life: passing clouds, glints on the sea, chimney smoke and flocks of birds.
import * as THREE from 'three';
import { colored, merge } from './nature.js';
import { rng, groundY } from './settlements.js';

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

export function buildAmbient(grid, Y, ocean) {
  const group = new THREE.Group(), R = rng(99);

  /* clouds: few, large, translucent; they fade when the camera gets close */
  const puff = (x, y, z, s) => new THREE.IcosahedronGeometry(s, 1).scale(1, 0.45, 0.8).translate(x, y, z);
  const cloudGeo = colored(merge([puff(0, 0, 0, 1), puff(0.9, -0.1, 0.2, 0.75), puff(-0.85, -0.12, -0.1, 0.7), puff(0.3, 0.15, -0.4, 0.6)]), '#FFFFFF');
  const cloudMat = new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true, opacity: 0.5, depthWrite: false, emissive: '#ffffff', emissiveIntensity: 0.35 });
  const NC = 36, clouds = new THREE.InstancedMesh(cloudGeo, cloudMat, NC), cl = [];
  for (let i = 0; i < NC; i++) cl.push({ u: R() * grid.cols, v: grid.rows * (0.12 + R() * 0.7), y: 3 + R() * 1.5, s: 2.5 + R() * 4, sp: 0.25 + R() * 0.35 });
  clouds.frustumCulled = false; clouds.renderOrder = 10; group.add(clouds);

  /* sea: soft ripple in the colour (in the ocean plane's shader) */
  const uTime = { value: 0 }, uNear = { value: 0 }, uFar = { value: 0 };
  ocean.material.onBeforeCompile = sh => {
    sh.uniforms.uTime = uTime; sh.uniforms.uNear = uNear; sh.uniforms.uFar = uFar;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvWp = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;\nuniform float uTime;\nuniform float uNear;\nuniform float uFar;')
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>
        float w = sin(vWp.x * 0.55 + uTime * 0.5) * sin(vWp.z * 0.7 - uTime * 0.4) + 0.5 * sin((vWp.x + vWp.z) * 1.7 + uTime * 1.1);
        float glint = smoothstep(1.3, 1.45, w + 0.5 * sin(vWp.x * 3.1 - vWp.z * 2.3 + uTime * 1.7) * sin(vWp.x * 1.3 + vWp.z * 2.9 - uTime * 0.9));
        gl_FragColor.rgb *= 1.0 + 0.035 * w * uFar;
        gl_FragColor.rgb += vec3(0.07) * glint * uNear;`);
  };
  ocean.material.needsUpdate = true;

  /* house smoke: some houses each give off a wisp of smoke when you are close */
  const NS = 420, smoke = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshLambertMaterial({ color: '#E8E4DC', transparent: true, opacity: 0.75, depthWrite: false }), NS), sp = [];
  for (let i = 0; i < NS; i++) sp.push({ alive: false });
  smoke.frustumCulled = false; group.add(smoke);
  let chimneys = [];

  /* birds: flocks around the cities */
  // body along x (flight direction), wings along z; the wingbeat is the scale in z
  const wing = side => colored(new THREE.BoxGeometry(0.014, 0.004, 0.05).rotateX(side * 0.25).translate(-0.004, 0.006, side * 0.025), '#3A3632');
  const birdGeo = merge([wing(1), wing(-1), colored(new THREE.BoxGeometry(0.032, 0.008, 0.01), '#3A3632')]);
  const NB = 120, birds = new THREE.InstancedMesh(birdGeo, new THREE.MeshLambertMaterial({ vertexColors: true }), NB);
  birds.frustumCulled = false; group.add(birds);
  let flocks = [];

  function setCities(cities, houses) {
    // houses with a chimney (one in four) and flocks over the larger cities
    chimneys = houses.filter((h, i) => !h.temple && (i % 4 === 0)).map(h => ({ u: h.u, v: h.v, y: groundY(grid, Y, h.u, h.v) + h.h + 0.05, acc: R() }));
    flocks = cities.filter(c => c.size >= 1).slice(0, 12).map((c, i) => ({ c, r: 0.6 + R() * 0.9, h: 0.7 + R() * 0.5, sp: (0.15 + R() * 0.15) * (i % 2 ? 1 : -1), ph: R() * 6.28, n: 6 + ((R() * 5) | 0) }));
  }

  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), e = new THREE.Euler();
  let t = 0;
  function update(dt, cam) {
    t += dt; uTime.value = t; uNear.value = clamp((cam.ppu - 8) / 16, 0, 1); uFar.value = clamp((cam.ppu - 2.5) / 5, 0, 1);
    const ppu = cam.ppu, cx = cam.cur.tx, cz = cam.cur.tz, reach = Math.max(window.innerWidth, window.innerHeight) / ppu;
    // clouds
    const op = 0.5 * clamp((13 - ppu) / 7, 0, 1);
    clouds.visible = op > 0.01; cloudMat.opacity = op;
    if (clouds.visible) {
      cl.forEach((c, i) => {
        c.u += c.sp * dt; if (c.u > grid.cols + 10) c.u -= grid.cols + 20;
        m4.compose(p3.set(c.u, c.y, c.v), q.identity(), s3.set(c.s, c.s, c.s)); clouds.setMatrixAt(i, m4);
      });
      clouds.instanceMatrix.needsUpdate = true;
    }
    // smoke
    const smokeOn = ppu >= 18;
    smoke.visible = smokeOn;
    if (smokeOn) {
      for (const c of chimneys) {
        if (Math.abs(c.u - cx) > reach || Math.abs(c.v - cz) > reach) continue;
        c.acc += dt * 0.9; if (c.acc < 1) continue; c.acc -= 1;
        const s = sp.find(a => !a.alive); if (!s) break;
        Object.assign(s, { alive: true, age: 0, life: 2.6 + Math.random(), x: c.u, y: c.y, z: c.v, dx: 0.02 + Math.random() * 0.02 });
      }
      sp.forEach((a, i) => {
        if (a.alive) { a.age += dt; if (a.age > a.life) a.alive = false; }
        if (!a.alive) { m4.makeScale(0, 0, 0); smoke.setMatrixAt(i, m4); return; }
        const f = a.age / a.life, s = (0.012 + f * 0.035) * (f > 0.75 ? (1 - f) * 4 : 1);
        m4.makeScale(s, s, s).setPosition(a.x + a.dx * a.age, a.y + a.age * 0.06, a.z); smoke.setMatrixAt(i, m4);
      });
      smoke.instanceMatrix.needsUpdate = true;
    }
    // birds
    const birdsOn = ppu >= 14 && ppu < 160;
    birds.visible = birdsOn;
    if (birdsOn) {
      let k = 0;
      for (const f of flocks) {
        const near = Math.abs(f.c.u - cx) < reach && Math.abs(f.c.v - cz) < reach;
        for (let j = 0; j < f.n && k < NB; j++, k++) {
          if (!near) { m4.makeScale(0, 0, 0); birds.setMatrixAt(k, m4); continue; }
          const a = f.ph + t * f.sp - j * 0.05 * Math.sign(f.sp), off = (j % 2 ? 1 : -1) * Math.ceil(j / 2) * 0.05;
          const r = f.r + off, u = f.c.u + Math.cos(a) * r, v = f.c.v + Math.sin(a) * r * 0.8;
          const flap = 0.4 + 0.6 * Math.abs(Math.sin(t * 9 + j * 1.3)), dir = a + (f.sp > 0 ? Math.PI / 2 : -Math.PI / 2);
          q.setFromEuler(e.set(0, -dir, 0)); const sc = clamp(60 / ppu, 1, 3);
          m4.compose(p3.set(u, groundY(grid, Y, u, v) + f.h + Math.sin(t + j) * 0.03, v), q, s3.set(sc, sc, sc * flap)); birds.setMatrixAt(k, m4);
        }
      }
      for (; k < NB; k++) { m4.makeScale(0, 0, 0); birds.setMatrixAt(k, m4); }
      birds.instanceMatrix.needsUpdate = true;
    }
  }
  return { group, update, setCities };
}
