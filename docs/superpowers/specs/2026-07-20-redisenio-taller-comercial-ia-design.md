# Rediseño STAX: taller comercial chileno e IA con criterio

**Estado:** diseño aprobado para revisión antes de planificación e implementación.

## Objetivo

Reposicionar la landing de STAX para que una PYME chilena la perciba como una asesoría comercial cercana y seria, no como una empresa tecnológica. El diseño debe comunicar orden, claridad y trabajo aplicado al negocio real.

## Público y posición

- Negocios chilenos que venden en local, por delivery, reserva, catálogo o WhatsApp.
- Atención desde Biobío para negocios de todo Chile.
- La marca visible permanece como **STAX**, sin dominio público mostrado hasta que exista una decisión explícita de dominio.
- No se atribuyen clientes, resultados, oficinas, equipo ni testimonios inexistentes.

## Dirección visual: taller comercial chileno

### Sensación buscada

La página debe sentirse como una libreta de trabajo bien preparada: alguien escuchó el negocio, ordenó los datos y mostró un camino claro. Debe alejarse de neón, efectos gamer, estética de programador y metáforas de producto tecnológico.

### Sistema de fondo

La trama base se denomina **cuaderno de negocio**:

1. Fondo marfil cálido como papel de cotización.
2. Retícula tenue en azul grisáceo, visible solo a corta distancia y sin competir con el texto.
3. Acentos terracota o rojo profundo equivalentes a una marca de lápiz o timbre, reservados para acciones y énfasis puntuales.
4. Bandas oscuras con textura de tinta o papel prensado, sin brillos, neón ni degradados llamativos.
5. No usar mapas de Chile, símbolos regionales literales ni recursos que acoten el alcance nacional.

### Paleta y componentes

- Marfil y blanco cálido para los bloques principales.
- Azul profundo para estructura, títulos y bandas de confianza.
- Terracota para una acción principal o una advertencia relevante, no como color decorativo general.
- Verde reservado para WhatsApp y estados de avance.
- Tarjetas con bordes finos, sombras suaves y radios moderados; no paneles translúcidos de apariencia tecnológica.
- Tipografía con jerarquía editorial legible y medidas amplias para celular.

## Identidad y cercanía

La marca debe incorporar de manera visible y sobria:

> **Atención desde Biobío para negocios de todo Chile.**

La frase acompaña a STAX sin reemplazarla y sin inventar dirección, rostro, oficina ni equipo. Se mantiene WhatsApp como canal principal.

## IA: herramienta de apoyo, criterio humano visible

La IA deja de ser una sección tecnológica autónoma. Su explicación se integra como una demostración de trabajo aplicado:

> **La herramienta acelera. STAX se hace cargo del criterio.**

La sección presenta cuatro acciones humanas y verificables:

1. **Escuchamos cómo atiendes:** identificar preguntas repetidas, datos faltantes y el orden de información útil.
2. **Ordenamos tu información:** convertir servicios, valores, horarios y condiciones en mensajes claros.
3. **Revisamos que funcione de verdad:** comprobar lectura móvil, botones, contacto y pasos de reserva o pedido.
4. **Te entregamos control:** dominio, contenidos y accesos quedan organizados para el negocio.

La IA puede mencionarse como apoyo para acelerar borradores y tareas, pero no como razón de compra, promesa ni sustituto del criterio, adaptación, publicación y revisión humana.

## Recorrido propuesto

1. Hero claro con la nueva dirección visual y referencia nacional desde Biobío.
2. Necesidades de atención y ejemplos, ya existentes, dentro de fondos cálidos y ordenados.
3. Proceso de trabajo con menos efectos y más sensación de avance revisable.
4. Bloque de criterio humano frente a herramientas automáticas.
5. Planes, preguntas y contacto con la misma jerarquía sobria.

## Restricciones

- Mantener recursos locales y compatibilidad con `file://`.
- No agregar CDN, fuentes remotas ni dependencias.
- Conservar un solo `h1`, SEO, accesibilidad, foco visible y `prefers-reduced-motion`.
- No modificar rutas de demos, formularios, enlaces de WhatsApp ni sus validaciones sin pruebas correspondientes.
- Evitar promesas de ventas, conversiones o resultados garantizados.
- Eliminar o reducir brillos y recursos que comuniquen estética tecnológica; no alterar el comportamiento de tema sin validación visual en ambos temas.

## Validación

- Playwright confirma el nuevo bloque de cercanía, la sección de criterio humano y los textos críticos.
- Capturas de escritorio y móvil verifican contraste, lectura, ausencia de overflow y reducción visible de brillo.
- `npm run qa:gate` debe terminar en `PASS` antes de aprobar despliegue.
