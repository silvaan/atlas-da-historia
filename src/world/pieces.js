// Board pieces: miniatures on a round base, one for each event, monument and world landmark,
// and a pawn for each people or state on the period map. They appear when the thing happens (a little hop) and stay: the board fills up.
import * as THREE from 'three';
import { colored, merge } from './nature.js';
import { B, C, K, S, ring, MODELS } from './landmarks.js';
import { shipGeometry } from '../story/cabral.js';
import { groundY } from './settlements.js';
import { toUV } from '../data/grid.js';
import { EVENT_PIECE, KIND_PIECE, FLAG_COLORS, WORLD_PIECES, WORLD_CIVS } from '../data/pieces.js';
import { WORLD_EVENT_PIECES, WORLD_REPLACES } from '../data/world.js';

const D2R = Math.PI / 180;
const T = (geo, x, y, z) => geo.translate(x, y, z);
const rotZ = (g, a) => g.rotateZ(a), rotX = (g, a) => g.rotateX(a);
const person = (x, z, c, spear) => [C(0.03, 0.045, 0.14, 6, x, 0, z, c), S(0.03, x, 0.17, z, '#B98B66', false), ...(spear ? [colored(T(rotZ(new THREE.CylinderGeometry(0.006, 0.006, 0.34, 4), 0.25), x + 0.05, 0.16, z), '#6B4F35')] : [])];
const fire = (x, z) => [K(0.045, 0.1, 5, x, 0.02, z, '#F08A24'), K(0.025, 0.07, 5, x, 0.03, z, '#FFD45C'), B(0.12, 0.02, 0.02, x, 0, z, '#5A3B22'), B(0.02, 0.02, 0.12, x, 0, z, '#5A3B22')];
const wheel = (r, x, y, z, c, axis = 'z') => { const g = new THREE.TorusGeometry(r, r * 0.25, 4, 10); if (axis === 'x') g.rotateY(Math.PI / 2); return colored(T(g, x, y, z), c); };
const hbar = (r, len, x, y, z, c, ax = 'x') => { const g = new THREE.CylinderGeometry(r, r, len, 8); if (ax === 'x') g.rotateZ(Math.PI / 2); else g.rotateX(Math.PI / 2); return colored(T(g, x, y, z), c); };
const flagOn = (x, z, h, c) => [C(0.009, 0.009, h, 5, x, 0, z, '#E9E4D8'), B(0.2, 0.12, 0.01, x + 0.1, h - 0.13, z, c)];
const plane = (body, wing, stand = true) => [
  ...(stand ? [C(0.008, 0.008, 0.3, 5, 0, 0, 0, '#9AA6B2')] : []),
  hbar(0.035, 0.42, 0, 0.32, 0, body), K(0.035, 0.06, 8, 0, 0, 0, body).rotateZ(-Math.PI / 2).translate(0.24, 0.32, 0),
  B(0.12, 0.012, 0.5, 0.02, 0.31, 0, wing), B(0.07, 0.01, 0.18, -0.18, 0.33, 0, wing), B(0.06, 0.08, 0.01, -0.19, 0.33, 0, wing)
];

/* toy figure: legs, body in the army colour, yellow head and helmet */
const minifig = (x, z, c, hold) => [B(0.07, 0.09, 0.045, x, 0, z, '#2E3038'), B(0.08, 0.08, 0.05, x, 0.09, z, c), C(0.026, 0.026, 0.045, 10, x, 0.17, z, '#F2C94C'), S(0.031, x, 0.215, z, c),
  ...(hold === 'spear' ? [C(0.005, 0.005, 0.34, 4, x + 0.05, 0.02, z, '#6B4F35'), K(0.012, 0.04, 4, x + 0.05, 0.36, z, '#C8CED6')] : hold === 'flag' ? flagOn(x + 0.05, z, 0.42, c) : [])];
