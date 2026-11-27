/* ===== app.js — interfaz: viajes, flujo de preguntas, plan, reservas, gastos, perfil ===== */
(function(){
'use strict';
var APP = 'Zaino';
var $app = document.getElementById('app');
var db=null, downloads=null, canWrite=true, sinDB=false, errorInicio=null;
var ZRAW=[], ZONAS=[], ZMAP={};
var S = {view:'viajes', code:null, sub:'resumen', flow:false, sheet:false, gastosCode:null, rsvCode:null, rsvSeg:'pend'};
var live = {code:null, trip:null, resps:{}, gastos:[], unsubs:[], loaded:false};

/* ---------- utilidades ---------- */
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
// Avatares: solo se pintan si son una imagen JPEG en base64 (lo que genera la app); cualquier otra cosa se ignora.
function avatarOk(s){ return typeof s==='string' && s.length<=60000 && /^data:image\/jpeg;base64,[A-Za-z0-9+\/]+={0,2}$/.test(s); }
function avatarEstilo(s){ return avatarOk(s) ? "background-image:url('"+esc(s)+"')" : ''; }
// Ids de integrantes: m1..m999 (el servidor también lo exige).
function idOk(s){ return /^m[0-9]{1,3}$/.test(String(s)); }
function $(sel, root){ return (root||document).querySelector(sel); }
function $$(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
function on(sel, ev, fn, root){ $$(sel, root).forEach(function(el){ el.addEventListener(ev, function(e){ fn(e, el); }); }); }
function ls(k, v){ try{ if(v===undefined){ var x=localStorage.getItem('zaino.'+k); return x?JSON.parse(x):null; } if(v===null) localStorage.removeItem('zaino.'+k); else localStorage.setItem('zaino.'+k, JSON.stringify(v)); }catch(e){ return null; } }
function toast(msg){ var t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(function(){ t.remove(); }, 2600); }
function genCode(){ var A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s=''; var arr=new Uint8Array(6); try{ crypto.getRandomValues(arr); }catch(e){ for(var j=0;j<6;j++) arr[j]=Math.floor(Math.random()*256); } for(var i=0;i<6;i++) s+=A[arr[i]%A.length]; return s; }
function cap(s){ s=String(s||''); return s.charAt(0).toUpperCase()+s.slice(1); }
function inicial(n){ return esc(String(n||'?').trim().charAt(0).toUpperCase()); }
function dinero(n){ return (Math.round(n*100)/100).toLocaleString('es-ES',{minimumFractionDigits:2, maximumFractionDigits:2})+' €'; }
function joinY(a){ a=a.filter(Boolean); if(a.length<2) return a.join(''); var u=a[a.length-1]; return a.slice(0,-1).join(', ')+(/^(i|hi)(?![aeou])/i.test(ENG.norm(u))?' e ':' y ')+u; }
function baseURL(){ return (window.ZAINO_CONFIG && window.ZAINO_CONFIG.urlPublica) || (location.origin+location.pathname); }
function shareLink(t){ var tk = (t && typeof t==='object') ? (t.token || ZSTORE.token(t.code)) : null; return baseURL()+(tk ? '#i-'+tk : ''); }
function copiar(txt, okMsg){ function fb(){ var ta=document.createElement('textarea'); ta.value=txt; ta.setAttribute('readonly',''); ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); toast(okMsg||'Copiado'); }catch(e){ toast('Mantén pulsado para copiar'); } ta.remove(); }
  try{ navigator.clipboard.writeText(txt).then(function(){ toast(okMsg||'Copiado'); }, fb); }catch(e){ fb(); } }
function isoHoy(){ return ENG.iso(new Date()); }

var ICO = {
  lista:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 9l1.5 1.5L12 8M8 15l1.5 1.5L12 14M14 9.5h3M14 15.5h3"/></svg>',
  viajes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8V6a5 5 0 0110 0v2"/><rect x="4" y="8" width="16" height="13" rx="3"/><path d="M9 13h6M4 13h16"/></svg>',
  gastos:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 8.5a4.5 4.5 0 100 7M7 10.5h6M7 13.5h5"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  reservas:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-4z"/><path d="M14 6v12" stroke-dasharray="2 2.5"/></svg>',
  perfil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.4-4.4 4.8-6.5 8-6.5s6.6 2.1 8 6.5"/></svg>'
};

/* ---------- almacenamiento local (por móvil) ---------- */
function perfil(){ return ls('perfil') || {nombre:'', foto:''}; }
function misViajes(){ return ls('viajes') || []; }
function guardarMiViaje(o){ var l=misViajes().filter(function(v){ return v.code!==o.code; }); var prev=misViajes().filter(function(v){ return v.code===o.code; })[0]||{}; l.unshift(Object.assign({}, prev, o)); ls('viajes', l.slice(0,40)); }
function quitarMiViaje(code){ ls('viajes', misViajes().filter(function(v){ return v.code!==code; })); }
function miEntrada(code){ return misViajes().filter(function(v){ return v.code===code; })[0] || null; }

/* ---------- base de datos ---------- */
function tripRef(c){ return db.doc('viajes2/'+c); }
function respCol(c){ return db.collection('viajes2/'+c+'/resp'); }
function gastoCol(c){ return db.collection('viajes2/'+c+'/gastos'); }
function listaCol(c){ return db.collection('viajes2/'+c+'/lista'); }
function escribir(p){ return Promise.resolve(p).catch(function(e){ if(e && (e.code==='invalid_argument'||e.code==='not_granted')) { canWrite=false; } throw e; }); }

// refrescar: vuelve a abrir las escuchas del mismo viaje (p. ej. al recuperar la red) sin vaciar lo que ya se ve.
function suscribir(code, refrescar){
  if(live.code===code && !refrescar) return;
  live.unsubs.forEach(function(u){ try{ u(); }catch(e){} });
  if(refrescar && live.code===code) live.unsubs=[];
  else live = {code:code, trip:null, resps:{}, gastos:[], lista:[], res:null, unsubs:[], loaded:false};
  if(!db) return;
  live.unsubs.push(tripRef(code).onSnapshot(function(s){ live.trip = s.exists ? s.data() : null; live.loaded=true; cambio(); }, function(){ live.loaded=true; cambio(false); }));
  live.unsubs.push(respCol(code).onSnapshot(function(qs){ var r={}; qs.docs.forEach(function(d){ r[d.id]=d.data(); }); live.resps=r; cambio(); }, function(){}));
  live.unsubs.push(db.doc('viajes2/'+code+'/res/actual').onSnapshot(function(s){ live.res = s.exists ? s.data() : null; cambio(); }, function(){}));
  live.unsubs.push(listaCol(code).onSnapshot(function(qs){ live.lista = qs.docs.map(function(d){ return Object.assign({id:d.id}, d.data()); }).sort(function(a,b){ return (a.ts||0)-(b.ts||0); }); cambio(); }, function(){}));
  live.unsubs.push(gastoCol(code).onSnapshot(function(qs){ live.gastos = qs.docs.map(function(d){ return Object.assign({id:d.id}, d.data()); }).sort(function(a,b){ return (b.ts||0)-(a.ts||0); }); cambio(); }, function(){}));
}
var cambioT=null;
// Con una hoja abierta no se repinta (se perdería lo que escribes): los datos ya están al día en `live`,
// se avisa con «Hay cambios nuevos» y la vista se repinta al cerrar la hoja (cerrarHoja).
// cambio(false): no llegó nada nuevo (p. ej. falló la lectura sin red); repinta igual pero no avisa.
var cambioNuevo=false;
function cambio(nuevo){ if(nuevo!==false) cambioNuevo=true; clearTimeout(cambioT); cambioT=setTimeout(function(){ var n=cambioNuevo; cambioNuevo=false; autoPlan(); if(!S.flow && !S.sheet) render(true); else if(S.sheet && n) avisoCambios(); }, 80); }
function avisoCambios(){ var a=$('#sheet-nuevo'); if(a && !a.textContent) a.textContent='Hay cambios nuevos · los verás al cerrar'; }

/* ---------- conexión ---------- */
// Banner fijo fuera de #app (render no lo borra). role=status: los lectores de pantalla lo anuncian sin interrumpir.
var redOculta=false;
function avisoRed(){
  var b=$('#red-aviso');
  if(!b){ b=document.createElement('div'); b.id='red-aviso'; b.className='red-aviso'; b.setAttribute('role','status'); document.body.appendChild(b); }
  var off = navigator.onLine===false && !redOculta;
  if(off && !b.textContent){ b.innerHTML='<span>Sin conexión — guardaremos cuando vuelva</span><button type="button" class="red-x" aria-label="Ocultar aviso">×</button>';
    $('.red-x', b).addEventListener('click', function(){ redOculta=true; avisoRed(); }); }
  else if(!off) b.innerHTML='';
  document.body.classList.toggle('sin-red', off);
}
window.addEventListener('offline', function(){ redOculta=false; avisoRed(); });
window.addEventListener('online', function(){ var habia=document.body.classList.contains('sin-red'); redOculta=false; avisoRed();
  if(live.code && db) suscribir(live.code, true); // relee lo que cambió mientras no había red
  if(habia) toast('Conexión recuperada'); });

/* ---------- zonas ---------- */
function zona(id){ return ZMAP[id]||null; }
function respsArr(){ return Object.keys(live.resps).map(function(k){ return Object.assign({miembro:k}, live.resps[k]); }); }
// Con plan hecho, días, mes y gasto salen del plan (los calculó el servidor con las respuestas privadas, que este móvil no ve).
function agregado(){ var A=ENG.agregar(live.trip||{}, respsArr()), p=live.trip && live.trip.plan;
  if(p){ if(p.dias && p.dias.length) A.dias=p.dias.length; if(p.mes!=null) A.mes=p.mes; if(p.presTier) A.presTier=p.presTier; }
  return A; }
function firma(){ return respsArr().filter(function(r){ return r.done; }).map(function(r){ return r.miembro+':'+(r.updatedAt||0); }).sort().join('|'); }
function todosRespondieron(){ var t=live.trip; if(!t) return false; var R=live.resps; return (t.integrantes||[]).length>0 && t.integrantes.every(function(m){ return R[m.id] && R[m.id].done; }); }

// Las propuestas y el plan se calculan en el servidor (motor), que es el único que ve las respuestas privadas.
var pidiendo = {};
function pedirMotor(accion, zonaId){
  var code = live.code; if(!code || !db) return Promise.resolve();
  var k = accion+':'+code+':'+(zonaId||''); if(pidiendo[k]) return pidiendo[k];
  pidiendo[k] = ZSTORE.motor(code, accion, zonaId).then(function(x){ if(accion==='calcular') delete calcFallos[code]; return x; }, function(e){ console.warn('motor', e); if(accion==='calcular') falloCalculo(code); else { delete ultimaFirmaPedida['p'+code]; toast('No se pudo calcular ahora. Revisa la conexión y vuelve a intentarlo.'); } return null; }).then(function(x){ delete pidiendo[k]; return x; });
  return pidiendo[k];
}
// Si el cálculo falla no se queda «Calculando…» para siempre: se olvida la firma pedida y se reintenta
// con espera creciente (2, 4, 8 y 16 s). Pasado eso, sale el botón «Reintentar» (o se reintenta solo si el grupo cambia).
var calcFallos = {}, REINTENTOS = 4;
function falloCalculo(code){
  delete ultimaFirmaPedida['c'+code]; delete ultimaFirmaPedida['p'+code];
  var r = calcFallos[code] || (calcFallos[code] = {n:0, t:null, next:0, f:''});
  r.n++; r.f = firma(); clearTimeout(r.t);
  if(r.n<=REINTENTOS){ var espera = (window.ZAINO_REINTENTO_MS||2000)*Math.pow(2, r.n-1); r.next = Date.now()+espera; r.t = setTimeout(function(){ if(live.code===code) autoPlan(); }, espera); }
  else r.next = Infinity;
  if(live.code===code && !S.flow && !S.sheet) render(true);
}
function reintentarCalculo(){ var code=live.code; if(!code) return; if(calcFallos[code]) clearTimeout(calcFallos[code].t); delete calcFallos[code]; delete ultimaFirmaPedida['c'+code]; delete ultimaFirmaPedida['p'+code]; autoPlan(); render(true); }
function generar(forzar){ return pedirMotor('planear', forzar || (live.trip && live.trip.eleccion && live.trip.eleccion.zona) || null); }
function destinoFijo(t){ return (t.destinos||[]).length===1 ? t.destinos[0] : null; }
var ultimaFirmaPedida = {};
function autoPlan(){
  var t=live.trip; if(!t || !live.loaded) return;
  if(!miEntrada(live.code)) return;
  var hechos = respsArr().filter(function(r){ return r.done; }).length; if(!hechos) return;
  var f = firma();
  var cf = calcFallos[live.code]; if(cf && cf.f===f && Date.now()<cf.next) return; // esperando para reintentar
  if((!live.res || live.res.firma!==f) && ultimaFirmaPedida['c'+live.code]!==f){ ultimaFirmaPedida['c'+live.code]=f; pedirMotor('calcular'); }
  // Con el destino fijado al crear el viaje, el plan sale solo en cuanto responde todo el grupo.
  if(destinoFijo(t) && todosRespondieron() && (!t.plan || (!t.plan.editado && (t.plan.firmaRespuestas!==f || t.plan.motor!==ENG.VERSION))) && ultimaFirmaPedida['p'+live.code]!==f){ ultimaFirmaPedida['p'+live.code]=f; pedirMotor('planear'); }
}

/* ---------- arranque ---------- */
async function init(){
  try{ var res = await fetch('biblioteca.json'); var data = await res.json(); ZRAW = data.zonas||[]; }catch(e){ ZRAW=[]; }
  ZONAS = ZRAW.map(function(z){ try{ return ENG.normalizar(z); }catch(e){ return null; } }).filter(Boolean);
  ZONAS.forEach(function(z){ ZMAP[z.id]=z; });
  render(); avisoRed();
  window.ZAINO_ZONAS = ZONAS;
  try{ await ZSTORE.init(); db = ZSTORE.db; downloads = ZSTORE.downloads; }
  catch(e){ console.error(e); db=null; errorInicio = (e && (e.message||e.code)) || 'error'; }
  if(!db) sinDB = true;
  var ult = ls('ult'); if(ult && miEntrada(ult)){ S.code = ult; var bd = ls('borrador.'+ult); if(bd && bd._i){ S.view='viaje'; S.sub='resumen'; } }
  rutaHash();
  window.addEventListener('hashchange', rutaHash);
  render();
}
function rutaHash(){
  var h = location.hash.replace('#','');
  var m = h.match(/^v-([A-Z0-9]{6})$/i);
  if(m){ var code=m[1].toUpperCase(); try{ history.replaceState(null,'',location.pathname+location.search); }catch(e){} if(miEntrada(code)) abrirViaje(code); else hojaSinInvitacion(); return; }
  var mi = h.match(/^i-([a-f0-9]{24,64})$/i);
  if(mi){ try{ history.replaceState(null,'',location.pathname+location.search); }catch(e){} unirseToken(mi[1].toLowerCase()); }
}

/* ---------- barra inferior ---------- */
function tabbar(){
  var bar = $('#tabbar'); if(!bar){ bar=document.createElement('nav'); bar.id='tabbar'; bar.className='tabbar'; bar.setAttribute('aria-label','Secciones'); document.body.appendChild(bar); }
  var v = S.view==='viaje' ? 'viajes' : S.view;
  bar.innerHTML = '<div class="in">'+
    tab('viajes','Mis viajes')+tab('gastos','Gastos')+
    '<button class="tab plus" data-tab="crear" aria-label="Crear o unirse a un viaje"><span class="b">'+ICO.plus+'</span><span>Crear</span></button>'+
    tab('lista','Lista')+tab('reservas','Reservas')+tab('perfil','Perfil')+'</div>';
  function tab(k,l){ return '<button class="tab'+(v===k?' on':'')+'" data-tab="'+k+'">'+ICO[k]+'<span>'+l+'</span></button>'; }
  on('[data-tab]','click',function(e,b){ var k=b.dataset.tab; if(k==='crear') return hojaCrearUnirse(); S.view=k; render(); window.scrollTo(0,0); }, bar);
}

/* ---------- render principal ---------- */
function render(keepScroll){
  if(S.flow) return;
  var y = window.scrollY;
  tabbar();
  var html='';
  if(S.view==='viaje' && S.code) html = vistaViaje();
  else if(S.view==='gastos') html = vistaGastos();
  else if(S.view==='reservas') html = vistaReservas();
  else if(S.view==='lista') html = vistaLista();
  else if(S.view==='perfil') html = vistaPerfil();
  else html = vistaViajes();
  // si llega un cambio del grupo mientras escribes, no se pierde lo que llevas escrito
  var escritos = {}, foco = document.activeElement && $app.contains(document.activeElement) ? document.activeElement.id : null, sel = null;
  $$('input[type=text][id],input[type=number][id],textarea[id]', $app).forEach(function(i){ if(i.value) escritos[i.id] = i.value; });
  if(foco){ try{ sel = [document.activeElement.selectionStart, document.activeElement.selectionEnd]; }catch(e){} }
  var abiertos=$$('.agenda-slot[open]', $app).map(function(d){ return d.id; });
  $app.innerHTML = html;
  abiertos.forEach(function(id){ var d=document.getElementById(id); if(d) d.open=true; });
  conectar();
  Object.keys(escritos).forEach(function(k){ var i=document.getElementById(k); if(i && !i.value) i.value = escritos[k]; });
  if(foco){ var fi=document.getElementById(foco); if(fi){ try{ fi.focus({preventScroll:true}); if(sel) fi.setSelectionRange(sel[0], sel[1]); }catch(e){} } }
  if(keepScroll) window.scrollTo(0,y);
  if(S.view==='viaje' && S.sub==='tarjeta') pintarTarjeta();
}
var wires=[];
function conectar(){ var w=wires; wires=[]; w.forEach(function(f){ try{ f(); }catch(e){ console.error(e); } }); }
function wire(f){ wires.push(f); }

function cabecera(extra){ var p=perfil(); return '<div class="top"><div class="brand">'+MARCA.palabra()+'<i>viajes en grupo</i></div>'+(extra||'')+(avatarOk(p.foto)?'<span class="av s" style="'+avatarEstilo(p.foto)+'"></span>':'')+'</div>'; }
function avisoSinDB(){
  if(sinDB) return '<div class="note"><b>No podemos conectar con Zaino.</b> '+(errorInicio==='sin_db' ? 'Entra en tu cuenta de Claude (gratis) y recarga: esta versión de prueba la necesita.' : 'Revisa tu conexión y recarga.')+(errorInicio && /anonymous|anonim/i.test(errorInicio) ? ' (En el servidor falta activar el acceso sin registro.)' : '')+'</div>';
  if(ZSTORE.modo==='compartido' && ZSTORE.puedeEscribir===false) return '<div class="note"><b>Ahora mismo solo puedes mirar.</b> Para responder y crear viajes, pide a quien te pasó el enlace que te invite por correo como «Editor» (menú Compartir del artefacto) y vuelve a abrirlo.</div>';
  if(ZSTORE.modo==='compartido') return '<div class="note"><b>Versión de prueba.</b> Funciona dentro de Claude, así que para entrar hace falta una cuenta de Claude (es gratis). La versión final irá en su propia web, sin cuentas.</div>';
  return ZSTORE.modo==='local' ? '<div class="note"><b>Modo prueba.</b> Todo se guarda solo en este navegador y no se comparte con nadie. Para usar Zaino con tu grupo hay que conectar el servidor (docs/DESPLIEGUE.md).</div>' : '';
}

/* ---------- MIS VIAJES ---------- */
// Imágenes de destino con crédito y enlace a la licencia. La tarjeta exportable conserva su ilustración.
var FOTOS_ZONA = {
  roma: ['El Coliseo de Roma','Rome_Colosseum_exterior_panorama.jpg','Nicholas Hartmann','by-sa/4.0'],
  toscana: ['Florencia desde Piazzale Michelangelo','Panorama_de_Florence.jpg','Nono vlf','by-sa/4.0'],
  'puglia-salento': ['Lama Monachile en Polignano a Mare','Il_Monachile.jpg','Gianluca972','zero/1.0'],
  'veneto-venecia': ['El Gran Canal desde el puente de Rialto','Canal_Grande_from_Rialto.jpg','© Marie-Lan Nguyen','by/2.5'],
};
var FOTOS_PLAN = {
  roma:'coliseo-foro', toscana:'piazzale-michelangelo-san-miniato',
  'puglia-salento':'polignano-lama-monachile', 'veneto-venecia':'rialto-mercado',
};
function fotoSrc(id){ return typeof zainoDemoFotos!=='undefined' && zainoDemoFotos[id] || 'fotos/'+id+'.jpg'; }
function fotoCredito(f, titulo){
  return '<a href="https://commons.wikimedia.org/wiki/File:'+f[1]+'" target="_blank" rel="noopener">'+
    (titulo?esc(f[0])+' · ':'')+esc(f[2])+' / Wikimedia Commons</a> · <a href="https://creativecommons.org/'+
    (f[3].startsWith('zero/')?'publicdomain/':'licenses/')+f[3]+'/" target="_blank" rel="noopener">Licencia CC</a>';
}
function fotoZona(Z, eager){
  var f=FOTOS_ZONA[Z.id];
  if(!f) return '';
  return '<figure class="foto-zona"><img src="'+fotoSrc(Z.id)+'" alt="'+esc(f[0])+'" loading="'+(eager?'eager':'lazy')+
    '" decoding="async"><figcaption>'+fotoCredito(f,eager)+'</figcaption></figure>';
}
// Muestra editorial de Venecia. No crea viajes ni guarda respuestas.
function ejemploVenecia(){
  var pasear = [
    ['Mañana','Dorsoduro y Punta della Dogana','Empezad juntos en la Salute y seguid a pie hasta la punta para ver la laguna.'],
    ['Tarde','Las Zattere','Después de comer, recorred la orilla a vuestro ritmo. Dejad este tramo libre para los que prefieran parar.'],
    ['Al caer el sol','Reencuentro en las Zattere','Quedad de nuevo en el paseo para terminar el día juntos.']
  ];
  var cultura = [
    ['Mañana','Puente de Rialto','Quedad en el puente y cruzad hacia San Polo. Si el mercado está abierto, dad una vuelta por los puestos.'],
    ['Tarde','Frari y Scuola Grande di San Rocco','Elegid una de las dos visitas de interior y comprobad horarios y entrada. Están muy cerca entre sí.'],
    ['Al caer el sol','Bacari de San Polo','Reuníos en el barrio para compartir cicchetti. Cada uno puede decidir cuánto pedir.']
  ];
  function dia(paradas){return '<ol class="ej-paradas">'+paradas.map(function(p){return '<li><small>'+p[0]+'</small><strong>'+p[1]+'</strong><p>'+p[2]+'</p></li>';}).join('')+'</ol>';}
  return '<details class="ejemplo-viaje"><summary>Ver un ejemplo de viaje</summary><section><h2 class="d">Un sábado en Venecia</h2><p>Un grupo de Erasmus llega sin coche. Comparad dos formas de pasar ese mismo día.</p>'+
    '<details open><summary>Pasear y gastar poco</summary>'+dia(pasear)+'</details><details><summary>Arte y comida local</summary>'+dia(cultura)+'</details>'+
    '<button class="btn" id="ej-crear">Crear el viaje de mi grupo</button></section></details>';
}

function vistaViajes(){
  var L = misViajes();
  var html = cabecera()+avisoSinDB();
  if(!L.length){
    html += '<div class="portada"><section class="hero-intro stack">'+
      '<h1 class="d">¿Dónde nos <span class="r">vamos?</span></h1>'+
      '<p class="a" style="font-size:20px">Cada uno elige qué le apetece y cuánto quiere gastar. Zaino cruza las respuestas y os prepara una ruta día a día.</p>'+
      '<div class="row" style="margin-top:6px"><button class="btn grow" id="b-crear">Crear un viaje</button><button class="btn ghost grow" id="b-unirse">Tengo una invitación</button></div>'+
    '</section>'+fotoZona({id:'puglia-salento'}, true)+'</div>'+ejemploVenecia()+
    '<div class="lab" style="margin:18px 0 8px">La postal de vuestro viaje</div>'+
    '<div class="strip">'+ZONAS.map(function(Z){ return '<div class="mini" style="--zbg:'+Z.bg+'">'+ART.vista(Z,true)+'<span>'+esc(Z.corto)+'</span></div>'; }).join('')+'</div>'+
    '<div class="card stack" style="margin-top:6px"><div class="lab">Así funciona</div>'+
      paso('1','Quien organiza crea el viaje','Pone los nombres del grupo, el presupuesto y, si lo tenéis, el destino o las fechas.')+
      paso('2','Cada uno responde a su ritmo','Preguntas cortas y visuales desde su propio móvil. El presupuesto y la disponibilidad de cada persona son privados.')+
      paso('3','Sale el plan','Destino, día a día con sitios reales, reservas por confirmar, gastos compartidos y una tarjeta para subir a stories.')+
    '</div>';
    wire(function(){ on('#b-crear','click',crearViaje); on('#ej-crear','click',crearViaje); on('#b-unirse','click',function(){ hojaCodigo(); }); });
    return html;
  }
  html += '<div class="row" style="justify-content:space-between;margin:4px 0 12px"><h2 class="d">Mis viajes</h2><button class="btn sm ghost" id="b-unirse2">Unirme</button></div><div class="stack">';
  L.forEach(function(v){
    var Z = v.zona && zona(v.zona);
    html += '<button class="card trip" data-open="'+esc(v.code)+'" style="'+(Z?'--zbg:'+Z.bg:'')+'"><div class="th">'+(Z?ART.vista(Z,false):'<svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#EFC65B"/><text x="50" y="62" text-anchor="middle" font-size="44" font-weight="900" font-family="Arial">?</text></svg>')+'</div>'+
      '<div class="bd"><span class="lab">'+(v.rol==='jefe'?'Lo organizas tú':'Vas con el grupo')+' · '+esc(v.code)+'</span><b>'+esc(v.titulo||'Viaje')+'</b><span class="muted" style="font-size:13px">'+esc(v.estado||'Abre el viaje para ver cómo va')+'</span></div></button>';
  });
  html += '</div><button class="btn full" id="b-crear2" style="margin-top:16px">Crear otro viaje</button>';
  wire(function(){ on('[data-open]','click',function(e,b){ abrirViaje(b.dataset.open); }); on('#b-crear2','click',crearViaje); on('#b-unirse2','click',function(){ hojaCodigo(); }); });
  return html;
}
function paso(n,t,d){ return '<div class="row" style="align-items:flex-start;gap:12px"><span class="d" style="font-size:40px;color:var(--signal);width:28px">'+n+'</span><div><b>'+t+'</b><p class="muted" style="font-size:14px">'+d+'</p></div></div>'; }

/* ---------- hojas inferiores ---------- */
function hoja(html, wireFn){
  cerrarHoja();
  var bg=document.createElement('div'); bg.className='sheet-bg'; bg.id='sheet'; bg.innerHTML='<div class="sheet-nuevo" id="sheet-nuevo" role="status"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>'+html+'</div>';
  document.body.appendChild(bg); S.sheet=true;
  bg.addEventListener('click', function(e){ if(e.target===bg) cerrarHoja(); });
  if(wireFn) wireFn(bg);
  var f=bg.querySelector('input,textarea,select'); if(f && f.type!=='file') setTimeout(function(){ try{ f.focus(); }catch(e){} }, 60);
}
function cerrarHoja(){ var s=$('#sheet'); if(s) s.remove(); if(S.sheet){ S.sheet=false; render(true); } }
function hojaCrearUnirse(){
  hoja('<div class="stack"><h2 class="d">¿Qué hacemos?</h2>'+
    '<button class="btn full" id="h-crear">Crear un viaje nuevo</button>'+
    '<button class="btn ghost full" id="h-unirse">Tengo una invitación</button>'+
    '<p class="muted" style="font-size:13px">Si te han pasado un enlace, ábrelo y entrarás directamente en el viaje.</p></div>', function(el){
    on('#h-crear','click',function(){ cerrarHoja(); crearViaje(); }, el);
    on('#h-unirse','click',function(){ hojaCodigo(); }, el);
  });
}
function hojaCodigo(pref){
  hoja('<form class="stack" id="f-code"><h2 class="d">Unirme a un viaje</h2><label class="f">Pega el enlace de invitación<input type="text" id="i-code" autocomplete="off" placeholder="https://…#i-…" value="'+esc(pref||'')+'"></label><div class="err" id="e-code" hidden></div><button class="btn full" type="submit">Entrar</button><p class="muted" style="font-size:13px">El enlace lo comparte quien organiza, desde «Invita al grupo». Abrirlo directamente también funciona.</p></form>', function(el){
    $('#f-code',el).addEventListener('submit', function(e){ e.preventDefault(); var v=$('#i-code',el).value.trim(); var m=v.match(/i-([a-f0-9]{24,64})/i) || v.match(/^([a-f0-9]{24,64})$/i);
      if(!m){ var er=$('#e-code',el); er.hidden=false; er.textContent='Eso no parece un enlace de invitación de Zaino. Pide que te lo reenvíen.'; return; }
      cerrarHoja(); unirseToken(m[1].toLowerCase()); });
  });
}
function hojaSinInvitacion(){
  hoja('<div class="stack"><h2 class="d">Hace falta la invitación</h2><p>Para entrar en un viaje necesitas el enlace que comparte quien lo organiza. El código del viaje solo sirve a quien ya está dentro.</p><button class="btn full" id="h-ok">Vale</button></div>', function(el){ on('#h-ok','click',cerrarHoja,el); });
}

/* ---------- motor de flujos a pantalla completa ---------- */
function Flow(o){
  var el=document.createElement('div'); el.className='flow'; el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true');
  document.body.appendChild(el); document.body.style.overflow='hidden'; S.flow=true;
  var idx=o.start||0, ans=o.ans, hist=[];
  function L(){ return o.steps(ans); }
  function cerrar(){ el.remove(); document.body.style.overflow=''; S.flow=false; if(o.onClose) o.onClose(ans); render(true); }
  for(var hi=0; hi<idx; hi++) hist.push(hi);
  function next(){ hist.push(idx); idx++; if(o.onStep) o.onStep(ans, idx); show(); }
  function back(){ if(!hist.length) return; idx=hist.pop(); show(); }
  function show(){
    var list=L();
    if(idx>=list.length){ el.remove(); document.body.style.overflow=''; S.flow=false; o.onDone(ans); return; }
    var st=list[idx], total=list.length;
    el.style.setProperty('--qbg', st.bg || o.bg || '#EFC65B');
    el.className='flow';
    void el.offsetWidth; el.className='flow enter';
    var bars=''; for(var i=0;i<total;i++) bars+='<i class="'+(i<idx?'done':(i===idx?'cur':''))+'"></i>';
    el.innerHTML='<div class="bars">'+bars+'</div><div class="hd"><button class="icb" id="fl-back" aria-label="Atrás" '+(hist.length?'':'disabled')+'>←</button><span class="who">'+esc(o.who||'')+'</span><button class="icb" id="fl-x" aria-label="Cerrar">×</button></div>'+
      '<div class="body" data-step="'+esc(st.id)+'">'+titulo(st)+(st.html?st.html(ans):'')+'</div>'+(st.ft===false?'':'<div class="ft">'+(st.skip?'<button class="btn ghost" id="fl-skip">'+esc(st.skip)+'</button>':'')+(st.cta!==null?'<button class="btn ink" id="fl-ok">'+esc(st.cta||'Seguir')+'</button>':'')+'</div>');
    $('#fl-x',el).addEventListener('click', function(){ if(o.confirmClose){ if(!el.querySelector('.cfx')){ var b=document.createElement('div'); b.className='note cfx'; b.style.cssText='background:#FBF4E6;color:#30231F;margin-top:8px'; b.innerHTML='Tus respuestas se guardan en este móvil. <button class="lnk" id="fl-x2">Salir</button>'; $('.body',el).prepend(b); $('#fl-x2',el).addEventListener('click',cerrar); } } else cerrar(); });
    $('#fl-back',el).addEventListener('click', back);
    var ok=$('#fl-ok',el), sk=$('#fl-skip',el);
    function valido(){ return !st.valid || st.valid(ans); }
    function refresh(){ if(ok) ok.disabled = !valido(); }
    if(ok) ok.addEventListener('click', function(){ if(st.before && st.before(ans, el)===false) return; if(!valido()) return; next(); });
    if(sk) sk.addEventListener('click', function(){ if(st.onSkip) st.onSkip(ans); next(); });
    if(st.wire) st.wire(el, ans, {next:next, refresh:refresh, rerender:show, save:function(){ if(o.onStep) o.onStep(ans, idx); }});
    refresh();
    var body=$('.body',el); body.scrollTop=0;
  }
  show();
  return {el:el, close:cerrar};
}
function titulo(st){
  if(!st.t) return '';
  return '<div class="qt">'+st.t.map(function(l){ return '<span class="cap">'+esc(l)+'</span>'; }).join(' ')+'</div>'+(st.s?'<div class="qs"><span class="cap">'+esc(st.s)+'</span></div>':'');
}
function optsHtml(st, ans){
  var multi = st.tipo==='multi', sel = ans[st.id], cls = st.layout==='rows'?'one':(st.layout==='three'?'three':(st.layout==='duelo'?'duelo':''));
  return '<div class="opts '+cls+'">'+st.opts.map(function(op){
    var isOn = multi ? (sel||[]).indexOf(op.v)>-1 : sel===op.v;
    return '<button type="button" class="opt'+(st.layout==='rows'?' row':'')+(isOn?' on':'')+'" data-v="'+esc(op.v)+'" aria-pressed="'+isOn+'"><span class="il">'+(op.svg||ART.q(op.art||'mapa'))+'</span><span><span class="tx"><span class="cap">'+esc(op.label)+'</span></span>'+(op.sub?'<br><span class="sb">'+esc(op.sub)+'</span>':'')+'</span></button>';
  }).join('')+'</div>';
}
function wireOpts(st){
  return function(el, ans, F){
    on('.opt','click',function(e,b){
      var v=b.dataset.v;
      if(st.tipo==='multi'){
        var a=(ans[st.id]||[]).slice(); var i=a.indexOf(v);
        if(i>-1) a.splice(i,1); else { if(st.exclusivo){ if(v===st.exclusivo) a=[]; else a=a.filter(function(x){ return x!==st.exclusivo; }); } if(st.max && a.length>=st.max) a.shift(); a.push(v); }
        ans[st.id]=a; $$('.opt',el).forEach(function(x){ var o=a.indexOf(x.dataset.v)>-1; x.classList.toggle('on',o); x.setAttribute('aria-pressed',o); }); F.refresh();
      } else {
        ans[st.id] = (st.num ? +v : v); $$('.opt',el).forEach(function(x){ x.classList.toggle('on', x===b); }); setTimeout(F.next, 260);
      }
    }, el);
  };
}
function paso_(st){ // completa html/wire de los tipos de opción
  if(st.tipo==='single' || st.tipo==='multi'){
    st.html = st.html || function(ans){ return optsHtml(st, ans); };
    st.wire = st.wire || wireOpts(st);
    if(st.tipo==='single'){ st.cta = st.cta===undefined ? null : st.cta; st.valid = st.valid || function(a){ return a[st.id]!=null && a[st.id]!==''; }; if(st.cta===null) st.ft = st.skip ? undefined : false; }
    else st.valid = st.valid || function(a){ return (a[st.id]||[]).length >= (st.min||1); };
  }
  return st;
}

/* ---------- CREAR VIAJE (jefe) ---------- */
function crearViaje(){
  if(sinDB){ toast('Sin conexión con Zaino: recarga cuando tengas internet'); return; }
  var p=perfil();
  var ans = ls('borrador.crear') || {yo:p.nombre||'', titulo:'', integrantes:[], destModo:'no', destinos:[], fModo:'abierto', inicio:'', fin:'', mes:0, dias:0, presupuesto:350, presSin:false, obs:''};
  var colores=['#EFC65B','#4EAAA0','#F47762','#22B8A7','#F28C28','#8E7CFF'];
  Flow({ who:'Nuevo viaje', ans:ans, confirmClose:true, onStep:function(a){ ls('borrador.crear', a); },
    steps:function(a){ return [
      {id:'yo', bg:colores[0], t:['Vamos a montar','el viaje'], s:'Primero, ¿cómo te llamas? Tú serás quien organiza.',
        html:function(a){ return '<label class="f">Tu nombre<input type="text" id="i-yo" maxlength="24" value="'+esc(a.yo)+'" placeholder="Tu nombre"></label><label class="f">Nombre del viaje (opcional)<input type="text" id="i-tit" maxlength="40" value="'+esc(a.titulo)+'" placeholder="Ej. Escapada de Pascua"></label>'; },
        wire:function(el,a,F){ $('#i-yo',el).addEventListener('input',function(e){ a.yo=e.target.value; F.refresh(); }); $('#i-tit',el).addEventListener('input',function(e){ a.titulo=e.target.value; }); },
        valid:function(a){ return (a.yo||'').trim().length>=2; }},
      {id:'integrantes', bg:colores[1], t:['¿Quién viene?'], s:'Escribe los nombres tal y como los conocéis. Cada uno elegirá el suyo al entrar.',
        html:function(a){ return '<div class="row"><input type="text" id="i-nom" maxlength="24" placeholder="Nombre" class="grow"><button class="btn ink sm" id="b-add" type="button">Añadir</button></div><div class="cities" id="lista-int">'+chipsInt(a)+'</div><p class="qs"><span class="cap">'+((a.integrantes.length+1))+' persona'+(a.integrantes.length?'s':'')+' contándote a ti</span></p>'; },
        wire:function(el,a,F){ var inp=$('#i-nom',el); function add(){ var n=inp.value.trim(); if(!n) return; if(n.toLowerCase()===(a.yo||'').trim().toLowerCase() || a.integrantes.some(function(x){ return x.toLowerCase()===n.toLowerCase(); })){ toast('Ese nombre ya está'); return; } a.integrantes.push(n.slice(0,24)); inp.value=''; F.rerender(); setTimeout(function(){ var i=$('#i-nom'); if(i) i.focus(); },30); }
          $('#b-add',el).addEventListener('click',add); inp.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); add(); } });
          on('[data-del]','click',function(e,b){ a.integrantes.splice(+b.dataset.del,1); F.rerender(); }, el); },
        cta:'Seguir', valid:function(a){ return a.integrantes.length>=1; }},
      paso_({id:'destModo', tipo:'single', bg:colores[2], t:['¿Tenéis destino?'], s:'Si no, lo decidirán las respuestas de todos.', layout:'rows', opts:[
        {v:'no', label:'Aún no, que salga solo', sub:'Sale el sitio que mejor os encaje a todos', art:'italia'},
        {v:'uno', label:'Sí, lo tenemos claro', sub:'Las preguntas se centran en ese sitio', art:'mapa'},
        {v:'varios', label:'Dudamos entre 2 o 3', sub:'Las respuestas decidirán cuál', art:'postal'}]}),
    ].concat(a.destModo==='no' ? [] : [
      {id:'destinos', bg:colores[2], t:[a.destModo==='uno'?'¿Cuál?':'¿Entre cuáles?'], s:a.destModo==='uno'?'Toca uno.':'Toca dos o tres.',
        html:function(a){ return '<div class="opts three">'+ZONAS.map(function(Z){ var onx=a.destinos.indexOf(Z.id)>-1; return '<button type="button" class="opt'+(onx?' on':'')+'" data-z="'+esc(Z.id)+'"><span class="il" style="background:'+Z.bg+';border:2px solid #30231F;overflow:hidden">'+ART.emblema(Z)+'</span><span class="tx"><span class="cap">'+esc(Z.corto)+'</span></span></button>'; }).join('')+'</div>'; },
        wire:function(el,a,F){ on('[data-z]','click',function(e,b){ var id=b.dataset.z; var i=a.destinos.indexOf(id); if(a.destModo==='uno'){ a.destinos=[id]; } else { if(i>-1) a.destinos.splice(i,1); else { if(a.destinos.length>=3) a.destinos.shift(); a.destinos.push(id); } } $$('[data-z]',el).forEach(function(x){ x.classList.toggle('on', a.destinos.indexOf(x.dataset.z)>-1); }); F.refresh(); if(a.destModo==='uno') setTimeout(F.next,260); }, el); },
        valid:function(a){ return a.destModo==='uno' ? a.destinos.length===1 : a.destinos.length>=2; }, cta: a.destModo==='uno'?null:'Seguir', ft: a.destModo==='uno'?false:undefined}
    ]).concat([
      paso_({id:'fModo', tipo:'single', bg:colores[3], t:['¿Y las fechas?'], layout:'rows', opts:[
        {v:'fijas', label:'Tenemos fechas exactas', art:'calendario'},
        {v:'mes', label:'Sabemos el mes', sub:'Y más o menos cuántos días', art:'sol'},
        {v:'abierto', label:'Sin decidir', sub:'Cada uno dirá cuándo puede y ganará el mes que más encaje', art:'grupo'}]})
    ]).concat(a.fModo==='fijas' ? [
      {id:'fechas', bg:colores[3], t:['¿Qué días?'],
        html:function(a){ return '<label class="f">Ida<input type="date" id="i-ini" min="'+isoHoy()+'" value="'+esc(a.inicio)+'"></label><label class="f">Vuelta<input type="date" id="i-fin" min="'+isoHoy()+'" value="'+esc(a.fin)+'"></label><p class="qs" id="q-dias"></p>'; },
        wire:function(el,a,F){ function upd(){ a.inicio=$('#i-ini',el).value; a.fin=$('#i-fin',el).value; var d = a.inicio&&a.fin ? ENG.diasEntre(a.inicio,a.fin) : 0; $('#q-dias',el).innerHTML = d>0 ? '<span class="cap">'+d+' día'+(d>1?'s':'')+'</span>' : (a.inicio&&a.fin?'<span class="cap">La vuelta tiene que ser después de la ida</span>':''); F.refresh(); } $('#i-ini',el).addEventListener('change',upd); $('#i-fin',el).addEventListener('change',upd); upd(); },
        valid:function(a){ return a.inicio && a.fin && ENG.diasEntre(a.inicio,a.fin)>=1 && ENG.diasEntre(a.inicio,a.fin)<=21; }}
    ] : a.fModo==='mes' ? [
      {id:'mes', bg:colores[3], t:['¿Qué mes?'],
        html:function(a){ return mesesChips([a.mes], false)+'<div class="lab" style="margin-top:6px">¿Cuántos días, más o menos?</div><div class="cities">'+[2,3,4,5,6,7,10].map(function(d){ return '<button type="button" class="chip'+(a.dias===d?' on':'')+'" data-d="'+d+'">'+d+' días</button>'; }).join('')+'</div>'; },
        wire:function(el,a,F){ on('[data-m]','click',function(e,b){ a.mes=+b.dataset.m; $$('[data-m]',el).forEach(function(x){ x.classList.toggle('on',x===b); }); F.refresh(); }, el); on('[data-d]','click',function(e,b){ a.dias=+b.dataset.d; $$('[data-d]',el).forEach(function(x){ x.classList.toggle('on',x===b); }); F.refresh(); }, el); },
        valid:function(a){ return a.mes>0 && a.dias>0; }}
    ] : []).concat([
      paso_({id:'ocasion', tipo:'single', bg:colores[0], t:['¿Hay algo','que celebrar?'], s:'Sale en la tarjeta final y cambia alguna noche.', layout:'three', opts:[
        {v:'erasmus', label:'Fin de Erasmus', art:'birrete'}, {v:'cumple', label:'Un cumpleaños', art:'tarta'}, {v:'reencuentro', label:'Reencuentro', art:'corazones'}, {v:'despedida', label:'Una despedida', art:'copa'}, {v:'porque', label:'Porque sí', art:'estrella'}]}),
      {id:'presupuesto', bg:colores[4], t:['¿Presupuesto','por persona?'], s:'Aproximado, con viaje, dormir y planes. Cada uno podrá decir si le viene justo.',
        html:function(a){ return '<div class="code" id="v-pres" style="font-size:44px">'+(a.presSin?'—':a.presupuesto+' €')+'</div><input type="range" id="i-pres" min="100" max="1500" step="25" value="'+a.presupuesto+'" style="width:100%;accent-color:#30231F" '+(a.presSin?'disabled':'')+' aria-label="Presupuesto por persona"><div class="row" style="justify-content:space-between" class="lab"><span class="lab">100 €</span><span class="lab">1.500 €</span></div><label class="chk"><input type="checkbox" id="i-psin" '+(a.presSin?'checked':'')+'> Sin decidir: que lo diga cada uno</label>'; },
        wire:function(el,a,F){ var r=$('#i-pres',el), v=$('#v-pres',el); r.addEventListener('input',function(){ a.presupuesto=+r.value; v.textContent=a.presupuesto+' €'; }); $('#i-psin',el).addEventListener('change',function(e){ a.presSin=e.target.checked; r.disabled=a.presSin; v.textContent=a.presSin?'—':a.presupuesto+' €'; }); }},
      {id:'obs', bg:colores[5], t:['¿Algo que','debamos saber?'], s:'Lo tendremos en cuenta en el plan. Toca las que apliquen o escribe.',
        html:function(a){ var sug=['Nadie conduce','Alguien no bebe alcohol','Hay vegetarianos','Queremos playa sí o sí','Queremos salir de fiesta','Nada de madrugar','Vamos justos de dinero']; return '<div class="cities">'+sug.map(function(s){ return '<button type="button" class="chip" data-s="'+esc(s)+'">+ '+esc(s)+'</button>'; }).join('')+'</div><textarea id="i-obs" maxlength="400" placeholder="Ej. Celebramos un cumpleaños el sábado">'+esc(a.obs)+'</textarea>'; },
        wire:function(el,a){ var t=$('#i-obs',el); t.addEventListener('input',function(){ a.obs=t.value; }); on('[data-s]','click',function(e,b){ var s=b.dataset.s; if(t.value.indexOf(s)===-1){ t.value = (t.value.trim()? t.value.trim()+'. ' : '')+s; a.obs=t.value; } b.classList.add('on'); }, el); },
        cta:'Crear viaje'}
    ]); },
    onDone:function(a){ guardarViajeNuevo(a); },
    onClose:function(){}
  });
}
function chipsInt(a){ return '<span class="chip on">'+esc((a.yo||'Tú').trim())+' · organiza</span>'+a.integrantes.map(function(n,i){ return '<span class="chip">'+esc(n)+' <button type="button" class="lnk" data-del="'+i+'" aria-label="Quitar '+esc(n)+'" style="text-decoration:none">×</button></span>'; }).join(''); }
function mesesChips(sel, multi){
  var now=new Date(), out='<div class="cities">';
  for(var i=1;i<=12;i++){ var d=new Date(now.getFullYear(), now.getMonth()+i, 1); var m=d.getMonth()+1; out+='<button type="button" class="chip'+(sel.indexOf(m)>-1?' on':'')+'" data-m="'+m+'">'+cap(MESES_LARGO[m-1])+' '+String(d.getFullYear()).slice(2)+'</button>'; }
  return out+'</div>';
}
async function guardarViajeNuevo(a){
  var ints=[{id:'m1', nombre:a.yo.trim()}].concat(a.integrantes.map(function(n,i){ return {id:'m'+(i+2), nombre:n}; }));
  var t={v:3, titulo:(a.titulo||'').trim(), jefe:'m1', integrantes:ints, observaciones:(a.obs||'').trim(),
    destinos: a.destModo==='no'?[]:a.destinos.slice(), fechas:{modo:a.fModo, inicio:a.fModo==='fijas'?a.inicio:'', fin:a.fModo==='fijas'?a.fin:'', mes:a.fModo==='mes'?a.mes:0},
    dias: a.fModo==='mes'?a.dias:0, presupuesto: a.presSin?0:a.presupuesto, ocasion:a.ocasion||'porque', createdAt:Date.now(), plan:null, reservas:{}, extras:[]};
  var code;
  try{ var cr = await ZSTORE.crearViaje(t); code = cr.code; t.code = code; t.token = cr.token; }
  catch(e){ console.error(e); toast('No se pudo crear el viaje. Revisa la conexión y vuelve a probar.'); render(); return; }
  var p=perfil(); if(!p.nombre){ p.nombre=a.yo.trim(); ls('perfil',p); }
  ls('borrador.crear', null);
  guardarMiViaje({code:code, miembro:'m1', nombre:a.yo.trim(), rol:'jefe', titulo:tituloViaje(t), estado:'Esperando respuestas'});
  ls('ult', code);
  S.code=code; S.view='viaje'; S.sub='resumen'; suscribir(code);
  pantallaCompartir(t, true);
}
function tituloViaje(t, Z){ if(t.titulo) return t.titulo; if(Z) return Z.nombre.split('(')[0].trim(); if(t.destinos && t.destinos.length===1 && zona(t.destinos[0])) return zona(t.destinos[0]).nombre.split('(')[0].trim(); var jefe=(t.integrantes||[]).filter(function(m){ return m.id===t.jefe; })[0]; return 'Viaje de '+(jefe?jefe.nombre:'grupo'); }

