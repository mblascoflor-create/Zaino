// Variante «ligera» de las funciones: en vez de llevar el motor y la biblioteca dentro, los descarga de la web
// de Zaino (ZAINO_ORIGEN) al arrancar. Sirve para pegar la función en el editor de Supabase con un archivo pequeño.
const ORIGEN = (Deno.env.get('ZAINO_ORIGEN') ?? '').replace(/\/+$/, '');
if (!/^(https:\/\/|http:\/\/(127\.0\.0\.1|localhost)[:/])/.test(ORIGEN + '/')) throw new Error('Falta el secreto ZAINO_ORIGEN (la dirección de la web, https://…)');
const [js, bib] = await Promise.all([
  fetch(ORIGEN + '/setup/zaino-core.js').then((r) => { if (!r.ok) throw new Error('nucleo_' + r.status); return r.text(); }),
  fetch(ORIGEN + '/biblioteca.json').then((r) => { if (!r.ok) throw new Error('biblioteca_' + r.status); return r.json(); }),
]);
const m = new Function(js + '\n;return { ENG: ENG, COMPAT: COMPAT, SERVIDOR: SERVIDOR };')();
export const ENG = m.ENG, COMPAT = m.COMPAT, SERVIDOR = m.SERVIDOR;
export default bib;
