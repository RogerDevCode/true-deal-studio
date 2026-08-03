# Manual del tenant STAX

## Qué hace STAX por tu negocio

STAX reúne tres herramientas. La página web presenta tu negocio, VoiceLive responde y orienta por texto o voz,
y VentaMax IA ordena conversaciones y pedidos recibidos por Telegram. Tú mantienes el control de la información,
las reservas y la atención humana.

Este manual está dirigido al propietario del negocio y a las personas que este autorice como operadores.

## Antes de comenzar

Solicita al administrador STAX:

- la dirección del panel que utilizarás;
- tu correo de acceso y una contraseña temporal entregada en privado;
- el enlace público de VoiceLive de tu negocio;
- confirmación de que tu tenant y tus datos están separados de otras empresas.

No compartas tu contraseña. STAX no utiliza una contraseña común para todos los negocios.

## Orden recomendado de configuración

Completa primero lo esencial y prueba cada etapa:

1. Nombre, descripción y WhatsApp del negocio.
2. Servicios, horarios y límites de reserva.
3. Preguntas frecuentes publicadas.
4. Una solicitud y una reserva de prueba.
5. Google Calendar, si deseas una copia visible allí.
6. Widget público por texto y voz.
7. Telegram, catálogo y agente de VentaMax IA, si usarás pedidos o atención conversacional.

## VoiceLive: orientación y reservas

### Mi Negocio

En **Mi Negocio** completa el nombre comercial, descripción, dirección, comuna y WhatsApp del negocio. El número
de WhatsApp sirve para que el cliente pueda dejar un mensaje; no implica respuesta inmediata ni una llamada en
vivo.

Guarda y espera la confirmación visible. Si aparece un error, conserva los datos escritos, corrige el campo
indicado y vuelve a guardar.

### Servicios y Horarios

En **Servicios y Horarios**:

1. Crea cada servicio con un nombre que el cliente reconozca.
2. Indica duración y precio solo cuando sean reales y estén confirmados.
3. Define días y bloques de atención.
4. Configura cuántos días hacia el futuro permites reservar; por ejemplo, 90 días.
5. Desactiva servicios u horarios que todavía no estén disponibles.

VoiceLive no debe inventar servicios, precios ni disponibilidad. Si una información no está configurada, el
asistente debe reconocer el límite y ofrecer registrar una solicitud para revisión humana.

### Respuestas Frecuentes

En **Respuestas Frecuentes** registra respuestas concretas sobre horarios, ubicación, preparación, precios,
modalidad, pagos, cambios y límites del servicio.

- **Publicado:** puede utilizarse para responder a clientes.
- **Borrador:** queda guardado para revisión, pero no responde al público.

Formula cada pregunta indicando el sujeto. Es mejor escribir “¿VoiceLive recuerda mi nombre?” que “¿Recuerda mi
nombre?”. Incluye ejemplos claros y evita respuestas como “depende” sin explicar de qué depende y qué puede hacer
el cliente.

#### Exportar e importar FAQ

1. Pulsa **Exportar** y guarda el archivo como respaldo editable.
2. Mantén la primera línea `STAX FAQ v1`.
3. Las líneas que comienzan con `#` son instrucciones y no se importan.
4. Para actualizar, conserva `ID` y `N°` y edita pregunta, respuesta o estado.
5. Para agregar, crea un bloque sin `ID` ni `N°`.
6. Para eliminar, conserva `ID` y `N°` y agrega `Eliminar: sí`.
7. Selecciona el archivo, pulsa **Analizar archivo** y revisa el resumen de altas, cambios y eliminaciones.
8. Confirma únicamente si la vista previa coincide con tu intención.

Omitir una FAQ del archivo no la elimina. No reutilices el ID exportado por otro tenant.

### Agenda de Citas

**Agenda de Citas** es la agenda principal de VoiceLive. Desde aquí puedes:

- revisar reservas y solicitudes pendientes;
- crear una reserva manual;
- reagendar o cancelar una hora;
- abrir WhatsApp con un mensaje preparado para confirmar al cliente;
- comprobar si el mismo WhatsApp o correo ya tiene una solicitud o reserva pendiente.

Revisa el texto antes de enviarlo. El botón prepara el mensaje, pero tú decides si corresponde enviarlo.

Cuando no existe una hora disponible, VoiceLive puede registrar la intención del cliente. Debe indicarle que el
negocio revisará la solicitud y responderá según disponibilidad; no promete atención inmediata.

### Contactos Recibidos

En **Contactos Recibidos** encontrarás personas que dejaron nombre, WhatsApp, correo o una solicitud. Usa esta
información solo para el propósito informado al cliente y elimina o corrige datos cuando corresponda.

El nombre y WhatsApp se solicitan de uno en uno para facilitar la conversación. El visitante puede comenzar sin
entregarlos, pero serán necesarios para buscar o gestionar de forma confiable una solicitud, reserva, cambio o
cancelación.

### Identidad y memoria del visitante

El navegador conserva un identificador aleatorio para reconocer una visita posterior. El cliente puede:

- confirmar que es la misma persona;
- indicar que es otra persona y entregar un nuevo nombre;
- pedir que se recuerde su nombre y se olvide el resumen anterior;
- pedir que se elimine la memoria consentida.

VoiceLive usa solo el primer nombre durante la conversación, aunque guarde el nombre completo válido para la
gestión. Nombres con números, garabatos o contenido claramente abusivo deben rechazarse con amabilidad y pedir
una forma de trato válida. El filtro no debe bloquear nombres reales por ser poco frecuentes.

### Mi Chat Web

En **Mi Chat Web** revisa el enlace y la vista del asistente público. Prueba:

