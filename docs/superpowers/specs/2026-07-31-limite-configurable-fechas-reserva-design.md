# Límite configurable de fechas de reserva

## Objetivo

Evitar fechas vencidas o excesivamente futuras en los formularios de reserva y mantener las pruebas estables durante aproximadamente un año.

## Alcance

La regla se aplica a las demos de psicología, café, salón, contabilidad y propiedades. Cada demo declara un límite local de `bookingLeadDays: 90`; por tanto, el valor se puede ajustar por negocio sin afectar a los demás.

## Comportamiento

- La fecha mínima es el día local actual.
- La fecha máxima es la fecha mínima más `bookingLeadDays` días.
- Cada input de fecha expone ambos límites mediante `min` y `max`.
- Antes de preparar el mensaje de WhatsApp, la aplicación valida de nuevo el rango. Una fecha fuera de rango no abre WhatsApp y muestra un mensaje claro con el límite vigente.
- La restricción conserva la modalidad presencial como valor inicial y no cambia el resto del flujo de reserva.

## Pruebas

- Los fixtures de reserva se mueven a fechas de 2027, manteniéndolos válidos aproximadamente un año.
- La cobertura de salón comprueba que el máximo está presente y que una fecha mayor a 90 días no prepara WhatsApp.
- La prueba transversal de WhatsApp conserva el envío correcto para cada demo.

## Límites

No se cambian dominios, APIs, bot, VoiceLive, datos persistentes ni infraestructura. El valor configurable es local a cada frontend mientras las demos sigan siendo aplicaciones estáticas independientes.
