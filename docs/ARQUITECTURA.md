# Arquitectura de Zaino

```
 Móvil de cada persona (web/PWA, sin registro)
 ├─ app.js ............ pantallas (viajes, preguntas, propuestas, plan, lista, gastos, reservas, perfil)
 ├─ store.js (ZSTORE) . capa de datos: Supabase de verdad, o «modo prueba» en el navegador
 └─ núcleo compartido . data.js · engine.js (plan día a día) · compat.js (compatibilidad) · servidor.js
            │  sesión anónima (Supabase Auth)            ▲ tiempo real (postgres_changes) + sondeo de respaldo
            ▼                                           │
 Supabase (UE)
 ├─ Postgres con RLS ... viajes · miembros · respuestas (públicas) · respuestas_privadas · resultados · gastos · lista · ia_uso · lib_*
 ├─ RPC seguras ........ crear_viaje · previa_invitacion · unirse_viaje · parchear_viaje · quitar_integrante · salir_viaje · regenerar_invitacion · borrar_mis_datos
 └─ Edge Functions
    ├─ motor ........... lee respuestas públicas + privadas, escribe SOLO resultados agregados y el plan
    └─ zaino-ia ........ asistente con herramientas sobre la biblioteca y el motor; clave del proveedor en secretos
```

## Piezas

**Núcleo (`src/core`)** — el mismo código corre en el navegador (modo prueba) y en el servidor (Deno). `tools/build.mjs` genera `supabase/functions/_shared/zaino-core.mjs` a partir de él, así no hay dos versiones del motor.

**Motor de compatibilidad v5 (`compat.js`)**
- Restricciones duras, comprobadas en código: presupuesto máximo de cada persona frente al coste mínimo con datos, temporada (`meses.evitar`), coche imprescindible sin nadie que conduzca, dimensión innegociable con oferta < 0,45. Un destino que no las cumple sale en «Descartados» con su motivo.
- Satisfacción por persona: `S = 100 · Σ w·oferta / Σ w · clima + gustos`. `w` = 3 para lo que eligió como prioridad (importante), 1–2 para lo que se deduce de otras respuestas (flexible). `oferta` mezcla el perfil de la zona con las actividades reales en temporada.
- Grupo: `G = 0,6 · media + 0,4 · mínimo` ± temporada y logística. El mínimo pesa para proteger a quien menos encaja: no es una media.
- Tres propuestas: **mejor equilibrio**, **la que más cuida el bolsillo** (la más barata con coste conocido que siga al 80 % de la mejor) y **la sorpresa** (≥ 70 %, perfil distinto). Cada una con %, fórmula, % por persona, coste orientativo con fuentes y huecos, planes que unen, pros, contras, compromisos y dudas.
- **Provisional** mientras falte alguien por responder.

**Privacidad** — `presIdeal`, `presMax` y `fechasOk` van a `respuestas_privadas`, que solo lee su dueño. El motor los usa en el servidor y nunca devuelve cifras ni nombres: «una persona del grupo no puede en esas fechas», «el presupuesto más ajustado marca el techo (no decimos de quién)».

**Invitaciones** — cada viaje tiene un código corto (para reconocerlo) y un token largo aleatorio (para entrar). Con el enlace `#i-<token>` cualquiera ve solo título, fechas y nombres libres, y elige su plaza o escribe su nombre. Sin el token no se ve nada, aunque se sepa el código. La organizadora puede cambiar el enlace (el anterior deja de funcionar).

**Asistente («Pregúntale a Zaino»)** — bucle de herramientas (máx. 5 pasos): `buscar_destinos`, `ver_destino`, `buscar_actividades`, `ver_compatibilidad`, `ver_plan`, `simular`, `proponer_cambio`. Solo cuenta lo que devuelven las herramientas; si el texto final lleva un precio que no sale de la biblioteca, se avisa al usuario. Los cambios que propone no se aplican solos: hay un botón «Aplicar al plan». Proveedor intercambiable (Gemini, Anthropic, OpenAI) con variables de entorno. Sin clave → el botón no aparece.

**Biblioteca** — `biblioteca/zonas/*.json` (23 destinos de Italia), `geo/`, `costes/`. `biblioteca/construir.mjs` valida, marca cada dato como verificado / orientativo / desconocido y genera `public/biblioteca.json` y la migración SQL. Para añadir otro país basta con añadir zonas con el mismo esquema (`SCHEMA.md`); el campo `pais` ya existe.

**Itinerario** — se genera en el servidor al elegir destino (o solo, si el destino estaba fijado y han respondido todos). Cualquiera del grupo puede cambiar, mover, quitar y añadir planes; se ve la distancia aproximada en línea recta y la ruta del día en el mapa. Si cambian las respuestas después, sale un aviso de «plan desactualizado».

## Lo que se ha conservado del prototipo

Pantallas, preguntas con ilustraciones (pegatinas), dibujos de cada zona, motor de planes día a día, lista compartida, gastos tipo Tricount, reservas «por confirmar», tarjeta para stories y perfil. Lo que se ha quitado: la dependencia de Claude (`window.claude`), el pegado manual de respuestas `ZAINO1.` y el modo «solo lectura».
