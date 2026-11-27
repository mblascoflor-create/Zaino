# ZAINO — todo el proyecto, para trabajar con otra IA

Actualizado: 22 de noviembre de 2026. Autor del proyecto: Mateu (no programa). Hasta ahora lo ha construido Claude.
Este documento va con un zip (`zaino-para-chatgpt.zip`) que contiene el código, la biblioteca, la investigación, la documentación y capturas de pantalla.
No hay claves secretas en nada de esto.

---

## 0. Cómo quiero que trabajes (léelo primero)

- Trabaja sobre lo que existe; no lo rehagas desde cero. El código es JavaScript sin framework y tiene pruebas automáticas.
- Lo que me devuelvas tiene que poder integrarse tal cual. Formatos que sirven:
  - **Biblioteca / investigación de destinos:** archivos `biblioteca/investigacion/<zona>.mjs` con el formato exacto de la sección 7 (hay ejemplos completos en el zip: `roma.mjs`, `toscana.mjs`, `puglia-salento.mjs`).
  - **Diseño / estética:** cambios concretos de CSS (variables de `:root` y clases de `src/app/head.html`), SVG, o maquetas en HTML estático que usen las mismas clases.
  - **Código:** archivos completos o parches sobre los archivos reales, indicando la ruta.
  - **Textos de la app:** en español de España, tuteo en plural («reservad», «mirad»), directo, sin «¡», sin emojis.
- Reglas del producto que no se pueden romper: sección 9.
- Si algo no lo puedes comprobar (un enlace, un dato), dilo y déjalo fuera. Mejor menos y verdadero.

---

## 1. Qué es Zaino

Web (PWA, se instala en el móvil) para organizar viajes en grupo de gente joven (universitarios, Erasmus, 20–30 años) en España.

1. Quien organiza crea el viaje y pasa un enlace por WhatsApp.
2. Cada persona responde unas 20 preguntas desde su móvil, sin registrarse (2–4 minutos, casi todo de un toque).
3. Zaino propone **tres destinos** que encajan al grupo (mejor equilibrio, el más barato, la sorpresa) con % de compatibilidad explicado, % por persona, coste orientativo, quién cede en qué.
4. Cada uno vota; la organizadora elige.
5. Zaino monta el **itinerario día a día** con sitios reales, horas orientativas, trayectos, paradas, comidas típicas y noches.
6. Después el grupo usa la app para **reservar** (enlaces con fechas y personas ya puestas), **gastos** (tipo Tricount, al céntimo), **lista compartida** y una **tarjeta** para stories.

- Destinos: solo Italia por ahora, 23 zonas. Preparado para añadir países con el mismo esquema.
- Negocio previsto: comisión por afiliación en los enlaces de reserva (vuelos, alojamiento, tours, trenes, barcos). Aún sin ningún programa de afiliados dado de alta.
- Público: España. Idioma: español.

---

## 2. Estado actual (honesto)

| Pieza | Estado |
|---|---|
| Web pública | https://zaino.mblascoflor.workers.dev (Cloudflare). **Lleva la versión del 11/11** (itinerario antiguo). Hay que subir el zip nuevo. |
| Versión de prueba más nueva | Artefacto «Zaino beta» en Claude (privado de Mateu, versión 4 del 14/11): itinerario nuevo con horas, trayectos, paradas y opiniones. |
| Servidor | Supabase (UE, Estocolmo): base de datos, sesiones anónimas, tiempo real, función `motor`. Funciona. |
| Asistente «Pregúntale a Zaino» | Hecho y probado con modelo simulado; **apagado** (falta clave de un proveedor; la idea es Gemini con clave gratis de Google AI Studio). |
| Precios en tiempo real | No hay. Los costes son orientativos (dormir y comer). Vuelos/tours sin precio. |
| Pruebas | Todas pasan (sección 10). Nunca probado con un grupo real de varias personas a la vez con sus móviles. |

