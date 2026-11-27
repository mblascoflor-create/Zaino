// Prueba real del esquema y las reglas RLS con PostgreSQL (PGlite, Postgres compilado a WASM).
// Simula a Supabase: esquema auth con auth.uid() y el rol "authenticated".
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import fs from 'node:fs';
const db = new PGlite({ extensions: { pgcrypto } });
const ok = (c, m) => { if (!c) { console.error('✗', m); process.exitCode = 1; } else console.log('✓', m); };
await db.exec(`
  -- como en Supabase: pgcrypto vive en el esquema «extensions», no en public
  create schema if not exists extensions; create extension if not exists pgcrypto with schema extensions;
  create schema if not exists auth;
  -- como en Supabase: permisos por defecto que dan EXECUTE y tablas a anon/authenticated
  do $$ begin create role anon nologin; exception when duplicate_object then null; end $$;
  do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
  alter default privileges in schema public grant execute on functions to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
  grant usage on schema public to authenticated; grant usage on schema auth to authenticated;
  grant execute on function auth.uid() to authenticated;
`);
await db.exec(fs.readFileSync(new URL('../supabase/migrations/20261111000001_esquema.sql', import.meta.url), 'utf8'));
const U = { ana: '11111111-1111-1111-1111-111111111111', pol: '22222222-2222-2222-2222-222222222222', intruso: '33333333-3333-3333-3333-333333333333' };
async function como(u, sql, params) {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${u||''}', false); set role authenticated;`);
  try { return await db.query(sql, params); } finally { await db.exec('reset role;'); }
}
async function falla(u, sql, params) { try { await como(u, sql, params); return null; } catch (e) { return e.message; } }

