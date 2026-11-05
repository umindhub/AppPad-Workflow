# AppPad Workflowmarkt

[English](../../README.md) · [简体中文](README.zh-Hans.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Nederlands](README.nl.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md)

Workflows voor het workflowpaneel (⌘Spatie) van [AppPad](https://youmindhub.com/i/apppad), gepubliceerd vanuit deze repository. Bekijk ze op **[youmindhub.com/i/apppad/workflows](https://youmindhub.com/i/apppad/workflows)**.

## Een workflow indienen

Open een pull request met één map in `workflows/<id>/`. Lees eerst [CONTRIBUTING](CONTRIBUTING.nl.md); het formaat van `workflow.json` staat in [docs/FORMAT.md](../FORMAT.md) (Engels).

## Hoe installeren werkt

De installatieknop op de website opent `apppad://workflow/install?id=<id>`. De link bevat alleen de id. AppPad downloadt de ondertekende index van deze markt, controleert de Ed25519-handtekening, downloadt de workflow, controleert de SHA-256 tegen de index en laat zien wat hij doet en om welke rechten hij vraagt voordat hij wordt toegevoegd. Een link kan AppPad niet naar een ander bestand sturen.

Updates werken hetzelfde: 'Controleer op workflowupdates' vergelijkt de geïnstalleerde versies met de ondertekende index.

## Licentie

Geen open source. Elke workflow is van de auteur; door in te dienen geef je YouMindHub toestemming om hem via de markt, youmindhub.com en AppPad te hosten en te verspreiden. De rest van deze repository is © YouMindHub, all rights reserved. De Engelse [LICENSE.md](../../LICENSE.md) is bindend.
