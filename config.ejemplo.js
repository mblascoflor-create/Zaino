/* ============================================================
   CONFIGURACIÓN DE ZAINO
   Copia este archivo a public/config.js y rellena los dos datos de tu
   proyecto de Supabase (Project Settings → API). Ambos son PÚBLICOS:
   la seguridad la ponen las reglas de la base de datos, no estas claves.
   NUNCA pongas aquí la clave service_role ni la clave del proveedor de IA:
   esas van en los "secrets" de las funciones de Supabase.
   Mientras esté vacío, la app funciona en "modo prueba" (solo este navegador).
   ============================================================ */
window.ZAINO_CONFIG = {
  supabaseUrl: '',        // p. ej. https://abcdefgh.supabase.co
  supabaseAnonKey: '',    // la clave "anon" / "publishable"
  ia: false,              // pon true cuando hayas configurado LLM_API_KEY en Supabase
  urlPublica: '',         // opcional: la dirección final, p. ej. https://zaino.pages.dev/
  // Códigos de afiliado (déjalo vacío hasta que te den de alta en cada programa).
  // Por dominio, los parámetros que pide cada programa. Ejemplo (valores inventados, NO usar):
  //   afiliados: { 'booking.com': { aid: 'TU_ID' }, 'getyourguide.es': { partner_id: 'TU_ID' } }
  afiliados: {}
};
if (!window.ZAINO_CONFIG.supabaseUrl) window.ZAINO_CONFIG = null;
