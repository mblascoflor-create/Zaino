# Reglas de la oficina Zaino (para cualquier IA que trabaje aquí)
- main = producción. Cloudflare publica main automáticamente.
- Nadie empuja a main directamente: rama `oficina/<agente>-<tema>` → pull request → tests en verde → el Juez revisa y deja veredicto → si APROBADO, merge (squash).
- Rúbrica del Juez: fallos y mantenimiento 30 %, claridad 20 %, personalización 20 %, estética 15 %, coste 15 %. Aprobado si ≥ 3,5 y tests verdes.
- Prohibido: claves secretas en el repo, gastar dinero, altas en programas de afiliación, cambios de base de datos (migraciones SQL las aplica Mateu).
- Datos privados (presupuesto, fechas) nunca salen al grupo ni a la IA.
- Cada PR: qué cambia, por qué, cómo se ha probado.
