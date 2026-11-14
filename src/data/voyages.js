// Sea voyages linked to events: they are drawn on the map (and on the globe) when the event is selected.
// pts: waypoints [lon, lat]; the route between them goes around land. The first and last may be on the coast.
// later: a stretch that comes after the event (drawn fainter). stops: named stops, [lon, lat, name].
// On the 0.5° grid the Strait of Gibraltar is closed: voyages leaving the Mediterranean pass through GIB_E and GIB_W,
// one on each side of the strait (the stretch between them has no sea route and is skipped).
const LISBON = [-9.4, 38.65];
const RIO = [-43.1, -23.0], SANTOS = [-46.3, -24.1], GIB_E = [-4.6, 36.2], GIB_W = [-6.5, 36.0];
const GENOA = [8.8, 44.2], NAPLES = [14.2, 40.6];
const MED_GENOA = [GENOA, [5, 41.5], [-1, 37], GIB_E, GIB_W], MED_NAPLES = [NAPLES, [12.5, 39.8], [8, 38.5], [0, 37], GIB_E, GIB_W];

export const VOYAGES = {
  cabral: [
    { label: 'Lisbon → Porto Seguro (March–April 1500)', color: '#B3261E', pts: [LISBON, [-16.0, 30.2], [-24.5, 16.4], [-29.0, 0], [-34.0, -11.0], [-38.95, -16.35]],
      stops: [[-15.6, 28.2, 'Canary Islands'], [-24.3, 16.6, 'Cape Verde'], [-38.95, -16.35, 'Porto Seguro']] },
    { label: 'Porto Seguro → Calicut (May–September)', color: '#B3261E', later: true, pts: [[-38.95, -16.35], [-30, -26], [-12, -35], [8, -37.5], [20, -36.5], [35, -26], [40.7, -15.0], [40.0, -3.2], [55, 5], [70, 10], [75.6, 11.25]],
      stops: [[18.5, -35.2, 'Cape of Good Hope'], [40.7, -15.0, 'Mozambique'], [40.1, -3.2, 'Malindi'], [75.6, 11.25, 'Calicut']] }
  ],
  gama: [
    { label: 'Lisbon → Calicut (1497–1498)', color: '#C98A1B', pts: [LISBON, [-16.0, 29.0], [-24.5, 15.0], [-26, -10], [-20, -30], [10, -34], [17.9, -32.8], [20, -36.5], [32, -29], [40.7, -15.0], [40.0, -3.2], [55, 6], [70, 10], [75.6, 11.25]],
      stops: [[-24.3, 15.0, 'Cape Verde'], [17.9, -32.8, 'St Helena Bay'], [40.7, -15.0, 'Mozambique'], [40.1, -3.2, 'Malindi'], [75.6, 11.25, 'Calicut']] }
  ],
  franceantarctique: [
    { label: 'Le Havre → Guanabara (1555)', color: '#2F4F8A', pts: [[0.1, 49.5], [-5, 48], [-12, 40], [-20, 25], [-28, 5], [-35, -10], [-43.15, -22.95]] }
  ],
  dutch: [
    { label: 'Amsterdam → Recife (1630)', color: '#E07B24', pts: [[4.6, 52.6], [2, 51.3], [-5, 49.5], [-15, 40], [-25, 20], [-30, 0], [-34.85, -8.05]] }
  ],
  luanda1641: [
    { label: 'Rio de Janeiro → Luanda (1648, Salvador Correia de Sá)', color: '#3F6FB5', pts: [[-43.1, -23.0], [-30, -24], [-10, -18], [5, -12], [13.15, -8.8]] }
  ],
  slavetrade: [
    { label: 'Luanda → Salvador', color: '#8E3B2E', pts: [[13.15, -8.8], [0, -11], [-20, -13], [-38.4, -13]] },
    { label: 'Luanda → Recife', color: '#8E3B2E', pts: [[13.15, -8.8], [0, -8], [-20, -8], [-34.8, -8.05]] },
    { label: 'Luanda → Rio de Janeiro', color: '#8E3B2E', pts: [[13.15, -8.8], [0, -15], [-25, -22], [-43.1, -23.0]] },
    { label: 'Mina Coast → Salvador', color: '#8E3B2E', pts: [[2.1, 6.2], [-5, 2], [-20, -6], [-38.4, -13]] }
  ],
  junot: [
    { label: 'Lisbon → Salvador → Rio (Nov. 1807–Mar. 1808)', color: '#3F6FB5', later: true, pts: [LISBON, [-17, 28], [-25, 10], [-32, -5], [-38.4, -13], [-37, -18], [-43.1, -23.0]],
      stops: [[-38.4, -13, 'Salvador (Jan. 1808)'], [-43.1, -23.0, 'Rio de Janeiro (Mar. 1808)']] }
  ],
  court: [
    { label: 'Lisbon → Salvador → Rio (Nov. 1807–Mar. 1808)', color: '#3F6FB5', pts: [LISBON, [-17, 28], [-25, 10], [-32, -5], [-38.4, -13], [-37, -18], [-43.1, -23.0]],
      stops: [[-38.4, -13, 'Salvador (Jan. 1808)'], [-43.1, -23.0, 'Rio de Janeiro (Mar. 1808)']] }
  ],
  return: [
    { label: 'Rio → Lisbon (April–July 1821)', color: '#3F6FB5', pts: [[-43.1, -23.0], [-35, -15], [-30, 0], [-25, 15], [-17, 28], LISBON] }
  ],
  /* after 1822 */
  cisplatina: [
    { label: 'Rio → Río de la Plata (the fleet blockades Buenos Aires, 1826)', color: '#2F5F3A', pts: [RIO, SANTOS, [-50, -30], [-55, -35.3], [-56.2, -35.0], [-58.0, -34.7]],
      stops: [[-56.2, -35.0, 'Montevideo'], [-58.0, -34.7, 'Buenos Aires']] }
  ],
  abdication: [
    { label: 'Rio → Cherbourg (April–June 1831)', color: '#3F6FB5', later: true, pts: [RIO, [-35, -15], [-30, 0], [-25, 15], [-17, 30], [-12, 45], [-5, 48.5], [-1.6, 49.8]],
      stops: [[-1.6, 49.75, 'Cherbourg']] }
  ],
  males: [
    { label: 'Salvador → Mina Coast (freedmen deported, 1835)', color: '#8E3B2E', later: true, pts: [[-38.4, -13.1], [-20, -6], [-5, 2], [2.3, 6.2]],
      stops: [[2.3, 6.2, 'Mina Coast']] }
  ],
  coffee: [
    { label: 'Rio and Santos → New York (coffee)', color: '#6B4A2C', pts: [SANTOS, RIO, [-38, -18], [-34.5, -7], [-36, -2], [-50, 10], [-62, 20], [-70, 30], [-73.9, 40.4]],
      stops: [[-73.9, 40.4, 'New York']] },
    { label: 'Santos → Hamburg (coffee)', color: '#6B4A2C', pts: [SANTOS, [-38, -18], [-34.5, -7], [-28, 5], [-20, 25], [-12, 44], [-5, 48.5], [2, 51.3], [8.3, 54]],
      stops: [[8.3, 54, 'Hamburg']] }
  ],
  civilwar: [
    { label: 'New Orleans → Rio (Confederates, 1866–1867)', color: '#8A8A82', later: true, pts: [[-89.4, 28.9], [-85, 25], [-80, 23.6], [-75, 22.6], [-70, 21], [-60, 15], [-50, 8], [-35, -5], [-35, -15], RIO],
      stops: [[-89.4, 28.9, 'New Orleans'], [-43.1, -23.0, 'Rio de Janeiro']] }
  ],
  paraguaywar: [
    { label: 'Rio → Río de la Plata and up the Paraná River (fleet, 1865)', color: '#2F5F3A', pts: [RIO, SANTOS, [-50, -30], [-55, -35.3], [-56.2, -35.0], [-58.0, -34.7]],
      stops: [[-56.2, -35.0, 'Montevideo'], [-58.0, -34.7, 'Buenos Aires'], [-58.75, -27.45, 'Riachuelo (Paraná River)']] }
  ],
  italy: [
    { label: 'Genoa → Santos', color: '#2F8A3A', pts: [...MED_GENOA, [-12, 33], [-20, 20], [-28, 5], [-34, -8], [-37.5, -16], [-41, -23.3], SANTOS],
      stops: [[8.8, 44.2, 'Genoa'], [-46.3, -24.1, 'Santos']] },
    { label: 'Naples → New York', color: '#2F8A3A', pts: [...MED_NAPLES, [-20, 37], [-45, 40], [-65, 40], [-73.9, 40.4]],
      stops: [[14.2, 40.6, 'Naples'], [-73.9, 40.4, 'New York']] }
  ],
  immigration: [
    { label: 'Genoa → Santos', color: '#2F8A3A', pts: [...MED_GENOA, [-12, 33], [-20, 20], [-28, 5], [-34, -8], [-37.5, -16], [-41, -23.3], SANTOS],
      stops: [[8.8, 44.2, 'Genoa'], [-46.3, -24.1, 'Santos']] },
    { label: 'Lisbon → Santos', color: '#3F6FB5', pts: [LISBON, [-17, 28], [-25, 12], [-32, -4], [-35, -15], [-41, -23.3], SANTOS] },
    { label: 'Hamburg → Santos', color: '#5E6468', pts: [[8.3, 54], [2, 51.3], [-5, 48.5], [-12, 44], [-20, 25], [-28, 5], [-34.5, -7], [-38, -18], SANTOS] }
  ],
  rubber: [
    { label: 'Manaus → Belém → Liverpool (rubber; the river stretch is not shown)', color: '#5C3B22', pts: [[-48.2, -0.6], [-46, 1.5], [-40, 5], [-30, 20], [-20, 40], [-10, 47], [-5.5, 51], [-3.6, 53.7]],
      stops: [[-60.02, -3.1, 'Manaus'], [-48.4, -1.3, 'Belém'], [-3.6, 53.7, 'Liverpool']] }
  ],
  kasato: [
    { label: 'Kobe → Santos (28 April–18 June 1908)', color: '#B3261E', pts: [[135.1, 33.8], [131, 31], [122, 22], [112, 12], [105, 3], [96, 6], [80, 5], [60, -10], [40, -30], [25, -36.5], [18, -35], [0, -30], [-30, -26], SANTOS],
      stops: [[135.1, 33.8, 'Kobe'], [103.8, 1.2, 'Singapore'], [18.4, -33.9, 'Cape Town'], [-46.3, -24.1, 'Santos']] }
  ],
  vaccinerevolt: [
    { label: 'Rio → Belém, and from there upriver to Acre (deported prisoners, 1904)', color: '#3B3F55', later: true, pts: [RIO, [-38.3, -13.1], [-34.6, -8.1], [-34.9, -6.0], [-38.5, -3.6], [-44.2, -2.4], [-48.2, -0.6]],
      stops: [[-48.2, -0.6, 'Belém'], [-67.81, -9.97, 'Acre']] }
  ],
  feb: [
    { label: 'Rio → Naples (1st echelon of the FEB, the Brazilian Expeditionary Force, 2–16 July 1944)', color: '#5B6B3A', pts: [[-43.1, -23.05], [-35, -15], [-30, 0], [-25, 15], [-17, 28], [-9.5, 36.3], GIB_W, GIB_E, [0, 37], [8, 38.5], [12.5, 39.8], NAPLES],
      stops: [[-5.4, 36.1, 'Gibraltar'], [14.2, 40.6, 'Naples']] }
  ]
};