/* models: in map-square units (fit in a radius of ~0.28, height up to ~0.7) */
const P = {
  hunters: () => [...person(-0.1, 0.02, '#8A5A3A', true), ...person(0.1, -0.06, '#7A4E32', true), ...fire(0, 0.1)],
  cave: () => [colored(new THREE.SphereGeometry(0.24, 9, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(1.1, 0.9, 0.9), '#8D7B66'), B(0.12, 0.1, 0.02, 0, 0, 0.2, '#2A221B'), S(0.03, -0.12, 0.15, 0.17, '#B5452F'), S(0.025, 0.12, 0.12, 0.18, '#B5452F'), ...fire(0.18, 0.2)],
  shellmound: () => [K(0.28, 0.2, 12, 0, 0, 0, '#E6DFCC'), K(0.18, 0.14, 10, 0, 0.12, 0, '#F2ECDD'), ...ring(6, 0.22, (x, z) => S(0.025, x, 0.02, z, '#D9CDB0'))],
  garden: () => [C(0.26, 0.26, 0.02, 14, 0, 0, 0, '#3B2A1E'), ...ring(6, 0.16, (x, z) => K(0.05, 0.14, 6, x, 0.02, z, '#5FA052')), C(0.012, 0.015, 0.32, 5, 0, 0.02, 0, '#7A5A3A'), ...ring(5, 0.06, (x, z, a) => B(0.14, 0.008, 0.03, x, 0.33, z, '#3F8A4C').rotateY(-a))],
  canoe: () => [colored(new THREE.SphereGeometry(0.1, 8, 4).scale(2.6, 0.45, 0.6).translate(0, 0.04, 0), '#7A5232'), ...person(-0.1, 0, '#8A5A3A'), ...person(0.08, 0, '#7A4E32')],
  urn: () => [C(0.1, 0.07, 0.12, 12, 0, 0, 0, '#E3D2B0'), C(0.07, 0.1, 0.1, 12, 0, 0.12, 0, '#E3D2B0'), C(0.05, 0.05, 0.06, 10, 0, 0.22, 0, '#E3D2B0'), C(0.103, 0.103, 0.02, 12, 0, 0.11, 0, '#A8442E'), C(0.073, 0.081, 0.015, 12, 0, 0.18, 0, '#3A2A20')],
  village: () => [...ring(5, 0.18, (x, z) => [C(0.06, 0.06, 0.05, 8, x, 0, z, '#A0784A'), K(0.08, 0.1, 8, x, 0.05, z, '#D1AE62')]).flat(), C(0.08, 0.08, 0.01, 10, 0, 0, 0, '#C9B48A'), ...fire(0, 0)],
  maloca: () => [colored(new THREE.SphereGeometry(0.2, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(1.35, 1.25, 0.8), '#CDA65A'), B(0.06, 0.09, 0.02, 0, 0, 0.16, '#3A2A1C'), ...fire(0.2, 0.18)],
  scroll: () => [B(0.32, 0.006, 0.22, 0, 0.03, 0, '#F1E7CF'), hbar(0.03, 0.26, 0, 0.04, -0.12, '#E2D4B4', 'z').rotateY(Math.PI / 2), hbar(0.03, 0.26, 0, 0.04, 0.12, '#E2D4B4', 'z').rotateY(Math.PI / 2), S(0.035, 0.08, 0.04, 0.05, '#B3261E', false)],
  caravel: () => [shipGeometry().scale(1.6, 1.6, 1.6).translate(0, 0.05, 0)],
  slaveship: () => [shipGeometry().scale(1.6, 1.6, 1.6).translate(0, 0.05, 0), C(0.02, 0.02, 0.01, 6, 0, 0.13, 0, '#3A2A20')],
  logs: () => [0, 1, 2].flatMap(i => [hbar(0.04, 0.4, 0, 0.04 + (i === 2 ? 0.07 : 0), (i === 2 ? 0 : i * 0.09 - 0.045), '#9A3B2A')]),
  fort: o => MODELS.fort(o),
  plague: () => [...ring(5, 0.12, (x, z) => S(0.09, x, 0.18, z, '#8E9099', false)), S(0.11, 0, 0.24, 0, '#7E8089', false), B(0.025, 0.14, 0.025, 0, 0, 0, '#E8E2D6'), B(0.09, 0.025, 0.025, 0, 0.09, 0, '#E8E2D6')],
  mill: () => [B(0.3, 0.14, 0.2, -0.04, 0, 0, '#E9E1CF'), K(0.22, 0.08, 4, -0.04, 0.14, 0, '#A8573C', Math.PI / 4).scale(1, 1, 0.75), wheel(0.1, 0.17, 0.11, 0, '#6B4A2C', 'x'), C(0.03, 0.035, 0.3, 6, -0.14, 0, -0.06, '#B8AFA0'), S(0.05, -0.14, 0.34, -0.06, '#C9C9C9', false)],
  crown: () => [B(0.3, 0.07, 0.3, 0, 0, 0, '#9E2B2B'), C(0.11, 0.11, 0.09, 14, 0, 0.07, 0, '#E9B73A', true), C(0.105, 0.105, 0.012, 14, 0, 0.07, 0, '#C99A2A'), ...ring(6, 0.11, (x, z) => K(0.02, 0.07, 4, x, 0.16, z, '#E9B73A')), S(0.03, 0, 0.12, 0, '#3F6FB5', false)],
  palisade: () => [...ring(18, 0.23, (x, z) => C(0.022, 0.022, 0.16 + Math.abs(x * z) * 0.4, 5, x, 0, z, '#7A5A3A')), K(0.08, 0.12, 8, 0, 0, 0, '#C9A45C')],
  church: o => MODELS.church(o),
  flag: o => [K(0.12, 0.06, 10, 0, 0, 0, '#7A8A5A'), ...flagOn(0, 0, 0.5, o.color || '#C2413A')],
  flagred: () => [K(0.12, 0.06, 10, 0, 0, 0, '#5A5A5A'), ...flagOn(0, 0, 0.5, '#C2241E'), ...person(0.1, 0.08, '#4A4A52'), ...person(-0.1, 0.1, '#5A4A3A')],
  windmill: () => [C(0.07, 0.11, 0.3, 8, 0, 0, 0, '#E6DCC6'), K(0.09, 0.1, 8, 0, 0.3, 0, '#A8573C'), ...[0, 1].map(i => B(0.03, 0.5, 0.008, 0, 0.3, 0.1, '#6B4F35').translate(0, -0.3, 0).rotateZ(Math.PI / 4 + i * Math.PI / 2).translate(0, 0.3, 0))],
  gold: () => [C(0.2, 0.16, 0.04, 14, 0, 0, 0, '#6B5640'), ...ring(7, 0.08, (x, z, a, i) => S(0.045 + (i % 3) * 0.01, x, 0.05, z, '#F2C230', false)), S(0.06, 0, 0.09, 0, '#FFD54A', false)],
  barrels: () => [hbar(0.07, 0.16, -0.08, 0.07, 0.06, '#8A5A32', 'z'), hbar(0.07, 0.16, 0.08, 0.07, 0.06, '#8A5A32', 'z'), hbar(0.07, 0.16, 0, 0.19, 0.06, '#7A4E2C', 'z'), B(0.1, 0.16, 0.1, 0.12, 0, -0.14, '#B0884E')],
  ruins: () => [B(0.4, 0.04, 0.26, 0, 0, 0, '#CFC6B4'), C(0.025, 0.03, 0.22, 6, -0.14, 0.04, -0.08, '#DDD5C4'), C(0.025, 0.03, 0.12, 6, 0, 0.04, -0.08, '#DDD5C4'), C(0.025, 0.03, 0.18, 6, 0.14, 0.04, -0.08, '#DDD5C4'), hbar(0.025, 0.18, 0.04, 0.07, 0.07, '#CFC6B4'), B(0.06, 0.05, 0.06, -0.1, 0.04, 0.08, '#BDB3A0')],
  factory: () => [B(0.4, 0.14, 0.24, 0, 0, 0, '#9A5A44'), ...[-0.13, 0, 0.13].map(x => K(0.08, 0.07, 3, x, 0.14, 0, '#5E5A55').rotateY(Math.PI / 2).translate(0, 0, 0)), C(0.03, 0.04, 0.42, 8, 0.14, 0, -0.08, '#7A4A3A'), C(0.03, 0.04, 0.34, 8, -0.06, 0, -0.08, '#7A4A3A'), S(0.06, 0.15, 0.46, -0.08, '#9A9A9A', false), S(0.045, 0.19, 0.53, -0.08, '#B4B4B4', false)],
  palace: o => MODELS.palace(o),
  guillotine: () => [B(0.3, 0.04, 0.2, 0, 0, 0, '#6B4F35'), B(0.025, 0.4, 0.025, -0.07, 0.04, 0, '#7A5A3A'), B(0.025, 0.4, 0.025, 0.07, 0.04, 0, '#7A5A3A'), B(0.18, 0.03, 0.03, 0, 0.44, 0, '#7A5A3A'), B(0.12, 0.06, 0.012, 0, 0.32, 0, '#C8CED6')],
  cannon: () => [hbar(0.04, 0.36, 0.03, 0.12, 0, '#3A3A3E').rotateZ(0.25), wheel(0.08, -0.04, 0.08, 0.09, '#6B4A2C'), wheel(0.08, -0.04, 0.08, -0.09, '#6B4A2C'), B(0.22, 0.04, 0.12, -0.1, 0.04, 0, '#7A5A3A'), ...[0, 1, 2].map(i => S(0.03, 0.16 + i * 0.05, 0.03, 0.12 - (i % 2) * 0.05, '#2A2A2E', false))],
  steamship: () => [colored(new THREE.BoxGeometry(0.56, 0.08, 0.14).translate(0, 0.04, 0), '#2A2A30'), B(0.56, 0.03, 0.142, 0, 0, 0, '#A8322B'), B(0.3, 0.07, 0.1, -0.02, 0.08, 0, '#F1EDE4'), C(0.025, 0.03, 0.14, 8, 0.05, 0.15, 0, '#C9442E'), C(0.025, 0.03, 0.14, 8, -0.08, 0.15, 0, '#C9442E'), S(0.045, 0.06, 0.33, 0, '#8E8E8E', false), S(0.035, 0.0, 0.38, 0, '#ABABAB', false)],
  pagoda: () => [0, 1, 2, 3].flatMap(i => [B(0.2 - i * 0.03, 0.08, 0.2 - i * 0.03, 0, i * 0.11, 0, '#B8402E'), K(0.2 - i * 0.03, 0.05, 4, 0, i * 0.11 + 0.07, 0, '#3A4A3A', Math.PI / 4)]).concat([K(0.015, 0.1, 6, 0, 0.47, 0, '#D9A62E')]),
  rubber: () => [C(0.03, 0.04, 0.3, 6, 0, 0, 0, '#7A5A3A'), S(0.13, 0, 0.36, 0, '#3F7F45', false), S(0.09, 0.09, 0.3, 0.04, '#4F8F50', false), S(0.09, -0.08, 0.32, -0.04, '#3A7542', false), C(0.03, 0.025, 0.04, 8, 0.04, 0.1, 0.03, '#E9E2D0')],
  chain: () => [K(0.12, 0.05, 10, 0, 0, 0, '#7A7A70'), ...[0, 1, 2].map(i => colored(new THREE.TorusGeometry(0.05, 0.014, 5, 10).rotateY(i % 2 ? Math.PI / 2 : 0).translate(-0.13 + i * 0.075, 0.1 + i * 0.03, 0), '#9AA0A8')), ...[0, 1].map(i => colored(new THREE.TorusGeometry(0.05, 0.014, 5, 10).rotateY(i % 2 ? 0 : Math.PI / 2).translate(0.1 + i * 0.075, 0.13 - i * 0.03, 0), '#9AA0A8')), ...person(0.02, 0.12, '#E9E2D0')],
  telegraph: () => [C(0.012, 0.016, 0.5, 6, -0.1, 0, 0, '#6B4F35'), B(0.16, 0.015, 0.015, -0.1, 0.44, 0, '#6B4F35'), C(0.012, 0.016, 0.5, 6, 0.14, 0, 0.06, '#6B4F35'), B(0.16, 0.015, 0.015, 0.14, 0.44, 0.06, '#6B4F35'), hbar(0.003, 0.26, 0.02, 0.45, 0.03, '#2A2A2A').rotateY(-0.24)],
  skyscraper: () => [B(0.26, 0.26, 0.22, 0, 0, 0, '#B9B4AA'), B(0.18, 0.2, 0.15, 0, 0.26, 0, '#C9C4BA'), B(0.1, 0.12, 0.09, 0, 0.46, 0, '#D6D1C7'), C(0.01, 0.025, 0.14, 6, 0, 0.58, 0, '#D6D1C7'), ...[0, 1, 2, 3, 4].map(i => B(0.262, 0.012, 0.222, 0, 0.04 + i * 0.045, 0, '#7F8FA0'))],
  tank: () => [B(0.4, 0.07, 0.24, 0, 0.03, 0, '#5E6B3A'), B(0.42, 0.06, 0.06, 0, 0, 0.11, '#2E2E2A'), B(0.42, 0.06, 0.06, 0, 0, -0.11, '#2E2E2A'), C(0.09, 0.1, 0.07, 10, -0.02, 0.1, 0, '#6A7A42'), hbar(0.018, 0.26, 0.17, 0.14, 0, '#4E5A30')],
  oilrig: () => [...ring(4, 0.13, (x, z) => colored(T(new THREE.CylinderGeometry(0.008, 0.012, 0.52, 4).rotateZ(-x * 0.45).rotateX(z * 0.45), x * 0.5, 0.25, z * 0.5), '#5E5A55')), B(0.12, 0.012, 0.12, 0, 0.28, 0, '#5E5A55'), B(0.06, 0.04, 0.06, 0, 0.5, 0, '#5E5A55'), C(0.1, 0.1, 0.03, 10, 0.18, 0, 0.14, '#2A2A2A'), S(0.05, 0.18, 0.03, 0.14, '#1E1E1E', false)],
  congress: o => MODELS.congress(o),
  truck: () => [B(0.12, 0.12, 0.16, 0.16, 0.04, 0, '#C2413A'), B(0.3, 0.1, 0.18, -0.07, 0.04, 0, '#8A6A3E'), ...[[0.16, 0.08], [0.16, -0.08], [-0.1, 0.08], [-0.1, -0.08]].map(([x, z]) => wheel(0.04, x, 0.04, z, '#222')), B(0.7, 0.008, 0.12, 0, 0, 0.2, '#B07A4A')],
  book: () => [B(0.32, 0.03, 0.24, 0, 0, 0, '#7A2A2A'), B(0.15, 0.01, 0.22, -0.075, 0.03, 0, '#F4EEDF').rotateZ(0.08), B(0.15, 0.01, 0.22, 0.075, 0.03, 0, '#F4EEDF').rotateZ(-0.08), C(0.008, 0.004, 0.24, 5, 0.1, 0.04, -0.05, '#E9E4D8').rotateZ(-0.4)],
  crate: () => [B(0.16, 0.16, 0.16, -0.08, 0, 0, '#B0884E'), B(0.14, 0.14, 0.14, 0.1, 0, 0.04, '#A07A44'), B(0.12, 0.12, 0.12, -0.06, 0.16, 0.01, '#B9935A'), S(0.07, 0.12, 0.14, 0.03, '#D9C9A1', false)],
  coffee: () => [...[[-0.12, -0.08], [0.0, -0.12], [0.12, -0.06], [-0.06, 0.08]].flatMap(([x, z]) => [S(0.08, x, 0.1, z, '#2F6E3A', false), C(0.012, 0.012, 0.06, 4, x, 0, z, '#5A3B22'), S(0.015, x + 0.05, 0.12, z + 0.05, '#B3261E', false)]), C(0.07, 0.08, 0.12, 8, 0.15, 0, 0.12, '#C9B48A'), C(0.05, 0.07, 0.02, 8, 0.15, 0.12, 0.12, '#B7A070')],
  stones: o => MODELS.stones(o),
  steppyr: o => MODELS.steppyr(o),
  geoglyph: o => MODELS.geoglyph(o),
  wheat: () => ring(7, 0.15, (x, z) => [C(0.004, 0.004, 0.22, 3, x, 0, z, '#C9A24A'), K(0.022, 0.08, 5, x, 0.2, z, '#E6C25A')]).flat().concat([C(0.006, 0.006, 0.24, 3, 0, 0, 0, '#C9A24A'), K(0.025, 0.09, 5, 0, 0.22, 0, '#E6C25A')]),
  corn: () => ring(5, 0.12, (x, z) => [C(0.008, 0.01, 0.4, 4, x, 0, z, '#5F9A3A'), K(0.025, 0.1, 6, x + 0.03, 0.18, z, '#F2C230'), B(0.12, 0.006, 0.02, x, 0.28, z, '#6FAA48').rotateY(x * 4)]).flat(),
  bigben: () => [B(0.12, 0.42, 0.12, 0, 0, 0, '#C9AE7A'), B(0.14, 0.1, 0.14, 0, 0.42, 0, '#C9AE7A'), B(0.09, 0.09, 0.01, 0, 0.425, 0.072, '#F4EEDF'), K(0.09, 0.16, 4, 0, 0.52, 0, '#4A5A5A', Math.PI / 4), B(0.4, 0.14, 0.14, 0.22, 0, 0, '#C2A672')],
  liberty: () => [B(0.22, 0.14, 0.22, 0, 0, 0, '#B8AE9C'), B(0.16, 0.06, 0.16, 0, 0.14, 0, '#A8A08E'), K(0.08, 0.3, 8, 0, 0.2, 0, '#6FB5A0'), S(0.04, 0, 0.53, 0, '#7CC0AB', false), ...ring(5, 0.04, (x, z) => K(0.008, 0.04, 3, x, 0.55, z, '#7CC0AB')), B(0.025, 0.18, 0.025, 0.05, 0.46, 0, '#6FB5A0'), K(0.025, 0.05, 6, 0.05, 0.64, 0, '#F2C230')],
  plane: () => plane('#E9E2D0', '#D9CCB0'),
  bomber: () => plane('#5E6B4A', '#4E5A3C'),
  mushroom: () => [C(0.05, 0.09, 0.3, 10, 0, 0, 0, '#B0A090'), S(0.17, 0, 0.32, 0, '#D88A4A', false), colored(new THREE.TorusGeometry(0.15, 0.04, 6, 14).rotateX(Math.PI / 2).translate(0, 0.26, 0), '#9A8A7A'), S(0.12, 0, 0.42, 0, '#E8A860', false), C(0.24, 0.28, 0.03, 14, 0, 0, 0, '#6A5A4A')],
  rocket: () => [C(0.045, 0.05, 0.5, 10, 0, 0, 0, '#F2F0EA'), K(0.045, 0.12, 10, 0, 0.5, 0, '#F2F0EA'), C(0.051, 0.051, 0.03, 10, 0, 0.18, 0, '#1E1E1E'), ...ring(4, 0.06, (x, z) => B(0.012, 0.1, 0.06, x, 0, z, '#C2413A')), B(0.04, 0.55, 0.04, -0.12, 0, 0, '#C2413A'), B(0.08, 0.01, 0.01, -0.07, 0.35, 0, '#C2413A')],
  berlinwall: () => [...Array.from({ length: 6 }, (_, i) => B(0.08, 0.16, 0.04, -0.22 + i * 0.085, 0, 0, '#B7B3AC')), B(0.06, 0.3, 0.06, 0.04, 0, 0.14, '#8A8A84'), B(0.1, 0.06, 0.1, 0.04, 0.3, 0.14, '#9A9A94')],
  missile: () => [B(0.4, 0.06, 0.16, 0, 0.03, 0, '#5E6B3A'), ...[[0.14, 0.08], [0.14, -0.08], [-0.12, 0.08], [-0.12, -0.08]].map(([x, z]) => wheel(0.035, x, 0.035, z, '#222')), hbar(0.035, 0.4, 0, 0.0, 0, '#F2F0EA').rotateZ(0.6).translate(0, 0.24, 0), K(0.035, 0.08, 8, 0, 0, 0, '#C2413A').rotateZ(-Math.PI / 2 + 0.6).translate(0.19, 0.38, 0)],
  opera: () => [B(0.5, 0.05, 0.26, 0, 0, 0, '#D9CFB8'), ...[0, 1, 2].map(i => colored(new THREE.SphereGeometry(0.13 - i * 0.02, 8, 5, 0, Math.PI, 0, Math.PI / 2).rotateZ(-0.35).translate(-0.14 + i * 0.13, 0.05, 0), '#F7F5F0'))],
  dam: () => [colored(new THREE.CylinderGeometry(0.42, 0.42, 0.16, 16, 1, true, -0.6, 1.2).translate(0, 0.08, 0.3), '#C9C4BA'), C(0.4, 0.4, 0.01, 16, 0, 0.12, 0.38, '#3E7FB0').scale(1, 1, 0.4)],
  reactor: () => [C(0.1, 0.15, 0.32, 14, -0.08, 0, 0, '#C9C4BA', true), C(0.15, 0.15, 0.01, 14, -0.08, 0, 0, '#9A958C'), S(0.08, -0.08, 0.38, 0, '#D4D4D4', false), B(0.16, 0.12, 0.16, 0.16, 0, 0.04, '#B9B4AA'), C(0.02, 0.02, 0.24, 6, 0.16, 0.12, 0.04, '#D6D1C7')],
  eiffel: o => MODELS.eiffel(o),
  pyramids: o => MODELS.pyramids(o),
  army: o => [...minifig(-0.1, 0.06, o.color, 'spear'), ...minifig(0.1, 0.06, o.color, 'spear'), ...minifig(0, -0.08, o.color, 'flag')],
  pawn: o => [C(0.16, 0.2, 0.06, 16, 0, 0, 0, o.color), C(0.08, 0.15, 0.22, 16, 0, 0.06, 0, o.color), C(0.11, 0.11, 0.03, 16, 0, 0.27, 0, o.color), S(0.085, 0, 0.36, 0, o.color, false)]
};
// monuments that do not have a piece model yet use the map one
const model = (name, o) => (P[name] || (MODELS[name] ? (x => MODELS[name](x)) : P.crate))(o || {});

/* piece base: a low disc in the type colour, with a light rim on the edge */
const tokenBase = (base, rim) => [C(0.2, 0.22, 0.045, 20, 0, 0, 0, base), C(0.205, 0.205, 0.014, 20, 0, 0.034, 0, rim, true)];
/* round base of a board piece, in the type colour; the miniature sits on top */
function pieceGeometry(name, { base = '#2A2F3A', rim = '#F2B544', color } = {}) {
  const parts = name === 'pawn' ? model('pawn', { color }) : [...tokenBase(base, rim), ...model(name, { color }).map(g => g.translate(0, 0.05, 0))];
  return merge(parts.map(g => g.getAttribute('color') ? g : colored(g, '#999')));
}

export class Pieces {
  constructor(grid, Y, { events, kinds, landmarks }) {
    this.grid = grid; this.Y = Y;
    this.globe = new THREE.Group(); this.map = new THREE.Group();
    this.mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
    this.mapMat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });   // the map one is bent over the sphere; the globe one is not
    this.geos = new Map(); this.items = []; this.civ = []; this.year = -Infinity; this.sel = null; this.hidden = new Set();
    const defs = [];
    // wars and revolts: while they last, two armies advance against each other on the spot
    for (const e of events) if (e.k === 'conflict') for (const sd of [-1, 1]) {
      const c = Math.max(0.3, Math.cos(e.p[1] * D2R));
      defs.push({ key: 'war-' + e.id + sd, evId: e.id, name: e.t, lon: e.p[0] + sd * 2.2 / c, lat: e.p[1] + 0.6 * sd, from: e.y, to: (e.y2 ?? e.y) + 2, model: 'army', color: sd < 0 ? '#C2413A' : '#3F6FB5', base: '#2A2D36', rim: sd < 0 ? '#C2413A' : '#3F6FB5', army: true, kind: e.k, walk: [e.p[0] + sd * 0.7 / c, e.p[1] + 0.2 * sd], ph: sd > 0 ? 0 : 0 });
    }
    for (const e of events) defs.push({ key: e.id, ev: e, name: e.t, lon: e.p[0], lat: e.p[1], from: e.y, to: null, model: EVENT_PIECE[e.id] || WORLD_EVENT_PIECES[e.id] || KIND_PIECE[e.k], color: FLAG_COLORS[e.id], base: kinds[e.k].color, kind: e.k });
    for (const lm of landmarks) if (lm.p && lm.type !== 'wall') defs.push({ key: 'lm-' + lm.id, name: lm.name, lon: lm.p[0], lat: lm.p[1], from: lm.built, to: lm.gone ?? null, model: lm.type, base: '#6E6656', rim: '#D8CDB4', landmark: true, major: lm.major, opts: lm });
    for (const [id, name, p, from, to, m] of WORLD_PIECES) if (!WORLD_REPLACES.includes(id)) defs.push({ key: 'w-' + id, name, lon: p[0], lat: p[1], from, to, model: m, base: '#232836', rim: '#9AA6B8' });
    // ancient civilizations: only until the period maps start showing states worldwide (1450)
    WORLD_CIVS.forEach(([name, p, from, to, color], k) => {
      defs.push({ key: 'c-' + name + from, name, lon: p[0], lat: p[1], from, to, model: 'pawn', color, civ: true, size: 120 });
      // two armies marching around
      for (const s of [-1, 1]) defs.push({ key: 'a-' + name + from + s, name, lon: p[0] + s * 3.2, lat: p[1] - 1.5 * s, from, to, model: 'army', color, base: '#2A2D36', rim: color, army: true, walk: [p[0] + s * 1.2, p[1] + 2.2 * s], ph: k * 1.3 + s });
    });
    defs.sort((a, b) => a.from - b.from);
    // pieces at the same place spread out in a spiral (the oldest stays in the centre)
    const placed = [], D = 1.25;
    for (const d of defs) {
      let lon = d.lon, lat = d.lat;
      if (d.army) { d.plon = lon; d.plat = lat; continue; }
      for (let k = 1; k < 60 && placed.some(q => near(q, lon, lat, D)); k++) { const a = k * 2.4, r = D * 0.85 * Math.sqrt(k); lon = d.lon + Math.cos(a) * r / Math.max(0.3, Math.cos(d.lat * D2R)); lat = d.lat + Math.sin(a) * r; }
      placed.push([lon, lat]); d.plon = lon; d.plat = lat;
    }
    for (const d of defs) this.items.push(this.#make(d));
    this.byKey = new Map(this.items.map(it => [it.d.key, it]));
  }

  #geo(name, opts) {
    const k = name + '|' + (opts.base || '') + '|' + (opts.color || '') + '|' + (opts.rim || '');
    if (!this.geos.has(k)) this.geos.set(k, opts.lm ? merge([...tokenBase(opts.base, opts.rim), ...MODELS[name](opts.lm).map(g => g.translate(0, 0.05, 0))]) : pieceGeometry(name, opts));
    return this.geos.get(k);
  }
  #make(d) {
    const geo = d.landmark ? this.#geo(d.model, { base: d.base, rim: d.rim, lm: d.opts }) : this.#geo(d.model, { base: d.base, color: d.color, rim: d.rim });
    const walk = d.walk ? { b: toUV(...d.walk), ph: d.ph || 0, T: 18 } : null;
    const g = new THREE.Mesh(geo, this.mat), m = new THREE.Mesh(geo, this.mapMat);
    for (const x of [g, m]) { x.visible = false; x.matrixAutoUpdate = false; }
    this.globe.add(g); if (!d.landmark) this.map.add(m);   // on the map the monuments already exist at map size
    const [u, v] = toUV(d.plon, d.plat), yaw = (Math.abs(d.lon * 13.7 + d.lat * 7.1) % 1) * 1.2 - 0.6;
    if (walk) walk.a = [u, v];
    return { d, g, m, u, v, yaw, born: -1e9, on: false, y: groundY(this.grid, this.Y, u, v), walk };
  }
  /* names of the pieces that are not events (world landmarks and ancient civilizations) visible now, for the labels */
  named() { return this.items.filter(it => it.on && !it.d.ev && !it.d.landmark && !it.d.army).map(it => ({ name: it.d.name, u: it.u, v: it.v, civ: !!it.d.civ, ref: { key: it.d.key.startsWith('w-') ? 'wp:' + it.d.key.slice(2) : 'civ:' + it.d.name, name: it.d.name, u: it.u, v: it.v } })); }
  /* where an event's piece sits (so the clickable marker stays next to it) */
  lonlat(id) { const it = this.byKey.get(id); return it ? [it.d.plon, it.d.plat] : null; }

  /* peoples and states on the period map: a pawn in each one's colour (and villages or hunters where there is no state yet) */
  setCivs(list) {
    for (const c of this.civ) { c.g.removeFromParent(); c.m.removeFromParent(); }
    this.civ = list.map(c => {
      const geo = c.model === 'pawn' ? this.#geo('pawn', { color: c.color }) : c.model === 'army' ? this.#geo('army', { base: '#2A2D36', rim: c.color, color: c.color }) : this.#geo(c.model, { base: '#3A3328', rim: '#B89A6A' });
      const g = new THREE.Mesh(geo, this.mat), m = new THREE.Mesh(geo, this.mapMat);
      for (const x of [g, m]) { x.matrixAutoUpdate = false; }
      this.globe.add(g); this.map.add(m);
      const [u, v] = toUV(c.lon, c.lat);
      return { d: { key: 'civ-' + c.name + (c.k ?? ''), name: c.name, civ: c.model !== 'army', army: c.model === 'army', region: c.model !== 'army' && c.model !== 'pawn', state: true, size: c.size || 1 }, g, m, u, v, yaw: 0, born: performance.now(), on: true, y: groundY(this.grid, this.Y, u, v),
        walk: c.walk ? { a: [u, v], b: c.walk, ph: (c.k || 0) * 1.7, T: 16 + ((c.k || 0) % 5) * 3 } : null };
    });
  }

  setYear(y) {
    const now = performance.now(), forward = y > this.year && y - this.year < 400;
    for (const it of this.items) {
      const { d } = it, on = y >= d.from && (d.to == null || y < d.to) && !(d.kind && this.hidden.has(d.kind));
      if (on && !it.on && forward) it.born = now;
      it.on = on;
    }
    this.year = y;
  }

  /* armies march slowly between two points of their own territory */
  #walk(it, now) {
    const w = it.walk; if (!w) return;
    const t = ((now / 1000 + w.ph) % w.T) / w.T, f = 0.5 - 0.5 * Math.cos(t * Math.PI * 2);
    it.u = w.a[0] + (w.b[0] - w.a[0]) * f; it.v = w.a[1] + (w.b[1] - w.a[1]) * f;
    it.yaw = -Math.atan2(w.b[1] - w.a[1], w.b[0] - w.a[0]) + (t < 0.5 ? 0 : Math.PI) - Math.PI / 2;
    it.y = groundY(this.grid, this.Y, it.u, it.v);
  }
  #pop(it, now) { const t = (now - it.born) / 520; if (t >= 1) return 1; if (t <= 0) return 0.001; const s = 1.70158; const q = t - 1; return 1 + (s + 1) * q * q * q + s * q * q; }

  /* on the globe: standing on the sphere, size on screen grows slowly with zoom */
  tickGlobe(globe) {
    // size on screen grows with zoom, but on the globe a piece never exceeds ~1.7° (otherwise, from far away, pieces cover continents)
    const now = performance.now(), ppu = globe.ppuU.value, px = Math.min(70, Math.max(5, 32 * Math.pow(ppu / 700, 0.6)));
    const base = Math.min(px / ppu, 0.03) / 0.55, far = ppu < 420, q = new THREE.Quaternion(), qy = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), p = new THREE.Vector3(), s = new THREE.Vector3(), n = new THREE.Vector3();
    for (const it of [...this.items, ...this.civ]) {
      // from very far away only the main pieces and the state pawns remain
      const on = it.on && !(far && it.d.army) && !(far && !it.d.major && !it.d.civ && it.d.key !== this.sel);
      it.g.visible = on; if (!on) continue;
      this.#walk(it, now);
      globe.xyz(it.u, it.v, 1.0, p); n.copy(p).normalize(); q.setFromUnitVectors(up, n); qy.setFromAxisAngle(up, it.yaw); q.multiply(qy);
      const k = base * this.#pop(it, now) * (it.d.key === this.sel ? 1.4 : 1) * (it.d.civ ? 0.75 + 0.25 * Math.min(2, Math.sqrt(it.d.size / 60)) : 1) * (it.d.major ? 1.5 : 1) * (it.d.army ? 0.8 : 1);
      it.g.matrix.compose(p, q, s.setScalar(k)); it.g.matrixWorldNeedsUpdate = true;
    }
  }
  /* on the map: on the ground, a little larger than true scale from far away (like the monuments) */
  tickMap(ppu, playing) {
    const now = performance.now(), sc = Math.min(7, Math.max(1, 30 * Math.pow(Math.max(ppu, 3) / 4, 0.2) / ppu / 0.5)), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), p = new THREE.Vector3(), s = new THREE.Vector3();
    for (const it of [...this.items, ...this.civ]) {
      // the selected event has its animation on the spot: the piece gets out of the way; pawns only from far away
      const on = it.on && !(it.d.key === this.sel && playing) && !(it.d.civ && ppu >= 12) && !(it.d.army && ppu < 4.5);
      it.m.visible = on; if (!on) continue;
      this.#walk(it, now); q.setFromAxisAngle(up, it.yaw);
      it.m.matrix.compose(p.set(it.u, it.y, it.v), q, s.setScalar(sc * this.#pop(it, now) * (it.d.civ ? 1.2 : 1) * (it.d.army ? 0.9 : 1))); it.m.matrixWorldNeedsUpdate = true;
    }
  }
  /* visible piece nearest to the screen point; project(it) → [x, y] or null */
  pick(project, x, y, onGlobe, r = 22) {
    let best = null, bd = r * r;
    for (const it of [...this.items, ...this.civ]) {
      if (!(onGlobe ? it.g.visible : it.m.visible)) continue;
      const p = project(it); if (!p) continue;
      const d = (p[0] - x) ** 2 + (p[1] - 8 - y) ** 2 * 0.7;   // the piece sits a little above its base point
      if (d < bd) { bd = d; best = it; }
    }
    return best && { d: best.d, u: best.u, v: best.v };
  }
  get count() { return this.items.filter(it => it.on).length + this.civ.length; }
}

