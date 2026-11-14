// Population by region, in millions. Series by J.-N. Biraben, "Essai sur l'évolution du nombre des hommes",
// Population 34(1), 1979, table by major regions.
// WARNING, PROTOTYPE: the numbers were transcribed from memory and must be checked against the original table
// before any serious use. They are estimates with a wide margin of error, especially before 1800 and outside Eurasia.
import { REGIONS } from './regions.js';

export const T0 = 1400, T1 = 1900;
const YEARS = [1400, 1500, 1600, 1700, 1750, 1800, 1850, 1900];
const POP = {
  na: [3, 3, 3, 2, 3, 5, 25, 90],
  la: [36, 39, 10, 10, 15, 19, 34, 75],
  eu: [52, 67, 89, 95, 111, 146, 209, 295],
  naf: [8, 8, 9, 9, 10, 9, 12, 23],
  ssa: [60, 78, 104, 97, 94, 92, 90, 95],
  me: [19, 23, 30, 30, 28, 28, 31, 38],
  ru: [13, 17, 22, 30, 35, 49, 79, 127],
  in: [74, 95, 145, 175, 165, 190, 216, 290],
  sea: [29, 33, 42, 53, 61, 68, 78, 115],
  cn: [70, 84, 110, 150, 220, 330, 435, 415],
  jp: [9, 10, 11, 25, 26, 26, 30, 44],
  oc: [2, 3, 3, 3, 3, 2, 2, 6]
};

export function lerpKeys(keys, y) {
  if (y <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (y <= keys[i][0]) { const [a, va] = keys[i - 1], [b, vb] = keys[i]; return va + (vb - va) * (y - a) / (b - a); }
  return keys[keys.length - 1][1];
}
const KEYS = Object.fromEntries(REGIONS.map(r => [r.id, YEARS.map((y, i) => [y, POP[r.id][i]])]));
export const popAt = (region, y) => lerpKeys(KEYS[region], y);
export const worldAt = y => REGIONS.reduce((s, r) => s + popAt(r.id, y), 0);
