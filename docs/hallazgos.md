# Hallazgos — Análisis completo del frontend STAX

Fecha: 2026-07-10
Alcance: **15 archivos `index.html`** bajo `web_promotion/` — 1 landing principal + 14 subdominios/demos.
Base de criterio: `docs/feel_de_negocio_stax.md`.
Metodología: inspección directa de cada archivo + `grep` por señal (H1, `lang`, `og:image`, WhatsApp, Tailwind CDN, frase central, tema oscuro, lenguaje miedo/pérdida/riesgo). Toda afirmación lleva `archivo:línea`.

---

## 1. Evidencia estructural por archivo

| Archivo | Líneas | H1 | es-CL | og:image | WhatsApp | Tailwind CDN | Frase central |
|---|---|---|---|---|---|---|---|
| index.html (landing) | 2499 | 1 | ✓ | ✓ | ✓ (5) | ✓ (l.50) | ✓ (4) |
| demo-agenda | 819 | 1 | ✓ | ✗ | ✓ | ✓ (2) | ✗ |
| demo-artesanias | 1451 | 1 | ✓ | ✓ | ✓ | ✗ | ✗ |
| demo-cafe-valparaiso | 2052 | 1 | ✓ | ✓ | ✓ (2) | ✗ | ✗ |
| demo-contabilidad | 1552 | 1 | ✓ | ✓ | ✓ | ✗ | ✗ |
| demo-ecommerce-tech | 2109 | 1 | ✓ | ✓ | ✗ | ✗ | ✗ |
| demo-fonoaudiologia | 682 | 1 | ✓ | ✓ | ✓ (2) | ✓ (2) | ✗ |
| demo-plan-premium | 2419 | 1 | ✓ | ✗ | ✓ (2) | ✗ | ✗ |
| demo-plan-profesional | 1320 | 1 | ✓ | ✗ | ✓ (2) | ✗ | ✗ |
| demo-propiedades | 984 | 1 | ✓ | ✓ | ✗ | ✗ | ✗ |
| demo-propuesta-atencion-ordenada | 444 | 1 | ✓ | ✗ | ✗ | ✗ | ✗ |
| demo-propuesta-empezar-simple | 424 | 1 | ✓ | ✗ | ✗ | ✗ | ✗ |
| demo-propuesta-impacto-comercial | 431 | 1 | ✓ | ✗ | ✗ | ✗ | ✗ |
| demo-psicologa | 848 | 1 | ✓ | ✓ | ✗ | ✓ (2) | ✗ |
| demo-salon-belleza | 1553 | 1 | ✓ | ✓ | ✓ | ✗ | ✗ |

**Leyenda:** ✓ = presente, ✗ = ausente, número = cantidad de coincidencias.

---

## 2. Análisis FODA (basado en `feel_de_negocio_stax.md`)

**Fortalezas**
- Frase central "Se ve bien. Se vende mejor." aplicada 4 veces en la landing (`index.html:6,459,1080,2404`).
- Todas las demos cumplen SEO básico del feel: 1 H1 exacto y `lang="es-CL"` en los 15 archivos (tabla §1).
- Tono de las demos es cálido/positivo; **ninguna usa narrativa de miedo/pérdida** (ver §5, evidencia: solo 1 coincidencia leve en toda la base).
- WhatsApp integrado en 10/15; formulario de contacto de la landing con copy de "asesor confiable" (`index.html:2279-2281,2322`).
- Tooltips de pricing explican términos simples ("hosting", `index.html:1559`) — cumple "cercanía > tecnicismo" (L.21).

**Oportunidades**
- Corregir tema oscuro por defecto para alinearse a "cercano y cálido" (L.40).
- Cerrar gaps de `og:image` (6 demos) y WhatsApp (5 demos) para reforzar presencia/compartido.
- Compilar Tailwind para cumplir la promesa de velocidad y subir Core Web Vitals.

