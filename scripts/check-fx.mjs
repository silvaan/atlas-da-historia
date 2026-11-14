// Animation check: in each one, nobody walks on water and no ship crosses land.
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { GRID, isWater } from '../src/data/grid.js';
import { EVENTS } from '../src/data/history.js';
import { ANIMS } from '../src/data/anims.js';
import { buildTerrain } from '../src/world/terrain.js';
import { FX } from '../src/world/fx.js';

const buf = readFileSync(new URL('../public/world.bin', import.meta.url)), n = GRID.cols * GRID.rows;
const grid = { ...GRID, terr: new Uint8Array(n), level: new Uint8Array(n) };
for (let i = 0; i < n; i++) { grid.terr[i] = buf[i * 2]; grid.level[i] = buf[i * 2 + 1]; }
const { Y } = buildTerrain(grid);
const water = (u, v) => isWater(grid.terr[Math.floor(v) * grid.cols + Math.floor(u)]);
const scene = new THREE.Scene(), fx = new FX(grid, Y, scene), m = new THREE.Matrix4(), p = new THREE.Vector3(), s = new THREE.Vector3(), q = new THREE.Quaternion();
let bad = 0;
for (const e of EVENTS) {
  const def = ANIMS[e.id]; if (!def) { console.log(e.id, 'no animation'); continue; }
  const t0 = Date.now(); fx.play(e, def, { loop: true, key: 'x' }); const ms = Date.now() - t0;
  const k = fx.list[0].k, cnt = { personInWater: 0, shipOnLand: 0 };
  for (let step = 0; step < 170; step++) {
    fx.tick(0.1, def.type === 'crossing' ? 4 : 60);
    if (step % 5) continue;
    for (let i = 0; i < k.body.count; i++) { k.body.getMatrixAt(i, m); m.decompose(p, q, s); if (s.x > 0.01 && water(p.x, p.z)) cnt.personInWater++; }
    for (let i = 0; i < k.hulls.count; i++) { k.hulls.getMatrixAt(i, m); m.decompose(p, q, s); if (s.x > 0.01 && !water(p.x, p.z)) cnt.shipOnLand++; }
  }
  bad += cnt.personInWater + cnt.shipOnLand;
  console.log(e.id.padEnd(15), def.type.padEnd(10), `${ms} ms`, `people ${k.people.length} ships ${k.ships.length} props ${k.props.length}`, cnt.personInWater + cnt.shipOnLand ? JSON.stringify(cnt) : 'ok');
  fx.stop();
}
process.exit(bad ? 1 : 0);
