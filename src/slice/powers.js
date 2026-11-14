// Powers (color and name), the bands of the time slice and the link to the names in the basemap.
//
// WARNING, PROTOTYPE: the band weights (millions of people in each state within the region) are
// rough estimates written by hand to give the drawing its shape. The real version should compute
// them by crossing the borders with a population grid (HYDE). Each region's total comes from pop.js.

export const POWERS = {
  pt: ['Portugal', '#2E9E6B'], es: ['Spain', '#E0B030'], uk: ['United Kingdom', '#D14B5A'], fr: ['France', '#3C74C0'],
  nl: ['Netherlands', '#EC8232'], ot: ['Ottoman Empire', '#1F8A8A'], ru: ['Russia', '#7C6BB5'],
  ming: ['Ming China', '#D0694D'], qing: ['Qing China', '#B04A36'], tp: ['Taiping Heavenly Kingdom', '#E3A23C'], jp: ['Japan', '#C76FA0'],
  mg: ['Mughal Empire', '#7FA83A'], dl: ['Delhi Sultanate', '#A7B45A'], vj: ['Vijayanagara', '#B88A2A'], mr: ['Maratha Confederacy', '#E39A3B'],
  bg: ['Bengal Sultanate', '#5DAA8F'], dc: ['Deccan sultanates', '#9B8A4E'],
  tim: ['Timurid Empire', '#9A6A4F'], aq: ['Ak Koyunlu', '#B79A6A'], pe: ['Persia', '#5B93C9'], mam: ['Mamluk Sultanate', '#C2A14A'], af: ['Afghanistan', '#8C7A5B'],
  hre: ['Holy Roman Empire', '#9AA3AD'], at: ['Austria', '#A3906B'], de: ['Germany', '#5D6B78'], it: ['Italy', '#86B86B'],
  pl: ['Poland-Lithuania', '#C06C9B'], sc: ['Scandinavia', '#6FB1D6'], us: ['United States', '#5A55A6'],
  az: ['Mexica Empire', '#C2573B'], inca: ['Inca Empire', '#D9882B'], mx: ['Mexico', '#5FA85A'], br: ['Brazil', '#8CC04A'], hisp: ['Spanish American republics', '#C77F4A'],
  ml: ['Mali', '#C9973B'], so: ['Songhai', '#A8703A'], et: ['Ethiopia', '#7A9A4A'], kg: ['Kingdom of Kongo', '#5E9E8F'], oy: ['Oyo and Benin', '#B8804E'],
  sk: ['Sokoto Caliphate', '#4F8F6A'], kb: ['Kanem-Bornu', '#9A8F5A'], be: ['Congo Free State', '#B5A03A'],
  kr: ['Korea', '#5FA6B8'], vn: ['Vietnam', '#9BB85A'], sm: ['Siam', '#D08A5A'], bm: ['Burma', '#B86A8A'], mj: ['Majapahit', '#A07A3A'],
  ma: ['Morocco', '#B5524A'], gh: ['Golden Horde and Tatar khanates', '#A89A5A'], cak: ['Central Asian khanates', '#B08A5E'],
  ind: ['Indigenous peoples of North America', '#7FA08A'], ocp: ['Peoples of Oceania', '#8FA88A']
};

