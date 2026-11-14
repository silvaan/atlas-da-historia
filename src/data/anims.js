// Which animation each event gets on the map. The types are in src/world/fx.js.
// Clothing and flag colours are simplified: they serve to tell the groups apart, not to reconstruct uniforms.
const PT = ['#3B3F55', '#6B2A2A', '#4A4036'];
const NATIVE = ['#A9523A', '#2E2A26', '#8E4A30'];
const AFRICA = ['#E9E2D0', '#C9A15A', '#9C4A3A'];
const NL = ['#E07B24', '#3B3F55', '#E9E2D0'];
const ES = ['#C2413A', '#D9B23A', '#3A2E2A'];
const FR = ['#2F4F8A', '#E9E2D0', '#2F4F8A'];
const CROWD = ['#3E6A8C', '#9C4A3A', '#7A6A3A', '#E9E2D0', '#5B7B4A', '#C9A15A'];
const F = {
  pt: ['#F4F1EA', '#2F5F8A'], christ: ['#F4F1EA', '#B3261E'], castile: ['#C2413A', '#D9B23A'], nl: ['#E07B24', '#F4F1EA', '#2F5F8A'],
  fr: ['#2F4F8A', '#F4F1EA', '#C2413A'], haiti: ['#2F4F8A', '#C2413A'], usa: ['#B3261E', '#F4F1EA', '#2F4F8A'], kongo: ['#C2413A', '#2E2A26'],
  br: ['#2F8A3A', '#E0B52E', '#2F8A3A'], pe: ['#2F5F8A', '#F4F1EA'], ba: ['#2F5F8A', '#F4F1EA', '#C2413A'], mg: ['#F4F1EA', '#C2413A'],
  plata: ['#75AADB', '#F4F1EA', '#75AADB'], gb: ['#2F3F7A', '#F4F1EA', '#B3261E'], blue: ['#2F5F8A'], white: ['#F4F1EA'],
  bo: ['#C2413A', '#E0B52E', '#2F8A3A'], it: ['#2F8A3A', '#F4F1EA', '#C2413A'], jp: ['#F4F1EA', '#B3261E', '#F4F1EA'], cuba: ['#2F4F8A', '#F4F1EA', '#C2413A'],
  ecuador: ['#2F5F8A', '#E0B52E'], red: ['#C2413A'], yellow: ['#E0B52E']
};
// after 1822
const IMPERIAL = ['#2F3A6E', '#3B3F55', '#2F3A6E'];
const PLATA = ['#75AADB', '#2F3F7A', '#E9E2D0'];
const PARAGUAY = ['#C2413A', '#E9E2D0', '#3A2E2A'];
const FARRAPOS = ['#C2413A', '#7A6A3A', '#3A2E2A'];
const BACKLANDERS = ['#A88A5A', '#7A6A3A', '#E9E2D0', '#5B4A3A'];
const ARMY = ['#5B6B3A', '#4A5530', '#6B7A4A'];
const GERMANS = ['#5E6468', '#4A4F52', '#6E7275'];
const UNION = ['#2F3F7A', '#3B4A7A'], CONFEDERATES = ['#8A8A82', '#6E6A62'];
const JAPANESE = ['#2E2A26', '#E9E2D0', '#3B3F55', '#6B5A4A'];
const TOWNSFOLK = ['#2E2A26', '#3B3F55', '#4A4A52', '#6B5A4A', '#E9E2D0'];
const CANDANGOS = ['#7A6A3A', '#E9E2D0', '#3E6A8C', '#9C4A3A'];

