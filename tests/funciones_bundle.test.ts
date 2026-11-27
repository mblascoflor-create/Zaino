// Prueba de las funciones del servidor (motor y zaino-ia) tal cual se despliegan, en Deno,
// contra un Supabase simulado (auth + PostgREST mínimos con las mismas reglas de acceso).
// Uso: deno run -A tests/funciones.test.ts
const realServe = Deno.serve.bind(Deno);
const realFetch = globalThis.fetch.bind(globalThis);
let fallos = 0; const ok = (c: unknown, m: string, x = '') => { console.log((c ? '✓ ' : '✗ ') + m + (x ? '  · ' + x : '')); if (!c) fallos++; };

/* ---------- Supabase simulado ---------- */
const U: Record<string, string> = { 'tok-ana': 'aaaaaaaa-0000-0000-0000-000000000001', 'tok-pol': 'aaaaaaaa-0000-0000-0000-000000000002', 'tok-intruso': 'aaaaaaaa-0000-0000-0000-000000000003' };
const SERVICE = 'service-secreta', ANON = 'anon-publica';
const VID = 'v-1';
const DB: Record<string, any[]> = {
  viajes: [{ id: VID, code: 'ABC234', data: { titulo: 'Prueba', jefe: 'm1', dias: 4, fechas: { modo: 'mes', mes: 7 }, destinos: [], integrantes: [{ id: 'm1', nombre: 'Ana' }, { id: 'm2', nombre: 'Pol' }] } }],
  miembros: [{ viaje_id: VID, miembro: 'm1', user_id: U['tok-ana'] }, { viaje_id: VID, miembro: 'm2', user_id: U['tok-pol'] }],
  respuestas: [
    { viaje_id: VID, miembro: 'm1', updated_at: '2026-11-11T10:00:00Z', data: { nombre: 'Ana', done: true, prioridades: ['playa', 'gastronomia'], noche: 'aperitivo', origen: { ciudad: 'Madrid', iata: 'MAD', pais: 'es' } } },
    { viaje_id: VID, miembro: 'm2', updated_at: '2026-11-11T10:05:00Z', data: { nombre: 'Pol', done: true, prioridades: ['fiesta', 'playa'], noche: 'fiesta', origen: { ciudad: 'Barcelona', iata: 'BCN', pais: 'es' } } }],
  respuestas_privadas: [{ viaje_id: VID, miembro: 'm1', data: { presIdeal: 450, presMax: 1275 } }, { viaje_id: VID, miembro: 'm2', data: { presIdeal: 300, presMax: 1325 } }],
  resultados: [],
};
let iaCupo = true; const llamadas: string[] = [];
function quien(req: Request) { const t = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, ''); if (t === SERVICE) return 'admin'; return U[t] ?? null; }
function mezclar(a: any, b: any): any { if (b && typeof b === 'object' && !Array.isArray(b) && b.__delete__) return undefined;
  if (!a || typeof a !== 'object' || Array.isArray(a) || !b || typeof b !== 'object' || Array.isArray(b)) return b;
  const o = { ...a }; for (const k of Object.keys(b)) { const v = mezclar(a[k], b[k]); if (v === undefined) delete o[k]; else o[k] = v; } return o; }
