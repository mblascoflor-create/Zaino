/* Zaino: guarda la app para abrirla sin cobertura. La versión la pone tools/build.mjs. */
var VERSION = 'zaino-__VERSION__';
var BASE = ['./', 'index.html', 'app.js?v='+VERSION.slice('zaino-'.length), 'config.js', 'vendor/supabase-2.119.0.js', 'local-db.js', 'biblioteca.json', 'manifest.webmanifest', 'icons/icon-192.png'];
self.addEventListener('install', function(e){ e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(BASE); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==VERSION && k.startsWith('zaino-'); }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch', function(e){
  var u = new URL(e.request.url);
  if(e.request.method!=='GET') return;
  if(u.origin!==location.origin && !/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)) return; // Supabase va siempre directo a la red
  // red primero (para ver siempre lo último), caché si no hay cobertura
  e.respondWith(fetch(e.request).then(function(r){ if(r && r.ok){ var cp=r.clone(); caches.open(VERSION).then(function(c){ c.put(e.request, cp); }); } return r; })
    .catch(function(){ return caches.match(e.request).then(function(m){ return m || (e.request.mode==='navigate' ? caches.match('index.html') : Response.error()); }); }));
});