Lo más reciente que se trabajó (por la crítica de un amigo: «el itinerario está fatal, pocos planes, desordenado, poco específico»):
- Motor de itinerarios nuevo (m5) — sección 5.
- Biblioteca ampliada de 429 a 756 planes y 589 paradas concretas — sección 6.
- Investigación con fuentes reales (Civitatis, blogs, TripAdvisor, dónde comer) de 5 zonas; faltan 18 — sección 7.
- Pantalla «Día a día» rehecha — sección 4.

---

## 3. Recorrido de la app, pantalla a pantalla

1. **Inicio** — «Mis viajes», crear o unirse.
2. **Crear viaje** — nombre, integrantes, destino (libre / varios a elegir / uno fijo), fechas (fijas, un mes o abiertas), días, presupuesto orientativo, observaciones.
3. **Compartir** — enlace con token largo + mensaje listo para WhatsApp. Con solo el código del viaje no se entra. Se puede cambiar el enlace (el viejo deja de funcionar).
4. **Entrar con el enlace** — eliges tu nombre de la lista o escribes uno nuevo. Sin registro.
5. **Preguntas** (una por pantalla, barras de progreso tipo stories, respuestas como pegatinas): origen; fechas que te van; hasta 3 prioridades; algo innegociable; clima; duelos («amanecer o último bar», «museo o mercado»); cuánto andar; noches; coche; **deslizar planes reales** (sí / no / imprescindible); ritmo; madrugar; dónde dormir; comida; dieta; capricho; qué te agobia; presupuesto ideal y máximo (privado); nota libre. Se guarda el progreso.
6. **Propuestas** — tres fichas con % y fórmula, % por persona, coste con fuentes y lo que no se sabe, planes que unen al grupo, pros, contras, quién cede, dudas. Provisionales hasta que responden todos. Votos en directo.
7. **Viaje elegido**, con pestañas:
   - **Resumen**: por qué este destino, cuándo, base, cómo moverse, lo de cada uno, «el viaje en N días», cómo llega cada uno, eventos de ese mes, lo que ha puesto cada uno.
   - **Día a día**: ver sección 4.
   - **Grupo**: quién ha respondido, gestionar integrantes, volver a las propuestas.
   - **Lista**: checklist compartida con sugerencias según el plan.
   - **Tarjeta**: imagen para stories con el dibujo del destino (descargable).
8. **Reservas** — por pasos: llegar → dormir → moverse → planes con entrada → otros. Tarjeta «Lo siguiente» con un botón grande que abre la búsqueda (Skyscanner, Booking, etc.) con fechas y personas puestas. Estados: «ya está», «me encargo yo», «no hace falta». Nunca dice «reservado» si no lo está.
9. **Gastos** — apuntar quién pagó qué; reparto exacto al céntimo y «quién paga a quién».
10. **Perfil** — nombre, foto, mis viajes, privacidad, «borrar todos mis datos».

Capturas de casi todo en `capturas/` dentro del zip.

---

## 4. Pantalla «Día a día» (lo último)

Para cada día:
- Cabecera: «DÍA N», fecha, título real («Polignano a Mare y Monopoli», «Excursión a Siena», «Rumbo a Gallipoli»), chip «Día de Ana y Pol» (a quién le encaja más).
- Chips: «Dormís en X», «Excursión ≈ 50 km · ver ruta», nº de planes, «2 con reserva».
- Arriba del todo: «Dónde dormís» si hay varias bases (noches 1–3 en Bari, 4–6 en Gallipoli) y un índice de días.
- Cada hueco del día con **hora orientativa** (9:45, 13:15, 15:00, 20:30, 22:30; «Atardecer» para los planes de puesta de sol; en días de llegada o traslado, sin hora hasta la cena).
- Entre planes, una línea de **trayecto**: «≈ 1,2 km a pie · unos 15 min · ver ruta» (Google Maps con origen y destino).
- Cada plan: descripción, **paradas numeradas** con su mapa (p. ej. Lecce: Porta Napoli → Piazza del Duomo → anfiteatro → Santa Croce), coste (gratis/bajo/medio/alto), duración, «Reservar antes», «Con coche», consejo, por qué está («El plan de Pol: le tira playa»), botones Web / Mapa / Opiniones (búsqueda en TripAdvisor).
- Comidas: plato típico del sitio donde estáis («Orecchiette con cime di rapa — dónde: trattorias de Bari Vecchia»), o «Comer en Polignano» con platos para pedir si es un sitio de paso, o «a vuestro aire».
- Al final: «Vuelta al alojamiento ≈ X km», «+ Añadir un plan», «Todo el día en el mapa».
- Editable por cualquiera del grupo (cambiar, mover, quitar, añadir) y se ve en directo en los otros móviles.

