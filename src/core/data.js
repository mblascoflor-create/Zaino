/* ===== data.js — tablas fijas de la app (presentación por zona, orígenes, preguntas) =====
   META por zona: lo que la biblioteca v73 no tenía y la app necesita para elegir destino y dibujar
   la tarjeta. Si la biblioteca v2 trae perfil/meses/precio/coche, la biblioteca manda (ver normalizar). */
var META = {
  toscana:{corto:'Toscana',lema:'Colinas, cipreses y Renacimiento',perfil:{mar:0,montana:0,ciudad:2,campo:3,fiesta:1,calma:3,cultura:3,gastronomia:3,naturaleza:2,playa:0,aventura:1,postal:3},precio:'medio',meses:{ideales:[4,5,6,9,10],aceptables:[3,7,11],evitar:[8]},calor:'alto',nieve:false,coche:'util',inks:['#D9A441','#2F5D3A','#C8553D'],bg:'#F6E7C1',escena:'toscana'},
  roma:{corto:'Roma',lema:'Ruinas, pinos y aperitivo eterno',perfil:{mar:0,montana:0,ciudad:3,campo:0,fiesta:3,calma:1,cultura:3,gastronomia:3,naturaleza:0,playa:0,aventura:0,postal:3},precio:'medio',meses:{ideales:[3,4,5,10,11],aceptables:[2,6,9,12],evitar:[7,8]},calor:'extremo',nieve:false,coche:'innecesario',inks:['#B5382A','#E0A43B','#5BA4E6'],bg:'#F3D9B8',escena:'roma'},
  napoles:{corto:'Nápoles',lema:'Volcán, islas y la mejor pizza',perfil:{mar:3,montana:1,ciudad:3,campo:0,fiesta:3,calma:1,cultura:3,gastronomia:3,naturaleza:2,playa:2,aventura:1,postal:2},precio:'bajo',meses:{ideales:[4,5,6,9,10],aceptables:[3,7,11],evitar:[8]},calor:'alto',nieve:false,coche:'innecesario',inks:['#1E4FA8','#E8432E','#F2B53A'],bg:'#CFE3F2',escena:'napoles'},
  'costa-amalfitana':{corto:'Amalfi',lema:'Limones, acantilados y mayólica',perfil:{mar:3,montana:2,ciudad:0,campo:1,fiesta:1,calma:3,cultura:1,gastronomia:3,naturaleza:2,playa:2,aventura:2,postal:3},precio:'alto',meses:{ideales:[5,6,9],aceptables:[4,7,10],evitar:[8,11,12,1,2]},calor:'alto',nieve:false,coche:'innecesario',inks:['#FFD23B','#1565C0','#2E9E5B'],bg:'#D7EEF7',escena:'amalfi'},
  'veneto-venecia':{corto:'Venecia',lema:'Laguna, spritz y cicchetti',perfil:{mar:1,montana:0,ciudad:3,campo:1,fiesta:2,calma:2,cultura:3,gastronomia:2,naturaleza:1,playa:0,aventura:0,postal:3},precio:'alto',meses:{ideales:[3,4,5,9,10],aceptables:[2,6,11],evitar:[7,8]},calor:'alto',nieve:false,coche:'innecesario',inks:['#E8A0A8','#2F7F7A','#B3261E'],bg:'#F3E4D6',escena:'venecia'},
  sicilia:{corto:'Sicilia',lema:'Volcán, limones y street food',perfil:{mar:3,montana:2,ciudad:2,campo:1,fiesta:2,calma:2,cultura:3,gastronomia:3,naturaleza:3,playa:3,aventura:2,postal:3},precio:'bajo',meses:{ideales:[5,6,9,10],aceptables:[4,7,11],evitar:[8]},calor:'extremo',nieve:false,coche:'util',inks:['#FFC914','#1846C7','#E4312B'],bg:'#FFE680',escena:'sicilia'},
  cerdena:{corto:'Cerdeña',lema:'Calas turquesa y nuraghes',perfil:{mar:3,montana:1,ciudad:1,campo:1,fiesta:1,calma:3,cultura:1,gastronomia:2,naturaleza:3,playa:3,aventura:2,postal:3},precio:'medio',meses:{ideales:[6,9],aceptables:[5,7,10],evitar:[11,12,1,2]},calor:'alto',nieve:false,coche:'imprescindible',inks:['#19B5C8','#E7B9A5','#D7263D'],bg:'#D6F3F2',escena:'cerdena'},
  dolomitas:{corto:'Dolomitas',lema:'Picos rosas al atardecer',perfil:{mar:0,montana:3,ciudad:0,campo:1,fiesta:1,calma:3,cultura:1,gastronomia:2,naturaleza:3,playa:0,aventura:3,postal:3},precio:'alto',meses:{ideales:[1,2,3,7,8,9],aceptables:[6,10,12],evitar:[4,5,11]},calor:'suave',nieve:true,coche:'util',inks:['#FF9EAA','#1B2A4A','#1F6B4F'],bg:'#22345A',escena:'dolomitas'},
  'puglia-salento':{corto:'Puglia',lema:'Trulli, olivos y mar blanco',perfil:{mar:3,montana:0,ciudad:1,campo:2,fiesta:2,calma:2,cultura:2,gastronomia:3,naturaleza:2,playa:3,aventura:1,postal:3},precio:'bajo',meses:{ideales:[5,6,9],aceptables:[4,7,10],evitar:[8]},calor:'alto',nieve:false,coche:'util',inks:['#1B6CA8','#FFC83D','#D7263D'],bg:'#FBF3E2',escena:'puglia'},
  'liguria-cinque-terre':{corto:'Liguria',lema:'Casas de colores y focaccia',perfil:{mar:3,montana:1,ciudad:1,campo:1,fiesta:1,calma:2,cultura:1,gastronomia:3,naturaleza:3,playa:2,aventura:2,postal:3},precio:'alto',meses:{ideales:[4,5,6,9,10],aceptables:[3,7],evitar:[8,12,1]},calor:'alto',nieve:false,coche:'innecesario',inks:['#F28C7A','#F4C542','#1F5FAE'],bg:'#DDEBF7',escena:'liguria'},
  umbria:{corto:'Umbria',lema:'El corazón verde, sin agobios',perfil:{mar:0,montana:1,ciudad:1,campo:3,fiesta:0,calma:3,cultura:3,gastronomia:3,naturaleza:2,playa:0,aventura:1,postal:2},precio:'bajo',meses:{ideales:[4,5,6,9,10],aceptables:[3,7,11],evitar:[8]},calor:'alto',nieve:false,coche:'util',inks:['#4F7942','#2456A6','#F2C230'],bg:'#EEF0D2',escena:'umbria'},
  'emilia-romana-gastronomica':{corto:'Emilia-Romaña',lema:'Pórticos, torres y tortellini',perfil:{mar:1,montana:0,ciudad:3,campo:1,fiesta:3,calma:1,cultura:3,gastronomia:3,naturaleza:0,playa:1,aventura:1,postal:2},precio:'medio',meses:{ideales:[4,5,9,10],aceptables:[3,6,11,12],evitar:[7,8]},calor:'alto',nieve:false,coche:'innecesario',inks:['#B43A2E','#E2A04A','#1D3F8F'],bg:'#F4DCC4',escena:'emilia'},
  piamonte:{corto:'Piamonte',lema:'Vermut, avellanas y Alpes',perfil:{mar:0,montana:2,ciudad:2,campo:3,fiesta:1,calma:3,cultura:2,gastronomia:3,naturaleza:2,playa:0,aventura:1,postal:2},precio:'medio',meses:{ideales:[4,5,9,10,11],aceptables:[3,6,12],evitar:[8]},calor:'suave',nieve:false,coche:'util',inks:['#6E1E2B','#B98B5E','#4B61D1'],bg:'#EDE3D3',escena:'piamonte'},
  'lagos-del-norte':{corto:'Lagos',lema:'Ferris, villas y agua fría',perfil:{mar:0,montana:2,ciudad:1,campo:1,fiesta:1,calma:3,cultura:2,gastronomia:2,naturaleza:3,playa:1,aventura:2,postal:3},precio:'alto',meses:{ideales:[5,6,9],aceptables:[4,7,8,10],evitar:[12,1,2]},calor:'suave',nieve:false,coche:'util',inks:['#2C6E91','#2F6F4F','#E86A92'],bg:'#DCEEF2',escena:'lagos'},
  'basilicata-matera':{corto:'Matera',lema:'Una ciudad de piedra y cuevas',perfil:{mar:1,montana:2,ciudad:1,campo:2,fiesta:0,calma:3,cultura:3,gastronomia:2,naturaleza:2,playa:1,aventura:2,postal:3},precio:'bajo',meses:{ideales:[4,5,6,9,10],aceptables:[3,7,11],evitar:[8]},calor:'alto',nieve:false,coche:'util',inks:['#D9C3A0','#C1272D','#6BA5D7'],bg:'#F2E6CF',escena:'matera'},
  calabria:{corto:'Calabria',lema:'Acantilados, guindilla y mar',perfil:{mar:3,montana:2,ciudad:0,campo:1,fiesta:1,calma:3,cultura:1,gastronomia:3,naturaleza:3,playa:3,aventura:2,postal:3},precio:'bajo',meses:{ideales:[6,9],aceptables:[5,7,10],evitar:[8,12,1,2]},calor:'alto',nieve:false,coche:'imprescindible',inks:['#D62828','#C9D233','#1FA5B8'],bg:'#FDE3CF',escena:'calabria'},
  'lombardia-milan':{corto:'Milán',lema:'Diseño, Navigli y aperitivo',perfil:{mar:0,montana:0,ciudad:3,campo:0,fiesta:3,calma:0,cultura:2,gastronomia:2,naturaleza:0,playa:0,aventura:0,postal:1},precio:'alto',meses:{ideales:[3,4,5,9,10,11],aceptables:[2,6,12],evitar:[8]},calor:'alto',nieve:false,coche:'innecesario',inks:['#F6C400','#2D5BFF','#E63946'],bg:'#F2F2EC',escena:'milan'},
  'friuli-venezia-giulia':{corto:'Trieste',lema:'Café, viento y mar del Este',perfil:{mar:2,montana:1,ciudad:2,campo:1,fiesta:1,calma:3,cultura:2,gastronomia:2,naturaleza:2,playa:1,aventura:1,postal:2},precio:'medio',meses:{ideales:[5,6,9,10],aceptables:[4,7,8],evitar:[1,2]},calor:'suave',nieve:false,coche:'util',inks:['#27548A','#5A8F3C','#5A3A29'],bg:'#DCE6EE',escena:'trieste'},
  abruzos:{corto:'Abruzos',lema:'Del Gran Sasso a los trabocchi',perfil:{mar:2,montana:3,ciudad:1,campo:2,fiesta:1,calma:3,cultura:1,gastronomia:2,naturaleza:3,playa:2,aventura:2,postal:2},precio:'bajo',meses:{ideales:[6,7,9],aceptables:[5,8,10,1,2],evitar:[11]},calor:'suave',nieve:true,coche:'imprescindible',inks:['#2F6B4F','#F2A900','#2B6CB0'],bg:'#E4F0E2',escena:'abruzos'},
  molise:{corto:'Molise',lema:'Sí existe, y casi nadie lo sabe',perfil:{mar:2,montana:1,ciudad:0,campo:3,fiesta:0,calma:3,cultura:2,gastronomia:2,naturaleza:2,playa:1,aventura:1,postal:1},precio:'bajo',meses:{ideales:[5,6,9],aceptables:[4,7,10],evitar:[8,12,1]},calor:'alto',nieve:false,coche:'imprescindible',inks:['#6A8F3F','#A9743A','#2F6DB5'],bg:'#EEEBD9',escena:'molise'},
  'valle-de-aosta':{corto:'Aosta',lema:'Bajo el Mont Blanc',perfil:{mar:0,montana:3,ciudad:0,campo:1,fiesta:1,calma:3,cultura:2,gastronomia:2,naturaleza:3,playa:0,aventura:3,postal:3},precio:'alto',meses:{ideales:[1,2,7,8],aceptables:[3,6,9,12],evitar:[4,5,11]},calor:'suave',nieve:true,coche:'util',inks:['#9FD3F0','#D01C1F','#1F5B45'],bg:'#E8F3FA',escena:'aosta'},
  marcas:{corto:'Las Marcas',lema:'Acantilados blancos y Urbino',perfil:{mar:3,montana:1,ciudad:1,campo:2,fiesta:1,calma:3,cultura:2,gastronomia:2,naturaleza:2,playa:3,aventura:1,postal:2},precio:'bajo',meses:{ideales:[5,6,9],aceptables:[4,7,10],evitar:[8,12,1]},calor:'alto',nieve:false,coche:'util',inks:['#B5593A','#1F86C7','#4E8B4A'],bg:'#F4E9DA',escena:'marcas'},
  trento:{corto:'Trento',lema:'Manzanos, lagos y castillos',perfil:{mar:0,montana:3,ciudad:2,campo:2,fiesta:1,calma:3,cultura:2,gastronomia:2,naturaleza:3,playa:0,aventura:2,postal:2},precio:'medio',meses:{ideales:[5,6,7,9,12,1,2],aceptables:[3,8,10],evitar:[4,11]},calor:'suave',nieve:true,coche:'util',inks:['#D7263D','#7BB661','#2A6FB0'],bg:'#EAF1DC',escena:'trento'}
};

