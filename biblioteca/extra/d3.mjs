import { N, VER, VERANO, TEMP } from './_h.mjs';
const INV = [12, 1, 2, 3], MONT = [5, 6, 7, 8, 9, 10], VILLAS = [3, 4, 5, 6, 7, 8, 9, 10];
export default {
'piamonte': {
 paradas: {
  'centro-storico': [['Piazza Castello',45.0710,7.6860],['Galleria Subalpina',45.0700,7.6865,'pasaje cubierto del siglo XIX'],['Via Roma',45.0690,7.6840,'un kilómetro de soportales'],['Piazza San Carlo',45.0677,7.6827]],
  'ruta-chocolate': [['Piazza della Consolata',45.0765,7.6795,'aquí nació el bicerin'],['Piazza San Carlo',45.0677,7.6827,'los cafés históricos']],
  'valentino': [['Castello del Valentino',45.0545,7.6860],['Orilla del Po',45.0520,7.6870]],
  'alba-centro': [['Piazza Risorgimento y Duomo',44.7005,8.0355],['Via Vittorio Emanuele',44.6995,8.0345,'la calle de las tiendas de trufa y avellana']]
 },
 nuevas: [
  N('palazzo-reale-torino','Palazzo Reale y Armería Real','Turín','torino','cultura','2h','cualquiera','medio','La residencia de los Saboya: salones dorados, una armería de caballeros a caballo y la capilla de la Sábana Santa.',[45.0730,7.6865],[],{consejo:'De pago. Los jardines reales son gratis.'}),
  N('duomo-porta-palatina','Duomo de la Sábana Santa y Porta Palatina','Turín','torino','cultura','1h','cualquiera','gratis','La catedral renacentista donde se guarda la Síndone y, al lado, la puerta romana de ladrillo mejor conservada de la ciudad.',[45.0740,7.6853],[['Duomo di San Giovanni Battista',45.0733,7.6855],['Porta Palatina',45.0750,7.6850]]),
  N('quadrilatero-romano','Quadrilatero Romano y Santuario della Consolata','Turín','torino','postal','1h','tarde','gratis','Las calles estrechas del Turín romano, hoy llenas de bares y tiendas, y la iglesia barroca más querida de la ciudad.',[45.0760,7.6800],[['Santuario della Consolata',45.0768,7.6790],['Via Sant\'Agostino',45.0750,7.6810]]),
  N('vittorio-gran-madre','Piazza Vittorio Veneto y la Gran Madre','Turín','torino','postal','1h','cualquiera','gratis','Una plaza porticada enorme que baja hasta el Po y, cruzando el puente, una iglesia con forma de Panteón.',[45.0640,7.6965],[['Piazza Vittorio Veneto',45.0650,7.6950],['Gran Madre di Dio',45.0623,7.6990]]),
  N('lingotto','Lingotto: la pista del tejado','Turín','torino','postal','1h','cualquiera','bajo','La antigua fábrica de Fiat tiene en la azotea la pista de pruebas, hoy convertida en jardín con vistas a los Alpes.',[45.0320,7.6660],[],{consejo:'Se sube con la entrada de la Pinacoteca Agnelli. Metro Lingotto.'}),
  N('san-salvario','San Salvario de noche','Turín','torino','fiesta','2h','noche','bajo','El barrio junto a la estación de Porta Nuova donde sale la gente joven: bares pequeños uno al lado de otro.',[45.0590,7.6800],[],{ambiente:'social'}),
  N('asti','Asti: torres medievales y plaza del Palio','Asti','alba','cultura','medio_dia','cualquiera','gratis','Ciudad de ladrillo rojo con torres de familias medievales, una catedral gótica y bodegas de espumoso.',[44.9000,8.2060],[['Piazza Alfieri',44.9000,8.2070],['Collegiata di San Secondo',44.8995,8.2045],['Torre Troyana',44.9010,8.2030],['Cattedrale di Asti',44.9015,8.1985]],{consejo:'En tren desde Turín o desde Alba.'}),
  N('bra','Bra, la cuna del Slow Food','Bra','alba','gastronomia','2h','cualquiera','bajo','Ciudad barroca pequeña donde nació el movimiento Slow Food; aquí la salchicha de ternera se come cruda.',[44.6980,7.8550],[],{consejo:'En tren desde Alba.'}),
  N('barbaresco','Barbaresco y su torre','Barbaresco','alba','postal','2h','cualquiera','bajo','Un pueblo de una calle entre viñas, con una torre medieval a la que se sube para ver el Tanaro y las colinas.',[44.7255,8.0815],[],{coche:true,tipos:['gastronomia']}),
  N('la-morra','Mirador de La Morra y capilla de colores','La Morra','alba','postal','2h','cualquiera','gratis','El balcón de las Langhe: viñedos de Barolo hasta donde alcanza la vista. Abajo, entre las viñas, una capilla pintada de colores.',[44.6385,7.9330],[['Belvedere de La Morra',44.6385,7.9330],['Cappella del Barolo',44.6265,7.9520]],{coche:true}),
  N('grinzane','Castello di Grinzane Cavour','Grinzane Cavour','alba','cultura','2h','cualquiera','medio','Castillo medieval sobre los viñedos, con enoteca regional y museo.',[44.6525,7.9940],[],{coche:true,consejo:'De pago.'})
 ]
},
'lagos-del-norte': {
 paradas: {
  'como-lungolago-duomo': [['Duomo de Como',45.8118,9.0835],['Piazza Cavour',45.8125,9.0825],['Dique del puerto',45.8150,9.0800,'el paseo que entra en el lago'],['Tempio Voltiano',45.8145,9.0755]],
  'ferri-como-bellagio-varenna': [['Bellagio',45.9870,9.2610],['Varenna',46.0105,9.2840]],
  'islas-borromeas': [['Isola Bella',45.8960,8.5270,'palacio y jardín en terrazas; de pago'],['Isola dei Pescatori',45.9010,8.5200,'la única habitada todo el año'],['Isola Madre',45.9110,8.5390,'jardín botánico; de pago']]
 },
 nuevas: [
  N('villa-olmo-paseo','Paseo a Villa Olmo','Como','como','postal','1h','tarde','gratis','El paseo llano por la orilla, entre villas con embarcadero, hasta la más grande de todas y su parque.',[45.8170,9.0660],[]),
  N('como-murada','Como dentro de las murallas','Como','como','cultura','1h','cualquiera','gratis','La cuadrícula medieval: una torre-puerta, una plaza con casas de entramado de madera y el viejo ayuntamiento de rayas.',[45.8100,9.0845],[['Porta Torre',45.8075,9.0850],['Piazza San Fedele',45.8105,9.0845],['Broletto',45.8120,9.0835]]),
  N('bellagio-pueblo','Bellagio: escalinatas y Punta Spartivento','Bellagio','varenna','postal','2h','cualquiera','gratis','El pueblo donde el lago se parte en dos: calles en escalera y, en la punta, las tres ramas del lago a la vez.',[45.9870,9.2610],[['Salita Serbelloni',45.9865,9.2615],['Punta Spartivento',45.9905,9.2620],['Jardines de Villa Melzi',45.9790,9.2530,'de pago, de primavera a otoño']],{consejo:'Ferry desde Varenna (un cuarto de hora).'}),
  N('villa-monastero','Villa Monastero','Varenna','varenna','cultura','2h','cualquiera','medio','Un jardín estrecho y larguísimo pegado al lago, con cipreses, columnas y plantas exóticas.',[46.0085,9.2860],[],{meses:VILLAS,consejo:'De pago.'}),
  N('castello-vezio','Castello di Vezio','Varenna','varenna','postal','2h','cualquiera','bajo','Una torre medieval encima de Varenna con la mejor vista del centro del lago.',[46.0125,9.2890],[],{meses:VILLAS,esfuerzo:'medio',consejo:'Veinte minutos de subida a pie por sendero empedrado. De pago.'}),
  N('passeggiata-innamorati','Passeggiata degli Innamorati','Varenna','varenna','postal','1h','cualquiera','gratis','La pasarela roja colgada sobre el agua que lleva del embarcadero al centro del pueblo.',[46.0105,9.2825],[]),
  N('orrido-bellano','Orrido di Bellano','Bellano','varenna','naturaleza','1h','cualquiera','bajo','Una garganta estrechísima con pasarelas colgadas sobre el torrente.',[46.0440,9.3030],[],{consejo:'A una parada de tren de Varenna. De pago.'}),
  N('nesso','Nesso: el barranco y el puente romano','Nesso','como','postal','2h','cualquiera','gratis','Una cascada que cae entre casas hasta el lago, y un puentecito de piedra abajo desde el que la gente se tira al agua en verano.',[45.9115,9.1580],[],{esfuerzo:'medio',consejo:'Bus o barco desde Como. Muchos escalones.'}),
  N('desenzano-castello','Castillo y puerto viejo de Desenzano','Desenzano del Garda','desenzano','cultura','1h','cualquiera','bajo','El puerto veneciano en pleno centro y, arriba, el castillo con vistas al lago.',[45.4690,10.5385],[['Porto Vecchio',45.4700,10.5395],['Castello di Desenzano',45.4690,10.5380,'de pago'],['Villa Romana',45.4685,10.5400,'mosaicos; de pago']]),
  N('peschiera','Peschiera del Garda: la fortaleza en el agua','Peschiera del Garda','desenzano','cultura','2h','cualquiera','gratis','Un pueblo dentro de una fortaleza veneciana con forma de estrella, rodeada de canales.',[45.4390,10.6900],[],{consejo:'A una parada de tren de Desenzano.'}),
  N('gardaland','Gardaland','Castelnuovo del Garda','desenzano','aventura','dia_completo','manana','alto','El parque de atracciones más grande de Italia.',[45.4550,10.7140],[],{meses:TEMP,ambiente:'social',consejo:'Lanzadera desde la estación de Peschiera. Mirad calendario y precio en su web: fuera de verano no abre todos los días.'}),
  N('salo','Salò: el paseo del lago','Salò','desenzano','postal','medio_dia','cualquiera','gratis','El lungolago más largo del Garda, peatonal, con un casco antiguo de soportales detrás.',[45.6065,10.5210],[],{consejo:'Bus o barco desde Desenzano.'}),
  N('vittoriale','Vittoriale degli Italiani','Gardone Riviera','desenzano','cultura','medio_dia','cualquiera','medio','La casa-delirio del poeta D\'Annunzio: un barco de guerra en el jardín, un avión en el techo y un anfiteatro sobre el lago.',[45.6230,10.5650],[],{consejo:'Bus desde Desenzano o Salò. De pago.'}),
  N('stresa-lungolago','Lungolago de Stresa','Stresa','stresa','postal','1h','cualquiera','gratis','El paseo frente a los grandes hoteles, con las islas Borromeas delante.',[45.8830,8.5370],[]),
  N('santa-caterina-sasso','Eremo di Santa Caterina del Sasso','Leggiuno','stresa','cultura','medio_dia','cualquiera','gratis','Un monasterio pegado a la pared de roca, directamente sobre el agua, en la otra orilla.',[45.8765,8.5990],[],{meses:VILLAS,consejo:'Barco desde Stresa.'}),
  N('arona','Arona y el coloso de San Carlos','Arona','stresa','cultura','2h','cualquiera','bajo','Pueblo de lago con paseo y una estatua de cobre de más de treinta metros a la que se puede subir por dentro.',[45.7690,8.5500],[],{consejo:'En tren desde Stresa. La estatua está a media hora andando del centro; subir es de pago.'}),
  N('orta-san-giulio','Orta San Giulio','Orta San Giulio','stresa','postal','medio_dia','cualquiera','gratis','Un lago pequeño y silencioso, un pueblo peatonal y una isla con un monasterio a cinco minutos en barca.',[45.7985,8.4060],[['Piazza Motta',45.7985,8.4060],['Isola San Giulio',45.7960,8.4000],['Sacro Monte di Orta',45.7990,8.4110]],{coche:true})
 ]
},
'basilicata-matera': {
 paradas: {
  'sasso-caveoso': [['Piazza San Pietro Caveoso',40.6625,16.6125,'la iglesia al borde del barranco'],['Santa Maria de Idris',40.6620,16.6125]],
  'sasso-barisano': [['Via Fiorentini',40.6680,16.6075],['San Pietro Barisano',40.6690,16.6085,'de pago']]
 },
 nuevas: [
  N('vittorio-veneto-matera','Piazza Vittorio Veneto y el mirador de los tres arcos','Matera','matera','postal','1h','cualquiera','gratis','La plaza donde empieza todo: bajo tres arcos se abre de golpe la vista del Sasso Barisano.',[40.6665,16.6065],[],{q:'Belvedere Luigi Guerricchio, Matera'}),
  N('via-ridola','Via Ridola: Palazzo Lanfranchi, museo y Piazzetta Pascoli','Matera','matera','cultura','2h','cualquiera','bajo','La calle señorial de la ciudad «de arriba»: una iglesia decorada con calaveras, el museo arqueológico y un balcón sobre el Sasso Caveoso.',[40.6640,16.6090],[['Chiesa del Purgatorio',40.6650,16.6080],['Museo Ridola',40.6645,16.6085,'de pago'],['Palazzo Lanfranchi',40.6637,16.6093,'de pago'],['Piazzetta Pascoli',40.6635,16.6095,'el mirador']]),
  N('sant-agostino-matera','Mirador del Convento di Sant\'Agostino','Matera','matera','postal','1h','cualquiera','gratis','El extremo norte de los Sassi, asomado al barranco de la Gravina.',[40.6705,16.6095],[]),
  N('castello-tramontano','Castello Tramontano','Matera','matera','postal','1h','cualquiera','gratis','Un castillo aragonés que nunca se terminó, en un parque sobre el centro.',[40.6625,16.6040],[]),
  N('ponte-tibetano','Puente colgante de la Gravina','Matera','matera','naturaleza','2h','manana','gratis','Se baja desde los Sassi al fondo del barranco, se cruza el torrente por un puente colgante y se sube a las cuevas de enfrente.',[40.6600,16.6160],[],{esfuerzo:'alto',consejo:'A veces lo cierran por obras o lluvia: preguntad antes de bajar. Con calor, solo temprano.'}),
  N('cripta-peccato','Cripta del Peccato Originale','Matera','matera','cultura','2h','cualquiera','medio','Una cueva en el campo con frescos del siglo IX: la llaman la Capilla Sixtina del arte rupestre.',[40.6050,16.5710],[],{coche:true,reserva:true,consejo:'Solo con reserva y visita guiada.'}),
  N('altamura','Altamura: pan y catedral','Altamura','matera','gastronomia','2h','manana','bajo','El pueblo del pan de sémola más famoso de Italia, con hornos de leña centenarios y una catedral románica.',[40.8270,16.5530],[],{tipos:['cultura'],consejo:'Tren de vía estrecha desde Matera.'}),
  N('gravina-puglia','Gravina in Puglia y su puente-acueducto','Gravina in Puglia','matera','postal','medio_dia','cualquiera','gratis','Otro barranco con cuevas, cruzado por un puente de piedra de dos pisos.',[40.8200,16.4150],[],{consejo:'Tren de vía estrecha desde Matera, con cambio en Altamura.'}),
  N('montescaglioso','Abadía de Montescaglioso','Montescaglioso','matera','cultura','2h','cualquiera','bajo','Una abadía benedictina con claustros pintados, en un pueblo de colina frente a la Murgia.',[40.5530,16.6670],[],{coche:true}),
  N('metaponto','Metaponto: templo griego y playa','Metaponto','matera','playa','medio_dia','cualquiera','gratis','Quince columnas dóricas en pie en mitad del llano y, a pocos kilómetros, las playas de arena del Jónico.',[40.4160,16.8170],[],{coche:true,tipos:['cultura']}),
  N('castelmezzano-pueblo','Castelmezzano: el pueblo en la roca','Castelmezzano','castelmezzano','postal','2h','cualquiera','gratis','Casas encajadas entre agujas de arenisca y una escalera tallada en la roca que sube a los restos del castillo.',[40.5290,16.0460],[],{coche:true,esfuerzo:'medio'}),
  N('pietrapertosa','Pietrapertosa: la Arabata y el castillo','Pietrapertosa','castelmezzano','cultura','2h','cualquiera','bajo','El pueblo más alto de Basilicata, con un barrio de origen sarraceno y un castillo excavado en la cima.',[40.5180,16.0620],[],{coche:true,esfuerzo:'medio'}),
  N('ferrata-dolomiti-lucane','Vías ferratas de las Dolomitas Lucanas','Castelmezzano','castelmezzano','aventura','medio_dia','manana','medio','Dos ferratas, una a cada lado del valle, unidas por un puente nepalí.',[40.5270,16.0500],[],{coche:true,meses:MONT,esfuerzo:'alto',consejo:'Hace falta equipo de ferrata; se alquila en el pueblo.'}),
  N('maratea-centro','Casco antiguo de Maratea','Maratea','maratea','cultura','2h','tarde','gratis','Un pueblo de montaña a dos pasos del mar: callejones, plazuelas y decenas de iglesias.',[39.9995,15.7190],[],{coche:true}),
  N('maratea-porto','Atardecer en el puerto de Maratea','Maratea','maratea','postal','2h','noche','gratis','El puertecito pesquero, con terrazas al borde del agua.',[39.9880,15.7080],[],{coche:true})
 ]
},
'calabria': {
 geo: { 'pizzo': [38.7345,16.1605], 'tartufo-pizzo': [38.7345,16.1600], 'le-castella': [38.9075,17.0230] },
 paradas: {
  'tropea-centro': [['Piazza Ercole',38.6765,15.8975],['Cattedrale di Tropea',38.6770,15.8985],['Mirador de Piazza del Cannone',38.6770,15.8955],['Santa Maria dell\'Isola',38.6790,15.8950,'subir al santuario es de pago']],
  'pizzo': [['Piazza della Repubblica',38.7345,16.1605,'el balcón sobre el mar'],['Castello Murat',38.7350,16.1595,'de pago']],
  'reggio-lungomare': [['Arena dello Stretto',38.1105,15.6475],['Lungomare Falcomatà',38.1080,15.6440]]
 },
 nuevas: [
  N('michelino','Playa de Michelino','Parghelia','tropea','playa','medio_dia','cualquiera','gratis','Una cala de arena blanca bajo un acantilado, con escollos para hacer snorkel.',[38.6850,15.9260],[],{meses:VERANO,esfuerzo:'medio',consejo:'Parghelia está a una parada de tren de Tropea; se baja a la playa por una escalera larga.'}),
  N('zambrone','Paradiso del Sub','Zambrone','tropea','playa','medio_dia','cualquiera','gratis','Calas pequeñas de agua muy clara entre rocas, de las más fotografiadas de la costa.',[38.7080,15.9700],[],{coche:true,meses:VERANO,esfuerzo:'medio'}),
  N('zungri','Grutas de Zungri','Zungri','tropea','cultura','2h','cualquiera','bajo','Un poblado excavado en la roca en la ladera de un valle: casas, silos y escaleras talladas.',[38.6570,15.9850],[],{coche:true,consejo:'De pago.'}),
  N('tropea-nduja','\'Nduja y cebolla roja de Tropea','Tropea','tropea','gastronomia','1h','cualquiera','bajo','Las dos cosas que salen de aquí: el embutido picante que se unta y la cebolla dulce, en bocadillo, en mermelada o hasta en helado.',[38.6765,15.8975],[],{q:'Corso Vittorio Emanuele, Tropea'}),
  N('belvedere-capo-vaticano','Atardecer en el Belvedere de Capo Vaticano','Capo Vaticano (Ricadi)','capo-vaticano','postal','1h','noche','gratis','El mirador junto al faro: las calas abajo y, si está claro, Stromboli humeando en el horizonte.',[38.6195,15.8285],[],{coche:true}),
  N('riaci','Baia di Riaci','Ricadi','capo-vaticano','playa','medio_dia','cualquiera','gratis','Una bahía con un gran escollo en medio, entre Tropea y Capo Vaticano.',[38.6590,15.8600],[],{coche:true,meses:VERANO}),
  N('reggio-castello-duomo','Castello Aragonese y Duomo de Reggio','Reggio Calabria','reggio','cultura','1h','cualquiera','gratis','Dos torres redondas es lo que queda del castillo; a dos calles, la catedral más grande de Calabria.',[38.1057,15.6433],[['Castello Aragonese',38.1055,15.6435],['Duomo de Reggio',38.1060,15.6430]]),
  N('corso-garibaldi-reggio','Corso Garibaldi y helado de bergamota','Reggio Calabria','reggio','gastronomia','1h','tarde','bajo','La calle peatonal del paseo de la tarde. La bergamota solo crece en esta costa: probadla en helado o granizado.',[38.1090,15.6450],[],{tipos:['compras']}),
  N('scilla-playa','Playa de Marina Grande de Scilla','Scilla','reggio','playa','medio_dia','cualquiera','gratis','Una playa ancha bajo el castillo, con Sicilia enfrente.',[38.2560,15.7180],[],{meses:VERANO,consejo:'En tren regional desde Reggio.'}),
  N('pentedattilo','Pentedattilo, el pueblo fantasma','Pentedattilo','reggio','postal','2h','tarde','gratis','Un pueblo abandonado al pie de una roca con forma de mano.',[37.9530,15.7610],[],{coche:true}),
  N('gambarie','Gambarie y el Aspromonte','Gambarie','reggio','naturaleza','dia_completo','manana','gratis','Bosques de hayas a 1.300 metros, con el estrecho, el Etna y las Eolias a la vista en días claros.',[38.1680,15.8370],[],{coche:true}),
  N('cosenza-vecchia','Cosenza Vecchia: Duomo, Corso Telesio y castillo','Cosenza','cosenza','cultura','medio_dia','cualquiera','gratis','El casco antiguo en cuesta, medio dormido, con una catedral del siglo XIII y un castillo suabo arriba.',[39.2880,16.2620],[['Duomo de Cosenza',39.2880,16.2620],['Corso Telesio',39.2890,16.2615],['Castello Svevo',39.2835,16.2590,'de pago']],{esfuerzo:'medio'}),
  N('mab-cosenza','Museo al aire libre de Corso Mazzini','Cosenza','cosenza','postal','1h','cualquiera','gratis','La calle peatonal de la ciudad nueva, con esculturas de Dalí, De Chirico y otros repartidas por la acera.',[39.2985,16.2535],[]),
  N('giganti-sila','Los Gigantes de la Sila','Sila','cosenza','naturaleza','2h','cualquiera','bajo','Un bosque de pinos y arces de más de trescientos años y cuarenta metros de alto.',[39.3170,16.4740],[],{coche:true,meses:MONT,consejo:'Reserva natural con entrada de pago; cerrada en invierno.'}),
  N('lago-arvo','Lorica y el lago Arvo','Lorica','cosenza','naturaleza','medio_dia','cualquiera','gratis','Un lago de montaña entre pinares, con paseo por la orilla.',[39.2500,16.5100],[],{coche:true})
 ]
},
'lombardia-milan': {
 paradas: {
  'galleria': [['Galleria Vittorio Emanuele II',45.4658,9.1900],['Piazza della Scala',45.4670,9.1900],['Teatro alla Scala',45.4674,9.1895]],
  'castello-sempione': [['Castello Sforzesco',45.4705,9.1795,'los patios son gratis'],['Parco Sempione',45.4725,9.1765],['Arco della Pace',45.4757,9.1725]],
  'brera': [['Via Fiori Chiari',45.4715,9.1870],['Pinacoteca di Brera',45.4720,9.1880,'de pago; el patio es libre'],['Orto Botanico di Brera',45.4725,9.1885,'gratis']],
  'bosco-verticale': [['Piazza Gae Aulenti',45.4835,9.1905],['Biblioteca degli Alberi',45.4845,9.1930],['Bosco Verticale',45.4860,9.1905]],
  'san-lorenzo': [['Colonne di San Lorenzo',45.4580,9.1810],['Porta Ticinese',45.4565,9.1805]],
  'citta-alta-bergamo': [['Porta San Giacomo',45.7015,9.6640,'la puerta blanca de las murallas'],['Piazza Vecchia',45.7040,9.6625],['Santa Maria Maggiore y Cappella Colleoni',45.7033,9.6622],['Funicular de San Vigilio',45.7065,9.6525,'para ver la ciudad desde más arriba']],
  'pavia': [['Castello Visconteo',45.1905,9.1585],['Universidad',45.1865,9.1560],['Duomo de Pavía',45.1847,9.1535],['Ponte Coperto',45.1805,9.1530]]
 },
 nuevas: [
  N('sant-ambrogio','Basílica de Sant\'Ambrogio','Milán','milan-centro','cultura','1h','cualquiera','gratis','La iglesia más antigua y más milanesa: ladrillo románico, un atrio porticado y un altar de oro.',[45.4625,9.1758],[]),
  N('san-maurizio','San Maurizio al Monastero Maggiore','Milán','milan-centro','cultura','1h','cualquiera','gratis','Por fuera no dice nada; por dentro no queda un centímetro sin fresco.',[45.4655,9.1790],[],{consejo:'Cierra los lunes.'}),
  N('monumentale','Cimitero Monumentale','Milán','milan-centro','cultura','1h','cualquiera','gratis','Un cementerio que es un museo de escultura al aire libre: panteones como templos, pirámides y torres.',[45.4860,9.1785],[],{consejo:'Cierra los lunes.'}),
  N('san-bernardino-ossa','San Bernardino alle Ossa','Milán','milan-centro','cultura','1h','cualquiera','gratis','Una capilla lateral con las paredes forradas de cráneos y huesos, a cinco minutos del Duomo.',[45.4625,9.1955],[]),
  N('paolo-sarpi','Via Paolo Sarpi: Chinatown','Milán','milan-centro','gastronomia','1h','cualquiera','bajo','La calle peatonal del barrio chino: raviolis a la plancha por la ventanilla, bubble tea y tiendas.',[45.4815,9.1755],[],{ambiente:'social'}),
  N('fondazione-prada','Fondazione Prada','Milán','navigli','cultura','2h','cualquiera','medio','Arte contemporáneo en una antigua destilería, con una torre blanca y una casa forrada de pan de oro.',[45.4445,9.2050],[],{consejo:'De pago; cierra los martes.'}),
  N('torre-branca','Torre Branca','Milán','milan-centro','postal','1h','cualquiera','bajo','Una torre de hierro en el Parco Sempione a la que se sube en ascensor para ver el Duomo, los rascacielos y, con suerte, los Alpes.',[45.4735,9.1730],[],{consejo:'De pago; horario irregular, miradlo antes.'}),
  N('citylife','CityLife: las tres torres','Milán','milan-centro','postal','1h','cualquiera','gratis','El barrio nuevo sobre la antigua feria: tres rascacielos (el recto, el torcido y el curvo), parque y centro comercial.',[45.4780,9.1560],[],{tipos:['compras']}),
  N('darsena-lavandai','Darsena y Vicolo dei Lavandai de día','Milán','navigli','postal','1h','cualquiera','gratis','El antiguo puerto de Milán y el callejón donde se lavaba la ropa en el canal, antes de que lleguen las terrazas.',[45.4525,9.1765],[['Darsena',45.4530,9.1780],['Vicolo dei Lavandai',45.4520,9.1745]]),
  N('certosa-pavia','Certosa di Pavia','Certosa di Pavia','milan-centro','cultura','medio_dia','cualquiera','gratis','Un monasterio con una fachada de mármol tallada hasta el último rincón, en mitad del campo.',[45.2570,9.1480],[],{consejo:'Tren regional desde Milán; de la estación se rodea el muro andando. Cierra a mediodía y los lunes.'}),
  N('vigevano','Vigevano y su Piazza Ducale','Vigevano','navigli','postal','medio_dia','cualquiera','gratis','Una de las plazas renacentistas más armoniosas de Italia, porticada por tres lados, con un castillo detrás.',[45.3170,8.8580],[],{consejo:'Tren regional desde Milano Porta Genova.'}),
  N('accademia-carrara','Accademia Carrara','Bérgamo','bergamo','cultura','2h','cualquiera','medio','Botticelli, Bellini, Rafael y Mantegna en un museo pequeño y sin colas, en la ciudad baja.',[45.7045,9.6760],[],{consejo:'De pago.'}),
  N('bergamo-bassa','Bérgamo Baja: Sentierone y Via XX Settembre','Bérgamo','bergamo','compras','1h','tarde','gratis','El paseo arbolado y la calle de tiendas de la ciudad de abajo.',[45.6945,9.6690],[]),
  N('bergamo-murallas-atardecer','Murallas venecianas al atardecer','Bérgamo','bergamo','postal','1h','noche','gratis','Cinco kilómetros de murallas alrededor de la Città Alta; el tramo que mira al oeste se llena a la puesta de sol.',[45.7030,9.6600],[]),
  N('crespi-adda','Crespi d\'Adda','Crespi d\'Adda','bergamo','cultura','2h','cualquiera','gratis','Un pueblo obrero del siglo XIX construido entero por los dueños de una fábrica textil: casas iguales, iglesia, escuela y cementerio.',[45.5960,9.5360],[],{coche:true}),
  N('monte-isola','Lago d\'Iseo y Monte Isola','Iseo','bergamo','naturaleza','dia_completo','cualquiera','bajo','Una isla-montaña en medio del lago, sin coches: se da la vuelta en bici o andando.',[45.7050,10.0850],[],{coche:true,meses:TEMP})
 ]
},
'friuli-venezia-giulia': {
 paradas: {
  'piazza-unita-molo-audace': [['Piazza Unità d\'Italia',45.6503,13.7675],['Molo Audace',45.6515,13.7645]],
  'canal-grande-borgo': [['Ponterosso (estatua de Joyce)',45.6523,13.7705],['San Spiridione',45.6527,13.7723,'la iglesia serbo-ortodoxa'],['Sant\'Antonio Nuovo',45.6530,13.7730]],
  'san-giusto': [['Cattedrale di San Giusto',45.6468,13.7725],['Castello di San Giusto',45.6472,13.7740,'de pago']],
  'teatro-romano': [['Teatro romano',45.6490,13.7715],['Arco di Riccardo',45.6478,13.7705]],
  'udine-centro': [['Piazza della Libertà',46.0625,13.2355],['Castello di Udine',46.0645,13.2365,'la subida y la explanada son gratis'],['Piazza Matteotti',46.0630,13.2335],['Duomo de Udine',46.0610,13.2370]],
  'cividale': [['Ponte del Diavolo',46.0915,13.4320],['Tempietto Longobardo',46.0935,13.4345,'de pago']],
  'gorizia-nova-gorica': [['Castello di Gorizia',45.9445,13.6285],['Piazza Transalpina',45.9555,13.6350,'la plaza partida por la frontera']]
 },
 nuevas: [
  N('revoltella','Museo Revoltella','Trieste','trieste','cultura','2h','cualquiera','bajo','El palacio de un barón del XIX con sus salones intactos, unido a una galería de arte moderno con terraza.',[45.6465,13.7640],[],{consejo:'De pago; cierra los martes.'}),
  N('faro-vittoria','Faro della Vittoria','Trieste','trieste','postal','1h','cualquiera','gratis','Un faro monumental sobre la carretera de la costa, con todo el golfo delante.',[45.6755,13.7570],[],{consejo:'Solo se sube algunos días: miradlo antes.'}),
  N('buffet-triestino','Comer en un buffet triestino','Trieste','trieste','gastronomia','1h','cualquiera','bajo','Herencia austrohúngara: cerdo cocido cortado al momento, con mostaza y rábano picante rallado, de pie o en mesa compartida.',[45.6510,13.7705],[],{q:'buffet triestino, Trieste centro',ambiente:'social'}),
  N('pedocin','Bagno alla Lanterna, «el Pedocin»','Trieste','trieste','playa','2h','cualquiera','bajo','La playa urbana donde un muro separa todavía a hombres y mujeres. Los triestinos la adoran.',[45.6470,13.7570],[],{meses:VERANO,consejo:'Entrada de pago, simbólica.'}),
  N('muggia','Muggia','Muggia','trieste','postal','2h','tarde','gratis','Un puerto pequeño de aire veneciano en la otra punta del golfo, con plaza, catedral y terrazas.',[45.6050,13.7670],[],{consejo:'En barco desde el muelle de Trieste o en bus urbano.'}),
  N('duino-rilke','Castello di Duino y Sentiero Rilke','Duino','trieste','naturaleza','medio_dia','cualquiera','bajo','Un sendero llano por el borde de un acantilado blanco, hasta un castillo asomado al mar.',[45.7720,13.6040],[],{consejo:'Bus desde Trieste. El sendero es gratis; el castillo, de pago y cerrado en invierno.'}),
  N('val-rosandra','Val Rosandra','San Dorligo della Valle','trieste','naturaleza','medio_dia','manana','gratis','Un cañón kárstico a las afueras: sendero junto al torrente, cascada y pozas.',[45.6190,13.8650],[],{esfuerzo:'medio',consejo:'Bus urbano desde Trieste hasta Bagnoli.'}),
  N('tiepolo-udine','Los frescos de Tiepolo en el Palazzo Patriarcale','Udine','udine','cultura','1h','cualquiera','bajo','Techos y galerías pintados por un Tiepolo joven, en el antiguo palacio de los patriarcas.',[46.0635,13.2395],[],{consejo:'De pago.'}),
  N('mercatovecchio','Via Mercatovecchio','Udine','udine','compras','1h','tarde','gratis','La calle porticada más antigua de Udine, hoy peatonal.',[46.0640,13.2350],[]),
  N('san-daniele','San Daniele del Friuli: el jamón','San Daniele del Friuli','udine','gastronomia','medio_dia','cualquiera','medio','El pueblo de colina donde se cura el prosciutto di San Daniele: se viene a comerlo recién cortado.',[46.1580,13.0100],[],{consejo:'Bus desde Udine.'}),
  N('palmanova','Palmanova, la ciudad-estrella','Palmanova','udine','cultura','2h','cualquiera','gratis','Una fortaleza veneciana con planta de estrella de nueve puntas y una plaza hexagonal en el centro.',[45.9050,13.3100],[],{consejo:'En tren desde Udine.'}),
  N('venzone','Venzone','Venzone','udine','cultura','2h','cualquiera','gratis','Un pueblo amurallado reconstruido piedra a piedra después del terremoto de 1976.',[46.3340,13.1390],[],{consejo:'En tren desde Udine.'}),
  N('grado','Grado: la isla del sol','Grado','udine','playa','dia_completo','cualquiera','bajo','Casco antiguo de pescadores, basílicas paleocristianas y playas largas de arena en una isla de la laguna.',[45.6780,13.3950],[],{coche:true,meses:VERANO}),
  N('fusine','Lagos de Fusine','Tarvisio','udine','naturaleza','dia_completo','manana','gratis','Dos lagos alpinos al pie del Mangart, casi en la frontera con Eslovenia.',[46.4770,13.6700],[],{coche:true,meses:MONT})
 ]
}
};