**Lo que aún falta en esta pantalla**: enseñar los enlaces de Civitatis de cada plan, los restaurantes concretos con dirección y los consejos de blogs (están investigados para 5 zonas pero no conectados), y fotos (no hay ninguna foto: todo es ilustración propia).

---

## 5. Cómo decide (motores)

### 5.1 Compatibilidad del grupo (`src/core/compat.js`)
- **Restricciones duras** en código: presupuesto máximo de cada persona, temporada, coche imprescindible sin conductor, lo innegociable. Los destinos que fallan salen en «Descartados» con el motivo.
- **Satisfacción por persona** (0–100): lo que pide (perfil por ejes: mar, montaña, ciudad, campo, fiesta, calma, cultura, gastronomía, naturaleza, playa, aventura, postal) frente a lo que ofrece la zona en esas fechas, más clima y planes que le gustaron al deslizar.
- **Compatibilidad del grupo** = 0,6 × media + 0,4 × la persona que menos encaja, ± ajustes de temporada y logística. Protege a quien peor sale.
- Presupuestos y fechas posibles de cada persona son **privados**: van en otra tabla, solo los lee el servidor y solo devuelve agregados («una persona no puede en julio», sin decir quién).

### 5.2 Itinerario (`src/core/engine.js`, versión «m5»)
1. Filtra los planes que se pueden hacer (temporada, coche).
2. Puntúa cada plan para el grupo: gustos de cada uno, «imprescindible» marcado al deslizar (+mucho), lo imprescindible de la zona (`icono`, +2,2), presupuesto, ritmo, noche, dieta (nada de vino si alguien no bebe), etc.
3. Agrupa los planes en **lugares** por cercanía (≤ 6 km).
4. Prueba secuencias de **bases** (1 base si ≤ 3 días, hasta 2 si ≤ 6, hasta 3 si más) y simula el viaje entero; se queda con la mejor (cambiar de base penaliza).
5. Cada día: llegada / normal / traslado / último día. Un día normal es o una excursión de día completo, o mañana (≤ 4 h) + comida + tarde (≤ 4 h) + merienda + aperitivo/atardecer + cena + noche. Nº de planes según ritmo (2/3/4). Excursiones lejanas solo si llenan el día (> 45 km necesita ≥ 5 h de contenido).
6. Comidas: platos típicos de la zona, colocados en el día en que estáis donde son típicos; si estáis lejos, «Comer en X» con sugerencias.
7. Noches: zonas de noche de la biblioteca o planes nocturnos a ≤ 8 km; aperitivo antes de cenar; atardecer sin hora fija.
8. `cronograma()` saca horas orientativas y trayectos (a pie 14 min/km; coche 10 + 1,1 min/km; transporte 10 + 3 min/km si < 5 km, si no 20 + 0,9).
- Prueba de estrés: 966 planes generados (23 zonas × coche × ritmo × nº personas), 0 errores, 14 ms de media.
- Límite real: con ~30 planes por zona, en viajes de 7–10 días aún quedan algún día flojo. Más contenido = mejores días.

---

## 6. La biblioteca (contenido)

`public/biblioteca.json` (se genera con `node biblioteca/construir.mjs` a partir de `biblioteca/zonas/*.json`, `geo/`, `costes/`, `extra/` e `investigacion/`). Versión **v17**.

| Dato | Cantidad |
|---|---|
| Zonas | 23 |
| Planes (actividades) | 756 (429 originales con fuente + 327 añadidos el 13/11 **sin fuente**, marcados `extra:true`) |
| Paradas concretas dentro de planes | 589 |
| Imprescindibles marcados | 115 |
| Platos típicos | 188 |
| Zonas de noche | 74 |
| Eventos | 91 |
| Opciones de alojamiento | 128 |

