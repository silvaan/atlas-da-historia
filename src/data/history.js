// Thread "Brazil in the world": from the first inhabitants (some 14,000 years ago) to the Constitution of 1988,
// with events linked to one another across the Atlantic.
// Outlines and cities are approximate: until 1822 drawn by hand; after that, present-day outlines (Natural Earth)
// cut or completed by hand where the border of the time was different (Acre, Cisplatina, northern Mexico...).
// Negative years are BC. `scale` maps year → position on the timeline (linear segments).
// Links: from cause to effect. `debated` marks the ones historians debate.
import { COUNTRIES } from './countries.js';
import { WORLD_EVENTS, WORLD_LINKS, WORLD_SOURCES } from './world.js';

export const THREAD = { id: 'thread', title: 'World history', min: -12000, max: 2000, start: 1500, scale: [[-12000, 0], [0, 0.06], [1450, 0.17], [2000, 1]] };

// Chapters: the great periods of the thread. The time ruler shows one chapter at a time, each with its own scale.
// short: short name for the chapter strip; focus: [lon, lat] where the globe looks when the chapter opens.
export const CHAPTERS = [
  { id:'foragers', short:'Foragers', title:'Foragers and the first temples', from:-12000, to:-7500, focus:[15,25],
    txt:'The last ice age ends. On every continent except Antarctica, groups of hunters and gatherers move with the seasons. Some gather for part of the year to build huge works, such as Göbekli Tepe, before there is any farming. In South America, there are people at Lagoa Santa and in the Amazon.' },
  { id:'gardens', short:'Gardens', title:'Gardens, villages and sambaquis', from:-7500, to:-3500, focus:[30,20],
    txt:'Wheat in the Fertile Crescent, rice on the Yangtze, maize in Mexico, manioc in the Amazon: farming begins in many places, with no single center. For thousands of years, many people plant a little and keep hunting and gathering. Large villages appear, such as Çatalhöyük, and the palace-free megasites of Ukraine.' },
  { id:'cities', short:'Cities', title:'The first cities', from:-3500, to:-1000, focus:[45,25],
    txt:'Uruk, the Indus Valley, Egypt, Crete and Caral, in Peru: cities of tens of thousands of people. Some have kings, writing and temple-palaces; others, like those of the Indus, show almost no signs of rulers. Writing is born to count debts and taxes.' },
  { id:'antiquity', short:'Antiquity', title:'Republics and great empires', from:-1000, to:500, focus:[50,30],
    txt:'Athens and Rome invent forms of assembly and republic; Alexander, Rome and the Han build huge empires, linked by the Silk Road. In the Americas, Teotihuacan and the Maya cities grow; in the Amazon, Tupi-Guarani peoples spread out and terra preta (dark earth) enriches the soil.' },
  { id:'routes', short:'Routes', title:'A world of routes', from:500, to:1450, focus:[60,20],
    txt:'Caravans, monsoons and steppes link the world before the Europeans: Chang’an, Baghdad, the Mali of Mansa Musa, Great Zimbabwe, the Mongols. Polynesians cross the Pacific, Vikings reach America, Cahokia and Tenochtitlan flourish. The Black Death travels along the same routes.' },
  { id:'oceans', short:'Oceans', title:'The oceans connect', from:1450, to:1550, focus:[-25,15],
    txt:'The Ottomans take Constantinople, the printing press spreads books, Columbus reaches the Caribbean and Vasco da Gama reaches India. Within a few decades, epidemics and conquest bring down the Mexica and the Incas. Portugal reaches the coast of Brazil and begins to compete for the Atlantic.' },
  { id:'silver', short:'Silver', title:'Silver, sugar and the slave trade', from:1550, to:1690, focus:[-25,5],
    txt:'Silver from Potosí and Mexico flows through Europe and through Manila to China. In the Atlantic, sugar mills in Brazil and the Caribbean buy millions of enslaved Africans. Dutch and English companies create joint-stock capitalism; in Europe, religious wars end with the Peace of Westphalia.' },
  { id:'enlightenment', short:'Enlightenment', title:'Gold, trade and the Enlightenment', from:1690, to:1789, focus:[-20,20],
    txt:'Gold from Minas and Atlantic trade finance Europe. Philosophers debate freedom and inequality, partly spurred by Indigenous critiques such as Kandiaronk’s. The English East India Company wins at Plassey, the United States declares independence and the Industrial Revolution begins in England.' },
  { id:'revolutions', short:'Revolutions', title:'The age of revolutions', from:1789, to:1830, focus:[-30,20],
    txt:'France, Haiti, Spanish America and Brazil: in forty years, kings and colonies fall on both sides of the Atlantic. Napoleon redraws Europe and pushes the Portuguese court to Rio. Great Britain bans the slave trade, but slavery goes on in the Americas.' },
  { id:'steam', short:'Steam', title:'Steam, coffee and empires', from:1830, to:1880, focus:[20,25],
    txt:'Steamships, railways and the telegraph shrink the world. Great Britain forces China to open its ports in the Opium War; Europe goes through the revolutions of 1848; Japan modernizes in the Meiji era. In the United States and in Brazil, slavery is at the center of wars and disputes.' },
  { id:'scramble', short:'Scramble', title:'The carving up of the world', from:1880, to:1914, focus:[15,5],
    txt:'At the Berlin Conference, the European powers divide Africa; only Ethiopia, at Adwa, and Liberia escape. Rubber from the Congo and the Amazon costs thousands of lives. Brazil abolishes slavery and becomes a republic; millions of Europeans and Japanese emigrate to the Americas.' },
  { id:'worldwars', short:'World wars', title:'The world wars', from:1914, to:1945, focus:[15,40],
    txt:'Two world wars, the Russian Revolution, the crash of 1929 and fascism. Gandhi challenges the British Empire with the Salt March. The Second World War kills tens of millions, includes the Holocaust and ends with the atomic bombs on Japan.' },
  { id:'coldwar', short:'Cold War', title:'Cold War and decolonization', from:1945, to:2000, focus:[10,25],
    txt:'The United States and the USSR split the world into blocs and bet on bombs, missiles and rockets. India, China and almost all of Africa free themselves from the empires. In Latin America, military coups; then, a return to democracy. The Berlin Wall falls in 1989 and apartheid ends in South Africa.' }
];
export const chapterAt = y => CHAPTERS.findLast(c => c.from <= y) || CHAPTERS[0];

export const KINDS = {
  government: { label: 'Crowns, governments and treaties', color: '#3F6FB5' },
  economy: { label: 'Trade, sugar, gold and the slave trade', color: '#C98A1B' },
  conflict: { label: 'Wars and revolts', color: '#C2413A' },
  ideas: { label: 'Ideas and revolutions', color: '#7A5BA6' },
  peoples: { label: 'Peoples and other ways of living together', color: '#2F8A6A' }
};

export const LINK_TYPES = {
  cause: 'cause',
  enables: 'paved the way',
  provokes: 'provoked a reaction',
  inspires: 'inspired',
  connects: 'same process'
};

/* ---------- outlines [lon, lat] ----------*/
const PT = [[-9.5, 37.0], [-8.9, 37.0], [-7.4, 37.2], [-7.0, 38.2], [-7.3, 39.4], [-6.9, 40.2], [-6.8, 41.0], [-6.2, 41.6], [-8.1, 42.1], [-8.9, 41.9], [-8.7, 40.6], [-9.5, 38.7]];
const ES = [[-9.3, 43.3], [-7.0, 43.6], [-1.8, 43.4], [0.7, 42.8], [3.2, 42.4], [3.2, 41.8], [0.9, 41.0], [-0.3, 39.4], [0.2, 38.7], [-0.8, 37.6], [-2.0, 36.7], [-5.3, 36.0], [-6.3, 36.8], [-7.4, 37.2], [-7.0, 38.2], [-7.3, 39.4], [-6.9, 40.2], [-6.8, 41.0], [-6.2, 41.6], [-8.1, 42.1], [-8.9, 42.3]];
const FR = [[8.2, 49.0], [7.6, 47.6], [6.8, 47.3], [6.1, 46.2], [7.0, 45.5], [6.8, 44.2], [7.5, 43.8], [6.0, 43.1], [3.1, 43.1], [3.1, 42.4], [0.7, 42.8], [-1.8, 43.4], [-1.2, 46.0], [-2.5, 47.3], [-4.7, 48.0], [-4.7, 48.6], [-1.6, 48.7], [-1.3, 49.7], [1.6, 50.2], [2.5, 51.1], [4.2, 49.9]];
const GB = [[-5.7, 50.0], [-3.0, 50.7], [1.4, 51.2], [1.7, 52.7], [0.2, 53.5], [-0.5, 54.5], [-1.6, 55.6], [-2.0, 57.6], [-3.4, 58.6], [-5.0, 58.6], [-6.2, 57.5], [-5.6, 56.3], [-5.0, 55.0], [-3.1, 55.0], [-3.0, 53.9], [-3.1, 53.3], [-4.6, 53.3], [-4.2, 52.3], [-5.3, 51.8], [-3.5, 51.4], [-5.6, 51.0]];
const NL = [[3.4, 51.4], [4.2, 51.4], [6.0, 51.8], [6.8, 52.2], [7.1, 53.2], [6.0, 53.5], [4.7, 52.9], [4.0, 51.9]];
const KONGO = [[12.2, -5.8], [12.5, -4.6], [14.5, -4.3], [16.3, -4.8], [16.6, -6.6], [15.5, -8.2], [13.3, -8.4], [12.8, -7.0]];
const ANGOLA = [[13.0, -8.4], [13.6, -8.4], [15.0, -8.8], [15.5, -9.6], [14.5, -10.5], [13.8, -10.8], [13.3, -9.8]];
const ANGOLA_BIG = [[12.9, -8.2], [15.5, -8.3], [17.0, -9.0], [17.0, -11.0], [15.0, -13.0], [13.6, -12.8], [13.2, -10.0]];
const INCA = [[-78.5, 1.5], [-76.5, 0], [-75.5, -4], [-74, -10], [-71, -14], [-68, -17], [-65.5, -20], [-65, -24], [-66.5, -29], [-69, -33], [-71, -35], [-72.2, -35], [-71.6, -33], [-70.3, -18.5], [-75.2, -15.5], [-77.1, -12], [-79.9, -7], [-81.2, -5], [-80, -2], [-80.1, 0.8]];
const AZTEC = [[-101, 21], [-98, 21.3], [-97, 19], [-94, 18], [-93.5, 16.5], [-96.5, 15.8], [-100, 17], [-101.5, 18.5]];
const NEW_SPAIN = [[-110, 30], [-104, 30], [-98, 26], [-97.5, 21], [-96, 19], [-94.5, 18.2], [-91, 18.6], [-90.4, 21], [-87, 21.5], [-88, 16], [-92, 14.5], [-95, 16], [-100, 17], [-105.5, 20.5], [-106, 23.5], [-109, 27]];
const ANDES_ES = [[-80, 1], [-77, 4], [-75.5, 10.5], [-71.5, 11.5], [-72, 7], [-75, 1], [-74, -5], [-72, -12], [-68, -17], [-65, -20], [-64, -24], [-65, -28], [-68, -33], [-71.5, -36], [-73.5, -37.5], [-71.6, -33], [-70.3, -18.5], [-75.2, -15.5], [-77.1, -12], [-79.9, -7], [-81.2, -5], [-80, -2]];
const PLATA_ES = [[-58.5, -34.4], [-57, -27], [-55, -25], [-57.5, -23.5], [-60, -24], [-60, -31], [-60.5, -34.0]];
const CUBA = [[-84.9, 21.9], [-82, 23.2], [-77, 22.3], [-74.2, 20.2], [-77.7, 19.8], [-80.5, 21.8]];
const HISPANIOLA = [[-74.4, 18.5], [-72.8, 19.9], [-69.9, 19.7], [-68.4, 18.6], [-71.3, 17.6]];
const HISP_EAST = [[-71.7, 19.8], [-69.9, 19.7], [-68.4, 18.6], [-71.3, 17.6], [-71.7, 18.3]];
const SAINT_DOMINGUE = [[-74.4, 18.5], [-72.8, 19.9], [-71.7, 19.8], [-71.7, 18.3], [-72.0, 18.0], [-74.4, 18.2]];
const JAMAICA = [[-78.4, 18.5], [-76.2, 18.2], [-76.2, 17.8], [-77.9, 17.8]];
// Portuguese Brazil at each moment
const BR_1549 = [
  [[-38.0, -11.0], [-38.6, -13.5], [-39.0, -15.5], [-39.2, -17.5], [-39.9, -17.6], [-39.6, -15.5], [-39.3, -13.5], [-38.6, -11.0]],
  [[-34.8, -7.3], [-35.2, -9.0], [-35.8, -9.0], [-35.4, -7.3]],
  [[-45.5, -23.6], [-46.4, -24.1], [-47.0, -24.4], [-47.1, -23.6], [-46.4, -23.3], [-45.6, -23.2]]
];
const BR_COAST = [[-34.9, -6.8], [-34.8, -7.5], [-35.2, -9.4], [-37.0, -11.2], [-38.6, -13.0], [-39.0, -15.5], [-39.3, -18.0], [-40.3, -20.3], [-41.0, -22.0], [-43.2, -23.0], [-45.0, -23.6], [-46.9, -24.4], [-47.8, -24.9], [-47.6, -24.0], [-46.5, -23.1], [-44.5, -22.6], [-42.5, -21.8], [-41.2, -20.0], [-40.3, -18.0], [-40.0, -15.5], [-39.6, -13.0], [-38.2, -11.0], [-36.3, -9.4], [-35.6, -7.2], [-35.4, -6.8]];
const BR_NORTH = [[-48.5, -0.8], [-44.3, -2.3], [-41.5, -2.8], [-38.5, -3.6], [-35.2, -5.1], [-34.9, -6.8], [-35.4, -6.8], [-36.5, -5.5], [-39, -4.5], [-41.5, -3.6], [-44.5, -3.3], [-48.5, -2.2]];
const NL_BRAZIL = [[-44.3, -2.4], [-41.5, -2.8], [-38.5, -3.6], [-35.2, -5.1], [-34.8, -7.4], [-35.3, -9.6], [-36.4, -10.5], [-37.2, -11.3], [-37.9, -10.9], [-37.0, -9.6], [-36.2, -8.2], [-36.3, -6.6], [-38.5, -4.6], [-41.5, -3.6], [-44.3, -3.2]];
const BR_1700 = [
  [[-50, -0.5], [-48.5, -0.8], [-44.3, -2.3], [-41.5, -2.8], [-38.5, -3.6], [-35.2, -5.1], [-34.8, -7.4], [-35.2, -9.4], [-37.0, -11.2], [-38.6, -13.0], [-39.0, -15.5], [-39.3, -18.0], [-40.3, -20.3], [-41.0, -22.0], [-43.2, -23.0], [-45.0, -23.6], [-46.9, -24.4], [-48.5, -26.0], [-49.5, -26.0], [-48.5, -23.0], [-47.0, -21.5], [-45.0, -19.5], [-44.5, -17.0], [-44.0, -14.0], [-43.0, -11.0], [-41.0, -9.0], [-39.0, -7.0], [-42, -5.5], [-46, -4.5], [-49.5, -3.5], [-51.5, -1.5]],
  [[-51.5, -1.5], [-55, -2.2], [-60, -3.0], [-60, -3.6], [-55, -2.9], [-51.5, -2.3]],
  [[-58.4, -34.7], [-57.3, -34.7], [-57.3, -34.1], [-58.4, -34.1]]
];
const BR_1750 = [[-51.6, 4.2], [-50.0, 1.7], [-47.9, -0.6], [-44.4, -2.5], [-41.8, -2.9], [-38.5, -3.7], [-35.2, -5.2], [-34.8, -7.2], [-35.2, -9.4], [-37.0, -11.2], [-38.6, -13.0], [-39.0, -15.5], [-39.3, -18.0], [-40.3, -20.3], [-41.0, -22.0], [-43.2, -23.0], [-45.0, -23.6], [-46.9, -24.4], [-48.5, -26.0], [-48.6, -28.4], [-50.0, -30.8], [-52.0, -32.5], [-53.4, -33.7], [-53.5, -32.4], [-55.6, -30.9], [-57.6, -30.2], [-55.8, -28.2], [-53.8, -27.1], [-54.6, -25.6], [-54.3, -24.0], [-55.6, -22.5], [-57.9, -22.1], [-58.1, -20.1], [-58.2, -16.3], [-60.3, -15.1], [-60.2, -13.6], [-62.0, -13.0], [-65.3, -10.9], [-66.6, -9.9], [-69.9, -4.2], [-69.4, -1.2], [-66.0, 0.8], [-64.0, 2.0], [-64.8, 4.0], [-62.0, 4.2], [-60.0, 5.2], [-59.8, 2.5], [-56.5, 1.9], [-54.5, 2.3]];
const ES_SOUTH_1750 = [[-72, 11.5], [-62, 10.7], [-60, 8.5], [-61, 5], [-64.8, 4.0], [-64.0, 2.0], [-66.0, 0.8], [-69.4, -1.2], [-69.9, -4.2], [-66.6, -9.9], [-65.3, -10.9], [-62.0, -13.0], [-60.2, -13.6], [-60.3, -15.1], [-58.2, -16.3], [-58.1, -20.1], [-57.9, -22.1], [-55.6, -22.5], [-54.3, -24.0], [-54.6, -25.6], [-53.8, -27.1], [-55.8, -28.2], [-57.6, -30.2], [-55.6, -30.9], [-53.5, -32.4], [-53.4, -33.7], [-55, -34.9], [-58.4, -34.6], [-60, -35.5], [-64, -34.5], [-68, -35], [-71, -37], [-73.5, -38], [-71.6, -33], [-71.4, -30], [-70.3, -23], [-70.3, -18.5], [-75.2, -15.5], [-77.1, -12], [-79.9, -7], [-81.2, -5], [-80, -2], [-80.1, 0.8], [-78.9, 1.8], [-77.3, 4], [-77.5, 7.5], [-76, 9.5], [-75.5, 10.5]];

// Before 1450 (very approximate: areas of influence, not borders)
const MOCHE = [[-80.9, -4.9], [-79.9, -5.3], [-78.6, -7.4], [-77.9, -9.2], [-78.3, -9.6], [-79.4, -8.2], [-80.2, -6.8], [-81.2, -6.0]];
const WARI = [[-78.6, -7.3], [-77.4, -7.6], [-76.0, -10.0], [-74.6, -11.6], [-73.0, -13.0], [-71.8, -13.8], [-72.4, -14.8], [-74.4, -14.9], [-76.0, -13.4], [-77.4, -11.4], [-78.6, -9.2]];
const TIWANAKU = [[-70.9, -15.0], [-69.2, -14.6], [-67.6, -15.6], [-66.8, -17.2], [-67.2, -19.0], [-68.6, -19.8], [-70.2, -18.6], [-71.2, -17.2]];
const CHIMU = [[-80.6, -3.5], [-79.6, -4.6], [-78.5, -6.6], [-77.6, -9.0], [-76.9, -11.4], [-77.4, -11.8], [-78.4, -9.8], [-79.6, -8.0], [-81.3, -6.0], [-81.3, -4.3]];
// After 1822: pieces the present-day border does not show. They come before, in the list, the country that holds them today.
const ACRE = [[-74.0, -7.1], [-65.4, -9.8], [-65.3, -10.3], [-66.6, -9.95], [-68.7, -11.15], [-69.6, -11.0], [-70.6, -11.0], [-70.6, -9.5], [-72.2, -10.0], [-73.2, -9.4], [-72.9, -8.9], [-74.0, -7.5]];   // Bolivian until 1903
const BOL_COAST = [[-70.5, -21.4], [-68.2, -21.3], [-67.7, -22.9], [-67.2, -24.0], [-70.6, -24.0]];   // Bolivian coast, lost to Chile in the War of the Pacific (1879–1884)
const PERU_SOUTH = [[-70.5, -18.3], [-69.4, -17.6], [-69.0, -18.0], [-68.9, -19.0], [-68.4, -19.5], [-68.3, -21.3], [-70.5, -21.4]];   // Arica and Tarapacá, Peruvian until 1880–1883
const PY_APA = [[-58.2, -22.1], [-55.7, -22.1], [-55.6, -21.4], [-57.9, -20.9]];   // between the Apa and Branco rivers: Paraguayan until 1870
const PY_MISIONES = [[-55.9, -27.3], [-54.6, -25.6], [-53.6, -26.2], [-54.0, -27.2], [-55.0, -27.9]];   // Misiones, held by Paraguay until the war
const MX_NORTH = [[-125, 42], [-106, 42], [-106, 38.5], [-100, 37.8], [-100, 34.5], [-94.5, 33.7], [-94.0, 32], [-93.8, 29.7], [-97, 26], [-100, 26], [-106, 31.8], [-111, 31.3], [-114.8, 32.5], [-117.1, 32.5], [-124.5, 40]];   // northern Mexico until 1836–1848
const DDR = [[10.9, 54.0], [14.2, 53.9], [14.4, 53.3], [14.1, 52.8], [14.7, 52.1], [14.6, 51.0], [12.1, 50.3], [11.9, 50.4], [10.9, 50.4], [10.0, 50.6], [10.0, 51.4], [10.5, 51.8], [10.6, 52.6], [11.2, 53.0], [10.6, 53.4]];

