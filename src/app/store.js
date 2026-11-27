/* ============================================================================
   ZAINO · capa de datos
   La app habla siempre con ZSTORE. Hay dos implementaciones con la misma interfaz:
   - supabase: la de verdad (base de datos compartida, identidad anónima, permisos RLS,
     motor e IA en el servidor). Se activa rellenando public/config.js.
   - local: modo prueba en un solo navegador (sin servidor). Mismo flujo, sin privacidad real.
   `db` imita la forma de documento/colección que ya usaba la app (viajes2/CODE/...),
   así las pantallas existentes (gastos, lista, reservas, plan) siguen funcionando igual.
   ============================================================================ */
var ZSTORE = (function(){
  'use strict';
  var CFG = window.ZAINO_CONFIG || {};
  var W = window;

  function descargas(){ return { save: function(req){
    var blob = req.data instanceof Blob ? req.data : new Blob([req.data]);
    try{ var f = new File([blob], req.filename, {type: blob.type || 'image/png'});
      if(navigator.canShare && navigator.canShare({files:[f]})) return navigator.share({files:[f], title:'Zaino'}).then(function(){ return {status:'saved'}; }, function(e){ if(e && e.name==='AbortError') throw {code:'declined'}; return bajar(); });
    }catch(e){}
    return bajar();
    function bajar(){ var u=URL.createObjectURL(blob), a=document.createElement('a'); a.href=u; a.download=req.filename; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(u); a.remove(); }, 1500); return Promise.resolve({status:'saved'}); }
  }}; }
  function hex(n){ var a=new Uint8Array(n); crypto.getRandomValues(a); return Array.prototype.map.call(a, function(b){ return ('0'+b.toString(16)).slice(-2); }).join(''); }
  function codigo(){ var A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789', a=new Uint8Array(6), s=''; crypto.getRandomValues(a); for(var i=0;i<6;i++) s+=A[a[i]%A.length]; return s; }
  function ruta(p){ var x=p.split('/'); return {code:x[1], sub:x[2]||null, id:x[3]||null}; }
  function snapDoc(id, data){ return {id:id, exists:data!=null, data:function(){ return data; }}; }
  function snapCol(rows){ return {docs:rows.map(function(r){ return {id:r.id, data:function(){ return r.data; }}; }), empty:!rows.length}; }

  /* =================== SUPABASE =================== */
  function crearSupabase(){
    var sb = W.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {auth:{persistSession:true, autoRefreshToken:true, storageKey:'zaino.sesion'}});
    var uid = null, ids = {}, tokens = {};
    function idDe(code){ if(ids[code]) return Promise.resolve(ids[code]);
      return sb.from('viajes').select('id').eq('code', code).maybeSingle().then(function(r){ if(r.error) throw r.error; if(!r.data) throw {code:'no_encontrado'}; ids[code]=r.data.id; return r.data.id; }); }
    function err(r){ if(r.error) throw r.error; return r.data; }
    var TABLA = {resp:'respuestas', priv:'respuestas_privadas', gastos:'gastos', lista:'lista', res:'resultados'};
    function leerViaje(code){ return sb.from('viajes').select('id, code, token, data').eq('code', code).maybeSingle().then(function(r){ var d=err(r); if(!d) return null; ids[code]=d.id; tokens[code]=d.token;
      return sb.from('miembros').select('miembro, user_id').eq('viaje_id', d.id).then(function(m){ var mm={}; (m.data||[]).forEach(function(x){ mm[x.miembro]=x.user_id; }); return Object.assign({}, d.data, {code:d.code, token:d.token, miembros:mm}); }); }); }
    function leerCol(code, sub){ return idDe(code).then(function(id){
      if(sub==='resp') return sb.from('respuestas').select('miembro, data, updated_at').eq('viaje_id', id).then(function(r){ return err(r).map(function(x){ return {id:x.miembro, data:Object.assign({}, x.data, {updatedAt:Date.parse(x.updated_at)})}; }); });
      return sb.from(TABLA[sub]).select('id, data, created_at').eq('viaje_id', id).then(function(r){ return err(r).map(function(x){ return {id:x.id, data:x.data}; }); });
    }); }
    function leerDoc(code, sub, docId){ return idDe(code).then(function(id){
      if(sub==='res') return sb.from('resultados').select('data').eq('viaje_id', id).maybeSingle().then(function(r){ var d=err(r); return d ? d.data : null; });
      if(sub==='resp' || sub==='priv') return sb.from(TABLA[sub]).select('data, updated_at').eq('viaje_id', id).eq('miembro', docId).maybeSingle().then(function(r){ var d=err(r); return d ? Object.assign({}, d.data, sub==='resp'?{updatedAt:Date.parse(d.updated_at)}:{}) : null; });
      return sb.from(TABLA[sub]).select('data').eq('id', docId).maybeSingle().then(function(r){ var d=err(r); return d ? d.data : null; });
    }); }
    // tiempo real: un canal por viaje; cada cambio vuelve a leer lo afectado (simple y robusto)
    var canales = {};
    function escuchar(code, tabla, cb){
      var parado = false, timer = null, ch = null;
      idDe(code).then(function(id){ if(parado) return;
        var filtro = tabla==='viajes' ? 'id=eq.'+id : 'viaje_id=eq.'+id;
        ch = sb.channel('z-'+tabla+'-'+id+'-'+hex(3)).on('postgres_changes', {event:'*', schema:'public', table:tabla, filter:filtro}, function(){ cb(); }).subscribe(function(estado){ if(estado==='CHANNEL_ERROR' || estado==='TIMED_OUT'){ if(!timer) timer=setInterval(cb, CFG.sondeoMs || 15000); } });
      }).catch(function(){});
      return function(){ parado=true; if(ch) sb.removeChannel(ch); if(timer) clearInterval(timer); };
    }
    var db = {
      doc: function(p){ var r=ruta(p); return {
        get: function(){ return (r.sub ? leerDoc(r.code, r.sub, r.id) : leerViaje(r.code)).then(function(d){ return snapDoc(r.id||r.code, d); }); },
        onSnapshot: function(ok, ko){ var vivo=true, ultimo=null; function f(){ (r.sub ? leerDoc(r.code, r.sub, r.id) : leerViaje(r.code)).then(function(d){ var j=JSON.stringify(d); if(!vivo || j===ultimo) return; ultimo=j; ok(snapDoc(r.id||r.code, d)); }, function(e){ if(vivo && ko) ko(e); }); }
          f(); var off = escuchar(r.code, r.sub ? TABLA[r.sub] : 'viajes', f), off2 = r.sub ? function(){} : escuchar(r.code, 'miembros', f); return function(){ vivo=false; off(); off2(); }; },
        set: function(d){ return idDe(r.code).then(function(id){
          if(r.sub==='resp') return sb.from('respuestas').upsert({viaje_id:id, miembro:r.id, data:d, updated_at:new Date().toISOString()}).then(err);
          if(r.sub==='priv') return sb.from('respuestas_privadas').upsert({viaje_id:id, miembro:r.id, user_id:uid, data:d, updated_at:new Date().toISOString()}).then(err);
          if(r.sub==='gastos' || r.sub==='lista') return sb.from(TABLA[r.sub]).update({data:d}).eq('id', r.id).then(err);
          throw {code:'no_permitido'}; }); },
        update: function(patch){
          if(!r.sub) return sb.rpc('parchear_viaje', {p_code:r.code, p_patch:patch}).then(err);
          return leerDoc(r.code, r.sub, r.id).then(function(actual){ var d=Object.assign({}, actual||{}, patch); return db.doc(p).set(d); }); },
        delete: function(){ return sb.from(TABLA[r.sub]).delete().eq('id', r.id).then(err); }
      }; },
      collection: function(p){ var r=ruta(p); return {
        get: function(){ return leerCol(r.code, r.sub).then(snapCol); },
        onSnapshot: function(ok, ko){ var vivo=true, ultimo=null; function f(){ leerCol(r.code, r.sub).then(function(rows){ var j=JSON.stringify(rows); if(!vivo || j===ultimo) return; ultimo=j; ok(snapCol(rows)); }, function(e){ if(vivo && ko) ko(e); }); }
          f(); var off = escuchar(r.code, TABLA[r.sub], f); return function(){ vivo=false; off(); }; },
        add: function(d){ return idDe(r.code).then(function(id){ return sb.from(TABLA[r.sub]).insert({viaje_id:id, data:d}).select('id').single().then(function(x){ return {id:err(x).id}; }); }); },
        doc: function(docId){ return db.doc(p+'/'+docId); }
      }; }
    };
    return {
      modo:'supabase', db:db, downloads:descargas(), iaActiva: !!CFG.ia,
      init: function(){ return sb.auth.getSession().then(function(r){ if(r.data && r.data.session){ uid=r.data.session.user.id; return; }
          return sb.auth.signInAnonymously().then(function(x){ if(x.error) throw x.error; uid = x.data.user.id; }); }).then(function(){ return {uid:uid}; }); },
      uid: function(){ return uid; },
      crearViaje: function(data){ return sb.rpc('crear_viaje', {p_data:data}).then(function(r){ var d=err(r); ids[d.code]=d.id; tokens[d.code]=d.token; return d; }); },
      previa: function(token){ return sb.rpc('previa_invitacion', {p_token:token}).then(err); },
      unirse: function(token, miembro, nombre){ return sb.rpc('unirse_viaje', {p_token:token, p_miembro:miembro||null, p_nombre:nombre||null}).then(err); },
      token: function(code){ return tokens[code] || null; },
      motor: function(code, accion, zona){ return sb.functions.invoke('motor', {body:{code:code, accion:accion, zona:zona||null}}).then(function(r){ if(r.error) throw r.error; return r.data; }); },
      ia: function(code, pregunta, historial){ return sb.functions.invoke('zaino-ia', {body:{code:code, pregunta:pregunta, historial:historial||[]}}).then(function(r){ if(r.error) return {error:'ia_no_disponible'}; return r.data; }, function(){ return {error:'ia_no_disponible'}; }); },
      salir: function(code){ return sb.rpc('salir_viaje', {p_code:code}).then(err); },
      quitar: function(code, m){ return sb.rpc('quitar_integrante', {p_code:code, p_miembro:m}).then(err); },
      regenerar: function(code){ return sb.rpc('regenerar_invitacion', {p_code:code}).then(function(r){ var t=err(r); tokens[code]=t; return t; }); },
      borrarMisDatos: function(){ return sb.rpc('borrar_mis_datos').then(err).then(function(){ return sb.auth.signOut(); }); }
    };
  }

  /* =================== LOCAL (modo prueba) =================== */
  function crearLocal(){
    var base = null, uid = null;
    function lsg(k){ try{ return localStorage.getItem('zaino.'+k); }catch(e){ return null; } }
    function lss(k,v){ try{ localStorage.setItem('zaino.'+k, v); }catch(e){} }
    function trip(code){ return base.doc('viajes2/'+code).get().then(function(s){ return s.exists ? s.data() : null; }); }
    function col(code, sub){ return base.collection('viajes2/'+code+'/'+sub).get().then(function(q){ return q.docs.map(function(d){ return Object.assign({miembro:d.id}, d.data()); }); }); }
    var api = {
      // «local»: simulador en este navegador · «compartido»: dentro de un artefacto de Claude (base de datos compartida del artefacto)
      modo: W.__mock ? 'local' : 'compartido', downloads:descargas(), iaActiva:false, puedeEscribir:null,
      init: function(){ return Promise.all([W.claude.use('db'), W.__mock ? null : W.claude.use('downloads').catch(function(){ return null; }), W.__mock ? null : W.claude.use('user').catch(function(){ return null; })]).then(function(x){ var d=x[0]; if(!d) throw {code:'sin_db', message:'sin_db'}; if(x[1]) api.downloads = x[1];
        var us = x[2]; var pPerm = us && us.can ? Promise.resolve(us.can('data.write')).then(function(v){ api.puedeEscribir = v; }, function(){}) : Promise.resolve(); return pPerm.then(function(){ return d; }); }).then(function(d){ base = d; api.db = d; uid = lsg('uid') || (function(){ var u=hex(16); lss('uid', u); return u; })(); return {uid:uid}; }); },
      uid: function(){ return uid; },
      crearViaje: function(data){ var code=codigo(), token=hex(18), m={}; m[data.jefe||'m1']=uid;
        return base.doc('viajes2/'+code).set(Object.assign({}, data, {code:code, token:token, miembros:m})).then(function(){ return base.doc('tokens/'+token).set({code:code}); }).then(function(){ return {code:code, token:token}; }); },
      previa: function(token){ return base.doc('tokens/'+token).get().then(function(s){ if(!s.exists) return null; var code=s.data().code; return trip(code).then(function(t){ if(!t || t.token!==token) return null; var mm=t.miembros||{};
        return {code:code, titulo:t.titulo, fechas:t.fechas, dias:t.dias, jefe:t.jefe, ya_dentro: Object.keys(mm).some(function(k){ return mm[k]===uid; }),
          integrantes:(t.integrantes||[]).map(function(i){ return {id:i.id, nombre:i.nombre, ocupado:!!mm[i.id], soy_yo:mm[i.id]===uid}; })}; }); }); },
      unirse: function(token, miembro, nombre){ return api.previa(token).then(function(p){ if(!p) throw {code:'invitacion_no_valida'}; return trip(p.code).then(function(t){
        var mm = t.miembros||{}, mio = Object.keys(mm).filter(function(k){ return mm[k]===uid; })[0];
        if(mio) return {code:p.code, miembro:mio};
        var patch = {miembros:{}};
        if(miembro){ if(mm[miembro]) throw {code:'plaza_ocupada'}; patch.miembros[miembro]=uid; return base.doc('viajes2/'+p.code).update(patch).then(function(){ return {code:p.code, miembro:miembro}; }); }
        var n = (t.integrantes||[]).reduce(function(x,i){ return Math.max(x, +String(i.id).slice(1)||0); }, 0)+1, nuevo='m'+n;
        patch.miembros[nuevo]=uid; patch.integrantes=(t.integrantes||[]).concat([{id:nuevo, nombre:String(nombre||'').trim().slice(0,24)}]);
        return base.doc('viajes2/'+p.code).update(patch).then(function(){ return {code:p.code, miembro:nuevo}; }); }); }); },
      token: function(code){ return null; },
      motor: function(code, accion, zona){ // en el modo prueba el "servidor" corre aquí mismo
        return Promise.all([trip(code), col(code,'resp'), col(code,'priv')]).then(function(x){ var t=x[0], pub=x[1], privs={}; x[2].forEach(function(p){ privs[p.miembro]=p; });
          var ZS = W.ZAINO_ZONAS || [];
          if(accion==='calcular') return base.doc('viajes2/'+code+'/res/actual').set(SERVIDOR.calcular(ZS, t, pub, privs));
          var destino = (t.destinos||[]).length===1 ? t.destinos[0] : zona;
          if(!destino) throw {code:'falta_destino'};
          var mm=t.miembros||{}, yo=Object.keys(mm).filter(function(k){ return mm[k]===uid; })[0];
          if((t.destinos||[]).length!==1 && yo!==t.jefe) throw {code:'solo_organizador'};
          var x = SERVIDOR.elegir(ZS, t, pub, privs, destino); x.eleccion.por = yo;
          return base.doc('viajes2/'+code).update({plan:null}).then(function(){ return base.doc('viajes2/'+code).update(x); });
        }); },
      ia: function(){ return Promise.resolve({disponible:false}); },
      salir: function(code){ return trip(code).then(function(t){ var mm=t.miembros||{}, mio=Object.keys(mm).filter(function(k){ return mm[k]===uid; })[0]; if(!mio) return; var p={miembros:{}}; p.miembros[mio]=null;
        return base.doc('viajes2/'+code+'/resp/'+mio).delete().catch(function(){}).then(function(){ return base.doc('viajes2/'+code+'/priv/'+mio).delete().catch(function(){}); }).then(function(){ return base.doc('viajes2/'+code).update(p); }); }); },
      quitar: function(code, m){ return trip(code).then(function(t){ var p={miembros:{}, integrantes:(t.integrantes||[]).filter(function(i){ return i.id!==m; })}; p.miembros[m]=null;
        return base.doc('viajes2/'+code+'/resp/'+m).delete().catch(function(){}).then(function(){ return base.doc('viajes2/'+code+'/priv/'+m).delete().catch(function(){}); }).then(function(){ return base.doc('viajes2/'+code).update(p); }); }); },
      regenerar: function(code){ var t2=hex(18); return trip(code).then(function(t){ return t && t.token ? base.doc('tokens/'+t.token).delete().catch(function(){}) : null; }).then(function(){ return base.doc('viajes2/'+code).update({token:t2}); }).then(function(){ return base.doc('tokens/'+t2).set({code:code}); }).then(function(){ return t2; }); },
      borrarMisDatos: function(){ try{ Object.keys(localStorage).filter(function(k){ return /^zaino\./.test(k); }).forEach(function(k){ localStorage.removeItem(k); }); }catch(e){} return Promise.resolve(); }
    };
    return api;
  }

  var real = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && W.supabase && W.supabase.createClient);
  var S = real ? crearSupabase() : crearLocal();
  return S;
})();