Zonas y nº de planes: toscana 31, roma 30, napoles 30, costa-amalfitana 31, veneto-venecia 31, sicilia 40, cerdena 36, dolomitas 36, puglia-salento 35, liguria-cinque-terre 32, umbria 29, emilia-romana-gastronomica 32, piamonte 30, lagos-del-norte 36, basilicata-matera 31, calabria 32, lombardia-milan 34, friuli-venezia-giulia 32, abruzos 34, molise 29, valle-de-aosta 34, marcas 35, trento 36.

Esquema completo de una zona: `biblioteca/SCHEMA.md`. Campos de un plan:
`id, nombre, donde, base, tipo (cultura|gastronomia|naturaleza|playa|fiesta|aventura|bienestar|compras|postal|agua|musica), tipos_extra, duracion (1h|2h|medio_dia|dia_completo), momento (manana|tarde|noche|cualquiera), coste (gratis|bajo|medio|alto), requiere_coche, requiere_reserva, esfuerzo, ambiente, meses, descripcion, consejo, enlace, enlace_tipo (oficial|reserva|mapa), maps, fuente, geo [lat,lon], paradas [{nombre, geo, nota, maps}], icono, extra`.

Puntos débiles de la biblioteca (trabajo para ti):
- Los 327 planes `extra` son sitios reales y conocidos, pero sin fuente; sus coordenadas no se han comprobado con un servicio de mapas (solo coherencia con los datos existentes).
- Enlaces de casi todos los planes = búsqueda en Google Maps; faltan webs oficiales y enlaces de reserva.
- Sin fotos.
- Faltan costes de alojamiento en Dolomitas, Valle de Aosta, Abruzos, Las Marcas y Molise.
- Solo Italia.

---

## 7. Investigación con fuentes (en curso)

Carpeta `biblioteca/investigacion/`. Un archivo por zona. Hechas: **puglia-salento, roma, toscana**, y **napoles-amalfi** (sin repartir aún en `napoles.mjs` y `costa-amalfitana.mjs`). Faltan 18 zonas. Las instrucciones completas para investigar una zona están en `INSTRUCCIONES-AGENTES.md` (mismo zip).

Fuentes que se leen: Civitatis de cada ciudad (títulos y URLs exactos), 2–4 blogs en español (mochileandoporelmundo, conociendoitalia, viajeroscallejeros, elviajedesofi, voyagetips…) y en italiano para comida (gamberorosso, scattidigusto), TripAdvisor, webs oficiales.

Formato (obligatorio para que se pueda integrar):
```js
import { N, VERANO, TEMP } from '../extra/_h.mjs';
const C = 'https://www.civitatis.com/es/';
export const F = { 1: 'url fuente 1', 2: 'url fuente 2' };                       // fuentes numeradas
export const enlaces = { 'id-del-plan': [['Civitatis','Título exacto', C+'ciudad/slug/','2 h']] }; // reservas reales
export const consejos = { 'id-del-plan': 'Consejo práctico concreto.' };
export const fuentesAct = { 'id-del-plan': [1, 2] };
export const rutas = [ ['Nombre del recorrido', ['id1','id2','id3']] ];          // orden de la guía
export const sitios = [ ['Pueblo','Nombre exacto','trattoria','Dirección','qué pedir',[n]] ]; // dónde comer
export const nuevas = [ N(id, nombre, donde, base, tipo, duracion, momento, coste, descripcion, [lat,lon], [['Parada', lat, lon, 'nota']], {coche, reserva, meses, esfuerzo, tipos, consejo}) ];
```
Ejemplo real de lo conseguido en Puglia: 18 planes con tours reales de Civitatis (barco por las cuevas de Polignano, free tour de Bari, tour gastronómico, clase de orecchiette…), consejos («Alberobello a primera hora; de noche con los trulli iluminados hay menos gente; desde Bari, Trulli Link tren+bus»), 17 sitios para comer con dirección (Panificio Fiore, Strada Palazzo di Città 38 — focaccia barese…), 5 planes nuevos (Cisternino, Leuca, Baia dei Turchi…).

