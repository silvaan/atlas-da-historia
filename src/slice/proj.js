// Equal Earth projection (Šavrič, Patterson and Jenny, 2018): true areas, the whole world on one sheet.
const A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, M = Math.sqrt(3) / 2, D = Math.PI / 180;

/* [lon, lat] in degrees -> [x, y], with y pointing down */
export function project(lon, lat) {
  const t = Math.asin(M * Math.sin(lat * D)), t2 = t * t, t6 = t2 * t2 * t2;
  return [lon * D * Math.cos(t) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))), -t * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))];
}
export function unproject(x, y) {
  let t = -y;
  for (let i = 0; i < 10; i++) {
    const t2 = t * t, t6 = t2 * t2 * t2;
    const d = (t * (A1 + A2 * t2 + t6 * (A3 + A4 * t2)) + y) / (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2));
    t -= d; if (Math.abs(d) < 1e-9) break;
  }
  const t2 = t * t, t6 = t2 * t2 * t2;
  const lon = M * x * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2)) / Math.cos(t) / D, s = Math.sin(t) / M;
  return [lon, Math.abs(s) > 1 ? NaN : Math.asin(s) / D];
}
export const WORLD = { w: 2 * project(180, 0)[0], h: 2 * project(0, -90)[1] };
