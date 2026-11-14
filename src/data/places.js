// Texts for the clickable places on the map. Keys: 'lm:<id>' monuments, 'wp:<id>' world landmarks, 'civ:<name>' states and peoples
// of the pieces, 'st:<name>' states on the period maps, 'city:<name>' cities, 'reg:<name>' stateless peoples.
// Gathers all the files in src/data/places/ (each exports an object key → { txt, ev? }).
const mods = import.meta.glob('./places/*.js', { eager: true });
export const PLACES = Object.assign({}, ...Object.values(mods).flatMap(m => Object.values(m)));
