// Asistente de despliegue: `npm run desplegar`
// Te pregunta los datos de tu proyecto de Supabase, prepara la web y sube la base de datos y las funciones.
// Puedes repetirlo cuando quieras: no borra nada.
import fs from 'node:fs'; import path from 'node:path'; import readline from 'node:readline';
import { spawnSync } from 'node:child_process';
const H = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const cola = [], esperando = []; rl.on('line', (l) => esperando.length ? esperando.shift()(l) : cola.push(l)); rl.on('close', () => { while (esperando.length) esperando.shift()(''); });
rl.question = (q) => { process.stdout.write(q); return cola.length ? Promise.resolve(cola.shift()) : new Promise((ok) => esperando.push(ok)); };
const paso = (n, t) => console.log('\n\x1b[1m' + n + '. ' + t + '\x1b[0m');
const corre = (cmd) => { console.log('\x1b[2m$ ' + cmd + '\x1b[0m'); return spawnSync(cmd, { stdio: 'inherit', shell: true, cwd: H }).status === 0; };
const para = (msg) => { console.log('\n\x1b[31m' + msg + '\x1b[0m\nNo pasa nada: arregla eso y vuelve a ejecutar `npm run desplegar`.'); rl.close(); process.exit(1); };

console.log('\nZaino · asistente de despliegue\nAntes de empezar necesitas tener creado el proyecto en supabase.com (docs/DESPLIEGUE.md, paso 1.1).');

paso(1, 'Datos de tu proyecto (Supabase → Project Settings → API)');
const prev = fs.existsSync(path.join(H, 'public/config.js')) ? fs.readFileSync(path.join(H, 'public/config.js'), 'utf8') : '';
const de = (k) => (prev.match(new RegExp(k + ":\\s*'([^']*)'")) || [])[1] || '';
let url = (await rl.question('Project URL' + (de('supabaseUrl') ? ' [' + de('supabaseUrl') + ']' : '') + ': ')).trim() || de('supabaseUrl');
url = url.replace(/\/+$/, '');
const m = url.match(/^https:\/\/([a-z0-9]{20})\.supabase\.co$/);
if (!m) para('Esa URL no tiene la forma https://xxxxxxxxxxxxxxxxxxxx.supabase.co');
const ref = m[1];
const anon = (await rl.question('Clave anon / publishable' + (de('supabaseAnonKey') ? ' [la de antes]' : '') + ': ')).trim() || de('supabaseAnonKey');
if (!/^(eyJ[\w-]+\.[\w-]+\.[\w-]+|sb_publishable_[\w-]+)$/.test(anon)) para('Esa clave no parece la anon/publishable (empieza por eyJ… o por sb_publishable_…).');
if (/service_role|sb_secret_/.test(anon) || (anon.startsWith('eyJ') && /service_role/.test(Buffer.from(anon.split('.')[1], 'base64').toString()))) para('¡Cuidado! Esa es la clave secreta (service_role). Esa NUNCA va en la web. Copia la anon/publishable.');
const pub = (await rl.question('Dirección final de la web, si ya la sabes (Enter para saltar)' + (de('urlPublica') ? ' [' + de('urlPublica') + ']' : '') + ': ')).trim() || de('urlPublica');
const ia = /ia:\s*true/.test(prev) ? 'true' : 'false';
fs.writeFileSync(path.join(H, 'public/config.js'), `/* Generado por npm run desplegar. Estos datos son públicos: la seguridad la ponen las reglas de la base de datos. */
window.ZAINO_CONFIG = {
  supabaseUrl: '${url}',
  supabaseAnonKey: '${anon}',
  ia: ${ia},
  urlPublica: '${pub}',
  afiliados: {}   // códigos de afiliado: ver config.ejemplo.js
};
`);
console.log('✓ Guardado public/config.js');

paso(2, 'Preparar la web');
if (!corre('node tools/build.mjs')) para('Falló la preparación de la web.');

paso(3, 'Entrar en tu cuenta de Supabase (se abre el navegador)');
if (!corre('npx --yes supabase login')) para('No se pudo entrar en Supabase.');
if (!corre('npx --yes supabase link --project-ref ' + ref)) para('No se pudo enlazar el proyecto. Si te pide la contraseña de la base de datos, es la que pusiste al crear el proyecto.');

paso(4, 'Crear las tablas y cargar los destinos');
const r4 = (await rl.question('¿Ya pegaste todos los archivos SQL a mano en el SQL Editor? (s/N): ')).trim().toLowerCase();
if (r4 !== 's') { if (!corre('npx --yes supabase db push')) para('No se pudieron crear las tablas. Alternativa: pega a mano todos los archivos de supabase/migrations en el SQL Editor (docs/DESPLIEGUE.md, paso 1.2).'); }

paso(5, 'Subir las funciones del servidor');
if (!corre('npx --yes supabase functions deploy motor')) para('No se pudo subir la función motor.');
if (!corre('npx --yes supabase functions deploy zaino-ia')) para('No se pudo subir la función zaino-ia.');
if (pub) corre('npx --yes supabase secrets set ZAINO_ORIGEN=' + new URL(pub).origin);

rl.close();
console.log(`
\x1b[32m✓ Servidor listo.\x1b[0m

Te quedan dos cosas a mano:
  1) Supabase → Authentication → (Sign In / Providers) → activa «Allow anonymous sign-ins».
  2) Sube la carpeta  dist  a Cloudflare Pages o Netlify (docs/DESPLIEGUE.md, paso 3).
${pub ? '' : '\nCuando sepas la dirección final, vuelve a ejecutar `npm run desplegar` y ponla: así solo tu web puede usar el servidor.\n'}`);
