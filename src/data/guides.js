// Guides: for some events, a step-by-step account of how they unfolded.
// Each step: y = year (the map jumps to that year; negative = BC), p = [lon, lat] of the place where it happened,
// zoom = 'close' (city, ~50 km) | 'region' (~500 km) | 'continent' (~3000 km) | 'world' (ocean or whole world),
// t = short title, txt = 2 or 3 sentences, ev = id of another atlas event the step is about (optional).
// Steps are in chronological order: background, main moments, immediate consequences.

export const GUIDES = {
  /* ---------- Mansa Musa, 1324 ---------- */
  mansamusa: [
    { y: 1235, p: [-8.38, 11.38], zoom: 'region', t: 'Sundiata founds Mali',
      txt: 'According to the oral tradition of the griots, Sundiata Keita defeated King Sumanguru at the battle of Kirina, around 1235, and united the Mandinka peoples of the upper Niger. The capital may have been Niani, but where it stood is still debated. Within a few decades Mali came to control the gold trade of the region.' },
    { y: 1300, p: [-10.8, 12.8], zoom: 'region', t: 'The gold mines of Bambuk and Bure',
      txt: 'Mali’s gold came from alluvial deposits in the Bambuk region, between the Senegal and Falémé rivers, and in Bure, on the upper Niger. Local miners dug it out and traded it for salt, copper and cloth with merchants who crossed the Sahara. This gold supplied much of the coinage of the Mediterranean and the Islamic world.' },
    { y: 1312, p: [-17.4, 14.7], zoom: 'continent', t: 'The fleet lost in the Atlantic',
      txt: 'Musa came to the throne around 1312 (the dates of his reign vary by source). In Cairo, he told how his predecessor had sent hundreds of boats west across the Atlantic, and then set out himself, never to return. The story was recorded by the chronicler al-Umari; there is no other evidence of the voyage.' },
    { y: 1324, p: [-2.0, 22.0], zoom: 'continent', t: 'Crossing the Sahara',
      txt: 'In 1324, Musa left for Mecca with a retinue that Arabic sources count in the thousands, many of them enslaved people, and camels loaded with gold. The exact route is uncertain; it probably passed through Walata and the oases of Tuat. The pilgrimage was a religious duty and also a show of power.' },
    { y: 1324, p: [31.24, 30.04], zoom: 'close', t: 'Gold brings down prices in Cairo',
      txt: 'In July 1324, Musa reached Cairo and was received by the Mamluk sultan al-Nasir Muhammad. He handed out so much gold to officials and merchants that, according to al-Umari, writing about twelve years later, the metal was still worth less in the city. This is how Mali entered the accounts of the Mediterranean world.' },
    { y: 1324, p: [39.83, 21.42], zoom: 'close', t: 'Mecca and a return in debt',
      txt: 'Musa completed the pilgrimage in Mecca at the end of 1324. On the way back, passing through Cairo again, he had already spent so much that he had to borrow from local merchants, who charged high interest. He brought back scholars, jurists and the Andalusian poet and architect Abu Ishaq al-Sahili.' },
    { y: 1327, p: [-3.0, 16.77], zoom: 'close', t: 'Timbuktu becomes a center of learning',
      txt: 'Around this time Mali took control of Gao and Timbuktu, on the bend of the Niger. The Djinguereber mosque in Timbuktu is attributed to al-Sahili and dated to around 1327. The city drew teachers and books and became famous as a center of Islamic learning in the following centuries.' },
    { y: 1375, p: [2.65, 39.57], zoom: 'close', t: 'The Catalan Atlas draws Musa',
      txt: 'In 1375, in Majorca, a map made in the workshop of the Jewish cartographer Cresques Abraham showed Musa seated on a throne, with a crown and a gold nugget in his hand. For Europeans, Mali became a byword for African gold. The wish to reach that gold without going through North African middlemen was one of the reasons for the Portuguese voyages along the coast in the next century.' }
  ],

  /* ---------- Black Death, 1347 ---------- */
  blackdeath: [
    { y: 1338, p: [74.9, 42.8], zoom: 'continent', t: 'An outbreak in Central Asia',
      txt: 'Gravestones in a Nestorian Christian cemetery in the Chu River valley, in today’s Kyrgyzstan, record many deaths from "pestilence" in 1338 and 1339. In 2022, Yersinia pestis DNA taken from skeletons in this cemetery was identified as close to the origin of the Black Death strain. The disease then spread along the caravan routes of the Mongol Empire.' },
    { y: 1346, p: [35.38, 45.03], zoom: 'region', t: 'The siege of Caffa',
      txt: 'In 1346, the army of the Golden Horde was besieging Caffa, a Genoese port in Crimea, when the plague struck the besiegers. The notary Gabriele de’ Mussi wrote that the Mongols hurled corpses over the walls; many historians doubt that this was how the disease spread. Either way, ships leaving the Black Sea ports carried it into the Mediterranean.' },
    { y: 1347, p: [15.55, 38.19], zoom: 'close', t: 'Genoese galleys at Messina',
      txt: 'In October 1347, Genoese galleys reached Messina, in Sicily, with sick sailors aboard. The same year the plague reached Constantinople, Alexandria and, in November, Marseille. The best-remembered symptoms were the swellings in the groin and armpits, the buboes.' },
    { y: 1348, p: [11.25, 43.77], zoom: 'region', t: 'Florence and the Italian cities',
      txt: 'In the spring of 1348 the disease swept through Florence, Siena, Venice and Genoa. In Florence perhaps half the inhabitants died; Giovanni Boccaccio used the epidemic as the frame for the Decameron. The cities created health magistrates and, soon after, quarantines for ships.' },
    { y: 1348, p: [31.24, 30.04], zoom: 'region', t: 'Cairo and the Islamic world',
      txt: 'The plague reached Egypt in the autumn of 1347 and Cairo in 1348, killing perhaps a third of the population of the city, then one of the largest in the world. It spread through Syria, Palestine and Mecca. Arab chroniclers such as al-Maqrizi described empty streets and fields with no one to harvest them.' },
    { y: 1349, p: [7.75, 48.58], zoom: 'close', t: 'The massacre of the Jews of Strasbourg',
      txt: 'In many cities, Jews were accused of poisoning the wells. On 14 February 1349, hundreds of Strasbourg’s Jews were burned alive, before the plague had even reached the city; the exact number is debated. Pope Clement VI, in Avignon, issued bulls in 1348 condemning the attacks, with little effect.' },
    { y: 1349, p: [5.32, 60.39], zoom: 'continent', t: 'England, Norway, northern Europe',
      txt: 'The plague reached southern England in June 1348 and Bergen, in Norway, in 1349, on a ship from London. By 1351 it had crossed almost all of Europe, as far as Russia, where it went on in the following years. Between a third and a half of Europeans died in about four years.' },
    { y: 1351, p: [-0.12, 51.5], zoom: 'region', t: 'Labor shortage and wage laws',
      txt: 'With fewer workers, peasants and craftsmen began to demand higher wages. In England, the crown tried to freeze pay with the Ordinance of Labourers of 1349 and the Statute of Labourers of 1351. These tensions were among the causes of the Peasants’ Revolt of 1381; the plague also came back in waves for the rest of the century.' }
  ],

  /* ---------- Columbus, 1492 ---------- */
  columbus1492: [
    { y: 1485, p: [-9.14, 38.71], zoom: 'close', t: 'Portugal rejects the plan',
      txt: 'Around 1484, the Genoese Christopher Columbus proposed to King John II of Portugal to reach Asia by sailing west. The king’s advisers thought he underestimated the size of the Earth, and they were right. Portugal preferred the route around southern Africa, which Bartolomeu Dias opened by rounding the Cape of Good Hope in 1488.' },
    { y: 1492, p: [-3.72, 37.19], zoom: 'close', t: 'Granada and the Capitulations of Santa Fe',
      txt: 'On 2 January 1492, the monarchs Isabella of Castile and Ferdinand of Aragon took Granada, the last Muslim kingdom of the Peninsula. On 17 April, at the camp of Santa Fe, next to the city, they signed the Capitulations with Columbus: he would be admiral and viceroy of the lands he found, with a share of the profits.' },
    { y: 1492, p: [-6.89, 37.23], zoom: 'close', t: 'Departure from Palos, 3 August',
      txt: 'On 3 August 1492, the carrack Santa María and the caravels Pinta and Niña left the port of Palos, in Andalusia, with about 90 men. Many were local sailors, recruited with the help of the Pinzón brothers. That same summer, Jews who refused conversion were being expelled from Spain.' },
    { y: 1492, p: [-17.11, 28.09], zoom: 'region', t: 'A stop in the Canaries',
      txt: 'The fleet stopped in the Canary Islands, then being conquered by Castile, to repair the Pinta’s rudder and take on supplies. On 6 September it left La Gomera heading west. From there the trade winds pushed the ships across the ocean.' },
    { y: 1492, p: [-45.0, 26.0], zoom: 'world', t: 'Five weeks of ocean',
      txt: 'The crossing took more than a month, most of it out of sight of land. Columbus logged shorter distances than the real ones so as not to frighten the crew, who even thought of turning back in early October. Flocks of birds and floating branches showed that land was near.' },
    { y: 1492, p: [-74.5, 24.1], zoom: 'region', t: 'Guanahani, 12 October',
      txt: 'Before dawn on 12 October, the Pinta sighted an island in the Bahamas that the Taíno called Guanahani and Columbus renamed San Salvador; exactly which island it is today is still debated. Columbus thought he was near Japan and China. In the following days he took some Taíno by force to serve as guides.' },
    { y: 1492, p: [-72.1, 19.77], zoom: 'region', t: 'Cuba, Hispaniola and the fort of La Navidad',
      txt: 'Columbus reached Cuba on 28 October and Hispaniola on 6 December. On Christmas night the Santa María ran aground, and her timber was used to build the fort of La Navidad, where 39 men stayed behind. When Columbus came back, in November 1493, they were all dead.' },
    { y: 1493, p: [-6.89, 37.23], zoom: 'continent', t: 'The return and the news',
      txt: 'On the way back a storm forced Columbus to stop in the Azores and in Lisbon, where he was received by John II, who claimed the lands for Portugal. Columbus reached Palos on 15 March 1493. The letter in which he described the voyage was printed and circulated around Europe within a few months.' },
    { y: 1494, p: [-5.0, 41.52], zoom: 'region', t: 'Tordesillas and colonization', ev: 'tordesillas',
      txt: 'In 1493 the pope divided the ocean between Castile and Portugal, and on 7 June 1494 the two kingdoms signed at Tordesillas a line 370 leagues west of Cape Verde. Columbus had returned to Hispaniola with 17 ships and more than a thousand men and founded La Isabela. The Taíno were forced to hand over gold and labor, and their population collapsed in the following decades.' }
  ],

  /* ---------- Cabral, 1500 ---------- */
  cabral: [
    { y: 1498, p: [75.78, 11.25], zoom: 'region', t: 'Vasco da Gama opens the route to India', ev: 'gama',
      txt: 'In May 1498, Vasco da Gama’s fleet reached Calicut, on the Malabar Coast, after sailing around Africa. He returned to Lisbon in 1499 with pepper and other spices, and with news that the city’s Muslim merchants were hostile. King Manuel I quickly sent a second fleet, larger and armed.' },
    { y: 1500, p: [-9.21, 38.7], zoom: 'close', t: 'Departure from Restelo, 9 March',
      txt: 'On 9 March 1500, thirteen ships and about 1,200 to 1,500 men left Restelo beach, in Lisbon, under the command of Pedro Álvares Cabral. The mission was commercial and diplomatic: to open a trading post (feitoria) in Calicut. Among the captains was Bartolomeu Dias, who had rounded the Cape of Good Hope in 1488.' },
    { y: 1500, p: [-24.3, 16.6], zoom: 'region', t: 'Cape Verde and a lost ship',
      txt: 'On 22 March the fleet passed the Cape Verde islands. The next day Vasco de Ataíde’s ship vanished without a trace. From there the fleet sailed southwest, away from the African coast.' },
    { y: 1500, p: [-30.0, -5.0], zoom: 'world', t: 'The wide loop through the Atlantic',
      txt: 'To escape the calms of the Gulf of Guinea and catch the winds that lead to southern Africa, ships made a great arc to the west, the volta do mar ("turn of the sea"), following instructions left by Gama. Cabral’s fleet went farther west than earlier ones. Historians still debate whether the detour was chance or a planned attempt to find land.' },
    { y: 1500, p: [-39.42, -16.89], zoom: 'region', t: 'Monte Pascoal, 22 April',
      txt: 'On 22 April, the sailors saw a tall, round hill, which they named Monte Pascoal because it was Easter week. Two days later the fleet anchored in a sheltered bay farther north, which they called Porto Seguro, today Cabrália Bay. The land was named the Island of Vera Cruz.' },
    { y: 1500, p: [-39.03, -16.33], zoom: 'close', t: 'Ten days with the Tupiniquim',
      txt: 'The Portuguese exchanged gifts with the Tupiniquim, who came on board and danced on the beach. On 26 April Mass was said on the islet of Coroa Vermelha, and on 1 May a second Mass, at the foot of a cross. Pero Vaz de Caminha described it all in a letter to the king dated 1 May.' },
    { y: 1500, p: [18.47, -34.36], zoom: 'continent', t: 'Shipwrecks at the Cape of Good Hope',
      txt: 'On 2 May the fleet left: one ship went back to Lisbon with Caminha’s letter, and two convicted exiles were left ashore. At the end of May, a storm near the Cape of Good Hope sank four ships; Bartolomeu Dias died on one of them. The rest continued along the east coast of Africa.' },
    { y: 1500, p: [75.78, 11.25], zoom: 'region', t: 'Calicut: trading post and bombardment',
      txt: 'Cabral reached Calicut on 13 September 1500 and opened a trading post. In December, merchants and residents attacked it and killed dozens of Portuguese, among them Caminha. Cabral bombarded the city and went to load spices in Cochin, Calicut’s rival; only some of the ships made it back to Lisbon, in 1501.' },
    { y: 1502, p: [-42.0, -22.9], zoom: 'region', t: 'From landfall to brazilwood', ev: 'brazilwood',
      txt: 'Portugal at first treated the new land as a stopover on the way to India. Expeditions in 1501 and 1502 sailed along the coast and found a dye wood, brazilwood. The crown leased the trade to Lisbon merchants, who traded tools with the Indigenous people for the cut wood.' }
  ],

  /* ---------- Cortés and Tenochtitlan, 1521 ---------- */
  cortes: [
    { y: 1519, p: [-80.0, 21.8], zoom: 'continent', t: 'Cortés leaves Cuba',
      txt: 'In February 1519, Hernán Cortés left Cuba with 11 ships and about 500 soldiers, against the will of Governor Diego Velázquez, who had revoked his command. Earlier expeditions had already seen stone cities on the coast of Mexico. The stated goal was to trade and explore; Cortés wanted to conquer.' },
    { y: 1519, p: [-92.6, 18.5], zoom: 'region', t: 'Tabasco and Malintzin',
      txt: 'In March 1519, at the mouth of the Grijalva River, the Spaniards defeated the Chontal Maya at Centla. Among the twenty women handed over as tribute was Malintzin (Malinche), who spoke Nahuatl and Maya. With her and with the castaway Jerónimo de Aguilar, who spoke Maya, Cortés now had interpreters.' },
    { y: 1519, p: [-96.13, 19.19], zoom: 'region', t: 'Veracruz and the scuttled ships',
      txt: 'In April, Cortés founded Villa Rica de la Vera Cruz, whose council named him captain, to escape Velázquez’s authority. He received Moctezuma’s ambassadors bearing gifts of gold and made an alliance with the Totonacs of Cempoala, discontented subjects of the Mexica. In the summer, he had the ships run aground so that no one could go back to Cuba.' },
    { y: 1519, p: [-98.24, 19.32], zoom: 'region', t: 'War and alliance with Tlaxcala', ev: 'tlaxcala',
      txt: 'In September, the Spaniards entered the territory of Tlaxcala, a republic ruled by a council and an enemy of the Mexica. After several battles, the council decided to ally with Cortés. Thousands of Tlaxcalan warriors went along with the Spaniards, and without them the conquest would not have happened.' },
    { y: 1519, p: [-98.3, 19.06], zoom: 'close', t: 'The Cholula massacre',
      txt: 'In October, in Cholula, a great religious center allied with the Mexica, Spaniards and Tlaxcalans killed thousands of people gathered in a courtyard. Cortés said he had uncovered an ambush; many historians see the massacre as an act of terror. The news spread across the Valley of Mexico.' },
    { y: 1519, p: [-99.13, 19.43], zoom: 'close', t: 'Meeting Moctezuma, 8 November',
      txt: 'On 8 November 1519, Moctezuma received Cortés on the causeway linking Tenochtitlan to the lakeshore and lodged him in a palace. It was a city of perhaps 200,000 people, larger than any Spanish city. Days later, the Spaniards seized the ruler and began to give orders in his name.' },
    { y: 1520, p: [-99.17, 19.45], zoom: 'close', t: 'The Noche Triste and smallpox',
      txt: 'In May 1520, Pedro de Alvarado massacred Mexica nobles at a festival in the Templo Mayor, and the city rose up; Moctezuma died, in disputed circumstances. On the night of 30 June, the Spaniards fled along the Tlacopan causeway and lost many of their men. Soon after, a smallpox epidemic, which had arrived with Pánfilo de Narváez’s troops, killed thousands in Tenochtitlan, among them the new ruler, Cuitláhuac.' },
    { y: 1521, p: [-99.14, 19.45], zoom: 'close', t: 'The siege and the fall, 13 August',
      txt: 'In May 1521, Cortés came back with brigantines assembled to sail on the lake and an army of tens of thousands of Indigenous allies. The city was besieged, cut off from water and food, and destroyed block by block. On 13 August, Cuauhtémoc was captured in Tlatelolco; on the ruins the Spaniards built Mexico City.' }
  ],

  /* ---------- The trade in Africans, 1550–1850 ---------- */
  slavetrade: [
    { y: 1500, p: [6.73, 0.34], zoom: 'region', t: 'São Tomé, the laboratory',
      txt: 'On the island of São Tomé, settled by the Portuguese from 1493, sugar mills were set up worked by enslaved Africans brought from the nearby mainland. The island also became a depot for captives sent to Europe and later to the Americas. It was there that sugar, slavery and large-scale slave trading first came together.' },
    { y: 1526, p: [14.24, -6.27], zoom: 'region', t: 'The king of Kongo complains', ev: 'kongo',
      txt: 'Afonso I, the Christian king of Kongo, wrote in 1526 to King John III of Portugal complaining that Portuguese merchants were capturing even nobles and his own relatives. He did not ask for an end to all slavery, but for the king to control the trade. The trade went on and shifted south, to the region of Angola.' },
    { y: 1570, p: [-34.85, -8.01], zoom: 'region', t: 'From Indigenous to African labor in the mills', ev: 'sugar',
      txt: 'Brazil’s first sugar mills relied mostly on Indigenous labor, but epidemics, escapes and wars shrank this workforce. In 1570, a law of King Sebastian restricted the enslavement of Indigenous people. In the following decades the mills of Pernambuco and Bahia came to depend more and more on Africans.' },
    { y: 1576, p: [13.23, -8.84], zoom: 'region', t: 'Luanda, port of embarkation', ev: 'luanda',
      txt: 'In 1576, Paulo Dias de Novais founded Luanda. Wars of conquest in the interior, alliances with local chiefs and debts produced captives, who were taken to the port. Angola became the largest source of enslaved people for Brazil.' },
    { y: 1648, p: [13.6, -9.2], zoom: 'region', t: 'Rio retakes Luanda', ev: 'luanda1641',
      txt: 'In 1641, the Dutch West India Company took Luanda to secure enslaved workers for the sugar mills of Pernambuco, then under Dutch rule. In August 1648, a fleet fitted out in Rio de Janeiro by Salvador Correia de Sá retook the city. For the historian Alencastro, the episode shows that Brazil and Angola formed a single system, governed partly from the American side.' },
    { y: 1721, p: [2.09, 6.36], zoom: 'region', t: 'Bahian tobacco on the Mina Coast',
      txt: 'In the 18th century, with the gold rush, demand for enslaved people grew, and Salvador began buying many captives on the Mina Coast, in the Bight of Benin. In Ajudá (Ouidah), where the Portuguese built a fort in 1721, Bahia’s rope tobacco was the main trade good. From there came many Yoruba, Gbe (Jeje) and Hausa people.' },
    { y: 1811, p: [-43.19, -22.895], zoom: 'close', t: 'The Valongo Wharf',
      txt: 'Rio de Janeiro became the largest port of arrival for Africans in the Americas. From 1769 the captive market stood at Valongo, and in 1811 a wharf was built there; an estimated hundreds of thousands of people landed on it. Its ruins, found during construction work in 2011, have been a World Heritage Site since 2017.' },
    { y: 1831, p: [-43.18, -22.9], zoom: 'region', t: 'A law "for the English to see"',
      txt: 'Under pressure from Great Britain, which had banned its own slave trade in 1807, Brazil pledged in an 1826 treaty to end the trade. The law of 7 November 1831 declared free any Africans arriving from then on. It was not enforced: between 1831 and 1850 about 750,000 Africans were brought in illegally.' },
    { y: 1850, p: [-43.1, -22.85], zoom: 'region', t: 'Aberdeen and Eusébio de Queirós', ev: 'eusebio',
      txt: 'In 1845, the Aberdeen Act authorized the British navy to seize Brazilian slave ships, even in Brazilian waters. On 4 September 1850, the imperial government passed the Eusébio de Queirós Law and began to suppress landings. The trade ended within a few years (one of the last known landings was at Serinhaém, Pernambuco, in 1856), after bringing about 4.8 million Africans to Brazil.' }
  ],

  /* ---------- Palmares, 1605–1695 ---------- */
  palmares: [
    { y: 1600, p: [-35.2, -8.3], zoom: 'region', t: 'Escapes from the Pernambuco sugar mills', ev: 'sugar',
      txt: 'At the end of the 16th century, Pernambuco was the largest sugar-producing region in the world, with tens of thousands of enslaved Africans. Escape was a common form of resistance. Fugitives headed for the forests and hills of the interior, a few days’ walk from the mills.' },
    { y: 1605, p: [-36.0, -9.15], zoom: 'region', t: 'The mocambos of the Serra da Barriga',
      txt: 'In the first decades of the 17th century there are reports of mocambos (runaway settlements) in the hill country of today’s Alagoas, full of palm trees, hence the name Palmares. The first expeditions against them date from the start of the century. The inhabitants grew maize, cassava and beans and traded goods with neighboring farmers.' },
    { y: 1645, p: [-34.88, -8.06], zoom: 'region', t: 'The Dutch war makes Palmares grow', ev: 'dutch',
      txt: 'During the war between the Dutch and the Luso-Brazilians, disorder on the plantations made escape easier, and Palmares grew a great deal. The Dutch sent expeditions in 1644 and 1645; Captain João Blaer’s diary describes villages with hundreds of houses, fields and a chapel. Sources of the time speak of thousands of inhabitants, but the numbers are debated.' },
    { y: 1678, p: [-34.88, -8.06], zoom: 'close', t: 'Ganga Zumba’s agreement in Recife',
      txt: 'After several Portuguese expeditions in the 1670s, Ganga Zumba, the main leader of Palmares, sent envoys to Recife. In 1678 he accepted an agreement with the governor: freedom for those born in Palmares and land at Cucaú, in exchange for returning recent runaways. Many rejected the deal; Ganga Zumba died in 1680, poisoned according to some accounts.' },
    { y: 1680, p: [-36.0, -9.15], zoom: 'close', t: 'Zumbi takes the lead',
      txt: 'Zumbi, Ganga Zumba’s nephew and a war leader, rejected the agreement and reorganized the resistance from the royal stockade of Macaco, on the Serra da Barriga. Expeditions kept being driven back in the 1680s. Little is known for certain about Zumbi’s life; part of what is told comes from later traditions.' },
    { y: 1694, p: [-36.0, -9.15], zoom: 'close', t: 'The fall of Macaco, February 1694',
      txt: 'The government of Pernambuco hired the bandeirante (backwoods slaver and explorer) Domingos Jorge Velho, from São Paulo, who came from wars against Indigenous peoples in the sertão. After a failed first attack in 1692, his troops, with reinforcements from other captaincies and cannons, besieged Macaco for weeks. In February 1694 the stockade was taken, and hundreds of people were killed or captured.' },
    { y: 1695, p: [-34.88, -8.06], zoom: 'region', t: 'The death of Zumbi, 20 November',
      txt: 'Zumbi escaped and kept resisting until he was betrayed and killed in an ambush on 20 November 1695. His head was displayed in a public square in Recife to disprove the belief that he was immortal. Smaller groups held out for years; 20 November, Black Consciousness Day, has been a national holiday since 2024.' }
  ],

  /* ---------- Dutch Brazil, 1630–1654 ---------- */
  dutch: [
    { y: 1621, p: [4.9, 52.37], zoom: 'region', t: 'The Dutch West India Company',
      txt: 'Since 1580 Portugal had been united with Spain, the enemy of the United Provinces, which were fighting for independence. When a twelve-year truce ended in 1621, the Dutch created the West India Company, a private company with the right to wage war in the Atlantic. Brazilian sugar, much of which already went through Amsterdam, was an obvious target.' },
    { y: 1624, p: [-38.51, -12.97], zoom: 'close', t: 'The capture of Salvador, 1624',
      txt: 'In May 1624, a Company fleet took Salvador, the capital of Brazil, almost without a fight. Residents and Jesuits resisted in the interior, and on 1 May 1625 a large Luso-Spanish fleet, the Jornada dos Vassalos ("Expedition of the Vassals"), retook the city. The failure left the Company in debt.' },
    { y: 1628, p: [-81.55, 23.06], zoom: 'region', t: 'The silver of Matanzas',
      txt: 'In September 1628, Admiral Piet Heyn captured the Spanish silver fleet in Matanzas Bay, Cuba. The loot paid dividends to the shareholders and funded a new expedition to Brazil, this time against Pernambuco, the richest sugar captaincy.' },
    { y: 1630, p: [-34.86, -8.03], zoom: 'close', t: 'Olinda and Recife, February 1630',
      txt: 'In February 1630, about 7,000 men landed and took Olinda and the port of Recife. The Luso-Brazilians, led by Matias de Albuquerque, held out for five years from the Arraial do Bom Jesus, using ambush tactics. Only in 1635 did the Company control the sugar zone.' },
    { y: 1637, p: [-34.88, -8.06], zoom: 'close', t: 'The rule of Maurice of Nassau',
      txt: 'Between 1637 and 1644, Count John Maurice of Nassau-Siegen governed Dutch Brazil. He lent money to the sugar planters, allowed freedom of worship (the first synagogue in the Americas operated in Recife) and built the town of Mauritsstad. He brought painters such as Frans Post and Albert Eckhout and naturalists such as Piso and Marcgrave; in 1641 his fleet took Luanda to secure enslaved workers.' },
    { y: 1645, p: [-35.1, -8.1], zoom: 'region', t: 'The Pernambucan Insurrection', ev: 'restoration',
      txt: 'Portugal regained its independence in 1640 and signed a truce with the Dutch in Europe. After Nassau left, the Company began to call in the sugar planters’ debts, and in June 1645 they rebelled, led by João Fernandes Vieira and André Vidal de Negreiros. Fighting alongside them were the Indigenous leader Filipe Camarão and the Black commander Henrique Dias, each at the head of his own troops.' },
    { y: 1648, p: [-34.95, -8.17], zoom: 'close', t: 'The battles of Guararapes',
      txt: 'On the Guararapes hills, south of Recife, the rebels defeated the Dutch on 19 April 1648 and again on 19 February 1649. The Dutch were left besieged in Recife, supplied only by sea. The Brazilian Army takes 19 April 1648 as the date of its founding.' },
    { y: 1654, p: [-34.88, -8.06], zoom: 'close', t: 'The surrender of Recife, 1654',
      txt: 'With Holland at war with England and sending no reinforcements, a Portuguese fleet blockaded Recife. On 26 January 1654, the Dutch signed the surrender at Campina do Taborda. Many of Recife’s Jews left; one group reached New Amsterdam, the future New York.' },
    { y: 1661, p: [-59.6, 13.1], zoom: 'continent', t: 'Compensation and sugar in the Caribbean', ev: 'caribbean',
      txt: 'By the Peace of The Hague of 1661, the Netherlands recognized the loss of Brazil in exchange for compensation of 4 million cruzados. Dutch and Jewish settlers who left Pernambuco took capital and techniques to the Antilles, such as Barbados and Martinique; how much this weighed in the growth of Caribbean sugar is debated. Competition from the Antilles brought down the price of Brazilian sugar.' }
  ],

  /* ---------- The gold rush, 1693 ---------- */
  gold: [
    { y: 1674, p: [-44.0, -19.6], zoom: 'region', t: 'Fernão Dias’s bandeira',
      txt: 'With sugar in crisis because of competition from the Antilles, the Portuguese crown encouraged the search for metals and gems. In 1674, Fernão Dias Pais left São Paulo for the backlands of the Cataguases and spent seven years looking for emeralds; he died in 1681 thinking he had found them, but they were tourmalines. His son-in-law Borba Gato and other members of the bandeira (an armed expedition into the interior) stayed in the region.' },
    { y: 1695, p: [-43.8, -19.89], zoom: 'region', t: 'Gold in the Rio das Velhas',
      txt: 'Between 1693 and 1695, bandeirantes from São Paulo found gold in streams of the region that would become Minas Gerais, such as the Rio das Velhas, near Sabará. Who got there first, and where, is debated, because the accounts are later and full of disputes. It was placer gold, panned with bateias (wooden pans) from the riverbeds.' },
    { y: 1698, p: [-43.5, -20.39], zoom: 'close', t: 'The black gold of Vila Rica',
      txt: 'Around 1698, Antônio Dias de Oliveira found gold darkened by iron oxide, ouro preto ("black gold"), on the slopes of Itacolomi. Mining camps sprang up overnight, and famine killed many people in 1697–1698 and 1700–1701, because almost no one farmed. In 1711 the camps were joined into the town of Vila Rica, later Ouro Preto.' },
    { y: 1703, p: [-0.12, 51.5], zoom: 'continent', t: 'Methuen: the gold goes to London', ev: 'methuen',
      txt: 'In 1703, the Methuen Treaty eased the entry of English cloth into Portugal and of Portuguese wine into England. Portugal bought more than it sold and paid the difference with Brazilian gold. Much of that gold ended up in London; how much it helped British industrialization is debated.' },
    { y: 1709, p: [-44.26, -21.13], zoom: 'region', t: 'The War of the Emboabas',
      txt: 'Paulistas, who claimed to own the discoveries, clashed with the outsiders, called emboabas, arriving from Portugal, Bahia and elsewhere. In 1709, near the Rio das Mortes, emboaba troops killed paulistas who had surrendered, in the episode known as the Capão da Traição ("Grove of Treason"). The crown then created the captaincy of São Paulo and Minas do Ouro and tightened its control.' },
    { y: 1710, p: [-43.4, -21.8], zoom: 'region', t: 'The Caminho Novo and the port of Rio',
      txt: 'Around 1707, Garcia Rodrigues Pais, son of Fernão Dias, opened the Caminho Novo ("New Road"), which linked the mines to Rio de Janeiro in a few weeks. Rio became the port for gold and for enslaved people bound for the mines. In 1710 and 1711 the city was attacked by French privateers drawn by its wealth.' },
    { y: 1720, p: [-43.5, -20.39], zoom: 'close', t: 'The quinto, smelting houses and revolt',
      txt: 'The crown collected the quinto (the royal fifth), a fifth of all gold, and decided to make smelting in official houses compulsory. In June 1720, miners in Vila Rica revolted; the governor, the Count of Assumar, had Filipe dos Santos executed in July. At the end of the year, Minas Gerais became a separate captaincy.' },
    { y: 1729, p: [-43.6, -18.24], zoom: 'region', t: 'The diamonds of Tejuco',
      txt: 'In 1729, the crown officially recognized the discovery of diamonds in Serro do Frio, around the camp of Tejuco, today’s Diamantina. The region was sealed off and, from 1771, mining became a royal monopoly. Mining depended on tens of thousands of enslaved Africans, many brought from the Mina Coast.' },
    { y: 1763, p: [-43.25, -22.95], zoom: 'close', t: 'The capital moves to Rio', ev: 'riocapital',
      txt: 'Gold output peaked between the 1730s and 1750s and then fell, as the placer deposits ran out. In 1763, the capital of Brazil moved from Salvador to Rio, the port of the mines and closer to the disputes with Spain in the south. The decline of gold and the collection of back taxes set the stage for the crisis of 1789.' }
  ],

  /* ---------- Industrial Revolution, 1760–1840 ---------- */
  industrialrev: [
    { y: 1709, p: [-2.49, 52.64], zoom: 'close', t: 'Iron smelted with coal',
      txt: 'In 1709, at Coalbrookdale, Abraham Darby began smelting iron with coke, made from mineral coal, instead of charcoal, which had become expensive. Britain had plenty of coal close to the surface and to navigable rivers. Why industrialization began there is much debated: cheap coal, high wages, colonial markets and profits from Atlantic trade are among the explanations.' },
    { y: 1712, p: [-2.08, 52.51], zoom: 'close', t: 'Newcomen’s steam pump',
      txt: 'In 1712, near Dudley, Thomas Newcomen’s engine went into operation, using steam to pump water out of coal mines. It burned a lot of fuel, but at the mines coal was plentiful. With it the mines could go deeper.' },
    { y: 1765, p: [-2.43, 53.75], zoom: 'region', t: 'The spinning jenny in Lancashire',
      txt: 'Cotton cloth from India was in great demand, and English manufacturers tried to imitate it. Around 1764, James Hargreaves invented the spinning jenny, which spun several threads at once. It was still used at home, by families working for merchants.' },
    { y: 1771, p: [-1.56, 53.11], zoom: 'close', t: 'Arkwright’s mill at Cromford',
      txt: 'In 1771, Richard Arkwright set up a spinning mill at Cromford driven by a waterwheel, with hundreds of workers, many of them children, on fixed shifts. It is considered one of the first modern factories. The model spread through the valleys of Lancashire and Derbyshire.' },
    { y: 1776, p: [-1.93, 52.5], zoom: 'close', t: 'Boulton and Watt in Birmingham',
      txt: 'In 1769 James Watt patented a separate condenser that made the steam engine far more efficient. In partnership with Matthew Boulton, in Birmingham, he sold the first engines in 1776, and in the 1780s they began to turn machinery. Factories no longer had to stand next to waterfalls.' },
    { y: 1793, p: [-81.1, 32.08], zoom: 'region', t: 'The cotton gin and slave-grown cotton',
      txt: 'In 1793, in Georgia, Eli Whitney invented a gin that quickly separated the seeds from cotton. English mills bought all the cotton they could get, and the plantations of the southern United States expanded with slave labor. Brazil, especially Maranhão and Pernambuco, also exported cotton at this time.' },
    { y: 1811, p: [-1.15, 52.95], zoom: 'region', t: 'The Luddites break machines',
      txt: 'Between 1811 and 1816, weavers and stocking-makers in Nottinghamshire, Yorkshire and Lancashire smashed looms in protest against low wages and deskilled work. The government sent thousands of soldiers and made machine-breaking a crime punishable by death. In the factory towns, long hours and child labor led to the first factory laws.' },
    { y: 1830, p: [-2.6, 53.45], zoom: 'region', t: 'The Liverpool–Manchester railway',
      txt: 'On 15 September 1830, the railway opened between Liverpool, the cotton port, and Manchester, the center of the spinning mills. It was the first line with steam locomotives carrying passengers and freight on a regular timetable. Within twenty years Britain had thousands of kilometers of track.' },
    { y: 1845, p: [-0.3, 51.4], zoom: 'continent', t: 'British pressure on Brazil', ev: 'aberdeen',
      txt: 'Britain, the greatest industrial and naval power, had banned its own slave trade in 1807 and pressed other countries to do the same. In 1845, the Aberdeen Act authorized the seizure of Brazilian slave ships. Whether the motive was humanitarian, economic or both, historians have long debated.' }
  ],

  /* ---------- Minas Conspiracy, 1789 ---------- */
  minasconspiracy: [
    { y: 1776, p: [-75.16, 39.95], zoom: 'region', t: 'The example of the thirteen colonies', ev: 'usa',
      txt: 'On 4 July 1776, the thirteen English colonies declared independence in Philadelphia and later formed a republic. A French collection of the American constitutions, the Recueil des loix constitutives, circulated among the future conspirators in Minas. It showed that a colony could break away from the mother country.' },
    { y: 1785, p: [-43.5, -20.39], zoom: 'region', t: 'Falling gold and banned manufactures',
      txt: 'Gold output was falling, and Minas no longer paid the annual quota of 100 arrobas (about 1.5 tonnes) demanded by the crown. On 5 January 1785, a decree of Queen Maria I banned the making of fine cloth in Brazil. The Minas elite, in debt to the royal treasury, feared the derrama, the collection of all arrears at once.' },
    { y: 1787, p: [4.36, 43.84], zoom: 'close', t: 'A student seeks out Jefferson',
      txt: 'In 1787, José Joaquim da Maia, a Brazilian student in Montpellier, met Thomas Jefferson, then the United States envoy to France, in Nîmes. He asked for support for a revolt in Brazil; Jefferson replied that he had no authority to promise anything. Maia died soon after, but word of the conversation reached Minas through other students.' },
    { y: 1788, p: [-43.5, -20.39], zoom: 'close', t: 'The conspirators of Vila Rica',
      txt: 'In 1788 the new governor arrived, the Viscount of Barbacena, with orders to impose the derrama. At meetings in Vila Rica, poets such as Tomás Antônio Gonzaga and Cláudio Manuel da Costa, priests, officers and tax contractors planned an uprising for the day of the levy. Ensign Joaquim José da Silva Xavier, known as Tiradentes, was the most active in recruiting people.' },
    { y: 1789, p: [-43.5, -20.39], zoom: 'close', t: 'The betrayal, March 1789',
      txt: 'In March 1789, Barbacena called off the derrama, and Colonel Joaquim Silvério dos Reis, a debtor of the crown, denounced the conspiracy in exchange for having his debts forgiven. The plan foresaw a republic, with its capital in São João del-Rei, and a university in Vila Rica. In general, it did not include ending slavery.' },
    { y: 1789, p: [-43.18, -22.9], zoom: 'close', t: 'Arrests and inquiry',
      txt: 'Tiradentes, who was in Rio, was arrested on 10 May 1789. The other conspirators were arrested in Minas; Cláudio Manuel da Costa was found dead in prison on 4 July, and the official version of suicide is disputed. Two judicial inquiries (devassas), one in Minas and one in Rio, questioned the accused for almost three years.' },
    { y: 1792, p: [-43.18, -22.905], zoom: 'close', t: 'Tiradentes on the gallows, 21 April',
      txt: 'In April 1792, eleven defendants were sentenced to death, but a letter from the queen commuted the sentences to exile in Africa, except for Tiradentes’s. He was hanged in Rio on 21 April 1792; his body was quartered and displayed along the Caminho Novo, and his head in Vila Rica. Gonzaga was sent to Mozambique.' },
    { y: 1798, p: [-38.51, -12.97], zoom: 'close', t: 'The Bahian Conspiracy', ev: 'bahia1798',
      txt: 'Six years later, in Salvador, tailors, soldiers and artisans, many of them Black and of mixed race, posted bulletins calling for a republic, equality and an end to Portuguese rule. The crackdown of 1798 led to four of them being hanged the following year. Tiradentes, nearly forgotten under the Empire, was turned into a national hero by the Republic from 1889 on.' }
  ],

  /* ---------- French Revolution, 1789 ---------- */
  france1789: [
    { y: 1789, p: [2.12, 48.8], zoom: 'close', t: 'The Estates-General at Versailles',
      txt: 'France was in debt, partly from its aid to American independence, and the harvest of 1788 had been poor. Louis XVI summoned the Estates-General, which opened at Versailles on 5 May 1789. On 17 June, the deputies of the Third Estate declared themselves the National Assembly and, on 20 June, swore not to disband until they had given the country a constitution.' },
    { y: 1789, p: [2.369, 48.853], zoom: 'close', t: 'The storming of the Bastille, 14 July',
      txt: 'With troops massed around Paris, the city’s residents went looking for weapons and gunpowder. On 14 July 1789, they stormed the Bastille, a fortress-prison in the east of the city. In the countryside, peasants attacked châteaux and burned records of seigneurial dues, in what was called the Great Fear.' },
    { y: 1789, p: [2.12, 48.8], zoom: 'close', t: 'End of privileges and the Declaration',
      txt: 'On the night of 4 August, the Assembly abolished feudal privileges, and on 26 August it adopted the Declaration of the Rights of Man and of the Citizen. On 5 and 6 October, thousands of Parisian women marched to Versailles and forced the king to move to the capital. Historians have argued for two centuries over whether it was a bourgeois revolution, as the Marxist reading held, or mainly a political one, as the revisionists say.' },
    { y: 1791, p: [5.03, 49.23], zoom: 'close', t: 'The flight to Varennes',
      txt: 'On 20 June 1791, the royal family fled Paris in disguise, heading for the eastern border. They were recognized and arrested at Varennes the next day, and brought back. Trust in the king collapsed, and the republican movement grew.' },
    { y: 1792, p: [4.77, 49.08], zoom: 'region', t: 'War, Valmy and the Republic',
      txt: 'In April 1792, France declared war on Austria, and on 10 August the people of Paris stormed the Tuileries Palace and the king was deposed. On 20 September, a French army stopped the Prussians at Valmy. On the 21st the Convention abolished the monarchy, and the Republic was proclaimed.' },
    { y: 1793, p: [2.321, 48.865], zoom: 'close', t: 'The king’s execution and the Terror',
      txt: 'Louis XVI was guillotined on 21 January 1793, on today’s Place de la Concorde. Facing foreign war and internal revolts, such as the one in the Vendée, Robespierre’s Committee of Public Safety ruled through the Terror, with about 17,000 official executions. On 4 February 1794, under pressure from the revolt in Saint-Domingue, the Convention abolished slavery in the colonies.' },
    { y: 1794, p: [2.35, 48.86], zoom: 'close', t: 'Thermidor and the Directory',
      txt: 'On 27 July 1794 (9 Thermidor), Robespierre was overthrown, and he was guillotined the next day. A new constitution created the Directory in 1795, an unstable government that depended more and more on the army. Generals who won the wars gained political weight.' },
    { y: 1799, p: [2.22, 48.84], zoom: 'close', t: 'The coup of 18 Brumaire', ev: 'napoleon',
      txt: 'On 9 and 10 November 1799 (18 and 19 Brumaire), General Napoleon Bonaparte staged a coup and dispersed the deputies at Saint-Cloud. He became First Consul, with almost absolute powers. The ideas of popular sovereignty and equal rights kept circulating, including in the Americas.' }
  ],

  /* ---------- Haitian Revolution, 1791–1804 ---------- */
  haiti: [
    { y: 1790, p: [-72.2, 19.76], zoom: 'close', t: 'The richest colony and Ogé’s revolt',
      txt: 'Saint-Domingue, the French part of the island of Hispaniola, produced much of the world’s sugar and coffee, with about 500,000 enslaved people, some 30,000 whites and almost as many free people of color. With the revolution in France, Vincent Ogé, a free man of color, demanded political rights and took up arms in October 1790. He was executed in Cap-Français in February 1791.' },
    { y: 1791, p: [-72.22, 19.69], zoom: 'region', t: 'The uprising of the Northern Plain',
      txt: 'According to tradition, at a ceremony at Bois Caïman on 14 August 1791, enslaved people swore to rebel; the details are debated. On the night of 22 August the uprising began on the Northern Plain, and within a few weeks hundreds of plantations were burned. It was the largest slave revolt in the Americas.' },
    { y: 1793, p: [-72.2, 19.76], zoom: 'close', t: 'Abolition in the north and a war of empires',
      txt: 'Spain and Great Britain, at war with France, invaded the colony. To win over the rebels, the French commissioner Léger-Félicité Sonthonax abolished slavery in the north on 29 August 1793. Toussaint Louverture, a formerly enslaved man and military leader, was then fighting on the Spanish side.' },
    { y: 1794, p: [2.35, 48.86], zoom: 'continent', t: 'Paris abolishes slavery', ev: 'france1789',
      txt: 'On 4 February 1794, the Convention, in Paris, abolished slavery in all French colonies and granted citizenship to the formerly enslaved. Toussaint Louverture switched to the French side a few months later. In 1798 the British withdrew, beaten also by yellow fever.' },
    { y: 1801, p: [-69.9, 18.47], zoom: 'region', t: 'Toussaint governs the island',
      txt: 'In 1801, Toussaint occupied Santo Domingo, the Spanish part of the island, and issued a constitution that made him governor for life. He kept slavery abolished, but forced the formerly enslaved to work on the plantations to keep exports going. Formally, the island remained tied to France.' },
    { y: 1802, p: [-72.2, 19.76], zoom: 'region', t: 'Napoleon sends Leclerc', ev: 'napoleon',
      txt: 'In February 1802, Napoleon sent an army of more than 20,000 men, led by his brother-in-law Charles Leclerc, to retake the colony; in May, a law restored slavery in the other French colonies. Toussaint was arrested through treachery in June and taken to the Fort de Joux, in the Jura Mountains, where he died on 7 April 1803. The news that slavery had returned to Guadeloupe rekindled the war.' },
    { y: 1803, p: [-72.21, 19.74], zoom: 'close', t: 'Vertières, 18 November',
      txt: 'Jean-Jacques Dessalines united the Black and mixed-race troops against the French, who were being wiped out by yellow fever; Leclerc died in 1802. On 18 November 1803, at the battle of Vertières, near Cap-Français, General Rochambeau was defeated and surrendered. The same year, having lost the colony, Napoleon sold Louisiana to the United States.' },
    { y: 1804, p: [-72.69, 19.45], zoom: 'close', t: 'Independence at Gonaïves',
      txt: 'On 1 January 1804, at Gonaïves, Dessalines declared independence and gave the country the Indigenous name of Haiti. It was the first country in the Americas to abolish slavery for good. Between February and April, most of the remaining whites were killed on Dessalines’s orders.' },
    { y: 1825, p: [-72.34, 18.54], zoom: 'region', t: 'The independence debt',
      txt: 'In 1825, with warships off Port-au-Prince, France demanded 150 million francs to recognize independence, later reduced to 90 million; Haiti paid this debt and its interest for more than a century. Sugar output fell, and Cuba and Brazil took its place. In Brazil, fear of "a new Haiti" weighed on the decisions of the slaveholding elites.' }
  ],

  /* ---------- Napoleon, 1799–1815 ---------- */
  napoleon: [
    { y: 1793, p: [5.93, 43.12], zoom: 'close', t: 'The artillery captain at Toulon',
      txt: 'Born in Corsica in 1769, Napoleon Bonaparte was an artillery officer when the revolution opened careers to non-nobles. In December 1793, his artillery plan helped retake Toulon from the English. He was promoted to general at 24.' },
    { y: 1796, p: [9.5, 45.31], zoom: 'region', t: 'The Italian campaign',
      txt: 'In 1796 and 1797, at the head of the Army of Italy, Napoleon defeated the Austrians at Lodi, Arcole and Rivoli. He imposed the Peace of Campo Formio in October 1797 and created allied republics in northern Italy. The army’s newspapers made him a hero in France.' },
    { y: 1798, p: [31.13, 29.98], zoom: 'region', t: 'The Egyptian expedition',
      txt: 'In 1798, Napoleon invaded Egypt to strike at British trade with India and defeated the Mamluks at the Battle of the Pyramids, on 21 July. On 1 August, Admiral Nelson destroyed the French fleet at Aboukir, and the army was trapped. The expedition’s scientists found the Rosetta Stone, later deciphered by Champollion.' },
    { y: 1799, p: [2.22, 48.84], zoom: 'close', t: 'Brumaire and the Civil Code',
      txt: 'Napoleon returned alone to France and, in November 1799, staged the coup of 18 Brumaire. As First Consul, he came to terms with the Church, centralized the administration and, in 1804, published the Civil Code, which served as a model for the laws of many countries, including in Latin America. On 2 December 1804 he crowned himself emperor in Notre-Dame.' },
    { y: 1805, p: [16.76, 49.13], zoom: 'region', t: 'Trafalgar and Austerlitz',
      txt: 'On 21 October 1805, Nelson’s British navy destroyed the Franco-Spanish fleet at Trafalgar, and Britain gained command of the seas. On land, on 2 December, Napoleon defeated the Russians and Austrians at Austerlitz, in Moravia. In 1806 he defeated Prussia and entered Berlin.' },
    { y: 1806, p: [13.4, 52.52], zoom: 'continent', t: 'The Continental Blockade', ev: 'blockade',
      txt: 'Unable to invade Britain, Napoleon decreed in Berlin, on 21 November 1806, that the ports of the continent were closed to British trade. Portugal, England’s old ally, tried to stay neutral. The Peace of Tilsit with Russia, in 1807, left Napoleon free to put pressure on it.' },
    { y: 1807, p: [-9.2, 38.7], zoom: 'region', t: 'Junot in Lisbon, the court at sea', ev: 'junot',
      txt: 'In November 1807, a French army led by Junot crossed Spain and entered Portugal. On 29 November the royal family left for Brazil under British escort, and Junot entered Lisbon the next day. In 1808 Napoleon put his brother Joseph on the throne of Spain, which set off the crisis of the Spanish colonies in America.' },
    { y: 1812, p: [37.62, 55.75], zoom: 'continent', t: 'The Russian campaign',
      txt: 'In June 1812, Napoleon invaded Russia with about 600,000 men. He won at Borodino and entered Moscow on 14 September, but the city was set on fire and the tsar would not negotiate. On the retreat, through hunger, cold and attacks, most of the army died or deserted; perhaps a few tens of thousands made it back.' },
    { y: 1815, p: [4.41, 50.68], zoom: 'region', t: 'Leipzig, Elba and Waterloo', ev: 'vienna',
      txt: 'Defeated at Leipzig in 1813, Napoleon abdicated in April 1814 and was sent to the island of Elba. He escaped in March 1815, ruled for a hundred days and was beaten by the British and Prussians at Waterloo, on 18 June. Exiled to Saint Helena, he died in 1821, while the Congress of Vienna redrew the map of Europe.' }
  ],

  /* ---------- The court in Rio, 1808 ---------- */
  court: [
    { y: 1806, p: [13.4, 52.52], zoom: 'continent', t: 'Portugal between France and England', ev: 'blockade',
      txt: 'With the Continental Blockade of 1806, Napoleon demanded that Portugal close its ports to the English, arrest English subjects and seize their property. The Prince Regent, Dom João, put off the decision as long as he could. The idea of moving the court to Brazil in case of invasion was an old one and was negotiated in secret with England.' },
    { y: 1807, p: [-9.2, 38.7], zoom: 'close', t: 'Embarking in Lisbon, 29 November', ev: 'junot',
      txt: 'In October 1807, France and Spain agreed to divide Portugal, and Junot’s troops entered the country. The royal family, ministers, officials and servants boarded in a hurry; the fleet left the Tagus on 29 November, escorted by British ships. How many people made the voyage is debated: estimates range from a few thousand to 15,000.' },
    { y: 1808, p: [-25.0, 15.0], zoom: 'world', t: 'The crossing',
      txt: 'A storm near Madeira scattered the ships in December. Passengers traveled crammed together, with little water; it is said that, because of lice, ladies of the court shaved their heads. Part of the fleet went on to Rio, and the prince’s ship went to Bahia.' },
    { y: 1808, p: [-38.51, -12.97], zoom: 'close', t: 'Salvador and the opening of the ports', ev: 'openports',
      txt: 'On 22 January 1808, Dom João reached Salvador. On 28 January he signed the royal charter that opened Brazil’s ports to trade with friendly nations, in practice with Great Britain. Portugal’s trade monopoly over the colony was over.' },
    { y: 1808, p: [-43.17, -22.9], zoom: 'close', t: 'Arrival in Rio, March 1808', ev: 'court',
      txt: 'The court reached Rio on 7 March 1808, and Dom João came ashore the next day. Houses were requisitioned for the newcomers with the initials P.R. (Príncipe Regente, "Prince Regent") painted on the door, which locals read as "ponha-se na rua" ("get out into the street"). Within a few months came the Royal Press, the Botanical Garden and the Bank of Brazil.' },
    { y: 1809, p: [-52.33, 4.93], zoom: 'region', t: 'The conquest of Cayenne',
      txt: 'In response to the invasion of Portugal, Luso-Brazilian troops backed by British ships took French Guiana, which surrendered on 12 January 1809. Cayenne stayed under Portuguese rule until 1817. From its botanical garden came seedlings, such as those of Cayenne sugarcane, taken to Rio.' },
    { y: 1810, p: [-43.05, -22.95], zoom: 'close', t: 'The treaties of 1810', ev: 'treaties1810',
      txt: 'On 19 February 1810, Dom João signed treaties with Great Britain that gave British goods a 15% tariff, lower than the one charged on the Portuguese themselves. He also pledged to limit the slave trade. It was the price of British protection.' },
    { y: 1815, p: [-43.3, -22.85], zoom: 'close', t: 'United Kingdom of Portugal and Brazil', ev: 'unitedkingdom',
      txt: 'On 16 December 1815, after Napoleon’s fall, Brazil was raised to a kingdom united with Portugal and the Algarves. This way the court could stay in Rio and the prince could sit at the Congress of Vienna as a sovereign. When Queen Maria I died in 1816, Dom João became king, acclaimed in Rio in 1818.' },
    { y: 1821, p: [-9.05, 38.75], zoom: 'region', t: 'The Porto revolution and the return', ev: 'return',
      txt: 'In August 1820, a liberal revolution in Porto summoned the Cortes (parliament) and demanded the king’s return. John VI left Rio on 26 April 1821 and left his son Pedro as regent. The court’s thirteen years in Rio had transformed the city and paved the way for independence.' }
  ],

  /* ---------- Independence, 1822 ---------- */
  independence: [
    { y: 1820, p: [-8.61, 41.15], zoom: 'region', t: 'The liberal revolution in Porto', ev: 'porto',
      txt: 'On 24 August 1820, soldiers and merchants in Porto rebelled against the regency government and against British dominance over Portugal. They summoned the Cortes (parliament) to write a constitution and demanded the return of John VI. Provinces of Brazil, such as Pará and Bahia, joined the movement.' },
    { y: 1821, p: [-43.18, -22.9], zoom: 'close', t: 'The king leaves, Pedro stays', ev: 'return',
      txt: 'On 26 April 1821, John VI went back to Lisbon with about 4,000 people and left his son, Dom Pedro, as regent of Brazil. He is said to have advised Pedro to put the crown on his own head before some adventurer did; the line may be legend. Rio lost part of the court and of the bank’s money.' },
    { y: 1821, p: [-9.14, 38.71], zoom: 'region', t: 'The Cortes want to undo the kingdom',
      txt: 'Brazilian deputies were a minority in the Cortes in Lisbon. In September and October 1821, the Cortes placed the provinces of Brazil directly under Lisbon, ordered the closing of courts created in Rio and demanded Pedro’s return. To the elites of Rio, São Paulo and Minas, this looked like a return to colonial status.' },
    { y: 1822, p: [-43.18, -22.9], zoom: 'close', t: 'The Dia do Fico, 9 January',
      txt: 'Backed by petitions from Rio, São Paulo and Minas, Pedro announced on 9 January 1822 that he would stay in Brazil, the Dia do Fico ("I Stay Day"). He brought José Bonifácio into the ministry and began to require that orders from Lisbon take effect only with his "cumpra-se" ("let it be carried out"). In June he summoned a constituent assembly for Brazil.' },
    { y: 1822, p: [-46.61, -23.59], zoom: 'close', t: 'The Ipiranga, 7 September',
      txt: 'On 7 September 1822, on his way back from Santos to São Paulo, Pedro received letters from Lisbon annulling his acts, and others from José Bonifácio and Princess Leopoldina urging a break. On the banks of the Ipiranga stream, he declared Brazil separate from Portugal. The scene of the cry was much embellished later, including in Pedro Américo’s painting of 1888.' },
    { y: 1822, p: [-43.18, -22.9], zoom: 'close', t: 'Acclamation and coronation in Rio',
      txt: 'Pedro was acclaimed emperor in Rio on 12 October and crowned on 1 December 1822. Brazil was born as a monarchy, with the heir to the Portuguese crown on the throne and slavery intact. Many provinces, however, were still held by Portuguese troops.' },
    { y: 1823, p: [-38.51, -12.97], zoom: 'region', t: 'The war in Bahia, 2 July',
      txt: 'In Salvador, fighting began in February 1822, when Portuguese troops killed the abbess Joana Angélica in a convent. Militias from the Recôncavo, volunteers such as Maria Quitéria and troops sent from Rio besieged the city, and on 2 July 1823 the Portuguese left. In Maranhão and Pará, Admiral Cochrane’s squadron forced the provinces to join in 1823, with acts of violence such as the deaths of prisoners in the hold of the brig Palhaço, in Belém.' },
    { y: 1824, p: [-34.95, -8.1], zoom: 'region', t: 'An imposed constitution and the backlash', ev: 'equatorconfederation',
      txt: 'In November 1823, Pedro dissolved the constituent assembly and, on 25 March 1824, imposed a constitution with the Moderating Power, which gave him the final say. In July, Pernambuco and other northeastern provinces proclaimed the Confederation of the Equator, crushed by the end of the year. Frei Caneca was executed in January 1825.' },
    { y: 1825, p: [-43.18, -22.9], zoom: 'continent', t: 'Portugal recognizes it, with English mediation',
      txt: 'On 29 August 1825, with British mediation, Portugal recognized independence through the Treaty of Rio de Janeiro. In exchange, Brazil took on a debt of 2 million pounds that Portugal owed to London banks. Britain called in the favor with renewed trade advantages and a promise to end the slave trade.' }
  ],

  /* ---------- Paraguayan War, 1864–1870 ---------- */
  paraguaywar: [
    { y: 1864, p: [-58.08, -32.32], zoom: 'region', t: 'The crisis in Uruguay and Paysandú',
      txt: 'Uruguay was in a civil war between the Blancos, in government and allied with Paraguay, and Venancio Flores’s Colorados, backed by Brazil and Argentina. In October 1864, Brazilian troops invaded Uruguay to support Flores. The town of Paysandú, defended by the Blancos, fell on 2 January 1865 after a siege.' },
    { y: 1864, p: [-57.63, -25.28], zoom: 'continent', t: 'The Marquês de Olinda and Mato Grosso',
      txt: 'Francisco Solano López had warned that intervention in Uruguay would be a cause for war. On 12 November 1864, the Paraguayans seized the Brazilian steamer Marquês de Olinda on the Paraguay River, carrying the president of the province of Mato Grosso. In December they invaded southern Mato Grosso, taking the fort of Coimbra and Corumbá.' },
    { y: 1865, p: [-58.83, -27.47], zoom: 'region', t: 'Corrientes and the Triple Alliance',
      txt: 'When Argentina refused passage to his troops, López declared war on it too and occupied Corrientes in April 1865. On 1 May, Brazil, Argentina and Flores’s new Uruguayan government signed the Treaty of the Triple Alliance in Buenos Aires. A secret clause called for the overthrow of López and new borders for Paraguay.' },
    { y: 1865, p: [-57.09, -29.75], zoom: 'region', t: 'Riachuelo and Uruguaiana',
      txt: 'On 11 June 1865, Admiral Barroso’s Brazilian squadron destroyed the Paraguayan fleet at the naval battle of Riachuelo, on the Paraná River. A Paraguayan column that had invaded Rio Grande do Sul surrendered at Uruguaiana on 18 September, with Pedro II present. From then on the war moved into Paraguayan territory.' },
    { y: 1866, p: [-58.4, -27.25], zoom: 'region', t: 'Tuyutí and the disaster at Curupayty',
      txt: 'On 24 May 1866, the allies won at Tuyutí, the largest pitched battle in South American history, with thousands dead. On 22 September, a frontal assault on the trenches of Curupayty ended in disaster for the allies. The war stalled for more than a year, with cholera in the camps, and the Marquis of Caxias took command.' },
    { y: 1868, p: [-58.5, -27.07], zoom: 'region', t: 'The fall of Humaitá',
      txt: 'Humaitá, a fortress that blocked the Paraguay River, was passed by Brazilian ironclads in February 1868 and evacuated in July; the allies occupied it in August. In December, in the battles of the Dezembrada ("December campaign": Itororó, Avaí, Lomas Valentinas), the Paraguayan army was nearly destroyed. López escaped into the interior.' },
    { y: 1869, p: [-57.63, -25.28], zoom: 'region', t: 'Asunción occupied and the Cordillera',
      txt: 'Brazilian troops entered Asunción on 1 January 1869, and the city was sacked. Caxias considered the war over, but the Count of Eu, Pedro II’s son-in-law, took command to pursue López through the hills. At the battle of Acosta Ñu, on 16 August 1869, many Paraguayan boys who had been forcibly recruited were killed.' },
    { y: 1870, p: [-56.0, -22.65], zoom: 'region', t: 'Cerro Corá, 1 March 1870',
      txt: 'With a few men, women and children, López retreated to the northeast of the country. On 1 March 1870, at Cerro Corá, he was caught by Brazilian troops and killed. Paraguay was left occupied, lost territory to Brazil and Argentina, and estimates of the dead range from less than a fifth to more than half of the population.' },
    { y: 1871, p: [-43.25, -22.85], zoom: 'continent', t: 'The weight of victory on the Empire', ev: 'freewomb',
      txt: 'Brazil spent a great deal of money and lost tens of thousands of men, including enslaved men freed to fight and the Voluntários da Pátria ("Volunteers of the Fatherland"). The army came out of the war stronger and dissatisfied with civilian politicians, and slavery came to be seen as a weakness of the country. The Law of the Free Womb came in 1871, and the Republican Party was founded in 1870.' }
  ],

  /* ---------- Berlin Conference, 1884–1885 ---------- */
  berlin1884: [
    { y: 1876, p: [4.35, 50.85], zoom: 'region', t: 'Leopold II and the "science" of the Congo',
      txt: 'In September 1876, King Leopold II of Belgium gathered geographers and explorers in Brussels for a conference on Africa and created an association presented as scientific and anti-slavery. Behind it, Leopold wanted a private colony. European industry was looking for rubber, palm oil, ivory and markets, and quinine already protected Europeans from malaria.' },
    { y: 1880, p: [15.28, -4.27], zoom: 'region', t: 'Stanley and Brazza on the Congo River',
      txt: 'Between 1879 and 1884, Henry Morton Stanley, working for Leopold, built roads and posts on the lower Congo and had local chiefs sign hundreds of treaties. In 1880, the Frenchman Pierre Savorgnan de Brazza signed a treaty with King Makoko of the Teke, on the north bank of the river, where Brazzaville would later rise. The dispute over the Congo led to the conference.' },
    { y: 1882, p: [31.83, 30.54], zoom: 'region', t: 'Britain occupies Egypt',
      txt: 'Egypt had been in debt to European banks since the building of the Suez Canal, opened in 1869. In 1882, after a nationalist revolt led by Colonel Urabi, British troops defeated him at Tel el-Kebir, on 13 September, and occupied the country. France felt wronged, and rivalry between the powers spread across Africa.' },
    { y: 1884, p: [15.16, -26.65], zoom: 'region', t: 'Germany joins the race',
      txt: 'In 1884, Chancellor Otto von Bismarck declared German protectorates over the coast of Angra Pequena (Lüderitz), in southwest Africa, in April, and over Togo and Cameroon in July. Portugal claimed the mouth of the Congo on the basis of old rights, and Britain at one point backed it. Bismarck proposed a conference to agree on the rules.' },
    { y: 1884, p: [13.38, 52.51], zoom: 'close', t: 'The conference on the Wilhelmstrasse',
      txt: 'From 15 November 1884 to 26 February 1885, representatives of 14 countries met at Bismarck’s residence in Berlin; no African was invited. The General Act declared free trade in the Congo basin and free navigation on the Congo and the Niger, and required effective occupation for new coastal possessions to be recognized. The conference did not divide up the map of Africa, but it gave the race its rules.' },
    { y: 1885, p: [18.26, 0.05], zoom: 'continent', t: 'The Congo Free State', ev: 'congofreestate',
      txt: 'During the conference, the powers recognized Leopold’s association, which in 1885 became the Congo Free State, the king’s personal property. To extract rubber, agents of the state and of the companies imposed quotas, hostage-taking, mutilation and massacres. International outcry led Belgium to take over the colony in 1908.' },
    { y: 1890, p: [-9.14, 38.71], zoom: 'continent', t: 'The Pink Map and the ultimatum',
      txt: 'Portugal drew the "Pink Map", which would link Angola to Mozambique across the interior of Africa. On 11 January 1890, Britain, which wanted a corridor from the Cape to Cairo, issued an ultimatum, and Portugal backed down. The humiliation shook the Portuguese monarchy.' },
    { y: 1896, p: [38.9, 14.17], zoom: 'region', t: 'Adwa: Ethiopia defeats Italy', ev: 'adwa',
      txt: 'Italy claimed that an 1889 treaty made Ethiopia its protectorate; Emperor Menelik II denied it. On 1 March 1896, the Ethiopian army defeated the Italians at Adwa. Ethiopia stayed independent, and the victory became a symbol for anti-colonial movements.' },
    { y: 1904, p: [17.24, -20.5], zoom: 'region', t: 'The Herero and Nama genocide',
      txt: 'In German South West Africa, the Herero rose up in 1904 against the loss of their land and cattle. After the battle of Waterberg, in August, General von Trotha ordered all Herero to be killed or driven into the desert; the same was later done to the Nama. Most of the Herero died, and in 2021 Germany recognized the massacre as genocide.' }
  ],

  /* ---------- Abolition, 1888 ---------- */
  abolition: [
    { y: 1850, p: [-43.1, -22.85], zoom: 'region', t: 'The end of the slave trade', ev: 'eusebio',
      txt: 'With the Eusébio de Queirós Law of 1850, the trade in Africans ended within a few years. Coffee planters began buying enslaved people from the Northeast and the South, in a large internal trade toward the Southeast. Slavery was still legal, but with no new arrivals from Africa the enslaved population began to shrink.' },
    { y: 1871, p: [-43.25, -22.85], zoom: 'close', t: 'The Law of the Free Womb', ev: 'freewomb',
      txt: 'On 28 September 1871, under the cabinet of the Viscount of Rio Branco, the Law of the Free Womb declared free the children of enslaved women born from then on. In practice, masters could use these children’s labor until age 21. The law also created a fund for manumissions and recognized the right of enslaved people to buy their freedom.' },
    { y: 1880, p: [-46.63, -23.55], zoom: 'region', t: 'The abolitionist campaign',
      txt: 'In the 1870s and 1880s, the lawyer Luiz Gama, who had himself been sold as a slave as a child, won the freedom of hundreds of people in the courts of São Paulo, using the law of 1831. In 1880, Joaquim Nabuco and André Rebouças founded the Brazilian Anti-Slavery Society in Rio. Newspapers, lectures and associations spread the campaign through the cities.' },
    { y: 1884, p: [-38.52, -3.72], zoom: 'region', t: 'Ceará and Amazonas free their slaves',
      txt: 'In 1881, the raft fishermen (jangadeiros) of Fortaleza, led by Francisco José do Nascimento, the "Sea Dragon", refused to carry enslaved people out to the ships bound for the Southeast. On 25 March 1884, Ceará declared slavery abolished in its territory, followed by Amazonas in July. Abolitionists began to call Ceará the "Land of Light".' },
    { y: 1885, p: [-43.18, -22.9], zoom: 'close', t: 'The Sexagenarian Law',
      txt: 'On 28 September 1885, the Saraiva-Cotegipe Law freed enslaved people over 60, but required them to work three more years as compensation. Abolitionists saw it as a ploy to delay abolition. The law also raised the penalties for helping people escape.' },
    { y: 1887, p: [-46.34, -23.95], zoom: 'region', t: 'Mass escapes and Jabaquara',
      txt: 'In 1887 and 1888, thousands of enslaved people left the plantations of western São Paulo, often helped by Antônio Bento’s caifazes (abolitionist activists). In Santos, the Jabaquara quilombo (runaway community) took in the fugitives, who found work at the port. In October 1887, the Military Club asked that the army not be used to capture runaways, and many planters began freeing their slaves to keep them as workers.' },
    { y: 1888, p: [-43.174, -22.903], zoom: 'close', t: 'The Golden Law, 13 May', ev: 'abolition',
      txt: 'In March 1888, the cabinet of the Baron of Cotegipe fell and João Alfredo formed a government charged with abolition. The bill, only two articles long, passed the Chamber and the Senate and was signed by Princess Isabel at the Paço da Cidade, in Rio, on 13 May. There were street celebrations for days; about 700,000 people were freed, with no compensation for the masters and no land for the freed.' },
    { y: 1889, p: [-43.19, -22.9], zoom: 'close', t: 'Planters without compensation', ev: 'republic',
      txt: 'Planters in the Paraíba Valley, who had expected compensation, withdrew their support for the monarchy, and many became the "republicans of 14 May". In the coffee lands of São Paulo, the provincial government was already subsidizing the arrival of European immigrants to replace the enslaved. A year and a half after the Golden Law, the monarchy fell.' }
  ],

  /* ---------- Proclamation of the Republic, 1889 ---------- */
  republic: [
    { y: 1870, p: [-43.18, -22.9], zoom: 'close', t: 'The Republican Manifesto',
      txt: 'On 3 December 1870, right after the Paraguayan War, dissident Liberal politicians published the Republican Manifesto in Rio, in the newspaper A República. The text called for federalism and criticized the Moderating Power, but said nothing about slavery. The party grew slowly in the following decades.' },
    { y: 1873, p: [-47.3, -23.26], zoom: 'close', t: 'The Itu Convention',
      txt: 'On 18 April 1873, coffee planters and lawyers met in Itu and founded the São Paulo Republican Party. They wanted autonomy for the provinces, which would keep more of the taxes, at a time when São Paulo was growing rich on coffee. It was the best-organized republican group in the country.' },
    { y: 1887, p: [-43.165, -22.955], zoom: 'close', t: 'The Military Question and the positivists',
      txt: 'After the Paraguayan War, army officers felt scorned by the politicians. Between 1884 and 1887, punishments of officers who had spoken out in the press set off the Military Question, and in 1887 the Military Club was founded, with Deodoro da Fonseca as president. At the Military School of Praia Vermelha, Benjamin Constant taught positivism, which called for a strong republic.' },
    { y: 1888, p: [-43.174, -22.903], zoom: 'close', t: 'Abolition without compensation', ev: 'abolition',
      txt: 'The Golden Law of 13 May 1888 gave no compensation to the masters. Some planters, especially in the Paraíba Valley, came to support the republic. The monarchy gained popularity among the freed, but lost its base among the property owners.' },
    { y: 1889, p: [-43.168, -22.897], zoom: 'close', t: 'The Ilha Fiscal ball, 9 November',
      txt: 'On 9 November 1889, the government held a grand ball on Ilha Fiscal, in Guanabara Bay, in honor of the officers of a Chilean ship. It is remembered as the last ball of the Empire. At the same time, republican officers and civilians such as Quintino Bocaiúva and Rui Barbosa were plotting with Deodoro.' },
    { y: 1889, p: [-43.19, -22.905], zoom: 'close', t: '15 November at the Campo de Santana', ev: 'republic',
      txt: 'On the morning of 15 November, Deodoro, who was ill, rode at the head of the troops to army headquarters at the Campo de Santana and deposed the cabinet of the Viscount of Ouro Preto. It is not clear whether he meant to overthrow the monarchy when he left home. In the afternoon, at the City Council, José do Patrocínio and others proclaimed the republic, and that night a provisional government was formed.' },
    { y: 1889, p: [-43.17, -22.95], zoom: 'region', t: 'The imperial family’s exile',
      txt: 'Pedro II was ordered to leave the country and sailed with his family for Europe before dawn on 17 November 1889. There was no armed resistance. The former emperor died in Paris on 5 December 1891.' },
    { y: 1891, p: [-43.19, -22.9], zoom: 'close', t: 'The Constitution of 1891',
      txt: 'On 24 February 1891, an assembly adopted the first republican constitution: federalism, separation of Church and State and the vote for literate men, which excluded the majority. Deodoro was elected president by Congress, clashed with it and shut it down in November. He resigned days later, and the vice president, Floriano Peixoto, took over.' },
    { y: 1893, p: [-53.1, -30.0], zoom: 'continent', t: 'Revolts against the new regime',
      txt: 'In 1893 the Federalist Revolution broke out in Rio Grande do Sul, and the Navy Revolt in Guanabara Bay. Floriano crushed both harshly and earned the nickname "Iron Marshal". With Prudente de Morais, elected in 1894, the São Paulo planters reached the presidency.' }
  ],

  /* ---------- Canudos, 1896–1897 ---------- */
  canudos: [
    { y: 1874, p: [-39.29, -5.2], zoom: 'region', t: 'The pilgrim Antônio Conselheiro',
      txt: 'Antônio Vicente Mendes Maciel was born in Quixeramobim, Ceará, in 1830. From the 1870s he wandered the backlands of Bahia and Sergipe preaching, repairing churches and building cemeteries and reservoirs with his followers. The Church and the authorities viewed him with suspicion.' },
    { y: 1893, p: [-38.6, -10.6], zoom: 'region', t: 'The burning of the tax notices and Masseté',
      txt: 'In 1893, in a town in the Bahian backlands, the Conselheiro ("Counselor") and his followers burned notices of new municipal taxes created by the Republic. In May, they defeated a police force at Masseté. The group then withdrew to an abandoned ranch on the banks of the Vaza-Barris River.' },
    { y: 1893, p: [-39.1, -9.95], zoom: 'close', t: 'Belo Monte',
      txt: 'From June 1893 the settlement of Belo Monte, known as Canudos, grew there, with fields, goat herding, trade and two churches. Estimates of its population range from 10,000 to more than 20,000 people, among them the formerly enslaved, Indigenous people and poor sertanejos (backlanders). Neighboring landowners were losing workers, and the Church and the press accused the settlement of fanaticism and monarchism.' },
    { y: 1896, p: [-39.49, -9.84], zoom: 'region', t: 'Uauá and the first two expeditions',
      txt: 'In 1896, timber bought by the Conselheiro in Juazeiro was not delivered, and a rumor spread that his followers were going to attack the town. A force of about a hundred soldiers was attacked at Uauá on 21 November and fell back. In January 1897, a second expedition, with more than 500 men, was also defeated in the nearby hills.' },
    { y: 1897, p: [-39.1, -9.95], zoom: 'close', t: 'The death of Moreira César, March 1897',
      txt: 'The third expedition, with about 1,300 soldiers and artillery, was led by Colonel Antônio Moreira César, known for his repression in the South. Attacking the settlement on 3 March 1897, he was wounded and died, and the troops fled, abandoning their weapons. In Rio, crowds attacked monarchist newspapers, and one monarchist, Colonel Gentil de Castro, was murdered.' },
    { y: 1897, p: [-39.33, -10.44], zoom: 'region', t: 'The fourth expedition and Monte Santo',
      txt: 'A fourth expedition, which grew to about 10,000 soldiers, was organized from Monte Santo under General Artur Oscar, and besieged Canudos from June. The Minister of War, Marshal Bittencourt, went to the region in person to secure supplies. Euclides da Cunha arrived as a correspondent for the newspaper O Estado de S. Paulo.' },
    { y: 1897, p: [-39.1, -9.95], zoom: 'close', t: 'The destruction of the settlement, 5 October',
      txt: 'Antônio Conselheiro died on 22 September 1897, probably of illness. On 5 October, the last defenders were killed and the settlement was burned; many prisoners, including those who surrendered, had their throats cut. Surviving women and children were taken away, and many were handed out as servants.' },
    { y: 1897, p: [-43.195, -22.897], zoom: 'close', t: 'Favela Hill and Os sertões',
      txt: 'In November 1897, at a ceremony for the returning soldiers in Rio, there was an attempt on the life of President Prudente de Morais, and Marshal Bittencourt was killed. Soldiers with nowhere to live settled on Providência Hill, which came to be called Favela Hill, after a plant from the Canudos region. In 1902, Euclides da Cunha published Os sertões ("Rebellion in the Backlands"), which denounced the massacre as a crime.' }
  ],

  /* ---------- Kasato Maru, 1908 ---------- */
  kasato: [
    { y: 1902, p: [12.48, 41.89], zoom: 'continent', t: 'Italy halts subsidized emigration', ev: 'italy',
      txt: 'São Paulo’s coffee plantations depended on Italian immigrants, whose passage was paid by the São Paulo government. In 1902, faced with reports of mistreatment, the Italian government banned subsidized emigration to Brazil through the Prinetti decree. Coffee growers began looking for workers in other countries.' },
    { y: 1905, p: [139.7, 35.68], zoom: 'continent', t: 'A Japan that emigrates', ev: 'meiji',
      txt: 'The modernization begun with the Meiji Restoration, in 1868, was paid for largely through land taxes, and many peasants fell into debt. After the war with Russia, in 1904–1905, the rural crisis got worse. The Japanese government encouraged emigration, first to Hawaii and the United States, which began restricting it in 1907.' },
    { y: 1907, p: [-46.63, -23.55], zoom: 'region', t: 'The contract with Ryu Mizuno',
      txt: 'In November 1907, the government of São Paulo signed a contract with Ryu Mizuno’s company to bring 3,000 Japanese in family groups, with subsidized passage. Brazil and Japan had signed a treaty of friendship in 1895. Some politicians, who wanted only European immigrants, opposed it.' },
    { y: 1908, p: [135.19, 34.69], zoom: 'region', t: 'Departure from Kobe, 28 April',
      txt: 'On 28 April 1908, the ship Kasato Maru left the port of Kobe with 781 contract immigrants, most of them from Okinawa and Kagoshima. Many families were put together just for the voyage, because the contract required groups of at least three people fit for work. Most planned to save money and go back to Japan within a few years.' },
    { y: 1908, p: [60.0, -25.0], zoom: 'world', t: 'More than 50 days at sea',
      txt: 'The ship crossed the Indian Ocean and rounded southern Africa before crossing the Atlantic. The voyage took 52 days. On board, the immigrants learned a few words of Portuguese.' },
    { y: 1908, p: [-46.3, -23.95], zoom: 'close', t: 'Arrival in Santos, 18 June',
      txt: 'On 18 June 1908, the Kasato Maru docked in Santos. The immigrants went up by train to the Immigrants’ Hostel, in the Brás district of São Paulo, and from there were sent to six coffee plantations. São Paulo newspapers praised their cleanliness and organization.' },
    { y: 1908, p: [-47.98, -21.24], zoom: 'region', t: 'Disappointment on the plantations',
      txt: 'On the plantations, such as the Dumont estate near Ribeirão Preto, the coffee trees were old and that year’s harvest was poor, and the colonos (contract workers) earned much less than they had been promised. There were conflicts and escapes, and by the end of 1909 most had abandoned their contracts. Many went to cities, ports and railway works.' },
    { y: 1913, p: [-47.84, -24.49], zoom: 'region', t: 'New waves and their own colonies',
      txt: 'Immigration continued, with a second ship in 1910, and grew a great deal in the 1920s and 1930s, with support from the Japanese government. From 1913, in Registro, in the Ribeira Valley, and later in western São Paulo and northern Paraná, the Japanese formed colonies on land of their own. By 1941 nearly 190,000 Japanese had arrived.' },
    { y: 1942, p: [-46.33, -23.96], zoom: 'region', t: 'The war and the restrictions',
      txt: 'The Constitution of 1934 capped the entry of each nationality, which hit the Japanese hardest. When Brazil broke with the Axis, in January 1942, Japanese-language newspapers and schools were closed, and in 1943 Japanese families were forced to leave Santos within a few hours. Even so, the community stayed and is today the largest of Japanese descent outside Japan.' }
  ],

  /* ---------- First World War, 1914–1918 ---------- */
  ww1: [
    { y: 1914, p: [18.41, 43.86], zoom: 'close', t: 'The Sarajevo assassination, 28 June',
      txt: 'On 28 June 1914, the Bosnian Serb student Gavrilo Princip shot dead Archduke Franz Ferdinand, heir to the Austro-Hungarian throne, in Sarajevo. Austria-Hungary, with German backing, sent an ultimatum to Serbia and declared war on 28 July. The alliances did the rest: Russia, Germany, France and Britain were in within a week.' },
    { y: 1914, p: [5.57, 50.63], zoom: 'region', t: 'The invasion of Belgium',
      txt: 'The German plan was to defeat France quickly by going through Belgium, which was neutral. On 4 August 1914, German troops attacked Liège, and the same day Britain declared war on Germany. Belgian civilians were shot in several towns.' },
    { y: 1914, p: [3.3, 48.95], zoom: 'region', t: 'The Marne and the trenches',
      txt: 'In September 1914, near Paris, the French and British stopped the Germans at the battle of the Marne. Both sides dug trenches that soon ran from the North Sea to Switzerland. In the east, Germany defeated Russia at Tannenberg, but there too the war dragged on.' },
    { y: 1915, p: [26.4, 40.2], zoom: 'region', t: 'Gallipoli and the Ottoman Empire',
      txt: 'The Ottoman Empire entered the war on Germany’s side. In April 1915, British, French, Australian and New Zealand troops landed at Gallipoli to open the way to Istanbul; they were driven back and left in January 1916. The same year, the Ottoman government deported and massacred the Armenian population, which most historians regard as genocide.' },
    { y: 1916, p: [2.7, 50.0], zoom: 'region', t: 'Verdun and the Somme',
      txt: 'In 1916, Germany attacked Verdun, from February to December, and the French and British attacked on the Somme, from 1 July. On the first day of the Somme alone, the British army suffered about 57,000 casualties, nearly 20,000 of them dead. The two battles added up to more than 1.5 million dead and wounded without moving the front line much.' },
    { y: 1917, p: [30.3, 59.94], zoom: 'continent', t: 'Revolution in Russia', ev: 'russianrev1917',
      txt: 'In Russia, hunger and defeats brought down the tsar in March 1917, and in November the Bolsheviks seized power in Petrograd. The new government signed a peace with Germany at Brest-Litovsk in March 1918, giving up vast territories. In April 1917, the United States entered the war against Germany.' },
    { y: 1917, p: [-43.18, -22.9], zoom: 'region', t: 'Brazil declares war',
      txt: 'German submarines sank Brazilian ships, such as the Paraná in April 1917 and the Macau in October. On 26 October 1917, Brazil declared war on Germany and later sent a naval division to patrol the Atlantic and a medical mission to France. In 1918, the Spanish flu arrived on ships and killed thousands of people in Rio.' },
    { y: 1918, p: [2.9, 49.43], zoom: 'close', t: 'The Armistice of Compiègne',
      txt: 'After a last offensive in the spring of 1918, the German army fell back before the Allies, reinforced by the Americans. With mutinies and revolution at home, Emperor Wilhelm II abdicated. On 11 November 1918, in a railway carriage in the forest of Compiègne, Germany signed the armistice.' },
    { y: 1919, p: [2.12, 48.8], zoom: 'close', t: 'The Treaty of Versailles',
      txt: 'On 28 June 1919, in the Hall of Mirrors at Versailles, Germany signed a treaty that stripped it of territory and colonies and imposed heavy reparations. Brazil, represented by Epitácio Pessoa, was among the signatories and joined the League of Nations. The Russian, German, Austro-Hungarian and Ottoman empires had vanished, and German resentment helped prepare the next war.' }
  ],

  /* ---------- Revolution of 1930 ---------- */
  rev1930: [
    { y: 1929, p: [-74.0, 40.71], zoom: 'world', t: 'The 1929 crash sinks coffee', ev: 'crash29',
      txt: 'In October 1929, the New York Stock Exchange crashed, and the crisis spread around the world. The price of coffee, Brazil’s main export, fell by half, and the federal government refused to rescue the coffee growers with more credit. The crisis shook the base of Washington Luís’s government.' },
    { y: 1929, p: [-43.18, -22.9], zoom: 'continent', t: 'The Liberal Alliance',
      txt: 'Under the informal agreement between the elites of São Paulo and Minas, the next president was supposed to be from Minas. Washington Luís nominated Júlio Prestes, from São Paulo, and Minas joined Rio Grande do Sul and Paraíba in the Liberal Alliance, with Getúlio Vargas for president and João Pessoa for vice president. The Alliance promised the secret ballot and labor laws.' },
    { y: 1930, p: [-46.63, -23.55], zoom: 'continent', t: 'The election of 1 March',
      txt: 'In the election of 1 March 1930, Júlio Prestes won, with fraud on both sides, as was common in the First Republic. Older Alliance politicians accepted the result, but young politicians and the tenentes (lieutenants) who had rebelled in the 1920s began to conspire. They lacked a pretext.' },
    { y: 1930, p: [-34.88, -8.06], zoom: 'close', t: 'The murder of João Pessoa',
      txt: 'On 26 July 1930, João Pessoa, governor of Paraíba, was shot dead in a Recife pastry shop by João Dantas, his political enemy. The crime had local and personal motives, but it was presented as the work of the federal government. The funeral in Rio turned into a huge demonstration against Washington Luís.' },
    { y: 1930, p: [-51.23, -30.03], zoom: 'region', t: 'The uprising of 3 October',
      txt: 'On the afternoon of 3 October 1930, rebels seized the barracks in Porto Alegre, and the movement also broke out in Minas Gerais and, in the Northeast, under Juarez Távora. Vargas set out north by train at the head of the gaúcho troops (from Rio Grande do Sul). The southern states joined almost without a fight.' },
    { y: 1930, p: [-49.33, -24.11], zoom: 'region', t: 'Itararé, the battle that never happened',
      txt: 'A great battle was expected at Itararé, on the border between Paraná and São Paulo, where federal troops awaited the rebels. Before the fighting, the war was decided in Rio. Because of this, the humorist Aparício Torelly began calling himself the Baron of Itararé.' },
    { y: 1930, p: [-43.186, -22.94], zoom: 'close', t: 'The junta deposes Washington Luís',
      txt: 'On 24 October 1930, generals and admirals in Rio formed a junta and deposed Washington Luís, who was arrested and later exiled. Vargas reached Rio by train on 31 October, and gaúchos tied their horses to the obelisk on Avenida Rio Branco. On 3 November, Vargas took over the provisional government.' },
    { y: 1932, p: [-46.63, -23.55], zoom: 'region', t: 'São Paulo revolts in 1932',
      txt: 'Vargas shut down Congress and appointed interventors (federal governors) in the states. On 9 July 1932, São Paulo rose up demanding a constitution, and was defeated in October, after almost three months of war. In 1934, a constituent assembly adopted the secret ballot and women’s suffrage, both already created in 1932.' },
    { y: 1937, p: [-43.3, -22.9], zoom: 'region', t: 'From provisional government to Estado Novo', ev: 'estadonovo',
      txt: 'Elected president by the constituent assembly in 1934, Vargas used the fear of communism, after the uprising of 1935, to expand his powers. On 10 November 1937, he shut down Congress and imposed a new constitution: the Estado Novo ("New State") dictatorship had begun. Historians still debate whether 1930 was a revolution or a reshuffle among the elites.' }
  ],

  /* ---------- Second World War, 1939–1945 ---------- */
  ww2: [
    { y: 1938, p: [11.58, 48.14], zoom: 'continent', t: 'Hitler and the Munich Agreement',
      txt: 'Hitler came to power in January 1933, rearmed Germany and annexed Austria in March 1938. In September 1938, in Munich, Britain and France agreed to let him have the Sudetenland, in Czechoslovakia, to avoid war. On 23 August 1939, Germany and the Soviet Union signed a non-aggression pact with a secret clause dividing Poland.' },
    { y: 1939, p: [18.67, 54.41], zoom: 'region', t: 'The invasion of Poland, 1 September', ev: 'ww2',
      txt: 'Before dawn on 1 September 1939, a German ship shelled the Polish post at Westerplatte, in Danzig, and the German army crossed the border. Britain and France declared war on 3 September, and on 17 September the Soviet Union invaded Poland from the east. Poland was carved up within a few weeks.' },
    { y: 1940, p: [2.38, 51.03], zoom: 'region', t: 'The fall of France',
      txt: 'In May 1940, Germany invaded Holland, Belgium and France. More than 300,000 Allied soldiers were evacuated by sea at Dunkirk, and Paris fell on 14 June; France signed the armistice on 22 June. Britain held out alone against German bombing during the Battle of Britain.' },
    { y: 1941, p: [28.0, 53.0], zoom: 'continent', t: 'The invasion of the USSR and the Holocaust', ev: 'holocaust',
      txt: 'On 22 June 1941, about 3 million German and allied soldiers invaded the Soviet Union. Behind the army, killing squads shot hundreds of thousands of Jews, and from 1942 the Nazi regime set up extermination camps in Poland. About 6 million Jews were murdered, as well as Roma, Soviet prisoners and other groups.' },
    { y: 1941, p: [-157.95, 21.36], zoom: 'continent', t: 'Pearl Harbor, 7 December',
      txt: 'Japan, at war with China since 1937, launched a surprise attack on the American naval base at Pearl Harbor, Hawaii, on 7 December 1941. The United States entered the war, and Germany declared war on it days later. In the following months Japan occupied Southeast Asia and much of the Pacific.' },
    { y: 1942, p: [44.5, 48.7], zoom: 'region', t: 'Stalingrad',
      txt: 'From August 1942 to February 1943, Germans and Soviets fought street by street in Stalingrad, on the Volga. On 2 February 1943, what was left of the German 6th Army surrendered. In August 1942, on the other side of the world, Brazil entered the war after German submarines sank ships off its coast.' },
    { y: 1944, p: [-0.85, 49.37], zoom: 'region', t: 'The Normandy landings',
      txt: 'On 6 June 1944, American, British and Canadian troops landed on the beaches of Normandy, in the largest amphibious operation in history. Paris was liberated in August. That same summer the Brazilian Expeditionary Force reached Italy, and in the east the Soviet army advanced into Poland.' },
    { y: 1945, p: [13.38, 52.52], zoom: 'close', t: 'The fall of Berlin, May 1945',
      txt: 'The Soviet army encircled Berlin in April 1945, and Hitler killed himself on 30 April. Germany signed its unconditional surrender in Reims on 7 May, and in Berlin on 8 May. The liberated concentration camps revealed to the world the scale of the genocide.' },
    { y: 1945, p: [132.45, 34.39], zoom: 'region', t: 'Hiroshima, Nagasaki and the surrender', ev: 'hiroshima1945',
      txt: 'On 6 August 1945, the United States dropped an atomic bomb on Hiroshima and, on 9 August, another on Nagasaki; the Soviet Union declared war on Japan on the 8th. Japan announced its surrender on 15 August and signed it on 2 September. The war killed between 70 and 85 million people, and that same year the UN was founded.' }
  ],

  /* ---------- The FEB in Italy, 1944–1945 ---------- */
  feb: [
    { y: 1942, p: [-35.25, -5.91], zoom: 'region', t: 'Neutrality, bases and the break',
      txt: 'Vargas wavered between Germany and the United States in the first years of the war. In January 1942, at a conference in Rio, Brazil broke off relations with the Axis, and the Americans were given bases in the Northeast, such as Parnamirim, in Natal, an air bridge to Africa. In return, Brazil got financing for the Volta Redonda steelworks.' },
    { y: 1942, p: [-37.0, -11.3], zoom: 'region', t: 'Ships sunk off the coast',
      txt: 'Between 15 and 17 August 1942, the German submarine U-507 sank five Brazilian ships off the coast of Sergipe and Bahia, killing more than 600 people. There were protests and attacks on German- and Italian-owned homes and shops in several cities. On 22 August the government recognized a state of war with Germany and Italy.' },
    { y: 1943, p: [-35.21, -5.79], zoom: 'close', t: 'Vargas and Roosevelt in Natal',
      txt: 'In January 1943, Vargas and President Franklin Roosevelt met in Natal. Brazil decided to send troops to fight, and the Brazilian Expeditionary Force (FEB) was created in August 1943. Training and equipping the soldiers, many of them illiterate and poorly fed, took months.' },
    { y: 1944, p: [14.27, 40.85], zoom: 'world', t: 'From Rio to Naples',
      txt: 'On 2 July 1944, the first contingent, with about 5,000 men, left Rio on the American ship General Mann and reached Naples on 16 July. In all, about 25,000 Brazilians went to Italy, attached to the American 5th Army. The FEB’s emblem, a snake smoking a pipe, answered those who said a snake would sooner smoke than Brazil would go to war.' },
    { y: 1944, p: [10.3, 43.94], zoom: 'region', t: 'First battles in the Serchio valley',
      txt: 'In September 1944, the Brazilians went into combat in Tuscany and took Massarosa and Camaiore. They were then moved to the Apennines, where the Germans held the Gothic Line. Winter brought snow and sub-zero temperatures to soldiers who had never seen such cold.' },
    { y: 1945, p: [10.95, 44.2], zoom: 'close', t: 'Monte Castello, 21 February',
      txt: 'Between November and December 1944, four Brazilian attacks on Monte Castello failed with heavy losses. On 21 February 1945, in a joint offensive with the American 10th Mountain Division, the FEB took the hill. In March it took Castelnuovo.' },
    { y: 1945, p: [10.94, 44.27], zoom: 'close', t: 'Montese, 14 April',
      txt: 'In the final spring offensive, the FEB attacked Montese on 14 April 1945 and took the town after hard fighting. It was the battle with the most Brazilian casualties in a single day. The Germans began to fall back toward the Po valley.' },
    { y: 1945, p: [10.1, 44.69], zoom: 'region', t: 'The surrender at Fornovo',
      txt: 'On 28 and 29 April 1945, near Fornovo di Taro, the FEB surrounded the German 148th Division and Italian units, which surrendered: about 15,000 prisoners. The war in Italy ended on 2 May. Nearly 450 Brazilians died in the campaign.' },
    { y: 1945, p: [-43.18, -22.9], zoom: 'close', t: 'The return and the end of the Estado Novo', ev: 'estadonovo',
      txt: 'The pracinhas (Brazilian soldiers) paraded in Rio in July 1945, greeted by crowds. The contradiction between fighting fascism and living under a dictatorship fed the opposition to Vargas, who had already announced elections. On 29 October 1945, the military, including commanders who had served in Italy, deposed Vargas.' }
  ],

  /* ---------- Independence of India, 1947 ---------- */
  india1947: [
    { y: 1857, p: [77.7, 28.98], zoom: 'region', t: 'The revolt of 1857 and the British crown', ev: 'plassey',
      txt: 'The British East India Company had ruled Bengal since Plassey, in 1757, and later much of the subcontinent. On 10 May 1857, the Company’s Indian soldiers rebelled at Meerut and marched to Delhi; the revolt was crushed with massacres on both sides. In 1858 the British crown began to rule India directly.' },
    { y: 1885, p: [72.83, 18.94], zoom: 'region', t: 'The Indian National Congress',
      txt: 'In December 1885, Indian lawyers and journalists educated in British schools founded the Indian National Congress in Bombay, which at first asked for reforms, not independence. In 1906, in Dhaka, the Muslim League was founded. The divide between Hindus and Muslims was at times encouraged by the British administration.' },
    { y: 1919, p: [74.88, 31.62], zoom: 'close', t: 'The Amritsar massacre',
      txt: 'On 13 April 1919, General Reginald Dyer ordered his troops to fire on an unarmed crowd gathered in the walled garden of Jallianwala Bagh, in Amritsar. Official figures give 379 dead; Indian estimates exceed a thousand. The massacre convinced many Indians, Gandhi among them, that British rule could not be reformed.' },
    { y: 1930, p: [72.8, 20.89], zoom: 'region', t: 'The Salt March', ev: 'saltmarch',
      txt: 'On 12 March 1930, Gandhi left his ashram near Ahmedabad and walked with followers about 390 km to the beach at Dandi, where on 6 April he gathered salt, defying the British monopoly. Tens of thousands of people were arrested in the civil disobedience campaign that followed. Nonviolence became a mass method.' },
    { y: 1940, p: [74.31, 31.59], zoom: 'close', t: 'The Lahore Resolution',
      txt: 'On 23 March 1940, the Muslim League, led by Muhammad Ali Jinnah, adopted a resolution in Lahore calling for independent states in the Muslim-majority regions. The idea of Pakistan gained strength. In August 1942, the Congress launched the "Quit India" campaign in Bombay, and its leaders were jailed until the end of the war.' },
    { y: 1946, p: [88.36, 22.57], zoom: 'close', t: 'Calcutta, August 1946',
      txt: 'After the war, a weakened Britain decided to leave, but the Congress and the League could not agree. On 16 August 1946, the "Direct Action Day" called by the League ended in killings between Hindus and Muslims in Calcutta, with thousands dead in a few days. The violence spread to Bengal and Bihar.' },
    { y: 1947, p: [77.21, 28.61], zoom: 'close', t: 'Midnight, 14 to 15 August', ev: 'india1947',
      txt: 'On 3 June 1947, the viceroy Louis Mountbatten announced partition and brought the British departure forward to August. Pakistan became independent on 14 August and India at midnight on 15 August, when Jawaharlal Nehru gave a speech in New Delhi. The borders, drawn by the lawyer Cyril Radcliffe in five weeks, were only published on 17 August.' },
    { y: 1947, p: [74.57, 31.6], zoom: 'region', t: 'Punjab divided',
      txt: 'The new border cut Punjab and Bengal in half. About 15 million people crossed the borders, Hindus and Sikhs to India, Muslims to Pakistan, and trains arrived full of the dead. Estimates of the dead range from hundreds of thousands to about 2 million; in October the war over Kashmir began.' },
    { y: 1948, p: [77.21, 28.6], zoom: 'close', t: 'The death of Gandhi',
      txt: 'Gandhi, who had opposed partition, fasted to stop the violence in Calcutta and Delhi. On 30 January 1948, he was shot dead in New Delhi by Nathuram Godse, a Hindu nationalist who accused him of favoring Muslims. India’s independence spurred anti-colonial struggles in Asia and Africa.' }
  ],

  /* ---------- The Cold War, 1947–1991 ---------- */
  coldwar: [
    { y: 1947, p: [-77.04, 38.9], zoom: 'region', t: 'The Truman Doctrine', ev: 'coldwar',
      txt: 'After 1945, the Soviet Union installed communist governments in Eastern Europe, and the former allies came to distrust each other. On 12 March 1947, President Harry Truman asked Congress for aid to Greece and Turkey and promised to support any people threatened by communism. In June came the Marshall Plan to rebuild Western Europe.' },
    { y: 1948, p: [13.4, 52.5], zoom: 'region', t: 'The Berlin Blockade',
      txt: 'In June 1948, the Soviet Union closed the land routes into West Berlin. The United States and Britain supplied the city by air for almost a year, until May 1949. That year saw the birth of NATO, two Germanys and the first Soviet atomic bomb; in October, the communists took power in China.' },
    { y: 1950, p: [126.68, 37.96], zoom: 'region', t: 'The Korean War',
      txt: 'On 25 June 1950, communist North Korea invaded South Korea. UN troops led by the United States and, later, hundreds of thousands of Chinese soldiers entered the war. The armistice of 27 July 1953, signed at Panmunjom, kept the division near the 38th parallel, after millions of deaths.' },
    { y: 1954, p: [-90.51, 14.63], zoom: 'region', t: 'The coup in Guatemala',
      txt: 'The president of Guatemala, Jacobo Árbenz, carried out a land reform that expropriated uncultivated land belonging to the American company United Fruit. In June 1954, an invasion organized by the CIA overthrew him. It was the first of several coups in Latin America backed by the United States in the name of anti-communism.' },
    { y: 1962, p: [-82.9, 22.8], zoom: 'region', t: 'The Cuban Missile Crisis', ev: 'missiles1962',
      txt: 'After the revolution of 1959, Cuba allied itself with the Soviet Union. In October 1962, American planes photographed Soviet nuclear missile sites on the island, and Kennedy ordered a naval blockade. For thirteen days the world was close to nuclear war, until Khrushchev agreed to remove the missiles in exchange for a promise not to invade Cuba and, secretly, the removal of American missiles from Turkey.' },
    { y: 1964, p: [-43.35, -21.76], zoom: 'continent', t: 'Coups in the Southern Cone', ev: 'coup64',
      txt: 'On 31 March 1964, troops set out from Juiz de Fora and overthrew President João Goulart, with the support of the American government. Military dictatorships followed in Bolivia, Uruguay, Chile (1973) and Argentina (1976), justified as fighting communism. In the 1970s they coordinated the hunt for opponents in Operation Condor.' },
    { y: 1975, p: [106.7, 10.78], zoom: 'region', t: 'The fall of Saigon',
      txt: 'From 1965 the United States sent hundreds of thousands of soldiers to Vietnam to prop up the southern government against the communists. The war killed millions of Vietnamese and about 58,000 Americans and set off large protests in the United States. On 30 April 1975, North Vietnamese tanks rolled into Saigon.' },
    { y: 1989, p: [13.38, 52.52], zoom: 'region', t: 'The fall of the Wall', ev: 'berlinwallfall',
      txt: 'The Soviet invasion of Afghanistan in 1979 and the arms race of the 1980s weighed on a stagnant Soviet economy. Mikhail Gorbachev, in power since 1985, tried reforms and stopped intervening in Eastern Europe. On 9 November 1989 the Berlin Wall was opened, and the communist regimes fell one after another.' },
    { y: 1991, p: [37.62, 55.75], zoom: 'continent', t: 'The end of the Soviet Union',
      txt: 'In August 1991, an attempted coup by hard-line communists in Moscow failed, and the Soviet republics declared independence. On 25 December 1991, Gorbachev resigned, and the red flag was lowered over the Kremlin. The Soviet Union ceased to exist, and the Cold War with it.' }
  ],

  /* ---------- Brasília, 1960 ---------- */
  brasilia: [
    { y: 1892, p: [-47.9, -15.6], zoom: 'region', t: 'The Cruls Commission and the stone of 1922',
      txt: 'The Constitution of 1891 set aside an area on the Central Plateau for the future capital. Between 1892 and 1894, the commission led by the astronomer Luís Cruls surveyed the region and marked out a quadrilateral. On 7 September 1922, the centenary of independence, a foundation stone was laid near Planaltina, but nothing more was done for decades.' },
    { y: 1955, p: [-51.71, -17.88], zoom: 'region', t: 'The promise at Jataí',
      txt: 'On 4 April 1955, at a rally in Jataí, Goiás, the candidate Juscelino Kubitschek was asked whether he would obey the Constitution and move the capital. He said yes, and the move became the "synthesis goal" of his plan for "fifty years in five". JK was elected in October 1955.' },
    { y: 1957, p: [-43.18, -22.9], zoom: 'region', t: 'Novacap and Lúcio Costa’s plan',
      txt: 'In September 1956, a law created Novacap, the company in charge of building the city, headed by Israel Pinheiro. In March 1957, the jury of a competition chose Lúcio Costa’s pilot plan, drawn on a few sheets, with two axes that cross. Oscar Niemeyer had already been called in to design the buildings.' },
    { y: 1958, p: [-47.97, -15.87], zoom: 'region', t: 'The candangos and the Cidade Livre',
      txt: 'Tens of thousands of workers, the candangos, came mostly from the Northeast, Minas and Goiás, many on pau de arara trucks (open trucks with wooden benches). They lived in construction camps and in the Cidade Livre ("Free City"), today Núcleo Bandeirante; the plan had no place for them in the center. In 1958 the government created Taguatinga, the first satellite town.' },
    { y: 1959, p: [-48.5, -7.0], zoom: 'continent', t: 'The Belém–Brasília highway',
      txt: 'To link the new capital to the north of the country, the Belém–Brasília highway was opened, more than 2,000 km through forest and cerrado (savanna). The engineer Bernardo Sayão, who led the work, died in January 1959, struck by a falling tree. The road opened up the interior to settlement, with deforestation and land conflicts.' },
    { y: 1960, p: [-47.86, -15.8], zoom: 'close', t: 'The inauguration, 21 April 1960', ev: 'brasilia',
      txt: 'Brasília was inaugurated on 21 April 1960, with many buildings still unfinished. Congress, the Planalto Palace and the Supreme Court moved from Rio, which became the state of Guanabara. The cost of construction fed the inflation and foreign debt of the following years.' },
    { y: 1971, p: [-48.11, -15.82], zoom: 'region', t: 'The removal of the shantytowns and Ceilândia',
      txt: 'The population grew much faster than planned, and much of it lived in settlements without infrastructure near the pilot plan. In 1971, the Campaign for the Eradication of Invasions, whose Portuguese acronym CEI gave Ceilândia its name, moved tens of thousands of residents far from the center. The planned capital ended up ringed by poor towns.' }
  ],

  /* ---------- The Year of Africa, 1960 ---------- */
  decolonization1960: [
    { y: 1945, p: [-2.24, 53.48], zoom: 'region', t: 'The Pan-African Congress in Manchester',
      txt: 'In October 1945, in Manchester, the 5th Pan-African Congress brought together leaders such as Kwame Nkrumah, Jomo Kenyatta and the American W. E. B. Du Bois. For the first time, the central demand was immediate independence, not reforms. Many Africans had fought in the war for the European empires.' },
    { y: 1954, p: [3.06, 36.75], zoom: 'region', t: 'The Algerian War',
      txt: 'On 1 November 1954, the National Liberation Front launched attacks across Algeria, a French colony with about 1 million European settlers. The war lasted until 1962, with systematic torture by the French army, and the number of Algerian dead ranges from about 300,000 to 1.5 million, depending on the estimate. The same year, France had been defeated in Vietnam.' },
    { y: 1957, p: [-0.2, 5.56], zoom: 'region', t: 'Ghana leads the way',
      txt: 'On 6 March 1957, the British Gold Coast became independent under the name Ghana, led by Kwame Nkrumah, after years of strikes, boycotts and elections. It was the first country in sub-Saharan Africa to free itself from a European empire. Accra became a meeting point for anti-colonial movements from across the continent.' },
    { y: 1958, p: [-13.7, 9.51], zoom: 'region', t: 'Guinea says no',
      txt: 'In September 1958, de Gaulle offered the French colonies a referendum on a "Community" with France. Only Sékou Touré’s Guinea voted no, and it became independent on 2 October 1958; France pulled out its officials and equipment in a hurry. The other French colonies in Africa negotiated independence over the next two years.' },
    { y: 1960, p: [15.31, -4.32], zoom: 'close', t: 'The Congo, 30 June', ev: 'decolonization1960',
      txt: 'In 1960, 17 African countries became independent, among them Nigeria, Senegal, Madagascar and the Congo. At the ceremony of 30 June in Léopoldville, Prime Minister Patrice Lumumba recalled, in front of King Baudouin, the humiliations of Belgian rule. Days later the army mutinied, and the Belgians sent troops.' },
    { y: 1960, p: [-73.97, 40.75], zoom: 'region', t: 'The UN condemns colonialism',
      txt: 'On 14 December 1960, the UN General Assembly adopted Resolution 1514, which declared the right of colonial peoples to independence. There were 89 votes in favor, none against and nine abstentions, among them the United States, Britain, France, Belgium and Portugal. The new African countries changed the majority in the Assembly.' },
    { y: 1961, p: [27.48, -11.66], zoom: 'region', t: 'Katanga and the death of Lumumba',
      txt: 'In July 1960, the rich province of Katanga, backed by mining companies and Belgian officers, declared secession. Lumumba was dismissed in September and arrested by Mobutu, and on 17 January 1961 he was shot in Katanga with the participation of Belgian officers; the CIA had also planned to kill him. Mobutu ruled the country as a dictator from 1965 to 1997.' },
    { y: 1961, p: [13.23, -8.84], zoom: 'region', t: 'War in Angola',
      txt: 'Portugal, under Salazar’s dictatorship, refused to decolonize. In February 1961 prisons in Luanda were attacked, and in March there was an uprising in northern Angola, put down with thousands of deaths. The colonial wars began, spreading to Guinea-Bissau and Mozambique.' },
    { y: 1974, p: [-9.14, 38.71], zoom: 'region', t: 'The Carnation Revolution',
      txt: 'Tired of thirteen years of war in Africa, Portuguese officers overthrew the dictatorship in Lisbon on 25 April 1974. Guinea-Bissau was recognized in 1974, and Mozambique, Cape Verde, São Tomé and Príncipe and Angola became independent in 1975. Brazil was the first country to recognize the government of Angola, on 11 November 1975, already in civil war.' }
  ],

  /* ---------- The 1964 coup and the dictatorship ---------- */
  coup64: [
    { y: 1961, p: [-51.23, -30.03], zoom: 'region', t: 'Jânio resigns and the Legality campaign',
      txt: 'On 25 August 1961, President Jânio Quadros resigned, and the military ministers tried to block the swearing-in of the vice president, João Goulart, who was in China. In Rio Grande do Sul, Governor Leonel Brizola organized the Legality Campaign, with radio stations and armed volunteers. The way out was an improvised parliamentary system, and Jango took office on 7 September.' },
    { y: 1963, p: [-47.88, -15.79], zoom: 'region', t: 'Presidential rule and the base reforms',
      txt: 'In January 1963, a plebiscite gave Jango back his presidential powers. He championed the "base reforms", such as land reform, urban reform and the vote for the illiterate, amid high inflation and strikes. In the Cold War, the American government funded his opponents and saw Jango as a risk of drifting to the left.' },
    { y: 1964, p: [-43.19, -22.904], zoom: 'close', t: 'The Central rally and the March',
      txt: 'On 13 March 1964, before more than 100,000 people at the Central do Brasil station in Rio, Jango signed decrees expropriating land and oil refineries. On 19 March, the March of the Family with God for Liberty brought hundreds of thousands onto the streets of São Paulo against the government. At the end of the month, a sailors’ revolt in Rio angered the officers.' },
    { y: 1964, p: [-43.35, -21.76], zoom: 'region', t: 'Juiz de Fora, 31 March',
      txt: 'Before dawn on 31 March 1964, General Olímpio Mourão Filho set out from Juiz de Fora with troops toward Rio, backed by the governor of Minas, Magalhães Pinto. Other commands joined within hours, including the 2nd Army in São Paulo. Jango, not wanting a civil war, did not resist.' },
    { y: 1964, p: [-47.88, -15.79], zoom: 'region', t: 'The "vacant" presidency, 2 April', ev: 'coldwar',
      txt: 'Jango flew from Rio to Brasília and then to Porto Alegre. Before dawn on 2 April, with the president still in the country, the president of the Senate declared the office vacant, and Ranieri Mazzilli was sworn in; the United States recognized the new government within hours. Operation Brother Sam, an American fleet sent to back the coup plotters if needed, was stood down.' },
    { y: 1964, p: [-47.86, -15.8], zoom: 'close', t: 'AI-1 and Castelo Branco',
      txt: 'On 9 April 1964, the military chiefs issued Institutional Act No. 1 (AI-1), which allowed them to revoke mandates and suspend political rights. On 15 April, Marshal Castelo Branco took office, elected by an already purged Congress. Parties were abolished in 1965, and presidential elections became indirect.' },
    { y: 1968, p: [-43.19, -22.93], zoom: 'close', t: 'AI-5, 13 December 1968',
      txt: 'After a year of student marches and strikes, Costa e Silva’s government used a speech by congressman Márcio Moreira Alves as a pretext. On 13 December 1968, at a meeting in the Laranjeiras Palace in Rio, it issued AI-5, which closed Congress and suspended habeas corpus for political crimes. The years of harshest censorship, torture and disappearances began.' },
    { y: 1972, p: [-48.53, -6.41], zoom: 'region', t: 'The Araguaia guerrilla',
      txt: 'Between 1972 and 1974, militants of the PCdoB (Communist Party of Brazil) settled in the Araguaia River region, in southern Pará, were attacked by thousands of soldiers. Almost all the guerrillas were killed, many after being captured, and local peasants were tortured. Most of the bodies were never returned to their families.' },
    { y: 1985, p: [-47.86, -15.8], zoom: 'region', t: 'Amnesty, Diretas and the end', ev: 'diretas',
      txt: 'With the economic crisis and pressure from social movements, the Geisel government began a slow opening, and in 1979 came the Amnesty Law, which also protected the torturers. In 1984, the Diretas Já ("Direct Elections Now") campaign brought millions onto the streets, but the amendment was defeated. On 15 January 1985, the Electoral College elected Tancredo Neves; he died before taking office, and José Sarney took over on 15 March, ending 21 years of dictatorship.' }
  ],

  /* ---------- The fall of the Berlin Wall, 1989 ---------- */
  berlinwallfall: [
    { y: 1961, p: [13.38, 52.51], zoom: 'close', t: 'The Wall, 13 August 1961', ev: 'coldwar',
      txt: 'By 1961, about 2.7 million East Germans had fled to the west, many through Berlin. Before dawn on 13 August 1961, the East German government sealed the border with barbed wire, later replaced by a concrete wall. More than 100 people died trying to cross it in the following years.' },
    { y: 1980, p: [18.65, 54.36], zoom: 'region', t: 'Solidarity in Gdańsk',
      txt: 'In August 1980, a strike at the Lenin Shipyard in Gdańsk, led by the electrician Lech Wałęsa, led to the creation of the independent trade union Solidarity, with about 10 million members. In December 1981, the Polish government declared martial law and banned it. The union survived underground.' },
    { y: 1985, p: [37.62, 55.75], zoom: 'continent', t: 'Gorbachev in Moscow',
      txt: 'In March 1985, Mikhail Gorbachev took charge of the Soviet Union, with the economy stagnant and the army bogged down in Afghanistan. He launched perestroika (restructuring) and glasnost (openness). He also made it clear that he would not send tanks to prop up the communist governments of Eastern Europe.' },
    { y: 1989, p: [21.01, 52.23], zoom: 'region', t: 'Elections in Poland, 4 June',
      txt: 'After negotiations with Solidarity, the Polish government accepted partly free elections on 4 June 1989. Solidarity won almost all the seats it was allowed to contest, and in August Tadeusz Mazowiecki became the first non-communist head of government in the bloc. On that same 4 June, the Chinese government crushed the protests in Tiananmen Square.' },
    { y: 1989, p: [16.63, 47.68], zoom: 'region', t: 'Hungary opens the border',
      txt: 'In May 1989, Hungary began dismantling the fence on its border with Austria. On 19 August, during a "Pan-European Picnic" near Sopron, hundreds of East Germans crossed to the west, and in September Hungary opened the border for good. Tens of thousands of East Germans fled that way.' },
    { y: 1989, p: [12.38, 51.34], zoom: 'close', t: 'The Leipzig Monday demonstrations',
      txt: 'In Leipzig, the Monday prayers for peace at St. Nicholas Church turned into marches. On 9 October 1989, about 70,000 people marched chanting "We are the people", and the security forces did not shoot. On 18 October, the party leader, Erich Honecker, was removed.' },
    { y: 1989, p: [13.39, 52.555], zoom: 'close', t: 'The night of 9 November', ev: 'berlinwallfall',
      txt: 'Early in the evening of 9 November, the spokesman Günter Schabowski announced new travel rules at a live press conference and, asked when they took effect, said "immediately". Thousands of people went to the border crossings; at around 11:30 pm, the officer at the Bornholmer Strasse crossing opened the gate. That night Berliners climbed onto the Wall and began to break it apart.' },
    { y: 1989, p: [14.42, 50.08], zoom: 'continent', t: 'Prague, Sofia, Bucharest',
      txt: 'On 17 November 1989, the crackdown on a student march in Prague set off the Velvet Revolution, and in December the playwright Václav Havel became president of Czechoslovakia. In Bulgaria, the leader Todor Zhivkov was removed on 10 November. In Romania, the revolt began in Timișoara and ended with the execution of the dictator Nicolae Ceaușescu on 25 December.' },
    { y: 1990, p: [13.38, 52.52], zoom: 'region', t: 'Reunification and the end of the USSR',
      txt: 'In March 1990, East Germany held its first free elections, and on 3 October 1990 the two Germanys were reunified. The Baltic republics and other Soviet republics sought independence. In December 1991 the Soviet Union ceased to exist.' }
  ],

  /* ---------- The end of apartheid, 1990–1994 ---------- */
  apartheid: [
    { y: 1913, p: [26.21, -29.12], zoom: 'region', t: 'The ANC and the Land Act',
      txt: 'On 8 January 1912, in Bloemfontein, African lawyers, teachers and chiefs founded the South African Native National Congress, later the African National Congress (ANC). In 1913, the Natives Land Act reserved for Africans, the vast majority of the population, about 7% of the country’s land. Segregation existed before apartheid.' },
    { y: 1948, p: [18.42, -33.92], zoom: 'close', t: 'The National Party and the apartheid laws',
      txt: 'In May 1948, the Afrikaner-based National Party won the election, in which only whites could vote, on a platform of apartheid ("separateness"). In 1950, Parliament, in Cape Town, passed laws that classified every person by race and reserved neighborhoods for each group. Marriages between races were banned, and millions of people were later forcibly removed from their homes.' },
    { y: 1955, p: [27.88, -26.27], zoom: 'close', t: 'The Freedom Charter at Kliptown',
      txt: 'On 26 June 1955, about 3,000 delegates gathered at Kliptown, near Johannesburg, adopted the Freedom Charter, which began by saying that South Africa belongs to all who live in it, black and white. The police broke up the meeting on the second day. In 1956, 156 leaders were charged with treason; all were eventually acquitted.' },
    { y: 1960, p: [27.87, -26.69], zoom: 'close', t: 'The Sharpeville massacre',
      txt: 'On 21 March 1960, in Sharpeville, police fired on a crowd protesting against the passes, documents that Africans were required to carry. 69 people died, many shot in the back. The government banned the ANC and the PAC, and in 1961 the ANC created an armed wing, led by Nelson Mandela.' },
    { y: 1964, p: [18.37, -33.81], zoom: 'region', t: 'Rivonia and Robben Island',
      txt: 'At the Rivonia trial, on 12 June 1964, Mandela, Walter Sisulu and other leaders were sentenced to life imprisonment. Mandela spent 18 years in the prison on Robben Island, off Cape Town, breaking rocks in a lime quarry. The ANC carried on in exile, with bases in neighboring countries.' },
    { y: 1976, p: [27.91, -26.24], zoom: 'close', t: 'The Soweto uprising, 16 June',
      txt: 'On 16 June 1976, thousands of students in Soweto protested against being forced to study in Afrikaans. The police opened fire; the photo of 12-year-old Hector Pieterson, dying in the arms of a schoolmate, went around the world. The revolt spread, and estimates of the dead range from 176, the official figure, to more than 600.' },
    { y: 1988, p: [18.97, -15.16], zoom: 'continent', t: 'Sanctions and Cuito Cuanavale',
      txt: 'In the 1980s, strikes, boycotts and the United Democratic Front made the Black townships ungovernable, and the government declared a state of emergency; the United States passed sanctions in 1986. In Angola, in 1987 and 1988, Cuban and Angolan troops held off the South African army at Cuito Cuanavale; the weight of this battle is debated. The December 1988 accords led to the independence of Namibia, which South Africa had occupied.' },
    { y: 1990, p: [18.96, -33.83], zoom: 'region', t: 'Mandela freed, 11 February', ev: 'apartheid',
      txt: 'On 2 February 1990, President F. W. de Klerk announced in Parliament the unbanning of the ANC and other parties. On 11 February, Mandela walked out of Victor Verster prison, near Paarl, after 27 years behind bars, and spoke at Cape Town City Hall. Four years of negotiations followed, with political violence that killed thousands, such as the murder of the communist leader Chris Hani in 1993.' },
    { y: 1994, p: [28.21, -25.74], zoom: 'close', t: 'The election of April 1994',
      txt: 'On 27 April 1994, in the first election in which everyone could vote, millions of people waited in lines for hours. The ANC won about 62% of the vote, and Mandela was sworn in as president on 10 May, at the Union Buildings in Pretoria. In 1996, a Truth and Reconciliation Commission began hearing victims and perpetrators.' }
  ]
};

// Chronological order of the events that have a guide.
export const GUIDE_ORDER = [
  'mansamusa', 'blackdeath', 'columbus1492', 'cabral', 'cortes', 'slavetrade', 'palmares', 'dutch', 'gold',
  'industrialrev', 'minasconspiracy', 'france1789', 'haiti', 'napoleon', 'court', 'independence', 'paraguaywar', 'berlin1884',
  'abolition', 'republic', 'canudos', 'kasato', 'ww1', 'rev1930', 'ww2', 'feb', 'india1947',
  'coldwar', 'brasilia', 'decolonization1960', 'coup64', 'berlinwallfall', 'apartheid'
];
