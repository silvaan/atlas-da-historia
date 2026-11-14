// Check: ships only on water, carts and people only on land, in every period.
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { GRID, isWater } from '../src/data/grid.js';
import { ERAS } from '../src/data/eras.js';
import { KEYFRAMES, eraAt } from '../src/data/history.js';
import { buildTerrain } from '../src/world/terrain.js';
import { buildRoutes } from '../src/world/overlays.js';
import { cityList } from '../src/world/settlements.js';
import { buildAgents } from '../src/world/agents.js';

const buf = readFileSync(new URL('../public/world.bin', import.meta.url)), n = GRID.cols * GRID.rows;
const grid = { ...GRID, terr: new Uint8Array(n), level: new Uint8Array(n) };
for (let i = 0; i < n; i++) { grid.terr[i] = buf[i * 2]; grid.level[i] = buf[i * 2 + 1]; }
const { Y } = buildTerrain(grid);
const water = (u, v) => isWater(grid.terr[Math.floor(v) * grid.cols + Math.floor(u)]);
let bad = 0;
// years of each key map, a few years before 1450 and every 10 years from 1450 to 2000
const years = [...new Set([...KEYFRAMES.map(k => k.from), -10000, -9000, -2000, 0, 800, 1300, ...Array.from({ length: 56 }, (_, i) => 1450 + i * 10)])].sort((a, b) => a - b);
for (const [key, era] of [...Object.entries(ERAS), ...KEYFRAMES.map(k => ['brasil ' + k.from, k]), ...years.map(y => ['ano ' + y, eraAt(y)])]) {
  const t0 = Date.now(), routes = buildRoutes(grid, Y, era), cities = cityList(era, grid), ms = Date.now() - t0;
  const ag = buildAgents(grid, Y, cities, routes.paths), [cart, camel, ship, canoe, body] = ag.group.children;
  const m = new THREE.Matrix4(), p = new THREE.Vector3(), cnt = { shipOnLand: 0, canoeOnLand: 0, cartInWater: 0, personInWater: 0 };
  for (let step = 0; step < 600; step++) {
    ag.update(0.1, { travel: true, people: true });
    if (step % 50) continue;
    for (let i = 0; i < ship.count; i++) { ship.getMatrixAt(i, m); p.setFromMatrixPosition(m); if (!water(p.x, p.z)) cnt.shipOnLand++; }
    for (let i = 0; i < canoe.count; i++) { canoe.getMatrixAt(i, m); p.setFromMatrixPosition(m); if (!water(p.x, p.z)) cnt.canoeOnLand++; }
    for (const mesh of [cart, camel]) for (let i = 0; i < mesh.count; i++) { mesh.getMatrixAt(i, m); p.setFromMatrixPosition(m); if (water(p.x, p.z)) cnt.cartInWater++; }
    for (let i = 0; i < body.count; i++) { body.getMatrixAt(i, m); p.setFromMatrixPosition(m); if (water(p.x, p.z)) cnt.personInWater++; }
  }
  const cityWater = cities.filter(c => water(c.u, c.v)).map(c => c.name);
  bad += cnt.shipOnLand + cnt.canoeOnLand + cnt.cartInWater + cnt.personInWater + cityWater.length;
  console.log(key, `routes ${ms} ms`, `ships ${ship.count} canoes ${canoe.count} carts ${cart.count} camels ${camel.count} people ${body.count}`, JSON.stringify(cnt), cityWater.length ? 'cities in water: ' + cityWater : '');
}
process.exit(bad ? 1 : 0);
