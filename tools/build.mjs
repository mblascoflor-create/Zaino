// Construye la web publicable en dist/ y el núcleo compartido de las funciones del servidor.
//   node tools/build.mjs            → dist/ (para Cloudflare Pages / Netlify) + supabase/functions/_shared/*
// No necesita dependencias: solo Node 18+.
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const H = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = f => fs.readFileSync(path.join(H, f), 'utf8');
const OUT = path.join(H, 'dist');
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const VERSION = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

// 1. Núcleo (mismo código en el navegador y en el servidor)
const NUCLEO = ['src/core/data.js', 'src/core/engine.js', 'src/core/compat.js', 'src/core/servidor.js'];
const nucleo = NUCLEO.map(rd).join('\n;\n');
fs.writeFileSync(path.join(H, 'supabase/functions/_shared/zaino-core.mjs'),
  '// GENERADO por tools/build.mjs — no editar a mano (edita src/core/*)\n' + nucleo + '\nexport { ENG, COMPAT, SERVIDOR };\n');
fs.copyFileSync(path.join(H, 'public/biblioteca.json'), path.join(H, 'supabase/functions/_shared/biblioteca.json'));

// 2. Bundle del navegador
const js = [nucleo, rd('src/core/art.js'), rd('src/app/marca.js'), rd('src/app/store.js'), rd('src/app/app.js')].join('\n;\n');
fs.writeFileSync(path.join(OUT, 'app.js'), '/* Zaino ' + VERSION + ' */\n' + js);
execFileSync(process.execPath, ['--check', path.join(OUT, 'app.js')]);

// 3. index.html
let head = rd('src/app/head.html').replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '');
const html = '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
  '<meta name="theme-color" content="#f1f2e9"><meta name="description" content="Cada uno responde desde su móvil y sale el viaje que os encaja a todos.">' +
  '<meta property="og:title" content="Zaino · viajes en grupo"><meta property="og:description" content="Responde unas preguntas desde tu móvil y sale el plan del grupo.">' +
  '<meta property="og:image" content="icons/icon-512.png"><meta name="referrer" content="no-referrer">' +
  '<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icons/favicon.svg" type="image/svg+xml"><link rel="icon" href="icons/favicon-32.png" sizes="32x32"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png">' +
  '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Zaino">' +
  '<style>:root{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;padding:0;background:#f1f2e9;color:#30231F}[hidden]{display:none!important}</style>' +
  head + '</head><body>\n<div id="app" aria-live="polite"></div>\n' +
  '<script src="config.js"></script>\n<script src="vendor/supabase-2.119.0.js"></script>\n<script src="local-db.js"></script>\n' +
  '<script src="app.js?v=' + VERSION + '"></script>\n' +
  '<script>if("serviceWorker" in navigator && location.protocol==="https:") addEventListener("load", function(){ navigator.serviceWorker.register("sw.js").catch(function(){}); });</script>\n' +
  '</body></html>\n';
fs.writeFileSync(path.join(OUT, 'index.html'), html);

