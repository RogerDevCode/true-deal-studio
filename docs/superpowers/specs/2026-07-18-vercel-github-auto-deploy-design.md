# Diseño: despliegue automático de GitHub a Vercel

**Estado:** aprobado para revisión antes de implementación.

## Objetivo

Dejar el proyecto preparado para que la integración nativa de Vercel con GitHub publique automáticamente la rama `main` a producción y genere una Preview URL para cada pull request.

## Enfoque

Se usará la integración nativa GitHub–Vercel. Vercel detecta el sitio estático desde la raíz del repositorio y utiliza el `vercel.json` existente para rutas, caché y cabeceras. La vinculación inicial se realiza una vez desde el Dashboard de Vercel por la cuenta propietaria; esa autorización externa no se almacena como archivo ni secreto en Git.

No se agregará una GitHub Action de despliegue ni tokens `VERCEL_*`. El workflow existente de QA permanece como control técnico independiente antes de fusionar cambios a `main`.

## Archivos

- `vercel.json`: conservar como configuración de hosting estático, redirects y cabeceras de seguridad.
- `.vercelignore`: conservar como filtro de archivos de desarrollo y documentación que no deben subirse al artefacto de producción.
- `README.md`: agregar una sección de despliegue con los pasos concretos para importar el repositorio, confirmar los ajustes estáticos y conectar producción con `main`.

## Flujo operativo

1. La cuenta propietaria importa `RogerDevCode/true-deal-studio` desde el Dashboard de Vercel.
2. Vercel detecta `index.html` en la raíz. No requiere Build Command ni Output Directory.
3. Vercel configura `main` como Production Branch.
4. Cada push a `main` crea un deployment de producción.
5. Cada pull request crea una Preview URL; la revisión y los checks de GitHub Actions ayudan a decidir si se fusiona.

## Límites

- El enlace entre la cuenta de Vercel y GitHub requiere autorización de la persona propietaria y se completa fuera del repositorio.
- No se añaden credenciales, variables de entorno ni scripts de despliegue al código.
- No se modifica el flujo offline `file://` ni el contenido de las demos.

## Validación

- `vercel.json` debe ser JSON válido.
- `.vercelignore` debe continuar excluyendo documentación, pruebas y dependencias de desarrollo.
- El README debe indicar la configuración de Framework Preset, Build Command, Output Directory y Production Branch.
- Tras conectar el repositorio en Vercel, un push a `main` debe mostrar estado `Ready` en producción y una pull request debe entregar una Preview URL.
