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
    plan.presTier = A.presTier; plan.mes = A.mes || 0; plan.firmaRespuestas = firma(pub); // mes y presTier del servidor: el móvil no ve las fechas ni el presupuesto privados
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
