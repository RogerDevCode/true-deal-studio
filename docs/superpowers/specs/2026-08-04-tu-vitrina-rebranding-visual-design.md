# Tu Vitrina — Rebranding y dirección visual

## Objetivo

Transformar STAX Web en **Tu Vitrina**, la entrada comercial de `tuvitrina.lat`.
La interfaz debe hacer que una PYME chilena comprenda, de inmediato, que puede mostrar
mejor su oferta, responder con contexto y facilitar el siguiente paso de sus clientes.

La página principal conserva la promesa **“Que te vean. Que te crean.”** como apoyo. La
marca visible, el SEO, el JSON-LD, los enlaces públicos y el copy comercial pasan de
STAX a **Tu Vitrina**.

## Concepto

**Tu Vitrina** no describe una herramienta técnica: describe el espacio claro donde un
negocio se deja ver, se entiende y puede iniciar una conversación. La voz visual es
comercial moderna: ordenada, luminosa, práctica y chilena; evita el tono de software
genérico, promesas de ventas garantizadas y decoración sin función.

La frase guía es: **“Haz visible lo que haces. Facilita el siguiente paso.”**

## Arquitectura visible

1. **Cabecera y hero:** logotipo textual `Tu Vitrina`, dominio `tuvitrina.lat` en datos
   estructurados y una tesis breve centrada en mostrar, explicar y orientar.
2. **Prueba de atención por voz:** sustituir el actual bloque que explica la función por
   una evidencia audible. El visitante ve una pregunta natural breve y activa un único
   control de audio; escucha una respuesta real grabada desde VoiceLive, generada por el
   asistente y basada en información aprobada. La pieza no muestra un párrafo como
   sustituto del audio. Mantiene una transcripción opcional para accesibilidad y un CTA
   claro para abrir la demo viva.
3. **Servicios conectados:** renombrar `STAX Voz` y `STAX Atención Ordenada` como
   `Tu Vitrina Voz` y `Tu Vitrina Atención Ordenada`, describiendo beneficio observable
   antes que tecnología.
4. **Demos:** conservar que son referencias, no clientes reales. Sus barras, retornos,
   metadatos y llamados visibles indican `Demo Tu Vitrina`.
5. **Cierre:** propiedad del dominio, publicación, precios y formularios usan el mismo
   nombre de producto y no conservan valores comerciales `STAX`.

## Sistema de imágenes

Cada `index.html` público incorpora como máximo un visual contextual adicional, pequeño
o mediano, situado junto al primer punto de decisión. El visual responde a una pregunta
del visitante: qué se muestra, cómo se atiende o qué obtiene el dueño al ordenar su
operación.

| Grupo | Uso del visual | Ejemplos de escena |
| --- | --- | --- |
| Landing | Anclar la propuesta y los tipos de necesidad | escaparate, producto preparado, agenda visible o entrega ordenada |
| Salud y atención | Acompañar la orientación sin invadir | material de atención, libreta de agenda, espacio sereno; sin pacientes identificables |
| Comercio y catálogo | Mostrar claridad de oferta | producto, empaque, selección de variantes, despacho |
| Servicios y agenda | Mostrar control operativo | calendario, preparación de visita, documentación o recepción |
| Propuestas de plan | Mostrar el resultado del plan | mesa de trabajo, catálogo publicado o conversación contextualizada |

Las imágenes son locales (`webp`/`avif` según soporte), optimizadas, con `loading="lazy"`
excepto la imagen principal de la landing, `decoding="async"`, dimensiones explícitas y
texto alternativo útil. No habrá carruseles, fondos fotográficos en cada bloque,
autoplay ni rostros inventados presentados como clientes. Las fotos funcionan como
anclas de comprensión; el titular, la información y el CTA siguen siendo prioritarios.

## Movimiento y accesibilidad

- La prueba audible no inicia audio automáticamente.
- Un solo botón visible controla reproducir/pausar; informa duración y estado a lectores
  de pantalla.
- La transcripción queda disponible en un `details` claramente etiquetado, no ocupa el
  foco visual inicial.
- Respetar `prefers-reduced-motion`, foco visible, contraste y navegación por teclado.
- El video anterior puede mantenerse sólo si aporta evidencia distinta; si duplica la
  prueba audible, se elimina para evitar competencia visual.

## Alcance técnico

- Actualizar marca en los 18 `index.html`, `privacidad.html`, metadatos, JSON-LD,
  formularios y enlaces externos públicos.
- Sustituir `voice.stax.ink` por `voice.tuvitrina.lat` sin modificar los `data-testid`
  existentes salvo que un test se actualice conjuntamente.
- Renombrar assets y clases sólo cuando sea necesario para que no quede exposición
  pública de STAX. Los identificadores internos de pruebas pueden mantenerse mientras
  no sean visibles para visitantes.
- Reutilizar imágenes locales útiles antes de crear nuevas; generar sólo el conjunto
  mínimo de imágenes faltantes y registrarlas en `assets/visuals/` con nombres neutros
  `tu-vitrina-*`.
- El archivo de audio se genera desde la respuesta del asistente VoiceLive y se publica
  como recurso local con controles y fallback. No se llama a una LLM desde la landing.

## Pruebas de aceptación

1. No hay marca ni dominio STAX visibles, en SEO o JSON-LD público.
2. Las URL de VoiceLive usan `voice.tuvitrina.lat` y cuentan con fallback comprensible.
3. La landing ofrece una prueba audible accionable, sin reproducción automática y con
   transcripción accesible opcional.
4. Cada `index.html` conserva un solo `h1`, recursos locales, navegación relativa y
   contraste suficiente.
5. Cada página incorpora como máximo un visual contextual nuevo y no presenta carga
   visual excesiva en móvil.
6. `npm run qa:gate` finaliza en `PASS`; se actualizan pruebas que dependan de la marca
   visible o de las URLs públicas.

## Fuera de alcance

- Rebranding de los repositorios internos VoiceLive y VentaMax IA.
- Cambio de base de datos, secretos, tenants o comportamiento de la LLM.
- Cambios de DNS, Cloudflare, certificados o configuración externa sin autorización.