/* [region, power, label, [[year, millions]...]]: the band exists from the first to the last year in the list */
export const BANDS = [
  ['na', 'ind', 'Indigenous peoples', [[1400, 3], [1500, 3], [1600, 2.7], [1700, 1.6], [1800, 0.9], [1850, 0.5], [1900, 0.4]]],
  ['na', 'uk', 'English colonies', [[1607, 0.01], [1650, 0.06], [1700, 0.3], [1750, 1.2], [1776, 2.5]]],
  ['na', 'us', 'United States', [[1776, 2.5], [1800, 5.3], [1850, 23], [1900, 76]]],
  ['na', 'uk', 'Canada (United Kingdom)', [[1763, 0.1], [1800, 0.4], [1850, 2.4], [1900, 5.4]]],

  ['la', 'az', 'Mexica Empire', [[1428, 2], [1500, 6], [1521, 6]]],
  ['la', 'es', 'Spanish America', [[1492, 0.02], [1521, 3], [1535, 7], [1600, 6.5], [1700, 6.5], [1750, 9], [1800, 13], [1810, 14], [1825, 1.2], [1898, 1.8]]],
  ['la', 'mx', 'Mexico', [[1821, 6.5], [1850, 7.6], [1900, 13.6]]],
  ['la', 'hisp', 'Spanish American republics', [[1810, 0.5], [1825, 8], [1850, 12], [1900, 30]]],
  ['la', 'inca', 'Inca Empire', [[1438, 3], [1500, 10], [1533, 9]]],
  ['la', 'pt', 'Brazil (Portugal)', [[1500, 0.01], [1550, 0.05], [1600, 0.1], [1700, 0.3], [1750, 1.5], [1800, 3.3], [1822, 4.5]]],
  ['la', 'br', 'Brazil', [[1822, 4.5], [1850, 7.2], [1872, 10], [1900, 17.4]]],

  ['eu', 'pt', 'Portugal', [[1400, 1], [1500, 1.2], [1600, 1.3], [1700, 2], [1800, 2.9], [1900, 5.4]]],
  ['eu', 'es', 'Castile and Aragon, then Spain', [[1400, 6], [1500, 6.8], [1600, 8.2], [1700, 7.5], [1800, 10.5], [1900, 18.6]]],
  ['eu', 'fr', 'France', [[1400, 12], [1500, 15], [1600, 18.5], [1700, 21.5], [1800, 29], [1900, 40]]],
  ['eu', 'uk', 'England, then United Kingdom', [[1400, 3], [1500, 3.5], [1600, 6], [1700, 8.5], [1800, 16], [1850, 27], [1900, 41]]],
  ['eu', 'nl', 'Netherlands', [[1581, 1.5], [1700, 1.9], [1800, 2.1], [1900, 5.1]]],
  ['eu', 'sc', 'Scandinavia', [[1400, 1.5], [1500, 1.8], [1600, 2.4], [1700, 2.9], [1800, 5], [1900, 12]]],
  ['eu', 'hre', 'Holy Roman Empire', [[1400, 12], [1500, 14], [1618, 19], [1650, 13], [1700, 20], [1806, 31]]],
  ['eu', 'de', 'German states, then Germany', [[1806, 13], [1850, 20], [1871, 41], [1900, 56]]],
  ['eu', 'at', 'Austria (Habsburg)', [[1806, 19], [1830, 27], [1850, 31], [1900, 45]]],
  ['eu', 'it', 'Italian states, then Italy', [[1400, 8], [1500, 10], [1600, 13], [1700, 13], [1800, 18], [1861, 26], [1900, 33]]],
  ['eu', 'pl', 'Poland', [[1400, 2], [1500, 3.5], [1600, 5], [1700, 4.5], [1772, 5], [1795, 1]]],
  ['eu', 'ot', 'Ottoman Empire (Balkans)', [[1400, 2], [1453, 3], [1500, 5], [1600, 8], [1700, 8], [1800, 9], [1830, 8], [1878, 5], [1900, 4.5]]],

  ['naf', 'ma', 'Morocco', [[1400, 2], [1600, 2.5], [1800, 2.5], [1900, 4.5]]],
  ['naf', 'mam', 'Mamluk Sultanate (Egypt)', [[1400, 3.5], [1517, 3.5]]],
  ['naf', 'ot', 'Ottoman Empire (Egypt, Tripoli, Tunis, Algiers)', [[1517, 4.5], [1600, 6], [1800, 6.5], [1830, 6], [1881, 8.5], [1882, 1], [1900, 1]]],
  ['naf', 'fr', 'Algeria and Tunisia (France)', [[1830, 0.3], [1850, 2.3], [1880, 3.3], [1882, 4.8], [1900, 6.5]]],
  ['naf', 'uk', 'Egypt (United Kingdom)', [[1882, 7], [1900, 10]]],

  ['ssa', 'ml', 'Mali', [[1400, 5], [1450, 3.5], [1500, 2], [1600, 0.8], [1670, 0.3]]],
  ['ssa', 'so', 'Songhai', [[1464, 1], [1500, 5], [1591, 5]]],
  ['ssa', 'kb', 'Kanem-Bornu', [[1400, 2], [1600, 3], [1800, 2.5], [1893, 2]]],
  ['ssa', 'oy', 'Oyo, Benin and Yoruba cities', [[1400, 2], [1600, 3.5], [1750, 4.5], [1830, 3], [1897, 1.5]]],
  ['ssa', 'sk', 'Sokoto Caliphate', [[1804, 2], [1830, 9], [1900, 10]]],
  ['ssa', 'et', 'Ethiopia', [[1400, 3], [1600, 3], [1800, 3.5], [1880, 4.5], [1900, 8]]],
  ['ssa', 'kg', 'Kingdom of Kongo', [[1400, 1.5], [1600, 1.5], [1665, 1.2], [1700, 0.5], [1860, 0.3]]],
  ['ssa', 'pt', 'Angola and Mozambique (Portugal)', [[1575, 0.1], [1800, 0.4], [1885, 1.5], [1900, 6]]],
  ['ssa', 'uk', 'British colonies', [[1806, 0.1], [1870, 1.5], [1885, 5], [1900, 20]]],
  ['ssa', 'fr', 'French colonies', [[1854, 0.3], [1885, 3], [1900, 18]]],
  ['ssa', 'be', 'Congo Free State (Leopold II)', [[1885, 9], [1900, 8]]],
  ['ssa', 'de', 'German colonies', [[1884, 2], [1900, 9]]],

  ['me', 'ot', 'Ottoman Empire', [[1400, 2.5], [1453, 4], [1500, 6], [1517, 9], [1540, 11.5], [1600, 13], [1700, 13], [1800, 12], [1900, 16]]],
  ['me', 'mam', 'Mamluk Sultanate (Syria)', [[1400, 2], [1516, 2]]],
  ['me', 'aq', 'Ak Koyunlu (Turkomans)', [[1400, 1], [1467, 3.5], [1501, 3]]],
  ['me', 'tim', 'Timurid Empire', [[1400, 6], [1405, 6], [1450, 3.5], [1500, 2], [1507, 1.5]]],
  ['me', 'pe', 'Persia (Safavids, then Qajars)', [[1501, 3], [1510, 5], [1600, 5.5], [1700, 6], [1750, 4.5], [1800, 6], [1900, 9.5]]],
  ['me', 'af', 'Afghanistan', [[1747, 2.5], [1900, 4.5]]],

  ['ru', 'pl', 'Lithuania, then Poland-Lithuania', [[1400, 3], [1500, 3.5], [1600, 5.5], [1700, 5.5], [1772, 6], [1795, 1]]],
  ['ru', 'ru', 'Muscovy, then Russian Empire', [[1400, 2.5], [1500, 6], [1600, 11], [1700, 16], [1750, 23], [1800, 38], [1850, 66], [1900, 118]]],
  ['ru', 'gh', 'Golden Horde and Tatar khanates', [[1400, 4], [1450, 3], [1502, 2], [1552, 1], [1600, 0.6], [1783, 0.4]]],
  ['ru', 'tim', 'Timurid Empire', [[1400, 2.5], [1500, 2], [1507, 1.8]]],
  ['ru', 'cak', 'Khanates of Bukhara, Khiva and Kokand', [[1507, 1.8], [1700, 2.5], [1850, 4.5], [1873, 3], [1900, 3]]],

  ['in', 'dl', 'Delhi Sultanate', [[1400, 14], [1500, 13], [1526, 12]]],
  ['in', 'mg', 'Mughal Empire', [[1526, 12], [1556, 20], [1600, 100], [1700, 150], [1720, 110], [1760, 25], [1803, 3], [1857, 1]]],
  ['in', 'mr', 'Maratha Confederacy', [[1674, 3], [1720, 20], [1760, 55], [1800, 40], [1818, 5]]],
  ['in', 'uk', 'British India (Company, then Raj)', [[1757, 15], [1800, 55], [1820, 110], [1857, 180], [1900, 232]]],
  ['in', 'bg', 'Bengal Sultanate', [[1400, 9], [1500, 13], [1576, 14]]],
  ['in', 'dc', 'Bahmani and Deccan sultanates', [[1400, 9], [1500, 11], [1600, 14], [1687, 10]]],
  ['in', 'vj', 'Vijayanagara', [[1400, 10], [1500, 16], [1565, 16], [1600, 5], [1646, 1]]],

  ['sea', 'kr', 'Korea (Joseon)', [[1400, 5], [1500, 7], [1600, 9], [1700, 12], [1800, 13.5], [1900, 16]]],
  ['sea', 'vn', 'Đại Việt, then Vietnam', [[1400, 2], [1500, 2.6], [1700, 4.5], [1800, 6.5], [1860, 9], [1885, 10]]],
  ['sea', 'fr', 'French Indochina', [[1862, 1], [1885, 11], [1900, 16]]],
  ['sea', 'sm', 'Ayutthaya, then Siam', [[1400, 1.5], [1600, 2.2], [1767, 2], [1800, 3], [1900, 6.5]]],
  ['sea', 'bm', 'Burmese kingdoms', [[1400, 2], [1600, 3], [1800, 4.5], [1826, 4], [1885, 3.5]]],
  ['sea', 'uk', 'Burma and Malaya (United Kingdom)', [[1826, 0.8], [1852, 2], [1886, 8], [1900, 12.5]]],
  ['sea', 'mj', 'Majapahit', [[1400, 3.5], [1478, 1.5], [1527, 0.5]]],
  ['sea', 'nl', 'Dutch East Indies', [[1619, 0.2], [1700, 1.5], [1800, 4], [1830, 8], [1900, 38]]],
  ['sea', 'es', 'Philippines (Spain)', [[1565, 0.4], [1700, 1], [1800, 1.8], [1898, 7]]],
  ['sea', 'us', 'Philippines (USA)', [[1898, 7], [1900, 7.2]]],

  ['cn', 'ming', 'Ming', [[1400, 65], [1500, 80], [1600, 104], [1644, 95]]],
  ['cn', 'qing', 'Qing', [[1644, 92], [1700, 143], [1750, 212], [1800, 322], [1850, 425], [1900, 405]]],
  ['cn', 'tp', 'Taiping', [[1851, 2], [1853, 20], [1860, 30], [1864, 5]]],

  ['jp', 'jp', 'Ashikaga shogunate', [[1400, 9], [1500, 10], [1573, 11]]],
  ['jp', 'jp', 'Nobunaga and Hideyoshi', [[1573, 11], [1603, 12]]],
  ['jp', 'jp', 'Tokugawa shogunate', [[1603, 12], [1700, 25], [1800, 26], [1868, 33]]],
  ['jp', 'jp', 'Meiji Japan', [[1868, 33], [1900, 44]]],

  ['oc', 'ocp', 'Aboriginal, Papuan, Māori and Polynesian peoples', [[1400, 2], [1500, 3], [1788, 3], [1850, 1.8], [1900, 1.5]]],
  ['oc', 'uk', 'Australia and New Zealand (United Kingdom)', [[1788, 0.01], [1850, 0.6], [1900, 4.5]]]
].map(([r, p, n, k], i) => ({ i, r, p, n, k, from: k[0][0], to: k[k.length - 1][0] }));

