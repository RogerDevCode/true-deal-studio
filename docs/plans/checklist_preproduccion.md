# Checklist de Preproducción

Usa esta lista como visto bueno final antes de publicar `web_promotion` a producción.

## 1. Pruebas automatizadas

- [ ] Ejecuté `node test_root.js`
- [ ] Ejecuté `node test_cafe.js`
- [ ] Ejecuté `node test_salon.js`
- [ ] Ejecuté `node test_artesanias.js`
- [ ] Ejecuté `node test_contabilidad.js`
- [ ] Todos los scripts terminaron sin errores

## 2. Consola y red

- [ ] Ejecuté `node check_consoles.js`
- [ ] No hay errores JavaScript
- [ ] No hay warnings relevantes de Alpine.js
- [ ] No falta el plugin de `x-collapse` donde se usa
- [ ] No hay requests fallidos de imagenes, fuentes o scripts
- [ ] No hay errores 404 por favicon

## 3. Navegacion offline `file://`

- [ ] Abrí `index.html` con doble clic, sin servidor
- [ ] Los links entre demos apuntan a `./demo-x/index.html` o `../index.html`
- [ ] Se puede entrar y volver desde todas las demos
- [ ] No hay links rotos por depender de resolucion de carpetas
- [ ] Fuentes, imagenes y JS cargan correctamente en modo local

## 4. Formularios y modales

- [ ] Los modales abren y cierran sin errores
- [ ] Al cerrar un modal, el formulario queda 100% limpio
- [ ] Al cancelar un modal, el formulario queda 100% limpio
- [ ] Al enviar un formulario, el formulario queda 100% limpio
- [ ] No quedan selecciones previas ni datos cacheados
- [ ] En modalidades de atencion, despacho o reserva, `Presencial` aparece primero
- [ ] `Presencial` queda seleccionado por defecto donde aplica

## 5. SEO base

- [ ] Todas las paginas tienen `lang="es-CL"`
- [ ] Cada pagina tiene exactamente un `<h1>`
- [ ] Cada pagina tiene `og:title`
- [ ] Cada pagina tiene `og:description`
- [ ] Cada pagina tiene `og:image`
- [ ] Cada pagina tiene `og:type`
- [ ] Cada pagina tiene `twitter:card` con `summary_large_image`
- [ ] Las paginas principales tienen `application/ld+json` correcto segun el tipo de negocio

## 6. Accesibilidad y calidad visual

- [ ] Se puede navegar sin bloqueos evidentes con teclado
- [ ] Los textos principales tienen contraste suficiente
- [ ] No hay contenido importante oculto permanentemente por `x-cloak`
- [ ] No hay animaciones que rompan la lectura o la interaccion
- [ ] La landing se ve bien en escritorio
- [ ] La landing se ve bien en movil
- [ ] Las demos principales se ven bien en movil
- [ ] Las demos principales se ven bien en escritorio

## 7. Contenido y negocio

- [ ] Los nombres, textos y CTAs estan correctos
- [ ] No hay texto placeholder o incompleto
- [ ] Los links de contacto o WhatsApp funcionan
- [ ] Los datos demo son coherentes y no confunden con produccion real
- [ ] `voiceshop-pro.zip` no esta enlazado en ninguna parte
- [ ] Las demos nuevas no rompen la propuesta comercial principal

## 8. Mapas e integraciones

- [ ] Los iframes de Google Maps cargan correctamente
- [ ] La URL `pb` usa separadores `!` y no `|`
- [ ] No hay embeds rechazados por formato invalido

## 9. Codigo y estructura

- [ ] No se introdujo `!important` fuera de excepciones permitidas
- [ ] No quedaron archivos temporales innecesarios
- [ ] Scripts auxiliares de un solo uso fueron eliminados
- [ ] La documentacion nueva, si existe, quedo en `docs/`
- [ ] No se modifico SkillOS ni rutas externas por error

## 10. Validacion final de release

- [ ] Probé `index.html` completo de punta a punta
- [ ] Revisé al menos una vez cada demo enlazada desde la landing
- [ ] Confirmé que el deploy o hosting estatico conserva las rutas relativas
- [ ] El estado final del repo esta identificado para release
- [ ] El sitio esta listo para aprobacion final

## Criterio de salida

- Aprobado para produccion: todos los puntos criticos en verde.
- No aprobado: cualquier fallo en `check_consoles.js`, navegacion `file://`, formularios, links o assets.
