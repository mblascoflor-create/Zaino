# Decisiones

1. **No reescribir la app en React.** Se mantiene la interfaz en JavaScript sin framework y se cambia solo la capa de datos (`ZSTORE`), que imita la forma de documentos que ya usaban las pantallas. Así gastos, lista, reservas, perfil y tarjeta siguen funcionando sin tocarlos.
2. **Supabase en la UE** como servidor: Postgres con reglas por fila (RLS), sesión anónima para entrar sin registro, tiempo real y funciones en el servidor. Plan gratuito suficiente para empezar.
3. **El motor corre en el servidor** porque necesita los presupuestos y fechas privados. El navegador nunca los recibe; solo ve resultados agregados.
4. **El mismo código del motor en navegador y servidor** (generado por `tools/build.mjs`): una sola fuente de verdad.
5. **Invitación con token largo**, separado del código corto. Saber el código no da acceso.
6. **Fechas privadas**: si alguien no puede, el grupo ve «una persona no puede», no quién. Lo «innegociable» sí es público, porque es una condición del grupo.
7. **Costes**: solo dormir y comer con datos de la biblioteca, como orientativo y con fecha y fuentes. Si falta alojamiento o comida, no se da total. El viaje hasta el destino y las entradas se marcan siempre como desconocidos.
8. **Asistente apagado por defecto** (sin gasto). Proveedor intercambiable por variables de entorno; límite diario por viaje; no aplica cambios sin un toque del usuario; se presenta como «Pregúntale a Zaino».
9. **Hosting**: Cloudflare Pages o Netlify (subida directa de `dist/`). Vercel Hobby no permite uso comercial.
10. **Los viajes de prueba del artefacto de Claude no se migran.** El artefacto queda como demo congelada.
11. **Identidad**: turquesa para las acciones, sol como acento, coral para lo destacado, uva y marrón como tinta. La Z del logotipo es el símbolo (flecha blanca con el sol), no un icono aparte. Las preguntas van sobre tintas claras de la paleta, con letra marrón; con destino fijado conservan los colores del dibujo de la zona.
12. **Cuestionario v2**: «prioridades» (hasta 3) sustituye a «intereses» y «paisaje»; duelos («amanecer o último bar», «museo o mercado») sustituyen a «madrugar» y a la pregunta de ciudad; presupuesto ideal + máximo, privados. Se pueden cambiar las respuestas después.