**Debilidades**
- `index.html:50` + 3 demos cargan `cdn.tailwindcss.com` → ~3 MB JS, estilos en cliente, LCP lento. Contradice la promesa "Carga ultra rápida (menos de 1 seg)" (`index.html:1154`).
- `og:image` ausente en 6 demos → mal compartido social.
- Sobrecarga antes del cierre: 9 tarjetas de demo + servicios densos (contrario a "tecnología que no interrumpe", L.22).

**Amenazas**
- Velocidad degradada pierde posición en Google (el feel pide "aparecer cuando busquen", L.24) y conversión.
- Promesas no verificables ("menos de 1 seg") erosionan la confianza que el feel busca construir (L.11).

---

## 3. Lo malo (defectos objetivos de implementación)

- **Tailwind CDN en producción**: `index.html:50`, `demo-agenda`, `demo-fonoaudiologia`, `demo-psicologa` (tabla §1, col. Tailwind CDN). No apto para producción.
- **`og:image` ausente en 6 demos**: `demo-agenda`, `demo-plan-premium`, `demo-plan-profesional`, `demo-propuesta-atencion-ordenada`, `demo-propuesta-empezar-simple`, `demo-propuesta-impacto-comercial` (tabla §1, col. og:image = ✗).
- **Promesa falsa de velocidad**: `index.html:1154` "Carga ultra rápida (menos de 1 seg)" con Tailwind CDN activo.
- **WhatsApp ausente en 5 demos de venta/concepto**: `demo-ecommerce-tech`, `demo-propiedades`, y las 3 `demo-propuesta-*` (tabla §1, col. WhatsApp = ✗).
- **Archivo monolítico**: `index.html` de 2499 líneas (tabla §1) — difícil de mantener (contrario a regla de calidad del AGENTS.md).

---

## 4. Lo que NO cumple el documento (con evidencia)

1. **L.40 — Criterio "premium pero cercano / cálido":** la landing usa tema oscuro (Dracula) por defecto — `index.html:161` `color-scheme: dark;` y `index.html:2` `:class="darkMode ? ... "` (darkMode default true). Para el público objetivo (floristerías, talleres, adultos mayores) se siente "techy/frío". El `light-theme` cálido existe (`index.html:176`) pero queda en segundo plano.

2. **L.34 — Promesas grandilocuentes / no respaldadas:** `index.html:1154` "Carga ultra rápida (menos de 1 seg)" no se cumple con Tailwind CDN. `demo-propuesta-impacto-comercial:339` "máquina de venta" roza lo grandilocuente.

3. **L.34 — Marco de riesgo (borde):** `demo-contabilidad:1297` "Reducimos el riesgo de multas o revisiones en un 99.4%". Enmarcado como beneficio, pero usa lenguaje de riesgo/miedo explícito.

4. **L.22 — Tecnología que no interrumpe:** bloque de 9 tarjetas de demo + sección de servicios densa antes del CTA satura la atención antes del cierre.

**CORRECCIÓN respecto al reporte anterior:** la sección `#beneficios` de la landing **ya no usa narrativa de miedo/pérdida**. Estado actual verificado: `index.html:1023` "Cuando tu negocio se presenta mejor, la decisión se vuelve más simple"; `index.html:1037` "Te encuentran con claridad"; `index.html:1055` "El cliente llega con más seguridad". El único residuo leve es `index.html:1020` "¿Te suena familiar?". Las líneas citadas en el reporte previo (fear framing) fueron modificadas y ya no existen.

---

## 5. Lo mejorable (sin ser incumplimiento)

- **"Quién está detrás" llega tarde:** el feel (L.11) pide que el cliente entienda "rápido quién está detrás". El hero (`index.html:536-588`) no muestra rostro/persona; testimonios en `index.html:2037`.
- **Densidad de pricing:** 4 planes con tooltips extensos (`index.html:1475+`) puede abrumar; el feel pide "claridad sobre explicación extensa" (L.21).
- **Tema por defecto:** evaluar light cálido como default o acentos cálidos (terracota/dorado) en vez de neón.
- **Inconsistencia de stack:** 4 archivos usan Tailwind CDN, 11 usan CSS propio; falta estándar único.
- **Demos de propuesta** (`demo-propuesta-*`) sin `og:image` ni WhatsApp — aceptable por ser conceptuales, pero debilita presencia si se comparten.

