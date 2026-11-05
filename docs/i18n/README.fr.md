# Marché des flux AppPad

[English](../../README.md) · [简体中文](README.zh-Hans.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Nederlands](README.nl.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md)

Des flux pour le panneau des flux (⌘Espace) d’[AppPad](https://youmindhub.com/i/apppad), publiés depuis ce dépôt. À parcourir sur **[youmindhub.com/i/apppad/workflows](https://youmindhub.com/i/apppad/workflows)**.

## Proposer un flux

Ouvrez une pull request avec un dossier dans `workflows/<id>/`. Lisez d’abord [CONTRIBUTING](CONTRIBUTING.fr.md) ; le format de `workflow.json` est décrit dans [docs/FORMAT.md](../FORMAT.md) (en anglais).

## Comment fonctionne l’installation

Le bouton Installer du site ouvre `apppad://workflow/install?id=<id>`. Le lien ne contient que l’identifiant. AppPad télécharge l’index signé de ce marché, vérifie sa signature Ed25519, télécharge le flux, vérifie son SHA-256 par rapport à l’index, puis vous montre ce qu’il fait et les autorisations qu’il demande avant de l’ajouter. Un lien ne peut pas faire télécharger un autre fichier à AppPad.

Les mises à jour fonctionnent de la même façon : « Rechercher des mises à jour des flux » compare les versions installées à l’index signé.

## Licence

Ce n’est pas un logiciel libre. Chaque flux appartient à son auteur ; en le proposant, vous autorisez YouMindHub à l’héberger et à le distribuer via le marché, youmindhub.com et AppPad. Le reste du dépôt est © YouMindHub, all rights reserved. Seul le [LICENSE.md](../../LICENSE.md) en anglais fait foi.
