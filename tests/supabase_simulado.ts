// Supabase simulado para probar la app de verdad en modo «servidor» sin crear cuentas:
//  - Postgres real (PGlite) con las 3 migraciones, roles y RLS como en Supabase
//  - Auth anónimo (/auth/v1), PostgREST básico (/rest/v1), funciones (/functions/v1/motor y zaino-ia)
//  - Sirve la web de dist/ en la misma dirección
// Uso: deno run -A tests/supabase_simulado.ts [puerto]     (lo arranca solo tests/e2e/supabase_e2e.py)
import { PGlite } from 'npm:@electric-sql/pglite@0.5.16';
import { pgcrypto } from 'npm:@electric-sql/pglite@0.5.16/contrib/pgcrypto';
const PUERTO = Number(Deno.args[0] ?? 54330);
const RAIZ = new URL('..', import.meta.url).pathname;
const SERVICE = 'sb_secret_simulada', ANON = 'sb_publishable_simulada';

/* ---------- base de datos ---------- */
const db = new PGlite({ extensions: { pgcrypto } });
await db.exec(`
  create schema if not exists extensions; create extension if not exists pgcrypto with schema extensions;
  create schema if not exists auth;
  create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
  do $$ begin create role anon nologin; exception when duplicate_object then null; end $$;
  grant usage on schema public to authenticated, anon; grant usage on schema auth to authenticated, anon; grant execute on function auth.uid() to authenticated, anon;`);
for (const f of ['20261111000001_esquema.sql', '20261111000002_biblioteca.sql', '20261111000003_biblioteca_datos.sql']) await db.exec(await Deno.readTextFile(RAIZ + 'supabase/migrations/' + f));
let cola: Promise<unknown> = Promise.resolve();
function como<T>(uid: string | 'admin' | null, fn: () => Promise<T>): Promise<T> { // una petición cada vez (PGlite tiene una sola conexión)
  const p = cola.then(async () => {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${uid && uid !== 'admin' ? uid : ''}', false);` + (uid === 'admin' ? '' : uid ? ' set role authenticated;' : ' set role anon;'));
    try { return await fn(); } finally { await db.exec('reset role;'); }
  });
  cola = p.catch(() => {}); return p;
}

/* ---------- sesiones ---------- */
const b64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
const desb64 = (s: string) => JSON.parse(atob(s.replace(/-/g, '+').replace(/_/g, '/')));
function sesion(uid: string) { const exp = Math.floor(Date.now() / 1000) + 86400;
  const user = { id: uid, aud: 'authenticated', role: 'authenticated', is_anonymous: true, app_metadata: { provider: 'anonymous' }, user_metadata: {}, created_at: new Date().toISOString() };
  return { access_token: b64({ alg: 'HS256', typ: 'JWT' }) + '.' + b64({ sub: uid, role: 'authenticated', aud: 'authenticated', exp, is_anonymous: true }) + '.simulada', token_type: 'bearer', expires_in: 86400, expires_at: exp, refresh_token: 'r-' + uid, user }; }
function quien(req: Request): string | 'admin' | null {
  const k = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (k === SERVICE || req.headers.get('apikey') === SERVICE && !k) return 'admin';
  if (k.split('.').length === 3) { try { return desb64(k.split('.')[1]).sub; } catch { return null; } }
  return null;
}

/* ---------- funciones del servidor, tal cual ---------- */
Deno.env.set('SUPABASE_URL', 'http://127.0.0.1:' + PUERTO);
Deno.env.set('SUPABASE_PUBLISHABLE_KEYS', JSON.stringify({ default: ANON }));
Deno.env.set('SUPABASE_SECRET_KEYS', JSON.stringify({ default: SERVICE }));
const realServe = Deno.serve.bind(Deno); const F: Record<string, (r: Request) => Promise<Response>> = {}; let cargando = '';
(Deno as any).serve = (h: any) => { F[cargando] = h; return { finished: Promise.resolve(), shutdown() {} }; };
cargando = 'motor'; await import('../supabase/functions/motor/index.ts');
cargando = 'zaino-ia'; await import('../supabase/functions/zaino-ia/index.ts');