---

## 6. Violaciones al documento (resumen ejecutivo)

| # | Artículo feel | Evidencia | Archivo(s) |
|---|---|---|---|
| 1 | L.40 cercano/cálido | `color-scheme: dark` (l.161), dark por defecto (l.2) | index.html |
| 2 | L.34 promesas grandilocuentes | "menos de 1 seg" (l.1154) | index.html |
| 3 | L.34 borde riesgo | "riesgo de multas 99.4%" (l.1297) | demo-contabilidad |
| 4 | L.34 borde grandilocuente | "máquina de venta" (l.339) | demo-propuesta-impacto-comercial |
| 5 | L.22 tecnología que no interrumpe | sobrecarga pre-cierre (9 demos + servicios) | index.html |

---

## 7. Sugerencias (acciones)

1. **Compilar Tailwind con purge** en `index.html` y las 3 demos CDN; cumple la promesa de velocidad y sube SEO/CWV.
2. **Agregar `og:image`** a las 6 demos faltantes.
3. **Agregar WhatsApp** a `demo-ecommerce-tech` y `demo-propiedades` (cierre de conversión).
4. **Reemplazar "menos de 1 segundo"** (`index.html:1154`) por copy honesta o medible.
5. **Suavizar copy de riesgo/promesa** en `demo-contabilidad:1297` e `impacto-comercial:339`.
6. **Evaluar tema claro cálido como default** o rebalancear acentos (L.40).
7. **Bloque "Quién soy / STAX" arriba del pliegue** con rostro o firma (`index.html`, tras el hero).
8. **Reducir fricción de cierre:** barra CTA flotante persistente en móvil + mostrar 4–6 demos destacadas en vez de 9.
9. **Cambiar "¿Te suena familiar?"** (`index.html:1020`) por entrada positiva para eliminar el último residuo de framing problema.
10. **Estandarizar stack CSS** de los 15 archivos para mantenibilidad.

---

## 8. RED TEAM — segunda pasada adversarial

Objetivo: atacar el análisis anterior, encontrar fallos reales que la primera pasada subestimó y señalar cegueras del propio método. No busca complacer el feel doc: busca romper el sitio.

### 8.1 Fallos críticos que la pasada 1 subestimó

**A. El contenido es invisible sin JavaScript — fallo de disponibilidad, no de estilo.**
`index.html:245` define `.reveal { opacity: 0; }` y solo el `IntersectionObserver` (l.2474) lo vuelve visible. No hay `<noscript>` (verificado: 0 coincidencias en los 15 archivos). Si el CDN de Tailwind/Alpine falla, se bloquea el JS, o el usuario tiene JS desactivado, **toda la página queda en opacidad 0 = pantalla en blanco**. Esto contradice directamente la regla A del AGENTS.md (navegación offline `file://`) y al feel "la tecnología sirve cuando no interrumpe" (L.22). Gravedad: ALTA.

**B. Contradicción offline real.**
La landing y 3 demos dependen de CDNs externos: Tailwind (`index.html:50`), Alpine (`index.html:58`), Google Fonts (`index.html:35`). En `file://` sin internet (el caso de uso que el AGENTS.md declara objetivo) no cargan estilos ni JS → página rota + contenido oculto (punto A). La promesa "100% autocontenida" del footer (`index.html:2439`) es **falsa**. Gravedad: ALTA.

**C. Trampa del formulario de contacto.**
`index.html:2332` abre WhatsApp con `window.open()` y `index.html:2333` fija `this.sent = true` incondicionalmente. Si el navegador bloquea el popup (común en móvil), el usuario ve "¡Mensaje enviado!" (`index.html:2371`) **pero WhatsApp nunca se abrió**. Pérdida silenciosa de leads. Gravedad: MEDIA-ALTA.

**D. Cero medición de conversión.**
No hay analytics, GTM, Pixel ni ningún evento de tracking (verificado: 0 coincidencias en los 15 archivos). El usuario pidió "aumentar la tasa de conversión", pero **no se puede medir nada**: no hay dato de visitas, clics en WhatsApp ni planes vistos (salvo `getMostViewedPlan()` local en `index.html:2329`, que no reporta a ningún lado). Mejorar lo que no se mide es imposible. Gravedad: ALTA (estratégica).

