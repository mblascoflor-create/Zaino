import { PGlite } from '@electric-sql/pglite'; import fs from 'node:fs';
const db = new PGlite();
await db.exec(`do $$ begin create role anon nologin; create role authenticated nologin; exception when duplicate_object then null; end $$; grant usage on schema public to anon, authenticated;`);
for (const f of ['20261111000002_biblioteca.sql','20261111000003_biblioteca_datos.sql']) await db.exec(fs.readFileSync(new URL('../supabase/migrations/'+f, import.meta.url),'utf8'));
const n = async t => (await db.query(`select count(*)::int n from ${t}`)).rows[0].n;
console.log('destinos', await n('lib_destinos'), 'actividades', await n('lib_actividades'), 'comida', await n('lib_comida'), 'eventos', await n('lib_eventos'));
await db.exec('set role anon');
const r = await db.query(`select destino_id, nombre from lib_actividades where tipo='playa' and (meses is null or 1 = any(meses)) and lat is not null limit 3`);
console.log('anon puede consultar:', r.rows.length>0);
try { await db.exec(`insert into lib_destinos(id,nombre) values ('x','x')`); console.log('✗ anon pudo escribir'); process.exitCode=1; } catch(e){ console.log('✓ anon no puede escribir en la biblioteca'); }