/* present-day outlines (countries.js): a country's largest ring, or the ring that contains a point*/
const inBox = (r, lon, lat) => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const [x, y] of r) { a = Math.min(a, x); c = Math.max(c, x); b = Math.min(b, y); d = Math.max(d, y); } return lon >= a && lon <= c && lat >= b && lat <= d; };
const big = n => (COUNTRIES[n] || []).reduce((a, r) => (!a || r.length > a.length ? r : a), null);
const ringAt = (n, lon, lat) => (COUNTRIES[n] || []).filter(r => inBox(r, lon, lat)).sort((a, b) => b.length - a.length)[0];
const allOf = n => COUNTRIES[n] || [];
/* clips a ring to a band of latitudes (for borders that did not yet reach as far south)*/
function clipLat(ring, y0, keepNorth) {
  const out = [], inside = p => keepNorth ? p[1] >= y0 : p[1] <= y0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    if (inside(a)) out.push(a);
    if (inside(a) !== inside(b)) { const f = (y0 - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * f, y0]); }
  }
  return out;
}
const band = (ring, south, north) => ring && clipLat(clipLat(ring, south, true), north, false);

/* ---------- reused pieces ----------*/
const E = (name, c, ...rings) => ({ name, c, poly: rings.filter(r => r && r.length > 2) });
const portugal = n => E(n || 'Portugal', 0, PT);
const europe = (es = 'Castile and Aragon', gb = 'England') => [E(es, 1, ES), E('France', 4, FR), E(gb, 5, GB)];
const IBERIA_CITIES = [['Lisbon', -9.14, 38.72, 3, 'r', 1], ['Seville', -5.99, 37.39, 2, 'r']];
const LANES = {
  india: [[-9.5, 38.6], [-17, 28], [-24, 15], [-28, 0], [-30, -20], [-15, -33], [5, -38], [18, -36], [25, -35.5], [35, -26], [42, -15], [45, -5], [55, 5], [70, 10], [75.5, 11.2]],
  lisbonSalvador: [[-9.5, 38.6], [-17, 28], [-25, 10], [-32, -5], [-38.3, -13]],
  lisbonOlinda: [[-9.5, 38.6], [-17, 28], [-25, 15], [-30, 0], [-34.7, -8.0]],
  lisbonRio: [[-9.5, 38.6], [-17, 28], [-25, 15], [-30, 0], [-35, -15], [-43.1, -23.0]],
  luandaSalvador: [[13.1, -8.8], [0, -11], [-20, -13], [-38.3, -13]],
  luandaRecife: [[13.1, -8.8], [0, -8], [-20, -8], [-34.7, -8.0]],
  luandaRio: [[13.1, -8.8], [0, -15], [-25, -22], [-43.1, -23.0]],
  recifeAmsterdam: [[-34.7, -8.0], [-28, 5], [-25, 25], [-15, 45], [-5, 49.5], [2, 51.2], [4.0, 52.4]],
  lisbonLondon: [[-9.5, 38.6], [-10, 43], [-6, 48.5], [-2, 50.2], [1.2, 51.2]],
  court: [[-9.5, 38.6], [-17, 28], [-25, 10], [-32, -5], [-38.3, -13], [-37, -18], [-43.1, -23.0]]
};
// Steamship lines (and later cargo ships) from 1850. On the 0.5° grid the Strait of Gibraltar is closed,
// so the Mediterranean lines stop on one side of the strait and start again on the other.
const STEAM = {
  liverpoolPlate: [[-3.6, 53.7], [-5.5, 51.5], [-6.5, 49.5], [-10, 43], [-9.6, 38.6], [-17, 28], [-25, 12], [-32, -4], [-34.6, -8.1], [-38.3, -13.1], [-38.5, -17], [-41, -22.5], [-43.1, -23.05], [-46.3, -24.1], [-50, -30], [-55, -35.3], [-56.2, -35.0], [-58.0, -34.7]],
  genoaSantos: [[8.8, 44.2], [5, 41.5], [-1, 37], [-4.6, 36.2], [-6.5, 36.0], [-12, 33], [-20, 20], [-28, 5], [-34, -8], [-37.5, -16], [-41, -23.3], [-46.3, -24.1]],
  rioNewYork: [[-46.3, -24.1], [-43.1, -23.05], [-38, -18], [-34.5, -7], [-36, -2], [-50, 10], [-62, 20], [-70, 30], [-73.8, 40.3]],
  belemLiverpool: [[-48.2, -0.6], [-46, 1.5], [-40, 5], [-30, 20], [-20, 40], [-10, 47], [-5.5, 51], [-3.6, 53.7]],
  coastal: [[-48.2, -0.6], [-44.2, -2.4], [-38.5, -3.6], [-34.9, -6.0], [-34.6, -8.1], [-38.3, -13.1], [-38.5, -17], [-41, -22.5], [-43.1, -23.05], [-46.3, -24.1], [-48.4, -27.6], [-51.0, -31.8]],
  kobeSantos: [[135.1, 33.8], [131, 31], [122, 22], [112, 12], [105, 3], [96, 6], [80, 5], [60, -10], [40, -30], [25, -36.5], [18, -35], [0, -30], [-30, -26], [-46.3, -24.1]],
  rioNaples: [[-43.1, -23.05], [-35, -15], [-30, 0], [-25, 15], [-17, 28], [-9.5, 36.3], [-6.5, 36.0], [-4.6, 36.2], [0, 37], [8, 38.5], [12.5, 39.8], [14.2, 40.6]],
  santosHamburg: [[-46.3, -24.1], [-38, -18], [-34.5, -7], [-28, 5], [-20, 25], [-12, 44], [-5, 48.5], [2, 51.3], [8.3, 54]]
};

/* States after 1822: who appears, under what name and with what outline, in each year.
   Order matters: each square goes to the first State whose outline contains it.*/
