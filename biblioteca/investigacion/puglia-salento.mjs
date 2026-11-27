import { N, VERANO, TEMP } from '../extra/_h.mjs';
const C = 'https://www.civitatis.com/es/';
export const F = {
  1: 'https://www.mochileandoporelmundo.com/itinerario-puglia-1-semana/',
  2: 'https://www.conociendoitalia.com/apulia-en-10-dias-itinerario/',
  3: 'https://www.mochileandoporelmundo.com/mejores-cosas-que-ver-y-hacer-en-puglia-apulia/',
  4: 'https://www.tripadvisor.es/Attractions-g187874-Activities-Bari_Province_of_Bari_Puglia.html',
  5: 'https://www.civitatis.com/es/apulia/',
  6: 'https://www.mochileandoporelmundo.com/restaurantes-donde-comer-en-bari/',
  7: 'https://www.conociendoitalia.com/donde-comer-en-bari/',
  8: 'https://www.scattidigusto.it/lecce-5-migliori-trattorie'
};
export const enlaces = {
  'bari-san-nicola': [['Civitatis','Free tour por Bari',C+'bari/free-tour-bari/','2 h'],['Civitatis','Visita guiada por Bari',C+'bari/visita-guiada-bari/','2 h']],
  'bari-street-food': [['Civitatis','Tour gastronómico por Bari',C+'bari/tour-gastronomico-bari/','3 h']],
  'bari-orecchiette': [['Civitatis','Demostración de elaboración de pasta con degustación',C+'bari/clase-pasta-comida/','2 h 30 min']],
  'bari-lungomare-murat': [['Civitatis','Tour en bicicleta por Bari',C+'bari/tour-bicicleta-bari/','2 h'],['Civitatis','Paseo en velero por la costa de Bari con aperitivo',C+'bari/paseo-velero-costa-bari/','3 h']],
  'polignano-grutas-barco': [['Civitatis','Paseo en barco por Polignano a Mare',C+'polignano-mare/paseo-barco-polignano-mare/','1 h 30 min'],['Civitatis','Paseo en gozzo por las cuevas de Polignano a Mare',C+'monopoli/paseo-gozzo-cuevas-polignano-mare/','2 h 30 min'],['Civitatis','Paseo en velero por Polignano a Mare',C+'polignano-mare/paseo-velero-polignano-mare/','3 h 30 min']],
  'polignano-lama-monachile': [['Civitatis','Visita guiada por Polignano a Mare con degustación de productos típicos',C+'polignano-mare/visita-guiada-polignano-mare/','2 h 30 min'],['Civitatis','Excursión a Polignano a Mare + Paseo en barco (desde Bari)',C+'bari/excursion-polignano-mare-paseo-barco/','6 h']],
  'monopoli': [['Civitatis','Visita guiada por Monopoli',C+'monopoli/visita-guiada-monopoli/','1 h'],['Civitatis','Paseo en barco por Monopoli (baño y snorkel)',C+'monopoli/barco-snorkel-monopoli-polignano-mare/','2 h']],
  'alberobello-trulli': [['Civitatis','Visita guiada por Alberobello y sus trullos',C+'alberobello/visita-guiada-alberobello-trullos/','1 h'],['Civitatis','Excursión a Alberobello (desde Bari)',C+'bari/excursion-alberobello/','6 h'],['Civitatis','Excursión a Alberobello, Monopoli y Polignano a Mare (desde Bari)',C+'bari/excursion-alberobello-monopoli-polignano-mare/','7 h 30 min']],
  'locorotondo': [['Civitatis','Excursión en bicicleta eléctrica a Locorotondo',C+'alberobello/excursion-bicicleta-electrica-locorotondo/','3 h'],['Civitatis','Excursión a Alberobello, Martina Franca y Locorotondo (desde Bari)',C+'bari/excursion-alberobello-martina-franca-locorotondo/','6 h 15 min']],
  'martina-franca': [['Civitatis','Cata de vinos en el valle de Itria',C+'martina-franca/cata-vinos-valle-itria/','2 h']],
  'ostuni-citta-bianca': [['Civitatis','Visita guiada por Ostuni',C+'ostuni/visita-guiada-ostuni/','1 h'],['Civitatis','Cata de aceite de oliva',C+'ostuni/cata-aceite-masseria-bracanti/','1 h 10 min'],['Civitatis','Excursión a Ostuni, Polignano a Mare y Cisternino (desde Bari)',C+'bari/excursion-ostuni-polignano-mare-cisternino/','7 h 30 min']],
  'lecce-barocco': [['Civitatis','Visita guiada por Lecce',C+'lecce/visita-guiada-lecce/','1 h 30 min'],['Civitatis','Tour del barroco + Museo Judío de Lecce',C+'lecce/tour-barroco-museo-judio/','2 h'],['Civitatis','Tour gastronómico por Lecce en bicicleta',C+'lecce/tour-bicicleta-lecce/','3 h']],
  'otranto': [['Civitatis','Visita guiada por Otranto',C+'otranto/visita-guiada-otranto/','1 h 30 min'],['Civitatis','Excursión a Gallipoli, Otranto, Leuca y Galatina (desde Lecce)',C+'lecce/excursion-gallipoli-otranto-leuca-galatina/','8 h']],
  'gallipoli-centro': [['Civitatis','Excursión por la Costa Jónica (desde Lecce)',C+'lecce/excursion-costa-jonica/','5 h']],
  'castel-del-monte': [['Civitatis','Excursión a Castel del Monte (desde Trani)',C+'trani/excursion-castel-monte/','3 h']],
  'trani-catedral': [['Civitatis','Visita guiada por Trani',C+'trani/visita-guiada-trani/','1 h 30 min'],['Civitatis','Visita a una bodega de Trani con cata de vinos',C+'trani/visita-bodega-trani-cata-vinos/','1 h']],
  'altamura': [['Civitatis','Visita guiada por Altamura (con degustación de pan)',C+'altamura/visita-guiada-altamura/','2 h']],
  'porto-selvaggio': [['Civitatis','Tour en bicicleta por Alezio, Tuglie y Porto Selvaggio',C+'gallipoli/tour-bicicleta-alezio-tuglie-porto-selvaggio/','8 h']]
};
export const consejos = {
  'polignano-lama-monachile': 'La cala es de guijarros y cubre enseguida: llevad escarpines y llegad pronto en julio y agosto. En tren desde Bari Centrale se tarda unos 30–40 minutos.',
  'alberobello-trulli': 'Id a primera hora, cuando las calles están vacías: Rione Monti es el que más se llena. De noche, con los trulli iluminados, hay mucha menos gente. Desde Bari hay tren con conexión en bus (Trulli Link).',
  'locorotondo': 'Luce más por la tarde. Fijaos en las «cummerse», las casas de tejado a dos aguas.',
  'ostuni-citta-bianca': 'En verano, evitad el mediodía: no hay sombra. Si vais en coche, aparcad fuera del centro (zona ZTL).',
  'lecce-barocco': 'Piazza del Duomo se ve mejor temprano o al caer la tarde. Lecce es llana: se recorre andando o en bici.',
  'otranto': 'Calzado cómodo y escarpines para las calas de roca. Si tenéis coche, el faro de Punta Palascìa al amanecer.',
  'gallipoli-baia-verde': 'En agosto, reservad el lido si queréis hamaca.',
  'bari-orecchiette': 'En Bari Vecchia, huid del primer restaurante pensado para turistas.',
  'monopoli': 'Está a una parada de tren de Polignano: se pueden hacer los dos el mismo día.'
};
export const fuentesAct = {
  'polignano-lama-monachile': [2], 'alberobello-trulli': [1, 2], 'locorotondo': [2], 'ostuni-citta-bianca': [2], 'lecce-barocco': [2], 'otranto': [1, 2], 'monopoli': [2], 'bari-san-nicola': [2, 4], 'gallipoli-baia-verde': [2]
};
export const nuevas = [
  N('cisternino','Cisternino al caer la tarde','Cisternino','ostuni','postal','2h','tarde','gratis','Pueblo blanco del Valle d\'Itria con balcones sobre el valle; famoso por sus «fornelli», carnicerías que te asan la carne al momento.',[40.7425,17.4250],[['Piazza Vittorio Emanuele',40.7420,17.4250],['Chiesa Madre di San Nicola',40.7418,17.4245],['Mirador sobre el Valle d\'Itria',40.7415,17.4235]],{tipos:['gastronomia'],consejo:'Se combina bien con Ostuni el mismo día.'}),
  N('leuca-finibus-terrae','Santa Maria di Leuca: el fin de la tierra','Santa Maria di Leuca','lecce','postal','medio_dia','tarde','gratis','La punta del tacón de Italia: santuario de Finibus Terrae, faro sobre Punta Meliso y villas modernistas en el paseo. Al atardecer, barcos a las cuevas marinas.',[39.7960,18.3580],[['Santuario de Santa Maria de Finibus Terrae',39.7965,18.3590],['Faro de Leuca',39.7970,18.3580],['Lungomare Cristoforo Colombo',39.7985,18.3560]],{coche:true}),
  N('baia-dei-turchi','Baia dei Turchi','Otranto','lecce','playa','medio_dia','cualquiera','gratis','Cala de arena entre pinares y agua turquesa al norte de Otranto, dentro de un oasis protegido.',[40.1895,18.4630],[],{coche:true,meses:VERANO}),
  N('punta-palascia','Faro de Punta Palascìa','Otranto','lecce','postal','1h','manana','gratis','El punto más oriental de Italia: un faro sobre el acantilado donde se ve salir el sol antes que en el resto del país.',[40.1070,18.5180],[],{coche:true,consejo:'Al amanecer o al atardecer.'}),
  N('marina-serra','Piscinas naturales de Marina Serra','Tricase','lecce','playa','2h','cualquiera','gratis','Pozas de agua de mar talladas en la roca, en la costa adriática del sur del Salento.',[39.9220,18.4130],[],{coche:true,meses:VERANO})
];
// Sitios concretos para comer: [donde, nombre, tipo, dirección, qué pedir, fuentes]
export const sitios = [
  ['Bari','Panificio Fiore','panaderia','Strada Palazzo di Città, 38','focaccia barese, focaccia bianca, taralli',[6,7]],
  ['Bari','Mastro Ciccio','street','','panino con polpo',[6]],
  ['Bari','La Uascèzze','trattoria','Corte Sant\'Agostino, 2','tiella de patatas, arroz y mejillones; fave e cicoria',[6,7]],
  ['Bari','La Cantina dello Zio','trattoria','Strada Palazzo di Città, 51','orecchiette, pulpo a la brasa, parmigiana',[6,7]],
  ['Bari','Gelateria Gentile','gelateria','','pistacho, almendra',[6]],
  ['Bari','Antò Cucina e Sapori Tipici','trattoria','Strada Palazzo di Città, 14','orecchiette con cime di rapa, patate riso e cozze',[7]],
  ['Bari','La Tana del Polpo','street','Strada Vallisa, 50','panino de pulpo a la brasa, fritura mixta',[7]],
  ['Bari','Al Sorso Preferito','trattoria','Via Vito Nicola De Nicolò, 40','spaghetti all\'assassina',[7]],
  ['Bari','Boutique dei Frutti di Mare','street','Lungomare Cristoforo Colombo, 10','gambas rojas crudas, ostras, erizos en temporada',[7]],
  ['Bari','Panzeropoli by Benny','friggitoria','Piazza Mercantile','panzerotto de mozzarella y tomate',[7]],
  ['Bari','La Puccia','street','Bari Vecchia','puccia con pulpo a la brasa',[7]],
  ['Bari','Pizzeria Enzo e Ciro','pizzeria','Via Matteo Renato Imbriani, 79','margherita, pizza con burrata',[7]],
  ['Lecce','Alle due Corti','trattoria','Corte dei Giugni, 1','ciceri e tria, sagna \'ncannulata, fritti te l\'uertu',[8]],
  ['Lecce','Arte dei Sapori','trattoria','Vico degli Alami, 3','pescado en costra de arcilla',[8]],
  ['Lecce','La Scarpetta Hostaria','osteria','Via Principi di Savoia, 5','spaghetti ai ricci di mare',[8]],
  ['Lecce','Osteria degli Spiriti','osteria','Via Battisti, 4','frittini, ciceri e tria, orecchiette',[8]],
  ['Lecce','Mercato di Porta Rudiae','street','Via Adua, 62','rustico leccese, pasticciotto, focacce',[8]]
];