function mensajeInvitacion(t){ var jefe=(t.integrantes||[]).filter(function(m){ return m.id===t.jefe; })[0]; return (jefe?jefe.nombre+' te invita':'Te invitan')+' en «'+tituloViaje(t)+'». Entra, elige tu nombre y responde sin registrarte: '+shareLink(t); }
function botonesCompartir(t){
  var msg = mensajeInvitacion(t);
  return '<div class="stack" style="gap:8px">'+
    '<a class="btn full" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(msg)+'">Enviar por WhatsApp</a>'+
    '<div class="row"><a class="btn ghost grow sm" target="_blank" rel="noopener" href="https://t.me/share/url?url='+encodeURIComponent(shareLink(t))+'&text='+encodeURIComponent(msg.split(': http')[0])+'">Telegram</a><button class="btn ghost grow sm" data-copy-ig="1" type="button">Instagram</button><button class="btn ghost grow sm" data-copy="1" type="button">Copiar</button></div>'+
  '</div>';
}
function wireCompartir(root, t){ var msg=mensajeInvitacion(t); on('[data-copy]','click',function(){ copiar(msg,'Invitación copiada'); }, root); on('[data-copy-ig]','click',function(){ copiar(msg,'Copiado: pégalo en el chat de Instagram'); setTimeout(function(){ window.open('https://www.instagram.com/direct/inbox/','_blank'); },400); }, root); }
function pantallaCompartir(t, nuevo){
  Flow({ who:tituloViaje(t), ans:{}, bg:'#4EAAA0', steps:function(){ return [
    {id:'share', t:[nuevo?'¡Viaje creado!':'Invita al grupo'], s:'Pasa el enlace por WhatsApp o donde queráis. Cada uno lo abre en su móvil, elige su nombre y responde. Sin registrarse.',
      html:function(){ return botonesCompartir(t)+'<p class="qs"><span class="cap">Quien tenga el enlace puede entrar. Si se comparte donde no debe, puedes cambiarlo desde Grupo.</span></p>'; },
      wire:function(el){ wireCompartir(el,t); }, cta:'Responder mis preguntas', skip:'Ahora no'}
  ]; }, onDone:function(){ empezarPreguntas(t.code, 'm1'); }, onClose:function(){ S.view='viaje'; } });
}