// world outside Brazil (world.js)
const ANCIENTS = ['#C9A15A', '#E9E2D0', '#8E6A3A', '#7A5A3A', '#A88A5A'];
const EGYPTIANS = ['#F4F1EA', '#E9E2D0', '#C9A15A', '#3E6A8C'];
const INDUS = ['#E9E2D0', '#C9A15A', '#9C4A3A', '#B05A7A'];
const ANDEANS = ['#C2413A', '#7A5A3A', '#E9E2D0', '#3E6A8C', '#C9A15A'];
const MINOANS = ['#3F8FB5', '#C2413A', '#E9E2D0', '#D9B23A'];
const GREEKS = ['#F4F1EA', '#E9E2D0', '#3F6FB5', '#C9A15A'];
const MACEDONIANS = ['#B3261E', '#C9A15A', '#6B2A2A'], PERSIANS = ['#7A5BA6', '#D9B23A', '#2F5F8A', '#E9E2D0'];
const HAN = ['#C2413A', '#2E2A26', '#3B3F55', '#C9A15A'];
const MESOAM = ['#E9E2D0', '#2F8A6A', '#C2413A', '#D9B23A', '#3E6A8C'];
const ROMANS = ['#E9E2D0', '#B3261E', '#C9A15A'], GERMANIC = ['#6B5A3A', '#5E6468', '#7A6A3A'];
const ABBASIDS = ['#2E2A26', '#E9E2D0', '#2F5F3A', '#C9A15A'];
const NORSE = ['#5A7A9A', '#7A6A3A', '#C2413A', '#E9E2D0'];
const MONGOLS = ['#3E6A8C', '#6A5A4A', '#C2413A', '#E9E2D0'];
const MALI = ['#E0B52E', '#E9E2D0', '#2F5F8A', '#9C4A3A'];
const EUROPEANS = ['#3B3F55', '#6B2A2A', '#4A4036', '#E9E2D0', '#2F5F3A'];
const SWAHILI = ['#E9E2D0', '#C9A15A', '#3E6A8C'], MING = ['#C2413A', '#2F5F8A', '#D9B23A'];
const OTTOMANS = ['#C2413A', '#2F5F3A', '#E9E2D0'], BYZANTINES = ['#7A3A8A', '#D9B23A', '#3B3F55'];
const ASIA = ['#3E6A8C', '#E9E2D0', '#C2413A', '#2E2A26', '#C9A15A'];
const BRITISH = ['#B3261E', '#C2413A', '#E9E2D0'];
const QING = ['#2F5F8A', '#D9B23A', '#3B3F55'], TAIPING = ['#C2413A', '#E0B52E', '#E9E2D0'];
const INDIANS = ['#F4F1EA', '#E9E2D0', '#E0902E', '#C9A15A'];
const AFRICA20 = ['#2F8A3A', '#E0B52E', '#C2413A', '#E9E2D0', '#3E6A8C', '#2E2A26'];
const ITALIANS = ['#5B6B3A', '#3B3F55', '#E9E2D0'];
const PEASANTS = ['#E9E2D0', '#C9A15A', '#7A6A3A', '#9C4A3A'];
const ALLIES = ['#5B6B3A', '#3E4A5A', '#6B7A4A'], POLES = ['#6B7A4A', '#7A7A62'];
const DIPLOMATS = ['#2E2A26', '#3B3F55', '#4A4A52'];
const FM = {
  egypt: ['#E2C04A', '#2F5F8A'], rome: ['#8E2A2A', '#D9B23A'], han: ['#C2413A'], abbasid: ['#2E2A26'], mongol: ['#E9E2D0'], mali: ['#E0B52E', '#2E2A26'],
  mexica: ['#2F5F3A', '#E9E2D0'], orange: ['#E07B24'], wendat: ['#E9E2D0', '#7A2A5A'], guadalupe: ['#3E6A8C', '#E9E2D0'], mx: ['#2F8A3A', '#F4F1EA', '#C2413A'],
  colombia: ['#E0B52E', '#2F4F8A', '#C2413A'], de1884: ['#2E2A26', '#F4F1EA', '#C2413A'], congo1885: ['#2F5F8A', '#E0B52E'], india: ['#E0902E', '#F4F1EA', '#2F8A3A'],
  un: ['#75AADB', '#F4F1EA'], congo1960: ['#2F5F8A', '#E0B52E', '#2F5F8A'], chile: ['#2F4F8A', '#F4F1EA', '#C2413A'], frg: ['#2E2A26', '#C2413A', '#E0B52E'],
  za: ['#C2413A', '#2F8A3A', '#2F4F8A'], ezln: ['#2E2A26', '#C2413A'], ussr: ['#C2413A']
};

