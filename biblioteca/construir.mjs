// Construye la biblioteca única (public/biblioteca.json) a partir de biblioteca/zonas, geo y costes,
// revisa la calidad de los datos y genera la semilla SQL para Supabase.
import fs from 'node:fs'; import path from 'node:path';
const H = path.dirname(new URL(import.meta.url).pathname);
const leer = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const zonas = {}; for (const f of fs.readdirSync(path.join(H, 'zonas')).filter(f => f.endsWith('.json'))) zonas[f.replace('.json', '')] = leer(path.join(H, 'zonas', f));
const salida = path.join(H, '..', 'public', 'biblioteca.json');
const ordenPrevia = fs.existsSync(salida) ? leer(salida).zonas.map(z => z.id) : [];
const orden = [...new Set([...ordenPrevia, ...Object.keys(zonas)])];
const toursComprobados = new Set(leer(path.join(H, 'investigacion', 'tours-comprobados.json')));
const informe = { avisos: [], arreglos: [] };
// Fichas extra: planes nuevos y paradas concretas dentro de cada plan (biblioteca/extra/d*.mjs)
const extra = {};
for (const f of fs.readdirSync(path.join(H, 'extra')).filter(f => /^d\d+\.mjs$/.test(f)).sort()) Object.assign(extra, (await import(path.join(H, 'extra', f))).default);
const { Q: QX } = await import(path.join(H, 'extra', '_consultas.mjs'));
const { ICONOS, AJUSTES } = await import(path.join(H, 'extra', '_iconos.mjs'));
const gmaps = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const sinPar = t => String(t).replace(/\s*\([^)]*\)/g, '').trim();
const lugar1 = d => String(d).split(/\s*[\/,(]|\s+y\s+/)[0].trim();
const TIPOS = new Set(['cultura','gastronomia','naturaleza','playa','fiesta','aventura','bienestar','compras','postal','agua','musica']);
const BBOX = { IT: [35.4, 47.2, 6.5, 18.6] };
const out = [];
for (const id of orden) {
  const z = zonas[id]; if (!z) { informe.avisos.push(`zona ${id} sin archivo v2`); continue; }
  z.pais = z.pais || 'IT';
  const g = fs.existsSync(path.join(H, 'geo', id + '.json')) ? leer(path.join(H, 'geo', id + '.json')) : {};
  const baseIds = new Set(z.bases.map(b => b.id));
  const vistos = new Set();
  z.actividades = z.actividades.filter(a => {
    if (vistos.has(a.id)) { informe.arreglos.push(`${id}: actividad duplicada ${a.id} eliminada`); return false; }
    vistos.add(a.id); return true;
  });
  const X = extra[id] || {};
  const ficha = path.join(H, 'investigacion', id + '.mjs');
  const investigacion = fs.existsSync(ficha) ? await import(ficha) : {};
  const fuentes = ids => [...new Set((ids || []).map(n => investigacion.F?.[n]).filter(u => /^https:\/\//.test(u)))];
  for (const [n, investigado] of [...(X.nuevas || []).map(n => [n, false]), ...(investigacion.nuevas || []).map(n => [n, true])]) {
    if (vistos.has(n.id)) { informe.avisos.push(`${id}: extra ${n.id} repite id; no se añade`); continue; }
    vistos.add(n.id);
    const q = n.q || (QX[n.id] ? QX[n.id] + (/ital|,/i.test(QX[n.id]) ? '' : ', Italia') : null) || (n.paradas.length ? sinPar(n.paradas[0][0]) + ', ' + lugar1(n.donde) + ', Italia' : sinPar(n.nombre.split(':')[0]) + ', ' + lugar1(n.donde) + ', Italia');
    const { q: _q, ...resto } = n;
    if (!n.q && !QX[n.id] && !n.paradas.length) informe.avisos.push(`${id}/${n.id}: sin consulta de mapa propia → ${q}`);
    z.actividades.push({ ...resto, enlace: gmaps(q), enlace_tipo: 'mapa', maps: gmaps(q), fuente: fuentes(investigacion.fuentesAct?.[n.id])[0] || null, calidad: 'orientativo', extra: !investigado });
  }
  for (const [aid, ll] of Object.entries(X.geo || {})) { const a0 = z.actividades.find(x => x.id === aid); if (a0) a0.geo = ll; else informe.avisos.push(`${id}: geo extra para ${aid}, que no existe`); }
  for (const [aid, ps] of Object.entries(X.paradas || {})) { const a0 = z.actividades.find(x => x.id === aid); if (a0) a0.paradas = ps; else informe.avisos.push(`${id}: paradas para ${aid}, que no existe`); }
  for (const [aid, cambio] of Object.entries((AJUSTES || {})[id] || {})) { const a0 = z.actividades.find(x => x.id === aid); if (a0) Object.assign(a0, cambio); else informe.avisos.push(`${id}: ajuste para ${aid}, que no existe`); }
  for (const ic of ICONOS[id] || []) { const a0 = z.actividades.find(x => x.id === ic); if (a0) a0.icono = true; else informe.avisos.push(`${id}: icono ${ic} no existe`); }
  const ids = new Set(z.actividades.map(a => a.id));
  z.recorridos = (investigacion.rutas || []).map(([nombre, refs]) => ({nombre, refs: refs.filter(ref => ids.has(ref))})).filter(r => r.refs.length > 1);
  z.sitios = (investigacion.sitios || []).filter(([, nombre, , direccion]) => nombre && direccion).map(([lugar, nombre, tipo, direccion, pedir, refs]) => ({
    lugar, nombre, tipo, direccion, pedir, fuentes: fuentes(refs), maps: gmaps([nombre, direccion, lugar, 'Italia'].join(', ')),
  })).filter(s => s.fuentes.length);
  for (const a of z.actividades) {
    if(investigacion.ajustes?.[a.id]) Object.assign(a, investigacion.ajustes[a.id]);
    a.fuentes_guia = fuentes(investigacion.fuentesAct?.[a.id]);
    if (a.fuentes_guia.length && investigacion.consejos?.[a.id]) a.consejo_guia = investigacion.consejos[a.id];
    a.tours = (investigacion.enlaces?.[a.id] || []).filter(([, , url]) => toursComprobados.has(url));
    if (a.paradas && a.paradas.length) a.paradas = a.paradas.map(p => Array.isArray(p) ? { nombre: p[0], geo: [p[1], p[2]], nota: p[3] || '', maps: gmaps(sinPar(p[0]) + ', ' + lugar1(a.donde) + ', Italia') } : p).filter(p => { const b = BBOX[z.pais]; const ok = p.geo[0] > b[0] && p.geo[0] < b[1] && p.geo[1] > b[2] && p.geo[1] < b[3]; if (!ok) informe.avisos.push(`${id}/${a.id}: parada fuera del país ${p.nombre}`); return ok; });
    else delete a.paradas;
    if (a.fuentes_guia.length && !a.fuente) a.fuente = a.fuentes_guia[0];
    if (!a.geo && g.actividades && g.actividades[a.id]) a.geo = g.actividades[a.id];
    if (!TIPOS.has(a.tipo)) { informe.avisos.push(`${id}/${a.id}: tipo raro ${a.tipo}`); }
    if (!baseIds.has(a.base)) { informe.arreglos.push(`${id}/${a.id}: base ${a.base} no existe → ${z.bases[0].id}`); a.base = z.bases[0].id; }
    if (a.geo) { const [la, lo] = a.geo, b = BBOX[z.pais]; if (!(la > b[0] && la < b[1] && lo > b[2] && lo < b[3])) { informe.avisos.push(`${id}/${a.id}: coordenadas fuera del país ${a.geo}`); delete a.geo; } }
    else informe.avisos.push(`${id}/${a.id}: sin coordenadas`);
    if (a.meses && (!Array.isArray(a.meses) || !a.meses.every(m => m >= 1 && m <= 12))) { informe.arreglos.push(`${id}/${a.id}: meses inválidos quitados`); delete a.meses; }
    if (a.meses && a.meses.length === 12) delete a.meses;
    if (!/^https:\/\//.test(a.enlace || '')) informe.avisos.push(`${id}/${a.id}: sin enlace https`);
    a.precio = a.precio || { calidad: 'desconocido' }; // precio en euros: aún no hay datos verificados por actividad
  }
  for (const n of z.noche || []) { const gg = g.noche && g.noche[n.zona]; if (!n.geo && gg) n.geo = gg; }
  for (const e of z.eventos || []) { const gg = g.eventos && g.eventos[e.nombre]; if (!e.geo && gg) e.geo = gg; if (!e.proxima_fecha) e.proxima_fecha = null; }
  const cf = path.join(H, 'costes', id + '.json');
  z.costes = fs.existsSync(cf) ? leer(cf) : null;
  if (!z.costes) informe.avisos.push(`${id}: sin costes orientativos`);
  out.push(z);
}
const lib = { version: 'v18', generado: new Date().toISOString().slice(0, 10), paises: ['IT'],
  nota: 'Biblioteca de Zaino. Cada dato lleva su calidad: verificado (fuente oficial), orientativo (fuente pública, cambia), desconocido. Los precios son orientativos y sin vuelos.',
  zonas: out };
fs.mkdirSync(path.join(H, '..', 'public'), { recursive: true });
fs.writeFileSync(path.join(H, '..', 'public', 'biblioteca.json'), JSON.stringify(lib));
fs.writeFileSync(path.join(H, 'informe-calidad.json'), JSON.stringify(informe, null, 1));
// ---------- semilla SQL ----------
const q = v => v === null || v === undefined ? 'null' : (typeof v === 'number' ? String(v) : (typeof v === 'boolean' ? String(v) : `'${String(v).replace(/'/g, "''")}'`));
const j = v => v === null || v === undefined ? 'null' : `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
const arr = v => Array.isArray(v) && v.length ? `array[${v.map(Number).join(',')}]::int[]` : 'null';
const tarr = v => Array.isArray(v) && v.length ? `array[${v.map(q).join(',')}]::text[]` : 'null';
let sql = `-- Semilla de la biblioteca (generada por biblioteca/construir.mjs, versión ${lib.version}). Se puede volver a ejecutar.\nbegin;\ndelete from public.lib_eventos; delete from public.lib_alojamiento; delete from public.lib_noche; delete from public.lib_comida; delete from public.lib_actividades; delete from public.lib_bases; delete from public.lib_destinos;\n`;
for (const z of out) {
  sql += `insert into public.lib_destinos(id,pais,nombre,nombre_corto,lema,perfil,nivel_precio,meses,calor_verano,nieve_invierno,coche,llegar,moverse,notas_honestas,costes) values (${q(z.id)},${q(z.pais)},${q(z.nombre)},${q(z.nombre_corto)},${q(z.lema)},${j(z.perfil)},${q(z.nivel_precio)},${j(z.meses)},${q(z.calor_verano)},${q(!!z.nieve_invierno)},${j(z.coche)},${j(z.llegar)},${j(z.moverse)},${j(z.notas_honestas)},${j(z.costes)});\n`;
  for (const b of z.bases) sql += `insert into public.lib_bases(destino_id,id,nombre,por_que,ambiente,sin_coche) values (${q(z.id)},${q(b.id)},${q(b.nombre)},${q(b.por_que)},${q(b.ambiente)},${q(!!b.sin_coche)});\n`;
  for (const a of z.actividades) sql += `insert into public.lib_actividades(destino_id,id,base_id,nombre,donde,tipo,tipos_extra,duracion,momento,coste,requiere_coche,requiere_reserva,esfuerzo,ambiente,meses,descripcion,consejo,enlace,enlace_tipo,maps,fuente,lat,lon) values (${q(z.id)},${q(a.id)},${q(a.base)},${q(a.nombre)},${q(a.donde)},${q(a.tipo)},${tarr(a.tipos_extra)},${q(a.duracion)},${q(a.momento)},${q(a.coste)},${q(!!a.requiere_coche)},${q(!!a.requiere_reserva)},${q(a.esfuerzo)},${q(a.ambiente)},${arr(a.meses)},${q(a.descripcion)},${q(a.consejo)},${q(a.enlace)},${q(a.enlace_tipo)},${q(a.maps)},${q(a.fuente)},${a.geo ? a.geo[0] : 'null'},${a.geo ? a.geo[1] : 'null'});\n`;
  for (const c of z.comida || []) sql += `insert into public.lib_comida(destino_id,plato,que_es,estilo,coste,donde,maps) values (${q(z.id)},${q(c.plato)},${q(c.que_es)},${q(c.estilo)},${q(c.coste)},${q(c.donde_probarlo || c.donde)},${q(c.maps)});\n`;
  for (const n of z.noche || []) sql += `insert into public.lib_noche(destino_id,base_id,zona,plan,descripcion,maps,lat,lon) values (${q(z.id)},${q(n.base)},${q(n.zona)},${q(n.plan)},${q(n.descripcion)},${q(n.maps)},${n.geo ? n.geo[0] : 'null'},${n.geo ? n.geo[1] : 'null'});\n`;
  for (const a of z.alojamiento || []) sql += `insert into public.lib_alojamiento(destino_id,base_id,tipo,coste,para,enlaces) values (${q(z.id)},${q(a.base)},${q(a.tipo)},${q(a.coste)},${q(a.para)},${j(a.enlaces || (a.enlace ? [{ sitio: 'Enlace', url: a.enlace }] : []))});\n`;
  for (const e of z.eventos || []) sql += `insert into public.lib_eventos(destino_id,nombre,donde,cuando,meses,proxima_fecha,enlace,descripcion) values (${q(z.id)},${q(e.nombre)},${q(e.donde)},${q(e.cuando)},${arr(e.meses)},${q(e.proxima_fecha)},${q(e.enlace || e.fuente)},${q(e.descripcion)});\n`;
}
sql += 'commit;\n';
fs.writeFileSync(path.join(H, '..', 'supabase', 'migrations', '20261111000003_biblioteca_datos.sql'), sql);
const nAct = out.reduce((s, z) => s + z.actividades.length, 0);
console.log(`biblioteca ${lib.version}: ${out.length} zonas, ${nAct} actividades · arreglos ${informe.arreglos.length} · avisos ${informe.avisos.length}`);
console.log(informe.arreglos.slice(0, 10).join('\n')); console.log(informe.avisos.slice(0, 15).join('\n'));
