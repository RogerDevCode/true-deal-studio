# Ruta Casa: React local y vitrina fotográfica

## Objetivo

Convertir la demo de servicios domiciliarios en una muestra fotográfica de una operación que ordena solicitudes antes de WhatsApp. La experiencia debe demostrar electricidad, gasfitería, mantención y visita a domicilio sin perder su funcionamiento offline.

## Dirección

Ruta Casa deja de depender de bloques de texto para explicar su oferta. La evidencia principal será una secuencia de cuatro fotos locales: técnico de electricidad, reparación de gasfitería, mantención preventiva y llegada preparada al domicilio. El hero muestra trabajo real; las tarjetas explican servicio, cobertura, valor desde y siguiente paso.

La paleta existente se conserva: azul profundo, papel claro, cobre y verde. Las fotos aportan variedad; la interfaz mantiene bloques sobrios y operativos.

## Arquitectura React offline

React y ReactDOM se instalan como dependencias de desarrollo y se compilan antes de publicar. El navegador consume solo archivos generados locales desde `demo-servicios-domiciliarios/assets/`; no hay CDN, servidor de desarrollo ni carga de módulos desde internet.

| Componente | Responsabilidad |
| --- | --- |
| `RutaCasaApp` | Estado de solicitudes, persistencia y composición. |
| `HeroVisita` | Propuesta, foto de trabajo y CTA inicial. |
| `ServicioFotografico` | Foto, servicio, valor desde y CTA para abrir solicitud. |
| `CoberturaOperativa` | Comunas, franja y prioridad de respuesta. |
| `BitacoraSolicitudes` | Solicitudes persistidas con estado y contexto. |
| `SolicitudModal` | Formulario accesible, validado y reiniciable. |

El estado se conserva en `localStorage` bajo `stax-demo-hogar`. El reinicio elimina únicamente esa clave. La estructura de datos actual de solicitudes se mantiene para no romper el test ni los datos existentes.

## Recorrido

1. Hero con foto de visita, titular y CTA “Solicitar visita”.
2. Cuatro servicios fotográficos: electricidad, gasfitería, mantención y visita de evaluación.
3. Cobertura y proceso de coordinación visibles.
4. Modal React con comuna, servicio, urgencia, franja y detalle obligatorio.
5. Bitácora y resumen muestran la solicitud recién guardada y persisten tras recarga.

## Restricciones y calidad

- `file://`, recursos locales, `lang="es-CL"`, un `h1`, OG/Twitter y JSON-LD se conservan.
- No se añaden promesas de disponibilidad ni de resultados; la confirmación sigue siendo humana.
- Se respetan foco visible, etiquetas, Escape, contraste y reducción de movimiento.
- Playwright debe verificar fotos locales cargadas, acciones de componentes React, persistencia, reinicio aislado y ausencia de consola roja.

## Validación

Se añade una captura Playwright de escritorio y móvil al flujo visual manual. `npm run qa:gate` y `npm run qa:e2e` deben finalizar correctamente antes de publicar.
