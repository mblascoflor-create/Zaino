/* ============================================================
   CONFIGURACIÓN DE ZAINO con el asistente de IA activado (plantilla, SIN claves).
   Cómo usarla: copia este archivo a public/config.js (ese nombre está en .gitignore),
   pega la clave PUBLISHABLE (la pública, empieza por sb_publishable_...) y ejecuta `node tools/build.mjs`.
   Lo único que cambia respecto a config.ejemplo.js es:  ia: true
   NUNCA pongas aquí la clave de Google (LLM_API_KEY) ni la service_role: van en los secretos de Supabase.
   ============================================================ */
window.ZAINO_CONFIG = {
  supabaseUrl: 'https://yywmuxrmfbfanxqkowqz.supabase.co',
  supabaseAnonKey: 'PEGA_AQUI_LA_CLAVE_PUBLISHABLE',   // Supabase > Project Settings > API (pública)
  ia: true,               // <-- la línea que activa "Pregúntale a Zaino"
  urlPublica: 'https://zaino.mblascoflor.workers.dev/',
  afiliados: {}
};
if (!window.ZAINO_CONFIG.supabaseUrl) window.ZAINO_CONFIG = null;