/* ---------- PostgREST mínimo ---------- */
const PK: Record<string, string[]> = { respuestas: ['viaje_id', 'miembro'], respuestas_privadas: ['viaje_id', 'miembro'], resultados: ['viaje_id'], miembros: ['viaje_id', 'miembro'], gastos: ['id'], lista: ['id'], viajes: ['id'] };
const id = (s: string) => { if (!/^[a-z_][a-z0-9_]*$/.test(s)) throw new Error('identificador'); return '"' + s + '"'; };
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS', 'Access-Control-Expose-Headers': 'content-range' };
const J = (d: unknown, s = 200) => new Response(d === undefined ? null : JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', ...CORS } });
const errPg = (e: any) => J({ code: e.code ?? 'P0001', message: e.message, details: null, hint: null }, e.code === '42501' || /row-level security/.test(e.message) ? 403 : 400);
function filtros(u: URL, desde: number) { const w: string[] = [], v: unknown[] = []; for (const [k, x] of u.searchParams) { if (['select', 'on_conflict', 'columns'].includes(k)) continue; if (!x.startsWith('eq.')) throw new Error('filtro no soportado: ' + x); v.push(x.slice(3)); w.push(id(k) + '::text = $' + (desde + v.length)); } return { w: w.length ? ' where ' + w.join(' and ') : '', v }; }
async function rest(req: Request, u: URL, quienEs: string | 'admin' | null) {
  const partes = u.pathname.replace('/rest/v1/', '').split('/');
  const cuerpo = req.method === 'GET' || req.method === 'DELETE' ? null : await req.json().catch(() => null);
  const objeto = (req.headers.get('Accept') ?? '').includes('vnd.pgrst.object');
  if (partes[0] === 'rpc') {
    const fn = partes[1]; const args = Object.keys(cuerpo ?? {});
    const tipo = await como('admin', () => db.query<{ r: string }>(`select pg_get_function_result(p.oid) r from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname=$1`, [fn]));
    if (!tipo.rows.length) return J({ code: 'PGRST202', message: 'no existe ' + fn }, 404);
    const llamada = `public.${id(fn)}(${args.map((a, i) => id(a) + ' => $' + (i + 1)).join(', ')})`;
    const vals = args.map((a) => cuerpo[a] === null ? null : typeof cuerpo[a] === 'object' ? JSON.stringify(cuerpo[a]) : String(cuerpo[a]));
    try { if (tipo.rows[0].r === 'void') { await como(quienEs, () => db.query(`select ${llamada}`, vals)); return J(null, 200); }
      const r = await como(quienEs, () => db.query<{ r: unknown }>(`select to_jsonb(${llamada}) as r`, vals)); return J(r.rows[0].r); }
    catch (e) { return errPg(e); }
  }
  const t = partes[0]; if (!PK[t] && !t.startsWith('lib_')) return J({ message: 'tabla' }, 404);
  try {
    if (req.method === 'GET') {
      const sel = (u.searchParams.get('select') ?? '*').split(',').map((c) => c.trim()).filter(Boolean);
      const f = filtros(u, 0);
      const r = await como(quienEs, () => db.query(`select ${sel[0] === '*' ? '*' : sel.map(id).join(', ')} from public.${id(t)}${f.w}`, f.v));
      if (objeto) return r.rows.length === 1 ? J(r.rows[0]) : J({ code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned', details: 'The result contains ' + r.rows.length + ' rows', hint: null }, 406);
      return J(r.rows);
    }
    if (req.method === 'POST') {
      const filas = Array.isArray(cuerpo) ? cuerpo : [cuerpo]; const cols = Object.keys(filas[0]);
      const upsert = /merge-duplicates/.test(req.headers.get('Prefer') ?? '');
      const vals: unknown[] = []; const tuplas = filas.map((fl) => '(' + cols.map((c) => { vals.push(fl[c] !== null && typeof fl[c] === 'object' ? JSON.stringify(fl[c]) : fl[c]); return '$' + vals.length; }).join(', ') + ')');
      const sql = `insert into public.${id(t)} (${cols.map(id).join(', ')}) values ${tuplas.join(', ')}` + (upsert ? ` on conflict (${PK[t].map(id).join(', ')}) do update set ${cols.filter((c) => !PK[t].includes(c)).map((c) => id(c) + ' = excluded.' + id(c)).join(', ')}` : '') + ' returning *';
      const r = await como(quienEs, () => db.query(sql, vals));
      if (/return=representation/.test(req.headers.get('Prefer') ?? '')) return objeto ? J(r.rows[0], 201) : J(r.rows, 201);
      return new Response(null, { status: 201, headers: CORS });
    }
    if (req.method === 'PATCH') {
      const cols = Object.keys(cuerpo); const vals = cols.map((c) => cuerpo[c] !== null && typeof cuerpo[c] === 'object' ? JSON.stringify(cuerpo[c]) : cuerpo[c]);
      const f = filtros(u, vals.length);
      await como(quienEs, () => db.query(`update public.${id(t)} set ${cols.map((c, i) => id(c) + ' = $' + (i + 1)).join(', ')}${f.w}`, [...vals, ...f.v]));
      return new Response(null, { status: 204, headers: CORS });
    }
    if (req.method === 'DELETE') { const f = filtros(u, 0); await como(quienEs, () => db.query(`delete from public.${id(t)}${f.w}`, f.v)); return new Response(null, { status: 204, headers: CORS }); }
  } catch (e) { return errPg(e); }
  return J({ message: 'método' }, 405);
}

/* ---------- servidor ---------- */
const TIPOS: Record<string, string> = { html: 'text/html; charset=utf-8', js: 'text/javascript', json: 'application/json', png: 'image/png', svg: 'image/svg+xml', webmanifest: 'application/manifest+json', css: 'text/css' };
realServe({ port: PUERTO, hostname: '127.0.0.1', onListen() { console.log('Supabase simulado en http://127.0.0.1:' + PUERTO); } }, async (req) => {
  const u = new URL(req.url);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (u.pathname.startsWith('/auth/v1/')) {
    if (u.pathname === '/auth/v1/signup') { const uid = crypto.randomUUID(); return J(sesion(uid)); }
    if (u.pathname === '/auth/v1/token') { const b = await req.json(); return J(sesion(String(b.refresh_token).slice(2))); }
    if (u.pathname === '/auth/v1/user') { const q = quien(req); return q && q !== 'admin' ? J(sesion(q).user) : J({ msg: 'invalid JWT' }, 401); }
    if (u.pathname === '/auth/v1/logout') return new Response(null, { status: 204, headers: CORS });
    return J({ msg: 'no' }, 404);
  }
  if (u.pathname.startsWith('/rest/v1/')) return rest(req, u, quien(req));
  if (u.pathname.startsWith('/functions/v1/')) { const f = F[u.pathname.split('/')[3]]; if (!f) return J({ error: 'no' }, 404); const r = await f(req); const h = new Headers(r.headers); h.set('Access-Control-Allow-Origin', '*'); return new Response(r.body, { status: r.status, headers: h }); }
  if (u.pathname === '/__sql') { const b = await req.json(); const r = await como('admin', () => db.query(b.sql, b.params ?? [])); return J(r.rows); } // solo para las pruebas
  if (u.pathname.startsWith('/realtime/')) return new Response('sin tiempo real en el simulador', { status: 503 }); // la app debe caer al sondeo
  const ruta = RAIZ + 'dist' + (u.pathname === '/' ? '/index.html' : decodeURIComponent(u.pathname));
  try { const d = await Deno.readFile(ruta); return new Response(d, { headers: { 'content-type': TIPOS[ruta.split('.').pop()!] ?? 'application/octet-stream' } }); }
  catch { return new Response('no', { status: 404 }); }
});
