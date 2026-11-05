# AppPad Workflow-Markt

[English](../../README.md) · [简体中文](README.zh-Hans.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Nederlands](README.nl.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md)

Workflows für das Workflow-Panel (⌘Leertaste) von [AppPad](https://youmindhub.com/i/apppad), veröffentlicht aus diesem Repository. Zu finden unter **[youmindhub.com/i/apppad/workflows](https://youmindhub.com/i/apppad/workflows)**.

## Einen Workflow einreichen

Öffne einen Pull Request mit einem Ordner in `workflows/<id>/`. Lies zuerst [CONTRIBUTING](CONTRIBUTING.de.md); das Format von `workflow.json` steht in [docs/FORMAT.md](../FORMAT.md) (Englisch).

## So funktioniert die Installation

Der Installieren-Knopf auf der Website öffnet `apppad://workflow/install?id=<id>`. Der Link enthält nur die ID. AppPad lädt den signierten Index dieses Markts, prüft die Ed25519-Signatur, lädt den Workflow, prüft seinen SHA-256 gegen den Index und zeigt vor dem Hinzufügen, was er tut und welche Berechtigungen er braucht. Ein Link kann AppPad auf keine andere Datei verweisen.

Updates funktionieren genauso: „Workflow-Updates prüfen“ vergleicht die installierten Versionen mit dem signierten Index.

## Lizenz

Kein Open Source. Jeder Workflow gehört seinem Autor; mit der Einreichung erlaubst du YouMindHub, ihn über den Markt, youmindhub.com und AppPad bereitzustellen und zu verbreiten. Alles andere in diesem Repository ist © YouMindHub, all rights reserved. Verbindlich ist die englische [LICENSE.md](../../LICENSE.md).