1. una pregunta respondida por una FAQ publicada;
2. una pregunta desconocida;
3. una solicitud de hora;
4. un cambio o cancelación;
5. un nombre inválido y uno real poco frecuente;
6. el cierre y una segunda visita desde el mismo navegador.

El audio no se guarda. El texto y el resumen consentido se tratan según la política de privacidad vigente.

## Google Calendar: copia de salida

Google Calendar es opcional. VoiceLive sigue siendo la fuente de verdad de horarios y reservas.

1. Abre **Calendario Externo**.
2. Pulsa **Conectar Google Calendar** y elige la cuenta del negocio.
3. Acepta el permiso solicitado.
4. Elige **Crear agenda exclusiva**, opción recomendada.
5. Pulsa **Reconciliar agenda** para reflejar disponibilidad y reservas.
6. Prueba crear, reagendar y cancelar una reserva desde VoiceLive.

Si eliges **Usar mi calendario principal**, debes aceptar una advertencia. VoiceLive no modifica eventos personales
existentes; solo administra eventos que él mismo creó y marcó como propios.

Si Google indica que STAX está en pruebas, informa al administrador el correo exacto de Google que utilizarás. El
administrador debe autorizarlo como tester o completar la publicación de la aplicación.

Si desconectas Google Calendar, la agenda interna y sus reservas permanecen en VoiceLive.

## Estadísticas y continuidad

En **Estadísticas** revisa volúmenes y tendencias para organizar la atención; no interpretes una métrica como una
venta garantizada. En **Continuidad de agenda** revisa recordatorios y seguimientos configurados. El canal depende
de la preferencia del cliente: correo siempre puede formar parte del contacto, mientras WhatsApp o Telegram se
usan solo cuando el cliente los eligió y la integración está disponible.

## VentaMax IA: Telegram, atención y pedidos

### Conectar Telegram

Telegram es el canal principal de VentaMax IA por su facilidad y costo operativo. WhatsApp es más habitual para
muchos clientes, pero su integración oficial requiere condiciones, desarrollo y cobros definidos por Meta; por
eso no se ofrece como canal activo en esta etapa.

Para conectar Telegram:

1. En Telegram abre **BotFather** y crea un bot para tu negocio.
2. Copia el token sin publicarlo ni enviarlo por grupos.
3. En VentaMax IA abre **Configuración > Telegram**.
4. Pega el token y pulsa conectar.
5. Abre el enlace del bot y envía `/start`.
6. Confirma que la conversación aparece en **Bandeja**.

Solo el propietario puede cambiar el token. Si sospechas que se expuso, revócalo en BotFather y conecta el nuevo.

### Marca

En **Configuración > Marca** define nombre y color visibles. Usa el mismo nombre comercial que en STAX Web y
VoiceLive para que el cliente reconozca quién responde.

### Catálogo

En **Configuración > Catálogo**:

1. Crea categorías claras.
2. Registra cada producto y cada presentación como opciones distinguibles.
3. Usa SKU únicos, precios reales y stock controlado.
4. Define límites máximos por producto cuando corresponda.
5. Desactiva lo que no esté disponible.

El agente debe ceñirse al catálogo. Si un producto o precio no existe en la base de datos, debe decirlo y ofrecer
alternativas reales; nunca inventarlo.

### Agente y conocimiento

En **Agente** define nombre, tono, saludo, instrucciones y reglas de derivación. Limita su propósito al negocio.
Ante preguntas ajenas, instrucciones hostiles o garabatos, debe responder brevemente, mantener el respeto y volver
al ámbito comercial.

La base de conocimiento y pgvector ayudan a encontrar contexto, pero no reemplazan el catálogo, el stock ni el
precio guardado. Revisa las respuestas con el **Laboratorio** antes de publicarlas.

### Bandeja, Contactos y Pipeline

- **Bandeja:** lee conversaciones y continúa manualmente cuando sea necesario.
- **Contactos:** revisa identidad, datos de contacto e historial permitido.
- **Pipeline:** organiza oportunidades por etapa; el estado ayuda a priorizar, no garantiza una venta.
- **Analytics:** muestra actividad, pedidos y tendencias operativas.

### Pedidos

En **Pedidos** revisa contenido, total, estado y contacto antes de preparar o despachar. El cliente puede agregar,
quitar o cambiar productos y cancelar según las reglas del negocio. Verifica siempre stock y precio desde la base
de datos antes de confirmar.

Los pagos externos no deben marcar un pedido como pagado si la plataforma todavía no valida una firma confiable.

### Equipo

En **Configuración > Equipo**, el propietario puede crear accesos y cambiar su contraseña. Entrega contraseñas
temporales en privado, obliga a cambiarlas y elimina accesos de personas que ya no trabajan con el negocio.

## Lista de comprobación antes de publicar

- [ ] Nombre, WhatsApp, horarios y descripción están correctos.
- [ ] Servicios, precios, duraciones y límite futuro son reales.
- [ ] Las FAQ útiles están publicadas y los borradores no responden.
- [ ] Se probó solicitud, reserva, reagendamiento y cancelación.
- [ ] Google Calendar refleja VoiceLive sin tocar eventos ajenos.
- [ ] El widget responde y deriva sin prometer atención inmediata.
- [ ] Telegram recibe `/start` y la conversación aparece en Bandeja.
- [ ] Catálogo, presentaciones, stock y precios coinciden con el negocio.
- [ ] El agente rechaza garabatos y preguntas ajenas sin confrontar.
- [ ] Cada integrante usa su propia cuenta.

## Cuándo pedir ayuda

Contacta al administrador STAX si no puedes iniciar sesión, ves datos de otro negocio, Google rechaza la conexión,
Telegram deja de recibir mensajes, una reserva no aparece o una respuesta pública contiene información incorrecta.
No envíes contraseñas, tokens ni datos sensibles en capturas o mensajes grupales.
