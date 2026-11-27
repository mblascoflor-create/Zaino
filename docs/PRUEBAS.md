# Qué está probado y dónde

Fecha: 11 de noviembre de 2026. Todo lo de abajo se ha ejecutado de verdad; nada se marca como probado sin haberlo corrido.

| Nivel | Qué significa |
|---|---|
| **Probado en local** | Ejecutado aquí: Postgres real (PGlite) con las mismas migraciones, el motor en Node y en Deno, y la app en Chromium con varios «móviles» compartiendo base de datos. |
| **Probado contra Supabase simulado** | La app en modo servidor, en el navegador, contra un servidor que imita a Supabase: Postgres real (PGlite) con las 3 migraciones, roles y RLS; sesiones anónimas; PostgREST básico; y las funciones `motor` y `zaino-ia` cargadas tal cual se despliegan. |
| **Probado en público** | 11/11/2026, en https://zaino.mblascoflor.workers.dev con el Supabase real (UE, Estocolmo): sesión anónima, crear viaje, guardar respuestas públicas y privadas, la función `motor` calcula propuestas y hace el plan, invitación con token, tiempo real (un cambio llega en ~0,7 s), y «borrar mis datos». Los resultados y el plan no contienen ningún presupuesto. Los viajes de prueba se borraron. |

## Pruebas automáticas (`npm test`) — 60 de 60

- `tests/motor.test.mjs` (23): grupo parecido, grupo dispar (protege al que menos encaja), presupuesto bajo (descarta y no revela cifras), fechas incompatibles (por meses, y con fechas fijas sin decir quién), respuestas parciales → provisional, viaje de 2 días vs 9 días, grupo de fiesta, naturaleza + cultura, cambio de respuestas → cambia la recomendación, innegociable respetado, sin conductores, tres propuestas distintas, % explicable con su fórmula.
- `tests/ia.test.mjs` (12): con un modelo simulado (sin gastar): encadena herramientas sobre la biblioteca real, rechaza destinos y actividades inventados, no expone presupuestos, detecta precios sin fuente, sin clave → `disponible:false`, fallo del proveedor controlado, los tres adaptadores (Gemini, Anthropic, OpenAI) montan bien la petición.
- `tests/sql_rls.test.mjs` (24): las migraciones en Postgres real con usuarios simulados: nadie de fuera ve un viaje aunque sepa el código, token falso no enseña nada, un miembro no ve el presupuesto de otro, nadie escribe respuestas ajenas, dos personas editan reservas a la vez sin pisarse, solo la organizadora cambia título/integrantes/enlace, gente que llega tarde, salir, quitar a alguien, borrar mis datos, solo el servidor escribe resultados.
- `tests/sql_biblioteca.test.mjs` (1): la biblioteca es de solo lectura.

## En el navegador (`npm run test:navegador`)

`tests/e2e/escenarios.py` — **30 de 30**, con 6 «móviles» distintos (cada uno con su sesión):
crear viaje y enlace · enlace inventado y código sin enlace no entran · entrar desde otro móvil sin registro · salir a medias y seguir donde ibas · propuestas provisionales con 2 de 3 · el presupuesto se guarda aparte y no llega a los resultados · alguien que no estaba en la lista entra con su nombre · la organizadora quita a alguien · al responder todos dejan de ser provisionales · varias propuestas distintas con % por persona · votos que llegan al momento · solo la organizadora elige · el plan aparece en el otro móvil sin recargar · añadir, quitar y reordenar planes y verlo en el otro móvil · distancias aproximadas · dos personas añaden a la lista a la vez · el asistente falla y la app sigue · respuesta del asistente · sin asistente no hay botón · cambiar el enlace invalida el viejo · salir del viaje · sin errores de JavaScript.

`tests/e2e/run_groups.py` — 4 grupos completos (fiesteros de playa sin coche; Erasmus en la nieve con coche y fechas fijas; destino fijado con deslizador; cultura con tres destinos a elegir) de principio a fin: crear, invitar, responder cada uno en su móvil, propuestas, elegir, plan, día a día, lista, grupo, tarjeta (descarga), reservas, gastos y perfil. **0 errores.** Capturas en `tests/shots/`.

`tests/e2e/supabase_e2e.py` — **27 de 27**, la app en **modo servidor** contra el Supabase simulado: sesión anónima sin registro · el viaje se crea con código y token · la función motor calcula al responder · la invitación enseña plazas ocupadas · los presupuestos van a la tabla privada · desde el móvil de Pol, consultando la base de datos directamente, solo se lee su parte privada · resultados sin cifras · propuestas, votos (solo la organizadora elige) · el servidor hace el plan y aparece en el otro móvil · un participante edita el itinerario · lista a la vez desde dos móviles · gastos · reservas · cambiar el enlace invalida el viejo · el código solo no da acceso · salir borra también lo privado · sin errores de JavaScript. El tiempo real se desactiva a propósito para comprobar que la app sigue sincronizando con el sondeo de respaldo.

## Servidor (`npm run test:servidor`, necesita Deno)

`tests/funciones.test.ts` — **16 de 16**: las dos funciones tal cual se despliegan, con las claves nuevas de Supabase: sin sesión, con solo la clave pública o desde fuera del viaje → 403 · un miembro calcula · resultados y plan sin presupuestos · solo la organizadora elige · rehacer el plan lo sustituye entero · sin clave de IA no está disponible · con un modelo simulado el asistente consulta la biblioteca real · límite diario → 429 · fallo del proveedor → error controlado. Ambas pasan `deno check`.

## Errores encontrados por estas pruebas (y ya arreglados)

- En Supabase, `pgcrypto` vive en el esquema `extensions`: crear un viaje habría fallado («gen_random_bytes no existe»). La prueba de SQL ahora reproduce ese montaje.
- Con el sondeo de respaldo, la pantalla se repintaba aunque no cambiara nada y se perdía lo que estabas escribiendo en la lista. Ahora solo se avisa cuando cambia algo, y el texto a medio escribir se conserva.
- Las funciones solo entendían las claves antiguas de Supabase. Ahora sirven las antiguas y las nuevas (publishable/secret), y la sesión se comprueba dentro de la función.

## Sin probar

Varias personas reales a la vez con sus propios móviles (la prueba pública se hizo desde un solo navegador; los varios móviles se probaron contra el Supabase simulado) y cualquier proveedor de IA real.

## Error de seguridad encontrado al instalar (arreglado antes de abrirlo)

Supabase da por defecto permiso de ejecutar funciones a cualquier usuario. Con eso, cualquiera del grupo podía llamar a la función interna del servidor (`servidor_parchear`) y saltarse las reglas (por ejemplo, elegir destino sin ser quien organiza). La migración ahora quita ese permiso a `anon` y `authenticated`, y la prueba de SQL reproduce los permisos por defecto de Supabase.

## Lo primero que hay que comprobar al desplegar

1. Abrir la web en dos móviles distintos: crear viaje en uno, entrar con el enlace en el otro.
2. Responder los dos: deben salir las propuestas (si no, mira las funciones en Supabase → Edge Functions → Logs).
3. En Supabase → Table Editor → `respuestas`: no debe haber ningún `presMax` (está en `respuestas_privadas`).
