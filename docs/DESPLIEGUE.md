# Cómo poner Zaino en internet

Lo vas a hacer tú, porque hay que crear cuentas a tu nombre. Son unos 30–40 minutos, todo gratis.
Necesitas: un ordenador con **Node 18 o superior** (https://nodejs.org) y esta carpeta descomprimida.

Al acabar tendrás una dirección tipo `https://zaino.pages.dev` que podrás pasar por WhatsApp.
Cada amigo entra con su enlace de invitación desde su móvil, sin registrarse.

---

## Atajo: el asistente de despliegue

Si tienes Node instalado, después de crear el proyecto en Supabase (paso 1.1) puedes hacer casi todo con **un solo comando**, dentro de esta carpeta:

```bash
npm run desplegar
```

Te pregunta la URL y la clave pública, crea `public/config.js`, prepara la web, sube las tablas y las dos funciones. Si algo falla, te dice qué hacer y puedes repetirlo sin miedo. Después solo te quedan el paso 1.3 (activar el acceso sin registro) y el paso 3.3 (subir `dist/`).
Si prefieres hacerlo a mano, sigue los pasos de abajo.

## 1. Base de datos (Supabase) · 15 min

1. Crea una cuenta en https://supabase.com y pulsa **New project**.
   - **Region:** una de Europa (por ejemplo *West EU (Ireland)* o *Central EU (Frankfurt)*). Así los datos se quedan en la UE.
   - Apunta la contraseña de la base de datos (no la necesitarás en la app).
2. Cuando esté listo, ve a **SQL Editor → New query** y ejecuta, **en este orden**, el contenido de:
   1. `supabase/migrations/20261111000001_esquema.sql` (tablas, permisos y reglas de privacidad)
   2. `supabase/migrations/20261111000002_biblioteca.sql` (tablas de la biblioteca)
   3. `supabase/migrations/20261111000003_biblioteca_datos.sql` (los destinos; es largo, pégalo entero)

   4. `supabase/migrations/20261122000001_fechas_privadas.sql` (disponibilidad individual en respuestas privadas)

   Cada uno debe terminar con *Success*. Si alguno falla, para y mándame el mensaje de error.
3. En **Authentication**, en la configuración de inicio de sesión (*Sign In / Providers*), activa **Allow anonymous sign-ins** y guarda.
   Esto es lo que deja entrar a tus amigos sin registrarse.
4. **Project Settings → API**: copia
   - **Project URL** (tipo `https://abcdefgh.supabase.co`)
   - la clave **anon / publishable**.
   Las dos son públicas (van en la web). **No copies la `service_role`/secret en ningún archivo.**

## 2. Las funciones del servidor · 10 min

Son dos: `motor` (calcula propuestas y planes con los presupuestos privados) y `zaino-ia` (el asistente, que se queda apagado hasta que pongas una clave).

En una terminal, dentro de esta carpeta:

```bash
npm run build                                  # prepara la web y el código que usan las funciones
npx supabase login                             # abre el navegador para entrar en tu cuenta
npx supabase link --project-ref TU_REF         # TU_REF = lo que va antes de .supabase.co
npx supabase functions deploy motor
npx supabase functions deploy zaino-ia
```

Opcional pero recomendable, cuando ya sepas la dirección final de la web (paso 3):

```bash
npx supabase secrets set ZAINO_ORIGEN=https://tu-direccion.pages.dev
```

Así solo tu web puede llamar a las funciones.

## 3. La web (Cloudflare Pages) · 10 min

1. Copia `config.ejemplo.js` a `public/config.js` y rellena `supabaseUrl` y `supabaseAnonKey` con lo del paso 1.4.
2. Ejecuta `npm run build`. Se crea la carpeta **`dist/`**: eso es la web entera.
3. Crea una cuenta en https://dash.cloudflare.com → **Workers & Pages → Create** → Pages, con la opción de **subir los archivos directamente** (*Upload assets* / arrastrar carpeta; no hace falta GitHub). Cloudflare cambia a veces los nombres de los menús: lo que buscas es crear un sitio estático subiendo una carpeta.
   Ponle de nombre `zaino` (o el que quieras) y arrastra la carpeta `dist/`.
4. Te da una dirección `https://zaino.pages.dev`. Ábrela en el móvil: ya no debe salir el aviso de «Modo prueba».

Alternativa igual de válida: **Netlify** (https://app.netlify.com/drop, arrastras `dist/`). Ambas leen el archivo `_headers` con las cabeceras de seguridad.
No uses Vercel en su plan gratuito si algún día cobras por Zaino: su plan Hobby es solo para uso no comercial.

Para actualizar la web más adelante: `npm run build` y vuelves a subir `dist/` en el mismo proyecto.

## 4. (Más adelante) Activar «Pregúntale a Zaino»

De momento está **apagado** y no cuesta nada. Cuando quieras probarlo:

1. Consigue una clave de un proveedor. La opción sin coste para probar es **Google AI Studio** (https://aistudio.google.com → *Get API key*): a día de hoy tiene un nivel gratuito para los modelos *Flash*, con límites de peticiones por minuto y por día. Revisa sus condiciones antes: en el nivel gratuito Google puede usar los datos para mejorar sus productos.
   También funcionan Anthropic y OpenAI (de pago).
2. Guarda la clave **en Supabase**, nunca en la web:

   ```bash
   npx supabase secrets set LLM_PROVIDER=gemini LLM_MODEL=gemini-2.5-flash LLM_API_KEY=tu_clave
   # LLM_MODEL: el modelo Flash que AI Studio te deje usar gratis (mira el nombre exacto en su lista de modelos)
   # opcional: preguntas por viaje y día (por defecto 40)
   npx supabase secrets set IA_LIMITE_DIARIO=40
   ```

   (Para Anthropic: `LLM_PROVIDER=anthropic`; para OpenAI: `LLM_PROVIDER=openai`, con el modelo que elijas.)
3. En `public/config.js` pon `ia: true`, `npm run build` y vuelve a subir `dist/`.

Si la clave falla o se acaba el cupo, la app sigue funcionando igual: solo el asistente dice que ahora no puede contestar.

---

## Qué es secreto y qué no

| Dato | ¿Dónde va? | ¿Es secreto? |
|---|---|---|
| Project URL de Supabase | `public/config.js` | No |
| Clave anon/publishable | `public/config.js` | No (la protegen las reglas RLS) |
| Clave service_role / secret | En ningún archivo. Supabase la pone sola dentro de las funciones | **Sí** |
| Clave del proveedor de IA | `supabase secrets set` | **Sí** |

## Si algo no va

- **«No podemos conectar con Zaino… falta activar el acceso sin registro»** → paso 1.3.
- **Las propuestas no salen nunca** → las funciones no están desplegadas (paso 2) o `ZAINO_ORIGEN` no coincide con tu dirección.
- **Sale «Modo prueba»** → `public/config.js` vacío o no rehiciste `npm run build` después de rellenarlo.

## Lo que está montado ahora mismo (11/11/2026)

- Web: https://zaino.mblascoflor.workers.dev (Cloudflare Workers, cuenta de Mateu, proyecto `zaino`).
- Servidor: Supabase, proyecto en North EU (Stockholm), con la migración `20261111000001_esquema.sql`, acceso anónimo activado y la función `motor` (variante ligera, que descarga el motor y la biblioteca de la web) con «Verify JWT» desactivado y el secreto `ZAINO_ORIGEN=https://zaino.mblascoflor.workers.dev`.
- Las tablas de la biblioteca (`lib_*`) no están cargadas: la app no las necesita.
- Para actualizar la web: `npm run build` y subir el contenido de `dist/` (o el zip) en Cloudflare → zaino → Deployments → nueva versión. Si cambia el motor (`src/core`), basta con subir la web: la función lo descarga de ahí (tarda hasta que se reinicia la función; se puede forzar redesplegándola).
