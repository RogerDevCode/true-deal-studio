# Demo Nido Animal: diseño editorial de cuidado premium

## Objetivo

Crear una demostración local para una marca chilena ficticia de cuidado premium de perros y gatos. La página debe vender un servicio concreto mediante evidencia visual, explicar el cuidado antes de la reserva y preparar una solicitud con contexto. No representa una clínica veterinaria ni promete resultados de salud.

## Público y trabajo de la página

La persona que reserva cuida a un perro o gato, valora el trato y necesita entender qué recibirá antes de escribir. La página tiene un trabajo: convertir una duda inicial en una reserva preparada para baño, peluquería, paseo o hotel de día.

## Dirección visual

La referencia es una pieza editorial de fotografía, no una aplicación infantil ni una tienda de productos.

- **Tesis del hero:** una fotografía amplia de una mascota siendo cuidada y el titular: “Un día bien cuidado cambia toda la semana.” El texto vive en su propio bloque y no tapa la imagen.
- **Firma:** una galería de servicios con fotografías de proporciones deliberadamente distintas. Cada imagen funciona como evidencia del servicio y abre su ficha de reserva.
- **Color:** azul tinta `#13243A`, crema cálida `#F6F0E6`, coral `#E96050`, verde mineral `#3D7569`, amarillo mantequilla `#F4C85A` y blanco `#FFFFFF`.
- **Tipografía:** las fuentes locales existentes se usarán con un display serif para titulares y una sans serif para información operativa. No se añaden fuentes remotas.
- **Ritmo:** fondos sobrios, bloques amplios y color concentrado en etiquetas, acciones y detalles de reserva. Las fotos, no los adornos, aportan variedad.
- **Movimiento:** transiciones breves de opacidad y elevación en tarjetas; desactivadas con `prefers-reduced-motion`.

## Arquitectura de interfaz

Se mantiene el stack estático y offline. Los límites visuales equivalentes a componentes React se implementan como secciones y plantillas Alpine reutilizables, sin agregar React ni dependencias remotas.

| Unidad | Responsabilidad | Datos que recibe |
| --- | --- | --- |
| `HeroEditorial` | Explica la propuesta y lleva a los servicios o a la reserva. | CTA y titular. |
| `ServicioFotografico` | Muestra una foto, duración, valor desde y un CTA único. | Servicio. |
| `GaleriaEspacios` | Da evidencia del ambiente y del trato. | Imágenes locales y alt descriptivo. |
| `FichaCuidado` | Muestra el detalle del servicio seleccionado sin abandonar el contexto. | Servicio activo. |
| `Reserva` | Recopila mascota, tipo, servicio, fecha, hora y nota; valida y persiste. | Estado local. |
| `ResumenReserva` | Confirma lo que se guardó y permite reiniciar solo este demo. | Reserva persistida. |

## Contenido y recorrido

1. Hero con imagen, propuesta y CTAs “Ver cuidados” y “Preparar reserva”.
2. Cuatro cuidados: baño consciente, peluquería de raza, paseo individual y hotel de día. Cada uno muestra duración, valor desde y una fotografía propia.
3. Galería de espacios y una sección breve de método: recibimos, cuidamos y entregamos con contexto.
4. Reserva en línea: nombre de la mascota, especie, servicio, fecha, horario y una nota opcional. Todos los campos salvo la nota son obligatorios.
5. Al guardar, se presenta un resumen claro y se persiste en `localStorage`. La acción de reinicio elimina únicamente la clave del demo.

## Fotos y recursos

Se generarán cinco fotografías locales, sin texto ni marcas: hero, baño, peluquería, paseo y hotel de día. Deben mostrar cuidado realista, luz natural y diversidad de perros y gatos; nunca disfraces, ojos desproporcionados, estética infantil ni imágenes clínicas. Cada recurso tendrá texto alternativo específico.

## Accesibilidad, SEO y compatibilidad

- `lang="es-CL"`, un único `h1`, metadatos Open Graph/Twitter y JSON-LD `LocalBusiness` con `PetService`.
- Recursos, Alpine y navegación de retorno solo locales; compatible con `file://`.
- Foco visible, etiquetas asociadas, navegación de teclado, contraste suficiente y respeto por reducción de movimiento.
- La reserva no abre servicios externos: es una demostración persistida localmente.

## Pruebas

- Playwright: carga offline, único `h1`, recursos locales y ausencia de errores de consola.
- Playwright: abrir cada ficha fotográfica, seleccionar servicio, validar campos requeridos, guardar, recargar, restaurar y reiniciar el estado.
- Aislamiento: el reinicio no puede borrar claves de otros demos.

## Límites

No se agregan React, CDN, backend, pagos, datos de clientes reales ni promesas de resultados. La demo usa datos ficticios y `localStorage` exclusivamente.
