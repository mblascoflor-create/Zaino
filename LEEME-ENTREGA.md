# Zaino · Cuaderno de viaje

Abre **ABRIR-ZAINO.html** con doble clic para probar la versión en tu navegador. Tiene el cuestionario, destinos, itinerario y herramientas de viaje. Funciona en modo prueba y guarda los datos en ese navegador. Para compartir viajes entre móviles se usa la web publicada con Supabase.

## Qué cambia

- Tipografía editorial, tinta verde, fondos claros y modo oscuro. Cuatro fotografías de destino con crédito y licencia, paisajes dentro de las tarjetas de votación y las ilustraciones originales en las postales.
- El itinerario abre un día cada vez. Si estáis de viaje, abre el día de hoy. Paradas, fuentes, restaurantes y controles de edición se despliegan dentro de cada actividad.
- Pasar una tarjeta cuenta en la selección de actividades. Se guarda el progreso mientras se vota. Los planes imprescindibles siguen pesando en el itinerario.
- Las comidas se buscan cerca de la última visita de la mañana y se filtran platos con ingredientes que chocan con las preferencias declaradas. Confirmad ingredientes y trazas con cada local.
- Los trayectos de vuelta a la base se muestran antes de cenar o del aperitivo allí. Las búsquedas de alojamiento cuentan las noches efectivas. Cuando el vuelo vuelve de otro aeropuerto hay enlaces separados para ida y vuelta.
- Los meses y días disponibles se guardan como datos privados. Las propuestas muestran el problema de calendario de forma agregada.
- La biblioteca pasa de 756 a 773 actividades, conserva los identificadores originales e incorpora 100 URLs de visitas comprobadas, 43 sitios con dirección y 9 recorridos. La nueva investigación se centra en Venecia, Bolonia y Turín y se conecta con el material de Roma, Toscana, Puglia, Nápoles y Amalfi.

## Archivos

| Ruta | Contenido |
| --- | --- |
| `ABRIR-ZAINO.html` | Demo local autónoma |
| `dist/` | Web y PWA instalable |
| `src/app/` | Pantallas, diseño y cuestionario |
| `src/core/` | Selección de destinos, itinerario y reservas |
| `biblioteca/investigacion/` | Fichas y fuentes incorporadas a la biblioteca |
| `supabase/migrations/20261122000001_fechas_privadas.sql` | Migración de la disponibilidad de viajes existentes |
| `dist-funciones/` | Funciones y SQL generados |

## Pruebas

- Pruebas automatizadas del motor, asistente simulado, PostgreSQL y biblioteca. La prueba de privacidad comprueba la migración de una respuesta antigua y el rechazo de nuevas fechas públicas.
- Simulación en Chromium de tres estudiantes de Erasmus entre Bolonia y Milán, cada uno en un contexto de navegador separado. Recorre invitación, respuestas, propuestas, voto, elección de Valle de Aosta, navegación de los cinco días, edición desplegable, lista, tarjeta, reservas y gastos con el servidor local de pruebas.
- 1.242 combinaciones de zona, mes, ritmo, coche y duración para comprobar que el itinerario genera los días y referencias esperados.

## Publicación y límites

La publicación vigente de Cloudflare servía la biblioteca v16 durante la revisión. Este paquete contiene v18 y la configuración de prueba. Para actualizar los viajes reales, usa la configuración pública del proyecto, coordina la migración de Supabase con el nuevo cliente y actualiza la función `motor` junto con el contenido de `dist/`. El SQL «todo en uno» está pensado para instalaciones nuevas. Para un proyecto existente, aplica la migración nueva de disponibilidad y conserva las credenciales en el proyecto correspondiente. La función ligera requiere que su origen publique el nuevo núcleo y la nueva biblioteca.

El paquete conserva la PWA web. Quedan por probar un viaje sincronizado en el Supabase de producción y la instalación en Safari de iPhone. Las 100 comprobaciones se hicieron sobre páginas de visitas publicadas. Las fechas y plazas disponibles dependen del proveedor. Sigue pendiente la auditoría de las fichas y enlaces heredados fuera de esa investigación, y de las coordenadas que aún faltan.
