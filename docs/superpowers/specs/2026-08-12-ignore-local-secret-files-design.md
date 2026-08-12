# Ignorar archivos locales de secretos

## Objetivo

Evitar que Git proponga para commit archivos locales llamados `.secrets`, sin ocultar archivos de configuración legítimos ya versionados.

## Alcance

Se añadirán estas reglas a `.gitignore`:

```gitignore
# Local secret files
.secrets
.secrets.*
!.secrets.example
```

También se ignorará `.ipynb_checkpoints/`, un artefacto local generado por Jupyter.

## Reglas y límites

- `.secrets` y variantes como `.secrets.local` no se podrán añadir por accidente.
- `.secrets.example` continuará permitida como plantilla sin valores reales.
- No se usará una regla global `.*`: debe continuar el seguimiento de `.gitignore`, `.github`, `.dockerignore`, `.nvmrc`, `.vercelignore` y otros archivos ocultos legítimos.
- No se alterarán archivos ya versionados ni se eliminarán archivos locales existentes.

## Verificación

`git check-ignore -v .secrets .secrets.local .secrets.example .ipynb_checkpoints/` debe demostrar que los dos primeros y el directorio están ignorados, mientras `.secrets.example` no lo está.