### 8.2 Riesgos de legitimidad y legal (el feel doc lo pide, el sitio lo falla)

**E. Señales de seriedad ausentes / contradictorias.**
El feel (L.11) exige "señales visibles de seriedad". El sitio muestra:
- Email `@gmail.com` (`dev.n8n.stax@gmail.com`, 2 coincidencias) en vez de dominio propio.
- Un solo número WhatsApp hardcodeado en 14 archivos (`wa.me/56999040515`), sin entidad legal, RUT ni persona real con rostro en el hero (los testimonios están en `index.html:2037`, lejos).
- Testimonios con solo iniciales ("MC", "RP", "LV", `index.html:2058-2089`) y rubros genéricos → **leen como fabricados**. Si un cliente escéptico los verifica y no existen, la confianza que el feel busca construir se destruye. La pasada 1 los listó como fortaleza; el red team los lista como riesgo. Gravedad: MEDIA.

**F. Promesas con riesgo legal en Chile.**
`demo-contabilidad:1297` afirma "Reducimos el riesgo de multas o revisiones en un 99.4%". Cifra sin sustento y referida a tributario (SII) → puede constituir publicidad engañosa (Ley 19.496 / Sernac) y dar lugar a reclamos. Gravedad: MEDIA (legal).

**G. Sin política de privacidad ni manejo de datos.**
El formulario recopila nombre, teléfono y negocio (`index.html:2338-2351`) y el demo `premium` persiste datos en `localStorage` (`demo-plan-premium:1896-1972`). No hay aviso de privacidad ni base legal para el tratamiento de datos personales (Ley 19.628). Para un público chileno "desconfiado" (L.11) es un hueco de cumplimiento. Gravedad: MEDIA.

### 8.3 Cegueiras de la pasada 1 (autocrítica)

- **Sobre-pesó el cumplimiento del feel doc y sub-pesó la ingeniería real.** El feel doc es subjetivo ("premium pero cercano"); declarar "cumple/no cumple" fue demasiado determinista. La disponibilidad (punto A/B) es objetiva y más grave, y quedó como "mejorable".
- **Alabó testimonios sin verificar identidad** (punto E).
- **No detectó el trampa de popup** (punto C) pese a leer el formulario.
- **No notó la ausencia total de analytics** (punto D), siendo el eje de la petición del usuario.

### 8.4 Veredicto adversarial

El sitio es visualmente fuerte y cumple bien la identidad de marca, pero **tiene un fallo estructural de disponibilidad (JS-dependent, offline-roto) y cero instrumentación de conversión**. Para el objetivo real del usuario —subir la tasa de conversión— los 3 bloqueos duros son: (1) pantalla en blanco si falla JS/CDN, (2) leads perdidos por el popup bloqueado, (3) imposibilidad de medir nada. El feel doc es secundario frente a estos.

### 8.5 Acciones red team (priorizadas)

1. **Fallback sin-JS:** agregar `<noscript>` y regla CSS `@media (scripting: none)` / clase `.no-js` que fuerce `opacity:1` en `.reveal`. Crítico.
2. **Offline real:** compilar Tailwind/Alpine a locales o incrustar; cumplir regla A del AGENTS.md y la promesa "autocontenida".
3. **Arreglar el formulario:** tras `window.open`, verificar `window.focus()` / redirigir la pestaña actual si el popup fue bloqueado; no marcar `sent=true` si no abrió.
4. **Instrumentar conversión:** GA4 + evento en clic de WhatsApp y envío de formulario; definir una métrica base antes de "mejorar".
5. **Legitimidad:** dominio propio para el email, persona/rostro real en el hero, y testimonios verificables (con permiso y datos reales) o quitarlos.
6. **Riesgo legal:** borrar la cifra "99.4%" de `demo-contabilidad:1297`.
7. **Privacidad:** añadir aviso de tratamiento de datos y enlace en footer.
