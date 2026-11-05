# Mercado de flujos de AppPad

[English](../../README.md) · [简体中文](README.zh-Hans.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Nederlands](README.nl.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md)

Flujos de trabajo para el panel de flujos (⌘Espacio) de [AppPad](https://youmindhub.com/i/apppad), publicados desde este repositorio. Explóralos en **[youmindhub.com/i/apppad/workflows](https://youmindhub.com/i/apppad/workflows)**.

## Enviar un flujo

Abre una pull request con una carpeta en `workflows/<id>/`. Lee primero [CONTRIBUTING](CONTRIBUTING.es.md); el formato de `workflow.json` está en [docs/FORMAT.md](../FORMAT.md) (en inglés).

## Cómo funciona la instalación

El botón Instalar de la web abre `apppad://workflow/install?id=<id>`. El enlace solo lleva el id. AppPad descarga el índice firmado de este mercado, comprueba su firma Ed25519, descarga el flujo, comprueba su SHA-256 con el índice y te muestra qué hace y qué permisos pide antes de añadirlo. Un enlace no puede hacer que AppPad descargue ningún otro archivo.

Las actualizaciones funcionan igual: «Buscar actualizaciones de flujos» compara las versiones instaladas con el índice firmado.

## Licencia

No es código abierto. Cada flujo pertenece a su autor; al enviarlo permites que YouMindHub lo aloje y distribuya a través del mercado, youmindhub.com y AppPad. El resto del repositorio es © YouMindHub, all rights reserved. El texto vinculante es el [LICENSE.md](../../LICENSE.md) en inglés.