function near([a, b], lon, lat, D) { const dl = (a - lon) * Math.cos(lat * D2R); return dl * dl + (b - lat) ** 2 < D * D; }

/* ---------- traffic on the globe: ships on the period routes, planes between big cities (1919+), satellites (1957+) ---------- */
const HUBS = [[-0.1, 51.5], [2.35, 48.86], [-74, 40.7], [-43.2, -22.9], [-46.6, -23.5], [-58.4, -34.6], [-9.1, 38.7], [-17.4, 14.7], [31.2, 30.0], [37.6, 55.75],
  [139.7, 35.7], [116.4, 39.9], [77.2, 28.6], [151.2, -33.9], [-118.2, 34.0], [-99.1, 19.4], [28.0, -26.2], [-34.9, -8.05], [103.8, 1.35], [55.3, 25.2], [-87.6, 41.9], [18.4, -33.9]];
const unit = ([lon, lat]) => new THREE.Vector3(Math.cos(lat * D2R) * Math.cos(lon * D2R), Math.sin(lat * D2R), -Math.cos(lat * D2R) * Math.sin(lon * D2R));

export class Traffic {
  constructor(scene) {
    this.group = new THREE.Group(); scene.add(this.group);
    this.mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
    this.geo = {
      caravel: shipGeometry(),
      steam: merge(P.steamship()).scale(0.6, 0.6, 0.6),
      plane: merge(plane('#F1EDE4', '#C9CFD8', false).map(g => g.translate(0, -0.32, 0))),
      sat: merge([B(0.08, 0.08, 0.08, 0, -0.04, 0, '#D9B23A'), B(0.02, 0.005, 0.26, 0, 0, 0, '#3F6FB5'), C(0.004, 0.004, 0.1, 4, 0.03, 0.04, 0, '#DDD')])
    };
    this.ships = []; this.planes = []; this.sats = []; this.year = -Infinity; this.lanes = [];
  }
  #mesh(geo) { const m = new THREE.Mesh(geo, this.mat); m.matrixAutoUpdate = false; this.group.add(m); return m; }
  #clear(list) { for (const x of list) x.m.removeFromParent(); list.length = 0; }

