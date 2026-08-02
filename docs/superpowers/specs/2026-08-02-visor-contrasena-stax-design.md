# Diseño: visor de contraseña en STAX

## Objetivo

Permitir que una persona revele u oculte el valor de una contraseña antes de
enviar un formulario de autenticación o creación de tenant, sin modificar la
validación, el envío ni el almacenamiento de credenciales.

## Alcance

| Componente | Formularios con contraseña | Cambio |
| --- | --- | --- |
| True Deal Studio | No tiene login, registro ni contraseña propia. | Sin cambio. |
| VoiceLive | Inicio de sesión; contraseña inicial del propietario al crear tenant. | Añadir visor. |
| VentaMax IA | Inicio de sesión. Registro y configuración ya tienen visor. | Añadir visor al login. |

## Interacción y accesibilidad

Cada campo conserva `type="password"` por defecto. Un botón visible dentro del
campo, alineado a la derecha, alterna entre `password` y `text` sin alterar el
valor ni desplazar el foco. El icono será un ojo cuando el valor esté oculto y
un ojo tachado cuando esté visible.

El control será un `<button type="button">` con etiqueta accesible dinámica:
`Ver contraseña` u `Ocultar contraseña`. Incluirá tooltip con el mismo texto,
será navegable por teclado y mantendrá foco visible. No se confiará únicamente
en el icono para comunicar su función.

El valor vuelve a ocultarse al enviar con éxito, al desmontar el formulario o
cuando el usuario vuelve a pulsar el control. Un intento fallido conserva el
estado y el texto ingresado, para que la persona pueda corregirlo.

## Límites de seguridad

El visor es una ayuda local de interfaz: no registra, transmite ni persiste la
contraseña adicionalmente. No cambia `autocomplete`, las reglas de longitud,
la autenticación de servidor, los logs ni las respuestas de error. Las
contraseñas siguen estando ocultas por defecto.

## Validación

1. Cada campo de alcance comienza como `password`.
2. Pulsar el botón alterna el tipo, icono, `aria-label` y tooltip.
3. El valor escrito se conserva al alternar.
4. El botón no envía el formulario.
5. Inicio de sesión, creación de tenant y registro existente mantienen sus
   pruebas de comportamiento; True Deal no recibe cambios por no tener dichos
   formularios.
