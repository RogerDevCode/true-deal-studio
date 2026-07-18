# Diseño: hero de confianza visible

**Estado:** aprobado para revisión antes de implementación.

## Objetivo

Reemplazar la promesa actual del hero por una idea más memorable y centrada en confianza: un negocio debe ser visible y creíble antes de iniciar una conversación comercial.

## Copy aprobado

### Titular

> **Que te vean. Que te crean.**

### Texto de apoyo

> Una página clara para que tus clientes conozcan lo que ofreces antes de escribirte por WhatsApp.

## Razonamiento

El titular usa repetición y rima asonante para fijar una secuencia comercial reconocible: primero presencia, luego confianza. Evita promesas de ventas y mantiene el foco en una consecuencia razonable del servicio.

El texto de apoyo explica, en lenguaje directo, el rol concreto de la página y el paso siguiente por WhatsApp.

## Alcance

- Actualizar el `<title>`, las etiquetas sociales y el `<h1>` de `index.html`.
- Actualizar el texto de apoyo inmediato del hero.
- Ajustar las pruebas que verifican el título y el titular de la landing.
- Actualizar las referencias activas de README y AGENTS.md que aún contengan el titular anterior.

## Límites

- Mantener STAX como marca pública actual; True Deal Studio continúa como identidad del repositorio.
- No modificar precios, CTA, estructura del hero, imagen, demos ni flujo de WhatsApp.
- Mantener `lang="es-CL"`, un solo `<h1>`, metadatos Open Graph/Twitter y compatibilidad `file://`.

## Validación

- Confirmar que el titular anterior ya no aparece en archivos activos.
- Ejecutar `npm run test_root` y `npm run qa:gate`.
- Revisar visualmente el hero en desktop y móvil para asegurar que el nuevo titular conserva contraste y legibilidad.