function statesAt(y) {
  const L = [], add = (cond, name, c, ...rings) => { if (cond) L.push(E(name, c, ...rings)); };
  const CA = ['Guatemala', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica'].map(big);
  const CHILE = big('Chile'), ARG = big('Argentina');
  // South America
  add(true, y < 1825 ? 'Upper Peru (royalist until 1825)' : 'Bolivia', 7, big('Bolivia'), y < 1903 && ACRE, y < 1880 && BOL_COAST);
  add(true, 'Peru', 3, big('Peru'), y < 1880 && PERU_SOUTH);
  add(true, 'Paraguay', 1, big('Paraguay'), y < 1870 && PY_APA, y < 1870 && PY_MISIONES);
  add(y >= 1828, 'Uruguay', 3, big('Uruguay'));
  add(true, y < 1889 ? 'Empire of Brazil' : 'Brazil', 6, big('Brazil'), y < 1828 && big('Uruguay'));
  add(true, y < 1831 ? 'United Provinces of the Río de la Plata' : y < 1861 ? 'Argentine Confederation' : 'Argentina', 4, ...(y < 1880 ? [band(ARG, -36, 0)] : allOf('Argentina')));
  add(true, 'Chile', 2, ...(y < 1883 ? [band(CHILE, -38.5, 0), band(CHILE, -43.6, -39.6)] : allOf('Chile')));
  add(y < 1831, 'Gran Colombia', 1, big('Colombia'), big('Venezuela'), big('Ecuador'), big('Panama'));
  add(y >= 1831, y < 1858 ? 'New Granada' : 'Colombia', 1, big('Colombia'), y < 1903 && big('Panama'));
  add(y >= 1831, 'Venezuela', 2, big('Venezuela'));
  add(y >= 1831, 'Ecuador', 7, big('Ecuador'));
  add(y >= 1903, 'Panama', 7, big('Panama'));
  add(true, y < 1966 ? 'British Guiana' : 'Guyana', y < 1966 ? 5 : 3, big('Guyana'));
  add(true, y < 1975 ? 'Suriname (Dutch)' : 'Suriname', y < 1975 ? 2 : 7, big('Suriname'));
  add(true, 'French Guiana', 4, ringAt('France', -53, 4));
  // North America, Central America and the Caribbean
  add(true, y < 1823 ? 'Mexican Empire' : 'Mexico', 1, big('Mexico'), y < 1848 && MX_NORTH, ...(y < 1823 ? CA : []));
  add(y >= 1823, y < 1840 ? 'United Provinces of Central America' : 'Central American republics', 3, ...CA);
  add(true, 'United States', 4, ringAt('United States of America', -100, 40), y >= 1867 && ringAt('United States of America', -150, 64), y >= 1898 && big('Puerto Rico'));
  add(true, y < 1867 ? 'British North America' : y < 1931 ? 'Canada (British dominion)' : 'Canada', y < 1931 ? 5 : 2, big('Canada'), ringAt('Canada', -56, 49));
  add(y >= 1898, 'Cuba', 3, big('Cuba'));
  add(true, 'Haiti', 3, big('Haiti'), y < 1844 && big('Dominican Rep.'));
  add(y >= 1844, 'Dominican Republic', 7, big('Dominican Rep.'));
  add(y >= 1962, 'Jamaica', 2, big('Jamaica'));
  add(y >= 1962, 'Trinidad and Tobago', 2, big('Trinidad and Tobago'));
  add(y >= 1981, 'Belize', 7, big('Belize'));
  // Europe
  add(true, 'Portugal', 0, big('Portugal'), ...(y < 1889 ? [ANGOLA_BIG] : y < 1975 ? [big('Angola'), ringAt('Angola', 12.3, -5.2), big('Mozambique')] : []));
  add(true, 'Spain', 1, big('Spain'), y < 1898 && big('Cuba'), y < 1898 && big('Puerto Rico'));
  add(true, 'France', 4, ringAt('France', 2, 47), ringAt('France', 9.1, 42.1));
  add(true, 'United Kingdom', 5, ringAt('United Kingdom', -2, 53), ringAt('United Kingdom', -6.7, 54.6), y < 1922 && big('Ireland'), y < 1962 && big('Jamaica'), y < 1962 && big('Trinidad and Tobago'), y < 1981 && big('Belize'));
  add(y >= 1922, 'Ireland', 2, big('Ireland'));
  add(true, 'Netherlands', 2, big('Netherlands'), y < 1830 && big('Belgium'), y < 1830 && big('Luxembourg'));
  add(y >= 1830, 'Belgium', 3, big('Belgium'));
  add(y >= 1861, 'Italy', 3, ...allOf('Italy'));
  add(y >= 1949, 'East Germany', 3, DDR);
  add(y >= 1870, y < 1919 ? 'German Empire' : y < 1949 ? 'Germany' : 'West Germany', 7, big('Germany'));
  // Africa and Asia
  add(y >= 1975, 'Angola', 3, big('Angola'), ringAt('Angola', 12.3, -5.2));
  add(y >= 1975, 'Mozambique', 2, big('Mozambique'));
  add(y >= 1850, y < 1868 ? 'Japan (Tokugawa shogunate)' : 'Japan', 0, ...allOf('Japan'));
  return L;
}
/* cities outside Brazil after 1822*/
function worldCities(y) {
  return [
    ['Lisbon', -9.14, 38.72, 3, 'r', 1], ['Madrid', -3.7, 40.42, y < 1900 ? 2 : 3, 'r', 1], ['London', -0.12, 51.5, 3, 'r', 1], ['Liverpool', -2.98, 53.4, 2, 'r'], ['Paris', 2.35, 48.86, 3, 'r', 1],
    ['Luanda', 13.23, -8.84, y < 1950 ? 1 : 2, 'r', y >= 1975 ? 1 : 0], ['New York', -74.0, 40.71, y < 1850 ? 2 : 3, 'r'], ['Mexico City', -99.13, 19.43, 3, 'r', 1],
    ['Lima', -77.04, -12.05, 2, 'r', 1], ['Santiago', -70.65, -33.45, y < 1900 ? 1 : 2, 'r', 1], ['Bogotá', -74.07, 4.71, y < 1930 ? 1 : 2, 'r', 1], ['Asunción', -57.63, -25.28, 1, 'r', 1],
    ['Buenos Aires', -58.38, -34.6, y < 1880 ? 2 : 3, 'r', 1], ['Montevideo', -56.17, -34.9, y < 1900 ? 1 : 2, 'r', y >= 1828 ? 1 : 0], ['Port-au-Prince', -72.34, 18.54, 1, 'r', 1],
    ...(y >= 1831 ? [['Caracas', -66.9, 10.5, y < 1950 ? 1 : 2, 'r', 1]] : []),
    ...(y >= 1850 ? [['New Orleans', -90.07, 29.95, 1, 'r'], ['Hamburg', 9.99, 53.55, 2, 'r'], [y < 1868 ? 'Edo' : 'Tokyo', 139.7, 35.68, 3, 'r', 1]] : []),
    ...(y >= 1870 ? [['Genoa', 8.93, 44.55, 2, 'r'], ['Naples', 14.6, 40.9, 2, 'r'], ['Rome', 12.5, 41.9, 2, 'r', 1], ['Berlin', 13.4, 52.52, y < 1900 ? 2 : 3, 'r', y < 1949 ? 1 : 0], ['Kobe', 135.19, 34.69, y < 1900 ? 1 : 2, 'r']] : [])
  ];
}

/* ---------- background maps: each one applies from the year `from` ----------*/
export const KEYFRAMES = [
  {
    from: -12000, label: 'The first inhabitants',
    caption: 'At least 14,000 years ago, groups of hunters and gatherers already live in South America, from Monte Verde, in southern Chile, to the Brazilian cerrado. There are no large villages and no States: there are camps, rock shelters and paths walked with the seasons. The sea is tens of meters below today’s level, and giant ground sloths and mastodons still exist. When and by which way the first people arrived is debated; in the Serra da Capivara, Niède Guidon argued for much older dates.',
    empires: [],
    cities: [['Monte Verde', -73.2, -41.5, 1, 'x'], ['Pedra Furada (Serra da Capivara)', -42.6, -8.8, 1, 'x']],
    regions: [['cerrado hunters', -46, -16], ['forest peoples', -62, -4], ['Andean hunters', -69, -20], ['pampas hunters', -62, -34]],
    roads: [], lanes: []
  },
  {
    from: -6000, label: 'Sambaquis and first gardens',
    caption: 'On the coast, from Rio Grande do Sul to Bahia, fishers and gatherers build the sambaquis, shell mounds that last for thousands of years. In the southwestern Amazon, people start growing manioc, squash and peppers without giving up hunting, fishing and gathering. Near Santarém, at Taperinha, one of the oldest potteries in the Americas appears.',
    empires: [],
    cities: [['Santa Catarina sambaquis', -48.9, -28.3, 1, 'x'], ['Guanabara sambaquis', -43.0, -22.75, 1, 'x'], ['Cananeia sambaquis', -47.95, -24.8, 1, 'x'], ['Taperinha', -54.3, -2.5, 1, 'x'], ['Teotônio (upper Madeira)', -64.06, -8.86, 1, 'x'], ['Pedra Furada (Serra da Capivara)', -42.6, -8.8, 1, 'x']],
    regions: [['sambaqui peoples', -46, -27], ['first gardens', -63, -11], ['cerrado hunters', -46, -16], ['forest peoples', -60, -4]],
    roads: [], lanes: []
  },
  {
    from: 600, label: 'Amazonia and the Andes',
    caption: 'On Marajó Island, villages on raised mounds make painted pottery; in Acre, people dig hundreds of geometric ditches in the forest; near Manaus, large villages leave behind terra preta (dark earth). In the Andes, Tiwanaku, Wari and the Moche build temples and cities. Very different ways of life coexist on the same continent, and none is a stage on the way to another.',
    empires: [E('Moche', 1, MOCHE), E('Wari', 7, WARI), E('Tiwanaku', 3, TIWANAKU)],
    cities: [['Marajó mounds', -49.4, -0.95, 2, 'x'], ['Acre geoglyphs', -67.6, -10.0, 1, 'x'], ['Açutuba', -60.4, -3.1, 1, 'x'], ['Santa Catarina sambaquis', -48.9, -28.3, 1, 'x'],
      ['Tiwanaku', -68.67, -16.55, 3, 'a', 1], ['Huari', -74.2, -13.07, 2, 'a', 1], ['Huacas de Moche', -79.0, -8.13, 2, 'a', 1], ['Tikal', -89.62, 17.22, 3, 'a']],
    regions: [['expanding Tupi-Guarani peoples', -52, -19], ['Jê peoples', -47, -13], ['Arawak and Carib peoples', -62, -1], ['sambaqui peoples', -46, -27]],
    roads: [], lanes: []
  },
  {
    from: 1100, label: 'Before the Incas',
    caption: 'On the coast of Peru, the Chimú kingdom rules from Chan Chan, a huge adobe city; Tiwanaku and Wari have already broken up. In the Amazon, the Tapajó and the Marajoara culture are at their height, and on the upper Xingu the garden villages grow. Tupi and Guarani peoples hold much of the coast and of the Paraná and Uruguay basins. In the Mississippi valley, Cahokia brings together thousands of people around great earth mounds.',
    empires: [E('Chimú', 1, CHIMU)],
    cities: [['Chan Chan', -79.0, -8.0, 3, 'a', 1], ['Santarém (Tapajó)', -54.7, -2.45, 2, 'x'], ['Marajó mounds', -49.4, -0.95, 2, 'x'], ['Açutuba', -60.4, -3.1, 1, 'x'], ['Acre geoglyphs', -67.6, -10.0, 1, 'x'],
      ['Xingu villages', -53.1, -12.5, 1, 'x'], ['Tupinambá villages', -39.2, -14.5, 1, 'x'], ['Guarani villages of the Paraná', -54.3, -24.8, 1, 'x'], ['Cahokia', -90.06, 38.66, 2, 'x'], ['Chichén Itzá', -88.57, 20.68, 2, 'a']],
    regions: [['Tupi peoples', -40.5, -16], ['Guarani peoples', -55.5, -27.5], ['Jê peoples', -47, -13], ['Arawak and Carib peoples', -62, -1], ['upper Xingu', -53, -10.5]],
    roads: [], lanes: []
  },
  {
    from: 1450, label: 'Before the Europeans arrive',
    caption: 'Tupi peoples live on the coast; inland live Jê, Arawak, Carib and many other peoples. None of them lives under a State, and this is not a lack of organization: there are huge villages on the Xingu, exchange networks and alliances between villages.',
    empires: [portugal(), ...europe(), E('Kongo', 7, KONGO), E('Inca (Tawantinsuyu)', 3, INCA), E('Mexica (Triple Alliance)', 6, AZTEC)],
    cities: [...IBERIA_CITIES, ['Mbanza Kongo', 14.24, -6.27, 2, 'p', 1], ['Cusco', -71.97, -13.53, 3, 'a', 1], ['Tenochtitlan', -99.13, 19.43, 3, 'a', 1], ['Calicut', 75.78, 11.25, 2, 'a'],
      ['Tupinambá villages of the Bay of All Saints', -38.6, -12.9, 1, 'p'], ['Tupinambá villages of Guanabara', -43.2, -22.8, 1, 'p'], ['Upper Xingu villages', -53.3, -12.2, 1, 'p'], ['Potiguara villages', -35.3, -6.3, 1, 'p'], ['Guarani villages', -54.6, -25.5, 1, 'p']],
    regions: [['Tupi peoples', -40.5, -16], ['Jê peoples', -47, -13], ['Arawak and Carib peoples', -62, -1], ['Guarani peoples', -55.5, -27.5], ['upper Xingu', -53, -10.5]],
    roads: [], lanes: []
  },
  {
    from: 1498, label: 'The Cape route',
    caption: 'Portugal reaches India by sailing around Africa. The land Cabral finds in 1500 is, for now, a stopover on the way to the spices.',
    empires: [portugal(), ...europe(), E('Kongo', 7, KONGO), E('Inca (Tawantinsuyu)', 3, INCA), E('Mexica (Triple Alliance)', 6, AZTEC), E('Castile in the Caribbean', 1, HISPANIOLA)],
    cities: [...IBERIA_CITIES, ['Mbanza Kongo', 14.24, -6.27, 2, 'p', 1], ['Cusco', -71.97, -13.53, 3, 'a', 1], ['Tenochtitlan', -99.13, 19.43, 3, 'a', 1], ['Calicut', 75.78, 11.25, 2, 'a'],
      ['Tupinambá villages of the Bay of All Saints', -38.6, -12.9, 1, 'p'], ['Tupiniquim villages', -39.1, -16.3, 1, 'p'], ['Tupinambá villages of Guanabara', -43.2, -22.8, 1, 'p'], ['Upper Xingu villages', -53.3, -12.2, 1, 'p'], ['Guarani villages', -54.6, -25.5, 1, 'p']],
    regions: [['Tupi peoples', -40.5, -16], ['Jê peoples', -47, -13], ['Arawak and Carib peoples', -62, -1], ['Guarani peoples', -55.5, -27.5], ['upper Xingu', -53, -10.5]],
    roads: [], lanes: []   // in 1498–1500 only the fleets of Gama and Cabral passed (the scene shows Cabral’s)
  },
  {
    from: 1549, label: 'General government',
    caption: 'Portugal holds stretches of the coast with towns, sugar mills and a government in Salvador. Everything else remains in the hands of Indigenous peoples, which the colonial map calls the "sertão" (the backlands).',
    empires: [E('Portugal', 0, PT, ...BR_1549), ...europe('Spain'), E('Kongo', 7, KONGO), E('Spain', 1, NEW_SPAIN, ANDES_ES, CUBA, HISPANIOLA)],
    cities: [...IBERIA_CITIES, ['Salvador', -38.51, -12.97, 2, 'r', 1], ['Olinda', -34.85, -8.01, 1, 'r'], ['São Vicente', -46.39, -23.96, 1, 'r'], ['Mbanza Kongo', 14.24, -6.27, 2, 'p', 1], ['Goa', 73.83, 15.5, 2, 'r'], ['Mexico City', -99.13, 19.43, 3, 'r'], ['Lima', -77.04, -12.05, 2, 'r'],
      ['Tupinambá villages of Guanabara', -43.2, -22.8, 1, 'p'], ['Upper Xingu villages', -53.3, -12.2, 1, 'p'], ['Guarani villages', -54.6, -25.5, 1, 'p']],
    regions: [['Tupi peoples', -41.5, -19], ['Jê peoples and "Tapuias"', -44, -10], ['Amazonia: hundreds of peoples', -62, -4], ['Guarani peoples', -55.5, -27.5]],
    roads: [], lanes: [LANES.india, LANES.lisbonSalvador, LANES.lisbonOlinda]
  },
  {
    from: 1580, label: 'Iberian Union',
    caption: 'Portugal and Spain share the same king. Sugar from the Northeast and the Africans shipped from Angola form a single system in the South Atlantic.',
    empires: [E('Portugal (under the Spanish king)', 0, PT, BR_COAST, ANGOLA), ...europe('Spain'), E('United Provinces', 2, NL), E('Kongo', 7, KONGO), E('Spain', 1, NEW_SPAIN, ANDES_ES, PLATA_ES, CUBA, HISPANIOLA)],
    cities: [...IBERIA_CITIES, ['Madrid', -3.7, 40.42, 2, 'r', 1], ['Amsterdam', 4.9, 52.37, 2, 'r'], ['Salvador', -38.51, -12.97, 2, 'r', 1], ['Olinda', -34.85, -8.01, 2, 'r'], ['Rio de Janeiro', -43.17, -22.9, 1, 'r'], ['São Vicente', -46.39, -23.96, 1, 'r'], ['São Paulo', -46.63, -23.55, 1, 'r'], ['Luanda', 13.23, -8.84, 1, 'r'], ['Mbanza Kongo', 14.24, -6.27, 2, 'p', 1], ['Lima', -77.04, -12.05, 2, 'r'],
      ['Upper Xingu villages', -53.3, -12.2, 1, 'p'], ['Guarani villages', -54.6, -25.5, 1, 'p']],
    regions: [['Jê peoples and "Tapuias"', -44, -10], ['Amazonia: hundreds of peoples', -62, -4], ['Guarani peoples', -55.5, -27.5], ['Ndongo', 15.8, -9.8]],
    roads: [['São Vicente', 'São Paulo']], lanes: [LANES.india, LANES.lisbonSalvador, LANES.lisbonOlinda, LANES.luandaSalvador, LANES.luandaRecife]
  },
  {
    from: 1630, label: 'Dutch Brazil',
    caption: 'The Dutch West India Company occupies Pernambuco, the heart of sugar. In the Serra da Barriga, Palmares grows. In the south, the Paulistas attack the Guarani missions.',
    empires: [E('Dutch West India Company', 2, NL, NL_BRAZIL), E('Portugal (under the Spanish king)', 0, PT, BR_COAST, BR_NORTH, ANGOLA), ...europe('Spain'), E('Kongo', 7, KONGO), E('Spain', 1, NEW_SPAIN, ANDES_ES, PLATA_ES, CUBA, HISPANIOLA)],
    cities: [...IBERIA_CITIES, ['Madrid', -3.7, 40.42, 2, 'r', 1], ['Amsterdam', 4.9, 52.37, 3, 'r', 1], ['Recife', -34.88, -8.06, 2, 'r'], ['Olinda', -34.85, -8.01, 1, 'r'], ['Salvador', -38.51, -12.97, 2, 'r', 1], ['Rio de Janeiro', -43.17, -22.9, 1, 'r'], ['São Paulo', -46.63, -23.55, 1, 'r'], ['Luanda', 13.23, -8.84, 1, 'r'], ['Mbanza Kongo', 14.24, -6.27, 2, 'p', 1],
      ['Palmares', -36.0, -9.15, 2, 'p'], ['Guarani missions', -55.5, -27.3, 1, 'p'], ['Upper Xingu villages', -53.3, -12.2, 1, 'p']],
    regions: [['Jê peoples and "Tapuias"', -43, -9], ['Amazonia: hundreds of peoples', -62, -4], ['Guarani peoples', -56, -29]],
    roads: [['São Vicente', 'São Paulo']], lanes: [LANES.recifeAmsterdam, LANES.luandaRecife, LANES.lisbonSalvador, LANES.luandaRio, LANES.india]
  },
  {
    from: 1654, label: 'After the Dutch',
    caption: 'The Dutch leave Brazil, but sugar from the Antilles starts to compete. Bandeirantes from São Paulo push into the interior, hunting Indigenous people and searching for metals.',
    empires: [E('Portugal', 0, PT, BR_COAST, BR_NORTH, ANGOLA), ...europe('Spain'), E('United Provinces', 2, NL), E('Kongo', 7, KONGO), E('Spain', 1, NEW_SPAIN, ANDES_ES, PLATA_ES, CUBA, HISPANIOLA), E('England in the Caribbean', 5, JAMAICA)],
    cities: [...IBERIA_CITIES, ['Madrid', -3.7, 40.42, 2, 'r', 1], ['London', -0.12, 51.5, 2, 'r', 1], ['Amsterdam', 4.9, 52.37, 3, 'r', 1], ['Recife', -34.88, -8.06, 2, 'r'], ['Salvador', -38.51, -12.97, 2, 'r', 1], ['Rio de Janeiro', -43.17, -22.9, 1, 'r'], ['São Paulo', -46.63, -23.55, 1, 'r'], ['Belém', -48.5, -1.45, 1, 'r'], ['São Luís', -44.3, -2.53, 1, 'r'], ['Luanda', 13.23, -8.84, 1, 'r'], ['Bridgetown', -59.6, 13.1, 1, 'r'],
      ['Palmares', -36.0, -9.15, 2, 'p'], ['Guarani missions', -55.5, -27.3, 1, 'p']],
    regions: [['Jê peoples and "Tapuias"', -43, -9], ['Amazonia: hundreds of peoples', -62, -4], ['Guarani peoples', -56, -29]],
    roads: [['São Vicente', 'São Paulo']], lanes: [LANES.lisbonSalvador, LANES.lisbonOlinda, LANES.luandaSalvador, LANES.luandaRio, LANES.india]
  },
  {
    from: 1700, label: 'The gold of Minas',
    caption: 'The gold rush shifts the center of the colony from the Northeast to the Southeast. Part of that gold ends up in London.',
    empires: [E('Portugal', 0, PT, ...BR_1700, ANGOLA), ...europe('Spain', 'Great Britain'), E('United Provinces', 2, NL), E('Spain', 1, NEW_SPAIN, ANDES_ES, PLATA_ES, CUBA, HISP_EAST), E('France in the Caribbean', 4, SAINT_DOMINGUE), E('Great Britain in the Caribbean', 5, JAMAICA)],
    cities: [...IBERIA_CITIES, ['Madrid', -3.7, 40.42, 2, 'r', 1], ['London', -0.12, 51.5, 3, 'r', 1], ['Paris', 2.35, 48.86, 3, 'r', 1], ['Salvador', -38.51, -12.97, 3, 'r', 1], ['Recife', -34.88, -8.06, 2, 'r'], ['Rio de Janeiro', -43.17, -22.9, 2, 'r'], ['São Paulo', -46.63, -23.55, 1, 'r'], ['Vila Rica', -43.5, -20.39, 2, 'r'], ['Belém', -48.5, -1.45, 1, 'r'], ['Colônia do Sacramento', -57.84, -34.47, 1, 'r'], ['Luanda', 13.23, -8.84, 1, 'r'], ['Buenos Aires', -58.38, -34.6, 1, 'r'],
      ['Guarani missions', -55.5, -27.3, 1, 'p'], ['Sete Povos das Missões', -54.55, -28.55, 1, 'p']],
    regions: [['Amazonia: hundreds of peoples', -62, -5], ['Jê peoples of central Brazil', -50, -13], ['Payaguá and Guaikuru', -57.5, -19.5], ['Charrúa and Minuano', -56, -32]],
    roads: [['Rio de Janeiro', 'Vila Rica'], ['São Paulo', 'Vila Rica']], lanes: [LANES.lisbonRio, LANES.lisbonSalvador, LANES.luandaSalvador, LANES.luandaRio, LANES.lisbonLondon]
  },
  {
    from: 1750, label: 'Treaty of Madrid',
    caption: 'Brazil takes on a shape close to today’s: each crown keeps what it occupies. The Guarani of the missions resist leaving their lands.',
    empires: [E('Portugal', 0, PT, BR_1750, ANGOLA_BIG), ...europe('Spain', 'Great Britain'), E('United Provinces', 2, NL), E('Spain', 1, NEW_SPAIN, ES_SOUTH_1750, CUBA, HISP_EAST), E('France in the Caribbean', 4, SAINT_DOMINGUE), E('Great Britain in the Caribbean', 5, JAMAICA)],
    cities: [...IBERIA_CITIES, ['Madrid', -3.7, 40.42, 2, 'r', 1], ['London', -0.12, 51.5, 3, 'r', 1], ['Paris', 2.35, 48.86, 3, 'r', 1], ['Rio de Janeiro', -43.17, -22.9, 2, 'r', 1], ['Salvador', -38.51, -12.97, 3, 'r'], ['Recife', -34.88, -8.06, 2, 'r'], ['Vila Rica', -43.5, -20.39, 3, 'r'], ['Diamantina', -43.6, -18.24, 1, 'r'], ['São Paulo', -46.63, -23.55, 1, 'r'], ['Belém', -48.5, -1.45, 1, 'r'], ['Luanda', 13.23, -8.84, 2, 'r'], ['Buenos Aires', -58.38, -34.6, 1, 'r'], ['Cap-Français', -72.2, 19.76, 1, 'r'],
      ['Sete Povos das Missões', -54.55, -28.55, 2, 'p']],
    regions: [['Amazonia: hundreds of peoples', -62, -5], ['Jê peoples of central Brazil', -50, -13], ['Charrúa and Minuano', -56, -32]],
    roads: [['Rio de Janeiro', 'Vila Rica', 'Diamantina'], ['São Paulo', 'Vila Rica']], lanes: [LANES.lisbonRio, LANES.lisbonSalvador, LANES.luandaSalvador, LANES.luandaRio, LANES.lisbonLondon]
  },
  {
    from: 1807, label: 'The court in Rio',
    caption: 'Fleeing Napoleon, the Portuguese royal family starts to rule the empire from Rio de Janeiro. In Spanish America, the wars of independence begin.',
    empires: [E('Portugal and Brazil', 0, PT, BR_1750, ANGOLA_BIG), E('Spain (occupied by Napoleon)', 1, ES), E('French Empire', 4, FR), E('United Kingdom', 5, GB), E('Holland (under France)', 4, NL), E('Spain', 1, NEW_SPAIN, ES_SOUTH_1750, CUBA, HISP_EAST), E('Haiti', 3, SAINT_DOMINGUE), E('United Kingdom in the Caribbean', 5, JAMAICA)],
    cities: [...IBERIA_CITIES, ['Madrid', -3.7, 40.42, 2, 'r', 1], ['London', -0.12, 51.5, 3, 'r', 1], ['Manchester', -2.24, 53.48, 2, 'r'], ['Paris', 2.35, 48.86, 3, 'r', 1], ['Rio de Janeiro', -43.17, -22.9, 3, 'r', 1], ['Salvador', -38.51, -12.97, 2, 'r'], ['Recife', -34.88, -8.06, 2, 'r'], ['Vila Rica', -43.5, -20.39, 2, 'r'], ['São Paulo', -46.63, -23.55, 1, 'r'], ['Belém', -48.5, -1.45, 1, 'r'], ['Luanda', 13.23, -8.84, 2, 'r'], ['Buenos Aires', -58.38, -34.6, 2, 'r'], ['Port-au-Prince', -72.34, 18.54, 1, 'r']],
    regions: [['Amazonia: hundreds of peoples', -62, -5], ['Jê peoples of central Brazil', -50, -13]],
    roads: [['Rio de Janeiro', 'Vila Rica'], ['São Paulo', 'Rio de Janeiro']], lanes: [LANES.court, LANES.lisbonLondon, LANES.luandaRio, LANES.luandaSalvador]
  },
  {
    from: 1822, label: 'Empire of Brazil',
    caption: 'Pedro I rules an empire that stretches from the Amazon to the Río de la Plata and includes the Cisplatine Province, today’s Uruguay. Slavery continues, and the trade in Africans has never been so intense. In Spanish America, the wars of independence are not over yet.',
    empires: statesAt(1822),
    cities: [...worldCities(1822), ['Rio de Janeiro', -43.17, -22.9, 3, 'r', 1], ['Salvador', -38.51, -12.97, 3, 'r'], ['Recife', -34.88, -8.06, 2, 'r'], ['São Luís', -44.3, -2.53, 1, 'r'], ['Belém', -48.5, -1.45, 1, 'r'], ['Manaus', -60.02, -3.1, 1, 'r'], ['Fortaleza', -38.54, -3.72, 1, 'r'],
      ['São Paulo', -46.63, -23.55, 1, 'r'], ['Santos', -46.33, -23.96, 1, 'r'], ['Vila Rica', -43.5, -20.39, 2, 'r'], ['Porto Alegre', -51.22, -30.03, 1, 'r'], ['Desterro', -48.55, -27.6, 1, 'r'], ['Cuiabá', -56.1, -15.6, 1, 'r'], ['Goiás', -50.14, -15.93, 1, 'r']],
    regions: [['Amazonia: hundreds of peoples', -62, -5], ['Jê peoples of central Brazil', -50, -13], ['Botocudos (Borum)', -41.5, -18.5], ['Mapuche and Tehuelche', -68, -41]],
    roads: [['Rio de Janeiro', 'Vila Rica'], ['São Paulo', 'Rio de Janeiro'], ['Santos', 'São Paulo']],
    lanes: [LANES.lisbonRio, LANES.lisbonLondon, LANES.luandaRio, LANES.luandaSalvador, STEAM.liverpoolPlate]
  },
  {
    from: 1828, label: 'Independent Uruguay',
    caption: 'After three years of war, Brazil loses Cisplatina, which becomes the Eastern Republic of Uruguay, with British mediation. In Rio, the emperor loses support and will abdicate in 1831. In the provinces, the next decade will be one of revolts.',
    empires: statesAt(1828),
    cities: [...worldCities(1828), ['Rio de Janeiro', -43.17, -22.9, 3, 'r', 1], ['Salvador', -38.51, -12.97, 3, 'r'], ['Recife', -34.88, -8.06, 2, 'r'], ['São Luís', -44.3, -2.53, 1, 'r'], ['Belém', -48.5, -1.45, 1, 'r'], ['Manaus', -60.02, -3.1, 1, 'r'], ['Fortaleza', -38.54, -3.72, 1, 'r'],
      ['São Paulo', -46.63, -23.55, 1, 'r'], ['Santos', -46.33, -23.96, 1, 'r'], ['Ouro Preto', -43.5, -20.39, 2, 'r'], ['Porto Alegre', -51.22, -30.03, 1, 'r'], ['Desterro', -48.55, -27.6, 1, 'r'], ['Cuiabá', -56.1, -15.6, 1, 'r'], ['Goiás', -50.14, -15.93, 1, 'r']],
    regions: [['Amazonia: hundreds of peoples', -62, -5], ['Jê peoples of central Brazil', -50, -13], ['Botocudos (Borum)', -41.5, -18.5], ['Mapuche and Tehuelche', -68, -41]],
    roads: [['Rio de Janeiro', 'Ouro Preto'], ['São Paulo', 'Rio de Janeiro'], ['Santos', 'São Paulo']],
    lanes: [LANES.lisbonRio, LANES.lisbonLondon, LANES.luandaRio, LANES.luandaSalvador, STEAM.liverpoolPlate]
  },
  {
    from: 1850, label: 'End of the slave trade',
    caption: 'Under pressure from the British navy, Brazil truly ends the trade in Africans. Coffee from the Paraíba valley is already the country’s main product, grown by enslaved people. The United States has taken half of Mexico’s territory, and the first steamships cross the Atlantic on fixed schedules.',
    empires: statesAt(1850),
    cities: [...worldCities(1850), ['Rio de Janeiro', -43.17, -22.9, 3, 'r', 1], ['Salvador', -38.51, -12.97, 2, 'r'], ['Recife', -34.88, -8.06, 2, 'r'], ['São Luís', -44.3, -2.53, 1, 'r'], ['Belém', -48.5, -1.45, 1, 'r'], ['Manaus', -60.02, -3.1, 1, 'r'], ['Fortaleza', -38.54, -3.72, 1, 'r'],
      ['São Paulo', -46.63, -23.55, 1, 'r'], ['Santos', -46.33, -23.96, 1, 'r'], ['Vassouras', -43.66, -22.4, 1, 'r'], ['Petrópolis', -43.18, -22.5, 1, 'r'], ['Ouro Preto', -43.5, -20.39, 1, 'r'], ['Porto Alegre', -51.22, -30.03, 1, 'r'], ['Desterro', -48.55, -27.6, 1, 'r'], ['Cuiabá', -56.1, -15.6, 1, 'r'], ['Goiás', -50.14, -15.93, 1, 'r']],
    regions: [['Amazonia: hundreds of peoples', -62, -5], ['Jê peoples of central Brazil', -50, -13], ['Kaingang', -51.5, -25.3], ['Mapuche and Tehuelche', -68, -41], ['Qom and Wichí (Chaco)', -61, -24]],
    roads: [['Rio de Janeiro', 'Ouro Preto'], ['São Paulo', 'Rio de Janeiro'], ['Santos', 'São Paulo'], ['Rio de Janeiro', 'Vassouras'], ['Rio de Janeiro', 'Petrópolis']],
    lanes: [STEAM.liverpoolPlate, LANES.lisbonRio, STEAM.rioNewYork, STEAM.coastal]
  },
  {
    from: 1870, label: 'After the Paraguayan War',
    caption: 'The war against Paraguay (1864–1870) left the neighboring country in ruins and gave the Brazilian army new political weight. Railways start to link the coffee plantations to the ports of Santos and Rio. In Europe, Italy and Germany have just unified.',
    empires: statesAt(1870),
    cities: [...worldCities(1870), ['Rio de Janeiro', -43.17, -22.9, 3, 'r', 1], ['Salvador', -38.51, -12.97, 2, 'r'], ['Recife', -34.88, -8.06, 2, 'r'], ['São Luís', -44.3, -2.53, 1, 'r'], ['Belém', -48.5, -1.45, 1, 'r'], ['Manaus', -60.02, -3.1, 1, 'r'], ['Fortaleza', -38.54, -3.72, 1, 'r'],
      ['São Paulo', -46.63, -23.55, 1, 'r'], ['Santos', -46.33, -23.96, 1, 'r'], ['Jundiaí', -46.88, -23.19, 1, 'r'], ['Campinas', -47.06, -22.9, 1, 'r'], ['Vassouras', -43.66, -22.4, 1, 'r'], ['Petrópolis', -43.18, -22.5, 1, 'r'], ['Juiz de Fora', -43.35, -21.76, 1, 'r'], ['Ouro Preto', -43.5, -20.39, 1, 'r'],
      ['Porto Alegre', -51.22, -30.03, 1, 'r'], ['Desterro', -48.55, -27.6, 1, 'r'], ['Corumbá', -57.65, -19.0, 1, 'r'], ['Cuiabá', -56.1, -15.6, 1, 'r'], ['Goiás', -50.14, -15.93, 1, 'r']],
    regions: [['Amazonia: hundreds of peoples', -62, -5], ['Jê peoples of central Brazil', -50, -13], ['Kaingang', -51.5, -25.3], ['Mapuche and Tehuelche', -68, -41], ['Qom and Wichí (Chaco)', -61, -24]],
    roads: [['Rio de Janeiro', 'Vassouras'], ['Rio de Janeiro', 'Petrópolis', 'Juiz de Fora'], ['Rio de Janeiro', 'Ouro Preto'], ['Santos', 'São Paulo', 'Jundiaí'], ['Jundiaí', 'Campinas'], ['São Paulo', 'Rio de Janeiro']],
    lanes: [STEAM.liverpoolPlate, STEAM.rioNewYork, STEAM.coastal, STEAM.belemLiverpool, STEAM.santosHamburg]
  },
  {
    from: 1889, label: 'Republic',
    caption: 'Slavery was abolished in 1888 and, the next year, the military overthrows the monarchy. Italian immigrants arrive by the thousands for the coffee plantations of São Paulo, linked to Santos by train. In the Amazon, rubber makes Manaus and Belém rich.',
    empires: statesAt(1889),
    cities: [...worldCities(1889), ['Rio de Janeiro', -43.17, -22.9, 3, 'r', 1], ['Salvador', -38.51, -12.97, 2, 'r'], ['Recife', -34.88, -8.06, 2, 'r'], ['São Luís', -44.3, -2.53, 1, 'r'], ['Belém', -48.5, -1.45, 2, 'r'], ['Manaus', -60.02, -3.1, 2, 'r'], ['Fortaleza', -38.54, -3.72, 1, 'r'],
      ['São Paulo', -46.63, -23.55, 2, 'r'], ['Santos', -46.33, -23.96, 2, 'r'], ['Jundiaí', -46.88, -23.19, 1, 'r'], ['Campinas', -47.06, -22.9, 1, 'r'], ['Ribeirão Preto', -47.81, -21.18, 1, 'r'], ['Vassouras', -43.66, -22.4, 1, 'r'], ['Petrópolis', -43.18, -22.5, 1, 'r'], ['Juiz de Fora', -43.35, -21.76, 1, 'r'], ['Ouro Preto', -43.5, -20.39, 1, 'r'],
      ['Porto Alegre', -51.22, -30.03, 2, 'r'], ['Curitiba', -49.27, -25.43, 1, 'r'], ['Desterro', -48.55, -27.6, 1, 'r'], ['Corumbá', -57.65, -19.0, 1, 'r'], ['Cuiabá', -56.1, -15.6, 1, 'r'], ['Goiás', -50.14, -15.93, 1, 'r']],
    regions: [['rubber estates', -65, -7], ['Amazonia: hundreds of peoples', -60, -1.5], ['sertão', -40.5, -8.5], ['Kaingang', -51.5, -25.3], ['Jê peoples of central Brazil', -50, -13]],
    roads: [['Rio de Janeiro', 'Juiz de Fora', 'Ouro Preto'], ['Rio de Janeiro', 'Petrópolis'], ['Rio de Janeiro', 'São Paulo'], ['Santos', 'São Paulo', 'Jundiaí', 'Campinas', 'Ribeirão Preto']],
    lanes: [STEAM.liverpoolPlate, STEAM.rioNewYork, STEAM.coastal, STEAM.belemLiverpool, STEAM.santosHamburg, STEAM.genoaSantos]
  },
  {
    from: 1903, label: 'Brazilian Acre',
    caption: 'By the Treaty of Petrópolis, Acre, settled by Brazilian rubber tappers, passes from Bolivia to Brazil. Manaus is at the height of the rubber boom, Belo Horizonte is the new capital of Minas and Rio tears down tenements to open avenues. Panama has just split from Colombia, with support from the United States.',
    empires: statesAt(1903),
    cities: [...worldCities(1903), ['Rio de Janeiro', -43.17, -22.9, 3, 'r', 1], ['Salvador', -38.51, -12.97, 2, 'r'], ['Recife', -34.88, -8.06, 2, 'r'], ['São Luís', -44.3, -2.53, 1, 'r'], ['Belém', -48.5, -1.45, 2, 'r'], ['Manaus', -60.02, -3.1, 3, 'r'], ['Rio Branco', -67.81, -9.97, 1, 'r'], ['Fortaleza', -38.54, -3.72, 1, 'r'],
      ['São Paulo', -46.63, -23.55, 2, 'r'], ['Santos', -46.33, -23.96, 2, 'r'], ['Jundiaí', -46.88, -23.19, 1, 'r'], ['Campinas', -47.06, -22.9, 1, 'r'], ['Ribeirão Preto', -47.81, -21.18, 1, 'r'], ['Petrópolis', -43.18, -22.5, 1, 'r'], ['Juiz de Fora', -43.35, -21.76, 1, 'r'], ['Belo Horizonte', -43.94, -19.92, 1, 'r'], ['Ouro Preto', -43.5, -20.39, 1, 'r'],
      ['Porto Alegre', -51.22, -30.03, 2, 'r'], ['Curitiba', -49.27, -25.43, 1, 'r'], ['Florianópolis', -48.55, -27.6, 1, 'r'], ['Corumbá', -57.65, -19.0, 1, 'r'], ['Cuiabá', -56.1, -15.6, 1, 'r'], ['Goiás', -50.14, -15.93, 1, 'r']],
    regions: [['rubber estates', -66, -8.5], ['Amazonia: hundreds of peoples', -60, -1.5], ['sertão', -40.5, -8.5], ['Kaingang', -51.5, -25.3], ['Nambikwara and Paresi', -58.5, -13.5]],
    roads: [['Rio de Janeiro', 'Juiz de Fora', 'Belo Horizonte'], ['Rio de Janeiro', 'Petrópolis'], ['Rio de Janeiro', 'São Paulo'], ['Santos', 'São Paulo', 'Jundiaí', 'Campinas', 'Ribeirão Preto']],
    lanes: [STEAM.liverpoolPlate, STEAM.rioNewYork, STEAM.coastal, STEAM.belemLiverpool, STEAM.santosHamburg, STEAM.genoaSantos]
  },
  {
    from: 1930, label: 'Revolution of 1930',
    caption: 'The crash of 1929 brings down the price of coffee and, with it, the Republic dominated by the planters of São Paulo and Minas. Getúlio Vargas comes to power. São Paulo is already the country’s largest industrial center, and trains link the coast to Mato Grosso and Rio Grande do Sul.',
    empires: statesAt(1930),
    cities: [...worldCities(1930), ['Rio de Janeiro', -43.17, -22.9, 3, 'r', 1], ['Salvador', -38.51, -12.97, 2, 'r'], ['Recife', -34.88, -8.06, 2, 'r'], ['Natal', -35.2, -5.8, 1, 'r'], ['São Luís', -44.3, -2.53, 1, 'r'], ['Belém', -48.5, -1.45, 2, 'r'], ['Manaus', -60.02, -3.1, 2, 'r'], ['Rio Branco', -67.81, -9.97, 1, 'r'], ['Porto Velho', -63.9, -8.76, 1, 'r'], ['Guajará-Mirim', -65.34, -10.78, 1, 'r'], ['Fortaleza', -38.54, -3.72, 1, 'r'],
      ['São Paulo', -46.63, -23.55, 3, 'r'], ['Santos', -46.33, -23.96, 2, 'r'], ['Campinas', -47.06, -22.9, 1, 'r'], ['Ribeirão Preto', -47.81, -21.18, 1, 'r'], ['Bauru', -49.06, -22.31, 1, 'r'], ['Campo Grande', -54.62, -20.47, 1, 'r'], ['Petrópolis', -43.18, -22.5, 1, 'r'], ['Juiz de Fora', -43.35, -21.76, 1, 'r'], ['Belo Horizonte', -43.94, -19.92, 2, 'r'],
      ['Porto Alegre', -51.22, -30.03, 2, 'r'], ['Curitiba', -49.27, -25.43, 1, 'r'], ['Florianópolis', -48.55, -27.6, 1, 'r'], ['Corumbá', -57.65, -19.0, 1, 'r'], ['Cuiabá', -56.1, -15.6, 1, 'r'], ['Goiás', -50.14, -15.93, 1, 'r']],
    regions: [['Amazonia: hundreds of peoples', -60, -1.5], ['sertão', -40.5, -8.5], ['Nambikwara and Paresi', -58.5, -13.5], ['Xavante', -52, -14.5], ['Kayapó', -52, -8]],
    roads: [['Rio de Janeiro', 'Juiz de Fora', 'Belo Horizonte'], ['Rio de Janeiro', 'São Paulo'], ['Santos', 'São Paulo', 'Campinas', 'Ribeirão Preto'], ['São Paulo', 'Bauru', 'Campo Grande'], ['São Paulo', 'Curitiba', 'Porto Alegre'], ['Porto Velho', 'Guajará-Mirim']],
    lanes: [STEAM.liverpoolPlate, STEAM.rioNewYork, STEAM.coastal, STEAM.santosHamburg, STEAM.genoaSantos]
  },
  {
    from: 1960, label: 'Brasília',
    caption: 'The capital moves to the central plateau, built in less than four years by tens of thousands of workers, the candangos. New highways link Brasília to Belém and to the Southeast. Darcy Ribeiro reported that, of about 230 Indigenous peoples known in 1900, 87 had disappeared by 1957; in 1961 the Xingu Indigenous Park is created.',
    empires: statesAt(1960),
    cities: [...worldCities(1960), ['Brasília', -47.88, -15.79, 2, 'r'], ['Goiânia', -49.25, -16.68, 1, 'r'], ['Rio de Janeiro', -43.17, -22.9, 3, 'r'], ['São Paulo', -46.63, -23.55, 3, 'r'], ['Santos', -46.33, -23.96, 2, 'r'], ['Campinas', -47.06, -22.9, 2, 'r'], ['Ribeirão Preto', -47.81, -21.18, 1, 'r'], ['Bauru', -49.06, -22.31, 1, 'r'], ['Londrina', -51.16, -23.31, 1, 'r'],
      ['Belo Horizonte', -43.94, -19.92, 2, 'r'], ['Juiz de Fora', -43.35, -21.76, 1, 'r'], ['Volta Redonda', -44.1, -22.52, 1, 'r'], ['Curitiba', -49.27, -25.43, 2, 'r'], ['Florianópolis', -48.55, -27.6, 1, 'r'], ['Porto Alegre', -51.22, -30.03, 2, 'r'],
      ['Salvador', -38.51, -12.97, 2, 'r'], ['Recife', -34.88, -8.06, 2, 'r'], ['Natal', -35.2, -5.8, 1, 'r'], ['Fortaleza', -38.54, -3.72, 2, 'r'], ['Teresina', -42.8, -5.09, 1, 'r'], ['São Luís', -44.3, -2.53, 1, 'r'], ['Belém', -48.5, -1.45, 2, 'r'], ['Imperatriz', -47.49, -5.52, 1, 'r'], ['Manaus', -60.02, -3.1, 1, 'r'],
      ['Cuiabá', -56.1, -15.6, 1, 'r'], ['Campo Grande', -54.62, -20.47, 1, 'r'], ['Corumbá', -57.65, -19.0, 1, 'r'], ['Porto Velho', -63.9, -8.76, 1, 'r'], ['Guajará-Mirim', -65.34, -10.78, 1, 'r'], ['Rio Branco', -67.81, -9.97, 1, 'r'], ['Posto Leonardo (Xingu)', -53.38, -12.2, 1, 'x']],
    regions: [['Kayapó', -52, -8], ['Xavante', -52, -14.5], ['Yanomami', -63.5, 2.5], ['Tikuna', -69, -4], ['Guarani', -55, -23], ['Amazonia: hundreds of peoples', -60, -1.5]],
    roads: [['Rio de Janeiro', 'São Paulo'], ['Rio de Janeiro', 'Juiz de Fora', 'Belo Horizonte', 'Brasília'], ['Brasília', 'Goiânia'], ['Brasília', 'Imperatriz', 'Belém'], ['Santos', 'São Paulo', 'Campinas', 'Ribeirão Preto'], ['São Paulo', 'Bauru', 'Campo Grande', 'Corumbá'], ['São Paulo', 'Curitiba', 'Porto Alegre'], ['Rio de Janeiro', 'Salvador'], ['Porto Velho', 'Guajará-Mirim']],
    lanes: [STEAM.rioNewYork, STEAM.coastal, STEAM.santosHamburg, STEAM.genoaSantos, STEAM.liverpoolPlate]
  },
  {
    from: 1985, label: 'Return to democracy',
    caption: 'After 21 years of dictatorship, a civilian president returns to power, still chosen by Congress. Highways opened in the 1970s cut through the Amazon and speed up deforestation and wildcat mining. Indigenous peoples and quilombolas (descendants of runaway-slave communities) organize to have their rights written into the new Constitution.',
    empires: statesAt(1985),
    cities: [...worldCities(1985), ['Brasília', -47.88, -15.79, 3, 'r'], ['Goiânia', -49.25, -16.68, 2, 'r'], ['Rio de Janeiro', -43.17, -22.9, 3, 'r'], ['São Paulo', -46.63, -23.55, 3, 'r'], ['Santos', -46.33, -23.96, 2, 'r'], ['Campinas', -47.06, -22.9, 2, 'r'], ['Ribeirão Preto', -47.81, -21.18, 2, 'r'], ['Bauru', -49.06, -22.31, 1, 'r'], ['Londrina', -51.16, -23.31, 2, 'r'],
      ['Belo Horizonte', -43.94, -19.92, 3, 'r'], ['Juiz de Fora', -43.35, -21.76, 1, 'r'], ['Volta Redonda', -44.1, -22.52, 1, 'r'], ['Curitiba', -49.27, -25.43, 3, 'r'], ['Florianópolis', -48.55, -27.6, 1, 'r'], ['Porto Alegre', -51.22, -30.03, 3, 'r'],
      ['Salvador', -38.51, -12.97, 3, 'r'], ['Recife', -34.88, -8.06, 3, 'r'], ['Natal', -35.2, -5.8, 1, 'r'], ['Fortaleza', -38.54, -3.72, 3, 'r'], ['Teresina', -42.8, -5.09, 1, 'r'], ['São Luís', -44.3, -2.53, 2, 'r'], ['Belém', -48.5, -1.45, 2, 'r'], ['Imperatriz', -47.49, -5.52, 1, 'r'], ['Marabá', -49.12, -5.37, 1, 'r'], ['Altamira', -52.21, -3.2, 1, 'r'], ['Itaituba', -55.98, -4.28, 1, 'r'], ['Manaus', -60.02, -3.1, 2, 'r'],
      ['Cuiabá', -56.1, -15.6, 2, 'r'], ['Campo Grande', -54.62, -20.47, 2, 'r'], ['Corumbá', -57.65, -19.0, 1, 'r'], ['Porto Velho', -63.9, -8.76, 1, 'r'], ['Rio Branco', -67.81, -9.97, 1, 'r'], ['Posto Leonardo (Xingu)', -53.38, -12.2, 1, 'x']],
    regions: [['Kayapó', -52, -8], ['Xavante', -52, -14.5], ['Yanomami', -63.5, 2.5], ['Tikuna', -69, -4], ['Guarani', -55, -23], ['agricultural frontier', -56, -12]],
    roads: [['Rio de Janeiro', 'São Paulo'], ['Rio de Janeiro', 'Juiz de Fora', 'Belo Horizonte', 'Brasília'], ['Brasília', 'Goiânia'], ['Brasília', 'Imperatriz', 'Belém'], ['Santos', 'São Paulo', 'Campinas', 'Ribeirão Preto'], ['São Paulo', 'Bauru', 'Campo Grande', 'Corumbá'], ['São Paulo', 'Curitiba', 'Porto Alegre'], ['Rio de Janeiro', 'Salvador'],
      ['Imperatriz', 'Marabá', 'Altamira', 'Itaituba'], ['Brasília', 'Cuiabá', 'Porto Velho', 'Rio Branco'], ['Porto Velho', 'Manaus']],
    lanes: [STEAM.rioNewYork, STEAM.santosHamburg, STEAM.coastal, STEAM.kobeSantos]
  }
];

/* ---------- events ----------*/
// k: kind · y/y2: years · p: [lon, lat] · src: suggested readings (see SOURCES)
export const EVENTS = [
  { id: 'luzia', y: -9500, k: 'peoples', place: 'Lagoa Santa, Minas Gerais', p: [-43.9, -19.6], t: 'Luzia and the people of Lagoa Santa',
    txt: 'In the caves of Lagoa Santa, the Danish naturalist Peter Lund found human bones next to the bones of extinct animals in the 19th century. In the 1970s, the skull of a woman who lived about 11,500 years ago turned up there; she was later nicknamed Luzia. These groups hunted small game, gathered fruit and buried their dead with elaborate rituals. Walter Neves saw them as a first wave of people different from today’s Indigenous peoples; DNA studies published in 2018 showed they were related to the other Indigenous peoples of the Americas.', src: ['neves', 'prous'] },
  { id: 'pedrapintada', y: -9200, k: 'peoples', place: 'Monte Alegre, Pará', p: [-54.07, -2.0], t: 'The Caverna da Pedra Pintada',
    txt: 'In a cave at Monte Alegre, on the north bank of the Amazon, Anna Roosevelt’s team found hearths, stone points and traces of paint more than 11,000 years old, at the foot of painted walls. The people who lived there ate palm fruits, nuts, fish and turtles. The find showed that the rainforest was settled at the same time as the plains of North America, against the idea that it was too poor for the first Americans. The exact age of the paintings is still debated.', src: ['roosevelt', 'eneves'] },
  { id: 'sambaquis', y: -6000, y2: 1000, k: 'peoples', place: 'Coast of Santa Catarina', p: [-48.9, -28.3], t: 'The sambaquis',
    txt: 'Fishers and gatherers on the coast piled up shells, fish bones, earth and graves for centuries, always in the same place. Some sambaquis (shell mounds) in Santa Catarina are more than 30 meters high, and the tradition lasted thousands of years, from Rio Grande do Sul to Bahia. They were cemeteries and landmarks, made by groups that hardly farmed and left no sign of powerful chiefs. They show that building monuments does not depend on farming or on the State, a central idea of The Dawn of Everything.', src: ['gaspar', 'prous', 'graeber'] },
  { id: 'terrapreta', y: -500, y2: 1500, k: 'peoples', place: 'Central Amazonia', p: [-60.4, -3.1], t: 'Terra preta and cultivated forests',
    txt: 'Near the meeting of the Negro and Solimões rivers, archaeologists find patches of dark, fertile soil full of pottery shards, charcoal and food remains: terra preta de índio (Indian dark earth). It formed over centuries of village life, from organic waste and small burns. Around it grew manioc gardens, a crop domesticated in the southwestern Amazon more than 8,000 years ago, and orchards of Brazil nut, cacao and peach palm. How much of this was done on purpose is still debated, but part of the forest that looks "virgin" was managed by people.', src: ['eneves', 'heckenberger'] },
  { id: 'tupiguarani', y: -500, y2: 1400, k: 'peoples', place: 'Southwestern Amazonia', p: [-62.5, -11.0], t: 'The Tupi-Guarani expansion',
    txt: 'The Tupi-Guarani-speaking peoples probably come from the southwestern Amazon, between the Madeira and Guaporé rivers. Over many centuries, groups moved far away: the ancestors of the Guarani went down the Paraná and Uruguay basins, and those of the Tupinambá reached the coast, where sambaqui peoples and Jê peoples already lived. They brought painted pottery, manioc gardens and the village of longhouses around a plaza. Routes and dates are debated: some speak of 3,000 years ago, others place the arrival on the coast around the year 1000.', src: ['cfausto', 'prous'] },
  { id: 'geoglyphs', y: 1, y2: 1300, k: 'peoples', place: 'Eastern Acre', p: [-67.6, -10.0], t: 'The geoglyphs of Acre',
    txt: 'When deforestation opened pastures in Acre, hundreds of ditches appeared in the shape of almost perfect circles and squares, 100 to 300 meters across, linked by paths. There are almost no remains of houses inside them: they seem to have been places for gatherings and ceremonies. Pollen and charcoal show they were dug in a managed bamboo forest, without large clearings. Who built them and why is still debated.', src: ['parssinen', 'eneves'] },
  { id: 'marajoara', y: 400, y2: 1400, k: 'peoples', place: 'Marajó Island', p: [-49.4, -0.95], t: 'The Marajoara culture',
    txt: 'On Marajó Island, at the mouth of the Amazon, villages were built on raised mounds, the tesos, some up to 10 meters high, which stayed dry during floods. From there comes some of the most elaborate pottery in the Americas: painted funeral urns, figurines and ceramic pubic covers worn by women. Denise Schaan saw Marajó as a society of chiefdoms that controlled fishing; other archaeologists see autonomous villages, with no center of power. The Marajoara culture had already disappeared when the Europeans arrived.', src: ['schaan', 'eneves'] },
  { id: 'tapajo', y: 1000, y2: 1650, k: 'peoples', place: 'Santarém', p: [-54.7, -2.45], t: 'The Tapajó of Santarém',
    txt: 'Where Santarém stands today, at the mouth of the Tapajós River, there was a huge settlement on terra preta, surrounded by smaller villages. From there came pottery covered with figures and the muiraquitãs, green stone amulets traded across the Amazon. The Spaniards who went down the river with Orellana in 1542 spoke of many people and of poisoned arrows. In the 17th century, slave-raiding expeditions from Belém and the missions emptied the region, and the name Tapajó vanishes from the records in the following century.', src: ['dgomes', 'eneves'] },
  { id: 'xingu', y: 1250, y2: 1650, k: 'peoples', place: 'Upper Xingu', p: [-53.3, -12.3], t: 'The garden villages of the upper Xingu',
    txt: 'Ancestors of the Kuikuro lived in large villages linked by wide roads, ditches and bridges, surrounded by gardens and orchards. Archaeologists speak of low-density urbanism: many people and a lot of planning, with no sign of a central State. The population fell sharply after epidemics from the coast arrived.', src: ['heckenberger', 'graeber'] },
  { id: 'tupi', y: 1450, y2: 1600, k: 'peoples', place: 'Coast', p: [-40.0, -15.0], t: 'Tupinambá: chiefs who do not command',
    txt: 'The Tupi peoples of the coast lived in villages of hundreds of people, with manioc gardens, alliances and ritual wars between villages. Chiefs persuaded with words but could not force anyone. Pierre Clastres read this as societies that deliberately refused the power to command. The reading is debated, but the question it raises is central to The Dawn of Everything: forms of power can be chosen or refused.', src: ['clastres', 'graeber', 'hemming'] },
  { id: 'tordesillas', y: 1494, k: 'government', place: 'Tordesillas', p: [-5.0, 41.5], t: 'Treaty of Tordesillas',
    txt: 'Portugal and Castile divide between them the lands "discovered and yet to be discovered" by a line 370 leagues west of Cape Verde. No one asked the peoples on either side of the line. The eastern tip of South America goes to Portugal.', src: ['fausto'] },
  { id: 'gama', y: 1498, k: 'economy', place: 'Calicut', p: [75.78, 11.25], t: 'Vasco da Gama reaches India',
    txt: 'Sailing around Africa, Gama’s fleet reaches Calicut. Portugal’s priority becomes the spice route, and it is on that path that the next fleet will touch America.', src: ['boxer'] },
  { id: 'cabral', y: 1500, k: 'government', place: 'Porto Seguro', p: [-39.07, -16.4], t: 'Cabral’s fleet reaches the coast',
    txt: 'On the way to India, Pedro Álvares Cabral’s fleet makes a wide loop through the Atlantic and reaches the coast of what is now Bahia on April 22. It stays ten days and sails on to Calicut. The letter of Pero Vaz de Caminha describes the Tupiniquim who receive it.', src: ['caminha', 'fausto'] },
  { id: 'brazilwood', y: 1502, y2: 1600, k: 'economy', place: 'Cabo Frio', p: [-42.0, -22.9], t: 'Brazilwood and barter',
    txt: 'The first business is the red wood used to dye cloth in Europe. The Crown leases the monopoly to merchants. The people who cut and carry the logs are Indigenous, paid with axes, knives and beads. The French run the same trade on the same coast, also with Indigenous allies.', src: ['fausto', 'hemming'] },
  { id: 'kongo', y: 1526, k: 'government', place: 'Mbanza Kongo', p: [14.24, -6.27], t: 'The king of Kongo complains about the slave trade',
    txt: 'Afonso I (Nzinga Mbemba), Christian king of Kongo and an ally of Portugal, writes to the Portuguese king that merchants are carrying off his subjects and emptying the kingdom. The trade in people was already part of the politics of African kingdoms.', src: ['alencastro'] },
  { id: 'captaincies', y: 1532, y2: 1536, k: 'government', place: 'São Vicente', p: [-46.39, -23.96], t: 'São Vicente and the captaincies',
    txt: 'With the French prowling the coast, the Crown decides to settle it. Martim Afonso de Sousa founds São Vicente in 1532, with one of the first sugar mills. In 1534 the coast is divided into strips handed to noblemen, who must colonize them at their own expense. Almost all of them fail; Pernambuco and São Vicente prosper.', src: ['fausto', 'schwarcz'] },
  { id: 'salvador', y: 1549, k: 'government', place: 'Salvador', p: [-38.51, -12.97], t: 'Tomé de Sousa founds Salvador',
    txt: 'To bring order to the captaincies, the Crown creates a general government. Tomé de Sousa arrives with about a thousand people and founds Salvador, the capital. With him come the first Jesuits, led by Manuel da Nóbrega.', src: ['fausto'] },
  { id: 'tamoios', y: 1554, y2: 1567, k: 'conflict', place: 'Ubatuba', p: [-45.07, -23.43], t: 'Confederation of the Tamoios',
    txt: 'Tupinambá of the coast between São Vicente and Cabo Frio, targets of slave raids, unite against the Portuguese and ally with the French. The Jesuits Nóbrega and Anchieta negotiate a truce at Iperoig (1563), but the war ends in Indigenous defeat.', src: ['hemming', 'fausto'] },
  { id: 'franceantarctique', y: 1555, y2: 1567, k: 'conflict', place: 'Guanabara Bay', p: [-43.15, -22.88], t: 'France Antarctique',
    txt: 'Nicolas de Villegaignon sets up a French colony on Guanabara Bay, allied with the Tupinambá. The Portuguese and their Temiminó allies destroy it; Estácio de Sá founds Rio de Janeiro in 1565, in the middle of this war.', src: ['fausto'] },
  { id: 'epidemics', y: 1562, y2: 1563, k: 'peoples', place: 'Bahia’s Recôncavo', p: [-38.8, -12.6], t: 'Smallpox in the villages of Bahia',
    txt: 'A smallpox epidemic, followed by famine, kills a large share of the Indigenous people gathered in the villages of Bahia. Diseases brought from Europe and Africa empty whole regions, sometimes before the settlers even reach them.', src: ['hemming', 'schwartz'] },
  { id: 'sugar', y: 1570, y2: 1650, k: 'economy', place: 'Olinda', p: [-34.85, -8.01], t: 'The sugar of Pernambuco and Bahia',
    txt: 'The sugar mills of the Northeast make Brazil the world’s largest sugar producer around 1600. The sugar goes to Lisbon and from there to Amsterdam, where it is refined and sold. The work is done by enslaved Indigenous people and, more and more, by Africans.', src: ['schwartz', 'furtado'] },
  { id: 'luanda', y: 1576, k: 'economy', place: 'Luanda', p: [13.23, -8.84], t: 'Founding of Luanda',
    txt: 'Paulo Dias de Novais founds Luanda. Angola becomes the main point of departure for enslaved Africans shipped to Brazil. In the next century, Queen Njinga, of Ndongo and Matamba, fights the Portuguese for decades.', src: ['alencastro'] },
  { id: 'slavetrade', y: 1550, y2: 1850, k: 'economy', place: 'South Atlantic', p: [-14.0, -11.0], t: 'The trade in Africans to Brazil',
    txt: 'About 4.8 million Africans reached Brazil enslaved, more than any other region of the Americas. Ships left Salvador and Rio with tobacco, cachaça and gold and came back with people. For Alencastro, the colony cannot be understood without Angola: the two shores formed a single system.', src: ['alencastro', 'slavevoyages'] },
  { id: 'alcacer', y: 1578, k: 'conflict', place: 'Alcácer-Quibir', p: [-5.87, 35.0], t: 'King Sebastian dies in Morocco',
    txt: 'King Sebastian dies at the battle of Alcácer-Quibir without leaving heirs. Two years later, his uncle Philip II of Spain claims the Portuguese throne.', src: ['fausto'] },
  { id: 'iberianunion', y: 1580, y2: 1640, k: 'government', place: 'Lisbon', p: [-9.0, 38.9], t: 'Iberian Union',
    txt: 'Portugal and Spain now share the same king. Spain’s enemies become Brazil’s enemies, and the Tordesillas line matters less in practice.', src: ['fausto', 'schwarcz'] },
  { id: 'palmares', y: 1605, y2: 1695, k: 'peoples', place: 'Serra da Barriga', p: [-36.0, -9.15], t: 'Palmares',
    txt: 'People who fled the sugar mills form in the Serra da Barriga a cluster of mocambos (runaway settlements) that comes to hold thousands of inhabitants, with gardens, trade with neighbors and their own leaders. It resists dozens of expeditions for almost a century, until it is destroyed in 1694; Zumbi is killed in 1695. It is a form of political life born from escape from the colonial system.', src: ['freitas', 'schwarcz'] },
  { id: 'missions', y: 1609, y2: 1768, k: 'peoples', place: 'Missions', p: [-55.5, -27.3], t: 'The Guarani missions',
    txt: 'Jesuits gather the Guarani in reductions: settlements with a church, workshops, communal gardens and a government of caciques and priests, far from the settlers who wanted to enslave them. It was an experiment without parallel, admired and criticized to this day.', src: ['hemming'] },
  { id: 'bandeiras', y: 1628, y2: 1631, k: 'conflict', place: 'Guairá', p: [-53.0, -24.0], t: 'Bandeirantes destroy the missions of Guairá',
    txt: 'Expeditions from São Paulo, such as that of Antônio Raposo Tavares, destroy the missions of Guairá and carry off thousands of Guarani as slaves. The missions move south, between the Paraná and Uruguay rivers, and begin to arm the Guarani, who defeat the Paulistas at Mbororé (1641).', src: ['hemming', 'fausto'] },
  { id: 'dutch', y: 1630, y2: 1654, k: 'conflict', place: 'Recife', p: [-34.88, -8.06], t: 'Dutch Brazil',
    txt: 'The Dutch West India Company, at war with Spain (and therefore with the Brazil of the Iberian Union), takes Pernambuco. Under John Maurice of Nassau (1637–1644), Recife gains bridges, palaces and scientists. The Luso-Brazilians rebel in 1645 and drive out the Dutch in 1654.', src: ['cabralmello', 'schwartz'] },
  { id: 'restoration', y: 1640, k: 'government', place: 'Lisbon', p: [-9.3, 38.6], t: 'Portuguese Restoration',
    txt: 'A revolt of the nobility in Lisbon puts John IV on the throne and ends the Iberian Union. At war with Spain, Portugal needs allies and moves closer to England.', src: ['fausto'] },
  { id: 'luanda1641', y: 1641, y2: 1648, k: 'conflict', place: 'Luanda', p: [13.6, -9.2], t: 'Dutch Luanda and the fleet from Rio',
    txt: 'To get enslaved Africans for their sugar mills, the Dutch take Luanda in 1641. In 1648 a fleet fitted out in Rio de Janeiro, commanded by Salvador Correia de Sá, takes it back. It was Brazil, not Lisbon, that reconquered Angola.', src: ['alencastro', 'boxer'] },
  { id: 'caribbean', y: 1650, y2: 1700, k: 'economy', place: 'Barbados', p: [-59.6, 13.1], t: 'The sugar of the Antilles',
    txt: 'The English, French and Dutch set up sugar plantations in the Caribbean, partly with techniques learned in Pernambuco. The price falls and Brazil loses the lead. How much this mattered, alongside other factors, is debated.', src: ['schwartz', 'furtado'] },
  { id: 'gold', y: 1693, y2: 1760, k: 'economy', place: 'Minas Gerais', p: [-43.5, -20.39], t: 'The gold rush in Minas',
    txt: 'Paulistas find gold in the rivers of Minas Gerais. It is the largest gold rush up to that time: hundreds of thousands of Portuguese and enslaved Africans go to the region, and the center of the colony shifts from the Northeast to the Southeast.', src: ['boxer', 'fausto'] },
  { id: 'methuen', y: 1703, k: 'economy', place: 'London', p: [-0.12, 51.5], t: 'Methuen Treaty',
    txt: 'Portugal opens its market to English cloth and England lowers the duty on Portuguese wines. Since Portugal buys more than it sells, much of the difference is paid with Brazilian gold, which ends up in London.', src: ['furtado', 'boxer'] },
  { id: 'industrialrev', y: 1760, y2: 1840, k: 'economy', place: 'Manchester', p: [-2.24, 53.48], t: 'Industrial Revolution',
    txt: 'Steam engines and textile factories transform Great Britain. It will need markets to sell to and raw materials such as cotton, and in the 19th century it will press for the end of the Atlantic slave trade.', src: ['furtado'] },
  { id: 'madrid', y: 1750, k: 'government', place: 'Madrid', p: [-3.7, 40.42], t: 'Treaty of Madrid',
    txt: 'Portugal and Spain replace the Tordesillas line with a new principle: each keeps what it actually occupies. Brazil’s shape comes close to today’s. Portugal hands over Colônia do Sacramento and receives the Sete Povos das Missões (the Seven Peoples of the Missions), with the Guarani who lived there.', src: ['fausto', 'schwarcz'] },
  { id: 'guaraniwar', y: 1754, y2: 1756, k: 'conflict', place: 'São Miguel das Missões', p: [-54.55, -28.55], t: 'Guarani War',
    txt: 'The Guarani of the Seven Peoples refuse to leave their lands and face the combined armies of Portugal and Spain. Their leader Sepé Tiaraju dies in 1756 and the missions are occupied.', src: ['hemming'] },
  { id: 'pombal', y: 1755, y2: 1777, k: 'government', place: 'Lisbon', p: [-9.2, 38.55], t: 'The Lisbon earthquake and Pombal’s government',
    txt: 'An earthquake, followed by a tsunami and fire, destroys Lisbon. The minister Pombal leads the rebuilding and concentrates power: he creates trading companies for Brazil, expels the Jesuits in 1759 and moves the colony’s capital to Rio in 1763.', src: ['maxwell', 'schwarcz'] },
  { id: 'riocapital', y: 1763, k: 'government', place: 'Rio de Janeiro', p: [-43.25, -22.95], t: 'The capital moves to Rio',
    txt: 'The capital of the State of Brazil moves from Salvador to Rio de Janeiro, the port where the gold of Minas leaves and from which the southern border is watched.', src: ['fausto'] },
  { id: 'usa', y: 1776, k: 'ideas', place: 'Philadelphia', p: [-75.16, 39.95], t: 'Independence of the United States',
    txt: 'Thirteen English colonies declare independence and win the war. They show settlers across the Americas that breaking with the mother country is possible.', src: ['maxwell'] },
  { id: 'minasconspiracy', y: 1789, k: 'ideas', place: 'Vila Rica', p: [-43.6, -20.3], t: 'Minas Conspiracy (Inconfidência Mineira)',
    txt: 'Members of the Minas elite, in debt and threatened by a forced collection of overdue taxes (the derrama), plan a republic inspired by the United States; a Brazilian student even sought out Thomas Jefferson in France in 1787. The conspiracy is betrayed and Tiradentes is hanged in 1792.', src: ['maxwell'] },
  { id: 'france1789', y: 1789, k: 'ideas', place: 'Paris', p: [2.35, 48.86], t: 'French Revolution',
    txt: 'The revolution overthrows absolutism in France and spreads the ideas of popular sovereignty and the rights of man. Ten years later, it produces Napoleon Bonaparte.', src: ['schwarcz'] },
  { id: 'haiti', y: 1791, y2: 1804, k: 'conflict', place: 'Saint-Domingue', p: [-72.2, 19.76], t: 'Haitian Revolution',
    txt: 'In the French colony of Saint-Domingue, the world’s largest sugar producer, the enslaved rise up, abolish slavery and found Haiti in 1804. Production collapses and Cuba and Brazil take its place. Brazil’s slaveholding elites begin to fear the same could happen there.', src: ['james', 'schwarcz'] },
  { id: 'bahia1798', y: 1798, k: 'ideas', place: 'Salvador', p: [-38.45, -12.9], t: 'Bahian Conspiracy',
    txt: 'Tailors, soldiers and enslaved people in Salvador spread pamphlets calling for a republic, equality between whites and Blacks, and free trade. The conspiracy is crushed and, in 1799, four Black and mixed-race men are hanged.', src: ['schwarcz'] },
  { id: 'napoleon', y: 1799, y2: 1815, k: 'government', place: 'Paris', p: [2.6, 48.6], t: 'Napoleon Bonaparte',
    txt: 'A general who comes to power in 1799 and crowns himself emperor in 1804. His wars redraw Europe and, as a knock-on effect, the Americas.', src: ['gomes'] },
  { id: 'blockade', y: 1806, k: 'government', place: 'Berlin', p: [13.4, 52.52], t: 'Continental Blockade',
    txt: 'Unable to beat England at sea, Napoleon forbids the continent to trade with it. Portugal, an old ally of the English and dependent on that trade, tries to stay on both sides.', src: ['gomes'] },
  { id: 'junot', y: 1807, k: 'conflict', place: 'Lisbon', p: [-9.2, 38.7], t: 'French invasion and the flight of the court',
    txt: 'France and Spain agree to divide Portugal, and Junot’s troops enter the country. On November 29 the royal family and thousands of people sail for Brazil under escort of the English navy. Junot reaches Lisbon the next day.', src: ['gomes', 'schultz'] },
  { id: 'openports', y: 1808, k: 'economy', place: 'Salvador', p: [-38.55, -13.05], t: 'Opening of the ports',
    txt: 'On January 28, still in Salvador, Prince John opens Brazil’s ports to trade with friendly nations. Lisbon’s monopoly ends. In practice, England benefits most.', src: ['gomes', 'fausto'] },
  { id: 'court', y: 1808, k: 'government', place: 'Rio de Janeiro', p: [-43.17, -22.9], t: 'The court arrives in Rio',
    txt: 'The court arrives in Rio in March. For the first time, a European empire is ruled from a colony. Rio gains a press, a bank, a library, a military academy and a botanical garden, and many residents are evicted to house the royal retinue.', src: ['gomes', 'schultz', 'schwarcz'] },
  { id: 'spain1808', y: 1808, k: 'conflict', place: 'Madrid', p: [-3.5, 40.6], t: 'Napoleon invades Spain',
    txt: 'Napoleon forces the Spanish king to abdicate and puts his brother, Joseph, on the throne. Without their legitimate king, the Spanish colonies form their own governing juntas. It is the start of the Spanish American wars of independence.', src: ['schwarcz'] },
  { id: 'treaties1810', y: 1810, k: 'economy', place: 'Rio de Janeiro', p: [-43.05, -22.95], t: 'Treaties with England',
    txt: 'Portugal grants England a 15% tariff on its goods, lower than the one charged to the Portuguese themselves, and promises to limit the slave trade. English pressure begins that will lead to the end of the trade in 1850.', src: ['fausto', 'gomes'] },
  { id: 'buenosaires', y: 1810, k: 'ideas', place: 'Buenos Aires', p: [-58.38, -34.6], t: 'May Revolution',
    txt: 'A governing junta takes power in Buenos Aires. In the following decades, Spanish America splits into several countries. Brazil, with the king at home, takes another path.', src: ['schwarcz'] },
  { id: 'vienna', y: 1815, k: 'government', place: 'Vienna', p: [16.37, 48.21], t: 'Congress of Vienna',
    txt: 'With Napoleon defeated, the powers redraw Europe and restore the monarchies. It is in this climate that Prince John raises Brazil to the rank of kingdom.', src: ['gomes'] },
  { id: 'unitedkingdom', y: 1815, k: 'government', place: 'Rio de Janeiro', p: [-43.3, -22.85], t: 'United Kingdom of Portugal, Brazil and the Algarves',
    txt: 'Brazil stops being a colony and becomes a kingdom united with Portugal, with its capital in Rio. In 1818 John is acclaimed king, in Rio.', src: ['gomes', 'schultz'] },
  { id: 'pernambuco1817', y: 1817, k: 'conflict', place: 'Recife', p: [-34.95, -8.1], t: 'Pernambuco Revolution',
    txt: 'Merchants, priests and military officers in Recife proclaim a republic that lasts about two months. Among their complaints were the taxes levied to support the court in Rio.', src: ['schwarcz', 'fausto'] },
  { id: 'porto', y: 1820, k: 'ideas', place: 'Porto', p: [-8.61, 41.15], t: 'Porto Revolution',
    txt: 'A liberal revolution in Porto demands a constitution and the king’s return. The Cortes gathered in Lisbon also want Brazil to obey Lisbon again.', src: ['fausto'] },
  { id: 'return', y: 1821, k: 'government', place: 'Lisbon', p: [-9.05, 38.75], t: 'John VI returns to Portugal',
    txt: 'Pressed by the Cortes, John VI returns to Lisbon in April 1821 and leaves his son Pedro as regent in Brazil.', src: ['gomes'] },
  { id: 'independence', y: 1822, k: 'government', place: 'Ipiranga, São Paulo', p: [-46.61, -23.59], t: 'Independence',
    txt: 'The Cortes demand Pedro’s return; he stays (the Dia do Fico, "I’m staying" day, January 9) and, on September 7, breaks with Portugal. Brazil becomes an empire ruled by the heir to the Portuguese throne and keeps slavery. There was war in Bahia, Pará and Maranhão until 1824.', src: ['schwarcz', 'fausto'] },
  /* ---------- after independence ----------*/
  { id: 'equatorconfederation', y: 1824, k: 'conflict', place: 'Recife', p: [-35.1, -8.1], t: 'Confederation of the Equator',
    txt: 'In 1823, Pedro I shuts down the Constituent Assembly and, the next year, imposes a constitution that gives him the Moderating Power, above the other branches. Pernambuco rebels and calls on neighboring provinces to form a federal republic, the Confederation of the Equator. The movement is crushed within a few months; Frei Caneca is shot in 1825 because, according to tradition, no executioner would agree to hang him.', src: ['fausto', 'schwarcz'] },
  { id: 'cisplatina', y: 1825, y2: 1828, k: 'conflict', place: 'Banda Oriental', p: [-56.0, -33.0], t: 'Cisplatine War',
    txt: 'In 1825, the Orientales led by Juan Antonio Lavalleja rise against Brazilian rule, and Buenos Aires joins the war. The Empire’s navy blockades the Río de la Plata, but the war stalls and costs a great deal. With British mediation, both sides accept in 1828 the independence of the Eastern Republic of Uruguay. In Rio, the defeat and the cost wear down the emperor.', src: ['fausto', 'schwarcz'] },
  { id: 'abdication', y: 1831, k: 'government', place: 'Rio de Janeiro', p: [-43.2, -22.95], t: 'Pedro I abdicates',
    txt: 'Unpopular because of the lost war, the economic crisis and his preference for Portuguese-born men in government, Pedro I abdicates on April 7, 1831 in favor of his five-year-old son and leaves for Europe. Until 1840 Brazil is ruled by regents. It is the most turbulent period of the Empire: revolts break out from north to south, and many fear the country will split apart.', src: ['carvalho2', 'fausto'] },
  { id: 'males', y: 1835, k: 'conflict', place: 'Salvador', p: [-38.48, -13.0], t: 'Malê Revolt',
    txt: 'On the night of January 24–25, 1835, hundreds of Africans, many of them Muslims of Yoruba and Hausa origin, take to the streets of Salvador to seize the city. They were enslaved and freed people who met to study the Quran and wrote in Arabic. They are defeated within a few hours; dozens die, and the repression includes executions, floggings and the deportation of freed people to Africa. It was the most serious urban slave revolt in the Americas.', src: ['reis'] },
  { id: 'cabanagem', y: 1835, y2: 1840, k: 'conflict', place: 'Belém', p: [-48.45, -1.4], t: 'Cabanagem',
    txt: 'In Grão-Pará, poor Indigenous, Black and mixed-race people, the cabanos, join part of the local elite against the government appointed by Rio. They take Belém in 1835 and even govern the province. The repression lasts until 1840 and moves up the rivers. Estimates speak of about 30,000 dead, perhaps a third of the province’s population.', src: ['fausto', 'schwarcz'] },
  { id: 'farroupilha', y: 1835, y2: 1845, k: 'conflict', place: 'Piratini', p: [-53.1, -31.45], t: 'Ragamuffin War (Farrapos)',
    txt: 'Ranchers in Rio Grande do Sul, unhappy with the taxes on charque (dried beef) and with Rio’s power, rebel in 1835 and proclaim the Riograndense Republic the next year. The war lasts ten years and reaches Santa Catarina, with Giuseppe Garibaldi taking part. Black lancers, enslaved men who were promised freedom, fought on the Farroupilha side; whether the massacre of many of them at Porongos, in 1844, was an arranged betrayal is still debated.', src: ['fausto', 'schwarcz'] },
  { id: 'coffee', y: 1830, y2: 1930, k: 'economy', place: 'Paraíba Valley', p: [-43.66, -22.4], t: 'Coffee: from the Paraíba Valley to western São Paulo',
    txt: 'From the 1830s, coffee from the Paraíba Valley becomes Brazil’s main product, grown on cleared Atlantic Forest slopes by enslaved people. When the valley’s soil is exhausted, the plantations move into western São Paulo, now with railways and, after 1888, with immigrants. Around 1900, Brazil produces about three quarters of the world’s coffee, and the coffee barons run politics until 1930.', src: ['stein', 'fausto'] },
  { id: 'aberdeen', y: 1845, k: 'government', place: 'London', p: [-0.3, 51.4], t: 'Aberdeen Act',
    txt: 'Brazil had promised Great Britain to end the slave trade, and an 1831 law banned it, but it was "para inglês ver", only for show: more than 700,000 Africans entered illegally in the next two decades. In 1845, the British Parliament passes a law allowing the English navy to seize Brazilian slave ships and try them in British courts. In 1850, English ships even attack slave ships inside Brazilian ports.', src: ['bethell', 'alencastro'] },
  { id: 'eusebio', y: 1850, k: 'government', place: 'Rio de Janeiro', p: [-43.1, -22.85], t: 'Eusébio de Queirós Law',
    txt: 'Pressed by British ships and afraid of open conflict, the government passes a law against the slave trade on September 4, 1850 and, this time, enforces it. Within a few years, landings of Africans stop. Slavery continues, but now depends on internal trade: enslaved people are sold from the Northeast to the coffee plantations of the Southeast.', src: ['bethell', 'fausto'] },
  { id: 'landlaw', y: 1850, k: 'economy', place: 'Rio de Janeiro', p: [-43.45, -22.75], t: 'Land Law',
    txt: 'Two weeks after the law against the slave trade, the Land Law rules that public land can only be obtained by purchase. Those who already occupied land could register their claim, which favored the big landowners, and the money from sales was meant to pay for bringing in European settlers. For those without money, such as the future freed people and poor immigrants, it became harder to own land. Many Indigenous lands came to be treated as "devolutas", that is, ownerless.', src: ['carneiro', 'fausto'] },
  { id: 'civilwar', y: 1861, y2: 1865, k: 'conflict', place: 'Virginia', p: [-77.43, 37.54], t: 'Civil war in the United States',
    txt: 'The slaveholding states of the South secede and are defeated after four years of war; slavery ends in the United States in 1865. Brazil becomes, along with Cuba, an exception in the Americas, and pressure on the Empire grows. A few thousand Southerners emigrate to Brazil, where slavery was still legal; some of them settle near what is now Americana, in São Paulo.', src: ['mcpherson', 'schwarcz'] },
  { id: 'paraguaywar', y: 1864, y2: 1870, k: 'conflict', place: 'Humaitá', p: [-58.5, -27.07], t: 'Paraguayan War',
    txt: 'In 1864, the Paraguay of Francisco Solano López, clashing with Brazil over politics in Uruguay, seizes a Brazilian ship and invades Mato Grosso and then Argentina. Brazil, Argentina and Uruguay form the Triple Alliance. The war lasts until 1870, with the death of López, and devastates Paraguay: estimates of the dead range from less than a fifth to more than half of the population. The idea that Great Britain provoked the war, common in the 1970s, has been dropped by most historians.', src: ['doratioto'] },
  { id: 'meiji', y: 1868, k: 'government', place: 'Tokyo', p: [139.7, 35.68], t: 'Meiji Restoration',
    txt: 'In 1868, a group of samurai overthrows the shogunate and rules in the name of Emperor Meiji. Japan industrializes in a hurry, creates a national army and starts collecting the land tax in money, which drives many peasants into debt. From 1885, Japanese emigrate to Hawaii and the United States; when the Americans close the door, in 1907–1908, Brazil becomes a destination.', src: ['jansen'] },
  { id: 'italy', y: 1861, y2: 1914, k: 'peoples', place: 'Genoa', p: [8.93, 44.55], t: 'Italy: unification and emigration',
    txt: 'The unification of Italy, between 1861 and 1870, did not solve rural poverty: heavy taxes, small plots and falling grain prices pushed millions of people out of the country. Ships left the ports of Genoa and Naples for New York, Buenos Aires and Santos. More than a million Italians went to Brazil before the First World War, many of them from the Veneto.', src: ['franzina'] },
  { id: 'freewomb', y: 1871, k: 'government', place: 'Rio de Janeiro', p: [-43.25, -22.85], t: 'Law of the Free Womb',
    txt: 'The law of September 28, 1871 declares free the children of enslaved women born from that date on. But the master could keep the child working until age 21, or hand them over to the State at age 8 in exchange for compensation. It was abolition drop by drop, designed so that slavery would end slowly and at no loss to the masters.', src: ['chalhoub', 'fausto'] },
  { id: 'immigration', y: 1870, y2: 1930, k: 'peoples', place: 'Santos', p: [-46.33, -23.96], t: 'Immigrants for coffee',
    txt: 'To replace enslaved labor, São Paulo planters and the provincial government start paying the passage of European families. Between 1887 and 1930, about 3.8 million immigrants enter Brazil, mostly Italians, Portuguese and Spaniards; most land in Santos and pass through the Immigrants’ Hostel in São Paulo. On the plantations the work was hard and debts were common, and in 1902 Italy banned subsidized emigration to Brazil. In the South, colonies of Germans and Italians had been settling land since 1824.', src: ['holloway', 'fausto'] },
  { id: 'rubber', y: 1879, y2: 1912, k: 'economy', place: 'Manaus', p: [-60.02, -3.1], t: 'Rubber and Manaus',
    txt: 'Vulcanization, and later bicycle and car tires, make Amazonian rubber one of the most sought-after products in the world. Hundreds of thousands of people from the Northeast, many fleeing the great drought of 1877, go to work on the rubber estates, bound by debts to their bosses; Indigenous peoples are driven out or enslaved. Manaus gains electric light, streetcars and the Teatro Amazonas, opened in 1896. When British plantations in Asia, grown from seeds taken from Pará, start producing, the price collapses.', src: ['weinstein'] },
  { id: 'abolition', y: 1888, k: 'peoples', place: 'Rio de Janeiro', p: [-43.18, -22.92], t: 'Abolition',
    txt: 'On May 13, 1888, Princess Isabel signs the Golden Law, and Brazil is the last country in the Americas to end slavery. The law came after years of abolitionist campaigning, with Luiz Gama, André Rebouças, Joaquim Nabuco and José do Patrocínio, and after mass escapes from São Paulo plantations in 1887 and 1888. About 700,000 people were still enslaved. There was no compensation for the masters, but there was also no land, school or guaranteed work for the freed people.', src: ['chalhoub', 'schwarcz'] },
  { id: 'republic', y: 1889, k: 'government', place: 'Rio de Janeiro', p: [-43.19, -22.9], t: 'Proclamation of the Republic',
    txt: 'On November 15, 1889, troops led by Marshal Deodoro da Fonseca bring down the cabinet and, the same day, the monarchy; the imperial family is sent into exile. Positivist officers, São Paulo republicans and planters angry at abolition without compensation backed the change. According to a republican of the time, the people "looked on dumbfounded", without understanding what was going on.', src: ['carvalho', 'schwarcz'] },
  { id: 'canudos', y: 1896, y2: 1897, k: 'conflict', place: 'Canudos, Bahia', p: [-39.1, -9.95], t: 'Canudos',
    txt: 'In the backlands (sertão) of Bahia, followers of the lay preacher Antônio Conselheiro found, from 1893, the settlement of Belo Monte, with thousands of residents, shared gardens and their own rules. The Republic sees a monarchist threat there and sends four military expeditions; the first three are defeated. In October 1897 the settlement is destroyed, and many prisoners have their throats cut. Euclides da Cunha, who followed the campaign as a journalist, told the story in Os sertões (1902).', src: ['euclides', 'schwarcz'] },
  { id: 'petropolis', y: 1903, k: 'government', place: 'Petrópolis', p: [-43.18, -22.5], t: 'Treaty of Petrópolis',
    txt: 'Acre, a Bolivian territory, was already settled by thousands of Brazilian rubber tappers, who rebelled against Bolivia in 1902 under the command of Plácido de Castro. By the treaty signed in Petrópolis on November 17, 1903, Brazil buys Acre for 2 million pounds and promises to build the Madeira-Mamoré railway, to give Bolivia an outlet via the Amazon. The negotiation was led by the Baron of Rio Branco.', src: ['fausto', 'weinstein'] },
  { id: 'vaccinerevolt', y: 1904, k: 'conflict', place: 'Rio de Janeiro', p: [-43.22, -22.88], t: 'Vaccine Revolt',
    txt: 'Mayor Pereira Passos tears down tenements to open avenues in central Rio, and the public health doctor Oswaldo Cruz fights yellow fever, plague and smallpox. When smallpox vaccination becomes compulsory, in November 1904, the poor population, evicted and distrustful, raises barricades for a week. The revolt is crushed, hundreds of people are arrested and many are sent to Acre. For José Murilo de Carvalho, it was also a revolt against a State that entered people’s homes without asking.', src: ['carvalho', 'chalhoub2'] },
  { id: 'rondon', y: 1907, y2: 1915, k: 'peoples', place: 'Mato Grosso and Rondônia', p: [-60.1, -12.7], t: 'The Rondon Commission and the SPI',
    txt: 'Between 1907 and 1915, the commission led by Cândido Rondon runs telegraph lines from Mato Grosso to the Madeira River, crossing the lands of the Paresi, the Nambikwara and other peoples. The motto was "die if need be, kill never". In 1910, Rondon becomes head of the new Indian Protection Service (SPI), which replaced war with "pacification", with the aim of integrating Indigenous people as workers. The contacts brought diseases that killed many people.', src: ['diacon', 'carneiro'] },
  { id: 'kasato', y: 1908, k: 'peoples', place: 'Santos', p: [-46.4, -23.9], t: 'Kasato Maru',
    txt: 'On June 18, 1908, the ship Kasato Maru reaches Santos with 781 Japanese immigrants hired for coffee plantations; the voyage from Kobe took more than 50 days. Conditions on the plantations were disappointing and many broke their contracts, but immigration continued: by 1941 close to 190,000 Japanese had arrived. Today Brazil has the largest population of Japanese descent outside Japan.', src: ['handa'] },
  { id: 'lashrevolt', y: 1910, k: 'conflict', place: 'Guanabara Bay', p: [-43.12, -22.82], t: 'Revolt of the Lash',
    txt: 'On November 22, 1910, sailors, most of them Black and mixed-race, seize the navy’s most modern warships and point the guns at Rio. They demand an end to flogging with the lash, still used twenty-two years after abolition. The government agrees and grants the rebels amnesty, but soon afterwards many are arrested, killed or sent to the Amazon. Their leader, João Cândido, became known as the Black Admiral.', src: ['morel', 'schwarcz'] },
  { id: 'artweek22', y: 1922, k: 'ideas', place: 'São Paulo', p: [-46.64, -23.545], t: 'Modern Art Week',
    txt: 'In February 1922, at the Theatro Municipal in São Paulo, writers, painters and musicians such as Mário de Andrade, Oswald de Andrade, Anita Malfatti and Villa-Lobos present an art that breaks with European models. In 1928, Oswald’s Cannibalist Manifesto proposes to "devour" foreign culture as the Tupinambá devoured their enemies, to keep its strength: "Tupi or not tupi, that is the question". It was a movement of the São Paulo elite, and how much weight it had at the time is debated.', src: ['schwarcz'] },
  { id: 'crash29', y: 1929, k: 'economy', place: 'New York', p: [-74.0, 40.71], t: 'The New York Stock Exchange crash',
    txt: 'In October 1929, shares plunge on the New York Stock Exchange and the greatest economic crisis of the 20th century begins. The United States was the biggest buyer of Brazilian coffee, and the price of coffee falls by more than half. To prop up the price, the Brazilian government starts buying and burning coffee: from 1931 to 1944, about 78 million sacks were destroyed.', src: ['hobsbawm', 'fausto'] },
  { id: 'rev1930', y: 1930, k: 'conflict', place: 'Porto Alegre', p: [-51.15, -29.95], t: 'Revolution of 1930',
    txt: 'President Washington Luís names another Paulista, Júlio Prestes, to succeed him, breaking the deal with Minas Gerais. Prestes wins the March 1930 election, and the murder of João Pessoa, running mate on the losing ticket, sets off the revolt. In October, troops march from Rio Grande do Sul, Minas and Paraíba; Washington Luís is deposed and Getúlio Vargas takes over the government. For some it was a revolution, for others a reshuffle among elites.', src: ['fausto30', 'fausto'] },
  { id: 'estadonovo', y: 1937, y2: 1945, k: 'government', place: 'Rio de Janeiro', p: [-43.3, -22.9], t: 'Estado Novo (New State)',
    txt: 'In November 1937, on the pretext of a fake communist plot, Vargas shuts Congress and imposes a new constitution. The state flags are burned in a ceremony in Rio, the press is censored and opponents are arrested and tortured. At the same time, the government creates labor laws, gathered in the CLT (Consolidation of Labor Laws) in 1943, and founds state companies such as the Volta Redonda steelworks. Vargas is deposed by the military in October 1945.', src: ['fausto', 'schwarcz'] },
  { id: 'feb', y: 1944, y2: 1945, k: 'conflict', place: 'Monte Castello, Italy', p: [10.95, 44.2], t: 'The FEB in Italy',
    txt: 'After German submarines sank Brazilian ships, Brazil enters the Second World War in 1942 on the Allied side and grants the United States bases in the Northeast. In 1944, about 25,000 soldiers of the Brazilian Expeditionary Force (FEB) land in Italy; they take Monte Castello in February 1945, after several attempts, and close to 450 die in the campaign. Fighting fascism in Europe under a dictatorship at home weakened the Estado Novo.', src: ['fausto', 'skidmore'] },
  { id: 'petrobras', y: 1953, k: 'economy', place: 'Bahia’s Recôncavo', p: [-38.55, -12.72], t: 'Petrobras: "the oil is ours"',
    txt: 'Brazil’s first oil well gushed in 1939, at Lobato, in Salvador. After a national campaign with the slogan "the oil is ours", the Vargas government creates Petrobras in 1953, with a monopoly on exploration. The fields and the refinery of Bahia’s Recôncavo were, at the time, almost all of the country’s production. The next year, in the middle of a political crisis, Vargas kills himself in the Catete Palace.', src: ['skidmore'] },
  { id: 'cuba1959', y: 1959, k: 'ideas', place: 'Havana', p: [-82.38, 23.05], t: 'Cuban Revolution',
    txt: 'On January 1, 1959, Fidel Castro’s guerrillas overthrow the dictatorship of Fulgencio Batista. In 1961 Cuba declares itself socialist and moves closer to the Soviet Union. In the Cold War, fear of "a new Cuba" leads the United States to back military coups across Latin America.', src: ['hobsbawm', 'gaspari'] },
  { id: 'brasilia', y: 1960, k: 'government', place: 'Brasília', p: [-47.88, -15.79], t: 'Brasília',
    txt: 'Moving the capital inland had been planned since the Constitution of 1891, and Juscelino Kubitschek made it the main goal of his plan of "fifty years in five". With Lúcio Costa’s plan and Oscar Niemeyer’s buildings, the city is built in less than four years and inaugurated on April 21, 1960. The workers who built it, the candangos, came mostly from the Northeast and Minas and went to live in satellite towns, far from the central "pilot plan".', src: ['holston', 'skidmore'] },
  { id: 'xingu1961', y: 1961, k: 'peoples', place: 'Xingu Indigenous Park', p: [-53.0, -11.8], t: 'Xingu Indigenous Park',
    txt: 'The brothers Orlando, Cláudio and Leonardo Villas Bôas reached the Xingu with the Roncador-Xingu Expedition in the 1940s and began to argue for land reserved there for Indigenous peoples. With support from Darcy Ribeiro and others, the park is created in 1961, the country’s first large Indigenous territory. Today 16 peoples live in it, among them the Kuikuro, descendants of the garden villages of the 13th century. The Villas Bôas’ policy, which even moved whole peoples into the park, is praised and also criticized as paternalistic.', src: ['villasboas', 'carneiro'] },
  { id: 'coup64', y: 1964, y2: 1985, k: 'conflict', place: 'Juiz de Fora', p: [-43.35, -21.76], t: 'The 1964 coup and the dictatorship',
    txt: 'On March 31, 1964, troops leave Juiz de Fora heading for Rio, and President João Goulart, who championed reforms such as land reform, is deposed without resistance. The coup had the support of business leaders, the press, part of the middle class and the United States government. The dictatorship lasts 21 years; AI-5 (Institutional Act No. 5), of 1968, opens the period of harshest censorship, torture and disappearances. The National Truth Commission recognized 434 political dead and disappeared.', src: ['gaspari', 'cnv'] },
  { id: 'transamazon', y: 1970, y2: 1974, k: 'peoples', place: 'Altamira', p: [-52.2, -3.2], t: 'Trans-Amazonian Highway',
    txt: 'In 1970, the Médici government announces an east–west road across the Amazon, to bring "men without land to a land without men". But the land had people: roads and settlement projects brought forced contact and epidemics to peoples such as the Parakanã, the Arara and the Panará, who lost much of their population. The National Truth Commission estimated that at least 8,350 Indigenous people were killed by the action or neglect of the State between 1946 and 1988. The road was never finished as planned.', src: ['cnv', 'carneiro'] },
  { id: 'diretas', y: 1984, k: 'ideas', place: 'São Paulo', p: [-46.6, -23.5], t: 'Diretas Já (Direct Elections Now)',
    txt: 'Between 1983 and 1984, rallies draw huge crowds, with more than a million people in Rio and in São Paulo, for the return of direct presidential elections. The Dante de Oliveira amendment is defeated in the Chamber of Deputies on April 25, 1984, 22 votes short. Even so, the opposition wins the indirect election the next year with Tancredo Neves, who falls ill and dies before taking office; José Sarney becomes president.', src: ['skidmore2', 'schwarcz'] },
  { id: 'constitution', y: 1988, k: 'government', place: 'Brasília', p: [-47.86, -15.82], t: 'Constitution of 1988',
    txt: 'The Constitution promulgated on October 5, 1988 restores direct voting, expands social rights and makes racism a crime. In Articles 231 and 232, it recognizes Indigenous peoples’ social organization, customs and languages and their "original rights" to the lands they traditionally occupy, setting aside the idea that they should be forcibly integrated. In the Constituent Assembly, Ailton Krenak painted his face with genipap at the speaker’s podium, in protest. Another article guarantees land ownership to the remaining quilombo communities (descendants of runaway-slave settlements).', src: ['carneiro', 'krenak', 'schwarcz'] }
];

/* ---------- links: [from, to, type, why, debated?] ----------*/
export const LINKS = [
  ['tordesillas', 'cabral', 'enables', 'The line gave Portugal the lands to the east, where Cabral landed.'],
  ['gama', 'cabral', 'enables', 'Cabral’s fleet was the second voyage to India, along the route Gama had opened.'],
  ['cabral', 'brazilwood', 'enables', 'The contact opened the coast to the timber trade.'],
  ['tupi', 'brazilwood', 'enables', 'Cutting and carrying the logs depended on the labor of, and alliances with, Tupi peoples.'],
  ['cabral', 'epidemics', 'cause', 'The contact brought diseases to which the peoples of the Americas had no immunity.'],
  ['epidemics', 'xingu', 'cause', 'The epidemics reached the interior and emptied the villages of the Xingu.'],
  ['brazilwood', 'captaincies', 'cause', 'The French presence in the brazilwood trade led the Crown to settle the territory.'],
  ['captaincies', 'salvador', 'cause', 'The failure of most captaincies led to the creation of a central government.'],
  ['captaincies', 'tamoios', 'provokes', 'The settlers of São Vicente raided villages to take slaves; the Tupinambá fought back.'],
  ['franceantarctique', 'tamoios', 'connects', 'The Tupinambá allied with the French were the same ones as in the confederation.'],
  ['tupi', 'tamoios', 'connects', 'The confederation was an alliance between Tupinambá villages.'],
  ['salvador', 'missions', 'enables', 'The Jesuits arrived with the general government and began gathering Indigenous people into villages.'],
  ['captaincies', 'sugar', 'enables', 'The first sugar mills were born in the captaincies of São Vicente and Pernambuco.'],
  ['epidemics', 'slavetrade', 'cause', 'As Indigenous people died, the sugar mill owners began buying more Africans.'],
  ['sugar', 'slavetrade', 'cause', 'The sugar mills needed a great deal of enslaved labor.'],
  ['kongo', 'luanda', 'enables', 'Portugal already had relations and trade in Kongo before founding Luanda, to the south.'],
  ['luanda', 'slavetrade', 'enables', 'Angola became the main point of departure for enslaved people shipped to Brazil.'],
  ['alcacer', 'iberianunion', 'cause', 'With no heir, the throne passed to Philip II of Spain.'],
  ['iberianunion', 'dutch', 'cause', 'At war with Spain, the Dutch attacked the Spanish king’s lands, Brazil included.'],
  ['sugar', 'dutch', 'cause', 'Pernambuco was the center of sugar, which the Dutch already refined and sold.'],
  ['iberianunion', 'bandeiras', 'enables', 'With a single king, the Tordesillas border mattered less to the Paulistas’ advance.', true],
  ['bandeiras', 'missions', 'provokes', 'The raids pushed the missions south and led the Jesuits to arm the Guarani.'],
  ['dutch', 'luanda1641', 'cause', 'The Dutch sugar mills needed enslaved Africans.'],
  ['slavetrade', 'luanda1641', 'connects', 'Whoever controlled Angola controlled the labor for sugar.'],
  ['dutch', 'palmares', 'enables', 'The war disrupted the sugar mills and made escape easier; Palmares grew in those years.'],
  ['sugar', 'palmares', 'provokes', 'Palmares was formed by people fleeing the sugar mills.'],
  ['bandeiras', 'palmares', 'connects', 'It was a bandeirante from São Paulo, Domingos Jorge Velho, who led the destruction of Palmares in 1694.'],
  ['dutch', 'caribbean', 'cause', 'After their expulsion, the Dutch and Sephardic Jews took sugar techniques to the Caribbean.', true],
  ['caribbean', 'gold', 'cause', 'The sugar crisis led the Crown to encourage the search for metals in the interior.', true],
  ['bandeiras', 'gold', 'enables', 'The Paulistas who found gold came from the tradition of the bandeiras (slaving and prospecting expeditions).'],
  ['restoration', 'methuen', 'enables', 'To stand up to Spain, Portugal allied with England; the 1703 treaty deepens that alliance.'],
  ['gold', 'methuen', 'connects', 'Gold from Minas paid the trade deficit with England.'],
  ['methuen', 'industrialrev', 'enables', 'Some historians say Brazilian gold helped finance English industrialization; others think the effect was small.', true],
  ['gold', 'slavetrade', 'cause', 'The mines greatly increased the demand for enslaved people.'],
  ['gold', 'riocapital', 'cause', 'The gold left through the port of Rio.'],
  ['gold', 'madrid', 'enables', 'The settlement of the interior by miners gave Portugal the argument of possession.'],
  ['bandeiras', 'madrid', 'enables', 'The Paulistas’ westward advance also weighed in the argument of possession.'],
  ['madrid', 'guaraniwar', 'cause', 'The treaty ordered the Guarani of the Seven Peoples to move.'],
  ['missions', 'guaraniwar', 'connects', 'The Seven Peoples were Jesuit missions.'],
  ['guaraniwar', 'pombal', 'cause', 'Pombal accused the Jesuits of stirring up the Guarani, one of the reasons for the 1759 expulsion.'],
  ['pombal', 'riocapital', 'connects', 'Moving the capital was a decision of Pombal’s government.'],
  ['gold', 'minasconspiracy', 'cause', 'With gold running short, the Crown threatened to collect the overdue taxes (the derrama).'],
  ['usa', 'minasconspiracy', 'inspires', 'The conspirators took American independence as their model.'],
  ['france1789', 'bahia1798', 'inspires', 'The pamphlets of Salvador echoed the ideas of the French Revolution.'],
  ['france1789', 'haiti', 'inspires', 'The French debates on rights and citizenship resonated in Saint-Domingue.'],
  ['haiti', 'independence', 'connects', 'Fear of a revolt like Haiti’s helped the elites prefer independence without social upheaval.', true],
  ['france1789', 'napoleon', 'enables', 'The revolutionary wars brought Napoleon to power.'],
  ['napoleon', 'blockade', 'cause', 'It was Napoleon’s weapon against England.'],
  ['blockade', 'junot', 'cause', 'Portugal did not close its ports to the English, and Napoleon ordered an invasion.'],
  ['methuen', 'junot', 'connects', 'The old alliance and trade dependence explain why Portugal could not join the blockade.'],
  ['junot', 'court', 'cause', 'The court fled the invasion, escorted by the English navy.'],
  ['junot', 'openports', 'cause', 'With Lisbon occupied, Brazil’s trade could no longer pass through it.'],
  ['industrialrev', 'openports', 'connects', 'Industrial England needed markets, and Brazil became one of them.'],
  ['openports', 'treaties1810', 'enables', 'After the ports opened, England won privileged terms.'],
  ['industrialrev', 'treaties1810', 'connects', 'The treaties opened the Brazilian market to English goods and tied the end of the slave trade to British pressure.'],
  ['napoleon', 'spain1808', 'cause', 'The same expansion that invaded Portugal brought down the Spanish king.'],
  ['spain1808', 'buenosaires', 'cause', 'Without a legitimate king, the colonies formed governing juntas.'],
  ['court', 'independence', 'enables', 'With the government based in Rio, Brazil already had its own center of power when it broke with Portugal; this helps explain why it did not split apart like Spanish America.', true],
  ['buenosaires', 'independence', 'connects', 'Contrast: there independence split the territory, here it did not.'],
  ['napoleon', 'vienna', 'cause', 'The congress reorganized Europe after Napoleon’s defeat.'],
  ['vienna', 'unitedkingdom', 'enables', 'The elevation gave the king a place among the restored monarchies of Europe.', true],
  ['court', 'unitedkingdom', 'cause', 'With the king living in Rio, keeping Brazil a colony made no sense.'],
  ['court', 'pernambuco1817', 'provokes', 'The taxes to support the court in Rio weighed on the provinces.'],
  ['unitedkingdom', 'porto', 'provokes', 'In Portugal, being subordinate to Rio sparked revolt.'],
  ['france1789', 'porto', 'inspires', 'The revolutionaries of Porto wanted a liberal constitution.'],
  ['porto', 'return', 'cause', 'The Cortes demanded the king’s return.'],
  ['return', 'independence', 'enables', 'Pedro stayed as regent in Rio, and it was he who broke with Lisbon.'],
  ['openports', 'independence', 'enables', 'After 1808, Brazil’s merchants and landowners would not accept a return to Lisbon’s monopoly.'],
  /* before 1450*/
  ['luzia', 'pedrapintada', 'connects', 'The two sites show people living in the cerrado and in the forest more than 11,000 years ago, in very different ways.'],
  ['pedrapintada', 'terrapreta', 'enables', 'Thousands of years of living with the forest prepared the management of plants and soils that left terra preta behind.', true],
  ['sambaquis', 'tupiguarani', 'connects', 'The arrival of Tupi and Jê peoples on the coast coincides with the end of the sambaquis; whether there was conquest, mixing or replacement is debated.', true],
  ['tupiguarani', 'tupi', 'cause', 'The Tupinambá the Europeans met on the coast descended from this expansion.'],
  ['tupiguarani', 'missions', 'connects', 'The Guarani of the missions descended from the groups that went down the Paraná and the Uruguay.'],
  ['terrapreta', 'marajoara', 'connects', 'Large, long-lasting villages that transformed the Amazonian landscape.'],
  ['terrapreta', 'tapajo', 'enables', 'The great settlement of Santarém sat on terra preta, which supported many people in one place.'],
  ['terrapreta', 'xingu', 'connects', 'The villages of the upper Xingu also left terra preta and managed forests around them.'],
  ['geoglyphs', 'xingu', 'connects', 'Ditches, paths and plazas: as on the upper Xingu, a planned landscape without a city and without a State.'],
  ['marajoara', 'tapajo', 'connects', 'Both cases are at the center of the debate on chiefdoms in the Amazon: were there chiefs with power over many villages, or not?', true],
  ['epidemics', 'tapajo', 'cause', 'Diseases and slave-raiding expeditions from Belém emptied the Tapajós in the 17th century.'],
  /* after 1822*/
  ['independence', 'equatorconfederation', 'provokes', 'The constitution imposed by Pedro I after independence drove Pernambuco to revolt.'],
  ['pernambuco1817', 'equatorconfederation', 'connects', 'Several leaders of 1824, such as Frei Caneca, had taken part in the republic of 1817.'],
  ['independence', 'cisplatina', 'enables', 'The new empire inherited Cisplatina, occupied by Prince John’s troops from 1816.'],
  ['buenosaires', 'cisplatina', 'connects', 'Buenos Aires had contested the Banda Oriental with Rio since colonial times.'],
  ['cisplatina', 'abdication', 'cause', 'The lost war and its costs wore down Pedro I.'],
  ['abdication', 'cabanagem', 'enables', 'Under the Regency, central power weakened and disputes in the provinces exploded.', true],
  ['abdication', 'farroupilha', 'enables', 'The Farroupilhas took advantage of the Regency’s weakness to demand autonomy.', true],
  ['abdication', 'males', 'connects', 'The revolt happened under the Regency, amid a wave of uprisings across the country.', true],
  ['slavetrade', 'males', 'connects', 'The rebels had come through the slave trade, almost all shipped from the Mina Coast.'],
  ['haiti', 'males', 'connects', 'The Bahian authorities had feared a revolt like Haiti’s for decades.'],
  ['treaties1810', 'aberdeen', 'cause', 'Great Britain used the anti-slave-trade agreements signed since 1810, and the one of 1826, to justify the 1845 law.'],
  ['slavetrade', 'aberdeen', 'provokes', 'The illegal slave trade went on at a large scale.'],
  ['aberdeen', 'eusebio', 'cause', 'Pressure from the British navy led the government to actually end the slave trade.'],
  ['eusebio', 'landlaw', 'connects', 'The two laws of 1850 prepared the end of slavery: without easy access to land, freed people and immigrants would have to work for the planters.', true],
  ['industrialrev', 'coffee', 'enables', 'The industrial cities of Europe and the United States became big consumers of coffee.'],
  ['gold', 'coffee', 'enables', 'The roads and the port of Rio, opened in the age of gold, served the coffee of the Paraíba Valley.'],
  ['slavetrade', 'coffee', 'enables', 'The coffee plantations of the valley were built with Africans brought by the slave trade, legal and illegal.'],
  ['eusebio', 'immigration', 'cause', 'Without the slave trade, the planters began to look for workers in Europe.'],
  ['coffee', 'immigration', 'cause', 'The spread of coffee in São Paulo demanded more and more hands.'],
  ['italy', 'immigration', 'cause', 'The crisis in the Italian countryside pushed millions to emigrate.'],
  ['meiji', 'kasato', 'cause', 'Poverty in the Japanese countryside and the closing of the United States made Brazil a destination.'],
  ['immigration', 'kasato', 'connects', 'The Japanese came through the same system of subsidized immigration for coffee.'],
  ['cisplatina', 'paraguaywar', 'connects', 'The struggle for influence over Uruguay, inherited from Cisplatina, lies at the origin of the war.'],
  ['paraguaywar', 'republic', 'enables', 'The army came out of the war stronger and unhappy with the Empire’s politicians.'],
  ['paraguaywar', 'abolition', 'enables', 'Enslaved men fought in the war, and years later many officers refused to hunt down runaways.', true],
  ['civilwar', 'freewomb', 'cause', 'With slavery over in the United States, Brazil was isolated and the Empire began a gradual abolition.'],
  ['usa', 'civilwar', 'connects', 'The republic created in 1776 kept slavery in the South, which only ended with the civil war.'],
  ['freewomb', 'abolition', 'enables', 'The 1871 law announced the end of slavery; the abolitionist movement demanded it be immediate.'],
  ['palmares', 'abolition', 'inspires', 'The abolitionist quilombos of 1887–1888, such as Jabaquara in Santos, revived the tradition of escape and resistance.', true],
  ['abolition', 'republic', 'cause', 'Planters who lost their enslaved workers without compensation turned against the monarchy.', true],
  ['republic', 'canudos', 'provokes', 'The Republic saw a monarchist threat in Belo Monte and responded with the army.'],
  ['republic', 'vaccinerevolt', 'connects', 'The rebuilding of Rio and compulsory vaccination were projects of the new Republic to "civilize" the capital.'],
  ['industrialrev', 'rubber', 'cause', 'Industry, first with vulcanization and then with tires, created the demand for rubber.'],
  ['rubber', 'petropolis', 'cause', 'Brazilian rubber tappers already occupied Bolivian Acre.'],
  ['petropolis', 'rondon', 'connects', 'The Madeira-Mamoré railway and Rondon’s lines were part of the same effort to occupy the west.'],
  ['epidemics', 'rondon', 'connects', 'As in the 16th century, contact with the new neighbors brought diseases that killed many Indigenous people.'],
  ['abolition', 'lashrevolt', 'connects', 'The lash, a punishment for the enslaved, was still used on sailors who were almost all Black and mixed-race.'],
  ['tupi', 'artweek22', 'inspires', 'The Cannibalist Manifesto made the Tupinambá a metaphor for Brazilian culture.'],
  ['coffee', 'crash29', 'connects', 'With its economy tied to a single product, Brazil felt the crisis in full.'],
  ['crash29', 'rev1930', 'cause', 'The fall of coffee shook the base of the São Paulo planters’ Republic.', true],
  ['rev1930', 'estadonovo', 'enables', 'The Estado Novo hardened the government Vargas had led since 1930.'],
  ['estadonovo', 'feb', 'connects', 'It was Vargas’s dictatorship that, after wavering between the two sides, took Brazil to war with the Allies.'],
  ['estadonovo', 'petrobras', 'enables', 'The economic nationalism of the Estado Novo, which created the National Petroleum Council in 1938, paved the way for the monopoly.'],
  ['riocapital', 'brasilia', 'connects', 'The capital, in Rio since 1763, finally moves inland.'],
  ['brasilia', 'transamazon', 'connects', 'Brasília and the highways leading out of it are part of the same project to occupy the interior.'],
  ['rondon', 'xingu1961', 'enables', 'Rondon’s Indigenous policy and the Roncador-Xingu Expedition paved the way for the park.'],
  ['xingu', 'xingu1961', 'connects', 'The Kuikuro of the park descend from the garden villages of the upper Xingu.'],
  ['cuba1959', 'coup64', 'enables', 'Fear of a revolution like Cuba’s brought the coup plotters closer to the United States government.', true],
  ['coup64', 'transamazon', 'cause', 'The road was a project of the dictatorship, decided without consulting the peoples of the region.'],
  ['coup64', 'diretas', 'provokes', 'After two decades without direct presidential elections, the opposition took to the streets.'],
  ['diretas', 'constitution', 'enables', 'The movement for democracy led to the Constituent Assembly of 1987–1988.'],
  ['transamazon', 'constitution', 'provokes', 'Violence against the peoples of the Amazon strengthened the Indigenous movement that pressed the Constituent Assembly.'],
  ['xingu1961', 'constitution', 'enables', 'The park served as a model for the Indigenous territory that the Constitution turned into a right.', true],
  ['palmares', 'constitution', 'connects', 'The Constitution guarantees land to quilombola communities, heirs of places like Palmares.']
];

/* general readings on each topic (not page citations)*/
export const SOURCES = {
  fausto: 'Boris Fausto, História do Brasil (1994)',
  schwarcz: 'Lilia M. Schwarcz and Heloisa M. Starling, Brasil: uma biografia (2015)',
  alencastro: 'Luiz Felipe de Alencastro, O trato dos viventes (2000)',
  gomes: 'Laurentino Gomes, 1808 (2007)',
  schultz: 'Kirsten Schultz, Tropical Versailles (2001)',
  maxwell: 'Kenneth Maxwell, Conflicts and Conspiracies: Brazil and Portugal, 1750–1808 (1973)',
  cabralmello: 'Evaldo Cabral de Mello, O negócio do Brasil (1998)',
  hemming: 'John Hemming, Red Gold (1978)',
  schwartz: 'Stuart B. Schwartz, Sugar Plantations in the Formation of Brazilian Society (1985)',
  heckenberger: 'Michael Heckenberger and others, "Pre-Columbian urbanism, anthropogenic landscapes, and the future of the Amazon", Science (2008)',
  clastres: 'Pierre Clastres, Society Against the State (1974)',
  graeber: 'David Graeber and David Wengrow, The Dawn of Everything (2021)',
  furtado: 'Celso Furtado, Formação econômica do Brasil (1959)',
  james: 'C. L. R. James, The Black Jacobins (1938)',
  freitas: 'Décio Freitas, Palmares: a guerra dos escravos (1971)',
  boxer: 'Charles R. Boxer, The Golden Age of Brazil (1962)',
  caminha: 'Pero Vaz de Caminha, Carta a el-rei D. Manuel (letter to King Manuel I, 1500)',
  slavevoyages: 'SlaveVoyages database (slavevoyages.org)',
  // before 1450
  neves: 'Walter Neves and Luís Beethoven Piló, O povo de Luzia (2008)',
  prous: 'André Prous, Arqueologia brasileira (1992)',
  roosevelt: 'Anna C. Roosevelt and others, "Paleoindian cave dwellers in the Amazon", Science (1996)',
  eneves: 'Eduardo Góes Neves, Arqueologia da Amazônia (2006)',
  gaspar: 'Madu Gaspar, Sambaqui: arqueologia do litoral brasileiro (2000)',
  parssinen: 'Martti Pärssinen, Denise Schaan and Alceu Ranzi, "Pre-Columbian geometric earthworks in the upper Purús", Antiquity (2009)',
  schaan: 'Denise Pahl Schaan, Cultura marajoara (2009)',
  dgomes: 'Denise Maria Cavalcante Gomes, Cotidiano e poder na Amazônia pré-colonial (2008)',
  cfausto: 'Carlos Fausto, Os índios antes do Brasil (2000)',
  // after 1822
  carvalho: 'José Murilo de Carvalho, Os bestializados (1987)',
  carvalho2: 'José Murilo de Carvalho, A construção da ordem (1980)',
  reis: 'João José Reis, Rebelião escrava no Brasil (1986)',
  bethell: 'Leslie Bethell, The Abolition of the Brazilian Slave Trade (1970)',
  stein: 'Stanley J. Stein, Vassouras (1957)',
  doratioto: 'Francisco Doratioto, Maldita guerra (2002)',
  mcpherson: 'James M. McPherson, Battle cry of freedom (1988)',
  jansen: 'Marius B. Jansen, The making of modern Japan (2000)',
  franzina: 'Emilio Franzina, La grande emigrazione (1976)',
  holloway: 'Thomas H. Holloway, Immigrants on the Land (1980)',
  chalhoub: 'Sidney Chalhoub, Visões da liberdade (1990)',
  chalhoub2: 'Sidney Chalhoub, Cidade febril (1996)',
  weinstein: 'Barbara Weinstein, The Amazon Rubber Boom, 1850–1920 (1983)',
  euclides: 'Euclides da Cunha, Os sertões (1902)',
  diacon: 'Todd A. Diacon, Rondon (2006)',
  handa: 'Tomoo Handa, O imigrante japonês (1987)',
  morel: 'Edmar Morel, A Revolta da Chibata (1959)',
  hobsbawm: 'Eric Hobsbawm, The Age of Extremes (1994)',
  fausto30: 'Boris Fausto, A Revolução de 1930 (1970)',
  skidmore: 'Thomas Skidmore, Politics in Brazil, 1930–1964 (1967)',
  skidmore2: 'Thomas Skidmore, The Politics of Military Rule in Brazil, 1964–85 (1988)',
  holston: 'James Holston, The Modernist City (1989)',
  villasboas: 'Orlando and Cláudio Villas Bôas, A marcha para o oeste (1994)',
  gaspari: 'Elio Gaspari, A ditadura envergonhada (2002)',
  cnv: 'National Truth Commission (Comissão Nacional da Verdade), Relatório (2014)',
  carneiro: 'Manuela Carneiro da Cunha (ed.), História dos índios no Brasil (1992)',
  krenak: 'Ailton Krenak, Ideias para adiar o fim do mundo (2019)'
};

/* the world outside Brazil (world.js) goes into the same lists*/
EVENTS.push(...WORLD_EVENTS);
LINKS.push(...WORLD_LINKS);
Object.assign(SOURCES, WORLD_SOURCES);

/* ---------- between one map and the next: what is born, grows or disappears in a precise year ----------*/
// Founding year: the city appears small in that year and grows to the size it has on the next map.
const FOUNDED = {
  'São Vicente': 1532, 'Olinda': 1537, 'Salvador': 1549, 'São Paulo': 1554, 'Rio de Janeiro': 1565, 'Luanda': 1576, 'Recife': 1537,
  'Goa': 1510, 'Mexico City': 1521, 'Lima': 1535, 'Buenos Aires': 1580, 'São Luís': 1612, 'Belém': 1616, 'Bridgetown': 1628,
  'Colônia do Sacramento': 1680, 'Vila Rica': 1698, 'Diamantina': 1713, 'Cap-Français': 1670, 'Port-au-Prince': 1749, 'Madrid': 1561,
  // after 1822
  'Goiás': 1818, 'Petrópolis': 1843, 'Imperatriz': 1852, 'Ribeirão Preto': 1856, 'Itaituba': 1856, 'Kobe': 1868, 'Tokyo': 1868, 'Rio Branco': 1882, 'Florianópolis': 1894,
  'Bauru': 1896, 'Belo Horizonte': 1897, 'Campo Grande': 1899, 'Porto Velho': 1907, 'Altamira': 1911, 'Guajará-Mirim': 1912, 'Marabá': 1913,
  'Goiânia': 1933, 'Londrina': 1934, 'Volta Redonda': 1941, 'Brasília': 1957
};
// Year in which the city stops existing as it was (destroyed, abandoned or refounded under another name).
const ENDED = { 'Tenochtitlan': 1521, 'Calicut': 1549, 'Olinda': 1631, 'São Vicente': 1630, 'Colônia do Sacramento': 1750, 'Cusco': 1580,
  'Monte Verde': -11500, 'Edo': 1868, 'Desterro': 1894 };
// Capital from / until.
const CAPITAL = { 'Salvador': [1549, 1763], 'Rio de Janeiro': [1763, 1960], 'Brasília': [1960, 9999] };
// Places that existed between two maps: [name, lon, lat, size, culture, from, until]
const BETWEEN = [
  ['Tupinambá village', -43.05, -22.75, 1, 'x', 1450, 1567], ['Tupiniquim village', -39.3, -16.25, 1, 'x', 1450, 1560],
  ['Tupinambá village ', -38.75, -12.75, 1, 'x', 1450, 1563], ['Potiguara village', -35.3, -6.5, 1, 'x', 1450, 1600],
  ['Xingu village', -53.3, -12.1, 2, 'x', 1450, 1650], ['Porto Seguro', -39.06, -16.45, 1, 'r', 1535, 9999],
  ['Elmina', -1.35, 5.08, 1, 'r', 1482, 9999], ['Havana', -82.36, 23.13, 1, 'r', 1519, 9999], ['Cartagena', -75.5, 10.4, 1, 'r', 1533, 9999],
  ['Potosí', -65.75, -19.58, 2, 'r', 1545, 9999], ['Palmares', -36.05, -9.15, 1, 'x', 1605, 1695], ['São Miguel das Missões', -54.55, -28.55, 1, 'r', 1687, 1768],
  ['Cuiabá', -56.1, -15.6, 1, 'r', 1719, 9999], ['Vila Boa', -50.14, -15.93, 1, 'r', 1727, 1818], ['Porto Alegre', -51.22, -30.03, 1, 'r', 1772, 9999],
  ['Philadelphia', -75.16, 39.95, 1, 'r', 1682, 9999], ['Veracruz', -96.13, 19.2, 1, 'r', 1519, 9999],
  // before 1450
  ['Lagoa Santa', -43.9, -19.6, 1, 'x', -10000, -5000], ['Caverna da Pedra Pintada', -54.07, -2.0, 1, 'x', -9300, -7500],
  ['Caral', -77.52, -10.89, 2, 'a', -2600, -1800], ['Teotihuacan', -98.84, 19.69, 3, 'a', -100, 550],
  // after 1822
  ['Americana', -47.33, -22.74, 1, 'r', 1868, 9999], ['Canudos (Belo Monte)', -39.1, -9.95, 2, 'p', 1893, 1898],
  ['Fordlândia', -55.5, -3.83, 1, 'r', 1928, 1946], ['Serra Pelada', -49.65, -5.95, 2, 'p', 1980, 1992]
];
// Roads and routes with their opening year (and closing year, when there was one).
const ROAD_FROM = { 'São Paulo>Vila Rica': 1698, 'Rio de Janeiro>Vila Rica': 1707, 'Rio de Janeiro>Vila Rica>Diamantina': 1730, 'São Vicente>São Paulo': 1560,
  // railways
  'Rio de Janeiro>Petrópolis>Juiz de Fora': 1861, 'Santos>São Paulo>Jundiaí': 1867, 'Jundiaí>Campinas': 1872, 'Rio de Janeiro>São Paulo': 1877,
  'Santos>São Paulo>Jundiaí>Campinas>Ribeirão Preto': 1883, 'Rio de Janeiro>Juiz de Fora>Ouro Preto': 1888, 'Rio de Janeiro>Juiz de Fora>Belo Horizonte': 1897,
  'São Paulo>Curitiba>Porto Alegre': 1910, 'Porto Velho>Guajará-Mirim': 1912, 'São Paulo>Bauru>Campo Grande': 1914, 'São Paulo>Bauru>Campo Grande>Corumbá': 1952,
  // highways
  'Rio de Janeiro>Salvador': 1949, 'Rio de Janeiro>Juiz de Fora>Belo Horizonte>Brasília': 1960, 'Brasília>Goiânia': 1960, 'Brasília>Imperatriz>Belém': 1960,
  'Brasília>Cuiabá>Porto Velho>Rio Branco': 1968, 'Imperatriz>Marabá>Altamira>Itaituba': 1972, 'Porto Velho>Manaus': 1976
};
const LANES_BETWEEN = [
  { from: 1502, to: 1549, pts: LANES.india },                                                                                  // the India Run (Carreira da Índia), every year from 1502
  { from: 1566, to: 1790, pts: [[-6.3, 36.6], [-16, 28], [-40, 20], [-61, 16], [-75, 17], [-85, 21], [-96, 19.3]] },        // the silver fleet (Seville–Veracruz)
  { from: 1566, to: 1790, pts: [[-82.3, 23.3], [-79.5, 25.5], [-70, 33], [-40, 38], [-15, 37.5], [-6.3, 36.6]] },             // return via Havana
  { from: 1650, to: 1807, pts: [[-1.3, 4.9], [-15, 5], [-40, 10], [-59.6, 13.0]] },                                            // Mina Coast–Antilles
  { from: 1908, to: 1942, pts: STEAM.kobeSantos }, { from: 1953, to: 1985, pts: STEAM.kobeSantos },                            // Japanese immigration
  { from: 1944, to: 1946, pts: STEAM.rioNaples }                                                                               // the FEB convoys
];
const HOUSES = [0, 12, 26, 46];

/* the map of a year: the borders of the key map in force, plus the cities and routes of that exact year*/
export function eraAt(year) {
  let ki = 0; KEYFRAMES.forEach((f, i) => { if (f.from <= year) ki = i; });
  const K = KEYFRAMES[ki], later = KEYFRAMES.slice(ki + 1);
  const lerp = (a, b, f) => a + (b - a) * Math.min(1, Math.max(0, f));
  const cities = [], seen = new Set();
  const capOf = (name, cap) => CAPITAL[name] ? (year >= CAPITAL[name][0] && year < CAPITAL[name][1] ? 1 : 0) : cap;
  for (const [name, lon, lat, size, cul, cap] of K.cities) {
    if (seen.has(name) || (ENDED[name] && year >= ENDED[name])) continue; seen.add(name);
    const nx = later.find(f => f.cities.some(c => c[0] === name)), next = nx?.cities.find(c => c[0] === name);
    let s = size, houses = HOUSES[size];
    if (next && next[3] !== size && later[0] === nx) { const f = (year - K.from) / (nx.from - K.from); houses = lerp(HOUSES[size], HOUSES[next[3]], f); s = f >= 0.5 ? next[3] : size; }
    cities.push([name, lon, lat, s, cul, capOf(name, cap), Math.round(houses)]);
  }
  // the ones founded before they appear on the next map
  for (const f of later) for (const [name, lon, lat, size, cul, cap] of f.cities) {
    if (seen.has(name) || !(FOUNDED[name] <= year) || (ENDED[name] && year >= ENDED[name])) continue; seen.add(name);
    const g = (year - FOUNDED[name]) / Math.max(1, f.from - FOUNDED[name]);
    cities.push([name, lon, lat, g >= 0.5 ? Math.max(1, size - 1) : 1, cul, capOf(name, cap), Math.round(lerp(4, HOUSES[size], g))]);
  }
  for (const [name, lon, lat, size, cul, a, b] of BETWEEN) {
    if (year < a || year >= b || seen.has(name)) continue; seen.add(name);
    cities.push([name, lon, lat, size, cul, 0, Math.round(lerp(4, HOUSES[size], (year - a) / 25))]);
  }
  const names = new Set(cities.map(c => c[0]));
  const roads = K.roads.filter(r => (ROAD_FROM[r.join('>')] ?? 0) <= year && r.every(n => names.has(n)));
  for (const f of later) for (const r of f.roads) { const y0 = ROAD_FROM[r.join('>')]; if (y0 && y0 <= year && r.every(n => names.has(n)) && !roads.some(x => x.join() === r.join())) roads.push(r); }
  const lanes = [...K.lanes, ...LANES_BETWEEN.filter(l => year >= l.from && year < l.to).map(l => l.pts)];
  const sig = cities.map(c => c[0] + c[3] + c[5]).join() + '|' + roads.map(r => r.join('>')).join() + '|' + lanes.length;
  const houseSig = cities.map(c => c[6]).join();
  return { ...K, key: K, cities, roads, lanes, sig, houseSig };
}
