// Investigación de Nápoles y Costa Amalfitana (pendiente de repartir en napoles.mjs y costa-amalfitana.mjs)
const C = 'https://www.civitatis.com/es/';
export const F = {
  1: 'https://www.mochileandoporelmundo.com/restaurantes-donde-comer-en-napoles-barato/',
  2: 'https://www.elviajedesofi.com/comer-napoles/',
  3: 'https://www.mochileandoporelmundo.com/guia-de-viaje-a-la-costa-amalfitana/',
  4: 'https://www.elviajedesofi.com/ruta-costa-amalfitana/',
  5: 'https://www.civitatis.com/es/napoles/',
  6: 'https://www.civitatis.com/es/costa-amalfitana/'
};
export const enlaces = {
  'napoli-sotterranea': [['Civitatis','Tour por los subterráneos de Nápoles',C+'napoles/tour-subterraneos-napoles/','1 h']],
  'pompeya': [['Civitatis','Excursión a Pompeya',C+'napoles/excursion-pompeya/','3 h 30 min – 4 h 30 min'],['Civitatis','Excursión a Pompeya y el Vesubio',C+'napoles/excursion-pompeya-monte-vesubio/','7 – 8 h'],['Civitatis','Excursión a Pompeya y Herculano',C+'napoles/excursion-pompeya-herculano/','8 h']],
  'spaccanapoli': [['Civitatis','Free tour por Nápoles',C+'napoles/free-tour-napoles/','2 – 3 h'],['Civitatis','Free tour por el Nápoles antiguo',C+'napoles/free-tour-napoles-antiguo/','2 h – 2 h 15 min']],
  'plebiscito-castel-nuovo': [['Civitatis','Tour por el Nápoles imprescindible',C+'napoles/tour-napoles/','2 h 15 min']],
  'capri': [['Civitatis','Excursión a Capri y Anacapri (desde Nápoles)',C+'napoles/excursion-capri-anacapri/','8 h'],['Civitatis','Excursión a Capri + Gruta Azul (desde Sorrento)',C+'sorrento/excursion-isla-capri/','8 h']],
  'anacapri': [['Civitatis','Excursión a Capri y Anacapri + telesilla del Monte Solaro',C+'napoles/excursion-capri-anacapri-telesilla/','8 h']],
  'herculano': [['Civitatis','Excursión a Herculano (desde Sorrento)',C+'sorrento/excursion-herculano/','4 h']],
  'barco-excursion': [['Civitatis','Excursión en barco a Amalfi y Positano (desde Sorrento)',C+'sorrento/excursion-barco-costa-amalfitana/','8 – 9 h'],['Civitatis','Paseo en barco por la Costa Amalfitana (desde Salerno)',C+'salerno/paseo-barco-costa-amalfitana/','6 h']],
  'positano-spiaggia-grande': [['Civitatis','Paseo en barco por la Costa Amalfitana al atardecer (Positano)',C+'positano/paseo-barco-costa-amalfitana-atardecer/','2 h']],
  'capri-ferry': [['Civitatis','Excursión a Capri (desde Positano)',C+'positano/excursion-capri/','8 h'],['Civitatis','Excursión a Capri y las islas de Li Galli (desde Amalfi)',C+'amalfi/excursion-capri-li-galli/','7 h']],
  'villa-rufolo': [['Civitatis','Excursión a Amalfi y Ravello (desde Salerno)',C+'salerno/excursion-amalfi-ravello/','8 h']],
  'pizza-sfogliatella': [['Civitatis','Taller de pizza italiana en Nápoles',C+'napoles/taller-pizza-italiana/',''],['Civitatis','Visita guiada por el mercado gastronómico de Nápoles',C+'napoles/visita-guiada-napoles-mercado-gastronomico/','']]
};
export const consejos = {
  'pizza-sfogliatella': 'Da Michele y Brandi tienen colas de 45 minutos a 2 horas: id sobre las 11:30 o las 16:00. Sorbillo también se llena a las horas de comer.',
  'pignasecca': 'Ojo con la cartera: hay carteristas.',
  'pompeya': 'Comed un trozo de pizza antes de entrar para no perder tiempo dentro.',
  'bus-sita-panoramico': 'El billete se compra antes (oficinas SITA, estancos o app Unico Campania), no en el bus. En temporada alta va lleno y puede saltarse paradas. De Amalfi a Positano, sentaos a la izquierda.',
  'ferry-amalfi-positano': 'Con mala mar se cancelan los barcos. Ya no hay barco Nápoles–Amalfi: salid desde Salerno o Sorrento.',
  'sentiero-degli-dei': 'Unas 3 horas de Agerola a Nocelle/Positano.',
  'grotta-smeraldo': 'Cierra pronto por la tarde (antes en invierno).',
  'vietri': 'Es el único pueblo de la costa con estación de tren: regional desde Napoli Piazza Garibaldi.',
  'marina-di-praia': 'En la costa casi todo son guijarros; arena solo en Maiori y Minori. En los lidos, preguntad el precio antes de coger hamaca.'
};
export const sitios = [
  ['Nápoles','L\'Antica Pizzeria da Michele','pizzeria','Via Cesare Sersale, 1','margherita o marinara (solo hacen esas)',[1]],
  ['Nápoles','Gino e Toto Sorbillo','pizzeria','Via dei Tribunali, 32','margherita con búfala',[1,2]],
  ['Nápoles','Pizzeria Brandi','pizzeria','Salita Sant\'Anna di Palazzo, 1','margherita',[2]],
  ['Nápoles','Starita','pizzeria','Via Materdei, 27','pizza frita',[2]],
  ['Nápoles','Di Matteo','pizzeria','Via dei Tribunali, 94','pizza a portafoglio',[2]],
  ['Nápoles','Sfogliatelle Calde Attanasio','pasteleria','Vico Ferrovia, 1','sfogliatella caliente',[1]],
  ['Nápoles','Antica Osteria da Tonino','trattoria','Via Santa Teresa a Chiaia','pasta al ragú napolitano',[1]],
  ['Nápoles','Signora Bettola','trattoria','','pasta alla genovese, polpette al sugo, parmigiana',[2]],
  ['Nápoles','Mennella','gelateria','','stracciatella, avellana',[2]],
  ['Nápoles','Casa Infante','gelateria','','pistacho',[2]],
  ['Nápoles','Mercato della Pignasecca','street','Pignasecca','pizza frita, cuoppo, babà',[2]]
];
