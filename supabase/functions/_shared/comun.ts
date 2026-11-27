// Utilidades comunes de las funciones de servidor de Zaino.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { ENG, COMPAT, SERVIDOR } from './zaino-core.mjs';
import biblioteca from './biblioteca.json' with { type: 'json' };

export const ZS = biblioteca.zonas.map((z: unknown) => ENG.normalizar(z));
export { ENG, COMPAT, SERVIDOR };

export const CORS = {
  'Access-Control-Allow-Origin': Deno.env.get('ZAINO_ORIGEN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
export const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { ...CORS, 'content-type': 'application/json' } });

// Claves: sirven tanto las antiguas (anon / service_role) como las nuevas (publishable / secret).
const primera = (json: string | undefined) => { try { const o = JSON.parse(json ?? '{}'); return o.default ?? Object.values(o)[0]; } catch { return undefined; } };
const URL_ = Deno.env.get('SUPABASE_URL')!;
// primero las claves nuevas (las antiguas se retiran en 2027)
const ANON = (primera(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS')) || Deno.env.get('SUPABASE_ANON_KEY')) as string;
const SERVICE = (primera(Deno.env.get('SUPABASE_SECRET_KEYS')) || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) as string;
export const admin = () => createClient(URL_, SERVICE, { auth: { persistSession: false } });

// Carga el viaje comprobando que quien llama es miembro (RLS con su propio token)
export async function cargarViaje(req: Request, code: string) {
  const auth = req.headers.get('Authorization') ?? '';
  const jwt = auth.replace(/^Bearer\s+/i, '');
  if (!jwt || jwt.startsWith('sb_')) return null; // hace falta la sesión de la persona, no solo la clave pública
  const usuario = createClient(URL_, ANON, { global: { headers: { Authorization: 'Bearer ' + jwt } }, auth: { persistSession: false } });
  const { data: quien, error: errU } = await usuario.auth.getUser(jwt); // comprueba la firma de la sesión (claves antiguas o nuevas)
  if (errU || !quien?.user) return null;
  const { data: v } = await usuario.from('viajes').select('id, code, data').eq('code', code).maybeSingle();
  if (!v) return null;
  const { data: yo } = await usuario.rpc('mi_miembro', { v: v.id });
  const db = admin();
  const [{ data: pub }, { data: priv }, { data: res }] = await Promise.all([
    db.from('respuestas').select('miembro, data, updated_at').eq('viaje_id', v.id),
    db.from('respuestas_privadas').select('miembro, data').eq('viaje_id', v.id),
    db.from('resultados').select('data').eq('viaje_id', v.id).maybeSingle(),
  ]);
  const P = (pub ?? []).map((r: any) => ({ ...r.data, miembro: r.miembro, updatedAt: Date.parse(r.updated_at) }));
  const V: Record<string, unknown> = {}; (priv ?? []).forEach((r: any) => { V[r.miembro] = r.data; });
  const trip = { ...v.data, code: v.code };
  const esOrganizador = yo && trip.jefe === yo;
  return { id: v.id, trip, pub: P, priv: V, resultados: res?.data ?? null, yo, esOrganizador, db };
}
