# Zaino · viajes en grupo

Cada persona responde unas preguntas desde su móvil (sin registrarse) y Zaino propone destinos que encajan al grupo, explica por qué y monta el plan día a día con sitios reales. Incluye lista compartida, gastos, reservas por confirmar y tarjeta para stories.

- **Probar en local:** `npm run build` y abre `dist/index.html` con un servidor estático (por ejemplo `python3 -m http.server -d dist`). Sin configurar Supabase funciona en «modo prueba» (solo ese navegador).
- **Poner en internet:** [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md)
- **Cómo está hecho:** [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) · [docs/DECISIONES.md](docs/DECISIONES.md)
- **Qué está probado:** [docs/PRUEBAS.md](docs/PRUEBAS.md)

```
src/core/      motor (compatibilidad, plan, servidor) — el mismo en navegador y servidor
src/app/       interfaz, capa de datos, marca, service worker
biblioteca/    destinos, coordenadas y costes (fuente) + construir.mjs
public/        biblioteca.json, iconos, supabase-js
supabase/      migraciones SQL y funciones (motor, zaino-ia)
tests/         pruebas del motor, IA, SQL (RLS) y en el navegador
tools/         build e iconos
```
