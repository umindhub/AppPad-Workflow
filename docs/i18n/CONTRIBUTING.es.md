# Enviar un flujo

[English](../../CONTRIBUTING.md) · [简体中文](CONTRIBUTING.zh-Hans.md) · [繁體中文](CONTRIBUTING.zh-Hant.md) · [日本語](CONTRIBUTING.ja.md) · [한국어](CONTRIBUTING.ko.md) · [Nederlands](CONTRIBUTING.nl.md) · [Deutsch](CONTRIBUTING.de.md) · [Español](CONTRIBUTING.es.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md)

Cualquiera puede publicar un flujo en el Mercado de flujos de AppPad con una pull request. Cada envío se revisa automáticamente y luego lo lee una persona antes de publicarse.

## 1. Créalo y pruébalo en AppPad

Crea el flujo en AppPad (Ajustes › Flujos, o pide a un asistente de IA a través del servidor MCP de AppPad), ejecútalo y expórtalo como JSON. El formato está en [docs/FORMAT.md](../FORMAT.md) (en inglés).

Elige un `id` con un prefijo de dominio inverso que controles, por ejemplo `io.github.tunombre.diskfree`. `com.youmindhub.*` está reservado.

## 2. Añade una carpeta

```
workflows/<id>/
  workflow.json   obligatorio — el flujo exportado (un objeto, no un array)
  market.json     obligatorio — datos de la ficha, ver abajo
  icon.png        opcional — PNG cuadrado, 512×512 recomendado, 512 KB como máximo
```

El nombre de la carpeta debe ser igual al `id` del flujo. No se permiten otros archivos.

Quita `icon` / `iconURL` de `workflow.json` antes de enviarlo; el mercado sirve `icon.png` y rellena `iconURL` por ti. Sin icono, AppPad dibuja uno a partir de `symbol`.

### market.json

```json
{
  "maintainers": ["your-github-username"],
  "author": { "name": "Your Name", "url": "https://your.site" },
  "categories": ["files", "productivity"],
  "apps": ["Finder"],
  "tags": ["path", "copy"],
  "example": "path",
  "localizations": {
    "zh-Hans": { "apps": { "Finder": "访达" }, "tags": { "path": "路径", "copy": "复制" } },
    "ja": { "tags": { "path": "パス", "copy": "コピー" } }
  }
}
```

| Campo | |
|---|---|
| `maintainers` | **Obligatorio.** Usuarios de GitHub que pueden actualizar o retirar este flujo. El tuyo debe estar incluido. |
| `author.name` | **Obligatorio.** Se muestra en el mercado y en AppPad. `author.url` (https) es opcional. |
| `categories` | **Obligatorio**, de 1 a 3, la principal primero: `productivity`, `system`, `developer`, `files`, `text`, `web`, `network`, `media`, `communication`, `design`, `ai`, `other`. |
| `apps` | Apps con las que funciona, hasta 10, con el nombre que todo el mundo conoce (`Finder`, `Safari`, `Photoshop`). Se muestran en la página y sirven para la búsqueda y el filtro por app. |
| `tags` | Hasta 8 palabras de búsqueda en inglés: minúsculas `a–z`, `0–9`, `-`, como máximo 24 caracteres cada una. Las traducciones van en `localizations`. |
| `example` | Lo que se escribe en el panel de flujos, por ejemplo `timer 10`. |
| `localizations` | Opcional, por idioma (`zh-Hans`, `zh-Hant`, `ja`, `ko`, `nl`, `de`, `es`, `fr`, `it`): `apps` y `tags` asignan a cada nombre en inglés su traducción. Lo que falte se muestra en inglés. Los nombres de las categorías los traduce el mercado. |

La búsqueda del mercado también incluye el nombre, la descripción y las `keywords` del flujo en cada idioma al que esté traducido, así que las etiquetas solo tienen que añadir lo que ahí no aparece.

## 3. Abre una pull request

Un flujo por pull request. La comprobación te dice qué corregir: formato, contenido de la carpeta, si eres maintainer y si `version` ha subido. También enumera los permisos que el revisor tiene que aprobar.

## Actualizar

Cambia los archivos, sube `version` en `workflow.json` (por encima de la publicada) y abre una pull request. Solo pueden hacerlo los maintainers del `market.json` publicado. «Buscar actualizaciones de flujos» de AppPad ofrece la nueva versión a todos los que lo instalaron; si pide permisos nuevos, AppPad vuelve a preguntar al usuario.

## Motivos de rechazo

- Permisos que no necesita, o sin explicar los que pide.
- Código ofuscado, minificado, o que se descarga y ejecuta al momento (`curl … | sh`).
- Recopilar o enviar cualquier cosa que el usuario no haya pedido.
- Ejecutar comandos en Terminal por su cuenta. `prefillTerminal` está bien: el usuario pulsa Retorno.
- Cualquier cosa de la lista «Not allowed» de [LICENSE.md](../../LICENSE.md).

Al enviarlo aceptas [LICENSE.md](../../LICENSE.md) (el texto en inglés es el vinculante): los derechos de autor siguen siendo tuyos, y YouMindHub puede alojar y distribuir tu flujo a través del mercado, youmindhub.com y AppPad.
