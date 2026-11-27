# Poner Zaino en internet sin instalar nada (todo desde el navegador)

Para probar Zaino con amigos fuera de Claude solo hacen falta dos cuentas gratuitas, que creas tú (puedes entrar con tu cuenta de Google en las dos). No hace falta terminal, ni Node, ni la IA de Zaino.

Vas a usar tres archivos de la carpeta `zaino-web-para-subir`:
- `base-de-datos-todo-en-uno.sql`
- `motor.ts`
- la carpeta `web`

Tiempo: unos 25 minutos.

## 1. Supabase (la base de datos) · 10 min

1. Entra en https://supabase.com → **Start your project** → entra con Google.
2. **New project**: ponle de nombre `zaino`, inventa una contraseña de base de datos (guárdala) y elige una región de **Europa**. Espera a que termine de crearse (1–2 min).
3. Menú de la izquierda → **SQL Editor** → **New query**. Abre `base-de-datos-todo-en-uno.sql` con el Bloc de notas (o TextEdit), selecciona todo, cópialo, pégalo en el editor y pulsa **Run**. Debe acabar en *Success*. Es largo: tarda unos segundos.
4. **Authentication** → en la configuración de inicio de sesión (*Sign In / Providers*) activa **Allow anonymous sign-ins** y guarda.

## 2. La función del servidor · 5 min

1. Menú de la izquierda → **Edge Functions** → **Deploy a new function** → **Via Editor** (en el editor del navegador).
2. Ponle exactamente de nombre `motor`.
3. Borra el código de ejemplo, abre `motor.ts` con el Bloc de notas, copia todo y pégalo. Pulsa **Deploy**.
4. En los ajustes de la función `motor`, **desactiva «Verify JWT»** (o «Enforce JWT verification») y guarda. La función ya comprueba ella misma quién llama.

(`zaino-ia.ts` es el asistente. No hace falta para probar: déjalo para más adelante.)

## 3. Conectar la web con tu Supabase · 2 min

1. En Supabase: **Project Settings → API** (o **API Keys**). Copia la **Project URL** y la clave **publishable** (o *anon*). Las dos son públicas.
   **No copies nunca la clave secreta (secret / service_role).**
2. Abre `web/config.js` con el Bloc de notas y rellena las dos líneas:
   ```
   supabaseUrl: 'https://xxxxxxxxxxxx.supabase.co',
   supabaseAnonKey: 'sb_publishable_xxxxxxxx',
   ```
   Guarda el archivo.
   Si prefieres, mándame la URL y la clave publishable y te devuelvo la carpeta `web` ya rellenada.

## 4. Subir la web (Cloudflare Pages) · 5 min

1. Entra en https://dash.cloudflare.com → crea la cuenta (gratis).
2. **Workers & Pages → Create** → Pages → la opción de **subir archivos directamente** (*Upload assets*).
3. Nombre del proyecto: `zaino` (o el que quieras; será la dirección). Arrastra **la carpeta `web`** entera y pulsa **Deploy**.
4. Te da una dirección tipo `https://zaino-xxx.pages.dev`. Ábrela en el móvil: no debe salir el aviso de «Modo prueba».

Alternativa: Netlify (https://app.netlify.com/drop, entrando con tu cuenta) también vale: arrastras la carpeta `web`.

## 5. Probar con tus amigos

Crea un viaje y mándales el enlace de «Invita al grupo». Lo abren en el móvil, eligen su nombre y responden. No necesitan ninguna cuenta.

## Si algo falla

- **«No podemos conectar… falta activar el acceso sin registro»** → paso 1.4.
- **Respondéis pero no salen propuestas** → la función no se llama exactamente `motor`, no está desplegada o tiene «Verify JWT» activado (paso 2). En Supabase → Edge Functions → motor → *Logs* se ve el error.
- **Sale «Modo prueba»** → `web/config.js` no tiene la URL y la clave, o subiste una copia sin guardar.

Para cambiar algo de la web más adelante: vuelve a subir la carpeta `web` al mismo proyecto de Cloudflare (*Create new deployment*).
