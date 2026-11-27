// Función "motor": calcula las propuestas del grupo y el itinerario en el servidor,
// con acceso a las respuestas privadas (presupuesto, fechas) que nunca llegan al navegador.
// Llamada: POST { code, accion: 'calcular' | 'planear', zona? }
import { CORS, json, cargarViaje, ZS, SERVIDOR } from '../_shared/comun.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const { code, accion, zona } = await req.json();
    if (!/^[A-Z0-9]{6}$/.test(code ?? '')) return json({ error: 'codigo_no_valido' }, 400);
    const v = await cargarViaje(req, code);
    if (!v) return json({ error: 'sin_permiso' }, 403);
    if (accion === 'calcular') {
      const res = SERVIDOR.calcular(ZS, v.trip, v.pub, v.priv);
      const { error } = await v.db.from('resultados').upsert({ viaje_id: v.id, data: res, updated_at: new Date().toISOString() });
      if (error) throw error;
      return json({ ok: true, provisional: res.provisional });
    }
    if (accion === 'planear') {
      const fijo = (v.trip.destinos ?? []).length === 1 ? v.trip.destinos[0] : null;
      const destino = fijo ?? zona;
      if (!destino) return json({ error: 'falta_destino' }, 400);
      if (!fijo && !v.esOrganizador) return json({ error: 'solo_organizador' }, 403);
      const patch: any = SERVIDOR.elegir(ZS, v.trip, v.pub, v.priv, destino);
      patch.eleccion.por = v.yo;
      // el plan se sustituye entero (la mezcla profunda dejaría restos del plan anterior)
      await v.db.rpc('servidor_parchear', { p_id: v.id, p_patch: { plan: { __delete__: true } } });
      const { error } = await v.db.rpc('servidor_parchear', { p_id: v.id, p_patch: patch });
      if (error) throw error;
      return json({ ok: true });
    }
    return json({ error: 'accion_desconocida' }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: 'fallo_servidor' }, 500);
  }
});