const r = (d: unknown, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json' } });
const srv = realServe({ port: 54329, onListen() {} }, async (req) => {
  const u = new URL(req.url); const yo = quien(req); llamadas.push(req.method + ' ' + u.pathname);
  if (u.pathname === '/auth/v1/user') return yo && yo !== 'admin' ? r({ id: yo, aud: 'authenticated', role: 'authenticated', is_anonymous: true }) : r({ msg: 'invalid JWT' }, 401);
  const m = u.pathname.match(/^\/rest\/v1\/(rpc\/)?(\w+)$/); if (!m) return r({ message: 'no' }, 404);
  const body = req.method === 'GET' ? null : await req.json().catch(() => null);
  if (m[1]) { // rpc
    if (m[2] === 'mi_miembro') { const x = DB.miembros.find((z) => z.viaje_id === body.v && z.user_id === yo); return r(x ? x.miembro : null); }
    if (m[2] === 'servidor_parchear') { if (yo !== 'admin') return r({ message: 'permission denied' }, 403); const v = DB.viajes.find((z) => z.id === body.p_id); v.data = mezclar(v.data, body.p_patch); return r(v.data); }
    if (m[2] === 'ia_contar') { if (yo !== 'admin') return r({ message: 'permission denied' }, 403); return r(iaCupo); }
    return r({ message: 'rpc desconocida' }, 404);
  }
  const tabla = m[2]; if (!DB[tabla]) return r({ message: 'tabla' }, 404);
  const visible = (fila: any) => yo === 'admin' || (tabla === 'viajes' && DB.miembros.some((z) => z.viaje_id === fila.id && z.user_id === yo));
  if (req.method === 'GET') {
    let filas = DB[tabla].filter(visible);
    for (const [k, v] of u.searchParams) if (k !== 'select' && v.startsWith('eq.')) filas = filas.filter((f) => String(f[k]) === v.slice(3));
    const cols = (u.searchParams.get('select') ?? '*').split(',').map((c) => c.trim());
    filas = filas.map((f) => cols[0] === '*' ? f : Object.fromEntries(cols.map((c) => [c, f[c]])));
    if ((req.headers.get('Accept') ?? '').includes('vnd.pgrst.object')) return filas.length === 1 ? r(filas[0]) : r({ code: 'PGRST116', message: 'no rows', details: '', hint: '' }, 406);
    return r(filas);
  }
  if (req.method === 'POST') { if (yo !== 'admin') return r({ message: 'RLS' }, 403);
    for (const fila of Array.isArray(body) ? body : [body]) { const i = DB[tabla].findIndex((f) => f.viaje_id === fila.viaje_id); if (i > -1) DB[tabla][i] = { ...DB[tabla][i], ...fila }; else DB[tabla].push(fila); }
    return new Response(null, { status: 201 }); }
  return r({ message: 'método' }, 405);
});

/* ---------- cargar las funciones tal cual ---------- */
Deno.env.set('SUPABASE_URL', 'http://127.0.0.1:54329');
Deno.env.set('SUPABASE_PUBLISHABLE_KEYS', JSON.stringify({ default: ANON })); // claves nuevas de Supabase
Deno.env.set('SUPABASE_SECRET_KEYS', JSON.stringify({ default: SERVICE }));
const H: Record<string, (q: Request) => Promise<Response>> = {};
let actual = '';
(Deno as any).serve = (h: any) => { H[actual] = h; return { finished: Promise.resolve(), shutdown() {} }; };
actual = 'motor'; await import('../dist-funciones/motor.ts');
actual = 'ia'; await import('../dist-funciones/zaino-ia.ts');
const llamar = (f: string, tok: string | null, body: unknown) => H[f](new Request('http://x/' + f, { method: 'POST', headers: { 'content-type': 'application/json', ...(tok ? { Authorization: 'Bearer ' + tok } : {}) }, body: JSON.stringify(body) }));

/* ---------- motor ---------- */
let x = await llamar('motor', null, { code: 'ABC234', accion: 'calcular' }); ok(x.status === 403, 'sin sesión no se puede usar el motor');
x = await llamar('motor', 'sb_publishable_xxx', { code: 'ABC234', accion: 'calcular' }); ok(x.status === 403, 'con solo la clave pública tampoco');
x = await llamar('motor', 'tok-intruso', { code: 'ABC234', accion: 'calcular' }); ok(x.status === 403, 'alguien de fuera del viaje no puede calcular');
x = await llamar('motor', 'tok-pol', { code: 'abc', accion: 'calcular' }); ok(x.status === 400, 'un código mal formado se rechaza');
x = await llamar('motor', 'tok-pol', { code: 'ABC234', accion: 'calcular' }); const j = await x.json();
ok(x.status === 200 && j.ok, 'un miembro calcula las propuestas', JSON.stringify(j));
const res = DB.resultados[0]?.data; ok(res && res.propuestas.length >= 2, 'los resultados se guardan con propuestas', res?.propuestas.map((p: any) => p.nombre + ' ' + p.compat + '%').join(', '));
ok(res && !/(^|[^0-9.])(1275|1325)([^0-9]|$)/.test(JSON.stringify(res)), 'los resultados no contienen ningún presupuesto privado');
x = await llamar('motor', 'tok-pol', { code: 'ABC234', accion: 'planear', zona: res.propuestas[0].zona }); ok(x.status === 403, 'solo la organizadora elige destino (Pol no puede)');
x = await llamar('motor', 'tok-ana', { code: 'ABC234', accion: 'planear', zona: res.propuestas[0].zona });
const v = DB.viajes[0].data; ok(x.status === 200 && v.plan && v.plan.dias.length === 4 && v.eleccion.zona === res.propuestas[0].zona && v.eleccion.por === 'm1', 'la organizadora elige y se guarda el plan de 4 días', v.eleccion?.zona);
ok(!/(^|[^0-9.])(1275|1325)([^0-9]|$)|presMax|presIdeal/.test(JSON.stringify(v)), 'el plan tampoco lleva presupuestos');
DB.viajes[0].data.plan.editado = true; DB.viajes[0].data.plan.resto_viejo = 1;
await llamar('motor', 'tok-ana', { code: 'ABC234', accion: 'planear', zona: res.propuestas[1].zona });
ok(DB.viajes[0].data.plan.editado === false && !('resto_viejo' in DB.viajes[0].data.plan), 'al rehacer el plan se sustituye entero (no quedan restos del anterior)');

/* ---------- zaino-ia ---------- */
x = await llamar('ia', 'tok-pol', { code: 'ABC234', pregunta: 'hola' }); ok((await x.json()).disponible === false, 'sin clave de IA: responde que no está disponible (sin gastar)');
Deno.env.set('LLM_PROVIDER', 'anthropic'); Deno.env.set('LLM_MODEL', 'modelo-de-prueba'); Deno.env.set('LLM_API_KEY', 'clave-falsa');
let turno = 0; let pidioHerramienta = '';
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input instanceof Request ? input.url : input);
  if (url.startsWith('https://api.anthropic.com/')) { // modelo simulado: pide una herramienta y luego contesta
    const b = JSON.parse(String(init?.body)); turno++;
    if (turno === 1) return r({ content: [{ type: 'tool_use', id: 't1', name: 'buscar_actividades', input: { destino: DB.viajes[0].data.plan.zona, tipo: 'playa' } }], stop_reason: 'tool_use' });
    const ult = b.messages[b.messages.length - 1].content[0]; pidioHerramienta = String(ult.content).slice(0, 80);
    return r({ content: [{ type: 'text', text: 'Mirad ' + JSON.parse(ult.content)[0]?.nombre + '.' }], stop_reason: 'end_turn' });
  }
  return realFetch(input, init);
};
x = await llamar('ia', 'tok-pol', { code: 'ABC234', pregunta: '¿Alguna playa?' }); const ia = await x.json();
ok(x.status === 200 && ia.disponible && /^Mirad .+\.$/.test(ia.texto) && pidioHerramienta.includes('nombre'), 'el asistente consulta la biblioteca real del destino y responde', ia.texto);
x = await llamar('ia', 'tok-intruso', { code: 'ABC234', pregunta: 'hola' }); ok(x.status === 403, 'alguien de fuera no puede usar el asistente del viaje');
iaCupo = false; x = await llamar('ia', 'tok-pol', { code: 'ABC234', pregunta: 'otra' }); ok(x.status === 429, 'al pasar el límite diario, responde 429 (la app lo explica)');
iaCupo = true; globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => String(input instanceof Request ? input.url : input).startsWith('https://api.anthropic.com/') ? new Response('overloaded', { status: 529 }) : realFetch(input, init);
x = await llamar('ia', 'tok-pol', { code: 'ABC234', pregunta: 'otra' }); ok(x.status === 502 && (await x.json()).error === 'ia_no_disponible', 'si el proveedor falla, error controlado (la app sigue)');

await srv.shutdown();
console.log(fallos ? `\n${fallos} fallo(s)` : '\nTodas las pruebas de las funciones pasan'); Deno.exit(fallos ? 1 : 0);
