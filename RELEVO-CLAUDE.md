# Zaino · Agenda móvil y tarjetas de planes

La base es `ZAINO-Cuaderno-de-viaje.zip`, versión 4 del 23 de noviembre de 2026. Este paquete contiene la aplicación completa y `zaino-agenda-y-postales.patch` para integrar únicamente los cambios de interfaz si tu copia es posterior.

- **Mateu.** Descomprime el ZIP y abre `ZAINO/ABRIR-ZAINO.html`. Es una prueba en un navegador. Para probar con varios móviles se necesita una publicación conectada a Supabase.
- **Claude.** Revisa `git apply --check zaino-agenda-y-postales.patch` desde la raíz de tu código. Si hay solapamientos, integra los cambios de `src/app/app.js`, `src/app/head.html` y `tests/e2e/escenarios.py` sobre tu versión. Después ejecuta `npm ci`, `npm run build` y `npm test`. La versión web compilada queda en `dist/`.
- La agenda abre el día del viaje según la hora de Italia, agrupa las paradas y despliega su detalle al pulsarlas. En el día actual, adelanta la siguiente parada con hora orientativa. El enlace de Maps reúne las actividades con coordenadas. Las alternativas conservan los filtros existentes de precio, distancia y lluvia.
- Cuatro actividades usan fotografías que ya estaban en el proyecto. La correspondencia con cada actividad figura en `FOTOS_PLAN`, junto a `FOTOS_ZONA`. El resto muestra la ilustración de la zona. Los tres botones de voto conservan los gestos y permiten deshacer el voto anterior mientras sigues en el mazo.
- Para la siguiente prueba, completad un día costero de Puglia y uno urbano de Roma con fuentes primarias. Revisad primero la vuelta de noche, el acceso real a playas y los puntos de encuentro de excursiones. Mostrad solo horarios comprobados para la fecha del viaje. A continuación, medid en qué pantalla se abandona el cuestionario antes de decidir qué preguntas recortar.