/* Base de referencia de cada zona cuando la biblioteca todavía no trae "bases" (v73). */
var BASE_FALLBACK = {
  toscana:'Florencia', roma:'Roma', napoles:'Nápoles', 'costa-amalfitana':'Sorrento', 'veneto-venecia':'Venecia', sicilia:'Catania',
  cerdena:'Cagliari', dolomitas:'Ortisei', 'puglia-salento':'Bari', 'liguria-cinque-terre':'La Spezia', umbria:'Perugia',
  'emilia-romana-gastronomica':'Bolonia', piamonte:'Turín', 'lagos-del-norte':'Como', 'basilicata-matera':'Matera', calabria:'Tropea',
  'lombardia-milan':'Milán', 'friuli-venezia-giulia':'Trieste', abruzos:'Pescara', molise:'Termoli', 'valle-de-aosta':'Aosta',
  marcas:'Ancona', trento:'Trento'
};

/* Ciudades de salida. iata = aeropuerto para buscar vuelos (null = sin aeropuerto propio útil). */
var ORIGENES_ES = [
  {c:'Barcelona',iata:'BCN'},{c:'Madrid',iata:'MAD'},{c:'Valencia',iata:'VLC'},{c:'Sevilla',iata:'SVQ'},
  {c:'Málaga',iata:'AGP'},{c:'Bilbao',iata:'BIO'},{c:'Alicante',iata:'ALC'},{c:'Palma',iata:'PMI'},
  {c:'Castellón',iata:'CDT'},{c:'Girona',iata:'GRO'},{c:'Zaragoza',iata:'ZAZ'},{c:'Santiago',iata:'SCQ'},
  {c:'Granada',iata:'GRX'},{c:'Murcia',iata:'RMU'},{c:'Asturias',iata:'OVD'},{c:'Santander',iata:'SDR'},
  {c:'Vigo',iata:'VGO'},{c:'Ibiza',iata:'IBZ'},{c:'Menorca',iata:'MAH'},{c:'Tenerife',iata:'TFN'},
  {c:'Gran Canaria',iata:'LPA'},{c:'Reus',iata:'REU'}
];
var ORIGENES_IT = [
  {c:'Bolonia',iata:'BLQ'},{c:'Milán',iata:'MXP'},{c:'Roma',iata:'FCO'},{c:'Florencia',iata:'FLR'},
  {c:'Turín',iata:'TRN'},{c:'Padua',iata:'VCE'},{c:'Venecia',iata:'VCE'},{c:'Nápoles',iata:'NAP'},
  {c:'Pisa',iata:'PSA'},{c:'Génova',iata:'GOA'},{c:'Bari',iata:'BRI'},{c:'Palermo',iata:'PMO'},
  {c:'Catania',iata:'CTA'},{c:'Verona',iata:'VRN'},{c:'Trento',iata:'VRN'},{c:'Pavía',iata:'MXP'},
  {c:'Parma',iata:'BLQ'},{c:'Siena',iata:'FLR'},{c:'Perugia',iata:'PEG'},{c:'Trieste',iata:'TRS'}
];

