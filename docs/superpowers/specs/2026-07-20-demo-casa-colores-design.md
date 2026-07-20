# Demo Vitrina Express: La Casa de los Colores

**Estado:** aprobado para planificación e implementación.

## Objetivo

Crear una demostración comercial de cuatro secciones para el Plan Vitrina Express. Debe probar que una página única, visualmente distintiva y con alcance cerrado puede explicar una celebración infantil y preparar una reserva por WhatsApp.

## Negocio ficticio

**La Casa de los Colores** es un espacio de celebraciones infantiles para niños y adolescentes. Ofrece cumpleaños con juegos, actividades creativas, colación y acompañamiento; no atribuye clientes, resultados ni dirección real.

## Dirección visual

- Composición original inspirada en el lenguaje de planos, retícula y colores primarios asociado a Piet Mondrian; no replica una obra existente ni usa imágenes de sus cuadros.
- Fondo blanco cálido, líneas negras firmes y bloques de rojo, azul y amarillo como acentos estructurales.
- Tipografía local existente, contraste alto y espacios amplios para mantener lectura fácil.
- Sin gradientes, brillos gamer, ilustraciones remotas ni dependencias externas.

## Cuatro secciones

1. **Hero y promesa:** celebraciones con juegos, creación y espacio para compartir; CTA a reserva por WhatsApp.
2. **Paquetes claros:** tres alternativas con edad sugerida, duración, capacidad y valor desde; el visitante selecciona un paquete.
3. **Qué incluye:** juegos, actividad creativa, colación y acompañamiento, con un bloque explícito de lo que debe confirmar la familia.
4. **Reserva:** formulario breve para nombre, edad, asistentes, fecha y paquete; prepara un mensaje de WhatsApp con todo el contexto.

## Interacción demostrable

- La selección de paquete actualiza el resumen visible y preselecciona el paquete en la reserva.
- La reserva usa validación nativa para datos requeridos, construye un enlace `wa.me` con el contexto y restablece el formulario al cerrar o enviar.
- El diseño funciona con teclado, móvil y `file://`; mantiene foco visible y no requiere conexión externa.

## Alcance Vitrina Express que demuestra

- Una única página de cuatro secciones.
- Oferta y valores claros antes de escribir.
- Preguntas o datos que la familia debe preparar antes de reservar.
- Un siguiente paso único: WhatsApp con consulta contextualizada.

## Restricciones y validación

- Crear en `demo-casa-colores/index.html`, con rutas relativas locales y un único `h1`.
- Mantener `lang="es-CL"`, metadatos Open Graph, Twitter y JSON-LD de `LocalBusiness`/`EntertainmentBusiness` acorde al negocio ficticio.
- Añadir tarjeta a la landing y mantener el conteo/contratos del catálogo actualizados.
- Agregar prueba Playwright de selección, mensaje WhatsApp, reset y navegación de regreso.
- Validar con la prueba focalizada, `npm run test_root` y una revisión en producción después del push.
