import { N, VER, VERANO, TEMP } from './_h.mjs';
const INV = [12, 1, 2, 3], MONT = [5, 6, 7, 8, 9, 10], ALTA = [6, 7, 8, 9];
export default {
'abruzos': {
 paradas: {
  'pescara-lungomare': [['Nave di Cascella',42.4690,14.2220,'la fuente-barco frente a la playa'],['Ponte del Mare',42.4680,14.2270,'pasarela peatonal sobre la desembocadura']],
  'laquila-centro': [['Basilica di Collemaggio',42.3430,13.4045],['Piazza Duomo',42.3495,13.3990],['Basilica di San Bernardino',42.3515,13.4015],['Forte Spagnolo',42.3555,13.4040],['Fontana delle 99 Cannelle',42.3495,13.3915,'abajo, junto a la muralla']],
  'sulmona-confetti': [['Piazza Garibaldi y acueducto medieval',42.0465,13.9285],['Corso Ovidio',42.0480,13.9265,'ramos de confetti de colores en cada escaparate'],['Complesso dell\'Annunziata',42.0495,13.9255]]
 },
 nuevas: [
  N('genti-abruzzo','Museo delle Genti d\'Abruzzo','Pescara','pescara','cultura','2h','cualquiera','bajo','La vida de pastores y campesinos de la región, contada en las antiguas cárceles borbónicas de Pescara Vecchia.',[42.4610,14.2140],[],{consejo:'De pago.'}),
  N('pineta-dannunziana','Pineta Dannunziana','Pescara','pescara','naturaleza','1h','cualquiera','gratis','El pinar junto al mar al sur de la ciudad, con un estanque y senderos de sombra.',[42.4480,14.2330],[]),
  N('piazza-muzii','Piazza Muzii: el mercado y sus bares','Pescara','pescara','gastronomia','1h','noche','bajo','Alrededor del mercado cubierto se llena de mesas a la hora del aperitivo.',[42.4660,14.2110],[],{ambiente:'social'}),
  N('chieti-arqueologico','Chieti: el Guerrero de Capestrano','Chieti','pescara','cultura','medio_dia','manana','bajo','La estatua de un guerrero itálico del siglo VI a. C., con sombrero de ala enorme, en el museo arqueológico de una ciudad de colina.',[42.3480,14.1660],[],{consejo:'Bus desde Pescara. Museo de pago.'}),
  N('san-vito-playa-abruzos','Playas de San Vito Chietino','San Vito Chietino','san-vito-chietino','playa','medio_dia','cualquiera','gratis','Calas de guijarros con los trabocchi asomando a los lados.',[42.3050,14.4470],[],{meses:VERANO}),
  N('san-giovanni-venere','Abbazia di San Giovanni in Venere','Fossacesia','san-vito-chietino','cultura','2h','cualquiera','gratis','Una abadía románica en un promontorio de olivos, con toda la costa de los trabocchi abajo.',[42.2570,14.4960],[],{consejo:'Se llega bien en bici por la ciclovía, con una subida final.'}),
  N('cena-trabocco','Cenar en un trabocco','Costa dei Trabocchi','san-vito-chietino','gastronomia','medio_dia','noche','alto','Varias de estas máquinas de pesca sobre pilotes son hoy restaurantes: menú cerrado de pescado, con el mar debajo de la mesa.',[42.2900,14.4600],[],{reserva:true,consejo:'Solo con reserva y casi siempre menú único: mirad precio antes.'}),
  N('lanciano','Lanciano medieval','Lanciano','san-vito-chietino','cultura','2h','cualquiera','gratis','Ciudad de colina con barrios medievales, un puente de arcos que sostiene la catedral y un santuario muy visitado.',[42.2300,14.3900],[],{consejo:'Bus desde San Vito.'}),
  N('pacentro','Pacentro','Pacentro','sulmona','postal','2h','cualquiera','gratis','Un pueblo de piedra en la falda de la Majella, con las torres de un castillo medieval por encima.',[42.0510,13.9920],[],{coche:true}),
  N('pescocostanzo','Pescocostanzo','Pescocostanzo','sulmona','cultura','2h','cualquiera','gratis','Un pueblo de montaña a 1.400 metros con palacios renacentistas y tradición de encaje y forja.',[41.8890,14.0660],[],{coche:true}),
  N('gole-sagittario','Gargantas del Sagittario','Anversa degli Abruzzi','sulmona','naturaleza','2h','cualquiera','gratis','Un desfiladero con sendero junto al río, de camino al lago de Scanno.',[41.9950,13.8050],[],{coche:true,meses:MONT}),
  N('grotte-stiffe','Grotte di Stiffe','San Demetrio ne\' Vestini','laquila','naturaleza','2h','cualquiera','medio','Una cueva recorrida por un río subterráneo, con cascadas dentro.',[42.2560,13.5420],[],{coche:true,consejo:'Visita guiada de pago; dentro hace frío todo el año.'}),
  N('bominaco','Los frescos de Bominaco','Bominaco','laquila','cultura','2h','cualquiera','bajo','Un oratorio pequeño en un pueblo de montaña, pintado de arriba abajo en el siglo XIII.',[42.2440,13.6590],[],{coche:true,consejo:'Hay que avisar al guarda para que abra: buscad el teléfono actualizado.'}),
  N('campotosto','Lago de Campotosto','Campotosto','laquila','naturaleza','medio_dia','cualquiera','gratis','Un lago grande a 1.300 metros con el Gran Sasso de fondo; se rodea por carretera o en bici.',[42.5300,13.3800],[],{coche:true,meses:MONT})
 ]
},
'molise': {
 paradas: {
  'termoli-borgo': [['Castello Svevo',42.0035,14.9965],['Cattedrale di Termoli',42.0045,14.9975],['A Rejecelle',42.0045,14.9980,'uno de los callejones más estrechos de Italia'],['Mirador de la Torretta',42.0050,14.9990]]
 },
 nuevas: [
  N('termoli-corso','Corso Nazionale de Termoli','Termoli','termoli','compras','1h','tarde','gratis','La calle peatonal que va de la estación al borgo: tiendas, heladerías y el paseo de la tarde.',[42.0020,14.9950],[]),
  N('rio-vivo','Playa de Rio Vivo','Termoli','termoli','playa','medio_dia','cualquiera','gratis','La playa al sur del puerto, más ancha y ventosa; aquí se hace kite y windsurf.',[41.9930,15.0100],[],{meses:VERANO}),
  N('campobasso-centro','Casco antiguo de Campobasso','Campobasso','campobasso','cultura','1h','cualquiera','gratis','Las callejuelas y escalinatas que suben hacia el castillo, con iglesias románicas por el camino.',[41.5625,14.6580],[],{esfuerzo:'medio'}),
  N('villa-de-capoa','Villa de Capoa','Campobasso','campobasso','naturaleza','1h','cualquiera','gratis','El jardín histórico de la ciudad, con estatuas y árboles centenarios.',[41.5590,14.6640],[]),
  N('oratino','Oratino','Oratino','campobasso','postal','2h','cualquiera','gratis','Un pueblo de piedra tallada en un espolón sobre el valle del Biferno.',[41.5850,14.5850],[],{coche:true}),
  N('campitello-matese','Esquí en Campitello Matese','Campitello Matese','campobasso','aventura','dia_completo','manana','alto','La estación de esquí del Molise, en el macizo del Matese.',[41.4600,14.3930],[],{coche:true,meses:INV}),
  N('roccamandolfi','Puente tibetano de Roccamandolfi','Roccamandolfi','campobasso','aventura','2h','cualquiera','gratis','Un puente colgante sobre un cañón, a un paseo del pueblo y de las ruinas de su castillo.',[41.4950,14.3520],[],{coche:true,meses:MONT,esfuerzo:'medio'}),
  N('castelpetroso','Santuario de Castelpetroso','Castelpetroso','campobasso','cultura','1h','cualquiera','gratis','Una basílica neogótica de agujas blancas en medio del bosque.',[41.5550,14.3500],[],{coche:true}),
  N('agnone-centro','Agnone: iglesias y talleres del cobre','Agnone','agnone','cultura','2h','cualquiera','gratis','Un pueblo de artesanos con portales de piedra, leones venecianos en las fachadas y talleres donde aún se trabaja el cobre.',[41.8100,14.3780],[]),
  N('flora-appenninica','Giardino della Flora Appenninica','Capracotta','agnone','naturaleza','2h','cualquiera','gratis','Un jardín botánico de alta montaña, a más de 1.500 metros.',[41.8400,14.2700],[],{coche:true,meses:ALTA}),
  N('bagnoli-trigno','Bagnoli del Trigno','Bagnoli del Trigno','agnone','postal','2h','cualquiera','gratis','Un pueblo encajado entre dos peñas enormes, con una iglesia y un castillo encima de cada una.',[41.7030,14.4580],[],{coche:true}),
  N('frosolone','Frosolone y sus cuchillos','Frosolone','agnone','cultura','2h','cualquiera','gratis','El pueblo de los cuchilleros: talleres, tiendas y un museo de la forja.',[41.6000,14.4480],[],{coche:true}),
  N('cascate-carpinone','Cascadas de Carpinone','Carpinone','agnone','naturaleza','2h','cualquiera','gratis','Un sendero corto por el bosque hasta dos cascadas del río Carpino.',[41.5900,14.3250],[],{coche:true,meses:MONT})
 ]
},
'valle-de-aosta': {
 paradas: {
  'aosta-romana': [['Arco de Augusto',45.7385,7.3285],['Porta Praetoria',45.7380,7.3225],['Teatro romano',45.7390,7.3225],['Piazza Chanoux',45.7372,7.3205],['Criptoportico forense',45.7385,7.3160,'de pago']]
 },
 nuevas: [
  N('aosta-catedral','Catedral de Aosta','Aosta','aosta','cultura','1h','cualquiera','gratis','Fachada neoclásica, atrio pintado del Renacimiento y mosaicos medievales en el suelo del coro.',[45.7385,7.3165],[]),
  N('aosta-paseo','Via Sant\'Anselmo y Piazza Chanoux','Aosta','aosta','compras','1h','tarde','gratis','La calle peatonal que cruza la ciudad de puerta a puerta: tiendas de artesanía de madera, fontina y terrazas con montañas al fondo.',[45.7375,7.3240],[]),
  N('pila-verano','Pila en telecabina','Pila','aosta','naturaleza','medio_dia','manana','medio','La telecabina sale de la propia Aosta y en veinte minutos estás a 1.800 metros, con senderos y vistas al Mont Blanc y al Monte Rosa.',[45.6900,7.3150],[],{meses:ALTA,consejo:'Telecabina de pago; solo en temporada.'}),
  N('castello-saint-pierre','Castillo de Saint-Pierre','Saint-Pierre','aosta','cultura','2h','cualquiera','medio','El castillo de cuento del valle, con sus cuatro torrecillas, hoy museo de ciencias naturales.',[45.7090,7.2280],[],{coche:true,consejo:'De pago.'}),
  N('pont-dael','Puente-acueducto romano de Pont d\'Aël','Aymavilles','aosta','cultura','1h','cualquiera','bajo','Un acueducto romano sobre un barranco de más de cincuenta metros; se cruza por dentro.',[45.6790,7.2230],[],{coche:true,meses:TEMP}),
  N('courmayeur-via-roma','Via Roma de Courmayeur','Courmayeur','courmayeur','compras','1h','tarde','gratis','La calle peatonal del pueblo: tiendas de montaña, pastelerías y aperitivo después de esquiar o caminar.',[45.7910,6.9710],[]),
  N('orrido-pre-saint-didier','Pasarela sobre el barranco de Pré-Saint-Didier','Pré-Saint-Didier','courmayeur','postal','1h','cualquiera','gratis','Una plataforma volada sobre el desfiladero, con el Mont Blanc enfrente.',[45.7640,6.9880],[]),
  N('rifugio-bonatti','Subida al Rifugio Bonatti','Val Ferret','courmayeur','aventura','dia_completo','manana','gratis','Un refugio en un balcón de hierba frente a las Grandes Jorasses, de los más bonitos de los Alpes.',[45.8470,7.0290],[],{meses:ALTA,esfuerzo:'alto',consejo:'En verano hay bus por Val Ferret hasta el inicio del sendero.'}),
  N('rutor','Cascadas del Rutor','La Thuile','courmayeur','naturaleza','dia_completo','manana','gratis','Tres saltos de agua que bajan del glaciar, enlazados por un sendero entre alerces.',[45.7150,6.9500],[],{coche:true,meses:ALTA,esfuerzo:'medio'}),
  N('cogne-sant-orso','Prados de Sant\'Orso','Cogne','cogne','naturaleza','1h','cualquiera','gratis','Una pradera inmensa y llana en la puerta del pueblo, con el Gran Paradiso al fondo.',[45.6080,7.3560],[]),
  N('paradisia','Jardín alpino Paradisia','Valnontey','cogne','naturaleza','2h','cualquiera','bajo','Un jardín botánico de flora alpina a 1.700 metros, dentro del parque nacional.',[45.5870,7.3420],[],{meses:ALTA,consejo:'De pago; solo en verano.'}),
  N('valnontey','Paseo por Valnontey','Valnontey','cogne','naturaleza','medio_dia','cualquiera','gratis','El valle que entra hacia los glaciares del Gran Paradiso: sendero llano junto al río, con rebecos e íbices si hay suerte.',[45.5870,7.3420],[],{meses:MONT}),
  N('fondo-cogne','Esquí de fondo en Cogne','Cogne','cogne','aventura','medio_dia','manana','medio','Una de las mejores redes de pistas de fondo de Italia, saliendo de los prados del pueblo.',[45.6080,7.3560],[],{meses:INV}),
  N('plateau-rosa','Plateau Rosà en teleférico','Breuil-Cervinia','cervinia','naturaleza','medio_dia','manana','alto','Los teleféricos suben a 3.500 metros, en el glaciar, con el Cervino al lado y Suiza al otro lado de la raya.',[45.9360,7.7070],[],{consejo:'Caro y con mucha altitud: mirad precio y parte del tiempo.'}),
  N('busserailles','Gouffre des Busserailles','Valtournenche','cervinia','naturaleza','1h','cualquiera','bajo','Una garganta estrecha excavada por el torrente, con pasarelas y una cascada dentro.',[45.8860,7.6220],[],{meses:MONT,consejo:'De pago.'}),
  N('chamois','Chamois, el pueblo sin coches','Chamois','cervinia','postal','medio_dia','cualquiera','bajo','El único municipio de Italia al que no llega la carretera: se sube en teleférico.',[45.8390,7.6190],[],{coche:true})
 ]
},
'marcas': {
 paradas: {
  'ascoli-piazza-popolo': [['Piazza Arringo y Duomo',42.8535,13.5790],['Piazza del Popolo',42.8545,13.5755,'el salón de travertino'],['San Francesco',42.8550,13.5757],['Ponte romano di Solestà',42.8580,13.5720]],
  'urbino-raffaello-universidad': [['Piazza della Repubblica',43.7260,12.6370],['Casa natale di Raffaello',43.7270,12.6365,'de pago'],['Oratorio di San Giovanni',43.7265,12.6345,'frescos góticos; de pago']],
  'mole-vanvitelliana': [['Mole Vanvitelliana',43.6170,13.5050],['Arco de Trajano',43.6255,13.5065]]
 },
 nuevas: [
  N('ancona-plebiscito','Piazza del Plebiscito y Corso Garibaldi','Ancona','ancona','compras','1h','tarde','gratis','La plaza alargada «del Papa», con terrazas, y la calle peatonal que baja hasta el puerto.',[43.6190,13.5120],[]),
  N('mercato-erbe-ancona','Mercato delle Erbe','Ancona','ancona','gastronomia','1h','manana','bajo','El mercado cubierto de hierro y cristal del centro.',[43.6170,13.5150],[]),
  N('senigallia','Senigallia: Rotonda a Mare y playa de terciopelo','Senigallia','ancona','playa','medio_dia','cualquiera','gratis','Kilómetros de arena fina, un pabellón blanco sobre el agua y un casco antiguo con fortaleza y soportales junto al río.',[43.7200,13.2220],[['Rotonda a Mare',43.7200,13.2250],['Rocca Roveresca',43.7160,13.2195],['Portici Ercolani',43.7150,13.2175]],{tipos:['cultura'],consejo:'En tren regional desde Ancona.'}),
  N('jesi','Jesi','Jesi','ancona','cultura','2h','cualquiera','gratis','Ciudad amurallada tierra adentro, con teatro, plazas encadenadas y vino Verdicchio.',[43.5230,13.2440],[],{tipos:['gastronomia'],consejo:'En tren desde Ancona.'}),
  N('recanati','Recanati, el pueblo de Leopardi','Recanati','ancona','cultura','2h','cualquiera','bajo','Una colina con vistas del mar a los Apeninos y la casa del poeta más leído de Italia.',[43.4040,13.5500],[],{coche:true}),
  N('urbani','Playa Urbani','Sirolo','sirolo','playa','medio_dia','cualquiera','gratis','La cala al pie de Sirolo, entre la roca blanca y el bosque.',[43.5230,13.6230],[],{meses:VERANO,consejo:'Se baja a pie por el parque o en lanzadera en verano.'}),
  N('san-michele-sassi-neri','Playas de San Michele y Sassi Neri','Sirolo','sirolo','playa','medio_dia','cualquiera','gratis','La playa larga bajo el Monte Conero: guijarros blancos, agua clara y el monte cayendo al mar.',[43.5300,13.6220],[],{meses:VERANO,esfuerzo:'medio'}),
  N('numana-alta','Numana alta: la Costarella y la Torre','Numana','sirolo','postal','1h','tarde','gratis','La escalinata de casas de pescadores y el mirador sobre el puerto.',[43.5130,13.6220],[]),
  N('crescia-urbino','Crescia sfogliata','Urbino','urbino','gastronomia','1h','cualquiera','bajo','La prima hojaldrada de la piadina, con manteca y pimienta, rellena de lo que queráis. Comida de estudiantes.',[43.7260,12.6370],[],{q:'crescia sfogliata, Urbino'}),
  N('pesaro','Pesaro: playa y ciudad de Rossini','Pesaro','urbino','playa','medio_dia','cualquiera','gratis','Playa de ciudad con la gran esfera de bronce en el paseo, y un centro con la casa de Rossini.',[43.9100,12.9130],[],{tipos:['cultura'],consejo:'Bus desde Urbino.'}),
  N('gradara','Castillo de Gradara','Gradara','urbino','cultura','2h','cualquiera','medio','Un pueblo dentro de dos anillos de murallas y la fortaleza de Paolo y Francesca.',[43.9400,12.7720],[],{coche:true,consejo:'De pago.'}),
  N('san-leo','San Leo','San Leo','urbino','cultura','medio_dia','cualquiera','medio','Una fortaleza en lo alto de un peñón vertical, con un pueblo románico a sus pies.',[43.8960,12.3440],[],{coche:true}),
  N('furlo','Gola del Furlo','Acqualagna','urbino','naturaleza','2h','cualquiera','gratis','Un desfiladero de paredes verticales por el que pasa la antigua Via Flaminia, con túnel romano.',[43.6480,12.7200],[],{coche:true}),
  N('ascoli-annunziata','Mirador de la Annunziata','Ascoli Piceno','ascoli','postal','1h','tarde','gratis','El parque en lo alto de la ciudad: desde aquí se cuentan las torres.',[42.8520,13.5690],[]),
  N('san-benedetto','San Benedetto del Tronto: la Riviera de las Palmeras','San Benedetto del Tronto','ascoli','playa','medio_dia','cualquiera','gratis','Playa de arena y un paseo marítimo larguísimo bajo miles de palmeras.',[42.9500,13.8850],[],{meses:VERANO,consejo:'En tren desde Ascoli.'}),
  N('offida','Offida','Offida','ascoli','cultura','2h','cualquiera','gratis','Un pueblo de ladrillo donde las mujeres aún hacen encaje de bolillos en la puerta, y una iglesia al borde de un barranco.',[42.9350,13.6900],[],{coche:true})
 ]
},
'trento': {
 paradas: {
  'duomo-trento': [['Piazza del Duomo y Fontana del Nettuno',46.0672,11.1213],['Cattedrale di San Vigilio',46.0668,11.1215],['Via Belenzani',46.0685,11.1213,'las fachadas pintadas']],
  'riva-garda': [['Piazza III Novembre y Torre Apponale',45.8845,10.8415],['Rocca di Riva',45.8850,10.8435],['Spiaggia dei Sabbioni',45.8815,10.8480]]
 },
 nuevas: [
  N('gallerie-piedicastello','Le Gallerie de Piedicastello','Trento','trento','cultura','1h','cualquiera','gratis','Dos túneles de autovía reconvertidos en espacio de exposiciones sobre la historia del Trentino.',[46.0720,11.1100],[],{consejo:'Cierra los lunes.'}),
  N('funivia-sardagna','Funivía a Sardagna','Trento','trento','postal','1h','cualquiera','bajo','Un teleférico urbano que en cinco minutos sube de la orilla del Adigio a un balcón sobre la ciudad.',[46.0720,11.1150],[]),
  N('le-albere','Barrio de Le Albere','Trento','trento','postal','1h','cualquiera','gratis','El barrio nuevo diseñado por Renzo Piano alrededor del MUSE, con parque, canales y un palacio renacentista.',[46.0610,11.1130],[]),
  N('rovereto-mart','Rovereto: el MART y la Campana de los Caídos','Rovereto','trento','cultura','medio_dia','cualquiera','medio','Uno de los grandes museos de arte moderno de Italia y, en la colina, una campana enorme que suena cada tarde por la paz.',[45.8940,11.0440],[],{consejo:'Un cuarto de hora de tren desde Trento. El MART cierra los lunes.'}),
  N('castel-beseno','Castel Beseno','Besenello','trento','cultura','2h','cualquiera','medio','La fortaleza más grande del Trentino, ocupando una colina entera sobre el valle del Adigio.',[45.9410,11.1100],[],{coche:true,meses:TEMP,consejo:'De pago.'}),
  N('arte-sella','Arte Sella','Borgo Valsugana','trento','naturaleza','medio_dia','cualquiera','medio','Un recorrido por el bosque con obras hechas de ramas, troncos y piedras; la más conocida, una catedral de árboles.',[46.0180,11.4500],[],{coche:true,meses:TEMP,consejo:'De pago.'}),
  N('varone','Cascata del Varone','Tenno','riva','naturaleza','1h','cualquiera','bajo','Una cascada de casi cien metros metida dentro de una gruta, a tres kilómetros de Riva.',[45.9120,10.8360],[],{consejo:'De pago. Bus urbano o bici desde Riva.'}),
  N('bastione-riva','El Bastione de Riva','Riva del Garda','riva','postal','2h','cualquiera','gratis','Una torre veneciana en la ladera, encima del pueblo: la vista del lago desde arriba.',[45.8850,10.8350],[],{esfuerzo:'medio',consejo:'Media hora de subida a pie; también hay un ascensor panorámico de pago.'}),
  N('arco','Arco y su castillo','Arco','riva','postal','medio_dia','cualquiera','bajo','Un castillo en lo alto de una peña entre olivos, y abajo el pueblo de los escaladores.',[45.9200,10.8850],[],{esfuerzo:'medio',consejo:'Bus desde Riva. Subir al castillo es de pago.'}),
  N('tenno','Lago di Tenno y Canale di Tenno','Tenno','riva','naturaleza','medio_dia','cualquiera','gratis','Un lago turquesa entre bosques y, al lado, un pueblo medieval de piedra con pasadizos.',[45.9370,10.8170],[],{coche:true,meses:MONT}),
  N('ledro','Lago di Ledro','Ledro','riva','naturaleza','medio_dia','cualquiera','gratis','Un lago de montaña templado para bañarse, con playas de hierba y un museo de palafitos.',[45.8770,10.7500],[],{coche:true,meses:VER}),
  N('limone-barco','Limone sul Garda en barco','Limone sul Garda','riva','agua','medio_dia','cualquiera','medio','Media hora de barco entre paredes de roca hasta el pueblo de los limonares en terrazas.',[45.8130,10.7920],[],{meses:TEMP}),
  N('vallesinella','Cascadas de Vallesinella','Madonna di Campiglio','campiglio','naturaleza','medio_dia','manana','gratis','Un sendero por el bosque que va enlazando saltos de agua, al pie de las Dolomitas de Brenta.',[46.2110,10.8650],[],{coche:true,meses:ALTA,esfuerzo:'medio'}),
  N('nambino','Lago di Nambino','Madonna di Campiglio','campiglio','naturaleza','2h','cualquiera','gratis','Un lago pequeño con refugio, a media hora de subida, con el Brenta reflejado.',[46.2440,10.8100],[],{coche:true,meses:MONT,esfuerzo:'medio'}),
  N('val-genova','Val Genova: cascadas de Nardis','Carisolo','campiglio','naturaleza','medio_dia','cualquiera','gratis','El valle de las cascadas: la primera, de más de cien metros, cae junto a la carretera.',[46.1700,10.7400],[],{coche:true,meses:MONT}),
  N('pinzolo-danza-macabra','La danza macabra de Pinzolo','Pinzolo','campiglio','cultura','1h','cualquiera','gratis','Un fresco del siglo XVI en la fachada de una iglesia: esqueletos bailando con papas, reyes y campesinos.',[46.1640,10.7620],[],{coche:true})
 ]
}
};
