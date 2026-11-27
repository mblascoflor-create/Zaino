import { N } from '../extra/_h.mjs';
const C = 'https://www.civitatis.com/es/roma/';
export const F = {
  1: 'https://www.mochileandoporelmundo.com/3-dias-en-roma-el-mejor-itinerario/',
  2: 'https://www.mochileandoporelmundo.com/restaurantes-donde-comer-en-trastevere-bien-y-barato/',
  3: 'https://www.conociendoitalia.com/roma-donde-comer-platos-tipicos/',
  4: 'https://www.civitatis.com/es/roma/'
};
export const enlaces = {
  'coliseo-foro': [['Civitatis','Visita guiada por el Coliseo, Foro y Palatino',C+'visita-guiada-roma-antigua/','2 h 30 min – 3 h'],['Civitatis','Tour por el Coliseo con acceso a la Arena + Foro y Palatino',C+'tour-coliseo-arena-gladiadores/','2 h 30 min – 3 h'],['Civitatis','Entradas al Coliseo, Foro y Palatino con audioguía',C+'entradas-coliseo-foro-palatino/',''],['Civitatis','Free tour por la Roma Imperial',C+'free-tour-roma-imperial/','2 h']],
  'vaticano': [['Civitatis','Visita guiada por los Museos Vaticanos y la Capilla Sixtina',C+'visita-guiada-vaticano/','2 h 30 min – 3 h'],['Civitatis','Entradas a los Museos Vaticanos y la Capilla Sixtina sin colas',C+'entradas-museos-vaticanos-capilla-sixtina/',''],['Civitatis','Museos Vaticanos, Capilla Sixtina y Basílica de San Pedro',C+'museos-vaticanos-capilla-sixtina-san-pedro/','2 h 30 min – 3 h 30 min']],
  'san-pedro': [['Civitatis','Visita guiada por la Basílica de San Pedro',C+'subida-cupula-san-pedro/','2 h – 2 h 30 min'],['Civitatis','Free tour por los alrededores del Vaticano',C+'free-tour-vaticano/','1 h 15 min – 1 h 30 min']],
  'san-pedro-cupula': [['Civitatis','Visita guiada por la Basílica de San Pedro (con subida a la cúpula)',C+'subida-cupula-san-pedro/','2 h – 2 h 30 min']],
  'trevi-panteon': [['Civitatis','Free tour por Roma',C+'free-tour-roma/','1 h 30 min – 2 h'],['Civitatis','Free tour nocturno por Roma',C+'free-tour-nocturno-roma/','2 h'],['Civitatis','Entrada al Panteón de Agripa sin colas',C+'entrada-panteon-agripa-audioguia/','']],
  'trastevere-paseo': [['Civitatis','Tour gastronómico por el barrio del Trastevere',C+'tour-gastronomico-barrio-trastevere/','2 – 3 h']],
  'barrio-judio': [['Civitatis','Visita guiada por el Trastevere y el barrio judío',C+'visita-guiada-barrio-judio/','2 h 30 min – 3 h']],
  'castel-santangelo': [['Civitatis','Tour por el Castillo de Sant\'Angelo con subida a la terraza',C+'visita-castillo-sant-angelo/','2 – 3 h'],['Civitatis','Entradas al Castillo de Sant\'Angelo con audioguía',C+'entrada-castillo-sant-angelo-audioguia/','']],
  'galleria-borghese': [['Civitatis','Entradas a la Galería Borghese con audioguía',C+'entradas-galeria-borghese/','2 h']],
  'appia-antica': [['Civitatis','Catacumbas de la Vía Appia + San Sebastián y San Pablo Extramuros',C+'excursion-catacumbas-roma/','3 h']],
  'campidoglio': [['Civitatis','Free tour de los misterios y leyendas de Roma',C+'free-tour-misterios-leyendas/','2 h – 2 h 30 min']]
};
export const consejos = {
  'coliseo-foro': 'Reservad la entrada (o la visita guiada) con antelación: es de lo más demandado de Roma. Llegar a primera hora ahorra parte de la cola.',
  'vaticano': 'Reservad con antelación. No os agotéis en las primeras salas: la Capilla Sixtina está al final del recorrido.',
  'trevi-panteon': 'Trevi y Navona, mejor muy temprano o de noche. El Panteón ya es de pago: compradlo online o id a primera hora.',
  'caravaggio-gratis': 'San Luigi dei Francesi es gratis y está a dos calles del Panteón: juntadlos.',
  'trastevere-paseo': 'Para cenar en Trastevere, reservad mesa.',
  'campo-fiori': 'Si llegáis temprano a Navona, hay mucha menos gente que a media mañana.'
};
export const fuentesAct = { 'coliseo-foro': [1], 'vaticano': [1], 'trevi-panteon': [1], 'caravaggio-gratis': [1], 'trastevere-paseo': [1, 2], 'campo-fiori': [1] };
// Recorridos a pie de un día que propone la guía [1]
export const rutas = [
  ['Centro barroco', ['campo-fiori','caravaggio-gratis','trevi-panteon','plaza-espana-popolo','pincio']],
  ['Roma antigua', ['coliseo-foro','campidoglio','barrio-judio']],
  ['Vaticano y Trastevere', ['castel-santangelo','san-pedro','vaticano','gianicolo','trastevere-paseo']]
];
export const sitios = [
  ['Trastevere','Tonnarello','trattoria','Via della Paglia, 1','cacio e pepe (en la sartén), carciofi alla giudia',[2]],
  ['Trastevere','Antica Trattoria da Carlone','trattoria','Via della Cisterna, 13','amatriciana, carbonara, coda alla vaccinara',[2]],
  ['Trastevere','Osteria Nannarella','osteria','Piazza di San Calisto, 7/a','rigatoni all\'amatriciana',[2]],
  ['Trastevere','Trattoria Da Enzo al 29','trattoria','Via dei Vascellari, 29','fiori di zucca fritti, cacio e pepe, gricia',[2]],
  ['Trastevere','Pizzeria La Boccaccia','pizza al taglio','Via di San Francesco a Ripa, 21','pizza al taglio',[2]],
  ['Roma','Pompi','pasteleria','Via della Croce (Piazza di Spagna)','tiramisú',[1]],
  ['Roma','Mercato Centrale Roma','mercado','Estación de Termini','pizza al taglio, supplì, panini',[3]]
];
export const nuevas = [
  N('torre-argentina','Largo di Torre Argentina','Roma','centro','cultura','1h','cualquiera','gratis','Cuatro templos republicanos hundidos en mitad del tráfico, donde mataron a Julio César; hoy viven allí decenas de gatos.',[41.8955,12.4767],[],{}),
  N('sant-ignazio','Sant\'Ignazio y su falsa cúpula','Roma','centro','cultura','1h','cualquiera','gratis','Una iglesia cuyo techo pintado engaña al ojo: la cúpula no existe. Hay un espejo en el suelo para verla sin dejarse el cuello.',[41.8992,12.4797],[],{}),
  N('mercati-traiano','Mercados de Trajano y Via dei Fori Imperiali','Roma','centro','cultura','2h','cualquiera','bajo','El «centro comercial» de la Roma imperial, en semicírculo de ladrillo, y la avenida de Mussolini que atraviesa los foros.',[41.8955,12.4865],[['Columna de Trajano',41.8958,12.4843],['Mercados de Trajano',41.8955,12.4865],['Via dei Fori Imperiali',41.8925,12.4880]],{consejo:'El museo es de pago; desde la acera se ve casi todo gratis.'})
];
