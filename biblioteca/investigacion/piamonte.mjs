import { N } from '../extra/_h.mjs';

export const F = {
  1: 'https://www.comune.torino.it/amministrazione/museo-nazionale-risorgimento-italiano',
  2: 'https://cultura.gov.it/luogo/museo-nazionale-del-risorgimento-italiano',
  3: 'https://turismotorino.org/en/visit/things-to-do-and-things-to-see/museums-and-heritage/borgo-e-rocca-medievale',
};
export const enlaces = {};
export const consejos = {
  'valentino':'Pasead por el parque junto al Po. El Borgo Medievale y la fortaleza están cerrados por restauración. Consultad la ficha de Turismo de Turín antes de contar con la visita interior.',
  'risorgimento-carignano':'Buscad la entrada en Palazzo Carignano, Via Accademia delle Scienze 5.',
};
export const fuentesAct = {'valentino':[3], 'risorgimento-carignano':[1,2]};
export const rutas = [];
export const sitios = [];
export const ajustes = {
  valentino:{
    nombre:'Parco del Valentino y paseo junto al Po',
    descripcion:'Recorred la ribera del Po dentro del parque. Podéis acercaros al Borgo Medievale por fuera mientras duren las obras.',
    consejo:consejos.valentino,
  },
};
export const nuevas = [
  N('risorgimento-carignano','Museo del Risorgimento en Palazzo Carignano','Turín','torino','cultura','2h','cualquiera','medio',
    'Recorred las salas del palacio barroco para entender la unificación italiana a través de sus protagonistas y documentos.',null,[],{q:'Museo Nazionale del Risorgimento Italiano, Palazzo Carignano, Torino'}),
];
