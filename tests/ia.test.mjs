// Prueba de la capa de IA con un modelo simulado (sin gastar dinero): bucle de herramientas,
// consultas a la biblioteca, validación de precios y fallo del proveedor.
import fs from 'node:fs'; import vm from 'node:vm';
import { responder, ejecutor, validarTexto } from '../supabase/functions/_shared/ia_core.mjs';
import { crearLLM } from '../supabase/functions/_shared/llm.mjs';
const ctx = { console }; vm.createContext(ctx);
for (const f of ['src/core/data.js', 'src/core/engine.js', 'src/core/compat.js', 'src/core/servidor.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx);
vm.runInContext('this.ENG=ENG;this.COMPAT=COMPAT;this.SERVIDOR=SERVIDOR;', ctx);
const { ENG, COMPAT, SERVIDOR } = ctx;
const ZS = JSON.parse(fs.readFileSync('public/biblioteca.json', 'utf8')).zonas.map(z => ENG.normalizar(z));
let fallos = 0; const ok = (c, m, x) => { console.log((c ? '✓ ' : '✗ ') + m + (x ? '  · ' + x : '')); if (!c) fallos++; };
const viaje = { integrantes: [{ id: 'm1', nombre: 'Ana' }, { id: 'm2', nombre: 'Leo' }], fechas: { modo: 'mes', mes: 7 }, dias: 4, destinos: [] };
const pub = [{ miembro: 'm1', nombre: 'Ana', done: true, prioridades: ['playa', 'fiesta'], noche: 'fiesta', origen: { ciudad: 'Madrid', iata: 'MAD', pais: 'es' } },
  { miembro: 'm2', nombre: 'Leo', done: true, prioridades: ['cultura'], noche: 'calma', origen: { ciudad: 'Madrid', iata: 'MAD', pais: 'es' } }];
const priv = { m1: { presMax: 900 }, m2: { presMax: 250 } };
const resultados = SERVIDOR.calcular(ZS, viaje, pub, priv);
const plan = SERVIDOR.planear(ZS, viaje, pub, priv, resultados.propuestas[0].zona);
const contexto = { ENG, COMPAT, ZS, viaje, resultados, plan, pub, priv };

// 1. Herramientas consultan la biblioteca real
const ej = ejecutor(contexto);
const acts = await ej('buscar_actividades', { destino: plan.zona, tipo: 'playa' });
ok(Array.isArray(acts) && acts.length && acts.every(a => a.enlace !== undefined), 'buscar_actividades devuelve actividades reales con enlace', acts.slice(0, 2).map(a => a.nombre).join(', '));
ok((await ej('ver_destino', { id: 'inventado' })).error, 'un destino inexistente da error, no datos inventados');
const comp = await ej('ver_compatibilidad', {});
ok(!JSON.stringify(comp).includes('250') || !JSON.stringify(comp).includes('presMax'), 'ver_compatibilidad no expone presupuestos privados');
const mal = await ej('proponer_cambio', { dia: 1, accion: 'añadir', actividad_id: 'no-existe', motivo: 'x' });
ok(mal.error, 'proponer una actividad que no existe se rechaza');
// 2. Bucle completo con un modelo simulado que pide herramientas
let turno = 0;
const falso = { nombre: 'falso', async chat({ messages }) {
  turno++;
  if (turno === 1) return { texto: '', llamadas: [{ id: 't1', nombre: 'ver_compatibilidad', args: {} }] };
  if (turno === 2) return { texto: '', llamadas: [{ id: 't2', nombre: 'buscar_actividades', args: { destino: plan.zona, tipo: 'cultura' } }] };
  const ultimo = JSON.parse(messages[messages.length - 1].content);
  return { texto: 'Para Leo os propongo ' + (ultimo[0] ? ultimo[0].nombre : 'nada') + '.', llamadas: [] };
} };
const r = await responder({ llm: falso, pregunta: '¿Qué hacemos para Leo, que le va la cultura?', contexto });
ok(r.disponible && r.pasos === 3 && /Para Leo os propongo/.test(r.texto), 'el asistente encadena herramientas y responde con datos de la biblioteca', r.texto);
// 3. Validación de precios inventados
ok(!validarTexto('La entrada cuesta 37 €', [{ x: 'nada' }]).ok, 'detecta un precio que no sale de la biblioteca');
const inventa = { async chat() { return { texto: 'La cena sale por 85 €', llamadas: [] }; } };
const r2 = await responder({ llm: inventa, pregunta: 'precio', contexto });
ok(r2.aviso === 'precio_sin_fuente' && /no sale de la biblioteca/.test(r2.texto), 'si el modelo se inventa un precio, se avisa al usuario');
// 4. Sin IA configurada y proveedor que falla
ok((await responder({ llm: null, pregunta: 'hola', contexto })).disponible === false, 'sin clave de IA: la app sigue sin asistente (disponible:false)');
const caido = crearLLM({ proveedor: 'anthropic', modelo: 'x', clave: 'k', fetchImpl: async () => ({ ok: false, status: 529, text: async () => 'overloaded' }) });
let err = null; try { await responder({ llm: caido, pregunta: 'hola', contexto }); } catch (e) { err = e.message; }
ok(/proveedor_529/.test(err || ''), 'un fallo del proveedor se propaga como error controlado (la función lo convierte en mensaje)', err);
// 5. Adaptadores construyen bien la petición (sin red)
for (const prov of ['anthropic', 'openai', 'gemini']) {
  let cuerpo = null;
  const llm = crearLLM({ proveedor: prov, modelo: 'm', clave: 'k', fetchImpl: async (url, o) => { cuerpo = { url, body: JSON.parse(o.body) }; return { ok: true, json: async () => (prov === 'anthropic' ? { content: [{ type: 'text', text: 'hola' }] } : prov === 'openai' ? { choices: [{ message: { content: 'hola' } }] } : { candidates: [{ content: { parts: [{ text: 'hola' }] } }] }) }; } });
  const x = await llm.chat({ system: 's', messages: [{ role: 'user', content: 'q' }], tools: [{ nombre: 'f', descripcion: 'd', esquema: { type: 'object', properties: {} } }] });
  ok(x.texto === 'hola' && cuerpo.url.startsWith('https://'), 'adaptador ' + prov + ' habla el formato del proveedor');
}
console.log(fallos ? `\n${fallos} fallo(s)` : '\nTodas las pruebas de IA pasan'); process.exitCode = fallos ? 1 : 0;
