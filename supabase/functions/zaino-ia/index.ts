// Función "zaino-ia": el asistente de Zaino. Consulta la biblioteca y el motor con herramientas.
// La clave del proveedor vive en los secretos de Supabase (LLM_API_KEY), nunca en el navegador.
// Llamada: POST { code, pregunta, historial? }
import { CORS, json, cargarViaje, ZS, ENG, COMPAT } from '../_shared/comun.ts';
import { crearLLM } from '../_shared/llm.mjs';
import { responder } from '../_shared/ia_core.mjs';

const LIMITE_DIARIO = Number(Deno.env.get('IA_LIMITE_DIARIO') ?? '40'); // preguntas por viaje y día

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const { code, pregunta, historial } = await req.json();
    if (!pregunta || String(pregunta).length > 800) return json({ error: 'pregunta_no_valida' }, 400);
    const llm = crearLLM({ proveedor: Deno.env.get('LLM_PROVIDER') ?? '', modelo: Deno.env.get('LLM_MODEL') ?? '', clave: Deno.env.get('LLM_API_KEY') ?? '' });
    if (!llm) return json({ disponible: false });
    const v = await cargarViaje(req, code);
    if (!v) return json({ error: 'sin_permiso' }, 403);
    const { data: dentro } = await v.db.rpc('ia_contar', { p_viaje: v.id, p_limite: LIMITE_DIARIO });
    if (dentro === false) return json({ error: 'limite_diario' }, 429);
    const r = await responder({ llm, pregunta, historial: (Array.isArray(historial) ? historial : []) as any,
      contexto: { ENG, COMPAT, ZS, viaje: v.trip, resultados: v.resultados, plan: v.trip.plan ?? null, pub: v.pub, priv: v.priv } });
    return json(r);
  } catch (e) {
    console.error(e);
    return json({ error: 'ia_no_disponible' }, 502);
  }
});
