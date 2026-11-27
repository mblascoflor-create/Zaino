// Escenarios del motor de compatibilidad v5 (se ejecutan de verdad con la biblioteca real).
import fs from 'node:fs'; import vm from 'node:vm';
const ctx = { console }; vm.createContext(ctx);
for (const f of ['src/core/data.js', 'src/core/engine.js', 'src/core/compat.js', 'src/core/servidor.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
vm.runInContext('this.ENG=ENG; this.COMPAT=COMPAT; this.SERVIDOR=SERVIDOR;', ctx);
const { ENG, COMPAT, SERVIDOR } = ctx;
const lib = JSON.parse(fs.readFileSync('public/biblioteca.json', 'utf8'));
const ZS = lib.zonas.map(z => ENG.normalizar(z));
let fallos = 0; const ok = (c, m, extra) => { console.log((c ? '✓ ' : '✗ ') + m + (extra ? '  · ' + extra : '')); if (!c) fallos++; };
const P = (id, nombre, o) => Object.assign({ miembro: id, nombre, done: true, origen: { ciudad: 'Madrid', iata: 'MAD', pais: 'es' }, dormir: 'piso', comida: 'trattoria', ritmo: 2 }, o);
const viaje = (n, o) => Object.assign({ integrantes: Array.from({ length: n }, (_, i) => ({ id: 'm' + (i + 1), nombre: 'P' + (i + 1) })), fechas: { modo: 'mes', mes: 7 }, dias: 5, destinos: [] }, o);
const res = (t, R, priv) => COMPAT.recomendar(ZS, t, R, priv || {});
const nombre = id => ZS.find(z => z.id === id).corto;
const resumen = r => r.propuestas.map(p => p.tipo + ':' + nombre(p.zona) + ' ' + p.compat + '%').join(' · ');

// 1. Gustos parecidos
{ const R = ['m1','m2','m3'].map((id, i) => P(id, ['Ana','Bea','Cris'][i], { paisaje: ['mar'], prioridades: ['playa', 'gastronomia', 'fiesta'], noche: 'fiesta', clima: 'calor' }));
  const r = res(viaje(3), R); const b = r.propuestas[0];
  ok(b && b.tipo === 'best' && b.compat >= 60, '1. Grupo parecido: sale un mejor equilibrio claro', resumen(r));
  ok(b && Math.max(...b.porPersona.map(p => p.pct)) - b.minimo <= 5, '1. y a los tres les encaja casi igual', b && b.porPersona.map(p => p.nombre + ' ' + p.pct + '%').join(', '));
  ok(r.grupo.coincidencias.length >= 2, '1. detecta las coincidencias', r.grupo.coincidencias.map(c => c.texto).join(' / ')); }

// 2. Gustos muy distintos: playa+fiesta, naturaleza, cultura+gastronomía
{ const R = [P('m1','Ana',{ prioridades:['playa','fiesta'], noche:'fiesta', paisaje:['mar'] }), P('m2','Bea',{ prioridades:['playa','fiesta'], noche:'fiesta', paisaje:['mar'] }),
    P('m3','Cris',{ prioridades:['naturaleza','aventura'], paisaje:['montana'], noche:'calma' }), P('m4','Dani',{ prioridades:['cultura','gastronomia'], paisaje:['ciudad'], noche:'aperitivo' })];
  const t = viaje(4); const r = res(t, R); const b = r.propuestas[0];
  // ¿qué habría salido con solo la media?
  const A = ENG.agregar(t, R); const ev = ZS.map(Z => COMPAT.evaluar(Z, A, R, {}, t)).filter(e => e.valido);
  const porMedia = ev.sort((x, y) => y.media - x.media)[0];
  ok(b && b.minimo >= porMedia.minimo, '2. Grupo dispar: la propuesta protege al menos satisfecho (no es solo la media)', `elegido ${nombre(b.zona)} mín ${b.minimo}% · solo-media ${nombre(porMedia.zona)} mín ${porMedia.minimo}%`);
  ok(r.grupo.diferencias.length >= 2 && r.grupo.incompatibles.some(i => i.tipo === 'noche'), '2. identifica diferencias e incompatibilidades', r.grupo.incompatibles.map(i => i.texto).join(' / '));
  ok(b && b.compromisos.length >= 1, '2. explica los compromisos', b && b.compromisos.join(' / '));
  ok(b && b.actividades.some(a => a.fans.length >= 2), '2. encuentra actividades que unen a varios', b && b.actividades.slice(0, 3).map(a => a.nombre + ' (' + a.fans.join(', ') + ')').join(' / ')); }

// 3. Una persona con mucho menos presupuesto
{ const R = ['m1','m2','m3','m4'].map((id, i) => P(id, ['Ana','Bea','Cris','Dani'][i], { prioridades: ['cultura', 'gastronomia', 'postal'], paisaje: ['ciudad'] }));
  const priv = { m1: { presIdeal: 600, presMax: 800 }, m2: { presIdeal: 600, presMax: 800 }, m3: { presIdeal: 500, presMax: 700 }, m4: { presIdeal: 150, presMax: 200 } };
  const r = res(viaje(4), R, priv); const caras = r.descartados.filter(d => d.motivos.some(m => /presupuesto máximo/.test(m)));
  ok(caras.length >= 1, '3. Presupuesto bajo: los destinos que superan su máximo salen descartados', caras.map(d => nombre(d.zona)).join(', '));
  ok(r.propuestas.every(p => p.coste.min == null || p.coste.min <= 200), '3. ninguna propuesta supera el máximo de esa persona (con datos)', resumen(r));
  ok(!JSON.stringify(r).includes('"presMax"') && !JSON.stringify(r).includes('200 €'), '3. el resultado no revela el presupuesto de nadie');
  ok(r.grupo.limitantes.some(l => l.tipo === 'presupuesto'), '3. avisa de que el presupuesto más ajustado marca el techo (sin decir de quién)'); }

// 4. Fechas incompatibles
{ const R = [P('m1','Ana',{ meses:[7], prioridades:['playa'] }), P('m2','Bea',{ meses:[10], prioridades:['playa'] }), P('m3','Cris',{ meses:[7,8], prioridades:['playa'] })];
  const r = res(viaje(3, { fechas: { modo: 'abierto' }, dias: 0 }), R);
  ok(!r.fechas.ok && r.fechas.problemas.length && r.fechas.nNo===1 && !JSON.stringify(r.fechas).includes('Bea'), '4. Fechas abiertas incompatibles: avisa sin identificar a nadie', r.fechas.problemas[0]);
  const r2 = res(viaje(2, { fechas: { modo: 'fijas', inicio: '2027-07-10', fin: '2027-07-14' } }), [P('m1','Ana',{ fechasOk:'si' }), P('m2','Bea',{ fechasOk:'no' })]);
  ok(!r2.fechas.ok && /Una persona del grupo no puede/.test(r2.fechas.problemas[0]) && !JSON.stringify(r2).includes('Bea no'), '4. con fechas fijas también, sin decir quién (la respuesta de fechas es privada)', r2.fechas.problemas[0]); }

// 5. Respuestas incompletas
{ const R = [P('m1','Ana',{ prioridades:['playa'] }), P('m2','Bea',{ prioridades:['cultura'] })];
  const r = res(viaje(4), R);
  ok(r.provisional === true && r.respondidos.length === 2 && r.n_total === 4, '5. Faltan respuestas: resultado provisional (2 de 4)'); }

// 6. Viaje corto frente a largo
{ const R = [P('m1','Ana',{ prioridades:['playa','cultura'] }), P('m2','Bea',{ prioridades:['playa','gastronomia'] })];
  const corto = res(viaje(2, { dias: 2 }), R), largo = res(viaje(2, { dias: 9 }), R);
  const cS = corto.propuestas.find(p => ['sicilia', 'cerdena'].includes(p.zona));
  ok(!cS || corto.propuestas[0].zona !== cS.zona, '6. Viaje de 2 días: no manda a una isla grande como mejor opción', resumen(corto));
  const Zb = ZS.find(z => z.id === largo.propuestas[0].zona), A = ENG.agregar(viaje(2, { dias: 9 }), R), plan = ENG.construirPlan(Zb, A, viaje(2, { dias: 9 }));
  ok(plan.dias.length === 9, '6. Viaje de 9 días: el plan tiene 9 días', 'bases ' + plan.bases.join(' > ') + ' · ' + resumen(largo)); }

// 7. Grupo de fiesta
{ const R = ['m1','m2','m3'].map((id, i) => P(id, ['Ana','Bea','Cris'][i], { prioridades: ['fiesta'], noche: 'fiesta', duelo1: 'ultimo_bar', momento: 'fiesta' }));
  const r = res(viaje(3), R), Z = ZS.find(z => z.id === r.propuestas[0].zona), A = ENG.agregar(viaje(3), R);
  ok(COMPAT.ofertaZona(Z, A).s.fiesta >= 0.6, '7. Grupo de fiesta: el mejor destino es fuerte en noche', resumen(r)); }

// 8. Naturaleza y cultura
{ const R = ['m1','m2'].map((id, i) => P(id, ['Ana','Bea'][i], { prioridades: ['naturaleza', 'cultura'], paisaje: ['montana', 'campo'], noche: 'calma' }));
  const t = viaje(2, { fechas: { modo: 'mes', mes: 6 } }); const r = res(t, R), Z = ZS.find(z => z.id === r.propuestas[0].zona), s = COMPAT.ofertaZona(Z, ENG.agregar(t, R)).s;
  ok(s.naturaleza >= 0.6 && s.cultura >= 0.5, '8. Naturaleza y cultura: el destino tiene las dos cosas', resumen(r) + ` · nat ${s.naturaleza.toFixed(2)} cult ${s.cultura.toFixed(2)}`); }

// 9. Alguien cambia sus respuestas después
{ const t = viaje(2, { fechas: { modo: 'mes', mes: 1 } });
  const antes = res(t, [P('m1','Ana',{ prioridades:['cultura','gastronomia'], paisaje:['ciudad'] }), P('m2','Bea',{ prioridades:['cultura'], paisaje:['ciudad'] })]);
  const despues = res(t, [P('m1','Ana',{ prioridades:['montana','aventura'], paisaje:['montana'], nieve:'si', nieveAct:'esqui' }), P('m2','Bea',{ prioridades:['montana'], paisaje:['montana'], nieve:'si', nieveAct:'esqui' })]);
  ok(antes.propuestas[0].zona !== despues.propuestas[0].zona, '9. Si cambian las respuestas, cambia la recomendación', nombre(antes.propuestas[0].zona) + ' → ' + nombre(despues.propuestas[0].zona)); }

// Extra: restricciones duras
{ const R = [P('m1','Ana',{ prioridades:['playa'], innegociable:'playa', paisaje:['mar'] }), P('m2','Bea',{ prioridades:['montana'], paisaje:['montana'] })];
  const r = res(viaje(2, { fechas: { modo: 'mes', mes: 7 } }), R);
  ok(r.propuestas.every(p => { const Z = ZS.find(z => z.id === p.zona); return COMPAT.ofertaZona(Z, ENG.agregar(viaje(2), R)).s.playa >= 0.45; }), 'Extra. Lo "no negociable" de Ana (playa) se respeta en las tres propuestas', resumen(r));
  const sinCoche = res(viaje(2), [P('m1','Ana',{ coche:'no', prioridades:['naturaleza'] }), P('m2','Bea',{ coche:'no', prioridades:['naturaleza'] })]);
  ok(sinCoche.propuestas.every(p => ZS.find(z => z.id === p.zona).coche.necesidad !== 'imprescindible'), 'Extra. Sin conductores no propone zonas donde el coche es imprescindible', resumen(sinCoche));
  const tipos = sinCoche.propuestas.map(p => p.zona); ok(new Set(tipos).size === tipos.length, 'Extra. Las tres propuestas son destinos distintos'); }

// Extra: la fórmula cuadra
{ const R = [P('m1','Ana',{ prioridades:['playa'] }), P('m2','Bea',{ prioridades:['cultura'] })];
  const b = res(viaje(2), R).propuestas[0];
  const bruto = Math.round(0.6 * b.media + 0.4 * b.minimo);
  ok(Math.abs(b.compat - bruto) <= 8, 'Extra. El % mostrado sale de la fórmula (0,6·media + 0,4·mínimo ± ajustes de temporada/vuelos)', `${b.compat}% = ${b.formula}`); }

// A5. Con días/meses/presupuesto privados el plan lleva mes y gasto del servidor (el móvil solo ve lo público)
{ const trip = { code: 'ABC123', integrantes: [{ id: 'm1', nombre: 'Ana' }, { id: 'm2', nombre: 'Pol' }], fechas: { modo: 'abierto' }, destinos: ['puglia-salento'], presupuesto: 600 };
  const pub = ['m1', 'm2'].map((id, i) => P(id, ['Ana', 'Pol'][i], { prioridades: ['playa'] }));
  const priv = { m1: { meses: [9], dias: 3, presMax: 250, presIdeal: 200 }, m2: { meses: [9], dias: 3, presMax: 300, presIdeal: 250 } };
  const plan = SERVIDOR.planear(ZS, trip, pub, priv, 'puglia-salento');
  const Acli = ENG.agregar(trip, pub);
  ok(plan.dias.length === 3 && plan.mes === 9 && plan.presTier === 'ajustado', 'A5. El plan guarda días, mes y gasto calculados con lo privado', `días ${plan.dias.length} · mes ${plan.mes} · gasto ${plan.presTier}`);
  ok(Acli.dias !== plan.dias.length && Acli.mes !== plan.mes, 'A5. (el cálculo solo con lo público sale distinto: por eso la app debe usar el plan)', `cliente días ${Acli.dias} mes ${Acli.mes}`);
  ok(!JSON.stringify(plan).match(/250|300|presMax|presIdeal/), 'A5. y el plan sigue sin cifras privadas'); }

console.log(fallos ? `\n${fallos} prueba(s) fallida(s)` : '\nTodas las pruebas del motor pasan');
process.exitCode = fallos ? 1 : 0;
