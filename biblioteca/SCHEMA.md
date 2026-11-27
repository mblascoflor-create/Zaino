# Biblioteca de contenido v2 — esquema por zona (una zona = un archivo `/home/claude/sprint/lib/zonas/<id>.json`)

App: viajes en grupo para universitarios/Erasmus (20-25 años, presupuesto ajustado), Italia + cómo llegar desde España.
Un motor determinista (sin texto generado) construye el itinerario SOLO con lo que haya en este JSON: todo lo que
escribas aquí puede acabar literalmente en pantalla, con su enlace. Fecha de hoy: 10 de noviembre de 2026.

## Reglas duras (si dudas, déjalo fuera)
1. NADA inventado: ni precios exactos, ni horarios, ni fechas, ni locales, ni enlaces de afiliado. Costes solo categóricos.
2. Cada `enlace`/`fuente` tiene que abrir algo real. Vale como verificado SOLO si (a) lo abriste con la herramienta de
   fetch y cargó el sitio correcto, o (b) apareció tal cual como URL de un resultado de búsqueda web en esta sesión.
   Si no puedes verificar una URL concreta, usa uno de los PATRONES SEGUROS de abajo (siempre abren una página real).
   Nunca adivines rutas internas de una web (p. ej. `/es/visita/horarios`): usa la portada verificada del dominio oficial.
3. No uses curl/wget/python para abrir webs: solo las herramientas de búsqueda/fetch web. Si un dominio está bloqueado, no lo fuerces.
4. Nada de locales concretos de moda (bares/restaurantes) salvo instituciones estables con web oficial verificada
   (mercados municipales, cafés históricos centenarios, bodegas visitables). Para comida, di QUÉ plato y EN QUÉ barrio/tipo de sitio.
5. Eventos: hoy es noviembre de 2026, así que no sirven fechas de 2026 ya pasadas. Describe el evento como RECURRENTE
   ("cada año, 2 de julio y 16 de agosto", "primer fin de semana de septiembre", "julio, fechas en la web oficial").
   Solo pon `proxima_fecha` (AAAA-MM-DD) si una fuente oficial publica ya la fecha de 2027 (o de dic-2026). Si no, `null`.
6. Texto en español de España, tuteo en plural ("subid", "reservad"), frases cortas y concretas, sin relleno turístico.
   Prohibido escribir "IA", "algoritmo", "inteligencia artificial".
7. Conserva lo ya verificado en la biblioteca actual (`/home/claude/sprint/backup/biblioteca-contenido-italia-v73.json`,
   clave `zonas`, busca por `id`): rutas aéreas con fuente, operadores de alquiler de coches con su enlace, FlixBus, ferry,
   Roadsurfer, eventos con fuente oficial, redes sociales verificadas. Reestructúralo al esquema nuevo; no lo pierdas.

## Patrones seguros de enlace (constrúyelos tú; codifica bien la query)
- Mapa de cualquier sitio: `https://www.google.com/maps/search/?api=1&query=<Nombre+del+sitio%2C+Localidad%2C+Italia>`
- Alojamiento: `https://www.booking.com/searchresults.es.html?ss=<Localidad>` · Hostelworld SOLO si verificas la URL de ciudad
  (búscala: "hostelworld <ciudad>") · Airbnb: `https://www.airbnb.es/s/<Localidad>--Italia/homes`
- Actividades de pago: `https://www.getyourguide.es/s/?q=<consulta>` · Civitatis SOLO con URL de ciudad verificada.
- Trenes Italia: `https://www.trenitalia.com/` y `https://www.italotreno.com/es` (portadas) · ruta puerta a puerta:
  `https://www.rome2rio.com/es/map/<Origen>/<Destino>` (p. ej. `/map/Pisa/Florencia`).
- Vuelos: NO construyas enlaces de vuelos; la app los genera sola a partir de los códigos IATA. Tú da IATA correctos.
- Web oficial de turismo/museo/parque/evento: la portada del dominio verificado (o la página concreta si la abriste).