var INTERESES = [
  {k:'cultura',label:'Historia y museos',art:'cultura'},
  {k:'gastronomia',label:'Comer y beber',art:'gastronomia'},
  {k:'naturaleza',label:'Rutas y naturaleza',art:'naturaleza'},
  {k:'playa',label:'Playa y calas',art:'playa'},
  {k:'aventura',label:'Adrenalina',art:'aventura'},
  {k:'postal',label:'Miradores de postal',art:'postal'},
  {k:'compras',label:'Mercados y tiendas',art:'compras'},
  {k:'agua',label:'Barco, kayak, snorkel',art:'agua'},
  {k:'fiesta',label:'Ambiente y música',art:'fiesta'}
];

var MESES_LARGO = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
var MESES_CORTO = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
var DIAS_SEMANA = ['dom','lun','mar','mié','jue','vie','sáb'];

/* Paleta de fondos de las pantallas de pregunta cuando aún no hay destino (tintas planas). */
var TINTAS_PREGUNTA = ['#F6DE97','#BFE3DD','#FBCABF','#DCC9DD','#F3E8D3','#CFE9C9','#F9D7A8','#C9DCEB']; // tintas claras de la paleta: la letra siempre en marrón

/* Coordenadas aproximadas (lat, lon) de las bases y aeropuertos, para que el plan no salte de punta a punta
   de una región: excursiones de un día solo dentro de un radio razonable desde donde dormís. */