Para que sirva en la app falta (lo haría Claude): que `construir.mjs` meta estos archivos en la biblioteca y que el día a día enseñe los enlaces de reserva, los consejos con su fuente, los sitios para comer y las rutas.

---

## 8. Diseño y estética

Concepto: **«Cartolina»** — postal de papel claro y tinta marrón; el color lo pone cada destino con **tres tintas planas**, con la segunda tinta desplazada como un fallo de registro de imprenta. Mecánica de feed vertical tipo stories: una pregunta por pantalla, barras segmentadas, enunciados en bloques tipo subtítulo, respuestas como pegatinas.

Tokens (`src/app/head.html`, `:root`):
```
--teal #4EAAA0 (acción, botones)   --teal-d #2F7F77
--sol #EFC65B (acento)             --coral #F47762 (lo destacado, señal)
--uva #754A77                      --marron #30231F (tinta, bordes, texto)
--paper #FBF4E6 (fondo)            --card #FFFDF8   --chip #F3E8D3   --line #E6DAC6   --ink2 #6E5D55
Modo oscuro: --paper #1B1411, --ink #F7EEE2, --card #261D19, --chip #33271F …
```
Tipografías (Google Fonts):
- **TikTok Sans** (variable, anchura 75–150): todo el texto; titulares en `.d` = 900, condensada al 75 %, MAYÚSCULAS, interlineado 0,88.
- **Bodoni Moda** cursiva (`.a`): toques editoriales.
- **IBM Plex Mono** (`.m`, `.lab`): etiquetas, horas, datos, 11,5 px en mayúsculas espaciadas.

Componentes: botones con borde de 2 px marrón y **sombra dura desplazada** (3px 3px 0) que se hunde al pulsar; tarjetas `.card` con borde; `.chip`/`.pill`; `.slot` de plan (comida con fondo chip y borde discontinuo; libre transparente); `.day` con línea vertical y punto de color de la zona; `.tramo` con borde izquierdo discontinuo; `.ticket`; barra inferior de pestañas; hojas que suben desde abajo (`hoja`); toasts.

Logo (`src/app/marca.js`): la **Z convertida en flecha blanca con un sol amarillo**, sobre baldosa turquesa redondeada; palabra «ZAINO» en TikTok Sans condensada.

Ilustración (`src/core/art.js`): **todo dibujado en SVG por código**, sin fotos ni imágenes externas. Cada zona tiene su escena (colinas y cipreses en Toscana, volcán en Nápoles, laguna en Venecia…) con sus tres tintas (`inks`) y fondo (`bg`) definidos en `src/core/data.js`, y un «cromo» (objeto protagonista). La tarjeta para stories se genera en canvas con esa escena.

Cosas de diseño que se pueden mejorar (ideas, no decididas): la pantalla «Día a día» es larga y densa (unos 7.000 px en móvil para 5 días); faltan fotos o miniaturas de los sitios; jerarquía visual entre plan principal y secundario; vista de mapa del día; vista de «hoy» durante el viaje; onboarding de quien recibe el enlace; estados vacíos.

---

## 9. Reglas del producto (no negociables)

1. Nunca inventar precios, fechas, horarios, sitios ni enlaces. Todo enlace abre algo real.
2. No presentar nada como reservado o confirmado si no lo está.
3. En pantalla no aparecen las palabras «IA», «inteligencia artificial» ni «algoritmo».
4. No decir cuántos destinos hay (debe sentirse que puede salir cualquier sitio).
5. Sin registro para los participantes.
6. No simular funciones que no existen.
7. Presupuesto y fechas de cada persona: privados, nunca se muestran a otros, ni a la organizadora.
8. Sin gasto mensual por ahora (todo en planes gratuitos).
9. Claves secretas solo en el servidor; en la web solo la URL y la clave pública de Supabase.
10. Códigos de afiliado: no inventarlos; se configuran cuando existan.

