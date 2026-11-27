import { N } from '../extra/_h.mjs';

export const F = {
  1: 'https://www.bolognawelcome.com/it/places/museums-and-art-galleries/museo-per-la-memoria-di-ustica',
  2: 'https://www.bolognawelcome.com/en/places/archaeological-sites/archaeological-excavations-in-salaborsa',
  3: 'https://www.bolognawelcome.com/es/lugares/edificios-religiosos/monasterio-de-san-michele-in-bosco',
  4: 'https://www.bolognawelcome.com/en/places/towers-historic-buildings/torre-accursi-o-dellorologio-2',
  5: 'https://www.bolognawelcome.com/es/lugares/torres-edificios-historicos/las-dos-torres-garisenda-y-asinelli',
};
export const fuentesAct = {
  'ustica-memoria':[1], 'salaborsa-excavaciones':[2], 'san-michele-bosco':[3], 'torre-reloj-bolonia':[4], 'torre-asinelli':[5],
};
export const consejos = {
  'ustica-memoria':'Comprobad los días de apertura antes de ir: el museo abre solo parte de la semana.',
  'salaborsa-excavaciones':'Buscad el acceso al subsuelo desde la biblioteca, en Piazza Nettuno.',
  'san-michele-bosco':'Salid al atrio para ver los tejados de Bolonia desde la colina.',
  'torre-reloj-bolonia':'Consultad los turnos de acceso a la torre y el horario de las colecciones si queréis combinar las dos visitas.',
  'torre-asinelli':'La subida está cerrada hasta nuevo aviso. Para una vista desde lo alto, buscad la Torre del Reloj en Piazza Maggiore.',
};
export const ajustes = {
  'torre-asinelli': {
    nombre:'Las Dos Torres desde Piazza di Porta Ravegnana',
    descripcion:'Ved desde la plaza la Asinelli y la Garisenda, las dos torres medievales más conocidas de Bolonia. La subida a la Asinelli está cerrada por obras.',
    duracion:'1h', coste:'gratis', esfuerzo:'bajo', requiere_reserva:false,
    enlace:F[5], enlace_tipo:'oficial', consejo:consejos['torre-asinelli'],
  },
};
export const enlaces = {};
export const sitios = [];
export const rutas = [['De Piazza Maggiore a las Dos Torres', ['plaza-maggiore','salaborsa-excavaciones','torre-asinelli']]];
export const nuevas = [
  N('ustica-memoria','Museo para la Memoria de Ustica','Bolonia','bologna','cultura','1h','cualquiera','gratis',
    'Una instalación de Christian Boltanski rodea los restos del avión, con luces, espejos y voces que recuerdan a sus pasajeros.',null,[],{q:'Museo per la Memoria di Ustica, Via di Saliceto 5, Bologna'}),
  N('salaborsa-excavaciones','Excavaciones bajo la biblioteca Salaborsa','Bolonia','bologna','cultura','1h','tarde','bajo',
    'Bajad al subsuelo de la biblioteca para ver los restos de las distintas ciudades que ocuparon Piazza Nettuno.',null,[],{q:'Scavi archeologici di Salaborsa, Piazza del Nettuno 3, Bologna'}),
  N('torre-reloj-bolonia','Torre del Reloj de Bolonia','Bolonia','bologna','postal','1h','cualquiera','bajo',
    'Subid a las terrazas de Palazzo d’Accursio para ver Piazza Maggiore desde arriba y conocer el mecanismo del reloj.',null,[],{q:'Torre dell’Orologio, Piazza Maggiore 6, Bologna'}),
];
