// Regions of the time slice. They are the 12 regions of Biraben's population table (1980),
// so that the width of every band comes from a single source. Each present-day country belongs to one region.
import { COUNTRIES } from '../data/countries.js';

export const REGIONS = [
  { id: 'na', name: 'North America' },
  { id: 'la', name: 'Latin America' },
  { id: 'eu', name: 'Europe' },
  { id: 'naf', name: 'North Africa' },
  { id: 'ssa', name: 'Sub-Saharan Africa' },
  { id: 'me', name: 'Southwest Asia' },
  { id: 'ru', name: 'Russia and Central Asia' },
  { id: 'in', name: 'India' },
  { id: 'sea', name: 'Southeast Asia and Korea' },
  { id: 'cn', name: 'China' },
  { id: 'jp', name: 'Japan' },
  { id: 'oc', name: 'Oceania' }
];
export const REGION = Object.fromEntries(REGIONS.map((r, i) => [r.id, { ...r, i }]));

/* present-day country (Natural Earth name) -> [region, display name] */
export const COUNTRY = {
  'Fiji': ['oc', 'Fiji'], 'Tanzania': ['ssa', 'Tanzania'], 'W. Sahara': ['naf', 'Western Sahara'], 'Canada': ['na', 'Canada'],
  'United States of America': ['na', 'United States'], 'Kazakhstan': ['ru', 'Kazakhstan'], 'Uzbekistan': ['ru', 'Uzbekistan'],
  'Papua New Guinea': ['oc', 'Papua New Guinea'], 'Indonesia': ['sea', 'Indonesia'], 'Argentina': ['la', 'Argentina'], 'Chile': ['la', 'Chile'],
  'Dem. Rep. Congo': ['ssa', 'Democratic Republic of the Congo'], 'Somalia': ['ssa', 'Somalia'], 'Kenya': ['ssa', 'Kenya'], 'Sudan': ['ssa', 'Sudan'],
  'Chad': ['ssa', 'Chad'], 'Haiti': ['la', 'Haiti'], 'Dominican Rep.': ['la', 'Dominican Republic'], 'Russia': ['ru', 'Russia'],
  'Bahamas': ['la', 'Bahamas'], 'Falkland Is.': ['la', 'Falkland Islands'], 'Norway': ['eu', 'Norway'], 'Greenland': ['na', 'Greenland'],
  'Fr. S. Antarctic Lands': ['oc', 'French Southern and Antarctic Lands'], 'Timor-Leste': ['sea', 'Timor-Leste'], 'South Africa': ['ssa', 'South Africa'],
  'Lesotho': ['ssa', 'Lesotho'], 'Mexico': ['la', 'Mexico'], 'Uruguay': ['la', 'Uruguay'], 'Brazil': ['la', 'Brazil'], 'Bolivia': ['la', 'Bolivia'],
  'Peru': ['la', 'Peru'], 'Colombia': ['la', 'Colombia'], 'Panama': ['la', 'Panama'], 'Costa Rica': ['la', 'Costa Rica'], 'Nicaragua': ['la', 'Nicaragua'],
  'Honduras': ['la', 'Honduras'], 'El Salvador': ['la', 'El Salvador'], 'Guatemala': ['la', 'Guatemala'], 'Belize': ['la', 'Belize'],
  'Venezuela': ['la', 'Venezuela'], 'Guyana': ['la', 'Guyana'], 'Suriname': ['la', 'Suriname'], 'France': ['eu', 'France'], 'Ecuador': ['la', 'Ecuador'],
  'Puerto Rico': ['la', 'Puerto Rico'], 'Jamaica': ['la', 'Jamaica'], 'Cuba': ['la', 'Cuba'], 'Zimbabwe': ['ssa', 'Zimbabwe'], 'Botswana': ['ssa', 'Botswana'],
  'Namibia': ['ssa', 'Namibia'], 'Senegal': ['ssa', 'Senegal'], 'Mali': ['ssa', 'Mali'], 'Mauritania': ['ssa', 'Mauritania'], 'Benin': ['ssa', 'Benin'],
  'Niger': ['ssa', 'Niger'], 'Nigeria': ['ssa', 'Nigeria'], 'Cameroon': ['ssa', 'Cameroon'], 'Togo': ['ssa', 'Togo'], 'Ghana': ['ssa', 'Ghana'],
  "Côte d'Ivoire": ['ssa', "Côte d'Ivoire"], 'Guinea': ['ssa', 'Guinea'], 'Guinea-Bissau': ['ssa', 'Guinea-Bissau'], 'Liberia': ['ssa', 'Liberia'],
  'Sierra Leone': ['ssa', 'Sierra Leone'], 'Burkina Faso': ['ssa', 'Burkina Faso'], 'Central African Rep.': ['ssa', 'Central African Republic'],
  'Congo': ['ssa', 'Republic of the Congo'], 'Gabon': ['ssa', 'Gabon'], 'Eq. Guinea': ['ssa', 'Equatorial Guinea'], 'Zambia': ['ssa', 'Zambia'], 'Malawi': ['ssa', 'Malawi'],
  'Mozambique': ['ssa', 'Mozambique'], 'eSwatini': ['ssa', 'Eswatini'], 'Angola': ['ssa', 'Angola'], 'Burundi': ['ssa', 'Burundi'], 'Israel': ['me', 'Israel'],
  'Lebanon': ['me', 'Lebanon'], 'Madagascar': ['ssa', 'Madagascar'], 'Palestine': ['me', 'Palestine'], 'Gambia': ['ssa', 'Gambia'], 'Tunisia': ['naf', 'Tunisia'],
  'Algeria': ['naf', 'Algeria'], 'Jordan': ['me', 'Jordan'], 'United Arab Emirates': ['me', 'United Arab Emirates'], 'Qatar': ['me', 'Qatar'],
  'Kuwait': ['me', 'Kuwait'], 'Iraq': ['me', 'Iraq'], 'Oman': ['me', 'Oman'], 'Vanuatu': ['oc', 'Vanuatu'], 'Cambodia': ['sea', 'Cambodia'],
  'Thailand': ['sea', 'Thailand'], 'Laos': ['sea', 'Laos'], 'Myanmar': ['sea', 'Myanmar'], 'Vietnam': ['sea', 'Vietnam'], 'North Korea': ['sea', 'North Korea'],
  'South Korea': ['sea', 'South Korea'], 'Mongolia': ['sea', 'Mongolia'], 'India': ['in', 'India'], 'Bangladesh': ['in', 'Bangladesh'], 'Bhutan': ['in', 'Bhutan'],
  'Nepal': ['in', 'Nepal'], 'Pakistan': ['in', 'Pakistan'], 'Afghanistan': ['me', 'Afghanistan'], 'Tajikistan': ['ru', 'Tajikistan'],
  'Kyrgyzstan': ['ru', 'Kyrgyzstan'], 'Turkmenistan': ['ru', 'Turkmenistan'], 'Iran': ['me', 'Iran'], 'Syria': ['me', 'Syria'], 'Armenia': ['ru', 'Armenia'],
  'Sweden': ['eu', 'Sweden'], 'Belarus': ['ru', 'Belarus'], 'Ukraine': ['ru', 'Ukraine'], 'Poland': ['eu', 'Poland'], 'Austria': ['eu', 'Austria'],
  'Hungary': ['eu', 'Hungary'], 'Moldova': ['ru', 'Moldova'], 'Romania': ['eu', 'Romania'], 'Lithuania': ['ru', 'Lithuania'], 'Latvia': ['ru', 'Latvia'],
  'Estonia': ['ru', 'Estonia'], 'Germany': ['eu', 'Germany'], 'Bulgaria': ['eu', 'Bulgaria'], 'Greece': ['eu', 'Greece'], 'Turkey': ['me', 'Turkey'],
  'Albania': ['eu', 'Albania'], 'Croatia': ['eu', 'Croatia'], 'Switzerland': ['eu', 'Switzerland'], 'Luxembourg': ['eu', 'Luxembourg'], 'Belgium': ['eu', 'Belgium'],
  'Netherlands': ['eu', 'Netherlands'], 'Portugal': ['eu', 'Portugal'], 'Spain': ['eu', 'Spain'], 'Ireland': ['eu', 'Ireland'],
  'New Caledonia': ['oc', 'New Caledonia'], 'Solomon Is.': ['oc', 'Solomon Islands'], 'New Zealand': ['oc', 'New Zealand'], 'Australia': ['oc', 'Australia'],
  'Sri Lanka': ['in', 'Sri Lanka'], 'China': ['cn', 'China'], 'Taiwan': ['cn', 'Taiwan'], 'Italy': ['eu', 'Italy'], 'Denmark': ['eu', 'Denmark'],
  'United Kingdom': ['eu', 'United Kingdom'], 'Iceland': ['eu', 'Iceland'], 'Azerbaijan': ['ru', 'Azerbaijan'], 'Georgia': ['ru', 'Georgia'],
  'Philippines': ['sea', 'Philippines'], 'Malaysia': ['sea', 'Malaysia'], 'Brunei': ['sea', 'Brunei'], 'Slovenia': ['eu', 'Slovenia'], 'Finland': ['eu', 'Finland'],
  'Slovakia': ['eu', 'Slovakia'], 'Czechia': ['eu', 'Czechia'], 'Eritrea': ['ssa', 'Eritrea'], 'Japan': ['jp', 'Japan'], 'Paraguay': ['la', 'Paraguay'],
  'Yemen': ['me', 'Yemen'], 'Saudi Arabia': ['me', 'Saudi Arabia'], 'N. Cyprus': ['me', 'Northern Cyprus'], 'Cyprus': ['me', 'Cyprus'],
  'Morocco': ['naf', 'Morocco'], 'Egypt': ['naf', 'Egypt'], 'Libya': ['naf', 'Libya'], 'Ethiopia': ['ssa', 'Ethiopia'], 'Djibouti': ['ssa', 'Djibouti'],
  'Somaliland': ['ssa', 'Somaliland'], 'Uganda': ['ssa', 'Uganda'], 'Rwanda': ['ssa', 'Rwanda'], 'Bosnia and Herz.': ['eu', 'Bosnia and Herzegovina'],
  'Macedonia': ['eu', 'North Macedonia'], 'Serbia': ['eu', 'Serbia'], 'Montenegro': ['eu', 'Montenegro'], 'Kosovo': ['eu', 'Kosovo'],
  'Trinidad and Tobago': ['la', 'Trinidad and Tobago'], 'S. Sudan': ['ssa', 'South Sudan']
};

