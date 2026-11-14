// World grid: 0.5° per square, from 180°W to 180°E and from 84°N to 60°S.
export const GRID = { cols: 720, rows: 288, lon0: -180, lat0: 84, step: 0.5 };

export const T = { DEEP: 0, SHALLOW: 1, PLAIN: 2, FOREST: 3, DESERT: 4, HILL: 5, MOUNT: 6, TUNDRA: 7, ICE: 8, JUNGLE: 9, STEPPE: 10, FLOOD: 11 };
export const TERRAIN_NAMES = ['Ocean', 'Shallow sea', 'Plains', 'Forest', 'Desert', 'Hills', 'Mountains', 'Tundra', 'Ice', 'Tropical forest', 'Steppe', 'Floodplain'];

export const toUV = (lon, lat) => [(lon - GRID.lon0) / GRID.step, (GRID.lat0 - lat) / GRID.step];
export const toLonLat = (u, v) => [GRID.lon0 + u * GRID.step, GRID.lat0 - v * GRID.step];
export const isWater = t => t === T.DEEP || t === T.SHALLOW;

export async function loadGrid(url = '/world.bin') {
  const buf = new Uint8Array(await (await fetch(url)).arrayBuffer());
  const n = GRID.cols * GRID.rows, terr = new Uint8Array(n), level = new Uint8Array(n);
  for (let i = 0; i < n; i++) { terr[i] = buf[i * 2]; level[i] = buf[i * 2 + 1]; }
  return { ...GRID, terr, level };
}