/* what is left of each region after the listed states */
export const FILLER = {
  la: 'Tupi, Guarani, Maya, Mapuche and many other peoples', eu: 'other states', naf: 'Hafsids, Zayyanids and others', ssa: 'hundreds of other peoples and kingdoms',
  me: 'Arabia, Yemen, Oman and others', ru: 'peoples of the steppe and Siberia', in: 'other kingdoms and principalities', sea: 'other kingdoms and peoples', cn: 'Tibet, Mongols and others'
};

/* basemap name -> power. A function receives the map's year. */
const N = {};
const put = (p, ...names) => names.forEach(n => { N[n] = p; });
put('pt', 'Portugal', 'Viceroyalty of Brazil', 'Portuguese Brazil', 'Portuguese East Africa', 'Angola (Portugal)', 'Mozambique');
put('br', 'Kingdom of Brazil', 'Empire of Brazil', 'Brazil');
put('es', 'Spain', 'Castille', 'Castile', 'Aragón', 'Viceroyalty of New Spain', 'Viceroyalty of Peru', 'Viceroyalty of New Granada', 'Viceroyalty of the Río de la Plata', 'Cuba (Spain)', 'Hispaniola (Spain)', 'Florida (Spain)', 'Santo Domingo (Spain)');
put('hisp', 'United Provinces of the Río de la Plata', 'Argentina', 'Bolivia', 'Colombia', 'Venezuela', 'Peru', 'Chile', 'Ecuador', 'Uruguay', 'Nicaragua', 'Guatemala', 'Honduras', 'El Salvador', 'Costa Rica', 'Gran Colombia');
put('mx', 'Mexico');
put('uk', 'England', 'England and Ireland', 'English territory', 'United Kingdom', 'United Kingdom of Great Britain and Ireland', 'Great Britain', "Rupert's Land", 'British Raj', 'British East India Company', 'Canada', 'British American colonies', 'British Guiana', 'Kingdom of Ireland', 'Quebec');
put('fr', 'France', 'Luisiana', 'New France', 'French Indochina', 'Algeria (FR)', 'Algeria', 'French Guiana', 'Tunisia');
put('nl', 'Netherlands', 'Dutch Republic', 'Dutch East Indies', 'Netherlands Indies', 'Dutch Brazil', 'Dutch Guiana', 'Ceylon (Dutch)');
put('ot', 'Ottoman Empire', 'Algiers', 'Tunis', 'Tripolitania');
put('ru', 'Grand Duchy of Moscow', 'Tsardom of Muscovy', 'Russian Empire');
put('ming', 'Ming Chinese Empire', 'Ming Empire'); put('qing', 'Qing Empire', 'Manchu Empire');
put('jp', 'Japan', 'Tokugawa shogunate', 'Imperial Japan', 'Shogun Japan (Kamakura)', 'Japan (Warring States)');
put('mg', 'Mughal Empire'); put('dl', 'Sultanate of Delhi'); put('vj', 'Vijayanagara'); put('mr', 'Maratha Confederacy', 'Mahratta states', 'Maratha');
put('tim', 'Timurid Empire', 'Timurid Emirates'); put('aq', 'Emirate of the White Sheep Turks'); put('pe', 'Safavid Empire', 'Persia'); put('mam', 'Mamluke Sultanate'); put('af', 'Afghanistan');
put('hre', 'Holy Roman Empire'); put('at', 'Austrian Empire', 'Austria Hungary'); put('de', 'Prussia', 'Germany');
put('it', 'Venice', 'Papal States', 'Kingdom of the Two Sicilies', 'Italy', 'Kingdom of Sardinia', 'Sardinia-Piedmont', 'Florence', 'Tuscany', 'Savoy', 'Genoa');
put('pl', 'Poland-Lithuania', 'Polish–Lithuanian Commonwealth', 'Poland'); put('sc', 'Kalmar Union', 'Denmark-Norway', 'Sweden', 'Denmark', 'Sweden–Norway', 'Norway');
put('us', 'United States of America', 'United States');
put('inca', 'Inca Empire'); put('az', 'Aztec Empire', 'Aztecs', 'Mexica');
put('ml', 'Mali'); put('so', 'Songhai'); put('et', 'Ethiopia'); put('kg', 'Kongo'); put('oy', 'Oyo', 'Benin'); put('sk', 'Sokoto Caliphate', 'Fulani Empire'); put('kb', 'Kanem-Bornu'); put('be', 'Congo Free State');
put('kr', 'Korea'); put('vn', 'Annam', 'Đại Việt', 'Cochin China'); put('sm', 'Ayutthaya', 'Rattanakosin Kingdom', 'Siam'); put('bm', 'Burmese kingdoms', 'Burma', 'Ava', 'Pagan', 'Pegu'); put('mj', 'Majapahit');
put('ma', 'Morocco', 'Watassid Morocco');
put('gh', 'Golden Horde', 'White Horde', 'Blue Horde', 'Kazan Khanate', 'Crimean Khanate', 'Nogai Horde', 'Astrakhan Khanate', 'Khanate of Sibir');
put('cak', 'central Asian khanates', 'Khiva Khanate', 'Bukara Khanate', 'Bokhara Khanate', 'Quazaq Khanate', 'Turan', 'Chagatai Khanate');
const SUBJ = {
  'Portugal': 'pt', 'Spain': 'es', 'Spanish Habsburg': 'es', 'United Kingdom': 'uk', 'UK': 'uk', 'United Kingdom of Great Britain and Ireland': 'uk', 'Great Britain': 'uk',
  'England': 'uk', 'British East India Company': 'uk', 'France': 'fr', 'Netherlands': 'nl', 'Neterlands': 'nl', 'United Kingdom of Netherlands': 'nl',
  'Ottoman Empire': 'ot', 'Austrian Empire': 'at', 'Austria': 'at', 'Habsburg Austria': 'at', 'Prussia': 'de', 'Denmark': 'sc', 'Danemark': 'sc', 'Denmark-Norway': 'sc', 'Manchu Empire': 'qing'
};
/* fixes for known errors in the basemap */
const FIX = {
  'Great Khanate': y => y <= 1400 ? 'ming' : null,               // in 1400 China was already Ming (since 1368)
  'Egypt': y => y >= 1900 ? 'uk' : 'ot',
  'Cape Colony': y => y >= 1815 ? 'uk' : 'nl',
  'Paraguay': y => y >= 1815 ? 'hisp' : 'es',
  'Bengal': y => y <= 1530 ? 'bg' : y >= 1783 ? 'uk' : null,
  'Congo': y => y <= 1800 ? 'kg' : null,
  'Kingdom of Sardinia': () => 'it', 'Quebec': () => 'uk', 'Kingdom of Brazil': () => 'br', 'United Provinces of the Río de la Plata': () => 'hisp'
};
export function powerOf(name, subj, year) {
  if (FIX[name]) return FIX[name](year);
  return N[name] || (subj && SUBJ[subj]) || null;
}

