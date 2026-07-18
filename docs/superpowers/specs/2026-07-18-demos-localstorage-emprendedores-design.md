# Diseño: demos locales para emprendedores chilenos

**Estado:** aprobado para revisión antes de implementación.

## Objetivo

Agregar cuatro demostraciones interactivas —servicios domiciliarios, mascotas, floristería y banquetería/pastelería— que muestren criterio comercial, diseño distintivo e interacción operativa sin depender de backend.

## Audiencia y enfoque

Cada demo habla al dueño de una pyme chilena que atiende consultas por WhatsApp, necesita explicar su servicio antes de conversar y no puede dedicar tiempo a mantener una plataforma compleja. La experiencia hace visibles cobertura, precios referenciales, condiciones y el contexto de cada solicitud; no promete disponibilidad, resultados ni ventas.

## Arquitectura compartida

Cada demo vive en su propia carpeta `demo-<rubro>/index.html`, funciona bajo `file://` y carga únicamente recursos locales existentes.

El estado se inicia desde un objeto JSON dentro del JavaScript local de cada página. Al modificar elementos operativos —por ejemplo, solicitudes de prueba o preferencias— se persiste una copia bajo una clave exclusiva de `localStorage`. Un control accesible **Restablecer demo** elimina solo esa clave y vuelve a cargar el estado inicial. No habrá red, backend, credenciales, CDN ni sincronización entre demos.

La reutilización se limita a una utilidad local mínima por demo: clonación del seed, lectura segura, escritura y reset. No se introduce una plantilla visual compartida que borre la personalidad de los rubros.

## Demos

## Dirección de diagramación

Las cuatro experiencias deben evitar la secuencia repetida hero + tarjetas + catálogo + formulario. Cada una expresa la decisión principal del cliente mediante una composición propia:

- **Servicios domiciliarios:** orden de visita profesional. Hero dividido 60/40, con propuesta de valor sobria a la izquierda y cobertura/horarios en una orden de visita a la derecha; las solicitudes se leen como un panel operativo de alta densidad.
- **Mascotas:** agenda de cuidado. Fichas de mascota, preparación antes de la visita y una agenda con estados legibles; la confianza se construye desde el perfil y la rutina.
- **Floristería:** composición editorial guiada. La página avanza por ocasión, estilo y entrega; el resumen vivo acompaña la elección y la dedicatoria ocupa un espacio central.
- **Banquetería/pastelería:** mapa de celebración. Formato, asistentes, presupuesto y restricciones se presentan como partes de una propuesta de evento, no como un catálogo ni un formulario lineal.

No se reutiliza la misma jerarquía de secciones, grilla, navegación secundaria o patrón de tarjetas entre las cuatro demos. La reutilización técnica de estado local no autoriza la repetición visual.

### Servicios domiciliarios

Una experiencia de coordinación para gasfitería, electricidad y mantención.

- El cliente indica comuna, tipo de problema, nivel de urgencia, franja horaria y una descripción breve.
- La página muestra cobertura, proceso de atención, precios desde y qué información debe preparar.
- La vista de dueño ordena solicitudes por prioridad y estado, con el contexto suficiente para responder por WhatsApp.
- El diseño usa una interfaz de coordinación profesional: azul petróleo como base, superficies marfil y cobre reservado para prioridades; verde solo para confirmaciones. Evita grillas decorativas, emojis, sombras duras, círculos lúdicos y una paleta multicolor. La urgencia se comunica con texto y estado, además de color.

### Mascotas

Una agenda para peluquería canina y atención móvil.

- El cliente registra nombre, especie, tamaño, servicio, dirección, fecha preferida y observaciones de cuidado.
- La página explica zonas de atención, preparación previa y valores desde.
- La vista de dueño muestra fichas de mascota, próximas visitas y estado de confirmación.
- El diseño transmite cuidado y cercanía sin infantilizar: fichas de mascota, agenda de cuidado, colores cálidos y jerarquía simple.

### Floristería

Un flujo de pedido de arreglos con despacho urbano.

- El cliente selecciona ocasión, estilo, presupuesto, fecha, comuna, bloque de entrega y dedicatoria.
- La página muestra catálogo acotado, condiciones de despacho y alternativas de retiro.
- La vista de dueño ordena pedidos por fecha de entrega y permite revisar el texto de cada tarjeta.
- El diseño convierte la elección en una composición editorial guiada: ocasión primero, arreglo después, detalles de entrega al cierre y dedicatoria central.

### Banquetería y pastelería

Un cotizador orientativo para celebraciones.

- El cliente indica tipo de evento, fecha, asistentes, formato, presupuesto, comuna y restricciones alimentarias.
- La página aclara que la propuesta final se confirma por conversación y depende de agenda y logística.
- La vista de dueño organiza solicitudes por fecha y tamaño de evento, con notas de restricciones.
- El diseño presenta un mapa de celebración: formato, asistentes, presupuesto y restricciones antes del menú; no usa un catálogo largo de productos.

## Requisitos transversales

- `lang="es-CL"`, un único `<h1>`, metas Open Graph/Twitter y JSON-LD acordes a cada negocio.
- Rutas explícitas `./demo-nombre/index.html` y enlace de vuelta `../index.html`.
- Alpine.js local y plugins locales cuando sean necesarios.
- Formularios accesibles, validación nativa y mensajes prellenados de WhatsApp; no abrir ni enviar mensajes durante las pruebas.
- Cada modal se restablece al cancelar, enviar o cerrar; **Presencial** va primero y queda seleccionada si aparece un selector de modalidad.
- Diseño responsive, foco visible, contraste y respeto de `prefers-reduced-motion`.
- Demos funcionales offline y sin dependencias remotas.

## Validación

- Añadir enlaces de las cuatro demos a la landing con rutas explícitas.
- Probar cada flujo de consulta, validación, estado persistente, reset y enlace de vuelta.
- Asegurar que el reset de una demo no modifica las claves de las demás.
- Ejecutar `npm run qa:gate`, `npm run qa:e2e` y pruebas focalizadas nuevas.
- Revisar cada demo en desktop y móvil.

## Límites

- No crear un backend, autenticación, pago real, inventario real ni integración con WhatsApp.
- Los datos son simulados y solo existen en `localStorage` del navegador.
- No modificar demos existentes fuera de los enlaces de la landing y de la cobertura de pruebas que las recorre.

## Revisión propia

- Cada demo tiene un flujo comercial distinto y una señal visible de criterio técnico.
- La persistencia local está aislada por clave, es reversible y no requiere configuración externa.
- El alcance evita construir software operativo; las demos son evidencia interactiva de una página bien pensada.