  /* sea routes of the period ([[u, y, v], ...] in map squares) */
  setLanes(lanes, grid) {
    this.grid = grid;
    this.lanes = lanes.filter(l => l.length > 4).map(pts => { const L = [0]; for (let k = 1; k < pts.length; k++) L.push(L[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][2] - pts[k - 1][2])); return { pts, L, len: L.at(-1) }; });
    this.#ships();
  }
  #ships() {
    this.#clear(this.ships);
    const steam = this.year >= 1840, n = Math.min(18, this.lanes.length * 2);
    for (let i = 0; i < n; i++) { const lane = this.lanes[i % this.lanes.length]; this.ships.push({ lane, s: ((i * 0.37) % 1) * lane.len, dir: i % 2 ? 1 : -1, m: this.#mesh(steam ? this.geo.steam : this.geo.caravel) }); }
    this.steam = steam;
  }
  setYear(y) {
    const was = this.year; this.year = y;
    if ((was >= 1840) !== (y >= 1840) && this.lanes.length) this.#ships();
    const np = y < 1919 ? 0 : Math.min(30, Math.floor((y - 1915) / 2.5)), ns = y < 1957 ? 0 : Math.min(9, 1 + Math.floor((y - 1957) / 5));
    while (this.planes.length < np) { const k = this.planes.length, a = HUBS[(k * 7) % HUBS.length], b = HUBS[(k * 11 + 3) % HUBS.length]; if (a === b) { this.planes.push({ skip: true, m: this.#mesh(this.geo.plane) }); continue; } this.planes.push({ a: unit(a), b: unit(b), f: (k * 0.29) % 1, m: this.#mesh(this.geo.plane) }); }
    while (this.planes.length > np) this.planes.pop().m.removeFromParent();
    while (this.sats.length < ns) { const k = this.sats.length; this.sats.push({ inc: 0.3 + k * 0.55, node: k * 1.9, a: k * 2.1, m: this.#mesh(this.geo.sat) }); }
    while (this.sats.length > ns) this.sats.pop().m.removeFromParent();
  }
  tick(dt, globe) {
    const ppu = globe.ppuU.value, px = Math.min(60, Math.max(12, 20 * Math.pow(ppu / 400, 0.42))), k = px / ppu / 0.4;
    const p = new THREE.Vector3(), q = new THREE.Vector3(), n = new THREE.Vector3(), f = new THREE.Vector3(), sd = new THREE.Vector3(), sc = new THREE.Vector3();
    const place = (m, pos, fwd, up, s) => { fwd.addScaledVector(up, -fwd.dot(up)).normalize(); sd.crossVectors(fwd, up); m.matrix.makeBasis(fwd, up, sd).scale(sc.setScalar(s)).setPosition(pos); m.matrixWorldNeedsUpdate = true; };
    // ships: go back and forth along the route, slowly
    for (const sh of this.ships) {
      const { lane } = sh; sh.s += sh.dir * dt * 3.5;
      if (sh.s > lane.len) { sh.s = lane.len; sh.dir = -1; } if (sh.s < 0) { sh.s = 0; sh.dir = 1; }
      let i = 1; while (i < lane.pts.length - 1 && lane.L[i] < sh.s) i++;
      const a = lane.pts[i - 1], b = lane.pts[i], t = (sh.s - lane.L[i - 1]) / ((lane.L[i] - lane.L[i - 1]) || 1);
      globe.xyz(a[0] + (b[0] - a[0]) * t, a[2] + (b[2] - a[2]) * t, 1.002, p); globe.xyz(b[0], b[2], 1.002, q);
      if (sh.dir < 0) globe.xyz(a[0], a[2], 1.002, q);
      n.copy(p).normalize(); place(sh.m, p, f.subVectors(q, p), n, k * 0.9);
    }
    // planes: great-circle arc, climbing and descending
    for (const pl of this.planes) {
      if (pl.skip) { pl.m.visible = false; continue; }
      const ang = pl.a.angleTo(pl.b); pl.f += dt * 0.05 / Math.max(0.3, ang); if (pl.f > 1) { pl.f = 0; [pl.a, pl.b] = [pl.b, pl.a]; }
      const h = 1.01 + 0.06 * Math.sin(Math.PI * pl.f) * Math.min(1, ang);
      p.copy(pl.a).lerp(pl.b, pl.f).normalize(); q.copy(pl.a).lerp(pl.b, Math.min(1, pl.f + 0.01)).normalize();
      n.copy(p); p.multiplyScalar(h); place(pl.m, p, f.subVectors(q.multiplyScalar(h), p), n, k * 0.8);
    }
    // satellites: inclined orbits
    for (const st of this.sats) {
      st.a += dt * 0.35;
      const c = Math.cos(st.a), s = Math.sin(st.a), ci = Math.cos(st.inc), si = Math.sin(st.inc), cn = Math.cos(st.node), sn = Math.sin(st.node);
      const x = c, y = s * si, z = s * ci;
      p.set(x * cn - z * sn, y, x * sn + z * cn).multiplyScalar(1.22); n.copy(p).normalize();
      f.set(-s * cn - c * ci * sn, c * si, -s * sn + c * ci * cn);
      place(st.m, p, f, n, k * 0.9);
    }
  }
}