// 1. Ana crea el viaje con dos plazas (Ana organiza, Pol)
const r = (await como(U.ana, `select public.crear_viaje($1::jsonb) as r`, [JSON.stringify({ titulo: 'Verano', jefe: 'm1', integrantes: [{ id: 'm1', nombre: 'Ana' }, { id: 'm2', nombre: 'Pol' }] })])).rows[0].r;
ok(/^[A-Z0-9]{6}$/.test(r.code) && r.token.length === 36, 'crear_viaje devuelve código y token largo');
ok((await como(U.ana, 'select count(*)::int n from viajes')).rows[0].n === 1, 'la organizadora ve su viaje');
ok((await como(U.intruso, 'select count(*)::int n from viajes')).rows[0].n === 0, 'alguien de fuera no ve ningún viaje (ni sabiendo el código)');
// 2. Previa de invitación sin ser miembro: solo nombres
const pv = (await como(U.pol, `select public.previa_invitacion($1) as p`, [r.token])).rows[0].p;
ok(pv && pv.integrantes.length === 2 && pv.integrantes[0].ocupado === true && pv.integrantes[1].ocupado === false && !pv.ya_dentro, 'la invitación enseña solo nombres y plazas libres');
ok((await como(U.pol, `select public.previa_invitacion('token-falso') as p`)).rows[0].p === null, 'un token falso no enseña nada');
// 3. Pol ocupa su plaza
const j = (await como(U.pol, `select public.unirse_viaje($1, 'm2', null) as j`, [r.token])).rows[0].j;
ok(j.miembro === 'm2', 'Pol se une ocupando su nombre');
ok(/plaza_ocupada/.test(await falla(U.intruso, `select public.unirse_viaje($1, 'm2', null)`, [r.token]) || ''), 'nadie puede quitarle la plaza a Pol');
const v = (await como(U.pol, 'select id from viajes')).rows[0].id;
ok(/permission denied/.test(await falla(U.pol, `select public.servidor_parchear($1, '{"eleccion":{"zona":"roma"}}')`, [v]) || ''), 'nadie del grupo puede usar la función interna del servidor (aunque Supabase dé permisos por defecto)');
ok(/permission denied/.test(await falla(U.pol, `select public.ia_contar($1, 999)`, [v]) || ''), 'ni el contador del asistente');
// 4. Respuestas públicas y privadas
await como(U.pol, `insert into respuestas(viaje_id, miembro, data) values ($1, 'm2', '{"noche":"fiesta"}')`, [v]);
await como(U.pol, `insert into respuestas_privadas(viaje_id, miembro, user_id, data) values ($1, 'm2', $2, '{"presMax":300}')`, [v, U.pol]);
ok(/row-level security|violates/.test(await falla(U.pol, `insert into respuestas(viaje_id, miembro, data) values ($1, 'm1', '{}')`, [v]) || ''), 'Pol no puede escribir las respuestas de Ana');
ok((await como(U.ana, 'select count(*)::int n from respuestas')).rows[0].n === 1, 'Ana ve las respuestas públicas de Pol');
ok((await como(U.ana, 'select count(*)::int n from respuestas_privadas')).rows[0].n === 0, 'Ana NO ve el presupuesto máximo de Pol');
ok((await como(U.pol, 'select count(*)::int n from respuestas_privadas')).rows[0].n === 1, 'Pol sí ve su parte privada');
// Una respuesta de la versión anterior conserva su disponibilidad al migrar.
await como(U.pol, `update respuestas set data=data || '{"meses":[7],"dias":5}'::jsonb where viaje_id=$1 and miembro='m2'`, [v]);
await db.exec(fs.readFileSync(new URL('../supabase/migrations/20261122000001_fechas_privadas.sql', import.meta.url), 'utf8'));
const pubPol = (await como(U.ana, "select data from respuestas where miembro='m2'")).rows[0].data;
const privPol = (await como(U.pol, "select data from respuestas_privadas where miembro='m2'")).rows[0].data;
ok(!('meses' in pubPol) && !('dias' in pubPol) && privPol.meses[0]===7 && privPol.dias===5 && privPol.presMax===300, 'la migración privatiza las fechas y conserva el presupuesto');
ok(/respuestas_fechas_privadas/.test(await falla(U.pol, `update respuestas set data='{"meses":[8]}' where viaje_id=$1 and miembro='m2'`, [v]) || ''), 'el servidor rechaza nuevas fechas públicas de clientes antiguos');
// 5. Parches con mezcla profunda y permisos
await como(U.pol, `select public.parchear_viaje($1, '{"reservas":{"vuelo-BCN":{"estado":"confirmada"}}}')`, [r.code]);
await como(U.ana, `select public.parchear_viaje($1, '{"reservas":{"aloj-1":{"estado":"mirando"}}}')`, [r.code]);
const d = (await como(U.ana, 'select data from viajes')).rows[0].data;
ok(d.reservas['vuelo-BCN'].estado === 'confirmada' && d.reservas['aloj-1'].estado === 'mirando', 'dos personas cambian reservas a la vez sin pisarse');
ok(/solo_organizador/.test(await falla(U.pol, `select public.parchear_viaje($1, '{"titulo":"Hack"}')`, [r.code]) || ''), 'un participante no puede cambiar el título ni los integrantes');
ok(/sin_permiso/.test(await falla(U.intruso, `select public.parchear_viaje($1, '{"reservas":{}}')`, [r.code]) || ''), 'alguien de fuera no puede tocar el viaje con el código');
await como(U.ana, `select public.parchear_viaje($1, '{"reservas":{"aloj-1":{"__delete__":true}}}')`, [r.code]);
ok(!(await como(U.ana, 'select data from viajes')).rows[0].data.reservas['aloj-1'], 'se pueden borrar claves con __delete__');
// 6. Gastos y lista
await como(U.pol, `insert into gastos(viaje_id, data) values ($1, '{"concepto":"Cena","importe":30}')`, [v]);
ok((await como(U.ana, 'select count(*)::int n from gastos')).rows[0].n === 1 && (await como(U.intruso, 'select count(*)::int n from gastos')).rows[0].n === 0, 'gastos: los ve el grupo, no los de fuera');
ok(/row-level security|violates/.test(await falla(U.intruso, `insert into lista(viaje_id, data) values ($1, '{}')`, [v]) || ''), 'lista: alguien de fuera no puede añadir');
// 7. Alta tardía con nombre nuevo
const tarde = '44444444-4444-4444-4444-444444444444';
const jt = (await como(tarde, `select public.unirse_viaje($1, null, 'Leo') as j`, [r.token])).rows[0].j;
ok(jt.miembro === 'm3' && (await como(U.ana, 'select data from viajes')).rows[0].data.integrantes.length === 3, 'alguien que llega tarde se apunta con su nombre (m3)');
// 8. Resultados: solo lectura para el grupo
ok(/permission denied|row-level/.test(await falla(U.ana, `insert into resultados(viaje_id, data) values ($1, '{}')`, [v]) || ''), 'nadie del grupo puede escribir los resultados a mano (solo el servidor)');
// 9. Regenerar invitación invalida la anterior
const nt = (await como(U.ana, `select public.regenerar_invitacion($1) as t`, [r.code])).rows[0].t;
ok((await como(U.intruso, `select public.previa_invitacion($1) as p`, [r.token])).rows[0].p === null && (await como(U.intruso, `select public.previa_invitacion($1) as p`, [nt])).rows[0].p !== null, 'regenerar el enlace deja inservible el antiguo');
ok(/sin_permiso/.test(await falla(U.pol, `select public.regenerar_invitacion($1)`, [r.code]) || ''), 'solo la organizadora regenera el enlace');
// 10. Salir y quitar
await como(tarde, `select public.salir_viaje($1)`, [r.code]);
ok((await como(tarde, 'select count(*)::int n from viajes')).rows[0].n === 0, 'quien sale del viaje deja de verlo');
await como(U.ana, `select public.quitar_integrante($1, 'm2')`, [r.code]);
ok((await como(U.ana, 'select count(*)::int n from respuestas')).rows[0].n === 0 && (await como(U.pol, 'select count(*)::int n from viajes')).rows[0].n === 0, 'al quitar a Pol se borran sus respuestas y pierde el acceso');
// 11. RGPD
await como(U.ana, `select public.borrar_mis_datos()`);
ok((await db.query('select count(*)::int n from viajes')).rows[0].n === 0, 'borrar mis datos elimina el viaje que organizaba con todo lo suyo');
