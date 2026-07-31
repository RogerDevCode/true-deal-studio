# Diseño: oferta STAX conectada y arquitectura híbrida

## Objetivo

Presentar STAX como la marca pública que conecta una web comercial, orientación por voz y atención asistida para el dueño del negocio. `stax.ink` será la entrada comercial; VoiceLive y el chatbot continuarán como aplicaciones independientes, con despliegues y secretos separados.

La solución inicial mantiene la landing estática en Vercel y ejecuta VoiceLive y chatbot en un único VPS mediante Docker Compose. No se fusionan los proyectos en una imagen Docker ni en un repositorio monolítico.

## Decisiones aprobadas

- La marca pública durante esta etapa es **STAX**. True Deal Studio permanece como identidad del repositorio y evolución estratégica; no se inicia un rebranding público.
- La arquitectura es **híbrida**: Vercel para `stax.ink`; VPS para los servicios operativos.
- VoiceLive y el chatbot son aplicaciones separadas, listas para producción y con sus propios repositorios o Dockerfiles.
- La landing vende resultados observables y control humano, no tecnología aislada ni promesas de automatización total.
- Telegram se presenta como el lugar donde el dueño puede recibir y revisar una consulta ordenada. El cliente no necesita conocer la API, el webhook ni la infraestructura.

## Topología pública

```text
Visitante
    ↓
stax.ink / www.stax.ink (Vercel)
    ├─ Probar atención por voz → voice.stax.ink (VPS)
    ├─ Ver flujo del dueño → demostración STAX en la landing
    └─ Revisar mi atención actual → WhatsApp con contexto

VPS
    ├─ Proxy HTTPS
    ├─ VoiceLive
    └─ Chatbot/API → Telegram webhook
```

### Dominios

| Dominio | Destino | Visibilidad |
| --- | --- | --- |
| `stax.ink` y `www.stax.ink` | Vercel / landing STAX | Público y comercial. |
| `voice.stax.ink` | Servicio VoiceLive en VPS | Público como demostración guiada. |
| `api.stax.ink` | API/chatbot en VPS | Público solo para integraciones como Telegram; no se enlaza en copy comercial. |
| `panel.stax.ink` | Panel del dueño, si se publica | Diferido hasta que exista una interfaz productiva para el dueño. |

## Arquitectura del VPS

Un único VPS puede alojar varios contenedores coordinados con Docker Compose. Cada aplicación se conserva como servicio independiente:

- `gateway`: proxy HTTPS y terminación TLS; es el único servicio que expone los puertos 80 y 443.
- `voicelive`: servicio de voz, disponible únicamente a través de `voice.stax.ink`.
- `chatbot`: API que recibe actualizaciones de Telegram, procesa la información aprobada por cada negocio y envía resúmenes o acciones al dueño.

`gateway` comparte una red de entrada con `voicelive` y `chatbot`. Los datos persistentes, bases de datos y colas que requiera cada aplicación se mantendrán en su repositorio o servicio propio, detrás de una red interna; no se agregan por defecto a la infraestructura de STAX.

La configuración productiva vive fuera de Git, en archivos de entorno del VPS o un gestor de secretos. Tokens de Telegram, claves de proveedores de IA, credenciales de base de datos y claves de webhook nunca se copian a la landing, las imágenes Docker ni este repositorio.

El VPS debe aplicar límites de recursos, health checks, reinicio controlado, logs rotados y usuarios no privilegiados según las capacidades de cada aplicación. True Deal no necesita procesar secretos ni tráfico de voz porque permanece como sitio estático en Vercel.

## Oferta y copy comercial

STAX debe explicar una sola ruta de atención:

> Tu web explica. La voz orienta. Tú decides el siguiente paso.

La página principal no presenta "chatbot" como botón técnico ni promete que una IA sustituye al negocio. En cambio, crea una sección posterior a las demos o al proceso comercial con el título:

> **Tu web puede orientar. Tú puedes decidir.**

La sección contiene dos experiencias:

### Atención por voz

- Nombre visible: **STAX Voz**.
- Qué muestra: una persona formula una duda frecuente y VoiceLive la orienta usando información aprobada.
- CTA: **Probar atención por voz**.
- Destino: `voice.stax.ink`.
- Límite visible: la orientación usa contenidos definidos con el negocio y deriva situaciones que requieren una persona.

### Atención ordenada para el dueño

- Nombre visible: **STAX Atención Ordenada**.
- Qué muestra: una consulta web o de voz se convierte en servicio, comuna, horario y próximo paso; el dueño recibe un resumen en Telegram.
- CTA: **Ver cómo llega una consulta ordenada**.
- Destino inicial: la vista previa local ya incorporada en `demo-agenda/index.html`.
- Límite visible: la demostración no afirma que envía mensajes reales ni que integra cada canal automáticamente.

El CTA comercial común es **Revisar mi atención actual por WhatsApp**. Debe preparar un mensaje que indique si el negocio quiere partir por web, atención ordenada o voz; no contratar automáticamente.

## Escalera de servicios

| Servicio | Resultado que se vende | Alcance inicial |
| --- | --- | --- |
| **STAX Vitrina** | El negocio se entiende y presenta un siguiente paso claro. | Página, oferta, horarios, cobertura y WhatsApp preparado. |
| **STAX Atención Ordenada** | El dueño recibe mejores consultas y puede continuar con contexto. | Información aprobada, reglas de derivación, resumen y configuración del canal definido. |
| **STAX Voz** | El visitante puede recibir orientación por voz antes de escribir. | Preguntas frecuentes aprobadas, acciones acotadas, derivación humana y revisión de uso. |

Los servicios conversacionales se ofrecen como activación inicial más mensualidad de operación. El valor público definitivo se fija después de medir consumo de voz, soporte, alojamiento y el alcance de cada piloto.

## Recorrido del cliente

```text
Ve STAX
  → entiende qué hace el negocio
  → prueba voz o revisa el flujo de atención
  → solicita diagnóstico por WhatsApp
  → se define información, canal, responsables y límites
  → el dueño revisa y decide cada siguiente paso
```

Este recorrido evita vender una promesa técnica abstracta. Las demos sirven como evidencia del criterio de implementación y de lo que el dueño podrá revisar.

## Despliegue por fases

1. **Base operativa:** elegir el VPS, instalar Docker Compose, configurar el proxy HTTPS, DNS de `voice.stax.ink` y el entorno seguro de cada aplicación.
2. **Servicios:** desplegar VoiceLive y chatbot desde sus repositorios, con health checks, logs, backups según sus datos y pruebas de webhook de Telegram.
3. **Comercial:** añadir a `stax.ink` la sección de atención asistida, los CTAs y la consulta de diagnóstico con contexto.
4. **Pilotos:** habilitar uno a tres negocios, medir consultas iniciadas, resúmenes útiles, traspasos, costos y soporte antes de publicar precios finales o casos.

## Fuera de alcance de este diseño

- Migrar la marca pública a `true-deal.ink`.
- Fusionar los repositorios de VoiceLive, chatbot y True Deal.
- Configurar credenciales, DNS, VPS, proxy, webhook o una base de datos real.
- Cambiar el despliegue vigente de Vercel.
- Afirmar ventas, conversiones, testimonios o automatizaciones no verificadas.
