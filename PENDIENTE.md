# Dónde nos quedamos (13/11/2026)

## Hecho
- Motor m5 de itinerarios (`src/core/engine.js`): lugares por cercanía, varias bases, mañana/comida/tarde/aperitivo/cena/noche, horas orientativas (`cronograma`), comidas del sitio, imprescindibles por zona (`icono`), planes de 1 hora.
- Biblioteca v17: de 429 a 756 planes y 589 paradas concretas (`biblioteca/extra/d1–d4.mjs`, `_consultas.mjs`, `_iconos.mjs`). Se construye con `node biblioteca/construir.mjs`.
- Investigación con fuentes reales (`biblioteca/investigacion/`): Puglia, Roma, Toscana, Nápoles + Costa Amalfitana (Civitatis, blogs, TripAdvisor, sitios para comer con dirección).

## Falta
1. Investigar las otras 19 zonas igual (Civitatis + blogs + TripAdvisor + dónde comer).
2. Meter `investigacion/*.mjs` en `construir.mjs` (enlaces de reserva, consejos, fuentes, sitios para comer, rutas) y que el motor use sitios y rutas.
3. Rehacer la pantalla «Día a día» (`subDias` en `src/app/app.js`) con `ENG.cronograma`: horario, tramos, paradas, enlaces Civitatis/TripAdvisor/mapa.
4. Cambiar el texto «Cada plan y cada enlace sale de una fuente real» por uno honesto.
5. Pruebas (`npm test`, e2e), build, zip para Cloudflare, reiniciar la función `motor` en Supabase.

## Decisiones del 14/11/2026 (para retomar)
- Publicada la versión 4 de «Zaino beta» (artefacto) con el día a día nuevo: horas, trayectos, paradas, opiniones. Cloudflare sigue con la versión antigua.
- Investigación de las 18 zonas que faltan: relanzar 5 agentes en paralelo con `biblioteca/investigacion/INSTRUCCIONES-AGENTES.md` (grupos: Véneto/Lombardía/Lagos/Piamonte · Sicilia/Cerdeña/Calabria · Dolomitas/Trento/Aosta/Friuli · Liguria/Emilia/Umbría/Marcas · Basilicata/Abruzos/Molise + repartir napoles-amalfi.mjs). La primera vez se pararon sin escribir nada.
- ChatGPT: abrir chatgpt.com en el navegador de la app con la sesión de Mateu, pasarle el contexto, debatir mejoras y traerle las propuestas antes de aplicar nada.
- Gemini: más adelante (clave gratis de Google AI Studio en los secretos de Supabase; la suscripción Gemini Pro no trae clave de API).
- Precios del día: opción propuesta Travelpayouts (vuelos) + Viator/GetYourGuide (tours); necesita que Mateu se dé de alta.
