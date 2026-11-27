// Adaptador de proveedor de IA. Cambiar de proveedor = cambiar LLM_PROVIDER / LLM_MODEL.
// Interfaz común: chat({system, messages, tools}) → {texto, llamadas:[{id,nombre,args}], fin}
// messages: [{role:'user'|'assistant'|'tool', content, llamadas?, id?, nombre?}]
export function crearLLM({ proveedor, modelo, clave, fetchImpl = fetch, timeoutMs = 25000 }) {
  if (!clave || !proveedor) return null;
  const conTiempo = async (url, opts) => {
    const ac = new AbortController(); const t = setTimeout(() => ac.abort(), timeoutMs);
    try { const r = await fetchImpl(url, { ...opts, signal: ac.signal }); if (!r.ok) throw new Error('proveedor_' + r.status + ': ' + (await r.text()).slice(0, 300)); return await r.json(); }
    finally { clearTimeout(t); }
  };
  if (proveedor === 'anthropic') return {
    nombre: 'anthropic:' + modelo,
    async chat({ system, messages, tools }) {
      const msgs = [];
      for (const m of messages) {
        if (m.role === 'user') msgs.push({ role: 'user', content: m.content });
        else if (m.role === 'assistant') msgs.push({ role: 'assistant', content: [...(m.content ? [{ type: 'text', text: m.content }] : []), ...(m.llamadas || []).map(l => ({ type: 'tool_use', id: l.id, name: l.nombre, input: l.args }))] });
        else if (m.role === 'tool') { const last = msgs[msgs.length - 1]; const bloque = { type: 'tool_result', tool_use_id: m.id, content: m.content };
          if (last && last.role === 'user' && Array.isArray(last.content)) last.content.push(bloque); else msgs.push({ role: 'user', content: [bloque] }); }
      }
      const j = await conTiempo('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': clave, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: modelo, max_tokens: 1200, system, messages: msgs, tools: tools.map(t => ({ name: t.nombre, description: t.descripcion, input_schema: t.esquema })) }) });
      return { texto: (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n'), llamadas: (j.content || []).filter(b => b.type === 'tool_use').map(b => ({ id: b.id, nombre: b.name, args: b.input || {} })), fin: j.stop_reason };
    }
  };
  if (proveedor === 'openai') return {
    nombre: 'openai:' + modelo,
    async chat({ system, messages, tools }) {
      const msgs = [{ role: 'system', content: system }];
      for (const m of messages) {
        if (m.role === 'user') msgs.push({ role: 'user', content: m.content });
        else if (m.role === 'assistant') msgs.push({ role: 'assistant', content: m.content || null, ...(m.llamadas && m.llamadas.length ? { tool_calls: m.llamadas.map(l => ({ id: l.id, type: 'function', function: { name: l.nombre, arguments: JSON.stringify(l.args) } })) } : {}) });
        else if (m.role === 'tool') msgs.push({ role: 'tool', tool_call_id: m.id, content: m.content });
      }
      const j = await conTiempo('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + clave },
        body: JSON.stringify({ model: modelo, messages: msgs, tools: tools.map(t => ({ type: 'function', function: { name: t.nombre, description: t.descripcion, parameters: t.esquema } })) }) });
      const c = j.choices && j.choices[0] && j.choices[0].message || {};
      return { texto: c.content || '', llamadas: (c.tool_calls || []).map(t => ({ id: t.id, nombre: t.function.name, args: JSON.parse(t.function.arguments || '{}') })), fin: j.choices && j.choices[0] && j.choices[0].finish_reason };
    }
  };
  if (proveedor === 'gemini') return {
    nombre: 'gemini:' + modelo,
    async chat({ system, messages, tools }) {
      const contents = [];
      for (const m of messages) {
        if (m.role === 'user') contents.push({ role: 'user', parts: [{ text: String(m.content) }] });
        else if (m.role === 'assistant') {
          // Gemini 3.x exige devolver la "firma de pensamiento" (thoughtSignature) en la parte functionCall tal cual llegó
          const parts = [...(m.content ? [{ text: String(m.content) }] : []), ...(m.llamadas || []).map(l => ({ functionCall: { name: l.nombre, args: l.args }, ...(l.firma ? { thoughtSignature: l.firma } : {}) }))];
          if (parts.length) contents.push({ role: 'model', parts });
        } else if (m.role === 'tool') {
          // todas las respuestas de herramientas de un mismo turno van juntas en UN mensaje de usuario
          const parte = { functionResponse: { name: m.nombre, response: { resultado: m.content } } };
          const last = contents[contents.length - 1];
          if (last && last.role === 'user' && last.parts.every(p => p.functionResponse)) last.parts.push(parte); else contents.push({ role: 'user', parts: [parte] });
        }
      }
      // Gemini admite un subconjunto de OpenAPI: quitamos minimum/maximum y no mandamos "parameters" vacío
      const limpia = (e) => { if (!e || typeof e !== 'object') return e; if (Array.isArray(e)) return e.map(limpia); const o = {}; for (const k of Object.keys(e)) { if (k === 'minimum' || k === 'maximum') continue; o[k] = limpia(e[k]); } return o; };
      const decl = tools.map(t => { const p = limpia(t.esquema); const vacio = !p || !p.properties || !Object.keys(p.properties).length; return { name: t.nombre, description: t.descripcion, ...(vacio ? {} : { parameters: p }) }; });
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent`;
      const j = await conTiempo(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': clave },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, tools: [{ functionDeclarations: decl }] }) });
      const parts = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
      // los "pensamientos" (thought:true) no son texto para el usuario
      return { texto: parts.filter(p => p.text && !p.thought).map(p => p.text).join('\n'),
        llamadas: parts.filter(p => p.functionCall).map((p, i) => ({ id: 'g' + i + '_' + Date.now(), nombre: p.functionCall.name, args: p.functionCall.args || {}, firma: p.thoughtSignature })),
        fin: j.candidates && j.candidates[0] && j.candidates[0].finishReason };
    }
  };
  throw new Error('proveedor_desconocido');
}
