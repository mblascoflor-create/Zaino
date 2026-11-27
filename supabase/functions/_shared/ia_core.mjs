// IA de Zaino: interpreta, explica y propone usando SOLO la biblioteca y el motor.
// La IA no decide restricciones (las comprueba el motor) ni aplica cambios: propone, y el grupo confirma.
const MAX_PASOS = 5;
const LIMITE_RESULTADOS = 12;

export function herramientas() {
  return [
    { nombre: 'buscar_destinos', descripcion: 'Busca destinos de la biblioteca de Zaino. Devuelve id, nombre, lema, perfil (0-3 por eje), nivel de precio, meses buenos y coste orientativo si existe.',
      esquema: { type: 'object', properties: { ejes: { type: 'array', items: { type: 'string', enum: ['playa','naturaleza','montana','ciudad','cultura','gastronomia','fiesta','aventura','relax','postal'] } }, mes: { type: 'integer', minimum: 1, maximum: 12 }, sin_coche: { type: 'boolean' } } } },
    { nombre: 'ver_destino', descripcion: 'Detalle de un destino: bases, cómo llegar, si hace falta coche, notas honestas, costes orientativos con fuente y cuántas actividades tiene de cada tipo.',
      esquema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
    { nombre: 'buscar_actividades', descripcion: 'Actividades reales de un destino, filtrables por tipo, mes, sin coche o texto. Devuelve id, nombre, tipo, duración, coste (categoría), si hay que reservar, enlace y mapa.',
      esquema: { type: 'object', properties: { destino: { type: 'string' }, tipo: { type: 'string' }, mes: { type: 'integer' }, sin_coche: { type: 'boolean' }, texto: { type: 'string' } }, required: ['destino'] } },
    { nombre: 'ver_compatibilidad', descripcion: 'Las propuestas actuales del grupo calculadas por el motor: compatibilidad por persona, coincidencias, diferencias, incompatibilidades y descartes (con motivo).', esquema: { type: 'object', properties: {} } },
    { nombre: 'ver_plan', descripcion: 'El itinerario actual del viaje (días, planes, comidas, noches).', esquema: { type: 'object', properties: {} } },
    { nombre: 'simular', descripcion: 'Recalcula las propuestas con otra duración o mes (el motor comprueba presupuestos y restricciones). No cambia nada.',
      esquema: { type: 'object', properties: { dias: { type: 'integer', minimum: 1, maximum: 14 }, mes: { type: 'integer', minimum: 1, maximum: 12 } } } },
    { nombre: 'proponer_cambio', descripcion: 'Propone un cambio del itinerario para que el grupo lo confirme: añadir, quitar o cambiar una actividad de un día. Solo actividades de la biblioteca de ese destino.',
      esquema: { type: 'object', properties: { dia: { type: 'integer', minimum: 1 }, accion: { type: 'string', enum: ['añadir','quitar','cambiar'] }, actividad_id: { type: 'string' }, reemplaza_id: { type: 'string' }, motivo: { type: 'string' } }, required: ['dia','accion','motivo'] } }
  ];
}

export const SISTEMA = `Eres Zaino, el asistente de una app para organizar viajes en grupo por Italia.
Reglas que no puedes romper:
- Usa SOLO información que te devuelvan las herramientas (biblioteca de Zaino y motor). Si no está, di claramente que Zaino no tiene ese dato. No completes con conocimiento general.
- No inventes precios, horarios, disponibilidad, reservas ni locales. Los precios que haya son orientativos: dilo.
- Las restricciones (presupuesto máximo, fechas, coche, lo que alguien marcó como imprescindible) las decide el motor; no recomiendes algo que el motor ha descartado.
- No reveles ni intentes deducir el presupuesto o las fechas privadas de nadie.
- Para cambiar el itinerario usa proponer_cambio: tú propones, el grupo confirma.
- Responde en español de España, cercano y breve (máximo 6 frases o una lista corta). Nombra las actividades tal cual aparecen.`;

function resumenZona(Z, A, ENG) {
  const c = Z.costes && Z.costes.datos;
  return { id: Z.id, nombre: Z.corto, lema: Z.lema, perfil: Z.perfil, precio: Z.precio, meses: Z.meses, coche: Z.coche.necesidad,
    coste_orientativo: c ? { hostel_noche: c.hostel_noche && [c.hostel_noche.min, c.hostel_noche.max], doble_noche: c.doble_noche && [c.doble_noche.min, c.doble_noche.max], comida_barata: c.comida_barata && c.comida_barata.valor, billete_transporte: c.transporte_billete && c.transporte_billete.valor, fecha: Z.costes.fecha_consulta } : 'sin datos' };
}

export function ejecutor({ ENG, COMPAT, ZS, viaje, resultados, plan, pub, priv }) {
  const ZM = {}; ZS.forEach(z => { ZM[z.id] = z; });
  const destinoViaje = plan && plan.zona;
  const A = ENG.agregar(viaje, pub.filter(r => r.done));
  return async function (nombre, args) {
    args = args || {};
    if (nombre === 'buscar_destinos') {
      const Am = Object.assign({}, A, { mes: args.mes || A.mes, tieneCoche: args.sin_coche ? false : A.tieneCoche });
      let zs = ZS.filter(z => !(args.sin_coche && z.coche.necesidad === 'imprescindible'));
      if (args.ejes && args.ejes.length) zs = zs.map(z => ({ z, s: args.ejes.reduce((t, e) => t + COMPAT.ofertaZona(z, Am).s[e], 0) })).sort((a, b) => b.s - a.s).map(x => x.z);
      return zs.slice(0, 8).map(z => resumenZona(z, Am, ENG));
    }
    if (nombre === 'ver_destino') {
      const Z = ZM[args.id]; if (!Z) return { error: 'No existe ese destino en la biblioteca' };
      const porTipo = {}; Z.actividades.forEach(a => { porTipo[a.tipo] = (porTipo[a.tipo] || 0) + 1; });
      return Object.assign(resumenZona(Z, A, ENG), { bases: Z.bases.map(b => ({ id: b.id, nombre: b.nombre, por_que: b.por_que })), aeropuertos: Z.aeropuertos.map(a => a.ciudad + ' (' + a.iata + ')'),
        moverse: Z.moverse.resumen, notas_honestas: Z.notas, actividades_por_tipo: porTipo, fuente_costes: Z.costes && Z.costes.datos ? 'orientativo, consultado el ' + Z.costes.fecha_consulta : null });
    }
    if (nombre === 'buscar_actividades') {
      const Z = ZM[args.destino]; if (!Z) return { error: 'No existe ese destino en la biblioteca' };
      const mes = args.mes || A.mes, t = args.texto ? ENG.norm(args.texto) : null;
      return Z.actividades.filter(a => (!args.tipo || a.tipo === args.tipo || (a.tipos || []).includes(args.tipo)) && (!mes || !a.meses || !a.meses.length || a.meses.includes(mes)) && !(args.sin_coche && a.coche) && (!t || ENG.norm(a.nombre + ' ' + a.descripcion + ' ' + a.donde).includes(t)))
        .slice(0, LIMITE_RESULTADOS).map(a => ({ id: a.id, nombre: a.nombre, donde: a.donde, tipo: a.tipo, duracion: a.duracion, coste: a.coste + ' (categoría, no precio)', reservar: a.reserva, coche: a.coche, meses: a.meses || 'todo el año', descripcion: a.descripcion, enlace: a.enlace, mapa: a.maps }));
    }
    if (nombre === 'ver_compatibilidad') {
      if (!resultados) return { aviso: 'Aún no hay propuestas: falta que el grupo responda.' };
      return { provisional: resultados.provisional, respondidos: resultados.respondidos.length + ' de ' + resultados.n_total, fechas: resultados.fechas,
        propuestas: (resultados.propuestas || []).map(p => ({ tipo: p.tipo, destino: p.nombre, id: p.zona, compatibilidad: p.compat, formula: p.formula, por_persona: p.porPersona.map(x => x.nombre + ' ' + x.pct + '%'), coste: p.coste.min != null ? p.coste.min + '-' + p.coste.max + ' € por persona sin el viaje (orientativo)' : 'sin datos de coste', compromisos: p.compromisos, dudas: p.dudas })),
        grupo: resultados.grupo, descartados: resultados.descartados };
    }
    if (nombre === 'ver_plan') {
      if (!plan) return { aviso: 'Todavía no hay itinerario: primero hay que elegir destino.' };
      return { destino: plan.zona, dias: plan.dias.map(d => ({ dia: d.n, titulo: d.titulo, planes: d.slots.map(s => ({ momento: s.momento, nombre: s.nombre, id: s.ref || null, de: s.de || null })) })) };
    }
    if (nombre === 'simular') {
      const v2 = Object.assign({}, viaje, args.dias ? { dias: args.dias, fechas: Object.assign({}, viaje.fechas, viaje.fechas && viaje.fechas.modo === 'fijas' ? { modo: 'mes', mes: new Date(viaje.fechas.inicio + 'T12:00:00').getMonth() + 1 } : {}) } : {}, args.mes ? { fechas: { modo: 'mes', mes: args.mes } } : {});
      const r = COMPAT.recomendar(ZS, v2, pub.filter(x => x.done), priv || {});
      return { propuestas: r.propuestas.map(p => ({ tipo: p.tipo, destino: p.nombre, compatibilidad: p.compat })), descartados: r.descartados.slice(0, 5).map(d => ({ destino: ZM[d.zona] && ZM[d.zona].corto, motivos: d.motivos })) };
    }
    if (nombre === 'proponer_cambio') {
      if (!plan || !destinoViaje) return { error: 'No hay itinerario todavía' };
      const Z = ZM[destinoViaje]; const d = plan.dias[args.dia - 1]; if (!d) return { error: 'Ese día no existe en el plan' };
      if (args.accion !== 'quitar') { const a = Z.actividades.find(x => x.id === args.actividad_id); if (!a) return { error: 'Esa actividad no está en la biblioteca de este destino' }; if (a.coche && !A.tieneCoche) return { error: 'Esa actividad necesita coche y nadie conduce' }; }
      if (args.accion !== 'añadir' && args.reemplaza_id && !d.slots.some(s => s.ref === args.reemplaza_id)) return { error: 'Ese plan no está en ese día' };
      return { ok: true, propuesta: { dia: args.dia, accion: args.accion, actividad_id: args.actividad_id || null, reemplaza_id: args.reemplaza_id || null, motivo: args.motivo } };
    }
    return { error: 'herramienta desconocida' };
  };
}

// Comprueba que los precios en € que dice el texto aparecen en lo que devolvieron las herramientas
export function validarTexto(texto, salidas) {
  const visto = JSON.stringify(salidas);
  const precios = (texto.match(/(\d+(?:[.,]\d+)?)\s?€/g) || []).map(p => p.replace(/\s?€/, '').replace(',', '.'));
  const raros = precios.filter(p => !visto.includes(p) && !visto.includes(p.replace('.', ',')));
  return { ok: !raros.length, raros };
}

// Historial que llega del navegador: solo roles user/assistant, texto, 800 caracteres por mensaje, últimos 6,
// y sin empezar por una respuesta del asistente (algunos proveedores exigen empezar por el usuario).
export function limpiarHistorial(historial) {
  const h = (Array.isArray(historial) ? historial : [])
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.slice(0, 800) }))
    .slice(-6);
  while (h.length && h[0].role !== 'user') h.shift();
  return h;
}