/* ---------- UNIRSE (enlace de invitación) ---------- */
async function unirseToken(token){
  if(!db){ toast('Sin conexión con Zaino: recarga cuando tengas internet'); return; }
  if(ZSTORE.puedeEscribir===false){ hoja('<div class="stack"><h2 class="d">Casi dentro</h2><p>En esta versión de prueba, para entrar en un viaje quien te pasó el enlace tiene que invitarte por correo como <b>Editor</b> (menú Compartir del artefacto). Cuando lo haga, abre otra vez el mismo enlace.</p><button class="btn full" id="h-ok">Vale</button></div>', function(el){ on('#h-ok','click',cerrarHoja,el); }); return; }
  var p=null; try{ p = await ZSTORE.previa(token); }catch(e){ console.warn(e); }
  if(!p){ hoja('<div class="stack"><h2 class="d">Esta invitación no funciona</h2><p>Puede que el enlace esté incompleto o que quien organiza lo haya cambiado. Pídele que te lo reenvíe.</p><button class="btn full" id="h-ok">Vale</button></div>', function(el){ on('#h-ok','click',cerrarHoja,el); }); return; }
  var ints = p.integrantes||[];
  var mio = ints.filter(function(i){ return i.soy_yo; })[0];
  if(p.ya_dentro && mio){ guardarMiViaje({code:p.code, miembro:mio.id, nombre:mio.nombre, rol: mio.id===p.jefe?'jefe':'grupo', titulo:p.titulo||'Viaje'}); abrirViaje(p.code); return; }
  var yo = perfil().nombre||'';
  var jefe = (ints.filter(function(x){ return x.id===p.jefe; })[0]||{}).nombre || 'quien organiza';
  Flow({ who:p.titulo||'Viaje en grupo', ans:{m:null, nuevo:''}, steps:function(){ return [
    {id:'m', t:['¿Quién eres?'], s:jefe+' te invita'+(function(){ try{ var f=fechasTexto({fechas:p.fechas||{}, dias:p.dias||0}); return f && !/^0 días$/.test(f) ? ' ('+f.replace(/ · 0 días$/,'')+')' : ''; }catch(e){ return ''; } })()+'. Toca tu nombre o, si no sales, escríbelo abajo. No hace falta registrarse.',
      html:function(a){ return '<div class="opts one">'+ints.map(function(m){ var dis = m.ocupado && !m.soy_yo; return '<button type="button" class="opt row'+(a.m===m.id?' on':'')+'" data-m="'+esc(m.id)+'"'+(dis?' disabled aria-disabled="true"':'')+'><span class="il"><span class="av" style="width:56px;height:56px;font-size:22px">'+inicial(m.nombre)+'</span></span><span><span class="tx">'+esc(m.nombre)+(m.id===p.jefe?' · organiza':'')+'</span><br><span class="sb">'+(dis?'Ya ha entrado':'Libre')+'</span></span></button>'; }).join('')+'</div>'+
        '<label class="f lab" style="margin-top:12px">No salgo en la lista<input type="text" id="i-nuevo" maxlength="24" placeholder="Tu nombre" value="'+esc(a.nuevo||'')+'"></label>'; },
      wire:function(el,a,F){
        on('[data-m]','click',function(e,b){ if(b.disabled) return; a.m=b.dataset.m; a.nuevo=''; $('#i-nuevo',el).value=''; $$('[data-m]',el).forEach(function(x){ x.classList.toggle('on',x===b); }); F.refresh(); }, el);
        $('#i-nuevo',el).addEventListener('input', function(e){ a.nuevo=e.target.value; if(a.nuevo.trim()){ a.m=null; $$('[data-m]',el).forEach(function(x){ x.classList.remove('on'); }); } F.refresh(); });
        if(yo && !a.m && !a.nuevo){ var hit=ints.filter(function(m){ return !m.ocupado && m.nombre.trim().toLowerCase()===yo.trim().toLowerCase(); })[0]; if(hit){ a.m=hit.id; var b=$('[data-m="'+esc(hit.id)+'"]',el); if(b) b.classList.add('on'); F.refresh(); } } },
      valid:function(a){ return !!a.m || (a.nuevo||'').trim().length>=2; }, cta:'Entrar'}
  ]; }, onDone:async function(a){
      var r=null;
      try{ r = await ZSTORE.unirse(token, a.m, a.m ? null : a.nuevo.trim()); }
      catch(e){ var c=String((e&&(e.message||e.code))||''); toast(/ocupad/.test(c)?'Esa plaza ya la ha cogido otra persona':'No se pudo entrar: revisa la conexión'); unirseToken(token); return; }
      var nombre = a.m ? ((ints.filter(function(x){ return x.id===a.m; })[0]||{}).nombre || 'Tú') : a.nuevo.trim();
      guardarMiViaje({code:r.code, miembro:r.miembro, nombre:nombre, rol: r.miembro===p.jefe?'jefe':'grupo', titulo:p.titulo||'Viaje'});
      var pf=perfil(); if(!pf.nombre){ pf.nombre=nombre; ls('perfil',pf); }
      ls('ult', r.code); S.code=r.code; S.view='viaje'; S.sub='resumen'; suscribir(r.code);
      var t=null; try{ var sn = await tripRef(r.code).get(); t = sn.exists ? sn.data() : null; }catch(e){}
      var ya = null; try{ var rs = await db.doc('viajes2/'+r.code+'/resp/'+r.miembro).get(); ya = rs.exists ? rs.data() : null; }catch(e){}
      if(t && !(ya && ya.done)) empezarPreguntas(r.code, r.miembro, t); else render();
    }, onClose:function(){ render(); } });
}