---

## 10. Técnica

```
src/core/   data.js (metadatos por zona), engine.js (biblioteca normalizada, puntuación, itinerario m5, cronograma, reservas, reparto),
            compat.js (compatibilidad y propuestas), servidor.js (lo que corre en el servidor), art.js (ilustraciones SVG)
src/app/    app.js (todas las pantallas, ~1.300 líneas), store.js (datos: Supabase / modo prueba en navegador / modo artefacto),
            head.html (estilos), marca.js (logo), local-db.js (base de datos simulada), sw.js (service worker)
supabase/   migrations/ (tablas, reglas RLS, funciones SQL seguras), functions/motor y functions/zaino-ia (Deno)
biblioteca/ zonas/, geo/, costes/, extra/, investigacion/, construir.mjs, SCHEMA.md
tools/      build.mjs (genera dist/ para Cloudflare y dist-artefacto/), funciones.mjs, desplegar.mjs, iconos.cjs
tests/      motor (23), ia (12), sql_rls (26), sql_biblioteca (1), funciones Deno (16), e2e Playwright: escenarios (30), supabase_e2e (27), run_groups (4 grupos completos)
docs/       ARQUITECTURA, DECISIONES, DESPLIEGUE, PRUEBAS, SIN-INSTALAR-NADA
```
- JavaScript sin framework. El mismo núcleo corre en el navegador y en la función del servidor.
- Tablas Supabase: `viajes`, `miembros`, `respuestas`, `respuestas_privadas`, `resultados`, `gastos`, `lista`, `ia_uso`. Funciones SQL: crear viaje, vista previa de invitación, unirse, modificar viaje, quitar integrante, salir, cambiar enlace, borrar mis datos.
- La función `motor` descarga el núcleo y la biblioteca de la web al arrancar (`ZAINO_ORIGEN`).
- Asistente `zaino-ia`: herramientas sobre la biblioteca; admite Gemini, Anthropic u OpenAI; límite diario por viaje; sin desplegar.
- Para actualizar la web: `node tools/build.mjs` y subir `dist/` a Cloudflare (proyecto `zaino`).

---

## 11. Pendientes, por orden

1. **Investigación de las 18 zonas que faltan** (formato sección 7) y repartir `napoles-amalfi.mjs`.
2. **Integrar la investigación** en la biblioteca y en el día a día (reservas Civitatis por plan, restaurantes con dirección, consejos con fuente, rutas).
3. **Comprobar los 327 planes sin fuente**: buscarles fuente/web oficial o quitarlos.
4. **Subir la versión nueva a Cloudflare** y reiniciar la función `motor` en Supabase.
5. **Probar con un grupo real** (varios móviles a la vez).
6. **Gemini** para personalización (clave gratis de Google AI Studio en los secretos de Supabase).
7. **Afiliación y precios del día**: Travelpayouts/Aviasales (vuelos, datos de precios cacheados), Viator o GetYourGuide (tours con precio y disponibilidad), Civitatis (enlaces), Booking/Omio/FlixBus/Ferryhopper (enlaces). Requiere que Mateu se dé de alta. Amadeus cerró su API gratuita en 2026.
8. Textos legales (privacidad, aviso legal, cookies), avisos a quien no ha respondido, estadísticas de uso, captcha en el acceso anónimo, dominio propio, más países.

---

## 12. Qué te pediría ahora (ideas para empezar)

- **Biblioteca:** investiga una zona de las que faltan (p. ej. `veneto-venecia`) siguiendo `INSTRUCCIONES-AGENTES.md` y devuélveme el archivo `.mjs`.
- **Diseño:** propón una versión más clara y menos larga de la pantalla «Día a día» (maqueta HTML con las clases y tokens actuales; mira `capturas/g4-11-dias.png`).
- **Estética:** revisa la identidad (logo, tipografías, paleta, ilustraciones) y propone mejoras concretas en CSS/SVG.
- **Producto:** qué quitarías, qué falta para que un grupo real lo use de principio a fin, y cómo ganar dinero con la afiliación sin romper las reglas de la sección 9.