const inRing = (ring, x, y) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const BOXES = Object.entries(COUNTRIES).map(([name, rings]) => {
  let x0 = 999, x1 = -999, y0 = 999, y1 = -999;
  for (const r of rings) for (const [x, y] of r) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return { name, rings, x0, x1, y0, y1 };
});

/* present-day country containing the point; at sea, the country with the nearest vertex (up to about 12°) */
export function countryAt(lon, lat) {
  for (const b of BOXES) {
    if (lon < b.x0 || lon > b.x1 || lat < b.y0 || lat > b.y1) continue;
    if (b.rings.some(r => inRing(r, lon, lat))) return b.name;
  }
  let best = null, bd = 144;
  const k = Math.cos(lat * Math.PI / 180);
  for (const b of BOXES) {
    if (lon < b.x0 - 12 || lon > b.x1 + 12 || lat < b.y0 - 12 || lat > b.y1 + 12) continue;
    for (const r of b.rings) for (const [x, y] of r) { const d = ((x - lon) * k) ** 2 + (y - lat) ** 2; if (d < bd) { bd = d; best = b.name; } }
  }
  return best;
}

export function regionAt(lon, lat) {
  const c = countryAt(lon, lat), r = c && COUNTRY[c]?.[0];
  if (r) {
    if (r === 'eu' && lon < -30) return 'la';                 // French Guiana comes along with France
    if (r === 'ru' && lon < -30) return 'na';
    return r;
  }
  if (lat < -60) return null;                                  // Antarctica
  if (lon < -125 || lon > 150) return 'oc';
  if (lon < -25) return lat > 30 ? 'na' : 'la';
  if (lon < 45) return lat > 36 ? 'eu' : 'ssa';
  return lat < -10 ? 'oc' : 'sea';
}