/* display names for the map labels (missing ones stay as they are in the basemap) */
export const NAME_EN = {
  'Russian Empire': 'Russian Empire', 'Tsardom of Muscovy': 'Muscovy', 'Grand Duchy of Moscow': 'Grand Duchy of Moscow', 'Qing Empire': 'Qing Empire', 'Manchu Empire': 'Qing Empire',
  'Great Khanate': 'China (Ming)', 'Ming Chinese Empire': 'Ming Empire', 'Ming Empire': 'Ming Empire', 'Canada': 'Canada', 'United States of America': 'United States', 'United States': 'United States',
  'central Asian khanates': 'Central Asian khanates', 'Siberians': 'Siberian peoples', 'Bantu peoples': 'Bantu peoples', 'Chagatai Khanate': 'Chagatai Khanate',
  'Viceroyalty of Brazil': 'Brazil (Portugal)', 'Portuguese Brazil': 'Brazil (Portugal)', 'Kingdom of Brazil': 'Brazil', 'Australian aboriginal hunter-gatherers': 'Aboriginal peoples',
  "Rupert's Land": "Rupert's Land", 'Amazon hunter-gatherers': 'Amazonian peoples', 'Ottoman Empire': 'Ottoman Empire', 'Timurid Empire': 'Timurid Empire', 'Timurid Emirates': 'Timurid emirates',
  'British Raj': 'British India', 'British East India Company': 'East India Company', 'Viceroyalty of Peru': 'Viceroyalty of Peru', 'Viceroyalty of New Spain': 'New Spain',
  'Viceroyalty of New Granada': 'New Granada', 'Viceroyalty of the Río de la Plata': 'Río de la Plata', 'United Provinces of the Río de la Plata': 'United Provinces of the Río de la Plata',
  'West African cereal farmers': 'West African farmers', 'White Horde': 'White Horde', 'Blue Horde': 'Blue Horde', 'Golden Horde': 'Golden Horde', 'Mughal Empire': 'Mughal Empire',
  'New South Wales': 'New South Wales', 'New South Wales (UK)': 'New South Wales', 'Eastern North American hunter-gatherers': 'Eastern North American peoples', 'Luisiana': 'Louisiana',
  'Kalmar Union': 'Kalmar Union', 'Sultanate of Delhi': 'Delhi Sultanate', 'Plain bison hunters': 'Plains bison hunters', 'Savanna hunter-gatherers': 'Savanna peoples',
  'Denmark-Norway': 'Denmark-Norway', 'Argentina': 'Argentina', 'Western Australia (UK)': 'Western Australia', 'Subarctic forest hunter-gatherers': 'Subarctic forest peoples',
  'Denmark': 'Denmark', 'Safavid Empire': 'Safavid Empire', 'Khoisan': 'Khoisan', 'Maratha Confederacy': 'Maratha Confederacy', 'Mahratta states': 'Maratha states', 'Greenland': 'Greenland',
  'Arabia': 'Arabia', 'Arabs': 'Arabs', 'Quazaq Khanate': 'Kazakh Khanate', 'Turan': 'Turan', 'Tibet': 'Tibet', 'Persia': 'Persia', 'Egypt': 'Egypt', 'Islamic and Hindu states': 'Islamic and Hindu states',
  'Mexico': 'Mexico', 'Nogai Horde': 'Nogai Horde', 'Emirate of the White Sheep Turks': 'Ak Koyunlu', 'Pampas cultures': 'Pampas peoples', 'Malaysian Islamic states': 'Malay sultanates',
  'Queensland (UK)': 'Queensland', 'Dutch East Indies': 'Dutch East Indies', 'Netherlands Indies': 'Dutch East Indies', 'Athabaskan': 'Athabaskans', 'Athabascan': 'Athabaskans',
  'Mamluke Sultanate': 'Mamluk Sultanate', 'Colombia': 'Colombia', 'Bolivia': 'Bolivia', 'Afghanistan': 'Afghanistan', 'Morocco': 'Morocco', 'Watassid Morocco': 'Morocco',
  'Northern Territory (UK)': 'Northern Territory', 'Inca Empire': 'Inca Empire', 'Poland-Lithuania': 'Poland-Lithuania', 'Polish–Lithuanian Commonwealth': 'Poland-Lithuania', 'Poland': 'Poland',
  'South Australia (UK)': 'South Australia', 'Sokoto Caliphate': 'Sokoto Caliphate', 'Fulani Empire': 'Sokoto Caliphate', 'Sweden': 'Sweden', 'Sweden–Norway': 'Sweden-Norway',
  'Khiva Khanate': 'Khanate of Khiva', 'Holy Roman Empire': 'Holy Roman Empire', 'Post-Ming Warlords': 'Post-Ming warlords', 'Ayutthaya': 'Ayutthaya', 'Rattanakosin Kingdom': 'Siam',
  'Oirat Confederation': 'Oirat Confederation', 'Papuans': 'Papuans', 'French Indochina': 'French Indochina', 'Songhai': 'Songhai', 'Burmese kingdoms': 'Burmese kingdoms', 'Burma': 'Burma',
  'Hafsid Caliphate': 'Hafsids', 'Khanate of Sibir': 'Khanate of Sibir', 'Nejd': 'Nejd', 'Srivijaya Empire': 'Sumatran kingdoms', 'Spain': 'Spain', 'Castille': 'Castile', 'Castile': 'Castile',
  'Aragón': 'Aragon', 'Austrian Empire': 'Austria', 'Austria Hungary': 'Austria-Hungary', 'Bukara Khanate': 'Khanate of Bukhara', 'Bokhara Khanate': 'Khanate of Bukhara', 'Cape Colony': 'Cape Colony',
  'France': 'France', 'Sikhs': 'Sikhs', 'Kazan Khanate': 'Khanate of Kazan', 'Germany': 'Germany', 'Ethiopia': 'Ethiopia', 'Mwenemutapa': 'Mutapa', 'Ecuador': 'Ecuador', 'Bengal': 'Bengal',
  'Algiers': 'Algiers', 'Algeria (FR)': 'Algeria (France)', 'Algeria': 'Algeria (France)', 'Tunisia': 'Tunisia (France)', 'Kingdom of Hungary': 'Hungary', 'Imperial Hungary': 'Hungary',
  'Aymara kingdoms': 'Aymara kingdoms', 'Imperial Japan': 'Japan', 'Tokugawa shogunate': 'Japan (Tokugawa)', 'Japan': 'Japan', 'Shogun Japan (Kamakura)': 'Japan', 'Japan (Warring States)': 'Japan (Warring States)',
  'Hausa States': 'Hausa city-states', 'Paraguay': 'Paraguay', 'Dutch Brazil': 'Dutch Brazil', 'Crimean Khanate': 'Crimean Khanate', 'Somalia': 'Somalia', 'Portuguese East Africa': 'Mozambique (Portugal)',
  'Mozambique': 'Mozambique (Portugal)', 'Angola (Portugal)': 'Angola (Portugal)', 'United Kingdom of Great Britain and Ireland': 'United Kingdom', 'United Kingdom': 'United Kingdom', 'England': 'England',
  'England and Ireland': 'England', 'English territory': 'England', 'Scotland': 'Scotland', 'Italy': 'Italy', 'Sultanate of Zanzibar': 'Zanzibar', 'Annam': 'Vietnam', 'Đại Việt': 'Đại Việt',
  'Prussia': 'Prussia', 'Khmer Empire': 'Khmer Empire', 'Astrakhan Khanate': 'Astrakhan Khanate', 'Korea': 'Korea', 'Great Zimbabwe': 'Great Zimbabwe', 'British Guiana': 'British Guiana',
  'British American colonies': 'English colonies', 'Romania': 'Romania', 'Malacca': 'Malacca', 'Cambodia': 'Cambodia', 'Asante': 'Asante', 'Bulgaria': 'Bulgaria', 'Uruguay': 'Uruguay',
  'Dutch Guiana': 'Dutch Guiana', 'Byzantine Empire': 'Byzantium', 'Greece': 'Greece', 'Oman': 'Oman', 'Kingdom of the Two Sicilies': 'Two Sicilies', 'Dahomey': 'Dahomey', 'Kingdom of Ireland': 'Ireland',
  'French Guiana': 'French Guiana', 'Congo': 'Congo', 'Sicily': 'Sicily', 'Naples': 'Naples', 'Tripolitania': 'Tripoli', 'Venice': 'Venice', 'New France': 'New France', 'Serbia': 'Serbia',
  'Georgia': 'Georgia', 'Kingdom of Sardinia': 'Sardinia-Piedmont', 'Papal States': 'Papal States', 'Switzerland': 'Switzerland', 'Swiss Confederation': 'Swiss Confederation', 'Florence': 'Florence',
  'Dutch Republic': 'United Provinces', 'Netherlands': 'Netherlands', 'Belgium': 'Belgium', 'Milan': 'Milan', 'Tuscany': 'Tuscany', 'Sardinia': 'Sardinia', 'Britany': 'Brittany', 'Quebec': 'Quebec',
  'Andean hunter-gatherers': 'Andean peoples', 'Desert hunter-gatherers': 'Desert peoples', 'Andean states and chiefdoms': 'Andean states and chiefdoms', 'Māori': 'Māori', 'Maori': 'Māori',
  'North American Pacific foraging, hunting and fishing peoples': 'Pacific fishing peoples', 'Plateau fichers and hunter gatherers': 'Plateau peoples', 'Papua New Guinea': 'Papuans',
  'minor Hindu and Buddhist kingdoms': 'Hindu and Buddhist kingdoms', 'Islamic city-states': 'Swahili city-states', 'Philippines': 'Philippines', 'Hindu kingdoms': 'Hindu kingdoms',
  'Patagonian shellfish and marine mammal hunters': 'Patagonian peoples', 'Malaya': 'Malaya', 'Tuʻi Tonga Empire': 'Tuʻi Tonga Empire', 'Novgorod': 'Novgorod', 'Rajputs': 'Rajputs',
  'Mali': 'Mali', 'Madagascar': 'Madagascar', 'Kanem-Bornu': 'Kanem-Bornu', 'Vijayanagara': 'Vijayanagara', 'Inuit': 'Inuit', 'Thule': 'Thule', 'Sámi': 'Sámi', 'Taiwan': 'Taiwan'
};