## Esquema (todas las claves obligatorias salvo las marcadas opcional)
```jsonc
{
  "id": "toscana",                      // el id que se te asigna, no lo cambies
  "nombre": "Toscana",
  "nombre_corto": "Toscana",            // ≤ 14 caracteres, para la tarjeta de stories
  "lema": "Colinas, vino y Renacimiento", // ≤ 42 caracteres, con gancho, sin tópicos vacíos
  "descripcion": "1-2 frases: qué tiene de especial para un grupo de 20-25 años.",
  "perfil": {  // 0-3: cuánto destaca la zona en cada eje (3 = de lo mejor de Italia). Sé exigente: no todo es 3.
    "mar":0,"montana":0,"ciudad":0,"campo":0,          // paisaje
    "fiesta":0,"calma":0,                               // ambiente
    "cultura":0,"gastronomia":0,"naturaleza":0,"playa":0,"aventura":0,"postal":0  // intereses
  },
  "nivel_precio": "bajo|medio|alto",   // coste turístico relativo dentro de Italia para un estudiante
  "nivel_precio_nota": "por qué (1 frase)",
  "meses": { "ideales":[4,5,6,9,10], "aceptables":[3,7,11], "evitar":[8], "nota":"por qué" }, // números de mes
  "calor_verano": "suave|alto|extremo",
  "nieve_invierno": false,              // true si en dic-mar hay nieve/esquí como plan real
  "coche": {
    "necesidad": "imprescindible|util|innecesario",
    "nota": "1-2 frases honestas (ZTL, aparcamiento, carreteras, cuándo compensa)",
    "aeropuerto_recogida": "PSA",
    "operadores": [ { "nombre":"Hertz", "enlace":"...", "fuente":"..." } ]   // los ya verificados + los que verifiques
  },
  "bases": [   // 2-4 sitios donde dormir. La primera = la mejor base para un grupo sin coche.
    { "id":"florencia", "nombre":"Florencia", "por_que":"1 frase", "sin_coche":true,
      "ambiente":"fiesta|mixto|calma", "maps":"<patrón mapa>" }
  ],
  "llegar": {
    "aeropuertos": [ { "iata":"PSA", "nombre":"Pisa – Galileo Galilei", "ciudad":"Pisa",
                       "a_la_base":"cómo llegar del aeropuerto a la base principal (medio y tiempo aproximado si la fuente lo da)" } ],
    "desde_espana": "2-3 frases honestas: qué compañías low cost suelen volar y desde dónde, sin prometer horarios.",
    "rutas_directas": [ { "origen":"Barcelona", "origen_iata":"BCN", "destino_iata":"PSA", "aerolinea":"Ryanair",
                          "nota":"estacional/todo el año si lo sabes", "fuente":"url" } ],  // solo las verificadas con fuente
    "desde_italia": "1-2 frases: cómo llegar en tren/bus desde Bolonia, Milán o Roma (para quien ya está de Erasmus en Italia).",
    "novedades": [ { "nota":"...", "fuente":"url" } ]   // opcional
  },
  "moverse": {
    "resumen": "2 frases: cómo se mueve un grupo aquí con y sin coche",
    "tren":  { "nota":"...", "enlace":"..." },                       // null si no aplica
    "bus":   { "operador":"...", "nota":"...", "enlace":"...", "fuente":"..." },  // local/regional o FlixBus; null si no aplica
    "ferry": [ { "operador":"...", "ruta":"...", "nota":"...", "enlace":"...", "fuente":"..." } ],  // [] si no aplica
    "camper":{ "operador":"...", "nota":"...", "enlace":"...", "fuente":"..." }   // null si no aplica
  },
  "actividades": [   // 14-20. Es lo más importante del archivo.
    {
      "id": "uffizi",                    // slug único dentro de la zona
      "nombre": "Galería Uffizi",
      "donde": "Florencia",              // localidad real
      "base": "florencia",               // id de la base desde la que se hace más cómodo
      "tipo": "cultura",                 // cultura|gastronomia|naturaleza|playa|fiesta|aventura|bienestar|compras|postal|agua|musica
      "tipos_extra": ["postal"],         // 0-2 más
      "duracion": "2h|medio_dia|dia_completo",
      "momento": "manana|tarde|noche|cualquiera",   // mejor franja ("noche" = atardecer en adelante)
      "coste": "gratis|bajo|medio|alto", // gratis; bajo ≈ entrada/transporte barato; medio ≈ tour o entrada cara; alto ≈ actividad premium
      "requiere_coche": false,           // true SOLO si sin coche es impracticable en un día
      "requiere_reserva": true,          // true si conviene reservar con antelación (aforo, entradas con hora)
      "esfuerzo": "bajo|medio|alto",     // físico
      "ambiente": "social|tranquilo|mixto",
      "meses": [5,6,7,8,9],              // opcional: solo si es estacional (playa, esquí, rutas de alta montaña)
      "descripcion": "1 frase concreta: qué se hace y por qué mola.",
      "consejo": "opcional: 1 consejo práctico verificable (p. ej. 'primer domingo de mes gratis' SOLO si lo verificas)",
      "enlace": "web oficial verificada, o getyourguide/mapa con patrón seguro",
      "enlace_tipo": "oficial|reserva|mapa",
      "maps": "<patrón mapa>",
      "fuente": "url donde verificaste que existe y qué es"
    }
  ],
  "comida": [   // 6-9 platos/productos típicos reales
    { "plato":"Lampredotto", "que_es":"bocadillo de callos, el street food de Florencia",
      "estilo":"street|trattoria|mercado|dulce|bebida", "coste":"bajo|medio|alto",
      "donde_probarlo":"puestos (trippai) del Mercato Centrale y Sant'Ambrogio",
      "maps":"<patrón mapa del mercado/barrio>", "fuente":"url" }
  ],
  "noche": [    // 2-4 zonas reales para salir o tomar algo
    { "zona":"Santo Spirito", "base":"florencia", "plan":"aperitivo|copas|fiesta",
      "descripcion":"1 frase", "maps":"<patrón mapa>", "fuente":"url" }
  ],
  "alojamiento": [   // 4-6, repartidos entre las bases
    { "tipo":"hostel|apartamento|hotel|agriturismo|rifugio|camping|bnb", "base":"florencia",
      "coste":"bajo|medio|alto", "para":"para qué grupo encaja (1 frase)",
      "enlaces":[ {"sitio":"Booking","url":"..."}, {"sitio":"Hostelworld","url":"..."} ] }
  ],
  "eventos": [   // 3-5 recurrentes de verdad
    { "nombre":"Palio di Siena", "donde":"Siena", "cuando":"cada año, 2 de julio y 16 de agosto",
      "meses":[7,8], "proxima_fecha": null, "descripcion":"1 frase",
      "enlace":"web oficial verificada", "fuente":"url" }
  ],
  "redes": [ { "nombre":"...", "red":"instagram|tiktok", "url":"...", "verificado_en":"..." } ],  // opcional, solo verificadas
  "notas_honestas": [ "lo que no pudiste verificar o es flojo en esta zona" ]
}
```

## Mínimos de calidad por zona
- ≥14 actividades; de ellas ≥6 con `requiere_coche:false`, ≥4 `gratis` o `bajo`, ≥2 con `momento:"noche"`,
  ≥1 `dia_completo`, y al menos 5 `tipo` distintos (los que la zona tenga de verdad).
- Cada actividad con `descripcion` concreta y `maps`; `enlace` oficial siempre que exista web oficial verificable.
- ≥6 comida (mezcla de `estilo`), ≥2 noche, ≥4 alojamiento, ≥3 eventos, ≥2 bases, ≥1 aeropuerto con IATA correcto.
- `perfil` coherente con el contenido (si pones playa:3, tiene que haber actividades de playa).

## Entrega
1. Escribe cada zona en `/home/claude/sprint/lib/zonas/<id>.json` (UTF-8, JSON válido).
2. Pasa el validador y arréglalo hasta que dé OK: `python3 /home/claude/sprint/lib/validate_zone.py /home/claude/sprint/lib/zonas/<id>.json`
3. Devuelve un informe corto (≤150 palabras por zona): cuántas actividades/comida/eventos, qué enlaces NO pudiste
   verificar y sustituiste por patrón seguro, y qué queda flojo. Sin adornos.