// 4. Estáticos
const cp = (a, b) => { fs.mkdirSync(path.dirname(path.join(OUT, b)), { recursive: true }); fs.cpSync(path.join(H, a), path.join(OUT, b), { recursive: true }); };
cp('public/biblioteca.json', 'biblioteca.json');
cp('public/vendor', 'vendor');
cp('public/icons', 'icons');
cp('public/fotos', 'fotos');
cp('src/app/local-db.js', 'local-db.js');
// config.js: si existe public/config.js (el tuyo, con tus claves públicas) se usa; si no, la plantilla vacía (modo prueba)
cp(fs.existsSync(path.join(H, 'public/config.js')) ? 'public/config.js' : (process.env.ZAINO_PROD || process.env.WORKERS_CI || process.env.CF_PAGES) ? 'config.produccion.js' : 'config.ejemplo.js', 'config.js');
fs.writeFileSync(path.join(OUT, 'sw.js'), rd('src/app/sw.js').replace('__VERSION__', VERSION));
fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), JSON.stringify({
  name: 'Zaino · viajes en grupo', short_name: 'Zaino', start_url: './', scope: './', display: 'standalone',
  background_color: '#f1f2e9', theme_color: '#164836', lang: 'es', description: 'Planes de viaje en grupo: cada uno responde desde su móvil y sale el plan.',
  icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }]
}, null, 1));
// Cabeceras de seguridad (Cloudflare Pages y Netlify leen _headers)
fs.writeFileSync(path.join(OUT, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self'
/sw.js
  Cache-Control: no-cache
/config.js
  Cache-Control: no-cache
`);
// 5. Versión de prueba para publicar como artefacto de Claude (sin servidor propio): una sola página + biblioteca.json
const OUTA = path.join(H, 'dist-artefacto'); fs.rmSync(OUTA, { recursive: true, force: true }); fs.mkdirSync(OUTA);
fs.writeFileSync(path.join(OUTA, 'index.html'), rd('src/app/head.html').replace('<title>Zaino</title>', '<title>Zaino beta</title>') + '\n<div id="app" aria-live="polite"></div>\n' +
  '<script>window.ZAINO_CONFIG = {urlPublica: ' + JSON.stringify(process.env.ZAINO_URL_ARTEFACTO || '') + '};</script>\n<script>\n' + js + '\n</script>\n');
fs.copyFileSync(path.join(H, 'public/biblioteca.json'), path.join(OUTA, 'biblioteca.json'));
fs.cpSync(path.join(H, 'public/fotos'), path.join(OUTA, 'fotos'), {recursive:true});
const kb = f => Math.round(fs.statSync(path.join(OUT, f)).size / 1024);
console.log('OK dist/ v' + VERSION + ' · app.js ' + kb('app.js') + ' KB · biblioteca ' + kb('biblioteca.json') + ' KB · núcleo del servidor regenerado');

// 6. Para hacerlo todo desde el navegador (sin terminal): funciones en un solo archivo y SQL en uno
const OUTF = path.join(H, 'dist-funciones'); fs.mkdirSync(OUTF, { recursive: true });
let hayEsbuild = true; try { await import('esbuild'); } catch { hayEsbuild = false; }
if (hayEsbuild) { await import('./funciones.mjs'); } else console.log('· dist-funciones/ no se ha regenerado (falta esbuild: npm install)');
const migs = fs.readdirSync(path.join(H, 'supabase/migrations')).filter((f) => f.endsWith('.sql')).sort();
fs.writeFileSync(path.join(OUTF, 'base-de-datos-todo-en-uno.sql'), migs.map((f) => '-- ===== ' + f + ' =====\n' + rd('supabase/migrations/' + f)).join('\n\n'));
// 7. La web lleva también los archivos de instalación (código abierto, sin secretos) para poder montar el servidor desde el navegador
if (hayEsbuild) {
  fs.mkdirSync(path.join(OUT, 'setup'), { recursive: true });
  // solo lo que necesita la función ligera (Cloudflare no acepta archivos .ts en una subida de archivos estáticos)
  fs.copyFileSync(path.join(OUTF, 'zaino-core.js'), path.join(OUT, 'setup', 'zaino-core.js'));
  fs.copyFileSync(path.join(H, 'supabase/migrations/20261111000001_esquema.sql'), path.join(OUT, 'setup', 'esquema.sql'));
  fs.appendFileSync(path.join(OUT, '_headers'), '/setup/*\n  Access-Control-Allow-Origin: *\n  Cache-Control: no-cache\n/biblioteca.json\n  Access-Control-Allow-Origin: *\n');
  // app.js más ligero
  const { transformSync } = await import('esbuild');
  fs.writeFileSync(path.join(OUT, 'app.js'), transformSync(fs.readFileSync(path.join(OUT, 'app.js'), 'utf8'), { minify: true, legalComments: 'none' }).code);
}