/* ---------- PREGUNTAS ---------- */
function pasosPreguntas(t, a){
  var ZF = (t.destinos||[]).length===1 ? zona(t.destinos[0]) : null;
  var SL = (t.destinos||[]).length>1 ? t.destinos.map(zona).filter(Boolean) : null;
  var tintas = ZF ? [ZF.bg].concat(ZF.inks).concat(['#FBF4E6']) : TINTAS_PREGUNTA;
  var k=0; function bg(){ var c=tintas[k%tintas.length]; k++; return c; }
  var fixedMes = t.fechas && (t.fechas.modo==='fijas' ? (+t.fechas.inicio.slice(5,7)) : (t.fechas.mes||0));
  var obs = ENG.norm(t.observaciones||'');
  var sinCoche = /nadie conduce|sin coche|no conduc/.test(obs);
  var jefe = (t.integrantes.filter(function(m){ return m.id===t.jefe; })[0]||{}).nombre || 'Quien organiza';
  var L = [];
  L.push({id:'origen', bg:bg(), t:['¿Desde dónde','sales tú?'], s: ZF ? 'Para buscarte la mejor forma de llegar a '+ZF.corto+'.' : 'Cuenta para el destino: no es lo mismo salir de Sevilla que de Bolonia.',
    html:function(a){ var o=a.origen||{}; var pais=a._pais||(o.pais)||'es'; var list = pais==='it'?ORIGENES_IT:ORIGENES_ES;
      return '<div class="seg" style="background:#FBF4E6"><button type="button" data-p="es" class="'+(pais==='es'?'on':'')+'">Desde España</button><button type="button" data-p="it" class="'+(pais==='it'?'on':'')+'">Ya estoy en Italia</button></div>'+
        '<div class="cities">'+list.map(function(c){ return '<button type="button" class="chip'+(o.ciudad===c.c?' on':'')+'" data-c="'+esc(c.c)+'" data-i="'+c.iata+'">'+esc(c.c)+'</button>'; }).join('')+'</div>'+
        '<label class="f lab">¿Otra ciudad?<input type="text" id="i-otra" maxlength="30" placeholder="Escríbela" value="'+esc(o.otra?o.ciudad:'')+'"></label>'; },
    wire:function(el,a,F){ on('[data-p]','click',function(e,b){ a._pais=b.dataset.p; F.rerender(); }, el);
      on('[data-c]','click',function(e,b){ a.origen={ciudad:b.dataset.c, iata:b.dataset.i, pais:a._pais||'es'}; $$('[data-c]',el).forEach(function(x){ x.classList.toggle('on',x===b); }); $('#i-otra',el).value=''; F.refresh(); setTimeout(F.next,240); }, el);
      $('#i-otra',el).addEventListener('input',function(e){ var v=e.target.value.trim(); if(v){ a.origen={ciudad:v, iata:null, pais:a._pais||'es', otra:true}; $$('[data-c]',el).forEach(function(x){ x.classList.remove('on'); }); } F.refresh(); }); },
    valid:function(a){ return !!(a.origen && a.origen.ciudad); }});
  var fechasDadas = t.fechas && (t.fechas.modo==='fijas' || t.fechas.mes);
  if(fechasDadas){
    L.push(paso_({id:'fechasOk', tipo:'single', bg:bg(), t:['¿Puedes',''+fechasTexto(t)+'?'], s:'Solo lo ve el cálculo: si alguien no puede, el grupo sabrá que hay un problema de fechas, pero no quién.', layout:'rows', opts:[
      {v:'si', label:'Sí, sin problema', art:'calendario'}, {v:'justo', label:'Sí, pero muy justo', sub:'Mejor no alargarlo', art:'reloj'}, {v:'no', label:'No puedo en esas fechas', art:'almohada'}]}));
  }
  if(!fechasDadas){
    L.push({id:'meses', bg:bg(), t:['¿Qué meses','te van bien?'], s:'Marca todos los que puedas. Gana el que más os encaje a todos.',
      html:function(a){ return mesesChips(a.meses||[], true); },
      wire:function(el,a,F){ on('[data-m]','click',function(e,b){ var m=+b.dataset.m, arr=(a.meses||[]).slice(), i=arr.indexOf(m); if(i>-1) arr.splice(i,1); else arr.push(m); a.meses=arr; b.classList.toggle('on'); F.refresh(); }, el); },
      valid:function(a){ return (a.meses||[]).length>0; }});
  }
  if(!(t.fechas && t.fechas.modo==='fijas') && !t.dias){
    L.push(paso_({id:'dias', tipo:'single', num:true, bg:bg(), t:['¿Cuántos días','puedes escaparte?'], s:'Manda quien menos pueda, para que nadie se quede fuera.', layout:'three',
      opts:[2,3,4,5,7,10].map(function(d){ return {v:d, label:d+' días', art:'calendario'}; })}));
  }
  var mesConocido = fixedMes || ((a.meses||[]).length && (a.meses||[]).every(function(m){ return ENG.estacion(m)===ENG.estacion(a.meses[0]); }) ? a.meses[0] : 0);
  var est = ENG.estacion(mesConocido);
  var PRIOS = [{v:'playa', label:'Playa y mar', art:'mar'}, {v:'naturaleza', label:'Naturaleza y rutas', art:'campo'}, {v:'montana', label:'Montaña', art:'montana'}, {v:'ciudad', label:'Ciudad con vida', art:'ciudad'},
    {v:'cultura', label:'Historia y arte', art:'ruinas'}, {v:'gastronomia', label:'Comer bien', art:'trattoria'}, {v:'fiesta', label:'Fiesta', art:'fiesta'}, {v:'aventura', label:'Adrenalina', art:'cumbre'},
    {v:'relax', label:'Descansar', art:'relax'}, {v:'postal', label:'Sitios de postal', art:'atardecer'}];
  if(est==='invierno' && !ZF) PRIOS = PRIOS.filter(function(x){ return x.v!=='playa'; });
  if(ZF){ var pz = ZF.perfil||{}; PRIOS = PRIOS.filter(function(x){ return (pz[x.v]||0)>=1 || x.v==='postal' || x.v==='gastronomia' || x.v==='relax'; }); }
  L.push(paso_({id:'prioridades', tipo:'multi', max:3, bg:bg(), t: ZF ? ['En '+ZF.corto+',','¿qué es lo tuyo?'] : (SL ? ['Entre '+joinY(SL.map(function(z){ return z.corto; }))+',','¿qué te importa más?'] : ['¿Qué te importa','más del viaje?']), s:'Elige hasta tres. Pesan más que todo lo demás.', layout:'three', opts:PRIOS}));
  if(!ZF && (a.prioridades||[]).length){
    var etq = {}; PRIOS.forEach(function(x){ etq[x.v]=x; });
    L.push(paso_({id:'innegociable', tipo:'single', bg:bg(), t:['¿Alguna','es innegociable?'], s:'Si la marcas, descarto los destinos que casi no la tienen. Úsalo solo si de verdad no viajarías sin eso.', layout:'rows',
      opts:(a.prioridades||[]).filter(function(v){ return etq[v]; }).map(function(v){ return {v:v, label:'Sin '+etq[v].label.toLowerCase()+' no voy', art:etq[v].art}; }).concat([{v:'nada', label:'Ninguna, me adapto', sub:'Lo más habitual', art:'estrella'}])}));
  }
  if(!ZF){
    if(est==='invierno') L.push(paso_({id:'nieve', tipo:'single', bg:bg(), t:['En invierno,','¿nieve?'], opts:[{v:'si', label:'Sí: nieve, esquí o raquetas', art:'nieve'},{v:'no', label:'No: ciudad, bares y calefacción', art:'ciudad'}]}));
    else L.push(paso_({id:'clima', tipo:'single', bg:bg(), t:['¿Qué tiempo','te va?'], layout:'three', opts:[{v:'fresco', label:'Fresquito', sub:'Me agobia el calor', art:'fresco'}, {v:'templado', label:'Templado', sub:'Ni frío ni calor', art:'sol'}, {v:'calor', label:'Calor', sub:'Cuanto más, mejor', art:'calor'}]}));
  }
  var est2 = ENG.estacion(mesConocido);
  var quiereMar = (a.prioridades||[]).indexOf('playa')>-1 || (ZF && (ZF.perfil.playa||0)>=2 && est2!=='invierno');
  var quiereCiudad = false &&  (ZF && (ZF.perfil.ciudad||0)>=2);
  var quiereNieve = a.nieve==='si' || (ZF && ZF.nieve && est2==='invierno');
  if(quiereNieve) L.push(paso_({id:'nieveAct', tipo:'single', bg:bg(), t:['En la nieve,','¿tú qué?'], s:'Cada uno lo suyo: así reparto los días.', layout:'three', opts:[
    {v:'esqui', label:'Esquiar', sub:'Pistas y remontes', art:'esqui'}, {v:'raquetas', label:'Raquetas', sub:'Andar por la nieve', art:'raquetas'}, {v:'trineo', label:'Trineo y risas', sub:'Sin saber esquiar', art:'trineo'}, {v:'relax', label:'Termas y chimenea', sub:'Nieve desde dentro', art:'relax'}]}));
  if(quiereMar && est2!=='invierno') L.push(paso_({id:'playa', tipo:'single', bg:bg(), t:['¿Qué playa','es la tuya?'], layout:'three', opts:[
    {v:'cala', label:'Cala escondida', sub:'Aunque haya que andar', art:'cala'}, {v:'lido', label:'Hamaca y chiringuito', sub:'Cómodo y sin líos', art:'lido'}, {v:'barco', label:'Desde un barco', sub:'Islas y cuevas', art:'barco'}]}));
  if(quiereCiudad) L.push(paso_({id:'ciudad', tipo:'single', bg:bg(), t:['En una ciudad,','¿por dónde tiras?'], layout:'three', opts:[
    {v:'museos', label:'Museos y arte', sub:'Los grandes, con entrada', art:'museo'}, {v:'barrios', label:'Perderme por barrios', sub:'Callejear sin mapa', art:'barrio'}, {v:'mercados', label:'Mercados y tiendas', sub:'Comer y curiosear', art:'mercado'}]}));
  L.push(paso_({id:'momento', tipo:'single', bg:bg(), t:['¿Qué foto','subirías a stories?'], s:'Tu momento del viaje. Intento que salga.', layout:'three', opts:[
    {v:'atardecer', label:'Atardecer en un mirador', art:'atardecer'}, {v:'cena', label:'Mesa larga comiendo', art:'trattoria'}, {v:'fiesta', label:'Bailando a las tres', art:'fiesta'},
    {v:'cumbre', label:'Arriba del todo', art:'cumbre'}, {v:'agua', label:'Saltando al agua', art:'agua'}, {v:'ruinas', label:'Entre ruinas de 2.000 años', art:'ruinas'}]}));
  L.push(paso_({id:'duelo2', tipo:'single', bg:bg(), t:['Una mañana libre:','¿qué prefieres?'], layout:'duelo', opts:[
    {v:'museo', label:'Un museo de los buenos', art:'museo'}, {v:'mercado', label:'Un mercado y comer de pie', art:'mercado'}]}));
  L.push(paso_({id:'andar', tipo:'single', bg:bg(), t:['¿Cuánto','quieres andar?'], layout:'three', opts:[
    {v:'poco', label:'Lo justo', sub:'Paseos y transporte', art:'andar1'}, {v:'medio', label:'Rutas cortas', sub:'Un par de horas', art:'andar2'}, {v:'mucho', label:'Lo que haga falta', sub:'Senderos y subidas', art:'andar3'}]}));
  if(ZF && ZF.bases.length>1){
    L.push(paso_({id:'base', tipo:'single', bg:bg(), t:['¿Dónde','dormimos?'], s:'Elige la base desde la que moverse por '+ZF.corto+'.', layout:'rows',
      opts:ZF.bases.map(function(b){ return {v:b.id, label:b.nombre, sub:b.por_que+(b.sin_coche?'':' · mejor con coche'), art:b.ambiente==='fiesta'?'fiesta':(b.ambiente==='calma'?'calma':'mapa')}; })}));
  }
  var vieneMar = (a.prioridades||[]).indexOf('playa')>-1;
  L.push(paso_({id:'noche', tipo:'single', bg:bg(), t: vieneMar ? ['Y cuando se va el sol,','¿qué?'] : ['¿Cómo son','vuestras noches?'], opts:[
    {v:'fiesta', label:'Salir hasta que cierren', art:'fiesta'}, {v:'aperitivo', label:/no bebe|alcohol/.test(obs)?'Terraceo y algo rico':'Aperitivo y alguna copa', art:'aperitivo'}, {v:'calma', label:'Cena larga y a dormir', art:'calma'}], layout:'three'}));
  var necesitaCoche = !sinCoche && (!ZF || ZF.coche.necesidad!=='innecesario');
  var preguntaCoche = paso_({id:'coche', tipo:'single', bg:null, t:['¿Te toca','conducir?'], s: ZF && ZF.coche.necesidad==='imprescindible' ? 'En '+ZF.corto+' el coche abre medio mapa.' : (a.origen && a.origen.pais==='it' ? 'Si no, tiramos de tren y bus.' : 'Decide si alquilamos coche y qué planes entran.'), layout:'rows', opts:[
    {v:'conduzco', label:'Conduzco yo', sub:'Tengo carnet y me animo', art:'llave'}, {v:'carnet', label:'Tengo carnet, pero paso', sub:'Si hace falta, me turno', art:'carnet'}, {v:'no', label:'Sin carnet', sub:'Transporte público y a pie', art:'tren'}]});
  if(ZF && necesitaCoche){ preguntaCoche.bg=bg(); L.push(preguntaCoche); }
  if(ZF){
    var deck = mazo(ZF, a, fixedMes);
    if(deck.length) L.push({id:'swipe', bg:bg(), t:['¿Qué te apetece hacer?'], s:'Usa los botones o desliza: derecha para guardar, izquierda para pasar, arriba si es imprescindible.', ft:false, html:function(){ return '<div id="deck-host"></div>'; }, wire:function(el,a,F){ swipeDeck(el, deck, a, F, ZF); }});
  } else if((a.prioridades||[]).length){
    var deck2 = mazoAbierto(t, a, mesConocido);
    if(deck2.length) L.push({id:'swipe', bg:bg(), t:['¿Cuáles harías en el viaje?'], s:'Usa los botones o desliza: derecha para guardar, izquierda para pasar, arriba si es imprescindible.', ft:false, html:function(){ return '<div id="deck-host"></div>'; }, wire:function(el,a,F){ swipeDeck(el, deck2, a, F, null); }});
  }
  var aventurero = (a.prioridades||[]).indexOf('aventura')>-1 || (a.supers||[]).length>2;
  L.push(paso_({id:'ritmo', tipo:'single', num:true, bg:bg(), t:aventurero?['Con tanto plan,','¿a qué ritmo?']:['¿A qué ritmo','vas de viaje?'], layout:'three', opts:[
    {v:1, label:'Tranquis', sub:'Un plan al día y mucha terraza', art:'ritmo1'}, {v:2, label:'Equilibrado', sub:'Dos planes y descanso', art:'ritmo2'}, {v:3, label:'A tope', sub:'Exprimir cada hora', art:'ritmo3'}]}));
  L.push(paso_({id:'duelo1', tipo:'single', bg:bg(), t:['Solo puedes una:','¿cuál?'], layout:'duelo', opts:[
    {v:'amanecer', label:'Ver amanecer desde arriba', art:'sol'}, {v:'ultimo_bar', label:'Cerrar el último bar', art:'copa'}]}));
  if(!ZF && necesitaCoche){ preguntaCoche.bg=bg(); L.push(preguntaCoche); }
  var presBajo = t.presupuesto && t.presupuesto<300;
  L.push(paso_({id:'dormir', tipo:'single', bg:bg(), t:['¿Cómo','dormimos?'], layout:'three', opts:[
    {v:'piso', label:'Piso para todos', sub:'Salón común y cocina', art:'piso'},
    {v:'hostel', label:'Hostel', sub:a.noche==='fiesta'?'Gente y ambiente para salir':'Lo más barato', art:'hostel'},
    {v:'hotel', label:'Hotel', sub:presBajo?'Sube bastante el gasto':'Cada uno su habitación', art:'hotel'}]}));
  L.push(paso_({id:'comida', tipo:'single', bg:bg(), t:['¿Y a la hora','de comer?'], layout:'three', opts:[
    {v:'street', label:'De pie y por la calle', sub:'Street food y mercados', art:'street'},
    {v:'trattoria', label:'Mesa y mantel', sub:'Trattoria sin prisa', art:'trattoria'},
    {v:'cocinar', label:a.dormir==='piso'?'Cocinar en el piso':'Mercado y picnic', sub:'Ahorrar para planes', art:'cocinar'}]}));
  L.push(paso_({id:'dieta', tipo:'multi', max:4, bg:bg(), t:['¿Algo que','no comes o no bebes?'], s:'Marca lo que sea. Lo tengo en cuenta en cada comida.', layout:'three', exclusivo:'nada', opts:[
    {v:'nada', label:'Como de todo', art:'todo'}, {v:'vegetariano', label:'Vegetariano', art:'veg'}, {v:'sin_gluten', label:'Sin gluten', art:'singluten'}, {v:'sin_alcohol', label:'Sin alcohol', art:'sinalcohol'}, {v:'sin_pescado', label:'Nada de pescado', art:'pescado'}]}));
  L.push(paso_({id:'capricho', tipo:'single', bg:bg(), t:['Si toca','darse un capricho…'], s:'Una cosa en la que sí gastarías.', layout:'rows', opts:[
    {v:'barco', label:'Un barco o una excursión por mar', art:'barco'}, {v:'experiencia', label:'Algo especial con reserva', sub:'Una visita guiada, una cata, un sitio único', art:'ticket'}, {v:'cena', label:'Una cena buena de verdad', art:'copa'}, {v:'nada', label:'Prefiero no gastar extra', art:'hucha'}]}));
  L.push(paso_({id:'agobio', tipo:'single', bg:bg(), t:['¿Qué te quema','de viajar en grupo?'], s:'Lo evito todo lo que pueda.', layout:'three', opts:[
    {v:'prisas', label:'Ir con prisas', art:'reloj'}, {v:'madrugones', label:'Los madrugones', art:'almohada'}, {v:'coche', label:'Horas de coche', art:'coche'}, {v:'gastar', label:'Gastar de más', art:'cartera'}, {v:'turistadas', label:'Las turistadas', art:'selfie'}, {v:'nada', label:'Nada, me adapto', art:'estrella'}]}));
  L.push({id:'pres', bg:bg(), t:['¿Cuánto quieres','gastarte?'], s:'Por persona y todo incluido (llegar, dormir, comer y planes). Es privado: nadie del grupo lo verá, ni '+jefe+'.',
    html:function(a){ var id=a.presIdeal||Math.min(t.presupuesto||400, 2000), mx=a.presMax||Math.round(id*1.25/25)*25; var sin = a.presSinMax;
      return (t.presupuesto?'<p class="qs"><span class="cap">'+esc(jefe)+' calculó unos '+t.presupuesto+' € por persona</span></p>':'')+
        '<div class="lab">Lo ideal</div><div class="code" id="v-pi" style="font-size:40px">'+id+' €</div><input type="range" id="i-pi" min="100" max="2500" step="25" value="'+id+'" style="width:100%" aria-label="Presupuesto ideal">'+
        '<div class="lab" style="margin-top:14px">Como mucho, si merece la pena</div><div class="code" id="v-pm" style="font-size:40px'+(sin?';opacity:.35':'')+'">'+mx+' €</div><input type="range" id="i-pm" min="100" max="3000" step="25" value="'+mx+'" style="width:100%" aria-label="Presupuesto máximo"'+(sin?' disabled':'')+'>'+
        '<label class="row" style="gap:8px;margin-top:10px;font-size:14px"><input type="checkbox" id="i-psm"'+(sin?' checked':'')+'> No tengo un máximo</label>'; },
    wire:function(el,a){ var ri=$('#i-pi',el), rm=$('#i-pm',el), ck=$('#i-psm',el);
      function sync(){ a.presIdeal=+ri.value; if(+rm.value < +ri.value) rm.value = ri.value; a.presMax = ck.checked ? null : +rm.value; a.presSinMax = ck.checked; $('#v-pi',el).textContent=ri.value+' €'; $('#v-pm',el).textContent=rm.value+' €'; rm.disabled=ck.checked; $('#v-pm',el).style.opacity=ck.checked?.35:1; }
      ri.addEventListener('input', sync); rm.addEventListener('input', function(){ if(+rm.value < +ri.value) ri.value = rm.value; sync(); }); ck.addEventListener('change', sync); sync(); }});
  var sugerencias = ZF ? ZF.actividades.slice(0,40).filter(function(x){ return x.coste!=='alto'; }).slice(0,5).map(function(x){ return x.nombre; }) : ['Ver el atardecer','Comer una pizza de verdad','Hacer una ruta a pie','Algún museo bueno','Bañarnos en una cala'];
  L.push({id:'nota', bg:bg(), t:['¿Algo que','no te quieras perder?'], s:'O algo que no soportes. Es opcional.',
    html:function(a){ return '<div class="cities">'+sugerencias.map(function(s){ return '<button type="button" class="chip" data-s="'+esc(s)+'">+ '+esc(s)+'</button>'; }).join('')+'</div><textarea id="i-nota" maxlength="240" placeholder="Escribe aquí">'+esc(a.nota||'')+'</textarea>'; },
    wire:function(el,a){ var tx=$('#i-nota',el); tx.addEventListener('input',function(){ a.nota=tx.value; }); on('[data-s]','click',function(e,b){ var s=b.dataset.s; if(tx.value.indexOf(s)===-1){ tx.value=(tx.value.trim()?tx.value.trim()+'. ':'')+s; a.nota=tx.value; } b.classList.add('on'); }, el); },
    cta:'Terminar', skip:'Nada más'});
  return L;
}
function mazoAbierto(t, a, mes){
  // sin destino fijo: planes reales de los destinos que mejor van con lo que llevas respondido (y lo que ya respondió el grupo)
  var yo = Object.assign({nombre:'yo', done:true}, a); var otros=[]; try{ if(live.code===t.code) otros = Object.keys(live.resps||{}).map(function(k){ return live.resps[k]; }).filter(function(r){ return r && r.done; }); }catch(e){}
  var A = ENG.agregar(t, otros.concat([yo]));
  var cand = ((t.destinos||[]).length>1 ? t.destinos.map(zona).filter(Boolean) : ZONAS);
  var top = cand.map(function(Z){ return {Z:Z, s:ENG.puntuarZona(Z, A, t).score}; }).sort(function(x,y){ return y.s-x.s; }).slice(0,3).map(function(x){ return x.Z; });
  var out=[];
  top.forEach(function(Z, zi){
    var porTipo={};
    var lista = Z.actividades.filter(function(x){ return !(x.meses && x.meses.length && mes && x.meses.indexOf(mes)===-1) && !(a.coche==='no' && x.coche); })
      .map(function(x){ return {x:x, s:ENG.encaje(x, yo).s}; }).sort(function(p,q){ return q.s-p.s; });
    var n=0; lista.forEach(function(o){ if(n>=(zi===0?5:4)) return; if((porTipo[o.x.tipo]||0)>=2) return; porTipo[o.x.tipo]=(porTipo[o.x.tipo]||0)+1; n++; out.push(Object.assign({}, o.x, {_z:Z})); });
  });
  // intercalar destinos para que no se note el orden
  var mix=[]; for(var r=0;r<5;r++){ top.forEach(function(Z){ var c=out.filter(function(x){ return x._z===Z; })[r]; if(c) mix.push(c); }); }
  return mix.slice(0,12);
}
function mazo(Z, a, mes){
  var porTipo={}, out=[];
  var cand = Z.actividades.filter(function(x){ return !(x.meses && x.meses.length && mes && x.meses.indexOf(mes)===-1) && !(a.coche==='no' && x.coche); });
  cand.forEach(function(x){ porTipo[x.tipo]=(porTipo[x.tipo]||0); if(porTipo[x.tipo]<3 && out.length<12){ porTipo[x.tipo]++; out.push(x); } });
  return out;
}
var ART_TIPO = {cultura:'cultura', gastronomia:'gastronomia', naturaleza:'naturaleza', playa:'playa', fiesta:'fiesta', aventura:'aventura', bienestar:'calma', compras:'compras', postal:'postal', agua:'agua', musica:'fiesta'};
var ETQ_COSTE = {gratis:'Gratis', bajo:'Barato', medio:'Precio medio', alto:'Caro'};
var ETQ_DUR = {'1h':'Una hora', '2h':'Un par de horas', medio_dia:'Medio día', dia_completo:'Día entero'};
function swipeDeck(el, deck, a, F, Z){
  var ids = deck.map(function(x){ return (Z || x._z).id+'/'+x.id; });
  var key = Z ? Z.id : 'abierto';
  if(a._ordenMazo && a._claveMazo===key){
    var saved = a._ordenMazo.map(function(id){
      var parts=id.split('/'), zz=zona(parts[0]);
      var act=zz && zz.actividades.find(function(x){ return x.id===parts[1]; });
      return act && (Z ? act : Object.assign({}, act, {_z:zz}));
    }).filter(Boolean);
    if(saved.length){ deck=saved; ids=deck.map(function(x){ return (Z || x._z).id+'/'+x.id; }); }
  }
  a._ordenMazo=ids; a._claveMazo=key;
  F.save();
  var votes = a._mazo || {};
  var i = ids.findIndex(function(id){ return !votes[id]; });
  if(i<0) i=deck.length;
  var pending = false;
  var host=$('#deck-host',el);
  function card(x){
    var zz=Z || x._z, f=FOTOS_PLAN[zz.id]===x.id && FOTOS_ZONA[zz.id];
    return '<article class="sw"><div class="top-il" style="background:'+zz.bg+'">'+
      '<div class="sw-landscape" aria-hidden="true">'+ART.vista(zz,false)+'</div>'+ART.q(ART_TIPO[x.tipo]||'mapa')+
      (f?'<img class="sw-photo" src="'+fotoSrc(zz.id)+'" alt="'+esc(f[0])+'" decoding="async" draggable="false">':'')+'</div>'+
      '<span class="stamp st-l">ME GUSTA</span><span class="stamp st-r">PASO</span><span class="stamp st-s">IMPRESCINDIBLE</span>'+
      '<div class="in"><div class="sw-meta">'+esc(zz.corto)+(x.donde&&x.donde!==zz.corto?' · '+esc(x.donde):'')+'</div>'+
      '<h3>'+esc(x.nombre)+'</h3>'+(x.descripcion?'<p>'+esc(x.descripcion)+'</p>':'')+
      '<div class="row wrap" style="gap:6px"><span class="pill">'+(ETQ_COSTE[x.coste]||'')+'</span>'+
      '<span class="pill">'+(ETQ_DUR[x.duracion]||'')+'</span>'+(x.coche?'<span class="pill">Con coche</span>':'')+'</div>'+
      (f?'<details class="sw-credit"><summary>Créditos de la foto</summary>'+fotoCredito(f,true)+'</details>':'')+'</div></article>';
  }
  function show(){
    if(i>=deck.length){ F.next(); return; }
    host.innerHTML = '<div class="deck">'+card(deck[i])+'</div><div class="swb">'+
      '<button type="button" id="sw-no"><span aria-hidden="true">✕</span> Paso</button>'+
      '<button type="button" id="sw-si"><span aria-hidden="true">♥</span> Me gusta</button>'+
      '<button type="button" id="sw-si2"><span aria-hidden="true">★</span> Imprescindible</button></div>'+
      '<p class="sw-tools"><span class="cap">'+(i+1)+' de '+deck.length+'</span>'+
      (i>0&&votes[ids[i-1]]?'<button type="button" class="lnk" id="sw-deshacer">Deshacer</button>':'')+
      '<button type="button" class="lnk" id="sw-fin">Saltar el resto</button></p>';
    var c = $('.sw', host), foto=$('.sw-photo', c);
    if(foto){
      function sinFoto(){ foto.remove(); $('.sw-credit',c).remove(); }
      foto.addEventListener('error', sinFoto);
      if(foto.complete && !foto.naturalWidth) sinFoto();
    }
    var deshacer=$('#sw-deshacer', host);
    if(deshacer) deshacer.onclick=function(){
      if(pending) return;
      delete votes[ids[--i]];
      guardarVotos();
      show();
      var boton=$('#sw-deshacer',host) || $('#sw-no',host);
      boton.focus({preventScroll:true});
    };
    drag(c, function(dir){ decidir(dir); });
    $('#sw-no',el).onclick=function(){ volar(c,'l'); }; $('#sw-si',el).onclick=function(){ volar(c,'r'); }; $('#sw-si2',el).onclick=function(){ volar(c,'u'); }; $('#sw-fin',el).onclick=function(){ if(!pending) F.next(); };
  }
  function guardarVotos(){
    a._mazo=votes;
    a.likes=[]; a.supers=[]; a.likesZ={}; a.pasos=[];
    ids.forEach(function(id, j){
      var v=votes[id], x=deck[j];
      if(v==='l') a.pasos.push(id);
      if(v==='r'||v==='u'){
        a.likes.push(x.id);
        if(v==='u') a.supers.push(x.id);
        if(x._z) a.likesZ[x._z.id]=(a.likesZ[x._z.id]||0)+(v==='u'?2:1);
      }
    });
    F.save();
  }
  function decidir(dir){
    var botonActivo=document.activeElement && document.activeElement.id;
    votes[ids[i]]=dir;
    guardarVotos();
    do { i++; } while(i<ids.length && votes[ids[i]]);
    pending=false;
    show();
    if(host.isConnected && botonActivo && botonActivo.startsWith('sw-')){
      var boton=document.getElementById(botonActivo);
      if(boton) boton.focus({preventScroll:true});
    }
  }
  function volar(c,dir){ if(pending) return; pending=true; c.style.transition='transform .28s ease-out, opacity .28s'; c.style.transform = dir==='l'?'translate(-130%,30px) rotate(-18deg)':(dir==='r'?'translate(130%,30px) rotate(18deg)':'translateY(-130%)'); c.style.opacity='0'; setTimeout(function(){ if(host.isConnected) decidir(dir); },220); }
  function drag(c, done){ var sx=0, sy=0, dx=0, dy=0, act=false, id=null; var sl=c.querySelector('.st-l'), sr=c.querySelector('.st-r'), ss=c.querySelector('.st-s');
    c.addEventListener('pointerdown', function(e){ if(e.button!==0 || e.target.closest('summary,a') || pending) return; act=true; id=e.pointerId; sx=e.clientX; sy=e.clientY; try{ c.setPointerCapture(id); }catch(er){} });
    c.addEventListener('pointermove', function(e){ if(!act) return; dx=e.clientX-sx; dy=e.clientY-sy; c.style.transform='translate('+dx+'px,'+dy+'px) rotate('+(dx/16)+'deg)'; sl.style.opacity=dx>0?Math.min(1,dx/90):0; sr.style.opacity=dx<0?Math.min(1,-dx/90):0; ss.style.opacity=(dy<0&&-dy>Math.abs(dx))?Math.min(1,-dy/80):0; });
    function up(){ if(!act) return; act=false; if(dy<-80 && -dy>Math.abs(dx)) volar(c,'u'); else if(dx>90) volar(c,'r'); else if(dx<-90) volar(c,'l'); else { c.style.transition='transform .2s'; c.style.transform=''; sl.style.opacity=sr.style.opacity=ss.style.opacity=0; setTimeout(function(){ c.style.transition=''; },200); } dx=dy=0; }
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', function(){ act=false; dx=dy=0; c.style.transform=''; sl.style.opacity=sr.style.opacity=ss.style.opacity=0; }); }
  show();
}
function empezarPreguntas(code, miembro, tPre){
  var t = tPre || (live.code===code && live.trip) || null;
  if(!t){ tripRef(code).get().then(function(s){ if(s.exists) empezarPreguntas(code, miembro, s.data()); }); return; }
  var m = t.integrantes.filter(function(x){ return x.id===miembro; })[0] || {nombre:'Tú'};
  var ans = ls('borrador.'+code);
  if(!ans){
    var prev = (live.code===code && live.resps[miembro]) || null;
    if(prev && prev.done && !t._priv){ db.doc('viajes2/'+code+'/priv/'+miembro).get().then(function(sn){ var t2=Object.assign({}, t, {_priv: sn.exists ? sn.data() : {}}); empezarPreguntas(code, miembro, t2); }, function(){ var t2=Object.assign({}, t, {_priv:{}}); empezarPreguntas(code, miembro, t2); }); return; }
    ans = prev && prev.done ? Object.assign({}, prev, t._priv||{}, {_i:0, _editando:true}) : {};
    delete ans.done; delete ans.updatedAt; delete ans.nombre; delete ans.avatar;
    if(ans._editando && ans.presMax==null && ans.presIdeal) ans.presSinMax = true;
  }
  Flow({ who:m.nombre+' · '+tituloViaje(t), ans:ans, start:Math.max(0, (ans._i||0)), confirmClose:true, onStep:function(a, i){ a._i=i; ls('borrador.'+code, a); },
    steps:function(a){ return pasosPreguntas(t, a); },
    onDone:function(a){ guardarRespuestas(code, miembro, m.nombre, a, t); },
    onClose:function(){} });
}
function respuestaLimpia(a, nombre){
  var r = {nombre:nombre, done:true, updatedAt:Date.now()};
  ['origen','meses','dias','fechasOk','prioridades','innegociable','clima','nieve','nieveAct','playa','momento','duelo1','duelo2','andar','base','noche','coche','likes','supers','likesZ','pasos','ritmo','dormir','comida','dieta','capricho','agobio','presIdeal','presMax','nota'].forEach(function(k){ if(a[k]!==undefined && a[k]!==null && a[k]!=='') r[k]=a[k]; });
  if(r.origen) r.origen = {ciudad:r.origen.ciudad, iata:r.origen.iata||null, pais:r.origen.pais||'es'};
  if(r.innegociable==='nada') delete r.innegociable;
  if(a.presSinMax) delete r.presMax;
  r.v = 2;
  var p=perfil(); if(avatarOk(p.foto)) r.avatar = p.foto;
  return r;
}
async function guardarRespuestas(code, miembro, nombre, a, t){
  var r = respuestaLimpia(a, nombre);
  var partes = SERVIDOR.separar(r);
  try{
    await db.doc('viajes2/'+code+'/priv/'+miembro).set(partes.priv);
    await db.doc('viajes2/'+code+'/resp/'+miembro).set(partes.pub);
    ls('borrador.'+code, null); ls('mispriv.'+code, partes.priv);
    pantallaFin(code, t, false);
    ZSTORE.motor(code, 'calcular').catch(function(e){ console.warn('motor', e); });
  }catch(e){ console.error(e); toast('No se han podido guardar tus respuestas. Revisa la conexión y dale otra vez a terminar.'); }
}
function pantallaFin(code, t, sinPermiso){
  S.view='viaje'; S.code=code; S.sub='resumen'; suscribir(code);
  Flow({ who:tituloViaje(t), ans:{}, bg:'#30231F', steps:function(){ return [{id:'fin', bg:'#4EAAA0', t:['Respuestas guardadas'], s:'Tus respuestas están guardadas. En un momento verás las propuestas de destino; si falta gente, serán provisionales hasta que respondan.', html:function(){ return '<div style="width:60%;margin:0 auto">'+ART.q('maleta')+'</div>'+botonesCompartir(t); }, wire:function(el){ wireCompartir(el,t); }, cta:'Ver cómo va el viaje'}]; }, onDone:function(){ render(); }, onClose:function(){} });
}
/* ---------- VIAJE ---------- */
function abrirViaje(code){ S.code=code; S.view='viaje'; S.sub = S.sub||'resumen'; ls('ult',code); suscribir(code); render(); window.scrollTo(0,0); }
function vistaViaje(){
  var code=S.code, t=live.trip, me=miEntrada(code);
  if(live.code!==code) suscribir(code);
  if(!live.loaded) return cabecera()+'<div class="card"><p class="muted">Cargando viaje…</p></div>';
  if(!t) return cabecera()+'<div class="empty">'+ART.q('mapa')+'<b>No encontramos este viaje</b><p class="muted">'+'Puede que se haya borrado o que el enlace esté mal copiado.'+'</p><button class="btn" id="b-quitar">Quitarlo de mi lista</button></div>'+(function(){ wire(function(){ on('#b-quitar','click',function(){ quitarMiViaje(code); S.view='viajes'; render(); }); }); return ''; })();
  var Z = t.plan && zona(t.plan.zona);
  if(me) guardarMiViaje({code:code, titulo:tituloViaje(t, Z), zona:Z?Z.id:null, estado: estadoTexto(t)});
  var R = live.resps, ints=t.integrantes||[], hechos = ints.filter(function(m){ return R[m.id]&&R[m.id].done; }).length;
  var soyJefe = me && me.miembro===t.jefe, yoHecho = me && R[me.miembro] && R[me.miembro].done;
  var html = cabecera('<button class="btn xs ghost" id="b-back">← Viajes</button>');
  if(Z){
    var dark = ART.lum(Z.bg)<0.35;
    html += '<div class="poster'+(dark?' dark':'')+'" style="--zbg:'+Z.bg+'"><div class="art">'+ART.vista(Z,true)+'</div><div class="tt"><div class="lab" style="color:inherit">'+esc(fechasTexto(t, agregado()))+'</div><div class="d reg" data-t="'+esc(Z.corto)+'" style="--signal:'+Z.inks[2]+'">'+esc(Z.corto)+'</div></div></div>';
    html += '<p class="a" style="font-size:19px;margin:10px 0 2px">'+esc(t.plan ? cap(ENG.frasePlan(Z, t.plan)) : Z.lema)+'</p>';
  } else {
    var faseTxt = hechos===ints.length ? (destinoFijo(t) ? 'Ya estáis todos. Preparando el plan…' : (soyJefe ? 'Ya estáis todos. Elige propuesta y sale el plan.' : 'Ya estáis todos. Falta que '+esc(nombreDe(t, t.jefe))+' elija destino.')) : (hechos ? 'Con lo respondido ya hay propuestas, pero son provisionales: pueden cambiar cuando responda el resto.' : 'Cuando respondáis, salen las propuestas de destino.');
    html += '<div class="card stack hero-prog"><div class="lab">'+esc(t.code)+' · '+hechos+' de '+ints.length+' han respondido</div><h2 class="d">'+esc(tituloViaje(t))+'</h2><div class="meter"><i style="width:'+Math.round(100*hechos/Math.max(1,ints.length))+'%"></i></div><p style="font-weight:700">'+faseTxt+'</p></div>';
  }
  if(me && !yoHecho) html += '<div class="card stack" style="margin-top:12px;border-color:var(--signal)"><b>Te toca responder</b><p class="muted">'+(ls('borrador.'+code)&&ls('borrador.'+code)._i ? 'Lo dejaste a medias: sigues por donde ibas.' : 'Unas '+pasosPreguntas(t,{}).length+' preguntas rápidas, casi todas de un toque. Cuanto más afines, más tuyo sale el plan.')+'</p><button class="btn full" id="b-resp">'+(ls('borrador.'+code)&&ls('borrador.'+code)._i?'Seguir con mis preguntas':'Responder mis preguntas')+'</button></div>';
  if(me && yoHecho && !t.plan) html += '<p style="margin:10px 0 0"><button class="lnk" id="b-resp">Cambiar mis respuestas</button></p>';
  if(!me) html += '<div class="card stack" style="margin-top:12px"><b>¿Vas en este viaje?</b><button class="btn full" id="b-soy">Elegir mi nombre</button></div>';
  if(!Z){
    var todos = hechos===ints.length;
    if(me && yoHecho) html += seccionPropuestas(t, me, soyJefe && todos && !!live.res && !live.res.provisional);
    html += '<div class="card stack" style="margin-top:12px"><div class="lab">El grupo</div>'+ints.map(function(m){ var r=R[m.id]; return '<div class="row"><span class="av s" style="'+avatarEstilo(r&&r.avatar)+'">'+(avatarOk(r&&r.avatar)?'':inicial(m.nombre))+'</span><span class="grow">'+esc(m.nombre)+(m.id===t.jefe?' <span class="muted">· organiza</span>':'')+'</span>'+(r&&r.done?'<span class="pill ok">Listo</span>':'<span class="pill">Pendiente</span>')+'</div>'; }).join('')+
      (todos ? '' : '<div class="hr"></div><div class="lab">Invita a los que faltan</div>'+botonesCompartir(t))+
      (soyJefe && destinoFijo(t) && hechos>0 && hechos<ints.length ? '<button class="btn ghost full" id="b-gen">Sacar el plan ya con '+hechos+' respuesta'+(hechos>1?'s':'')+'</button>' : '')+
      '<button class="lnk" id="b-grupo" style="align-self:flex-start">'+(soyJefe?'Añadir o quitar gente · cambiar el enlace':'Ver el grupo · salir del viaje')+'</button>'+
    '</div>';
    if(me && yoHecho && !todos) html += seccionPropuestas(t, me, soyJefe);
    var LL0=live.lista||[]; html += '<button class="card row" id="b-lista0" style="cursor:pointer;width:100%;text-align:left;margin-top:12px"><span class="grow"><b>Lista del viaje</b><br><span class="muted" style="font-size:14px">'+(LL0.length? LL0.filter(function(x){ return x.hecho; }).length+' de '+LL0.length+' hechas' : 'Id apuntando lo que no se os puede olvidar')+'</span></span><span class="btn xs">Abrir</span></button>';
    wire(function(){ on('#b-lista0','click',function(){ S.listaCode=t.code; S.view='lista'; render(); window.scrollTo(0,0); });  wireCompartir(document, t); on('#b-gen','click',function(){ generar(null).then(function(x){ if(x!==null) toast('Plan generado'); }); }); on('#b-grupo','click',function(){ hojaGestionGrupo(t); }); });
  } else {
    var fp = t.plan.firmaRespuestas || t.firma;
    if(fp && fp!==firma() && !(destinoFijo(t) && !t.plan.editado)) html += '<div class="note" style="margin-top:10px"><b>El plan puede estar desactualizado.</b> Alguien ha respondido o cambiado sus respuestas después de hacerlo.'+(soyJefe||destinoFijo(t) ? ' <button class="lnk" id="b-regen">Rehacer el plan</button>'+(t.plan.editado?' (se pierden los cambios a mano)':'')+'.' : ' Avisa a '+esc(nombreDe(t, t.jefe))+' si queréis rehacerlo.')+'</div>';
    html += '<div class="tabs" role="tablist">'+[['resumen','Resumen'],['dias','Día a día'],['lista','Lista'],['grupo','Grupo'],['tarjeta','Tarjeta']].map(function(x){ return '<button role="tab" data-sub="'+x[0]+'" class="'+(S.sub===x[0]?'on':'')+'" aria-selected="'+(S.sub===x[0])+'">'+x[1]+'</button>'; }).join('')+'</div><div style="height:12px"></div>';
    var A = agregado();
    if(S.sub==='dias') html += subDias(t, Z, A);
    else if(S.sub==='lista') html += subLista(t, Z, A);
    else if(S.sub==='grupo') html += subGrupo(t, Z, A, soyJefe);
    else if(S.sub==='tarjeta') html += subTarjeta(t, Z, A);
    else html += subResumen(t, Z, A);
    wire(function(){ on('[data-sub]','click',function(e,b){ S.sub=b.dataset.sub; render(); var tb=$('.tabs'); if(tb && window.scrollY>tb.offsetTop) window.scrollTo(0, tb.offsetTop-8); }); on('#b-regen','click',function(){ generar(null); }); });
  }
  if(me && ZSTORE.iaActiva) html += '<button class="btn coral full" id="b-ia" style="margin-top:14px">'+ART.q('nota')+' Pregúntale a Zaino</button>';
  wire(function(){ on('#b-ia','click',function(){ hojaIA(t); }); on('#b-back','click',function(){ S.view='viajes'; render(); }); on('#b-resp','click',function(){ empezarPreguntas(code, me.miembro, t); }); on('#b-soy','click',function(){ if(t && t.token) unirseToken(t.token); else hojaCodigo(); }); });
  return html;
}
function nombreDe(t, id){ return ((t.integrantes||[]).filter(function(m){ return m.id===id; })[0]||{}).nombre || 'quien organiza'; }
var ICON_TIPO = {best:'estrella', budget:'hucha', wildcard:'corazones', fijo:'mapa'};
function fechaCorta(f){ var m=String(f).match(/^(\d{4})-(\d{2})/); return m ? MESES_LARGO[+m[2]-1]+' de '+m[1] : f; }
function textoCoste(c){
  if(!c) return {t:'Sin datos de coste', s:''};
  if(c.min!=null && c.max!=null) return {t:(c.min===c.max ? c.min : c.min+'–'+c.max)+' € por persona', s:'Orientativo: dormir y comer'+(c.fecha?' · datos de '+fechaCorta(c.fecha):'')+'. No incluye '+joinY((c.desconocido||[]).length?c.desconocido:['llegar hasta allí'])+'.'};
  return {t:'Coste por confirmar', s:'No tenemos datos fiables de '+joinY((c.desconocido||[]).length?c.desconocido:['alojamiento'])+' en esa zona, así que no damos un total.'};
}
function fichaPropuesta(t, p, res, me, soyJefe){
  var Z = zona(p.zona); if(!Z) return '';
  var votos = t.votos||{}, misVoto = me && votos[me.miembro]===p.zona;
  var quien = Object.keys(votos).filter(function(k){ return votos[k]===p.zona; }).map(function(k){ return nombreDe(t,k); });
  var c = textoCoste(p.coste);
  var h = '<article class="prop card" data-prop="'+esc(p.zona)+'">';
  h += '<div class="prop-il" style="background:'+Z.bg+'">'+ART.vista(Z,false)+'<span class="prop-tipo">'+ART.q(ICON_TIPO[p.tipo]||'mapa')+esc(p.titulo)+'</span></div>';
  h += '<div class="stack" style="gap:10px;padding-top:12px"><div class="row" style="align-items:flex-end;gap:12px"><div class="grow"><h3 class="d" style="margin:0">'+esc(p.nombre)+'</h3><p class="a" style="margin:2px 0 0;font-size:16px">'+esc(p.lema||'')+'</p></div><div class="pct" aria-label="Compatibilidad del grupo">'+p.compat+'<small>%</small></div></div>';
  h += '<div class="meter"><i style="width:'+p.compat+'%"></i></div>';
  h += '<p style="margin:0">'+esc(p.porque)+'</p>';
  h += '<div class="pp">'+(p.porPersona||[]).map(function(x){ return '<span class="chip'+(me&&x.id===me.miembro?' on':'')+'">'+esc(x.nombre)+' '+x.pct+'%</span>'; }).join('')+'</div>';
  h += '<div class="coste"><b>'+esc(c.t)+'</b><br><span class="muted" style="font-size:13px">'+esc(c.s)+'</span></div>';
  if((p.actividades||[]).length) h += '<div><div class="lab">Planes que os unen</div><ul class="lst">'+p.actividades.slice(0,4).map(function(a){ return '<li>'+esc(a.nombre)+(a.fans.length?' <span class="muted">· '+esc(joinY(a.fans))+'</span>':'')+'</li>'; }).join('')+'</ul></div>';
  h += '<details><summary>Pros, contras y quién cede</summary><div class="stack" style="gap:8px;margin-top:8px">'+
    ((p.pros||[]).length?'<div><div class="lab">A favor</div><ul class="lst ok">'+p.pros.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul></div>':'')+
    ((p.contras||[]).length?'<div><div class="lab">En contra</div><ul class="lst ko">'+p.contras.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul></div>':'')+
    ((p.compromisos||[]).length?'<div><div class="lab">Compromisos</div><ul class="lst">'+p.compromisos.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul></div>':'')+
    ((p.dudas||[]).length?'<div><div class="lab">Ojo</div><ul class="lst">'+p.dudas.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul></div>':'')+
    '<p class="muted" style="font-size:12px;margin:0">Cómo sale el '+p.compat+'%: '+esc(p.formula)+((p.ajustes||[]).length?' ('+esc(p.ajustes.map(function(a){ return a.que+' '+a.v; }).join(' · '))+')':'')+'. Cada %, de 0 a 100, mide cuánto de lo que pide esa persona tiene la zona en vuestras fechas.</p>'+
    ((p.coste&&p.coste.fuentes||[]).length?'<p class="muted" style="font-size:12px;margin:0">Fuentes del coste: '+p.coste.fuentes.slice(0,3).map(function(f){ return /^https?:/.test(f)?'<a href="'+esc(f)+'" target="_blank" rel="noopener">'+esc(f.replace(/^https?:\/\/(www\.)?/,'').split('/')[0])+'</a>':esc(f); }).join(' · ')+'</p>':'')+
  '</div></details>';
  if(p.tipo!=='fijo'){
    h += '<div class="row wrap" style="gap:8px"><button class="btn sm '+(misVoto?'':'ghost')+' grow" data-votar="'+esc(p.zona)+'" aria-pressed="'+misVoto+'">'+(misVoto?'♥ Tu voto':'Me apunto a esta')+'</button>'+
      (soyJefe?'<button class="btn sm grow" data-elegir="'+esc(p.zona)+'">Elegir '+esc(p.nombre)+'</button>':'')+'</div>';
    if(quien.length) h += '<p class="muted" style="font-size:13px;margin:0">Votos: '+esc(joinY(quien))+'</p>';
  }
  return h+'</div></article>';
}
function seccionPropuestas(t, me, soyJefe){
  var res = live.res;
  if(!res || !res.propuestas){
    var cf = calcFallos[t.code];
    if(cf && cf.n>REINTENTOS){ wire(function(){ on('#b-reint','click',reintentarCalculo); }); return '<div class="card stack" style="margin-top:12px"><p class="muted" style="margin:0">No se han podido calcular las propuestas. Revisa la conexión y vuelve a intentarlo.</p><button class="btn sm" id="b-reint">Reintentar</button></div>'; }
    return '<div class="card" style="margin-top:12px"><p class="muted" style="margin:0">Calculando propuestas…</p></div>';
  }
  var h = '<section class="stack" style="margin-top:16px;gap:12px"><div class="row" style="align-items:center"><h2 class="d grow" style="margin:0">'+(res.propuestas.length>1?'Vuestras propuestas':'Vuestro destino')+'</h2>'+(res.provisional?'<span class="pill warn">Provisional</span>':'<span class="pill ok">Con todo el grupo</span>')+'</div>';
  if(res.provisional) h += '<p class="muted" style="margin:0;font-size:14px">Salen de '+res.respondidos.length+' de '+res.n_total+' respuestas. Cuando responda el resto pueden cambiar.</p>';
  var G = res.grupo||{}, F = res.fechas||{};
  var bloques = [];
  (F.problemas||[]).forEach(function(x){ bloques.push('<li class="ko">'+esc(x)+'</li>'); });
  (G.coincidencias||[]).slice(0,3).forEach(function(x){ bloques.push('<li class="ok">'+esc(x.texto)+'</li>'); });
  (G.incompatibles||[]).slice(0,3).forEach(function(x){ bloques.push('<li>'+esc(x.texto)+'. <span class="muted">'+esc(x.compromiso)+'</span></li>'); });
  (G.diferencias||[]).slice(0,2).forEach(function(x){ bloques.push('<li>'+esc(x.texto)+'</li>'); });
  (G.limitantes||[]).slice(0,3).forEach(function(x){ bloques.push('<li>'+esc(x.texto)+'</li>'); });
  if(bloques.length) h += '<div class="card"><div class="lab">Cómo es vuestro grupo</div><ul class="lst">'+bloques.join('')+'</ul></div>';
  if(!res.propuestas.length) h += '<div class="card note"><b>Ningún destino cumple todo lo que habéis marcado.</b><p style="margin:6px 0 0">Mirad abajo por qué se descartan. Lo más habitual: un presupuesto máximo muy bajo o algo marcado como innegociable.</p></div>';
  res.propuestas.forEach(function(p){ h += fichaPropuesta(t, p, res, me, soyJefe); });
  if((res.descartados||[]).length && (t.destinos||[]).length!==1) h += '<details class="card"><summary><b>Descartados y por qué</b></summary><ul class="lst" style="margin-top:8px">'+res.descartados.map(function(d){ var z=zona(d.zona); return z?'<li><b>'+esc(z.corto)+'</b>: '+esc((d.motivos||[]).join('; '))+'</li>':''; }).join('')+'</ul></details>';
  if(res.sinComprobarPresupuesto) h += '<p class="muted" style="font-size:12px;margin:0">En algún destino no tenemos datos de alojamiento, así que no hemos podido comprobar el presupuesto máximo. Revisadlo antes de reservar.</p>';
  h += '</section>';
  wire(function(){
    on('[data-votar]','click',function(e,b){ var z=b.dataset.votar, v={}; v[me.miembro] = (t.votos||{})[me.miembro]===z ? null : z; escribir(tripRef(t.code).update({votos:v})).catch(function(){ toast('No se pudo guardar el voto'); }); });
    on('[data-elegir]','click',function(e,b){ hojaElegir(t, b.dataset.elegir, res); });
  });
  return h;
}
function hojaElegir(t, zonaId, res){
  var Z = zona(zonaId); if(!Z) return;
  var faltan = res.n_total - res.respondidos.length;
  hoja('<div class="stack"><h2 class="d">¿Vamos a '+esc(Z.corto)+'?</h2>'+(faltan>0?'<div class="note">Faltan '+faltan+' por responder. Si eliges ya, su opinión no cuenta para el destino (sí para el plan, cuando respondan, si recalculáis).</div>':'')+
    '<p>Se hace el plan día a día con lo que ha pedido cada uno. Lo veréis todos y lo podéis editar. Nada queda reservado.</p><button class="btn full" id="b-el-si">Sí, hacer el plan</button><button class="btn ghost full" id="b-el-no">Todavía no</button></div>', function(el){
    on('#b-el-no','click',cerrarHoja,el);
    on('#b-el-si','click',function(e,b){ b.disabled=true; b.textContent='Haciendo el plan…'; pedirMotor('planear', zonaId).then(function(x){ cerrarHoja(); if(x!==null){ S.sub='resumen'; toast('¡Plan listo!'); } }); }, el);
  });
}
/* ---------- Pregúntale a Zaino (asistente en el servidor; nunca inventa precios ni sitios) ---------- */
var charla = {};
function hojaIA(t){
  var code=t.code, H = charla[code] = charla[code] || [];
  var ejemplos = t.plan ? ['¿Qué hacemos el día 2 si llueve?', 'Algo para Marta, que le va la cultura', '¿Cuánto nos va a costar más o menos?'] : ['¿Por qué sale primero este destino?', '¿Qué pasa si quitamos la fiesta?', '¿Cuál es más barato de los tres?'];
  function burbujas(){ return H.map(function(m, i){
      if(m.role==='user') return '<div class="bub yo">'+esc(m.content)+'</div>';
      var x = '<div class="bub zaino">'+esc(m.content).replace(/\n/g,'<br>')+(m.aviso?'<div class="note" style="margin-top:6px;font-size:13px">Ojo: alguna cifra de esta respuesta no sale de nuestros datos. Compruébala antes de fiarte.</div>':'')+'</div>';
      (m.propuestas||[]).forEach(function(pr, k){ x += '<div class="card flat" style="margin:4px 0 8px"><b>Día '+pr.dia+': '+esc(pr.accion)+'</b> '+esc(nombreAct(t, pr.actividad_id||pr.reemplaza_id))+'<p class="muted" style="font-size:13px">'+esc(pr.motivo||'')+'</p>'+(pr.aplicada?'<span class="pill ok">Aplicado</span>':'<button class="btn xs" data-aplicar="'+i+'.'+k+'">Aplicar al plan</button>')+'</div>'; });
      return x; }).join(''); }
  function pinta(){ return '<div class="stack"><h2 class="d">Pregúntale a Zaino</h2><p class="muted" style="font-size:13px">Contesta con los datos de vuestro viaje y de nuestra biblioteca. Si algo no lo sabe, te lo dice. No ve los presupuestos de nadie.</p>'+
    '<div id="ia-log" class="stack" style="gap:6px">'+(H.length?burbujas():'<div class="cities">'+ejemplos.map(function(e){ return '<button type="button" class="chip" data-ej="'+esc(e)+'">'+esc(e)+'</button>'; }).join('')+'</div>')+'</div>'+
    '<form id="f-ia" class="row"><input type="text" id="i-ia" maxlength="400" placeholder="Escribe tu pregunta" class="grow" autocomplete="off"><button class="btn sm" type="submit">Enviar</button></form></div>'; }
  function preguntar(el, q){
    if(!q) return; H.push({role:'user', content:q}); var sh=el.querySelector('.sheet'); sh.innerHTML='<div class="grab"></div>'+pinta(); conectar(el);
    var log=$('#ia-log',el); log.insertAdjacentHTML('beforeend','<div class="bub zaino muted" id="ia-pensando">Pensando…</div>');
    var hist = H.slice(0,-1).slice(-8).map(function(m){ return {role:m.role, content:m.content}; });
    ZSTORE.ia(code, q, hist).then(function(r){
      var txt = r && r.texto;
      if(!r || r.error){ txt = r && r.error==='limite_diario' ? 'Hoy ya habéis hecho muchas preguntas en este viaje. Mañana vuelvo a estar disponible.' : 'Ahora no puedo contestar. El resto de la app funciona igual; prueba en un rato.'; }
      else if(r.disponible===false) txt = 'El asistente no está activado en este Zaino.';
      H.push({role:'assistant', content:txt||'No tengo una respuesta para eso.', aviso:r&&r.aviso, propuestas:(r&&r.propuestas)||[]});
      if(S.sheet && $('#ia-log')){ sh.innerHTML='<div class="grab"></div>'+pinta(); conectar(el); var lg=$('#ia-log',el); if(lg) lg.lastElementChild && lg.lastElementChild.scrollIntoView({block:'end'}); }
    });
  }
  function conectar(el){
    $('#f-ia',el).addEventListener('submit', function(e){ e.preventDefault(); var v=$('#i-ia',el).value.trim(); preguntar(el, v); });
    on('[data-ej]','click',function(e,b){ preguntar(el, b.dataset.ej); }, el);
    on('[data-aplicar]','click',function(e,b){ var ix=b.dataset.aplicar.split('.').map(Number), pr=H[ix[0]].propuestas[ix[1]]; aplicarPropuestaIA(live.trip||t, pr, function(){ pr.aplicada=true; el.querySelector('.sheet').innerHTML='<div class="grab"></div>'+pinta(); conectar(el); }); }, el);
  }
  hoja(pinta(), conectar);
}
function nombreAct(t, id){ var Z = t.plan && zona(t.plan.zona); var a = Z && Z.actividades.filter(function(x){ return x.id===id; })[0]; return a ? a.nombre : ''; }
function aplicarPropuestaIA(t, pr, ok){
  var Z = t.plan && zona(t.plan.zona); if(!Z){ toast('Todavía no hay plan'); return; }
  var a = pr.actividad_id && Z.actividades.filter(function(x){ return x.id===pr.actividad_id; })[0];
  var nuevo = a ? {k:'act', momento:'tarde', ref:a.id, nombre:a.nombre, por_que:'Sugerido por Zaino: '+(pr.motivo||''), editado:true} : null;
  editarPlan(t, function(plan){ var d = plan.dias[pr.dia-1]; if(!d) return; var sl=d.slots;
    var idx = -1; sl.forEach(function(x,i){ if(x.ref && x.ref===(pr.reemplaza_id||(pr.accion==='quitar'?pr.actividad_id:null))) idx=i; });
    if(pr.accion==='quitar'){ if(idx>-1) sl.splice(idx,1); }
    else if(pr.accion==='cambiar' && idx>-1 && nuevo){ nuevo.momento = sl[idx].momento; sl[idx]=nuevo; }
    else if(nuevo){ var pos=sl.length; if(sl[pos-1] && sl[pos-1].k==='vuelta') pos--; sl.splice(pos,0,nuevo); }
  }, 'Plan actualizado');
  ok();
}
function estadoTexto(t){ var R=live.resps, ints=t.integrantes||[]; var h=ints.filter(function(m){ return R[m.id]&&R[m.id].done; }).length; if(t.plan){ var Z=zona(t.plan.zona); return 'Plan listo'+(Z?': '+Z.corto:'')+' · '+t.plan.dias.length+' días'; } if(h && h===ints.length) return (destinoFijo(t)?'Preparando el plan':'Todos han respondido · toca elegir destino'); return h+' de '+ints.length+' han respondido'; }
function fechasTexto(t, A){
  var f=t.fechas||{}; var dias = A ? A.dias : t.dias;
  if(f.modo==='fijas' && f.inicio && f.fin){ var a=new Date(f.inicio+'T12:00:00'), b=new Date(f.fin+'T12:00:00'); return a.getDate()+(a.getMonth()!==b.getMonth()?' '+MESES_CORTO[a.getMonth()]:'')+' – '+b.getDate()+' '+MESES_CORTO[b.getMonth()]+' '+b.getFullYear()+' · '+dias+' días'; }
  var mes = A ? A.mes : f.mes; return (mes?cap(MESES_LARGO[mes-1])+' · ':'')+dias+' días';
}

function ctaReservas(t, Z, A){
  var rs = ENG.reservas(Z, A, t, t.plan), est=t.reservas||{};
  var vivos = rs.filter(function(r){ return estadoRsv(est[r.key])!=='fuera'; }), hechas = vivos.filter(function(r){ return estadoRsv(est[r.key])==='hecha'; }).length;
  var sig = null; PASOS_RSV.some(function(p){ sig = vivos.filter(function(r){ return p.cats.indexOf(r.cat)>-1 && estadoRsv(est[r.key])!=='hecha'; })[0]; return !!sig; });
  return '<button class="card stack rsv-sig" data-goview="reservas" style="cursor:pointer;width:100%;text-align:left"><div class="row"><span class="grow"><span class="lab">Reservar el viaje · '+hechas+' de '+vivos.length+'</span><br><b style="font-size:18px">'+(sig?'Siguiente: '+esc(sig.titulo):'Todo reservado')+'</b></span><span class="btn sm">'+(hechas?'Seguir':'Empezar')+'</span></div><div class="meter"><i style="width:'+Math.round(100*hechas/Math.max(1,vivos.length))+'%"></i></div></button>';
}
function subResumen(t, Z, A){
  var el = t.eleccion||{}, base = Z.bases.filter(function(b){ return b.id===t.plan.base; })[0]||Z.bases[0];
  var h = '<div class="stack">'+ctaReservas(t, Z, A);
  var REL = ENG.relato(Z, A, t.plan, t); if(REL.length) h += '<div class="card stack relato"><div class="lab">Vuestro plan, en corto</div>'+REL.map(function(x,i){ var tx=esc(x); (t.integrantes||[]).forEach(function(m){ tx=tx.replace(new RegExp('(^|[^\\wáéíóúñ])('+m.nombre.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')(?=[^\\wáéíóúñ]|$)','g'),'$1<b>$2</b>'); }); return '<p'+(i===0?' class="a" style="font-size:19px"':'')+'>'+tx+'</p>'; }).join('')+'</div>';
  h += '<div class="card stack"><div class="lab">Por qué '+esc(Z.corto)+'</div><div class="why-list">'+(el.por_que||[]).map(function(w){ return '<span class="chip">'+esc(w)+'</span>'; }).join('')+'</div>';
  var alts = (el.ranking||[]).filter(function(r){ return r.id!==Z.id; }).slice(0,2);
  if(alts.length && !(t.destinos||[]).length===1) {}
  if(alts.length && (t.destinos||[]).length!==1 && (miEntrada(t.code)||{}).miembro===t.jefe) h += '<p class="muted" style="font-size:14px">También os encajaban: '+alts.map(function(r){ var z=zona(r.id); return z?'<button class="lnk" data-alt="'+r.id+'">'+esc(z.corto)+'</button>':''; }).join(' · ')+'</p>';
  h += '</div>';
  h += '<div class="ticket"><div class="row wrap" style="gap:16px;justify-content:space-between">'+
    dato('Cuándo', fechasTexto(t, A))+dato('Base', base.nombre)+dato('Moverse', t.plan.coche?'Coche de alquiler':(Z.coche.necesidad==='innecesario'?'A pie y transporte':'Tren y bus'))+dato('Gasto', A.presTier==='ajustado'?'Ajustado':(A.presTier==='holgado'?'Holgado':'Medio'))+
  '</div></div>';
  if(!t.plan.coche && Z.coche.necesidad==='imprescindible') h += '<div class="note">Sin nadie que conduzca, '+esc(Z.corto)+' se queda corta: hemos dejado fuera los planes que solo se hacen en coche.</div>';
  if(A.presupuesto && A.presupuesto<220) h += '<div class="note"><b>Con unos '+A.presupuesto+' € por persona va muy justo.</b> Hemos tirado de planes gratis y comida de calle, pero el viaje y el alojamiento se pueden comer casi todo: mirad los vuelos antes de reservar nada.</div>';
  h += '<button type="button" class="btn full" data-goto="dias">Ver el día a día</button>';
  var RP = ENG.reparto(Z, A, t.plan);
  if(RP.length>1) h += '<div class="card stack"><div class="lab">Lo de cada uno</div>'+RP.map(function(p){ var m=(t.integrantes||[]).filter(function(x){ return x.nombre===p.nombre; })[0]||{}; var r=live.resps[m.id]||{};
      return '<div class="person"><span class="av" style="'+avatarEstilo(r.avatar)+'">'+(avatarOk(r.avatar)?'':inicial(p.nombre))+'</span><div class="grow"><b>'+esc(p.nombre)+'</b>'+
        (p.suyo?'<p style="font-size:14px;margin-top:2px"><span class="pill mine">Su plan</span> '+esc(p.suyo.nombre)+' <span class="muted m" style="font-size:12px">día '+p.suyo.dia+'</span></p>':'')+
        (p.mios.length?'<p class="muted" style="font-size:13px;margin-top:4px">También pensado para '+esc(p.nombre)+': '+p.mios.map(function(x){ return esc(x.nombre.split(/[:(]/)[0].trim())+' (día '+x.dia+')'; }).join(' · ')+'</p>':'')+
        p.falta.map(function(f){ return '<p class="muted" style="font-size:13px;margin-top:4px">'+esc(f)+'</p>'; }).join('')+'</div></div>'; }).join('')+'</div>';
  var porId={}; Z.actividades.forEach(function(x){ porId[x.id]=x; });
  h += '<div class="card"><div class="lab" style="margin-bottom:4px">El viaje en '+t.plan.dias.length+' días</div>'+t.plan.dias.map(function(d){ var items=d.slots.filter(function(s){ return (s.k==='act'||s.k==='noche'||s.k==='comida') && s.nombre!==d.titulo; }).map(function(s){ return s.nombre; }).slice(0,4); return '<div class="sumday"><span class="n">'+d.n+'</span><div><b>'+esc(d.titulo)+'</b>'+(d.fecha?' <span class="muted m" style="font-size:12px">'+esc(d.fecha)+'</span>':'')+(items.length?'<p class="muted" style="font-size:14px">'+esc(items.join(' · '))+'</p>':'')+'</div></div>'; }).join('')+'</div>';
  var rs = ENG.reservas(Z, A, t, t.plan), est=t.reservas||{};
  var transp = rs.filter(function(r){ return r.cat==='vuelo'||r.cat==='tren'; });
  if(transp.length) h += '<div class="card stack"><div class="lab">Cómo llega cada uno</div>'+transp.map(function(r){ return '<div><b>'+esc(r.titulo)+'</b><p class="muted" style="font-size:14px">'+esc(r.detalle)+'</p><div class="row wrap" style="gap:6px;margin-top:6px">'+r.enlaces.map(function(l){ var e=enlaceAf(l.u); return '<a class="ext" target="_blank" rel="noopener'+(e.af?' sponsored':'')+'" href="'+esc(e.u)+'">'+esc(l.t)+'</a>'; }).join('')+'</div></div>'; }).join('<div class="hr" style="height:1.5px;background:var(--line)"></div>')+'</div>';
  var conf = rs.filter(function(r){ return est[r.key] && est[r.key].estado==='confirmada'; }).length;
  var LL=live.lista||[]; h += '<button class="card row" data-goto="lista" style="cursor:pointer;width:100%;text-align:left"><span class="grow"><b>Lista del viaje</b><br><span class="muted" style="font-size:14px">'+(LL.length? LL.filter(function(x){ return x.hecho; }).length+' de '+LL.length+' hechas' : 'Documentos, maleta y reservas, sugeridos según vuestro plan')+'</span></span><span class="btn xs">Abrir</span></button>';

  var evs = Z.eventos.filter(function(e){ return (t.plan.eventos||[]).indexOf(e.nombre)>-1; });
  if(evs.length) h += '<div class="card stack"><div class="lab">Pasa por allí ese mes</div>'+evs.map(function(e){ return '<div><b>'+esc(e.nombre)+'</b>'+(e.donde?' <span class="muted">· '+esc(e.donde)+'</span>':'')+'<p class="muted" style="font-size:14px">'+esc(e.cuando||e.detalle||'')+'</p><a class="ext" target="_blank" rel="noopener" href="'+esc(e.enlace)+'">Web oficial</a></div>'; }).join('')+'</div>';
  h += '<div class="card stack"><div class="lab">Lo que ha puesto cada uno</div>'+opiniones(t, Z, true)+'</div>';
  h += '</div>';
  wire(function(){ on('[data-goto]','click',function(e,b){ S.sub=b.dataset.goto; render(); window.scrollTo(0,0); }); on('[data-goview]','click',function(e,b){ S.rsvCode=t.code; S.view='reservas'; render(); window.scrollTo(0,0); });
    on('[data-alt]','click',function(e,b){ var z=zona(b.dataset.alt); hoja('<div class="stack"><h2 class="d">¿Cambiar a '+esc(z.corto)+'?</h2><p>Se rehace el plan entero con ese destino. Los cambios hechos a mano se pierden.</p><button class="btn full" id="h-si">Sí, ver plan en '+esc(z.corto)+'</button><button class="btn ghost full" id="h-no">Mejor no</button></div>', function(el){ on('#h-no','click',cerrarHoja,el); on('#h-si','click',function(){ cerrarHoja(); generar(z.id).then(function(){ toast('Plan rehecho en '+z.corto); }); },el); }); }); });
  return h;
}
function dato(l,v){ return '<div><div class="lab">'+l+'</div><b>'+esc(v)+'</b></div>'; }
function opiniones(t, Z, corto){
  var R=live.resps;
  return (t.integrantes||[]).map(function(m){ var r=R[m.id]; var lst = r&&r.done ? ENG.opinion(r, Z) : []; if(corto) lst = lst.slice(0,6);
    return '<div class="person"><span class="av" style="'+avatarEstilo(r&&r.avatar)+'">'+(avatarOk(r&&r.avatar)?'':inicial(m.nombre))+'</span><div class="grow"><b>'+esc(m.nombre)+'</b>'+(lst.length?'<ul>'+lst.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul>':'<p class="muted" style="font-size:14px">Todavía no ha respondido.</p>')+'</div></div>'; }).join('');
}

var MOM = {manana:'Mañana', dia:'Todo el día', comida:'Comida', tarde:'Tarde', merienda:'Merienda', cena:'Cena', noche:'Noche'};
function kmTxt(k){ return k<10 ? k.toFixed(1).replace('.',',') : String(Math.round(k)); }
function tramoTxt(tr){ if(!tr) return ''; var m = tr.modo==='walking' ? 'a pie' : (tr.modo==='driving' ? 'en coche' : 'en transporte'); var mins = tr.modo==='walking' ? Math.max(5, tr.km*14) : (tr.modo==='driving' ? 10+tr.km*1.1 : (tr.km<5 ? 10+tr.km*3 : 20+tr.km*0.9)); mins = mins<60 ? Math.round(mins/5)*5+' min' : (Math.round(mins/15)/4).toString().replace('.',',')+' h';
  return (tr.km<0.5 ? 'A un paseo' : '≈ '+kmTxt(tr.km)+' km '+m+' · unos '+mins)+(tr.desde==='base'?' desde el alojamiento':'')+' · <a target="_blank" rel="noopener" href="'+esc(tr.maps)+'">ver ruta</a>'; }
function subDias(t, Z, A){
  var porId={}; Z.actividades.forEach(function(x){ porId[x.id]=x; });
  var basePorId={}; Z.bases.forEach(function(b){ basePorId[b.id]=b; });
  var plan=t.plan, EDITABLE = {act:1, libre:1, noche:1, comida:1};
  var claveDia=t.code+'|'+plan.zona;
  var horaItalia=Object.fromEntries(new Intl.DateTimeFormat('es-ES', {
    timeZone:'Europe/Rome', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23'
  }).formatToParts(new Date()).map(function(x){ return [x.type,x.value]; }));
  var fechaItalia=[horaItalia.year,horaItalia.month,horaItalia.day].join('-');
  var hoy=plan.dias.find(function(d){ return d.fecha===fechaItalia; });
  var elegido=S.diaClave===claveDia ? S.dia : (hoy ? hoy.n : 1);
  if(!plan.dias.some(function(d){ return d.n===elegido; })) elegido=plan.dias[0].n;
  var h = '<nav class="agenda-nav" aria-label="Días del viaje">'+plan.dias.map(function(d){ return '<button type="button" class="chip'+(d.n===elegido?' on':'')+'" aria-pressed="'+(d.n===elegido)+'" data-ir-dia="'+d.n+'">Día '+d.n+(hoy && hoy.n===d.n?' · hoy':'')+'</button>'; }).join('')+'</nav>';
  if((plan.ruta||[]).length>1) h += '<details class="agenda-bases"><summary>Dónde dormís</summary><div>'+plan.ruta.filter(function(r){ return r.desde<plan.dias.length; }).map(function(r){
    var hasta=Math.min(r.hasta,plan.dias.length-1);
    return '<span><b>'+esc(r.nombre)+'</b> · '+(hasta>r.desde?'noches ':'noche ')+r.desde+(hasta>r.desde?'–'+hasta:'')+'</span>';
  }).join('')+'</div></details>';
  h += '<div class="agenda">';
  plan.dias.forEach(function(d, di){
    if(d.n!==elegido) return;
    var cr = ENG.cronograma ? ENG.cronograma(Z, plan, d) : {slots:[], regreso:null};
    var nAct = d.slots.filter(function(s){ return s.k==='act'; }).length, nRes = d.slots.filter(function(s){ var a=s.ref&&porId[s.ref]; return a&&a.reserva; }).length;
    var bd = basePorId[d.base||plan.base];
    h += '<article class="day" id="dia-'+d.n+'" style="--z3:'+Z.inks[2]+'"><span class="dot"></span><div class="dh"><span class="d">Día '+d.n+'</span>'+(d.fecha?'<span class="lab">'+esc(d.fecha)+'</span>':'')+'<span style="font-weight:800">'+esc(d.titulo)+'</span>'+(function(){ var q=ENG.paraDia(Z, A, d).slice(0,3); return q.length && (t.integrantes||[]).length>1 ? '<span class="pdia">Día de '+esc(joinY(q))+'</span>' : ''; })()+'</div>';
    h += '<div class="row wrap" style="gap:6px;margin:-2px 0 10px">'+(bd?'<span class="pill">'+(di===plan.dias.length-1?'Salida desde ':'Dormís en ')+esc(bd.nombre)+'</span>':'')+(d.km?'<a class="pill" target="_blank" rel="noopener" href="'+esc(d.ruta)+'">Excursión ≈ '+d.km+' km · ver ruta</a>':'')+(nAct?'<span class="pill">'+nAct+' plan'+(nAct>1?'es':'')+'</span>':'')+(nRes?'<span class="pill warn">'+nRes+' requieren reserva</span>':'')+'</div>';
    var puntos=d.slots.map(function(s){ var a=porId[s.ref]; return a&&a.geo; }).filter(Boolean);
    h += '<div class="agenda-actions"><p class="muted agenda-intro">Horas orientativas</p>'+
      (puntos.length>1?'<a class="ext map" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/'+puntos.map(function(g){ return g[0]+','+g[1]; }).join('/')+'">Ver paradas en Maps</a>':'')+'</div>';
    var minsAhora=horaItalia.hour*60+Number(horaItalia.minute);
    var siguiente=hoy===d ? cr.slots.findIndex(function(o){
      var hm=/^(\d{1,2}):(\d{2})( \(\+1 día\))?$/.exec(o.hora||'');
      return hm && Number(hm[1])*60+Number(hm[2])+(hm[3]?1440:0)>=minsAhora;
    }) : -1;
    var destacado=siguiente>=0 ? d.slots[siguiente] : d.slots.find(function(s){ return s.k==='act' && s.de; }) || d.slots.find(function(s){ return s.k==='act'; });
    if(siguiente>=0){
      var proximo=d.slots[siguiente], cron=cr.slots[siguiente], act=porId[proximo.ref];
      var comoLlegar=act&&act.maps || proximo.maps || cron.tramo&&cron.tramo.maps;
      h += '<div class="agenda-proximo"><div class="lab">Siguiente en la agenda · '+esc(cron.hora)+'</div><strong>'+esc(proximo.nombre)+'</strong>'+
        (comoLlegar?'<a class="ext map" target="_blank" rel="noopener" href="'+esc(comoLlegar)+'">Cómo llegar</a>':'')+'</div>';
    }
    var bloqueAnterior;
    d.slots.forEach(function(s, si){
      var bloque=s.k==='llegada'||s.k==='traslado'||s.k==='vuelta'?'Desplazamientos':
        ((s.momento==='noche'&&!s.antes)||s.momento==='cena'?'Noche':
          (s.antes||['comida','tarde','merienda'].includes(s.momento)?'Tarde':'Mañana'));
      if(bloque!==bloqueAnterior) h += '<h3 class="agenda-periodo">'+bloque+'</h3>';
      bloqueAnterior=bloque;
      var a = s.ref && porId[s.ref], o = cr.slots[si] || {};
      if(o.tramo) h += '<div class="tramo">'+tramoTxt(o.tramo)+'</div>';
      var cls = s.k==='comida'?' food':(s.k==='libre'?' free':'');
      var hora = o.salida ? 'Salida '+o.salida+(o.hora?' · '+o.hora:'') : (o.hora || o.etiqueta || '');
      var mom = s.k==='llegada'?'Llegada':(s.k==='vuelta'?'Vuelta':(s.k==='traslado'?'Cambio de alojamiento':(s.antes&&!s.sol?'Aperitivo':(MOM[s.momento]||''))));
      var detalleId='agenda-'+esc(t.code)+'-'+d.n+'-'+si;
      h += '<div class="slot'+cls+(s===destacado?' agenda-destacado':'')+(s.editado?' edited':'')+'"><details class="agenda-slot" id="'+detalleId+'">'+
        '<summary><span class="agenda-slot-hora">'+esc(hora||mom)+'</span><strong>'+esc(s.nombre)+'</strong>'+
        (a&&a.reserva?'<span class="pill warn">Requiere reserva</span>':'')+'</summary><div class="agenda-slot-body">'+
        (EDITABLE[s.k]?'<details class="slot-edit"><summary>Editar parada</summary><span class="ed">'+
          (si>0&&EDITABLE[d.slots[si-1].k]?'<button class="btn xs ghost" data-mover="'+di+'.'+si+'.-1" aria-label="Subir">↑</button>':'')+
          (si<d.slots.length-1&&EDITABLE[d.slots[si+1].k]?'<button class="btn xs ghost" data-mover="'+di+'.'+si+'.1" aria-label="Bajar">↓</button>':'')+
          '<button class="btn xs ghost" data-quitar-s="'+di+'.'+si+'">Quitar</button></span></details>':'');
      if(s.k==='act'||s.k==='libre'||s.k==='noche') h += '<button type="button" class="btn xs ghost" data-cambiar="'+di+'.'+si+'">Ver alternativas</button>';
      if(a){
        if(a.descripcion) h += '<p style="font-size:14px">'+esc(a.descripcion)+'</p>';
        if((a.paradas||[]).length) h += '<details class="agenda-detail"><summary>Paradas del recorrido ('+a.paradas.length+')</summary><ol class="paradas" style="margin:2px 0 0 18px;padding:0;font-size:14px">'+a.paradas.map(function(p){ return '<li style="margin:3px 0"><a target="_blank" rel="noopener" href="'+esc(p.maps)+'">'+esc(p.nombre)+'</a>'+(p.nota?' <span class="muted">— '+esc(p.nota)+'</span>':'')+'</li>'; }).join('')+'</ol></details>';
        h += '<div class="row wrap" style="gap:6px"><span class="pill">'+(ETQ_COSTE[a.coste]||'')+'</span><span class="pill">'+(ETQ_DUR[a.duracion]||'')+'</span>'+(a.reserva?'<span class="pill warn">Reservar antes</span>':'')+(a.coche?'<span class="pill">Con coche</span>':'')+(a.donde && (!bd || a.donde!==bd.nombre)?'<span class="pill">'+esc(a.donde)+'</span>':'')+'</div>';
        if(a.consejo || a.consejoGuia || (a.fuentesGuia||[]).length) h += '<details class="agenda-detail"><summary>Antes de ir</summary>'+
          (a.consejo?'<p>'+esc(a.consejo)+'</p>':'')+(a.consejoGuia && a.consejoGuia!==a.consejo?'<p>'+esc(a.consejoGuia)+'</p>':'')+
          (a.fuentesGuia||[]).map(function(url, i){ return '<a class="ext" target="_blank" rel="noopener" href="'+esc(url)+'">Fuente '+(i+1)+'</a>'; }).join('')+'</details>';
        if((a.tours||[]).length) h += '<details class="agenda-detail"><summary>Visitas y entradas</summary>'+a.tours.map(function(tour){
          var e=enlaceAf(tour[2]);
          return '<a class="agenda-link" target="_blank" rel="noopener'+(e.af?' sponsored':'')+'" href="'+esc(e.u)+'">'+esc(tour[1])+'<span>'+esc(tour[0]+(tour[3]?' · '+tour[3]:''))+'</span></a>';
        }).join('')+'</details>';
        h += '<div class="lk">'+(a.enlace && a.enlace!==a.maps?'<a class="ext" target="_blank" rel="noopener" href="'+esc(a.enlace)+'">'+(a.enlace_tipo==='oficial'?'Web oficial':(a.enlace_tipo==='reserva'?'Ver y reservar':'Ver'))+'</a>':'')+'<a class="ext map" target="_blank" rel="noopener" href="'+esc(a.maps)+'">Mapa</a><a class="ext" target="_blank" rel="noopener" href="https://www.tripadvisor.es/Search?q='+encodeURIComponent(a.nombre.split(':')[0]+' '+String(a.donde||'').split(/[\/,(]/)[0])+'">Opiniones</a></div>';
      } else {
        if(s.descripcion) h += '<p style="font-size:14px">'+esc(s.descripcion)+'</p>';
        if(s.k==='comida' && s.donde && !s.sugerencia && !s.libre) h += '<p class="muted" style="font-size:13px">Dónde: '+esc(s.donde)+'</p>';
        if(s.k==='comida'){
          var localidad=ENG.norm(s.lugar || (s.momento==='cena'&&bd?bd.nombre:d.lugar||''));
          var sitios=(Z.sitios||[]).filter(function(x){ return ENG.norm(x.lugar)===localidad &&
            (s.momento==='merienda' ? /gelateri|pasteler|cafe|pasticcer/i.test(x.tipo) : !/gelateri|pasteler|cafe|pasticcer/i.test(x.tipo)); }).slice(0,2);
          if(sitios.length) h += '<details class="agenda-detail"><summary>Sitios donde comer</summary>'+sitios.map(function(x){
            var dieta=A.dieta && Object.keys(A.dieta).some(function(k){ return k!=='nada' && A.dieta[k].length; });
            return '<a class="agenda-link" href="'+esc(x.maps)+'" target="_blank" rel="noopener">'+esc(x.nombre)+'<span>'+esc(x.direccion)+(dieta?'':(x.pedir?' · '+esc(x.pedir):''))+'</span></a>'+
              x.fuentes.map(function(url){ return '<a class="ext" href="'+esc(url)+'" target="_blank" rel="noopener">Fuente</a>'; }).join('');
          }).join('')+'</details>';
        }
        if(s.maps) h += '<div class="lk"><a class="ext map" target="_blank" rel="noopener" href="'+esc(s.maps)+'">'+(s.k==='comida'?'Dónde comer cerca':(s.k==='llegada'||s.k==='vuelta'||s.k==='traslado'?'Ruta':'Mapa'))+'</a></div>';
      }
      if(s.por_que) h += '<span class="why'+(s.de?' de':'')+'">'+(s.de?'<span class="av xs">'+esc(inicial(s.de))+'</span>':'')+esc(s.por_que)+'</span>';
      h += '</div></details></div>';
    });
    if(cr.regreso) h += '<div class="tramo">Vuelta al alojamiento: ≈ '+kmTxt(cr.regreso.km)+' km · <a target="_blank" rel="noopener" href="'+esc(cr.regreso.maps)+'">ver ruta</a></div>';
    h += '<div class="agenda-actions"><button class="btn xs ghost" data-anadir="'+di+'">+ Añadir un plan</button></div>';
    var hechos=d.slots.map(function(s){ return s.ref; });
    var recorridos=(Z.recorridos||[]).filter(function(r){ return r.refs.some(function(ref){ return hechos.indexOf(ref)>-1; }); });
    if(recorridos.length) h += '<details class="agenda-detail"><summary>Recorridos por la zona</summary>'+recorridos.map(function(r){
      return '<p><b>'+esc(r.nombre)+'</b></p><ol>'+r.refs.map(function(ref){ var a=porId[ref]; return '<li><a href="'+esc(a.maps)+'" target="_blank" rel="noopener">'+esc(a.nombre)+'</a></li>'; }).join('')+'</ol>';
    }).join('')+'</details>';
    h += '</article>';
  });
  h += '</div>';
  wire(function(){
    on('[data-ir-dia]','click',function(e,b){
      var desplazamiento=b.closest('.agenda-nav').scrollLeft;
      S.diaClave=claveDia; S.dia=+b.dataset.irDia;
      render(true);
      var boton=document.querySelector('[data-ir-dia="'+S.dia+'"]');
      if(boton){ boton.closest('.agenda-nav').scrollLeft=desplazamiento; boton.focus({preventScroll:true}); boton.scrollIntoView({block:'nearest',inline:'nearest'}); }
    });
    on('[data-cambiar]','click',function(e,b){ var p=b.dataset.cambiar.split('.'); hojaCambiar(t, Z, A, +p[0], +p[1]); });
    on('[data-mover]','click',function(e,b){ var p=b.dataset.mover.split('.').map(Number); editarPlan(t, function(plan){ var sl=plan.dias[p[0]].slots, j=p[1]+p[2]; var x=sl[p[1]]; sl[p[1]]=sl[j]; sl[j]=x; var m=sl[p[1]].momento; sl[p[1]].momento=sl[j].momento; sl[j].momento=m; sl[j].editado=true; }, 'Movido'); });
    on('[data-quitar-s]','click',function(e,b){ var p=b.dataset.quitarS.split('.').map(Number); var s0=t.plan.dias[p[0]].slots[p[1]]; editarPlan(t, function(plan){ plan.dias[p[0]].slots.splice(p[1],1); }, 'Quitado «'+s0.nombre+'»'); });
    on('[data-anadir]','click',function(e,b){ hojaAnadir(t, Z, A, +b.dataset.anadir); });
  });
  return h+fotoZona(Z, false);
}
function editarPlan(t, fn, msg){
  var plan = JSON.parse(JSON.stringify(t.plan)); fn(plan); plan.editado = true;
  escribir(tripRef(t.code).update({plan:plan})).then(function(){ toast(msg||'Plan actualizado'); }, function(){ toast('No se pudo guardar'); });
}
function hojaAnadir(t, Z, A, di){
  var momento = 'tarde';
  function pinta(){
    var alts = ENG.alternativas(Z, A, t.plan, {k:'act', momento:momento}, t.plan.dias[di].base).slice(0,8);
    return '<div class="stack"><div class="lab">Día '+(di+1)+'</div><h2 class="d">Añadir un plan</h2><div class="seg">'+[['manana','Mañana'],['tarde','Tarde'],['noche','Noche']].map(function(m){ return '<button type="button" data-mom="'+m[0]+'" class="'+(momento===m[0]?'on':'')+'">'+m[1]+'</button>'; }).join('')+'</div>'+
      (alts.length?alts.map(function(a,i){ return '<button class="card flat" data-add-i="'+i+'" style="text-align:left;cursor:pointer;width:100%"><b>'+esc(a.nombre)+'</b><p class="muted" style="font-size:13px">'+esc(a.descripcion||((ETQ_COSTE[a.coste]||'')+' · '+(ETQ_DUR[a.duracion]||'')))+'</p></button>'; }).join(''):'<p class="muted">No quedan planes de la biblioteca para ese momento que se puedan hacer desde vuestra base.</p>')+'</div>';
  }
  hoja(pinta(), function wireA(el){
    on('[data-mom]','click',function(e,b){ momento=b.dataset.mom; el.querySelector('.sheet').innerHTML = '<div class="grab"></div>'+pinta(); wireA(el); }, el);
    on('[data-add-i]','click',function(e,b){ var a=ENG.alternativas(Z, A, t.plan, {k:'act', momento:momento}, t.plan.dias[di].base).slice(0,8)[+b.dataset.addI]; cerrarHoja();
      editarPlan(t, function(plan){ var sl=plan.dias[di].slots; var orden={manana:0, dia:0, comida:1, tarde:2, merienda:2, cena:3, noche:4}; var pos=sl.length; for(var k=0;k<sl.length;k++){ if((orden[sl[k].momento]||0) > (orden[momento]||0) && sl[k].k!=='llegada'){ pos=k; break; } } if(sl[pos-1] && sl[pos-1].k==='vuelta') pos--; sl.splice(pos, 0, {k:'act', momento:momento, ref:a.id, nombre:a.nombre, por_que:'Añadido a mano', editado:true}); }, 'Añadido «'+a.nombre+'»'); }, el);
  });
}
function hojaCambiar(t, Z, A, di, si){
  var s = t.plan.dias[di].slots[si];
  var dia=t.plan.dias[di], porId=new Map(Z.actividades.map(function(a){return [a.id,a];}));
  var actual=porId.get(s.ref), anterior=dia.slots[si-1], previa=anterior && porId.get(anterior.ref);
  var coste={gratis:0,bajo:1,medio:2,alto:3};
  var interiores=new Set('uffizi accademia-david bargello vaticano galleria-borghese mann museo-storia-naturale paolo-orsi cagliari-arqueologico acuario-cala-gonone otzi acuario-genova ferrari-maranello lamborghini museo-enzo-ferrari ustica-memoria museo-egizio mauto risorgimento-carignano reggio-museo novecento revoltella genti-abruzzo campobasso-misteri castelfidardo-fisarmonica'.split(' '));
  function distancia(a){return previa && previa.geo && a && a.geo ? ENG.km(previa.geo,a.geo) : null;}
  var original=distancia(actual), alts=[];
  hoja('<div class="stack"><div class="lab">Día '+(di+1)+' · '+(MOM[s.momento]||'')+'</div><h2 class="d">Cambiar parada</h2><p>Ahora: '+esc(s.nombre)+'</p><label>¿Qué queréis cambiar? <select id="alt-filtro"><option value="">Ver todas</option><option value="precio">Más barato</option><option value="cerca">Más cerca de la parada anterior</option><option value="lluvia">Por si llueve</option></select></label><div id="alt-lista" class="stack" aria-live="polite"></div><button class="btn ghost full" id="h-libre">Dejarlo libre</button><button class="btn ghost full" id="alt-cerrar">Volver sin cambiar</button></div>', function(el){
    function listar(){
      var modo=el.querySelector('#alt-filtro').value;
      alts=ENG.alternativas(Z,A,t.plan,s,dia.base,actual && ENG._pt(actual),function(a){
        if(modo==='precio') return actual && coste[a.coste]<coste[actual.coste];
        if(modo==='cerca') return original!=null && distancia(a)!=null && distancia(a)<original;
        if(modo==='lluvia') return interiores.has(a.id);
        return true;
      });
      el.querySelector('#alt-lista').innerHTML=alts.map(function(a,i){
        var km=distancia(a);
        var trayecto=original!=null && km!=null ? original.toFixed(1)+' → '+km.toFixed(1)+' km en línea recta desde '+previa.nombre : 'Distancia desde la parada anterior sin comparar';
        return '<details class="card flat"><summary>'+esc(a.nombre)+'</summary><p>'+esc(a.descripcion||'')+'</p><p>Coste orientativo: '+esc(actual && ETQ_COSTE[actual.coste]||'Sin dato')+' → '+esc(ETQ_COSTE[a.coste]||'Sin dato')+'</p><p>'+esc(trayecto)+'</p><button class="btn sm" data-alt-i="'+i+'">Usar esta parada</button></details>';
      }).join('') || '<p>Sin alternativas comparables para este filtro. Podéis elegir otro o mantener vuestra parada.</p>';
    }
    listar(); el.querySelector('#alt-filtro').onchange=listar;
    el.querySelector('#alt-lista').onclick=function(e){var b=e.target.closest('[data-alt-i]');if(!b)return;var a=alts[+b.dataset.altI];guardar({k:'act',momento:s.momento,ref:a.id,nombre:a.nombre,por_que:'Elegido por el grupo al revisar las alternativas',editado:true});};
    el.querySelector('#alt-cerrar').onclick=cerrarHoja;
    function guardar(nuevo){ var plan = JSON.parse(JSON.stringify(t.plan)); plan.dias[di].slots[si] = nuevo; plan.editado = true; cerrarHoja(); if(false){ return; } escribir(tripRef(t.code).update({plan:plan})).then(function(){ toast('Plan actualizado'); }, function(){ toast('No se pudo guardar'); }); }
    on('#h-libre','click',function(){ guardar({k:'libre', momento:s.momento, nombre: s.momento==='noche'?'Noche libre':'Tiempo libre', por_que:'Cambiado a mano', editado:true}); }, el);
  });
}
/* ---------- LISTA COMPARTIDA (checklist del viaje) ---------- */
// Sugerencias sacadas del plan de ESTE viaje (vuelos, coche, nieve, playa, reservas…); cualquiera del grupo marca, añade, edita, borra y se asigna cosas.
function sugerenciasLista(t, Z, A){
  var out=[]; function add(k, txt){ if(!out.some(function(x){ return x.k===k; })) out.push({k:k, t:txt}); }
  var os = A.origenes||[], deEs = !os.length || os.some(function(o){ return o.pais==='es'; });
  if(deEs){ add('doc', 'DNI o pasaporte en vigor'); add('tse', 'Tarjeta Sanitaria Europea'); }
  add('mapa', 'Descargar el mapa sin conexión de la zona');
  add('carga', 'Cargador y batería externa');
  if(t.plan){
    var rs = ENG.reservas(Z, A, t, t.plan), porId={}; Z.actividades.forEach(function(a){ porId[a.id]=a; });
    if(rs.some(function(r){ return r.cat==='vuelo'; })){ add('checkin', 'Check-in online de los vuelos'); add('maleta', 'Mirar la medida de la maleta de cabina de vuestra aerolínea'); }
    if(rs.some(function(r){ return r.cat==='tren'; })) add('validar', 'Billetes de tren (los regionales se validan antes de subir)');
    if(t.plan.coche){ add('carnet', 'Carnet de conducir de quien vaya a conducir'); add('fianza', 'Tarjeta de crédito a nombre del conductor para la fianza del coche'); add('ztl', 'Ojo con las ZTL: zonas de tráfico limitado en los centros históricos'); }
    if(rs.some(function(r){ return r.cat==='aloj'; })) add('aloj', 'Reservar el alojamiento (solo una de las opciones)');
    var txt=''; t.plan.dias.forEach(function(d){ d.slots.forEach(function(s){ var a=s.ref&&porId[s.ref]; txt += ' '+ENG.norm(s.nombre+' '+(a?a.descripcion+' '+a.tipo+' '+(a.esfuerzo||''):'')); if(a && a.reserva) add('res-'+a.id, 'Reservar: '+a.nombre+' (día '+d.n+')'); if(/^Noche (de|del) /.test(s.nombre)) add('oca', 'Preparar la noche grande (día '+d.n+')'); }); });
    if(/esqu|ski|nieve|raquet|trineo/.test(txt)) add('nieve', 'Ropa térmica, guantes y gafas de sol');
    if(/esqu|ski/.test(txt)) add('forfait', 'Forfait y alquiler de material mirados');
    if(/playa|cala|bano|snorkel|barco|lido/.test(txt)) add('playa', 'Bañador, toalla y crema solar');
    if(/cala|scogli|roca/.test(txt)) add('escarpines', 'Escarpines para las calas de piedra');
    if(/ruta|sendero|crater|cima|cresta|trekking|alto/.test(txt)) add('calzado', 'Calzado de montaña y algo de abrigo');
    if(/basilica|catedral|duomo|capilla|cappella|iglesia|vaticano/.test(txt)) add('iglesias', 'Algo para cubrir hombros y rodillas en las iglesias');
  }
  if(A.dieta && A.dieta.sin_gluten) add('gluten', 'Apuntar «senza glutine» para pedir en los restaurantes');
  add('gastos', 'Decidir quién apunta los gastos en Gastos');
  var ya = (live.lista||[]).map(function(x){ return x.auto || ENG.norm(x.texto); });
  return out.filter(function(x){ return ya.indexOf(x.k)<0 && ya.indexOf(ENG.norm(x.t))<0; });
}
function subLista(t, Z, A){
  var L = live.lista||[], ints=t.integrantes||[], hechos=L.filter(function(x){ return x.hecho; }).length;
  var sug = sugerenciasLista(t, Z, A);
  var nom = function(id){ var m=ints.filter(function(x){ return x.id===id; })[0]; return m?m.nombre:''; };
  var h = '<div class="card stack"><div class="row" style="justify-content:space-between;align-items:flex-end"><div><div class="lab">Lista del viaje</div><h2 class="d" style="font-size:30px">Que no se os olvide nada</h2></div><div class="m" style="font-weight:700">'+hechos+'/'+L.length+'</div></div>'+
    (L.length?'<div class="prog"><i style="width:'+Math.round(100*hechos/Math.max(1,L.length))+'%"></i></div>':'')+
    '<p class="muted" style="font-size:14px">La ve todo el grupo. Toca el círculo para marcarlo y la inicial para decir quién se encarga.</p>'+
    '<form id="f-li" class="row" style="gap:8px"><input type="text" id="i-li" maxlength="80" placeholder="Añadir algo…" class="grow" aria-label="Añadir a la lista"><button class="btn sm ink" type="submit">Añadir</button></form>';
  if(L.length) h += '<ul class="chk">'+L.map(function(x){ return '<li class="'+(x.hecho?'done':'')+'" data-li="'+esc(x.id)+'"><button type="button" class="tick" data-tick="'+esc(x.id)+'" aria-label="'+(x.hecho?'Desmarcar':'Marcar como hecho')+'">'+(x.hecho?'✓':'')+'</button><span class="tx grow">'+esc(x.texto)+'</span><button type="button" class="av xs who" data-quien="'+esc(x.id)+'" aria-label="Quién se encarga">'+(x.quien?inicial(nom(x.quien)):'+')+'</button><button type="button" class="lnk" data-ed="'+esc(x.id)+'" aria-label="Editar">Editar</button></li>'; }).join('')+'</ul>';
  else h += '<div class="empty" style="padding:8px 0">'+ART.q('maleta')+'<b>La lista está vacía</b><p class="muted">Empieza con las sugerencias de abajo: salen de vuestro plan.</p></div>';
  h += '</div>';
  if(sug.length) h += '<div class="card stack"><div class="row" style="justify-content:space-between"><div class="lab">Sugerido para este viaje</div><button type="button" class="lnk" id="b-li-all">Añadir todo</button></div><div class="cities">'+sug.map(function(x){ return '<button type="button" class="chip" data-sug="'+esc(x.k)+'">+ '+esc(x.t)+'</button>'; }).join('')+'</div></div>';
  wire(function(){
    var code=t.code;
    function nuevo(texto, auto){ return escribir(listaCol(code).add({texto:texto, hecho:false, quien:null, auto:auto||null, ts:Date.now()})); }
    var f=$('#f-li'); if(f) f.addEventListener('submit', function(e){ e.preventDefault(); var v=$('#i-li').value.trim(); if(!v) return; nuevo(v).then(function(){ $('#i-li') && ($('#i-li').value=''); }, function(){ toast('No se pudo guardar'); }); });
    on('[data-sug]','click',function(e,b){ var x=sug.filter(function(y){ return y.k===b.dataset.sug; })[0]; if(!x) return; b.disabled=true; nuevo(x.t, x.k).catch(function(){ b.disabled=false; toast('No se pudo guardar'); }); });
    on('#b-li-all','click',function(e,b){ b.disabled=true; var p=Promise.resolve(); sug.forEach(function(x,i){ p=p.then(function(){ return listaCol(code).add({texto:x.t, hecho:false, quien:null, auto:x.k, ts:Date.now()+i}); }); }); escribir(p).then(function(){ toast('Añadido a la lista'); }, function(){ toast('No se pudo guardar'); }); });
    on('[data-tick]','click',function(e,b){ var x=L.filter(function(y){ return y.id===b.dataset.tick; })[0]; if(!x) return; escribir(listaCol(code).doc(x.id).update({hecho:!x.hecho})).catch(function(){ toast('No se pudo guardar'); }); });
    on('[data-quien]','click',function(e,b){ var x=L.filter(function(y){ return y.id===b.dataset.quien; })[0]; if(!x) return; var ids=[null].concat(ints.map(function(m){ return m.id; })); var i=ids.indexOf(x.quien||null); var sig=ids[(i+1)%ids.length]; escribir(listaCol(code).doc(x.id).update({quien:sig})).then(function(){ if(sig) toast('Se encarga '+nom(sig)); }, function(){ toast('No se pudo guardar'); }); });
    on('[data-ed]','click',function(e,b){ var x=L.filter(function(y){ return y.id===b.dataset.ed; })[0]; if(!x) return;
      hoja('<form class="stack" id="f-led" novalidate><h2 class="d">Editar</h2><label class="f">Qué<input type="text" id="i-led" maxlength="80" value="'+esc(x.texto)+'"></label><button class="btn full" type="submit">Guardar</button><button type="button" class="btn ghost full" id="b-ldel">Quitar de la lista</button></form>', function(el){
        $('#f-led',el).addEventListener('submit',function(ev){ ev.preventDefault(); var v=$('#i-led',el).value.trim(); if(!v){ toast('Escribe algo'); return; } escribir(listaCol(code).doc(x.id).update({texto:v})).then(cerrarHoja, function(){ toast('No se pudo guardar'); }); });
        on('#b-ldel','click',function(){ escribir(listaCol(code).doc(x.id).delete()).then(function(){ cerrarHoja(); toast('Quitado'); }, function(){ toast('No se pudo borrar'); }); }, el); }); });
  });
  return h;
}
function subGrupo(t, Z, A, soyJefe){
  var h = '<div class="stack"><div class="card stack"><div class="lab">Quién va</div>'+opiniones(t, Z, false)+'</div>';
  h += '<div class="card stack"><div class="lab">Invitar o reenviar el enlace</div><div class="code" style="font-size:32px">'+esc(t.code)+'</div>'+botonesCompartir(t)+'</div>';
  if(soyJefe) h += '<div class="card stack"><div class="lab">Solo para quien organiza</div><button class="btn ghost full" id="b-gg">Añadir o quitar gente · cambiar el enlace</button><button class="btn ghost full" id="b-rg">Rehacer el plan con todas las respuestas</button>'+(destinoFijo(t)?'':'<button class="btn ghost full" id="b-otra">Volver a las propuestas de destino</button>')+'</div>';
  else h += '<button class="btn ghost full" id="b-gg">Ver el grupo · salir del viaje</button>';
  h += '</div>';
  wire(function(){ wireCompartir(document,t); on('#b-gg','click',function(){ hojaGestionGrupo(t); }); on('#b-rg','click',function(){ generar(null).then(function(x){ if(x!==null) toast('Plan rehecho'); }); });
    on('#b-otra','click',function(){ hoja('<div class="stack"><h2 class="d">¿Volver a elegir destino?</h2><p>El plan actual se quita para todos y volvéis a ver las propuestas. Las reservas, la lista y los gastos se quedan.</p><button class="btn full" id="b-ot-si">Sí, volver a las propuestas</button><button class="btn ghost full" id="b-ot-no">Cancelar</button></div>', function(el){ on('#b-ot-no','click',cerrarHoja,el); on('#b-ot-si','click',function(){ escribir(tripRef(t.code).update({plan:null, eleccion:null})).then(function(){ cerrarHoja(); pedirMotor('calcular'); toast('De vuelta a las propuestas'); }, function(){ toast('No se pudo'); }); }, el); }); }); });
  return h;
}
function hojaGestionGrupo(t){
  var R=live.resps, me=miEntrada(t.code)||{}, soyJefe = me.miembro===t.jefe;
  var ocupado = function(id){ return !!(t.miembros && t.miembros[id]); };
  hoja('<div class="stack"><h2 class="d">El grupo</h2>'+t.integrantes.map(function(m){ var hecho=R[m.id]&&R[m.id].done;
      var estado = m.id===t.jefe ? '<span class="pill">Organiza</span>' : (hecho ? '<span class="pill ok">Respondió</span>' : (ocupado(m.id) ? '<span class="pill">Dentro</span>' : '<span class="pill">Sin entrar</span>'));
      return '<div class="row"><span class="grow">'+esc(m.nombre)+(m.id===me.miembro?' (tú)':'')+'</span>'+estado+(soyJefe && m.id!==t.jefe ? '<button class="btn xs ghost" data-quitar="'+esc(m.id)+'" data-n="'+esc(m.nombre)+'">Quitar</button>' : '')+'</div>'; }).join('')+
    (soyJefe ? '<form class="row" id="f-add"><input type="text" id="i-add" maxlength="24" placeholder="Nombre nuevo" class="grow"><button class="btn sm ink" type="submit">Añadir</button></form>' : '')+
    '<div id="z-conf"></div><div class="hr"></div>'+
    (soyJefe ? '<button class="btn ghost full" id="b-regen-link">Cambiar el enlace de invitación</button><p class="muted" style="font-size:12px">El enlace viejo deja de funcionar. Quien ya está dentro sigue dentro.</p>' : '<button class="btn ghost full" id="b-salir">Salir de este viaje</button><p class="muted" style="font-size:12px">Se borran tus respuestas de este viaje. Tus gastos se quedan para que las cuentas cuadren.</p>')+
    '</div>', function(el){
    var f=$('#f-add',el); if(f) f.addEventListener('submit', function(e){ e.preventDefault(); var n=$('#i-add',el).value.trim(); if(!n) return; var maxId = t.integrantes.reduce(function(mx,m){ return Math.max(mx, +String(m.id).replace(/\D/g,'')||0); },0); var ints=t.integrantes.concat([{id:'m'+(maxId+1), nombre:n.slice(0,24)}]); escribir(tripRef(t.code).update({integrantes:ints})).then(function(){ cerrarHoja(); toast(n+' añadido. Mándale el enlace.'); }, function(){ toast('No se pudo guardar'); }); });
    on('[data-quitar]','click',function(e,b){ var z=$('#z-conf',el); z.innerHTML='<div class="note">¿Quitar a '+esc(b.dataset.n)+'? Se borran sus respuestas de este viaje y las propuestas se recalculan.</div><div class="row" style="margin-top:8px"><button class="btn grow" id="b-q-si">Quitar</button><button class="btn ghost grow" id="b-q-no">Cancelar</button></div>';
      on('#b-q-no','click',function(){ z.innerHTML=''; }, z);
      on('#b-q-si','click',function(){ ZSTORE.quitar(t.code, b.dataset.quitar).then(function(){ cerrarHoja(); toast('Quitado'); pedirMotor('calcular'); }, function(){ toast('No se pudo quitar'); }); }, z); }, el);
    on('#b-regen-link','click',function(){ ZSTORE.regenerar(t.code).then(function(tk){ cerrarHoja(); toast('Enlace nuevo listo'); render(); }, function(){ toast('No se pudo cambiar'); }); }, el);
    on('#b-salir','click',function(){ var z=$('#z-conf',el); z.innerHTML='<div class="note">¿Seguro? Para volver necesitarás el enlace otra vez.</div><div class="row" style="margin-top:8px"><button class="btn grow" id="b-s-si">Salir</button><button class="btn ghost grow" id="b-s-no">Cancelar</button></div>';
      on('#b-s-no','click',function(){ z.innerHTML=''; }, z);
      on('#b-s-si','click',function(){ ZSTORE.salir(t.code).then(function(){ quitarMiViaje(t.code); cerrarHoja(); S.view='viajes'; S.code=null; render(); toast('Has salido del viaje'); }, function(){ toast('No se pudo salir'); }); }, z); }, el);
  });
}

/* ---------- TARJETA para stories ---------- */
function subTarjeta(t, Z, A){
  return '<div class="stack"><div class="cardwrap" style="--zbg:'+Z.bg+'"><canvas id="cv" width="1080" height="1920" aria-label="Tarjeta del viaje a '+esc(Z.corto)+'"></canvas></div>'+
    '<button class="btn full" id="b-save">Guardar imagen para stories</button>'+
    '<div class="row"><a class="btn ghost grow sm" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent('Nos vamos a '+Z.corto+' ('+fechasTexto(t,A)+'). Mira el plan: '+shareLink(t))+'">Mandar el plan</a><button class="btn ghost grow sm" id="b-cpl" type="button">Copiar enlace</button></div>'+
    '<p class="muted" style="font-size:13px">1080×1920, con márgenes pensados para que no la tapen los botones de Instagram ni de TikTok.</p><div id="img-fb"></div></div>';
}
var fuentesOK=null;
function cargarFuentes(){ if(fuentesOK) return fuentesOK; fuentesOK = Promise.race([Promise.all(['900 100px "TikTok Sans"','800 100px "TikTok Sans"','italic 500 60px "Bodoni Moda"','700 40px "IBM Plex Mono"'].map(function(f){ return document.fonts ? document.fonts.load(f) : null; })), new Promise(function(r){ setTimeout(r,2500); })]).catch(function(){}); return fuentesOK; }
function pintarTarjeta(){
  var cv=$('#cv'); if(!cv) return; var t=live.trip; if(!t||!t.plan) return; var Z=zona(t.plan.zona); var A=agregado();
  dibujarTarjeta(cv, Z, t, A).then(function(){
    on('#b-save','click',function(){ guardarImagen(cv, Z); });
    on('#b-cpl','click',function(){ copiar(shareLink(t),'Enlace copiado'); });
  });
}
function cargarImg(src){ return new Promise(function(res, rej){ var im=new Image(); im.onload=function(){ res(im); }; im.onerror=rej; im.src=src; }); }
async function dibujarTarjeta(cv, Z, t, A){
  await cargarFuentes();
  var ctx=cv.getContext('2d'); var W=1080, H=1920;
  try{ var im = await cargarImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(ART.card(Z))); ctx.drawImage(im,0,0,W,H); }catch(e){ ctx.fillStyle=Z.bg; ctx.fillRect(0,0,W,H); }
  var dark = ART.lum(Z.bg)<0.35, ink = dark?'#FBF4E6':'#30231F', acc = Z.inks[2]===Z.bg?Z.inks[1]:Z.inks[2];
  if(ART.lum(acc)>0.8) acc = Z.inks[1];
  function font(px, w, fam, it){ ctx.font=(it?'italic ':'')+w+' '+px+'px '+fam; }
  var cond = 'fontStretch' in ctx; if(cond) ctx.fontStretch='condensed';
  ctx.textBaseline='alphabetic'; ctx.textAlign='left';
  // etiqueta
  if('letterSpacing' in ctx) ctx.letterSpacing='6px';
  font(40,700,'"IBM Plex Mono", ui-monospace, monospace'); ctx.fillStyle=ink; ctx.fillText(({erasmus:'FIN DE ERASMUS EN', cumple:'CUMPLE EN', reencuentro:'REENCUENTRO EN', despedida:'DESPEDIDA EN'})[t.ocasion]||'NOS VAMOS A', 72, 268);
  if('letterSpacing' in ctx) ctx.letterSpacing='0px';
  // nombre del destino
  var nombre = Z.corto.toUpperCase(); var lineas=[nombre];
  var fam = '"TikTok Sans", "Arial Narrow", Arial, sans-serif';
  var size=250; font(size,900,fam); if(cond) ctx.fontStretch='condensed';
  if(ctx.measureText(nombre).width>936 && /[\s-]/.test(nombre)){ var cut = nombre.search(/[\s-]/); lineas=[nombre.slice(0,cut+(nombre[cut]==='-'?1:0)).trim(), nombre.slice(cut+1).trim()]; }
  var widest = function(){ return Math.max.apply(null, lineas.map(function(l){ return ctx.measureText(l).width; })); };
  while(widest()>936 && size>110){ size-=6; font(size,900,fam); if(cond) ctx.fontStretch='condensed'; }
  var y = 268 + size*0.92;
  lineas.forEach(function(l){ ctx.globalAlpha=.92; ctx.fillStyle=acc; ctx.fillText(l, 72+9, y+7); ctx.globalAlpha=1; ctx.fillStyle=ink; ctx.fillText(l, 72, y); y += size*0.86; });
  y -= size*0.86;
  // lema
  font(58,500,'"Bodoni Moda", Didot, Georgia, serif', true); if(cond) ctx.fontStretch='normal'; ctx.fillStyle=ink;
  var frase = cap(ENG.frasePlan(Z, t.plan)); wrap(frase, 72, y+86, 900, 66, 2);
  // fechas
  font(36,700,'"IBM Plex Mono", ui-monospace, monospace'); if('letterSpacing' in ctx) ctx.letterSpacing='3px'; ctx.fillText(fechasTexto(t,A).toUpperCase(), 72, y+86+66*Math.min(2,lineasDe(frase,900))+20); if('letterSpacing' in ctx) ctx.letterSpacing='0px';
  // ticket con el grupo
  var tx=72, ty=1268, tw=936, th=286;
  ctx.fillStyle='#FBF4E6'; ctx.strokeStyle='#30231F'; ctx.lineWidth=6; rr(ctx,tx,ty,tw,th,22); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.globalCompositeOperation='destination-out'; ctx.beginPath(); ctx.arc(tx,ty+th/2,22,0,Math.PI*2); ctx.arc(tx+tw,ty+th/2,22,0,Math.PI*2); ctx.fill(); ctx.restore();
  ctx.strokeStyle='#30231F'; ctx.setLineDash([10,10]); ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(tx+30, ty+th-62); ctx.lineTo(tx+tw-30, ty+th-62); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle='#30231F'; font(26,700,'"IBM Plex Mono", ui-monospace, monospace'); if('letterSpacing' in ctx) ctx.letterSpacing='4px'; ctx.textAlign='right'; ctx.fillText('LA PANDA', tx+tw-34, ty+52); ctx.textAlign='left'; if('letterSpacing' in ctx) ctx.letterSpacing='0px';
  var marcaImg = await cargarImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(MARCA.simbolo()));
  ctx.drawImage(marcaImg, tx+34, ty+12, 46, 46);
  var nombres = (t.integrantes||[]).map(function(m){ return m.nombre.toUpperCase(); });
  var fs=72; var texto=nombres.join('  ·  ');
  font(fs,900,fam); if(cond) ctx.fontStretch='condensed';
  while(lineasDe(texto, tw-68)>2 && fs>40){ fs-=4; font(fs,900,fam); if(cond) ctx.fontStretch='condensed'; }
  wrap(texto, tx+34, ty+52+fs*0.98, tw-68, fs*0.98, 2);
  var base = Z.bases.filter(function(b){ return b.id===t.plan.base; })[0]||Z.bases[0];
  font(26,700,'"IBM Plex Mono", ui-monospace, monospace'); if(cond) ctx.fontStretch='normal'; ctx.fillStyle='#30231F';
  ctx.fillText(('BASE: '+base.nombre).toUpperCase().slice(0,34), tx+34, ty+th-22);
  ctx.textAlign='right'; ctx.fillText(APP.toUpperCase()+' · '+t.code, tx+tw-34, ty+th-22); ctx.textAlign='left';
  // sello con la identidad del grupo
  var idt = ENG.identidad(A);
  ctx.save(); ctx.translate(196, 1222); ctx.rotate(-0.2);
  ctx.fillStyle='#FBF4E6'; ctx.beginPath(); ctx.arc(0,0,118,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=acc; ctx.lineWidth=8; ctx.beginPath(); ctx.arc(0,0,110,0,Math.PI*2); ctx.stroke(); ctx.lineWidth=3; ctx.beginPath(); ctx.arc(0,0,94,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle=acc; ctx.textAlign='center'; font(29,700,'"IBM Plex Mono", ui-monospace, monospace');
  var pal = idt[0].toUpperCase().split(' '), l1='', l2='', lns=[];
  pal.forEach(function(w){ var tst=(l1?l1+' ':'')+w; if(ctx.measureText(tst).width<160) l1=tst; else { lns.push(l1); l1=w; } }); lns.push(l1); lns=lns.slice(0,3);
  var y0 = -((lns.length-1)*34)/2+10; lns.forEach(function(l,i){ ctx.fillText(l, 0, y0+i*34); });
  ctx.restore(); ctx.textAlign='left';
  // grano de papel
  try{ var g=document.createElement('canvas'); g.width=g.height=160; var gx=g.getContext('2d'); var d=gx.createImageData(160,160); for(var i=0;i<d.data.length;i+=4){ var v=Math.random()*255; d.data[i]=d.data[i+1]=d.data[i+2]=v; d.data[i+3]=22; } gx.putImageData(d,0,0); ctx.globalCompositeOperation='multiply'; ctx.fillStyle=ctx.createPattern(g,'repeat'); ctx.fillRect(0,0,W,H); ctx.globalCompositeOperation='source-over'; }catch(e){}
  function lineasDe(txt, maxw){ var ws=String(txt).split(' '), l='', n=1; ws.forEach(function(w){ var tst=l?l+' '+w:w; if(ctx.measureText(tst).width>maxw && l){ n++; l=w; } else l=tst; }); return n; }
  function wrap(txt, x, y, maxw, lh, maxl){ var ws=String(txt).split(' '), l='', n=0; for(var i=0;i<ws.length;i++){ var tst=l?l+' '+ws[i]:ws[i]; if(ctx.measureText(tst).width>maxw && l){ ctx.fillText(l,x,y); y+=lh; n++; l=ws[i]; if(n>=maxl-1){ var rest=ws.slice(i).join(' '); while(ctx.measureText(rest+'…').width>maxw && rest.length>3) rest=rest.slice(0,-1); if(rest!==ws.slice(i).join(' ')) rest+='…'; ctx.fillText(rest,x,y); return; } } else l=tst; } ctx.fillText(l,x,y); }
}
function rr(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function guardarImagen(cv, Z){
  var nombre='zaino-'+Z.id+'.png';
  cv.toBlob(function(blob){
    if(!blob){ toast('No se pudo crear la imagen'); return; }
    if(downloads){ downloads.save({filename:nombre, data:blob}).then(function(r){ if(r && r.status==='saved') toast('Imagen guardada'); }, function(e){ if(e && e.code==='declined') return; fallbackImg(cv); }); }
    else fallbackImg(cv);
  }, 'image/png');
}
function fallbackImg(cv){ var host=$('#img-fb'); if(!host) return; try{ host.innerHTML='<p class="note">Mantén pulsada la imagen y elige «Guardar» o «Añadir a Fotos».</p><div class="cardwrap" style="margin-top:8px"><img alt="Tarjeta del viaje" src="'+cv.toDataURL('image/png')+'"></div>'; host.scrollIntoView({behavior:'smooth'}); }catch(e){ toast('Haz una captura de pantalla de la tarjeta'); } }

/* ---------- selector de viaje (gastos / reservas) ---------- */
function selectorViaje(key){
  var L=misViajes(); if(!L.length) return '';
  var cur = S[key] || S.code || L[0].code;
  if(L.length===1) return '';
  return '<div class="tabs" style="position:static;margin-bottom:10px">'+L.map(function(v){ return '<button data-sel="'+esc(v.code)+'" class="'+(v.code===cur?'on':'')+'">'+esc(v.titulo||v.code)+'</button>'; }).join('')+'</div>';
}
function viajeSel(key){ var L=misViajes(); if(!L.length) return null; var c=S[key]||S.code||L[0].code; if(!miEntrada(c)) c=L[0].code; S[key]=c; return c; }
function wireSelector(key){ wire(function(){ on('[data-sel]','click',function(e,b){ S[key]=b.dataset.sel; S.code=b.dataset.sel; suscribir(b.dataset.sel); render(); }); }); }
function sinViajes(txt){ return '<div class="empty">'+ART.q('maleta')+'<b>Aún no tienes viajes</b><p class="muted">'+txt+'</p><button class="btn" id="b-cv">Crear un viaje</button></div>'+(function(){ wire(function(){ on('#b-cv','click',crearViaje); }); return ''; })(); }

/* ---------- GASTOS (tipo Tricount) ---------- */
function balances(gastos, ints){
  // en céntimos enteros: el reparto cuadra siempre (los céntimos sobrantes van, por turnos, a quien no pagó)
  var neto={}; ints.forEach(function(m){ neto[m.id]=0; });
  gastos.forEach(function(g){
    var c = Math.round((+g.importe||0)*100); if(!c) return;
    var entre=((g.entre&&g.entre.length)?g.entre:ints.map(function(m){ return m.id; })).slice();
    var base = Math.floor(c/entre.length), resto = c - base*entre.length;
    entre.sort(function(a,b){ return (a===g.pagadoPor) - (b===g.pagadoPor) || (a<b?-1:1); });
    if(neto[g.pagadoPor]==null) neto[g.pagadoPor]=0; neto[g.pagadoPor]+=c;
    entre.forEach(function(id, k){ if(neto[id]==null) neto[id]=0; neto[id] -= base + (k<resto?1:0); });
  });
  var deud=[], acre=[]; Object.keys(neto).forEach(function(id){ if(neto[id]<0) deud.push({id:id,v:-neto[id]}); else if(neto[id]>0) acre.push({id:id,v:neto[id]}); });
  deud.sort(function(a,b){ return b.v-a.v; }); acre.sort(function(a,b){ return b.v-a.v; });
  var mov=[], i=0, j=0; while(i<deud.length && j<acre.length){ var x=Math.min(deud[i].v, acre[j].v); mov.push({de:deud[i].id, a:acre[j].id, v:x/100}); deud[i].v-=x; acre[j].v-=x; if(!deud[i].v) i++; if(!acre[j].v) j++; }
  var netoE={}; Object.keys(neto).forEach(function(id){ netoE[id]=neto[id]/100; });
  return {neto:netoE, mov:mov};
}
function vistaLista(){
  var html = cabecera()+'<h2 class="d" style="margin-bottom:10px">Lista</h2>';
  var code = viajeSel('listaCode'); if(!code) return html+sinViajes('Crea o únete a un viaje y aquí tenéis la lista compartida: documentos, maleta y reservas.');
  if(live.code!==code) suscribir(code);
  html += selectorViaje('listaCode'); wireSelector('listaCode');
  var t=live.trip; if(!live.loaded||!t) return html+'<div class="card"><p class="muted">Cargando…</p></div>';
  var Z = t.plan && zona(t.plan.zona);
  if(!Z) html += '<div class="note" style="margin-bottom:10px">Cuando salga el plan, aquí aparecerán también sugerencias para vuestro destino (reservas, coche, playa, nieve…).</div>';
  return html + subLista(t, Z, agregado());
}
function vistaGastos(){
  var html = cabecera()+'<h2 class="d" style="margin-bottom:10px">Gastos</h2>';
  var code = viajeSel('gastosCode'); if(!code) return html+sinViajes('Crea o únete a un viaje y aquí apuntáis quién paga qué.');
  if(live.code!==code) suscribir(code);
  html += selectorViaje('gastosCode'); wireSelector('gastosCode');
  var t=live.trip; if(!live.loaded||!t) return html+'<div class="card"><p class="muted">Cargando…</p></div>';
  var ints=t.integrantes||[], nm={}; ints.forEach(function(m){ nm[m.id]=m.nombre; });
  var G=live.gastos, total=G.reduce(function(s,g){ return s+(+g.importe||0); },0), B=balances(G, ints);
  var me = miEntrada(code);
  html += '<div class="ticket"><div class="row" style="justify-content:space-between"><div><div class="lab">'+esc(tituloViaje(t, t.plan&&zona(t.plan.zona)))+'</div><div class="d" style="font-size:44px">'+dinero(total)+'</div></div><div style="text-align:right"><div class="lab">Por persona</div><b class="num">'+dinero(ints.length?total/ints.length:0)+'</b></div></div></div>';
  html += '<button class="btn full" id="b-gasto" style="margin:12px 0">Añadir gasto</button>';
  html += '<div class="card stack"><div class="lab">Balance</div>'+ints.map(function(m){ var v=Math.round((B.neto[m.id]||0)*100)/100; return '<div class="bal"><span class="row"><span class="av s">'+inicial(m.nombre)+'</span>'+esc(m.nombre)+(me&&me.miembro===m.id?' <span class="muted">(tú)</span>':'')+'</span><span class="num '+(v>0.005?'pos':(v<-0.005?'neg':''))+'">'+(v>0.005?'+':'')+dinero(v)+'</span></div>'; }).join('')+'</div>';
  if(B.mov.length) html += '<div class="card stack" style="margin-top:12px"><div class="lab">Para quedar en paz</div>'+B.mov.map(function(x){ return '<div class="bal"><span><b>'+esc(nm[x.de]||'?')+'</b> paga a <b>'+esc(nm[x.a]||'?')+'</b></span><span class="num">'+dinero(x.v)+'</span></div>'; }).join('')+'</div>';
  html += '<div class="card stack" style="margin-top:12px"><div class="lab">Movimientos</div>'+(G.length?G.map(function(g){ var entre=(g.entre&&g.entre.length&&g.entre.length<ints.length)?g.entre.map(function(id){ return nm[id]||'?'; }).join(', '):'todos'; return '<div class="bal"><span class="grow"><b>'+esc(g.concepto)+'</b><br><span class="muted" style="font-size:13px">Pagó '+esc(nm[g.pagadoPor]||'?')+' · entre '+esc(entre)+'</span></span><span class="num">'+dinero(+g.importe||0)+'</span><button class="btn xs ghost" data-edit-g="'+esc(g.id)+'" aria-label="Editar">Editar</button></div>'; }).join(''):'<p class="muted">Aún no hay gastos. Apunta el primero: el piso, los billetes, la cena…</p>')+'</div>';
  wire(function(){ on('#b-gasto','click',function(){ hojaGasto(t, null); }); on('[data-edit-g]','click',function(e,b){ hojaGasto(t, G.filter(function(g){ return g.id===b.dataset.editG; })[0]); }); });
  return html;
}
function hojaGasto(t, g, pre){
  var ints=t.integrantes||[], me=miEntrada(t.code); var pagador = g?g.pagadoPor:(me?me.miembro:ints[0].id); var entre = g&&g.entre&&g.entre.length ? g.entre : ints.map(function(m){ return m.id; });
  pre = pre||{};
  hoja('<form class="stack" id="f-g" novalidate><h2 class="d">'+(g?'Editar gasto':'Nuevo gasto')+'</h2>'+
    '<label class="f">Concepto<input type="text" id="g-c" maxlength="60" required value="'+esc(g?g.concepto:(pre.concepto||''))+'" placeholder="Ej. Cena del sábado"></label>'+
    '<label class="f">Importe (€)<input type="number" id="g-i" inputmode="decimal" step="0.01" min="0.01" required value="'+(g?(+g.importe).toFixed(2):(pre.importe||''))+'" placeholder="0,00"></label>'+
    '<label class="f">Pagó<select id="g-p">'+ints.map(function(m){ return '<option value="'+esc(m.id)+'"'+(m.id===pagador?' selected':'')+'>'+esc(m.nombre)+'</option>'; }).join('')+'</select></label>'+
    '<div class="lab">Entre quién se reparte</div><div class="stack" style="gap:6px">'+ints.map(function(m){ return '<label class="chk"><input type="checkbox" value="'+esc(m.id)+'" class="g-e"'+(entre.indexOf(m.id)>-1?' checked':'')+'> '+esc(m.nombre)+'</label>'; }).join('')+'</div>'+
    '<div class="err" id="g-err" hidden></div><button class="btn full" type="submit">'+(g?'Guardar cambios':'Añadir')+'</button>'+(g?'<div id="g-del"><button type="button" class="btn ghost full" id="g-b-del">Borrar este gasto</button></div>':'')+'</form>', function(el){
    $('#f-g',el).addEventListener('submit', function(e){ e.preventDefault(); var c=$('#g-c',el).value.trim(), imp=Math.round(parseFloat(String($('#g-i',el).value).replace(',','.'))*100)/100, pg=$('#g-p',el).value, en=$$('.g-e',el).filter(function(x){ return x.checked; }).map(function(x){ return x.value; });
      var er=$('#g-err',el); if(!c || !(imp>0)){ er.hidden=false; er.textContent='Pon un concepto y un importe mayor que cero.'; return; } if(!en.length){ er.hidden=false; er.textContent='Marca al menos a una persona.'; return; }
      var data={concepto:c, importe:imp, pagadoPor:pg, entre:en.length===ints.length?[]:en, ts:g?g.ts:Date.now()};
      var p = g ? db.doc('viajes2/'+t.code+'/gastos/'+g.id).set(data) : gastoCol(t.code).add(data);
      escribir(p).then(function(){ cerrarHoja(); toast(g?'Gasto actualizado':'Gasto añadido'); }, function(){ er.hidden=false; er.textContent=''+'No se pudo guardar: revisa la conexión y vuelve a probar.'+''; }); });
    on('#g-b-del','click',function(){ var z=$('#g-del',el); z.innerHTML='<div class="note">¿Seguro? No se puede deshacer.</div><div class="row" style="margin-top:8px"><button type="button" class="btn grow" id="g-si">Sí, borrar</button><button type="button" class="btn ghost grow" id="g-no">No</button></div>'; on('#g-no','click',cerrarHoja,el); on('#g-si','click',function(){ escribir(db.doc('viajes2/'+t.code+'/gastos/'+g.id).delete()).then(function(){ cerrarHoja(); toast('Gasto borrado'); }); },el); }, el);
  });
}

/* ---------- RESERVAS ---------- */
var CAT_ART = {vuelo:'origen', tren:'tren', aloj:'piso', coche:'llave', ferry:'agua', bus:'tren', camper:'maleta', actividad:'postal', extra:'nota'};
/* ---------- RESERVAS: el viaje, paso a paso ----------
   Ordenado como se reserva de verdad: llegar → dormir → moverse → planes con entrada → lo demás.
   Los enlaces son siempre búsquedas reales; si hay códigos de afiliado configurados se añaden y se avisa. */
var PASOS_RSV = [
  {k:'llegar', t:'Cómo llegar', s:'Primero lo que más sube de precio con el tiempo.', cats:['vuelo','tren','ferry','bus']},
  {k:'dormir', t:'Dónde dormir', s:'Con las fechas y las personas ya puestas en la búsqueda.', cats:['aloj']},
  {k:'moverse', t:'Moverse allí', s:'', cats:['coche','camper']},
  {k:'planes', t:'Planes con entrada', s:'Los que se agotan o piden reserva.', cats:['actividad']},
  {k:'otros', t:'Otras cosas', s:'Lo que habéis añadido vosotros.', cats:['extra']}
];
function afiliados(){ return (window.ZAINO_CONFIG && window.ZAINO_CONFIG.afiliados) || {}; }
// Añade el código de afiliado del dominio si existe en la configuración (p. ej. {"booking.com": {"aid": "123"}})
function enlaceAf(u){
  var A = afiliados(), host=''; try{ host = new URL(u).hostname.replace(/^www\./,''); }catch(e){ return {u:u, af:false}; }
  var k = Object.keys(A).filter(function(d){ return host===d || host.slice(-d.length-1)==='.'+d; })[0];
  if(!k) return {u:u, af:false};
  try{ var x = new URL(u); Object.keys(A[k]).forEach(function(p){ x.searchParams.set(p, A[k][p]); }); return {u:x.toString(), af:true}; }catch(e){ return {u:u, af:false}; }
}
function estadoRsv(e){ e=e||{}; return e.estado==='confirmada' ? 'hecha' : (e.estado==='descartada' ? 'fuera' : (e.estado==='mirando' ? 'mirando' : 'pendiente')); }
function vistaReservas(){
  var html = cabecera()+'<h2 class="d" style="margin-bottom:10px">Reservas</h2>';
  var code = viajeSel('rsvCode'); if(!code) return html+sinViajes('Cuando tengáis plan, aquí tenéis paso a paso todo lo que hay que reservar: vuelos, alojamiento y entradas.');
  if(live.code!==code) suscribir(code);
  html += selectorViaje('rsvCode'); wireSelector('rsvCode');
  var t=live.trip; if(!live.loaded||!t) return html+'<div class="card"><p class="muted">Cargando…</p></div>';
  if(!t.plan) return html+'<div class="empty">'+ART.q('calendario')+'<b>Todavía no hay plan</b><p class="muted">Cuando elijáis destino, aquí saldrá paso a paso lo que hay que reservar, con las búsquedas ya hechas.</p><button class="btn" id="b-ir">Ver el viaje</button></div>'+(function(){ wire(function(){ on('#b-ir','click',function(){ abrirViaje(code); }); }); return ''; })();
  var Z=zona(t.plan.zona), A=agregado(), me=miEntrada(t.code);
  var items = ENG.reservas(Z, A, t, t.plan).concat((t.extras||[]).map(function(x){ return {key:x.key, cat:'extra', titulo:x.titulo, detalle:x.nota||'', enlaces:x.url?[{t:'Abrir', u:x.url}]:[] }; }));
  var est=t.reservas||{}, nm={}; (t.integrantes||[]).forEach(function(m){ nm[m.id]=m.nombre; });
  var vivos = items.filter(function(r){ return estadoRsv(est[r.key])!=='fuera'; });
  var hechas = vivos.filter(function(r){ return estadoRsv(est[r.key])==='hecha'; });
  var siguiente = null; PASOS_RSV.some(function(p){ siguiente = vivos.filter(function(r){ return p.cats.indexOf(r.cat)>-1 && estadoRsv(est[r.key])!=='hecha'; })[0]; return !!siguiente; });
  var hayAf = false;
  function botones(r, grande){ return (r.enlaces||[]).map(function(l, i){ var e=enlaceAf(l.u); if(e.af) hayAf=true;
      return '<a class="'+(i===0 ? 'btn '+(grande?'':'sm ') : 'ext ')+'" target="_blank" rel="noopener'+(e.af?' sponsored':'')+'" href="'+esc(e.u)+'" data-clic="'+esc(r.key)+'">'+(i===0 ? 'Buscar en '+esc(l.t)+' ↗' : esc(l.t))+'</a>'; }).join(''); }
  // cabecera: progreso y siguiente paso
  html += '<div class="ticket" style="--zbg:'+Z.bg+'"><div class="row" style="justify-content:space-between"><div><div class="lab">'+esc(Z.corto)+' · '+esc(fechasTexto(t,A))+'</div><div class="d" style="font-size:40px">'+hechas.length+' de '+vivos.length+'</div><span class="muted" style="font-size:13px">cosas reservadas</span></div><div style="width:64px">'+ART.q('maleta')+'</div></div><div class="meter" style="margin-top:8px"><i style="width:'+Math.round(100*hechas.length/Math.max(1,vivos.length))+'%"></i></div></div>';
  if(siguiente){ var es=est[siguiente.key]||{};
    html += '<div class="card stack rsv-sig" style="margin-top:12px"><div class="lab">Lo siguiente</div><div class="hd row" style="align-items:flex-start"><span class="ic" style="background:'+Z.inks[0]+'">'+ART.q(CAT_ART[siguiente.cat]||'nota')+'</span><div class="grow"><b style="font-size:18px">'+esc(siguiente.titulo)+'</b><p class="muted" style="font-size:13.5px;margin-top:2px">'+esc(siguiente.detalle)+'</p>'+(es.estado==='mirando'?'<p style="font-size:13.5px;margin-top:4px"><span class="pill warn">Lo mira '+esc(nm[es.por]||'alguien')+'</span></p>':'')+'</div></div>'+
      '<div class="row wrap" style="gap:8px">'+botones(siguiente, true)+'</div>'+
      '<div class="row wrap" style="gap:8px"><button class="btn sm ghost" data-rs="'+esc(siguiente.key)+'" data-st="confirmar">✓ Ya está reservado</button>'+(es.estado!=='mirando'||es.por!==(me&&me.miembro)?'<button class="btn sm ghost" data-rs="'+esc(siguiente.key)+'" data-st="mirando">Me encargo yo</button>':'')+'</div></div>';
  } else if(vivos.length){
    html += '<div class="card stack" style="margin-top:12px;background:var(--okbg);border-color:var(--ok)"><b>Todo reservado. ¡A hacer la maleta!</b><p class="muted" style="font-size:14px">Los localizadores y notas están abajo, en cada paso.</p></div>';
  }
  // los pasos
  PASOS_RSV.forEach(function(p, pi){
    var L = items.filter(function(r){ return p.cats.indexOf(r.cat)>-1; }); if(!L.length) return;
    var hechasP = L.filter(function(r){ return estadoRsv(est[r.key])==='hecha'; }).length, vivosP = L.filter(function(r){ return estadoRsv(est[r.key])!=='fuera'; }).length;
    html += '<section class="rsv-paso"><div class="row" style="align-items:baseline;gap:10px;margin:22px 0 8px"><span class="rsv-n">'+(pi+1)+'</span><h3 class="grow" style="margin:0">'+esc(p.t)+'</h3><span class="pill '+(vivosP&&hechasP===vivosP?'ok':'')+'">'+hechasP+'/'+vivosP+'</span></div>'+(p.s?'<p class="muted" style="font-size:13px;margin:-4px 0 8px">'+esc(p.s)+'</p>':'')+'<div class="stack" style="gap:8px">';
    L.forEach(function(r){ var e=est[r.key]||{}, stt=estadoRsv(e);
      if(stt==='hecha'){ html += '<div class="card rsv conf"><div class="row"><span class="grow"><b>✓ '+esc(r.titulo)+'</b><br><span style="font-size:13.5px">Reservado'+(e.por&&nm[e.por]?' por '+esc(nm[e.por]):'')+(e.nota?' · '+esc(e.nota):'')+'</span></span><button class="btn xs ghost" data-rs="'+esc(r.key)+'" data-st="deshacer">Deshacer</button></div></div>'; return; }
      if(stt==='fuera'){ html += '<div class="rsv-fuera row"><span class="grow muted" style="font-size:13.5px"><s>'+esc(r.titulo)+'</s> · no hace falta</span><button class="lnk" data-rs="'+esc(r.key)+'" data-st="deshacer">Recuperar</button></div>'; return; }
      html += '<div class="card rsv"><div class="hd"><span class="ic" style="background:'+Z.inks[0]+'">'+ART.q(CAT_ART[r.cat]||'nota')+'</span><div class="grow"><b>'+esc(r.titulo)+'</b>'+(stt==='mirando'?' <span class="pill warn">Lo mira '+esc(nm[e.por]||'alguien')+'</span>':'')+'<details><summary class="muted" style="font-size:13px;font-weight:600">Detalles</summary><p class="muted" style="font-size:13.5px">'+esc(r.detalle)+'</p></details></div></div>'+
        ((r.enlaces||[]).length?'<div class="row wrap" style="gap:6px;align-items:center">'+botones(r, false)+'</div>':'')+
        '<div class="act"><button class="btn xs ghost" data-rs="'+esc(r.key)+'" data-st="confirmar">✓ Ya está</button>'+(stt!=='mirando'?'<button class="btn xs ghost" data-rs="'+esc(r.key)+'" data-st="mirando">Me encargo yo</button>':'')+'<button class="btn xs ghost" data-rs="'+esc(r.key)+'" data-st="descartar">No hace falta</button></div></div>';
    });
    html += '</div></section>';
  });
  html += '<button class="btn ghost full" id="b-extra" style="margin-top:18px">+ Añadir otra reserva</button>';
  html += '<p class="muted" style="font-size:12px;margin-top:12px">Zaino no reserva ni cobra nada: los botones abren la búsqueda en cada web, con vuestras fechas y personas cuando las sabemos. Comprobad precio y condiciones allí antes de pagar.'+(hayAf?' Algunos enlaces son de afiliado: si reservas a través de ellos, Zaino puede recibir una comisión y a ti no te cuesta más.':'')+'</p>';
  wire(function(){
    on('[data-clic]','click',function(e,b){ var k=b.dataset.clic, upd={}; var e0=est[k]||{}; if(!e0.estado || e0.estado==='posible'){ upd[k]={estado:'mirando', por:me?me.miembro:null, ts:Date.now()}; escribir(tripRef(t.code).update({reservas:upd})).catch(function(){}); } });
    on('#b-extra','click',function(){ hoja('<form class="stack" id="f-x"><h2 class="d">Otra reserva</h2><label class="f">Qué es<input type="text" id="x-t" maxlength="60" required placeholder="Ej. Entradas del concierto"></label><label class="f">Enlace (opcional)<input type="text" id="x-u" placeholder="https://…"></label><label class="f">Nota (opcional)<input type="text" id="x-n" maxlength="80"></label><button class="btn full" type="submit">Añadir</button></form>', function(el){ $('#f-x',el).addEventListener('submit',function(e){ e.preventDefault(); var ti=$('#x-t',el).value.trim(); if(!ti) return; var u=$('#x-u',el).value.trim(); if(u && !/^https:\/\//.test(u)) u=''; var ex=(t.extras||[]).concat([{key:'x-'+Date.now(), titulo:ti, url:u, nota:$('#x-n',el).value.trim()}]); escribir(tripRef(t.code).update({extras:ex})).then(function(){ cerrarHoja(); toast('Añadida'); }, function(){ toast('No se pudo guardar'); }); }); }); });
    on('[data-rs]','click',function(e,b){ var key=b.dataset.rs, st=b.dataset.st, por=me?me.miembro:null; var upd={};
      if(st==='confirmar') return hojaConfirmar(t, items.filter(function(r){ return r.key===key; })[0], por);
      if(st==='mirando') upd[key]={estado:'mirando', por:por, ts:Date.now()};
      if(st==='descartar') upd[key]={estado:'descartada', por:por, ts:Date.now()};
      if(st==='deshacer') upd[key]={estado:'posible', por:null, nota:'', ts:Date.now()};
      escribir(tripRef(t.code).update({reservas:upd})).catch(function(){ toast('No se pudo guardar'); }); });
  });
  return html;
}
function hojaConfirmar(t, r, por){
  hoja('<form class="stack" id="f-c"><h2 class="d">Confirmar</h2><p><b>'+esc(r.titulo)+'</b></p><label class="f">Nota para el grupo (opcional)<input type="text" id="c-n" maxlength="90" placeholder="Ej. Localizador ABC123, sale a las 7:05"></label><label class="f">Importe pagado (opcional)<input type="number" id="c-i" inputmode="decimal" step="0.01" min="0" placeholder="0,00"></label><label class="chk"><input type="checkbox" id="c-g" checked> Apuntarlo también en Gastos, a repartir entre todos</label><button class="btn full" type="submit">Marcar como reservada</button></form>', function(el){
    $('#f-c',el).addEventListener('submit', function(e){ e.preventDefault(); var nota=$('#c-n',el).value.trim(), imp=Math.round(parseFloat(String($('#c-i',el).value).replace(',','.'))*100)/100; var upd={}; upd[r.key]={estado:'confirmada', por:por, nota:nota, ts:Date.now()};
      escribir(tripRef(t.code).update({reservas:upd})).then(function(){ if(imp>0 && $('#c-g',el).checked && por){ return gastoCol(t.code).add({concepto:r.titulo, importe:imp, pagadoPor:por, entre:[], ts:Date.now()}); } }).then(function(){ cerrarHoja(); toast('Reserva confirmada · la tienes en «Confirmadas»'); render(true); }, function(){ toast('No se pudo guardar'); }); });
  });
}

/* ---------- PERFIL ---------- */
function vistaPerfil(){
  var p=perfil(), L=misViajes();
  var html = cabecera()+'<h2 class="d" style="margin-bottom:12px">Perfil</h2>';
  html += '<div class="card stack"><div class="row" style="gap:14px"><span class="av" style="width:86px;height:86px;font-size:34px;'+avatarEstilo(p.foto)+'">'+(avatarOk(p.foto)?'':inicial(p.nombre||'?'))+'</span><div class="stack" style="gap:6px"><label class="btn sm ghost" for="i-foto" style="cursor:pointer">'+(p.foto?'Cambiar foto':'Poner foto')+'</label><input type="file" id="i-foto" accept="image/*" hidden>'+(p.foto?'<button class="lnk" id="b-sinfoto">Quitar foto</button>':'')+'</div></div>'+
    '<label class="f">Tu nombre<input type="text" id="i-nombre" maxlength="24" value="'+esc(p.nombre||'')+'" placeholder="Cómo te llaman"></label><p class="muted" style="font-size:13px">La foto la verá tu grupo junto a tus respuestas. Se guarda en este móvil.</p></div>';
  html += '<div class="card stack" style="margin-top:12px"><div class="lab">Mis viajes</div>'+(L.length?L.map(function(v){ return '<div class="row"><button class="lnk grow" style="text-align:left" data-open="'+esc(v.code)+'">'+esc(v.titulo||v.code)+'</button><span class="m muted" style="font-size:12px">'+esc(v.code)+'</span><span id="q-'+esc(v.code)+'"><button class="btn xs ghost" data-q="'+esc(v.code)+'">Quitar</button></span></div>'; }).join(''):'<p class="muted">Ninguno todavía.</p>')+'</div>';
  html += '<details class="card" style="margin-top:12px"><summary><b>Cómo invitar a tu grupo</b></summary><div class="stack" style="margin-top:10px;font-size:14px"><p>Abre el viaje y dale a <b>Enviar por WhatsApp</b> (o copia el enlace). Quien lo abra elige su nombre y responde desde su móvil: no hace falta registrarse ni instalar nada.</p><p>Para tenerla como app: en el iPhone, Safari → Compartir → «Añadir a pantalla de inicio». En Android, Chrome → menú → «Instalar app».</p></div></details>';
  html += '<details class="card" style="margin-top:12px"><summary><b>Tus datos</b></summary><div class="stack" style="margin-top:10px;font-size:14px">'+(ZSTORE.modo==='supabase' ? '<p>Tu presupuesto y tus fechas imposibles son privados: nadie del grupo los ve, ni quien organiza. Solo se usan para calcular las propuestas.</p>' : '<p>Tu presupuesto y tus fechas imposibles no salen en ninguna pantalla: solo se usan para calcular las propuestas. Ojo: en esta versión de prueba se guardan junto al resto del viaje; en la versión final, con servidor propio, son privados de verdad.</p>')+'<p>El resto de respuestas, tus gastos y la lista sí los ve tu grupo.</p><p>Zaino no usa tus datos para publicidad ni los vende.</p><div id="z-bm"><button class="btn ghost full" id="b-borrarme">Borrar todos mis datos de Zaino</button></div></div></details>';
  html += '<div id="reset" style="margin-top:12px"><button class="btn ghost full" id="b-reset">Borrar los datos de este móvil</button></div>';
  html += '<p class="muted" style="font-size:12px;margin-top:14px;text-align:center">Los planes son sitios reales con su enlace o su mapa; algunos aún sin fuente oficial. Horarios y precios cambian: comprobadlos siempre en el enlace antes de ir o pagar.</p>';
  wire(function(){
    var inp=$('#i-nombre'); inp.addEventListener('change',function(){ var q=perfil(); q.nombre=inp.value.trim(); ls('perfil',q); toast('Nombre guardado'); });
    $('#i-foto').addEventListener('change',function(e){ var f=e.target.files&&e.target.files[0]; if(!f) return; var rd=new FileReader(); rd.onload=function(){ var im=new Image(); im.onload=function(){ var c=document.createElement('canvas'); c.width=c.height=128; var x=c.getContext('2d'); var s=Math.min(im.width,im.height); x.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,128,128); var q=perfil(); q.foto=c.toDataURL('image/jpeg',0.78); ls('perfil',q); render(); toast('Foto guardada'); }; im.src=rd.result; }; rd.readAsDataURL(f); });
    on('#b-sinfoto','click',function(){ var q=perfil(); q.foto=''; ls('perfil',q); render(); });
    on('[data-open]','click',function(e,b){ abrirViaje(b.dataset.open); });
    on('[data-q]','click',function(e,b){ var c=b.dataset.q; var z=$('#q-'+c); z.innerHTML='<button class="btn xs" data-qs="'+esc(c)+'">Sí, quitar</button>'; on('[data-qs]','click',function(){ quitarMiViaje(c); render(); toast('Quitado de este móvil'); }, z); });
    on('#b-borrarme','click',function(){ var z=$('#z-bm');
      // Los viajes que organizas se borran enteros para todo el grupo: hay que avisarlo y pedir confirmación expresa.
      var org=misViajes().filter(function(v){ return v.rol==='jefe'; });
      z.innerHTML='<div class="note">Se borran tus respuestas (también las privadas) de todos tus viajes y sales de ellos. Los gastos que apuntaste en los viajes de otras personas se quedan para que las cuentas del grupo cuadren. No se puede deshacer.</div>'+
        (org.length ? '<div class="note" id="bm-aviso" style="margin-top:8px"><b>Cuidado: organizas '+(org.length===1?'este viaje':'estos '+org.length+' viajes')+' y se borra'+(org.length===1?'':'n')+' ENTERO'+(org.length===1?'':'S')+' para todo el grupo</b> ('+esc(org.map(function(v){ return '«'+(v.titulo||v.code)+'»'; }).join(', '))+'): plan, gastos, lista y respuestas de los demás. Si quieres que sigan existiendo, no pulses borrar.</div><label class="chk" style="margin-top:8px"><input type="checkbox" id="bm-ent"> Entiendo que se borra para todos y no se puede deshacer</label>' : '')+
        '<div class="row" style="margin-top:8px"><button class="btn grow" id="b-bm-si"'+(org.length?' disabled':'')+'>Borrar</button><button class="btn ghost grow" id="b-bm-no">Cancelar</button></div>';
      if(org.length) on('#bm-ent','change',function(e){ $('#b-bm-si',z).disabled=!e.target.checked; }, z);
      on('#b-bm-no','click',function(){ render(); }, z); on('#b-bm-si','click',function(){ ZSTORE.borrarMisDatos().then(function(){ try{ Object.keys(localStorage).filter(function(k){ return /^zaino/.test(k); }).forEach(function(k){ localStorage.removeItem(k); }); }catch(e){} location.hash=''; location.reload(); }, function(){ toast('No se pudo borrar: revisa la conexión'); }); }, z); });
    on('#b-reset','click',function(){ var z=$('#reset'); z.innerHTML='<div class="note">Se borran tu nombre, tu foto y la lista de viajes de este móvil. Los viajes siguen existiendo para el resto del grupo.</div><div class="row" style="margin-top:8px"><button class="btn grow" id="b-r-si">Borrar</button><button class="btn ghost grow" id="b-r-no">Cancelar</button></div>'; on('#b-r-no','click',function(){ render(); }); on('#b-r-si','click',function(){ try{ Object.keys(localStorage).filter(function(k){ return k.indexOf('zaino.')===0; }).forEach(function(k){ localStorage.removeItem(k); }); }catch(e){} S.view='viajes'; render(); toast('Datos borrados'); }); });
  });
  return html;
}

init();
})();
