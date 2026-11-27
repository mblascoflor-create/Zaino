// GENERADO por tools/build.mjs — no editar a mano (edita src/core/*)
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

;
/* ===== engine.js — motor determinista: biblioteca → destino → itinerario → reservas =====
   Todo lo que sale en pantalla viene de la biblioteca o de las respuestas; nada se inventa.
   Funciones puras (sin DOM) para poder probarlas en node. */
var ENG = (function(){
  'use strict';

  function slug(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48) || 'x'; }
  function norm(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9ñ\s]/g,' '); }
  function q(s){ return encodeURIComponent(s); }
  function maps(query){ return 'https://www.google.com/maps/search/?api=1&query='+q(query); }
  function uniq(a){ var s={},o=[]; (a||[]).forEach(function(x){ if(x!=null && x!=='' && !s[x]){ s[x]=1; o.push(x); } }); return o; }
  function hash(str){ var h=2166136261; str=String(str); for(var i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619); } return (h>>>0); }

  function ENG_norm(x){ return norm(x).replace(/\s+/g,' ').trim(); }
  var TIPO_MAP = {cultura:'cultura',historia:'cultura',arte:'cultura',museo:'cultura',naturaleza:'naturaleza',senderismo:'naturaleza',montana:'naturaleza',
    gastronomia:'gastronomia',comida:'gastronomia',vino:'gastronomia',playa:'playa',mar:'playa',fiesta:'fiesta',noche:'fiesta',ocio:'fiesta',
    aventura:'aventura',deporte:'aventura',bienestar:'bienestar',relax:'bienestar',compras:'compras',mercado:'compras',postal:'postal',fotografia:'postal',
    agua:'agua',barco:'agua',musica:'musica'};
  function tipoOk(t){ t=norm(t).trim(); return TIPO_MAP[t] || 'cultura'; }
  function costeOk(c){ c=norm(c); if(/gratis|gratuito/.test(c)) return 'gratis'; if(/alto/.test(c) && !/medio/.test(c)) return 'alto'; if(/medio.alto|alto/.test(c)) return 'alto'; if(/medio/.test(c)) return 'medio'; return 'bajo'; }
  function iataDe(s){ var m=String(s||'').match(/\(([A-Z]{3})\)/); return m?m[1]:(/^[A-Z]{3}$/.test(s)?s:null); }

  /* ---------- 1. Normalizar una zona (acepta biblioteca v73 y v2) ---------- */
  function normalizar(z){
    var M = (typeof META!=='undefined' && META[z.id]) || {};
    var baseNombre = (typeof BASE_FALLBACK!=='undefined' && BASE_FALLBACK[z.id]) || z.nombre;
    var bases = (z.bases && z.bases.length) ? z.bases.map(function(b){ return {id:b.id||slug(b.nombre), nombre:b.nombre, por_que:b.por_que||'', sin_coche:b.sin_coche!==false, ambiente:b.ambiente||'mixto', maps:b.maps||maps(b.nombre+', Italia')}; })
      : [{id:slug(baseNombre), nombre:baseNombre, por_que:'La base más práctica de la zona para llegar y moverse.', sin_coche:true, ambiente:'mixto', maps:maps(baseNombre+', Italia')}];
    var baseIds = bases.map(function(b){ return b.id; });

    var aeropuertos = [];
    if(z.llegar && z.llegar.aeropuertos) aeropuertos = z.llegar.aeropuertos.map(function(a){ return {iata:a.iata, nombre:a.nombre, ciudad:a.ciudad||a.nombre, a_la_base:a.a_la_base||''}; });
    else (z.aeropuertos||[]).forEach(function(s){
      s=String(s); var m=s.match(/\b([A-Z]{3})\b/); if(!m) return; var i=m[1];
      var nota=''; var cuerpo=s;
      var pm = s.match(/^([A-Z]{3})\s*\((.*?)\)\s*(.*)$/); // "BLQ (Bolonia - Guglielmo Marconi)"
      if(pm){ cuerpo = pm[2]; nota = pm[3]; }
      else { cuerpo = s.replace(/\s*\(([A-Z]{3})[^)]*\)/,'').split(/[,;]/)[0]; nota = s.split(/[,;]|\)\s*[–-]/).slice(1).join(',').replace(/^\s*[–-]?\s*/,''); }
      cuerpo = cuerpo.replace(/\s+[–-]\s+(el|la|alternativa|vuelos|mejor|útil|para)\b.*$/,'').trim();
      var ciudad = cuerpo.split(/\s*[–\/-]\s*/)[0].replace(/^Sin aeropuerto propio.*?suele ser\s*/,'').trim();
      cuerpo=cuerpo.replace(/^Sin aeropuerto propio.*?suele ser\s*/,'').replace(/,.*$/,'').replace(/\s*\+.*$/,''); ciudad=ciudad.replace(/\s*\+.*$/,'').replace(/,.*$/,'').replace(/\s+(Bérgamo|Malpensa|Fiumicino)$/,'');
      aeropuertos.push({iata:i, nombre:cuerpo, ciudad:ciudad, a_la_base:'', nota:nota.trim()}); });

    var rutas = (z.llegar && z.llegar.rutas_directas) || [];
    var novedades = (z.llegar && z.llegar.novedades) || z.novedades_transporte_2026 || [];

    // coche
    var cocheNec = (z.coche && z.coche.necesidad) || M.coche || 'util';
    var ops = [];
    if(z.coche && z.coche.operadores) ops = z.coche.operadores.map(function(o){ return {nombre:o.nombre, enlace:o.enlace}; });
    else if(z.alquiler_coches && z.alquiler_coches.operadores_confirmados) ops = z.alquiler_coches.operadores_confirmados.map(function(o){ return {nombre:o.empresa, enlace:o.fuente}; });
    var coche = {necesidad:cocheNec, nota:(z.coche&&z.coche.nota) || z.movilidad_recomendada || '', aeropuerto:(z.coche&&z.coche.aeropuerto_recogida) || (z.alquiler_coches&&iataDe(z.alquiler_coches.aeropuerto_referencia)) || (aeropuertos[0]&&aeropuertos[0].iata) || '', operadores:ops.filter(function(o){ return /^https:\/\//.test(o.enlace||''); })};

    // moverse
    var mv = z.moverse || {};
    var bus = mv.bus!==undefined ? mv.bus : (z.autobus_larga_distancia ? {operador:z.autobus_larga_distancia.operador, nota:'Autobuses de larga distancia entre ciudades de Italia.', enlace:z.autobus_larga_distancia.enlace_busqueda||z.autobus_larga_distancia.fuente} : null);
    var ferry = mv.ferry || (z.ferry ? (Array.isArray(z.ferry)?z.ferry:[z.ferry]).map(function(f){ return {operador:f.operador, ruta:f.ruta, nota:f.nota||'', enlace:f.enlace_busqueda||f.fuente}; }) : []);
    var camper = mv.camper!==undefined ? mv.camper : (z.furgonetas_camper ? {operador:z.furgonetas_camper.operador, nota:'Furgonetas camperizadas de alquiler: dormís donde aparcáis (respetando las normas locales).', enlace:z.furgonetas_camper.enlace_busqueda||z.furgonetas_camper.fuente} : null);
    var tren = mv.tren!==undefined ? mv.tren : {nota:(z.transporte_estimado&&z.transporte_estimado.tren_interno)||'', enlace:'https://www.trenitalia.com/'};

    // actividades
    var acts = [];
    if(z.actividades && z.actividades.length){
      acts = z.actividades.map(function(a){ return {
        id:a.id, nombre:a.nombre, donde:a.donde||bases[0].nombre, base: baseIds.indexOf(a.base)>-1?a.base:bases[0].id,
        tipo:tipoOk(a.tipo), tipos:(a.tipos_extra||[]).map(tipoOk), duracion:a.duracion||'medio_dia', momento:a.momento||'cualquiera',
        coste:a.coste||'bajo', coche:!!a.requiere_coche, reserva:!!a.requiere_reserva, esfuerzo:a.esfuerzo||'medio', ambiente:a.ambiente||'mixto',
        meses:a.meses||null, descripcion:a.descripcion||'', consejo:a.consejo||'', enlace:a.enlace||'', enlace_tipo:a.enlace_tipo||'mapa', maps:a.maps||maps(a.nombre+', '+(a.donde||bases[0].nombre)), fuente:a.fuente||'', consejoGuia:a.consejo_guia||'', fuentesGuia:a.fuentes_guia||[], tours:a.tours||[], geo:geoOk(a.geo), extra:!!a.extra, icono:!!a.icono,
        paradas:(a.paradas||[]).filter(function(p){ return p && p.nombre && geoOk(p.geo); }).map(function(p){ return {nombre:p.nombre, geo:geoOk(p.geo), nota:p.nota||'', maps:p.maps||maps(p.nombre+', '+(a.donde||bases[0].nombre))}; })}; });
    } else {
      (z.excursiones||[]).forEach(function(e){
        var t = tipoOk(e.tipo), dur = e.duracion==='dia_completo'?'dia_completo':(e.duracion==='2h'?'2h':'medio_dia');
        var nombreLimpio = String(e.nombre).replace(/\s*\(.*?\)\s*/g,' ').trim();
        acts.push({ id:slug(e.nombre), nombre:nombreLimpio, donde:bases[0].nombre, base:bases[0].id, tipo:t, tipos:[], duracion:dur,
          momento: t==='fiesta'?'noche':'cualquiera', coste:costeOk(e.coste), coche:!!e.requiere_coche, reserva:/visita guiada|tour|cata|entrada/i.test(e.nombre),
          esfuerzo: t==='aventura'||t==='naturaleza' ? 'medio':'bajo', ambiente: t==='fiesta'?'social':'mixto', meses:null, descripcion:'', consejo:'',
          enlace:'https://www.getyourguide.es/s/?q='+q(nombreLimpio), enlace_tipo:'reserva', maps:maps(nombreLimpio+', '+z.nombre.split('(')[0]+', Italia'), fuente:'' });
      });
    }
    // si el plan tiene coordenadas, su base es la más cercana de verdad (evita excursiones lejanas marcadas como "en la base")
    acts.forEach(function(a){ if(!a.geo) return; var best=null, bd=1e9; bases.forEach(function(b){ var d=km(a.geo, geo(b.id)); if(d!=null && d<bd){ bd=d; best=b.id; } }); if(best) a.base=best; });
    var seen={}; acts = acts.filter(function(a){ if(seen[a.id]) return false; seen[a.id]=1; return true; });

    var comida = (z.comida && z.comida.length) ? z.comida.map(function(c){ return {plato:c.plato, que_es:c.que_es||'', estilo:c.estilo||'trattoria', coste:c.coste||'bajo', donde:c.donde_probarlo||'', maps:c.maps||maps(c.plato+' '+bases[0].nombre)}; })
      : (z.gastronomia||[]).map(function(g){ var t=norm(g.tipo); return {plato:g.plato, que_es:g.tipo||'', estilo: /street|calle/.test(t)?'street':(/vino|bodega|bebida|cafe|licor/.test(t)?'bebida':(/dulce|postre|pastel/.test(t)?'dulce':(/mercado/.test(t)?'mercado':'trattoria'))), coste:costeOk(g.coste), donde:'', maps:maps(String(g.plato).split('(')[0].trim()+' '+bases[0].nombre)}; });

    var noche = (z.noche||[]).map(function(n){ return {zona:n.zona, base: baseIds.indexOf(n.base)>-1?n.base:bases[0].id, plan:n.plan||'aperitivo', descripcion:n.descripcion||'', maps:n.maps||maps(n.zona+', '+bases[0].nombre), geo:geoOk(n.geo)}; });
    noche.forEach(function(n){ if(!n.geo) return; var best=null, bd=1e9; bases.forEach(function(b){ var d=km(n.geo, geo(b.id)); if(d!=null && d<bd){ bd=d; best=b.id; } }); if(best) n.base=best; });

    var aloj = (z.alojamiento||[]).map(function(a){
      var tipo = a.tipo; var tn=norm(tipo);
      if(!/^(hostel|apartamento|hotel|agriturismo|rifugio|camping|bnb)$/.test(tipo)) tipo = /hostel|compartid/.test(tn)?'hostel':(/apartamento|airbnb|piso/.test(tn)?'apartamento':(/agriturismo/.test(tn)?'agriturismo':(/refugio|rifugio/.test(tn)?'rifugio':'hotel')));
      var enlaces = a.enlaces || (a.enlace?[{sitio:'Booking', url:a.enlace}]:[]);
      return {tipo:tipo, base: baseIds.indexOf(a.base)>-1?a.base:bases[0].id, coste:costeOk(a.coste), para:a.para||'', enlaces:enlaces};
    });

    var eventos = (z.eventos||[]).map(function(e){
      var meses = e.meses, cuando = e.cuando, prox = e.proxima_fecha||null;
      if(!meses && e.fecha){ var m=+String(e.fecha).slice(5,7); meses = m?[m]:[]; var d=new Date(e.fecha+'T12:00:00');
        cuando = isNaN(d)?'':('Última edición: '+d.getDate()+' de '+MESES_LARGO[d.getMonth()]+' de '+d.getFullYear()+'. Mirad la fecha de la próxima en la web.'); }
      return {nombre:String(e.nombre).split(/\s[—-]\s/)[0].split(':')[0].trim(), detalle:e.descripcion||(String(e.nombre).indexOf(':')>-1?String(e.nombre).split(':').slice(1).join(':').trim():''), donde:e.donde||'', cuando:cuando||'', meses:meses||[], proxima_fecha:prox, enlace:e.enlace||e.fuente||''};
    }).filter(function(e){ return /^https:\/\//.test(e.enlace); });

    var perfil = z.perfil || M.perfil || {};
    return {
      id:z.id, nombre:z.nombre, corto:z.nombre_corto||M.corto||z.nombre.split('(')[0].trim(), lema:z.lema||M.lema||'', descripcion:z.descripcion||'',
      perfil:perfil, precio:z.nivel_precio||M.precio||'medio', meses:z.meses||M.meses||{ideales:[],aceptables:[],evitar:[]},
      calor:z.calor_verano||M.calor||'alto', nieve: z.nieve_invierno!=null ? !!z.nieve_invierno : !!M.nieve,
      coche:coche, bases:bases, aeropuertos:aeropuertos, rutas:rutas, novedades:novedades,
      desde_espana:(z.llegar&&z.llegar.desde_espana)||(z.transporte_estimado&&z.transporte_estimado.vuelo_desde_espana?('Vuelo desde España: '+z.transporte_estimado.vuelo_desde_espana+'.'):''),
      desde_italia:(z.llegar&&z.llegar.desde_italia)||'',
      moverse:{resumen:mv.resumen||z.movilidad_recomendada||'', tren:tren, bus:bus, ferry:ferry, camper:camper},
      actividades:acts, recorridos:z.recorridos||[], sitios:z.sitios||[], comida:comida, noche:noche, alojamiento:aloj, eventos:eventos,
      cafes:z.sitios_gastronomicos_destacados||[], redes:z.redes||z.redes_sociales||[], pais:z.pais||'IT', costes:z.costes||null,
      notas:(Array.isArray(z.notas_honestas)?z.notas_honestas:(z.notas_honestas?[z.notas_honestas]:[])).map(String),
      inks:M.inks||['#141414','#FF3D2E','#2E5BFF'], bg:M.bg||'#FFFDF7', escena:M.escena||z.id, v2:!!(z.actividades&&z.actividades.length)
    };
  }

  /* ---------- 2. Agregar las respuestas del grupo ---------- */
  function frac(list, key){ var c={}, n=0; list.forEach(function(v){ if(v==null||v==='') return; n++; (Array.isArray(v)?v:[v]).forEach(function(x){ c[x]=(c[x]||0)+1; }); }); var o={}; Object.keys(c).forEach(function(k){ o[k]=n?c[k]/n:0; }); o.__n=n; o.__c=c; return o; }
  function mayoria(list){ var c={},best=null,bn=0; list.forEach(function(v){ if(v==null||v==='') return; c[v]=(c[v]||0)+1; if(c[v]>bn){bn=c[v];best=v;} }); return best; }

  var DIM2INT = {playa:'playa', naturaleza:'naturaleza', montana:'naturaleza', ciudad:'compras', cultura:'cultura', gastronomia:'gastronomia', fiesta:'fiesta', aventura:'aventura', postal:'postal'};
  function respV2(r){ // respuestas del cuestionario v2 → campos que usa el resto del motor
    var x = Object.assign({}, r);
    if(x.prioridades && x.prioridades.length && !(x.intereses && x.intereses.length)) x.intereses = x.prioridades.map(function(d){ return DIM2INT[d]; }).filter(Boolean).filter(function(v,i,a){ return a.indexOf(v)===i; });
    if(x.clima && !x.calor) x.calor = x.clima==='fresco' ? 'fresco' : (x.clima==='calor' ? 'playa' : null);
    if(x.duelo1 && !x.madrugar) x.madrugar = x.duelo1==='amanecer' ? 'si' : 'no';
    if(x.presMax && !x.presupuestoCifra) x.presupuestoCifra = x.presIdeal || x.presMax;
    if(x.prioridades && x.prioridades.length && !(x.paisaje && x.paisaje.length)){ var PA={playa:'mar', montana:'montana', ciudad:'ciudad', naturaleza:'campo'}; x.paisaje = x.prioridades.map(function(d){ return PA[d]; }).filter(Boolean); }
    if(x.duelo2 && !x.ciudad) x.ciudad = x.duelo2==='museo' ? 'museos' : 'mercados';
    return x;
  }
  function agregar(trip, resps){
    var R = resps.filter(function(r){ return r && r.done; }).map(respV2);
    var A = {n:R.length, resps:R};
    A.paisaje = frac(R.map(function(r){ return r.paisaje||[]; }));
    A.intereses = frac(R.map(function(r){ return r.intereses||[]; }));
    A.noche = frac(R.map(function(r){ return r.noche; }));
    A.nocheM = mayoria(R.map(function(r){ return r.noche; }));
    var ritmos = R.map(function(r){ return +r.ritmo||2; });
    A.ritmo = ritmos.length ? ritmos.reduce(function(a,b){return a+b;},0)/ritmos.length : 2;
    A.madrugar = mayoria(R.map(function(r){ return r.madrugar; })) || 'si';
    A.conductores = R.filter(function(r){ return r.coche==='conduzco'; }).length;
    A.carnets = R.filter(function(r){ return r.coche==='conduzco'||r.coche==='carnet'; }).length;
    A.dormir = frac(R.map(function(r){ return r.dormir; }));
    A.dormirM = mayoria(R.map(function(r){ return r.dormir; })) || 'piso';
    A.comida = frac(R.map(function(r){ return r.comida; }));
    A.comidaM = mayoria(R.map(function(r){ return r.comida; })) || 'trattoria';
    A.calor = frac(R.map(function(r){ return r.calor; }));
    A.nieve = frac(R.map(function(r){ return r.nieve; }));
    A.bases = frac(R.map(function(r){ return r.base; }));
    // presupuesto: el más ajustado manda (en un grupo, el que va justo marca el techo)
    var pres = Number(trip.presupuesto)||0;
    var factor = 1, tight = R.some(function(r){ return r.presupuesto==='justo'; }), estirar = R.length && R.every(function(r){ return r.presupuesto==='estirar'; });
    var cifras = R.map(function(r){ return +r.presupuestoCifra; }).filter(function(x){ return x>0; });
    if(cifras.length) pres = Math.min.apply(null, cifras); // lo que cada uno dijo en privado manda sobre la cifra orientativa de quien organiza
    if(tight) factor = 0.8; else if(estirar) factor = 1.2;
    A.presupuesto = pres ? Math.round(pres*factor) : 0;
    A.presTier = !A.presupuesto ? 'medio' : (A.presupuesto < 300 ? 'ajustado' : (A.presupuesto > 650 ? 'holgado' : 'medio'));
    if(tight && A.presTier==='holgado') A.presTier='medio';
    var ag = frac(R.map(function(r){ return r.agobio; })); A.agobio = ag;
    if((ag.madrugones||0)>=0.5) A.madrugar='no';
    if((ag.prisas||0)>=0.5) A.ritmo = Math.min(A.ritmo, 2);
    if((ag.gastar||0)>=0.5 && A.presTier==='holgado') A.presTier='medio'; else if((ag.gastar||0)>=0.5 && A.presTier==='medio' && A.presupuesto && A.presupuesto<400) A.presTier='ajustado';
    // fechas
    A.dias = diasViaje(trip, R);
    A.mes = mesViaje(trip, R);
    // likes de actividades
    A.likes = {}; A.supers = {};
    R.forEach(function(r){ (r.likes||[]).forEach(function(id){ (A.likes[id]=A.likes[id]||[]).push(r.nombre); }); (r.supers||[]).forEach(function(id){ (A.supers[id]=A.supers[id]||[]).push(r.nombre); }); });
    A.likesZ = {}; R.forEach(function(r){ var lz=r.likesZ||{}; Object.keys(lz).forEach(function(z){ A.likesZ[z]=(A.likesZ[z]||0)+(+lz[z]||0); }); });
    A.origenes = R.map(function(r){ return r.origen ? {nombre:r.nombre, ciudad:r.origen.ciudad, iata:r.origen.iata, pais:r.origen.pais} : null; }).filter(Boolean);
    A.textos = [trip.observaciones||''].concat(R.map(function(r){ return r.nota||''; })).join(' ');
    var t = norm(A.textos);
    A.sinAlcohol = /no beb|sin alcohol|abstemi|no toma alcohol/.test(t);
    A.dieta = {}; R.forEach(function(r){ (r.dieta||[]).forEach(function(x){ if(x!=='nada') (A.dieta[x]=A.dieta[x]||[]).push(r.nombre); }); });
    A.vegetariano = /vegetarian|vegan/.test(t) || !!A.dieta.vegetariano;
    if(A.dieta.sin_alcohol && A.dieta.sin_alcohol.length===R.length) A.sinAlcohol = true;
    A.sinCoche = /sin coche|no conduc|nadie conduce|sin carnet/.test(t);
    if(A.sinCoche) A.conductores = 0;
    A.tieneCoche = A.conductores>0;
    return A;
  }

  function diasEntre(a,b){ var d1=new Date(a+'T12:00:00'), d2=new Date(b+'T12:00:00'); if(isNaN(d1)||isNaN(d2)) return 0; return Math.round((d2-d1)/86400000)+1; }
  function diasViaje(trip, R){
    if(trip.fechas && trip.fechas.modo==='fijas' && trip.fechas.inicio && trip.fechas.fin){ var d=diasEntre(trip.fechas.inicio, trip.fechas.fin); if(d>0) return Math.min(d,14); }
    if(trip.dias) return Math.max(1,Math.min(+trip.dias,14));
    var ds = (R||[]).map(function(r){ return +r.dias; }).filter(function(x){ return x>0; });
    if(ds.length) return Math.min.apply(null, ds); // el que menos puede marca la duración
    return 4;
  }
  function mesViaje(trip, R){
    if(trip.fechas && trip.fechas.modo==='fijas' && trip.fechas.inicio) return new Date(trip.fechas.inicio+'T12:00:00').getMonth()+1;
    if(trip.fechas && trip.fechas.mes) return +trip.fechas.mes;
    var c={}; (R||[]).forEach(function(r){ (r.meses||[]).forEach(function(m){ c[m]=(c[m]||0)+1; }); });
    var best=0,bn=0; Object.keys(c).forEach(function(m){ if(c[m]>bn || (c[m]===bn && proximoMes(+m)<proximoMes(best))){ bn=c[m]; best=+m; } });
    return best||0;
  }
  function proximoMes(m){ if(!m) return 99; var now=new Date(); var cur=now.getMonth()+1; return (m-cur+12)%12; }
  function estacion(m){ if(!m) return ''; if(m===12||m<=2) return 'invierno'; if(m>=6&&m<=9) return 'verano'; return 'templado'; }

  /* ---------- 3. Elegir destino ---------- */
  var ETQ_PAISAJE = {mar:'mar', montana:'montaña', ciudad:'ciudad', campo:'campo y pueblos'};
  var ETQ_INT = {cultura:'historia', gastronomia:'comer bien', naturaleza:'naturaleza', playa:'playa', aventura:'adrenalina', postal:'sitios de postal', compras:'mercados', agua:'planes de agua', fiesta:'ambiente'};
  function puntuarZona(Z, A, trip){
    var p=Z.perfil||{}, s=0, why=[];
    function add(v, txt){ s+=v; if(txt && v>0.6) why.push({v:v, t:txt}); }
    Object.keys(ETQ_PAISAJE).forEach(function(k){ var f=A.paisaje[k]||0; if(f) add(f*(p[k]||0)*2.2, f>=0.5 ? (A.paisaje.__c[k]+' de '+A.paisaje.__n+' queríais '+ETQ_PAISAJE[k]) : null); });
    Object.keys(ETQ_INT).forEach(function(k){ var f=A.intereses[k]||0; var pv = k==='compras'?(p.cultura||0)*0.5 : (k==='agua'?Math.max(p.mar||0,(p.playa||0)):(p[k]||0)); if(f) add(f*pv*1.1, f>=0.5 && pv>=3 ? ('Fuerte en '+ETQ_INT[k]) : null); });
    if(A.noche.fiesta) add(A.noche.fiesta*(p.fiesta||0)*1.2, A.noche.fiesta>=0.5 && p.fiesta>=3 ? 'Hay ambiente de noche' : null);
    if(A.noche.calma) add(A.noche.calma*(p.calma||0)*1.0, null);
    var m=A.mes, est=estacion(m);
    if(m && Z.meses){ if((Z.meses.ideales||[]).indexOf(m)>-1) add(3, MESES_LARGO[m-1].charAt(0).toUpperCase()+MESES_LARGO[m-1].slice(1)+' es de sus mejores meses'); else if((Z.meses.aceptables||[]).indexOf(m)>-1) add(1,null); else if((Z.meses.evitar||[]).indexOf(m)>-1) add(-4,null); }
    if(est==='verano'){ var fresco=A.calor.fresco||0, playa=A.calor.playa||0; if(fresco) add(-fresco*(Z.calor==='extremo'?2.5:(Z.calor==='alto'?1.2:-1)), Z.calor==='suave'&&fresco>=0.5?'Más fresquito en verano':null); if(playa) add(playa*(p.playa||0)*0.6, null); }
    if(est==='invierno'){ var ns=A.nieve.si||0, nn=A.nieve.no||0; if(ns) add(ns*(Z.nieve?3:-0.5), Z.nieve&&ns>=0.5?'Nieve de verdad en invierno':null); if(nn) add(nn*((p.ciudad||0)*0.8 - (Z.nieve?1.5:0)), null); }
    if(A.presTier==='ajustado'){ if(Z.precio==='alto') add(-2.2,null); if(Z.precio==='bajo') add(1.3,'Barato para lo que ofrece'); }
    if(A.presTier==='holgado' && Z.precio==='alto') add(0.4,null);
    if(!A.tieneCoche){ if(Z.coche.necesidad==='imprescindible') add(-4.5,null); else if(Z.coche.necesidad==='util') add(-0.8,null); else add(0.8, A.n?'Se mueve bien sin coche':null); }
    else if(Z.coche.necesidad!=='innecesario') add(0.4,null);
    // lo que le encaja a cada uno de lo que hay allí de verdad (en temporada y alcanzable con o sin coche)
    if(A.resps && A.resps.length && Z.actividades && Z.actividades.length){
      var acts = Z.actividades.filter(function(a){ return enTemporada(a, A) && !(a.coche && !A.tieneCoche); });
      var porPersona = A.resps.map(function(r){ var es=acts.map(function(a){ return encaje(a,r).s; }).sort(function(x,y){ return y-x; }).slice(0,4); return es.length ? es.reduce(function(x,y){return x+y;},0)/4 : 0; });
      var media = porPersona.reduce(function(x,y){return x+y;},0)/porPersona.length, peor = Math.min.apply(null, porPersona);
      add(media*0.55 + peor*0.35, media>=4.5 ? 'Tiene planes para cada uno' : null);
      if(acts.length < (A.dias||4)*1.6) add(-2, null);
    }
    if(A.likesZ && A.likesZ[Z.id]) add(Math.min(A.likesZ[Z.id],8)*0.5, A.likesZ[Z.id]>=2 ? 'Os gustaron sus planes al deslizar' : null);
    // conexiones directas desde los orígenes del grupo
    var es = A.origenes.filter(function(o){ return o.pais==='es'; });
    if(es.length && Z.rutas && Z.rutas.length){ var conR = es.filter(function(o){ return Z.rutas.some(function(r){ return r.origen_iata===o.iata; }); }); if(conR.length) add(1.2*conR.length/es.length, 'Vuelo directo desde '+uniq(conR.map(function(o){return o.ciudad;})).join(' y ')); }
    var it = A.origenes.filter(function(o){ return o.pais==='it'; });
    if(it.length && (Z.id==='sicilia'||Z.id==='cerdena')) add(-0.6*it.length/Math.max(1,A.origenes.length), null);
    if(A.dias<=3 && (Z.id==='sicilia'||Z.id==='cerdena'||Z.id==='calabria')) add(-1.5,null);
    if(A.dias>=7 && (Z.id==='molise'||Z.id==='lombardia-milan'||Z.id==='friuli-venezia-giulia')) add(-1,null);
    // texto libre que nombra la zona o sus sitios
    var t = norm(A.textos);
    if(t.trim()){ var claves=[norm(Z.corto), norm(Z.nombre.split('(')[0])].concat(Z.bases.map(function(b){ return norm(b.nombre); })).filter(function(k){ return k.trim().length>=4; }); var hit=claves.filter(function(k){ return t.indexOf(k.trim())>-1; }); if(hit.length) add(4,'Lo pedisteis por escrito'); }
    why.sort(function(a,b){ return b.v-a.v; });
    return {id:Z.id, score:s, por_que:uniq(why.map(function(w){ return w.t; })).slice(0,3)};
  }
  function elegirDestino(ZS, A, trip){
    var cand = ZS;
    var fijados = (trip.destinos||[]).filter(function(id){ return ZS.some(function(z){ return z.id===id; }); });
    if(fijados.length===1){ var Z = ZS.filter(function(z){ return z.id===fijados[0]; })[0]; var r=puntuarZona(Z,A,trip); r.por_que = ['Lo decidió el grupo al crear el viaje']; return {elegido:r, ranking:[r], fijo:true}; }
    if(fijados.length>1) cand = ZS.filter(function(z){ return fijados.indexOf(z.id)>-1; });
    var rk = cand.map(function(Z){ return puntuarZona(Z,A,trip); }).sort(function(a,b){ return b.score-a.score || (a.id<b.id?-1:1); });
    return {elegido:rk[0], ranking:rk.slice(0,4), fijo:false};
  }

  /* ---------- 3b. Lo que le va a cada uno ---------- */
  function txt(a){ return norm(a.nombre+' '+(a.descripcion||'')+' '+(a.donde||'')); }
  var KW = {
    cala:/\bcala|reserva natural|escondid|sendero|virgen|salvaje|grotta|gruta|scogli|acantilad/, lido:/\blido|stabiliment|hamaca|sombrilla|servicios|paseo maritimo|lungomare|playa urbana|arena fina/,
    barco:/barco|ferry|kayak|velero|lancha|catamaran|snorkel|isla|isola|barca|traghett/,
    museo:/museo|galeri|galler|capilla|basilica|catedral|duomo|palacio|palazzo|teatro|pinacoteca|frescos|mosaic/, barrio:/barrio|callej|quartier|rione|casco|paseo|plaza|piazza|centro historico|vicoli|sassi|borgo/, mercado:/mercad|mercat|street food|puestos|fritos|bottega/,
    esqui:/esqui|\bski|pista|remontes|superski/, raquetas:/raqueta|ciaspol|invernal/, trineo:/trineo|slitt|rodel/, relax:/terme|termas|spa|bienestar|aguas termales|banos/,
    atardecer:/atardecer|tramonto|mirador|belvedere|puesta de sol|vistas|panoram/, cumbre:/cima|cumbre|cresta|ferrata|ruta|sendero|trekking|subir|ascenso|crater|pico/,
    ruinas:/ruina|romano|romana|griego|templo|anfiteatro|yacimiento|necropolis|excavac|pompeya|foro/,
    vino:/vino|cata|bodega|cantina|enoteca|cerveza|spritz|chianti|prosecco|grappa/
  };
  function k(re, a){ return re.test(txt(a)); }
  // Devuelve {s, why}: cuánto le encaja un plan a una persona y por qué (en corto, para escribirlo en el plan)
  function encaje(a, r){
    var s=0, why=null, best=0; function add(v, w){ s+=v; if(w && v>best){ best=v; why=w; } }
    if((Array.isArray(r.pasos)?r.pasos:[]).some(function(id){ return typeof id==='string' && id.split('/')[1]===a.id; })) add(-5,null);
    if((r.supers||[]).indexOf(a.id)>-1) add(8,'lo marcó como imprescindible');
    else if((r.likes||[]).indexOf(a.id)>-1) add(3,'le gustó al deslizar');
    var ints=r.intereses||[]; if(ints.indexOf(a.tipo)>-1) add(2.6,'le tira '+(ETQ_INT[a.tipo]||a.tipo)); (a.tipos||[]).forEach(function(t){ if(ints.indexOf(t)>-1) add(1.1,'le tira '+(ETQ_INT[t]||t)); });
    var pai=r.paisaje||[];
    if(pai.indexOf('mar')>-1 && (a.tipo==='playa'||a.tipo==='agua')) add(2,'quería mar');
    if(pai.indexOf('montana')>-1 && (a.tipo==='naturaleza'||a.tipo==='aventura')) add(1.8,'quería montaña');
    if(pai.indexOf('ciudad')>-1 && (a.tipo==='cultura'||a.tipo==='postal'||a.tipo==='gastronomia') && !a.coche) add(1,'quería ciudad');
    if(pai.indexOf('campo')>-1 && (a.tipo==='naturaleza'||a.tipo==='gastronomia') ) add(1,'quería campo');
    var m=r.momento;
    if(m==='atardecer' && (a.tipo==='postal'||k(KW.atardecer,a))) add(2.4,'su momento: el atardecer');
    if(m==='cena' && a.tipo==='gastronomia') add(2.2,'su momento: comer bien');
    if(m==='fiesta' && (a.tipo==='fiesta'||a.tipo==='musica')) add(2.4,'su momento: la fiesta');
    if(m==='cumbre' && (a.tipo==='naturaleza'||a.tipo==='aventura') && k(KW.cumbre,a)) add(2.6,'su momento: llegar arriba');
    if(m==='agua' && (a.tipo==='playa'||a.tipo==='agua')) add(2.4,'su momento: el agua');
    if(m==='ruinas' && (a.tipo==='cultura') ) add(k(KW.ruinas,a)?2.8:1.4,'su momento: historia de verdad');
    if(r.andar==='poco' && a.esfuerzo==='alto') add(-4,null); else if(r.andar==='mucho' && a.esfuerzo==='alto') add(1.4,'quería caminar'); else if(r.andar==='poco' && a.esfuerzo==='bajo') add(0.4,null);
    if(a.tipo==='playa'||a.tipo==='agua'){ if(r.playa==='cala' && k(KW.cala,a)) add(2.2,'prefiere calas'); if(r.playa==='lido' && k(KW.lido,a)) add(2.2,'prefiere playa cómoda'); if(r.playa==='barco' && k(KW.barco,a)) add(2.4,'quería barco'); }
    if(r.ciudad==='museos' && a.tipo==='cultura' && k(KW.museo,a)) add(2,'va de museos');
    if(r.ciudad==='barrios' && (a.tipo==='postal'||k(KW.barrio,a))) add(2,'le va callejear');
    if(r.ciudad==='mercados' && (a.tipo==='gastronomia'||a.tipo==='compras'||k(KW.mercado,a))) add(2,'le van los mercados');
    if(r.nieveAct==='esqui' && k(KW.esqui,a)) add(3.2,'quería esquiar'); if(r.nieveAct==='raquetas' && k(KW.raquetas,a)) add(3,'quería raquetas'); if(r.nieveAct==='trineo' && k(KW.trineo,a)) add(3,'quería trineo'); if(r.nieveAct==='relax' && (k(KW.relax,a)||a.tipo==='bienestar')) add(3,'quería relax y calor');
    var c=COSTE_N[a.coste] == null ? 1 : COSTE_N[a.coste];
    if(r.capricho==='barco' && k(KW.barco,a)) add(3.2,'su capricho: el barco'); if(r.capricho==='experiencia' && a.reserva && c>=2) add(2.6,'su capricho: algo especial'); if(r.capricho==='nada' && c>=3) add(-1.5,null);
    if(r.agobio==='coche' && a.coche) add(-1.4,null); if(r.agobio==='prisas' && a.duracion==='dia_completo' && a.esfuerzo==='alto') add(-1,null); if(r.agobio==='madrugones' && a.momento==='manana' && a.duracion!=='2h' && a.duracion!=='1h') add(-0.4,null); if(r.agobio==='turistadas' && a.reserva && c>=2 && a.tipo==='cultura') add(-0.8,null); if(r.agobio==='gastar' && c>=2) add(-0.8,null);
    if(r.noche==='fiesta' && a.tipo==='fiesta') add(1.6,'quería salir'); if(r.noche==='calma' && a.tipo==='fiesta') add(-2,null);
    var d=r.dieta||[]; if(d.indexOf('sin_alcohol')>-1 && k(KW.vino,a)) add(-5,null);
    return {s:s, why:why};
  }
  function fans(a, A){ var out=[]; (A.resps||[]).forEach(function(r){ var e=encaje(a,r); if(e.s>=2.6) out.push({n:r.nombre, s:e.s, why:e.why}); }); out.sort(function(x,y){ return y.s-x.s; }); return out; }

  /* ---------- 4. Construir el itinerario ---------- */
  var COSTE_N = {gratis:0, bajo:1, medio:2, alto:3};
  var NO_VEG = /carne|cerdo|ternera|cordero|salchich|speck|embutid|jamon|salami|porchetta|norcin|cinghial|jabali|lardo|lard |pancetta|guanciale|bresaola|coppa|nduja|ventricina|tripa|trippa|lampredotto|bistec|bistecca|ragu|carbonara|amatriciana|arrosticin|meusa|boudin|carbonade|mortadel|prosciutto|crudo|pollo|conejo|pato|higado|pescad|marisc|atun|anchoa|sardin|bacalao|baccala|stoccafisso|pulpo|polpo|vongol|cozze|mejillon|gamba|gamber|calamar|sepia|pez espada|brodetto|frutti di mare|crudo di mare|caviar|bottarga|erizo/;
  var CON_PESCADO = /pescad|marisc|atun|anchoa|sardin|bacalao|baccala|stoccafisso|pulpo|polpo|vongol|cozze|mejillon|gamba|gamber|calamar|sepia|pez espada|brodetto|frutti di mare|crudo di mare|bottarga|erizo|cuscus de pescado/;
  var CON_GLUTEN = /pasta|pizza|\bpan\b|harina de trigo|focacc|rebozad|empanad|panzerott|strudel|tarta|bizcoch|canederli|gnocchi|pici|orecchiette|croissant|brioche|panzanella/;
  function puntuarAct(a, A, ctx){
    if(a.coche && !A.tieneCoche) return -99;
    if(a.meses && a.meses.length && ctx.mes && a.meses.indexOf(ctx.mes)===-1) return -99;
    var s = 1;
    var L=(A.likes[a.id]||[]).length, S=(A.supers[a.id]||[]).length;
    s += L*3 + S*6;
    if(A.resps && A.resps.length){ var es=A.resps.map(function(r){ return encaje(a,r).s; }); var mean=es.reduce(function(x,y){return x+y;},0)/es.length; s += mean*0.9 + Math.max.apply(null,es)*0.35; if(es.some(function(v){ return v<=-3.5; })) s -= 1.5; }
    if(ctx.anclas && ctx.anclas[a.id]) s += 7;
    if(a.icono) s += 2.2; // lo imprescindible de la zona la primera vez
    s += (A.intereses[a.tipo]||0)*3;
    (a.tipos||[]).forEach(function(t){ s += (A.intereses[t]||0)*1.4; });
    if(a.tipo==='playa' && (A.paisaje.mar||0)) s += A.paisaje.mar*1.5;
    if(a.tipo==='naturaleza' && (A.paisaje.montana||0)) s += A.paisaje.montana*1.2;
    if(a.tipo==='cultura' && (A.paisaje.ciudad||0)) s += A.paisaje.ciudad*0.8;
    if(a.tipo==='fiesta') s += (A.noche.fiesta||0)*2 - (A.noche.calma||0)*1.5;
    var c=COSTE_N[a.coste] == null ? 1 : COSTE_N[a.coste];
    if(A.presTier==='ajustado') s += c===0?1.2:(c===3?-3:(c===2?-0.6:0.4));
    if(A.presTier==='holgado' && c>=2) s += 0.4;
    if(a.esfuerzo==='alto') s += A.ritmo>=2.5 ? 0.6 : (A.ritmo<1.6?-1.8:-0.4);
    if(a.ambiente==='social') s += (A.noche.fiesta||0)*0.6;
    if(a.ambiente==='tranquilo') s += (A.noche.calma||0)*0.5;
    if(ctx.base && a.base===ctx.base) s += 0.8; else if(ctx.base && !A.tieneCoche && a.duracion!=='dia_completo') s -= 0.6;
    if(ctx.textos && ctx.textos.length>3){ var nn=norm(a.nombre).split(/\s+/).filter(function(w){ return w.length>=5; }); if(nn.some(function(w){ return ctx.textos.indexOf(w)>-1; })) s += 4; }
    if(A.sinAlcohol && /vino|cata|cerveza|bodega|spritz|enoteca|aperitivo/i.test(a.nombre)) s -= 2.5;
    return s;
  }

  function porQueAct(a, A, dueno){
    var S=A.supers[a.id]||[];
    var pistas=[];
    if(a.coste==='gratis' && A.presTier==='ajustado') pistas.push('entrada gratuita');
    if(a.esfuerzo==='alto' && A.ritmo>=2.5) pistas.push('actividad intensa para vuestro ritmo');
    function detalle(frase){return frase+(pistas.length?' · '+pistas.join(' y '):'');}
    if(dueno) { var e=encaje(a, (A.resps||[]).filter(function(r){ return r.nombre===dueno; })[0]||{}); return detalle('El plan de '+dueno+(e.why?': '+e.why:'')); }
    if(S.length) return S.join(' y ')+' lo marc'+(S.length>1?'aron':'ó')+' como imprescindible';
    var F=fans(a, A);
    if(A.n>1 && F.length && F.length===A.n) return 'Os encaja a todos'+(F[0].why?' · '+F[0].why.replace(/^su momento: /,''):'');
    if(F.length>=2) return 'Para '+joinY(F.slice(0,3).map(function(f){ return f.n; }))+(F.length>3?' y más':'')+(F[0].why?' · '+F[0].why.replace(/^(le |su momento: )/,'').replace(/^tira /,''):'');
    if(F.length===1) return 'Para '+F[0].n+(F[0].why?': '+F[0].why:'');
    if((A.intereses[a.tipo]||0)>0) return 'Encaja con vuestro interés por '+(ETQ_INT[a.tipo]||a.tipo);
    if(a.coste==='gratis') return 'Esta actividad tiene entrada gratuita';
    if(a.icono) return 'Es una de las visitas destacadas del destino';
    return '';
  }
  function plan_coche(Z){ return Z.coche && Z.coche.necesidad!=='innecesario'; }
  function joinY(l){ if(l.length<2) return l[0]||''; var u=l[l.length-1], c=norm(u); return l.slice(0,-1).join(', ')+(/^(i|hi)(?![aeou])/.test(c)?' e ':' y ')+u; }

  function enTemporada(a, A){ return !(a.meses && a.meses.length && A.mes && a.meses.indexOf(A.mes)===-1); }
  function elegirBase(Z, A){
    if(Z.bases.length===1) return Z.bases[0];
    var votos = A.bases.__c || {};
    var best=null, bs=-1e9;
    Z.bases.forEach(function(b,i){
      var s = (votos[b.id]||0)*3 - i*0.3;
      if(!A.tieneCoche && !b.sin_coche) s -= 4;
      if(b.ambiente==='fiesta') s += (A.noche.fiesta||0)*1.5 - (A.noche.calma||0);
      if(b.ambiente==='calma') s += (A.noche.calma||0)*1.2 - (A.noche.fiesta||0)*0.5;
      var nAct = Z.actividades.filter(function(a){ return !(a.coche && !A.tieneCoche) && enTemporada(a, A) && alcanzable(a, b.id, A); }).length; s += nAct*0.45; if(nAct < (A.dias||4)) s -= 3;
      if(s>bs){ bs=s; best=b; }
    });
    return best;
  }

  function fechaDia(trip, i){
    if(!(trip.fechas && trip.fechas.modo==='fijas' && trip.fechas.inicio)) return '';
    var d=new Date(trip.fechas.inicio+'T12:00:00'); d.setDate(d.getDate()+i);
    return DIAS_SEMANA[d.getDay()]+' '+d.getDate()+' '+MESES_CORTO[d.getMonth()];
  }
  function iso(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }

  var ANCLA = {}; // id de actividad -> nombre de quien la "trae" al viaje (se rellena en construirPlan)
  function slotAct(a, A, momento){ var d=ANCLA[a.id]||null; var sl={k:'act', momento:momento, ref:a.id, nombre:a.nombre, por_que:porQueAct(a,A,d)}; if(d) sl.de=d; return sl; }

  function geo(id){ return (typeof GEO!=='undefined' && GEO[id]) || null; }
  function km(p, q2){ if(!p||!q2) return null; var R=6371, t=Math.PI/180, dl=(q2[0]-p[0])*t, dn=(q2[1]-p[1])*t; var x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(p[0]*t)*Math.cos(q2[0]*t)*Math.sin(dn/2)*Math.sin(dn/2); return 2*R*Math.asin(Math.sqrt(x)); }
  function distBase(a, b){ if(a===b) return 0; var d=km(geo(a), geo(b)); return d==null ? 999 : d; }
  /* distancia real de un plan (actividad o zona de noche) a la base: usa sus coordenadas si las tiene */
  function geoOk(g){ return (g && g.length===2 && isFinite(g[0]) && isFinite(g[1])) ? [+g[0], +g[1]] : null; }
  function distItem(it, baseId){ if(it && it.geo){ var d=km(it.geo, geo(baseId)); if(d!=null) return d; } return distBase(it.base, baseId); }
  /* ¿Se puede hacer esta actividad durmiendo en "base"? Cerca: cualquier formato. Lejos: solo como excursión de día entero. */
  function alcanzable(act, baseId, A){
    var d = distItem(act, baseId);
    if(d>8 && act.duracion!=='dia_completo' && /\b(procida|ischia|capri|egadi|eolie|tremiti|maddalena|elba|giglio|ponza|favignana|lipari|stromboli|vulcano|asinara|levanzo|marettimo)\b/.test(norm(act.nombre+' '+(act.donde||'')))) return false;
    if(d<=22) return true;
    if(act.duracion==='medio_dia' && d<=(A.tieneCoche?50:40)) return true;
    if((act.duracion==='2h'||act.duracion==='1h') && A.tieneCoche && d<=30) return true;
    if(act.duracion!=='dia_completo') return false;
    return d <= (A.tieneCoche ? 160 : 150);
  }
  function aeropuertoPara(Z, baseId, A){
    var g=geo(baseId), best=null, bd=1e9;
    var es = (A&&A.origenes||[]).filter(function(o){ return o.pais==='es' && o.iata; });
    Z.aeropuertos.forEach(function(a,i){ var d=km(g, geo(a.iata)); if(d==null) d=500+i;
      var directos = es.filter(function(o){ return (Z.rutas||[]).some(function(r){ return r.origen_iata===o.iata && r.destino_iata===a.iata; }); }).length;
      var coste = d - (es.length ? 120*directos/es.length : 0); if(coste<bd){ bd=coste; best=a; } });
    return best || Z.aeropuertos[0] || null;
  }
  function basesDelViaje(Z, A, N, forzada){
    var b1 = forzada ? (Z.bases.filter(function(b){ return b.id===forzada; })[0]||elegirBase(Z,A)) : elegirBase(Z, A);
    if(N<6 || Z.bases.length<2) return [b1];
    var best=null, bs=-1e9;
    Z.bases.forEach(function(b){ if(b.id===b1.id) return; if(!A.tieneCoche && !b.sin_coche) return; var d=distBase(b.id, b1.id); if(d<25) return;
      var n = Z.actividades.filter(function(a){ return !(a.coche && !A.tieneCoche) && enTemporada(a, A) && alcanzable(a, b.id, A) && !alcanzable(a, b1.id, A); }).length; var s = n - (d>260?4:0) + ((A.bases.__c||{})[b.id]||0)*2; if(s>bs){ bs=s; best=b; } });
    return best && bs>=3 ? [b1, best] : [b1];
  }

  /* ---------- 4b. Lugares: las actividades agrupadas por cercanía (un día = un sitio) ---------- */
  var HORAS = {'1h':1, '2h':2, medio_dia:3.5, dia_completo:7};
  var ISLA = /\b(procida|ischia|capri|anacapri|egadi|eolie|tremiti|maddalena|elba|giglio|ponza|favignana|lipari|stromboli|vulcano|asinara|levanzo|marettimo)\b/;
  function pt(a){ return a.geo || geo(a.base) || null; }
  function centro(acts){ var la=0, lo=0, n=0; acts.forEach(function(a){ var g=pt(a); if(g){ la+=g[0]; lo+=g[1]; n++; } }); return n ? [la/n, lo/n] : null; }
  function nombreBase(b){ return String(b.nombre||'').split('(')[0].trim(); }
  function lugaresDe(Z, acts){
    var cl=[];
    acts.forEach(function(a){
      var g=pt(a), hit = g ? cl.filter(function(k){ return k.some(function(b){ var h=pt(b); return h && km(g,h)<=6; }); }) : [];
      if(!hit.length){ cl.push([a]); return; }
      hit[0].push(a); hit.slice(1).forEach(function(h){ h.forEach(function(x){ hit[0].push(x); }); cl.splice(cl.indexOf(h),1); });
    });
    return cl.map(function(k, i){
      var c=centro(k), nb = Z.bases.filter(function(b){ var g=geo(b.id); return g && c && km(g,c)<=4; })[0];
      var n={}; k.forEach(function(a){ var x=String(a.donde||'').split(/[,(\/]/)[0].trim(); if(x) n[x]=(n[x]||0)+1; });
      var nombre = Object.keys(n).sort(function(x,y){ return n[y]-n[x] || x.length-y.length; })[0] || (nb ? nombreBase(nb) : corto(k[0].nombre));
      return {id:'L'+i, nombre:nombre, acts:k, c:c, isla: ISLA.test(norm(nombre+' '+k.map(function(a){ return a.donde||''; }).join(' ')))};
    });
  }
  /* ¿Se puede ir a ese sitio durmiendo en esa base? Devuelve los km (línea recta) o null.
     Cerca: siempre. Hasta 45 km: si da para media jornada. Hasta 110 km (o isla con ferry): solo si llena el día. */
  function alcanceLugar(L, baseId, horas, tieneDia){
    var g=geo(baseId); if(!g || !L.c) return L.acts.some(function(a){ return a.base===baseId; }) ? 0 : null;
    var d=km(g, L.c), lleno = tieneDia || horas>=5;
    if(L.isla && d>8) return (lleno && d<=60) ? d : null;
    if(d<=12) return d;
    if(d<=45) return horas>=3 ? d : null;
    return (lleno && d<=110) ? d : null;
  }
  function dirPts(o, d, modo){ return 'https://www.google.com/maps/dir/?api=1&origin='+q(typeof o==='string'?o:o[0]+','+o[1])+'&destination='+q(typeof d==='string'?d:d[0]+','+d[1])+'&travelmode='+(modo||'transit'); }

  function construirPlan(Z, A, trip, opts){
    opts = opts||{};
    var N = Math.max(1, A.dias||1);
    var ctx = {mes:A.mes, textos:norm(A.textos)};
    var usable = Z.actividades.filter(function(a){ return !(a.coche && !A.tieneCoche) && enTemporada(a, A); });
    var candBases = Z.bases.filter(function(b){ return A.tieneCoche || b.sin_coche; }); if(!candBases.length) candBases = Z.bases.slice();
    // cada uno trae «su plan»: lo que mejor le encaja a esa persona y no ha cogido otro
    ANCLA = {}; var anclas = {};
    (A.resps||[]).slice().sort(function(x,y){ return (x.nombre<y.nombre?-1:1); }).forEach(function(r){
      var best=null, bs=3;
      usable.forEach(function(a){ if(anclas[a.id]) return; var e=encaje(a,r).s - (a.momento==='noche'?1:0); if(e>bs){ bs=e; best=a; } });
      if(best) anclas[best.id]=r.nombre;
    });
    if((A.resps||[]).length>1) ANCLA = anclas;
    ctx.anclas = ANCLA;
    var SC = {}; usable.forEach(function(a){ SC[a.id] = puntuarAct(a, A, ctx); });
    var esNoche = function(a){ return a.momento==='noche' || a.tipo==='fiesta'; };
    var deDia = usable.filter(function(a){ return !esNoche(a) && SC[a.id]>-50; });
    var deNoche = usable.filter(function(a){ return esNoche(a) && SC[a.id]>-50; });
    var LUG = lugaresDe(Z, deDia);
    var ritmo = Math.min(3, Math.max(1, A.ritmo||2)), madruga = A.madrugar!=='no';
    var HDIA = 4.5 + (ritmo-1)*2.25;                 // horas de planes en un día normal: 4,5 · 6,75 · 9
    var MAXA = ritmo<1.5 ? 2 : (ritmo<2.5 ? 3 : 4);  // planes por día
    var CAPM = madruga ? 4 : 3.5;                    // lo que cabe antes de comer
    function porSc(x,y){ return SC[y.id]-SC[x.id] || (x.id<y.id?-1:1); }
    // «mejor por la mañana / por la tarde» es una preferencia para museos, iglesias, playas o termas; para mercados, rutas, barcos y atardeceres es obligatorio
    var FLEX = {};
    usable.forEach(function(a){ var t=txt(a); FLEX[a.id] = (a.tipo==='cultura' || a.tipo==='playa' || a.tipo==='bienestar' || a.tipo==='compras') && !KW.mercado.test(t) && !/atardecer|tramonto|puesta de sol|amanecer/.test(t); });
    function vaDeManana(a){ return a.momento!=='tarde' || FLEX[a.id]; }
    function vaDeTarde(a){ return a.momento!=='manana' || FLEX[a.id]; }

    /* Elige los planes de un día en un sitio. modo: normal · tarde (llegada/traslado) · manana (último día) */
    function armar(L, usados, modo, horas, maxA, tipos){
      var cands = L.acts.filter(function(a){ return !usados[a.id]; });
      var llegada = modo==='llegada'; if(llegada) modo='tarde';
      if(modo==='tarde') cands = cands.filter(function(a){ return a.duracion!=='dia_completo' && vaDeTarde(a) && a.esfuerzo!=='alto' && !(llegada && (a.reserva || (a.duracion==='medio_dia' && ritmo<2.5))); });
      if(modo==='manana') cands = cands.filter(function(a){ return a.duracion!=='dia_completo' && vaDeManana(a) && a.esfuerzo!=='alto' && !a.reserva && !/merienda|atardecer/i.test(a.nombre); });
      if(!cands.length || maxA<1) return null;
      function val(a, enDia){ var rep=0, cerca=0; enDia.forEach(function(x){ if(x.a.tipo===a.tipo) rep++; var g1=pt(a), g2=pt(x.a); if(g1&&g2) cerca=Math.max(cerca, km(g1,g2)); });
        return SC[a.id] - rep*1.5 - (tipos[a.tipo]||0)*0.5 - Math.min(4, cerca*0.4) - (modo==='tarde' && a.reserva ? 2 : 0); }
      var optA = null;
      if(modo==='normal'){ var comp = cands.filter(function(a){ return a.duracion==='dia_completo'; }).sort(porSc)[0]; if(comp) optA = {acts:[{a:comp, b:'dia'}], valor: val(comp, [])*2.2 + 1, horas:7}; }
      var cortos = cands.filter(function(a){ return a.duracion!=='dia_completo'; });
      var capM = modo==='tarde' ? 0 : (modo==='manana' ? 3.5 : CAPM), hM=0, hT=0, sel=[], valor=0;
      while(sel.length<maxA){
        var best=null, bv=0, bb=null;
        cortos.forEach(function(a){
          if(sel.some(function(x){ return x.a===a; })) return;
          var h=HORAS[a.duracion]||2;
          var enM = vaDeManana(a) && hM+h<=capM+0.01 && hM+hT+h<=horas+0.5;
          var enT = modo!=='manana' && vaDeTarde(a) && hT+h<=Math.min(4, horas-hM+0.5)+0.01;
          if(!enM && !enT) return;
          var b1 = a.momento==='tarde' ? (enT?'tarde':'manana') : (a.momento==='manana' ? (enM?'manana':'tarde') : ((enM && (hM===0 || !enT)) ? 'manana' : 'tarde'));
          var v=val(a, sel) - ((a.momento==='manana' && b1==='tarde') || (a.momento==='tarde' && b1==='manana') ? 1.2 : 0);
          if(v>bv){ bv=v; best=a; bb=b1; }
        });
        if(!best) break;
        sel.push({a:best, b:bb}); valor+=bv; if(bb==='manana') hM+=HORAS[best.duracion]||2; else hT+=HORAS[best.duracion]||2;
      }
      var optB = sel.length ? {acts:sel, valor:valor, horas:hM+hT, hT:hT} : null;
      if(!optB) return optA; if(!optA) return optB;
      return optA.valor > optB.valor ? optA : optB;
    }
    function horasLibres(L, usados){ var h=0; L.acts.forEach(function(a){ if(!usados[a.id]) h+=HORAS[a.duracion]||2; }); return h; }
    function diaNormal(b, usados, horas, tipos, visitas){
      var best=null, gb=geo(b.id);
      LUG.forEach(function(L){
        var hl=horasLibres(L, usados); if(!hl) return;
        var d = alcanceLugar(L, b.id, hl, L.acts.some(function(a){ return !usados[a.id] && a.duracion==='dia_completo'; })); if(d==null) return;
        var hEf = horas - (d>60 ? 2 : (d>30 ? 1 : 0)); // una excursión lejana deja menos horas para planes
        var r = armar(L, usados, 'normal', Math.max(3.5, hEf), MAXA, tipos); if(!r) return;
        var acts=r.acts.slice(), valor=r.valor, hh=r.horas, otros=[], hTar=r.hT||0;
        // si sobra tiempo: lo que queda al lado, o algo en la base a la vuelta
        if(acts[0].b!=='dia' && hEf-hh>=2 && acts.length<MAXA){
          var u2={}; Object.keys(usados).forEach(function(k){ u2[k]=usados[k]; }); acts.forEach(function(x){ u2[x.a.id]=1; });
          LUG.filter(function(M){ return M!==L && M.c && L.c && !M.isla && (km(M.c, L.c)<=15 || (gb && km(M.c, gb)<=6 && d<=25)); })
            .sort(function(x,y){ return km(x.c,L.c)-km(y.c,L.c); }).forEach(function(M){
              var cabe = Math.min(hEf-hh, 4-hTar); if(cabe<2 || acts.length>=MAXA) return;
              var r2 = armar(M, u2, 'tarde', cabe, MAXA-acts.length, tipos); if(!r2) return;
              r2.acts.forEach(function(x){ u2[x.a.id]=1; acts.push({a:x.a, b:'tarde', L:M}); }); valor+=r2.valor*0.9; hh+=r2.horas; hTar+=r2.horas; otros.push(M);
            });
        }
        if(d>12 && hh<3) return; // no merece el viaje
        if(d>45 && hh<5 && acts[0].b!=='dia') return;
        valor = valor - d/12 - (visitas[L.id]||0)*1.5;
        if(!best || valor>best.valor) best={L:L, d:d, acts:acts, valor:valor, horas:hh, otros:otros};
      });
      return best;
    }
    function medioDia(b, usados, modo, tipos, traslado){ // solo cerca de la base
      var best=null, gb=geo(b.id);
      var horas = modo==='manana' ? 3.5 : (ritmo<1.5 ? 2 : (ritmo<2.5 ? 3.5 : 4)), maxA = (modo!=='manana' && (ritmo>=2.5 || (traslado && ritmo>=1.5))) ? 2 : 1;
      if(traslado && ritmo>=1.5) horas = 4;
      LUG.forEach(function(L){
        var d = (gb && L.c) ? km(gb, L.c) : (L.acts.some(function(a){ return a.base===b.id; }) ? 0 : 99); if(d>10 || (L.isla && d>8)) return;
        var r = armar(L, usados, modo, horas, maxA, tipos); if(!r) return;
        var v = r.valor - d/5; if(!best || v>best.valor) best={L:L, d:d, acts:r.acts, valor:v, horas:r.horas, otros:[]};
      });
      return best;
    }
    /* Un viaje entero para una ruta de bases y un reparto de días; devuelve cuánto «vale» para el grupo */
    function simular(seq, rep){
      var usados={}, tipos={}, visitas={}, dias=[], valor=0, i=0;
      seq.forEach(function(b, bi){
        var gb=geo(b.id);
        for(var k=0;k<rep[bi];k++, i++){
          var tipo = i===0 ? 'llegada' : ((i===N-1 && N>1) ? 'ultimo' : ((k===0 && bi>0) ? 'traslado' : 'normal'));
          var r=null;
          if(tipo==='normal'){
            // repartir lo que hay entre los días que quedan aquí, para no dejar días vacíos al final
            var disp=0; LUG.forEach(function(L){ var hl=horasLibres(L, usados); if(hl && alcanceLugar(L, b.id, hl, true)!=null) disp+=hl; });
            var quedan=0; for(var j=k;j<rep[bi];j++){ var ii=i+(j-k); if(!(ii===N-1 && N>1)) quedan++; }
            r = diaNormal(b, usados, Math.min(HDIA, Math.max(3.5, disp*1.15/Math.max(1,quedan))), tipos, visitas);
          } else r = medioDia(b, usados, tipo==='ultimo'?'manana':(tipo==='llegada'?'llegada':'tarde'), tipos, tipo==='traslado');
          if(r){ r.acts.forEach(function(x){ usados[x.a.id]=1; tipos[x.a.tipo]=(tipos[x.a.tipo]||0)+1; }); visitas[r.L.id]=(visitas[r.L.id]||0)+1; valor+=r.valor; }
          else if(tipo==='normal') valor-=8;
          dias.push({tipo:tipo, base:b, r:r});
        }
        if(bi>0) valor -= 6 + distBase(seq[bi-1].id, b.id)/40;
        valor += ((A.bases.__c||{})[b.id]||0)*4;
      });
      return {dias:dias, valor:valor, seq:seq, rep:rep};
    }
    function repartos(n, k){ // k estancias de al menos 2 días
      if(k===1) return [[n]]; var out=[];
      for(var a=2; a<=n-2*(k-1); a++) repartos(n-a, k-1).forEach(function(r){ out.push([a].concat(r)); });
      return out;
    }
    function rutas(k){ // secuencias de k bases distintas
      if(k===0) return [[]]; var out=[];
      rutas(k-1).forEach(function(s){ candBases.forEach(function(b){ if(s.indexOf(b)<0) out.push(s.concat([b])); }); });
      return out;
    }
    var maxB = Math.min(candBases.length, N<=3 ? 1 : (N<=6 ? 2 : 3)), forzada = opts.base && Z.bases.filter(function(b){ return b.id===opts.base; })[0];
    if(forzada && candBases.indexOf(forzada)<0) candBases.unshift(forzada);
    var mejor=null;
    for(var kb=1; kb<=maxB; kb++){
      rutas(kb).forEach(function(seq){
        if(forzada && seq[0]!==forzada) return;
        repartos(N, kb).forEach(function(rep){ var s=simular(seq, rep); if(!mejor || s.valor>mejor.valor+1e-9) mejor=s; });
      });
    }
    if(!mejor) mejor = simular([forzada||candBases[0]], [N]);
    var bases = mejor.seq;

    /* ----- comidas: primero lo que es de ese sitio; lo de otra parte de la región, sin decir dónde ----- */
    var GAZ=[]; function gz(n, g){ n=norm(String(n||'').split(/[,(\/]/)[0]).replace(/\s+/g,' ').trim(); if(n.length>=4 && g && !GAZ.some(function(p){ return p.n===n; })) GAZ.push({n:n, g:g, re:new RegExp('(^|[^a-z])'+n.replace(/ /g,'\\s+'))}); }
    Z.bases.forEach(function(b){ gz(b.nombre, geo(b.id)); }); LUG.forEach(function(L){ gz(L.nombre, L.c); }); Z.actividades.forEach(function(a){ gz(a.donde, pt(a)); });
    function kmPlato(c, punto){ // km al sitio más cercano que nombra el plato (o su mapa); null si no nombra ninguno
      var mq=''; try{ mq=decodeURIComponent(String(c.maps||'').split('query=')[1]||'').replace(/\+/g,' '); }catch(e){}
      var t=norm((c.donde||'')+' '+(c.plato||'')+' '+mq), ds=GAZ.filter(function(p){ return p.re.test(t); }).map(function(p){ return punto ? km(p.g, punto) : 0; });
      return ds.length ? Math.min.apply(null, ds) : null; }
    function localidad(c, punto){ var d=kmPlato(c, punto); return d==null ? 'region' : (d<=15 ? 'aqui' : 'lejos'); }
    var estiloPref = A.comidaM, platosUsados={}, platosHoy={};
    var puntosPorDia = mejor.dias.map(function(D){ var o=[geo(D.base.id)]; if(D.r && D.r.L.c) o.push(D.r.L.c); return o.filter(Boolean); });
    function tocaDespues(x, i){ // ¿habrá un día posterior claramente más cerca de donde es típico?
      var hoy = Math.min.apply(null, puntosPorDia[i].map(function(p){ var d=kmPlato(x, p); return d==null ? 0 : d; }));
      for(var j=i+1;j<puntosPorDia.length;j++){ if(puntosPorDia[j].some(function(p){ var d=kmPlato(x, p); return d!=null && (d<=15 || d<hoy*0.5); })) return true; } return false; }
    var ESTILO_TXT = {street:'para comer de pie', mercado:'de mercado', trattoria:'con mesa y mantel', dulce:'dulce típico', bebida:'para brindar'};
    function comidaEn(momento, punto, sitio, por, iDia){
      function apto(c){ if(c.estilo==='bebida') return false; if(momento==='merienda') return c.estilo==='dulce'; if(c.estilo==='dulce') return false; if(momento==='cena') return c.estilo==='trattoria' || c.estilo==='mercado' || (c.estilo==='street' && /pizza|frit|arancin|panzerott|focacc/i.test(c.plato)); return true; }
      var lista = Z.comida.filter(apto).filter(function(c){ return !platosUsados[c.plato] && !platosHoy[c.plato]; });
      if(A.sinAlcohol) lista = lista.filter(function(c){ return !/vino|spritz|cerveza|licor/i.test(c.plato); });
      if(A.vegetariano){ var lv=lista.filter(function(x){ return !NO_VEG.test(norm(x.plato+' '+x.que_es)); }); lista=lv; }
      if(A.dieta && A.dieta.sin_pescado){ var lp=lista.filter(function(x){ return !CON_PESCADO.test(norm(x.plato+' '+x.que_es)); }); lista=lp; }
      if(A.dieta && A.dieta.sin_gluten) lista = lista.filter(function(x){ return !CON_GLUTEN.test(norm(x.plato+' '+x.que_es)); });
      var libre = {k:'comida', momento:momento, libre:true, nombre:(momento==='cena'?'Cena':(momento==='merienda'?'Merienda':'Comida'))+' a vuestro aire en '+sitio, lugar:sitio, descripcion:'Mirad la carta y consultad los ingredientes antes de pedir si hay restricciones en el grupo.', maps:maps((momento==='cena'?'dónde cenar ':'dónde comer ')+sitio+', Italia'), por_que:''};
      if(!lista.length) return momento==='merienda' ? null : libre;
      var c = lista.map(function(x, i){ var loc=localidad(x, punto), v = (loc==='aqui'?4:(loc==='region'?1.5:-3)) - i*0.05;
          if(loc!=='aqui' && tocaDespues(x, iDia)) v-=6; // guardarlo para el día que estemos donde es típico
          if(x.estilo===estiloPref) v+=2; if(estiloPref==='cocinar' && (x.estilo==='mercado'||x.estilo==='street')) v+=1.5; if(A.presTier==='ajustado' && x.coste==='alto') v-=2;
          var qe=norm(x.que_es||''); if(A.mes>=5 && A.mes<=9 && /invierno|frio/.test(qe)) v-=2; if((A.mes>=11||A.mes<=3) && /verano|calor/.test(qe)) v-=2;
          return {x:x, v:v, loc:loc}; }).sort(function(p,q2){ return q2.v-p.v; })[0];
      if(momento==='merienda' && c.loc!=='aqui') return null; // un dulce solo si es de ese sitio
      if(c.loc!=='aqui' && tocaDespues(c.x, iDia)) return libre;
      platosUsados[c.x.plato]=1; platosHoy[c.x.plato]=1;
      var x=c.x, gusta = (A.resps||[]).filter(function(r){ return (r.comida==='street' && (x.estilo==='street'||x.estilo==='mercado')) || (r.comida==='trattoria' && x.estilo==='trattoria') || (r.comida==='cocinar' && x.estilo==='mercado'); }).map(function(r){ return r.nombre; });
      var pq = por || '';
      if(gusta.length && A.n>1 && gusta.length<A.n) pq = 'Para '+joinY(gusta.slice(0,3))+': '+(ESTILO_TXT[x.estilo]||'típico');
      else if(!pq) pq = (ESTILO_TXT[x.estilo]||'típico de aquí');
      if(A.dieta && A.dieta.sin_gluten) pq += ' · consultad ingredientes y trazas en el local';
      if(c.loc==='lejos') return {k:'comida', momento:momento, sugerencia:true, lugar:sitio, nombre:(momento==='cena'?'Cenar en ':'Comer en ')+sitio,
        descripcion:'Para pedir si lo veis en carta: '+x.plato+' ('+x.que_es+'). Es más típico de otra parte de la región.', plato:x.plato, estilo:x.estilo, coste:x.coste,
        maps:maps((momento==='cena'?'dónde cenar ':'dónde comer ')+sitio+', Italia'), por_que:pq};
      return {k:'comida', momento:momento, nombre:x.plato, descripcion:x.que_es, estilo:x.estilo, coste:x.coste, lugar:sitio, donde:x.donde,
        maps: c.loc==='aqui' ? x.maps : maps(x.plato+' '+sitio+', Italia'), por_que:pq};
    }

    /* ----- noches: aperitivo antes de cenar, salir después ----- */
    var usoNoche={}, usadosN={};
    function pickNoche(base, filtro){ var best=null, bs=-1e9; deNoche.forEach(function(a){ if(usadosN[a.id] || a.duracion==='dia_completo' || distItem(a, base.id)>8 || !filtro(a)) return; if(SC[a.id]>bs){ bs=SC[a.id]; best=a; } }); return best; }
    function planNoche(i, base){
      var pref = A.nocheM || 'aperitivo', bn=nombreBase(base);
      var mias = Z.noche.filter(function(n){ return distItem(n, base.id)<=10; });
      function solapa(nm){ var x=norm(nm); return Object.keys(usoNoche).some(function(k){ var y=norm(k.replace(/^act:/,'')); return y.length>=6 && (x.indexOf(y)>-1 || y.indexOf(x)>-1); }); }
      if(pref==='fiesta' || pref==='aperitivo'){
        var cand = mias.filter(function(n){ return pref==='fiesta' ? (n.plan==='fiesta'||n.plan==='copas') : (n.plan==='aperitivo'||n.plan==='copas'); });
        if(!cand.length) cand = mias.slice();
        if(A.sinAlcohol) cand = cand.filter(function(n){ return n.plan==='aperitivo'; });
        cand = cand.filter(function(n){ return usoNoche[n.zona] || (!solapa(n.zona) && !usoNoche['act:'+n.zona]); }).sort(function(x,y){ return (usoNoche[x.zona]||0)-(usoNoche[y.zona]||0); });
        var actN = pickNoche(base, function(a){ return !usoNoche[a.nombre] && !solapa(a.nombre) && (pref==='fiesta' ? a.ambiente!=='tranquilo' : true); });
        var TOPE = N>4 ? 2 : 1;
        if(actN && (i%2===1 || !cand.length || (usoNoche[cand[0].zona]||0)>=1)){ usadosN[actN.id]=1; usoNoche[actN.nombre]=1; usoNoche['act:'+actN.nombre]=1; var sa=slotAct(actN, A, 'noche'); if(/aperitiv/i.test(actN.nombre)) sa.antes=true; if(actN.tipo==='postal' || /atardecer|tramonto|puesta de sol/.test(txt(actN))){ sa.antes=true; sa.sol=true; } return sa; }
        if(cand.length && (usoNoche[cand[0].zona]||0)<TOPE){ var n=cand[0], otra=!!usoNoche[n.zona]; usoNoche[n.zona]=(usoNoche[n.zona]||0)+1; usoNoche['act:'+n.zona]=1;
          var sn={k:'noche', momento:'noche', nombre:n.zona, descripcion:n.descripcion, plan:n.plan, maps:n.maps, por_que: otra ? 'Otra noche por la zona que ya conocéis' : (pref==='fiesta' ? 'Queríais salir' : 'Aperitivo, como se hace aquí')}; if(n.plan==='aperitivo') sn.antes=true; return sn; }
        var sl={k:'libre', momento:'noche', nombre: pref==='fiesta' ? 'Salir por '+bn : 'Aperitivo por '+bn, descripcion: pref==='fiesta' ? 'Noche sin plan cerrado: volved a la zona que más os gustó o probad otra; el mapa enseña los bares de alrededor.' : 'A la hora del aperitivo (sobre las 18–20 h) muchos bares del centro sacan algo de picar con la bebida.', maps:maps((pref==='fiesta'?'bares':'aperitivo')+' '+bn+', Italia'), por_que:''};
        if(pref!=='fiesta') sl.antes=true; return sl;
      }
      var tranq = pickNoche(base, function(a){ return a.ambiente!=='social' && a.tipo!=='fiesta'; });
      if(tranq){ usadosN[tranq.id]=1; var st=slotAct(tranq, A, 'noche'); if(tranq.tipo==='postal' || /atardecer|tramonto|puesta de sol/.test(txt(tranq))){ st.antes=true; st.sol=true; } return st; }
      var calmas=['Paseo de noche por '+bn,'Sobremesa larga y a dormir','Helado y paseo por el centro de '+bn]; return {k:'libre', momento:'noche', nombre:calmas[i%calmas.length], maps:maps('centro '+bn+', Italia'), por_que:'Noches tranquilas, como pedisteis'};
    }

    /* ----- montar los días ----- */
    var todosItalia = A.origenes.length && A.origenes.every(function(o){ return o.pais==='it'; });
    var aerIda = aeropuertoPara(Z, bases[0].id, A), aerVuelta = aeropuertoPara(Z, bases[bases.length-1].id, A);
    function dir(o, d){ return 'https://www.google.com/maps/dir/?api=1&origin='+q(o)+'&destination='+q(d)+'&travelmode=transit'; }
    function mismaCiudad(a, b){ var x=ENG_norm(a), y=ENG_norm(b); return x===y || x.indexOf(y)===0 || y.indexOf(x)===0; }
    function ordenar(lista, desde){ // el más cercano primero; los de atardecer, al final
      var rest=lista.slice(), out=[], p=desde;
      while(rest.length){ var bi=0, bd=1e9; rest.forEach(function(x, i){ var g=pt(x.a), d = (g&&p) ? km(g,p) : 0; if(x.a.tipo==='postal' || KW.atardecer.test(txt(x.a))) d+=50; if(d<bd){ bd=d; bi=i; } }); var x=rest.splice(bi,1)[0]; out.push(x); p=pt(x.a)||p; }
      return out;
    }
    var modoViaje = A.tieneCoche && Z.coche.necesidad!=='innecesario' ? 'driving' : 'transit';
    var dias=[], ruta=[];
    mejor.dias.forEach(function(D, i){
      var base=D.base, r=D.r, bn=nombreBase(base), gb=geo(base.id);
      platosHoy={};
      var d={n:i+1, fecha:fechaDia(trip,i), titulo:'', base:base.id, slots:[]};
      if(!ruta.length || ruta[ruta.length-1].base!==base.id) ruta.push({base:base.id, nombre:bn, desde:i+1, hasta:i+1}); else ruta[ruta.length-1].hasta=i+1;
      var man = r ? ordenar(r.acts.filter(function(x){ return x.b==='manana'; }), gb) : [];
      var tar = r ? ordenar(r.acts.filter(function(x){ return x.b==='tarde'; }), man.length ? pt(man[man.length-1].a) : (r.L.c||gb)) : [];
      var comp = r ? r.acts.filter(function(x){ return x.b==='dia'; })[0] : null;
      var fuera = !!(r && r.d>12), sitio = r ? r.L.nombre : bn, puntoDia = r ? (r.L.c||gb) : gb;
      function mete(x, momento){ var s=slotAct(x.a, A, momento); if(x.L && x.L.nombre!==sitio) s.lugar=x.L.nombre; d.slots.push(s); }
      function cenaYNoche(conNoche){
        var nn = conNoche ? planNoche(i, base) : null;
        if(nn && nn.antes) d.slots.push(nn);
        var ce = comidaEn('cena', gb, bn, i===0 ? 'Primera cena: algo típico' : '', i); if(ce) d.slots.push(ce);
        if(nn && !nn.antes) d.slots.push(nn);
      }
      if(D.tipo==='llegada'){
        d.titulo = 'Llegada a '+bn;
        var aer = aerIda;
        d.slots.push({k:'llegada', momento:'manana', nombre: todosItalia ? ('Viaje hasta '+base.nombre) : ('Vuelo a '+(aer?aer.ciudad+' ('+aer.iata+')':'la zona')+(aer && !mismaCiudad(aer.ciudad, base.nombre)?' y traslado a '+base.nombre:'')),
          descripcion: (aer && aer.a_la_base && !todosItalia && aer===Z.aeropuertos[0]) ? aer.a_la_base : (todosItalia ? ('Desde '+joinY(uniq(A.origenes.map(function(o){ return o.ciudad; })))+(A.tieneCoche && plan_coche(Z)?': en coche o en tren':': en tren y, si hace falta, bus')+'. En Reservas tenéis la ruta de cada uno.') : 'Mirad el bus lanzadera o el tren del aeropuerto en su web oficial; el mapa os da la ruta en transporte público.'),
          maps: aer && !todosItalia ? dir('Aeropuerto '+aer.nombre+', Italia', base.nombre+', Italia') : maps('estación '+base.nombre+', Italia')});
        tar.forEach(function(x){ mete(x, 'tarde'); });
        if(!tar.length) d.slots.push({k:'libre', momento:'tarde', nombre:'Dejar las cosas y primer paseo por '+bn, descripcion:'Sin plan cerrado: depende de a qué hora lleguéis.', maps:maps('centro '+bn+', Italia'), por_que:''});
        cenaYNoche(N>1);
      } else if(D.tipo==='ultimo'){
        d.titulo = 'Último día';
        man.forEach(function(x){ mete(x, 'manana'); });
        if(!man.length) d.slots.push({k:'libre', momento:'manana', nombre:'Última vuelta por '+bn, descripcion:'Compras de última hora, un café largo y recoger.', maps:maps('centro '+bn+', Italia'), por_que:''});
        var cU = comidaEn('comida', gb, bn, 'Para despedirse', i); if(cU) d.slots.push(cU);
        d.slots.push({k:'vuelta', momento:'tarde', nombre: todosItalia ? 'Viaje de vuelta' : ('Vuelta desde '+(aerVuelta?aerVuelta.ciudad+' ('+aerVuelta.iata+')':'el aeropuerto')), descripcion:'Calculad el traslado al aeropuerto o la estación con margen.', maps: aerVuelta && !todosItalia ? dir(base.nombre+', Italia', 'Aeropuerto '+aerVuelta.nombre+', Italia') : maps('estación '+base.nombre+', Italia')});
      } else if(D.tipo==='traslado'){
        var b0 = mejor.dias[i-1].base;
        d.titulo = 'Rumbo a '+bn;
        d.slots.push({k:'traslado', momento:'manana', nombre:'Cambio de base: de '+nombreBase(b0)+' a '+bn, descripcion: (A.tieneCoche && plan_coche(Z)) ? 'Por carretera; dejad las maletas en el alojamiento nuevo antes de seguir.' : 'En tren o bus: mirad la combinación y los horarios en el enlace.', maps: dir(b0.nombre+', Italia', base.nombre+', Italia'), por_que:'Para ver las dos partes sin palizas de ida y vuelta'});
        var cT = comidaEn('comida', gb, bn, 'Al llegar', i); if(cT) d.slots.push(cT);
        tar.forEach(function(x){ mete(x, 'tarde'); });
        cenaYNoche(true);
      } else {
        if(comp){
          d.titulo = comp.a.nombre; mete(comp, 'dia');
          var cD = comidaEn('comida', puntoDia, sitio, '', i); if(cD){ cD.durante=true; d.slots.push(cD); }
        } else if(r){
          var sitios = uniq(man.concat(tar).map(function(x){ return String(x.a.donde||'').split(/[,(\/]/)[0].trim(); })).slice(0,3);
          d.titulo = sitios.length>1 ? joinY(sitios) : ((fuera ? 'Excursión a ' : 'Día en ')+(sitios[0]||sitio));
          if(!man.length) d.slots.push({k:'libre', momento:'manana', nombre:'Mañana sin prisa', descripcion:'Los planes de hoy son de tarde: desayuno largo'+(fuera?' y camino a '+sitio:' y paseo')+'.', por_que:''});
          man.forEach(function(x){ mete(x, 'manana'); });
          var dondeComer=man.length ? man[man.length-1].a : null;
          var cc = comidaEn('comida', dondeComer && dondeComer.geo || puntoDia, dondeComer ? dondeComer.donde : sitio, '', i); if(cc) d.slots.push(cc);
          tar.forEach(function(x, k){ mete(x, 'tarde'); if(k===0){ var dl=comidaEn('merienda', pt(x.a)||puntoDia, x.L?x.L.nombre:sitio, '', i); if(dl) d.slots.push(dl); } });
        } else {
          // sin planes nuevos al alcance: repetir lo que se repite de verdad (playa, esquí, termas) antes que dejar el día vacío
          var rep=null; dias.forEach(function(dd){ dd.slots.forEach(function(sl){ if(rep || !sl.ref) return; var a=Z.actividades.filter(function(x){ return x.id===sl.ref; })[0]; if(a && /esqu|ski|playa|spiaggia|lido|cala|terme|termas/i.test(a.id+' '+a.nombre) && distItem(a, base.id)<=22) rep=a; }); });
          if(rep){ var sR=slotAct(rep, A, 'dia'); sR.nombre='Repetimos: '+rep.nombre; sR.por_que='Lo que más se repite en un viaje así'; d.slots.push(sR); d.titulo=sR.nombre; }
          else { d.titulo='Día libre en '+bn; d.slots.push({k:'libre', momento:'manana', nombre:'Día sin plan cerrado en '+bn, descripcion:'No nos quedan más planes comprobados cerca: es el día para descansar, perderse por el centro o repetir lo que más os gustó.', maps:maps('qué ver en '+bn+', Italia'), por_que:''}); }
          var cL = comidaEn('comida', gb, bn, '', i); if(cL) d.slots.push(cL);
        }
        cenaYNoche(true);
      }
      if(r){ d.lugar = sitio; if(fuera){ d.km = Math.round(r.d); d.ruta = dirPts(base.nombre+', Italia', r.L.c || (sitio+', Italia'), modoViaje); } if(r.otros && r.otros.length) d.otros = r.otros.map(function(M){ return M.nombre; }); }
      dias.push(d);
    });
    if(N===1) dias[0].titulo='Escapada de un día';
    // nadie se queda sin «su plan»: si a alguien no le tocó, se le asigna el plan del viaje que mejor le encaja y aún no es de nadie
    if((A.resps||[]).length>1){
      var porIdA={}; Z.actividades.forEach(function(a){ porIdA[a.id]=a; });
      A.resps.forEach(function(r){
        var tiene = dias.some(function(d){ return d.slots.some(function(x){ return x.de===r.nombre; }); }); if(tiene) return;
        var best=null, bs=1.5; dias.forEach(function(d){ d.slots.forEach(function(x){ if(x.k!=='act' || x.de || !porIdA[x.ref]) return; var e=encaje(porIdA[x.ref], r).s; if(e>bs){ bs=e; best=x; } }); });
        if(best){ best.de=r.nombre; best.por_que=porQueAct(porIdA[best.ref], A, r.nombre); }
      });
    }
    var OCA = {erasmus:'Noche de fin de Erasmus', cumple:'Noche del cumple', reencuentro:'Noche de reencuentro', despedida:'Noche de despedida'};
    if(OCA[trip.ocasion] && N>=2){
      var dc = dias[Math.max(0, N-2)];
      var sn2 = dc.slots.filter(function(x){ return x.momento==='noche'; })[0];
      if(sn2){ sn2.nombre = OCA[trip.ocasion]+' · '+sn2.nombre; sn2.por_que='La noche grande del viaje'; }
      else dc.slots.push({k:'libre', momento:'noche', nombre:OCA[trip.ocasion]+' · cena larga y brindis', maps:maps('ristorante '+nombreBase(mejor.dias[Math.max(0,N-2)].base)+', Italia'), por_que:'La noche grande del viaje'});
    }
    var eventos = A.mes ? Z.eventos.filter(function(e){ return (e.meses||[]).indexOf(A.mes)>-1; }) : [];
    return {zona:Z.id, base:bases[0].id, bases:bases.map(function(b){ return b.id; }), ruta:ruta, aerIda:aerIda&&aerIda.iata, aerVuelta:aerVuelta&&aerVuelta.iata, dias:dias,
      eventos:eventos.map(function(e){ return e.nombre; }), coche:A.tieneCoche && Z.coche.necesidad!=='innecesario',
      inicio: madruga ? 570 : (A.nocheM==='fiesta' ? 660 : 630), generado:Date.now(), motor:VERSION};
  }

  /* ---------- 4c. Cronograma: horas orientativas y trayectos, calculados a partir del orden de los planes ----------
     No se guardan en el plan: así, si el grupo mueve, quita o añade planes, las horas y las distancias se recalculan solas.
     Las horas son una propuesta para organizarse, no horarios de apertura. */
  var DUR_MIN = {'1h':60, '2h':120, medio_dia:210, dia_completo:420};
  function cronograma(Z, plan, d){
    var acts={}; Z.actividades.forEach(function(a){ acts[a.id]=a; });
    var gb = geo(d.base||plan.base), coche=!!plan.coche;
    var t = plan.inicio || 600, reloj = !d.slots.some(function(s){ return s.k==='llegada' || s.k==='traslado'; }), prev=gb, desdeBase=true, out=[], ultimo=null;
    function hhmm(m){ m=Math.round(m/15)*15; var h=Math.floor(m/60)%24, mm=m%60; return h+':'+(mm<10?'0':'')+mm+(m>=1440?' (+1 día)':''); }
    function volverBase(o){
      if(!ultimo || !gb || km(ultimo,gb)<3) return;
      var dist=km(ultimo,gb), modo=coche?'driving':'transit';
      o.tramo={km:dist, modo:modo, desde:'anterior', maps:dirPts(ultimo,gb,modo)};
      t += coche ? 10+dist*1.1 : (dist<5 ? 10+dist*3 : 20+dist*0.9);
      prev=gb; ultimo=null;
    }
    d.slots.forEach(function(s){
      var a = s.ref && acts[s.ref], o = {hora:null, tramo:null};
      if(a && s.momento!=='noche'){
        var g=a.geo;
        if(g && prev){ var kmv=km(prev, g);
          if(kmv>=0.3 || !desdeBase){ var modo = kmv<1.3 ? 'walking' : (coche ? 'driving' : 'transit');
            o.tramo = {km:kmv, modo:modo, desde: desdeBase ? 'base' : 'anterior', maps:dirPts(prev, g, modo)};
            var mins = modo==='walking' ? Math.max(5, kmv*14) : (coche ? 10+kmv*1.1 : (kmv<5 ? 10+kmv*3 : 20+kmv*0.9));
            if(desdeBase && kmv>=12 && reloj) o.salida = hhmm(t);
            t += mins; } }
        if(s.momento==='tarde' && reloj) t = Math.max(t, 15*60);
        if(reloj) o.hora = hhmm(t);
        t += DUR_MIN[a.duracion]||120; prev=g; desdeBase=false; ultimo=g;
      } else if(s.k==='comida'){
        if(s.momento==='cena') volverBase(o);
        if(s.momento==='comida'){ if(s.durante){ if(reloj) o.hora = hhmm(13.5*60); } else { t = Math.max(t, 13.25*60); if(reloj) o.hora = hhmm(t); t += 75; } }
        else if(s.momento==='merienda'){ t = Math.max(t, 17*60); if(reloj) o.hora = hhmm(t); t += 30; }
        else { t = Math.max(t, 20.5*60); o.hora = hhmm(t); t += 90; }
      } else if(s.momento==='noche'){
        if(s.antes){ if(!a) volverBase(o); t = Math.max(t, 19*60); if(s.sol) o.etiqueta='Atardecer'; else o.hora = hhmm(t); t += 75; } else { t = Math.max(t, 22.5*60); o.hora = hhmm(t); }
      } else if(s.k==='libre' && reloj){ if(s.momento==='tarde') t=Math.max(t, 16*60); o.hora = hhmm(t); t += 120; }
      else if(s.k==='vuelta'){ reloj=false; }
      out.push(o);
    });
    var regreso = (ultimo && gb && km(ultimo, gb)>=3 && !d.slots.some(function(s){ return s.k==='vuelta'; })) ? {km:km(ultimo, gb), modo: coche?'driving':'transit', maps:dirPts(ultimo, gb, coche?'driving':'transit')} : null;
    return {slots:out, regreso:regreso};
  }

  /* alternativas para cambiar un hueco del plan */
  function alternativas(Z, A, plan, slot, baseId, cerca, filtro){
    baseId = baseId || plan.base;
    var ctx={base:baseId, mes:A.mes, textos:norm(A.textos)};
    var usados={}; plan.dias.forEach(function(d){ d.slots.forEach(function(s){ if(s.ref) usados[s.ref]=1; }); });
    return Z.actividades.filter(function(a){ if(usados[a.id] || (filtro && !filtro(a))) return false; if(a.coche && !A.tieneCoche) return false; if(!alcanzable(a, baseId, A)) return false; if(a.meses && a.meses.length && A.mes && a.meses.indexOf(A.mes)===-1) return false;
        if(slot.momento==='noche') return a.momento==='noche' || a.tipo==='fiesta';
        if(slot.momento==='dia') return a.duracion==='dia_completo';
        if(slot.momento==='manana' && a.momento==='tarde') return false;
        if(slot.momento==='tarde' && a.momento==='manana') return false;
        return a.momento!=='noche' && a.tipo!=='fiesta' && a.duracion!=='dia_completo'; })
      .map(function(a){ var g=pt(a); return {a:a, s:puntuarAct(a,A,ctx) - (cerca && g ? Math.min(8, km(cerca, g)*0.35) : 0)}; }).sort(function(x,y){ return y.s-x.s; }).slice(0,8).map(function(x){ return x.a; });
  }

  /* ---------- 5. Identidad del grupo (para la tarjeta) ---------- */
  function identidad(A){
    var t=[];
    if((A.noche.fiesta||0)>=0.5) t.push('Cerramos bares');
    else if((A.noche.calma||0)>=0.5) t.push('A las doce, a dormir');
    if(A.madrugar==='si' && A.ritmo>=2.3) t.push('Despertador a las siete');
    else if(A.madrugar==='no') t.push('Nada antes de las diez');
    if((A.intereses.gastronomia||0)>=0.5) t.push('Venimos a comer');
    if((A.intereses.aventura||0)>=0.5) t.push('Adrenalina sí o sí');
    if(A.presTier==='ajustado') t.push('Presupuesto de estudiante');
    if((A.paisaje.mar||0)>=0.6) t.push('Equipo sal y arena');
    if((A.paisaje.montana||0)>=0.6) t.push('Equipo cumbre');
    if(A.comidaM==='cocinar') t.push('Cocinamos en el piso');
    if(!t.length) t.push('Grupo sin prisa');
    return t.slice(0,2);
  }

  /* ---------- 6. Reservas sugeridas ---------- */
  function yymmdd(isoStr){ return isoStr ? isoStr.slice(2,4)+isoStr.slice(5,7)+isoStr.slice(8,10) : ''; }
  function reservas(Z, A, trip, plan){
    function nombreAer(i){ var a=Z.aeropuertos.filter(function(x){ return x.iata===i; })[0]; return a ? a.ciudad+' ('+i+')' : (i||'llegada'); }
    var out=[]; var base = Z.bases.filter(function(b){ return b.id===plan.base; })[0]||Z.bases[0];
    var aer = Z.aeropuertos.filter(function(a){ return a.iata===plan.aerIda; })[0] || Z.aeropuertos[0]; var aerV = Z.aeropuertos.filter(function(a){ return a.iata===plan.aerVuelta; })[0] || aer; var fi = trip.fechas&&trip.fechas.modo==='fijas'?trip.fechas.inicio:'', ff = trip.fechas&&trip.fechas.modo==='fijas'?trip.fechas.fin:'';
    var N = Math.max(1, (trip.integrantes||[]).length);
    // transporte por ciudad de origen
    var grupos = {};
    A.origenes.forEach(function(o){ var k=(o.pais||'x')+':'+(o.iata||o.ciudad); (grupos[k]=grupos[k]||{o:o, quien:[]}).quien.push(o.nombre); });
    Object.keys(grupos).forEach(function(k){
      var g=grupos[k], o=g.o;
      if(o.pais==='it' && !(Z.id==='sicilia'||Z.id==='cerdena')){
        out.push({key:'tren-'+slug(o.ciudad), cat:'tren', titulo:'Tren '+o.ciudad+' → '+base.nombre.split('(')[0].trim(), detalle:'Para '+g.quien.join(', ')+'. Comparad Trenitalia e Italo; en regionales el precio no cambia, en alta velocidad sí: cuanto antes, más barato.',
          enlaces:[{t:'Trenitalia', u:'https://www.trenitalia.com/'},{t:'Italo', u:'https://www.italotreno.com/es'},{t:'Ruta y tiempos', u:'https://www.rome2rio.com/s/'+q(o.ciudad)+'/'+q(base.nombre.split('(')[0].trim())}]});
      } else if(o.iata && aer){
        var directa = (Z.rutas||[]).filter(function(r){ return r.origen_iata===o.iata; })[0];
        var sky = aerV.iata===aer.iata ? 'https://www.skyscanner.es/transporte/vuelos/'+o.iata.toLowerCase()+'/'+aer.iata.toLowerCase()+'/'+(fi&&ff?yymmdd(fi)+'/'+yymmdd(ff)+'/':'') : 'https://www.skyscanner.es/transporte/vuelos/'+o.iata.toLowerCase()+'/'+aer.iata.toLowerCase()+'/'+(fi?yymmdd(fi)+'/':'');
        out.push({key:'vuelo-'+o.iata, cat:'vuelo', titulo:'Vuelo '+o.ciudad+' → '+aer.ciudad+(aerV.iata!==aer.iata?' (vuelta desde '+aerV.ciudad+')':''), detalle:'Para '+g.quien.join(', ')+'. '+(directa?('Hay ruta directa con '+directa.aerolinea+(directa.nota?' ('+directa.nota+')':'')+'.'):'Comparad también los otros aeropuertos de la zona'+(Z.aeropuertos.length>1?' ('+Z.aeropuertos.slice(1).map(function(a){return a.iata;}).join(', ')+')':'')+'.'),
          enlaces:aerV.iata===aer.iata ?
            [{t:'Skyscanner', u:sky},{t:'Google Flights', u:'https://www.google.com/travel/flights?q='+q('Vuelos de '+o.iata+' a '+aer.iata+(fi?' el '+fi:'')+(ff?' vuelta '+ff:''))}] :
            [{t:'Buscar ida', u:sky},{t:'Buscar vuelta', u:'https://www.skyscanner.es/transporte/vuelos/'+aerV.iata.toLowerCase()+'/'+o.iata.toLowerCase()+'/'+(ff?yymmdd(ff)+'/':'')}]});
      } else {
        var llegada = base.nombre.split('(')[0].trim();
        out.push({key:'ruta-'+slug(o.ciudad), cat:'tren', titulo:o.ciudad+' → '+llegada, detalle:'Para '+g.quien.join(', ')+'. Comparad las conexiones antes de reservar.',
          enlaces:[{t:'Mapa y transporte público', u:dirPts(o.ciudad+(o.pais==='it'?', Italia':', España'),llegada+', Italia','transit')}]});
      }
    });
    // alojamiento según lo que votó el grupo, una entrada por cada base del viaje
    var pref = A.dormirM;
    var tiposPref = pref==='hostel' ? ['hostel','bnb'] : (pref==='hotel' ? ['hotel','bnb','agriturismo','rifugio'] : ['apartamento','agriturismo','bnb']);
    var ETQ_AL = {hostel:'Hostel', apartamento:'Piso entero para el grupo', hotel:'Hotel', agriturismo:'Agriturismo', rifugio:'Refugio de montaña', camping:'Camping', bnb:'B&B'};
    var basesV = (plan.bases&&plan.bases.length?plan.bases:[plan.base]).map(function(id){ return Z.bases.filter(function(b){ return b.id===id; })[0]; }).filter(Boolean);
    basesV.forEach(function(bv, bi){
      var noches = plan.dias.slice(0,-1).filter(function(d){ return (d.base||plan.base)===bv.id; });
      if(!noches.length) return;
      var ini='', fin='';
      if(fi && ff){ var d0=new Date(fi+'T12:00:00'); var desde = plan.dias.indexOf(noches[0]); var hasta = plan.dias.indexOf(noches[noches.length-1])+ (bi===basesV.length-1?0:1); var x=new Date(d0); x.setDate(x.getDate()+desde); var y=new Date(d0); y.setDate(y.getDate()+hasta); ini=iso(x); fin=bi===basesV.length-1?ff:iso(y); }
      var fechasQS = ini&&fin ? '&checkin='+ini+'&checkout='+fin : '';
      var alojs = Z.alojamiento.filter(function(a){ return a.base===bv.id; }); if(!alojs.length) alojs = Z.alojamiento.filter(function(a){ return distBase(a.base,bv.id)<=22; }); if(!alojs.length) alojs = Z.alojamiento.slice();
      alojs.sort(function(x,y){ function v(a){ var s=tiposPref.indexOf(a.tipo)>-1?3-tiposPref.indexOf(a.tipo):0; if(A.presTier==='ajustado' && a.coste==='alto') s-=3; if(A.presTier==='ajustado' && a.coste==='bajo') s+=1; return s; } return v(y)-v(x); });
      var nombreB = bv.nombre.split('(')[0].trim();
      alojs.slice(0, bi===0 && basesV.length===1 ? 2 : 1).forEach(function(a, i){
        var en = a.enlaces.map(function(l){ var u=l.url; if(/booking\.com/.test(u)) u = 'https://www.booking.com/searchresults.es.html?ss='+q(nombreB+', Italia')+fechasQS+'&group_adults='+N+'&no_rooms='+(a.tipo==='apartamento'?1:Math.ceil(N/2)); if(/airbnb\./.test(u)) u='https://www.airbnb.es/s/'+q(nombreB+'--Italia')+'/homes?adults='+N+(ini&&fin?'&checkin='+ini+'&checkout='+fin:''); return {t:l.sitio, u:u}; });
        if(a.tipo==='apartamento' && !en.some(function(l){ return /airbnb/.test(l.u); })) en.push({t:'Airbnb', u:'https://www.airbnb.es/s/'+q(nombreB+'--Italia')+'/homes?adults='+N+(ini&&fin?'&checkin='+ini+'&checkout='+fin:'')});
        out.push({key:'aloj-'+bv.id+'-'+a.tipo+'-'+i, cat:'aloj', titulo:(ETQ_AL[a.tipo]||'Alojamiento')+' en '+nombreB+(basesV.length>1?' ('+noches.length+' noche'+(noches.length>1?'s':'')+')':''), detalle:(a.para?a.para.charAt(0).toUpperCase()+a.para.slice(1).replace(/[.\s]+$/,'')+'. ':'')+'Gasto '+a.coste+'.'+(i===0?(a.tipo===({piso:'apartamento',hostel:'hostel',hotel:'hotel'})[pref]?' Es lo que votó la mayoría.':' Lo más parecido a lo que votasteis que hay en la zona.'):' Plan B si lo primero no os cuadra: reservad solo uno.'), enlaces:en, opcion: i===0?'A':'B'});
      });
    });
    if(plan.coche && Z.coche.operadores.length){
      out.push({key:'coche', cat:'coche', titulo: ((A.origenes||[]).length && A.origenes.every(function(o){ return o.pais==='it'; })) ? 'Coche de alquiler (en la ciudad o en el aeropuerto de '+nombreAer(Z.coche.aeropuerto)+')' : 'Coche de alquiler en el aeropuerto de '+nombreAer(Z.coche.aeropuerto), detalle:(A.conductores? A.conductores+' en el grupo se ofrece'+(A.conductores>1?'n':'')+' a conducir. ':'')+'Compañías que operan allí:', enlaces:Z.coche.operadores.map(function(o){ return {t:o.nombre, u:o.enlace}; })});
    }
    var textoPlan = norm(plan.dias.map(function(d){ return d.slots.map(function(x){ return x.nombre+' '+(x.ref && (Z.actividades.filter(function(a){ return a.id===x.ref; })[0]||{}).donde || ''); }).join(' '); }).join(' '));
    function ferryUsado(f){ var w = norm((f.ruta||'')+' '+(f.nota||'')).split(/[^a-z]+/).filter(function(x){ return x.length>=5 && !/^(ferry|ferri|barco|desde|hasta|entre|todos|ruta|rapido|lento|puerto|islas|isola|traghetti|aliscafo)$/.test(x) && Z.bases.filter(function(b){ return (plan.bases||[plan.base]).indexOf(b.id)>-1; }).every(function(b){ return norm(b.nombre).indexOf(x)===-1; }); }); return w.some(function(x){ return textoPlan.indexOf(x)>-1; }); }
    (Z.moverse.ferry||[]).filter(ferryUsado).slice(0,2).forEach(function(f,i){ if(f && f.enlace) out.push({key:'ferry-'+i, cat:'ferry', titulo:'Ferry: '+(f.ruta||f.operador), detalle:f.nota||'', enlaces:[{t:f.operador, u:f.enlace}]}); });
    if(Z.moverse.bus && Z.moverse.bus.enlace && !plan.coche) out.push({key:'bus', cat:'bus', titulo:'Autobús '+String(Z.moverse.bus.operador||'').replace(/\s*\(.*?\)/g,'')+' por la zona', detalle:Z.moverse.bus.nota||'', enlaces:[{t:String(Z.moverse.bus.operador||'Ver horarios').replace(/\s*\(.*?\)/g,''), u:Z.moverse.bus.enlace}]});
    if(Z.moverse.camper && Z.moverse.camper.enlace && A.tieneCoche && /camper|furgo|autocaravana/.test(norm(A.textos||''))) out.push({key:'camper', cat:'camper', titulo:'Furgoneta camper ('+(Z.moverse.camper.operador||'')+')', detalle:Z.moverse.camper.nota||'', enlaces:[{t:Z.moverse.camper.operador||'Ver', u:Z.moverse.camper.enlace}]});
    // actividades del plan que conviene reservar
    var porId={}; Z.actividades.forEach(function(a){ porId[a.id]=a; });
    plan.dias.forEach(function(d){ d.slots.forEach(function(s){ var a=s.ref&&porId[s.ref]; if(a && (a.reserva || a.coste==='alto' || a.coste==='medio')){ var en=(a.tours||[]).map(function(tour){ return {t:tour[0]+' · '+tour[1], u:tour[2]}; }); if(a.enlace) en.push({t:a.enlace_tipo==='oficial'?'Web oficial':(a.enlace_tipo==='reserva'?'Reservar':'Mapa'), u:a.enlace}); if(!/getyourguide/.test(a.enlace||'')) en.push({t:'Tours', u:'https://www.getyourguide.es/s/?q='+q(a.nombre)}); out.push({key:'act-'+a.id, cat:'actividad', titulo:a.nombre, detalle:'Día '+d.n+(d.fecha?' ('+d.fecha+')':'')+'. '+(a.reserva?'Conviene reservar con antelación.':'Actividad de pago.'), enlaces:en}); } }); });
    return out;
  }

  /* ---------- 7. Lo que opinó cada uno (texto humano) ---------- */
  var T = {
    noche:{fiesta:'salir de fiesta', aperitivo:'aperitivo y alguna copa', calma:'noches tranquilas'},
    madrugar:{si:'madrugar y aprovechar', no:'dormir sin despertador'},
    coche:{conduzco:'se ofrece a conducir', carnet:'tiene carnet pero prefiere no conducir', no:'no conduce'},
    dormir:{piso:'piso para todos', hostel:'hostel con ambiente', hotel:'hotel con habitaciones'},
    comida:{street:'street food de pie', trattoria:'trattoria con mantel', cocinar:'cocinar y ahorrar'},
    presupuesto:{justo:'le viene justo de dinero', ok:'el presupuesto le va bien', estirar:'puede estirar el presupuesto'},
    ritmo:{1:'ritmo tranquilo', 2:'ritmo normal', 3:'a tope'},
    calor:{playa:'calor sí, con playa', fresco:'mejor fresquito'}, nieve:{si:'nieve sí', no:'mejor sin nieve'}
  };
  function cap(x){ x=String(x||''); return x.charAt(0).toUpperCase()+x.slice(1); }
  function opinion(r, Z){
    // orden: lo que más dice de cada uno primero. El presupuesto personal nunca se muestra (se promete en la pregunta).
    var out=[];
    if(r.paisaje&&r.paisaje.length) out.push('Quería '+r.paisaje.map(function(p){return ETQ_PAISAJE[p]||p;}).join(' y '));
    if(r.supers&&r.supers.length && Z){ var nm=r.supers.map(function(id){ var a=Z.actividades.filter(function(x){return x.id===id;})[0]; return a?a.nombre:null; }).filter(Boolean); if(nm.length) out.push('Imprescindible: '+nm.join(', ')); }
    if(r.intereses&&r.intereses.length) out.push('Le tira '+r.intereses.map(function(k){ return ETQ_INT[k]||k; }).join(', '));
    if(r.momento) out.push('Su foto del viaje: '+({atardecer:'un atardecer en un mirador', cena:'una mesa larga comiendo', fiesta:'bailando a las tres', cumbre:'arriba del todo', agua:'saltando al agua', ruinas:'entre ruinas'})[r.momento]);
    if(r.playa) out.push('Playa: '+({cala:'cala escondida', lido:'hamaca y chiringuito', barco:'desde un barco'})[r.playa]);
    if(r.ciudad) out.push('En la ciudad: '+({museos:'museos y arte', barrios:'perderse por barrios', mercados:'mercados y tiendas'})[r.ciudad]);
    if(r.nieveAct) out.push('En la nieve: '+({esqui:'esquiar', raquetas:'raquetas', trineo:'trineo', relax:'termas y chimenea'})[r.nieveAct]);
    if(r.andar) out.push('Andar: '+({poco:'lo justo', medio:'rutas cortas', mucho:'lo que haga falta'})[r.andar]);
    if(r.dieta && r.dieta.length && r.dieta.indexOf('nada')<0) out.push('No come o no bebe: '+r.dieta.map(function(d){ return ({vegetariano:'vegetariano', sin_gluten:'sin gluten', sin_alcohol:'sin alcohol', sin_pescado:'pescado'})[d]||d; }).join(', '));
    if(r.capricho && r.capricho!=='nada') out.push('Su capricho: '+({barco:'un barco', experiencia:'algo especial con reserva', cena:'una cena buena'})[r.capricho]);
    if(r.agobio && r.agobio!=='nada') out.push('Le quema: '+({prisas:'ir con prisas', madrugones:'los madrugones', coche:'las horas de coche', gastar:'gastar de más', turistadas:'las turistadas'})[r.agobio]);
    if(r.noche) out.push('De noche: '+T.noche[r.noche]);
    if(r.dormir) out.push('Dormir: '+T.dormir[r.dormir]);
    if(r.comida) out.push('Comer: '+T.comida[r.comida]);
    if(r.nota) out.push('«'+r.nota+'»');
    if(r.origen) out.push('Sale desde '+r.origen.ciudad);
    if(r.ritmo) out.push(cap(T.ritmo[r.ritmo]||''));
    if(r.madrugar) out.push(cap(T.madrugar[r.madrugar]));
    if(r.coche) out.push(cap(T.coche[r.coche]));
    if(r.likes&&r.likes.length) out.push('Le gustaron '+r.likes.length+' planes');
    if(r.dias) out.push('Puede '+r.dias+' días');
    if(r.calor) out.push(cap(T.calor[r.calor])); if(r.nieve) out.push(cap(T.nieve[r.nieve]));
    if(r.base && Z){ var b=Z.bases.filter(function(x){return x.id===r.base;})[0]; if(b) out.push('Quería dormir en '+b.nombre); }
    return out.filter(Boolean);
  }

  /* ---------- 7b. El plan contado en corto: por qué es VUESTRO plan ---------- */
  var VERSION = 'm6';
  function relato(Z, A, plan, trip){
    var out=[], acts={}; Z.actividades.forEach(function(a){ acts[a.id]=a; });
    var nombres = (A.resps||[]).map(function(r){ return r.nombre; });
    var ori = uniq((A.origenes||[]).map(function(o){ return o.ciudad; }));
    var dEtq = plan.dias.length+' días'+(A.mes?' en '+MESES_LARGO[A.mes-1]:'');
    var fijo = (trip.destinos||[]).length===1;
    out.push((ori.length?'Salís de '+joinY(ori)+', ':'')+dEtq+(fijo?' en '+Z.corto+', como decidisteis.':': sale '+Z.corto+' porque es lo que mejor junta lo que ha pedido cada uno.'));
    var rep = reparto(Z, A, plan);
    var MOM = {atardecer:'un atardecer de postal', cena:'una mesa larga comiendo', fiesta:'una noche de bailar hasta tarde', cumbre:'llegar arriba del todo', agua:'tirarse al agua', ruinas:'ruinas de verdad'};
    function porque(w){ if(!w) return ''; return w.replace(/^su momento: /,'su momento, ').replace(/^le tira /,'le tira ').replace(/^lo marcó/,'lo marcó'); }
    rep.forEach(function(p){
      var r = (A.resps||[]).filter(function(x){ return x.nombre===p.nombre; })[0]||{};
      if(p.suyo) out.push(p.nombre+': el día '+p.suyo.dia+' es su plan, '+minus(corto(p.suyo.nombre))+(p.suyo.why?' ('+porque(p.suyo.why)+')':'')+'.');
      else if(p.mios.length) out.push(p.nombre+': le toca '+minus(corto(p.mios[0].nombre))+' el día '+p.mios[0].dia+(p.mios[0].why?' ('+porque(p.mios[0].why)+')':'')+'.');
      if(!p.suyo && !p.mios.length){ if(r.noche && r.noche===A.nocheM) out.push(p.nombre+': las noches '+({fiesta:'de salir',aperitivo:'de aperitivo',calma:'tranquilas'})[r.noche]+' van por lo que pidió.'); else if(r.ritmo && Math.abs(r.ritmo-A.ritmo)<0.6) out.push(p.nombre+': el ritmo del viaje es el suyo.'); }
      if(r.momento){ var ok=false; plan.dias.forEach(function(dd){ dd.slots.forEach(function(sl){ if(ok) return; var a=sl.ref&&acts[sl.ref]; if(r.momento==='fiesta' && sl.momento==='noche' && A.nocheM==='fiesta') ok=true; if(!a) return; if(r.momento==='atardecer' && (a.tipo==='postal'||KW.atardecer.test(txt(a)))) ok=true; if(r.momento==='cena' && a.tipo==='gastronomia') ok=true; if(r.momento==='cumbre' && (a.tipo==='naturaleza'||a.tipo==='aventura') && KW.cumbre.test(txt(a))) ok=true; if(r.momento==='agua' && (a.tipo==='playa'||a.tipo==='agua')) ok=true; if(r.momento==='ruinas' && a.tipo==='cultura') ok=true; if(r.momento==='fiesta' && (a.tipo==='fiesta'||a.tipo==='musica')) ok=true; }); }); if(!ok) out.push('Lo de '+MOM[r.momento]+' que pidió '+p.nombre+' no ha encajado en estos días: si lo veis en «Cambiar», metedlo.'); }
      if(p.falta.length) out.push(p.falta[0]);
    });
    var c=A.noche.__c||{}, n=A.n||1, nm=A.nocheM;
    if(nm && n>1) out.push('Noches '+({fiesta:'de salir',aperitivo:'de aperitivo',calma:'tranquilas'})[nm]+' ('+(c[nm]||0)+' de '+n+') y ritmo '+(A.ritmo>=2.5?'a tope':(A.ritmo<1.6?'tranquilo':'equilibrado'))+(A.madrugar==='no'?', sin madrugones':'')+'.');
    if(A.dieta){ var d=[]; if(A.dieta.vegetariano) d.push(joinY(A.dieta.vegetariano)+' no come carne'); if(A.dieta.sin_gluten) d.push(joinY(A.dieta.sin_gluten)+' va sin gluten'); if(A.dieta.sin_pescado) d.push(joinY(A.dieta.sin_pescado)+' no come pescado'); if(A.dieta.sin_alcohol) d.push(joinY(A.dieta.sin_alcohol)+' no bebe'); if(d.length) out.push('Las comidas tienen en cuenta que '+joinY(d)+'.'); }
    var caps=(A.resps||[]).filter(function(r){ return r.capricho==='barco'||r.capricho==='experiencia'; });
    var capH={}; caps.forEach(function(r){ var hit=null; plan.dias.forEach(function(dd){ dd.slots.forEach(function(sl){ if(hit || !sl.ref || !acts[sl.ref]) return; var a=acts[sl.ref]; if((r.capricho==='barco' && KW.barco.test(txt(a))) || (r.capricho==='experiencia' && a.reserva && (COSTE_N[a.coste]||1)>=2)) hit={n:dd.n, nombre:sl.nombre}; }); }); if(hit){ var kk=hit.n+'|'+hit.nombre; (capH[kk]=capH[kk]||{h:hit, q:[]}).q.push(r.nombre); } });
    Object.keys(capH).forEach(function(kk){ var x=capH[kk]; out.push('El capricho de '+joinY(x.q)+': '+minus(corto(x.h.nombre))+', el día '+x.h.n+'.'); });
    var oc = plan.dias.filter(function(dd){ return dd.slots.some(function(sl){ return /^Noche (de|del) /.test(sl.nombre); }); })[0];
    if(oc) out.push('La noche grande es la del día '+oc.n+'.');
    return out;
  }
  function paraDia(Z, A, d){ var acts={}; Z.actividades.forEach(function(a){ acts[a.id]=a; }); var q={}; d.slots.forEach(function(sl){ if(sl.de) q[sl.de]=3; if(sl.ref && acts[sl.ref]) (A.resps||[]).forEach(function(r){ if(encaje(acts[sl.ref], r).s>=3) q[r.nombre]=(q[r.nombre]||0)+1; }); }); return Object.keys(q).sort(function(a,b){ return q[b]-q[a]; }); }

  /* ---------- 7. Lo de cada uno y frase del viaje ---------- */
  function corto(n){ return String(n||'').split(/[:(]/)[0].replace(/\s+y\s+.*$/,'').trim(); }
  function reparto(Z, A, plan){
    var acts={}; Z.actividades.forEach(function(a){ acts[a.id]=a; });
    return (A.resps||[]).map(function(r){
      var mios=[], suyo=null;
      plan.dias.forEach(function(d){ d.slots.forEach(function(sl){ if(!sl.ref||!acts[sl.ref]) return; var e=encaje(acts[sl.ref], r); if(sl.de===r.nombre) suyo={nombre:sl.nombre, dia:d.n, why:e.why}; else if(e.s>=2.6) mios.push({nombre:sl.nombre, dia:d.n, s:e.s, why:e.why}); }); });
      mios.sort(function(x,y){ return y.s-x.s; });
      var falta=[], p=Z.perfil||{};
      (r.paisaje||[]).forEach(function(k){ if((p[k]||0)<=1){ var c=(A.paisaje.__c||{}); var ganador=Object.keys(ETQ_PAISAJE).filter(function(x){ return (c[x]||0)>0 && (p[x]||0)>=2; }).sort(function(x,y){ return (c[y]||0)-(c[x]||0); })[0]; falta.push('Querías '+ETQ_PAISAJE[k]+(ganador?', pero ganó '+ETQ_PAISAJE[ganador]+' ('+c[ganador]+' de '+A.n+')':'')+'.'); } });
      if(r.nieve==='si' && !Z.nieve) falta.push('Querías nieve y aquí no hay: ganó lo que pedía el resto.');
      if(r.nieveAct && Z.nieve && !mios.concat(suyo?[suyo]:[]).some(function(m){ return /esqu|raquet|trineo|slitt|terme|spa/i.test(m.nombre); })) falta.push('Lo de la nieve que pediste no ha entrado en el día a día: cámbialo desde «Cambiar».');
      if(r.noche==='fiesta' && A.nocheM==='calma') falta.push('Tú querías salir y la mayoría, noches tranquilas: tenéis una noche de bares por si os animáis.');
      if(r.ritmo===3 && A.ritmo<1.8) falta.push('Vas a tope y el grupo, tranqui: en «Cambiar» puedes añadir planes a las tardes libres.');
      return {nombre:r.nombre, suyo:suyo, mios:mios.slice(0,3), falta:falta.slice(0,2), total:mios.length+(suyo?1:0)};
    });
  }
  var COMUNES = /^(raquetas|esqui|playa|ruta|rutas|paseo|mercado|mercados|subir|trineo|termas|cena|aperitivo|barco|excursion|senderos|sendero|visita|tour|cata|bano|banos|atardecer|noche|tarde|dia|ferry|kayak|snorkel|bici|tren|degustacion|ruinas|iglesias|castillo|lago|cascadas|cuevas|grutas|calas|cala|isla|islas|street|vuelta|merienda|repetimos)$/;
  function minus(t){ var w=norm(t.split(' ')[0]); return COMUNES.test(w) ? t.charAt(0).toLowerCase()+t.slice(1) : t; }
  function frasePlan(Z, plan){
    var trozos=[], vistos={};
    function mete(t){ t=corto(t); if(trozos.length) t=minus(t); if(!t || t.length>34 || vistos[norm(t)]) return; vistos[norm(t)]=1; trozos.push(t); }
    plan.dias.forEach(function(d){ if(d.n===1||d.n===plan.dias.length) return; var sl=d.slots.filter(function(x){ return x.k==='act'; })[0]; if(sl) mete(sl.nombre); });
    var com = []; plan.dias.forEach(function(d){ d.slots.forEach(function(x){ if(x.k==='comida') com.push(x.nombre); }); });
    var noc = []; plan.dias.forEach(function(d){ d.slots.forEach(function(x){ if(x.k==='noche') noc.push(x.nombre); }); });
    var out = trozos.slice(0,2);
    var cc = com.map(function(x){ return corto(x).toLowerCase(); }).filter(function(x){ return x.length<=28; })[0]; if(cc) out.push(cc);
    if(out.length<3 && noc.length){ var n=corto(noc[0].replace(/^Noche [^·]*· /,'')); if(n.length<=26 && !/^(salir|aperitivo|paseo|cena|noche)/i.test(n)) out.push('noches en '+n); }
    if(!out.length) return Z.lema||'';
    return out.length===1 ? out[0] : out.slice(0,-1).join(', ')+' y '+out[out.length-1];
  }

  return {_enTemporada:enTemporada, _alcanzable:alcanzable, _KW:KW, _txt:txt, _km:km, _geo:geo, _elegirBase:elegirBase, _joinY:joinY, _corto:corto,
    normalizar:normalizar, agregar:agregar, elegirDestino:elegirDestino, puntuarZona:puntuarZona, construirPlan:construirPlan, cronograma:cronograma, alternativas:alternativas, km:km, _pt:pt,
    identidad:identidad, reservas:reservas, opinion:opinion, reparto:reparto, frasePlan:frasePlan, relato:relato, paraDia:paraDia, VERSION:VERSION, encaje:encaje, fans:fans, slug:slug, norm:norm, maps:maps, estacion:estacion, diasEntre:diasEntre, iso:iso, hash:hash, ETQ_INT:ETQ_INT, ETQ_PAISAJE:ETQ_PAISAJE, proximoMes:proximoMes};
})();

;
/* ============================================================================
   ZAINO · MOTOR DE COMPATIBILIDAD v5
   - Restricciones duras comprobadas por código (presupuesto máximo, temporada, coche,
     lo que cada uno marca como imprescindible, fechas).
   - Satisfacción por persona (0-100) con fórmula explicable:
       S(p,z) = 100 · Σ_d w_p[d]·oferta_z[d] / Σ_d w_p[d]  · clima(p,z)  + gustos del deslizador
     w_p[d] = peso que cada persona da a cada dimensión (3 = prioridad, 1-2 = le gusta)
     oferta_z[d] = 0,4·perfil de la zona (0-3)/3 + 0,6·min(actividades reales en temporada/4, 1)
   - Compatibilidad del grupo: G = 0,6·media(S) + 0,4·mínimo(S), ajustada por temporada y logística.
   - Tres propuestas: mejor equilibrio, la más barata que siga encajando, y una sorpresa.
   Se usa igual en el servidor (Supabase) y en el modo local.
   ============================================================================ */
var COMPAT = (function(){
  'use strict';
  var DIMS = ['playa','naturaleza','montana','ciudad','cultura','gastronomia','fiesta','aventura','relax','postal'];
  var ETQ = {playa:'playa', naturaleza:'naturaleza', montana:'montaña', ciudad:'ciudad', cultura:'cultura e historia', gastronomia:'comer bien', fiesta:'fiesta', aventura:'aventura', relax:'relax', postal:'sitios de postal'};
  var MOM = {atardecer:'postal', cena:'gastronomia', fiesta:'fiesta', cumbre:'montana', agua:'playa', ruinas:'cultura'};
  var INT2DIM = {cultura:'cultura', gastronomia:'gastronomia', naturaleza:'naturaleza', playa:'playa', aventura:'aventura', postal:'postal', compras:'ciudad', agua:'playa', fiesta:'fiesta'};
  function r1(x){ return Math.round(x*10)/10; }
  function clamp(x,a,b){ return Math.max(a, Math.min(b, x)); }

  /* ---------- 1. Qué quiere cada persona ---------- */
  function perfilPersona(r){
    var w={}; DIMS.forEach(function(d){ w[d]=0; });
    function sube(d, v){ if(d && w[d]!==undefined) w[d]=Math.max(w[d], v); }
    function suma(d, v){ if(d && w[d]!==undefined) w[d]=Math.min(3, w[d]+v); }
    (r.paisaje||[]).forEach(function(p){
      if(p==='mar') sube('playa',2);
      if(p==='montana'){ sube('montana',2); sube('naturaleza',1); }
      if(p==='ciudad'){ sube('ciudad',2); sube('cultura',1); }
      if(p==='campo'){ sube('naturaleza',1.5); sube('gastronomia',1); sube('relax',1); }
    });
    (r.intereses||[]).forEach(function(k){ sube(INT2DIM[k], 2); });
    if(r.noche==='fiesta') sube('fiesta',2); else if(r.noche==='aperitivo'){ suma('gastronomia',0.5); sube('fiesta',0.5); } else if(r.noche==='calma') sube('relax',1.5);
    if(r.momento && MOM[r.momento]) suma(MOM[r.momento], 1);
    if(r.duelo1==='amanecer'){ suma('montana',0.5); suma('aventura',0.5); } else if(r.duelo1==='ultimo_bar') suma('fiesta',1);
    if(r.duelo2==='museo') suma('cultura',1); else if(r.duelo2==='mercado'){ suma('gastronomia',1); suma('ciudad',0.5); }
    if(r.nieveAct==='relax') suma('relax',1); else if(r.nieveAct) { suma('aventura',0.5); suma('montana',1); }
    if(r.capricho==='barco') suma('playa',0.5);
    (r.prioridades||[]).forEach(function(d){ if(w[d]!==undefined) w[d]=3; });
    var tot=0; DIMS.forEach(function(d){ tot+=w[d]; });
    if(!tot) DIMS.forEach(function(d){ w[d]=1; });
    var imp={}; DIMS.forEach(function(d){ imp[d] = w[d]>=2.5 ? 'importante' : (w[d]>0 ? 'flexible' : null); });
    return { w:w, imp:imp, noNeg: (r.innegociable && w[r.innegociable]!==undefined) ? r.innegociable : null,
      clima: r.clima || (r.calor==='fresco' ? 'fresco' : (r.calor==='playa' ? 'calor' : null)),
      rechazaFiesta: r.noche==='calma' };
  }

  /* ---------- 2. Qué ofrece cada zona en ese mes ---------- */
  function ofertaZona(Z, A){
    var p=Z.perfil||{}, n={}; DIMS.forEach(function(d){ n[d]=0; });
    var KW=ENG._KW;
    Z.actividades.forEach(function(a){
      if(!ENG._enTemporada(a, A) || (a.coche && !A.tieneCoche)) return;
      var t=ENG._txt(a), dims=[];
      if(a.tipo==='playa'||a.tipo==='agua') dims.push('playa');
      if(a.tipo==='naturaleza'){ dims.push('naturaleza'); if(KW.cumbre.test(t) || (p.montana||0)>=2) dims.push('montana'); }
      if(a.tipo==='aventura'){ dims.push('aventura'); if(KW.cumbre.test(t)||KW.esqui.test(t)) dims.push('montana'); }
      if(a.tipo==='cultura') dims.push('cultura');
      if(a.tipo==='gastronomia') dims.push('gastronomia');
      if(a.tipo==='compras') dims.push('ciudad');
      if(a.tipo==='fiesta'||a.tipo==='musica') dims.push('fiesta');
      if(a.tipo==='bienestar') dims.push('relax');
      if(a.tipo==='postal') dims.push('postal');
      dims.forEach(function(d){ n[d]+=1; });
      (a.tipos||[]).forEach(function(tt){ var d=INT2DIM[tt]; if(d && dims.indexOf(d)<0) n[d]+=0.5; });
    });
    (Z.noche||[]).forEach(function(x){ if(x.plan==='fiesta'||x.plan==='copas') n.fiesta+=0.5; });
    n.gastronomia += Math.min(2, (Z.comida||[]).length/4);
    var perfil = {playa:Math.max(p.playa||0,p.mar||0), naturaleza:p.naturaleza||0, montana:p.montana||0, ciudad:p.ciudad||0, cultura:p.cultura||0,
      gastronomia:p.gastronomia||0, fiesta:p.fiesta||0, aventura:p.aventura||0, relax:p.calma||0, postal:p.postal||0};
    var s={}, invierno = ENG.estacion(A.mes)==='invierno';
    DIMS.forEach(function(d){ s[d] = 0.4*(perfil[d]/3) + 0.6*Math.min(n[d]/4, 1); });
    if(invierno) s.playa *= 0.3;
    return {s:s, n:n};
  }

  /* ---------- 3. Clima: lo que pide cada uno frente a lo que hace allí ese mes ---------- */
  function claseClima(Z, mes){ var e=ENG.estacion(mes); if(e==='verano') return Z.calor||'alto'; if(e==='invierno') return Z.nieve?'nieve':'frio'; return 'templado'; }
  var CLIMA = { calor:{extremo:1, alto:1, suave:0.9, templado:0.92, frio:0.75, nieve:0.7},
                templado:{extremo:0.8, alto:0.93, suave:1, templado:1, frio:0.92, nieve:0.9},
                fresco:{extremo:0.7, alto:0.85, suave:1, templado:1, frio:1, nieve:1} };
  function factorClima(pp, r, Z, mes){
    var c = claseClima(Z, mes), f = 1;
    if(pp.clima && CLIMA[pp.clima]) f = CLIMA[pp.clima][c] || 1;
    if(ENG.estacion(mes)==='invierno' && r.nieve){ if(r.nieve==='si') f *= Z.nieve ? 1 : 0.85; else if(r.nieve==='no' && Z.nieve) f *= 0.92; }
    return {f:f, clase:c};
  }

  /* ---------- 4. Coste orientativo por persona (sin vuelos), solo con datos de la biblioteca ---------- */
  function costeZona(Z, A){
    var c = Z.costes && Z.costes.datos ? Z.costes.datos : null, N = Math.max(1, A.dias||4), noches = Math.max(1, N-1);
    var r = {min:null, max:null, partes:[], desconocido:['viaje de ida y vuelta (mira los enlaces de vuelos y trenes)'], calidad:'orientativo', fuentes:[], fecha: Z.costes && Z.costes.fecha_consulta || null};
    if(!c){ r.desconocido.push('alojamiento, comida y transporte local (aún no hay datos de esta zona)'); r.calidad='desconocido'; return r; }
    var pref = A.dormirM || 'piso', al = null, etiqueta='';
    if(pref==='hostel' && c.hostel_noche){ al=[c.hostel_noche.min, c.hostel_noche.max]; etiqueta='cama en hostel'; r.fuentes.push(c.hostel_noche.fuente); }
    else if(c.doble_noche){ al=[c.doble_noche.min/2, c.doble_noche.max/2]; etiqueta='media habitación doble'; r.fuentes.push(c.doble_noche.fuente); }
    else if(c.hostel_noche){ al=[c.hostel_noche.min, c.hostel_noche.max]; etiqueta='cama en hostel'; r.fuentes.push(c.hostel_noche.fuente); }
    var min=0, max=0, falta=false;
    if(al){ min+=al[0]*noches; max+=al[1]*noches; r.partes.push({que:noches+' noches ('+etiqueta+')', min:Math.round(al[0]*noches), max:Math.round(al[1]*noches)}); }
    else { falta=true; r.desconocido.push('alojamiento'); }
    if(c.comida_barata && c.comida_barata.valor){ var cm=c.comida_barata.valor*2*N; min+=cm; max+=cm; r.partes.push({que:'dos comidas baratas al día', min:Math.round(cm), max:Math.round(cm)}); r.fuentes.push(c.comida_barata.fuente); }
    else { falta=true; r.desconocido.push('comida'); }
    if(!A.tieneCoche || Z.coche.necesidad==='innecesario'){
      if(c.transporte_billete && c.transporte_billete.valor){ var tr=c.transporte_billete.valor*2*N; min+=tr; max+=tr; r.partes.push({que:'dos billetes de transporte urbano al día', min:Math.round(tr), max:Math.round(tr)}); r.fuentes.push(c.transporte_billete.fuente); }
      else r.desconocido.push('transporte local');
    } else r.desconocido.push('coche de alquiler y gasolina');
    r.desconocido.push('entradas y actividades de pago');
    r.fuentes = r.fuentes.filter(Boolean).filter(function(x,i,a){ return a.indexOf(x)===i; });
    if(falta){ r.calidad='desconocido'; r.parcial = {min:Math.round(min), max:Math.round(max)}; return r; } // sin alojamiento o comida no damos total: sería engañoso
    r.min = Math.round(min); r.max = Math.round(max);
    r.fuentes = r.fuentes.filter(Boolean).filter(function(x,i,a){ return a.indexOf(x)===i; });
    return r;
  }

  /* ---------- 5. Fechas: ventana común del grupo ---------- */
  function fechasGrupo(trip, R){
    var f = trip.fechas||{}, out = {ok:true, problemas:[], mes:0, modo:f.modo||'abierto'};
    if(f.modo==='fijas' || f.modo==='mes'){
      // la respuesta de fechas es privada: el grupo sabe cuántos no pueden, no quiénes
      var nNo = R.filter(function(r){ return r.fechasOk==='no'; }).length, nJusto = R.filter(function(r){ return r.fechasOk==='justo'; }).length;
      out.nNo = nNo; out.nJusto = nJusto;
      if(nNo){ out.ok=false; out.problemas.push((nNo>1 ? nNo+' personas del grupo no pueden' : 'Una persona del grupo no puede')+' en las fechas del viaje. Hablad de mover las fechas antes de reservar nada.'); }
      else if(nJusto) out.problemas.push((nJusto>1 ? nJusto+' personas van' : 'Alguien va')+' muy justo de fechas: mejor no alargar el viaje.');
      return out;
    }
    var conMeses = R.filter(function(r){ return (r.meses||[]).length; });
    if(!conMeses.length) return out;
    var cuenta={}; conMeses.forEach(function(r){ r.meses.forEach(function(m){ cuenta[m]=(cuenta[m]||0)+1; }); });
    var todos = Object.keys(cuenta).filter(function(m){ return cuenta[m]===conMeses.length; }).map(Number);
    if(todos.length){ out.mes = todos.sort(function(a,b){ return ENG.proximoMes(a)-ENG.proximoMes(b); })[0]; out.comunes = todos; return out; }
    var mejor = Object.keys(cuenta).map(Number).sort(function(a,b){ return cuenta[b]-cuenta[a] || ENG.proximoMes(a)-ENG.proximoMes(b); })[0];
    out.ok=false; out.mes=mejor;
    out.nNo = conMeses.length-cuenta[mejor];
    out.problemas.push('No hay ningún mes que os vaya bien a todos. El que más encaja es '+MESES_LARGO[mejor-1]+', pero '+(out.nNo===1?'una persona no puede':out.nNo+' personas no pueden')+'.');
    return out;
  }

  /* ---------- 6. Evaluar una zona para el grupo ---------- */
  function evaluar(Z, A, R, priv, trip){
    var of = ofertaZona(Z, A), motivos = [], porPersona = [];
    // restricciones duras
    if(Z.coche.necesidad==='imprescindible' && !A.tieneCoche) motivos.push('Hace falta coche y nadie del grupo conduce');
    if(A.mes && Z.meses && (Z.meses.evitar||[]).indexOf(A.mes)>-1) motivos.push('En '+MESES_LARGO[A.mes-1]+' es mala época para ir');
    var coste = costeZona(Z, A), fueraPres = 0, sinComprobar = 0, porEncimaIdeal = 0;
    R.forEach(function(r){ var pv = priv[r.miembro]||{};
      if(pv.presMax){ if(coste.min!=null){ if(coste.min > pv.presMax) fueraPres++; else if(pv.presIdeal && coste.min > pv.presIdeal) porEncimaIdeal++; } else sinComprobar++; } });
    if(fueraPres) motivos.push('Supera el presupuesto máximo de '+fueraPres+(fueraPres>1?' personas':' persona')+' (solo alojamiento, comida y transporte local, sin el viaje)');
    var perfiles = {};
    R.forEach(function(r){
      var pp = perfilPersona(r); perfiles[r.miembro]=pp;
      if(pp.noNeg && of.s[pp.noNeg] < 0.45) motivos.push('Casi no tiene '+ETQ[pp.noNeg]+', que '+r.nombre+' marcó como imprescindible');
      var num=0, den=0, cumple=[], cede=[];
      DIMS.forEach(function(d){ var w=pp.w[d]; if(!w) return; num+=w*of.s[d]; den+=w; if(w>=2 && of.s[d]>=0.6) cumple.push(d); if(w>=2 && of.s[d]<0.4) cede.push(d); });
      var base = den ? num/den : 0.5, cl = factorClima(pp, r, Z, A.mes);
      var gustos = 0, likes = (r.likes||[]).filter(function(id){ return Z.actividades.some(function(a){ return a.id===id; }); }).length;
      gustos += Math.min(12, likes*4); if(r.likesZ && r.likesZ[Z.id]) gustos += Math.min(8, r.likesZ[Z.id]*2);
      var S = clamp(Math.round(100*base*cl.f + gustos), 0, 100);
      porPersona.push({id:r.miembro, nombre:r.nombre, pct:S, base:Math.round(100*base), clima:r1(cl.f), gustos:gustos, cumple:cumple, cede:cede});
    });
    var pcts = porPersona.map(function(p){ return p.pct; });
    var media = pcts.length ? pcts.reduce(function(a,b){return a+b;},0)/pcts.length : 0, minimo = pcts.length ? Math.min.apply(null,pcts) : 0;
    var G = 0.6*media + 0.4*minimo, ajustes = [];
    if(A.mes && Z.meses){ if((Z.meses.ideales||[]).indexOf(A.mes)>-1){ G*=1.04; ajustes.push({que:MESES_LARGO[A.mes-1]+' es de sus mejores meses', v:'+4%'}); }
      else if((Z.meses.aceptables||[]).indexOf(A.mes)<0 && (Z.meses.ideales||[]).length){ G*=0.95; ajustes.push({que:'no es su mejor época', v:'−5%'}); } }
    var es = A.origenes.filter(function(o){ return o.pais==='es'; });
    if(es.length && Z.rutas && Z.rutas.length){ var conR = es.filter(function(o){ return Z.rutas.some(function(x){ return x.origen_iata===o.iata; }); }); if(conR.length){ var b=2*conR.length/es.length; G+=b; ajustes.push({que:'vuelo directo desde '+ENG._joinY(conR.map(function(o){ return o.ciudad; }).filter(function(x,i,a){ return a.indexOf(x)===i; })), v:'+'+r1(b)}); } }
    var isla = Z.id==='sicilia'||Z.id==='cerdena';
    if(isla && A.dias<=3){ G-=5; ajustes.push({que:'isla para pocos días: mucho trayecto', v:'−5'}); }
    if(porEncimaIdeal) ajustes.push({que:'para '+porEncimaIdeal+(porEncimaIdeal>1?' personas':' persona')+' va por encima de lo que le gustaría gastar', v:'ya contado'});
    G = clamp(Math.round(G), 0, 100);
    return {zona:Z.id, valido:!motivos.length, motivos:motivos, compat:G, media:Math.round(media), minimo:minimo, ajustes:ajustes, porPersona:porPersona, oferta:of, coste:coste, sinComprobar:sinComprobar, perfiles:perfiles};
  }

  /* ---------- 7. Análisis del grupo (independiente del destino) ---------- */
  function analizarGrupo(R, priv){
    var n=R.length, out={coincidencias:[], diferencias:[], incompatibles:[], limitantes:[]}; if(!n) return out;
    var pps = R.map(function(r){ return {r:r, pp:perfilPersona(r)}; });
    DIMS.forEach(function(d){
      var si = pps.filter(function(x){ return x.pp.w[d]>=2; }).map(function(x){ return x.r.nombre; });
      var no = pps.filter(function(x){ return !x.pp.w[d]; }).map(function(x){ return x.r.nombre; });
      if(n>1 && si.length>=Math.max(2, Math.ceil(n*0.6))) out.coincidencias.push({dim:d, quien:si, texto:(si.length===n?'Todos':si.length+' de '+n)+' queréis '+ETQ[d]});
      else if(si.length && no.length && si.length<n) out.diferencias.push({dim:d, si:si, no:no, texto:ETQ[d].charAt(0).toUpperCase()+ETQ[d].slice(1)+': lo quiere'+(si.length>1?'n ':' ')+ENG._joinY(si)+'; a '+ENG._joinY(no)+' no le'+(no.length>1?'s':'')+' tira'});
    });
    var fiesta = R.filter(function(r){ return r.noche==='fiesta'; }).map(function(r){ return r.nombre; }), calma = R.filter(function(r){ return r.noche==='calma'; }).map(function(r){ return r.nombre; });
    if(fiesta.length && calma.length) out.incompatibles.push({tipo:'noche', texto:ENG._joinY(fiesta)+' quiere'+(fiesta.length>1?'n':'')+' salir de fiesta y '+ENG._joinY(calma)+' prefiere'+(calma.length>1?'n':'')+' noches tranquilas', compromiso:'Un destino con zona de bares y planes de día tranquilos: la noche se reparte (unas noches de salir, otras de cena larga).'});
    var calor = R.filter(function(r){ return r.clima==='calor'; }).map(function(r){ return r.nombre; }), fresco = R.filter(function(r){ return r.clima==='fresco'; }).map(function(r){ return r.nombre; });
    if(calor.length && fresco.length) out.incompatibles.push({tipo:'clima', texto:ENG._joinY(calor)+' busca'+(calor.length>1?'n':'')+' calor y '+ENG._joinY(fresco)+' lo pasa'+(fresco.length>1?'n':'')+' mal con él', compromiso:'Mejor costa con brisa o montaña media que una ciudad del interior en pleno verano.'});
    var r3 = R.filter(function(r){ return +r.ritmo===3; }).map(function(r){ return r.nombre; }), r1_ = R.filter(function(r){ return +r.ritmo===1; }).map(function(r){ return r.nombre; });
    if(r3.length && r1_.length) out.incompatibles.push({tipo:'ritmo', texto:ENG._joinY(r3)+' va'+(r3.length>1?'n':'')+' a tope y '+ENG._joinY(r1_)+' quiere'+(r1_.length>1?'n':'')+' ir tranquilo', compromiso:'Un plan fuerte al día y la tarde libre: quien quiera más, tiene sugerencias en «Cambiar».'});
    var nieveSi = R.filter(function(r){ return r.nieve==='si'; }).map(function(r){ return r.nombre; }), nieveNo = R.filter(function(r){ return r.nieve==='no'; }).map(function(r){ return r.nombre; });
    if(nieveSi.length && nieveNo.length) out.incompatibles.push({tipo:'nieve', texto:ENG._joinY(nieveSi)+' quiere'+(nieveSi.length>1?'n':'')+' nieve y '+ENG._joinY(nieveNo)+' no', compromiso:'Una zona de montaña con pueblo o ciudad a mano (termas, mercados) para quien no esquíe.'});
    var maxs = R.map(function(r){ return (priv[r.miembro]||{}).presMax; }).filter(function(x){ return x>0; }).sort(function(a,b){ return a-b; });
    if(maxs.length>=2){ var med = maxs[Math.floor(maxs.length/2)]; if(maxs[0] < med*0.6) out.limitantes.push({tipo:'presupuesto', texto:'Hay bastante diferencia de presupuesto en el grupo: el más ajustado marca el techo (no decimos de quién es).'}); }
    R.forEach(function(r){ if(r.innegociable) out.limitantes.push({tipo:'innegociable', quien:r.nombre, dim:r.innegociable, texto:r.nombre+' no va sin '+ETQ[r.innegociable]+'.'}); });
    return out;
  }

  /* ---------- 8. Las tres propuestas ---------- */
  function recomendar(ZS, trip, R, priv){
    priv = priv||{};
    var Rf = R.map(function(r){ return Object.assign({}, r, priv[r.miembro]||{}); });
    var fechas = fechasGrupo(trip, Rf);
    var A = ENG.agregar(Object.assign({}, trip, fechas.mes && !(trip.fechas&&trip.fechas.mes) && !(trip.fechas&&trip.fechas.modo==='fijas') ? {fechas:{modo:'mes', mes:fechas.mes}} : {}), Rf);
    var fijados = (trip.destinos||[]).filter(function(id){ return ZS.some(function(z){ return z.id===id; }); });
    var cand = fijados.length ? ZS.filter(function(z){ return fijados.indexOf(z.id)>-1; }) : ZS;
    var ev = cand.map(function(Z){ return evaluar(Z, A, R, priv, trip); });
    var validos = ev.filter(function(e){ return e.valido; }).sort(function(a,b){ return b.compat-a.compat || (a.zona<b.zona?-1:1); });
    var descartados = ev.filter(function(e){ return !e.valido; }).map(function(e){ return {zona:e.zona, motivos:e.motivos, compat:e.compat}; });
    var ZM={}; ZS.forEach(function(z){ ZM[z.id]=z; });
    var props = [];
    if(fijados.length===1){
      var e1 = ev[0]; props.push(ficha('fijo', e1, ZM[e1.zona], A, R));
    } else if(validos.length){
      var best = validos[0]; props.push(ficha('best', best, ZM[best.zona], A, R));
      var conCoste = validos.filter(function(e){ return e.zona!==best.zona && e.compat >= best.compat*0.8; });
      var budget = conCoste.filter(function(e){ return e.coste.min!=null; }).sort(function(a,b){ return a.coste.min-b.coste.min || b.compat-a.compat; })[0]
        || conCoste.sort(function(a,b){ return precioN(ZM[a.zona])-precioN(ZM[b.zona]) || b.compat-a.compat; })[0];
      if(budget && best.coste.min!=null && budget.coste.min!=null && budget.coste.min >= best.coste.min) budget = null; // si no es más barato, no tiene sentido
      if(budget) props.push(ficha('budget', budget, ZM[budget.zona], A, R));
      // sorpresa: buen encaje, pero un tipo de viaje distinto al que saldría por perfil
      var gw = sumaPesos(R), usados = props.map(function(p){ return p.zona; });
      var porPerfil = validos.slice().sort(function(a,b){ return coseno(gw, b.oferta.s)-coseno(gw, a.oferta.s); }).map(function(e){ return e.zona; });
      var wild = validos.filter(function(e){ return usados.indexOf(e.zona)<0 && e.compat >= best.compat*0.7; })
        .map(function(e){ return {e:e, v:e.compat*(0.5+0.5*porPerfil.indexOf(e.zona)/Math.max(1,porPerfil.length-1))}; })
        .sort(function(a,b){ return b.v-a.v; })[0];
      if(wild) props.push(ficha('wildcard', wild.e, ZM[wild.e.zona], A, R));
    }
    var n = (trip.integrantes||[]).length, hechos = R.length;
    return {
      version:'c5', generado:Date.now(), provisional: hechos < n, respondidos:R.map(function(r){ return r.miembro; }), n_total:n,
      mes:A.mes, dias:A.dias, presTier:A.presTier, tieneCoche:A.tieneCoche, fechas:fechas,
      grupo:analizarGrupo(R, priv), propuestas:props,
      ranking: validos.slice(0,8).map(function(e){ return {zona:e.zona, compat:e.compat}; }),
      descartados: descartados.slice(0,12),
      sinComprobarPresupuesto: validos.some(function(e){ return e.sinComprobar; })
    };
  }
  function precioN(Z){ return ({bajo:1, medio:2, alto:3})[Z.precio]||2; }
  function sumaPesos(R){ var g={}; DIMS.forEach(function(d){ g[d]=0; }); R.forEach(function(r){ var w=perfilPersona(r).w; DIMS.forEach(function(d){ g[d]+=w[d]; }); }); return g; }
  function coseno(a, b){ var ab=0, aa=0, bb=0; DIMS.forEach(function(d){ ab+=a[d]*b[d]; aa+=a[d]*a[d]; bb+=b[d]*b[d]; }); return aa&&bb ? ab/Math.sqrt(aa*bb) : 0; }

  /* ---------- 9. La ficha de cada propuesta: todo explicado ---------- */
  function ficha(tipo, e, Z, A, R){
    var ofs = e.oferta.s, fuertes = DIMS.filter(function(d){ return ofs[d]>=0.65; }).sort(function(a,b){ return ofs[b]-ofs[a]; }).slice(0,4);
    var flojos = DIMS.filter(function(d){ return ofs[d]<0.3; });
    var pros=[], contras=[], compromisos=[], dudas=[];
    fuertes.forEach(function(d){ pros.push('Fuerte en '+ETQ[d]); });
    (e.ajustes||[]).forEach(function(a){ if(/^\+/.test(a.v)) pros.push(a.que.charAt(0).toUpperCase()+a.que.slice(1)); else if(/^−/.test(a.v)) contras.push(a.que.charAt(0).toUpperCase()+a.que.slice(1)); });
    if(Z.coche.necesidad==='imprescindible') contras.push('Sin coche se queda corta'); else if(Z.coche.necesidad==='innecesario') pros.push('Se mueve bien sin coche');
    (Z.notas||[]).slice(0,2).forEach(function(n){ contras.push(n); });
    e.porPersona.forEach(function(p){
      if(p.cede.length) compromisos.push(p.nombre+' cede en '+ENG._joinY(p.cede.map(function(d){ return ETQ[d]; }))+(p.cumple.length?', a cambio de '+ENG._joinY(p.cumple.map(function(d){ return ETQ[d]; })):''));
      if(p.pct < e.compat-15) dudas.push('A '+p.nombre+' le encaja menos ('+p.pct+'%)'+(p.cede.length?': '+ENG._joinY(p.cede.map(function(d){ return ETQ[d]; }))+' flojea aquí':''));
      if(p.clima < 0.9) dudas.push('A '+p.nombre+' puede no gustarle el clima de esa época');
    });
    // si nadie cede en lo que más le importa, el compromiso está en las diferencias del grupo (noche, ritmo, clima…)
    if(!compromisos.length) (analizarGrupo(R, {}).incompatibles||[]).forEach(function(i){ if(i.compromiso) compromisos.push(i.compromiso); });
    // actividades que unen a varios
    var acts = Z.actividades.filter(function(a){ return ENG._enTemporada(a, A) && !(a.coche && !A.tieneCoche); }).map(function(a){
      var f = ENG.fans(a, A); return {id:a.id, nombre:a.nombre, fans:f.map(function(x){ return x.n; }), n:f.length, tipo:a.tipo};
    }).filter(function(x){ return x.n; }).sort(function(a,b){ return b.n-a.n; }).slice(0,6);
    var titulos = {best:'El mejor equilibrio', budget:e.coste.min==null || e.coste.max==null ? 'Otra opción con buen encaje' : 'La estimación más baja', wildcard:'La sorpresa', fijo:'Vuestro destino'};
    var porque = tipo==='best' ? 'Es el que mejor reparte lo que pedís: '+e.compat+'% de compatibilidad, y a nadie le baja del '+e.minimo+'%.'
      : tipo==='budget' ? (e.coste.min!=null ? 'Sale desde unos '+e.coste.min+' € por persona sin el viaje, y sigue encajando un '+e.compat+'%.' : 'Os encaja un '+e.compat+'%. Aún faltan datos para comparar el coste con el resto.')
      : tipo==='wildcard' ? 'No es lo primero que pensaríais, pero tiene '+ENG._joinY(fuertes.slice(0,2).map(function(d){ return ETQ[d]; }))+' y os encaja un '+e.compat+'%.'
      : 'Lo decidisteis al crear el viaje: os encaja un '+e.compat+'%.';
    return {tipo:tipo, titulo:titulos[tipo], zona:e.zona, nombre:Z.corto, lema:Z.lema, descripcion:Z.descripcion||'', compat:e.compat, media:e.media, minimo:e.minimo,
      formula:'0,6 × media ('+e.media+') + 0,4 × el que menos ('+e.minimo+')'+(e.ajustes.length?' + ajustes':''),
      ajustes:e.ajustes, porque:porque, porPersona:e.porPersona, coste:e.coste, actividades:acts,
      satisface: fuertes.map(function(d){ return ETQ[d]; }), pros:pros.slice(0,5), contras:contras.slice(0,4), compromisos:compromisos.slice(0,4), dudas:dudas.slice(0,4),
      flojos: flojos.map(function(d){ return ETQ[d]; }),
      info:{ aeropuertos:(Z.aeropuertos||[]).map(function(a){ return a.ciudad+' ('+a.iata+')'; }), coche:Z.coche.necesidad, valido:e.valido, motivos:e.motivos } };
  }

  return {DIMS:DIMS, ETQ:ETQ, perfilPersona:perfilPersona, ofertaZona:ofertaZona, costeZona:costeZona, fechasGrupo:fechasGrupo, evaluar:evaluar, analizarGrupo:analizarGrupo, recomendar:recomendar};
})();

;
/* ============================================================================
   ZAINO · lógica de servidor (la misma en Supabase y en el modo local)
   Recibe TODO lo del viaje (incluidas las respuestas privadas) y devuelve solo lo que
   puede ver el grupo: resultados agregados y el plan. Nunca devuelve presupuestos.
   ============================================================================ */
var SERVIDOR = (function(){
  'use strict';
  function unir(pub, priv){ // respuestas completas para el motor (públicas + privadas)
    return pub.filter(function(r){ return r && r.done; }).map(function(r){ return Object.assign({}, r, priv[r.miembro]||{}); });
  }
  function firma(pub){ return pub.filter(function(r){ return r.done; }).map(function(r){ return r.miembro+':'+(r.updatedAt||0); }).sort().join('|'); }
  function vivos(trip, pub){ var ids=(trip.integrantes||[]).map(function(m){ return m.id; }); return pub.filter(function(r){ return ids.indexOf(r.miembro)>-1; }); }

  // Propuestas del grupo (provisionales si falta gente)
  function calcular(ZS, trip, pub, priv){
    pub = vivos(trip, pub);
    var R = pub.filter(function(r){ return r.done; });
    if(!R.length) return {version:'c5', generado:Date.now(), provisional:true, respondidos:[], n_total:(trip.integrantes||[]).length, propuestas:[], vacio:true};
    var res = COMPAT.recomendar(ZS, trip, R, priv||{});
    res.firma = firma(pub);
    return res;
  }

  // Itinerario del destino elegido
  function planear(ZS, trip, pub, priv, zonaId){
    pub = vivos(trip, pub);
    var Z = ZS.filter(function(z){ return z.id===zonaId; })[0]; if(!Z) throw new Error('zona_desconocida');
    var R = unir(pub, priv||{});
    var fechas = COMPAT.fechasGrupo(trip, R);
    var t2 = Object.assign({}, trip);
    if(fechas.mes && !(trip.fechas && (trip.fechas.modo==='fijas' || trip.fechas.mes))) t2.fechas = {modo:'mes', mes:fechas.mes};
    var A = ENG.agregar(t2, R);
    var plan = ENG.construirPlan(Z, A, t2, {base: (trip.eleccion||{}).base || null});
    plan.presTier = A.presTier; plan.firmaRespuestas = firma(pub);
    // nunca guardamos cifras privadas en el plan
    delete plan.presupuesto;
    return plan;
  }

  // Plan + por qué se eligió (para la pantalla de resumen). Sin cifras privadas.
  function elegir(ZS, trip, pub, priv, zonaId){
    var plan = planear(ZS, trip, pub, priv, zonaId); plan.editado = false; // el servidor mezcla: dejamos claro que es un plan nuevo
    var res = calcular(ZS, trip, pub, priv);
    var p = (res.propuestas||[]).filter(function(x){ return x.zona===zonaId; })[0];
    var rk = (res.ranking||[]).filter(function(x){ return x.zona===zonaId; })[0];
    var por = [];
    if(p){ por.push(p.porque); (p.satisface||[]).slice(0,3).forEach(function(x){ por.push('Fuerte en '+x); }); }
    else if(rk) por.push('Os encaja un '+rk.compat+'%');
    return { plan:plan, eleccion:{ zona:zonaId, tipo: p ? p.tipo : null, compat: p ? p.compat : (rk ? rk.compat : null), por_que:por,
      ranking:(res.ranking||[]).map(function(x){ return {id:x.zona, score:x.compat}; }), firma:res.firma||null, ts:Date.now() } };
  }

  // Lo que se guarda de cada respuesta: separa la parte privada
  var PRIVADOS = ['presIdeal','presMax','fechasOk','fechasNo','meses','dias'];
  function separar(r){
    var pub={}, priv={};
    Object.keys(r).forEach(function(k){ if(PRIVADOS.indexOf(k)>-1) priv[k]=r[k]; else pub[k]=r[k]; });
    return {pub:pub, priv:priv};
  }

  return {calcular:calcular, planear:planear, elegir:elegir, separar:separar, firma:firma, PRIVADOS:PRIVADOS};
})();

export { ENG, COMPAT, SERVIDOR };