export async function responder({ llm, pregunta, historial = [], contexto }) {
  if (!llm) return { disponible: false, texto: null };
  const ej = ejecutor(contexto), tools = herramientas(), salidas = [], propuestas = [];
  const messages = limpiarHistorial(historial).concat([{ role: 'user', content: String(pregunta).slice(0, 800) }]);
  for (let paso = 0; paso < MAX_PASOS; paso++) {
    const r = await llm.chat({ system: SISTEMA, messages, tools });
    if (!r.llamadas || !r.llamadas.length) {
      const v = validarTexto(r.texto || '', salidas);
      let texto = r.texto || 'No tengo una respuesta con los datos de Zaino.';
      if (!v.ok) texto += '\n\n(Ojo: algún precio de esta respuesta no sale de la biblioteca de Zaino; compruébalo en los enlaces.)';
      return { disponible: true, texto, propuestas, pasos: paso + 1, aviso: v.ok ? null : 'precio_sin_fuente' };
    }
    messages.push({ role: 'assistant', content: r.texto || '', llamadas: r.llamadas });
    for (const l of r.llamadas) {
      let out; try { out = await ej(l.nombre, l.args); } catch (e) { out = { error: 'fallo interno' }; }
      salidas.push(out); if (out && out.ok && out.propuesta) propuestas.push(out.propuesta);
      messages.push({ role: 'tool', id: l.id, nombre: l.nombre, content: JSON.stringify(out).slice(0, 12000) });
    }
  }
  return { disponible: true, texto: 'He necesitado demasiados pasos para responder. Prueba a preguntarlo de forma más concreta.', propuestas, pasos: MAX_PASOS };
}
