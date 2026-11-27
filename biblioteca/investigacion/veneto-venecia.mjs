import { N } from '../extra/_h.mjs';

export const F = {
  1: 'https://www.veneziaunica.it/en/things-to-do-in-venice/itineraries/giudecca-island-beauty-on-water',
  2: 'https://www.veneziaunica.it/it/cosa-fare-a-venezia/giardini-parchi-oasi-naturali/pineta-di-sant-elena',
  3: 'https://www.veneziaunica.it/en/things-to-do-in-venice/public-transport',
  4: 'https://www.visitvenezia.eu/en/venetianity/walk-venice/places-to-visit-in-venice-fondamenta-delle-zattere',
  5: 'https://www.veneziaunica.it/it/cosa-fare-a-venezia/musei-civici-di-venezia/museo-di-storia-naturale',
  6: 'https://www.veneziaunica.it/en/things-to-do-in-venice/itineraries/castello-naval-art-and-traditions',
};
export const enlaces = {
  'san-marco-ducal': [['Civitatis', 'Visita guiada por el Palacio Ducal, Basílica de San Marcos y una fábrica de cristal', 'https://www.civitatis.com/es/venecia/palacio-ducal-basilica-san-marcos-fabrica-cristal/', '2 h']],
};
export const consejos = {
  'san-giorgio-maggiore': 'Mirad el vaporetto de la línea 2 desde Zitelle si venís de la Giudecca.',
  'burano-murano': 'Consultad el mapa de líneas antes de salir: hay conexiones de la laguna que cambian según la temporada.',
  'dorsoduro-paseo': 'Desde las Zattere podéis desviaros al Squero di San Trovaso para ver desde la calle el taller de embarcaciones.',
  'castello-arsenale': 'Si queréis seguir a pie junto a la laguna, enlazad por Via Garibaldi hacia los jardines de Castello.',
};
export const fuentesAct = {
  'san-giorgio-maggiore': [1, 3], 'giudecca': [1], 'burano-murano': [3],
  'gran-canal-vaporetto': [3], 'dorsoduro-paseo': [4], 'castello-arsenale': [6],
  'pineta-sant-elena': [2], 'museo-storia-naturale': [5], 'giardini-marinaressa': [6],
};
export const rutas = [
  ['Castello junto al agua', ['castello-arsenale', 'giardini-marinaressa', 'pineta-sant-elena']],
  ['De la Giudecca a San Giorgio', ['giudecca', 'san-giorgio-maggiore']],
];
export const sitios = [];
export const nuevas = [
  N('pineta-sant-elena', 'Paseo por la pineta de Sant’Elena', 'Venecia', 'venecia', 'naturaleza', '1h', 'cualquiera', 'gratis',
    'Pasead por los caminos de sombra del Parco delle Rimembranze y buscad un banco frente a la laguna, con el Lido al otro lado.', null, [], {q:'Parco delle Rimembranze, Sant’Elena, Venezia'}),
  N('museo-storia-naturale', 'Museo de Historia Natural en el Fontego dei Turchi', 'Venecia', 'venecia', 'cultura', '2h', 'cualquiera', 'medio',
    'Una parada bajo techo en un antiguo edificio del Gran Canal, con colecciones científicas y un jardín recuperado.', null, [], {q:'Museo di Storia Naturale Giancarlo Ligabue, Venezia'}),
  N('giardini-marinaressa', 'Jardines de la Marinaressa', 'Venecia', 'venecia', 'postal', '1h', 'cualquiera', 'gratis',
    'Haced una pausa junto al agua en Castello, entre la zona del Arsenale y los jardines napoleónicos.', null, [], {q:'Giardini della Marinaressa, Venezia'}),
];
