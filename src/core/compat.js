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
