# Cómo investigar un destino para Zaino

Zaino es una app española para planear viajes en grupo de gente joven (20–30 años). Cada destino (zona) tiene planes en la biblioteca.
Tu trabajo: investigar en la web y escribir `biblioteca/investigacion/<zona>.mjs` con información REAL y COMPROBADA.

## 1. Mira qué planes hay ya
`node /tmp/claude-0/-home-claude/ed8fa68d-a8c1-5305-988e-03ad82a14555/scratchpad/lista.cjs <zona>`
imprime cada plan como `id | nombre | donde | tipo duración momento | lat,lon`. Usa esos `id` en `enlaces`, `consejos`, `fuentesAct` y `rutas`.

## 2. Fuentes que tienes que leer (WebSearch para encontrarlas, WebFetch para leerlas)
- Civitatis: `https://www.civitatis.com/es/<ciudad>/` (y página 2, y las ciudades cercanas de la zona). Copia títulos y URLs EXACTOS tal como salen enlazados en la página.
- GetYourGuide o Viator si Civitatis no tiene algo (URLs exactas vistas en la página).
- 2–4 blogs/guías en español (mochileandoporelmundo.com, conociendoitalia.com, viajeroscallejeros.com, elviajedesofi.com, voyagetips.com/es, losviajeros…) y, si sirve, italianos (gamberorosso.it, scattidigusto.it, doeatbetterexperience.com) para «qué ver», itinerarios por días y «dónde comer barato».
- TripAdvisor (si la página carga) para el ranking de qué ver.
- Webs oficiales de los sitios importantes (museos, parques, ferris) para el enlace oficial.
- Tendencias: sitios que los blogs llamen «de moda», «instagrameables», virales.

## 3. Reglas (obligatorias)
- NUNCA inventes una URL: solo URLs que hayas visto en una página o en un resultado de búsqueda.
- NUNCA pongas precios ni horarios exactos (cambian). Sí puedes decir «de pago», «gratis», «cierra los lunes (comprobadlo)», «reservad con antelación».
- No inventes restaurantes: solo sitios con nombre que salgan en una fuente, con su dirección si la fuente la da.
- Cada consejo y cada sitio para comer lleva el número de su fuente.
- Español de España, tono directo y cercano, frases cortas. Nada de «¡», nada de emojis, nada de «IA».
- Coordenadas de planes nuevos: solo si estás seguro del sitio (latitud y longitud con 3–4 decimales); si dudas, pon las del centro del pueblo.

## 4. Formato del archivo (ejemplos completos: `roma.mjs`, `toscana.mjs`, `puglia-salento.mjs` en esta carpeta — léelos antes)
```js
import { N, VERANO, TEMP } from '../extra/_h.mjs';
const C = 'https://www.civitatis.com/es/';
export const F = { 1: 'url de la fuente 1', 2: '...' };
export const enlaces = { 'id-del-plan': [['Civitatis','Título exacto', C+'ciudad/slug/','2 h'], ['Web oficial','Nombre','https://...','']] };
export const consejos = { 'id-del-plan': 'Consejo práctico concreto.' };
export const fuentesAct = { 'id-del-plan': [1, 2] };
export const rutas = [ ['Nombre del recorrido de un día', ['id1','id2','id3']] ];   // en el orden que propone la guía
export const sitios = [ ['Pueblo','Nombre exacto','trattoria|pizzeria|osteria|street|panaderia|pasteleria|gelateria|bar|mercado','Dirección o ""','qué pedir',[n]] ];
export const nuevas = [ N(id, nombre, donde, base, tipo, duracion, momento, coste, descripcion, [lat,lon], paradas, {opciones}) ];
```
- `N(...)`: `base` = id de una base de la zona (sale en la primera línea de lista.cjs). `tipo` ∈ cultura, gastronomia, naturaleza, playa, fiesta, aventura, bienestar, compras, postal, agua, musica. `duracion` ∈ '1h','2h','medio_dia','dia_completo'. `momento` ∈ 'manana','tarde','noche','cualquiera'. `coste` ∈ 'gratis','bajo','medio','alto'. `paradas` = `[['Nombre', lat, lon, 'nota corta opcional'], ...]` o `[]`. Opciones: `{coche:true, reserva:true, meses:VERANO, esfuerzo:'medio', tipos:['compras'], consejo:'...'}`.
- No repitas como `nueva` un plan que ya existe (mira la lista).
- Objetivo por zona: 15–40 enlaces de reserva bien asignados, 8–15 consejos, 10–25 sitios para comer, 1–4 rutas, 3–10 planes nuevos (sobre todo lo que esté de moda o que los blogs recomienden y falte).

## 5. Comprueba antes de acabar
`node -e "import('/home/claude/zaino-app/biblioteca/investigacion/<zona>.mjs').then(m=>console.log(Object.keys(m.enlaces).length, m.nuevas.length, m.sitios.length))"`
y que todos los ids de `enlaces`, `consejos`, `fuentesAct` y `rutas` existan en lista.cjs o en tus `nuevas`.
No toques ningún otro archivo del proyecto.
