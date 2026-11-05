# Een workflow indienen

[English](../../CONTRIBUTING.md) · [简体中文](CONTRIBUTING.zh-Hans.md) · [繁體中文](CONTRIBUTING.zh-Hant.md) · [日本語](CONTRIBUTING.ja.md) · [한국어](CONTRIBUTING.ko.md) · [Nederlands](CONTRIBUTING.nl.md) · [Deutsch](CONTRIBUTING.de.md) · [Español](CONTRIBUTING.es.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md)

Iedereen kan met een pull request een workflow publiceren in de AppPad Workflowmarkt. Elke inzending wordt automatisch gecontroleerd en daarna door een mens gelezen voordat hij online komt.

## 1. Schrijf en test hem in AppPad

Maak de workflow in AppPad (Instellingen › Workflows, of vraag een AI-assistent via de MCP-server van AppPad), voer hem uit en exporteer hem als JSON. Het formaat staat in [docs/FORMAT.md](../FORMAT.md) (Engels).

Kies een `id` onder een reverse-DNS-voorvoegsel dat van jou is, bijvoorbeeld `io.github.jouwnaam.diskfree`. `com.youmindhub.*` is gereserveerd.

## 2. Voeg een map toe

```
workflows/<id>/
  workflow.json   verplicht — de geëxporteerde workflow (één object, geen array)
  market.json     verplicht — vermeldingsgegevens, zie hieronder
  icon.png        optioneel — vierkante PNG, 512×512 aanbevolen, maximaal 512 KB
```

De mapnaam moet gelijk zijn aan de `id` van de workflow. Andere bestanden zijn niet toegestaan.

Verwijder `icon` / `iconURL` uit `workflow.json` voordat je indient; de markt levert `icon.png` en vult `iconURL` zelf in. Zonder pictogram tekent AppPad er een op basis van `symbol`.

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

| Veld | |
|---|---|
| `maintainers` | **Verplicht.** GitHub-gebruikersnamen die deze workflow mogen bijwerken of verwijderen. Die van jou moet erbij staan. |
| `author.name` | **Verplicht.** Wordt getoond in de markt en in AppPad. `author.url` (https) is optioneel. |
| `categories` | **Verplicht**, 1–3, de hoofdcategorie eerst: `productivity`, `system`, `developer`, `files`, `text`, `web`, `network`, `media`, `communication`, `design`, `ai`, `other`. |
| `apps` | Apps waarmee hij werkt, maximaal 10, met de naam die mensen kennen (`Finder`, `Safari`, `Photoshop`). Wordt op de pagina getoond en gebruikt voor zoeken en het app-filter. |
| `tags` | Maximaal 8 zoekwoorden in het Engels: kleine letters `a–z`, `0–9`, `-`, elk maximaal 24 tekens. Vertalingen staan onder `localizations`. |
| `example` | Wat je in het workflowpaneel typt, bijvoorbeeld `timer 10`. |
| `localizations` | Optioneel, per taal (`zh-Hans`, `zh-Hant`, `ja`, `ko`, `nl`, `de`, `es`, `fr`, `it`): `apps` en `tags` koppelen elke Engelse naam aan de vertaling. Wat ontbreekt, wordt in het Engels getoond. Categorienamen vertaalt de markt zelf. |

De zoekfunctie van de markt doorzoekt ook de naam, beschrijving en `keywords` van de workflow in elke vertaalde taal, dus tags hoeven alleen aan te vullen wat daar nog niet staat.

## 3. Open een pull request

Eén workflow per pull request. De controle vertelt wat je moet aanpassen: formaat, inhoud van de map, of je maintainer bent en of `version` omhoog is gegaan. Ook staan de rechten erbij die de reviewer moet goedkeuren.

## Bijwerken

Pas de bestanden aan, verhoog `version` in `workflow.json` (boven de gepubliceerde versie) en open een pull request. Alleen de maintainers in de gepubliceerde `market.json` kunnen dit. 'Controleer op workflowupdates' in AppPad biedt de nieuwe versie aan iedereen aan die hem heeft geïnstalleerd; vraagt hij om nieuwe rechten, dan vraagt AppPad het de gebruiker opnieuw.

## Waarom een workflow wordt afgewezen

- Rechten die hij niet nodig heeft, of geen uitleg bij de rechten die hij vraagt.
- Code die verhuld of geminificeerd is, of tijdens het uitvoeren wordt gedownload en gestart (`curl … | sh`).
- Iets verzamelen of versturen waar de gebruiker niet om heeft gevraagd.
- Zelf opdrachten in Terminal uitvoeren. `prefillTerminal` mag: de gebruiker drukt op Return.
- Alles wat onder 'Not allowed' in [LICENSE.md](../../LICENSE.md) staat.

Door in te dienen ga je akkoord met [LICENSE.md](../../LICENSE.md) (de Engelse tekst is bindend): het auteursrecht blijft bij jou, en YouMindHub mag je workflow hosten en verspreiden via de markt, youmindhub.com en AppPad.
