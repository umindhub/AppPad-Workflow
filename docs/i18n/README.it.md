# Mercato dei flussi di AppPad

[English](../../README.md) · [简体中文](README.zh-Hans.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Nederlands](README.nl.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md)

Flussi per il pannello dei flussi (⌘Spazio) di [AppPad](https://youmindhub.com/i/apppad), pubblicati da questo repository. Sfogliali su **[youmindhub.com/i/apppad/workflows](https://youmindhub.com/i/apppad/workflows)**.

## Inviare un flusso

Apri una pull request con una cartella in `workflows/<id>/`. Leggi prima [CONTRIBUTING](CONTRIBUTING.it.md); il formato di `workflow.json` è in [docs/FORMAT.md](../FORMAT.md) (in inglese).

## Come funziona l’installazione

Il pulsante Installa del sito apre `apppad://workflow/install?id=<id>`. Il link contiene solo l’id. AppPad scarica l’indice firmato di questo mercato, ne verifica la firma Ed25519, scarica il flusso, ne confronta lo SHA-256 con l’indice e ti mostra cosa fa e quali permessi chiede prima di aggiungerlo. Un link non può far scaricare ad AppPad nessun altro file.

Gli aggiornamenti funzionano allo stesso modo: «Cerca aggiornamenti dei flussi» confronta le versioni installate con l’indice firmato.

## Licenza

Non è open source. Ogni flusso appartiene al suo autore; inviandolo consenti a YouMindHub di ospitarlo e distribuirlo tramite il mercato, youmindhub.com e AppPad. Il resto del repository è © YouMindHub, all rights reserved. Fa fede il [LICENSE.md](../../LICENSE.md) in inglese.