export const ANIMS = {
  /* before 1450 */
  luzia: { type: 'ceremony', hut: true, houses: 4, leads: ['#8E4A30'], colors: NATIVE, people: 14 },                 // a burial
  pedrapintada: { type: 'ceremony', hut: true, houses: 3, leads: ['#A9523A'], colors: NATIVE, people: 10 },
  sambaquis: { type: 'ceremony', hut: true, houses: 6, leads: ['#2E2A26', '#8E4A30'], colors: NATIVE, people: 24 },  // the platform stands in for the mound
  terrapreta: { type: 'circle', village: 'tupi' },
  tupiguarani: { type: 'circle', village: 'tupi' },
  geoglyphs: { type: 'circle', village: 'xingu' },                                                                          // the circular fence recalls the ditch
  marajoara: { type: 'ceremony', hut: true, houses: 12, leads: ['#C2413A', '#2E2A26'], colors: NATIVE, people: 30 },
  tapajo: { type: 'circle', village: 'tupi' },
  xingu: { type: 'circle', village: 'xingu' },
  tupi: { type: 'circle', village: 'tupi' },
  tordesillas: { type: 'treaty', colors: [F.pt, F.castile], a: PT, b: ES, roof: '#B9573C' },
  gama: { type: 'fleet', n: 3, from: [68, 9], crowd: 18, crowdColors: ['#E9E2D0', '#C9A15A', '#7A2A5A'], land: 6, roof: '#9A7A52', salute: true },
  cabral: { type: 'fleet', n: 9, from: [-35.5, -17.2], crowd: 24, land: 8, cross: true, town: false },
  brazilwood: { type: 'loading', cargo: 'logs', colors: NATIVE },
  kongo: { type: 'ceremony', leads: ['#C2413A'], colors: ['#C2413A', '#2E2A26', '#C9A15A', '#E9E2D0'], flag: F.kongo, scroll: true, roof: '#C7A36A' },
  captaincies: { type: 'founding', houses: 10, ships: 2, natives: 6 },
  salvador: { type: 'founding', houses: 16, ships: 3, wall: true, church: true, natives: 8 },
  tamoios: { type: 'battle', a: PT, b: NATIVE, guns: true, na: 12, nb: 22 },
  franceantarctique: { type: 'battle', a: PT, b: FR, ships: 3, fire: true },
  epidemics: { type: 'epidemic' },
  sugar: { type: 'sugarmill', colors: AFRICA },
  luanda: { type: 'founding', houses: 12, ships: 2, wall: true, church: true, natives: 6, roof: '#B9573C' },
  slavetrade: { type: 'crossing', n: 18, color: '#E9C9B8', paths: [[[13.1, -8.8], [0, -11], [-20, -13], [-38.3, -13]], [[13.1, -8.8], [0, -8], [-20, -8], [-34.7, -8.0]], [[13.1, -8.8], [0, -15], [-25, -22], [-43.1, -23.0]]] },
  alcacer: { type: 'battle', a: PT, b: ['#E9E2D0', '#2F5F3A', '#8E3B2E'], na: 16, nb: 28, guns: true },
  iberianunion: { type: 'ceremony', leads: ['#2E2A26'], flag: F.castile, scroll: true },
  palmares: { type: 'flight', from: [-35.25, -8.75], colors: AFRICA },
  missions: { type: 'founding', houses: 14, church: true, colors: NATIVE, people: 22, flag: F.white, roof: '#9A6A44' },
  bandeiras: { type: 'battle', a: ['#6B5A3A', '#4A4036', '#8E6538'], b: NATIVE, fire: true, roof: '#9A6A44' },
  dutch: { type: 'fleet', n: 9, crowd: 0, land: 14, landColors: NL, pennant: '#E07B24', flag: F.nl, salute: true },
  restoration: { type: 'revolt', flag: F.pt, colors: PT },
  luanda1641: { type: 'fleet', n: 6, from: [5, -10], crowd: 10, crowdColors: NL, land: 12, salute: true, flag: F.pt },
  caribbean: { type: 'sugarmill', colors: AFRICA },
  gold: { type: 'gold' },
  methuen: { type: 'treaty', colors: [F.pt, F.gb], b: ['#B3261E', '#3A2E2A', '#E9E2D0'] },
  industrialrev: { type: 'industry' },
  madrid: { type: 'treaty', colors: [F.pt, F.castile], b: ES },
  guaraniwar: { type: 'battle', a: [...PT, ...ES], b: NATIVE, na: 22, nb: 16, fire: true, roof: '#9A6A44' },
  pombal: { type: 'earthquake' },
  riocapital: { type: 'ceremony', leads: ['#2E2A26', '#6B2A2A'], flag: F.pt },
  usa: { type: 'revolt', flag: F.usa, colors: CROWD },
  minasconspiracy: { type: 'revolt', flag: F.mg, people: 10, troops: 10, troopColors: ['#2F3A6E'] },
  france1789: { type: 'revolt', flag: F.fr, fire: true, people: 34 },
  haiti: { type: 'revolt', flag: F.haiti, fire: true, colors: AFRICA, people: 34 },
  bahia1798: { type: 'revolt', flag: F.ba, people: 14, troops: 10, troopColors: ['#2F3A6E'], colors: AFRICA },
  napoleon: { type: 'battle', a: FR, b: ['#E9E2D0', '#6B7A3A'], na: 24, nb: 24 },
  blockade: { type: 'ceremony', leads: ['#2F4F8A'], colors: FR, flag: F.fr, scroll: true },
  junot: { type: 'fleet', dir: 'depart', n: 12, crowd: 26, troops: 16, troopColors: FR, to: [-14, 36] },
  openports: { type: 'loading', cargo: 'crates', ships: 3, colors: AFRICA, town: true },
  court: { type: 'fleet', n: 8, from: [-41.5, -24.3], crowd: 30, crowdColors: CROWD, land: 12, salute: true, flag: F.pt },
  spain1808: { type: 'battle', a: FR, b: ES, fire: true, na: 18, nb: 22 },
  treaties1810: { type: 'treaty', colors: [F.pt, F.gb], b: ['#B3261E', '#3A2E2A', '#E9E2D0'] },
  buenosaires: { type: 'revolt', flag: F.plata, people: 30 },
  vienna: { type: 'treaty', colors: [F.white, F.blue], a: ['#2E2A26', '#6B2A2A'], b: ['#2F3F7A', '#E9E2D0'] },
  unitedkingdom: { type: 'ceremony', leads: ['#6B2A2A', '#2E2A26'], flag: F.pt, people: 32, colors: CROWD },
  pernambuco1817: { type: 'revolt', flag: F.pe, troops: 12, troopColors: ['#2F3A6E'] },
  porto: { type: 'revolt', flag: F.blue, colors: PT },
  return: { type: 'fleet', n: 8, from: [-14, 36.5], crowd: 26, crowdColors: CROWD, land: 10, salute: true, flag: F.pt },
  independence: { type: 'ceremony', leads: ['#2F5F3A'], flag: F.br, people: 22, colors: ['#2F5F3A', '#6B2A2A', '#3B3F55'], town: false },
  /* after 1822 */
  equatorconfederation: { type: 'revolt', flag: F.ecuador, people: 24, troops: 14, troopColors: IMPERIAL },
  cisplatina: { type: 'battle', a: IMPERIAL, b: PLATA, na: 20, nb: 20, guns: true },
  abdication: { type: 'fleet', dir: 'depart', n: 2, crowd: 20, crowdColors: CROWD, to: [-40, -24.5] },
  males: { type: 'revolt', flag: F.white, colors: ['#E9E2D0', '#F4F1EA', '#C9A15A'], people: 26, troops: 16, troopColors: ['#2F3A6E'] },
  cabanagem: { type: 'revolt', flag: F.red, fire: true, colors: [...NATIVE, '#7A6A3A', '#E9E2D0'], people: 32, troops: 10, troopColors: IMPERIAL, roof: '#9A6A44' },
  farroupilha: { type: 'battle', a: IMPERIAL, b: FARRAPOS, na: 18, nb: 18, guns: true },
  coffee: { type: 'sugarmill', colors: AFRICA, ship: false },
  aberdeen: { type: 'ceremony', leads: ['#2E2A26', '#3B3F55'], colors: ['#2E2A26', '#3B3F55', '#6B2A2A'], flag: F.gb, scroll: true, roof: '#6B4A3A' },
  eusebio: { type: 'ceremony', leads: ['#2E2A26'], flag: F.br, scroll: true, colors: PT },
  landlaw: { type: 'treaty', colors: [F.br, F.white], a: ['#2E2A26', '#3B3F55'], b: ['#7A6A3A', '#5B4A3A', '#E9E2D0'] },
  civilwar: { type: 'battle', a: UNION, b: CONFEDERATES, na: 24, nb: 24, guns: true },
  paraguaywar: { type: 'battle', a: [...IMPERIAL, ...PLATA], b: PARAGUAY, na: 26, nb: 22, guns: true, fire: true },
  meiji: { type: 'ceremony', leads: ['#2E2A26', '#6B2A2A'], flag: F.jp, colors: JAPANESE, people: 24, roof: '#3F4B5C' },
  italy: { type: 'fleet', dir: 'depart', n: 3, crowd: 26, crowdColors: CROWD, to: [8.5, 41.5] },
  freewomb: { type: 'ceremony', leads: ['#2E2A26'], flag: F.br, scroll: true, colors: AFRICA, people: 22 },
  immigration: { type: 'fleet', n: 3, from: [-45.5, -25.0], crowd: 6, crowdColors: PT, land: 22, landColors: CROWD, flag: F.br, houses: 10 },
  rubber: { type: 'founding', houses: 18, church: true, people: 20, colors: ['#E9E2D0', '#C9A15A', '#7A6A3A', '#3B3F55'], flag: F.br, natives: 6 },
  abolition: { type: 'ceremony', leads: ['#7A2A5A', '#2E2A26'], flag: F.br, scroll: true, colors: [...AFRICA, '#3E6A8C'], people: 40 },
  republic: { type: 'revolt', flag: F.br, people: 8, troops: 26, troopColors: IMPERIAL, colors: PT },
  canudos: { type: 'battle', a: ['#2F3A6E', '#B9A27E'], b: BACKLANDERS, na: 26, nb: 22, guns: true, fire: true, roof: '#C7A36A' },
  petropolis: { type: 'treaty', colors: [F.br, F.bo], a: ['#2E2A26', '#3B3F55'], b: ['#2E2A26', '#6B2A2A'] },
  vaccinerevolt: { type: 'revolt', fire: true, flag: F.red, people: 34, troops: 16, troopColors: ['#2F3A6E'], colors: TOWNSFOLK },
  rondon: { type: 'founding', houses: 5, people: 12, colors: ARMY, natives: 12, flag: F.br, roof: '#9A6A44' },
  kasato: { type: 'fleet', n: 1, from: [-45.5, -25.0], crowd: 8, crowdColors: PT, land: 24, landColors: JAPANESE, flag: F.jp, houses: 10 },
  lashrevolt: { type: 'fleet', n: 4, from: [-42.6, -23.5], crowd: 24, crowdColors: TOWNSFOLK, land: 0, salute: true, pennant: '#C2413A', flag: F.red, houses: 12 },
  artweek22: { type: 'ceremony', leads: ['#2E2A26', '#7A2A5A', '#3B3F55'], colors: TOWNSFOLK, people: 30, roof: '#6B4A3A' },
  crash29: { type: 'revolt', flag: F.usa, people: 36, colors: TOWNSFOLK, houses: 18, roof: '#5E5A55' },
  rev1930: { type: 'revolt', flag: F.red, people: 20, troops: 20, troopColors: FARRAPOS, colors: CROWD },
  estadonovo: { type: 'ceremony', leads: ['#2E2A26'], flag: F.br, people: 36, colors: [...ARMY, '#3B3F55', '#E9E2D0'] },
  feb: { type: 'battle', a: ARMY, b: GERMANS, na: 22, nb: 20, guns: true, fire: true },
  petrobras: { type: 'industry' },
  cuba1959: { type: 'revolt', flag: F.cuba, people: 32, colors: ['#5B6B3A', '#E9E2D0', '#3E6A8C', '#9C4A3A'], roof: '#D9C9A0' },
  brasilia: { type: 'founding', houses: 22, people: 26, colors: CANDANGOS, flag: F.br, roof: '#E9E2D0' },
  xingu1961: { type: 'ceremony', hut: true, houses: 12, leads: ['#A9523A', '#2E2A26'], colors: NATIVE, people: 26 },  // the Kuarup
  coup64: { type: 'revolt', flag: F.br, people: 10, troops: 28, troopColors: ARMY },
  transamazon: { type: 'founding', houses: 10, people: 18, colors: CANDANGOS, natives: 10, flag: F.br, roof: '#8E8A82' },
  diretas: { type: 'revolt', flag: F.yellow, people: 44, colors: ['#E0B52E', '#E9E2D0', '#3E6A8C', '#2F8A3A', '#9C4A3A'], houses: 18 },
  constitution: { type: 'ceremony', leads: ['#2E2A26', '#A9523A'], flag: F.br, scroll: true, people: 32, colors: [...CROWD, '#A9523A'] },
  /* world: before 1450 */
  gobeklitepe: { type: 'ceremony', hut: true, houses: 4, leads: ['#8E4A30'], colors: ANCIENTS, people: 24 },               // a feast around the pillars
  fertilewheat: { type: 'circle', village: 'tupi' },                                                                          // round houses and gardens
  catalhoyuk: { type: 'ceremony', hut: true, houses: 16, leads: ['#8E4A30', '#E9E2D0'], colors: ANCIENTS, people: 22 },
  yangtzerice: { type: 'circle', village: 'tupi' },
  balsasmaize: { type: 'circle', village: 'tupi' },
  taliankimega: { type: 'circle', village: 'xingu' },                                                                        // houses in rings
  urukwriting: { type: 'ceremony', leads: ['#2E2A26'], colors: ANCIENTS, scroll: true, people: 26, roof: '#C7A36A' },
  caralnortechico: { type: 'ceremony', leads: ['#C2413A'], colors: ANDEANS, people: 24, houses: 10, roof: '#B9A88A' },
  mohenjodaro: { type: 'ceremony', leads: ['#E9E2D0'], colors: INDUS, people: 26, houses: 16, roof: '#B07A4A' },
  pyramids: { type: 'founding', houses: 14, people: 24, colors: EGYPTIANS, flag: FM.egypt, roof: '#D8BE85' },             // the builders' village
  knossos: { type: 'ceremony', leads: ['#C2413A', '#E9E2D0'], colors: MINOANS, people: 24, roof: '#C77A52' },        // priestesses on the platform
  hammurabi: { type: 'ceremony', leads: ['#2E2A26'], colors: ANCIENTS, scroll: true, people: 24, roof: '#C7A36A' },
  romanrepublic: { type: 'ceremony', leads: ['#F4F1EA', '#F4F1EA'], colors: ROMANS, flag: FM.rome, people: 30, roof: '#B9573C' },  // the two consuls
  athens: { type: 'ceremony', leads: ['#F4F1EA'], colors: GREEKS, people: 36, roof: '#C77A52' },                      // the assembly
  alexander: { type: 'battle', a: MACEDONIANS, b: PERSIANS, na: 24, nb: 30, guns: false },
  hansilkroad: { type: 'founding', houses: 8, wall: true, people: 14, colors: HAN, flag: FM.han, roof: '#5E5A55' },        // a frontier post
  teotihuacan: { type: 'ceremony', houses: 22, leads: ['#2F8A6A'], colors: MESOAM, people: 30, roof: '#B9A88A' },
  maya: { type: 'ceremony', houses: 10, leads: ['#2F8A6A'], colors: MESOAM, people: 26, roof: '#CFC5AE' },
  fallofrome: { type: 'revolt', flag: ['#6B5A3A'], colors: ROMANS, people: 14, troops: 18, troopColors: GERMANIC, roof: '#B9573C' },
  tangchangan: { type: 'ceremony', houses: 18, leads: ['#C2413A'], colors: ASIA, people: 32, roof: '#3A4A3A' },
  baghdad: { type: 'ceremony', houses: 16, leads: ['#2E2A26', '#2F5F3A'], colors: ABBASIDS, flag: FM.abbasid, scroll: true, people: 26, roof: '#D9C9A0' },
  althing: { type: 'ceremony', hut: true, houses: 6, leads: ['#5A7A9A'], colors: NORSE, people: 30 },               // the Althing
  polynesia: { type: 'crossing', n: 9, color: '#E9E2D0', pennant: '#C9A15A', paths: [
    [[-149.6, -17.3], [-151, -5], [-154, 10], [-155.6, 18.8]], [[-149.2, -17.9], [-130, -25], [-109.6, -27.3]],
    [[-149.2, -17.2], [-140.6, -9.2]], [[-171.5, -14.2], [-160, -16], [-149.8, -17.4]]] },
  cahokia: { type: 'ceremony', hut: true, houses: 14, leads: ['#8E4A30'], colors: NATIVE, people: 30 },
  zimbabwe: { type: 'ceremony', hut: true, houses: 12, leads: ['#C9A15A'], colors: AFRICA, people: 24 },
  mongols: { type: 'ceremony', hut: true, houses: 16, leads: ['#6A5A4A'], colors: MONGOLS, flag: FM.mongol, people: 30 },   // the kurultai of 1206
  mansamusa: { type: 'ceremony', houses: 12, leads: ['#E0B52E'], colors: MALI, flag: FM.mali, people: 30, roof: '#B07A4A' },
  tenochtitlan: { type: 'founding', houses: 14, people: 18, colors: MESOAM, flag: FM.mexica, roof: '#B9A88A' },
  blackdeath: { type: 'fleet', n: 4, from: [19.5, 37.5], crowd: 22, crowdColors: EUROPEANS, land: 10, landColors: ['#E9E2D0', '#C2413A', '#3B3F55'], pennant: '#F4F1EA', houses: 12 },
  zhenghe: { type: 'fleet', n: 9, from: [55, -2], crowd: 20, crowdColors: SWAHILI, land: 8, landColors: MING, pennant: '#C2413A', flag: FM.han, roof: '#E9E2D0' },
  inca: { type: 'ceremony', houses: 14, leads: ['#C2413A', '#E0B52E'], colors: ANDEANS, people: 30, roof: '#9A6A44' },
  /* world: 1450–1700 */
  constantinople1453: { type: 'battle', a: OTTOMANS, b: BYZANTINES, na: 26, nb: 18, guns: true, fire: true, ships: 3, pennant: '#C2413A' },
  gutenbergpress: { type: 'ceremony', leads: ['#2E2A26'], colors: EUROPEANS, scroll: true, people: 20, roof: '#6B4A3A' },
  columbus1492: { type: 'fleet', n: 3, from: [-62, 26], crowd: 18, land: 8, landColors: ES, flag: F.castile, cross: true, town: false },
  luther1517: { type: 'ceremony', leads: ['#2E2A26'], colors: EUROPEANS, scroll: true, people: 26, roof: '#8E3B2E' },
  tlaxcala: { type: 'ceremony', leads: ['#E9E2D0', '#C2413A', '#2E2A26', '#E0B52E'], colors: MESOAM, people: 28, houses: 12, roof: '#B9A88A' },  // the four lords and the council
  cortes: { type: 'battle', a: [...ES, '#E9E2D0', '#C2413A'], b: MESOAM, na: 24, nb: 26, guns: true, fire: true, roof: '#B9A88A' },
  pizarro: { type: 'battle', a: ES, b: ANDEANS, na: 12, nb: 30, guns: true, roof: '#9A6A44' },
  potosi: { type: 'gold' },
  manila: { type: 'fleet', n: 2, from: [127, 13], crowd: 20, crowdColors: ASIA, land: 8, landColors: ES, flag: F.castile, salute: true, houses: 10 },
  vocamsterdam: { type: 'fleet', dir: 'depart', n: 4, crowd: 24, crowdColors: NL, pennant: '#E07B24', to: [3.5, 53.6], houses: 12, roof: '#8E3B2E' },   // the fleet leaves for Asia
  westphalia: { type: 'treaty', colors: [F.nl, F.castile], a: NL, b: ES, roof: '#8E3B2E' },
  gloriousrev: { type: 'fleet', n: 9, from: [-1.5, 50.2], crowd: 18, crowdColors: EUROPEANS, land: 14, landColors: NL, pennant: '#E07B24', flag: FM.orange, salute: true, houses: 8 },
  /* world: 1700–1900 */
  kandiaronk: { type: 'treaty', colors: [F.fr, FM.wendat], a: FR, b: NATIVE, roof: '#6B4A3A' },                             // the Great Peace of 1701
  rousseau: { type: 'ceremony', leads: ['#3B3F55'], colors: EUROPEANS, scroll: true, people: 22, roof: '#6B4A3A' },
  plassey: { type: 'battle', a: BRITISH, b: INDIANS, na: 20, nb: 30, guns: true },
  tupacamaru: { type: 'revolt', flag: F.red, fire: true, colors: ANDEANS, people: 34, troops: 14, troopColors: ES, roof: '#9A6A44' },
  abolition1807: { type: 'ceremony', leads: ['#2E2A26', '#5B3A2A'], flag: F.gb, scroll: true, colors: [...DIPLOMATS, '#E9E2D0'], people: 26, roof: '#6B4A3A' },
  hidalgo: { type: 'revolt', flag: FM.guadalupe, colors: PEASANTS, people: 36, roof: '#B9A88A' },
  bolivar: { type: 'battle', a: ['#2F4F8A', '#E0B52E', '#E9E2D0'], b: ES, na: 22, nb: 22, guns: true },
  opium: { type: 'battle', a: BRITISH, b: QING, na: 18, nb: 26, guns: true, fire: true, ships: 4, pennant: '#B3261E', roof: '#3A4A3A' },
  spring1848: { type: 'revolt', flag: F.fr, people: 38, colors: TOWNSFOLK, houses: 18, roof: '#5E5A55' },
  taiping: { type: 'battle', a: QING, b: TAIPING, na: 24, nb: 24, guns: true, fire: true, roof: '#3A4A3A' },
  berlin1884: { type: 'treaty', colors: [FM.de1884, F.gb], a: DIPLOMATS, b: DIPLOMATS, roof: '#5E5A55' },
  congofreestate: { type: 'founding', houses: 8, people: 18, colors: AFRICA20, flag: FM.congo1885, natives: 6, roof: '#9A6A44' },
  /* world: after 1900 */
  adwa: { type: 'battle', a: AFRICA20, b: ITALIANS, na: 30, nb: 18, guns: true },
  mexico1910: { type: 'revolt', flag: FM.mx, fire: true, colors: PEASANTS, people: 30, troops: 12, troopColors: ARMY, roof: '#B9A88A' },
  ww1: { type: 'battle', a: ['#5B6B8A', '#6B7A4A', '#4A5A7A'], b: GERMANS, na: 26, nb: 26, guns: true, fire: true },
  russianrev1917: { type: 'revolt', flag: FM.ussr, people: 40, colors: TOWNSFOLK, troops: 12, troopColors: ARMY, houses: 18, roof: '#5E5A55' },
  saltmarch: { type: 'ceremony', leads: ['#F4F1EA'], colors: INDIANS, people: 30, houses: 8, roof: '#B07A4A' },
  ww2: { type: 'battle', a: GERMANS, b: POLES, na: 26, nb: 20, guns: true, fire: true },
  holocaust: { type: 'treaty', colors: [F.usa, FM.ussr], a: DIPLOMATS, b: ALLIES, roof: '#6B4A3A' },                   // the Nuremberg tribunal
  hiroshima1945: { type: 'earthquake', roof: '#3F4B5C', wave: false },
  un: { type: 'treaty', colors: [FM.un, F.white], a: DIPLOMATS, b: DIPLOMATS, roof: '#E9E2D0' },
  india1947: { type: 'ceremony', leads: ['#F4F1EA', '#2E2A26'], flag: FM.india, colors: INDIANS, people: 40, roof: '#B07A4A' },
  coldwar: { type: 'ceremony', leads: ['#2E2A26'], flag: F.usa, scroll: true, colors: TOWNSFOLK, people: 28, roof: '#E9E2D0' },
  china1949: { type: 'ceremony', leads: ['#5B6B3A', '#3B3F55'], flag: FM.ussr, colors: ['#3E6A8C', '#5B6B3A', '#2E2A26', '#E9E2D0'], people: 44, roof: '#A8322B' },
  decolonization1960: { type: 'ceremony', leads: ['#2E2A26', '#E9E2D0'], flag: FM.congo1960, colors: AFRICA20, people: 40, roof: '#9A6A44' },
  missiles1962: { type: 'fleet', n: 6, from: [-80, 25.5], crowd: 16, crowdColors: ['#5B6B3A', '#E9E2D0', '#3E6A8C'], land: 0, pennant: '#2F3F7A', houses: 10, roof: '#D9C9A0' },  // the blockade
  chile1973: { type: 'revolt', flag: FM.chile, fire: true, people: 12, troops: 30, troopColors: ARMY, colors: TOWNSFOLK },
  oil1973: { type: 'loading', cargo: 'crates', ships: 3, colors: ['#E9E2D0', '#F4F1EA', '#3B3F55'], pennant: '#2F8A3A', town: true, roof: '#D9C9A0', watchers: false },
  berlinwallfall: { type: 'revolt', flag: FM.frg, people: 44, colors: TOWNSFOLK, houses: 18, roof: '#5E5A55' },
  apartheid: { type: 'ceremony', leads: ['#3B3F55'], flag: FM.za, colors: AFRICA20, people: 44, roof: '#B9573C' },
  zapatistas: { type: 'revolt', flag: FM.ezln, colors: ['#2E2A26', '#E9E2D0', '#C2413A', '#3E6A8C'], people: 30, troops: 12, troopColors: ARMY, roof: '#9A6A44' }
};