var GEO = {
  florencia:[43.77,11.25], siena:[43.32,11.33], pisa:[43.72,10.40], centro:[41.90,12.50], trastevere:[41.885,12.47], 'san-lorenzo':[41.895,12.52],
  napoles:[40.85,14.26], ischia:[40.73,13.90], procida:[40.76,14.02], amalfi:[40.63,14.60], sorrento:[40.63,14.37], salerno:[40.68,14.77], praiano:[40.61,14.53],
  venecia:[45.44,12.33], mestre:[45.49,12.24], padua:[45.41,11.88], verona:[45.44,10.99], palermo:[38.12,13.36], catania:[37.50,15.09], siracusa:[37.06,15.29], 'san-vito':[38.17,12.73],
  cagliari:[39.22,9.12], alghero:[40.56,8.32], 'cala-gonone':[40.28,9.63], bolzano:[46.50,11.35], ortisei:[46.57,11.67], cortina:[46.54,12.14],
  bari:[41.12,16.87], lecce:[40.35,18.17], gallipoli:[40.06,17.99], ostuni:[40.73,17.58], 'la-spezia':[44.10,9.82], genova:[44.41,8.93], monterosso:[44.15,9.65], camogli:[44.35,9.15],
  perugia:[43.11,12.39], asis:[43.07,12.62], orvieto:[42.72,12.11], bologna:[44.49,11.34], modena:[44.65,10.93], rimini:[44.06,12.57], torino:[45.07,7.69], alba:[44.70,8.03],
  como:[45.81,9.09], varenna:[46.01,9.28], desenzano:[45.47,10.54], stresa:[45.88,8.53], matera:[40.67,16.60], castelmezzano:[40.53,16.05], maratea:[39.99,15.72],
  tropea:[38.68,15.90], 'capo-vaticano':[38.62,15.83], reggio:[38.11,15.65], cosenza:[39.30,16.25], 'milan-centro':[45.465,9.19], navigli:[45.45,9.175], bergamo:[45.70,9.67],
  trieste:[45.65,13.78], udine:[46.06,13.24], aosta:[45.74,7.32], courmayeur:[45.79,6.97], cogne:[45.61,7.36], cervinia:[45.93,7.63],
  ancona:[43.62,13.52], urbino:[43.73,12.64], sirolo:[43.52,13.62], ascoli:[42.85,13.58], trento:[46.07,11.12], riva:[45.89,10.84], campiglio:[46.23,10.83],
  pescara:[42.46,14.21], termoli:[42.00,14.99], 'l-aquila':[42.35,13.40], sulmona:[42.05,13.93], 'vasto':[42.11,14.71], campobasso:[41.56,14.66], laquila:[42.35,13.40], agnone:[41.81,14.38], 'san-vito-chietino':[42.30,14.44],
  PSA:[43.68,10.39], FLR:[43.81,11.20], FCO:[41.80,12.25], CIA:[41.80,12.59], NAP:[40.88,14.29], QSR:[40.62,14.91], VCE:[45.50,12.35], TSF:[45.65,12.19], VRN:[45.40,10.89],
  CTA:[37.47,15.07], PMO:[38.18,13.10], TPS:[37.91,12.49], CIY:[36.99,14.61], CAG:[39.25,9.06], AHO:[40.63,8.29], OLB:[40.90,9.52], BZO:[46.46,11.33], INN:[47.26,11.34],
  BRI:[41.14,16.76], BDS:[40.66,17.95], GOA:[44.41,8.84], MXP:[45.63,8.72], PEG:[43.10,12.51], BLQ:[44.53,11.29], RMI:[44.02,12.61], TRN:[45.20,7.65], BGY:[45.67,9.70],
  SUF:[38.91,16.24], REG:[38.07,15.65], CRV:[39.00,17.08], LIN:[45.45,9.28], TRS:[45.83,13.47], AOI:[43.62,13.36], PSR:[42.43,14.18]
};
